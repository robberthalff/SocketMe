/* global io */
angular.module('SocketMe.services')
  .factory('SocketMe', [
    '$rootScope',
    'Cache',
    '$log',
    '$interval',
    'Config',
    function ($rootScope, Cache, $log, $interval, Config) {
      var stopInterval

      function pollData () {
        const sockets = Object.keys(api.socket)
        if (sockets.length) {
          const payload = Cache.peek()
          if (Cache.isDirty()) {
            $log.debug('SocketMe: Cache is Dirty, sending/broadcast')
            payload.ts = Date.now()
            $log.debug('SocketMe: payload', JSON.stringify(payload))
            sockets.forEach(function (url) {
              api.socket[url].emit('input', payload)
            })
            $rootScope.$broadcast('socket:send', payload)
            Cache.flush()
          } else {
            $log.debug('SocketMe: Cache not dirty skipping')
          }
        }
      }

      const api = {
        socket: {},
        connect: function (url, opts) {
          var socket = api.socket
          if (socket[url]) {
            socket[url].disconnect()
          }
          $log.info('Connecting to %s', url)
          socket[url] = io(url, opts)

          socket[url].on('connect', function onConnect () {
            $rootScope.$broadcast('socket:status', {
              status: 'connected', url: url
            })
            $log.info('Connected to %s', url)
          })
          socket[url].on('disconnect', function onDisconnect () {
            $rootScope.$broadcast('socket:status', {
              status: 'disconnected', url: url
            })
            $log.info('Disconnected from %s', url)
          })
          socket[url].on('reconnect', function onReconnect () {
            $rootScope.$broadcast('socket:status', {
              status: 'reconnect', url: url
            })
            $log.info('Reconnected to %s', url)
          })
          socket[url].on('reconnecting', function onReconnecting (/* attemptNo */) {
            $rootScope.$broadcast('socket:status', {
              status: 'reconnecting', url: url
            })
            $log.info('Reconnecting to %s', url)
          })
          socket[url].on('reconnect_error', function onReconnectError (/* err */) {
            $rootScope.$broadcast('socket:status', {
              status: 'reconnect_error', url: url
            })
            $log.info('Reconnect error to %s', url)
          })
          socket[url].on('reconnect_failed', function onReconnectFailed (/* reconnectionAttempts */) {
            $rootScope.$broadcast('socket:status', {
              status: 'reconnect_failed', url: url
            })
            $log.info('Reconnect error to %s', url)
          })
          socket[url].on('error', function onError (err) {
            $rootScope.$broadcast('socket:status', {
              status: 'error', url: url
            })
            $rootScope.$broadcast('socket:error', err)
            $log.info('Socket error for %s', url, err)
          })
          if (!stopInterval) {
            stopInterval = $interval(pollData, Config.socket.frequency, 0, false)
          }
        },
        setInterval: function (frequency) {
          if (stopInterval) {
            $interval.cancel(stopInterval)
            stopInterval = $interval(pollData, Config.socket.frequency, 0, false)
          }
        },
        disconnect: function (url) {
          const socket = api.socket
          if (socket[url]) {
            socket[url].off('connect')
            socket[url].disconnect()
            delete socket[url]
            $log.info('Disconnected from %s', url)
          }
          console.log(Object.keys(socket).length)
          if (!Object.keys(socket).length) {
            $interval.cancel(stopInterval)
            $log.info('Stop polling')
            stopInterval = null
          }
        }
      }
      return api
    }])
