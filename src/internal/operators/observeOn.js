import AbortController from 'abort-controller';
import Scheduler from 'rx-scheduler';
import Maybe from '../../maybe';
import { cleanObserver } from '../utils';

function subscribeActual(observer) {
  const {
    onSubscribe, onSuccess, onComplete, onError,
  } = cleanObserver(observer);

  const { source, scheduler } = this;

  const controller = new AbortController();
  onSubscribe(controller);

  const { signal } = controller;

  if (signal.aborted) {
    return;
  }

  source.subscribeWith({
    onSubscribe(ac) {
      signal.addEventListener('abort', () => ac.abort());
    },
    onSuccess(x) {
      scheduler.schedule(() => {
        onSuccess(x);
        controller.abort();
      });
    },
    onComplete() {
      scheduler.schedule(() => {
        onComplete();
        controller.abort();
      });
    },
    onError(x) {
      scheduler.schedule(() => {
        onError(x);
        controller.abort();
      });
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
