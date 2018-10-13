const GameCommon = require('./game');
const cv = require('opencv4nodejs');

const { isStart } = require('../assets');

const { delay } = require('../utils');

class StartGame extends GameCommon {
  constructor(props) {
    super(props);
    this.startFlag = cv.imread(isStart);
  }

  async start() {
    console.log('start check!');
    console.log('===========');
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
}

module.exports = StartGame;