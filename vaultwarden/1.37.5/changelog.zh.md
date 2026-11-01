## 安全修复
本版本包含以下安全公告对应的修复。我们强烈建议尽快更新。
- 网站图标 [[GHSA-x9cq-f669-vrr4]](https://github.com/dani-garcia/vaultwarden/security/advisories/GHSA-x9cq-f669-vrr4)（**中危**，5.3）
- 紧急访问 [[GHSA-9pjj-f9g5-3x4c]](https://github.com/dani-garcia/vaultwarden/security/advisories/GHSA-9pjj-f9g5-3x4c)（**中危**，4.3）

这些公告目前尚未公开，正在等待分配 CVE 编号，稍后将发布。

## 说明
网页密码库 2026.7.1 及更新版本需要本次更新才能启用或关闭两步登录方式；2026.9.0 及更新版本需要本次更新才能通过紧急访问接管账户。报告这些功能的问题前，请先更新。

## 升级注意事项
- **网页密码库：** 随附的网页密码库现在为 v2026.10.1。如果您自行提供的网页密码库早于 v2026.7.1，可能遇到兼容性问题。
- **配置：** 无效值现在会导致启动报错并停止。数值选项使用更严格的类型，因此会拒绝负数或过大的值；例如，`LOGIN_RATELIMIT_MAX_BURST`、`TRASH_AUTO_DELETE_DAYS`、`EVENTS_DAYS_RETAIN` 或 `SMTP_TIMEOUT` 不得超过 65535，`EMAIL_ATTEMPTS_LIMIT` 不得超过 255。速率限制选项 `*_SECONDS`、`*_MAX_BURST`，以及 `DATABASE_TIMEOUT` 和 `DATABASE_IDLE_TIMEOUT` 必须至少为 1；`DATABASE_MIN_CONNS` 不得大于 `DATABASE_MAX_CONNS`；`DUO_CONTEXT_PURGE_SCHEDULE` 和 `PURGE_INCOMPLETE_SSO_AUTH` 必须为空或为有效的 cron 表达式。

## 变更内容
* 关闭不再响应的 WebSocket 连接，贡献者 @Cassian433：https://github.com/dani-garcia/vaultwarden/pull/7807
* 在启动时校验 Duo 和 SSO 清理计划，贡献者 @NotAFlightRisk：https://github.com/dani-garcia/vaultwarden/pull/7819
* 文档：修复 Playwright README 中的“runnning”拼写错误，贡献者 @ump45nose：https://github.com/dani-garcia/vaultwarden/pull/7787
* 文档：修复 Playwright 测试环境链接，贡献者 @dajiaohuang：https://github.com/dani-garcia/vaultwarden/pull/7739
* 修复分组导入，使分组在数据变化时得到更新，贡献者 @Jogius：https://github.com/dani-garcia/vaultwarden/pull/7671
* [Web 2026.9.0] 支持新的紧急访问密码载荷，贡献者 @tom27052006：https://github.com/dani-garcia/vaultwarden/pull/7746
* [Web 2026.9.0] 支持新的账户恢复密码载荷，贡献者 @tom27052006：https://github.com/dani-garcia/vaultwarden/pull/7747
* [web-v2026.7.1] 为验证器、电子邮件和 Duo 双重验证支持 userVerificationToken，贡献者 @Timshel：https://github.com/dani-garcia/vaultwarden/pull/7563
* 修复 iOS 和 Android 上 SSO 登录的电子邮件双重验证问题，贡献者 @dani-garcia：https://github.com/dani-garcia/vaultwarden/pull/7827
* 将网页密码库更新至 v2026.8.0，贡献者 @dani-garcia：https://github.com/dani-garcia/vaultwarden/pull/7828
* 为组织策略添加 revision_date，贡献者 @will-lottkowitz-prism：https://github.com/dani-garcia/vaultwarden/pull/7571
* 新增 Windows 桌面端自动输入（Autotype）功能标志和策略支持，贡献者 @tom27052006：https://github.com/dani-garcia/vaultwarden/pull/7808
* 新增 `biometrics-sdk-ipc` 功能标志（关闭 #7812），贡献者 @cad0p：https://github.com/dani-garcia/vaultwarden/pull/7813
* 删除用户时删除认证请求，贡献者 @Cassian433：https://github.com/dani-garcia/vaultwarden/pull/7837
* 新增未获官方支持的 riscv64 架构，贡献者 @BlackDex：https://github.com/dani-garcia/vaultwarden/pull/7859
* api/icons：修复最小 PNG 尺寸注释中的拼写错误，贡献者 @ump45nose：https://github.com/dani-garcia/vaultwarden/pull/7867
* 文档：修复 connect-src 说明的语法，贡献者 @ump45nose：https://github.com/dani-garcia/vaultwarden/pull/7866
* 更新依赖，贡献者 @BlackDex：https://github.com/dani-garcia/vaultwarden/pull/7882
* 修复作业和配置方面的多项问题，贡献者 @BlackDex：https://github.com/dani-garcia/vaultwarden/pull/7858
* 同步时为未确认的成员发送空的组织密钥，贡献者 @minchinweb：https://github.com/dani-garcia/vaultwarden/pull/7850
* 在 collections/details 中返回分组已存储的 manage 标志，贡献者 @deltatree：https://github.com/dani-garcia/vaultwarden/pull/7795
* 修复面向 SDK 客户端的密码库条目批量共享响应，贡献者 @tom27052006：https://github.com/dani-garcia/vaultwarden/pull/7831
* 升级至 Rocket v0.5.2，贡献者 @BlackDex：https://github.com/dani-garcia/vaultwarden/pull/7890
* 修复 vaultwarden.env 中的拼写错误，贡献者 @Arthurmeade12：https://github.com/dani-garcia/vaultwarden/pull/7864
* 从图标 Cookie 容器中移除已过期的 Cookie，贡献者 @dani-garcia：https://github.com/dani-garcia/vaultwarden/pull/7905
* 附件修复：在 v2 元数据预留阶段强制执行配额，贡献者 @lucavb：https://github.com/dani-garcia/vaultwarden/pull/7450
* 将密码库条目的组织检查和附件通知与上游对齐，贡献者 @dani-garcia：https://github.com/dani-garcia/vaultwarden/pull/7906
* 在 .env.template 中记录两个功能标志，贡献者 @MichaelMuClaude：https://github.com/dani-garcia/vaultwarden/pull/7841
* 修复推送设备注销端点，贡献者 @xkmttc：https://github.com/dani-garcia/vaultwarden/pull/7891
* 不在批量成员响应中返回内部错误详情；为 SSO 令牌日志输出增加条件限制，贡献者 @tauanbinato：https://github.com/dani-garcia/vaultwarden/pull/7777
* [Web 2026.9.0] 新增 Fill Assist 及策略支持，贡献者 @tom27052006：https://github.com/dani-garcia/vaultwarden/pull/7791
* 新增注册电子邮件验证链接点击端点，贡献者 @tom27052006：https://github.com/dani-garcia/vaultwarden/pull/7790
* 允许配置双重验证的记住时长，贡献者 @tom27052006：https://github.com/dani-garcia/vaultwarden/pull/7421
* 批量移动密码库条目时，仅更新一次用户修订版本，贡献者 @MichaelMuClaude：https://github.com/dani-garcia/vaultwarden/pull/7840
* 删除用户时发送注销通知，贡献者 @Cassian433：https://github.com/dani-garcia/vaultwarden/pull/7839
* 为与上游保持一致修复两处小问题，贡献者 @dani-garcia：https://github.com/dani-garcia/vaultwarden/pull/7918
* 补充缺失的 HTTP 认证和策略撤销审计事件，贡献者 @tom27052006：https://github.com/dani-garcia/vaultwarden/pull/7919
* 修复 Clippy 问题，更新 Rust crate 依赖和网页密码库，贡献者 @BlackDex：https://github.com/dani-garcia/vaultwarden/pull/7920
* 转义日志消息中的请求值，贡献者 @dani-garcia：https://github.com/dani-garcia/vaultwarden/pull/7921

## 新贡献者
* @Cassian433 首次贡献见 https://github.com/dani-garcia/vaultwarden/pull/7807
* @NotAFlightRisk 首次贡献见 https://github.com/dani-garcia/vaultwarden/pull/7819
* @ump45nose 首次贡献见 https://github.com/dani-garcia/vaultwarden/pull/7787
* @dajiaohuang 首次贡献见 https://github.com/dani-garcia/vaultwarden/pull/7739
* @Jogius 首次贡献见 https://github.com/dani-garcia/vaultwarden/pull/7671
* @will-lottkowitz-prism 首次贡献见 https://github.com/dani-garcia/vaultwarden/pull/7571
* @minchinweb 首次贡献见 https://github.com/dani-garcia/vaultwarden/pull/7850
* @deltatree 首次贡献见 https://github.com/dani-garcia/vaultwarden/pull/7795
* @Arthurmeade12 首次贡献见 https://github.com/dani-garcia/vaultwarden/pull/7864
* @lucavb 首次贡献见 https://github.com/dani-garcia/vaultwarden/pull/7450
* @MichaelMuClaude 首次贡献见 https://github.com/dani-garcia/vaultwarden/pull/7841
* @xkmttc 首次贡献见 https://github.com/dani-garcia/vaultwarden/pull/7891
* @tauanbinato 首次贡献见 https://github.com/dani-garcia/vaultwarden/pull/7777

**完整更新日志**： https://github.com/dani-garcia/vaultwarden/compare/1.37.4...1.37.5