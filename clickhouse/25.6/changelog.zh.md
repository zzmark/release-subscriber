<h3 id="256">
  ClickHouse 25.6 版本, 2025-06-26
</h3>

#### 向后不兼容变更

* 此前，函数 `countMatches` 即使在模式允许空匹配时，也会在第一个空匹配处停止计数。为解决此问题，`countMatches` 现在遇到空匹配后会向前移动一个字符并继续执行。希望保留旧行为的用户可启用设置 `count_matches_stop_at_empty_match`。 [#81676](https://github.com/ClickHouse/ClickHouse/pull/81676) ([Elmi Ahmadov](https://github.com/ahmadov)).
* 小变更：强制服务器设置 `backup_threads` 和 `restore_threads` 为非零值。 [#80224](https://github.com/ClickHouse/ClickHouse/pull/80224) ([Raúl Marín](https://github.com/Algunenano)).
* 小变更：修复 `bitNot` 对 `String` 的处理，使返回字符串的内部内存表示以零字节结尾。这不应影响任何用户可见的行为，但作者希望特别指出此变更。 [#80791](https://github.com/ClickHouse/ClickHouse/pull/80791) ([Azat Khuzhin](https://github.com/azat)).

#### 新功能

* 新增数据类型 `Time`（\[H]HH:MM:SS）和 `Time64`（\[H]HH:MM:SS\[.fractional]），以及一些基本的类型转换函数和与其他数据类型交互的函数。添加设置以兼容现有函数 `toTime`；目前启用 `use_legacy_to_time` 设置以保留旧行为。支持 Time/Time64 之间的比较。  [#81217](https://github.com/ClickHouse/ClickHouse/pull/81217) ([Yarik Briukhovetskyi](https://github.com/yariks5s)). [#80327](https://github.com/ClickHouse/ClickHouse/pull/80327) ([Yarik Briukhovetskyi](https://github.com/yariks5s))。
* 新增 CLI 工具 [`chdig`](https://github.com/azat/chdig/)，作为 ClickHouse 的一部分，提供类似 top 的 ClickHouse 文本用户界面。 [#79666](https://github.com/ClickHouse/ClickHouse/pull/79666) ([Azat Khuzhin](https://github.com/azat)).
* `Atomic` 和 `Ordinary` 数据库引擎支持 `disk` 设置，用于指定存储表元数据文件的磁盘。这允许附加来自外部来源的数据库。 [#80546](https://github.com/ClickHouse/ClickHouse/pull/80546) ([Tuan Pham Anh](https://github.com/tuanpach)).
* 新增 MergeTree 类型 `CoalescingMergeTree`，该引擎在后台合并期间取第一个非 Null 值。解决了 [#78869](https://github.com/ClickHouse/ClickHouse/issues/78869)。 [#79344](https://github.com/ClickHouse/ClickHouse/pull/79344) ([scanhex12](https://github.com/scanhex12)).
* 支持读取 WKB 的函数（“Well-Known Binary”是一种用于对多种几何类型进行二进制编码的格式，用于 GIS 应用）。参见 [#43941](https://github.com/ClickHouse/ClickHouse/issues/43941)。 [#80139](https://github.com/ClickHouse/ClickHouse/pull/80139) ([scanhex12](https://github.com/scanhex12)).
* 为工作负载添加查询槽位调度，详情参见[工作负载调度](/docs/concepts/features/configuration/server-config/workload-scheduling#query_scheduling)。 [#78415](https://github.com/ClickHouse/ClickHouse/pull/78415) ([Sergei Trifonov](https://github.com/serxa)).
* 新增 `timeSeries*` 辅助函数，加快某些时间序列处理场景：— 按指定的起始时间戳、结束时间戳和步长，将数据重采样到时间网格。— 计算类似 PromQL 的 `delta`、`rate`、`idelta` 和 `irate`。 [#80590](https://github.com/ClickHouse/ClickHouse/pull/80590) ([Alexander Gololobov](https://github.com/davenger)).
* 新增 `mapContainsValuesLike`/`mapContainsValues`/`mapExtractValuesLike` 函数，以按 Map 值进行筛选，并在基于 Bloom filter 的索引中支持它们。 [#78171](https://github.com/ClickHouse/ClickHouse/pull/78171) ([UnamedRus](https://github.com/UnamedRus)).
* 设置约束现在可以指定一组禁止的值。 [#78499](https://github.com/ClickHouse/ClickHouse/pull/78499) ([Bharat Nallan](https://github.com/bharatnc)).
* 新增设置 `enable_shared_storage_snapshot_in_query`，使单个查询中的所有子查询共享同一存储快照。这确保即使一个查询多次引用同一张表，也能一致地读取该表。 [#79471](https://github.com/ClickHouse/ClickHouse/pull/79471) ([Amos Bird](https://github.com/amosbird)).
* 支持将 `JSON` 列直接写入 `Parquet`，以及从 `Parquet` 直接读取 `JSON` 列。 [#79649](https://github.com/ClickHouse/ClickHouse/pull/79649) ([Nihal Z. Miaji](https://github.com/nihalzp)).
* 为 `pointInPolygon` 添加 `MultiPolygon` 支持。 [#79773](https://github.com/ClickHouse/ClickHouse/pull/79773) ([Nihal Z. Miaji](https://github.com/nihalzp)).
* 新增 `deltaLakeLocal` 表函数，以查询挂载在本地文件系统上的 Delta 表。 [#79781](https://github.com/ClickHouse/ClickHouse/pull/79781) ([roykim98](https://github.com/roykim98)).
* 新增设置 `cast_string_to_date_time_mode`，允许选择从 String 转换时的 DateTime 解析模式，例如可设置为尽力解析模式。 [#80210](https://github.com/ClickHouse/ClickHouse/pull/80210) ([Pavel Kruglov](https://github.com/Avogar)).
* 新增 `bech32Encode` 和 `bech32Decode` 函数，用于处理比特币的 Bech 算法（问题 [#40381](https://github.com/ClickHouse/ClickHouse/issues/40381)）。 [#80239](https://github.com/ClickHouse/ClickHouse/pull/80239) ([George Larionov](https://github.com/glarik)).
* 添加分析 MergeTree 数据片段名称的 SQL 函数。 [#80573](https://github.com/ClickHouse/ClickHouse/pull/80573) ([Mikhail Artemenko](https://github.com/Michicosun)).
* 引入新虚拟列 `_disk_name`，允许按数据片段所在的磁盘筛选查询选中的数据片段。 [#80650](https://github.com/ClickHouse/ClickHouse/pull/80650) ([tanner-bruce](https://github.com/tanner-bruce)).
* 添加列出内嵌 Web 工具的入口页面。具有浏览器风格 User-Agent 的请求将打开该页面。 [#81129](https://github.com/ClickHouse/ClickHouse/pull/81129) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 函数 `arrayFirst`、`arrayFirstIndex`、`arrayLast` 和 `arrayLastIndex` 会滤除筛选表达式返回的 NULL 值。此前不支持 Nullable 类型的筛选结果。修复了 [#81113](https://github.com/ClickHouse/ClickHouse/issues/81113)。 [#81197](https://github.com/ClickHouse/ClickHouse/pull/81197) ([Lennard Eijsackers](https://github.com/Blokje5)).
* 现在可以使用 `USE DATABASE name` 代替 `USE name`。 [#81307](https://github.com/ClickHouse/ClickHouse/pull/81307) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 新增系统表 `system.codecs`，用于查看可用编解码器。（问题 [#81525](https://github.com/ClickHouse/ClickHouse/issues/81525)）。 [#81600](https://github.com/ClickHouse/ClickHouse/pull/81600) ([Jimmy Aguilar Mena](https://github.com/Ergus)).
* 支持窗口函数 `lag` 和 `lead`。解决了 [#9887](https://github.com/ClickHouse/ClickHouse/issues/9887)。 [#82108](https://github.com/ClickHouse/ClickHouse/pull/82108) ([Dmitry Novik](https://github.com/novikd)).
* 函数 `tokens` 现在支持名为 `split` 的新分词器，适合处理日志。 [#80195](https://github.com/ClickHouse/ClickHouse/pull/80195) ([Robert Schulze](https://github.com/rschu1ze)).
* `clickhouse-local` 支持 `--database` 参数，可切换到此前创建的数据库。解决了 [#44115](https://github.com/ClickHouse/ClickHouse/issues/44115)。 [#81465](https://github.com/ClickHouse/ClickHouse/pull/81465) ([Alexey Milovidov](https://github.com/alexey-milovidov)).

#### 实验性功能

* 使用 ClickHouse Keeper 为 `Kafka2` 实现类似 Kafka 再平衡的逻辑。每个副本支持两类分区锁：永久锁和临时锁。副本会尽可能长期持有永久锁；任何时刻，副本上的永久锁数量都不超过 `all_topic_partitions / active_replicas_count`（其中 `all_topic_partitions` 为所有分区的数量，`active_replicas_count` 为活跃副本数）；如果超出，副本会释放部分分区。一些分区由副本临时持有。每个副本的临时锁数量上限会动态变化，让其他副本有机会将部分分区转为永久持有。更新临时锁时，副本会先全部释放，再尝试获取其他分区。 [#78726](https://github.com/ClickHouse/ClickHouse/pull/78726) ([Daria Fomina](https://github.com/sinfillo)).
* 改进实验性文本索引：支持通过键值对显式指定参数。目前支持必填参数 `tokenizer`，以及两个可选参数 `max_rows_per_postings_list` 和 `ngram_size`。 [#80262](https://github.com/ClickHouse/ClickHouse/pull/80262) ([Elmi Ahmadov](https://github.com/ahmadov)).
* 此前，全文索引不支持 `packed` 存储，因为段 ID 会通过读写磁盘上的 `.gin_sid` 文件即时更新。打包存储不支持从尚未提交的文件读取值，从而导致问题。现在已解决。 [#80852](https://github.com/ClickHouse/ClickHouse/pull/80852) ([Elmi Ahmadov](https://github.com/ahmadov)).
* 将实验性 `gin` 类型索引（我不喜欢这个名称，因为它是 PostgreSQL 黑客之间的内部玩笑）重命名为 `text`。已有 `gin` 类型索引仍可加载，但尝试用于搜索时会抛出异常，并建议改用 `text` 索引。 [#80855](https://github.com/ClickHouse/ClickHouse/pull/80855) ([Robert Schulze](https://github.com/rschu1ze)).

#### 性能改进

* 启用多投影筛选支持，允许使用多个投影在数据片段级别进行筛选。解决了 [#55525](https://github.com/ClickHouse/ClickHouse/issues/55525)。这是继 [#78429](https://github.com/ClickHouse/ClickHouse/issues/78429) 之后实现投影索引的第二步。 [#80343](https://github.com/ClickHouse/ClickHouse/pull/80343) ([Amos Bird](https://github.com/amosbird)).
* 文件系统缓存默认使用 `SLRU` 缓存策略。 [#75072](https://github.com/ClickHouse/ClickHouse/pull/75072) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 移除查询执行流水线中 Resize 步骤的竞争。 [#77562](https://github.com/ClickHouse/ClickHouse/pull/77562) ([Zhiguo Zhou](https://github.com/ZhiguoZh)).
* 引入选项，将数据块的压缩、解压、序列化和反序列化工作转交给流水线线程，而非全部由网络连接关联的单个线程处理。由设置 `enable_parallel_blocks_marshalling` 控制，预计可加快发起节点和远程节点之间传输大量数据的分布式查询。 [#78694](https://github.com/ClickHouse/ClickHouse/pull/78694) ([Nikita Taranov](https://github.com/nickitat)).
* 提高所有 Bloom filter 类型的性能。[OpenHouse 大会视频](https://www.youtube.com/watch?v=yIVz0NKwQvA\&pp=ygUQb3BlbmhvdXNlIG9wZW5haQ%3D%3D) [#79800](https://github.com/ClickHouse/ClickHouse/pull/79800) ([Delyan Kratunov](https://github.com/dkratunov)).
* 在 `UniqExactSet::merge` 中，为其中一个集合为空的情况引入快速路径。另外，当左侧集合为两级、右侧为单级时，不再将右侧转换为两级。 [#79971](https://github.com/ClickHouse/ClickHouse/pull/79971) ([Nikita Taranov](https://github.com/nickitat)).
* 使用两级哈希表时，提高内存复用效率并减少缺页，以加快 GROUP BY。 [#80245](https://github.com/ClickHouse/ClickHouse/pull/80245) ([Jiebin Sun](https://github.com/jiebinn)).
* 避免查询条件缓存中的不必要更新，并减少锁竞争。 [#80247](https://github.com/ClickHouse/ClickHouse/pull/80247) ([Jiebin Sun](https://github.com/jiebinn)).
* 对 `concatenateBlocks` 做小幅优化，可能有益于 Parallel Hash Join。 [#80328](https://github.com/ClickHouse/ClickHouse/pull/80328) ([李扬](https://github.com/taiyang-li)).
* 从主键范围选择标记范围时，如果主键被函数包裹，原先无法使用二分查找。此 PR 改进这一限制：当主键被始终单调的函数链包裹，或逆波兰表达式中包含恒为真的元素时，仍可使用二分查找。解决了 [#45536](https://github.com/ClickHouse/ClickHouse/issues/45536)。 [#80597](https://github.com/ClickHouse/ClickHouse/pull/80597) ([zoomxi](https://github.com/zoomxi)).
* 提高 `Kafka` 引擎的关闭速度（存在多张 `Kafka` 表时，移除额外的 3 秒延迟）。 [#80796](https://github.com/ClickHouse/ClickHouse/pull/80796) ([Azat Khuzhin](https://github.com/azat)).
* 异步插入：减少内存使用并提高插入查询性能。 [#80972](https://github.com/ClickHouse/ClickHouse/pull/80972) ([Raúl Marín](https://github.com/Algunenano)).
* 如果日志表已禁用，则不对处理器进行性能分析，以加快极短查询。 [#81256](https://github.com/ClickHouse/ClickHouse/pull/81256) ([Raúl Marín](https://github.com/Algunenano)).
* 当源数据恰好符合请求要求时，加快 `toFixedString`。 [#81257](https://github.com/ClickHouse/ClickHouse/pull/81257) ([Raúl Marín](https://github.com/Algunenano)).
* 如果用户没有配额限制，则不处理配额值，以加快极短查询。 [#81549](https://github.com/ClickHouse/ClickHouse/pull/81549) ([Raúl Marín](https://github.com/Algunenano)).
* 修复内存跟踪中的性能退化。 [#81694](https://github.com/ClickHouse/ClickHouse/pull/81694) ([Michael Kolupaev](https://github.com/al13n321)).
* 改进分布式查询中的分片键优化。 [#78452](https://github.com/ClickHouse/ClickHouse/pull/78452) ([fhw12345](https://github.com/fhw12345)).
* 并行副本：如果所有读取任务已分配给其他副本，则避免等待缓慢且未使用的副本。 [#80199](https://github.com/ClickHouse/ClickHouse/pull/80199) ([Igor Nikonov](https://github.com/devcrafter)).
* 并行副本使用独立的连接超时，参见设置 `parallel_replicas_connect_timeout_ms`。此前，并行副本查询使用 `connect_timeout_with_failover_ms`/`connect_timeout_with_failover_secure_ms` 的连接超时值（默认 1 秒）。 [#80421](https://github.com/ClickHouse/ClickHouse/pull/80421) ([Igor Nikonov](https://github.com/devcrafter)).
* 在带日志的文件系统中，`mkdir` 会写入文件系统日志并持久化到磁盘。如果磁盘较慢，这可能耗时很长。将其移出预留锁的作用范围。 [#81371](https://github.com/ClickHouse/ClickHouse/pull/81371) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 将 Iceberg 清单文件的读取延后至第一次读取查询。 [#81619](https://github.com/ClickHouse/ClickHouse/pull/81619) ([Daniil Ivanik](https://github.com/divanik)).
* 在适用情况下，允许将 `GLOBAL [NOT] IN` 谓词移至 `PREWHERE` 子句。 [#79996](https://github.com/ClickHouse/ClickHouse/pull/79996) ([Eduard Karacharov](https://github.com/korowa)).

#### 改进

* `EXPLAIN SYNTAX` 现在使用新 Analyzer，返回根据查询树构建的 AST。新增选项 `query_tree_passes`，控制将查询树转换为 AST 之前执行的处理轮数。 [#74536](https://github.com/ClickHouse/ClickHouse/pull/74536) ([Vladimir Cherkasov](https://github.com/vdimir)).
* 为 Native 格式中的 Dynamic 和 JSON 实现展平序列化，无需 Dynamic 的共享变体或 JSON 的共享数据等特殊结构即可序列化与反序列化。可通过设置 `output_format_native_use_flattened_dynamic_and_json_serialization` 启用，使不同语言的客户端更容易在 TCP 协议中支持 Dynamic 和 JSON。 [#80499](https://github.com/ClickHouse/ClickHouse/pull/80499) ([Pavel Kruglov](https://github.com/Avogar)).
* 发生 `AuthenticationRequired` 错误后刷新 `S3` 凭据。 [#77353](https://github.com/ClickHouse/ClickHouse/pull/77353) ([Vitaly Baranov](https://github.com/vitlibar)).
* 向 `system.asynchronous_metrics` 添加字典指标：— `DictionaryMaxUpdateDelay`：字典更新的最大延迟（秒）。— `DictionaryTotalFailedUpdates`：所有字典自上次成功加载以来的错误次数。 [#78175](https://github.com/ClickHouse/ClickHouse/pull/78175) ([Vlad](https://github.com/codeworse)).
* 对可能为保存损坏表而创建的数据库添加警告。 [#78841](https://github.com/ClickHouse/ClickHouse/pull/78841) ([János Benjamin Antal](https://github.com/antaljanosbenjamin)).
* 为 `S3Queue` 和 `AzureQueue` 引擎添加 `_time` 虚拟列。 [#78926](https://github.com/ClickHouse/ClickHouse/pull/78926) ([Anton Ivashkin](https://github.com/ianton-ru)).
* 使控制 CPU 过载时断开连接的设置支持热重载。 [#79052](https://github.com/ClickHouse/ClickHouse/pull/79052) ([Alexey Katsman](https://github.com/alexkats)).
* 为 system.tables 中报告的 Azure Blob 存储普通磁盘数据路径添加容器前缀，使报告结果与 S3 和 GCP 一致。 [#79241](https://github.com/ClickHouse/ClickHouse/pull/79241) ([Julia Kartseva](https://github.com/jkartseva)).
* clickhouse-client 和 clickhouse-local 现在除了 `param_<name>`（下划线）外，也接受 `param-<name>`（连字符）形式的查询参数。解决了 [#63093](https://github.com/ClickHouse/ClickHouse/issues/63093)。 [#79429](https://github.com/ClickHouse/ClickHouse/pull/79429) ([Engel Danila](https://github.com/aaaengel)).
* 在启用校验和时，将数据从本地复制到远程 S3 会降低有效带宽；为此提供更详细的警告消息。 [#79464](https://github.com/ClickHouse/ClickHouse/pull/79464) ([VicoWu](https://github.com/VicoWu)).
* 此前，`input_format_parquet_max_block_size = 0`（无效值）会使 ClickHouse 卡住。现在已修复。解决了 [#79394](https://github.com/ClickHouse/ClickHouse/issues/79394)。 [#79601](https://github.com/ClickHouse/ClickHouse/pull/79601) ([abashkeev](https://github.com/abashkeev)).
* 为 `startup_scripts` 添加 `throw_on_error` 设置：当 `throw_on_error` 为 true 时，只有所有查询都成功完成，服务器才会启动。默认 `throw_on_error` 为 false，保留此前行为。 [#79732](https://github.com/ClickHouse/ClickHouse/pull/79732) ([Aleksandr Musorin](https://github.com/AVMusorin)).
* 允许为任意类型的 `http_handlers` 添加 `http_response_headers`。 [#79975](https://github.com/ClickHouse/ClickHouse/pull/79975) ([Andrey Zvonov](https://github.com/zvonand)).
* 函数 `reverse` 现在支持 `Tuple` 数据类型。解决了 [#80053](https://github.com/ClickHouse/ClickHouse/issues/80053)。 [#80083](https://github.com/ClickHouse/ClickHouse/pull/80083) ([flynn](https://github.com/ucasfl)).
* 解决 [#75817](https://github.com/ClickHouse/ClickHouse/issues/75817)：允许从 `system.zookeeper` 表获取 `auxiliary_zookeepers` 数据。 [#80146](https://github.com/ClickHouse/ClickHouse/pull/80146) ([Nikolay Govorov](https://github.com/mrdimidium)).
* 添加服务器 TCP 套接字相关的异步指标，增强可观测性。解决了 [#80187](https://github.com/ClickHouse/ClickHouse/issues/80187)。 [#80188](https://github.com/ClickHouse/ClickHouse/pull/80188) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 支持将 `anyLast_respect_nulls` 和 `any_respect_nulls` 用作 `SimpleAggregateFunction`。 [#80219](https://github.com/ClickHouse/ClickHouse/pull/80219) ([Diskein](https://github.com/Diskein)).
* 移除复制数据库中不必要的 `adjustCreateQueryForBackup` 调用。 [#80282](https://github.com/ClickHouse/ClickHouse/pull/80282) ([Vitaly Baranov](https://github.com/vitlibar)).
* 允许 `clickhouse-local` 的额外选项（位于 `--` 之后，例如 `-- --config.value='abc'`）不使用等号。解决了 [#80292](https://github.com/ClickHouse/ClickHouse/issues/80292)。 [#80293](https://github.com/ClickHouse/ClickHouse/pull/80293) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 高亮显示 `SHOW ... LIKE` 查询中的元字符。解决了 [#80275](https://github.com/ClickHouse/ClickHouse/issues/80275)。 [#80297](https://github.com/ClickHouse/ClickHouse/pull/80297) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 使 `clickhouse-local` 中的 SQL UDF 持久化；此前创建的函数会在启动时加载。解决了 [#80085](https://github.com/ClickHouse/ClickHouse/issues/80085)。 [#80300](https://github.com/ClickHouse/ClickHouse/pull/80300) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复 EXPLAIN 执行计划中初步 DISTINCT 步骤的描述。 [#80330](https://github.com/ClickHouse/ClickHouse/pull/80330) ([UnamedRus](https://github.com/UnamedRus)).
* 允许在 ODBC/JDBC 中使用命名集合。 [#80334](https://github.com/ClickHouse/ClickHouse/pull/80334) ([Andrey Zvonov](https://github.com/zvonand)).
* 添加只读磁盘和损坏磁盘数量的指标，并在 DiskLocalCheckThread 启动时记录提示日志。 [#80391](https://github.com/ClickHouse/ClickHouse/pull/80391) ([VicoWu](https://github.com/VicoWu)).
* 实现 `s3_plain_rewritable` 存储对投影的支持。此前，S3 中引用投影的元数据对象在移动时不会更新。解决了 [#70258](https://github.com/ClickHouse/ClickHouse/issues/70258)。 [#80393](https://github.com/ClickHouse/ClickHouse/pull/80393) ([Sav](https://github.com/sberss)).
* `SYSTEM UNFREEZE` 命令不再尝试在只读或仅可写入一次的磁盘上查找数据片段。解决了 [#80430](https://github.com/ClickHouse/ClickHouse/issues/80430)。 [#80432](https://github.com/ClickHouse/ClickHouse/pull/80432) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 降低已合并数据片段消息的日志级别。 [#80476](https://github.com/ClickHouse/ClickHouse/pull/80476) ([Hans Krutzer](https://github.com/hkrutzer)).
* 修改 Iceberg 表分区裁剪的默认行为。 [#80583](https://github.com/ClickHouse/ClickHouse/pull/80583) ([Melvyn Peignon](https://github.com/melvynator)).
* 添加两个 ProfileEvents 以观察索引搜索算法：`IndexBinarySearchAlgorithm` 和 `IndexGenericExclusionSearchAlgorithm`。 [#80679](https://github.com/ClickHouse/ClickHouse/pull/80679) ([Pablo Marcos](https://github.com/pamarcos)).
* 在旧内核上，不再记录不支持 `MADV_POPULATE_WRITE` 的警告，以避免污染日志。 [#80704](https://github.com/ClickHouse/ClickHouse/pull/80704) ([Robert Schulze](https://github.com/rschu1ze)).
* `TTL` 表达式支持 `Date32` 和 `DateTime64`。 [#80710](https://github.com/ClickHouse/ClickHouse/pull/80710) ([Andrey Zvonov](https://github.com/zvonand)).
* 调整 `max_merge_delayed_streams_for_parallel_write` 的兼容性值。 [#80760](https://github.com/ClickHouse/ClickHouse/pull/80760) ([Azat Khuzhin](https://github.com/azat)).
* 修复一个崩溃：在析构函数中尝试删除临时文件（用于将临时数据溢写到磁盘）时，如果抛出异常，程序可能终止。 [#80776](https://github.com/ClickHouse/ClickHouse/pull/80776) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 为 `SYSTEM SYNC REPLICA` 添加 `IF EXISTS` 修饰符。 [#80810](https://github.com/ClickHouse/ClickHouse/pull/80810) ([Raúl Marín](https://github.com/Algunenano)).
* 扩展“Having zero bytes, but read range is not finished...”异常消息，并为 `system.filesystem_cache` 添加 finished\_download\_time 列。 [#80849](https://github.com/ClickHouse/ClickHouse/pull/80849) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 在 indexes = 1 时，为 `EXPLAIN` 输出添加搜索算法部分，显示“binary search”（二分查找）或“generic exclusion search”（通用排除搜索）。 [#80881](https://github.com/ClickHouse/ClickHouse/pull/80881) ([Pablo Marcos](https://github.com/pamarcos)).
* 2024 年初，由于新 Analyzer 尚未默认启用，MySQL 处理器将 `prefer_column_name_to_alias` 硬编码为 true。现在可以移除这一硬编码。 [#80916](https://github.com/ClickHouse/ClickHouse/pull/80916) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* `system.iceberg_history` 现在显示 Glue 或 Iceberg REST 等目录数据库的历史。同时，将 `system.iceberg_history` 中的 `table_name` 和 `database_name` 列分别重命名为 `table` 和 `database`，以保持一致。 [#80975](https://github.com/ClickHouse/ClickHouse/pull/80975) ([alesapin](https://github.com/alesapin)).
* 允许 `merge` 表函数在只读模式下使用，因此使用它不再需要 `CREATE TEMPORARY TABLE` 权限。 [#80981](https://github.com/ClickHouse/ClickHouse/pull/80981) ([Miсhael Stetsyuk](https://github.com/mstetsyuk)).
* 改进内存缓存内部状态查看：在 `system.metrics` 中公开缓存信息，替代不完整的 `system.asynchronouse_metrics`。在 `dashboard.html` 中添加内存缓存大小（字节）。将 `VectorSimilarityIndexCacheSize`/`IcebergMetadataFilesCacheSize` 重命名为 `VectorSimilarityIndexCacheBytes`/`IcebergMetadataFilesCacheBytes`。 [#81023](https://github.com/ClickHouse/ClickHouse/pull/81023) ([Azat Khuzhin](https://github.com/azat)).
* 读取 `system.rocksdb` 时，忽略其引擎不可能包含 `RocksDB` 表的数据库。 [#81083](https://github.com/ClickHouse/ClickHouse/pull/81083) ([Pervakov Grigorii](https://github.com/GrigoryPervakov)).
* 允许在 `clickhouse-local` 配置文件中使用 `filesystem_caches` 和 `named_collections`。 [#81105](https://github.com/ClickHouse/ClickHouse/pull/81105) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复 `INSERT` 查询中 `PARTITION BY` 的高亮显示。此前，`PARTITION BY` 未被作为关键字高亮。 [#81106](https://github.com/ClickHouse/ClickHouse/pull/81106) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Web UI 的两个小改进：— 正确处理 `CREATE`、`INSERT` 等没有输出的查询（直到最近，这类查询还会导致加载指示器无限旋转）。— 双击表时，滚动到顶部。 [#81131](https://github.com/ClickHouse/ClickHouse/pull/81131) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* `MemoryResidentWithoutPageCache` 指标表示服务器进程使用的物理内存量，不含用户空间页缓存，单位为字节。使用用户空间页缓存时，它能更准确地反映实际内存使用。禁用用户空间页缓存时，此值等于 `MemoryResident`。 [#81233](https://github.com/ClickHouse/ClickHouse/pull/81233) ([Jayme Bird](https://github.com/jaymebrd)).
* 将客户端、本地服务器、Keeper 客户端和 disks 应用中手动记录的异常标记为已记录，防止重复记录。 [#81271](https://github.com/ClickHouse/ClickHouse/pull/81271) ([Miсhael Stetsyuk](https://github.com/mstetsyuk)).
* 设置 `use_skip_indexes_if_final` 和 `use_skip_indexes_if_final_exact_mode` 的默认值现在为 `True`。带 `FINAL` 子句的查询现在会在适用时使用跳过索引筛选数据粒度，并额外读取与匹配主键范围对应的数据粒度。需要恢复此前近似、不精确结果行为的用户，可在仔细评估后将 `use_skip_indexes_if_final_exact_mode` 设为 FALSE。 [#81331](https://github.com/ClickHouse/ClickHouse/pull/81331) ([Shankar Iyer](https://github.com/shankar-iyer)).
* Web UI 中有多条查询时，将执行光标所在的查询。延续了 [#80977](https://github.com/ClickHouse/ClickHouse/issues/80977) 的工作。 [#81354](https://github.com/ClickHouse/ClickHouse/pull/81354) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 此 PR 修复转换函数单调性检查中 `is_strict` 的实现问题。当前某些转换函数，例如 `toFloat64(UInt32)` 和 `toDate(UInt8)`，本应返回 true，却错误地将 `is_strict` 返回为 false。 [#81359](https://github.com/ClickHouse/ClickHouse/pull/81359) ([zoomxi](https://github.com/zoomxi)).
* 检查 `KeyCondition` 是否匹配连续范围时，如果键被非严格单调的函数链包裹，可能需要将 `Constraint::POINT` 转换为 `Constraint::RANGE`。例如，`toDate(event_time) = '2025-06-03'` 隐含 `event_time` 的范围为 \['2025-06-03 00:00:00', '2025-06-04 00:00:00')。此 PR 修复了该行为。 [#81400](https://github.com/ClickHouse/ClickHouse/pull/81400) ([zoomxi](https://github.com/zoomxi)).
* 指定 `--host` 或 `--port` 时，`clickhouse`/`ch` 别名将调用 `clickhouse-client` 而非 `clickhouse-local`。延续了 [#79422](https://github.com/ClickHouse/ClickHouse/issues/79422) 的工作。解决了 [#65252](https://github.com/ClickHouse/ClickHouse/issues/65252)。 [#81509](https://github.com/ClickHouse/ClickHouse/pull/81509) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 现在已有 Keeper 响应时间分布数据，可以据此调整指标的直方图桶。 [#81516](https://github.com/ClickHouse/ClickHouse/pull/81516) ([Miсhael Stetsyuk](https://github.com/mstetsyuk)).
* 添加性能分析事件 `PageCacheReadBytes`。 [#81742](https://github.com/ClickHouse/ClickHouse/pull/81742) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复文件系统缓存中的逻辑错误：“Having zero bytes but range is not finished”（字节数为零但范围尚未完成）。 [#81868](https://github.com/ClickHouse/ClickHouse/pull/81868) ([Kseniia Sumarokova](https://github.com/kssenii)).

#### 缺陷修复（正式稳定版本中用户可见的异常行为）

* 修复包含 SELECT EXCEPT 查询的参数化视图。解决了 [#49447](https://github.com/ClickHouse/ClickHouse/issues/49447)。 [#57380](https://github.com/ClickHouse/ClickHouse/pull/57380) ([Nikolay Degterinsky](https://github.com/evillique)).
* Analyzer：修复 JOIN 中列类型提升后的投影列名称。解决了 [#63345](https://github.com/ClickHouse/ClickHouse/issues/63345)。 [#63519](https://github.com/ClickHouse/ClickHouse/pull/63519) ([Dmitry Novik](https://github.com/novikd)).
* 修复启用 analyzer\_compatibility\_join\_using\_top\_level\_identifier 时，列名冲突导致的逻辑错误。 [#75676](https://github.com/ClickHouse/ClickHouse/pull/75676) ([Vladimir Cherkasov](https://github.com/vdimir)).
* 修复启用 `allow_push_predicate_ast_for_distributed_subqueries` 时，下推谓词中的 CTE 使用。修复了 [#75647](https://github.com/ClickHouse/ClickHouse/issues/75647)。修复了 [#79672](https://github.com/ClickHouse/ClickHouse/issues/79672)。 [#77316](https://github.com/ClickHouse/ClickHouse/pull/77316) ([Dmitry Novik](https://github.com/novikd)).
* 修复 SYSTEM SYNC REPLICA LIGHTWEIGHT 'foo' 即使指定副本不存在也报告成功的问题。命令现在会在尝试同步前，正确校验副本是否存在于 Keeper 中。 [#78405](https://github.com/ClickHouse/ClickHouse/pull/78405) ([Jayme Bird](https://github.com/jaymebrd)).
* 修复一个非常特定场景下的崩溃：在 `ON CLUSTER` 查询的 `CONSTRAINT` 部分使用 `currentDatabase` 函数。解决了 [#78100](https://github.com/ClickHouse/ClickHouse/issues/78100)。 [#79070](https://github.com/ClickHouse/ClickHouse/pull/79070) ([pufit](https://github.com/pufit)).
* 修复服务器间查询中的外部角色传递。 [#79099](https://github.com/ClickHouse/ClickHouse/pull/79099) ([Andrey Zvonov](https://github.com/zvonand)).
* 尝试在 SingleValueDataGeneric 中使用 IColumn 代替 Field，修复 `argMax` 等聚合函数对 `Dynamic/Variant/JSON` 类型返回错误值的问题。 [#79166](https://github.com/ClickHouse/ClickHouse/pull/79166) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复 Azure Blob 存储中 use\_native\_copy 和 allow\_azure\_native\_copy 设置的应用，并改为仅在凭据匹配时使用原生复制。解决了 [#78964](https://github.com/ClickHouse/ClickHouse/issues/78964)。 [#79561](https://github.com/ClickHouse/ClickHouse/pull/79561) ([Smita Kulkarni](https://github.com/SmitaRKulkarni)).
* 修复检查列是否为相关列时，因列的来源作用域未知而产生的逻辑错误。修复了 [#78183](https://github.com/ClickHouse/ClickHouse/issues/78183)。修复了 [#79451](https://github.com/ClickHouse/ClickHouse/issues/79451)。 [#79727](https://github.com/ClickHouse/ClickHouse/pull/79727) ([Dmitry Novik](https://github.com/novikd)).
* 修复 ColumnConst 与 Analyzer 配合使用时分组集的错误结果。 [#79743](https://github.com/ClickHouse/ClickHouse/pull/79743) ([Andrey Zvonov](https://github.com/zvonand)).
* 修复本地副本过期时，从分布式表读取导致本地分片结果重复的问题。 [#79761](https://github.com/ClickHouse/ClickHouse/pull/79761) ([Eduard Karacharov](https://github.com/korowa)).
* 修复符号位为负的 NaN 的排序顺序。 [#79847](https://github.com/ClickHouse/ClickHouse/pull/79847) ([Pervakov Grigorii](https://github.com/GrigoryPervakov)).
* GROUP BY ALL 现在不再考虑 GROUPING 部分。 [#79915](https://github.com/ClickHouse/ClickHouse/pull/79915) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 修复 `TopK` / `TopKWeighted` 函数的状态合并错误；该错误会导致即使容量尚未耗尽，也出现过大的误差值。 [#79939](https://github.com/ClickHouse/ClickHouse/pull/79939) ([Joel Höner](https://github.com/athre0z)).
* `azure_blob_storage` 对象存储遵循 `readonly` 设置。 [#79954](https://github.com/ClickHouse/ClickHouse/pull/79954) ([Julia Kartseva](https://github.com/jkartseva)).
* 修复使用带反斜杠转义字符的 `match(column, '^…')` 时，查询结果错误和内存耗尽崩溃的问题。 [#79969](https://github.com/ClickHouse/ClickHouse/pull/79969) ([filimonov](https://github.com/filimonov)).
* 为数据湖禁用 Hive 分区。部分解决了 [https://github.com/issues/assigned?issue=ClickHouse%7CClickHouse%7C79937](https://github.com/issues/assigned?issue=ClickHouse%7CClickHouse%7C79937)。 [#80005](https://github.com/ClickHouse/ClickHouse/pull/80005) ([Daniil Ivanik](https://github.com/divanik)).
* 此前无法应用含 lambda 表达式的跳过索引。修复索引定义中的高阶函数与查询中的函数完全一致时的情况。 [#80025](https://github.com/ClickHouse/ClickHouse/pull/80025) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 副本根据复制日志执行 ATTACH\_PART 命令时，修复附加数据片段过程中的元数据版本。 [#80038](https://github.com/ClickHouse/ClickHouse/pull/80038) ([Aleksei Filatov](https://github.com/aalexfvk)).
* 与其他函数不同，可执行用户自定义函数（eUDF）的名称此前未加入 `system.query_log` 表的 `used_functions` 列。此 PR 在请求使用 eUDF 时记录其名称。 [#80073](https://github.com/ClickHouse/ClickHouse/pull/80073) ([Kyamran](https://github.com/nibblerenush)).
* 修复 Arrow 格式使用 LowCardinality(FixedString) 时的逻辑错误。 [#80156](https://github.com/ClickHouse/ClickHouse/pull/80156) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复从 Merge 引擎读取子列的问题。 [#80158](https://github.com/ClickHouse/ClickHouse/pull/80158) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复 `KeyCondition` 中数值类型比较的缺陷。 [#80207](https://github.com/ClickHouse/ClickHouse/pull/80207) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 修复对含投影的表应用延迟物化时的 AMBIGUOUS\_COLUMN\_NAME 错误。 [#80251](https://github.com/ClickHouse/ClickHouse/pull/80251) ([Igor Nikonov](https://github.com/devcrafter)).
* 修复使用隐式投影时，对 LIKE 'ab\_c%' 等字符串前缀筛选进行错误计数优化的问题。修复了 [#80250](https://github.com/ClickHouse/ClickHouse/issues/80250)。 [#80261](https://github.com/ClickHouse/ClickHouse/pull/80261) ([Amos Bird](https://github.com/amosbird)).
* 修复 MongoDB 文档中嵌套数值字段被错误地序列化为字符串的问题。移除 MongoDB 文档的最大深度限制。 [#80289](https://github.com/ClickHouse/ClickHouse/pull/80289) ([Kirill Nikiforov](https://github.com/allmazz)).
* 对 Replicated 数据库中的 RMT 执行较宽松的元数据检查。解决了 [#80296](https://github.com/ClickHouse/ClickHouse/issues/80296)。 [#80298](https://github.com/ClickHouse/ClickHouse/pull/80298) ([Nikolay Degterinsky](https://github.com/evillique)).
* 修复 PostgreSQL 存储中 DateTime 和 DateTime64 的文本表示。 [#80301](https://github.com/ClickHouse/ClickHouse/pull/80301) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* 允许在 `StripeLog` 表中使用带时区的 `DateTime`。解决了 [#44120](https://github.com/ClickHouse/ClickHouse/issues/44120)。 [#80304](https://github.com/ClickHouse/ClickHouse/pull/80304) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 当查询计划步骤会改变行数时，禁止对含非确定性函数的谓词执行筛选条件下推。修复了 [#40273](https://github.com/ClickHouse/ClickHouse/issues/40273)。 [#80329](https://github.com/ClickHouse/ClickHouse/pull/80329) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复含子列的投影中可能出现的逻辑错误和崩溃。 [#80333](https://github.com/ClickHouse/ClickHouse/pull/80333) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复当 `ON` 表达式不是简单等值条件时，逻辑 JOIN 步骤的筛选条件下推优化导致的 `NOT_FOUND_COLUMN_IN_BLOCK` 错误。修复了 [#79647](https://github.com/ClickHouse/ClickHouse/issues/79647)。修复了 [#77848](https://github.com/ClickHouse/ClickHouse/issues/77848)。 [#80360](https://github.com/ClickHouse/ClickHouse/pull/80360) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复在分区表中读取降序键时结果错误的问题。修复了 [#79987](https://github.com/ClickHouse/ClickHouse/issues/79987)。 [#80448](https://github.com/ClickHouse/ClickHouse/pull/80448) ([Amos Bird](https://github.com/amosbird)).
* 修复可空键表在启用 optimize\_read\_in\_order 时排序错误的问题。 [#80515](https://github.com/ClickHouse/ClickHouse/pull/80515) ([Pervakov Grigorii](https://github.com/GrigoryPervakov)).
* 修复使用 SYSTEM STOP REPLICATED VIEW 暂停可刷新物化视图后，DROP 该视图会卡住的问题。 [#80543](https://github.com/ClickHouse/ClickHouse/pull/80543) ([Michael Kolupaev](https://github.com/al13n321)).
* 修复分布式查询使用常量元组时出现的“Cannot find column”（找不到列）错误。 [#80596](https://github.com/ClickHouse/ClickHouse/pull/80596) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* 修复 Distributed 表在启用 `join_use_nulls` 时的 `shardNum` 函数。 [#80612](https://github.com/ClickHouse/ClickHouse/pull/80612) ([János Benjamin Antal](https://github.com/antaljanosbenjamin)).
* 修复 Merge 引擎读取仅在部分底层表中存在的列时结果错误的问题。 [#80643](https://github.com/ClickHouse/ClickHouse/pull/80643) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复可能出现的 SSH 协议问题（由 replxx 挂起导致）。 [#80688](https://github.com/ClickHouse/ClickHouse/pull/80688) ([Azat Khuzhin](https://github.com/azat)).
* iceberg\_history 表中的时间戳现在应当正确。 [#80711](https://github.com/ClickHouse/ClickHouse/pull/80711) ([Melvyn Peignon](https://github.com/melvynator)).
* 修复字典注册失败时可能发生的崩溃（当 `CREATE DICTIONARY` 因 `CANNOT_SCHEDULE_TASK` 失败时，字典注册表可能残留悬空指针，随后引发崩溃）。 [#80714](https://github.com/ClickHouse/ClickHouse/pull/80714) ([Azat Khuzhin](https://github.com/azat)).
* 修复对象存储表函数对单元素枚举通配模式的处理。 [#80716](https://github.com/ClickHouse/ClickHouse/pull/80716) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 修复 Tuple(Dynamic) 与 String 比较函数的结果类型错误，避免因此产生的逻辑错误。 [#80728](https://github.com/ClickHouse/ClickHouse/pull/80728) ([Pavel Kruglov](https://github.com/Avogar)).
* 为 Unity Catalog 添加缺失的 `timestamp_ntz` 数据类型支持。修复了 [#79535](https://github.com/ClickHouse/ClickHouse/issues/79535) 和 [#79875](https://github.com/ClickHouse/ClickHouse/issues/79875)。 [#80740](https://github.com/ClickHouse/ClickHouse/pull/80740) ([alesapin](https://github.com/alesapin)).
* 修复带 `IN cte` 的分布式查询出现的 `THERE_IS_NO_COLUMN` 错误。修复了 [#75032](https://github.com/ClickHouse/ClickHouse/issues/75032)。 [#80757](https://github.com/ClickHouse/ClickHouse/pull/80757) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复外部 ORDER BY 生成过多文件、导致内存使用过高的问题。 [#80777](https://github.com/ClickHouse/ClickHouse/pull/80777) ([Azat Khuzhin](https://github.com/azat)).
* 此 PR 可能解决 [#80742](https://github.com/ClickHouse/ClickHouse/issues/80742)。 [#80783](https://github.com/ClickHouse/ClickHouse/pull/80783) ([zoomxi](https://github.com/zoomxi)).
* 修复 Kafka 中 get\_member\_id() 从 NULL 构造 std::string 导致的崩溃（很可能仅在连接代理失败时出现）。 [#80793](https://github.com/ClickHouse/ClickHouse/pull/80793) ([Azat Khuzhin](https://github.com/azat)).
* 关闭 Kafka 引擎之前正确等待消费者结束（关闭后仍活跃的消费者可能触发各种调试断言，也可能在表已删除或分离后继续在后台读取代理数据）。 [#80795](https://github.com/ClickHouse/ClickHouse/pull/80795) ([Azat Khuzhin](https://github.com/azat)).
* 修复由 `predicate-push-down` 优化导致的 `NOT_FOUND_COLUMN_IN_BLOCK`。修复了 [#80443](https://github.com/ClickHouse/ClickHouse/issues/80443)。 [#80834](https://github.com/ClickHouse/ClickHouse/pull/80834) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复带 USING 的 JOIN 中，解析表函数内星号（\*）匹配器时的逻辑错误。 [#80894](https://github.com/ClickHouse/ClickHouse/pull/80894) ([Vladimir Cherkasov](https://github.com/vdimir)).
* 修复 Iceberg 元数据文件缓存的内存统计。 [#80904](https://github.com/ClickHouse/ClickHouse/pull/80904) ([Azat Khuzhin](https://github.com/azat)).
* 修复使用可空分区键时分区错误的问题。 [#80913](https://github.com/ClickHouse/ClickHouse/pull/80913) ([Pervakov Grigorii](https://github.com/GrigoryPervakov)).
* 修复下推谓词的分布式查询（`allow_push_predicate_ast_for_distributed_subqueries=1`）中，源表在发起节点上不存在时出现的 `Table does not exist` 错误。修复了 [#77281](https://github.com/ClickHouse/ClickHouse/issues/77281)。 [#80915](https://github.com/ClickHouse/ClickHouse/pull/80915) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复使用命名窗口的嵌套函数中的逻辑错误。 [#80926](https://github.com/ClickHouse/ClickHouse/pull/80926) ([Pervakov Grigorii](https://github.com/GrigoryPervakov)).
* 修复可空列和浮点列的极值计算。 [#80970](https://github.com/ClickHouse/ClickHouse/pull/80970) ([Pervakov Grigorii](https://github.com/GrigoryPervakov)).
* 修复查询 system.tables 时可能出现的崩溃（可能发生在内存压力较大时）。 [#80976](https://github.com/ClickHouse/ClickHouse/pull/80976) ([Azat Khuzhin](https://github.com/azat)).
* 修复根据扩展名推断压缩格式的文件，在截断时进行原子重命名的问题。 [#80979](https://github.com/ClickHouse/ClickHouse/pull/80979) ([Pablo Marcos](https://github.com/pamarcos)).
* 修复 ErrorCodes::getName。 [#81032](https://github.com/ClickHouse/ClickHouse/pull/81032) ([RinChanNOW](https://github.com/RinChanNOWWW)).
* 修复用户没有所有表的权限时无法列举 Unity Catalog 表的问题。现在能够正确列出所有表，尝试读取受限表时会抛出异常。 [#81044](https://github.com/ClickHouse/ClickHouse/pull/81044) ([alesapin](https://github.com/alesapin)).
* ClickHouse 现在会在 `SHOW TABLES` 查询中忽略来自数据湖目录的错误和意外响应。修复了 [#79725](https://github.com/ClickHouse/ClickHouse/issues/79725)。 [#81046](https://github.com/ClickHouse/ClickHouse/pull/81046) ([alesapin](https://github.com/alesapin)).
* 修复 JSONExtract 和 JSON 类型解析中从整数解析 DateTime64 的问题。 [#81050](https://github.com/ClickHouse/ClickHouse/pull/81050) ([Pavel Kruglov](https://github.com/Avogar)).
* 在结构推断缓存中体现 date\_time\_input\_format 设置。 [#81052](https://github.com/ClickHouse/ClickHouse/pull/81052) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复查询已开始但尚未发送列时表被 DROP，随后 INSERT 崩溃的问题。 [#81053](https://github.com/ClickHouse/ClickHouse/pull/81053) ([Azat Khuzhin](https://github.com/azat)).
* 修复 quantileDeterministic 使用未初始化值的问题。 [#81062](https://github.com/ClickHouse/ClickHouse/pull/81062) ([Azat Khuzhin](https://github.com/azat)).
* 修复 metadatastoragefromdisk 磁盘事务中的硬链接计数管理，并添加测试。 [#81066](https://github.com/ClickHouse/ClickHouse/pull/81066) ([Sema Checherinda](https://github.com/CheSema)).
* 与其他函数不同，用户自定义函数（UDF）的名称此前未加入 `system.query_log` 表。此 PR 在请求使用 UDF 时，将其名称加入 `used_executable_user_defined_functions` 或 `used_sql_user_defined_functions` 两列之一。 [#81101](https://github.com/ClickHouse/ClickHouse/pull/81101) ([Kyamran](https://github.com/nibblerenush)).
* 修复通过 HTTP 协议以文本格式（`JSON`、`Values` 等）插入、且省略 `Enum` 字段时出现的 `Too large size ... passed to allocator` 错误或潜在崩溃。 [#81145](https://github.com/ClickHouse/ClickHouse/pull/81145) ([Anton Popov](https://github.com/CurtizJ)).
* 修复包含 Sparse 列的 INSERT 数据块推送到非 MergeTree 物化视图时的 LOGICAL\_ERROR。 [#81161](https://github.com/ClickHouse/ClickHouse/pull/81161) ([Azat Khuzhin](https://github.com/azat)).
* 修复交叉复制场景中 `distributed_product_mode_local=local` 时出现的 `Unknown table expression identifier` 错误。 [#81162](https://github.com/ClickHouse/ClickHouse/pull/81162) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复筛选后错误缓存 Parquet 文件行数的问题。 [#81184](https://github.com/ClickHouse/ClickHouse/pull/81184) ([Michael Kolupaev](https://github.com/al13n321)).
* 修复使用相对缓存路径时文件系统缓存 max\_size\_to\_total\_space 设置的问题。 [#81237](https://github.com/ClickHouse/ClickHouse/pull/81237) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复 clickhouse-local 以 Parquet 格式输出常量元组或 Map 时的崩溃。 [#81249](https://github.com/ClickHouse/ClickHouse/pull/81249) ([Michael Kolupaev](https://github.com/al13n321)).
* 校验通过网络接收的数组偏移量。 [#81269](https://github.com/ClickHouse/ClickHouse/pull/81269) ([Azat Khuzhin](https://github.com/azat)).
* 修复连接空表并使用窗口函数的查询中的边界情况。该缺陷会导致并行流数量激增，进而造成内存耗尽。 [#81299](https://github.com/ClickHouse/ClickHouse/pull/81299) ([Alexander Gololobov](https://github.com/davenger)).
* 修复数据湖 Cluster 函数（`deltaLakeCluster`、`icebergCluster` 等）：（1）修复使用旧 Analyzer 的 `Cluster` 函数时 `DataLakeConfiguration` 中可能出现的段错误；（2）移除重复的数据湖元数据更新及额外对象存储请求；（3）修复未显式指定格式时对象存储中的多余列举操作（非集群数据湖引擎此前已修复）。 [#81300](https://github.com/ClickHouse/ClickHouse/pull/81300) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 使 force\_restore\_data 标志恢复丢失的 Keeper 元数据。 [#81324](https://github.com/ClickHouse/ClickHouse/pull/81324) ([Raúl Marín](https://github.com/Algunenano)).
* 修复 delta-kernel 中的区域错误。修复了 [#79914](https://github.com/ClickHouse/ClickHouse/issues/79914)。 [#81353](https://github.com/ClickHouse/ClickHouse/pull/81353) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 禁用 divideOrNull 不正确的 JIT 编译。 [#81370](https://github.com/ClickHouse/ClickHouse/pull/81370) ([Raúl Marín](https://github.com/Algunenano)).
* 修复 MergeTree 表分区列名称较长时的插入错误。 [#81390](https://github.com/ClickHouse/ClickHouse/pull/81390) ([hy123q](https://github.com/haoyangqian)).
* 已在 [#81957](https://github.com/ClickHouse/ClickHouse/issues/81957) 中向旧版本移植：修复合并期间抛出异常时 `Aggregator` 可能发生的崩溃。 [#81450](https://github.com/ClickHouse/ClickHouse/pull/81450) ([Nikita Taranov](https://github.com/nickitat)).
* 不在内存中同时保存多个清单文件的内容。 [#81470](https://github.com/ClickHouse/ClickHouse/pull/81470) ([Daniil Ivanik](https://github.com/divanik)).
* 修复关闭后台线程池（`background_.*pool_size`）时可能出现的崩溃。 [#81473](https://github.com/ClickHouse/ClickHouse/pull/81473) ([Azat Khuzhin](https://github.com/azat)).
* 修复向 `URL` 引擎表写入时 `Npy` 格式发生的越界读取。解决了 [#81356](https://github.com/ClickHouse/ClickHouse/issues/81356)。 [#81502](https://github.com/ClickHouse/ClickHouse/pull/81502) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复 Web UI 有时显示 `NaN%` 的问题（典型的 JavaScript 问题）。 [#81507](https://github.com/ClickHouse/ClickHouse/pull/81507) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复 `database_replicated_enforce_synchronous_settings=1` 时的 `DatabaseReplicated`。 [#81564](https://github.com/ClickHouse/ClickHouse/pull/81564) ([Azat Khuzhin](https://github.com/azat)).
* 修复 LowCardinality(Nullable(...)) 类型的排序顺序。 [#81583](https://github.com/ClickHouse/ClickHouse/pull/81583) ([Pervakov Grigorii](https://github.com/GrigoryPervakov)).
* 如果尚未从套接字完整读取请求，服务器不应保留该 HTTP 连接。 [#81595](https://github.com/ClickHouse/ClickHouse/pull/81595) ([Sema Checherinda](https://github.com/CheSema)).
* 使标量相关子查询返回投影表达式的可空结果，修复相关子查询产生空结果集的情况。 [#81632](https://github.com/ClickHouse/ClickHouse/pull/81632) ([Dmitry Novik](https://github.com/novikd)).
* 修复向 `ReplicatedMergeTree` 执行 `ATTACH` 时出现的 `Unexpected relative path for a deduplicated part` 错误。 [#81647](https://github.com/ClickHouse/ClickHouse/pull/81647) ([Azat Khuzhin](https://github.com/azat)).
* 查询设置 `use_iceberg_partition_pruning` 此前对 Iceberg 存储不生效，因为它使用全局上下文而不是查询上下文。由于默认值为 true，此问题并不严重。此 PR 修复了该问题。 [#81673](https://github.com/ClickHouse/ClickHouse/pull/81673) ([Han Fei](https://github.com/hanfei1991)).
* 已在 [#82128](https://github.com/ClickHouse/ClickHouse/issues/82128) 中向旧版本移植：修复 TTL 表达式使用字典时，合并期间出现的“Context has expired”（上下文已失效）错误。 [#81690](https://github.com/ClickHouse/ClickHouse/pull/81690) ([Azat Khuzhin](https://github.com/azat)).
* 为 MergeTree 设置 `merge_max_block_size` 添加校验，确保其不为零。 [#81693](https://github.com/ClickHouse/ClickHouse/pull/81693) ([Bharat Nallan](https://github.com/bharatnc)).
* 修复 `clickhouse-local` 中 `DROP VIEW ` 查询卡住的问题。 [#81705](https://github.com/ClickHouse/ClickHouse/pull/81705) ([Bharat Nallan](https://github.com/bharatnc)).
* 修复某些情况下 StorageRedis 的 JOIN。 [#81736](https://github.com/ClickHouse/ClickHouse/pull/81736) ([Pervakov Grigorii](https://github.com/GrigoryPervakov)).
* 修复启用旧 Analyzer 时，`ConcurrentHashJoin` 遇到空 `USING ()` 的崩溃。 [#81754](https://github.com/ClickHouse/ClickHouse/pull/81754) ([Nikita Taranov](https://github.com/nickitat)).
* Keeper 修复：日志中存在无效条目时，阻止提交新日志。此前，领导者错误应用部分日志后仍会继续提交新日志，尽管跟随者会检测到摘要不匹配并终止。 [#81780](https://github.com/ClickHouse/ClickHouse/pull/81780) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复处理标量相关子查询时未读取必需列的问题。修复了 [#81716](https://github.com/ClickHouse/ClickHouse/issues/81716)。 [#81805](https://github.com/ClickHouse/ClickHouse/pull/81805) ([Dmitry Novik](https://github.com/novikd)).
* 有人把 Kusto 代码散落在我们的代码中。现已清理。解决了 [#81643](https://github.com/ClickHouse/ClickHouse/issues/81643)。 [#81885](https://github.com/ClickHouse/ClickHouse/pull/81885) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 此前，服务器对 `/js` 请求返回了过多内容。解决了 [#61890](https://github.com/ClickHouse/ClickHouse/issues/61890)。 [#81895](https://github.com/ClickHouse/ClickHouse/pull/81895) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 此前，`MongoDB` 表引擎定义的 `host:port` 参数可以包含路径部分，但会被静默忽略。MongoDB 集成拒绝加载此类表。此次修复在 `MongoDB` 引擎具有五个参数时，*允许加载这些表并忽略路径部分*，使用参数中指定的数据库名称。*注意：*此修复不适用于新创建的表、使用 `mongo` 表函数的查询、字典源或命名集合。 [#81942](https://github.com/ClickHouse/ClickHouse/pull/81942) ([Vladimir Cherkasov](https://github.com/vdimir)).
* 修复合并期间抛出异常时 `Aggregator` 可能发生的崩溃。 [#82022](https://github.com/ClickHouse/ClickHouse/pull/82022) ([Nikita Taranov](https://github.com/nickitat)).
* 修复 `arraySimilarity` 中的复制粘贴错误，禁止使用 `UInt32` 和 `Int32` 权重，并更新测试和文档。 [#82103](https://github.com/ClickHouse/ClickHouse/pull/82103) ([Mikhail f. Shiryaev](https://github.com/Felixoid)).
* 修复补全建议线程与客户端主线程之间可能存在的数据竞争。 [#82233](https://github.com/ClickHouse/ClickHouse/pull/82233) ([Azat Khuzhin](https://github.com/azat)).

#### 构建、测试与打包改进

* 使用 `postgres` 16.9。 [#81437](https://github.com/ClickHouse/ClickHouse/pull/81437) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 使用 `openssl` 3.2.4。 [#81438](https://github.com/ClickHouse/ClickHouse/pull/81438) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 使用 `abseil-cpp` 2025-01-27。 [#81440](https://github.com/ClickHouse/ClickHouse/pull/81440) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 使用 `mongo-c-driver` 1.30.4。 [#81449](https://github.com/ClickHouse/ClickHouse/pull/81449) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 使用 `krb5` 1.21.3-final。 [#81453](https://github.com/ClickHouse/ClickHouse/pull/81453) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 使用 `orc` 2.1.2。 [#81455](https://github.com/ClickHouse/ClickHouse/pull/81455) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 使用 `grpc` 1.73.0。 [#81629](https://github.com/ClickHouse/ClickHouse/pull/81629) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 使用 `delta-kernel-rs` v0.12.1。 [#81707](https://github.com/ClickHouse/ClickHouse/pull/81707) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 将 `c-ares` 更新至 `v1.34.5`。 [#81159](https://github.com/ClickHouse/ClickHouse/pull/81159) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 将 `curl` 升级至 8.14，修复 CVE-2025-5025 和 CVE-2025-4947。 [#81171](https://github.com/ClickHouse/ClickHouse/pull/81171) ([larryluogit](https://github.com/larryluogit)).
* 将 `libarchive` 升级至 3.7.9，修复 CVE-2024-20696、CVE-2025-25724、CVE-2024-48958、CVE-2024-57970、CVE-2025-1632、CVE-2024-48957 和 CVE-2024-48615。 [#81174](https://github.com/ClickHouse/ClickHouse/pull/81174) ([larryluogit](https://github.com/larryluogit)).
* 将 `libxml2` 升级至 2.14.3。 [#81187](https://github.com/ClickHouse/ClickHouse/pull/81187) ([larryluogit](https://github.com/larryluogit)).
* 避免将仓库内附带的 Rust 源码复制到 `CARGO_HOME`。 [#79560](https://github.com/ClickHouse/ClickHouse/pull/79560) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 以我们自己的端点替代 Sentry 库，移除对该库的依赖。 [#80236](https://github.com/ClickHouse/ClickHouse/pull/80236) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 更新 CI 镜像中的 Python 依赖，以处理 Dependabot 告警。 [#80658](https://github.com/ClickHouse/ClickHouse/pull/80658) ([Raúl Marín](https://github.com/Algunenano)).
* 启动时重试从 Keeper 读取复制 DDL 停止标志，以提高启用 Keeper 故障注入时测试的稳健性。 [#80964](https://github.com/ClickHouse/ClickHouse/pull/80964) ([Alexander Gololobov](https://github.com/davenger)).
* Ubuntu 归档 URL 使用 HTTPS。 [#81016](https://github.com/ClickHouse/ClickHouse/pull/81016) ([Raúl Marín](https://github.com/Algunenano)).
* 更新测试镜像中的 Python 依赖。 [#81042](https://github.com/ClickHouse/ClickHouse/pull/81042) ([dependabot\[bot\]](https://github.com/apps/dependabot)).
* 为 Nix 构建引入 `flake.nix`。 [#81463](https://github.com/ClickHouse/ClickHouse/pull/81463) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 修复 `delta-kernel-rs` 构建期间需要网络访问的问题。解决了 [#80609](https://github.com/ClickHouse/ClickHouse/issues/80609)。 [#81602](https://github.com/ClickHouse/ClickHouse/pull/81602) ([Konstantin Bogdanov](https://github.com/thevar1able)). 参阅文章 [ClickHouse 使用 Rust 的一年](https://clickhouse.com/blog/rust)。
