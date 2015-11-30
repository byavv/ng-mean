export function run($rootScope: ng.IRootScopeService,
    $state: ng.ui.IStateService,
    $window: ng.IWindowService,
    identityService: mts.IIdentityService): void {
    $rootScope.$on("$stateChangeError", (evt: any, current: any, prev: any, rejection: any): void => {
        if (rejection === "401") {
            $state.go("signin");
        }
    });
    $rootScope.$on("$stateChangeStart", (event: any, toState: ng.ui.IState, toParams, fromState, fromParams): void => {
        if (toState.data && toState.data.authorized !== undefined) {
            if (!toState.data.authorized) {
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



