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

  const {
    source, cached, observers, subscribed,
  } = this;

  if (!cached) {
    const index = observers.length;
    observers[index] = observer;

    const controller = new AbortController();

    controller.signal.addEventListener('abort', () => {
      observers.splice(index, 1);
    });

    onSubscribe(controller);

    if (controller.signal.aborted) {
      return;
    }

    if (!subscribed) {
      source.subscribeWith({
        onSubscribe() {
          // not applicable
        },
        onSuccess: (x) => {
          this.cached = true;
          this.value = x;

          // eslint-disable-next-line no-restricted-syntax
          for (const obs of observers) {
            obs.onSuccess(x);
          }
          this.observers = undefined;
        },
        onComplete: () => {
          this.cached = true;

          // eslint-disable-next-line no-restricted-syntax
          for (const obs of observers) {
            obs.onComplete();
          }
          this.observers = undefined;
        },
        onError: (x) => {
          this.cached = true;
          this.error = x;

          // eslint-disable-next-line no-restricted-syntax
          for (const obs of observers) {
            obs.onError(x);
          }
          this.observers = undefined;
        },
      });
      this.subscribed = true;
    }
  } else {
    const controller = new AbortController();
    onSubscribe(controller);

    const { value, error } = this;
    if (value != null) {
      onSuccess(value);
    } else if (error != null) {
      onError(error);
    } else {
      onComplete();
    }
    controller.abort();
  }
}

/**
 * @ignore
 */
export default (source) => {
  const maybe = new Maybe();
  maybe.source = source;
  maybe.cached = false;
  maybe.subscribed = false;
  maybe.observers = [];
  maybe.subscribeActual = subscribeActual.bind(maybe);
  return maybe;
};
