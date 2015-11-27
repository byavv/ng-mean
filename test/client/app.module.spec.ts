/// <reference path="../../client/typings/app.d.ts" />
/// <reference path="../../typings/jasmine/jasmine.d.ts" />

import mod from "../../client/app/app.module"
import {httpConfig, httpInterceptor} from "../../client/app/config/app.http.config"
var _identityService: mts.IIdentityService,
    _authService: mts.IAuthService,
    _localStorageService: angular.local.storage.ILocalStorageService,
    _authRequestHandler,
    _httpInterceptor,
    _httpProvider: ng.IHttpProvider,
    _httpBackend: ng.IHttpBackendService;

describe('pageMetaService', () => {

    beforeEach(() => {
        //access to module provider (config stage)
        angular.mock.module(mod.name, ($provide: ng.auto.IProvideService, $httpProvider: ng.IHttpProvider) => {
            _httpProvider = $httpProvider;
            $provide.factory("identityService", () => {
                return {
                    user: {},
                    update: jasmine.createSpy("update", () => { })
                };
            });

        });
    
        //we can inject here for working with dependencies in future
        inject(($injector: ng.auto.IInjectorService) => {
            _identityService = $injector.get<mts.IIdentityService>('identityService');
            _localStorageService = $injector.get<angular.local.storage.ILocalStorageService>('localStorageService');
            spyOn(_localStorageService, "get").and.callThrough();
            _authService = $injector.get<mts.IAuthService>('authService');
            _httpBackend = $injector.get<ng.IHttpBackendService>('$httpBackend');
            /*_authRequestHandler = _httpBackend.when('GET', '/auth/signup')
                .respond({ id: 'fakeid', token: 'faketoken' }, { 'A-Token': 'xxx' });*/
        });

    });
    afterEach(function() {
        _httpBackend.verifyNoOutstandingExpectation();
        _httpBackend.verifyNoOutstandingRequest();
    });

    describe('Service operation tests', () => {
        it("Interceptor sould be defined", () => {
            expect(_httpProvider).toBeDefined();
            expect(_httpProvider.interceptors).toBeDefined();
        });
        it("Should update identity after start in run block", () => {
            expect(_identityService.update).toHaveBeenCalledWith(false);
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
        })


        it("Should require auth data for request", () => {
            _httpBackend
                .expectPOST("/auth/signup")
                .respond(200, "OK");
            _authService.signUp({ id: "fakeid" }).then(() => {
                expect(_localStorageService.get).toHaveBeenCalledWith("authorizationData");
            });
            _httpBackend.flush();
        });
    });
});
