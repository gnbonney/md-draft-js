const { expect } = require('chai');
const { applyCommand, isApplied } = require('../../src/rich');
const { createWithContent } = require('../../src/state');

describe('bold enrichment', () => {
  context('when selection not adjacent to double asterisks', () => {
    const state = Object.freeze(
      createWithContent({
        before: 'foo ',
        selection: 'bar',
        after: ' baz'
      })
    );

    it('should apply bold', () => {
      const { before, selection, after } = applyCommand(state, 'bold');
      expect(before).to.eql('foo **');
      expect(selection).to.eql('bar');
      expect(after).to.eql('** baz');
    });

    it('should indicate bold is not applied', () =>
      expect(isApplied(state, 'bold')).to.be.false);
  });

  context('when selection adjacent to double asterisks', () => {
    const state = Object.freeze(
      createWithContent({
        before: 'foo **',
        selection: 'bar',
        after: '** baz'
      })
    );

    it('should remove bold', () => {
      const { before, selection, after } = applyCommand(state, 'bold');
      expect(before).to.eql('foo ');
      expect(selection).to.eql('bar');
      expect(after).to.eql(' baz');
    });

    it('should indicate bold is applied', () =>
      expect(isApplied(state, 'bold')).to.be.true);
  });

  context('when selection wraps double asterisks', () => {
    const state = Object.freeze(
      createWithContent({
        before: 'foo ',
        selection: '**bar**',
        after: ' baz'
      })
    );

    it('should remove bold', () => {
      const { before, selection, after } = applyCommand(state, 'bold');
      expect(before).to.eql('foo ');
      expect(selection).to.eql('bar');
      expect(after).to.eql(' baz');
    });

    it('should indicate bold is applied', () =>
      expect(isApplied(state, 'bold')).to.be.true);
  });

  context('when cursor is before double asterisks', () => {
    const state = Object.freeze(
      createWithContent({
        before: 'foo',
        selection: '',
        after: '** baz'
      })
    );

    it('should indicate bold is applied', () =>
      expect(isApplied(state, 'bold')).to.be.true);
  });
});
