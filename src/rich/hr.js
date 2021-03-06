const { skip } = require('../chunks');
const compile = require('./compile');

module.exports.hr = function hr(chunks) {
  const result = { ...chunks };

  result.startTag = '----------\n';
  result.selection = '';

  return compile(skip(result, { left: 2, right: 1, any: true }));
};
