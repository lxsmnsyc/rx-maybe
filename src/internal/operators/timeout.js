import Scheduler from 'rx-scheduler';
import { LinkedCancellable } from 'rx-cancellable';
import Maybe from '../../maybe';
import { cleanObserver, isNumber, isOf } from '../utils';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const {
    onSuccess, onComplete, onError, onSubscribe,
  } = cleanObserver(observer);

  const { amount, scheduler } = this;

  const controller = new LinkedCancellable();

  onSubscribe(controller);

  const timeout = scheduler.delay(
    () => {
      onError(new Error('Maybe.timeout: TimeoutException (no success signals within the specified timeout).'));
      controller.cancel();
    },
    amount,
  );

  controller.addEventListener('cancel', () => timeout.cancel());

  this.source.subscribeWith({
    onSubscribe(ac) {
      controller.link(ac);
    },
    onComplete,
    onSuccess,
    onError,
  });
}
/**
 * @ignore
 */
export default (source, amount, scheduler) => {
  if (!isNumber(amount)) {
    return source;
  }
  let sched = scheduler;
  if (!isOf(sched, Scheduler.interface)) {
    sched = Scheduler.current;
  }
  const maybe = new Maybe(subscribeActual);
  maybe.source = source;
  maybe.amount = amount;
  maybe.scheduler = sched;
  return maybe;
};
