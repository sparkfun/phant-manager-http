var markdown = require('./markdown'),
    moment = require('moment');

exports.markdown = function(raw) {
  return markdown(raw);
};

exports.ago = function(date) {

  if(! date) {
    return 'never';
  }

  if(date instanceof Date && date.getTime() === 0) {
    return 'never';
  }

  return moment(date).fromNow();

};

exports.dateLong = function(date) {
  return moment(date).format('MMMM Do YYYY, h:mm:ss a');
};

exports.dateShort = function(date) {
  return moment(date).format('l');
};

exports.sampleQueryFormat = function(fields) {

  var params =[];

  if(fields.length === 0) {
    fields = ['sensor', 'other_sensor', 'random_sensor'];
  }

  for(var i=0; i < fields.length; i++) {
    params.push(fields[i] + '=[value]');
  }

  return params.join('&');

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

