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
    httpServer = require('phant-http-server'),
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
app.use(favicon(path.join(__dirname, 'public', 'img', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.compress());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(methodOverride());
app.use(cookieParser(process.env.COOKIE_SECRET || 'secret'));
app.use(express.session());
app.use(flash());
app.use(function(req, res, next){
  res.locals.messages = req.flash();
  next();
});
app.use(function(req, res, next){
  res.locals.server = req.protocol + '://' + req.get('host');
  next();
});

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

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

app.get('/', index.home);
app.get('/streams/make', stream.make);


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
  app.get('/streams', stream.list(keychain, storage));
  app.get('/streams/:publicKey', stream.view(keychain, storage));
  app.post('/streams', stream.create(keychain, storage));

  httpServer.listen(port);
  httpServer.use(app);

  return app;

};

