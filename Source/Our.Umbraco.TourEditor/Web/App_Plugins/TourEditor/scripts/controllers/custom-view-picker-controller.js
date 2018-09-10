(function () {
    "use strict";

    function CustomViewPickerOverlayController($scope, $q, tourResource) {
        var vm = this;

        vm.isLoading = true;
        vm.customViews = [];
        vm.selectedView = $scope.model.selectedView;

        if (!vm.selectedView) {
            vm.selectedView = '';
        }        

        vm.properties = {
            'CustomView': { 'label': 'View', 'description': 'Select the view you want to use'}            
        };

        function changeView() {           
            $scope.model.selectedView = vm.selectedView;
        }

        vm.changeView = changeView;
        
        function init() {
            tourResource.getCustomViews().then(function(views) {               
                vm.customViews = views;
                vm.customViews.unshift({
                    "name": "Select a view",
                    "viewPath": ""
                });

                vm.isLoading = false;
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