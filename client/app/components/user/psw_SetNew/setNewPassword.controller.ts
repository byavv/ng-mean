"use strict"
require("./setNewPassword.view.html");

export default class SetNewController {
    public static controllerId = "setNewCtrl";
    public static $inject = [
        "usersService",
        "serverMessageHandler",
        "$routeParams",
        "$timeout",
        "$location"
    ];
    private password:string;
    private error:string;
    private info:string;
    private setNewPasswordForm:ng.IFormController;

    constructor(private usersService:mts.IUsersService,
                private serverMessageHandler:mts.IServerMessageHandler,
                private $routeParams:any,
                private $timeout:ng.ITimeoutService,
                private $location:ng.ILocationService) {
    }

    private submit():void {
        if (this.setNewPasswordForm.$valid) {
            this.usersService.setNewPassword(this.password, this.$routeParams.token)
                .then((res:any):void=> {
                    this.info = this.serverMessageHandler.handleMessage(res.data);
                    this.$timeout(()=> {
                        this.$location.path("/signin");
                    }, 2000);
                }, (err:any):void=> {
                    this.error = this.serverMessageHandler.handleMessage(err.data);
                });
        }
    }

    private closeAlert():void {
        this.error = null;
        this.info = null;
    }
}