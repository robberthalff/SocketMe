/* global io */
angular.module('SocketMe.services')
  .factory('SocketMe', [
    '$rootScope',
    'Cache',
    '$log',
    '$interval',
    function ($rootScope, Cache, $log, $interval) {
      const socket_url = 'https://robberthalff.com'
      // var socket_url = 'http://192.168.1.114:3030'
      var stopInterval
      var frequency = 2000

      function pollData () {
        if (api.socket) {
          const payload = Cache.peek()
          if (Cache.isDirty()) {
            $log.debug('SocketMe: Cache is Dirty, sending/broadcast')
            payload.ts = Date.now()
            $log.debug('SocketMe: payload', JSON.stringify(payload))
            api.socket.emit('input', payload)
            $rootScope.$broadcast('socket:send', payload)
            Cache.flush()
          } else {
            $log.debug('SocketMe: Cache not dirty skipping')
          }
        }
      }

      const api = {
        socket: null,
        connect: function () {
          if (api.socket) {
            api.socket.disconnect()
          }
          $log.info('Connecting to %s', socket_url)
          api.socket = io(socket_url, {path: '/ws'})
          stopInterval = $interval(pollData, frequency, 0, false)
        },
        disconnect: function () {
          $interval.cancel(stopInterval)
          if (api.socket) {
            $log.info('Disconnected from %s', socket_url)
            api.socket.disconnect()
          }
        }
      }
      return api
    }])
