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
    exphbs = require('express3-handlebars');

/**** helpers ****/
var handlebars = require('./helpers/handlebars');

/**** routes ****/
var index = require('./routes'),
    stream = require('./routes/stream');

var app = {};

/**** Expose PhantManager ****/
exports = module.exports = PhantManager;

/**** Initialize a new PhantManager ****/
function PhantManager(config) {

  config = config || {};

  // create a responder
  var responder = function(req, res) {

    if(res.headerSent) {
      return function(req, res) { return; };
    }

    if(req.url.match(/^\/input\//)) {
      return function(req, res) { return; };
    }

    if(req.url.match(/^\/output\//)) {
      return function(req, res) { return; };
    }

    return app.call(this, req, res);

  };

  util._extend(responder, events.EventEmitter.prototype);
  util._extend(responder, app);
  util._extend(responder, config);

  responder.express = responder.expressInit();

  return responder;

}

app.metadata = false,
app.keychain = false;

app.expressInit = function() {

  var exp = express();

  exp.engine('handlebars', exphbs({
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    partialsDir:  path.join(__dirname,'views', 'partials'),
    defaultLayout: 'main',
    helpers: handlebars
  }));

  exp.set('view engine', 'handlebars');
  exp.set('views', path.join(__dirname, 'views'));

  exp.use(
    favicon(
      path.join(__dirname, 'public', 'img', 'favicon.ico'),
      { maxAge: 2592000000 } // 1 month
    )
  );

  exp.use(express.compress());
  exp.use(bodyParser.json());
  exp.use(bodyParser.urlencoded());
  exp.use(methodOverride());

  exp.use(function (req, res, next) {
    res.header('X-Powered-By', 'phant');
    res.locals.server = req.protocol + '://' + req.get('host');
    next();
  });

  if(exp.get('env') === 'development') {

    exp.use(logger('dev'));

    exp.use(express.static(
      path.join(__dirname, 'public')
    ));

  } else {

    exp.enable('view cache');

    exp.use(express.static(
      path.join(__dirname, 'public'),
      { maxAge: 604800000 }
    ));

  }

  /**** 404 handler ****/
  exp.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  /**** error handler ****/
  app.use(function(err, req, res, next) {

    var status = err.status || 200;

    res.status(status).render('error', {
      message: err.message,
      error: {}
    });

  });

  exp.use(exp.router);

  exp.get('/', index.home);
  exp.get('/streams/make', stream.make);

  exp.get('/streams', stream.list.bind(this));
  exp.get('/streams/:publicKey', stream.view.bind(this));
  exp.post('/streams', stream.create.bind(this));

  return exp;

};
