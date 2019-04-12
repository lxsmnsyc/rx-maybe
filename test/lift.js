/* eslint-disable no-undef */
import assert from 'assert';
import Maybe from '../src/maybe';
/**
 *
 */
describe('#lift', () => {
  /**
   *
   */
  it('should return the same instance if no function is provided', () => {
    const source = Maybe.just('Hello');
    const maybe = source.lift();

    assert(source === maybe);
  });
  /**
   *
   */
  it('should signal an error if the lift operator returned a non-Observer', (done) => {
    const maybe = Maybe.just('Hello').lift(() => {});

    maybe.subscribe(
      () => done(false),
      () => done(false),
      () => done(),
    );
  });
  /**
   *
   */
  it('should subscribe successfully', (done) => {
    const maybe = Maybe.just('Hello').lift(observer => ({ onSubscribe: observer.onSubscribe, onSuccess: observer.onSuccess }));

    maybe.subscribe(
      () => done(),
      () => done(false),
      () => done(false),
    );
  });
});
