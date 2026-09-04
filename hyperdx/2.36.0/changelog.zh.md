

## @hyperdx/app@2.36.0

### 小改动

- fb284465：保存的搜索和仪表板图块的警报表单现在可以发送到多个 webhook。添加或删除内联通知渠道（最多 10 个）；警报已选择的 Webhooks 在其他选择器中显示为灰色，因为重复项被拒绝。
- b1d8dc14：公式现在适用于日志和跟踪源，而不仅仅是指标。事件源上的时间序列、表格和数字图表可以通过字母引用算术表达式（例如“A / B * 100”）定义派生序列，并使用以前仅在指标源上提供的相同编辑器控件（添加公式、系列字母徽章、显示输入序列）。事件公式内联编译到图表的单扫描 SELECT 中（无每系列查询扇出），具有与现有事件比率切换相同的缺失数据语义。
- e153f46d：在图表编辑器中添加公制公式编辑。指标源图表（时间序列、表格、数字）获得“添加公式”行：图表系列上的字母引用算术表达式（“A”= 系列 1、“B”= 系列 2，...），例如“A / (A + B) * 100”，具有内联结构化验证（格式错误的表达式、未知系列引用）、每个公式别名和数字格式，以及“显示输入系列”切换以仅呈现公式列或与其旁边的公式操作数系列。系列行现在带有参考字母作为徽章。公式和“比例”切换是互斥的，并且公式保留在仪表板图块和独立图表上。

### 补丁更改



- 59b96e99：将会话重放播放器从“rrweb@2.0.0-alpha.8”升级到稳定的“rrweb@2.1.1”，使重放器与当前“@hyperdx/browser”记录器使用的rrweb版本保持一致，并采用了几年的上游重放器修复（样式表处理、虚拟DOM、采用的样式表）。使用“rrweb@1.1.3”（旧版浏览器 SDK）和“rrweb@2.1.1”（当前 SDK）记录的会话的重播保真度已得到验证。
- f31a1458：将“CopySnippet”标题设置为可选（省略“label”以隐藏它）并添加
 “IconAiNotebook”，一个与 Tabler 兼容的 AI 笔记本自定义图标。
- 68d2ed20：壮举：支持因变量值查询
- 2eedfb26：壮举：替换图表生成器图块中的仪表板变量
- 1ce61c0c：功能：扩展仪表板变量和嵌套在宏参数中的宏
- 43f68566：允许直接从警报详细信息页面编辑和删除警报。安
 “编辑警报”操作打开一个用于更改警报阈值的模式，
 评估间隔、时间表、分组依据（已保存搜索警报）、通知
 webhook、注释和删除操作（需要确认）会删除警报
 并返回警报列表。警报 API 响应现在包括
 通知通道的 webhook id 和警报的名称/消息模板
 编辑往返这些字段。
- 905d1941：在应用程序中采用 React 19 上下文和 ref API，并通过 ESLint 强制执行。 
直接渲染`&lt;Context&gt;`而不是`<Context.Provider>`，使用`use`钩子
 而不是 `useContext`，并将 `ref` 作为常规 prop 传递而不是包装
 `forwardRef` 中的组件。对应的`@eslint-react/no-context-provider`，
 “no-use-context”和“no-forward-ref”规则被提升为“error”，并且
 应用程序的“--max-warnings”上限被降低。行为没有改变。
- b0b13806：将警报触发/恢复图表标记与评估的数据对齐：标记现在绘制在最新评估存储桶的开头（匹配评估历史记录表和绘制的数据点），而不是在评估时间（位于右侧一个存储桶）。
- 8be68100：修复仪表板过滤器选择状态在复杂表达式上的破坏。的
 过滤器解析器（与搜索页面共享）现在跟踪括号深度
 除了报价深度之外，还为基于表达式的过滤器存储了选择，例如
 如 `if(SeverityText = '错误' OR SeverityText = '致命', '错误', '非错误')`
 或 `if(SeverityText IN ('error', 'fatal'), 'Errors', 'Non-errors')` 被解析
 正确地而不是在嵌套的运算符/关键字上被删除或分割
 的表达。
