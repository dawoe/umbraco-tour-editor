(function () {
    "use strict";

    function ElementPickerOverlayController($scope) {
        var vm = this;

        vm.sections = $scope.model.sections;
        
    }


    angular.module("umbraco").controller("Our.Umbraco.TourEditor.ElementPickerOverlayController",
        [
            '$scope',            
            ElementPickerOverlayController
        ]);

})();