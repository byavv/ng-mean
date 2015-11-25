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
        this.title = "Home controller";
        this.$timeout(() => {
            this.title = "TimeOut changed";
            this.myColor = this.colors[2];
        }, 3000);

        this.colors = [
            { name: "black", shade: "dark" },
            { name: "white", shade: "light", notAnOption: true },
            { name: "red", shade: "dark" },
            { name: "blue", shade: "dark", notAnOption: true },
            { name: "yellow", shade: "light'", notAnOption: false }
        ];
        this.colors = _.filter(this.colors, { shade: "dark" });
        this.colors.map((color: any) => {
            Object.defineProperty(color, "used", { value: "my" });
            return color;
        });
    }
}
