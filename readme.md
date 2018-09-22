## wda-test
这是一个使用wda控制手机的test repo.

## course

1. 你需要自己安装和启动 WebDriverAgent

可以跟着官方文档安装： <https://github.com/facebook/WebDriverAgent>

你可以从xcode里面启动调试程序

也可以直接命令行启动，这个在script里面有一个`test.sh`，你可以编写好之后直接运行`sh test.sh`即可，前提是你替换掉脚本中的手机udid与电脑的登录密码

2. 安装ip代理，加快真机与电脑的链接速度与稳定性

```bash
# 首先你需要安装brew
brew update
brew install libimobiledevice
# 使用代理
# iproxy 8100 8100
```

3. 接下来安装本仓库
```bash
yarn install
```

4. 运行
```bash
yarn start
```

## 日常使用
1. 首先打开`test.sh`
2. 然后执行`iproxy`
3. 运行本仓库