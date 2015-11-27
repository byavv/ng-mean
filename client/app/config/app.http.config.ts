export function httpInterceptor($q: ng.IQService,
    $location: ng.ILocationService,
    identityService: mts.IIdentityService,
    localStorageService: angular.local.storage.ILocalStorageService): ng.IHttpInterceptor {
    return {
        request: function(config: ng.IRequestConfig): ng.IRequestConfig {
            config.headers = config.headers || {};
            let auth: any = localStorageService.get("authorizationData");
            if (auth && !!auth.token) {
                angular.extend(config.headers, {
                    Authorization: "Bearer " + auth.token
                });
            }
            return config;
        },
        response: function(response: ng.IHttpPromiseCallbackArg<any>): ng.IHttpPromiseCallbackArg<any> {
            /*let refreshToken = response.headers("refreshToken");
            if (!!refreshToken) {
                identityService.refreshToken(refreshToken);
            }*/
            return response;
        },       
        requestError: function(rejection: any): ng.IPromise<any> {
            //the connection was closed
            if (rejection.status === 0) {
                // todo: show user about error, may be using popup window
                // smth like check your connection
                return;
            }
            return $q.reject(rejection);
        },
        responseError: function(rejection: any): ng.IPromise<any> {
            /*let refreshToken = rejection.headers("refreshToken");
            if (!!refreshToken) {
                identityService.refreshToken(refreshToken);
            }*/
            if (!!rejection && rejection.status === 401) {
                identityService.user = null;
                $location.path("/signin");
            }
            if (!!rejection && rejection.status === 500) {
                // todo: show user about error, may be using popup window
                // smth like check your connection
            }
            return $q.reject(rejection);
        }
    };
}
httpInterceptor.$inject = ["$q", "$location", "identityService", "localStorageService"];

export function httpConfig($httpProvider: ng.IHttpProvider): any {

    $httpProvider.interceptors.push(httpInterceptor);

    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = Object.create({});
    }
    $httpProvider.defaults.headers.get["If-Modified-Since"] = "Mon, 26 Jul 1997 05:00:00 GMT";
    $httpProvider.defaults.headers.get["Cache-Control"] = "no-cache";
    $httpProvider.defaults.headers.get["Pragma"] = "no-cache";
}
httpConfig.$inject = ["$httpProvider"];
