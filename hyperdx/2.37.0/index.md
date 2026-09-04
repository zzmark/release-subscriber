---
title: HyperDX 2.37.0 更新总结
description: HyperDX 2.37.0 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="HyperDX"
  version="2.37.0"
  date="2026-08-28"
  repository-url="https://github.com/hyperdxio/hyperdx"
  docs-url="https://www.hyperdx.io/docs/"
  release-url="https://github.com/hyperdxio/hyperdx/releases/tag/%40hyperdx/app%402.37.0"
/>

## 概览

本周期重新设计告警与 “What’s new” 体验，并全面开放 PromQL 与仪表盘变量能力；同时修复大型 Session Replay 事件重组问题，并聚合 API、common-utils 与 otel-collector 的同期变化。

## New Feature

- 增强告警详情、列表编辑、来源筛选与图标标识。
- 重建基于 Release Notes 的 “What’s new”。
- 全面启用仪表盘变量，支持 PromQL 补全、预览和变量替换。
- API Key 与 MCP 安装片段会遮蔽密钥。

## Performance

- 告警列表采用虚拟化渲染。

## Bugfix / Security

- 关闭过滤器编辑器时会确认未保存更改。
- 修复变量 Drill-down 展开与 Session Replay 超大事件的确定性重组、错误提示和后台流取消。
