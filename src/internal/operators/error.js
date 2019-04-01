import { toCallable, immediateError } from '../utils';
import Maybe from '../../maybe';

/**
 * @ignore
 */
function subscribeActual(observer) {
  let err;

  try {
    err = this.supplier();

    if (typeof err === 'undefined') {
      throw new Error('Maybe.error: Error supplier returned an undefined value.');
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
  if (!(value instanceof Error)) {
    report = new Error('Maybe.error received a non-Error value.');
  }

  if (typeof value !== 'function') {
    report = toCallable(report);
  }
  const maybe = new Maybe();
  maybe.supplier = report;
  maybe.subscribeActual = subscribeActual.bind(maybe);
  return maybe;
};
