## @hyperdx/app@2.42.0

### 次版本变更

- fe59feb9：功能：在停靠于图表编辑器旁的侧边面板中编辑图表告警，调整告警时可持续查看预览图表。“添加告警”／“编辑告警”打开面板；新告警通过“添加告警”保留，已有告警通过“更新告警”保留，关闭面板则丢弃更改。面板占满编辑器的可见高度，并可从左侧边缘调整宽度。“保存”和“取消”移至图表名称所在行。

- 1773c119：功能：新增内容字号偏好设置

  此前，日志／Trace 表格中的小号文本只能通过浏览器缩放调整，而这也会缩放周围的界面。用户偏好设置现在提供**内容字号**设置（小／中／大），可调整搜索结果表格、数据表格、展开行的 JSON，以及图表坐标轴、图例和提示框的字号。默认值为“小”，与原有字号一致，因此主动更改设置前不会发生变化。

- 95aef70f：为日志数据源新增可选的 `eventNameExpression`，指向 OpenTelemetry 日志的 EventName。当 OTel 日志表具有字符串类型的 `EventName` 列时，数据源自动检测会设置该字段。目前仅存储该字段并允许编辑，尚无功能读取它。HDX-5787

- bc47e485：为日志数据源新增可选的 `severityNumberExpression`，指向 OpenTelemetry 的数值型 SeverityNumber（1–24）。当 OTel 日志表具有整数类型的 `SeverityNumber` 列时，数据源自动检测会设置该字段。目前仅存储该字段并允许编辑；日志级别仍取自严重性文本。

- 7eea0fd3：功能：在用户偏好设置中选择任意时区，替代“使用 UTC 时间”开关。本地时区和 UTC 仍固定在列表顶部

- cfa865bd：功能：将分组值以 `{{var.<column>}}` 的形式提供给 webhook 正文模板，并在恢复通知中保留这些值

### 补丁变更

- 92058236：功能：广播临时仪表盘筛选条件

- 3e9185d1：功能：将搜索磁贴的单元格筛选为临时仪表盘筛选条件

- 180a1f1d：功能：将表格磁贴的分组单元格筛选为临时仪表盘筛选条件

- 7db73cff：功能：将时间图表序列筛选为临时仪表盘筛选条件

- a682ce13：功能：渲染临时仪表盘筛选输入控件

- 9891a791：功能：新增临时仪表盘筛选的 Schema 和类型

- 43b09a7d：功能：新增配置临时仪表盘筛选的界面

- f56d760d：功能：侧栏中的“Beta”“UTC”和实例标签徽标，以及“新增内容”中的“最新”“新增”和“破坏性变更”徽标，改用 click-ui 的 `Badge`。

- 5253b861：修复：图表坐标轴和大数字格式不再将 500 至 999 之间的值缩写为“0.5k”／“0.8k”

- 89ad2760：被移除的列属于多字段排序中的一个字段时，仅移除该排序字段

- 4d74bd5b：修复：使已保存搜索可在手机上使用。宽度低于 900px 时，筛选器在抽屉中打开，SELECT 和 ORDER BY 置于“列”入口内，剩余屏幕空间留给日志表格。

- 72ed4062：修复：时间选择器不再将已选日期范围重置为当前年份。范围不在当前年份内或延伸到未来时，范围文本现在包含年份，因此重新解析时可保留该范围。

- c0af58bc：修复：让“服务 > 数据库”查询抽屉使用 Span 属性跳数索引，避免扫描整个 Trace 时间窗口

- 0444e3ea：修复：将“连接到演示服务器”的连接指向新的演示 ClickHouse

- f33fc83c：在“服务”和 LLM 仪表盘中，将以旧版 `STATUS_CODE_ERROR` 状态记录的 Span 计为错误。错误 Span 的定义现已集中维护，同时匹配该值和简短的 `Error` 形式，因此这些仪表盘不再少计使用长形式状态的采集器所产生的错误。

- a89b3241：修复：搜索页的筛选键数量限制（Filter Keys Fetch Limit，默认 100）现在分别作用于每个 Map 列，`LogAttributes` 的键不再挤占 `ResourceAttributes` 及其他 Map 列的键名额

