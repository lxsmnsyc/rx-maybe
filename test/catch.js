/* eslint-disable no-undef */
import assert from 'assert';
import Maybe from '../src/maybe';

/**
 *
 */
describe('#catch', () => {
  /**
   *
   */
  it('should create a Promise', () => {
    const maybe = Maybe.just('Hello').catch(x => x);
    assert(maybe instanceof Promise);
  });
});
