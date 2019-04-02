import AbortController from 'abort-controller';
import Maybe from '../../maybe';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const {
    onSuccess, onComplete, onError, onSubscribe,
  } = observer;

  const { source, other } = this;

  const controller = new AbortController();

  const { signal } = controller;

  onSubscribe(controller);

  if (signal.aborted) {
    return;
  }

  const success = () => {
    if (!signal.aborted) {
      source.subscribeWith({
        onSubscribe(ac) {
          signal.addEventListener('abort', () => ac.abort());
        },
        onComplete() {
          onComplete();
          controller.abort();
        },
        onSuccess(x) {
          onSuccess(x);
          controller.abort();
        },
        onError(x) {
          onError(x);
          controller.abort();
        },
      });
    }
  };

  other.subscribeWith({
    onSubscribe(ac) {
      signal.addEventListener('abort', () => ac.abort());
    },
    onComplete: success,
    onSuccess: success,
    onError(x) {
      onError(x);
      controller.abort();
    },
  });
}
/**
 * @ignore
 */
export default (source, other) => {
  if (!(other instanceof Maybe)) {
    return source;
  }
  const single = new Maybe();
  single.source = source;
  single.other = other;
  single.subscribeActual = subscribeActual.bind(single);
  return single;
};
