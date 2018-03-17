(function () {
    "use strict";

    function ElementPickerOverlayController($scope) {
        var vm = this;

        vm.isLoading = true;
        vm.sections = $scope.model.sections;

        vm.tabs = [{
            active: true,
            id: 1,
            label: "Sections",
            alias: "sections",
            items : vm.sections
        }];
        
        vm.isLoading = false;
    }


    angular.module("umbraco").controller("Our.Umbraco.TourEditor.ElementPickerOverlayController",
        [
            '$scope',            
            ElementPickerOverlayController
        ]);

})();