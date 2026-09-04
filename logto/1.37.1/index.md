---
title: Logto 1.37.1 更新总结
description: Logto 1.37.1 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Logto"
  version="1.37.1"
  date="2026-02-28"
  repository-url="https://github.com/logto-io/logto"
  docs-url="https://docs.logto.io/"
  release-url="https://github.com/logto-io/logto/releases/tag/v1.37.1"
/>

## 概览

这是依赖发布一致性修复，补发此前遗漏版本升级的 `@logto/core-kit@2.7.1`，避免下游包引用尚未发布的扩展 ID Token Claims 导出。

## Bugfix / Security

- 补齐扩展 ID Token Claims 的导出并恢复包版本依赖一致性。
