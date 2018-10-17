const color = require('colors-cli');

const LEVEL_INFO_MAP = {
  info: Symbol('info'),
  success: Symbol('success'),
  warn: Symbol('warn'),
  error: Symbol('error'),
};

const TIP_COLOR = {
  [LEVEL_INFO_MAP.info]: color.blue,
  [LEVEL_INFO_MAP.success]: color.green,
  [LEVEL_INFO_MAP.warn]: color.yellow_bt,
  [LEVEL_INFO_MAP.error]: color.red_bt,
};

const TIP_TEXT = {
  [LEVEL_INFO_MAP.info]: 'info',
  [LEVEL_INFO_MAP.success]: 'success',
  [LEVEL_INFO_MAP.warn]: 'warn',
  [LEVEL_INFO_MAP.error]: 'error',
};

module.exports = {
  LEVEL_INFO_MAP,
  TIP_COLOR,
  TIP_TEXT
};