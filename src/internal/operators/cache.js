import { BooleanCancellable } from 'rx-cancellable';
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

    const controller = new BooleanCancellable();

    controller.addEventListener('cancel', () => {
      observers.splice(index, 1);
    });

    onSubscribe(controller);

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
          controller.cancel();
          this.observers = undefined;
        },
        onComplete: () => {
          this.cached = true;

          // eslint-disable-next-line no-restricted-syntax
          for (const obs of observers) {
            obs.onComplete();
          }
          controller.cancel();
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
    const controller = new BooleanCancellable();
    onSubscribe(controller);

    const { value, error } = this;
    if (value != null) {
      onSuccess(value);
    } else if (error != null) {
      onError(error);
    } else {
      onComplete();
    }
    controller.cancel();
  }
}

/**
 * @ignore
 */
export default (source) => {
  const maybe = new Maybe(subscribeActual);
  maybe.source = source;
  maybe.cached = false;
  maybe.subscribed = false;
  maybe.observers = [];
  return maybe;
};
