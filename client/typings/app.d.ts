/// <reference path="tsd.d.ts" />
///////////////////////////////////////////////////////////////////////////////
// Webpack declarations
///////////////////////////////////////////////////////////////////////////////
interface WebpackRequireEnsureCallback {
    (req: WebpackRequire): void
}
interface WebpackRequire {
    (id: string): any;
    (id: string[], callback: Function): any;
    ensure(ids: string[], callback: WebpackRequireEnsureCallback): void;
}
declare var require: WebpackRequire;

///////////////////////////////////////////////////////////////////////////////
// Webpack provided build mode variables declarations
///////////////////////////////////////////////////////////////////////////////
/**
 * Production mode
 */
declare var _PROD_MODE: boolean;
/**
 * Development mode
 */
declare var _DEV_MODE: boolean;
/**
 * Testing mode
 */
declare var _TEST_MODE: boolean;

interface _Window extends Window { }
declare var window: _Window;
///////////////////////////////////////////////////////////////////////////////
// Application declarations
///////////////////////////////////////////////////////////////////////////////
declare module meanTs {
    export interface IUsersService {
        forgotPassword(email: string): ng.IPromise<any>;
        setNewPassword(password: string, token: string): ng.IPromise<any>;
        getProfile(): ng.IPromise<any>;
        getAccount(): ng.IPromise<any>;
        updateProfile(userProfile: any): ng.IPromise<any>;
        changePassword(password: any): ng.IPromise<any>;
    }
    export interface IAuthService {
        signIn(username: string, password: string): ng.IPromise<any>;
        signOut(): ng.IPromise<any>;
        signUp(userData: any): ng.IPromise<any>;
        isAuthorized(roles: Array<string>);
    }
    export interface IIdentityService {
        user: any;
        update(startDigest: boolean): void;
        refreshToken(token): void;
        isAuthenticated(): boolean;
        isAuthorized(roles: Array<string>): boolean;
    }
    export interface IUser {        
        username?: string;             
        roles?: [string];
        token?: string; 
    }
    export interface IError {
        key: any,
        message: string,
    }
    export interface IServerMessageHandler {
        handleMessage(error: IError, allowArray?: boolean): string;
    }
}
import mts = meanTs;