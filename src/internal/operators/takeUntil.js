import AbortController from 'abort-controller';
import Maybe from '../../maybe';
import { cleanObserver } from '../utils';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const {
    onSubscribe, onComplete, onSuccess, onError,
  } = cleanObserver(observer);

  const controller = new AbortController();

  const { signal } = controller;

  onSubscribe(controller);

  if (signal.aborted) {
    return;
  }

  const { source, other } = this;

  other.subscribeWith({
    onSubscribe(ac) {
      signal.addEventListener('abort', () => ac.abort());
    },
    onComplete() {
      onError(new Error('Maybe.takeUntil: Source cancelled by other Maybe.'));
      controller.abort();
    },
    onSuccess() {
      onError(new Error('Maybe.takeUntil: Source cancelled by other Maybe.'));
      controller.abort();
    },
    onError(x) {
      onError(new Error(['Maybe.takeUntil: Source cancelled by other Maybe.', x]));
      controller.abort();
    },
  });

  source.subscribeWith({
    onSubscribe(ac) {
      if (signal.aborted) {
        ac.abort();
      } else {
        signal.addEventListener('abort', () => ac.abort());
      }
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

/**
 * @ignore
 */
const takeUntil = (source, other) => {
  if (!(other instanceof Maybe)) {
    return source;
  }

  const maybe = new Maybe(subscribeActual);
  maybe.source = source;
  maybe.other = other;
  return maybe;
};

export default takeUntil;
