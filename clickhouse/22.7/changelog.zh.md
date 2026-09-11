<h3 id="a-id227a-clickhouse-release-227-2022-07-21">
  <a id="227" /> ClickHouse 22.7 版本, 2022-07-21. [演示文稿](https://presentations.clickhouse.com/2022-release-22.7/), [视频](https://www.youtube.com/watch?v=IOJyo14BpTQ)
</h3>

<Frame>
  <iframe src="https://www.youtube.com/embed/IOJyo14BpTQ" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
</Frame>

<h4 id="upgrade-notes-1">
  升级说明
</h4>

* 默认启用 `enable_positional_arguments` 设置。它允许 `SELECT ... ORDER BY 1, 2` 这类查询，其中 1、2 引用 SELECT 子句中的位置。如需恢复旧行为，请禁用此设置。[#38204](https://github.com/ClickHouse/ClickHouse/pull/38204)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 默认禁用 `format_csv_allow_single_quotes`。参见 [#37096](https://github.com/ClickHouse/ClickHouse/issues/37096)。（[Kruglov Pavel](https://github.com/Avogar)）。
* 弃用 `Ordinary` 数据库引擎和 `*MergeTree` 表的旧存储定义语法。默认不再允许新建 `Ordinary` 引擎数据库。如果 `system` 数据库使用 `Ordinary` 引擎，将在服务器启动时自动转换为 `Atomic`。可通过 `allow_deprecated_database_ordinary` 和 `allow_deprecated_syntax_for_merge_tree` 设置保留旧行为，但这些设置可能在后续版本移除。[#38335](https://github.com/ClickHouse/ClickHouse/pull/38335)（[Alexander Tokmakov](https://github.com/tavplubix)）。
* 默认强制将逗号连接重写为内连接（将默认值设为 `cross_to_inner_join_rewrite = 2`）。如需旧行为，请设置 `cross_to_inner_join_rewrite = 1`。[#39326](https://github.com/ClickHouse/ClickHouse/pull/39326)（[Vladimir C](https://github.com/vdimir)）。如果遇到兼容性问题，可以改回此设置。

<h4 id="new-feature-5">
  新功能
</h4>

* 支持包含窗口函数的表达式。关闭 [#19857](https://github.com/ClickHouse/ClickHouse/issues/19857)。[#37848](https://github.com/ClickHouse/ClickHouse/pull/37848)（[Dmitry Novik](https://github.com/novikd)）。
* 为 `EmbeddedRocksDB` 表新增 `direct` 连接算法，参见 [#33582](https://github.com/ClickHouse/ClickHouse/issues/33582)。[#35363](https://github.com/ClickHouse/ClickHouse/pull/35363)（[Vladimir C](https://github.com/vdimir)）。
* 新增全排序合并连接算法。[#35796](https://github.com/ClickHouse/ClickHouse/pull/35796)（[Vladimir C](https://github.com/vdimir)）。
* 实现 NATS 表引擎，允许向 NATS 发布消息和订阅消息。关闭 [#32388](https://github.com/ClickHouse/ClickHouse/issues/32388)。[#37171](https://github.com/ClickHouse/ClickHouse/pull/37171)（[tchepavel](https://github.com/tchepavel)）。（[Kseniia Sumarokova](https://github.com/kssenii)）
* 实现 `mongodb` 表函数。允许写入 `MongoDB` 存储/表函数。[#37213](https://github.com/ClickHouse/ClickHouse/pull/37213)（[aaapetrenko](https://github.com/aaapetrenko)）。（[Kseniia Sumarokova](https://github.com/kssenii)）
* 新增 `SQLInsert` 输出格式。关闭 [#38441](https://github.com/ClickHouse/ClickHouse/issues/38441)。[#38477](https://github.com/ClickHouse/ClickHouse/pull/38477)（[Kruglov Pavel](https://github.com/Avogar)）。
* 引入 `additional_table_filters` 设置，可以为表指定读取后立即应用的额外筛选条件。例如：`select number, x, y from (select number from system.numbers limit 5) f any left join (select x, y from table_1) s on f.number = s.x settings additional_table_filters={'system.numbers : 'number != 3', 'table_1' : 'x != 2'}`。引入 `additional_result_filter` 设置，用于指定查询结果的额外筛选条件。关闭 [#37918](https://github.com/ClickHouse/ClickHouse/issues/37918)。[#38475](https://github.com/ClickHouse/ClickHouse/pull/38475)（[Nikolai Kochetov](https://github.com/KochetovNicolai)）。
* 新增 `compatibility` 设置和 `system.settings_changes` 系统表，后者包含 ClickHouse 各版本中设置变更的信息。关闭 [#35972](https://github.com/ClickHouse/ClickHouse/issues/35972)。[#38957](https://github.com/ClickHouse/ClickHouse/pull/38957)（[Kruglov Pavel](https://github.com/Avogar)）。
* 新增函数 `translate(string, from_string, to_string)` 和 `translateUTF8(string, from_string, to_string)`，用于将某些字符转换为其他字符。[#38935](https://github.com/ClickHouse/ClickHouse/pull/38935)（[Nikolay Degterinsky](https://github.com/evillique)）。
* 支持 `parseTimeDelta` 函数。可以使用 ` ;-+,:` 作为分隔符，例如 `1yr-2mo`、`2m:6s`：`SELECT parseTimeDelta('1yr-2mo-4w + 12 days, 3 hours : 1 minute ; 33 seconds')`。[#39071](https://github.com/ClickHouse/ClickHouse/pull/39071)（[jiahui-97](https://github.com/jiahui-97)）。
* 新增 `CREATE TABLE ... EMPTY AS SELECT` 查询。它会从 SELECT 查询自动推导表结构，但创建后不填充表。解决 [#38049](https://github.com/ClickHouse/ClickHouse/issues/38049)。[#38272](https://github.com/ClickHouse/ClickHouse/pull/38272)（[Alexander Tokmakov](https://github.com/tavplubix)）。
* 新增限制远程存储 I/O 操作的选项：`max_remote_read_network_bandwidth_for_server` 和 `max_remote_write_network_bandwidth_for_server`。[#39095](https://github.com/ClickHouse/ClickHouse/pull/39095)（[Sergei Trifonov](https://github.com/serxa)）。
* 新增 `group_by_use_nulls` 设置，使 ROLLUP、CUBE 和 GROUPING SETS 中的聚合键列可为空。关闭 [#37359](https://github.com/ClickHouse/ClickHouse/issues/37359)。[#38642](https://github.com/ClickHouse/ClickHouse/pull/38642)（[Dmitry Novik](https://github.com/novikd)）。
* 支持在导出数据时指定压缩级别。[#38907](https://github.com/ClickHouse/ClickHouse/pull/38907)（[Nikolay Degterinsky](https://github.com/evillique)）。
* 新增选项，要求从 `system` 数据库执行 SELECT 时具备显式授权。详情：[#38970](https://github.com/ClickHouse/ClickHouse/pull/38970)（[Vitaly Baranov](https://github.com/vitlibar)）。
* 函数 `multiMatchAny`、`multiMatchAnyIndex`、`multiMatchAllIndices` 及其模糊匹配变体现在接受非常量的模式数组参数。[#38485](https://github.com/ClickHouse/ClickHouse/pull/38485)（[Robert Schulze](https://github.com/rschu1ze)）。SQL 函数 `multiSearchAllPositions` 现在接受非常量的待查找字符串参数。[#39167](https://github.com/ClickHouse/ClickHouse/pull/39167)（[Robert Schulze](https://github.com/rschu1ze)）。
* 新增 `zstd_window_log_max` 设置，用于配置导入外部文件时 zstd 解码的最大内存使用量。关闭 [#35693](https://github.com/ClickHouse/ClickHouse/issues/35693)。[#37015](https://github.com/ClickHouse/ClickHouse/pull/37015)（[wuxiaobai24](https://github.com/wuxiaobai24)）。
* 新增 `send_logs_source_regexp` 设置，发送日志来源名称匹配指定正则表达式的服务器文本日志。空值表示所有来源。[#39161](https://github.com/ClickHouse/ClickHouse/pull/39161)（[Amos Bird](https://github.com/amosbird)）。
* 支持对 `Hive` 表执行 `ALTER`。[#38214](https://github.com/ClickHouse/ClickHouse/pull/38214)（[lgbo](https://github.com/lgbo-ustc)）。
* 支持 `isNullable` 函数，检查参数是否可为空并返回 1 或 0。关闭 [#38611](https://github.com/ClickHouse/ClickHouse/issues/38611)。[#38841](https://github.com/ClickHouse/ClickHouse/pull/38841)（[lokax](https://github.com/lokax)）。
* 新增 base58 编码/解码函数。[#38159](https://github.com/ClickHouse/ClickHouse/pull/38159)（[Andrey Zvonov](https://github.com/zvonand)）。
* 为 Play UI 添加图表可视化。[#38197](https://github.com/ClickHouse/ClickHouse/pull/38197)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 为数组和元组新增 L2 平方距离与范数函数。[#38545](https://github.com/ClickHouse/ClickHouse/pull/38545)（[Julian Gilyadov](https://github.com/israelg99)）。
* 支持通过 SQL 向 `url` 表函数/存储传递 HTTP 标头。关闭 [#37897](https://github.com/ClickHouse/ClickHouse/issues/37897)。[#38176](https://github.com/ClickHouse/ClickHouse/pull/38176)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 将 `clickhouse-diagnostics` 二进制文件加入软件包。[#38647](https://github.com/ClickHouse/ClickHouse/pull/38647)（[Mikhail f. Shiryaev](https://github.com/Felixoid)）。

<h4 id="experimental-feature-4">
  实验性功能
</h4>

* 新增 `implicit_transaction` 设置，用于在事务内运行独立查询。它会自动创建和结束事务：查询成功时 COMMIT，失败时 ROLLBACK。[#38344](https://github.com/ClickHouse/ClickHouse/pull/38344)（[Raúl Marín](https://github.com/Algunenano)）。

<h4 id="performance-improvement-5">
  性能改进
</h4>

* 优化已排序列的 DISTINCT。当输入流按 DISTINCT 中的列排序时，使用专门的去重转换。此优化可应用于预去重、最终去重或两者。初始实现由 @dimarub2000 完成。[#37803](https://github.com/ClickHouse/ClickHouse/pull/37803)（[Igor Nikonov](https://github.com/devcrafter)）。
* 使用批量版 `BinaryHeap` 提升 `ORDER BY`、`MergeTree` 合并和窗口函数的性能。[#38022](https://github.com/ClickHouse/ClickHouse/pull/38022)（[Maksim Kita](https://github.com/kitaisreal)）。
* 提高带 `FINAL` 的查询的并行执行程度。[#36396](https://github.com/ClickHouse/ClickHouse/pull/36396)（[Nikita Taranov](https://github.com/nickitat)）。
* 修复由 [#35616](https://github.com/ClickHouse/ClickHouse/pull/35616) 引入的严重连接性能退化。有趣的是，SSB 等常见连接查询的速度变慢了 10 倍，持续近 3 个月却无人反馈。[#38052](https://github.com/ClickHouse/ClickHouse/pull/38052)（[Amos Bird](https://github.com/amosbird)）。
* 从 Intel hyperscan 库迁移至 vectorscan，加快非 x86 平台上的许多字符串匹配操作。[#38171](https://github.com/ClickHouse/ClickHouse/pull/38171)（[Robert Schulze](https://github.com/rschu1ze)）。
* 提高聚合之后执行的查询计划步骤的并行度。[#38295](https://github.com/ClickHouse/ClickHouse/pull/38295)（[Nikita Taranov](https://github.com/nickitat)）。
* 提升向 `JSON` 类型列插入数据的性能。[#38320](https://github.com/ClickHouse/ClickHouse/pull/38320)（[Anton Popov](https://github.com/CurtizJ)）。
* 优化 HashTable 中的插入和查找。[#38413](https://github.com/ClickHouse/ClickHouse/pull/38413)（[Nikita Taranov](https://github.com/nickitat)）。
* 修复 [#32493](https://github.com/ClickHouse/ClickHouse/issues/32493) 引起的性能退化。[#38417](https://github.com/ClickHouse/ClickHouse/pull/38417)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 使用 SIMD 指令提升数字列连接的性能。[#37235](https://github.com/ClickHouse/ClickHouse/pull/37235)（[zzachimed](https://github.com/zzachimed)）。[#38565](https://github.com/ClickHouse/ClickHouse/pull/38565)（[Maksim Kita](https://github.com/kitaisreal)）。
* 数组范数和距离函数的速度提高至原来的 1.2–2 倍。[#38740](https://github.com/ClickHouse/ClickHouse/pull/38740)（[Alexander Gololobov](https://github.com/davenger)）。
* 为 LZ4 解压新增经过 AVX-512 VBMI 优化的 `copyOverlap32Shuffle`。也就是说，LZ4 解压性能得到提升。[#37891](https://github.com/ClickHouse/ClickHouse/pull/37891)（[Guo Wangyang](https://github.com/guowangy)）。
* `ORDER BY (a, b)` 将获得与 `ORDER BY a, b` 相同的所有优化收益。[#38873](https://github.com/ClickHouse/ClickHouse/pull/38873)（[Igor Nikonov](https://github.com/devcrafter)）。
* 在 32 字节边界内对齐分支，以提高基准测试稳定性。[#38988](https://github.com/ClickHouse/ClickHouse/pull/38988)（[Guo Wangyang](https://github.com/guowangy)）。这使 Intel 平台的平均性能提高 1–2%。
* 可执行 UDF、可执行字典和 Executable 表在等待子进程终止时，不再额外浪费一秒钟。[#38929](https://github.com/ClickHouse/ClickHouse/pull/38929)（[Constantine Peresypkin](https://github.com/pkit)）。
* 未选取全部列时，优化对 `system.stack_trace` 表的访问。[#39177](https://github.com/ClickHouse/ClickHouse/pull/39177)（[Azat Khuzhin](https://github.com/azat)）。
* 提升 LowCardinality 参数下 isNullable/isConstant/isNull/isNotNull 的性能。[#39192](https://github.com/ClickHouse/ClickHouse/pull/39192)（[Kruglov Pavel](https://github.com/Avogar)）。
* 优化窗口函数中 ORDER BY 的处理。[#34632](https://github.com/ClickHouse/ClickHouse/pull/34632)（[Vladimir Chebotarev](https://github.com/excitoon)）。
* 进一步优化 `system.asynchronous_metric_log` 表的存储空间。关闭 [#38134](https://github.com/ClickHouse/ClickHouse/issues/38134)。参见 [YouTube video](https://www.youtube.com/watch?v=0fSp9SF8N8A)。[#38428](https://github.com/ClickHouse/ClickHouse/pull/38428)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。

<h4 id="improvement-5">
  改进
</h4>

* 支持 SQL 标准的 CREATE INDEX 和 DROP INDEX 语法。[#35166](https://github.com/ClickHouse/ClickHouse/pull/35166)（[Jianmei Zhang](https://github.com/zhangjmruc)）。
* 为 INSERT 查询发送性能事件（此前仅支持 SELECT）。[#37391](https://github.com/ClickHouse/ClickHouse/pull/37391)（[Azat Khuzhin](https://github.com/azat)）。
* 为完全物化的投影实现有序聚合（`optimize_aggregation_in_order`）。[#37469](https://github.com/ClickHouse/ClickHouse/pull/37469)（[Azat Khuzhin](https://github.com/azat)）。
* 移除 Kerberos 初始化时的子进程运行。新增集成测试。关闭 [#27651](https://github.com/ClickHouse/ClickHouse/issues/27651)。[#38105](https://github.com/ClickHouse/ClickHouse/pull/38105)（[Roman Vasin](https://github.com/rvasin)）。
* * 新增 `multiple_joins_try_to_keep_original_names` 设置，使多重 JOIN 重写时不重写标识符名称，关闭 [#34697](https://github.com/ClickHouse/ClickHouse/issues/34697)。[#38149](https://github.com/ClickHouse/ClickHouse/pull/38149)（[Vladimir C](https://github.com/vdimir)）。
* 改进 trace-visualizer 的用户体验。[#38169](https://github.com/ClickHouse/ClickHouse/pull/38169)（[Sergei Trifonov](https://github.com/serxa)）。
* 为 AArch64 启用堆栈跟踪收集和查询性能分析器。[#38181](https://github.com/ClickHouse/ClickHouse/pull/38181)（[Maksim Kita](https://github.com/kitaisreal)）。
* 加载 SQL 用户定义函数时，不再跳过 `user_defined` 目录中的符号链接。关闭 [#38042](https://github.com/ClickHouse/ClickHouse/issues/38042)。[#38184](https://github.com/ClickHouse/ClickHouse/pull/38184)（[Maksim Kita](https://github.com/kitaisreal)）。
* 新增 `store/` 子目录的后台清理。某些情况下，clickhouse-server 可能在 `store/` 留下垃圾子目录（例如创建表失败），而这些目录此前始终不会被删除。修复 [#33710](https://github.com/ClickHouse/ClickHouse/issues/33710)。[#38265](https://github.com/ClickHouse/ClickHouse/pull/38265)（[Alexander Tokmakov](https://github.com/tavplubix)）。
* 新增 `DESCRIBE CACHE` 查询，用于显示配置中的缓存设置。新增 `SHOW CACHES` 查询，用于显示可用文件系统缓存列表。[#38279](https://github.com/ClickHouse/ClickHouse/pull/38279)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 为 `system drop filesystem cache` 添加访问权限检查，并支持 ON CLUSTER。[#38319](https://github.com/ClickHouse/ClickHouse/pull/38319)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复从 21.3 升级到 22.3 时 PostgreSQL 数据库引擎的不兼容问题。关闭 [#36659](https://github.com/ClickHouse/ClickHouse/issues/36659)。[#38369](https://github.com/ClickHouse/ClickHouse/pull/38369)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* `filesystemAvailable` 等函数现在可以在 `clickhouse-local` 中使用。关闭 [#38423](https://github.com/ClickHouse/ClickHouse/issues/38423)。[#38424](https://github.com/ClickHouse/ClickHouse/pull/38424)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 新增 `revision` 函数。[#38555](https://github.com/ClickHouse/ClickHouse/pull/38555)（[Azat Khuzhin](https://github.com/azat)）。
* 修复通过代理隧道使用 GCS 的问题。[#38726](https://github.com/ClickHouse/ClickHouse/pull/38726)（[Azat Khuzhin](https://github.com/azat)）。
* 在 clickhouse client / local 中支持 `\i file`（类似于 psql 的 \i）。[#38813](https://github.com/ClickHouse/ClickHouse/pull/38813)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 在 `EXPLAIN AST` 中新增 `optimize = 1` 选项。启用时显示重写后的 AST，否则显示原始查询的 AST。默认禁用。[#38910](https://github.com/ClickHouse/ClickHouse/pull/38910)（[Igor Nikonov](https://github.com/devcrafter)）。
* 允许列列表末尾带逗号。关闭 [#38425](https://github.com/ClickHouse/ClickHouse/issues/38425)。[#38440](https://github.com/ClickHouse/ClickHouse/pull/38440)（[chen](https://github.com/xiedeyantu)）。
* 修复 `parallel_hash` JOIN 方法的错误并提升性能。[#37648](https://github.com/ClickHouse/ClickHouse/pull/37648)（[Vladimir C](https://github.com/vdimir)）。
* 支持 Hadoop 安全 RPC 传输（hadoop.rpc.protection=privacy 和 hadoop.rpc.protection=integrity）。[#37852](https://github.com/ClickHouse/ClickHouse/pull/37852)（[Peng Liu](https://github.com/michael1589)）。
* 为 `StorageHive` 添加结构体类型支持。[#38118](https://github.com/ClickHouse/ClickHouse/pull/38118)（[lgbo](https://github.com/lgbo-ustc)）。
* 现在使用 `RemoveObjectRequest` 删除单个 S3 对象。实现与 GCP 的兼容：此前 GCP 不允许使用 `removeFileIfExists`，导致约一半的 `remove` 功能失效。自动检测 GCS 不支持的 `DeleteObjects` S3 API，从而无需在配置中显式指定 `support_batch_delete=0` 即可使用 GCS。[#37882](https://github.com/ClickHouse/ClickHouse/pull/37882)（[Vladimir Chebotarev](https://github.com/excitoon)）。
* 通过 ProfileEvents 和 CurrentMetrics 公开 ClickHouse Keeper 的基本监控数据。[#38072](https://github.com/ClickHouse/ClickHouse/pull/38072)（[lingpeng0314](https://github.com/lingpeng0314)）。
* 为 PostgreSQL 引擎连接支持 `auto_close` 选项。关闭 [#31486](https://github.com/ClickHouse/ClickHouse/issues/31486)。[#38363](https://github.com/ClickHouse/ClickHouse/pull/38363)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 允许在表函数的列声明中使用 `NULL` 修饰符。[#38816](https://github.com/ClickHouse/ClickHouse/pull/38816)（[Kruglov Pavel](https://github.com/Avogar)）。
* 关闭前停用 `mutations_finalizing_task`，避免关闭过程中出现无害的 `TABLE_IS_READ_ONLY` 错误。[#38851](https://github.com/ClickHouse/ClickHouse/pull/38851)（[Raúl Marín](https://github.com/Algunenano)）。
* 使用已弃用的 Ordinary 数据库时，如果存在 INSERT 查询，消除 ALTER 查询之后 SELECT 查询不必要的等待。[#38864](https://github.com/ClickHouse/ClickHouse/pull/38864)（[Azat Khuzhin](https://github.com/azat)）。
* 在 `EXPLAIN AST` 中新增 `rewrite` 选项。启用时显示重写后的 AST，否则显示原始查询的 AST。默认禁用。[#38910](https://github.com/ClickHouse/ClickHouse/pull/38910)（[Igor Nikonov](https://github.com/devcrafter)）。
* ZooKeeper 的 “Node exists” 异常符合预期时，不再将其报告到 system.errors。[#38961](https://github.com/ClickHouse/ClickHouse/pull/38961)（[Raúl Marín](https://github.com/Algunenano)）。
* `clickhouse-keeper`：支持实时摘要计算和校验，默认禁用。[#37555](https://github.com/ClickHouse/ClickHouse/pull/37555)（[Antonio Andelic](https://github.com/antonio2368)）。
* 允许在 `clickhouse-extract-from-config` 工具的键中指定通配符 `* or {expr1, expr2, expr3}`。[#38966](https://github.com/ClickHouse/ClickHouse/pull/38966)（[Nikita Mikhaylov](https://github.com/nikitamikhaylov)）。
* clearOldLogs：并发删除时不再报告 KEEPER\_EXCEPTION。[#39016](https://github.com/ClickHouse/ClickHouse/pull/39016)（[Raúl Marín](https://github.com/Algunenano)）。
* clickhouse-keeper 改进：将 Keeper 服务器的元信息持久化到磁盘。[#39069](https://github.com/ClickHouse/ClickHouse/pull/39069)（[Antonio Andelic](https://github.com/antonio2368)）。这将方便同时关闭或重启所有 Keeper 节点时的运维操作。
* 使用文件系统缓存时，如果磁盘空间耗尽，则继续执行而不抛出异常。[#39106](https://github.com/ClickHouse/ClickHouse/pull/39106)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 处理来自 k8s 的 SIGTERM 信号。[#39130](https://github.com/ClickHouse/ClickHouse/pull/39130)（[Timur Solodovnikov](https://github.com/tsolodov)）。
* 为 system.part\_log 新增 `merge_algorithm` 列（Undecided、Horizontal、Vertical）。[#39181](https://github.com/ClickHouse/ClickHouse/pull/39181)（[Azat Khuzhin](https://github.com/azat)）。
* 磁盘不是机械磁盘时，不再增加 `system.errors` 中的计数器。[#39216](https://github.com/ClickHouse/ClickHouse/pull/39216)（[Raúl Marín](https://github.com/Algunenano)）。
* `system.query_log` 中 `INSERT` 查询的 `result_bytes` 指标现在显示插入字节数。此前此值不正确，与 `result_rows` 相同。[#39225](https://github.com/ClickHouse/ClickHouse/pull/39225)（[Ilya Yatsishin](https://github.com/qoega)）。
* 改进 clickhouse-client 中 CPU 使用率指标的显示。修复 [#38756](https://github.com/ClickHouse/ClickHouse/issues/38756)。[#39280](https://github.com/ClickHouse/ClickHouse/pull/39280)（[Sergei Trifonov](https://github.com/serxa)）。
* 服务器启动时重新抛出文件系统缓存初始化异常，并提供更清楚的错误消息。[#39386](https://github.com/ClickHouse/ClickHouse/pull/39386)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* OpenTelemetry 现在默认收集不含处理器 span 的跟踪（因为处理器 span 太多）。可通过 `opentelemetry_trace_processors` 设置启用处理器 span 收集。[#39170](https://github.com/ClickHouse/ClickHouse/pull/39170)（[Ilya Yatsishin](https://github.com/qoega)）。
* 函数 `multiMatch[Fuzzy](AllIndices/Any/AnyIndex)`：待查找字符串参数为空时，不再抛出逻辑错误。[#39012](https://github.com/ClickHouse/ClickHouse/pull/39012)（[Robert Schulze](https://github.com/rschu1ze)）。
* 允许声明 `RabbitMQ` 队列时不使用默认参数 `x-max-length` 和 `x-overflow`。[#39259](https://github.com/ClickHouse/ClickHouse/pull/39259)（[rnbondarenko](https://github.com/rnbondarenko)）。

<h4 id="buildtestingpackaging-improvement-5">
  构建/测试/打包改进
</h4>

* 为 ClickHouse 应用 Clang 线程安全分析（TSA）注解。[#38068](https://github.com/ClickHouse/ClickHouse/pull/38068)（[Robert Schulze](https://github.com/rschu1ze)）。
* 使通用安装脚本适配 FreeBSD。[#39302](https://github.com/ClickHouse/ClickHouse/pull/39302)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 为在 `s390x` 平台构建做准备。[#39193](https://github.com/ClickHouse/ClickHouse/pull/39193)（[Harry Lee](https://github.com/HarryLeeIBM)）。
* 修复 `jemalloc` 库中的一个错误。[#38757](https://github.com/ClickHouse/ClickHouse/pull/38757)（[Azat Khuzhin](https://github.com/azat)）。
* 硬件基准测试现在支持自动上传结果。[#38427](https://github.com/ClickHouse/ClickHouse/pull/38427)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 系统表 “system.licenses” 现在可在 Mac（Darwin）上正确填充。[#38294](https://github.com/ClickHouse/ClickHouse/pull/38294)（[Robert Schulze](https://github.com/rschu1ze)）。
* 将 `all|noarch` 软件包改为与架构相关；修复相关文档；向 Artifactory 和 Release 资源上传 aarch64|arm64 软件包。修复 [#36443](https://github.com/ClickHouse/ClickHouse/issues/36443)。[#38580](https://github.com/ClickHouse/ClickHouse/pull/38580)（[Mikhail f. Shiryaev](https://github.com/Felixoid)）。

<h4 id="bug-fix-user-visible-misbehavior-in-official-stable-or-prestable-release-3">
  错误修复 (user-visible misbehavior in official stable or prestable release)
</h4>

* 修复小数位数超过 19 位的 `Decimal128/Decimal256` 的舍入。[#38027](https://github.com/ClickHouse/ClickHouse/pull/38027)（[Igor Nikonov](https://github.com/devcrafter)）。
* 修复 `Hive` 存储（集成表引擎）中的数据竞争导致的崩溃。[#38887](https://github.com/ClickHouse/ClickHouse/pull/38887)（[lgbo](https://github.com/lgbo-ustc)）。
* 修复通过 ON CLUSTER 执行 GRANT ALL ON *.* 时的崩溃。该问题由 [https://github.com/ClickHouse/ClickHouse/pull/35767](https://github.com/ClickHouse/ClickHouse/pull/35767) 引入。关闭 [#38618](https://github.com/ClickHouse/ClickHouse/issues/38618)。[#38674](https://github.com/ClickHouse/ClickHouse/pull/38674)（[Vitaly Baranov](https://github.com/vitlibar)）。
* 修正 `{0..10}` 形式的通配符展开。修复 [#38498](https://github.com/ClickHouse/ClickHouse/issues/38498)。当前实现类似于 @rschu1ze 在 [here](https://github.com/ClickHouse/ClickHouse/pull/38502#issuecomment-1169057723) 中提到的 shell 行为。[#38502](https://github.com/ClickHouse/ClickHouse/pull/38502)（[Heena Bansal](https://github.com/HeenaBansal2009)）。
* 修复 `mapUpdate`、`mapFilter` 使用常量 Map 参数时的崩溃。关闭 [#38547](https://github.com/ClickHouse/ClickHouse/issues/38547)。[#38553](https://github.com/ClickHouse/ClickHouse/pull/38553)（[hexiaoting](https://github.com/hexiaoting)）。
* 修复查询优化使用的 `toHour` 单调性信息错误，该错误可能导致查询结果不正确（索引分析不正确）。修复 [#38333](https://github.com/ClickHouse/ClickHouse/issues/38333)。[#38675](https://github.com/ClickHouse/ClickHouse/pull/38675)（[Amos Bird](https://github.com/amosbird)）。
* 修复对 s3 存储是否支持并行写入的检查错误，该错误导致 s3 并行写入无法工作。[#38792](https://github.com/ClickHouse/ClickHouse/pull/38792)（[chen](https://github.com/xiedeyantu)）。
* 修复使用并行读取缓冲区进行 s3 可定位读取的问题（会影响查询期间的内存使用）。关闭 [#38258](https://github.com/ClickHouse/ClickHouse/issues/38258)。[#38802](https://github.com/ClickHouse/ClickHouse/pull/38802)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 更新 `simdjson`，修复 [#38621](https://github.com/ClickHouse/ClickHouse/issues/38621)：在采用支持 AVX-512 VBMI 的最新 Intel CPU 的机器上发生缓冲区溢出。[#38838](https://github.com/ClickHouse/ClickHouse/pull/38838)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复垂直合并中可能出现的逻辑错误。[#38859](https://github.com/ClickHouse/ClickHouse/pull/38859)（[Maksim Kita](https://github.com/kitaisreal)）。
* 修复以秒为单位的设置配置档案。[#38896](https://github.com/ClickHouse/ClickHouse/pull/38896)（[Raúl Marín](https://github.com/Algunenano)）。
* 修复存在可空分区键时分区裁剪不正确的问题。注意：你很可能不会使用可空分区键——这是一项不应使用的冷僻功能。可空键并不合理，此功能只用于一些极不寻常的使用场景。修复 [#38941](https://github.com/ClickHouse/ClickHouse/issues/38941)。[#38946](https://github.com/ClickHouse/ClickHouse/pull/38946)（[Amos Bird](https://github.com/amosbird)）。
* 改进获取数据片段时的 `fsync_part_directory`。[#38993](https://github.com/ClickHouse/ClickHouse/pull/38993)（[Azat Khuzhin](https://github.com/azat)）。
* 修复 `OvercommitTracker` 内部可能发生的死锁。修复 [#37794](https://github.com/ClickHouse/ClickHouse/issues/37794)。[#39030](https://github.com/ClickHouse/ClickHouse/pull/39030)（[Dmitry Novik](https://github.com/novikd)）。
* 修复文件系统缓存在某些边界情况恰好遇到缓存容量达到上限时可能发生的错误。关闭 [#39066](https://github.com/ClickHouse/ClickHouse/issues/39066)。[#39070](https://github.com/ClickHouse/ClickHouse/pull/39070)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复窗口表达式参数解释的一些边界情况。修复 [#38538](https://github.com/ClickHouse/ClickHouse/issues/38538)。允许在窗口表达式中使用高阶函数。[#39112](https://github.com/ClickHouse/ClickHouse/pull/39112)（[Dmitry Novik](https://github.com/novikd)）。
* 在 `tuple` 函数中保留 `LowCardinality` 类型。此前会移除 `LowCardinality` 类型，创建的元组元素采用 `LowCardinality` 的底层类型。[#39113](https://github.com/ClickHouse/ClickHouse/pull/39113)（[Anton Popov](https://github.com/CurtizJ)）。
* 修复向附带 MATERIALIZED VIEW 的表插入数据且启用 `extremes = 1` 设置时，可能发生的 `Block structure mismatch` 错误。关闭 [#29759](https://github.com/ClickHouse/ClickHouse/issues/29759) 和 [#38729](https://github.com/ClickHouse/ClickHouse/issues/38729)。[#39125](https://github.com/ClickHouse/ClickHouse/pull/39125)（[Nikolai Kochetov](https://github.com/KochetovNicolai)）。
* 修复同时将 `optimize_trivial_count_query` 和 `empty_result_for_aggregation_by_empty_set` 设为 true 时的意外查询结果。修复 [#39140](https://github.com/ClickHouse/ClickHouse/issues/39140)。[#39155](https://github.com/ClickHouse/ClickHouse/pull/39155)（[Amos Bird](https://github.com/amosbird)）。
* 修复同时使用 `PREWHERE` 和有序读取优化的 SELECT 查询出现 `Not found column Type in block` 错误的问题。[#39157](https://github.com/ClickHouse/ClickHouse/pull/39157)（[Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)）。
* 修复远程文件系统创建硬链接时极少发生的竞争条件，只有并发运行备份才能复现。[#39190](https://github.com/ClickHouse/ClickHouse/pull/39190)（[alesapin](https://github.com/alesapin)）。
* （零拷贝复制是实验性功能，不应在生产环境使用。）修复启用 `allow_remote_fs_zero_copy_replication` 时获取内存数据片段的问题。[#39214](https://github.com/ClickHouse/ClickHouse/pull/39214)（[Azat Khuzhin](https://github.com/azat)）。
* （MaterializedPostgreSQL 是实验性功能。）修复 MaterializedPostgreSQL 数据库引擎在复制初始化发生异常时可能出现的段错误。关闭 [#36939](https://github.com/ClickHouse/ClickHouse/issues/36939)。[#39272](https://github.com/ClickHouse/ClickHouse/pull/39272)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复从 PostgreSQL 数据库引擎获取表元数据不正确的问题。关闭 [#33502](https://github.com/ClickHouse/ClickHouse/issues/33502)。[#39283](https://github.com/ClickHouse/ClickHouse/pull/39283)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复聚合键被其他函数包裹时发生的投影异常。修复 [#37151](https://github.com/ClickHouse/ClickHouse/issues/37151)。[#37155](https://github.com/ClickHouse/ClickHouse/pull/37155)（[Amos Bird](https://github.com/amosbird)）。
* 修复部分函数可能出现的逻辑错误 `... with argument with type Nothing and default implementation for Nothing is expected to return result with type Nothing, got ...`。关闭 [#37610](https://github.com/ClickHouse/ClickHouse/issues/37610)。关闭 [#37741](https://github.com/ClickHouse/ClickHouse/issues/37741)。[#37759](https://github.com/ClickHouse/ClickHouse/pull/37759)（[Kruglov Pavel](https://github.com/Avogar)）。
* 修复 UNION 子查询中的列顺序错误（子查询中有重复列时可能产生错误结果）。[#37887](https://github.com/ClickHouse/ClickHouse/pull/37887)（[Azat Khuzhin](https://github.com/azat)）。
* 修复列名包含点号时 MODIFY ALTER Column 行为不正确的问题。关闭 [#37907](https://github.com/ClickHouse/ClickHouse/issues/37907)。[#37971](https://github.com/ClickHouse/ClickHouse/pull/37971)（[Kruglov Pavel](https://github.com/Avogar)）。
* 修复从数据存储在 S3 中的 `MergeTree` 表读取稀疏列的问题。[#37978](https://github.com/ClickHouse/ClickHouse/pull/37978)（[Anton Popov](https://github.com/CurtizJ)）。
* 修复从配置中移除副本时，`Distributed` 异步插入可能发生的崩溃。[#38029](https://github.com/ClickHouse/ClickHouse/pull/38029)（[Nikolai Kochetov](https://github.com/KochetovNicolai)）。
* 修复 GLOBAL JOIN 使用无别名 CTE 时的 “Missing columns” 错误。[#38056](https://github.com/ClickHouse/ClickHouse/pull/38056)（[Azat Khuzhin](https://github.com/azat)）。
* 在向后兼容模式下，将元组函数重写为字面量。[#38096](https://github.com/ClickHouse/ClickHouse/pull/38096)（[Anton Kozlov](https://github.com/tonickkozlov)）。
* 修复 `ORDER BY` 过程中为输出数据块预留冗余内存的问题。[#38127](https://github.com/ClickHouse/ClickHouse/pull/38127)（[iyupeng](https://github.com/iyupeng)）。
* 修复数组映射函数中可能出现的逻辑错误 `Bad cast from type DB::IColumn* to DB::ColumnNullable*`。关闭 [#38006](https://github.com/ClickHouse/ClickHouse/issues/38006)。[#38132](https://github.com/ClickHouse/ClickHouse/pull/38132)（[Kruglov Pavel](https://github.com/Avogar)）。
* 修复部分合并连接中的临时名称冲突，关闭 [#37928](https://github.com/ClickHouse/ClickHouse/issues/37928)。[#38135](https://github.com/ClickHouse/ClickHouse/pull/38135)（[Vladimir C](https://github.com/vdimir)）。
* 修复 `CREATE TABLE nested_name_tuples (`a` Tuple(x String, y Tuple(i Int32, j String))) ENGINE = Memory;` 这类查询的一些小问题。[#38136](https://github.com/ClickHouse/ClickHouse/pull/38136)（[lgbo](https://github.com/lgbo-ustc)）。
* 修复嵌套短路函数在条件为 false 时仍执行参数的问题。关闭 [#38040](https://github.com/ClickHouse/ClickHouse/issues/38040)。[#38173](https://github.com/ClickHouse/ClickHouse/pull/38173)（[Kruglov Pavel](https://github.com/Avogar)）。
* （Window View 是实验性功能。）修复结构不正确的 WINDOW VIEW 引发的 LOGICAL\_ERROR。[#38205](https://github.com/ClickHouse/ClickHouse/pull/38205)（[Azat Khuzhin](https://github.com/azat)）。
* 更新 librdkafka 子模块，修复设置 OAUTHBEARER 刷新回调时发生的崩溃。[#38225](https://github.com/ClickHouse/ClickHouse/pull/38225)（[Rafael Acevedo](https://github.com/racevedoo)）。
* 修复向 Distributed 执行 INSERT 因 ProfileEvents 而挂起的问题。[#38307](https://github.com/ClickHouse/ClickHouse/pull/38307)（[Azat Khuzhin](https://github.com/azat)）。
* 修复 PostgreSQL 引擎的重试。[#38310](https://github.com/ClickHouse/ClickHouse/pull/38310)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复 PartialSortingTransform 中的优化问题（SIGSEGV 及可能的错误结果）。[#38324](https://github.com/ClickHouse/ClickHouse/pull/38324)（[Azat Khuzhin](https://github.com/azat)）。
* 修复 RabbitMQ 使用基于 PeekableReadBuffer 的格式时的问题。关闭 [#38061](https://github.com/ClickHouse/ClickHouse/issues/38061)。[#38356](https://github.com/ClickHouse/ClickHouse/pull/38356)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* MaterializedPostgreSQL 是实验性功能。修复其中可能出现的 `Invalid number of rows in Chunk`。关闭 [#37323](https://github.com/ClickHouse/ClickHouse/issues/37323)。[#38360](https://github.com/ClickHouse/ClickHouse/pull/38360)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复使用连接字符串设置的 RabbitMQ 配置。关闭 [#36531](https://github.com/ClickHouse/ClickHouse/issues/36531)。[#38365](https://github.com/ClickHouse/ClickHouse/pull/38365)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复 PostgreSQL 引擎获取数组维度大小时未使用 PostgreSQL 模式的问题。关闭 [#36755](https://github.com/ClickHouse/ClickHouse/issues/36755)。关闭 [#36772](https://github.com/ClickHouse/ClickHouse/issues/36772)。[#38366](https://github.com/ClickHouse/ClickHouse/pull/38366)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复带 `DISTINCT` 和 `LIMIT` 的分布式查询可能返回不正确结果的问题。修复 [#38282](https://github.com/ClickHouse/ClickHouse/issues/38282)。[#38371](https://github.com/ClickHouse/ClickHouse/pull/38371)（[Anton Popov](https://github.com/CurtizJ)）。
* 修复 countSubstrings() 和 position() 在模式包含零字节时返回错误结果的问题。[#38589](https://github.com/ClickHouse/ClickHouse/pull/38589)（[Robert Schulze](https://github.com/rschu1ze)）。
* 现在，即使表中 IPv4/IPv6 表示值不正确，也可以启动 clickhouse-server 并附加/分离表。这是对问题 [#35156](https://github.com/ClickHouse/ClickHouse/issues/35156) 的正确修复。[#38590](https://github.com/ClickHouse/ClickHouse/pull/38590)（[alesapin](https://github.com/alesapin)）。
* `rankCorr` 函数在部分参数为 NaN 时也能正确工作。关闭 [#38396](https://github.com/ClickHouse/ClickHouse/issues/38396)。[#38722](https://github.com/ClickHouse/ClickHouse/pull/38722)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复同时设置 `parallel_view_processing=1` 和 `optimize_trivial_insert_select=1` 时的问题。修复向视图推送数据时的 `max_insert_threads`。[#38731](https://github.com/ClickHouse/ClickHouse/pull/38731)（[Azat Khuzhin](https://github.com/azat)）。
* 修复使用 `Map` 组合器的聚合函数发生释放后使用，导致结果不正确的问题。[#38748](https://github.com/ClickHouse/ClickHouse/pull/38748)（[Azat Khuzhin](https://github.com/azat)）。
