import AbortController from 'abort-controller';
import {
  onErrorHandler, onSuccessHandler, isPromise, onCompleteHandler, cleanObserver,
} from '../utils';
import Maybe from '../../maybe';
import { error, fromPromise } from '../operators';

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

  this.controller = controller;
  this.onComplete = onComplete;
  this.onSuccess = onSuccess;
  this.onError = onError;

  const resolve = onSuccessHandler.bind(this);
  const resolveNone = onCompleteHandler.bind(this);
  const reject = onErrorHandler.bind(this);

  let result;
  try {
    result = this.callable();
  } catch (e) {
    reject(e);
    return;
  }

  if (isPromise(result)) {
    fromPromise(result).subscribe(onSuccess, onError);
  } else if (result == null) {
    resolveNone();
  } else {
    resolve(result);
  }
}
/**
 * @ignore
 */
export default (callable) => {
  if (typeof callable !== 'function') {
    return error(new Error('Maybe.fromCallable: callable received is not a function.'));
  }
  const maybe = new Maybe();
  maybe.callable = callable;
  maybe.subscribeActual = subscribeActual.bind(maybe);
  return maybe;
};
