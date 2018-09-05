(function () {
    "use strict";

    function CustomViewPickerOverlayController($scope, $q, tourResource) {
        var vm = this;

        vm.isLoading = true;
        vm.customViews = [];
        
        function init() {
            tourResource.getCustomViews().then(function(views) {
                vm.isLoading = false;
                vm.customViews = views;
            });
        }

        init();
    }


    angular.module("umbraco").controller("Our.Umbraco.TourEditor.CustomViewPickerOverlayController",
        [
            '$scope',
            '$q',
            'Our.Umbraco.TourEditor.TourResource',            
            CustomViewPickerOverlayController
        ]);

})();