- 9c7742fa：修复混合浮点和整数聚合的多系列指标图表（例如直方图分位数 + 直方图计数）失败并显示“在结果列元数据中找不到值列”。组合的 UNION ALL 查询现在将每个系列值标准化为 Float64，因此合并的列类型是确定性的，而不是因 NO_COMMON_TYPE 出错或根据 ClickHouse 服务器的 `use_variant_as_common_type` 设置生成 Variant(Float64, Int64) 列。作为防御层，全数字“Variant(...)”结果列（例如来自原始 SQL 图表）现在也被分类为数字。
- 75909ace：通过使用源的 serviceNameExpression 作为“服务”过滤器而不是硬编码的 ResourceAttributes 查找，修复非 OTEL 模式的周围上下文过滤器。还添加了快速事件属性过滤器，使用户可以切换当前事件的属性以缩小周围的上下文结果。
- 7294944a：修复：通过可注入记录器路由每个查询的 SQL 调试日志记录 (#2416)

 `BaseClickhouseClient` 在每个 ClickHouse 查询上将原始 SQL 转储到控制台，
 无条件地在 pino 记录器之外，用查询垃圾邮件淹没 API 日志。 

查询日志记录现在通过可选的每个客户端“customLogger”
 “ClickhouseClientOptions”，在“debug”处记录，并且在没有记录器时保持沉默
 通过了。该 API 注入了一个由 pino 支持的记录器，因此查询日志记录遵循
 现有的“HYPERDX_LOG_LEVEL”设置，而不是写入“console.debug”。的
 浏览器客户端默认使用控制台记录器，它将 SQL 漂亮地打印为
 单个多行块，因此查询 SQL 在 devtools 中保持可见和可读
 所有构建而不是包装成一长行。



 The API's log level now defaults to `info` (was `debug`), so SQL logging is
 silent in production unless `HYPERDX_LOG_LEVEL=debug` is set.开发和 CI 环境
 文件已经明确固定其级别并且不受影响。默认也
 现在当“HYPERDX_LOG_LEVEL”设置但为空时适用 - 这就是 Compose 的内容
 当变量在环境中未设置时通过，并且先前使
 pino 在启动时抛出。

- 47fe0cd9：在直方图上使用分类图表调色板和共享工具提示（包括服务仪表板上的请求延迟），而不是硬编码的霓虹绿色填充和一次性工具提示。
- 9f640a61：在团队设置 → API 和代理中为个人 API 访问密钥添加轮换操作。以前，个人访问密钥（外部 API v2 和 MCP 服务器的不记名令牌）在创建帐户时生成一次，并且永远无法更改，因此泄漏的密钥只能通过删除用户来修复。轮换会立即撤销之前的密钥，因此 MCP/AI 代理配置、外部 API v2 客户端、Terraform/IaC 提供程序以及使用旧密钥的 CI 脚本必须使用新密钥进行更新。浏览器会话不受影响。
- c4dcab95：引入一个共享的“ChartCard”组件，该组件为独立图表提供相同的功能
 卡片处理为自定义仪表板图块（有边框的表面+全出血标题
 分频器）。当卡体滚动时，卡头保持固定（例如卡
 包装一个长列表，如“前 20 个最耗时的查询”）：在卡片模式下
 标题是固定行，可滚动列表内容有自己的内部
 滚动区域，因此一旦您经过第一个区域，标题就不再滚动
 内容的卡片高度。迁移服务
 仪表板（HTTP、数据库、错误、端点和数据库查询侧面板）和
 ClickHouse 页面从旧的“ChartBox”包装器到“ChartCard”，以便图表显示
 整个应用程序看起来一致。
- adba65ab：修复：按字母顺序对 JSON 查看器键进行排序，以便宽地图列可扫描
- 更新了依赖项 [8723d7af]
- 更新了依赖项 [be26530f]
- 更新了依赖项 [a4b2ad00]
- 更新了依赖项 [c349a5dd]
- 更新了依赖项 [d205a776]
- 更新了依赖项 [68d2ed20]
- 更新了依赖项 [2eedfb26]
- 更新了依赖项 [1ce61c0c]
- 更新了依赖项 [90da4097]
- 更新了依赖项 [43f68566]
- 更新了依赖项 [b1d8dc14]
- 更新了依赖项 [40ec0858]
- 更新了依赖项 [b0b13806]
- 更新了依赖项 [a94d6da8]
- 更新了依赖项 [8be68100]
- 更新了依赖项 [c592207b]
- 更新了依赖项 [9c7742fa]
- 更新了依赖项 [dc29d57f]
- 更新了依赖项 [e153f46d]
- 更新了依赖项 [7294944a]
- 更新了依赖项 [e60a7d30]
- 更新了依赖项 [3ecf73c2]
- 更新了依赖项 [3ecf73c2]
- 更新了依赖项 [e153f46d]
- 更新了依赖项 [9f640a61]
- 更新了依赖项 [ea127077]
- 更新了依赖项 [08e5b62f]
 - @hyperdx/api@2.36.0
 - @hyperdx/common-utils@0.27.0

## @hyperdx/otel-collector@2.36.0

### 小改动

- 395ae8d6：壮举：支持每个信号 ClickHouse 表 TTL 并协调现有表上的 TTL

 添加“HYPERDX_OTEL_EXPORTER_LOGS_TTL”、“HYPERDX_OTEL_EXPORTER_TRACES_TTL”、“HYPERDX_OTEL_EXPORTER_METRICS_TTL”和“HYPERDX_OTEL_EXPORTER_SESSIONS_TTL”，每个都回退到现有的“HYPERDX_OTEL_EXPORTER_TABLES_TTL”，因此可以根据信号独立配置保留（例如保留日志）并跟踪 6 个月，而指标保留 30 天）。 

当“HYPERDX_OTEL_EXPORTER_RECONCILE_TABLE_TTL=true”时，迁移工具还会将配置的 TTL 应用于已存在的表（“ALTER TABLE ... MODIFY TTL”），并进行差异保护，以便仅更改保留实际上不同的表。以前，更改的 TTL 仅影响新创建的表。 Extending a retention uses `materialize_ttl_after_modify=1` so data already on disk is kept for the new (longer) period; shrinking uses `=0` so a startup reconcile never triggers a bulk delete (existing parts age out under their old TTL).仅重写简单的“&lt;锚点&gt; + &lt;一个固定长度间隔&gt;”保留：报告复合策略（“TO VOLUME”/“TO DISK”分层、“RECOMPRESS”、“GROUP BY”汇总、多个规则）和日历单位保留（月/季度/年）并保持不变。默认关闭。实现 hyperdxio/hyperdx#1311。

### 补丁更改



- d205a776：允许配置 ClickHouse 导出器请求超时
 OpAMP 管理的收集器和独立收集器中的“HYPERDX_OTEL_EXPORTER_TIMEOUT”
 模式。默认保留 5 秒。

## @hyperdx/common-utils@0.27.0

### 小改动

- be26530f：添加复数警报通知通道模式：“zAlertChannels”（1-10 个条目）、“MAX_ALERT_CHANNELS”和共享“channel”/“channels”跨字段验证器，领先于 API 中的多通道警报支持。
- b1d8dc14：公式现在适用于日志和跟踪源，而不仅仅是指标。事件源上的时间序列、表格和数字图表可以通过字母引用算术表达式（例如“A / B * 100”）定义派生序列，并使用以前仅在指标源上提供的相同编辑器控件（添加公式、系列字母徽章、显示输入序列）。事件公式内联编译到图表的单扫描 SELECT 中（无每系列查询扇出），具有与现有事件比率切换相同的缺失数据语义。
- dc29d57f：现在每个保留或接受图表配置的 API 表面都支持图表公式。外部仪表板 API v2 和 MCP `save_dashboard` / `patch_dashboard` 工具接受 `formulas`（对图块的选择项进行字母引用算术，例如 `A / (A + B) * 100`）和在线、堆叠条形图、表格和数字构建器图块上的 `showOperandSeries`，通过 GET/PUT 往返它们，并验证写入时的表达式 - 未知系列引用，格式错误的语法、将公式与“asRatio”组合、数字图块上的多个公式以及无法使用公式的源类型（度量、对数或跟踪以外的任何内容）上的公式都将被拒绝，并出现可操作的错误。 MCP“query_tile”计算指标和日志/跟踪事件图块的公式列，查询指南提示记录了该功能，OpenAPI 规范包括新的“Formula”架构。 CLI 的仪表板图块管道现在将其数字/表配置转换委托给共享的 common-utils 实现，因此公式图块以与 Web 相同的操作数隐藏行为进行渲染。
- 3ecf73c2：在组合的多系列指标查询中渲染指标公式（构建器图表配置上的“公式”）。像“A / (A + B + C) * 100”这样的字母引用表达式会编译成在转置的每系列列上的最终 SELECT 投影，并具有比率一致的缺失数据语义：缺失的操作数计为 0，而零或缺失的除法分母会产生 NULL（呈现的间隙）。 `showOperandSeries: false` 仅发出公式列。适用于分组和未分组的折线图、表格和数字图表以及带有公式的单系列图表，现在可通过组合查询路径进行路由。
- 3ecf73c2：“转换为 SQL”现在支持多系列、比率和公式指标图表。组合的 UNION ALL + 枢轴查询作为基于宏的原始 SQL 模板发出，每个系列分支带有一个 `$__sourceTable(&lt;metricType&gt;)` 宏，而不是返回“无法自动转换”错误。非时间序列指标图表仍然不受支持，与现有的单系列限制相匹配。

### 补丁更改



- c349a5dd：多系列指标图表上的 HAVING、ORDER BY 和 LIMIT 现在适用于最终连接结果，而不是泄漏到每个系列分支中。它们引用图表的输出列——操作数别名、公式名称/别名、比率列、分组依据列和时间段——因此像“错误率> 0.5”这样的 HAVING 会过滤连接的行，ORDER BY 实际上对结果进行排序（以前它是按分支应用的，然后被连接丢弃），LIMIT/OFFSET 对所有系列中的一个一致的组集进行分页。
- 68d2ed20：壮举：支持因变量值查询
- 2eedfb26：壮举：替换图表生成器图块中的仪表板变量
- 1ce61c0c：功能：扩展仪表板变量和嵌套在宏参数中的宏
- 43f68566：允许直接从警报详细信息页面编辑和删除警报。安
 “编辑警报”操作打开一个用于更改警报阈值的模式，
 评估间隔、时间表、分组依据（已保存搜索警报）、通知
 webhook、注释和删除操作（需要确认）会删除警报
 并返回警报列表。警报 API 响应现在包括
 通知通道的 webhook id 和警报的名称/消息模板
 编辑往返这些字段。
- 40ec0858：壮举：将仪表板变量属性添加到外部仪表板 API
- b0b13806：将警报触发/恢复图表标记与评估的数据对齐：标记现在绘制在最新评估存储桶的开头（匹配评估历史记录表和绘制的数据点），而不是在评估时间（位于右侧一个存储桶）。
- a94d6da8：修复过滤器侧边栏值在查询代理后面消失的问题。批量面值
 查询（KV汇总和地图文本索引查找）先前绑定一个查询
 每个键的参数；大约有 100 个键，这超出了 ClickHouse Web 客户端的 URL
 参数预算，默默地将请求提升到多部分/表单数据主体
 代理网关可以拒绝 - 每个 LowCardinality 列和映射属性
 然后过滤器消失，没有错误。键现在内联为 SQL 转义
 文字，因此查询使用具有常量参数计数的 POST 正文。还有
 修复了应用 KV 汇总时间过滤器的运算符优先级错误（以及
 notEmpty Guard）仅到最后一个 OR 分支。
- 8be68100：修复仪表板过滤器选择状态在复杂表达式上的破坏。的
 过滤器解析器（与搜索页面共享）现在跟踪括号深度
 除了报价深度之外，还为基于表达式的过滤器存储了选择，例如
 如 `if(SeverityText = '错误' OR SeverityText = '致命', '错误', '非错误')`
 或 `if(SeverityText IN ('error', 'fatal'), 'Errors', 'Non-errors')` 被解析
 正确地而不是在嵌套的运算符/关键字上被删除或分割
 的表达。
- c592207b：修复 MCP 工具架构被严格的 JSON 架构草案 2020-12 客户端拒绝的问题。 number-tile `colorRules` Between` 规则将其 `value` 声明为 Zod 元组，`zod-to-json-schema` 以 Draft-07 元组形式呈现 (`items: [ ... ]`)。 2020-12 草案要求“items”是架构而不是数组，因此“clickstack_save_dashboard”和“clickstack_patch_dashboard”验证失败 - 并且将 MCP 工具架构直接转发给 LLM 提供者（例如 Anthropic API）的客户端拒绝了整个工具列表，并显示“tools.N.custom.input_schema：JSON 架构无效”，从而使 MCP 服务器无法使用。 “value”现在是一个固定长度的数组，它进行相同的验证并序列化为相同的“[min, max]”有线格式。一项新测试根据 2020-12 元模式验证每个 MCP 工具的输入模式，因此不会出现倒退。
- 9c7742fa：修复混合浮点和整数聚合的多系列指标图表（例如直方图分位数 + 直方图计数）失败并显示“在结果列元数据中找不到值列”。组合的 UNION ALL 查询现在将每个系列值标准化为 Float64，因此合并的列类型是确定性的，而不是因 NO_COMMON_TYPE 出错或根据 ClickHouse 服务器的 `use_variant_as_common_type` 设置生成 Variant(Float64, Int64) 列。作为防御层，全数字“Variant(...)”结果列（例如来自原始 SQL 图表）现在也被分类为数字。
- 7294944a：修复：通过可注入记录器路由每个查询的 SQL 调试日志记录 (#2416)

 `BaseClickhouseClient` 在每个 ClickHouse 查询上将原始 SQL 转储到控制台，
 无条件地在 pino 记录器之外，用查询垃圾邮件淹没 API 日志。



 查询日志记录现在通过可选的每个客户端“customLogger”
 “ClickhouseClientOptions”，在“debug”处记录，并且在没有记录器时保持沉默
 通过了。该 API 注入了一个由 pino 支持的记录器，因此查询日志记录遵循
 现有的“HYPERDX_LOG_LEVEL”设置，而不是写入“console.debug”。的
 浏览器客户端默认使用控制台记录器，它将 SQL 漂亮地打印为
 单个多行块，因此查询 SQL 在 devtools 中保持可见和可读
 所有构建而不是包装成一长行。 

API 的日志级别现在默认为“info”（之前为“debug”），因此 SQL 日志记录为
 除非设置了“HYPERDX_LOG_LEVEL=debug”，否则在生产中保持沉默。开发和 CI 环境
 文件已经明确固定其级别并且不受影响。默认也
 现在当“HYPERDX_LOG_LEVEL”设置但为空时适用 - 这就是 Compose 的内容
 当变量在环境中未设置时通过，并且先前使
 pino 在启动时抛出。

- e153f46d: Number charts on metric formula configs always hide their operand series: `convertToNumberChartConfig` forces `showOperandSeries: false` when formulas are present, so the number tile renders the formula column rather than the first raw operand — regardless of the tile's "Show input series" setting on other display types or when a formula chart is switched to the Number display type.
- 9f640a61：在团队设置 → API 和代理中为个人 API 访问密钥添加轮换操作。以前，个人访问密钥（外部 API v2 和 MCP 服务器的不记名令牌）在创建帐户时生成一次，并且永远无法更改，因此泄漏的密钥只能通过删除用户来修复。轮换会立即撤销之前的密钥，因此 MCP/AI 代理配置、外部 API v2 客户端、Terraform/IaC 提供程序以及使用旧密钥的 CI 脚本必须使用新密钥进行更新。浏览器会话不受影响。
- ea127077: Apply the Map KV text-index rewrite (`Map['k'] = 'v'` → `has(ItemsCol, concat('k', '=', 'v'))`, enabling ClickHouse's direct-read optimization) to SQL predicates in the top-level `where` (search box, saved searches, alerts) and to SQL `aggCondition`s copied into the WHERE clause — previously仅重写了“sql”类型的“filters[]”条目

## @hyperdx/api@2.36.0

### 小改动

- 8723d7af: Alerts can be configured with multiple notification channels (up to 10 webhooks) via the new `channels` field on the v2 external API, internal API, and the MCP `clickstack_save_alert` tool.传统的单一“通道”字段仍然在输入中被接受并反映在响应中，因此现有集成保持不变。 

请注意，警报更新是完全替换，而不是合并。 A client that sends only the legacy `channel` field when updating an alert that has several channels will reduce it to that one channel — fetch the alert and resend the complete `channels` array to preserve them.



- a4b2ad00：API 现在从启动时无法访问的 MongoDB 恢复，并公开 Mongo 感知的就绪端点。以前，失败的初始连接从未重试：当每个 Mongo 支持的请求超时时，进程会继续监听，“/health”报告 200，并且 Kubernetes 无限期地保持 Pod 就绪 — 级联到 OpAMP 500 和崩溃循环收集器中。现在使用上限指数退避重试初始连接，直到成功为止，并且 API 和 OpAMP 服务器都公开“GET /ready”，除非连接 MongoDB，否则返回 503（将 Kubernetes 就绪探针指向它；“/health”仍然是纯粹的活动检查）。
- dc29d57f：现在每个保留或接受图表配置的 API 表面都支持图表公式。外部仪表板 API v2 和 MCP `save_dashboard` / `patch_dashboard` 工具接受 `formulas`（对图块的选择项进行字母引用算术，例如 `A / (A + B) * 100`）和在线、堆叠条形图、表格和数字构建器图块上的 `showOperandSeries`，通过 GET/PUT 往返它们，并验证写入时的表达式 - 未知系列引用，格式错误的语法、将公式与“asRatio”组合、数字图块上的多个公式以及无法使用公式的源类型（度量、对数或跟踪以外的任何内容）上的公式都将被拒绝，并出现可操作的错误。 MCP“query_tile”计算指标和日志/跟踪事件图块的公式列，查询指南提示记录了该功能，OpenAPI 规范包括新的“Formula”架构。 CLI 的仪表板图块管道现在将其数字/表配置转换委托给共享的 common-utils 实现，因此公式图块以与 Web 相同的操作数隐藏行为进行渲染。

### 补丁更改

- d205a776：允许配置 ClickHouse 导出器请求超时
 OpAMP 管理的收集器和独立收集器中的“HYPERDX_OTEL_EXPORTER_TIMEOUT”
 模式。默认保留 5 秒。
- 90da4097：在检查警报工作人员中禁用 mongoose autoIndex 以防止 MongoExpiredSessionError
- 43f68566：允许直接从警报详细信息页面编辑和删除警报。安
 “编辑警报”操作打开一个用于更改警报阈值的模式，
 评估间隔、时间表、分组依据（已保存搜索警报）、通知
 webhook、注释和删除操作（需要确认）会删除警报
 并返回警报列表。警报 API 响应现在包括
 通知通道的 webhook id 和警报的名称/消息模板
 编辑往返这些字段。
- 40ec0858：壮举：将仪表板变量属性添加到外部仪表板 API
- b0b13806：将警报触发/恢复图表标记与评估的数据对齐：标记现在绘制在最新评估存储桶的开头（匹配评估历史记录表和绘制的数据点），而不是在评估时间（位于右侧一个存储桶）。
- c592207b：修复 MCP 工具架构被严格的 JSON 架构草案 2020-12 客户端拒绝的问题。 number-tile `colorRules` Between` 规则将其 `value` 声明为 Zod 元组，`zod-to-json-schema` 以 Draft-07 元组形式呈现 (`items: [ ... ]`)。 2020-12 草案要求“items”是架构而不是数组，因此“clickstack_save_dashboard”和“clickstack_patch_dashboard”验证失败 - 并且将 MCP 工具架构直接转发给 LLM 提供者（例如 Anthropic API）的客户端拒绝了整个工具列表，并显示“tools.N.custom.input_schema：JSON 架构无效”，从而使 MCP 服务器无法使用。 “value”现在是一个固定长度的数组，它进行相同的验证并序列化为相同的“[min, max]”有线格式。一项新测试根据 2020-12 元模式验证每个 MCP 工具的输入模式，因此不会出现倒退。
- e153f46d：带有公式的指标图表上的平铺警报现在评估公式值，而不是最后一个原始操作数系列：警报任务之前在重建平铺图表配置时删除了“公式”/“showOperandSeries”，因此公式平铺上的警报将阈值与原始操作数（例如字节）而不是派生值进行比较。分组比率图块警报现在也支持“ratioMode”（“share_of_total”之前评估为“per_group”）。
- 7294944a：修复：通过可注入记录器路由每个查询的 SQL 调试日志记录 (#2416)

 `BaseClickhouseClient` 在每个 ClickHouse 查询上将原始 SQL 转储到控制台，
 无条件地在 pino 记录器之外，用查询垃圾邮件淹没 API 日志。



 查询日志记录现在通过可选的每个客户端“customLogger”
 “ClickhouseClientOptions”，在“debug”处记录，并且在没有记录器时保持沉默
 通过了。该 API 注入了一个由 pino 支持的记录器，因此查询日志记录遵循
 现有的“HYPERDX_LOG_LEVEL”设置，而不是写入“console.debug”。的
 浏览器客户端默认使用控制台记录器，它将 SQL 漂亮地打印为
 单个多行块，因此查询 SQL 在 devtools 中保持可见和可读
 所有构建而不是包装成一长行。 

API 的日志级别现在默认为“info”（之前为“debug”），因此 SQL 日志记录为
 除非设置了“HYPERDX_LOG_LEVEL=debug”，否则在生产中保持沉默。开发和 CI 环境
 文件已经明确固定其级别并且不受影响。默认也
 现在当“HYPERDX_LOG_LEVEL”设置但为空时适用 - 这就是 Compose 的内容
 当变量在环境中未设置时通过，并且先前使
 pino 在启动时抛出。

- e60a7d30：修复：在失败的 MCP 工具调用上填充范围 StatusMessage，以便错误文本在跟踪中可见
- 9f640a61：在团队设置 → API 和代理中为个人 API 访问密钥添加轮换操作。以前，个人访问密钥（外部 API v2 和 MCP 服务器的不记名令牌）在创建帐户时生成一次，并且永远无法更改，因此泄漏的密钥只能通过删除用户来修复。轮换会立即撤销之前的密钥，因此 MCP/AI 代理配置、外部 API v2 客户端、Terraform/IaC 提供程序以及使用旧密钥的 CI 脚本必须使用新密钥进行更新。浏览器会话不受影响。
- 08e5b62f：停止外部仪表板 API 返回聚合无法携带的聚合参数：分位数聚合留下的“level”，或计数留下的“valueExpression”。渲染时两者都会被忽略，但输入模式会拒绝它们，因此无法将 GET 主体放回，并且将仪表板导入 Terraform 失败，并显示“Level can only be used with quantile Aggregation function”。
- 更新了依赖项 [be26530f]
- 更新了依赖项 [c349a5dd]
- 更新了依赖项 [68d2ed20]
- 更新了依赖项 [2eedfb26]
- 更新了依赖项 [1ce61c0c]
- 更新了依赖项 [43f68566]
- 更新了依赖项 [b1d8dc14]
- 更新了依赖项 [40ec0858]
- 更新了依赖项 [b0b13806]
- 更新了依赖项 [a94d6da8]
- 更新了依赖项 [8be68100]
- 更新了依赖项 [c592207b]
- 更新了依赖项 [9c7742fa]
- 更新了依赖项 [dc29d57f]
- 更新了依赖项 [7294944a]
- 更新了依赖项 [3ecf73c2]
- 更新了依赖项 [3ecf73c2]
- 更新了依赖项 [e153f46d]
- 更新了依赖项 [9f640a61]
- 更新了依赖项 [ea127077]
 - @hyperdx/common-utils@0.27.0

