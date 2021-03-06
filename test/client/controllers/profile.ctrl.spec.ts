/// <reference path="../../../client/typings/app.d.ts" />
/// <reference path="../../../typings/jasmine/jasmine.d.ts" />

import module from "../../../client/app/components/components.module"
import ctrl from "../../../client/app/components/user/user/profile.controller"


describe("Testing controllers", () => {
    describe("Profile controller testing", () => {
        var mockScope,
            controller,
            usersService,
            _timeout: any,
            _q: ng.IQService,
            _location: ng.ILocationService,
            updateProfileStub: jasmine.Spy,
            handleMessageStub: jasmine.Spy,
            getProfileStub: jasmine.Spy,           
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
                updateProfileStub = spyOn(usersService, "updateProfile");
                updateProfileStub.and.returnValue(_q.when(42))
                getProfileStub = spyOn(usersService, "getProfile");
                getProfileStub.and.returnValue(_q.when(42));
                updateProfileStub.and.returnValue(_q.when(42));
              
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
        
        
         it("Should load profile data when redirect to page", () => {            
            getProfileStub.and.returnValue(_q.when({profile: "fake"}));
            handleMessageStub.and.returnValue("handledError");
            spyOn(controller, "showAlert");   
            controller.init();          
            mockScope.$digest();
            expect(getProfileStub).toHaveBeenCalled(); 
            _timeout.flush();
            _timeout.verifyNoPendingTasks();
            expect(controller.profile).toEqual({profile: "fake"});                
            expect(handleMessageStub).not.toHaveBeenCalledWith("someError");
        });
        
        it("Controller should call server to sign up user with username and password if form is valid", () => {
            updateProfileStub.and.returnValue(_q.when(42));
            var profile = { username: "John", password: "Doe" };
            controller.profile = profile;
            controller.submitPersonal();
            expect(updateProfileStub).toHaveBeenCalledWith(profile);
        });

        it("Should get profile data if user opens profile accordion tab", () => {
            var profilefromserver = { address: "NY", Birthday: "01/01/2001" };
            getProfileStub.and.returnValue(_q.resolve(profilefromserver));
            mockScope.vm = {}
            mockScope.vm.isPersonalDataOpen = true;
            mockScope.$digest();
            expect(getProfileStub).toHaveBeenCalled();
        });
        it("Should show error message", () => {
            controller.error = null;
            controller.info = null;
            controller.showAlert("myerror", true);
            mockScope.$digest();
            expect(controller.error).toBe("myerror");
            expect(controller.info).toBeNull();
        })
        it("Should show info message", () => {
            controller.error = null;
            controller.showAlert("myinfo", false);
            mockScope.$digest();
            expect(controller.error).toBeNull();
            expect(controller.info).toBe("myinfo");
        })

        it("Should updateProfile when user 'personal-data' form is valid and reset form", () => {
            controller.personalDataForm = {
                $dirty: true,
                $setPristine: jasmine.createSpy("$setPristine").and.callFake(()=>{                   
                    controller.personalDataForm.$dirty = false})
            }
            var currentProfile = { username: "john" }
            controller.profile = currentProfile;
            spyOn(controller, "showAlert")           
            updateProfileStub.and.returnValue(_q.when({ profile: { username: "john1" } }));
            controller.submitPersonal();
            mockScope.$digest();
            expect(updateProfileStub).toHaveBeenCalledWith(currentProfile);
            expect(controller.personalDataForm.$setPristine).toHaveBeenCalled();
            expect(controller.personalDataForm.$dirty).toBeFalsy();
            _timeout.flush();
            _timeout.verifyNoPendingTasks();
            expect(controller.showAlert).toHaveBeenCalled();
            expect(controller.profile).toEqual({ username: "john1" });           
        })
       
    });
}); 