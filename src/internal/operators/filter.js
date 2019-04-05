import AbortController from 'abort-controller';
import Maybe from '../../maybe';
import { cleanObserver, isFunction } from '../utils';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const {
    onSubscribe, onSuccess, onComplete, onError,
  } = cleanObserver(observer);

  const controller = new AbortController();

  onSubscribe(controller);

  const { signal } = controller;

  if (signal.aborted) {
    return;
  }

  const { source, predicate } = this;

  source.subscribeWith({
    onSubscribe(ac) {
      signal.addEventListener('abort', () => ac.abort());
    },
    onComplete() {
      onComplete();
      controller.abort();
    },
    onSuccess(x) {
      let result;

      try {
        result = predicate(x);
      } catch (e) {
        onError(e);
        controller.abort();
        return;
      }

      if (result) {
        onSuccess(x);
      } else {
        onComplete();
      }
      controller.abort();
    },
    onError(x) {
      onError(x);
      controller.abort();
    },
  });
}

/**
 * @ignore
 */
export default (source, predicate) => {
  if (!isFunction(predicate)) {
    return source;
  }

  const maybe = new Maybe(subscribeActual);
  maybe.source = source;
  maybe.predicate = predicate;
  return maybe;
};
