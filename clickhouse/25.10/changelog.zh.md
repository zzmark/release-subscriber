<h3 id="2510">
  ClickHouse 25.10 版本, 2025-10-31
</h3>

#### 向后不兼容变更

* 更改 `schema_inference_make_columns_nullable` 的默认设置：遵循 Parquet/ORC/Arrow 元数据中列的 `Nullable` 信息，而非将所有列都设为 Nullable。文本格式不变。 [#71499](https://github.com/ClickHouse/ClickHouse/pull/71499) ([Michael Kolupaev](https://github.com/al13n321)).
* 查询结果缓存将忽略 `log_comment` 设置，因此仅更改查询的 `log_comment` 不再导致缓存未命中。少数用户可能有意通过改变 `log_comment` 隔离缓存，本次变化改变了这种行为，因此向后不兼容。请改用设置 `query_cache_tag` 实现此目的。 [#79878](https://github.com/ClickHouse/ClickHouse/pull/79878) ([filimonov](https://github.com/filimonov)).
* 此前，如果查询中的表函数与运算符实现函数同名，格式化会不一致。关闭 [#81601](https://github.com/ClickHouse/ClickHouse/issues/81601)。关闭 [#81977](https://github.com/ClickHouse/ClickHouse/issues/81977)。关闭 [#82834](https://github.com/ClickHouse/ClickHouse/issues/82834)。关闭 [#82835](https://github.com/ClickHouse/ClickHouse/issues/82835)。EXPLAIN SYNTAX 查询不再始终将其格式化为运算符，新行为更符合解释语法的目的。如果查询以函数形式书写，`clickhouse-format`、`formatQuery` 等不会将函数格式化为运算符。 [#82825](https://github.com/ClickHouse/ClickHouse/pull/82825) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 禁止在 `JOIN` 键中使用 `Dynamic` 类型。将 `Dynamic` 值与非 `Dynamic` 类型比较可能产生意外结果，最好先将 `Dynamic` 列转换为所需类型。 [#86358](https://github.com/ClickHouse/ClickHouse/pull/86358) ([Pavel Kruglov](https://github.com/Avogar)).
* 服务器选项 `storage_metadata_write_full_object_key` 默认开启，且现在无法关闭。这是向后兼容的变化，此处仅提醒注意。该变化的前向兼容范围仅限 25.x 版本，也就是说，如果需要回退新版本，只能降级到某个 25.x 版本。 [#87335](https://github.com/ClickHouse/ClickHouse/pull/87335) ([Sema Checherinda](https://github.com/CheSema)).
* 将 `replicated_deduplication_window_seconds` 从一周降至一小时，以便在插入速率较低时减少 ZooKeeper 中的 ZNode 数量。 [#87414](https://github.com/ClickHouse/ClickHouse/pull/87414) ([Sema Checherinda](https://github.com/CheSema)).
* 将设置 `query_plan_use_new_logical_join_step` 重命名为 `query_plan_use_logical_join_step`。 [#87679](https://github.com/ClickHouse/ClickHouse/pull/87679) ([Vladimir Cherkasov](https://github.com/vdimir)).
* 新增语法，使文本索引的分词器参数拥有更强的表达能力。 [#87997](https://github.com/ClickHouse/ClickHouse/pull/87997) ([Elmi Ahmadov](https://github.com/ahmadov)).
* 将函数 `searchAny` 和 `searchAll` 重命名为 `hasAnyTokens` 和 `hasAllTokens`，更好地与已有函数 `hasToken` 保持一致。 [#88109](https://github.com/ClickHouse/ClickHouse/pull/88109) ([Robert Schulze](https://github.com/rschu1ze)).
* 从文件系统缓存中移除 `cache_hits_threshold`。此功能是在尚无 SLRU 缓存策略时由外部贡献者添加的；现在已有 SLRU，没有必要同时支持两者。 [#88344](https://github.com/ClickHouse/ClickHouse/pull/88344) ([Kseniia Sumarokova](https://github.com/kssenii)).
* `min_free_disk_ratio_to_perform_insert` 和 `min_free_disk_bytes_to_perform_insert` 的行为有两点小变化：一是用未预留字节数而非可用字节数判断是否拒绝插入。如果后台合并和变更操作的预留空间相对阈值较小，这可能影响不大，但这样更正确。二是不对系统表应用这些设置，因为我们仍希望 `query_log` 等表持续更新，这对调试很有帮助。系统表写入量通常远小于实际数据，因此在合理的 `min_free_disk_ratio_to_perform_insert` 阈值下应能继续运行更久。 [#88468](https://github.com/ClickHouse/ClickHouse/pull/88468) ([c-end](https://github.com/c-end)).
* 为 Keeper 内部复制启用异步模式。Keeper 保持此前行为，性能可能提升。如果从早于 23.9 的版本升级，需先升级到 23.9 或更新版本，再升级到 25.10 或更新版本。也可在升级前将 `keeper_server.coordination_settings.async_replication` 设为 0，升级完成后再启用。 [#88515](https://github.com/ClickHouse/ClickHouse/pull/88515) ([Antonio Andelic](https://github.com/antonio2368)).

#### 新功能

* 支持负数 `LIMIT` 和负数 `OFFSET`。关闭 [#28913](https://github.com/ClickHouse/ClickHouse/issues/28913)。 [#88411](https://github.com/ClickHouse/ClickHouse/pull/88411) ([Nihal Z. Miaji](https://github.com/nihalzp)).
* `Alias` 引擎创建另一张表的代理。全部读写操作转发至目标表；别名本身不存储数据，仅维护对目标表的引用。 [#87965](https://github.com/ClickHouse/ClickHouse/pull/87965) ([Kai Zhu](https://github.com/nauu)).
* 完整支持运算符 `IS NOT DISTINCT FROM`（`<=>`）。 [#88155](https://github.com/ClickHouse/ClickHouse/pull/88155) ([simonmichal](https://github.com/simonmichal)).
* 支持为 `MergeTree` 表中所有适合的列自动创建统计信息。新增表级设置 `auto_statistics_types`，以逗号分隔指定需要创建的统计信息类型（例如 `auto_statistics_types = 'minmax, uniq, countmin'`）。 [#87241](https://github.com/ClickHouse/ClickHouse/pull/87241) ([Anton Popov](https://github.com/CurtizJ)).
* 新增文本布隆过滤器索引 `sparse_gram`。 [#79985](https://github.com/ClickHouse/ClickHouse/pull/79985) ([scanhex12](https://github.com/scanhex12)).
* 新增函数 `conv`，用于数值进制转换，目前支持 `2-36` 进制。 [#83058](https://github.com/ClickHouse/ClickHouse/pull/83058) ([hp](https://github.com/hp77-creator)).
* 支持 `LIMIT BY ALL` 语法。类似 `GROUP BY ALL` 和 `ORDER BY ALL`，`LIMIT BY ALL` 自动展开，将 SELECT 子句中所有非聚合表达式作为 LIMIT BY 键。例如，`SELECT id, name, count(*) FROM table GROUP BY id LIMIT 1 BY ALL` 等价于 `SELECT id, name, count(*) FROM table GROUP BY id LIMIT 1 BY id, name`。想按全部所选非聚合列限制结果时，无需显式列出它们，可简化查询。关闭 [#59152](https://github.com/ClickHouse/ClickHouse/issues/59152)。 [#84079](https://github.com/ClickHouse/ClickHouse/pull/84079) ([Surya Kant Ranjan](https://github.com/iit2009046)).
* 支持在 ClickHouse 中查询 Apache Paimon，使 ClickHouse 用户可直接访问 Paimon 数据湖存储。 [#84423](https://github.com/ClickHouse/ClickHouse/pull/84423) ([JIaQi](https://github.com/JiaQiTang98)).
* 新增聚合函数 `studentTTestOneSample`。 [#85436](https://github.com/ClickHouse/ClickHouse/pull/85436) ([Dylan](https://github.com/DylanBlakemore)).
* 新增聚合函数 `quantilePrometheusHistogram`，接受直方图桶的上界和累计值作为参数，在分位数所在桶的上下界间进行线性插值。行为类似 PromQL 对经典直方图的 `histogram_quantile` 函数。 [#86294](https://github.com/ClickHouse/ClickHouse/pull/86294) ([Stephen Chi](https://github.com/stephchi0)).
* 为 DeltaLake 元数据文件新增系统表。 [#87263](https://github.com/ClickHouse/ClickHouse/pull/87263) ([scanhex12](https://github.com/scanhex12)).
* 新增 `ALTER TABLE REWRITE PARTS`，使用所有新设置从头重写表的数据片段（因为 `use_const_adaptive_granularity` 等部分设置仅应用于新数据片段）。 [#87774](https://github.com/ClickHouse/ClickHouse/pull/87774) ([Azat Khuzhin](https://github.com/azat)).
* 新增 `SYSTEM RECONNECT ZOOKEEPER` 命令，强制断开并重新建立 ZooKeeper 连接（[https://github.com/ClickHouse/ClickHouse/issues/87317](https://github.com/ClickHouse/ClickHouse/issues/87317)）。 [#87318](https://github.com/ClickHouse/ClickHouse/pull/87318) ([Pradeep Chhetri](https://github.com/chhetripradeep)).
* 通过设置 `max_named_collection_num_to_warn` 和 `max_named_collection_num_to_throw` 限制命名集合数量。新增指标 `NamedCollection` 和错误 `TOO_MANY_NAMED_COLLECTIONS`。 [#87343](https://github.com/ClickHouse/ClickHouse/pull/87343) ([Pablo Marcos](https://github.com/pamarcos)).
* 为 `startsWith` 和 `endsWith` 新增优化后的大小写不敏感变体：`startsWithCaseInsensitive`、`endsWithCaseInsensitive`、`startsWithCaseInsensitiveUTF8` 和 `endsWithCaseInsensitiveUTF8`。 [#87374](https://github.com/ClickHouse/ClickHouse/pull/87374) ([Guang Zhao](https://github.com/zheguang)).
* 支持在服务器配置的“resources\_and\_workloads”节中以 SQL 提供 `WORKLOAD` 和 `RESOURCE` 定义。 [#87430](https://github.com/ClickHouse/ClickHouse/pull/87430) ([Sergei Trifonov](https://github.com/serxa)).
* 新增表设置 `min_level_for_wide_part`，允许指定创建宽数据片段的最低层级。 [#88179](https://github.com/ClickHouse/ClickHouse/pull/88179) ([Christoph Wurm](https://github.com/cwurm)).
* 为 Keeper 客户端的 `cp`、`mv` 命令新增递归变体 `cpr`、`mvr`。 [#88570](https://github.com/ClickHouse/ClickHouse/pull/88570) ([Mikhail Artemenko](https://github.com/Michicosun)).
* 新增会话设置，指定插入时不物化的数据跳过索引列表（`exclude_materialize_skip_indexes_on_insert`）；新增 MergeTree 表设置，指定合并时不物化的数据跳过索引列表（`exclude_materialize_skip_indexes_on_merge`）。 [#87252](https://github.com/ClickHouse/ClickHouse/pull/87252) ([George Larionov](https://github.com/george-larionov)).

#### 实验性功能

* 实现 `QBit` 数据类型，以位切片格式存储向量；实现 `L2DistanceTransposed` 函数，通过参数控制精度与速度的权衡，支持近似向量搜索。 [#87922](https://github.com/ClickHouse/ClickHouse/pull/87922) ([Raufs Dunamalijevs](https://github.com/rienath)).
* 函数 `searchAll` 和 `searchAny` 现在也可用于没有文本索引的列，此时使用默认分词器。 [#87722](https://github.com/ClickHouse/ClickHouse/pull/87722) ([Jimmy Aguilar Mena](https://github.com/Ergus)).

#### 性能改进

* 在 JOIN 和 ARRAY JOIN 中实现列的延迟复制。在部分输出格式中避免将 Sparse、Replicated 等特殊列表示转换为完整列，从而避免不必要的内存数据复制。 [#88752](https://github.com/ClickHouse/ClickHouse/pull/88752) ([Pavel Kruglov](https://github.com/Avogar)).
* 为 MergeTree 表的顶层 String 列添加可选的 `.size` 子列序列化，改善压缩并支持高效访问子列。引入新的 MergeTree 设置，控制序列化版本及针对空字符串的表达式优化。 [#82850](https://github.com/ClickHouse/ClickHouse/pull/82850) ([Amos Bird](https://github.com/amosbird)).
* Iceberg 支持按序读取。 [#88454](https://github.com/ClickHouse/ClickHouse/pull/88454) ([scanhex12](https://github.com/scanhex12)).
* 在运行时从右子树构建布隆过滤器，并将其传递至左子树扫描，从而加快部分 JOIN 查询。例如可改善 `SELECT avg(o_totalprice) FROM orders, customer, nation WHERE c_custkey = o_custkey AND c_nationkey=n_nationkey AND n_name = 'FRANCE'` 等查询。 [#84772](https://github.com/ClickHouse/ClickHouse/pull/84772) ([Alexander Gololobov](https://github.com/davenger)).
* 重构查询条件缓存（QCC）与索引分析的执行顺序和集成，提升查询性能。现在在主键和数据跳过索引分析之前应用 QCC 过滤，减少不必要的索引计算。索引分析扩展为支持多个范围过滤器，其过滤结果也会写回 QCC。对于索引分析占主要执行时间的查询，尤其依赖向量或倒排等数据跳过索引的查询，可显著加速。 [#82380](https://github.com/ClickHouse/ClickHouse/pull/82380) ([Amos Bird](https://github.com/amosbird)).
* 一系列微优化，加快小查询。 [#83096](https://github.com/ClickHouse/ClickHouse/pull/83096) ([Raúl Marín](https://github.com/Algunenano)).
* 在原生协议中压缩日志和性能分析事件。拥有超过 100 个副本的集群中，未压缩的性能分析事件占用 1..10 MB/sec，慢速网络连接上的进度条也会迟缓。关闭 [#82533](https://github.com/ClickHouse/ClickHouse/issues/82533)。 [#83586](https://github.com/ClickHouse/ClickHouse/pull/83586) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 使用 [StringZilla](https://github.com/ashvardanian/StringZilla) 库提升区分大小写的字符串搜索性能（如 `WHERE URL LIKE '%google%'` 过滤），在可用时利用 SIMD CPU 指令。 [#84161](https://github.com/ClickHouse/ClickHouse/pull/84161) ([Raúl Marín](https://github.com/Algunenano)).
* 对包含 `SimpleAggregateFunction(anyLast)` 类型列的 AggregatingMergeTree 表执行带 FINAL 的 SELECT 时，减少内存分配和复制。 [#84428](https://github.com/ClickHouse/ClickHouse/pull/84428) ([Duc Canh Le](https://github.com/canhld94)).
* 新增析取 JOIN 谓词下推逻辑。例如 TPC-H Q7 中，针对表 n1、n2 的条件 `(n1.n_name = 'FRANCE' AND n2.n_name = 'GERMANY') OR (n1.n_name = 'GERMANY' AND n2.n_name = 'FRANCE')`，分别提取部分过滤条件：n1 使用 `n1.n_name = 'FRANCE' OR n1.n_name = 'GERMANY'`，n2 使用 `n2.n_name = 'GERMANY' OR n2.n_name = 'FRANCE'`。 [#84735](https://github.com/ClickHouse/ClickHouse/pull/84735) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 通过默认启用的新设置 `optimize_rewrite_like_perfect_affix`，改善前缀或后缀 `LIKE` 的性能。 [#85920](https://github.com/ClickHouse/ClickHouse/pull/85920) ([Guang Zhao](https://github.com/zheguang)).
* 修复按多个字符串/数值列分组时，较大的序列化键导致的性能下降。这是以下变更的后续工作： [#83884](https://github.com/ClickHouse/ClickHouse/pull/83884). [#85924](https://github.com/ClickHouse/ClickHouse/pull/85924) ([李扬](https://github.com/taiyang-li)).
* 新增设置 `joined_block_split_single_row`，降低每个键存在大量匹配时哈希连接的内存占用。即使是左表同一行的匹配结果，也允许分块输出；当左表一行匹配右表数千或数百万行时尤其有用。此前所有匹配必须一次性在内存中物化。此变化降低峰值内存占用，但可能增加 CPU 使用。 [#87913](https://github.com/ClickHouse/ClickHouse/pull/87913) ([Vladimir Cherkasov](https://github.com/vdimir)).
* 改进 SharedMutex，提升大量并发查询时的性能。 [#87491](https://github.com/ClickHouse/ClickHouse/pull/87491) ([Raúl Marín](https://github.com/Algunenano)).
* 改进为主要包含低频 token 的文档构建文本索引的性能。 [#87546](https://github.com/ClickHouse/ClickHouse/pull/87546) ([Anton Popov](https://github.com/CurtizJ)).
* 加快 Field 析构函数的常见执行路径，改善大量小查询时的性能。 [#87631](https://github.com/ClickHouse/ClickHouse/pull/87631) ([Raúl Marín](https://github.com/Algunenano)).
* JOIN 优化期间跳过运行时哈希表统计信息重新计算，改善所有 JOIN 查询的性能。新增性能分析事件 `JoinOptimizeMicroseconds` 和 `QueryPlanOptimizeMicroseconds`。 [#87683](https://github.com/ClickHouse/ClickHouse/pull/87683) ([Vladimir Cherkasov](https://github.com/vdimir)).
* 为 MergeTreeLazy 读取器启用将标记保存至缓存，并避免直接 I/O，改善带 ORDER BY 和较小 LIMIT 的查询性能。 [#87989](https://github.com/ClickHouse/ClickHouse/pull/87989) ([Nikita Taranov](https://github.com/nickitat)).
* 对带 `is_deleted` 列的 `ReplacingMergeTree` 表执行含 `FINAL` 的 SELECT 现在更快，原因是两项已有优化的并行度提升：1. 对仅含单个 `part` 的分区应用 `do_not_merge_across_partitions_select_final`；2. 将其他所选范围分为 `intersecting / non-intersecting`，仅相交范围需要经过 FINAL 合并转换。 [#88090](https://github.com/ClickHouse/ClickHouse/pull/88090) ([Shankar Iyer](https://github.com/shankar-iyer)).
* 降低未使用故障点时的开销，即未启用调试的默认代码路径。 [#88196](https://github.com/ClickHouse/ClickHouse/pull/88196) ([Raúl Marín](https://github.com/Algunenano)).
* `system.tables` 按 `uuid` 过滤时避免全表扫描（仅从日志或 ZooKeeper 路径获知 UUID 时很有用）。 [#88379](https://github.com/ClickHouse/ClickHouse/pull/88379) ([Azat Khuzhin](https://github.com/azat)).
* 改善函数 `tokens`、`hasAllTokens`、`hasAnyTokens` 的性能。 [#88416](https://github.com/ClickHouse/ClickHouse/pull/88416) ([Anton Popov](https://github.com/CurtizJ)).
* 内联 `AddedColumns::appendFromBlock`，略微改善部分情况下的 JOIN 性能。 [#88455](https://github.com/ClickHouse/ClickHouse/pull/88455) ([Nikita Taranov](https://github.com/nickitat)).
* 客户端自动补全改用 `system.completions`，无需多次查询系统表，速度更快且行为更一致。 [#84694](https://github.com/ClickHouse/ClickHouse/pull/84694) ([|2ustam](https://github.com/RuS2m)).
* 新增文本索引参数 `dictionary_block_frontcoding_compression` 控制字典压缩，默认启用 `front-coding` 压缩。 [#87175](https://github.com/ClickHouse/ClickHouse/pull/87175) ([Elmi Ahmadov](https://github.com/ahmadov)).
* 依据设置 `min_insert_block_size_rows_for_materialized_views` 和 `min_insert_block_size_bytes_for_materialized_views`，在插入物化视图前合并全部线程的数据。此前启用 `parallel_view_processing` 时，写入同一物化视图的各线程独立合并插入数据，可能生成更多数据片段。 [#87280](https://github.com/ClickHouse/ClickHouse/pull/87280) ([Antonio Andelic](https://github.com/antonio2368)).
* 新增设置 `temporary_files_buffer_size`，控制临时文件写入器的缓冲区大小。\* 优化 `LowCardinality` 列的 `scatter` 操作（例如用于 Grace Hash Join）的内存占用。 [#88237](https://github.com/ClickHouse/ClickHouse/pull/88237) ([Vladimir Cherkasov](https://github.com/vdimir)).
* 支持通过并行副本直接从文本索引读取，改善从对象存储读取文本索引的性能。 [#88262](https://github.com/ClickHouse/ClickHouse/pull/88262) ([Anton Popov](https://github.com/CurtizJ)).
* 查询数据湖目录中的表时，将使用并行副本进行分布式处理。 [#88273](https://github.com/ClickHouse/ClickHouse/pull/88273) ([scanhex12](https://github.com/scanhex12)).
* 名为“to\_remove\_small\_parts\_at\_right”的后台合并算法内部调优启发式，将在计算合并范围评分之前执行。此前合并选择器先选择宽范围合并，再过滤其后缀。修复：[#85374](https://github.com/ClickHouse/ClickHouse/issues/85374)。 [#88736](https://github.com/ClickHouse/ClickHouse/pull/88736) ([Mikhail Artemenko](https://github.com/Michicosun)).

#### 改进

* 函数 `generateSerialID` 现在支持以非常量参数指定序列名。关闭 [#83750](https://github.com/ClickHouse/ClickHouse/issues/83750)。 [#88270](https://github.com/ClickHouse/ClickHouse/pull/88270) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 为 `generateSerialID` 新增可选参数 `start_value`，指定新序列的自定义起始值。 [#88085](https://github.com/ClickHouse/ClickHouse/pull/88085) ([Manuel](https://github.com/raimannma)).
* 为 `clickhouse-format` 新增 `--semicolons_inline` 选项，将分号放在末行，而非单独换行。 [#88018](https://github.com/ClickHouse/ClickHouse/pull/88018) ([Jan Rada](https://github.com/ZelvaMan)).
* 配置被 Keeper 覆盖时，允许配置服务器级限流。关闭 [#73964](https://github.com/ClickHouse/ClickHouse/issues/73964)。 [#74066](https://github.com/ClickHouse/ClickHouse/pull/74066) ([JIaQi](https://github.com/JiaQiTang98)).
* 当两个样本都仅含相同值时，`mannWhitneyUTest` 不再抛出异常，而是返回与 SciPy 一致的有效结果。关闭：[#79814](https://github.com/ClickHouse/ClickHouse/issues/79814)。 [#80009](https://github.com/ClickHouse/ClickHouse/pull/80009) ([DeanNeaht](https://github.com/DeanNeaht)).
* 可重写磁盘对象存储事务在元数据事务提交后，删除此前的远程 blob。 [#81787](https://github.com/ClickHouse/ClickHouse/pull/81787) ([Sema Checherinda](https://github.com/CheSema)).
* 修复冗余相等表达式优化：优化前后结果类型的 `LowCardinality` 属性可能不同。 [#82651](https://github.com/ClickHouse/ClickHouse/pull/82651) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* 当 HTTP 客户端除 `Expect: 100-continue` 外，还设置 `X-ClickHouse-100-Continue: defer` 请求头时，ClickHouse 仅在配额验证通过后发送 `100 Continue` 响应，避免传输最终会丢弃的请求体而浪费网络带宽。这适用于在 URL 查询字符串中发送查询、在请求体中发送数据的 INSERT。不发送完整请求体就中止请求会阻止 HTTP/1.1 连接复用，但与大批量数据的总 INSERT 耗时相比，建立新连接引入的额外延迟通常很小。 [#84304](https://github.com/ClickHouse/ClickHouse/pull/84304) ([c-end](https://github.com/c-end)).
* 使用 DATABASE ENGINE = Backup 和 S3 存储时，遮蔽日志中的 S3 凭据。 [#85336](https://github.com/ClickHouse/ClickHouse/pull/85336) ([Kenny Sun](https://github.com/hwabis)).
* 通过推迟相关子查询输入子计划的物化，使其能够看到查询计划优化。属于 [#79890](https://github.com/ClickHouse/ClickHouse/issues/79890) 的一部分。 [#85455](https://github.com/ClickHouse/ClickHouse/pull/85455) ([Dmitry Novik](https://github.com/novikd)).
* 更改 SYSTEM DROP DATABASE REPLICA：按数据库删除或删除整个副本时，也会删除数据库各表的副本；提供 'WITH TABLES' 时删除各存储的副本，否则逻辑不变，仅删除数据库副本。通过 Keeper 路径删除数据库副本时，如果提供 'WITH TABLES'，则将数据库恢复为 Atomic、根据 Keeper 中的语句恢复 ReplicatedMergeTree 表，再删除数据库（恢复的表也一并删除）；否则仅删除所提供 Keeper 路径上的副本。 [#85637](https://github.com/ClickHouse/ClickHouse/pull/85637) ([Tuan Pham Anh](https://github.com/tuanpach)).
* 修复 TTL 包含 `materialize` 函数时的格式化不一致。关闭 [#82828](https://github.com/ClickHouse/ClickHouse/issues/82828)。 [#85749](https://github.com/ClickHouse/ClickHouse/pull/85749) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Iceberg 表状态不再存于存储对象中，使 ClickHouse 中的 Iceberg 能处理并发查询。 [#86062](https://github.com/ClickHouse/ClickHouse/pull/86062) ([Daniil Ivanik](https://github.com/divanik)).
* 使 S3Queue 有序模式的桶锁持久化，类似 `use_persistent_processing_nodes = 1` 时的处理节点。在测试中加入 Keeper 故障注入。 [#86628](https://github.com/ClickHouse/ClickHouse/pull/86628) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 用户拼错格式名时提供提示。关闭 [#86761](https://github.com/ClickHouse/ClickHouse/issues/86761)。 [#87092](https://github.com/ClickHouse/ClickHouse/pull/87092) ([flynn](https://github.com/ucasfl)).
* 不存在投影时，远程副本跳过索引分析。 [#87096](https://github.com/ClickHouse/ClickHouse/pull/87096) ([zoomxi](https://github.com/zoomxi)).
* 允许为 Ytsaurus 表禁用 UTF-8 编码。 [#87150](https://github.com/ClickHouse/ClickHouse/pull/87150) ([MikhailBurdukov](https://github.com/MikhailBurdukov)).
* 默认禁用 `s3_slow_all_threads_after_retryable_error`。 [#87198](https://github.com/ClickHouse/ClickHouse/pull/87198) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* 将表函数 `arrowflight` 重命名为 `arrowFlight`。 [#87249](https://github.com/ClickHouse/ClickHouse/pull/87249) ([Vitaly Baranov](https://github.com/vitlibar)).
* 更新 `clickhouse-benchmark`，其命令行标志中可以用 `-` 替代 `_`。 [#87251](https://github.com/ClickHouse/ClickHouse/pull/87251) ([Ahmed Gouda](https://github.com/0xgouda)).
* 使信号处理期间向 `system.crash_log` 的刷写同步执行。 [#87253](https://github.com/ClickHouse/ClickHouse/pull/87253) ([Miсhael Stetsyuk](https://github.com/mstetsyuk)).
* 新增设置 `inject_random_order_for_select_without_order_by`，为没有 `ORDER BY` 子句的顶层 `SELECT` 查询注入 `ORDER BY rand()`。 [#87261](https://github.com/ClickHouse/ClickHouse/pull/87261) ([Rui Zhang](https://github.com/zhangruiddn)).
* 改进 `joinGet` 错误消息，正确说明 `join_keys` 数量与 `right_table_keys` 数量不同。 [#87279](https://github.com/ClickHouse/ClickHouse/pull/87279) ([Isak Ellmer](https://github.com/spinojara)).
* 支持在写事务期间检查任意 Keeper 节点的状态，有助于检测 ABA 问题。 [#87282](https://github.com/ClickHouse/ClickHouse/pull/87282) ([Mikhail Artemenko](https://github.com/Michicosun)).
* 将重量级 Ytsaurus 请求转发至重量级代理。 [#87342](https://github.com/ClickHouse/ClickHouse/pull/87342) ([MikhailBurdukov](https://github.com/MikhailBurdukov)).
* 修复磁盘事务元数据在各种工作负载下 unlink/rename/removeRecursive/removeDirectory 等操作的回滚及硬链接计数；简化接口，使其更通用，可在其他元数据存储中复用。 [#87358](https://github.com/ClickHouse/ClickHouse/pull/87358) ([Mikhail Artemenko](https://github.com/Michicosun)).
* 新增配置参数 `keeper_server.tcp_nodelay`，允许为 Keeper 禁用 `TCP_NODELAY`。 [#87363](https://github.com/ClickHouse/ClickHouse/pull/87363) (Copilot).
* `clickhouse-benchmarks` 支持 `--connection`，与 `clickhouse-client` 的行为相同。可在客户端 `config.xml`/`config.yaml` 的 `connections_credentials` 路径下指定预定义连接，无需在命令行参数中显式提供用户名/密码。为 `clickhouse-benchmark` 添加 `--accept-invalid-certificate` 支持。 [#87370](https://github.com/ClickHouse/ClickHouse/pull/87370) ([Azat Khuzhin](https://github.com/azat)).
* 设置 `max_insert_threads` 现在对 Iceberg 表生效。 [#87407](https://github.com/ClickHouse/ClickHouse/pull/87407) ([alesapin](https://github.com/alesapin)).
* 为 `PrometheusMetricsWriter` 添加直方图和多维指标，使 `PrometheusRequestHandler` 处理器具备全部必要指标，可在云端进行可靠、低开销的指标采集。 [#87521](https://github.com/ClickHouse/ClickHouse/pull/87521) ([Miсhael Stetsyuk](https://github.com/mstetsyuk)).
* 函数 `hasToken` 现在对空 token 返回零个匹配，此前会抛出异常。 [#87564](https://github.com/ClickHouse/ClickHouse/pull/87564) ([Jimmy Aguilar Mena](https://github.com/Ergus)).
* 文本索引支持 `Array` 和 `Map`（`mapKeys`、`mapValues`）的值，支持的函数为 `mapContainsKey` 和 `has`。 [#87602](https://github.com/ClickHouse/ClickHouse/pull/87602) ([Elmi Ahmadov](https://github.com/ahmadov)).
* 新增指标 `ZooKeeperSessionExpired`，表示过期的全局 ZooKeeper 会话数量。 [#87613](https://github.com/ClickHouse/ClickHouse/pull/87613) ([Miсhael Stetsyuk](https://github.com/mstetsyuk)).
* 向备份目标执行服务器端原生复制时，使用带备份专用设置（如 backup\_slow\_all\_threads\_after\_retryable\_s3\_error）的 S3 存储客户端。将 s3\_slow\_all\_threads\_after\_retryable\_error 标记为废弃。 [#87660](https://github.com/ClickHouse/ClickHouse/pull/87660) ([Julia Kartseva](https://github.com/jkartseva)).
* 修复实验性 `make_distributed_plan` 在查询计划序列化期间错误处理 `max_joined_block_size_rows` 和 `max_joined_block_size_bytes` 设置。 [#87675](https://github.com/ClickHouse/ClickHouse/pull/87675) ([Vladimir Cherkasov](https://github.com/vdimir)).
* 设置 `enable_http_compression` 现在默认启用。客户端接受 HTTP 压缩时，服务器就会使用它。但该变化也有缺点：客户端可能请求 `bzip2` 等不合理的高开销压缩方法，增加服务器资源消耗（仅在传输大结果时明显）；也可能请求 `gzip`，虽然不算差，但不如 `zstd` 理想。关闭 [#71591](https://github.com/ClickHouse/ClickHouse/issues/71591)。 [#87703](https://github.com/ClickHouse/ClickHouse/pull/87703) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 在 `system.server_settings` 中新增 `keeper_hosts` 条目，公开 ClickHouse 可连接的 \[Zoo]Keeper 主机列表。 [#87718](https://github.com/ClickHouse/ClickHouse/pull/87718) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* 为系统仪表盘添加 `from` 和 `to` 值，便于历史问题调查。 [#87823](https://github.com/ClickHouse/ClickHouse/pull/87823) ([Mikhail f. Shiryaev](https://github.com/Felixoid)).
* 为 Iceberg SELECT 增加更多性能跟踪信息。 [#87903](https://github.com/ClickHouse/ClickHouse/pull/87903) ([Daniil Ivanik](https://github.com/divanik)).
* 文件系统缓存改进：在并发预留缓存空间的线程间复用缓存优先级迭代器。 [#87914](https://github.com/ClickHouse/ClickHouse/pull/87914) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 支持限制 `Keeper` 请求大小（`max_request_size` 设置，等同于 `ZooKeeper` 的 `jute.maxbuffer`；为向后兼容默认关闭，将在后续版本中设置）。 [#87952](https://github.com/ClickHouse/ClickHouse/pull/87952) ([Azat Khuzhin](https://github.com/azat)).
* `clickhouse-benchmark` 的错误消息默认不再包含堆栈跟踪。 [#87954](https://github.com/ClickHouse/ClickHouse/pull/87954) ([Ahmed Gouda](https://github.com/0xgouda)).
* 标记已在缓存中时，不使用线程池异步加载标记（`load_marks_asynchronously=1`），因为线程池可能承压，即使标记已缓存，查询也会为此付出代价。 [#87967](https://github.com/ClickHouse/ClickHouse/pull/87967) ([Azat Khuzhin](https://github.com/azat)).
* Ytsaurus：允许使用列的子集创建表、表函数和字典。 [#87982](https://github.com/ClickHouse/ClickHouse/pull/87982) ([MikhailBurdukov](https://github.com/MikhailBurdukov)).
* `system.zookeeper_connection_log` 现在默认启用，可用于获取 Keeper 会话信息。 [#88011](https://github.com/ClickHouse/ClickHouse/pull/88011) ([János Benjamin Antal](https://github.com/antaljanosbenjamin)).
* 传入重复外部表时，使 TCP 和 HTTP 行为一致。HTTP 允许多次传入同一临时表。 [#88032](https://github.com/ClickHouse/ClickHouse/pull/88032) ([Sema Checherinda](https://github.com/CheSema)).
* 移除读取 Arrow/ORC/Parquet 的自定义 MemoryPools。以下变更之后，该组件似乎已无必要： [#84082](https://github.com/ClickHouse/ClickHouse/pull/84082) 因为现在无论如何都会跟踪全部内存分配。 [#88035](https://github.com/ClickHouse/ClickHouse/pull/88035) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* 允许不带参数创建 `Replicated` 数据库。 [#88044](https://github.com/ClickHouse/ClickHouse/pull/88044) ([Pervakov Grigorii](https://github.com/GrigoryPervakov)).
* `clickhouse-keeper-client`：支持连接 clickhouse-keeper 的 TLS 端口，标志名称保持与 clickhouse-client 相同。 [#88065](https://github.com/ClickHouse/ClickHouse/pull/88065) ([Pradeep Chhetri](https://github.com/chhetripradeep)).
* 新增性能分析事件，跟踪后台合并因超过内存限制而被拒绝的次数。 [#88084](https://github.com/ClickHouse/ClickHouse/pull/88084) ([Grant Holly](https://github.com/grantholly-clickhouse)).
* 在验证 CREATE/ALTER TABLE 列默认表达式时启用分析器。 [#88087](https://github.com/ClickHouse/ClickHouse/pull/88087) ([Max Justus Spransy](https://github.com/maxjustus)).
* 内部查询规划改进：为 `CROSS JOIN` 使用 JoinStepLogical。 [#88151](https://github.com/ClickHouse/ClickHouse/pull/88151) ([Vladimir Cherkasov](https://github.com/vdimir)).
* 为函数 `hasAnyTokens` 和 `hasAllTokens` 分别新增别名 `hasAnyToken` 和 `hasAllToken`。 [#88162](https://github.com/ClickHouse/ClickHouse/pull/88162) ([George Larionov](https://github.com/george-larionov)).
* 默认启用全局采样分析器（包括与查询无关的服务器线程），每经过 10 秒 CPU 时间和实际时间，采集所有线程的堆栈跟踪。 [#88209](https://github.com/ClickHouse/ClickHouse/pull/88209) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 更新 Azure SDK，包含复制和创建容器功能中出现的 'Content-Length' 问题修复。 [#88278](https://github.com/ClickHouse/ClickHouse/pull/88278) ([Smita Kulkarni](https://github.com/SmitaRKulkarni)).
* 使函数 `lag` 不区分大小写，以兼容 MySQL。 [#88322](https://github.com/ClickHouse/ClickHouse/pull/88322) ([Lonny Kapelushnik](https://github.com/lonnylot)).
* 允许从 `clickhouse-server` 目录启动 `clickhouse-local`。此前会出现 `Cannot parse UUID: .` 错误，现在可启动 clickhouse-local，在不启动服务器的情况下操作服务器数据库。 [#88383](https://github.com/ClickHouse/ClickHouse/pull/88383) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 新增配置 `keeper_server.coordination_settings.check_node_acl_on_remove`。启用时，每次删除节点前同时验证节点自身及父节点的 ACL；否则仅验证父节点 ACL。 [#88513](https://github.com/ClickHouse/ClickHouse/pull/88513) ([Antonio Andelic](https://github.com/antonio2368)).
* 使用 `Vertical` 格式时，现在会美化输出 `JSON` 列。关闭 [#81794](https://github.com/ClickHouse/ClickHouse/issues/81794)。 [#88524](https://github.com/ClickHouse/ClickHouse/pull/88524) ([Frank Rosner](https://github.com/FRosner)).
* 将 `clickhouse-client` 文件（如查询历史）存于 [XDG Base Directories](https://specifications.freedesktop.org/basedir-spec/latest/index.html) 规范描述的位置，而非用户主目录根部。如果 `~/.clickhouse-client-history` 已存在，仍继续使用。 [#88538](https://github.com/ClickHouse/ClickHouse/pull/88538) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 修复 `GLOBAL IN` 导致的内存泄漏（[https://github.com/ClickHouse/ClickHouse/issues/88615](https://github.com/ClickHouse/ClickHouse/issues/88615)）。 [#88617](https://github.com/ClickHouse/ClickHouse/pull/88617) ([pranavmehta94](https://github.com/pranavmehta94)).
* 为 hasAny/hasAllTokens 添加接受字符串输入的重载。 [#88679](https://github.com/ClickHouse/ClickHouse/pull/88679) ([George Larionov](https://github.com/george-larionov)).
* 为 `clickhouse-keeper` 安装后脚本新增步骤，启用开机启动。 [#88746](https://github.com/ClickHouse/ClickHouse/pull/88746) ([YenchangChan](https://github.com/YenchangChan)).
* Web UI 仅在粘贴时检查凭据，而非每次按键都检查，避免配置错误的 LDAP 服务器引发问题。关闭 [#85777](https://github.com/ClickHouse/ClickHouse/issues/85777)。 [#88769](https://github.com/ClickHouse/ClickHouse/pull/88769) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 限制违反约束时的异常消息长度。此前插入很长的字符串时，可能生成非常长的异常消息，最终写入 query\_log。关闭 [#87032](https://github.com/ClickHouse/ClickHouse/issues/87032)。 [#88801](https://github.com/ClickHouse/ClickHouse/pull/88801) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复创建表时从 ArrowFlight 服务器请求数据集结构。 [#87542](https://github.com/ClickHouse/ClickHouse/pull/87542) ([Vitaly Baranov](https://github.com/vitlibar)).

#### 缺陷修复（正式稳定版本中用户可见的异常行为）

* 修复 GeoParquet 导致客户端协议错误。 [#84020](https://github.com/ClickHouse/ClickHouse/pull/84020) ([Michael Kolupaev](https://github.com/al13n321)).
* 修复在发起节点的子查询中解析 shardNum() 等依赖主机的函数。 [#84409](https://github.com/ClickHouse/ClickHouse/pull/84409) ([Eduard Karacharov](https://github.com/korowa)).
* 修复多个日期时间函数对 Unix 纪元之前、带小数秒的日期处理错误，包括 `parseDateTime64BestEffort`、`change{Year,Month,Day}` 和 `makeDateTime64`。此前亚秒部分被从秒数中减去，而非加上。例如，`parseDateTime64BestEffort('1969-01-01 00:00:00.468')` 返回 `1968-12-31 23:59:59.532`，而非 `1969-01-01 00:00:00.468`。 [#85396](https://github.com/ClickHouse/ClickHouse/pull/85396) ([xiaohuanlin](https://github.com/xiaohuanlin)).
* 修复同一 ALTER 语句内列状态改变时 ALTER COLUMN IF EXISTS 命令失败。DROP COLUMN IF EXISTS、MODIFY COLUMN IF EXISTS、COMMENT COLUMN IF EXISTS、RENAME COLUMN IF EXISTS 等命令现在正确处理列已被同一语句前面的命令删除的情况。 [#86046](https://github.com/ClickHouse/ClickHouse/pull/86046) ([xiaohuanlin](https://github.com/xiaohuanlin)).
* 修复对超出支持范围的日期推断 Date/DateTime/DateTime64。 [#86184](https://github.com/ClickHouse/ClickHouse/pull/86184) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复用户向 `AggregateFunction(quantileDD)` 列提交的某些有效数据，使合并无限递归而崩溃的问题。 [#86560](https://github.com/ClickHouse/ClickHouse/pull/86560) ([Raphaël Thériault](https://github.com/raphael-theriault-swi)).
* 通过 `cluster` 表函数创建的表支持 JSON/Dynamic 类型。 [#86821](https://github.com/ClickHouse/ClickHouse/pull/86821) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复 CTE 中计算的函数结果在查询中不确定的问题。 [#86967](https://github.com/ClickHouse/ClickHouse/pull/86967) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* 修复 EXPLAIN 中对主键列使用 pointInPolygon 时的 LOGICAL\_ERROR。 [#86971](https://github.com/ClickHouse/ClickHouse/pull/86971) ([Michael Kolupaev](https://github.com/al13n321)).
* 修复名称中含百分号编码序列的数据湖表。关闭 [#86626](https://github.com/ClickHouse/ClickHouse/issues/86626)。 [#87020](https://github.com/ClickHouse/ClickHouse/pull/87020) ([Anton Ivashkin](https://github.com/ianton-ru)).
* 修复启用 `optimize_functions_to_subcolumns` 时，`OUTER JOIN` 中可空列的 `IS NULL` 行为错误，关闭 [#78625](https://github.com/ClickHouse/ClickHouse/issues/78625)。 [#87058](https://github.com/ClickHouse/ClickHouse/pull/87058) ([Vladimir Cherkasov](https://github.com/vdimir)).
* 修复 `max_temporary_data_on_disk_size` 限制跟踪中临时数据释放的错误记账，关闭 [#87118](https://github.com/ClickHouse/ClickHouse/issues/87118)。 [#87140](https://github.com/ClickHouse/ClickHouse/pull/87140) ([JIaQi](https://github.com/JiaQiTang98)).
* 函数 checkHeaders 现在正确验证提供的请求头，并拒绝禁止使用的请求头。原作者：Michael Anastasakis（@michael-anastasakis）。 [#87172](https://github.com/ClickHouse/ClickHouse/pull/87172) ([Raúl Marín](https://github.com/Algunenano)).
* 使 `toDate` 和 `toDate32` 对所有数值类型具有相同行为。修复从 int16 转换时 Date32 的下溢检查。 [#87176](https://github.com/ClickHouse/ClickHouse/pull/87176) ([Pervakov Grigorii](https://github.com/GrigoryPervakov)).
* 修复包含多个 JOIN 的并行副本查询中的逻辑错误，尤其是 LEFT/INNER JOIN 之后出现 RIGHT JOIN 的情况。 [#87178](https://github.com/ClickHouse/ClickHouse/pull/87178) ([Igor Nikonov](https://github.com/devcrafter)).
* 结构推断缓存遵循设置 `input_format_try_infer_variants`。 [#87180](https://github.com/ClickHouse/ClickHouse/pull/87180) ([Pavel Kruglov](https://github.com/Avogar)).
* 使 pathStartsWith 仅匹配位于前缀路径下的路径。 [#87181](https://github.com/ClickHouse/ClickHouse/pull/87181) ([Raúl Marín](https://github.com/Algunenano)).
* 修复 `_row_number` 虚拟列及 Iceberg 位置删除中的逻辑错误。 [#87220](https://github.com/ClickHouse/ClickHouse/pull/87220) ([Michael Kolupaev](https://github.com/al13n321)).
* 修复 `JOIN` 中混合常量和非常量数据块导致的“Too large size passed to allocator” `LOGICAL_ERROR`。 [#87231](https://github.com/ClickHouse/ClickHouse/pull/87231) ([Azat Khuzhin](https://github.com/azat)).
* 修复轻量更新中包含读取其他 `MergeTree` 表的子查询。 [#87285](https://github.com/ClickHouse/ClickHouse/pull/87285) ([Anton Popov](https://github.com/CurtizJ)).
* 修复存在行策略时移入 PREWHERE 优化不生效的问题。延续 [#85118](https://github.com/ClickHouse/ClickHouse/issues/85118)。关闭 [#69777](https://github.com/ClickHouse/ClickHouse/issues/69777)。关闭 [#83748](https://github.com/ClickHouse/ClickHouse/issues/83748)。 [#87303](https://github.com/ClickHouse/ClickHouse/pull/87303) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复向数据片段中缺失但具有默认表达式的列应用补丁。 [#87347](https://github.com/ClickHouse/ClickHouse/pull/87347) ([Anton Popov](https://github.com/CurtizJ)).
* 修复 MergeTree 表使用重复分区字段名时的段错误。 [#87365](https://github.com/ClickHouse/ClickHouse/pull/87365) ([xiaohuanlin](https://github.com/xiaohuanlin)).
* 修复 EmbeddedRocksDB 升级。 [#87392](https://github.com/ClickHouse/ClickHouse/pull/87392) ([Raúl Marín](https://github.com/Algunenano)).
* 修复从对象存储上的文本索引直接读取。 [#87399](https://github.com/ClickHouse/ClickHouse/pull/87399) ([Anton Popov](https://github.com/CurtizJ)).
* 禁止为不存在的引擎创建权限。 [#87419](https://github.com/ClickHouse/ClickHouse/pull/87419) ([Jitendra](https://github.com/jitendra1411)).
* `s3_plain_rewritable` 仅忽略未找到错误，避免忽略其他错误导致各种问题。 [#87426](https://github.com/ClickHouse/ClickHouse/pull/87426) ([Azat Khuzhin](https://github.com/azat)).
* 修复使用 Ytsaurus 数据源和 \*range\_hashed 布局的字典。 [#87490](https://github.com/ClickHouse/ClickHouse/pull/87490) ([MikhailBurdukov](https://github.com/MikhailBurdukov)).
* 修复创建空元组数组。 [#87520](https://github.com/ClickHouse/ClickHouse/pull/87520) ([Pavel Kruglov](https://github.com/Avogar)).
* 创建临时表时检查非法列。 [#87524](https://github.com/ClickHouse/ClickHouse/pull/87524) ([Pavel Kruglov](https://github.com/Avogar)).
* 不将 Hive 分区列放入格式头。修复 [#87515](https://github.com/ClickHouse/ClickHouse/issues/87515)。 [#87528](https://github.com/ClickHouse/ClickHouse/pull/87528) ([Arthur Passos](https://github.com/arthurpassos)).
* 修复 DeltaLake 使用文本格式时准备从格式读取。 [#87529](https://github.com/ClickHouse/ClickHouse/pull/87529) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复 Buffer 表 SELECT 和 INSERT 的访问权限验证。 [#87545](https://github.com/ClickHouse/ClickHouse/pull/87545) ([pufit](https://github.com/pufit)).
* 禁止为 S3 表创建数据跳过索引。 [#87554](https://github.com/ClickHouse/ClickHouse/pull/87554) ([Bharat Nallan](https://github.com/bharatnc)).
* 避免异步日志的已跟踪内存泄漏（偏差可能很大，10 小时约 \~100GiB），以及 text\_log 的类似泄漏（可能出现几乎相同的偏差）。 [#87584](https://github.com/ClickHouse/ClickHouse/pull/87584) ([Azat Khuzhin](https://github.com/azat)).
* 修复以下缺陷：视图或物化视图被异步删除，且后台清理完成前服务器重启时，视图 SELECT 设置可能覆盖全局服务器设置。 [#87603](https://github.com/ClickHouse/ClickHouse/pull/87603) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 计算内存过载警告时，尽可能排除用户态页缓存字节数。 [#87610](https://github.com/ClickHouse/ClickHouse/pull/87610) ([Bharat Nallan](https://github.com/bharatnc)).
* 修复 CSV 反序列化期间错误的类型顺序导致 `LOGICAL_ERROR`。 [#87622](https://github.com/ClickHouse/ClickHouse/pull/87622) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 修复可执行字典对 `command_read_timeout` 的错误处理。 [#87627](https://github.com/ClickHouse/ClickHouse/pull/87627) ([Azat Khuzhin](https://github.com/azat)).
* 修复新分析器在 WHERE 子句中过滤被替换列时，SELECT \* REPLACE 的行为错误。 [#87630](https://github.com/ClickHouse/ClickHouse/pull/87630) ([xiaohuanlin](https://github.com/xiaohuanlin)).
* 修复对 `Distributed` 使用 `Merge` 时的两级聚合。 [#87687](https://github.com/ClickHouse/ClickHouse/pull/87687) ([c-end](https://github.com/c-end)).
* 修复 HashJoin 算法未使用右侧行列表时输出数据块的生成。修复 [#87401](https://github.com/ClickHouse/ClickHouse/issues/87401)。 [#87699](https://github.com/ClickHouse/ClickHouse/pull/87699) ([Dmitry Novik](https://github.com/novikd)).
* 索引分析后没有数据可读时，可能错误选择并行副本读取模式。关闭 [#87653](https://github.com/ClickHouse/ClickHouse/issues/87653)。 [#87700](https://github.com/ClickHouse/ClickHouse/pull/87700) ([zoomxi](https://github.com/zoomxi)).
* 修复 Glue 中 `timestamp` / `timestamptz` 列的处理。 [#87733](https://github.com/ClickHouse/ClickHouse/pull/87733) ([Andrey Zvonov](https://github.com/zvonand)).
* 关闭 [#86587](https://github.com/ClickHouse/ClickHouse/issues/86587)。 [#87761](https://github.com/ClickHouse/ClickHouse/pull/87761) ([scanhex12](https://github.com/scanhex12)).
* 修复 PostgreSQL 接口写入布尔值。 [#87762](https://github.com/ClickHouse/ClickHouse/pull/87762) ([Artem Yurov](https://github.com/ArtemYurov)).
* 修复带 CTE 的 INSERT SELECT 查询中的未知表错误，[#85368](https://github.com/ClickHouse/ClickHouse/issues/85368)。 [#87789](https://github.com/ClickHouse/ClickHouse/pull/87789) ([Guang Zhao](https://github.com/zheguang)).
* 修复从不能包含在 Nullable 中的 Variant 类型读取空值映射子列。 [#87798](https://github.com/ClickHouse/ClickHouse/pull/87798) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复在从节点上未能完全删除集群中的数据库时的错误处理。 [#87802](https://github.com/ClickHouse/ClickHouse/pull/87802) ([Tuan Pham Anh](https://github.com/tuanpach)).
* 修复若干数据跳过索引缺陷。 [#87817](https://github.com/ClickHouse/ClickHouse/pull/87817) ([Raúl Marín](https://github.com/Algunenano)).
* AzureBlobStorage 现在先尝试原生复制，出现 'Unauthroized' 错误后回退至读写（源和目标位于不同存储账户时会出现 'Unauthorized' 错误）。同时修复端点在配置中定义时“use\_native\_copy”的应用。 [#87826](https://github.com/ClickHouse/ClickHouse/pull/87826) ([Smita Kulkarni](https://github.com/SmitaRKulkarni)).
* 修复 ArrowStream 文件包含非唯一字典时 ClickHouse 崩溃。 [#87863](https://github.com/ClickHouse/ClickHouse/pull/87863) ([Ilya Golshtein](https://github.com/ilejn)).
* 修复使用 approx\_top\_k 和 finalizeAggregation 时的致命错误。 [#87892](https://github.com/ClickHouse/ClickHouse/pull/87892) ([Jitendra](https://github.com/jitendra1411)).
* 修复最后一个数据块为空时带投影的合并。 [#87928](https://github.com/ClickHouse/ClickHouse/pull/87928) ([Raúl Marín](https://github.com/Algunenano)).
* 如果参数类型不允许用于 GROUP BY，则不从 GROUP BY 中移除单射函数。 [#87958](https://github.com/ClickHouse/ClickHouse/pull/87958) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复查询使用 `session_timezone` 设置时，对基于日期时间的键错误排除数据粒度/分区。 [#87987](https://github.com/ClickHouse/ClickHouse/pull/87987) ([Eduard Karacharov](https://github.com/korowa)).
* PostgreSQL 接口在查询后返回受影响的行数。 [#87990](https://github.com/ClickHouse/ClickHouse/pull/87990) ([Artem Yurov](https://github.com/ArtemYurov)).
* 限制 PASTE JOIN 的过滤下推，因为它可能导致错误结果。 [#88078](https://github.com/ClickHouse/ClickHouse/pull/88078) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 在执行 [https://github.com/ClickHouse/ClickHouse/pull/84503](https://github.com/ClickHouse/ClickHouse/pull/84503) 引入的授权检查前，先规范化 URI。 [#88089](https://github.com/ClickHouse/ClickHouse/pull/88089) ([pufit](https://github.com/pufit)).
* 修复新分析器中 ARRAY JOIN COLUMNS() 未匹配任何列时的逻辑错误。 [#88091](https://github.com/ClickHouse/ClickHouse/pull/88091) ([xiaohuanlin](https://github.com/xiaohuanlin)).
* 修复“High ClickHouse memory usage”警告，排除页缓存。 [#88092](https://github.com/ClickHouse/ClickHouse/pull/88092) ([Azat Khuzhin](https://github.com/azat)).
* 修复设置了列 `TTL` 的 `MergeTree` 表可能出现的数据损坏。 [#88095](https://github.com/ClickHouse/ClickHouse/pull/88095) ([Anton Popov](https://github.com/CurtizJ)).
* 修复已附加外部数据库（`PostgreSQL`/`SQLite`/……）中存在无效表时，读取 `system.tables` 可能出现的未捕获异常。 [#88105](https://github.com/ClickHouse/ClickHouse/pull/88105) ([Azat Khuzhin](https://github.com/azat)).
* 修复函数 `mortonEncode` 和 `hilbertEncode` 使用空元组参数时的崩溃。 [#88110](https://github.com/ClickHouse/ClickHouse/pull/88110) ([xiaohuanlin](https://github.com/xiaohuanlin)).
* 集群中存在非活跃副本时，`ON CLUSTER` 查询现在耗时更短。 [#88153](https://github.com/ClickHouse/ClickHouse/pull/88153) ([alesapin](https://github.com/alesapin)).
* DDL 工作线程现在会从副本集合中清理过期主机，减少 ZooKeeper 存储的元数据量。 [#88154](https://github.com/ClickHouse/ClickHouse/pull/88154) ([alesapin](https://github.com/alesapin)).
* 修复无 cgroup 环境下运行 ClickHouse 的问题，此前异步指标意外地要求必须存在 cgroup。 [#88164](https://github.com/ClickHouse/ClickHouse/pull/88164) ([Azat Khuzhin](https://github.com/azat)).
* 出错时正确撤销移动目录操作。需重写执行期间更改的所有 `prefix.path` 对象，而不只是根对象。 [#88198](https://github.com/ClickHouse/ClickHouse/pull/88198) ([Mikhail Artemenko](https://github.com/Michicosun)).
* 修复 `ColumnLowCardinality` 中 `is_shared` 标志的传播。哈希值已预先计算并缓存在 `ReverseIndex` 后，如果向列中插入新值，可能导致分组结果错误。 [#88213](https://github.com/ClickHouse/ClickHouse/pull/88213) ([Nikita Taranov](https://github.com/nickitat)).
* 修复工作负载设置 `max_cpu_share`，现在可在未设置 `max_cpus` 时单独使用。 [#88217](https://github.com/ClickHouse/ClickHouse/pull/88217) ([Neerav](https://github.com/neeravsalaria)).
* 修复含子查询的极重变更操作卡在准备阶段的问题。现在可通过 `SYSTEM STOP MERGES` 停止这些操作。 [#88241](https://github.com/ClickHouse/ClickHouse/pull/88241) ([alesapin](https://github.com/alesapin)).
* 相关子查询现在可与对象存储配合使用。 [#88290](https://github.com/ClickHouse/ClickHouse/pull/88290) ([alesapin](https://github.com/alesapin)).
* 访问 `system.projections` 和 `system.data_skipping_indices` 时，不尝试初始化 DataLake 数据库。 [#88330](https://github.com/ClickHouse/ClickHouse/pull/88330) ([Azat Khuzhin](https://github.com/azat)).
* 现在仅在显式启用 `show_data_lake_catalogs_in_system_tables` 时，才在系统观测表中显示数据湖目录。 [#88341](https://github.com/ClickHouse/ClickHouse/pull/88341) ([alesapin](https://github.com/alesapin)).
* 修复 DatabaseReplicated，使其遵循 `interserver_http_host` 配置。 [#88378](https://github.com/ClickHouse/ClickHouse/pull/88378) ([xiaohuanlin](https://github.com/xiaohuanlin)).
* 在定义投影的上下文中显式禁用位置参数，因为在这一内部查询阶段使用它们没有意义。修复 [#48604](https://github.com/ClickHouse/ClickHouse/issues/48604)。 [#88380](https://github.com/ClickHouse/ClickHouse/pull/88380) ([Amos Bird](https://github.com/amosbird)).
* 修复 `countMatches` 函数的二次复杂度。关闭 [#88400](https://github.com/ClickHouse/ClickHouse/issues/88400)。 [#88401](https://github.com/ClickHouse/ClickHouse/pull/88401) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 使 KeeperMap 表的 `ALTER COLUMN ... COMMENT` 命令参与复制，将其提交至 Replicated 数据库元数据并传播至全部副本。关闭 [#88077](https://github.com/ClickHouse/ClickHouse/issues/88077)。 [#88408](https://github.com/ClickHouse/ClickHouse/pull/88408) ([Eduard Karacharov](https://github.com/korowa)).
* 修复 Replicated 数据库中物化视图被误判为循环依赖、阻止新增副本的情况。 [#88423](https://github.com/ClickHouse/ClickHouse/pull/88423) ([Nikolay Degterinsky](https://github.com/evillique)).
* 修复 `group_by_overflow_mode` 设为 `any` 时稀疏列的聚合。 [#88440](https://github.com/ClickHouse/ClickHouse/pull/88440) ([Eduard Karacharov](https://github.com/korowa)).
* 修复 `query_plan_use_logical_join_step=0` 且含多个 FULL JOIN USING 子句时的“column not found”错误。关闭 [#88103](https://github.com/ClickHouse/ClickHouse/issues/88103)。 [#88473](https://github.com/ClickHouse/ClickHouse/pull/88473) ([Vladimir Cherkasov](https://github.com/vdimir)).
* 节点数超过 10 的大集群很可能恢复失败，错误为 `[941] 67c45db4-4df4-4879-87c5-25b8d1e0d414 <Trace>: RestoreCoordinationOnCluster The version of node /clickhouse/backups/restore-7c551a77-bd76-404c-bad0-3213618ac58e/stage/num_hosts changed (attempt #9), will try again`。`num_hosts` 节点被多个主机同时覆盖。本次修复使控制重试次数的设置可动态调整。关闭 [#87721](https://github.com/ClickHouse/ClickHouse/issues/87721)。 [#88484](https://github.com/ClickHouse/ClickHouse/pull/88484) ([Mikhail f. Shiryaev](https://github.com/Felixoid)).
* 此 PR 仅用于兼容 23.8 及更早版本。兼容性问题由 [https://github.com/ClickHouse/ClickHouse/pull/54240](https://github.com/ClickHouse/ClickHouse/pull/54240) 引入；该 SQL 在 `enable_analyzer=0` 时会失败，而在 23.8 之前可以正常执行。 [#88491](https://github.com/ClickHouse/ClickHouse/pull/88491) ([JIaQi](https://github.com/JiaQiTang98)).
* 修复 `accurateCast` 将较大值转换为 DateTime 时，错误消息中触发 UBSAN 的整数溢出。 [#88520](https://github.com/ClickHouse/ClickHouse/pull/88520) ([xiaohuanlin](https://github.com/xiaohuanlin)).
* 修复 CoalescingMergeTree 对 Tuple 类型的处理。关闭 [#88469](https://github.com/ClickHouse/ClickHouse/issues/88469)。 [#88526](https://github.com/ClickHouse/ClickHouse/pull/88526) ([scanhex12](https://github.com/scanhex12)).
* 禁止在 `iceberg_format_version=1` 时删除。关闭 [#88444](https://github.com/ClickHouse/ClickHouse/issues/88444)。 [#88532](https://github.com/ClickHouse/ClickHouse/pull/88532) ([scanhex12](https://github.com/scanhex12)).
* 修复 `plain-rewritable` 磁盘对任意深度文件夹的移动操作。 [#88586](https://github.com/ClickHouse/ClickHouse/pull/88586) ([Mikhail Artemenko](https://github.com/Michicosun)).
* 修复 SQL SECURITY DEFINER 与 \*cluster 函数配合使用。 [#88588](https://github.com/ClickHouse/ClickHouse/pull/88588) ([Julian Maicher](https://github.com/jmaicher)).
* 修复底层常量 PREWHERE 列被并发修改时可能发生的崩溃。 [#88605](https://github.com/ClickHouse/ClickHouse/pull/88605) ([Azat Khuzhin](https://github.com/azat)).
* 修复从文本索引读取并启用查询条件缓存的情况（同时启用设置 `use_skip_indexes_on_data_read` 和 `use_query_condition_cache`）。 [#88660](https://github.com/ClickHouse/ClickHouse/pull/88660) ([Anton Popov](https://github.com/CurtizJ)).
* 修复从 `Poco::Net::HTTPChunkedStreamBuf::readFromDevice` 抛出的 `Poco::TimeoutException` 导致 SIGABRT 崩溃。 [#88668](https://github.com/ClickHouse/ClickHouse/pull/88668) ([Miсhael Stetsyuk](https://github.com/mstetsyuk)).
* 已回移至 [#88910](https://github.com/ClickHouse/ClickHouse/issues/88910)：修复 Replicated 数据库副本恢复后长时间卡住、持续打印 `Failed to marked query-0004647339 as finished (finished=No node, synced=No node)` 等消息的问题。 [#88671](https://github.com/ClickHouse/ClickHouse/pull/88671) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 修复配置重载后 ClickHouse 首次连接时，向 `system.zookeeper_connection_log` 追加记录。 [#88728](https://github.com/ClickHouse/ClickHouse/pull/88728) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复将 DateTime64 转为 Date 且设置 `date_time_overflow_behavior = 'saturate'` 时，在使用时区的情况下对越界值产生错误结果。 [#88737](https://github.com/ClickHouse/ClickHouse/pull/88737) ([Manuel](https://github.com/raimannma)).
* 再次尝试修复启用缓存的 S3 表引擎中“having zero bytes error”问题。 [#88740](https://github.com/ClickHouse/ClickHouse/pull/88740) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复 `loop` 表函数 SELECT 的访问权限验证。 [#88802](https://github.com/ClickHouse/ClickHouse/pull/88802) ([pufit](https://github.com/pufit)).
* 异步日志失败时捕获异常，防止程序中止。 [#88814](https://github.com/ClickHouse/ClickHouse/pull/88814) ([Raúl Marín](https://github.com/Algunenano)).
* 已回移至 [#89060](https://github.com/ClickHouse/ClickHouse/issues/89060)：修复 `top_k` 以单个参数调用时遵循阈值参数。关闭 [#88757](https://github.com/ClickHouse/ClickHouse/issues/88757)。 [#88867](https://github.com/ClickHouse/ClickHouse/pull/88867) ([Manuel](https://github.com/raimannma)).
* 已回移至 [#88944](https://github.com/ClickHouse/ClickHouse/issues/88944)：修复函数 `reverseUTF8` 的缺陷。此前错误地反转了长度为 4 的 UTF-8 码点内部字节。关闭 [#88913](https://github.com/ClickHouse/ClickHouse/issues/88913)。 [#88914](https://github.com/ClickHouse/ClickHouse/pull/88914) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 已回移至 [#88980](https://github.com/ClickHouse/ClickHouse/issues/88980)：使用 SQL SECURITY DEFINER 创建视图时，不检查 `SET DEFINER <current_user>:definer` 权限。 [#88968](https://github.com/ClickHouse/ClickHouse/pull/88968) ([pufit](https://github.com/pufit)).
* 已回移至 [#89058](https://github.com/ClickHouse/ClickHouse/issues/89058)：修复 `L2DistanceTransposed(vec1, vec2, p)` 的 `LOGICAL_ERROR`；部分读取 `QBit` 的优化在 `p` 为 `Nullable` 时，错误地从返回类型移除了 `Nullable`。 [#88974](https://github.com/ClickHouse/ClickHouse/pull/88974) ([Raufs Dunamalijevs](https://github.com/rienath)).
* 已回移至 [#89167](https://github.com/ClickHouse/ClickHouse/issues/89167)：修复未知目录类型导致的崩溃。解决 [#88819](https://github.com/ClickHouse/ClickHouse/issues/88819)。 [#88987](https://github.com/ClickHouse/ClickHouse/pull/88987) ([scanhex12](https://github.com/scanhex12)).
* 已回移至 [#89028](https://github.com/ClickHouse/ClickHouse/issues/89028)：修复数据跳过索引分析的性能下降。 [#89004](https://github.com/ClickHouse/ClickHouse/pull/89004) ([Anton Popov](https://github.com/CurtizJ)).

#### 构建/测试/打包改进

* 使用 `postgres` 库 18.0。 [#87647](https://github.com/ClickHouse/ClickHouse/pull/87647) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 为 FreeBSD 启用 ICU。 [#87891](https://github.com/ClickHouse/ClickHouse/pull/87891) ([Raúl Marín](https://github.com/Algunenano)).
* 动态分派目标为 SSE 4.2 时，使用 SSE 4.2 而非 SSE 4。 [#88029](https://github.com/ClickHouse/ClickHouse/pull/88029) ([Raúl Marín](https://github.com/Algunenano)).
* `Speculative Store Bypass Safe` 不可用时，不要求 `NO_ARMV81_OR_HIGHER` 标志。 [#88051](https://github.com/ClickHouse/ClickHouse/pull/88051) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 以 `ENABLE_LIBFIU=OFF` 构建 ClickHouse 时，故障点相关函数成为空操作，不再影响性能。此时 `SYSTEM ENABLE/DISABLE FAILPOINT` 查询返回 `SUPPORT_IS_DISABLED` 错误。 [#88184](https://github.com/ClickHouse/ClickHouse/pull/88184) ([c-end](https://github.com/c-end)).
