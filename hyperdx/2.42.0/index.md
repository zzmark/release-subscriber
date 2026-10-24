---
title: HyperDX 2.42.0 更新总结
description: HyperDX 2.42.0 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="HyperDX"
  version="2.42.0"
  date="2026-10-23"
  repository-url="https://github.com/hyperdxio/hyperdx"
  docs-url="https://www.hyperdx.io/docs/"
  release-url="https://github.com/hyperdxio/hyperdx/releases/tag/%40hyperdx/app%402.42.0"
/>

## 概览

HyperDX 2.42.0 新增临时仪表盘筛选、告警侧边编辑、内容字号和任意显示时区，扩展 PromQL 热力图与外部仪表盘 API，并新增按服务汇总健康状况的 MCP 工具。同周期 OTel Collector、Common Utils 和 API 更新改进 HTTPS 指标传输、异常与 Trace 展示、查询性能及模板校验。升级时需迁移 PromQL 查询和预置仪表盘的数据源配置，并核对 ClickHouse 抓取作业标签变化。

## Breaking Change

- `/api/v1/prometheus/*` 改为接受 `sourceId`，不再使用调用者提供的 `connectionId`、`database` 或 `table` 决定查询目标。已保存 PromQL 图表必须包含 `source`，不再保存 `connection`；预置的 PromQL 仪表盘磁贴需设置 `source`。
- `CLICKHOUSE_PROMETHEUS_METRICS_ENDPOINT` 可使用 HTTP／HTTPS URL 或不带协议的 `host:port`，但不得包含路径，`/write` 仍自动追加。包含路径或使用其他协议会导致采集器启动时明确报错；HTTPS 启用系统 CA 证书验证。由 OpAMP 管理的采集器所抓取的 ClickHouse 指标，其标签由 `job="otelcol"` 改为 `job="clickhouse"`，相关查询需核对。
- 时间显示设置从 UTC 开关迁移为时区，现有设置会转换；`formatDate` 的 `isUTC` 选项移除。无效 webhook 模板或未注册的辅助函数会在创建、更新和测试阶段返回 400。

## New Feature

- 新增临时仪表盘筛选配置与输入控件，可从搜索磁贴单元格、表格分组单元格和时间图表序列生成筛选条件；导入时支持数据源重新映射。
- 图表告警在停靠于编辑器旁的可调整侧边面板中编辑，保留图表预览；关闭面板丢弃改动，新增和已有告警分别通过“添加告警”和“更新告警”保留。磁贴新增描述及信息提示框，并在外部 Dashboards API 中保留描述。
- 用户偏好支持小／中／大内容字号及任意时区；默认字号与此前一致，本地时区和 UTC 固定在时区列表顶部。服务图采样率可记入本地存储，URL 参数仍优先。
- 搜索页直方图新增分组，图表支持平滑／线性／阶梯插值，以及基于 PromQL 数据的分布热力图和桶指标直方图热力图。
- `/api/v2/dashboards` 支持返回、创建和更新 PromQL 磁贴；MCP 尚不展示这些磁贴供编辑，但更新仪表盘时会保留它们。webhook 模板可通过 `{{var.<column>}}` 使用分组值，恢复通知也保留这些值。
- 新增 `clickstack_service_health`，一次调用汇总各服务吞吐量、错误率、p50/p95/p99 和主要错误分组，与昨日比较并按状况由差到好排列。MCP 增加调用响应大小记录、服务器元数据、工具行为提示和更完整的输入说明。
- 日志数据源新增 `eventNameExpression` 和 `severityNumberExpression`，可按 OTel 表列自动识别；目前仅存储和编辑这些字段，前者尚未被读取，日志级别仍取自严重性文本。

## Performance

- “服务 > 数据库”查询抽屉使用 Span 属性跳数索引；会话查询将 Trace 扫描限定为 RUM 服务。
- 每个查询完成后立即流式显示筛选值；某个数据源的键值查询失败时保留其他数据源的部分结果。
- 行详情使用主键及表中已有的 `_block_number`／`_block_offset` 列，避免仅启用其中一列时回退为缓慢的整行查找。

## Bugfix / Security

- 百分位聚合按正确水平生成 `quantile`，修复不存在的 `p95If`，并在 AI 输出及 v1 图表转换中保留百分位水平。
- 正确识别旧 `STATUS_CODE_ERROR` 和短形式 `Error`；按当前 OpenTelemetry HTTP／RPC 约定展示详情，兼容旧名称。异常属性、Span 事件、关联日志和链接在面板与 Trace 瀑布图中正确加载、着色和切换。
- 修复时间范围被重置为当前年份、UTC 以西用户范围偏移、粗时间戳与细时间戳共同筛选时遗漏亚秒数据，以及搜索重放链接丢失多行 SQL 的问题。
- 修复手机已保存搜索、Map／JSON 筛选键数量限制、搜索、排序及展开状态；修正多字段排序、字符串 id 行详情和图表数值缩写。
- MCP SQL 支持描述中列出的时间桶参数和可选 `sourceId`；拒绝未知、跨团队或连接不匹配的数据源，并引导调用者发现表名和时间戳列。未启用 PromQL 时拒绝创建其数据源，非 PromQL 数据源不能用于 PromQL 磁贴。
- webhook 表单即时显示 Handlebars 错误位置；新增 `POST /api/v2/webhooks/validate`，可在不保存时校验配置。ClickHouse 代理转发正文解析器读取的字节，保留 JSON 值、表单字段、文本编码和未解析的 multipart 流。
- 采集器不再为含花括号的非 JSON 日志逐条记录 ParseJSON 错误；HTTPS remote-write 与 ClickHouse 抓取启用 TLS 证书验证，采集器自身指标端点保持原有明文 HTTP 行为。
