angular.module('SocketMe.services')
  .factory('Config',
    [ '$log',
      function ($log) {
        const config = {
          socket: {
            frequency: 2000
          }
        }
        return config
      }])
