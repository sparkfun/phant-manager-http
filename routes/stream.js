exports.make = function(req, res) {
  res.render('streams/make', {
    title: 'New Stream',
    post: req.body
  });
};

exports.delete = function(req, res) {
  res.render('streams/delete', {
    title: 'Delete Stream'
  });
};

exports.clear = function(req, res) {
  res.render('streams/clear', {
    title: 'Clear Stream'
  });
};

exports.list = function(req, res, next) {

  var self = this,
    per_page = parseInt(req.param('per_page')) || 20,
    page = parseInt(req.param('page')) || 1,
    error = Err.bind(this, next),
    query = {
      hidden: false,
      flagged: false
    },
    sort = {
      property: 'last_push',
      direction: 'desc'
    };

  this.metadata.list(function(err, streams) {

    if (err) {
      return error(500, 'Loading the stream list failed.');
    }

    streams = streams.map(function(stream) {
      stream.publicKey = self.keychain.publicKey(stream.id);
      return stream;
    });

    res.format({
      html: function() {
        res.render('streams/list', {
          title: 'Public Streams',
          streams: streams,
          page: page,
          per_page: per_page
        });
      },
      json: function() {
        res.json({
          success: true,
          streams: streams
        });
      }
    });

  }, query, per_page * (page - 1), per_page, sort);

};

exports.tag = function(req, res, next) {

  var self = this,
    page = parseInt(req.param('page')) || 1,
    per_page = parseInt(req.param('per_page')) || 20,
    tag = req.param('tag'),
    error = Err.bind(this, next),
    query = {
      hidden: false,
      flagged: false,
      tags: tag
    },
    sort = {
      property: 'date',
      direction: 'desc'
    };

  this.metadata.list(function(err, streams) {

    if (err) {
      return error(500, 'Loading the stream list failed.');
    }

    streams = streams.map(function(stream) {
      stream.publicKey = self.keychain.publicKey(stream.id);
      return stream;
    });

    res.format({
      html: function() {
        res.render('streams/list', {
          title: 'Streams Tagged: ' + tag,
          streams: streams,
          page: page,
          per_page: per_page
        });
      },
      json: function() {
        res.json({
          success: true,
          streams: streams
        });
      }
    });

  }, query, per_page * (page - 1), per_page, sort);

};

exports.city = function(req, res, next) {
  listLocation.call(this, 'city', req, res, next);
};

exports.state = function(req, res, next) {
  listLocation.call(this, 'state', req, res, next);
};

exports.country = function(req, res, next) {
  listLocation.call(this, 'country', req, res, next);
};

exports.view = function(req, res, next) {

  var id = this.keychain.getIdFromPublicKey(req.param('publicKey')),
    error = Err.bind(this, next);

  this.metadata.get(id, function(err, stream) {

    if (!stream || err) {
      return error(404, 'Stream not found.');
    }

    res.format({
      html: function() {
        res.render('streams/view', {
          title: 'Stream ' + req.param('publicKey'),
          publicKey: req.param('publicKey'),
          stream: stream
        });
      },
      json: function() {
        res.json({
          success: true,
          stream: stream,
          publicKey: req.param('publicKey')
        });
      }
    });

  });

};

exports.create = function(req, res, next) {

  var self = this,
    passMessage = PassMessage.bind(this, req, res, next);

  var stream = {
    title: '',
    description: '',
    tags: [],
    fields: [],
    hidden: false,
    location: {}
  };

  if (req.param('tags') && req.param('tags').trim()) {
    stream.tags = req.param('tags').trim().split(',').map(function(tag) {
      return tag.trim();
    });
  }

  if (req.param('fields') && req.param('fields').trim()) {
    stream.fields = req.param('fields').trim().split(',').map(function(field) {
      return field.trim();
    });
  }

  if (req.param('location_country') && req.param('location_country').trim()) {
    stream.location = {
      long: req.param('location_long').trim(),
      city: req.param('location_city').trim(),
      state: req.param('location_state').trim(),
      country: req.param('location_country').trim(),
      lat: req.param('location_lat').trim(),
      lng: req.param('location_lng').trim()
    };
  }

  stream.title = req.param('title');
  stream.description = req.param('description');
  stream.hidden = (req.param('hidden') === '1' ? true : false);

  this.validator.create(stream, function(err) {

    if (err) {
      return passMessage(400, 'Creating stream failed - ' + err, '/streams/make');
    }

    self.metadata.create(stream, function(err, stream) {

      if (err) {
        return passMessage(500, 'Saving the stream failed.', '/streams/make');
      }

      res.format({
        html: function() {
          res.render('streams/create', {
            title: 'Stream ' + self.keychain.publicKey(stream.id),
            stream: stream,
            publicKey: self.keychain.publicKey(stream.id),
            privateKey: self.keychain.privateKey(stream.id),
            deleteKey: self.keychain.deleteKey(stream.id),
            notifiers: self.getNotifiers('create')
          });
        },
        json: function() {
          res.json({
            success: true,
            stream: stream,
            publicKey: self.keychain.publicKey(stream.id),
            privateKey: self.keychain.privateKey(stream.id),
            deleteKey: self.keychain.deleteKey(stream.id)
          });
        }
      });

    });

  });

};

