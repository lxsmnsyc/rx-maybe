/* eslint-disable no-undef */
import assert from 'assert';
import Maybe from '../src/maybe';

/**
 *
 */
describe('#doFinally', () => {
  /**
   *
   */
  it('should create a Maybe', () => {
    const maybe = Maybe.just('Hello').doFinally(() => {});
    assert(maybe instanceof Maybe);
  });
  /**
   *
   */
  it('should return the same instance if the method received a non-function parameter.', () => {
    const source = Maybe.just('Hello');
    const maybe = source.doFinally();
    assert(source === maybe);
  });
  /**
   *
   */
  it('should call the given function after success.', (done) => {
    let called;
    const source = Maybe.just('Hello');
    const maybe = source.doFinally(() => called && done());
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
    const maybe = source.doFinally(() => called && done());
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
    const maybe = source.doFinally(() => called && done());
    maybe.subscribe(
      () => done(false),
      () => done(false),
      () => { called = true; },
    );
  });
  /**
   *
   */
  it('should call the given function on dispose.', (done) => {
    const source = Maybe.timer(100);
    const maybe = source.doFinally(() => done());

    const controller = maybe.subscribe(
      () => done(false),
      () => done(false),
      () => done(false),
    );
    controller.abort();
  });
});
