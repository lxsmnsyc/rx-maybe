/* eslint-disable no-undef */
import assert from 'assert';
import Maybe from '../src/maybe';

/**
 *
 */
describe('#doAfterSuccess', () => {
  /**
   *
   */
  it('should create a Maybe', () => {
    const maybe = Maybe.just('Hello').doAfterSuccess(x => console.log(`after success: ${x}`));
    assert(maybe instanceof Maybe);
  });
  /**
   *
   */
  it('should return the same instance if the method received a non-function parameter.', () => {
    const source = Maybe.just('Hello');
    const maybe = source.doAfterSuccess();
    assert(source === maybe);
  });
  /**
   *
   */
  it('should call the given function after success.', (done) => {
    let called;
    const source = Maybe.just('Hello');
    const maybe = source.doAfterSuccess(() => called && done());
    maybe.subscribe(
      () => { called = true; },
      () => done(false),
      () => done(false),
    );
  });
});
