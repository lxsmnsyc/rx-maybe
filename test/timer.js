/* eslint-disable no-undef */
import assert from 'assert';
import Maybe from '../src/maybe';

/**
 *
 */
describe('#timer', () => {
  /**
   *
   */
  it('should create a Maybe', () => {
    const maybe = Maybe.timer(100);
    assert(maybe instanceof Maybe);
  });
  /**
   *
   */
  it('should signal error if amount is not a number.', (done) => {
    const maybe = Maybe.timer();

    maybe.subscribe(
      () => done(false),
      () => done(false),
      () => done(),
    );
  });
  /**
   *
   */
  it('should signal success 0', (done) => {
    const maybe = Maybe.timer(100);
    maybe.subscribe(
      x => (x === 0 ? done() : done(false)),
      () => done(false),
      () => done(false),
    );
  });
  /**
   *
   */
  it('should not signal success if cancelled.', (done) => {
    const maybe = Maybe.timer(100);
    const controller = maybe.subscribe(
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
