/* eslint-disable no-undef */
import assert from 'assert';
import Maybe from '../src/maybe';

/**
 *
 */
describe('#fromResolvable', () => {
  /**
   *
   */
  it('should create a Maybe', () => {
    const maybe = Maybe.fromResolvable(res => res('Hello World'));
    assert(maybe instanceof Maybe);
  });
  /**
   *
   */
  it('should succeed with the given value.', (done) => {
    const maybe = Maybe.fromResolvable(res => res('Hello World'));

    maybe.subscribe(
      x => (x === 'Hello World' ? done() : done(false)),
      () => done(false),
      () => done(false),
    );
  });
  /**
   *
   */
  it('should complete.', (done) => {
    const maybe = Maybe.fromResolvable(res => res());

    maybe.subscribe(
      () => done(false),
      () => done(),
      () => done(false),
    );
  });
  /**
   *
   */
  it('should error with the given error.', (done) => {
    const maybe = Maybe.fromResolvable((res, rej) => rej(new Error('Hello World')));

    maybe.subscribe(
      () => done(false),
      () => done(false),
      () => done(),
    );
  });
  /**
   *
   */
  it('should signal error if the given value is not a function', (done) => {
    const maybe = Maybe.fromResolvable();

    maybe.subscribe(
      () => done(false),
      () => done(false),
      () => done(),
    );
  });
});
