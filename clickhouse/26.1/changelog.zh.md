### <a id="261"></a> ClickHouse 26.1 版本，发布于 2026-01-29。[演示文稿](https://presentations.clickhouse.com/2026-release-26.1/)，[视频](https://www.youtube.com/watch?v=fWuYt4M0xE4)

#### 向后不兼容变更
* 修复格式化程序错误替换别名所导致的格式不一致问题。此项修复关闭 [#82833](https://github.com/ClickHouse/ClickHouse/issues/82833)、[#82832](https://github.com/ClickHouse/ClickHouse/issues/82832) 和 [#68296](https://github.com/ClickHouse/ClickHouse/issues/68296)。此变更可能向后不兼容：禁用分析器后，某些在 IN 中引用别名的 CREATE VIEW 查询将无法处理。为避免不兼容，请启用分析器（自 24.3 起默认启用）。[#82838](https://github.com/ClickHouse/ClickHouse/pull/82838)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 移除了编解码器 `DEFLATE_QPL` 和 `ZSTD_QAT`。建议用户在升级前，将已有的使用 `DEFLATE_QPL` 或 `ZSTD_QAT` 压缩的数据转换为其他编解码器。请注意，使用这些编解码器原本需要启用设置 `enable_deflate_qpl_codec` 和 `enable_zstd_qat_codec`。[#92150](https://github.com/ClickHouse/ClickHouse/pull/92150)（[Robert Schulze](https://github.com/rschu1ze)）。
* 通过在 `system.query_log.exception` 中捕获 stderr，改进 UDF 调试。此前，UDF 的 stderr 只会记录到文件中，不会暴露在查询日志里，因而无法进行调试。现在 stderr 默认会触发异常，并在抛出异常前完整累积（上限为 1MB），从而让完整的 Python 回溯和错误消息出现在 `system.query_log.exception` 中，以便有效排查问题。[#92209](https://github.com/ClickHouse/ClickHouse/pull/92209)（[Xu Jia](https://github.com/XuJia0210)）。
* `JOIN USING ()` 子句中的空列列表现在被视为语法错误。此前，它本应在查询执行期间产生 `INVALID_JOIN_ON_EXPRESSION`；但在某些情况下（例如与 `Join` 存储引擎联接）会导致 `LOGICAL_ERROR`。关闭 [#82502](https://github.com/ClickHouse/ClickHouse/issues/82502)。[#92371](https://github.com/ClickHouse/ClickHouse/pull/92371)（[Vladimir Cherkasov](https://github.com/vdimir)）。
* 默认对 JSON 类型中的 SKIP REGEXP 使用部分匹配。关闭 [#79250](https://github.com/ClickHouse/ClickHouse/issues/79250)。[#92847](https://github.com/ClickHouse/ClickHouse/pull/92847)（[Pavel Kruglov](https://github.com/Avogar)）。
* 回滚“允许向简单的 ALIAS 列执行 INSERT”（回滚 ClickHouse/ClickHouse[#84154](https://github.com/ClickHouse/ClickHouse/issues/84154)）。该功能不适用于自定义格式，且不受设置项控制。[#92849](https://github.com/ClickHouse/ClickHouse/pull/92849)（[Azat Khuzhin](https://github.com/azat)）。
* 新增一项设置：当数据湖目录无法访问对象存储时抛出错误。[#93606](https://github.com/ClickHouse/ClickHouse/pull/93606)（[Konstantin Vedernikov](https://github.com/scanhex12)）。
* 已移除 `Lazy` 数据库引擎，不再可用。关闭 [#91231](https://github.com/ClickHouse/ClickHouse/issues/91231)。[#93627](https://github.com/ClickHouse/ClickHouse/pull/93627)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 移除名为 `transposed_with_wide_view` 的 `metric_log` 模式——该模式因缺陷而无法使用。现在不能再用此模式定义 `system.metric_log`。这部分回滚了 [#78412](https://github.com/ClickHouse/ClickHouse/issues/78412)。[#93867](https://github.com/ClickHouse/ClickHouse/pull/93867)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 工作负载的 CPU 调度现在默认采用抢占式调度。请参阅服务器设置 `cpu_slot_preemption`。[#94060](https://github.com/ClickHouse/ClickHouse/pull/94060)（[Sergei Trifonov](https://github.com/serxa)）。
* 对索引文件名进行转义，以防止数据部件损坏。此变更后，ClickHouse 将无法加载由先前版本创建且名称中包含非 ASCII 字符的索引。可使用 MergeTree 设置 `escape_index_filenames` 处理此问题。[#94079](https://github.com/ClickHouse/ClickHouse/pull/94079)（[Raúl Marín](https://github.com/Algunenano)）。
* 格式设置 `exact_rows_before_limit`、`rows_before_aggregation`、`cross_to_inner_join_rewrite`、`regexp_dict_allow_hyperscan`、`regexp_dict_flag_case_insensitive`、`regexp_dict_flag_dotall` 和 `dictionary_use_async_executor` 现已改为常规（非格式）设置。这纯属内部变更，用户侧不会感知到任何副作用，除非（这种情况不太可能）在 Iceberg、DeltaLake、Kafka、S3、S3Queue、Azure、Hive、RabbitMQ、Set、FileLog 或 NATS 表引擎定义中指定了上述任一设置。在这些情况下，这些设置此前会被忽略，而现在此类定义将抛出错误。[#94106](https://github.com/ClickHouse/ClickHouse/pull/94106)（[Robert Schulze](https://github.com/rschu1ze)）。
* `joinGet/joinGetOrNull` 函数现在会强制检查底层 Join 表的 `SELECT` 权限。此变更后，执行 `joinGet('db.table', 'column', key)` 要求用户同时拥有 Join 表中定义的键列以及所检索属性列的 `SELECT` 权限。缺少这些权限的查询将以 `ACCESS_DENIED` 失败。迁移时，可使用 `GRANT SELECT ON db.join_table TO user` 授予整表访问权限，或使用 `GRANT SELECT(key_col, attr_col) ON db.join_table TO user` 授予列级访问权限。此变更会影响所有依赖 `joinGet`/`joinGetOrNull`、但此前未显式配置 `SELECT` 授权的用户和应用程序。[#94307](https://github.com/ClickHouse/ClickHouse/pull/94307)（[Vladimir Cherkasov](https://github.com/vdimir)）。
* 检查 `SHOW COLUMNS` 权限，以处理 `CREATE TABLE ... AS ...` 查询。此前检查的是 `SHOW TABLES`，但这类权限检查使用该授权并不正确。[#94556](https://github.com/ClickHouse/ClickHouse/pull/94556)（[pufit](https://github.com/pufit)）。
* 使 `Hash` 输出格式不再依赖块大小。[#94503](https://github.com/ClickHouse/ClickHouse/pull/94503)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。请注意，与先前版本相比，这会改变输出哈希值。

#### 新功能
* 为 ClickHouse Keeper 添加 HTTP API 和内嵌式 Web UI。[#78181](https://github.com/ClickHouse/ClickHouse/pull/78181)（[pufit](https://github.com/pufit) 和 [speeedmaster](https://github.com/speeedmaster)）。
* 异步插入去重现在可与依赖物化视图配合使用。当发生 block_id 冲突时，将过滤原始数据块，移除与该 block_id 关联的行，再使用所有相关物化视图的 SELECT 查询转换其余行，从而在不包含冲突行的情况下重建原始数据块。[#89140](https://github.com/ClickHouse/ClickHouse/pull/89140)（[Sema Checherinda](https://github.com/CheSema)）。现在允许在涉及物化视图时对异步插入使用去重。[#93957](https://github.com/ClickHouse/ClickHouse/pull/93957)（[Sema Checherinda](https://github.com/CheSema)）。
* 引入新的语法和框架，以简化并扩展投影索引功能。这是 https://github.com/ClickHouse/ClickHouse/pull/81021 的后续工作。[#91844](https://github.com/ClickHouse/ClickHouse/pull/91844)（[Amos Bird](https://github.com/amosbird)）。
* 为 `Array` 列添加文本索引支持。[#89895](https://github.com/ClickHouse/ClickHouse/pull/89895)（[Jimmy Aguilar Mena](https://github.com/Ergus)）。
* 默认启用 `use_variant_as_common_type`，从而允许在 `Array` 内部、`UNION` 查询以及 `if`/`multiIf`/`case` 的分支中使用不兼容的类型。[#90677](https://github.com/ClickHouse/ClickHouse/pull/90677)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 新增系统表 `zookeeper_info`。实现 [#88014](https://github.com/ClickHouse/ClickHouse/issues/88014)。[#90809](https://github.com/ClickHouse/ClickHouse/pull/90809)（[Smita Kulkarni](https://github.com/SmitaRKulkarni)）。
* 所有函数均支持 `Variant` 类型。[#90900](https://github.com/ClickHouse/ClickHouse/pull/90900)（[Bharat Nallan](https://github.com/bharatnc)）。
* 在 Prometheus 中新增 `ClickHouse_Info` 指标，并通过 `/metrics` 端点提供。该指标主要包含版本信息，以便构建图表来跟踪版本详细信息随时间的变化。[#91125](https://github.com/ClickHouse/ClickHouse/pull/91125)（[Christoph Wurm](https://github.com/cwurm)）。
* 为 Keeper 引入新的四字母命令 `rcfg`，用于更改集群配置。与标准的 `reconfigure` 请求相比，此命令提供了更广泛的配置变更能力。该命令接受 `json` 字符串作为参数。发送到 TCP 接口的完整字节序列应如下所示：`rcfg{json_string_length_big_endian}{json_string}`。命令示例如下：`{"preconditions": {"leaders": [1, 2], "members": [1, 2, 3, 4, 5]}, "actions": [{"transfer_leadership": [3]}, {"remove_members": [1, 2]}, {"set_priority": [{"id": 4, "priority": 100}, {"id": 5, "priority": 100}]}, {"transfer_leadership": [4, 5]}, {"set_priority": [{"id": 3, "priority": 0}]}]}`。[#91354](https://github.com/ClickHouse/ClickHouse/pull/91354)（[alesapin](https://github.com/alesapin)）。
* 新增函数 `reverseBySeparator`，用于反转字符串中由指定分隔符隔开的各子串顺序。关闭 [#91463](https://github.com/ClickHouse/ClickHouse/issues/91463)。[#91780](https://github.com/ClickHouse/ClickHouse/pull/91780)（[Xuewei Wang](https://github.com/Sallery-X)）。
* 新增设置 `max_insert_block_size_bytes`，可更精细地控制插入数据块的构成。[#92833](https://github.com/ClickHouse/ClickHouse/pull/92833)（[Kirill Kopnev](https://github.com/Fgrtue)）。
* 可以对 Replicated 数据库执行带 `ON CLUSTER` 子句的 DDL 查询，前提是启用了 `ignore_on_cluster_for_replicated_database` 设置。此时将忽略集群名称。[#92872](https://github.com/ClickHouse/ClickHouse/pull/92872)（[Kirill](https://github.com/kirillgarbar)）。
* 实现 `mergeTreeAnalyzeIndexes` 函数。[#92954](https://github.com/ClickHouse/ClickHouse/pull/92954)（[Azat Khuzhin](https://github.com/azat)）。
* 新增设置 `use_primary_key`。将其设为 `false` 可禁用基于主键的粒度块裁剪。[#93319](https://github.com/ClickHouse/ClickHouse/pull/93319)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 新增 `icebergLocalCluster` 表函数。[#93323](https://github.com/ClickHouse/ClickHouse/pull/93323)（[Anton Ivashkin](https://github.com/ianton-ru)）。
* 新增 `cosineDistanceTransposed` 函数，用于近似计算两点之间的[余弦距离](https://en.wikipedia.org/wiki/Cosine_similarity#Cosine_distance)。[#93621](https://github.com/ClickHouse/ClickHouse/pull/93621)（[Raufs Dunamalijevs](https://github.com/rienath)）。
* 在 system.parts 表中新增 `files` 列，用于显示每个数据部件中的文件数量。[#94337](https://github.com/ClickHouse/ClickHouse/pull/94337)（[Match](https://github.com/gayanMatch)）。
* 新增用于并发控制的最大最小公平调度器。当大量查询争用有限的 CPU 槽位、系统严重超额订阅时，该调度器可提供更好的公平性。短时查询不会因长时查询随时间累积了更多槽位而受到不利影响。通过将服务器设置 `concurrent_threads_scheduler` 的值设为 `max_min_fair` 来启用。[#94732](https://github.com/ClickHouse/ClickHouse/pull/94732)（[Sergei Trifonov](https://github.com/serxa)）。
* ClickHouse 客户端现在可在连接服务器时覆盖 TLS SNI。[#89761](https://github.com/ClickHouse/ClickHouse/pull/89761)（[Matt Klein](https://github.com/mattklein123)）。
* `joinGet` 函数调用支持临时表。[#92973](https://github.com/ClickHouse/ClickHouse/pull/92973)（[Eduard Karacharov](https://github.com/korowa)）。
* `DeltaLake` 表引擎支持删除向量。[#93852](https://github.com/ClickHouse/ClickHouse/pull/93852)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* `deltaLakeCluster` 支持删除向量。[#94365](https://github.com/ClickHouse/ClickHouse/pull/94365)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 数据湖支持 Google Cloud Storage。[#93866](https://github.com/ClickHouse/ClickHouse/pull/93866)（[Konstantin Vedernikov](https://github.com/scanhex12)）。

#### 实验性功能
* 将 `QBit` 从实验阶段提升至 Beta 阶段。[#93816](https://github.com/ClickHouse/ClickHouse/pull/93816)（[Raufs Dunamalijevs](https://github.com/rienath)）。
* 新增对 `Nullable(Tuple)` 的支持。设置 `allow_experimental_nullable_tuple_type = 1` 即可启用。[#89643](https://github.com/ClickHouse/ClickHouse/pull/89643)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 支持 Paimon REST 目录，延续 https://github.com/ClickHouse/ClickHouse/pull/84423 的工作。[#92011](https://github.com/ClickHouse/ClickHouse/pull/92011)（[JIaQi Tang](https://github.com/JiaQiTang98)）。
  
#### 性能改进
* 现在默认启用设置 `use_skip_indexes_on_data_read`。该设置支持在读取数据的同时以流式方式进行过滤，从而提升查询性能并缩短启动时间。[#93407](https://github.com/ClickHouse/ClickHouse/pull/93407)（[Shankar Iyer](https://github.com/shankar-iyer)）。
* 提升 `DISTINCT` 在 `LowCardinality` 列上的性能。关闭 [#5917](https://github.com/ClickHouse/ClickHouse/issues/5917)。[#91639](https://github.com/ClickHouse/ClickHouse/pull/91639)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 优化 `distinctJSONPaths` 聚合函数，使其仅从数据分区中读取 JSON 路径，而不再读取整个 JSON 列。[#92196](https://github.com/ClickHouse/ClickHouse/pull/92196)（[Pavel Kruglov](https://github.com/Avogar)）。
* 将更多过滤器下推至 JOIN。[#85556](https://github.com/ClickHouse/ClickHouse/pull/85556)（[Nikita Taranov](https://github.com/nickitat)）。
* 当过滤器仅使用连接一侧的输入时，支持从 JOIN 的 ON 条件下推更多情形。支持 `ANY`、`SEMI`、`ANTI` JOIN。[#92584](https://github.com/ClickHouse/ClickHouse/pull/92584)（[Dmitry Novik](https://github.com/novikd)）。
* 允许使用等价集合为 `SEMI JOIN` 下推过滤器。关闭 [#85239](https://github.com/ClickHouse/ClickHouse/issues/85239)。[#92837](https://github.com/ClickHouse/ClickHouse/pull/92837)（[Dmitry Novik](https://github.com/novikd)）。
* 当哈希连接的右侧为空时，跳过读取左侧。此前会持续读取左侧，直至遇到第一个非空数据块；在存在大量过滤或聚合操作时，这可能造成大量无用工作。[#94062](https://github.com/ClickHouse/ClickHouse/pull/94062)（[Alexander Gololobov](https://github.com/davenger)）。
* 在查询流水线内部使用 Daniel Lemire 的“fastrange”方法对数据进行分区。这可以提升并行排序和 JOIN 的性能。[#93080](https://github.com/ClickHouse/ClickHouse/pull/93080)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 当 PARTITION BY 与排序键相同或为其前缀时，提升窗口函数的性能。[#87299](https://github.com/ClickHouse/ClickHouse/pull/87299)（[Nikita Taranov](https://github.com/nickitat)）。
* 将外层过滤器下推至视图，从而可在本地和远程节点上应用 PREWHERE。解决 [#88189](https://github.com/ClickHouse/ClickHouse/issues/88189)。[#88316](https://github.com/ClickHouse/ClickHouse/pull/88316)（[Igor Nikonov](https://github.com/devcrafter)）。
* 为更多函数实现 JIT 编译。关闭 [#73509](https://github.com/ClickHouse/ClickHouse/issues/73509)。[#88770](https://github.com/ClickHouse/ClickHouse/pull/88770)（[Alexey Milovidov](https://github.com/alexey-milovidov) 与 [Taiyang Li](https://github.com/taiyang-li)）。
* 如果 `FINAL` 查询使用的跳数索引位于主键组成列上，则无需额外检查其他数据分区中的主键区间是否相交，现在不再执行此步骤。解决 [#85897](https://github.com/ClickHouse/ClickHouse/issues/85897)。[#93899](https://github.com/ClickHouse/ClickHouse/pull/93899)（[Shankar Iyer](https://github.com/shankar-iyer)）。
* 优化百分比形式 `LIMIT` 和 `OFFSET` 的性能与内存使用。[#91167](https://github.com/ClickHouse/ClickHouse/pull/91167)（[Ahmed Gouda](https://github.com/0xgouda)）。
* 修复 Parquet Reader V3 预取器未使用更快随机读取逻辑的问题。关闭 [#90890](https://github.com/ClickHouse/ClickHouse/issues/90890)。[#91435](https://github.com/ClickHouse/ClickHouse/pull/91435)（[Arsen Muk](https://github.com/arsenmuk)）。
* 提升 `icebergCluster` 的性能。关闭 [#91462](https://github.com/ClickHouse/ClickHouse/issues/91462)。[#91537](https://github.com/ClickHouse/ClickHouse/pull/91537)（[Yang Jiang](https://github.com/Ted-Jiang)）。
* 当过滤条件为常量时，不再按虚拟列进行过滤。[#91588](https://github.com/ClickHouse/ClickHouse/pull/91588)（[c-end](https://github.com/c-end)）。
* 通过启用自适应写入缓冲区，降低超宽表使用宽数据分区时 INSERT/合并的内存占用。为加密磁盘增加自适应写入缓冲区支持。[#92250](https://github.com/ClickHouse/ClickHouse/pull/92250)（[Azat Khuzhin](https://github.com/azat)）。
* 减少文本索引中需要搜索的词元数量，从而提升使用文本索引和 `sparseGrams` 分词器进行全文搜索的性能。[#93078](https://github.com/ClickHouse/ClickHouse/pull/93078)（[Anton Popov](https://github.com/CurtizJ)）。
* 优化函数 `isValidASCII` 在结果为真（即输入值全部为 ASCII）时的性能。[#93347](https://github.com/ClickHouse/ClickHouse/pull/93347)（[Robert Schulze](https://github.com/rschu1ze)）。
* 顺序读取优化现在可识别因 WHERE 条件而成为常量的 ORDER BY 列，从而支持高效的逆序读取。这有利于 `WHERE tenant='42' ORDER BY tenant, event_time DESC` 之类的多租户查询：现在可使用 InReverseOrder，而无需执行完整排序。[#94103](https://github.com/ClickHouse/ClickHouse/pull/94103)（[matanper](https://github.com/matanper)）。
* 引入专用的 Enum AST 类，使用（字符串、整数）对而非 ASTLiteral 子节点来存储值参数，以优化内存占用。[#94178](https://github.com/ClickHouse/ClickHouse/pull/94178)（[Ilya Yatsishin](https://github.com/qoega)）。
* 在多个副本上执行分布式索引分析。此功能有利于共享存储以及集群中数据量巨大的场景。它适用于 SharedMergeTree（ClickHouse Cloud），也可能适用于共享存储上的其他 MergeTree 表类型。[#86786](https://github.com/ClickHouse/ClickHouse/pull/86786)（[Azat Khuzhin](https://github.com/azat)）。
* 在以下情况下禁用 JOIN 运行时过滤器，以降低其开销：- 布隆过滤器中置位的位数过多；- 运行时过滤掉的行数过少。[#91578](https://github.com/ClickHouse/ClickHouse/pull/91578)（[Alexander Gololobov](https://github.com/davenger)）。
* 对相关子查询的输入使用内存缓冲区，避免多次求值。属于 [#79890](https://github.com/ClickHouse/ClickHouse/issues/79890) 的一部分。[#91205](https://github.com/ClickHouse/ClickHouse/pull/91205)（[Dmitry Novik](https://github.com/novikd)）。
* 在并行副本读取时，允许所有副本抢占孤立范围。这改善了负载均衡，并降低长尾延迟。[#91374](https://github.com/ClickHouse/ClickHouse/pull/91374)（[zoomxi](https://github.com/zoomxi)）。
* 外部聚合、排序和 JOIN 现在会在所有上下文中遵循查询设置 `temporary_files_codec`。修复 Grace Hash Join 缺少 ProfileEvent 的问题。[#92388](https://github.com/ClickHouse/ClickHouse/pull/92388)（[Vladimir Cherkasov](https://github.com/vdimir)）。
* 提高聚合或排序期间根据查询内存使用量触发落盘检测的稳健性。[#92500](https://github.com/ClickHouse/ClickHouse/pull/92500)（[Azat Khuzhin](https://github.com/azat)）。
* 估算聚合键列的总行数和 NDV（不同值数量）统计信息。[#92812](https://github.com/ClickHouse/ClickHouse/pull/92812)（[Alexander Gololobov](https://github.com/davenger)）。
* 使用 simdcomp 优化倒排列表压缩。[#92871](https://github.com/ClickHouse/ClickHouse/pull/92871)（[Peng Jian](https://github.com/fastio)）。
* 重构 S3Queue Ordered 模式中基于桶的处理逻辑。这还应能提升性能，并减少对 Keeper 的请求数量。[#92889](https://github.com/ClickHouse/ClickHouse/pull/92889)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 函数 `mapContainsKeyLike` 和 `mapContainsValueLike` 现在可分别利用 `mapKeys()` 或 `mapValues()` 上的文本索引。[#93049](https://github.com/ClickHouse/ClickHouse/pull/93049)（[Michael Jarrett](https://github.com/EmeraldShift)）。
* 降低非 Linux 系统上的内存使用量（启用立即清除 jemalloc 脏页）。[#93360](https://github.com/ClickHouse/ClickHouse/pull/93360)（[Eduard Karacharov](https://github.com/korowa)）。
* 当脏页大小与 `max_server_memory_usage` 的比值超过 `memory_worker_purge_dirty_pages_threshold_ratio` 时，强制清除 jemalloc arena。[#93500](https://github.com/ClickHouse/ClickHouse/pull/93500)（[Eduard Karacharov](https://github.com/korowa)）。
* 降低 AST 的内存占用。[#93601](https://github.com/ClickHouse/ClickHouse/pull/93601)（[Nikolai Kochetov](https://github.com/KochetovNicolai)）。
* 修复某些情况下 ClickHouse 从表中读取数据时未遵循内存限制的问题。[#93715](https://github.com/ClickHouse/ClickHouse/pull/93715)（[Nikita Mikhaylov](https://github.com/nikitamikhaylov)）。
* 默认启用 `CHECK_STAT` 和 `TRY_REMOVE` Keeper 扩展。[#93886](https://github.com/ClickHouse/ClickHouse/pull/93886)（[Mikhail Artemenko](https://github.com/Michicosun)）。
* 从 Iceberg 清单文件条目中解析与位置删除文件对应的文件名上下界，以便更准确地选择相应的数据文件。[#93980](https://github.com/ClickHouse/ClickHouse/pull/93980)（[Daniil Ivanik](https://github.com/divanik)）。
* 新增两个设置，用于控制 JSON 列中动态子列的最大数量。第一个是 MergeTree 设置 `merge_max_dynamic_subcolumns_in_compact_part`（类似于此前新增的 `merge_max_dynamic_subcolumns_in_wide_part`），用于限制合并为 Compact 数据分区时创建的动态子列数量。第二个是查询级设置 `max_dynamic_subcolumns_in_json_type_parsing`，用于限制解析 JSON 数据时创建的动态子列数量，从而可以在插入时指定该限制。[#94184](https://github.com/ClickHouse/ClickHouse/pull/94184)（[Pavel Kruglov](https://github.com/Avogar)）。
* 在部分场景中小幅优化 JSON 列的块合并。[#94247](https://github.com/ClickHouse/ClickHouse/pull/94247)（[Pavel Kruglov](https://github.com/Avogar)）。
* 根据生产环境经验调低线程池队列大小。在从 MergeTree 读取任何数据之前，新增显式内存占用检查。[#94692](https://github.com/ClickHouse/ClickHouse/pull/94692)（[Nikita Mikhaylov](https://github.com/nikitamikhaylov)）。
* 确保 CPU 资源不足时，调度器优先调度 MemoryWorker 线程，因为它能保护 ClickHouse 进程免受致命威胁。[#94864](https://github.com/ClickHouse/ClickHouse/pull/94864)（[Nikita Mikhaylov](https://github.com/nikitamikhaylov)）。
* 使用不同于 MemoryWorker 主线程的另一线程清除 jemalloc 脏页。如果清除速度较慢，可能会延迟 RSS 使用量更新，进而导致进程因内存不足而被终止。引入新配置 `memory_worker_purge_total_memory_threshold_ratio`，根据总内存使用量的比值开始清除脏页。[#94902](https://github.com/ClickHouse/ClickHouse/pull/94902)（[Antonio Andelic](https://github.com/antonio2368)）。

#### 改进
* `system.blob_storage_log` 现在可用于 Azure Blob Storage。[#93105](https://github.com/ClickHouse/ClickHouse/pull/93105)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 为 Local 和 HDFS 实现 `blob_storage_log`。修复 `S3Queue` 在 `blob_storage_log` 中记录日志时使用磁盘名称以外的内容所导致的错误。新增 `error_code` 列至 `blob_storage_log`。拆分测试配置文件，以简化本地测试。[#93106](https://github.com/ClickHouse/ClickHouse/pull/93106)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 在输入数字字面量时，`clickhouse-client` 和 `clickhouse-local` 会高亮其中的数字分组（千位、百万位等）。关闭 [#93100](https://github.com/ClickHouse/ClickHouse/issues/93100)。[#93108](https://github.com/ClickHouse/ClickHouse/pull/93108)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* `clickhouse-client` 现在支持等号两侧带空格的命令行参数。关闭 [#93077](https://github.com/ClickHouse/ClickHouse/issues/93077)。[#93174](https://github.com/ClickHouse/ClickHouse/pull/93174)（[Cole Smith](https://github.com/colesmith54)）。
* 设置 `<interactive_history_legacy_keymap>true</interactive_history_legacy_keymap>` 后，CLI 客户端现在可像以前一样回退使用 Ctrl-R 进行常规搜索，同时使用 Ctrl-T 进行模糊搜索。[#87785](https://github.com/ClickHouse/ClickHouse/pull/87785)（[Larry Snizek](https://github.com/larry-cdn77)）。
* 清除缓存的语句 `SYSTEM DROP [...] CACHE` 容易让人误以为该语句会禁用缓存。ClickHouse 现在支持语义更明确的语句 `SYSTEM CLEAR [...] CACHE`。旧语法仍然可用。[#93727](https://github.com/ClickHouse/ClickHouse/pull/93727)（[Pranav Tiwari](https://github.com/pranavt84)）。
* `EmbeddedRocksDB` 支持使用多列作为主键。关闭 [#32819](https://github.com/ClickHouse/ClickHouse/issues/32819)。[#33917](https://github.com/ClickHouse/ClickHouse/pull/33917)（[usurai](https://github.com/usurai)）。
* 标量现在可以使用非常量 IN（例如 `val1 NOT IN if(cond, val2, val3)` 查询）。[#93495](https://github.com/ClickHouse/ClickHouse/pull/93495)（[Yarik Briukhovetskyi](https://github.com/yariks5s)）。
* 阻止将 `x-amz-server-side-encryption` 标头传递给 `HeadObject`、`UploadPart` 和 `CompleteMultipartUpload` S3 请求，因为这些请求不支持该标头。[#64577](https://github.com/ClickHouse/ClickHouse/pull/64577)（[Francisco J. Jurado Moreno](https://github.com/Beetelbrox)）。
* 在 S3Queue 的 Ordered 模式下跟踪 Hive 分区。解决 [#71161](https://github.com/ClickHouse/ClickHouse/issues/71161)。[#81040](https://github.com/ClickHouse/ClickHouse/pull/81040)（[Anton Ivashkin](https://github.com/ianton-ru)）。
* 优化文件系统缓存中的空间预留。`FileCache::collectCandidatesForEviction` 将在不持有独占锁的情况下执行。[#82764](https://github.com/ClickHouse/ClickHouse/pull/82764)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 服务器日志支持复合轮转策略（大小 + 时间）。[#87620](https://github.com/ClickHouse/ClickHouse/pull/87620)（[Jianmei Zhang](https://github.com/zhangjmruc)）。
* CLI 客户端现在可指定 `<warnings>false</warnings>`，以取代命令行参数 `--no-warnings`。[#87783](https://github.com/ClickHouse/ClickHouse/pull/87783)（[Larry Snizek](https://github.com/larry-cdn77)）。
* `avg` 聚合函数现在支持 Date、DateTime 和 Time 类型的参数。关闭 [#82267](https://github.com/ClickHouse/ClickHouse/issues/82267)。[#87845](https://github.com/ClickHouse/ClickHouse/pull/87845)（[Yarik Briukhovetskyi](https://github.com/yariks5s)）。
* 默认启用优化 `use_join_disjunctions_push_down`。[#89313](https://github.com/ClickHouse/ClickHouse/pull/89313)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 相关子查询支持更多表引擎和数据源类型。关闭 [#80775](https://github.com/ClickHouse/ClickHouse/issues/80775)。[#90175](https://github.com/ClickHouse/ClickHouse/pull/90175)（[Dmitry Novik](https://github.com/novikd)）。
* 如果显式指定了参数化视图的模式，现在会将其显示出来。关闭 [#88875](https://github.com/ClickHouse/ClickHouse/issues/88875)、[#81385](https://github.com/ClickHouse/ClickHouse/issues/81385)。[#90220](https://github.com/ClickHouse/ClickHouse/pull/90220)（[Grigorii Sokolik](https://github.com/GSokol)）。
* 当 Keeper 日志位于最后提交索引之前时，正确处理日志条目中的空缺。[#90403](https://github.com/ClickHouse/ClickHouse/pull/90403)（[Antonio Andelic](https://github.com/antonio2368)）。
* 改进 `min_free_disk_bytes_to_perform_insert` 设置，使其能在 JBOD 卷上正确工作。[#90878](https://github.com/ClickHouse/ClickHouse/pull/90878)（[Aleksandr Musorin](https://github.com/AVMusorin)）。
* 允许在命名集合中指定 `storage_class_name` 设置，供 `S3` 表引擎和 `s3` 表函数使用。[#91926](https://github.com/ClickHouse/ClickHouse/pull/91926)（[János Benjamin Antal](https://github.com/antaljanosbenjamin)）。
* 支持通过 `system.zookeeper` 向辅助 ZooKeeper 插入数据。[#92092](https://github.com/ClickHouse/ClickHouse/pull/92092)（[RinChanNOW](https://github.com/RinChanNOWWW)）。
* 为 Keeper 新增指标：`KeeperChangelogWrittenBytes`、`KeeperChangelogFileSyncMicroseconds`、`KeeperSnapshotWrittenBytes` 和 `KeeperSnapshotFileSyncMicroseconds` ProfileEvent，以及 `KeeperBatchSizeElements` 和 `KeeperBatchSizeBytes` 直方图指标。[#92149](https://github.com/ClickHouse/ClickHouse/pull/92149)（[Miсhael Stetsyuk](https://github.com/mstetsyuk)）。
* 新增设置 `trace_profile_events_list`，用于将 `trace_profile_event` 的追踪范围限制为指定的事件名称列表。这样可以在大型工作负载上更精准地收集数据。[#92298](https://github.com/ClickHouse/ClickHouse/pull/92298)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 为可暂停的故障点支持 SYSTEM NOTIFY FAILPOINT。支持 SYSTEM WAIT FAILPOINT fp PAUSE/RESUME。[#92368](https://github.com/ClickHouse/ClickHouse/pull/92368)（[Shaohua Wang](https://github.com/tiandiwonder)）。
* 添加 `creation`（implicit/explicit）列到 `system.data_skipping_indices`。[#92378](https://github.com/ClickHouse/ClickHouse/pull/92378)（[Raúl Marín](https://github.com/Algunenano)）。
* 允许将 YTsaurus 动态表的列描述传递给字典数据源。[#92391](https://github.com/ClickHouse/ClickHouse/pull/92391)（[MikhailBurdukov](https://github.com/MikhailBurdukov)）。
* 在 [#63985](https://github.com/ClickHouse/ClickHouse/pull/63985) 中，我们实现了按端口指定 TLS 配置所需全部参数的能力（参见[可组合协议](https://clickhouse.com/docs/operations/settings/composable-protocols)），从而无需依赖全局 TLS 配置。但该实现仍隐式要求存在全局 `openSSL.server` 配置节，这与不同端口需要采用不同 TLS 配置的场景相冲突。例如，在 keeper-in-server 部署中，Keeper 之间的通信和 ClickHouse 客户端连接需要使用各自独立的 TLS 配置。[#92457](https://github.com/ClickHouse/ClickHouse/pull/92457)（[Miсhael Stetsyuk](https://github.com/mstetsyuk)）。
* 引入新设置 `input_format_binary_max_type_complexity`，限制二进制格式可解码的类型节点总数，以防范恶意载荷。[#92519](https://github.com/ClickHouse/ClickHouse/pull/92519)（[Raufs Dunamalijevs](https://github.com/rienath)）。
* 在 `system.background_schedule_pool{,_log}` 中反映正在运行的任务。添加相关文档。[#92587](https://github.com/ClickHouse/ClickHouse/pull/92587)（[Azat Khuzhin](https://github.com/azat)）。
* 在客户端中使用 Ctrl+R 搜索时，如果未找到匹配的历史记录，则执行当前查询。[#92749](https://github.com/ClickHouse/ClickHouse/pull/92749)（[Azat Khuzhin](https://github.com/azat)）。
* 支持将 `EXPLAIN indices = 1` 用作 `EXPLAIN indexes = 1` 的别名。关闭 [#92483](https://github.com/ClickHouse/ClickHouse/issues/92483)。[#92774](https://github.com/ClickHouse/ClickHouse/pull/92774)（[Pranav Tiwari](https://github.com/pranavt84)）。
* Parquet 读取器现在允许将 Tuple 或 Map 列读取为 JSON：查询 `select x from file(f.parquet, auto, 'x JSON')` 可以正常工作，即使列 `x` 在 `f.parquet` 中的类型是 tuple 或 map。[#92864](https://github.com/ClickHouse/ClickHouse/pull/92864)（[Michael Kolupaev](https://github.com/al13n321)）。
* Parquet 读取器支持空元组。[#92868](https://github.com/ClickHouse/ClickHouse/pull/92868)（[Michael Kolupaev](https://github.com/al13n321)）。
* 当 Azure Blob Storage 的原生复制因 BadRequest（例如块列表无效）而失败时，回退到读写复制。此前只有在跨存储账户复制 Blob 时遇到的 Unauthorized 错误才会触发回退，但有时也会遇到“The specified block list is invalid”错误。现在已更新条件，所有原生复制失败都会回退到读写方式。[#92888](https://github.com/ClickHouse/ClickHouse/pull/92888)（[Smita Kulkarni](https://github.com/SmitaRKulkarni)）。
* 修复使用 EC2 实例配置文件凭证并发运行大量 S3 查询时，EC2 元数据端点受到限流的问题。此前，每个查询都会创建自己的 `AWSInstanceProfileCredentialsProvider`，导致同时请求 EC2 元数据服务，可能造成超时和 `HTTP response code: 403` 错误。现在，凭证提供程序会被缓存并由所有查询共享。[#92891](https://github.com/ClickHouse/ClickHouse/pull/92891)（[Sav](https://github.com/sberss)）。
* 重新设计 `insert_select_deduplicate` 设置，以便能够保持向后兼容性。[#92951](https://github.com/ClickHouse/ClickHouse/pull/92951)（[Sema Checherinda](https://github.com/CheSema)）。
* 仅记录耗时高于平均水平的后台任务（`background_schedule_pool_log.duration_threshold_milliseconds=30`），避免生成过多任务日志。[#92965](https://github.com/ClickHouse/ClickHouse/pull/92965)（[Azat Khuzhin](https://github.com/azat)）。
* 在之前的版本中，部分 C++ 函数名在 `system.trace_log` 和 `system.symbols` 中显示不正确（显示为名称修饰后的形式），`demangle` 函数也无法妥善处理它们。关闭 [#93074](https://github.com/ClickHouse/ClickHouse/issues/93074)。[#93075](https://github.com/ClickHouse/ClickHouse/pull/93075)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 引入备份设置 `backup_data_from_refreshable_materialized_view_targets`，用于跳过刷新式物化视图的备份。采用 APPEND 刷新策略的 RMV 始终会被备份。[#93076](https://github.com/ClickHouse/ClickHouse/pull/93076)（[Julia Kartseva](https://github.com/jkartseva)）。[#93658](https://github.com/ClickHouse/ClickHouse/pull/93658)（[Julia Kartseva](https://github.com/jkartseva)）
* 对函数等大型翻译单元使用最小调试信息，而不是完全不生成调试信息。[#93079](https://github.com/ClickHouse/ClickHouse/pull/93079)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 通过实现 MinIO 特有错误的错误码映射，为 AWS S3 C++ SDK 添加 MinIO 兼容性支持。此项变更使 ClickHouse 在使用 MinIO 部署代替 AWS S3 时能够正确处理 MinIO 服务器错误并进行重试，提高了在自托管 MinIO 集群上运行对象存储的可靠性。[#93082](https://github.com/ClickHouse/ClickHouse/pull/93082)（[XiaoBinMu](https://github.com/Binnn-MX)）。
* 写出已符号化的 jemalloc 分析数据（生成堆分析数据时不再需要二进制文件）。[#93099](https://github.com/ClickHouse/ClickHouse/pull/93099)（[Azat Khuzhin](https://github.com/azat)）。
* 恢复 `clickhouse git-import` 工具——此前它无法处理大型提交和无效提交。参见 https://presentations.clickhouse.com/2020-matemarketing/. [#93202](https://github.com/ClickHouse/ClickHouse/pull/93202)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 不在查询日志中显示 URL 存储中的密码。[#93245](https://github.com/ClickHouse/ClickHouse/pull/93245)（[Konstantin Vedernikov](https://github.com/scanhex12)）。
* 支持将 `Geometry` 类型用于 `flipCoordinates`。[#93303](https://github.com/ClickHouse/ClickHouse/pull/93303)（[Bharat Nallan](https://github.com/bharatnc)）。
* 改进 SYSTEM INSTRUMENT ADD/REMOVE 的用户体验：函数名使用 String 字面量；对所有匹配的函数应用补丁；并允许在 `REMOVE` 中使用 function_name。[#93345](https://github.com/ClickHouse/ClickHouse/pull/93345)（[Pablo Marcos](https://github.com/pamarcos)）。
* 新增设置 `materialize_statistics_on_merge`，用于启用或禁用在合并期间物化统计信息。默认值为 `1`。[#93379](https://github.com/ClickHouse/ClickHouse/pull/93379)（[Han Fei](https://github.com/hanfei1991)）。
* ClickHouse 现在可以解析未用括号包围的 `SELECT`，用于 `DESCRIBE SELECT` 查询。关闭 [#58382](https://github.com/ClickHouse/ClickHouse/issues/58382)。[#93429](https://github.com/ClickHouse/ClickHouse/pull/93429)（[Yarik Briukhovetskyi](https://github.com/yariks5s)）。
* 添加按概率随机执行缓存正确性检查的功能。[#93439](https://github.com/ClickHouse/ClickHouse/pull/93439)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 添加设置 `type_json_allow_duplicated_key_with_literal_and_nested_object`，允许 JSON 中存在重复路径，其中一个是字面量，另一个是嵌套对象，例如 `{"a" : 42, "a" : {"b" : 42}}`。在 https://github.com/ClickHouse/ClickHouse/pull/79317 引入重复路径限制之前可能已经创建了一些数据，而现在进一步操作这些数据可能导致错误。启用此设置后，仍可无错误地使用这类旧数据。[#93604](https://github.com/ClickHouse/ClickHouse/pull/93604)（[Pavel Kruglov](https://github.com/Avogar)）。
* 在 Pretty JSON 中，不再将简单类型的值输出到单独的行。[#93836](https://github.com/ClickHouse/ClickHouse/pull/93836)（[Pavel Kruglov](https://github.com/Avogar)）。
* 存在大量 `alter table ... modify setting ...` 语句时，可能无法在 5 秒内获取锁。此时返回 `timeout` 比返回 `logical error` 更合适。[#93856](https://github.com/ClickHouse/ClickHouse/pull/93856)（[Han Fei](https://github.com/hanfei1991)）。
* 避免语法错误时输出过多内容。此变更前会输出整个 SQL 脚本，其中可能包含大量查询。[#93876](https://github.com/ClickHouse/ClickHouse/pull/93876)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 正确计算 Keeper 中包含统计信息的 `check` 请求的字节大小。[#93907](https://github.com/ClickHouse/ClickHouse/pull/93907)（[Mikhail Artemenko](https://github.com/Michicosun)）。
* 添加设置 `use_hash_table_stats_for_join_reordering`，用于控制是否使用运行时哈希表大小统计信息进行 JOIN 重排序。该设置默认启用，从而保留 `collect_hash_table_stats_during_joins` 的现有行为。[#93912](https://github.com/ClickHouse/ClickHouse/pull/93912)（[Vladimir Cherkasov](https://github.com/vdimir)）。
* 用户现在可以在 `system.server_settings` 表中查看部分嵌套的全局服务器设置（例如 `logger.level`）。这仅涵盖结构固定的设置（不包含列表、枚举、重复项等）。[#94001](https://github.com/ClickHouse/ClickHouse/pull/94001)（[Hechem Selmi](https://github.com/m-selmi)）。
* `QBit` 现在支持相等性比较。[#94078](https://github.com/ClickHouse/ClickHouse/pull/94078)（[Raufs Dunamalijevs](https://github.com/rienath)）。
* 当 Keeper 检测到损坏的快照或不一致的 Changelog 时，抛出异常，而不是手动中止或自动清理文件。这样 Keeper 将依赖人工干预，行为会更加安全。[#94168](https://github.com/ClickHouse/ClickHouse/pull/94168)（[Antonio Andelic](https://github.com/antonio2368)）。
* 修复 `CREATE TABLE` 失败时可能留下残余内容的问题。[#94174](https://github.com/ClickHouse/ClickHouse/pull/94174)（[Azat Khuzhin](https://github.com/azat)）。
* 修复使用受密码保护的 TLS 密钥时访问未初始化内存的问题（OpenSSL 中的缺陷）。[#94182](https://github.com/ClickHouse/ClickHouse/pull/94182)（[Konstantin Bogdanov](https://github.com/thevar1able)）。
* 将 chdig 升级至 [v26.1.1](https://github.com/azat/chdig/releases/tag/v26.1.1)。[#94290](https://github.com/ClickHouse/ClickHouse/pull/94290)（[Azat Khuzhin](https://github.com/azat)）。
* S3Queue 有序模式支持更通用的分区方式。[#94321](https://github.com/ClickHouse/ClickHouse/pull/94321)（[Bharat Nallan](https://github.com/bharatnc)）。
* 添加别名 `use_statistics`，对应设置 `allow_statistics_optimize`。这与现有设置 `use_primary_key` 和 `use_skip_indexes` 更加一致。[#94366](https://github.com/ClickHouse/ClickHouse/pull/94366)（[Robert Schulze](https://github.com/rschu1ze)）。
* 启用设置 `input_format_numbers_enum_on_conversion_error`，在从 Number 转换为 Enum 时检查元素是否存在。[#94384](https://github.com/ClickHouse/ClickHouse/pull/94384)（[Elmi Ahmadov](https://github.com/ahmadov)）。
* 在 S3(Azure)Queue 有序模式中，通过追踪限制来清理失败节点（此前仅在无序模式中对失败和已处理节点执行此操作；现在有序模式也会执行，但仅针对失败节点）。[#94412](https://github.com/ClickHouse/ClickHouse/pull/94412)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 在 clickhouse-local 中为 `default` 用户启用访问管理。`clickhouse-local` 的默认用户此前缺少 access_management 权限，导致 `DROP ROW POLICY IF EXISTS` 等操作以 `ACCESS_DENIED` 错误失败，尽管该用户本应不受限制。[#94501](https://github.com/ClickHouse/ClickHouse/pull/94501)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 为 YTsaurus 字典和表启用命名集合。[#94582](https://github.com/ClickHouse/ClickHouse/pull/94582)（[MikhailBurdukov](https://github.com/MikhailBurdukov)）。
* 在 S3 和 Azure Blob Storage 的 BACKUP/RESTORE 中支持通过 SQL 定义的命名集合。关闭 [#94604](https://github.com/ClickHouse/ClickHouse/issues/94604)。[#94605](https://github.com/ClickHouse/ClickHouse/pull/94605)（[Pablo Marcos](https://github.com/pamarcos)）。
* S3Queue 有序模式支持基于分区键进行分桶。[#94698](https://github.com/ClickHouse/ClickHouse/pull/94698)（[Bharat Nallan](https://github.com/bharatnc)）。
* 新增异步指标，用于记录运行时间最长的合并所经过的时间。[#94825](https://github.com/ClickHouse/ClickHouse/pull/94825)（[Raúl Marín](https://github.com/Algunenano)）。
* 使用 IcebergBitmapPositionDeleteTransform 应用位置删除前，添加所属文件检查。[#94897](https://github.com/ClickHouse/ClickHouse/pull/94897)（[Yang Jiang](https://github.com/Ted-Jiang)）。
* `view_duration_ms` 现在显示组处于活动状态的时长，而不是组内各线程时长的总和。[#94966](https://github.com/ClickHouse/ClickHouse/pull/94966)（[Sema Checherinda](https://github.com/CheSema)）。
* 移除 `hasAnyTokens` 和 `hasAllTokens` 函数最多只能接受 64 个搜索词元的限制。例如：`SELECT count() FROM table WHERE hasAllTokens(text, ['token_1', 'token_2', [...], 'token_65']]);`。由于存在 65 个搜索词元，该查询此前会产生 `BAD_ARGUMENTS` 错误。此 PR 完全移除了该限制，相同查询现在可以无错误运行。[#95152](https://github.com/ClickHouse/ClickHouse/pull/95152)（[Elmi Ahmadov](https://github.com/ahmadov)）。
* 添加设置 `input_format_numbers_enum_on_conversion_error`，在从 Number 转换为 Enum 时检查元素是否存在。关闭：[#56144](https://github.com/ClickHouse/ClickHouse/issues/56144)。[#56240](https://github.com/ClickHouse/ClickHouse/pull/56240)（[Nikolay Degterinsky](https://github.com/evillique)）。
* 在读取 Iceberg 表的数据文件和位置删除文件时共享格式解析器资源，以减少内存分配。[#94701](https://github.com/ClickHouse/ClickHouse/pull/94701)（[Yang Jiang](https://github.com/Ted-Jiang)）。

#### Bug 修复（正式稳定版本中用户可见的异常行为）
* 修复预定义查询处理程序在插入期间将尾随空白字符解释为数据的问题。[#83604](https://github.com/ClickHouse/ClickHouse/pull/83604)（[Fabian Ponce](https://github.com/FabianPonce)）。
* 修复对 Join 存储应用外连接转内连接优化时出现 INCOMPATIBLE_TYPE_OF_JOIN 错误的问题。解决 [#80794](https://github.com/ClickHouse/ClickHouse/issues/80794)。[#84292](https://github.com/ClickHouse/ClickHouse/pull/84292)（[Vladimir Cherkasov](https://github.com/vdimir)）。
* 修复启用 `allow_experimental_join_right_table_sorting` 后使用哈希连接时出现“Invalid number of rows in Chunk”异常的问题。[#86440](https://github.com/ClickHouse/ClickHouse/pull/86440)（[yanglongwei](https://github.com/ylw510)）。
* 如果文件系统不区分大小写，始终在 MergeTree 中将文件名替换为哈希值。此前在采用不区分大小写文件系统的系统（如 macOS）上，如果多个列/子列名称仅大小写不同，可能导致数据损坏。[#86559](https://github.com/ClickHouse/ClickHouse/pull/86559)（[Pavel Kruglov](https://github.com/Avogar)）。
* 在物化视图底层查询的创建阶段增加完整的权限检查。[#89180](https://github.com/ClickHouse/ClickHouse/pull/89180)（[pufit](https://github.com/pufit)）。
* 修复 `icebergHash` 函数接收常量参数时崩溃的问题。[#90335](https://github.com/ClickHouse/ClickHouse/pull/90335)（[Michael Kolupaev](https://github.com/al13n321)）。
* 修复未使用事务的变更会修改活跃事务中的数据片段，而该事务最终又被回滚的逻辑错误。[#90469](https://github.com/ClickHouse/ClickHouse/pull/90469)（[Shaohua Wang](https://github.com/tiandiwonder)）。
* 普通数据库转换为原子数据库后，正确更新 `system.warnings`。[#90473](https://github.com/ClickHouse/ClickHouse/pull/90473)（[sdk2](https://github.com/sdk2)）。
* 修复读取 Parquet 文件时，如果 **prewhere** 表达式的一部分还在查询的其他位置使用会触发断言的问题。[#90635](https://github.com/ClickHouse/ClickHouse/pull/90635)（[Max Kainov](https://github.com/maxknv)）。
* 修复单节点集群以按存储桶拆分模式读取 Iceberg 时崩溃的问题。关闭 [#90913](https://github.com/ClickHouse/ClickHouse/issues/90913#issue-3668583963)。[#91553](https://github.com/ClickHouse/ClickHouse/pull/91553)（[Konstantin Vedernikov](https://github.com/scanhex12)）。
* 修复 Log 引擎读取子列时可能出现的逻辑错误。关闭 [#91710](https://github.com/ClickHouse/ClickHouse/issues/91710)。[#91711](https://github.com/ClickHouse/ClickHouse/pull/91711)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复执行 ATTACH AS REPLICATED 时出现“Storage does not support transaction”逻辑错误的问题。[#91772](https://github.com/ClickHouse/ClickHouse/pull/91772)（[Shaohua Wang](https://github.com/tiandiwonder)）。
* 修复 LEFT ANTI JOIN 包含额外后置条件时运行时过滤器工作不正确的问题。[#91824](https://github.com/ClickHouse/ClickHouse/pull/91824)（[Alexander Gololobov](https://github.com/davenger)）。
* 修复涉及 Nothing 类型的空值安全比较出现错误的问题。关闭 [#91834](https://github.com/ClickHouse/ClickHouse/issues/91834)。关闭 [#84870](https://github.com/ClickHouse/ClickHouse/issues/84870)。关闭 [#91821](https://github.com/ClickHouse/ClickHouse/issues/91821)。[#91884](https://github.com/ClickHouse/ClickHouse/pull/91884)（[Yarik Briukhovetskyi](https://github.com/yariks5s)）。
* 修复原生 Parquet 读取器中影响高度重复字符串数据的 DELTA_BYTE_ARRAY 解码错误。[#91929](https://github.com/ClickHouse/ClickHouse/pull/91929)（[Daniel Muino](https://github.com/dmuino)）。
* 在对 glob 执行模式推断时，只为实际推断模式的文件缓存模式，而非为所有文件缓存。关闭 [#91745](https://github.com/ClickHouse/ClickHouse/issues/91745)。[#92006](https://github.com/ClickHouse/ClickHouse/pull/92006)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复归档条目大小标头不正确所导致的 `Couldn't pack tar archive: Failed to write all bytes` 错误。修复 [#89075](https://github.com/ClickHouse/ClickHouse/issues/89075)。[#92122](https://github.com/ClickHouse/ClickHouse/pull/92122)（[Julia Kartseva](https://github.com/jkartseva)）。
* 在 INSERT SELECT 中释放请求流，以防止 HTTP 连接被关闭。[#92175](https://github.com/ClickHouse/ClickHouse/pull/92175)（[Sema Checherinda](https://github.com/CheSema)）。
* 修复包含多个使用 `USING` 子句的 JOIN 且启用 `join_use_nulls` 时出现的逻辑错误。[#92251](https://github.com/ClickHouse/ClickHouse/pull/92251)（[Vladimir Cherkasov](https://github.com/vdimir)）。
* 修复启用 join_use_nulls 时连接重排序出现的逻辑错误，关闭 https://github.com/clickhouse/clickhouse/issues/90795。 [#92289](https://github.com/ClickHouse/ClickHouse/pull/92289)（[Vladimir Cherkasov](https://github.com/vdimir)）。
* 修复 arrayElement 搭配负数字面量时 AST 格式化不一致的问题。关闭 [#92288](https://github.com/ClickHouse/ClickHouse/issues/92288)；关闭 [#92212](https://github.com/ClickHouse/ClickHouse/issues/92212)；关闭 [#91832](https://github.com/ClickHouse/ClickHouse/issues/91832)；关闭 [#91789](https://github.com/ClickHouse/ClickHouse/issues/91789)；关闭 [#91735](https://github.com/ClickHouse/ClickHouse/issues/91735)；关闭 [#88495](https://github.com/ClickHouse/ClickHouse/issues/88495)；关闭 [#92386](https://github.com/ClickHouse/ClickHouse/issues/92386)。[#92293](https://github.com/ClickHouse/ClickHouse/pull/92293)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复使用 `join_on_disk_max_files_to_merge` 设置时可能发生的崩溃。[#92335](https://github.com/ClickHouse/ClickHouse/pull/92335)（[Bharat Nallan](https://github.com/bharatnc)）。
* 相关问题：#https://github.com/ClickHouse/support-escalation/issues/6365。 [#92339](https://github.com/ClickHouse/ClickHouse/pull/92339)（[Tuan Pham Anh](https://github.com/tuanpach)）。
* 修复 `SYSTEM SYNC FILE CACHE` 中缺少访问权限检查的问题。关闭 [#92101](https://github.com/ClickHouse/ClickHouse/issues/92101)。[#92372](https://github.com/ClickHouse/ClickHouse/pull/92372)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复 `count_distinct_optimization` 优化错误越过窗口函数以及多个参数的问题。[#92376](https://github.com/ClickHouse/ClickHouse/pull/92376)（[Raúl Marín](https://github.com/Algunenano)）。
* 修复将某些聚合函数与窗口函数配合使用时出现“Cannot write to finalized buffer”错误的问题。关闭 [#91415](https://github.com/ClickHouse/ClickHouse/issues/91415)。[#92395](https://github.com/ClickHouse/ClickHouse/pull/92395)（[Jimmy Aguilar Mena](https://github.com/Ergus)）。
* 修复执行 `CREATE TABLE ... AS urlCluster()` 并使用数据库引擎 `Replicated` 时出现的逻辑错误。关闭 [#92216](https://github.com/ClickHouse/ClickHouse/issues/92216)。[#92418](https://github.com/ClickHouse/ClickHouse/pull/92418)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* MergeTree 执行变更时继承源数据片段的序列化信息设置。这修复了数据类型序列化方式改变后，查询已变更数据片段可能返回错误结果的问题。[#92419](https://github.com/ClickHouse/ClickHouse/pull/92419)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复列与同名子列之间可能发生冲突，导致使用错误的序列化方式并使查询失败的问题。关闭 [#90219](https://github.com/ClickHouse/ClickHouse/issues/90219)。关闭 [#85161](https://github.com/ClickHouse/ClickHouse/issues/85161)。[#92453](https://github.com/ClickHouse/ClickHouse/pull/92453)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复将外连接转换为内连接时意外修改查询计划所导致的 `LOGICAL_ERROR`。同时放宽该优化的应用条件，使其可以在连接期间对聚合键应用单射函数的场景中生效。[#92503](https://github.com/ClickHouse/ClickHouse/pull/92503)（[János Benjamin Antal](https://github.com/antaljanosbenjamin)）。
* 修复对空元组列排序时可能出现的 `SIZES_OF_COLUMNS_DOESNT_MATCH` 错误。关闭 [#92422](https://github.com/ClickHouse/ClickHouse/issues/92422)。[#92520](https://github.com/ClickHouse/ClickHouse/pull/92520)（[Pavel Kruglov](https://github.com/Avogar)）。
* 检查 JSON 类型中类型不兼容的路径。关闭 [#91577](https://github.com/ClickHouse/ClickHouse/issues/91577)。[#92539](https://github.com/ClickHouse/ClickHouse/pull/92539)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复对 Backup 数据库执行 SHOW CREATE DATABASE 时发生死锁的问题。[#92541](https://github.com/ClickHouse/ClickHouse/pull/92541)（[Azat Khuzhin](https://github.com/azat)）。
* 验证假设索引时使用正确的错误码。[#92559](https://github.com/ClickHouse/ClickHouse/pull/92559)（[Raúl Marín](https://github.com/Algunenano)）。
* 修复分析器中列别名所引用动态子列的解析。此前列别名中的动态子列会包装在 `getSubcolumn` 中，并且在某些情况下可能完全无法解析。关闭 [#91434](https://github.com/ClickHouse/ClickHouse/issues/91434)。[#92583](https://github.com/ClickHouse/ClickHouse/pull/92583)（[Pavel Kruglov](https://github.com/Avogar)）。
* 防止 tokens() 的第二个参数为 null 时崩溃。[#92586](https://github.com/ClickHouse/ClickHouse/pull/92586)（[Raúl Marín](https://github.com/Algunenano)）。
* 修复就地变更底层常量 PREWHERE 列可能导致的崩溃。该问题可能发生在列收缩（`IColumn::shrinkToFit`）或过滤（`IColumn::filter`）期间，而这些操作可能由多个线程并发触发。[#92588](https://github.com/ClickHouse/ClickHouse/pull/92588)（[Arsen Muk](https://github.com/arsenmuk)）。
* 暂时禁止在包含大型数据片段（超过 4,294,967,295 行）的表上创建和物化文本索引。此限制可避免查询结果错误，因为当前索引实现尚不支持如此大的数据片段。[#92644](https://github.com/ClickHouse/ClickHouse/pull/92644)（[Anton Popov](https://github.com/CurtizJ)）。
* 修复执行 JOIN 时出现 `Too large size (A) passed to allocator` 逻辑错误的问题。关闭 [#92043](https://github.com/ClickHouse/ClickHouse/issues/92043)。[#92667](https://github.com/ClickHouse/ClickHouse/pull/92667)（[Yarik Briukhovetskyi](https://github.com/yariks5s)）。
* 修复 ngram 长度（第一个参数）大于 8 的 `ngrambf_v1` 索引会抛出异常的问题。[#92672](https://github.com/ClickHouse/ClickHouse/pull/92672)（[Robert Schulze](https://github.com/rschu1ze)）。
* 修复使用 ZooKeeper 存储时，在后台重新加载命名集合期间出现未捕获异常的问题。关闭 https://github.com/ClickHouse/clickhouse-private/issues/44180。 [#92717](https://github.com/ClickHouse/ClickHouse/pull/92717)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 重构通配符授权的访问权限检查错误逻辑。此前的修复 https://github.com/ClickHouse/ClickHouse/pull/90928 解决了一个严重漏洞，但限制过严，导致某些通配符 `GRANT` 语句因不相关的权限撤销而失败。[#92725](https://github.com/ClickHouse/ClickHouse/pull/92725)（[pufit](https://github.com/pufit)）。
* 修复使用 `not match(...)` 作为 `WHERE` 条件时，数据跳过逻辑导致结果错误的问题。关闭 [#92492](https://github.com/ClickHouse/ClickHouse/issues/92492)。[#92726](https://github.com/ClickHouse/ClickHouse/pull/92726)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 如果 MergeTree 表建立在只读磁盘上，启动时不再尝试删除临时目录。[#92748](https://github.com/ClickHouse/ClickHouse/pull/92748)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复执行 ALTER TABLE REWRITE PARTS (v2) 时出现“Cannot add action to empty ExpressionActionsChain”的问题。[#92754](https://github.com/ClickHouse/ClickHouse/pull/92754)（[Azat Khuzhin](https://github.com/azat)）。
* 避免从已断开的 `Connection` 读取数据而导致崩溃。[#92807](https://github.com/ClickHouse/ClickHouse/pull/92807)（[Raufs Dunamalijevs](https://github.com/rienath)）。
* 修复 ` Failed to set file processing within 100 retries` 逻辑错误；该错误出现在 `S3Queue` 存储的 `Ordered` 模式下。该错误现已改为警告。在 25.10 之前的版本中，如果 Keeper 会话过期便可能出现此错误；在 25.10 及后续版本中仍会作为警告，因为 `Ordered` 模式下处理并发度较高时，理论上仍有可能出现此错误。[#92814](https://github.com/ClickHouse/ClickHouse/pull/92814)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 此前，某些使用主键分片且条件为 false 的查询会失败。现已不会失败。此项为 https://github.com/ClickHouse/ClickHouse/pull/89313 所需。 [#92815](https://github.com/ClickHouse/ClickHouse/pull/92815)（[Yarik Briukhovetskyi](https://github.com/yariks5s)）。
* 修复 `system.parts` 表中文本索引未压缩大小的计算。[#92832](https://github.com/ClickHouse/ClickHouse/pull/92832)（[Anton Popov](https://github.com/CurtizJ)）。
* 修复轻量级更新中主索引的使用问题：其谓词包含带子查询的 `IN` 子句，且该谓词位于 `WHERE` 子句中时，主索引此前无法正确使用。[#92838](https://github.com/ClickHouse/ClickHouse/pull/92838)（[Anton Popov](https://github.com/CurtizJ)）。
* 修复为 JSON 中的路径 'skip' 创建类型提示的问题。关闭 [#92731](https://github.com/ClickHouse/ClickHouse/issues/92731)。[#92842](https://github.com/ClickHouse/ClickHouse/pull/92842)（[Pavel Kruglov](https://github.com/Avogar)）。
* 在 S3 表引擎中，如果存在非确定性函数，则不应缓存分区键。[#92844](https://github.com/ClickHouse/ClickHouse/pull/92844)（[Miсhael Stetsyuk](https://github.com/mstetsyuk)）。
* 修复变更稀疏列后可能出现 `FILE_DOESNT_EXIST` 错误的问题；该列使用了 `ratio_of_defaults_for_sparse_serialization=0.0`。关闭 [#92633](https://github.com/ClickHouse/ClickHouse/issues/92633)。[#92860](https://github.com/ClickHouse/ClickHouse/pull/92860)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复旧版 Parquet 读取器（默认不使用）在 JSON 列位于 Tuple 列之后时的模式推断。修复旧版 Parquet 读取器（默认不使用）处理空元组时失败的问题。[#92867](https://github.com/ClickHouse/ClickHouse/pull/92867)（[Michael Kolupaev](https://github.com/al13n321)）。
* 修复启用 `join_use_nulls` 且多个连接使用常量条件时出现的逻辑错误，关闭 [#92640](https://github.com/ClickHouse/ClickHouse/issues/92640)。[#92892](https://github.com/ClickHouse/ClickHouse/pull/92892)（[Vladimir Cherkasov](https://github.com/vdimir)）。
* 修复向分区表达式包含子列的表插入数据时可能出现 `NOT_FOUND_COLUMN_IN_BLOCK` 错误的问题。关闭 [#93210](https://github.com/ClickHouse/ClickHouse/issues/93210)。关闭 [#83406](https://github.com/ClickHouse/ClickHouse/issues/83406)。[#92905](https://github.com/ClickHouse/ClickHouse/pull/92905)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复 Merge 引擎查询包含别名的表时出现 `NO_SUCH_COLUMN_IN_TABLE` 错误的问题。关闭 [#88665](https://github.com/ClickHouse/ClickHouse/issues/88665)。[#92910](https://github.com/ClickHouse/ClickHouse/pull/92910)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复 full_sorting_join 对 LowCardinality(Nullable(T)) 列处理 NULL != NULL 情况的问题。[#92924](https://github.com/ClickHouse/ClickHouse/pull/92924)（[Vladimir Cherkasov](https://github.com/vdimir)）。
* 修复 `MergeTree` 表合并文本索引期间的多处崩溃问题。[#92925](https://github.com/ClickHouse/ClickHouse/pull/92925)（[Anton Popov](https://github.com/CurtizJ)）。
* 在 TTL 聚合期间按需恢复 SET 表达式结果的 LowCardinality 包装，以防止表优化期间出现异常。[#92971](https://github.com/ClickHouse/ClickHouse/pull/92971)（[Seva Potapov](https://github.com/seva-potapov)）。
* 修复在 `has` 函数中使用空数组时，索引分析期间出现的逻辑错误。关闭 [#92906](https://github.com/ClickHouse/ClickHouse/issues/92906)。[#92995](https://github.com/ClickHouse/ClickHouse/pull/92995)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 修复终止后台调度池时可能卡住的问题（可能导致服务器关机时挂起）。[#93008](https://github.com/ClickHouse/ClickHouse/pull/93008)（[Azat Khuzhin](https://github.com/azat)）。
* 修复通过 ALTER 将 `ratio_of_defaults_for_sparse_serialization` 设置更改为 `1.0` 后，变更稀疏列可能出现 FILE_DOESNT_EXIST 错误的问题。[#93016](https://github.com/ClickHouse/ClickHouse/pull/93016)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复在 WHERE 中使用 `not materialize(...)` 或 `not CAST(...)` 时，数据跳过逻辑导致结果错误的问题。关闭 [#88536](https://github.com/ClickHouse/ClickHouse/issues/88536)。[#93017](https://github.com/ClickHouse/ClickHouse/pull/93017)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 修复共享数据片段发生 TOCTOU 竞争时可能使用过时数据片段的问题。[#93022](https://github.com/ClickHouse/ClickHouse/pull/93022)（[Azat Khuzhin](https://github.com/azat)）。
* 修复反序列化包含越界偏移量的畸形 `groupConcat` 聚合状态时崩溃的问题。[#93028](https://github.com/ClickHouse/ClickHouse/pull/93028)（[Raufs Dunamalijevs](https://github.com/rienath)）。
* 修复提前取消分布式查询后连接残留在损坏状态的问题。[#93029](https://github.com/ClickHouse/ClickHouse/pull/93029)（[Azat Khuzhin](https://github.com/azat)）。
* 修复右侧连接键为稀疏列时的连接结果。关闭 [#92920](https://github.com/ClickHouse/ClickHouse/issues/92920)。此问题只能在设置 `set compatibility='23.3'` 后复现，尚不确定是否应回移。[#93038](https://github.com/ClickHouse/ClickHouse/pull/93038)（[Amos Bird](https://github.com/amosbird)）。
* 修复 `Cannot finalize buffer after cancellation` 可能在 `estimateCompressionRatio()` 中出现的问题。修复：[#87380](https://github.com/ClickHouse/ClickHouse/issues/87380)。[#93068](https://github.com/ClickHouse/ClickHouse/pull/93068)（[Azat Khuzhin](https://github.com/azat)）。
* 修复基于复杂表达式（例如 `concat(col1, col2)`）构建的文本索引合并。[#93073](https://github.com/ClickHouse/ClickHouse/pull/93073)（[Anton Popov](https://github.com/CurtizJ)）。
* 修复过滤器包含子列时投影的应用。关闭 [#92882](https://github.com/ClickHouse/ClickHouse/issues/92882)。[#93141](https://github.com/ClickHouse/ClickHouse/pull/93141)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复向查询计划添加连接运行时过滤器时，在某些情况下触发的逻辑错误。其原因是错误地从连接的一侧返回了重复的常量列。[#93144](https://github.com/ClickHouse/ClickHouse/pull/93144)（[Alexander Gololobov](https://github.com/davenger)）。
* 连接运行时过滤器所使用的特殊函数 `__applyFilter` 在某些有效情况下会返回 ILLEGAL_TYPE_OF_ARGUMENT。[#93187](https://github.com/ClickHouse/ClickHouse/pull/93187)（[Alexander Gololobov](https://github.com/davenger)）。
* 当不同的插值列实际上是同一列的别名时，防止它们在块中折叠为同一列。[#93197](https://github.com/ClickHouse/ClickHouse/pull/93197)（[Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)）。
* 与已经填充的右表连接时，不添加运行时过滤器。[#93211](https://github.com/ClickHouse/ClickHouse/pull/93211)（[Alexander Gololobov](https://github.com/davenger)）。
* 修复 Keeper 会话失效后持久监视的清理。关闭 [#92480](https://github.com/ClickHouse/ClickHouse/issues/92480)。[#93213](https://github.com/ClickHouse/ClickHouse/pull/93213)（[Konstantin Vedernikov](https://github.com/scanhex12)）。
* 修复 Iceberg 中按元组排序的问题。关闭 [#92977](https://github.com/ClickHouse/ClickHouse/issues/92977)。[#93225](https://github.com/ClickHouse/ClickHouse/pull/93225)（[Konstantin Vedernikov](https://github.com/scanhex12)）。
* 修复 S3Queue 设置 `s3queue_migrate_old_metadata_to_buckets` 的问题。关闭 [#93392](https://github.com/ClickHouse/ClickHouse/issues/93392)、[#93196](https://github.com/ClickHouse/ClickHouse/issues/93196)、[#81739](https://github.com/ClickHouse/ClickHouse/issues/81739)。[#93232](https://github.com/ClickHouse/ClickHouse/pull/93232)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 合并期间重建投影时移除未使用的列。这可降低内存使用量并减少临时数据片段。[#93233](https://github.com/ClickHouse/ClickHouse/pull/93233)（[Nikolai Kochetov](https://github.com/KochetovNicolai)）。
* 修复存在标量相关子查询时，从子查询中移除未使用列的问题。修复前，如果某列仅在相关子查询中使用，该列可能会被移除，导致查询以 `NOT_FOUND_COLUMN_IN_BLOCK` 错误失败。[#93273](https://github.com/ClickHouse/ClickHouse/pull/93273)（[Dmitry Novik](https://github.com/novikd)）。
* 修复更改源表期间物化视图中可能缺少子列的问题。关闭 [#93231](https://github.com/ClickHouse/ClickHouse/issues/93231)。[#93276](https://github.com/ClickHouse/ClickHouse/pull/93276)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复分析器对 `Merge` 表引擎进行查询规划时，合并本地表与远程/Distributed 表可能因 `hostName()` 抛出 ILLEGAL_COLUMN 的问题。关闭 [#92059](https://github.com/ClickHouse/ClickHouse/issues/92059)。[#93286](https://github.com/ClickHouse/ClickHouse/pull/93286)（[Jinlin](https://github.com/withlin)）。
* 修复使用非常量数组参数的 NOT IN 返回错误值的问题，并支持非常量 Array 函数。关闭 [#14980](https://github.com/ClickHouse/ClickHouse/issues/14980)。[#93314](https://github.com/ClickHouse/ClickHouse/pull/93314)（[Yarik Briukhovetskyi](https://github.com/yariks5s)）。
* 修复 `Not found column` 错误在 `use_top_k_dynamic_filtering` 优化中出现的问题。修复 [#93186](https://github.com/ClickHouse/ClickHouse/issues/93186)。[#93316](https://github.com/ClickHouse/ClickHouse/pull/93316)（[Nikolai Kochetov](https://github.com/KochetovNicolai)）。
* 修复基于子列创建的文本索引重建。[#93326](https://github.com/ClickHouse/ClickHouse/pull/93326)（[Anton Popov](https://github.com/CurtizJ)）。
* 修复 `hasAllTokens` 和 `hasAnyTokens` 函数将空数组作为第二个参数时的处理。[#93328](https://github.com/ClickHouse/ClickHouse/pull/93328)（[Anton Popov](https://github.com/CurtizJ)）。
* 修复在查询中使用运行时过滤器，且右侧表包含总计行时出现的逻辑错误。[#93330](https://github.com/ClickHouse/ClickHouse/pull/93330)（[Alexander Gololobov](https://github.com/davenger)）。
* 使用非常量分词器参数（第 2、3、4 个参数）调用 `tokens` 函数时服务器不再崩溃，例如 `SELECT tokens(NULL, 1, materialize(1))`。[#93383](https://github.com/ClickHouse/ClickHouse/pull/93383)（[Robert Schulze](https://github.com/rschu1ze)）。
* 修复 `groupConcat` 状态反序列化中的整数溢出漏洞，该漏洞可能通过特制聚合状态引发内存安全问题。[#93426](https://github.com/ClickHouse/ClickHouse/pull/93426)（[Raufs Dunamalijevs](https://github.com/rienath)）。
* 修复了数组列上的文本索引分析问题：当索引不包含任何词元时（所有数组均为空，或所有词元均被分词器跳过），现在可以正确处理。[#93457](https://github.com/ClickHouse/ClickHouse/pull/93457)（[Anton Popov](https://github.com/CurtizJ)）。
* 当连接字符串中已包含用户名/密码时，避免 ClickHouse Client 进行 OAuth 登录。[#93459](https://github.com/ClickHouse/ClickHouse/pull/93459)（[Krishna Mannem](https://github.com/kcmannem)）。
* 修复 DataLakeCatalog 对 Azure ADLS Gen2 下发凭据的支持：从 Iceberg REST catalog 中解析 `adls.sas-token.*` 键，并修复 ABFSS URL 解析。[#93477](https://github.com/ClickHouse/ClickHouse/pull/93477)（[Karun Anantharaman](https://github.com/karunmotorq)）。
* 修复分析器对 GLOBAL IN 的支持（此前集合会再次在远程节点上创建）。[#93507](https://github.com/ClickHouse/ClickHouse/pull/93507)（[Azat Khuzhin](https://github.com/azat)）。
* 修复直接反序列化到 Sparse 列时提取子列的问题。[#93512](https://github.com/ClickHouse/ClickHouse/pull/93512)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复搜索查询重复时直接从文本索引读取的问题。[#93516](https://github.com/ClickHouse/ClickHouse/pull/93516)（[Anton Popov](https://github.com/CurtizJ)）。
* 修复启用运行时过滤器且参与 JOIN 的表多次返回同一列时（例如 SELECT a, a, a FROM t）出现 NOT_FOUND_COLUMN_IN_BLOCK 错误的问题。[#93526](https://github.com/ClickHouse/ClickHouse/pull/93526)（[Alexander Gololobov](https://github.com/davenger)）。
* 修复 clickhouse-client 通过 SSH 连接时会要求输入两次密码的问题。[#93547](https://github.com/ClickHouse/ClickHouse/pull/93547)（[Isak Ellmer](https://github.com/spinojara)）。
* 确保 ZooKeeper 在关闭时完成终止流程（修复极少数情况下关闭时可能卡住的问题）。[#93602](https://github.com/ClickHouse/ClickHouse/pull/93602)（[Azat Khuzhin](https://github.com/azat)）。
* 修复在去重竞态下恢复 ReplicatedMergeTree 时出现 LOGICAL_ERROR 的问题。[#93612](https://github.com/ClickHouse/ClickHouse/pull/93612)（[Pablo Marcos](https://github.com/pamarcos)）。
* 修复在某些输入格式中直接反序列化到 Sparse 列时，TTL 更新使用 Sparse 列的问题。这修复了可能出现的逻辑错误 `Unexpected type of result TTL column`。[#93619](https://github.com/ClickHouse/ClickHouse/pull/93619)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复 h3 索引函数在无效输入上调用时有时会崩溃或卡住的问题。[#93657](https://github.com/ClickHouse/ClickHouse/pull/93657)（[Michael Kolupaev](https://github.com/al13n321)）。
* 在非 UTF-8 数据上使用 `ngram_bf` 索引会导致读取未初始化内存，其中的值可能进入最终索引结构。关闭 [#92576](https://github.com/ClickHouse/ClickHouse/issues/92576)。[#93663](https://github.com/ClickHouse/ClickHouse/pull/93663)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 验证解压后缓冲区的大小是否符合预期。[#93690](https://github.com/ClickHouse/ClickHouse/pull/93690)（[Raúl Marín](https://github.com/Algunenano)）。
* 防止用户在未检查 `SHOW COLUMNS` 权限的情况下，通过 `merge` 表引擎获取表的列列表。[#93695](https://github.com/ClickHouse/ClickHouse/pull/93695)（[János Benjamin Antal](https://github.com/antaljanosbenjamin)）。
* 修复基于子列创建的跳数索引的物化问题。[#93708](https://github.com/ClickHouse/ClickHouse/pull/93708)（[Anton Popov](https://github.com/CurtizJ)）。
* 将存储对象的共享指针保存在 `QueryPipeline::resources::storage_holders` 中，以确保 `IStorage` 对象不会在 `PipelineExecutor` 存活期间被销毁。[#93746](https://github.com/ClickHouse/ClickHouse/pull/93746)（[Miсhael Stetsyuk](https://github.com/mstetsyuk)）。
* 修复重启后服务器间主机名发生变化时，无法附加 Replicated 数据库的问题。[#93779](https://github.com/ClickHouse/ClickHouse/pull/93779)（[Tuan Pham Anh](https://github.com/tuanpach)）。
* 修复启用缓存时触发的 `!read_until_position` 断言；该问题发生在 `ReadBufferFromS3` 中。[#93809](https://github.com/ClickHouse/ClickHouse/pull/93809)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复空元组与 `Map` 列一起使用时，极少数情况下出现逻辑错误的问题。关闭 [#93784](https://github.com/ClickHouse/ClickHouse/issues/93784)。[#93814](https://github.com/ClickHouse/ClickHouse/pull/93814)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 修复合并期间重建 projection 时 `_part_offset` 损坏的问题；同时避免不必要地读取 `_part_offset` 列，并在 projection 计算中跳过无需使用的列，从而优化 projection 处理。这延续了 [#93233](https://github.com/ClickHouse/ClickHouse/issues/93233) 中引入的优化。[#93827](https://github.com/ClickHouse/ClickHouse/pull/93827)（[Amos Bird](https://github.com/amosbird)）。
* 移除对“Bad version”的处理。[#93843](https://github.com/ClickHouse/ClickHouse/pull/93843)（[Anton Ivashkin](https://github.com/ianton-ru)）。
* 修复键为有符号整数类型时，`optimize_inverse_dictionary_lookup` 无法用于分布式查询的问题。关闭 [#93259](https://github.com/ClickHouse/ClickHouse/issues/93259)。[#93848](https://github.com/ClickHouse/ClickHouse/pull/93848)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 修复 `lag`/`lead` 无法用于分布式 `remote()` 查询的问题。关闭 [#90014](https://github.com/ClickHouse/ClickHouse/issues/90014)。[#93858](https://github.com/ClickHouse/ClickHouse/pull/93858)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 修复系统插桩分发错误。[#93937](https://github.com/ClickHouse/ClickHouse/pull/93937)（[Pablo Marcos](https://github.com/pamarcos)）。
* 在 https://github.com/ClickHouse/ClickHouse/pull/89173 中，我们向 `TraceSender` 通过内部管道发送的结构体添加了一个额外字段，但没有相应更新缓冲区大小（见[此处](https://github.com/ClickHouse/ClickHouse/pull/89173/changes#diff-36ecfac5cde34c92c031652d8a77f0d12782cd5d43e68d6ef159e6d46a54224fL44)）。因此，写入缓冲区的数据量超过了 `buffer_size`，导致多次刷新。由于 `TraceSender::send` 会从不同线程调用，各线程的刷新可能相互交错，从而破坏接收端（`TraceCollector`）所依赖的不变量。[#93966](https://github.com/ClickHouse/ClickHouse/pull/93966)（[Miсhael Stetsyuk](https://github.com/mstetsyuk)）。
* 修复存储 `Join` 使用 `USING` 子句执行 JOIN 操作时向公共超类型转换的问题。修复 [#91672](https://github.com/ClickHouse/ClickHouse/issues/91672)。修复 [#78572](https://github.com/ClickHouse/ClickHouse/issues/78572)。[#94000](https://github.com/ClickHouse/ClickHouse/pull/94000)（[Dmitry Novik](https://github.com/novikd)）。
* 修复在 Merge 表上应用 JOIN 运行时过滤器时未正确添加 FilterStep 的问题。[#94021](https://github.com/ClickHouse/ClickHouse/pull/94021)（[Alexander Gololobov](https://github.com/davenger)）。
* 当 `SELECT` 查询包含针对多个列的谓词、这些列具有布隆过滤器跳数索引，并且同时存在 `OR` 和 `NOT` 条件时，可能返回不一致的结果。现已修复。[#94026](https://github.com/ClickHouse/ClickHouse/pull/94026)（[Shankar Iyer](https://github.com/shankar-iyer)）。
* 修复存在依赖索引时执行 CLEAR COLUMN 的问题。[#94057](https://github.com/ClickHouse/ClickHouse/pull/94057)（[Raúl Marín](https://github.com/Algunenano)）。
* 修复 `ReadWriteBufferFromHTTP` 中使用未初始化值的问题。[#94058](https://github.com/ClickHouse/ClickHouse/pull/94058)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 JSON 中类型化路径的错误检查。该检查在 https://github.com/ClickHouse/ClickHouse/pull/92842 中引入，可能导致已有表在启动时出错。[#94070](https://github.com/ClickHouse/ClickHouse/pull/94070)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复存在 OUTER JOIN 时在过滤器分析过程中发生的崩溃。修复 [#90979](https://github.com/ClickHouse/ClickHouse/issues/90979)。[#94080](https://github.com/ClickHouse/ClickHouse/pull/94080)（[Dmitry Novik](https://github.com/novikd)）。
* 修复 `uniqTheta` 并行使用 UInt8 聚合键时的准确性问题（`max_threads` > 1，即默认设置）。[#94095](https://github.com/ClickHouse/ClickHouse/pull/94095)（[Azat Khuzhin](https://github.com/azat)）。
* 修复 `socket.setBlocking(true)` 调用在 `SCOPE_EXIT` 内抛出异常所导致的崩溃。[#94100](https://github.com/ClickHouse/ClickHouse/pull/94100)（[Miсhael Stetsyuk](https://github.com/mstetsyuk)）。
* 修复 ReplicatedMergeTree 中 `DROP PARTITION` 删除由后续日志条目创建的数据片段而造成数据丢失的问题。[#94123](https://github.com/ClickHouse/ClickHouse/pull/94123)（[Tuan Pham Anh](https://github.com/tuanpach)）。
* 修复 Parquet reader v3 对跨页边界数组的错误处理。例如，Arrow 写入文件时未启用页统计信息或页索引，就会出现此问题。仅影响 Array 数据类型的列。常见症状是每约 1 MB 数据中有一个数组被截断。在此修复之前，可使用以下设置作为规避方案：`input_format_parquet_use_native_reader_v3 = 0`。[#94125](https://github.com/ClickHouse/ClickHouse/pull/94125)（[Michael Kolupaev](https://github.com/al13n321)）。
* 修复 ReplicatedMergeTree 等待日志条目期间设置过多 watch 的问题。[#94133](https://github.com/ClickHouse/ClickHouse/pull/94133)（[Azat Khuzhin](https://github.com/azat)）。
* 函数 `arrayShuffle`、`arrayPartialShuffle` 和 `arrayRandomSample` 现在会物化常量列，使不同的行得到不同结果。[#94134](https://github.com/ClickHouse/ClickHouse/pull/94134)（[Joanna Hulboj](https://github.com/jh0x)）。
* 修复物化视图中计算表函数时的数据竞争。[#94171](https://github.com/ClickHouse/ClickHouse/pull/94171)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 `PostgreSQL` 数据库引擎中的空指针解引用（查询不正确时）。关闭 [#92887](https://github.com/ClickHouse/ClickHouse/issues/92887)。[#94180](https://github.com/ClickHouse/ClickHouse/pull/94180)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复可刷新物化视图使用包含多个子查询的 `SELECT` 查询时发生的内存泄漏。[#94200](https://github.com/ClickHouse/ClickHouse/pull/94200)（[Antonio Andelic](https://github.com/antonio2368)）。
* 修复 `DataPartStorageOnDiskBase::remove` 与 `system.parts` 之间的数据竞争。关闭 [#49076](https://github.com/ClickHouse/ClickHouse/issues/49076)。[#94262](https://github.com/ClickHouse/ClickHouse/pull/94262)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 移除 HashTable 复制赋值运算符上错误的 `noexcept` 说明符，该说明符可能在发生内存异常时导致崩溃（`std::terminate`）。[#94275](https://github.com/ClickHouse/ClickHouse/pull/94275)（[Nikita Taranov](https://github.com/nickitat)）。
* 此前，创建在 GROUP BY 中包含重复列（例如 `GROUP BY c0, c0`）的 projection 并插入数据会导致 `std::length_error`，前提是启用了 `optimize_row_order`。关闭 [#94065](https://github.com/ClickHouse/ClickHouse/issues/94065)。[#94277](https://github.com/ClickHouse/ClickHouse/pull/94277)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 ZooKeeper 客户端连接时一个隐蔽的错误，该错误会导致卡住和崩溃。[#94320](https://github.com/ClickHouse/ClickHouse/pull/94320)（[Azat Khuzhin](https://github.com/azat)）。
* 修复函数到子列优化未应用于子列的问题。[#94323](https://github.com/ClickHouse/ClickHouse/pull/94323)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复启用 `enable_lazy_columns_replication` 时，嵌套 RIGHT JOIN 可能返回错误结果的问题。该错误会导致复制列中的所有行错误地返回同一个值，而不是各自不同的值。关闭 [#93891](https://github.com/ClickHouse/ClickHouse/issues/93891)。[#94339](https://github.com/ClickHouse/ClickHouse/pull/94339)（[Vladimir Cherkasov](https://github.com/vdimir)）。
* 修复使用等价集合时 SEMI JOIN 的过滤器下推。如果参数类型发生变化，则不再下推过滤器。修复 [#93264](https://github.com/ClickHouse/ClickHouse/issues/93264)。[#94340](https://github.com/ClickHouse/ClickHouse/pull/94340)（[Dmitry Novik](https://github.com/novikd)）。
* 修复 DataLake 数据库引擎（Delta Lake catalog 集成）使用 DeltaLake CDF 的问题。关闭 [#94122](https://github.com/ClickHouse/ClickHouse/issues/94122)。[#94342](https://github.com/ClickHouse/ClickHouse/pull/94342)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复当前指标 `FilesystemCacheSizeLimit` 在使用 `SLRU` 缓存策略时取值不正确的问题。[#94363](https://github.com/ClickHouse/ClickHouse/pull/94363)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 现在，使用少于两个参数创建 Backup 数据库引擎时，会返回更具描述性的错误消息（`Wrong number of arguments`，而不是 `std::out_of_range: InlinedVector::at(size_type) const failed bounds check.`）。[#94374](https://github.com/ClickHouse/ClickHouse/pull/94374)（[Robert Schulze](https://github.com/rschu1ze)）。
* 对带有授权选项的权限，忽略在数据库级别撤销全局权限这种无法执行的操作。[#94386](https://github.com/ClickHouse/ClickHouse/pull/94386)（[pufit](https://github.com/pufit)）。
* 修复从 Compact 数据片段读取稀疏偏移量的问题。关闭 [#94385](https://github.com/ClickHouse/ClickHouse/issues/94385)。[#94399](https://github.com/ClickHouse/ClickHouse/pull/94399)（[Pavel Kruglov](https://github.com/Avogar)）。
* 即使 `alter_column_secondary_index_mode` 使用 `throw` 模式，也不再阻止对使用隐式索引的列执行 ALTER。[#94425](https://github.com/ClickHouse/ClickHouse/pull/94425)（[Raúl Marín](https://github.com/Algunenano)）。
* 修复 `TCPHandler` 在多次调用 `receivePacketsExpectQuery` 读取 `Protocol::Client::IgnoredPartUUIDs` 时发生崩溃的问题。[#94434](https://github.com/ClickHouse/ClickHouse/pull/94434)（[Miсhael Stetsyuk](https://github.com/mstetsyuk)）。
* 修复 `system.functions` 中敏感数据的脱敏问题。[#94436](https://github.com/ClickHouse/ClickHouse/pull/94436)（[Vitaly Baranov](https://github.com/vitlibar)）。
* 修复禁用 `send_profile_events` 时的空指针解引用问题。该功能最近为 ClickHouse Python 驱动引入。关闭 [#92488](https://github.com/ClickHouse/ClickHouse/issues/92488)。[#94466](https://github.com/ClickHouse/ClickHouse/pull/94466)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复合并期间文本索引 .mrk 文件不兼容的问题。[#94494](https://github.com/ClickHouse/ClickHouse/pull/94494)（[Peng Jian](https://github.com/fastio)）。
* 启用 `read_in_order_use_virtual_row` 时，代码会根据完整主键大小访问索引列，却没有检查索引是否已被截断，从而导致释放后使用或读取未初始化内存。关闭 [#85596](https://github.com/ClickHouse/ClickHouse/issues/85596)。[#94500](https://github.com/ClickHouse/ClickHouse/pull/94500)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复通过 GLOBAL IN 为子查询发送外部表时，若类型为 Nullable，会因类型不匹配而出错的问题。关闭 [#94097](https://github.com/ClickHouse/ClickHouse/issues/94097)。[#94511](https://github.com/ClickHouse/ClickHouse/pull/94511)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 在以前的版本中，对同一表达式包含多个索引条件的查询可能错误地抛出 `Not found column` 异常。关闭 [#60660](https://github.com/ClickHouse/ClickHouse/issues/60660)。[#94515](https://github.com/ClickHouse/ClickHouse/pull/94515)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复运行时过滤器对 Nullable JOIN 列的错误处理。[#94555](https://github.com/ClickHouse/ClickHouse/pull/94555)（[Alexander Gololobov](https://github.com/davenger)）。
* 在另一个当前正被使用的 workload 中创建 workload 不再导致崩溃。[#94599](https://github.com/ClickHouse/ClickHouse/pull/94599)（[Sergei Trifonov](https://github.com/serxa)）。
* 修复 ANY LEFT JOIN 优化期间，在缺失列上计算 `isNotNull` 时发生的崩溃。[#94600](https://github.com/ClickHouse/ClickHouse/pull/94600)（[Molly](https://github.com/ggmolly)）。
* 修复引用其他具有计算型默认值的列时，默认表达式的计算问题。[#94615](https://github.com/ClickHouse/ClickHouse/pull/94615)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 BACKUP/RESTORE 操作中的权限问题。[#94617](https://github.com/ClickHouse/ClickHouse/pull/94617)（[Pablo Marcos](https://github.com/pamarcos)）。
* 修复数据类型为 `Nullable(DateTime64)` 时错误类型转换所导致的崩溃。[#94627](https://github.com/ClickHouse/ClickHouse/pull/94627)（[Miсhael Stetsyuk](https://github.com/mstetsyuk)）。
* 修复某些带有 `ORDER BY` 的分布式查询可能返回值对调的 `ALIAS` 列的问题（即列 `a` 显示列 `b` 的数据，反之亦然）。[#94644](https://github.com/ClickHouse/ClickHouse/pull/94644)（[filimonov](https://github.com/filimonov)）。
* 修复将 keeper-bench 的结果保存到文件的问题。[#94654](https://github.com/ClickHouse/ClickHouse/pull/94654)（[Antonio Andelic](https://github.com/antonio2368)）。
* 修复列中包含负浮点值时 MinMax 类型统计信息的估算不正确问题。[#94665](https://github.com/ClickHouse/ClickHouse/pull/94665)（[zoomxi](https://github.com/zoomxi)）。
* 修复 Map 的键为 Struct 时读取 Parquet 文件的问题。[#94670](https://github.com/ClickHouse/ClickHouse/pull/94670)（[Konstantin Vedernikov](https://github.com/scanhex12)）。
* 修复使用复杂 ON 条件时 RIGHT JOIN 可能返回错误结果的问题。关闭 [#92913](https://github.com/ClickHouse/ClickHouse/issues/92913)。[#94680](https://github.com/ClickHouse/ClickHouse/pull/94680)（[Vladimir Cherkasov](https://github.com/vdimir)）。
* 在 Vertical 合并后保留固定索引粒度（use_const_adaptive_granularity）。[#94725](https://github.com/ClickHouse/ClickHouse/pull/94725)（[Azat Khuzhin](https://github.com/azat)）。
* 修复涉及标量子查询和表依赖关系的 mutation 错误。如果某个表在一列上存在依赖项（索引或 projection），标量子查询可能在没有数据的情况下被计算并缓存，从而导致错误变更。[#94731](https://github.com/ClickHouse/ClickHouse/pull/94731)（[Raúl Marín](https://github.com/Algunenano)）。
* 修复 AsynchronousMetrics 在发生错误时对 cpu_pressure 的回退处理。[#94827](https://github.com/ClickHouse/ClickHouse/pull/94827)（[Raúl Marín](https://github.com/Algunenano)）。
* `getURLHostRFC` 函数在解引用指针前缺少边界检查。向 `domainRFC` 传入空字符串时，它会读取未初始化内存并触发 MSan 错误。[#94851](https://github.com/ClickHouse/ClickHouse/pull/94851)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复加密磁盘的只读属性。[#94852](https://github.com/ClickHouse/ClickHouse/pull/94852)（[Azat Khuzhin](https://github.com/azat)）。
* 修复使用旧分析器查询 Distributed 表时，小数 `LIMIT/OFFSET` 引发的逻辑错误。关闭 [#94712](https://github.com/ClickHouse/ClickHouse/issues/94712)。[#94999](https://github.com/ClickHouse/ClickHouse/pull/94999)（[Ahmed Gouda](https://github.com/0xgouda)）。
* 修复默认启用 JOIN 运行时过滤器时，在某些条件下发生的崩溃。[#95000](https://github.com/ClickHouse/ClickHouse/pull/95000)（[Alexander Gololobov](https://github.com/davenger)）。
* 改进表引擎 `URL()` 和表函数 `url()` 所用 URL 中的密码脱敏。[#95006](https://github.com/ClickHouse/ClickHouse/pull/95006)（[Vitaly Baranov](https://github.com/vitlibar)）。
* 函数 `toStartOfInterval` 现在与 `toStartOfX` 的行为一致，其中 `X` 为 `Day, Week, Month, Quarter, Year`；此行为在启用 `enable_extended_results_for_datetime_functions` 时生效。[#95011](https://github.com/ClickHouse/ClickHouse/pull/95011)（[Kirill Kopnev](https://github.com/Fgrtue)）。
* 修复常量字符串比较未遵循设置 `cast_string_to_date_time_mode`、`bool_true_representation`、`bool_false_representation` 和 `input_format_null_as_default` 的问题。关闭 [#91681](https://github.com/ClickHouse/ClickHouse/issues/91681)。[#95040](https://github.com/ClickHouse/ClickHouse/pull/95040)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 修复文件系统缓存中的数据竞争。[#95064](https://github.com/ClickHouse/ClickHouse/pull/95064)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 Parquet reader 中一个罕见的竞态条件。[#95068](https://github.com/ClickHouse/ClickHouse/pull/95068)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 `LIMIT` 为零时 top K 优化发生崩溃的问题。关闭 [#93893](https://github.com/ClickHouse/ClickHouse/issues/93893)。[#95072](https://github.com/ClickHouse/ClickHouse/pull/95072)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 从 DateTime/整数转换到 Time64 时，会使用 `toTime` 提取当日时间分量，而该函数并非单调函数。`ToDateTimeMonotonicity` 模板错误地将此转换声明为单调转换，导致调试版本中出现“Invalid binary search result in MergeTreeSetIndex”异常。[#95125](https://github.com/ClickHouse/ClickHouse/pull/95125)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 仅在必要时重新创建 manifest 文件条目列表（此前每次迭代都会重新创建）。[#95162](https://github.com/ClickHouse/ClickHouse/pull/95162)（[Daniil Ivanik](https://github.com/divanik)）。

#### 构建/测试/打包改进
* 添加一组工具，利用 jemalloc 的堆分析能力，对 ClickHouse SQL 解析器中的内存分配进行分析。[#94072](https://github.com/ClickHouse/ClickHouse/pull/94072)（[Ilya Yatsishin](https://github.com/qoega)）。
* 添加了一个用于简化解析器内存分配调试的工具。该工具在将查询解析为 AST 表示之前和之后使用 jemalloc 的 `stats.allocated` 指标，以展示分配了哪些内容。它还支持内存分析模式，可在操作前后转储分析数据，以生成展示内存分配位置的报告。[#93523](https://github.com/ClickHouse/ClickHouse/pull/93523)（[Ilya Yatsishin](https://github.com/qoega)）。
* 移除对 libc++ 头文件的传递性包含。[#92523](https://github.com/ClickHouse/ClickHouse/pull/92523)（[Raúl Marín](https://github.com/Algunenano)）。
* 将部分串行测试改为并行测试：https://github.com/ClickHouse/ClickHouse/pull/93030/changes#diff-c3a73510dae653c9bbfa24300b32f5d6ec663fd4e72cc4a3d5daa6e4342915df. [#93030](https://github.com/ClickHouse/ClickHouse/pull/93030)（[Nikita Fomichev](https://github.com/fm4v)）。
* 清理部分构建标志。[#93679](https://github.com/ClickHouse/ClickHouse/pull/93679)（[Raúl Marín](https://github.com/Algunenano)）。
* 将 c-ares 从 v1.34.5 升级到 v1.34.6。此更新解决了 c-ares 的 `CVE-2025-62408`，但该漏洞与 ClickHouse 无关。[#94129](https://github.com/ClickHouse/ClickHouse/pull/94129)（[Govind R Nair](https://github.com/Revertionist)）。
* 使用 `curl` 8.18.0。[#94742](https://github.com/ClickHouse/ClickHouse/pull/94742)（[Konstantin Bogdanov](https://github.com/thevar1able)）。
