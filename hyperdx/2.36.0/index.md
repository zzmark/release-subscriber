---
title: HyperDX 2.36.0 更新总结
description: HyperDX 2.36.0 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="HyperDX"
  version="2.36.0"
  date="2026-08-21"
  repository-url="https://github.com/hyperdxio/hyperdx"
  docs-url="https://www.hyperdx.io/docs/"
  release-url="https://github.com/hyperdxio/hyperdx/releases/tag/%40hyperdx/app%402.36.0"
/>

## 概览

本周期继续完善仪表盘变量体系，覆盖依赖变量查询、Chart Builder、嵌套宏和复杂筛选状态，并聚合 API、common-utils 与 otel-collector 的同期变化。

## New Feature

- 支持依赖变量值查询。
- Chart Builder Tile 支持仪表盘变量替换。
- 可展开宏参数中嵌套的变量与宏。
- Surrounding Context 新增基于当前事件属性的快速筛选。

## Bugfix / Security

- 修复复杂表达式筛选状态、多序列指标类型合并、非 OTEL schema 的服务筛选和 JSON 键排序。
