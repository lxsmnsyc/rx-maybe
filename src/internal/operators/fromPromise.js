import AbortController from 'abort-controller';
import Maybe from '../../maybe';
import {
  isPromise, onSuccessHandler, onErrorHandler, onCompleteHandler, cleanObserver,
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

  this.controller = controller;
  this.onComplete = onComplete;
  this.onSuccess = onSuccess;
  this.onError = onError;

  const resolveNone = onCompleteHandler.bind(this);
  const resolve = onSuccessHandler.bind(this);
  const reject = onErrorHandler.bind(this);

  this.promise.then(
    x => (x == null ? resolveNone() : resolve(x)),
    reject,
  );
}
/**
 * @ignore
 */
export default (promise) => {
  if (!isPromise(promise)) {
    return error(new Error('Maybe.fromPromise: expects a Promise-like value.'));
  }
  const single = new Maybe();
  single.promise = promise;
  single.subscribeActual = subscribeActual.bind(single);
  return single;
};
