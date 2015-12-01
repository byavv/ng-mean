"use strict"
require("./setNewPassword.view.html");

export default class SetNewController {
    public static controllerId = "setNewCtrl";
    public static $inject = [
        "usersService",
        "serverMessageHandler",
        "$routeParams",
        "$timeout",
        "$state",
        "$stateParams"
    ];
    private password:string;
    private error:string;
    private info:string;
    private setNewPasswordForm:ng.IFormController;

    constructor(private usersService:mts.IUsersService,
                private serverMessageHandler:mts.IServerMessageHandler,
                private $routeParams:any,
                private $timeout:ng.ITimeoutService,
                private $state:ng.ui.IStateService, 
                private $stateParams: any) {
    }

    private submit():void {
        if (this.setNewPasswordForm.$valid) {
            this.usersService.setNewPassword(this.password, this.$stateParams.token)
                .then((res:any) => {                   
                    this.info = this.serverMessageHandler.handleMessage(res);
                    this.$timeout(()=> {
                        this.$state.go("signin");
                    }, 2000);
                }, (err:any):void=> {
                    this.error = this.serverMessageHandler.handleMessage(err);
                });
        }
    }

    private closeAlert():void {
        this.error = null;
        this.info = null;
    }
}
