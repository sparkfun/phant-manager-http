var phantControllers = angular.module('phantControllers', []);

phantControllers.controller('streamListCtrl', ['$scope', '$routeParams', '$http', 'Stream',

  function($scope, $routeParams, $http, Stream) {

    $scope.streams = Stream.query();

  }]);

phantControllers.controller('streamCtrl', ['$scope', '$routeParams', '$location', 'Stream', 'NewStream',

  function($scope, $routeParams, $location, Stream, NewStream) {

    $scope.formData = {};

    $scope.createStream = function() {

      var stream = new Stream($scope.formData);

      stream.$save(function(response) {
        NewStream.save(response);
        $location.path('/streams/created');
      });

    };

  }]);

phantControllers.controller('streamCreatedCtrl', ['$scope', '$routeParams', '$location', 'NewStream',

  function($scope, $routeParams, $location, NewStream) {

    $scope.response = NewStream.get();

    $scope.sampleQueryString = function(fields) {

      var params =[];

      var rand = function(min, max) {
        return (Math.random() * (max - min) + min).toFixed(2);
      };

      if(fields.length === 0) {
        fields = ['sensor', 'other_sensor', 'random_sensor'];
      }

      for(var i=0; i < fields.length; i++) {
        params.push(fields[i] + '=' + rand(0, 30));
      }

      return params.join('&');

    };

  }]);
