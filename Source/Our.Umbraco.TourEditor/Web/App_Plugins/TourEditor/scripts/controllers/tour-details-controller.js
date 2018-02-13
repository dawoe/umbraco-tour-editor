(function () {
    "use strict";

    function TourDetailsController($scope, eventsService) {
        var vm = this;
        vm.tour = null;

        var evts = [];

        evts.push(eventsService.on("toureditor.edittour", function (name, arg) {
            vm.tour = $scope.model[arg];
        }));

        //ensure to unregister from all events!
        $scope.$on('$destroy', function () {
            for (var e in evts) {
                eventsService.unsubscribe(evts[e]);
            }
        });

    }

    angular.module("umbraco").controller("Our.Umbraco.TourEditor.TourDetailsController",
        [
            '$scope',
            'eventsService',
            TourDetailsController
        ]);

})();