<h3 id="a-id223a-clickhouse-release-v223-lts-2022-03-17">
  <a id="223" /> ClickHouse v22.3-lts 版本，2022-03-17。[演示文稿](https://presentations.clickhouse.com/2022-release-22.3/)，[视频](https://www.youtube.com/watch?v=GzeANZzPras)
</h3>

<Frame>
  <iframe src="https://www.youtube.com/embed/GzeANZzPras" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
</Frame>

<h4 id="backward-incompatible-change-6">
  向后不兼容变更
</h4>

* 使 `arrayCompact` 函数与其他高阶函数的行为保持一致：不再压缩 lambda 函数的结果，而是对原始数组执行压缩。如果你在 arrayCompact 中使用了非简单的 lambda 函数，可以将 `arrayCompact` 的参数包装进 `arrayMap`，以恢复旧行为。关闭 [#34010](https://github.com/ClickHouse/ClickHouse/issues/34010) [#18535](https://github.com/ClickHouse/ClickHouse/issues/18535) [#14778](https://github.com/ClickHouse/ClickHouse/issues/14778)。[#34795](https://github.com/ClickHouse/ClickHouse/pull/34795)（[Alexandre Snarskii](https://github.com/snar)）。
* 更改函数 `toDatetime` 溢出时由具体实现决定的行为。现在会将其饱和到 datetime 支持的最近最小/最大时间点，而不是回绕。之所以将这项变更标为“向后不兼容”，是因为可能有人无意间依赖了旧行为。[#32898](https://github.com/ClickHouse/ClickHouse/pull/32898)（[HaiBo Li](https://github.com/marising)）。
* 使函数 `cast(value, 'IPv4')`、`cast(value, 'IPv6')` 的行为与 `toIPv4`、`toIPv6` 函数一致。更改了向 `toIPv4`、`toIPv6` 函数传入错误 IP 地址时的行为：现在传入无效 IP 地址会抛出异常，此前这些函数会返回默认值。新增函数 `IPv4StringToNumOrDefault`、`IPv4StringToNumOrNull`、`IPv6StringToNumOrDefault`、`IPv6StringOrNull`、`toIPv4OrDefault`、`toIPv4OrNull`、`toIPv6OrDefault`、`toIPv6OrNull`。如果原有逻辑依赖 `IPv4StringToNum`、`toIPv4`、`toIPv6` 在地址无效时返回默认值，应改用 `IPv4StringToNumOrDefault`、`toIPv4OrDefault`、`toIPv6OrDefault`。新增设置 `cast_ipv4_ipv6_default_on_conversion_error`；启用后，IP 地址转换函数将保持原有行为。关闭 [#22825](https://github.com/ClickHouse/ClickHouse/issues/22825)。关闭 [#5799](https://github.com/ClickHouse/ClickHouse/issues/5799)。关闭 [#35156](https://github.com/ClickHouse/ClickHouse/issues/35156)。[#35240](https://github.com/ClickHouse/ClickHouse/pull/35240)（[Maksim Kita](https://github.com/kitaisreal)）。

<h4 id="new-feature-9">
  新功能
</h4>

* 支持在本地缓存远程文件系统的数据。可为 `s3` 磁盘启用此功能。关闭 [#28961](https://github.com/ClickHouse/ClickHouse/issues/28961)。[#33717](https://github.com/ClickHouse/ClickHouse/pull/33717)（[Kseniia Sumarokova](https://github.com/kssenii)）。与此同时，我们已在 S3 文件系统上启用测试套件，目前没有其他已知问题，因此该功能开始具备生产可用性。
* 新增表函数 `hive`。用法如下：`hive('<hive metastore url>', '<hive database>', '<hive table name>', '<columns definition>', '<partition columns>')`，例如 `SELECT * FROM hive('thrift://hivetest:9083', 'test', 'demo', 'id Nullable(String), score Nullable(Int32), day Nullable(String)', 'day')`。[#34946](https://github.com/ClickHouse/ClickHouse/pull/34946)（[lgbo](https://github.com/lgbo-ustc)）。
* 支持使用 X.509 证书认证通过 SSL 连接的用户。[#31484](https://github.com/ClickHouse/ClickHouse/pull/31484)（[eungenue](https://github.com/eungenue)）。
* 支持向 `file`/`hdfs`/`s3`/`url` 表函数插入数据时推断结构。[#34732](https://github.com/ClickHouse/ClickHouse/pull/34732)（[Kruglov Pavel](https://github.com/Avogar)）。
* 现在读取 `system.zookeeper` 表时不再限制路径，也无需使用 `like` 表达式。此类读取可能给 ZooKeeper 带来相当大的负载，因此必须启用设置 `allow_unrestricted_reads_from_keeper` 才能使用此能力。[#34609](https://github.com/ClickHouse/ClickHouse/pull/34609)（[Sergei Trifonov](https://github.com/serxa)）。
* 在 clickhouse-local 中显示 CPU 和内存指标。关闭 [#34545](https://github.com/ClickHouse/ClickHouse/issues/34545)。[#34605](https://github.com/ClickHouse/ClickHouse/pull/34605)（[李扬](https://github.com/taiyang-li)）。
* 为数组实现 `startsWith` 和 `endsWith` 函数，关闭 [#33982](https://github.com/ClickHouse/ClickHouse/issues/33982)。[#34368](https://github.com/ClickHouse/ClickHouse/pull/34368)（[usurai](https://github.com/usurai)）。
* 为 Map 数据类型新增三个函数：1. `mapReplace(map1, map2)`——使用 map2 中对应键的值替换 map1 中的值，并把 map2 中不存在于 map1 的键添加进去；2. `mapFilter`；3. `mapMap`。mapFilter 和 mapMap 是高阶函数，接收两个参数：第一个参数是以 k、v 键值对作为参数的 lambda 函数，第二个参数是 Map 类型的列。[#33698](https://github.com/ClickHouse/ClickHouse/pull/33698)（[hexiaoting](https://github.com/hexiaoting)）。
* 允许 clickhouse-client 从 `CLICKHOUSE_USER` 和 `CLICKHOUSE_PASSWORD` 环境变量获取默认用户和密码。关闭 [#34538](https://github.com/ClickHouse/ClickHouse/issues/34538)。[#34947](https://github.com/ClickHouse/ClickHouse/pull/34947)（[DR](https://github.com/freedomDR)）。

<h4 id="experimental-feature-8">
  实验性功能
</h4>

* 新增数据类型 `Object(<schema_format>)`，支持存储半结构化数据（目前仅支持 JSON）。数据以字符串形式写入该类型。随后按照半结构化数据的格式提取所有路径，并将其作为独立列写入能够容纳所有值的最优类型中。可使用与源数据路径匹配的名称查询这些列，例如 `data.key1.key2`，或使用类型转换运算符 `data.key1.key2::Int64`。
* 新增设置 `database_replicated_allow_only_replicated_engine`。启用后，`Replicated` 数据库中只允许创建 `Replicated` 表或使用无状态引擎的表。[#35214](https://github.com/ClickHouse/ClickHouse/pull/35214)（[Nikolai Kochetov](https://github.com/KochetovNicolai)）。请注意，`Replicated` 数据库仍是一项实验性功能。

<h4 id="performance-improvement-9">
  性能改进
</h4>

* 通过优化排序提升向 `MergeTree` 表插入数据的性能。在贴近实际的基准测试中，观察到最高 2 倍的提升。[#34750](https://github.com/ClickHouse/ClickHouse/pull/34750)（[Maksim Kita](https://github.com/kitaisreal)）。
* 从 URL 和 S3 读取 Parquet、ORC 及 Arrow 文件时进行列裁剪。关闭 [#34163](https://github.com/ClickHouse/ClickHouse/issues/34163)。[#34849](https://github.com/ClickHouse/ClickHouse/pull/34849)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 从 Hive 读取 Parquet、ORC 及 Arrow 文件时进行列裁剪。[#34954](https://github.com/ClickHouse/ClickHouse/pull/34954)（[lgbo](https://github.com/lgbo-ustc)）。
* 来自性能优化高手的一系列优化：提升包含大型 `IN` 子句的查询处理性能；当 `direct` 字典的数据源为 `ClickHouse` 时提升其性能；提升 `detectCharset`、`detectLanguageUnknown` 函数的性能。[#34888](https://github.com/ClickHouse/ClickHouse/pull/34888)（[Maksim Kita](https://github.com/kitaisreal)）。
* 通过增加批处理提升 `any` 聚合函数的性能。[#34760](https://github.com/ClickHouse/ClickHouse/pull/34760)（[Raúl Marín](https://github.com/Algunenano)）。
* 多项 `clickhouse-keeper` 性能改进：减少锁使用 [#35010](https://github.com/ClickHouse/ClickHouse/pull/35010)（[zhanglistar](https://github.com/zhanglistar)）；以流式读写快照代替完整复制，降低内存占用 [#34584](https://github.com/ClickHouse/ClickHouse/pull/34584)（[zhanglistar](https://github.com/zhanglistar)）；优化 RAFT 实现中的日志存储压缩 [#34534](https://github.com/ClickHouse/ClickHouse/pull/34534)（[zhanglistar](https://github.com/zhanglistar)）；为内部数据结构引入版本控制 [#34486](https://github.com/ClickHouse/ClickHouse/pull/34486)（[zhanglistar](https://github.com/zhanglistar)）。

<h4 id="improvement-9">
  改进
</h4>

* 允许向表函数执行异步插入。修复 [#34864](https://github.com/ClickHouse/ClickHouse/issues/34864)。[#34866](https://github.com/ClickHouse/ClickHouse/pull/34866)（[Anton Popov](https://github.com/CurtizJ)）。
* 对函数 `dictGetHierarchy`、`dictIsIn`、`dictGetChildren`、`dictGetDescendants` 的键参数执行隐式类型转换。关闭 [#34970](https://github.com/ClickHouse/ClickHouse/issues/34970)。[#35027](https://github.com/ClickHouse/ClickHouse/pull/35027)（[Maksim Kita](https://github.com/kitaisreal)）。
* `EXPLAIN AST` 查询可以采用 Graphviz 格式，以图形形式输出 AST：`EXPLAIN AST graph = 1 SELECT * FROM system.parts`。[#35173](https://github.com/ClickHouse/ClickHouse/pull/35173)（[李扬](https://github.com/taiyang-li)）。
* 使用 `s3` 表函数或表引擎写入大文件时，由于 AWS SDK 中的缺陷，文件的内容类型会被错误设置为 `application/xml`。此项变更关闭 [#33964](https://github.com/ClickHouse/ClickHouse/issues/33964)。[#34433](https://github.com/ClickHouse/ClickHouse/pull/34433)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 略微调整限制性行策略，使其在简单场景下更容易作为宽松策略的替代方案。如果某张表只存在限制性策略（没有宽松策略），用户将能够看到部分行。此外，`SHOW CREATE ROW POLICY` 现在始终会在行策略定义中显示 `AS permissive` 或 `AS restrictive`。[#34596](https://github.com/ClickHouse/ClickHouse/pull/34596)（[Vitaly Baranov](https://github.com/vitlibar)）。
* 改进 File/S3/HDFS/URL 引擎对 glob 模式的结构推断。发生错误时尝试使用下一个路径进行结构推断。[#34465](https://github.com/ClickHouse/ClickHouse/pull/34465)（[Kruglov Pavel](https://github.com/Avogar)）。
* Play UI 现在能够正确检测操作系统首选的浅色/深色主题。[#35068](https://github.com/ClickHouse/ClickHouse/pull/35068)（[peledni](https://github.com/peledni)）。
* 新增 `date_time_input_format = 'best_effort_us'`。关闭 [#34799](https://github.com/ClickHouse/ClickHouse/issues/34799)。[#34982](https://github.com/ClickHouse/ClickHouse/pull/34982)（[WenYao](https://github.com/Cai-Yao)）。
* 在服务器配置中新增 `allow_plaintext_password` 和 `allow_no_password` 设置，用于启用或禁用在某些环境中可能不安全的认证类型。默认允许这些认证类型。[#34738](https://github.com/ClickHouse/ClickHouse/pull/34738)（[Heena Bansal](https://github.com/HeenaBansal2009)）。
* Arrow 格式支持 `DateTime64` 数据类型，关闭 [#8280](https://github.com/ClickHouse/ClickHouse/issues/8280) 和 [#28574](https://github.com/ClickHouse/ClickHouse/issues/28574)。[#34561](https://github.com/ClickHouse/ClickHouse/pull/34561)（[李扬](https://github.com/taiyang-li)）。
* 配置更新时重新加载 `remote_url_allow_hosts`（出站连接过滤）。[#35294](https://github.com/ClickHouse/ClickHouse/pull/35294)（[Nikolai Kochetov](https://github.com/KochetovNicolai)）。
* clickhouse-local 支持 `--testmode` 参数。该参数用于启用对功能测试中测试提示的解释。[#35264](https://github.com/ClickHouse/ClickHouse/pull/35264)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 向查询日志添加 `distributed_depth`。它类似于 `is_initial_query` 的更详细版本。[#35207](https://github.com/ClickHouse/ClickHouse/pull/35207)（[李扬](https://github.com/taiyang-li)）。
* `MySQL` 和 `PostgreSQL` 表函数遵守 `remote_url_allow_hosts`。[#35191](https://github.com/ClickHouse/ClickHouse/pull/35191)（[Heena Bansal](https://github.com/HeenaBansal2009)）。
* 向 `system.part_log` 添加 `disk_name` 字段。[#35178](https://github.com/ClickHouse/ClickHouse/pull/35178)（[Artyom Yurkov](https://github.com/Varinara)）。
* 查询远程 URL 时不再重试不可重试的错误。关闭 [#35161](https://github.com/ClickHouse/ClickHouse/issues/35161)。[#35172](https://github.com/ClickHouse/ClickHouse/pull/35172)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 表函数 `view()` 支持分布式 INSERT SELECT 查询（设置 `parallel_distributed_insert_select`）。[#35132](https://github.com/ClickHouse/ClickHouse/pull/35132)（[Azat Khuzhin](https://github.com/azat)）。
* 使用 `AggregateFunction` 向 `Buffer` 执行 `INSERT` 时，内存跟踪更加精确。[#35072](https://github.com/ClickHouse/ClickHouse/pull/35072)（[Azat Khuzhin](https://github.com/azat)）。
* 如果 Linux 内核存在缺陷，避免 Query Profiler 中发生除零。关闭 [#34787](https://github.com/ClickHouse/ClickHouse/issues/34787)。[#35032](https://github.com/ClickHouse/ClickHouse/pull/35032)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 为 Keeper 配置添加更多健全性检查：现在不允许混用 localhost 与非本地服务器，并检查内部 RAFT 端口与 Keeper 客户端端口是否使用相同值。[#35004](https://github.com/ClickHouse/ClickHouse/pull/35004)（[alesapin](https://github.com/alesapin)）。
* 此前，如果用户更改系统表的设置，会产生大量日志，而且 ClickHouse 每分钟都会重命名这些表。此项变更修复 [#34929](https://github.com/ClickHouse/ClickHouse/issues/34929)。[#34949](https://github.com/ClickHouse/ClickHouse/pull/34949)（[Nikita Mikhaylov](https://github.com/nikitamikhaylov)）。
* Hive Metastore 客户端使用连接池。[#34940](https://github.com/ClickHouse/ClickHouse/pull/34940)（[lgbo](https://github.com/lgbo-ustc)）。
* 如果新表引擎不支持按列设置的 `TTL`（即该引擎不属于 `MergeTree` 系列），则在 `CREATE TABLE AS` 中忽略它。[#34938](https://github.com/ClickHouse/ClickHouse/pull/34938)（[Azat Khuzhin](https://github.com/azat)）。
* `ngrambf_v1`/`tokenbf_v1` 索引允许使用 `LowCardinality` 字符串。关闭 [#21865](https://github.com/ClickHouse/ClickHouse/issues/21865)。[#34911](https://github.com/ClickHouse/ClickHouse/pull/34911)（[Lars Hiller Eidnes](https://github.com/larspars)）。
* 如果文件不存在，允许打开空的 SQLite 数据库。关闭 [#33367](https://github.com/ClickHouse/ClickHouse/issues/33367)。[#34907](https://github.com/ClickHouse/ClickHouse/pull/34907)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 为 FreeBSD 实现内存统计，这是 `max_server_memory_usage` 正确工作所必需的。[#34902](https://github.com/ClickHouse/ClickHouse/pull/34902)（[Alexandre Snarskii](https://github.com/snar)）。
* 在此前版本中，clickhouse-client 的进度条可能会在接近 50% 时无故向前跳跃。此项变更关闭 [#34324](https://github.com/ClickHouse/ClickHouse/issues/34324)。[#34801](https://github.com/ClickHouse/ClickHouse/pull/34801)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 对于 `MergeTree` 表引擎，当 `columnX` 是 `ALIAS` 列时，`ALTER TABLE DROP COLUMN columnX` 查询现在会立即完成。修复 [#34660](https://github.com/ClickHouse/ClickHouse/issues/34660)。[#34786](https://github.com/ClickHouse/ClickHouse/pull/34786)（[alesapin](https://github.com/alesapin)）。
* 用户输错数据跳过索引名称时显示提示。关闭 [#29698](https://github.com/ClickHouse/ClickHouse/issues/29698)。[#34764](https://github.com/ClickHouse/ClickHouse/pull/34764)（[flynn](https://github.com/ucasfl)）。
* `parallel_distributed_insert_select` 支持 `remote()`/`cluster()` 表函数。[#34728](https://github.com/ClickHouse/ClickHouse/pull/34728)（[Azat Khuzhin](https://github.com/azat)）。
* 当配置文件中的配置为空时，不再重置通过 `--log-file`/`--errorlog-file` 命令行选项设置的日志配置。[#34718](https://github.com/ClickHouse/ClickHouse/pull/34718)（[Amos Bird](https://github.com/amosbird)）。
* 创建表时只提取一次结构，防止服务器每次启动时都从本地文件/外部数据源读取数据以提取结构。[#34684](https://github.com/ClickHouse/ClickHouse/pull/34684)（[Kruglov Pavel](https://github.com/Avogar)）。
* 允许为可执行 UDF 指定参数名。对于 `Native`、`JSONEachRow` 等参数名属于序列化内容一部分的格式，这是必需的。关闭 [#34604](https://github.com/ClickHouse/ClickHouse/issues/34604)。[#34653](https://github.com/ClickHouse/ClickHouse/pull/34653)（[Maksim Kita](https://github.com/kitaisreal)）。
* `MaterializedMySQL`（实验性功能）现在支持 `materialized_mysql_tables_list`（以逗号分隔的 MySQL 数据库表列表，MaterializedMySQL 数据库引擎将复制这些表。默认值为空列表，表示复制所有表），相关说明见 [#32977](https://github.com/ClickHouse/ClickHouse/issues/32977)。[#34487](https://github.com/ClickHouse/ClickHouse/pull/34487)（[zzsmdfj](https://github.com/zzsmdfj)）。
* 改进分布式表 INSERT 操作的 OpenTelemetry span 日志。[#34480](https://github.com/ClickHouse/ClickHouse/pull/34480)（[Frank Chen](https://github.com/FrankChen021)）。
* 使 ClickHouse Keeper 中 znode 的 `ctime` 和 `mtime` 在服务器之间保持一致。[#33441](https://github.com/ClickHouse/ClickHouse/pull/33441)（[小路](https://github.com/nicelulu)）。

<h4 id="buildtestingpackaging-improvement-9">
  构建/测试/打包改进
</h4>

* 软件包仓库已迁移到 JFrog Artifactory（**Mikhail f. Shiryaev**）。
* 在功能测试中随机化部分设置，以测试更多可能的设置组合。这是另一种模糊测试方法，可确保更好的测试覆盖率。此项变更关闭 [#32268](https://github.com/ClickHouse/ClickHouse/issues/32268)。[#34092](https://github.com/ClickHouse/ClickHouse/pull/34092)（[Kruglov Pavel](https://github.com/Avogar)）。
* 从 CI 中移除 PVS-Studio。[#34680](https://github.com/ClickHouse/ClickHouse/pull/34680)（[Mikhail f. Shiryaev](https://github.com/Felixoid)）。
* 新增使用 CMake 构建已剥离符号的二进制文件的能力。此前由 dh-tools 完成此操作。[#35196](https://github.com/ClickHouse/ClickHouse/pull/35196)（[alesapin](https://github.com/alesapin)）。
* 构建体积更小的“精简版”`clickhouse-keeper`。[#35031](https://github.com/ClickHouse/ClickHouse/pull/35031)（[alesapin](https://github.com/alesapin)）。
* 对 [https://github.com/ClickHouse/ClickHouse/pull/34685](https://github.com/ClickHouse/ClickHouse/pull/34685) 之类的 PR 使用 @robot-clickhouse 作为作者和提交者。[#34793](https://github.com/ClickHouse/ClickHouse/pull/34793)（[Mikhail f. Shiryaev](https://github.com/Felixoid)）。
* 将调试信息的 DWARF 版本上限限制为 4，因为我们的内部堆栈符号解析器无法解析 DWARF 版本 5。如果使用 clang-15 编译 ClickHouse，此设置很有意义。[#34777](https://github.com/ClickHouse/ClickHouse/pull/34777)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 移除 `clickhouse-test` Debian 软件包，以消除不必要的复杂性。CI 使用仓库中的测试，且不再支持通过 deb 软件包执行独立测试。[#34606](https://github.com/ClickHouse/ClickHouse/pull/34606)（[Ilya Yatsishin](https://github.com/qoega)）。

<h4 id="bug-fix-user-visible-misbehaviour-in-official-stable-or-prestable-release">
  缺陷修复（正式稳定版或预稳定版中用户可见的异常行为）
</h4>

* 修复 HDFS 集成问题：当内部缓冲区过小时，`HadoopSnappyDecoder` 中的 NEED\_MORE\_INPUT 会对一个压缩块运行多次（>=3），导致输入数据被复制到 `HadoopSnappyDecoder::buffer` 中的错误位置。[#35116](https://github.com/ClickHouse/ClickHouse/pull/35116)（[lgbo](https://github.com/lgbo-ustc)）。
* 忽略 ATTACH GRANT 语句中过时的权限。此 PR 修复 [#34815](https://github.com/ClickHouse/ClickHouse/issues/34815)。[#34855](https://github.com/ClickHouse/ClickHouse/pull/34855)（[Vitaly Baranov](https://github.com/vitlibar)）。
* 修复通过命名集合创建 Postgres 数据库后，获取建表查询时发生的段错误。关闭 [#35312](https://github.com/ClickHouse/ClickHouse/issues/35312)。[#35313](https://github.com/ClickHouse/ClickHouse/pull/35313)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复部分合并连接产生重复行的问题，关闭 [#31009](https://github.com/ClickHouse/ClickHouse/issues/31009)。[#35311](https://github.com/ClickHouse/ClickHouse/pull/35311)（[Vladimir C](https://github.com/vdimir)）。
* 修复在 `max_read_buffer_size` 设置值较小时使用 bzip2 压缩可能触发 `Assertion 'position() != working_buffer.end()' failed` 的问题。该缺陷发现于 [https://github.com/ClickHouse/ClickHouse/pull/35047](https://github.com/ClickHouse/ClickHouse/pull/35047)。[#35300](https://github.com/ClickHouse/ClickHouse/pull/35300)（[Kruglov Pavel](https://github.com/Avogar)）。同时修复以较小 max\_read\_buffer\_size 使用 lz4 压缩时的问题。[#35296](https://github.com/ClickHouse/ClickHouse/pull/35296)（[Kruglov Pavel](https://github.com/Avogar)）。修复以较小 `max_read_buffer_size` 使用 lzma 压缩时的问题。[#35295](https://github.com/ClickHouse/ClickHouse/pull/35295)（[Kruglov Pavel](https://github.com/Avogar)）。修复以较小 `max_read_buffer_size` 使用 `brotli` 压缩时的问题；该缺陷发现于 [https://github.com/ClickHouse/ClickHouse/pull/35047](https://github.com/ClickHouse/ClickHouse/pull/35047)。[#35281](https://github.com/ClickHouse/ClickHouse/pull/35281)（[Kruglov Pavel](https://github.com/Avogar)）。
* 修复 `JSONEachRow` 结构推断时可能发生的段错误。[#35291](https://github.com/ClickHouse/ClickHouse/pull/35291)（[Kruglov Pavel](https://github.com/Avogar)）。
* 修复表启用稀疏列时的 `CHECK TABLE` 查询。[#35274](https://github.com/ClickHouse/ClickHouse/pull/35274)（[Anton Popov](https://github.com/CurtizJ)）。
* 远程 VFS 读取发生异常时避免调用 std::terminate。[#35257](https://github.com/ClickHouse/ClickHouse/pull/35257)（[Azat Khuzhin](https://github.com/azat)）。
* 修复从配置读取端口的问题，关闭 [#34776](https://github.com/ClickHouse/ClickHouse/issues/34776)。[#35193](https://github.com/ClickHouse/ClickHouse/pull/35193)（[Vladimir C](https://github.com/vdimir)）。
* 修复 `HAVING` 返回空结果时包含 `WITH TOTALS` 的查询错误。修复 [#33711](https://github.com/ClickHouse/ClickHouse/issues/33711)。[#35186](https://github.com/ClickHouse/ClickHouse/pull/35186)（[Amos Bird](https://github.com/amosbird)）。
* 修复 `replaceRegexpAll` 的一个边界情况，关闭 [#35117](https://github.com/ClickHouse/ClickHouse/issues/35117)。[#35182](https://github.com/ClickHouse/ClickHouse/pull/35182)（[Vladimir C](https://github.com/vdimir)）。
* 修复 `INSERT INTO FUNCTION s3(...) FROM ...` 场景下结构推断无法正常工作的问题：此前会尝试从 S3 文件而非 SELECT 查询读取结构。[#35176](https://github.com/ClickHouse/ClickHouse/pull/35176)（[Kruglov Pavel](https://github.com/Avogar)）。
* 修复 MaterializedPostgreSQL（实验性功能）中用于 partition by 等配置的 `table overrides`。关闭 [#35048](https://github.com/ClickHouse/ClickHouse/issues/35048)。[#35162](https://github.com/ClickHouse/ClickHouse/pull/35162)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复 MaterializedPostgreSQL（实验性功能）中手动移除（DETACH TABLE）后再向复制中添加新表（ATTACH TABLE）的问题。关闭 [#33800](https://github.com/ClickHouse/ClickHouse/issues/33800)。关闭 [#34922](https://github.com/ClickHouse/ClickHouse/issues/34922)。关闭 [#34315](https://github.com/ClickHouse/ClickHouse/issues/34315)。[#35158](https://github.com/ClickHouse/ClickHouse/pull/35158)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复将非单调函数与 IN 运算符结合使用时的分区裁剪错误。修复 [#35136](https://github.com/ClickHouse/ClickHouse/issues/35136)。[#35146](https://github.com/ClickHouse/ClickHouse/pull/35146)（[Amos Bird](https://github.com/amosbird)）。
* 修复将 YAML 配置转换为 XML 时的轻微错误。[#35135](https://github.com/ClickHouse/ClickHouse/pull/35135)（[Miel Donkers](https://github.com/mdonkers)）。
* 修复 `optimize_skip_unused_shards_rewrite_in` 对有符号列和负值的处理。[#35134](https://github.com/ClickHouse/ClickHouse/pull/35134)（[Azat Khuzhin](https://github.com/azat)）。
* 外部字典配置选项 `update_lag` 无法使用，会显示错误消息 ``Unexpected key `update_lag` in dictionary source configuration``。[#35089](https://github.com/ClickHouse/ClickHouse/pull/35089)（[Jason Chu](https://github.com/1lann)）。
* 避免服务器关闭时可能发生的死锁。[#35081](https://github.com/ClickHouse/ClickHouse/pull/35081)（[Azat Khuzhin](https://github.com/azat)）。
* 修复启用 `optimize_functions_to_subcolumns` 设置后，函数优化为子列时丢失别名的问题。关闭 [#33798](https://github.com/ClickHouse/ClickHouse/issues/33798)。[#35079](https://github.com/ClickHouse/ClickHouse/pull/35079)（[qieqieplus](https://github.com/qieqieplus)）。
* 修复存在向表函数的异步插入时读取 `system.asynchronous_inserts` 表的问题。[#35050](https://github.com/ClickHouse/ClickHouse/pull/35050)（[Anton Popov](https://github.com/CurtizJ)）。
* 修复可能出现的异常 `Reading for MergeTree family tables must be done with last position boundary`（与远程 VFS 操作相关）。关闭 [#34979](https://github.com/ClickHouse/ClickHouse/issues/34979)。[#35001](https://github.com/ClickHouse/ClickHouse/pull/35001)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复在窗口 frame 中使用 -State 类型聚合函数时出现意外结果的问题。[#34999](https://github.com/ClickHouse/ClickHouse/pull/34999)（[metahys](https://github.com/metahys)）。
* 修复 FileLog（实验性功能）中可能发生的段错误。关闭 [#30749](https://github.com/ClickHouse/ClickHouse/issues/30749)。[#34996](https://github.com/ClickHouse/ClickHouse/pull/34996)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复极少数情况下可能出现的错误 `Cannot push block to port which already has data`。[#34993](https://github.com/ClickHouse/ClickHouse/pull/34993)（[Nikolai Kochetov](https://github.com/KochetovNicolai)）。
* 修复 CSV 中未加引号日期的错误结构推断。关闭 [#34768](https://github.com/ClickHouse/ClickHouse/issues/34768)。[#34961](https://github.com/ClickHouse/ClickHouse/pull/34961)（[Kruglov Pavel](https://github.com/Avogar)）。
* Hive 集成：修复 Hive 查询中在 `where` 内使用 `in` 时出现意外结果的问题。[#34945](https://github.com/ClickHouse/ClickHouse/pull/34945)（[lgbo](https://github.com/lgbo-ustc)）。
* ClickHouse Keeper 搜索待删除的 Changelog 文件时避免忙轮询。[#34931](https://github.com/ClickHouse/ClickHouse/pull/34931)（[Azat Khuzhin](https://github.com/azat)）。
* 修复从 PostgreSQL 转换 DateTime64 的问题。关闭 [#33364](https://github.com/ClickHouse/ClickHouse/issues/33364)。[#34910](https://github.com/ClickHouse/ClickHouse/pull/34910)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复向由 S3 上 VFS 支持的 MergeTree 表执行 `INSERT` 时可能出现的“Part directory doesn't exist”错误。[#34876](https://github.com/ClickHouse/ClickHouse/pull/34876)（[Azat Khuzhin](https://github.com/azat)）。
* 支持在交叉复制集群上执行 CREATE USER 等 DDL。[#34860](https://github.com/ClickHouse/ClickHouse/pull/34860)（[Jianmei Zhang](https://github.com/zhangjmruc)）。
* 修复 `WindowView`（实验性功能）中按多列分组的问题。[#34859](https://github.com/ClickHouse/ClickHouse/pull/34859)（[vxider](https://github.com/Vxider)）。
* 修复查询包含常量列时 S2 函数可能失败的问题。[#34745](https://github.com/ClickHouse/ClickHouse/pull/34745)（[Bharat Nallan](https://github.com/bharatnc)）。
* 修复包含常量列的 H3 函数导致查询失败的问题。[#34743](https://github.com/ClickHouse/ClickHouse/pull/34743)（[Bharat Nallan](https://github.com/bharatnc)）。
* 修复启用 `fsync_part_directory` 并进行纵向合并时出现 `No such file or directory` 的问题。[#34739](https://github.com/ClickHouse/ClickHouse/pull/34739)（[Azat Khuzhin](https://github.com/azat)）。
* 修复系统查询 `RELOAD MODEL`、`RELOAD FUNCTION`、`RESTART DISK` 与 `ON CLUSTER` 一起使用时的序列化/打印。关闭 [#34514](https://github.com/ClickHouse/ClickHouse/issues/34514)。[#34696](https://github.com/ClickHouse/ClickHouse/pull/34696)（[Maksim Kita](https://github.com/kitaisreal)）。
* 修复 `allow_experimental_projection_optimization` 与 `enable_global_with_statement` 搭配使用的问题（此前当 `WITH` 子句包含多个表达式时，可能导致 `Stack size too large` 错误，而且会反复执行标量子查询；现在执行方式更为优化）。[#34650](https://github.com/ClickHouse/ClickHouse/pull/34650)（[Azat Khuzhin](https://github.com/azat)）。
* 对于 `ReplatedMergeTree` 引擎，如果其他副本已经更新事务日志，则停止选择数据片段进行变更。[#34633](https://github.com/ClickHouse/ClickHouse/pull/34633)（[Jianmei Zhang](https://github.com/zhangjmruc)）。
* 修复使用数据片段移动功能时简单计数查询返回错误结果的问题 [#34089](https://github.com/ClickHouse/ClickHouse/issues/34089)。[#34385](https://github.com/ClickHouse/ClickHouse/pull/34385)（[nvartolomei](https://github.com/nvartolomei)）。
* 修复分布式子查询中 `max_query_size` 限制不一致的问题。[#34078](https://github.com/ClickHouse/ClickHouse/pull/34078)（[Chao Ma](https://github.com/godliness)）。
