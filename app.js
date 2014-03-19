/**
 * phant-manager-http
 * https://github.com/sparkfun/phant-manager-http
 *
 * Copyright (c) 2014 SparkFun Electronics
 * Licensed under the GPL v3 license.
 */

/**** Module dependencies ****/
var express = require('express'),
    path = require('path'),
    favicon = require('static-favicon'),
    logger = require('morgan'),
    methodOverride = require('method-override'),
    bodyParser = require('body-parser'),
    httpServer = require('phant-http-server'),
    routes = require('./routes');

/**** express init ****/
var app = express();

/**** general middleware ****/
app.use(favicon(path.join(__dirname, 'public', 'img', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.compress());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

app.use(app.router);

/**** 404 handler ****/
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/**** development error handler ****/
if (app.get('env') === 'development') {
  app.use(function(err, req, res) {
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

/**** production error handler ****/
app.use(function(err, req, res) {
  res.render('error', {
    message: err.message,
    error: {}
  });
});

/**** route everything to angular ****/
app.get('/', routes.index);
app.get('/index*', routes.index);

/**** export configurable app ****/
exports = module.exports = function(config) {

  var storage = false,
      keychain = false,
      port = 3000;

  config = config || {};

  if ('storage'   in config) { storage    = config.storage;   }
  if ('keychain'  in config) { keychain   = config.keychain;  }
  if ('port'      in config) { port       = config.port;      }

  // config dependent routes
  app.get('/streams', routes.list(storage));
  app.get('/streams.json', routes.list(storage));
  app.get('/streams/list.json', routes.list(storage));

  app.post('/streams', routes.create(keychain, storage));
  app.post('/streams.json', routes.create(keychain, storage));

  httpServer.listen(port);
  httpServer.use(app);

  return app;

};

