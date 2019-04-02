import Maybe from '../../maybe';
import { cleanObserver } from '../utils';

function subscribeActual(observer) {
  const { onSuccess, onComplete, onSubscribe } = cleanObserver(observer);

  const { source, item } = this;

  source.subscribeWith({
    onSubscribe,
    onComplete,
    onSuccess,
    onError() {
      onSuccess(item);
    },
  });
}
/**
 * @ignore
 */
export default (source, item) => {
  if (typeof item === 'undefined') {
    return source;
  }

  const maybe = new Maybe();
  maybe.source = source;
  maybe.item = item;
  maybe.subscribeActual = subscribeActual.bind(maybe);
  return maybe;
};
