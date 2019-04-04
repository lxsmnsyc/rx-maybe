/* eslint-disable no-undef */
import assert from 'assert';
import Maybe from '../src/maybe';

/**
 *
 */
describe('#fromCallable', () => {
  /**
   *
   */
  it('should create a Maybe', () => {
    const maybe = Maybe.fromCallable(() => 'Hello World');
    assert(maybe instanceof Maybe);
  });
  /**
   *
   */
  it('should succeed with the given value.', (done) => {
    const maybe = Maybe.fromCallable(() => 'Hello World');

    maybe.subscribe(
      x => (x === 'Hello World' ? done() : done(false)),
      () => done(false),
      () => done(false),
    );
  });
  /**
   *
   */
  it('should complete', (done) => {
    const maybe = Maybe.fromCallable(() => {});

    maybe.subscribe(
      () => done(false),
      () => done(),
      () => done(false),
    );
  });
  /**
   *
   */
  it('should signal an error if the callable throws an error.', (done) => {
    const maybe = Maybe.fromCallable(() => {
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
  it('should signal an success if the callable returns a resolved Promise with a value.', (done) => {
    const maybe = Maybe.fromCallable(() => Promise.resolve('Hello'));

    maybe.subscribe(
      () => done(),
      () => done(false),
      () => done(false),
    );
  });
  /**
   *
   */
  it('should signal an complete if the callable returns a resolved Promise with no value.', (done) => {
    const maybe = Maybe.fromCallable(() => Promise.resolve());

    maybe.subscribe(
      () => done(false),
      () => done(),
      () => done(false),
    );
  });
  /**
   *
   */
  it('should signal an error if the callable returns a rejected Promise.', (done) => {
    const maybe = Maybe.fromCallable(() => Promise.reject(new Error('Expected')));

    maybe.subscribe(
      () => done(false),
      () => done(false),
      () => done(),
    );
  });
  /**
   *
   */
  it('should signal an error if the callable is not a function', (done) => {
    const maybe = Maybe.fromCallable();

    maybe.subscribe(
      () => done(false),
      () => done(false),
      e => (e === 'Maybe.fromCallable: callable received is not a function.' ? done() : done(false)),
    );
  });
});
