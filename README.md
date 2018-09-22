# wda-test
just a wda test project.

## course
1. 你需要自己安装和启动 WebDriverAgent

可以跟着官方文档安装： <https://github.com/facebook/WebDriverAgent>

你可以从xcode里面启动调试程序

也可以直接命令行启动, 修改`script/test.sh`并执行就可以跑了，前提是将其中的电脑密码与手机udid修改正确。

2. 安装usb代理
```bash
brew update
brew install libimobiledevice
# iproxy 8100 8100
```

3. 运行本项目
```bash
yarn install
yarn start
```
