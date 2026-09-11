<h3 id="a-id2212a-clickhouse-release-2212-2022-12-15">
  <a id="2212" /> ClickHouse 22.12 版本, 2022-12-15. [演示文稿](https://presentations.clickhouse.com/2022-release-22.12/), [视频](https://www.youtube.com/watch?v=sREupr6uc2k)
</h3>

<Frame>
  <iframe src="https://www.youtube.com/embed/sREupr6uc2k" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
</Frame>

<Warning>
  This release contains a faulty systemd service comment that might break the ClickHouse installation on upgrade for some Linux distributions. The systemd service changes the directory owner permissions on `/run/systemd`, causing all subsequent systemd operations to fail. It is advised that you skip upgrading to this version and instead upgrade to a newer version of ClickHouse.

  Refer to this issue on GitHub for more details: [https://github.com/ClickHouse/ClickHouse/issues/48285](https://github.com/ClickHouse/ClickHouse/issues/48285)
</Warning>

<h4 id="upgrade-notes">
  升级说明
</h4>

* 修复带 `String` 参数的 `min`、`max`、`any*`、`argMin`、`argMax` 聚合函数状态序列化/反序列化的向后不兼容问题。受影响分支为 22.9、22.10、22.11（分别自 22.9.6、22.10.4、22.11.2 修复）。22.3、22.7、22.8 的部分小版本也受影响：22.3.13…22.3.14（自 22.3.15 修复）、22.8.6…22.8.9（自 22.8.10 修复）、22.7.6 及更新版本（22.7 不会修复，建议从 22.7.\* 升级至 22.8.10 或更新版本）。从未使用受影响版本的用户无需关注本条说明。不兼容版本在读取上述聚合函数状态时，会给字符串额外附加一个 `'\0'`。例如，旧版本将 `anyState('foobar')` 状态保存到 `state_column` 后，不兼容版本执行 `anyMerge(state_column)` 会输出 `'foobar\0'`。不兼容版本写入聚合函数状态时又不会保留尾随 `'\0'`。除一个边界情况外，含修复的新版本可以正确读取所有版本（包括不兼容版本）写入的数据：如果不兼容版本保存的状态中字符串本来就以空字符结尾，新版本读取该聚合函数状态时会去掉尾随 `'\0'`。例如，不兼容版本将 `anyState('abrac\0dabra\0')` 状态保存到 `state_column` 后，新版本执行 `anyMerge(state_column)` 会输出 `'abrac\0dabra'`。当不兼容版本与更旧或更新版本在同一集群运行时，该问题也影响分布式查询。[#43038](https://github.com/ClickHouse/ClickHouse/pull/43038)（[Alexander Tokmakov](https://github.com/tavplubix)、[Raúl Marín](https://github.com/Algunenano)）。注意：所有官方 ClickHouse 构建均已包含补丁；非官方第三方构建未必如此，应避免使用。

<h4 id="new-feature">
  新功能
</h4>

* 新增 `BSONEachRow` 输入/输出格式。在此格式中，ClickHouse 将每行格式化/解析为独立 BSON 文档，每列格式化/解析为一个 BSON 字段，以列名为键。[#42033](https://github.com/ClickHouse/ClickHouse/pull/42033)（[mark-polokhov](https://github.com/mark-polokhov)）。
* 新增 `grace_hash` JOIN 算法，可通过 `SET join_algorithm = 'grace_hash'` 启用。[#38191](https://github.com/ClickHouse/ClickHouse/pull/38191)（[BigRedEye](https://github.com/BigRedEye)、[Vladimir C](https://github.com/vdimir)）。
* 允许配置创建和修改用户时的密码复杂度规则与检查。[#43719](https://github.com/ClickHouse/ClickHouse/pull/43719)（[Nikolay Degterinsky](https://github.com/evillique)）。
* 遮蔽日志中的敏感信息，以及 `SHOW CREATE TABLE` 和 `SELECT FROM system.tables` 查询输出中的秘密内容。同时解决 [#41418](https://github.com/ClickHouse/ClickHouse/issues/41418)。[#43227](https://github.com/ClickHouse/ClickHouse/pull/43227)（[Vitaly Baranov](https://github.com/vitlibar)）。
* 新增 `GROUP BY ALL` 语法：[#37631](https://github.com/ClickHouse/ClickHouse/issues/37631)。[#42265](https://github.com/ClickHouse/ClickHouse/pull/42265)（[刘陶峰](https://github.com/taofengliu)）。
* 新增 `FROM table SELECT column` 语法。[#41095](https://github.com/ClickHouse/ClickHouse/pull/41095)（[Nikolay Degterinsky](https://github.com/evillique)）。
* 新增 `concatWithSeparator` 函数，并提供 `concat_ws` 别名以兼容 Spark SQL。新增变体 `concatWithSeparatorAssumeInjective`，类似 `concatAssumeInjective`，用于启用 GROUP BY 优化。[#43749](https://github.com/ClickHouse/ClickHouse/pull/43749)（[李扬](https://github.com/taiyang-li)）。
* 新增 `multiplyDecimal` 和 `divideDecimal`，用于固定精度的十进制运算。[#42438](https://github.com/ClickHouse/ClickHouse/pull/42438)（[Andrey Zvonov](https://github.com/zvonand)）。
* 新增 `system.moves` 表，列出当前正在移动的数据片段。[#42660](https://github.com/ClickHouse/ClickHouse/pull/42660)（[Sergei Trifonov](https://github.com/serxa)）。
* 为 ClickHouse Keeper 添加内嵌 Prometheus 端点支持。[#43087](https://github.com/ClickHouse/ClickHouse/pull/43087)（[Antonio Andelic](https://github.com/antonio2368)）。
* 支持以 `_` 为分隔符的数字字面量，例如 `1_000_000`。[#43925](https://github.com/ClickHouse/ClickHouse/pull/43925)（[jh0x](https://github.com/jh0x)）。
* 允许 `cutURLParameter` 的第二个参数为数组，以移除多个参数。关闭 [#6827](https://github.com/ClickHouse/ClickHouse/issues/6827)。[#43788](https://github.com/ClickHouse/ClickHouse/pull/43788)（[Roman Vasin](https://github.com/rvasin)）。
* 在 `system.data_skipping_indices` 表中添加包含索引表达式的列。[#43308](https://github.com/ClickHouse/ClickHouse/pull/43308)（[Guillaume Tassery](https://github.com/YiuRULE)）。
* 为 `databases` 系统表新增 `engine_full` 列，以便通过系统表访问数据库的完整引擎定义。[#43468](https://github.com/ClickHouse/ClickHouse/pull/43468)（[凌涛](https://github.com/lingtaolf)）。
* 新增哈希函数 [xxh3](https://github.com/Cyan4973/xxHash)。通过更新库，也提升了 ARM 上 `xxHash32` 和 `xxHash64` 的性能。[#43411](https://github.com/ClickHouse/ClickHouse/pull/43411)（[Nikita Taranov](https://github.com/nickitat)）。
* 支持为 MergeTree 设置定义约束，例如禁止用户覆盖 `storage_policy`。[#43903](https://github.com/ClickHouse/ClickHouse/pull/43903)（[Sergei Trifonov](https://github.com/serxa)）。
* 新增 `input_format_json_read_objects_as_strings` 设置，允许所有 JSON 输入格式将嵌套 JSON 对象解析为字符串。默认禁用。[#44052](https://github.com/ClickHouse/ClickHouse/pull/44052)（[Kruglov Pavel](https://github.com/Avogar)）。

<h4 id="experimental-feature">
  实验性功能
</h4>

* 支持异步插入去重。此前多个小型插入共存于同一批次中，因此异步插入不支持去重。关闭 [#38075](https://github.com/ClickHouse/ClickHouse/issues/38075)。[#43304](https://github.com/ClickHouse/ClickHouse/pull/43304)（[Han Fei](https://github.com/hanfei1991)）。
* 为实验性 Annoy（向量相似性搜索）索引新增余弦距离支持。[#42778](https://github.com/ClickHouse/ClickHouse/pull/42778)（[Filatenkov Artur](https://github.com/FArthur-cmd)）。
* 新增 `CREATE / ALTER / DROP NAMED COLLECTION` 查询。[#43252](https://github.com/ClickHouse/ClickHouse/pull/43252)（[Kseniia Sumarokova](https://github.com/kssenii)）。此功能仍在开发，截至 22.12 这些查询尚不生效，保留本条仅为避免困惑。将命名集合的默认访问权限限制为配置中定义的用户；需要设置 `show_named_collections = 1` 才能查看。[#43325](https://github.com/ClickHouse/ClickHouse/pull/43325)（[Kseniia Sumarokova](https://github.com/kssenii)）。引入 `system.named_collections` 表。[#43147](https://github.com/ClickHouse/ClickHouse/pull/43147)（[Kseniia Sumarokova](https://github.com/kssenii)）。

<h4 id="performance-improvement">
  性能改进
</h4>

* 新增 `max_streams_for_merge_tree_reading` 和 `allow_asynchronous_read_from_io_pool_for_merge_tree`。`max_streams_for_merge_tree_reading` 限制 MergeTree 表的读取流数量；`allow_asynchronous_read_from_io_pool_for_merge_tree` 启用后台 I/O 池读取 `MergeTree` 表。配合 `max_streams_to_max_threads_ratio` 或 `max_streams_for_merge_tree_reading`，可能提升 I/O 受限查询的性能。[#43260](https://github.com/ClickHouse/ClickHouse/pull/43260)（[Nikolai Kochetov](https://github.com/KochetovNicolai)）。在存储延迟高、CPU 数量少且数据片段多的情况下，性能最高可提升至 100 倍。
* 修复 `merge_tree_min_rows_for_concurrent_read_for_remote_filesystem/merge_tree_min_bytes_for_concurrent_read_for_remote_filesystem` 未遵循自适应粒度的问题。对于较宽的行，它们不会像 `merge_tree_min_rows_for_concurrent_read/merge_tree_min_bytes_for_concurrent_read` 一样减少读取行数，可能导致远程文件系统内存使用过高。[#43965](https://github.com/ClickHouse/ClickHouse/pull/43965)（[Nikolai Kochetov](https://github.com/KochetovNicolai)）。
* 优化选择待合并数据片段时，向 ZooKeeper 或 ClickHouse Keeper 发出的列表请求数量。此前某些情况下会产生数千次请求。修复 [#43647](https://github.com/ClickHouse/ClickHouse/issues/43647)。[#43675](https://github.com/ClickHouse/ClickHouse/pull/43675)（[Alexander Tokmakov](https://github.com/tavplubix)）。
* 如果 `max_size_to_preallocate_for_aggregation` 值过小，现在跳过该优化。此设置默认值增至 `10^8`。[#43945](https://github.com/ClickHouse/ClickHouse/pull/43945)（[Nikita Taranov](https://github.com/nickitat)）。
* 关闭服务器时不再清理旧数据片段，以加快关闭；在 [https://github.com/ClickHouse/ClickHouse/pull/41145](https://github.com/ClickHouse/ClickHouse/pull/41145) 之后，这项清理已无必要。[#43760](https://github.com/ClickHouse/ClickHouse/pull/43760)（[Sema Checherinda](https://github.com/CheSema)）。
* 启用 `enable_memory_bound_merging_of_aggregation_results` 后，发起端合并现在与本地聚合结果合并采用相同的内存有界方式。[#40879](https://github.com/ClickHouse/ClickHouse/pull/40879)（[Nikita Taranov](https://github.com/nickitat)）。
* Keeper 改进：尝试在复制的同时并行将日志同步到磁盘。[#43450](https://github.com/ClickHouse/ClickHouse/pull/43450)（[Antonio Andelic](https://github.com/antonio2368)）。
* Keeper 改进：更频繁地对请求进行批处理，可通过新设置 `max_requests_quick_batch_size` 控制。[#43686](https://github.com/ClickHouse/ClickHouse/pull/43686)（[Antonio Andelic](https://github.com/antonio2368)）。

<h4 id="improvement">
  改进
</h4>

* 实现引用依赖关系，并在从备份恢复时据此按正确顺序创建表。[#43834](https://github.com/ClickHouse/ClickHouse/pull/43834)（[Vitaly Baranov](https://github.com/vitlibar)）。
* 在 `CREATE` 查询中展开 UDF，避免启动加载失败。此外，UDF 现在可用作列的 `DEFAULT` 表达式。[#43539](https://github.com/ClickHouse/ClickHouse/pull/43539)（[Antonio Andelic](https://github.com/antonio2368)）。
* 更改 TRUNCATE TABLE、ALTER TABLE DROP PART、ALTER TABLE DROP PARTITION 删除数据片段的方式：现在创建覆盖旧片段的空片段。这使 TRUNCATE 无需随后获取排他锁，并发读取不会被锁住。同时这些查询均获得持久性保障：请求成功后，不会再有片段重新出现。注意，只有在事务范围内才具备原子性。[#41145](https://github.com/ClickHouse/ClickHouse/pull/41145)（[Sema Checherinda](https://github.com/CheSema)）。
* `SET param_x` 查询不再要求手动将参数值序列化为字符串。例如，`SET param_a = '[\'a\', \'b\']'` 现在可写为 `SET param_a = ['a', 'b']`。[#41874](https://github.com/ClickHouse/ClickHouse/pull/41874)（[Nikolay Degterinsky](https://github.com/evillique)）。
* 客户端从 STDIN 读取时，在进度显示中展示已读取行数。关闭 [#43423](https://github.com/ClickHouse/ClickHouse/issues/43423)。[#43442](https://github.com/ClickHouse/ClickHouse/pull/43442)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 从 s3 表函数/引擎读取时显示进度条。[#43454](https://github.com/ClickHouse/ClickHouse/pull/43454)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 进度条同时显示读取行数和写入行数。[#43496](https://github.com/ClickHouse/ClickHouse/pull/43496)（[Ilya Yatsishin](https://github.com/qoega)）。
* `filesystemAvailable` 及相关函数支持一个可选的磁盘名称参数，并将 `filesystemFree` 改名为 `filesystemUnreserved`。关闭 [#35076](https://github.com/ClickHouse/ClickHouse/issues/35076)。[#42064](https://github.com/ClickHouse/ClickHouse/pull/42064)（[flynn](https://github.com/ucasfl)）。
* LDAP 集成：将 search\_limit 默认值提高至 256，并添加 LDAP 服务器配置选项，允许设为任意值。关闭 [#42276](https://github.com/ClickHouse/ClickHouse/issues/42276)。[#42461](https://github.com/ClickHouse/ClickHouse/pull/42461)（[Vasily Nemkov](https://github.com/Enmk)）。
* 允许从异常消息中移除敏感信息，参见配置文件中的 `query_masking_rules`。解决 [#41418](https://github.com/ClickHouse/ClickHouse/issues/41418)。[#42940](https://github.com/ClickHouse/ClickHouse/pull/42940)（[filimonov](https://github.com/filimonov)）。
* 支持 `SHOW FULL TABLES ...` 等查询，以兼容 MySQL。[#43910](https://github.com/ClickHouse/ClickHouse/pull/43910)（[Filatenkov Artur](https://github.com/FArthur-cmd)）。
* Keeper 改进：新增四字母命令 `rqld`，可手动将某节点指定为领导者。[#43026](https://github.com/ClickHouse/ClickHouse/pull/43026)（[JackyWoo](https://github.com/JackyWoo)）。
* 为 Distributed 异步 INSERT 应用查询中的连接超时设置。[#43156](https://github.com/ClickHouse/ClickHouse/pull/43156)（[Azat Khuzhin](https://github.com/azat)）。
* `unhex` 函数现在支持 `FixedString` 参数。[issue42369](https://github.com/ClickHouse/ClickHouse/issues/42369)。[#43207](https://github.com/ClickHouse/ClickHouse/pull/43207)（[DR](https://github.com/freedomDR)）。
* 优先删除按 TTL 规则完全过期的数据片段，参见 [#42869](https://github.com/ClickHouse/ClickHouse/issues/42869)。[#43222](https://github.com/ClickHouse/ClickHouse/pull/43222)（[zhongyuankai](https://github.com/zhongyuankai)）。
* clickhouse-client 的 CPU 负载显示更加准确、响应更及时。[#43307](https://github.com/ClickHouse/ClickHouse/pull/43307)（[Sergei Trifonov](https://github.com/serxa)）。
* 支持通过 `S3` 存储和 `s3` 表函数，以 `Parquet`、`Arrow`、`ORC` 格式读取嵌套类型的子列。[#43329](https://github.com/ClickHouse/ClickHouse/pull/43329)（[chen](https://github.com/xiedeyantu)）。
* 为 `system.parts` 表新增 `table_uuid` 列。[#43404](https://github.com/ClickHouse/ClickHouse/pull/43404)（[Azat Khuzhin](https://github.com/azat)）。
* 新增客户端选项 `--print-num-processed-rows`，在非交互模式下显示本地处理的行数。[#43407](https://github.com/ClickHouse/ClickHouse/pull/43407)（[jh0x](https://github.com/jh0x)）。
* 基于查询计划实现 `aggregation-in-order` 优化，默认启用（但必须配合默认禁用的 `optimize_aggregation_in_order` 才会生效）。设置 `query_plan_aggregation_in_order = 0` 可使用此前基于 AST 的版本。[#43592](https://github.com/ClickHouse/ClickHouse/pull/43592)（[Nikolai Kochetov](https://github.com/KochetovNicolai)）。
* 允许在每次性能事件计数递增时，以 `trace_type = 'ProfileEvent'` 将当前堆栈、性能事件名称及增量值收集到 `system.trace_log`。可通过 `trace_profile_events` 启用，用于调查查询性能。[#43639](https://github.com/ClickHouse/ClickHouse/pull/43639)（[Anton Popov](https://github.com/CurtizJ)）。
* 新增 `input_format_max_binary_string_size` 设置，限制 RowBinary 格式的字符串大小。[#43842](https://github.com/ClickHouse/ClickHouse/pull/43842)（[Kruglov Pavel](https://github.com/Avogar)）。
* 修复 ClickHouse 请求远程 HTTP 服务器并收到错误时，异常消息中未正确显示 HTTP 数字状态码的问题。关闭 [#43919](https://github.com/ClickHouse/ClickHouse/issues/43919)。[#43920](https://github.com/ClickHouse/ClickHouse/pull/43920)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 即使进行多重 JOIN 优化，也正确报告查询错误。[#43583](https://github.com/ClickHouse/ClickHouse/pull/43583)（[Salvatore](https://github.com/tbsal)）。

<h4 id="buildtestingpackaging-improvement">
  构建/测试/打包改进
</h4>

* Systemd 集成现在会正确通知 systemd：服务已真正启动，能够处理请求。[#43400](https://github.com/ClickHouse/ClickHouse/pull/43400)（[Коренберг Марк](https://github.com/socketpair)）。
* 新增使用 [OpenSSL FIPS Module](https://www.openssl.org/docs/man3.0/man7/fips_module.html) 以 OpenSSL 构建 ClickHouse 的选项。此构建类型未经过安全验证测试，也不受支持。[#43991](https://github.com/ClickHouse/ClickHouse/pull/43991)（[Boris Kuschel](https://github.com/bkuschel)）。
* 升级此前 PR 实现的 `DeflateQpl` 压缩编解码器（详情：[https://github.com/ClickHouse/ClickHouse/pull/39494](https://github.com/ClickHouse/ClickHouse/pull/39494)）。此补丁改进：1. QPL v0.2.0 升级至 QPL v0.3.0 [Intel® Query Processing Library (QPL)](https://github.com/intel/qpl)。2. 改进 CMake 文件，修复 QPL v0.3.0 构建问题。3. 构建时将 QPL 与 libaccel-config 链接，替代 QPL v0.2.0 的运行时加载（dlopen）。4. 修复 CompressionCodecDeflateQpl.cpp 中的日志输出问题。[#44024](https://github.com/ClickHouse/ClickHouse/pull/44024)（[jasperzhu](https://github.com/jinjunzh)）。

<h4 id="bug-fix-user-visible-misbehavior-in-official-stable-or-prestable-release">
  错误修复 (user-visible misbehavior in official stable or prestable release)
</h4>

* 修复使用异步插入时可能发生的死锁。[#43233](https://github.com/ClickHouse/ClickHouse/pull/43233)（[Anton Popov](https://github.com/CurtizJ)）。
* 修复 AST 级优化 `optimize_normalize_count_variants` 中的部分错误逻辑。[#43873](https://github.com/ClickHouse/ClickHouse/pull/43873)（[Duc Canh Le](https://github.com/canhld94)）。
* 修复副本间校验和不匹配时变更操作无法推进的问题，例如升级时数据格式变化引起的情况。[#36877](https://github.com/ClickHouse/ClickHouse/pull/36877)（[nvartolomei](https://github.com/nvartolomei)）。
* 修复 `skip_unavailable_shards` 优化无法用于 `hdfsCluster` 表函数的问题。[#43236](https://github.com/ClickHouse/ClickHouse/pull/43236)（[chen](https://github.com/xiedeyantu)）。
* 修复 `s3` 对 `?` 通配符的支持。关闭 [#42731](https://github.com/ClickHouse/ClickHouse/issues/42731)。[#43253](https://github.com/ClickHouse/ClickHouse/pull/43253)（[chen](https://github.com/xiedeyantu)）。
* 修复数组包含 `Nullable` 元素时 `arrayFirstOrNull` 和 `arrayLastOrNull` 的返回空值行为。[#43274](https://github.com/ClickHouse/ClickHouse/pull/43274)（[Duc Canh Le](https://github.com/canhld94)）。
* 修复 Kafka 表相关的 `UserTimeMicroseconds`/`SystemTimeMicroseconds` 统计错误。[#42791](https://github.com/ClickHouse/ClickHouse/pull/42791)（[Azat Khuzhin](https://github.com/azat)）。
* 不再抑制 `web` 磁盘的异常，并修复 `web` 磁盘的重试。[#42800](https://github.com/ClickHouse/ClickHouse/pull/42800)（[Azat Khuzhin](https://github.com/azat)）。
* 修复插入数据与删除物化视图之间的逻辑竞争：物化视图与 INSERT 同时被删除时，执行开始时它仍是插入依赖，但插入链访问它时表已删除，会产生 `UNKNOWN_TABLE` 或 `TABLE_IS_DROPPED` 异常并中断插入。现在，如果依赖已不存在，则避免这些异常并继续插入。[#43161](https://github.com/ClickHouse/ClickHouse/pull/43161)（[AlfVII](https://github.com/AlfVII)）。
* 修复 `quantiles` 函数中可能涉及未初始化内存的未定义行为，由模糊测试发现。关闭 [#44066](https://github.com/ClickHouse/ClickHouse/issues/44066)。[#44067](https://github.com/ClickHouse/ClickHouse/pull/44067)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 为 `CompressionCodecDelta` 增加未压缩大小为零的额外检查。[#43255](https://github.com/ClickHouse/ClickHouse/pull/43255)（[Nikita Taranov](https://github.com/nickitat)）。
* 展平来自 Parquet 的数组，避免数组中数据不一致的问题。Apache Iceberg 可能生成这些不正确的文件。[#43297](https://github.com/ClickHouse/ClickHouse/pull/43297)（[Arthur Passos](https://github.com/arthurpassos)）。
* 修复短路函数执行时从 `LowCardinality` 列进行的错误类型转换。[#43311](https://github.com/ClickHouse/ClickHouse/pull/43311)（[Kruglov Pavel](https://github.com/Avogar)）。
* 修复 `Merge` 引擎表上同时使用 `SAMPLE BY` 和 PREWHERE 优化的查询。[#43315](https://github.com/ClickHouse/ClickHouse/pull/43315)（[Antonio Andelic](https://github.com/antonio2368)）。
* 在 `MergeTreeData` 中检查并比较 `format_version` 文件内容，使存储策略变更后表仍可加载。[#43328](https://github.com/ClickHouse/ClickHouse/pull/43328)（[Antonio Andelic](https://github.com/antonio2368)）。
* 修复向 `Buffer` 表插入时极不可能出现的 “No column to rollback” 逻辑错误。[#43336](https://github.com/ClickHouse/ClickHouse/pull/43336)（[Azat Khuzhin](https://github.com/azat)）。
* 修复设置 `allow_function_parameters` 时，解析器允许为单个函数解析无限数量圆括号的问题。[#43350](https://github.com/ClickHouse/ClickHouse/pull/43350)（[Nikolay Degterinsky](https://github.com/evillique)）。
* `MaterializeMySQL`（实验性功能）支持 DDL `drop table t1, t2`，并兼容大多数 MySQL DROP DDL。[#43366](https://github.com/ClickHouse/ClickHouse/pull/43366)（[zzsmdfj](https://github.com/zzsmdfj)）。
* `session_log`（实验性功能）：修复设置配置档案混乱的极罕见情况下，因无法创建 session\_log 条目而无法登录的问题。[#42641](https://github.com/ClickHouse/ClickHouse/pull/42641)（[Vasily Nemkov](https://github.com/Enmk)）。
* 修复 `if`/`multiIf` 中可能出现的 `Cannot create non-empty column with type Nothing`。关闭 [#43356](https://github.com/ClickHouse/ClickHouse/issues/43356)。[#43368](https://github.com/ClickHouse/ClickHouse/pull/43368)（[Kruglov Pavel](https://github.com/Avogar)）。
* 修复行级筛选条件使用列默认值时的错误。[#43387](https://github.com/ClickHouse/ClickHouse/pull/43387)（[Alexander Gololobov](https://github.com/davenger)）。
* 同时使用 `DISTINCT`、`LIMIT BY`、`LIMIT` 的查询可能返回少于预期的行数。修复 [#43377](https://github.com/ClickHouse/ClickHouse/issues/43377)。[#43410](https://github.com/ClickHouse/ClickHouse/pull/43410)（[Igor Nikonov](https://github.com/devcrafter)）。
* 修复 `sumMap` 对 `Nullable(Decimal(...))` 的处理。[#43414](https://github.com/ClickHouse/ClickHouse/pull/43414)（[Azat Khuzhin](https://github.com/azat)）。
* 修复 macOS 上 `date_diff` 的小时/分钟计算。关闭 [#42742](https://github.com/ClickHouse/ClickHouse/issues/42742)。[#43466](https://github.com/ClickHouse/ClickHouse/pull/43466)（[zzsmdfj](https://github.com/zzsmdfj)）。
* 修复合并/变更操作导致的内存统计错误。[#43516](https://github.com/ClickHouse/ClickHouse/pull/43516)（[Azat Khuzhin](https://github.com/azat)）。
* 修复包含 `toString(enum)` 条件时的主键分析。[#43596](https://github.com/ClickHouse/ClickHouse/pull/43596)（[Nikita Taranov](https://github.com/nickitat)）。此错误由 @tisonkun 发现。
* 确保 `clickhouse-copier` 完成分区附加后，更新 Keeper 中的状态和 `attach_is_done` 时保持一致。[#43602](https://github.com/ClickHouse/ClickHouse/pull/43602)（[lzydmxy](https://github.com/lzydmxy)）。
* 恢复 `Replicated` 数据库失联副本（实验性功能）时，可能需要原子交换两个表名（使用 EXCHANGE）。此前尝试使用两条 RENAME 查询，显然会失败，还会使整个数据库副本恢复过程失败。[#43628](https://github.com/ClickHouse/ClickHouse/pull/43628)（[Nikita Mikhaylov](https://github.com/nikitamikhaylov)）。
* 修复 `s3Cluster` 函数抛出 `NOT_FOUND_COLUMN_IN_BLOCK` 的情况。关闭 [#43534](https://github.com/ClickHouse/ClickHouse/issues/43534)。[#43629](https://github.com/ClickHouse/ClickHouse/pull/43629)（[chen](https://github.com/xiedeyantu)）。
* 修复解析 JSON 对象时，数组具有相同键名但嵌套层级不同，可能发生的 `Array sizes mismatched` 逻辑错误。关闭 [#43569](https://github.com/ClickHouse/ClickHouse/issues/43569)。[#43693](https://github.com/ClickHouse/ClickHouse/pull/43693)（[Kruglov Pavel](https://github.com/Avogar)）。
* 修复分布式 `GROUP BY` 的聚合键包含 `ALIAS` 列时可能出现的异常。[#43709](https://github.com/ClickHouse/ClickHouse/pull/43709)（[Nikita Taranov](https://github.com/nickitat)）。
* 修复启用并使用零拷贝复制（实验性功能）时可能损坏投影的问题。[#43764](https://github.com/ClickHouse/ClickHouse/pull/43764)（[alesapin](https://github.com/alesapin)）。
* 修复 AWS S3 中超大对象的分段上传。[#43824](https://github.com/ClickHouse/ClickHouse/pull/43824)（[ianton-ru](https://github.com/ianton-ru)）。
* 修复带 `ON CLUSTER` 的 `ALTER ... RESET SETTING`，此前可能仅应用于一个副本。修复 [#43843](https://github.com/ClickHouse/ClickHouse/issues/43843)。[#43848](https://github.com/ClickHouse/ClickHouse/pull/43848)（[Elena Torró](https://github.com/elenatorro)）。
* 修复使用 `USING` 且右侧为 `Join` 表引擎时 JOIN 的逻辑错误。[#43963](https://github.com/ClickHouse/ClickHouse/pull/43963)（[Vladimir C](https://github.com/vdimir)）。修复 `Join` 表引擎中键顺序错误的问题。[#44012](https://github.com/ClickHouse/ClickHouse/pull/44012)（[Vladimir C](https://github.com/vdimir)）。
* Keeper 修复：Raft 的服务器间通信端口已被占用时抛出异常。[#43984](https://github.com/ClickHouse/ClickHouse/pull/43984)（[Antonio Andelic](https://github.com/antonio2368)）。
* 修复从子查询裁剪不需要的列时 ORDER BY 位置参数（例如 `ORDER BY 1, 2`）的问题。关闭 [#43964](https://github.com/ClickHouse/ClickHouse/issues/43964)。[#43987](https://github.com/ClickHouse/ClickHouse/pull/43987)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复子查询包含 HAVING 但没有实际聚合时的异常。[#44051](https://github.com/ClickHouse/ClickHouse/pull/44051)（[Nikita Taranov](https://github.com/nickitat)）。
* 修复 S3 分段上传中的竞争，该问题可能在从备份恢复时导致 `Part number must be an integer between 1 and 10000, inclusive. (S3_ERROR)` 错误。[#44065](https://github.com/ClickHouse/ClickHouse/pull/44065)（[Vitaly Baranov](https://github.com/vitlibar)）。
