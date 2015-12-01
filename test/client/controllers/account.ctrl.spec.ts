/// <reference path="../../../client/typings/app.d.ts" />
/// <reference path="../../../typings/jasmine/jasmine.d.ts" />

import module from "../../../client/app/components/components.module"
import ctrl from "../../../client/app/components/user/user/account.controller"


describe("Testing controllers", () => {
    describe("Account controller testing", () => {
        var mockScope,
            controller,
            usersService,
            _timeout: any,
            _q: ng.IQService,
            _location: ng.ILocationService,           
            handleMessageStub: jasmine.Spy,            
            getAccountStub: jasmine.Spy,
            changePasswordStub: jasmine.Spy,
            serverMessageHandler
            ;
            
        beforeEach(() => {
            angular.mock.module("app")
            angular.mock.module(module.name);
            angular.mock.inject(($injector: ng.auto.IInjectorService) => {
                _q = $injector.get<ng.IQService>("$q");
                _location = $injector.get<ng.ILocationService>('$location');
                usersService = $injector.get<any>("usersService");
                serverMessageHandler = $injector.get<any>("serverMessageHandler");
                _timeout = $injector.get<any>("$timeout");               
              
                getAccountStub = spyOn(usersService, "getAccount");
                getAccountStub.and.returnValue(_q.when({account: "fake"}));
                changePasswordStub = spyOn(usersService, "changePassword");
                handleMessageStub = spyOn(serverMessageHandler, "handleMessage");

                mockScope = $injector.get<ng.IRootScopeService>("$rootScope").$new();
                controller = $injector.get<ng.IControllerService>("$controller")(ctrl.controllerId, {
                    $scope: mockScope,
                    usersService: usersService
                });
                controller.personalDataForm = {
                    $dirty: true                    
                }
            });
        });        

         it("Should load account data when redirect to page", () => {            
            getAccountStub.and.returnValue(_q.when({account: "fake"}));
            handleMessageStub.and.returnValue("handledError");
            spyOn(controller, "showAlert");   
            controller.init();          
            mockScope.$digest();
            expect(getAccountStub).toHaveBeenCalled(); 
            _timeout.flush();
            _timeout.verifyNoPendingTasks();
            expect(controller.account).toEqual({account: "fake"});                
            expect(handleMessageStub).not.toHaveBeenCalledWith("someError");
        });
        
        it("Should handle server error and show alert", () => {
            getAccountStub.and.returnValue(_q.reject("someError"));
            handleMessageStub.and.returnValue("handledError");
            spyOn(controller, "showAlert"); 
            controller.init();          
            mockScope.$digest();
            expect(getAccountStub).toHaveBeenCalled();
            expect(controller.showAlert).toHaveBeenCalledWith("handledError", true);
            expect(handleMessageStub).toHaveBeenCalledWith("someError");
        });      

        it("Should show error message", () => {
            controller.error = null;
            controller.info = null;
            controller.showAlert("myerror", true);
            mockScope.$digest();
            expect(controller.error).toBe("myerror");
            expect(controller.info).toBeNull();
        });
        
        it("Should show info message", () => {
            controller.error = null;
            controller.showAlert("myinfo", false);
            mockScope.$digest();
            expect(controller.error).toBeNull();
            expect(controller.info).toBe("myinfo");
        });
        
        it("Should update user account data and change password if it is set", () => {
            controller.changePasswordForm = {
                $dirty: true,
                $valid: true,
                $setPristine: jasmine.createSpy("$setPristine").and.callFake(()=>{                   
                    controller.changePasswordForm.$dirty = false})
            }
            var currentAccount = { username: "john", password: "doe" }
            controller.account = currentAccount;
            spyOn(controller, "showAlert")           
            changePasswordStub.and.returnValue(_q.when({ profile: { username: "john1" } }));
            controller.submitPassword();
            mockScope.$digest();
            expect(changePasswordStub).toHaveBeenCalledWith(currentAccount);
           
            _timeout.flush();
            _timeout.verifyNoPendingTasks();
            expect(controller.changePasswordForm.$setPristine).toHaveBeenCalled();
            expect(controller.changePasswordForm.$dirty).toBeFalsy();
            expect(controller.showAlert).toHaveBeenCalled();              
        })     
    });
}); 