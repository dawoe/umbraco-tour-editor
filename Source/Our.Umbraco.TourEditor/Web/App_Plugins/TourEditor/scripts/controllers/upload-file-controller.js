(function () {
    "use strict";

    function UploadFileController($scope) {
        var vm = this;

        vm.canUpload = false;

        vm.rebuildUpload = 1;

        //listen for when a file is selected
        $scope.$on("filesSelected", function (event, args) {
            console.log(event);
            console.log(args);
            vm.canUpload = true;
        });
    }

    angular.module("umbraco").controller("Our.Umbraco.TourEditor.UploadFileController",
        [
            '$scope',           
            UploadFileController
        ]);

})();