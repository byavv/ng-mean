"use strict"
require("./home.view.html");

export default class HomeController {
    public static controllerId = "homeCtrl";
    public static $inject = [
        "$timeout"
    ];
    private colors: Array<any>;
    private myColor: any;
    private title: string;
    constructor(private $timeout: ng.ITimeoutService) {
        this.init();
    }

    /**
     * Initialize controller
     */
    private init(): void {
       
    }
}
