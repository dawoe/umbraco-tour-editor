(function () {
    "use strict";

    function TourDetailsController($scope, eventsService, sectionResource) {
        var vm = this;
        vm.tour = null;
        vm.allSections = [];
        vm.selectedSections = [];

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

            // get the selected sections from data
            vm.selectedSections = _.filter(vm.allSections,
                function(section) {
                    return _.contains(vm.tour.requiredSections, section.alias);
                });            
        }));

        //ensure to unregister from all events!
        $scope.$on('$destroy', function () {
            for (var e in evts) {
                eventsService.unsubscribe(evts[e]);
            }
        });

        function openSectionPicker() {
            vm.sectionPicker = {
                view: 'sectionpicker',
                selection: vm.selectedSections,
                closeButtonLabel: vm.labels.cancel,
                show: true,
                submit: function (model) {
                    vm.sectionPicker.show = false;
                    vm.sectionPicker = null;
                },
                close: function (oldModel) {
                    if (oldModel.selection) {
                        vm.userGroup.sections = oldModel.selection;
                    }
                    vm.sectionPicker.show = false;
                    vm.sectionPicker = null;
                }
            };
        }

        vm.openSectionPicker = openSectionPicker;

        function removeSection(index, selection) {
            if (selection && selection.length > 0) {
                selection.splice(index, 1);
            }

            // update selection of sections on data
            vm.tour.requiredSections = _.map(selection, function(section) { return section.alias });

        }

        vm.removeSection = removeSection;

        function init() {
            sectionResource.getAllSections().then(function (data) {
                vm.allSections = data;
                setSectionIcon(vm.allSections);
            });
        }

        function setSectionIcon(sections) {
            angular.forEach(sections, function (section) {
                section.icon = 'icon-section ' + section.cssclass;
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