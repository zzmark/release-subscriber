<h3 id="233">
  <a id="233" /> ClickHouse 23.3 版本 LTS, 2023-03-30. [演示文稿](https://presentations.clickhouse.com/2023-release-23.3/), [视频](https://www.youtube.com/watch?v=ISaGUjvBNao)
</h3>

<Frame>
  <iframe src="https://www.youtube.com/embed/ISaGUjvBNao" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
</Frame>

<h4 id="upgrade-notes-1">
  升级说明
</h4>

* 轻量级 DELETE 已可用于生产环境并默认启用。MergeTree 表的 `DELETE` 查询现在默认可用。
* `*domain*RFC` 和 `netloc` 函数的行为略有调整：放宽 URL authority 部分允许的字符集合，以更好地符合规范。 [#46841](https://github.com/ClickHouse/ClickHouse/pull/46841) ([Azat Khuzhin](https://github.com/azat)).
* 禁止创建基于 KafkaEngine 且列包含 DEFAULT/EPHEMERAL/ALIAS/MATERIALIZED 声明的表。 [#47138](https://github.com/ClickHouse/ClickHouse/pull/47138) ([Aleksandr Musorin](https://github.com/AVMusorin)).
* 移除“异步连接排空”功能，同时移除相关设置和指标。这是一项内部功能，因此不应影响从未听说过它的用户。 [#47486](https://github.com/ClickHouse/ClickHouse/pull/47486) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 在 `arraySum`/`Min`/`Max`/`Avg`/`Product`、`arrayCumSum`/`CumSumNonNegative`、`arrayDifference`、数组构造、IN 运算符、查询参数、`groupArrayMovingSum`、统计函数、`min`/`max`/`any`/`argMin`/`argMax`、PostgreSQL 线协议、MySQL 表引擎和表函数、`sumMap`、`mapAdd`、`mapSubtract`、`arrayIntersect` 中支持 256 位 Decimal 数据类型（超过 38 位数字）。为 `arrayIntersect` 新增大整数支持。涉及统计矩的统计聚合函数（如 `corr` 或各种 `TTest`）将使用 `Float64` 作为内部表示（此前使用 `Decimal128`，但这样做没有意义）；当方差无穷大时，这些函数可能返回 `nan` 而非 `inf`。此前某些函数虽然允许 `Decimal256` 数据类型，却返回 `Decimal128`，现已修复。关闭 [#47569](https://github.com/ClickHouse/ClickHouse/issues/47569)，关闭 [#44864](https://github.com/ClickHouse/ClickHouse/issues/44864)，关闭 [#28335](https://github.com/ClickHouse/ClickHouse/issues/28335)。 [#47594](https://github.com/ClickHouse/ClickHouse/pull/47594) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 将 backup\_threads/restore\_threads 改为服务器设置，不再作为用户设置。 [#47881](https://github.com/ClickHouse/ClickHouse/pull/47881) ([Azat Khuzhin](https://github.com/azat)).
* 禁止常量及非确定性的二级索引。 [#46839](https://github.com/ClickHouse/ClickHouse/pull/46839) ([Anton Popov](https://github.com/CurtizJ)).

<h4 id="new-feature-9">
  新功能
</h4>

* 新增通过 `parallel_replicas_custom_key` 和 `parallel_replicas_custom_key_filter_type` 设置在副本间拆分工作的模式。如果集群为单分片多副本，将随机选取最多 `max_parallel_replicas` 个副本并将其视为分片。查询发送至各分片前，发起节点会为其添加对应过滤条件。如果集群包含多个分片，其行为与 `sample_key` 相同，但允许定义任意键。 [#45108](https://github.com/ClickHouse/ClickHouse/pull/45108) ([Antonio Andelic](https://github.com/antonio2368)).
* 新增取消时显示部分结果的选项：查询设置 `partial_result_on_first_cancel` 允许已取消的查询（例如通过 Ctrl-C）返回部分结果。 [#45689](https://github.com/ClickHouse/ClickHouse/pull/45689) ([Alexey Perevyshin](https://github.com/alexX512)).
* 临时表支持任意表引擎（Replicated 和 KeeperMap 引擎除外）。关闭 [#31497](https://github.com/ClickHouse/ClickHouse/issues/31497)。 [#46071](https://github.com/ClickHouse/ClickHouse/pull/46071) ([Roman Vasin](https://github.com/rvasin)).
* 支持通过 Keeper 中的集中存储复制用户自定义 SQL 函数。 [#46085](https://github.com/ClickHouse/ClickHouse/pull/46085) ([Aleksei Filatov](https://github.com/aalexfvk)).
* 实现 `system.server_settings`（类似于 `system.settings`），用于展示服务器配置。 [#46550](https://github.com/ClickHouse/ClickHouse/pull/46550) ([pufit](https://github.com/pufit)).
* 支持 `UNDROP TABLE` 查询。关闭 [#46811](https://github.com/ClickHouse/ClickHouse/issues/46811)。 [#47241](https://github.com/ClickHouse/ClickHouse/pull/47241) ([chen](https://github.com/xiedeyantu)).
* 允许针对命名集合单独授权，例如仅为特定集合授予 `SHOW/CREATE/ALTER/DROP named collection` 权限，而不必一次授予所有集合的权限。关闭 [#40894](https://github.com/ClickHouse/ClickHouse/issues/40894)。新增访问类型 `NAMED_COLLECTION_CONTROL`，除非在用户配置中显式添加，否则不会授予 default 用户（执行 `GRANT ALL` 需要此权限）。此外，不再像 23.2 那样要求手动为 default 用户指定 `show_named_collections` 才能获得完整访问权限。 [#46241](https://github.com/ClickHouse/ClickHouse/pull/46241) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 允许嵌套自定义磁盘。此前自定义磁盘仅支持扁平结构。 [#47106](https://github.com/ClickHouse/ClickHouse/pull/47106) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 引入 `widthBucket` 函数，并提供 `WIDTH_BUCKET` 别名以便兼容。[#42974](https://github.com/ClickHouse/ClickHouse/issues/42974)。 [#46790](https://github.com/ClickHouse/ClickHouse/pull/46790) ([avoiderboi](https://github.com/avoiderboi)).
* 新增 `parseDateTime`/`parseDateTimeInJodaSyntax` 函数，根据指定格式字符串解析时间。parseDateTime 使用 MySQL 语法将 String 解析为 DateTime，parseDateTimeInJodaSyntax 使用 Joda 语法解析。 [#46815](https://github.com/ClickHouse/ClickHouse/pull/46815) ([李扬](https://github.com/taiyang-li)).
* 将 `dummy UInt8` 作为 `null` 表函数的默认结构。关闭 [#46930](https://github.com/ClickHouse/ClickHouse/issues/46930)。 [#47006](https://github.com/ClickHouse/ClickHouse/pull/47006) ([flynn](https://github.com/ucasfl)).
* `parseDateTimeBestEffort` 函数支持带逗号的日期格式，例如 `Dec 15, 2021`。关闭 [#46816](https://github.com/ClickHouse/ClickHouse/issues/46816)。 [#47071](https://github.com/ClickHouse/ClickHouse/pull/47071) ([chen](https://github.com/xiedeyantu)).
* 新增 `http_wait_end_of_query` 和 `http_response_buffer_size` 设置，分别对应 HTTP 接口的 URL 参数 `wait_end_of_query` 和 `buffer_size`，允许在配置档中修改这些设置。 [#47108](https://github.com/ClickHouse/ClickHouse/pull/47108) ([Vladimir C](https://github.com/vdimir)).
* 新增 `system.dropped_tables` 表，展示已从 `Atomic` 数据库删除但尚未彻底移除的表。 [#47364](https://github.com/ClickHouse/ClickHouse/pull/47364) ([chen](https://github.com/xiedeyantu)).
* 新增 `INSTR` 作为 `positionCaseInsensitive` 的别名，以兼容 MySQL。关闭 [#47529](https://github.com/ClickHouse/ClickHouse/issues/47529)。 [#47535](https://github.com/ClickHouse/ClickHouse/pull/47535) ([flynn](https://github.com/ucasfl)).
* 新增 `toDecimalString` 函数，支持将数字转换为固定精度的字符串。 [#47838](https://github.com/ClickHouse/ClickHouse/pull/47838) ([Andrey Zvonov](https://github.com/zvonand)).
* 新增 MergeTree 设置 `max_number_of_mutations_for_replica`，将每个副本的数据片段变更操作数量限制为指定值。零表示不限制每个副本的变更操作数量（执行仍可能受其他设置约束）。 [#48047](https://github.com/ClickHouse/ClickHouse/pull/48047) ([Vladimir C](https://github.com/vdimir)).
* 新增 Map 相关函数 `mapFromArrays`，允许从一对数组创建映射。 [#31125](https://github.com/ClickHouse/ClickHouse/pull/31125) ([李扬](https://github.com/taiyang-li)).
* 允许控制 Parquet/ORC/Arrow 输出格式的压缩方式，并支持更多压缩输入格式。关闭 [#13541](https://github.com/ClickHouse/ClickHouse/issues/13541)。 [#47114](https://github.com/ClickHouse/ClickHouse/pull/47114) ([Kruglov Pavel](https://github.com/Avogar)).
* 为原生协议新增 SSL 用户证书认证。关闭 [#47077](https://github.com/ClickHouse/ClickHouse/issues/47077)。 [#47596](https://github.com/ClickHouse/ClickHouse/pull/47596) ([Nikolay Degterinsky](https://github.com/evillique)).
* 为 `parseDateTime` 新增 \*OrNull() 和 \*OrZero() 变体，并新增 `str_to_date` 别名以与 MySQL 保持一致。 [#48000](https://github.com/ClickHouse/ClickHouse/pull/48000) ([Robert Schulze](https://github.com/rschu1ze)).
* 新增 `REGEXP` 运算符（类似于 “LIKE”、“IN”、“MOD” 等运算符），以改善 MySQL 兼容性。 [#47869](https://github.com/ClickHouse/ClickHouse/pull/47869) ([Robert Schulze](https://github.com/rschu1ze)).

<h4 id="performance-improvement-9">
  性能改进
</h4>

* 现在对内存中的标记进行压缩，内存占用降至原来的约 1/3–1/6。 [#47290](https://github.com/ClickHouse/ClickHouse/pull/47290) ([Michael Kolupaev](https://github.com/al13n321)).
* 此前版本中备份大量文件慢得令人难以置信，现在不再如此，而是快得令人难以置信。为备份 IO 操作引入独立线程池，可独立于其他线程池进行扩展并提升性能。 [#47251](https://github.com/ClickHouse/ClickHouse/pull/47251) ([Alexey Milovidov](https://github.com/alexey-milovidov)). [#47174](https://github.com/ClickHouse/ClickHouse/pull/47174) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov))。在备份处理的最后阶段，使用 MultiRead 请求和重试机制收集元数据。[#47243](https://github.com/ClickHouse/ClickHouse/pull/47243) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov))。如果备份和待恢复数据都在 S3 中，现在应使用服务端复制。[#47546](https://github.com/ClickHouse/ClickHouse/pull/47546) ([Vitaly Baranov](https://github.com/vitlibar))。
* 修复带 `FINAL` 的查询中过量读取的问题。 [#47801](https://github.com/ClickHouse/ClickHouse/pull/47801) ([Nikita Taranov](https://github.com/nickitat)).
* 服务器启动时，将 `max_final_threads` 设置为核心数（采用与 `max_threads` 相同的算法），以提高多 CPU 服务器上 `final` 执行的并发度。 [#47915](https://github.com/ClickHouse/ClickHouse/pull/47915) ([Nikita Taranov](https://github.com/nickitat)).
* 允许为使用 CLICKHOUSE 数据源的 DIRECT 字典在多线程中执行读取流水线。启用方法是在 `CREATE DICTIONARY` 语句的数据源 `SETTINGS` 节中设置 `dictionary_use_async_executor=1`。 [#47986](https://github.com/ClickHouse/ClickHouse/pull/47986) ([Vladimir C](https://github.com/vdimir)).
* 优化单个可空键的聚合性能。 [#45772](https://github.com/ClickHouse/ClickHouse/pull/45772) ([LiuNeng](https://github.com/liuneng1994)).
* 使 `hasTokenOrNull`、`hasTokenCaseInsensitive` 和 `hasTokenCaseInsensitiveOrNull` 能利用小写化的 `tokenbf_v1` 索引。 [#46252](https://github.com/ClickHouse/ClickHouse/pull/46252) ([ltrk2](https://github.com/ltrk2)).
* 通过使用 SIMD 搜索前两个字符，优化 `position` 和 `LIKE` 函数。 [#46289](https://github.com/ClickHouse/ClickHouse/pull/46289) ([Jiebin Sun](https://github.com/jiebinn)).
* 优化对 `system.detached_parts` 的查询，该表可能非常大。根据数据块大小限制添加多个数据源；每个数据块使用 IO 线程池计算数据片段大小，即并行执行系统调用。 [#46624](https://github.com/ClickHouse/ClickHouse/pull/46624) ([Sema Checherinda](https://github.com/CheSema)).
* 将 ReplicatedMergeTree 表的 `max_replicated_merges_in_queue` 默认值从 16 增大到 1000，使副本数量非常多的集群（如 ClickHouse Cloud 中使用共享存储的集群）能更快完成后台合并操作。 [#47050](https://github.com/ClickHouse/ClickHouse/pull/47050) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 将 `clickhouse-copier` 获取分区列表时使用的 `DISTINCT` 改为 `GROUP BY`。对于大表，这使查询时间从 500 多秒降至 1 秒以内。 [#47386](https://github.com/ClickHouse/ClickHouse/pull/47386) ([Clayton McClure](https://github.com/cmcclure-twilio)).
* 修复 `ASOF JOIN` 的性能下降。 [#47544](https://github.com/ClickHouse/ClickHouse/pull/47544) ([Ongkong](https://github.com/ongkong)).
* Keeper 中进一步扩大批处理，通过避免读请求打断批次来提升性能。 [#47978](https://github.com/ClickHouse/ClickHouse/pull/47978) ([Antonio Andelic](https://github.com/antonio2368)).
* 允许 Merge 在列具有不同 DEFAULT 表达式时使用 PREWHERE。 [#46831](https://github.com/ClickHouse/ClickHouse/pull/46831) ([Azat Khuzhin](https://github.com/azat)).

<h4 id="experimental-feature-6">
  实验性功能
</h4>

* 并行副本：通过更充分地利用本地副本提升整体性能，并默认禁止使用并行副本读取非复制 MergeTree 表。 [#47858](https://github.com/ClickHouse/ClickHouse/pull/47858) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* 启用实验性分析器时，支持在与 `Join`、`Dictionary` 和 `EmbeddedRocksDB` 表连接的查询中将过滤器下推至左表。 [#47280](https://github.com/ClickHouse/ClickHouse/pull/47280) ([Maksim Kita](https://github.com/kitaisreal)).
* 现在，采用零复制机制的 ReplicatedMergeTree 对 Keeper 造成的负载更低。 [#47676](https://github.com/ClickHouse/ClickHouse/pull/47676) ([alesapin](https://github.com/alesapin)).
* 修复使用 MaterializedPostgreSQL 时创建物化视图的问题。 [#40807](https://github.com/ClickHouse/ClickHouse/pull/40807) ([Maksim Buren](https://github.com/maks-buren630501)).

<h4 id="improvement-9">
  改进
</h4>

* 默认启用 `input_format_json_ignore_unknown_keys_in_named_tuple`。 [#46742](https://github.com/ClickHouse/ClickHouse/pull/46742) ([Kruglov Pavel](https://github.com/Avogar)).
* 允许向 MATERIALIZED VIEW 推送数据时忽略错误（新增 `materialized_views_ignore_errors` 设置，默认 `false`，但刷新日志至 `system.*_log` 表时无条件设为 `true`）。 [#46658](https://github.com/ClickHouse/ClickHouse/pull/46658) ([Azat Khuzhin](https://github.com/azat)).
* 在内存中跟踪分布式发送的文件队列。 [#45491](https://github.com/ClickHouse/ClickHouse/pull/45491) ([Azat Khuzhin](https://github.com/azat)).
* 现在通过 HTTP 协议执行的所有查询都会在响应中添加 `X-ClickHouse-Query-Id` 和 `X-ClickHouse-Timezone` 头；此前仅对 `SELECT` 查询这样做。 [#46364](https://github.com/ClickHouse/ClickHouse/pull/46364) ([Anton Popov](https://github.com/CurtizJ)).
* 来自 `MongoDB` 的外部表：支持通过包含 host:port 列表的 URI 连接副本集，并在 MongoDB 字典中支持 readPreference 选项。示例 URI：`mongodb://db0.example.com:27017,db1.example.com:27017,db2.example.com:27017/?replicaSet=myRepl&readPreference=primary`。 [#46524](https://github.com/ClickHouse/ClickHouse/pull/46524) ([artem-yadr](https://github.com/artem-yadr)).
* 这项改进对用户应当是无感的：基于查询计划重新实现投影分析。新增 `query_plan_optimize_projection=1` 设置，用于在新旧版本之间切换。修复 [#44963](https://github.com/ClickHouse/ClickHouse/issues/44963)。 [#46537](https://github.com/ClickHouse/ClickHouse/pull/46537) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 输出格式默认使用 Parquet v2 代替 v1。新增 `output_format_parquet_version` 设置控制 Parquet 版本，可选值为 `1.0`、`2.4`、`2.6`、`2.latest`（默认）。 [#46617](https://github.com/ClickHouse/ClickHouse/pull/46617) ([Kruglov Pavel](https://github.com/Avogar)).
* 现在可使用新配置语法配置名称中包含句点（`.`）的 Kafka 主题。 [#46752](https://github.com/ClickHouse/ClickHouse/pull/46752) ([Robert Schulze](https://github.com/rschu1ze)).
* 修复检查 Hyperscan 模式中有问题的重复结构的启发式逻辑。 [#46819](https://github.com/ClickHouse/ClickHouse/pull/46819) ([Robert Schulze](https://github.com/rschu1ze)).
* 当数据块由另一个副本并发创建时，不再向 system.errors 报告 ZK 节点已存在。 [#46820](https://github.com/ClickHouse/ClickHouse/pull/46820) ([Raúl Marín](https://github.com/Algunenano)).
* 提高 `clickhouse-local` 的打开文件数量限制，使其能够在 CPU 核心数很多的服务器上读取 `web` 表。不再因打开文件过多而对 URL 表引擎的读取进行退避。关闭 [#46852](https://github.com/ClickHouse/ClickHouse/issues/46852)。 [#46853](https://github.com/ClickHouse/ClickHouse/pull/46853) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 无法解析数字时抛出的异常现在具有更易读的消息。 [#46917](https://github.com/ClickHouse/ClickHouse/pull/46917) ([Robert Schulze](https://github.com/rschu1ze)).
* 每处理完一个任务便更新 `system.backups`，以跟踪备份进度。 [#46989](https://github.com/ClickHouse/ClickHouse/pull/46989) ([Aleksandr Musorin](https://github.com/AVMusorin)).
* 允许在 Native 输入格式中进行类型转换。新增 `input_format_native_allow_types_conversion` 设置控制此行为（默认启用）。 [#46990](https://github.com/ClickHouse/ClickHouse/pull/46990) ([Kruglov Pavel](https://github.com/Avogar)).
* 允许 `range` 函数使用 IPv4 生成 IP 范围。 [#46995](https://github.com/ClickHouse/ClickHouse/pull/46995) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* 改进无法将数据片段从一个卷/磁盘移到另一个卷/磁盘时的异常消息。 [#47032](https://github.com/ClickHouse/ClickHouse/pull/47032) ([alesapin](https://github.com/alesapin)).
* `JSONType` 函数支持 `Bool` 类型；此前对于布尔值会错误返回 `Null` 类型。 [#47046](https://github.com/ClickHouse/ClickHouse/pull/47046) ([Anton Popov](https://github.com/CurtizJ)).
* 使用 `_request_body` 参数配置预定义 HTTP 查询。 [#47086](https://github.com/ClickHouse/ClickHouse/pull/47086) ([Constantine Peresypkin](https://github.com/pkit)).
* 在内置 UI 的 SQL 编辑器中按 Enter 时自动缩进。 [#47113](https://github.com/ClickHouse/ClickHouse/pull/47113) ([Alexey Korepanov](https://github.com/alexkorep)).
* 使用 'sudo' 自解压时，将尝试把解压文件的 uid 和 gid 设置为运行用户的值。 [#47116](https://github.com/ClickHouse/ClickHouse/pull/47116) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* 此前，`repeat` 函数的第二个参数仅接受无符号整数类型，因此无法接受 -1 等值；这与 Spark 函数的行为不同。本次更新将 repeat 函数的行为调整为与 Spark 一致，现在接受相同类型的输入，包括负整数。已进行广泛测试以验证新实现的正确性。注：此 Changelog 条目由 ChatGPT 改写。 [#47134](https://github.com/ClickHouse/ClickHouse/pull/47134) ([KevinyhZou](https://github.com/KevinyhZou)).
* 从堆栈跟踪中移除 `::__1` 部分，并将 `std::basic_string<char, ...` 显示为 `String`。 [#47171](https://github.com/ClickHouse/ClickHouse/pull/47171) ([Mike Kot](https://github.com/myrrc)).
* 重新实现服务器间模式，以防止重放攻击（注意，此变更向后兼容旧服务器）。 [#47213](https://github.com/ClickHouse/ClickHouse/pull/47213) ([Azat Khuzhin](https://github.com/azat)).
* 改进正则表达式分组的识别，并完善 regexp\_tree 字典。 [#47218](https://github.com/ClickHouse/ClickHouse/pull/47218) ([Han Fei](https://github.com/hanfei1991)).
* Keeper 改进：新增四字母命令 `clrs`，清理 Keeper 使用的资源（例如释放未使用的内存）。 [#47256](https://github.com/ClickHouse/ClickHouse/pull/47256) ([Antonio Andelic](https://github.com/antonio2368)).
* 为编解码器添加可选参数 `DoubleDelta(bytes_size)`、`Gorilla(bytes_size)`、`FPC(level, float_size)`，允许在 `clickhouse-compressor` 中不依赖列类型使用这些编解码器。修复 `clickhouse-compressor` 使用这些编解码器时可能出现的异常终止和算术错误。修复：[https://github.com/ClickHouse/ClickHouse/discussions/47262](https://github.com/ClickHouse/ClickHouse/discussions/47262)。 [#47271](https://github.com/ClickHouse/ClickHouse/pull/47271) ([Kruglov Pavel](https://github.com/Avogar)).
* 为 `runningDifference` 函数新增大整数类型支持。关闭 [#47194](https://github.com/ClickHouse/ClickHouse/issues/47194)。 [#47322](https://github.com/ClickHouse/ClickHouse/pull/47322) ([Nikolay Degterinsky](https://github.com/evillique)).
* 为带有效期的 S3 凭据新增过期提前量，避免部分边界情况下出现 `ExpiredToken` 错误。可通过 `expiration_window_seconds` 配置控制，默认 120 秒。 [#47423](https://github.com/ClickHouse/ClickHouse/pull/47423) ([Antonio Andelic](https://github.com/antonio2368)).
* `Avro` 格式支持 Decimal 和 Date32。 [#47434](https://github.com/ClickHouse/ClickHouse/pull/47434) ([Kruglov Pavel](https://github.com/Avogar)).
* 检测到从 `Ordinary` 到 `Atomic` 的转换被中断时，不启动服务器，并打印更清晰的错误消息及排查说明。 [#47487](https://github.com/ClickHouse/ClickHouse/pull/47487) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 为 `system.opentelemetry_span_log` 新增 `kind` 列，保存 OpenTelemetry 定义的 [SpanKind](https://opentelemetry.io/docs/reference/specification/trace/api/#spankind) 值。 [#47499](https://github.com/ClickHouse/ClickHouse/pull/47499) ([Frank Chen](https://github.com/FrankChen021)).
* 允许在 `Protobuf` 格式中读写嵌套数组时，仅使用根字段名作为列名。此前列名必须包含所有嵌套字段名，例如 `a.b.c Array(Array(Array(UInt32)))`，现在只需使用 `a Array(Array(Array(UInt32)))`。 [#47650](https://github.com/ClickHouse/ClickHouse/pull/47650) ([Kruglov Pavel](https://github.com/Avogar)).
* 为 `SYSTEM SYNC REPLICA` 新增可选的 `STRICT` 修饰符，使查询等待复制队列清空（与 [https://github.com/ClickHouse/ClickHouse/pull/45648](https://github.com/ClickHouse/ClickHouse/pull/45648) 之前的行为相同）。 [#47659](https://github.com/ClickHouse/ClickHouse/pull/47659) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 改进部分 OpenTelemetry 跨度日志的命名。 [#47667](https://github.com/ClickHouse/ClickHouse/pull/47667) ([Frank Chen](https://github.com/FrankChen021)).
* 禁止使用过长的聚合函数组合器链，因为它们可能导致查询分析阶段变慢。关闭 [#47715](https://github.com/ClickHouse/ClickHouse/issues/47715)。 [#47716](https://github.com/ClickHouse/ClickHouse/pull/47716) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 支持参数化视图中的子查询；解决 [#46741](https://github.com/ClickHouse/ClickHouse/issues/46741)。 [#47725](https://github.com/ClickHouse/ClickHouse/pull/47725) ([SmitaRKulkarni](https://github.com/SmitaRKulkarni)).
* 修复 MySQL 集成中的内存泄漏（可通过 `connection_auto_close=1` 复现）。 [#47732](https://github.com/ClickHouse/ClickHouse/pull/47732) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 改进 Decimal 参数相关代码的错误处理，使错误消息提供更多信息。此前提供错误的 Decimal 参数时，生成的消息不清晰或帮助不大。本次更新修正了输出的错误消息，提供更详细、更有用的信息，便于定位和修正 Decimal 参数问题。注：此 Changelog 条目由 ChatGPT 改写。 [#47812](https://github.com/ClickHouse/ClickHouse/pull/47812) ([Yu Feng](https://github.com/Vigor-jpg)).
* `exact_rows_before_limit` 参数用于使 `rows_before_limit_at_least` 准确反映达到 LIMIT 前返回的行数。此 PR 解决查询涉及多分片分布式处理或排序操作时的问题；此前这些场景未按预期工作。 [#47874](https://github.com/ClickHouse/ClickHouse/pull/47874) ([Amos Bird](https://github.com/amosbird)).
* 提供 ThreadPools 指标的内部状态查询能力。 [#47880](https://github.com/ClickHouse/ClickHouse/pull/47880) ([Azat Khuzhin](https://github.com/azat)).
* 新增 `WriteBufferFromS3Microseconds` 和 `WriteBufferFromS3RequestsErrors` 性能事件。 [#47885](https://github.com/ClickHouse/ClickHouse/pull/47885) ([Antonio Andelic](https://github.com/antonio2368)).
* 为 ClickHouse 安装新增 `--link` 和 `--noninteractive`（`-y`）选项。关闭 [#47750](https://github.com/ClickHouse/ClickHouse/issues/47750)。 [#47887](https://github.com/ClickHouse/ClickHouse/pull/47887) ([Nikolay Degterinsky](https://github.com/evillique)).
* 修复挂载物化视图时，若其依赖表不可用便出现 `UNKNOWN_TABLE` 异常的问题。这可能有助于从备份恢复状态。 [#47975](https://github.com/ClickHouse/ClickHouse/pull/47975) ([MikhailBurdukov](https://github.com/MikhailBurdukov)).
* 修复加密磁盘配置中未添加可选路径的情况。 [#47981](https://github.com/ClickHouse/ClickHouse/pull/47981) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 支持参数化视图中的 CTE。实现方式：允许在求值标量子查询时使用查询参数。 [#48065](https://github.com/ClickHouse/ClickHouse/pull/48065) ([SmitaRKulkarni](https://github.com/SmitaRKulkarni)).
* 支持大整数 `(U)Int128/(U)Int256`、任意键类型的 `Map`，以及任意精度的 `DateTime64`（不再仅限于 3 和 6）。 [#48119](https://github.com/ClickHouse/ClickHouse/pull/48119) ([Kruglov Pavel](https://github.com/Avogar)).
* 允许跳过行式输入格式中与未知枚举值相关的错误。 [#48133](https://github.com/ClickHouse/ClickHouse/pull/48133) ([Alexey Milovidov](https://github.com/alexey-milovidov)).

<h4 id="buildtestingpackaging-improvement-9">
  构建、测试与打包改进
</h4>

* ClickHouse 现在使用 `C++23` 构建。 [#47424](https://github.com/ClickHouse/ClickHouse/pull/47424) ([Robert Schulze](https://github.com/rschu1ze)).
* 在 AST Fuzzer 中对 `EXPLAIN` 查询进行模糊测试。[#47803](https://github.com/ClickHouse/ClickHouse/pull/47803) [#47852](https://github.com/ClickHouse/ClickHouse/pull/47852) ([flynn](https://github.com/ucasfl)).
* 拆分压力测试与自动向后兼容性检查（现在称为升级检查）。 [#44879](https://github.com/ClickHouse/ClickHouse/pull/44879) ([Kruglov Pavel](https://github.com/Avogar)).
* 更新 Docker 的 Ubuntu 镜像，以消除一些不实的安全报告。请注意，ClickHouse 没有依赖项，也不需要 Docker。 [#46784](https://github.com/ClickHouse/ClickHouse/pull/46784) ([Julio Jimenez](https://github.com/juliojimenez)).
* 使用 “curl | sh” 下载 ClickHouse 时，新增提示以允许移除现有 `clickhouse` 下载文件。提示为 “ClickHouse binary clickhouse already exists. Overwrite? \[y/N]”（ClickHouse 二进制文件 clickhouse 已存在。是否覆盖？\[y/N]）。 [#46859](https://github.com/ClickHouse/ClickHouse/pull/46859) ([Dan Roscigno](https://github.com/DanRoscigno)).
* 修复在旧发行版（如 Amazon Linux 2）以及 ARM 上启动服务器时找不到 glibc 2.28 符号的错误。 [#47008](https://github.com/ClickHouse/ClickHouse/pull/47008) ([Robert Schulze](https://github.com/rschu1ze)).
* 为 clang 16 做准备。 [#47027](https://github.com/ClickHouse/ClickHouse/pull/47027) ([Amos Bird](https://github.com/amosbird)).
* 新增 CI 检查，确保 ClickHouse 可在 ARM 上使用旧版 glibc 运行。 [#47063](https://github.com/ClickHouse/ClickHouse/pull/47063) ([Robert Schulze](https://github.com/rschu1ze)).
* 新增风格检查，防止错误使用 `NDEBUG` 宏。 [#47699](https://github.com/ClickHouse/ClickHouse/pull/47699) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 略微加快构建速度。 [#47714](https://github.com/ClickHouse/ClickHouse/pull/47714) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 将 `vectorscan` 升级到 5.4.9。 [#47955](https://github.com/ClickHouse/ClickHouse/pull/47955) ([Robert Schulze](https://github.com/rschu1ze)).
* 新增单元测试，断言 Apache Arrow 的致命级别日志不会导致异常终止，覆盖 [ClickHouse/arrow#16](https://github.com/ClickHouse/arrow/pull/16) 中的变更。 [#47958](https://github.com/ClickHouse/ClickHouse/pull/47958) ([Arthur Passos](https://github.com/arthurpassos)).
* 恢复原生 macOS 调试服务器构建的启动能力。注：此变更仅与开发有关，ClickHouse 官方构建使用交叉编译。 [#48050](https://github.com/ClickHouse/ClickHouse/pull/48050) ([Robert Schulze](https://github.com/rschu1ze)).

<h4 id="bug-fix-user-visible-misbehavior-in-an-official-stable-release-9">
  缺陷修复（正式稳定版本中用户可见的异常行为）
</h4>

* 修复格式解析器重置，并测试 `Kafka` 中错误消息的处理。 [#45693](https://github.com/ClickHouse/ClickHouse/pull/45693) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复 Keeper 中的数据大小计算。 [#46086](https://github.com/ClickHouse/ClickHouse/pull/46086) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复对 `Atomic` 数据库中的 `ReplicatedMergeTree` 表执行 `DROP TABLE` 查询时自动重试的问题。极少数情况下，如果 DROP 期间 ZooKeeper 会话过期，同时又创建了使用相同 ZooKeeper 路径的新复制表，可能导致 `Can't get data for node /zk_path/log_pointer` 和 `The specified key does not exist` 错误。 [#46384](https://github.com/ClickHouse/ClickHouse/pull/46384) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 修复查询规范化时错误的别名递归，该问题会阻止部分查询运行。 [#46609](https://github.com/ClickHouse/ClickHouse/pull/46609) ([Raúl Marín](https://github.com/Algunenano)).
* 修复二进制格式中的 IPv4/IPv6 序列化和反序列化。 [#46616](https://github.com/ClickHouse/ClickHouse/pull/46616) ([Kruglov Pavel](https://github.com/Avogar)).
* ActionsDAG：优化期间不改变 `and` 的结果。 [#46653](https://github.com/ClickHouse/ClickHouse/pull/46653) ([Salvatore Mesoraca](https://github.com/aiven-sal)).
* 改进客户端异常退出时的查询取消。 [#46681](https://github.com/ClickHouse/ClickHouse/pull/46681) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 修复聚合优化中的算术运算。 [#46705](https://github.com/ClickHouse/ClickHouse/pull/46705) ([Duc Canh Le](https://github.com/canhld94)).
* 修复 `clickhouse-local` 在 JSONEachRow 结构推断中可能异常终止的问题。 [#46731](https://github.com/ClickHouse/ClickHouse/pull/46731) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复更改已过期角色的问题。 [#46772](https://github.com/ClickHouse/ClickHouse/pull/46772) ([Vitaly Baranov](https://github.com/vitlibar)).
* 修复从多个步骤累积组合 PREWHERE 列的问题。 [#46785](https://github.com/ClickHouse/ClickHouse/pull/46785) ([Alexander Gololobov](https://github.com/davenger)).
* 在 HTTP 读取缓冲区中使用初始范围获取文件大小。没有此变更时，某些远程文件无法处理。 [#46824](https://github.com/ClickHouse/ClickHouse/pull/46824) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复使用 URL 表时进度条不正确的问题。 [#46830](https://github.com/ClickHouse/ClickHouse/pull/46830) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复 `maxIntersections` 函数中的 MSan 报告。 [#46847](https://github.com/ClickHouse/ClickHouse/pull/46847) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复 `Map` 数据类型中的缺陷。 [#46856](https://github.com/ClickHouse/ClickHouse/pull/46856) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复 LIKE 模式中包含对不可转义字符进行转义时，部分 LIKE 搜索结果错误的问题。 [#46875](https://github.com/ClickHouse/ClickHouse/pull/46875) ([Robert Schulze](https://github.com/rschu1ze)).
* 修复 WITH FILL 在填充变换处理空数据块时导致的异常终止。 [#46897](https://github.com/ClickHouse/ClickHouse/pull/46897) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* 修复从 JSON 字符串推断日期和整数的问题。 [#46972](https://github.com/ClickHouse/ClickHouse/pull/46972) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复零复制机制在拉取时选择磁盘的问题。 [#47010](https://github.com/ClickHouse/ClickHouse/pull/47010) ([alesapin](https://github.com/alesapin)).
* 修复 systemd 服务定义中的拼写错误。 [#47051](https://github.com/ClickHouse/ClickHouse/pull/47051) ([Palash Goel](https://github.com/palash-goel)).
* 修复 CROSS JOIN 与 algorithm = auto 一起使用时出现的 NOT\_IMPLEMENTED 错误。 [#47068](https://github.com/ClickHouse/ClickHouse/pull/47068) ([Vladimir C](https://github.com/vdimir)).
* 修复将 'part\_type' 配置为 'InMemory' 模式（实验性功能）时，'ReplicatedMergeTree' 表无法插入两条相似数据的问题。 [#47121](https://github.com/ClickHouse/ClickHouse/pull/47121) ([liding1992](https://github.com/liding1992)).
* 外部字典 / library-bridge：修复 “unknown library method 'extDict\_libClone'” 错误。 [#47136](https://github.com/ClickHouse/ClickHouse/pull/47136) ([alex filatov](https://github.com/phil-88)).
* 修复带 LIMIT 的 grace hash join 中的竞态条件。 [#47153](https://github.com/ClickHouse/ClickHouse/pull/47153) ([Vladimir C](https://github.com/vdimir)).
* 修复具体列的 PREWHERE 支持。 [#47154](https://github.com/ClickHouse/ClickHouse/pull/47154) ([Azat Khuzhin](https://github.com/azat)).
* 修复 Query Status 中可能出现的死锁。 [#47161](https://github.com/ClickHouse/ClickHouse/pull/47161) ([Kruglov Pavel](https://github.com/Avogar)).
* 禁止针对同一 `Join` 表执行 INSERT SELECT，因为这会导致死锁。 [#47260](https://github.com/ClickHouse/ClickHouse/pull/47260) ([Vladimir C](https://github.com/vdimir)).
* 在 `min_age_to_force_merge_seconds` 触发的合并中跳过已合并分区。 [#47303](https://github.com/ClickHouse/ClickHouse/pull/47303) ([Antonio Andelic](https://github.com/antonio2368)).
* 修改 find\_first\_symbols，使其在 find\_first\_not\_symbols 场景下按预期工作。 [#47304](https://github.com/ClickHouse/ClickHouse/pull/47304) ([Arthur Passos](https://github.com/arthurpassos)).
* 修复 CSV 中大数的推断。 [#47410](https://github.com/ClickHouse/ClickHouse/pull/47410) ([Kruglov Pavel](https://github.com/Avogar)).
* 对包含别名的表达式禁用逻辑表达式优化器。 [#47451](https://github.com/ClickHouse/ClickHouse/pull/47451) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复 `decodeURLComponent` 中的错误。 [#47457](https://github.com/ClickHouse/ClickHouse/pull/47457) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复带投影时的 EXPLAIN 图。 [#47473](https://github.com/ClickHouse/ClickHouse/pull/47473) ([flynn](https://github.com/ucasfl)).
* 修复查询参数。 [#47488](https://github.com/ClickHouse/ClickHouse/pull/47488) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 参数化视图：一项缺陷修复。 [#47495](https://github.com/ClickHouse/ClickHouse/pull/47495) ([SmitaRKulkarni](https://github.com/SmitaRKulkarni)).
* 数据格式模糊测试器及相应修复。 [#47519](https://github.com/ClickHouse/ClickHouse/pull/47519) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复 `DateTime64` 的单调性检查。 [#47526](https://github.com/ClickHouse/ClickHouse/pull/47526) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复可空 LowCardinality 列的 “block structure mismatch” 错误。 [#47537](https://github.com/ClickHouse/ClickHouse/pull/47537) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 正确修复 Apache Parquet 中的一个缺陷 [#45878](https://github.com/ClickHouse/ClickHouse/issues/45878)。 [#47538](https://github.com/ClickHouse/ClickHouse/pull/47538) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复文档大小无效时 `BSONEachRow` 的并行解析。 [#47540](https://github.com/ClickHouse/ClickHouse/pull/47540) ([Kruglov Pavel](https://github.com/Avogar)).
* 执行 `SYSTEM FLUSH DISTRIBUTED` 时保留 `system.distribution_queue` 中的错误。 [#47541](https://github.com/ClickHouse/ClickHouse/pull/47541) ([Azat Khuzhin](https://github.com/azat)).
* 检查 `BSONEachRow` 格式中的重复列。 [#47609](https://github.com/ClickHouse/ClickHouse/pull/47609) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复移动过程中等待零复制锁的问题。 [#47631](https://github.com/ClickHouse/ClickHouse/pull/47631) ([alesapin](https://github.com/alesapin)).
* 修复按分区聚合。 [#47634](https://github.com/ClickHouse/ClickHouse/pull/47634) ([Nikita Taranov](https://github.com/nickitat)).
* 修复 `BSONEachRow` 格式中将元组序列化为数组的问题。 [#47690](https://github.com/ClickHouse/ClickHouse/pull/47690) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复 `polygonsSymDifferenceCartesian` 中的崩溃。 [#47702](https://github.com/ClickHouse/ClickHouse/pull/47702) ([pufit](https://github.com/pufit)).
* 修复通过 `File` 存储引擎读取采用 `zlib` 和 `gzip` 压缩的文件时的问题。 [#47796](https://github.com/ClickHouse/ClickHouse/pull/47796) ([Anton Popov](https://github.com/CurtizJ)).
* 改进 PostgreSQL 的空查询检测（针对 pgx Go 驱动）。 [#47854](https://github.com/ClickHouse/ClickHouse/pull/47854) ([Azat Khuzhin](https://github.com/azat)).
* 修复 LowCardinality 类型的 DateTime 单调性检查。 [#47860](https://github.com/ClickHouse/ClickHouse/pull/47860) ([Antonio Andelic](https://github.com/antonio2368)).
* RESTORE ASYNC 使用 restore\_threads，而非 backup\_threads。 [#47861](https://github.com/ClickHouse/ClickHouse/pull/47861) ([Azat Khuzhin](https://github.com/azat)).
* 修复包含投影的 ReplicatedMergeTree 上的 DROP COLUMN。 [#47883](https://github.com/ClickHouse/ClickHouse/pull/47883) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复 Replicated 数据库恢复。 [#47901](https://github.com/ClickHouse/ClickHouse/pull/47901) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 紧急修复 HTTP 警告过于冗长的问题。 [#47903](https://github.com/ClickHouse/ClickHouse/pull/47903) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 修复 `catboostEvaluate` 中的 “Field value too long” 错误。 [#47970](https://github.com/ClickHouse/ClickHouse/pull/47970) ([Robert Schulze](https://github.com/rschu1ze)).
* 修复 [#36971](https://github.com/ClickHouse/ClickHouse/issues/36971)：Watchdog 在子进程退出时以非零状态码退出。 [#47973](https://github.com/ClickHouse/ClickHouse/pull/47973) ([Коренберг Марк](https://github.com/socketpair)).
* 修复“索引文件 `cidx` 长度异常过长”的错误。 [#48010](https://github.com/ClickHouse/ClickHouse/pull/48010) ([SmitaRKulkarni](https://github.com/SmitaRKulkarni)).
* 修复 MaterializedPostgreSQL 获取属性（replica-identity）的查询。 [#48015](https://github.com/ClickHouse/ClickHouse/pull/48015) ([Solomatov Sergei](https://github.com/solomatovs)).
* parseDateTime()：修复未定义行为（有符号整数溢出）。 [#48019](https://github.com/ClickHouse/ClickHouse/pull/48019) ([Robert Schulze](https://github.com/rschu1ze)).
* 在 Avro 中为 Record 使用唯一名称，避免复用其结构定义。 [#48057](https://github.com/ClickHouse/ClickHouse/pull/48057) ([Kruglov Pavel](https://github.com/Avogar)).
* 正确设置 Keeper 中 TCP/HTTP 套接字的超时时间。 [#48108](https://github.com/ClickHouse/ClickHouse/pull/48108) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复 `Avro` 格式中可能通过空指针调用成员的问题。 [#48184](https://github.com/ClickHouse/ClickHouse/pull/48184) ([Kruglov Pavel](https://github.com/Avogar)).
