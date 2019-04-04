/* eslint-disable no-undef */
import assert from 'assert';
import Maybe from '../src/maybe';

/**
 *
 */
describe('#timeout', () => {
  /**
   *
   */
  it('should create a Maybe', () => {
    const maybe = Maybe.just('Hello').timeout(100);
    assert(maybe instanceof Maybe);
  });
  /**
   *
   */
  it('should return the same instance if the amount is not a number.', () => {
    const source = Maybe.just('Hello');
    const maybe = source.timeout();
    assert(source === maybe);
  });
  /**
   *
   */
  it('should signal success with the given value.', (done) => {
    const maybe = Maybe.just('Hello').timeout(100);
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
    const maybe = Maybe.empty().timeout(100);
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
    const maybe = Maybe.error('Hello').timeout(100);
    maybe.subscribe(
      () => done(false),
      () => done(false),
      () => done(),
    );
  });
  /**
   *
   */
  it('should signal error if the Maybe does not emit item within the given timeout.', (done) => {
    const maybe = Maybe.timer(200).timeout(100);
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
    const source = Maybe.timer(200).timeout(100);
    const controller = source.subscribe(
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
    const source = Maybe.error(new Error('Hello')).delay(200).timeout(100);
    const controller = source.subscribe(
      () => done(false),
      () => done(false),
    );

    controller.abort();
    if (controller.signal.aborted) {
      done();
    }
  });
});
