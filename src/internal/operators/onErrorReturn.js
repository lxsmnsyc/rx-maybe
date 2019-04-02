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

        if (result == null) {
          throw new Error(new Error('Maybe.onErrorReturn: returned an undefined value.'));
        }
      } catch (e) {
        onError([x, e]);
        return;
      }
      onSuccess(result);
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
