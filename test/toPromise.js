/* eslint-disable no-undef */
import assert from 'assert';
import Maybe from '../src/maybe';

/**
 *
 */
describe('#toPromise', () => {
  /**
   *
   */
  it('should create a Promise', () => {
    const maybe = Maybe.just('Hello').toPromise();
    assert(maybe instanceof Promise);
  });
});
