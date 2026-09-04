> ## Vaultwarden 1.37.0
>
> **发布时间：** 2026-07-24
>
> [版本地址](https://github.com/dani-garcia/vaultwarden/releases/tag/1.37.0) · [官方文档](https://github.com/dani-garcia/vaultwarden/wiki) · [changelog.md](./changelog.md) · [zh](./changelog.zh.md)

## 概览

Vaultwarden 1.37.0 是一次以安全修复和新版 Bitwarden 客户端兼容为核心的重要更新。该版本是支持 Bitwarden 2026.7.0 及以上客户端的必要升级，并集中修复了 8 类中危安全问题，涉及 SSRF、跨组织数据访问、策略绕过、授权校验和未认证 WebSocket 洪泛等风险。

功能层面新增 OpenDAL S3 参数、Apple App Site Association 文件、SSO 授权请求体配置、Linux 生物识别功能标志、可信代理和未认证请求限流支持；同时更新了注册、策略及 Send API，以适配 2026.5.0—2026.7.0 客户端协议。

升级时最需要注意的是数据库配置校验发生变化：无法识别的 `DATABASE_URL` 将直接被拒绝，不再静默回退到 SQLite。此外，管理员密码恢复端点、策略格式和部分 API 响应也有调整，依赖这些行为的自定义部署或集成应在升级前验证。

## Breaking Change

- 无法识别的 `DATABASE_URL` 现在会导致启动失败，不再回退到 SQLite。过去依赖静默回退的错误配置必须先修正。
- 管理员密码恢复端点已调整；调用该端点的脚本或管理工具需要核对兼容性。
- `PutPolicy` 改用 vNext 格式，相关 API 集成需要适配新的请求结构。
- 移除了旧版兼容代码和部分未使用字段；依赖非标准或旧版响应字段的客户端需要验证。

## New Feature

- 新增 OpenDAL S3 参数支持，扩展对象存储配置能力。
- 提供 Apple App Site Association 文件，支持 Apple 平台关联域配置。
- 新增 `SSO_AUTHORIZE_BODY`，并改进 `sso_auth`。
- 新增 `pm-26340-linux-biometrics-v2` 功能标志。
- 新增可信代理支持与未认证请求限流。
- 更新注册、策略和 Send 接口，以兼容新版 Bitwarden 客户端。

## Performance

本版本未单独披露可明确归类的运行时性能优化。构建系统切换到 `xx-cargo`，并对 CI、Rust 工具链和依赖进行了维护性更新。

## Bugfix / Security

- 修复图标端点 SSRF（GHSA-hw4g-2v3f-74x5、GHSA-vh5m-fc9v-m84g）。
- 修复跨组织密码项目访问和跨组织机密共享问题。
- 修复目录导入绕过组织策略、组织导入授权缺失及 Manager 角色枚举组织数据问题。
- 修复 Send 访问次数绕过及未认证 WebSocket 洪泛拒绝服务问题。
- 修复 SSO Cookie 路径、Bitwarden CLI 邮件双因素认证及 enforce blocked 问题。
- 修复 Send 同步响应中的 `hideEmail` 空值问题。
- 修复新版 `rust-musl` 编译和自定义角色对话框 CSS 问题。
