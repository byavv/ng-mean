"use strict"
export default class AuthMenuController {
    public static controllerId:string = "authMenuCtrl";
    public static $inject:Array<string> = [
        "$location",
        "identityService",
        "authService"
    ];

    constructor(private $location:ng.ILocationService,
                private identityService:mts.IIdentityService,
                private authService:mts.IAuthService) {}

    private signOut():void {
        this.authService.signOut().then(()=> {
            this.$location.path("/");
        });
    }
};
