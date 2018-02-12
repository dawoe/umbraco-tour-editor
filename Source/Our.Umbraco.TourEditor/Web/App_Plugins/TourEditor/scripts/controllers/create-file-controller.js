(function () {
    "use strict";

    function CreateFileController($scope, notificationsService, tourResource) {
        var vm = this;

        vm.filename = '';

    }

    angular.module("umbraco").controller("Our.Umbraco.TourEditor.CreateFileController",
        [
            '$scope',
            'notificationsService',
            'Our.Umbraco.TourEditor.TourResource',
            CreateFileController
        ]);

})();