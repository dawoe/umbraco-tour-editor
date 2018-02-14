(function () {
    "use strict";

    function TourDetailsController($scope, eventsService, sectionResource) {
        var vm = this;
        vm.tour = null;
        vm.allSections = [];

        vm.properties = {
            'Name': { 'label': 'Name', 'description': 'Enter the name for this tour' },
            'Group': { 'label': 'Group', 'description': 'Enter the group name for this tour', 'propertyErrorMessage': 'Enter the group name for this tour' },
            'Alias': { 'label': 'Alias', 'description': 'Enter the alias for this tour', 'propertyErrorMessage': 'This is a required field' },
            'Sections': { 'label': 'Sections', 'description' : 'Select the sections needed for this tour' },
            'Enabled': { 'label': 'Enable this setting' }
        };

        var evts = [];

        evts.push(eventsService.on("toureditor.edittour", function (name, arg) {
            vm.tour = $scope.model[arg];
        }));

        //ensure to unregister from all events!
        $scope.$on('$destroy', function () {
            for (var e in evts) {
                eventsService.unsubscribe(evts[e]);
            }
        });

        function init() {
            sectionResource.getAllSections().then(function (data) {
                console.log(data);
                vm.allSections = data;
            });
        }

        init();

    }

    angular.module("umbraco").controller("Our.Umbraco.TourEditor.TourDetailsController",
        [
            '$scope',
            'eventsService',
            'sectionResource',
            TourDetailsController
        ]);

})();