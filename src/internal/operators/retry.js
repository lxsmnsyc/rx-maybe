import { LinkedCancellable } from 'rx-cancellable';
import Maybe from '../../maybe';
import { cleanObserver, isFunction } from '../utils';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const {
    onSubscribe, onComplete, onSuccess, onError,
  } = cleanObserver(observer);

  const controller = new LinkedCancellable();

  onSubscribe(controller);

  const { source, bipredicate } = this;

  let retries = -1;

  const sub = () => {
    controller.unlink();
    retries += 1;

    source.subscribeWith({
      onSubscribe(ac) {
        controller.link(ac);
      },
      onComplete,
      onSuccess,
      onError(x) {
        if (isFunction(bipredicate)) {
          const result = bipredicate(retries, x);

          if (result) {
            sub();
          } else {
            onError(x);
            controller.cancel();
          }
        } else {
          sub();
        }
      },
    });
  };

  sub();
}

/**
 * @ignore
 */
export default (source, bipredicate) => {
  const maybe = new Maybe(subscribeActual);
  maybe.source = source;
  maybe.bipredicate = bipredicate;
  return maybe;
};
