/**
 *  Directive to hide elements if user is unauthorized for role.
 *  Usage: '<div restrict-ui>ONLY AUTHENTICATED USER CAN SEE IT</div>'
 */
function restrictedUIDirective(identityService: mts.IIdentityService): ng.IDirective {
    return {
        restrict: "A",
        link: function(scope: any, element: ng.IAugmentedJQuery, attrs: any): void {
            let show = () => {
                element.removeClass("hidden");
            };
            let hide = () => {
                element.addClass("hidden");
            };            
            scope.$watch((): boolean => {
                return identityService.isAuthenticated();
            }, (isAuthenticated): void => {
                isAuthenticated ? show() : hide();
            });
        }
    };
}
restrictedUIDirective.$inject = ["identityService"];

export default restrictedUIDirective;

