exports.make = function(req, res) {
  res.render('streams/make', { title: 'new stream' });
};

exports.list = function(req, res, next) {

  var self = this;

  this.metadata.list(function(err, streams) {

    if(err) {
      err = new Error('loading the stream list failed.');
      err.status = 500;
      next(err);
      return;
    }

    streams = streams.map(function(stream) {
      stream.publicKey = self.keychain.publicKey(stream.id);
      return stream;
    });

    res.render('streams/list', {
      title: 'public streams',
      streams: streams
    });

  });

};

exports.view = function(req, res, next) {

  var id = this.keychain.getIdFromPublicKey(req.param('publicKey'));

  this.metadata.get(id, function(err, stream) {

    if(err) {
      err = new Error('loading the stream failed.');
      err.status = 500;
      next(err);
      return;
    }

    res.render('streams/view', {
      title: 'stream ' + req.param('publicKey'),
      publicKey: req.param('publicKey'),
      stream: stream
    });

  });

};

exports.create = function(req, res, next) {

  var fields = [],
      tags = [],
      self = this;

  if(req.param('check') !== '') {
    err = new Error('Bot check failed');
    err.status = 400;
    next(err);
    return;
  }

  if(req.param('tags').trim()) {
    tags = req.param('tags').split(',').map(function(tag) {
      return tag.trim();
    });
  }

  if(req.param('fields').trim()) {
    fields = req.param('fields').split(',').map(function(field) {
      return field.trim();
    });
  }

  this.metadata.create({
    title: req.param('title'),
    description: req.param('description'),
    fields: fields,
    tags: tags
  }, function(err, stream) {

    if(err) {
      err = new Error('creating stream failed: ' + err);
      next(err);
      return;
    }

    res.render('streams/create', {
      title: 'stream ' + self.keychain.publicKey(stream.id),
      stream: stream,
      publicKey: self.keychain.publicKey(stream.id),
      privateKey: self.keychain.privateKey(stream.id)
    });

  });

};


exports.remove = function(req, res, next) {

  var pub = req.param('publicKey'),
      prv = req.param('private_key'),
      self = this,
      id, err;

  // check for public key
  if(! pub) {
    err = new Error('Not Found');
    err.status = 404;
    next(err);
    return;
  }

  // check for private key
  if(! prv) {
    err = new Error('forbidden: missing private key');
    err.status = 403;
    next(err);
    return;
  }

  // validate keys
  if(! this.keychain.validate(pub, prv)) {
    err = new Error('forbidden: invalid key');
    err.status = 401;
    next(err);
    return;
  }

  id = this.keychain.getIdFromPublicKey(pub);

  this.metadata.remove(id, function(err, success) {

    if(err) {
      err = new Error('deleting the stream failed');
      err.status = 500;
      next(err);
      return;
    }

    self.emit('clear', id);

    res.redirect('streams');

  });

};

