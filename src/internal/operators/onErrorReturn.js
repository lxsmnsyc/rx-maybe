import Maybe from '../../maybe';
import { cleanObserver, isFunction, isNull } from '../utils';

function subscribeActual(observer) {
  const {
    onSuccess, onComplete, onError, onSubscribe,
  } = cleanObserver(observer);

  const { source, item } = this;

  source.subscribeWith({
    onSubscribe,
    onComplete,
    onSuccess,
    onError(x) {
      let result;

      try {
        result = item(x);
      } catch (e) {
        onError([x, e]);
        return;
      }
      if (isNull(result)) {
        onComplete();
      } else {
        onSuccess(result);
      }
    },
  });
}
/**
 * @ignore
 */
export default (source, item) => {
  if (!isFunction(item)) {
    return source;
  }

  const maybe = new Maybe(subscribeActual);
  maybe.source = source;
  maybe.item = item;
  return maybe;
};
