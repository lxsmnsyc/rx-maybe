import Maybe from '../../maybe';
import { cleanObserver } from '../utils';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const {
    onSuccess, onComplete, onError, onSubscribe,
  } = cleanObserver(observer);

  const { source, callable } = this;

  source.subscribeWith({
    onSubscribe,
    onComplete,
    onSuccess(x) {
      callable(x);
      onSuccess(x);
    },
    onError,
  });
}

/**
 * @ignore
 */
export default (source, callable) => {
  if (typeof callable !== 'function') {
    return source;
  }

  const single = new Maybe();
  single.source = source;
  single.callable = callable;
  single.subscribeActual = subscribeActual.bind(single);
  return single;
};
