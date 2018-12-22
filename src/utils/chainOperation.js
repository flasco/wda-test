function longPress(x, y, druation) {
  return [
    {
      action: 'press',
      options: {
        x,
        y
      }
    },
    {
      action: 'wait',
      options: {
        ms: druation
      }
    },
    { action: 'release' }
  ];
}

function longPress2(x, y, duration) {
  return {
    action: 'longPress',
    options: {
      x,
      y,
      duration
    }
  };
}

function wait(ms) {
  return {
    action: 'wait',
    options: { ms }
  };
}

function tap(x, y) {
  return {
    action: 'tap',
    options: {
      x,
      y
    }
  };
}

exports.tap = tap;
exports.wait = wait;
exports.longPress = longPress;
exports.longPress2 = longPress2;
