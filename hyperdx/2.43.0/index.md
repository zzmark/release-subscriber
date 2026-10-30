---
title: HyperDX 2.43.0 更新总结
description: HyperDX 2.43.0 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="HyperDX"
  version="2.43.0"
  date="2026-10-30"
  repository-url="https://github.com/hyperdxio/hyperdx"
  docs-url="https://www.hyperdx.io/docs/"
  release-url="https://github.com/hyperdxio/hyperdx/releases/tag/%40hyperdx/app%402.43.0"
/>

## 概览

HyperDX 2.43.0 新增告警标签 webhook 模板和 OpenTelemetry 浏览器会话回放支持，修复告警预览的阈值区域着色、含逗号列名及 Map 筛选条件改写问题。同周期 API 更新将随附的 ClickHouse 固定为 26.8.36.3，以纳入安全修复。

## New Feature

- Generic 和 incident.io webhook 正文可通过 `{{tags}}` 获取逗号分隔的告警标签，也可使用 `{{#each tags}}` 遍历；incident.io 默认正文同时提供 `metadata.tags`，共用 webhook 可按负责团队路由告警。
- 支持列出并播放来自发送 `session.id` 的 OpenTelemetry 浏览器 SDK 的会话回放，展示点击、页面导航、控制台输出和异常。

## Bugfix / Security

- 修复 Recharts v3 默认边界变化导致“高于”和“不在区间内”告警在阈值线错误一侧着色的问题。
- 切换搜索列或编辑分组列时，保留以反引号引用且包含逗号的完整列名；将 `Map['key'] = 'value'` 筛选条件改写为键值项索引查询时保留字符串字面量，使带引号或反斜杠的值能够正确匹配。
- 侧栏导航标签、菜单和工具提示统一使用句首大写格式。
- 一体化镜像和 Docker Compose 文件将 ClickHouse 镜像从浮动的 `26.8-alpine` 固定为 `clickhouse/clickhouse-server:26.8.36.3-alpine`，以纳入安全修复。
