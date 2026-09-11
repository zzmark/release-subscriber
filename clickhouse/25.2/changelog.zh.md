<h3 id="252">
  ClickHouse 25.2 版本, 2025-02-27
</h3>

#### 向后不兼容变更

* 默认完全启用 `async_load_databases`，即使安装环境未更新 `config.xml` 也一样。[#74772](https://github.com/ClickHouse/ClickHouse/pull/74772)（[Azat Khuzhin](https://github.com/azat)）。
* 新增 `JSONCompactEachRowWithProgress` 和 `JSONCompactStringsEachRowWithProgress` 格式，延续 [#69989](https://github.com/ClickHouse/ClickHouse/issues/69989)。`JSONCompactWithNames` 和 `JSONCompactWithNamesAndTypes` 不再输出“totals”；此前的行为显然是实现错误。[#75037](https://github.com/ClickHouse/ClickHouse/pull/75037)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 将 `format_alter_operations_with_parentheses` 的默认值改为 true，以消除 ALTER 命令列表的歧义（见 [https://github.com/ClickHouse/ClickHouse/pull/59532](https://github.com/ClickHouse/ClickHouse/pull/59532)）。这会破坏与 24.3 之前版本集群的复制兼容性。如果从更早版本升级集群，请在服务器配置中关闭此设置，或先升级到 24.3。[#75302](https://github.com/ClickHouse/ClickHouse/pull/75302)（[Raúl Marín](https://github.com/Algunenano)）。
* 移除使用正则表达式过滤日志消息的能力，因为该实现引入了数据竞争。[#75577](https://github.com/ClickHouse/ClickHouse/pull/75577)（[János Benjamin Antal](https://github.com/antaljanosbenjamin)）。
* 设置 `min_chunk_bytes_for_parallel_parsing` 不再允许为零。修复 [#71110](https://github.com/ClickHouse/ClickHouse/issues/71110)。[#75239](https://github.com/ClickHouse/ClickHouse/pull/75239)（[Nikita Mikhaylov](https://github.com/nikitamikhaylov)）。
* 校验缓存配置中的设置。此前不存在的设置会被忽略，现在会抛出错误，应将其移除。[#75452](https://github.com/ClickHouse/ClickHouse/pull/75452)（[Kseniia Sumarokova](https://github.com/kssenii)）。

#### 新功能

* 支持 `Nullable(JSON)` 类型。[#73556](https://github.com/ClickHouse/ClickHouse/pull/73556)（[Pavel Kruglov](https://github.com/Avogar)）。
* 支持在 DEFAULT 和 MATERIALIZED 表达式中使用子列。[#74403](https://github.com/ClickHouse/ClickHouse/pull/74403)（[Pavel Kruglov](https://github.com/Avogar)）。
* 支持通过 `output_format_parquet_write_bloom_filter` 设置写入 Parquet 布隆过滤器，默认启用。[#71681](https://github.com/ClickHouse/ClickHouse/pull/71681)（[Michael Kolupaev](https://github.com/al13n321)）。
* Web UI 现在支持交互式数据库导航。[#75777](https://github.com/ClickHouse/ClickHouse/pull/75777)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 允许在存储策略中组合只读和可读写磁盘，可使用多个卷或多个磁盘。这样可以读取整个卷的数据，同时插入优先选择可写磁盘，即写时复制存储策略。[#75862](https://github.com/ClickHouse/ClickHouse/pull/75862)（[Azat Khuzhin](https://github.com/azat)）。
* 新增数据库引擎 `DatabaseBackup,`，允许即时从备份挂载表或数据库。[#75725](https://github.com/ClickHouse/ClickHouse/pull/75725)（[Maksim Kita](https://github.com/kitaisreal)）。
* 支持 Postgres 通信协议的预处理语句。[#75035](https://github.com/ClickHouse/ClickHouse/pull/75035)（[scanhex12](https://github.com/scanhex12)）。
* 支持在没有数据库层的情况下 ATTACH 表，适用于位于 Web、S3 等外部虚拟文件系统上的 MergeTree 表。[#75788](https://github.com/ClickHouse/ClickHouse/pull/75788)（[Azat Khuzhin](https://github.com/azat)）。
* 新增字符串比较函数 `compareSubstrings`，用于比较两个字符串的部分内容。例如，`SELECT compareSubstrings('Saxony', 'Anglo-Saxon', 0, 6, 5) AS result` 表示“从第一个字符串的偏移 0、第二个字符串的偏移 5 开始，按字典序比较字符串 'Saxon' 和 'Anglo-Saxon' 的 6 个字节”。[#74070](https://github.com/ClickHouse/ClickHouse/pull/74070)（[lgbo](https://github.com/lgbo-ustc)）。
* 新增函数 `initialQueryStartTime`，返回当前查询的开始时间；在分布式查询中，所有分片上的值相同。[#75087](https://github.com/ClickHouse/ClickHouse/pull/75087)（[Roman Lomonosov](https://github.com/lomik)）。
* 支持通过命名集合为 MySQL 配置 SSL 身份验证。解决 [#59111](https://github.com/ClickHouse/ClickHouse/issues/59111)。[#59452](https://github.com/ClickHouse/ClickHouse/pull/59452)（[Nikolay Degterinsky](https://github.com/evillique)）。

#### 实验性功能

* 新增设置 `enable_adaptive_memory_spill_scheduler`，允许同一查询中的多个 Grace JOIN 监测合计内存占用，并自适应地触发向外部存储溢写，避免 MEMORY\_LIMIT\_EXCEEDED。[#72728](https://github.com/ClickHouse/ClickHouse/pull/72728)（[lgbo](https://github.com/lgbo-ustc)）。
* 让新的实验性 `Kafka` 表引擎完全遵循 Keeper 功能标志。[#76004](https://github.com/ClickHouse/ClickHouse/pull/76004)（[János Benjamin Antal](https://github.com/antaljanosbenjamin)）。
* 恢复因许可问题而在 v24.10 中移除的 Intel QPL 编解码器。[#76021](https://github.com/ClickHouse/ClickHouse/pull/76021)（[Konstantin Bogdanov](https://github.com/thevar1able)）。
* HDFS 集成新增对配置选项 `dfs.client.use.datanode.hostname` 的支持。[#74635](https://github.com/ClickHouse/ClickHouse/pull/74635)（[Mikhail Tiukavkin](https://github.com/freshertm)）。

#### 性能改进

* 提升从 S3 上 Wide 数据片段中读取完整 JSON 列的性能：为子列前缀反序列化增加预取、已反序列化前缀缓存以及并行处理。对于 `SELECT data FROM table` 这样的查询，JSON 列读取速度提升至 4 倍；对于 `SELECT data FROM table LIMIT 10` 这样的查询，约提升至 10 倍。[#74827](https://github.com/ClickHouse/ClickHouse/pull/74827)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复 `max_rows_in_join = max_bytes_in_join = 0` 时 `parallel_hash` 中不必要的竞争。[#75155](https://github.com/ClickHouse/ClickHouse/pull/75155)（[Nikita Taranov](https://github.com/nickitat)）。
* 修复优化器交换连接两侧时 `ConcurrentHashJoin` 重复预分配的问题。[#75149](https://github.com/ClickHouse/ClickHouse/pull/75149)（[Nikita Taranov](https://github.com/nickitat)）。
* 通过预先计算输出行数并预留内存，小幅改善部分连接场景的性能。[#75376](https://github.com/ClickHouse/ClickHouse/pull/75376)（[Alexander Gololobov](https://github.com/davenger)）。
* 对于 `WHERE a < b AND b < c AND c < 5` 这样的查询，可以推导出新的比较条件（`a < 5 AND b < 5`），增强过滤能力。[#73164](https://github.com/ClickHouse/ClickHouse/pull/73164)（[Shichao Jin](https://github.com/jsc0218)）。
* Keeper 改进：向内存存储提交时禁用摘要计算以提升性能；可通过 `keeper_server.digest_enabled_on_commit` 配置启用。预处理请求时仍会计算摘要。[#75490](https://github.com/ClickHouse/ClickHouse/pull/75490)（[Antonio Andelic](https://github.com/antonio2368)）。
* 尽可能下推 JOIN ON 中的过滤表达式。[#75536](https://github.com/ClickHouse/ClickHouse/pull/75536)（[Vladimir Cherkasov](https://github.com/vdimir)）。
* 在 MergeTree 中延迟计算列和索引大小。[#75938](https://github.com/ClickHouse/ClickHouse/pull/75938)（[Pavel Kruglov](https://github.com/Avogar)）。
* 重新让 `MATERIALIZE TTL` 遵循 `ttl_only_drop_parts`；仅读取重新计算 TTL 所需的列，并通过用空数据片段替换原数据片段来删除数据。[#72751](https://github.com/ClickHouse/ClickHouse/pull/72751)（[Andrey Zvonov](https://github.com/zvonand)）。
* 减小 plain\_rewritable 元数据文件的写缓冲区。[#75758](https://github.com/ClickHouse/ClickHouse/pull/75758)（[Julia Kartseva](https://github.com/jkartseva)）。
* 降低部分窗口函数的内存占用。[#65647](https://github.com/ClickHouse/ClickHouse/pull/65647)（[lgbo](https://github.com/lgbo-ustc)）。
* 联合评估 Parquet 布隆过滤器和最小值/最大值索引，以正确支持数据为 \[1, 2, 4, 5] 时的 `x = 3 or x > 5` 等条件。[#71383](https://github.com/ClickHouse/ClickHouse/pull/71383)（[Arthur Passos](https://github.com/arthurpassos)）。
* 传递给 `Executable` 存储的查询不再限于单线程执行。[#70084](https://github.com/ClickHouse/ClickHouse/pull/70084)（[yawnt](https://github.com/yawnt)）。
* 在 ALTER TABLE FETCH PARTITION 中并行拉取数据片段，线程池大小由 `max_fetch_partition_thread_pool_size` 控制。[#74978](https://github.com/ClickHouse/ClickHouse/pull/74978)（[Azat Khuzhin](https://github.com/azat)）。
* 允许将带有 `indexHint` 函数的谓词移至 `PREWHERE`。[#74987](https://github.com/ClickHouse/ClickHouse/pull/74987)（[Anton Popov](https://github.com/CurtizJ)）。

#### 改进

* 修复 `LowCardinality` 列内存大小的计算。[#74688](https://github.com/ClickHouse/ClickHouse/pull/74688)（[Nikita Taranov](https://github.com/nickitat)）。
* `processors_profile_log` 表现在有默认配置，TTL 为 30 天。[#66139](https://github.com/ClickHouse/ClickHouse/pull/66139)（[Ilya Yatsishin](https://github.com/qoega)）。
* 允许在集群配置中为分片命名。[#72276](https://github.com/ClickHouse/ClickHouse/pull/72276)（[MikhailBurdukov](https://github.com/MikhailBurdukov)）。
* 将 Prometheus 远程写入成功响应的状态从 200/OK 改为 204/NoContent。[#74170](https://github.com/ClickHouse/ClickHouse/pull/74170)（[Michael Dempsey](https://github.com/bluestealth)）。
* 支持即时重新加载 `max_remote_read_network_bandwidth_for_serve` 和 `max_remote_write_network_bandwidth_for_server`，无需重启服务器。[#74206](https://github.com/ClickHouse/ClickHouse/pull/74206)（[Kai Zhu](https://github.com/nauu)）。
* 允许在备份时使用 blob 路径计算校验和。[#74729](https://github.com/ClickHouse/ClickHouse/pull/74729)（[Vitaly Baranov](https://github.com/vitlibar)）。
* 为 `system.query_cache` 新增查询 ID 列，解决 [#68205](https://github.com/ClickHouse/ClickHouse/issues/68205)。[#74982](https://github.com/ClickHouse/ClickHouse/pull/74982)（[NamHoaiNguyen](https://github.com/NamHoaiNguyen)）。
* 允许通过 `KILL QUERY` 取消 `ALTER TABLE ... FREEZE ...` 查询，也可通过超时设置 `max_execution_time` 自动取消。[#75016](https://github.com/ClickHouse/ClickHouse/pull/75016)（[Kirill](https://github.com/kirillgarbar)）。
* 支持将 `groupUniqArrayArrayMap` 用作 `SimpleAggregateFunction`。[#75034](https://github.com/ClickHouse/ClickHouse/pull/75034)（[Miel Donkers](https://github.com/mdonkers)）。
* 隐藏 `Iceberg` 数据库引擎中的目录服务凭据设置。解决 [#74559](https://github.com/ClickHouse/ClickHouse/issues/74559)。[#75080](https://github.com/ClickHouse/ClickHouse/pull/75080)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 明确 `intExp2` / `intExp10` 此前未定义的行为：参数过小时返回 0，过大时返回 `18446744073709551615`，为 `nan` 时抛出异常。[#75312](https://github.com/ClickHouse/ClickHouse/pull/75312)（[Vitaly Baranov](https://github.com/vitlibar)）。
* `DatabaseIceberg` 原生支持目录服务配置中的 `s3.endpoint`。解决 [#74558](https://github.com/ClickHouse/ClickHouse/issues/74558)。[#75375](https://github.com/ClickHouse/ClickHouse/pull/75375)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 执行 `SYSTEM DROP REPLICA` 的用户权限不足时，不再静默失败。[#75377](https://github.com/ClickHouse/ClickHouse/pull/75377)（[Bharat Nallan](https://github.com/bharatnc)）。
* 新增 ProfileEvent，统计任一系统日志刷新失败的次数。[#75466](https://github.com/ClickHouse/ClickHouse/pull/75466)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 为解密和解压缩增加检查及额外日志。[#75471](https://github.com/ClickHouse/ClickHouse/pull/75471)（[Vitaly Baranov](https://github.com/vitlibar)）。
* `parseTimeDelta` 函数新增对微符号（U+00B5）的支持。现在微符号（U+00B5）和希腊字母 mu（U+03BC）都被识别为有效的微秒表示，使 ClickHouse 的行为与 Go 实现一致（[see time.go](https://github.com/golang/go/blob/ad7b46ee4ac1cee5095d64b01e8cf7fcda8bee5e/src/time/time.go#L983C19-L983C20) 和 [time/format.go](https://github.com/golang/go/blob/ad7b46ee4ac1cee5095d64b01e8cf7fcda8bee5e/src/time/format.go#L1608-L1609)）。[#75472](https://github.com/ClickHouse/ClickHouse/pull/75472)（[Vitaly Orlov](https://github.com/orloffv)）。
* 将服务器设置 `send_settings_to_client` 替换为客户端设置 `apply_settings_from_server`，控制客户端代码（如解析 INSERT 数据、格式化查询输出）是否使用服务器 `users.xml` 和用户配置文件中的设置。否则，仅使用客户端命令行、会话和查询中的设置。注意：这只适用于原生客户端，不适用于 HTTP 等接口，也不适用于大部分查询处理，因为后者发生在服务器端。[#75478](https://github.com/ClickHouse/ClickHouse/pull/75478)（[Michael Kolupaev](https://github.com/al13n321)）。
* 改进语法错误消息。此前，如果查询过大，且超限的词法单元是很长的字符串字面量，错误原因会被埋在该超长词法单元的两次示例输出之间。修复错误消息中错误截断含 UTF-8 查询的问题，并修复查询片段被过度加引号的问题。解决 [#75473](https://github.com/ClickHouse/ClickHouse/issues/75473)。[#75561](https://github.com/ClickHouse/ClickHouse/pull/75561)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 在 `S3(Azure)Queue` 存储中新增性能分析事件。[#75618](https://github.com/ClickHouse/ClickHouse/pull/75618)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 出于兼容性考虑，禁用服务器向客户端发送设置（`send_settings_to_client=false`）；此功能稍后将重新实现为客户端设置，以改善易用性。[#75648](https://github.com/ClickHouse/ClickHouse/pull/75648)（[Michael Kolupaev](https://github.com/al13n321)）。
* 新增配置 `memory_worker_correct_memory_tracker`，允许使用后台线程定期从不同来源读取的信息，校正内部内存跟踪器。[#75714](https://github.com/ClickHouse/ClickHouse/pull/75714)（[Antonio Andelic](https://github.com/antonio2368)）。
* 为 `system.processes` 新增 `normalized_query_hash` 列。注：虽然可以通过 `normalizedQueryHash` 函数轻松即时计算，但增加该列是为后续变更做准备。[#75756](https://github.com/ClickHouse/ClickHouse/pull/75756)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 即使存在基于已删除数据库创建的 `Merge` 表，查询 `system.tables` 也不会抛出异常。从 `Hive` 表中移除 `getTotalRows` 方法，因为不允许该方法执行复杂工作。[#75772](https://github.com/ClickHouse/ClickHouse/pull/75772)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 以微秒精度存储备份的 start\_time/end\_time。[#75929](https://github.com/ClickHouse/ClickHouse/pull/75929)（[Aleksandr Musorin](https://github.com/AVMusorin)）。
* 新增 `MemoryTrackingUncorrected` 指标，显示未经 RSS 校正的内部全局内存跟踪器的值。[#75935](https://github.com/ClickHouse/ClickHouse/pull/75935)（[Antonio Andelic](https://github.com/antonio2368)）。
* 允许在 `PostgreSQL` 或 `MySQL` 表函数中解析 `localhost:1234/handle` 这样的端点，修复 [https://github.com/ClickHouse/ClickHouse/pull/52503](https://github.com/ClickHouse/ClickHouse/pull/52503) 引入的回归问题。[#75944](https://github.com/ClickHouse/ClickHouse/pull/75944)（[Nikita Mikhaylov](https://github.com/nikitamikhaylov)）。
* 新增服务器设置 `throw_on_unknown_workload`，用于选择查询的 `workload` 设置为未知值时的行为：允许不受限访问（默认），或抛出 `RESOURCE_ACCESS_DENIED` 错误。这可用于强制所有查询使用工作负载调度。[#75999](https://github.com/ClickHouse/ClickHouse/pull/75999)（[Sergei Trifonov](https://github.com/serxa)）。
* 在 `ARRAY JOIN` 中，不必要时不再将子列重写为 `getSubcolumn`。[#76018](https://github.com/ClickHouse/ClickHouse/pull/76018)（[Pavel Kruglov](https://github.com/Avogar)）。
* 加载表时遇到协调错误会重试。[#76020](https://github.com/ClickHouse/ClickHouse/pull/76020)（[Alexander Tokmakov](https://github.com/tavplubix)）。
* 支持通过 `SYSTEM FLUSH LOGS` 刷新单个日志。[#76132](https://github.com/ClickHouse/ClickHouse/pull/76132)（[Raúl Marín](https://github.com/Algunenano)）。
* 改进服务器的 `/binary` 页面：使用 Hilbert 曲线替代 Morton 曲线；在正方形中显示对应 512 MB 的地址，使其更充分地填满正方形，此前地址只填充一半区域；地址颜色更贴近库名而非函数名；允许向区域之外稍多滚动一些。[#76192](https://github.com/ClickHouse/ClickHouse/pull/76192)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* ON CLUSTER 查询遇到 TOO\_MANY\_SIMULTANEOUS\_QUERIES 时重试。[#76352](https://github.com/ClickHouse/ClickHouse/pull/76352)（[Patrick Galbraith](https://github.com/CaptTofu)）。
* 新增异步指标 `CPUOverload`，计算服务器的相对 CPU 资源缺口。[#76404](https://github.com/ClickHouse/ClickHouse/pull/76404)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 将 `output_format_pretty_max_rows` 的默认值从 10000 改为 1000，作者认为这更易用。[#76407](https://github.com/ClickHouse/ClickHouse/pull/76407)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。

#### 错误修复（正式稳定版本中用户可见的异常行为）

* 修复查询解释阶段出现异常时使用自定义格式输出的问题。此前会使用默认格式，而非查询指定的格式。解决 [#55422](https://github.com/ClickHouse/ClickHouse/issues/55422)。[#74994](https://github.com/ClickHouse/ClickHouse/pull/74994)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 SQLite 类型映射：整数类型映射为 `int64`，浮点类型映射为 `float64`。[#73853](https://github.com/ClickHouse/ClickHouse/pull/73853)（[Joanna Hulboj](https://github.com/jh0x)）。
* 修复父作用域中的标识符解析，允许在 WITH 子句中使用表达式别名。修复 [#58994](https://github.com/ClickHouse/ClickHouse/issues/58994)、[#62946](https://github.com/ClickHouse/ClickHouse/issues/62946)、[#63239](https://github.com/ClickHouse/ClickHouse/issues/63239)、[#65233](https://github.com/ClickHouse/ClickHouse/issues/65233)、[#71659](https://github.com/ClickHouse/ClickHouse/issues/71659)、[#71828](https://github.com/ClickHouse/ClickHouse/issues/71828)、[#68749](https://github.com/ClickHouse/ClickHouse/issues/68749)。[#66143](https://github.com/ClickHouse/ClickHouse/pull/66143)（[Dmitry Novik](https://github.com/novikd)）。
* 修复 negate 函数的单调性。此前，当 `x` 是主键时，查询 `select * from a where -x = -42;` 可能返回错误结果。[#71440](https://github.com/ClickHouse/ClickHouse/pull/71440)（[Michael Kolupaev](https://github.com/al13n321)）。
* 修复 arrayIntersect 对空元组的处理。修复 [#72578](https://github.com/ClickHouse/ClickHouse/issues/72578)。[#72581](https://github.com/ClickHouse/ClickHouse/pull/72581)（[Amos Bird](https://github.com/amosbird)）。
* 修复使用错误前缀读取 JSON 子对象子列的问题。[#73182](https://github.com/ClickHouse/ClickHouse/pull/73182)（[Pavel Kruglov](https://github.com/Avogar)）。
* 为客户端与服务器通信正确传递 Native 格式设置。[#73924](https://github.com/ClickHouse/ClickHouse/pull/73924)（[Pavel Kruglov](https://github.com/Avogar)）。
* 检查部分存储不支持的类型。[#74218](https://github.com/ClickHouse/ClickHouse/pull/74218)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复 macOS 上通过 PostgreSQL 接口执行 `INSERT INTO SELECT` 查询时的崩溃问题（问题 [#72938](https://github.com/ClickHouse/ClickHouse/issues/72938)）。[#74231](https://github.com/ClickHouse/ClickHouse/pull/74231)（[Artem Yurov](https://github.com/ArtemYurov)）。
* 修复复制数据库中未初始化的 max\_log\_ptr。[#74336](https://github.com/ClickHouse/ClickHouse/pull/74336)（[Konstantin Morozov](https://github.com/k-morozov)）。
* 修复插入时间间隔时的崩溃问题（问题 [#74299](https://github.com/ClickHouse/ClickHouse/issues/74299)）。[#74478](https://github.com/ClickHouse/ClickHouse/pull/74478)（[NamHoaiNguyen](https://github.com/NamHoaiNguyen)）。
* 修复常量 JSON 字面量的格式化，此前可能导致向其他服务器发送查询时出现语法错误。[#74533](https://github.com/ClickHouse/ClickHouse/pull/74533)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复启用隐式投影并使用常量分区表达式时生成的创建查询无效的问题。修复 [#74596](https://github.com/ClickHouse/ClickHouse/issues/74596)。[#74634](https://github.com/ClickHouse/ClickHouse/pull/74634)（[Amos Bird](https://github.com/amosbird)）。
* 避免 INSERT 以异常结束后连接处于损坏状态。[#74740](https://github.com/ClickHouse/ClickHouse/pull/74740)（[Azat Khuzhin](https://github.com/azat)）。
* 避免复用停留在中间状态的连接。[#74749](https://github.com/ClickHouse/ClickHouse/pull/74749)（[Azat Khuzhin](https://github.com/azat)）。
* 修复解析 JSON 类型声明时，类型名称并非大写而导致的崩溃。[#74784](https://github.com/ClickHouse/ClickHouse/pull/74784)（[Pavel Kruglov](https://github.com/Avogar)）。
* Keeper：修复连接建立前被终止时出现的 logical\_error。[#74844](https://github.com/ClickHouse/ClickHouse/pull/74844)（[Michael Kolupaev](https://github.com/al13n321)）。
* 修复存在使用 `AzureBlobStorage` 的表时服务器可能无法启动的问题；加载表时不再向 Azure 发送请求。[#74880](https://github.com/ClickHouse/ClickHouse/pull/74880)（[Alexey Katsman](https://github.com/alexkats)）。
* 修复 BACKUP 和 RESTORE 操作在 `query_log` 中缺少 `used_privileges` 和 `missing_privileges` 字段的问题。[#74887](https://github.com/ClickHouse/ClickHouse/pull/74887)（[Alexey Katsman](https://github.com/alexkats)）。
* HDFS SELECT 请求发生 SASL 错误时刷新 Kerberos 票据。[#74930](https://github.com/ClickHouse/ClickHouse/pull/74930)（[inv2004](https://github.com/inv2004)）。
* 修复 startup\_scripts 中对 Replicated 数据库的查询。[#74942](https://github.com/ClickHouse/ClickHouse/pull/74942)（[Azat Khuzhin](https://github.com/azat)）。
* 修复 JOIN ON 子句中使用空值安全比较时，带别名表达式的类型问题。[#74970](https://github.com/ClickHouse/ClickHouse/pull/74970)（[Vladimir Cherkasov](https://github.com/vdimir)）。
* 删除操作失败时，将数据片段状态从 deleting 恢复为 outdated。[#74985](https://github.com/ClickHouse/ClickHouse/pull/74985)（[Sema Checherinda](https://github.com/CheSema)）。
* 此前存在标量子查询时，会在初始化数据格式期间开始输出子查询处理累计的进度，而此时尚未写入 HTTP 响应头。这会导致 X-ClickHouse-QueryId、X-ClickHouse-Format 以及 Content-Type 等 HTTP 响应头丢失。现已修复。[#74991](https://github.com/ClickHouse/ClickHouse/pull/74991)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 `database_replicated_allow_replicated_engine_arguments=0` 时的 `CREATE TABLE AS...` 查询。[#75000](https://github.com/ClickHouse/ClickHouse/pull/75000)（[Bharat Nallan](https://github.com/bharatnc)）。
* 修复 INSERT 异常后客户端连接处于异常状态的问题。[#75030](https://github.com/ClickHouse/ClickHouse/pull/75030)（[Azat Khuzhin](https://github.com/azat)）。
* 修复 PSQL 复制中未捕获异常导致的崩溃。[#75062](https://github.com/ClickHouse/ClickHouse/pull/75062)（[Azat Khuzhin](https://github.com/azat)）。
* SASL 可能使任何 RPC 调用失败；此修复可在 krb5 票据过期时重试调用。[#75063](https://github.com/ClickHouse/ClickHouse/pull/75063)（[inv2004](https://github.com/inv2004)）。
* 修复启用 `optimize_function_to_subcolumns` 时，`Array`、`Map` 和 `Nullable(..)` 列的主索引及二级索引使用问题。此前可能忽略这些列的索引。[#75081](https://github.com/ClickHouse/ClickHouse/pull/75081)（[Anton Popov](https://github.com/CurtizJ)）。
* 创建带内部表的物化视图时禁用 `flatten_nested`，因为无法使用这些展开后的列。[#75085](https://github.com/ClickHouse/ClickHouse/pull/75085)（[Christoph Wurm](https://github.com/cwurm)）。
* 修复 forwarded\_for 字段中的部分 IPv6 地址（如 ::ffff:1.1.1.1）被错误解释，导致客户端因异常断开连接的问题。[#75133](https://github.com/ClickHouse/ClickHouse/pull/75133)（[Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)）。
* 修复 LowCardinality 可空数据类型的空值安全 JOIN 处理。此前，使用 `IS NOT DISTINCT FROM`、`<=>`、`a IS NULL AND b IS NULL OR a == b` 等空值安全比较的 JOIN ON 无法正确处理 LowCardinality 列。[#75143](https://github.com/ClickHouse/ClickHouse/pull/75143)（[Vladimir Cherkasov](https://github.com/vdimir)）。
* 检查为 NumRowsCache 统计 total\_number\_of\_rows 时没有指定 key\_condition。[#75164](https://github.com/ClickHouse/ClickHouse/pull/75164)（[Daniil Ivanik](https://github.com/divanik)）。
* 修复新分析器中包含未使用插值的查询。[#75173](https://github.com/ClickHouse/ClickHouse/pull/75173)（[János Benjamin Antal](https://github.com/antaljanosbenjamin)）。
* 修复 CTE 与 INSERT 结合使用时的崩溃。[#75188](https://github.com/ClickHouse/ClickHouse/pull/75188)（[Shichao Jin](https://github.com/jsc0218)）。
* Keeper 修复：回滚日志时避免写入损坏的变更日志。[#75197](https://github.com/ClickHouse/ClickHouse/pull/75197)（[Antonio Andelic](https://github.com/antonio2368)）。
* 在适当情况下将 `BFloat16` 用作超类型。解决 [#74404](https://github.com/ClickHouse/ClickHouse/issues/74404)。[#75236](https://github.com/ClickHouse/ClickHouse/pull/75236)（[Nikita Mikhaylov](https://github.com/nikitamikhaylov)）。
* 修复启用 any\_join\_distinct\_right\_table\_keys 且 JOIN ON 中有 OR 时，连接结果出现非预期默认值的问题。[#75262](https://github.com/ClickHouse/ClickHouse/pull/75262)（[Vladimir Cherkasov](https://github.com/vdimir)）。
* 掩盖 azureblobstorage 表引擎凭据。[#75319](https://github.com/ClickHouse/ClickHouse/pull/75319)（[Garrett Thomas](https://github.com/garrettthomaskth)）。
* 修复 ClickHouse 可能错误地向 PostgreSQL、MySQL 或 SQLite 等外部数据库下推过滤条件的问题。解决 [#71423](https://github.com/ClickHouse/ClickHouse/issues/71423)。[#75320](https://github.com/ClickHouse/ClickHouse/pull/75320)（[Nikita Mikhaylov](https://github.com/nikitamikhaylov)）。
* 修复以 Protobuf 格式输出时并行执行 `SYSTEM DROP FORMAT SCHEMA CACHE` 查询，可能导致 protobuf 结构缓存崩溃的问题。[#75357](https://github.com/ClickHouse/ClickHouse/pull/75357)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复使用并行副本下推 `HAVING` 过滤条件时可能发生的逻辑错误或未初始化内存问题。[#75363](https://github.com/ClickHouse/ClickHouse/pull/75363)（[Vladimir Cherkasov](https://github.com/vdimir)）。
* 隐藏 `icebergS3`、`icebergAzure` 表函数和表引擎中的敏感信息。[#75378](https://github.com/ClickHouse/ClickHouse/pull/75378)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* `TRIM` 现在能够正确处理经计算得到的空裁剪字符集。例如：`SELECT TRIM(LEADING concat('') FROM 'foo')`（问题 [#69922](https://github.com/ClickHouse/ClickHouse/issues/69922)）。[#75399](https://github.com/ClickHouse/ClickHouse/pull/75399)（[Manish Gill](https://github.com/mgill25)）。
* 修复 IOutputFormat 中的数据竞争。[#75448](https://github.com/ClickHouse/ClickHouse/pull/75448)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复在分布式表的 JOIN 中使用 Array 类型 JSON 子列时，可能出现的 `Elements ... and ... of Nested data structure ... (Array columns) have different array sizes` 错误。[#75512](https://github.com/ClickHouse/ClickHouse/pull/75512)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复 `CODEC(ZSTD, DoubleDelta)` 导致的数据损坏。解决 [#70031](https://github.com/ClickHouse/ClickHouse/issues/70031)。[#75548](https://github.com/ClickHouse/ClickHouse/pull/75548)（[Konstantin Bogdanov](https://github.com/thevar1able)）。
* 修复 allow\_feature\_tier 与 MergeTree 设置 compatibility 的交互问题。[#75635](https://github.com/ClickHouse/ClickHouse/pull/75635)（[Raúl Marín](https://github.com/Algunenano)）。
* 修复文件重试时 system.s3queue\_log 中 processed\_rows 值不正确的问题。[#75666](https://github.com/ClickHouse/ClickHouse/pull/75666)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 物化视图写入 URL 引擎遇到连接问题时遵循 `materialized_views_ignore_errors`。[#75679](https://github.com/ClickHouse/ClickHouse/pull/75679)（[Christoph Wurm](https://github.com/cwurm)）。
* 修复对不同类型列执行多次异步 `RENAME` 查询（`alter_sync = 0`）后，读取 `MergeTree` 表时偶发的崩溃。[#75693](https://github.com/ClickHouse/ClickHouse/pull/75693)（[Anton Popov](https://github.com/CurtizJ)）。
* 修复部分含 `UNION ALL` 查询的 `Block structure mismatch in QueryPipeline stream` 错误。[#75715](https://github.com/ClickHouse/ClickHouse/pull/75715)（[Nikolai Kochetov](https://github.com/KochetovNicolai)）。
* ALTER MODIFY 修改投影主键列时重建投影。此前修改投影主键所用列后，SELECT 可能出现 `CANNOT_READ_ALL_DATA` 错误。[#75720](https://github.com/ClickHouse/ClickHouse/pull/75720)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复启用分析器时，标量子查询中 `ARRAY JOIN` 结果不正确的问题。[#75732](https://github.com/ClickHouse/ClickHouse/pull/75732)（[Nikolai Kochetov](https://github.com/KochetovNicolai)）。
* 修复 `DistinctSortedStreamTransform` 中的空指针解引用。[#75734](https://github.com/ClickHouse/ClickHouse/pull/75734)（[Nikita Taranov](https://github.com/nickitat)）。
* 修复 `allow_suspicious_ttl_expressions` 的行为。[#75771](https://github.com/ClickHouse/ClickHouse/pull/75771)（[Aleksei Filatov](https://github.com/aalexfvk)）。
* 修复函数 `translate` 读取未初始化内存的问题。解决 [#75592](https://github.com/ClickHouse/ClickHouse/issues/75592)。[#75794](https://github.com/ClickHouse/ClickHouse/pull/75794)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 将格式设置传递给 Native 格式中将 JSON 格式化为字符串的操作。[#75832](https://github.com/ClickHouse/ClickHouse/pull/75832)（[Pavel Kruglov](https://github.com/Avogar)）。
* 在设置变更历史中记录 v24.12 默认启用并行哈希连接算法的变更。这意味着兼容级别配置为早于 v24.12 时，ClickHouse 会继续使用非并行哈希连接。[#75870](https://github.com/ClickHouse/ClickHouse/pull/75870)（[Robert Schulze](https://github.com/rschu1ze)）。
* 修复无法将隐式添加了 MinMax 索引的表复制为新表的问题（问题 [#75677](https://github.com/ClickHouse/ClickHouse/issues/75677)）。[#75877](https://github.com/ClickHouse/ClickHouse/pull/75877)（[Smita Kulkarni](https://github.com/SmitaRKulkarni)）。
* `clickhouse-library-bridge` 允许打开文件系统中的任意库，因此只有在隔离环境内运行才安全。为避免它在 clickhouse-server 附近运行时产生漏洞，将库路径限制到配置提供的位置。此漏洞由 **Arseniy Dugin** 使用 [ClickHouse Bug Bounty Program](https://github.com/ClickHouse/ClickHouse/issues/38986) 发现。[#75954](https://github.com/ClickHouse/ClickHouse/pull/75954)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 部分元数据使用了 JSON 序列化，这是一个错误，因为 JSON 字符串字面量不支持包括零字节在内的二进制数据。SQL 查询可以包含二进制数据和无效 UTF-8，因此元数据文件也必须支持。与此同时，ClickHouse 的 `JSONEachRow` 等格式通过偏离 JSON 标准来保证二进制数据能够无损往返转换，相关动机见 [https://github.com/ClickHouse/ClickHouse/pull/73668#issuecomment-2560501790](https://github.com/ClickHouse/ClickHouse/pull/73668#issuecomment-2560501790)。解决方案是让 `Poco::JSON` 库与 ClickHouse 的 JSON 格式序列化保持一致。解决 [#73668](https://github.com/ClickHouse/ClickHouse/issues/73668)。[#75963](https://github.com/ClickHouse/ClickHouse/pull/75963)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 `S3Queue` 存储中的提交限制检查。[#76104](https://github.com/ClickHouse/ClickHouse/pull/76104)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复挂载带有自动索引（`add_minmax_index_for_numeric_columns`/`add_minmax_index_for_string_columns`）的 MergeTree 表的问题。[#76139](https://github.com/ClickHouse/ClickHouse/pull/76139)（[Azat Khuzhin](https://github.com/azat)）。
* 修复未打印任务父线程调用栈（`enable_job_stack_trace` 设置）的问题，以及 `enable_job_stack_trace` 未正确传递给线程、导致调用栈内容并不总是遵循该设置的问题。[#76191](https://github.com/ClickHouse/ClickHouse/pull/76191)（[Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)）。
* 修复 `ALTER RENAME` 错误要求 `CREATE USER` 授权的问题。解决 [#74372](https://github.com/ClickHouse/ClickHouse/issues/74372)。[#76241](https://github.com/ClickHouse/ClickHouse/pull/76241)（[pufit](https://github.com/pufit)）。
* 修复大端架构上对 FixedString 使用 reinterpretAs 的问题。[#76253](https://github.com/ClickHouse/ClickHouse/pull/76253)（[Azat Khuzhin](https://github.com/azat)）。
* 修复 S3Queue 中的逻辑错误“Expected current processor {} to be equal to {} for bucket {}”。[#76358](https://github.com/ClickHouse/ClickHouse/pull/76358)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复 Memory 数据库中 ALTER 导致的死锁。[#76359](https://github.com/ClickHouse/ClickHouse/pull/76359)（[Azat Khuzhin](https://github.com/azat)）。
* 修复 `WHERE` 条件包含 `pointInPolygon` 函数时索引分析的逻辑错误。[#76360](https://github.com/ClickHouse/ClickHouse/pull/76360)（[Anton Popov](https://github.com/CurtizJ)）。
* 修复信号处理函数中可能不安全的调用。[#76549](https://github.com/ClickHouse/ClickHouse/pull/76549)（[Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)）。
* 修复 PartsSplitter 对反向键的支持。修复 [#73400](https://github.com/ClickHouse/ClickHouse/issues/73400)。[#73418](https://github.com/ClickHouse/ClickHouse/pull/73418)（[Amos Bird](https://github.com/amosbird)）。

#### 构建/测试/打包改进

* 支持在 ARM 和 Intel Mac 上构建 HDFS。[#74244](https://github.com/ClickHouse/ClickHouse/pull/74244)（[Yan Xin](https://github.com/yxheartipp)）。
* 为 Darwin 交叉编译时启用 ICU 和 GRPC。[#75922](https://github.com/ClickHouse/ClickHouse/pull/75922)（[Raúl Marín](https://github.com/Algunenano)）。
* 升级到内嵌 LLVM 19。[#75148](https://github.com/ClickHouse/ClickHouse/pull/75148)（[Konstantin Bogdanov](https://github.com/thevar1able)）。
* 在 Docker 镜像中禁用 default 用户的网络访问。[#75259](https://github.com/ClickHouse/ClickHouse/pull/75259)（[Mikhail f. Shiryaev](https://github.com/Felixoid)）。将所有 clickhouse-server 相关操作封装为函数，并仅在 `entrypoint.sh` 启动默认二进制程序时执行，这是 [#50724](https://github.com/ClickHouse/ClickHouse/issues/50724) 中提出但长期搁置的改进。为 `clickhouse-extract-from-config` 新增 `--users` 开关，以从 `users.xml` 获取值。[#75643](https://github.com/ClickHouse/ClickHouse/pull/75643)（[Mikhail f. Shiryaev](https://github.com/Felixoid)）。
* 从二进制文件中移除约 20 MB 的无用代码。[#76226](https://github.com/ClickHouse/ClickHouse/pull/76226)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
