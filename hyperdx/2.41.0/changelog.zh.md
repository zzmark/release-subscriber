## @hyperdx/app@2.41.0

### 次版本变更

- 6873416d：功能：为构建器热力图添加序列模式

- eeabaebe：功能：支持 PromQL 热力图（序列模式）

- ff5befa8：在 PromQL 数据源上支持“最小自动时间粒度”。与指标数据源一样，该设置为采用自动时间粒度的图表步长设定下限；`$__rate_interval` 现在将其用作数据源的抓取间隔（未设置时仍为 15s），不再始终假定抓取间隔为 15s。在磁贴上选定的时间粒度始终不会改变。

- d8b1cdfa：功能：通过 `prometheusQuery`/`prometheusQueryRange` 表函数和 ClickHouse 的 Prometheus HTTP API，将 PromQL 查询归因到发起查询的仪表盘、磁贴或搜索

- ab703243：功能：将 ClickHouse 查询归因到发起查询的仪表盘、磁贴、搜索或告警

  此前，无法从 `system.query_log` 中的一行记录确定是 HyperDX 的哪个部分产生了该查询。现在，HyperDX 执行的每个查询都会带有一个简短的 JSON 格式 `log_comment`，以及一个以 `hdx-` 开头的 `query_id`。

  在查询结束后分析负载来源：

  ```sql
  SELECT
      JSONExtractString(log_comment, 'surface') AS surface,
      JSONExtractString(log_comment, 'dashboard') AS dashboard,
      JSONExtractString(log_comment, 'tile') AS tile,
      count(),
      sum(read_rows)
  FROM system.query_log
  WHERE type = 'QueryFinish' AND log_comment != '' AND query_id like 'hdx-%'
  GROUP BY ALL
  ORDER BY sum(read_rows) DESC
  ```

  也可以在查询仍在运行时，通过 `system.processes` 识别它；其中的 `query_id` 会标明发起查询的界面或功能，无需解析 JSON。

  该载荷记录产品中发起请求的部分（仪表盘、搜索、告警、MCP 工具、图表探索器、会话回放、字段查询等）、仪表盘及磁贴或已保存搜索的 ID、数据源 ID，以及服务端请求的 Trace ID。字段查询和自动补全也带有标记，以便将它们与用户的图表查询区分开来。

  跳过设置处理的查询是例外，包括 `system.settings`、服务端版本和 Cloud 检测探测，以及首次配置时的连接检查。这些查询会获得 `query_id`，但 `log_comment` 为空。

- 68082b67：功能：添加堆叠折线（堆叠面积）时间序列显示类型

### 补丁变更

- 766a3b08：功能：添加 `@clickhouse/click-ui` 依赖，并在 `MantineProvider` 旁挂载 `ClickUIProvider`。该 Provider 跟随 HyperDX 的颜色模式，不会单独持久保存自己的主题。错误消息中的“在 GitHub 上提交 issue”链接是首个使用 click-ui（`Link`）的组件。

- a986a03b：功能：使用 click-ui 的 `Badge` 展示告警状态徽标。已触发的告警显示实心红色徽标，求值错误则显示浅红色徽标。

- 46ff1fc4：功能：允许用户永久关闭指标下钻警告

  从未关联日志数据源的指标图表下钻时，会显示一条警告。现在，点击关闭按钮会在该浏览器中永久隐藏这条警告，重复点击也不再叠加多条相同警告。

- 07c93656：修复：在执行隐式 hasToken 搜索前转换 FixedString 列的类型

  对 OTel TraceId 等 FixedString 列使用不带修饰的搜索词时，此前会编译为 hasToken(lower(TraceId), ...)，而 ClickHouse 不接受这种表达式。现在会先将这些被搜索的值 CAST 为 String。

- 3e34efa0：功能：热力图遵循明确指定的时间粒度和最小时间粒度

- 3615f122：修复：使热力图悬停提示对应光标下的单元格

- bd0da16c：功能：在图表编辑器中行内编辑热力图的值和计数

- 51e47b12：功能：通过点击标题重命名仪表盘和已保存搜索，不再使用铅笔按钮

  名称现在可就地编辑：按 Enter 或点击其他位置保存，按 Escape 撤销。

- 0c1dd866：功能：为标签页标题和侧边栏添加可选的 `NEXT_PUBLIC_INSTANCE_LABEL` 后缀

  运行多个 HyperDX 实例的运维人员（例如每个区域一个实例）现在可以设置 `NEXT_PUBLIC_INSTANCE_LABEL`，在浏览器标签页标题和侧边栏后附加一个简短标签，例如“HyperDX UK”。默认值为空，未设置时行为不变。侧边栏标签仅在侧边栏展开时显示；若同时设置了该标签和 UTC 徽标，则标签会替代该处的 UTC 徽标。

