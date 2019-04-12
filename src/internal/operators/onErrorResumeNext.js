import { LinkedCancellable } from 'rx-cancellable';
import Maybe from '../../maybe';
import { cleanObserver, isFunction } from '../utils';

function subscribeActual(observer) {
  const {
    onSuccess, onComplete, onError, onSubscribe,
  } = cleanObserver(observer);

  const { source, resumeIfError } = this;

  const controller = new LinkedCancellable();

  onSubscribe(controller);

  source.subscribeWith({
    onSubscribe(ac) {
      controller.link(ac);
    },
    onComplete,
    onSuccess,
    onError(x) {
      controller.unlink();
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
          controller.link(ac);
        },
        onComplete,
        onSuccess,
        onError,
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
