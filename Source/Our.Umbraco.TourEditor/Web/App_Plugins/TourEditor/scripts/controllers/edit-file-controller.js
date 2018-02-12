(function () {
    "use strict";

    function EditFileController($scope, $routeParams, editorState, appState, navigationService, notificationsService, tourResource) {
        var vm = this;

        vm.page = {};
        vm.data = null;
        vm.page.loading = false;
        vm.page.menu = {};
        vm.page.menu.currentSection = appState.getSectionState("currentSection");
        vm.page.menu.currentNode = null;

        function loadTourFile() {
            vm.page.loading = true;
            return tourResource.getTourFile($routeParams.id).then(
                function(data) {
                    vm.data = data;

                    editorState.set(vm.data);

                    vm.page.loading = false;
                },

                function(err) {
                    notificationsService.showNotification(err.data.notifications[0]);
                }
            );
        }

        function init() {
            loadTourFile().then(function() {
                navigationService.syncTree({ tree: "toureditor", path: "-1," + $routeParams.id }).then(function (syncArgs) {
                    vm.page.menu.currentNode = syncArgs.node;
                });
            });
           
        }

        init();
    }


    angular.module("umbraco").controller("Our.Umbraco.TourEditor.EditFileController",
        [
            '$scope',
            '$routeParams',
            'editorState',
            'appState',            
            'navigationService',
            'notificationsService',
            'Our.Umbraco.TourEditor.TourResource',
            EditFileController
        ]);

})();