/* eslint-disable no-undef */
import assert from 'assert';
import Maybe from '../src/maybe';

/**
 *
 */
describe('#map', () => {
  /**
   *
   */
  it('should create a Maybe', () => {
    const maybe = Maybe.just('Hello').map(x => `${x} World`);
    assert(maybe instanceof Maybe);
  });
  /**
   *
   */
  it('should succeed with the given value.', (done) => {
    const maybe = Maybe.just('Hello').map(x => `${x} World`);

    maybe.subscribe(
      x => (x === 'Hello World' ? done() : done(false)),
      () => done(false),
    );
  });
  /**
   *
   */
  it('should signal an error if the mapper throws an error', (done) => {
    const maybe = Maybe.just('Hello').map(() => {
      throw new Error('Expected');
    });

    maybe.subscribe(
      () => done(false),
      () => done(false),
      () => done(),
    );
  });
  /**
   *
   */
  it('should signal an error if the mapper returns undefined', (done) => {
    const maybe = Maybe.just('Hello').map(() => undefined);

    maybe.subscribe(
      () => done(false),
      () => done(false),
      () => done(),
    );
  });
  /**
   *
   */
  it('should retain the value if no function is supplied.', (done) => {
    const maybe = Maybe.just('Hello').map();

    maybe.subscribe(
      x => (x === 'Hello' ? done() : done(false)),
      () => done(false),
    );
  });
});
