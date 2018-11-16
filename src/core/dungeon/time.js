// 时间地牢
const BaseDungeon = require('./base-dungeon');

class TimeDungeon extends BaseDungeon {
  static get uniqueId() {
    return 'dungeon-time';
  }

  async start() {
    // 假设从home开始
    await this.fight();
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
