const cv = require('opencv4nodejs');

const { Rect } = cv;

test('测试是否可以点击进入游戏', async () => {

  const img1 = cv.imread(`${__dirname}/../.temp/test2.png`);
  const rect1 = new Rect(1029, 546, 153, 153);
  // const rect2 = new Rect(1128, 559, 12, 12);
  const roi = img1.getRegion(rect1);

  const roi_hsv = roi.cvtColor(cv.COLOR_BGR2HSV);
  // console.log(arr);
  isLoading(roi_hsv);
  // cv.imshow('测试', roi);
  // cv.waitKey();
});

function isLoading(roi) {
  const arr = roi.getDataAsArray();
  let greenPoints = 0;
  // 每一行
  for (let i = 0, j = arr.length; i < j; i++) {
    const curRow = arr[i];
    for (let m = 0, n = curRow.length; m < n; m++) {
      if (i >= 42 && i <= 111) {
        if (m === 42) {
          m = 110;
          continue;
        }
      }
      const curPoi = curRow[m];
      const [h, s, v] = curPoi;
      if (
        (h >= 38 && h <= 75) &&
        (s > 200 && s < 220) &&
        (v > 180)
      ) {
        greenPoints++;
      }
    }
  }
  console.log(`green - ${greenPoints}`);
  return greenPoints > 800;
}
