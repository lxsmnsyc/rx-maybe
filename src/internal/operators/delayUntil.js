import { LinkedCancellable } from 'rx-cancellable';
import Maybe from '../../maybe';
import { cleanObserver } from '../utils';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const {
    onSuccess, onComplete, onError, onSubscribe,
  } = cleanObserver(observer);

  const { source, other } = this;

  const controller = new LinkedCancellable();

  onSubscribe(controller);

  const success = () => {
    controller.unlink();
    source.subscribeWith({
      onSubscribe(ac) {
        controller.link(ac);
      },
      onComplete,
      onSuccess,
      onError,
    });
  };

  other.subscribeWith({
    onSubscribe(ac) {
      controller.link(ac);
    },
    onComplete: success,
    onSuccess: success,
    onError,
  });
}
/**
 * @ignore
 */
export default (source, other) => {
  if (!(other instanceof Maybe)) {
    return source;
  }
  const maybe = new Maybe(subscribeActual);
  maybe.source = source;
  maybe.other = other;
  return maybe;
};