- 01ea7f32：功能：选择行侧边面板中属性键的排序方式

  JSON 查看器按字母顺序对键排序，这适合作为 `ProfileEvents` 等包含大量键的 ClickHouse `Map(...)` 列的默认行为，但会隐藏存储的列顺序。属性视图的选项菜单现在提供“按 A–Z 对键排序”、“按 Z–A 对键排序”和“原始顺序”；所选方式会与查看器的其他选项一起持久保存。无论选择哪种模式，数组元素都保持索引顺序。在“原始顺序”模式下，类似整数的键（例如 HTTP 状态码）仍会按升序列在最前面，因为解析后的 JavaScript 对象就是按这种方式排列键的。

- 0b855534：修复：文本索引读取失败时回退到 Map 键扫描

  此前，只要 `mergeTreeTextIndex` 查询失败，`getMapKeys` 就会返回空列表，因此键汇总和限定范围的 `mapKeys` 扫描路径始终不会执行。对于任何配置了行策略的表，ClickHouse 都会拒绝执行 `mergeTreeTextIndex` 并返回 `ACCESS_DENIED`，导致搜索自动补全无法获得这些表的 Map 键。现在，文本索引读取失败后会继续尝试下一种策略。若因行策略而被拒绝，则跳过不受该策略覆盖的键汇总表，只从经过行策略筛选的源表读取键。

- 0ddfe7d7：修复：在数据源页面使用复数形式的数据源类型标签，并采用“OTel”拼写

  数据源表单的数据类型选项和数据源列表现在显示为日志、Trace、OTel 指标、会话和 PromQL。

- e61461be：功能：在首次配置时自动检测 PromQL 数据源

  启用 PromQL（`NEXT_PUBLIC_ENABLE_PROMQL=true`）时，首次配置的数据源自动检测现在也会为 ClickHouse TimeSeries 引擎表创建 PromQL 数据源。它优先选择 `prometheus.metrics`（ClickHouse Prometheus 文档建议使用的表），其次选择名为 `metrics_ts` 的表，否则选择该连接中唯一的 TimeSeries 表。仅包含 TimeSeries 表的服务不再被引导至手动数据源配置。

- 76e5cf78：功能：为 PromQL 折线图、堆叠条形图、饼图和条形图支持序列数量限制

  显示设置抽屉现在为 PromQL 图表提供“序列数量限制”。对于折线图和堆叠条形图，它会按峰值保留前 N 个序列（留空时使用默认值 250，设为 0 表示不限制）。对于饼图和条形图，它会保留最大的 N 个扇区或条形（留空则显示全部）。

- 1be9de8f：功能：添加根据单选或多选进行转义的 promql 变量格式

- c372a71c：修复：列表条形图和直方图在刷新时显示脉动效果

  服务仪表盘的列表条形图和延迟直方图此前会在刷新期间保留旧数据，却没有任何新数据正在加载的提示；直方图还可能短暂地将图表替换为“正在加载图表数据...”。现在，这两种图表都会在重新获取数据期间保留屏幕上的旧数据，并像其他图表一样显示脉动效果。

- 0d2425d5：功能：允许将仪表盘筛选器配置为单选

- 1ce8b88e：修复：使用文本索引发现 Map 键时，按出现频率对键排序

  `getMapKeys` 中的两条 `mergeTreeTextIndex` 路径此前会对键分组并应用 `LIMIT maxKeys`，却没有 `ORDER BY`；因此，当列中的键数量超过限制时，筛选器侧边栏会显示任意一部分键。现在会按 `sum(cardinality) DESC, key` 排序，以保留最常见的键，与键汇总路径已有的 `sum(count) DESC` 排序行为一致。

- 4477f304：功能：在瀑布图控制栏中显示 Trace 的总实际经过时间

- 01fdc5d4：界面：提取 FilterPill，添加筛选器编辑器组件

- 更新依赖 [14003f08]
- 更新依赖 [76d33d73]
- 更新依赖 [07c93656]
- 更新依赖 [6873416d]
- 更新依赖 [0b855534]
- 更新依赖 [c2e21cf5]
- 更新依赖 [cf5b831f]
- 更新依赖 [7aeb6215]
- 更新依赖 [0846f3b2]
- 更新依赖 [e61461be]
- 更新依赖 [6ea5f52c]
- 更新依赖 [ff5befa8]
- 更新依赖 [d8b1cdfa]
- 更新依赖 [1be9de8f]
- 更新依赖 [837c6837]
- 更新依赖 [ab703243]
- 更新依赖 [0d2425d5]
- 更新依赖 [68082b67]
- 更新依赖 [1ce8b88e]
- 更新依赖 [e88cf3d5]
  - @hyperdx/api@2.41.0
  - @hyperdx/common-utils@0.31.0

