import AbortController from 'abort-controller';
import Maybe from '../../maybe';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const {
    onSuccess, onComplete, onError, onSubscribe,
  } = observer;

  const { amount } = this;

  let timeout;

  const controller = new AbortController();

  const { signal } = controller;

  signal.addEventListener('abort', () => {
    if (typeof timeout !== 'undefined') {
      clearTimeout(timeout);
    }
  });

  onSubscribe(controller);

  if (signal.aborted) {
    return;
  }

  timeout = setTimeout(() => {
    this.source.subscribeWith({
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
  }, amount);
}
/**
 * @ignore
 */
export default (source, amount) => {
  if (typeof amount !== 'number') {
    return source;
  }
  const maybe = new Maybe();
  maybe.source = source;
  maybe.amount = amount;
  maybe.subscribeActual = subscribeActual.bind(maybe);
  return maybe;
};
