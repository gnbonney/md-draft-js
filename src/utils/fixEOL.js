module.exports = function fixEOL(text) {
  return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
};
