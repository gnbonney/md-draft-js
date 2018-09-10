const { expect } = require('chai');
const { applyCommand } = require('../../src/rich');
const { createWithContent } = require('../../src/state');

describe('list enrichment', () => {
  it('should apply unordered list', () => {
    const state = createWithContent({
      before: 'foo\n',
      selection: 'bar\nbaz\nqux',
      after: '\nquux'
    });
    const result = applyCommand(state, 'ul');

    expect(result.before).to.eql('foo\n\n - ');
    expect(result.selection).to.eql('bar\n - baz\n - qux');
    expect(result.after).to.eql('\n\nquux');
  });

  it('should apply unordered list', () => {
    const state = createWithContent({
      before: '1. foo\n2. bar\n3. baz\n\n',
      selection: 'qux',
      after: '\n'
    });
    const result = applyCommand(state, 'ul');

    expect(result.before).to.eql('1. foo\n2. bar\n3. baz\n\n - ');
    expect(result.selection).to.eql('qux');
    expect(result.after).to.eql('\n\n');
  });
});
