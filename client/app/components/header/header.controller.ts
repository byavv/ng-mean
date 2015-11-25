"use strict"
require("./header.view.html");

export default class HeaderController {
    public static controllerId: string = "headerCtrl";
    public static $inject: Array<string> = [
        "$timeout"
    ];
    private title: string;
    constructor(private $timeout: ng.ITimeoutService) {
        this.$timeout = $timeout;
        this.init();
    }
    /**
     * Initialize controller
     */
    private init(): void {
        this.title = "My App Title";
        this.$timeout(() => {
            this.title = "TimeOut changed";
        }, 3000);
    }
};
