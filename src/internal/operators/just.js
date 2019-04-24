import Maybe from '../../maybe';
import error from './error';
import { immediateSuccess, isNull } from '../utils';

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
  if (isNull(value)) {
    return error(new Error('Maybe.just: received a null value.'));
  }
  const maybe = new Maybe(subscribeActual);
  maybe.value = value;
  return maybe;
};
