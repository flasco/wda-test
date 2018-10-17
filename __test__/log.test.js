const Base = require('../src/core/base');
const { LEVEL_INFO_MAP } = require('../src/constants');

test('test log color', async () => {
  const BaseTest = new Base({});
  BaseTest.log('测试', LEVEL_INFO_MAP.info);
  BaseTest.log('测试', LEVEL_INFO_MAP.warn);
  BaseTest.log('测试', LEVEL_INFO_MAP.error);
  BaseTest.log('测试', LEVEL_INFO_MAP.success);
});
