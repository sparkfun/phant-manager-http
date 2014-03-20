var markdown = require('./markdown'),
    moment = require('moment');

exports.markdown = function(raw) {
  return markdown(raw);
};

exports.ago = function(date) {
  return moment(date).fromNow();
};

exports.dateLong = function(date) {
  return moment(date).format('MMMM Do YYYY, h:mm:ss a');
};

exports.dateShort = function(date) {
  return moment(date).format('l');
};

exports.sampleQueryString = function(fields) {

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

exports.eachKey = function(obj, options) {

    var buffer = "";

    for (var key in obj) {

      if(! obj.hasOwnProperty(key))
        continue;

      if(key === '_id')
        continue;

      // show the inside of the block
      buffer += options.fn(key);

    }

    // return the finished buffer
    return buffer;
};

exports.eachValue = function(obj, options) {

    var buffer = "";

    for (var key in obj) {

      if(! obj.hasOwnProperty(key))
        continue;

      if(key === '_id')
        continue;

      var item = obj[key];

      // show the inside of the block
      buffer += options.fn(item);

    }

    // return the finished buffer
    return buffer;
};
