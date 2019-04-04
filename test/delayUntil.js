/* eslint-disable no-undef */
import assert from 'assert';
import Maybe from '../src/maybe';

/**
 *
 */
describe('#delayUntil', () => {
  /**
   *
   */
  it('should create a Maybe', () => {
    const maybe = Maybe.just('Hello').delayUntil(Maybe.timer(100));
    assert(maybe instanceof Maybe);
  });
  /**
   *
   */
  it('should return the same instance if the provided value is not a Maybe.', () => {
    const source = Maybe.just('Hello');
    const maybe = source.delayUntil();
    assert(source === maybe);
  });
  /**
   *
   */
  it('should signal success with the given value.', (done) => {
    const maybe = Maybe.just('Hello').delayUntil(Maybe.timer(100));
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
    const maybe = Maybe.empty().delayUntil(Maybe.timer(100));
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
    const maybe = Maybe.error(new Error('Hello')).delayUntil(Maybe.timer(100));
    maybe.subscribe(
      () => done(false),
      () => done(false),
      () => done(),
    );
  });
  /**
   *
   */
  it('should signal error if other Maybe signals error.', (done) => {
    const maybe = Maybe.error(new Error('World')).delayUntil(Maybe.error(new Error('Hello')));
    maybe.subscribe(
      () => done(false),
      () => done(false),
      () => done(),
    );
  });
  /**
   *
   */
  it('should not signal success if aborted.', (done) => {
    const source = Maybe.just('Hello').delayUntil(Maybe.timer(100));
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
    const source = Maybe.empty().delayUntil(Maybe.timer(100));
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
    const source = Maybe.error(new Error('Hello')).delayUntil(Maybe.timer(100));
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
