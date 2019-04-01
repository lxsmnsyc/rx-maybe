import AbortController from 'abort-controller';
import Maybe from '../../maybe';
import { cleanObserver } from '../utils';
import { error } from '../operators';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const { onSuccess, onSubscribe } = cleanObserver(observer);


  const controller = new AbortController();

  const { signal } = controller;

  onSubscribe(controller);

  if (signal.aborted) {
    return;
  }

  const timeout = setTimeout(onSuccess, this.amount, 0);

  signal.addEventListener('abort', () => {
    clearTimeout(timeout);
  });
}
/**
 * @ignore
 */
export default (amount) => {
  if (typeof amount !== 'number') {
    return error(new Error('Maybe.timer: "amount" is not a number.'));
  }
  const maybe = new Maybe();
  maybe.amount = amount;
  maybe.subscribeActual = subscribeActual.bind(maybe);
  return maybe;
};
