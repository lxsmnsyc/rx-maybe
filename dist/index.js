var Maybe = (function (AbortController) {
  'use strict';

  AbortController = AbortController && AbortController.hasOwnProperty('default') ? AbortController['default'] : AbortController;

  /**
   * @ignore
   */
  // eslint-disable-next-line valid-typeof
  const isType = (x, y) => typeof x === y;
  /**
   * @ignore
   */
  const isFunction = x => isType(x, 'function');
  /**
   * @ignore
   */
  const isNumber = x => isType(x, 'number');
  /**
   * @ignore
   */
  const isObject = x => isType(x, 'object');
  /**
   * @ignore
   */
  const isIterable = obj => isObject(obj) && isFunction(obj[Symbol.iterator]);
  /**
   * @ignore
   */
  const isObserver = obj => isObject(obj) && isFunction(obj.onSubscribe);
  /**
   * @ignore
   */
  const toCallable = x => () => x;
  /**
   * @ignore
   */
  const isPromise = (obj) => {
    if (obj == null) return false;
    if (obj instanceof Promise) return true;
    return (isObject(obj) || isFunction(obj)) && isFunction(obj.then);
  };
  /**
   * @ignore
   */
  function onSuccessHandler(value) {
    const { onSuccess, onError, controller } = this;
    if (controller.signal.aborted) {
      return;
    }
    try {
      if (value == null) {
        onError('onSuccess called with null value.');
      } else {
        onSuccess(value);
      }
    } finally {
      controller.abort();
    }
  }
  /**
   * @ignore
   */
  function onCompleteHandler() {
    const { onComplete, controller } = this;
    if (controller.signal.aborted) {
      return;
    }
    try {
      onComplete();
    } finally {
      controller.abort();
    }
  }
  /**
   * @ignore
   */
  function onErrorHandler(err) {
    const { onError, controller } = this;
    let report = err;
    if (!(err instanceof Error)) {
      report = new Error('onError called with a non-Error value.');
    }
    if (controller.signal.aborted) {
      return;
    }

    try {
      onError(report);
    } finally {
      controller.abort();
    }
  }
  /**
   * @ignore
   */
  const identity = x => x;
  /**
   * @ignore
   */
  const throwError = (x) => { throw x; };
  /**
   * @ignore
   */
  const cleanObserver = x => ({
    onSubscribe: x.onSubscribe,
    onSuccess: isFunction(x.onSuccess) ? x.onSuccess : identity,
    onComplete: isFunction(x.onComplete) ? x.onComplete : identity,
    onError: isFunction(x.onError) ? x.onError : throwError,
  });
  /**
   * @ignore
   */
  const immediateSuccess = (o, x) => {
    // const disposable = new SimpleDisposable();
    const { onSubscribe, onSuccess } = cleanObserver(o);
    const controller = new AbortController();
    onSubscribe(controller);

    if (!controller.signal.aborted) {
      onSuccess(x);
      controller.abort();
    }
  };

  /**
   * @ignore
   */
  const immediateComplete = (o) => {
    // const disposable = new SimpleDisposable();
    const { onSubscribe, onComplete } = cleanObserver(o);
    const controller = new AbortController();
    onSubscribe(controller);

    if (!controller.signal.aborted) {
      onComplete();
      controller.abort();
    }
  };
  /**
   * @ignore
   */
  const immediateError = (o, x) => {
    const { onSubscribe, onError } = cleanObserver(o);
    const controller = new AbortController();
    onSubscribe(controller);

    if (!controller.signal.aborted) {
      onError(x);
      controller.abort();
    }
  };

  /**
   * @ignore
   */
  function subscribeActual(observer) {
    let err;

    try {
      err = this.supplier();

      if (err == null) {
        throw new Error('Maybe.error: Error supplier returned a null value.');
      }
    } catch (e) {
      err = e;
    }
    immediateError(observer, err);
  }
  /**
   * @ignore
   */
  var error = (value) => {
    let report = value;

    if (!(value instanceof Error || isFunction(value))) {
      report = new Error('Maybe.error received a non-Error value.');
    }

    if (!isFunction(value)) {
      report = toCallable(report);
    }
    const maybe = new Maybe(subscribeActual);
    maybe.supplier = report;
    return maybe;
  };

  /* eslint-disable no-restricted-syntax */

  /**
   * @ignore
   */
  function subscribeActual$1(observer) {
    const {
      onSuccess, onComplete, onError, onSubscribe,
    } = cleanObserver(observer);

    const controller = new AbortController();

    const { signal } = controller;

    onSubscribe(controller);

    if (signal.aborted) {
      return;
    }

    const { sources } = this;

    for (const maybe of sources) {
      if (signal.aborted) {
        return;
      }

      if (maybe instanceof Maybe) {
        maybe.subscribeWith({
          onSubscribe(ac) {
            signal.addEventListener('abort', () => ac.abort());
          },
          onComplete() {
            onComplete();
            controller.abort();
          },
          onSuccess(x) {
            onSuccess(x);
            controller.abort();
          },
          onError(x) {
            onError(x);
            controller.abort();
          },
        });
      } else {
        onError(new Error('Maybe.amb: One of the sources is a non-Maybe.'));
        controller.abort();
        break;
      }
    }
  }
  /**
   * @ignore
   */
  var amb = (sources) => {
    if (!isIterable(sources)) {
      return error(new Error('Maybe.amb: sources is not Iterable.'));
    }
    const maybe = new Maybe(subscribeActual$1);
    maybe.sources = sources;
    return maybe;
  };

  /**
   * @ignore
   */
  function subscribeActual$2(observer) {
    const {
      onSuccess, onComplete, onError, onSubscribe,
    } = cleanObserver(observer);

    const controller = new AbortController();

    const { signal } = controller;

    onSubscribe(controller);

    if (signal.aborted) {
      return;
    }


    const sharedComplete = () => {
      if (!signal.aborted) {
        onComplete();
        controller.abort();
      }
    };
    const sharedSuccess = (x) => {
      if (!signal.aborted) {
        onSuccess(x);
        controller.abort();
      }
    };
    const sharedError = (x) => {
      if (!signal.aborted) {
        onError(x);
        controller.abort();
      }
    };

    const { source, other } = this;

    source.subscribeWith({
      onSubscribe(ac) {
        signal.addEventListener('abort', () => ac.abort());
      },
      onComplete: sharedComplete,
      onSuccess: sharedSuccess,
      onError: sharedError,
    });
    other.subscribeWith({
      onSubscribe(ac) {
        if (signal.aborted) {
          ac.abort();
        } else {
          signal.addEventListener('abort', () => ac.abort());
        }
      },
      onComplete: sharedComplete,
      onSuccess: sharedSuccess,
      onError: sharedError,
    });
  }
  /**
   * @ignore
   */
  var ambWith = (source, other) => {
    if (!(other instanceof Maybe)) {
      return source;
    }
    const maybe = new Maybe(subscribeActual$2);
    maybe.source = source;
    maybe.other = other;
    return maybe;
  };

  /**
   * @ignore
   */
  function subscribeActual$3(observer) {
    const {
      onSuccess, onComplete, onError, onSubscribe,
    } = cleanObserver(observer);

    const {
      source, cached, observers, subscribed,
    } = this;

    if (!cached) {
      const index = observers.length;
      observers[index] = observer;

      const controller = new AbortController();

      controller.signal.addEventListener('abort', () => {
        observers.splice(index, 1);
      });

      onSubscribe(controller);

      if (controller.signal.aborted) {
        return;
      }

      if (!subscribed) {
        source.subscribeWith({
          onSubscribe() {
            // not applicable
          },
          onSuccess: (x) => {
            this.cached = true;
            this.value = x;

            // eslint-disable-next-line no-restricted-syntax
            for (const obs of observers) {
              obs.onSuccess(x);
            }
            this.observers = undefined;
          },
          onComplete: () => {
            this.cached = true;

            // eslint-disable-next-line no-restricted-syntax
            for (const obs of observers) {
              obs.onComplete();
            }
            this.observers = undefined;
          },
          onError: (x) => {
            this.cached = true;
            this.error = x;

            // eslint-disable-next-line no-restricted-syntax
            for (const obs of observers) {
              obs.onError(x);
            }
            this.observers = undefined;
          },
        });
        this.subscribed = true;
      }
    } else {
      const controller = new AbortController();
      onSubscribe(controller);

      const { value, error } = this;
      if (value != null) {
        onSuccess(value);
      } else if (error != null) {
        onError(error);
      } else {
        onComplete();
      }
      controller.abort();
    }
  }

  /**
   * @ignore
   */
  var cache = (source) => {
    const maybe = new Maybe(subscribeActual$3);
    maybe.source = source;
    maybe.cached = false;
    maybe.subscribed = false;
    maybe.observers = [];
    return maybe;
  };

  /**
   * @ignore
   */
  function subscribeActual$4(observer) {
    const {
      onSuccess, onComplete, onError, onSubscribe,
    } = cleanObserver(observer);

    const emitter = new AbortController();
    emitter.onComplete = onCompleteHandler.bind(this);
    emitter.onSuccess = onSuccessHandler.bind(this);
    emitter.onError = onErrorHandler.bind(this);

    this.controller = emitter;
    this.onComplete = onComplete;
    this.onSuccess = onSuccess;
    this.onError = onError;

    onSubscribe(emitter);

    try {
      this.subscriber(emitter);
    } catch (ex) {
      emitter.onError(ex);
    }
  }
  /**
   * @ignore
   */
  var create = (subscriber) => {
    if (!isFunction(subscriber)) {
      return error(new Error('Maybe.create: There are no subscribers.'));
    }
    const maybe = new Maybe(subscribeActual$4);
    maybe.subscriber = subscriber;
    return maybe;
  };

  /**
   * @ignore
   */
  var compose = (source, transformer) => {
    if (!isFunction(transformer)) {
      return source;
    }

    let result;

    try {
      result = transformer(source);

      if (!(result instanceof Maybe)) {
        throw new Error('Maybe.compose: transformer returned a non-Maybe.');
      }
    } catch (e) {
      result = error(e);
    }

    return result;
  };

  function subscribeActual$5(observer) {
    const {
      onSubscribe, onSuccess, onError,
    } = cleanObserver(observer);

    const controller = new AbortController();

    onSubscribe(controller);

    const { signal } = controller;

    if (signal.aborted) {
      return;
    }

    const { source, value } = this;

    source.subscribeWith({
      onSubscribe(ac) {
        signal.addEventListener('abort', () => ac.abort());
      },
      onSuccess(x) {
        onSuccess(x);
        controller.abort();
      },
      onComplete() {
        onSuccess(value);
        controller.abort();
      },
      onError(x) {
        onError(x);
        controller.abort();
      },
    });
  }

  /**
   * @ignore
   */
  var defaultIfEmpty = (source, value) => {
    if (value == null) {
      return source;
    }

    const maybe = new Maybe(subscribeActual$5);
    maybe.source = source;
    maybe.value = value;

    return maybe;
  };

  /**
   * @ignore
   */
  function subscribeActual$6(observer) {
    const {
      onSuccess, onComplete, onError, onSubscribe,
    } = cleanObserver(observer);

    let result;

    let err;
    try {
      result = this.supplier();
      if (!(result instanceof Maybe)) {
        throw new Error('Maybe.defer: supplier returned a non-Maybe.');
      }
    } catch (e) {
      err = e;
    }

    if (err != null) {
      immediateError(observer, err);
    } else {
      result.subscribeWith({
        onSubscribe,
        onComplete,
        onSuccess,
        onError,
      });
    }
  }
  /**
   * @ignore
   */
  var defer = (supplier) => {
    const maybe = new Maybe(subscribeActual$6);
    maybe.supplier = supplier;
    return maybe;
  };

  /**
   * @ignore
   */
  function subscribeActual$7(observer) {
    const {
      onSuccess, onComplete, onError, onSubscribe,
    } = cleanObserver(observer);

    const { amount, doDelayError } = this;

    let timeout;

    const controller = new AbortController();

    const { signal } = controller;

    onSubscribe(controller);

    if (signal.aborted) {
      return;
    }

    signal.addEventListener('abort', () => {
      if (typeof timeout !== 'undefined') {
        clearTimeout(timeout);
      }
    });

    this.source.subscribeWith({
      onSubscribe(ac) {
        signal.addEventListener('abort', () => ac.abort());
      },
      onSuccess(x) {
        timeout = setTimeout(() => {
          onSuccess(x);
          controller.abort();
        }, amount);
      },
      onComplete() {
        timeout = setTimeout(() => {
          onComplete();
          controller.abort();
        }, amount);
      },
      onError(x) {
        timeout = setTimeout(() => {
          onError(x);
          controller.abort();
        }, doDelayError ? amount : 0);
      },
    });
  }
  /**
   * @ignore
   */
  var delay = (source, amount, doDelayError) => {
    if (!isNumber(amount)) {
      return source;
    }
    const maybe = new Maybe(subscribeActual$7);
    maybe.source = source;
    maybe.amount = amount;
    maybe.doDelayError = doDelayError;
    return maybe;
  };

  /**
   * @ignore
   */
  function subscribeActual$8(observer) {
    const {
      onSuccess, onComplete, onError, onSubscribe,
    } = cleanObserver(observer);

    const { amount } = this;

    let timeout;

    const controller = new AbortController();

    const { signal } = controller;

    signal.addEventListener('abort', () => {
      if (typeof timeout !== 'undefined') {
        clearTimeout(timeout);
      }
    });

    onSubscribe(controller);

    if (signal.aborted) {
      return;
    }

    timeout = setTimeout(() => {
      this.source.subscribeWith({
        onSubscribe(ac) {
          signal.addEventListener('abort', () => ac.abort());
        },
        onSuccess(x) {
          onSuccess(x);
          controller.abort();
        },
        onComplete() {
          onComplete();
          controller.abort();
        },
        onError(x) {
          onError(x);
          controller.abort();
        },
      });
    }, amount);
  }
  /**
   * @ignore
   */
  var delaySubscription = (source, amount) => {
    if (!isNumber(amount)) {
      return source;
    }
    const maybe = new Maybe(subscribeActual$8);
    maybe.source = source;
    maybe.amount = amount;
    return maybe;
  };

  /**
   * @ignore
   */
  function subscribeActual$9(observer) {
    const {
      onSuccess, onComplete, onError, onSubscribe,
    } = cleanObserver(observer);

    const { source, other } = this;

    const controller = new AbortController();

    const { signal } = controller;

    onSubscribe(controller);

    if (signal.aborted) {
      return;
    }

    const success = () => {
      if (!signal.aborted) {
        source.subscribeWith({
          onSubscribe(ac) {
            signal.addEventListener('abort', () => ac.abort());
          },
          onComplete() {
            onComplete();
            controller.abort();
          },
          onSuccess(x) {
            onSuccess(x);
            controller.abort();
          },
          onError(x) {
            onError(x);
            controller.abort();
          },
        });
      }
    };

    other.subscribeWith({
      onSubscribe(ac) {
        signal.addEventListener('abort', () => ac.abort());
      },
      onComplete: success,
      onSuccess: success,
      onError(x) {
        onError(x);
        controller.abort();
      },
    });
  }
  /**
   * @ignore
   */
  var delayUntil = (source, other) => {
    if (!(other instanceof Maybe)) {
      return source;
    }
    const maybe = new Maybe(subscribeActual$9);
    maybe.source = source;
    maybe.other = other;
    return maybe;
  };

  /**
   * @ignore
   */
  function subscribeActual$a(observer) {
    const {
      onSuccess, onComplete, onError, onSubscribe,
    } = cleanObserver(observer);

    const { source, callable } = this;

    source.subscribeWith({
      onSubscribe,
      onSuccess(x) {
        onSuccess(x);
        callable(x);
      },
      onComplete,
      onError,
    });
  }

  /**
   * @ignore
   */
  var doAfterSuccess = (source, callable) => {
    if (!isFunction(callable)) {
      return source;
    }

    const maybe = new Maybe(subscribeActual$a);
    maybe.source = source;
    maybe.callable = callable;
    return maybe;
  };

  /**
   * @ignore
   */
  function subscribeActual$b(observer) {
    const {
      onSuccess, onComplete, onError, onSubscribe,
    } = cleanObserver(observer);

    const { source, callable } = this;

    source.subscribeWith({
      onSubscribe,
      onSuccess(x) {
        onSuccess(x);
        callable();
      },
      onComplete() {
        onComplete();
        callable();
      },
      onError(x) {
        onError(x);
        callable();
      },
    });
  }

  /**
   * @ignore
   */
  var doAfterTerminate = (source, callable) => {
    if (!isFunction(callable)) {
      return source;
    }
    const maybe = new Maybe(subscribeActual$b);
    maybe.source = source;
    maybe.callable = callable;
    return maybe;
  };

  /**
   * @ignore
   */
  function subscribeActual$c(observer) {
    const {
      onSuccess, onComplete, onError, onSubscribe,
    } = cleanObserver(observer);

    const { source, callable } = this;

    let called = false;
    source.subscribeWith({
      onSubscribe(ac) {
        ac.signal.addEventListener('abort', () => {
          if (!called) {
            callable();
            called = true;
          }
        });
        onSubscribe(ac);
      },
      onComplete() {
        onComplete();
        if (!called) {
          callable();
          called = true;
        }
      },
      onSuccess(x) {
        onSuccess(x);
        if (!called) {
          callable();
          called = true;
        }
      },
      onError(x) {
        onError(x);
        if (!called) {
          callable();
          called = true;
        }
      },
    });
  }

  /**
   * @ignore
   */
  var doFinally = (source, callable) => {
    if (!isFunction(callable)) {
      return source;
    }
    const maybe = new Maybe(subscribeActual$c);
    maybe.source = source;
    maybe.callable = callable;
    return maybe;
  };

  /**
   * @ignore
   */
  function subscribeActual$d(observer) {
    const {
      onSuccess, onComplete, onError, onSubscribe,
    } = cleanObserver(observer);

    const { source, callable } = this;

    source.subscribeWith({
      onSubscribe(ac) {
        ac.signal.addEventListener('abort', callable);
        onSubscribe(ac);
      },
      onComplete,
      onSuccess,
      onError,
    });
  }

  /**
   * @ignore
   */
  var doOnAbort = (source, callable) => {
    if (!isFunction(callable)) {
      return source;
    }
    const maybe = new Maybe(subscribeActual$d);
    maybe.source = source;
    maybe.callable = callable;
    return maybe;
  };

  /**
   * @ignore
   */
  function subscribeActual$e(observer) {
    const {
      onSuccess, onComplete, onError, onSubscribe,
    } = cleanObserver(observer);

    const { source, callable } = this;

    source.subscribeWith({
      onSubscribe,
      onComplete() {
        callable();
        onComplete();
      },
      onSuccess,
      onError,
    });
  }

  /**
   * @ignore
   */
  var doOnComplete = (source, callable) => {
    if (!isFunction(callable)) {
      return source;
    }
    const maybe = new Maybe(subscribeActual$e);
    maybe.source = source;
    maybe.callable = callable;
    return maybe;
  };

  /**
   * @ignore
   */
  function subscribeActual$f(observer) {
    const {
      onSuccess, onComplete, onError, onSubscribe,
    } = cleanObserver(observer);

    const { source, callable } = this;

    source.subscribeWith({
      onSubscribe,
      onComplete,
      onSuccess,
      onError(x) {
        callable(x);
        onError(x);
      },
    });
  }

  /**
   * @ignore
   */
  var doOnError = (source, callable) => {
    if (!isFunction(callable)) {
      return source;
    }
    const maybe = new Maybe(subscribeActual$f);
    maybe.source = source;
    maybe.callable = callable;
    return maybe;
  };

  /**
   * @ignore
   */
  function subscribeActual$g(observer) {
    const {
      onSuccess, onComplete, onError, onSubscribe,
    } = cleanObserver(observer);

    const { source, callable } = this;

    source.subscribeWith({
      onSubscribe,
      onComplete() {
        callable();
        onComplete();
      },
      onSuccess(x) {
        callable(x);
        onSuccess(x);
      },
      onError(x) {
        callable(undefined, x);
        onError(x);
      },
    });
  }

  /**
   * @ignore
   */
  var doOnEvent = (source, callable) => {
    if (!isFunction(callable)) {
      return source;
    }
    const maybe = new Maybe(subscribeActual$g);
    maybe.source = source;
    maybe.callable = callable;
    return maybe;
  };

  /**
   * @ignore
   */
  function subscribeActual$h(observer) {
    const {
      onSuccess, onComplete, onError, onSubscribe,
    } = cleanObserver(observer);

    const { source, callable } = this;

    source.subscribeWith({
      onSubscribe,
      onComplete,
      onSuccess(x) {
        callable(x);
        onSuccess(x);
      },
      onError,
    });
  }

  /**
   * @ignore
   */
  var doOnSuccess = (source, callable) => {
    if (!isFunction(callable)) {
      return source;
    }
    const maybe = new Maybe(subscribeActual$h);
    maybe.source = source;
    maybe.callable = callable;
    return maybe;
  };

  /**
   * @ignore
   */
  function subscribeActual$i(observer) {
    const {
      onSuccess, onError, onSubscribe,
    } = cleanObserver(observer);

    const { source, callable } = this;

    source.subscribeWith({
      onSubscribe(d) {
        callable(d);
        onSubscribe(d);
      },
      onSuccess,
      onError,
    });
  }

  /**
   * @ignore
   */
  var doOnSubscribe = (source, callable) => {
    if (!isFunction(callable)) {
      return source;
    }
    const maybe = new Maybe(subscribeActual$i);
    maybe.source = source;
    maybe.callable = callable;
    return maybe;
  };

  /**
   * @ignore
   */
  function subscribeActual$j(observer) {
    const {
      onSuccess, onComplete, onError, onSubscribe,
    } = cleanObserver(observer);

    const { source, callable } = this;

    source.subscribeWith({
      onSubscribe,
      onComplete() {
        callable();
        onComplete();
      },
      onSuccess(x) {
        callable();
        onSuccess(x);
      },
      onError(x) {
        callable();
        onError(x);
      },
    });
  }

  /**
   * @ignore
   */
  var doOnTerminate = (source, callable) => {
    if (!isFunction(callable)) {
      return source;
    }
    const maybe = new Maybe(subscribeActual$j);
    maybe.source = source;
    maybe.callable = callable;
    return maybe;
  };

  /**
   * @ignore
   */
  function subscribeActual$k(observer) {
    immediateComplete(observer);
  }

  let INSTANCE;
  /**
   * @ignore
   */
  var empty = () => {
    if (typeof INSTANCE === 'undefined') {
      INSTANCE = new Maybe(subscribeActual$k);
      INSTANCE.subscribeActual = subscribeActual$k.bind(INSTANCE);
    }
    return INSTANCE;
  };

  /**
   * @ignore
   */
  function subscribeActual$l(observer) {
    const {
      onSubscribe, onSuccess, onComplete, onError,
    } = cleanObserver(observer);

    const controller = new AbortController();

    onSubscribe(controller);

    const { signal } = controller;

    if (signal.aborted) {
      return;
    }

    const { source, predicate } = this;

    source.subscribeWith({
      onSubscribe(ac) {
        signal.addEventListener('abort', () => ac.abort());
      },
      onComplete() {
        onComplete();
        controller.abort();
      },
      onSuccess(x) {
        let result;

        try {
          result = predicate(x);
        } catch (e) {
          onError(e);
          controller.abort();
          return;
        }

        if (result) {
          onSuccess(x);
        } else {
          onComplete();
        }
        controller.abort();
      },
      onError(x) {
        onError(x);
        controller.abort();
      },
    });
  }

  /**
   * @ignore
   */
  var filter = (source, predicate) => {
    if (!isFunction(predicate)) {
      return source;
    }

    const maybe = new Maybe(subscribeActual$l);
    maybe.source = source;
    maybe.predicate = predicate;
    return maybe;
  };

  /**
   * @ignore
   */
  function subscribeActual$m(observer) {
    const {
      onSubscribe, onComplete, onError, onSuccess,
    } = cleanObserver(observer);

    const controller = new AbortController();

    const { signal } = controller;

    onSubscribe(controller);

    if (signal.aborted) {
      return;
    }

    const { mapper, source } = this;

    source.subscribeWith({
      onSubscribe(ac) {
        signal.addEventListener('abort', () => ac.abort());
      },
      onComplete() {
        onComplete();
        controller.abort();
      },
      onSuccess(x) {
        let result;
        try {
          result = mapper(x);

          if (!(result instanceof Maybe)) {
            throw new Error('Maybe.flatMap: mapper returned a non-Maybe');
          }
        } catch (e) {
          onError(e);
          return;
        }
        result.subscribeWith({
          onSubscribe(ac) {
            signal.addEventListener('abort', () => ac.abort());
          },
          onComplete() {
            onComplete();
            controller.abort();
          },
          onSuccess(v) {
            onSuccess(v);
            controller.abort();
          },
          onError(v) {
            onError(v);
            controller.abort();
          },
        });
      },
      onError(v) {
        onError(v);
        controller.abort();
      },
    });
  }

  /**
   * @ignore
   */
  var flatMap = (source, mapper) => {
    if (!isFunction(mapper)) {
      return source;
    }

    const maybe = new Maybe(subscribeActual$m);
    maybe.source = source;
    maybe.mapper = mapper;
    return maybe;
  };

  /**
   * @ignore
   */
  function subscribeActual$n(observer) {
    const {
      onSuccess, onComplete, onError, onSubscribe,
    } = cleanObserver(observer);

    const controller = new AbortController();

    onSubscribe(controller);

    if (controller.signal.aborted) {
      return;
    }

    this.promise.then(
      x => (x == null ? onComplete() : onSuccess(x)),
      onError,
    );
  }
  /**
   * @ignore
   */
  var fromPromise = (promise) => {
    if (!isPromise(promise)) {
      return error(new Error('Maybe.fromPromise: expects a Promise-like value.'));
    }
    const maybe = new Maybe(subscribeActual$n);
    maybe.promise = promise;
    return maybe;
  };

  /**
   * @ignore
   */
  function subscribeActual$o(observer) {
    const obs = cleanObserver(observer);
    const {
      onSuccess, onComplete, onError, onSubscribe,
    } = obs;

    const controller = new AbortController();

    onSubscribe(controller);

    if (controller.signal.aborted) {
      return;
    }

    let result;
    try {
      result = this.callable();
    } catch (e) {
      onError(e);
      return;
    }

    if (isPromise(result)) {
      fromPromise(result).subscribeWith(obs);
    } else if (result == null) {
      onComplete();
    } else {
      onSuccess(result);
    }
  }
  /**
   * @ignore
   */
  var fromCallable = (callable) => {
    if (!isFunction(callable)) {
      return error(new Error('Maybe.fromCallable: callable received is not a function.'));
    }
    const maybe = new Maybe(subscribeActual$o);
    maybe.callable = callable;
    return maybe;
  };

  function subscribeActual$p(observer) {
    const {
      onSuccess, onComplete, onError, onSubscribe,
    } = cleanObserver(observer);

    const controller = new AbortController();

    onSubscribe(controller);

    if (controller.signal.aborted) {
      return;
    }

    this.controller = controller;
    this.onComplete = onComplete;
    this.onSuccess = onSuccess;
    this.onError = onError;

    const resolveNone = onCompleteHandler.bind(this);
    const resolve = onSuccessHandler.bind(this);
    const reject = onErrorHandler.bind(this);

    this.subscriber(x => (x == null ? resolveNone() : resolve(x)), reject);
  }
  /**
   * @ignore
   */
  var fromResolvable = (subscriber) => {
    if (!isFunction(subscriber)) {
      return error(new Error('Maybe.fromResolvable: expects a function.'));
    }
    const maybe = new Maybe(subscribeActual$p);
    maybe.subscriber = subscriber;
    return maybe;
  };

  /**
   * @ignore
   */
  function subscribeActual$q(observer) {
    immediateSuccess(observer, this.value);
  }
  /**
   * @ignore
   */
  var just = (value) => {
    if (value == null) {
      return error(new Error('Maybe.just: received a null value.'));
    }
    const maybe = new Maybe(subscribeActual$q);
    maybe.value = value;
    return maybe;
  };

  /**
   * @ignore
   */
  function subscribeActual$r(observer) {
    let result;

    try {
      result = this.operator(observer);

      if (!isObserver(result)) {
        throw new Error('Maybe.lift: operator returned a non-Observer.');
      }
    } catch (e) {
      immediateError(observer, e);
      return;
    }

    this.source.subscribeWith(result);
  }

  /**
   * @ignore
   */
  var lift = (source, operator) => {
    if (typeof operator !== 'function') {
      return source;
    }

    const maybe = new Maybe(subscribeActual$r);
    maybe.source = source;
    maybe.operator = operator;
    return maybe;
  };

  /**
   * @ignore
   */
  const defaultMapper = x => x;

  /**
   * @ignore
   */
  function subscribeActual$s(observer) {
    const {
      onSuccess, onComplete, onError, onSubscribe,
    } = cleanObserver(observer);

    const { mapper } = this;

    this.source.subscribeWith({
      onSubscribe,
      onSuccess(x) {
        let result;
        try {
          result = mapper(x);
          if (result == null) {
            throw new Error('Maybe.map: mapper function returned a null value.');
          }
        } catch (e) {
          onError(e);
          return;
        }
        onSuccess(result);
      },
      onComplete,
      onError,
    });
  }
  /**
   * @ignore
   */
  var map = (source, mapper) => {
    let ms = mapper;
    if (!isFunction(mapper)) {
      ms = defaultMapper;
    }

    const maybe = new Maybe(subscribeActual$s);
    maybe.source = source;
    maybe.mapper = ms;
    return maybe;
  };

  /**
   * @ignore
   */
  function subscribeActual$t(observer) {
    const {
      onSubscribe, onComplete, onError, onSuccess,
    } = cleanObserver(observer);

    const controller = new AbortController();

    const { signal } = controller;

    onSubscribe(controller);

    if (signal.aborted) {
      return;
    }

    this.source.subscribeWith({
      onSubscribe(ac) {
        signal.addEventListener('abort', () => ac.abort());
      },
      onComplete() {
        onComplete();
        controller.abort();
      },
      onSuccess(x) {
        let result = x;
        if (!(x instanceof Maybe)) {
          result = error(new Error('Maybe.merge: source emitted a non-Maybe value.'));
        }
        result.subscribeWith({
          onSubscribe(ac) {
            signal.addEventListener('abort', () => ac.abort());
          },
          onComplete() {
            onComplete();
            controller.abort();
          },
          onSuccess(v) {
            onSuccess(v);
            controller.abort();
          },
          onError(v) {
            onError(v);
            controller.abort();
          },
        });
      },
      onError(v) {
        onError(v);
        controller.abort();
      },
    });
  }

  /**
   * @ignore
   */
  var merge = (source) => {
    if (!(source instanceof Maybe)) {
      return error(new Error('Maybe.merge: source is not a Maybe.'));
    }

    const maybe = new Maybe(subscribeActual$t);
    maybe.source = source;
    return maybe;
  };

  function subscribeActual$u(observer) {
    const {
      onSuccess, onComplete, onError, onSubscribe,
    } = cleanObserver(observer);

    const { source, item } = this;

    source.subscribeWith({
      onSubscribe,
      onComplete,
      onSuccess,
      onError(x) {
        let result;
        try {
          result = item(x);
        } catch (e) {
          onError([x, e]);
          return;
        }
        if (result) {
          onComplete();
        } else {
          onError(x);
        }
      },
    });
  }
  /**
   * @ignore
   */
  var onErrorComplete = (source, item) => {
    if (!isFunction(item)) {
      return source;
    }

    const maybe = new Maybe(subscribeActual$u);
    maybe.source = source;
    maybe.item = item;
    return maybe;
  };

  function subscribeActual$v(observer) {
    const {
      onSuccess, onComplete, onError, onSubscribe,
    } = cleanObserver(observer);

    const { source, resumeIfError } = this;

    const controller = new AbortController();

    const { signal } = controller;

    onSubscribe(controller);

    if (signal.aborted) {
      return;
    }

    source.subscribeWith({
      onSubscribe(ac) {
        signal.addEventListener('abort', () => ac.abort());
      },
      onComplete() {
        onComplete();
        controller.abort();
      },
      onSuccess(x) {
        onSuccess(x);
        controller.abort();
      },
      onError(x) {
        let result;

        if (isFunction(resumeIfError)) {
          try {
            result = resumeIfError(x);
            if (result == null) {
              throw new Error('Maybe.onErrorResumeNext: returned an non-Maybe.');
            }
          } catch (e) {
            onError(new Error([x, e]));
            return;
          }
        } else {
          result = resumeIfError;
        }

        result.subscribeWith({
          onSubscribe(ac) {
            signal.addEventListener('abort', () => ac.abort());
          },
          onComplete() {
            onComplete();
            controller.abort();
          },
          onSuccess(v) {
            onSuccess(v);
            controller.abort();
          },
          onError(v) {
            onError(v);
            controller.abort();
          },
        });
      },
    });
  }
  /**
   * @ignore
   */
  var onErrorResumeNext = (source, resumeIfError) => {
    if (!(isFunction(resumeIfError) || resumeIfError instanceof Maybe)) {
      return source;
    }

    const maybe = new Maybe(subscribeActual$v);
    maybe.source = source;
    maybe.resumeIfError = resumeIfError;
    return maybe;
  };

  function subscribeActual$w(observer) {
    const {
      onSuccess, onComplete, onError, onSubscribe,
    } = cleanObserver(observer);

    const { source, item } = this;

    source.subscribeWith({
      onSubscribe,
      onComplete,
      onSuccess,
      onError(x) {
        let result;

        try {
          result = item(x);
        } catch (e) {
          onError([x, e]);
          return;
        }
        if (result == null) {
          onComplete();
        } else {
          onSuccess(result);
        }
      },
    });
  }
  /**
   * @ignore
   */
  var onErrorReturn = (source, item) => {
    if (!isFunction(item)) {
      return source;
    }

    const maybe = new Maybe(subscribeActual$w);
    maybe.source = source;
    maybe.item = item;
    return maybe;
  };

  function subscribeActual$x(observer) {
    const { onSuccess, onComplete, onSubscribe } = cleanObserver(observer);

    const { source, item } = this;

    source.subscribeWith({
      onSubscribe,
      onComplete,
      onSuccess,
      onError() {
        onSuccess(item);
      },
    });
  }
  /**
   * @ignore
   */
  var onErrorReturnItem = (source, item) => {
    if (item == null) {
      return source;
    }

    const maybe = new Maybe(subscribeActual$x);
    maybe.source = source;
    maybe.item = item;
    return maybe;
  };

  /* eslint-disable class-methods-use-this */

  const SIGNAL = {
    aborted: false,
    addEventListener: () => {},
    removeEventListener: () => {},
    onabort: () => {},
  };


  const CONTROLLER = {
    signal: SIGNAL,
    abort: () => {},
  };

  /**
   * @ignore
   */
  function subscribeActual$y(observer) {
    observer.onSubscribe(CONTROLLER);
  }
  /**
   * @ignore
   */
  let INSTANCE$1;
  /**
   * @ignore
   */
  var never = () => {
    if (typeof INSTANCE$1 === 'undefined') {
      INSTANCE$1 = new Maybe(subscribeActual$y);
      INSTANCE$1.subscribeActual = subscribeActual$y.bind(INSTANCE$1);
    }
    return INSTANCE$1;
  };

  /**
   * @ignore
   */
  function subscribeActual$z(observer) {
    const {
      onSubscribe, onComplete, onSuccess, onError,
    } = cleanObserver(observer);

    const controller = new AbortController();

    const { signal } = controller;

    onSubscribe(controller);

    if (signal.aborted) {
      return;
    }

    const { source, bipredicate } = this;

    let retries = 0;

    const sub = () => {
      if (signal.aborted) {
        return;
      }
      retries += 1;

      source.subscribeWith({
        onSubscribe(ac) {
          signal.addEventListener('abort', () => ac.abort());
        },
        onComplete() {
          onComplete();
          controller.abort();
        },
        onSuccess(x) {
          onSuccess(x);
          controller.abort();
        },
        onError(x) {
          if (isFunction(bipredicate)) {
            const result = bipredicate(retries, x);

            if (result) {
              sub();
            } else {
              onError(x);
              controller.abort();
            }
          } else {
            sub();
          }
        },
      });
    };

    sub();
  }

  /**
   * @ignore
   */
  var retry = (source, bipredicate) => {
    const maybe = new Maybe(subscribeActual$z);
    maybe.source = source;
    maybe.bipredicate = bipredicate;
    return maybe;
  };

  function subscribeActual$A(observer) {
    const {
      onSubscribe, onSuccess, onComplete, onError,
    } = cleanObserver(observer);

    const controller = new AbortController();

    onSubscribe(controller);

    const { signal } = controller;

    if (signal.aborted) {
      return;
    }

    const { source, other } = this;

    source.subscribeWith({
      onSubscribe(ac) {
        signal.addEventListener('abort', () => ac.abort());
      },
      onSuccess(x) {
        onSuccess(x);
        controller.abort();
      },
      onComplete() {
        other.subscribeWith({
          onSubscribe(ac) {
            signal.addEventListener('abort', () => ac.abort());
          },
          onSuccess(x) {
            onSuccess(x);
            controller.abort();
          },
          onComplete() {
            onComplete();
            controller.abort();
          },
          onError(x) {
            onError(x);
            controller.abort();
          },
        });
      },
      onError(x) {
        onError(x);
        controller.abort();
      },
    });
  }

  /**
   * @ignore
   */
  var switchIfEmpty = (source, other) => {
    if (!(other instanceof Maybe)) {
      return source;
    }

    const maybe = new Maybe(subscribeActual$A);
    maybe.source = source;
    maybe.other = other;

    return maybe;
  };

  /**
   * @ignore
   */
  function subscribeActual$B(observer) {
    const {
      onSubscribe, onComplete, onSuccess, onError,
    } = cleanObserver(observer);

    const controller = new AbortController();

    const { signal } = controller;

    onSubscribe(controller);

    if (signal.aborted) {
      return;
    }

    const { source, other } = this;

    other.subscribeWith({
      onSubscribe(ac) {
        signal.addEventListener('abort', () => ac.abort());
      },
      onComplete() {
        onError(new Error('Maybe.takeUntil: Source cancelled by other Maybe.'));
        controller.abort();
      },
      onSuccess() {
        onError(new Error('Maybe.takeUntil: Source cancelled by other Maybe.'));
        controller.abort();
      },
      onError(x) {
        onError(new Error(['Maybe.takeUntil: Source cancelled by other Maybe.', x]));
        controller.abort();
      },
    });

    source.subscribeWith({
      onSubscribe(ac) {
        if (signal.aborted) {
          ac.abort();
        } else {
          signal.addEventListener('abort', () => ac.abort());
        }
      },
      onComplete() {
        onComplete();
        controller.abort();
      },
      onSuccess(x) {
        onSuccess(x);
        controller.abort();
      },
      onError(x) {
        onError(x);
        controller.abort();
      },
    });
  }

  /**
   * @ignore
   */
  const takeUntil = (source, other) => {
    if (!(other instanceof Maybe)) {
      return source;
    }

    const maybe = new Maybe(subscribeActual$B);
    maybe.source = source;
    maybe.other = other;
    return maybe;
  };

  /**
   * @ignore
   */
  function subscribeActual$C(observer) {
    const { onSuccess, onSubscribe } = cleanObserver(observer);


    const controller = new AbortController();

    const { signal } = controller;

    onSubscribe(controller);

    if (signal.aborted) {
      return;
    }

    const timeout = setTimeout(onSuccess, this.amount, 0);

    signal.addEventListener('abort', () => {
      clearTimeout(timeout);
    });
  }
  /**
   * @ignore
   */
  var timer = (amount) => {
    if (!isNumber(amount)) {
      return error(new Error('Maybe.timer: "amount" is not a number.'));
    }
    const maybe = new Maybe(subscribeActual$C);
    maybe.amount = amount;
    return maybe;
  };

  /**
   * @ignore
   */
  function subscribeActual$D(observer) {
    const {
      onSuccess, onComplete, onError, onSubscribe,
    } = cleanObserver(observer);

    const { amount } = this;

    const controller = new AbortController();

    const { signal } = controller;

    onSubscribe(controller);

    if (signal.aborted) {
      return;
    }

    const timeout = setTimeout(
      () => {
        onError(new Error('Maybe.timeout: TimeoutException (no success/completion signals within the specified timeout).'));
        controller.abort();
      },
      amount,
    );

    signal.addEventListener('abort', () => {
      clearTimeout(timeout);
    });

    this.source.subscribeWith({
      onSubscribe(ac) {
        signal.addEventListener('abort', () => ac.abort());
      },
      onComplete() {
        onComplete();
        controller.abort();
      },
      onSuccess(x) {
        onSuccess(x);
        controller.abort();
      },
      onError(x) {
        onError(x);
        controller.abort();
      },
    });
  }
  /**
   * @ignore
   */
  var timeout = (source, amount) => {
    if (!isNumber(amount)) {
      return source;
    }
    const maybe = new Maybe(subscribeActual$D);
    maybe.source = source;
    maybe.amount = amount;
    return maybe;
  };

  /* eslint-disable no-loop-func */

  const defaultZipper = x => x;
  /**
   * @ignore
   */
  function subscribeActual$E(observer) {
    const {
      onSuccess, onComplete, onError, onSubscribe,
    } = cleanObserver(observer);

    const result = [];

    const controller = new AbortController();

    const { signal } = controller;

    onSubscribe(controller);

    if (signal.aborted) {
      return;
    }

    const { sources, zipper } = this;

    const size = sources.length;

    if (size === 0) {
      onError(new Error('Maybe.zip: empty iterable'));
      controller.abort();
      return;
    }
    let pending = size;

    for (let i = 0; i < size; i += 1) {
      if (signal.aborted) {
        return;
      }
      const maybe = sources[i];

      if (maybe instanceof Maybe) {
        maybe.subscribeWith({
          onSubscribe(ac) {
            signal.addEventListener('abort', () => ac.abort());
          },
          onComplete() {
            onComplete();
            controller.abort();
          },
          onSuccess(x) {
            if (signal.aborted) {
              return;
            }
            result[i] = x;
            pending -= 1;
            if (pending === 0) {
              let r;
              try {
                r = zipper(result);
                if (r == null) {
                  throw new Error('Maybe.zip: zipper function returned a null value.');
                }
              } catch (e) {
                onError(e);
                controller.abort();
                return;
              }
              onSuccess(r);
              controller.abort();
            }
          },
          onError(x) {
            onError(x);
            controller.abort();
          },
        });
      } else if (maybe != null) {
        result[i] = maybe;
        pending -= 1;
      } else {
        onError(new Error('Maybe.zip: One of the sources is undefined.'));
        controller.abort();
        break;
      }
    }
  }
  /**
   * @ignore
   */
  var zip = (sources, zipper) => {
    if (!isIterable(sources)) {
      return error(new Error('Maybe.zip: sources is not Iterable.'));
    }
    let fn = zipper;
    if (!isFunction(zipper)) {
      fn = defaultZipper;
    }
    const maybe = new Maybe(subscribeActual$E);
    maybe.sources = sources;
    maybe.zipper = fn;
    return maybe;
  };

  /**
   * @ignore
   */
  const defaultZipper$1 = (x, y) => [x, y];
  /**
   * @ignore
   */
  function subscribeActual$F(observer) {
    const {
      onSuccess, onComplete, onError, onSubscribe,
    } = cleanObserver(observer);

    let SA;
    let SB;

    const controller = new AbortController();

    const { signal } = controller;

    onSubscribe(controller);

    if (signal.aborted) {
      return;
    }

    const { source, other, zipper } = this;

    source.subscribeWith({
      onSubscribe(ac) {
        signal.addEventListener('abort', () => ac.abort());
      },
      onComplete() {
        onComplete();
        controller.abort();
      },
      onSuccess(x) {
        if (signal.aborted) {
          return;
        }
        SA = x;

        if (SB != null) {
          let result;

          try {
            result = zipper(SA, SB);

            if (result == null) {
              throw new Error('Maybe.zipWith: zipper function returned a null value.');
            }
          } catch (e) {
            onError(e);
            controller.abort();
            return;
          }
          onSuccess(result);
          controller.abort();
        }
      },
      onError(x) {
        onError(x);
        controller.abort();
      },
    });

    other.subscribeWith({
      onSubscribe(ac) {
        if (signal.aborted) {
          ac.abort();
        } else {
          signal.addEventListener('abort', () => ac.abort());
        }
      },
      onComplete() {
        onComplete();
        controller.abort();
      },
      onSuccess(x) {
        if (signal.aborted) {
          return;
        }
        SB = x;

        if (SA != null) {
          let result;

          try {
            result = zipper(SA, SB);

            if (result == null) {
              throw new Error('Maybe.zipWith: zipper function returned a null value.');
            }
          } catch (e) {
            onError(e);
            controller.abort();
            return;
          }
          onSuccess(result);
          controller.abort();
        }
      },
      onError(x) {
        onError(x);
        controller.abort();
      },
    });
  }
  /**
   * @ignore
   */
  var zipWith = (source, other, zipper) => {
    if (!(other instanceof Maybe)) {
      return source;
    }
    let fn = zipper;
    if (!isFunction(zipper)) {
      fn = defaultZipper$1;
    }
    const maybe = new Maybe(subscribeActual$F);
    maybe.source = source;
    maybe.other = other;
    maybe.zipper = fn;
    return maybe;
  };

  /* eslint-disable import/no-cycle */

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
   * The Maybe class represents a deferred computation and emission of a single value,
   * no value at all or an exception.
   *
   * The Maybe class default consumer type it interacts with is the Observer via the
   * subscribe(Observer) method.
   *
   * The Maybe operates with the following sequential protocol:
   *
   * onSubscribe (onSuccess | onError | onComplete)?
   *
   * Note that onSuccess, onError and onComplete are mutually exclusive events;
   * unlike Observable, onSuccess is never followed by onError or onComplete.
   *
   * Like Observable, a running Maybe can be stopped through the AbortController instance
   * provided to consumers through Observer.onSubscribe(AbortController).
   *
   * Like an Observable, a Maybe is lazy, can be either "hot" or "cold", synchronous or
   * asynchronous.
   *
   * The documentation for this class makes use of marble diagrams. The following
   * legend explains these diagrams:
   *
   * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-maybe/master/assets/images/maybe.png" class="diagram">
   */
  class Maybe {
    /**
     * @ignore
     */
    constructor(subscribeActual) {
      /**
       * @ignore
       */
      this.subscribeActual = subscribeActual;
    }

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
     * Mirrors the Maybe (current or provided) that
     * first signals an event.
     * @param {!Maybe} other
     * a Maybe competing to react first. A subscription
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
     * @param {!function():Maybe} supplier
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

    /**
     * Calls the specified action after this Maybe signals onSuccess,
     * onError or onComplete or gets aborted by the downstream.
     *
     * In case of a race between a terminal event and a abort call,
     * the provided onFinally action is executed once per subscription.
     *
     * @param {!function} action
     * the action called when this Maybe terminates or gets aborted
     * @returns {Maybe}
     */
    doFinally(action) {
      return doFinally(this, action);
    }

    /**
     * Calls the shared action if an Observer subscribed to the current
     * Maybe aborts the common AbortController it received via onSubscribe.
     *
     * @param {!function} action
     * the action called when the subscription is aborted
     * @returns {Maybe}
     */
    doOnAbort(action) {
      return doOnAbort(this, action);
    }

    /**
     * Modifies the source Maybe so that it invokes an action when it calls
     * onComplete.
     * @param {!function} action
     * the action to invoke when the source Maybe calls onComplete.
     * @returns {Maybe}
     * the new Maybe with the side-effecting behavior applied.
     */
    doOnComplete(action) {
      return doOnComplete(this, action);
    }

    /**
     * Calls the shared consumer with the error sent via onError for each
     * Observer that subscribes to the current Maybe.
     * @param {!function(e: Error)} consumer
     * the consumer called with the success value of onError
     * @returns {Maybe}
     */
    doOnError(consumer) {
      return doOnError(this, consumer);
    }

    /**
     * Calls the given onEvent callback with the (success value, null) for
     * an onSuccess, (null, throwable) for an onError or (null, null) for
     * an onComplete signal from this Maybe before delivering said signal to the downstream.
     * @param {!function(success: any, e: Error)} biconsumer
     * the callback to call with the terminal event tuple
     * @returns {Maybe}
     */
    doOnEvent(biconsumer) {
      return doOnEvent(this, biconsumer);
    }

    /**
     * Calls the shared consumer with the AbortController sent through
     * the onSubscribe for each Observer that subscribes to the current Maybe.
     *
     * @param {!function(ac: AbortController)} consumer
     * the consumer called with the AbortController sent via onSubscribe
     * @returns {Maybe}
     */
    doOnSubscribe(consumer) {
      return doOnSubscribe(this, consumer);
    }

    /**
     * Calls the shared consumer with the success value sent via onSuccess
     * for each Observer that subscribes to the current Maybe.
     *
     * @param {!function(success: any)} consumer
     * the consumer called with the success value of onSuccess
     * @returns {Maybe}
     */
    doOnSuccess(consumer) {
      return doOnSuccess(this, consumer);
    }

    /**
     * Returns a Maybe instance that calls the given onTerminate callback
     * just before this Maybe completes normally or with an exception.
     *
     * This differs from doAfterTerminate in that this happens before
     * the onComplete or onError notification.
     * @param {!function} action
     * the action to invoke when the consumer calls onComplete or onError
     * @returns {Maybe}
     */
    doOnTerminate(action) {
      return doOnTerminate(this, action);
    }

    /**
     * Returns a (singleton) Maybe instance that calls onComplete immediately.
     * @returns {Maybe}
     */
    static empty() {
      return empty();
    }

    /**
     * Returns a Maybe that invokes a subscriber's onError method when
     * the subscriber subscribes to it.
     * @param {!(function():Error|Error)} err
     * - the callable that is called for each individual
     * Observer and returns or throws a value to be emitted.
     * - the particular value to pass to onError
     * @returns {Maybe}
     * a Maybe that invokes the subscriber's onError method when the
     * subscriber subscribes to it
     */
    static error(err) {
      return error(err);
    }

    /**
     * Filters the success item of the Maybe via a predicate function
     * and emitting it if the predicate returns true, completing otherwise.
     * @param {!function(x: any):boolean} predicate
     * a function that evaluates the item emitted by the source Maybe,
     * returning true if it passes the filter
     * @returns {Maybe}
     * a Maybe that emit the item emitted by the source Maybe that the filter
     * evaluates as true
     */
    filter(predicate) {
      return filter(this, predicate);
    }

    /**
     * Returns a Maybe that is based on applying a specified function to the
     * item emitted by the source Maybe, where that function returns a Maybe.
     * @param {!function(x: any):Maybe} mapper
     * a function that, when applied to the item emitted by the source Maybe,
     * returns a Maybe.
     * @returns {Maybe}
     * the Maybe returned from mapper when applied to the item emitted by the
     * source Maybe
     */
    flatMap(mapper) {
      return flatMap(this, mapper);
    }

    /**
     * Returns a Maybe that invokes the given callable for each individual
     * Observer that subscribes and emits the resulting non-null item via
     * onSuccess while considering a null result from the callable as
     * indication for valueless completion via onComplete.
     *
     * This operator allows you to defer the execution of the given Callable
     * until a Observer subscribes to the returned Maybe. In other terms,
     * this source operator evaluates the given callable "lazily"
     *
     * If the result is a Promise-like instance, the
     * Observer is then subscribed to the Promise through
     * the fromPromise operator.
     *
     * @param {!function():any} callable
     * a callable instance whose execution should be deferred and performed
     * for each individual Observer that subscribes to the returned Maybe.
     * @returns {Maybe}
     */
    static fromCallable(callable) {
      return fromCallable(callable);
    }

    /**
     * Converts a Promise-like instance into a Maybe.
     *
     * @param {!(Promise|Thennable|PromiseLike)} promise
     * The promise to be converted into a Maybe.
     * @returns {Maybe}
     */
    static fromPromise(promise) {
      return fromPromise(promise);
    }

    /**
     * Provides a Promise-like interface for emitting signals.
     *
     * @param {!function(resolve: function, reject:function))} fulfillable
     * A function that accepts two parameters: resolve and reject,
     * similar to a Promise construct.
     * @returns {Maybe}
     */
    static fromResolvable(fulfillable) {
      return fromResolvable(fulfillable);
    }

    /**
     * Returns a Maybe that emits a specified item.
     * @param {!any} value
     * the item to emit
     * @returns {Maybe}
     * a Maybe that emits item
     */
    static just(value) {
      return just(value);
    }

    /**
     * This method requires advanced knowledge about building operators,
     * please consider other standard composition methods first;
     *
     * Returns a Maybe which, when subscribed to, invokes the operator
     * method of the provided Observer for each individual downstream Maybe
     * and allows the insertion of a custom operator by accessing the
     * downstream's Observer during this subscription phase and providing a new
     * Observer, containing the custom operator's intended business logic,
     * that will be used in the subscription process going further upstream.
     *
     * Generally, such a new Observer will wrap the downstream's Observer
     * and forwards the onSuccess, onError and onComplete events from the
     * upstream directly or according to the emission pattern the custom
     * operator's business logic requires. In addition, such operator can
     * intercept the flow control calls of abort and signal.aborted that
     * would have traveled upstream and perform additional actions
     * depending on the same business logic requirements.
     *
     * Note that implementing custom operators via this lift()
     * method adds slightly more overhead by requiring an additional
     * allocation and indirection per assembled flows. Instead,
     * using compose() method and  creating a transformer function
     * with it is recommended.
     *
     * @param {!function(observer: Observer):Observer} operator
     * the function that receives the downstream's Observer and should
     * return a Observer with custom behavior to be used as the consumer
     * for the current Maybe.
     * @returns {Maybe}
     */
    lift(operator) {
      return lift(this, operator);
    }

    /**
     * Returns a Maybe that applies a specified function to the item
     * emitted by the source Maybe and emits the result of this function
     * application.
     *
     * @param {!function} mapper
     * a function to apply to the item emitted by the Maybe
     * @returns {Maybe}
     * a Maybe that emits the item from the source Maybe, transformed by
     * the specified function
     */
    map(mapper) {
      return map(this, mapper);
    }


    /**
     * Flattens a Maybe that emits a Maybe into a single Maybe that emits
     * the item emitted by the nested Maybe, without any transformation.
     *
     * @param {!Maybe} source
     * a Maybe that emits a Maybe
     * @returns {Maybe}
     * a Maybe that emits the item that is the result of flattening the
     * Maybe emitted by source
     */
    static merge(source) {
      return merge(source);
    }

    /**
     * Returns a Maybe that never sends any items or notifications to a
     * Observer.
     *
     * @returns {Maybe}
     * a Maybe that never emits any items or sends any notifications to a
     * Observer
     */
    static never() {
      return never();
    }

    /**
     * Returns a Maybe instance that if this Maybe emits an
     * error and the predicate returns true, it will emit an onComplete
     * and swallow the throwable.
     *
     * If no predicate is provided, returns a Maybe instance that
     * if this Maybe emits an error, it will emit an onComplete
     * and swallow the error
     *
     * @param {function(e: Error):boolean} predicate
     * the predicate to call when an Error is emitted which should return true
     * if the Error should be swallowed and replaced with an onComplete.
     * @returns {Maybe}
     */
    onErrorComplete(predicate) {
      return onErrorComplete(this, predicate);
    }

    /**
     * Instructs a Maybe to pass control to another Maybe rather than
     * invoking onError if it encounters an error.
     *
     * @param {!function(e: Error):Maybe|Maybe} other
     * - the next Maybe that will take over if the source Maybe encounters an error
     * - a function that returns a Maybe that will take over if the source Maybe encounters an error
     * @returns {Maybe}
     */
    onErrorResumeNext(other) {
      return onErrorResumeNext(this, other);
    }

    /**
     * Instructs a Maybe to emit an item (returned by a specified function)
     * rather than invoking onError if it encounters an error.
     * @param {!function(e: Error):Maybe} supplier
     * a function that returns a single value that will be emitted as success value
     * the current Maybe signals an onError event
     * @returns {Maybe}
     */
    onErrorReturn(supplier) {
      return onErrorReturn(this, supplier);
    }

    /**
     * Instructs a Maybe to emit an item (returned by a specified function)
     * rather than invoking onError if it encounters an error.
     * @param {any} value
     * the value that is emitted as onSuccess in case this Maybe signals an onError
     * @returns {Maybe}
     */
    onErrorReturnItem(value) {
      return onErrorReturnItem(this, value);
    }

    /**
     * Returns a Maybe that mirrors the source Maybe, resubscribing to it if it calls
     * onError and the predicate returns true for that specific exception and retry count.
     * @param {!function(retries: number, err: Error):boolean} bipredicate
     * the predicate that determines if a resubscription may happen in case of a
     * specific exception and retry count.
     * @returns {Maybe}
     */
    retry(bipredicate) {
      return retry(this, bipredicate);
    }

    /**
     * Returns a Maybe that emits the items emitted by the source Maybe or the items
     * of an alternate Maybe if the current Maybe is empty.
     * @param {Maybe} other
     * the alternate Maybe to subscribe to if the main does not emit any items
     * @returns {Maybe}
     * a Maybe that emits the items emitted by the source Maybe
     * or the items of an alternate Maybe if the source Maybe is empty.
     */
    switchIfEmpty(other) {
      return switchIfEmpty(this, other);
    }

    /**
     * Returns a Maybe that emits the items emitted by the source Maybe until
     * a second Maybe emits an item.
     * @param {Maybe} other
     * the Maybe whose first emitted item will cause takeUntil to stop
     * emitting items from the source Maybe
     * @returns {Maybe}
     * a Maybe that emits the items emitted by the source Maybe until
     * such time as other emits its first item
     */
    takeUntil(other) {
      return takeUntil(this, other);
    }

    /**
     * Returns a Maybe that mirrors the source Maybe but applies a
     * timeout policy for each emitted item. If the next item isn't
     * emitted within the specified timeout duration starting from its
     * predecessor, the resulting Maybe terminates and notifies Observer
     * of an Error with TimeoutException.
     *
     * @param {!number} amount
     * Amount of time in milliseconds
     * @returns {Maybe}
     */
    timeout(amount) {
      return timeout(this, amount);
    }

    /**
     * Returns a Maybe that emits 0L after a specified delay.
     * @param {!number} amount
     * Amount of time in milliseconds
     * @returns {Maybe}
     */
    static timer(amount) {
      return timer(amount);
    }

    /**
     * Returns a Maybe that emits the results of a specified combiner function
     * applied to combinations of items emitted, in sequence, by an Iterable of other
     * Maybes.
     * @param {!Iterable} sources
     * an Iterable of source Maybe
     * @param {?function(results: Array):any} zipper
     * a function that, when applied to an item emitted by each of the source Maybe,
     * results in an item that will be emitted by the resulting Maybe
     * @returns {Maybe}
     */
    static zip(sources, zipper) {
      return zip(sources, zipper);
    }

    /**
     * Waits until this and the other Maybe signal a success value then applies the
     * given function to those values and emits the function's resulting value to downstream.
     *
     * If either this or the other Maybe is empty or signals an error,
     * the resulting Maybe will terminate immediately and abort the other source.
     *
     * @param {Maybe} other
     * the other Maybe
     * @param {function(a: any, b: any):any} zipper
     * a function that combines the pairs of items from the two Maybe to
     * generate the items to be emitted by the resulting Maybe
     * @returns {Maybe}
     */
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
        this.subscribeActual.call(this, observer);
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
      this.subscribeWith({
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
        onComplete,
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

  /**
   * @interface
   * Represents an object that receives notification to
   * an Observer.
   *
   * Emitter is an abstraction layer of the Observer
   */

  /**
   * @interface
   * Represents an object that receives notification from
   * an Emitter.
   */

  /* eslint-disable no-unused-vars */

  return Maybe;

}(AbortController));
