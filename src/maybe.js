/**
 * @license
 * MIT License
 *
 * Copyright (c) 2019 Alexis Munsayac
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 *
 * @author Alexis Munsayac <alexis.munsayac@gmail.com>
 * @copyright Alexis Munsayac 2019
 */

/**
 * @external {Iterable} https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols
 */
/**
 * @external {Thennable} https://promisesaplus.com/
 */
/**
 * @external {PromiseLike} https://promisesaplus.com/
 */
/**
 * @external {AbortController} https://developer.mozilla.org/en-US/docs/Web/API/AbortController
 */
import AbortController from 'abort-controller';
import { isObserver } from './internal/utils';
import {
  amb, ambWith, cache, compose, create,
  defer, empty, defaultIfEmpty, delay,
  delaySubscription, delayUntil, doAfterSuccess,
  doAfterTerminate, doFinally, doOnAbort,
  doOnComplete, doOnError, doOnEvent,
  doOnSubscribe, doOnSuccess, doOnTerminate,
  error, filter, flatMap, fromCallable,
  fromPromise, fromResolvable, just,
  lift, map, merge, never, onErrorComplete,
  onErrorResumeNext, onErrorReturn,
  onErrorReturnItem, retry, switchIfEmpty,
  takeUntil, timeout, timer, zip, zipWith,
} from './internal/operators';

export default class Maybe {
  /**
   * Runs multiple MaybeSources and signals the events
   * of the first one that signals (aborting the rest).
   *
   * @param {!Iterable} sources
   * the Iterable sequence of sources. A subscription
   * to each source will occur in the same order as
   * in the Iterable.
   * @returns {Maybe}
   */
  static amb(sources) {
    return amb(sources);
  }

  /**
   * Mirrors the MaybeSource (current or provided) that
   * first signals an event.
   * @param {!Maybe} other
   * a MaybeSource competing to react first. A subscription
   * to this provided source will occur after subscribing
   * to the current source.
   * @returns {Maybe}
   * a Maybe that emits the same sequence as whichever of the
   * source MaybeSources first signalled
   */
  ambWith(other) {
    return ambWith(this, other);
  }

  /**
   * Returns a Maybe that subscribes to this Maybe lazily,
   * caches its event and replays it, to all the downstream
   * subscribers.
   *
   * The operator subscribes only when the first downstream
   * subscriber subscribes and maintains a single subscription
   * towards this Maybe.
   *
   * @returns {Maybe}
   * a Maybe that, when first subscribed to, caches all of its
   * items and notifications for the benefit of subsequent
   * subscribers.
   */
  cache() {
    return cache(this);
  }

  /**
   * Transform a Maybe by applying a particular Transformer
   * function to it.
   *
   * This method operates on the Maybe itself whereas lift(Observer)
   * operates on the Maybe's Observers.
   *
   * If the operator you are creating is designed to act on
   * the individual item emitted by a Maybe, use lift(Observer).
   * If your operator is designed to transform the source
   * Maybe as a whole (for instance, by applying a particular
   * set of existing Maybe operators to it) use compose.
   *
   * @param {!function(source: Maybe):Maybe} transformer
   * the transformer function, not null
   * @returns {Maybe}
   * a Maybe, transformed by the transformer function
   */
  compose(transformer) {
    return compose(this, transformer);
  }

  /**
   * Provides an API (via a cold Maybe) that bridges the
   * reactive world with the callback-style world.
   *
   * @param {!function(e: Emitter):any} subscriber
   * the emitter that is called when a Observer
   * subscribes to the returned Maybe
   * @returns {Maybe}
   */
  static create(subscriber) {
    return create(subscriber);
  }

  /**
   * Returns a Maybe that emits the item emitted by the
   * source Maybe or a specified default item if the source
   * Maybe is empty.
   *
   * Note that the result Maybe is semantically equivalent to a
   * Single, since it's guaranteed to emit exactly one item or
   * an error.
   *
   * @param {!any} value
   * the item to emit if the source Maybe emits no items
   * @returns {Maybe}
   * a Maybe that emits either the specified default item
   * if the source Maybe emits no items, or the items emitted
   * by the source Maybe.
   */
  defaultIfEmpty(value) {
    return defaultIfEmpty(this, value);
  }

  /**
   * Calls a function for each individual Observer to return
   * the actual Maybe source to be subscribed to.
   *
   * @param {*} supplier
   * the function that is called for each individual Observer
   * and returns a Maybe instance to subscribe to
   * @returns {Maybe}
   */
  static defer(supplier) {
    return defer(supplier);
  }

  /**
   * Returns a Maybe that signals the events emitted by the
   * source Maybe shifted forward in time by a specified delay.
   * @param {!number} amount
   * the delay to shift the source by in milliseconds.
   * @param {?boolean} doDelayError
   * if true, both success and error signals are delayed.
   * if false, only success signals are delayed.
   * @returns {Maybe}
   */
  delay(amount, doDelayError) {
    return delay(this, amount, doDelayError);
  }

  /**
   * Returns a Maybe that delays the subscription to the source
   * Maybe by a given amount of time.
   * @param {!number} amount
   * the time to delay the subscription
   * @returns {Maybe}
   * a Maybe that delays the subscription to the source
   * Maybe by the given amount
   */
  delaySubscription(amount) {
    return delaySubscription(this, amount);
  }

  /**
   * Delays the actual subscription to the current Maybe until
   * the given other Maybe signals success.
   *
   * If the delaying source signals an error, that error is
   * re-emitted and no subscription to the current Maybe happens.
   *
   * @param {!Maybe} other
   * the Single that has to complete before the subscription
   * to the current Single happens.
   * @returns {Maybe}
   */
  delayUntil(other) {
    return delayUntil(this, other);
  }

