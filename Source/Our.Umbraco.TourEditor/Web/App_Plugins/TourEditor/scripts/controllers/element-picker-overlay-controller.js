(function () {
    "use strict";

    function ElementPickerOverlayController($scope, $q, treeResource, dashboardResource) {
        var vm = this;

        vm.isLoading = true;
        vm.promises = [];
        vm.trees = [];
        vm.dashboards = [];
        vm.promiseObj = {};

        // get sections in correct format for view
        vm.sections = _.map($scope.model.sections, function (x) {
            return {
                "alias": x.alias,
                "icon": x.icon,
                "name": x.name,
                "element": "section-" + x.alias
            };
        });

        vm.other = [
            {
                "alias": "avatar",
                "icon": "icon-user",
                "name": "Avatar",
                "element": "section-user"
            },
            {
                "alias": "help",
                "icon": "icon-help-alt",
                "name": "Help",
                "element": "section-help"
            },
            {
                "alias": "search",
                "icon": "icon-search",
                "name": "Search",
                "element": "global-search-field"
            }
        ];

        // add sections tab
        vm.tabs = [
            {
                active: true,
                id: 1,
                label: "Sections",
                alias: "sections",
                items: vm.sections
            }
        ];



        function pickElement(eventElement) {
            $scope.model.submit("[data-element='" + eventElement + "']");
        }

        vm.pickElement = pickElement;

        function getTrees(section) {
            var deferred = $q.defer();

            treeResource.loadApplication({ "section": section, "isDialog": true }).then(function (data) {
                var trees = [];
                if (data.isContainer) {
                    for (var i = 0; i < data.children.length; i++) {
                        var tree = data.children[i];
                        trees.push({
                            "alias": tree.metaData.treeAlias,
                            "name": tree.name,
                            "icon": tree.icon,
                            "element": "tree-item-" + tree.metaData.treeAlias
                        });
                    }
                }

                deferred.resolve(trees);
            }, function () {
                deferred.reject();
            });

            return deferred.promise;
        }

        function getDashBoards(section) {
            var deferred = $q.defer();

            dashboardResource.getDashboard(section).then(function (data) {
                var dashboards = [];
                for (var i = 0; i < data.length; i++) {
                    var dashboard = data[i];
                    dashboards.push(
                        {
                            "alias": dashboard.alias,
                            "name": dashboard.label,
                            "icon": "icon-dashboard",
                            "element": "tab-" + dashboard.alias
                        }
                    );
                }

                deferred.resolve(dashboards);
            }, function () {
                deferred.reject();
            });            

            return deferred.promise;
        }

        function init() {            
            // store promises based on sections           
            for (var i = 0; i < vm.sections.length; i++) {
                var alias = vm.sections[i].alias;
               
                vm.promiseObj['tree' + alias] = getTrees(alias);
                vm.promiseObj['dashboard' + alias] = getDashBoards(alias);               
            }           

            // handle data when all promises are resolved
            $q.all(vm.promiseObj).then(function (values) {

                var keys = Object.keys(values);
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];

                    if (key.startsWith('tree')) {                        
                       vm.trees =  vm.trees.concat(values[key]);
                    }

                    if (key.startsWith('dashboard')) {
                        vm.dashboards = vm.dashboards.concat(values[key]);
                    }
                }

                if (vm.trees.length > 0) {
                    vm.tabs.push({
                        active: false,
                        id: vm.tabs.length + 1,
                        label: "Trees",
                        alias: "trees",
                        items: vm.trees
                    });
                }

                if (vm.dashboards.length > 0) {
                    vm.tabs.push({
                        active: false,
                        id: vm.tabs.length + 1,
                        label: "Dashboards",
                        alias: "Dashboards",
                        items: vm.dashboards
                    });
                }

                if (vm.other.length > 0) {
                    vm.tabs.push({
                        active: false,
                        id: vm.tabs.length + 1,
                        label: "Other",
                        alias: "other",
                        items: vm.other
                    });
                }

                vm.isLoading = false;
            });
        }

        init();
    }


    angular.module("umbraco").controller("Our.Umbraco.TourEditor.ElementPickerOverlayController",
        [
            '$scope',
            '$q',
            'treeResource',
            'dashboardResource',
            ElementPickerOverlayController
        ]);

})();