import Maybe from '../../maybe';
import { cleanObserver } from '../utils';

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
      if (result) {
        onComplete();
      } else {
        onError(x);
      }
    },
  });
}
/**
 * @ignore
 */
export default (source, item) => {
  if (typeof item !== 'function') {
    return source;
  }

  const maybe = new Maybe();
  maybe.source = source;
  maybe.item = item;
  maybe.subscribeActual = subscribeActual.bind(maybe);
  return maybe;
};
