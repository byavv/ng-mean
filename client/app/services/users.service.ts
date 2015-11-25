"use strict";

export default class UsersService implements mts.IUsersService {
    public static serviceId:string = "usersService";
    public static $inject = ["$http", "$q"];

    constructor(private $http:ng.IHttpService, private $q:ng.IQService) {
    }

    public forgotPassword(email:string):ng.IPromise<any> {
        return this.$http.post("/api/forgot", {email: email});
    }

    public setNewPassword(password:string, token:string):ng.IPromise<any> {
        return this.$http.post("/api/resetpassword", {password: password, token: token});
    }

    public getProfile():ng.IPromise<any> {
        return this.$http.post("/api/profile", {}).then((response:any)=> {
            return response.data;
        });
    }
    public getAccount():ng.IPromise<any> {
        return this.$http.post("/api/account", {}).then((response:any)=> {
            return response.data;
        });
    }

    public updateProfile(userProfile:any):ng.IPromise<any> {
        return this.$http.put("/api/profile", {profile: userProfile}).then((response:any)=> {
            return response.data;
        });
    }

    public changePassword(account:any):ng.IPromise<any> {
        return this.$http.post("/api/updateaccount", {account: account}).then((response:any)=> {
            return response.data;
        });
    }
};
