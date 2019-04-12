/* eslint-disable no-restricted-syntax */
import { CompositeCancellable } from 'rx-cancellable';
import Maybe from '../../maybe';
import { isIterable, cleanObserver } from '../utils';
import error from './error';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const {
    onSuccess, onComplete, onError, onSubscribe,
  } = cleanObserver(observer);

  const controller = new CompositeCancellable();

  onSubscribe(controller);

  const { sources } = this;

  for (const maybe of sources) {
    if (maybe instanceof Maybe) {
      maybe.subscribeWith({
        onSubscribe(ac) {
          controller.add(ac);
        },
        onComplete() {
          onComplete();
          controller.cancel();
        },
        onSuccess(x) {
          onSuccess(x);
          controller.cancel();
        },
        onError(x) {
          onError(x);
          controller.cancel();
        },
      });
    } else {
      onError(new Error('Maybe.amb: One of the sources is a non-Maybe.'));
      controller.cancel();
      break;
    }
  }
}
/**
 * @ignore
 */
export default (sources) => {
  if (!isIterable(sources)) {
    return error(new Error('Maybe.amb: sources is not Iterable.'));
  }
  const maybe = new Maybe(subscribeActual);
  maybe.sources = sources;
  return maybe;
};
