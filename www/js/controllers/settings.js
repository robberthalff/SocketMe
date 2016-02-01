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
      'Doppler',
      function ($scope, $log, Battery, Motion, Orientation, Signal, Wifi, Location, Doppler) {
        const services = {
          Battery: Battery,
          Motion: Motion,
          Orientation: Orientation,
          Signal: Signal,
          Wifi: Wifi,
          Location: Location,
          Doppler: Doppler
        }
        $scope.settingsList = [
          {
            text: 'Battery',
            className: 'icon ion-battery-charging',
            checked: Battery.isActive,
            service: Battery
          },
          {
            text: 'Motion',
            className: 'icon ion-android-walk',
            checked: Motion.isActive,
            service: Motion
          },
          {
            text: 'Orientation',
            className: 'icon ion-android-compass',
            checked: Orientation.isActive,
            service: Orientation
          },
          {
            text: 'Signal',
            className: 'icon ion-ios-telephone',
            checked: Signal.isActive,
            service: Signal
          },
          {
            text: 'Wifi',
            className: 'icon ion-android-wifi',
            checked: Wifi.isActive,
            service: Wifi
          },
          {
            text: 'Location',
            className: 'icon ion-android-globe',
            checked: Location.isActive,
            service: Location
          },
          {
            text: 'Doppler',
            className: 'icon ion-android-hand',
            checked: Doppler.isActive,
            service: Doppler
          }
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
