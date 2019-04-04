/* eslint-disable no-undef */
import assert from 'assert';
import Maybe from '../src/maybe';

/**
 *
 */
describe('#error', () => {
  /**
   *
   */
  it('should create a Maybe', () => {
    const maybe = Maybe.error(new Error('Hello World'));

    assert(maybe instanceof Maybe);
  });
  /**
   *
   */
  it('should error with the given value.', (done) => {
    const maybe = Maybe.error(new Error('Hello World'));

    maybe.subscribe(
      () => done(false),
      () => done(false),
      () => done(),
    );
  });
  /**
   *
   */
  it('should error with the a message if the given value is null', (done) => {
    const maybe = Maybe.error();

    maybe.subscribe(
      () => done(false),
      () => done(false),
      () => done(),
    );
  });
  /**
   *
   */
  it('should error with the a message if the callable returned null', (done) => {
    const maybe = Maybe.error(() => {});

    maybe.subscribe(
      () => done(false),
      () => done(false),
      () => done(),
    );
  });
  /**
   *
   */
  it('should error if the callable throws an error.', (done) => {
    const maybe = Maybe.error(() => {
      throw new Error('Expected');
    });

    maybe.subscribe(
      () => done(false),
      () => done(false),
      () => done(),
    );
  });
});
