// 时间地牢
const { delay } = require('../../utils');
const flagPool = require('../flag-pool');

const BaseDungeon = require('./base-dungeon');
const { adventure1, adventure2 } = require('../../assets/home');

const { LEVEL_INFO_MAP } = require('../../constants');

class TimeDungeon extends BaseDungeon {
  static get uniqueId() {
    return 'dungeon-time';
  }

  async start() {
    // 假设从home开始
    await this.fight();
  }

  async cityOrGate(img = null) {
    if (img == null) img = await this.screenshot();
    const { simple, point } = this.judgeMatching(img, flagPool.getFlag(adventure1));
    if (simple > 0.8) {
      console.log('在城市');
      return {
        position: 'city',
        point,
      };
    }
    const result2 = this.judgeMatching(img, flagPool.getFlag(adventure2));
    if (result2.simple > 0.8) {
      console.log('在传送门');
      return {
        position: 'gate',
        point: result2.point,
      };
    }
    return {
      position: 'unknown',
      point: null,
    };
  }

  async goToGate() {
    const img = await this.screenshot();
    const {
      position,
      point: { x, y },
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

  async gotoDungeon() {
    const img = await this.screenshot();
    const { position } = await this.cityOrGate(img);
    if (position === 'gate') {
      // this.judgeMatching(img, this.)
    }
  }
}

module.exports = TimeDungeon;
