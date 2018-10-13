
// const wda = require('wda-driver');
const wda = require('flasco_wda-driver');
const StartApp = require('./core/start');
const GameAtHome = require('./core/home');


// com.nhnent.SKQUEST 克鲁赛德战记
class App {
  async start() {
    const c = new wda.Client('http://localhost:8100');
    // 0ED53A48-CA24-455A-8093-153CC0D35330
    // const sessionId = await c.startApp('com.nhnent.SKQUEST');
    const sessionId = '5CFF61AC-F91F-4747-B126-ED4BEA721911';
    const s = await c.quickSession(sessionId);

    const { width, height } = await s.getWindowSize();

    const props = {
      width,
      height,
      client: c,
      session: s,
    };

    const start = new StartApp(props);
    const atHome = new GameAtHome(props);

    await start.start();
    await atHome.start();

    // console.log(await s.orientation());

    // await c.screenshot('test.png');

    // const mat = base642Mat(img);
    // cv.imshow('We\'ve found close!', mat);

    // cv.waitKey();


    // const s = await c.quickSession('0ED53A48-CA24-455A-8093-153CC0D35330');
    // console.log(await s.orientation());

    // console.log(await s.orientation());
    // await s.close();
    // console.log(await s.getWindowSize());
    // 横屏游戏 零点位于右上角
    // await s.tap(704, 10); // 关闭按钮
  }
}

module.exports = new App();