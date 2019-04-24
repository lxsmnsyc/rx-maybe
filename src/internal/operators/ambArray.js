/* eslint-disable no-restricted-syntax */
import { CompositeCancellable } from 'rx-cancellable';
import Maybe from '../../maybe';
import { cleanObserver, immediateError, isArray } from '../utils';
import error from './error';
import is from '../is';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const {
    onSuccess, onComplete, onError, onSubscribe,
  } = cleanObserver(observer);

  const { sources } = this;
  const { length } = sources;

  if (length === 0) {
    immediateError(observer, new Error('Maybe.ambArray: sources Array is empty.'));
  } else {
    const controller = new CompositeCancellable();

    onSubscribe(controller);

    for (let i = 0; i < length; i += 1) {
      const maybe = sources[i];
      if (controller.cancelled) {
        return;
      }
      if (is(maybe)) {
        maybe.subscribeWith({
          onSubscribe(c) {
            controller.add(c);
          },
          // eslint-disable-next-line no-loop-func
          onSuccess(x) {
            onSuccess(x);
            controller.cancel();
          },
          onComplete() {
            onComplete();
            controller.cancel();
          },
          onError(x) {
            onError(x);
            controller.cancel();
          },
        });
      } else {
        onError(new Error('Maybe.ambArray: One of the sources is a non-Maybe.'));
        controller.cancel();
        break;
      }
    }
  }
}
/**
 * @ignore
 */
export default (sources) => {
  if (!isArray(sources)) {
    return error(new Error('Maybe.ambArray: sources is not an Array.'));
  }
  const maybe = new Maybe(subscribeActual);
  maybe.sources = sources;
  return maybe;
};
