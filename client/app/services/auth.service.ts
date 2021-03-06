"use strict";

/**
 * Authentication service to manage authentication/authorization processes
 */
export default class AuthService implements mts.IAuthService {
    public static serviceId: string = "authService";
    public static $inject = [
        "$http",
        "identityService"
    ];

    constructor(private $http: ng.IHttpService,
        private identityService: mts.IIdentityService) {
    }

    public signUp(userData: any): ng.IPromise<any> {
        return this.$http.post("/auth/signup", userData).then((response: any): void => {
            if (response.data) {
                this.identityService.user = response.data;
            }
        });
    }

    public signIn(username: string, password: string): ng.IPromise<any> {
        return this.$http.post("/auth/signin", {
            username: username,
            password: password
        }).then((response: any): void => {
            if (response.data) {
                this.identityService.user = response.data;
                return response.data;
            }
        });
    }

    public signOut(): ng.IPromise<any> {
        return this.$http.post("/auth/signout", { logout: true }).finally((): void => {
            this.identityService.user = null;
        });
    }
    /**
     * Check if user authorized for roles. Used to protect app routes. If route access is restricted,
     * this method will be called with current token. If token is valid and the user is authorized for routes
     * http interceptor pass this request, in other case - fire 401, which, in turn, will be handled in 
     * $stateChangeError callback.
     */
    public isAuthorized(roles: Array<string>): ng.IPromise<any> {
        return this.$http.post("/auth/me", { require: roles });
    }
}
