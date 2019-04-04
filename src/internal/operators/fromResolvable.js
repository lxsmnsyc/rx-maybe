import AbortController from 'abort-controller';
import {
  onErrorHandler, onSuccessHandler, onCompleteHandler, cleanObserver, isFunction,
} from '../utils';
import Maybe from '../../maybe';
import error from './error';

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

  this.subscriber(x => (x == null ? resolveNone() : resolve(x)), reject);
}
/**
 * @ignore
 */
export default (subscriber) => {
  if (!isFunction(subscriber)) {
    return error(new Error('Maybe.fromResolvable: expects a function.'));
  }
  const maybe = new Maybe(subscribeActual);
  maybe.subscriber = subscriber;
  return maybe;
};
