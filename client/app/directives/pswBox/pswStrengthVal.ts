export default function pswStrength (): ng.IDirective {
    return {
        restrict: "A",
        require: "ngModel",
        link: (scope:any, element:ng.IAugmentedJQuery, attrs:any, ngModel:ng.INgModelController):void => {
            let ignoreIfEmpty = !!attrs.ignoreIfEmpty && (attrs.ignoreIfEmpty === 'true');
            ngModel.$validators["strength"] = (value:string) => {               
                if (!value && ignoreIfEmpty) {                  
                    return true;
                }
                return /(?=.{6,}).*/.test(value);
            };
        }
    };
}
