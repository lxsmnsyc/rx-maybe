/* eslint-disable no-undef */
import assert from 'assert';
import Maybe from '../src/maybe';

/**
 *
 */
describe('#zipWith', () => {
  /**
   *
   */
  it('should create a Maybe', () => {
    const maybe = Maybe.just('Hello').zipWith(Maybe.just('World'));
    assert(maybe instanceof Maybe);
  });
  /**
   *
   */
  it('should return the same instance if the other parameter is non-Maybe', () => {
    const source = Maybe.just('Hello');
    const maybe = source.zipWith();
    assert(source === maybe);
  });
  /**
   *
   */
  it('should signal an error if the zipper returns undefined', (done) => {
    const maybe = Maybe.just('Hello').zipWith(Maybe.just('World'), () => undefined);

    maybe.subscribe(
      () => done(false),
      () => done(false),
      () => done(),
    );
  });
  /**
   *
   */
  it('should signal an error if the zipper returns undefined', (done) => {
    const maybe = Maybe.just('Hello').delay(100).zipWith(Maybe.just('World'), () => undefined);

    maybe.subscribe(
      () => done(false),
      () => done(false),
      () => done(),
    );
  });
  /**
   *
   */
  it('should signal success with an array (no zipper function).', (done) => {
    const maybe = Maybe.just('Hello').delay(100).zipWith(Maybe.just('World'));
    maybe.subscribe(
      x => (x instanceof Array ? done() : done(false)),
      () => done(false),
      () => done(false),
    );
  });
  /**
   *
   */
  it('should signal success with an array with the correct values (no zipper function).', (done) => {
    const maybe = Maybe.just('Hello').zipWith(Maybe.just('World'));
    maybe.subscribe(
      x => (x[0] === 'Hello' && x[1] === 'World' ? done() : done(false)),
      () => done(false),
      () => done(false),
    );
  });
  /**
   *
   */
  it('should signal error if source throws error.', (done) => {
    const source = Maybe.error(new Error('Hello')).zipWith(Maybe.just('World'));
    source.subscribe(
      () => done(false),
      () => done(false),
      () => done(),
    );
  });
  /**
   *
   */
  it('should signal error if other Maybe throws error.', (done) => {
    const source = Maybe.just('Hello').zipWith(Maybe.error('World'));
    source.subscribe(
      () => done(false),
      () => done(false),
      () => done(),
    );
  });
  it('should signal complete if source signals complete.', (done) => {
    const source = Maybe.empty().zipWith(Maybe.just('World'));
    source.subscribe(
      () => done(false),
      () => done(),
      () => done(false),
    );
  });
  /**
   *
   */
  it('should signal complete if other Maybe signals complete.', (done) => {
    const source = Maybe.just('World').zipWith(Maybe.empty());
    source.subscribe(
      () => done(false),
      () => done(),
      () => done(false),
    );
  });
  /**
   *
   */
  it('should not signal success if cancelled.', (done) => {
    const source = Maybe.just('Hello').delay(100).zipWith(Maybe.just('World'));
    const controller = source.subscribe(
      () => done(false),
      () => done(false),
      () => done(false),
    );

    controller.cancel();
    if (controller.cancelled) {
      done();
    }
  });
});
