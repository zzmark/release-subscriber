## @hyperdx/app@2.44.0

### 次版本变更

- 142c9cc87: 功能：用条件缩小仪表板临时筛选器的建议范围

  SQL 数据源的临时筛选器现在可设置 SQL 或 Lucene「键和值筛选器」，类似查询型筛选器的下拉值筛选器，用于限制生成键和值建议所依据的数据行。它可以引用仪表板的其他变量。如果它引用了尚未选值的必填筛选器，就无法添加或编辑条件，并会指出正在等待哪个筛选器。获取建议失败时，现在会显示数据库的错误消息。

- cd0e9edfa: 功能：新增可选的 `titleEmoji` webhook 设置。设为 `false` 可移除通过该 webhook 发送的通知标题中的表情符号前缀。
- 5b0d07441: 功能：使用 `@clickhouse/clickstack-node` 和 `@clickhouse/clickstack-browser` 进行自监控埋点，替换 `@hyperdx/node-opentelemetry` 和 `@hyperdx/browser`

  HyperDX 自身遥测数据的结构发生变化。HTTP span 使用稳定的语义约定键（`http.request.method`、`http.response.status_code`、`url.full`）。pino 日志记录来自 `@opentelemetry/instrumentation-pino` 作用域，并带有实际的严重级别数值。此前它们来自 `node-logger` 作用域，严重级别数值为 0。控制台采集覆盖 API 中的每次 `console` 调用，浏览器控制台输出改为记录为日志，不再生成 span。未捕获的异常记录为 FATAL 日志，API 错误记录为 Express span 上的异常事件，不再生成独立的错误 span。

  浏览器遥测使用 `user.id`、`user.email` 和 `user.name` 记录用户信息，替换 `userEmail` 和 `userName`，团队名称仍使用 `teamName`，并停止记录 `user navigated` 操作。浏览器的 fetch 和 XHR span 不再记录请求或响应的标头及正文。升级后浏览器会话会重启一次。浏览器按信号类型划分的端点和 `NEXT_PUBLIC_OTEL_RESOURCE_ATTRIBUTES` 的行为保持不变。浏览器每 5 秒发送一次 gzip 压缩的链路和日志。如果浏览器发送到 ClickStack 以外的采集器，该采集器的 CORS `allowed_headers` 必须为 `"*"`，或包含 `content-type` 和 `content-encoding`（以及 `authorization`）。采集器前的代理必须原样转发 `Content-Encoding`。

  设置 `HYPERDX_API_KEY` 或 `OTEL_EXPORTER_OTLP_HEADERS` 后，Next.js 服务端在生产构建中也会发送自身遥测数据，此前仅在 `next dev` 下发送。`HDX_EXPORTER_ENABLED=false` 会同时关闭这部分遥测和浏览器遥测。Next.js 使用独立的服务名，即在配置的名称后加上 `-next`（在 docker-compose 的 `app` 服务中以及未设置名称时为 `hdx-oss-app-next`），以区分它与 API 和浏览器的 span。HyperDX 镜像现在将 `OTEL_SERVICE_NAME` 默认设为 `hdx-oss-app`。每个 `/api` 请求都会为代理转发这一跳添加 Next.js 服务端 span。构建产物和 `public/` 资源的请求不生成链路，例如 `/_next/static/*`、`/__ENV.js` 和 `/pyodide/*`。

  `HYPERDX_API_KEY` 仍可启用自监控埋点。未设置 `OTEL_EXPORTER_OTLP_ENDPOINT` 时，服务端自身的遥测数据现在发送至 `http://localhost:4318`，原默认地址为 `https://in-otel.hyperdx.io`，因此请显式设置端点。系统不再读取 `HDX_NODE_*` 变量。如需采集请求标头及正文，请设置 `OTEL_INSTRUMENTATION_HTTP_CAPTURE_HEADERS_*` 和 `CLICKSTACK_CAPTURE_HTTP_BODY`。

- 0b7926d1d: 功能：团队成员可以创建归团队所有的 API 密钥，并设置说明和到期时间。创建者离开团队后，密钥仍可使用。
- af17e8ff8: 应用统一使用 ClickStack 品牌。移除品牌选择、HyperDX 配色和字体选择器。偏好设置仍保留浅色、深色和跟随系统三种配色模式。
- dd8c2e4b6: 功能：可在时间选择器中为搜索和仪表板页面选择时区，覆盖用户偏好设置中的时区。选择器会显示当前使用的时区，URL 以及图表和表格生成的链接也会保留该选项。

### 补丁变更

