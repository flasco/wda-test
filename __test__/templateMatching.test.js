const cv = require('opencv4nodejs');

test('测试模式匹配', async () => {

  const img1 = cv.imread(`${__dirname}/../test1.png`);
  const closeImg = cv.imread(`${__dirname}/../close.png`);
  const matched = img1.matchTemplate(closeImg, cv.TM_CCOEFF_NORMED);
  const minMax = matched.minMaxLoc();
  const { maxLoc: { x, y }, maxVal } = minMax;
  console.log(`最大相似度 ${maxVal.toFixed(2)}`);
  console.log(`points - [${x}, ${y}]`);
  img1.drawRectangle(
    new cv.Rect(x, y, closeImg.cols, closeImg.rows),
    new cv.Vec(0, 255, 0),
    2,
    cv.LINE_8
  );
  cv.imshow('We\'ve found close!', img1);
  cv.waitKey();
});
