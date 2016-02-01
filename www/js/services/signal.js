angular.module('SocketMe.services')
  .factory('Signal',
    ['Cache',
      '$interval',
      '$log',
      function (Cache, $interval, $log) {
        const dbm = window.SignalStrength ? window.SignalStrength.dbm : null
        const cache = Cache.create('signal')
        var stopInterval
        const frequency = 2000

        function getStrength (dBm) {
          api.status = {dBm: dBm}
          cache.add(api.status)
        }

        function watchSignal (dBm) {
          if (dbm) dbm(getStrength)
        }

        const api = {
          name: 'Signal',
          title: 'Signal',
          isActive: false,
          status: {},
          start: function start () {
            if (!api.isActive) {
              api.isActive = true
              if (!stopInterval) {
                stopInterval = $interval(watchSignal, frequency, 0, false)
              }
            }
          },
          stop: function stop () {
            if (api.isActive) {
              api.isActive = false
              if (stopInterval) {
                $interval.cancel(stopInterval)
                stopInterval = null
              }
              cache.clear()
            }
          }
        }
        return api
      }])
