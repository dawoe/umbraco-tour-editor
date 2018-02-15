(function () {
    "use strict";

    function EditFileController($scope, $routeParams, editorState, appState, umbRequestHelper, navigationService, notificationsService, eventsService, tourResource) {
        var vm = this;

        var subviewsPath = "~/App_Plugins/TourEditor/backoffice/toureditor/subviews/";

        vm.page = {};
        vm.data = null;
        vm.page.loading = false;
        vm.page.menu = {};
        vm.page.menu.currentSection = appState.getSectionState("currentSection");
        vm.page.menu.currentNode = null;
        var evts = [];

        vm.page.navigation = [
            {
                "name": "Tour list",
                "icon": "",
                "view": umbRequestHelper.convertVirtualToAbsolutePath(subviewsPath + "tourlist.html"),
                "active": true
            },
            {
                "name": "Tour details",
                "icon": "",
                "view": umbRequestHelper.convertVirtualToAbsolutePath(subviewsPath + "tourdetails.html"),
                "active": false
            },
            {
                "name": "Steps details",
                "icon": "",
                "view": umbRequestHelper.convertVirtualToAbsolutePath(subviewsPath + "stepdetails.html"),
                "active": false
            }];

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

        function returnToTourList() {
            eventsService.emit('toureditor.returntolist');
        }

        vm.returnToTourList = returnToTourList;

        function saveTourFile() {
            tourResource.saveTourFile(vm.data).then(
                function (data) {
                    notificationsService.showNotification(data.notifications[0]);
                    loadTourFile();
                },
                function(err) {
                    notificationsService.showNotification(err.data.notifications[0]);
                });
        }

        vm.saveTourFile = saveTourFile;

        function init() {
            loadTourFile().then(function() {
                navigationService.syncTree({ tree: "toureditor", path: "-1," + $routeParams.id }).then(function (syncArgs) {
                    vm.page.menu.currentNode = syncArgs.node;
                });
            });
           
        }
        
        init();

        evts.push(eventsService.on("toureditor.returntolistSuccess", function (name, error) {
            vm.page.navigation[0].active = true;
            vm.page.navigation[1].active = false;
            vm.page.navigation[2].active = false;
        }));

        evts.push(eventsService.on("toureditor.edittour", function (name, error) {
            vm.page.navigation[0].active = false;
            vm.page.navigation[1].active = true;
            vm.page.navigation[2].active = false;
        }));

        evts.push(eventsService.on("toureditor.editstep", function (name, error) {
            vm.page.navigation[0].active = false;
            vm.page.navigation[1].active = false;
            vm.page.navigation[2].active = true;
        }));

        //ensure to unregister from all events!
        $scope.$on('$destroy', function () {
            for (var e in evts) {
                eventsService.unsubscribe(evts[e]);
            }
        });       
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
            'eventsService',
            'Our.Umbraco.TourEditor.TourResource',
            EditFileController
        ]);

})();