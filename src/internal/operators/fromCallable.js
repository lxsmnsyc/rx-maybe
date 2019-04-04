import AbortController from 'abort-controller';
import {
  isPromise, cleanObserver, isFunction,
} from '../utils';
import Maybe from '../../maybe';
import fromPromise from './fromPromise';
import error from './error';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const obs = cleanObserver(observer);
  const {
    onSuccess, onComplete, onError, onSubscribe,
  } = obs;

  const controller = new AbortController();

  onSubscribe(controller);

  if (controller.signal.aborted) {
    return;
  }

  let result;
  try {
    result = this.callable();
  } catch (e) {
    onError(e);
    return;
  }

  if (isPromise(result)) {
    fromPromise(result).subscribeWith(obs);
  } else if (result == null) {
    onComplete();
  } else {
    onSuccess(result);
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
