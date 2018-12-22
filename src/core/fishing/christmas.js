// 时间地牢
const BaseFish = require('./base-fish');
const flagPool = require('../flag-pool');
const {
  fishContinue,
  fishFlag,
  fishUpdate,
  baitEntrance,
  baitBuyBtn,
  baitPayment,
  baitSumSlider,
  yesBtn,
} = require('../../assets');
const { delay, getRandom } = require('../../utils');
const { tap, wait, longPress } = require('../../utils/chainOperation');

class Christmas extends BaseFish {
  static get uniqueId() {
    return 'fish-christmas';
  }

  async start() {
    // 假设从home开始
    this.cnt = 0;
    this.failedCnt = 0;
    this.tempCnt = 0;
    this.startTime = new Date();
    await this.fishing();
  }

  async fishing(notPreCheck = false) {
    const preFlag = notPreCheck || (await this.preCheck());
    if (preFlag) {
      if (this.cnt > 0 && this.cnt % 700 === 0) await this.buyBait();
      await this.inFishing();
      const afterFlag = await this.afterCheck();
      if (afterFlag) {
        const sec = Math.round((new Date() - this.startTime) / 1000);
        this.log(
          `累计用时${(sec / 60).toFixed(1)}分钟, 共钓鱼 - ${++this
            .cnt}条, 失败${this.failedCnt}次`
        );
        this.tempCnt !== 0 && (this.tempCnt = 0);
        return this.fishing();
      }
    }

    this.failedCnt++;
    if (this.tempCnt > 5) return;
    const status = await this.checkStatus();
    if (status === 'pre') return this.fishing(true);
    else if (status === 'after') {
      await this.afterCheck();
      return this.fishing();
    } else if (status === 'update') {
      this.log('哇哦，你升级了！');
      await this.runClickFlagCnt(1, 3, flagPool.getFlag(fishUpdate));
      await this.afterCheck();
      return this.fishing();
    } else {
      this.log(`未知错误，尝试第${++this.tempCnt}次`);
      await delay(2000);
      return this.fishing();
    }
  }

  async preCheck() {
    const img = await this.screenshot();

    const { point, simple } = await this.judgeMatching(
      img,
      flagPool.getFlag(fishFlag)
    );
    if (simple > 0.9) {
      if (this.wheelPos == null)
        this.wheelPos = {
          x: Math.round(point.x - 15),
          y: Math.round(point.y + 76)
        };
      return true;
    }
    return false;
  }

  async afterCheck() {
    await delay(400);
    const result = await this.runClickFlagCnt(
      1,
      3,
      flagPool.getFlag(fishContinue)
    );
    return result;
  }

  async inFishing() {
    const { x, y } = this.wheelPos;
    // 两次longPress之间需要tap穿插

    await this.waitLoading();
    await this.tap(x, y, true);
    await delay(200);
    await this.waitLoading();

    await this.chainOperation([
      tap(getRandom(x, 5), getRandom(y, 5)),
      wait(6900),
      tap(getRandom(x, 5), getRandom(y, 5)),
      wait(2000),
      ...longPress(getRandom(x, 5), getRandom(y, 5), 2000),
      wait(100),
      tap(getRandom(x, 5), getRandom(y, 5)),
      wait(100),
      ...longPress(getRandom(x, 5), getRandom(y, 5), 600),
      wait(100),
      tap(getRandom(x, 5), getRandom(y, 5)),
      wait(100),
      ...longPress(getRandom(x, 5), getRandom(y, 5), 500),
      wait(100),
      tap(getRandom(x, 5), getRandom(y, 5)),
      wait(100),
      ...longPress(getRandom(x, 5), getRandom(y, 5), 600)
    ]);
  }

  async checkStatus() {
    const img = await this.screenshot();
    const simple1 = await this.judgeSimple(img, flagPool.getFlag(fishFlag));
    if (simple1 > 0.9) return 'pre';
    const simple3 = await this.judgeSimple(img, flagPool.getFlag(fishUpdate));
    if (simple3 > 0.9) return 'update';
    const simple2 = await this.judgeSimple(img, flagPool.getFlag(fishContinue));
    if (simple2 > 0.9) return 'after';
    return 'unknown';
  }

  async buyBait() {
    this.log('该买鱼饵了...');
    await this.runClickFlagCnt(1, 3, flagPool.getFlag(baitEntrance));
    await this.runClickFlagCnt(1, 3, flagPool.getFlag(baitBuyBtn));
    // 拉动 165
    const img = await this.screenshot();
    const {
      simple,
      point: { x, y }
    } = await this.judgeMatching(img, flagPool.getFlag(baitSumSlider));

    if (simple > 0.9) {
      await this.drag(x, y, x + 170, y, 0.7);
      await this.runClickFlagCnt(1, 3, flagPool.getFlag(baitPayment));
      await delay(200);
      await this.waitLoading();
      await this.runClickFlagCnt(1, 3, flagPool.getFlag(yesBtn));
      await this.runClickFlagCnt(1, 3, flagPool.getFlag(this.closeFlag));
    } else this.log('购买鱼饵出错了...');

  }
}

module.exports = Christmas;
