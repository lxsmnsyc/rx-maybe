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
import { amb, ambWith, cache, compose, create, defer, empty } from './internal/operators';

export default class Maybe {
  static amb(sources) {
    return amb(sources);
  }

  ambWith(other) {
    return ambWith(this, other);
  }

  cache() {
    return cache(this);
  }

  compose(transformer) {
    return compose(this, transformer);
  }

  static create(subscriber) {
    return create(subscriber);
  }

  static defer(supplier) {
    return defer(supplier);
  }

  static empty() {
    return empty();
  }

  /**
   * @desc
   * Subscribes with an Object that is an Observer.
   *
   * An Object is considered as an Observer if:
   *  - if it has the method onSubscribe
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
   * @param {?function(x: any)} onSuccess
   * the function you have designed to accept the emission
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
