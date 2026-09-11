<h3 id="2511">
  ClickHouse 25.11 版本, 2025-11-27
</h3>

#### 向后不兼容变更

* 移除已弃用的 `Object` 类型。[#85718](https://github.com/ClickHouse/ClickHouse/pull/85718)（[Pavel Kruglov](https://github.com/Avogar)）。
* 移除已过时的 `LIVE VIEW` 功能。如果仍在使用 `LIVE VIEW`，将无法升级到新版本。[#88706](https://github.com/ClickHouse/ClickHouse/pull/88706)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 此前 `Geometry` 是 `String` 的别名，现在成为功能完整的类型。[#83344](https://github.com/ClickHouse/ClickHouse/pull/83344)（[scanhex12](https://github.com/scanhex12)）。
* 对 MergeTree 表 Wide 数据片段中为 `Variant` 类型子列创建的文件名进行转义。这会破坏与包含 Variant/Dynamic/JSON 数据类型的旧表的兼容性，同时修复在 Variant 中存储含特殊符号类型的问题，例如时区含 `\` 的 DateTime。可以通过 MergeTree 设置 `escape_variant_subcolumn_filenames` 禁用转义；为保持兼容，请在升级前于 MergeTree 配置中禁用此设置，或将 `compatibility` 设为先前版本。解决 [#69590](https://github.com/ClickHouse/ClickHouse/issues/69590)。[#87300](https://github.com/ClickHouse/ClickHouse/pull/87300)（[Pavel Kruglov](https://github.com/Avogar)）。
* 默认对 `String` 数据类型启用 `with_size_stream` 序列化格式。此变更向后兼容，但该新格式仅从 25.10 起受支持，因此无法降级到 25.10 之前的版本。如果需要保留降级至 25.9 及更早版本的能力，请在服务器配置的 `merge_tree` 部分将 `serialization_info_version` 设为 `basic`，将 `string_serialization_version` 设为 `single_stream`。[#89329](https://github.com/ClickHouse/ClickHouse/pull/89329)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* HTTP 结果响应支持异常标记，使客户端能更可靠地解析异常。解决 [#75175](https://github.com/ClickHouse/ClickHouse/issues/75175)。为保持不同格式间的一致性，默认禁用 `http_write_exception_in_output_format`。[#88818](https://github.com/ClickHouse/ClickHouse/pull/88818)（[Kaviraj Kanagaraj](https://github.com/kavirajk)）。虽然预计不会破坏任何现有行为，最坏情况下也只是在异常消息中添加一个奇怪的字符串，但仍将其归为“向后不兼容变更”以提醒注意，因为无法预料某些糟糕的脚本如何解析异常消息。
* 禁止基于同一共享对象存储路径创建多个 `plain-rewritable` 磁盘，因为不同元数据存储事务冲突时可能产生未定义行为。[#89038](https://github.com/ClickHouse/ClickHouse/pull/89038)（[Mikhail Artemenko](https://github.com/Michicosun)）。
* 修复 Kafka 存储 SASL 设置的优先级。CREATE TABLE 查询指定的表级 SASL 设置，现在会正确覆盖配置文件中针对消费者或生产者的设置。[#89401](https://github.com/ClickHouse/ClickHouse/pull/89401)（[János Benjamin Antal](https://github.com/antaljanosbenjamin)）。
* Parquet 无时区时间戳（isAdjustedToUTC=false）现在读取为 DateTime64(..., 'UTC')，而非 DateTime64(...)。这种处理更接近正确行为，因为将此类 UTC 时间戳转换为字符串时，能得到正确的本地时间表示。可通过 `input_format_parquet_local_time_as_utc = 0` 恢复旧行为。解决 [#87469](https://github.com/ClickHouse/ClickHouse/issues/87469)。[#87872](https://github.com/ClickHouse/ClickHouse/pull/87872)（[Michael Kolupaev](https://github.com/al13n321)）。
* 小幅改进 `T64` 编解码器：不再接受与压缩元素大小不对齐的数据类型，否则会触发错误。解决 [#89282](https://github.com/ClickHouse/ClickHouse/issues/89282)。[#89432](https://github.com/ClickHouse/ClickHouse/pull/89432)（[yanglongwei](https://github.com/ylw510)）。

#### 新功能

* 新增 `Geometry` 类型，支持从 `WKB` 和 `WKT` 格式读取。此前 `Geometry` 是 `String` 的别名，现在成为功能完整的类型。[#83344](https://github.com/ClickHouse/ClickHouse/pull/83344)（[scanhex12](https://github.com/scanhex12)）。
* 新增 SQL 语句 `EXECUTE AS`，支持以其他用户身份执行。解决 [#39048](https://github.com/ClickHouse/ClickHouse/issues/39048)。[#70775](https://github.com/ClickHouse/ClickHouse/pull/70775)（[Shankar](https://github.com/shiyer7474)）。
* 新增 `naiveBayesClassifier` 函数，使用基于 n-gram 的朴素贝叶斯方法对文本分类。[#88677](https://github.com/ClickHouse/ClickHouse/pull/88677)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 支持小数形式的 `LIMIT` 和 `OFFSET`，用于选择表中一定比例的数据。解决 [#81892](https://github.com/ClickHouse/ClickHouse/issues/81892)。[#88755](https://github.com/ClickHouse/ClickHouse/pull/88755)（[Ahmed Gouda](https://github.com/0xgouda)）。
* 新增面向 Microsoft OneLake 目录服务的 ClickHouse 子系统。[#89366](https://github.com/ClickHouse/ClickHouse/pull/89366)（[scanhex12](https://github.com/scanhex12)）。
* 新增 `flipCoordinates` 函数，展开数组所需的维度数，并交换 Tuple 列内部的指针。解决 [#79469](https://github.com/ClickHouse/ClickHouse/issues/79469)。[#79634](https://github.com/ClickHouse/ClickHouse/pull/79634)（[Sachin Kumar Singh](https://github.com/sachinkumarsingh092)）。
* 新增 `system.unicode` 表，包含 Unicode 字符及其属性列表。解决 [#80055](https://github.com/ClickHouse/ClickHouse/issues/80055)。[#80857](https://github.com/ClickHouse/ClickHouse/pull/80857)（[wxybear](https://github.com/wxybear)）。
* 新增 MergeTree 设置 `merge_max_dynamic_subcolumns_in_wide_part`，可以不受数据类型指定参数的影响，限制合并后 Wide 数据片段中的动态子列数。[#87646](https://github.com/ClickHouse/ClickHouse/pull/87646)（[Pavel Kruglov](https://github.com/Avogar)）。
* 支持窗口函数 `cume_dist`。修复 [#86920](https://github.com/ClickHouse/ClickHouse/issues/86920)。[#88102](https://github.com/ClickHouse/ClickHouse/pull/88102)（[Manuel](https://github.com/raimannma)）。
* 构建文本索引时，用户可以添加新参数 `preprocessor`，以任意表达式在分词前转换每个文档。[#88272](https://github.com/ClickHouse/ClickHouse/pull/88272)（[Jimmy Aguilar Mena](https://github.com/Ergus)）。
* 为 `X-ClickHouse-Progress` 和 `X-ClickHouse-Summary` 新增 `memory_usage` 字段，可用于在客户端实时收集查询内存占用。[#88393](https://github.com/ClickHouse/ClickHouse/pull/88393)（[Christoph Wurm](https://github.com/cwurm)）。
* 新增设置 `into_outfile_create_parent_directories`，自动为 `INTO OUTFILE` 创建父目录，避免输出路径不存在时出错，简化将查询结果写入嵌套目录的流程。解决 [#88610](https://github.com/ClickHouse/ClickHouse/issues/88610)。[#88795](https://github.com/ClickHouse/ClickHouse/pull/88795)（[Saksham](https://github.com/Saksham10-11)）。
* 临时表支持 `CREATE OR REPLACE` 语法。解决 [#35888](https://github.com/ClickHouse/ClickHouse/issues/35888)。[#89450](https://github.com/ClickHouse/ClickHouse/pull/89450)（[Aleksandr Musorin](https://github.com/AVMusorin)）。
* 支持 `arrayRemove`，从数组 `arr` 中移除所有等于 `elem` 的元素。这仅为兼容 Postgres 而提供，因为 ClickHouse 已有强大得多的 `arrayFilter` 函数。解决 [#52099](https://github.com/ClickHouse/ClickHouse/issues/52099)。[#89585](https://github.com/ClickHouse/ClickHouse/pull/89585)（[tiwarysaurav](https://github.com/tiwarysaurav)）。
* 新增计算平均值的标量函数 `midpoint`。解决 [#89029](https://github.com/ClickHouse/ClickHouse/issues/89029)。[#89679](https://github.com/ClickHouse/ClickHouse/pull/89679)（[simonmichal](https://github.com/simonmichal)）。
* Web UI 新增下载按钮，即使界面只显示部分结果，也会下载完整结果。[#89768](https://github.com/ClickHouse/ClickHouse/pull/89768)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 新增 `arrow_flight_request_descriptor_type` 设置，支持要求命令式描述符的 Dremio 及其他 Arrow Flight 服务器。实现 [#89523](https://github.com/ClickHouse/ClickHouse/issues/89523)。[#89826](https://github.com/ClickHouse/ClickHouse/pull/89826)（[Shreyas Ganesh](https://github.com/shreyasganesh0)）。
* 新增聚合函数 `argAndMin` 和 `argAndMax`，返回参数及其对应的极值。此前也可通过将元组用作参数来实现。[#89884](https://github.com/ClickHouse/ClickHouse/pull/89884)（[AbdAlRahman Gad](https://github.com/AbdAlRahmanGad)）。
* 新增写入和校验 Parquet 校验和的设置。[#79012](https://github.com/ClickHouse/ClickHouse/pull/79012)（[Michael Kolupaev](https://github.com/al13n321)）。
* 为 Kafka 表引擎新增 `kafka_schema_registry_skip_bytes` 设置，在解析消息载荷前跳过封装头字节，例如 AWS Glue Schema Registry 的 19 字节前缀，使 ClickHouse 可以消费带有元数据头的结构注册服务消息。[#89621](https://github.com/ClickHouse/ClickHouse/pull/89621)（[Taras Polishchuk](https://github.com/wake-up-neo)）。
* 新增 `h3PolygonToCells` 函数，可使用 H3 六边形填充几何区域。解决 [#33991](https://github.com/ClickHouse/ClickHouse/issues/33991)。[#66262](https://github.com/ClickHouse/ClickHouse/pull/66262)（[Zacharias Knudsen](https://github.com/zachasme)）。
* 新增虚拟列 `_tags`，类型为 `Map(String, String)`，包含 S3 中 blob 的全部标签。注意：如果 blob 没有标签，不会发送额外请求。解决 [#72945](https://github.com/ClickHouse/ClickHouse/issues/72945)。[#77773](https://github.com/ClickHouse/ClickHouse/pull/77773)（[Zicong Qu](https://github.com/zicongleoqu)）。

#### 实验性功能

* 支持从 Let's Encrypt 等 ACME 提供商获取 TLS 证书，见 [RFC 8555](https://datatracker.ietf.org/doc/html/rfc8555)，可为分布式集群自动配置 TLS。[#66315](https://github.com/ClickHouse/ClickHouse/pull/66315)（[Konstantin Bogdanov](https://github.com/thevar1able)）。
* 支持部分 Prometheus HTTP Query API。要启用，请在配置文件的 `<prometheus>` 部分添加类型为 `query_api` 的规则。支持的处理端点为 `/api/v1/query_range` 和 `/api/v1/query`。[#86132](https://github.com/ClickHouse/ClickHouse/pull/86132)（[Nikita Mikhaylov](https://github.com/nikitamikhaylov)）。
* 全文搜索从实验性阶段进入 Beta 阶段。[#88928](https://github.com/ClickHouse/ClickHouse/pull/88928)（[Robert Schulze](https://github.com/rschu1ze)）。
* 将 `Alias` 改为实验性功能，可通过 `allow_experimental_alias_table_engine = 1` 启用。[#89712](https://github.com/ClickHouse/ClickHouse/pull/89712)（[Kai Zhu](https://github.com/nauu)）。

#### 性能改进

* 默认启用 Parquet 读取器 v3。[#88827](https://github.com/ClickHouse/ClickHouse/pull/88827)（[Michael Kolupaev](https://github.com/al13n321)）。
* 分布式执行改为按行组 ID 而非文件划分任务，使任务分配更合理。[#87508](https://github.com/ClickHouse/ClickHouse/pull/87508)（[scanhex12](https://github.com/scanhex12)）。
* `RIGHT` 和 `FULL` JOIN 现在使用 ConcurrentHashJoin，以更高并行度运行，多个 RIGHT 和 FULL JOIN 场景最高提速至 2 倍。解决 [#78027](https://github.com/ClickHouse/ClickHouse/issues/78027)。[#78462](https://github.com/ClickHouse/ClickHouse/pull/78462)（[Yarik Briukhovetskyi](https://github.com/yariks5s)）。
* 优化查询中值较大的常量表达式。解决 [#72880](https://github.com/ClickHouse/ClickHouse/issues/72880)。[#81104](https://github.com/ClickHouse/ClickHouse/pull/81104)（[Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)）。
* 对于包含超过一万个数据片段的表，进行大量分区裁剪的 `SELECT` 查询最高提速至 8 倍。[#85535](https://github.com/ClickHouse/ClickHouse/pull/85535)（[James Morrison](https://github.com/jawm)）。
* 查询使用固定哈希表存储聚合状态时，例如按小整数分组，ClickHouse 会并行合并聚合状态以加快查询。[#87366](https://github.com/ClickHouse/ClickHouse/pull/87366)（[Jianfei Hu](https://github.com/incfly)）。
* 允许将选择 `_part_offset` 并使用不同 ORDER BY 的投影用作二级索引。启用后，部分查询谓词可用于读取投影数据片段并生成位图，在 PREWHERE 阶段高效过滤行。这是实现投影索引的第三步，延续 [#80343](https://github.com/ClickHouse/ClickHouse/issues/80343)。[#81021](https://github.com/ClickHouse/ClickHouse/pull/81021)（[Amos Bird](https://github.com/amosbird)）。
* 修复少见 Aarch64 系统以及可能的其他架构/内核组合上的 VDSO。[#86096](https://github.com/ClickHouse/ClickHouse/pull/86096)（[Tomas Hulata](https://github.com/tombokombo)）。
* 通过简化代码和调整 [选择算法](https://clickhouse.com/blog/lz4-compression-in-clickhouse#how-to-choose-the-best-algorithm)，提高 LZ4 解压缩速度。[#88360](https://github.com/ClickHouse/ClickHouse/pull/88360)（[Raúl Marín](https://github.com/Algunenano)）。
* S3 在内部基于对象键前缀对对象分区，并自动扩展以支持每个分区上的高请求率。新增两个 BACKUP 设置：data\_file\_name\_generator 和 data\_file\_name\_prefix\_length。当 data\_file\_name\_generator=checksum 时，备份数据文件以其内容哈希命名。例如，校验和为 `abcd1234ef567890abcd1234ef567890`，且 `data_file_name_prefix_length = 3` 时，生成路径为 `abc/d1234ef567890abcd1234ef567890`。这种键分布改善 S3 分区间的负载均衡，降低限流风险。[#88418](https://github.com/ClickHouse/ClickHouse/pull/88418)（[Julia Kartseva](https://github.com/jkartseva)）。
* 通过缓存词典块、使用哈希表代替二分搜索查找词元，提高文本索引性能。[#88786](https://github.com/ClickHouse/ClickHouse/pull/88786)（[Elmi Ahmadov](https://github.com/ahmadov)）。
* 查询现在可以同时受益于 `optimize_read_in_order` 和 `query_plan_optimize_lazy_materialization`。解决 [#88767](https://github.com/ClickHouse/ClickHouse/issues/88767)。[#88866](https://github.com/ClickHouse/ClickHouse/pull/88866)（[Manuel](https://github.com/raimannma)）。
* 对包含 `DISTINCT` 的查询使用聚合投影。解决 [#86925](https://github.com/ClickHouse/ClickHouse/issues/86925)。[#88894](https://github.com/ClickHouse/ClickHouse/pull/88894)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 缓存倒排列表，提高连续运行时的性能。[#88912](https://github.com/ClickHouse/ClickHouse/pull/88912)（[Elmi Ahmadov](https://github.com/ahmadov)）。
* 输入排序顺序与 LIMIT BY 键匹配时，执行流式 LIMIT BY 转换。[#88969](https://github.com/ClickHouse/ClickHouse/pull/88969)（[Eduard Karacharov](https://github.com/korowa)）。
* 允许在部分情况下将 `ANY LEFT JOIN` 或 `ANY RIGHT JOIN` 重写为 `ALL INNER JOIN`。[#89403](https://github.com/ClickHouse/ClickHouse/pull/89403)（[Dmitry Novik](https://github.com/novikd)）。
* 减少每条日志使用的原子操作，降低日志开销。[#89651](https://github.com/ClickHouse/ClickHouse/pull/89651)（[Sergei Trifonov](https://github.com/serxa)）。
* 多连接查询启用运行时过滤器并添加多个过滤器时，支持将新添加的过滤步骤下推到其他过滤步骤之前。[#89725](https://github.com/ClickHouse/ClickHouse/pull/89725)（[Alexander Gololobov](https://github.com/davenger)）。
* 降低哈希表合并开销，小幅加快部分 `uniqExact` 操作。[#89727](https://github.com/ClickHouse/ClickHouse/pull/89727)（[Raúl Marín](https://github.com/Algunenano)）。
* 将延迟物化的行数上限从 10 提高至 100。[#89772](https://github.com/ClickHouse/ClickHouse/pull/89772)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 默认启用 `allow_special_serialization_kinds_in_output_formats`，减少部分面向行的输出格式中 Sparse/Replicated 列的输出内存占用，并提高查询速度。[#89402](https://github.com/ClickHouse/ClickHouse/pull/89402)（[Pavel Kruglov](https://github.com/Avogar)）。
* 为 `ALTER TABLE ... FREEZE` 查询增加并行处理。[#71743](https://github.com/ClickHouse/ClickHouse/pull/71743)（[Kirill](https://github.com/kirillgarbar)）。
* 为 bcrypt 身份验证增加缓存。[#87115](https://github.com/ClickHouse/ClickHouse/pull/87115)（[Nikolay Degterinsky](https://github.com/evillique)）。
* 如果 `FINAL` 查询所用数据跳过索引的列属于主键，则不再执行检查其他数据片段中主键交集的额外步骤，因为此时不需要该检查。解决 [#85897](https://github.com/ClickHouse/ClickHouse/issues/85897)。[#88368](https://github.com/ClickHouse/ClickHouse/pull/88368)（[Shankar Iyer](https://github.com/shankar-iyer)）。
* 默认启用 `enable_lazy_columns_replication` 优化，减少连接内存占用。[#89316](https://github.com/ClickHouse/ClickHouse/pull/89316)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 为数据片段引入表级 `ColumnsDescription` 缓存，减少包含大量数据片段和列的表的内存占用。[#89352](https://github.com/ClickHouse/ClickHouse/pull/89352)（[Azat Khuzhin](https://github.com/azat)）。
* 新增文本索引反序列化头缓存，减少 I/O 并提高查询性能。可通过新服务器设置配置：- `text_index_header_cache_policy` - `text_index_header_cache_size` - `text_index_header_cache_max_entries` - `text_index_header_cache_size_ratio`。[#89513](https://github.com/ClickHouse/ClickHouse/pull/89513)（[Elmi Ahmadov](https://github.com/ahmadov)）。

#### 改进

* 设置 `use_variant_as_common_type` 时，UNION 应在需要时使用 `Variant` 统一类型。解决 [#82772](https://github.com/ClickHouse/ClickHouse/issues/82772)。[#83246](https://github.com/ClickHouse/ClickHouse/pull/83246)（[Mithun p](https://github.com/mithunputhusseri)）。
* 现在可以将 SQL 定义的角色授予在 `users.xml` 中定义的用户。[#88139](https://github.com/ClickHouse/ClickHouse/pull/88139)（[c-end](https://github.com/c-end)）。
* 记录内部查询，例如字典、可刷新物化视图等内部执行的查询，并为 `system.query_log` 新增 `is_internal` 列。[#83277](https://github.com/ClickHouse/ClickHouse/pull/83277)（[Miсhael Stetsyuk](https://github.com/mstetsyuk)）。
* 增强 `IS NOT DISTINCT FROM`（`<=>`）运算符：支持其反向形式 `IS DISTINCT FROM`，并支持不同类型的兼容数值操作数，例如 `Nullable(UInt32)` 和 `Nullable(Int64)`。解决 [#86763](https://github.com/ClickHouse/ClickHouse/issues/86763)。[#87581](https://github.com/ClickHouse/ClickHouse/pull/87581)（[yanglongwei](https://github.com/ylw510)）。
* 交互模式下的 `clickhouse-client` 和 `clickhouse-local` 会突出显示命令行中与光标当前所在标识符同名的标识符。[#89689](https://github.com/ClickHouse/ClickHouse/pull/89689)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 输出格式相关设置不再影响查询缓存；查询缓存也会忽略 `http_response_headers` 设置。这是为了支持 Web UI 从缓存下载结果等功能。[#89756](https://github.com/ClickHouse/ClickHouse/pull/89756)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 使用查询结果缓存时，HTTP 接口提供 `Age` 和 `Expires` 响应头。`Age` 的存在表示结果来自缓存，而 `Expires` 在首次写入时也会设置。新增性能分析事件：`QueryCacheAgeSeconds`、`QueryCacheReadRows`、`QueryCacheReadBytes`、`QueryCacheWrittenRows`、`QueryCacheWrittenBytes`。[#89759](https://github.com/ClickHouse/ClickHouse/pull/89759)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 启用 `disable_insertion_and_mutation` 时，允许向远程表和数据湖表插入数据，也就是支持 ClickHouse Cloud 中的只读计算仓库执行这些写入。[#88549](https://github.com/ClickHouse/ClickHouse/pull/88549)（[Alexander Tokmakov](https://github.com/tavplubix)）。
* 新增查询 `SYSTEM DROP TEXT INDEX CACHES`。[#90287](https://github.com/ClickHouse/ClickHouse/pull/90287)（[Anton Popov](https://github.com/CurtizJ)）。
* 默认启用 `enable_shared_storage_snapshot_in_query`，提供更好的一致性保证，预计没有负面影响。[#82634](https://github.com/ClickHouse/ClickHouse/pull/82634)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 新增 `send_profile_events` 设置，允许客户端在不使用性能分析事件时减少网络流量。[#89588](https://github.com/ClickHouse/ClickHouse/pull/89588)（[Kaviraj Kanagaraj](https://github.com/kavirajk)）。
* 允许按查询禁用相邻数据段的后台下载。修复 [#89524](https://github.com/ClickHouse/ClickHouse/issues/89524)。[#89668](https://github.com/ClickHouse/ClickHouse/pull/89668)（[tanner-bruce](https://github.com/tanner-bruce)）。
* 复制 MergeTree 表存在损坏磁盘时，允许执行 `FETCH PARTITION`。[#58663](https://github.com/ClickHouse/ClickHouse/pull/58663)（[Duc Canh Le](https://github.com/canhld94)）。
* 修复 MySQL 数据库引擎获取 MySQL 表结构时未捕获的异常。[#69358](https://github.com/ClickHouse/ClickHouse/pull/69358)（[Duc Canh Le](https://github.com/canhld94)）。
* 所有 DDL `ON CLUSTER` 查询现在使用原始查询用户上下文执行，以改进访问校验。[#71334](https://github.com/ClickHouse/ClickHouse/pull/71334)（[pufit](https://github.com/pufit)）。
* 支持 `Parquet` 中以逻辑类型 `UUID` 的 `FixedString(16)` 表示的 `UUID`。[#74484](https://github.com/ClickHouse/ClickHouse/pull/74484)（[alekseev-maksim](https://github.com/alekseev-maksim)）。
* 默认在非服务器二进制程序中禁用 ThreadFuzzer。[#89115](https://github.com/ClickHouse/ClickHouse/pull/89115)（[Raúl Marín](https://github.com/Algunenano)）。
* 通过推迟相关子查询输入子计划的物化，使其能够看到查询计划优化。属于 [#79890](https://github.com/ClickHouse/ClickHouse/issues/79890) 的一部分。[#85455](https://github.com/ClickHouse/ClickHouse/pull/85455)（[Dmitry Novik](https://github.com/novikd)）。
* 在 clickhouse-client 中，带 `SELECT` 的 `CREATE OR REPLACE TABLE` 查询可显示进度条、日志和性能统计。即使 `SELECT` 耗时较长，该查询也不再导致超时。解决 [#38416](https://github.com/ClickHouse/ClickHouse/issues/38416)。[#87247](https://github.com/ClickHouse/ClickHouse/pull/87247)（[Diskein](https://github.com/Diskein)）。
* 哈希函数支持 `JSON` 和 `Dynamic` 类型。解决 [#87734](https://github.com/ClickHouse/ClickHouse/issues/87734)。[#87791](https://github.com/ClickHouse/ClickHouse/pull/87791)（[Pavel Kruglov](https://github.com/Avogar)）。
* 实现 ArrowFlight 服务器缺失的部分。[#88013](https://github.com/ClickHouse/ClickHouse/pull/88013)（[Vitaly Baranov](https://github.com/vitlibar)）。
* 为服务器和 Keeper 新增多个直方图指标，测量 Keeper 请求各执行阶段的耗时。服务器新增：`keeper_client_queue_duration_milliseconds`、`keeper_client_send_duration_milliseconds`、`keeper_client_roundtrip_duration_milliseconds`。Keeper 新增：`keeper_server_preprocess_request_duration_milliseconds`、`keeper_server_process_request_duration_milliseconds`、`keeper_server_queue_duration_milliseconds`、`keeper_server_send_duration_milliseconds`。[#88158](https://github.com/ClickHouse/ClickHouse/pull/88158)（[Miсhael Stetsyuk](https://github.com/mstetsyuk)）。
* 为 `EXPLAIN` 查询新增 `input_headers` 选项，在步骤中显示输入头信息。[#88311](https://github.com/ClickHouse/ClickHouse/pull/88311)（[János Benjamin Antal](https://github.com/antaljanosbenjamin)）。
* 新增性能分析事件，统计被限流器延迟的 S3 和 AzureBlobStorage 请求数。修复磁盘相关和非磁盘相关 ThrottlerCount 性能分析事件不一致的问题。AzureBlobStorage HTTP DELETE 请求现在不再限流。[#88535](https://github.com/ClickHouse/ClickHouse/pull/88535)（[Sergei Trifonov](https://github.com/serxa)）。
* 缓存表级统计信息，并新增两个设置：MergeTree 设置 `refresh_statistics_interval` 表示统计缓存刷新间隔，0 表示不创建缓存；会话设置 `use_statistics_cache` 控制查询是否使用表级统计信息。有时为了获得更准确的统计信息，会选择忽略缓存。[#88670](https://github.com/ClickHouse/ClickHouse/pull/88670)（[Han Fei](https://github.com/hanfei1991)）。
* 修复 `Array` 和 `Map` 二进制反序列化的大小上限校验，改用 `max_binary_array_size` 而非 `max_binary_string_size`，确保读取 `RowBinary` 格式时应用正确限制。[#88744](https://github.com/ClickHouse/ClickHouse/pull/88744)（[Raufs Dunamalijevs](https://github.com/rienath)）。
* 新增 `LockGuardWithStopWatch` 类并用于执行合并的后台池。如果互斥锁被持有一秒，或线程在一秒内仍未获取锁，则输出警告。将 `MergeMutateSelectedEntry` 析构函数中的繁重代码移至 `finalize` 方法，避免在 `MergeTreeBackground` 执行器中持锁过久。[#88898](https://github.com/ClickHouse/ClickHouse/pull/88898)（[Nikita Mikhaylov](https://github.com/nikitamikhaylov)）。
* 端点未指定区域时，允许 S3 自动使用需要显式启用的 AWS 区域。参考 [需显式启用的 AWS 区域](https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-regions.html)。[#88930](https://github.com/ClickHouse/ClickHouse/pull/88930)（[Andrey Zvonov](https://github.com/zvonand)）。
* 分页器运行时，用户可在 clickhouse-client 中按 Ctrl-C 取消查询。解决 [#80778](https://github.com/ClickHouse/ClickHouse/issues/80778)。[#88935](https://github.com/ClickHouse/ClickHouse/pull/88935)（[Grigorii](https://github.com/GSokol)）。
* Web UI 表格现在也为负值显示条形，因此能用不同颜色在正负两侧显示双向条形图。[#89016](https://github.com/ClickHouse/ClickHouse/pull/89016)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 禁用 `shared_merge_tree_create_per_replica_metadata_nodes`，减少 `SharedMergeTree` 在 Keeper 中存储的元数据量。[#89036](https://github.com/ClickHouse/ClickHouse/pull/89036)（[Alexander Tokmakov](https://github.com/tavplubix)）。
* 使 `S3Queue` 遵循服务器设置 `disable_insertion_and_mutation`。[#89048](https://github.com/ClickHouse/ClickHouse/pull/89048)（[Raúl Marín](https://github.com/Algunenano)）。
* 为 25.6 将默认 `s3_retry_attempts` 设为 500，确保 S3 重新分区、连续超过 10 分钟返回降速错误时，备份仍能成功。[#89051](https://github.com/ClickHouse/ClickHouse/pull/89051)（[Nikita Mikhaylov](https://github.com/nikitamikhaylov)）。
* 两个 Kafka 引擎现在都可通过 `kafka_compression_codec` 和 `kafka_compression_level` 指定 Kafka 生产者使用的压缩方式。[#89073](https://github.com/ClickHouse/ClickHouse/pull/89073)（[János Benjamin Antal](https://github.com/antaljanosbenjamin)）。
* 为 `system.columns` 新增 `statistics` 列，表示此表上已构建的统计信息类型。自动创建的统计信息类型会显示 (auto) 后缀。[#89086](https://github.com/ClickHouse/ClickHouse/pull/89086)（[Han Fei](https://github.com/hanfei1991)）。
* 向 `*Cluster` 表函数传入通用展开表达式而非集群名称时，改进错误消息。[#89093](https://github.com/ClickHouse/ClickHouse/pull/89093)（[Konstantin Bogdanov](https://github.com/thevar1able)）。
* YTsaurus：允许使用 replicated\_table 作为数据源。[#89107](https://github.com/ClickHouse/ClickHouse/pull/89107)（[MikhailBurdukov](https://github.com/MikhailBurdukov)）。
* CLI 不再将以空白字符开头的查询保存到历史记录。[#89116](https://github.com/ClickHouse/ClickHouse/pull/89116)（[Konstantin Bogdanov](https://github.com/thevar1able)）。
* `hasAnyTokens` 和 `hasAllTokens` 函数支持以字符串数组作为输入。[#89124](https://github.com/ClickHouse/ClickHouse/pull/89124)（[Elmi Ahmadov](https://github.com/ahmadov)）。
* 修改 plain-rewritable 磁盘在内存中存储元数据的方式，解决大量目录嵌套及相关错误。[#89125](https://github.com/ClickHouse/ClickHouse/pull/89125)（[Mikhail Artemenko](https://github.com/Michicosun)）。
* 查询 Iceberg 表时，IN 表达式中的子查询会在分区裁剪分析之前正确预计算。[#89177](https://github.com/ClickHouse/ClickHouse/pull/89177)（[Daniil Ivanik](https://github.com/divanik)）。
* 默认启用 `create_table_empty_primary_key_by_default`，改善易用性。[#89333](https://github.com/ClickHouse/ClickHouse/pull/89333)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 `Backup` 数据库引擎中的错误代码：此前执行 `SHOW CREATE DATABASE` 或从 `system.databases` 查询 `engine_full` 时可能生成无效查询。解决 [#89477](https://github.com/ClickHouse/ClickHouse/issues/89477)。[#89341](https://github.com/ClickHouse/ClickHouse/pull/89341)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 CREATE TABLE 查询未指定表引擎时，`create_table_empty_primary_key_by_default` 设置不生效的问题。[#89342](https://github.com/ClickHouse/ClickHouse/pull/89342)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 将 `chdig` 更新至 v25.11.1，包含日志记录方面的重大改进及多项增强（[25.11 发布说明](https://github.com/azat/chdig/releases/tag/v25.11.1)）。[#89957](https://github.com/ClickHouse/ClickHouse/pull/89957)（[Azat Khuzhin](https://github.com/azat)）。（[25.10 发布说明](https://github.com/azat/chdig/releases/tag/v25.10.1)）。[#89452](https://github.com/ClickHouse/ClickHouse/pull/89452)（[Azat Khuzhin](https://github.com/azat)）。
* 将 Web UI 查询文本框的大小调整控件扩展为全宽，使其更易用。此外，iPad 上的 Safari 原先没有浏览器原生调整控件；此变更后，知道这一操作的用户至少可以拖动文本框底部。[#89457](https://github.com/ClickHouse/ClickHouse/pull/89457)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 改进哈希连接结果生成过程中的内存跟踪。此前没有正确跟踪临时分配，可能导致超出内存限制。[#89560](https://github.com/ClickHouse/ClickHouse/pull/89560)（[Azat Khuzhin](https://github.com/azat)）。
* 异步服务器日志更早刷新，并增大默认队列容量。[#89597](https://github.com/ClickHouse/ClickHouse/pull/89597)（[Raúl Marín](https://github.com/Algunenano)）。
* 修复 `system.asynchronous_metrics` 中错误的 `FilesystemCacheBytes` 等指标。文件系统缓存上的 `SYSTEM` 查询只执行一次；在 `system.filesystem_caches` 中为指向同一路径的缓存提供原子视图。[#89640](https://github.com/ClickHouse/ClickHouse/pull/89640)（[Azat Khuzhin](https://github.com/azat)）。
* 澄清 `system.view_refreshes` 中部分列的描述。[#89701](https://github.com/ClickHouse/ClickHouse/pull/89701)（[Tuan Pham Anh](https://github.com/tuanpach)）。
* 缓存通过 STS 端点获取的 S3 凭据，供不同函数调用复用；缓存凭据数量由 `s3_credentials_provider_max_cache_size` 控制。[#89734](https://github.com/ClickHouse/ClickHouse/pull/89734)（[Antonio Andelic](https://github.com/antonio2368)）。
* 修复运行时过滤器下方有多个表达式步骤时的过滤器下推。[#89741](https://github.com/ClickHouse/ClickHouse/pull/89741)（[Alexander Gololobov](https://github.com/davenger)）。
* 系统内存低于 5 GB 时，默认不对可执行文件执行 mlock。[#89751](https://github.com/ClickHouse/ClickHouse/pull/89751)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* Web UI 的类型提示不再溢出到表头中，也修复了工具提示显示在表头后方的问题。[#89753](https://github.com/ClickHouse/ClickHouse/pull/89753)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 在 Web UI 中显示表属性。点击行数或字节数会打开查询 `system.tables` 的语句；点击表引擎会打开 `SHOW TABLES`。[#89771](https://github.com/ClickHouse/ClickHouse/pull/89771)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 对于磁盘不支持追加写入的表，支持 `non_replicated_deduplication_window`。解决 [#87281](https://github.com/ClickHouse/ClickHouse/issues/87281)。[#89796](https://github.com/ClickHouse/ClickHouse/pull/89796)（[Tuan Pham Anh](https://github.com/tuanpach)）。
* 支持在 `SYSTEM FLUSH ASYNC INSERT QUEUE` 命令中指定要刷新的表列表。[#89915](https://github.com/ClickHouse/ClickHouse/pull/89915)（[Sema Checherinda](https://github.com/CheSema)）。
* 在 `system.part_log` 中存储去重数据块 ID。[#89928](https://github.com/ClickHouse/ClickHouse/pull/89928)（[Sema Checherinda](https://github.com/CheSema)）。
* 将文件系统缓存设置 `keep_free_space_remove_batch` 的默认值从 10 改为 100，以改善效率。[#90030](https://github.com/ClickHouse/ClickHouse/pull/90030)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 引入 TTL DROP 合并类型，此类合并之后不更新下一次删除 TTL 合并的调度时间。[#90077](https://github.com/ClickHouse/ClickHouse/pull/90077)（[Mikhail Artemenko](https://github.com/Michicosun)）。
* S3Queue 清理期间，为 Keeper 的 RemoveRecursive 请求使用更低的节点上限。[#90201](https://github.com/ClickHouse/ClickHouse/pull/90201)（[Antonio Andelic](https://github.com/antonio2368)）。
* 即使日志为空，`SYSTEM FLUSH LOGS` 查询也等待表创建完成。[#89408](https://github.com/ClickHouse/ClickHouse/pull/89408)（[János Benjamin Antal](https://github.com/antaljanosbenjamin)）。
* 修复多个远程分片参与分布式合并聚合，或存在 IN 子查询时，`rows_before_limit_at_least` 不正确的问题。修复 [#63280](https://github.com/ClickHouse/ClickHouse/issues/63280)。[#63511](https://github.com/ClickHouse/ClickHouse/pull/63511)（[Amos Bird](https://github.com/amosbird)）。
* 修复 `INSERT INTO ... SELECT` 查询后显示 `0 rows in set` 的问题。解决 [#47800](https://github.com/ClickHouse/ClickHouse/issues/47800)。[#79462](https://github.com/ClickHouse/ClickHouse/pull/79462)（[Engel Danila](https://github.com/aaaengel)）。

#### 错误修复（正式稳定版本中用户可见的异常行为）

* 修复 `multiIf` 对常量参数和短路求值的处理。解决 [#72714](https://github.com/ClickHouse/ClickHouse/issues/72714)。[#84546](https://github.com/ClickHouse/ClickHouse/pull/84546)（[Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)）。
* 修复从带有子查询约束的表中查询时的逻辑错误。解决 [#84190](https://github.com/ClickHouse/ClickHouse/issues/84190)。[#85575](https://github.com/ClickHouse/ClickHouse/pull/85575)（[Pervakov Grigorii](https://github.com/GrigoryPervakov)）。
* 修复使用含问号 URI 的特殊查询的问题。[#85663](https://github.com/ClickHouse/ClickHouse/pull/85663)（[Yarik Briukhovetskyi](https://github.com/yariks5s)）。
* 修复 `EXPLAIN indexes = 1` 输出有时缺少列的问题。解决 [#86696](https://github.com/ClickHouse/ClickHouse/issues/86696)。[#87083](https://github.com/ClickHouse/ClickHouse/pull/87083)（[Michael Kolupaev](https://github.com/al13n321)）。
* 修复并行副本可能出现的 Cannot add subcolumn 错误。解决 [#84888](https://github.com/ClickHouse/ClickHouse/issues/84888)。[#87514](https://github.com/ClickHouse/ClickHouse/pull/87514)（[Pavel Kruglov](https://github.com/Avogar)）。
* Parquet 写入器按正确格式输出 `created_by` 字符串，例如 `ClickHouse version 25.10.1 (build 5b1dfb14925db8901a4e9202cd5d63c11ecfbb9f)`，而非 `ClickHouse v25.9.1.1-testing`。修复 Parquet 读取器与旧 parquet-mr 写出的异常文件的兼容性。[#87735](https://github.com/ClickHouse/ClickHouse/pull/87735)（[Michael Kolupaev](https://github.com/al13n321)）。
* 修复 phi 平方计算，避免 `cramersV`、`cramersVBiasCorrected`、`theilsU` 和 `contingency` 结果不正确。[#87831](https://github.com/ClickHouse/ClickHouse/pull/87831)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 修复读取 JSON 中混合浮点数和布尔值的数组的问题，此前插入这类数据会抛出异常。[#88008](https://github.com/ClickHouse/ClickHouse/pull/88008)（[Pavel Kruglov](https://github.com/Avogar)）。
* 在 TCPHandler 中为 QueryState 使用 shared\_ptr，以在 setProgressCallback、setFileProgressCallback 和 setBlockMarshallingCallback 中检测状态是否无效。[#88201](https://github.com/ClickHouse/ClickHouse/pull/88201)（[Tuan Pham Anh](https://github.com/tuanpach)）。
* 修复 query\_plan\_optimize\_join\_order\_limit > 1 时交叉连接重排的逻辑错误。解决 [#89409](https://github.com/ClickHouse/ClickHouse/issues/89409)。[#88286](https://github.com/ClickHouse/ClickHouse/pull/88286)（[Vladimir Cherkasov](https://github.com/vdimir)）。
* 修复 [#88426](https://github.com/ClickHouse/ClickHouse/issues/88426)：1. 禁止在 Alias 中显式定义列，改为从目标表自动加载，确保别名始终匹配目标表结构。2. 代理 IStorage 的更多方法。[#88552](https://github.com/ClickHouse/ClickHouse/pull/88552)（[Kai Zhu](https://github.com/nauu)）。
* 修复 Replicated 数据库副本恢复后可能长时间卡住，并输出 `Failed to marked query-0004647339 as finished (finished=No node, synced=No node)` 等消息的问题。[#88671](https://github.com/ClickHouse/ClickHouse/pull/88671)（[Alexander Tokmakov](https://github.com/tavplubix)）。
* 修复新分析器处理子查询时可能出现的“Context has expired”错误。[#88694](https://github.com/ClickHouse/ClickHouse/pull/88694)（[Azat Khuzhin](https://github.com/azat)）。
* 修复 input\_format\_parquet\_local\_file\_min\_bytes\_for\_seek 为 0 时 Parquet 读取器发生段错误的问题。解决 [#78456](https://github.com/ClickHouse/ClickHouse/issues/78456)。[#88784](https://github.com/ClickHouse/ClickHouse/pull/88784)（[Animesh](https://github.com/anibilthare)）。
* 修复主键逆序时 min(PK)/max(PK) 结果不正确的问题。修复 [#83619](https://github.com/ClickHouse/ClickHouse/issues/83619)。[#88796](https://github.com/ClickHouse/ClickHouse/pull/88796)（[Amos Bird](https://github.com/amosbird)）。
* 修复 DROP 内部表时未正确传递 max\_table\_size\_to\_drop 和 max\_partition\_size\_to\_drop 大小限制的问题。[#88812](https://github.com/ClickHouse/ClickHouse/pull/88812)（[Nikolay Degterinsky](https://github.com/evillique)）。
* 修复 `top_k` 仅传入一个参数时未遵循阈值参数的问题。解决 [#88757](https://github.com/ClickHouse/ClickHouse/issues/88757)。[#88867](https://github.com/ClickHouse/ClickHouse/pull/88867)（[Manuel](https://github.com/raimannma)）。
* 要求 SSL 连接的 ArrowFlight 端点数据源，例如位于 AWS ALB 后方的端点，现在能够正确请求指定数据集。[#88868](https://github.com/ClickHouse/ClickHouse/pull/88868)（[alex-shchetkov](https://github.com/alex-shchetkov)）。
* 修复通过 ALTER 添加、尚未物化的 Nested(Tuple(...)) 的处理。修复 [#83133](https://github.com/ClickHouse/ClickHouse/issues/83133)。[#88879](https://github.com/ClickHouse/ClickHouse/pull/88879)（[Azat Khuzhin](https://github.com/azat)）。
* 修复 `reverseUTF8` 函数的错误：此前会错误地反转长度为 4 的 UTF-8 码点内部字节。解决 [#88913](https://github.com/ClickHouse/ClickHouse/issues/88913)。[#88914](https://github.com/ClickHouse/ClickHouse/pull/88914)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 icebergS3Cluster 协议；Iceberg 集群函数开始支持结构演进、位置删除和等值删除。解决 [#88287](https://github.com/ClickHouse/ClickHouse/issues/88287)。[#88919](https://github.com/ClickHouse/ClickHouse/pull/88919)（[Yang Jiang](https://github.com/Ted-Jiang)）。
* 对分布式表使用并行副本的查询禁用 parallel\_replicas\_support\_projection。解决 [#88899](https://github.com/ClickHouse/ClickHouse/issues/88899)。[#88922](https://github.com/ClickHouse/ClickHouse/pull/88922)（[zoomxi](https://github.com/zoomxi)）。
* 在内部类型转换中传递上下文，修复多项类型转换设置未传递的问题。解决 [#88873](https://github.com/ClickHouse/ClickHouse/issues/88873) 和 [#78025](https://github.com/ClickHouse/ClickHouse/issues/78025)。[#88929](https://github.com/ClickHouse/ClickHouse/pull/88929)（[Manuel](https://github.com/raimannma)）。
* 修复 file() 函数从通配模式中确定文件格式的问题。解决 [#88920](https://github.com/ClickHouse/ClickHouse/issues/88920)。[#88947](https://github.com/ClickHouse/ClickHouse/pull/88947)（[Vitaly Baranov](https://github.com/vitlibar)）。
* 创建 SQL SECURITY DEFINER 视图时，不检查 `SET DEFINER <current_user>:definer` 权限。[#88968](https://github.com/ClickHouse/ClickHouse/pull/88968)（[pufit](https://github.com/pufit)）。
* 修复 `L2DistanceTransposed(vec1, vec2, p)` 中的 `LOGICAL_ERROR`：当 `p` 为 `Nullable` 时，针对 `QBit` 部分读取的优化错误地从返回类型中移除了 `Nullable`。[#88974](https://github.com/ClickHouse/ClickHouse/pull/88974)（[Raufs Dunamalijevs](https://github.com/rienath)）。
* 修复目录服务类型未知时的崩溃。解决 [#88819](https://github.com/ClickHouse/ClickHouse/issues/88819)。[#88987](https://github.com/ClickHouse/ClickHouse/pull/88987)（[scanhex12](https://github.com/scanhex12)）。
* 解决 [#88081](https://github.com/ClickHouse/ClickHouse/issues/88081)。[#88988](https://github.com/ClickHouse/ClickHouse/pull/88988)（[scanhex12](https://github.com/scanhex12)）。
* 修复数据跳过索引分析的性能退化。[#89004](https://github.com/ClickHouse/ClickHouse/pull/89004)（[Anton Popov](https://github.com/CurtizJ)）。
* 修复具有不存在角色的用户执行 clusterAllReplicas 时出现的 ACCESS\_ENTITY\_NOT\_FOUND 错误。解决 [#87670](https://github.com/ClickHouse/ClickHouse/issues/87670)。[#89068](https://github.com/ClickHouse/ClickHouse/pull/89068)（[pufit](https://github.com/pufit)）。
* 修复 CHECK 约束对稀疏列的处理。解决 [#88637](https://github.com/ClickHouse/ClickHouse/issues/88637)。[#89076](https://github.com/ClickHouse/ClickHouse/pull/89076)（[Eduard Karacharov](https://github.com/korowa)）。
* 修复 MergeTreeReaderTextIndex 填充虚拟列时行数不正确、导致 LOGICAL\_ERROR 崩溃的问题。[#89095](https://github.com/ClickHouse/ClickHouse/pull/89095)（[Peng Jian](https://github.com/fastio)）。
* 防止合并准备期间出现异常时 TTL 合并计数器泄漏。解决 [#89019](https://github.com/ClickHouse/ClickHouse/issues/89019)。[#89127](https://github.com/ClickHouse/ClickHouse/pull/89127)（[save-my-heart](https://github.com/save-my-heart)）。
* 修复 base32/base58 编码和解码操作所需缓冲区大小的计算。[#89133](https://github.com/ClickHouse/ClickHouse/pull/89133)（[Antonio Andelic](https://github.com/antonio2368)）。
* 修复 Distributed 中关闭与后台 INSERT 竞争导致的释放后使用问题。解决 [#88640](https://github.com/ClickHouse/ClickHouse/issues/88640)。[#89136](https://github.com/ClickHouse/ClickHouse/pull/89136)（[Azat Khuzhin](https://github.com/azat)）。
* 避免解析 Parquet 时因可变异常对象导致的数据竞争。修复 [#88385](https://github.com/ClickHouse/ClickHouse/issues/88385)。[#89174](https://github.com/ClickHouse/ClickHouse/pull/89174)（[Azat Khuzhin](https://github.com/azat)）。
* 可刷新物化视图：修复刷新期间源表被完全删除时偶发的服务器崩溃。[#89203](https://github.com/ClickHouse/ClickHouse/pull/89203)（[Michael Kolupaev](https://github.com/al13n321)）。
* HTTP 接口在压缩流中途发送错误时刷新缓冲区。[#89256](https://github.com/ClickHouse/ClickHouse/pull/89256)（[Alexander Tokmakov](https://github.com/tavplubix)）。
* 避免查询脱敏规则被错误应用于 DDL 语句。[#89272](https://github.com/ClickHouse/ClickHouse/pull/89272)（[MikhailBurdukov](https://github.com/MikhailBurdukov)）。
* 修复 MergeTreeReaderTextIndex 填充虚拟列时行数不正确、导致 LOGICAL\_ERROR 崩溃的问题。重新打开 [#89095](https://github.com/ClickHouse/ClickHouse/issues/89095)。[#89303](https://github.com/ClickHouse/ClickHouse/pull/89303)（[Jimmy Aguilar Mena](https://github.com/Ergus)）。
* 修复统计信息 countmin 不支持估算 LowCardinality(Nullable(String)) 数据类型时的 LOGICAL\_ERROR。[#89343](https://github.com/ClickHouse/ClickHouse/pull/89343)（[Han Fei](https://github.com/hanfei1991)）。
* 修复 IN 函数中主键列类型与右侧列类型不同时可能出现的崩溃或未定义行为。例如：SELECT string\_column, int\_column FROM test\_table WHERE (string\_column, int\_column) IN (SELECT '5', 'not a number')。选中大量行且其中有类型不兼容的行时会出现此问题。[#89367](https://github.com/ClickHouse/ClickHouse/pull/89367)（[Ilya Golshtein](https://github.com/ilejn)）。
* 修复 `countIf(*)` 参数被截断的问题。解决 [#89372](https://github.com/ClickHouse/ClickHouse/issues/89372)。[#89373](https://github.com/ClickHouse/ClickHouse/pull/89373)（[Manuel](https://github.com/raimannma)）。
* 避免变更操作中丢失统计信息的未压缩校验和。[#89381](https://github.com/ClickHouse/ClickHouse/pull/89381)（[Azat Khuzhin](https://github.com/azat)）。
* 修复 L2DistanceTransposed(vec1, vec2, p) 中的 LOGICAL\_ERROR：当 p 为 LowCardinality(Nullable(T)) 时，QBit 部分读取优化错误地从返回类型中移除了 Nullable。解决 [#88362](https://github.com/ClickHouse/ClickHouse/issues/88362)。[#89397](https://github.com/ClickHouse/ClickHouse/pull/89397)（[Raufs Dunamalijevs](https://github.com/rienath)）。
* 修复加载元组本身带有不正确稀疏序列化的表的问题，这类序列化由旧 ClickHouse 版本写入。[#89405](https://github.com/ClickHouse/ClickHouse/pull/89405)（[Azat Khuzhin](https://github.com/azat)）。
* 修复使用 `deduplicate_merge_projection_mode='ignore'` 时，对被 TTL 清空但投影非空的数据片段的错误合并处理。解决 [#89430](https://github.com/ClickHouse/ClickHouse/issues/89430)。[#89458](https://github.com/ClickHouse/ClickHouse/pull/89458)（[Amos Bird](https://github.com/amosbird)）。
* 修复 full\_sorting\_merge 连接包含重复列时的逻辑错误。解决 [#86957](https://github.com/ClickHouse/ClickHouse/issues/86957)。[#89495](https://github.com/ClickHouse/ClickHouse/pull/89495)（[Vladimir Cherkasov](https://github.com/vdimir)）。
* 修复 Keeper 启动时读取轮转期间未正确重命名的变更日志的问题。[#89496](https://github.com/ClickHouse/ClickHouse/pull/89496)（[Antonio Andelic](https://github.com/antonio2368)）。
* 修复右表键唯一且使用 OR 条件时 JOIN 结果不正确的问题。解决 [#89391](https://github.com/ClickHouse/ClickHouse/issues/89391)。[#89512](https://github.com/ClickHouse/ClickHouse/pull/89512)（[Vladimir Cherkasov](https://github.com/vdimir)）。
* 修复分析器与 PK IN (subquery) 组合可能出现的“Context has expired”错误（v2）。修复 [#89433](https://github.com/ClickHouse/ClickHouse/issues/89433)。[#89527](https://github.com/ClickHouse/ClickHouse/pull/89527)（[Azat Khuzhin](https://github.com/azat)）。
* 修复配置了大写列名的表的 MaterializedPostgreSQL 复制。解决 [#72363](https://github.com/ClickHouse/ClickHouse/issues/72363)。[#89530](https://github.com/ClickHouse/ClickHouse/pull/89530)（[Danylo Osipchuk](https://github.com/Lenivaya)）。
* 修复聚合函数状态包含 LowCardinality(String) 列序列化值时的崩溃。[#89550](https://github.com/ClickHouse/ClickHouse/pull/89550)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复启用 `enable_lazy_columns_replication` 时，在 JOIN 右侧使用 `ARRAY JOIN` 导致的崩溃。[#89551](https://github.com/ClickHouse/ClickHouse/pull/89551)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复 query\_plan\_convert\_join\_to\_in 的逻辑错误。解决 [#89066](https://github.com/ClickHouse/ClickHouse/issues/89066)。[#89554](https://github.com/ClickHouse/ClickHouse/pull/89554)（[Vladimir Cherkasov](https://github.com/vdimir)）。
* 修复统计估算器尝试估算列与常量类型不匹配且无法转换的条件时的异常。[#89596](https://github.com/ClickHouse/ClickHouse/pull/89596)（[Han Fei](https://github.com/hanfei1991)）。
* 仅为支持的连接算法，即哈希连接，添加运行时过滤器。只有先完整读取右侧、再读取左侧的连接算法才能构建过滤器；例如 FullSortingMergeJoin 会同时读取两侧。修复 [#89220](https://github.com/ClickHouse/ClickHouse/issues/89220)。[#89652](https://github.com/ClickHouse/ClickHouse/pull/89652)（[Alexander Gololobov](https://github.com/davenger)）。
* 修复 `hasAnyTokens`、`hasAllTokens` 和 `tokens` 函数使用 `sparseGrams` 分词器并发执行的问题。解决 [#89605](https://github.com/ClickHouse/ClickHouse/issues/89605)。[#89665](https://github.com/ClickHouse/ClickHouse/pull/89665)（[Elmi Ahmadov](https://github.com/ahmadov)）。
* 修复部分情况下连接运行时过滤器导致的逻辑错误或崩溃。修复 [#89062](https://github.com/ClickHouse/ClickHouse/issues/89062)。[#89666](https://github.com/ClickHouse/ClickHouse/pull/89666)（[Alexander Gololobov](https://github.com/davenger)）。
* 修复启用 `enable_lazy_columns_replication` 时，对 Map 列执行 ARRAY JOIN 可能出现的逻辑错误。解决 [#89705](https://github.com/ClickHouse/ClickHouse/issues/89705)。[#89717](https://github.com/ClickHouse/ClickHouse/pull/89717)（[Pavel Kruglov](https://github.com/Avogar)）。
* 避免取消远程查询期间，断开连接后仍从远程服务器读取而导致崩溃。解决 [#89468](https://github.com/ClickHouse/ClickHouse/issues/89468)。[#89740](https://github.com/ClickHouse/ClickHouse/pull/89740)（[Azat Khuzhin](https://github.com/azat)）。
* 修复投影索引读取路径中的竞争条件。解决 [#89497](https://github.com/ClickHouse/ClickHouse/issues/89497)。[#89762](https://github.com/ClickHouse/ClickHouse/pull/89762)（[Peng Jian](https://github.com/fastio)）。
* 修复投影索引读取中可能引起竞争条件的错误。解决 [#89497](https://github.com/ClickHouse/ClickHouse/issues/89497)。[#89775](https://github.com/ClickHouse/ClickHouse/pull/89775)（[Amos Bird](https://github.com/amosbird)）。
* 修复 Paimon 表函数对无分区表的处理。解决 [#89690](https://github.com/ClickHouse/ClickHouse/issues/89690)。[#89793](https://github.com/ClickHouse/ClickHouse/pull/89793)（[JIaQi](https://github.com/JiaQiTang98)）。
* 修复高级 JSON 共享数据序列化中，读取路径及其子列时可能出现的逻辑错误。解决 [#89805](https://github.com/ClickHouse/ClickHouse/issues/89805)。[#89819](https://github.com/ClickHouse/ClickHouse/pull/89819)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复数据类型二进制反序列化时可能发生的栈溢出。解决 [#88710](https://github.com/ClickHouse/ClickHouse/issues/88710)。[#89822](https://github.com/ClickHouse/ClickHouse/pull/89822)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复 `IN` 函数内部包含空元组时的逻辑错误。解决 [#88343](https://github.com/ClickHouse/ClickHouse/issues/88343)。[#89850](https://github.com/ClickHouse/ClickHouse/pull/89850)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 为保持兼容，旧分析器无论是否设置 `optimize_injective_functions_in_group_by`，都会从 `GROUP BY` 中移除单射函数。解决 [#89854](https://github.com/ClickHouse/ClickHouse/issues/89854)。[#89870](https://github.com/ClickHouse/ClickHouse/pull/89870)（[Raufs Dunamalijevs](https://github.com/rienath)）。
* 如果合并因内存限制等原因中断，合并与变更后台执行器会在未持锁时对合并任务调用 `cancel`，但此时部分创建的结果数据片段不会被移除，因为尚未完成且在此阶段不可见。随后合并任务销毁，触发结果数据片段销毁，回滚磁盘事务并从 S3 移除数据。最终，这部分垃圾清理是在合并与变更后台执行器锁内执行的。[#89875](https://github.com/ClickHouse/ClickHouse/pull/89875)（[Mikhail Artemenko](https://github.com/Michicosun)）。
* 修复 `reverse` 和 `CAST` 函数内部包含空元组时的逻辑错误。解决 [#89137](https://github.com/ClickHouse/ClickHouse/issues/89137)。[#89908](https://github.com/ClickHouse/ClickHouse/pull/89908)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* `SHOW DATABASES` 查询现在默认显示数据湖目录服务数据库。[#89914](https://github.com/ClickHouse/ClickHouse/pull/89914)（[alesapin](https://github.com/alesapin)）。
* 修复备份在 GCS 上使用原生复制的问题。此前客户端克隆错误导致 GCS 原生复制总是失败，退回到效率较低的手动读写数据方式。[#89923](https://github.com/ClickHouse/ClickHouse/pull/89923)（[Antonio Andelic](https://github.com/antonio2368)）。
* 修复 base32Encode 缓冲区大小计算；对长度小于 5 的字符串列计算 base32Encode 可能导致崩溃。解决 [#89911](https://github.com/ClickHouse/ClickHouse/issues/89911)。[#89929](https://github.com/ClickHouse/ClickHouse/pull/89929)（[Antonio Andelic](https://github.com/antonio2368)）。
* 修复 `SHOW COLUMNS` 和 `SHOW FUNCTIONS` 查询的错误转义。[#89942](https://github.com/ClickHouse/ClickHouse/pull/89942)（[alesapin](https://github.com/alesapin)）。
* 修复 MongoDB 引擎用户名含 '@' 字符时的 URL 校验。此前此类用户名会因编码不正确而出错。[#89970](https://github.com/ClickHouse/ClickHouse/pull/89970)（[Kai Zhu](https://github.com/nauu)）。
* 已在 [#90592](https://github.com/ClickHouse/ClickHouse/issues/90592) 中回移：修复远程查询中在 `IN` 内使用 `ARRAY JOIN`，且启用 `enable_lazy_columns_replication` 时可能发生的崩溃。解决 [#90361](https://github.com/ClickHouse/ClickHouse/issues/90361)。[#89997](https://github.com/ClickHouse/ClickHouse/pull/89997)（[Pavel Kruglov](https://github.com/Avogar)）。
* 已在 [#90448](https://github.com/ClickHouse/ClickHouse/issues/90448) 中回移：修复部分情况下从文本格式的 String 推断出无效 DateTime64 值的问题。解决 [#89368](https://github.com/ClickHouse/ClickHouse/issues/89368)。[#90013](https://github.com/ClickHouse/ClickHouse/pull/90013)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复 `BSONEachRow` 和 `MsgPack` 中空元组列导致的逻辑错误。解决 [#89814](https://github.com/ClickHouse/ClickHouse/issues/89814) 和 [#71536](https://github.com/ClickHouse/ClickHouse/issues/71536)。[#90018](https://github.com/ClickHouse/ClickHouse/pull/90018)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 已在 [#90457](https://github.com/ClickHouse/ClickHouse/issues/90457) 中回移：从聚合状态及其他来源反序列化数据时检查大小。[#90031](https://github.com/ClickHouse/ClickHouse/pull/90031)（[Raúl Marín](https://github.com/Algunenano)）。
* 修复包含重复列的 JOIN 可能出现的“Invalid number of rows in Chunk”错误。解决 [#89411](https://github.com/ClickHouse/ClickHouse/issues/89411)。[#90053](https://github.com/ClickHouse/ClickHouse/pull/90053)（[Vladimir Cherkasov](https://github.com/vdimir)）。
* 已在 [#90588](https://github.com/ClickHouse/ClickHouse/issues/90588) 中回移：修复插入时使用 `ARRAY JOIN` 且启用 `enable_lazy_columns_replication` 可能出现的 `Column with Array type is not represented by ColumnArray column: Replicated` 错误。[#90066](https://github.com/ClickHouse/ClickHouse/pull/90066)（[Pavel Kruglov](https://github.com/Avogar)）。
* 允许 user\_files 中包含以点开头的文件。解决 [#89662](https://github.com/ClickHouse/ClickHouse/issues/89662)。[#90079](https://github.com/ClickHouse/ClickHouse/pull/90079)（[Raúl Marín](https://github.com/Algunenano)）。
* 已在 [#90647](https://github.com/ClickHouse/ClickHouse/issues/90647) 中回移：修复 `numbers` 系统表使用大步长时的逻辑错误和取模错误。解决 [#83398](https://github.com/ClickHouse/ClickHouse/issues/83398)。[#90123](https://github.com/ClickHouse/ClickHouse/pull/90123)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 修复字典参数解析中的整数溢出。解决 [#78506](https://github.com/ClickHouse/ClickHouse/issues/78506)。[#90171](https://github.com/ClickHouse/ClickHouse/pull/90171)（[Raúl Marín](https://github.com/Algunenano)）。
* 已在 [#90468](https://github.com/ClickHouse/ClickHouse/issues/90468) 中回移：修复 Hive 分区不兼容导致无法平滑升级到 25.8 的问题，解决升级期间的 `All hive partitioning columns must be present in the schema` 错误。[#90202](https://github.com/ClickHouse/ClickHouse/pull/90202)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复启用查询条件缓存时，轻量级更新之后 `SELECT` 查询结果可能不正确的问题。修复 [#90176](https://github.com/ClickHouse/ClickHouse/issues/90176) 和 [#90054](https://github.com/ClickHouse/ClickHouse/issues/90054)。[#90204](https://github.com/ClickHouse/ClickHouse/pull/90204)（[Anton Popov](https://github.com/CurtizJ)）。
* 修复 StorageDistributed 解析格式错误的分片目录名时的崩溃。[#90243](https://github.com/ClickHouse/ClickHouse/pull/90243)（[Aleksandr Musorin](https://github.com/AVMusorin)）。
* 在 `LogicalExpressionOptimizerPass` 中处理字符串到整数或布尔值的隐式转换。解决 [#89803](https://github.com/ClickHouse/ClickHouse/issues/89803)。[#90245](https://github.com/ClickHouse/ClickHouse/pull/90245)（[Elmi Ahmadov](https://github.com/ahmadov)）。
* 修复表定义中部分数据跳过索引格式化错误，导致 `METADATA_MISMATCH` 并破坏 Replicated 数据库中新副本创建的问题。[#90251](https://github.com/ClickHouse/ClickHouse/pull/90251)（[Nikolay Degterinsky](https://github.com/evillique)）。
* 已在 [#90381](https://github.com/ClickHouse/ClickHouse/issues/90381) 中回移：修复数据片段行数少于 index\_granularity 时 MergeTreeReaderIndex 的行数不匹配。解决 [#89691](https://github.com/ClickHouse/ClickHouse/issues/89691)。[#90254](https://github.com/ClickHouse/ClickHouse/pull/90254)（[Peng Jian](https://github.com/fastio)）。
* 已在 [#90608](https://github.com/ClickHouse/ClickHouse/issues/90608) 中回移：修复从 Compact 数据片段读取 JSON 子列时可能出现的 `CANNOT_READ_ALL_DATA` 错误。解决 [#90264](https://github.com/ClickHouse/ClickHouse/issues/90264)。[#90302](https://github.com/ClickHouse/ClickHouse/pull/90302)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复 `trim`、`ltrim`、`rtrim` 函数无法接受两个参数的问题。解决 [#90170](https://github.com/ClickHouse/ClickHouse/issues/90170)。[#90305](https://github.com/ClickHouse/ClickHouse/pull/90305)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 已在 [#90625](https://github.com/ClickHouse/ClickHouse/issues/90625) 中回移：修复 index\_granularity\_bytes=0 时，对不存在的 JSON 路径执行 PREWHERE 可能出现的逻辑错误。解决 [#86924](https://github.com/ClickHouse/ClickHouse/issues/86924)。[#90375](https://github.com/ClickHouse/ClickHouse/pull/90375)（[Pavel Kruglov](https://github.com/Avogar)）。
* 已在 [#90484](https://github.com/ClickHouse/ClickHouse/issues/90484) 中回移：修复 `L2DistanceTransposed` 精度参数超出有效范围时的崩溃。解决 [#90401](https://github.com/ClickHouse/ClickHouse/issues/90401)。[#90405](https://github.com/ClickHouse/ClickHouse/pull/90405)（[Raufs Dunamalijevs](https://github.com/rienath)）。
* 已在 [#90577](https://github.com/ClickHouse/ClickHouse/issues/90577) 中回移：修复 `L2DistanceTransposed` 使用数组参考向量，默认类型为 `Array(Float64))`，与元素类型并非 `Float64` 的 `QBit` 列（`Float32`、`BFloat16`）计算距离不正确的问题。函数现在会自动将参考向量转换为匹配 `QBit` 元素类型的类型。解决 [#89976](https://github.com/ClickHouse/ClickHouse/issues/89976)。[#90485](https://github.com/ClickHouse/ClickHouse/pull/90485)（[Raufs Dunamalijevs](https://github.com/rienath)）。
* 已在 [#90601](https://github.com/ClickHouse/ClickHouse/issues/90601) 中回移：修复 `equals` 函数罕见情况下的逻辑错误。解决 [#88142](https://github.com/ClickHouse/ClickHouse/issues/88142)。[#90557](https://github.com/ClickHouse/ClickHouse/pull/90557)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 修复 `CoalescingMergeTree` 对 `Tuple` 类型的处理。[#88828](https://github.com/ClickHouse/ClickHouse/pull/88828)（[scanhex12](https://github.com/scanhex12)）。

#### 构建/测试/打包改进

* 修复在 Docker 中运行 ClickHouse，使用 initdb SQL 脚本并覆盖 TCP 端口时的 Connection refused 错误。[#88042](https://github.com/ClickHouse/ClickHouse/pull/88042)（[Grigorii](https://github.com/GSokol)）。
* 实验性支持新的 ClickHouse 平台 e2k。[#90159](https://github.com/ClickHouse/ClickHouse/pull/90159)（[Ramil Sattarov](https://github.com/r-a-sattarov)）。
* 从 CMake 中移除剩余的 `FindPackage` 用法，构建不应依赖系统软件包。[#89380](https://github.com/ClickHouse/ClickHouse/pull/89380)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 在 CMake 配置期间的构建中使用编译器缓存，例如 `protoc`。[#89613](https://github.com/ClickHouse/ClickHouse/pull/89613)（[Konstantin Bogdanov](https://github.com/thevar1able)）。
* 使用 FreeBSD 13.4 sysroot。[#89617](https://github.com/ClickHouse/ClickHouse/pull/89617)（[Konstantin Bogdanov](https://github.com/thevar1able)）。
