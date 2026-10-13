---
title: HyperDX 2.41.0 更新总结
description: HyperDX 2.41.0 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="HyperDX"
  version="2.41.0"
  date="2026-10-13"
  repository-url="https://github.com/hyperdxio/hyperdx"
  docs-url="https://www.hyperdx.io/docs/"
  release-url="https://github.com/hyperdxio/hyperdx/releases/tag/%40hyperdx/app%402.41.0"
/>

## 概览

HyperDX 2.41.0 新增热力图序列模式、堆叠面积时间序列和更多 PromQL 配置，并通过查询标识与日志注释追踪仪表盘、磁贴、搜索和告警产生的 ClickHouse 负载。同周期 API 更新还调整会话密钥和 AI 遥测结构，优化 MCP 指标发现及超时处理。启用身份验证的部署应设置随机 `EXPRESS_SESSION_SECRET`；依赖旧 `ai.*` 遥测名称或属性的搜索、告警和仪表盘需要迁移。

## Breaking Change

- API 不再在启用身份验证时使用公开的默认会话密钥。未设置 `EXPRESS_SESSION_SECRET`，或明确使用旧公开值时，会生成随机密钥并发出警告；未配置持久密钥会导致 API 重启后用户退出登录，且副本无法共享会话。可使用 `openssl rand -hex 32` 生成随机值；无需身份验证的本地演示仍可使用旧公开值。
- AI SDK 升级至 v7，AI 调用 Span 改用 GenAI 语义约定。旧 `ai.*` Span 名称和属性由 `invoke_agent`、`chat`、`execute_tool` 及 `gen_ai.*` 替代；团队和用户归因改用 `hyperdx.team.id`、`user.id`，已知会话时提供 `gen_ai.conversation.id`。相关已保存搜索、告警和仪表盘需要更新。

## New Feature

- 构建器、PromQL、API 和 MCP 支持热力图序列模式；热力图遵循明确指定的时间粒度和最小时间粒度，可在图表编辑器中行内编辑值与计数。新增堆叠折线（堆叠面积）时间序列显示类型。
- PromQL 数据源支持最小自动时间粒度，并将其用作 `$__rate_interval` 的抓取间隔；未设置时仍使用 15s，磁贴上手动选择的时间粒度不变。PromQL 折线图、堆叠条形图、饼图和条形图可限制序列数量；新增按单选或多选转义的 promql 变量格式，仪表盘筛选器可配置为单选。
- ClickHouse 查询添加 JSON 格式 `log_comment` 和以 `hdx-` 开头的 `query_id`，记录查询来源、仪表盘、磁贴或已保存搜索、数据源与服务端请求 Trace ID。PromQL 查询通过表函数和 ClickHouse Prometheus HTTP API 同样支持来源归因；跳过设置处理的探测查询只有 `query_id`，其 `log_comment` 为空。
- 启用 PromQL 时，首次配置可自动识别 TimeSeries 引擎表并创建数据源，优先使用 `prometheus.metrics`，其次为 `metrics_ts`，否则选择连接中唯一的 TimeSeries 表。服务端仅在 `ENABLE_PROMQL=true` 时创建默认 PromQL 数据源。
- 支持点击标题重命名仪表盘和已保存搜索、永久关闭指标下钻警告，以及选择行侧边面板中属性键的排序方式。`NEXT_PUBLIC_INSTANCE_LABEL` 可在标签页标题和展开的侧边栏中显示实例标签；瀑布图控制栏显示 Trace 的总实际经过时间。
- 接入 click-ui Provider、链接和告警状态徽标，提取 FilterPill 并添加筛选器编辑器组件。

## Performance

- `clickstack_list_metrics` 只扫描指标名称，每种指标类型读取的字节数约降至原来的 1/9；仅为当前页获取单位和描述，并行扫描各类型。超时时返回已完成类型、`partialFailure` 和可从超时类型继续的 `nextCursor`，避免整个调用失败。

## Bugfix / Security

- 隐式 hasToken 搜索先将 FixedString 列转换为 String，修复 OTel TraceId 等字段搜索被 ClickHouse 拒绝的问题。
- Map 键的文本索引读取失败后继续尝试后续扫描策略；因行策略被拒绝时跳过不受策略覆盖的键汇总表，只读取经过行策略筛选的源表。文本索引发现的键按频率排序，元数据缓存键加入请求的数量限制，避免 MCP 和 AI 字段发现复用不同限制的结果。
- 修复热力图悬停提示与光标下单元格不一致的问题；列表条形图和延迟直方图在刷新时保留旧数据并显示脉动效果，避免图表短暂被加载提示替换。修正数据源类型标签和 OTel 拼写。
- `clickstack_describe_source` 超时时返回已获取的 Schema 和样本，并标记 `partial` 与 `skippedStages`；只有列 Schema 未加载时才返回超时错误。它与指标发现工具的时间预算统一为 30s。
- 为 `clickstack_trace_top_time_consuming_operations` 设置请求超时和不可被数据源设置覆盖的查询执行上限；超时提示建议缩短窗口或收窄 `parentFilter`。修复多列 `timestampValueExpression` 数据源的细分结果，并统一 MCP 客户端超时提示。
