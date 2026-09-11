<h3 id="2310">
  <a id="2310" /> ClickHouse 23.10 版本, 2023-11-02. [演示文稿](https://presentations.clickhouse.com/2023-release-23.10/), [视频](https://www.youtube.com/watch?v=PGQS6uPb970)
</h3>

<Frame>
  <iframe src="https://www.youtube.com/embed/PGQS6uPb970" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
</Frame>

<h4 id="backward-incompatible-change-2">
  向后不兼容变更
</h4>

* 不再提供自动移除损坏数据片段的选项。关闭 [#55174](https://github.com/ClickHouse/ClickHouse/issues/55174)。 [#55184](https://github.com/ClickHouse/ClickHouse/pull/55184) ([Alexey Milovidov](https://github.com/alexey-milovidov)). [#55557](https://github.com/ClickHouse/ClickHouse/pull/55557) ([Jihyuk Bok](https://github.com/tomahawk28))。
* 已废弃的内存数据片段不再能从预写日志中读取。如果此前配置过内存数据片段，必须在升级前移除。 [#55186](https://github.com/ClickHouse/ClickHouse/pull/55186) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 移除 Meilisearch 集成，因为它仅兼容旧版 0.18，近期版本更改了协议，已无法工作。欢迎协助恢复此集成。 [#55189](https://github.com/ClickHouse/ClickHouse/pull/55189) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 将“目录监视器”概念更名为“后台 INSERT”。所有 `*directory_monitor*` 设置重命名为 `distributed_background_insert*`。*应保持向后兼容*，因为旧设置已保留为别名。 [#55978](https://github.com/ClickHouse/ClickHouse/pull/55978) ([Azat Khuzhin](https://github.com/azat)).
* 不再将客户端设置的 `send_timeout` 解释为服务器的 `receive_timeout`，反之亦然。 [#56035](https://github.com/ClickHouse/ClickHouse/pull/56035) ([Azat Khuzhin](https://github.com/azat)).
* 比较不同单位的时间间隔将抛出异常。关闭 [#55942](https://github.com/ClickHouse/ClickHouse/issues/55942)。你可能曾无意依赖旧行为，即忽略单位、直接比较底层数值。 [#56090](https://github.com/ClickHouse/ClickHouse/pull/56090) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 完全重写实验性 `S3Queue` 表引擎：更改 ZooKeeper 信息保存方式以减少请求；在已知状态不会变化时缓存 ZooKeeper 状态；降低 S3 轮询的频繁程度；调整跟踪文件的 TTL 和集合上限维护方式，改为后台处理。新增 `system.s3queue` 和 `system.s3queue_log` 表。关闭 [#54998](https://github.com/ClickHouse/ClickHouse/issues/54998)。 [#54422](https://github.com/ClickHouse/ClickHouse/pull/54422) ([Kseniia Sumarokova](https://github.com/kssenii)).
* HTTP 端点上的任意路径不再被解释为对 `/query` 端点的请求。 [#55521](https://github.com/ClickHouse/ClickHouse/pull/55521) ([Konstantin Bogdanov](https://github.com/thevar1able)).

<h4 id="new-feature-2">
  新功能
</h4>

* 新增 `arrayFold(accumulator, x1, ..., xn -> expression, initial, array1, ..., arrayn)`，将 lambda 函数应用于多个等长数组，并在累加器中收集结果。 [#49794](https://github.com/ClickHouse/ClickHouse/pull/49794) ([Lirikl](https://github.com/Lirikl)).
* 支持 `Npy` 格式，例如 `SELECT * FROM file('example_array.npy', Npy)`。 [#55982](https://github.com/ClickHouse/ClickHouse/pull/55982) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 如果表键使用空间填充曲线，例如 `ORDER BY mortonEncode(x, y)`，其参数上的条件（如 `x >= 10 AND x <= 20 AND y >= 20 AND y <= 30`）可用于索引。新增 `analyze_index_with_space_filling_curves` 设置控制该分析。关闭 [#41195](https://github.com/ClickHouse/ClickHouse/issue/41195)。延续 [#4538](https://github.com/ClickHouse/ClickHouse/pull/4538)、[#6286](https://github.com/ClickHouse/ClickHouse/pull/6286)、[#28130](https://github.com/ClickHouse/ClickHouse/pull/28130)、[#41753](https://github.com/ClickHouse/ClickHouse/pull/#41753)。 [#55642](https://github.com/ClickHouse/ClickHouse/pull/55642) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 新增 `force_optimize_projection_name` 设置，参数为投影名称。若值为非空字符串，ClickHouse 会检查查询至少使用一次该投影。关闭 [#55331](https://github.com/ClickHouse/ClickHouse/issues/55331)。 [#56134](https://github.com/ClickHouse/ClickHouse/pull/56134) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 支持通过原生协议使用外部数据进行异步插入，此前仅支持数据内嵌于查询的情况。 [#54730](https://github.com/ClickHouse/ClickHouse/pull/54730) ([Anton Popov](https://github.com/CurtizJ)).
* 新增聚合函数 `lttb`，使用 [Largest-Triangle-Three-Buckets](https://skemman.is/bitstream/1946/15343/3/SS_MSthesis.pdf) 算法对可视化数据降采样。 [#53145](https://github.com/ClickHouse/ClickHouse/pull/53145) ([Sinan](https://github.com/sinsinan)).
* `CHECK TABLE` 性能和易用性改善，可发送进度更新并取消。支持用 `CHECK TABLE ... PART 'part_name'` 检查特定数据片段。 [#53404](https://github.com/ClickHouse/ClickHouse/pull/53404) ([vdimir](https://github.com/vdimir)).
* 新增 `jsonMergePatch` 函数。以字符串处理 JSON 数据时，可将多个 JSON 对象字符串合并为包含单个 JSON 对象的字符串。 [#54364](https://github.com/ClickHouse/ClickHouse/pull/54364) ([Memo](https://github.com/Joeywzr)).
* Kusto 查询语言方言支持的第二部分。[第一阶段实现](https://github.com/ClickHouse/ClickHouse/pull/37961) 已合并。 [#42510](https://github.com/ClickHouse/ClickHouse/pull/42510) ([larryluogit](https://github.com/larryluogit)).
* 新增 SQL 函数 `arrayRandomSample(arr, k)`，从输入数组抽取 k 个元素。此前只能通过较不方便的语法实现类似功能，例如 “SELECT arrayReduce('groupArraySample(3)', range(10))”。 [#54391](https://github.com/ClickHouse/ClickHouse/pull/54391) ([itayisraelov](https://github.com/itayisraelov)).
* 引入 `-ArgMin`/`-ArgMax` 聚合组合器，仅对最小/最大值对应的数据聚合。用例见 [#54818](https://github.com/ClickHouse/ClickHouse/issues/54818)。此 PR 还将组合器整理到独立目录。 [#54947](https://github.com/ClickHouse/ClickHouse/pull/54947) ([Amos Bird](https://github.com/amosbird)).
* 允许通过 `SYSTEM DROP SCHEMA FORMAT CACHE [FOR Protobuf]` 清除 Protobuf 格式缓存。 [#55064](https://github.com/ClickHouse/ClickHouse/pull/55064) ([Aleksandr Musorin](https://github.com/AVMusorin)).
* 新增外部 HTTP Basic 认证器。 [#55199](https://github.com/ClickHouse/ClickHouse/pull/55199) ([Aleksei Filatov](https://github.com/aalexfvk)).
* 新增 `byteSwap` 函数，反转无符号整数的字节顺序，尤其适合处理 IPv4 等内部表示为无符号整数的类型。 [#55211](https://github.com/ClickHouse/ClickHouse/pull/55211) ([Priyansh Agrawal](https://github.com/Priyansh121096)).
* 新增 `formatQuery` 函数，返回 SQL 查询字符串的格式化版本，可能包含多行；同时新增 `formatQuerySingleLine`，功能相同但返回字符串不包含换行。 [#55239](https://github.com/ClickHouse/ClickHouse/pull/55239) ([Salvatore Mesoraca](https://github.com/aiven-sal)).
* 新增 `DWARF` 输入格式，从 ELF 可执行文件、库或目标文件中读取调试符号。 [#55450](https://github.com/ClickHouse/ClickHouse/pull/55450) ([Michael Kolupaev](https://github.com/al13n321)).
* 允许 RabbitMQ、NATS 和 FileLog 引擎保存未解析记录和错误。新增虚拟列 `_error`，以及用于 NATS/RabbitMQ 的 `_raw_message`、用于 FileLog 的 `_raw_record`，在解析新记录失败时填充。行为分别由 NATS 的 `nats_handle_error_mode`、RabbitMQ 的 `rabbitmq_handle_error_mode`、FileLog 的 `handle_error_mode` 控制，类似于 `kafka_handle_error_mode`。设为 `default` 时解析失败会抛出异常；设为 `stream` 时将错误与原始记录保存到虚拟列。关闭 [#36035](https://github.com/ClickHouse/ClickHouse/issues/36035)。 [#55477](https://github.com/ClickHouse/ClickHouse/pull/55477) ([Kruglov Pavel](https://github.com/Avogar)).
* Keeper 客户端改进：新增 `get_all_children_number command`，返回指定路径下全部后代节点数量。 [#55485](https://github.com/ClickHouse/ClickHouse/pull/55485) ([guoxiaolong](https://github.com/guoxiaolongzte)).
* Keeper 客户端改进：新增 `get_direct_children_number` 命令，返回路径下直接子节点数量。 [#55898](https://github.com/ClickHouse/ClickHouse/pull/55898) ([xuzifu666](https://github.com/xuzifu666)).
* 新增 `SHOW SETTING setting_name` 语句，是现有 `SHOW SETTINGS` 的简化版本。 [#55979](https://github.com/ClickHouse/ClickHouse/pull/55979) ([Maksim Kita](https://github.com/kitaisreal)).
* 为 `system.parts_columns` 表新增 `substreams` 和 `filenames` 字段。 [#55108](https://github.com/ClickHouse/ClickHouse/pull/55108) ([Anton Popov](https://github.com/CurtizJ)).
* 支持 `SHOW MERGES` 查询。 [#55815](https://github.com/ClickHouse/ClickHouse/pull/55815) ([megao](https://github.com/jetgm)).
* 新增 `create_table_empty_primary_key_by_default` 设置，允许默认使用 `ORDER BY ()`。 [#55899](https://github.com/ClickHouse/ClickHouse/pull/55899) ([Srikanth Chekuri](https://github.com/srikanthccv)).

<h4 id="performance-improvement-2">
  性能改进
</h4>

* 新增 `query_plan_preserve_num_streams_after_window_functions` 选项，在窗口函数求值后保留流数量，以支持并行流处理。 [#50771](https://github.com/ClickHouse/ClickHouse/pull/50771) ([frinkr](https://github.com/frinkr)).
* 数据较少时释放更多流。 [#53867](https://github.com/ClickHouse/ClickHouse/pull/53867) ([Jiebin Sun](https://github.com/jiebinn)).
* 序列化前优化 RoaringBitmap。 [#55044](https://github.com/ClickHouse/ClickHouse/pull/55044) ([UnamedRus](https://github.com/UnamedRus)).
* 倒排索引的倒排列表现在为内部位图使用尽可能紧凑的表示。根据数据重复程度，这可能显著减少倒排索引的空间占用。 [#55069](https://github.com/ClickHouse/ClickHouse/pull/55069) ([Harry Lee](https://github.com/HarryLeeIBM)).
* 修复 Context 锁竞争，显著提升大量短时并发查询的性能。 [#55121](https://github.com/ClickHouse/ClickHouse/pull/55121) ([Maksim Kita](https://github.com/kitaisreal)).
* 通过用 `absl::flat_hash_map` 替换 `std::unordered_map`，将倒排索引创建性能提升 30%。 [#55210](https://github.com/ClickHouse/ClickHouse/pull/55210) ([Harry Lee](https://github.com/HarryLeeIBM)).
* 支持 ORC 行组级过滤器下推。 [#55330](https://github.com/ClickHouse/ClickHouse/pull/55330) ([李扬](https://github.com/taiyang-li)).
* 改善存在大量临时文件时的外部聚合性能。 [#55489](https://github.com/ClickHouse/ClickHouse/pull/55489) ([Maksim Kita](https://github.com/kitaisreal)).
* 默认为二级索引标记缓存设置合理大小，避免反复加载标记。 [#55654](https://github.com/ClickHouse/ClickHouse/pull/55654) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 读取数据跳过索引时避免不必要地重建索引粒度单元。解决 [#55653](https://github.com/ClickHouse/ClickHouse/issues/55653#issuecomment-1763766009)。 [#55683](https://github.com/ClickHouse/ClickHouse/pull/55683) ([Amos Bird](https://github.com/amosbird)).
* 执行期间在集合中缓存 CAST 函数，以提升集合元素类型与列类型不完全匹配时 `IN` 的性能。 [#55712](https://github.com/ClickHouse/ClickHouse/pull/55712) ([Duc Canh Le](https://github.com/canhld94)).
* 提升 `ColumnVector::insertMany` 和 `ColumnVector::insertManyFrom` 的性能。 [#55714](https://github.com/ClickHouse/ClickHouse/pull/55714) ([frinkr](https://github.com/frinkr)).
* 通过预测下一行键的位置，减少比较次数，优化 Map 下标操作。 [#55929](https://github.com/ClickHouse/ClickHouse/pull/55929) ([lgbo](https://github.com/lgbo-ustc)).
* 支持 Parquet 结构体字段裁剪，此前部分情况下不生效。 [#56117](https://github.com/ClickHouse/ClickHouse/pull/56117) ([lgbo](https://github.com/lgbo-ustc)).
* 支持根据预计读取行数调整查询执行使用的并行副本数量。 [#51692](https://github.com/ClickHouse/ClickHouse/pull/51692) ([Raúl Marín](https://github.com/Algunenano)).
* 优化生成大量临时文件时外部聚合的内存消耗。 [#54798](https://github.com/ClickHouse/ClickHouse/pull/54798) ([Nikita Taranov](https://github.com/nickitat)).
* 默认的 `async_socket_for_remote` 模式下，分布式查询现在遵循 `max_threads` 限制。此前部分查询可能创建过多线程，最多达到 `max_distributed_connections`，导致服务器性能问题。 [#53504](https://github.com/ClickHouse/ClickHouse/pull/53504) ([filimonov](https://github.com/filimonov)).
* 执行 ZooKeeper 分布式 DDL 队列中的 DDL 时，缓存可跳过的条目。 [#54828](https://github.com/ClickHouse/ClickHouse/pull/54828) ([Duc Canh Le](https://github.com/canhld94)).
* 实验性倒排索引不存储匹配过多行的词元，即倒排列表中过多的行 ID，以节省空间，并避免顺序扫描同样快或更快时的无效索引查找。此前控制是否存储词元的启发式规则（索引定义中的 `density` 参数）让用户难以理解。现引入更简单的 `max_rows_per_postings_list` 参数，默认 64k，直接控制单个倒排列表允许的最大行 ID 数。 [#55616](https://github.com/ClickHouse/ClickHouse/pull/55616) ([Harry Lee](https://github.com/HarryLeeIBM)).
* 提升向 `EmbeddedRocksDB` 表写入的性能。 [#55732](https://github.com/ClickHouse/ClickHouse/pull/55732) ([Duc Canh Le](https://github.com/canhld94)).
* 改善单分区包含大量数据片段（超过 1000）时 ClickHouse 的整体稳健性，可能减少 `TOO_MANY_PARTS` 错误。 [#55526](https://github.com/ClickHouse/ClickHouse/pull/55526) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* 减少层次字典加载期间的内存消耗。 [#55838](https://github.com/ClickHouse/ClickHouse/pull/55838) ([Nikita Taranov](https://github.com/nickitat)).
* 所有字典支持 `dictionary_use_async_executor` 设置。 [#55839](https://github.com/ClickHouse/ClickHouse/pull/55839) ([vdimir](https://github.com/vdimir)).
* 防止反序列化 AggregateFunctionTopKGenericData 时内存使用过量。 [#55947](https://github.com/ClickHouse/ClickHouse/pull/55947) ([Raúl Marín](https://github.com/Algunenano)).
* Keeper 包含大量监听时，AsyncMetrics 线程可能在 `DB::KeeperStorage::getSessionsWithWatchesCount` 中持续一段时间占满 CPU。修复方法是避免遍历庞大的 `watches` 和 `list_watches` 集合。 [#56054](https://github.com/ClickHouse/ClickHouse/pull/56054) ([Alexander Gololobov](https://github.com/davenger)).
* 新增 `optimize_trivial_approximate_count_query` 设置，为 EmbeddedRocksDB 使用 `count` 近似值；为 StorageJoin 启用简单计数优化。 [#55806](https://github.com/ClickHouse/ClickHouse/pull/55806) ([Duc Canh Le](https://github.com/canhld94)).

<h4 id="improvement-2">
  改进
</h4>

* `toDayOfWeek`（MySQL 别名 `DAYOFWEEK`）、`toYearWeek`（`YEARWEEK`）和 `toWeek`（`WEEK`）现在支持 `String` 参数，使其行为与 MySQL 一致。 [#55589](https://github.com/ClickHouse/ClickHouse/pull/55589) ([Robert Schulze](https://github.com/rschu1ze)).
* 引入 `date_time_overflow_behavior` 设置，可取 `ignore`、`throw`、`saturate`，控制从 Date、Date32、DateTime64、整数或浮点数转换为 Date、Date32、DateTime、DateTime64 时的溢出行为。 [#55696](https://github.com/ClickHouse/ClickHouse/pull/55696) ([Andrey Zvonov](https://github.com/zvonand)).
* 为 `ALTER TABLE ... ACTION PARTITION [ID] {parameter_name:ParameterType}` 实现查询参数支持。合并 [#49516](https://github.com/ClickHouse/ClickHouse/issues/49516)，关闭 [#49449](https://github.com/ClickHouse/ClickHouse/issues/49449)。 [#55604](https://github.com/ClickHouse/ClickHouse/pull/55604) ([alesapin](https://github.com/alesapin)).
* 在 EXPLAIN 中以更清晰的方式打印处理器 ID。 [#48852](https://github.com/ClickHouse/ClickHouse/pull/48852) ([Vlad Seliverstov](https://github.com/behebot)).
* 创建带 lifetime 字段的 direct 字典时直接拒绝，因为 lifetime 对 direct 字典没有意义。修复 [#27861](https://github.com/ClickHouse/ClickHouse/issues/27861)。 [#49043](https://github.com/ClickHouse/ClickHouse/pull/49043) ([Rory Crispin](https://github.com/RoryCrispin)).
* 允许在 `ALTER TABLE t DROP PARTITION` 等分区查询中使用参数。关闭 [#49449](https://github.com/ClickHouse/ClickHouse/issues/49449)。 [#49516](https://github.com/ClickHouse/ClickHouse/pull/49516) ([Nikolay Degterinsky](https://github.com/evillique)).
* 为 `system.zookeeper_connection` 新增 `xid` 列。 [#50702](https://github.com/ClickHouse/ClickHouse/pull/50702) ([helifu](https://github.com/helifu)).
* 配置重新加载后，`system.server_settings` 显示正确的服务器设置。 [#53774](https://github.com/ClickHouse/ClickHouse/pull/53774) ([helifu](https://github.com/helifu)).
* 查询支持数学减号 `−`，用法与 `-` 相同。 [#54100](https://github.com/ClickHouse/ClickHouse/pull/54100) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 为实验性 `Replicated` 数据库引擎新增副本组。关闭 [#53620](https://github.com/ClickHouse/ClickHouse/issues/53620)。 [#54421](https://github.com/ClickHouse/ClickHouse/pull/54421) ([Nikolay Degterinsky](https://github.com/evillique)).
* 对于可重试的 S3 错误，重试优于直接使查询失败，因此提高 s3\_retry\_attempts 的默认值。 [#54770](https://github.com/ClickHouse/ClickHouse/pull/54770) ([Sema Checherinda](https://github.com/CheSema)).
* 新增负载均衡模式 `hostname_levenshtein_distance`。 [#54826](https://github.com/ClickHouse/ClickHouse/pull/54826) ([JackyWoo](https://github.com/JackyWoo)).
* 改进日志中机密信息的隐藏。 [#55089](https://github.com/ClickHouse/ClickHouse/pull/55089) ([Vitaly Baranov](https://github.com/vitlibar)).
* 投影分析现在仅基于查询计划执行。`query_plan_optimize_projection` 设置已废弃，它很早以前就已默认启用。 [#55112](https://github.com/ClickHouse/ClickHouse/pull/55112) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* `untuple` 对命名元组调用且自身带别名时，例如 `select untuple(tuple(1)::Tuple(element_alias Int)) AS untuple_alias`，结果列名现在由 untuple 别名与元素别名组合生成，本例为 “untuple\_alias.element\_alias”。 [#55123](https://github.com/ClickHouse/ClickHouse/pull/55123) ([garcher22](https://github.com/garcher22)).
* 新增设置 `describe_include_virtual_columns`，允许在 `DESCRIBE` 查询结果中包含表的虚拟列。新增设置 `describe_compact_output`。将其设为 `true` 时，`DESCRIBE` 查询仅返回列名和类型，不附加其他信息。 [#55129](https://github.com/ClickHouse/ClickHouse/pull/55129) ([Anton Popov](https://github.com/CurtizJ)).
* `OPTIMIZE` 配合 `optimize_throw_if_noop=1` 时，有时会以 `unknown reason` 失败，真实原因却是不同数据片段具有不同投影。现已修复。 [#55130](https://github.com/ClickHouse/ClickHouse/pull/55130) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* 允许多个 `MaterializedPostgreSQL` 表跟踪同一 Postgres 表。由于这属于向后不兼容变更，为保持兼容默认未启用，可通过 `materialized_postgresql_use_unique_replication_consumer_identifier` 开启。关闭 [#54918](https://github.com/ClickHouse/ClickHouse/issues/54918)。 [#55145](https://github.com/ClickHouse/ClickHouse/pull/55145) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 允许从短字符串解析带小数部分的负 `DateTime64` 和 `DateTime`。 [#55146](https://github.com/ClickHouse/ClickHouse/pull/55146) ([Andrey Zvonov](https://github.com/zvonand)).
* 改善 MySQL 兼容性：1. `information_schema.tables` 新增 `table_rows`；2. `information_schema.columns` 新增 `extra`。 [#55215](https://github.com/ClickHouse/ClickHouse/pull/55215) ([Robert Schulze](https://github.com/rschu1ze)).
* 行数为零且已抛出异常时，clickhouse-client 不再显示 “0 rows in set”。 [#55240](https://github.com/ClickHouse/ClickHouse/pull/55240) ([Salvatore Mesoraca](https://github.com/aiven-sal)).
* 支持不带 `TABLE` 关键字的重命名语法，例如 `RENAME db.t1 to db.t2`。 [#55373](https://github.com/ClickHouse/ClickHouse/pull/55373) ([凌涛](https://github.com/lingtaolf)).
* 为 `system.clusters` 新增 `internal_replication`。 [#55377](https://github.com/ClickHouse/ClickHouse/pull/55377) ([Konstantin Morozov](https://github.com/k-morozov)).
* 根据请求协议选择远程代理解析器，添加代理功能文档，并移除 `DB::ProxyConfiguration::Protocol::ANY`。 [#55430](https://github.com/ClickHouse/ClickHouse/pull/55430) ([Arthur Passos](https://github.com/arthurpassos)).
* 表关闭后，不再重试 INSERT 中的 Keeper 操作。 [#55519](https://github.com/ClickHouse/ClickHouse/pull/55519) ([Azat Khuzhin](https://github.com/azat)).
* 启用 `use_mysql_types_in_show_columns` 时，`SHOW COLUMNS` 现在正确将 `FixedString` 报告为 `BLOB`。新增 `mysql_map_string_to_text_in_show_columns` 和 `mysql_map_fixed_string_to_text_in_show_columns`，切换 `String`、`FixedString` 的输出为 `TEXT` 或 `BLOB`。 [#55617](https://github.com/ClickHouse/ClickHouse/pull/55617) ([Serge Klochkov](https://github.com/slvrtrn)).
* ReplicatedMergeTree 表启动时，服务器检查意外数据片段，即本地存在但 ZooKeeper 中不存在的片段。将其移至 detached 目录，并尝试恢复某些被覆盖的祖先片段作为替代。现在优先恢复最近的祖先，而非随机选择被覆盖片段。 [#55645](https://github.com/ClickHouse/ClickHouse/pull/55645) ([alesapin](https://github.com/alesapin)).
* 高级仪表盘支持在触摸设备上拖动图表。关闭 [#54206](https://github.com/ClickHouse/ClickHouse/issues/54206)。 [#55649](https://github.com/ClickHouse/ClickHouse/pull/55649) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 使用 `http_write_exception_in_output_format` 输出异常时，如果声明了默认查询格式，则使用该格式。 [#55739](https://github.com/ClickHouse/ClickHouse/pull/55739) ([Raúl Marín](https://github.com/Algunenano)).
* 为常见 MATERIALIZED VIEW 误用提供更清楚的消息。 [#55826](https://github.com/ClickHouse/ClickHouse/pull/55826) ([Raúl Marín](https://github.com/Algunenano)).
* 删除当前数据库后，`clickhouse-local` 仍可执行部分查询并切换到其他数据库，使其行为与 `clickhouse-client` 一致。关闭 [#55834](https://github.com/ClickHouse/ClickHouse/issues/55834)。 [#55853](https://github.com/ClickHouse/ClickHouse/pull/55853) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* `(add|subtract)(Year|Quarter|Month|Week|Day|Hour|Minute|Second|Millisecond|Microsecond|Nanosecond)` 函数现在支持字符串编码的日期参数，例如 `SELECT addDays('2023-10-22', 1)`。这提高 MySQL 兼容性，也是 Tableau Online 所需的能力。 [#55869](https://github.com/ClickHouse/ClickHouse/pull/55869) ([Robert Schulze](https://github.com/rschu1ze)).
* 禁用 `apply_deleted_mask` 时，允许读取被轻量级 DELETE 标记为已删除的行，便于调试。 [#55952](https://github.com/ClickHouse/ClickHouse/pull/55952) ([Alexander Gololobov](https://github.com/davenger)).
* 将元组序列化为 JSON 对象时允许跳过 `null` 值，以兼容 Spark 的 `to_json`，也有助于 Gluten。 [#55956](https://github.com/ClickHouse/ClickHouse/pull/55956) ([李扬](https://github.com/taiyang-li)).
* `(add|sub)Date` 函数支持字符串编码日期参数，例如 `SELECT addDate('2023-10-22 11:12:13', INTERVAL 5 MINUTE)`。加减运算符也支持此类参数，例如 `SELECT '2023-10-23' + INTERVAL 1 DAY`。这提高 MySQL 兼容性，也是 Tableau Online 所需的能力。 [#55960](https://github.com/ClickHouse/ClickHouse/pull/55960) ([Robert Schulze](https://github.com/rschu1ze)).
* CSV 格式允许不带引号且包含回车符 `\r` 的字符串。关闭 [#39930](https://github.com/ClickHouse/ClickHouse/issues/39930)。 [#56046](https://github.com/ClickHouse/ClickHouse/pull/56046) ([Kruglov Pavel](https://github.com/Avogar)).
* 允许使用内嵌配置运行 `clickhouse-keeper`。 [#56086](https://github.com/ClickHouse/ClickHouse/pull/56086) ([Maksim Kita](https://github.com/kitaisreal)).
* 限制 `queued.min.messages` 的最大配置值，避免 Kafka 开始获取数据时出现问题。 [#56121](https://github.com/ClickHouse/ClickHouse/pull/56121) ([Stas Morozov](https://github.com/r3b-fish)).
* 修复 SQL 函数 `minSampleSizeContinous` 的拼写错误，改名为 `minSampleSizeContinuous`；保留旧名以向后兼容。关闭 [#56139](https://github.com/ClickHouse/ClickHouse/issues/56139)。 [#56143](https://github.com/ClickHouse/ClickHouse/pull/56143) ([Dorota Szeremeta](https://github.com/orotaday)).
* 关闭服务器前打印磁盘上损坏数据片段的路径。此前若片段在磁盘上损坏并导致服务器无法启动，几乎无法判断哪个片段损坏，现已修复。 [#56181](https://github.com/ClickHouse/ClickHouse/pull/56181) ([Duc Canh Le](https://github.com/canhld94)).

<h4 id="buildtestingpackaging-improvement-2">
  构建、测试与打包改进
</h4>

* Docker 中的数据库已经初始化时，后续启动不再重复初始化。这可能修复数据库在 1000 次尝试内仍未加载完成而导致容器不断重启的问题，主要涉及超大型数据库和多节点部署。 [#50724](https://github.com/ClickHouse/ClickHouse/pull/50724) ([Alexander Nikolaev](https://github.com/AlexNik)).
* Darwin 特殊构建任务生成包含子模块的源代码资源，可用于无需检出子模块的 ClickHouse 构建。 [#51435](https://github.com/ClickHouse/ClickHouse/pull/51435) ([Ilya Yatsishin](https://github.com/qoega)).
* 全局启用 AVX 系列指令构建 ClickHouse 时曾发生错误（不建议这样构建），原因是 snappy 未启用 `SNAPPY_HAVE_X86_CRC32`。 [#55049](https://github.com/ClickHouse/ClickHouse/pull/55049) ([monchickey](https://github.com/monchickey)).
* 解决从 `clickhouse-server` 安装包启动独立 `clickhouse-keeper` 的问题。 [#55226](https://github.com/ClickHouse/ClickHouse/pull/55226) ([Mikhail f. Shiryaev](https://github.com/Felixoid)).
* 测试中的 RabbitMQ 更新到 3.12.6，并改进测试日志收集。 [#55424](https://github.com/ClickHouse/ClickHouse/pull/55424) ([Ilya Yatsishin](https://github.com/qoega)).
* 调整 OpenSSL 与 BoringSSL 的错误消息差异，修复功能测试。 [#55975](https://github.com/ClickHouse/ClickHouse/pull/55975) ([MeenaRenganathan22](https://github.com/MeenaRenganathan22)).
* Apache DataSketches 改用上游仓库。 [#55787](https://github.com/ClickHouse/ClickHouse/pull/55787) ([Nikita Taranov](https://github.com/nickitat)).

<h4 id="bug-fix-user-visible-misbehavior-in-an-official-stable-release-2">
  缺陷修复（正式稳定版本中用户可见的异常行为）
</h4>

* 变更操作中跳过对倒排索引文件建立硬链接。 [#47663](https://github.com/ClickHouse/ClickHouse/pull/47663) ([cangyin](https://github.com/cangyin)).
* 修复 `match` 正则表达式函数的模式包含交替分支时生成错误键条件的问题。关闭 #53222。 [#54696](https://github.com/ClickHouse/ClickHouse/pull/54696) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* 修复有序读取优化与 ARRAY JOIN 组合时的 “Cannot find column” 错误。 [#51746](https://github.com/ClickHouse/ClickHouse/pull/51746) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 查询支持缺失的实验性 `Object(Nullable(json))` 子列。 [#54052](https://github.com/ClickHouse/ClickHouse/pull/54052) ([zps](https://github.com/VanDarkholme7)).
* 重新加入 `accurateCastOrNull` 修复。 [#54629](https://github.com/ClickHouse/ClickHouse/pull/54629) ([Salvatore Mesoraca](https://github.com/aiven-sal)).
* 修复检测不使用 AS 创建的 Distributed 表列的 `DEFAULT`。 [#55060](https://github.com/ClickHouse/ClickHouse/pull/55060) ([Vitaly Baranov](https://github.com/vitlibar)).
* 在 ShellCommandSource 构造函数抛出异常时正确清理资源。 [#55103](https://github.com/ClickHouse/ClickHouse/pull/55103) ([Alexander Gololobov](https://github.com/davenger)).
* 修复 LDAP 分配的角色更新时发生的死锁。 [#55119](https://github.com/ClickHouse/ClickHouse/pull/55119) ([Julian Maicher](https://github.com/jmaicher)).
* 禁止内部异常更新错误统计信息。 [#55128](https://github.com/ClickHouse/ClickHouse/pull/55128) ([Robert Schulze](https://github.com/rschu1ze)).
* 修复备份中的死锁。 [#55132](https://github.com/ClickHouse/ClickHouse/pull/55132) ([alesapin](https://github.com/alesapin)).
* 修复 Iceberg 存储的文件获取。 [#55144](https://github.com/ClickHouse/ClickHouse/pull/55144) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复集合中额外列的分区裁剪。 [#55172](https://github.com/ClickHouse/ClickHouse/pull/55172) ([Amos Bird](https://github.com/amosbird)).
* 修复表使用自适应粒度时 ALTER UPDATE 查询中跳过索引的重新计算。 [#55202](https://github.com/ClickHouse/ClickHouse/pull/55202) ([Duc Canh Le](https://github.com/canhld94)).
* 修复文件系统缓存中的后台下载。 [#55252](https://github.com/ClickHouse/ClickHouse/pull/55252) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 避免压缩器因未完成缓冲区收尾而可能出现的内存泄漏。 [#55262](https://github.com/ClickHouse/ClickHouse/pull/55262) ([Azat Khuzhin](https://github.com/azat)).
* 修复函数在稀疏列上的执行。 [#55275](https://github.com/ClickHouse/ClickHouse/pull/55275) ([Azat Khuzhin](https://github.com/azat)).
* 修复 SELECT FINAL FROM SummingMergeTree 对 Nested 的错误合并。 [#55276](https://github.com/ClickHouse/ClickHouse/pull/55276) ([Azat Khuzhin](https://github.com/azat)).
* 修复基于 S3 且未启用零拷贝的复制 MergeTree 无法删除已分离分区的缺陷。 [#55309](https://github.com/ClickHouse/ClickHouse/pull/55309) ([alesapin](https://github.com/alesapin)).
* 修复 MergeSortingPartialResultTransform 中的崩溃（由 `remerge` 后没有数据块导致）。 [#55335](https://github.com/ClickHouse/ClickHouse/pull/55335) ([Azat Khuzhin](https://github.com/azat)).
* 修复 CreatingSetsTransform 在出错时因抛出共享异常而发生的数据竞争。 [#55338](https://github.com/ClickHouse/ClickHouse/pull/55338) ([Azat Khuzhin](https://github.com/azat)).
* 修复垃圾数据优化（在一定程度上）。 [#55353](https://github.com/ClickHouse/ClickHouse/pull/55353) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复 StorageHDFS 中的内存泄漏。 [#55370](https://github.com/ClickHouse/ClickHouse/pull/55370) ([Azat Khuzhin](https://github.com/azat)).
* 修复类型转换运算符中数组的解析。 [#55417](https://github.com/ClickHouse/ClickHouse/pull/55417) ([Anton Popov](https://github.com/CurtizJ)).
* 修复查询中使用 OR 筛选条件按虚拟列进行筛选的问题。 [#55418](https://github.com/ClickHouse/ClickHouse/pull/55418) ([Azat Khuzhin](https://github.com/azat)).
* 修复 MongoDB 连接问题。 [#55419](https://github.com/ClickHouse/ClickHouse/pull/55419) ([Nikolay Degterinsky](https://github.com/evillique)).
* 修复 MySQL 接口中布尔值的表示。 [#55427](https://github.com/ClickHouse/ClickHouse/pull/55427) ([Serge Klochkov](https://github.com/slvrtrn)).
* 修复 MySQL 文本协议中 DateTime 的格式化以及 LowCardinality(Nullable(T)) 类型的报告。 [#55479](https://github.com/ClickHouse/ClickHouse/pull/55479) ([Serge Klochkov](https://github.com/slvrtrn)).
* 使 `use_mysql_types_in_show_columns` 仅影响 `SHOW COLUMNS`。 [#55481](https://github.com/ClickHouse/ClickHouse/pull/55481) ([Robert Schulze](https://github.com/rschu1ze)).
* 修复堆栈符号解析器错误解析 `DW_FORM_ref_addr` 并有时发生崩溃的问题。 [#55483](https://github.com/ClickHouse/ClickHouse/pull/55483) ([Michael Kolupaev](https://github.com/al13n321)).
* 当 AsyncTaskExecutor 的 cancelBefore 抛出异常时销毁协程。 [#55516](https://github.com/ClickHouse/ClickHouse/pull/55516) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复查询参数无法用于自定义 HTTP 处理器的问题。 [#55521](https://github.com/ClickHouse/ClickHouse/pull/55521) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 修复 Values 格式对未处理数据的检查。 [#55527](https://github.com/ClickHouse/ClickHouse/pull/55527) ([Azat Khuzhin](https://github.com/azat)).
* 修复通过 ODBC 与 MS SQL Server 交互时出现的“Invalid cursor state”（无效的游标状态）错误。 [#55558](https://github.com/ClickHouse/ClickHouse/pull/55558) ([vdimir](https://github.com/vdimir)).
* 修复最大执行时间和 'break' 溢出模式。 [#55577](https://github.com/ClickHouse/ClickHouse/pull/55577) ([Alexander Gololobov](https://github.com/davenger)).
* 修复 QueryNormalizer 处理循环别名时的崩溃。 [#55602](https://github.com/ClickHouse/ClickHouse/pull/55602) ([vdimir](https://github.com/vdimir)).
* 禁用错误的优化并添加测试。 [#55609](https://github.com/ClickHouse/ClickHouse/pull/55609) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 合并 [#52352](https://github.com/ClickHouse/ClickHouse/issues/52352)。 [#55621](https://github.com/ClickHouse/ClickHouse/pull/55621) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 添加测试以防止 Decimal 排序错误。 [#55662](https://github.com/ClickHouse/ClickHouse/pull/55662) ([Amos Bird](https://github.com/amosbird)).
* 修复 s3 和 azure Cluster 函数在 URL 不含通配符时的进度条。 [#55666](https://github.com/ClickHouse/ClickHouse/pull/55666) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复查询中使用 OR 筛选条件按虚拟列进行筛选的问题（重新提交）。 [#55678](https://github.com/ClickHouse/ClickHouse/pull/55678) ([Azat Khuzhin](https://github.com/azat)).
* 修复并改进 Iceberg 存储。 [#55695](https://github.com/ClickHouse/ClickHouse/pull/55695) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复 CreatingSetsTransform 中的数据竞争（第 2 版）。 [#55786](https://github.com/ClickHouse/ClickHouse/pull/55786) ([Azat Khuzhin](https://github.com/azat)).
* 当 precise\_float\_parsing 为 true 时，将非法字符串解析为浮点数时抛出异常。 [#55861](https://github.com/ClickHouse/ClickHouse/pull/55861) ([李扬](https://github.com/taiyang-li)).
* 当 CTE 包含有状态函数时禁用谓词下推。 [#55871](https://github.com/ClickHouse/ClickHouse/pull/55871) ([Raúl Marín](https://github.com/Algunenano)).
* 修复 ASTSelectWithUnionQuery 的规范化；此前会移除查询中的 `FORMAT`。 [#55887](https://github.com/ClickHouse/ClickHouse/pull/55887) ([flynn](https://github.com/ucasfl)).
* 尝试修复原生 ORC 输入格式中可能出现的段错误。 [#55891](https://github.com/ClickHouse/ClickHouse/pull/55891) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复稀疏列情况下的窗口函数。 [#55895](https://github.com/ClickHouse/ClickHouse/pull/55895) ([János Benjamin Antal](https://github.com/antaljanosbenjamin)).
* 修复：StorageNull 支持子列。 [#55912](https://github.com/ClickHouse/ClickHouse/pull/55912) ([FFish](https://github.com/wxybear)).
* 对于 Replicated 变更操作或合并，不将可重试错误写入错误日志。 [#55944](https://github.com/ClickHouse/ClickHouse/pull/55944) ([Azat Khuzhin](https://github.com/azat)).
* 修复 `SHOW DATABASES LIMIT <N>`。 [#55962](https://github.com/ClickHouse/ClickHouse/pull/55962) ([Raúl Marín](https://github.com/Algunenano)).
* 修复自动生成的 Protobuf 结构中包含下划线的字段。 [#55974](https://github.com/ClickHouse/ClickHouse/pull/55974) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复 dateTime64ToSnowflake64() 使用非默认小数位数时的问题。 [#55983](https://github.com/ClickHouse/ClickHouse/pull/55983) ([Robert Schulze](https://github.com/rschu1ze)).
* 修复 Arrow 字典列的输入和输出。 [#55989](https://github.com/ClickHouse/ClickHouse/pull/55989) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复 AvroConfluent 从结构注册表获取结构的问题。 [#55991](https://github.com/ClickHouse/ClickHouse/pull/55991) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复 Buffer 表并发执行 ALTER 和 INSERT 时出现的“Block structure mismatch”（数据块结构不匹配）错误。 [#55995](https://github.com/ClickHouse/ClickHouse/pull/55995) ([Michael Kolupaev](https://github.com/al13n321)).
* 修复 least\_used JBOD 策略中可用空间计算不正确的问题。 [#56030](https://github.com/ClickHouse/ClickHouse/pull/56030) ([Azat Khuzhin](https://github.com/azat)).
* 修复计算表函数内的子查询时缺少标量的问题。 [#56057](https://github.com/ClickHouse/ClickHouse/pull/56057) ([Amos Bird](https://github.com/amosbird)).
* 修复 http\_write\_exception\_in\_output\_format=1 时查询结果错误的问题。 [#56135](https://github.com/ClickHouse/ClickHouse/pull/56135) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复设置发生变化后，从 JSON 回退到 JSONEachRow 时的结构缓存。 [#56172](https://github.com/ClickHouse/ClickHouse/pull/56172) ([Kruglov Pavel](https://github.com/Avogar)).
* 为 odbc-bridge 添加错误处理器。 [#56185](https://github.com/ClickHouse/ClickHouse/pull/56185) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
