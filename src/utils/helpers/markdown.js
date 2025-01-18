const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();

module.exports = function(text) {
  return md.render(text || '');
};
