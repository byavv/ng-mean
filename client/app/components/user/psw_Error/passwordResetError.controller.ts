"use strict"
require("./passwordResetError.view.html");

export default class PasswordResetErrorController {
    public static controllerId = "psvErrorCtrl";
    public static $inject = [];
    private error: string;
    constructor() {
        this.error = "Token expired";
    }
}
