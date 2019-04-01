/* eslint-disable class-methods-use-this */
import Maybe from '../../maybe';

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
function subscribeActual(observer) {
  observer.onSubscribe(CONTROLLER);
}
/**
 * @ignore
 */
let INSTANCE;
/**
 * @ignore
 */
export default () => {
  if (typeof INSTANCE === 'undefined') {
    INSTANCE = new Maybe();
    INSTANCE.subscribeActual = subscribeActual.bind(INSTANCE);
  }
  return INSTANCE;
};
