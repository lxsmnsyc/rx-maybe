import Maybe from '../../maybe';
import { cleanObserver } from '../utils';

/**
 * @ignore
 */
const defaultMapper = x => x;

/**
 * @ignore
 */
function subscribeActual(observer) {
  const {
    onSuccess, onComplete, onError, onSubscribe,
  } = cleanObserver(observer);

  const { mapper } = this;

  this.source.subscribeWith({
    onSubscribe,
    onSuccess(x) {
      let result;
      try {
        result = mapper(x);
        if (result == null) {
          throw new Error('Maybe.map: mapper function returned a null value.');
        }
      } catch (e) {
        onError(e);
        return;
      }
      onSuccess(result);
    },
    onComplete,
    onError,
  });
}
/**
 * @ignore
 */
export default (source, mapper) => {
  let ms = mapper;
  if (typeof mapper !== 'function') {
    ms = defaultMapper;
  }

  const maybe = new Maybe(subscribeActual);
  maybe.source = source;
  maybe.mapper = ms;
  return maybe;
};
