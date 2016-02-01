angular.module('SocketMe.services')
  .factory('Motion',
    ['$cordovaDeviceMotion',
      'Cache',
      '$log',
      function ($cordovaDeviceMotion, Cache, $log) {
        const cache = Cache.create('motion')
        var watch

        function error (error) {
          $log.error(error)
        }

        function success (result) {
          api.status = {
            x: result.x,
            y: result.y,
            z: result.z,
            timeStamp: result.timeStamp
          }
          cache.add(api.status)
        }

        const options = {frequency: 1000}
        const api = {
          name: 'Motion',
          title: 'Motion',
          isActive: false,
          status: {},
          start: function () {
            if (!api.isActive) {
              api.isActive = true
              watch = $cordovaDeviceMotion.watchAcceleration(options)
              if (watch) {
                watch.then(null, error, success)
              }
            }
          },
          stop: function () {
            if (api.isActive) {
              api.isActive = false
              cache.clear()
              if (watch) {
                watch.clearWatch()
              }
            }
          }
        }
        return api
      }])
