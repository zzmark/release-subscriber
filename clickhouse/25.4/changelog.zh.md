<h3 id="254">
  ClickHouse 25.4 版本, 2025-04-22
</h3>

#### 向后不兼容变更

* `allow_materialized_view_with_bad_select` 为 `false` 时，检查物化视图的所有列是否都与目标表匹配。[#74481](https://github.com/ClickHouse/ClickHouse/pull/74481)（[Christoph Wurm](https://github.com/cwurm)）。
* 修复 `dateTrunc` 使用负数 Date/DateTime 参数的情况。[#77622](https://github.com/ClickHouse/ClickHouse/pull/77622)（[Yarik Briukhovetskyi](https://github.com/yariks5s)）。
* 移除旧版 `MongoDB` 集成。服务器设置 `use_legacy_mongodb_integration` 已过时，不再产生任何效果。[#77895](https://github.com/ClickHouse/ClickHouse/pull/77895)（[Robert Schulze](https://github.com/rschu1ze)）。
* 增强 `SummingMergeTree` 校验，跳过对分区键或排序键所用列的聚合。[#78022](https://github.com/ClickHouse/ClickHouse/pull/78022)（[Pervakov Grigorii](https://github.com/GrigoryPervakov)）。

#### 新功能

* 新增工作负载 CPU 槽位调度，详情见 [the docs](/docs/concepts/features/configuration/server-config/workload-scheduling#cpu_scheduling)。[#77595](https://github.com/ClickHouse/ClickHouse/pull/77595)（[Sergei Trifonov](https://github.com/serxa)）。
* 指定命令行参数 `--path` 后，`clickhouse-local` 会在重启后保留数据库。解决 [#50647](https://github.com/ClickHouse/ClickHouse/issues/50647) 和 [#49947](https://github.com/ClickHouse/ClickHouse/issues/49947)。[#71722](https://github.com/ClickHouse/ClickHouse/pull/71722)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 服务器过载时拒绝查询。该决策基于等待时间 `OSCPUWaitMicroseconds` 与忙碌时间 `OSCPUVirtualTimeMicroseconds` 的比值；该比值处于查询级设置 `min_os_cpu_wait_time_ratio_to_throw` 和 `max_os_cpu_wait_time_ratio_to_throw` 之间时，以一定概率丢弃查询。[#63206](https://github.com/ClickHouse/ClickHouse/pull/63206)（[Alexey Katsman](https://github.com/alexkats)）。
* `Iceberg` 时间旅行：新增设置，支持查询 `Iceberg` 表在指定时间戳时的状态。[#71072](https://github.com/ClickHouse/ClickHouse/pull/71072)（[Brett Hoerner](https://github.com/bretthoerner)）。[#77439](https://github.com/ClickHouse/ClickHouse/pull/77439)（[Daniil Ivanik](https://github.com/divanik)）。
* 新增 `Iceberg` 元数据内存缓存，存储清单文件、清单列表和 `metadata.json`，以加快查询。[#77156](https://github.com/ClickHouse/ClickHouse/pull/77156)（[Han Fei](https://github.com/hanfei1991)）。
* `DeltaLake` 表引擎支持 Azure Blob Storage。修复 [#68043](https://github.com/ClickHouse/ClickHouse/issues/68043)。[#74541](https://github.com/ClickHouse/ClickHouse/pull/74541)（[Smita Kulkarni](https://github.com/SmitaRKulkarni)）。
* 新增反序列化向量相似度索引的内存缓存，加快重复的近似最近邻（ANN）搜索查询。缓存大小由服务器设置 `vector_similarity_index_cache_size` 和 `vector_similarity_index_cache_max_entries` 控制。此功能取代先前版本的数据跳过索引缓存。[#77905](https://github.com/ClickHouse/ClickHouse/pull/77905)（[Shankar Iyer](https://github.com/shankar-iyer)）。
* 支持 DeltaLake 分区裁剪。[#78486](https://github.com/ClickHouse/ClickHouse/pull/78486)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 只读 `MergeTree` 表支持后台刷新，允许数量不受限的分布式读取端查询可更新的表，构成 ClickHouse 原生数据湖。[#76467](https://github.com/ClickHouse/ClickHouse/pull/76467)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 支持使用自定义磁盘存储数据库元数据文件，目前只能在服务器全局级别配置。[#77365](https://github.com/ClickHouse/ClickHouse/pull/77365)（[Tuan Pham Anh](https://github.com/tuanpach)）。
* plain\_rewritable 磁盘支持 ALTER TABLE ... ATTACH|DETACH|MOVE|REPLACE PARTITION。[#77406](https://github.com/ClickHouse/ClickHouse/pull/77406)（[Julia Kartseva](https://github.com/jkartseva)）。
* 为 `Kafka` 表引擎新增 `SASL` 配置和凭据的表设置，允许直接在 CREATE TABLE 语句中为 Kafka 及兼容系统配置基于 SASL 的身份验证，无需使用配置文件或命名集合。[#78810](https://github.com/ClickHouse/ClickHouse/pull/78810)（[Christoph Wurm](https://github.com/cwurm)）。
* 允许为 MergeTree 表设置 `default_compression_codec`；当 CREATE 查询没有为相应列显式指定编解码器时，使用该设置。解决 [#42005](https://github.com/ClickHouse/ClickHouse/issues/42005)。[#66394](https://github.com/ClickHouse/ClickHouse/pull/66394)（[gvoelfin](https://github.com/gvoelfin)）。
* 为集群配置新增 `bind_host`，让 ClickHouse 可以通过指定网络建立分布式连接。[#74741](https://github.com/ClickHouse/ClickHouse/pull/74741)（[Todd Yocum](https://github.com/toddyocum)）。
* 为 `system.tables` 新增列 `parametrized_view_parameters`。解决 [https://github.com/clickhouse/clickhouse/issues/66756](https://github.com/clickhouse/clickhouse/issues/66756)。[#75112](https://github.com/ClickHouse/ClickHouse/pull/75112)（[NamNguyenHoai](https://github.com/NamHoaiNguyen)）。
* 允许修改数据库注释。解决 [#73351](https://github.com/ClickHouse/ClickHouse/issues/73351) ### 面向用户的变更文档条目。[#75622](https://github.com/ClickHouse/ClickHouse/pull/75622)（[NamNguyenHoai](https://github.com/NamHoaiNguyen)）。
* PostgreSQL 兼容协议支持 `SCRAM-SHA-256` 身份验证。[#76839](https://github.com/ClickHouse/ClickHouse/pull/76839)（[scanhex12](https://github.com/scanhex12)）。
* 新增函数 `arrayLevenshteinDistance`、`arrayLevenshteinDistanceWeighted` 和 `arraySimilarity`。[#77187](https://github.com/ClickHouse/ClickHouse/pull/77187)（[Mikhail f. Shiryaev](https://github.com/Felixoid)）。
* 设置 `parallel_distributed_insert_select` 对写入 `ReplicatedMergeTree` 的 `INSERT SELECT` 生效，此前要求使用 Distributed 表。[#78041](https://github.com/ClickHouse/ClickHouse/pull/78041)（[Igor Nikonov](https://github.com/devcrafter)）。
* 新增 `toInterval` 函数，接受值和单位两个参数，将值转换为特定的 `Interval` 类型。[#78723](https://github.com/ClickHouse/ClickHouse/pull/78723)（[Andrew Davis](https://github.com/pulpdrew)）。
* 为 Iceberg 表函数和引擎增加几种便捷方式，以确定根 `metadata.json` 文件的位置。解决 [#78455](https://github.com/ClickHouse/ClickHouse/issues/78455)。[#78475](https://github.com/ClickHouse/ClickHouse/pull/78475)（[Daniil Ivanik](https://github.com/divanik)）。
* ClickHouse 的 SSH 协议支持基于密码的身份验证。[#78586](https://github.com/ClickHouse/ClickHouse/pull/78586)（[Nikita Mikhaylov](https://github.com/nikitamikhaylov)）。

#### 实验性功能

* 支持在 `WHERE` 子句中，将相关子查询用作 `EXISTS` 表达式的参数。解决 [#72459](https://github.com/ClickHouse/ClickHouse/issues/72459)。[#76078](https://github.com/ClickHouse/ClickHouse/pull/76078)（[Dmitry Novik](https://github.com/novikd)）。
* 新增 `sparseGrams` 和 `sparseGramsHashes` 函数，提供 ASCII 和 UTF8 版本。作者：[scanhex12](https://github.com/scanhex12)。[#78176](https://github.com/ClickHouse/ClickHouse/pull/78176)（[Pervakov Grigorii](https://github.com/GrigoryPervakov)）。请勿使用：其实现将在后续版本中更改。

#### 性能改进

* 通过延迟读取列优化性能，在 ORDER BY 和 LIMIT 之后再读取数据。[#55518](https://github.com/ClickHouse/ClickHouse/pull/55518)（[Xiaozhe Yu](https://github.com/wudidapaopao)）。
* 默认启用查询条件缓存。[#79080](https://github.com/ClickHouse/ClickHouse/pull/79080)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 通过对 `col->insertFrom()` 调用去虚拟化，加快 JOIN 结果构建。[#77350](https://github.com/ClickHouse/ClickHouse/pull/77350)（[Alexander Gololobov](https://github.com/davenger)）。
* 尽可能将查询计划过滤步骤中的等值条件合并到 JOIN 条件中，使其可用作哈希表键。[#78877](https://github.com/ClickHouse/ClickHouse/pull/78877)（[Dmitry Novik](https://github.com/novikd)）。
* 如果 JOIN 键是两侧数据片段主键的前缀，则对 JOIN 使用动态分片。通过设置 `query_plan_join_shard_by_pk_ranges` 启用此优化，默认关闭。[#74733](https://github.com/ClickHouse/ClickHouse/pull/74733)（[Nikolai Kochetov](https://github.com/KochetovNicolai)）。
* 支持根据列的上下界值裁剪 `Iceberg` 数据。修复 [#77638](https://github.com/ClickHouse/ClickHouse/issues/77638)。[#78242](https://github.com/ClickHouse/ClickHouse/pull/78242)（[alesapin](https://github.com/alesapin)）。
* 为 `Iceberg` 实现简单计数优化。不包含过滤条件的 `count()` 查询现在应更快。解决 [#77639](https://github.com/ClickHouse/ClickHouse/issues/77639)。[#78090](https://github.com/ClickHouse/ClickHouse/pull/78090)（[alesapin](https://github.com/alesapin)）。
* 支持通过 `max_merge_delayed_streams_for_parallel_write` 配置合并时可并行刷写的列数；这应能将面向 S3 的垂直合并内存占用降低至约原来的 1/25。[#77922](https://github.com/ClickHouse/ClickHouse/pull/77922)（[Azat Khuzhin](https://github.com/azat)）。
* 缓存被被动使用时（如合并场景）禁用 `filesystem_cache_prefer_bigger_buffer_size`，降低合并内存占用。[#77898](https://github.com/ClickHouse/ClickHouse/pull/77898)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 启用并行副本读取时，根据副本数量确定任务大小，在待读数据量不大时更均衡地分配副本间工作。[#78695](https://github.com/ClickHouse/ClickHouse/pull/78695)（[Nikita Taranov](https://github.com/nickitat)）。
* `ORC` 格式支持异步 I/O 预取，通过隐藏远程 I/O 延迟提升整体性能。[#70534](https://github.com/ClickHouse/ClickHouse/pull/70534)（[李扬](https://github.com/taiyang-li)）。
* 为异步插入预分配内存以提高性能。[#74945](https://github.com/ClickHouse/ClickHouse/pull/74945)（[Ilya Golshtein](https://github.com/ilejn)）。
* 在可使用 `multiRead` 的地方不再发送单独的 `get` 请求，减少 Keeper 请求量；此前副本数量增加时，这些单独请求可能给 Keeper 带来较大负载。[#56862](https://github.com/ClickHouse/ClickHouse/pull/56862)（[Nikolay Degterinsky](https://github.com/evillique)）。
* 小幅优化对 Nullable 参数执行函数的性能。[#76489](https://github.com/ClickHouse/ClickHouse/pull/76489)（[李扬](https://github.com/taiyang-li)）。
* 优化 `arraySort`。[#76850](https://github.com/ClickHouse/ClickHouse/pull/76850)（[李扬](https://github.com/taiyang-li)）。
* 合并同一数据片段的标记，一次性写入查询条件缓存，减少锁开销。[#77377](https://github.com/ClickHouse/ClickHouse/pull/77377)（[zhongyuankai](https://github.com/zhongyuankai)）。
* 优化包含一次括号展开的查询的 `s3Cluster` 性能。[#77686](https://github.com/ClickHouse/ClickHouse/pull/77686)（[Tomáš Hromada](https://github.com/gyfis)）。
* 优化按单个 Nullable 或 LowCardinality 列排序的性能。[#77789](https://github.com/ClickHouse/ClickHouse/pull/77789)（[李扬](https://github.com/taiyang-li)）。
* 优化 `Native` 格式的内存占用。[#78442](https://github.com/ClickHouse/ClickHouse/pull/78442)（[Azat Khuzhin](https://github.com/azat)）。
* 简单优化：需要类型转换时，不将 `count(if(...))` 重写为 `countIf`。解决 [#78564](https://github.com/ClickHouse/ClickHouse/issues/78564)。[#78565](https://github.com/ClickHouse/ClickHouse/pull/78565)（[李扬](https://github.com/taiyang-li)）。
* `hasAll` 函数现在可以利用 `tokenbf_v1`、`ngrambf_v1` 全文数据跳过索引。[#77662](https://github.com/ClickHouse/ClickHouse/pull/77662)（[UnamedRus](https://github.com/UnamedRus)）。
* 向量相似度索引此前可能将主内存分配量放大至所需值的 2 倍。此次重构内存分配策略，减少内存占用，并提高向量相似度索引缓存的有效性（问题 [#78056](https://github.com/ClickHouse/ClickHouse/issues/78056)）。[#78394](https://github.com/ClickHouse/ClickHouse/pull/78394)（[Shankar Iyer](https://github.com/shankar-iyer)）。
* 为 `system.metric_log` 表新增结构类型设置 `schema_type`，允许三种结构：`wide` 为现有结构，每项指标/事件单独一列，最适合读取个别列；`transposed` 类似 `system.asynchronous_metric_log`，以行存储指标/事件；最值得关注的 `transposed_with_wide_view` 创建使用 `transposed` 结构的底层表，同时提供 `wide` 结构的视图，将查询转换为对底层表的查询。`transposed_with_wide_view` 的视图不支持亚秒级精度，`event_time_microseconds` 仅为保持向后兼容而设置的别名。[#78412](https://github.com/ClickHouse/ClickHouse/pull/78412)（[alesapin](https://github.com/alesapin)）。

#### 改进

* 支持序列化 `Distributed` 查询的查询计划。新增设置 `serialize_query_plan`；启用后，来自 `Distributed` 表的查询使用序列化查询计划进行远程执行。这为 TCP 协议引入一种新数据包，需在服务器配置中添加 `<process_query_plan_packet>true</process_query_plan_packet>` 才允许处理。[#69652](https://github.com/ClickHouse/ClickHouse/pull/69652)（[Nikolai Kochetov](https://github.com/KochetovNicolai)）。
* 支持从视图读取 `JSON` 类型及子列。[#76903](https://github.com/ClickHouse/ClickHouse/pull/76903)（[Pavel Kruglov](https://github.com/Avogar)）。
* 支持 ALTER DATABASE ... ON CLUSTER。[#79242](https://github.com/ClickHouse/ClickHouse/pull/79242)（[Tuan Pham Anh](https://github.com/tuanpach)）。
* 可刷新物化视图的刷新操作现在会出现在 `system.query_log` 中。[#71333](https://github.com/ClickHouse/ClickHouse/pull/71333)（[Michael Kolupaev](https://github.com/al13n321)）。
* 用户定义函数（UDF）现在可通过配置中的新设置标记为确定性函数。查询缓存也会检查查询调用的 UDF 是否确定；如果是，则缓存查询结果（问题 [#59988](https://github.com/ClickHouse/ClickHouse/issues/59988)）。[#77769](https://github.com/ClickHouse/ClickHouse/pull/77769)（[Jimmy Aguilar Mena](https://github.com/Ergus)）。
* 为所有类型的复制任务启用退避逻辑，以减少 CPU 使用、内存占用和日志文件大小。新增设置 `max_postpone_time_for_failed_replicated_fetches_ms`、`max_postpone_time_for_failed_replicated_merges_ms` 和 `max_postpone_time_for_failed_replicated_tasks_ms`，类似于 `max_postpone_time_for_failed_mutations_ms`。[#74576](https://github.com/ClickHouse/ClickHouse/pull/74576)（[MikhailBurdukov](https://github.com/MikhailBurdukov)）。
* 为 `system.errors` 新增 `query_id`。解决 [#75815](https://github.com/ClickHouse/ClickHouse/issues/75815)。[#76581](https://github.com/ClickHouse/ClickHouse/pull/76581)（[Vladimir Baikov](https://github.com/bkvvldmr)）。
* 支持将 `UInt128` 转换为 `IPv6`，从而可以对 `IPv6` 执行 `bitAnd` 和算术运算，再转换回 `IPv6`。解决 [#76752](https://github.com/ClickHouse/ClickHouse/issues/76752)。这也允许将 `IPv6` 上的 `bitAnd` 运算结果转换回 `IPv6`。另见 [#57707](https://github.com/ClickHouse/ClickHouse/pull/57707)。[#76928](https://github.com/ClickHouse/ClickHouse/pull/76928)（[Muzammil Abdul Rehman](https://github.com/muzammilar)）。
* 默认不在文本格式的 `Variant` 类型内部解析特殊 `Bool` 值，可通过设置 `allow_special_bool_values_inside_variant` 启用。[#76974](https://github.com/ClickHouse/ClickHouse/pull/76974)（[Pavel Kruglov](https://github.com/Avogar)）。
* 支持在会话级和服务器级配置低 `priority` 查询中每个任务的等待时间。[#77013](https://github.com/ClickHouse/ClickHouse/pull/77013)（[VicoWu](https://github.com/VicoWu)）。
* 实现 JSON 数据类型值的比较，现在可以像 Map 一样比较 JSON 对象。[#77397](https://github.com/ClickHouse/ClickHouse/pull/77397)（[Pavel Kruglov](https://github.com/Avogar)）。
* 改进 `system.kafka_consumers` 的权限支持，并转发内部 `librdkafka` 错误；这个库很糟糕。[#77700](https://github.com/ClickHouse/ClickHouse/pull/77700)（[Ilya Golshtein](https://github.com/ilejn)）。
* 新增 Buffer 表引擎设置校验。[#77840](https://github.com/ClickHouse/ClickHouse/pull/77840)（[Pervakov Grigorii](https://github.com/GrigoryPervakov)）。
* 新增配置 `enable_hdfs_pread`，用于启用或禁用 `HDFS` 中的 pread。[#77885](https://github.com/ClickHouse/ClickHouse/pull/77885)（[kevinyhzou](https://github.com/KevinyhZou)）。
* 新增性能分析事件，统计 ZooKeeper 的 `multi` 读取和写入请求数。[#77888](https://github.com/ClickHouse/ClickHouse/pull/77888)（[JackyWoo](https://github.com/JackyWoo)）。
* 启用 `disable_insertion_and_mutation` 时，允许创建临时表并向其中插入数据。[#77901](https://github.com/ClickHouse/ClickHouse/pull/77901)（[Xu Jia](https://github.com/XuJia0210)）。
* 将 `max_insert_delayed_streams_for_parallel_write` 降至 100。[#77919](https://github.com/ClickHouse/ClickHouse/pull/77919)（[Azat Khuzhin](https://github.com/azat)）。
* 修复 Joda 语法中 `yyy` 等年份格式的解析；如果你不熟悉 Joda，它来自 Java 生态。[#77973](https://github.com/ClickHouse/ClickHouse/pull/77973)（[李扬](https://github.com/taiyang-li)）。
* 按块顺序挂载 `MergeTree` 表的数据片段，这对 `ReplacingMergeTree` 等特殊合并算法很重要。解决 [#71009](https://github.com/ClickHouse/ClickHouse/issues/71009)。[#77976](https://github.com/ClickHouse/ClickHouse/pull/77976)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 查询脱敏规则现在可以在匹配成功时抛出 `LOGICAL_ERROR`，帮助检查预先定义的密码是否泄漏到任何日志位置。[#78094](https://github.com/ClickHouse/ClickHouse/pull/78094)（[Nikita Mikhaylov](https://github.com/nikitamikhaylov)）。
* 为 `information_schema.tables` 新增 `index_length_column` 列，增强与 MySQL 的兼容性。[#78119](https://github.com/ClickHouse/ClickHouse/pull/78119)（[Paweł Zakrzewski](https://github.com/KrzaQ)）。
* 新增指标 `TotalMergeFailures` 和 `NonAbortedMergeFailures`，用于检测短时间内大量合并失败的情况。[#78150](https://github.com/ClickHouse/ClickHouse/pull/78150)（[Miсhael Stetsyuk](https://github.com/mstetsyuk)）。
* 修复路径式 S3 URL 未指定对象键时的解析错误。[#78185](https://github.com/ClickHouse/ClickHouse/pull/78185)（[Arthur Passos](https://github.com/arthurpassos)）。
* 修复异步指标 `BlockActiveTime`、`BlockDiscardTime`、`BlockWriteTime`、`BlockQueueTime` 和 `BlockReadTime` 的值错误；此前 1 秒被错误报告为 0.001。[#78211](https://github.com/ClickHouse/ClickHouse/pull/78211)（[filimonov](https://github.com/filimonov)）。
* StorageS3(Azure)Queue 向物化视图推送数据出错时遵循 `loading_retries` 限制，此前会无限重试这些错误。[#78313](https://github.com/ClickHouse/ClickHouse/pull/78313)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复使用 `delta-kernel-rs` 实现的 DeltaLake 的性能和进度条。[#78368](https://github.com/ClickHouse/ClickHouse/pull/78368)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 运行时磁盘支持 `include`、`from_env`、`from_zk`。解决 [#78177](https://github.com/ClickHouse/ClickHouse/issues/78177)。[#78470](https://github.com/ClickHouse/ClickHouse/pull/78470)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 为长时间运行的变更操作在 `system.warnings` 表中添加动态警告。[#78658](https://github.com/ClickHouse/ClickHouse/pull/78658)（[Bharat Nallan](https://github.com/bharatnc)）。
* 为系统表 `system.query_condition_cache` 新增字段 `condition`，存储以其哈希值作为查询条件缓存键的明文条件。[#78671](https://github.com/ClickHouse/ClickHouse/pull/78671)（[Robert Schulze](https://github.com/rschu1ze)）。
* 允许 Hive 分区使用空值。[#78816](https://github.com/ClickHouse/ClickHouse/pull/78816)（[Arthur Passos](https://github.com/arthurpassos)）。
* 修复 `IN` 子句对 `BFloat16` 的类型转换；例如 `SELECT toBFloat16(1) IN [1, 2, 3];` 现在返回 `1`。解决 [#78754](https://github.com/ClickHouse/ClickHouse/issues/78754)。[#78839](https://github.com/ClickHouse/ClickHouse/pull/78839)（[Raufs Dunamalijevs](https://github.com/rienath)）。
* 设置 `disk = ...` 时，不检查 `MergeTree` 在其他磁盘上的数据片段。[#78855](https://github.com/ClickHouse/ClickHouse/pull/78855)（[Azat Khuzhin](https://github.com/azat)）。
* `system.query_log` 的 `used_data_type_families` 以规范名称记录数据类型。[#78972](https://github.com/ClickHouse/ClickHouse/pull/78972)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 在 `recoverLostReplica` 期间清理设置，与 [#78637](https://github.com/ClickHouse/ClickHouse/pull/78637) 中的处理一致。[#79113](https://github.com/ClickHouse/ClickHouse/pull/79113)（[Nikita Mikhaylov](https://github.com/nikitamikhaylov)）。
* 使用插入列进行 INFILE 结构推断。[#78490](https://github.com/ClickHouse/ClickHouse/pull/78490)（[Pervakov Grigorii](https://github.com/GrigoryPervakov)）。

#### 错误修复（正式稳定版本中用户可见的异常行为）

* 修复聚合投影使用 `count(Nullable)` 时投影分析不正确的问题，解决 [#74495](https://github.com/ClickHouse/ClickHouse/issues/74495)。此 PR 也为投影分析增加日志，说明使用或不使用投影的原因。[#74498](https://github.com/ClickHouse/ClickHouse/pull/74498)（[Amos Bird](https://github.com/amosbird)）。
* 修复 `DETACH PART` 期间的 `Part <...> does not contain in snapshot of previous virtual parts. (PART_IS_TEMPORARILY_LOCKED)` 错误。[#76039](https://github.com/ClickHouse/ClickHouse/pull/76039)（[Aleksei Filatov](https://github.com/aalexfvk)）。
* 修复分析器中含字面量表达式的数据跳过索引失效的问题，并在索引分析期间移除简单类型转换。[#77229](https://github.com/ClickHouse/ClickHouse/pull/77229)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复查询参数 `close_session` 不生效、导致命名会话只能在 `session_timeout` 到期后关闭的问题。[#77336](https://github.com/ClickHouse/ClickHouse/pull/77336)（[Alexey Katsman](https://github.com/alexkats)）。
* 修复没有挂载物化视图时从 NATS 服务器接收消息的问题。[#77392](https://github.com/ClickHouse/ClickHouse/pull/77392)（[Dmitry Novikov](https://github.com/dmitry-sles-novikov)）。
* 修复通过 `merge` 表函数读取空 `FileLog` 时的逻辑错误，解决 [#75575](https://github.com/ClickHouse/ClickHouse/issues/75575)。[#77441](https://github.com/ClickHouse/ClickHouse/pull/77441)（[Vladimir Cherkasov](https://github.com/vdimir)）。
* 从共享变体序列化 `Dynamic` 时使用默认格式设置。[#77572](https://github.com/ClickHouse/ClickHouse/pull/77572)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复检查表数据路径在本地磁盘上是否存在的问题。[#77608](https://github.com/ClickHouse/ClickHouse/pull/77608)（[Tuan Pham Anh](https://github.com/tuanpach)）。
* 修复将部分类型的常量值发送到远程的问题。[#77634](https://github.com/ClickHouse/ClickHouse/pull/77634)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复 S3/AzureQueue 中上下文过期导致的崩溃。[#77720](https://github.com/ClickHouse/ClickHouse/pull/77720)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 隐藏 RabbitMQ、Nats、Redis、AzureQueue 表引擎中的凭据。[#77755](https://github.com/ClickHouse/ClickHouse/pull/77755)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复 `argMin`/`argMax` 比较 `NaN` 时的未定义行为。[#77756](https://github.com/ClickHouse/ClickHouse/pull/77756)（[Raúl Marín](https://github.com/Algunenano)）。
* 即使操作未产生任何待写入数据块，也定期检查合并和变更操作是否已取消。[#77766](https://github.com/ClickHouse/ClickHouse/pull/77766)（[János Benjamin Antal](https://github.com/antaljanosbenjamin)）。
* 修复 Replicated 数据库中的可刷新物化视图无法在新增副本上工作的问题。[#77774](https://github.com/ClickHouse/ClickHouse/pull/77774)（[Michael Kolupaev](https://github.com/al13n321)）。
* 修复出现 `NOT_FOUND_COLUMN_IN_BLOCK` 错误时可能发生的崩溃。[#77854](https://github.com/ClickHouse/ClickHouse/pull/77854)（[Vladimir Cherkasov](https://github.com/vdimir)）。
* 修复 S3/AzureQueue 填充数据时发生的崩溃。[#77878](https://github.com/ClickHouse/ClickHouse/pull/77878)（[Bharat Nallan](https://github.com/bharatnc)）。
* 在 SSH 服务器中禁用历史记录模糊搜索，因为它需要 skim 库。[#78002](https://github.com/ClickHouse/ClickHouse/pull/78002)（[Azat Khuzhin](https://github.com/azat)）。
* 修复对未建索引列执行向量搜索时，如果表中另一向量列定义了向量相似度索引，查询会返回错误结果的问题（问题 [#77978](https://github.com/ClickHouse/ClickHouse/issues/77978)）。[#78069](https://github.com/ClickHouse/ClickHouse/pull/78069)（[Shankar Iyer](https://github.com/shankar-iyer)）。
* 修复提示“The requested output format {} is binary... Do you want to output it anyway? \[y/N]”中的一个微小错误。[#78095](https://github.com/ClickHouse/ClickHouse/pull/78095)（[Azat Khuzhin](https://github.com/azat)）。
* 修复 `toStartOfInterval` 的 origin 参数为零时的错误。[#78096](https://github.com/ClickHouse/ClickHouse/pull/78096)（[Yarik Briukhovetskyi](https://github.com/yariks5s)）。
* 禁止为 HTTP 接口指定空的 `session_id` 查询参数。[#78098](https://github.com/ClickHouse/ClickHouse/pull/78098)（[Alexey Katsman](https://github.com/alexkats)）。
* 修复 `Replicated` 数据库在 `ALTER` 查询后立即执行 `RENAME` 时可能发生的元数据覆盖。[#78107](https://github.com/ClickHouse/ClickHouse/pull/78107)（[Nikolay Degterinsky](https://github.com/evillique)）。
* 修复 `NATS` 引擎崩溃。[#78108](https://github.com/ClickHouse/ClickHouse/pull/78108)（[Dmitry Novikov](https://github.com/dmitry-sles-novikov)）。
* SSH 内嵌客户端不再尝试创建 history\_file；此前虽总是创建失败，但仍会尝试。[#78112](https://github.com/ClickHouse/ClickHouse/pull/78112)（[Azat Khuzhin](https://github.com/azat)）。
* 修复 `RENAME DATABASE` 或 `DROP TABLE` 查询后 `system.detached_tables` 显示错误信息的问题。[#78126](https://github.com/ClickHouse/ClickHouse/pull/78126)（[Nikolay Degterinsky](https://github.com/evillique)）。
* 修复 [#77274](https://github.com/ClickHouse/ClickHouse/pull/77274) 之后对 `Replicated` 数据库表数量过多的检查。此外，在创建存储前执行检查，避免为 `ReplicatedMergeTree` 或 `KeeperMap` 在 Keeper 中创建未纳入管理的节点。[#78127](https://github.com/ClickHouse/ClickHouse/pull/78127)（[Nikolay Degterinsky](https://github.com/evillique)）。
* 修复并发初始化 `S3Queue` 元数据可能导致的崩溃。[#78131](https://github.com/ClickHouse/ClickHouse/pull/78131)（[Azat Khuzhin](https://github.com/azat)）。
* `groupArray*` 函数的 `max_size` 参数为 Int 类型的 0 时，现在会报 `BAD_ARGUMENTS`，而非尝试使用该值执行，与 UInt 类型的现有行为一致。[#78140](https://github.com/ClickHouse/ClickHouse/pull/78140)（[Eduard Karacharov](https://github.com/korowa)）。
* 恢复丢失副本时，如果本地表在分离前已被移除，则避免崩溃。[#78173](https://github.com/ClickHouse/ClickHouse/pull/78173)（[Raúl Marín](https://github.com/Algunenano)）。
* 修复 `system.s3_queue_settings` 的“alterable”列总是返回 `false` 的问题。[#78187](https://github.com/ClickHouse/ClickHouse/pull/78187)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 掩盖 Azure 访问签名，使其不会显示给用户或出现在日志中。[#78189](https://github.com/ClickHouse/ClickHouse/pull/78189)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复 Wide 数据片段中带前缀子流的预取。[#78205](https://github.com/ClickHouse/ClickHouse/pull/78205)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复键数组类型为 `LowCardinality(Nullable)` 时，`mapFromArrays` 崩溃或返回错误结果的问题。[#78240](https://github.com/ClickHouse/ClickHouse/pull/78240)（[Eduard Karacharov](https://github.com/korowa)）。
* 修复 delta-kernel-rs 身份验证选项。[#78255](https://github.com/ClickHouse/ClickHouse/pull/78255)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 副本的 `disable_insertion_and_mutation` 为 true 时，不调度可刷新物化视图任务。任务本质上是插入操作，`disable_insertion_and_mutation` 为 true 时会失败。[#78277](https://github.com/ClickHouse/ClickHouse/pull/78277)（[Xu Jia](https://github.com/XuJia0210)）。
* 校验 `Merge` 引擎对底层表的访问权限。[#78339](https://github.com/ClickHouse/ClickHouse/pull/78339)（[Pervakov Grigorii](https://github.com/GrigoryPervakov)）。
* 修复查询 `Distributed` 表时可能忽略 `FINAL` 修饰符的问题。[#78428](https://github.com/ClickHouse/ClickHouse/pull/78428)（[Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)）。
* 位图为空时，`bitmapMin` 返回 uint32\_max；输入类型更大时返回 uint64\_max，与空 roaring\_bitmap 的最小值行为一致。[#78444](https://github.com/ClickHouse/ClickHouse/pull/78444)（[wxybear](https://github.com/wxybear)）。
* 启用 `distributed_aggregation_memory_efficient` 时，禁用读取 FROM 后紧接着的查询处理并行化，否则可能导致逻辑错误。解决 [#76934](https://github.com/ClickHouse/ClickHouse/issues/76934)。[#78500](https://github.com/ClickHouse/ClickHouse/pull/78500)（[flynn](https://github.com/ucasfl)）。
* 应用设置 `max_streams_to_max_threads_ratio` 后，如果计划读取流数量为零，则至少设置一个读取流。[#78505](https://github.com/ClickHouse/ClickHouse/pull/78505)（[Eduard Karacharov](https://github.com/korowa)）。
* 修复 `S3Queue` 存储中的逻辑错误“Cannot unregister: table uuid is not registered”。解决 [#78285](https://github.com/ClickHouse/ClickHouse/issues/78285)。[#78541](https://github.com/ClickHouse/ClickHouse/pull/78541)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 在同时启用 cgroups v1 和 v2 的系统上，ClickHouse 现在能够确定自身所属的 cgroup v2。[#78566](https://github.com/ClickHouse/ClickHouse/pull/78566)（[Grigory Korolev](https://github.com/gkorolev)）。
* 修复 `-Cluster` 表函数与表级设置一起使用时失败的问题。[#78587](https://github.com/ClickHouse/ClickHouse/pull/78587)（[Daniil Ivanik](https://github.com/divanik)）。
* 改进 INSERT 时对 ReplicatedMergeTree 不支持事务的检查。[#78633](https://github.com/ClickHouse/ClickHouse/pull/78633)（[Azat Khuzhin](https://github.com/azat)）。
* 挂载期间清理查询设置。[#78637](https://github.com/ClickHouse/ClickHouse/pull/78637)（[Raúl Marín](https://github.com/Algunenano)）。
* 修复 `iceberg_metadata_file_path` 指定无效路径时的崩溃。[#78688](https://github.com/ClickHouse/ClickHouse/pull/78688)（[alesapin](https://github.com/alesapin)）。
* 修复使用 delta-kernel-s 实现的 `DeltaLake` 表引擎中，读取结构与表结构不同且存在分区列时出现“not found column”错误的问题。[#78690](https://github.com/ClickHouse/ClickHouse/pull/78690)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复命名会话已安排关闭但尚未超时期间，创建同名新会话会导致新会话在旧会话原定关闭时刻被关闭的问题。[#78698](https://github.com/ClickHouse/ClickHouse/pull/78698)（[Alexey Katsman](https://github.com/alexkats)）。
* 修复从 `MongoDB` 引擎表或 `mongodb` 表函数读取数据的几类 `SELECT` 查询：`WHERE` 子句中对常量值进行隐式转换的查询（如 `WHERE datetime = '2025-03-10 00:00:00'`），以及带 `LIMIT` 和 `GROUP BY` 的查询。此前这些查询可能返回错误结果。[#78777](https://github.com/ClickHouse/ClickHouse/pull/78777)（[Anton Popov](https://github.com/CurtizJ)）。
* 运行 `CHECK TABLE` 时不阻塞表关闭。[#78782](https://github.com/ClickHouse/ClickHouse/pull/78782)（[Raúl Marín](https://github.com/Algunenano)）。
* Keeper 修复：修正所有情况下的临时节点计数。[#78799](https://github.com/ClickHouse/ClickHouse/pull/78799)（[Antonio Andelic](https://github.com/antonio2368)）。
* 修复使用 `view` 以外的表函数时 `StorageDistributed` 中的错误类型转换。解决 [#78464](https://github.com/ClickHouse/ClickHouse/issues/78464)。[#78828](https://github.com/ClickHouse/ClickHouse/pull/78828)（[Konstantin Bogdanov](https://github.com/thevar1able)）。
* 修复 `tupleElement(*, 1)` 格式化的一致性。解决 [#78639](https://github.com/ClickHouse/ClickHouse/issues/78639)。[#78832](https://github.com/ClickHouse/ClickHouse/pull/78832)（[Konstantin Bogdanov](https://github.com/thevar1able)）。
* `ssd_cache` 类型字典现在拒绝为 `block_size` 和 `write_buffer_size` 参数传入零或负数（问题 [#78314](https://github.com/ClickHouse/ClickHouse/issues/78314)）。[#78854](https://github.com/ClickHouse/ClickHouse/pull/78854)（[Elmi Ahmadov](https://github.com/ahmadov)）。
* 修复异常关闭后对可刷新 MATERIALIZED VIEW 执行 ALTER 时的崩溃。[#78858](https://github.com/ClickHouse/ClickHouse/pull/78858)（[Azat Khuzhin](https://github.com/azat)）。
* 修复 `CSV` 格式中无效 `DateTime` 值的解析。[#78919](https://github.com/ClickHouse/ClickHouse/pull/78919)（[Pavel Kruglov](https://github.com/Avogar)）。
* Keeper 修复：避免在失败的 multi 请求上触发监听通知。[#79247](https://github.com/ClickHouse/ClickHouse/pull/79247)（[Antonio Andelic](https://github.com/antonio2368)）。
* 修复显式指定最小值/最大值但其值为 `NULL` 时，读取 Iceberg 表失败的问题。Go Iceberg 库因生成这种糟糕的文件而为人所知。解决 [#78740](https://github.com/ClickHouse/ClickHouse/issues/78740)。[#78764](https://github.com/ClickHouse/ClickHouse/pull/78764)（[flynn](https://github.com/ucasfl)）。

#### 构建/测试/打包改进

* 在 Rust 中遵循 CPU 目标特性，并为所有 crate 启用 LTO。[#78590](https://github.com/ClickHouse/ClickHouse/pull/78590)（[Raúl Marín](https://github.com/Algunenano)）。
