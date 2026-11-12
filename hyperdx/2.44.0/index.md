---
title: HyperDX 2.44.0 更新总结
description: HyperDX 2.44.0 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="HyperDX"
  version="2.44.0"
  date="2026-11-11"
  repository-url="https://github.com/ClickHouse/ClickStack"
  docs-url="https://www.hyperdx.io/docs/"
  release-url="https://github.com/ClickHouse/ClickStack/releases/tag/%40hyperdx/app%402.44.0"
/>

## 概览

HyperDX app 2.44.0 统一使用 ClickStack 品牌，并同时发布 `clickhouse/clickstack` 与 `hyperdx/hyperdx` 镜像。应用新增团队 API 密钥、时区覆盖和仪表板筛选建议条件。升级前，使用自监控遥测、自定义采集器或内部 webhook 的部署需要检查下列配置。

## Breaking Change

- **自监控遥测**。SDK 改用 `@clickhouse/clickstack-node` 和 `@clickhouse/clickstack-browser`，HTTP span 的语义键、日志作用域、严重级别和浏览器用户属性发生变化。浏览器会话会重启一次，fetch 和 XHR span 停止采集标头和正文。依赖旧字段的查询和仪表板需要同步更新。
- **导出配置**。未设置 `OTEL_EXPORTER_OTLP_ENDPOINT` 时，服务端自监控数据默认发往 `http://localhost:4318`。请显式配置目标端点，并用 `OTEL_INSTRUMENTATION_HTTP_CAPTURE_HEADERS_*` 和 `CLICKSTACK_CAPTURE_HTTP_BODY` 替换旧的 `HDX_NODE_*` 采集配置。生产环境的 Next.js 遥测使用带 `-next` 后缀的服务名。
- **自定义采集器与内部 webhook**。浏览器每 5 秒发送 gzip 压缩的遥测。外部采集器需允许相应的 CORS 请求标头，前置代理需原样转发 `Content-Encoding`。通用和 incident.io webhook 会拦截私有或保留地址，确需使用内部主机名的自托管部署应配置 `WEBHOOK_HOSTNAME_ALLOWLIST`。
- **品牌与外观**。应用移除了品牌切换、HyperDX 配色及字体选择，保留浅色、深色和跟随系统模式。Docker Compose 改用 `clickhouse/clickstack`。

## New Feature

- 团队成员可创建带说明和到期时间的团队 API 密钥，创建者离开后仍可使用。搜索和仪表板可按页面覆盖时区，SQL 数据源的仪表板临时筛选器可限制键和值的建议范围。
- MCP 支持查询 PromQL 数据源和卡片、查看未注册为数据源的表，以及在 60 秒共享截止时间内并行运行最多 10 条独立 SQL 查询。
- Collector 补齐旧浏览器 SDK 的 `session.id`，并为缺少严重级别文本的日志补齐级别。覆盖 `processors:` 的部署应加入 `transform/session_id`。新的会话列与跳数索引只自动应用于新建表。

## Performance

- 当所有选择器都指定了指标名，PromQL 标签查询只读取匹配指标的标签记录。行详情选项卡复用已查到的行，避免重复执行 `SELECT *`。
- Collector 将 CORS 预检缓存延长到 10 分钟。新建表的初始结构采用 `ZSTD(3)`，以少量写入 CPU 开销换取更高压缩率，现有表不受影响。

## Bugfix / Security

- 更新 `systeminformation` 至 5.33.19，修复命令注入漏洞，包括 GHSA-5xpp-75jx-m839 和 GHSA-hvx9-hwr7-wjj9。API 在实际连接地址上检查 webhook 目标，防止 DNS 重绑定，并禁止通过 PATCH 改写仪表板或已保存搜索的团队和所有者。
- 指标图表和告警跳过 Prometheus 标记为未记录值的数据点。会话回放按事件编号和完整精度时间戳分组，防止跨页面拼接。启用 FIPS 的 ClickHouse 部署使用 SHA256 查找 JSON 行详情。
- 列元数据缓存 5 分钟后刷新。PromQL 标签查询兼容 ClickHouse 26.10 默认的 TimeSeries 架构版本 8。
