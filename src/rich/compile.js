module.exports = function compile({
  before,
  after,
  startTag,
  endTag,
  ...props
}) {
  return {
    before: before + startTag,
    after: endTag + after,
    startTag: '',
    endTag: '',
    ...props
  };
};
