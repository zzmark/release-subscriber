---
title: Logto 1.38.0 更新总结
description: Logto 1.38.0 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Logto"
  version="1.38.0"
  date="2026-03-31"
  repository-url="https://github.com/logto-io/logto"
  docs-url="https://docs.logto.io/"
  release-url="https://github.com/logto-io/logto/releases/tag/v1.38.0"
/>

## 概览

这是一次身份验证能力大幅扩展的版本，新增设备授权、Passkey、Adaptive MFA、用户会话和授权应用管理，并为自托管运维提供更多配置项。

## Breaking Change

- 升级包含上游列出的破坏性变化；部署前应核对原始 Changelog 的迁移要求。

## New Feature

- 支持 OAuth 2.0 Device Authorization Grant。
- 提供 Passkey-first 登录、Adaptive MFA 和可选 MFA 引导。
- 新增用户会话、应用授权及并发授权上限管理。
- 增强 Account Center、令牌交换、密码哈希导出和本地化。

## Performance

- 优化 OIDC adapter 查询与令牌交换路径。

## Bugfix / Security

- 强化 MFA 验证保护，改善 Postgres 启动、旧密码导入、Account Center 自动填充和 Twilio SMS 格式。
