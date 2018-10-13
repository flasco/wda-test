const Base = require('./base');
const cv = require('opencv4nodejs');

const { isLoading_1, isLoading_2 } = require('../assets');

// 这里存放一些组件的公用业务function
class GameCommon extends Base {
  constructor(props) {
    super(props);
    this.loadingFlag1 = cv.imread(isLoading_1);
    this.loadingFlag2 = cv.imread(isLoading_2);
  }

  async isLoading() {
    const img = await this.screenshot();
    const res1 = this.judgeMatching(img, this.loadingFlag1);
    console.log('绿圈检测...');
    const res2 = this.judgeMatching(img, this.loadingFlag2);
    if (res1.simple > 0.8) {
      console.log('正在转场加载！');
      await this.isLoading();
    } else if (res2.simple > 0.8) {
      console.log('正在绿圈加载！');
      await this.isLoading();
    } else {
      console.log('当前不在加载状态！');
    }
  }
}

module.exports = GameCommon;