- 7d77d276：修复：修正表格排序状态，并支持不指定 asc/desc 的 order by

- f1bdd8fa：修复含字符串类型 `id` 列的表格在展开行时的问题：行详情现在保留内部 WHERE 子句使用的 id，不再被原始列值覆盖（#3370）

- f078e6be：功能：为搜索页直方图新增分组

- 0840b8b8：功能：导入临时筛选器时支持数据源重新映射

- 2c2295fd：功能：Kubernetes 仪表盘及其节点、命名空间和 Pod 抽屉中的所有状态徽标改用 click-ui 的 `Badge`。

- 0000fa4b：功能：新增折线插值显示设置（平滑、线性、阶梯）

- 3db148a0：功能：LLM Span 面板、会话抽屉及仪表盘中的模型、提供方、工具、代理和聊天角色徽标改用 click-ui 的 `Badge`。

- eb72cfa1：功能（MCP）：新增 `clickstack_service_health`，通过一次调用提供 Trace 数据源中各服务的健康报告（吞吐量、错误率、p50/p95/p99、主要错误分组），与昨日对比，并将状况最差的服务排在最前

- 938494d8：功能：指标浏览器、图表序列与公式编辑器、磁贴告警编辑器、物化视图指示器与弹窗，以及行侧边面板中的 Span 类型，改用 click-ui 的 `Badge`。

- bc0a1e47：重构：在 useMultipleGetKeyValues 中查询每个数据源，并在其中一个失败时保留部分结果

- f21bdb85：修复：搜索页筛选侧栏的 Map 和 JSON 筛选分组（如 `LogAttributes`）中的键，在滚出可见区域再滚回后，仍保持原有的展开或折叠状态。

- b000bbba：修复：为搜索页筛选侧栏的 Map 和 JSON 筛选分组（如 `ResourceAttributes`、`LogAttributes`）添加键搜索，与普通筛选器中的值搜索保持一致。

- 8b92b7ac：修复：搜索页筛选侧栏的 Map 和 JSON 筛选分组（如 `LogAttributes`）中的键，排在已选值的键和固定键之后，并按字母顺序排序。

- 5cabc115：功能：支持根据 PromQL 数据计算的分布热力图

- e7b38c2a：修复：对带有 `exception.type`、`exception.message` 或 `exception.stacktrace` 属性的日志和 Span 显示异常面板，不再仅针对 `exception` Span 事件；即使关联日志所属的 Span 从未导出，也在 Trace 瀑布图中显示这些日志，并将错误日志和 `exception` Span 事件标为红色；为默认 Trace 数据源设置 `spanEventsValueExpression` 和 `spanLinksValueExpression`，使 Span 异常和链接开箱即用。默认数据源还加入摘要和指数直方图指标表，并移除 Schema 已不再创建的键汇总表。

- 097cb7c0：修复：Span 侧边面板和 Trace 瀑布图读取当前的 OpenTelemetry HTTP 与 RPC 语义约定，并以已弃用的名称作为回退；围绕请求行及详情重新设计 HTTP 面板，新增 gRPC/RPC 调用面板，并根据 SeverityNumber 或忽略大小写的 SeverityText 标记关联日志中的错误和警告

- 07de6134：重构：useMultipleAllFields 返回各表连接的字段和列。

- a4b63953：修复：将百分位聚合（`p50`、`p90`、`p95`、`p99`）渲染为具有对应分位水平的 `quantile`。此前，含 `aggFn: 'p95'` 的图表配置会被渲染为不存在的 ClickHouse 函数 `p95If`。AI 助手现在返回带分位水平的百分位，而非不带参数的 `quantile`（中位数）；v1 指标图表转换也会保留百分位水平。

- 3bedfab3：功能：支持从 PromQL 桶指标生成直方图热力图

- c94d12c3：修复：通过数据源解析 PromQL 查询，而非使用调用者提供的连接和表

  `/api/v1/prometheus/*` 路由现在接受 `sourceId` 而非 `connectionId`，并从该 PromQL 数据源读取连接和 TimeSeries 表。对于 ClickHouse，忽略调用者提供的 `database`/`table` 参数，也不再将这些参数转发给外部 Prometheus 端点。已保存的 PromQL 图表配置现在必须包含 `source`，且不再保存 `connection`，因此通过配置预置的仪表盘若含 PromQL 磁贴，必须设置 `source`。

