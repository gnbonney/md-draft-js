const many = require('../utils/many');
const extendRegExp = require('./extendRegExp');

module.exports.findTags = function findTags(state, startRegex, endRegex) {
  let regex;
  const result = { ...state };

  if (startRegex) {
    regex = extendRegExp(startRegex, '', '$');
    result.before = result.before.replace(regex, startReplacer);
    regex = extendRegExp(startRegex, '^', '');
    result.selection = result.selection.replace(regex, startReplacer);
  }

  if (endRegex) {
    regex = extendRegExp(endRegex, '', '$');
    result.selection = result.selection.replace(regex, endReplacer);
    regex = extendRegExp(endRegex, '^', '');
    result.after = result.after.replace(regex, endReplacer);
  }

  return result;

  function startReplacer(match) {
    result.startTag += match;

    return '';
  }

  function endReplacer(match) {
    result.endTag = match + result.endTag;

    return '';
  }
};

module.exports.skip = function skip(state, options) {
  const o = options || {};
  const result = { ...state };
  let beforeCount = 'before' in o ? o.before : 1;
  let afterCount = 'after' in o ? o.after : 1;

  result.selection = result.selection.replace(/(^\n*)/, '');
  result.startTag += RegExp.$1;
  result.selection = result.selection.replace(/(\n*$)/, '');
  result.endTag += RegExp.$1;
  result.startTag = result.startTag.replace(/(^\n*)/, '');
  result.before += RegExp.$1;
  result.endTag = result.endTag.replace(/(\n*$)/, '');
  result.after += RegExp.$1;

  if (result.before) {
    beforeCount += 1;
    result.before = replace(result.before, beforeCount, '$');
  }

  if (result.after) {
    afterCount += 1;
    result.after = replace(result.after, afterCount, '');
  }

  return result;

  function replace(text, count, suffix) {
    const regex = o.any ? '\\n*' : many('\\n?', count);
    const replacement = many('\n', count);

    return text.replace(new RegExp(regex + suffix), replacement);
  }
};

module.exports.trim = function trim(state, remove) {
  const result = { ...state };

  result.selection = result.selection
    .replace(/^(\s*)/, remove ? '' : beforeReplacer)
    .replace(/(\s*)$/, remove ? '' : afterReplacer);

  return result;

  function beforeReplacer(text) {
    result.before += text;
    return '';
  }

  function afterReplacer(text) {
    result.after = text + result.after;
    return '';
  }
};
