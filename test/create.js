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
  describe('#create', () => {
    /**
     *
     */
    it('should create a Maybe', () => {
      const maybe = Maybe.create(e => e.onSuccess('Hello World'));

      assert(maybe instanceof Maybe);
    });
    /**
     *
     */
    it('should signal error if the create received a non-function', (done) => {
      const maybe = Maybe.create();

      maybe.subscribe(
        () => done(false),
        () => done(false),
        () => done(),
      );
    });
    /**
     *
     */
    it('should signal error if the emitter signals success with undefined value.', (done) => {
      const maybe = Maybe.create(e => e.onSuccess() || e.onSuccess());

      maybe.subscribe(
        () => done(false),
        () => done(false),
        () => done(),
      );
    });
    /**
     *
     */
    it('should signal error if the emitter signals error with undefined value.', (done) => {
      const maybe = Maybe.create(e => e.onError() || e.onError());

      maybe.subscribe(
        () => done(false),
        () => done(false),
        () => done(),
      );
    });
    /**
     *
     */
    it('should be aborted successfully if emitter is aborted before any signal.', (done) => {
      const maybe = Maybe.create((e) => {
        setTimeout(e.onSuccess, 100, true);
        e.abort();
      });

      const controller = maybe.subscribe(
        () => done(false),
        () => done(false),
        () => done(false),
      );
      if (controller.signal.aborted) {
        done();
      }
    });
    /**
     *
     */
    it('should signal error if subscriber throws an error.', (done) => {
      const maybe = Maybe.create(() => {
        throw new Error('Expected');
      });

      maybe.subscribe(
        () => done(false),
        () => done(false),
        () => done(),
      );
    });
  });
});
