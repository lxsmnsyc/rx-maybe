/* eslint-disable no-undef */
import assert from 'assert';
import Maybe from '../src/maybe';

/**
 *
 */
describe('#merge', () => {
  /**
   *
   */
  it('should create a Maybe', () => {
    const maybe = Maybe.merge(Maybe.just(Maybe.just('Hello')));

    assert(maybe instanceof Maybe);
  });
  /**
   *
   */
  it('should signal error if no source is provided', (done) => {
    const maybe = Maybe.merge();

    maybe.subscribe(
      () => done(false),
      () => done(false),
      () => done(),
    );
  });
  /**
   *
   */
  it('should signal error if source emitted a non-Maybe', (done) => {
    const maybe = Maybe.merge(Maybe.just('Hello'));

    maybe.subscribe(
      () => done(false),
      () => done(false),
      () => done(),
    );
  });
  /**
   *
   */
  it('should signal complete if source emits a complete signal', (done) => {
    const maybe = Maybe.merge(Maybe.empty());

    maybe.subscribe(
      () => done(false),
      () => done(),
      () => done(false),
    );
  });
  /**
   *
   */
  it('should signal error if source emits an error signal', (done) => {
    const maybe = Maybe.merge(Maybe.error(new Error('Hello')));

    maybe.subscribe(
      () => done(false),
      () => done(false),
      () => done(),
    );
  });
  /**
   *
   */
  it('should signal success of the signaled Maybe', (done) => {
    const maybe = Maybe.merge(Maybe.just(Maybe.just('Hello')));

    maybe.subscribe(
      x => (x === 'Hello' ? done() : done(false)),
      () => done(false),
      () => done(false),
    );
  });
  /**
   *
   */
  it('should signal complete of the signaled Maybe', (done) => {
    const maybe = Maybe.merge(Maybe.just(Maybe.empty()));

    maybe.subscribe(
      () => done(false),
      () => done(),
      () => done(false),
    );
  });
});
