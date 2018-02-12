(function () {
    "use strict";

    function TourListController($scope) {
        var vm = this;

        vm.tours = $scope.model;       
    }

    angular.module("umbraco").controller("Our.Umbraco.TourEditor.TourListController",
        [
            '$scope',            
            TourListController
        ]);

})();