(function () {
    'use strict';
    function TourNameController($scope) {
        var vm = this;
        var element = angular.element($scope.model.currentStep.element);
        vm.error = false;
        vm.initNextStep = initNextStep;
        function initNextStep() {
            if (element.val().toLowerCase() === 'extending-media-type') {
                $scope.model.nextStep();
            } else {
                vm.error = true;
            }
        }
    }
    angular.module('umbraco').controller('Our.Umbraco.TourEditor.TourNameController', TourNameController);
}());