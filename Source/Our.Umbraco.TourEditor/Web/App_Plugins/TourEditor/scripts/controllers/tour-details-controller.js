(function () {
    "use strict";

    function TourDetailsController($scope, eventsService, sectionResource, formHelper) {
        var vm = this;
        vm.tour = null;
        vm.tourIndex = -1;
        vm.allSections = [];
        vm.selectedSections = [];
        vm.form = null;
        vm.isNew = false;

        vm.properties = {
            'Name': { 'label': 'Name', 'description': 'Enter the name for this tour', 'propertyErrorMessage': 'The name is a required field' },
            'Group': { 'label': 'Group', 'description': 'Enter the group name for this tour. This is used to group tours in the help drawer', 'propertyErrorMessage': 'The  group name is a required field' },
            'GroupOrder': { 'label': 'Group order', 'description': 'Control the order of tour groups', 'propertyErrorMessage': 'The  group order is a required field' },
            'Alias': { 'label': 'Alias', 'description': 'Enter the unique alias for this tour', 'propertyErrorMessage': 'Alias is a required field and should be unique' },
            'Sections': { 'label': 'Sections', 'description': 'Sections that the tour will access while running, if the user does not have access to the required tour sections, the tour will not load.   ' },
            'AllowDisable': { 'label': 'Allow disabling', 'description': 'Adds a "Don\'t" show this tour again"-button to the intro step' }
        };

        var evts = [];

        evts.push(eventsService.on("toureditor.edittour", function (name, arg) {
            vm.tourIndex = arg.index;
            vm.tour = arg.tour;
            vm.isNew = arg.isNew;

            // get the selected sections from data
            vm.selectedSections = _.filter(vm.allSections,
                function (section) {
                    return _.contains(vm.tour.requiredSections, section.alias);
                });
        }));

        evts.push(eventsService.on("toureditor.discardtourchanges", function (name, arg) {
            vm.tour = null;
            vm.tourIndex = -1;
            vm.selectedSections = [];
            vm.form = null;
            vm.isNew = false;
            eventsService.emit('toureditor.tourchangesdiscarded');
        }));

        evts.push(eventsService.on("toureditor.updatetourchanges", function (name, arg) {
            if (formHelper.submitForm({ scope: $scope, formCtrl: vm.form })) {
                eventsService.emit('toureditor.tourchangesupdate',
                    {
                        "index": vm.tourIndex,
                        "tour": vm.tour
                });
                vm.tour = null;
                vm.tourIndex = -1;
                vm.selectedSections = [];
                vm.form = null;
                vm.isNew = false;
            }                      
        }));

        evts.push(eventsService.on("toureditor.stepchangesupdate", function (name, args) {
            vm.tour.steps[args.stepIndex] = args.step;
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
                closeButtonLabel: 'Cancel',
                show: true,
                submit: function (model) {

                    // update selection of sections on data
                    vm.tour.requiredSections = _.map(model.selection, function (section) { return section.alias });

                    vm.sectionPicker.show = false;
                    vm.sectionPicker = null;
                },
                close: function (oldModel) {
                    if (oldModel.selection) {
                        vm.selectedSections = oldModel.selection;
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
            vm.tour.requiredSections = _.map(selection, function (section) { return section.alias });

        }

        vm.removeSection = removeSection;

        function addStep() {

            if (formHelper.submitForm({ scope: $scope, formCtrl: vm.form })) {
                var newStep = {
                    "title": "",
                    "content": "",
                    "type": null,
                    "element": null,
                    "elementPreventClick": false,
                    "backdropOpacity": 0.4,
                    "event": null,
                    "view": null,
                    "eventElement": null,
                    "customProperties": null
                };

                //vm.tour.steps.push(newStep);

                eventsService.emit('toureditor.editstep',
                    {
                        "stepIndex": vm.tour.steps.length,
                        "tourIndex": vm.tourIndex,
                        "step" : newStep
                    });

            }
        }

        vm.addStep = addStep;

        function editStep(index) {
            if (formHelper.submitForm({ scope: $scope, formCtrl: vm.form })) {

                // deep clone
                var step = JSON.parse(JSON.stringify(vm.tour.steps[index]));


                eventsService.emit('toureditor.editstep',
                    {
                        "stepIndex": index,
                        "tourIndex": vm.tourIndex,
                        "step": step
            });

            }
        }

        vm.editStep = editStep;

        function removeStep(index) {
            vm.tour.steps.splice(index);
        }

        vm.removeStep = removeStep;

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
            'formHelper',
            TourDetailsController
        ]);

})();