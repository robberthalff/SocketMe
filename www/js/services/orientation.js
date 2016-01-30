angular.module('SocketMe.services')
  .factory('Orientation',
    ['Cache', function (Cache) {
      const cache = Cache.create('orientation')
      var watchID
      const compass = navigator.compass

      // if frequency is set, filter is ignored
      /*
      const options = {
        filter: 5 // change in degrees
        // frequency: 1000
      }
      */

      function success (result) {
        // updates constantly (depending on frequency value)
        cache.add({
          magneticHeading: result.magneticHeading,
          trueHeading: result.trueHeading,
          accuracy: result.headingAccuracy,
          timeStamp: result.timestamp
        })
      }

      function error (err) {
        console.log(err)
      }

      const api = {
        name: 'Orientation',
        title: 'Orientation',
        isActive: false,
        start: function () {
          if (!api.isActive) {
            api.isActive = true
            watchID = compass.watchHeading(success, error /*, options*/)
          }
        },
        stop: function () {
          if (api.isActive) {
            api.isActive = false
            if (watchID) {
              compass.clearWatch(watchID)
            }
            cache.clear()
          }
        }
      }
      return api
    }])
