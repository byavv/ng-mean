// Method to test if user has permission for claimed route
// 
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

export function routeConfig($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider): void {
    $urlRouterProvider
        
        .otherwise('/');
        
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
            data: { authenticatedOnly: false } //authenticated users won't be able to get this page.
        })
        .state("signin", {
            url: "/signin",
            controller: "signinCtrl",
            controllerAs: "vm",
            templateUrl: "signin.view.html",
            data: { authenticatedOnly: false }
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
            data: { authenticatedOnly: true },
            resolve: {
                auth: isAuthorizedForRoles(["user"])
            }
        })  
        .state("user", {
            abstract: true,
            url: "/user",
            controller: "userCtrl",
            controllerAs: "vm",
            templateUrl: "user.view.html",
            data: { authenticatedOnly: true },            
        })
         .state("account", {
            parent: "user",
            url: "/account",
            controller: "accountCtrl",
            controllerAs: "vm",
            templateUrl: "account.view.html",
            resolve: {
                auth: isAuthorizedForRoles(["user"])
            }            
        })
        .state("profile", {
            parent: "user",
            url: "/profile",
            controller: "profileCtrl",
            controllerAs: "vm",
            templateUrl: "profile.view.html",
            resolve: {
                auth: isAuthorizedForRoles(["user"])
            }            
        });
        
}
export function logConfig($logProvider: ng.ILogProvider){
    $logProvider.debugEnabled(_DEV_MODE);
}
export function locationConfig($locationProvider: ng.ILocationProvider): void {
    $locationProvider.html5Mode(true);
}
locationConfig.$inject = ["$locationProvider"];
