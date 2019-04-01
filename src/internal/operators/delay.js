import AbortController from 'abort-controller';
import Maybe from '../../maybe';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const {
    onSuccess, onComplete, onError, onSubscribe,
  } = observer;

  const { amount, doDelayError } = this;

  let timeout;

  const controller = new AbortController();

  const { signal } = controller;

  onSubscribe(controller);

  if (signal.aborted) {
    return;
  }

  signal.addEventListener('abort', () => {
    if (typeof timeout !== 'undefined') {
      clearTimeout(timeout);
    }
  });

  this.source.subscribeWith({
    onSubscribe(ac) {
      signal.addEventListener('abort', () => {
        ac.abort();
      });
    },
    onSuccess(x) {
      timeout = setTimeout(() => {
        onSuccess(x);
        controller.abort();
      }, amount);
    },
    onComplete() {
      timeout = setTimeout(() => {
        onComplete();
        controller.abort();
      }, amount);
    },
    onError(x) {
      timeout = setTimeout(() => {
        onError(x);
        controller.abort();
      }, doDelayError ? amount : 0);
    },
  });
}
/**
 * @ignore
 */
export default (source, amount, doDelayError) => {
  if (typeof amount !== 'number') {
    return source;
  }
  const maybe = new Maybe();
  maybe.source = source;
  maybe.amount = amount;
  maybe.doDelayError = doDelayError;
  maybe.subscribeActual = subscribeActual.bind(maybe);
  return maybe;
};
