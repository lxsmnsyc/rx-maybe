import { LinkedCancellable } from 'rx-cancellable';
import Maybe from '../../maybe';
import { cleanObserver, isFunction } from '../utils';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const {
    onSubscribe, onSuccess, onComplete, onError,
  } = cleanObserver(observer);

  const controller = new LinkedCancellable();

  onSubscribe(controller);

  const { source, predicate } = this;

  source.subscribeWith({
    onSubscribe(ac) {
      controller.link(ac);
    },
    onComplete,
    onSuccess(x) {
      let result;

      try {
        result = predicate(x);
      } catch (e) {
        onError(e);
        controller.cancel();
        return;
      }

      if (result) {
        onSuccess(x);
      } else {
        onComplete();
      }
      controller.cancel();
    },
    onError,
  });
}

/**
 * @ignore
 */
export default (source, predicate) => {
  if (!isFunction(predicate)) {
    return source;
  }

  const maybe = new Maybe(subscribeActual);
  maybe.source = source;
  maybe.predicate = predicate;
  return maybe;
};