- 7de661b6a: 功能：行详情侧栏汇总 OpenTelemetry 浏览器 SDK 上报的点击、导航和控制台消息。导航记录不再显示 HTTP Request 区块。
- df737d8aa: 重构：图表显示、热力图、数字格式和点击操作抽屉，以及仪表板临时筛选器和查询表达式筛选器表单，改用 click-ui 的 `Separator` 组件替代 Mantine 的 `Divider`。
- 4b8df6d8a: 修复：图表加载时显示中性色的旋转指示器

  查询进行中时，图表卡片显示旋转指示器和「正在加载图表数据…」（Loading Chart Data...），即使上一次结果为空也是如此。此前，新查询完成前会一直显示「时间范围内未找到数据」（No data found within time range.）。加载指示器现在默认使用中性灰色，原来为黄色。

- ab36d4e13: 功能：HyperDX 镜像同时以 `clickhouse/clickstack` 和 `hyperdx/hyperdx` 发布，与其他 `clickhouse/clickstack-*` 镜像的命名一致。发布工作流不再登录未接收过镜像推送的 ghcr.io。
- f56d4ad5b: 修复（app）：在徽标、折叠的导航栏和网站图标中使用 ClickStack 的六边形闪电标记。
- d7df729e6: 维护：Changelog、支持入口和软件包元数据中的 GitHub 链接现指向 `ClickHouse/ClickStack`，`docker-compose.yml` 改为拉取 `clickhouse/clickstack` 作为应用镜像。
- f56d4ad5b: 修复（app）：窄视口下以浮层形式在页面上打开完整导航。此前点击侧栏开关没有反应。
- 513b23796: 修复：将侧栏中的链路瀑布图向上移

  span 名称不再重复显示在面板标题下方的框中。如果元数据行已显示服务名，旁边也不再重复显示服务标签。「⌘/Ctrl + 滚动缩放」提示移至时间线左上角，不再单独占一行。如果长 span 名称在标题中被截断，仍保留名称框。日志面板继续保留正文框和服务标签。

- 9269f7784: 修复：「结果降噪」（Denoise results）现在能在常见数据中滤除噪声。某模式在采样事件中的占比超过 5% 就会被视为噪声，此前的阈值为 10%，经常匹配不到任何模式。包含错误或警告行的模式始终可见。MCP 的 `denoise` 选项采用同一 5% 阈值。降噪还会改为从数据源的正文列挖掘模式，而非表格的最后一列，移除匹配噪声模式的 ANSI 着色行，提示无法降噪的情况，并以简短摘要和可展开的精简列表展示隐藏的模式。
- e2754d203: 修复：JSON 行查找的 WHERE 子句改用 SHA256 替代 MD5，使行详情和下钻在启用 FIPS 的 ClickHouse 部署中可用。
- 5abf27ed3: 保存搜索时不再重新加载页面。应用通过客户端导航打开新保存的搜索，同时修复了此操作在静态 ClickStack 构建中导致的 404。
- ba7d0066f: 修复：热力图悬浮提示不再引入滚动条或导致卡片位移。提示现在浮在图表上方。
- 04f55d12c: 功能：异常面板将 OpenTelemetry SDK 上报的 JavaScript 堆栈跟踪解析成栈帧，并为每个 `Caused by:` 错误单独分段。
- d0dd06fe8: 修复：在服务拓扑图和链路瀑布图中，将旧版 STATUS_CODE_ERROR span 计为错误。
- 7935c64bc: 功能：新增 `hdx mcp install`，连接 AI 代理时无需粘贴密钥

  `npx @hyperdx/cli mcp install` 通过隐藏输入请求个人访问密钥或组织 API 密钥，验证后把 ClickStack MCP 服务添加到 Claude Code、Codex、Cursor 和 VS Code。团队设置现在优先显示该命令，用户无需将密钥放入复制的命令或代理对话中。各代理的配置片段仍保留，可用于手动配置单个代理。

- 41b2b742a: 功能：如果表的 CREATE 查询未列出 `_block_number` 和 `_block_offset`，则回退到服务端 MergeTree 设置，检测这两个列是否已持久化。
- 442d6dfd9: 修复：5 分钟后刷新缓存的表列

  此前，共享元数据缓存会在整个进程生命周期内保留每张表的 `DESCRIBE` 结果，所以 API 在重启前看不到通过 `ALTER TABLE` 新增的列，例如新的 MATERIALIZED 列。现在列缓存 5 分钟后过期。其他元数据缓存行为不变。

