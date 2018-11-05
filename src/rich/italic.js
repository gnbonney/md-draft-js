const { trim } = require('../chunks');
const compile = require('./compile');

const rleading = /^(_*)/;
const rtrailing = /(_*$)/;
const rtrailingspace = /(\s?)$/;
const rnewlines = /\n{2,}/g;

module.exports.italic = function italic(chunks) {
  const result = trim(chunks);
  result.selection = result.selection.replace(rnewlines, '\n');

  const leadDash = rtrailing.exec(result.before)[0];
  const trailDash = rleading.exec(result.after)[0];
  const fence = Math.min(leadDash.length, trailDash.length);

  if (fence >= 1) {
    result.before = result.before.replace(new RegExp('_$', ''), '');
    result.after = result.after.replace(new RegExp('^_', ''), '');
  } else if (!result.selection && trailDash) {
    result.after = result.after.replace(rleading, '');
    result.before =
      result.before.replace(rtrailingspace, '') + trailDash + RegExp.$1;
  } else {
    if (!result.selection && !trailDash) {
      result.selection = '';
    }

    const markup = '_';
    result.before += markup;
    result.after = markup + result.after;
  }

  return compile(result);
};

module.exports.isItalic = function isItalic(chunks) {
  const result = trim(chunks);
  const leadDash = rtrailing.exec(result.before)[0];
  const trailDash = rleading.exec(result.after)[0];
  const fence = Math.min(leadDash.length, trailDash.length);

  return (
    fence >= 1 || (!result.selection.replace(rnewlines, '\n') && trailDash)
  );
};
