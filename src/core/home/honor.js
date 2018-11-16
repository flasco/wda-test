const BaseHome = require('./base-home');
const flagPool = require('../flag-pool');
const {
  friendsBtn,
  exchange,
  yesBtn,
  exchangeDisabled,
} = require('../../assets');
const { LEVEL_INFO_MAP } = require('../../constants');
const { delay } = require('../../utils');

class Honor extends BaseHome {
  static get uniqueId() {
    return 'home-Honor';
  }

  async start() {
    this.log('Honor...');
    await this.openFriends();
    await this.exchangeHonor();
  }

  async openFriends() {
    const img = await this.screenshot();
    const {
      simple,
      point: { x, y }
    } = this.judgeMatching(img, flagPool.getFlag(friendsBtn));

    if (simple > 0.8) {
      await this.tap(x, y, true);
    } else {
      this.log('没有找到好友按钮', LEVEL_INFO_MAP.warn);
    }
  }

  async exchangeHonor() {
    const img = await this.screenshot();
    const {
      simple,
      point: { x, y }
    } = this.judgeMatching(img, flagPool.getFlag(exchange));
    if (simple > 0.8) {
      await this.tap(x, y, true, 100, 30);
      this.log('交换成功...', LEVEL_INFO_MAP.success);
      await delay(1200);
      await this.waitLoading();
      await this.runClickFlagCnt(1, 3, flagPool.getFlag(yesBtn));
      await this.runClickFlagCnt(1, 3, flagPool.getFlag(this.closeFlag));
    } else {
      const result = this.judgeMatching(img, flagPool.getFlag(exchangeDisabled));
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
