angular.module('SocketMe.controllers')
  .controller('DashCtrl', [
    '$scope',
    'SocketMe',
    '$log',
    function ($scope, SocketMe, $log) {
      $scope.socket = {
        connect: false
      }
      $scope.toggleIt = function () {
        if ($scope.socket.connect) {
          $log.info('Connecting to socket')
          SocketMe.connect()
        } else {
          $log.info('Disonnecting from socket')
          SocketMe.disconnect()
        }
      }
    }])
