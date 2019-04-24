import Maybe from '../../maybe';
import { immediateError, cleanObserver, exists } from '../utils';
import is from '../is';

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
    if (!is(result)) {
      throw new Error('Maybe.defer: supplier returned a non-Maybe.');
    }
  } catch (e) {
    err = e;
  }

  if (exists(err)) {
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
  const maybe = new Maybe(subscribeActual);
  maybe.supplier = supplier;
  return maybe;
};
