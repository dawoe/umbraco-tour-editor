(function () {
    "use strict";

    function ElementPickerOverlayController($scope) {
        var vm = this;

        vm.isLoading = true;
        vm.sections = _.map($scope.model.sections, function(x) {
            return {
                "alias": x.alias,
                "icon": x.icon,
                "name": x.name,
                "element": "section-" + x.alias
            };
        });

        vm.tabs = [{
            active: true,
            id: 1,
            label: "Sections",
            alias: "sections",
            items : vm.sections
        }];

        function pickElement(eventElement) {           
            $scope.model.submit("[data-element='" + eventElement + "']");
        }

        vm.pickElement = pickElement;
        
        vm.isLoading = false;
    }


    angular.module("umbraco").controller("Our.Umbraco.TourEditor.ElementPickerOverlayController",
        [
            '$scope',            
            ElementPickerOverlayController
        ]);

})();