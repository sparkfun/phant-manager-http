var phantServices = angular.module('phantServices', ['ngResource']);

phantServices.factory('Stream', ['$resource',

  function($resource){

    return $resource('streams/:streamId.json', {streamId:'@id'});

  }]);


phantServices.factory('NewStream', function () {

  var response = {};

  return {
    save: function (data) {
      response = data;
    },
    get: function() {
      var copy = Object.create(response);
      response = {};
      return copy;
    }
  };

});

