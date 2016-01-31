angular.module('SocketMe.controllers')
  .controller('SettingsCtrl',
    ['$scope',
      '$log',
      'Battery',
      'Motion',
      'Orientation',
      'Signal',
      'Wifi',
      'Location',
      function ($scope, $log, Battery, Motion, Orientation, Signal, Wifi, Location) {
        const services = {
          Battery: Battery,
          Motion: Motion,
          Orientation: Orientation,
          Signal: Signal,
          Wifi: Wifi,
          Location: Location
        }
        $scope.settingsList = [
          { text: 'Battery', checked: Battery.isActive },
          { text: 'Motion', checked: Motion.isActive },
          { text: 'Orientation', checked: Orientation.isActive },
          { text: 'Signal', checked: Signal.isActive },
          { text: 'Wifi', checked: Wifi.isActive },
          { text: 'Location', checked: Location.isActive }
        ]
        $scope.toggleIt = function (item) {
          const service = services[item.text]
          if (service.isActive) {
            $log.info('Stopped service %s', item.text)
            service.stop()
          } else {
            $log.info('Started service %s', item.text)
            service.start()
          }
        }
      }])
