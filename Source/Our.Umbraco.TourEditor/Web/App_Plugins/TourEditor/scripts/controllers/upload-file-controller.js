(function () {
    "use strict";

    function UploadFileController($scope, notificationsService) {
        var vm = this;

        vm.canUpload = false;
        vm.fileError = false;
        vm.file = null;
        vm.formData = null;

        //listen for when a file is selected
        $scope.$on("filesSelected", function (event, args) {
            $scope.$apply(function() {
                vm.canUpload = false;
                vm.fileError = false;
                vm.file = null;
                vm.formData = null;
                if (args.files && args.files.length > 0) {
                    var file = args.files[0];
                    
                    if (file.name.endsWith('.json')) {
                        vm.canUpload = true;
                        vm.file = file;
                        vm.formData = new FormData();
                        vm.formData.append('file', file, file.name);
                        console.log(vm.formData);
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
            UploadFileController
        ]);

})();