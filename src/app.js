
// const wda = require('wda-driver');
const wda = require('flasco_wda-driver');

// const TimeDungeon = require('./core/dungeon/time');
// const Start = require('./core/start');
// const Breads = require('./core/home/breads');
const Honor = require('./core/home/honor');
// com.nhnent.SKQUEST 克鲁赛德战记
class App {
  async start() {
    const client = new wda.Client('http://localhost:8100');
    let {
      value: { bundleId },
      sessionId,
    } = await client.getActiveAppInfo();
    if (bundleId !== 'com.nhnent.SKQUEST') {
      sessionId = await client.startApp('com.nhnent.SKQUEST');
    }
    const session = await client.quickSession(sessionId);

    const { width, height } = await session.getWindowSize();

    const props = {
      width,
      height,
      client,
      session,
    };

    // const time = new TimeDungeon(props);
    // const start = new Start(props);
    const breads = new Honor(props);
    await breads.start();
  }
}

module.exports = new App();