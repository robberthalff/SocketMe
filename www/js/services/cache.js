angular.module('SocketMe.services')
  .factory('Cache', ['$log', function ($log) {
    function Cache (name) {
      var _cache = []
      var _peeked = 0
      var _dirty = false
      var maxLength = 15
      this.peek = function () {
        $log.debug('cache:%s:peek', name)
        _peeked = _cache.length
        return _cache.slice()
      }
      this.isDirty = function () {
        if (_dirty) {
          $log.debug('cache:%s:isDirty', name)
        }
        return _dirty
      }
      this.get = function () {
        $log.debug('cache:%s:get', name)
        return _cache.slice()
      }
      this.clear = function () {
        $log.debug('cache:%s:clear', name)
        _cache = []
        _dirty = false
        _peeked = 0
      }
      this.flush = function () {
        $log.debug('cache:%s:flush', name)
        _cache = _cache.splice(_peeked)
        _dirty = false
        _peeked = 0
      }
      this.add = function (data) {
        try {
          $log.debug('cache:%s:add', name, JSON.stringify(data))
        } catch (e) {
          // circular.
          $log.debug('cache:%s:add', name)
        }

        if (_cache.length >= maxLength) {
          _cache = _cache.splice(_cache.length - maxLength)
        }

        _cache.push(data)
        _dirty = true
      }
    }

    var dirty = false

    const api = {
      cache: {},
      create: function (name) {
        $log.debug('CACHE:create(%s)', name)
        api.cache[name] = new Cache(name)
        return api.cache[name]
      },
      peek: function () {
        $log.debug('CACHE:peek')
        return Object.keys(api.cache).reduce(function (obj, key) {
          if (api.cache[key].isDirty()) {
            obj[key] = api.cache[key].peek()
            dirty = true
          }
          return obj
        }, {})
      },
      isDirty: function () {
        $log.debug('CACHE:isDirty')
        return dirty
      },
      get: function () {
        $log.debug('CACHE:get')
        return Object.keys(api.cache).reduce(function (obj, key) {
          if (api.cache[key].isDirty()) {
            obj[key] = api.cache[key].get()
            dirty = true
          }
          return obj
        }, {})
      },
      flush: function () {
        $log.debug('CACHE:flush')
        Object.keys(api.cache).forEach(function (key) {
          api.cache[key].flush()
        })
        dirty = false
      },
      clear: function () {
        $log.debug('CACHE:clear')
        Object.keys(api.cache).forEach(function (key) {
          api.cache[key].clear()
        })
        dirty = false
      }
    }
    return api
  }])
