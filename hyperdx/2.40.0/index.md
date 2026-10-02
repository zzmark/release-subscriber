---
title: HyperDX 2.40.0 更新总结
description: HyperDX 2.40.0 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="HyperDX"
  version="2.40.0"
  date="2026-10-01"
  repository-url="https://github.com/hyperdxio/hyperdx"
  docs-url="https://www.hyperdx.io/docs/"
  release-url="https://github.com/hyperdxio/hyperdx/releases/tag/%40hyperdx/app%402.40.0"
/>

## 概览

HyperDX 2.40.0 扩展 PromQL 图表与磁贴能力，新增 Trace 日志标签页、行内展开偏好和自动时间粒度下限，并改善仪表盘刷新与搜索交互。同周期更新还包括 StatsD/DogStatsD 接收能力、外部 API 速率限制配置，以及 Map 键查询和 Trace 瀑布图查询的扫描范围修复。

## New Feature

- PromQL 支持宏、同图多表达式、即时查询和归约操作，以及数值磁贴的背景迷你趋势图；PromQL 数据源新增饼图、条形图与表格磁贴。
- 指标数据源可设置最小自动时间粒度，避免时间桶小于指标上报间隔；手动选择的时间粒度不受影响。
- 事件侧边面板新增按时间排序的 Trace 日志标签页，可跳转到相同查询的搜索页面；搜索行支持通过偏好设置选择点击后行内展开。
- Markdown 磁贴支持仪表盘变量替换；行详情面板可选择显示 MATERIALIZED 和 ALIAS 列。
- 仪表盘列表新增标签页、排序和标签筛选；搜索结果行的选择复选框支持悬停显示。
- OTel Collector 编译加入 statsdreceiver，可在自定义管道中直接接收 StatsD/DogStatsD 指标；默认管道保持原有行为。
- 外部 API v2 的速率限制可通过 `EXTERNAL_API_RATE_LIMIT_MAX` 配置，默认仍为每分钟 100 次请求。

## Performance

- Map 键发现查询在缺少日期范围时默认限定最近 24 小时，没有时间戳表达式时跳过原始扫描，避免扫描整张表。
- 修复 Live Tail 每次刷新不断累积编辑器 CSS 规则造成的浏览器内存增长。
- MCP Trace 瀑布图查询传递搜索时间窗口并限制执行时间，以裁剪分区；探测 Span 时间范围，同时限制窗口宽度，避免复用或全零 Trace ID 扩大扫描范围。

## Bugfix / Security

- 修复大数值刻度精度丢失、Y 轴刻度间距不一致及标签重复的问题。
- 数值、条形图、饼图、热力图和表格磁贴在刷新时显示脉动效果，热力图和表格保留已有内容。
- 修复展开与折叠行后搜索结果逐渐变为空白的问题；Map 属性列以键名作为别名，并应用数据源查询设置查询侧边面板中的行。
- 修复 Gauge/Sum 指标图表选择或按 MATERIALIZED、ALIAS 列分组失败的问题，以及 Distributed 表上的事件差值选择失败。
- 查询拆分仅识别引号外独立出现的 SETTINGS 关键字，避免截断字符串或标识符；图表编辑器的 PromQL 模式只提供 PromQL 数据源。
- 修正字段分布百分比显示，扩展 Live Tail 的 3h/6h 预设并明确范围开关含义，改善查询工具栏对齐和移动浏览器初始缩放。
- MCP 瀑布图避免截断早于搜索窗口的 Trace，显式报告探测失败，空结果提示建议传入 `startTime`；ClickHouse 查询超时归类为服务端错误。
