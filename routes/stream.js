exports.make = function(req, res) {
  res.render('streams/make', { title: 'new stream' });
};

exports.list = function(keychain, metadata) {

  return function(req, res) {

    metadata.list(function(err, streams) {

      if(err) {
        req.flash('danger', 'loading the stream list failed.');
        res.redirect('/');
        return;
      }

      streams = streams.map(function(stream) {
        stream.publicKey = keychain.publicKey(stream.id);
        return stream;
      });

      res.render('streams/list', {
        title: 'public streams',
        streams: streams
      });

    });

  };

};

exports.view = function(keychain, metadata) {

  return function(req, res) {

    var id = keychain.getIdFromPublicKey(req.param('publicKey'));

    metadata.get(id, function(err, stream) {

      if(err) {
        req.flash('danger', err);
        res.redirect('/');
        return;
      }

      res.render('streams/view', {
        title: 'stream ' + req.param('publicKey'),
        publicKey: req.param('publicKey'),
        stream: stream
      });

    });

  };

};

exports.create = function(keychain, metadata) {

  return function(req, res) {

    var blacklist = ['_id', 'private_key'],
        fields = [],
        tags = [];

    if(req.param('tags').trim())
      tags = req.param('tags').trim().split(', ');

    if(req.param('fields').trim())
      fields = req.param('fields').trim().split(', ');

    for(var i=0; i < fields.length; i++) {

      if(blacklist.indexOf(fields[i]) !== -1) {
        req.flash('danger', 'sorry, but ' + fields[i] + 'is an invalid field name.');
        res.render('streams/make', { title: 'new stream' });
      }

    }

    metadata.create({
      title: req.param('title'),
      description: req.param('description'),
      fields: fields,
      tags: tags
    }, function(err, stream) {

      if (err) {
        req.flash('danger', 'creating  stream failed: ' + err);
        res.redirect('streams/make');
        return;
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


