angular.module('SocketMe.services')
  .factory('Battery',
    ['$rootScope', 'Cache', function ($rootScope, Cache) {
      const cache = Cache.create('battery')
      var battery
      var _isPlugged = false;
      var _dischargingTime = null
      var _charging = null;
      if (navigator.getBattery) {
        battery = navigator.getBattery()
      }
      function onStatus (info) {
        api.status = {
          timeStamp: info.timeStamp || Date.now(),
          level: info.level,
          isPlugged: info.hasOwnProperty('isPlugged') ? info.isPlugged : _isPlugged,
          charging: info.hasOwnProperty('charging') ? info.charging : _charging,
          dischargingTime: info.dischargingTime || _dischargingTime
        }
        _isPlugged = api.status.isPlugged
        _dischargingTime = api.status.dischargingTime
        _charging = api.status.charging
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
            if (battery) {
              battery.then(function(_battery) {
                onStatus(_battery)
                _battery.addEventListener('chargingchange', onStatus)
                _battery.addEventListener('levelchange', onStatus)
                _battery.addEventListener('dischargingtimechange', onStatus)
              })
            }
            window.removeEventListener('batterystatus', onStatus)
            window.addEventListener('batterystatus', onStatus, false)
          }
        },
        stop: function () {
          if (api.isActive) {
            api.isActive = false
            cache.clear()
            window.removeEventListener('batterystatus', onStatus)
            if (battery) {
              _battery.removeEventListener('chargingchange', onStatus)
              _battery.removeEventListener('levelchange', onStatus)
              _battery.removeEventListener('dischargingtimechange', onStatus)
            }
          }
        }
      }
      return api
    }])
