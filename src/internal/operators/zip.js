/* eslint-disable no-loop-func */
import { CompositeCancellable } from 'rx-cancellable';
import Maybe from '../../maybe';
import { isIterable, cleanObserver, isFunction } from '../utils';
import error from './error';

const defaultZipper = x => x;
/**
 * @ignore
 */
function subscribeActual(observer) {
  const {
    onSuccess, onComplete, onError, onSubscribe,
  } = cleanObserver(observer);

  const result = [];

  const controller = new CompositeCancellable();

  onSubscribe(controller);

  const { sources, zipper } = this;

  const size = sources.length;

  if (size === 0) {
    onError(new Error('Maybe.zip: empty iterable'));
    controller.cancel();
    return;
  }
  let pending = size;

  for (let i = 0; i < size; i += 1) {
    const maybe = sources[i];

    if (maybe instanceof Maybe) {
      maybe.subscribeWith({
        onSubscribe(ac) {
          controller.add(ac);
        },
        onComplete() {
          onComplete();
          controller.cancel();
        },
        onSuccess(x) {
          result[i] = x;
          pending -= 1;
          if (pending === 0) {
            let r;
            try {
              r = zipper(result);
              if (r == null) {
                throw new Error('Maybe.zip: zipper function returned a null value.');
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
        onError(x) {
          onError(x);
          controller.cancel();
        },
      });
    } else if (maybe != null) {
      result[i] = maybe;
      pending -= 1;
    } else {
      onError(new Error('Maybe.zip: One of the sources is undefined.'));
      controller.cancel();
      break;
    }
  }
}
/**
 * @ignore
 */
export default (sources, zipper) => {
  if (!isIterable(sources)) {
    return error(new Error('Maybe.zip: sources is not Iterable.'));
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
