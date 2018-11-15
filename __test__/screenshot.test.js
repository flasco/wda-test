
const wda = require('flasco_wda-driver');

async function test() {
  const c = new wda.Client('http://localhost:8100');
  const timex = new Date().getTime();
  await c.screenshot(`${timex}.png`);
}

test();