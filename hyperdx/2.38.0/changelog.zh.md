## @hyperdx/app@2.38.0

### 次版本变更

- 503aac82：当关联的主机/节点存在 `hw.gpu.*` 指标（OTel 硬件语义约定）时，在日志/Span 侧边面板的“基础设施”区域显示 GPU 利用率与 GPU 显存利用率图表。同一主机上的多个 GPU 会按 `hw.id` 分组并渲染为独立序列；利用率还会按 `hw.gpu.task` 拆分到各 GPU 引擎（general/encoder/decoder），因此即使节点仅在视频编码方面达到饱和也能被观察到；缺少任务值时按 `general` 报告。没有 GPU 指标时会完全隐藏该区域，只有一种指标时则只渲染相应部分。

  “基础设施”标签页现在还会把存在但值为空的 Kubernetes 资源属性（例如 `k8s.node.name: ""`）视为不存在。此前这类行会显示一个可能没有任何内容可渲染的“基础设施”标签页。

  修复 GPU 图表可用性状态在不同行之间泄漏的问题：将侧边面板切换到另一台主机的行时，曾会短暂渲染上一台主机的 GPU 图表集合，因为在新查询运行期间，可用性查询仍会保留旧结果供读取。

- 38e99a37：在 `/llm` 新增读取时、与 Schema 无关的 LLM 可观测性仪表盘（Beta，可从仪表盘列表进入）——无需改变摄取流程，并可追溯分析已经摄取的遥测数据。对于使用 OTel GenAI 语义约定、OpenLLMetry、OpenInference 或 Vercel AI SDK 埋点的 Trace，系统会在查询时解释数据，并绘制流量、Token 分类（未缓存/已缓存/缓存写入/输出/推理）、按模型估算的成本（内置价格目录，支持缓存读取折扣和缓存写入溢价；埋点直接提供的成本属性始终优先）、延迟/TTFT、工具分析、带延迟加载对话视图的逐会话时间线，以及并排的 LLM Span/日志搜索。聚合会选择应用自身报告成本的 Span 作为每次调用的权威报告者，因此并行发出多种埋点方言的应用（例如 opencode 为每次调用同时发出 OpenInference 与 Vercel AI Span）只会计数一次；经验证，结果与 opencode 自报的会话成本完全一致。

### 补丁变更

- 3f7934a5：chore：为 `SourceSelectControlledComponent` 添加 `isSourceAllowed` 属性。
- b917308d：修复：图表编辑器中的指标名称现在采用确定性列表，而非采样。下拉框此前通过 `groupUniqArray(3000)(MetricName)` 发现名称；当指标表包含超过 3000 个不同名称时，它只保留任意子集——保留下来的项目取决于哈希顺序而非名称顺序——导致确实存在且持续上报的指标可能无法选择，既没有警告，也无法搜索被丢弃的名称。名称现在通过有序、分页查询获取，并在服务端匹配；排序保证精确匹配始终位于第一页，下拉框也会提示列表是否不完整。同时修复指标列表忽略图表所选时间范围、始终固定为最近 24 小时的问题。
- bf4443df：feat：支持 PromQL 标签过滤器自动补全。
- 55db91fa：feat：在 MCP 中支持静态过滤器。
- 89a897ec：修复单序列直方图按分组列或表达式排序时因“Unknown expression or function identifier”而失败的问题。直方图转换会把分组值打包进一个 `group` Array，因此表格默认 ORDER BY（原始分组文本）曾引用作用域中已经不存在的源列；匹配的排序项现在会按位置访问打包后的数组。
- fbb1e20f：保留 SQL 与 PromQL 图表配置的条件颜色规则。
- 020e85f3：修复图表编辑器指标名称选择器的两个问题。截断和加载失败提示现在显示在输入框下方而非上方，不再把字段向下推、使其与旁边的“浏览指标”按钮错位；两条提示也已缩短，以便在磁贴编辑器列宽内显示而不换行。搜索无匹配结果时现在会明确提示，而不是静默隐藏下拉框，并会把搜索的名称作为可选项提供——目录只覆盖图表时间范围内最近三天，因此此前已经停止上报的指标无法按名称绘图。
- f1062a7b：修复多序列指标图按表达式分组（例如 `ResourceAttributes['service.name']`）排序时因“Unknown expression or function identifier”而失败的问题。表格磁贴默认使用分组文本作为 ORDER BY，所以任何按资源/属性派生表达式分组的多序列指标表都无法渲染。此类排序表达式现在通过内部伴随列在每个序列分支中求值，而不会在组合后的外层查询中重新求值，因为那里已不存在源列。
- cdcb023e：修复：在模式样本抽屉中可靠显示服务名称与级别。
- 0ebb689a：修复：对 PromQL 标签和值去重，防止 Mantine 崩溃。
- 4184a898：feat：支持基于 Prometheus 标签值的仪表盘过滤器。
- 27360036：feat：在 PromQL 标签仪表盘过滤器中支持序列过滤器（matcher）。
- bcf0257c：feat：Prometheus 标签值端点接受可选的时间边界。
- c7965927：feat：PromQL 序列图例支持自定义模板。
- 83c1b57f：feat：显示静态值过滤器。
- 66f6cf0b：新增 `window.hdx` 浏览器控制台调试句柄，并在“帮助”菜单新增“复制调试信息”操作，便于确认已部署的构建版本，并获取提交 Issue 时值得附带的上下文。`window.hdx.report()`（以及“帮助”菜单操作）会生成可直接粘贴的摘要：前端版本（来自 package.json）、后端/API 版本（来自 `/api/health`——两者独立部署）、部署模式、用户/团队 ID、已启用且可通过环境配置的功能开关、当前 URL、屏幕/视口/操作系统/浏览器信息以及 RUM 会话 ID。该句柄只安装一次，并通过 getter 实时读取异步字段（服务端版本、身份、功能和会话 ID）。
- cff6388c：feat：为 Schema 与 API 添加静态过滤器。
- 53336f78：修复（图表）：在量级小于 10 时显示 Y 轴刻度的小数。

  时间序列图的 Y 轴（以及 CLI 中对应的 termchart）此前无论“数字格式”如何设置，都会把刻度标签四舍五入到 0 位小数。数值小于 1 的图表（小数型仪表、比率、低于 1 的速率）会把每个轴刻度都渲染为 `0`，尽管工具提示与图例显示的是正确值。

  现在，显示量级小于 10 的刻度会遵循图表配置的小数位数，但最多保留 2 位，以适应坐标轴的固定宽度。百分比刻度按乘以 100 后的显示值判断量级，而不是原始的 0–1 比率。大于等于 10 的刻度以及恰好为 0 的刻度仍会像以前一样保持整数，不受图表“数字格式”配置影响。

  - 因此，普通计数以及内置仪表盘模板中的字节/百分比磁贴不受影响。

