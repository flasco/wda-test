const BaseApp = require('./base');
const cv = require('opencv4nodejs');

const { close_1, isLoading_1 } = require('../assets');

const { delay } = require('../utils');

class GameAtHome extends BaseApp {
  constructor(props) {
    super(props);
    this.closeFlag1 = cv.imread(close_1);
    this.loadingFlag1 = cv.imread(isLoading_1);
  }

  async start() {
    this.isLoading();
    this.needCloseWindow();
  }

  async needCloseWindow() {
    const img = await this.screenshot();
    const { simple, point: { x, y } } = this.judgeMatching(img, this.closeFlag1);
    if (simple > 0.8) {
      console.log('需要关闭窗口...');
      // {{0.0, 0.0}, {736.0, 414.0}}[0.00, 0.00] -> (382.6, 706.8)
      //  (391.0, 711.0)
      //tap [362.67, 586.67]
      await this.tapHold(x, y, 1, false);
      // await this.tapHold(x + 19, y + 19, false);
      await delay(400);
      await this.screenshot('test.png');
    }
  }

  async isLoading() {
    const img = await this.screenshot();
    const { simple } = this.judgeMatching(img, this.loadingFlag1);
    if (simple > 0.8) {
      console.log('正在转场加载！');
      await this.isLoading();
    } else {
      console.log('进入成功！');
      await await this.screenshot('test.png');
    }
  }
}

module.exports = GameAtHome;