- 30debf92：将 Trace 扫描范围限定为 RUM 服务，以加快会话查询

- b9f61708：维护：将 @tanstack/react-query 升级至 5.90，并避免将已取消的筛选值流的部分结果写入缓存

- 685f4650：修复：发布标记提示框中的长值改为换行，避免溢出

- f41027f2：功能：异常面包屑的状态与级别标签、AI 助手的“实验性”标签，以及物化视图配置胶囊控件，改用 click-ui 的 `Badge`。移除 `LogSidePanelElements` 中未使用的堆栈跟踪、面包屑及 source map 代码，以及未使用的 `StacktraceFrame` 组件。

- e3f24b94：修复：在搜索重放链接中保留多行 SQL

- d341ba0f：修复：使用主键和表中持久化的 `_block_number`／`_block_offset` 中任一列来解析行详情；不再因仅设置 `enable_block_number_column`／`enable_block_offset_column` 其中一个，就回退到缓慢的整行查找

- 3ff761b6：功能：在本地存储中记住服务图采样率；`samplingFactor` URL 参数仍具有更高优先级

- 96a0861f：在窄屏上以数字形式显示分组字段数量

- 85675fc8：性能：每个查询完成后立即将筛选值流式传入界面，不再等待全部查询完成

- d3e6f969：功能：仪表盘和告警标签，以及设置中的“实验性”“Beta”“已禁用”“仅开发环境”、团队成员和待处理邀请徽标，改用 click-ui 的 `Badge`。

- e8f0f948：修复：仪表盘分组较多时，将分组列表移至可滚动的“移至分组”子菜单，使仪表盘磁贴菜单保持在屏幕内

- af6e7f6b：为磁贴编辑器添加描述字段。描述现在与名称一起存储在磁贴的图表配置中，并在外部 Dashboards API 中为序列磁贴保留。

- 02080f20：新增可选的磁贴描述，外部 Dashboards API 接受该字段，并在磁贴名称旁通过信息提示框显示。

- dab6eb89：修复：按显示时区读取和展示时间选择器范围，使 UTC 以西时区的用户开启“使用 UTC 时间”后，应用范围时不再发生偏移

- ce6654dd：重构：将时间显示设置存储为时区，替代 UTC 开关，并转换现有设置；移除 `formatDate` 的 `isUTC` 选项

- d1cecf8b：修复在同一 Trace 中打开另一个 Span（包括从会话重放打开）时，Trace 瀑布图仍停留在之前 Span 的问题。关闭结果会清除选中的 Span；打开不同结果会选择该结果的 Span，包括瀑布图仍基于缓存数据保持挂载的情况。

- 807cd9a5：修复：webhook 表单现在会在编辑时编译正文模板，并显示 Handlebars 错误及其行号和列号。此前，损坏的模板只有在告警发送失败后才会给出反馈。

- 更新依赖 [92058236]
- 更新依赖 [3e9185d1]
- 更新依赖 [180a1f1d]
- 更新依赖 [a682ce13]
- 更新依赖 [9891a791]
- 更新依赖 [43b09a7d]
- 更新依赖 [27cccf7a]
- 更新依赖 [8d064df4]
- 更新依赖 [9c2c7031]
- 更新依赖 [0000fa4b]
- 更新依赖 [ee9f84b2]
- 更新依赖 [24d324c2]
- 更新依赖 [748315d7]
- 更新依赖 [eb72cfa1]
- 更新依赖 [cdfae457]
- 更新依赖 [b00d4100]
- 更新依赖 [a06b17fb]
- 更新依赖 [e494a46d]
- 更新依赖 [03f9fd5a]
- 更新依赖 [5cabc115]
- 更新依赖 [a4b63953]
- 更新依赖 [3bedfab3]
- 更新依赖 [ca8e3fda]
- 更新依赖 [c94d12c3]
- 更新依赖 [be5304dd]
- 更新依赖 [95aef70f]
- 更新依赖 [bc47e485]
- 更新依赖 [85675fc8]
- 更新依赖 [af6e7f6b]
- 更新依赖 [02080f20]
- 更新依赖 [dab6eb89]
- 更新依赖 [ce6654dd]
- 更新依赖 [28168ae6]
- 更新依赖 [ecddea2a]
- 更新依赖 [807cd9a5]
- 更新依赖 [cfa865bd]
  - @hyperdx/common-utils@0.32.0
  - @hyperdx/api@2.42.0

