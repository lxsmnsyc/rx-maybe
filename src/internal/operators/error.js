import {
  toCallable, immediateError, isFunction, isOf, isNull,
} from '../utils';
import Maybe from '../../maybe';

/**
 * @ignore
 */
function subscribeActual(observer) {
  let err;

  try {
    err = this.supplier();

    if (isNull(err)) {
      throw new Error('Maybe.error: Error supplier returned a null value.');
    }
  } catch (e) {
    err = e;
  }
  immediateError(observer, err);
}
/**
 * @ignore
 */
export default (value) => {
  let report = value;

  if (!(isOf(value, Error) || isFunction(value))) {
    report = new Error('Maybe.error received a non-Error value.');
  }

  if (!isFunction(value)) {
    report = toCallable(report);
  }
  const maybe = new Maybe(subscribeActual);
  maybe.supplier = report;
  return maybe;
};
