// Not working yet.
angular.module('SocketMe.services')
  .factory('Doppler',
    [ 'Cache',
      '$log',
      function (Cache, $log) {
        const cache = Cache.create('doppler')
        const doppler = window.doppler

        // BSSID: Address of the access point
        // SSID: Network name
        // level: RSSI
        function success(result) {
          cache.add(result)
        }

        const api = {
          name: 'Doppler',
          title: 'Doppler',
          isActive: false,
          start: function () {
            if (!api.isActive) {
              api.isActive = true
              doppler.init(success)
            }
          },
          stop: function () {
            if (api.isActive) {
              api.isActive = false
              cache.clear()
              doppler.stop()
            }
          }
        }
        return api
      }])
