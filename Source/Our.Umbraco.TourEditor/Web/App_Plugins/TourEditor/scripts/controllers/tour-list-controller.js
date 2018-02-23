(function () {
    "use strict";

    function TourListController($scope, eventsService) {
        var vm = this;        
        vm.tours = $scope.model.tours;
        vm.filename = $scope.model.fileName;

        function editTour(index) {
            eventsService.emit('toureditor.edittour', index);
        }

        function removeTour(index) {
            vm.tours.splice(index);
        }

        function addTour() {
            var newTour = {
                "name": "",
                "alias": "",
                "group": "", 
                "groupOrder" : 100,
                "allowDisable": false,
                "requiredSections": [],
                "steps": []
            };

            vm.tours.push(newTour);

            eventsService.emit('toureditor.edittour', vm.tours.length-1);
        }

        vm.addTour = addTour;
        vm.removeTour = removeTour;
        vm.editTour = editTour;
    }

    angular.module("umbraco").controller("Our.Umbraco.TourEditor.TourListController",
        [
            '$scope',
            'eventsService',
            TourListController
        ]);

})();