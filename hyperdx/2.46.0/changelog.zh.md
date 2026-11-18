## @hyperdx/app@2.46.0

### 次要版本变更

- ca4855d97: 支持在事件模式中筛选或排除指定模式

  鼠标悬停在事件模式中的一行上时，会显示「筛选此模式」和「排除此模式」按钮。每个按钮都会添加一个筛选条件，覆盖当前时间范围内符合该模式的全部事件，包括采样范围之外的事件。结果表、直方图和计数都会随之更新。排除条件可以叠加，以标签形式显示在其他筛选条件旁。更改侧边栏筛选条件时会保留这些排除条件，URL 和已保存搜索也会记录它们。新的纳入条件会替换上一个纳入条件。切换数据源会移除模式筛选条件。

- 743c3c1a6: 新增可选的「行键表达式」，适用于日志和 Trace 数据源。设置后，侧边面板仅使用表达式指定的列查询和筛选行，省去从表元数据检测键的步骤。
- a7744e82a: 仪表板筛选器和磁贴支持数据源变量。
- a7744e82a: 磁贴和筛选器可使用数据源变量指定数据源。
- a7744e82a: 新增连接变量，适用于原始 SQL 磁贴、SQL 查询筛选器以及限定在指定连接内的数据源变量。

### 补丁变更

- f15b849da: 临时仪表板筛选器的完善工作

  - 新增 `IN` 运算符。同一个键上的多个 `IN` 条件按 OR 合并为一个 SQL `IN (...)` 条件，或一个 PromQL `=~"a|b"` 匹配器。
  - 临时筛选器始终广播（`isBroadcastEnabled: true`）。变量名仅作为唯一标识符，已取消其 `$variable` 声明。
  - 如果已有其他临时筛选器应用于相同数据源，则发出警告。
  - 默认仅显示前三个条件，其余条件可通过「+N 个更多条件」开关展开。

- 3a196eb56: 修复在事件差分模式下从 Trace 数据源切换到不支持差分的数据源（例如日志数据源）时，搜索面板空白的问题。现在视图会回到结果表并显示通知。
- 61999b48f: 将采集器迁移到 Alpine 3.24、将 gomplate 升级到 v5，并移除未使用的 goose 和 esbuild 二进制文件，修复应用和采集器镜像中的严重 CVE。直接调用 `goose` 的自定义入口点应改为调用 `migrate`，沿用同一个 schema 目录。
- 832c11ca2: MCP 设置面板恢复显示 Claude Code 和 Codex CLI 命令，位置在 `hdx mcp install` 命令旁。连接代理时无需另外安装 CLI。
- 3419ab0ae: 修复移动端导航中的团队切换器和用户偏好设置无法访问的问题。应用外壳和导航原先使用 `100vh`，移动端浏览器会把可收起工具栏后面的区域也算进去，导致导航底部超出屏幕且无法滚动到达。现在按小视口调整尺寸。
- cf4b70bec: 更新应用镜像中被标记为存在漏洞的 Node 依赖，包括 axios、MCP SDK、express、js-yaml 和 brace-expansion 等。升级 MCP SDK 后，MCP 工具的校验错误仍会指出校验失败的字段。磁贴的 `displayType` 无效时，错误还会列出可接受的值。
- 272c51486: 支持对 String 类型的属性执行数值范围搜索

  以前，在 String 类型字段上指定数值边界（例如 `LogAttributes.duration_ms:[10 TO 20]`）会报错「no supertype for types String, UInt8」。现在使用 `toFloat64OrNull` 比较，无法转换为数值的值不会匹配。`>`、`<`、`>=` 和 `<=` 仍按文本比较 String 字段。要按数值比较，请使用 `:[1000 TO *]` 之类的范围表达式。

- ca4ceae90: 修复「组织尚无 API 密钥」空状态的宽度，使其占满团队设置区域。
- cac14ebc8: 按连接将 PromQL 数据源标为「时间序列」或「Prometheus」

  查询 ClickHouse TimeSeries 表时，PromQL 数据源的类型显示为「时间序列」。查询外部 Prometheus API 时，显示为「Prometheus」。连接尚未确定时，例如数据源表单尚未选择连接，或列出数据源变量的可选类型时，显示为「时间序列 / Prometheus」。存储的类型仍为 `promql`。

  初次设置时自动检测创建的 PromQL 数据源，以及本地开发环境的默认 PromQL 数据源，现在均命名为「时间序列」。

- 3a10f625f: 点击数据源选择器时选中当前标签，输入内容会替换标签，避免把文字插入旧名称中间。
- 2ee64d8f4: 仪表板的数据源变量和连接变量接受对应的数据源名称和连接名称。
- a7744e82a: 为仪表板添加数据源和连接变量类型。
- 0e9fb1bf1: 可从 Cmd+K 菜单查找设置和偏好

  - 团队设置的各个入口（数据源、连接、团队成员、API 密钥、MCP 服务器、webhook、查询设置等）会打开对应选项卡并滚动到相应区域。
  - 「偏好设置」打开偏好设置对话框。「使用浅色模式」「使用深色模式」「跟随系统颜色模式」可直接切换主题。

