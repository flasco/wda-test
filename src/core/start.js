const cv = require('opencv4nodejs');
const BaseGame = require('./base-game');

const { isStart } = require('../assets');

const { delay } = require('../utils');
const { LEVEL_INFO_MAP } = require('../constants');

class StartGame extends BaseGame {
  constructor(props) {
    super(props);
    this.startFlag = cv.imread(isStart);
  }

  async start() {
    this.log('start check!');
    this.log('===========');
    await this.couldStart();
  }

  async couldStart() {
    const img = await this.screenshot();
    const { simple } = this.judgeMatching(img, this.startFlag);

    if (simple > 0.8) {
      this.log('could start game!', LEVEL_INFO_MAP.success);
      await this.tap(this.width / 2, this.height / 2, true, 40);
      await delay(1200);
      await this.waitLoading();
    } else {
      this.log('loading, waiting...');
      await delay(1400);
      await this.couldStart();
    }
  }
}

module.exports = StartGame;
