const cv = require('opencv4nodejs');

class FlagPool {
  constructor() {
    this.appMap = {};
  }

  /**
   * @description 获取实例，单例模式
   * @param {Function} Entity 带uniqueId的类
   * @returns {Object}
   */
  getFlag(flagPath) {
    if (this.appMap[flagPath] == null) {
      this.appMap[flagPath] = cv.imread(flagPath);
    }
    return this.appMap[flagPath];
  }
}

const flagPool = new FlagPool();

module.exports = flagPool;
