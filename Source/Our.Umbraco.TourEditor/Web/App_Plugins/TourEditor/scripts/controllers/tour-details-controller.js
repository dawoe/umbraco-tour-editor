(function () {
    "use strict";

    function TourDetailsController($scope, $q, eventsService, sectionResource, formHelper, umbRequestHelper, contentTypeResource, tourResource) {
        var vm = this;
        vm.tour = null;
        vm.tourIndex = -1;
        vm.allSections = [];
        vm.selectedSections = [];
        vm.aliases = [];
        vm.groups = [];
        vm.form = null;
        vm.isNew = false;
        vm.sectionsString = '';
        vm.hasCulture = Umbraco.Sys.ServerVariables["Our.Umbraco.TourEditor"].SupportsCulture;
        vm.cultures = [];
        vm.hasContentType = Umbraco.Sys.ServerVariables["Our.Umbraco.TourEditor"].SupportsContentType;
        vm.documentTypes = [];
        vm.promiseObj = {};

        vm.sortableOptions = {
            distance: 10,
            tolerance: 'move',
            scroll: true,
            zIndex: 6000,
            update: function (event, ui) {
                eventsService.emit('toureditor.sorted');
            }
        }

        vm.properties = {
            'Name': { 'label': 'Name', 'description': 'Enter the name for this tour', 'propertyErrorMessage': 'The name is a required field' },
            'Group': { 'label': 'Group', 'description': 'Enter the group name for this tour. This is used to group tours in the help drawer', 'propertyErrorMessage': 'The  group name is a required field' },
            'GroupOrder': { 'label': 'Group order', 'description': 'Control the order of tour groups', 'propertyErrorMessage': 'The  group order is a required field' },
            'Culture': { 'label': 'Culture', 'description': 'Select the culture for this tour. If set it will only be shown to users with this culture set on their profile' },
            'Alias': { 'label': 'Alias', 'description': 'Enter the unique alias for this tour', 'propertyErrorMessage': 'Alias is a required field and should be unique' },
            'Sections': { 'label': 'Sections', 'description': 'Sections that the tour will access while running, if the user does not have access to the required tour sections, the tour will not load.   ', 'propertyErrorMessage': 'You should select at least one section' },
            'AllowDisable': { 'label': 'Allow disabling', 'description': 'Adds a "Don\'t" show this tour again"-button to the intro step' },
            'ContentType': { 'label' : 'Documenttypes', 'description' : 'Select the documenttypes you want to show this tour to become visible. If you select one or multiple this the tour will only be visible in the help drawer when editing one of documenttypes that you specified.'}
        };

        var evts = [];

        evts.push(eventsService.on("toureditor.edittour", function (name, arg) {
            vm.tourIndex = arg.index;
            vm.tour = arg.tour;
            vm.isNew = arg.isNew;
            vm.aliases = arg.aliases;
            vm.groups = arg.groups;

            // init the sections array
            if (vm.tour.requiredSections === null) {
                vm.tour.requiredSections = [];
            }
            
            if (vm.hasCulture) {
                if (vm.tour.culture === null) {
                    vm.tour.culture = '';
                }                
            }

            if (vm.hasContentType && vm.tour.contentType === null) {
                vm.tour.contentType = '';
            }

           

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
            vm.aliases = [];
            vm.cultures = [];
            eventsService.emit('toureditor.tourchangesdiscarded');
        }));

        evts.push(eventsService.on("toureditor.updatetourchanges", function (name, arg) {
            if (formHelper.submitForm({ scope: $scope, formCtrl: vm.form })) {

                if (vm.tour.culture === '') {
                    vm.tour.culture = null;
                }

                eventsService.emit('toureditor.tourchangesupdate',
                    {
                        "index": vm.tourIndex,
                        "tour": vm.tour,
                        "isNew" : vm.isNew
                });
                vm.tour = null;
                vm.tourIndex = -1;
                vm.selectedSections = [];
                vm.form = null;
                vm.isNew = false;
                vm.aliases = [];
                vm.cultures = [];
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

        function openGroupPicker() {

            var groups = _.map(vm.groups,
                function(x) {
                    return {
                        "name": x,
                        "icon": "icon-tag"
                    };
                });

            vm.groupPicker = {
                view: 'itempicker',                
                availableItems : groups,
                closeButtonLabel: 'Cancel',
                show: true,
                submit: function (model) {                   
                    vm.tour.group = model.selectedItem.name;

                    vm.groupPicker.show = false;
                    vm.groupPicker = null;
                },
                close: function (oldModel) {
                    
                    vm.groupPicker.show = false;
                    vm.groupPicker = null;
                }
            };
        }

        vm.openGroupPicker = openGroupPicker;

        function openDocumentTypePicker() {
            vm.documentTypePicker = {
                view: umbRequestHelper.convertVirtualToAbsolutePath("~/App_Plugins/TourEditor/backoffice/toureditor/overlays/documenttype-picker.html"),
                selection: vm.tour.contentType.split(','),
                doctypes: vm.documentTypes,
                title: 'Document type picker',
                closeButtonLabel: 'Cancel',
                show: true,
                submit: function (model) {
                    
                    vm.tour.contentType = model.selection.join(',');

                    vm.documentTypePicker.show = false;
                    vm.documentTypePicker = null;
                },
                close: function (oldModel) {
                    if (oldModel.selection) {
                        vm.tour.contentType = oldModel.selection.join(',');
                    }
                    vm.documentTypePicker.show = false;
                    vm.documentTypePicker = null;
                }
            };
        }

        vm.openDocumentTypePicker = openDocumentTypePicker;

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

                var editStepModel = {
                    "stepIndex": vm.tour.steps.length,
                    "tourIndex": vm.tourIndex,
                    "step": newStep,
                    "sections": vm.selectedSections
                };

                if (vm.hasContentType) {
                    editStepModel.doctypes = vm.tour.contentType;
                }

                eventsService.emit('toureditor.editstep', editStepModel);

            }
        }

        function toggle() {
            if(vm.tour.allowDisable){
                vm.tour.allowDisable = false;

                return;
            }

            vm.tour.allowDisable = true;
        }

        vm.addStep = addStep;
        vm.toggle = toggle;

        function editStep(index) {
            if (formHelper.submitForm({ scope: $scope, formCtrl: vm.form })) {

                // deep clone
                var step = JSON.parse(JSON.stringify(vm.tour.steps[index]));

                var editStepModel = {
                    "stepIndex": index,
                    "tourIndex": vm.tourIndex,
                    "step": step,
                    "sections": vm.selectedSections
                }

                if (vm.hasContentType) {
                    editStepModel.doctypes = vm.tour.contentType;
                }

                eventsService.emit('toureditor.editstep', editStepModel);

            }
        }

        vm.editStep = editStep;

        function removeStep(index) {
            vm.tour.steps.splice(index, 1);
        }

        vm.removeStep = removeStep;     

        function enrichedDoctypeSelection() {
            var doctypes = [];

            if (vm.tour.contentType === '') {
                return doctypes;
            }

            doctypes = _.filter(vm.documentTypes,
                function(doctype) { return vm.tour.contentType.split(',').indexOf(doctype.alias) > -1 });

            return doctypes;
        }

        vm.enrichedDoctypeSelection = enrichedDoctypeSelection;

        function getSections() {
            var deferred = $q.defer();

            sectionResource.getAllSections().then(function (data) {
               deferred.resolve(data);
            }, function () {
                deferred.reject();
            });

            return deferred.promise;
        }

        function getCultures() {
            var deferred = $q.defer();

            tourResource.getCultures().then(function (data) {
                deferred.resolve(data);
            }, function() {
                deferred.reject();
            });

            return deferred.promise;
        }

        function getDoctypes() {
            var deferred = $q.defer();

            contentTypeResource.getAll().then(function (data) {
                deferred.resolve(data);
            }, function () {
                deferred.reject();
            });

            return deferred.promise;
        }

        function init() {
            
            vm.promiseObj['sections'] = getSections();

            if (vm.hasCulture) {
                vm.promiseObj['cultures'] = getCultures();                
            }

            if (vm.hasContentType) {
                vm.promiseObj['doctypes'] = getDoctypes();
            }

            $q.all(vm.promiseObj).then(function (values) {
                var keys = Object.keys(values);

                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];

                    if (key === 'sections') {
                        vm.allSections = values[key];
                        setSectionIcon(vm.allSections);
                    }

                    if (key === 'cultures') {
                        vm.cultures = values[key];

                        vm.cultures.unshift({ "Key": "", "Value": "No specific culture" });                       
                    }

                    if (key === 'doctypes') {
                        vm.documentTypes = values[key];                        
                    }
                }
            });
        }

        function setSectionIcon(sections) {
            angular.forEach(sections, function (section) {
                section.icon = 'icon-section ' + section.cssclass;
            });
        }

        init();

        $scope.$watch('vm.tour.requiredSections', function () {

            if (vm.tour) {
                if (vm.tour.requiredSections) {
                    vm.sectionsString = vm.tour.requiredSections.join();
                } else {
                    vm.sectionsString = '';
                }
            }

        });

    }

    angular.module("umbraco").controller("Our.Umbraco.TourEditor.TourDetailsController",
        [
            '$scope',
            '$q',
            'eventsService',
            'sectionResource',
            'formHelper',
            'umbRequestHelper',
            'contentTypeResource',
            'Our.Umbraco.TourEditor.TourResource',
            TourDetailsController
        ]);

})();