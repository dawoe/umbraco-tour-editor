(function () {
    "use strict";

    function ElementPickerOverlayController($scope, $q, treeResource) {
        var vm = this;

        vm.isLoading = true;
        vm.promises = {};

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
        }];

       

        function pickElement(eventElement) {           
            $scope.model.submit("[data-element='" + eventElement + "']");
        }

        vm.pickElement = pickElement;

        // handle data when all promises are resolved
        $q.all(vm.promises).then(function() {
          
            for (var key in vm.promises.trees) {
                if (vm.promises.trees.hasOwnProperty(key)) {
                    vm.promises.trees[key].then(function(data) {
                       if (data.isContainer) {
                           console.log(data);
                       }
                    });
                }
            }

            vm.isLoading = false;
        }); 
                
        function init() {

            // store promises based on sections
            vm.promises.trees = {};
            for (var i = 0; i < vm.sections.length; i++) {
                var alias = vm.sections[i].alias;

               
                vm.promises.trees["sectiontrees-" + alias] = treeResource.loadApplication({
                    "section": alias,
                    "isDialig": true
                });
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