exports.notify = function(req, res, next) {

  var self = this,
    pub = req.param('publicKey'),
    prv = req.param('privateKey'),
    id = this.keychain.getIdFromPublicKey(pub),
    type = req.param('type'),
    error = Err.bind(this, next);

  // make sure type was sent
  if (!type) {
    return error(400, 'Missing notification type');
  }

  // check for public key
  if (!pub) {
    return this.error(res, 404, 'Stream not found');
  }

  // check for private key
  if (!prv) {
    return error(403, 'Forbidden: Missing private key');
  }

  // validate keys
  if (!this.keychain.validate(pub, prv)) {
    return this.error(res, 401, 'Forbidden: Invalid keys');
  }

  this.metadata.get(id, function(err, stream) {

    if (!stream || err) {
      return error(500, 'Unable to load stream');
    }

    self.notify(type, req.body, {
      title: stream.title,
      publicKey: self.keychain.publicKey(stream.id),
      privateKey: self.keychain.privateKey(stream.id),
      deleteKey: self.keychain.deleteKey(stream.id)
    });

    res.format({
      html: function() {
        res.render('streams/create', {
          title: 'Stream ' + self.keychain.publicKey(stream.id),
          stream: stream,
          publicKey: self.keychain.publicKey(stream.id),
          privateKey: self.keychain.privateKey(stream.id),
          deleteKey: self.keychain.deleteKey(stream.id),
          notifiers: self.getNotifiers(type),
          messages: {
            'success': ['Sent notification']
          }
        });
      },
      json: function() {
        res.json({
          success: true,
          message: 'Sent notification'
        });
      }
    });

  });

};

exports.remove = function(req, res, next) {

  var pub = req.param('publicKey'),
    del = req.param('deleteKey'),
    error = Err.bind(this, next),
    passMessage = PassMessage.bind(this, req, res, next),
    self = this;

  // check for public key
  if (!pub) {
    return error(404, 'Not Found');
  }

  // check for private key
  if (!del) {
    return error(403, 'Forbidden: missing del key');
  }

  // validate keys
  if (!this.keychain.validateDeleteKey(pub, del)) {
    return error(401, 'Forbidden: invalid delete key');
  }

  var id = this.keychain.getIdFromPublicKey(pub);

  this.metadata.delete(id, function(err, success) {

    if (err) {
      return error(500, 'Deleting stream failed');
    }

    self.emit('clear', id);

    passMessage(202, 'Deleted Stream: ' + pub, '/streams');

  });

};

function listLocation(type, req, res, next) {

  var self = this,
    page = parseInt(req.param('page')) || 1,
    per_page = parseInt(req.param('per_page')) || 20,
    tag = req.param(type),
    error = Err.bind(this, next),
    query = {
      hidden: false,
      flagged: false,
      location: {}
    },
    sort = {
      property: 'last_push',
      direction: 'desc'
    };

  query.location[type] = tag;

  this.metadata.list(function(err, streams) {

    if (err) {
      return error(500, 'Loading the stream list failed.');
    }

    streams = streams.map(function(stream) {
      stream.publicKey = self.keychain.publicKey(stream.id);
      return stream;
    });

    res.format({
      html: function() {
        res.render('streams/list', {
          title: 'Streams Located In: ' + tag,
          streams: streams,
          page: page,
          per_page: per_page
        });
      },
      json: function() {
        res.json({
          success: true,
          streams: streams
        });
      }
    });

  }, query, per_page * (page - 1), per_page, sort);

}

/* exported PassMessage */
function PassMessage(req, res, next, status, message, path) {

  res.statusCode = status;

  res.format({
    html: function() {

      var cls = (status >= 200 && status < 300 ? 'success' : 'danger');

      req.method = 'GET';
      req.url = path;
      res.locals.messages = {};
      res.locals.messages[cls] = [message];

      // start from top
      req._route_index = 0;

      return next('route');

    },
    json: function() {

      res.json(status, {
        success: (status >= 200 && status < 300 ? true : false),
        message: message
      });

    }
  });

}

/* exported Err */
function Err(next, status, message) {

  var err = new Error(message);
  err.status = status;

  return next(err);

}
