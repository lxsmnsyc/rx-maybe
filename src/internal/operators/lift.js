import Maybe from '../../maybe';
import { isObserver, immediateError } from '../utils';

/**
 * @ignore
 */
function subscribeActual(observer) {
  let result;

  try {
    result = this.operator(observer);

    if (!isObserver(result)) {
      throw new Error('Maybe.lift: operator returned a non-Observer.');
    }
  } catch (e) {
    immediateError(observer, e);
    return;
  }

  this.source.subscribeWith(result);
}

/**
 * @ignore
 */
export default (source, operator) => {
  if (typeof operator !== 'function') {
    return source;
  }

  const maybe = new Maybe();
  maybe.source = source;
  maybe.operator = operator;
  maybe.subscribeActual = subscribeActual.bind(maybe);
  return maybe;
};
