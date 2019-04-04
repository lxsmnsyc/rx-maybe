/* eslint-disable no-undef */
import assert from 'assert';
import Maybe from '../src/maybe';

/**
 *
 */
describe('#doOnSubscribe', () => {
  /**
   *
   */
  it('should create a Maybe', () => {
    const maybe = Maybe.just('Hello').doOnSubscribe(() => {});
    assert(maybe instanceof Maybe);
  });
  /**
   *
   */
  it('should return the same instance if no function is passed', () => {
    const source = Maybe.just('Hello');
    const maybe = source.doOnSubscribe();
    assert(source === maybe);
  });
  /**
   *
   */
  it('should be called before actual subscription.', (done) => {
    let called;
    const maybe = Maybe.just('Hello').doOnSubscribe(() => { called = true; });
    maybe.subscribeWith({
      onSubscribe() {
        if (called) {
          done();
        } else {
          done(false);
        }
      },
    });
  });
});
