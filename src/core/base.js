const cv = require('opencv4nodejs');
const { base642Mat } = require('../utils');

// 这里提供一些最基础的能力
class BaseApp {
  constructor({ client, session, width, height }) {
    this.client = client;
    this.session = session;
    this.width = width;
    this.height = height;
  }

  /**
   * 点击事件
   * @param {number} x x坐标
   * @param {number} y y坐标
   */
  tap(x, y) {
    x = Math.round(x * 100) / 100;
    y = Math.round(y * 100) / 100;
    console.log(`tap [${x}, ${y}]`);
    return this.session.tap(x, y);
  }

  /**
   * 对xy坐标进行转换处理的点击事件
   * @param {number} x x坐标
   * @param {number} y y坐标
   */
  tapHold(x, y, delay = 1.0) {
    x = Math.round(x * 100) / 100;
    y = Math.round(y * 100) / 100;
    console.log(`tapHold [${x}, ${y}]`);
    return this.session.tapHold(x, y, delay);
  }

  /**
   * 截屏
   * @param {string} pathName 文件路径
   * @param {boolean} needMat 是否需要返回Mat
   * @return {cv::Mat|string}
   */
  async screenshot(pathName = '', needMat = true) {
    // const msg = pathName !== '' ? ` pathName - ${pathName}` : '';
    pathName !== '' && console.log(`screenshot! pathName - ${pathName}`);
    const base64 = await this.client.screenshot(pathName);
    if (needMat && base64 != null) {
      return base642Mat(base64);
    }
    return base64;
  }

  /**
   * 判断图片1中是否包含图片2
   * @param {cv::Mat} img1 图片1
   * @param {cv::Mat} img2 图片2
   * @param {boolean} needShow 是否需要显示结果
   * @return {object}
   */
  judgeMatching(img1, img2, needShow = false) {
    if (img1 == null || img2 == null) {
      throw new Error('图像不能为空！');
    }
    const matched = img1.matchTemplate(img2, cv.TM_CCOEFF_NORMED);
    const minMax = matched.minMaxLoc();
    const { maxLoc: { x, y }, maxVal } = minMax;

    console.log(`maxSimple - ${maxVal.toFixed(2)}`);
    // console.log(`points - [${x}, ${y}]`);
    if (needShow) {
      img1.drawRectangle(
        new cv.Rect(x, y, img2.cols, img2.rows),
        new cv.Vec(0, 255, 0),
        2,
        cv.LINE_8
      );
      cv.imshow('We\'ve found close!', img1);
      cv.waitKey();
    }
    // 之所以返回除以3，是因为屏幕缩放倍数的原因
    return {
      simple: maxVal,
      point: { x: x / 3, y: y / 3 }
    };
  }
}

module.exports = BaseApp;