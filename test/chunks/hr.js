const { expect } = require('chai');
const { applyCommand } = require('../../src/rich');
const { createWithContent } = require('../../src/state');

describe('hr enrichment', () => {
  it('should apply hr', () => {
    const state = createWithContent({
      before: 'foo\n',
      selection: '',
      after: '\nbaz'
    });
    const result = applyCommand(state, 'hr');

    expect(result.before).to.eql('foo\n\n----------\n');
    expect(result.selection).to.eql('');
    expect(result.after).to.eql('\n\nbaz');
  });
});
