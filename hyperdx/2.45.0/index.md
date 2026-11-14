---
title: HyperDX 2.45.0 更新总结
description: HyperDX 2.45.0 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="HyperDX"
  version="2.45.0"
  date="2026-11-14"
  repository-url="https://github.com/ClickHouse/ClickStack"
  docs-url="https://www.hyperdx.io/docs/"
  release-url="https://github.com/ClickHouse/ClickStack/releases/tag/%40hyperdx/app%402.45.0"
/>

## 概览

HyperDX 2.45.0 支持在服务地图上按 Pod 等维度拆分节点，并允许为 ClickHouse 上的 PromQL 数据源指定查询方式。一体化镜像和 Docker Compose 将随附的 ClickHouse 升级至 26.10.3.7。新建 TimeSeries 表默认使用架构版本 8，现有表保留原布局。

## Breaking Change

- MCP 工具 `clickstack_service_health` 移除了健康状态判定。读取 `summary.statusCounts` 的客户端应改用 `summary.servicesFlagged`，监控查询应改用 `mcp.service_health.flagged_count`。每个服务的阈值标记和评分仍可用于判断。
- `system.metric_log` 改用分桶架构。读取升级前的指标日志时，请查询 `system.metric_log_0`。

## New Feature

- 服务地图最多支持 3 个额外的 SQL 分组表达式。按 Pod 名称分组时，可单独定位异常 Pod。
- PromQL 数据源可指定 Prometheus HTTP API 或 `prometheusQuery` 表函数。对于配置了 `prometheus_api_v1` 的 ClickHouse 26.9 或更高版本，支持通过 HTTP 查询标签和值，也支持通过 MCP 查询标签名和指标名。较旧服务端和显式使用表函数的数据源仍可通过 SQL 获取这些信息。

## Performance

- 自动探测 PromQL 查询方式的结果缓存 5 分钟。显式指定查询方式后，省去自动探测。

## Bugfix / Security

- 告警触发时，webhook 正文中的 `{{note}}` 现在会填入告警备注。
- MCP 的 `clickstack_save_webhook` 和 `clickstack_save_alert` 现在声明 `openWorldHint: true`，表明保存的配置可以向第三方端点发送 HTTP 请求。
