/* eslint-disable no-undef */
import assert from 'assert';
import Maybe from '../src/maybe';

/**
 *
 */
describe('#flatMap', () => {
  /**
   *
   */
  it('should create a Maybe', () => {
    const maybe = Maybe.just('Hello').flatMap(x => Maybe.just(`${x} World`));

    assert(maybe instanceof Maybe);
  });
  /**
   *
   */
  it('should return the same instance if the method received a non-function parameter.', () => {
    const source = Maybe.just('Hello');
    const maybe = source.flatMap();
    assert(source === maybe);
  });
  /**
   *
   */
  it('should signal error if mapper returns a non-Maybe', (done) => {
    const maybe = Maybe.just('Hello').flatMap(() => {});

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
    const maybe = Maybe.empty().flatMap(() => Maybe.just('Hello'));

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
    const maybe = Maybe.error(new Error('Hello')).flatMap(() => Maybe.just('Hello'));

    maybe.subscribe(
      () => done(false),
      () => done(false),
      () => done(),
    );
  });
  /**
   *
   */
  it('should signal success of the returned Maybe', (done) => {
    const maybe = Maybe.just('Hello').flatMap(x => Maybe.just(`${x} World`));

    maybe.subscribe(
      x => (x === 'Hello World' ? done() : done(false)),
      () => done(false),
      () => done(false),
    );
  });
  /**
   *
   */
  it('should signal complete of the returned Maybe', (done) => {
    const maybe = Maybe.just('Hello').flatMap(() => Maybe.empty());

    maybe.subscribe(
      () => done(false),
      () => done(),
      () => done(false),
    );
  });
  /**
   *
   */
  it('should signal error of the returned Maybe', (done) => {
    const maybe = Maybe.just('Hello').flatMap(x => Maybe.error(new Error(x)));

    maybe.subscribe(
      () => done(false),
      () => done(false),
      () => done(),
    );
  });
});
