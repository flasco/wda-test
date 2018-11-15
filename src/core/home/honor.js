const BaseHome = require('./base-home');
const cv = require('opencv4nodejs');

const {
  friendsBtn,
  exchange,
  exchangeDisabled,
  yesBtn,
} = require('../../assets');
const { LEVEL_INFO_MAP } = require('../../constants');
const { delay } = require('../../utils');

class Honor extends BaseHome {
  static get uniqueId() {
    return 'home-Honor';
  }

  constructor(props) {
    super(props);
    this.friendsBtnFlag = cv.imread(friendsBtn);
    this.yesBtnFlag = cv.imread(yesBtn);
    this.exchangeFlag = cv.imread(exchange);
    this.exchangeDisabledFlag = cv.imread(exchangeDisabled);
  }

  async start() {
    this.log('Honor...');
    await this.returnHome();
    await this.openFriends();
    await this.exchangeHonor();
  }

  async clickYes() {
    await this.judgeClick(this.yesBtnFlag, 'yes_btn', 2);
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

  async exchangeHonor() {
    await this.waitLoading();
    const img = await this.screenshot();
    const {
      simple,
      point: { x, y },
    } = this.judgeMatching(img, this.exchangeFlag);
    if (simple > 0.8) {
      await this.tap(x, y, true, 100, 30);
      this.log('交换成功...', LEVEL_INFO_MAP.success);
      await delay(1200);
      await this.waitLoading();
      await this.clickYes();
      await this.returnHome();
    } else {
      const result = this.judgeMatching(img, this.exchangeDisabledFlag);
      if (result.simple > 0.8) {
        this.log('已经交换过荣誉了', LEVEL_INFO_MAP.warn);
        await this.returnHome();
      } else {
        this.log('未知错误..', LEVEL_INFO_MAP.error);
        await this.screenshot(`${new Date().getTime()}.png`);
      }
    }
  }
}

module.exports = Honor;
