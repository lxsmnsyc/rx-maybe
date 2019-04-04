/* eslint-disable no-undef */
import assert from 'assert';
import Maybe from '../src/maybe';

/**
 *
 */
describe('#doOnError', () => {
  /**
   *
   */
  it('should create a Maybe', () => {
    const maybe = Maybe.just('Hello').doOnError(() => {});
    assert(maybe instanceof Maybe);
  });
  /**
   *
   */
  it('should return the same instance if the method received a non-function parameter.', () => {
    const source = Maybe.just('Hello');
    const maybe = source.doOnError();
    assert(source === maybe);
  });
  /**
   *
   */
  it('should call the given function on error.', (done) => {
    let called;
    const source = Maybe.error(new Error('Hello'));
    const maybe = source.doOnError(() => { called = true; });
    maybe.subscribe(
      () => done(false),
      () => done(false),
      () => called && done(),
    );
  });
});
