const cv = require('opencv4nodejs');
const { base642Mat } = require('../../utils');
const { TIP_COLOR, TIP_TEXT, LEVEL_INFO_MAP } = require('../../constants');

// 这里提供一些最基础的能力
class BaseApp {
  constructor({ client = '', session = '', width = '', height = '' }) {
    this.client = client;
    this.session = session;
    this.width = width;
    this.height = height;
  }

  /**
   * 点击事件
   * @param {number} x x坐标
   * @param {number} y y坐标
   * @param {boolean} needRandom 是否需要生成随机量
   * @param {number} randX x坐标随机的量, 不填的话默认是5
   * @param {number} randY y坐标随机的量, 不填的话跟randX一个值
   */
  tap(x, y, needRandom = false, randX, randY) {
    if (randX == null) {
      randX = 5;
      randY = 5;
    }
    if (randY == null) {
      randY = randX;
    }
    if (needRandom) {
      x += Math.random() * randX;
      y += Math.random() * randY;
    }
    x = Math.round(x * 100) / 100;
    y = Math.round(y * 100) / 100;

    this.log(`tap [${x}, ${y}]`);
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
    this.log(`tapHold [${x}, ${y}]`);
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
   * @param {Mat} img1 图片1
   * @param {Mat} img2 图片2
   * @param {boolean} needShow 是否需要显示结果
   * @return {object} {simple, point: {x, y}}
   */
  judgeMatching(img1, img2, needLog = false, needShow = false) {
    if (img1 == null || img2 == null) {
      throw new Error('图像不能为空！');
    }
    const matched = img1.matchTemplate(img2, cv.TM_CCOEFF_NORMED);
    const minMax = matched.minMaxLoc();
    const { maxLoc: { x, y }, maxVal } = minMax;

    needLog && console.log(`maxSimple - ${maxVal.toFixed(2)}`);
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
      point: { x: x / 3, y: y / 3 },
    };
  }

  /**
   * log美化
   * @param {string} str 提示文案
   * @param {Symbol} level 从constants里取
   */
  log(str, level = LEVEL_INFO_MAP.info) {
    if (TIP_COLOR[level] != null) {
      const tip = TIP_COLOR[level](TIP_TEXT[level]);
      console.log(`${tip} ${str}`);
    } else {
      console.log(str);
    }
  }
}

module.exports = BaseApp;
