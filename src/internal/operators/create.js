import AbortController from 'abort-controller';
import {
  onErrorHandler, onSuccessHandler, cleanObserver, onCompleteHandler, isFunction,
} from '../utils';
import Maybe from '../../maybe';
import error from './error';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const {
    onSuccess, onComplete, onError, onSubscribe,
  } = cleanObserver(observer);

  const emitter = new AbortController();
  emitter.onComplete = onCompleteHandler.bind(this);
  emitter.onSuccess = onSuccessHandler.bind(this);
  emitter.onError = onErrorHandler.bind(this);

  this.controller = emitter;
  this.onComplete = onComplete;
  this.onSuccess = onSuccess;
  this.onError = onError;

  onSubscribe(emitter);

  try {
    this.subscriber(emitter);
  } catch (ex) {
    emitter.onError(ex);
  }
}
/**
 * @ignore
 */
export default (subscriber) => {
  if (!isFunction(subscriber)) {
    return error(new Error('Maybe.create: There are no subscribers.'));
  }
  const maybe = new Maybe(subscribeActual);
  maybe.subscriber = subscriber;
  return maybe;
};
