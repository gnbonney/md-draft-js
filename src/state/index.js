const { getCurrentInlineStyle } = require('../rich');

function createEmpty() {
  return {
    before: '',
    after: '',
    selection: '',
    startTag: '',
    endTag: '',
    scrollTop: 0,
    start: 0,
    end: 0,
    focus: false,
    getCurrentInlineStyle
  };
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

module.exports.createEmpty = createEmpty;
module.exports.createWithContent = createWithContent;
module.exports.getText = getText;
