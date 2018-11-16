const cv = require('opencv4nodejs');

const { Rect } = cv;

test('测试是否可以点击进入游戏', async () => {
  const img1 = cv.imread(`${__dirname}/../1542372101740.png`);
  console.log(img1.rows);
  console.log(img1.cols);
  const x = img1.at(798, 33);
  console.log(x);
  const rect1 = new Rect(1262, 292, 61, 34);
  const rect2 = new Rect(1466, 292, 61, 34);
  const rect3 = new Rect(1669, 292, 61, 34);

  const roi1 = img1.getRegion(rect1);
  const roi2 = img1.getRegion(rect2);
  const roi3 = img1.getRegion(rect3);

  const roi_hsv1 = roi1.cvtColor(cv.COLOR_BGR2HSV);
  const roi_hsv2 = roi2.cvtColor(cv.COLOR_BGR2HSV);
  const roi_hsv3 = roi3.cvtColor(cv.COLOR_BGR2HSV);
  const pink1 = isPink(roi_hsv1);
  const pink2 = isPink(roi_hsv2);
  const pink3 = isPink(roi_hsv3);
  if (pink1 + pink2 + pink3 > 1) {
    console.log('两个以上的强敌，手动一下吧~');
  }
  // cv.imshow('测试', roi4);
  // cv.waitKey();
});

function isPink(roi) {
  const arr = roi.getDataAsArray();
  let pinkPoint = 0;
  // 每一行
  for (let i = 0, j = arr.length; i < j; i++) {
    const curRow = arr[i];
    for (let m = 0, n = curRow.length; m < n; m++) {
      const curPoi = curRow[m];
      const [h, s, v] = curPoi;
      if (h >= 150 && h <= 160) {
        pinkPoint++;
        console.log(h, s, v);
      }
    }
  }
  console.log(`pink - ${pinkPoint}`);
  return pinkPoint > 800;
}
