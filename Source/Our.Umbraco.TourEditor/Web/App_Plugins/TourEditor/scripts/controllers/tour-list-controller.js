﻿(function () {
    "use strict";

    function TourListController($scope, eventsService) {
        var vm = this;        
        vm.tours = $scope.model.data.tours;
        vm.filename = $scope.model.data.fileName;
        vm.aliases = $scope.model.aliases;

        function editTour(index) {

            // create a deep clone of the tour object
            var tour = JSON.parse(JSON.stringify(vm.tours[index]));

            eventsService.emit('toureditor.edittour',
                {
                    "index": index,
                    "tour": tour,
                    "isNew": false,
                    "aliases" : vm.aliases
                });
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

            //vm.tours.push(newTour);

            eventsService.emit('toureditor.edittour',
                { "index": vm.tours.length, "tour": newTour, "isNew": true, "aliases" : vm.aliases });
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