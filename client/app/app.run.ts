export function run($rootScope: ng.IRootScopeService,
    $state: ng.ui.IStateService,
    $window: ng.IWindowService,
    identityService: mts.IIdentityService): void {
    $rootScope.$on("$stateChangeError", (event, toState, toParams, fromState, fromParams, error): void => {        
        if (error == 401) {
            $state.go("signin");
        }
    });
    
    //check route data and if it's protected, check user autho
    $rootScope.$on("$stateChangeStart", (event: any, toState: ng.ui.IState, toParams, fromState: ng.ui.IState, fromParams): void => {
        if (toState.data && toState.data.authenticatedOnly !== undefined) {
            if (!toState.data.authenticatedOnly) {
                if (identityService.isAuthenticated()) {
                    event.preventDefault();
                    $state.go("home");
                }
            } else {               
                if (!identityService.isAuthenticated()) {
                    event.preventDefault();
                    $state.go("signin");
                }
            }
        }
    });
    angular.extend($window, {
        app: {
            update: (): void => {
                identityService.update(true);
                $state.go("home");
            }
        }
    });
    identityService.update(false);
}
run.$inject = ["$rootScope", "$state", "$window", "identityService", "authService"];