- 25a3b015：在 Webhook 表单中列出所有受支持的模板变量，包括 Generic 与 incident.io 正文中新增加的 `{{alertId}}`、`{{status}}`、`{{alertType}}`、`{{comparator}}`、`{{threshold}}`、`{{thresholdMax}}`、`{{value}}`、`{{groupKey}}`、`{{sourceQuery}}`、`{{teamId}}`、`{{note}}`，以及 ISO-8601 格式的 `{{startTimeISO}}` / `{{endTimeISO}}`。每个变量现在都有一行说明，因此无需离开表单即可编写 Webhook 正文。
- 0a187457：feat：允许在 UI 中创建和编辑静态列表过滤器。
- 更新依赖 [74c28e7f]
- 更新依赖 [25a3b015]
- 更新依赖 [9c4f94f2]
- 更新依赖 [808b3453]
- 更新依赖 [b917308d]
- 更新依赖 [bf4443df]
- 更新依赖 [55db91fa]
- 更新依赖 [89a897ec]
- 更新依赖 [f0d1cef5]
- 更新依赖 [f1062a7b]
- 更新依赖 [4184a898]
- 更新依赖 [27360036]
- 更新依赖 [7ed8dc8c]
- 更新依赖 [bcf0257c]
- 更新依赖 [c7965927]
- 更新依赖 [d9c5c455]
- 更新依赖 [cff6388c]
  - @hyperdx/api@2.38.0
  - @hyperdx/common-utils@0.28.1

## @hyperdx/api@2.38.0

### 次版本变更

- 74c28e7f：feat：告警现在会持久保存自身的 `displayName` 和 `tags`。
- 9c4f94f2：为 Generic 和 incident.io Webhook 正文增加模板变量：`{{alertId}}`、`{{status}}`、`{{alertType}}`、`{{comparator}}`、`{{threshold}}`、`{{value}}`、`{{groupKey}}`、`{{sourceQuery}}`、`{{teamId}}`、`{{note}}`，以及 ISO-8601 格式的 `{{startTimeISO}}` / `{{endTimeISO}}`；原有 Unix 毫秒格式的 `{{startTime}}` / `{{endTime}}` 仍然保留。

  接收端现在无需解析渲染后的消息正文，就能根据告警的身份和条件进行路由、过滤与去重。现有模板不受影响——每个新变量都是增量添加的；告警不含对应数据时会渲染为空值。

