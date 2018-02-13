(function () {
    "use strict";

    function TourListController($scope, eventsService) {
        var vm = this;        
        vm.tours = $scope.model;

        function editTour(item, index) {
            eventsService.emit('toureditor.edittour', index);
        }

        vm.editTour = editTour;
    }

    angular.module("umbraco").controller("Our.Umbraco.TourEditor.TourListController",
        [
            '$scope',
            'eventsService',
            TourListController
        ]);

})();