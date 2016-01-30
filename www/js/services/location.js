angular.module('SocketMe.services')
  .factory('Location',
    ['Cache', function (Cache) {
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
        console.log(err)
      }

      function success (position) {
        cache.add({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
      }

      const api = {
        name: 'Location',
        title: 'Location',
        isActive: false,
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
