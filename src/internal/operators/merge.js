import AbortController from 'abort-controller';
import Maybe from '../../maybe';
import error from './error';
import { cleanObserver } from '../utils';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const {
    onSubscribe, onComplete, onError, onSuccess,
  } = cleanObserver(observer);

  const controller = new AbortController();

  const { signal } = controller;

  onSubscribe(controller);

  if (signal.aborted) {
    return;
  }

  this.source.subscribeWith({
    onSubscribe(ac) {
      signal.addEventListener('abort', () => ac.abort());
    },
    onComplete() {
      onComplete();
      controller.abort();
    },
    onSuccess(x) {
      let result = x;
      if (!(x instanceof Maybe)) {
        result = error(new Error('Maybe.merge: source emitted a non-Maybe value.'));
      }
      result.subscribeWith({
        onSubscribe(ac) {
          signal.addEventListener('abort', () => ac.abort());
        },
        onComplete() {
          onComplete();
          controller.abort();
        },
        onSuccess(v) {
          onSuccess(v);
          controller.abort();
        },
        onError(v) {
          onError(v);
          controller.abort();
        },
      });
    },
    onError(v) {
      onError(v);
      controller.abort();
    },
  });
}

/**
 * @ignore
 */
export default (source) => {
  if (!(source instanceof Maybe)) {
    return error(new Error('Maybe.merge: source is not a Maybe.'));
  }

  const maybe = new Maybe(subscribeActual);
  maybe.source = source;
  return maybe;
};
