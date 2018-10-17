const BaseHome = require('./baseHome');
const cv = require('opencv4nodejs');

const { friendsBtn, exchange, exchange_disabled } = require('../../assets');
const { LEVEL_INFO_MAP } = require('../../constants');

class GameAtHome extends BaseHome {
  constructor(props) {
    super(props);
    this.friendsBtnFlag = cv.imread(friendsBtn);
    this.exchangeFlag = cv.imread(exchange);
    this.exchangeDisabledFlag = cv.imread(exchange_disabled);
  }

  async start() {
    this.log('horner...');
    await this.returnHome();
    await this.openFriends();
    await this.exchangeHorner();
    await this.returnHome();
  }

  async openFriends() {
    const isAtHome = await this.isAtHome();
    if (isAtHome) {
      await this.waitLoading();
      await this.judgeClick(this.friendsBtnFlag);
    } else {
      this.log('当前不在家里', LEVEL_INFO_MAP.warn);
    }
  }

  async exchangeHorner() {
    await this.waitLoading();
    const img = await this.screenshot();
    const { simple, point: { x, y } } = this.judgeMatching(img, this.exchangeFlag);
    if (simple > 0.8) {
      await this.tap(x, y, true, 100, 30);
      this.log('交换成功...', LEVEL_INFO_MAP.success);
    }
    const result = this.judgeMatching(img, this.exchangeDisabledFlag);
    if (result.simple > 0.8) {
      this.log('已经交换过荣誉了', LEVEL_INFO_MAP.warn);
      await this.isAtHome();
    } else {
      this.log('未知错误..', LEVEL_INFO_MAP.error);
      await this.screenshot(`${new Date().getTime()}.png`);
    }
  }
}

module.exports = GameAtHome;