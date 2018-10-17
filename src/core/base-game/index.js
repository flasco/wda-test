const Base = require('../base');
const cv = require('opencv4nodejs');

const { isLoading_1, close_1, yesBtn } = require('../../assets');
const { delay } = require('../../utils');
const { LEVEL_INFO_MAP } = require('../../constants');

// 这里存放一些组件的公用业务function
class GameCommon extends Base {
  constructor(props) {
    super(props);
    this.loadingFlag1 = cv.imread(isLoading_1);
    this.closeFlag1 = cv.imread(close_1);
    this.yesBtnFlag = cv.imread(yesBtn);
    this.greenLoadRect = new cv.Rect(1029, 546, 153, 153);
  }

  /**
   * 判断是否在绿圈加载
   * @param {cv::Mat} img 图片
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
        if (
          (h >= 38 && h <= 75) &&
          (s > 200 && s < 220) &&
          (v > 180)
        ) {
          greenPoints++;
        }
      }
    }
    this.log(`green - ${greenPoints}`);
    return greenPoints > 800;
  }

  /**
   * 检测是否在加载状态
   */
  async waitLoading() {
    const img = await this.screenshot();
    if (this.isGreenLoading(img)) {
      this.log('绿圈加载中...');
      await this.waitLoading();
    } else {
      const { simple } = this.judgeMatching(img, this.loadingFlag1);
      if (simple > 0.8) {
        this.log('转场加载中...');
        await this.waitLoading();
      }
    }
  }

  /**
   * 检测是否有需要关闭的弹窗
   */
  async needCloseWindow() {
    this.log('检测是否有可以关闭的窗口...');
    await this.judgeClick(this.closeFlag1, 'close_btn');
    await delay(700);
  }

  async needClickBtn() {
    await this.judgeClick(this.yesBtnFlag, 'yes_btn', 2);
  }

  async judgeSimple(containImg) {
    const img = await this.screenshot();
    const { simple } = this.judgeMatching(img, containImg);
    return simple;
  }

  async judgeClick(containImg, announce = '', depth = 1, stack = 0) {
    if (announce != '' && stack === 0) announce = ` ${announce}`;
    if (depth < 1) {
      this.log(`can't find btn${announce}...`, LEVEL_INFO_MAP.error);
      return;
    }
    const img = await this.screenshot();
    let { simple, point: { x, y } } = this.judgeMatching(img, containImg);
    if (simple > 0.8 && depth > 0) {
      this.log(`find btn${announce}, click...`);
      x = x + containImg.rows - 2;
      y = y + containImg.cols - 2;
      await this.tap(x, y, true);
      await this.judgeClick(containImg, announce, depth - 1, stack + 1);
    }
  }

}

module.exports = GameCommon;
