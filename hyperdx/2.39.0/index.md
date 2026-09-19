---
title: HyperDX 2.39.0 更新总结
description: HyperDX 2.39.0 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="HyperDX"
  version="2.39.0"
  date="2026-09-18"
  repository-url="https://github.com/hyperdxio/hyperdx"
  docs-url="https://www.hyperdx.io/docs/"
  release-url="https://github.com/hyperdxio/hyperdx/releases/tag/%40hyperdx/app%402.39.0"
/>

## 概览

HyperDX 2.39.0 重点扩展图表与仪表盘告警、Terraform 导入、LLM 分析和指标浏览。用户可以直接从图表探索器创建独立告警，将磁贴告警导出到 Terraform，并在 LLM 仪表盘中按最终用户筛选。指标名称选择器改为从 ClickHouse 主索引流式读取，显著缩短首次显示时间，同时保留完整搜索回退。

本周期还增强 Webhook 条件与 incident.io 负载、PromQL over ClickHouse、入门清单和服务地图，并修复 ClickHouse 26.3+ 子列规划开销、LLM 属性筛选、多行查询字段及多项告警问题。部署方应注意 PromQL 的 ClickHouse 路径现使用 26.8+ 的 Prometheus HTTP API，捆绑镜像也已升级到 ClickHouse 26.8。

## New Feature

- 可直接从图表探索器创建和编辑日志、Trace 或指标告警，并由告警持久保存自身的图表配置。
- Terraform 导出支持仪表盘磁贴告警；Provider 3.28.0 新增 `source = "tile"`、`dashboard_id` 与 `tile_id`。
- LLM 仪表盘新增最终用户筛选；侧栏新增分阶段入门清单，完成状态可由 UI、REST API v2 或 MCP 工具记录。
- PromQL 查询改由 ClickHouse 26.8+ 的 `prometheus_api_v1` HTTP Handler 执行，`database` 与 `table` 参数支持任意 TimeSeries 表。
- 搜索结果行可直接复制或下载，仪表盘支持必填筛选器、相对日期范围和将当前筛选应用到磁贴预览。
- OTel Collector 编译加入 `spanmetricsconnector`，可从 Span 生成调用量和时长指标；Trace Schema 初始化新增文本索引。

## Performance

- 指标名称浏览从稀疏主索引流式读取，在约 4,900 个 Gauge 指标的数据源上首批结果由约 770ms 缩短到约 30ms，并保留完整 `GROUP BY` 搜索回退。
- LLM 属性存在性筛选改用 `mapContains` 和跳过索引；测试中的规划停顿由 36 秒降至 7ms，扫描 Granule 数由 1,306 个降至 3 个。
- 对 ClickHouse 26.3+ 禁用按 Part 计算 Map 子列大小，避免 SharedMergeTree 上大量属性键引发成批 S3 GET 和数分钟规划延迟。
- 分组告警的示例日志每个时间窗口只查询一次，同一窗口内的通知共享结果。

## Bugfix / Security

- 转义入门清单数据探测中的数据库名和表名，防止恶意命名的数据源造成 SQL 注入。
- 新增可选的 AES-256-GCM 第三方 Token 加密服务，通过 `TOKEN_ENCRYPTION_KEY` 启用。
- 修复 incident.io Webhook 默认正文缺少必需字段的问题，并完善 `{{sourceQuery}}`、`thresholdMax` 和测试负载。
- 修复多行 SQL/PromQL 字段失焦后内容被隐藏、告警通知时长混入消息构建耗时，以及筛选器选项加载失败后无法清除的问题。
- 服务地图改用固定错误率阈值，并区分“无错误”和“无测量数据”；禁用的数据源不再在页面加载时触发 ClickHouse 查询。
