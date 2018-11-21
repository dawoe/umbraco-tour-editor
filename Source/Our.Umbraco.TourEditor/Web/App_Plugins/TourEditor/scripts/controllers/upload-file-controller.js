(function () {
    "use strict";

    function UploadFileController($scope, notificationsService) {
        var vm = this;

        vm.canUpload = false;
        vm.fileError = false;

        //listen for when a file is selected
        $scope.$on("filesSelected", function (event, args) {
            $scope.$apply(function() {
                vm.canUpload = false;
                vm.fileError = false;
                if (args.files && args.files.length > 0) {
                    var file = args.files[0];

                    if (file.name.endsWith('.json')) {
                        vm.canUpload = true;
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