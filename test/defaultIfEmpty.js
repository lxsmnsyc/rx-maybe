/* eslint-disable no-undef */
import assert from 'assert';
import Maybe from '../src/maybe';

describe('#defaultIfEmpty', () => {
  it('should return a Maybe', () => {
    assert(Maybe.empty().defaultIfEmpty('Hello') instanceof Maybe);
  });
  it('should return same reference if value is null', () => {
    const source = Maybe.empty();
    assert(source === source.defaultIfEmpty());
  });
  it('should signal success if source signals success', (done) => {
    const source = Maybe.just('Hello').defaultIfEmpty('World');

    source.subscribe(
      x => (x === 'Hello' ? done() : done(false)),
      () => done(false),
      () => done(false),
    );
  });
  it('should signal success if source signals complete', (done) => {
    const source = Maybe.empty().defaultIfEmpty('World');

    source.subscribe(
      x => (x === 'World' ? done() : done(false)),
      () => done(false),
      () => done(false),
    );
  });
  it('should signal error if source signals error', (done) => {
    const source = Maybe.error(new Error('Hello')).defaultIfEmpty('World');

    source.subscribe(
      () => done(false),
      () => done(false),
      () => done(),
    );
  });
});
