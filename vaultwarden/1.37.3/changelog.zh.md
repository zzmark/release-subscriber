## 变更内容

* 修复使用新版 web-vault 时无法更改密码的问题，贡献者 @BlackDex：https://github.com/dani-garcia/vaultwarden/pull/7634
* 清理：删除 `ciphers.rs` 注释中重复的“the”，贡献者 @mvanhorn：https://github.com/dani-garcia/vaultwarden/pull/7254
* 邮件功能禁用时，忽略密码重置流程中的自动注册，贡献者 @xhon-pelushi：https://github.com/dani-garcia/vaultwarden/pull/7585
* 修复 MariaDB 12.2.2 的数据库迁移问题，贡献者 @Timshel：https://github.com/dani-garcia/vaultwarden/pull/7265
* 新增 `SSO_SIGNUPS_ALLOWED` 配置项，贡献者 @Timshel：https://github.com/dani-garcia/vaultwarden/pull/7272
* 将 `log_event` 的参数类型由 `i32` 改为枚举，贡献者 @Timshel：https://github.com/dani-garcia/vaultwarden/pull/7656
* 多项常规更新，贡献者 @BlackDex：https://github.com/dani-garcia/vaultwarden/pull/7676
* 更新 Rust Docker 版本，贡献者 @dani-garcia：https://github.com/dani-garcia/vaultwarden/pull/7689
* 修复导入组织时因缺少 `groups` 字段而失败的问题，贡献者 @tom27052006：https://github.com/dani-garcia/vaultwarden/pull/7699
* 新增 `pm-32413-multi-client-password-management` 功能标志，贡献者 @tom27052006：https://github.com/dani-garcia/vaultwarden/pull/7677
* 双重验证邮件登录的凭据校验失败时记录 IP 地址和用户名，贡献者 @crahn：https://github.com/dani-garcia/vaultwarden/pull/7654
* 支持管理员重置双重验证，贡献者 @Timshel：https://github.com/dani-garcia/vaultwarden/pull/7435
* 安全修复：凭据或双重验证设置变更时撤销双重验证记忆令牌，贡献者 @BryanFRD：https://github.com/dani-garcia/vaultwarden/pull/7682
* 安全修复：对预登录和身份验证请求端点实施速率限制，贡献者 @BryanFRD：https://github.com/dani-garcia/vaultwarden/pull/7681
* 修正 `.dockerignore` 中无效的注释语法，贡献者 @niniconi：https://github.com/dani-garcia/vaultwarden/pull/7274
* 更新 Rust 并调整 `DockerSettings`，贡献者 @BlackDex：https://github.com/dani-garcia/vaultwarden/pull/7690
* 让服务客户端统一使用共享 HTTP 配置，贡献者 @txase：https://github.com/dani-garcia/vaultwarden/pull/7639
* 修复 iOS 注册令牌响应，贡献者 @tom27052006：https://github.com/dani-garcia/vaultwarden/pull/7714
* 在可行时使用 `insert_into`，贡献者 @Timshel：https://github.com/dani-garcia/vaultwarden/pull/6437
* 修复 `archiveDate` 更新问题，贡献者 @BlackDex：https://github.com/dani-garcia/vaultwarden/pull/7722

## 新贡献者

* @mvanhorn 首次贡献：https://github.com/dani-garcia/vaultwarden/pull/7254
* @xhon-pelushi 首次贡献：https://github.com/dani-garcia/vaultwarden/pull/7585
* @crahn 首次贡献：https://github.com/dani-garcia/vaultwarden/pull/7654
* @BryanFRD 首次贡献：https://github.com/dani-garcia/vaultwarden/pull/7682
* @niniconi 首次贡献：https://github.com/dani-garcia/vaultwarden/pull/7274

**完整变更对比**：https://github.com/dani-garcia/vaultwarden/compare/1.37.2...1.37.3
