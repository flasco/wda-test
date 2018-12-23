const cv = require('opencv4nodejs');

function base642Mat(base64text) {
  const base64data = base64text
    .replace('data:image/jpeg;base64', '')
    .replace('data:image/png;base64', ''); //Strip image type prefix
  const buffer = Buffer.from(base64data, 'base64');
  const image = cv.imdecode(buffer); //Image is now represented as Mat
  return image;
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

function getRandom(num, size = 5) {
  const tmp = num + size * Math.random();
  return Math.round(tmp * 100) / 100;
}

function getRepeatActionsArray(x, y, repCnt = 1) {
  const actions = [];
  for (let i = 0; i < repCnt; i++) {
    actions.push({
      action: 'tap',
      options: {
        x: getRandom(x, 10),
        y: getRandom(y, 10)
      }
    });
    actions.push({
      action: 'wait',
      options: { ms: getRandom(85, 8) }
    });
  }
  return actions;
}
// time - 单位秒
function sumTimeUse(time) {
  const h = (time / 3600) >>> 0;
  const m = (time % 3600) / 60;
  if (h > 0) return `${h}小时${m.toFixed(1)}分钟`;
  else return `${m.toFixed(1)}分钟`;
}

module.exports = {
  base642Mat,
  delay,
  getRandom,
  sumTimeUse,
  getRepeatActionsArray
};
