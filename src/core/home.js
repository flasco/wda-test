const GameCommon = require('./game');
const cv = require('opencv4nodejs');

const { close_1, isLoadedFirst } = require('../assets');

const { delay } = require('../utils');

class GameAtHome extends GameCommon {
  constructor(props) {
    super(props);
    this.closeFlag1 = cv.imread(close_1);
    this.isLoadedFirstFlag = cv.imread(isLoadedFirst);
  }

  async start() {
    console.log('home check!');
    console.log('===========');
    await this.isLoadedFirst();
  }

  async isLoadedFirst() {
    const img = await this.screenshot();
    const { simple } = this.judgeMatching(img, this.isLoadedFirstFlag);
    if (simple > 0.8) {
      console.log('已经加载完成！');
    } else {
      console.log('未加载完成，检测中...');
      await this.isLoading();
      await this.needCloseWindow();
      await this.isLoadedFirst();
    }
  }

  async needCloseWindow() {
    const img = await this.screenshot();
    const { simple, point: { x, y } } = this.judgeMatching(img, this.closeFlag1);
    if (simple > 0.8) {
      console.log('需要关闭窗口...');
      await this.tap(x + 5, y + 3);
      await delay(400);
    }
  }
}

module.exports = GameAtHome;