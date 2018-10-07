# wda-test
just a wda test project.

## pre-course
你需要安装下面的一些工具(使用[Homebrew](https://brew.sh/))
```bash
# 此处默认homebrew已经安装
brew update # 拉取最新仓库
brew install carthage
brew install libimobiledevice # 代理相关，下面有用到
[cmake](https://cmake.org/download/)
```

export http_proxy='http://localhost:1081'
export https_proxy='http://localhost:1081'

## course
1. WebDriverAgent相关
```bash
yarn wda-clone # 如果wda-test项目中没有WebDriverAgent文件夹的话先clone一个
yarn wda-update # 拉取WebDriverAgent最新的代码
yarn wda-init # 最好开个代理，这样下载的会一点
```
安装完之后用xcode打开此项目然后配置一遍一些信息，具体参照[官方文档](https://github.com/facebook/WebDriverAgent)，此处省略。

用xcode配置完第一遍之后直接跑脚本就可以快捷开启了，修改`script/test.sh`并执行，前提是将其中的电脑密码与手机udid修改正确。
```bash
yarn wda # 前提是script/test.sh的信息已经配置完毕
```

2. 启用usb代理
```bash
# iproxy 8100 8100
```

3. 运行本项目
```bash
yarn install
yarn start
```
