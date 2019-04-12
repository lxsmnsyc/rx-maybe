/* eslint-disable class-methods-use-this */
import { UNCANCELLED } from 'rx-cancellable';
import Maybe from '../../maybe';

/**
 * @ignore
 */
function subscribeActual(observer) {
  observer.onSubscribe(UNCANCELLED);
}
/**
 * @ignore
 */
let INSTANCE;
/**
 * @ignore
 */
export default () => {
  if (typeof INSTANCE === 'undefined') {
    INSTANCE = new Maybe(subscribeActual);
  }
  return INSTANCE;
};
