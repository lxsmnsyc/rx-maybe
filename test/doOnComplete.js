/* eslint-disable no-undef */
import assert from 'assert';
import Maybe from '../src/maybe';

/**
 *
 */
describe('#doOnComplete', () => {
  /**
   *
   */
  it('should create a Maybe', () => {
    const maybe = Maybe.empty().doOnComplete(() => {});
    assert(maybe instanceof Maybe);
  });
  /**
   *
   */
  it('should return the same instance if the method received a non-function parameter.', () => {
    const source = Maybe.empty();
    const maybe = source.doOnComplete();
    assert(source === maybe);
  });
  /**
   *
   */
  it('should call the given function on error.', (done) => {
    let called;
    const source = Maybe.empty();
    const maybe = source.doOnComplete(() => { called = true; });
    maybe.subscribe(
      () => done(false),
      () => called && done(),
    );
  });
});
