---
title: HyperDX 2.33.0 更新总结
description: HyperDX 2.33.0 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="HyperDX"
  version="2.33.0"
  date="2026-07-31"
  repository-url="https://github.com/hyperdxio/hyperdx"
  docs-url="https://www.hyperdx.io/docs/"
  release-url="https://github.com/hyperdxio/hyperdx/releases/tag/%40hyperdx/app%402.33.0"
/>

## 概览

本周期增强以 source name 驱动的深链接、仪表盘关联筛选和 SQL 编辑器提示，并聚合 API、common-utils 与 otel-collector 的同期变化。

## New Feature

- URL 参数和更多页面支持 source name。
- 仪表盘新增可选的关联筛选值与顶层全屏操作。
- SQL 编辑器会警告缺失参数或宏。

## Bugfix / Security

- 修复 source 加载期间的无效自动补全、图表 Tooltip、保存搜索导航、错误状态分页和孤立序列绘制。
