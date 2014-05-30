(function($) {

  var templates = {},
      stream = {},
      page = 1;

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

    $.get('/output/' + el.data('key') + '.json?page=' + page, function(records) {

      var keys = [],
          head = el.find('table thead'),
          body = el.find('table tbody');

      for(var k in records[0]) {
        if(records[0].hasOwnProperty(k)) {
          keys.push(k);
        }
      }


      body.html('');
      head.html('');
      head.append(templates.header(keys));
      body.append(templates.row({records: records}));
      el.find('.pager').show();

    });

  };

  stream.loadStats = function(el) {

    $.get('/output/' + el.data('key') + '/stats', function(stats) {

      var percent = Math.floor((stats.used / stats.cap) * 100),
          cls = 'success',
          cap = (stats.cap / (1024 * 1024)).toFixed(0),
          usedMb = (stats.used / (1024 * 1024)).toFixed(2),
          remainingMb = (stats.remaining / (1024 * 1024)).toFixed(2);

      stream.stats = stats;

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

    var promises = stream.loadTemplates(this),
        el = this;

    $.when.apply(this, promises).done(function() {
      stream.loadData(el);
      stream.loadStats(el);
    });

    this.find('ul.pager li').click(function(e) {

      e.preventDefault();

      var requested = parseInt($(this).data('page')),
          next = $(this).closest('ul.pager').find('li.next'),
          previous = $(this).closest('ul.pager').find('li.previous');

      if($(this).hasClass('disabled')) {
        return;
      }

      if(requested < stream.stats.pageCount && requested > 0) {
        page = requested;
      } else {
        page = 1;
      }

      next.removeClass('disabled');
      next.data('page', page + 1);
      previous.removeClass('disabled');
      previous.data('page', page - 1);

      if(page + 1 >= stream.stats.pageCount) {
        next.addClass('disabled');
      }

      if(page - 1 < 1) {
        previous.addClass('disabled');
      }

      stream.loadData(el);

    });

  };

}(jQuery));
