var marked = require('marked');

marked.setOptions({
  gfm: true,
  tables: true,
  breaks: true,
  sanitize: true
});

module.exports = marked;
