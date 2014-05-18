var app = angular.module("app", [
    'app.controllers',
    'app.directives'
]);

/**
 * Sample controller
 */
angular.module('app.controllers', [])
    .controller('SampleCtrl', ['$scope', '$http', '$timeout',
    function ($scope, $http, $timeout) {
        'use strict';
        

        var getData;

        $scope.forceLoadData = function () {
            $scope.usrs.callLoad();
        };

        getData = function (id) {
            return $timeout(function () {
                return $http.get('sampledata.json').success(function (response) {
                    $scope.users = response.users;
                });
            }, 2000);
            
        };

        $scope.loadData = function (id) {
            return getData.call(this, id);
        }
    }
]);



/**
 * Loading data directive
 * @author Adam Dymowski
 * @year 2014
 */
angular.module('app.directives', [])
    .directive('loadData', function() {
    'use strict';
    return {
        scope: { method: '&call' },
        link: function($scope, element, attrs, ctrl) {
            var alias = attrs.loadData;
            $scope.attrs = attrs;
            if (alias) {
                $scope.$parent[alias] = ctrl;
            }
            ctrl.loadData(element);
        },
        controller: function ($scope) {
            this.callLoad = function (args) {
                this.loadData($scope.attrs.$$element, args);
            };
            this.loadData  = function (element, args) {
                var promise,
                    spinner = angular
                        .element('<div class="spinner" data-ng-show="loading">loading...</div>');
                element.hide();
                element.after(spinner);

                promise = $scope.$parent[$scope.attrs.call.substr(0, $scope.attrs.call.length-2)](args);
                promise.then(function() {
                    spinner.remove();
                    element.fadeIn();
                });
            };
        }
    };
});