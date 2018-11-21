(function () {
    "use strict";

    function UploadFileController($scope) {
        var vm = this;

        //listen for when a file is selected
        $scope.$on("filesSelected", function (event, args) {
            console.log(event);
            console.log(args);
        });
    }

    angular.module("umbraco").controller("Our.Umbraco.TourEditor.UploadFileController",
        [
            '$scope',           
            UploadFileController
        ]);

})();