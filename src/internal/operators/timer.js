import AbortController from 'abort-controller';
import Scheduler from 'rx-scheduler';
import Maybe from '../../maybe';
import { cleanObserver, isNumber } from '../utils';
import error from './error';

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

  const timeout = this.scheduler.delay(() => onSuccess(0), this.amount);

  signal.addEventListener('abort', () => timeout.abort());
}
/**
 * @ignore
 */
export default (amount, scheduler) => {
  if (!isNumber(amount)) {
    return error(new Error('Maybe.timer: "amount" is not a number.'));
  }

  let sched = scheduler;
  if (!(sched instanceof Scheduler.interface)) {
    sched = Scheduler.current;
  }
  const maybe = new Maybe(subscribeActual);
  maybe.amount = amount;
  maybe.scheduler = sched;
  return maybe;
};