## @hyperdx/otel-collector@2.42.0

### 补丁变更

- ab563d28：不再针对每条包含花括号但并非 JSON 的日志正文（如 Go 结构体或 Python 字典转储）记录 `ParseJSON` 语法错误。JSON 提取现在仅匹配以带引号的键开头的对象，并静默处理该语句组中剩余的解析失败。

- ca8e3fda：修复：为 PromQL remote-write 端点和 ClickHouse 抓取支持 HTTPS

  `CLICKHOUSE_PROMETHEUS_METRICS_ENDPOINT` 现在既接受 `http://` 或 `https://` URL，也接受不带协议的 `host:port`。使用 `https://` 时，采集器的 `prometheusremotewrite` 导出器通过 TLS 发送指标，并根据系统 CA 验证服务器证书。此前导出器始终使用明文 HTTP，因此仅支持 HTTPS 的端点无法接收指标。此行为同时适用于独立运行及由 OpAMP 管理的采集器。

  不带协议的 `host:port` 继续使用明文 HTTP，现有配置因此保持不变。该值不得包含路径（仍会自动追加 `/write`）；如果包含路径，或协议不是 `http`／`https`，采集器现在会在启动时退出并给出明确错误。

  此前，由 OpAMP 管理的采集器无论端点协议如何，都使用明文 HTTP 抓取。现在，ClickHouse 在独立的 `clickhouse` 作业（此前为 `otelcol` 作业）中按端点协议抓取，并启用 TLS 验证。采集器自身的指标端点继续使用明文 HTTP。不带协议的 `host:port` 或 `http://` 端点行为与此前相同。抓取的 ClickHouse 指标现在携带 `job="clickhouse"`，替代 `job="otelcol"`。



## @hyperdx/common-utils@0.32.0

### 次版本变更

- 95aef70f：为日志数据源新增可选的 `eventNameExpression`，指向 OpenTelemetry 日志的 EventName。当 OTel 日志表具有字符串类型的 `EventName` 列时，数据源自动检测会设置该字段。目前仅存储该字段并允许编辑，尚无功能读取它。HDX-5787

- bc47e485：为日志数据源新增可选的 `severityNumberExpression`，指向 OpenTelemetry 的数值型 SeverityNumber（1–24）。当 OTel 日志表具有整数类型的 `SeverityNumber` 列时，数据源自动检测会设置该字段。目前仅存储该字段并允许编辑；日志级别仍取自严重性文本。

- cfa865bd：功能：将分组值以 `{{var.<column>}}` 的形式提供给 webhook 正文模板，并在恢复通知中保留这些值

### 补丁变更

- 92058236：功能：广播临时仪表盘筛选条件

- 3e9185d1：功能：将搜索磁贴的单元格筛选为临时仪表盘筛选条件

- 180a1f1d：功能：将表格磁贴的分组单元格筛选为临时仪表盘筛选条件

- a682ce13：功能：渲染临时仪表盘筛选输入控件

- 9891a791：功能：新增临时仪表盘筛选的 Schema 和类型

- 43b09a7d：功能：新增配置临时仪表盘筛选的界面

- 0000fa4b：功能：新增折线插值显示设置（平滑、线性、阶梯）

- eb72cfa1：功能（MCP）：新增 `clickstack_service_health`，通过一次调用提供 Trace 数据源中各服务的健康报告（吞吐量、错误率、p50/p95/p99、主要错误分组），与昨日对比，并将状况最差的服务排在最前

- 03f9fd5a：修复（MCP）：为每个 MCP 工具输入提供描述，删除重复陈述 Schema 约束的描述，并使工具描述低于 Claude Code 的 2 KB 限制

