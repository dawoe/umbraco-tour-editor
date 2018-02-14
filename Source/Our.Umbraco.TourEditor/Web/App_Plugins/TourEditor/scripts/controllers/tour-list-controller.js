(function () {
    "use strict";

    function TourListController($scope, eventsService) {
        var vm = this;        
        vm.tours = $scope.model;

        function editTour(item, index) {
            eventsService.emit('toureditor.edittour', index);
        }

        function addTour() {
            var newTour = {
                "name": "",
                "alias": "",
                "group": "",
                "requiredSections": [],
                "steps": []
            };

            vm.tours.push(newTour);

            eventsService.emit('toureditor.edittour', vm.tours.length-1);
        }

        vm.addTour = addTour;

        vm.editTour = editTour;
    }

    angular.module("umbraco").controller("Our.Umbraco.TourEditor.TourListController",
        [
            '$scope',
            'eventsService',
            TourListController
        ]);

})();