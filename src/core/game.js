const Base = require('./base');
const cv = require('opencv4nodejs');

const { isLoading_1, close_1, yesBtn } = require('../assets');
const { delay } = require('../utils');

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
    console.log(`green - ${greenPoints}`);
    return greenPoints > 800;
  }

  /**
   * 检测是否在加载状态
   */
  async isLoading() {
    const img = await this.screenshot();
    const { simple } = this.judgeMatching(img, this.loadingFlag1);
    if (simple > 0.8) {
      console.log('转场加载中...');
      await this.isLoading();
    } else if (this.isGreenLoading(img)) {
      console.log('绿圈加载中...');
      await this.isLoading();
    }
  }

  /**
   * 检测是否有需要关闭的弹窗
   */
  async needCloseWindow() {
    const img = await this.screenshot();
    const { simple, point: { x, y } } = this.judgeMatching(img, this.closeFlag1);
    if (simple > 0.8) {
      console.log('需要关闭窗口...');
      await this.tap(x, y, true);
      await delay(1400);
    }
  }

  async needClickBtn() {
    const img = await this.screenshot();
    const { simple, point: { x, y } } = this.judgeMatching(img, this.yesBtnFlag);
    if (simple > 0.8) {
      console.log('需要点击确定...');
      await this.tap(x, y, true);
      await delay(1400);
      // 确定已经不用点击了
      await this.needClickBtn();
    }
  }
}

module.exports = GameCommon;
