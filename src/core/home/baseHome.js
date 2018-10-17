const BaseGame = require('../base-game');
const cv = require('opencv4nodejs');

const { isAtHome } = require('../../assets');
const { LEVEL_INFO_MAP } = require('../../constants');

class BaseHome extends BaseGame {
  constructor(props) {
    super(props);
    this.isAtHomeFlag = cv.imread(isAtHome);
  }

  async isAtHome() {
    await this.waitLoading();
    const img = await this.screenshot();
    const { simple } = this.judgeMatching(img, this.isAtHomeFlag);
    return simple > 0.8;
  }

  async returnHome() {
    const isAtHome = await this.isAtHome();
    if (!isAtHome) {
      await this.closeWindow();
      await this.waitLoading();
      await this.returnHome();
    } else {
      this.log('成功返回Home界面', LEVEL_INFO_MAP.success);
    }
  }
}

module.exports = BaseHome;