﻿(function () {
    "use strict";

    function UploadFileController($scope, notificationsService, navigationService, tourResource) {
        var vm = this;

        vm.canUpload = false;
        vm.fileError = false;
        vm.file = null;
        vm.isUploading = false;
        
        function upload() {
            vm.isUploading = true;
            tourResource.uploadTour(vm.file).then(function(data) {
                    vm.isUploading = false;
            },
            function (err) {
                notificationsService.showNotification(err.data.notifications[0]);                
                vm.isUploading = false;
                navigationService.hideMenu();
            });
        }

        vm.uploadFile = upload;

        //listen for when a file is selected
        $scope.$on("filesSelected", function (event, args) {
            $scope.$apply(function() {
                vm.canUpload = false;
                vm.fileError = false;
                vm.file = null;               
                if (args.files && args.files.length > 0) {
                    var file = args.files[0];
                    
                    if (file.name.endsWith('.json')) {
                        vm.canUpload = true;
                        vm.file = file;                                         
                    } else {
                        vm.fileError = true;
                    }
                }
            });
        });
    }

    angular.module("umbraco").controller("Our.Umbraco.TourEditor.UploadFileController",
        [
            '$scope', 
            'notificationsService',
            'navigationService',
            'Our.Umbraco.TourEditor.TourResource',
            UploadFileController
        ]);

})();