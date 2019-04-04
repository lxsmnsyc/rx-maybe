/* eslint-disable no-undef */
import assert from 'assert';
import Maybe from '../src/maybe';

describe('#switchIfEmpty', () => {
  it('should return a Maybe', () => {
    assert(Maybe.empty().switchIfEmpty(Maybe.just('Hello')) instanceof Maybe);
  });
  it('should return same reference if value is non-Maybe', () => {
    const source = Maybe.empty();
    assert(source === source.switchIfEmpty());
  });
  it('should signal success if source signals success', (done) => {
    const source = Maybe.just('Hello').switchIfEmpty(Maybe.just('Hello'));

    source.subscribe(
      x => (x === 'Hello' ? done() : done(false)),
      () => done(false),
      () => done(false),
    );
  });
  it('should signal success if source signals complete', (done) => {
    const source = Maybe.empty().switchIfEmpty(Maybe.just('Hello'));

    source.subscribe(
      x => (x === 'World' ? done() : done(false)),
      () => done(false),
      () => done(false),
    );
  });
  it('should signal success if source signals complete', (done) => {
    const source = Maybe.empty().switchIfEmpty(Maybe.empty());

    source.subscribe(
      () => done(false),
      () => done(),
      () => done(false),
    );
  });
  it('should signal error if source signals complete', (done) => {
    const source = Maybe.empty().switchIfEmpty(Maybe.error(new Error('Hello')));

    source.subscribe(
      () => done(false),
      () => done(false),
      () => done(),
    );
  });
  it('should signal error if source signals error', (done) => {
    const source = Maybe.error(new Error('Hello')).switchIfEmpty(Maybe.just('Hello'));

    source.subscribe(
      () => done(false),
      () => done(false),
      () => done(),
    );
  });
});
