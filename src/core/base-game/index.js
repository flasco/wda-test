const Base = require('../base');
const cv = require('opencv4nodejs');

const { isLoading1, close1, yesBtn, adBreadYes } = require('../../assets');
const { delay } = require('../../utils');
const { LEVEL_INFO_MAP } = require('../../constants');

// 这里存放一些组件的公用业务function
class GameCommon extends Base {
  constructor(props) {
    super(props);
    this.loadingFlag1 = cv.imread(isLoading1);
    this.closeFlag1 = cv.imread(close1);
    this.yesBtnFlag = cv.imread(yesBtn);
    this.ADBreadYesFlag = cv.imread(adBreadYes);
    this.greenLoadRect = new cv.Rect(1029, 546, 153, 153);
  }

  /**
   * @description 判断是否在绿圈加载
   * @param {cv::Mat} img 图片
   * @returns {boolean}
   */
  isGreenLoading(img) {
    const roi = img.getRegion(this.greenLoadRect);
    const arr = roi.getDataAsArray();
    let greenPoints = 0;
    // 每一行
    for (let i = 0, j = arr.length; i < j; i++) {
      const curRow = arr[i];
      for (let m = 0, n = curRow.length; m < n; m++) {
        if (i >= 42 && i <= 111) {
          if (m === 42) {
            m = 110;
            continue;
          }
        }
        const curPoi = curRow[m];
        const [h, s, v] = curPoi;
        if (h >= 38 && h <= 75 && (s > 200 && s < 220) && v > 180) {
          greenPoints++;
        }
      }
    }
    this.log(`green - ${greenPoints}`);
    return greenPoints > 800;
  }

  /**
   * @description 检测是否在加载状态，一直等到不是绿圈为止
   */
  async waitLoading() {
    const img = await this.screenshot();
    const { simple } = this.judgeMatching(img, this.loadingFlag1);
    if (simple > 0.8) {
      this.log('转场加载中...');
      await delay(700);
      await this.waitLoading();
    } else if (this.isGreenLoading(img)) {
      this.log('绿圈加载中...');
      await delay(700);
      await this.waitLoading();
    }
  }

  /**
   * @description 检测是否有需要点击的确定按钮，是则点击并返回true，否则返回false
   * @returns {boolean} 否有需要点击的确定按钮
   */
  async clickFlag(flag) {
    const img = await this.screenshot();
    const {
      simple,
      point: { x, y }
    } = this.judgeMatching(img, flag);
    if (simple > 0.8) {
      await this.tap(x, y, true);
      return true;
    }
    return false;
  }

  async runClickFlagCnt(needCnt = 1, maxFailedCnt = 3, flag) {
    let cnt = 0;
    let failedCnt = 0;
    while (cnt < needCnt) {
      await delay(1100);
      const isClick = await this.clickFlag(flag);
      if (isClick) {
        cnt++;
        failedCnt = 0;
      } else {
        failedCnt++;
      }
      if (failedCnt > maxFailedCnt) break;
    }
    this.log(`成功点击${cnt}次`, LEVEL_INFO_MAP.success);
  }

  async judgeSimple(img, containImg) {
    if (containImg == null) {
      containImg = img;
      img = await this.screenshot();
    }
    const { simple } = this.judgeMatching(img, containImg);
    return simple;
  }

  async judgeClick(containImg, announce = '', depth = 1, stack = 0, scCnt = 0) {
    if (announce != '' && stack === 0) announce = ` ${announce}`;
    const img = await this.screenshot();
    const {
      simple,
      point: { x, y },
    } = this.judgeMatching(img, containImg);
    if (simple > 0.8) {
      this.log(`find btn${announce}, click...`);
      await this.tap(x, y, true);
      scCnt++;
    }
    if (depth > 1) {
      await this.judgeClick(containImg, announce, depth - 1, stack + 1, scCnt);
    } else if (stack > 0 && scCnt < 1) {
      // 此时
      this.log(`can't find btn${announce}...`, LEVEL_INFO_MAP.error);
    }
  }
}

module.exports = GameCommon;