## @hyperdx/otel-collector@2.41.0



## @hyperdx/common-utils@0.31.0

### 次版本变更

- 6873416d：功能：为构建器热力图添加序列模式

- ff5befa8：在 PromQL 数据源上支持“最小自动时间粒度”。与指标数据源一样，该设置为采用自动时间粒度的图表步长设定下限；`$__rate_interval` 现在将其用作数据源的抓取间隔（未设置时仍为 15s），不再始终假定抓取间隔为 15s。在磁贴上选定的时间粒度始终不会改变。

- d8b1cdfa：功能：通过 `prometheusQuery`/`prometheusQueryRange` 表函数和 ClickHouse 的 Prometheus HTTP API，将 PromQL 查询归因到发起查询的仪表盘、磁贴或搜索

- ab703243：功能：将 ClickHouse 查询归因到发起查询的仪表盘、磁贴、搜索或告警

  此前，无法从 `system.query_log` 中的一行记录确定是 HyperDX 的哪个部分产生了该查询。现在，HyperDX 执行的每个查询都会带有一个简短的 JSON 格式 `log_comment`，以及一个以 `hdx-` 开头的 `query_id`。

  在查询结束后分析负载来源：

  ```sql
  SELECT
      JSONExtractString(log_comment, 'surface') AS surface,
      JSONExtractString(log_comment, 'dashboard') AS dashboard,
      JSONExtractString(log_comment, 'tile') AS tile,
      count(),
      sum(read_rows)
  FROM system.query_log
  WHERE type = 'QueryFinish' AND log_comment != '' AND query_id like 'hdx-%'
  GROUP BY ALL
  ORDER BY sum(read_rows) DESC
  ```

  也可以在查询仍在运行时，通过 `system.processes` 识别它；其中的 `query_id` 会标明发起查询的界面或功能，无需解析 JSON。

  该载荷记录产品中发起请求的部分（仪表盘、搜索、告警、MCP 工具、图表探索器、会话回放、字段查询等）、仪表盘及磁贴或已保存搜索的 ID、数据源 ID，以及服务端请求的 Trace ID。字段查询和自动补全也带有标记，以便将它们与用户的图表查询区分开来。

  跳过设置处理的查询是例外，包括 `system.settings`、服务端版本和 Cloud 检测探测，以及首次配置时的连接检查。这些查询会获得 `query_id`，但 `log_comment` 为空。

- 68082b67：功能：添加堆叠折线（堆叠面积）时间序列显示类型

### 补丁变更

- 07c93656：修复：在执行隐式 hasToken 搜索前转换 FixedString 列的类型

  对 OTel TraceId 等 FixedString 列使用不带修饰的搜索词时，此前会编译为 hasToken(lower(TraceId), ...)，而 ClickHouse 不接受这种表达式。现在会先将这些被搜索的值 CAST 为 String。

- 0b855534：修复：文本索引读取失败时回退到 Map 键扫描

  此前，只要 `mergeTreeTextIndex` 查询失败，`getMapKeys` 就会返回空列表，因此键汇总和限定范围的 `mapKeys` 扫描路径始终不会执行。对于任何配置了行策略的表，ClickHouse 都会拒绝执行 `mergeTreeTextIndex` 并返回 `ACCESS_DENIED`，导致搜索自动补全无法获得这些表的 Map 键。现在，文本索引读取失败后会继续尝试下一种策略。若因行策略而被拒绝，则跳过不受该策略覆盖的键汇总表，只从经过行策略筛选的源表读取键。

- 0846f3b2：在元数据缓存键中加入请求的 Map 键数量限制，使 MCP 发现与 AI 字段发现无法复用彼此采用不同数量限制的结果。

- e61461be：功能：在首次配置时自动检测 PromQL 数据源

  启用 PromQL（`NEXT_PUBLIC_ENABLE_PROMQL=true`）时，首次配置的数据源自动检测现在也会为 ClickHouse TimeSeries 引擎表创建 PromQL 数据源。它优先选择 `prometheus.metrics`（ClickHouse Prometheus 文档建议使用的表），其次选择名为 `metrics_ts` 的表，否则选择该连接中唯一的 TimeSeries 表。仅包含 TimeSeries 表的服务不再被引导至手动数据源配置。

