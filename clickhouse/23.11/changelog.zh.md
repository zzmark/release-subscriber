<h3 id="2311">
  <a id="2311" /> ClickHouse 23.11 版本, 2023-12-06. [演示文稿](https://presentations.clickhouse.com/2023-release-23.11/), [视频](https://www.youtube.com/watch?v=1HJdjOH4Eis)
</h3>

<Frame>
  <iframe src="https://www.youtube.com/embed/1HJdjOH4Eis" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
</Frame>

<h4 id="backward-incompatible-change-1">
  向后不兼容变更
</h4>

* 默认的 ClickHouse 服务器配置文件现已默认为 `default` 用户启用 `access_management`（通过 SQL 查询管理用户）和 `named_collection_control`（通过 SQL 查询管理命名集合）。解决了 [#56482](https://github.com/ClickHouse/ClickHouse/issues/56482)。 [#56619](https://github.com/ClickHouse/ClickHouse/pull/56619) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 对窗口函数的 `RESPECT NULLS`/`IGNORE NULLS` 支持进行了多项改进。如果将其作为聚合函数使用，并存储带有这些修饰符的聚合函数状态，已有状态可能变得不兼容。 [#57189](https://github.com/ClickHouse/ClickHouse/pull/57189) ([Raúl Marín](https://github.com/Algunenano)).
* 移除 `optimize_move_functions_out_of_any` 优化。 [#57190](https://github.com/ClickHouse/ClickHouse/pull/57190) ([Raúl Marín](https://github.com/Algunenano)).
* 函数 `parseDateTime` 中的 `%l`/`%k`/`%c` 格式符现在能够解析不带前导零的小时和月份，例如 `select parseDateTime('2023-11-26 8:14', '%F %k:%i')` 现在可以执行。设置 `parsedatetime_parse_without_leading_zeros = 0` 可恢复此前要求两位数字的行为。函数 `formatDateTime` 现在也能输出不带前导零的小时和月份，由设置 `formatdatetime_format_without_leading_zeros` 控制；为避免破坏现有使用方式，该设置默认关闭。 [#55872](https://github.com/ClickHouse/ClickHouse/pull/55872) ([Azat Khuzhin](https://github.com/azat)).
* 聚合函数 `avgWeighted` 不再支持 `Decimal` 类型的参数。替代方法：将参数转换为 `Float64`。解决了 [#43928](https://github.com/ClickHouse/ClickHouse/issues/43928)。解决了 [#31768](https://github.com/ClickHouse/ClickHouse/issues/31768)。解决了 [#56435](https://github.com/ClickHouse/ClickHouse/issues/56435)。如果曾在物化视图或投影中使用此函数并传入 `Decimal` 参数，请联系 [support@clickhouse.com](mailto:support@clickhouse.com)。修复聚合函数 `sumMap` 中的错误，但使其速度下降了约 1.5 至 2 倍。这无关紧要，因为这个函数本来就很糟糕。解决了 [#54955](https://github.com/ClickHouse/ClickHouse/issues/54955)。解决了 [#53134](https://github.com/ClickHouse/ClickHouse/issues/53134)。解决了 [#55148](https://github.com/ClickHouse/ClickHouse/issues/55148)。修复函数 `groupArraySample` 的一个缺陷：查询生成多个聚合状态时，它们会使用相同的随机种子。 [#56350](https://github.com/ClickHouse/ClickHouse/pull/56350) ([Alexey Milovidov](https://github.com/alexey-milovidov)).

<h4 id="new-feature-1">
  新功能
</h4>

* 新增服务器设置 `async_load_databases`，支持异步加载数据库和表，加快服务器启动。适用于使用 `Ordinary`、`Atomic` 和 `Replicated` 引擎的数据库；其中表的元数据异步加载。查询某张表会提高该加载任务的优先级，并等待其完成。新增用于内部状态查看的 `system.asynchronous_loader` 表。 [#49351](https://github.com/ClickHouse/ClickHouse/pull/49351) ([Sergei Trifonov](https://github.com/serxa)).
* 新增系统表 `blob_storage_log`，可审计写入 S3 和其他对象存储的全部数据。 [#52918](https://github.com/ClickHouse/ClickHouse/pull/52918) ([vdimir](https://github.com/vdimir)).
* 使用统计信息更合理地安排 PREWHERE 条件的顺序。 [#53240](https://github.com/ClickHouse/ClickHouse/pull/53240) ([Han Fei](https://github.com/hanfei1991)).
* Keeper 协议新增压缩支持。可在 ClickHouse 端的 `zookeeper` 配置节中启用 `use_compression` 标志。请注意，仅 ClickHouse Keeper 支持压缩，Apache ZooKeeper 不支持。解决了 [#49507](https://github.com/ClickHouse/ClickHouse/issues/49507)。 [#54957](https://github.com/ClickHouse/ClickHouse/pull/54957) ([SmitaRKulkarni](https://github.com/SmitaRKulkarni)).
* 引入 `storage_metadata_write_full_object_key` 功能。将其设为 `true` 时，元数据文件使用新格式写入。在该格式下，ClickHouse 将完整的远程对象键存入元数据文件，以提高灵活性并支持优化。 [#55566](https://github.com/ClickHouse/ClickHouse/pull/55566) ([Sema Checherinda](https://github.com/CheSema)).
* 新增设置和语法，防止命名集合中的字段被覆盖，旨在阻止恶意用户未经授权获取机密信息。 [#55782](https://github.com/ClickHouse/ClickHouse/pull/55782) ([Salvatore Mesoraca](https://github.com/aiven-sal)).
* 为所有系统日志表添加 `hostname` 列；将系统表配置为复制、共享或分布式表时，此列很有用。 [#55894](https://github.com/ClickHouse/ClickHouse/pull/55894) ([Bharat Nallan](https://github.com/bharatnc)).
* 新增 `CHECK ALL TABLES` 查询。 [#56022](https://github.com/ClickHouse/ClickHouse/pull/56022) ([vdimir](https://github.com/vdimir)).
* 新增类似于 MySQL `FROM_DAYS` 的函数 `fromDaysSinceYearZero`。例如，`SELECT fromDaysSinceYearZero(739136)` 返回 `2023-09-08`。 [#56088](https://github.com/ClickHouse/ClickHouse/pull/56088) ([Joanna Hulboj](https://github.com/jh0x)).
* 新增外部 Python 工具，无需使用 ClickHouse 即可查看备份并从中提取信息。 [#56268](https://github.com/ClickHouse/ClickHouse/pull/56268) ([Vitaly Baranov](https://github.com/vitlibar)).
* 实现新设置 `preferred_optimize_projection_name`。若设为非空字符串，会尽可能使用指定投影，而非从所有候选投影中选择。 [#56309](https://github.com/ClickHouse/ClickHouse/pull/56309) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 新增用于让出或辞去领导权的四字母命令（[https://github.com/ClickHouse/ClickHouse/issues/56352](https://github.com/ClickHouse/ClickHouse/issues/56352)）。  [#56354](https://github.com/ClickHouse/ClickHouse/pull/56354) ([Pradeep Chhetri](https://github.com/chhetripradeep)). [#56620](https://github.com/ClickHouse/ClickHouse/pull/56620) ([Pradeep Chhetri](https://github.com/chhetripradeep))。
* 新增 SQL 函数 `arrayRandomSample(arr, k)`，从输入数组中抽取 k 个元素组成样本。此前只能用较不方便的语法实现类似功能，例如 `SELECT arrayReduce('groupArraySample(3)', range(10))`。 [#56416](https://github.com/ClickHouse/ClickHouse/pull/56416) ([Robert Schulze](https://github.com/rschu1ze)).
* 新增对 `.npy` 文件中 `Float16` 类型数据的支持。解决了 [#56344](https://github.com/ClickHouse/ClickHouse/issues/56344)。 [#56424](https://github.com/ClickHouse/ClickHouse/pull/56424) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 新增系统视图 `information_schema.statistics`，改善与 Tableau Online 的兼容性。 [#56425](https://github.com/ClickHouse/ClickHouse/pull/56425) ([Serge Klochkov](https://github.com/slvrtrn)).
* 新增 `system.symbols` 表，可用于查看二进制程序的内部信息。 [#56548](https://github.com/ClickHouse/ClickHouse/pull/56548) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 支持可配置的仪表板。图表查询现在通过查询来加载，默认从新的 `system.dashboards` 表获取。 [#56771](https://github.com/ClickHouse/ClickHouse/pull/56771) ([Sergei Trifonov](https://github.com/serxa)).
* 引入 `fileCluster` 表函数；将共享文件系统（NFS 等）挂载至 `user_files` 目录时很有用。 [#56868](https://github.com/ClickHouse/ClickHouse/pull/56868) ([Andrey Zvonov](https://github.com/zvonand)).
* 为 `s3/file/hdfs/url/azureBlobStorage` 引擎添加 `_size` 虚拟列，表示文件大小，单位为字节。 [#57126](https://github.com/ClickHouse/ClickHouse/pull/57126) ([Kruglov Pavel](https://github.com/Avogar)).
* 通过 Prometheus 端点公开服务器自上次重启以来各错误码的出现次数。 [#57209](https://github.com/ClickHouse/ClickHouse/pull/57209) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* ClickHouse Keeper 在 `/keeper/availability-zone` 路径报告其所在的可用区。可通过 `<availability_zone><value>us-west-1a</value></availability_zone>` 配置。 [#56715](https://github.com/ClickHouse/ClickHouse/pull/56715) ([Jianfei Hu](https://github.com/incfly)).
* ALTER materialized\_view MODIFY QUERY 不再是实验性功能，并弃用 `allow_experimental_alter_materialized_view_structure` 设置。修复了 [#15206](https://github.com/ClickHouse/ClickHouse/issues/15206)。 [#57311](https://github.com/ClickHouse/ClickHouse/pull/57311) ([alesapin](https://github.com/alesapin)).
* 设置 `join_algorithm` 遵循指定的算法顺序。 [#51745](https://github.com/ClickHouse/ClickHouse/pull/51745) ([vdimir](https://github.com/vdimir)).
* Protobuf 格式新增对 [Protobuf 熟知类型](https://protobuf.dev/reference/protobuf/google.protobuf/)的支持。 [#56741](https://github.com/ClickHouse/ClickHouse/pull/56741) ([János Benjamin Antal](https://github.com/antaljanosbenjamin)).

<h4 id="performance-improvement-1">
  性能改进
</h4>

* 与 S3 交互时使用自适应超时。首次尝试使用较短的发送和接收超时。 [#56314](https://github.com/ClickHouse/ClickHouse/pull/56314) ([Sema Checherinda](https://github.com/CheSema)).
* 将 `max_concurrent_queries` 的默认值从 100 增至 1000。当大量客户端连接并缓慢发送或接收数据、服务器不受 CPU 限制，或者 CPU 核数超过 100 时，这一变化是合理的。同时默认启用并发控制，将所有查询处理线程的目标总数设为 CPU 核数的两倍。这改善了极大量并发查询场景下的性能。 [#46927](https://github.com/ClickHouse/ClickHouse/pull/46927) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 支持并行计算窗口函数。修复了 [#34688](https://github.com/ClickHouse/ClickHouse/issues/34688)。 [#39631](https://github.com/ClickHouse/ClickHouse/pull/39631) ([Dmitry Novik](https://github.com/novikd)).
* `Numbers` 表引擎（用于 `system.numbers` 表）现在会像表索引一样分析条件，仅生成所需的数据子集。 [#50909](https://github.com/ClickHouse/ClickHouse/pull/50909) ([JackyWoo](https://github.com/JackyWoo)).
* 提高 `Merge` 表引擎按 `IN (...)` 条件筛选的性能。 [#54905](https://github.com/ClickHouse/ClickHouse/pull/54905) ([Nikita Taranov](https://github.com/nickitat)).
* 改进文件系统缓存已满且存在大规模读取时的行为。 [#55158](https://github.com/ClickHouse/ClickHouse/pull/55158) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 允许禁用 S3 校验和，以免对文件进行额外的完整遍历（由设置 `s3_disable_checksum` 控制）。 [#55559](https://github.com/ClickHouse/ClickHouse/pull/55559) ([Azat Khuzhin](https://github.com/azat)).
* 当数据位于页缓存中时，现在从远程表同步读取（与本地表相同）。这样更快，无需在线程池内部同步，可以直接在本地文件系统上执行 `seek`，并减少 CPU 等待。 [#55841](https://github.com/ClickHouse/ClickHouse/pull/55841) ([Nikita Taranov](https://github.com/nickitat)).
* 优化通过 `arrayElement` 从 `map` 获取值，约可提速 30%。— 减少预留内存。— 减少 `resize` 调用。 [#55957](https://github.com/ClickHouse/ClickHouse/pull/55957) ([lgbo](https://github.com/lgbo-ustc)).
* 使用 AVX-512 优化多阶段筛选。在 ICX 设备（Intel Xeon Platinum 8380 CPU，80 核、160 线程）上针对 OnTime 数据集的性能实验显示，此变更使查询 Q2、Q3、Q4、Q5 和 Q6 的 QPS 分别提高 7.4%、5.9%、4.7%、3.0% 和 4.6%，对其他查询无影响。 [#56079](https://github.com/ClickHouse/ClickHouse/pull/56079) ([Zhiguo Zhou](https://github.com/ZhiguoZh)).
* 限制同时执行查询剖析的线程数；超出的线程会跳过剖析。 [#56105](https://github.com/ClickHouse/ClickHouse/pull/56105) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 减少窗口函数中的虚函数调用次数。 [#56120](https://github.com/ClickHouse/ClickHouse/pull/56120) ([Maksim Kita](https://github.com/kitaisreal)).
* 允许在 ORC 数据格式中递归裁剪 Tuple 字段，以加快扫描。 [#56122](https://github.com/ClickHouse/ClickHouse/pull/56122) ([李扬](https://github.com/taiyang-li)).
* 为 `Npy` 数据格式实现简单计数优化：借助结果缓存，`select count() from 'data.npy'` 等查询会快得多。 [#56304](https://github.com/ClickHouse/ClickHouse/pull/56304) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 包含聚合和大量处理流的查询，在构建执行计划时使用更少内存。 [#57074](https://github.com/ClickHouse/ClickHouse/pull/57074) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 通过优化对 ProcessList 的访问，提高多用户、高并发查询（超过 2000 QPS）场景下的查询执行性能。 [#57106](https://github.com/ClickHouse/ClickHouse/pull/57106) ([Andrej Hoos](https://github.com/adikus)).
* 对 ARRAY JOIN 做小幅改进，复用部分中间结果。 [#57183](https://github.com/ClickHouse/ClickHouse/pull/57183) ([李扬](https://github.com/taiyang-li)).
* 过去堆栈展开在某些情况下很慢，现在已解决。 [#57221](https://github.com/ClickHouse/ClickHouse/pull/57221) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 现在，当 `max_streams = 1` 时，使用默认读取池从外部存储读取。启用读取预取时这样更有利。 [#57334](https://github.com/ClickHouse/ClickHouse/pull/57334) ([Nikita Taranov](https://github.com/nickitat)).
* Keeper 改进：延迟日志预处理，以改善启动过程中的内存使用。 [#55660](https://github.com/ClickHouse/ClickHouse/pull/55660) ([Antonio Andelic](https://github.com/antonio2368)).
* 提高 `File` 和 `HDFS` 存储的通配符匹配性能。 [#56141](https://github.com/ClickHouse/ClickHouse/pull/56141) ([Andrey Zvonov](https://github.com/zvonand)).
* 实验性全文索引的倒排列表现在经过压缩，大小减少 10% 至 30%。 [#56226](https://github.com/ClickHouse/ClickHouse/pull/56226) ([Harry Lee](https://github.com/HarryLeeIBM)).
* 在备份中并行执行 `BackupEntriesCollector`。 [#56312](https://github.com/ClickHouse/ClickHouse/pull/56312) ([Kseniia Sumarokova](https://github.com/kssenii)).

<h4 id="improvement-1">
  改进
</h4>

* 新增 `MergeTree` 设置 `add_implicit_sign_column_constraint_for_collapsing_engine`（默认禁用）。启用后，会为 `CollapsingMergeTree` 表添加隐式 CHECK 约束，将 `Sign` 列的值限制为 -1 或 1。 [#56701](https://github.com/ClickHouse/ClickHouse/issues/56701)。 [#56986](https://github.com/ClickHouse/ClickHouse/pull/56986) ([Kevin Mingtarja](https://github.com/kevinmingtarja)).
* 允许无需重启即可向存储配置添加新磁盘。 [#56367](https://github.com/ClickHouse/ClickHouse/pull/56367) ([Duc Canh Le](https://github.com/canhld94)).
* 支持在同一条 ALTER 查询中创建并物化索引，也支持在同一查询中执行“modify TTL”和“materialize TTL”。解决了 [#55651](https://github.com/ClickHouse/ClickHouse/issues/55651)。 [#56331](https://github.com/ClickHouse/ClickHouse/pull/56331) ([flynn](https://github.com/ucasfl)).
* 新增表函数 `fuzzJSON`，输出的各行是对源 JSON 字符串施加随机变化后的扰动版本。 [#56490](https://github.com/ClickHouse/ClickHouse/pull/56490) ([Julia Kartseva](https://github.com/jkartseva)).
* `Merge` 引擎按照底层表的行策略筛选记录，因此无需在 `Merge` 表上另建行策略。 [#50209](https://github.com/ClickHouse/ClickHouse/pull/50209) ([Ilya Golshtein](https://github.com/ilejn)).
* 新增设置 `max_execution_time_leaf`，限制分布式查询在分片上的执行时间；新增 `timeout_overflow_mode_leaf`，控制超时后的行为。 [#51823](https://github.com/ClickHouse/ClickHouse/pull/51823) ([Duc Canh Le](https://github.com/canhld94)).
* 新增 ClickHouse 设置，允许对经 HTTP 代理的 HTTPS 请求禁用隧道。 [#55033](https://github.com/ClickHouse/ClickHouse/pull/55033) ([Arthur Passos](https://github.com/arthurpassos)).
* 将 `background_fetches_pool_size` 设为 16，将 background\_schedule\_pool\_size 设为 512，以更好地适应频繁小批量插入的生产环境。 [#54327](https://github.com/ClickHouse/ClickHouse/pull/54327) ([Denny Crane](https://github.com/den-crane)).
* 读取 CSV 格式文件时，如果行尾为 `\r` 且后面没有 `\n`，会出现以下异常：`Cannot parse CSV format: found \r (CR) not followed by \n (LF). Line must end by \n (LF) or \r\n (CR LF) or \n\r.` 在 ClickHouse 中，CSV 行尾必须是 `\n`、`\r\n` 或 `\n\r`，因此 `\r` 后必须跟随 `\n`；但某些情况下 CSV 输入数据不规范，例如上述以 `\r` 结尾的情况。 [#54340](https://github.com/ClickHouse/ClickHouse/pull/54340) ([KevinyhZou](https://github.com/KevinyhZou)).
* 将 Arrow 库更新到 release-13.0.0，以支持新的编码。解决了 [#44505](https://github.com/ClickHouse/ClickHouse/issues/44505)。 [#54800](https://github.com/ClickHouse/ClickHouse/pull/54800) ([Kruglov Pavel](https://github.com/Avogar)).
* 在 DDL 条目的主机列表中查找本地 IP 地址时，移除用于获取所有网络接口的高开销系统调用，提高 ON CLUSTER 查询的性能。 [#54909](https://github.com/ClickHouse/ClickHouse/pull/54909) ([Duc Canh Le](https://github.com/canhld94)).
* 修复线程关联到查询或用户之前所分配内存的统计。 [#56089](https://github.com/ClickHouse/ClickHouse/pull/56089) ([Nikita Taranov](https://github.com/nickitat)).
* Apache Arrow 格式新增对 `LARGE_LIST` 的支持。 [#56118](https://github.com/ClickHouse/ClickHouse/pull/56118) ([edef](https://github.com/edef1c)).
* 允许通过 `OPTIMIZE` 查询手动压实 `EmbeddedRocksDB`。 [#56225](https://github.com/ClickHouse/ClickHouse/pull/56225) ([Azat Khuzhin](https://github.com/azat)).
* 允许为 `EmbeddedRocksDB` 表指定 BlockBasedTableOptions。 [#56264](https://github.com/ClickHouse/ClickHouse/pull/56264) ([Azat Khuzhin](https://github.com/azat)).
* 通过 MySQL 协议连接时，`SHOW COLUMNS` 现在显示等价的 MySQL 数据类型名称。此前需要设置 `use_mysql_types_in_show_columns = 1` 才会如此。该设置保留，但已弃用。 [#56277](https://github.com/ClickHouse/ClickHouse/pull/56277) ([Robert Schulze](https://github.com/rschu1ze)).
* 修复在 `TRUNCATE` 或 `DROP PARTITION` 后立即重启服务器时可能出现的 `The local set of parts of table doesn't look like the set of parts in ZooKeeper` 错误。 [#56282](https://github.com/ClickHouse/ClickHouse/pull/56282) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 修复函数 `formatQuery`/ `formatQuerySingleLine` 对非常量查询字符串的处理。同时为两个函数新增 `OrNull` 变体，在无法解析查询时返回 NULL，而不是抛出异常。 [#56327](https://github.com/ClickHouse/ClickHouse/pull/56327) ([Robert Schulze](https://github.com/rschu1ze)).
* 允许备份内部表已被删除的物化视图，而不是使备份失败。 [#56387](https://github.com/ClickHouse/ClickHouse/pull/56387) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 查询 `system.replicas` 的某些列会向 ZooKeeper 发出请求。有数千张表时，这些请求可能给 ZooKeeper 带来较大负载。如果同时执行多个 `system.replicas` 查询，会重复发送相同请求。此次变更对并发查询发出的请求进行“去重”。 [#56420](https://github.com/ClickHouse/ClickHouse/pull/56420) ([Alexander Gololobov](https://github.com/davenger)).
* 修复查询外部数据库时向 MySQL 兼容查询的转换。 [#56456](https://github.com/ClickHouse/ClickHouse/pull/56456) ([flynn](https://github.com/ucasfl)).
* 支持备份和恢复使用 `KeeperMap` 引擎的表。 [#56460](https://github.com/ClickHouse/ClickHouse/pull/56460) ([Antonio Andelic](https://github.com/antonio2368)).
* 需要重新检查 CompleteMultipartUpload 的 404 响应。即使客户端超时或遇到其他网络错误，服务器也可能已经完成操作。下一次重试 CompleteMultipartUpload 会收到 404 响应。如果对象键存在，则将操作视为成功。 [#56475](https://github.com/ClickHouse/ClickHouse/pull/56475) ([Sema Checherinda](https://github.com/CheSema)).
* 默认启用 HTTP OPTIONS 方法，简化从 Web 浏览器请求 ClickHouse 的流程。 [#56483](https://github.com/ClickHouse/ClickHouse/pull/56483) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* `dns_max_consecutive_failures` 的值曾在 [#46550](https://github.com/ClickHouse/ClickHouse/issues/46550) 中被误改；现已回退并调整到更合适的值。同时将 HTTP keep-alive 超时增加到根据生产环境经验确定的合理值。 [#56485](https://github.com/ClickHouse/ClickHouse/pull/56485) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 延迟加载基础备份（直到需要时才加载）。同时为备份添加一些日志消息和性能分析事件。 [#56516](https://github.com/ClickHouse/ClickHouse/pull/56516) ([Vitaly Baranov](https://github.com/vitlibar)).
* 设置 `query_cache_store_results_of_queries_with_nondeterministic_functions`（取值 `false` 或 `true`）已标记为弃用，替代设置是 `query_cache_nondeterministic_function_handling`。这是一个三值枚举，用于控制查询缓存如何处理带非确定性函数的查询：a）抛出异常（默认行为）；b）仍然保存非确定性的查询结果；c）忽略，即既不抛出异常，也不缓存结果。 [#56519](https://github.com/ClickHouse/ClickHouse/pull/56519) ([Robert Schulze](https://github.com/rschu1ze)).
* 改写 JOIN ON 子句中带 `is null` 检查的等值条件。*仅适用于实验性 Analyzer*。 [#56538](https://github.com/ClickHouse/ClickHouse/pull/56538) ([vdimir](https://github.com/vdimir)).
* 函数 `concat` 现在支持任意参数类型（此前仅支持 String 和 FixedString 参数），使其行为更接近 MySQL 的 `concat` 实现。例如，`SELECT concat('ab', 42)` 现在返回 `ab42`。 [#56540](https://github.com/ClickHouse/ClickHouse/pull/56540) ([Serge Klochkov](https://github.com/slvrtrn)).
* 允许从配置的 'named\_collection' 节或通过 SQL 创建的命名集合中获取缓存配置。 [#56541](https://github.com/ClickHouse/ClickHouse/pull/56541) ([Kseniia Sumarokova](https://github.com/kssenii)).
* PostgreSQL 数据库引擎：连接 PostgreSQL 失败时，减少对过期表的激进删除。 [#56609](https://github.com/ClickHouse/ClickHouse/pull/56609) ([jsc0218](https://github.com/jsc0218)).
* URL 不正确时，连接 PostgreSQL 过去耗时过长，导致相关查询卡住并被取消。 [#56648](https://github.com/ClickHouse/ClickHouse/pull/56648) ([jsc0218](https://github.com/jsc0218)).
* Keeper 改进：默认禁用 Keeper 中的压缩日志。 [#56763](https://github.com/ClickHouse/ClickHouse/pull/56763) ([Antonio Andelic](https://github.com/antonio2368)).
* 新增配置设置 `wait_dictionaries_load_at_startup`。 [#56782](https://github.com/ClickHouse/ClickHouse/pull/56782) ([Vitaly Baranov](https://github.com/vitlibar)).
* 此前的 ClickHouse 版本存在一个潜在漏洞：用户连接后使用“interserver secret”方法认证失败时，服务器没有立即终止连接，而是继续接收并忽略客户端的剩余数据包。虽然这些包被忽略，但仍会经过解析；如果它们使用的压缩方法存在其他已知漏洞，就可能在未经认证的情况下利用该漏洞。此问题通过 [ClickHouse 漏洞赏金计划](https://github.com/ClickHouse/ClickHouse/issues/38986)由 [https://twitter.com/malacupa](https://twitter.com/malacupa) 发现。 [#56794](https://github.com/ClickHouse/ClickHouse/pull/56794) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 获取数据片段时，等待该数据片段在远程副本上完全提交。最好不要发送处于 PreActive 状态的数据片段；在零拷贝情况下，这是强制限制。 [#56808](https://github.com/ClickHouse/ClickHouse/pull/56808) ([Sema Checherinda](https://github.com/CheSema)).
* 修复使用实验性 `MaterializedPostgreSQL` 时可能出现的 PostgreSQL 逻辑复制转换错误。 [#53721](https://github.com/ClickHouse/ClickHouse/pull/53721) ([takakawa](https://github.com/takakawa)).
* 实现用户级设置 `alter_move_to_space_execute_async`，允许异步执行 `ALTER TABLE ... MOVE PARTITION|PART TO DISK|VOLUME` 查询。后台执行池的大小由 `background_move_pool_size` 控制。默认行为仍为同步执行。修复了 [#47643](https://github.com/ClickHouse/ClickHouse/issues/47643)。 [#56809](https://github.com/ClickHouse/ClickHouse/pull/56809) ([alesapin](https://github.com/alesapin)).
* 扫描 system.tables 时可以按引擎筛选，避免不必要且可能耗时的连接。 [#56813](https://github.com/ClickHouse/ClickHouse/pull/56813) ([jsc0218](https://github.com/jsc0218)).
* 在系统表中显示 RocksDB 存储的 `total_bytes` 和 `total_rows`。 [#56816](https://github.com/ClickHouse/ClickHouse/pull/56816) ([Aleksandr Musorin](https://github.com/AVMusorin)).
* 允许对 TEMPORARY 表执行基本的 ALTER 命令。 [#56892](https://github.com/ClickHouse/ClickHouse/pull/56892) ([Sergey](https://github.com/icuken)).
* LZ4 压缩：在输出缓冲区容量不足以直接写入压缩数据块的少见情况下，先缓冲该压缩数据块。 [#56938](https://github.com/ClickHouse/ClickHouse/pull/56938) ([Sema Checherinda](https://github.com/CheSema)).
* 添加排队任务数量的指标，对 IO 线程池很有用。 [#56958](https://github.com/ClickHouse/ClickHouse/pull/56958) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 在配置文件中添加 PostgreSQL 表引擎设置，并增加该设置的检查和相关文档。 [#56959](https://github.com/ClickHouse/ClickHouse/pull/56959) ([Peignon Melvyn](https://github.com/melvynator)).
* 函数 `concat` 现在可以用单个参数调用，例如 `SELECT concat('abc')`，使其行为与 MySQL 的 concat 实现更一致。 [#57000](https://github.com/ClickHouse/ClickHouse/pull/57000) ([Serge Klochkov](https://github.com/slvrtrn)).
* 按照 AWS S3 文档的要求，对所有 `x-amz-*` 请求头签名。 [#57001](https://github.com/ClickHouse/ClickHouse/pull/57001) ([Arthur Passos](https://github.com/arthurpassos)).
* 函数 `fromDaysSinceYearZero`（别名：`FROM_DAYS`）现在可接受无符号和有符号整数类型（此前必须使用无符号整数）。这改善了与 Tableau Online 等第三方工具的兼容性。 [#57002](https://github.com/ClickHouse/ClickHouse/pull/57002) ([Serge Klochkov](https://github.com/slvrtrn)).
* 在默认配置中添加 `system.s3queue_log`。 [#57036](https://github.com/ClickHouse/ClickHouse/pull/57036) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 将 `wait_dictionaries_load_at_startup` 的默认值改为 true，并仅在 `dictionaries_lazy_load` 为 false 时使用该设置。 [#57133](https://github.com/ClickHouse/ClickHouse/pull/57133) ([Vitaly Baranov](https://github.com/vitlibar)).
* 即使启用了 `dictionaries_lazy_load`，也在创建字典时检查字典源类型。 [#57134](https://github.com/ClickHouse/ClickHouse/pull/57134) ([Vitaly Baranov](https://github.com/vitlibar)).
* 现在可以单独启用或禁用执行计划级优化。此前只能全部禁用。原来用于该用途的设置（`query_plan_enable_optimizations`）保留，仍可用于禁用所有优化。 [#57152](https://github.com/ClickHouse/ClickHouse/pull/57152) ([Robert Schulze](https://github.com/rschu1ze)).
* 服务器的退出码将对应异常码。例如，服务器因内存限制而无法启动时，将以代码 241 = MEMORY\_LIMIT\_EXCEEDED 退出。此前的版本遇到异常时，退出码始终为 70 = Poco::Util::ExitCode::EXIT\_SOFTWARE。 [#57153](https://github.com/ClickHouse/ClickHouse/pull/57153) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 不再对来自 `functional` C++ 头文件的堆栈帧进行名称还原和符号解析。 [#57201](https://github.com/ClickHouse/ClickHouse/pull/57201) ([Mike Kot](https://github.com/myrrc)).
* HTTP 服务器的 `/dashboard` 页面现在支持多折线图表。 [#57236](https://github.com/ClickHouse/ClickHouse/pull/57236) ([Sergei Trifonov](https://github.com/serxa)).
* `max_memory_usage_in_client` 命令行选项支持带后缀（K、M、G 等）的字符串值。解决了 [#56879](https://github.com/ClickHouse/ClickHouse/issues/56879)。 [#57273](https://github.com/ClickHouse/ClickHouse/pull/57273) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 将 Intel QPL（用于编解码器 `DEFLATE_QPL`）从 v1.2.0 升级到 v1.3.1。同时修复 BOF（Block On Fault）= 0 时的缺陷，改为在遇到缺页时回退到软件执行路径。 [#57291](https://github.com/ClickHouse/ClickHouse/pull/57291) ([jasperzhu](https://github.com/jinjunzh)).
* 将 MergeTree 设置 `replicated_deduplication_window` 的默认值从 100 增至 1k。 [#57335](https://github.com/ClickHouse/ClickHouse/pull/57335) ([sichenzhao](https://github.com/sichenzhao)).
* 减少使用 `INCONSISTENT_METADATA_FOR_BACKUP`。尽可能继续扫描，而不是停止并从头重新扫描备份内容。 [#57385](https://github.com/ClickHouse/ClickHouse/pull/57385) ([Vitaly Baranov](https://github.com/vitlibar)).

<h4 id="buildtestingpackaging-improvement-1">
  构建、测试与打包改进
</h4>

* 新增 SQLLogic 测试。 [#56078](https://github.com/ClickHouse/ClickHouse/pull/56078) ([Han Fei](https://github.com/hanfei1991)).
* 为方便使用，提供 `clickhouse-local` 和 `clickhouse-client` 的短名称（`ch`、`chl`、`chc`）。 [#56634](https://github.com/ClickHouse/ClickHouse/pull/56634) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 通过移除外部库中的未使用代码，进一步优化构建产物大小。 [#56786](https://github.com/ClickHouse/ClickHouse/pull/56786) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 新增自动检查，确保不存在过大的编译单元。 [#56559](https://github.com/ClickHouse/ClickHouse/pull/56559) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 缩小单二进制文件发行包的体积。解决了 [#55181](https://github.com/ClickHouse/ClickHouse/issues/55181)。 [#56617](https://github.com/ClickHouse/ClickHouse/pull/56617) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 每次构建后，将各编译单元和二进制文件的大小信息发送至 ClickHouse Cloud 中的 CI 数据库。解决了 [#56107](https://github.com/ClickHouse/ClickHouse/issues/56107)。 [#56636](https://github.com/ClickHouse/ClickHouse/pull/56636) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* “Apache Arrow”库的某些文件（我们仅将其用于解析 Arrow 格式等非核心功能）此前无论是否存在构建缓存都会重新构建；现已修复。 [#56657](https://github.com/ClickHouse/ClickHouse/pull/56657) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 避免重新编译依赖于自动生成版本信息源文件的编译单元。 [#56660](https://github.com/ClickHouse/ClickHouse/pull/56660) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 将链接器调用的跟踪数据发送至 ClickHouse Cloud 中的 CI 数据库。 [#56725](https://github.com/ClickHouse/ClickHouse/pull/56725) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* ClickHouse 二进制文件使用 DWARF 5 调试符号（此前为 DWARF 4）。 [#56770](https://github.com/ClickHouse/ClickHouse/pull/56770) ([Michael Kolupaev](https://github.com/al13n321)).
* 新增构建选项 `SANITIZE_COVERAGE`。启用后，会对代码进行插桩以跟踪覆盖率。收集的信息可在 ClickHouse 内通过以下方式访问：（1）新函数 `coverage`，返回自上次覆盖率重置以来发现的代码地址去重数组；（2）`SYSTEM RESET COVERAGE` 查询，重置累计的数据。这让我们能够比较不同测试的覆盖率，包括差分代码覆盖率。延续了 [#20539](https://github.com/ClickHouse/ClickHouse/issues/20539) 的工作。 [#56102](https://github.com/ClickHouse/ClickHouse/pull/56102) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 收集堆栈时，某些堆栈帧可能无法解析。在这种情况下，原始地址可能有帮助。 [#56267](https://github.com/ClickHouse/ClickHouse/pull/56267) ([Alexander Gololobov](https://github.com/davenger)).
* 新增禁用 `libssh` 的选项。 [#56333](https://github.com/ClickHouse/ClickHouse/pull/56333) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 在 CI 的 S3 测试中启用 temporary\_data\_in\_cache。 [#48425](https://github.com/ClickHouse/ClickHouse/pull/48425) ([vdimir](https://github.com/vdimir)).
* 在 CI 中将 clickhouse-client 的最大内存使用量设为 `1G`。 [#56873](https://github.com/ClickHouse/ClickHouse/pull/56873) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).

<h4 id="bug-fix-user-visible-misbehavior-in-an-official-stable-release-1">
  缺陷修复（正式稳定版本中用户可见的异常行为）
</h4>

* 修复实验性 Analyzer：当 INSERT SELECT 的子查询引用插入目标表时，应仅处理插入的数据块。 [#50857](https://github.com/ClickHouse/ClickHouse/pull/50857) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* 修复 `str_to_map` 函数的缺陷。 [#56423](https://github.com/ClickHouse/ClickHouse/pull/56423) ([Arthur Passos](https://github.com/arthurpassos)).
* Keeper `reconfig`：在让出或接管领导权之前添加超时。 [#53481](https://github.com/ClickHouse/ClickHouse/pull/53481) ([Mike Kot](https://github.com/myrrc)).
* 修复 Grace Hash Join 和筛选条件下推中的错误数据块头。 [#53922](https://github.com/ClickHouse/ClickHouse/pull/53922) ([vdimir](https://github.com/vdimir)).
* 修复表基于表函数时从系统表执行 SELECT 的问题。 [#55540](https://github.com/ClickHouse/ClickHouse/pull/55540) ([MikhailBurdukov](https://github.com/MikhailBurdukov)).
* RFC：修复带 LIMIT BY 的分布式查询中出现的“Cannot find column X in source stream”（在源数据流中找不到列 X）错误。 [#55836](https://github.com/ClickHouse/ClickHouse/pull/55836) ([Azat Khuzhin](https://github.com/azat)).
* 修复在后台运行客户端时出现的“Cannot read from file:”（无法读取文件）错误。 [#55976](https://github.com/ClickHouse/ClickHouse/pull/55976) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复 send\_logs\_level 设置错误时 clickhouse-local 的退出行为。 [#55994](https://github.com/ClickHouse/ClickHouse/pull/55994) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复对参数化视图执行 EXPLAIN AST 的缺陷。 [#56004](https://github.com/ClickHouse/ClickHouse/pull/56004) ([SmitaRKulkarni](https://github.com/SmitaRKulkarni)).
* 修复启动时加载表发生的崩溃。 [#56232](https://github.com/ClickHouse/ClickHouse/pull/56232) ([Nikolay Degterinsky](https://github.com/evillique)).
* 修复使用显式查询的 ClickHouse 数据源字典。 [#56236](https://github.com/ClickHouse/ClickHouse/pull/56236) ([Nikolay Degterinsky](https://github.com/evillique)).
* 修复 Keeper 信号处理器中的段错误。 [#56266](https://github.com/ClickHouse/ClickHouse/pull/56266) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复 view() 函数中 UNION 的查询结果不完整的问题。 [#56274](https://github.com/ClickHouse/ClickHouse/pull/56274) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复 "cast('0' as DateTime64(3))" 与 "cast('0' as Nullable(DateTime64(3)))" 的行为不一致。 [#56286](https://github.com/ClickHouse/ClickHouse/pull/56286) ([李扬](https://github.com/taiyang-li)).
* 修复与内存分配失败有关的罕见竞争条件。 [#56303](https://github.com/ClickHouse/ClickHouse/pull/56303) ([alesapin](https://github.com/alesapin)).
* 修复启用 `flatten_nested` 和 `data_type_default_nullable` 时从备份恢复的问题。 [#56306](https://github.com/ClickHouse/ClickHouse/pull/56306) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复添加 Object(JSON) 类型列时的崩溃。 [#56307](https://github.com/ClickHouse/ClickHouse/pull/56307) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* 修复 filterPushDown 中的崩溃。 [#56380](https://github.com/ClickHouse/ClickHouse/pull/56380) ([vdimir](https://github.com/vdimir)).
* 修复从备份恢复物化视图及源表已被删除的情况。 [#56383](https://github.com/ClickHouse/ClickHouse/pull/56383) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复 Kerberos 初始化期间的段错误。 [#56401](https://github.com/ClickHouse/ClickHouse/pull/56401) ([Nikolay Degterinsky](https://github.com/evillique)).
* 修复 T64 中的缓冲区溢出。 [#56434](https://github.com/ClickHouse/ClickHouse/pull/56434) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复 FINAL 中的可空主键问题（第 2 次）。 [#56452](https://github.com/ClickHouse/ClickHouse/pull/56452) ([Amos Bird](https://github.com/amosbird)).
* 修复初始节点上不存在数据库时的 ON CLUSTER 查询。 [#56484](https://github.com/ClickHouse/ClickHouse/pull/56484) ([Nikolay Degterinsky](https://github.com/evillique)).
* 修复 TTL 依赖导致的启动失败。 [#56489](https://github.com/ClickHouse/ClickHouse/pull/56489) ([Nikolay Degterinsky](https://github.com/evillique)).
* 修复 ON CLUSTER 上的 ALTER COMMENT 查询。 [#56491](https://github.com/ClickHouse/ClickHouse/pull/56491) ([Nikolay Degterinsky](https://github.com/evillique)).
* 修复带 ALIAS 的 ALTER COLUMN。 [#56493](https://github.com/ClickHouse/ClickHouse/pull/56493) ([Nikolay Degterinsky](https://github.com/evillique)).
* 修复空的命名集合。 [#56494](https://github.com/ClickHouse/ClickHouse/pull/56494) ([Nikolay Degterinsky](https://github.com/evillique)).
* 修复两种投影分析场景。 [#56502](https://github.com/ClickHouse/ClickHouse/pull/56502) ([Amos Bird](https://github.com/amosbird)).
* 修复查询缓存对别名的处理。 [#56545](https://github.com/ClickHouse/ClickHouse/pull/56545) ([Robert Schulze](https://github.com/rschu1ze)).
* 修复从 `Nullable(Enum)` 到 `Nullable(String)` 的转换。 [#56644](https://github.com/ClickHouse/ClickHouse/pull/56644) ([Nikolay Degterinsky](https://github.com/evillique)).
* 使 Keeper 的日志处理更可靠。 [#56670](https://github.com/ClickHouse/ClickHouse/pull/56670) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复带替换属性的节点的配置合并。 [#56694](https://github.com/ClickHouse/ClickHouse/pull/56694) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 修复表函数 input() 的重复使用。 [#56695](https://github.com/ClickHouse/ClickHouse/pull/56695) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复：RabbitMQ 的 OpenSSL 动态加载问题。 [#56703](https://github.com/ClickHouse/ClickHouse/pull/56703) ([Igor Nikonov](https://github.com/devcrafter)).
* 修复 GCD 编解码器在数据含有零值时的崩溃。 [#56704](https://github.com/ClickHouse/ClickHouse/pull/56704) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* 修复 clickhouse-local 向表函数插入时出现的“mutex lock failed: Invalid argument”（互斥锁加锁失败：参数无效）错误。 [#56710](https://github.com/ClickHouse/ClickHouse/pull/56710) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复 Date 文本解析的乐观路径。 [#56765](https://github.com/ClickHouse/ClickHouse/pull/56765) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复 FPC 编解码器中的崩溃。 [#56795](https://github.com/ClickHouse/ClickHouse/pull/56795) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* DatabaseReplicated：修复恢复副本之后 DDL 查询超时的问题。 [#56796](https://github.com/ClickHouse/ClickHouse/pull/56796) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 修复 MySQL 二进制协议中可空列的错误报告。 [#56799](https://github.com/ClickHouse/ClickHouse/pull/56799) ([Serge Klochkov](https://github.com/slvrtrn)).
* 支持元存储表的 Iceberg 元数据文件。 [#56810](https://github.com/ClickHouse/ClickHouse/pull/56810) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复转换过程中 TSAN 报告的问题。 [#56817](https://github.com/ClickHouse/ClickHouse/pull/56817) ([Raúl Marín](https://github.com/Algunenano)).
* 修复 SET 查询和 SETTINGS 的格式化。 [#56825](https://github.com/ClickHouse/ClickHouse/pull/56825) ([Nikolay Degterinsky](https://github.com/evillique)).
* 修复 joinGet 中表依赖导致的启动失败。 [#56828](https://github.com/ClickHouse/ClickHouse/pull/56828) ([Nikolay Degterinsky](https://github.com/evillique)).
* 修复 ADD COLUMN 期间对已有 Nested 列的展平。 [#56830](https://github.com/ClickHouse/ClickHouse/pull/56830) ([Nikolay Degterinsky](https://github.com/evillique)).
* 修复允许 CSV 行尾使用 CR 的行为。 [#56901](https://github.com/ClickHouse/ClickHouse/pull/56901) ([KevinyhZou](https://github.com/KevinyhZou)).
* 修复 `tryBase64Decode` 对无效输入的处理。 [#56913](https://github.com/ClickHouse/ClickHouse/pull/56913) ([Robert Schulze](https://github.com/rschu1ze)).
* 修复 CapnProto/Protobuf 结构中深层嵌套列的生成。 [#56941](https://github.com/ClickHouse/ClickHouse/pull/56941) ([Kruglov Pavel](https://github.com/Avogar)).
* 阻止对投影列执行不兼容的 ALTER。 [#56948](https://github.com/ClickHouse/ClickHouse/pull/56948) ([Amos Bird](https://github.com/amosbird)).
* 修复 SQLite 文件路径校验。 [#56984](https://github.com/ClickHouse/ClickHouse/pull/56984) ([San](https://github.com/santrancisco)).
* S3Queue：修复元数据引用计数的增加。 [#56990](https://github.com/ClickHouse/ClickHouse/pull/56990) ([Kseniia Sumarokova](https://github.com/kssenii)).
* S3Queue 小幅修复。 [#56999](https://github.com/ClickHouse/ClickHouse/pull/56999) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复 DatabaseFileSystem 的文件路径校验。 [#57029](https://github.com/ClickHouse/ClickHouse/pull/57029) ([San](https://github.com/santrancisco)).
* 修复 `fuzzBits` 与 `ARRAY JOIN` 配合使用的问题。 [#57033](https://github.com/ClickHouse/ClickHouse/pull/57033) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复 Partial Merge Join 使用 joined\_subquery\_re... 时的空指针解引用。 [#57048](https://github.com/ClickHouse/ClickHouse/pull/57048) ([vdimir](https://github.com/vdimir)).
* 修复 RemoteSource 中的竞争条件。 [#57052](https://github.com/ClickHouse/ClickHouse/pull/57052) ([Raúl Marín](https://github.com/Algunenano)).
* 为大整数实现 `bitHammingDistance`。 [#57073](https://github.com/ClickHouse/ClickHouse/pull/57073) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复 S3 风格链接的缺陷。 [#57075](https://github.com/ClickHouse/ClickHouse/pull/57075) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 修复 JSON\_QUERY 函数处理多个数字路径的问题。 [#57096](https://github.com/ClickHouse/ClickHouse/pull/57096) ([KevinyhZou](https://github.com/KevinyhZou)).
* 修复 Gorilla 编解码器中的缓冲区溢出。 [#57107](https://github.com/ClickHouse/ClickHouse/pull/57107) ([Nikolay Degterinsky](https://github.com/evillique)).
* 认证前发生任何异常时，关闭服务器间连接。 [#57142](https://github.com/ClickHouse/ClickHouse/pull/57142) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复对可空 MATERIALIZED 列执行 ALTER UPDATE 后的段错误。 [#57147](https://github.com/ClickHouse/ClickHouse/pull/57147) ([Nikolay Degterinsky](https://github.com/evillique)).
* 修复普通投影仅部分物化时错误的 JOIN 执行计划优化。 [#57196](https://github.com/ClickHouse/ClickHouse/pull/57196) ([Amos Bird](https://github.com/amosbird)).
* 比较列描述时忽略注释。 [#57259](https://github.com/ClickHouse/ClickHouse/pull/57259) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复所有场景下的 `ReadonlyReplica` 指标。 [#57267](https://github.com/ClickHouse/ClickHouse/pull/57267) ([Antonio Andelic](https://github.com/antonio2368)).
* 后台合并正确使用缓存中的临时数据存储。 [#57275](https://github.com/ClickHouse/ClickHouse/pull/57275) ([vdimir](https://github.com/vdimir)).
* 修复 Keeper 的变更日志和快照。 [#57299](https://github.com/ClickHouse/ClickHouse/pull/57299) ([Antonio Andelic](https://github.com/antonio2368)).
* 如果主机名已更改，忽略已完成的 ON CLUSTER 任务。 [#57339](https://github.com/ClickHouse/ClickHouse/pull/57339) ([Alexander Tokmakov](https://github.com/tavplubix)).
* MergeTree 变更操作复用源数据片段的索引粒度。 [#57352](https://github.com/ClickHouse/ClickHouse/pull/57352) ([Maksim Kita](https://github.com/kitaisreal)).
* 文件系统缓存：添加后台下载限制。 [#57424](https://github.com/ClickHouse/ClickHouse/pull/57424) ([Kseniia Sumarokova](https://github.com/kssenii)).