- 5cabc115：功能：支持根据 PromQL 数据计算的分布热力图

- a4b63953：修复：将百分位聚合（`p50`、`p90`、`p95`、`p99`）渲染为具有对应分位水平的 `quantile`。此前，含 `aggFn: 'p95'` 的图表配置会被渲染为不存在的 ClickHouse 函数 `p95If`。AI 助手现在返回带分位水平的百分位，而非不带参数的 `quantile`（中位数）；v1 指标图表转换也会保留百分位水平。

- 3bedfab3：功能：支持从 PromQL 桶指标生成直方图热力图

- c94d12c3：修复：通过数据源解析 PromQL 查询，而非使用调用者提供的连接和表

  `/api/v1/prometheus/*` 路由现在接受 `sourceId` 而非 `connectionId`，并从该 PromQL 数据源读取连接和 TimeSeries 表。对于 ClickHouse，忽略调用者提供的 `database`/`table` 参数，也不再将这些参数转发给外部 Prometheus 端点。已保存的 PromQL 图表配置现在必须包含 `source`，且不再保存 `connection`，因此通过配置预置的仪表盘若含 PromQL 磁贴，必须设置 `source`。

- 85675fc8：性能：每个查询完成后立即将筛选值流式传入界面，不再等待全部查询完成

- af6e7f6b：为磁贴编辑器添加描述字段。描述现在与名称一起存储在磁贴的图表配置中，并在外部 Dashboards API 中为序列磁贴保留。

- 02080f20：新增可选的磁贴描述，外部 Dashboards API 接受该字段，并在磁贴名称旁通过信息提示框显示。

- dab6eb89：修复：按显示时区读取和展示时间选择器范围，使 UTC 以西时区的用户开启“使用 UTC 时间”后，应用范围时不再发生偏移

- ce6654dd：重构：将时间显示设置存储为时区，替代 UTC 开关，并转换现有设置；移除 `formatDate` 的 `isUTC` 选项

- 28168ae6：修复：当更精细的时间戳列也参与范围筛选时，将时间筛选起点向下取整至较粗时间戳列的精度（DateTime、精度低于毫秒的 DateTime64），使亚秒级起点不再丢弃该时间刻度内剩余的数据；通过 `EXTERNAL_API_SEARCH_MAX_RESULTS` 配置外部 API v2 搜索的 `maxResults` 上限（默认为此前硬编码的 2000）

- 807cd9a5：修复：webhook 表单现在会在编辑时编译正文模板，并显示 Handlebars 错误及其行号和列号。此前，损坏的模板只有在告警发送失败后才会给出反馈。



## @hyperdx/api@2.42.0

### 次版本变更

- 9c2c7031：功能：在外部 API 中支持 PromQL 仪表盘磁贴

  `/api/v2/dashboards` 现在返回 PromQL 磁贴，并在创建和更新时接受它们，形式为 `configType: "promql"`，包含 `sourceId` 和 `expressions` 列表。此前，响应中不包含 PromQL 磁贴，因而通过 API 将仪表盘保存回去时会删除这些磁贴。MCP 仪表盘工具在支持编辑 PromQL 磁贴前，仍会隐藏它们。

- eb72cfa1：功能（MCP）：新增 `clickstack_service_health`，通过一次调用提供 Trace 数据源中各服务的健康报告（吞吐量、错误率、p50/p95/p99、主要错误分组），与昨日对比，并将状况最差的服务排在最前

- 95aef70f：为日志数据源新增可选的 `eventNameExpression`，指向 OpenTelemetry 日志的 EventName。当 OTel 日志表具有字符串类型的 `EventName` 列时，数据源自动检测会设置该字段。目前仅存储该字段并允许编辑，尚无功能读取它。HDX-5787

- bc47e485：为日志数据源新增可选的 `severityNumberExpression`，指向 OpenTelemetry 的数值型 SeverityNumber（1–24）。当 OTel 日志表具有整数类型的 `SeverityNumber` 列时，数据源自动检测会设置该字段。目前仅存储该字段并允许编辑；日志级别仍取自严重性文本。

