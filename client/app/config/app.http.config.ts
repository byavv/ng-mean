export function httpInterceptor($q: ng.IQService,
    identityService: mts.IIdentityService,
    localStorageService: angular.local.storage.ILocalStorageService,
    $location: ng.ILocationService, toastr: any): ng.IHttpInterceptor {
    toastr.options.closeButton = true;
    toastr.options.positionClass = "toast-top-full-width";
    return {
        request: (config: ng.IRequestConfig): ng.IRequestConfig => {
            config.headers = config.headers || {};
            let auth: any = localStorageService.get("authorizationData");
            if (auth && !!auth.token) {
                angular.extend(config.headers, {
                    Authorization: "Bearer " + auth.token
                });
            }
            return config;
        },
        responseError: (rejection: any): ng.IPromise<any> => {
            if (rejection.status == -1) {
                toastr.error("Unexpected error, server is not responding, check your connection and try again");
            }
            if (!!rejection && rejection.status === 401) {
                identityService.user = null;
                $location.path("/signin");
            }
            if (!!rejection && rejection.status === 500) {
                toastr.error("Unexpected server error");
                console.error(rejection);
            }
            return $q.reject(rejection);
        }
    };
}
httpInterceptor.$inject = ["$q", "identityService", "localStorageService", "$location", "toastr"];

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
