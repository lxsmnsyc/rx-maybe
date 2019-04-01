import Maybe from '../../maybe';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const {
    onSubscribe, onComplete, onSuccess, onError,
  } = observer;

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
export default (source, callable) => {
  if (typeof callable !== 'function') {
    return source;
  }

  const single = new Maybe();
  single.source = source;
  single.callable = callable;
  single.subscribeActual = subscribeActual.bind(single);
  return single;
};
