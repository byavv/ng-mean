/// <reference path="../typings/app.d.ts" />
"use strict";
require("../assets/animate.css");

// bootstrap
require("jquery");
require("bootstrap");
// fonts
require("font-awesome");

require("toastr");
// bootstrap theme
//require("../assets/bootstrap-readable-theme.css");
//require("../assets/bootstrap-paper-theme.css");
//require("../assets/bootstrap-simplex-theme.css");
require("../assets/bootstrap-yeti-theme.css");
// custom styles
require("../assets/index");


require("angular-local-storage");
require("angular-ui-router");

import componentsModule from "./components/components.module";
import directivesModule from "./directives/directives.module";
import sharedModule from "./shared/shared.module";
import servicesModule from "./services/services.module";
import {httpConfig} from "./config/app.http.config";
import {routeConfig, locationConfig, logConfig} from "./config/app.router.config";
import {run} from "./app.run";


export default angular.module("app", [
    require("angular-route"),			// ngRoute
    require("angular-ui-bootstrap"),	// uiBootstrap
    require("angular-animate"),			// ngAnimate
    //require("angular-resource"),        // ngResource
    require("angular-messages"),        // ngMessages
//require("angular-cookies"),         // ngCookies
    "LocalStorageModule",
    "ui.router",


    componentsModule.name,				// app modules
    directivesModule.name,				//
    sharedModule.name,					//
    servicesModule.name                 //
])
    .config(routeConfig)
    .config(locationConfig)
    .config(httpConfig)
    .config(logConfig)
    .run(run)
    .value('toastr', require("toastr"))
    .value("config", require("../../shared/index"));

if (_DEV_MODE) {
    console.log("development");
}
if (_PROD_MODE) {
    console.log("production");
}
 