/* eslint-disable no-undef */
import assert from 'assert';
import Maybe from '../src/maybe';

/**
 *
 */
describe('#never', () => {
  /**
   *
   */
  it('should create a Maybe', () => {
    const maybe = Maybe.never();
    assert(maybe instanceof Maybe);
  });
  /**
   *
   */
  it('should not signal.', () => {
    const maybe = Maybe.never();
    maybe.subscribe(
      () => done(false),
      () => done(false),
      () => done(false),
    );
  });
});
