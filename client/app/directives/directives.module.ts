import LoaderDirective from "./loader/loader.directive";
import pswStrengthChecker from "./pswBox/pswStrengthCheck";
import pswStrengthValidator from "./pswBox/pswStrengthVal";
import restrictedUIDirective from "./restrictUI/restrictedUIElement.directive";

let directivesModule: ng.IModule = angular.module("directives", [])
    .directive ("loader",  () => { return new LoaderDirective(); })
    .directive ("passwordStrengthChecker",  pswStrengthChecker)
    .directive ("strength",  pswStrengthValidator)
    .directive ("restrictUi", restrictedUIDirective);


export default directivesModule;
