/* eslint-disable no-undef */
import assert from 'assert';
import Maybe from '../src/maybe';

/**
 *
 */
describe('#retry', () => {
  /**
   *
   */
  it('should create a Maybe', () => {
    const maybe = Maybe.error(new Error('Hello')).retry(x => x === 3);

    assert(maybe instanceof Maybe);
  });
  /**
   *
   */
  it('should signal a success if no error', (done) => {
    const maybe = Maybe.just('Hello').retry(x => x === 3);

    maybe.subscribe(
      () => done(),
      () => done(false),
      () => done(false),
    );
  });
  /**
   *
   */
  it('should signal complete if no error', (done) => {
    const maybe = Maybe.empty().retry(x => x === 3);

    maybe.subscribe(
      () => done(),
      () => done(false),
      () => done(false),
    );
  });
  /**
   *
   */
  it('should retry if there is an error and if it passes the predicate', (done) => {
    let retried;
    const maybe = Maybe.error(new Error('Hello')).retry((x) => {
      if (x === 2) {
        retried = true;
      }
      return x < 3;
    });

    maybe.subscribe(
      () => done(false),
      () => done(false),
      () => retried && done(),
    );
  });
  /**
   *
   */
  it('should signal an error if predicate is false', (done) => {
    const maybe = Maybe.error(new Error('Hello')).retry(x => x === 3);

    maybe.subscribe(
      () => done(false),
      () => done(false),
      () => done(),
    );
  });
});
