"use strict"
require("./account.view.html");
export default class AccountController {
    public static controllerId = "accountCtrl";
    public static $inject = ["usersService", "$scope", "$timeout", "serverMessageHandler"];

    private account: any = null;
    private loading = false;
    private changePasswordForm: ng.IFormController;
    private info: any;
    private error: any;


    constructor(private usersService: mts.IUsersService,
        private $scope: ng.IScope,
        private $timeout: ng.ITimeoutService,
        private serverMessageHandler: mts.IServerMessageHandler) {
        this.init();
    }
    private init() {        
        if (!this.account) {
            this.loading = true;
            this.usersService.getAccount().then((res: any) => {
                if (res) {
                    this.$timeout(() => {
                        this.account = res;
                        this.loading = false
                    }, 500);
                }
            }, (err) => {
                this.showAlert(this.serverMessageHandler.handleMessage(err), true);
                this.account = null;
                this.loading = false
            });
        }
    }

    private closeAlert(): void {
        this.error = null;
        this.info = null;
    }

    private showAlert(message: string, error = false): void {
        if (error) {
            this.error = message;

        } else {
            this.info = message;
        }
        this.$timeout(() => {
            this.closeAlert();
        }, 3000);
    }

    private submitPassword(): void {
        if (this.changePasswordForm.$valid && this.changePasswordForm.$dirty) {
            this.loading = true;
            this.usersService.changePassword(this.account).then((res) => {
                this.$timeout(() => {
                    this.showAlert(this.serverMessageHandler.handleMessage(res));
                    this.loading = false;
                    this.changePasswordForm.$setPristine();
                    this.account.password = this.account.oldpassword = null;
                }, 500);

            }, (err) => {
                this.showAlert(this.serverMessageHandler.handleMessage(err.data), true);
                this.loading = false
            });
        }
    }
}
