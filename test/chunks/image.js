const { expect } = require('chai');
const { applyCommand } = require('../../src/rich');
const { createWithContent } = require('../../src/state');

describe('media enrichment', () => {
  it('should add an media', () => {
    const state = createWithContent({
      selection: 'foo'
    });
    const result = applyCommand(state, 'media', 'bar');

    expect(result.before).to.eql('![');
    expect(result.selection).to.eql('foo');
    expect(result.after).to.eql('][1]\n\n  [1]: http://bar');
  });

  it('should add an media after a link', () => {
    const state = createWithContent({
      before: '[foo][1] ',
      selection: 'bar',
      after: '\n\n  [1]: http://baz'
    });
    const result = applyCommand(state, 'media', 'quux');

    expect(result.before).to.eql('[foo][1] ![');
    expect(result.selection).to.eql('bar');
    expect(result.after).to.eql(
      '][2]\n\n  [1]: http://baz\n  [2]: http://quux'
    );
  });
});
