/* eslint-disable no-undef */
import assert from 'assert';
import Maybe from '../src/maybe';

/**
 *
 */
describe('#onErrorReturnItem', () => {
  /**
   *
   */
  it('should create a Maybe', () => {
    const maybe = Maybe.error(new Error('Hello')).onErrorReturnItem('World');
    assert(maybe instanceof Maybe);
  });
  /**
   *
   */
  it('should return the same instance if parameter passed is not a Maybe or a function', () => {
    const source = Maybe.error(new Error('Hello'));
    const maybe = source.onErrorReturnItem();
    assert(maybe === source);
  });
  /**
   *
   */
  it('should emit the given item in case of error', (done) => {
    const maybe = Maybe.error(new Error('Hello')).onErrorReturnItem('World');

    maybe.subscribe(
      x => (x === 'World' ? done() : done(false)),
      () => done(false),
      () => done(false),
    );
  });
});
