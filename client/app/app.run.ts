export function run ($rootScope: ng.IRootScopeService,
                     $location: ng.ILocationService,
                     $window: ng.IWindowService,
                     identityService: mts.IIdentityService):void {
    $rootScope.$on("$routeChangeError", (evt:any, current:any, prev:any, rejection:any):void => {
        if (rejection === "401") {
            $location.path("/signin");
        }
    });
    $rootScope.$on("$routeChangeStart", (event:any, next:any):void => {
        if (next.authorized !== undefined) {
            if (!next.authorized) {
                if (identityService.isAuthenticated()) {
                    $location.path("/");
                }
            } else {
                if (!identityService.isAuthenticated()) {
                    $location.path("/signin");
                }
            }
        } 
    });
    angular.extend($window, {
        app: {
            update: ():void => {
                identityService.update(true);
                $location.path("/");
            } 
        }
    });
    identityService.update(false);
}
run.$inject = ["$rootScope", "$location", "$window", "identityService", "authService"];



