import Maybe from '../../maybe';
import { immediateError, cleanObserver } from '../utils';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const {
    onSuccess, onComplete, onError, onSubscribe,
  } = cleanObserver(observer);

  let result;

  let err;
  try {
    result = this.supplier();
    if (!(result instanceof Maybe)) {
      throw new Error('Maybe.defer: supplier returned a non-Maybe.');
    }
  } catch (e) {
    err = e;
  }

  if (err != null) {
    immediateError(observer, err);
  } else {
    result.subscribeWith({
      onSubscribe,
      onComplete,
      onSuccess,
      onError,
    });
  }
}
/**
 * @ignore
 */
export default (supplier) => {
  const maybe = new Maybe();
  maybe.supplier = supplier;
  maybe.subscribeActual = subscribeActual.bind(maybe);
  return maybe;
};
