<h3 id="a-id2210a-clickhouse-release-2210-2022-10-25">
  <a id="2210" /> ClickHouse 22.10 版本, 2022-10-25. [演示文稿](https://presentations.clickhouse.com/2022-release-22.10/), [视频](https://www.youtube.com/watch?v=sz9SES5-mdc)
</h3>

<Frame>
  <iframe src="https://www.youtube.com/embed/sz9SES5-mdc" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
</Frame>

<h4 id="backward-incompatible-change-1">
  向后不兼容变更
</h4>

* 重命名缓存命令：`show caches` -> `show filesystem caches`，`describe cache` -> `describe filesystem cache`。[#41508](https://github.com/ClickHouse/ClickHouse/pull/41508)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 移除 `LIVE VIEW` 对 `WITH TIMEOUT` 子句的支持。关闭 [#40557](https://github.com/ClickHouse/ClickHouse/issues/40557)。[#42173](https://github.com/ClickHouse/ClickHouse/pull/42173)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 移除客户端提示符对 `{database}` 宏的支持。未指定数据库时，它会显示错误，执行 `USE` 后也不会更新。关闭 [#25891](https://github.com/ClickHouse/ClickHouse/issues/25891)。[#42508](https://github.com/ClickHouse/ClickHouse/pull/42508)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。

<h4 id="new-feature-2">
  新功能
</h4>

* 新增可组合的协议配置。现在可以为不同协议设置不同的监听主机。PROXYv1 等协议包装层可以配置在其他协议之上（TCP、安全 TCP、MySQL、Postgres）。[#41198](https://github.com/ClickHouse/ClickHouse/pull/41198)（[Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)）。
* 新增 `S3` 备份目标类型。支持按原样路径/数据结构执行 BACKUP 到 S3。[#42333](https://github.com/ClickHouse/ClickHouse/pull/42333)（[Vitaly Baranov](https://github.com/vitlibar)）、[#42232](https://github.com/ClickHouse/ClickHouse/pull/42232)（[Azat Khuzhin](https://github.com/azat)）。
* 新增函数 `randUniform`、`randNormal`、`randLogNormal`、`randExponential`、`randChiSquared`、`randStudentT`、`randFisherF`、`randBernoulli`、`randBinomial`、`randNegativeBinomial`、`randPoisson`，按指定分布生成随机值。关闭 [#21834](https://github.com/ClickHouse/ClickHouse/issues/21834)。[#42411](https://github.com/ClickHouse/ClickHouse/pull/42411)（[Nikita Mikhaylov](https://github.com/nikitamikhaylov)）。
* ClickHouse Keeper 改进：支持上传快照至 S3，可在 `keeper_server.s3_snapshot` 中定义 S3 信息。[#41342](https://github.com/ClickHouse/ClickHouse/pull/41342)（[Antonio Andelic](https://github.com/antonio2368)）。
* 新增聚合函数 `analysisOfVariance`（`anova`），对多组服从正态分布的观测值执行统计检验，判断各组均值是否相同。原始 PR 为 [#37872](https://github.com/ClickHouse/ClickHouse/issues/37872)。[#42131](https://github.com/ClickHouse/ClickHouse/pull/42131)（[Nikita Mikhaylov](https://github.com/nikitamikhaylov)）。
* 支持通过 `max_temporary_data_on_disk_size_for_user`/`max_temporary_data_on_disk_size_for_query` 限制存储在磁盘上的临时数据。[#40893](https://github.com/ClickHouse/ClickHouse/pull/40893)（[Vladimir C](https://github.com/vdimir)）。
* 新增 `format_json_object_each_row_column_for_object_name` 设置，在 JSONObjectEachRow 格式中将对象名称写入/解析为列值。[#41703](https://github.com/ClickHouse/ClickHouse/pull/41703)（[Kruglov Pavel](https://github.com/Avogar)）。
* 为 SQL 新增 BLAKE3 哈希函数。[#33435](https://github.com/ClickHouse/ClickHouse/pull/33435)（[BoloniniD](https://github.com/BoloniniD)）。
* 将 `javaHash` 函数扩展至整数。[#41131](https://github.com/ClickHouse/ClickHouse/pull/41131)（[JackyWoo](https://github.com/JackyWoo)）。
* 为 ON CLUSTER DDL 添加 OpenTelemetry 支持（要求将 `distributed_ddl_entry_format_version` 设为 4）。[#41484](https://github.com/ClickHouse/ClickHouse/pull/41484)（[Frank Chen](https://github.com/FrankChen021)）。
* 新增系统表 `asynchronous_insert_log`，包含异步插入信息（包括即发即弃模式，即 `wait_for_async_insert=0` 下的查询结果），以改善自省能力。[#42040](https://github.com/ClickHouse/ClickHouse/pull/42040)（[Anton Popov](https://github.com/CurtizJ)）。
* 支持 HTTP `Accept-Encoding` 中的 `lz4`、`bz2`、`snappy` 方法，属于 HTTP 协议的非标准扩展。[#42071](https://github.com/ClickHouse/ClickHouse/pull/42071)（[Nikolay Degterinsky](https://github.com/evillique)）。
* 新增 Morton 编码（Z 曲线）编码/解码函数。[#41753](https://github.com/ClickHouse/ClickHouse/pull/41753)（[Constantine Peresypkin](https://github.com/pkit)）。
* 新增 `SET setting_name = DEFAULT` 支持。[#42187](https://github.com/ClickHouse/ClickHouse/pull/42187)（[Filatenkov Artur](https://github.com/FArthur-cmd)）。

<h4 id="experimental-feature-2">
  实验性功能
</h4>

* 新增由 `allow_experimental_analyzer` 设置控制的查询分析与规划基础设施。[#31796](https://github.com/ClickHouse/ClickHouse/pull/31796)（[Maksim Kita](https://github.com/kitaisreal)）。
* Kusto Query Language 的初始实现。请勿使用。[#37961](https://github.com/ClickHouse/ClickHouse/pull/37961)（[Yong Wang](https://github.com/kashwy)）。

<h4 id="performance-improvement-2">
  性能改进
</h4>

* 放宽 “Too many parts” 阈值。关闭 [#6551](https://github.com/ClickHouse/ClickHouse/issues/6551)。现在，如果平均数据片段足够大（至少 10 GiB），ClickHouse 将允许分区包含更多数据片段。借助磁盘柜或对象存储，可以在单台服务器上单张表的单个分区内存储 PB 级数据。[#42002](https://github.com/ClickHouse/ClickHouse/pull/42002)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 实现运算符优先级元素解析器，降低所需栈大小。[#34892](https://github.com/ClickHouse/ClickHouse/pull/34892)（[Nikolay Degterinsky](https://github.com/evillique)）。
* 有序 DISTINCT 优化利用数据流的排序属性。在适用时，此改进会为 DISTINCT 启用有序读取（此前必须为 DISTINCT 列显式提供 ORDER BY）。[#41014](https://github.com/ClickHouse/ClickHouse/pull/41014)（[Igor Nikonov](https://github.com/devcrafter)）。
* ColumnVector：使用 AVX512VBMI 优化 UInt8 索引。[#41247](https://github.com/ClickHouse/ClickHouse/pull/41247)（[Guo Wangyang](https://github.com/guowangy)）。
* 优化 `ThreadGroupStatus::mutex` 的锁竞争。在 ICX 设备（Intel Xeon Platinum 8380 CPU，80 核、160 线程）上的 **SSB**（星型模式基准测试）性能实验表明，此变更可将所有子测试 QPS 的几何平均值提升至 **2.95 倍**。[#41675](https://github.com/ClickHouse/ClickHouse/pull/41675)（[Zhiguo Zhou](https://github.com/ZhiguoZh)）。
* 为 AArch64 构建添加 `ldapr` 能力。Graviton 2 及更新型号、Azure 和 GCP 实例支持此能力。该能力直到 clang-15 才出现 [not so long ago](https://github.com/llvm/llvm-project/commit/9609b5daffe9fd28d83d83da895abc5113f76c24)。[#41778](https://github.com/ClickHouse/ClickHouse/pull/41778)（[Daniel Kutenin](https://github.com/danlark1)）。
* 比较字符串且其中一个参数为空常量字符串时，提升性能。[#41870](https://github.com/ClickHouse/ClickHouse/pull/41870)（[Jiebin Sun](https://github.com/jiebinn)）。
* 优化 ColumnAggregateFunction 的 `insertFrom`，在某些情况下共享聚合状态。[#41960](https://github.com/ClickHouse/ClickHouse/pull/41960)（[flynn](https://github.com/ucasfl)）。
* 加快写入 `azure_blob_storage` 磁盘：遵循 `max_single_part_upload_size`，而不是每到一个缓冲区大小就写入一个数据块。性能低效问题见 [#41754](https://github.com/ClickHouse/ClickHouse/issues/41754)。[#42041](https://github.com/ClickHouse/ClickHouse/pull/42041)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 使进程列表和 query\_log 中的线程 ID 唯一，避免浪费。[#42180](https://github.com/ClickHouse/ClickHouse/pull/42180)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 如果请求读取范围超过缓存设置 `bypass_cache_threashold` 定义的阈值，支持完全绕过缓存（既不下载到缓存，也不读取已缓存数据）；需要通过 `enable_bypass_cache_with_threshold` 启用。[#42418](https://github.com/ClickHouse/ClickHouse/pull/42418)（[Han Shukai](https://github.com/KinderRiven)）。这有助于改善本地磁盘较慢时的性能。

<h4 id="improvement-2">
  改进
</h4>

* 新增 `allow_implicit_no_password` 设置，与 `allow_no_password` 配合使用时，除非显式指定 `IDENTIFIED WITH no_password`，否则禁止创建无密码用户。[#41341](https://github.com/ClickHouse/ClickHouse/pull/41341)（[Nikolay Degterinsky](https://github.com/evillique)）。
* 内嵌 Keeper 始终在后台启动，允许 ClickHouse 在未达到法定多数时启动。[#40991](https://github.com/ClickHouse/ClickHouse/pull/40991)（[Antonio Andelic](https://github.com/antonio2368)）。
* 提高旧 ZooKeeper 连接过期后重新建立连接的响应速度。此前默认每分钟运行一次任务，因此表可能在约一分钟内保持只读。[#41092](https://github.com/ClickHouse/ClickHouse/pull/41092)（[Nikita Mikhaylov](https://github.com/nikitamikhaylov)）。
* 现在可以将投影与零拷贝复制一起使用（零拷贝复制并非生产可用功能）。[#41147](https://github.com/ClickHouse/ClickHouse/pull/41147)（[alesapin](https://github.com/alesapin)）。
* 支持子查询中的 `(EXPLAIN SELECT ...)` 表达式。`SELECT * FROM (EXPLAIN PIPELINE SELECT col FROM TABLE ORDER BY col)` 这类查询现在有效。[#40630](https://github.com/ClickHouse/ClickHouse/pull/40630)（[Vladimir C](https://github.com/vdimir)）。
* 允许在查询范围内更改 `async_insert_max_data_size` 或 `async_insert_busy_timeout_ms`。例如，用户插入数据频率较低，但无权访问服务器配置来调整默认值。[#40668](https://github.com/ClickHouse/ClickHouse/pull/40668)（[Nikita Mikhaylov](https://github.com/nikitamikhaylov)）。
* 改进远程文件系统读取，使读写线程池大小可配置。关闭 [#41070](https://github.com/ClickHouse/ClickHouse/issues/41070)。[#41011](https://github.com/ClickHouse/ClickHouse/pull/41011)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 在 WindowTransform/arratReduce\*/initializeAggregation/聚合函数版本处理机制中支持所有组合器组合。此前 `ForEach/Resample/Map` 等组合器无法用于这些位置，会导致 `State function ... inserts results into non-state column` 等异常。[#41107](https://github.com/ClickHouse/ClickHouse/pull/41107)（[Kruglov Pavel](https://github.com/Avogar)）。
* 新增 `tryDecrypt` 函数，在解密失败时（例如密钥不正确）返回 NULL，而不是抛出异常。[#41206](https://github.com/ClickHouse/ClickHouse/pull/41206)（[Duc Canh Le](https://github.com/canhld94)）。
* 为 `system.disks` 表新增 `unreserved_space` 列，用于检查每个磁盘尚未被预留占用的空间。[#41254](https://github.com/ClickHouse/ClickHouse/pull/41254)（[filimonov](https://github.com/filimonov)）。
* 支持在表函数参数中使用 S3 授权标头。[#41261](https://github.com/ClickHouse/ClickHouse/pull/41261)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 在 Keeper 和内部 ZooKeeper 客户端中支持 MultiRead（这是 ZooKeeper 协议扩展，仅在 ClickHouse Keeper 中可用）。[#41410](https://github.com/ClickHouse/ClickHouse/pull/41410)（[Antonio Andelic](https://github.com/antonio2368)）。
* 支持在 IN 运算符中比较十进制类型与浮点字面量。[#41544](https://github.com/ClickHouse/ClickHouse/pull/41544)（[liang.huang](https://github.com/lhuang09287750)）。
* 允许在缓存配置中使用易读的大小值（如 `1TB`）。[#41688](https://github.com/ClickHouse/ClickHouse/pull/41688)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 在缓存异步更新前，ClickHouse 可能缓存过期的 DNS 条目一段时间（默认 15 秒），期间仍可能尝试建立连接并产生错误。现已修复此行为。[#41707](https://github.com/ClickHouse/ClickHouse/pull/41707)（[Nikita Mikhaylov](https://github.com/nikitamikhaylov)）。
* 为 `clickhouse-client`/`clickhouse-local` 添加使用类 fzf 工具（fzf/sk）的交互式历史搜索。注意，可通过 `FZF_DEFAULT_OPTS`/`SKIM_DEFAULT_OPTIONS` 进一步配置行为。[#41730](https://github.com/ClickHouse/ClickHouse/pull/41730)（[Azat Khuzhin](https://github.com/azat)）。
* 客户端连接到证书无效的安全服务器时，只有提供 '--accept-certificate' 标志才能继续。[#41743](https://github.com/ClickHouse/ClickHouse/pull/41743)（[Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)）。
* 新增 `tryBase58Decode` 函数，类似于现有 `tryBase64Decode`。[#41824](https://github.com/ClickHouse/ClickHouse/pull/41824)（[Robert Schulze](https://github.com/rschu1ze)）。
* 改善使用不同主键替换分区时的反馈。修复 [#34798](https://github.com/ClickHouse/ClickHouse/issues/34798)。[#41838](https://github.com/ClickHouse/ClickHouse/pull/41838)（[Salvatore](https://github.com/tbsal)）。
* 修复并行解析：分段器现在检查 `max_block_size`，修复并行解析配合较小 LIMIT 时内存分配过多的问题。[#41852](https://github.com/ClickHouse/ClickHouse/pull/41852)（[Vitaly Baranov](https://github.com/vitlibar)）。
* 如果 SELECT 系统表期间发生且已忽略 “TABLE\_IS\_DROPPED” 异常，则不将其加入 `system.errors`。[#41908](https://github.com/ClickHouse/ClickHouse/pull/41908)（[AlfVII](https://github.com/AlfVII)）。
* 改进 `enable_extended_results_for_datetime_functions` 选项，使 `toStartOfDay`、`toStartOfHour`、`toStartOfFifteenMinutes`、`toStartOfTenMinutes`、`toStartOfFiveMinutes`、`toStartOfMinute` 和 `timeSlot` 返回 DateTime64 类型结果。[#41910](https://github.com/ClickHouse/ClickHouse/pull/41910)（[Roman Vasin](https://github.com/rvasin)）。
* 改进文本格式的 `DateTime` 类型推断，现在遵循 `date_time_input_format` 设置，不再尝试将数字视为时间戳来推断日期时间。关闭 [#41389](https://github.com/ClickHouse/ClickHouse/issues/41389)。关闭 [#42206](https://github.com/ClickHouse/ClickHouse/issues/42206)。[#41912](https://github.com/ClickHouse/ClickHouse/pull/41912)（[Kruglov Pavel](https://github.com/Avogar)）。
* 移除 `perform_ttl_move_on_insert` = false 时插入数据产生的令人困惑的警告。[#41980](https://github.com/ClickHouse/ClickHouse/pull/41980)（[Vitaly Baranov](https://github.com/vitlibar)）。
* 允许用户像使用 `count(*)` 一样编写 `countState(*)`。关闭 [#9338](https://github.com/ClickHouse/ClickHouse/issues/9338)。[#41983](https://github.com/ClickHouse/ClickHouse/pull/41983)（[Amos Bird](https://github.com/amosbird)）。
* 修复 `rankCorr` 大小溢出。[#42020](https://github.com/ClickHouse/ClickHouse/pull/42020)（[Duc Canh Le](https://github.com/canhld94)）。
* 新增选项，允许在 Sentry 配置中指定任意字符串作为环境名，以便更方便地查看报告。[#42037](https://github.com/ClickHouse/ClickHouse/pull/42037)（[Nikita Mikhaylov](https://github.com/nikitamikhaylov)）。
* 修复从 CSV 解析超范围 Date 的问题。[#42044](https://github.com/ClickHouse/ClickHouse/pull/42044)（[Andrey Zvonov](https://github.com/zvonand)）。
* `parseDataTimeBestEffort` 现在支持日期与时间之间使用逗号。关闭 [#42038](https://github.com/ClickHouse/ClickHouse/issues/42038)。[#42049](https://github.com/ClickHouse/ClickHouse/pull/42049)（[flynn](https://github.com/ucasfl)）。
* 改进 `ReplicatedMergeTree` 过期副本的恢复过程。如果失联副本拥有健康副本上尚不存在的数据片段，但根据健康副本复制队列，这些片段将来会出现，则失联副本会保留它们，而不是分离。[#42134](https://github.com/ClickHouse/ClickHouse/pull/42134)（[Alexander Tokmakov](https://github.com/tavplubix)）。
* 允许 date\_diff 函数使用 `Date32` 参数。修复 date\_diff 使用 DateTime64 参数，且开始日期在 Unix 纪元之前、结束日期在纪元之后时的问题。[#42308](https://github.com/ClickHouse/ClickHouse/pull/42308)（[Roman Vasin](https://github.com/rvasin)）。
* 向 Minio 上传大型数据片段时，“Complete Multipart Upload” 可能耗时很长。Minio 每 10 秒发送心跳（参见 [https://github.com/minio/minio/pull/7198](https://github.com/minio/minio/pull/7198)），但 ClickHouse 会更早超时，因为默认发送/接收超时 [set](https://github.com/ClickHouse/ClickHouse/blob/cc24fcd6d5dfb67f5f66f5483e986bd1010ad9cf/src/IO/S3/PocoHTTPClient.cpp#L123) 为 5 秒。[#42321](https://github.com/ClickHouse/ClickHouse/pull/42321)（[filimonov](https://github.com/filimonov)）。
* 修复对包含 Decimal 等复杂类型的聚合状态类型进行转换时，罕见的无效转换。修复 [#42408](https://github.com/ClickHouse/ClickHouse/issues/42408)。[#42417](https://github.com/ClickHouse/ClickHouse/pull/42417)（[Amos Bird](https://github.com/amosbird)）。
* 允许 `dateName` 函数使用 `Date32` 参数。[#42554](https://github.com/ClickHouse/ClickHouse/pull/42554)（[Roman Vasin](https://github.com/rvasin)）。
* 现在索引分析会使用包含 NULL 字面量的筛选条件。[#34063](https://github.com/ClickHouse/ClickHouse/issues/34063)。[#41842](https://github.com/ClickHouse/ClickHouse/pull/41842)（[Amos Bird](https://github.com/amosbird)）。
* 如果范围内每个数据片段的年龄都超过指定阈值，则进行合并。可通过 `min_age_to_force_merge_seconds` 设置阈值。关闭 [#35836](https://github.com/ClickHouse/ClickHouse/issues/35836)。[#42423](https://github.com/ClickHouse/ClickHouse/pull/42423)（[Antonio Andelic](https://github.com/antonio2368)）。这是 [#39550i](https://github.com/ClickHouse/ClickHouse/pull/39550) 的后续工作；[@fastio](https://github.com/fastio) 已实现大部分逻辑。
* 新增由 `allow_experimental_analyzer` 设置控制的查询分析与规划基础设施。[#31796](https://github.com/ClickHouse/ClickHouse/pull/31796)（[Maksim Kita](https://github.com/kitaisreal)）。
* 缩短失去 Keeper 连接后的恢复时间。[#42541](https://github.com/ClickHouse/ClickHouse/pull/42541)（[Raúl Marín](https://github.com/Algunenano)）。

<h4 id="buildtestingpackaging-improvement-2">
  构建/测试/打包改进
</h4>

* 新增表定义模糊测试器。[#40096](https://github.com/ClickHouse/ClickHouse/pull/40096)（[Anton Popov](https://github.com/CurtizJ)）。这是今年迄今 ClickHouse 测试方面最大的进展。
* ClickHouse Cloud 服务发布 Beta 版本：[https://console.clickhouse.cloud/](https://console.clickhouse.cloud/)。它提供使用 ClickHouse 最简便的方式，甚至比单命令安装略微更简单。
* 为 AST 模糊测试器添加 WHERE 子句生成支持，并允许添加或移除 ORDER BY 和 WHERE 子句。[#38519](https://github.com/ClickHouse/ClickHouse/pull/38519)（[Ilya Yatsishin](https://github.com/qoega)）。
* AArch64 二进制文件现在至少要求 2016 年发布的 ARMv8.2，尤其因此可使用 ARM LSE，即原生原子操作。同时新增 CMake 构建选项 “NO\_ARMV81\_OR\_HIGHER”，允许为 Raspberry Pi 4 等旧 ARMv8.0 硬件编译。[#41610](https://github.com/ClickHouse/ClickHouse/pull/41610)（[Robert Schulze](https://github.com/rschu1ze)）。
* 允许使用 Musl 构建 ClickHouse（在此前已支持但后来失效的基础上做小幅修正）。[#41987](https://github.com/ClickHouse/ClickHouse/pull/41987)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 新增对 `$CLICKHOUSE_CRONFILE` 文件的检查，避免安装时运行 `sed` 命令后才发现文件不存在。[#42081](https://github.com/ClickHouse/ClickHouse/pull/42081)（[Chun-Sheng, Li](https://github.com/peter279k)）。
* 将 cctz 更新至 `2022e`，支持新的时区变化。巴勒斯坦现在于星期六 02:00 切换；将乌克兰三个时区简化为一个；约旦和叙利亚从带夏令时的 +02/+03 改为全年 +03。（[https://data.iana.org/time-zones/tzdb/NEWS](https://data.iana.org/time-zones/tzdb/NEWS)）。关闭 [#42252](https://github.com/ClickHouse/ClickHouse/issues/42252)。[#42327](https://github.com/ClickHouse/ClickHouse/pull/42327)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。[#42273](https://github.com/ClickHouse/ClickHouse/pull/42273)（[Dom Del Nano](https://github.com/ddelnano)）。
* 以 BLAKE3 哈希函数库为例，为 ClickHouse 添加 Rust 代码支持。[#33435](https://github.com/ClickHouse/ClickHouse/pull/33435)（[BoloniniD](https://github.com/BoloniniD)）。

<h4 id="bug-fix-user-visible-misbehavior-in-official-stable-or-prestable-release-2">
  错误修复 (user-visible misbehavior in official stable or prestable release)
</h4>

* 为大整数类型的 `LowCardinality` 选择正确的聚合方法。[#42342](https://github.com/ClickHouse/ClickHouse/pull/42342)（[Duc Canh Le](https://github.com/canhld94)）。
* `web` 磁盘的多项修复。[#41652](https://github.com/ClickHouse/ClickHouse/pull/41652)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复配置中没有 `https_port` 时 docker run 失败的问题。[#41693](https://github.com/ClickHouse/ClickHouse/pull/41693)（[Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)）。
* 修复服务器关闭或执行 `SYSTEM STOP MERGES` 时未正确取消变更操作、导致取消耗时很长的问题。[#41699](https://github.com/ClickHouse/ClickHouse/pull/41699)（[Alexander Tokmakov](https://github.com/tavplubix)）。
* 修复按排序键前缀列经单调函数包装后执行 `ORDER BY` 或 `GROUP BY`，且启用有序读取优化（`optimize_read_in_order` 和 `optimize_aggregation_in_order`）时的错误结果。[#41701](https://github.com/ClickHouse/ClickHouse/pull/41701)（[Anton Popov](https://github.com/CurtizJ)）。
* 修复启用 `optimize_monotonous_functions_in_order_by` 时，从 `Merge` 表执行 `SELECT` 可能发生的崩溃。修复 [#41269](https://github.com/ClickHouse/ClickHouse/issues/41269)。[#41740](https://github.com/ClickHouse/ClickHouse/pull/41740)（[Nikolai Kochetov](https://github.com/KochetovNicolai)）。
* 修复将某个数据片段作为损坏片段分离后立即重启副本，在极少数情况下可能出现的 “Part ... intersects part ...” 错误。[#41741](https://github.com/ClickHouse/ClickHouse/pull/41741)（[Alexander Tokmakov](https://github.com/tavplubix)）。
* 禁止创建或修改包含 `_row_exists` 列名的 MergeTree 表，此名称为轻量删除保留。修复 [#41716](https://github.com/ClickHouse/ClickHouse/issues/41716)。[#41763](https://github.com/ClickHouse/ClickHouse/pull/41763)（[Jianmei Zhang](https://github.com/zhangjmruc)）。
* 修复部分 HTTP 响应缺少 CORS 标头的问题。[#41792](https://github.com/ClickHouse/ClickHouse/pull/41792)（[Frank Chen](https://github.com/FrankChen021)）。
* 修复 22.9 无法启动由 20.3 或更早版本创建且从未修改过的 `ReplicatedMergeTree` 表的问题。修复 [#41742](https://github.com/ClickHouse/ClickHouse/issues/41742)。[#41796](https://github.com/ClickHouse/ClickHouse/pull/41796)（[Alexander Tokmakov](https://github.com/tavplubix)）。
* 批量发送因某种原因失败后无法自动恢复；如果未及时处理，会导致积压，输出的错误消息越来越长，最终阻塞 HTTP 线程。[#41813](https://github.com/ClickHouse/ClickHouse/pull/41813)（[zhongyuankai](https://github.com/zhongyuankai)）。
* 修复紧凑数据片段使用压缩标记设置时的问题。修复 [#41783](https://github.com/ClickHouse/ClickHouse/issues/41783) 和 [#41746](https://github.com/ClickHouse/ClickHouse/issues/41746)。[#41823](https://github.com/ClickHouse/ClickHouse/pull/41823)（[alesapin](https://github.com/alesapin)）。
* 旧版 Replicated 数据库在 \[Zoo]Keeper 中没有特殊标记。我们只需检查节点是否包含某些难以解释的数据，而不是特殊标记。[#41875](https://github.com/ClickHouse/ClickHouse/pull/41875)（[Nikita Mikhaylov](https://github.com/nikitamikhaylov)）。
* 修复文件系统缓存中可能出现的异常。[#41884](https://github.com/ClickHouse/ClickHouse/pull/41884)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复 s3 表函数的 `use_environment_credentials`。[#41970](https://github.com/ClickHouse/ClickHouse/pull/41970)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复分离损坏数据片段时的 “Directory already exists and is not empty” 错误，该错误可能阻止 `ReplicatedMergeTree` 表启动复制。修复 [#40957](https://github.com/ClickHouse/ClickHouse/issues/40957)。[#41981](https://github.com/ClickHouse/ClickHouse/pull/41981)（[Alexander Tokmakov](https://github.com/tavplubix)）。
* `toDateTime64` 现在对负整数和对应浮点参数返回相同输出。[#42025](https://github.com/ClickHouse/ClickHouse/pull/42025)（[Robert Schulze](https://github.com/rschu1ze)）。
* 修复向 `azure_blob_storage` 写入的问题。部分关闭 [#41754](https://github.com/ClickHouse/ClickHouse/issues/41754)。[#42034](https://github.com/ClickHouse/ClickHouse/pull/42034)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复特定 `bzip2` 文件的 `bzip2` 解码问题。[#42046](https://github.com/ClickHouse/ClickHouse/pull/42046)（[Nikolay Degterinsky](https://github.com/evillique)）。
* 修复设置 “enable\_extended\_results\_for\_datetime\_functions = 1” 时，SQL 函数 `toLastDayOfMonth` 在扩展范围起点（1900 年 1 月）的行为。- 修复同一设置下 “toRelativeWeekNum()” 在扩展范围终点（2299 年 12 月）的行为。- 通过避免不必要的索引算术，提升 SQL 函数 “toISOYear()”、“toFirstDayNumOfISOYearIndex()” 和 “toYearWeekOfNewyearMode()” 的性能。[#42084](https://github.com/ClickHouse/ClickHouse/pull/42084)（[Roman Vasin](https://github.com/rvasin)）。
* 此前每张表的最大获取并发数意外设为 8，而线程池可能更大。现在表的最大获取并发数与线程池大小一致。[#42090](https://github.com/ClickHouse/ClickHouse/pull/42090)（[Nikita Mikhaylov](https://github.com/nikitamikhaylov)）。
* 修复尚未检查删除操作是否会破坏表间依赖关系，就已关闭表或分离字典的问题。修复 [#41982](https://github.com/ClickHouse/ClickHouse/issues/41982)。[#42106](https://github.com/ClickHouse/ClickHouse/pull/42106)（[Alexander Tokmakov](https://github.com/tavplubix)）。
* 修复 `remote_filesystem_read_method=read` 配合文件系统缓存时严重低效的问题。关闭 [#42125](https://github.com/ClickHouse/ClickHouse/issues/42125)。[#42129](https://github.com/ClickHouse/ClickHouse/pull/42129)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复 use\_hedged\_requests = 0 时分布式查询可能出现的超时异常。[#42130](https://github.com/ClickHouse/ClickHouse/pull/42130)（[Azat Khuzhin](https://github.com/azat)）。
* 修复 `runningDifference` 函数使用 `Date32` 类型时的小问题。此前使用 `Date`，可能导致 `Bad cast from type DB::ColumnVector<int> to DB::ColumnVector<unsigned short>'` 等逻辑错误。[#42143](https://github.com/ClickHouse/ClickHouse/pull/42143)（[Alfred Xu](https://github.com/sperlingxx)）。
* 修复复用基础备份中超过 4 GB 的文件的问题。[#42146](https://github.com/ClickHouse/ClickHouse/pull/42146)（[Azat Khuzhin](https://github.com/azat)）。
* 如果排序键第一列包含函数，有序 DISTINCT 会因 LOGICAL\_ERROR 失败。[#42186](https://github.com/ClickHouse/ClickHouse/pull/42186)（[Igor Nikonov](https://github.com/devcrafter)）。
* 修复投影与 `aggregate_functions_null_for_empty` 设置相关的错误。此问题非常罕见，仅在服务器配置中启用 `aggregate_functions_null_for_empty` 时出现。关闭 [#41647](https://github.com/ClickHouse/ClickHouse/issues/41647)。[#42198](https://github.com/ClickHouse/ClickHouse/pull/42198)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复从 `Buffer` 表按降序有序读取。[#42236](https://github.com/ClickHouse/ClickHouse/pull/42236)（[Duc Canh Le](https://github.com/canhld94)）。
* 修复默认配置档案设置了 `background_pool_size setting` 但未设置 `background_merges_mutations_concurrency_ratio` 时，ClickHouse 无法启动的问题。[#42315](https://github.com/ClickHouse/ClickHouse/pull/42315)（[nvartolomei](https://github.com/nvartolomei)）。
* 对已附加的数据片段执行 `ALTER UPDATE` 时，如果其列与表结构不同，可能在磁盘上生成无效的 `columns.txt` 元数据。读取该片段可能失败或返回无效数据。修复 [#42161](https://github.com/ClickHouse/ClickHouse/issues/42161)。[#42319](https://github.com/ClickHouse/ClickHouse/pull/42319)（[Nikolai Kochetov](https://github.com/KochetovNicolai)）。
* 修复 `additional_table_filters` 未应用于 `Distributed` 存储的问题。修复 [#41692](https://github.com/ClickHouse/ClickHouse/issues/41692)。[#42322](https://github.com/ClickHouse/ClickHouse/pull/42322)（[Nikolai Kochetov](https://github.com/KochetovNicolai)）。
* 修复查询完成/取消时的数据竞争。关闭 [#42346](https://github.com/ClickHouse/ClickHouse/issues/42346)。[#42362](https://github.com/ClickHouse/ClickHouse/pull/42362)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 回退导致日期/时间函数退化的 [#40217](https://github.com/ClickHouse/ClickHouse/issues/40217)。[#42367](https://github.com/ClickHouse/ClickHouse/pull/42367)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复连接条件为假时的类型转换断言，关闭 [#42380](https://github.com/ClickHouse/ClickHouse/issues/42380)。[#42407](https://github.com/ClickHouse/ClickHouse/pull/42407)（[Vladimir C](https://github.com/vdimir)）。
* 修复处理 Decimal 数据类型时的缓冲区溢出。关闭 [#42451](https://github.com/ClickHouse/ClickHouse/issues/42451)。[#42465](https://github.com/ClickHouse/ClickHouse/pull/42465)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* `AggregateFunctionQuantile` 现在正确支持 UInt128 列。此前分位数状态会将 `UInt128` 列解释为 `Int128`，可能导致错误结果。[#42473](https://github.com/ClickHouse/ClickHouse/pull/42473)（[Antonio Andelic](https://github.com/antonio2368)）。
* 修复向非 Float32 列上的 `Annoy` 索引插入时的 bad\_cast 断言。`Annoy` 索引是实验性功能。[#42485](https://github.com/ClickHouse/ClickHouse/pull/42485)（[Robert Schulze](https://github.com/rschu1ze)）。
* Date 或 DateTime 与 128 位或 256 位整数之间的算术运算会引用未初始化内存。[#42453](https://github.com/ClickHouse/ClickHouse/issues/42453)。[#42573](https://github.com/ClickHouse/ClickHouse/pull/42573)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复服务器升级时，分区键包含函数别名导致的意外表加载错误。[#36379](https://github.com/ClickHouse/ClickHouse/pull/36379)（[Amos Bird](https://github.com/amosbird)）。
