exports.make = function(req, res) {
  res.render('streams/make', { title: 'new stream' });
};

exports.list = function(keychain, storage) {

  return function(req, res) {

    storage.list(function(err, streams) {

      if (err) {
        req.flash('danger', 'loading the stream list failed.');
        res.render('streams/list', { title: 'public streams' });
      }

      streams = streams.map(function(stream) {
        stream.publicKey = keychain.publicKey(stream._id);
        return stream;
      });

      res.render('streams/list', {
        title: 'public streams',
        streams: streams
      });

    });

  };

};

exports.view = function(keychain, storage) {

  return function(req, res) {

    var id = keychain.getIdFromPublicKey(req.param('publicKey'));

    storage.get(id, function(err, stream) {

      if (err) {
        req.flash('danger', 'loading the stream failed.');
        res.render('streams/list', { title: 'public streams' });
      }

      res.render('streams/view', {
        title: 'stream ' + req.param('publicKey'),
        publicKey: req.param('publicKey'),
        stream: stream
      });

    });

  };

};

exports.create = function(keychain, storage) {

  return function(req, res) {

    var fields = [],
        tags = [];

    if(req.param('tags').trim())
      tags = req.param('tags').trim().split(', ');

    if(req.param('fields').trim())
      fields = req.param('fields').trim().split(', ');

    storage.create({
      title: req.param('title'),
      description: req.param('description'),
      fields: fields,
      tags: tags
    }, function(err, stream) {

      if (err) {
        req.flash('danger', 'creating your stream failed');
        res.render('streams/make', { title: 'new stream' });
      }

      res.render('streams/create', {
        title: 'stream ' + keychain.publicKey(stream.id),
        stream: stream,
        publicKey: keychain.publicKey(stream.id),
        privateKey: keychain.privateKey(stream.id)
      });

    });

  };

};