- eb2439ed0: 修复：图表和告警跳过未记录值的指标点

  被采集的时间序列消失或采集失败时，采集器的 `prometheus` 接收器会发送一个标记为「未记录值」（no recorded value，即 Prometheus 的陈旧标记）的数据点，ClickHouse 导出器将它存为零。指标图表和告警会把零当作实际值，导致 gauge 的 `min` 和 `avg` 下降，`count` 仍计入已消失的序列，计数器或直方图在标记之后恢复时还会把其全部累计值再计一次。指标查询现在跳过带有该标记的数据点。

- 81b6b605e: 重构：键盘快捷键弹窗、更新内容抽屉、筛选设置浮层、指标浏览器、图表浏览器、时间选择器和服务拓扑图提示，改用 click-ui 的 `Separator` 组件替代 Mantine 的 `Divider`。
- 9df8b8d47: 修复：将 next 升级到 16.4.3，解决 Google Fonts 返回无扩展名的字体 URL 时偶发的构建失败。
- ec0db7ac9: 修复：从搜索页面创建告警只需输入一次名称。未保存的搜索在告警弹窗顶部命名，告警继承该名称及其标签。对于已保存的搜索，告警名称字段标为「告警名称」（Alert name），并将继承的名称显示为占位提示，不再重复预填。
- 467c16792: 功能：在搜索侧栏中折叠固定筛选器后，下次加载数据源时会保持折叠。
- 6468dadcf: 修复：将不同页面加载产生的会话回放事件分开

  `@clickhouse/clickstack-browser` 1.2.0 及更早版本的浏览器 SDK 每次加载页面都从 1 开始为回放事件编号。如果页面在某个大型事件的所有分块发完前关闭，残留分块可能与后续页面中编号相同的事件拼接。后续页面的快照因此解析失败，无法渲染。现在按事件编号和完整精度时间戳对分块分组，并按完整精度时间戳排序回放记录，同一秒内两次页面加载的记录不再交错。

  应用自身的浏览器遥测现在使用 `@clickhouse/clickstack-browser` 1.2.1，其回放事件编号在多次页面加载间不会重复。

- 86cd38b7e: 修复：仅当表持久化 `_block_number` 和 `_block_offset` 两列时，才只按键查找行详情。只有一个块相关列（例如通过全服务端的 `enable_block_offset_column` 提供的列）且主键时间精度为秒时，无法唯一确定行，可能打开错误的行。现在该列只用于在整行查找中区分其他条件相同的记录。
- 82b2104bb: 修复：加载行详情时显示加载指示器

  搜索中展开的行和链路查看器的 span 详情此前会在加载期间显示「空」（Empty）或「此事件没有正文」（No body for this event.）。现在会显示加载指示器，直到获取行数据。

- 3a412e4f8: 修复：打开行时只执行一次行详情查询

  侧栏以前会执行两次相同的 `SELECT *` 行查询，分别在打开面板和挂载概览或列值选项卡时执行。现在，查到的行会从缓存复用，选项卡首次加载和后续切换都无需再次查询。切换到其他行或数据源时仍会查询，未找到的行也会重新查询。

- 78143c81a: 功能：在 ClickHouse Cloud 上检测 `_block_number` 和 `_block_offset` 列时，读取 `system.shared_merge_tree_settings`，缺失的设置按键回退到 `system.merge_tree_settings`。
- 4e93ae500: 修复（app）：在展开的侧栏中以文本显示 ClickStack 名称，与徽标图形相距 8px。
- 38f58cff2: 重构：数据源表单和数据源列表改用 click-ui 的 `Separator` 组件替代 Mantine 的 `Divider`。
- 2bad9af17: 重构：团队设置各区块改用 click-ui 的 `Separator` 组件替代 Mantine 的 `Divider`。
- af75b2b59: 功能：链路瀑布图用圆点在 fetch 和 XHR span 上标示 OpenTelemetry 浏览器 SDK 记录的请求时序，并显示触发浏览器链路的点击操作。
- 4e93ae500: 修复（app）：浏览器标签页、书签和触摸图标使用新的图标集，其中包括 SVG 图标。
- dc58efde2: 修复：浏览器报告 `en-US@posix` 等 POSIX 风格的语言设置时，应用不再在加载时崩溃。
- 更新依赖 [142c9cc87]
- 更新依赖 [30b1494d8]
- 更新依赖 [0453aa134]
- 更新依赖 [cd0e9edfa]
- 更新依赖 [5b0d07441]
- 更新依赖 [5b0d07441]
- 更新依赖 [769c0def3]
- 更新依赖 [9269f7784]
- 更新依赖 [48c83790a]
- 更新依赖 [e2754d203]
- 更新依赖 [22f824c6e]
- 更新依赖 [642533255]
- 更新依赖 [d0dd06fe8]
- 更新依赖 [349fc2141]
- 更新依赖 [631002374]
- 更新依赖 [5584f84bb]
- 更新依赖 [253a690d4]
- 更新依赖 [66e394136]
- 更新依赖 [7e8522914]
- 更新依赖 [9093282e5]
- 更新依赖 [53bf54096]
- 更新依赖 [0eec5e140]
- 更新依赖 [917c9ca49]
- 更新依赖 [95fa36412]
- 更新依赖 [d08b2fa73]
- 更新依赖 [a13c80efe]
- 更新依赖 [0262822da]
- 更新依赖 [41b2b742a]
- 更新依赖 [442d6dfd9]
- 更新依赖 [eb2439ed0]
- 更新依赖 [0b7926d1d]
- 更新依赖 [0eec5e140]
- 更新依赖 [0a5237e6c]
- 更新依赖 [78143c81a]
- 更新依赖 [b7b4d9579]
- 更新依赖 [b1d4e60f8]
- 更新依赖 [ef56bd726]
- 更新依赖 [c792850fd]
- 更新依赖 [90302c773]
  - @hyperdx/common-utils@0.34.0
  - @hyperdx/api@2.44.0

