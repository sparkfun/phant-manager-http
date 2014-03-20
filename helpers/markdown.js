var marked = require('marked'),
    highlight = require('highlight.js');

marked.setOptions({
  gfm: true,
  tables: true,
  breaks: true,
  highlight: function (code) {
    return highlight.highlightAuto(code).value;
  }
});

module.exports = marked;
