/* eslint-disable no-restricted-syntax */
import AbortController from 'abort-controller';
import Maybe from '../../maybe';
import { isIterable, cleanObserver } from '../utils';
import error from './error';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const {
    onSuccess, onComplete, onError, onSubscribe,
  } = cleanObserver(observer);

  const controller = new AbortController();

  const { signal } = controller;

  onSubscribe(controller);

  if (signal.aborted) {
    return;
  }

  const { sources } = this;

  for (const maybe of sources) {
    if (signal.aborted) {
      return;
    }

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
          onSuccess(x);
          controller.abort();
        },
        onError(x) {
          onError(x);
          controller.abort();
        },
      });
    } else {
      onError(new Error('Maybe.amb: One of the sources is a non-Maybe.'));
      controller.abort();
      break;
    }
  }
}
/**
 * @ignore
 */
export default (sources) => {
  if (!isIterable(sources)) {
    return error(new Error('Maybe.amb: sources is not Iterable.'));
  }
  const maybe = new Maybe(subscribeActual);
  maybe.sources = sources;
  return maybe;
};
