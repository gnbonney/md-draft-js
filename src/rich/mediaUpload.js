const {
  getUploadingItemIndex,
  removeUploadingItem
} = require('../utils/media');

const getImageUploadPlaceholder = (index) =>
  `![Uploading image${index === 0 ? '' : ` (${index})`}]()`;

function replaceText(state, oldText, newText) {
  const selectionIndex = state.before.length + state.startTag.length;
  const text =
    state.before +
    state.startTag +
    state.selection +
    state.endTag +
    state.after;
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

module.exports.mediaUpload = function mediaUpload(
  editorStateFn,
  fileUploadPromise,
  onChange
) {
  const editorState = editorStateFn();
  const uploadingItemIndex = getUploadingItemIndex();
  const imagePlaceholder = getImageUploadPlaceholder(uploadingItemIndex);
  const prev = `${editorState.before}${editorState.selection}`;

  onChange({
    ...editorState,
    selection: '',
    before: `${prev}${
      !prev || /\n$/.test(prev) ? '' : '\n'
    }${imagePlaceholder}\n`
  });

  fileUploadPromise
    .then(({ src, alt }) => {
      const newState = replaceText(
        editorStateFn(),
        imagePlaceholder,
        `![${alt}](${src})`
      );

      removeUploadingItem(uploadingItemIndex);
      onChange(newState);
    })
    .catch(() => {
      const newState = replaceText(editorStateFn(), imagePlaceholder, '');

      removeUploadingItem(uploadingItemIndex);
      onChange(newState);
    });
};
