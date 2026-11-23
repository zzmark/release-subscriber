---
title: HyperDX 2.47.0 更新总结
description: HyperDX 2.47.0 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="HyperDX"
  version="2.47.0"
  date="2026-11-23"
  repository-url="https://github.com/ClickHouse/ClickStack"
  docs-url="https://www.hyperdx.io/docs/"
  release-url="https://github.com/ClickHouse/ClickStack/releases/tag/%40hyperdx/app%402.47.0"
/>

## 概览

HyperDX 2.47.0 在 Trace 搜索中提供吞吐量、错误和耗时图表，并可切换至耗时热力图。新版优化了 ClickHouse 文本索引与搜索筛选查询，同时加强了修改连接主机时的密码保护。

## Breaking Change

- 移除 `NEXT_PUBLIC_ENABLE_ADHOC_FILTERS` 功能开关。
- 修改连接主机时，客户端需重新提供密码，否则 API 返回 400。对于不使用保存密码的 Prometheus 端点，更新时会清除保存的密码。

## New Feature

- Trace 搜索可在 RED 图表与热力图之间切换，选择随 URL 保留。错误图可在错误率和错误数量之间切换，点击数量图的状态系列可筛选 Trace。
- 仪表板的 SQL 查询筛选器可选择数据源，并支持补全表名和列名。临时仪表板可连同内容一起保存。
- 外部 API 支持静默和解除静默告警。采集 API 可在启用 `ENABLE_INGESTION_API_KEY` 后接受预设密钥及团队密钥。

## Performance

- 精确模式可合并同一 Map 列的多个键查询。文本索引的常规键和值查询默认读取 20 个大小接近中位数的数据片段，并发的相同 Map 键请求共享查询。
- ClickHouse 26.6 及以上的采集器迁移将初始化表的文本索引字典块设为 8,192 个词元，减小稀疏索引，降低读取筛选值的成本。现有数据片段在合并前保留原有设置。
- 告警检查按告警间隔限制历史查询范围，并跳过当前窗口已经评估的告警。

## Bugfix / Security

- 修复原生 JSON 列中的数组下标及筛选键处理。日期和时间列的最小值、最大值计算现在可在表格、数字磁贴和相应 MCP 工具中返回时间戳。
- MCP 搜索在 25 秒时限内返回已找到的行及覆盖范围。日志模式提取和搜索降噪可将日期不同的同类日志归到同一模板。
- 采集器迁移工具升级 `clickhouse-go/v2`，引入 Brotli 解压器拒绝服务漏洞的修复（CVE-2026-111497）。
