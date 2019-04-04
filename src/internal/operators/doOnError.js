import Maybe from '../../maybe';
import { cleanObserver, isFunction } from '../utils';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const {
    onSuccess, onComplete, onError, onSubscribe,
  } = cleanObserver(observer);

  const { source, callable } = this;

  source.subscribeWith({
    onSubscribe,
    onComplete,
    onSuccess,
    onError(x) {
      callable(x);
      onError(x);
    },
  });
}

/**
 * @ignore
 */
export default (source, callable) => {
  if (!isFunction(callable)) {
    return source;
  }
  const maybe = new Maybe(subscribeActual);
  maybe.source = source;
  maybe.callable = callable;
  return maybe;
};
