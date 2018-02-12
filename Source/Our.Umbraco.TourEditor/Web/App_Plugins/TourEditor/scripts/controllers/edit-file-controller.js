(function () {
    "use strict";

    function EditFileController($scope, $routeParams, editorState, appState, umbRequestHelper, navigationService, notificationsService, tourResource) {
        var vm = this;

        var subviewsPath = "~/App_Plugins/TourEditor/backoffice/toureditor/subviews/";

        vm.page = {};
        vm.data = null;
        vm.page.loading = false;
        vm.page.menu = {};
        vm.page.menu.currentSection = appState.getSectionState("currentSection");
        vm.page.menu.currentNode = null;

        vm.page.navigation = [
            {
                "name": "Tour list",
                "icon": "",
                "view": umbRequestHelper.convertVirtualToAbsolutePath(subviewsPath + "tourlist.html"),
                "active": true
            }];

        vm.subviewModel = null;

        function loadTourFile() {
            vm.page.loading = true;
            return tourResource.getTourFile($routeParams.id).then(
                function(data) {
                    vm.data = data;

                    editorState.set(vm.data);

                    vm.subviewModel = vm.data.tours;

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
            'umbRequestHelper',
            'navigationService',
            'notificationsService',
            'Our.Umbraco.TourEditor.TourResource',
            EditFileController
        ]);

})();