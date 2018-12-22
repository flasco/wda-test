const homeImgs = require('./home');
const fishImgs = require('./fishing');

module.exports = {
  // common相关
  isStart: `${__dirname}/common/isStart.png`,
  isLoading1: `${__dirname}/common/isLoading-1.png`,
  close1: `${__dirname}/common/close-1.png`,
  yesBtn: `${__dirname}/common/yesBtn.png`,
  overload: `${__dirname}/common/overload.png`,

  // home相关
  ...homeImgs,
  ...fishImgs,
};