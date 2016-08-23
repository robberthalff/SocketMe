angular.module('SocketMe.services')
  .factory('Orientation',
    ['Cache', '$log',
      function (Cache, $log) {
        const cache = Cache.create('orientation')

        function deviceOrientationListener (event) {
          api.status = {
            absolute: event.absolute,
            alpha: event.alpha,
            beta: event.beta,
            gamma: event.gamma
          }
          cache.add(api.status)
        }

        const api = {
          name: 'Orientation',
          title: 'Orientation',
          isActive: false,
          status: {},
          start: function () {
            if (!api.isActive) {
              api.isActive = true
              window.addEventListener(
                'deviceorientation',
                deviceOrientationListener
              )
            }
          },
          stop: function () {
            if (api.isActive) {
              api.isActive = false
              window.removeEventListener(
                'deviceorientation',
                deviceOrientationListener
              )
              cache.clear()
            }
          }
        }
        return api
      }])
