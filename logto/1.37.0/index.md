---
title: Logto 1.37.0 更新总结
description: Logto 1.37.0 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Logto"
  version="1.37.0"
  date="2026-02-28"
  repository-url="https://github.com/logto-io/logto"
  docs-url="https://docs.logto.io/"
  release-url="https://github.com/logto-io/logto/releases/tag/v1.37.0"
/>

## 概览

本版本推出内置 Account Center，并让 JWT Customizer 获取应用上下文、支持配置额外 ID Token Claims。重点面向最终用户自助账户管理和令牌声明定制。

## New Feature

- 提供可直接使用的内置 Account Center 单页应用。
- JWT Customizer 脚本可读取应用上下文。
- 可通过 Console 或 Management API 配置额外 ID Token Claims。

## Bugfix / Security

- 修复自定义域名下内置应用回调 URI、个人信息区显示和社交账号绑定流程上下文。
