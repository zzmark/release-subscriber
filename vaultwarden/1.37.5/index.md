---
title: Vaultwarden 1.37.5 更新总结
description: Vaultwarden 1.37.5 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Vaultwarden"
  version="1.37.5"
  date="2026-11-01"
  repository-url="https://github.com/dani-garcia/vaultwarden"
  docs-url="https://github.com/dani-garcia/vaultwarden/wiki"
  release-url="https://github.com/dani-garcia/vaultwarden/releases/tag/1.37.5"
/>

## 概览

Vaultwarden 1.37.5 修复网站图标和紧急访问相关安全问题，随附网页密码库升级至 v2026.10.1，并加强启动时配置校验。官方强烈建议尽快更新；升级前需检查数值配置和清理计划，自行部署旧版网页密码库的用户还需注意兼容性。

## Breaking Change

- 无效配置会导致启动报错并停止。数值选项拒绝负数或过大的值：`LOGIN_RATELIMIT_MAX_BURST`、`TRASH_AUTO_DELETE_DAYS`、`EVENTS_DAYS_RETAIN`、`SMTP_TIMEOUT` 不得超过 65535，`EMAIL_ATTEMPTS_LIMIT` 不得超过 255。
- 速率限制的 `*_SECONDS`、`*_MAX_BURST`，以及 `DATABASE_TIMEOUT`、`DATABASE_IDLE_TIMEOUT` 必须至少为 1；`DATABASE_MIN_CONNS` 不得大于 `DATABASE_MAX_CONNS`；`DUO_CONTEXT_PURGE_SCHEDULE` 和 `PURGE_INCOMPLETE_SSO_AUTH` 必须为空或有效 cron 表达式。
- 随附网页密码库为 v2026.10.1，自行提供早于 v2026.7.1 的版本可能存在兼容性问题。网页密码库 2026.7.1+ 的两步登录方式开关，以及 2026.9.0+ 的紧急访问账户接管功能，要求此次服务端更新。

## New Feature

- 支持新的紧急访问和账户恢复密码载荷，以及验证器、电子邮件和 Duo 的 `userVerificationToken`；支持配置双重验证的记住时长。
- 新增 Windows 桌面端 Autotype 功能标志及策略、`biometrics-sdk-ipc` 功能标志，以及 Fill Assist 与策略支持。
- 为组织策略增加 revision_date，新增注册邮件验证链接点击端点，补充 HTTP 认证和策略撤销审计事件。

## Bugfix / Security

- 修复网站图标相关的 [GHSA-x9cq-f669-vrr4](https://github.com/dani-garcia/vaultwarden/security/advisories/GHSA-x9cq-f669-vrr4)（中危，5.3）及紧急访问相关的 [GHSA-9pjj-f9g5-3x4c](https://github.com/dani-garcia/vaultwarden/security/advisories/GHSA-9pjj-f9g5-3x4c)（中危，4.3）。原文说明公告尚未公开，正在等待分配 CVE 编号。
- 修复 iOS／Android 上 SSO 登录的电子邮件双重验证、分组导入、SDK 客户端批量共享、集合分组管理标志和推送设备注销等问题。
- 在附件 v2 元数据预留阶段执行配额限制；批量成员响应不再返回内部错误详情，SSO 令牌日志输出增加条件限制，日志中的请求值经过转义。
- 关闭不响应的 WebSocket，移除过期图标 Cookie；删除用户时清理认证请求并发送注销通知，批量移动密码库条目时仅更新一次用户修订版本。
- 升级 Rocket 至 v0.5.2，更新 Rust crate 依赖和网页密码库，并修复作业、配置及文档问题。
