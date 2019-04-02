import AbortController from 'abort-controller';
import Maybe from '../../maybe';
import { cleanObserver } from '../utils';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const {
    onSuccess, onComplete, onError, onSubscribe,
  } = cleanObserver(observer);

  const controller = new AbortController();

  const { signal } = controller;

  onSubscribe(controller);

  if (signal.aborted) {
    return;
  }


  const sharedComplete = () => {
    if (!signal.aborted) {
      onComplete();
      controller.abort();
    }
  };
  const sharedSuccess = (x) => {
    if (!signal.aborted) {
      onSuccess(x);
      controller.abort();
    }
  };
  const sharedError = (x) => {
    if (!signal.aborted) {
      onError(x);
      controller.abort();
    }
  };

  const { source, other } = this;

  source.subscribeWith({
    onSubscribe(ac) {
      signal.addEventListener('abort', () => ac.abort());
    },
    onComplete: sharedComplete,
    onSuccess: sharedSuccess,
    onError: sharedError,
  });
  other.subscribeWith({
    onSubscribe(ac) {
      if (signal.aborted) {
        ac.abort();
      } else {
        signal.addEventListener('abort', () => ac.abort());
      }
    },
    onComplete: sharedComplete,
    onSuccess: sharedSuccess,
    onError: sharedError,
  });
}
/**
 * @ignore
 */
export default (source, other) => {
  if (!(other instanceof Maybe)) {
    return source;
  }
  const maybe = new Maybe();
  maybe.source = source;
  maybe.other = other;
  maybe.subscribeActual = subscribeActual.bind(maybe);
  return maybe;
};