- cfa865bd：功能：将分组值以 `{{var.<column>}}` 的形式提供给 webhook 正文模板，并在恢复通知中保留这些值

### 补丁变更

- 9891a791：功能：新增临时仪表盘筛选的 Schema 和类型

- 27cccf7a：修复：未启用 PromQL 时，拒绝通过外部 API 创建或更新 PromQL 数据源

  除非设置 `ENABLE_PROMQL`，否则 `POST` 和 `PUT /api/v2/sources` 对 `kind: "promql"` 现在返回 400，因为未启用该设置时无法查询 PromQL 数据源。

- 8d064df4：修复：拒绝外部 API 中引用非 PromQL 数据源的 PromQL 磁贴，并在 MCP 代理更新仪表盘时保留 PromQL 磁贴

  PromQL 磁贴的 `sourceId` 不是 PromQL 数据源时，`/api/v2/dashboards` 现在返回 400。MCP `clickstack_save_dashboard` 更新不再删除 MCP 对代理隐藏的 PromQL 磁贴。

- 0000fa4b：功能：新增折线插值显示设置（平滑、线性、阶梯）

- ee9f84b2：功能（MCP）：记录每次 MCP 工具调用的响应大小

- 24d324c2：修复（MCP）：clickstack_save_saved_search 创建搜索时若未指定 whereLanguage，则将其存储为 lucene，使该搜索的告警不再将 Lucene 筛选器按 SQL 解析

- 748315d7：功能（MCP）：在 MCP 服务器的 initialize 响应中提供标题、描述、网站 URL 和 SVG 图标

- cdfae457：修复（MCP）：`clickstack_sql` 现在会绑定其描述中列出的时间桶大小参数。此前，`{intervalSeconds:Int64}`、`{intervalMilliseconds:Int64}`、`$__interval_s`、`$__timeInterval` 和 `$__timeInterval_ms` 会因“Substitution intervalSeconds is not set”（未设置替换参数 intervalSeconds）而失败，包括工具自身的时间序列示例。

- b00d4100：功能（MCP）：`clickstack_sql` 接受可选的 `sourceId`，使 `$__sourceTable` 展开为该数据源的表。未知数据源、其他团队的数据源，以及连接与 `connectionId` 不同的数据源均会被拒绝；未提供 `sourceId` 却使用 `$__sourceTable` 的情况同样被拒绝。

- a06b17fb：修复（MCP）：避免 `clickstack_sql` 调用者猜测表名和时间戳列名。`clickstack_list_sources` 现在返回每个数据源包含数据库限定名的 `table`（指标数据源还返回 `database`）；`sql` 示例使用 `<table>` 和 `<timestampColumn>` 占位符，替代 `otel_logs` 和 `TimestampTime`；`clickstack_sql` 的未知表错误会引导调用者使用 `clickstack_list_sources`。

- e494a46d：功能（MCP）：为每个 MCP 工具声明 readOnlyHint、destructiveHint、idempotentHint 和 openWorldHint

- 03f9fd5a：修复（MCP）：为每个 MCP 工具输入提供描述，删除重复陈述 Schema 约束的描述，并使工具描述低于 Claude Code 的 2 KB 限制

- 5cabc115：功能：支持根据 PromQL 数据计算的分布热力图

- a4b63953：修复：将百分位聚合（`p50`、`p90`、`p95`、`p99`）渲染为具有对应分位水平的 `quantile`。此前，含 `aggFn: 'p95'` 的图表配置会被渲染为不存在的 ClickHouse 函数 `p95If`。AI 助手现在返回带分位水平的百分位，而非不带参数的 `quantile`（中位数）；v1 指标图表转换也会保留百分位水平。

