import { LinkedCancellable } from 'rx-cancellable';
import { cleanObserver } from '../utils';
import Maybe from '../../maybe';

function subscribeActual(observer) {
  const {
    onSubscribe, onSuccess, onError,
  } = cleanObserver(observer);

  const controller = new LinkedCancellable();

  onSubscribe(controller);

  const { source, value } = this;

  source.subscribeWith({
    onSubscribe(ac) {
      controller.link(ac);
    },
    onComplete() {
      onSuccess(value);
    },
    onSuccess,
    onError,
  });
}

/**
 * @ignore
 */
export default (source, value) => {
  if (value == null) {
    return source;
  }

  const maybe = new Maybe(subscribeActual);
  maybe.source = source;
  maybe.value = value;

  return maybe;
};
