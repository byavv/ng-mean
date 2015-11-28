/**
 *  Directive to hide elements if user is unauthorized for role.
 *  Usage: '<div restrict-ui permit-for="user, admin">ONLY ADMIN CAN SEE IT</div>'
 */
function restrictedUIDirective(identityService: mts.IIdentityService): ng.IDirective {
    return {
        restrict: "A",
        link: function(scope: any, element: ng.IAugmentedJQuery, attrs: any): void {
            let roles;
            let show = () => {
                element.removeClass("hidden");
            };

            let hide = () => {
                element.addClass("hidden");
            };
            let setVisibility = (forRoles: Array<string>): void=> {
                if (identityService.isAuthorized(forRoles)) {
                    show();
                } else {
                    hide();
                }
            };
            attrs.$observe("permitFor", (value: any): void=> {
                if (value && value.length) {
                    roles = value.split(",");
                    if (roles) {
                        setVisibility(roles);
                    }
                }
            });
            scope.$watch((): boolean => {
                return identityService.isAuthenticated();
            }, (): void => {
                if (roles) {
                    setVisibility(roles);
                } else {
                    hide();
                }
            });
        }
    };
}
restrictedUIDirective.$inject = ["identityService"];

export default restrictedUIDirective;