- ca8e3fda：修复：为 PromQL remote-write 端点和 ClickHouse 抓取支持 HTTPS

  `CLICKHOUSE_PROMETHEUS_METRICS_ENDPOINT` 现在既接受 `http://` 或 `https://` URL，也接受不带协议的 `host:port`。使用 `https://` 时，采集器的 `prometheusremotewrite` 导出器通过 TLS 发送指标，并根据系统 CA 验证服务器证书。此前导出器始终使用明文 HTTP，因此仅支持 HTTPS 的端点无法接收指标。此行为同时适用于独立运行及由 OpAMP 管理的采集器。

  不带协议的 `host:port` 继续使用明文 HTTP，现有配置因此保持不变。该值不得包含路径（仍会自动追加 `/write`）；如果包含路径，或协议不是 `http`／`https`，采集器现在会在启动时退出并给出明确错误。

  此前，由 OpAMP 管理的采集器无论端点协议如何，都使用明文 HTTP 抓取。现在，ClickHouse 在独立的 `clickhouse` 作业（此前为 `otelcol` 作业）中按端点协议抓取，并启用 TLS 验证。采集器自身的指标端点继续使用明文 HTTP。不带协议的 `host:port` 或 `http://` 端点行为与此前相同。抓取的 ClickHouse 指标现在携带 `job="clickhouse"`，替代 `job="otelcol"`。

- c94d12c3：修复：通过数据源解析 PromQL 查询，而非使用调用者提供的连接和表

  `/api/v1/prometheus/*` 路由现在接受 `sourceId` 而非 `connectionId`，并从该 PromQL 数据源读取连接和 TimeSeries 表。对于 ClickHouse，忽略调用者提供的 `database`/`table` 参数，也不再将这些参数转发给外部 Prometheus 端点。已保存的 PromQL 图表配置现在必须包含 `source`，且不再保存 `connection`，因此通过配置预置的仪表盘若含 PromQL 磁贴，必须设置 `source`。

- be5304dd：转发 ClickHouse 代理正文解析器读取的字节，不改变 JSON 值、表单字段或文本编码。使请求消息定界与解压后的字节保持一致，并保留尚未解析的 multipart 数据流。

- af6e7f6b：为磁贴编辑器添加描述字段。描述现在与名称一起存储在磁贴的图表配置中，并在外部 Dashboards API 中为序列磁贴保留。

- 02080f20：新增可选的磁贴描述，外部 Dashboards API 接受该字段，并在磁贴名称旁通过信息提示框显示。

- ce6654dd：重构：将时间显示设置存储为时区，替代 UTC 开关，并转换现有设置；移除 `formatDate` 的 `isUTC` 选项

- 28168ae6：修复：当更精细的时间戳列也参与范围筛选时，将时间筛选起点向下取整至较粗时间戳列的精度（DateTime、精度低于毫秒的 DateTime64），使亚秒级起点不再丢弃该时间刻度内剩余的数据；通过 `EXTERNAL_API_SEARCH_MAX_RESULTS` 配置外部 API v2 搜索的 `maxResults` 上限（默认为此前硬编码的 2000）

- ecddea2a：修复：对于无法编译或调用了发送逻辑未注册的辅助函数（例如将 `eq` 拼错）的通用 webhook 和 incident.io webhook 正文模板，在创建、更新和测试时返回 400，适用于内部 API、外部 API v2 和 MCP `clickstack_save_webhook`。新增 `POST /api/v2/webhooks/validate`，用于在不保存的情况下检查 webhook 配置，例如在 Terraform plan 阶段。

- 更新依赖 [92058236]
- 更新依赖 [3e9185d1]
- 更新依赖 [180a1f1d]
- 更新依赖 [a682ce13]
- 更新依赖 [9891a791]
- 更新依赖 [43b09a7d]
- 更新依赖 [0000fa4b]
- 更新依赖 [eb72cfa1]
- 更新依赖 [03f9fd5a]
- 更新依赖 [5cabc115]
- 更新依赖 [a4b63953]
- 更新依赖 [3bedfab3]
- 更新依赖 [c94d12c3]
- 更新依赖 [95aef70f]
- 更新依赖 [bc47e485]
- 更新依赖 [85675fc8]
- 更新依赖 [af6e7f6b]
- 更新依赖 [02080f20]
- 更新依赖 [dab6eb89]
- 更新依赖 [ce6654dd]
- 更新依赖 [28168ae6]
- 更新依赖 [807cd9a5]
- 更新依赖 [cfa865bd]
  - @hyperdx/common-utils@0.32.0
