/* eslint-disable no-undef */
import assert from 'assert';
import Maybe from '../src/maybe';
/**
 *
 */
describe('#ambArray', () => {
  /**
   *
   */
  it('should create a Maybe', () => {
    const maybe = Maybe.ambArray([Maybe.just('First'), Maybe.just('Second')]);
    assert(maybe instanceof Maybe);
  });
  /**
   *
   */
  it('should signal success from the earliest source.', (done) => {
    const maybe = Maybe.ambArray([Maybe.just('Hello'), Maybe.timer(100)]);
    maybe.subscribe(
      () => done(),
      () => done(false),
      () => done(false),
    );
  });
  /**
   *
   */
  it('should signal complete from the earliest source.', (done) => {
    const maybe = Maybe.ambArray([Maybe.empty(), Maybe.timer(100)]);
    maybe.subscribe(
      () => done(false),
      () => done(),
      () => done(false),
    );
  });
  /**
   *
   */
  it('should signal error from the earliest source.', (done) => {
    const maybe = Maybe.ambArray([Maybe.error(new Error('Hello')), Maybe.timer(100)]);
    maybe.subscribe(
      () => done(false),
      () => done(false),
      () => done(),
    );
  });
  /**
   *
   */
  it('should signal error if one of the source is non-Maybe.', (done) => {
    const maybe = Maybe.ambArray(['Hello', Maybe.timer(100)]);
    maybe.subscribe(
      () => done(false),
      () => done(false),
      () => done(),
    );
  });
  /**
   *
   */
  it('should signal error if given argument is not Iterable', (done) => {
    const maybe = Maybe.ambArray();
    maybe.subscribe(
      () => done(false),
      () => done(false),
      () => done(),
    );
  });
});
