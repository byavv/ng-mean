"use strict"

require("./profile.view.html");
export default class ProfileController {
    public static controllerId = "profileCtrl";
    public static $inject = ["usersService", "$scope", "$timeout", "serverMessageHandler"];
   
    private profile:any = null;
    private loading = false;
    private personalDataForm:ng.IFormController;   
    private info:any;
    private error:any;   
 
    constructor(private usersService:mts.IUsersService,                
                private $scope:ng.IScope,
                private $timeout:ng.ITimeoutService,
                private serverMessageHandler:mts.IServerMessageHandler) {      
                    if (!this.profile) {
                        this.loading = true;
                        this.usersService.getProfile().then((res:any)=> {
                            if (res) {                                
                                // slow it down a bit
                                this.$timeout(()=> {
                                    this.profile = res;
                                    this.loading = false
                                }, 500);
                            }
                        }, (err)=> {
                            this.showAlert(this.serverMessageHandler.handleMessage(err), true);
                            this.profile = null;
                            this.loading = false
                        }); 
                    }
    }

    private closeAlert():void {
        this.error = null;
        this.info = null;
    }

    private showAlert(message:string, error = false):void {
        if (error) {
            this.error = message;

        } else {
            this.info = message;
        }
        this.$timeout(()=> {
            this.closeAlert();
        }, 3000);
    }


    private submitPersonal():void {
        if (this.personalDataForm.$dirty) {
            this.loading = true;
            this.usersService.updateProfile(this.profile).then((res)=> {
                if (res.profile) {
                    // slow it down a bit
                    this.$timeout(()=> {
                        this.profile = res.profile;
                        this.loading = false;
                        this.showAlert(this.serverMessageHandler.handleMessage(res));
                    }, 500);
                    this.personalDataForm.$setPristine();
                }
            }, (err)=> {
                this.profile = null;
                this.loading = false;
                this.showAlert(this.serverMessageHandler.handleMessage(err.data), true);
            });
        }
    }   
}
