(function($) {

  var templates = {},
      stream = {};

  stream.loadTemplates = function(el) {

    var promises = [];

    el.find('[type="text/x-handlebars-template"]').each(function(i, v) {

      var url = $(v).attr('src'),
          name = url.match(/([^\/]+)(?=\.\w+$)/)[0];


      promises.push($.get(url, function(data) {
        templates[name] = Handlebars.compile(data);
      }));

    });

    return promises;

  };

  stream.loadData = function(el) {

    $.get('/output/' + el.data('key') + '.json?page=1', function(records) {

      var keys = [];

      for(var k in records[0]) {
        if(records[0].hasOwnProperty(k)) {
          keys.push(k);
        }
      }

      el.find('table thead').append(templates.header(keys));
      el.find('table tbody').append(templates.row({records: records}));

    });

  };

  stream.loadStats = function(el) {

    $.get('/output/' + el.data('key') + '/stats', function(stats) {

      var percent = Math.floor((stats.used / stats.cap) * 100),
          cls = 'success',
          cap = (stats.cap / (1024 * 1024)).toFixed(0),
          usedMb = (stats.used / (1024 * 1024)).toFixed(2),
          remainingMb = (stats.remaining / (1024 * 1024)).toFixed(2);

      if(percent > 66 && percent < 90) {
        cls = 'warning';
      } else if(percent > 90) {
        cls = 'danger';
      }

      el.find('div.progress-wrapper').html(
        templates.stats({
          percent: percent,
          remainingPercent: Math.round(100-percent),
          cls: cls,
          cap: cap,
          remainingMb: remainingMb,
          usedMb: usedMb
        })
      );

    });

  };

  $.fn.stream = function() {

    var promises = stream.loadTemplates(this);

    $.when.apply(this, promises).done(function() {
      stream.loadData(this);
      stream.loadStats(this);
    }.bind(this));

  };

}(jQuery));
