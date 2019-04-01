import Maybe from '../../maybe';
import error from './error';

/**
 * @ignore
 */
export default (source, transformer) => {
  if (typeof transformer !== 'function') {
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
