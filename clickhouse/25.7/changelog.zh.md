<h3 id="257">
  ClickHouse 25.7 版本, 2025-07-24
</h3>

#### 向后不兼容变更

* 修改 `extractKeyValuePairs` 函数：引入新参数 `unexpected_quoting_character_strategy`，控制读取未加引号的键或值时意外遇到 `quoting_character` 的行为。可选值为 `invalid`、`accept` 或 `promote`。invalid 会丢弃当前键并回到等待键的状态；accept 会将该字符视为键的一部分；promote 会丢弃此前的字符，开始按带引号的键解析。此外，解析完带引号的值之后，只有找到键值对分隔符才解析下一个键。 [#80657](https://github.com/ClickHouse/ClickHouse/pull/80657) ([Arthur Passos](https://github.com/arthurpassos)).
* `countMatches` 函数支持零字节匹配。希望保留旧行为的用户可启用设置 `count_matches_stop_at_empty_match`。 [#81676](https://github.com/ClickHouse/ClickHouse/pull/81676) ([Elmi Ahmadov](https://github.com/ahmadov)).
* 生成 BACKUP 时，除专用服务器设置（`max_backup_bandwidth_for_server`、`max_mutations_bandwidth_for_server` 和 `max_merges_bandwidth_for_server`）外，还使用服务器级本地限速器（`max_local_read_bandwidth_for_server` 和 `max_local_write_bandwidth_for_server`）及远程限速器（`max_remote_read_network_bandwidth_for_server` 和 `max_remote_write_network_bandwidth_for_server`）。 [#81753](https://github.com/ClickHouse/ClickHouse/pull/81753) ([Sergei Trifonov](https://github.com/serxa)).
* 禁止创建没有可插入列的表。 [#81835](https://github.com/ClickHouse/ClickHouse/pull/81835) ([Pervakov Grigorii](https://github.com/GrigoryPervakov)).
* 集群函数按归档内的文件并行处理。此前，整个归档（如 zip、tar 或 7z）是一个工作单元。新增设置 `cluster_function_process_archive_on_multiple_nodes`，默认值为 `true`。设为 `true` 时，可提高集群函数处理归档的性能。如果旧版本已使用集群函数处理归档，在升级至 25.7 及以后版本时，应设为 `false`，以保证兼容并避免错误。 [#82355](https://github.com/ClickHouse/ClickHouse/pull/82355) ([Kseniia Sumarokova](https://github.com/kssenii)).
* `SYSTEM RESTART REPLICAS` 查询此前会唤醒 Lazy 数据库中的表，即使用户没有该数据库的访问权限，而且可能发生在这些表正被并发删除时。注意：现在 `SYSTEM RESTART REPLICAS` 仅重启用户具有 `SHOW TABLES` 权限的数据库中的副本，这是合理的行为。 [#83321](https://github.com/ClickHouse/ClickHouse/pull/83321) ([Alexey Milovidov](https://github.com/alexey-milovidov)).

#### 新功能

* `MergeTree` 系列表新增轻量级更新支持，可通过新语法 `UPDATE <table> SET col1 = val1, col2 = val2, ... WHERE <condition>` 使用。同时实现了基于轻量级更新的轻量级删除，可通过设置 `lightweight_delete_mode = 'lightweight_update'` 启用。 [#82004](https://github.com/ClickHouse/ClickHouse/pull/82004) ([Anton Popov](https://github.com/CurtizJ)).
* Iceberg 结构演进支持复杂类型。 [#73714](https://github.com/ClickHouse/ClickHouse/pull/73714) ([Konstantin Vedernikov](https://github.com/scanhex12)).
* 引入对 Iceberg 表执行 INSERT 的支持。 [#82692](https://github.com/ClickHouse/ClickHouse/pull/82692) ([Konstantin Vedernikov](https://github.com/scanhex12)).
* 按字段 ID 读取 Iceberg 数据文件，改善与 Iceberg 的兼容性：元数据中的字段可以重命名，同时映射到底层 Parquet 文件中的不同名称。解决了 [#83065](https://github.com/ClickHouse/ClickHouse/issues/83065)。 [#83653](https://github.com/ClickHouse/ClickHouse/pull/83653) ([Konstantin Vedernikov](https://github.com/scanhex12)).
* ClickHouse 现在支持 Iceberg 的压缩 `metadata.json` 文件。修复了 [#70874](https://github.com/ClickHouse/ClickHouse/issues/70874)。 [#81451](https://github.com/ClickHouse/ClickHouse/pull/81451) ([alesapin](https://github.com/alesapin)).
* Glue 目录支持 `TimestampTZ`。解决了 [#81654](https://github.com/ClickHouse/ClickHouse/issues/81654)。 [#83132](https://github.com/ClickHouse/ClickHouse/pull/83132) ([Konstantin Vedernikov](https://github.com/scanhex12)).
* 为 ClickHouse 客户端添加 AI 驱动的 SQL 生成功能。现在可以在输入前加上 `??`，根据自然语言描述生成 SQL 查询。支持 OpenAI 和 Anthropic 提供商，并自动发现表结构。 [#83314](https://github.com/ClickHouse/ClickHouse/pull/83314) ([Kaushik Iska](https://github.com/iskakaushik)).
* 添加将地理类型写入 WKB 格式的函数。 [#82935](https://github.com/ClickHouse/ClickHouse/pull/82935) ([Konstantin Vedernikov](https://github.com/scanhex12)).
* 为数据源引入两种新访问类型 `READ` 和 `WRITE`，并弃用此前所有数据源相关访问类型。此前使用 `GRANT S3 ON *.* TO user`，现在使用 `GRANT READ, WRITE ON S3 TO user`。这也允许分别授予数据源的 `READ` 和 `WRITE` 权限，例如 `GRANT READ ON * TO user`、`GRANT WRITE ON S3 TO user`。此功能由设置 `access_control_improvements.enable_read_write_grants` 控制，默认禁用。 [#73659](https://github.com/ClickHouse/ClickHouse/pull/73659) ([pufit](https://github.com/pufit)).
* NumericIndexedVector：采用位切片和 Roaring 位图压缩的新向量数据结构，配套提供 20 多个构建、分析和逐点算术函数。可减少存储量，加快稀疏数据上的 JOIN、筛选和聚合。实现了 [#70582](https://github.com/ClickHouse/ClickHouse/issues/70582)，以及 T. Xiong 和 Y. Wang 在 VLDB 2024 发表的论文[《在线对照实验平台中的大规模指标计算》](https://arxiv.org/abs/2405.08411)。 [#74193](https://github.com/ClickHouse/ClickHouse/pull/74193) ([FriendLey](https://github.com/FriendLey)).
* 现在支持工作负载设置 `max_waiting_queries`，可限制查询队列大小。达到上限后，所有后续查询都会以 `SERVER_OVERLOADED` 错误终止。 [#81250](https://github.com/ClickHouse/ClickHouse/pull/81250) ([Oleg Doronin](https://github.com/dorooleg)).
* 新增金融函数：`financialInternalRateOfReturnExtended`（`XIRR`）、`financialInternalRateOfReturn`（`IRR`）、`financialNetPresentValueExtended`（`XNPV`）、`financialNetPresentValue`（`NPV`）。 [#81599](https://github.com/ClickHouse/ClickHouse/pull/81599) ([Joanna Hulboj](https://github.com/jh0x)).
* 新增地理空间函数 `polygonsIntersectCartesian` 和 `polygonsIntersectSpherical`，用于检查两个多边形是否相交。 [#81882](https://github.com/ClickHouse/ClickHouse/pull/81882) ([Paul Lamb](https://github.com/plamb)).
* MergeTree 系列表支持 `_part_granule_offset` 虚拟列，表示每行在其数据片段中所属数据粒度/标记的从零开始的索引。解决了 [#79572](https://github.com/ClickHouse/ClickHouse/issues/79572)。  [#82341](https://github.com/ClickHouse/ClickHouse/pull/82341) ([Amos Bird](https://github.com/amosbird)). [#82341](https://github.com/ClickHouse/ClickHouse/pull/82341) ([Amos Bird](https://github.com/amosbird))
* 新增 SQL 函数 `colorSRGBToOkLCH` 和 `colorOkLCHToSRGB`，用于在 sRGB 和 OkLCH 色彩空间之间转换颜色。 [#83679](https://github.com/ClickHouse/ClickHouse/pull/83679) ([Fgrtue](https://github.com/Fgrtue)).
* 允许在 `CREATE USER` 查询中为用户名使用参数。 [#81387](https://github.com/ClickHouse/ClickHouse/pull/81387) ([Diskein](https://github.com/Diskein)).
* `system.formats` 表现在包含格式的扩展信息，例如 HTTP 内容类型、结构推断能力等。 [#81505](https://github.com/ClickHouse/ClickHouse/pull/81505) ([Alexey Milovidov](https://github.com/alexey-milovidov)).

#### 实验性功能

* 新增 `searchAny` 和 `searchAll` 函数，作为搜索文本索引的通用工具。 [#80641](https://github.com/ClickHouse/ClickHouse/pull/80641) ([Elmi Ahmadov](https://github.com/ahmadov)).
* 文本索引现在支持新的 `split` 分词器。 [#81752](https://github.com/ClickHouse/ClickHouse/pull/81752) ([Elmi Ahmadov](https://github.com/ahmadov)).
* 将 `text` 索引的默认索引粒度改为 64，以改善内部基准测试中平均测试查询的预期性能。 [#82162](https://github.com/ClickHouse/ClickHouse/pull/82162) ([Jimmy Aguilar Mena](https://github.com/Ergus)).
* 256 位位图按序存储状态的出边标签，但出边状态写入磁盘时采用它们在哈希表中的出现顺序。因此，从磁盘读取时，标签会指向错误的下一状态。 [#82783](https://github.com/ClickHouse/ClickHouse/pull/82783) ([Elmi Ahmadov](https://github.com/ahmadov)).
* 为文本索引中的 FST 树二进制数据启用 zstd 压缩。 [#83093](https://github.com/ClickHouse/ClickHouse/pull/83093) ([Elmi Ahmadov](https://github.com/ahmadov)).
* 将向量相似度索引提升为 Beta。引入别名设置 `enable_vector_similarity_index`，使用向量相似度索引前必须启用该设置。 [#83459](https://github.com/ClickHouse/ClickHouse/pull/83459) ([Robert Schulze](https://github.com/rschu1ze)).
* 移除与实验性零拷贝复制有关的实验性 `send_metadata` 逻辑。该逻辑从未被使用，也没有人维护这段代码。由于甚至没有相关测试，很可能早已损坏。 [#82508](https://github.com/ClickHouse/ClickHouse/pull/82508) ([alesapin](https://github.com/alesapin)).
* 将 `StorageKafka2` 集成到 `system.kafka_consumers`。 [#82652](https://github.com/ClickHouse/ClickHouse/pull/82652) ([János Benjamin Antal](https://github.com/antaljanosbenjamin)).
* 通过统计信息估计复杂的 CNF/DNF，例如 `(a < 1 and a > 0) or b = 3`。 [#82663](https://github.com/ClickHouse/ClickHouse/pull/82663) ([Han Fei](https://github.com/hanfei1991)).

#### 性能改进

* 引入异步日志。日志输出到慢速设备时，不再延迟查询。限制队列中保留的最大条目数。  [#82516](https://github.com/ClickHouse/ClickHouse/pull/82516) ([Raúl Marín](https://github.com/Algunenano)). [#83214](https://github.com/ClickHouse/ClickHouse/pull/83214) ([Raúl Marín](https://github.com/Algunenano))。
* 默认启用并行分布式 INSERT SELECT，采用各分片独立执行 INSERT SELECT 的模式，参见设置 `parallel_distributed_insert_select`。 [#83040](https://github.com/ClickHouse/ClickHouse/pull/83040) ([Igor Nikonov](https://github.com/devcrafter)).
* 聚合查询仅包含一个针对非 `Nullable` 列的 `count()` 函数时，会在哈希表探测期间完整内联聚合逻辑，避免分配和维护任何聚合状态，显著减少内存使用和 CPU 开销。部分解决了 [#81982](https://github.com/ClickHouse/ClickHouse/issues/81982)。 [#82104](https://github.com/ClickHouse/ClickHouse/pull/82104) ([Amos Bird](https://github.com/amosbird)).
* 优化 `HashJoin` 性能：在仅有一个键列的常见情况下，移除对哈希表的额外遍历；当 `null_map` 和 `join_mask` 检查恒为 `true`/`false` 时，也将其消除。 [#82308](https://github.com/ClickHouse/ClickHouse/pull/82308) ([Nikita Taranov](https://github.com/nickitat)).
* 对 `-If` 组合器进行小幅优化。 [#78454](https://github.com/ClickHouse/ClickHouse/pull/78454) ([李扬](https://github.com/taiyang-li)).
* 通过减少存储读取和 CPU 使用，降低使用向量相似度索引的向量搜索查询延迟。 [#79103](https://github.com/ClickHouse/ClickHouse/pull/79103) ([Shankar Iyer](https://github.com/shankar-iyer)).
* 在 `filterPartsByQueryConditionCache` 中遵循 `merge_tree_min_{rows,bytes}_for_seek`，与其他基于索引筛选的方法保持一致。 [#80312](https://github.com/ClickHouse/ClickHouse/pull/80312) ([李扬](https://github.com/taiyang-li)).
* 使 `TOTALS` 步骤之后的流水线采用多线程。 [#80331](https://github.com/ClickHouse/ClickHouse/pull/80331) ([UnamedRus](https://github.com/UnamedRus)).
* 修复 `Redis` 和 `KeeperMap` 存储按键筛选的问题。 [#81833](https://github.com/ClickHouse/ClickHouse/pull/81833) ([Pervakov Grigorii](https://github.com/GrigoryPervakov)).
* 新增设置 `min_joined_block_size_rows`（类似于 `min_joined_block_size_bytes`，默认值为 65409），控制 JOIN 输入和输出数据块的最小行数（如果所用 JOIN 算法支持）。小数据块会被合并。 [#81886](https://github.com/ClickHouse/ClickHouse/pull/81886) ([Nikita Taranov](https://github.com/nickitat)).
* `ATTACH PARTITION` 不再导致所有缓存被清除。 [#82377](https://github.com/ClickHouse/ClickHouse/pull/82377) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 利用等价类移除冗余 JOIN 操作，优化相关子查询生成的执行计划。若所有相关列都存在等价表达式，启用 `query_plan_correlated_subqueries_use_substitution` 后不会生成 `CROSS JOIN`。 [#82435](https://github.com/ClickHouse/ClickHouse/pull/82435) ([Dmitry Novik](https://github.com/novikd)).
* 相关子查询作为函数 `EXISTS` 的参数时，仅读取必需列。 [#82443](https://github.com/ClickHouse/ClickHouse/pull/82443) ([Dmitry Novik](https://github.com/novikd)).
* 小幅加快查询分析期间查询树的比较。 [#82617](https://github.com/ClickHouse/ClickHouse/pull/82617) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 在 ProfileEvents 的 Counter 中添加对齐，减少伪共享。 [#82697](https://github.com/ClickHouse/ClickHouse/pull/82697) ([Jiebin Sun](https://github.com/jiebinn)).
* 将 [#82308](https://github.com/ClickHouse/ClickHouse/issues/82308) 中针对 `null_map` 和 `JoinMask` 的优化应用于含多个析取项的 JOIN，同时优化 `KnownRowsHolder` 数据结构。 [#83041](https://github.com/ClickHouse/ClickHouse/pull/83041) ([Nikita Taranov](https://github.com/nickitat)).
* JOIN 标志使用普通 `std::vector<std::atomic_bool>`，避免每次访问标志时计算哈希。 [#83043](https://github.com/ClickHouse/ClickHouse/pull/83043) ([Nikita Taranov](https://github.com/nickitat)).
* `HashJoin` 使用 `lazy` 输出模式时，不再预先为结果列分配内存。原先的做法并不理想，尤其在匹配数量较少时。此外，JOIN 完成后可以得知精确匹配数量，从而更准确地预分配内存。 [#83304](https://github.com/ClickHouse/ClickHouse/pull/83304) ([Nikita Taranov](https://github.com/nickitat)).
* 尽量减少流水线构建期间端口数据块头中的内存复制。原始 [PR](https://github.com/ClickHouse/ClickHouse/pull/70105) 由 [heymind](https://github.com/heymind) 提交。 [#83381](https://github.com/ClickHouse/ClickHouse/pull/83381) ([Raúl Marín](https://github.com/Algunenano)).
* 改进使用 RocksDB 存储时 clickhouse-keeper 的启动。 [#83390](https://github.com/ClickHouse/ClickHouse/pull/83390) ([Antonio Andelic](https://github.com/antonio2368)).
* 创建存储快照数据时避免持锁，减少高并发负载下的锁竞争。 [#83510](https://github.com/ClickHouse/ClickHouse/pull/83510) ([Duc Canh Le](https://github.com/canhld94)).
* 未发生解析错误时复用序列化器，提高 `ProtobufSingle` 输入格式的性能。 [#83613](https://github.com/ClickHouse/ClickHouse/pull/83613) ([Eduard Karacharov](https://github.com/korowa)).
* 提高流水线构建性能，从而加快短查询。 [#83631](https://github.com/ClickHouse/ClickHouse/pull/83631) ([Raúl Marín](https://github.com/Algunenano)).
* 优化 `MergeTreeReadersChain::getSampleBlock`，从而加快短查询。 [#83875](https://github.com/ClickHouse/ClickHouse/pull/83875) ([Raúl Marín](https://github.com/Algunenano)).
* 通过异步请求加快数据目录中的表列举。 [#81084](https://github.com/ClickHouse/ClickHouse/pull/81084) ([alesapin](https://github.com/alesapin)).
* 启用 `s3_slow_all_threads_after_network_error` 配置时，为 S3 重试机制引入随机抖动。 [#81849](https://github.com/ClickHouse/ClickHouse/pull/81849) ([zoomxi](https://github.com/zoomxi)).

#### 改进

* 使用多种颜色显示括号，提高可读性。 [#82538](https://github.com/ClickHouse/ClickHouse/pull/82538) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 输入时高亮显示 LIKE/REGEXP 模式中的元字符。此前 `clickhouse-format` 和 `clickhouse-client` 的回显已支持，现在命令提示符中也支持。 [#82871](https://github.com/ClickHouse/ClickHouse/pull/82871) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* `clickhouse-format` 和客户端回显中的高亮行为将与命令行提示符一致。 [#82874](https://github.com/ClickHouse/ClickHouse/pull/82874) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 现在允许使用 `plain_rewritable` 磁盘存储数据库元数据。在 `plain_rewritable` 中实现 `moveFile` 和 `replaceFile` 方法，以支持将其用作数据库磁盘。 [#79424](https://github.com/ClickHouse/ClickHouse/pull/79424) ([Tuan Pham Anh](https://github.com/tuanpach)).
* 允许备份 `PostgreSQL`、`MySQL` 和 `DataLake` 数据库。此类数据库的备份仅保存定义，不包含其中的数据。 [#79982](https://github.com/ClickHouse/ClickHouse/pull/79982) ([Nikolay Degterinsky](https://github.com/evillique)).
* 设置 `allow_experimental_join_condition` 标记为弃用，因为现在始终允许该功能。 [#80566](https://github.com/ClickHouse/ClickHouse/pull/80566) ([Vladimir Cherkasov](https://github.com/vdimir)).
* 向 ClickHouse 异步指标添加压力指标。 [#80779](https://github.com/ClickHouse/ClickHouse/pull/80779) ([Xander Garbett](https://github.com/Garbett1)).
* 新增指标 `MarkCacheEvictedBytes`、`MarkCacheEvictedMarks` 和 `MarkCacheEvictedFiles`，跟踪标记缓存的淘汰。（问题 [#60989](https://github.com/ClickHouse/ClickHouse/issues/60989)）。 [#80799](https://github.com/ClickHouse/ClickHouse/pull/80799) ([Shivji Kumar Jha](https://github.com/shiv4289)).
* 按照[规范](https://github.com/apache/parquet-format/blob/master/LogicalTypes.md#enum)，支持将 Parquet 枚举写为字节数组。 [#81090](https://github.com/ClickHouse/ClickHouse/pull/81090) ([Arthur Passos](https://github.com/arthurpassos)).
* 改进 `DeltaLake` 表引擎：此 PR 实现 delta-kernel-rs 提供的 `ExpressionVisitor` API，并将其应用于分区列表达式转换，替代代码此前使用且已被 delta-kernel-rs 弃用的旧方式。未来，`ExpressionVisitor` 还可用于实现基于统计信息的裁剪和某些 Delta Lake 专有功能。此外，此变更旨在支持 `DeltaLakeCluster` 表引擎中的分区裁剪：解析后的表达式 ActionsDAG 将与数据路径一起序列化，并由发起节点发送出去。裁剪所需的这类信息仅在数据文件列举时作为元信息提供，而列举仅由发起节点执行，但信息必须应用于每台读取服务器上的数据。 [#81136](https://github.com/ClickHouse/ClickHouse/pull/81136) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 为命名元组推导公共超类型时保留元素名称。 [#81345](https://github.com/ClickHouse/ClickHouse/pull/81345) ([lgbo](https://github.com/lgbo-ustc)).
* 在 StorageKafka2 中手动统计已消费消息，避免依赖此前已提交的偏移量。 [#81662](https://github.com/ClickHouse/ClickHouse/pull/81662) ([János Benjamin Antal](https://github.com/antaljanosbenjamin)).
* 新增 `clickhouse-keeper-utils`，用于管理和分析 ClickHouse Keeper 数据的命令行工具。支持从快照和变更日志导出状态、分析变更日志文件，以及提取指定日志范围。 [#81677](https://github.com/ClickHouse/ClickHouse/pull/81677) ([Antonio Andelic](https://github.com/antonio2368)).
* 总网络限速器和每用户网络限速器永不重置，以确保 `max_network_bandwidth_for_all_users` 和 `max_network_bandwidth_for_all_users` 限制不会被超过。 [#81729](https://github.com/ClickHouse/ClickHouse/pull/81729) ([Sergei Trifonov](https://github.com/serxa)).
* 支持将 GeoParquet 写为输出格式。 [#81784](https://github.com/ClickHouse/ClickHouse/pull/81784) ([Konstantin Vedernikov](https://github.com/scanhex12)).
* 如果某列当前正受尚未完成的数据变更操作影响，则禁止启动会重命名该列的 `RENAME COLUMN` ALTER 变更操作。 [#81823](https://github.com/ClickHouse/ClickHouse/pull/81823) ([Mikhail Artemenko](https://github.com/Michicosun)).
* 将 Connection 头放在所有响应头的最后发送，此时已能确定是否应保留连接。 [#81951](https://github.com/ClickHouse/ClickHouse/pull/81951) ([Sema Checherinda](https://github.com/CheSema)).
* 根据 listen\_backlog（默认 4096）调整 TCP 服务器队列（默认 64）。 [#82045](https://github.com/ClickHouse/ClickHouse/pull/82045) ([Azat Khuzhin](https://github.com/azat)).
* 允许无需重启服务器即可即时重载 `max_local_read_bandwidth_for_server` 和 `max_local_write_bandwidth_for_server`。 [#82083](https://github.com/ClickHouse/ClickHouse/pull/82083) ([Kai Zhu](https://github.com/nauu)).
* 支持使用 `TRUNCATE TABLE system.warnings` 清除 `system.warnings` 表中的全部警告。 [#82087](https://github.com/ClickHouse/ClickHouse/pull/82087) ([Vladimir Cherkasov](https://github.com/vdimir)).
* 修复数据湖集群函数的分区裁剪。 [#82131](https://github.com/ClickHouse/ClickHouse/pull/82131) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复 DeltaLakeCluster 表函数读取分区数据的问题。此 PR 提高集群函数协议版本，允许发起节点向副本发送额外信息。其中包含 delta-kernel 转换表达式，用于解析分区列，以及未来可能支持的生成列等内容。 [#82132](https://github.com/ClickHouse/ClickHouse/pull/82132) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 函数 `reinterpret` 现在支持转换为 `Array(T)`，其中 `T` 为固定大小的数据类型（问题 [#82621](https://github.com/ClickHouse/ClickHouse/issues/82621)）。 [#83399](https://github.com/ClickHouse/ClickHouse/pull/83399) ([Shankar Iyer](https://github.com/shankar-iyer)).
* DataLake 数据库现在抛出更易理解的异常。修复了 [#81211](https://github.com/ClickHouse/ClickHouse/issues/81211)。 [#82304](https://github.com/ClickHouse/ClickHouse/pull/82304) ([alesapin](https://github.com/alesapin)).
* 通过让 `HashJoin::needUsedFlagsForPerRightTableRow` 返回 false，改进 CROSS JOIN。 [#82379](https://github.com/ClickHouse/ClickHouse/pull/82379) ([lgbo](https://github.com/lgbo-ustc)).
* 允许将 Map 列作为元组数组读写。 [#82408](https://github.com/ClickHouse/ClickHouse/pull/82408) ([MikhailBurdukov](https://github.com/MikhailBurdukov)).
* 在 `system.licenses` 中列出 [Rust](https://clickhouse.com/blog/rust) crate 的许可证。 [#82440](https://github.com/ClickHouse/ClickHouse/pull/82440) ([Raúl Marín](https://github.com/Algunenano)).
* S3Queue 表引擎的 `keeper_path` 设置现在可使用 `{uuid}` 等宏。 [#82463](https://github.com/ClickHouse/ClickHouse/pull/82463) ([Nikolay Degterinsky](https://github.com/evillique)).
* Keeper 改进：在后台线程中跨磁盘移动变更日志文件。此前，将变更日志移至另一磁盘会全局阻塞 Keeper，直到移动完成。如果移动耗时较长（例如移至 S3 磁盘），就会导致性能下降。 [#82485](https://github.com/ClickHouse/ClickHouse/pull/82485) ([Antonio Andelic](https://github.com/antonio2368)).
* Keeper 改进：新增配置 `keeper_server.cleanup_old_and_ignore_new_acl`。启用后，清除所有节点的 ACL，并忽略新请求中的 ACL。如果目标是彻底移除节点 ACL，应保持此配置启用，直到创建新的快照。 [#82496](https://github.com/ClickHouse/ClickHouse/pull/82496) ([Antonio Andelic](https://github.com/antonio2368)).
* 新增服务器设置 `s3queue_disable_streaming`，禁用 S3Queue 引擎表中的流式处理。无需重启服务器即可修改该设置。 [#82515](https://github.com/ClickHouse/ClickHouse/pull/82515) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 重构文件系统缓存的动态大小调整功能，并添加更多日志以查看内部状态。 [#82556](https://github.com/ClickHouse/ClickHouse/pull/82556) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 没有配置文件的 `clickhouse-server` 现在也会像使用默认配置时一样监听 PostgreSQL 端口 9005。 [#82633](https://github.com/ClickHouse/ClickHouse/pull/82633) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 在 `ReplicatedMergeTree::executeMetadataAlter` 中，我们获取 StorageID 后，未取得 DDLGuard 就尝试调用 `IDatabase::alterTable`。在此期间，该表可能已与另一张表交换，导致获取到错误的定义。为避免此问题，在调用 `IDatabase::alterTable` 时添加独立检查，确保 UUID 匹配。 [#82666](https://github.com/ClickHouse/ClickHouse/pull/82666) ([Nikolay Degterinsky](https://github.com/evillique)).
* 附加使用只读远程磁盘的数据库时，手动将表 UUID 加入 DatabaseCatalog。 [#82670](https://github.com/ClickHouse/ClickHouse/pull/82670) ([Tuan Pham Anh](https://github.com/tuanpach)).
* 禁止用户在 `NumericIndexedVector` 中使用 `nan` 和 `inf`。修复了 [#82239](https://github.com/ClickHouse/ClickHouse/issues/82239) 及其他少量问题。 [#82681](https://github.com/ClickHouse/ClickHouse/pull/82681) ([Raufs Dunamalijevs](https://github.com/rienath)).
* 不再省略 `X-ClickHouse-Progress` 和 `X-ClickHouse-Summary` 响应头格式中的零值。 [#82727](https://github.com/ClickHouse/ClickHouse/pull/82727) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* Keeper 改进：支持为 world:anyone ACL 指定具体权限。 [#82755](https://github.com/ClickHouse/ClickHouse/pull/82755) ([Antonio Andelic](https://github.com/antonio2368)).
* 禁止对 SummingMergeTree 中显式列出的求和列执行 `RENAME COLUMN` 或 `DROP COLUMN`。解决了 [#81836](https://github.com/ClickHouse/ClickHouse/issues/81836)。 [#82821](https://github.com/ClickHouse/ClickHouse/pull/82821) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 提高 `Decimal` 转换为 `Float32` 的精度，并实现 `Decimal` 到 `BFloat16` 的转换。解决了 [#82660](https://github.com/ClickHouse/ClickHouse/issues/82660)。 [#82823](https://github.com/ClickHouse/ClickHouse/pull/82823) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Web UI 的滚动条外观有所改善。 [#82869](https://github.com/ClickHouse/ClickHouse/pull/82869) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 使用内嵌配置的 `clickhouse-server` 会提供 HTTP OPTIONS 响应，以允许使用 Web UI。 [#82870](https://github.com/ClickHouse/ClickHouse/pull/82870) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 支持在配置中为路径指定额外的 Keeper ACL。如需为某个路径添加额外 ACL，可在配置的 `zookeeper.path_acls` 下定义。 [#82898](https://github.com/ClickHouse/ClickHouse/pull/82898) ([Antonio Andelic](https://github.com/antonio2368)).
* 现在根据可见数据片段快照构建变更操作快照，并根据其中包含的变更操作重新计算快照使用的计数器。 [#82945](https://github.com/ClickHouse/ClickHouse/pull/82945) ([Mikhail Artemenko](https://github.com/Michicosun)).
* Keeper 因软内存限制而拒绝写入时，添加 ProfileEvent。 [#82963](https://github.com/ClickHouse/ClickHouse/pull/82963) ([Xander Garbett](https://github.com/Garbett1)).
* 为 `system.s3queue_log` 添加 `commit_time` 和 `commit_id` 列。 [#83016](https://github.com/ClickHouse/ClickHouse/pull/83016) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 某些情况下，指标需要多个维度。例如，按错误码统计失败的合并或变更操作，而不是只有一个计数器。为此引入 `system.dimensional_metrics`，并添加首个维度指标 `failed_merges`。 [#83030](https://github.com/ClickHouse/ClickHouse/pull/83030) ([Miсhael Stetsyuk](https://github.com/mstetsyuk)).
* 合并 ClickHouse 客户端中的未知设置警告，并作为摘要记录。 [#83042](https://github.com/ClickHouse/ClickHouse/pull/83042) ([Bharat Nallan](https://github.com/bharatnc)).
* ClickHouse 客户端现在在连接错误时报告本地端口。 [#83050](https://github.com/ClickHouse/ClickHouse/pull/83050) ([Jianfei Hu](https://github.com/incfly)).
* 小幅改进 `AsynchronousMetrics` 的错误处理。如果 `/sys/block` 目录存在但无法访问，服务器会在不监控块设备的情况下启动。解决了 [#79229](https://github.com/ClickHouse/ClickHouse/issues/79229)。 [#83115](https://github.com/ClickHouse/ClickHouse/pull/83115) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 在普通表之后、系统表之前关闭 SystemLogs，而不是在普通表之前关闭。 [#83134](https://github.com/ClickHouse/ClickHouse/pull/83134) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 为 `S3Queue` 关闭过程添加日志。 [#83163](https://github.com/ClickHouse/ClickHouse/pull/83163) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 允许将 `Time` 和 `Time64` 解析为 `MM:SS`、`M:SS`、`SS` 或 `S`。 [#83299](https://github.com/ClickHouse/ClickHouse/pull/83299) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 当 `distributed_ddl_output_mode='*_only_active'` 时，不等待复制延迟超过 `max_replication_lag_to_enqueue` 的新副本或已恢复副本。这有助于避免新副本完成初始化或恢复并变为活跃状态，但初始化期间积累大量复制日志时出现的 `DDL task is not finished on some hosts` 错误。同时实现 `SYSTEM SYNC DATABASE REPLICA STRICT` 查询，等待复制日志积压降至 `max_replication_lag_to_enqueue` 以下。 [#83302](https://github.com/ClickHouse/ClickHouse/pull/83302) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 不在异常消息中输出过长的表达式操作描述。解决了 [#83164](https://github.com/ClickHouse/ClickHouse/issues/83164)。 [#83350](https://github.com/ClickHouse/ClickHouse/pull/83350) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 新增解析数据片段前缀、后缀以及检查非常量列覆盖关系的能力。 [#83377](https://github.com/ClickHouse/ClickHouse/pull/83377) ([Mikhail Artemenko](https://github.com/Michicosun)).
* 使用命名集合时，统一 ODBC 和 JDBC 的参数名称。 [#83410](https://github.com/ClickHouse/ClickHouse/pull/83410) ([Andrey Zvonov](https://github.com/zvonand)).
* 存储关闭时，`getStatus` 会抛出 `ErrorCodes::ABORTED` 异常。此前会导致 SELECT 查询失败，现在改为捕获并有意忽略 `ErrorCodes::ABORTED` 异常。 [#83435](https://github.com/ClickHouse/ClickHouse/pull/83435) ([Miсhael Stetsyuk](https://github.com/mstetsyuk)).
* 将进程资源指标（例如 `UserTimeMicroseconds`、`SystemTimeMicroseconds`、`RealTimeMicroseconds`）添加到 part\_log 中 `MergeParts` 条目的性能分析事件。 [#83460](https://github.com/ClickHouse/ClickHouse/pull/83460) ([Vladimir Cherkasov](https://github.com/vdimir)).
* 默认启用 Keeper 的 `create_if_not_exists`、`check_not_exists` 和 `remove_recursive` 功能标志，以支持新的请求类型。 [#83488](https://github.com/ClickHouse/ClickHouse/pull/83488) ([Antonio Andelic](https://github.com/antonio2368)).
* 服务器关闭时，在关闭任何表之前，先关闭 S3/Azure 等 Queue 的流式处理。 [#83530](https://github.com/ClickHouse/ClickHouse/pull/83530) ([Kseniia Sumarokova](https://github.com/kssenii)).
* `JSON` 输入格式允许用整数表示 `Date`/`Date32`。 [#83597](https://github.com/ClickHouse/ClickHouse/pull/83597) ([MikhailBurdukov](https://github.com/MikhailBurdukov)).
* 使加载和添加投影时某些场景下的异常消息更易读。 [#83728](https://github.com/ClickHouse/ClickHouse/pull/83728) ([Robert Schulze](https://github.com/rschu1ze)).
* 引入配置选项，以跳过 `clickhouse-server` 的二进制校验和完整性检查。解决了 [#83637](https://github.com/ClickHouse/ClickHouse/issues/83637)。 [#83749](https://github.com/ClickHouse/ClickHouse/pull/83749) ([Rafael Roquetto](https://github.com/rafaelroquetto)).

#### 缺陷修复（正式稳定版本中用户可见的异常行为）

* 修复 `clickhouse-benchmark` 的 `--reconnect` 选项默认值错误；该值曾在 [#79465](https://github.com/ClickHouse/ClickHouse/issues/79465) 中被误改。 [#82677](https://github.com/ClickHouse/ClickHouse/pull/82677) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复 `CREATE DICTIONARY` 格式化不一致的问题。解决了 [#82105](https://github.com/ClickHouse/ClickHouse/issues/82105)。 [#82829](https://github.com/ClickHouse/ClickHouse/pull/82829) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复 TTL 包含 `materialize` 函数时格式化不一致的问题。解决了 [#82828](https://github.com/ClickHouse/ClickHouse/issues/82828)。 [#82831](https://github.com/ClickHouse/ClickHouse/pull/82831) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复子查询中的 EXPLAIN AST 含 INTO OUTFILE 等输出选项时格式化不一致的问题。解决了 [#82826](https://github.com/ClickHouse/ClickHouse/issues/82826)。 [#82840](https://github.com/ClickHouse/ClickHouse/pull/82840) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复在不允许别名的语境中，带括号和别名的表达式格式化不一致的问题。解决了 [#82836](https://github.com/ClickHouse/ClickHouse/issues/82836)。解决了 [#82837](https://github.com/ClickHouse/ClickHouse/issues/82837)。 [#82867](https://github.com/ClickHouse/ClickHouse/pull/82867) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 将聚合函数状态与 IPv4 相乘时，使用正确的错误码。解决了 [#82817](https://github.com/ClickHouse/ClickHouse/issues/82817)。 [#82818](https://github.com/ClickHouse/ClickHouse/pull/82818) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复文件系统缓存中的逻辑错误：“Having zero bytes but range is not finished”（字节数为零但范围尚未完成）。 [#81868](https://github.com/ClickHouse/ClickHouse/pull/81868) ([Kseniia Sumarokova](https://github.com/kssenii)).
* TTL 减少行数时重新计算 min-max 索引，确保 `minmax_count_projection` 等依赖该索引的算法正确。解决了 [#77091](https://github.com/ClickHouse/ClickHouse/issues/77091)。 [#77166](https://github.com/ClickHouse/ClickHouse/pull/77166) ([Amos Bird](https://github.com/amosbird)).
* 对于组合使用 `ORDER BY ... LIMIT BY ... LIMIT N` 的查询，当 ORDER BY 以 PartialSorting 执行时，计数器 `rows_before_limit_at_least` 现在反映 LIMIT 子句消费的行数，而不是排序转换消费的行数。 [#78999](https://github.com/ClickHouse/ClickHouse/pull/78999) ([Eduard Karacharov](https://github.com/korowa)).
* 修复使用含分支且首个分支不是字面量的正则表达式筛选 token/ngram 索引时，过度跳过数据粒度的问题。 [#79373](https://github.com/ClickHouse/ClickHouse/pull/79373) ([Eduard Karacharov](https://github.com/korowa)).
* 修复 `<=>` 运算符与 Join 存储配合使用时的逻辑错误，现在查询返回恰当的错误码。 [#80165](https://github.com/ClickHouse/ClickHouse/pull/80165) ([Vladimir Cherkasov](https://github.com/vdimir)).
* 修复 `loop` 函数与 `remote` 函数族配合使用时的崩溃，并确保 `loop(remote(...))` 遵循 LIMIT 子句。 [#80299](https://github.com/ClickHouse/ClickHouse/pull/80299) ([Julia Kartseva](https://github.com/jkartseva)).
* 修复 `to_utc_timestamp` 和 `from_utc_timestamp` 处理早于 Unix 纪元（1970-01-01）或晚于最大日期（2106-02-07 06:28:15）的日期时行为错误的问题。现在分别正确地将值限制到纪元起点和最大日期。 [#80498](https://github.com/ClickHouse/ClickHouse/pull/80498) ([Surya Kant Ranjan](https://github.com/iit2009046)).
* 对某些使用并行副本的查询，有序读取优化可能在发起节点上适用、但在远程节点上不适用。这会导致发起节点上的并行副本协调器与远程节点使用不同的读取模式，从而触发逻辑错误。 [#80652](https://github.com/ClickHouse/ClickHouse/pull/80652) ([Igor Nikonov](https://github.com/devcrafter)).
* 修复列类型改为 Nullable 后物化投影时的逻辑错误。 [#80741](https://github.com/ClickHouse/ClickHouse/pull/80741) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复更新 TTL 时，TTL GROUP BY 中的 TTL 重新计算错误。 [#81222](https://github.com/ClickHouse/ClickHouse/pull/81222) ([Evgeniy Ulasik](https://github.com/H0uston)).
* 修复 Parquet Bloom filter 错将 `WHERE function(key) IN (...)` 之类的条件按 `WHERE key IN (...)` 应用的问题。 [#81255](https://github.com/ClickHouse/ClickHouse/pull/81255) ([Michael Kolupaev](https://github.com/al13n321)).
* 修复合并期间抛出异常时 `Aggregator` 可能发生的崩溃。 [#81450](https://github.com/ClickHouse/ClickHouse/pull/81450) ([Nikita Taranov](https://github.com/nickitat)).
* 修复 `InterpreterInsertQuery::extendQueryLogElemImpl`，在需要时为数据库和表名添加反引号（例如名称包含 `-` 等特殊字符时）。 [#81528](https://github.com/ClickHouse/ClickHouse/pull/81528) ([Ilia Shvyrialkin](https://github.com/Harzu)).
* 修复 `transform_null_in=1` 时，左参数含 null、子查询结果不可空的 `IN` 执行。 [#81584](https://github.com/ClickHouse/ClickHouse/pull/81584) ([Pavel Kruglov](https://github.com/Avogar)).
* 从已有表读取并执行默认值或物化表达式时，不校验实验性或可疑类型。 [#81618](https://github.com/ClickHouse/ClickHouse/pull/81618) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复 TTL 表达式使用字典时，合并期间出现的“Context has expired”（上下文已失效）错误。 [#81690](https://github.com/ClickHouse/ClickHouse/pull/81690) ([Azat Khuzhin](https://github.com/azat)).
* 修复类型转换函数的单调性。 [#81722](https://github.com/ClickHouse/ClickHouse/pull/81722) ([zoomxi](https://github.com/zoomxi)).
* 修复处理标量相关子查询时未读取必需列的问题。修复了 [#81716](https://github.com/ClickHouse/ClickHouse/issues/81716)。 [#81805](https://github.com/ClickHouse/ClickHouse/pull/81805) ([Dmitry Novik](https://github.com/novikd)).
* 此前，服务器对 `/js` 请求返回了过多内容。解决了 [#61890](https://github.com/ClickHouse/ClickHouse/issues/61890)。 [#81895](https://github.com/ClickHouse/ClickHouse/pull/81895) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 此前，`MongoDB` 表引擎定义的 `host:port` 参数可以包含路径部分，但会被静默忽略。MongoDB 集成拒绝加载此类表。此次修复在 `MongoDB` 引擎具有五个参数时，*允许加载这些表并忽略路径部分*，使用参数中指定的数据库名称。*注意：*此修复不适用于新创建的表、使用 `mongo` 表函数的查询、字典源或命名集合。 [#81942](https://github.com/ClickHouse/ClickHouse/pull/81942) ([Vladimir Cherkasov](https://github.com/vdimir)).
* 修复合并期间抛出异常时 `Aggregator` 可能发生的崩溃。 [#82022](https://github.com/ClickHouse/ClickHouse/pull/82022) ([Nikita Taranov](https://github.com/nickitat)).
* 修复查询仅使用常量别名列时的筛选条件分析。修复了 [#79448](https://github.com/ClickHouse/ClickHouse/issues/79448)。 [#82037](https://github.com/ClickHouse/ClickHouse/pull/82037) ([Dmitry Novik](https://github.com/novikd)).
* 修复 TTL 的 GROUP BY 和 SET 使用同一列时产生的 LOGICAL\_ERROR 及随后崩溃。 [#82054](https://github.com/ClickHouse/ClickHouse/pull/82054) ([Pablo Marcos](https://github.com/pamarcos)).
* 修复机密信息遮蔽过程中对 S3 表函数参数的校验，防止可能出现的 `LOGICAL_ERROR`，解决了 [#80620](https://github.com/ClickHouse/ClickHouse/issues/80620)。 [#82056](https://github.com/ClickHouse/ClickHouse/pull/82056) ([Vladimir Cherkasov](https://github.com/vdimir)).
* 修复 Iceberg 中的数据竞争。 [#82088](https://github.com/ClickHouse/ClickHouse/pull/82088) ([Azat Khuzhin](https://github.com/azat)).
* 修复 `DatabaseReplicated::getClusterImpl`。如果 `hosts` 的第一个或前几个元素满足 `id == DROPPED_MARK`，且同一分片没有其他元素，`shards` 的第一个元素将为空向量，导致 `std::out_of_range`。 [#82093](https://github.com/ClickHouse/ClickHouse/pull/82093) ([Miсhael Stetsyuk](https://github.com/mstetsyuk)).
* 修复 arraySimilarity 中的复制粘贴错误，禁止使用 UInt32 和 Int32 权重，并更新测试和文档。 [#82103](https://github.com/ClickHouse/ClickHouse/pull/82103) ([Mikhail f. Shiryaev](https://github.com/Felixoid)).
* 修复 `WHERE` 条件中含 `arrayJoin` 且使用 `IndexSet` 的查询出现的 `Not found column` 错误。 [#82113](https://github.com/ClickHouse/ClickHouse/pull/82113) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复 Glue 目录集成的缺陷。现在 ClickHouse 可以读取包含嵌套数据类型、且部分子列为 Decimal 的表，例如 `map<string, decimal(9, 2)>`。修复了 [#81301](https://github.com/ClickHouse/ClickHouse/issues/81301)。 [#82114](https://github.com/ClickHouse/ClickHouse/pull/82114) ([alesapin](https://github.com/alesapin)).
* 修复 25.5 中由 [https://github.com/ClickHouse/ClickHouse/pull/79051](https://github.com/ClickHouse/ClickHouse/pull/79051) 引入的 SummingMergeTree 性能退化。 [#82130](https://github.com/ClickHouse/ClickHouse/pull/82130) ([Pavel Kruglov](https://github.com/Avogar)).
* 通过 URI 传递设置时，采用最后一个值。 [#82137](https://github.com/ClickHouse/ClickHouse/pull/82137) ([Sema Checherinda](https://github.com/CheSema)).
* 修复 Iceberg 的“Context has expired”（上下文已失效）错误。 [#82146](https://github.com/ClickHouse/ClickHouse/pull/82146) ([Azat Khuzhin](https://github.com/azat)).
* 修复服务器存在内存压力时远程查询可能发生的死锁。 [#82160](https://github.com/ClickHouse/ClickHouse/pull/82160) ([Kirill](https://github.com/kirillgarbar)).
* 修复 `numericIndexedVectorPointwiseAdd`、`numericIndexedVectorPointwiseSubtract`、`numericIndexedVectorPointwiseMultiply` 和 `numericIndexedVectorPointwiseDivide` 函数处理大数时发生的溢出。 [#82165](https://github.com/ClickHouse/ClickHouse/pull/82165) ([Raufs Dunamalijevs](https://github.com/rienath)).
* 修复表依赖中的缺陷，避免物化视图遗漏 INSERT 查询。 [#82222](https://github.com/ClickHouse/ClickHouse/pull/82222) ([Nikolay Degterinsky](https://github.com/evillique)).
* 修复补全建议线程与客户端主线程之间可能存在的数据竞争。 [#82233](https://github.com/ClickHouse/ClickHouse/pull/82233) ([Azat Khuzhin](https://github.com/azat)).
* 现在 ClickHouse 可以从 Glue 目录读取经过结构演进的 Iceberg 表。修复了 [#81272](https://github.com/ClickHouse/ClickHouse/issues/81272)。 [#82301](https://github.com/ClickHouse/ClickHouse/pull/82301) ([alesapin](https://github.com/alesapin)).
* 修复异步指标设置 `asynchronous_metrics_update_period_s` 和 `asynchronous_heavy_metrics_update_period_s` 的校验。 [#82310](https://github.com/ClickHouse/ClickHouse/pull/82310) ([Bharat Nallan](https://github.com/bharatnc)).
* 修复含多个 JOIN 的查询解析匹配器时的逻辑错误，解决了 [#81969](https://github.com/ClickHouse/ClickHouse/issues/81969)。 [#82421](https://github.com/ClickHouse/ClickHouse/pull/82421) ([Vladimir Cherkasov](https://github.com/vdimir)).
* 为 AWS ECS 令牌添加过期时间，以便重新加载。 [#82422](https://github.com/ClickHouse/ClickHouse/pull/82422) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 修复 `CASE` 函数处理 `NULL` 参数的缺陷。 [#82436](https://github.com/ClickHouse/ClickHouse/pull/82436) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 修复客户端数据竞争（通过不使用全局上下文），以及 `session_timezone` 的覆盖行为。此前，如果 `users.xml` 或客户端选项中的 `session_timezone` 非空，而查询上下文中设为空，就会错误地使用 `users.xml` 中的值。现在查询上下文始终优先于全局上下文。 [#82444](https://github.com/ClickHouse/ClickHouse/pull/82444) ([Azat Khuzhin](https://github.com/azat)).
* 修复外部表引擎中禁用缓存缓冲区边界对齐的行为，该行为在 [https://github.com/ClickHouse/ClickHouse/pull/81868](https://github.com/ClickHouse/ClickHouse/pull/81868) 中被破坏。 [#82493](https://github.com/ClickHouse/ClickHouse/pull/82493) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复使用经过类型转换的键连接键值存储时的崩溃。 [#82497](https://github.com/ClickHouse/ClickHouse/pull/82497) ([Pervakov Grigorii](https://github.com/GrigoryPervakov)).
* 修复在日志和 query\_log 中隐藏命名集合值的行为。解决了 [#82405](https://github.com/ClickHouse/ClickHouse/issues/82405)。 [#82510](https://github.com/ClickHouse/ClickHouse/pull/82510) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复终止会话时日志记录中可能发生的崩溃，因为 user\_id 有时可能为空。 [#82513](https://github.com/ClickHouse/ClickHouse/pull/82513) ([Bharat Nallan](https://github.com/bharatnc)).
* 修复解析 Time 时可能引发 MSan 问题的情况。修复了 [#82477](https://github.com/ClickHouse/ClickHouse/issues/82477)。 [#82514](https://github.com/ClickHouse/ClickHouse/pull/82514) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 禁止将 `threadpool_writer_pool_size` 设为零，确保服务器操作不会卡住。 [#82532](https://github.com/ClickHouse/ClickHouse/pull/82532) ([Bharat Nallan](https://github.com/bharatnc)).
* 修复分析相关列的行策略表达式时的 `LOGICAL_ERROR`。 [#82618](https://github.com/ClickHouse/ClickHouse/pull/82618) ([Dmitry Novik](https://github.com/novikd)).
* 修复 `enable_shared_storage_snapshot_in_query = 1` 时，`mergeTreeProjection` 表函数错误使用父表元数据的问题。对应 [#82634](https://github.com/ClickHouse/ClickHouse/issues/82634)。 [#82638](https://github.com/ClickHouse/ClickHouse/pull/82638) ([Amos Bird](https://github.com/amosbird)).
* 函数 `trim{Left,Right,Both}` 现在支持 "FixedString(N)" 类型的输入字符串。例如，`SELECT trimBoth(toFixedString('abc', 3), 'ac')` 现在可以执行。 [#82691](https://github.com/ClickHouse/ClickHouse/pull/82691) ([Robert Schulze](https://github.com/rschu1ze)).
* 在 AzureBlobStorage 中，原生复制需要比较认证方式；如果比较期间抛出异常，现在回退到先读取再复制的方式，即非原生复制。 [#82693](https://github.com/ClickHouse/ClickHouse/pull/82693) ([Smita Kulkarni](https://github.com/SmitaRKulkarni)).
* 修复元素为空时 `groupArraySample`/`groupArrayLast` 的反序列化（输入为空时，反序列化可能跳过部分二进制数据，导致读取数据损坏以及 TCP 协议中的 UNKNOWN\_PACKET\_FROM\_SERVER）。此问题不影响数值和日期时间类型。 [#82763](https://github.com/ClickHouse/ClickHouse/pull/82763) ([Pedro Ferreira](https://github.com/PedroTadim)).
* 修复空 `Memory` 表的备份问题，避免恢复时出现 `BACKUP_ENTRY_NOT_FOUND` 错误。 [#82791](https://github.com/ClickHouse/ClickHouse/pull/82791) ([Julia Kartseva](https://github.com/jkartseva)).
* 修复 union/intersect/except\_default\_mode 改写的异常安全性。解决了 [#82664](https://github.com/ClickHouse/ClickHouse/issues/82664)。 [#82820](https://github.com/ClickHouse/ClickHouse/pull/82820) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 跟踪异步表加载任务的数量。存在运行中的任务时，不更新 `TransactionLog::removeOldEntries` 中的 `tail_ptr`。 [#82824](https://github.com/ClickHouse/ClickHouse/pull/82824) ([Tuan Pham Anh](https://github.com/tuanpach)).
* 修复 Iceberg 中的数据竞争。 [#82841](https://github.com/ClickHouse/ClickHouse/pull/82841) ([Azat Khuzhin](https://github.com/azat)).
* 设置 `use_skip_indexes_if_final_exact_mode` 所控制的优化（在 25.6 中引入），可能因 `MergeTree` 引擎设置或数据分布而未选中相关候选范围。现在已解决。 [#82879](https://github.com/ClickHouse/ClickHouse/pull/82879) ([Shankar Iyer](https://github.com/shankar-iyer)).
* 从 AST 解析 SCRAM\_SHA256\_PASSWORD 类型的认证数据时设置盐值。 [#82888](https://github.com/ClickHouse/ClickHouse/pull/82888) ([Tuan Pham Anh](https://github.com/tuanpach)).
* 使用不缓存元数据的数据库实现时，对应表的元数据会在返回列后被删除，导致引用失效。 [#82939](https://github.com/ClickHouse/ClickHouse/pull/82939) ([buyval01](https://github.com/buyval01)).
* 修复查询中的 JOIN 表达式涉及 `Merge` 存储表时对筛选条件的修改。修复了 [#82092](https://github.com/ClickHouse/ClickHouse/issues/82092)。 [#82950](https://github.com/ClickHouse/ClickHouse/pull/82950) ([Dmitry Novik](https://github.com/novikd)).
* 修复 QueryMetricLog 中的 LOGICAL\_ERROR：Mutex cannot be NULL（互斥锁不能为 NULL）。 [#82979](https://github.com/ClickHouse/ClickHouse/pull/82979) ([Pablo Marcos](https://github.com/pamarcos)).
* 修复 `formatDateTime` 将格式符 `%f` 与变长格式符（例如 `%M`）共同使用时输出错误的问题。 [#83020](https://github.com/ClickHouse/ClickHouse/pull/83020) ([Robert Schulze](https://github.com/rschu1ze)).
* 修复启用 Analyzer 时次级查询始终读取视图全部列导致的性能退化。修复了 [#81718](https://github.com/ClickHouse/ClickHouse/issues/81718)。 [#83036](https://github.com/ClickHouse/ClickHouse/pull/83036) ([Dmitry Novik](https://github.com/novikd)).
* 修复在只读磁盘上恢复备份时误导性的错误消息。 [#83051](https://github.com/ClickHouse/ClickHouse/pull/83051) ([Julia Kartseva](https://github.com/jkartseva)).
* 创建没有依赖的表时，不检查循环依赖。修复 [https://github.com/ClickHouse/ClickHouse/pull/65405](https://github.com/ClickHouse/ClickHouse/pull/65405) 引入的创建数千张表场景下的性能退化。 [#83077](https://github.com/ClickHouse/ClickHouse/pull/83077) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复将负 Time 值隐式读入表的问题，并使文档表述更清晰。 [#83091](https://github.com/ClickHouse/ClickHouse/pull/83091) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* `lowCardinalityKeys` 函数不使用共享字典中无关的部分。 [#83118](https://github.com/ClickHouse/ClickHouse/pull/83118) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复物化视图使用子列时的回归问题。修复了 [#82784](https://github.com/ClickHouse/ClickHouse/issues/82784)。 [#83221](https://github.com/ClickHouse/ClickHouse/pull/83221) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* 修复无效 INSERT 后连接保持断开状态，导致客户端崩溃的问题。 [#83253](https://github.com/ClickHouse/ClickHouse/pull/83253) ([Azat Khuzhin](https://github.com/azat)).
* 修复计算含空列的数据块大小时的崩溃。 [#83271](https://github.com/ClickHouse/ClickHouse/pull/83271) ([Raúl Marín](https://github.com/Algunenano)).
* 修复 UNION 中 Variant 类型可能发生的崩溃。 [#83295](https://github.com/ClickHouse/ClickHouse/pull/83295) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复 clickhouse-local 对不支持的 SYSTEM 查询产生 LOGICAL\_ERROR 的问题。 [#83333](https://github.com/ClickHouse/ClickHouse/pull/83333) ([Surya Kant Ranjan](https://github.com/iit2009046)).
* 修复 S3 客户端的 `no_sign_request`。可使用该设置显式避免对 S3 请求签名，也可通过基于端点的设置对指定端点配置。 [#83379](https://github.com/ClickHouse/ClickHouse/pull/83379) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复启用 CPU 调度且有负载时，执行带 'max\_threads=1' 设置的查询可能出现的崩溃。 [#83387](https://github.com/ClickHouse/ClickHouse/pull/83387) ([Fan Ziqi](https://github.com/f2quantum)).
* 修复 CTE 定义引用另一个同名表表达式时出现的 `TOO_DEEP_SUBQUERIES` 异常。 [#83413](https://github.com/ClickHouse/ClickHouse/pull/83413) ([Dmitry Novik](https://github.com/novikd)).
* 修复执行 `REVOKE S3 ON system.*` 却撤销 `*.*` 的 S3 权限这一错误行为。修复了 [#83417](https://github.com/ClickHouse/ClickHouse/issues/83417)。 [#83420](https://github.com/ClickHouse/ClickHouse/pull/83420) ([pufit](https://github.com/pufit)).
* 查询之间不共享 async\_read\_counters。 [#83423](https://github.com/ClickHouse/ClickHouse/pull/83423) ([Azat Khuzhin](https://github.com/azat)).
* 当子查询包含 FINAL 时禁用并行副本。 [#83455](https://github.com/ClickHouse/ClickHouse/pull/83455) ([zoomxi](https://github.com/zoomxi)).
* 修复设置 `role_cache_expiration_time_seconds` 配置中的轻微整数溢出（问题 [#83374](https://github.com/ClickHouse/ClickHouse/issues/83374)）。 [#83461](https://github.com/ClickHouse/ClickHouse/pull/83461) ([wushap](https://github.com/wushap)).
* 修复 [https://github.com/ClickHouse/ClickHouse/pull/79963](https://github.com/ClickHouse/ClickHouse/pull/79963) 引入的缺陷。向具有定义者的物化视图插入时，权限检查应使用定义者的授权。修复了 [#79951](https://github.com/ClickHouse/ClickHouse/issues/79951)。 [#83502](https://github.com/ClickHouse/ClickHouse/pull/83502) ([pufit](https://github.com/pufit)).
* 对 Iceberg 数组元素和 Map 值及其所有嵌套子字段，禁用基于上下界的文件裁剪。 [#83520](https://github.com/ClickHouse/ClickHouse/pull/83520) ([Daniil Ivanik](https://github.com/divanik)).
* 修复将文件缓存用作临时数据存储时，可能出现的缓存未初始化错误。 [#83539](https://github.com/ClickHouse/ClickHouse/pull/83539) ([Bharat Nallan](https://github.com/bharatnc)).
* Keeper 修复：会话关闭时删除临时节点，正确更新监听器总数。 [#83583](https://github.com/ClickHouse/ClickHouse/pull/83583) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复 max\_untracked\_memory 相关的内存统计错误。 [#83607](https://github.com/ClickHouse/ClickHouse/pull/83607) ([Azat Khuzhin](https://github.com/azat)).
* INSERT SELECT 与 UNION ALL 配合使用时，边界情况下可能发生空指针解引用。解决了 [#83618](https://github.com/ClickHouse/ClickHouse/issues/83618)。 [#83643](https://github.com/ClickHouse/ClickHouse/pull/83643) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 禁止 max\_insert\_block\_size 为零，因为这可能导致逻辑错误。 [#83688](https://github.com/ClickHouse/ClickHouse/pull/83688) ([Bharat Nallan](https://github.com/bharatnc)).
* 修复 estimateCompressionRatio() 在 block\_size\_bytes=0 时的无限循环。 [#83704](https://github.com/ClickHouse/ClickHouse/pull/83704) ([Azat Khuzhin](https://github.com/azat)).
* 修复 `IndexUncompressedCacheBytes`/`IndexUncompressedCacheCells`/`IndexMarkCacheBytes`/`IndexMarkCacheFiles` 指标（此前被计入不带 `Cache` 前缀的指标）。 [#83730](https://github.com/ClickHouse/ClickHouse/pull/83730) ([Azat Khuzhin](https://github.com/azat)).
* 修复 `BackgroundSchedulePool` 关闭期间可能因从任务内部等待线程结束而终止的问题，并希望同时解决单元测试中的挂起。 [#83769](https://github.com/ClickHouse/ClickHouse/pull/83769) ([Azat Khuzhin](https://github.com/azat)).
* 引入向后兼容设置，使新 Analyzer 在名称冲突时可以引用 WITH 子句中的外层别名。修复了 [#82700](https://github.com/ClickHouse/ClickHouse/issues/82700)。 [#83797](https://github.com/ClickHouse/ClickHouse/pull/83797) ([Dmitry Novik](https://github.com/novikd)).
* 修复关闭过程中清理库桥接器时递归锁定上下文导致的死锁。 [#83824](https://github.com/ClickHouse/ClickHouse/pull/83824) ([Azat Khuzhin](https://github.com/azat)).

#### 构建、测试与打包改进

* 为 ClickHouse 词法分析器构建最小 C 库（10 KB），用于 [#80977](https://github.com/ClickHouse/ClickHouse/issues/80977)。为独立词法分析器添加测试，并新增测试标签 `fasttest-only`。  [#81347](https://github.com/ClickHouse/ClickHouse/pull/81347) ([Alexey Milovidov](https://github.com/alexey-milovidov)). [#82472](https://github.com/ClickHouse/ClickHouse/pull/82472) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy))。
* 添加 Nix 子模块输入检查。 [#81691](https://github.com/ClickHouse/ClickHouse/pull/81691) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 修复在本机运行集成测试时可能遇到的一系列问题。 [#82135](https://github.com/ClickHouse/ClickHouse/pull/82135) ([Oleg Doronin](https://github.com/dorooleg)).
* 在 Mac 和 FreeBSD 上编译 SymbolIndex（但仅可在 Linux、FreeBSD 等 ELF 系统上工作）。 [#82347](https://github.com/ClickHouse/ClickHouse/pull/82347) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 将 Azure SDK 升级至 v1.15.0。 [#82747](https://github.com/ClickHouse/ClickHouse/pull/82747) ([Smita Kulkarni](https://github.com/SmitaRKulkarni)).
* 将 google-cloud-cpp 的存储模块加入构建系统。 [#82881](https://github.com/ClickHouse/ClickHouse/pull/82881) ([Pablo Marcos](https://github.com/pamarcos)).
* 修改 clickhouse-server 的 `Dockerfile.ubuntu`，以符合 Docker Official Library 要求。 [#83039](https://github.com/ClickHouse/ClickHouse/pull/83039) ([Mikhail f. Shiryaev](https://github.com/Felixoid)).
* 跟进 [#83158](https://github.com/ClickHouse/ClickHouse/issues/83158)，修复向 `curl clickhouse.com` 上传构建产物的问题。 [#83463](https://github.com/ClickHouse/ClickHouse/pull/83463) ([Mikhail f. Shiryaev](https://github.com/Felixoid)).
* 在 `clickhouse/clickhouse-server` 和官方 `clickhouse` 镜像中添加 `busybox` 二进制文件及安装工具。 [#83735](https://github.com/ClickHouse/ClickHouse/pull/83735) ([Mikhail f. Shiryaev](https://github.com/Felixoid)).
* 新增 `CLICKHOUSE_HOST` 环境变量支持，用于指定 ClickHouse 服务器主机，与已有的 `CLICKHOUSE_USER` 和 `CLICKHOUSE_PASSWORD` 环境变量保持一致。这样无需直接修改客户端或配置文件即可更方便地配置。 [#83659](https://github.com/ClickHouse/ClickHouse/pull/83659) ([Doron David](https://github.com/dorki)).
