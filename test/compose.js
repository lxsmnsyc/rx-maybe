/* eslint-disable no-undef */
import assert from 'assert';
import Maybe from '../src/maybe';

/**
 *
 */
describe('#compose', () => {
  /**
   *
   */
  it('should return the same instance if no function is provided', () => {
    const source = Maybe.just('Hello');
    const maybe = source.compose();

    assert(source === maybe);
  });
  /**
   *
   */
  it('should return a Maybe from the transformer', () => {
    const maybe = Maybe.just('Hello').compose(source => source.map(x => `${x} World`));

    assert(maybe instanceof Maybe);
  });
  /**
   *
   */
  it('should correctly signal the composed Maybe', (done) => {
    const maybe = Maybe.just('Hello').compose(source => source.map(x => `${x} World`));

    maybe.subscribe(
      x => (x === 'Hello World' ? done() : done(x)),
      () => done(false),
      () => done(false),
    );
  });
  /**
   *
   */
  it('should signal error if the transformer function returned a non-Maybe', (done) => {
    const maybe = Maybe.just('Hello').compose(() => undefined);

    maybe.subscribe(
      () => done(false),
      () => done(false),
      () => done(),
    );
  });
});
