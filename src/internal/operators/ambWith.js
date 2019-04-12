import Maybe from '../../maybe';
import amb from './amb';
/**
 * @ignore
 */
export default (source, other) => {
  if (!(other instanceof Maybe)) {
    return source;
  }
  return amb([source, other]);
};
