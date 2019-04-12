import Maybe from '../../maybe';
import zip from './zip';

/**
 * @ignore
 */
export default (source, other, zipper) => {
  if (!(other instanceof Maybe)) {
    return source;
  }
  return zip([source, other], zipper);
};
