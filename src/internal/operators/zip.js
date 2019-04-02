/* eslint-disable no-loop-func */
import AbortController from 'abort-controller';
import Maybe from '../../maybe';
import { isIterable, cleanObserver } from '../utils';
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

  const controller = new AbortController();

  const { signal } = controller;

  onSubscribe(controller);

  if (signal.aborted) {
    return;
  }

  const { sources, zipper } = this;

  const size = sources.length;

  if (size === 0) {
    onError(new Error('Maybe.zip: empty iterable'));
    controller.abort();
    return;
  }
  let pending = size;

  for (let i = 0; i < size; i += 1) {
    if (signal.aborted) {
      return;
    }
    const maybe = sources[i];

    if (maybe instanceof Maybe) {
      maybe.subscribeWith({
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
          result[i] = x;
          pending -= 1;
          if (pending === 0) {
            let r;
            try {
              r = zipper(result);
              if (typeof r === 'undefined') {
                throw new Error('Maybe.zip: zipper function returned an undefined value.');
              }
            } catch (e) {
              onError(e);
              controller.abort();
              return;
            }
            onSuccess(r);
            controller.abort();
          }
        },
        onError(x) {
          onError(x);
          controller.abort();
        },
      });
    } else if (typeof maybe !== 'undefined') {
      result[i] = maybe;
      pending -= 1;
    } else {
      onError(new Error('Maybe.zip: One of the sources is undefined.'));
      controller.abort();
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
  if (typeof zipper !== 'function') {
    fn = defaultZipper;
  }
  const maybe = new Maybe();
  maybe.sources = sources;
  maybe.zipper = fn;
  maybe.subscribeActual = subscribeActual.bind(maybe);
  return maybe;
};
