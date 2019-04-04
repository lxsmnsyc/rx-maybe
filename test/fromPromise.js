/* eslint-disable no-undef */
import assert from 'assert';
import Maybe from '../src/maybe';


/**
 *
 */
describe('#fromPromise', () => {
  /**
   *
   */
  it('should create a Maybe', () => {
    const maybe = Maybe.fromPromise(new Promise(res => res('Hello World')));
    assert(maybe instanceof Maybe);
  });
  /**
   *
   */
  it('should succeed with the given value.', (done) => {
    const maybe = Maybe.fromPromise(new Promise(res => res('Hello World')));

    maybe.subscribe(
      x => (x === 'Hello World' ? done() : done(false)),
      () => done(false),
      () => done(false),
    );
  });

  /**
   *
   */
  it('should signal error if the given value is not Promise like', (done) => {
    const maybe = Maybe.fromPromise();

    maybe.subscribe(
      () => done(false),
      () => done(false),
      () => done(),
    );
  });
});