## @hyperdx/otel-collector@2.44.0

### 补丁变更

- 5b0d07441: 修复：允许浏览器将采集器的 CORS 预检结果缓存 10 分钟

  OTLP 接收器现在以 `Access-Control-Max-Age: 600` 响应预检。此前浏览器只缓存预检结果 5 秒，与浏览器 SDK 的导出间隔相同，因此约一半请求是预检请求。

- 8384fe675: 性能：初始建表结构改用 `ZSTD(3)` 压缩，替换 `ZSTD(1)`

  初始建表结构此前几乎每列都显式使用 `ZSTD(1)`。级别 3 的压缩率更高，仅略微增加插入时的 CPU 开销，不影响读取。ClickHouse 从 26.9 起默认使用此编解码器。显式指定该设置可让默认使用 `LZ4` 的旧版本也采用它。`Delta` 编解码器不再显式指定字节数，由 ClickHouse 根据列类型推断。仅新建表受影响，现有表继续使用原有编解码器。

- 702181002: 功能：新增会话 ID 列，从 `rum.sessionId` 生成 `session.id`，并补齐严重级别文本

  `hyperdx_sessions` 的初始建表结构新增带跳数索引的物化列 `rum.sessionId` 和 `session.id`，`otel_logs` 的初始建表结构也新增带跳数索引的物化列 `session.id`，因此会话查询不必读取属性映射。只有新建表会自动获得这些列。现有表需要执行 `ALTER TABLE ... ADD COLUMN` 才能受益。

  旧版 `@hyperdx/browser` SDK 的 span、日志和会话回放事件只在资源属性 `rum.sessionId` 中携带会话 ID，现在也会补上 OpenTelemetry 的 `session.id` 属性。已有 `session.id` 不会被覆盖，`rum.sessionId` 也会保留。如果在 `CUSTOM_OTELCOL_CONFIG_FILE` 中覆盖了流水线的 `processors:` 列表，请加入 `transform/session_id` 以保留这一行为。

  只有严重级别数值、缺少严重级别文本的日志（例如新版浏览器 SDK 产生的日志），现在会补上对应的级别文本（`info`、`error` 等），级别不再为空。生产端已设置的严重级别文本不会被覆盖。

## @hyperdx/common-utils@0.34.0

### 次版本变更

- 142c9cc87: 功能：用条件缩小仪表板临时筛选器的建议范围

  SQL 数据源的临时筛选器现在可设置 SQL 或 Lucene「键和值筛选器」，类似查询型筛选器的下拉值筛选器，用于限制生成键和值建议所依据的数据行。它可以引用仪表板的其他变量。如果它引用了尚未选值的必填筛选器，就无法添加或编辑条件，并会指出正在等待哪个筛选器。获取建议失败时，现在会显示数据库的错误消息。

- cd0e9edfa: 功能：新增可选的 `titleEmoji` webhook 设置。设为 `false` 可移除通过该 webhook 发送的通知标题中的表情符号前缀。
- 0b7926d1d: 功能：团队成员可以创建归团队所有的 API 密钥，并设置说明和到期时间。创建者离开团队后，密钥仍可使用。

### 补丁变更

