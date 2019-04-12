import Maybe from '../../maybe';
import MaybeEmitter from '../../emitter';
import error from './error';
import fromPromise from './fromPromise';
import {
  isPromise, cleanObserver, isFunction,
} from '../utils';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const {
    onSuccess, onComplete, onError, onSubscribe,
  } = cleanObserver(observer);

  const emitter = new MaybeEmitter(onSuccess, onComplete, onError);

  onSubscribe(emitter);

  let result;
  try {
    result = this.callable();
  } catch (e) {
    emitter.onError(e);
    return;
  }

  if (isPromise(result)) {
    fromPromise(result).subscribeWith({
      onSubscribe(ac) {
        emitter.setCancellable(ac);
      },
      onComplete() {
        emitter.onComplete();
      },
      onSuccess(x) {
        emitter.onSuccess(x);
      },
      onError(e) {
        emitter.onError(e);
      },
    });
  } else if (result == null) {
    emitter.onComplete();
  } else {
    emitter.onSuccess(result);
  }
}
/**
 * @ignore
 */
export default (callable) => {
  if (!isFunction(callable)) {
    return error(new Error('Maybe.fromCallable: callable received is not a function.'));
  }
  const maybe = new Maybe(subscribeActual);
  maybe.callable = callable;
  return maybe;
};
