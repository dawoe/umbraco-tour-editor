(function () {
    "use strict";

    function TourResource($http, umbRequestHelper) {

        var apiUrl = Umbraco.Sys.ServerVariables["Our.Umbraco.TourEditor"].TourEditorApi;

        var resource = {
            createTourFile: createTourFile
        };

        return resource;

        function createTourFile(filename) {
            var data = JSON.stringify({ filename: filename });

            return umbRequestHelper.resourcePromise(
                $http.post(apiUrl + "CreateTourFile", data),
                "Failed creating tourfile"
            );
        };

    }

    angular.module("umbraco.resources").factory("Our.Umbraco.TourEditor.TourResource", TourResource);

})();