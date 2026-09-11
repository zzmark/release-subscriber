<h3 id="a-id246a-clickhouse-release-246-2024-07-01">
  <a id="246" /> ClickHouse 24.6 版本, 2024-07-01. [演示文稿](https://presentations.clickhouse.com/2024-release-24.6/), [视频](https://www.youtube.com/watch?v=BK-x8lpvOQw)
</h3>

<Frame>
  <iframe src="https://www.youtube.com/embed/BK-x8lpvOQw" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
</Frame>

<h4 id="backward-incompatible-change-6">
  向后不兼容变更
</h4>

* 默认启用数据库和表的异步加载，参见 config.xml 中的 `async_load_databases`。虽然此变更完全兼容，但行为可能有所不同。此前 `async_load_databases` 为 false，服务器会在所有表加载完成后才接受连接。新版 `async_load_databases` 为 true，服务器可在所有表加载完成前接受连接。若查询尚未加载的表，将等待其加载，可能耗时较长。在负载均衡器后方的大型分布式系统中，这可能改变服务器行为：前一种情况下，负载均衡器收到连接拒绝后可快速切换到其他服务器；后一种情况下，它可能连接到仍在加载表的服务器，使查询延迟增加。此外，大量查询积累在等待状态后同时开始执行，可能造成“惊群”。这仅会影响高负载的分布式后端。可将 `async_load_databases` 设为 false 来避免此问题。 [#57695](https://github.com/ClickHouse/ClickHouse/pull/57695) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 为 `MergeTree` 表默认启用设置 `replace_long_file_name_to_hash`。 [#64457](https://github.com/ClickHouse/ClickHouse/pull/64457) ([Anton Popov](https://github.com/CurtizJ)). 此设置完全兼容，升级时无需操作。23.9 起的所有版本均支持新数据格式。启用此设置后，将无法再降级到 23.8 或更早版本。
* 部分无效查询将在解析阶段更早失败。注意：禁用在 `kql` 表函数中不使用字符串字面量的内联 KQL 表达式（实验性 Kusto 语言），例如 `kql(garbage | trash)`，应使用 `kql('garbage | trash')` 或 `kql($$garbage | trash$$)`。该功能是无意引入的，本不应存在。 [#61500](https://github.com/ClickHouse/ClickHouse/pull/61500) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 重构 `S3Queue` 存储 `Ordered` 模式的并行处理。若使用过 `s3queue_processing_threads_num` 或 `s3queue_total_shards_num`，本 PR 对 Ordered 模式不向后兼容。删除设置 `s3queue_total_shards_num`；此前仅在启用 `s3queue_allow_experimental_sharded_mode` 时允许使用，后者现已废弃。新增设置 `s3queue_buckets`。 [#64349](https://github.com/ClickHouse/ClickHouse/pull/64349) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 新增函数 `snowflakeIDToDateTime`、`snowflakeIDToDateTime64`、`dateTimeToSnowflakeID` 和 `dateTime64ToSnowflakeID`。不同于现有的 `snowflakeToDateTime`、`snowflakeToDateTime64`、`dateTimeToSnowflake` 和 `dateTime64ToSnowflake`，新函数兼容 `generateSnowflakeID`：接受 `generateSnowflakeID` 生成的 Snowflake ID，并生成与 `generateSnowflakeID` 相同类型的 ID（即 `UInt64`）。此外，新函数与 `generateSnowflakeID` 一样，默认使用 UNIX 纪元（1970-01-01）。必要时可传入其他纪元，例如 Twitter/X 的 2010-11-04，即自 UNIX 纪元起 1288834974657 毫秒。旧转换函数已废弃，将在过渡期后移除；若仍要使用，请启用设置 `allow_deprecated_snowflake_conversion_functions`。 [#64948](https://github.com/ClickHouse/ClickHouse/pull/64948) ([Robert Schulze](https://github.com/rschu1ze)).

<h4 id="new-feature-6">
  新功能
</h4>

* 允许在 ClickHouse Keeper 中存储命名集合。 [#64574](https://github.com/ClickHouse/ClickHouse/pull/64574) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 支持空元组。 [#55061](https://github.com/ClickHouse/ClickHouse/pull/55061) ([Amos Bird](https://github.com/amosbird)).
* 新增 Hilbert 曲线编码与解码函数。 [#60156](https://github.com/ClickHouse/ClickHouse/pull/60156) ([Artem Mustafin](https://github.com/Artemmm91)).
* 支持针对 `hilbertEncode` 的索引分析。 [#64662](https://github.com/ClickHouse/ClickHouse/pull/64662) ([Artem Mustafin](https://github.com/Artemmm91)).
* 支持通过函数 `readWKTLineString` 读取 WKT 格式的 `LINESTRING` 几何对象。 [#62519](https://github.com/ClickHouse/ClickHouse/pull/62519) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* 允许从其他磁盘附加数据片段。 [#63087](https://github.com/ClickHouse/ClickHouse/pull/63087) ([Unalian](https://github.com/Unalian)).
* 新增 SQL 函数 `generateSnowflakeID`，生成 Twitter 风格的 Snowflake ID。 [#63577](https://github.com/ClickHouse/ClickHouse/pull/63577) ([Danila Puzov](https://github.com/kazalika)).
* 新增设置 `merge_workload` 和 `mutation_workload`，调节资源在合并、变更操作及其他工作负载之间的使用与共享。 [#64061](https://github.com/ClickHouse/ClickHouse/pull/64061) ([Sergei Trifonov](https://github.com/serxa)).
* 支持用 `=` 运算符比较 `IPv4` 和 `IPv6` 类型。 [#64292](https://github.com/ClickHouse/ClickHouse/pull/64292) ([Francisco J. Jurado Moreno](https://github.com/Beetelbrox)).
* 二元数学函数（pow、atan2、max2、min2、hypot）支持 decimal 参数。 [#64582](https://github.com/ClickHouse/ClickHouse/pull/64582) ([Mikhail Gorshkov](https://github.com/mgorshkov)).
* 新增 SQL 函数 `parseReadableSize`（以及 `OrNull` 和 `OrZero` 变体）。 [#64742](https://github.com/ClickHouse/ClickHouse/pull/64742) ([Francisco J. Jurado Moreno](https://github.com/Beetelbrox)).
* 新增服务器设置 `max_table_num_to_throw` 和 `max_database_num_to_throw`，在 `CREATE` 查询中限制数据库或表的数量。 [#64781](https://github.com/ClickHouse/ClickHouse/pull/64781) ([Xu Jia](https://github.com/XuJia0210)).
* 为类文件存储（s3/file/hdfs/url/azureBlobStorage）添加虚拟列 `_time`。 [#64947](https://github.com/ClickHouse/ClickHouse/pull/64947) ([Ilya Golshtein](https://github.com/ilejn)).
* 新增函数 `base64URLEncode`、`base64URLDecode` 和 `tryBase64URLDecode`。 [#64991](https://github.com/ClickHouse/ClickHouse/pull/64991) ([Mikhail Gorshkov](https://github.com/mgorshkov)).
* 新增函数 `editDistanceUTF8`，计算两个 UTF8 字符串之间的[编辑距离](https://en.wikipedia.org/wiki/Edit_distance)。 [#65269](https://github.com/ClickHouse/ClickHouse/pull/65269) ([LiuNeng](https://github.com/liuneng1994)).
* 新增配置 `http_response_headers`，支持在自定义 HTTP 处理程序中设置自定义响应头。 [#63562](https://github.com/ClickHouse/ClickHouse/pull/63562) ([Grigorii](https://github.com/GSokol)).
* 新增表函数 `loop`，支持无限循环返回查询结果。 [#63452](https://github.com/ClickHouse/ClickHouse/pull/63452) ([Sariel](https://github.com/sarielwxm)). 这对测试很有用。
* 在 `system.query_log` 中新增两列：`used_privileges` 和 `missing_privileges`。`used_privileges` 记录查询执行期间检查过的权限，`missing_privileges` 记录缺少的必要权限。 [#64597](https://github.com/ClickHouse/ClickHouse/pull/64597) ([Alexey Katsman](https://github.com/alexkats)).
* 新增设置 `output_format_pretty_display_footer_column_names`；启用后，较长表格（默认 50 行）末尾会显示列名。最小行数阈值由 `output_format_pretty_display_footer_column_names_min_rows` 控制。 [#65144](https://github.com/ClickHouse/ClickHouse/pull/65144) ([Shaun Struwig](https://github.com/Blargian)).

<h4 id="experimental-feature-5">
  实验性功能
</h4>

* 引入“不同值数量”类型的统计信息。 [#59357](https://github.com/ClickHouse/ClickHouse/pull/59357) ([Han Fei](https://github.com/hanfei1991)).
* ReplicatedMergeTree 支持统计信息。 [#64934](https://github.com/ClickHouse/ClickHouse/pull/64934) ([Han Fei](https://github.com/hanfei1991)).
* 若为 `Replicated` 数据库配置了“副本组”，则自动创建一个包含所有组副本的集群。 [#64312](https://github.com/ClickHouse/ClickHouse/pull/64312) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 新增设置 `parallel_replicas_custom_key_range_lower` 和 `parallel_replicas_custom_key_range_upper`，控制具有动态分片的并行副本在使用范围过滤器时如何并行处理查询。 [#64604](https://github.com/ClickHouse/ClickHouse/pull/64604) ([josh-hildred](https://github.com/josh-hildred)).

<h4 id="performance-improvement-6">
  性能改进
</h4>

* 允许在插入期间重新排列行，在不违反 `PRIMARY KEY` 顺序的前提下优化存储大小。由设置 `optimize_row_order` 控制（默认关闭）。 [#63578](https://github.com/ClickHouse/ClickHouse/pull/63578) ([Igor Markelov](https://github.com/ElderlyPassionFruit)).
* 新增原生 Parquet 读取器，可将 Parquet 二进制数据直接读为 ClickHouse 列。由设置 `input_format_parquet_use_native_reader` 控制（默认禁用）。 [#60361](https://github.com/ClickHouse/ClickHouse/pull/60361) ([ZhiHong Zhang](https://github.com/copperybean)).
* 当查询过滤器能够从 MergeTree 表选出精确范围时，支持部分简单计数优化。 [#60463](https://github.com/ClickHouse/ClickHouse/pull/60463) ([Amos Bird](https://github.com/amosbird)).
* 在单个转换步骤中收集多个线程的数据块，降低多线程 `INSERT` 的最大内存占用。 [#61047](https://github.com/ClickHouse/ClickHouse/pull/61047) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 使用 Azure 对象存储时，通过固定内存分配避免额外缓冲区分配，降低内存占用。 [#63160](https://github.com/ClickHouse/ClickHouse/pull/63160) ([SmitaRKulkarni](https://github.com/SmitaRKulkarni)).
* 减少 `ColumnNullable::size` 中的虚函数调用次数。 [#60556](https://github.com/ClickHouse/ClickHouse/pull/60556) ([HappenLee](https://github.com/HappenLee)).
* 正则表达式参数为单个字符时，加速 `splitByRegexp`。 [#62696](https://github.com/ClickHouse/ClickHouse/pull/62696) ([Robert Schulze](https://github.com/rschu1ze)).
* 通过跟踪已用键的最小值和最大值，加速按 8 位和 16 位键聚合，减少需要检查的槽位数。 [#62746](https://github.com/ClickHouse/ClickHouse/pull/62746) ([Jiebin Sun](https://github.com/jiebinn)).
* 当左侧为 `LowCardinality`、右侧为常量集合时，优化 IN 运算符。 [#64060](https://github.com/ClickHouse/ClickHouse/pull/64060) ([Zhiguo Zhou](https://github.com/ZhiguoZh)).
* 使用线程池初始化和销毁 `ConcurrentHashJoin` 内部的哈希表。 [#64241](https://github.com/ClickHouse/ClickHouse/pull/64241) ([Nikita Taranov](https://github.com/nickitat)).
* 优化含稀疏列的表的纵向合并。 [#64311](https://github.com/ClickHouse/ClickHouse/pull/64311) ([Anton Popov](https://github.com/CurtizJ)).
* 启用纵向合并期间从远程文件系统预取数据，降低远程文件系统上存储数据的表的纵向合并延迟。 [#64314](https://github.com/ClickHouse/ClickHouse/pull/64314) ([Anton Popov](https://github.com/CurtizJ)).
* 减少 `ColumnSparse::filter` 对 `isDefault` 的冗余调用，以提升性能。 [#64426](https://github.com/ClickHouse/ClickHouse/pull/64426) ([Jiebin Sun](https://github.com/jiebinn)).
* 通过多个异步 getChildren 请求，加速 keeper-client 的 `find_super_nodes` 和 `find_big_family` 命令。 [#64628](https://github.com/ClickHouse/ClickHouse/pull/64628) ([Alexander Gololobov](https://github.com/davenger)).
* 改进 `least`/`greatest` 对可空数值类型参数的处理。 [#64668](https://github.com/ClickHouse/ClickHouse/pull/64668) ([KevinyhZou](https://github.com/KevinyhZou)).
* 允许合并查询计划中连续的两个过滤步骤。当过滤条件可从父步骤下推时，可改善过滤条件下推优化。 [#64760](https://github.com/ClickHouse/ClickHouse/pull/64760) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 移除纵向 FINAL 实现中的错误优化，并重新默认启用纵向 FINAL 算法。 [#64783](https://github.com/ClickHouse/ClickHouse/pull/64783) ([Duc Canh Le](https://github.com/canhld94)).
* 从过滤表达式中移除 ALIAS 节点，略微改善带 `PREWHERE` 查询的性能（使用新分析器时）。 [#64793](https://github.com/ClickHouse/ClickHouse/pull/64793) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 重新启用 OpenSSL 会话缓存。 [#65111](https://github.com/ClickHouse/ClickHouse/pull/65111) ([Robert Schulze](https://github.com/rschu1ze)).
* 新增设置，允许在插入时禁用跳过索引和统计信息的物化（`materialize_skip_indexes_on_insert` 和 `materialize_statistics_on_insert`）。 [#64391](https://github.com/ClickHouse/ClickHouse/pull/64391) ([Anton Popov](https://github.com/CurtizJ)).
* 使用已分配内存大小计算行组大小，降低单线程模式下 Parquet 写入器的峰值内存。 [#64424](https://github.com/ClickHouse/ClickHouse/pull/64424) ([LiuNeng](https://github.com/liuneng1994)).
* 改进稀疏列迭代器，减少对 `size` 的调用。 [#64497](https://github.com/ClickHouse/ClickHouse/pull/64497) ([Jiebin Sun](https://github.com/jiebinn)).
* 更新备份到 Azure Blob Storage 时使用服务端复制的条件。 [#64518](https://github.com/ClickHouse/ClickHouse/pull/64518) ([SmitaRKulkarni](https://github.com/SmitaRKulkarni)).
* 优化包含大量跳过索引的表进行纵向合并时的内存占用。 [#64580](https://github.com/ClickHouse/ClickHouse/pull/64580) ([Anton Popov](https://github.com/CurtizJ)).

<h4 id="improvement-6">
  改进
</h4>

* 对系统表执行 `SHOW CREATE TABLE`，现在会显示每张表独有且非常实用的注释，说明该表的用途。 [#63788](https://github.com/ClickHouse/ClickHouse/pull/63788) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* 函数 `round()`、`roundBankers()`、`floor()`、`ceil()` 和 `trunc()` 的第二个参数（scale）现在可以是非常量。 [#64798](https://github.com/ClickHouse/ClickHouse/pull/64798) ([Mikhail Gorshkov](https://github.com/mgorshkov)).
* 添加新磁盘时，热重载 `Distributed` 表的存储策略。 [#58285](https://github.com/ClickHouse/ClickHouse/pull/58285) ([Duc Canh Le](https://github.com/canhld94)).
* 避免服务处于饱和状态时，MergeTree 索引分析调度线程可能发生的死锁。 [#59427](https://github.com/ClickHouse/ClickHouse/pull/59427) ([Sean Haynes](https://github.com/seandhaynes)).
* 修复 S3 代理支持与隧道连接中的若干小型边界问题。 [#63427](https://github.com/ClickHouse/ClickHouse/pull/63427) ([Arthur Passos](https://github.com/arthurpassos)).
* 改进 io\_uring 重新提交的可观测性。将 Profile Event `IOUringSQEsResubmits` 重命名为 `IOUringSQEsResubmitsAsync`，并新增 `IOUringSQEsResubmitsSync`。 [#63699](https://github.com/ClickHouse/ClickHouse/pull/63699) ([Tomer Shafir](https://github.com/tomershafir)).
* 新增设置 `metadata_keep_free_space_bytes`，为元数据存储磁盘保留空闲空间。 [#64128](https://github.com/ClickHouse/ClickHouse/pull/64128) ([MikhailBurdukov](https://github.com/MikhailBurdukov)).
* 新增指标，跟踪 `plain_rewritable` 元数据存储创建和删除的目录数，以及本地到远程内存映射中的条目数。 [#64175](https://github.com/ClickHouse/ClickHouse/pull/64175) ([Julia Kartseva](https://github.com/jkartseva)).
* 查询缓存现在将设置不同的相同查询视为不同查询。在不同设置（例如 `limit` 或 `additional_table_filters`）会影响查询结果时，这能提升健壮性。 [#64205](https://github.com/ClickHouse/ClickHouse/pull/64205) ([Robert Schulze](https://github.com/rschu1ze)).
* 将对象存储的非标准错误码 `QpsLimitExceeded` 视为可重试错误。 [#64225](https://github.com/ClickHouse/ClickHouse/pull/64225) ([Sema Checherinda](https://github.com/CheSema)).
* 若表对应的 ZooKeeper 路径已存在，则禁止将 MergeTree 表转换为复制表。 [#64244](https://github.com/ClickHouse/ClickHouse/pull/64244) ([Kirill](https://github.com/kirillgarbar)).
* 新增设置 `input_format_parquet_prefer_block_bytes`，控制平均输出数据块字节数，并将 `input_format_parquet_max_block_size` 默认值改为 65409。 [#64427](https://github.com/ClickHouse/ClickHouse/pull/64427) ([LiuNeng](https://github.com/liuneng1994)).
* 允许对 `no_proxy` 环境变量和 ClickHouse 代理配置中指定的主机绕过代理。 [#63314](https://github.com/ClickHouse/ClickHouse/pull/63314) ([Arthur Passos](https://github.com/arthurpassos)).
* 始终以全局线程池中足够的线程数启动 Keeper。 [#64444](https://github.com/ClickHouse/ClickHouse/pull/64444) ([Duc Canh Le](https://github.com/canhld94)).
* 用户配置中的设置不影响对象存储上的 `MergeTree` 合并和变更操作。 [#64456](https://github.com/ClickHouse/ClickHouse/pull/64456) ([alesapin](https://github.com/alesapin)).
* 将对象存储的非标准错误码 `TotalQpsLimitExceeded` 视为可重试错误。 [#64520](https://github.com/ClickHouse/ClickHouse/pull/64520) ([Sema Checherinda](https://github.com/CheSema)).
* 更新开源版和 ClickHouse Cloud 的高级仪表盘，添加“最大并发网络连接数”图表。 [#64610](https://github.com/ClickHouse/ClickHouse/pull/64610) ([Thom O'Connor](https://github.com/thomoco)).
* 改进 `zeros_mt` 和 `generateRandom` 的进度报告。 [#64804](https://github.com/ClickHouse/ClickHouse/pull/64804) ([Raúl Marín](https://github.com/Algunenano)).
* 新增异步指标 `jemalloc.profile.active`，显示采样当前是否活跃。这是在 prof.active 之外的另一种激活机制；调用线程必须同时启用两者才会采样。 [#64842](https://github.com/ClickHouse/ClickHouse/pull/64842) ([Unalian](https://github.com/Unalian)).
* 移除 `allow_experimental_join_condition` 的重要设置标记。该标记可能阻止混合版本集群中的分布式查询成功执行。 [#65008](https://github.com/ClickHouse/ClickHouse/pull/65008) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* 新增服务器异步指标 `DiskGetObjectThrottler*` 和 `DiskGetObjectThrottler*`，反映磁盘设置 `s3_max_get_rps` 和 `s3_max_put_rps` 定义的每秒请求数限制，以及当前无需触发磁盘限流即可发送的请求数量。为每个配置了限制的磁盘定义这些指标。 [#65050](https://github.com/ClickHouse/ClickHouse/pull/65050) ([Sergei Trifonov](https://github.com/serxa)).
* 为 `Poco::ThreadPool` 初始化全局跟踪收集器（Keeper 等需要）。 [#65239](https://github.com/ClickHouse/ClickHouse/pull/65239) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 使用 `bcrypt_hash` 创建用户时添加校验。 [#65242](https://github.com/ClickHouse/ClickHouse/pull/65242) ([Raúl Marín](https://github.com/Algunenano)).
* 新增 Profile Event，记录 `PREWHERE` 期间及之后读取的行数。 [#64198](https://github.com/ClickHouse/ClickHouse/pull/64198) ([Nikita Taranov](https://github.com/nickitat)).
* 使用并行副本时在 `EXPLAIN PLAN` 中打印查询。 [#64298](https://github.com/ClickHouse/ClickHouse/pull/64298) ([vdimir](https://github.com/vdimir)).
* 将 `allow_deprecated_functions` 重命名为 `allow_deprecated_error_prone_window_functions`。 [#64358](https://github.com/ClickHouse/ClickHouse/pull/64358) ([Raúl Marín](https://github.com/Algunenano)).
* `file` 表函数对文件描述符也遵守 `max_read_buffer_size` 设置。 [#64532](https://github.com/ClickHouse/ClickHouse/pull/64532) ([Azat Khuzhin](https://github.com/azat)).
* 即使通过物化视图，也为不支持事务的存储禁用事务。 [#64918](https://github.com/ClickHouse/ClickHouse/pull/64918) ([alesapin](https://github.com/alesapin)).
* 在旧分析器中禁止 `QUALIFY` 子句。旧分析器会忽略 `QUALIFY`，可能导致变更操作意外删除数据。 [#65356](https://github.com/ClickHouse/ClickHouse/pull/65356) ([Dmitry Novik](https://github.com/novikd)).

<h4 id="bug-fix-user-visible-misbehavior-in-an-official-stable-release-5">
  缺陷修复（正式稳定版本中用户可见的异常行为）
</h4>

* 修复 Apache ORC 库的缺陷：修复写入时所有平台上无符号类型及 ARM 上 Int8 类型的 ORC 统计信息计算。 [#64563](https://github.com/ClickHouse/ClickHouse/pull/64563) ([Michael Kolupaev](https://github.com/al13n321)).
* 恢复 ClickHouse 处理和解释 CSV 格式中 Tuple 的原有行为。本变更实际撤销 [https://github.com/ClickHouse/ClickHouse/pull/60994](https://github.com/ClickHouse/ClickHouse/pull/60994)，将其改为仅通过以下设置启用：`output_format_csv_serialize_tuple_into_separate_columns`、`input_format_csv_deserialize_separate_columns_into_tuple` 和 `input_format_csv_try_infer_strings_from_quoted_tuples`。 [#65170](https://github.com/ClickHouse/ClickHouse/pull/65170) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* 修复一个权限错误：在特定情况下，用户无需必要授权即可提升自己在默认数据库上的权限。 [#64769](https://github.com/ClickHouse/ClickHouse/pull/64769) ([pufit](https://github.com/pufit)).
* 修复 UniqInjectiveFunctionsEliminationPass 与 uniqCombined 组合时的崩溃。 [#65188](https://github.com/ClickHouse/ClickHouse/pull/65188) ([Raúl Marín](https://github.com/Algunenano)).
* 修复 ClickHouse Keeper 关闭会话时导致摘要不匹配的缺陷。 [#65198](https://github.com/ClickHouse/ClickHouse/pull/65198) ([Aleksei Filatov](https://github.com/aalexfvk)).
* 为 Distinct 组合器使用正确的内存对齐。此前使用该组合器时，错误的内存分配可能导致崩溃。 [#65379](https://github.com/ClickHouse/ClickHouse/pull/65379) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复 `DISTINCT` 与窗口函数组合时的崩溃。 [#64767](https://github.com/ClickHouse/ClickHouse/pull/64767) ([Igor Nikonov](https://github.com/devcrafter)).
* 修复 'set' 跳过索引无法与 IN 和 indexHint() 配合工作的问题。 [#62083](https://github.com/ClickHouse/ClickHouse/pull/62083) ([Michael Kolupaev](https://github.com/al13n321)).
* 支持在给参数化视图赋值时执行函数。 [#63502](https://github.com/ClickHouse/ClickHouse/pull/63502) ([SmitaRKulkarni](https://github.com/SmitaRKulkarni)).
* 修复 Parquet 内存跟踪。 [#63584](https://github.com/ClickHouse/ClickHouse/pull/63584) ([Michael Kolupaev](https://github.com/al13n321)).
* 修复读取 `Tuple(Map(LowCardinality(String), String), ...)` 类型列的问题。 [#63956](https://github.com/ClickHouse/ClickHouse/pull/63956) ([Anton Popov](https://github.com/CurtizJ)).
* 修复不同类型（表达式和函数）的循环别名触发 `Cyclic aliases` 错误的问题。 [#63993](https://github.com/ClickHouse/ClickHouse/pull/63993) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 为查询流水线中的每个视图使用恰当重定义、包含正确定义者的上下文。 [#64079](https://github.com/ClickHouse/ClickHouse/pull/64079) ([pufit](https://github.com/pufit)).
* 修复分析器：解决使用 INTERPOLATE 时的“Not found column”错误。 [#64096](https://github.com/ClickHouse/ClickHouse/pull/64096) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* 修复将备份写入 S3 存储桶时，目标桶凭据与源文件所在磁盘不同的情况。 [#64153](https://github.com/ClickHouse/ClickHouse/pull/64153) ([Antonio Andelic](https://github.com/antonio2368)).
* 查询缓存现在将针对不同数据库的两个相同查询视为不同查询。此前行为可能被利用来绕过读取表所需的权限。 [#64199](https://github.com/ClickHouse/ClickHouse/pull/64199) ([Robert Schulze](https://github.com/rschu1ze)).
* 修复 StatusFile 中 \~WriteBufferFromFileDescriptor 因未捕获异常而中止的可能性。 [#64206](https://github.com/ClickHouse/ClickHouse/pull/64206) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复含 `ARRAY JOIN` 的分布式查询出现 `duplicate alias` 错误。 [#64226](https://github.com/ClickHouse/ClickHouse/pull/64226) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复从字符串到整数的意外 accurateCast。 [#64255](https://github.com/ClickHouse/ClickHouse/pull/64255) ([wudidapaopao](https://github.com/wudidapaopao)).
* 修复任一 OR 组包含互斥原子条件时的 CNF 简化。 [#64256](https://github.com/ClickHouse/ClickHouse/pull/64256) ([Eduard Karacharov](https://github.com/korowa)).
* 修复查询树大小校验。 [#64377](https://github.com/ClickHouse/ClickHouse/pull/64377) ([Dmitry Novik](https://github.com/novikd)).
* 修复 `Buffer` 表使用 `PREWHERE` 时的 `Logical error: Bad cast`。 [#64388](https://github.com/ClickHouse/ClickHouse/pull/64388) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 避免存储在对象存储上的 `blob_storage_log` 递归记录日志。 [#64393](https://github.com/ClickHouse/ClickHouse/pull/64393) ([vdimir](https://github.com/vdimir)).
* 修复带默认表达式的表的 `CREATE TABLE AS` 查询。 [#64455](https://github.com/ClickHouse/ClickHouse/pull/64455) ([Anton Popov](https://github.com/CurtizJ)).
* 修复含可空键的表执行 ORDER BY ... NULLS FIRST / LAST 时 `optimize_read_in_order` 的行为。 [#64483](https://github.com/ClickHouse/ClickHouse/pull/64483) ([Eduard Karacharov](https://github.com/korowa)).
* 修复使用 `GLOBAL IN.` 别名的查询出现 `Expression nodes list expected 1 projection names` 和 `Unknown expression or identifier` 错误。 [#64517](https://github.com/ClickHouse/ClickHouse/pull/64517) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复 `GROUP BY` 键包含常量 CTE 的分布式查询出现 `Cannot find column` 错误。 [#64519](https://github.com/ClickHouse/ClickHouse/pull/64519) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复从备份恢复时，创建定义者尚未恢复的物化视图阻塞恢复而引发的循环崩溃。 [#64595](https://github.com/ClickHouse/ClickHouse/pull/64595) ([pufit](https://github.com/pufit)).
* 修复函数 `formatDateTimeInJodaSyntax` 在格式化器生成奇数个字符且最后一个字符为 `0` 时的输出。例如，`SELECT formatDateTimeInJodaSyntax(toDate('2012-05-29'), 'D')` 现在正确返回 `150`，而非此前的 `15`。 [#64614](https://github.com/ClickHouse/ClickHouse/pull/64614) ([LiuNeng](https://github.com/liuneng1994)).
* 如果已使用 `-If` 组合器，则不重写聚合。 [#64638](https://github.com/ClickHouse/ClickHouse/pull/64638) ([Dmitry Novik](https://github.com/novikd)).
* 修复小缓冲区情况下的浮点类型推断，例如 `--max_read_buffer_size 1`。 [#64641](https://github.com/ClickHouse/ClickHouse/pull/64641) ([Azat Khuzhin](https://github.com/azat)).
* 修复可能导致带表达式的 TTL 不生效的缺陷。 [#64694](https://github.com/ClickHouse/ClickHouse/pull/64694) ([alesapin](https://github.com/alesapin)).
* 修复移除恒为真的 `WHERE` 和 `PREWHERE` 表达式的处理（新分析器）。 [#64695](https://github.com/ClickHouse/ClickHouse/pull/64695) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复基于词元的文本索引（`ngrambf`、`full_text`）根据 `startsWith`、`endsWith`、`match`、`multiSearchAny` 结果过滤时，过度排除数据片段的问题。 [#64720](https://github.com/ClickHouse/ClickHouse/pull/64720) ([Eduard Karacharov](https://github.com/korowa)).
* 修复 `UTF8::computeWidth` 函数对 ANSI CSI 转义的错误处理。 [#64756](https://github.com/ClickHouse/ClickHouse/pull/64756) ([Shaun Struwig](https://github.com/Blargian)).
* 修复跨子查询错误移除 `ORDER BY` / `LIMIT BY` 的一种情况。 [#64766](https://github.com/ClickHouse/ClickHouse/pull/64766) ([Raúl Marín](https://github.com/Algunenano)).
* 修复实验性非等值连接中，混合连接条件包含集合子查询的情况。 [#64775](https://github.com/ClickHouse/ClickHouse/pull/64775) ([lgbo](https://github.com/lgbo-ustc)).
* 修复 `plain_rewritable` 磁盘上本地缓存的崩溃。 [#64778](https://github.com/ClickHouse/ClickHouse/pull/64778) ([Julia Kartseva](https://github.com/jkartseva)).
* Keeper 修复：在 `mntr` 命令中为 `zk_latest_snapshot_size` 返回正确值。 [#64784](https://github.com/ClickHouse/ClickHouse/pull/64784) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复分布式查询对 `Nested` 列执行 `ARRAY JOIN` 时的 `Cannot find column` 错误。修复 [#64755](https://github.com/ClickHouse/ClickHouse/issues/64755)。 [#64801](https://github.com/ClickHouse/ClickHouse/pull/64801) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复 SLRU 缓存策略的内存泄漏。 [#64803](https://github.com/ClickHouse/ClickHouse/pull/64803) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复多类查询可能存在的错误内存跟踪：从 S3 读取任意数据的查询、通过 HTTP 协议执行的查询及异步插入。 [#64844](https://github.com/ClickHouse/ClickHouse/pull/64844) ([Anton Popov](https://github.com/CurtizJ)).
* 修复通过 `PREWHERE` 读取物化视图且其列类型与源表不同时的 `Block structure mismatch` 错误。修复 [#64611](https://github.com/ClickHouse/ClickHouse/issues/64611)。 [#64855](https://github.com/ClickHouse/ClickHouse/pull/64855) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复表具有带子查询的 TTL、数据库为 Replicated、启用并行副本和分析器时的罕见崩溃。这非常少见，但请不要使用包含子查询的 TTL。 [#64858](https://github.com/ClickHouse/ClickHouse/pull/64858) ([alesapin](https://github.com/alesapin)).
* 修复大批量删除时 `blob_storage_log` 中重复的 `Delete` 事件。 [#64924](https://github.com/ClickHouse/ClickHouse/pull/64924) ([vdimir](https://github.com/vdimir)).
* 修复配置包含来自 \[Zoo]Keeper 的 include 时，服务器启动后可能由 \[Zoo]Keeper 返回的 `Session moved to another server` 错误。 [#64986](https://github.com/ClickHouse/ClickHouse/pull/64986) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 修复在 [https://github.com/ClickHouse/ClickHouse/pull/54211](https://github.com/ClickHouse/ClickHouse/pull/54211) 中破坏的参数化视图 `ALTER MODIFY COMMENT` 查询。 [#65031](https://github.com/ClickHouse/ClickHouse/pull/65031) ([Nikolay Degterinsky](https://github.com/evillique)).
* 修复启用 `cluster_secure_connection` 参数时 DatabaseReplicated 的 `host_id`。此前即使启用该参数，DatabaseReplicated 所建集群内的所有连接仍不安全。 [#65054](https://github.com/ClickHouse/ClickHouse/pull/65054) ([Nikolay Degterinsky](https://github.com/evillique)).
* 修复 StorageMerge 在 `PREWHERE` 优化之后出现 `Not-ready Set` 错误。 [#65057](https://github.com/ClickHouse/ClickHouse/pull/65057) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 避免在类文件存储中向已结束的缓冲区写入。 [#65063](https://github.com/ClickHouse/ClickHouse/pull/65063) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复循环别名可能导致查询无限持续的问题。修复 [#64849](https://github.com/ClickHouse/ClickHouse/issues/64849)。 [#65081](https://github.com/ClickHouse/ClickHouse/pull/65081) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复带 `INTERPOLATE (alias)` 的远程查询出现 `Unknown expression identifier` 错误（新分析器）。修复 [#64636](https://github.com/ClickHouse/ClickHouse/issues/64636)。 [#65090](https://github.com/ClickHouse/ClickHouse/pull/65090) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复将算术运算移出聚合的优化。新分析器此前只应用一次该优化。 [#65104](https://github.com/ClickHouse/ClickHouse/pull/65104) ([Dmitry Novik](https://github.com/novikd)).
* 修复新分析器中的聚合函数名称重写。 [#65110](https://github.com/ClickHouse/ClickHouse/pull/65110) ([Dmitry Novik](https://github.com/novikd)).
* 从客户端套接字读取请求正文或其部分内容时，若接收超时，返回 5xx 而非 200 OK。 [#65118](https://github.com/ClickHouse/ClickHouse/pull/65118) ([Julian Maicher](https://github.com/jmaicher)).
* 修复对冲请求可能引发的崩溃。 [#65206](https://github.com/ClickHouse/ClickHouse/pull/65206) ([Azat Khuzhin](https://github.com/azat)).
* 修复 Hashed 和 Hashed\_Array 字典短路求值的缺陷：可能读取未初始化数字，导致多种错误。 [#65256](https://github.com/ClickHouse/ClickHouse/pull/65256) ([jsc0218](https://github.com/jsc0218)).
* 本 PR 确保在 IN 运算符的类型转换期间，始终可见常量（IN 的第二个参数）的类型。否则丢失类型信息可能导致部分转换失败，例如 DateTime 到 Date 的转换。修复（[#64487](https://github.com/ClickHouse/ClickHouse/issues/64487)）。 [#65315](https://github.com/ClickHouse/ClickHouse/pull/65315) ([pn](https://github.com/chloro-pn)).

<h4 id="buildtestingpackaging-improvement-2">
  构建/测试/打包改进
</h4>

* 添加 LLVM XRay 支持。 [#64592](https://github.com/ClickHouse/ClickHouse/pull/64592) [#64837](https://github.com/ClickHouse/ClickHouse/pull/64837) ([Tomer Shafir](https://github.com/tomershafir)).
* 将 s3/hdfs/azure 存储实现统一到使用 IObjectStorage 的单个类中；\*Cluster、数据湖和 Queue 存储也进行同样处理。 [#59767](https://github.com/ClickHouse/ClickHouse/pull/59767) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 重构数据片段写入器，移除对 MergeTreeData 和 DataPart 的依赖。 [#63620](https://github.com/ClickHouse/ClickHouse/pull/63620) ([Alexander Gololobov](https://github.com/davenger)).
* 重构 `KeyCondition` 和键分析，以改进 PartitionPruner 和简单计数优化。这从 [#60463](https://github.com/ClickHouse/ClickHouse/issues/60463) 中拆分而来。 [#61459](https://github.com/ClickHouse/ClickHouse/pull/61459) ([Amos Bird](https://github.com/amosbird)).
* 引入断言，验证调用所有函数时所用列的大小均正确。 [#63723](https://github.com/ClickHouse/ClickHouse/pull/63723) ([Raúl Marín](https://github.com/Algunenano)).
* 使用 `rc` 初始化脚本启动 ClickHouse 服务器守护进程时，将 `network` 服务设为必需。 [#60650](https://github.com/ClickHouse/ClickHouse/pull/60650) ([Chun-Sheng, Li](https://github.com/peter279k)).
* 缩小部分慢速测试的规模。 [#64387](https://github.com/ClickHouse/ClickHouse/pull/64387) [#64452](https://github.com/ClickHouse/ClickHouse/pull/64452) ([Raúl Marín](https://github.com/Algunenano)).
* 使用 keeper-bench 重放 ZooKeeper 日志。 [#62481](https://github.com/ClickHouse/ClickHouse/pull/62481) ([Antonio Andelic](https://github.com/antonio2368)).
