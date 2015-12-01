/// <reference path="../../client/typings/app.d.ts" />
/// <reference path="../../typings/jasmine/jasmine.d.ts" />

import mod from "../../client/app/app.module"
import {httpConfig, httpInterceptor} from "../../client/app/config/app.http.config"
var _identityService: mts.IIdentityService,
    _authService: mts.IAuthService,
    _localStorageService: angular.local.storage.ILocalStorageService,
    _authRequestHandler,
    _state: ng.ui.IStateService,
    _rootScope: ng.IRootScopeService,
    _httpInterceptor,
    _location: ng.ILocationService,
    _httpProvider: ng.IHttpProvider,
    _httpBackend: ng.IHttpBackendService,
    _q: ng.IQService,
    isAuthorizedStub: jasmine.Spy
    ;
 function goFrom(url) {
        return {toState: function (state, params) {
            _location.replace().url(url); //Don't actually trigger a reload
            _state.go(state, params);
            _rootScope.$digest();
        }};
    }
    function goTo(url) {
  _location.url(url);
  _rootScope.$digest();
}
describe('Testing app module', () => {
    isAuthorizedStub = jasmine.createSpy("isAuth");//.and.returnValue(_q.resolve("OK"))
   

    beforeEach(() => {
        angular.mock.module(mod.name, ($provide: ng.auto.IProvideService, $httpProvider: ng.IHttpProvider, $stateProvider: ng.ui.IStateProvider) => {
            _httpProvider = $httpProvider;
            $stateProvider.state('fake', {
                url: '/fake',
                template: "<div></div>",
                controller: () => { }
            })
            $stateProvider.state('restrictedfake', {
                url: '/restrictedfake',
                template: "<div></div>",
                controller: () => { },
                data: { authorized: true },
                resolve: {
                    auth: isAuthorizedStub
                }
            })
            $stateProvider.state('notauthonlyfake', {
                url: '/notauthonlyfake',
                template: "<div></div>",
                controller: () => { },
                data: { authorized: false }
            })
        });

        inject(($injector: ng.auto.IInjectorService) => {
            _identityService = $injector.get<mts.IIdentityService>('identityService');
            _localStorageService = $injector.get<angular.local.storage.ILocalStorageService>('localStorageService');
            _location = $injector.get<ng.ILocationService>('$location');
            _state = $injector.get<ng.ui.IStateService>('$state');
            _rootScope = $injector.get<ng.IRootScopeService>('$rootScope');
            _authService = $injector.get<mts.IAuthService>('authService');
            _httpBackend = $injector.get<ng.IHttpBackendService>('$httpBackend');
            _q = $injector.get<ng.IQService>('$q');

            spyOn(_localStorageService, "get").and.callThrough();
            spyOn(_localStorageService, "remove").and.callThrough();

            spyOn(_identityService, "update").and.callThrough();
            spyOn(_identityService, "isAuthenticated").and.callThrough();

            spyOn(_authService, "isAuthorized").and.callThrough();
            _rootScope.$apply()
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
            });           
            _httpBackend.flush();
        });
    });
    it('should respond to URL', function() {
        expect(_state.href("home")).toEqual('/');
    });
    describe("Router behaviour tests", () => {
         it("!!!!!!!!!!!!!!!!!!!!!", () => {
            //user goes from "/" to any restricted route
            _identityService.user = null;
            goFrom("/home").toState("restricted",{});
            
            expect(_identityService.isAuthenticated).toHaveBeenCalled();
            expect(_state.current.name).toBe("signin");
        })
        it("Should redirect to singin when trying to get restricted route without authentication", () => {
            //user goes from "/" to any restricted route
            _identityService.user = null;
            _state.go('restricted');
            _rootScope.$apply();
            expect(_identityService.isAuthenticated).toHaveBeenCalled();
            expect(_state.current.name).toBe("signin");
        })//ok
        it("Should change route if non-protected", () => {
            //user goes from "/" to any public route
            _state.go("home");
            _identityService.user = null;
            _state.go("fake");
            _rootScope.$apply();
            expect(_state.current.name).toBe("fake");
        })//ok
        it("Should not redirect authenticated user trying get restricted page", () => {
            _state.go("home");
            _identityService.user = { id: "fakeid", roles: ["user"], token: "faketoken" }
            isAuthorizedStub.and.returnValue(_q.resolve(42));
            _state.go("restrictedfake");
            _rootScope.$apply();
            expect(_identityService.isAuthenticated).toHaveBeenCalled();
            expect(_state.current.name).toBe("restrictedfake");
            expect(isAuthorizedStub).toHaveBeenCalled();
        })//ok        
        it("Should redirect to home page when user try to get signin page being authenticated", () => {
            _identityService.user = { id: "fakeid", roles: ["user"], token: "faketoken" }
            _state.go("notauthonlyfake");
            _rootScope.$apply();
            expect(_identityService.isAuthenticated).toHaveBeenCalled();
            expect(_state.current.name).toBe("home");
            expect(isAuthorizedStub).toHaveBeenCalled();
        })//ok
        it("Should redirect to singin page if router resolve return 401", () => {
            _identityService.user = null;
            isAuthorizedStub.and.returnValue(_q.reject("ERR"))
            _state.go("profile");//не то работает
            _rootScope.$apply();
            expect(_identityService.isAuthenticated).toHaveBeenCalled();
            expect(_state.current.name).toBe("signin");
            expect(isAuthorizedStub).toHaveBeenCalled();
        })//ok
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