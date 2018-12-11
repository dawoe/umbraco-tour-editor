(function () {
    "use strict";

    function DocumentTypePickerOverlayController($scope, $q) {
        var vm = this;

        vm.isLoading = true;
       
        function init() {
           
        }

        init();
    }


    angular.module("umbraco").controller("Our.Umbraco.TourEditor.DocumentTypePickerOverlayController",
        [
            '$scope',
            '$q',
            DocumentTypePickerOverlayController
        ]);

})();