import Maybe from '../../maybe';
import { immediateComplete } from '../utils';

let INSTANCE;
/**
 * @ignore
 */
export default () => {
  if (typeof INSTANCE === 'undefined') {
    INSTANCE = new Maybe(observer => immediateComplete(observer));
  }
  return INSTANCE;
};
