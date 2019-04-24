
import zipArray from './zipArray';
import is from '../is';

/**
 * @ignore
 */
export default (source, other, zipper) => {
  if (!is(other)) {
    return source;
  }
  return zipArray([source, other], zipper);
};
