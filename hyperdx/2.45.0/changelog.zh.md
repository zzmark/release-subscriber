## @hyperdx/app@2.45.0

### 次版本变更

- b3cbd0260: 功能：服务地图最多可按 3 个额外的 SQL 分组表达式拆分（例如
  `ResourceAttributes['k8s.pod.name']`）。每个节点由服务及这些表达式的值共同确定，
  响应慢或发生故障的 Pod 的表现由此可以单独查看，避免被服务整体的平均值掩盖。

### 补丁变更

- ac913ceb3: 功能：可选择 ClickHouse 上的 PromQL 数据源通过 Prometheus HTTP API 或 `prometheusQuery` 表函数执行查询，避免每次查询都探测服务器。未指定方式时仍会探测服务器，但结果会缓存 5 分钟。如果指定使用 HTTP API，而服务器未提供该接口，查询会失败并给出明确错误。引导配置检测到 PromQL 数据源时，如果服务器提供 HTTP API，就将该数据源固定为使用该接口。
- 更新依赖 [c17fc16a2]
- 更新依赖 [1fba1c381]
- 更新依赖 [7b03880eb]
- 更新依赖 [2d17de5d7]
- 更新依赖 [ac913ceb3]
- 更新依赖 [7cfd333ea]
- 更新依赖 [db4e7ba67]
  - @hyperdx/api@2.45.0
  - @hyperdx/common-utils@0.35.0

## @hyperdx/otel-collector@2.45.0

## @hyperdx/common-utils@0.35.0

### 次版本变更

- 2d17de5d7: 功能：通过 ClickHouse 的 Prometheus HTTP API 查询 PromQL 标签

  如果 ClickHouse 26.9 或更高版本配置了 `prometheus_api_v1` 处理程序，基于 ClickHouse 的 PromQL 数据源会将 `/labels` 和 `/label/:name/values` 请求转发给该处理程序，原先这些请求通过 SQL 查询 TimeSeries 标签表。较旧的服务器、未配置该处理程序的服务器和设为 `table-function` 的数据源仍使用 SQL，因此在 ClickHouse 26.6–26.8 上通过 HTTP 执行查询的数据源仍支持标签自动补全。

### 补丁变更

- ac913ceb3: 功能：可选择 ClickHouse 上的 PromQL 数据源通过 Prometheus HTTP API 或 `prometheusQuery` 表函数执行查询，避免每次查询都探测服务器。未指定方式时仍会探测服务器，但结果会缓存 5 分钟。如果指定使用 HTTP API，而服务器未提供该接口，查询会失败并给出明确错误。引导配置检测到 PromQL 数据源时，如果服务器提供 HTTP API，就将该数据源固定为使用该接口。

## @hyperdx/api@2.45.0

### 次版本变更

- 2d17de5d7: 功能：通过 ClickHouse 的 Prometheus HTTP API 查询 PromQL 标签

  如果 ClickHouse 26.9 或更高版本配置了 `prometheus_api_v1` 处理程序，基于 ClickHouse 的 PromQL 数据源会将 `/labels` 和 `/label/:name/values` 请求转发给该处理程序，原先这些请求通过 SQL 查询 TimeSeries 标签表。较旧的服务器、未配置该处理程序的服务器和设为 `table-function` 的数据源仍使用 SQL，因此在 ClickHouse 26.6–26.8 上通过 HTTP 执行查询的数据源仍支持标签自动补全。

- db4e7ba67: 维护：将随附的 ClickHouse 升级到 26.10.3.7

  一体化镜像和 Docker Compose 文件现在使用
  `clickhouse/clickhouse-server:26.10.3.7-alpine`。新建 TimeSeries 表默认采用
  架构版本 8，将每条时间序列的时间范围存放在单独的内部表中。现有表保留原布局。
  `system.metric_log` 切换为分桶架构，升级前的记录移至 `system.metric_log_0`。

### 补丁变更

- c17fc16a2: 修复：告警实际触发时，webhook 正文中的 `{{note}}` 现在也会填入告警备注，
  之前只有使用“发送测试”时才会填入。
- 1fba1c381: 修复：将 MCP 工具 `clickstack_save_webhook` 和 `clickstack_save_alert` 标记为可与外部系统交互

  保存的 webhook 和告警会向第三方端点发送 HTTP 请求，因此两个工具现在都声明 `openWorldHint: true`。

- 7b03880eb: 功能：通过 ClickHouse 的 Prometheus HTTP API 读取 MCP 的 PromQL 标签目录

  对基于 ClickHouse 的 PromQL 数据源，`describe_source` 现在会通过 ClickHouse 26.9 或更高版本上的 `prometheus_api_v1` 处理程序列出标签名和指标名。较旧的服务器、未配置该处理程序的服务器和设为 `table-function` 的数据源回退到 SQL。

- ac913ceb3: 功能：可选择 ClickHouse 上的 PromQL 数据源通过 Prometheus HTTP API 或 `prometheusQuery` 表函数执行查询，避免每次查询都探测服务器。未指定方式时仍会探测服务器，但结果会缓存 5 分钟。如果指定使用 HTTP API，而服务器未提供该接口，查询会失败并给出明确错误。引导配置检测到 PromQL 数据源时，如果服务器提供 HTTP API，就将该数据源固定为使用该接口。
- 7cfd333ea: 修复（MCP）：移除 clickstack_service_health 的健康状态判定

  该工具已停止为服务标注严重、降级或健康状态，也停止向智能体给出服务“无需处理”的判断。
  每个服务仍保留阈值标记、评分和事实摘要，供智能体根据数值推理，避免服务级汇总数据导致误判。
  `summary.statusCounts` 改为 `summary.servicesFlagged`。Span 属性
  `mcp.service_health.critical_count` 和 `mcp.service_health.degraded_count`
  改为 `mcp.service_health.flagged_count`。

- 更新依赖 [2d17de5d7]
- 更新依赖 [ac913ceb3]
  - @hyperdx/common-utils@0.35.0
