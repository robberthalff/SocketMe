angular.module('SocketMe.services')
  .factory('Compass',
    ['Cache', '$log',
      function (Cache, $log) {
        const cache = Cache.create('compass')
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
          api.status = {
            magneticHeading: result.magneticHeading,
            trueHeading: result.trueHeading,
            accuracy: result.headingAccuracy,
            timeStamp: result.timestamp
          }
          cache.add(api.status)
        }

        function error (err) {
          $log.error(err)
        }

        const api = {
          name: 'Compass',
          title: 'Compass',
          isActive: false,
          status: {},
          start: function () {
            if (!api.isActive) {
              api.isActive = true
              watchID = compass.watchHeading(success, error /* , options */)
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
