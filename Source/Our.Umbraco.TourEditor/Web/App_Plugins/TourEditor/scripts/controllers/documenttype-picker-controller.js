(function () {
    "use strict";

    function DocumentTypePickerOverlayController($scope) {
        var vm = this;

        vm.isLoading = true;
        vm.availableDocumentTypes = $scope.model.doctypes;
        vm.selection = $scope.model.selection;

        function isSelected(alias) {
            return vm.selection.indexOf(alias) > -1;
        }

        vm.isSelected = isSelected;

        function selectItem(alias) {
            var index = vm.selection.indexOf(alias);

            if (index > -1) {
                vm.selection.splice(index, 1);
            } else {
                vm.selection.push(alias);
            }
            
        }

        vm.selectItem = selectItem;
       
        function init() {
            vm.isLoading = false;
        }

        init();

        $scope.$on("formSubmitting",
            function (ev, args) {
                args.scope.model.selection = vm.selection;                
            });
    }


    angular.module("umbraco").controller("Our.Umbraco.TourEditor.DocumentTypePickerOverlayController",
        [
            '$scope',           
            DocumentTypePickerOverlayController
        ]);

})();