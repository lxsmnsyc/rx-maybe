/* eslint-disable no-undef */
import assert from 'assert';
import Maybe from '../src/maybe';

/**
 *
 */
describe('#onErrorResumeNext', () => {
  /**
   *
   */
  it('should create a Maybe', () => {
    const maybe = Maybe.error(new Error('Hello')).onErrorResumeNext(Maybe.just('World'));
    assert(maybe instanceof Maybe);
  });
  /**
   *
   */
  it('should return the same instance if parameter passed is not a Maybe or a function', () => {
    const source = Maybe.error(new Error('Hello'));
    const maybe = source.onErrorResumeNext();
    assert(maybe === source);
  });
  /**
   *
   */
  it('should subscribe to the given Maybe', (done) => {
    const maybe = Maybe.error(new Error('Hello')).onErrorResumeNext(Maybe.just('World'));
    maybe.subscribe(
      () => done(),
      () => done(false),
      () => done(false),
    );
  });
  /**
   *
   */
  it('should signal success if source emits an error signal', (done) => {
    const maybe = Maybe.just('Hello').onErrorResumeNext(Maybe.empty());

    maybe.subscribe(
      () => done(),
      () => done(false),
      () => done(false),
    );
  });
  /**
   *
   */
  it('should signal complete if source emits a complete signal', (done) => {
    const maybe = Maybe.empty().onErrorResumeNext(Maybe.just('Hello'));

    maybe.subscribe(
      () => done(false),
      () => done(),
      () => done(false),
    );
  });
  /**
   *
   */
  it('should subscribe to the given Maybe-producing Function', (done) => {
    const maybe = Maybe.error(new Error('Hello')).onErrorResumeNext(() => Maybe.just('World'));
    maybe.subscribe(
      () => done(),
      () => done(false),
      () => done(false),
    );
  });
  /**
   *
   */
  it('should subscribe to the given Maybe', (done) => {
    const maybe = Maybe.error(new Error('Hello')).onErrorResumeNext(Maybe.empty());
    maybe.subscribe(
      () => done(false),
      () => done(),
      () => done(false),
    );
  });
  /**
   *
   */
  it('should subscribe to the given Maybe-producing Function', (done) => {
    const maybe = Maybe.error(new Error('Hello')).onErrorResumeNext(() => Maybe.empty());
    maybe.subscribe(
      () => done(false),
      () => done(),
      () => done(false),
    );
  });
  /**
   *
   */
  it('should subscribe to the given Maybe', (done) => {
    const maybe = Maybe.error(new Error('Hello')).onErrorResumeNext(Maybe.error(new Error('Hello')));
    maybe.subscribe(
      () => done(false),
      () => done(false),
      () => done(),
    );
  });
  /**
   *
   */
  it('should subscribe to the given Maybe-producing Function', (done) => {
    const maybe = Maybe.error(new Error('Hello')).onErrorResumeNext(() => Maybe.error(new Error('Hello')));
    maybe.subscribe(
      () => done(false),
      () => done(false),
      () => done(),
    );
  });
  /**
   *
   */
  it('should emit error if provide function throws error.', (done) => {
    const maybe = Maybe.error(new Error('Hello')).onErrorResumeNext(() => { throw new Error('Ooops'); });
    maybe.subscribe(
      () => done(false),
      () => done(false),
      () => done(),
    );
  });
  /**
   *
   */
  it('should emit error if provide function returns non-Maybe.', (done) => {
    const maybe = Maybe.error(new Error('Hello')).onErrorResumeNext(() => {});
    maybe.subscribe(
      () => done(false),
      () => done(false),
      () => done(),
    );
  });
});
