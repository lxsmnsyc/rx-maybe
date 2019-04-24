import { LinkedCancellable } from 'rx-cancellable';
import { cleanObserver } from '../utils';
import Maybe from '../../maybe';
import is from '../is';

function subscribeActual(observer) {
  const {
    onSubscribe, onSuccess, onComplete, onError,
  } = cleanObserver(observer);

  const controller = new LinkedCancellable();

  onSubscribe(controller);

  const { source, other } = this;

  source.subscribeWith({
    onSubscribe(ac) {
      controller.link(ac);
    },
    onComplete() {
      controller.unlink();
      other.subscribeWith({
        onSubscribe(ac) {
          controller.link(ac);
        },
        onComplete,
        onSuccess,
        onError,
      });
    },
    onSuccess,
    onError,
  });
}

/**
 * @ignore
 */
export default (source, other) => {
  if (!is(other)) {
    return source;
  }

  const maybe = new Maybe(subscribeActual);
  maybe.source = source;
  maybe.other = other;

  return maybe;
};
