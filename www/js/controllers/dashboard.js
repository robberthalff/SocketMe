angular.module('SocketMe.controllers')
  .controller('DashCtrl', [
    '$scope',
    'SocketMe',
    '$log',
    '$timeout',
    function ($scope, SocketMe, $log, $timeout) {

      function findByUrl(url) {
        return $scope.connections.find(function(_conn) {
          return _conn.url === url
        })
      }
      $scope.connections = [
        {
          text: 'RobbertHalff.com',
          url: 'https://robberthalff.com',
          path: '/ws',
          connect: false
        },
        {
          text: 'RobbertHalff (dev)',
          url: 'http://192.168.1.114:3030',
          path: '/ws',
          connect: false
        }
      ]
      $scope.$on('socket:status', function(ev, data) {
        $timeout(function() {
          const conn = findByUrl(data.url)
          conn.status = data.status
        })
      })
      $scope.toggleIt = function (socket) {
        if (socket.connect) {
          $log.info('Connecting to socket')
          const opts = socket.path ? {path: socket.path} : {}
          SocketMe.connect(socket.url, opts)
        } else {
          $log.info('Disconnecting from socket')
          SocketMe.disconnect(socket.url)
        }
      }
    }])
