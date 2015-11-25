"use strict"
require("./signup.view.html");

export default class SingUpController {
    public static controllerId = "signupCtrl";
    public static $inject = [
        "authService",
        "$location",
        "serverMessageHandler"
    ];
    private error:any;
    private signinForm:any;
    private user:any = {};

    constructor(private authService:mts.IAuthService,
                private $location:ng.ILocationService, private serverMessageHandler:mts.IServerMessageHandler) {
    }

    private closeAlert():void {
        this.error = null;
    }

    private submit():void {
        if (this.signinForm.$valid) {
            this.authService.signUp(this.user)
                .then(()=> {
                    this.$location.path("/");
                }, (err:any)=> {
                    this.error = this.serverMessageHandler.handleMessage(err.data);
                });
        }
    }
}
