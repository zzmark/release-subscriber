---
title: HyperDX 2.46.0 更新总结
description: HyperDX 2.46.0 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="HyperDX"
  version="2.46.0"
  date="2026-11-18"
  repository-url="https://github.com/ClickHouse/ClickStack"
  docs-url="https://www.hyperdx.io/docs/"
  release-url="https://github.com/ClickHouse/ClickStack/releases/tag/%40hyperdx/app%402.46.0"
/>

## 概览

HyperDX 2.46.0 支持从事件模式纳入或排除匹配事件，并新增可供仪表板磁贴和筛选器使用的数据源变量、连接变量与 SQL 查询筛选器。此次升级还涉及 OTel Collector 的 Kubernetes 属性名、OpAMP supervisor 配置和一个 MCP 工具名称。

## Breaking Change

- 自定义 OpAMP supervisor 配置需移除 `reports_remote_config`，现由 `accepts_remote_config` 涵盖其用途。Collector 默认使用稳定版 Kubernetes 属性名，包括 `label.*`、`annotation.*` 和 `container.image.tags`。依赖旧属性名的查询迁移期间，可使用原始 Changelog 中的 feature gate 同时输出两套名称。
- 直接调用 `goose` 的自定义入口点需改用 `migrate`，并沿用原 schema 目录。
- 调用 MCP 工具 `clickstack_trace_top_time_consuming_operations` 的客户端需改用 `clickstack_trace_top_time_consuming_ops`。

## New Feature

- 事件模式支持纳入或排除选中的模式，覆盖当前时间范围内的全部匹配事件。排除条件可叠加，并随 URL 和已保存搜索保留。
- 仪表板磁贴和筛选器可以引用数据源或连接变量。SQL 查询筛选器使用 ClickHouse 查询结果首列填充下拉列表，最多 10,000 个值。临时筛选器新增 `IN`，外部 API 和 MCP 也增加了对临时筛选器的支持。
- 日志和 Trace 数据源可配置行键表达式，控制侧边面板按哪些列查找结果行。Cmd+K 菜单可直接打开团队设置、偏好设置或切换主题。

## Performance

- 告警检查只读取当前告警自身所需的历史数据，避免为每条告警重复扫描其他告警的分组历史。

## Bugfix / Security

- 修复 String 属性上的数值区间查询、切换数据源导致的事件差分搜索面板空白，以及移动端无法访问导航底部的问题。
- 时间图表刷新后保留各系列原有颜色。堆叠柱状图和折线图修复重复的纵轴刻度标签。
- 更新应用镜像的 Node 依赖，并升级采集器和镜像组件以修复上游漏洞。`uuid` 升级至 11.1.1，修复 GHSA-w5hq-g745-h8pq。
