import { LinkedCancellable } from 'rx-cancellable';
import Maybe from '../../maybe';
import { cleanObserver, isNumber, defaultScheduler } from '../utils';

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

  controller.link(scheduler.delay(() => {
    controller.unlink();
    this.source.subscribeWith({
      onSubscribe(ac) {
        controller.link(ac);
      },
      onComplete,
      onSuccess,
      onError,
    });
  }, amount));
}
/**
 * @ignore
 */
export default (source, amount, scheduler) => {
  if (!isNumber(amount)) {
    return source;
  }
  const maybe = new Maybe(subscribeActual);
  maybe.source = source;
  maybe.amount = amount;
  maybe.scheduler = defaultScheduler(scheduler);
  return maybe;
};
