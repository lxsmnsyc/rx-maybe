import { LinkedCancellable } from 'rx-cancellable';
import Maybe from '../../maybe';
import { cleanObserver, isFunction, isNull } from '../utils';
import is from '../is';

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
          if (isNull(result)) {
            throw new Error('Maybe.onErrorResumeNext: returned an non-Maybe.');
          }
        } catch (e) {
          onError(new Error([x, e]));
          controller.cancel();
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
  if (!(isFunction(resumeIfError) || is(resumeIfError))) {
    return source;
  }

  const maybe = new Maybe(subscribeActual);
  maybe.source = source;
  maybe.resumeIfError = resumeIfError;
  return maybe;
};