  /**
   * Calls the specified consumer with the success item after this
   * item has been emitted to the downstream.
   * @param {!function(x:any)} consumer
   * the consumer that will be called after emitting an item
   * from upstream to the downstream
   * @returns {Maybe}
   */
  doAfterSuccess(consumer) {
    return doAfterSuccess(this, consumer);
  }

  /**
   * Registers an Action to be called when this Maybe invokes either
   * onSuccess, onComplete or onError.
   * @param {!function} action
   * an action to be invoked when the source Maybe finishes
   * @returns {Maybe}
   * a Maybe that emits the same items as the source Maybe,
   * then invokes the Action
   */
  doAfterTerminate(action) {
    return doAfterTerminate(this, action);
  }

  doFinally(action) {
    return doFinally(this, action);
  }

  doOnAbort(action) {
    return doOnAbort(this, action);
  }

  doOnComplete(action) {
    return doOnComplete(this, action);
  }

  doOnError(consumer) {
    return doOnError(this, consumer);
  }

  doOnEvent(biconsumer) {
    return doOnEvent(this, biconsumer);
  }

  doOnSubscribe(consumer) {
    return doOnSubscribe(this, consumer);
  }

  doOnSuccess(consumer) {
    return doOnSuccess(this, consumer);
  }

  doOnTerminate(action) {
    return doOnTerminate(this, action);
  }

  static empty() {
    return empty();
  }

  static error(err) {
    return error(err);
  }

  filter(predicate) {
    return filter(this, predicate);
  }

  flatMap(mapper) {
    return flatMap(this, mapper);
  }

  static fromCallable(callable) {
    return fromCallable(callable);
  }

  static fromPromise(promise) {
    return fromPromise(promise);
  }

  static fromResolvable(resolvable) {
    return fromResolvable(resolvable);
  }

  static just(value) {
    return just(value);
  }

  lift(operator) {
    return lift(this, operator);
  }

  map(mapper) {
    return map(this, mapper);
  }

  static merge(source) {
    return merge(source);
  }

  static never() {
    return never();
  }

  onErrorComplete(predicate) {
    return onErrorComplete(this, predicate);
  }

  onErrorResumeNext(other) {
    return onErrorResumeNext(this, other);
  }

  onErrorReturn(supplier) {
    return onErrorReturn(this, supplier);
  }

  onErrorReturnItem(value) {
    return onErrorReturnItem(this, value);
  }

  retry(bipredicate) {
    return retry(this, bipredicate);
  }

  switchIfEmpty(other) {
    return switchIfEmpty(this, other);
  }

  takeUntil(other) {
    return takeUntil(this, other);
  }

  timeout(amount) {
    return timeout(this, amount);
  }

  static timer(amount) {
    return timer(this, amount);
  }

  static zip(sources, zipper) {
    return zip(sources, zipper);
  }

  zipWith(other, zipper) {
    return zipWith(this, other, zipper);
  }

  /**
   * @desc
   * Subscribes with an Object that is an Observer.
   *
   * An Object is considered as an Observer if:
   *  - if it has the method onSubscribe
   *  - if it has the method onComplete (optional)
   *  - if it has the method onSuccess (optional)
   *  - if it has the method onError (optional)
   *
   * The onSubscribe method is called when subscribeWith
   * or subscribe is executed. This method receives an
   * AbortController instance.
   *
   * @param {!Object} observer
   * @returns {undefined}
   */
  subscribeWith(observer) {
    if (isObserver(observer)) {
      this.subscribeActual(observer);
    }
  }

  /**
   * @desc
   * Subscribes to a Maybe instance with an onSuccess
   * and an onError method.
   *
   * onSuccess receives a non-undefined value.
   * onError receives a string(or an Error object).
   *
   * Both are called once.
   * @param {?function(x: any)} onSuccess
   * the function you have designed to accept the emission
   * from the Maybe
   * @param {?function(x: any)} onComplete
   * the function you have designed to accept the completion
   * from the Maybe
   * @param {?function(x: any)} onError
   * the function you have designed to accept any error
   * notification from the Maybe
   * @returns {AbortController}
   * an AbortController reference can request the Maybe to abort.
   */
  subscribe(onSuccess, onComplete, onError) {
    const controller = new AbortController();
    let once = false;
    this.subscribeActual({
      onSubscribe(ac) {
        ac.signal.addEventListener('abort', () => {
          if (!once) {
            once = true;
            if (!controller.signal.aborted) {
              controller.abort();
            }
          }
        });
        controller.signal.addEventListener('abort', () => {
          if (!once) {
            once = true;
            if (!ac.signal.aborted) {
              ac.abort();
            }
          }
        });
      },
      onSuccess,
      onError,
    });
    return controller;
  }


  /**
   * Converts the Maybe to a Promise instance.
   *
   * @returns {Promise}
   */
  toPromise() {
    return new Promise((res, rej) => {
      this.subscribe(res, rej);
    });
  }

  /**
   * Converts the Maybe to a Promise instance
   * and attaches callbacks to it.
   *
   * @param {!function(x: any):any} onFulfill
   * @param {?function(x: Error):any} onReject
   * @returns {Promise}
   */
  then(onFulfill, onReject) {
    return this.toPromise().then(onFulfill, onReject);
  }

  /**
   * Converts the Maybe to a Promise instance
   * and attaches an onRejection callback to it.
   *
   * @param {!function(x: Error):any} onReject
   * @returns {Promise}
   */
  catch(onReject) {
    return this.toPromise().catch(onReject);
  }
}
