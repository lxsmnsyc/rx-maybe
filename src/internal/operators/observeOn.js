import { LinkedCancellable } from 'rx-cancellable';
import Maybe from '../../maybe';
import { cleanObserver, defaultScheduler } from '../utils';

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
  const maybe = new Maybe(subscribeActual);
  maybe.source = source;
  maybe.scheduler = defaultScheduler(scheduler);
  return maybe;
};