- f0d1cef5：在外部 API v2 以及 MCP 的 `clickstack_save_alert` / `clickstack_get_alert` 工具中支持 inline 图表告警（来源 `inline` + `chartConfig`）。现在可以通过 `/api/v2/alerts` 使用与 v2 仪表盘相同的磁贴配置方言创建、更新、列出和删除 inline 告警，并遵循与内部 API 相同的校验规则：显示类型允许列表、指标公式校验、公式来源类型门控、原始 SQL 模板校验，以及团队范围内的来源/Connection 所有权。向 `tile` 或 `saved_search` 告警传入 `chartConfig` 现在会被拒绝，而不是静默丢弃；读取配置含有仅供内部使用字段的 inline 告警时，会省略 `chartConfig`，而不是返回有损近似结果。

  同时修复外部 v2 仪表盘路径上已有的三个问题：通过 `clickstack_save_dashboard` 保存且设置 `isDelta: true` 的 gauge 磁贴曾被持久化为非 Delta（将 MCP 磁贴转换为内部结构时丢失了该标志）；包含无法识别的 `configType`（例如 `promql`）的磁贴配置曾被静默存为 Builder 配置，并绕过公式与数字选择规则，现在会被拒绝；告警正文的校验错误不再统一坍缩为 `Invalid input`，Schema 会报告失败分支自身的消息。

- d9c5c455：修复：代理 PromQL 时保留 Connection 主机的路径前缀。`proxyToPrometheus` 此前使用 `new URL(path, host)` 连接 Prometheus 绝对路径（`/api/v1/query_range`、`/api/v1/query`、`/api/v1/query_exemplars`、`/api/v1/label/.../values`），这会替换而不是追加主机路径。VictoriaMetrics 集群的 `vmselect` URL（例如 `http://vmselect:8481/select/0/prometheus`）因此被重写为 `/api/v1/query_range` 并遭拒绝。连接逻辑现在会保留既有路径。

  对于主机地址已包含、但原本并非 Prometheus API 前缀的路径，这是一项行为变更——例如从 Prometheus UI 复制的 `http://prom:9090/graph`。以前绝对 API 路径会替换 `/graph`，所以它碰巧能够工作；现在请求会发往 `/graph/api/v1/query_range` 并返回 404。升级前请从现有 Connection 主机地址中删除多余路径。挂载在根路径的主机（`http://prom:9090` 或 `http://prom:9090/`）不受影响。

  Connection 主机上的查询参数现在只会作为一组固定、真实 Prometheus API 参数的回退值：`query`、`time`、`start`、`end`、`step`、`match`/`match[]`、`limit`、`timeout`、`stats`。请求为其中某个参数提供值时（包括 `match[]` 这类可重复参数），始终优先并完全替换主机上的同名值，不再被丢弃。请求中没有提及的其他主机查询键——例如用 `?extra_label=namespace%3Dprod` 固定 VictoriaMetrics 租户范围——会保持原样，且请求无法覆盖，因为固定集合之外的参数名无论主机是否携带都不会从请求转发。这也意味着，若复制的主机地址误带查询字符串（不只是误带路径），其中非 Prometheus 键现在会作为回退值随每个请求转发到上游；若非有意设置，也请清理。

  对于此前依赖此端点发送任意非 Prometheus 查询参数的直接 API 调用方（例如 curl 或 Terraform），这也是行为变更：无论 Connection 主机是否包含同名参数，该请求参数现在都会被静默丢弃而不再转发。

### 补丁变更

- 25a3b015：修复 inline 查询和仪表盘磁贴告警的 `{{sourceQuery}}` 返回空值的问题。它此前只读取已保存搜索的过滤器，因此由图表配置支撑的告警——查询位于告警或磁贴上——虽然宣称支持该变量，却永远无法渲染。现在会从实际支撑告警的配置中解析查询：Builder 的 `where` 或原始 `sqlTemplate`。

  新增 `{{thresholdMax}}`，表示 `between` / `outside` 条件的上界。接收端此前只能看到下界，无法重建触发告警的范围。对于其他比较运算符，该变量渲染为空值。

  “测试 Webhook”现在会为每个模板变量发送示例值。此前它只携带原有七个变量，因此使用新增变量的正文会把该变量渲染为空；又因为 `threshold`、`thresholdMax` 和 `value` 不带引号输出，`{"value": {{value}}}` 这样的正文会被发送为 `{"value": }` 并遭拒绝，使实际告警触发时可用的模板无法通过测试。

