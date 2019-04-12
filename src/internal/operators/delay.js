import Scheduler from 'rx-scheduler';
import { LinkedCancellable } from 'rx-cancellable';
import Maybe from '../../maybe';
import { cleanObserver, isNumber } from '../utils';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const {
    onSuccess, onComplete, onError, onSubscribe,
  } = cleanObserver(observer);

  const { amount, scheduler, doDelayError } = this;

  const controller = new LinkedCancellable();

  onSubscribe(controller);

  this.source.subscribeWith({
    onSubscribe(ac) {
      controller.link(ac);
    },
    onSuccess(x) {
      controller.link(scheduler.delay(() => {
        onSuccess(x);
      }, amount));
    },
    onComplete() {
      controller.link(scheduler.delay(onComplete, amount));
    },
    onError(x) {
      controller.link(scheduler.delay(() => {
        onError(x);
      }, doDelayError ? amount : 0));
    },
  });
}
/**
 * @ignore
 */
export default (source, amount, scheduler, doDelayError) => {
  if (!isNumber(amount)) {
    return source;
  }
  let sched = scheduler;
  if (!(sched instanceof Scheduler.interface)) {
    sched = Scheduler.current;
  }
  const maybe = new Maybe(subscribeActual);
  maybe.source = source;
  maybe.amount = amount;
  maybe.scheduler = sched;
  maybe.doDelayError = doDelayError;
  return maybe;
};
