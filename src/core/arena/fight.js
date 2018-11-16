const BaseArena = require('./base-arena');
const cv = require('opencv4nodejs');

const {
  arena,
  arena1,
  giveTicket,
  prepareFight,
  startFight,
  yesBtn,
  fightFinish,
  emptyTickets
} = require('../../assets');
const flagPool = require('../flag-pool');
const { LEVEL_INFO_MAP } = require('../../constants');
const { delay } = require('../../utils');
const { Rect } = cv;

class Fight extends BaseArena {
  constructor(props) {
    super(props);
    this.rect1 = new Rect(1262, 292, 61, 34);
    this.rect2 = new Rect(1466, 292, 61, 34);
    this.rect3 = new Rect(1669, 292, 61, 34);
  }
  async start() {
    // const simple = await this.judgeSimple(flagPool.getFlag(arena));
    // if (simple < 0.9) await this.goToGate();
    // await this.goToArena();
    // const img = await this.screenshot();
    await this.prepareFight();
  }

  async goToArena() {
    await this.runClickFlagCnt(1, 3, flagPool.getFlag(arena));
    await delay(700);
    await this.runClickFlagCnt(1, 3, flagPool.getFlag(arena1));
  }

  async judgeStatus(img) {
    const simple1 = await this.judgeSimple(img, flagPool.getFlag(giveTicket));
    if (simple1 > 0.9) {
      return 'admission';
    }
    const simple2 = await this.judgeSimple(img, flagPool.getFlag(prepareFight));
    if (simple2 > 0.9) {
      return 'fight';
    }
    const simple3 = await this.judgeSimple(img, flagPool.getFlag(emptyTickets));
    if (simple3 > 0.9) {
      return 'emptyTickets';
    }
  }

  async prepareFight() {
    this.log('开干开干');
    await this.waitLoading();
    const img = await this.screenshot();
    const status = await this.judgeStatus(img);
    if (status === 'admission') {
      this.log('开始入场...');
      await this.runClickFlagCnt(1, 3, flagPool.getFlag(giveTicket));
      await this.prepareFight();
    } else if (status === 'fight') {
      this.fightCheck();
    } else if (status === 'emptyTickets'){
      this.log('票已干...');
    } else {
      this.log('没有检测到按钮..');
    }
  }

  async fightCheck() {
    const img = await this.screenshot();
    const canAuto = this.couldAuto(img);
    if (canAuto) {
      this.log('可以自动啊，干他妈的');
      await this.runClickFlagCnt(1, 3, flagPool.getFlag(prepareFight));
      await delay(700);
      await this.runClickFlagCnt(1, 3, flagPool.getFlag(startFight));
      await this.waitLoading();
      this.fight();
    } else {
      this.log('警告，敌人有点强大，请自行手动.', LEVEL_INFO_MAP.warn);
    }
  }

  async fightWait() {
    const img = await this.screenshot();
    const point = img.at(1081, 1972);
    if (point.z > 10) {
      return true;
    } else {
      await delay(500);
      await this.fightWait();
    }
  }

  async fight() {
    await this.fightWait();
    let nextFight = 0;
    const [x, y] = [1972 / 3, 1081 / 3];
    const flag = 

    // 开女神
    this.tap(81 / 3, 949 / 3, true);
    for (let i = 0; i < 10; i++) {
      await this.tap(x, y, true, 10, 10);
      await delay(300);
      await this.tap(x, y, true, 10, 10);
      await delay(300);
      await this.tap(x, y, true, 10, 10);
      await delay(300);
      await this.tap(x, y, true, 10, 10);
      await delay(300);
      await this.tap(x, y, true, 10, 10);
      await delay(300);
      this.log('点完了...');
      const img = await this.screenshot();
      const simple = await this.judgeSimple(img, flag);
      if (simple > 0.9) {
        nextFight = 1;
        break;
      }
    }
    this.log('干完了。。。');
    if (nextFight === 1) {
      await this.judgeAfterFightStatus();
      this.prepareFight();
    }
  }

  async judgeAfterFightStatus(img) {
    if (img == null) img = await this.screenshot();
    const flag1 = flagPool.getFlag(fightFinish);
    const simple1 = await this.judgeSimple(img, flag1);
    if (simple1 > 0.9) {
      this.log('下一局~');
      await this.runClickFlagCnt(1, 3, flag1);
    } else {
      const flag2 = flagPool.getFlag(yesBtn);
      const simple2 = await this.judgeSimple(img, flag2);
      if (simple2 > 0.9) {
        this.log('哇哦，你升级了！');
        await this.runClickFlagCnt(1, 3, flag2);
        await this.judgeAfterFightStatus();
      }
    }
  }

  async couldAuto(img1) {
    const roi1 = img1.getRegion(this.rect1);
    const roi2 = img1.getRegion(this.rect2);
    const roi3 = img1.getRegion(this.rect3);

    const roi_hsv1 = roi1.cvtColor(cv.COLOR_BGR2HSV);
    const roi_hsv2 = roi2.cvtColor(cv.COLOR_BGR2HSV);
    const roi_hsv3 = roi3.cvtColor(cv.COLOR_BGR2HSV);
    const pink1 = this.isPink(roi_hsv1);
    const pink2 = this.isPink(roi_hsv2);
    const pink3 = this.isPink(roi_hsv3);
    return pink1 + pink2 + pink3 < 2;
  }

  isPink(roi) {
    const arr = roi.getDataAsArray();
    let pinkPoint = 0;
    // 每一行
    for (let i = 0, j = arr.length; i < j; i++) {
      const curRow = arr[i];
      for (let m = 0, n = curRow.length; m < n; m++) {
        const curPoi = curRow[m];
        const [h] = curPoi;
        if (h >= 150 && h <= 160) {
          pinkPoint++;
        }
      }
    }
    console.log(`isPink - ${pinkPoint}`);
    return pinkPoint > 500;
  }
}

module.exports = Fight;
