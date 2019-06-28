const { trim } = require('../chunks');
const compile = require('./compile');

const boldTag = '**';

module.exports.bold = function bold(chunks) {
  const state = trimRepeatedNewLines(trim(chunks));
  return compile({
    ...state,
    ...applyBold(state)
  });
};

function applyBold({ before, selection, after }) {
  if (before.endsWith(boldTag) && after.startsWith(boldTag)) {
    // remove bold tags from surroundings of selection
    return {
      before: before.slice(0, -boldTag.length),
      after: after.slice(boldTag.length)
    };
  }

  if (selection.startsWith(boldTag) && selection.endsWith(boldTag)) {
    // remove bold tags from selection
    return {
      selection: selection.slice(boldTag.length, -boldTag.length)
    };
  }

  // add bold tags to surroundings of selection
  return {
    before: before + boldTag,
    after: boldTag + after
  };
}

function trimRepeatedNewLines(data) {
  return { ...data, selection: data.selection.replace(/\n{2,}/g, '\n') };
}

module.exports.isBold = function isBold(chunks) {
  const state = trimRepeatedNewLines(trim(chunks));
  const { before, selection, after } = state;

  if (before.endsWith(boldTag) && after.startsWith(boldTag)) {
    return true;
  }

  if (selection.startsWith(boldTag) && selection.endsWith(boldTag)) {
    return true;
  }

  if (!selection && after.startsWith(boldTag)) {
    return true;
  }

  return false;
};
