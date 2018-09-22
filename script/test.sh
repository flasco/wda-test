# 解锁keychain以便正常签名应用
PASSWORD= $(你的电脑登录密码)
# just like this => PASSWORD= "123456789"
security unlock-keychain -p $PASSWORD ~/Library/Keychains/login.keychain

# 获取设备的UDID
UDID="123456789"

#cd $(你的WebDriverAgent所在目录)
xcodebuild -project ./WebDriverAgent.xcodeproj -scheme WebDriverAgentRunner -destination "id=$UDID" test
