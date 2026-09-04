## 注意

此补丁版本解决了邀请相关问题。
如果你曾在本地应用临时解决方案，请撤销这些修改，以免引发其他问题。

很抱歉，本次修复的检查和验证花费了一些时间。

此外，本版本修复了所有使用 https://github.com/BlackDex/rust-musl/ 构建的 Alpine 镜像所存在的问题（#7475）。构建镜像中的 OpenSSL 编译问题已经解决，新的 `alpine` 标签容器使用了修复后的构建镜像。

## 变更内容

* 邀请 URL 始终发送 `initOrganization` 和 `orgUserHasExistingUser`，贡献者 @vikfox：https://github.com/dani-garcia/vaultwarden/pull/7482
* 使用新版 rust-musl 构建镜像，间接解决其 OpenSSL 编译问题 #7475。

## 新贡献者

* @vikfox 首次贡献：https://github.com/dani-garcia/vaultwarden/pull/7482

**完整变更对比**：https://github.com/dani-garcia/vaultwarden/compare/1.37.0...1.37.1