- 3acd5ba1a: 创建 SQL 查询仪表板筛选器并填充下拉选项

  仪表板筛选器现在可以从 ClickHouse SQL 查询获取选项。筛选器编辑器新增「SQL 查询值」类型，提供连接选择、SQL 编辑器和选项预览。下拉列表按返回顺序显示查询首列的值，最多 10,000 个。查询可以使用时间宏和其他筛选器的变量。

- 5b50c31c9: 在仪表板架构中添加 SQL 查询筛选器类型

  `SQL_QUERY` 筛选器存储 ClickHouse 连接和 SQL 模板，用 SQL 结果的首列填充筛选器下拉列表。这种筛选器仅提供变量。模板使用 `$__sourceTable` 或 `$__filters`，或宏与变量引用无法展开时，校验会报错。外部 API 和 MCP 尚未开放该筛选器，编辑器与选项查询也尚未实现。

- 50129d13d: 时间图表的数据系列在刷新后保持原有颜色。系列按名称排序，避免依赖 ClickHouse 返回结果的顺序。
- 3c8794f2c: 堆叠柱状图和堆叠折线图不再显示重复的 Y 轴标签，例如 1.5k 舍入为 2k 时出现的「0, 500, 1k, 2k, 2k」。
- a4f68568e: 仪表板磁贴告警可在开发环境以外使用 1 分钟间隔。
- 1556317ea: 对用户偏好设置做了小幅补充。
- 更新依赖项 [f15b849da]
- 更新依赖项 [6705e505d]
- 更新依赖项 [b681cec85]
- 更新依赖项 [8952972c9]
- 更新依赖项 [f42c68a9c]
- 更新依赖项 [fe96b722b]
- 更新依赖项 [61999b48f]
- 更新依赖项 [bfb5c834f]
- 更新依赖项 [02a40929d]
- 更新依赖项 [8dc1aa791]
- 更新依赖项 [6256667e1]
- 更新依赖项 [cf4b70bec]
- 更新依赖项 [272c51486]
- 更新依赖项 [cac14ebc8]
- 更新依赖项 [d311d82e2]
- 更新依赖项 [743c3c1a6]
- 更新依赖项 [a7744e82a]
- 更新依赖项 [a7744e82a]
- 更新依赖项 [a7744e82a]
- 更新依赖项 [fa3a5649e]
- 更新依赖项 [3acd5ba1a]
- 更新依赖项 [5b50c31c9]
  - @hyperdx/common-utils@0.36.0
  - @hyperdx/api@2.46.0

## @hyperdx/otel-collector@2.46.0

### 次要版本变更

- 4b66d1f9a: 将 OTel Collector 的基础版本升级至 v0.165.0

  将自定义 OTel Collector 的基础版本从 contrib v0.155.0（core 1.61.0）升级至 v0.165.0（core 1.71.0）。采集器和 OpAMP supervisor 二进制文件由此获得上游针对 Go 和依赖项的 CVE 修复。

  自定义 supervisor 配置如设置了 `reports_remote_config`，必须移除该设置。自 v0.163.0 起，supervisor 遇到此设置将拒绝启动。`accepts_remote_config` 现已涵盖这两项配置的用途。

  `k8sattributes` 默认只输出稳定版 Kubernetes 语义约定定义的属性。Pod、节点和命名空间的 `labels.*` 与 `annotations.*` 分别改为 `label.*` 和 `annotation.*`，`container.image.tag` 改为 `container.image.tags`。迁移期间可设置 `OTEL_AGENT_FEATURE_GATE_ARG=--feature-gates=-processor.k8sattributes.DontEmitV0K8sConventions`，同时输出旧名称和新名称。

### 补丁变更

- 61999b48f: 将采集器迁移到 Alpine 3.24、将 gomplate 升级到 v5，并移除未使用的 goose 和 esbuild 二进制文件，修复应用和采集器镜像中的严重 CVE。直接调用 `goose` 的自定义入口点应改为调用 `migrate`，沿用同一个 schema 目录。

## @hyperdx/common-utils@0.36.0

### 次要版本变更

- fe96b722b: 新增 `buildCompactPatternPredicate`

  该函数生成的 SQL 更短，匹配结果与 `buildPatternPredicate` 相同，适合存放在 URL 中的模式筛选条件。`parsePatternPredicate` 可以解析两种形式。

