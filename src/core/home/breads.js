const baseHome = require('./base-home');

const { breadBtn, getBreads, adBreads, adClose, isADLimit, adBreadYes, overload } = require('../../assets');
const { LEVEL_INFO_MAP } = require('../../constants');
const flagPool = require('../flag-pool');
const { delay } = require('../../utils');

class Breads extends baseHome {
  static get uniqueId() {
    return 'home-bread';
  }

  async start() {
    (await this.openBreads()) && (await this.adBreads());
  }

  async openBreads() {
    const img = await this.screenshot();
    const {
      simple,
      point: { x, y }
    } = this.judgeMatching(img, flagPool.getFlag(breadBtn));
    if (simple > 0.8) {
      await this.tap(x, y, true);
      return true;
    }
    this.log('没有找到面包按钮', LEVEL_INFO_MAP.warn);
  }

  async checkBreads() {
    await this.waitLoading();
    const img = await this.screenshot();
    const {
      simple,
      point: { x, y }
    } = this.judgeMatching(img, flagPool.getFlag(getBreads));
    if (simple > 0.8) {
      this.log('有面包可领');
      await this.tap(x, y, true);
    } else {
      this.log('面包还没好...', LEVEL_INFO_MAP.warn);
    }
  }

  async couldClose() {
    const img = await this.screenshot();
    const {
      simple,
      point: { x, y }
    } = this.judgeMatching(img, flagPool.getFlag(adClose));
    if (simple > 0.8) {
      this.log('广告终于好了..', LEVEL_INFO_MAP.success);
      await this.tap(x, y, true);
      await this.waitLoading();
      this.runClickFlagCnt(1, 3, flagPool.getFlag(adBreadYes)).then(() => this.adBreads());
    } else {
      this.log('再等等...', LEVEL_INFO_MAP.warn);
      setTimeout(() => this.couldClose(), 5000);
    }
  }

  async isOverload() {
    const img = await this.screenshot();
    const simple = await this.judgeSimple(img, flagPool.getFlag(overload));
    return simple > 0.9;
  }

  async adBreads() {
    await this.waitLoading();
    const img = await this.screenshot();
    const result = await this.judgeSimple(img, flagPool.getFlag(isADLimit));
    if (result > 0.95) {
      this.log('已经达到上限...', LEVEL_INFO_MAP.warn);
      await this.runClickFlagCnt(1, 3, flagPool.getFlag(this.closeFlag));
      return;
    }
    const {
      simple,
      point: { x, y }
    } = this.judgeMatching(img, flagPool.getFlag(adBreads));
    if (simple > 0.95) {
      this.log('开始看广告。。。', LEVEL_INFO_MAP.info);
      await this.tap(x, y, true);
      await delay(700);
      if (await this.isOverload()) {
        this.log('面包太多了...', LEVEL_INFO_MAP.warn);
        return;
      }
      // 这里不用await是为了防止长时间等待导致无响应
      delay(27000).then(() => this.couldClose());
    } else {
      this.log('没有找到按钮...', LEVEL_INFO_MAP.warn);
    }
  }
}

module.exports = Breads;