- 808b3453：在 OpAMP 托管模式下，OTel 摄取端点接受带 `Bearer ` 前缀的 Authorization 请求头。Collector 的 Bearer Token 认证器会精确匹配完整请求头值，但此前只配置了裸 API Key，因此发送 `Authorization: Bearer <token>` 的 RFC 6750 客户端会被拒绝。生成的 Collector 配置现在也接受每个摄取 API Key 的 `Bearer`、`bearer` 和 `BEARER` 前缀形式。
- bf4443df：feat：支持 PromQL 标签过滤器自动补全。
- 55db91fa：feat：在 MCP 中支持静态过滤器。
- 89a897ec：修复单序列直方图按分组列或表达式排序时因“Unknown expression or function identifier”而失败的问题。直方图转换会把分组值打包进一个 `group` Array，因此表格默认 ORDER BY（原始分组文本）曾引用作用域中已经不存在的源列；匹配的排序项现在会按位置访问打包后的数组。
- f1062a7b：修复多序列指标图按表达式分组（例如 `ResourceAttributes['service.name']`）排序时因“Unknown expression or function identifier”而失败的问题。表格磁贴默认使用分组文本作为 ORDER BY，所以任何按资源/属性派生表达式分组的多序列指标表都无法渲染。此类排序表达式现在通过内部伴随列在每个序列分支中求值，而不会在组合后的外层查询中重新求值，因为那里已不存在源列。
- 4184a898：feat：支持基于 Prometheus 标签值的仪表盘过滤器。
- 27360036：feat：在 PromQL 标签仪表盘过滤器中支持序列过滤器（matcher）。
- 7ed8dc8c：feat：针对 ClickHouse TimeSeries Connection，在标签与标签值端点上计算 Prometheus `match[]` 序列选择器。
- bcf0257c：feat：Prometheus 标签值端点接受可选的时间边界。
- cff6388c：feat：为 Schema 与 API 添加静态过滤器。
- 更新依赖 [74c28e7f]
- 更新依赖 [b917308d]
- 更新依赖 [55db91fa]
- 更新依赖 [89a897ec]
- 更新依赖 [f1062a7b]
- 更新依赖 [4184a898]
- 更新依赖 [27360036]
- 更新依赖 [c7965927]
- 更新依赖 [cff6388c]
  - @hyperdx/common-utils@0.28.1

## @hyperdx/common-utils@0.28.1

### 补丁变更

- 74c28e7f：feat：告警现在会持久保存自身的 `displayName` 和 `tags`。
- b917308d：修复：图表编辑器中的指标名称现在采用确定性列表，而非采样。下拉框此前通过 `groupUniqArray(3000)(MetricName)` 发现名称；当指标表包含超过 3000 个不同名称时，它只保留任意子集——保留下来的项目取决于哈希顺序而非名称顺序——导致确实存在且持续上报的指标可能无法选择，既没有警告，也无法搜索被丢弃的名称。名称现在通过有序、分页查询获取，并在服务端匹配；排序保证精确匹配始终位于第一页，下拉框也会提示列表是否不完整。同时修复指标列表忽略图表所选时间范围、始终固定为最近 24 小时的问题。
- 55db91fa：feat：在 MCP 中支持静态过滤器。
- 89a897ec：修复单序列直方图按分组列或表达式排序时因“Unknown expression or function identifier”而失败的问题。直方图转换会把分组值打包进一个 `group` Array，因此表格默认 ORDER BY（原始分组文本）曾引用作用域中已经不存在的源列；匹配的排序项现在会按位置访问打包后的数组。
- f1062a7b：修复多序列指标图按表达式分组（例如 `ResourceAttributes['service.name']`）排序时因“Unknown expression or function identifier”而失败的问题。表格磁贴默认使用分组文本作为 ORDER BY，所以任何按资源/属性派生表达式分组的多序列指标表都无法渲染。此类排序表达式现在通过内部伴随列在每个序列分支中求值，而不会在组合后的外层查询中重新求值，因为那里已不存在源列。
- 4184a898：feat：支持基于 Prometheus 标签值的仪表盘过滤器。
- 27360036：feat：在 PromQL 标签仪表盘过滤器中支持序列过滤器（matcher）。
- c7965927：feat：PromQL 序列图例支持自定义模板。
- cff6388c：feat：为 Schema 与 API 添加静态过滤器。

## @hyperdx/otel-collector@2.38.0

### 补丁变更

- 808b3453：在 standalone 模式的 OTLP 接收端（`OTLP_AUTH_TOKEN`）接受带 `Bearer ` 前缀的 Authorization 请求头。此前只接受请求头中的裸 Token，导致发送 `Authorization: Bearer <token>` 的 RFC 6750 客户端被拒绝。现在除裸 Token 外，还接受 `Bearer`、`bearer` 与 `BEARER` 前缀形式。

