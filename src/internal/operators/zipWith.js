import AbortController from 'abort-controller';
import Maybe from '../../maybe';
import { cleanObserver, isFunction } from '../utils';

/**
 * @ignore
 */
const defaultZipper = (x, y) => [x, y];
/**
 * @ignore
 */
function subscribeActual(observer) {
  const {
    onSuccess, onComplete, onError, onSubscribe,
  } = cleanObserver(observer);

  let SA;
  let SB;

  const controller = new AbortController();

  const { signal } = controller;

  onSubscribe(controller);

  if (signal.aborted) {
    return;
  }

  const { source, other, zipper } = this;

  source.subscribeWith({
    onSubscribe(ac) {
      signal.addEventListener('abort', () => ac.abort());
    },
    onComplete() {
      onComplete();
      controller.abort();
    },
    onSuccess(x) {
      if (signal.aborted) {
        return;
      }
      SA = x;

      if (SB != null) {
        let result;

        try {
          result = zipper(SA, SB);

          if (result == null) {
            throw new Error('Maybe.zipWith: zipper function returned a null value.');
          }
        } catch (e) {
          onError(e);
          controller.abort();
          return;
        }
        onSuccess(result);
        controller.abort();
      }
    },
    onError(x) {
      onError(x);
      controller.abort();
    },
  });

  other.subscribeWith({
    onSubscribe(ac) {
      if (signal.aborted) {
        ac.abort();
      } else {
        signal.addEventListener('abort', () => ac.abort());
      }
    },
    onComplete() {
      onComplete();
      controller.abort();
    },
    onSuccess(x) {
      if (signal.aborted) {
        return;
      }
      SB = x;

      if (SA != null) {
        let result;

        try {
          result = zipper(SA, SB);

          if (result == null) {
            throw new Error('Maybe.zipWith: zipper function returned a null value.');
          }
        } catch (e) {
          onError(e);
          controller.abort();
          return;
        }
        onSuccess(result);
        controller.abort();
      }
    },
    onError(x) {
      onError(x);
      controller.abort();
    },
  });
}
/**
 * @ignore
 */
export default (source, other, zipper) => {
  if (!(other instanceof Maybe)) {
    return source;
  }
  let fn = zipper;
  if (!isFunction(zipper)) {
    fn = defaultZipper;
  }
  const maybe = new Maybe(subscribeActual);
  maybe.source = source;
  maybe.other = other;
  maybe.zipper = fn;
  return maybe;
};
