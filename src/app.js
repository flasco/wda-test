
// const wda = require('wda-driver');
const wda = require('flasco_wda-driver');

// com.nhnent.SKQUEST 克鲁赛德战记
class App {
  async start() {
    const c = new wda.Client('http://localhost:8100');

    const s = await c.session('com.nhnent.SKQUEST');
    console.log(await s.orientation());
    await s.close();
  }
}

module.exports = new App();