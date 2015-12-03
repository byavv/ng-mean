"use strict";

export default class IdentityService implements mts.IIdentityService {
    public static serviceId: string = "identityService";
    public static $inject = ["localStorageService", "$timeout"];
    private _user: mts.IUser;

    constructor(private localStorageService: angular.local.storage.ILocalStorageService,
        private $timeout: ng.ITimeoutService) {
    }

    /**
     *  Update user authentication state.
     *  Called when bootstrap and when gets notified of successful external authentication
     *  (GitHub in this case). Need to start digest, because angular doesn't track changes in localStorage
     */
    public update(startDigest: boolean): void {
        startDigest ?
            this.$timeout(() => {
                this._getUserDataFromStorage();
            }, 0)
            : this._getUserDataFromStorage();
    }

    public refreshToken(token: string): void {
        console.log("token from: " + this._user.token);
        console.log("changed to: " + token);

        this.user = angular.extend(this.localStorageService.get<mts.IUser>("authorizationData"), { token: token });
    }

    public get user(): mts.IUser {
        return this._user;
    }

    public set user(user: mts.IUser) {
        (user && user.token)
            ? this.localStorageService.set("authorizationData", { token: user.token })
            : this.localStorageService.remove("authorizationData");
        this._user = user;
    }

    public isAuthenticated(): boolean {
        return !!(this._user && this._user.token);
    }

    /**
     * Check if user is authorized.
     * Note!
     * Your server have to be the final point for security. This method exist only to notify client app about
     * changing authentication state. If token is expired, client-side know nothing about it, so to be sure that 
     * the user is authenticated, use authService isAuthorized which require server using current token.
     */
    public isAuthorized(roles: Array<string>): boolean {
        return !!(this.isAuthenticated() && _.intersection(this._user.roles, roles).length === roles.length);
    }

    private _getUserDataFromStorage(): void {
        let user = this.localStorageService.get<mts.IUser>("authorizationData");
        if (user) {
            this.user = this.localStorageService.get<mts.IUser>("authorizationData");
        }
    }   
};
