const cv = require('opencv4nodejs');

test('测试是否可以点击进入游戏', async () => {

  const img1 = cv.imread(`${__dirname}/../src/testImg/start-2.png`);
  const flagImg = cv.imread(`${__dirname}/../src/assets/isStart.png`);
  const matched = img1.matchTemplate(flagImg, cv.TM_CCOEFF_NORMED);
  const minMax = matched.minMaxLoc();
  const { maxLoc: { x, y }, maxVal } = minMax;
  console.log(`最大相似度 ${maxVal.toFixed(2)}`);
  console.log(`points - [${x}, ${y}]`);
  img1.drawRectangle(
    new cv.Rect(x, y, flagImg.cols, flagImg.rows),
    new cv.Vec(0, 255, 0),
    2,
    cv.LINE_8
  );
  cv.imshow('We\'ve found btn!', img1);
  cv.waitKey();
});
