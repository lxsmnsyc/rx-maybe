import { CompositeCancellable } from 'rx-cancellable';
import Maybe from '../../maybe';
import { cleanObserver } from '../utils';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const {
    onSubscribe, onComplete, onSuccess, onError,
  } = cleanObserver(observer);

  const controller = new CompositeCancellable();

  onSubscribe(controller);

  const { source, other } = this;

  other.subscribeWith({
    onSubscribe(ac) {
      controller.add(ac);
    },
    onComplete() {
      onError(new Error('Maybe.takeUntil: Source cancelled by other Maybe.'));
      controller.cancel();
    },
    onSuccess() {
      onError(new Error('Maybe.takeUntil: Source cancelled by other Maybe.'));
      controller.cancel();
    },
    onError(x) {
      onError(new Error(['Maybe.takeUntil: Source cancelled by other Maybe.', x]));
      controller.cancel();
    },
  });

  source.subscribeWith({
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
}

/**
 * @ignore
 */
const takeUntil = (source, other) => {
  if (!(other instanceof Maybe)) {
    return source;
  }

  const maybe = new Maybe(subscribeActual);
  maybe.source = source;
  maybe.other = other;
  return maybe;
};

export default takeUntil;
