
import { CompositeCancellable } from 'rx-cancellable';
import Maybe from '../../maybe';
import {
  cleanObserver, isFunction, isArray, isNull,
} from '../utils';
import error from './error';
import is from '../is';

const defaultZipper = x => x;
/**
 * @ignore
 */
function subscribeActual(observer) {
  const {
    onSuccess, onError, onComplete, onSubscribe,
  } = cleanObserver(observer);

  const result = [];

  const controller = new CompositeCancellable();

  onSubscribe(controller);

  const { sources, zipper } = this;

  const size = sources.length;

  if (size === 0) {
    onError(new Error('Maybe.zipArray: source array is empty'));
    controller.cancel();
    return;
  }

  let pending = size;

  for (let i = 0; i < size; i += 1) {
    if (controller.cancelled) {
      return;
    }
    const maybe = sources[i];

    if (is(maybe)) {
      maybe.subscribeWith({
        onSubscribe(ac) {
          controller.add(ac);
        },
        // eslint-disable-next-line no-loop-func
        onSuccess(x) {
          result[i] = x;
          pending -= 1;
          if (pending === 0) {
            let r;
            try {
              r = zipper(result);
              if (isNull(r)) {
                throw new Error('Maybe.zipArray: zipper function returned a null value.');
              }
            } catch (e) {
              onError(e);
              controller.cancel();
              return;
            }
            onSuccess(r);
            controller.cancel();
          }
        },
        onComplete() {
          onComplete();
          controller.cancel();
        },
        onError(x) {
          onError(x);
          controller.cancel();
        },
      });
    } else {
      onError(new Error('Maybe.zipArray: One of the sources is non-Maybe.'));
      controller.cancel();
      return;
    }
  }
}
/**
 * @ignore
 */
export default (sources, zipper) => {
  if (!isArray(sources)) {
    return error(new Error('Maybe.zipArray: sources is a non-Array.'));
  }
  let fn = zipper;
  if (!isFunction(zipper)) {
    fn = defaultZipper;
  }
  const maybe = new Maybe(subscribeActual);
  maybe.sources = sources;
  maybe.zipper = fn;
  return maybe;
};
