angular.module('SocketMe.services')
  .factory('Battery',
    ['$rootScope', 'Cache', function ($rootScope, Cache) {
      const cache = Cache.create('battery')
      function onStatus (info) {
        api.status = {
          timeStamp: info.timeStamp,
          level: info.level,
          isPlugged: info.isPlugged
        }
        cache.add(api.status)
      }

      const api = {
        name: 'Battery',
        title: 'Battery',
        isActive: false,
        status: {},
        start: function () {
          if (!api.isActive) {
            api.isActive = true
            window.addEventListener('batterystatus', onStatus, false)
          }
        },
        stop: function () {
          if (api.isActive) {
            api.isActive = false
            cache.clear()
            window.removeEventListener('batterystatus', onStatus)
          }
        }
      }
      return api
    }])
