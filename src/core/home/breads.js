const baseHome = require('./base-home');
const cv = require('opencv4nodejs');

const { breadBtn, getBreads } = require('../../assets');

class Breads extends baseHome {
  constructor(props) {
    super(props);
    this.breadBtnFlag = cv.imread(breadBtn);
    this.breadGetFlag = cv.imread(getBreads);
  }

  async openBreads() {
    const img = await this.screenshot();
    const { simple, point: { x, y } } = this.judgeMatching(img, this.breadBtnFlag);
    if (simple > 0.8) {
      await this.tap(x, y, true);
      await this.waitLoading();
      await this.checkBreads();
    }
  }

  async checkBreads() {
    const img = await this.screenshot();
    const { simple, point: { x, y } } = this.judgeMatching(img, this.breadGetFlag);
    if (simple > 0.8) {
      this.log('有面包可领');
      await this.tap(x, y, true);
    }
  }
}

module.exports = Breads;