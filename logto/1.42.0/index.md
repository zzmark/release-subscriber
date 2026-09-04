---
title: Logto 1.42.0 更新总结
description: Logto 1.42.0 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Logto"
  version="1.42.0"
  date="2026-07-30"
  repository-url="https://github.com/logto-io/logto"
  docs-url="https://docs.logto.io/"
  release-url="https://github.com/logto-io/logto/releases/tag/v1.42.0"
/>

## 概览

本版本增加自定义域名验证文件、邮箱访问规则和密码重置 Magic Link，并升级核心 OIDC 与 HTTP 框架。自托管环境需特别处理默认启用的 SSRF 防护并执行数据库迁移。

## Breaking Change

- OIDC Provider SSRF 防护默认启用；需要访问私网 relying-party 的自托管部署必须显式设置兼容变量。
- 升级包含数据库结构变化，启动新版本前必须执行 alteration deploy。

## New Feature

- 自定义域名可直接提供文本或 JSON 验证文件。
- 邮箱允许列表与阻止列表支持地址、域名和通配符。
- 密码重置页面支持一次性令牌 Magic Link。
- 新增 `Grant.LimitExceeded` Webhook，并升级至 node-oidc-provider v9 与 Koa 3。

## Bugfix / Security

- 强化安全与 API、Account Center、数据完整性和存储。
- 更新 Apple、Google、OAuth、OIDC 及阿里云短信连接器兼容性。
