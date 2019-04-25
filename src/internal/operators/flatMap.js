import { LinkedCancellable } from 'rx-cancellable';
import Maybe from '../../maybe';
import { cleanObserver, isFunction } from '../utils';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const {
    onSubscribe, onComplete, onError, onSuccess,
  } = cleanObserver(observer);

  const controller = new LinkedCancellable();

  onSubscribe(controller);

  const { mapper, source } = this;

  source.subscribeWith({
    onSubscribe(ac) {
      controller.link(ac);
    },
    onComplete,
    onSuccess(x) {
      let result;
      try {
        result = mapper(x);

        if (!(result instanceof Maybe)) {
          throw new Error('Maybe.flatMap: mapper returned a non-Maybe');
        }
      } catch (e) {
        onError(e);
        return;
      }
      controller.unlink();
      result.subscribeWith({
        onSubscribe(ac) {
          controller.link(ac);
        },
        onComplete,
        onSuccess,
        onError,
      });
    },
    onError,
  });
}

/**
 * @ignore
 */
export default (source, mapper) => {
  if (!isFunction(mapper)) {
    return source;
  }

  const maybe = new Maybe(subscribeActual);
  maybe.source = source;
  maybe.mapper = mapper;
  return maybe;
};
