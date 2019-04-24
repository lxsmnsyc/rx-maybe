import {
  cleanObserver, isFunction, isNull,
} from '../utils';
import Maybe from '../../maybe';
import error from './error';
import MaybeEmitter from '../../emitter';

function subscribeActual(observer) {
  const {
    onSuccess, onComplete, onError, onSubscribe,
  } = cleanObserver(observer);

  const emitter = new MaybeEmitter(onSuccess, onComplete, onError);

  onSubscribe(emitter);

  this.subscriber(
    x => (isNull(x) ? emitter.onComplete() : emitter.onSuccess(x)),
    x => emitter.onError(x),
  );
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
