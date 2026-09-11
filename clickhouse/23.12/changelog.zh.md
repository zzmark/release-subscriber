<h3 id="2312">
  <a id="2312" /> ClickHouse 23.12 版本, 2023-12-28. [演示文稿](https://presentations.clickhouse.com/2023-release-23.12/), [视频](https://www.youtube.com/watch?v=7TLuT6gt0PQ)
</h3>

<Frame>
  <iframe src="https://www.youtube.com/embed/7TLuT6gt0PQ" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
</Frame>

<h4 id="backward-incompatible-change">
  向后不兼容变更
</h4>

* 修复对 TTL 表达式中非确定性函数的检查。此前，某些情况下可以创建含非确定性函数的 TTL 表达式，随后可能导致未定义行为。修复了 [#37250](https://github.com/ClickHouse/ClickHouse/issues/37250)。默认禁止不依赖表中任何列的 TTL 表达式，可通过 `SET allow_suspicious_ttl_expressions = 1` 或 `SET compatibility = '23.11'` 重新允许。解决了 [#37286](https://github.com/ClickHouse/ClickHouse/issues/37286)。 [#51858](https://github.com/ClickHouse/ClickHouse/pull/51858) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* MergeTree 设置 `clean_deleted_rows` 已弃用，不再产生任何效果。默认不允许在 `OPTIMIZE` 中使用 `CLEANUP` 关键字（可通过 `allow_experimental_replacing_merge_with_cleanup` 设置启用）。修复了  [#58267](https://github.com/ClickHouse/ClickHouse/pull/58267) ([Alexander Tokmakov](https://github.com/tavplubix)). [#57930](https://github.com/ClickHouse/ClickHouse/issues/57930)。解决了 [#54988](https://github.com/ClickHouse/ClickHouse/issues/54988)。解决了 [#54570](https://github.com/ClickHouse/ClickHouse/issues/54570)。解决了 [#50346](https://github.com/ClickHouse/ClickHouse/issues/50346)。解决了 [#47579](https://github.com/ClickHouse/ClickHouse/issues/47579)。必须移除这个功能，因为它不好。我们必须尽快移除它，因为别无选择。 [#57932](https://github.com/ClickHouse/ClickHouse/pull/57932) ([Alexey Milovidov](https://github.com/alexey-milovidov))。

<h4 id="new-feature">
  新功能
</h4>

* 实现可刷新物化视图，满足 [#33919](https://github.com/ClickHouse/ClickHouse/issues/33919) 中提出的需求。 [#56946](https://github.com/ClickHouse/ClickHouse/pull/56946) ([Michael Kolupaev](https://github.com/al13n321), [Michael Guzov](https://github.com/koloshmet)).
* 引入 `PASTE JOIN`，让用户无需 `ON` 子句即可仅按行号连接表。例如：`SELECT * FROM (SELECT number AS a FROM numbers(2)) AS t1 PASTE JOIN (SELECT number AS a FROM numbers(2) ORDER BY a DESC) AS t2`。 [#57995](https://github.com/ClickHouse/ClickHouse/pull/57995) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* `ORDER BY` 子句现在支持指定 `ALL`，表示 ClickHouse 按 `SELECT` 子句中的所有列排序。例如：`SELECT col1, col2 FROM tab WHERE [...] ORDER BY ALL`。 [#57875](https://github.com/ClickHouse/ClickHouse/pull/57875) ([zhongyuankai](https://github.com/zhongyuankai)).
* 新增变更操作命令 `ALTER TABLE <table> APPLY DELETED MASK`，可强制应用轻量级删除写入的掩码，并从磁盘移除标记为已删除的行。 [#57433](https://github.com/ClickHouse/ClickHouse/pull/57433) ([Anton Popov](https://github.com/CurtizJ)).
* 处理器 `/binary` 可打开可视化查看器，查看 ClickHouse 二进制文件中的符号。 [#58211](https://github.com/ClickHouse/ClickHouse/pull/58211) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 新增 SQL 函数 `sqid`，用于生成 Sqids（[https://sqids.org/](https://sqids.org/)），例如：`SELECT sqid(125, 126)`。 [#57512](https://github.com/ClickHouse/ClickHouse/pull/57512) ([Robert Schulze](https://github.com/rschu1ze)).
* 新增函数 `seriesPeriodDetectFFT`，使用 FFT 检测序列周期。 [#57574](https://github.com/ClickHouse/ClickHouse/pull/57574) ([Bhavna Jindal](https://github.com/bhavnajindal)).
* 新增 HTTP 端点，检查 Keeper 是否已准备好接受流量。 [#55876](https://github.com/ClickHouse/ClickHouse/pull/55876) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 为结构推断添加 'union' 模式。在该模式下，最终表结构是所有文件结构的并集（因此会从每个文件推断结构）。结构推断模式由设置 `schema_inference_mode` 控制，可选值为 `default` 和 `union`。解决了 [#55428](https://github.com/ClickHouse/ClickHouse/issues/55428)。 [#55892](https://github.com/ClickHouse/ClickHouse/pull/55892) ([Kruglov Pavel](https://github.com/Avogar)).
* 新增设置 `input_format_csv_try_infer_numbers_from_strings`，允许从 CSV 格式中的字符串推断数值。解决了 [#56455](https://github.com/ClickHouse/ClickHouse/issues/56455)。 [#56859](https://github.com/ClickHouse/ClickHouse/pull/56859) ([Kruglov Pavel](https://github.com/Avogar)).
* 当数据库或表的数量超过可配置阈值时，向用户显示警告。 [#57375](https://github.com/ClickHouse/ClickHouse/pull/57375) ([凌涛](https://github.com/lingtaolf)).
* 采用 `HASHED_ARRAY`（和 `COMPLEX_KEY_HASHED_ARRAY`）布局的字典支持 `SHARDS`，与 `HASHED` 类似。 [#57544](https://github.com/ClickHouse/ClickHouse/pull/57544) ([vdimir](https://github.com/vdimir)).
* 新增异步指标，统计内存中的主键总字节数以及为主键分配的总字节数。 [#57551](https://github.com/ClickHouse/ClickHouse/pull/57551) ([Bharat Nallan](https://github.com/bharatnc)).
* 新增 `SHA512_256` 函数。 [#57645](https://github.com/ClickHouse/ClickHouse/pull/57645) ([Bharat Nallan](https://github.com/bharatnc)).
* 新增 `FORMAT_BYTES`，作为 `formatReadableSize` 的别名。 [#57592](https://github.com/ClickHouse/ClickHouse/pull/57592) ([Bharat Nallan](https://github.com/bharatnc)).
* 允许向 `s3` 表函数传递可选的会话令牌。 [#57850](https://github.com/ClickHouse/ClickHouse/pull/57850) ([Shani Elharrar](https://github.com/shanielh)).
* 新增设置 `http_make_head_request`。关闭后，URL 表引擎不会发出 HEAD 请求来确定文件大小。这是为了支持效率低、配置错误或不具备相关能力的 HTTP 服务器。 [#54602](https://github.com/ClickHouse/ClickHouse/pull/54602) ([Fionera](https://github.com/fionera)).
* 现在可以在索引（非主键）定义中引用 ALIAS 列（问题 [#55650](https://github.com/ClickHouse/ClickHouse/issues/55650)）。例如：`CREATE TABLE tab(col UInt32, col_alias ALIAS col + 1, INDEX idx (col_alias) TYPE minmax) ENGINE = MergeTree ORDER BY col;`。 [#57546](https://github.com/ClickHouse/ClickHouse/pull/57546) ([Robert Schulze](https://github.com/rschu1ze)).
* 新增设置 `readonly`，可用于将 S3 磁盘指定为只读。当仅拥有底层 S3 存储桶的只读权限，却需要在 `s3_plain` 类型的磁盘上创建表时，这会很有用。 [#57977](https://github.com/ClickHouse/ClickHouse/pull/57977) ([Pengyuan Bian](https://github.com/bianpengyuan)).
* MergeTree 表的主键分析现在适用于包含虚拟列 `_part_offset`（可同时包含 `_part`）的谓词。此功能可作为一种特殊的二级索引。 [#58224](https://github.com/ClickHouse/ClickHouse/pull/58224) ([Amos Bird](https://github.com/amosbird)).

<h4 id="performance-improvement">
  性能改进
</h4>

* 在 FINAL 处理期间，从 MergeTree 表中提取互不相交的数据片段范围，从而避免对这些范围执行额外的 FINAL 逻辑。当相同主键的重复值较少时，性能几乎与不使用 FINAL 相同。改进设置 `do_not_merge_across_partitions_select_final` 时 MergeTree FINAL 的读取性能。 [#58120](https://github.com/ClickHouse/ClickHouse/pull/58120) ([Maksim Kita](https://github.com/kitaisreal)).
* S3 磁盘之间的复制改为使用 S3 服务器端复制，而不是经缓冲区复制。改善 `BACKUP/RESTORE` 操作和 `clickhouse-disks copy` 命令。 [#56744](https://github.com/ClickHouse/ClickHouse/pull/56744) ([MikhailBurdukov](https://github.com/MikhailBurdukov)).
* Hash JOIN 遵循设置 `max_joined_block_size_rows`，不再为 `ALL JOIN` 生成过大的数据块。 [#56996](https://github.com/ClickHouse/ClickHouse/pull/56996) ([vdimir](https://github.com/vdimir)).
* 更早释放聚合使用的内存，可能避免不必要的外部聚合。 [#57691](https://github.com/ClickHouse/ClickHouse/pull/57691) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 提高字符串序列化性能。 [#57717](https://github.com/ClickHouse/ClickHouse/pull/57717) ([Maksim Kita](https://github.com/kitaisreal)).
* 为 `Merge` 引擎表支持简单计数优化。 [#57867](https://github.com/ClickHouse/ClickHouse/pull/57867) ([skyoct](https://github.com/skyoct)).
* 优化某些情况下的聚合。 [#57872](https://github.com/ClickHouse/ClickHouse/pull/57872) ([Anton Popov](https://github.com/CurtizJ)).
* 函数 `hasAny` 现在可以利用全文跳过索引。 [#57878](https://github.com/ClickHouse/ClickHouse/pull/57878) ([Jpnock](https://github.com/Jpnock)).
* 优化函数 `if(cond, then, else)`（及其别名 `cond ? then : else`），采用无分支计算。 [#57885](https://github.com/ClickHouse/ClickHouse/pull/57885) ([zhanglistar](https://github.com/zhanglistar)).
* 如果分区键表达式仅包含主键表达式中的列，MergeTree 会自动推导 `do_not_merge_across_partitions_select_final` 设置。 [#58218](https://github.com/ClickHouse/ClickHouse/pull/58218) ([Maksim Kita](https://github.com/kitaisreal)).
* 加快原生类型的 `MIN` 和 `MAX` 计算。 [#58231](https://github.com/ClickHouse/ClickHouse/pull/58231) ([Raúl Marín](https://github.com/Algunenano)).
* 为文件系统缓存实现 `SLRU` 缓存策略。 [#57076](https://github.com/ClickHouse/ClickHouse/pull/57076) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 将后台获取数据时每个端点的连接数上限从 `15` 提高到 `background_fetches_pool_size` 设置的值。— MergeTree 级设置 `replicated_max_parallel_fetches_for_host` 已弃用。— MergeTree 级设置 `replicated_fetches_http_connection_timeout`、`replicated_fetches_http_send_timeout` 和 `replicated_fetches_http_receive_timeout` 移至服务器级。— `keep_alive_timeout` 加入服务器级设置列表。 [#57523](https://github.com/ClickHouse/ClickHouse/pull/57523) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* 降低查询 `system.filesystem_cache` 时的内存开销。 [#57687](https://github.com/ClickHouse/ClickHouse/pull/57687) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 减少字符串反序列化的内存使用。 [#57787](https://github.com/ClickHouse/ClickHouse/pull/57787) ([Maksim Kita](https://github.com/kitaisreal)).
* 提供更高效的 Enum 构造函数；Enum 包含大量值时效果明显。 [#57887](https://github.com/ClickHouse/ClickHouse/pull/57887) ([Duc Canh Le](https://github.com/canhld94)).
* 改进文件系统缓存读取：始终使用 `pread` 方法。 [#57970](https://github.com/ClickHouse/ClickHouse/pull/57970) ([Nikita Taranov](https://github.com/nickitat)).
* 在逻辑表达式优化器中添加对 AND notEquals 条件链的优化。仅在启用实验性 Analyzer 时可用。 [#58214](https://github.com/ClickHouse/ClickHouse/pull/58214) ([Kevin Mingtarja](https://github.com/kevinmingtarja)).

<h4 id="improvement">
  改进
</h4>

* Keeper 支持软内存限制。当内存使用接近上限时，将拒绝请求。  [#57271](https://github.com/ClickHouse/ClickHouse/pull/57271) ([Han Fei](https://github.com/hanfei1991)). [#57699](https://github.com/ClickHouse/ClickHouse/pull/57699) ([Han Fei](https://github.com/hanfei1991))。
* 使分布式表插入正确处理更新后的集群配置。当集群节点列表动态更新时，分布式表的目录监控器也会更新该列表。 [#42826](https://github.com/ClickHouse/ClickHouse/pull/42826) ([zhongyuankai](https://github.com/zhongyuankai)).
* 不允许创建合并参数不一致的复制表。 [#56833](https://github.com/ClickHouse/ClickHouse/pull/56833) ([Duc Canh Le](https://github.com/canhld94)).
* 在 `system.tables` 中显示未压缩大小。 [#56618](https://github.com/ClickHouse/ClickHouse/issues/56618)。 [#57186](https://github.com/ClickHouse/ClickHouse/pull/57186) ([Chen Lixiang](https://github.com/chenlx0)).
* 为 `Distributed` 表新增 `skip_unavailable_shards` 设置，类似于对应的查询级设置。解决了 [#43666](https://github.com/ClickHouse/ClickHouse/issues/43666)。 [#57218](https://github.com/ClickHouse/ClickHouse/pull/57218) ([Gagan Goel](https://github.com/tntnatbry)).
* 函数 `substring`（别名：`substr`、`mid`）现在可用于 `Enum` 类型。此前，第一个函数参数必须为 `String` 或 `FixedString` 类型的值。这改善了通过 MySQL 接口与 Tableau 等第三方工具的兼容性。 [#57277](https://github.com/ClickHouse/ClickHouse/pull/57277) ([Serge Klochkov](https://github.com/slvrtrn)).
* 函数 `format` 现在支持任意参数类型（此前仅支持 `String` 和 `FixedString` 参数）。这对于计算 `SELECT format('The {0} to all questions is {1}', 'answer', 42)` 很重要。 [#57549](https://github.com/ClickHouse/ClickHouse/pull/57549) ([Robert Schulze](https://github.com/rschu1ze)).
* 允许 `date_trunc` 函数的第一个参数不区分大小写。现在同时支持 `SELECT date_trunc('day', now())` 和 `SELECT date_trunc('DAY', now())`。 [#57624](https://github.com/ClickHouse/ClickHouse/pull/57624) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 表不存在时提供更好的提示。 [#57342](https://github.com/ClickHouse/ClickHouse/pull/57342) ([Bharat Nallan](https://github.com/bharatnc)).
* 允许在查询时覆盖服务器设置 `max_partition_size_to_drop` 和 `max_table_size_to_drop`。 [#57452](https://github.com/ClickHouse/ClickHouse/pull/57452) ([Jordi Villar](https://github.com/jrdi)).
* 小幅改进 JSON 格式中未命名元组的结构推断。 [#57751](https://github.com/ClickHouse/ClickHouse/pull/57751) ([Kruglov Pavel](https://github.com/Avogar)).
* 连接 Keeper 时支持只读标志（修复了 [#53749](https://github.com/ClickHouse/ClickHouse/issues/53749)）。 [#57479](https://github.com/ClickHouse/ClickHouse/pull/57479) ([Mikhail Koviazin](https://github.com/mkmkme)).
* 修复从磁盘恢复批次时，分布式发送可能因“No such file or directory”（没有该文件或目录）而卡住的问题。修复 `distributed_directory_monitor_max_sleep_time_ms` 大于 5 分钟时，`system.distribution_queue` 中 `error_count` 可能存在的问题。引入性能分析事件 `DistributedAsyncInsertionFailures`，跟踪异步 INSERT 失败。 [#57480](https://github.com/ClickHouse/ClickHouse/pull/57480) ([Azat Khuzhin](https://github.com/azat)).
* `MaterializedPostgreSQL`（实验性功能）支持 PostgreSQL 生成列和列默认值。解决了 [#40449](https://github.com/ClickHouse/ClickHouse/issues/40449)。 [#57568](https://github.com/ClickHouse/ClickHouse/pull/57568) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 允许在不重启服务器的情况下应用部分文件系统缓存配置变更。 [#57578](https://github.com/ClickHouse/ClickHouse/pull/57578) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 正确处理包含空数组的 PostgreSQL 表结构。 [#57618](https://github.com/ClickHouse/ClickHouse/pull/57618) ([Mike Kot](https://github.com/myrrc)).
* 通过 `ClickHouseErrorMetric_ALL` 指标公开自上次服务器重启以来的错误总数。 [#57627](https://github.com/ClickHouse/ClickHouse/pull/57627) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* 允许配置文件节点在包含 `from_env`/`from_zk` 引用以及非空元素时使用 replace=1。 [#57628](https://github.com/ClickHouse/ClickHouse/pull/57628) ([Azat Khuzhin](https://github.com/azat)).
* 新增表函数 `fuzzJSON`，可生成大量格式错误的 JSON 用于模糊测试。 [#57646](https://github.com/ClickHouse/ClickHouse/pull/57646) ([Julia Kartseva](https://github.com/jkartseva)).
* 允许 IPv6 转换为 UInt128，并支持二元算术运算。 [#57707](https://github.com/ClickHouse/ClickHouse/pull/57707) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* 为 `async inserts deduplication cache` 添加设置，控制等待缓存更新的时长。弃用设置 `async_block_ids_cache_min_update_interval_ms`。现在仅在发生冲突时更新缓存。 [#57743](https://github.com/ClickHouse/ClickHouse/pull/57743) ([alesapin](https://github.com/alesapin)).
* 函数 `sleep()` 现在可以通过 `KILL QUERY` 取消。 [#57746](https://github.com/ClickHouse/ClickHouse/pull/57746) ([Vitaly Baranov](https://github.com/vitlibar)).
* 在实验性 `Replicated` 数据库中，禁止对 `Replicated` 表引擎执行 `CREATE TABLE ... AS SELECT` 查询，因为尚不支持。参见 [#35408](https://github.com/ClickHouse/ClickHouse/issues/35408)。 [#57796](https://github.com/ClickHouse/ClickHouse/pull/57796) ([Nikolay Degterinsky](https://github.com/evillique)).
* 修复并改进面向外部数据库的查询转换，以递归获取所有兼容的谓词。 [#57888](https://github.com/ClickHouse/ClickHouse/pull/57888) ([flynn](https://github.com/ucasfl)).
* 支持动态重新加载文件系统缓存大小。解决了 [#57866](https://github.com/ClickHouse/ClickHouse/issues/57866)。 [#57897](https://github.com/ClickHouse/ClickHouse/pull/57897) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 使 `system.stack_trace` 正确支持阻塞了 SIGRTMIN 的线程（Apache rdkafka 等低质量外部库中可能存在此类线程）。同时，仅在线程未阻塞该信号时才发送信号，避免毫无意义地等待 `storage_system_stack_trace_pipe_read_timeout_ms`。  [#57907](https://github.com/ClickHouse/ClickHouse/pull/57907) ([Azat Khuzhin](https://github.com/azat)). [#58136](https://github.com/ClickHouse/ClickHouse/pull/58136) ([Azat Khuzhin](https://github.com/azat))。
* 在仲裁插入的检查中容忍 Keeper 故障。 [#57986](https://github.com/ClickHouse/ClickHouse/pull/57986) ([Raúl Marín](https://github.com/Algunenano)).
* 向 system.asynchronous\_metrics 添加最大/峰值 RSS（`MemoryResidentMax`）。 [#58095](https://github.com/ClickHouse/ClickHouse/pull/58095) ([Azat Khuzhin](https://github.com/azat)).
* 此 PR 允许使用 S3 风格链接（`https://` 和 `s3://`）时，即使区域不是默认区域，也无需显式指定；如果用户指定了错误区域，也会查找正确区域。 [#58148](https://github.com/ClickHouse/ClickHouse/pull/58148) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* `clickhouse-format --obfuscate` 将识别 Settings、MergeTreeSettings 和时区，保留其名称不变。 [#58179](https://github.com/ClickHouse/ClickHouse/pull/58179) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 为 `ZipArchiveWriter` 添加显式的 `finalize()` 函数。简化 `ZipArchiveWriter` 中过于复杂的代码。修复了 [#58074](https://github.com/ClickHouse/ClickHouse/issues/58074)。 [#58202](https://github.com/ClickHouse/ClickHouse/pull/58202) ([Vitaly Baranov](https://github.com/vitlibar)).
* 使路径相同的缓存使用同一缓存对象。这一行为原本就存在，但在 23.4 中被破坏。如果这些路径相同的缓存使用不同的缓存设置，将抛出异常，说明不允许这样配置。 [#58264](https://github.com/ClickHouse/ClickHouse/pull/58264) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 并行副本（实验性功能）：提供更易用的设置。 [#57542](https://github.com/ClickHouse/ClickHouse/pull/57542) ([Igor Nikonov](https://github.com/devcrafter)).
* 并行副本（实验性功能）：改进公告响应的处理。 [#57749](https://github.com/ClickHouse/ClickHouse/pull/57749) ([Igor Nikonov](https://github.com/devcrafter)).
* 并行副本（实验性功能）：在 `ParallelReplicasReadingCoordinator` 中更严格地遵循 `min_number_of_marks`。 [#57763](https://github.com/ClickHouse/ClickHouse/pull/57763) ([Nikita Taranov](https://github.com/nickitat)).
* 并行副本（实验性功能）：存在 IN (subquery) 时禁用并行副本。 [#58133](https://github.com/ClickHouse/ClickHouse/pull/58133) ([Igor Nikonov](https://github.com/devcrafter)).
* 并行副本（实验性功能）：添加性能分析事件 'ParallelReplicasUsedCount'。 [#58173](https://github.com/ClickHouse/ClickHouse/pull/58173) ([Igor Nikonov](https://github.com/devcrafter)).
* HEAD 等非 POST 请求将与 GET 一样只允许只读操作。 [#58060](https://github.com/ClickHouse/ClickHouse/pull/58060) ([San](https://github.com/santrancisco)).
* 为 `system.part_log` 添加 `bytes_uncompressed` 列。 [#58167](https://github.com/ClickHouse/ClickHouse/pull/58167) ([Jordi Villar](https://github.com/jrdi)).
* 为 `system.backups` 和 `system.backup_log` 表添加基础备份名称。 [#58178](https://github.com/ClickHouse/ClickHouse/pull/58178) ([Pradeep Chhetri](https://github.com/chhetripradeep)).
* 支持在 clickhouse-local 命令行中指定查询参数。 [#58210](https://github.com/ClickHouse/ClickHouse/pull/58210) ([Pradeep Chhetri](https://github.com/chhetripradeep)).

<h4 id="buildtestingpackaging-improvement">
  构建、测试与打包改进
</h4>

* 随机化更多设置。 [#39663](https://github.com/ClickHouse/ClickHouse/pull/39663) ([Anton Popov](https://github.com/CurtizJ)).
* 在 CI 中随机选择禁用的优化。 [#57315](https://github.com/ClickHouse/ClickHouse/pull/57315) ([Raúl Marín](https://github.com/Algunenano)).
* 允许在 macOS 上使用 Azure 相关表引擎和表函数。 [#51866](https://github.com/ClickHouse/ClickHouse/pull/51866) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* ClickHouse Fast Test 现在使用 Musl 而非 GLibc。可从 CI 下载完全静态链接的 Musl 构建。 [#57711](https://github.com/ClickHouse/ClickHouse/pull/57711) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 为每次提交运行 ClickBench。解决了 [#57708](https://github.com/ClickHouse/ClickHouse/issues/57708)。 [#57712](https://github.com/ClickHouse/ClickHouse/pull/57712) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 移除外部库对有害的 C/POSIX `select` 函数的使用。 [#57467](https://github.com/ClickHouse/ClickHouse/pull/57467) ([Igor Nikonov](https://github.com/devcrafter)).
* 为方便使用，开源 ClickHouse 构建中也会出现仅在 ClickHouse Cloud 中可用的设置。 [#57638](https://github.com/ClickHouse/ClickHouse/pull/57638) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).

<h4 id="bug-fix-user-visible-misbehavior-in-an-official-stable-release">
  缺陷修复（正式稳定版本中用户可见的异常行为）
</h4>

* 修复 TTL GROUP BY 可能破坏排序顺序的问题。 [#49103](https://github.com/ClickHouse/ClickHouse/pull/49103) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* 修复：调整 `lttb` 的分桶策略，首桶和末桶应仅包含一个点。 [#57003](https://github.com/ClickHouse/ClickHouse/pull/57003) ([FFish](https://github.com/wxybear)).
* 修复 `Template` 格式在出错后同步时可能发生的死锁。 [#57004](https://github.com/ClickHouse/ClickHouse/pull/57004) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复解析文件并跳过大量错误时提前停止的问题。 [#57006](https://github.com/ClickHouse/ClickHouse/pull/57006) ([Kruglov Pavel](https://github.com/Avogar)).
* 防止通过 `dictionary` 表函数绕过字典的 ACL。 [#57362](https://github.com/ClickHouse/ClickHouse/pull/57362) ([Salvatore Mesoraca](https://github.com/aiven-sal)).
* 修复模糊测试器发现的另一种“non-ready set”（集合尚未就绪）错误。 [#57423](https://github.com/ClickHouse/ClickHouse/pull/57423) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复 PostgreSQL `array_ndims` 使用中的多个问题。 [#57436](https://github.com/ClickHouse/ClickHouse/pull/57436) ([Ryan Jacobs](https://github.com/ryanmjacobs)).
* 修复写锁超时后 RWLock 的状态不一致。再次修复写锁超时后 RWLock 的状态不一致。  [#57454](https://github.com/ClickHouse/ClickHouse/pull/57454) ([Vitaly Baranov](https://github.com/vitlibar)). [#57733](https://github.com/ClickHouse/ClickHouse/pull/57733) ([Vitaly Baranov](https://github.com/vitlibar))。
* 修复：构建向视图推送数据的处理链时，不排除临时列。 [#57461](https://github.com/ClickHouse/ClickHouse/pull/57461) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* MaterializedPostgreSQL（实验性功能问题）：修复 [#41922](https://github.com/ClickHouse/ClickHouse/issues/41922)，为 [#41923](https://github.com/ClickHouse/ClickHouse/issues/41923) 添加测试。 [#57515](https://github.com/ClickHouse/ClickHouse/pull/57515) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 管理复制访问实体的 GRANT/REVOKE 查询会忽略 ON CLUSTER 子句。 [#57538](https://github.com/ClickHouse/ClickHouse/pull/57538) ([MikhailBurdukov](https://github.com/MikhailBurdukov)).
* 修复 clickhouse-local 中的崩溃。 [#57553](https://github.com/ClickHouse/ClickHouse/pull/57553) ([Nikolay Degterinsky](https://github.com/evillique)).
* 修复 Hash JOIN。 [#57564](https://github.com/ClickHouse/ClickHouse/pull/57564) ([vdimir](https://github.com/vdimir)).
* 修复 PostgreSQL 数据源中可能出现的错误。 [#57567](https://github.com/ClickHouse/ClickHouse/pull/57567) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复 Hash JOIN 对嵌套 LowCardinality 的类型修正。 [#57614](https://github.com/ClickHouse/ClickHouse/pull/57614) ([vdimir](https://github.com/vdimir)).
* 通过正确禁止对 `system.stack_trace` 并行读取，避免其挂起。 [#57641](https://github.com/ClickHouse/ClickHouse/pull/57641) ([Azat Khuzhin](https://github.com/azat)).
* 修复使用 `any(...) RESPECT NULL` 聚合稀疏列时的错误。 [#57710](https://github.com/ClickHouse/ClickHouse/pull/57710) ([Azat Khuzhin](https://github.com/azat)).
* 修复一元运算符解析。 [#57713](https://github.com/ClickHouse/ClickHouse/pull/57713) ([Nikolay Degterinsky](https://github.com/evillique)).
* 修复实验性表引擎 `MaterializedPostgreSQL` 的依赖加载。 [#57754](https://github.com/ClickHouse/ClickHouse/pull/57754) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复 BACKUP/RESTORE ON CLUSTER 对已断开连接节点的重试。 [#57764](https://github.com/ClickHouse/ClickHouse/pull/57764) ([Vitaly Baranov](https://github.com/vitlibar)).
* 修复投影仅部分物化时外部聚合的结果。 [#57790](https://github.com/ClickHouse/ClickHouse/pull/57790) ([Anton Popov](https://github.com/CurtizJ)).
* 修复带 `*Map` 组合器的聚合函数中的合并。 [#57795](https://github.com/ClickHouse/ClickHouse/pull/57795) ([Anton Popov](https://github.com/CurtizJ)).
* 禁用 `system.kafka_consumers`，因为它存在缺陷。 [#57822](https://github.com/ClickHouse/ClickHouse/pull/57822) ([Azat Khuzhin](https://github.com/azat)).
* 修复 Merge JOIN 对 LowCardinality 键的支持。 [#57827](https://github.com/ClickHouse/ClickHouse/pull/57827) ([vdimir](https://github.com/vdimir)).
* 修复 `InterpreterCreateQuery` 中与样本数据块相关的问题。 [#57855](https://github.com/ClickHouse/ClickHouse/pull/57855) ([Maksim Kita](https://github.com/kitaisreal)).
* 此前 PostgreSQL 命名集合中的 `addresses_expr` 被忽略。 [#57874](https://github.com/ClickHouse/ClickHouse/pull/57874) ([joelynch](https://github.com/joelynch)).
* 修复 BLAKE3（Rust）中的无效内存访问。 [#57876](https://github.com/ClickHouse/ClickHouse/pull/57876) ([Raúl Marín](https://github.com/Algunenano)).随后为获得更好的[内存安全性](https://www.memorysafety.org/)，将其从 Rust 重写为 C++。 [#57994](https://github.com/ClickHouse/ClickHouse/pull/57994) ([Raúl Marín](https://github.com/Algunenano))。
* 规范化 `CREATE INDEX` 中的函数名。 [#57906](https://github.com/ClickHouse/ClickHouse/pull/57906) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 修复首次请求发出之前对不可用副本的处理。 [#57933](https://github.com/ClickHouse/ClickHouse/pull/57933) ([Nikita Taranov](https://github.com/nickitat)).
* 修复字面量别名的错误分类。 [#57988](https://github.com/ClickHouse/ClickHouse/pull/57988) ([Chen768959](https://github.com/Chen768959)).
* 修复 Keeper 上的无效预处理。 [#58069](https://github.com/ClickHouse/ClickHouse/pull/58069) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复 `Poco` 库中与 `UTF32Encoding` 有关的整数溢出。 [#58073](https://github.com/ClickHouse/ClickHouse/pull/58073) ([Andrey Fedotov](https://github.com/anfedotoff)).
* 修复存在含大整数值的标量子查询时，并行副本（实验性功能）的问题。 [#58118](https://github.com/ClickHouse/ClickHouse/pull/58118) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复 `accurateCastOrNull` 对超出范围的 `DateTime` 的处理。 [#58139](https://github.com/ClickHouse/ClickHouse/pull/58139) ([Andrey Zvonov](https://github.com/zvonand)).
* 修复从 MergeTree 的宽数据片段读取子列时可能出现的 `PARAMETER_OUT_OF_BOUND` 错误。 [#58175](https://github.com/ClickHouse/ClickHouse/pull/58175) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复包含大量子查询时 CREATE VIEW 变慢的问题。 [#58220](https://github.com/ClickHouse/ClickHouse/pull/58220) ([Tao Wang](https://github.com/wangtZJU)).
* 修复 JSONCompactEachRow 的并行解析。  [#58181](https://github.com/ClickHouse/ClickHouse/pull/58181) ([Alexey Milovidov](https://github.com/alexey-milovidov)). [#58250](https://github.com/ClickHouse/ClickHouse/pull/58250) ([Kruglov Pavel](https://github.com/Avogar))。
