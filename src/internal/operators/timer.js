import Scheduler from 'rx-scheduler';
import Maybe from '../../maybe';
import { cleanObserver, isNumber, isOf } from '../utils';
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

  let sched = scheduler;
  if (!isOf(sched, Scheduler.interface)) {
    sched = Scheduler.current;
  }
  const maybe = new Maybe(subscribeActual);
  maybe.amount = amount;
  maybe.scheduler = sched;
  return maybe;
};
