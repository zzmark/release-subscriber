---
title: HyperDX 2.35.0 更新总结
description: HyperDX 2.35.0 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="HyperDX"
  version="2.35.0"
  date="2026-08-14"
  repository-url="https://github.com/hyperdxio/hyperdx"
  docs-url="https://www.hyperdx.io/docs/"
  release-url="https://github.com/hyperdxio/hyperdx/releases/tag/%40hyperdx/app%402.35.0"
/>

## 概览

本周期集中增强仪表盘变量与过滤器：支持广播、变量配置、Raw SQL 替换和 SQL 编辑器校验，并聚合 API、common-utils 与 otel-collector 的同期变化。

## New Feature

- 仪表盘过滤器新增 broadcast 与变量设置。
- Raw SQL Tile 支持仪表盘变量替换。
- 增强 SQL 编辑器的变量校验和自动补全。

## Bugfix / Security

- 恢复 Lucene 自动补全，并包含同期 API 与公共工具修复。
