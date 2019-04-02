import AbortController from 'abort-controller';
import { cleanObserver } from '../utils';
import Maybe from '../../maybe';

function subscribeActual(observer) {
  const {
    onSubscribe, onSuccess, onError,
  } = cleanObserver(observer);

  const controller = new AbortController();

  onSubscribe(controller);

  const { signal } = controller;

  if (signal.aborted) {
    return;
  }

  const { source, value } = this;

  source.subscribeWith({
    onSubscribe(ac) {
      signal.addEventListener('abort', () => ac.abort());
    },
    onSuccess(x) {
      onSuccess(x);
      controller.abort();
    },
    onComplete() {
      onSuccess(value);
      controller.abort();
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
