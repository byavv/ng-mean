"use strict"
require("./restricted.view.html");

export default class RestrictedController {
    public static controllerId = "restrictedCtrl";
    public static $inject = [
        "$timeout"
    ];

    constructor(private $timeout: ng.ITimeoutService) {
    }
}
