/* eslint-disable no-undef */
import assert from 'assert';
import Maybe from '../src/maybe';

/**
 *
 */
describe('#doOnSuccess', () => {
  /**
   *
   */
  it('should create a Maybe', () => {
    const maybe = Maybe.just('Hello').doOnSuccess(() => {});
    assert(maybe instanceof Maybe);
  });
  /**
   *
   */
  it('should return the same instance if the method received a non-function parameter.', () => {
    const source = Maybe.just('Hello');
    const maybe = source.doOnSuccess();
    assert(source === maybe);
  });
  /**
   *
   */
  it('should call the given function on success.', (done) => {
    let called;
    const source = Maybe.just('Hello');
    const maybe = source.doOnSuccess(() => { called = true; });
    maybe.subscribe(
      () => called && done(),
      () => done(false),
    );
  });
});
