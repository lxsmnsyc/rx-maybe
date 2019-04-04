import AbortController from 'abort-controller';
import Maybe from '../../maybe';
import {
  isPromise, cleanObserver,
} from '../utils';
import error from './error';
/**
 * @ignore
 */
function subscribeActual(observer) {
  const {
    onSuccess, onComplete, onError, onSubscribe,
  } = cleanObserver(observer);

  const controller = new AbortController();

  onSubscribe(controller);

  if (controller.signal.aborted) {
    return;
  }

  this.promise.then(
    x => (x == null ? onComplete() : onSuccess(x)),
    onError,
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
