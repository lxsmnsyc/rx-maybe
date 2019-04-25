import Maybe from '../../maybe';
import { cleanObserver, isNumber, defaultScheduler } from '../utils';
import error from './error';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const { onSuccess, onSubscribe } = cleanObserver(observer);

  onSubscribe(this.scheduler.delay(() => onSuccess(0), this.amount));
}
/**
 * @ignore
 */
export default (amount, scheduler) => {
  if (!isNumber(amount)) {
    return error(new Error('Maybe.timer: "amount" is not a number.'));
  }
  const maybe = new Maybe(subscribeActual);
  maybe.amount = amount;
  maybe.scheduler = defaultScheduler(scheduler);
  return maybe;
};
