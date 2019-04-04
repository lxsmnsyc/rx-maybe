import Maybe from '../../maybe';
import error from './error';
import { isFunction } from '../utils';

/**
 * @ignore
 */
export default (source, transformer) => {
  if (!isFunction(transformer)) {
    return source;
  }

  let result;

  try {
    result = transformer(source);

    if (!(result instanceof Maybe)) {
      throw new Error('Maybe.compose: transformer returned a non-Maybe.');
    }
  } catch (e) {
    result = error(e);
  }

  return result;
};
