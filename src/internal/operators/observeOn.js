import Scheduler from 'rx-scheduler';
import { LinkedCancellable } from 'rx-cancellable';
import Maybe from '../../maybe';
import { cleanObserver } from '../utils';

function subscribeActual(observer) {
  const {
    onSubscribe, onSuccess, onComplete, onError,
  } = cleanObserver(observer);

  const { source, scheduler } = this;

  const controller = new LinkedCancellable();

  onSubscribe(controller);

  source.subscribeWith({
    onSubscribe(ac) {
      controller.link(ac);
    },
    onSuccess(x) {
      controller.link(scheduler.schedule(() => {
        onSuccess(x);
      }));
    },
    onComplete() {
      controller.link(scheduler.schedule(onComplete));
    },
    onError(x) {
      controller.link(scheduler.schedule(() => {
        onError(x);
      }));
    },
  });
}
/**
 * @ignore
 */
export default (source, scheduler) => {
  let sched = scheduler;
  if (!(sched instanceof Scheduler.interface)) {
    sched = Scheduler.current;
  }
  const maybe = new Maybe(subscribeActual);
  maybe.source = source;
  maybe.scheduler = sched;
  return maybe;
};
