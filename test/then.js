/* eslint-disable no-undef */
import assert from 'assert';
import Maybe from '../src/maybe';

/**
 *
 */
describe('#then', () => {
  /**
   *
   */
  it('should create a Promise', () => {
    const maybe = Maybe.just('Hello').then(x => x, x => x);
    assert(maybe instanceof Promise);
  });
});
