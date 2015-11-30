let isAuthorizedForRoles = (roles: Array<string>): Array<any> => {
    return ["$q", "authService", "$location", ($q: ng.IQService, authService: mts.IAuthService): ng.IPromise<any> => {
        let defer = $q.defer();
        authService.isAuthorized(roles).then((result: any) => {
            defer.resolve(result);
        }, () => {
            defer.reject("401");
        });
        return defer.promise;
    }];
};

export function routeConfig($stateProvider: ng.ui.IStateProvider, $urlRouterProvider:ng.ui.IUrlRouterProvider, $logProvider: ng.ILogProvider): void {
    $logProvider.debugEnabled(_DEV_MODE);
    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: "home.view.html",
            controller: "homeCtrl",
            controllerAs: "vm",
        })
        .state("signup", {
            url: "/signup",
            controller: "signupCtrl",
            controllerAs: "vm",
            templateUrl: "signup.view.html",
            data: { authorized: false }
        })
        .state("signin", {
            url: "/signin",
            controller: "signinCtrl",
            controllerAs: "vm",
            templateUrl: "signin.view.html",
            data: { authorized: false }
        })
        .state("confirm", {
            url: "/confirm",
            controller: "confirmCtrl",
            controllerAs: "vm",
            templateUrl: "confirm.view.html"
        })
        .state("forget", {
            url: "/forget",
            controller: "forgetCtrl",
            controllerAs: "vm",
            templateUrl: "forget.view.html"
        })
        .state("resettoken", {
            url: "/password/reset/:token",
            controller: "setNewCtrl",
            controllerAs: "vm",
            templateUrl: "setNewPassword.view.html"
        })
        .state("passworderror", {
            url: "/password/error",
            controller: "psvErrorCtrl",
            controllerAs: "vm",
            templateUrl: "passwordResetError.view.html"
        })
        .state("restricted", {
            url: "/restricted",
            controller: "restrictedCtrl",
            controllerAs: "vm",
            templateUrl: "restricted.view.html",
            data: { authorized: true },
            resolve: {
                auth: isAuthorizedForRoles(["user"])
            }
        })
        .state("profile", {
            url:"/profile",
            controller: "profileCtrl",
            controllerAs: "vm",
            templateUrl: "profile.view.html",
            data: { authorized: true },
            resolve: {
                auth: isAuthorizedForRoles(["user"])
            }
        });
}


export function route1Config($routeProvider: any /*ng.route.IRouteProvider*/): void {
    $routeProvider
        .when("/", {
            controller: "homeCtrl",
            controllerAs: "vm",
            templateUrl: "home.view.html"
        })
        .when("/signup", {
            controller: "signupCtrl",
            controllerAs: "vm",
            templateUrl: "signup.view.html",
            authorized: false
        })
        .when("/signin", {
            controller: "signinCtrl",
            controllerAs: "vm",
            templateUrl: "signin.view.html",
            authorized: false
        })
        .when("/confirm", {
            controller: "confirmCtrl",
            controllerAs: "vm",
            templateUrl: "confirm.view.html"
        })
        .when("/forget", {
            controller: "forgetCtrl",
            controllerAs: "vm",
            templateUrl: "forget.view.html"
        })
        .when("/password/reset/:token", {
            controller: "setNewCtrl",
            controllerAs: "vm",
            templateUrl: "setNewPassword.view.html"
        })
        .when("/password/error", {
            controller: "psvErrorCtrl",
            controllerAs: "vm",
            templateUrl: "passwordResetError.view.html"
        })
        .when("/restricted", {
            controller: "restrictedCtrl",
            controllerAs: "vm",
            templateUrl: "restricted.view.html",
            authorized: true,
            resolve: {
                auth: isAuthorizedForRoles(["user"])
            }
        })
        .when("/profile", {
            controller: "profileCtrl",
            controllerAs: "vm",
            templateUrl: "profile.view.html",
            authorized: true,
            resolve: {
                auth: isAuthorizedForRoles(["user"])
            }
        })
        .otherwise({ redirectTo: "/" });
}
routeConfig.$inject = ["$stateProvider", "$urlRouterProvider", "$logProvider"];



export function locationConfig($locationProvider: ng.ILocationProvider): void {
    $locationProvider.html5Mode(true);
}
locationConfig.$inject = ["$locationProvider"];
