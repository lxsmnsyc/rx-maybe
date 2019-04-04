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
  if (item == null) {
    return source;
  }

  const maybe = new Maybe(subscribeActual);
  maybe.source = source;
  maybe.item = item;
  return maybe;
};