- 9269f7784: 修复：「结果降噪」（Denoise results）现在能在常见数据中滤除噪声。某模式在采样事件中的占比超过 5% 就会被视为噪声，此前的阈值为 10%，经常匹配不到任何模式。包含错误或警告行的模式始终可见。MCP 的 `denoise` 选项采用同一 5% 阈值。降噪还会改为从数据源的正文列挖掘模式，而非表格的最后一列，移除匹配噪声模式的 ANSI 着色行，提示无法降噪的情况，并以简短摘要和可展开的精简列表展示隐藏的模式。
- e2754d203: 修复：JSON 行查找的 WHERE 子句改用 SHA256 替代 MD5，使行详情和下钻在启用 FIPS 的 ClickHouse 部署中可用。
- 22f824c6e: 修复：查找行详情时，JSON 路径中含特殊字符的片段继续保留引号。
- 642533255: 性能：当每个选择器都指定了指标名称时，带 `match[]` 的 PromQL 标签查询只读取匹配指标的标签记录。
- d0dd06fe8: 修复：在服务拓扑图和链路瀑布图中，将旧版 STATUS_CODE_ERROR span 计为错误。
- 5584f84bb: 修复：使 clickstack_event_patterns 的下钻片段可直接执行

  每个模式的 `whereSnippet` 现在是 SQL 谓词（`whereLanguage: "sql"`），保留模板的词元顺序和变量位置，并包含调用者的筛选条件及数据源的表筛选条件。将它传给 `clickstack_search` 即可查到该模式对应的事件。此前，`Sending <*> rows` 这类模板会产生无法匹配任何结果的 `Body:"Sending rows"`，映射字段则会生成无法解析的 Lucene 表达式。`bodyExpression` 现在还接受 `JSONExtractString(<column>, '<key>', ...)`，用于从 JSON 正文内部字段挖掘模式。工具还会报告样本覆盖情况，以及趋势分桶实际采用的间隔和边界。

  `clickstack_event_patterns`、`clickstack_emerging_signals` 和仪表板的事件模式卡片现在会应用日志数据源的 `tableFilterExpression`，因此配置了该条件的数据源的计数可能下降。`minePatterns` 现在返回每个聚类自己的模板。此前，它可能返回另一个长度相同的聚类的模板，导致部分成员与模板不匹配。

- 41b2b742a: 功能：如果表的 CREATE 查询未列出 `_block_number` 和 `_block_offset`，则回退到服务端 MergeTree 设置，检测这两个列是否已持久化。
- 442d6dfd9: 修复：5 分钟后刷新缓存的表列

  此前，共享元数据缓存会在整个进程生命周期内保留每张表的 `DESCRIBE` 结果，所以 API 在重启前看不到通过 `ALTER TABLE` 新增的列，例如新的 MATERIALIZED 列。现在列缓存 5 分钟后过期。其他元数据缓存行为不变。

- eb2439ed0: 修复：图表和告警跳过未记录值的指标点

  被采集的时间序列消失或采集失败时，采集器的 `prometheus` 接收器会发送一个标记为「未记录值」（no recorded value，即 Prometheus 的陈旧标记）的数据点，ClickHouse 导出器将它存为零。指标图表和告警会把零当作实际值，导致 gauge 的 `min` 和 `avg` 下降，`count` 仍计入已消失的序列，计数器或直方图在标记之后恢复时还会把其全部累计值再计一次。指标查询现在跳过带有该标记的数据点。

- 0a5237e6c: 修复：拒绝在告警检查器从不评估的仪表板卡片上设置告警，包括 PromQL 卡片和显示类型不受支持的构建器卡片，并在保存仪表板时移除这类告警。
- 78143c81a: 功能：在 ClickHouse Cloud 上检测 `_block_number` 和 `_block_offset` 列时，读取 `system.shared_merge_tree_settings`，缺失的设置按键回退到 `system.merge_tree_settings`。
- b1d4e60f8: 修复：PromQL 标签查询（仪表板变量、标签自动补全）现已支持架构版本 8 的 TimeSeries 表，此架构自 ClickHouse 26.10 起为默认值。该架构将每条时间序列的时间范围保存在独立的时间范围表中，替代标签表的 min_time/max_time。此前 match[] 会报错「requires store_min_time_and_max_time = 1」，而带时间范围的查询会读取整张标签表。

## @hyperdx/api@2.44.0

### 次版本变更

