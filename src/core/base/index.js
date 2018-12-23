const cv = require('opencv4nodejs');
const notifier = require('node-notifier');

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
   * @description 点击事件
   * @param {number} x x坐标
   * @param {number} y y坐标
   * @param {boolean} needRandom 是否需要生成随机量
   * @param {number} randX x坐标随机的量, 不填的话默认是5
   * @param {number} randY y坐标随机的量, 不填的话跟randX一个值
   * @returns {Promise<Function>}
   */
  async tap(x, y, needRandom = false, randX, randY) {
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

    // this.log(`tap [${x}, ${y}]`);
    try {
      await this.session.tap(x, y);
    } catch (error) {
      this.log('啊哦，断掉了', LEVEL_INFO_MAP.warn);
    }
  }
  /**
   * 执行动作链
   * @param {array<Object>} actions 动作链
   */
  async chainOperation(actions) {
    try {
      await this.session.chainOperation(actions);
    } catch (error) {
      this.log('啊哦，断掉了', LEVEL_INFO_MAP.warn);
    }
  }

  /**
   * 拖拽
   * @param {number} x1 前坐标x
   * @param {number} y1 前坐标y
   * @param {number} x2 后坐标x
   * @param {number} y2 后坐标y
   * @param {number} duration 耗时，秒为单位
   */
  async drag(x1, y1, x2, y2, duration = 0.7) {
    try {
      await this.session.swipe(x1, y1, x2, y2, duration);
    } catch (error) {
      this.log('啊哦，断掉了', LEVEL_INFO_MAP.warn);
    }
  }

  /**
   * @description 长按
   * @param {number} x x坐标
   * @param {number} y y坐标
   */
  async tapHold(x, y, delay = 1.0) {
    x = Math.round(x * 100) / 100;
    y = Math.round(y * 100) / 100;
    // this.log(`tapHold [${x}, ${y}]`);
    try {
      await this.session.tapHold(x, y, delay);
    } catch (error) {
      this.log('啊哦，断掉了', LEVEL_INFO_MAP.warn);
    }
  }

  /**
   * 截屏
   * @param {string} pathName 文件路径
   * @param {boolean} needMat 是否需要返回Mat
   * @return {cv | string}
   */
  async screenshot(pathName = '', needMat = true) {
    // const msg = pathName !== '' ? ` pathName - ${pathName}` : '';
    try {
      pathName !== '' && console.log(`screenshot! pathName - ${pathName}`);
      const base64 = await this.client.screenshot(pathName);
      if (needMat && base64 != null) {
        return base642Mat(base64);
      }
      return base64;
    } catch (error) {
      this.log('啊哦，断掉了', LEVEL_INFO_MAP.warn);
    }
  }
  /**
   * 判断图片1中是否包含图片2
   *
   * @typedef {Object} Point
   * @property {number} x The X Coordinate
   * @property {number} y The Y Coordinate
   *
   * @typedef {Object} MatchRes
   * @property {number} simple simple value
   * @property {Point} point point dot
   *
   * @param {Mat} img1 图片1
   * @param {Mat} img2 图片2
   * @param {boolean} needShow 是否需要显示结果
   * @return {MatchRes}
   */
  judgeMatching(img1, img2, needLog = false, needShow = false) {
    if (img1 == null || img2 == null) {
      throw new Error('图像不能为空！');
    }
    const matched = img1.matchTemplate(img2, cv.TM_CCOEFF_NORMED);
    const minMax = matched.minMaxLoc();
    const {
      maxLoc: { x, y },
      maxVal
    } = minMax;

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
      point: { x: x / 3, y: y / 3 }
    };
  }

  /**
   * @description log美化
   * @param {string} str 提示文案
   * @param {Symbol} level 从constants里取
   */
  log(str, level = LEVEL_INFO_MAP.info) {
    if (TIP_COLOR[level] != null) {
      const tip = TIP_COLOR[level](TIP_TEXT[level]);
      if (level === LEVEL_INFO_MAP.warn || level === LEVEL_INFO_MAP.error) {
        notifier.notify({
          title: '警告',
          message: str,
          sound: 'Funk' // Only Notification Center or Windows Toasters
        });
      }
      console.log(`${tip} ${str}`);
    } else {
      console.log(str);
    }
  }
}

module.exports = BaseApp;
