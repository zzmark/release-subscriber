<h3 id="a-id2412a-clickhouse-release-2412-2024-12-19">
  <a id="2412" /> ClickHouse 24.12 版本, 2024-12-19. [演示文稿](https://presentations.clickhouse.com/2024-release-24.12/), [视频](https://www.youtube.com/watch?v=bv-ut-Q6vnc)
</h3>

<Frame>
  <iframe src="https://www.youtube.com/embed/bv-ut-Q6vnc" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
</Frame>

<h4 id="backward-incompatible-change">
  向后不兼容变更
</h4>

* 函数 `greatest` 和 `least` 现在忽略 NULL 输入值，此前只要任一参数为 NULL 就返回 NULL。例如，`SELECT greatest(1, 2, NULL)` 现在返回 2。这使行为与 PostgreSQL 兼容，但同时破坏了与返回 NULL 的 MySQL 的兼容性。要保留原有行为，请将设置 `least_greatest_legacy_null_behavior`（默认 `false`）设为 `true`。 [#65519](https://github.com/ClickHouse/ClickHouse/pull/65519) [#73344](https://github.com/ClickHouse/ClickHouse/pull/73344) ([kevinyhzou](https://github.com/KevinyhZou)).
* 新的 MongoDB 集成现在成为默认实现。希望使用旧 MongoDB 驱动（基于 Poco 驱动）的用户可启用服务器设置 `use_legacy_mongodb_integration`。 [#73359](https://github.com/ClickHouse/ClickHouse/pull/73359) ([Kirill Nikiforov](https://github.com/allmazz).

<h4 id="new-feature">
  新功能
</h4>

* 将 `JSON`/`Dynamic`/`Variant` 类型从实验性功能提升至 Beta 阶段。 [#72294](https://github.com/ClickHouse/ClickHouse/pull/72294) ([Pavel Kruglov](https://github.com/Avogar)). 我们还将所有修复及此变更回移至 24.11。
* [Iceberg 数据存储](https://iceberg.apache.org/spec/#file-system-operations)格式的结构演进为用户提供了丰富的表结构修改选项，可在底层更改列顺序、列名以及进行简单的类型扩展。 [#69445](https://github.com/ClickHouse/ClickHouse/pull/69445) ([Daniil Ivanik](https://github.com/divanik)).
* 集成 Iceberg REST Catalog：新增名为 Iceberg 的数据库引擎，可将整个目录接入 ClickHouse。 [#71542](https://github.com/ClickHouse/ClickHouse/pull/71542) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 为 `MergeTree` 表的主索引添加缓存（可通过表设置 `use_primary_key_cache` 启用）。如果主索引同时启用延迟加载和缓存，它将按需加载到缓存（类似标记缓存），而非永久保留在内存中。添加在插入、合并、拉取数据片段以及重启表时预热主索引的功能（可通过设置 `prewarm_primary_key_cache` 启用）。这可降低共享存储上超大表的内存占用，我们已在超过一千万亿条记录的表上测试。 [#72102](https://github.com/ClickHouse/ClickHouse/pull/72102) ([Anton Popov](https://github.com/CurtizJ)). [#72750](https://github.com/ClickHouse/ClickHouse/pull/72750) ([Alexander Gololobov](https://github.com/davenger)).
* 实现 `SYSTEM LOAD PRIMARY KEY` 命令，加载指定表的所有数据片段的主索引；未指定表时加载所有表的主索引。这有助于基准测试，并可避免查询执行时产生额外延迟。 [#66252](https://github.com/ClickHouse/ClickHouse/pull/66252) [#67733](https://github.com/ClickHouse/ClickHouse/pull/67733) ([ZAWA\_ll](https://github.com/Zawa-ll)).
* 新增将 `MergeTree` 表附加为 `ReplicatedMergeTree` 以及反向转换的查询：`ATTACH TABLE ... AS REPLICATED` 和 `ATTACH TABLE ... AS NOT REPLICATED`。 [#65401](https://github.com/ClickHouse/ClickHouse/pull/65401) ([Kirill](https://github.com/kirillgarbar)).
* 新增设置 `http_response_headers`，允许自定义 HTTP 响应头。例如，可让浏览器渲染存储在数据库中的图片。关闭 [#59620](https://github.com/ClickHouse/ClickHouse/issues/59620)。 [#72656](https://github.com/ClickHouse/ClickHouse/pull/72656) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 新增函数 `toUnixTimestamp64Second`，将 `DateTime64` 转换为固定秒精度的 `Int64` 值，从而支持对 Unix 纪元之前的日期返回负值。 [#70597](https://github.com/ClickHouse/ClickHouse/pull/70597) ([zhanglistar](https://github.com/zhanglistar)). [#73146](https://github.com/ClickHouse/ClickHouse/pull/73146) ([Robert Schulze](https://github.com/rschu1ze)).
* 新增设置 `enforce_index_structure_match_on_partition_manipulation`，当源表的投影和二级索引集合是目标表相应集合的子集时允许附加。关闭 [#70602](https://github.com/ClickHouse/ClickHouse/issues/70602)。 [#70603](https://github.com/ClickHouse/ClickHouse/pull/70603) ([zwy991114](https://github.com/zwy991114)).
* 新增语法 ALTER USER `{ADD|MODIFY|DROP SETTING}`、ALTER USER `{ADD|DROP PROFILE}`，ALTER ROLE 和 ALTER PROFILE 也支持相同语法。这样可修改设置集合，而无需整体替换。 [#72050](https://github.com/ClickHouse/ClickHouse/pull/72050) ([pufit](https://github.com/pufit)).
* 新增 `arrayPRAUC` 函数，计算精确率—召回率曲线的 AUC（曲线下面积）。 [#72073](https://github.com/ClickHouse/ClickHouse/pull/72073) ([Emmanuel](https://github.com/emmanuelsdias)).
* 为数组类型新增 `indexOfAssumeSorted` 函数，优化已按非递减顺序排序的数组搜索。在非常大的数组（超过 100,000 个元素）上效果明显。 [#72517](https://github.com/ClickHouse/ClickHouse/pull/72517) ([Eric Kurbanov](https://github.com/erickurbanov)).
* 允许为聚合函数 `groupConcat` 提供分隔符作为可选的第二个参数。 [#72540](https://github.com/ClickHouse/ClickHouse/pull/72540) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 函数 `translate` 现在支持删除字符：当 `from` 参数的字符数多于 `to` 时，多出的字符会被删除。例如，`SELECT translate('clickhouse', 'clickhouse', 'CLICK')` 现在返回 `CLICK`。 [#71441](https://github.com/ClickHouse/ClickHouse/pull/71441) ([shuai.xu](https://github.com/shuai-xu)).

<h4 id="experimental-features">
  实验性功能s
</h4>

* 新增 MergeTree 设置 `allow_experimental_reverse_key`，允许 MergeTree 排序键使用降序排序。这对时间序列分析，尤其是 TopN 查询很有用。用法示例：`ENGINE = MergeTree ORDER BY (time DESC, key)`，即对 `time` 字段降序排序。 [#71095](https://github.com/ClickHouse/ClickHouse/pull/71095) ([Amos Bird](https://github.com/amosbird)).

<h4 id="performance-improvement">
  性能改进
</h4>

* JOIN 重排：新增选项，可在查询计划中选择连接哪一侧的表作为内部表（构建侧）。由 `query_plan_join_swap_table` 控制，可设为 `auto`。此模式下，ClickHouse 会尝试选择行数最少的表。 [#71577](https://github.com/ClickHouse/ClickHouse/pull/71577) ([Vladimir Cherkasov](https://github.com/vdimir)).
* 当 `join_algorithm` 设置为 `default` 时，现在会在适用时使用 `parallel_hash` 算法。如果无法使用 `parallel_hash`，仍会考虑原有的两种替代算法（`direct` 和 `hash`）。 [#70788](https://github.com/ClickHouse/ClickHouse/pull/70788) ([Nikita Taranov](https://github.com/nickitat)).
* 新增选项，可从 `WHERE` 和 `ON` 表达式中提取公共表达式，减少连接使用的哈希表数量。当 JOIN ON 条件的不同 OR 分支中的 AND 表达式存在公共部分时，这项优化很有用。可通过 `optimize_extract_common_expressions = 1` 启用。 [#71537](https://github.com/ClickHouse/ClickHouse/pull/71537) ([János Benjamin Antal](https://github.com/antaljanosbenjamin)).
* 当索引列被 CAST 为 `LowCardinality(String)` 时，允许 `SELECT` 使用索引。例如，对 Merge 表执行查询，而底层部分表为 `String`、其他表为 `LowCardinality(String)` 时，可能出现这种情况。 [#71598](https://github.com/ClickHouse/ClickHouse/pull/71598) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 使用并行副本执行查询且启用本地计划时，不在工作节点进行索引分析。协调节点根据自身（查询发起端）的索引分析结果，为工作节点选择读取范围。这样，并行副本的短查询可达到与单节点查询同样低的延迟。 [#72109](https://github.com/ClickHouse/ClickHouse/pull/72109) ([Igor Nikonov](https://github.com/devcrafter)).
* 降低对象存储磁盘上 `clickhouse disks remove --recursive` 的内存占用。 [#67323](https://github.com/ClickHouse/ClickHouse/pull/67323) ([Kirill](https://github.com/kirillgarbar)).
* 恢复以下变更中针对紧凑数据片段单列的子列读取优化： [#57631](https://github.com/ClickHouse/ClickHouse/pull/57631). 该优化此前被意外删除。 [#72285](https://github.com/ClickHouse/ClickHouse/pull/72285) ([Pavel Kruglov](https://github.com/Avogar)).
* 通过消除比较器中的虚调用，加快 `LowCardinality(String)` 列的排序。 [#72337](https://github.com/ClickHouse/ClickHouse/pull/72337) ([Alexander Gololobov](https://github.com/davenger)).
* 针对部分简单数据类型优化函数 `argMin`/`argMax`。 [#72350](https://github.com/ClickHouse/ClickHouse/pull/72350) ([alesapin](https://github.com/alesapin)).
* 使用共享锁优化内存跟踪器的加锁过程，减少锁争用，提升 CPU 数量非常多的系统上的性能。 [#72375](https://github.com/ClickHouse/ClickHouse/pull/72375) ([Jiebin Sun](https://github.com/jiebinn)).
* 新增设置 `use_async_executor_for_materialized_views`。物化视图查询使用异步执行，并可能采用多线程，可加快 INSERT 期间的视图处理，但也消耗更多内存。 [#72497](https://github.com/ClickHouse/ClickHouse/pull/72497) ([alesapin](https://github.com/alesapin)).
* 改进聚合函数状态的反序列化性能（用于 `AggregateFunction` 数据类型及分布式查询）。略微改进 `RowBinary` 格式的解析性能。 [#72818](https://github.com/ClickHouse/ClickHouse/pull/72818) ([Anton Popov](https://github.com/CurtizJ)).
* 使用并行副本按表键顺序读取时拆分范围，降低读取期间的内存占用。 [#72173](https://github.com/ClickHouse/ClickHouse/pull/72173) ([JIaQi](https://github.com/JiaQiTang98)).
* 当插入批次中分区键仅有一个值时，加快向 MergeTree 的插入。 [#72348](https://github.com/ClickHouse/ClickHouse/pull/72348) ([alesapin](https://github.com/alesapin)).
* 实现从备份恢复时并行创建表。此前 `RESTORE` 命令始终在单线程中创建表，备份包含大量表时可能很慢。 [#72427](https://github.com/ClickHouse/ClickHouse/pull/72427) ([Vitaly Baranov](https://github.com/vitlibar)).
* 清空较大的标记缓存可能需要明显的时间。若期间持有上下文互斥锁，会阻塞许多其他操作，甚至在锁释放前无法建立新的客户端连接。同步实际上无需持有此互斥锁，只需通过共享指针保留缓存的本地引用。 [#72749](https://github.com/ClickHouse/ClickHouse/pull/72749) ([Alexander Gololobov](https://github.com/davenger)).

<h4 id="improvement">
  改进
</h4>

* 移除 `allow_experimental_join_condition` 设置，默认允许非等值条件。 [#69910](https://github.com/ClickHouse/ClickHouse/pull/69910) ([Vladimir Cherkasov](https://github.com/vdimir)).
* 服务器配置（users.xml）中的设置现在也会应用于客户端。这对 `date_time_output_format` 等格式设置很有用。 [#71178](https://github.com/ClickHouse/ClickHouse/pull/71178) ([Michael Kolupaev](https://github.com/al13n321)).
* 根据服务器/用户的内存使用情况，自动将 `GROUP BY`/`ORDER BY` 的中间数据写入磁盘。由查询设置 `max_bytes_ratio_before_external_group_by`/`max_bytes_ratio_before_external_sort` 控制。 [#71406](https://github.com/ClickHouse/ClickHouse/pull/71406) ([Azat Khuzhin](https://github.com/azat)).
* 添加新的取消逻辑：`CancellationChecker` 为每个已启动查询检查超时，并在达到超时时间后停止查询。 [#69880](https://github.com/ClickHouse/ClickHouse/pull/69880) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 支持从 `Object` ALTER 为 `JSON`，便于从已弃用的 Object 类型迁移。 [#71784](https://github.com/ClickHouse/ClickHouse/pull/71784) ([Pavel Kruglov](https://github.com/Avogar)).
* 允许集合中出现 Enum 未定义的未知值。修复 [#72662](https://github.com/ClickHouse/ClickHouse/issues/72662)。 [#72686](https://github.com/ClickHouse/ClickHouse/pull/72686) ([zhanglistar](https://github.com/zhanglistar)).
* 为 `Enum` 数据类型支持字符串搜索运算符（如 LIKE），实现 [#72661](https://github.com/ClickHouse/ClickHouse/issues/72661)。 [#72732](https://github.com/ClickHouse/ClickHouse/pull/72732) ([zhanglistar](https://github.com/zhanglistar)).
* 此前会接受一些无意义的 ALTER USER 查询。修复 [#71227](https://github.com/ClickHouse/ClickHouse/issues/71227)。 [#71286](https://github.com/ClickHouse/ClickHouse/pull/71286) ([Arthur Passos](https://github.com/arthurpassos)).
* 构建分布式 `INSERT ... SELECT` 的计划时遵循 `prefer_locahost_replica`。 [#72190](https://github.com/ClickHouse/ClickHouse/pull/72190) ([filimonov](https://github.com/filimonov)).
* Azure 违反 Iceberg 规范，错误地将 Iceberg v1 标记为 Iceberg v2。[此处描述了该问题](https://github.com/ClickHouse/ClickHouse/issues/72091)。Azure Iceberg Writer 创建的 Iceberg 元数据文件和清单文件不符合规范。现在尝试使用 v2 读取器读取 v1 Iceberg 格式的元数据（因为它们就是这样写入的），并在清单文件未创建相应字段时报错。 [#72277](https://github.com/ClickHouse/ClickHouse/pull/72277) ([Daniil Ivanik](https://github.com/divanik)).
* 现在允许在查询中使用 `UNION [ALL]` 来 `CREATE MATERIALIZED VIEW`。行为与包含 `JOIN` 的物化视图相同：仅 `SELECT` 表达式中的第一张表会触发插入，其他表均被忽略。不过，如果多次引用第一张表（如与自身 UNION），所有引用均会按插入的数据块处理。 [#72347](https://github.com/ClickHouse/ClickHouse/pull/72347) ([alesapin](https://github.com/alesapin)).
* 使用 ClickHouse 作为字典数据源时，新增对源查询的验证。 [#72548](https://github.com/ClickHouse/ClickHouse/pull/72548) ([Alexey Katsman](https://github.com/alexkats)).
* 确保重新加载配置时 ClickHouse 能感知 ZooKeeper 的变更。 [#72593](https://github.com/ClickHouse/ClickHouse/pull/72593) ([Azat Khuzhin](https://github.com/azat)).
* 更准确地估算已缓存标记的内存占用，减少缓存的总内存使用。 [#72630](https://github.com/ClickHouse/ClickHouse/pull/72630) ([Antonio Andelic](https://github.com/antonio2368)).
* 新增 `StartupScriptsExecutionState` 指标，有三个取值：0 = 启动脚本尚未完成，1 = 启动脚本执行成功，2 = 启动脚本失败。我们需要此指标来确认云端启动脚本是否执行成功，尤其是在发布基础配置变更后。 [#72637](https://github.com/ClickHouse/ClickHouse/pull/72637) ([Miсhael Stetsyuk](https://github.com/mstetsyuk)).
* 向 `system.metrics` 新增 `MergeTreeIndexGranularityInternalArraysTotalSize` 指标，用于找出拥有海量数据集、容易出现高内存用量问题的实例。
* 为创建复制表添加重试。 [#72682](https://github.com/ClickHouse/ClickHouse/pull/72682) ([Vitaly Baranov](https://github.com/vitlibar)).
* 向 `system.tables` 添加 `total_bytes_with_inactive`，统计非活跃数据片段的总字节数。 [#72690](https://github.com/ClickHouse/ClickHouse/pull/72690) ([Kai Zhu](https://github.com/nauu)).
* 向 `system.settings_changes` 添加 MergeTree 设置。 [#72694](https://github.com/ClickHouse/ClickHouse/pull/72694) ([Raúl Marín](https://github.com/Algunenano)).
* `notEmpty` 函数支持 JSON 类型。 [#72741](https://github.com/ClickHouse/ClickHouse/pull/72741) ([Pavel Kruglov](https://github.com/Avogar)).
* 支持解析 GCS S3 的 `AuthenticationRequired` 错误。 [#72753](https://github.com/ClickHouse/ClickHouse/pull/72753) ([Vitaly Baranov](https://github.com/vitlibar)).
* 函数 `ifNull` 和 `coalesce` 支持 `Dynamic` 类型。 [#72772](https://github.com/ClickHouse/ClickHouse/pull/72772) ([Pavel Kruglov](https://github.com/Avogar)).
* 函数 `toFloat64`/`touInt32` 等支持 `Dynamic`。 [#72989](https://github.com/ClickHouse/ClickHouse/pull/72989) ([Pavel Kruglov](https://github.com/Avogar)).
* 新增 S3 请求设置 `http_max_fields`、`http_max_field_name_size`、`http_max_field_value_size`，在备份或恢复期间解析 S3 API 响应时使用。 [#72778](https://github.com/ClickHouse/ClickHouse/pull/72778) ([Vitaly Baranov](https://github.com/vitlibar)).
* Storage S3(Azure)Queue 仅在使用某份元数据的最后一张表被删除后，才删除 Keeper 中的该表元数据。 [#72810](https://github.com/ClickHouse/ClickHouse/pull/72810) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 新增 `JoinBuildTableRowCount`/`JoinProbeTableRowCount/JoinResultRowCount` 性能分析事件。 [#72842](https://github.com/ClickHouse/ClickHouse/pull/72842) ([Vladimir Cherkasov](https://github.com/vdimir)).
* MergeTree 排序键和数据跳过索引支持子列。 [#72644](https://github.com/ClickHouse/ClickHouse/pull/72644) ([Pavel Kruglov](https://github.com/Avogar)).

<h4 id="bug-fix-user-visible-misbehavior-in-an-official-stable-release">
  缺陷修复（正式稳定版本中用户可见的异常行为）
</h4>

* 修复 MergeTree 可能出现相交数据片段的问题（将数据片段移至 detached 目录失败后可能发生，失败可能由对象存储操作引起）。 [#70476](https://github.com/ClickHouse/ClickHouse/pull/70476) ([Azat Khuzhin](https://github.com/azat)).
* 修复表名过长时的错误检测，并提供说明最大长度的诊断信息。新增函数 `getMaxTableNameLengthForDatabase`。 [#70810](https://github.com/ClickHouse/ClickHouse/pull/70810) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 修复 `clickhouse-library-bridge` 崩溃后遗留僵尸进程的问题（此程序允许运行不安全的库）。 [#71301](https://github.com/ClickHouse/ClickHouse/pull/71301) ([MikhailBurdukov](https://github.com/MikhailBurdukov)).
* 修复 `plain_rewritable` 磁盘创建目录失败后，事务回滚期间出现 NoSuchKey 错误。 [#71439](https://github.com/ClickHouse/ClickHouse/pull/71439) ([Julia Kartseva](https://github.com/jkartseva)).
* 修复 `Pretty` JSON 格式中 `Dynamic` 值的序列化。 [#71923](https://github.com/ClickHouse/ClickHouse/pull/71923) ([Pavel Kruglov](https://github.com/Avogar)).
* 在 `File`/`S3`/`URL`/`HDFS`/`Azure` 引擎的创建查询中添加推断出的格式名。此前每次服务器重启都会重新推断格式名，如果指定的数据文件已被移除，就会导致服务器启动出错。 [#72108](https://github.com/ClickHouse/ClickHouse/pull/72108) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复旧分析器在 join on 表达式中使用 UDF 时的缺陷。 [#72179](https://github.com/ClickHouse/ClickHouse/pull/72179) ([Raúl Marín](https://github.com/Algunenano)).
* 修复 `StorageObjectStorage` 的一些小缺陷，这是默认启用 `use_hive_partitioning` 所需要的。 [#72185](https://github.com/ClickHouse/ClickHouse/pull/72185) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 修复 `min_age_to_force_merge_on_partition_only` 反复尝试合并已合并为单个数据片段的同一分区，从而停滞且不合并含多个数据片段的分区的问题。 [#72209](https://github.com/ClickHouse/ClickHouse/pull/72209) ([Christoph Wurm](https://github.com/cwurm)).
* 修复 `SimpleSquashingChunksTransform` 处理稀疏列时罕见的崩溃。 [#72226](https://github.com/ClickHouse/ClickHouse/pull/72226) ([Vladimir Cherkasov](https://github.com/vdimir)).
* 修复 `GraceHashJoin` 中的数据竞态，该问题可能导致连接输出缺少部分行。 [#72233](https://github.com/ClickHouse/ClickHouse/pull/72233) ([Nikita Taranov](https://github.com/nickitat)).
* 修复包含物化 `_block_number` 列时的 `ALTER DELETE` 查询（启用设置 `enable_block_number_column` 时）。 [#72261](https://github.com/ClickHouse/ClickHouse/pull/72261) ([Anton Popov](https://github.com/CurtizJ)).
* 修复并发调用 `ColumnDynamic::dumpStructure()` 时的数据竞态，例如在 `ConcurrentHashJoin` 构造函数中。 [#72278](https://github.com/ClickHouse/ClickHouse/pull/72278) ([Nikita Taranov](https://github.com/nickitat)).
* 修复 `ORDER BY ... WITH FILL` 包含重复列时可能出现的 `LOGICAL_ERROR`。 [#72387](https://github.com/ClickHouse/ClickHouse/pull/72387) ([Vladimir Cherkasov](https://github.com/vdimir)).
* 修复应用 `optimize_functions_to_subcolumns` 后若干情况下的类型不匹配。 [#72394](https://github.com/ClickHouse/ClickHouse/pull/72394) ([Anton Popov](https://github.com/CurtizJ)).
* 使用 `AWS_CONTAINER_AUTHORIZATION_TOKEN_FILE` 而非 `AWS_CONTAINER_AUTHORIZATION_TOKEN_PATH`。修复 [#71074](https://github.com/ClickHouse/ClickHouse/issues/71074)。 [#72397](https://github.com/ClickHouse/ClickHouse/pull/72397) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 修复解析 `BACKUP DATABASE db EXCEPT TABLES db.table` 查询失败。 [#72429](https://github.com/ClickHouse/ClickHouse/pull/72429) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 禁止创建空 `Variant`。 [#72454](https://github.com/ClickHouse/ClickHouse/pull/72454) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复 `system.merges` 中 `result_part_path` 的无效格式化。 [#72567](https://github.com/ClickHouse/ClickHouse/pull/72567) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 修复解析仅含一个元素的 glob（例如 `{file}`）。 [#72572](https://github.com/ClickHouse/ClickHouse/pull/72572) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 修复含 `ARRAY JOIN` 的分布式查询为跟随服务器生成查询的问题。修复 [#69276](https://github.com/ClickHouse/ClickHouse/issues/69276)。 [#72608](https://github.com/ClickHouse/ClickHouse/pull/72608) ([Dmitry Novik](https://github.com/novikd)).
* 修复 DateTime64 IN DateTime64 不返回任何结果的缺陷。 [#72640](https://github.com/ClickHouse/ClickHouse/pull/72640) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 修复为 Replicated 数据库添加新副本时的元数据不一致，该数据库中存在使用 `flatten_nested=0` 创建的表。 [#72685](https://github.com/ClickHouse/ClickHouse/pull/72685) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 修复 Keeper 内部通信的高级 SSL 配置。 [#72730](https://github.com/ClickHouse/ClickHouse/pull/72730) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复 S3Queue 无序模式中，`tracked_files_limit` 设置小于 S3 文件出现速率时的“No such key”错误。 [#72738](https://github.com/ClickHouse/ClickHouse/pull/72738) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复用户在本地不存在时 RemoteQueryExecutor 抛出的异常。 [#72759](https://github.com/ClickHouse/ClickHouse/pull/72759) ([Andrey Zvonov](https://github.com/zvonand)).
* 修复包含物化 `_block_number` 列时的变更操作（启用设置 `enable_block_number_column` 时）。 [#72854](https://github.com/ClickHouse/ClickHouse/pull/72854) ([Anton Popov](https://github.com/CurtizJ)).
* 修复备份中包含空文件时，使用 plain rewritable 磁盘进行备份/恢复的问题。 [#72858](https://github.com/ClickHouse/ClickHouse/pull/72858) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 正确取消 DistributedAsyncInsertDirectoryQueue 中的插入。 [#72885](https://github.com/ClickHouse/ClickHouse/pull/72885) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复将错误数据解析到稀疏列时的崩溃（启用设置 `enable_parsing_to_custom_serialization` 时可能发生）。 [#72891](https://github.com/ClickHouse/ClickHouse/pull/72891) ([Anton Popov](https://github.com/CurtizJ)).
* 修复备份恢复期间潜在的崩溃。 [#72947](https://github.com/ClickHouse/ClickHouse/pull/72947) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复 `parallel_hash` JOIN 方法的缺陷，查询的 `ON` 子句包含带不等式过滤条件的复杂条件时可能出现。 [#72993](https://github.com/ClickHouse/ClickHouse/pull/72993) ([Nikita Taranov](https://github.com/nickitat)).
* 在 JSON 解析期间使用默认格式设置，避免反序列化损坏。 [#73043](https://github.com/ClickHouse/ClickHouse/pull/73043) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复事务使用不支持的存储时发生崩溃。 [#73045](https://github.com/ClickHouse/ClickHouse/pull/73045) ([Raúl Marín](https://github.com/Algunenano)).
* 修复可能高估内存跟踪用量的问题（表现为 `MemoryTracking` 与 `MemoryResident` 之差持续增长）。 [#73081](https://github.com/ClickHouse/ClickHouse/pull/73081) ([Azat Khuzhin](https://github.com/azat)).
* 解析 Tuple 时检查重复 JSON 键。此前解析期间可能因此产生逻辑错误 `Invalid number of rows in Chunk`。 [#73082](https://github.com/ClickHouse/ClickHouse/pull/73082) ([Pavel Kruglov](https://github.com/Avogar)).

<h4 id="buildtestingpackaging-improvement">
  构建/测试/打包改进
</h4>

* 此前放在 `/utils` 目录、需要从源码手动编译的所有小工具，现在都包含在 ClickHouse 主程序包中。关闭：[#72404](https://github.com/ClickHouse/ClickHouse/issues/72404)。 [#72426](https://github.com/ClickHouse/ClickHouse/pull/72426) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* 不再执行 22.3 中引入的 `/etc/systemd/system/clickhouse-server.service` 删除操作，参见 [#39323](https://github.com/ClickHouse/ClickHouse/issues/39323)。 [#72259](https://github.com/ClickHouse/ClickHouse/pull/72259) ([Mikhail f. Shiryaev](https://github.com/Felixoid)).
* 拆分大型编译单元，避免因内存/CPU 限制导致编译失败。 [#72352](https://github.com/ClickHouse/ClickHouse/pull/72352) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* OSX：构建时启用 ICU 支持，从而支持排序规则、字符集转换及其他本地化功能。 [#73083](https://github.com/ClickHouse/ClickHouse/pull/73083) ([Raúl Marín](https://github.com/Algunenano)).
