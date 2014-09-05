(function($) {

  var el,
      alias_timer,
      editing;

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

        var data = { alias: val };

        if(editing) {
          data.pub = el.data('public');
        }

        $.get('/streams/check_alias', data, function(data) {

          if(data.exists) {
            group.addClass('has-error');
            group.removeClass('has-success');
            return;
          }

          group.addClass('has-success');
          group.removeClass('has-error');

        });

      }, 350);

    },
    edit: function() {

      el.find('input[name=fields]').closest('.form-group').click(function(e) {
        $('#field_warning').show();
      });

      el.submit(this.checkForChangedFields);

    },
    checkForChangedFields: function(e) {

      var pub = $(this).data('public'),
          prv = $(this).data('private'),
          f = this;

      e.preventDefault();

      if(el.find('input[name=fields]').val().trim() === el.find('input[name=field_check]').val().trim()) {
        f.submit();
        return;
      }

      bootbox.confirm(
        'You have changed the field definitions, and must clear your stream data to save the new definition. Are you sure you want to continue?',
        form.clearStream.bind(this, pub, prv, f)
      );

    },
    clearStream: function(pub, prv, f, result) {

      if(!result) {
        return;
      }

      $.ajax({
        url: '/input/' + pub + '/clear.json',
        type: 'POST',
        headers: {
          'Phant-Private-Key': prv
        },
        success: function(response) {
          f.submit();
        }
      });

    }
  };

  $.fn.streamForm = function() {

    el = $(this);
    editing = (el.data('public') ? true : false);

    if(editing) {
      form.edit();
    }

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

