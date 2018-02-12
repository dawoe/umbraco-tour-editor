(function () {
    "use strict";

    function TourResource($http, umbRequestHelper) {

        var apiUrl = Umbraco.Sys.ServerVariables["Our.Umbraco.TourEditor"].TourEditorApi;

        var resource = {
            createTourFile: createTourFile,
            deleteTourFile: deleteTourFile
        };

        return resource;

        function createTourFile(filename) {
           
            return umbRequestHelper.resourcePromise(
                $http.post(apiUrl + "CreateTourFile?filename=" + filename),
                "Failed creating tourfile"
            );
        };

        function deleteTourFile(filename) {

            return umbRequestHelper.resourcePromise(
                $http.post(apiUrl + "DeleteTourFile?filename=" + filename),
                "Failed deleting tourfile"
            );
        };

    }

    angular.module("umbraco.resources").factory("Our.Umbraco.TourEditor.TourResource", TourResource);

})();