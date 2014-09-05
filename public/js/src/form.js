(function($) {

  var el,
      alias_timer;

  var form = {
    selectLocation: function(e, result) {

      var city = '',
          state = '',
          country = '';

      $.each(result.address_components, function(i, v) {

        if(v.types.indexOf('locality') !== -1) {
          city = v.long_name;
        } else if(v.types.indexOf('administrative_area_level_1') !== -1) {
          state = v.long_name;
        } else if(v.types.indexOf('country') !== -1) {
          country = v.long_name;
        }

      });

      el.find('input[name=location_lat]').val(result.geometry.location.lat());
      el.find('input[name=location_lng]').val(result.geometry.location.lng());
      el.find('input[name=location_city]').val(city);
      el.find('input[name=location_state]').val(state);
      el.find('input[name=location_country]').val(country);

    },
    checkAlias: function(e) {

      var group = $(this).closest('.form-group'),
          val = $(this).val().replace(/\W/g, '').toLowerCase();

      // replace with sanatized val
      $(this).val(val);

      group.find('.alias_example').html(val);

      if(val.length < 1) {
        return;
      }

      if(alias_timer) {
        clearTimeout(alias_timer);
      }

      alias_timer = setTimeout(function(e) {

        $.get('/streams/check_alias', { alias: val }, function(data) {

          if(data.exists) {
            group.addClass('has-error');
            group.removeClass('has-success');
            return;
          }

          group.addClass('has-success');
          group.removeClass('has-error');

        });

      }, 350);

    }
  };

  $.fn.streamForm = function() {

    el = $(this);

    el.on('keyup', 'input[name=alias]', form.checkAlias);

    el.find('input[name=fields]').tagsinput({
      maxTags: 30,
      trimValue: true,
      confirmKeys: [13, 44, 32]
    });

    el.find('input[name=tags]').tagsinput({
      maxTags: 15,
      trimValue: true,
      confirmKeys: [13, 44, 32]
    });

    el.find('input[name=tags], input[name=fields]').on('beforeItemAdd', function(e) {
      e.item = e.item.replace(/\W/g, '').toLowerCase();
    });

    el.find('input[name=location_long]')
      .geocomplete()
      .bind('geocode:result', form.selectLocation);

  };

}(jQuery));

