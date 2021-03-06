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
  baitClose1,
  yesBtn
} = require('../../assets');
const { delay, getRandom, sumTimeUse } = require('../../utils');
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
    // await this.buyBaitSum();
  }

  async fishing() {
    if (this.tempCnt > 5) return;
    const img = await this.screenshot();
    let status = await this.checkStatus(img);
    if (this.wheelPos == null) await this.preCheck(img);

    if (status == 'pre') {
      const totalCnt = this.cnt + this.failedCnt;
      if (totalCnt > 0 && totalCnt % 700 === 0) await this.buyBait();
      await this.inFishing();
      await this.afterCheck(true);
    } else if (status === 'after') await this.afterCheck();
    else if (status === 'update') {
      this.log('哇哦，你升级了！');
      await this.runClickFlagCnt(1, 3, flagPool.getFlag(fishUpdate));
      await this.afterCheck(true);
    } else {
      this.failedCnt++;
      this.log(`未知错误，尝试第${++this.tempCnt}次`);
      await delay(3000);
    }
    return this.fishing();
  }

  async preCheck(img) {
    if (img == null) img = await this.screenshot();

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

  async afterCheck(showLog = false) {
    await delay(400);
    const result = await this.runClickFlagCnt(
      1,
      3,
      flagPool.getFlag(fishContinue)
    );
    if (result && showLog) {
      const sec = Math.round((new Date() - this.startTime) / 1000);
      this.log(
        `用时${sumTimeUse(sec)}, 共钓鱼 - ${++this.cnt}条, 失败${
          this.failedCnt
        }次`
      );
      this.tempCnt !== 0 && (this.tempCnt = 0);
    }
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

  async checkStatus(img) {
    if (img == null) img = await this.screenshot();
    const simple3 = await this.judgeSimple(img, flagPool.getFlag(fishUpdate));
    if (simple3 > 0.9) return 'update';
    const simple1 = await this.judgeSimple(img, flagPool.getFlag(fishFlag));
    if (simple1 > 0.9) return 'pre';
    const simple2 = await this.judgeSimple(img, flagPool.getFlag(fishContinue));
    if (simple2 > 0.9) return 'after';
    return 'unknown';
  }

  async buyBait(cnt = 3) {
    this.log('该买鱼饵了...');
    await this.runClickFlagCnt(1, 3, flagPool.getFlag(baitEntrance));
    await this.runClickFlagCnt(1, 3, flagPool.getFlag(baitBuyBtn));
    const result = await this.buyBaitSum();
    if (result === 'no-dialog' || result === 'find-fail') {
      if (cnt > 0) {
        this.log('再次尝试..');
        return this.buyBait(cnt - 1);
      } else {
        this.log('尝试达到上限，gg');
        await this.runClickFlagCnt(1, 3, flagPool.getFlag(baitClose1));
        await this.runClickFlagCnt(1, 3, flagPool.getFlag(this.closeFlag));
      }
    }
  }

  async buyBaitSum() {
    const img = await this.screenshot();
    const {
      simple,
      point: { x, y }
    } = await this.judgeMatching(img, flagPool.getFlag(baitSumSlider));
    const simple2 = await this.judgeSimple(img, flagPool.getFlag(baitPayment));
    if (simple2 > 0.9) {
      // 在窗口里
      if (simple > 0.9) {
        await this.drag(x, y, x + 170, y, 0.7);
        await this.runClickFlagCnt(1, 3, flagPool.getFlag(baitPayment));
        await delay(200);
        await this.waitLoading();
        await this.runClickFlagCnt(1, 3, flagPool.getFlag(yesBtn));
        await this.runClickFlagCnt(1, 3, flagPool.getFlag(this.closeFlag));
      } else {
        this.log(`寻找拖动点失败, simple - ${simple}`);
        return 'find-fail';
      }
    } else {
      this.log(`不在窗口内，simple - ${simple2}`);
      return 'no-dialog';
    }
  }
}

module.exports = Christmas;
