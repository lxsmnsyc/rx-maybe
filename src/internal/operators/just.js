import Maybe from '../../maybe';
import error from './error';
import { immediateSuccess } from '../utils';

/**
 * @ignore
 */
function subscribeActual(observer) {
  immediateSuccess(observer, this.value);
}
/**
 * @ignore
 */
export default (value) => {
  if (value == null) {
    return error(new Error('Maybe.just: received an undefined value.'));
  }
  const maybe = new Maybe();
  maybe.value = value;
  maybe.subscribeActual = subscribeActual.bind(maybe);
  return maybe;
};
