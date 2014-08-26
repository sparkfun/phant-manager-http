(function($) {

  var make = {
    selectLocation: function(event, result) {
      $('#geo_input').data({
        lat: result.geometry.location.lat(),
        lng: result.geometry.location.lng()
      });
    }
  };

  $.fn.make = function() {

    var el = $(this);

    $('#geo_input').geocomplete().bind('geocode:result', make.selectLocation);

  };

}(jQuery));

