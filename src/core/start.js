const BaseApp = require('./base');
const cv = require('opencv4nodejs');

const { isStart, isLoading_1 } = require('../assets');

const { delay } = require('../utils');

class StartApp extends BaseApp {
  constructor(props) {
    super(props);
    this.startFlag = cv.imread(isStart);
    this.loadingFlag1 = cv.imread(isLoading_1);
  }

  async start() {
    await this.couldStart();
  }

  async couldStart() {
    const img = await this.screenshot();
    const { simple } = this.judgeMatching(img, this.startFlag);

    if (simple > 0.8) {
      console.log('could start game!');
      await this.tap(this.width / 2, this.height / 2);
      await delay(1200);
      await this.isLoading();
    } else {
      console.log('看起来还不能启动，尝试休眠之后重新判断..');
      await delay(1000);
      await this.couldStart();
    }
  }

  async isLoading() {
    const img = await this.screenshot();
    const { simple } = this.judgeMatching(img, this.loadingFlag1);
    if (simple > 0.8) {
      console.log('正在转场加载，进入游戏成功！');
    } else {
      console.log('没有进入加载，重新点击一遍');
      await delay(700);
      await this.tap(this.width / 2, this.height / 2);
      await this.isLoading();
    }
  }
}

module.exports = StartApp;