const wda = require('flasco_wda-driver');

describe('测试activeApp的获取', async () => {
  const client = new wda.Client('http://localhost:8100');

  test('测试获取当前app的sessionId', async () => {
    const {
      value: { bundleId },
      sessionId
    } = await client.getActiveAppInfo();
    if (bundleId === 'com.tencent.mqq') {
      console.log('in qq!');
      const session = await client.quickSession(sessionId);
      await session.swipeUp();
    } else {
      console.log('not qq');
      const id2 = await client.startApp('com.tencent.mqq');
      console.log(id2);
      const sessinx = await client.quickSession(id2);
      await sessinx.swipeUp();
    }
  });
});
