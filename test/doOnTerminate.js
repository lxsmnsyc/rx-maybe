/* eslint-disable no-undef */
import assert from 'assert';
import Maybe from '../src/maybe';

/**
 *
 */
describe('#doOnTerminate', () => {
  /**
   *
   */
  it('should create a Maybe', () => {
    const maybe = Maybe.just('Hello').doOnTerminate(() => {});
    assert(maybe instanceof Maybe);
  });
  /**
   *
   */
  it('should return the same instance if the method received a non-function parameter.', () => {
    const source = Maybe.just('Hello');
    const maybe = source.doOnTerminate();
    assert(source === maybe);
  });
  /**
   *
   */
  it('should call the given function on success.', (done) => {
    let called;
    const source = Maybe.just('Hello');
    const maybe = source.doOnTerminate(() => { called = true; });
    maybe.subscribe(
      () => called && done(),
      () => done(false),
      () => done(false),
    );
  });
  /**
   *
   */
  it('should call the given function on complete.', (done) => {
    let called;
    const source = Maybe.empty();
    const maybe = source.doOnTerminate(() => { called = true; });
    maybe.subscribe(
      () => done(false),
      () => done(false),
      () => called && done(),
    );
  });
  /**
   *
   */
  it('should call the given function on error.', (done) => {
    let called;
    const source = Maybe.error(new Error('Hello'));
    const maybe = source.doOnTerminate(() => { called = true; });
    maybe.subscribe(
      () => done(false),
      () => done(false),
      () => called && done(),
    );
  });
});
