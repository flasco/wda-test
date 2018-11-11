// 时间地牢
const cv = require('opencv4nodejs');

const { delay } = require('../../utils');

const BaseDungeon = require('./base-dungeon');
const { adventure1, adventure2 } = require('../../assets/home');

const { LEVEL_INFO_MAP } = require('../../constants');

class TimeDungeon extends BaseDungeon {
  constructor(props) {
    super(props);

    this.adventure1 = cv.imread(adventure1);
    this.adventure2 = cv.imread(adventure2);
  }
  async start() {
    // 假设从home开始
    await this.fight();
  }

  async cityOrGate(img = null) {
    if (img == null) img = await this.screenshot();
    const { simple, point } = this.judgeMatching(img, this.adventure1);
    if (simple > 0.8) {
      console.log('在城市');
      return {
        position: 'city',
        point
      };
    }
    const result2 = this.judgeMatching(img, this.adventure2);
    if (result2.simple > 0.8) {
      console.log('在传送门');
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

  async gotoDungeon() {
    const img = await this.screenshot();
    const { position } = await this.cityOrGate(img);
    if (position === 'gate') {
      // this.judgeMatching(img, this.)
    }
  }
}

module.exports = TimeDungeon;
