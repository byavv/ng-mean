"use strict"

import HomeController   from "./home/home.controller";
import HeaderController from "./header/header.controller";
import AuthMenuController from "./header/auth.menu.controller";

import PasswordForgetCtrl from "./user/psw_Forget/forget.controller";
import SetNewPasswordCtrl from "./user/psw_SetNew/setNewPassword.controller";
import PasswordResetError from "./user/psw_Error/passwordResetError.controller";
import ProfileController from "./user/profile/profile.controller";

import SignUpController from "./account/signUp/signup.controller";
import SignInController from "./account/signIn/signin.controller";

import Restricted from "./restricted/restricted.controller";

let componentsModule: ng.IModule =
    angular.module("components", [])
        .controller(HomeController.controllerId, HomeController)
        .controller(HeaderController.controllerId, HeaderController)
        .controller(AuthMenuController.controllerId, AuthMenuController)
        .controller(SignUpController.controllerId, SignUpController)
        .controller(ProfileController.controllerId, ProfileController)
        .controller(SignInController.controllerId, SignInController)
        .controller(SetNewPasswordCtrl.controllerId, SetNewPasswordCtrl)
        .controller(PasswordResetError.controllerId, PasswordResetError)
        .controller(PasswordForgetCtrl.controllerId, PasswordForgetCtrl)
        .controller(Restricted.controllerId, Restricted)
    ;

export default componentsModule;
