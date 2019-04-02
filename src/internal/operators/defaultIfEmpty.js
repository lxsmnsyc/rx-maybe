import AbortController from 'abort-controller';
import { cleanObserver } from '../utils';
import Maybe from '../../maybe';

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

  const { source, other } = this;

  source.subscribeWith({
    onSubscribe(ac) {
      signal.addEventListener('abort', () => ac.abort());
    },
    onSuccess(x) {
      onSuccess(x);
      controller.abort();
    },
    onComplete() {
      other.subscribeWith({
        onSubscribe(ac) {
          signal.addEventListener('abort', () => ac.abort());
        },
        onSuccess(x) {
          onSuccess(x);
          controller.abort();
        },
        onComplete() {
          onComplete();
          controller.abort();
        },
        onError(x) {
          onError(x);
          controller.abort();
        },
      });
    },
    onError(x) {
      onError(x);
      controller.abort();
    },
  });
}

export default (source, value) => {
  if (value != null) {
    return source;
  }

  const maybe = new Maybe();
  maybe.source = source;
  maybe.value = value;
  maybe.subscribeActual = subscribeActual.bind(maybe);

  return maybe;
};
