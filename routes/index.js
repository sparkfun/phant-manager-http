exports.index = function(req, res) {
  res.sendfile('../public/index.html');
};

exports.list = function(storage) {

  return function(req, res) {

    storage.list(function(err, streams) {

      if (err) {
        res.send(err);
      }

      res.json(streams);

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
        res.send(err);
      }

      res.json({
        stream: stream,
        publicKey: keychain.publicKey(stream.id),
        privateKey: keychain.privateKey(stream.id)
      });

    });

  };

};


