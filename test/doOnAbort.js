/* eslint-disable no-undef */
import assert from 'assert';
import Maybe from '../src/maybe';

/**
 *
 */
describe('#doOnAbort', () => {
  /**
   *
   */
  it('should create a Maybe', () => {
    const maybe = Maybe.just('Hello').doOnAbort(() => {});
    assert(maybe instanceof Maybe);
  });
  /**
   *
   */
  it('should return the same instance if the method received a non-function parameter.', () => {
    const source = Maybe.just('Hello');
    const maybe = source.doOnAbort();
    assert(source === maybe);
  });
  /**
   *
   */
  it('should signal the success value then fire abort callback.', (done) => {
    let called;
    const source = Maybe.just('Hello');
    const maybe = source.doOnAbort(() => called && done());

    maybe.subscribe(
      () => { called = true; },
      () => done(false),
      () => done(false),
    );
  });
  /**
   *
   */
  it('should signal the complete then fire abort callback.', (done) => {
    let called;
    const source = Maybe.empty();
    const maybe = source.doOnAbort(() => called && done());

    maybe.subscribe(
      () => done(false),
      () => { called = true; },
      () => done(false),
    );
  });
  /**
   *
   */
  it('should signal the error value then fire abort callback.', (done) => {
    let called;
    const source = Maybe.error(new Error('Hello'));
    const maybe = source.doOnAbort(() => called && done());

    maybe.subscribe(
      () => done(false),
      () => done(false),
      () => { called = true; },
    );
  });
  /**
   *
   */
  it('should call the given function on abort.', (done) => {
    const source = Maybe.just('Hello').delay(100);
    const maybe = source.doOnAbort(() => done());

    const controller = maybe.subscribe(
      () => done(false),
      () => done(false),
      () => done(false),
    );
    controller.abort();
  });
});
