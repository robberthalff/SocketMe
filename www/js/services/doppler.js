// Not working yet.
angular.module('SocketMe.services')
  .factory('Doppler',
    [ 'Cache',
      '$log',
      function (Cache, $log) {
        const cache = Cache.create('doppler')
        const doppler = window.doppler

        function success (result) {
          api.status = result
          cache.add(api.status)
        }

        const api = {
          name: 'Doppler',
          title: 'Doppler',
          isActive: false,
          status: {},
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
