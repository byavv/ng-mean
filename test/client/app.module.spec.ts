/// <reference path="../../client/typings/app.d.ts" />
/// <reference path="../../typings/tsd.d.ts" />

var appModule = require("../../client/app/app.module");


var mockScope;
var controller;
describe("Unit: Testing App Module", () => {

  /*  beforeEach(angular.mock.module(appModule.controllers.name, ($provide: ng.auto.IProvideService) => {
        //mock something here
    }));*/

    beforeEach(angular.mock.inject(($controller: ng.IControllerService, $rootScope: ng.IRootScopeService) => {
        mockScope = $rootScope.$new();
       /* controller = $controller(ctrl.HomeController.controllerId, {
            $scope: mockScope
        });*/
    }));


    it("home controller should be initialised", () => {
        expect(5).toBe(5);
        //controller.init();
       // expect(controller.title).toEqual("home");
       // mockScope.$digest();
    });
});