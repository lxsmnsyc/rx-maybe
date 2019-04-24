import Maybe from '../../maybe';
import { cleanObserver, isNull } from '../utils';

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
  if (isNull(item)) {
    return source;
  }

  const maybe = new Maybe(subscribeActual);
  maybe.source = source;
  maybe.item = item;
  return maybe;
};
