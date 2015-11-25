"use strict"
require("./signin.view.html");

export default class SingInController {
    public static controllerId = "signinCtrl";
    public static $inject = [
        "authService",
        "$location",
        "serverMessageHandler",
        "$window"
    ];
    private error:string;

    constructor(private authService:mts.IAuthService,
                private $location:ng.ILocationService,
                private serverMessageHandler:mts.IServerMessageHandler,
                private $window:ng.IWindowService) {
    }

    private user:any = {};

    /**
     * Submit sign in form.
     */
    private submit():void {
        this.authService.signIn(this.user.username, this.user.password)
            .then((res:any)=> {
                if (!!res) {
                    this.$location.path("/");
                }
            }, (err:any)=> {
                this.error = this.serverMessageHandler.handleMessage(err.data);
            });
    }

    private closeAlert():void {
        this.error = null;
    }

    /**
     * Sign in via github.
     */
    private gitHubSign():void {
        let url = "/auth/github";
        // if mobile open in the same tab
        let win = this.$window.open(url, "_blank");
        !win ? this.$window.open(url, "_self") : win.focus();
    }
}
