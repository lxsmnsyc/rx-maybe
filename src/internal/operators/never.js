/* eslint-disable class-methods-use-this */
import { UNCANCELLED } from 'rx-cancellable';
import Maybe from '../../maybe';
/**
 * @ignore
 */
let INSTANCE;
/**
 * @ignore
 */
export default () => {
  if (typeof INSTANCE === 'undefined') {
    INSTANCE = new Maybe(o => o.onSubscribe(UNCANCELLED));
  }
  return INSTANCE;
};
