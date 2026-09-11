<h3 id="a-id2411a-clickhouse-release-2411-2024-11-26">
  <a id="2411" /> ClickHouse 24.11 版本, 2024-11-26. [演示文稿](https://presentations.clickhouse.com/2024-release-24.11/), [视频](https://www.youtube.com/watch?v=0hpTvtq__4g)
</h3>

<Frame>
  <iframe src="https://www.youtube.com/embed/0hpTvtq__4g" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
</Frame>

<h4 id="backward-incompatible-change-1">
  向后不兼容变更
</h4>

* 移除误添加的系统表 `generate_series` 和 `generateSeries`，它们来自 [#59390](https://github.com/ClickHouse/ClickHouse/issues/59390)。 [#71091](https://github.com/ClickHouse/ClickHouse/pull/71091) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 移除 `StorageExternalDistributed`。关闭 [#70600](https://github.com/ClickHouse/ClickHouse/issues/70600)。[#71176](https://github.com/ClickHouse/ClickHouse/pull/71176)（[flynn](https://github.com/ucasfl)）。
* Kafka、NATS 和 RabbitMQ 表引擎现在各有 `SOURCES` 权限层级中的独立授权。为创建这些引擎表的非默认数据库用户补充授权。 [#71250](https://github.com/ClickHouse/ClickHouse/pull/71250) ([Christoph Wurm](https://github.com/cwurm)).
* 执行前检查完整变更查询，包括子查询，避免意外运行无效查询并积累阻塞有效变更的失效任务。 [#71300](https://github.com/ClickHouse/ClickHouse/pull/71300) ([Christoph Wurm](https://github.com/cwurm)).
* 将文件系统缓存设置 `skip_download_if_exceeds_query_cache` 重命名为 `filesystem_cache_skip_download_if_exceeds_per_query_cache_write_limit`。 [#71578](https://github.com/ClickHouse/ClickHouse/pull/71578) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 移除 `deltaSumTimestamp` 对 `Enum`、`UInt128` 和 `UInt256` 参数的支持；`deltaSumTimestamp` 的第二个“时间戳”参数也不再支持 `Int8`、`UInt8`、`Int16` 和 `UInt16`。 [#71790](https://github.com/ClickHouse/ClickHouse/pull/71790) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 通过 Dictionary 存储、dictionary 表函数或直接 SELECT 字典读取数据时，拥有字典的 `SELECT` 或 `dictGet` 权限之一即可。这与此前防止 ACL 绕过的尝试一致：[https://github.com/ClickHouse/ClickHouse/pull/57362](https://github.com/ClickHouse/ClickHouse/pull/57362) 和 [https://github.com/ClickHouse/ClickHouse/pull/65359](https://github.com/ClickHouse/ClickHouse/pull/65359)，也使后者向后兼容。 [#72051](https://github.com/ClickHouse/ClickHouse/pull/72051) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).

<h4 id="experimental-feature">
  Experimental feature
</h4>

* 实现 `allow_feature_tier`，作为禁用全部实验性/beta 功能的全局开关。 [#71841](https://github.com/ClickHouse/ClickHouse/pull/71841) [#71145](https://github.com/ClickHouse/ClickHouse/pull/71145) ([Raúl Marín](https://github.com/Algunenano)).
* 修复 JSON 子列文件中特殊符号未转义可能导致的 `No such file or directory`。 [#71182](https://github.com/ClickHouse/ClickHouse/pull/71182) ([Pavel Kruglov](https://github.com/Avogar)).
* 支持从 String ALTER 为 JSON，同时将 JSON 和 Dynamic 序列化升级为 V2。仍可启用 `merge_tree_use_v1_object_and_dynamic_serialization` 使用 V1，可在升级期间用来保证顺利回退版本。 [#70442](https://github.com/ClickHouse/ClickHouse/pull/70442) ([Pavel Kruglov](https://github.com/Avogar)).
* 通过 JSON 字符串序列化/反序列化，实现从 Map/Tuple/Object 到新 JSON 类型的简单 CAST。 [#71320](https://github.com/ClickHouse/ClickHouse/pull/71320) ([Pavel Kruglov](https://github.com/Avogar)).
* 默认禁止在 ORDER BY/GROUP BY/PARTITION BY/PRIMARY KEY 中使用 Variant/Dynamic，以免产生意外结果。 [#69731](https://github.com/ClickHouse/ClickHouse/pull/69731) ([Pavel Kruglov](https://github.com/Avogar)).
* 禁止在 min/max 中使用 Dynamic/Variant，避免混淆。 [#71761](https://github.com/ClickHouse/ClickHouse/pull/71761) ([Pavel Kruglov](https://github.com/Avogar)).

<h4 id="new-feature-1">
  新功能
</h4>

* 新增描述工作负载和资源管理的 SQL 语法。[https://clickhouse.com/docs/operations/workload-scheduling](https://clickhouse.com/docs/operations/workload-scheduling)。 [#69187](https://github.com/ClickHouse/ClickHouse/pull/69187) ([Sergei Trifonov](https://github.com/serxa)).
* 新增 `BFloat16`，表示含 8 位指数、符号位和 7 位尾数的 16 位浮点数。关闭 [#44206](https://github.com/ClickHouse/ClickHouse/issues/44206)。关闭 [#49937](https://github.com/ClickHouse/ClickHouse/issues/49937)。 [#64712](https://github.com/ClickHouse/ClickHouse/pull/64712) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 新增 `CHECK GRANT`，检查当前用户/角色是否拥有指定权限，以及相应表/列是否存在于内存中。 [#68885](https://github.com/ClickHouse/ClickHouse/pull/68885) ([Unalian](https://github.com/Unalian)).
* 新增 `iceberg[S3;HDFS;Azure]Cluster`、`deltaLakeCluster` 和 `hudiCluster` 表函数。 [#72045](https://github.com/ClickHouse/ClickHouse/pull/72045) ([Mikhail Artemenko](https://github.com/Michicosun)).
* 允许在 http\_handlers 中为 `dynamic_query_handler`/`predefined_query_handler` 设置用户和密码。 [#70725](https://github.com/ClickHouse/ClickHouse/pull/70725) ([Azat Khuzhin](https://github.com/azat)).
* ORDER BY WITH FILL 支持 STALENESS 子句。 [#71151](https://github.com/ClickHouse/ClickHouse/pull/71151) ([Mikhail Artemenko](https://github.com/Michicosun)).
* 允许每种认证方法拥有独立到期时间，并从用户实体移除到期时间。 [#70090](https://github.com/ClickHouse/ClickHouse/pull/70090) ([Arthur Passos](https://github.com/arthurpassos)).
* 新增 `parseDateTime64`、`parseDateTime64OrNull` 和 `parseDateTime64OrZero`；相比 `parseDateTime` 及其变体，返回 `DateTime64` 而非 `DateTime`。 [#71581](https://github.com/ClickHouse/ClickHouse/pull/71581) ([kevinyhzou](https://github.com/KevinyhZou)).

<h4 id="performance-improvement-1">
  性能改进
</h4>

* 当数据片段索引粒度为常量时，优化粒度值的内存占用。新增 `use_const_adaptive_granularity`，始终为数据片段选择常量粒度，确保内存优化。对于共享存储上万亿行等大型负载，可避免数据片段元数据中的索引粒度值不断增加内存占用。 [#71786](https://github.com/ClickHouse/ClickHouse/pull/71786) ([Anton Popov](https://github.com/CurtizJ)).
* 使用 `join_algorithm = 'parallel_hash'` 将输入数据块列分配给线程并行处理时，不再复制列。 [#67782](https://github.com/ClickHouse/ClickHouse/pull/67782) ([Nikita Taranov](https://github.com/nickitat)).
* 优化不相交数据片段的 `Replacing` 合并算法。 [#70977](https://github.com/ClickHouse/ClickHouse/pull/70977) ([Anton Popov](https://github.com/CurtizJ)).
* 不再为指标或 system.detached\_parts 列出只读和只能写入一次磁盘上的已分离数据片段。 [#71086](https://github.com/ClickHouse/ClickHouse/pull/71086) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 默认不计算重量级异步指标。该功能在 [#40332](https://github.com/ClickHouse/ClickHouse/issues/40332) 引入，但为单个客户需求安排繁重后台任务并不合适。 [#71087](https://github.com/ClickHouse/ClickHouse/pull/71087) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* `plain_rewritable` 磁盘列目录时不调用对象存储 API，以免成本过高；改为在内存中保存文件名列表。代价是首次加载时间与保存文件名的内存需求增加。 [#70823](https://github.com/ClickHouse/ClickHouse/pull/70823) ([Julia Kartseva](https://github.com/jkartseva)).
* 减少临界区，改善 `system.query_metric_log` 采集间隔的性能与准确性。 [#71473](https://github.com/ClickHouse/ClickHouse/pull/71473) ([Pablo Marcos](https://github.com/pamarcos)).
* 通过生成虚拟行优化按序读取，减少归并排序所需读取的数据，尤其适合多个数据片段的情况。 [#62125](https://github.com/ClickHouse/ClickHouse/pull/62125) ([Shichao Jin](https://github.com/jsc0218)).
* 新增服务器设置 `async_load_system_database`，允许系统数据库尚未完全加载时启动服务器，系统表很多时可加快启动。 [#69847](https://github.com/ClickHouse/ClickHouse/pull/69847) ([Sergei Trifonov](https://github.com/serxa)).
* 为 `clickhouse-compressor` 添加 `--threads`，支持并行压缩。 [#70860](https://github.com/ClickHouse/ClickHouse/pull/70860) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 新增 `prewarm_mark_cache`，在插入、合并、抓取数据片段及表启动时，将标记加载到标记缓存。 [#71053](https://github.com/ClickHouse/ClickHouse/pull/71053) ([Anton Popov](https://github.com/CurtizJ)).
* 缩减内存中 index\_granularity 数组的容量至实际大小，降低 MergeTree 家族引擎的内存占用。 [#71595](https://github.com/ClickHouse/ClickHouse/pull/71595) ([alesapin](https://github.com/alesapin)).
* 对非磁盘读取关闭文件系统缓存的 `boundary_alignment`，改善带缓存的独立远程文件读取性能。 [#71827](https://github.com/ClickHouse/ClickHouse/pull/71827) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 此前 `SELECT * FROM table LIMIT ...` 等查询即使不用数据片段索引，也会加载它。 [#71866](https://github.com/ClickHouse/ClickHouse/pull/71866) ([Alexander Gololobov](https://github.com/davenger)).
* 默认启用 `parallel_replicas_local_plan`。在发起端构建完整本地计划，可提高并行副本性能、减少资源使用，并应用更多查询优化。 [#70171](https://github.com/ClickHouse/ClickHouse/pull/70171) ([Igor Nikonov](https://github.com/devcrafter)).

<h4 id="improvement-1">
  改进
</h4>

* 允许以 `ch queries.sql` 形式将文件作为参数运行 ClickHouse。 [#71589](https://github.com/ClickHouse/ClickHouse/pull/71589) ([Raúl Marín](https://github.com/Algunenano)).
* `Vertical` 格式（查询末尾 `\G` 也可启用）获得 Pretty 格式特性，包括突出数字千位分组与显示易读数字提示。 [#71630](https://github.com/ClickHouse/ClickHouse/pull/71630) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 将外部用户角色从查询发起端传递到集群其他节点，适合只有发起端可访问 LDAP 等外部认证器的情况。 [#70332](https://github.com/ClickHouse/ClickHouse/pull/70332) ([Andrey Zvonov](https://github.com/zvonand)).
* 为聚合函数 `any` 添加 `anyRespectNulls`、`firstValueRespectNulls` 和 `anyValueRespectNulls`，为 `anyLast` 添加 `anyLastRespectNulls` 和 `lastValueRespectNulls`。可使用更自然的纯驼峰语法，例如 `SELECT anyLastRespectNullsStateIf`，而非混合语法 `anyLast_respect_nullsStateIf`。 [#71403](https://github.com/ClickHouse/ClickHouse/pull/71403) ([Peter Nguyen](https://github.com/petern48)).
* 新增配置参数 `date_time_utc`，使 JSON 日志支持 RFC 3339/ISO8601 格式的 UTC 日期时间。 [#71560](https://github.com/ClickHouse/ClickHouse/pull/71560) ([Ali](https://github.com/xogoodnow)).
* 为 S3 端点新增用户认证请求头类型 `access_header`。它提供最低优先级的访问头，可被其他任意来源（如表结构或命名集合）的 `access_key_id` 覆盖。 [#71011](https://github.com/ClickHouse/ClickHouse/pull/71011) ([MikhailBurdukov](https://github.com/MikhailBurdukov)).
* 数组与捕获参数均为常量的高阶函数返回常量。 [#58400](https://github.com/ClickHouse/ClickHouse/pull/58400) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 查询计划步骤名（`EXPLAIN PLAN json=1`）与流水线处理器名（`EXPLAIN PIPELINE compact=0,graph=1`）现在带唯一 ID 后缀，便于将处理器性能分析及 OpenTelemetry 跟踪与 EXPLAIN 输出对应。 [#63518](https://github.com/ClickHouse/ClickHouse/pull/63518) ([qhsong](https://github.com/qhsong)).
* 新增写入 Azure Blob Storage 后检查对象是否存在的选项，由 `check_objects_after_upload` 控制。 [#64847](https://github.com/ClickHouse/ClickHouse/pull/64847) ([Smita Kulkarni](https://github.com/SmitaRKulkarni)).
* `clickhouse-local` 默认使用 `Atomic` 数据库，解决 [#50647](https://github.com/ClickHouse/ClickHouse/issues/50647) 的第 1、5 项。关闭 [#44817](https://github.com/ClickHouse/ClickHouse/issues/44817)。 [#68024](https://github.com/ClickHouse/ClickHouse/pull/68024) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 异常会中断 HTTP 协议，提醒客户端发生错误。 [#68800](https://github.com/ClickHouse/ClickHouse/pull/68800) ([Sema Checherinda](https://github.com/CheSema)).
* 在 DDLWorker 中创建 replica\_dir 并标记副本活跃，以报告执行分布式 DDL 的主机。 [#69658](https://github.com/ClickHouse/ClickHouse/pull/69658) ([tuanpach](https://github.com/tuanpach)).
* distributed\_ddl\_output\_mode 为 \*\_only\_active 时，数据库 ON CLUSTER 查询只等待活跃副本。 [#69660](https://github.com/ClickHouse/ClickHouse/pull/69660) ([tuanpach](https://github.com/tuanpach)).
* 改进 `ON CLUSTER` 备份恢复的错误处理与取消：- 一个主机失败时自动取消其他主机任务；- 不应因部分失败而其他主机继续执行产生奇怪错误；- 一个主机取消时自动取消其他主机；- 修复 `test_disallow_concurrency`，使禁止并发更有效；- 备份恢复对 ZooKeeper 断连的抵抗能力显著增强。 [#70027](https://github.com/ClickHouse/ClickHouse/pull/70027) ([Vitaly Baranov](https://github.com/vitlibar)).
* S3Queue 的部分设置支持 `ALTER TABLE ... MODIFY/RESET SETTING ...`。 [#70811](https://github.com/ClickHouse/ClickHouse/pull/70811) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 允许采用与服务器证书相同的流程重新加载客户端证书。 [#70997](https://github.com/ClickHouse/ClickHouse/pull/70997) ([Roman Antonov](https://github.com/Romeo58rus)).
* 客户端历史记录大小可配置，并提高默认值。 [#71014](https://github.com/ClickHouse/ClickHouse/pull/71014) ([Jiří Kozlovský](https://github.com/jirislav)).
* 原生 Parquet 读取器支持布尔类型。 [#71055](https://github.com/ClickHouse/ClickHouse/pull/71055) ([Arthur Passos](https://github.com/arthurpassos)).
* 与 S3 交互时重试更多错误，例如“Malformed message”。 [#71088](https://github.com/ClickHouse/ClickHouse/pull/71088) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 降低部分 S3 日志消息级别。 [#71090](https://github.com/ClickHouse/ClickHouse/pull/71090) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 支持写入名称含空格的 HDFS 文件。 [#71105](https://github.com/ClickHouse/ClickHouse/pull/71105) ([exmy](https://github.com/exmy)).
* 新增复制表、字典和视图数量限制设置。 [#71179](https://github.com/ClickHouse/ClickHouse/pull/71179) ([Kirill](https://github.com/kirillgarbar)).
* 若 `AWS_CONTAINER_AUTHORIZATION_TOKEN_FILE` 可用，优先使用它而非 `AWS_CONTAINER_AUTHORIZATION_TOKEN`。修复 [#71074](https://github.com/ClickHouse/ClickHouse/issues/71074)。 [#71269](https://github.com/ClickHouse/ClickHouse/pull/71269) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 从 ReplicatedMergeTree 重启线程移除创建 metadata\_version ZooKeeper 节点的逻辑。唯一需要创建它的情况是从 20.4 之前直接升至 24.10 之后。ClickHouse 不支持跨度超过一年的升级，应抛出异常要求逐步升级，而非创建该节点。 [#71385](https://github.com/ClickHouse/ClickHouse/pull/71385) ([Miсhael Stetsyuk](https://github.com/mstetsyuk)).
* 为高级仪表盘添加按主机展示的 `Overview (host)` 和 `Cloud overview (host)`。 [#71422](https://github.com/ClickHouse/ClickHouse/pull/71422) ([alesapin](https://github.com/alesapin)).
* `clickhouse-local` 默认使用隐式 SELECT，可作为计算器，并改进该模式的语法高亮。 [#71620](https://github.com/ClickHouse/ClickHouse/pull/71620) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 命令行应用也会高亮多条语句的语法。 [#71622](https://github.com/ClickHouse/ClickHouse/pull/71622) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 命令行应用出错时返回非零退出码。此前 `disks` 在错误时返回零，其他应用对错误 256（`PARTITION_ALREADY_EXISTS`）和 512（`SET_NON_GRANTED_ROLE`）返回零。 [#71623](https://github.com/ClickHouse/ClickHouse/pull/71623) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复以 ID 指定用户/组时 `clickhouse su` 失败，现在也接受 `UID:GID`。 [#71626](https://github.com/ClickHouse/ClickHouse/pull/71626) ([Mikhail f. Shiryaev](https://github.com/Felixoid)).
* 可通过 `filesystem_cache_prefer_bigger_buffer_size` 禁止增大文件系统缓存的内存缓冲区。 [#71640](https://github.com/ClickHouse/ClickHouse/pull/71640) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 新增独立设置 `background_download_max_file_segment_size`，控制文件系统缓存后台下载的最大文件段大小。 [#71648](https://github.com/ClickHouse/ClickHouse/pull/71648) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 略微改进 JSON 解析：如果某路径当前数据块包含多种类型的值，按特定的尽力匹配顺序尝试类型并选取最合适者。 [#71785](https://github.com/ClickHouse/ClickHouse/pull/71785) ([Pavel Kruglov](https://github.com/Avogar)).
* 此前读取 `system.asynchronous_metrics` 会等待并发更新结束，系统高负载时可能耗时很长。现在始终可读取此前收集的值。 [#71798](https://github.com/ClickHouse/ClickHouse/pull/71798) ([Alexander Gololobov](https://github.com/davenger)).
* S3Queue 和 AzureQueue：将 `polling_max_timeout_ms` 设为 10 分钟，`polling_backoff_ms` 设为 30 秒。 [#71817](https://github.com/ClickHouse/ClickHouse/pull/71817) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 每个 `history` 周期更新 `HostResolver` 三次。 [#71863](https://github.com/ClickHouse/ClickHouse/pull/71863) ([Sema Checherinda](https://github.com/CheSema)).
* 高级仪表盘 HTML 页面新增下拉菜单，从 `system.dashboards` 选择仪表盘。 [#72081](https://github.com/ClickHouse/ClickHouse/pull/72081) ([Sergei Trifonov](https://github.com/serxa)).
* 授权后检查默认数据库是否存在。修复 [#71097](https://github.com/ClickHouse/ClickHouse/issues/71097)。 [#71140](https://github.com/ClickHouse/ClickHouse/pull/71140) ([Konstantin Bogdanov](https://github.com/thevar1able)).

<h4 id="bug-fix-user-visible-misbehavior-in-an-official-stable-release-1">
  缺陷修复（正式稳定版本中用户可见的异常行为）
</h4>

* `ATTACH PART` 期间被去重的数据片段不再一直保留 `attaching_` 前缀。 [#65636](https://github.com/ClickHouse/ClickHouse/pull/65636) ([Kirill](https://github.com/kirillgarbar)).
* 修复 `IN` 函数中 DateTime64 精度丢失。 [#67230](https://github.com/ClickHouse/ClickHouse/pull/67230) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 修复 `ORDER BY ... WITH FILL` 中使用 `IGNORE/RESPECT NULLS` 函数时的潜在逻辑错误。关闭 [#57609](https://github.com/ClickHouse/ClickHouse/issues/57609)。 [#68234](https://github.com/ClickHouse/ClickHouse/pull/68234) ([Vladimir Cherkasov](https://github.com/vdimir)).
* 修复 `Native` 异步插入达到内存限制时罕见的逻辑错误。 [#68965](https://github.com/ClickHouse/ClickHouse/pull/68965) ([Anton Popov](https://github.com/CurtizJ)).
* 修复 CREATE TABLE 中 EPHEMERAL 列的 COMMENT。 [#70458](https://github.com/ClickHouse/ClickHouse/pull/70458) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* 修复 JSONExtract 与 LowCardinality(Nullable) 的逻辑错误。 [#70549](https://github.com/ClickHouse/ClickHouse/pull/70549) ([Pavel Kruglov](https://github.com/Avogar)).
* 同一路径存在其他副本时，允许 SYSTEM DROP REPLICA ZKPATH。 [#70642](https://github.com/ClickHouse/ClickHouse/pull/70642) ([MikhailBurdukov](https://github.com/MikhailBurdukov)).
* 修复 AggregateFunctionGroupArraySorted 的崩溃与泄漏。 [#70820](https://github.com/ClickHouse/ClickHouse/pull/70820) ([Michael Kolupaev](https://github.com/al13n321)).
* URL 引擎允许用户请求头覆盖 Content-Type。 [#70859](https://github.com/ClickHouse/ClickHouse/pull/70859) ([Artem Iurin](https://github.com/ortyomka)).
* 修复 `StorageS3Queue` 的“Cannot create a persistent node in /processed since it already exists”逻辑错误。 [#70984](https://github.com/ClickHouse/ClickHouse/pull/70984) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复某些情况下命名会话不关闭并永久挂起。 [#70998](https://github.com/ClickHouse/ClickHouse/pull/70998) ([Márcio Martins](https://github.com/marcio-absmartly)).
* 修复投影轻量删除的 rebuild 选项未考虑 \_row\_exists 列。 [#71089](https://github.com/ClickHouse/ClickHouse/pull/71089) ([Shichao Jin](https://github.com/jsc0218)).
* 修复 Oracle Linux UEK 6.10 上的 `AT_* is out of range`。 [#71109](https://github.com/ClickHouse/ClickHouse/pull/71109) ([Örjan Fors](https://github.com/op)).
* 修复意外竞态导致 system.query\_metric\_log 值错误。 [#71124](https://github.com/ClickHouse/ClickHouse/pull/71124) ([Pablo Marcos](https://github.com/pamarcos)).
* 修复 quantileExactWeightedInterpolated 的聚合函数名称不匹配，由 [https://github.com/ClickHouse/ClickHouse/pull/69619](https://github.com/ClickHouse/ClickHouse/pull/69619) 引入。抄送 @Algunenano。 [#71168](https://github.com/ClickHouse/ClickHouse/pull/71168) ([李扬](https://github.com/taiyang-li)).
* 修复函数比较使用 Dynamic 时的 bad\_weak\_ptr 异常。 [#71183](https://github.com/ClickHouse/ClickHouse/pull/71183) ([Pavel Kruglov](https://github.com/Avogar)).
* 检查所读取的 7z 文件位于本地机器。 [#71184](https://github.com/ClickHouse/ClickHouse/pull/71184) ([Daniil Ivanik](https://github.com/divanik)).
* 修复通过 HTTP 和异步插入使用 Native 时忽略格式设置。 [#71193](https://github.com/ClickHouse/ClickHouse/pull/71193) ([Pavel Kruglov](https://github.com/Avogar)).
* 启用 `use_query_cache = 1` 的 SELECT 不再因系统表名作为字面量出现而被拒绝，例如 `SELECT * FROM users WHERE name = 'system.metrics' SETTINGS use_query_cache = true;` 现在可工作。 [#71254](https://github.com/ClickHouse/ClickHouse/pull/71254) ([Robert Schulze](https://github.com/rschu1ze)).
* 修复 enable\_filesystem\_cache=1，但存储配置中的磁盘没有任何缓存配置时内存增长的问题。 [#71261](https://github.com/ClickHouse/ClickHouse/pull/71261) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复从 Dynamic 列反序列化 LowCardinality 字典时可能出现“Cannot read all data”。 [#71299](https://github.com/ClickHouse/ClickHouse/pull/71299) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复客户端并行输出格式清理不完整。 [#71304](https://github.com/ClickHouse/ClickHouse/pull/71304) ([Raúl Marín](https://github.com/Algunenano)).
* 为命名集合补充缺失的反转义；未修复时 clickhouse-server 无法启动。 [#71308](https://github.com/ClickHouse/ClickHouse/pull/71308) ([MikhailBurdukov](https://github.com/MikhailBurdukov)).
* 修复通过原生协议异步插入空数据块。 [#71312](https://github.com/ClickHouse/ClickHouse/pull/71312) ([Anton Popov](https://github.com/CurtizJ)).
* 修复错误通配符授权时 AST 格式化不一致 [#71309](https://github.com/ClickHouse/ClickHouse/issues/71309)。 [#71332](https://github.com/ClickHouse/ClickHouse/pull/71332) ([pufit](https://github.com/pufit)).
* 为数据片段析构函数增加 try/catch，避免 std::terminate。 [#71364](https://github.com/ClickHouse/ClickHouse/pull/71364) ([alesapin](https://github.com/alesapin)).
* 检查 JSON 类型提示中的可疑与实验性类型。 [#71369](https://github.com/ClickHouse/ClickHouse/pull/71369) ([Pavel Kruglov](https://github.com/Avogar)).
* 在非 Linux 系统上也启动内存工作线程（修复 [#71051](https://github.com/ClickHouse/ClickHouse/issues/71051)）。 [#71384](https://github.com/ClickHouse/ClickHouse/pull/71384) ([Alexandre Snarskii](https://github.com/snar)).
* 修复含 Variant 列时“Invalid number of rows in Chunk”错误。 [#71388](https://github.com/ClickHouse/ClickHouse/pull/71388) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复旧 PostgreSQL 的“column attgenerated does not exist”，修复 [#60651](https://github.com/ClickHouse/ClickHouse/issues/60651)。 [#71396](https://github.com/ClickHouse/ClickHouse/pull/71396) ([0xMihalich](https://github.com/0xMihalich)).
* 为避免刷屏，认证失败尝试现在以 `DEBUG` 而非 `ERROR` 记录。 [#71405](https://github.com/ClickHouse/ClickHouse/pull/71405) ([Robert Schulze](https://github.com/rschu1ze)).
* 修复 `mongodb` 表函数传入错误参数（如 `NULL`）时的崩溃。 [#71426](https://github.com/ClickHouse/ClickHouse/pull/71426) ([Vladimir Cherkasov](https://github.com/vdimir)).
* 修复 optimize\_rewrite\_array\_exists\_to\_has 崩溃。 [#71432](https://github.com/ClickHouse/ClickHouse/pull/71432) ([Raúl Marín](https://github.com/Algunenano)).
* 修复插入中 `max_insert_delayed_streams_for_parallel_write` 的使用。此前行为错误，可能使写入多个分区的插入占用大量内存。 [#71474](https://github.com/ClickHouse/ClickHouse/pull/71474) ([Anton Popov](https://github.com/CurtizJ)).
* 修复 arrayJoin 可能出现在 `WHERE` 条件中时的 `Argument for function must be constant`（旧分析器），这是 [https://github.com/ClickHouse/ClickHouse/pull/65414](https://github.com/ClickHouse/ClickHouse/pull/65414) 后的回归。 [#71476](https://github.com/ClickHouse/ClickHouse/pull/71476) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 避免 SortCursor 含 0 列时崩溃（旧分析器）。 [#71494](https://github.com/ClickHouse/ClickHouse/pull/71494) ([Raúl Marín](https://github.com/Algunenano)).
* 修复未初始化 ORC 数据导致 Date32 越界，详见 [https://github.com/apache/incubator-gluten/issues/7823](https://github.com/apache/incubator-gluten/issues/7823)。 [#71500](https://github.com/ClickHouse/ClickHouse/pull/71500) ([李扬](https://github.com/taiyang-li)).
* 修复宽数据片段中 Dynamic 和 JSON 列大小的统计。 [#71526](https://github.com/ClickHouse/ClickHouse/pull/71526) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复分析器处理物化视图内部查询中 IN 与 CTE 组合的问题。关闭 [#65598](https://github.com/ClickHouse/ClickHouse/issues/65598)。 [#71538](https://github.com/ClickHouse/ClickHouse/pull/71538) ([Maksim Kita](https://github.com/kitaisreal)).
* 避免约束使用 UDF 时崩溃。 [#71541](https://github.com/ClickHouse/ClickHouse/pull/71541) ([Raúl Marín](https://github.com/Algunenano)).
* bitShift 函数越界时返回 0 或默认字符，而非抛出错误。 [#71580](https://github.com/ClickHouse/ClickHouse/pull/71580) ([Pablo Marcos](https://github.com/pamarcos)).
* 修复物化视图使用某些引擎时的服务器崩溃。 [#71593](https://github.com/ClickHouse/ClickHouse/pull/71593) ([Pervakov Grigorii](https://github.com/GrigoryPervakov)).
* 修复嵌套数据结构含常量数组别名时 ARRAY JOIN 引发的空指针解引用。关闭 [#71677](https://github.com/ClickHouse/ClickHouse/issues/71677)。 [#71678](https://github.com/ClickHouse/ClickHouse/pull/71678) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复使用空元组执行 ALTER 时的 LOGICAL\_ERROR。修复 [#71647](https://github.com/ClickHouse/ClickHouse/issues/71647)。 [#71679](https://github.com/ClickHouse/ClickHouse/pull/71679) ([Amos Bird](https://github.com/amosbird)).
* NOT IN 运算符用于分区列谓词时，不转换常量集合。 [#71695](https://github.com/ClickHouse/ClickHouse/pull/71695) ([Eduard Karacharov](https://github.com/korowa)).
* 改进 Docker 初始化脚本的失败日志，使其更易理解。 [#71734](https://github.com/ClickHouse/ClickHouse/pull/71734) ([Андрей](https://github.com/andreineustroev)).
* 修复从 LowCardinality(Nullable) CAST 为 Dynamic，此前可能出现 `Bad cast from type DB::ColumnVector<int> to DB::ColumnNullable`。 [#71742](https://github.com/ClickHouse/ClickHouse/pull/71742) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复 DateTime64 主键 WHERE 条件中 toDayOfWeek 的异常。 [#71849](https://github.com/ClickHouse/ClickHouse/pull/71849) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* 修复解析到稀疏列后的默认值填充。 [#71854](https://github.com/ClickHouse/ClickHouse/pull/71854) ([Anton Popov](https://github.com/CurtizJ)).
* 修复分布式表输入为 ALIAS 时 GROUPING 函数错误。关闭 [#68602](https://github.com/ClickHouse/ClickHouse/issues/68602)。 [#71855](https://github.com/ClickHouse/ClickHouse/pull/71855) ([Vladimir Cherkasov](https://github.com/vdimir)).
* 修复使用 `allow_experimental_join_condition` 时的潜在崩溃。关闭 [#71693](https://github.com/ClickHouse/ClickHouse/issues/71693)。 [#71857](https://github.com/ClickHouse/ClickHouse/pull/71857) ([Vladimir Cherkasov](https://github.com/vdimir)).
* 修复带 `WITH TIES` 的 SELECT 可能返回行数不足。 [#71886](https://github.com/ClickHouse/ClickHouse/pull/71886) ([wxybear](https://github.com/wxybear)).
* 修复 arrayWithConstant 求值的列被误认为超过数组大小限制而触发 TOO\_LARGE\_ARRAY\_SIZE。 [#71894](https://github.com/ClickHouse/ClickHouse/pull/71894) ([Udi](https://github.com/udiz)).
* 修复 `clickhouse-benchmark` 对耗时超过一秒的查询报告错误指标。 [#71898](https://github.com/ClickHouse/ClickHouse/pull/71898) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复 clickhouse-client 进度指示器与进度表间的数据竞态，使用 FROM INFILE 时可观察到。INSERT 期间拦截按键以切换进度表。 [#71901](https://github.com/ClickHouse/ClickHouse/pull/71901) ([Julia Kartseva](https://github.com/jkartseva)).
* 使用辅助 Keeper 进行集群自动发现。 [#71911](https://github.com/ClickHouse/ClickHouse/pull/71911) ([Anton Ivashkin](https://github.com/ianton-ru)).
* 修复 24.6 中损坏的 system.s3/azure\_queue\_log 的 rows\_processed 列。关闭 [#69975](https://github.com/ClickHouse/ClickHouse/issues/69975)。 [#71946](https://github.com/ClickHouse/ClickHouse/pull/71946) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复 `s3`/`s3Cluster` 返回不完整结果或抛出异常的情况：S3 URI 含 glob（如 `pattern/*`），且存在键为 `pattern/` 的空对象（S3 Console 自动创建此类对象）。同时将 `s3_skip_empty_files` 默认值从 `false` 改为 `true`。 [#71947](https://github.com/ClickHouse/ClickHouse/pull/71947) ([Nikita Taranov](https://github.com/nickitat)).
* 修复 clickhouse-client 语法高亮崩溃。关闭 [#71864](https://github.com/ClickHouse/ClickHouse/issues/71864)。 [#71949](https://github.com/ClickHouse/ClickHouse/pull/71949) ([Nikolay Degterinsky](https://github.com/evillique)).
* 修复 `MergeTree` 表 `ORDER BY` 中二元单调函数第一个参数为常量时的 `Illegal type`。修复 [#71941](https://github.com/ClickHouse/ClickHouse/issues/71941)。 [#71966](https://github.com/ClickHouse/ClickHouse/pull/71966) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 子查询中的 EXPLAIN AST 仅允许 SELECT。其他查询类型导致 'Bad cast from type DB::ASTCreateQuery to DB::ASTSelectWithUnionQuery' 或 `Inconsistent AST formatting` 逻辑错误。 [#71982](https://github.com/ClickHouse/ClickHouse/pull/71982) ([Pavel Kruglov](https://github.com/Avogar)).
* 通过 `clickhouse-client` 插入记录时，客户端从服务器读取列描述。此前写入描述的顺序错误，正确顺序应为 \[statistics, ttl, settings]。 [#71991](https://github.com/ClickHouse/ClickHouse/pull/71991) ([Han Fei](https://github.com/hanfei1991)).
* 修复启用 `format_alter_commands_with_parentheses` 时 `MOVE PARTITION ... TO TABLE ...` ALTER 命令的格式化。 [#72080](https://github.com/ClickHouse/ClickHouse/pull/72080) ([János Benjamin Antal](https://github.com/antaljanosbenjamin)).
* 修复并行副本查询中的 RIGHT/FULL JOIN。RIGHT JOIN 可使用并行副本，分布式读取右表；FULL JOIN 不能跨节点并行，改为本地执行。 [#71162](https://github.com/ClickHouse/ClickHouse/pull/71162) ([Igor Nikonov](https://github.com/devcrafter)).
* 修复 Docker 容器中因系统调用受限而向 stderr 打印“get\_mempolicy: Operation not permitted”。 [#70900](https://github.com/ClickHouse/ClickHouse/pull/70900) ([filimonov](https://github.com/filimonov)).
* 在重启线程而非附加线程中修复 ZooKeeper 的 metadata\_version 记录。 [#70297](https://github.com/ClickHouse/ClickHouse/pull/70297) ([Miсhael Stetsyuk](https://github.com/mstetsyuk)).
* 修复不受支持且将完全移除的“零拷贝”复制：ReplicatedMergeTree 零拷贝复制中，仍有节点使用 blob 时不删除它。 [#71186](https://github.com/ClickHouse/ClickHouse/pull/71186) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复不受支持且将完全移除的“零拷贝”复制：将数据片段移到零拷贝磁盘前获取共享锁，防止 Keeper 不可用时潜在数据丢失。 [#71845](https://github.com/ClickHouse/ClickHouse/pull/71845) ([Aleksei Filatov](https://github.com/aalexfvk)).