- cd0e9edfa: 功能：新增可选的 `titleEmoji` webhook 设置。设为 `false` 可移除通过该 webhook 发送的通知标题中的表情符号前缀。
- 5b0d07441: 功能：使用 `@clickhouse/clickstack-node` 和 `@clickhouse/clickstack-browser` 进行自监控埋点，替换 `@hyperdx/node-opentelemetry` 和 `@hyperdx/browser`

  HyperDX 自身遥测数据的结构发生变化。HTTP span 使用稳定的语义约定键（`http.request.method`、`http.response.status_code`、`url.full`）。pino 日志记录来自 `@opentelemetry/instrumentation-pino` 作用域，并带有实际的严重级别数值。此前它们来自 `node-logger` 作用域，严重级别数值为 0。控制台采集覆盖 API 中的每次 `console` 调用，浏览器控制台输出改为记录为日志，不再生成 span。未捕获的异常记录为 FATAL 日志，API 错误记录为 Express span 上的异常事件，不再生成独立的错误 span。

  浏览器遥测使用 `user.id`、`user.email` 和 `user.name` 记录用户信息，替换 `userEmail` 和 `userName`，团队名称仍使用 `teamName`，并停止记录 `user navigated` 操作。浏览器的 fetch 和 XHR span 不再记录请求或响应的标头及正文。升级后浏览器会话会重启一次。浏览器按信号类型划分的端点和 `NEXT_PUBLIC_OTEL_RESOURCE_ATTRIBUTES` 的行为保持不变。浏览器每 5 秒发送一次 gzip 压缩的链路和日志。如果浏览器发送到 ClickStack 以外的采集器，该采集器的 CORS `allowed_headers` 必须为 `"*"`，或包含 `content-type` 和 `content-encoding`（以及 `authorization`）。采集器前的代理必须原样转发 `Content-Encoding`。

  设置 `HYPERDX_API_KEY` 或 `OTEL_EXPORTER_OTLP_HEADERS` 后，Next.js 服务端在生产构建中也会发送自身遥测数据，此前仅在 `next dev` 下发送。`HDX_EXPORTER_ENABLED=false` 会同时关闭这部分遥测和浏览器遥测。Next.js 使用独立的服务名，即在配置的名称后加上 `-next`（在 docker-compose 的 `app` 服务中以及未设置名称时为 `hdx-oss-app-next`），以区分它与 API 和浏览器的 span。HyperDX 镜像现在将 `OTEL_SERVICE_NAME` 默认设为 `hdx-oss-app`。每个 `/api` 请求都会为代理转发这一跳添加 Next.js 服务端 span。构建产物和 `public/` 资源的请求不生成链路，例如 `/_next/static/*`、`/__ENV.js` 和 `/pyodide/*`。

  `HYPERDX_API_KEY` 仍可启用自监控埋点。未设置 `OTEL_EXPORTER_OTLP_ENDPOINT` 时，服务端自身的遥测数据现在发送至 `http://localhost:4318`，原默认地址为 `https://in-otel.hyperdx.io`，因此请显式设置端点。系统不再读取 `HDX_NODE_*` 变量。如需采集请求标头及正文，请设置 `OTEL_INSTRUMENTATION_HTTP_CAPTURE_HEADERS_*` 和 `CLICKSTACK_CAPTURE_HTTP_BODY`。

- 349fc2141: 功能（MCP）：新增 `clickstack_describe_table`，可列出数据库中的表，并描述尚未注册为数据源的表，包括列、键、引擎、跳数索引、近似大小和可选的行样本。
- 0eec5e140: 功能：在 MCP 中描述 PromQL 数据源，并在停用 PromQL 时隐藏这些数据源

  `clickstack_describe_source` 现在会返回 PromQL 数据源的标签名和指标名，来源可以是 ClickHouse TimeSeries 表或兼容 Prometheus 的端点。此前返回的是列结构。`clickstack_list_sources` 和 `clickstack_describe_source` 会显示 PromQL 数据源使用的后端，对于 TimeSeries 表还会说明如何用 `clickstack_sql` 读取。Prometheus 端点数据源不再显示占位表。关闭 `ENABLE_PROMQL` 时，MCP 会在列出、描述和删除操作中隐藏 PromQL 数据源，`clickstack_save_source` 也不再接受 `kind: "promql"`。

- 95fa36412: 功能（MCP）：支持通过 MCP 仪表板工具设置仪表板的 `savedFilterValues`。
- 0b7926d1d: 功能：团队成员可以创建归团队所有的 API 密钥，并设置说明和到期时间。创建者离开团队后，密钥仍可使用。
- c792850fd: 功能：v2 告警列表端点支持按标签、搜索条件、数据源和状态筛选。

### 补丁变更

