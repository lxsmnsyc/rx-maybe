/* eslint-disable no-undef */
import assert from 'assert';
import Maybe from '../src/maybe';

/**
 *
 */
describe('#doAfterTerminate', () => {
  /**
   *
   */
  it('should create a Maybe', () => {
    const maybe = Maybe.just('Hello').doAfterSuccess(() => {});
    assert(maybe instanceof Maybe);
  });
  /**
   *
   */
  it('should return the same instance if the method received a non-function parameter.', () => {
    const source = Maybe.just('Hello');
    const maybe = source.doAfterTerminate();
    assert(source === maybe);
  });
  /**
   *
   */
  it('should call the given function after success.', (done) => {
    let called;
    const source = Maybe.just('Hello');
    const maybe = source.doAfterTerminate(() => called && done());
    maybe.subscribe(
      () => { called = true; },
      () => done(false),
      () => done(false),
    );
  });
  /**
   *
   */
  it('should call the given function after complete.', (done) => {
    let called;
    const source = Maybe.empty();
    const maybe = source.doAfterTerminate(() => called && done());
    maybe.subscribe(
      () => done(false),
      () => { called = true; },
      () => done(false),
    );
  });
  /**
   *
   */
  it('should call the given function after error.', (done) => {
    let called;
    const source = Maybe.error(new Error('Hello'));
    const maybe = source.doAfterTerminate(() => called && done());
    maybe.subscribe(
      () => done(false),
      () => done(false),
      () => { called = true; },
    );
  });
});
