<h3 id="a-id225a-clickhouse-release-225-2022-05-19">
  <a id="225" /> ClickHouse 22.5 版本, 2022-05-19. [演示文稿](https://presentations.clickhouse.com/2022-release-22.5/), [视频](https://www.youtube.com/watch?v=jkXmXrmjaKQ)
</h3>

<Frame>
  <iframe src="https://www.youtube.com/embed/jkXmXrmjaKQ" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
</Frame>

<h4 id="upgrade-notes-2">
  Upgrade Notes
</h4>

* 现在，后台合并、变更操作和 `OPTIMIZE` 不再增加 `SelectedRows` 和 `SelectedBytes` 指标；它们仍像此前一样增加 `MergedRows` 和 `MergedUncompressedBytes`。这只会影响指标值，使其更合理。此变更不引入兼容性问题，但由于指标变化可能令人疑惑，因此列入此类别。[#37040](https://github.com/ClickHouse/ClickHouse/pull/37040)（[Nikolai Kochetov](https://github.com/KochetovNicolai)）。
* 将 BoringSSL 模块更新至官方符合 FIPS 要求的版本，使 ClickHouse 符合 FIPS 要求。[#35914](https://github.com/ClickHouse/ClickHouse/pull/35914)（[Meena-Renganathan](https://github.com/Meena-Renganathan)）。移除 `aes-192-cfb128` 和 `aes-256-cfb128` 密码算法，因为它们不包含在通过 FIPS 认证的 BoringSSL 版本中。
* 从 `users.xml` 的默认用户配置档案中移除 `max_memory_usage` 设置。这将启用灵活的查询内存限制，替代此前固定的 10 GB 限制。
* 默认禁用 `log_query_threads` 设置。该设置控制是否记录参与查询执行的每个线程的统计信息。支持异步读取后，不同线程 ID 的总数大幅增加，写入 `query_thread_log` 的开销变得过高。[#37077](https://github.com/ClickHouse/ClickHouse/pull/37077)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 移除存在错误的 `groupArraySorted` 函数。[#36822](https://github.com/ClickHouse/ClickHouse/pull/36822)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。

<h4 id="new-feature-7">
  新功能
</h4>

* 默认启用内存过量分配。[#35921](https://github.com/ClickHouse/ClickHouse/pull/35921)（[Dmitry Novik](https://github.com/novikd)）。
* 在 GROUP BY 子句中支持 GROUPING SETS。此实现支持并行处理分组集。[#33631](https://github.com/ClickHouse/ClickHouse/pull/33631)（[Dmitry Novik](https://github.com/novikd)）。
* 新增 `system.certificates` 表。[#37142](https://github.com/ClickHouse/ClickHouse/pull/37142)（[Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)）。
* 新增 `h3Line`、`h3Distance` 和 `h3HexRing` 函数。[#37030](https://github.com/ClickHouse/ClickHouse/pull/37030)（[Bharat Nallan](https://github.com/bharatnc)）。
* 新增基于单一二进制文件的诊断工具 clickhouse-diagnostics。[#36705](https://github.com/ClickHouse/ClickHouse/pull/36705)（[Dale McDiarmid](https://github.com/gingerwizard)）。
* 新增 `Prometheus` 输出格式 [#36051](https://github.com/ClickHouse/ClickHouse/issues/36051)。[#36206](https://github.com/ClickHouse/ClickHouse/pull/36206)（[Vladimir C](https://github.com/vdimir)）。
* 新增 `MySQLDump` 输入格式，从转储中属于同一张表的 INSERT 查询读取全部数据。如果有多张表，默认读取第一张表的数据。[#36667](https://github.com/ClickHouse/ClickHouse/pull/36667)（[Kruglov Pavel](https://github.com/Avogar)）。
* 在 `system.tables` 中为临时表显示 `total_rows` 和 `total_bytes` 字段。[#36401](https://github.com/ClickHouse/ClickHouse/issues/36401)。[#36439](https://github.com/ClickHouse/ClickHouse/pull/36439)（[xiedeyantu](https://github.com/xiedeyantu)）。
* 允许通过查询级设置覆盖 `parts_to_delay_insert` 和 `parts_to_throw_insert`。如果定义了这些查询级设置，它们将覆盖表级设置。[#36371](https://github.com/ClickHouse/ClickHouse/pull/36371)（[Memo](https://github.com/Joeywzr)）。

<h4 id="experimental-feature-6">
  实验性功能
</h4>

* 实现数组的 L1、L2、Linf、余弦距离函数，以及数组的 L1、L2、Linf 范数函数。
  [#37033](https://github.com/ClickHouse/ClickHouse/pull/37033) ([qieqieplus](https://github.com/qieqieplus)). Caveat: the functions will be renamed.
* 改进 WindowView 中的 `WATCH` 查询：1. 通过触发 `fire_condition` 信号，降低提供查询结果的延迟。2. 更频繁地检查 `isCancelled()`，加快取消查询操作（ctrl-c）。[#37226](https://github.com/ClickHouse/ClickHouse/pull/37226)（[vxider](https://github.com/Vxider)）。
* 为远程文件系统缓存增加自省能力。[#36802](https://github.com/ClickHouse/ClickHouse/pull/36802)（[Han Shukai](https://github.com/KinderRiven)）。
* 为 SQL 新增哈希函数 `wyHash64`。[#36467](https://github.com/ClickHouse/ClickHouse/pull/36467)（[olevino](https://github.com/olevino)）。
* 复制数据库改进：新增 `SYSTEM SYNC DATABASE REPLICA` 查询，允许同步 Replicated 数据库内的表元数据，因为目前同步是异步进行的。[#35944](https://github.com/ClickHouse/ClickHouse/pull/35944)（[Nikita Mikhaylov](https://github.com/nikitamikhaylov)）。
* 远程文件系统缓存改进：优化从缓存读取。[#37054](https://github.com/ClickHouse/ClickHouse/pull/37054)（[Kseniia Sumarokova](https://github.com/kssenii)）。改进 `SYSTEM DROP FILESYSTEM CACHE` 查询，新增 `<path>` 和 `FORCE` 选项。[#36639](https://github.com/ClickHouse/ClickHouse/pull/36639)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 半结构化数据改进：允许将 `Object(...)` 类型列转换为 `Object(Nullable(...))`。[#36564](https://github.com/ClickHouse/ClickHouse/pull/36564)（[awakeljw](https://github.com/awakeljw)）。
* 并行副本改进：在 localhost 副本上执行查询时，会创建本地解释器；但在多个副本上执行查询时，需要依赖连接让副本与协调器通信。现在对此进行了改进，localhost 副本可以在同一进程中直接与协调器通信。[#36281](https://github.com/ClickHouse/ClickHouse/pull/36281)（[Nikita Mikhaylov](https://github.com/nikitamikhaylov)）。

<h4 id="performance-improvement-7">
  性能改进
</h4>

* 提升不带 GROUP BY 表达式时 `avg`、`sum` 聚合函数的性能。[#37257](https://github.com/ClickHouse/ClickHouse/pull/37257)（[Maksim Kita](https://github.com/kitaisreal)）。
* 通过动态分派提升一元算术函数（`bitCount`、`bitNot`、`abs`、`intExp2`、`intExp10`、`negate`、`roundAge`、`roundDuration`、`roundToExp2`、`sign`）的性能。[#37289](https://github.com/ClickHouse/ClickHouse/pull/37289)（[Maksim Kita](https://github.com/kitaisreal)）。
* 通过 JIT 编译排序列比较器，提升 ORDER BY、MergeJoin 和向 MergeTree 插入数据的性能。[#34469](https://github.com/ClickHouse/ClickHouse/pull/34469)（[Maksim Kita](https://github.com/kitaisreal)）。
* 更改 `system.asynchronous_metric_log` 的结构，将空间占用降至约十分之一。关闭 [#36357](https://github.com/ClickHouse/ClickHouse/issues/36357)。移除无用的 `event_time_microseconds` 字段。[#36360](https://github.com/ClickHouse/ClickHouse/pull/36360)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 读取宽数据片段时，仅加载必要列的标记。[#36879](https://github.com/ClickHouse/ClickHouse/pull/36879)（[Anton Kozlov](https://github.com/tonickkozlov)）。
* 通过缩小互斥锁范围提升文件描述符缓存性能。[#36682](https://github.com/ClickHouse/ClickHouse/pull/36682)（[Anton Kozlov](https://github.com/tonickkozlov)）。
* 当路径包含通配符且匹配目录中包含大量文件时，提升从 `File` 存储和 `file` 表函数读取数据的性能。[#36647](https://github.com/ClickHouse/ClickHouse/pull/36647)（[Anton Popov](https://github.com/CurtizJ)）。
* 为 `HiveText` 输入格式启用并行解析，从本地文件读取时可使 HiveText 解析速度达到原来的 2 倍。[#36650](https://github.com/ClickHouse/ClickHouse/pull/36650)（[李扬](https://github.com/taiyang-li)）。
* 默认 `HashJoin` 在插入右表行时并非线程安全，因此在单线程中执行。右表较大时，连接过程过慢且 CPU 利用率较低。[#36415](https://github.com/ClickHouse/ClickHouse/pull/36415)（[lgbo](https://github.com/lgbo-ustc)）。
* 允许将 `select countDistinct(a) from t` 重写为 `select count(1) from (select a from t groupBy a)`。[#35993](https://github.com/ClickHouse/ClickHouse/pull/35993)（[zhanglistar](https://github.com/zhanglistar)）。
* 将 OR LIKE 链转换为 multiMatchAny。待更加确信其正确性后再启用。[#34932](https://github.com/ClickHouse/ClickHouse/pull/34932)（[Daniel Kutenin](https://github.com/danlark1)）。
* 通过内联提升部分函数的性能。[#34544](https://github.com/ClickHouse/ClickHouse/pull/34544)（[Daniel Kutenin](https://github.com/danlark1)）。
* 在 readBig 中添加分支，避免不必要的 memcpy，从而带来一定性能提升。[#36095](https://github.com/ClickHouse/ClickHouse/pull/36095)（[jasperzhu](https://github.com/jinjunzh)）。
* 为 optimize\_aggregation\_in\_order 实现使用部分 GROUP BY 键。[#35111](https://github.com/ClickHouse/ClickHouse/pull/35111)（[Azat Khuzhin](https://github.com/azat)）。

<h4 id="improvement-7">
  改进
</h4>

* 执行 `file`、`s3` 和 `url` 表函数时，如果出现解析错误，显示出错文件的名称。[#36314](https://github.com/ClickHouse/ClickHouse/pull/36314)（[Anton Popov](https://github.com/CurtizJ)）。
* 如果后台操作（合并、变更、移动和获取）的线程数在顶层配置中指定，现在允许运行时增加这些线程数。[#36425](https://github.com/ClickHouse/ClickHouse/pull/36425)（[Nikita Mikhaylov](https://github.com/nikitamikhaylov)）。
* 现在，日期时间转换函数在非整小时或非整分钟时区下生成早于 1970-01-01 00:00:00 的时间时，会将结果饱和为零，而不是溢出。这是 [https://github.com/ClickHouse/ClickHouse/pull/29953](https://github.com/ClickHouse/ClickHouse/pull/29953) 的后续工作，用于解决 [https://github.com/ClickHouse/ClickHouse/pull/29953#discussion\_r800550280](https://github.com/ClickHouse/ClickHouse/pull/29953#discussion_r800550280)。由于这是由具体实现决定的行为（且极少出现），允许改变，因此标记为改进。[#36656](https://github.com/ClickHouse/ClickHouse/pull/36656)（[Amos Bird](https://github.com/amosbird)）。
* 如果使用 “test” 日志级别运行 clickhouse-server，则发出警告。“test” 日志级别是最近新增的，不能用于生产环境，因为它会造成必然、无法避免、致命且后果极其严重的性能下降。[#36824](https://github.com/ClickHouse/ClickHouse/pull/36824)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 解析 CREATE TABLE 中的排序规则，并抛出异常或忽略。关闭 [#35892](https://github.com/ClickHouse/ClickHouse/issues/35892)。[#36271](https://github.com/ClickHouse/ClickHouse/pull/36271)（[yuuch](https://github.com/yuuch)）。
* `compatibility_ignore_auto_increment_in_create_table` 选项允许忽略列声明中的 `AUTO_INCREMENT` 关键字，以简化从 MySQL 迁移。[#37178](https://github.com/ClickHouse/ClickHouse/pull/37178)（[Igor Nikonov](https://github.com/devcrafter)）。
* 为 `JSONEachRow` 新增别名 `JSONLines` 和 `NDJSON`。关闭 [#36303](https://github.com/ClickHouse/ClickHouse/issues/36303)。[#36327](https://github.com/ClickHouse/ClickHouse/pull/36327)（[flynn](https://github.com/ucasfl)）。
* 限制每张 Hive 表可查询的最大分区数，避免资源超限。[#37281](https://github.com/ClickHouse/ClickHouse/pull/37281)（[lgbo](https://github.com/lgbo-ustc)）。
* 为 `h3kRing` 函数的第二个参数新增隐式类型转换，以改善易用性。关闭 [#35432](https://github.com/ClickHouse/ClickHouse/issues/35432)。[#37189](https://github.com/ClickHouse/ClickHouse/pull/37189)（[Maksim Kita](https://github.com/kitaisreal)）。
* 修复 `clickhouse-local` 中任意 `INSERT SELECT` 查询的进度显示，以及客户端文件进度显示，使文件进度更准确。[#37075](https://github.com/ClickHouse/ClickHouse/pull/37075)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复 MergeTree 表引擎家族删除数据片段时发生文件系统故障，可能导致过期数据片段被遗漏的问题。修复前，这些片段只有在服务器首次重启后才会删除。[#37014](https://github.com/ClickHouse/ClickHouse/pull/37014)（[alesapin](https://github.com/alesapin)）。
* 实现一种新的行策略处理模式，可在主配置中启用，允许没有宽松行策略的用户读取行。[#36997](https://github.com/ClickHouse/ClickHouse/pull/36997)（[Vitaly Baranov](https://github.com/vitlibar)）。
* Play UI：可空数字将在表格单元格中右对齐。关闭 [#36982](https://github.com/ClickHouse/ClickHouse/issues/36982)。[#36988](https://github.com/ClickHouse/ClickHouse/pull/36988)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* Play UI：如果结果只有一行且列数较多，则垂直显示结果。延续 [#36811](https://github.com/ClickHouse/ClickHouse/issues/36811)。[#36842](https://github.com/ClickHouse/ClickHouse/pull/36842)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 清理 Play UI 的 CSS，使像素布局更加均匀，并改善单元格中长内容的易用性。[#36569](https://github.com/ClickHouse/ClickHouse/pull/36569)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 发生异常时完成写入缓冲区的收尾，避免在析构函数中执行。希望可以修复 [#36907](https://github.com/ClickHouse/ClickHouse/issues/36907)。[#36979](https://github.com/ClickHouse/ClickHouse/pull/36979)（[Kruglov Pavel](https://github.com/Avogar)）。
* 在 [#36425](https://github.com/ClickHouse/ClickHouse/issues/36425) 之后，`background_fetches_pool_size` 等设置已过时，可以出现在顶层配置中，但 ClickHouse 会抛出类似 `Error updating configuration from '/etc/clickhouse-server/config.xml' config.: Code: 137. DB::Exception: A setting 'background_fetches_pool_size' appeared at top level in config /etc/clickhouse-server/config.xml.` 的异常。现已修复。[#36917](https://github.com/ClickHouse/ClickHouse/pull/36917)（[Nikita Mikhaylov](https://github.com/nikitamikhaylov)）。
* 向其他服务器发送异常时，添加额外诊断信息（如果适用）。[#36872](https://github.com/ClickHouse/ClickHouse/pull/36872)（[tavplubix](https://github.com/tavplubix)）。
* 允许使用 `Array(Tuple(..))` 类型参数执行哈希函数。[#36812](https://github.com/ClickHouse/ClickHouse/pull/36812)（[Anton Popov](https://github.com/CurtizJ)）。
* 新增 `user_defined_path` 配置设置。[#36753](https://github.com/ClickHouse/ClickHouse/pull/36753)（[Maksim Kita](https://github.com/kitaisreal)）。
* 允许在 `s3Cluster` 表函数中使用集群宏。[#36726](https://github.com/ClickHouse/ClickHouse/pull/36726)（[Vadim Volodin](https://github.com/PolyProgrammist)）。
* 在 `clickhouse-client`/`clickhouse-local` 中正确取消 INSERT 查询。[#36710](https://github.com/ClickHouse/ClickHouse/pull/36710)（[Azat Khuzhin](https://github.com/azat)）。
* 允许在 `MySQLHandler` 中取消查询，同时保留合理的查询 ID。[#36699](https://github.com/ClickHouse/ClickHouse/pull/36699)（[Amos Bird](https://github.com/amosbird)）。
* 向 `system.processes` 添加 `is_all_data_sent` 列，并据此改进内部测试的强化检查。[#36649](https://github.com/ClickHouse/ClickHouse/pull/36649)（[Azat Khuzhin](https://github.com/azat)）。
* 现在会正确计算从 s3 读取所用时间的指标。关闭 [#35483](https://github.com/ClickHouse/ClickHouse/issues/35483)。[#36572](https://github.com/ClickHouse/ClickHouse/pull/36572)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 在 clickhouse-local 中运行时，允许在 file 表函数中使用文件描述符。[#36562](https://github.com/ClickHouse/ClickHouse/pull/36562)（[wuxiaobai24](https://github.com/wuxiaobai24)）。
* 允许元组元素名称以数字开头。[#36544](https://github.com/ClickHouse/ClickHouse/pull/36544)（[Anton Popov](https://github.com/CurtizJ)）。
* clickhouse-benchmark 现在可以从环境变量读取认证信息。[#36497](https://github.com/ClickHouse/ClickHouse/pull/36497)（[Anton Kozlov](https://github.com/tonickkozlov)）。
* `clickhouse-keeper` 改进：支持强制恢复，允许在没有法定多数的情况下重新配置集群。[#36258](https://github.com/ClickHouse/ClickHouse/pull/36258)（[Antonio Andelic](https://github.com/antonio2368)）。
* 改进 JSON 对象的结构推断。[#36207](https://github.com/ClickHouse/ClickHouse/pull/36207)（[Kruglov Pavel](https://github.com/Avogar)）。
* 重构通配符结构推断相关代码。仅在有意义时尝试通配符匹配的下一个文件（此前任何错误都会触发尝试下一个文件）。同时修复 [#36317](https://github.com/ClickHouse/ClickHouse/issues/36317)。[#36205](https://github.com/ClickHouse/ClickHouse/pull/36205)（[Kruglov Pavel](https://github.com/Avogar)）。
* 新增独立的 `CLUSTER` 授权（以及 `access_control_improvements.on_cluster_queries_require_cluster_grant` 配置指令；为保持向后兼容，默认设为 `false`）。[#35767](https://github.com/ClickHouse/ClickHouse/pull/35767)（[Azat Khuzhin](https://github.com/azat)）。
* 如果在选中的查询停止前已获得所需内存，所有等待中的查询将继续执行。现在，如果内存在选中查询获知取消操作之前已释放，就不会停止任何查询。[#35637](https://github.com/ClickHouse/ClickHouse/pull/35637)（[Dmitry Novik](https://github.com/novikd)）。
* 在 Protobuf 中检测可空值。在 proto3 中，默认值不会通过网络传输，因此很难区分 Nullable 列的 null 值和默认值。处理此问题的标准方法是使用 Google 包装类型，将目标值嵌套在内部消息中（参见 [https://github.com/protocolbuffers/protobuf/blob/master/src/google/protobuf/wrappers.proto](https://github.com/protocolbuffers/protobuf/blob/master/src/google/protobuf/wrappers.proto)）。这样，缺失字段解释为 null 值；字段存在但值缺失解释为默认值；具有普通值的字段解释为普通值。然而，ClickHouse 会将 Google 包装类型解释为嵌套列。我们建议引入特殊行为，识别 Google 包装类型并按上述方式解释。例如，为 Nullable 列 `test` 序列化值时，会在 .proto 结构中使用 `google.protobuf.StringValue test`。注意，这些类型是 Protobuf 所谓的“众所周知的类型”，由库本身实现。[#35149](https://github.com/ClickHouse/ClickHouse/pull/35149)（[Jakub Kuklis](https://github.com/jkuklis)）。
* 支持在预定义和静态 HTTP 处理器配置中指定 `content_type`。[#34916](https://github.com/ClickHouse/ClickHouse/pull/34916)（[Roman Nikonov](https://github.com/nic11)）。
* 使用 clickhouse-client --file 但前面没有 --external 时，给出适当警告。关闭 [#34747](https://github.com/ClickHouse/ClickHouse/issues/34747)。[#34765](https://github.com/ClickHouse/ClickHouse/pull/34765)（[李扬](https://github.com/taiyang-li)）。
* 改进 MySQL 数据库引擎，兼容 binary(0) 数据类型。[#37232](https://github.com/ClickHouse/ClickHouse/pull/37232)（[zzsmdfj](https://github.com/zzsmdfj)）。
* 改进 clickhouse-benchmark 的 JSON 报告。[#36473](https://github.com/ClickHouse/ClickHouse/pull/36473)（[Tian Xinhui](https://github.com/xinhuitian)）。
* 如果无法解析外部 ClickHouse 字典的主机名，服务器可能拒绝启动。现已修复。修复 [#36451](https://github.com/ClickHouse/ClickHouse/issues/36451)。[#36463](https://github.com/ClickHouse/ClickHouse/pull/36463)（[tavplubix](https://github.com/tavplubix)）。

<h4 id="buildtestingpackaging-improvement-7">
  构建/测试/打包改进
</h4>

* `x86_64` 架构的 `clickhouse-keeper` 现在与 [musl](https://musl.libc.org/) 静态链接，不依赖任何系统库。[#31833](https://github.com/ClickHouse/ClickHouse/pull/31833)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 现在可通过通用安装脚本 `curl https://clickhouse.com/ | sh` 和直接链接 `https://builds.clickhouse.com/master/powerpc64le/clickhouse` 获取 `PowerPC64LE` 架构的 ClickHouse 构建。[#37095](https://github.com/ClickHouse/ClickHouse/pull/37095)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 将 PowerPC 代码生成限制为 Power8，以提高兼容性。关闭 [#36025](https://github.com/ClickHouse/ClickHouse/issues/36025)。[#36529](https://github.com/ClickHouse/ClickHouse/pull/36529)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 简化性能测试，使我们有机会实际使用它。[#36769](https://github.com/ClickHouse/ClickHouse/pull/36769)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 报告中出现错误时，使性能比较失败。[#34797](https://github.com/ClickHouse/ClickHouse/pull/34797)（[Mikhail f. Shiryaev](https://github.com/Felixoid)）。
* 为 Arrow 新增 ZSTD 支持。修复 [#35283](https://github.com/ClickHouse/ClickHouse/issues/35283)。[#35486](https://github.com/ClickHouse/ClickHouse/pull/35486)（[Sean Lafferty](https://github.com/seanlaff)）。

<h4 id="bug-fix-3">
  错误修复
</h4>

* 从 URI 中提取版本 ID（如果存在），并向 AWS HTTP URI 添加请求。关闭 [#31221](https://github.com/ClickHouse/ClickHouse/issues/31221)。- \[x] 从 URI 提取 `Version ID`（如果存在），并重新组装不含该参数的 URI。- \[x] 为 `AWS HTTP URI` 对象配置请求。- \[x] 单元测试：[`gtest_s3_uri`](https://github.com/ClickHouse/ClickHouse/blob/2340a6c6849ebc05a8efbf97ba8de3ff9dc0eff4/src/IO/tests/gtest_s3_uri.cpp)。- \[x] 移除插桩提交。[#34571](https://github.com/ClickHouse/ClickHouse/pull/34571)（[Saad Ur Rahman](https://github.com/surahman)）。
* 修复 system.opentelemetry\_span\_log 的 attribute.values 别名，使其指向 values 而非 keys。[#37275](https://github.com/ClickHouse/ClickHouse/pull/37275)（[Aleksandr Razumov](https://github.com/ernado)）。
* 修复 Nullable(String) 到 Nullable(Bool/IPv4/IPv6) 的转换。关闭 [#37221](https://github.com/ClickHouse/ClickHouse/issues/37221)。[#37270](https://github.com/ClickHouse/ClickHouse/pull/37270)（[Kruglov Pavel](https://github.com/Avogar)）。
* 实验性功能：修复包含 `Object` 类型列的表中的变更操作执行。目前仍不允许在 `UPDATE` 或 `DELETE` 查询的 `WHERE` 表达式中使用 `Object` 类型的子列，也不允许对单独的子列进行操作（`DROP`、`MODIFY`）。修复 [#37205](https://github.com/ClickHouse/ClickHouse/issues/37205)。[#37266](https://github.com/ClickHouse/ClickHouse/pull/37266)（[Anton Popov](https://github.com/CurtizJ)）。
* Kafka 在生产者阶段不需要 `group.id`。控制台日志中可以看到描述此问题的警告：`2022.05.15 17:59:13.270227 [ 137 ] {} <Warning> StorageKafka (topic-name): [rdk:CONFWARN] [thrd:app]: Configuration property group.id is a consumer property and will be ignored by this producer instance`。[#37228](https://github.com/ClickHouse/ClickHouse/pull/37228)（[Mark Andreev](https://github.com/mrk-andreev)）。
* 实验性功能（WindowView）：在数据块实际触发后更新 `max_fired_watermark `，避免删除尚未触发的数据。[#37225](https://github.com/ClickHouse/ClickHouse/pull/37225)（[vxider](https://github.com/Vxider)）。
* 修复带 LIMIT BY 的分布式查询出现 “Cannot create column of type Set” 的问题。[#37193](https://github.com/ClickHouse/ClickHouse/pull/37193)（[Azat Khuzhin](https://github.com/azat)）。
* 实验性功能：WindowView 的 `WATCH EVENTS` 查询现在不会因 `WindowViewSource.h:58` 中创建的非空数据块而终止。[#37182](https://github.com/ClickHouse/ClickHouse/pull/37182)（[vxider](https://github.com/Vxider)）。
* 为子查询启用 `enable_global_with_statement`，关闭 [#37141](https://github.com/ClickHouse/ClickHouse/issues/37141)。[#37166](https://github.com/ClickHouse/ClickHouse/pull/37166)（[Vladimir C](https://github.com/vdimir)）。
* 修复 optimize\_skip\_unused\_shards\_rewrite\_in 的隐式类型转换。[#37153](https://github.com/ClickHouse/ClickHouse/pull/37153)（[Azat Khuzhin](https://github.com/azat)）。
* 对 FixedString 列使用 ILIKE 函数可能返回错误结果（匹配的内容少于应有数量）。[#37117](https://github.com/ClickHouse/ClickHouse/pull/37117)（[Robert Schulze](https://github.com/rschu1ze)）。
* 修复对 `AggregateFunction` 执行 `GROUP BY`（即对 `AggregateFunction` 类型的列执行 `GROUP BY`）的问题。[#37093](https://github.com/ClickHouse/ClickHouse/pull/37093)（[Azat Khuzhin](https://github.com/azat)）。
* 实验性功能：修复使用前缀 GROUP BY 和 \*Array 聚合函数时的 optimize\_aggregation\_in\_order。[#37050](https://github.com/ClickHouse/ClickHouse/pull/37050)（[Azat Khuzhin](https://github.com/azat)）。
* 修复某些带隐式聚合的 INSERT SELECT 查询的性能退化。修复 [#36792](https://github.com/ClickHouse/ClickHouse/issues/36792)。[#37047](https://github.com/ClickHouse/ClickHouse/pull/37047)（[tavplubix](https://github.com/tavplubix)）。
* 实验性功能：修复配合 `*Array`（`groupArrayArray`/…）聚合函数使用的有序 `GROUP BY`（`optimize_aggregation_in_order=1`）。[#37046](https://github.com/ClickHouse/ClickHouse/pull/37046)（[Azat Khuzhin](https://github.com/azat)）。
* 修复索引类型不是 UInt8 时，LowCardinality->ArrowDictionary 输出无效的问题。关闭 [#36832](https://github.com/ClickHouse/ClickHouse/issues/36832)。[#37043](https://github.com/ClickHouse/ClickHouse/pull/37043)（[Kruglov Pavel](https://github.com/Avogar)）。
* 修复 `quantileTDigest` 处理无穷大值的问题。修复 [#32107](https://github.com/ClickHouse/ClickHouse/issues/32107)。[#37021](https://github.com/ClickHouse/ClickHouse/pull/37021)（[Vladimir Chebotarev](https://github.com/excitoon)）。
* 修复 max\_parallel\_replicas != 1 时，HedgedConnections 发送外部表数据的问题。[#36981](https://github.com/ClickHouse/ClickHouse/pull/36981)（[Kruglov Pavel](https://github.com/Avogar)）。
* 修复 `Replicated` 数据库中 `TRUNCATE` 查询的逻辑错误。修复 [#33747](https://github.com/ClickHouse/ClickHouse/issues/33747)。[#36976](https://github.com/ClickHouse/ClickHouse/pull/36976)（[tavplubix](https://github.com/tavplubix)）。
* 实验性功能：修复 WindowView 删除源表时卡住的问题。关闭 [#35678](https://github.com/ClickHouse/ClickHouse/issues/35678)。[#36967](https://github.com/ClickHouse/ClickHouse/pull/36967)（[vxider](https://github.com/Vxider)）。
* 实验性功能（RocksDB 缓存）：修复问题 [#36671](https://github.com/ClickHouse/ClickHouse/issues/36671)。[#36929](https://github.com/ClickHouse/ClickHouse/pull/36929)（[李扬](https://github.com/taiyang-li)）。
* 实验性功能：通过添加转换操作，允许以略有不同的结构调用 `writeIntoWindowView`，修复 WindowView 使用多个列时的问题。[#36928](https://github.com/ClickHouse/ClickHouse/pull/36928)（[vxider](https://github.com/Vxider)）。
* 修复 clickhouse-keeper 在负载较低且发生重启时，可能损坏压缩日志文件的问题。[#36910](https://github.com/ClickHouse/ClickHouse/pull/36910)（[alesapin](https://github.com/alesapin)）。
* 修复常量聚合时查询结果不正确的问题。修复 [#36728](https://github.com/ClickHouse/ClickHouse/issues/36728)。[#36888](https://github.com/ClickHouse/ClickHouse/pull/36888)（[Amos Bird](https://github.com/amosbird)）。
* 实验性功能：修复缓存中的 `current_size` 计数。[#36887](https://github.com/ClickHouse/ClickHouse/pull/36887)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 实验性功能：修复使用跳跃窗口的窗口视图的触发问题 [#34044](https://github.com/ClickHouse/ClickHouse/issues/34044)。[#36861](https://github.com/ClickHouse/ClickHouse/pull/36861)（[vxider](https://github.com/Vxider)）。
* 实验性功能：修复远程文件系统缓存缓冲区中的错误类型转换。[#36809](https://github.com/ClickHouse/ClickHouse/pull/36809)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复使用 `flatten_nested = 0` 创建表的问题。此前，未展平的 `Nested` 列可能在服务器重启后被展平。[#36803](https://github.com/ClickHouse/ClickHouse/pull/36803)（[Anton Popov](https://github.com/CurtizJ)）。
* 修复从远程文件系统异步读取低基数数据时出现的一些问题。[#36763](https://github.com/ClickHouse/ClickHouse/pull/36763)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 实验性功能：修复从多个文件向 `Object` 类型列插入数据的问题，例如通过带通配符的 `file` 表函数插入。[#36762](https://github.com/ClickHouse/ClickHouse/pull/36762)（[Anton Popov](https://github.com/CurtizJ)）。
* 修复对冲请求中的超时问题。发送远程查询后连接立即挂起，可能导致无限等待。[#36749](https://github.com/ClickHouse/ClickHouse/pull/36749)（[Kruglov Pavel](https://github.com/Avogar)）。
* 实验性功能：修复分布式表上 `groupBitmapAndState`/`groupBitmapOrState`/`groupBitmapXorState` 的错误。[#36739](https://github.com/ClickHouse/ClickHouse/pull/36739)（[Zhang Yifan](https://github.com/zhangyifan27)）。
* 实验性功能：在 [PR](https://github.com/ClickHouse/ClickHouse/pull/36376) 的测试过程中，我发现某个缓存类被初始化了两次，导致异常。虽然原因尚不明确，但 ClickHouse 中应该存在重复加载磁盘的代码逻辑，因此需要对这种情况进行专门判断。[#36737](https://github.com/ClickHouse/ClickHouse/pull/36737)（[Han Shukai](https://github.com/KinderRiven)）。
* 修复宽数据片段中的垂直合并。此前，合并过程中可能抛出 `There is no column` 异常。[#36707](https://github.com/ClickHouse/ClickHouse/pull/36707)（[Anton Popov](https://github.com/CurtizJ)）。
* 修复端口变化时服务器重新加载的问题（不再等待查询上下文中的当前连接）。[#36700](https://github.com/ClickHouse/ClickHouse/pull/36700)（[Azat Khuzhin](https://github.com/azat)）。
* 实验性功能：在之前的 [PR](https://github.com/ClickHouse/ClickHouse/pull/36376) 中，我发现测试（无状态测试、不稳定性检查（address、actions））会超时。本地测试也会触发偶发的系统死锁。使用 master 分支最新源码时，此问题依然存在。[#36697](https://github.com/ClickHouse/ClickHouse/pull/36697)（[Han Shukai](https://github.com/KinderRiven)）。
* 实验性功能：修复缓存配置发生变化时服务器重启的问题。[#36685](https://github.com/ClickHouse/ClickHouse/pull/36685)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复结构推断中可能发生的堆内存释放后使用问题。关闭 [#36661](https://github.com/ClickHouse/ClickHouse/issues/36661)。[#36679](https://github.com/ClickHouse/ClickHouse/pull/36679)（[Kruglov Pavel](https://github.com/Avogar)）。
* 修复未指定引擎的 `CREATE` 查询中查询设置的解析。修复 [https://github.com/ClickHouse/ClickHouse/pull/34187#issuecomment-1103812419](https://github.com/ClickHouse/ClickHouse/pull/34187#issuecomment-1103812419)。[#36642](https://github.com/ClickHouse/ClickHouse/pull/36642)（[tavplubix](https://github.com/tavplubix)）。
* 实验性功能：修复带 `Object` 类型的宽数据片段合并。[#36637](https://github.com/ClickHouse/ClickHouse/pull/36637)（[Anton Popov](https://github.com/CurtizJ)）。
* 修复 EPHEMERAL 后的默认表达式不是字面量时，格式化发生崩溃的问题。关闭 [#36618](https://github.com/ClickHouse/ClickHouse/issues/36618)。[#36633](https://github.com/ClickHouse/ClickHouse/pull/36633)（[flynn](https://github.com/ucasfl)）。
* 修复对 `ENGINE = MergeTree` 表使用 `INTERPOLATE` 时可能出现的 `Missing column` 异常。[#36549](https://github.com/ClickHouse/ClickHouse/pull/36549)（[Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)）。
* 修复连接查询中 `WHERE` 的字面量可能导致的错误。关闭 [#36279](https://github.com/ClickHouse/ClickHouse/issues/36279)。[#36542](https://github.com/ClickHouse/ClickHouse/pull/36542)（[Vladimir C](https://github.com/vdimir)）。
* 修复 ReadBufferFromEncryptedFile 的偏移量更新错误，该错误可能导致未定义行为。[#36493](https://github.com/ClickHouse/ClickHouse/pull/36493)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复 Keeper 集群配置的主机名合理性检查。新增 `keeper_server.host_checks_enabled` 配置，用于启用或禁用这些检查。[#36492](https://github.com/ClickHouse/ClickHouse/pull/36492)（[Antonio Andelic](https://github.com/antonio2368)）。
* 修复 GROUP BY 中可执行用户定义函数的使用。此前，可执行用户定义函数不能用作 GROUP BY 中的表达式。关闭 [#36448](https://github.com/ClickHouse/ClickHouse/issues/36448)。[#36486](https://github.com/ClickHouse/ClickHouse/pull/36486)（[Maksim Kita](https://github.com/kitaisreal)）。
* 修复客户端收到服务器未知数据包时可能出现的异常。[#36481](https://github.com/ClickHouse/ClickHouse/pull/36481)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 实验性功能（请永远不要使用 `system.session_log`，它即将移除）：为 system.session\_log 表补充缺失的枚举值。关闭 [#36474](https://github.com/ClickHouse/ClickHouse/issues/36474)。[#36480](https://github.com/ClickHouse/ClickHouse/pull/36480)（[Memo](https://github.com/Joeywzr)）。
* 修复 s3Cluster 结构推断中的错误，该错误导致从 s3Cluster 进行 select 时未读取所有数据。此问题由 [https://github.com/ClickHouse/ClickHouse/pull/35544](https://github.com/ClickHouse/ClickHouse/pull/35544) 引入。[#36434](https://github.com/ClickHouse/ClickHouse/pull/36434)（[Kruglov Pavel](https://github.com/Avogar)）。
* 修复 JOIN 和 COLUMNS 匹配器中的空指针解引用。修复 [#36416](https://github.com/ClickHouse/ClickHouse/issues/36416)。对应 [https://github.com/ClickHouse/ClickHouse/pull/36417](https://github.com/ClickHouse/ClickHouse/pull/36417)。[#36430](https://github.com/ClickHouse/ClickHouse/pull/36430)（[Amos Bird](https://github.com/amosbird)）。
* 修复包含标量子查询时 `ClickHouseDictionarySource` 的字典重新加载。[#36390](https://github.com/ClickHouse/ClickHouse/pull/36390)（[lthaooo](https://github.com/lthaooo)）。
* 修复 JOIN 中的断言，关闭 [#36199](https://github.com/ClickHouse/ClickHouse/issues/36199)。[#36201](https://github.com/ClickHouse/ClickHouse/pull/36201)（[Vladimir C](https://github.com/vdimir)）。
* 特殊运算符内包含别名的查询会返回解析错误（在 22.1 中被破坏）。例如：`SELECT substring('test' AS t, 1, 1)`。[#36167](https://github.com/ClickHouse/ClickHouse/pull/36167)（[Maksim Kita](https://github.com/kitaisreal)）。
* 实验性功能：修复向 `Object` 类型列插入包含嵌套数组的复杂 JSON 的问题。[#36077](https://github.com/ClickHouse/ClickHouse/pull/36077)（[Anton Popov](https://github.com/CurtizJ)）。
* 修复紧凑数据片段中对嵌套列执行 ALTER DROP COLUMN 的问题（即存在列 `n.d` 时执行 `ALTER TABLE x DROP COLUMN n`）。[#35797](https://github.com/ClickHouse/ClickHouse/pull/35797)（[Azat Khuzhin](https://github.com/azat)）。
* 修复 `offset` 和 `length` 为负常量且 `s` 非常量时，substring 函数的范围长度错误。[#33861](https://github.com/ClickHouse/ClickHouse/pull/33861)（[RogerYK](https://github.com/RogerYK)）。