- 30b1494d8: 功能：为告警检测策略添加内部扩展点。阈值告警的评估方式保持不变，`alerts.evaluate` 指标现在携带 `alert_evaluator` 属性。
- 0453aa134: 修复：分组告警的某个组从数据中消失时，告警恢复通知中的 `{{attributes.*}}`（告警标题及消息）和 `{{var.*}}`（webhook 正文）现在会填入该组的值。
- 5b0d07441: 修复：允许浏览器将采集器的 CORS 预检结果缓存 10 分钟

  OTLP 接收器现在以 `Access-Control-Max-Age: 600` 响应预检。此前浏览器只缓存预检结果 5 秒，与浏览器 SDK 的导出间隔相同，因此约一半请求是预检请求。

- 769c0def3: 修复：忽略仪表板和已保存搜索的 PATCH 请求正文中的 `team` 和 `createdBy`，防止将它们移到其他团队或改写所有者。
- 9269f7784: 修复：「结果降噪」（Denoise results）现在能在常见数据中滤除噪声。某模式在采样事件中的占比超过 5% 就会被视为噪声，此前的阈值为 10%，经常匹配不到任何模式。包含错误或警告行的模式始终可见。MCP 的 `denoise` 选项采用同一 5% 阈值。降噪还会改为从数据源的正文列挖掘模式，而非表格的最后一列，移除匹配噪声模式的 ANSI 着色行，提示无法降噪的情况，并以简短摘要和可展开的精简列表展示隐藏的模式。
- 48c83790a: 文档：为外部 API 的指标及 PromQL 数据源补充 `minAutoGranularity` 字段说明

  `GET`、`POST` 和 `PUT /api/v2/sources` 原已接受并返回 `minAutoGranularity`，但 OpenAPI 规范漏掉了该字段，导致按规范生成的客户端丢弃或拒绝它。

- 642533255: 性能：当每个选择器都指定了指标名称时，带 `match[]` 的 PromQL 标签查询只读取匹配指标的标签记录。
- 631002374: 修复：为 MCP 工具结构中 `clickstack_save_source` 的 `highlightedRowAttributeExpressions` 参数定义具体类型，此前它显示为无类型的 `$ref`。同时为所有 MCP 工具设置 `annotations.title`。
- 5584f84bb: 修复：使 clickstack_event_patterns 的下钻片段可直接执行

  每个模式的 `whereSnippet` 现在是 SQL 谓词（`whereLanguage: "sql"`），保留模板的词元顺序和变量位置，并包含调用者的筛选条件及数据源的表筛选条件。将它传给 `clickstack_search` 即可查到该模式对应的事件。此前，`Sending <*> rows` 这类模板会产生无法匹配任何结果的 `Body:"Sending rows"`，映射字段则会生成无法解析的 Lucene 表达式。`bodyExpression` 现在还接受 `JSONExtractString(<column>, '<key>', ...)`，用于从 JSON 正文内部字段挖掘模式。工具还会报告样本覆盖情况，以及趋势分桶实际采用的间隔和边界。

  `clickstack_event_patterns`、`clickstack_emerging_signals` 和仪表板的事件模式卡片现在会应用日志数据源的 `tableFilterExpression`，因此配置了该条件的数据源的计数可能下降。`minePatterns` 现在返回每个聚类自己的模板。此前，它可能返回另一个长度相同的聚类的模板，导致部分成员与模板不匹配。

- 253a690d4: 文档：MCP 工具说明和查询指南现在建议使用带引号的 Lucene 形式 `field:"value"` 进行精确匹配，日志正文则使用不带字段名的词语或短语，让代理保留对主键和文本索引的使用。
- 66e394136: 功能：MCP 的 `query_tile` 和 `query_tiles` 可对 Prometheus 端点和 ClickHouse TimeSeries 表查询 PromQL 卡片。
- 7e8522914: 功能：新增 MCP 工具 `clickstack_promql`，可对 PromQL 数据源执行查询。启用 PromQL 时，MCP 的提示词和说明会涵盖 PromQL 数据源、卡片及标签筛选器。
- 9093282e5: 修复：MCP 的 PromQL 标签查找和查询拒绝超过 8 MB 的 Prometheus 端点响应，避免缓冲整个响应。
- 53bf54096: 修复：MCP `query_tile` 以仪表板实际绘制的数据行格式返回 PromQL 表格和直方图热力图卡片。
- 917c9ca49: 功能：启用 PromQL 时，MCP 仪表板工具可读写 PromQL 卡片和 PROMETHEUS_LABEL 筛选器。关闭 PromQL 时，工具隐藏但保留这些配置。
- d08b2fa73: 功能（MCP）：`clickstack_sql` 接受 `queries` 数组，可在共享的 60 秒截止时间内并行执行最多 10 条独立查询。每条查询分别报告 `ok`、`error` 或 `timeout`，一条查询失败不会导致其他查询失败。用 `sql` 发起单条查询的行为保持不变。
- a13c80efe: 功能（MCP）：`clickstack_table` 接受可选的 `limit` 和 `having`。未提供 `orderBy` 时，分组结果按第一项 SELECT 表达式降序排列。
- 0262822da: 修复：MCP 工具响应超出大小预算时，现在会缩短长字符串并附加 `…(+N chars)` 后缀，并在 `trimNotes` 中说明裁剪内容。`clickstack_event_patterns` 和 `clickstack_emerging_signals` 会先丢弃样本并缩短长模式，再考虑删除整个模式，从而尽可能保留请求的 `topN`。
- 442d6dfd9: 修复：5 分钟后刷新缓存的表列

  此前，共享元数据缓存会在整个进程生命周期内保留每张表的 `DESCRIBE` 结果，所以 API 在重启前看不到通过 `ALTER TABLE` 新增的列，例如新的 MATERIALIZED 列。现在列缓存 5 分钟后过期。其他元数据缓存行为不变。

