const { getCurrentInlineStyle } = require('../rich');

function createEmpty() {
  const state = {
    before: '',
    after: '',
    selection: '',
    startTag: '',
    endTag: '',
    scrollTop: 0,
    focus: false
  };

  state.getCurrentInlineStyle = () => getCurrentInlineStyle(state);

  return state;
}

function createWithContent(initialState) {
  let result;

  if (!initialState) {
    result = initialState;
  } else if (typeof initialState === 'string') {
    result = {
      before: initialState
    };
  } else if (typeof initialState === 'object') {
    result = initialState;
  }

  return Object.assign(createEmpty(), result);
}

function getText(state) {
  return (
    state.before + state.startTag + state.selection + state.endTag + state.after
  );
}

function replaceText(state, oldText, newText) {
  const selectionIndex = state.before.length + state.startTag.length;
  const text = getText(state);
  const oldTextPosition = text.indexOf(oldText);
  const beforeText = `${state.before}${state.startTag}`;
  const afterText = `${state.selection}${state.endTag}${state.after}`;

  if (oldTextPosition === -1) {
    // text not found, nothing to replace
    return state;
  }
  if (oldTextPosition >= selectionIndex) {
    // text is after selection
    return {
      ...state,
      before: beforeText,
      after: afterText.replace(oldText, newText),
      selection: '',
      startTag: '',
      endTag: ''
    };
  }
  if (oldTextPosition + oldText.length < selectionIndex) {
    return {
      ...state,
      before: beforeText.replace(oldText, newText),
      after: afterText,
      selection: '',
      startTag: '',
      endTag: ''
    };
  }

  const replacedText = text.replace(oldText, newText);

  return {
    ...state,
    before: replacedText.substring(0, beforeText.length),
    after: replacedText.substring(beforeText.length),
    selection: '',
    startTag: '',
    endTag: ''
  };
}

module.exports.createEmpty = createEmpty;
module.exports.createWithContent = createWithContent;
module.exports.getText = getText;
module.exports.replaceText = replaceText;
