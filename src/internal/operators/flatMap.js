import AbortController from 'abort-controller';
import Maybe from '../../maybe';
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

  const { mapper, source } = this;

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
        result = mapper(x);

        if (!(result instanceof Maybe)) {
          throw new Error('Maybe.flatMap: mapper returned a non-Maybe');
        }
      } catch (e) {
        onError(e);
        return;
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
export default (source, mapper) => {
  if (typeof mapper !== 'function') {
    return source;
  }

  const maybe = new Maybe();
  maybe.source = source;
  maybe.mapper = mapper;
  maybe.subscribeActual = subscribeActual.bind(maybe);
  return maybe;
};
