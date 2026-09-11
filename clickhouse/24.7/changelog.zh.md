<h3 id="a-id247a-clickhouse-release-247-2024-07-30">
  <a id="247" /> ClickHouse 24.7 版本, 2024-07-30. [演示文稿](https://presentations.clickhouse.com/2024-release-24.7/), [视频](https://www.youtube.com/watch?v=GerQFdJCk7A)
</h3>

<Frame>
  <iframe src="https://www.youtube.com/embed/GerQFdJCk7A" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
</Frame>

<h4 id="backward-incompatible-change-5">
  向后不兼容变更
</h4>

* 禁止在 Replicated 数据库中使用 `CRATE MATERIALIZED VIEW ... ENGINE Replicated*MergeTree POPULATE AS SELECT ...`。 [#63963](https://github.com/ClickHouse/ClickHouse/pull/63963) ([vdimir](https://github.com/vdimir)).
* `clickhouse-keeper-client` 仅接受字符串字面量形式的路径，例如 `ls '/hello/world'`，不再接受 `ls /hello/world` 这样的裸字符串。 [#65494](https://github.com/ClickHouse/ClickHouse/pull/65494) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 将指标 `KeeperOutstandingRequets` 重命名为 `KeeperOutstandingRequests`。 [#66206](https://github.com/ClickHouse/ClickHouse/pull/66206) ([Robert Schulze](https://github.com/rschu1ze)).
* 从 `system.functions` 表移除字段 `is_deterministic`。 [#66630](https://github.com/ClickHouse/ClickHouse/pull/66630) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 函数 `tuple` 现在尝试在查询中构造命名元组（由 `enable_named_columns_in_function_tuple` 控制）。新增函数 `tupleNames`，提取元组中的名称。 [#54881](https://github.com/ClickHouse/ClickHouse/pull/54881) ([Amos Bird](https://github.com/amosbird)).
* 改变物化视图的去重方式，修复多种情况：- 目标表中，数据拆成两个或更多数据块，并行插入时这些数据块被视为重复；- 物化视图目标表中，相同数据块被去重，常见于物化视图通过聚合将不同输入产生为相同结果；- 物化视图目标表中，来自不同物化视图的相同数据块被去重。 [#61601](https://github.com/ClickHouse/ClickHouse/pull/61601) ([Sema Checherinda](https://github.com/CheSema)).
* 函数 `bitShiftLeft` 和 `bitShitfRight` 对越界移位位置返回错误。 [#65838](https://github.com/ClickHouse/ClickHouse/pull/65838) ([Pablo Marcos](https://github.com/pamarcos)).

<h4 id="new-feature-5">
  新功能
</h4>

* 为 `full_sorting_join` 算法添加 `ASOF JOIN` 支持。 [#55051](https://github.com/ClickHouse/ClickHouse/pull/55051) ([vdimir](https://github.com/vdimir)).
* `clickhouse-client` 支持 JWT 身份验证（仅在 ClickHouse Cloud 提供）。 [#62829](https://github.com/ClickHouse/ClickHouse/pull/62829) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 新增 SQL 函数 `changeYear`、`changeMonth`、`changeDay`、`changeHour`、`changeMinute`、`changeSecond`。例如，`SELECT changeMonth(toDate('2024-06-14'), 7)` 返回日期 `2024-07-14`。 [#63186](https://github.com/ClickHouse/ClickHouse/pull/63186) ([cucumber95](https://github.com/cucumber95)).
* 引入启动脚本，允许在启动阶段执行预先配置的查询。 [#64889](https://github.com/ClickHouse/ClickHouse/pull/64889) ([pufit](https://github.com/pufit)).
* 客户端配置支持 accept\_invalid\_certificate，允许通过安全 TCP 连接使用自签名证书的服务器；可作为相应 `openSSL` 客户端设置 `verificationMode=none` + `invalidCertificateHandler.name=AcceptCertificateHandler` 的简写。 [#65238](https://github.com/ClickHouse/ClickHouse/pull/65238) ([peacewalker122](https://github.com/peacewalker122)).
* 新增 system.error\_log，包含 system.errors 表中错误值的历史，定期刷新到磁盘。 [#65381](https://github.com/ClickHouse/ClickHouse/pull/65381) ([Pablo Marcos](https://github.com/pamarcos)).
* 新增聚合函数 `groupConcat`，大致等同于 `arrayStringConcat( groupArray(column), ',')`。可接收两个参数：字符串分隔符与待处理元素数量。 [#65451](https://github.com/ClickHouse/ClickHouse/pull/65451) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 新增 AzureQueue 存储。 [#65458](https://github.com/ClickHouse/ClickHouse/pull/65458) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 新增设置，控制是否将页面索引写入 Parquet 文件。 [#65475](https://github.com/ClickHouse/ClickHouse/pull/65475) ([lgbo](https://github.com/lgbo-ustc)).
* 引入服务器配置 `logger.console_log_level`，控制控制台日志级别（如果启用了控制台日志）。 [#65559](https://github.com/ClickHouse/ClickHouse/pull/65559) ([Azat Khuzhin](https://github.com/azat)).
* 使用 `file` 表函数时，自动在目录路径末尾追加通配符 `*`。 [#66019](https://github.com/ClickHouse/ClickHouse/pull/66019) ([Zhidong (David) Guo](https://github.com/Gun9niR)).
* 为客户端非交互模式新增 `--memory-usage` 选项。 [#66393](https://github.com/ClickHouse/ClickHouse/pull/66393) ([vdimir](https://github.com/vdimir)).
* 为 clickhouse-disks 提供交互式客户端，并可从本地目录添加本地磁盘。 [#64446](https://github.com/ClickHouse/ClickHouse/pull/64446) ([Daniil Ivanik](https://github.com/divanik)).
* 对包含投影的表执行轻量删除时，用户可选择抛出异常（默认）或删除投影。 [#65594](https://github.com/ClickHouse/ClickHouse/pull/65594) ([jsc0218](https://github.com/jsc0218)).
* 新增系统表，包含所有已分离表的主要信息。 [#65400](https://github.com/ClickHouse/ClickHouse/pull/65400) ([Konstantin Morozov](https://github.com/k-morozov)).

<h4 id="experimental-feature-4">
  实验性功能
</h4>

* 改变 `Variant` 数据类型的二进制序列化：新增 `compact` 模式，避免对仅含单个变体或仅含 NULL 的粒度重复写入相同判别值。新增默认启用的 MergeTree 设置 `use_compact_variant_discriminators_serialization`。注意，Variant 仍是实验性类型，允许进行不向后兼容的序列化变更。 [#62774](https://github.com/ClickHouse/ClickHouse/pull/62774) ([Kruglov Pavel](https://github.com/Avogar)).
* 支持 clickhouse-keeper 的磁盘后端存储。 [#56626](https://github.com/ClickHouse/ClickHouse/pull/56626) ([Han Fei](https://github.com/hanfei1991)).
* 重构 JSONExtract 函数，支持更多类型，包括实验性 Dynamic。 [#66046](https://github.com/ClickHouse/ClickHouse/pull/66046) ([Kruglov Pavel](https://github.com/Avogar)).
* 支持 `Variant` 和 `Dynamic` 子列的空值位图子列。 [#66178](https://github.com/ClickHouse/ClickHouse/pull/66178) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复从经过变更的 `Memory` 表读取 `Dynamic` 子列的问题。此前通过 ALTER 修改 Memory 表中 Dynamic 类型的 `max_types` 参数后，后续子列读取可能返回错误结果。 [#66066](https://github.com/ClickHouse/ClickHouse/pull/66066) ([Kruglov Pavel](https://github.com/Avogar)).
* 使用自定义键并行副本时支持 `cluster_for_parallel_replicas`，从而可将自定义键并行副本用于 MergeTree 表。 [#65453](https://github.com/ClickHouse/ClickHouse/pull/65453) ([Antonio Andelic](https://github.com/antonio2368)).

<h4 id="performance-improvement-5">
  性能改进
</h4>

* 将整数转字符串算法替换为更快实现（从修改版 amdn/itoa 改为修改版 jeaiii/itoa）。 [#61661](https://github.com/ClickHouse/ClickHouse/pull/61661) ([Raúl Marín](https://github.com/Algunenano)).
* 现在收集并缓存连接（`parallel_hash` 算法）所建哈希表的大小。后续查询执行将利用这些信息预分配哈希表空间，节省扩容时间。 [#64553](https://github.com/ClickHouse/ClickHouse/pull/64553) ([Nikita Taranov](https://github.com/nickitat)).
* 通过缓冲优化按主键 `ORDER BY` 且 `WHERE` 包含高选择性条件的查询。由默认启用的 `read_in_order_use_buffering` 控制，可能增加查询内存占用。 [#64607](https://github.com/ClickHouse/ClickHouse/pull/64607) ([Anton Popov](https://github.com/CurtizJ)).
* 提升加载 `plain_rewritable` 元数据的性能。 [#65634](https://github.com/ClickHouse/ClickHouse/pull/65634) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 在只读磁盘上附加表时，不加载过时数据片段，以减少资源使用。 [#65635](https://github.com/ClickHouse/ClickHouse/pull/65635) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Set 索引支持 minmax 超矩形。 [#65676](https://github.com/ClickHouse/ClickHouse/pull/65676) ([AntiTopQuark](https://github.com/AntiTopQuark)).
* 卸载过时数据片段的主索引，减少总内存占用。 [#65852](https://github.com/ClickHouse/ClickHouse/pull/65852) ([Anton Popov](https://github.com/CurtizJ)).
* 模式简单（不含元字符、字符类、标志或分组字符等）时，`replaceRegexpAll` 和 `replaceRegexpOne` 显著加快。（感谢 Taiyang Li。） [#66185](https://github.com/ClickHouse/ClickHouse/pull/66185) ([Robert Schulze](https://github.com/rschu1ze)).
* S3 请求：缩短查询重试时间，增加备份重试次数。查询为 8.5 分钟、100 次重试；备份恢复为 1.2 小时、1000 次重试。 [#65232](https://github.com/ClickHouse/ClickHouse/pull/65232) ([Sema Checherinda](https://github.com/CheSema)).
* 支持查询计划 LIMIT 优化；为 PostgreSQL 存储和表函数支持 LIMIT 下推。 [#65454](https://github.com/ClickHouse/ClickHouse/pull/65454) ([Maksim Kita](https://github.com/kitaisreal)).
* 改进 ZooKeeper 负载均衡。即使达到 `fallback_session_lifetime`，当前会话也不会在最优节点可用前过期。新增感知可用区的负载均衡支持。 [#65570](https://github.com/ClickHouse/ClickHouse/pull/65570) ([Alexander Tokmakov](https://github.com/tavplubix)).
* DatabaseCatalog 最多使用 database\_catalog\_drop\_table\_concurrency 个线程，加快删除表。 [#66065](https://github.com/ClickHouse/ClickHouse/pull/66065) ([Sema Checherinda](https://github.com/CheSema)).

<h4 id="improvement-5">
  改进
</h4>

* 改进 ZooKeeper 负载均衡。即使达到 `fallback_session_lifetime`，当前会话也不会在最优节点可用前过期。新增感知可用区的负载均衡支持。 [#65570](https://github.com/ClickHouse/ClickHouse/pull/65570) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 默认禁用设置 `optimize_trivial_insert_select`。大多数情况下这应有益。不过，若发现 INSERT SELECT 变慢或内存增加，可重新启用，或执行 `SET compatibility = '24.6'`。 [#58970](https://github.com/ClickHouse/ClickHouse/pull/58970) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* `clickhouse-client` 或 `clickhouse-local` 崩溃时打印堆栈跟踪与诊断信息。 [#61109](https://github.com/ClickHouse/ClickHouse/pull/61109) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 此前 `SHOW INDEX | INDEXES | INDICES | KEYS` 的结果按主键列名排序，这不够直观。现在改为按主键列在主键中的位置排序。 [#61131](https://github.com/ClickHouse/ClickHouse/pull/61131) ([Robert Schulze](https://github.com/rschu1ze)).
* 改变物化视图的去重方式，修复多种情况：- 目标表中，数据拆成两个或更多数据块，并行插入时这些数据块被视为重复；- 物化视图目标表中，相同数据块被去重，常见于物化视图通过聚合将不同输入产生为相同结果；- 物化视图目标表中，来自不同物化视图的相同数据块被去重。 [#61601](https://github.com/ClickHouse/ClickHouse/pull/61601) ([Sema Checherinda](https://github.com/CheSema)).
* 支持读取 DeltaLake 分区数据；通过读取元数据而非数据推断 DeltaLake 结构。 [#63201](https://github.com/ClickHouse/ClickHouse/pull/63201) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 此前可组合协议的 TLS 层仅接受 `certificateFile` 和 `privateKeyFile` 参数。[https://clickhouse.com/docs/operations/settings/composable-protocols](https://clickhouse.com/docs/operations/settings/composable-protocols)。 [#63985](https://github.com/ClickHouse/ClickHouse/pull/63985) ([Anton Ivashkin](https://github.com/ianton-ru)).
* 新增 Profile Event `SelectQueriesWithPrimaryKeyUsage`，表示使用主键计算 WHERE 子句的 SELECT 查询数量。 [#64492](https://github.com/ClickHouse/ClickHouse/pull/64492) ([0x01f](https://github.com/0xfei)).
* `StorageS3Queue` 相关修复与改进：根据服务器物理 CPU 核心数推导 `s3queue_processing_threads_num` 默认值（此前为 1）。将 `s3queue_loading_retries` 默认值设为 10。修复 `system.s3queue` 异常列中可能出现的模糊“Uncaught exception”消息。发生 `MEMORY_LIMIT_EXCEEDED` 时不增加重试计数。将文件提交移到数据完全插入表之后，避免文件已提交但数据未插入。新增 `s3queue_max_processed_files_before_commit`、`s3queue_max_processed_rows_before_commit`、`s3queue_max_processed_bytes_before_commit`、`s3queue_max_processing_time_sec_before_commit`，更好地控制提交和刷新时间。 [#65046](https://github.com/ClickHouse/ClickHouse/pull/65046) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 支持参数化视图函数中的别名（仅新分析器）。 [#65190](https://github.com/ClickHouse/ClickHouse/pull/65190) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 在 azureBlobStorage 日志中遮蔽账户密钥。 [#65273](https://github.com/ClickHouse/ClickHouse/pull/65273) ([SmitaRKulkarni](https://github.com/SmitaRKulkarni)).
* 当过滤表达式是 `PARTITION BY` 表达式的一部分时，为 `IN` 谓词进行分区裁剪。 [#65335](https://github.com/ClickHouse/ClickHouse/pull/65335) ([Eduard Karacharov](https://github.com/korowa)).
* `arrayMin`/`arrayMax` 可用于所有可比较的数据类型。 [#65455](https://github.com/ClickHouse/ClickHouse/pull/65455) ([pn](https://github.com/chloro-pn)).
* 改进 cgroups v2 内存计量，排除页面缓存占用。 [#65470](https://github.com/ClickHouse/ClickHouse/pull/65470) ([Nikita Taranov](https://github.com/nickitat)).
* 将数据块序列化以插入 EmbeddedRocksDB 表时，不再为每行创建格式设置。 [#65474](https://github.com/ClickHouse/ClickHouse/pull/65474) ([Duc Canh Le](https://github.com/canhld94)).
* 将 `clickhouse-local` 提示符简化为 `:)`。`getFQDNOrHostName()` 在 macOS 上耗时过长，而且我们本就不想在 `clickhouse-local` 提示符中显示主机名。 [#65510](https://github.com/ClickHouse/ClickHouse/pull/65510) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 避免在低端虚拟机上打印 jemalloc 关于每 CPU arena 的消息。 [#65532](https://github.com/ClickHouse/ClickHouse/pull/65532) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 默认禁用文件系统缓存后台下载。待修复潜在的“Memory limit exceeded”问题后再启用：使用后台下载线程时，缓冲区在查询上下文中分配，却在上下文外释放。此外，还需新增独立设置，限制后台工作线程的最大下载大小（目前受 max\_file\_segment\_size 限制，可能过大）。 [#65534](https://github.com/ClickHouse/ClickHouse/pull/65534) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 新增配置选项 `<config_reload_interval_ms>`，指定 ClickHouse 重新加载配置的频率。 [#65545](https://github.com/ClickHouse/ClickHouse/pull/65545) ([alesapin](https://github.com/alesapin)).
* 实现 ClickHouse 数据类型的二进制编码，并在文档中添加规范。用于 Dynamic 二进制序列化，也允许通过设置在 RowBinaryWithNamesAndTypes 和 Native 格式中使用。 [#65546](https://github.com/ClickHouse/ClickHouse/pull/65546) ([Kruglov Pavel](https://github.com/Avogar)).
* 服务器设置 `compiled_expression_cache_size` 和 `compiled_expression_cache_elements_size` 现在显示在 `system.server_settings` 中。 [#65584](https://github.com/ClickHouse/ClickHouse/pull/65584) ([Robert Schulze](https://github.com/rschu1ze)).
* 支持基于 X.509 SubjectAltName 扩展识别用户。 [#65626](https://github.com/ClickHouse/ClickHouse/pull/65626) ([Anton Kozlov](https://github.com/tonickkozlov)).
* `clickhouse-local` 遵守配置文件中的 `max_server_memory_usage` 和 `max_server_memory_usage_to_ram_ratio`。同时像 `clickhouse-server` 一样，默认将最大内存使用量设为系统内存的 90%。 [#65697](https://github.com/ClickHouse/ClickHouse/pull/65697) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 新增将文件备份到 ClickHouse 的脚本。 [#65699](https://github.com/ClickHouse/ClickHouse/pull/65699) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* PostgreSQL 源支持取消查询。 [#65722](https://github.com/ClickHouse/ClickHouse/pull/65722) ([Maksim Kita](https://github.com/kitaisreal)).
* 分布式查询的 `allow_experimental_analyzer` 由发起端控制，确保混合版本集群操作的兼容性和正确性。 [#65777](https://github.com/ClickHouse/ClickHouse/pull/65777) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* Keeper 遵守 cgroup CPU 限制。 [#65819](https://github.com/ClickHouse/ClickHouse/pull/65819) ([Antonio Andelic](https://github.com/antonio2368)).
* 允许无参数调用 `concat` 函数：`:) select concat();`。 [#65887](https://github.com/ClickHouse/ClickHouse/pull/65887) ([李扬](https://github.com/taiyang-li)).
* 允许在 `clickhouse-local` 中管理命名集合。 [#65973](https://github.com/ClickHouse/ClickHouse/pull/65973) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 改进 Azure 相关 Profile Event。 [#65999](https://github.com/ClickHouse/ClickHouse/pull/65999) ([alesapin](https://github.com/alesapin)).
* 支持按写入器时区读取 ORC 文件。 [#66025](https://github.com/ClickHouse/ClickHouse/pull/66025) ([kevinyhzou](https://github.com/KevinyhZou)).
* 新增控制 PostgreSQL 连接的设置。`postgresql_connection_attempt_timeout` 指定传递给连接 URL 的 `connect_timeout` 参数值；`postgresql_connection_pool_retries` 指定建立到 PostgreSQL 端点连接时的重试次数。 [#66232](https://github.com/ClickHouse/ClickHouse/pull/66232) ([Dmitry Novik](https://github.com/novikd)).
* 降低 `system.processors_profile_log` 中 `input_wait_elapsed_us`/`elapsed_us` 的误差。 [#66239](https://github.com/ClickHouse/ClickHouse/pull/66239) ([Azat Khuzhin](https://github.com/azat)).
* 改进文件系统缓存的 ProfileEvents。 [#66249](https://github.com/ClickHouse/ClickHouse/pull/66249) ([zhukai](https://github.com/nauu)).
* 新增设置，在命名集合使用复制存储时，忽略管理查询中的 `ON CLUSTER` 子句。 [#66288](https://github.com/ClickHouse/ClickHouse/pull/66288) ([MikhailBurdukov](https://github.com/MikhailBurdukov)).
* 函数 `generateSnowflakeID` 现在允许通过参数指定机器 ID，避免大型集群中的冲突。 [#66374](https://github.com/ClickHouse/ClickHouse/pull/66374) ([ZAWA\_ll](https://github.com/Zawa-ll)).
* 交互模式下禁用 `Ctrl+Z` 挂起。这是常见的误操作陷阱，几乎所有用户都不期待此行为。我想只有极少数高级用户可能喜欢把终端应用挂到后台，不过我不认识这样的人。 [#66511](https://github.com/ClickHouse/ClickHouse/pull/66511) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 新增字典主键类型校验选项。未启用时，对于简单布局，任意列类型均隐式转换为 UInt64。 [#66595](https://github.com/ClickHouse/ClickHouse/pull/66595) ([MikhailBurdukov](https://github.com/MikhailBurdukov)).

<h4 id="bug-fix-user-visible-misbehavior-in-an-official-stable-release-4">
  缺陷修复（正式稳定版本中用户可见的异常行为）
</h4>

* 在 CREATE/REPLACE/RENAME/EXCHANGE 查询中检查循环依赖，发现时抛出异常。此前循环依赖可能导致服务器启动死锁。同时修复依赖关系创建中的部分缺陷。 [#65405](https://github.com/ClickHouse/ClickHouse/pull/65405) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复函数调用中 `LowCardinality` 列大小不符合预期的问题。 [#65298](https://github.com/ClickHouse/ClickHouse/pull/65298) ([Raúl Marín](https://github.com/Algunenano)).
* 修复 maxIntersections 崩溃。 [#65689](https://github.com/ClickHouse/ClickHouse/pull/65689) ([Raúl Marín](https://github.com/Algunenano)).
* 修复用户定义的 `VALID UNTIL` 子句在重启后被重置的问题。 [#66409](https://github.com/ClickHouse/ClickHouse/pull/66409) ([Nikolay Degterinsky](https://github.com/evillique)).
* 修复 `SHOW MERGES` 的剩余时间列。 [#66735](https://github.com/ClickHouse/ClickHouse/pull/66735) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复 clickhouse-client 可能重复打印两次 `Query was cancelled` 的行为。 [#66005](https://github.com/ClickHouse/ClickHouse/pull/66005) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* 修复不受支持的实验性 `MaterializedMySQL` 在 TABLE OVERRIDE 将 MySQL NULL 字段映射为 ClickHouse 非 NULL 字段时的崩溃。 [#54649](https://github.com/ClickHouse/ClickHouse/pull/54649) ([Filipp Ozinov](https://github.com/bakwc)).
* 修复 `PREWHERE` 表达式不读取列且表无自适应索引粒度（非常老的表）时的逻辑错误。 [#59173](https://github.com/ClickHouse/ClickHouse/pull/59173) ([Alexander Gololobov](https://github.com/davenger)).
* 修复取消查询时取消缓冲区的缺陷。 [#64478](https://github.com/ClickHouse/ClickHouse/pull/64478) ([Sema Checherinda](https://github.com/CheSema)).
* 修复 columns.txt 不存在时从元数据填充数据片段列的问题。 [#64757](https://github.com/ClickHouse/ClickHouse/pull/64757) ([Azat Khuzhin](https://github.com/azat)).
* 修复 `ALTER TABLE ... ON CLUSTER ... MODIFY SQL SECURITY` 崩溃。 [#64957](https://github.com/ClickHouse/ClickHouse/pull/64957) ([pufit](https://github.com/pufit)).
* 修复销毁 AccessControl 时的崩溃：增加显式关闭。 [#64993](https://github.com/ClickHouse/ClickHouse/pull/64993) ([Vitaly Baranov](https://github.com/vitlibar)).
* 递归消除 `uniq*` 函数参数中的单射函数。此前功能正常，但新分析器破坏了该行为。 [#65140](https://github.com/ClickHouse/ClickHouse/pull/65140) ([Duc Canh Le](https://github.com/canhld94)).
* 修复包含 CTE 的查询中意外的投影名称。 [#65267](https://github.com/ClickHouse/ClickHouse/pull/65267) ([wudidapaopao](https://github.com/wudidapaopao)).
* 通过直接查询或 `Dictionary` 表引擎访问字典时，要求拥有 `dictGet` 权限。 [#65359](https://github.com/ClickHouse/ClickHouse/pull/65359) ([Joe Lynch](https://github.com/joelynch)).
* 修复增量备份中的用户专属 S3 身份验证。 [#65481](https://github.com/ClickHouse/ClickHouse/pull/65481) ([Antonio Andelic](https://github.com/antonio2368)).
* 如果启用 `read-in-order` 优化，则对带 `FINAL` 的查询禁用 `non-intersecting-parts` 优化，以免产生错误结果。在此修复合并前，可禁用 `do_not_merge_across_partitions_select_final` 和 `split_parts_ranges_into_intersecting_and_non_intersecting_final` 作为变通办法。 [#65505](https://github.com/ClickHouse/ClickHouse/pull/65505) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复列表批次的全部文件被过滤后出现 `Index out of bound for blob metadata` 异常。 [#65523](https://github.com/ClickHouse/ClickHouse/pull/65523) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复投影去重合并中的 NOT\_FOUND\_COLUMN\_IN\_BLOCK。 [#65573](https://github.com/ClickHouse/ClickHouse/pull/65573) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* 修复 MergeJoin 的缺陷：采用稀疏序列化的列可能未经必要转换，就被当作其嵌套类型的列。 [#65632](https://github.com/ClickHouse/ClickHouse/pull/65632) ([Nikita Taranov](https://github.com/nickitat)).
* 修复兼容级别 '23.4' 未正确应用的缺陷。 [#65737](https://github.com/ClickHouse/ClickHouse/pull/65737) ([cw5121](https://github.com/cw5121)).
* 修复包含可空字段的 ODBC 表。 [#65738](https://github.com/ClickHouse/ClickHouse/pull/65738) ([Rodolphe Dugé de Bernonville](https://github.com/RodolpheDuge)).
* 修复致命错误时 `TCPHandler` 可能出现的数据竞态。 [#65744](https://github.com/ClickHouse/ClickHouse/pull/65744) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复函数 `parseDateTime` 使用 `%F` 和 `%D` 占位符时的无效异常。 [#65768](https://github.com/ClickHouse/ClickHouse/pull/65768) ([Antonio Andelic](https://github.com/antonio2368)).
* 读取 `PostgreSQL` 的查询，在 ClickHouse 查询完成后取消内部 `PostgreSQL` 查询。否则，必须等待内部 `PostgreSQL` 查询结束，才能取消 `ClickHouse` 查询。 [#65771](https://github.com/ClickHouse/ClickHouse/pull/65771) ([Maksim Kita](https://github.com/kitaisreal)).
* 修复旧分析器与 dictGetOrDefault 组合使用时的短路逻辑缺陷。 [#65802](https://github.com/ClickHouse/ClickHouse/pull/65802) ([jsc0218](https://github.com/jsc0218)).
* 修复启用 TTL 的 EmbeddedRocksDB 写出损坏 SST 文件的缺陷。 [#65816](https://github.com/ClickHouse/ClickHouse/pull/65816) ([Duc Canh Le](https://github.com/canhld94)).
* 函数 `bitTest`、`bitTestAll` 和 `bitTestAny` 在指定位索引越界时返回错误。 [#65818](https://github.com/ClickHouse/ClickHouse/pull/65818) ([Pablo Marcos](https://github.com/pamarcos)).
* 所有使用哈希连接的查询均支持设置 `join_any_take_last_row`。 [#65820](https://github.com/ClickHouse/ClickHouse/pull/65820) ([vdimir](https://github.com/vdimir)).
* 更好地处理涉及 `IS NULL` 检查的连接条件，例如将 `ON (a = b AND (a IS NOT NULL) AND (b IS NOT NULL) ) OR ( (a IS NULL) AND (b IS NULL) )` 重写为 `ON a <=> b`；修复存在 `IS NULL` 以外条件时的错误优化。 [#65835](https://github.com/ClickHouse/ClickHouse/pull/65835) ([vdimir](https://github.com/vdimir)).
* 修复 S3Queue 内存占用持续增长。 [#65839](https://github.com/ClickHouse/ClickHouse/pull/65839) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复 `arrayAUC` 的并列值处理，使其与 sklearn 一致。 [#65840](https://github.com/ClickHouse/ClickHouse/pull/65840) ([gabrielmcg44](https://github.com/gabrielmcg44)).
* 修复 MySQL 服务器协议 TLS 连接可能存在的问题。 [#65917](https://github.com/ClickHouse/ClickHouse/pull/65917) ([Azat Khuzhin](https://github.com/azat)).
* 修复 MySQL 客户端协议 TLS 连接可能存在的问题。 [#65938](https://github.com/ClickHouse/ClickHouse/pull/65938) ([Azat Khuzhin](https://github.com/azat)).
* 修复零超时时对 `SSL_ERROR_WANT_READ`/`SSL_ERROR_WANT_WRITE` 的处理。 [#65941](https://github.com/ClickHouse/ClickHouse/pull/65941) ([Azat Khuzhin](https://github.com/azat)).
* 在结构推断缓存中补充缺失设置 `input_format_csv_skip_first_lines/input_format_tsv_skip_first_lines/input_format_csv_try_infer_numbers_from_strings/input_format_csv_try_infer_strings_from_quoted_tuples`，因为它们会改变推断结构，避免设置变化后结构推断结果错误。 [#65980](https://github.com/ClickHouse/ClickHouse/pull/65980) ([Kruglov Pavel](https://github.com/Avogar)).
* S3 引擎和 s3 表函数的 \_size 列表示归档内部文件的大小，而非归档本身大小。 [#65993](https://github.com/ClickHouse/ClickHouse/pull/65993) ([Daniil Ivanik](https://github.com/divanik)).
* 修复分析器解析动态子列的问题，避免读取动态子列时加载整列。 [#66004](https://github.com/ClickHouse/ClickHouse/pull/66004) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复 from\_env 与 replace 覆盖组合时的配置合并。 [#66034](https://github.com/ClickHouse/ClickHouse/pull/66034) ([Azat Khuzhin](https://github.com/azat)).
* 修复 `GRPCServer` 关闭期间可能挂起的问题。 [#66061](https://github.com/ClickHouse/ClickHouse/pull/66061) ([Vitaly Baranov](https://github.com/vitlibar)).
* 修复函数 `has` 使用非常量 `LowCardinality` 参数的多种情况。 [#66088](https://github.com/ClickHouse/ClickHouse/pull/66088) ([Anton Popov](https://github.com/CurtizJ)).
* 修复 `groupArrayIntersect` 的 `merge()` 函数行为错误，同时修复数值及通用数据在 `deserialise()` 中的行为。 [#66103](https://github.com/ClickHouse/ClickHouse/pull/66103) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 修复 `unbin`/`unhex` 实现中的缓冲区溢出。 [#66106](https://github.com/ClickHouse/ClickHouse/pull/66106) ([Nikita Taranov](https://github.com/nickitat)).
* 禁用 [#64760](https://github.com/ClickHouse/ClickHouse/issues/64760) 引入的 `merge-filters` 优化。若其合并两个过滤表达式却不进行短路求值，可能引发异常。 [#66126](https://github.com/ClickHouse/ClickHouse/pull/66126) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复服务器无法解析编码为负数据块大小数组的 Avro 文件的问题；Avro 规范现在允许这种编码。 [#66130](https://github.com/ClickHouse/ClickHouse/pull/66130) ([Serge Klochkov](https://github.com/slvrtrn)).
* 修复 ZooKeeper 客户端缺陷：收到 ZooKeeper 硬件错误后，会话可能卡在不可用状态。例如，ClickHouse Keeper 的“软内存限制”可能触发此情况。 [#66140](https://github.com/ClickHouse/ClickHouse/pull/66140) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 修复 SumIfToCountIfVisitor 与有符号整数的问题。 [#66146](https://github.com/ClickHouse/ClickHouse/pull/66146) ([Raúl Marín](https://github.com/Algunenano)).
* 修复分布式查询结果罕见的数据缺失情况。 [#66174](https://github.com/ClickHouse/ClickHouse/pull/66174) ([vdimir](https://github.com/vdimir)).
* 修复 StorageDeltaLake 元数据字段的解析顺序。 [#66211](https://github.com/ClickHouse/ClickHouse/pull/66211) ([Kseniia Sumarokova](https://github.com/kssenii)).
* `distributed_ddl_output_mode` 的 `none_only_active` 模式不再抛出 `TIMEOUT_EXCEEDED`。 [#66218](https://github.com/ClickHouse/ClickHouse/pull/66218) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 修复无法使用索引时 `system.numbers_mt` 的 LIMIT 处理。 [#66231](https://github.com/ClickHouse/ClickHouse/pull/66231) ([János Benjamin Antal](https://github.com/antaljanosbenjamin)).
* 修复服务器在 Docker 等容器中运行时，对 cgroups v2 指定的最大可用 CPU 核心数的检测。具体而言，容器常在名称为空的根 cgroup 中运行进程，ClickHouse 此前在这种情况下忽略了 cgroups v2 CPU 限制。 [#66237](https://github.com/ClickHouse/ClickHouse/pull/66237) ([filimonov](https://github.com/filimonov)).
* 修复约束中使用带 `IN` 子查询时的 `Not-ready set` 错误。 [#66261](https://github.com/ClickHouse/ClickHouse/pull/66261) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复复制到 S3 或 AzureBlobStorage 时的错误报告。 [#66295](https://github.com/ClickHouse/ClickHouse/pull/66295) ([Vitaly Baranov](https://github.com/vitlibar)).
* 防止 watchdog 保留已解除链接（轮转）的日志文件描述符。 [#66334](https://github.com/ClickHouse/ClickHouse/pull/66334) ([Aleksei Filatov](https://github.com/aalexfvk)).
* 修复 logicalexpressionoptimizerpass 丢失常量逻辑类型的缺陷。 [#66344](https://github.com/ClickHouse/ClickHouse/pull/66344) ([pn](https://github.com/chloro-pn)).
* 修复 `group_by_use_nulls=true` 与新分析器组合时的 `Column identifier is already registered` 错误。 [#66400](https://github.com/ClickHouse/ClickHouse/pull/66400) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复对 PostgreSQL 等外部引擎表连接并过滤的查询，因过度下推过滤条件而可能返回错误结果的问题。从现在起，与外部表进行外连接时，不再将 WHERE 条件发送到外部数据库。 [#66402](https://github.com/ClickHouse/ClickHouse/pull/66402) ([vdimir](https://github.com/vdimir)).
* 为 CROSS JOIN 补充缺失的列物化。 [#66413](https://github.com/ClickHouse/ClickHouse/pull/66413) ([lgbo](https://github.com/lgbo-ustc)).
* 修复 `GROUP BY` 键中包含常量表达式且启用新分析器的查询出现 `Cannot find column` 错误。 [#66433](https://github.com/ClickHouse/ClickHouse/pull/66433) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 避免从 Npy 导入时因数组嵌套层级错误而出现逻辑错误，并修复其他错误类型的测试。 [#66461](https://github.com/ClickHouse/ClickHouse/pull/66461) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 修复谓词包含非确定性函数时 count() 返回错误结果。 [#66510](https://github.com/ClickHouse/ClickHouse/pull/66510) ([Duc Canh Le](https://github.com/canhld94)).
* 正确跟踪 `Allocator::realloc` 的内存。 [#66548](https://github.com/ClickHouse/ClickHouse/pull/66548) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复对空元组进行哈希时读取未初始化内存的问题。 [#66562](https://github.com/ClickHouse/ClickHouse/pull/66562) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复包含 `WINDOW` 的查询返回无效结果的问题：`PARTITION` 列采用稀疏序列化且窗口函数并行执行时可能发生。 [#66579](https://github.com/ClickHouse/ClickHouse/pull/66579) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复删除本地存储中的命名集合。 [#66599](https://github.com/ClickHouse/ClickHouse/pull/66599) ([János Benjamin Antal](https://github.com/antaljanosbenjamin)).
* 修复 `ColumnTuple::insertManyFrom` 中 `column_length` 未更新的问题。 [#66626](https://github.com/ClickHouse/ClickHouse/pull/66626) ([lgbo](https://github.com/lgbo-ustc)).
* 修复含表达式 `(column IS NULL).` 的查询出现 `Unknown identifier` 和 `Column is not under aggregate function` 错误。此缺陷由 [#65088](https://github.com/ClickHouse/ClickHouse/issues/65088) 触发，仅在禁用分析器时发生。 [#66654](https://github.com/ClickHouse/ClickHouse/pull/66654) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复标量子查询用作 IN 第一个参数时出现 `Method getResultType is not supported for QUERY query node` 错误（新分析器）。 [#66655](https://github.com/ClickHouse/ClickHouse/pull/66655) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复读取变体子列时可能出现的 PARAMETER\_OUT\_OF\_BOUND 错误。 [#66659](https://github.com/ClickHouse/ClickHouse/pull/66659) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复删除列后合并罕见卡住的问题。 [#66707](https://github.com/ClickHouse/ClickHouse/pull/66707) ([Raúl Marín](https://github.com/Algunenano)).
* 修复从远程源 INSERT SELECT 时的 `isUniqTypes` 断言。 [#66722](https://github.com/ClickHouse/ClickHouse/pull/66722) ([Sema Checherinda](https://github.com/CheSema)).
* 修复 PrometheusRequestHandler 中的逻辑错误。 [#66621](https://github.com/ClickHouse/ClickHouse/pull/66621) ([Vitaly Baranov](https://github.com/vitlibar)).
* 修复模糊测试器发现的 `indexHint` 函数问题。 [#66286](https://github.com/ClickHouse/ClickHouse/pull/66286) ([Anton Popov](https://github.com/CurtizJ)).
* 修复 'create table b empty as a' 的 AST 格式化。 [#64951](https://github.com/ClickHouse/ClickHouse/pull/64951) ([Michael Kolupaev](https://github.com/al13n321)).
