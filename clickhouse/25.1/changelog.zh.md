<h3 id="251">
  ClickHouse 25.1 版本, 2025-01-28
</h3>

#### 向后不兼容变更

* `JSONEachRowWithProgress` 现在会在进度发生变化时立即输出进度。此前只有每个结果数据块之后才显示进度，使其失去实用价值。同时调整显示方式，不再输出零值。关闭 [#70800](https://github.com/ClickHouse/ClickHouse/issues/70800)。[#73834](https://github.com/ClickHouse/ClickHouse/pull/73834)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* `Merge` 表将合并底层表的列集合并推导公共类型，以统一结构。关闭 [#64864](https://github.com/ClickHouse/ClickHouse/issues/64864)。某些情况下此变更可能向后不兼容，例如表之间没有公共类型，但仍可转换为第一张表的类型：UInt64 与 Int64，或任意数值类型与 String。若需恢复旧行为，将 `merge_table_max_tables_to_look_for_schema_inference` 设为 `1`，或将 `compatibility` 设为 `24.12` 或更早版本。[#73956](https://github.com/ClickHouse/ClickHouse/pull/73956)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* Parquet 输出格式将 Date 和 DateTime 列转换为 Parquet 支持的日期/时间类型，不再写成原始数字。`DateTime` 变为 `DateTime64(3)`（此前为 `UInt32`）；通过 `output_format_parquet_datetime_as_uint32` 可恢复旧行为。`Date` 变为 `Date32`（此前为 `UInt16`）。[#70950](https://github.com/ClickHouse/ClickHouse/pull/70950)（[Michael Kolupaev](https://github.com/al13n321)）。
* 默认禁止在 `ORDER BY` 和 `less/greater/equal/etc` 比较函数中使用不可比较的类型，如 `JSON`/`Object`/`AggregateFunction`。[#73276](https://github.com/ClickHouse/ClickHouse/pull/73276)（[Pavel Kruglov](https://github.com/Avogar)）。
* 移除已过时的 `MaterializedMySQL` 数据库引擎，该引擎不再可用。[#73879](https://github.com/ClickHouse/ClickHouse/pull/73879)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* `mysql` 字典数据源不再执行 `SHOW TABLE STATUS`，因为对于 InnoDB 表及近期 MySQL 版本，该查询不提供有用信息。关闭 [#72636](https://github.com/ClickHouse/ClickHouse/issues/72636)。此变更向后兼容，但列在这里以便引起注意。[#73914](https://github.com/ClickHouse/ClickHouse/pull/73914)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* `CHECK TABLE` 查询现在需要独立的 `CHECK` 授权。此前仅需 `SHOW TABLES` 授权即可执行，但 `CHECK TABLE` 开销可能很大，且 `SELECT` 查询的常规复杂度限制不适用，存在拒绝服务风险。[#74471](https://github.com/ClickHouse/ClickHouse/pull/74471)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* `h3ToGeo()` 现在按 `(lat, lon)` 顺序返回结果，这是几何函数的标准顺序。需要保留旧 `(lon, lat)` 顺序的用户可设置 `h3togeo_lon_lat_result_order = true`。[#74719](https://github.com/ClickHouse/ClickHouse/pull/74719)（[Manish Gill](https://github.com/mgill25)）。
* 默认使用新的 MongoDB 驱动。希望继续使用旧驱动的用户可将服务器设置 `use_legacy_mongodb_integration` 设为 true。[#73359](https://github.com/ClickHouse/ClickHouse/pull/73359)（[Robert Schulze](https://github.com/rschu1ze)）。

#### 新功能

* 支持提交变更操作后，在执行 `SELECT` 时立即应用尚未完成、尚未由后台进程物化的变更。可通过 `apply_mutations_on_fly` 启用。[#74877](https://github.com/ClickHouse/ClickHouse/pull/74877)（[Anton Popov](https://github.com/CurtizJ)）。
* 为 `Iceberg` 表实现基于时间转换分区操作的分区裁剪。[#72044](https://github.com/ClickHouse/ClickHouse/pull/72044)（[Daniil Ivanik](https://github.com/divanik)）。
* MergeTree 排序键和数据跳过索引支持子列。[#72644](https://github.com/ClickHouse/ClickHouse/pull/72644)（[Pavel Kruglov](https://github.com/Avogar)）。
* 支持从 `Apache Arrow`/`Parquet`/`ORC` 读取 `HALF_FLOAT` 值，读取为 `Float32`。关闭 [#72960](https://github.com/ClickHouse/ClickHouse/issues/72960)。请注意，IEEE-754 半精度浮点数与 `BFloat16` 不同。关闭 [#73835](https://github.com/ClickHouse/ClickHouse/issues/73835)。[#73836](https://github.com/ClickHouse/ClickHouse/pull/73836)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* `system.trace_log` 新增 `symbols` 和 `lines` 两列，包含符号化的堆栈跟踪，便于收集和导出性能分析信息。由服务器配置 `trace_log` 中的 `symbolize` 控制，默认启用。[#73896](https://github.com/ClickHouse/ClickHouse/pull/73896)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 新增 `generateSerialID` 函数，可在表中生成自增编号。延续 [#64310](https://github.com/ClickHouse/ClickHouse/issues/64310)，该工作由 [kazalika](https://github.com/kazalika) 完成。关闭 [#62485](https://github.com/ClickHouse/ClickHouse/issues/62485)。[#73950](https://github.com/ClickHouse/ClickHouse/pull/73950)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 为 DDL 查询新增 `query1 PARALLEL WITH query2 PARALLEL WITH query3 ... PARALLEL WITH queryN` 语法，表示允许且优先让子查询 `{query1, query2, ... queryN}` 相互并行运行。[#73983](https://github.com/ClickHouse/ClickHouse/pull/73983)（[Vitaly Baranov](https://github.com/vitlibar)）。
* 新增反序列化后的数据跳过索引粒度的内存缓存，加快重复使用跳过索引的查询。通过服务器设置 `skipping_index_cache_size` 和 `skipping_index_cache_max_entries` 控制缓存大小。最初动机是优化向量相似性索引，现在它们显著提速。[#70102](https://github.com/ClickHouse/ClickHouse/pull/70102)（[Robert Schulze](https://github.com/rschu1ze)）。
* 内嵌 Web UI 现在在查询期间显示进度条，允许取消查询，显示记录总数及更详细的速度信息，并可在数据到达时增量渲染表格。启用 HTTP 压缩，提升表格渲染速度，表头固定显示。支持选择单元格并用方向键导航，修复选中单元格轮廓使其缩小的问题。单元格不再悬停展开，而仅在选中时展开。停止渲染传入数据的时机改由客户端决定，而非服务器。突出显示数字分组，更新整体设计，使其更鲜明。检查服务器可达性和凭据正确性，显示版本与运行时间。所有字体下，包括 Safari，云图标均显示轮廓。改进嵌套类型中的大整数渲染，正确显示 inf/nan，鼠标悬停列标题时显示数据类型。[#74204](https://github.com/ClickHouse/ClickHouse/pull/74204)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 新增通过 `add_minmax_index_for_numeric_columns`（数值列）和 `add_minmax_index_for_string_columns`（字符串列），为 MergeTree 管理的列默认创建 min-max 数据跳过索引的能力。目前两项设置均禁用，尚无行为变化。[#74266](https://github.com/ClickHouse/ClickHouse/pull/74266)（[Smita Kulkarni](https://github.com/SmitaRKulkarni)）。
* 为 `system.query_log`、Native 协议的 ClientInfo 和服务器日志新增 `script_query_number`、`script_line_number`。关闭 [#67542](https://github.com/ClickHouse/ClickHouse/issues/67542)。感谢 [pinsvin00](https://github.com/pinsvin00) 在 [#68133](https://github.com/ClickHouse/ClickHouse/issues/68133) 中率先推动此功能。[#74477](https://github.com/ClickHouse/ClickHouse/pull/74477)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 新增聚合函数 `sequenceMatchEvents`，返回模式中最长事件链所匹配事件的时间戳。[#72349](https://github.com/ClickHouse/ClickHouse/pull/72349)（[UnamedRus](https://github.com/UnamedRus)）。
* 新增 `arrayNormalizedGini` 函数。[#72823](https://github.com/ClickHouse/ClickHouse/pull/72823)（[flynn](https://github.com/ucasfl)）。
* 为 `DateTime64` 支持减法运算符，允许 `DateTime64` 值相减，也支持与 `DateTime` 相减。[#74482](https://github.com/ClickHouse/ClickHouse/pull/74482)（[Li Yin](https://github.com/liyinsg)）。

#### 实验性功能

* `BFloat16` 数据类型已可用于生产环境。[#73840](https://github.com/ClickHouse/ClickHouse/pull/73840)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。

#### 性能改进

* 优化 `indexHint`：仅用作 `indexHint` 参数的列不再从表中读取。[#74314](https://github.com/ClickHouse/ClickHouse/pull/74314)（[Anton Popov](https://github.com/CurtizJ)）。如果 `indexHint` 是企业数据架构的核心，此优化将大有帮助。
* 更准确地统计 `parallel_hash` JOIN 的 `max_joined_block_size_rows` 设置，避免其内存消耗相较 `hash` 增大。[#74630](https://github.com/ClickHouse/ClickHouse/pull/74630)（[Nikita Taranov](https://github.com/nickitat)）。
* 在查询计划级别为 `MergingAggregated` 步骤支持谓词下推，改善部分使用分析器的查询性能。[#74073](https://github.com/ClickHouse/ClickHouse/pull/74073)（[Nikolai Kochetov](https://github.com/KochetovNicolai)）。
* 移除 `parallel_hash` JOIN 探测阶段按哈希拆分左表数据块的过程。[#73089](https://github.com/ClickHouse/ClickHouse/pull/73089)（[Nikita Taranov](https://github.com/nickitat)）。
* 优化 RowBinary 输入格式。关闭 [#63805](https://github.com/ClickHouse/ClickHouse/issues/63805)。[#65059](https://github.com/ClickHouse/ClickHouse/pull/65059)（[Pavel Kruglov](https://github.com/Avogar)）。
* 启用 `optimize_on_insert` 时写入层级为 1 的数据片段，使新写入片段能够使用多项 `FINAL` 查询优化。[#73132](https://github.com/ClickHouse/ClickHouse/pull/73132)（[Anton Popov](https://github.com/CurtizJ)）。
* 通过底层优化加快字符串反序列化。[#65948](https://github.com/ClickHouse/ClickHouse/pull/65948)（[Nikita Taranov](https://github.com/nickitat)）。
* 比较记录是否相等时，例如合并期间，优先比较最可能不相等的列。[#63780](https://github.com/ClickHouse/ClickHouse/pull/63780)（[UnamedRus](https://github.com/UnamedRus)）。
* 按键重新组织右侧连接表，提升 Grace Hash JOIN 性能。[#72237](https://github.com/ClickHouse/ClickHouse/pull/72237)（[kevinyhzou](https://github.com/KevinyhZou)）。
* 允许 `arrayROCAUC` 和 `arrayAUCPR` 计算整条曲线的部分面积，使超大数据集可以并行计算。[#72904](https://github.com/ClickHouse/ClickHouse/pull/72904)（[Emmanuel](https://github.com/emmanuelsdias)）。
* 避免创建过多空闲线程。[#72920](https://github.com/ClickHouse/ClickHouse/pull/72920)（[Guo Wangyang](https://github.com/guowangy)）。
* 如果表函数中仅有花括号展开，则不列举对象存储的键。关闭 [#73333](https://github.com/ClickHouse/ClickHouse/issues/73333)。[#73518](https://github.com/ClickHouse/ClickHouse/pull/73518)（[Konstantin Bogdanov](https://github.com/thevar1able)）。
* 为可空参数上的函数执行提供短路优化。[#73820](https://github.com/ClickHouse/ClickHouse/pull/73820)（[李扬](https://github.com/taiyang-li)）。
* 不对非函数列应用 `maskedExecute`，提升短路执行性能。[#73965](https://github.com/ClickHouse/ClickHouse/pull/73965)（[lgbo](https://github.com/lgbo-ustc)）。
* 禁用 `Kafka`/`NATS`/`RabbitMQ`/`FileLog` 输入格式的表头自动检测，以提高性能。[#74006](https://github.com/ClickHouse/ClickHouse/pull/74006)（[Azat Khuzhin](https://github.com/azat)）。
* 带分组集的聚合之后，以更高并行度执行流水线。[#74082](https://github.com/ClickHouse/ClickHouse/pull/74082)（[Nikita Taranov](https://github.com/nickitat)）。
* 缩小 `MergeTreeReadPool` 临界区。[#74202](https://github.com/ClickHouse/ClickHouse/pull/74202)（[Guo Wangyang](https://github.com/guowangy)）。
* 并行副本性能改进：在查询发起端，与并行副本协议无关的数据包反序列化现在始终在流水线线程执行。此前可能在负责流水线调度的线程中执行，降低发起端响应速度并延迟流水线运行。[#74398](https://github.com/ClickHouse/ClickHouse/pull/74398)（[Igor Nikonov](https://github.com/devcrafter)）。
* 提升 Keeper 较大 multi 请求的性能。[#74849](https://github.com/ClickHouse/ClickHouse/pull/74849)（[Antonio Andelic](https://github.com/antonio2368)）。
* 按值使用日志包装对象，不在堆上分配。[#74034](https://github.com/ClickHouse/ClickHouse/pull/74034)（[Mikhail Artemenko](https://github.com/Michicosun)）。
* 在后台重新连接 MySQL 和 Postgres 字典副本，避免阻塞对应字典请求。[#71101](https://github.com/ClickHouse/ClickHouse/pull/71101)（[Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)）。
* 并行副本利用历史可用性信息优化副本选择，但连接不可用时未更新副本错误计数。此 PR 在副本不可用时更新错误计数。[#72666](https://github.com/ClickHouse/ClickHouse/pull/72666)（[zoomxi](https://github.com/zoomxi)）。
* 新增 MergeTree 设置 `materialize_skip_indexes_on_merge`，可抑制合并时创建数据跳过索引，允许通过 `ALTER TABLE [..] MATERIALIZE INDEX [...]` 显式控制创建时机。对于向量相似性索引等构建代价高的索引，这很有用。[#74401](https://github.com/ClickHouse/ClickHouse/pull/74401)（[Robert Schulze](https://github.com/rschu1ze)）。
* 优化 Storage(S3/Azure)Queue 的 Keeper 请求。[#74410](https://github.com/ClickHouse/ClickHouse/pull/74410)（[Kseniia Sumarokova](https://github.com/kssenii)）。[#74538](https://github.com/ClickHouse/ClickHouse/pull/74538)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 默认最多使用 `1000` 个并行副本。[#74504](https://github.com/ClickHouse/ClickHouse/pull/74504)（[Konstantin Bogdanov](https://github.com/thevar1able)）。
* 改善从 S3 磁盘读取时 HTTP 会话复用（[#72401](https://github.com/ClickHouse/ClickHouse/issues/72401)）。[#74548](https://github.com/ClickHouse/ClickHouse/pull/74548)（[Julian Maicher](https://github.com/jmaicher)）。

#### 改进

* 支持在隐式 ENGINE 的 CREATE TABLE 查询中使用 SETTINGS，并混合引擎设置和查询设置。[#73120](https://github.com/ClickHouse/ClickHouse/pull/73120)（[Raúl Marín](https://github.com/Algunenano)）。
* 默认启用 `use_hive_partitioning`。[#71636](https://github.com/ClickHouse/ClickHouse/pull/71636)（[Yarik Briukhovetskyi](https://github.com/yariks5s)）。
* 支持参数不同的 JSON 类型之间执行 CAST 和 ALTER。[#72303](https://github.com/ClickHouse/ClickHouse/pull/72303)（[Pavel Kruglov](https://github.com/Avogar)）。
* 支持 JSON 列值的相等比较。[#72991](https://github.com/ClickHouse/ClickHouse/pull/72991)（[Pavel Kruglov](https://github.com/Avogar)）。
* 改进包含 JSON 子列的标识符格式化，避免不必要的反引号。[#73085](https://github.com/ClickHouse/ClickHouse/pull/73085)（[Pavel Kruglov](https://github.com/Avogar)）。
* 改进交互式指标：修复并行副本指标显示不完整；按最近更新时间、再按名称字典序显示；不显示过期指标。[#71631](https://github.com/ClickHouse/ClickHouse/pull/71631)（[Julia Kartseva](https://github.com/jkartseva)）。
* 默认美化 JSON 输出，新增并默认启用 `output_format_json_pretty_print` 控制此行为。[#72148](https://github.com/ClickHouse/ClickHouse/pull/72148)（[Pavel Kruglov](https://github.com/Avogar)）。
* 默认允许 `LowCardinality(UUID)`，它已在 ClickHouse Cloud 客户中证明实用。[#73826](https://github.com/ClickHouse/ClickHouse/pull/73826)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 改善安装期间的提示信息。[#73827](https://github.com/ClickHouse/ClickHouse/pull/73827)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 改善 ClickHouse Cloud 密码重置提示。[#73831](https://github.com/ClickHouse/ClickHouse/pull/73831)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 改善 File 表无法向文件追加数据时的错误消息。[#73832](https://github.com/ClickHouse/ClickHouse/pull/73832)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 用户意外请求在终端输出 Native、Parquet、Avro 等二进制格式时，先询问确认。关闭 [#59524](https://github.com/ClickHouse/ClickHouse/issues/59524)。[#73833](https://github.com/ClickHouse/ClickHouse/pull/73833)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 在终端 Pretty 和 Vertical 格式中突出显示尾随空格，以便辨识。由 `output_format_pretty_highlight_trailing_spaces` 控制。初始实现来自 [Braden Burns](https://github.com/bradenburns) 的 [#72996](https://github.com/ClickHouse/ClickHouse/issues/72996)。关闭 [#71590](https://github.com/ClickHouse/ClickHouse/issues/71590)。[#73847](https://github.com/ClickHouse/ClickHouse/pull/73847)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* `clickhouse-client` 和 `clickhouse-local` 会在 stdin 从文件重定向时自动识别压缩。关闭 [#70865](https://github.com/ClickHouse/ClickHouse/issues/70865)。[#73848](https://github.com/ClickHouse/ClickHouse/pull/73848)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* Pretty 格式默认截短过长列名，由 `output_format_pretty_max_column_name_width_cut_to` 和 `output_format_pretty_max_column_name_width_min_chars_to_cut` 控制。延续 [tanmaydatta](https://github.com/tanmaydatta) 在 [#66502](https://github.com/ClickHouse/ClickHouse/issues/66502) 中的工作。关闭 [#65968](https://github.com/ClickHouse/ClickHouse/issues/65968)。[#73851](https://github.com/ClickHouse/ClickHouse/pull/73851)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 美化 `Pretty` 格式：如果距上一数据块输出时间不长，则合并连续块。由新设置 `output_format_pretty_squash_consecutive_ms`（默认 50 毫秒）和 `output_format_pretty_squash_max_wait_ms`（默认 1000 毫秒）控制。延续 [#49537](https://github.com/ClickHouse/ClickHouse/issues/49537)。关闭 [#49153](https://github.com/ClickHouse/ClickHouse/issues/49153)。[#73852](https://github.com/ClickHouse/ClickHouse/pull/73852)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 新增当前正在合并的源数据片段数量指标。关闭 [#70809](https://github.com/ClickHouse/ClickHouse/issues/70809)。[#73868](https://github.com/ClickHouse/ClickHouse/pull/73868)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 输出到终端时，突出显示 `Vertical` 格式中的列。可通过 `output_format_pretty_color` 禁用。[#73898](https://github.com/ClickHouse/ClickHouse/pull/73898)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 增强 MySQL 兼容性，使 Oracle 提供的功能丰富的 MySQL CLI `mysqlsh` 能连接 ClickHouse，方便测试。[#73912](https://github.com/ClickHouse/ClickHouse/pull/73912)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* Pretty 格式可在单元格中显示多行字段，提高可读性。默认启用，由 `output_format_pretty_multiline_fields` 控制。延续 [Volodyachan](https://github.com/Volodyachan) 在 [#64094](https://github.com/ClickHouse/ClickHouse/issues/64094) 中的工作。关闭 [#56912](https://github.com/ClickHouse/ClickHouse/issues/56912)。[#74032](https://github.com/ClickHouse/ClickHouse/pull/74032)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 向浏览器 JavaScript 公开 X-ClickHouse HTTP 标头，方便编写应用。[#74180](https://github.com/ClickHouse/ClickHouse/pull/74180)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* `JSONEachRowWithProgress` 将包含元数据事件、汇总和极值，以及 `rows_before_limit_at_least`、`rows_before_aggregation`。部分结果输出后出现异常时会正确打印。进度包含已用纳秒数，结束时额外输出最终进度事件。查询期间进度输出频率不超过 `interactive_delay` 设置指定的间隔。[#74181](https://github.com/ClickHouse/ClickHouse/pull/74181)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* Play UI 的沙漏将平滑旋转。[#74182](https://github.com/ClickHouse/ClickHouse/pull/74182)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 即使 HTTP 响应压缩，也在数据包到达后立即发送，使浏览器能接收进度包和压缩数据。[#74201](https://github.com/ClickHouse/ClickHouse/pull/74201)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 输出记录多于 N = `output_format_pretty_max_rows` 时，不再仅显示前 N 行，而是从表格中间截断，显示前 N/2 行和后 N/2 行。延续 [#64200](https://github.com/ClickHouse/ClickHouse/issues/64200)。关闭 [#59502](https://github.com/ClickHouse/ClickHouse/issues/59502)。[#73929](https://github.com/ClickHouse/ClickHouse/pull/73929)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 启用哈希连接时，允许更通用的连接规划算法。[#71926](https://github.com/ClickHouse/ClickHouse/pull/71926)（[János Benjamin Antal](https://github.com/antaljanosbenjamin)）。
* 允许在 `DateTime64` 列上创建 bloom\_filter 索引。[#66416](https://github.com/ClickHouse/ClickHouse/pull/66416)（[Yutong Xiao](https://github.com/YutSean)）。
* 同时启用 `min_age_to_force_merge_seconds` 和 `min_age_to_force_merge_on_partition_only` 时，数据片段合并忽略最大字节限制。[#73656](https://github.com/ClickHouse/ClickHouse/pull/73656)（[Kai Zhu](https://github.com/nauu)）。
* 为 OpenTelemetry span 日志表添加 HTTP 标头，增强可追溯性。[#70516](https://github.com/ClickHouse/ClickHouse/pull/70516)（[jonymohajanGmail](https://github.com/jonymohajanGmail)）。
* 支持按自定义时区写入 `orc` 文件，不再始终使用 `GMT`。[#70615](https://github.com/ClickHouse/ClickHouse/pull/70615)（[kevinyhzou](https://github.com/KevinyhZou)）。
* 跨云写入备份时遵循 I/O 调度设置。[#71093](https://github.com/ClickHouse/ClickHouse/pull/71093)（[János Benjamin Antal](https://github.com/antaljanosbenjamin)）。
* 为 `system.asynchronous_metrics` 的 `metric` 列添加别名 `name`。[#71164](https://github.com/ClickHouse/ClickHouse/pull/71164)（[megao](https://github.com/jetgm)）。
* 历史上，`ALTER TABLE MOVE PARTITION TO TABLE` 不知为何检查 `SELECT` 和 `ALTER DELETE`，而非专用的 `ALTER_MOVE_PARTITION`。此 PR 改为使用专用权限。为保持兼容，已有 `SELECT` 和 `ALTER DELETE` 时也会隐式授予此权限，但后续版本将移除此行为。关闭 [#16403](https://github.com/ClickHouse/ClickHouse/issues/16403)。[#71632](https://github.com/ClickHouse/ClickHouse/pull/71632)（[pufit](https://github.com/pufit)）。
* 尝试物化排序键中的列时抛出异常，避免破坏排序顺序。[#71891](https://github.com/ClickHouse/ClickHouse/pull/71891)（[Peter Nguyen](https://github.com/petern48)）。
* 在 `EXPLAIN QUERY TREE` 中隐藏秘密信息。[#72025](https://github.com/ClickHouse/ClickHouse/pull/72025)（[Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)）。
* 在原生读取器中支持 Parquet 整数逻辑类型。[#72105](https://github.com/ClickHouse/ClickHouse/pull/72105)（[Arthur Passos](https://github.com/arthurpassos)）。
* 默认用户需要密码时，在浏览器中交互式请求凭据。服务器此前返回 HTTP 403，现在返回 HTTP 401。[#72198](https://github.com/ClickHouse/ClickHouse/pull/72198)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 将访问类型 `CREATE_USER`、`ALTER_USER`、`DROP_USER`、`CREATE_ROLE`、`ALTER_ROLE`、`DROP_ROLE` 从全局改为参数化，可以更精确地授予访问管理权限。[#72246](https://github.com/ClickHouse/ClickHouse/pull/72246)（[pufit](https://github.com/pufit)）。
* 为 `system.mutations` 新增 `latest_fail_error_code_name`，用于引入变更操作停滞指标，绘制云端遇到的错误图表，并可选地添加更少噪声的告警。[#72398](https://github.com/ClickHouse/ClickHouse/pull/72398)（[Miсhael Stetsyuk](https://github.com/mstetsyuk)）。
* 减少 `ATTACH PARTITION` 查询中的内存分配。[#72583](https://github.com/ClickHouse/ClickHouse/pull/72583)（[Konstantin Morozov](https://github.com/k-morozov)）。
* 使 `max_bytes_before_external_sort` 限制取决于查询总内存消耗。此前它指单个排序线程排序块的字节数；现在与 `max_bytes_before_external_group_by` 含义一致，限制整个查询所有线程的总内存。另新增 `min_external_sort_block_bytes` 控制磁盘数据块大小。[#72598](https://github.com/ClickHouse/ClickHouse/pull/72598)（[Azat Khuzhin](https://github.com/azat)）。
* 跟踪收集器忽略内存限制。[#72606](https://github.com/ClickHouse/ClickHouse/pull/72606)（[Azat Khuzhin](https://github.com/azat)）。
* 在 `system.server_settings` 中添加服务器设置 `dictionaries_lazy_load` 和 `wait_dictionaries_load_at_startup`。[#72664](https://github.com/ClickHouse/ClickHouse/pull/72664)（[Christoph Wurm](https://github.com/cwurm)）。
* 允许在 `BACKUP`/`RESTORE` 查询中指定 `max_backup_bandwidth`。[#72665](https://github.com/ClickHouse/ClickHouse/pull/72665)（[Christoph Wurm](https://github.com/cwurm)）。
* 降低 ReplicatedMergeTree 新出现复制数据片段的日志级别，减少复制集群日志量。[#72876](https://github.com/ClickHouse/ClickHouse/pull/72876)（[mor-akamai](https://github.com/morkalfon)）。
* 改进析取表达式中公共表达式的提取，即使并非所有析取项都有共同子表达式，也允许简化结果筛选表达式。延续 [#71537](https://github.com/ClickHouse/ClickHouse/issues/71537)。[#73271](https://github.com/ClickHouse/ClickHouse/pull/73271)（[Dmitry Novik](https://github.com/novikd)）。
* 允许为创建时没有设置的 `S3Queue`/`AzureQueue` 存储表添加设置。[#73283](https://github.com/ClickHouse/ClickHouse/pull/73283)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 引入 `least_greatest_legacy_null_behavior`（默认 `false`），控制 `least`、`greatest` 是否在有 `NULL` 参数时无条件返回 `NULL`（`true`），或忽略这些参数（`false`）。[#73344](https://github.com/ClickHouse/ClickHouse/pull/73344)（[Robert Schulze](https://github.com/rschu1ze)）。
* 在 ObjectStorageQueueMetadata 清理线程中使用 Keeper multi 请求。[#73357](https://github.com/ClickHouse/ClickHouse/pull/73357)（[Antonio Andelic](https://github.com/antonio2368)）。
* ClickHouse 运行于 cgroup 中时，仍收集系统负载、进程调度、内存等系统级异步指标。当 ClickHouse 是主机上唯一高资源消耗进程时，这些指标可能提供有用信号。[#73369](https://github.com/ClickHouse/ClickHouse/pull/73369)（[Nikita Taranov](https://github.com/nickitat)）。
* `S3Queue` 支持将 24.6 之前创建的旧有序表迁移为分桶的新结构。[#73467](https://github.com/ClickHouse/ClickHouse/pull/73467)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 新增 `system.azure_queue`，类似于现有 `system.s3queue`。[#73477](https://github.com/ClickHouse/ClickHouse/pull/73477)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* `parseDateTime64` 及其变体现在能对 1970 年以前或 2106 年以后的输入日期生成正确结果。例如：`SELECT parseDateTime64InJodaSyntax('2200-01-01 00:00:00.000', 'yyyy-MM-dd HH:mm:ss.SSS')`。[#73594](https://github.com/ClickHouse/ClickHouse/pull/73594)（[zhanglistar](https://github.com/zhanglistar)）。
* 解决用户反馈的部分 `clickhouse-disks` 易用性问题。关闭 [#67136](https://github.com/ClickHouse/ClickHouse/issues/67136)。[#73616](https://github.com/ClickHouse/ClickHouse/pull/73616)（[Daniil Ivanik](https://github.com/divanik)）。
* 允许修改 S3(Azure)Queue 的提交设置：`max_processed_files_before_commit`、`max_processed_rows_before_commit`、`max_processed_bytes_before_commit`、`max_processing_time_sec_before_commit`。[#73635](https://github.com/ClickHouse/ClickHouse/pull/73635)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* S3(Azure)Queue 汇总各数据源的进度，与提交限制设置比较。[#73641](https://github.com/ClickHouse/ClickHouse/pull/73641)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* `BACKUP`/`RESTORE` 查询支持核心设置。[#73650](https://github.com/ClickHouse/ClickHouse/pull/73650)（[Vitaly Baranov](https://github.com/vitlibar)）。
* Parquet 输出遵循 `output_format_compression_level`。[#73651](https://github.com/ClickHouse/ClickHouse/pull/73651)（[Arthur Passos](https://github.com/arthurpassos)）。
* 将 Apache Arrow 的 `fixed_size_list` 读取为 `Array`，不再视为不受支持的类型。[#73654](https://github.com/ClickHouse/ClickHouse/pull/73654)（[Julian Meyers](https://github.com/J-Meyers)）。
* 新增两个用于测试的备份引擎：`Memory`（在当前用户会话内保存备份）和 `Null`（不在任何地方保存备份）。[#73690](https://github.com/ClickHouse/ClickHouse/pull/73690)（[Vitaly Baranov](https://github.com/vitlibar)）。
* `concurrent_threads_soft_limit_num` 和 `concurrent_threads_soft_limit_num_ratio_to_cores` 可无需重启服务器即修改。[#73713](https://github.com/ClickHouse/ClickHouse/pull/73713)（[Sergei Trifonov](https://github.com/serxa)）。
* `formatReadable` 函数支持扩展数值类型（`Decimal`、大整数）。[#73765](https://github.com/ClickHouse/ClickHouse/pull/73765)（[Raúl Marín](https://github.com/Algunenano)）。
* Postgres 线协议兼容层支持 TLS。[#73812](https://github.com/ClickHouse/ClickHouse/pull/73812)（[scanhex12](https://github.com/scanhex12)）。
* 修复有效 IPv4 地址后跟零字节时 `isIPv4String` 返回 true 的问题，此时应返回 false。延续 [#65387](https://github.com/ClickHouse/ClickHouse/issues/65387)。[#73946](https://github.com/ClickHouse/ClickHouse/pull/73946)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 使 MySQL 线协议错误码与 MySQL 兼容。延续 [#56831](https://github.com/ClickHouse/ClickHouse/issues/56831)。关闭 [#50957](https://github.com/ClickHouse/ClickHouse/issues/50957)。[#73948](https://github.com/ClickHouse/ClickHouse/pull/73948)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 新增 `validate_enum_literals_in_opearators`，在 `IN`、`NOT IN` 等运算符中校验枚举字面量，不属于该枚举类型时抛出异常。[#73985](https://github.com/ClickHouse/ClickHouse/pull/73985)（[Vladimir Cherkasov](https://github.com/vdimir)）。
* `S3(Azure)Queue` 将一个由提交设置定义的批次中的所有文件，通过单个 Keeper 事务提交。[#73991](https://github.com/ClickHouse/ClickHouse/pull/73991)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 禁用可执行 UDF 和字典的表头检测，避免出现 Function 'X': wrong result, expected Y row(s), actual Y-1。[#73992](https://github.com/ClickHouse/ClickHouse/pull/73992)（[Azat Khuzhin](https://github.com/azat)）。
* 为 `EXPLAIN PLAN.` 新增 `distributed` 选项。`EXPLAIN distributed=1 ... ` 现在会向 `ReadFromParallelRemote*` 步骤附加远程计划。[#73994](https://github.com/ClickHouse/ClickHouse/pull/73994)（[Nikolai Kochetov](https://github.com/KochetovNicolai)）。
* 对 Dynamic 参数的 not/xor 使用正确返回类型。[#74013](https://github.com/ClickHouse/ClickHouse/pull/74013)（[Pavel Kruglov](https://github.com/Avogar)）。
* 允许创建表后修改 `add_implicit_sign_column_constraint_for_collapsing_engine`。[#74014](https://github.com/ClickHouse/ClickHouse/pull/74014)（[Christoph Wurm](https://github.com/cwurm)）。
* 物化视图的 SELECT 查询支持子列。[#74030](https://github.com/ClickHouse/ClickHouse/pull/74030)（[Pavel Kruglov](https://github.com/Avogar)）。
* 现在有三种简单方法自定义 `clickhouse-client` 提示符：1. 命令行参数 `--prompt`；2. 配置文件设置 `<prompt>[...]</prompt>`；3. 配置文件的逐连接设置 `<connections_credentials><prompt>[...]</prompt></connection_credentials>`。[#74168](https://github.com/ClickHouse/ClickHouse/pull/74168)（[Christoph Wurm](https://github.com/cwurm)）。
* ClickHouse Client 连接 9440 端口时自动识别安全连接。[#74212](https://github.com/ClickHouse/ClickHouse/pull/74212)（[Christoph Wurm](https://github.com/cwurm)）。
* http\_handlers 允许仅使用用户名进行用户认证，此前还要求提供密码。[#74221](https://github.com/ClickHouse/ClickHouse/pull/74221)（[Azat Khuzhin](https://github.com/azat)）。
* 将替代查询语言 PRQL 和 KQL 支持标为实验性。使用时需指定 `allow_experimental_prql_dialect = 1` 和 `allow_experimental_kusto_dialect = 1`。[#74224](https://github.com/ClickHouse/ClickHouse/pull/74224)（[Robert Schulze](https://github.com/rschu1ze)）。
* 更多聚合函数支持返回默认 Enum 类型。[#74272](https://github.com/ClickHouse/ClickHouse/pull/74272)（[Raúl Marín](https://github.com/Algunenano)）。
* `OPTIMIZE TABLE` 现在支持以 `FORCE` 替代现有的 `FINAL` 关键字。[#74342](https://github.com/ClickHouse/ClickHouse/pull/74342)（[Robert Schulze](https://github.com/rschu1ze)）。
* 新增 `IsServerShuttingDown` 指标，用于在服务器关闭耗时过长时触发告警。[#74429](https://github.com/ClickHouse/ClickHouse/pull/74429)（[Miсhael Stetsyuk](https://github.com/mstetsyuk)）。
* 在 EXPLAIN 中添加 Iceberg 表名。[#74485](https://github.com/ClickHouse/ClickHouse/pull/74485)（[alekseev-maksim](https://github.com/alekseev-maksim)）。
* 旧分析器使用 RECURSIVE CTE 时，提供更清楚的错误消息。[#74523](https://github.com/ClickHouse/ClickHouse/pull/74523)（[Raúl Marín](https://github.com/Algunenano)）。
* 在 `system.errors` 中显示扩展错误信息。[#74574](https://github.com/ClickHouse/ClickHouse/pull/74574)（[Vitaly Baranov](https://github.com/vitlibar)）。
* 允许客户端与 clickhouse-keeper 通信时使用密码。如果客户端和服务器已正确配置 SSL，此功能用处不大，但某些情况下仍可能有用。密码长度不能超过 16 个字符，与 Keeper Auth 模型无关。[#74673](https://github.com/ClickHouse/ClickHouse/pull/74673)（[alesapin](https://github.com/alesapin)）。
* 为配置重新加载器添加错误码。[#74746](https://github.com/ClickHouse/ClickHouse/pull/74746)（[Garrett Thomas](https://github.com/garrettthomaskth)）。
* MySQL 和 PostgreSQL 表函数及引擎支持 IPv6 地址。[#74796](https://github.com/ClickHouse/ClickHouse/pull/74796)（[Mikhail Koviazin](https://github.com/mkmkme)）。
* 为 `divideDecimal` 实现短路优化。修复 [#74280](https://github.com/ClickHouse/ClickHouse/issues/74280)。[#74843](https://github.com/ClickHouse/ClickHouse/pull/74843)（[Kevin Mingtarja](https://github.com/kevinmingtarja)）。
* 现在可以在启动脚本中指定用户。[#74894](https://github.com/ClickHouse/ClickHouse/pull/74894)（[pufit](https://github.com/pufit)）。
* 新增 Azure SAS Token 支持。[#72959](https://github.com/ClickHouse/ClickHouse/pull/72959)（[Azat Khuzhin](https://github.com/azat)）。

#### 错误修复（正式稳定版本中用户可见的异常行为）

* 仅在压缩编解码器支持时设置 Parquet 压缩级别。[#74659](https://github.com/ClickHouse/ClickHouse/pull/74659)（[Arthur Passos](https://github.com/arthurpassos)）。
* 修复使用带修饰符的排序规则区域设置时抛出错误的退化。例如，`SELECT arrayJoin(['kk 50', 'KK 01', ' KK 2', ' KK 3', 'kk 1', 'x9y99', 'x9y100']) item ORDER BY item ASC COLLATE 'tr-u-kn-true-ka-shifted` 现在可以运行。[#73544](https://github.com/ClickHouse/ClickHouse/pull/73544)（[Robert Schulze](https://github.com/rschu1ze)）。
* 修复 keeper-client 无法创建 SEQUENTIAL 节点的问题。[#64177](https://github.com/ClickHouse/ClickHouse/pull/64177)（[Duc Canh Le](https://github.com/canhld94)）。
* 修复 position 函数中的字符计数错误。[#71003](https://github.com/ClickHouse/ClickHouse/pull/71003)（[思维](https://github.com/heymind)）。
* 修复访问实体的 `RESTORE` 因未处理部分撤销而要求过多权限的问题。关闭 [#71853](https://github.com/ClickHouse/ClickHouse/issues/71853)。[#71958](https://github.com/ClickHouse/ClickHouse/pull/71958)（[pufit](https://github.com/pufit)）。
* 避免 `ALTER TABLE REPLACE/MOVE PARTITION FROM/TO TABLE` 之后的暂停，为后台任务调度获取正确设置。[#72024](https://github.com/ClickHouse/ClickHouse/pull/72024)（[Aleksei Filatov](https://github.com/aalexfvk)）。
* 修复 Parquet、Arrow 等输入输出格式对空元组的处理。[#72616](https://github.com/ClickHouse/ClickHouse/pull/72616)（[Michael Kolupaev](https://github.com/al13n321)）。
* 针对通配符数据库/表的列级 GRANT SELECT/INSERT 语句现在会抛出错误。[#72646](https://github.com/ClickHouse/ClickHouse/pull/72646)（[Johann Gan](https://github.com/johanngan)）。
* 修复目标访问实体含隐式授权时，用户无法执行 `REVOKE ALL ON *.*` 的情况。[#72872](https://github.com/ClickHouse/ClickHouse/pull/72872)（[pufit](https://github.com/pufit)）。
* 修复 formatDateTime 标量函数对正时区偏移的格式化。[#73091](https://github.com/ClickHouse/ClickHouse/pull/73091)（[ollidraese](https://github.com/ollidraese)）。
* 通过 PROXYv1 连接且设置 `auth_use_forwarded_address` 时，正确反映来源端口；此前错误地使用代理端口。新增 `currentQueryID()` 函数。[#73095](https://github.com/ClickHouse/ClickHouse/pull/73095)（[Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)）。
* 将格式设置传递给 TCPHandler 中的 NativeWriter，使 `output_format_native_write_json_as_string` 等设置正确生效。[#73179](https://github.com/ClickHouse/ClickHouse/pull/73179)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复 StorageObjectStorageQueue 崩溃。[#73274](https://github.com/ClickHouse/ClickHouse/pull/73274)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复服务器关闭时可刷新物化视图的罕见崩溃。[#73323](https://github.com/ClickHouse/ClickHouse/pull/73323)（[Michael Kolupaev](https://github.com/al13n321)）。
* `formatDateTime` 的 `%f` 占位符现在始终生成六位小数秒，使其与 MySQL `DATE_FORMAT` 兼容。可用 `formatdatetime_f_prints_scale_number_of_digits = 1` 恢复旧行为。[#73324](https://github.com/ClickHouse/ClickHouse/pull/73324)（[ollidraese](https://github.com/ollidraese)）。
* 修复从 `s3` 存储和表函数读取时按 `_etag` 列筛选。[#73353](https://github.com/ClickHouse/ClickHouse/pull/73353)（[Anton Popov](https://github.com/CurtizJ)）。
* 修复旧分析器在 `JOIN ON` 表达式中使用 `IN (subquery)` 时出现的 `Not-ready Set is passed as the second argument for function 'in'` 错误。[#73382](https://github.com/ClickHouse/ClickHouse/pull/73382)（[Nikolai Kochetov](https://github.com/KochetovNicolai)）。
* 修复 Dynamic 和 JSON 列合并数据块前的准备。此前某些情况下，即使未达到类型/路径数量上限，新类型仍可能写入共享变体/共享数据。[#73388](https://github.com/ClickHouse/ClickHouse/pull/73388)（[Pavel Kruglov](https://github.com/Avogar)）。
* 类型二进制解码时检查损坏的大小值，避免过大内存分配。[#73390](https://github.com/ClickHouse/ClickHouse/pull/73390)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复启用并行副本时读取单副本集群的逻辑错误。[#73403](https://github.com/ClickHouse/ClickHouse/pull/73403)（[Michael Kolupaev](https://github.com/al13n321)）。
* 修复 ObjectStorageQueue 与 ZooKeeper 或旧版 Keeper 配合使用的问题。[#73420](https://github.com/ClickHouse/ClickHouse/pull/73420)（[Antonio Andelic](https://github.com/antonio2368)）。
* 实现默认启用 Hive 分区所需的修复。[#73479](https://github.com/ClickHouse/ClickHouse/pull/73479)（[Yarik Briukhovetskyi](https://github.com/yariks5s)）。
* 修复创建向量相似性索引时的数据竞争。[#73517](https://github.com/ClickHouse/ClickHouse/pull/73517)（[Antonio Andelic](https://github.com/antonio2368)）。
* 修复字典数据源包含使用错误数据的函数时的段错误。[#73535](https://github.com/ClickHouse/ClickHouse/pull/73535)（[Yarik Briukhovetskyi](https://github.com/yariks5s)）。
* 修复 S3(Azure)Queue 插入失败后的重试。关闭 [#70951](https://github.com/ClickHouse/ClickHouse/issues/70951)。[#73546](https://github.com/ClickHouse/ClickHouse/pull/73546)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复元组包含 `LowCardinality` 元素且启用 `optimize_functions_to_subcolumns` 时，部分情况下 `tupleElement` 的错误。[#73548](https://github.com/ClickHouse/ClickHouse/pull/73548)（[Anton Popov](https://github.com/CurtizJ)）。
* 修复枚举通配模式后跟范围模式的解析。修复 [#73473](https://github.com/ClickHouse/ClickHouse/issues/73473)。[#73569](https://github.com/ClickHouse/ClickHouse/pull/73569)（[Konstantin Bogdanov](https://github.com/thevar1able)）。
* 修复非复制表的子查询忽略 parallel\_replicas\_for\_non\_replicated\_merge\_tree 的问题。[#73584](https://github.com/ClickHouse/ClickHouse/pull/73584)（[Igor Nikonov](https://github.com/devcrafter)）。
* 修复无法调度任务时抛出 std::logical\_error 的问题，由压力测试发现。[#73629](https://github.com/ClickHouse/ClickHouse/pull/73629)（[Alexander Gololobov](https://github.com/davenger)）。
* 在 `EXPLAIN SYNTAX` 中不解释执行查询，避免分布式查询处理阶段不正确导致逻辑错误。修复 [#65205](https://github.com/ClickHouse/ClickHouse/issues/65205)。[#73634](https://github.com/ClickHouse/ClickHouse/pull/73634)（[Dmitry Novik](https://github.com/novikd)）。
* 修复 Dynamic 列可能出现的数据不一致，以及 `Nested columns sizes are inconsistent with local_discriminators column size` 逻辑错误。[#73644](https://github.com/ClickHouse/ClickHouse/pull/73644)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复带 `FINAL` 和 `SAMPLE` 的查询中的 `NOT_FOUND_COLUMN_IN_BLOCK`。修复从 `CollapsingMergeTree` 执行带 `FINAL` 的 SELECT 且启用 `FINAL` 优化时结果不正确的问题。[#73682](https://github.com/ClickHouse/ClickHouse/pull/73682)（[Anton Popov](https://github.com/CurtizJ)）。
* 修复 LIMIT BY COLUMNS 中的崩溃。[#73686](https://github.com/ClickHouse/ClickHouse/pull/73686)（[Raúl Marín](https://github.com/Algunenano)）。
* 修复强制使用普通投影，且查询与投影定义完全相同，却未选中投影而报错的问题。[#73700](https://github.com/ClickHouse/ClickHouse/pull/73700)（[Shichao Jin](https://github.com/jsc0218)）。
* 修复 Dynamic/Object 结构反序列化，避免 CANNOT\_READ\_ALL\_DATA 异常。[#73767](https://github.com/ClickHouse/ClickHouse/pull/73767)（[Pavel Kruglov](https://github.com/Avogar)）。
* 从备份恢复数据片段时跳过 `metadata_version.txt`。[#73768](https://github.com/ClickHouse/ClickHouse/pull/73768)（[Vitaly Baranov](https://github.com/vitlibar)）。
* 修复使用 LIKE 转换为 Enum 时的段错误。[#73775](https://github.com/ClickHouse/ClickHouse/pull/73775)（[zhanglistar](https://github.com/zhanglistar)）。
* 修复 S3 Express 存储桶无法作为磁盘使用的问题。[#73777](https://github.com/ClickHouse/ClickHouse/pull/73777)（[Sameer Tamsekar](https://github.com/stamsekar)）。
* 允许合并 CollapsingMergeTree 表中 sign 列值无效的行。[#73864](https://github.com/ClickHouse/ClickHouse/pull/73864)（[Christoph Wurm](https://github.com/cwurm)）。
* 修复副本离线时查询 DDL 报错的问题。[#73876](https://github.com/ClickHouse/ClickHouse/pull/73876)（[Tuan Pham Anh](https://github.com/tuanpach)）。
* 修复 `map()` 类型偶尔无法比较的问题：此前可以创建嵌套元组未显式命名为 'keys'、'values' 的 `Map`。[#73878](https://github.com/ClickHouse/ClickHouse/pull/73878)（[Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)）。
* 解析 GROUP BY ALL 子句时忽略窗口函数。修复 [#73501](https://github.com/ClickHouse/ClickHouse/issues/73501)。[#73916](https://github.com/ClickHouse/ClickHouse/pull/73916)（[Dmitry Novik](https://github.com/novikd)）。
* 修复隐式权限，此前它们按通配符方式生效。[#73932](https://github.com/ClickHouse/ClickHouse/pull/73932)（[Azat Khuzhin](https://github.com/azat)）。
* 修复创建嵌套 Map 时内存使用过高的问题。[#73982](https://github.com/ClickHouse/ClickHouse/pull/73982)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复解析含空键的嵌套 JSON。[#73993](https://github.com/ClickHouse/ClickHouse/pull/73993)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复别名被另一个别名引用且选择顺序相反时，可能未加入投影的问题。[#74033](https://github.com/ClickHouse/ClickHouse/pull/74033)（[Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)）。
* 初始化 plain\_rewritable 磁盘时，忽略 Azure 对象不存在错误。[#74059](https://github.com/ClickHouse/ClickHouse/pull/74059)（[Julia Kartseva](https://github.com/jkartseva)）。
* 修复 `any` 和 `anyLast` 在枚举类型及空表上的行为。[#74061](https://github.com/ClickHouse/ClickHouse/pull/74061)（[Joanna Hulboj](https://github.com/jh0x)）。
* 修复用户在 Kafka 表引擎中指定关键字参数的情况。[#74064](https://github.com/ClickHouse/ClickHouse/pull/74064)（[Yarik Briukhovetskyi](https://github.com/yariks5s)）。
* 修复将 `S3Queue` 设置在带 “s3queue\_” 前缀与不带前缀形式之间修改的问题。[#74075](https://github.com/ClickHouse/ClickHouse/pull/74075)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 新增 `allow_push_predicate_ast_for_distributed_subqueries`，为使用分析器的分布式查询添加基于 AST 的谓词下推。在支持查询计划序列化的分布式查询实现之前，先使用此临时方案。关闭 [#66878](https://github.com/ClickHouse/ClickHouse/issues/66878)、[#69472](https://github.com/ClickHouse/ClickHouse/issues/69472)、[#65638](https://github.com/ClickHouse/ClickHouse/issues/65638)、[#68030](https://github.com/ClickHouse/ClickHouse/issues/68030)、[#73718](https://github.com/ClickHouse/ClickHouse/issues/73718)。[#74085](https://github.com/ClickHouse/ClickHouse/pull/74085)（[Nikolai Kochetov](https://github.com/KochetovNicolai)）。
* 修复 [#73095](https://github.com/ClickHouse/ClickHouse/issues/73095) 之后 forwarded\_for 字段可能含端口，导致包含端口的主机名无法解析的问题。[#74116](https://github.com/ClickHouse/ClickHouse/pull/74116)（[Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)）。
* 修复 `ALTER TABLE (DROP STATISTICS ...) (DROP STATISTICS ...)` 的格式化错误。[#74126](https://github.com/ClickHouse/ClickHouse/pull/74126)（[Han Fei](https://github.com/hanfei1991)）。
* 修复问题 [#66112](https://github.com/ClickHouse/ClickHouse/issues/66112)。[#74128](https://github.com/ClickHouse/ClickHouse/pull/74128)（[Anton Ivashkin](https://github.com/ianton-ru)）。
* 不再允许在 `CREATE TABLE` 中将 `Loop` 用作表引擎，此组合此前会导致段错误。[#74137](https://github.com/ClickHouse/ClickHouse/pull/74137)（[Yarik Briukhovetskyi](https://github.com/yariks5s)）。
* 修复安全问题，防止 postgresql 和 sqlite 表函数中的 SQL 注入。[#74144](https://github.com/ClickHouse/ClickHouse/pull/74144)（[Pablo Marcos](https://github.com/pamarcos)）。
* 修复读取启用压缩的 Memory 引擎表的子列时崩溃。修复 [#74009](https://github.com/ClickHouse/ClickHouse/issues/74009)。[#74161](https://github.com/ClickHouse/ClickHouse/pull/74161)（[Nikita Taranov](https://github.com/nickitat)）。
* 修复查询 system.detached\_tables 时的无限循环。[#74190](https://github.com/ClickHouse/ClickHouse/pull/74190)（[Konstantin Morozov](https://github.com/k-morozov)）。
* 修复 s3queue 将文件标为失败时的逻辑错误。[#74216](https://github.com/ClickHouse/ClickHouse/pull/74216)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复从基础备份执行 `RESTORE` 时的原生复制设置 `allow_s3_native_copy`/`allow_azure_native_copy`。[#74286](https://github.com/ClickHouse/ClickHouse/pull/74286)（[Azat Khuzhin](https://github.com/azat)）。
* 修复数据库中已分离表数量恰为 max\_block\_size 倍数时的问题。[#74289](https://github.com/ClickHouse/ClickHouse/pull/74289)（[Konstantin Morozov](https://github.com/k-morozov)）。
* 修复源和目标凭据不同时通过 ObjectStorage（如 S3）复制。[#74331](https://github.com/ClickHouse/ClickHouse/pull/74331)（[Azat Khuzhin](https://github.com/azat)）。
* 修复 GCS 原生复制中对 “use the Rewrite method in the JSON API” 的检测。[#74338](https://github.com/ClickHouse/ClickHouse/pull/74338)（[Azat Khuzhin](https://github.com/azat)）。
* 修复 `BackgroundMergesAndMutationsPoolSize` 计算错误，此前为实际值的两倍。[#74509](https://github.com/ClickHouse/ClickHouse/pull/74509)（[alesapin](https://github.com/alesapin)）。
* 修复启用 Cluster Discovery 时 Keeper 监听泄漏。[#74521](https://github.com/ClickHouse/ClickHouse/pull/74521)（[RinChanNOW](https://github.com/RinChanNOWWW)）。
* 修复 UBSan 报告的内存对齐问题 [#74512](https://github.com/ClickHouse/ClickHouse/issues/74512)。[#74534](https://github.com/ClickHouse/ClickHouse/pull/74534)（[Arthur Passos](https://github.com/arthurpassos)）。
* 修复创建表时 KeeperMap 的并发清理。[#74568](https://github.com/ClickHouse/ClickHouse/pull/74568)（[Antonio Andelic](https://github.com/antonio2368)）。
* 存在 `EXCEPT` 或 `INTERSECT` 时，不从子查询移除未使用的投影列，以保持查询结果正确。修复 [#73930](https://github.com/ClickHouse/ClickHouse/issues/73930)。修复 [#66465](https://github.com/ClickHouse/ClickHouse/issues/66465)。[#74577](https://github.com/ClickHouse/ClickHouse/pull/74577)（[Dmitry Novik](https://github.com/novikd)）。
* 修复包含 `Tuple` 列且启用稀疏序列化的表之间的 `INSERT SELECT` 查询。[#74698](https://github.com/ClickHouse/ClickHouse/pull/74698)（[Anton Popov](https://github.com/CurtizJ)）。
* 修复 `right` 函数对常量负偏移处理不正确的问题。[#74701](https://github.com/ClickHouse/ClickHouse/pull/74701)（[Daniil Ivanik](https://github.com/divanik)）。
* 修复客户端解压错误导致插入 gzip 数据偶尔失败的问题。[#74707](https://github.com/ClickHouse/ClickHouse/pull/74707)（[siyuan](https://github.com/linkwk7)）。
* 带通配符授权的部分撤销可能移除超出预期的权限。关闭 [#74263](https://github.com/ClickHouse/ClickHouse/issues/74263)。[#74751](https://github.com/ClickHouse/ClickHouse/pull/74751)（[pufit](https://github.com/pufit)）。
* Keeper 修复：修复从磁盘读取日志条目。[#74785](https://github.com/ClickHouse/ClickHouse/pull/74785)（[Antonio Andelic](https://github.com/antonio2368)）。
* 修复 SYSTEM REFRESH/START/STOP VIEW 的授权检查：对特定视图执行查询只需该视图的授权，不再要求 `*.*` 上的授权。[#74789](https://github.com/ClickHouse/ClickHouse/pull/74789)（[Alexander Tokmakov](https://github.com/tavplubix)）。
* `hasColumnInTable` 此前未考虑别名列，现修复以支持别名列。[#74841](https://github.com/ClickHouse/ClickHouse/pull/74841)（[Bharat Nallan](https://github.com/bharatnc)）。
* 修复 Azure Blob Storage 中包含空列的表合并数据片段时出现的 FILE\_DOESNT\_EXIST。[#74892](https://github.com/ClickHouse/ClickHouse/pull/74892)（[Julia Kartseva](https://github.com/jkartseva)）。
* 修复连接临时表时投影列名错误，关闭 [#68872](https://github.com/ClickHouse/ClickHouse/issues/68872)。[#74897](https://github.com/ClickHouse/ClickHouse/pull/74897)（[Vladimir Cherkasov](https://github.com/vdimir)）。

#### 构建/测试/打包改进

* 通用安装脚本现在也会在 macOS 上提示安装。[#74339](https://github.com/ClickHouse/ClickHouse/pull/74339)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
