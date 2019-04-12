import { LinkedCancellable } from 'rx-cancellable';
import Maybe from '../../maybe';
import error from './error';
import { cleanObserver } from '../utils';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const {
    onSubscribe, onComplete, onError, onSuccess,
  } = cleanObserver(observer);

  const controller = new LinkedCancellable();

  onSubscribe(controller);

  this.source.subscribeWith({
    onSubscribe(ac) {
      controller.link(ac);
    },
    onComplete,
    onSuccess(x) {
      controller.unlink();
      let result = x;
      if (!(x instanceof Maybe)) {
        result = error(new Error('Maybe.merge: source emitted a non-Maybe value.'));
      }
      result.subscribeWith({
        onSubscribe(ac) {
          controller.link(ac);
        },
        onComplete,
        onSuccess,
        onError,
      });
    },
    onError,
  });
}

/**
 * @ignore
 */
export default (source) => {
  if (!(source instanceof Maybe)) {
    return error(new Error('Maybe.merge: source is not a Maybe.'));
  }

  const maybe = new Maybe(subscribeActual);
  maybe.source = source;
  return maybe;
};
