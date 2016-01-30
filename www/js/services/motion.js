angular.module('SocketMe.services')
  .factory('Motion',
    ['$cordovaDeviceMotion', 'Cache', function ($cordovaDeviceMotion, Cache) {
      const cache = Cache.create('motion')
      var watch

      const options = {frequency: 1000}
      const api = {
        name: 'Motion',
        title: 'Motion',
        isActive: false,
        start: function () {
          if (!api.isActive) {
            api.isActive = true
            watch = $cordovaDeviceMotion.watchAcceleration(options)
            if (watch) {
              watch.then(
                null,
                function (error) {
                  console.log(error)
                },
                function (result) {
                  cache.add({
                    x: result.x,
                    y: result.y,
                    z: result.z,
                    timeStamp: result.timeStamp
                  })
                })
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
