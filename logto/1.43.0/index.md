---
title: Logto 1.43.0 更新总结
description: Logto 1.43.0 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Logto"
  version="1.43.0"
  date="2026-08-31"
  repository-url="https://github.com/logto-io/logto"
  docs-url="https://docs.logto.io/"
  release-url="https://github.com/logto-io/logto/releases/tag/v1.43.0"
/>

## 概览

这是以安全加固为主的版本，统一强化 Webhook、企业 SSO、令牌交换、第三方 Account API、暂停用户和重定向验证。自托管部署若访问私网服务，需要在升级前配置 SSRF 地址允许列表。

## Breaking Change

- Webhook 或企业 SSO 需要访问私网时，升级前必须把目标 IP/CIDR 加入 `SSRF_ALLOWED_ADDRESSES`。
- 自定义 JWT 与 Actions 脚本新增 5 秒、128 MB 和 JSON 可序列化返回值限制。
- 版本包含数据库结构与索引变化，必须执行 alteration deploy。

## Bugfix / Security

- 加强 Webhook 与企业 SSO 的 SSRF 防护及令牌交换校验。
- 阻止暂停用户获取新令牌，并重新验证第三方应用作用域。
- 改进标识符锁定、重定向、认证授权、Account Center、Webhook 交付和 Azure AD 连接器。
