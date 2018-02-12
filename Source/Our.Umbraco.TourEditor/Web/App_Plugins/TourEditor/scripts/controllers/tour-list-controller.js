(function () {
    "use strict";

    function TourListController($scope) {
        var vm = this;        
        vm.tours = $scope.model.tours;

        function editTour(item, index) {
            $scope.model.editCallback(item, index);
        }

        vm.editTour = editTour;
    }

    angular.module("umbraco").controller("Our.Umbraco.TourEditor.TourListController",
        [
            '$scope',            
            TourListController
        ]);

})();