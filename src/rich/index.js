const fixEOL = require('../utils/fixEOL');
const { getSelection } = require('../utils/selection');
const { bold, isBold } = require('./bold');
const { italic, isItalic } = require('./italic');
const { linkOrMediaOrAttachment } = require('./linkOrMediaOrAttachment');
const { list } = require('./list');
const { blockquote } = require('./blockquote');
const { codeblock, isCodeblock } = require('./codeblock');
const { notebook } = require('./notebook');
const { heading } = require('./heading');
const { hr } = require('./hr');

function getCurrentInlineStyle(state) {
  const styles = new Set();

  if (isBold(state)) {
    styles.add('BOLD');
  }

  if (isItalic(state)) {
    styles.add('ITALIC');
  }

  if (isCodeblock(state)) {
    styles.add('CODE');
  }

  return styles;
}

module.exports.applyCommand = function applyCommand(
  editorState,
  command,
  metadata
) {
  const state = Object.assign({}, editorState, { focus: true });

  switch (command) {
    case 'bold':
      return bold(state);
    case 'italic':
      return italic(state);
    case 'hr':
      return hr(state);
    case 'quote':
      return blockquote(state);
    case 'code':
      return codeblock(state);
    case 'notebook':
      return notebook(state, metadata);
    case 'ul':
      return list(state);
    case 'ol':
      return list(state, true);
    case 'heading':
      return heading(state, metadata);
    case 'link':
      return linkOrMediaOrAttachment(state, metadata, 'link');
    case 'media':
      return linkOrMediaOrAttachment(state, metadata, 'media');
    default:
      return state;
  }
};

module.exports.getChunks = function getChunks(textarea) {
  const selectionInfo = getSelection(textarea);
  const before = fixEOL(textarea.value.substring(0, selectionInfo.start));
  const selection = fixEOL(
    textarea.value.substring(selectionInfo.start, selectionInfo.end)
  );
  const after = fixEOL(textarea.value.substring(selectionInfo.end));
  const state = {
    before,
    after,
    selection,
    startTag: '',
    endTag: '',
    scrollTop: textarea.scrollTop,
    text: textarea.value,
    focus: false
  };

  state.getCurrentInlineStyle = () => getCurrentInlineStyle(state);

  return state;
};

module.exports.isApplied = function isApplied(state, command) {
  switch (command) {
    case 'bold':
      return isBold(state);
    case 'italic':
      return isItalic(state);
    case 'code':
      return isCodeblock(state);
    default:
      return false;
  }
};

module.exports.getCurrentInlineStyle = getCurrentInlineStyle;
