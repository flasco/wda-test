const cv = require('opencv4nodejs');


function base642Mat(base64text) {
  const base64data = base64text.replace('data:image/jpeg;base64', '')
    .replace('data:image/png;base64', '');//Strip image type prefix
  const buffer = Buffer.from(base64data, 'base64');
  const image = cv.imdecode(buffer); //Image is now represented as Mat
  return image;
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

module.exports = {
  base642Mat,
  delay,
};
