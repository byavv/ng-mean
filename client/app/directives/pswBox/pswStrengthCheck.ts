require("./pswStrengthCheck.less");
/*
*  Directive for animation of password field to show password strength. Require animate.css
* */
function passwordCheckerDirective ($animate: ng.animate.IAnimateService): ng.IDirective {
    return {
        restrict: "A",
        require: "ngModel",
        link: (scope:any, element:ng.IAugmentedJQuery, attrs:any, ngModel:ng.INgModelController):void => {
            let ignoreIfEmpty = !!attrs.ignoreIfEmpty && (attrs.ignoreIfEmpty === 'true');
            let currentState;
            let span = angular.element("<span class='strengthStatus'></span>");
            let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            let pathDef = [
                "M20.002,24.001H4.014c-1.104,0-1.998-0.896-1.998-2.001V11.994  " +
                "c0-1.105,0.895-2.002,1.998-2.002h0.999V6.991c0-3.868,3.132-7.004,6.995-7.004s6.995,3.136,6.995,7.004v3.001h0.999  " +
                "c1.104,0,1.998,0.896,1.998,2.002V22C22,23.104,21.105,24.001,20.002,24.001z M16.005,6.991c0-2.21-1.79-4.002-3.997-4.002  " +
                "S8.011,4.781,8.011,6.991v3.001h7.994V6.991z"
            ];


            element.addClass("psw");
            svg.setAttributeNS(null, "viewBox", "-20 -12 50 50");
            svg.setAttributeNS(null, "width", "40");
            svg.setAttributeNS(null, "height", "40");
            svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            span.append(svg);
            $(span).insertAfter(element);

            let draw = (status:string):void => {
                if (status !== currentState) {
                    currentState = status;
                    angular.element(svg).empty();
                    for (var i = 0, len = pathDef.length; i < len; ++i) {
                        let path:any = document.createElementNS("http://www.w3.org/2000/svg", "path");
                        svg.appendChild(path);
                        path.setAttributeNS(null, "d", pathDef[i]);
                        switch (status) {
                            case "danger":
                                path.style.animation = "tada 0.5s linear both";
                                path.style.fill = "#a3000a";
                                break;
                            case "norm":
                                path.style.animation = "pulse 0.5s linear both";
                                path.style.fill = "#EE7B00";
                                break;
                            case "strong":
                                path.style.animation = "pulse 0.5s linear both";
                                path.style.fill = "#267c1d";
                                break;
                            case "default":
                                path.style.fill = "#C8C8C8";
                                break;
                            default:
                                path.style.fill = "#C8C8C8";

                        }
                    }
                }
            };

            $animate.setClass(element, "psw-default", "psw-good psw-strong psw-danger");
            draw("default");

            scope.$watch(()=> {
                return ngModel.$viewValue;
            }, (value:any) => {
                if (value) {
                    if (/^(?=.{0,5}$).*/.test(value)) {
                        // animate input
                        $animate.setClass(element, "psw-danger", "psw-good psw-strong");
                        // animate status svg
                        draw("danger");
                        return;
                    }
                    if (/^[a-zA-Z0-9]{6,}$/.test(value)) {
                        $animate.setClass(element, "psw-good", "psw-danger psw-strong");
                        draw("norm");
                        return;
                    }
                    if (/^[a-zA-Z0-9\W]{7,}$/.test(value)) {
                        $animate.setClass(element, "psw-strong", "psw-danger psw-good");
                        draw("strong");
                    }
                } else {
                    if (ngModel.$dirty) {
                        $animate.setClass(element, "psw-danger", "psw-good psw-strong");
                        ignoreIfEmpty ? draw("default") : draw("danger");
                    } else {
                        $animate.setClass(element, "psw-default", "psw-good psw-strong psw-danger");
                        draw("default");
                    }
                }
            }, true);
        }
    };
}
passwordCheckerDirective.$inject = ["$animate"];

export default passwordCheckerDirective;
