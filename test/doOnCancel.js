/* eslint-disable no-undef */
import assert from 'assert';
import Maybe from '../src/maybe';

/**
 *
 */
describe('#doOnCancel', () => {
  /**
   *
   */
  it('should create a Maybe', () => {
    const maybe = Maybe.just('Hello').doOnCancel(() => {});
    assert(maybe instanceof Maybe);
  });
  /**
   *
   */
  it('should return the same instance if the method received a non-function parameter.', () => {
    const source = Maybe.just('Hello');
    const maybe = source.doOnCancel();
    assert(source === maybe);
  });
  /**
   *
   */
  it('should signal the success value then fire cancel callback.', (done) => {
    let called;
    const source = Maybe.just('Hello');
    const maybe = source.doOnCancel(() => called && done());

    maybe.subscribe(
      () => { called = true; },
      () => done(false),
      () => done(false),
    );
  });
  /**
   *
   */
  it('should signal the complete then fire cancel callback.', (done) => {
    let called;
    const source = Maybe.empty();
    const maybe = source.doOnCancel(() => called && done());

    maybe.subscribe(
      () => done(false),
      () => { called = true; },
      () => done(false),
    );
  });
  /**
   *
   */
  it('should signal the error value then fire cancel callback.', (done) => {
    let called;
    const source = Maybe.error(new Error('Hello'));
    const maybe = source.doOnCancel(() => called && done());

    maybe.subscribe(
      () => done(false),
      () => done(false),
      () => { called = true; },
    );
  });
  /**
   *
   */
  it('should call the given function on cancel.', (done) => {
    const source = Maybe.just('Hello').delay(100);
    const maybe = source.doOnCancel(() => done());

    const controller = maybe.subscribe(
      () => done(false),
      () => done(false),
      () => done(false),
    );
    controller.cancel();
  });
});
