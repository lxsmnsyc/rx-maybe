/* eslint-disable no-undef */
import assert from 'assert';
import Maybe from '../src/maybe';

/**
*
*/
describe('#zip', () => {
  /**
  *
  */
  it('should create a Maybe', () => {
    const maybe = Maybe.zip([Maybe.just('Hello'), Maybe.just('World')]);
    assert(maybe instanceof Maybe);
  });
  /**
  *
  */
  it('should signal error if sources is not iterable.', (done) => {
    const maybe = Maybe.zip();
    maybe.subscribe(
      () => done(false),
      () => done(false),
      () => done(),
    );
  });
  /**
  *
  */
  it('should signal error if source is empty iterable.', (done) => {
    const maybe = Maybe.zip([]);
    maybe.subscribe(
      () => done(false),
      () => done(false),
      () => done(),
    );
  });
  /**
   *
   */
  it('should signal an error if the zipper throws an error', (done) => {
    const maybe = Maybe.zip([Maybe.just('Hello'), Maybe.just('World')], () => undefined);

    maybe.subscribe(
      () => done(false),
      () => done(false),
      () => done(),
    );
  });
  /**
  *
  */
  it('should signal success with an array (no zipper function).', (done) => {
    const maybe = Maybe.zip([Maybe.just('Hello').delay(100), Maybe.just('World')]);
    maybe.subscribe(
      x => (x instanceof Array ? done() : done(false)),
      () => done(false),
      () => done(false),
    );
  });
  /**
  *
  */
  it('should signal success with an array with the correct values (no zipper function).', (done) => {
    const maybe = Maybe.zip([Maybe.just('Hello'), Maybe.just('World')]);
    maybe.subscribe(
      x => (x[0] === 'Hello' && x[1] === 'World' ? done() : done(false)),
      () => done(false),
      () => done(false),
    );
  });
  /**
  *
  */
  it('should signal success with an array with the correct values, consider non-Maybe (no zipper function).', (done) => {
    const maybe = Maybe.zip(['Hello', Maybe.just('World')]);
    maybe.subscribe(
      x => (x[0] === 'Hello' && x[1] === 'World' ? done() : done(false)),
      () => done(false),
      () => done(false),
    );
  });
  /**
  *
  */
  it('should signal error if one of the sources is undefined.', (done) => {
    const source = Maybe.zip([undefined, Maybe.just('World')]);
    source.subscribe(
      () => done(false),
      () => done(false),
      () => done(),
    );
  });
  /**
  *
  */
  it('should signal error if a source throws error.', (done) => {
    const source = Maybe.zip([Maybe.error(new Error('Hello')), Maybe.just('World')]);
    source.subscribe(
      () => done(false),
      () => done(false),
      () => done(),
    );
  });
  /**
  *
  */
  it('should signal complete if a source throws error.', (done) => {
    const source = Maybe.zip([Maybe.empty(), Maybe.just('World')]);
    source.subscribe(
      () => done(false),
      () => done(),
      () => done(false),
    );
  });
  /**
  *
  */
  it('should not signal success if cancelled.', (done) => {
    const source = Maybe.zip([Maybe.just('Hello').delay(100), Maybe.just('World')]);
    const controller = source.subscribe(
      () => done(false),
      () => done(false),
      () => done(false),
    );

    controller.cancel();
    if (controller.cancelled) {
      done();
    }
  });
});