- 1be9de8f：功能：添加根据单选或多选进行转义的 promql 变量格式

- 0d2425d5：功能：允许将仪表盘筛选器配置为单选

- 1ce8b88e：修复：使用文本索引发现 Map 键时，按出现频率对键排序

  `getMapKeys` 中的两条 `mergeTreeTextIndex` 路径此前会对键分组并应用 `LIMIT maxKeys`，却没有 `ORDER BY`；因此，当列中的键数量超过限制时，筛选器侧边栏会显示任意一部分键。现在会按 `sum(cardinality) DESC, key` 排序，以保留最常见的键，与键汇总路径已有的 `sum(count) DESC` 排序行为一致。

## @hyperdx/api@2.41.0

### 次版本变更

- 76d33d73：API 不再回退到公开的会话密钥 `hyperdx is cool 👋`。如果未设置 `EXPRESS_SESSION_SECRET`，API 会生成随机密钥，并在启用身份验证时于启动阶段报告一次。已启用身份验证的部署如果明确设置了旧的公开值，也会获得随机密钥和相同的警告；该公开值仅在无需身份验证的本地演示中继续可用。在任何启用身份验证的部署中，请将其设置为随机字符串（`openssl rand -hex 32`）——否则，重启 API 会使所有用户退出登录，各副本之间也无法共享会话。

- d8b1cdfa：功能：通过 `prometheusQuery`/`prometheusQueryRange` 表函数和 ClickHouse 的 Prometheus HTTP API，将 PromQL 查询归因到发起查询的仪表盘、磁贴或搜索

- ab703243：功能：将 ClickHouse 查询归因到发起查询的仪表盘、磁贴、搜索或告警

  此前，无法从 `system.query_log` 中的一行记录确定是 HyperDX 的哪个部分产生了该查询。现在，HyperDX 执行的每个查询都会带有一个简短的 JSON 格式 `log_comment`，以及一个以 `hdx-` 开头的 `query_id`。

  在查询结束后分析负载来源：

  ```sql
  SELECT
      JSONExtractString(log_comment, 'surface') AS surface,
      JSONExtractString(log_comment, 'dashboard') AS dashboard,
      JSONExtractString(log_comment, 'tile') AS tile,
      count(),
      sum(read_rows)
  FROM system.query_log
  WHERE type = 'QueryFinish' AND log_comment != '' AND query_id like 'hdx-%'
  GROUP BY ALL
  ORDER BY sum(read_rows) DESC
  ```

  也可以在查询仍在运行时，通过 `system.processes` 识别它；其中的 `query_id` 会标明发起查询的界面或功能，无需解析 JSON。

  该载荷记录产品中发起请求的部分（仪表盘、搜索、告警、MCP 工具、图表探索器、会话回放、字段查询等）、仪表盘及磁贴或已保存搜索的 ID、数据源 ID，以及服务端请求的 Trace ID。字段查询和自动补全也带有标记，以便将它们与用户的图表查询区分开来。

  跳过设置处理的查询是例外，包括 `system.settings`、服务端版本和 Cloud 检测探测，以及首次配置时的连接检查。这些查询会获得 `query_id`，但 `log_comment` 为空。

- 68082b67：功能：添加堆叠折线（堆叠面积）时间序列显示类型

### 补丁变更

- 14003f08：功能：将 AI SDK 升级至 v7，并使用 GenAI 语义约定追踪 AI 调用

  AI 助手调用现在会生成符合 GenAI 语义约定的 OpenTelemetry Span（带有 `gen_ai.*` 属性的 `invoke_agent` / `chat` / `execute_tool` Span），替代旧的 `ai.*` Span 结构。团队和用户归因从 `ai.telemetry.metadata.*` 移至 `hyperdx.team.id` 和 `user.id`（已知会话时还会添加 `gen_ai.conversation.id`）。依赖旧 `ai.*` Span 名称或属性的已保存搜索、告警或仪表盘需要更新。

- 07c93656：修复：在执行隐式 hasToken 搜索前转换 FixedString 列的类型

  对 OTel TraceId 等 FixedString 列使用不带修饰的搜索词时，此前会编译为 hasToken(lower(TraceId), ...)，而 ClickHouse 不接受这种表达式。现在会先将这些被搜索的值 CAST 为 String。

- 6873416d：功能：为构建器热力图添加序列模式

