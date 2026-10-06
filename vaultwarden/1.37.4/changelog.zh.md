## 安全修复
本版本包含以下安全公告对应的修复。我们强烈建议尽快更新。
- 组织成员撤销 [[GHSA-69q9-v8p6-xvx3]](https://github.com/dani-garcia/vaultwarden/security/advisories/GHSA-69q9-v8p6-xvx3)（**高危**，8.1）
- 双重验证 [[GHSA-7jg8-8m5x-6j9r]](https://github.com/dani-garcia/vaultwarden/security/advisories/GHSA-7jg8-8m5x-6j9r)（**中危**，6.8）
- 组织邀请 [[GHSA-v576-3wvq-xh3c]](https://github.com/dani-garcia/vaultwarden/security/advisories/GHSA-v576-3wvq-xh3c)（**中危**，6.8）
- 附件 [[GHSA-q5x6-grh5-fqgc]](https://github.com/dani-garcia/vaultwarden/security/advisories/GHSA-q5x6-grh5-fqgc)（**中危**，6.5）
- 组织事件日志 [[GHSA-64mc-4p6f-r7x9]](https://github.com/dani-garcia/vaultwarden/security/advisories/GHSA-64mc-4p6f-r7x9)（**中危**，4.3）
- 密码库条目共享 [[GHSA-7ccc-c43j-4p36]](https://github.com/dani-garcia/vaultwarden/security/advisories/GHSA-7ccc-c43j-4p36)（**中危**，4.3）
- 组织 API 密钥 [[GHSA-qwx4-wcv4-mpcv]](https://github.com/dani-garcia/vaultwarden/security/advisories/GHSA-qwx4-wcv4-mpcv)（**低危**，3.8）
- 其他依赖更新和小幅安全增强

这些公告目前尚未公开，正在等待分配 CVE 编号，稍后将发布。

> [!NOTE]
> 如果组织中有你不完全信任的管理员，请考虑在更新后轮换组织的 API 密钥（管理控制台 → 设置 → 轮换 API 密钥）。在本版本之前，管理员也能查看该密钥。

## 升级注意事项
- **反向代理：** 设置 `IP_HEADER=X-Forwarded-For` 时，客户端 IP 现在取不在 `IP_HEADER_TRUSTED_PROXIES` 中的最右侧地址（此前取最左侧地址）。如果有多层代理串联，例如 nginx 前面还有 CDN，请将所有代理都加入 `IP_HEADER_TRUSTED_PROXIES`。否则，前置代理的地址会被用于速率限制和日志记录。
- **Sends：** CLI 2026.4.2 及更早版本中的 `bw send receive` 不再可用；自 v2026.8.0 起，连接 Bitwarden 自有服务器时也存在相同情况。所有客户端仍可创建和管理 Sends。
- **功能标志：** 以下标志已被移除，因为已没有客户端读取它们：`ssh-agent`、`ssh-key-vault-item`、`mutual-tls`、`anon-addy-self-host-alias`、`simple-login-self-host-alias`、`pm-25373-windows-biometrics-v2`、`pm-26340-linux-biometrics-v2`、`desktop-ui-migration-milestone-1` 到 `-4`、`cxp-import-mobile` 和 `cxp-export-mobile`。如果 `EXPERIMENTAL_CLIENT_FEATURE_FLAGS` 中仍列有这些标志之一，启动时会记录警告，且在移除该标志之前，管理面板保存设置会失败。
- **Duo：** `DUO_USE_IFRAME`（已弃用的 Traditional Prompt）已被移除，设置后也会被忽略。
- **自定义模板：** 新增邮件模板 `email/recover_twofactor`，使用双重验证恢复码登录后会发送该邮件。
- 旧版 `POST /identity/accounts/register` 和 `POST /api/accounts/prelogin` 端点已被移除。目前的客户端均不使用这些端点。

## 变更内容
* [Web 2026.9.0] 支持密码库横幅策略，贡献者 @tom27052006：https://github.com/dani-garcia/vaultwarden/pull/7748
* 新增对 Basic Auth 响应客户端功能标志的支持，贡献者 @tom27052006：https://github.com/dani-garcia/vaultwarden/pull/7745
* [web-v2026.8.1] 存储用户密钥 ID，贡献者 @Timshel：https://github.com/dani-garcia/vaultwarden/pull/7693
* 在同步响应中添加 organizationsNew 和 policiesNew，贡献者 @tom27052006：https://github.com/dani-garcia/vaultwarden/pull/7666
* 新增 `pm-32009-new-item-types` 功能标志，贡献者 @bdd：https://github.com/dani-garcia/vaultwarden/pull/7478
* 更新 Rust crate 依赖、GitHub Actions 和 JavaScript，贡献者 @BlackDex：https://github.com/dani-garcia/vaultwarden/pull/7751
* 新增 `pm-34171-card-scanner` 功能标志，贡献者 @bdd：https://github.com/dani-garcia/vaultwarden/pull/7477
* 为每个独立邀请设置 user_created 布尔值，贡献者 @stefan0xC：https://github.com/dani-garcia/vaultwarden/pull/7753
* 修复已撤销的组织成员仍能访问组织密码库条目的问题，贡献者 @abhiShandy：https://github.com/dani-garcia/vaultwarden/pull/7554
* 确保所有检查用户权限的路由也检查成员是否处于已确认状态，贡献者 @dani-garcia：https://github.com/dani-garcia/vaultwarden/pull/7763
* 修复使用 xx-cargo 时的 cortex-a53 构建问题，贡献者 @BlackDex：https://github.com/dani-garcia/vaultwarden/pull/7774
* 新增 `undetermined-cipher-scenario-logic` 功能标志（关闭 #7801），贡献者 @cad0p：https://github.com/dani-garcia/vaultwarden/pull/7802
* 将 Windows 原生凭据同步加入支持的功能标志，贡献者 @KingIronMan2011：https://github.com/dani-garcia/vaultwarden/pull/7798
* EMAIL_CHANGE_ALLOWED 为 false 时，隐藏整个更改邮箱部分，贡献者 @tom27052006：https://github.com/dani-garcia/vaultwarden/pull/7759
* 修复所有目标上的 Clippy 警告，贡献者 @tom27052006：https://github.com/dani-garcia/vaultwarden/pull/7782
* 管理员重置：双重验证的邮件回退方式需要已验证的邮箱，贡献者 @Timshel：https://github.com/dani-garcia/vaultwarden/pull/7770
* Sends 清理：移除旧版端点并与上游保持一致，贡献者 @dani-garcia：https://github.com/dani-garcia/vaultwarden/pull/7806
* 移除旧版 API 端点和兼容性代码，贡献者 @dani-garcia：https://github.com/dani-garcia/vaultwarden/pull/7809
* 使 API 与上游保持一致，并移除 unwrap 调用，贡献者 @dani-garcia：https://github.com/dani-garcia/vaultwarden/pull/7810
* 更新 crate 依赖、Rust 和其他依赖，贡献者 @BlackDex：https://github.com/dani-garcia/vaultwarden/pull/7814

## 新贡献者
* @bdd 首次贡献：https://github.com/dani-garcia/vaultwarden/pull/7478
* @abhiShandy 首次贡献：https://github.com/dani-garcia/vaultwarden/pull/7554
* @cad0p 首次贡献：https://github.com/dani-garcia/vaultwarden/pull/7802
* @KingIronMan2011 首次贡献：https://github.com/dani-garcia/vaultwarden/pull/7798

**完整变更对比**：https://github.com/dani-garcia/vaultwarden/compare/1.37.3...1.37.4