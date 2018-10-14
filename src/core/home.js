const GameCommon = require('./game');
const cv = require('opencv4nodejs');

const { friends, isAtHome, exchange, exchange_disabled } = require('../assets');

class GameAtHome extends GameCommon {
  constructor(props) {
    super(props);
    this.isAtHomeFlag = cv.imread(isAtHome);
    this.friendsFlag = cv.imread(friends);
    this.exchangeFlag = cv.imread(exchange);
    this.exchangeDisabledFlag = cv.imread(exchange_disabled);
  }

  async start() {
    console.log('home check!');
    console.log('===========');
    await this.isAtHome();
    await this.friends();
  }

  async isAtHome() {
    const img = await this.screenshot();
    const { simple } = this.judgeMatching(img, this.isAtHomeFlag);
    if (simple > 0.8) {
      console.log('已经加载完成！');
    } else {
      console.log('未加载完成，检测中...');
      await this.isLoading();
      await this.needCloseWindow();
      await this.isAtHome();
    }
  }

  async friends() {
    const img = await this.screenshot();
    const { simple, point: { x, y } } = this.judgeMatching(img, this.friendsFlag);
    if (simple > 0.8) {
      // 可以点
      await this.tap(x, y, true);
      await this.isLoading();
      await this.exchangeHorner();
    }
  }

  async exchangeHorner() {
    const img = await this.screenshot();
    const { simple, point: { x, y } } = this.judgeMatching(img, this.exchangeFlag);
    if (simple > 0.8) {
      await this.tap(x, y, true, 100, 30);
      await this.isLoading();
      await this.needClickBtn();
      await this.isAtHome();
    }
    const result = this.judgeMatching(img, this.exchangeDisabledFlag);
    if (result.simple > 0.8) {
      console.log('已经交换过荣誉了');
      await this.isAtHome();
    } else {
      console.log('未知错误..');
      await this.screenshot(`${new Date().getTime()}.png`);
    }
  }
}

module.exports = GameAtHome;