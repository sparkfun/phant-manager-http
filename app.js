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
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    exphbs = require('express3-handlebars'),
    flash = require('connect-flash');

/**** helpers ****/
var handlebars = require('./helpers/handlebars');

/**** routes ****/
var index = require('./routes'),
    stream = require('./routes/stream');

/**** express init ****/
var app = express();

/**** general middleware ****/
app.engine('handlebars', exphbs({
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  partialsDir:  path.join(__dirname,'views', 'partials'),
  defaultLayout: 'main',
  helpers: handlebars
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));
if (app.get('env') === 'production') {
  app.enable('view cache');
}
app.use(favicon(
  path.join(__dirname, 'public', 'img', 'favicon.ico'),
  { maxAge: 2592000000 } // 1 month
));

if (app.get('env') !== 'production') {
  app.use(logger('dev'));
}
app.use(express.compress());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(methodOverride());
app.use(cookieParser(process.env.PHANT_COOKIE_SECRET || 'secret'));
app.use(express.session());
app.use(flash());
app.use(function(req, res, next){
  res.locals.messages = req.flash();
  next();
});

app.disable('x-powered-by');

app.use(function (req, res, next) {
  res.header('X-Powered-By', 'phant');
  next();
});

app.use(function(req, res, next){
  res.locals.server = req.protocol + '://' + req.get('host');
  next();
});

app.use(app.router);

if (app.get('env') === 'development') {

  app.use(express.static(
    path.join(__dirname, 'public')
  ));

} else {

  app.use(express.static(
    path.join(__dirname, 'public'),
    { maxAge: 604800000 }
  ));

}

/**** 404 handler ****/
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {

  app.use(function(err, req, res, next) {

    res.render('error', {
      message: err.message,
      error: err
    });

  });

}

/**** production error handler ****/
app.use(function(err, req, res, next) {

  res.render('error', {
    message: err.message,
    error: {}
  });

});

app.get('/', index.home);
app.get('/streams/make', stream.make);

/**** export configurable app ****/
exports = module.exports = function(config) {

  var metadata = false,
      keychain = false;

  config = config || {};

  if ('metadata'  in config) { metadata   = config.metadata;   }
  if ('keychain'  in config) { keychain   = config.keychain;  }

  // config dependent routes
  app.get('/streams', stream.list(keychain, metadata));
  app.get('/streams/:publicKey', stream.view(keychain, metadata));
  app.post('/streams', stream.create(keychain, metadata));

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

  return responder;

};

