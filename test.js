const Maybe = require('./index');

const source = Maybe.error(new Error('Hello')).delay(100, true);
const controller = source.subscribe(
  () => console.log('Success'),
  () => console.log('Complete'),
  console.log,
);

controller.cancel();
if (controller.cancelled) {
  console.log('Sync Cancelled');
}
