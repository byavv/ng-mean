"use strict"
require("./forget.view.html");
export default class ForgetController {
    public static controllerId = "forgetCtrl";
    public static $inject = [
        "usersService",
        "serverMessageHandler"
    ];
    private email:string;
    private error:string;
    private info:string;

    constructor(private usersService:mts.IUsersService, private serverMessageHandler:mts.IServerMessageHandler) {

    }

    private submit():void {
        this.usersService.forgotPassword(this.email)
            .then((res:any):void => {
                this.info = this.serverMessageHandler.handleMessage(res.data);
            }, (err:any)=> {
                this.error = this.serverMessageHandler.handleMessage(err.data);
            });
    }

    private closeAlert():void {
        this.error = null;
        this.info = null;
    }
}
