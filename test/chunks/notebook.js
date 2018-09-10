const { expect } = require('chai');
const { applyCommand } = require('../../src/rich');
const { createWithContent } = require('../../src/state');

describe('notebook enrichment', () => {
  it('should apply notebook block', () => {
    const state = createWithContent({
      before: 'foo\n',
      selection: '',
      after: '\nbaz'
    });
    const result = applyCommand(state, 'notebook');

    expect(result.before).to.eql('foo\n\n```notebook\n');
    expect(result.selection).to.eql('');
    expect(result.after).to.eql('\n```\n\nbaz');
  });

  it('should remove notebook block', () => {
    const state = createWithContent({
      before: 'foo\n```notebook\n',
      selection: '',
      after: '\n```\nquux'
    });
    const result = applyCommand(state, 'notebook');

    expect(result.startTag).to.eql('');
    expect(result.endTag).to.eql('');
    expect(result.before).to.eql('foo\n');
    expect(result.selection).to.eql('');
    expect(result.after).to.eql('\nquux');
  });

  it('should apply notebook block with content', () => {
    const state = createWithContent({
      before: 'foo\n',
      selection: '',
      after: '\nbaz'
    });
    const result = applyCommand(state, 'notebook', 'content');

    expect(result.before).to.eql('foo\n\n```notebook\n');
    expect(result.selection).to.eql('content');
    expect(result.after).to.eql('\n```\n\nbaz');
  });
});
