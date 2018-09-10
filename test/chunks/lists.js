const { expect } = require('chai');
const { applyCommand } = require('../../src/rich');
const { createWithContent } = require('../../src/state');

describe.skip('list enrichment', () => {
  it('should apply unordered list', () => {
    const state = createWithContent({
      before: 'foo\n',
      selection: 'bar\nbaz\nqux\n',
      after: 'quux'
    });
    const result = applyCommand(state, 'ul');

    expect(result.before).to.eql('foo\n\n');
    expect(result.selection).to.eql('bar');
    expect(result.after).to.eql('baz');
  });
});
