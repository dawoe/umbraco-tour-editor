(function () {
    "use strict";

    function UploadFileController($scope, notificationsService, tourResource) {
        var vm = this;

        vm.canUpload = false;
        vm.fileError = false;
        vm.file = null;
        
        function upload() {
            tourResource.uploadTour(vm.file).then(function(data) {
                console.log(data);
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
            'Our.Umbraco.TourEditor.TourResource',
            UploadFileController
        ]);

})();