<h3 id="259">
  ClickHouse 25.9 版本, 2025-09-25
</h3>

#### 向后不兼容变更

* 禁止对 IPv4/IPv6 执行无意义的二元运算：不允许 IPv4/IPv6 与非整数类型相加或相减。此前允许与浮点类型运算，并会对某些其他类型（如 DateTime）抛出逻辑错误。 [#86336](https://github.com/ClickHouse/ClickHouse/pull/86336) ([Raúl Marín](https://github.com/Algunenano)).
* 弃用设置 `allow_dynamic_metadata_for_data_lakes`。现在所有 Iceberg 表在执行每次查询前，都会尝试从存储获取最新表结构。 [#86366](https://github.com/ClickHouse/ClickHouse/pull/86366) ([Daniil Ivanik](https://github.com/divanik)).
* 更改 `OUTER JOIN ... USING` 子句中合并列的解析，使行为更一致：此前在 OUTER JOIN 中同时选择 USING 列和限定列（`a, t1.a, t2.a`）时，USING 列会错误解析为 `t1.a`，对右表中没有左表匹配的行显示 0/NULL。现在无论查询中还存在什么标识符，USING 子句的标识符始终解析为合并列，限定标识符则解析为未合并列。例如：\`\`\`sql SELECT a, t1.a, t2.a FROM (SELECT 1 as a WHERE 0) t1 FULL JOIN (SELECT 2 as a) t2 USING (a) -- Before: a=0, t1.a=0, t2.a=2 (incorrect - 'a' resolved to t1.a) -- After: a=2, t1.a=0, t2.a=2 (correct - 'a' is coalesced). [#80848](https://github.com/ClickHouse/ClickHouse/pull/80848) ([Vladimir Cherkasov](https://github.com/vdimir)).
* 将复制去重窗口增至 10000。此更改完全兼容，但可以想象，在表数量非常多的某些场景中可能增加资源消耗。 [#86820](https://github.com/ClickHouse/ClickHouse/pull/86820) ([Sema Checherinda](https://github.com/CheSema)).

#### 新功能

* 现在可以通过为 NATS 引擎指定新设置 `nats_stream` 和 `nats_consumer`，使用 NATS JetStream 消费消息。 [#84799](https://github.com/ClickHouse/ClickHouse/pull/84799) ([Dmitry Novikov](https://github.com/dmitry-sles-novikov)).
* 为 `arrowFlight` 表函数添加认证和 SSL 支持。 [#87120](https://github.com/ClickHouse/ClickHouse/pull/87120) ([Vitaly Baranov](https://github.com/vitlibar)).
* 为 `S3` 表引擎和 `s3` 表函数新增参数 `storage_class_name`，允许指定 AWS 支持的智能分层存储。支持键值格式，也支持已弃用的位置参数格式。 [#87122](https://github.com/ClickHouse/ClickHouse/pull/87122) ([alesapin](https://github.com/alesapin)).
* Iceberg 表引擎支持 `ALTER UPDATE`。 [#86059](https://github.com/ClickHouse/ClickHouse/pull/86059) ([scanhex12](https://github.com/scanhex12)).
* 新增系统表 `iceberg_metadata_log`，在 SELECT 语句期间获取 Iceberg 元数据文件。 [#86152](https://github.com/ClickHouse/ClickHouse/pull/86152) ([scanhex12](https://github.com/scanhex12)).
* `Iceberg` 和 `DeltaLake` 表支持通过存储级设置 `disk` 自定义磁盘配置。 [#86778](https://github.com/ClickHouse/ClickHouse/pull/86778) ([scanhex12](https://github.com/scanhex12)).
* 数据湖磁盘支持 Azure。 [#87173](https://github.com/ClickHouse/ClickHouse/pull/87173) ([scanhex12](https://github.com/scanhex12)).
* 支持基于 Azure Blob Storage 的 `Unity` 目录。 [#80013](https://github.com/ClickHouse/ClickHouse/pull/80013) ([Smita Kulkarni](https://github.com/SmitaRKulkarni)).
* `Iceberg` 写入支持更多格式（`ORC`、`Avro`）。关闭 [#86179](https://github.com/ClickHouse/ClickHouse/issues/86179)。 [#87277](https://github.com/ClickHouse/ClickHouse/pull/87277) ([scanhex12](https://github.com/scanhex12)).
* 新增系统表 `database_replicas`，包含数据库副本信息。 [#83408](https://github.com/ClickHouse/ClickHouse/pull/83408) ([Konstantin Morozov](https://github.com/k-morozov)).
* 新增函数 `arrayExcept`，将一个数组作为集合从另一个数组中减去。 [#82368](https://github.com/ClickHouse/ClickHouse/pull/82368) ([Joanna Hulboj](https://github.com/jh0x)).
* 新增 `system.aggregated_zookeeper_log` 表，按会话 ID、父路径和操作类型聚合 ZooKeeper 操作的统计信息（如操作次数、平均延迟和错误），并定期刷写到磁盘。 [#85102](https://github.com/ClickHouse/ClickHouse/pull/85102) [#87208](https://github.com/ClickHouse/ClickHouse/pull/87208) ([Miсhael Stetsyuk](https://github.com/mstetsyuk)).
* 新增函数 `isValidASCII`。输入字符串或 FixedString 仅含 ASCII 字节（0x00–0x7F）时返回 1，否则返回 0。关闭 [#85377](https://github.com/ClickHouse/ClickHouse/issues/85377)。…… [#85786](https://github.com/ClickHouse/ClickHouse/pull/85786) ([rajat mohan](https://github.com/rajatmohan22)).
* 布尔设置可以不指定参数，例如 `SET use_query_cache;`，等价于将其设为 true。 [#85800](https://github.com/ClickHouse/ClickHouse/pull/85800) ([thraeka](https://github.com/thraeka)).
* 新增配置选项 `logger.startupLevel` 和 `logger.shutdownLevel`，分别覆盖 ClickHouse 启动和关闭期间的日志级别。 [#85967](https://github.com/ClickHouse/ClickHouse/pull/85967) ([Lennard Eijsackers](https://github.com/Blokje5)).
* 新增聚合函数 `timeSeriesChangesToGrid` 和 `timeSeriesResetsToGrid`。行为类似 `timeSeriesRateToGrid`，接受起始时间戳、结束时间戳、步长和回看窗口参数，以及时间戳和值两个实参，但每个窗口至少需要 1 个样本而非 2 个。计算 PromQL 的 `changes`/`resets`：对于参数定义的时间网格中每个时间戳，统计指定窗口内样本值变化或下降的次数。返回类型为 `Array(Nullable(Float64))`。 [#86010](https://github.com/ClickHouse/ClickHouse/pull/86010) ([Stephen Chi](https://github.com/stephchi0)).
* 允许用户以类似临时表的语法创建临时视图（`CREATE TEMPORARY VIEW`）。 [#86432](https://github.com/ClickHouse/ClickHouse/pull/86432) ([Aly Kafoury](https://github.com/AlyHKafoury)).
* 向 `system.warnings` 表添加 CPU 和内存使用警告。 [#86838](https://github.com/ClickHouse/ClickHouse/pull/86838) ([Bharat Nallan](https://github.com/bharatnc)).
* `Protobuf` 输入支持 `oneof` 指示列，可使用特殊列指示 oneof 中哪一部分存在。若消息包含 [oneof](https://protobuf.dev/programming-guides/proto3/#oneof)，且设置了 `input_format_protobuf_oneof_presence`，ClickHouse 会填充指示找到哪个 oneof 字段的列。 [#82885](https://github.com/ClickHouse/ClickHouse/pull/82885) ([Ilya Golshtein](https://github.com/ilejn)).
* 基于 jemalloc 内部工具改进内存分配性能分析。现在可通过配置 `jemalloc_enable_global_profiler` 启用全局 jemalloc 分析器；启用配置 `jemalloc_collect_global_profile_samples_in_trace_log`，可将采样的全局分配和释放以 `JemallocSample` 类型存入 `system.trace_log`。可通过设置 `jemalloc_enable_profiler` 为每个查询独立启用 jemalloc 分析，通过设置 `jemalloc_collect_profile_samples_in_trace_log` 按查询控制是否将样本存入 `system.trace_log`。将 jemalloc 更新至较新版本。 [#85438](https://github.com/ClickHouse/ClickHouse/pull/85438) ([Antonio Andelic](https://github.com/antonio2368)).
* 新增删除 Iceberg 表时同时删除文件的设置。关闭 [#86211](https://github.com/ClickHouse/ClickHouse/issues/86211)。 [#86501](https://github.com/ClickHouse/ClickHouse/pull/86501) ([scanhex12](https://github.com/scanhex12)).

#### 实验性功能

* 从头重构倒排文本索引，使其能够扩展到内存无法容纳的数据集。 [#86485](https://github.com/ClickHouse/ClickHouse/pull/86485) ([Anton Popov](https://github.com/CurtizJ)).
* JOIN 重排现在利用统计信息。可通过设置 `allow_statistics_optimize = 1` 和 `query_plan_optimize_join_order_limit = 10` 启用。 [#86822](https://github.com/ClickHouse/ClickHouse/pull/86822) ([Han Fei](https://github.com/hanfei1991)).
* 支持 `alter table ... materialize statistics all`，物化表的全部统计信息。 [#87197](https://github.com/ClickHouse/ClickHouse/pull/87197) ([Han Fei](https://github.com/hanfei1991)).

#### 性能改进

* 支持在读取期间使用数据跳过索引过滤数据片段，减少不必要的索引读取。由新设置 `use_skip_indexes_on_data_read` 控制（默认禁用）。解决 [#75774](https://github.com/ClickHouse/ClickHouse/issues/75774)，并包含与 [#81021](https://github.com/ClickHouse/ClickHouse/issues/81021) 共用的部分基础工作。 [#81526](https://github.com/ClickHouse/ClickHouse/pull/81526) ([Amos Bird](https://github.com/amosbird)).
* 新增 JOIN 顺序优化，可自动重排 JOIN 以提升性能（由 `query_plan_optimize_join_order_limit` 设置控制）。目前统计信息支持有限，主要依赖存储引擎提供的行数估算；后续版本会增加更完善的统计采集与基数估算。**如果升级后 JOIN 查询出现问题**，可暂时设置 `SET query_plan_use_new_logical_join_step = 0` 禁用新实现，并报告问题以便调查。**关于 USING 子句标识符解析的说明**：更改 `OUTER JOIN ... USING` 子句中合并列的解析，使行为更一致：此前在 OUTER JOIN 中同时选择 USING 列和限定列（`a, t1.a, t2.a`）时，USING 列会错误解析为 `t1.a`，对右表中没有左表匹配的行显示 0/NULL。现在无论查询中还存在什么标识符，USING 子句的标识符始终解析为合并列，限定标识符则解析为未合并列。例如：\`\`\`sql SELECT a, t1.a, t2.a FROM (SELECT 1 as a WHERE 0) t1 FULL JOIN (SELECT 2 as a) t2 USING (a) -- Before: a=0, t1.a=0, t2.a=2 (incorrect - 'a' resolved to t1.a) -- After: a=2, t1.a=0, t2.a=2 (correct - 'a' is coalesced). [#80848](https://github.com/ClickHouse/ClickHouse/pull/80848) ([Vladimir Cherkasov](https://github.com/vdimir)).
* 数据湖支持分布式 `INSERT SELECT`。 [#86783](https://github.com/ClickHouse/ClickHouse/pull/86783) ([scanhex12](https://github.com/scanhex12)).
* 改进 `func(primary_column) = 'xx'` 和 `column in (xxx)` 等条件的 PREWHERE 优化。 [#85529](https://github.com/ClickHouse/ClickHouse/pull/85529) ([李扬](https://github.com/taiyang-li)).
* 实现 JOIN 重写：1. 如果过滤条件对匹配或不匹配的行始终为假，将 `LEFT ANY JOIN` 和 `RIGHT ANY JOIN` 转换为 `SEMI`/`ANTI` JOIN，由新设置 `query_plan_convert_any_join_to_semi_or_anti_join` 控制。2. 如果过滤条件对某一侧不匹配的行始终为假，将 `FULL ALL JOIN` 转换为 `LEFT ALL` 或 `RIGHT ALL` JOIN。 [#86028](https://github.com/ClickHouse/ClickHouse/pull/86028) ([Dmitry Novik](https://github.com/novikd)).
* 改进执行轻量删除后的纵向合并性能。 [#86169](https://github.com/ClickHouse/ClickHouse/pull/86169) ([Anton Popov](https://github.com/CurtizJ)).
* 当 `LEFT/RIGHT` JOIN 存在大量不匹配行时，略微优化 `HashJoin` 性能。 [#86312](https://github.com/ClickHouse/ClickHouse/pull/86312) ([Nikita Taranov](https://github.com/nickitat)).
* 基数排序：帮助编译器使用 SIMD 并更好地预取。通过动态分派，仅在 Intel CPU 上使用软件预取。延续 @taiyang-li 在 [https://github.com/ClickHouse/ClickHouse/pull/77029](https://github.com/ClickHouse/ClickHouse/pull/77029) 中的工作。 [#86378](https://github.com/ClickHouse/ClickHouse/pull/86378) ([Raúl Marín](https://github.com/Algunenano)).
* 通过以 `devector` 替代 `deque` 优化 `MarkRanges`，改善表中有大量数据片段时的短查询性能。 [#86933](https://github.com/ClickHouse/ClickHouse/pull/86933) ([Azat Khuzhin](https://github.com/azat)).
* 改进连接模式下应用补丁数据片段的性能。 [#87094](https://github.com/ClickHouse/ClickHouse/pull/87094) ([Anton Popov](https://github.com/CurtizJ)).
* 新增设置 `query_condition_cache_selectivity_threshold`（默认 1.0），不将选择性低的谓词扫描结果写入查询条件缓存。这能以降低缓存命中率为代价，减少查询条件缓存的内存占用。 [#86076](https://github.com/ClickHouse/ClickHouse/pull/86076) ([zhongyuankai](https://github.com/zhongyuankai)).
* 降低 Iceberg 写入的内存占用。 [#86544](https://github.com/ClickHouse/ClickHouse/pull/86544) ([scanhex12](https://github.com/scanhex12)).

#### 改进

* 支持在一次插入中向 Iceberg 写入多个数据文件。新增设置 `iceberg_insert_max_rows_in_data_file` 和 `iceberg_insert_max_bytes_in_data_file` 控制限制。 [#86275](https://github.com/ClickHouse/ClickHouse/pull/86275) ([scanhex12](https://github.com/scanhex12)).
* 为 DeltaLake 插入的数据文件添加行数/字节数限制，由 `delta_lake_insert_max_rows_in_data_file` 和 `delta_lake_insert_max_bytes_in_data_file` 控制。 [#86357](https://github.com/ClickHouse/ClickHouse/pull/86357) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Iceberg 写入的分区支持更多类型。关闭 [#86206](https://github.com/ClickHouse/ClickHouse/issues/86206)。 [#86298](https://github.com/ClickHouse/ClickHouse/pull/86298) ([scanhex12](https://github.com/scanhex12)).
* 支持配置 S3 重试策略，并在修改 XML 配置文件时热重载 S3 磁盘设置。 [#82642](https://github.com/ClickHouse/ClickHouse/pull/82642) ([RinChanNOW](https://github.com/RinChanNOWWW)).
* 改进 S3(Azure)Queue 表引擎，使其在 ZooKeeper 连接断开后继续运行而不产生潜在重复。需启用 S3Queue 设置 `use_persistent_processing_nodes`（可通过 `ALTER TABLE MODIFY SETTING` 修改）。 [#85995](https://github.com/ClickHouse/ClickHouse/pull/85995) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 创建物化视图时，可在 `TO` 后使用查询参数，例如：`CREATE MATERIALIZED VIEW mv TO {to_table:Identifier} AS SELECT * FROM src_table`。 [#84899](https://github.com/ClickHouse/ClickHouse/pull/84899) ([Diskein](https://github.com/Diskein)).
* 为 `Kafka2` 表引擎指定错误设置时，向用户提供更清晰的说明。 [#83701](https://github.com/ClickHouse/ClickHouse/pull/83701) ([János Benjamin Antal](https://github.com/antaljanosbenjamin)).
* 不再允许为 `Time` 类型指定时区，因为这样没有意义。 [#84689](https://github.com/ClickHouse/ClickHouse/pull/84689) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 简化 `best_effort` 模式中解析 Time/Time64 的相关逻辑，并避免部分缺陷。 [#84730](https://github.com/ClickHouse/ClickHouse/pull/84730) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 新增 `deltaLakeAzureCluster` 函数（`deltaLakeAzure` 的集群模式版本）及 `deltaLakeS3Cluster` 函数（`deltaLakeCluster` 的别名）。解决 [#85358](https://github.com/ClickHouse/ClickHouse/issues/85358)。 [#85547](https://github.com/ClickHouse/ClickHouse/pull/85547) ([Smita Kulkarni](https://github.com/SmitaRKulkarni)).
* 像备份操作一样，将 `azure_max_single_part_copy_size` 设置应用于普通复制操作。 [#85767](https://github.com/ClickHouse/ClickHouse/pull/85767) ([Ilya Golshtein](https://github.com/ilejn)).
* S3 对象存储出现可重试错误时降低 S3 客户端线程速度。这将原设置 `backup_slow_all_threads_after_retryable_s3_error` 扩展至 S3 磁盘，并重命名为更通用的 `s3_slow_all_threads_after_retryable_error`。 [#85918](https://github.com/ClickHouse/ClickHouse/pull/85918) ([Julia Kartseva](https://github.com/jkartseva)).
* 将 allow\_experimental\_variant/dynamic/json 和 enable\_variant/dynamic/json 设置标记为废弃。现在这三种类型无条件启用。 [#85934](https://github.com/ClickHouse/ClickHouse/pull/85934) ([Pavel Kruglov](https://github.com/Avogar)).
* `http_handlers` 支持按完整 URL 字符串过滤（`full_url` 指令），包括协议和 host:port。 [#86155](https://github.com/ClickHouse/ClickHouse/pull/86155) ([Azat Khuzhin](https://github.com/azat)).
* 新增设置 `allow_experimental_delta_lake_writes`。 [#86180](https://github.com/ClickHouse/ClickHouse/pull/86180) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复 init.d 脚本对 systemd 的检测（修复“Install packages”检查）。 [#86187](https://github.com/ClickHouse/ClickHouse/pull/86187) ([Azat Khuzhin](https://github.com/azat)).
* 新增多维指标 `startup_scripts_failure_reason`，区分导致启动脚本失败的错误类型。特别是为告警需要区分暂时性错误（如 `MEMORY_LIMIT_EXCEEDED` 或 `KEEPER_EXCEPTION`）和非暂时性错误。 [#86202](https://github.com/ClickHouse/ClickHouse/pull/86202) ([Miсhael Stetsyuk](https://github.com/mstetsyuk)).
* 允许 Iceberg 表的分区省略 `identity` 函数。 [#86314](https://github.com/ClickHouse/ClickHouse/pull/86314) ([scanhex12](https://github.com/scanhex12)).
* 支持仅对特定日志通道启用 JSON 格式：将 `logger.formatting.channel` 设为 `syslog`/`console`/`errorlog`/`log` 之一。 [#86331](https://github.com/ClickHouse/ClickHouse/pull/86331) ([Azat Khuzhin](https://github.com/azat)).
* 允许在 `WHERE` 中使用原生数值；此前已允许它们作为逻辑函数参数。这简化了过滤下推及移入 PREWHERE 的优化。 [#86390](https://github.com/ClickHouse/ClickHouse/pull/86390) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复对元数据损坏的 Catalog 执行 `SYSTEM DROP REPLICA` 时的错误。 [#86391](https://github.com/ClickHouse/ClickHouse/pull/86391) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* 为 Azure 磁盘访问检查（`skip_access_check = 0`）添加额外重试，因为访问权限生效可能耗时很长。 [#86419](https://github.com/ClickHouse/ClickHouse/pull/86419) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 将 `timeSeries*()` 函数的陈旧度窗口改为左开右闭。 [#86588](https://github.com/ClickHouse/ClickHouse/pull/86588) ([Vitaly Baranov](https://github.com/vitlibar)).
* 新增 `FailedInternal*Query` 性能分析事件。 [#86627](https://github.com/ClickHouse/ClickHouse/pull/86627) ([Shane Andrade](https://github.com/mauidude)).
* 修复通过配置文件添加的名称含点号的用户的处理。 [#86633](https://github.com/ClickHouse/ClickHouse/pull/86633) ([Mikhail Koviazin](https://github.com/mkmkme)).
* 新增查询内存占用的异步指标（`QueriesMemoryUsage` 和 `QueriesPeakMemoryUsage`）。 [#86669](https://github.com/ClickHouse/ClickHouse/pull/86669) ([Azat Khuzhin](https://github.com/azat)).
* 可使用 `clickhouse-benchmark --precise` 标志更精确地报告 QPS 和其他按间隔统计的指标。当查询耗时接近报告间隔 `--delay D` 时，它有助于获得一致的 QPS。 [#86684](https://github.com/ClickHouse/ClickHouse/pull/86684) ([Sergei Trifonov](https://github.com/serxa)).
* 允许配置 Linux 线程的 nice 值，为部分线程（合并/变更、查询、物化视图、ZooKeeper 客户端）赋予更高或更低的优先级。 [#86703](https://github.com/ClickHouse/ClickHouse/pull/86703) ([Miсhael Stetsyuk](https://github.com/mstetsyuk)).
* 修复误导性的“specified upload does not exist”错误，该错误发生在分段上传中因竞态丢失原始异常时。 [#86725](https://github.com/ClickHouse/ClickHouse/pull/86725) ([Julia Kartseva](https://github.com/jkartseva)).
* 限制 `EXPLAIN` 查询中的查询计划描述。对于非 `EXPLAIN` 查询，不计算描述。新增设置 `query_plan_max_step_description_length`。 [#86741](https://github.com/ClickHouse/ClickHouse/pull/86741) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 支持调整待处理信号数量，尝试解决 CANNOT\_CREATE\_TIMER（查询分析器的 `query_profiler_real_time_period_ns`/`query_profiler_cpu_time_period_ns`）。同时从 `/proc/self/status` 采集 `SigQ` 以便观测：如果 `ProcessSignalQueueSize` 接近 `ProcessSignalQueueLimit`，很可能出现 `CANNOT_CREATE_TIMER` 错误。 [#86760](https://github.com/ClickHouse/ClickHouse/pull/86760) ([Azat Khuzhin](https://github.com/azat)).
* 改善 Keeper 的 `RemoveRecursive` 请求性能。 [#86789](https://github.com/ClickHouse/ClickHouse/pull/86789) ([Antonio Andelic](https://github.com/antonio2368)).
* 移除 `PrettyJSONEachRow` 输出 JSON 类型时的多余空白。 [#86819](https://github.com/ClickHouse/ClickHouse/pull/86819) ([Pavel Kruglov](https://github.com/Avogar)).
* plain rewritable 磁盘删除目录时，现在会写入 `prefix.path` 的 blob 大小。 [#86908](https://github.com/ClickHouse/ClickHouse/pull/86908) ([alesapin](https://github.com/alesapin)).
* 支持针对远程 ClickHouse 实例（包括 ClickHouse Cloud）运行性能测试。示例：`tests/performance/scripts/perf.py tests/performance/math.xml --runs 10 --user <username> --password <password> --host <hostname> --port <port> --secure`。 [#86995](https://github.com/ClickHouse/ClickHouse/pull/86995) ([Raufs Dunamalijevs](https://github.com/rienath)).
* 在已知会分配大量内存（>16MiB）的部分位置（排序、异步插入、文件日志）遵循内存限制。 [#87035](https://github.com/ClickHouse/ClickHouse/pull/87035) ([Azat Khuzhin](https://github.com/azat)).
* 若设置 `network_compression_method` 不是支持的通用编解码器，则抛出异常。 [#87097](https://github.com/ClickHouse/ClickHouse/pull/87097) ([Robert Schulze](https://github.com/rschu1ze)).
* 系统表 `system.query_cache` 现在返回*全部*查询结果缓存条目，此前仅返回共享条目或相同用户和角色的非共享条目。这没有问题，因为非共享条目应保护的是*查询结果*，而 `system.query_cache` 返回的是*查询字符串*。这样该系统表的行为更接近 `system.query_log`。 [#87104](https://github.com/ClickHouse/ClickHouse/pull/87104) ([Robert Schulze](https://github.com/rschu1ze)).
* 为 `parseDateTime` 函数启用短路求值。 [#87184](https://github.com/ClickHouse/ClickHouse/pull/87184) ([Pavel Kruglov](https://github.com/Avogar)).
* 为 `system.parts_columns` 新增 `statistics` 列。 [#87259](https://github.com/ClickHouse/ClickHouse/pull/87259) ([Han Fei](https://github.com/hanfei1991)).

#### 缺陷修复（正式稳定版本中用户可见的异常行为）

* 对于复制数据库和内部复制表，仅在发起节点验证 ALTER 查询结果，修复已提交的 ALTER 查询在其他节点卡住的情况。 [#83849](https://github.com/ClickHouse/ClickHouse/pull/83849) ([János Benjamin Antal](https://github.com/antaljanosbenjamin)).
* 限制 `BackgroundSchedulePool` 中各类任务的数量，避免某一类任务占满全部槽位、其他任务饥饿，也避免任务相互等待导致死锁。由服务器设置 `background_schedule_pool_max_parallel_tasks_per_type_ratio` 控制。 [#84008](https://github.com/ClickHouse/ClickHouse/pull/84008) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 恢复数据库副本时正确关闭表。不正确的关闭会使部分表引擎在数据库副本恢复期间出现 LOGICAL\_ERROR。 [#84744](https://github.com/ClickHouse/ClickHouse/pull/84744) ([Antonio Andelic](https://github.com/antonio2368)).
* 生成数据库名拼写纠错提示时检查访问权限。 [#85371](https://github.com/ClickHouse/ClickHouse/pull/85371) ([Dmitry Novik](https://github.com/novikd)).
* 1. Hive 列支持 LowCardinality。2. 先填充 Hive 列，再填充虚拟列（[https://github.com/ClickHouse/ClickHouse/pull/81040](https://github.com/ClickHouse/ClickHouse/pull/81040) 所需）。3. 修复 Hive 空格式的 LOGICAL\_ERROR [#85528](https://github.com/ClickHouse/ClickHouse/issues/85528)。4. 修复 Hive 分区列是全部列时的检查。5. 断言结构中指定了所有 Hive 列。6. 部分修复 parallel\_replicas\_cluster 与 Hive 配合使用的问题。7. 在 Hive 工具的 extractkeyValuePairs 中使用有序容器（[https://github.com/ClickHouse/ClickHouse/pull/81040](https://github.com/ClickHouse/ClickHouse/pull/81040) 所需）。 [#85538](https://github.com/ClickHouse/ClickHouse/pull/85538) ([Arthur Passos](https://github.com/arthurpassos)).
* 避免对 `IN` 函数的第一个参数进行不必要的优化，该优化有时会在使用数组映射时导致错误。 [#85546](https://github.com/ClickHouse/ClickHouse/pull/85546) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* Iceberg 源 ID 与 Parquet 名称间的映射未按 Parquet 文件写入时的结构调整。本 PR 为每个 Iceberg 数据文件处理其相关结构，而非当前结构。 [#85829](https://github.com/ClickHouse/ClickHouse/pull/85829) ([Daniil Ivanik](https://github.com/divanik)).
* 修复将读取文件大小与打开文件分开的问题。相关变更为 [https://github.com/ClickHouse/ClickHouse/pull/33372](https://github.com/ClickHouse/ClickHouse/pull/33372)，当时为应对 `5.10` 之前 Linux 内核的缺陷而引入。 [#85837](https://github.com/ClickHouse/ClickHouse/pull/85837) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* ClickHouse Keeper 不再因系统在内核层面禁用 IPv6（如 RHEL 的 ipv6.disable=1）而启动失败。初始 IPv6 监听器失败时，现在尝试回退至 IPv4 监听器。 [#85901](https://github.com/ClickHouse/ClickHouse/pull/85901) ([jskong1124](https://github.com/jskong1124)).
* 此 PR 关闭 [#77990](https://github.com/ClickHouse/ClickHouse/issues/77990)。为 globalJoin 中的 TableFunctionRemote 添加并行副本支持。 [#85929](https://github.com/ClickHouse/ClickHouse/pull/85929) ([zoomxi](https://github.com/zoomxi)).
* 修复 orcschemareader::initializeifneeded() 中的空指针。本 PR 解决以下问题：[#85292](https://github.com/ClickHouse/ClickHouse/issues/85292) ### 面向用户变更的文档条目。 [#85951](https://github.com/ClickHouse/ClickHouse/pull/85951) ([yanglongwei](https://github.com/ylw510)).
* 添加检查，仅在 FROM 子句中的相关子查询使用外层查询的列时才允许它。修复 [#85469](https://github.com/ClickHouse/ClickHouse/issues/85469)。修复 [#85402](https://github.com/ClickHouse/ClickHouse/issues/85402)。 [#85966](https://github.com/ClickHouse/ClickHouse/pull/85966) ([Dmitry Novik](https://github.com/novikd)).
* 修复对列执行 ALTER UPDATE 时，其子列被其他列的物化表达式引用的情况。此前表达式中含子列的物化列未被正确更新。 [#85985](https://github.com/ClickHouse/ClickHouse/pull/85985) ([Pavel Kruglov](https://github.com/Avogar)).
* 禁止修改子列被主键或分区表达式使用的列。 [#86005](https://github.com/ClickHouse/ClickHouse/pull/86005) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复 DeltaLake 存储在非默认列映射模式下读取子列。 [#86064](https://github.com/ClickHouse/ClickHouse/pull/86064) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复 JSON 内带 Enum 类型提示的路径使用错误默认值。 [#86065](https://github.com/ClickHouse/ClickHouse/pull/86065) ([Pavel Kruglov](https://github.com/Avogar)).
* 为数据湖 Hive 目录 URL 解析添加输入清理。关闭 [#86018](https://github.com/ClickHouse/ClickHouse/issues/86018)。 [#86092](https://github.com/ClickHouse/ClickHouse/pull/86092) ([rajat mohan](https://github.com/rajatmohan22)).
* 修复动态调整文件系统缓存大小时的逻辑错误。关闭 [#86122](https://github.com/ClickHouse/ClickHouse/issues/86122)。关闭 [https://github.com/ClickHouse/clickhouse-core-incidents/issues/473](https://github.com/ClickHouse/clickhouse-core-incidents/issues/473)。 [#86130](https://github.com/ClickHouse/ClickHouse/pull/86130) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 在 DatabaseReplicatedSettings 中为 `logs_to_keep` 使用 `NonZeroUInt64`。 [#86142](https://github.com/ClickHouse/ClickHouse/pull/86142) ([Tuan Pham Anh](https://github.com/tuanpach)).
* 修复使用设置`index_granularity_bytes = 0` 创建的表（如 `ReplacingMergeTree`）在执行带数据跳过索引的 `FINAL` 查询时抛出异常的问题。 [#86147](https://github.com/ClickHouse/ClickHouse/pull/86147) ([Shankar Iyer](https://github.com/shankar-iyer)).
* 移除未定义行为并修复 Iceberg 分区表达式解析问题。 [#86166](https://github.com/ClickHouse/ClickHouse/pull/86166) ([Daniil Ivanik](https://github.com/divanik)).
* 修复同一次 INSERT 中含常量和非常量数据块时的崩溃。 [#86230](https://github.com/ClickHouse/ClickHouse/pull/86230) ([Azat Khuzhin](https://github.com/azat)).
* 通过 SQL 创建磁盘时，默认处理来自 `/etc/metrika.xml` 的包含配置。 [#86232](https://github.com/ClickHouse/ClickHouse/pull/86232) ([alekar](https://github.com/alekar)).
* 修复从 String 到 JSON 的 accurateCastOrNull/accurateCastOrDefault。 [#86240](https://github.com/ClickHouse/ClickHouse/pull/86240) ([Pavel Kruglov](https://github.com/Avogar)).
* Iceberg 引擎支持不带 '/' 的目录。 [#86249](https://github.com/ClickHouse/ClickHouse/pull/86249) ([scanhex12](https://github.com/scanhex12)).
* 修复 replaceRegex 使用 FixedString 待搜索字符串和空搜索串时的崩溃。 [#86270](https://github.com/ClickHouse/ClickHouse/pull/86270) ([Raúl Marín](https://github.com/Algunenano)).
* 修复 ALTER UPDATE Nullable(JSON) 期间的崩溃。 [#86281](https://github.com/ClickHouse/ClickHouse/pull/86281) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复 system.tables 缺少 definer 列。 [#86295](https://github.com/ClickHouse/ClickHouse/pull/86295) ([Raúl Marín](https://github.com/Algunenano)).
* 修复从 LowCardinality(Nullable(T)) 到 Dynamic 的转换。 [#86365](https://github.com/ClickHouse/ClickHouse/pull/86365) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复写入 DeltaLake 期间的逻辑错误。关闭 [#86175](https://github.com/ClickHouse/ClickHouse/issues/86175)。 [#86367](https://github.com/ClickHouse/ClickHouse/pull/86367) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复 plain\_rewritable 磁盘从 Azure Blob Storage 读取空 blob 时的 `416 The range specified is invalid for the current size of the resource. The range specified is invalid for the current size of the resource`。 [#86400](https://github.com/ClickHouse/ClickHouse/pull/86400) ([Julia Kartseva](https://github.com/jkartseva)).
* 修复 GROUP BY Nullable(JSON)。 [#86410](https://github.com/ClickHouse/ClickHouse/pull/86410) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复物化视图缺陷：创建、删除后再以相同名称创建的物化视图可能无法工作。 [#86413](https://github.com/ClickHouse/ClickHouse/pull/86413) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 从 \*cluster 函数读取时，如果所有副本均不可用，则失败。 [#86414](https://github.com/ClickHouse/ClickHouse/pull/86414) ([Julian Maicher](https://github.com/jmaicher)).
* 修复 `Buffer` 表引起的 `MergesMutationsMemoryTracking` 泄漏，并修复从 `Kafka` 等引擎流式处理时的 `query_views_log`。 [#86422](https://github.com/ClickHouse/ClickHouse/pull/86422) ([Azat Khuzhin](https://github.com/azat)).
* 修复删除别名存储引用的表后的 SHOW TABLES。 [#86433](https://github.com/ClickHouse/ClickHouse/pull/86433) ([RinChanNOW](https://github.com/RinChanNOWWW)).
* 修复启用 send\_chunk\_header 且通过 HTTP 协议调用 UDF 时缺少块头。 [#86469](https://github.com/ClickHouse/ClickHouse/pull/86469) ([Vladimir Cherkasov](https://github.com/vdimir)).
* 修复启用 jemalloc 性能分析结果刷写时可能发生的死锁。 [#86473](https://github.com/ClickHouse/ClickHouse/pull/86473) ([Azat Khuzhin](https://github.com/azat)).
* 修复 DeltaLake 表引擎读取子列。关闭 [#86204](https://github.com/ClickHouse/ClickHouse/issues/86204)。 [#86477](https://github.com/ClickHouse/ClickHouse/pull/86477) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 正确处理回环主机 ID，避免处理 DDL 任务时发生冲突。 [#86479](https://github.com/ClickHouse/ClickHouse/pull/86479) ([Tuan Pham Anh](https://github.com/tuanpach)).
* 修复 PostgreSQL 数据库引擎中含 numeric/decimal 列的表的分离/附加。 [#86480](https://github.com/ClickHouse/ClickHouse/pull/86480) ([Julian Maicher](https://github.com/jmaicher)).
* 修复 getSubcolumnType 使用未初始化内存。 [#86498](https://github.com/ClickHouse/ClickHouse/pull/86498) ([Raúl Marín](https://github.com/Algunenano)).
* 函数 `searchAny` 和 `searchAll` 在搜索串集合为空时，现在返回 `true`（即“匹配所有内容”）。此前返回 `false`。（问题 [#86300](https://github.com/ClickHouse/ClickHouse/issues/86300)）。 [#86500](https://github.com/ClickHouse/ClickHouse/pull/86500) ([Elmi Ahmadov](https://github.com/ahmadov)).
* 修复第一个桶没有值时的函数 `timeSeriesResampleToGridWithStaleness()`。 [#86507](https://github.com/ClickHouse/ClickHouse/pull/86507) ([Vitaly Baranov](https://github.com/vitlibar)).
* 修复将 `merge_tree_min_read_task_size` 设为 0 导致的崩溃。 [#86527](https://github.com/ClickHouse/ClickHouse/pull/86527) ([yanglongwei](https://github.com/ylw510)).
* 读取时从 Iceberg 元数据获取各数据文件的格式（此前从表参数获取）。 [#86529](https://github.com/ClickHouse/ClickHouse/pull/86529) ([Daniil Ivanik](https://github.com/divanik)).
* 忽略关闭期间刷写日志的异常，使关闭过程更安全，避免 SIGSEGV。 [#86546](https://github.com/ClickHouse/ClickHouse/pull/86546) ([Azat Khuzhin](https://github.com/azat)).
* 修复 Backup 数据库引擎查询大小为零的数据片段文件时抛出异常。 [#86563](https://github.com/ClickHouse/ClickHouse/pull/86563) ([Max Justus Spransy](https://github.com/maxjustus)).
* 修复启用 send\_chunk\_header 且通过 HTTP 协议调用 UDF 时缺少块头。 [#86606](https://github.com/ClickHouse/ClickHouse/pull/86606) ([Vladimir Cherkasov](https://github.com/vdimir)).
* 修复 Keeper 会话过期导致的 S3Queue 逻辑错误“Expected current processor {} to be equal to {}”。 [#86615](https://github.com/ClickHouse/ClickHouse/pull/86615) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复插入和裁剪中的可空性缺陷。关闭 [#86407](https://github.com/ClickHouse/ClickHouse/issues/86407)。 [#86630](https://github.com/ClickHouse/ClickHouse/pull/86630) ([scanhex12](https://github.com/scanhex12)).
* 禁用 Iceberg 元数据缓存时，不禁用文件系统缓存。 [#86635](https://github.com/ClickHouse/ClickHouse/pull/86635) ([Daniil Ivanik](https://github.com/divanik)).
* 修复 Parquet 读取器 v3 中的 'Deadlock in Parquet::ReadManager (single-threaded)' 错误。 [#86644](https://github.com/ClickHouse/ClickHouse/pull/86644) ([Michael Kolupaev](https://github.com/al13n321)).
* 修复 ArrowFlight 的 `listen_host` 对 IPv6 的支持。 [#86664](https://github.com/ClickHouse/ClickHouse/pull/86664) ([Vitaly Baranov](https://github.com/vitlibar)).
* 修复 `ArrowFlight` 处理器的关闭。本 PR 修复 [#86596](https://github.com/ClickHouse/ClickHouse/issues/86596)。 [#86665](https://github.com/ClickHouse/ClickHouse/pull/86665) ([Vitaly Baranov](https://github.com/vitlibar)).
* 修复 `describe_compact_output=1` 时的分布式查询。 [#86676](https://github.com/ClickHouse/ClickHouse/pull/86676) ([Azat Khuzhin](https://github.com/azat)).
* 修复窗口定义解析和查询参数应用。 [#86720](https://github.com/ClickHouse/ClickHouse/pull/86720) ([Azat Khuzhin](https://github.com/azat)).
* 修复创建包含 `PARTITION BY` 但没有分区通配符的表时，出现 `Partition strategy wildcard can not be used without a '_partition_id' wildcard.` 异常的问题；这种操作在 25.8 之前的版本中可以正常执行。关闭 [https://github.com/ClickHouse/clickhouse-private/issues/37567](https://github.com/ClickHouse/clickhouse-private/issues/37567)。 [#86748](https://github.com/ClickHouse/ClickHouse/pull/86748) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复并行查询尝试获取同一把锁时的 LogicalError。 [#86751](https://github.com/ClickHouse/ClickHouse/pull/86751) ([Pervakov Grigorii](https://github.com/GrigoryPervakov)).
* 修复 RowBinary 输入格式将 NULL 写入 JSON 共享数据，并在 ColumnObject 中添加额外验证。 [#86812](https://github.com/ClickHouse/ClickHouse/pull/86812) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复带 limit 的空 Tuple 排列。 [#86828](https://github.com/ClickHouse/ClickHouse/pull/86828) ([Pavel Kruglov](https://github.com/Avogar)).
* 不为持久化处理节点使用单独的 Keeper 节点。修复 [https://github.com/ClickHouse/ClickHouse/pull/85995](https://github.com/ClickHouse/ClickHouse/pull/85995)。关闭 [#86406](https://github.com/ClickHouse/ClickHouse/issues/86406)。 [#86841](https://github.com/ClickHouse/ClickHouse/pull/86841) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复 TimeSeries 引擎表破坏 Replicated 数据库新副本创建的问题。 [#86845](https://github.com/ClickHouse/ClickHouse/pull/86845) ([Nikolay Degterinsky](https://github.com/evillique)).
* 修复任务缺少某些 Keeper 节点时查询 `system.distributed_ddl_queue`。 [#86848](https://github.com/ClickHouse/ClickHouse/pull/86848) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复在解压后的数据块末尾定位。 [#86906](https://github.com/ClickHouse/ClickHouse/pull/86906) ([Pavel Kruglov](https://github.com/Avogar)).
* 处理 Iceberg 迭代器异步执行期间抛出的异常。 [#86932](https://github.com/ClickHouse/ClickHouse/pull/86932) ([Daniil Ivanik](https://github.com/divanik)).
* 修复保存较大的预处理 XML 配置。 [#86934](https://github.com/ClickHouse/ClickHouse/pull/86934) ([c-end](https://github.com/c-end)).
* 修复 system.iceberg\_metadata\_log 表中日期字段的填充。 [#86961](https://github.com/ClickHouse/ClickHouse/pull/86961) ([Daniil Ivanik](https://github.com/divanik)).
* 修复带 `WHERE` 的 `TTL` 无限重新计算。 [#86965](https://github.com/ClickHouse/ClickHouse/pull/86965) ([Anton Popov](https://github.com/CurtizJ)).
* 修复 `uniqExact` 函数配合 `ROLLUP` 和 `CUBE` 修饰符时可能产生错误结果。 [#87014](https://github.com/ClickHouse/ClickHouse/pull/87014) ([Nikita Taranov](https://github.com/nickitat)).
* 修复 `parallel_replicas_for_cluster_functions` 设为 1 时，`url()` 表函数解析表结构。 [#87029](https://github.com/ClickHouse/ClickHouse/pull/87029) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 将 PREWHERE 拆成多个步骤后，正确转换其输出。 [#87040](https://github.com/ClickHouse/ClickHouse/pull/87040) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复带 `ON CLUSTER` 子句的轻量更新。 [#87043](https://github.com/ClickHouse/ClickHouse/pull/87043) ([Anton Popov](https://github.com/CurtizJ)).
* 修复部分带 String 参数的聚合函数状态的兼容性。 [#87049](https://github.com/ClickHouse/ClickHouse/pull/87049) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复 OpenAI 模型名称未被传递的问题。 [#87100](https://github.com/ClickHouse/ClickHouse/pull/87100) ([Kaushik Iska](https://github.com/iskakaushik)).
* EmbeddedRocksDB：路径必须位于 user\_files 内。 [#87109](https://github.com/ClickHouse/ClickHouse/pull/87109) ([Raúl Marín](https://github.com/Algunenano)).
* 修复 25.1 之前创建的 KeeperMap 表在 DROP 查询后遗留 ZooKeeper 数据。 [#87112](https://github.com/ClickHouse/ClickHouse/pull/87112) ([Nikolay Degterinsky](https://github.com/evillique)).
* 修复读取 Parquet 中 Map 和 Array 的字段 ID。 [#87136](https://github.com/ClickHouse/ClickHouse/pull/87136) ([scanhex12](https://github.com/scanhex12)).
* 修复延迟物化读取数组及其数组大小子列。 [#87139](https://github.com/ClickHouse/ClickHouse/pull/87139) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复带 Dynamic 参数的 CASE 函数。 [#87177](https://github.com/ClickHouse/ClickHouse/pull/87177) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复从 CSV 空字符串读取空数组。 [#87182](https://github.com/ClickHouse/ClickHouse/pull/87182) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复非相关 `EXISTS` 可能产生错误结果的问题。由 [https://github.com/ClickHouse/ClickHouse/pull/85481](https://github.com/ClickHouse/ClickHouse/pull/85481) 引入的 `execute_exists_as_scalar_subquery=1` 会触发该问题，影响 `25.8`。修复 [#86415](https://github.com/ClickHouse/ClickHouse/issues/86415)。 [#87207](https://github.com/ClickHouse/ClickHouse/pull/87207) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 未配置 iceberg\_metadata\_log 但用户尝试获取 Iceberg 调试元数据信息时抛出错误，修复空指针访问。 [#87250](https://github.com/ClickHouse/ClickHouse/pull/87250) ([Daniil Ivanik](https://github.com/divanik)).

#### 构建/测试/打包改进

* 修复与 abseil-cpp 20250814.0 的兼容性，[https://github.com/abseil/abseil-cpp/issues/1923](https://github.com/abseil/abseil-cpp/issues/1923)。 [#85970](https://github.com/ClickHouse/ClickHouse/pull/85970) ([Yuriy Chernyshov](https://github.com/georgthegreat)).
* 通过标志控制是否构建独立 WASM 词法分析器。 [#86505](https://github.com/ClickHouse/ClickHouse/pull/86505) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 修复不支持 `vmull_p64` 指令的旧 ARM CPU 上 crc32c 的构建。 [#86521](https://github.com/ClickHouse/ClickHouse/pull/86521) ([Pablo Marcos](https://github.com/pamarcos)).
* 使用 `openldap` 2.6.10。 [#86623](https://github.com/ClickHouse/ClickHouse/pull/86623) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 在 Darwin 上不尝试拦截 `memalign`。 [#86769](https://github.com/ClickHouse/ClickHouse/pull/86769) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 使用 `krb5` 1.22.1-final。 [#86836](https://github.com/ClickHouse/ClickHouse/pull/86836) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 修复 `list-licenses.sh` 中 Rust crate 名称的解包。 [#87305](https://github.com/ClickHouse/ClickHouse/pull/87305) ([Konstantin Bogdanov](https://github.com/thevar1able)).
