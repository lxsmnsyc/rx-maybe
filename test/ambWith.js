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
  describe('#ambWith', () => {
    /**
     *
     */
    it('should create a Maybe', () => {
      const maybe = Maybe.just('First').ambWith(Maybe.just('Second'));
      assert(maybe instanceof Maybe);
    });
    /**
     *
     */
    it('should return the same instance if the other value is non-Maybe', () => {
      const source = Maybe.just('Hello');
      const maybe = source.ambWith();
      assert(source === maybe);
    });
    /**
     *
     */
    it('should signal success from the source (if earlier)', (done) => {
      const maybe = Maybe.just('Hello').ambWith(Maybe.timer(100));
      maybe.subscribe(
        () => done(),
        () => done(false),
        () => done(false),
      );
    });
    /**
     *
     */
    it('should signal success from the other (if earlier).', (done) => {
      const maybe = Maybe.timer(100).ambWith(Maybe.just('Hello'));
      maybe.subscribe(
        () => done(),
        () => done(false),
        () => done(false),
      );
    });
    /**
     *
     */
    it('should signal success from the source (if earlier)', (done) => {
      const maybe = Maybe.empty().ambWith(Maybe.timer(100));
      maybe.subscribe(
        () => done(false),
        () => done(),
        () => done(false),
      );
    });
    /**
     *
     */
    it('should signal success from the other (if earlier).', (done) => {
      const maybe = Maybe.timer(100).ambWith(Maybe.empty());
      maybe.subscribe(
        () => done(false),
        () => done(),
        () => done(false),
      );
    });
    /**
     *
     */
    it('should signal error from the source (if earlier).', (done) => {
      const maybe = Maybe.error(new Error('Hello')).ambWith(Maybe.timer(100));
      maybe.subscribe(
        () => done(false),
        () => done(false),
        () => done(),
      );
    });
    /**
     *
     */
    it('should signal error from the other (if earlier).', (done) => {
      const maybe = Maybe.timer(100).ambWith(Maybe.error(new Error('Hello')));
      maybe.subscribe(
        () => done(false),
        () => done(false),
        () => done(),
      );
    });
  });
});
