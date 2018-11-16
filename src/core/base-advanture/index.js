const BaseGame = require('../base-game');
const flagPool = require('../flag-pool');
const { adventure1, adventure2 } = require('../../assets');
const { LEVEL_INFO_MAP } = require('../../constants');
const { delay } = require('../../utils');

class BaseAdvanture extends BaseGame {
  async cityOrGate(img = null) {
    if (img == null) img = await this.screenshot();
    const { simple, point } = this.judgeMatching(
      img,
      flagPool.getFlag(adventure1)
    );
    if (simple > 0.8) {
      this.log('在城市', LEVEL_INFO_MAP.info);
      return {
        position: 'city',
        point
      };
    }
    const result2 = this.judgeMatching(img, flagPool.getFlag(adventure2));
    if (result2.simple > 0.8) {
      this.log('在传送门', LEVEL_INFO_MAP.info);
      return {
        position: 'gate',
        point: result2.point
      };
    }
    return {
      position: 'unknown',
      point: null
    };
  }

  async goToGate() {
    const img = await this.screenshot();
    const {
      position,
      point: { x, y }
    } = await this.cityOrGate(img);
    if (position === 'city') {
      await this.tap(x, y, true);
      // 切换成功
    } else if (position === 'gate') {
      await this.tap(x, y, true);
      await delay(100);
      await this.goToGate();
    } else {
      this.log('未知错误', LEVEL_INFO_MAP.error);
    }
  }

  async goToCity() {
    const img = await this.screenshot();
    const {
      position,
      point: { x, y }
    } = await this.cityOrGate(img);
    if (position === 'gate') {
      await this.tap(x, y, true);
      // 切换成功
    } else if (position === 'city') {
      await this.tap(x, y, true);
      await delay(100);
      await this.goToGate();
    } else {
      this.log('未知错误', LEVEL_INFO_MAP.error);
    }
  }
}

module.exports = BaseAdvanture;
