/* eslint-disable no-undef */
import assert from 'assert';
import Maybe from '../src/maybe';

/**
 *
 */
describe('#onErrorReturn', () => {
  /**
   *
   */
  it('should create a Maybe', () => {
    const maybe = Maybe.error(new Error('Hello')).onErrorReturn(() => 'World');
    assert(maybe instanceof Maybe);
  });
  /**
   *
   */
  it('should return the same instance if parameter passed is not a Maybe or a function', () => {
    const source = Maybe.error(new Error('Hello'));
    const maybe = source.onErrorReturn();
    assert(maybe === source);
  });
  /**
   *
   */
  it('should emit the supplied item by the given function in case of error', (done) => {
    const maybe = Maybe.error(new Error('Hello')).onErrorReturn(() => 'World');

    maybe.subscribe(
      () => done(),
      () => done(false),
      () => done(false),
    );
  });
  /**
   *
   */
  it('should emit error if provide function throws error.', (done) => {
    const maybe = Maybe.error(new Error('Hello')).onErrorReturn(() => { throw new Error('Ooops'); });
    maybe.subscribe(
      () => done(false),
      () => done(false),
      () => done(),
    );
  });
  /**
   *
   */
  it('should emit error if provide function returns undefined.', (done) => {
    const maybe = Maybe.error(new Error('Hello')).onErrorReturn(() => {});
    maybe.subscribe(
      () => done(false),
      () => done(false),
      () => done(),
    );
  });
});
