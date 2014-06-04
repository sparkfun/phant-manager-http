'use strict';

var spawn = require('child_process').spawn,
  path = require('path'),
  request = require('request'),
  rimraf = require('rimraf'),
  http_port = 8080;

var server = spawn(path.join(__dirname, '..', '.bin', 'dev'));

var test_stream = {
  title: 'input test',
  description: 'this should be deleted by the test',
  fields: ['test1', 'test2'],
  tags: ['input test'],
  hidden: false
};

exports.cleanup = function(test) {

  rimraf.sync(path.join(__dirname, 'tmp'));
  server.kill(0);
  test.done();

};
