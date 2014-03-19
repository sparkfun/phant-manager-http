var phant = angular.module('phant', [
  'ngRoute',
  'phantControllers',
  'phantServices'
]);
 
phant.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/streams', {
        templateUrl: 'views/list.html',
        controller: 'streamListCtrl'
      }).
      when('/streams/make', {
        templateUrl: 'views/make.html',
        controller: 'streamCtrl'
      }).
      when('/streams/created', {
        templateUrl: 'views/created.html',
        controller: 'streamCreatedCtrl'
      }).
      otherwise({
        redirectTo: '/streams'
      });
  }]);

