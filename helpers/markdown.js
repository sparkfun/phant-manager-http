var marked = require('marked'),
    highlight = require('highlight.js');

marked.setOptions({
  gfm: true,
  tables: true,
  breaks: true,
  sanitize: true,
  highlight: function (code) {
    return highlight.highlightAuto(code).value;
  }
});

module.exports = marked;
