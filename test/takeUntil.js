/* eslint-disable no-undef */
import assert from 'assert';
import Maybe from '../src/maybe';

/**
 *
 */
describe('#takeUntil', () => {
  /**
   *
   */
  it('should create a Maybe', () => {
    const maybe = Maybe.just('Hello').takeUntil(Maybe.timer(100));

    assert(maybe instanceof Maybe);
  });
  /**
   *
   */
  it('should return the same instance if no other Maybe is provided', () => {
    const source = Maybe.just('Hello');
    const maybe = source.takeUntil();

    assert(source === maybe);
  });
  /**
   *
   */
  it('should signal success if other Maybe has not emitted a success signal', (done) => {
    const maybe = Maybe.just('Hello').takeUntil(Maybe.timer(100));

    maybe.subscribe(
      x => (x === 'Hello' ? done() : done(false)),
      () => done(false),
      () => done(false),
    );
  });
  /**
   *
   */
  it('should signal success if other Maybe has not emitted an error signal', (done) => {
    const maybe = Maybe.just('Hello').takeUntil(Maybe.error(new Error('World')).delay(100));

    maybe.subscribe(
      x => (x === 'Hello' ? done() : done(false)),
      () => done(false),
      () => done(false),
    );
  });
  /**
   *
   */
  it('should signal complete if other Maybe has not emitted a success signal', (done) => {
    const maybe = Maybe.empty().takeUntil(Maybe.timer(100));

    maybe.subscribe(
      () => done(false),
      () => done(),
      () => done(false),
    );
  });
  /**
   *
   */
  it('should signal complete if other Maybe has not emitted an error signal', (done) => {
    const maybe = Maybe.empty().takeUntil(Maybe.error(new Error('World')).delay(100));

    maybe.subscribe(
      () => done(false),
      () => done(),
      () => done(false),
    );
  });
  /**
   *
   */
  it('should signal error if other Maybe has emitted a success signal', (done) => {
    const maybe = Maybe.just('Hello').delay(100).takeUntil(Maybe.just('World'));

    maybe.subscribe(
      () => done(false),
      () => done(false),
      () => done(),
    );
  });
  /**
   *
   */
  it('should signal error if other Maybe has emitted a completion signal', (done) => {
    const maybe = Maybe.just('Hello').delay(100).takeUntil(Maybe.empty());

    maybe.subscribe(
      () => done(false),
      () => done(),
      () => done(false),
    );
  });
  /**
   *
   */
  it('should signal error if other Maybe has emitted an error signal', (done) => {
    const maybe = Maybe.just('Hello').delay(100).takeUntil(Maybe.error(new Error('World')));

    maybe.subscribe(
      () => done(false),
      () => done(false),
      () => done(),
    );
  });
  /**
   *
   */
  it('should signal error if source signals error, nonetheless', (done) => {
    const maybe = Maybe.error(new Error('Hello')).takeUntil(Maybe.timer(100));

    maybe.subscribe(
      () => done(false),
      () => done(false),
      () => done(),
    );
  });
});
