import { cleanObserver } from '../utils';
import Maybe from '../../maybe';
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
  if (typeof subscriber !== 'function') {
    return error(new Error('Maybe.create: There are no subscribers.'));
  }
  const maybe = new Maybe(subscribeActual);
  maybe.subscriber = subscriber;
  return maybe;
};
