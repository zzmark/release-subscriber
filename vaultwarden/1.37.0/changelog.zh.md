## 注意

此更新是支持 2026.7.0 及更高版本客户端所必需的；使用这些客户端遇到问题时，请先升级再提交报告。

## 安全修复

本版本包含以下安全公告对应的修复。官方强烈建议尽快升级。

- 图标端点存在 SSRF：[[GHSA-hw4g-2v3f-74x5]](https://github.com/dani-garcia/vaultwarden/security/advisories/GHSA-hw4g-2v3f-74x5)、[[GHSA-vh5m-fc9v-m84g]](https://github.com/dani-garcia/vaultwarden/security/advisories/GHSA-vh5m-fc9v-m84g)（**中危**，5.8 / 6.3）
- 跨组织访问密码项目：[[GHSA-xwf8-pjh7-h589]](https://github.com/dani-garcia/vaultwarden/security/advisories/GHSA-xwf8-pjh7-h589)（**中危**，5.9）
- 目录导入绕过组织策略：[[GHSA-88qc-6ch9-mc3j]](https://github.com/dani-garcia/vaultwarden/security/advisories/GHSA-88qc-6ch9-mc3j)（**中危**，5.5）
- 绕过 Send 访问次数限制：[[GHSA-rxhg-2pw9-vf25]](https://github.com/dani-garcia/vaultwarden/security/advisories/GHSA-rxhg-2pw9-vf25)（**中危**，5.3）
- 未认证 WebSocket 洪泛拒绝服务：[[GHSA-96f7-78q5-j345]](https://github.com/dani-garcia/vaultwarden/security/advisories/GHSA-96f7-78q5-j345)（**中危**，5.3）
- 跨组织共享机密：[[GHSA-455c-vgg9-jxw8]](https://github.com/dani-garcia/vaultwarden/security/advisories/GHSA-455c-vgg9-jxw8)（**中危**，4.3）
- 组织导入授权问题：[[GHSA-f3qw-qg77-hmm4]](https://github.com/dani-garcia/vaultwarden/security/advisories/GHSA-f3qw-qg77-hmm4)、[[GHSA-jq2g-h4xr-4mcr]](https://github.com/dani-garcia/vaultwarden/security/advisories/GHSA-jq2g-h4xr-4mcr)（**中危**，4.3）
- Manager 角色可枚举组织数据：[[GHSA-rqf8-2568-r7mc]](https://github.com/dani-garcia/vaultwarden/security/advisories/GHSA-rqf8-2568-r7mc)（**中危**，4.3）

这些安全公告当时仍为私有状态，等待分配 CVE 后再公开。

## 变更内容

* 支持 OpenDAL S3 参数，贡献者 @txase：https://github.com/dani-garcia/vaultwarden/pull/6127
* 修复 SSO Cookie 路径，贡献者 @BlackDex：https://github.com/dani-garcia/vaultwarden/pull/7187
* 修复 Bitwarden CLI 的邮件双因素认证，贡献者 @stefan0xC：https://github.com/dani-garcia/vaultwarden/pull/7225
* 改进 `sso_auth`，贡献者 @Timshel：https://github.com/dani-garcia/vaultwarden/pull/7197
* 遇到无法识别的 `DATABASE_URL` 时拒绝启动，不再静默回退到 SQLite，贡献者 @mfw78：https://github.com/dani-garcia/vaultwarden/pull/7061
* 切换至 `xx-cargo`，贡献者 @dfunkt：https://github.com/dani-garcia/vaultwarden/pull/6640
* 多项更新与修复，贡献者 @BlackDex：https://github.com/dani-garcia/vaultwarden/pull/7235
* 切换至 Rust Edition 2024，增加 Clippy lint 并减少宏调用，贡献者 @BlackDex：https://github.com/dani-garcia/vaultwarden/pull/7200
* 提供 Apple App Site Association 文件，贡献者 @user71424q：https://github.com/dani-garcia/vaultwarden/pull/7191
* 更新 Rust、依赖 crate 和 GitHub Actions，贡献者 @BlackDex：https://github.com/dani-garcia/vaultwarden/pull/7307
* 修复 enforce blocked 问题，贡献者 @Timshel：https://github.com/dani-garcia/vaultwarden/pull/7246
* 调整管理员密码恢复端点，贡献者 @Timshel：https://github.com/dani-garcia/vaultwarden/pull/7270
* 修复 Send：在同步响应中将 `hideEmail` 输出为非空布尔值，贡献者 @kvdb：https://github.com/dani-garcia/vaultwarden/pull/7283
* 删除组织成员关系时一并移除邀请，贡献者 @Timshel：https://github.com/dani-garcia/vaultwarden/pull/7284
* [v2026.5.0] 更新注册请求，贡献者 @Timshel：https://github.com/dani-garcia/vaultwarden/pull/7295
* [v2026.5.0] `PutPolicy` 改用 vNext 格式，贡献者 @Timshel：https://github.com/dani-garcia/vaultwarden/pull/7296
* 支持 2026.6.0 Send，贡献者 @Timshel：https://github.com/dani-garcia/vaultwarden/pull/7346
* 新增 `SSO_AUTHORIZE_BODY`，贡献者 @Timshel：https://github.com/dani-garcia/vaultwarden/pull/7357
* 新增 `pm-26340-linux-biometrics-v2` 功能标志，贡献者 @pilotstew：https://github.com/dani-garcia/vaultwarden/pull/7358
* 改进 CI，贡献者 @TriplEight：https://github.com/dani-garcia/vaultwarden/pull/6991
* 多项更新与修复，贡献者 @BlackDex：https://github.com/dani-garcia/vaultwarden/pull/7406
* 移除旧版兼容代码，贡献者 @Timshel：https://github.com/dani-garcia/vaultwarden/pull/7434
* 修复使用新版 `rust-musl` 时的编译问题，贡献者 @dfunkt：https://github.com/dani-garcia/vaultwarden/pull/7453
* 修复新对话框标记下自定义角色的 CSS，贡献者 @tom27052006：https://github.com/dani-garcia/vaultwarden/pull/7442
* 移除未使用字段，贡献者 @Timshel：https://github.com/dani-garcia/vaultwarden/pull/7458
* 更新 API 响应、依赖 crate 和 GitHub Actions，贡献者 @BlackDex：https://github.com/dani-garcia/vaultwarden/pull/7470
* 支持可信代理、未认证请求限流及其他修复，贡献者 @dani-garcia：https://github.com/dani-garcia/vaultwarden/pull/7472

## 新贡献者

* @mfw78 首次贡献：https://github.com/dani-garcia/vaultwarden/pull/7061
* @user71424q 首次贡献：https://github.com/dani-garcia/vaultwarden/pull/7191
* @kvdb 首次贡献：https://github.com/dani-garcia/vaultwarden/pull/7283
* @pilotstew 首次贡献：https://github.com/dani-garcia/vaultwarden/pull/7358
* @TriplEight 首次贡献：https://github.com/dani-garcia/vaultwarden/pull/6991
* @tom27052006 首次贡献：https://github.com/dani-garcia/vaultwarden/pull/7442

**完整变更对比**：https://github.com/dani-garcia/vaultwarden/compare/1.36.0...1.37.0
