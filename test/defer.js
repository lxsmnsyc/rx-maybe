/* eslint-disable no-undef */
import assert from 'assert';
import Maybe from '../src/maybe';

/**
 *
 */
describe('Maybe', () => {
  /**
   *
   */
  describe('#defer', () => {
    /**
     *
     */
    it('should create a Maybe', () => {
      const maybe = Maybe.defer(() => Maybe.just('Hello World'));

      assert(maybe instanceof Maybe);
    });
    /**
     *
     */
    it('should succeed with the given value.', (done) => {
      const maybe = Maybe.defer(() => Maybe.just('Hello World'));

      maybe.subscribe(
        x => (x === 'Hello World' ? done() : done(false)),
        () => done(false),
        () => done(false),
      );
    });
    /**
     *
     */
    it('should signal error if callable returns a non-Maybe', (done) => {
      const maybe = Maybe.defer(() => {});

      maybe.subscribe(
        () => done(false),
        () => done(false),
        () => done(),
      );
    });
    /**
     *
     */
    it('should signal error if callable throws an error', (done) => {
      const maybe = Maybe.defer(() => {
        throw new Error('Expected');
      });

      maybe.subscribe(
        () => done(false),
        e => (e instanceof Error ? done() : done(false)),
      );
    });
  });
});
