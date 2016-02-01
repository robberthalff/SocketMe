angular.module('SocketMe.services')
  .factory('Location',
    ['Cache', '$log', function (Cache, $log) {
      const cache = Cache.create('location')
      var watchID
      const geolocation = navigator.geolocation

      /*
      const options = {
        timeout: 3000,
        maximumAge: 3000,
        enableHighAccuracy: true // may cause errors if true
      }
      */

      function error (err) {
        $log.error(err)
      }

      function success (position) {
        api.status = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
        cache.add(api.status)
      }

      const api = {
        name: 'Location',
        title: 'Location',
        isActive: false,
        status: {},
        start: function () {
          if (!api.isActive) {
            api.isActive = true
            watchID = geolocation.watchPosition(success, error /*, options*/)
          }
        },
        stop: function () {
          if (api.isActive) {
            api.isActive = false
            if (watchID) {
              geolocation.clearWatch(watchID)
            }
            cache.clear()
          }
        }
      }
      return api
    }])
