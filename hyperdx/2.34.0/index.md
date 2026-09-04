---
title: HyperDX 2.34.0 更新总结
description: HyperDX 2.34.0 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="HyperDX"
  version="2.34.0"
  date="2026-08-07"
  repository-url="https://github.com/hyperdxio/hyperdx"
  docs-url="https://www.hyperdx.io/docs/"
  release-url="https://github.com/hyperdxio/hyperdx/releases/tag/%40hyperdx/app%402.34.0"
/>

## 概览

本周期引入用于指标加速的 series 表配置、跨包应用内更新日志和仪表盘回放搜索，并聚合 API、common-utils 与 otel-collector 的同期变化。

## New Feature

- 可配置 `series` 表以加速指标查询。
- 应用内更新日志显示跨包发布内容。
- 日志与 Trace 仪表盘 Tile 支持 Replay 搜索。

## Bugfix / Security

- 修复 Trace 搜索 SQL、来源类型、日期选择器遮挡、Histogram 聚合、指标表检测、比例排名和 Trace 行定位等问题。
