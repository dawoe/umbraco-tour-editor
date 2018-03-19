(function () {
    "use strict";

    function ElementPickerOverlayController($scope, $q, treeResource) {
        var vm = this;

        vm.isLoading = true;
        vm.promises = [];
        vm.trees = [];

        // get sections in correct format for view
        vm.sections = _.map($scope.model.sections, function(x) {
            return {
                "alias": x.alias,
                "icon": x.icon,
                "name": x.name,
                "element": "section-" + x.alias
            };
        });

        // add sections tab
        vm.tabs = [{
            active: true,
            id: 1,
            label: "Sections",
            alias: "sections",
            items : vm.sections
        }, {
            active: false,
            id: 2,
            label: "Trees",
            alias: "trees",
            items : vm.trees
        }];

       

        function pickElement(eventElement) {           
            $scope.model.submit("[data-element='" + eventElement + "']");
        }

        vm.pickElement = pickElement;

        // handle data when all promises are resolved
        $q.all(vm.promises).then(function (resolved) {                       
            vm.isLoading = false;
        }); 
                
        function init() {

            // store promises based on sections           
            for (var i = 0; i < vm.sections.length; i++) {
                var alias = vm.sections[i].alias;

                var promise = treeResource.loadApplication({"section": alias,"isDialig": true}).then(function(data) {
                    if (data.isContainer) {
                        for (var i = 0; i < data.children.length; i++) {
                            var tree = data.children[i];
                            vm.trees.push({
                                "alias": tree.metaData.treeAlias,
                                "name": tree.name,
                                "icon": tree.icon,
                                "element": "tree-item-" + tree.metaData.treeAlias
                            });                            
                        }
                    }
                });

               
                vm.promises.push(promise);
            }            
        }

        init();
    }


    angular.module("umbraco").controller("Our.Umbraco.TourEditor.ElementPickerOverlayController",
        [
            '$scope',
            '$q',
            'treeResource',
            ElementPickerOverlayController
        ]);

})();