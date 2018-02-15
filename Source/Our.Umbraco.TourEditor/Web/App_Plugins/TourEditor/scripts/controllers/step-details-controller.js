(function () {
    "use strict";

    function StepDetailsController($scope, eventsService, formHelper) {
        var vm = this;
        vm.step = null;
        vm.stepIndex = -1;
        vm.form = null;

        var evts = [];

        vm.properties = {
            'Title': { 'label': 'Title', 'description': 'Enter the title for this step', 'propertyErrorMessage': 'The title is a required field' },
            'Group': { 'label': 'Group', 'description': 'Enter the group name for this tour', 'propertyErrorMessage': 'The  group name is a required field' },
            'Alias': { 'label': 'Alias', 'description': 'Enter the alias for this tour', 'propertyErrorMessage': 'This is a required field' },
            'Sections': { 'label': 'Sections', 'description': 'Select the sections needed for this tour' },
            'Enabled': { 'label': 'Enable this setting' }
        };

        evts.push(eventsService.on("toureditor.editstep", function (name, arg) {
            vm.stepIndex = arg.stepIndex;
            vm.step = $scope.model.tours[arg.tourIndex].steps[arg.stepIndex];            
        }));

        
        //ensure to unregister from all events!
        $scope.$on('$destroy', function () {
            for (var e in evts) {
                eventsService.unsubscribe(evts[e]);
            }
        });

        

    }

    angular.module("umbraco").controller("Our.Umbraco.TourEditor.StepDetailsController",
        [
            '$scope',
            'eventsService',           
            'formHelper',
            StepDetailsController
        ]);

})();