---
title: Logto 1.39.0 更新总结
description: Logto 1.39.0 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Logto"
  version="1.39.0"
  date="2026-04-30"
  repository-url="https://github.com/logto-io/logto"
  docs-url="https://docs.logto.io/"
  release-url="https://github.com/logto-io/logto/releases/tag/v1.39.0"
/>

## 概览

本版本聚焦密钥轮换、JWT 自定义脚本故障策略和 Account Center 安全管理，并新增 WhatsApp 连接器。

## New Feature

- 私钥轮换支持宽限期，降低 JWKS 缓存造成的停机风险。
- JWT 自定义脚本失败时可阻止令牌签发。
- Account Center 新增社交账号绑定、MFA 与账户删除管理。
- 新增基于 Meta Cloud API 的 WhatsApp 连接器。

## Bugfix / Security

- 统一忘记密码验证响应以降低账户枚举风险。
- 改善应用内浏览器中的社交登录与 SSO 重定向，并传递验证码请求 IP。
