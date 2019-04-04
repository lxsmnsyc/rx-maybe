import AbortController from 'abort-controller';
import Maybe from '../../maybe';
import { cleanObserver } from '../utils';

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
  if (typeof predicate !== 'function') {
    return source;
  }

  const maybe = new Maybe(subscribeActual);
  maybe.source = source;
  maybe.predicate = predicate;
  return maybe;
};