- d311d82e2: 共享事件模式的下钻谓词

  `templateToRegex` 和 `buildPatternPredicate` 原用于 MCP 服务器构建 `clickstack_event_patterns` 的下钻筛选条件，二者 现已移至 `@hyperdx/common-utils/dist/drain`。新增选项可匹配使用额外分隔符（`extraDelimiters`）或通过 Python Drain3（`whitespace: 'python'`）提取的模板。`parsePatternPredicate` 可将谓词还原为值表达式和模板。省略选项时，输出与原 MCP 服务器实现一致。

- 743c3c1a6: 新增可选的「行键表达式」，适用于日志和 Trace 数据源。设置后，侧边面板仅使用表达式指定的列查询和筛选行，省去从表元数据检测键的步骤。
- a7744e82a: 为仪表板添加数据源和连接变量类型。
- a7744e82a: 新增连接变量，适用于原始 SQL 磁贴、SQL 查询筛选器以及限定在指定连接内的数据源变量。

### 补丁变更

- f15b849da: 临时仪表板筛选器的完善工作

  - 新增 `IN` 运算符。同一个键上的多个 `IN` 条件按 OR 合并为一个 SQL `IN (...)` 条件，或一个 PromQL `=~"a|b"` 匹配器。
  - 临时筛选器始终广播（`isBroadcastEnabled: true`）。变量名仅作为唯一标识符，已取消其 `$variable` 声明。
  - 如果已有其他临时筛选器应用于相同数据源，则发出警告。
  - 默认仅显示前三个条件，其余条件可通过「+N 个更多条件」开关展开。

- 02a40929d: `clickstack_save_alert` 接受 `note` 和 `numConsecutiveWindows`

  更新时省略任一字段都会保留已存储的值。要清除该字段，请传入 `null`。

- 272c51486: 支持对 String 类型的属性执行数值范围搜索

  以前，在 String 类型字段上指定数值边界（例如 `LogAttributes.duration_ms:[10 TO 20]`）会报错「no supertype for types String, UInt8」。现在使用 `toFloat64OrNull` 比较，无法转换为数值的值不会匹配。`>`、`<`、`>=` 和 `<=` 仍按文本比较 String 字段。要按数值比较，请使用 `:[1000 TO *]` 之类的范围表达式。

- 3acd5ba1a: 创建 SQL 查询仪表板筛选器并填充下拉选项

  仪表板筛选器现在可以从 ClickHouse SQL 查询获取选项。筛选器编辑器新增「SQL 查询值」类型，提供连接选择、SQL 编辑器和选项预览。下拉列表按返回顺序显示查询首列的值，最多 10,000 个。查询可以使用时间宏和其他筛选器的变量。

- 5b50c31c9: 在仪表板架构中添加 SQL 查询筛选器类型

  `SQL_QUERY` 筛选器存储 ClickHouse 连接和 SQL 模板，用 SQL 结果的首列填充筛选器下拉列表。这种筛选器仅提供变量。模板使用 `$__sourceTable` 或 `$__filters`，或宏与变量引用无法展开时，校验会报错。外部 API 和 MCP 尚未开放该筛选器，编辑器与选项查询也尚未实现。

## @hyperdx/api@2.46.0

### 次要版本变更

- 6705e505d: 通过外部 API 创建、读取和更新临时仪表板筛选器

  `/api/v2/dashboards` 现在可接收和返回 `ADHOC` 筛选器，支持 SQL 和 PromQL 数据源类型，以及 对应的 `adhoc` 条目（位于 `savedFilterValues` 中）。每个筛选器引用的数据源必须存在，且其类型必须在该筛选器的 `sourceType` 支持范围内。MCP 仍隐藏临时筛选器。

- b681cec85: 通过 MCP 仪表板工具创建、读取和更新临时仪表板筛选器

  `clickstack_save_dashboard`、`clickstack_get_dashboard` 和 `clickstack_patch_dashboard` 现在可以处理 `ADHOC` 筛选器及其保存的 `adhoc` 条件。仅当 PromQL 启用时才显示 PromQL 临时筛选器。停用 PromQL 时，更新操作会隐藏并保留这些筛选器。如果保存的条件未指定任何临时筛选器，或使用了筛选器不支持的运算符，系统会发出警告。

- 743c3c1a6: 新增可选的「行键表达式」，适用于日志和 Trace 数据源。设置后，侧边面板仅使用表达式指定的列查询和筛选行，省去从表元数据检测键的步骤。
- a7744e82a: 为仪表板添加数据源和连接变量类型。
- a7744e82a: 外部 API 和 MCP 支持数据源变量和连接变量。
- a7744e82a: 新增连接变量，适用于原始 SQL 磁贴、SQL 查询筛选器以及限定在指定连接内的数据源变量。

### 补丁变更

