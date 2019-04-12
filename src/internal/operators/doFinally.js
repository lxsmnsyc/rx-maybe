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

  let called = false;
  source.subscribeWith({
    onSubscribe(ac) {
      ac.addEventListener('cancel', () => {
        if (!called) {
          callable();
          called = true;
        }
      });
      onSubscribe(ac);
    },
    onComplete() {
      onComplete();
      if (!called) {
        callable();
        called = true;
      }
    },
    onSuccess(x) {
      onSuccess(x);
      if (!called) {
        callable();
        called = true;
      }
    },
    onError(x) {
      onError(x);
      if (!called) {
        callable();
        called = true;
      }
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
