/* eslint-disable no-undef */
import assert from 'assert';
import Maybe from '../src/maybe';

/**
 *
 */
describe('#doOnEvent', () => {
  /**
   *
   */
  it('should create a Maybe', () => {
    const maybe = Maybe.just('Hello').doOnEvent(() => {});
    assert(maybe instanceof Maybe);
  });
  /**
   *
   */
  it('should return the same instance if the method received a non-function parameter.', () => {
    const source = Maybe.just('Hello');
    const maybe = source.doOnEvent();
    assert(source === maybe);
  });
  /**
   *
   */
  it('should call the given function on success.', (done) => {
    let called;
    const source = Maybe.just('Hello');
    const maybe = source.doOnEvent(() => { called = true; });
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
    const maybe = source.doOnEvent(() => { called = true; });
    maybe.subscribe(
      () => done(false),
      () => called && done(),
      () => done(false),
    );
  });
  /**
   *
   */
  it('should call the given function on error.', (done) => {
    let called;
    const source = Maybe.error(new Error('Hello'));
    const maybe = source.doOnEvent(() => { called = true; });
    maybe.subscribe(
      () => done(false),
      () => done(false),
      () => called && done(),
    );
  });
});
