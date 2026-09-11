<h3 id="236">
  <a id="236" /> ClickHouse 23.6 版本, 2023-06-29. [演示文稿](https://presentations.clickhouse.com/2023-release-23.6/), [视频](https://www.youtube.com/watch?v=cuf_hYn7dqU)
</h3>

<Frame>
  <iframe src="https://www.youtube.com/embed/cuf_hYn7dqU" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
</Frame>

<h4 id="backward-incompatible-change-6">
  向后不兼容变更
</h4>

* 移除文件系统缓存中的 `do_not_evict_index_and_mark_files` 功能；它只会让情况更糟。 [#51253](https://github.com/ClickHouse/ClickHouse/pull/51253) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 移除实验性 LIVE VIEW 的 ALTER 支持。 [#51287](https://github.com/ClickHouse/ClickHouse/pull/51287) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 将 `http_max_field_value_size` 和 `http_max_field_name_size` 的默认值降低到 128 KiB。 [#51163](https://github.com/ClickHouse/ClickHouse/pull/51163) ([Mikhail f. Shiryaev](https://github.com/Felixoid)).
* 为提高易用性，将 CPU 相关的 CGroups 指标替换为单个 `CGroupMaxCPU` 指标。设置 CGroups 限制时，`Normalized` CPU 使用指标将按该限制归一化，而非按 CPU 总数归一化。关闭 [#50836](https://github.com/ClickHouse/ClickHouse/issues/50836)。 [#50835](https://github.com/ClickHouse/ClickHouse/pull/50835) ([Alexey Milovidov](https://github.com/alexey-milovidov)).

<h4 id="new-feature-6">
  新功能
</h4>

* `transform` 函数以及按值匹配的 `CASE` 开始支持所有数据类型。关闭 [#29730](https://github.com/ClickHouse/ClickHouse/issues/29730)、[#32387](https://github.com/ClickHouse/ClickHouse/issues/32387)、[#50827](https://github.com/ClickHouse/ClickHouse/issues/50827)、[#31336](https://github.com/ClickHouse/ClickHouse/issues/31336)、[#40493](https://github.com/ClickHouse/ClickHouse/issues/40493)。 [#51351](https://github.com/ClickHouse/ClickHouse/pull/51351) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 新增 `--rename_files_after_processing <pattern>` 选项。关闭 [#34207](https://github.com/ClickHouse/ClickHouse/issues/34207)。 [#49626](https://github.com/ClickHouse/ClickHouse/pull/49626) ([alekseygolub](https://github.com/alekseygolub)).
* 为 `INTO OUTFILE` 子句新增 `TRUNCATE` 修饰符支持；文件已存在时，提示在 `INTO OUTFILE` 中使用 `APPEND` 或 `TRUNCATE`。 [#50950](https://github.com/ClickHouse/ClickHouse/pull/50950) ([alekar](https://github.com/alekar)).
* 新增 `Redis` 表引擎和 `redis` 表函数，可查询外部 Redis 服务器。 [#50150](https://github.com/ClickHouse/ClickHouse/pull/50150) ([JackyWoo](https://github.com/JackyWoo)).
* 允许使用 `s3_skip_empty_files`、`hdfs_skip_empty_files`、`engine_file_skip_empty_files`、`engine_url_skip_empty_files` 设置，在 file/s3/url/hdfs 表函数中跳过空文件。 [#50364](https://github.com/ClickHouse/ClickHouse/pull/50364) ([Kruglov Pavel](https://github.com/Avogar)).
* 新增 `use_mysql_types_in_show_columns` 设置：客户端通过 MySQL 兼容端口连接时，使 `SHOW COLUMNS` SQL 语句显示对应的 MySQL 类型。 [#49577](https://github.com/ClickHouse/ClickHouse/pull/49577) ([Thomas Panetti](https://github.com/tpanetti)).
* clickhouse-client 现在可以使用连接字符串调用，代替 “--host”、“--port”、“--user” 等参数。 [#50689](https://github.com/ClickHouse/ClickHouse/pull/50689) ([Alexey Gerasimchuck](https://github.com/Demilivor)).
* 新增 `session_timezone` 设置，未显式指定时区时，将其作为会话默认时区。 [#44149](https://github.com/ClickHouse/ClickHouse/pull/44149) ([Andrey Zvonov](https://github.com/zvonand)).
* DEFLATE\_QPL 编解码器现在由服务器设置 “enable\_deflate\_qpl\_codec”（默认 false）控制，代替 “allow\_experimental\_codecs”，标志着 DEFLATE\_QPL 不再是实验性功能。 [#50775](https://github.com/ClickHouse/ClickHouse/pull/50775) ([Robert Schulze](https://github.com/rschu1ze)).

<h4 id="performance-improvement-6">
  性能改进
</h4>

* 改进 `ReplicatedMergeTree` 中合并选择与清理任务的调度，没有内容需要合并或清理时，不再过于频繁地执行。新增 `max_merge_selecting_sleep_ms`、`merge_selecting_sleep_slowdown_factor`、`max_cleanup_delay_period` 和 `cleanup_thread_preferred_points_per_iteration` 设置。应可关闭 [#31919](https://github.com/ClickHouse/ClickHouse/issues/31919)。 [#50107](https://github.com/ClickHouse/ClickHouse/pull/50107) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 支持将过滤器穿过 CROSS JOIN 下推。 [#50605](https://github.com/ClickHouse/ClickHouse/pull/50605) ([Han Fei](https://github.com/hanfei1991)).
* 启用 QueryProfiler 时，用线程局部 timer\_id 代替全局对象，以提升性能。 [#48778](https://github.com/ClickHouse/ClickHouse/pull/48778) ([Jiebin Sun](https://github.com/jiebinn)).
* 重写 CapnProto 输入/输出格式以提高性能。列名与 CapnProto 字段的匹配不区分大小写，并修复嵌套结构字段的读写。 [#49752](https://github.com/ClickHouse/ClickHouse/pull/49752) ([Kruglov Pavel](https://github.com/Avogar)).
* 优化并行线程中的 Parquet 写入性能。 [#50102](https://github.com/ClickHouse/ClickHouse/pull/50102) ([Hongbin Ma](https://github.com/binmahone)).
* 处理 MATERIALIZED VIEW 和仅含一个数据块的存储时，禁用 `parallelize_output_from_storages`。 [#50214](https://github.com/ClickHouse/ClickHouse/pull/50214) ([Azat Khuzhin](https://github.com/azat)).
* 合并 PR [#46558](https://github.com/ClickHouse/ClickHouse/pull/46558)。如果数据块已经有序，排序时避免重新排列数据块。 [#50697](https://github.com/ClickHouse/ClickHouse/pull/50697) ([Alexey Milovidov](https://github.com/alexey-milovidov), [Maksim Kita](https://github.com/kitaisreal)).
* 并行向 ZooKeeper 发出多个 list 请求，加快 system.zookeeper 表的读取。 [#51042](https://github.com/ClickHouse/ClickHouse/pull/51042) ([Alexander Gololobov](https://github.com/davenger)).
* 加快时区 DateTime 查找表的初始化。由于其开销较大，这应能减少 clickhouse-client 的启动/连接时间，尤其是在调试构建中。 [#51347](https://github.com/ClickHouse/ClickHouse/pull/51347) ([Alexander Gololobov](https://github.com/davenger)).
* 修复同步 HEAD 请求导致的数据湖性能缓慢问题，涉及 Iceberg/DeltaLake/Hudi 在文件数量很多时的性能。 [#50976](https://github.com/ClickHouse/ClickHouse/pull/50976) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 不再读取右侧 GLOBAL JOIN 表的所有列。 [#50721](https://github.com/ClickHouse/ClickHouse/pull/50721) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).

<h4 id="experimental-feature-3">
  实验性功能
</h4>

* 支持分析器与并行副本配合使用。 [#50441](https://github.com/ClickHouse/ClickHouse/pull/50441) ([Raúl Marín](https://github.com/Algunenano)).
* 大型合并/变更操作执行前随机等待，以在零复制机制下将负载更均匀地分散到各副本。 [#51282](https://github.com/ClickHouse/ClickHouse/pull/51282) ([alesapin](https://github.com/alesapin)).
* 如果 `Replicated` 数据库仅有一个分片，且底层表为 `ReplicatedMergeTree`，则不通过数据库复制 `ALTER PARTITION` 查询和变更操作。 [#51049](https://github.com/ClickHouse/ClickHouse/pull/51049) ([Alexander Tokmakov](https://github.com/tavplubix)).

<h4 id="improvement-6">
  改进
</h4>

* 放宽“数据片段过多”的阈值以适应现代部署，并恢复长时间运行插入查询期间的背压机制。 [#50856](https://github.com/ClickHouse/ClickHouse/pull/50856) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 对于 CIDR ::ffff:0:0/96 范围（IPv4 映射地址），允许将 IPv6 转换为 IPv4 地址。 [#49759](https://github.com/ClickHouse/ClickHouse/pull/49759) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* 更新 MongoDB 协议，支持 MongoDB 5.1 及更新版本，同时保留采用旧协议的版本（\<3.6）支持。关闭 [#45621](https://github.com/ClickHouse/ClickHouse/issues/45621)、[#49879](https://github.com/ClickHouse/ClickHouse/issues/49879)。 [#50061](https://github.com/ClickHouse/ClickHouse/pull/50061) ([Nikolay Degterinsky](https://github.com/evillique)).
* 新增 `input_format_max_bytes_to_read_for_schema_inference` 设置，限制结构推断读取的字节数。关闭 [#50577](https://github.com/ClickHouse/ClickHouse/issues/50577)。 [#50592](https://github.com/ClickHouse/ClickHouse/pull/50592) ([Kruglov Pavel](https://github.com/Avogar)).
* 结构推断遵循 `input_format_null_as_default` 设置。 [#50602](https://github.com/ClickHouse/ClickHouse/pull/50602) ([Kruglov Pavel](https://github.com/Avogar)).
* 允许通过 `input_format_csv_skip_trailing_empty_lines`、`input_format_tsv_skip_trailing_empty_lines` 和 `input_format_custom_skip_trailing_empty_lines` 设置，在 CSV/TSV/CustomSeparated 格式中跳过末尾空行（默认禁用）。关闭 [#49315](https://github.com/ClickHouse/ClickHouse/issues/49315)。 [#50635](https://github.com/ClickHouse/ClickHouse/pull/50635) ([Kruglov Pavel](https://github.com/Avogar)).
* “toDateOrDefault|OrNull” 和 “accuateCast\[OrDefault|OrNull]” 函数现在能正确解析数值参数。 [#50709](https://github.com/ClickHouse/ClickHouse/pull/50709) ([Dmitry Kardymon](https://github.com/kardymonds)).
* 支持使用空格或 `\t` 作为字段分隔符的 CSV，这些分隔符也受 Spark 支持。 [#50712](https://github.com/ClickHouse/ClickHouse/pull/50712) ([KevinyhZou](https://github.com/KevinyhZou)).
* `number_of_mutations_to_delay` 和 `number_of_mutations_to_throw` 设置现在默认启用，值分别为 500 和 1000。 [#50726](https://github.com/ClickHouse/ClickHouse/pull/50726) ([Anton Popov](https://github.com/CurtizJ)).
* 仪表盘正确显示缺失值。关闭 [#50831](https://github.com/ClickHouse/ClickHouse/issues/50831)。 [#50832](https://github.com/ClickHouse/ClickHouse/pull/50832) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* `parseDateTimeBestEffort*` 和 `parseDateTime64BestEffort*` 函数支持使用 syslog 时间戳格式的日期时间参数。 [#50925](https://github.com/ClickHouse/ClickHouse/pull/50925) ([Victor Krasnov](https://github.com/sirvickr)).
* clickhouse-client 的命令行参数 “--password” 现在只能指定一次。 [#50966](https://github.com/ClickHouse/ClickHouse/pull/50966) ([Alexey Gerasimchuck](https://github.com/Demilivor)).
* 集群备份时使用 `system.parts` 中的 `hash_of_all_files` 检查数据片段是否相同。 [#50997](https://github.com/ClickHouse/ClickHouse/pull/50997) ([Vitaly Baranov](https://github.com/vitlibar)).
* 系统表 zookeeper\_connection 的 connected\_time 表示连接建立的时间（标准格式）；新增 session\_uptime\_elapsed\_seconds，表示已建立连接会话的持续时间（秒）。 [#51026](https://github.com/ClickHouse/ClickHouse/pull/51026) ([郭小龙](https://github.com/guoxiaolongzte)).
* 使用源数据分块大小，并在各线程中增量计算总大小，改进 file/s3/hdfs/url 表函数的进度条。修复 \*Cluster 函数的进度条。关闭 [#47250](https://github.com/ClickHouse/ClickHouse/issues/47250)。 [#51088](https://github.com/ClickHouse/ClickHouse/pull/51088) ([Kruglov Pavel](https://github.com/Avogar)).
* 为 TCP 协议的 Progress 数据包新增 total\_bytes\_to\_read，以改善进度条。 [#51158](https://github.com/ClickHouse/ClickHouse/pull/51158) ([Kruglov Pavel](https://github.com/Avogar)).
* 改进对具有文件系统缓存的磁盘上的数据片段检查。 [#51164](https://github.com/ClickHouse/ClickHouse/pull/51164) ([Anton Popov](https://github.com/CurtizJ)).
* 修复文件系统缓存中 current\_elements\_num 有时不正确的问题。 [#51242](https://github.com/ClickHouse/ClickHouse/pull/51242) ([Kseniia Sumarokova](https://github.com/kssenii)).

<h4 id="buildtestingpackaging-improvement-6">
  构建、测试与打包改进
</h4>

* 将内置 keeper-client 加入独立 Keeper 二进制文件。 [#50964](https://github.com/ClickHouse/ClickHouse/pull/50964) ([pufit](https://github.com/pufit)).
* 现在使用当前版本的 LZ4。 [#50621](https://github.com/ClickHouse/ClickHouse/pull/50621) ([Nikita Taranov](https://github.com/nickitat)).
* ClickHouse 服务器遇到致命错误时会打印已修改设置的列表。关闭 [#51137](https://github.com/ClickHouse/ClickHouse/issues/51137)。 [#51138](https://github.com/ClickHouse/ClickHouse/pull/51138) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 允许使用 clang-17 构建 ClickHouse。 [#51300](https://github.com/ClickHouse/ClickHouse/pull/51300) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 由 [SQLancer](https://github.com/sqlancer/sqlancer) 触发的缺陷已修复，因此该检查被视为稳定检查。现在 SQLancer 检查失败将报告为检查状态失败。 [#51340](https://github.com/ClickHouse/ClickHouse/pull/51340) ([Ilya Yatsishin](https://github.com/qoega)).
* 将 Dockerfile 中巨大的 `RUN` 拆分为更小的条件式步骤；在同一 `RUN` 层中按需安装必要工具，随后移除。仅在开头升级一次操作系统，使用现代方式检查签名软件仓库。将基础镜像降为 ubuntu:20.04，以解决旧版 Docker 上的问题；升级 Go 版本以解决 Go 漏洞。 [#51504](https://github.com/ClickHouse/ClickHouse/pull/51504) ([Mikhail f. Shiryaev](https://github.com/Felixoid)).

<h4 id="bug-fix-user-visible-misbehavior-in-an-official-stable-release-6">
  缺陷修复（正式稳定版本中用户可见的异常行为）
</h4>

* 正确报告可执行字典的加载状态。 [#48775](https://github.com/ClickHouse/ClickHouse/pull/48775) ([Anton Kozlov](https://github.com/tonickkozlov)).
* 正确对数据跳过索引和投影执行变更操作。 [#50104](https://github.com/ClickHouse/ClickHouse/pull/50104) ([Amos Bird](https://github.com/amosbird)).
* 清理正在移动的数据片段。 [#50489](https://github.com/ClickHouse/ClickHouse/pull/50489) ([vdimir](https://github.com/vdimir)).
* 修复聚合函数中 IP 类型哈希的向后兼容性。 [#50551](https://github.com/ClickHouse/ClickHouse/pull/50551) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* 修复 Log 系列表在 TRUNCATE 后返回错误行数的问题。 [#50585](https://github.com/ClickHouse/ClickHouse/pull/50585) ([flynn](https://github.com/ucasfl)).
* 修复 `uniqExact` 并行合并中的缺陷。 [#50590](https://github.com/ClickHouse/ClickHouse/pull/50590) ([Nikita Taranov](https://github.com/nickitat)).
* 回退近期 grace hash join 的变更。 [#50699](https://github.com/ClickHouse/ClickHouse/pull/50699) ([vdimir](https://github.com/vdimir)).
* 查询缓存：尝试修复从 `ColumnConst` 到 `ColumnVector<char8_t>` 的错误类型转换。 [#50704](https://github.com/ClickHouse/ClickHouse/pull/50704) ([Robert Schulze](https://github.com/rschu1ze)).
* 避免在 Keeper 中存储包含未知操作的日志。 [#50751](https://github.com/ClickHouse/ClickHouse/pull/50751) ([Antonio Andelic](https://github.com/antonio2368)).
* SummingMergeTree 支持 DateTime64。 [#50797](https://github.com/ClickHouse/ClickHouse/pull/50797) ([Jordi Villar](https://github.com/jrdi)).
* 为非常量时区新增兼容性设置。 [#50834](https://github.com/ClickHouse/ClickHouse/pull/50834) ([Robert Schulze](https://github.com/rschu1ze)).
* 修复缓存条目中 LDAP 参数的哈希计算。 [#50865](https://github.com/ClickHouse/ClickHouse/pull/50865) ([Julian Maicher](https://github.com/jmaicher)).
* Parquet 格式遇到相关情况时，退回到从 String 解析大整数，而非抛出异常。 [#50873](https://github.com/ClickHouse/ClickHouse/pull/50873) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复写入备份时过于频繁地检查锁文件的问题。 [#50889](https://github.com/ClickHouse/ClickHouse/pull/50889) ([Vitaly Baranov](https://github.com/vitlibar)).
* 启用顺序读取时不应用投影。 [#50923](https://github.com/ClickHouse/ClickHouse/pull/50923) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复 Azure Blob Storage 迭代器中的竞态条件。 [#50936](https://github.com/ClickHouse/ClickHouse/pull/50936) ([SmitaRKulkarni](https://github.com/SmitaRKulkarni)).
* 修复 `CreatingSets` 中错误的 `sort_description` 传播。 [#50955](https://github.com/ClickHouse/ClickHouse/pull/50955) ([Nikita Taranov](https://github.com/nickitat)).
* 修复 Iceberg v2 可选元数据的解析。 [#50974](https://github.com/ClickHouse/ClickHouse/pull/50974) ([Kseniia Sumarokova](https://github.com/kssenii)).
* MaterializedMySQL：为空的表覆盖配置保留括号。 [#50977](https://github.com/ClickHouse/ClickHouse/pull/50977) ([Val Doroshchuk](https://github.com/valbok)).
* 修复 BackupCoordinationStageSync::setError() 中的崩溃。 [#51012](https://github.com/ClickHouse/ClickHouse/pull/51012) ([Vitaly Baranov](https://github.com/vitlibar)).
* 修复 ColumnLowCardinality 字典写时复制机制中的隐蔽问题。 [#51064](https://github.com/ClickHouse/ClickHouse/pull/51064) ([Michael Kolupaev](https://github.com/al13n321)).
* 生成安全的初始化向量（IV）。 [#51086](https://github.com/ClickHouse/ClickHouse/pull/51086) ([Salvatore Mesoraca](https://github.com/aiven-sal)).
* 修复带子查询的 SELECT 查询缓存无效的问题。 [#51132](https://github.com/ClickHouse/ClickHouse/pull/51132) ([Robert Schulze](https://github.com/rschu1ze)).
* 修复 Set 索引对常量可空比较的处理。 [#51205](https://github.com/ClickHouse/ClickHouse/pull/51205) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复 s3 和 s3Cluster 函数中的崩溃。 [#51209](https://github.com/ClickHouse/ClickHouse/pull/51209) ([Nikolay Degterinsky](https://github.com/evillique)).
* 修复编译表达式中的崩溃。 [#51231](https://github.com/ClickHouse/ClickHouse/pull/51231) ([LiuNeng](https://github.com/liuneng1994)).
* 修复切换 URL 时 StorageURL 中的释放后使用问题。 [#51260](https://github.com/ClickHouse/ClickHouse/pull/51260) ([Michael Kolupaev](https://github.com/al13n321)).
* 更新参数化视图的检查。 [#51272](https://github.com/ClickHouse/ClickHouse/pull/51272) ([SmitaRKulkarni](https://github.com/SmitaRKulkarni)).
* 修复将同一文件多次写入备份的问题。 [#51299](https://github.com/ClickHouse/ClickHouse/pull/51299) ([Vitaly Baranov](https://github.com/vitlibar)).
* 修复 ActionsDAG 中的模糊测试失败。 [#51301](https://github.com/ClickHouse/ClickHouse/pull/51301) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 移除 `transform` 函数中的无用内容。 [#51350](https://github.com/ClickHouse/ClickHouse/pull/51350) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
