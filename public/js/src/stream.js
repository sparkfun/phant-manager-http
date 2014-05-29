var row_tpl = Handlebars.compile($('#row-template').html()),
    header_tpl = Handlebars.compile($('#header-template').html()),
    stats_tpl = Handlebars.compile($('#stats-template').html());

$.get('/output/{{publicKey}}.json?page=1', function(records) {

  var keys = [];

  for(var k in records[0]) {
    if(records[0].hasOwnProperty(k)) {
      keys.push(k);
    }
  }

  $('table thead').append(header_tpl(keys));
  $('table tbody').append(row_tpl({records: records}));

});

$.get('/output/{{publicKey}}/stats', function(stats) {

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

  $('div.progress-wrapper').html(
    stats_tpl({
      percent: percent,
      remainingPercent: Math.round(100-percent),
      cls: cls,
      cap: cap,
      remainingMb: remainingMb,
      usedMb: usedMb
    })
  );

});
