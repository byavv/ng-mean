/// <reference path="../../../client/typings/app.d.ts" />
/// <reference path="../../../typings/jasmine/jasmine.d.ts" />

import module from "../../../client/app/components/components.module"
import ctrl from "../../../client/app/components/account/signUp/signup.controller"


describe("Testing controllers", () => {
    describe("Sign up controller testing", () => {
        var mockScope,
            controller,
            authService,
            _q: ng.IQService,
            _location: ng.ILocationService,
            signUpStub: jasmine.Spy,
            handleMessageStub: jasmine.Spy,
            serverMessageHandler
            ;
        beforeEach(() => {
            angular.mock.module("app")
            angular.mock.module(module.name);

            angular.mock.inject(($injector: ng.auto.IInjectorService) => {
                _q = $injector.get<ng.IQService>("$q");
                _location = $injector.get<ng.ILocationService>('$location');
                authService = $injector.get<any>("authService");
                serverMessageHandler = $injector.get<any>("serverMessageHandler");
                signUpStub = spyOn(authService, "signUp");
                handleMessageStub = spyOn(serverMessageHandler, "handleMessage");

                mockScope = $injector.get<ng.IRootScopeService>("$rootScope").$new();
                controller = $injector.get<ng.IControllerService>("$controller")(ctrl.controllerId, {
                    $scope: mockScope,
                    authService: authService
                });
            });
        });
        it("Controller should call server to sign up user with username and password if form is valid", () => {
            controller.signinForm = {
                $valid: true
            }
            signUpStub.and.returnValue(_q.when(42));
            var user = { username: "John", password: "Doe" };
            controller.user = user;
            controller.submit();
            expect(authService.signUp).toHaveBeenCalledWith(user);
        });
    });
}); 