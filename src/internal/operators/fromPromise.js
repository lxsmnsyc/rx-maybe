import Maybe from '../../maybe';
import {
  isPromise, cleanObserver,
} from '../utils';
import error from './error';
import MaybeEmitter from '../../emitter';
/**
 * @ignore
 */
function subscribeActual(observer) {
  const {
    onSuccess, onComplete, onError, onSubscribe,
  } = cleanObserver(observer);

  const emitter = new MaybeEmitter(onSuccess, onComplete, onError);

  onSubscribe(emitter);

  this.promise.then(
    x => (x == null ? emitter.onComplete() : emitter.onSuccess(x)),
    x => emitter.onError(x),
  );
}
/**
 * @ignore
 */
export default (promise) => {
  if (!isPromise(promise)) {
    return error(new Error('Maybe.fromPromise: expects a Promise-like value.'));
  }
  const maybe = new Maybe(subscribeActual);
  maybe.promise = promise;
  return maybe;
};
