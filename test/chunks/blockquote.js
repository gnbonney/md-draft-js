const { expect } = require('chai');
const { applyCommand } = require('../../src/rich');
const { createWithContent } = require('../../src/state');

describe('blockquote enrichment', () => {
  it('should apply blockquote', () => {
    const state = createWithContent({
      before: 'foo ',
      selection: 'bar',
      after: ' baz'
    });
    const result = applyCommand(state, 'quote');

    expect(result.before).to.eql('foo \n\n> ');
    expect(result.selection).to.eql('bar');
    expect(result.after).to.eql('\n\n baz');
  });

  it('should remove blockquote', () => {
    const state = createWithContent({
      before: 'foo\n\n',
      selection: '> bar',
      after: '\n\nbaz'
    });
    const result = applyCommand(state, 'quote');

    expect(result.before).to.eql('foo\n\n');
    expect(result.startTag).to.eql('');
    expect(result.selection).to.eql('bar');
    expect(result.endTag).to.eql('');
    expect(result.after).to.eql('\n\nbaz');
  });
});
