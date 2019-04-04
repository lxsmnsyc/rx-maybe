/* eslint-disable no-undef */
import assert from 'assert';
import Maybe from '../src/maybe';

/**
 *
 */
describe('#delaySubscription', () => {
  /**
   *
   */
  it('should create a Maybe', () => {
    const maybe = Maybe.just('Hello').delaySubscription(100);
    assert(maybe instanceof Maybe);
  });
  /**
   *
   */
  it('should return the same instance if the amount is not a number.', () => {
    const source = Maybe.just('Hello');
    const maybe = source.delaySubscription();
    assert(source === maybe);
  });
  /**
   *
   */
  it('should signal success with the given value.', (done) => {
    const maybe = Maybe.just('Hello').delaySubscription(100);
    maybe.subscribe(
      x => (x === 'Hello' ? done() : done(false)),
      () => done(false),
      () => done(false),
    );
  });
  /**
   *
   */
  it('should signal complete.', (done) => {
    const maybe = Maybe.empty().delaySubscription(100);
    maybe.subscribe(
      () => done(false),
      () => done(),
      () => done(false),
    );
  });
  /**
   *
   */
  it('should signal error with the given value.', (done) => {
    const maybe = Maybe.error(new Error('Hello')).delaySubscription(100);
    maybe.subscribe(
      () => done(false),
      () => done(false),
      x => (x === 'Hello' ? done() : done(false)),
    );
  });
  /**
   *
   */
  it('should not signal success if aborted.', (done) => {
    const source = Maybe.just('Hello').delaySubscription(100);
    const controller = source.subscribe(
      () => done(false),
      () => done(false),
      () => done(false),
    );

    controller.abort();
    if (controller.signal.aborted) {
      done();
    }
  });
  /**
   *
   */
  it('should not signal complete if aborted.', (done) => {
    const source = Maybe.empty().delaySubscription(100);
    const controller = source.subscribe(
      () => done(false),
      () => done(false),
      () => done(false),
    );

    controller.abort();
    if (controller.signal.aborted) {
      done();
    }
  });
  /**
   *
   */
  it('should not signal error if aborted.', (done) => {
    const source = Maybe.error(new Error('Hello')).delaySubscription(100);
    const controller = source.subscribe(
      () => done(false),
      () => done(false),
      () => done(false),
    );

    controller.abort();
    if (controller.signal.aborted) {
      done();
    }
  });
});
