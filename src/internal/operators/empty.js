import Maybe from '../../maybe';
import { immediateComplete, isNull } from '../utils';

let INSTANCE;
/**
 * @ignore
 */
export default () => {
  if (isNull(INSTANCE)) {
    INSTANCE = new Maybe(observer => immediateComplete(observer));
  }
  return INSTANCE;
};
