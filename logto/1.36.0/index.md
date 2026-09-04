---
title: Logto 1.36.0 更新总结
description: Logto 1.36.0 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Logto"
  version="1.36.0"
  date="2026-01-30"
  repository-url="https://github.com/logto-io/logto"
  docs-url="https://docs.logto.io/"
  release-url="https://github.com/logto-io/logto/releases/tag/v1.36.0"
/>

## 概览

本版本扩展了动态部署、令牌交换和企业身份连接能力，并增强社交登录、角色 API 与 SDK。升级重点包括通配符回调地址、应用级令牌交换开关，以及对未验证 OIDC 邮箱的可选信任。

## New Feature

- Web 回调 URI 支持受约束的通配符模式。
- 令牌交换新增应用级控制，并支持 M2M 应用。
- OIDC 连接器可配置是否信任未验证邮箱。
- 社交注册可跳过必填标识符收集，并增强用户角色 API 与 `@logto/api` SDK。

## Bugfix / Security

- 改善 PgBouncer/RDS Proxy 的 Postgres 超时兼容性。
- 修正企业 SSO 错误码、JIT 邮箱域分页、直接登录重复请求和审计日志筛选。