- eb2439ed0: 修复：图表和告警跳过未记录值的指标点

  被采集的时间序列消失或采集失败时，采集器的 `prometheus` 接收器会发送一个标记为「未记录值」（no recorded value，即 Prometheus 的陈旧标记）的数据点，ClickHouse 导出器将它存为零。指标图表和告警会把零当作实际值，导致 gauge 的 `min` 和 `avg` 下降，`count` 仍计入已消失的序列，计数器或直方图在标记之后恢复时还会把其全部累计值再计一次。指标查询现在跳过带有该标记的数据点。

- 0eec5e140: 修复：支持对主机地址中含凭据的 Prometheus 连接进行认证

  Prometheus 的连接主机地址如 `http://user:pass@prometheus:9090`，此前会导致每次 PromQL 查询都报错「Failed to reach Prometheus」，因为 `fetch` 拒绝带凭据的 URL。现在会通过 Basic 认证标头发送凭据。

- 0a5237e6c: 修复：拒绝在告警检查器从不评估的仪表板卡片上设置告警，包括 PromQL 卡片和显示类型不受支持的构建器卡片，并在保存仪表板时移除这类告警。
- b7b4d9579: 修复：将 systeminformation 更新到 5.33.19

  根目录的 `resolutions` 固定设置使锁文件保留了 systeminformation 5.30.7。该版本存在已知的命令注入问题，包括 Linux 上 `networkInterfaces()` 中的两个高严重级别漏洞（GHSA-5xpp-75jx-m839、GHSA-hvx9-hwr7-wjj9）。API 通过 `@opentelemetry/instrumentation-host-metrics` 安装该依赖，后者要求 `^5.31.6`，但旧的固定设置将版本锁在 5.30.7。现在固定范围从最新的 5.x 版本 5.33.19 开始，该版本修复了上述问题。

- b1d4e60f8: 修复：PromQL 标签查询（仪表板变量、标签自动补全）现已支持架构版本 8 的 TimeSeries 表，此架构自 ClickHouse 26.10 起为默认值。该架构将每条时间序列的时间范围保存在独立的时间范围表中，替代标签表的 min_time/max_time。此前 match[] 会报错「requires store_min_time_and_max_time = 1」，而带时间范围的查询会读取整张标签表。
- ef56bd726: 修复：通过受密码保护的连接访问 ClickHouse 时，用量统计作业不再出现认证失败。
- 90302c773: 修复：拦截主机名解析为私有地址或保留地址的通用及 incident.io webhook。检查针对实际连接的地址执行，因此也能防止 DNS 重绑定。向内部主机名发送 webhook 的自托管部署必须将这些主机名加入 `WEBHOOK_HOSTNAME_ALLOWLIST`。
- 更新依赖 [142c9cc87]
- 更新依赖 [cd0e9edfa]
- 更新依赖 [9269f7784]
- 更新依赖 [e2754d203]
- 更新依赖 [22f824c6e]
- 更新依赖 [642533255]
- 更新依赖 [d0dd06fe8]
- 更新依赖 [5584f84bb]
- 更新依赖 [41b2b742a]
- 更新依赖 [442d6dfd9]
- 更新依赖 [eb2439ed0]
- 更新依赖 [0b7926d1d]
- 更新依赖 [0a5237e6c]
- 更新依赖 [78143c81a]
- 更新依赖 [b1d4e60f8]
  - @hyperdx/common-utils@0.34.0