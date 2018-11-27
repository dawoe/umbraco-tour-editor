(function () {
    "use strict";

    function TourResource($http, umbRequestHelper) {

        var apiUrl = Umbraco.Sys.ServerVariables["Our.Umbraco.TourEditor"].TourEditorApi;

        var resource = {
            createTourFile: createTourFile,
            deleteTourFile: deleteTourFile,
            getTourFile: getTourFile,
            saveTourFile: saveTourFile,
            getAliases: getAliases,
            getGroups: getGroups,
            getCultures: getCultures,
            getCustomViews: getCustomViews,
            uploadTour : uploadTour
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

        function getTourFile(filename) {
            return umbRequestHelper.resourcePromise(
                $http.get(apiUrl + "GetTourFile?filename=" + filename),
                "Failed loading tourfile"
            );
        }

        function saveTourFile(fileData) {

            var data = JSON.stringify(fileData);

            return umbRequestHelper.resourcePromise(
                $http.post(apiUrl + "SaveTourFile", data),
                "Failed saving tourfile"
            );
        }

        function getAliases(filename) {
            return umbRequestHelper.resourcePromise(
                $http.get(apiUrl + "GetAliases?filename=" + filename),
                "Failed loading tourfile"
            );
        }

        function getGroups(filename) {
            return umbRequestHelper.resourcePromise(
                $http.get(apiUrl + "GetGroups?filename=" + filename),
                "Failed loading tourfile"
            );
        }

        function getCultures() {
            return umbRequestHelper.resourcePromise(
                $http.get(apiUrl + "GetCultures"),
                "Failed loading cultures"
            );
        }

        function getCustomViews() {
            return umbRequestHelper.resourcePromise(
                $http.get(apiUrl + "GetCustomViews"),
                "Failed loading custom views"
            );
        }

        function uploadTour(file) {
            return umbRequestHelper.resourcePromise(
                $http({
                        method: 'POST',
                        url: apiUrl + "UploadTour",
                        // If using Angular version <1.3, use Content-Type: false.
                        // Otherwise, use Content-Type: undefined,
                        data: file,
                        transformRequest: function (data) {
                            var formData = new FormData();
                            formData.append('file', data, data.name);
                            return formData;
                        },
                        headers: { 'Content-Type': false }                        
                    }),
                "Failed uploading tours"
            );
        }
    }

    angular.module("umbraco.resources").factory("Our.Umbraco.TourEditor.TourResource", TourResource);

})();