
// const wda = require('wda-driver');
const wda = require('flasco_wda-driver');
const StartApp = require('./core/start');
const Horner = require('./core/home/horner');

// com.nhnent.SKQUEST 克鲁赛德战记
class App {
  async start() {
    const c = new wda.Client('http://localhost:8100');
    const sessionId = await c.startApp('com.nhnent.SKQUEST');
    // const sessionId = 'C419F809-46CB-41D6-B57D-36DCE22CB18F';
    const s = await c.quickSession(sessionId);

    const { width, height } = await s.getWindowSize();

    const props = {
      width,
      height,
      client: c,
      session: s,
    };

    const start = new StartApp(props);
    const exchange = new Horner(props);

    await start.start();
    await exchange.start();

  }
}

module.exports = new App();