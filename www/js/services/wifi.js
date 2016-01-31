angular.module('SocketMe.services')
  .factory('Wifi',
    [ 'Cache',
      '$log',
      function (Cache, $log) {
        const cache = Cache.create('wifi')
        const wifi = navigator.wifi
        const options = {frequency: 1000}
        var watchID;

        function error(error) {
          $log.error(error)
        }

        // BSSID: Address of the access point
        // SSID: Network name
        // level: RSSI
        function success(result) {
          cache.add(result)
        }

        const api = {
          name: 'Wifi',
          title: 'Wifi',
          isActive: false,
          start: function () {
            if (!api.isActive) {
              api.isActive = true
              watchID = wifi.watchAccessPoints(success, error, options)
            }
          },
          stop: function () {
            if (api.isActive) {
              api.isActive = false
              cache.clear()
              if (watchID) {
                wifi.clearWatch()
              }
            }
          }
        }
        return api
      }])
