const { skip, trim, findTags } = require('../chunks');
const { compile } = require('../state');
const { unwrap } = require('./wrapping');

const oprevious = /(\n|^)(([ ]{0,3}(\d+[.])[ \t]+.*)(\n.+|\n{2,}(\d+[.])[ \t]+.*|\n{2,}[ \t]+\S.*)*)\n*$/;
const uprevious = /(\n|^)(([ ]{0,3}([*+-])[ \t]+.*)(\n.+|\n{2,}([*+-].*)[ \t]+.*|\n{2,}[ \t]+\S.*)*)\n*$/;
const onext = /^\n*(([ ]{0,3}(\d+[.])[ \t]+.*)(\n.+|\n{2,}(\d+[.])[ \t]+.*|\n{2,}[ \t]+\S.*)*)\n*/;
const unext = /^\n*(([ ]{0,3}([*+-])[ \t]+.*)(\n.+|\n{2,}([*+-].*)[ \t]+.*|\n{2,}[ \t]+\S.*)*)\n*/;
const rbullettype = /^\s*([*+-])/;
const rskipper = /[^\n]\n\n[^\n]/;
const omarkers = /^[ ]{0,3}(\d+[.])\s/gm;
const umarkers = /^[ ]{0,3}([*+-])\s/gm;

function pad(text) {
  return ` ${text} `;
}

module.exports.list = function list(chunks, ordered) {
  let bullet = '-';
  let num = 0;
  let digital;
  let beforeSkip = 1;
  let afterSkip = 1;
  let result = findTags(chunks, /(\n|^)*[ ]{0,3}([*+-]|\d+[.])\s+/);

  if (
    result.before &&
    !/\n$/.test(result.before) &&
    !/^\n/.test(result.startTag)
  ) {
    result.before += result.startTag;
    result.startTag = '';
  }

  if (result.startTag) {
    digital = /\d+[.]/.test(result.startTag);
    result.startTag = '';
    result.selection = result.selection.replace(/\n[ ]{4}/g, '\n');
    result = unwrap(result);
    result = skip(result);

    if (digital) {
      if (ordered) {
        result.after = result.after.replace(onext, getPrefixedItem);
      } else {
        result.after = result.after.replace(unext, getPrefixedItem);
      }
    }

    if (ordered === digital) {
      return compile(result);
    }
  }

  if (ordered) {
    result.before = result.before.replace(oprevious, beforeReplacer);
  } else {
    result.before = result.before.replace(uprevious, beforeReplacer);
  }

  if (!result.selection) {
    result.selection = '';
  }

  if (ordered) {
    result.after = result.after.replace(onext, afterReplacer);
  } else {
    result.after = result.after.replace(unext, afterReplacer);
  }

  result = trim(result, true);
  result = skip(result, { before: beforeSkip, after: afterSkip, any: true });
  result.startTag = nextBullet();
  result.selection = result.selection.replace(
    /\n(?!([ ]{0,3}- |[ ]{0,3}\d+\. ))/g,
    () => `\n${nextBullet()}`
  );

  return compile(result);

  function beforeReplacer(text) {
    if (rbullettype.test(text)) {
      bullet = RegExp.$1;
    }

    beforeSkip = rskipper.test(text) ? 1 : 0;

    return getPrefixedItem(text);
  }

  function afterReplacer(text) {
    afterSkip = rskipper.test(text) ? 1 : 0;

    return getPrefixedItem(text);
  }

  function nextBullet() {
    if (ordered) {
      num += 1;
      return pad(`${num}.`);
    }

    return pad(bullet);
  }

  function getPrefixedItem(text) {
    if (ordered) {
      return text.replace(omarkers, nextBullet);
    }

    return text.replace(umarkers, nextBullet);
  }
};
