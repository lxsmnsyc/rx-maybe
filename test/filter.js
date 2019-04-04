/* eslint-disable no-undef */
import assert from 'assert';
import Maybe from '../src/maybe';

describe('#filter', () => {
  it('should return a Maybe', () => {
    assert(Maybe.empty().filter(Maybe.just('Hello')) instanceof Maybe);
  });
  it('should return same reference if value is non-function', () => {
    const source = Maybe.empty();
    assert(source === source.filter());
  });
  it('should signal complete if source signals complete', (done) => {
    const source = Maybe.empty().filter(Boolean);

    source.subscribe(
      () => done(false),
      () => done(),
      () => done(false),
    );
  });
  it('should signal success if source signals success and predicate returns true', (done) => {
    const source = Maybe.just('Hello').filter(Boolean);

    source.subscribe(
      x => (x === 'Hello' ? done() : done(false)),
      () => done(false),
      () => done(false),
    );
  });
  it('should signal complete if source signals success and predicate returns false', (done) => {
    const source = Maybe.just('Hello').filter(x => x == null);

    source.subscribe(
      x => (x === 'Hello' ? done() : done(false)),
      () => done(false),
      () => done(false),
    );
  });
  it('should signal error if source  signals success and predicate throws error', (done) => {
    const source = Maybe.just('Hello').filter((x) => { throw new Error(x); });

    source.subscribe(
      () => done(false),
      () => done(false),
      () => done(),
    );
  });
  it('should signal error if source signals error', (done) => {
    const source = Maybe.error(new Error('Hello')).filter(Boolean);

    source.subscribe(
      () => done(false),
      () => done(false),
      () => done(),
    );
  });
});