- 0b855534：修复：文本索引读取失败时回退到 Map 键扫描

  此前，只要 `mergeTreeTextIndex` 查询失败，`getMapKeys` 就会返回空列表，因此键汇总和限定范围的 `mapKeys` 扫描路径始终不会执行。对于任何配置了行策略的表，ClickHouse 都会拒绝执行 `mergeTreeTextIndex` 并返回 `ACCESS_DENIED`，导致搜索自动补全无法获得这些表的 Map 键。现在，文本索引读取失败后会继续尝试下一种策略。若因行策略而被拒绝，则跳过不受该策略覆盖的键汇总表，只从经过行策略筛选的源表读取键。

- c2e21cf5：修复（mcp）：超时时返回 `clickstack_describe_source` 的部分结果

  描述操作的超时期限从 10s 延长至 30s，与其他 MCP 查询工具保持一致。达到期限时，该工具现在会返回已获取的 Schema 和样本，并标记 `partial`、附带 `skippedStages`，不再直接失败。只有列 Schema 始终未加载成功时，才会返回超时错误。

- cf5b831f：性能（mcp）：加快 `clickstack_list_metrics`，并为指标发现工具提供 30s 的执行时间预算

  `clickstack_list_metrics` 现在仅扫描指标名称（每种指标类型读取的字节数约降至原来的 1/9），只为返回的当前页获取单位和描述，并并行扫描各类型。时间预算耗尽时，它会返回已完成的类型，在 `partialFailure` 中报告其余类型，并返回一个从超时类型继续的 `nextCursor`，不再使整个调用失败。当某一种类型恰好填满一页时，也不再丢弃后续类型。`clickstack_list_metrics` 和 `clickstack_describe_metric` 的允许执行时间现在从 10s 延长至 30s，与其他 MCP 查询工具一致。

- 7aeb6215：重构（mcp）：通过 `runWithTimeout` 在各 MCP 工具之间共享按实际经过时间计算的超时处理，并统一从一个常量获取 30s 的 ClickHouse 查询上限。

- 6ea5f52c：功能：仅在启用 PromQL 时配置默认 PromQL 数据源

  除非设置了 `ENABLE_PROMQL=true`，否则现在会跳过 `DEFAULT_SOURCES` 中类型为 `promql` 的条目。因此，同一份数据源列表可以包含 PromQL 数据源，而不会在关闭 PromQL 的部署中创建它。

- ff5befa8：在 PromQL 数据源上支持“最小自动时间粒度”。与指标数据源一样，该设置为采用自动时间粒度的图表步长设定下限；`$__rate_interval` 现在将其用作数据源的抓取间隔（未设置时仍为 15s），不再始终假定抓取间隔为 15s。在磁贴上选定的时间粒度始终不会改变。

- 1be9de8f：功能：添加根据单选或多选进行转义的 promql 变量格式

- 837c6837：功能：在 API 和 MCP 中支持序列模式热力图

- 0d2425d5：功能：允许将仪表盘筛选器配置为单选

- 1ce8b88e：修复：使用文本索引发现 Map 键时，按出现频率对键排序

  `getMapKeys` 中的两条 `mergeTreeTextIndex` 路径此前会对键分组并应用 `LIMIT maxKeys`，却没有 `ORDER BY`；因此，当列中的键数量超过限制时，筛选器侧边栏会显示任意一部分键。现在会按 `sum(cardinality) DESC, key` 排序，以保留最常见的键，与键汇总路径已有的 `sum(count) DESC` 排序行为一致。

- e88cf3d5：修复（mcp）：为 `clickstack_trace_top_time_consuming_operations` 工具设置执行时间限制。它的查询现在采用 MCP 请求超时和 `max_execution_time` 上限，数据源的 `querySettings` 无法再覆盖该上限。超时时，会返回缩短时间窗口或收窄 `parentFilter` 的指引，不再提示“无效 SQL”；客户端的 `Timeout error.` 现在也会在所有 MCP 工具中获得超时提示。使用多列 `timestampValueExpression` 的数据源（包括以 Date 列开头的表达式，例如 `EventDate, EventTime`）现在会返回正确的细分结果。

- 更新依赖 [07c93656]
- 更新依赖 [6873416d]
- 更新依赖 [0b855534]
- 更新依赖 [0846f3b2]
- 更新依赖 [e61461be]
- 更新依赖 [ff5befa8]
- 更新依赖 [d8b1cdfa]
- 更新依赖 [1be9de8f]
- 更新依赖 [ab703243]
- 更新依赖 [0d2425d5]
- 更新依赖 [68082b67]
- 更新依赖 [1ce8b88e]
  - @hyperdx/common-utils@0.31.0