- f15b849da: 临时仪表板筛选器的完善工作

  - 新增 `IN` 运算符。同一个键上的多个 `IN` 条件按 OR 合并为一个 SQL `IN (...)` 条件，或一个 PromQL `=~"a|b"` 匹配器。
  - 临时筛选器始终广播（`isBroadcastEnabled: true`）。变量名仅作为唯一标识符，已取消其 `$variable` 声明。
  - 如果已有其他临时筛选器应用于相同数据源，则发出警告。
  - 默认仅显示前三个条件，其余条件可通过「+N 个更多条件」开关展开。

- 8952972c9: check-alerts 只向每条告警提供该告警自身的历史记录。每轮检查无需为每条告警重复扫描所有告警的分组历史。
- f42c68a9c: 将 `uuid` 升级到 11.1.1（修复 GHSA-w5hq-g745-h8pq），并移除 `@types/uuid`。
- 61999b48f: 将采集器迁移到 Alpine 3.24、将 gomplate 升级到 v5，并移除未使用的 goose 和 esbuild 二进制文件，修复应用和采集器镜像中的严重 CVE。直接调用 `goose` 的自定义入口点应改为调用 `migrate`，沿用同一个 schema 目录。
- bfb5c834f: 未设置隐式搜索列时，MCP 纯文本搜索、模式筛选、事件差分和告警别名查询使用日志数据源的正文表达式。
- 02a40929d: `clickstack_save_alert` 接受 `note` 和 `numConsecutiveWindows`

  更新时省略任一字段都会保留已存储的值。要清除该字段，请传入 `null`。

- 8dc1aa791: MCP 工具 `clickstack_event_patterns` 构建下钻用的 `whereSnippet` 时使用 `@hyperdx/common-utils` 中的共享模式谓词，移除了工具内的重复实现。生成的片段保持一致。
- 6256667e1: 将 `clickstack_trace_top_time_consuming_operations` 重命名为 `clickstack_trace_top_time_consuming_ops`

  旧名称是最长的 MCP 工具名称，超出了部分 MCP 客户端的工具名长度限制。使用旧名称调用该工具的客户端需要改用新名称。

- cf4b70bec: 更新应用镜像中被标记为存在漏洞的 Node 依赖，包括 axios、MCP SDK、express、js-yaml 和 brace-expansion 等。升级 MCP SDK 后，MCP 工具的校验错误仍会指出校验失败的字段。磁贴的 `displayType` 无效时，错误还会列出可接受的值。
- 272c51486: 支持对 String 类型的属性执行数值范围搜索

  以前，在 String 类型字段上指定数值边界（例如 `LogAttributes.duration_ms:[10 TO 20]`）会报错「no supertype for types String, UInt8」。现在使用 `toFloat64OrNull` 比较，无法转换为数值的值不会匹配。`>`、`<`、`>=` 和 `<=` 仍按文本比较 String 字段。要按数值比较，请使用 `:[1000 TO *]` 之类的范围表达式。

- cac14ebc8: 按连接将 PromQL 数据源标为「时间序列」或「Prometheus」

  查询 ClickHouse TimeSeries 表时，PromQL 数据源的类型显示为「时间序列」。查询外部 Prometheus API 时，显示为「Prometheus」。连接尚未确定时，例如数据源表单尚未选择连接，或列出数据源变量的可选类型时，显示为「时间序列 / Prometheus」。存储的类型仍为 `promql`。

  初次设置时自动检测创建的 PromQL 数据源，以及本地开发环境的默认 PromQL 数据源，现在均命名为「时间序列」。

- fa3a5649e: 内部 API、外部 API 和 MCP 接受 SQL 查询仪表板筛选器

  保存仪表板时，如果 `SQL_QUERY` 筛选器引用的连接不属于该团队，保存操作会拒绝该筛选器。外部 API 和 MCP 通过 `connectionId` 读写该筛选器。SQL 使用未知变量或仅适用于数据源的宏时，MCP 会发出警告。

- 5b50c31c9: 在仪表板架构中添加 SQL 查询筛选器类型

  `SQL_QUERY` 筛选器存储 ClickHouse 连接和 SQL 模板，用 SQL 结果的首列填充筛选器下拉列表。这种筛选器仅提供变量。模板使用 `$__sourceTable` 或 `$__filters`，或宏与变量引用无法展开时，校验会报错。外部 API 和 MCP 尚未开放该筛选器，编辑器与选项查询也尚未实现。

- 更新依赖项 [f15b849da]
- 更新依赖项 [fe96b722b]
- 更新依赖项 [02a40929d]
- 更新依赖项 [272c51486]
- 更新依赖项 [d311d82e2]
- 更新依赖项 [743c3c1a6]
- 更新依赖项 [a7744e82a]
- 更新依赖项 [a7744e82a]
- 更新依赖项 [3acd5ba1a]
- 更新依赖项 [5b50c31c9]
  - @hyperdx/common-utils@0.36.0
