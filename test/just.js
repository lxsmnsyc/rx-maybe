/* eslint-disable no-undef */
import assert from 'assert';
import Maybe from '../src/maybe';

/**
 *
 */
describe('#just', () => {
  /**
   *
   */
  it('should create a Maybe', () => {
    const maybe = Maybe.just('Hello World');

    assert(maybe instanceof Maybe);
  });
  /**
   *
   */
  it('should succeed with the given value.', (done) => {
    const maybe = Maybe.just('Hello World');

    maybe.subscribe(
      x => (x === 'Hello World' ? done() : done(false)),
      () => done(false),
      () => done(false),
    );
  });
  /**
   *
   */
  it('should emit error if value is undefined.', (done) => {
    const maybe = Maybe.just();

    maybe.subscribe(
      () => done(false),
      () => done(false),
      () => done(),
    );
  });
});
