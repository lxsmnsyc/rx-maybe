import AbortController from 'abort-controller';
import Maybe from '../../maybe';
import { cleanObserver, isFunction } from '../utils';

function subscribeActual(observer) {
  const {
    onSuccess, onComplete, onError, onSubscribe,
  } = cleanObserver(observer);

  const { source, resumeIfError } = this;

  const controller = new AbortController();

  const { signal } = controller;

  onSubscribe(controller);

  if (signal.aborted) {
    return;
  }

  source.subscribeWith({
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
      let result;

      if (isFunction(resumeIfError)) {
        try {
          result = resumeIfError(x);
          if (result == null) {
            throw new Error('Maybe.onErrorResumeNext: returned an non-Maybe.');
          }
        } catch (e) {
          onError(new Error([x, e]));
          return;
        }
      } else {
        result = resumeIfError;
      }

      result.subscribeWith({
        onSubscribe(ac) {
          signal.addEventListener('abort', () => ac.abort());
        },
        onComplete() {
          onComplete();
          controller.abort();
        },
        onSuccess(v) {
          onSuccess(v);
          controller.abort();
        },
        onError(v) {
          onError(v);
          controller.abort();
        },
      });
    },
  });
}
/**
 * @ignore
 */
export default (source, resumeIfError) => {
  if (!(isFunction(resumeIfError) || resumeIfError instanceof Maybe)) {
    return source;
  }

  const maybe = new Maybe(subscribeActual);
  maybe.source = source;
  maybe.resumeIfError = resumeIfError;
  return maybe;
};
