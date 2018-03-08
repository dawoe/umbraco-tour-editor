(function () {
    'use strict';
    function RequiredInputController($scope) {
        var vm = this;
        var element = angular.element($scope.model.currentStep.element);        
        vm.error = false;
        vm.initNextStep = initNextStep;
        function initNextStep() {
            if (element.val().toLowerCase() === $scope.model.currentStep.customProperties.input) {
                $scope.model.nextStep();
            } else {
                vm.error = true;
            }
        }
    }
    angular.module('umbraco').controller('Our.Umbraco.TourEditor.RequiredInputController', RequiredInputController);
}());