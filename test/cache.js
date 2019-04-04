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
  describe('#cache', () => {
    /**
     *
     */
    it('should create a Maybe', () => {
      const maybe = Maybe.just('Hello World').cache();
      assert(maybe instanceof Maybe);
    });
    /**
     *
     */
    it('should signal cached success value', (done) => {
      let flag;
      const maybe = Maybe.just('Hello World').delay(100).cache();

      setTimeout(() => {
        maybe.subscribe(
          () => { flag = true; },
          () => done(false),
          () => done(false),
        );
        setTimeout(() => {
          maybe.subscribe(
            x => (flag ? done() : done(x)),
            () => done(false),
            () => done(false),
          );
        }, 100);
      }, 200);
    });
    /**
     *
     */
    it('should signal cached complete', (done) => {
      let flag;
      const maybe = Maybe.empty().delay(100).cache();

      setTimeout(() => {
        maybe.subscribe(
          () => done(false),
          () => { flag = true; },
          () => done(false),
        );
        setTimeout(() => {
          maybe.subscribe(
            () => done(false),
            () => (flag ? done() : done(false)),
            () => done(false),
          );
        }, 100);
      }, 200);
    });
    /**
     *
     */
    it('should signal cached error value', (done) => {
      let flag;
      const maybe = Maybe.error(new Error('Hello')).delay(100).cache();

      setTimeout(() => {
        maybe.subscribe(
          () => done(false),
          () => done(false),
          () => { flag = true; },
        );

        setTimeout(() => {
          maybe.subscribe(
            () => done(false),
            () => done(false),
            () => (flag ? done() : done(false)),
          );
        }, 100);
      }, 200);
    });
  });
});
