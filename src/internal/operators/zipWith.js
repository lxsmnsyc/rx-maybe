
import zipArray from './zipArray';
import is from '../is';
/**
 * @ignore
 */
export default (source, other, zipper) => (
  !is(other)
    ? source
    : zipArray([source, other], zipper)
);
