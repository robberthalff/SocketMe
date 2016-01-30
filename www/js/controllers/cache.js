angular.module('SocketMe.controllers')
  .controller('CacheCtrl', ['$scope', 'Cache', function ($scope, Cache) {
    $scope.$on('socket:send', function (ev, payload) {
      $scope.$apply(function () {
        $scope.cache = payload
      })
    })

    $scope.clear = function () {
      Cache.clear()
    }
  }])
