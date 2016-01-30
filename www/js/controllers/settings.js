angular.module('SocketMe.controllers')
  .controller('SettingsCtrl',
    ['$scope', '$log', 'Battery', 'Motion', 'Orientation', 'Location',
      function ($scope, $log, Battery, Motion, Orientation, Location) {
        const services = {
          Battery: Battery,
          Motion: Motion,
          Orientation: Orientation,
          Location: Location
        }
        $scope.settingsList = [
          { text: 'Battery', checked: Battery.isActive },
          { text: 'Motion', checked: Motion.isActive },
          { text: 'Orientation', checked: Orientation.isActive },
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
