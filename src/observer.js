/**
 * Provides a mechanism for receiving push-based notification of a single value,
 * an error or completion without any value.
 *
 * When a MaybeObserver is subscribed to a Maybe through the Maybe.subscribeWith(MaybeObserver)
 * method, the Maybe calls onSubscribe(Cancellable) with a Cancellable that allows
 * cancelling the sequence at any time. A well-behaved Maybe will call a MaybeObserver's
 * onSuccess(Object), onError(Error) or onComplete() method exactly once as they
 * are considered mutually exclusive terminal signals.
 *
 * the invocation pattern must adhere to the following protocol:
 *
 * <code>onSubscribe (onSuccess | onError | onComplete)?</code>
 *
 * Note that unlike with the Observable protocol, onComplete() is not called after
 * the success item has been signalled via onSuccess(Object).
 *
 * Subscribing a MaybeObserver to multiple Maybes is not recommended. If such reuse
 * happens, it is the duty of the MaybeObserver implementation to be ready to receive
 * multiple calls to its methods and ensure proper concurrent behavior of its business logic.
 *
 * Calling onSubscribe(Cancellable), onSuccess(Object) or onError(Error) with a null
 * argument is forbidden.
 * @interface
 */
// eslint-disable-next-line no-unused-vars
export default class MaybeObserver {
  /**
   * Receives the AbortController subscription.
   * @param {!AbortController} d
   * @abstract
   */
  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  onSubscribe(d) {}

  /**
   * Receives a success value.
   * @param {!any} value
   * @abstract
   */
  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  onSuccess(value) {}


  /**
   * Receives a completion
   * @abstract
   */
  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  onComplete() {}

  /**
   * Receives an error value.
   * @param {!Error} err
   * @abstract
   */
  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  onError(err) {}
}
