(function () {
    "use strict";

    function valUniqueAlias() {

        return {
            require: 'ngModel',
            restrict: "A",
            link: function (scope, elm, attrs, ctrl) {

                var existingAliases = [];

                if (!ctrl) return;

                var uniqueAliasValidator = function (viewValue) {

                    ctrl.$setValidity('valUniqueAlias', false);
                    ctrl.errorMsg = "Alias must be unique";
                    return undefined;

                    ////NOTE: we don't validate on empty values, use required validator for that
                    //if (!viewValue || isJson(viewValue)) {
                    //    // it is valid
                    //    ctrl.$setValidity('valIsJson', true);
                    //    //assign a message to the validator
                    //    ctrl.errorMsg = "";
                    //    return viewValue;
                    //}
                    //else {
                    //    // it is invalid, return undefined (no model update)
                    //    ctrl.$setValidity('valIsJson', false);
                    //    //assign a message to the validator
                    //    ctrl.errorMsg = "Custom properties is not valid JSON";
                    //    return undefined;
                    //}

                };

                ctrl.$formatters.push(uniqueAliasValidator);
                ctrl.$parsers.unshift(uniqueAliasValidator);

                attrs.$observe('valUniqueAlias', function (newVal) {
                    if (newVal) {
                        existingAliases = newVal;
                    }

                    uniqueAliasValidator(ctrl.$viewValue);
                });
            }
        };
    }
    angular.module('umbraco.directives.validation').directive("valUniqueAlias", valUniqueAlias);

})();