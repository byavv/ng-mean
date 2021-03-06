/// <reference path="../../../client/typings/app.d.ts" />
/// <reference path="../../../typings/jasmine/jasmine.d.ts" />

import module from "../../../client/app/components/components.module"
import ctrl from "../../../client/app/components/home/home.controller"

var mockScope;
var controller;
describe("Testing controllers", () => {
    describe("Home controller testing", () => {
    beforeEach(() => {
        angular.mock.module(module.name);
        angular.mock.inject(($controller: ng.IControllerService, $rootScope: ng.IRootScopeService, $timeout: ng.ITimeoutService) => {
            mockScope = $rootScope.$new();

            controller = $controller(ctrl.controllerId, {
                $scope: mockScope,
                $timeout: $timeout
            });
            spyOn(controller, "init").and.callThrough();
        });
    });
    it("controller init should be called", () => {
        controller.init();
        expect(controller.init).toHaveBeenCalled();
        expect(controller.$timeout).toBeDefined();
        mockScope.$digest();
    });
     });   
}); 