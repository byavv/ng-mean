/// <reference path="../../client/typings/app.d.ts" />
/// <reference path="../../typings/jasmine/jasmine.d.ts" />

import mod from "../../client/app/app.module"
import {httpConfig, httpInterceptor} from "../../client/app/config/app.http.config"
var _identityService: mts.IIdentityService,
    _authService: mts.IAuthService,
    _localStorageService: angular.local.storage.ILocalStorageService,
    _authRequestHandler,
    _location: ng.ILocationService,
    _rootScope: ng.IRootScopeService,
    _route: ng.route.IRouteService,
    _httpInterceptor,
    _httpProvider: ng.IHttpProvider,
    _httpBackend: ng.IHttpBackendService;

describe('Testing app module', () => {

    beforeEach(() => {
        angular.mock.module(mod.name, ($provide: ng.auto.IProvideService, $httpProvider: ng.IHttpProvider) => {
            _httpProvider = $httpProvider;
        });

        inject(($injector: ng.auto.IInjectorService) => {
            _identityService = $injector.get<mts.IIdentityService>('identityService');
            _localStorageService = $injector.get<angular.local.storage.ILocalStorageService>('localStorageService');
            _location = $injector.get<ng.ILocationService>('$location');
            _rootScope = $injector.get<ng.IRootScopeService>('$rootScope');
            _route = $injector.get<ng.route.IRouteService>('$route');
            _authService = $injector.get<mts.IAuthService>('authService');
            _httpBackend = $injector.get<ng.IHttpBackendService>('$httpBackend');

            spyOn(_localStorageService, "get").and.callThrough();
            spyOn(_localStorageService, "remove").and.callThrough();

            spyOn(_identityService, "update").and.callThrough();
            spyOn(_identityService, "isAuthenticated").and.callThrough();

            spyOn(_authService, "isAuthorized").and.callThrough();           
            
            /*_authRequestHandler = _httpBackend.when('GET', '/auth/signup')
                .respond({ id: 'fakeid', token: 'faketoken' }, { 'A-Token': 'xxx' });*/
        });

    });
    afterEach(function() {
        _httpBackend.verifyNoOutstandingExpectation();
        _httpBackend.verifyNoOutstandingRequest();
    });

    describe('Interceptor behaviour tests', () => {
        it("Interceptor sould be defined", () => {
            expect(_httpProvider).toBeDefined();
            expect(_httpProvider.interceptors).toBeDefined();
        });

        it("Should set headers when any request", () => {
            _localStorageService.set("authorizationData", { token: "faketoken" });

            _httpBackend
                .expectPOST('/auth/signup', {}, (headers: any) => {
                    return headers['Authorization'] == "Bearer " + "faketoken";
                }).respond(200, 'OK');

            _authService.signUp({}).then(() => {
                expect(_localStorageService.get).toHaveBeenCalledWith("authorizationData");
            });
            _httpBackend.flush();
        })
        it("Should fail to set headers when there is not token, saved in local storage", () => {
            _localStorageService.set("authorizationData", null);

            _httpBackend
                .expectPOST('/auth/signup', {}, (headers: any) => {
                    return headers['Authorization'] === undefined;
                }).respond(200, 'OK');

            _authService.signUp({}).then(() => {
                expect(_localStorageService.get).toHaveBeenCalledWith("authorizationData");
            });
            _httpBackend.flush();
        });
        it("Should require auth data from storage to commit http request", () => {
            _httpBackend
                .expectPOST("/auth/signup")
                .respond(200, "OK");
            _authService.signUp({ id: "fakeid" }).then(() => {
                expect(_localStorageService.get).toHaveBeenCalledWith("authorizationData");
            });
            _httpBackend.flush();
        });
        it("Should reset auth data when 401 and redirect to authentication page", () => {
            _identityService.user = { _id: "123", token: "faketoken" }
            _httpBackend
                .expectPOST("/auth/me", { require: ["user"] })
                .respond(401, '');
            _authService.isAuthorized(["user"]).then(() => { }, () => {
                expect(_localStorageService.get).toHaveBeenCalledWith("authorizationData");
                expect(_identityService.user).toBeNull();
                expect(_location.path()).toBe("/signin");
            });
            _httpBackend.flush();
        });
    });
    describe("Router behaviour tests", () => {
        it("Should redirect to singin when trying to get restricted route without authentication", () => {
            //user goes from "/" to any restricted route
            _identityService.user = null;
            _location.path("/");
            _rootScope.$on("$routeChangeStart", () => {
                expect(_identityService.isAuthenticated).toHaveBeenCalled();
                expect(_location.path()).toBe("/signin");
            })
            _rootScope.$emit('$routeChangeStart', { authorized: true });

        })
        it("Should pass route change for non-protected route", () => {
            //user goes from "/" to any public route
            _identityService.user = null;
            _location.path("/");
            _rootScope.$on("$routeChangeStart", () => {
                expect(_identityService.isAuthenticated).toHaveBeenCalled();
                expect(_location.path()).toBe("/");
            })
            _rootScope.$emit('$routeChangeStart', { authorized: false });
        })
        it("Should not redirect authenticated user trying get restricted page", () => {
            _location.path("/");
            _identityService.user = { id: "fakeid", roles: ["user"], token: "faketoken" }
            _rootScope.$on("$routeChangeStart", () => {
                expect(_identityService.isAuthenticated).toHaveBeenCalled();
                expect(_location.path()).toBe("/");
            })
            _rootScope.$emit('$routeChangeStart', { authorized: true });
        })
        it("Should redirect to home page when user try to get singin page being authenticated", () => {
            _identityService.user = { id: "fakeid", roles: ["user"], token: "faketoken" }
            _location.path("/singin");
            _rootScope.$on("$routeChangeStart", () => {
                expect(_identityService.isAuthenticated).toHaveBeenCalled();
                expect(_location.path()).toBe("/");
            })
            _rootScope.$emit('$routeChangeStart', { authorized: false });
        })
        it("Should redirect to singin page if router resolve return 401", () => {
            _identityService.user = null;
            _location.path("/profile");

            _rootScope.$on("$routeChangeError", () => {
                expect(_location.path()).toBe("/signin");
            })
            _rootScope.$emit('$routeChangeError', null, null, '401');
        })
    })
});

describe("Testing app module", () => {
    beforeEach(function() {
        angular.mock.module(mod.name, ($provide) => {
            $provide.factory("identityService", () => {
                return {
                    user: {},
                    update: jasmine.createSpy("update"),
                };
            });
        });
        inject(($injector: ng.auto.IInjectorService) => {
            _identityService = $injector.get<mts.IIdentityService>('identityService');
        })
    });
    describe('Run block', () => {
        it("Should update identity after start in run block", () => {
            expect(_identityService.update).toHaveBeenCalledWith(false);
        });
    })
})