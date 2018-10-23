const notifier = require('node-notifier');

test('notifier', () => {
  // 现在的问题是怎么只提示一个，而不是重复弹很多个
  notifier.notify(
    {
      title: '是',
      message: '发现一些问题！',
      sound: 'Funk', // Only Notification Center or Windows Toasters
    }
  );
});
