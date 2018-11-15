const baseHome = require('./base-home');
const cv = require('opencv4nodejs');

const { breadBtn, getBreads, adBreads, adClose, isADLimit } = require('../../assets');
const { LEVEL_INFO_MAP } = require('../../constants');
const { delay } = require('../../utils');

class Breads extends baseHome {
  static get uniqueId() {
    return 'home-bread';
  }

  constructor(props) {
    super(props);
    this.breadBtnFlag = cv.imread(breadBtn);
    this.breadGetFlag = cv.imread(getBreads);
    this.breadADFlag = cv.imread(adBreads);
    this.breadADCloseFlag = cv.imread(adClose);
    this.isADLimitFlag = cv.imread(isADLimit);
  }

  async start() {
    (await this.openBreads()) && (await this.adBreads());
  }

  async openBreads() {
    const img = await this.screenshot();
    const {
      simple,
      point: { x, y }
    } = this.judgeMatching(img, this.breadBtnFlag);
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
    } = this.judgeMatching(img, this.breadGetFlag);
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
    } = this.judgeMatching(img, this.breadADCloseFlag);
    if (simple > 0.8) {
      this.log('广告终于好了..', LEVEL_INFO_MAP.success);
      await this.tap(x, y, true);
      await this.waitLoading();
      this.runClickFlagCnt(1, 3, this.ADBreadYesFlag).then(() => this.adBreads());
    } else {
      this.log('再等等...', LEVEL_INFO_MAP.warn);
      setTimeout(() => this.couldClose(), 5000);
    }
  }

  async adBreads() {
    await this.waitLoading();
    const img = await this.screenshot();
    const result = await this.judgeSimple(img, this.isADLimitFlag);
    if (result > 0.8) {
      this.log('已经达到上限...', LEVEL_INFO_MAP.warn);
      await this.runClickFlagCnt(1, 3, this.closeFlag1);
      return;
    }
    const {
      simple,
      point: { x, y }
    } = this.judgeMatching(img, this.breadADFlag);
    if (simple > 0.8) {
      this.log('开始看广告。。。', LEVEL_INFO_MAP.info);
      await this.tap(x, y, true);
      // 这里不用await是为了防止长时间等待导致无响应
      delay(27000).then(() => this.couldClose());
    } else {
      this.log('没有找到按钮...', LEVEL_INFO_MAP.warn);
    }
  }
}

module.exports = Breads;
