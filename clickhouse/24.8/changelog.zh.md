<h3 id="a-id248a-clickhouse-release-248-lts-2024-08-20">
  <a id="248" /> ClickHouse 24.8 版本 LTS, 2024-08-20. [演示文稿](https://presentations.clickhouse.com/2024-release-24.8/), [视频](https://www.youtube.com/watch?v=AeLmp2jc51k)
</h3>

<Frame>
  <iframe src="https://www.youtube.com/embed/AeLmp2jc51k" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
</Frame>

<h4 id="backward-incompatible-change-4">
  向后不兼容变更
</h4>

* `clickhouse-client` 和 `clickhouse-local` 现在默认使用多查询模式（此前为单查询模式）。例如，`clickhouse-client -q "SELECT 1; SELECT 2"` 现在可直接执行，此前用户必须加上 `--multiquery`（或 `-n`）。`--multiquery/-n` 开关已过时。多查询语句中的 INSERT 根据 FORMAT 子句特殊处理：若 FORMAT 为 `VALUES`（最常见情况），查询末尾的分号 `;` 表示 INSERT 结束；对于其他 FORMAT（如 `CSV` 或 `JSONEachRow`），查询末尾的两个换行符 `\n\n` 表示 INSERT 结束。 [#63898](https://github.com/ClickHouse/ClickHouse/pull/63898) ([FFish](https://github.com/wxybear)).
* 此前可通过在数据类型名称后追加 `WithDictionary`，使用 `LowCardinality` 的替代语法。这只是最初可运行的实现，从未写入文档或公开。现在已废弃。若曾使用该语法，必须 ALTER 表并将数据类型改为 `LowCardinality`。 [#66842](https://github.com/ClickHouse/ClickHouse/pull/66842) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复 `Buffer` 存储以分布式表作为目标时的逻辑错误。这是不向后兼容的变更：若这种 `Buffer` 表在同一查询中出现多次（例如自连接），查询可能不再工作。 [#67015](https://github.com/ClickHouse/ClickHouse/pull/67015) ([vdimir](https://github.com/vdimir)).
* 此前，以接近零的负参数调用基于 Gamma 函数的随机分布函数（如卡方、Student、Fisher）会导致长时间计算或无限循环。新版对零或负参数抛出异常。关闭 [#67297](https://github.com/ClickHouse/ClickHouse/issues/67297)。 [#67326](https://github.com/ClickHouse/ClickHouse/pull/67326) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 默认启用系统表 `text_log`。与此前版本完全兼容，但本地磁盘使用量可能略微增加（该系统表占用空间很少）。 [#67428](https://github.com/ClickHouse/ClickHouse/pull/67428) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 此前 `arrayWithConstant` 生成极大数组时可能很慢。新版将每个数组限制为 1 GB。关闭 [#32754](https://github.com/ClickHouse/ClickHouse/issues/32754)。 [#67741](https://github.com/ClickHouse/ClickHouse/pull/67741) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复 REPLACE 修饰符格式化（禁止省略括号）。 [#67774](https://github.com/ClickHouse/ClickHouse/pull/67774) ([Azat Khuzhin](https://github.com/azat)).
* 在 [#68349](https://github.com/ClickHouse/ClickHouse/issues/68349) 中回移：重新实现 `Dynamic` 类型。达到动态类型数量上限后，新类型不再转换为 String，而是以二进制格式存入特殊数据结构，同时以二进制编码保存类型。现在插入 `Dynamic` 列的任何类型都可作为子列读取。 [#68132](https://github.com/ClickHouse/ClickHouse/pull/68132) ([Kruglov Pavel](https://github.com/Avogar)).

<h4 id="new-feature-4">
  新功能
</h4>

* 新增 `MergeTree` 设置 `deduplicate_merge_projection_mode`，控制特定引擎合并及 `OPTIMIZE DEDUPLICATE` 查询期间的投影行为。支持 `throw`（若 \*MergeTree 引擎未完全支持投影则抛出异常）、`drop`（无法一致地合并投影时在合并期间移除它）和 `rebuild`（从头重建投影，是重量级操作）。 [#66672](https://github.com/ClickHouse/ClickHouse/pull/66672) ([jsc0218](https://github.com/jsc0218)).
* 为 S3 表引擎添加虚拟列 `_etag`。修复 [#65312](https://github.com/ClickHouse/ClickHouse/issues/65312)。 [#65386](https://github.com/ClickHouse/ClickHouse/pull/65386) ([skyoct](https://github.com/skyoct)).
* 为查询缓存新增标签（命名空间）机制。不同标签的相同查询视为不同查询。例如，`SELECT 1 SETTINGS use_query_cache = 1, query_cache_tag = 'abc'` 与 `SELECT 1 SETTINGS use_query_cache = 1, query_cache_tag = 'def'` 现在创建不同缓存条目。 [#68235](https://github.com/ClickHouse/ClickHouse/pull/68235) ([sakulali](https://github.com/sakulali)).
* 对涉及左右两表列的不等式条件，支持更多 JOIN 严格性变体（`LEFT/RIGHT SEMI/ANTI/ANY JOIN`），例如 `t1.y < t2.y`（参见 `allow_experimental_join_condition`）。 [#64281](https://github.com/ClickHouse/ClickHouse/pull/64281) ([lgbo](https://github.com/lgbo-ustc)).
* 在不同引擎（`File`、`URL`、`S3`、`AzureBlobStorage`、`HDFS`）中解释 Hive 风格分区。该方式将数据组织到分区子目录中，便于高效查询和管理大型数据集。目前仅创建具有相应名称和数据的虚拟列；后续 PR 将引入相应数据过滤以提升性能。 [#65997](https://github.com/ClickHouse/ClickHouse/pull/65997) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 新增 `printf` 函数以兼容 Spark（也可使用现有的 `format`）。 [#66257](https://github.com/ClickHouse/ClickHouse/pull/66257) ([李扬](https://github.com/taiyang-li)).
* 新增选项 `restore_replace_external_engines_to_null` 和 `restore_replace_external_table_functions_to_null`，将外部引擎和 table\_engines 替换为 `Null` 引擎，便于测试。应适用于 RESTORE 及显式建表。 [#66536](https://github.com/ClickHouse/ClickHouse/pull/66536) ([Ilya Yatsishin](https://github.com/qoega)).
* 支持通过函数 `readWKTLineString` 读取 `WKT` 格式的 `MULTILINESTRING` 几何对象。 [#67647](https://github.com/ClickHouse/ClickHouse/pull/67647) ([Jacob Reckhard](https://github.com/jacobrec)).
* 新增表函数 `fuzzQuery`，通过随机变体修改给定查询字符串。例如：`SELECT query FROM fuzzQuery('SELECT 1') LIMIT 5;`。 [#67655](https://github.com/ClickHouse/ClickHouse/pull/67655) ([pufit](https://github.com/pufit)).
* 新增查询 `ALTER TABLE ... DROP DETACHED PARTITION ALL`，删除所有已分离分区。 [#67885](https://github.com/ClickHouse/ClickHouse/pull/67885) ([Duc Canh Le](https://github.com/canhld94)).
* 启用新设置 `rows_before_aggregation` 时，在查询响应中添加 `rows_before_aggregation_at_least` 统计值，表示聚合前读取的行数。分布式查询中，如果使用 `group by` 或 `max` 聚合且不带 `limit`，`rows_before_aggregation_at_least` 可反映查询命中的行数。 [#66084](https://github.com/ClickHouse/ClickHouse/pull/66084) ([morning-color](https://github.com/morning-color)).
* `Join` 表支持 `OPTIMIZE` 查询，以降低内存占用。 [#67883](https://github.com/ClickHouse/ClickHouse/pull/67883) ([Duc Canh Le](https://github.com/canhld94)).
* 在 Play 的 URL 中添加 `&run=1` 即可立即执行查询。 [#66457](https://github.com/ClickHouse/ClickHouse/pull/66457) ([Aleksandr Musorin](https://github.com/AVMusorin)).

<h4 id="experimental-feature-3">
  实验性功能
</h4>

* 实现新的 `JSON` 数据类型。 [#66444](https://github.com/ClickHouse/ClickHouse/pull/66444) ([Kruglov Pavel](https://github.com/Avogar)).
* 新增 `TimeSeries` 表引擎。 [#64183](https://github.com/ClickHouse/ClickHouse/pull/64183) ([Vitaly Baranov](https://github.com/vitlibar)).
* 新增实验性 `Kafka` 存储引擎，将偏移量存入 Keeper，而非依赖向 Kafka 提交，使写入 ClickHouse 表与消费队列在提交时具有原子性。 [#57625](https://github.com/ClickHouse/ClickHouse/pull/57625) ([János Benjamin Antal](https://github.com/antaljanosbenjamin)).
* 并行副本采用自适应读取任务大小计算方法（根据读取列大小调整）。 [#60377](https://github.com/ClickHouse/ClickHouse/pull/60377) ([Nikita Taranov](https://github.com/nickitat)).
* 新增统计类型 `count_min`（count-min sketch），为 `col = 'val'` 等等值谓词估计选择性。支持字符串、日期、日期时间及数值类型。 [#65521](https://github.com/ClickHouse/ClickHouse/pull/65521) ([JackyWoo](https://github.com/JackyWoo)).

<h4 id="performance-improvement-4">
  性能改进
</h4>

* 默认启用设置 `optimize_functions_to_subcolumns`。 [#68053](https://github.com/ClickHouse/ClickHouse/pull/68053) ([Anton Popov](https://github.com/CurtizJ)).
* 将 `plain_rewritable` 磁盘的目录元数据保存到 `__meta` 布局，与对象存储中的 MergeTree 数据分离；将 `plain_rewritable` 磁盘改为扁平目录结构。 [#65751](https://github.com/ClickHouse/ClickHouse/pull/65751) ([Julia Kartseva](https://github.com/jkartseva)).
* 通过提前为所有子列预留所需内存，改善 `String`/`Array`/`Map`/`Variant`/`Dynamic` 的列合并（INSERT 查询中的操作）。 [#67043](https://github.com/ClickHouse/ClickHouse/pull/67043) ([Kruglov Pavel](https://github.com/Avogar)).
* 加速 `SYSTEM FLUSH LOGS`，并在关闭时刷新日志。 [#67472](https://github.com/ClickHouse/ClickHouse/pull/67472) ([Sema Checherinda](https://github.com/CheSema)).
* 减少合并调度步骤的开销，提升合并整体性能。 [#68016](https://github.com/ClickHouse/ClickHouse/pull/68016) ([Anton Popov](https://github.com/CurtizJ)).
* 加速 `DROP DATABASE` 的表删除，将 `database_catalog_drop_table_concurrency` 默认值增至 16。 [#67228](https://github.com/ClickHouse/ClickHouse/pull/67228) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* 写入 ORC 时避免为数组列分配过大容量，Array 列性能提升 15%。 [#67879](https://github.com/ClickHouse/ClickHouse/pull/67879) ([李扬](https://github.com/taiyang-li)).
* 显著加速非复制 MergeTree 的变更操作。 [#66911](https://github.com/ClickHouse/ClickHouse/pull/66911) [#66909](https://github.com/ClickHouse/ClickHouse/pull/66909) ([Alexey Milovidov](https://github.com/alexey-milovidov)).

<h4 id="improvement-4">
  改进
</h4>

* 将 `allow_experimental_analyzer` 重命名为 `enable_analyzer`，旧名保留为别名。这意味着 Analyzer 不再处于 beta，而是全面进入生产可用阶段。 [#66438](https://github.com/ClickHouse/ClickHouse/pull/66438) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* 改进日期时间的结构推断。仅当含小数部分时使用 DateTime64，否则使用普通 DateTime。Date/DateTime 推断更加严格，尤其在 `date_time_input_format='best_effort'` 时，避免边界情况下将字符串误推断为日期时间。 [#68382](https://github.com/ClickHouse/ClickHouse/pull/68382) ([Kruglov Pavel](https://github.com/Avogar)).
* 服务器新增设置 `max_keep_alive_requests`，与 `keep_alive_timeout` 共同控制入站 HTTP keep-alive 连接：即使空闲超时尚未到期，若连接已处理超过 `max_keep_alive_requests` 次请求，服务器也将关闭它。 [#61793](https://github.com/ClickHouse/ClickHouse/pull/61793) ([Nikita Taranov](https://github.com/nickitat)).
* 高级仪表盘的多项改进。关闭 [#67697](https://github.com/ClickHouse/ClickHouse/issues/67697)。关闭 [#63407](https://github.com/ClickHouse/ClickHouse/issues/63407)。关闭 [#51129](https://github.com/ClickHouse/ClickHouse/issues/51129)。关闭 [#61204](https://github.com/ClickHouse/ClickHouse/issues/61204)。 [#67701](https://github.com/ClickHouse/ClickHouse/pull/67701) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 创建 Distributed 表不再要求 REMOTE 授权，拥有 Distributed 引擎授权即可。 [#65419](https://github.com/ClickHouse/ClickHouse/pull/65419) ([jsc0218](https://github.com/jsc0218)).
* Docker 镜像中不显式传递 Keeper 日志参数，以允许覆盖。 [#65564](https://github.com/ClickHouse/ClickHouse/pull/65564) ([Azat Khuzhin](https://github.com/azat)).
* 为 `BACKUP` 和 `RESTORE` 新增 `use_same_password_for_base_backup`，允许将增量备份写入受密码保护的归档，或从中恢复。 [#66214](https://github.com/ClickHouse/ClickHouse/pull/66214) ([Samuele](https://github.com/sguerrini97)).
* `ATTACH` 查询忽略 `async_load_databases`（此前 ATTACH 可能在表附加完成前返回）。 [#66240](https://github.com/ClickHouse/ClickHouse/pull/66240) ([Azat Khuzhin](https://github.com/azat)).
* 为资源不足导致的连接拒绝增加日志和指标。 [#66410](https://github.com/ClickHouse/ClickHouse/pull/66410) ([Alexander Tokmakov](https://github.com/tavplubix)).
* MongoDB 引擎正确支持 `UUID` 类型。 [#66671](https://github.com/ClickHouse/ClickHouse/pull/66671) ([Azat Khuzhin](https://github.com/azat)).
* 新增复制延迟与恢复时间指标。 [#66703](https://github.com/ClickHouse/ClickHouse/pull/66703) ([Miсhael Stetsyuk](https://github.com/mstetsyuk)).
* 新增指标 `DiskS3NoSuchKeyErrors`。 [#66704](https://github.com/ClickHouse/ClickHouse/pull/66704) ([Miсhael Stetsyuk](https://github.com/mstetsyuk)).
* 确保 `COMMENT` 子句适用于所有表引擎。 [#66832](https://github.com/ClickHouse/ClickHouse/pull/66832) ([Joe Lynch](https://github.com/joelynch)).
* 函数 `mapFromArrays` 现在接受 `Map(K, V)` 作为第一个参数。例如，`SELECT mapFromArrays(map('a', 4, 'b', 4), ['aa', 'bb'])` 现在可执行并返回 `{('a',4):'aa',('b',4):'bb'}`。此外，若第一个参数是数组，只要实际值不为 `NULL`，也可为 `Array(Nullable(T))` 或 `Array(LowCardinality(Nullable(T)))`。 [#67103](https://github.com/ClickHouse/ClickHouse/pull/67103) ([李扬](https://github.com/taiyang-li)).
* 从 `~/.clickhouse-local` 读取 `clickhouse-local` 配置。 [#67135](https://github.com/ClickHouse/ClickHouse/pull/67135) ([Azat Khuzhin](https://github.com/azat)).
* 将 `input_format_orc_read_use_writer_time_zone` 重命名为 `input_format_orc_reader_timezone`，允许用户设置读取器时区。 [#67175](https://github.com/ClickHouse/ClickHouse/pull/67175) ([kevinyhzou](https://github.com/KevinyhZou)).
* HTTP 连接建立后立即被对端重置时，降低 `Socket is not connected` 错误级别。关闭 [#34218](https://github.com/ClickHouse/ClickHouse/issues/34218)。 [#67177](https://github.com/ClickHouse/ClickHouse/pull/67177) ([vdimir](https://github.com/vdimir)).
* 支持从配置加载 `system.dashboards` 仪表盘；配置后覆盖默认仪表盘预设。 [#67232](https://github.com/ClickHouse/ClickHouse/pull/67232) ([Azat Khuzhin](https://github.com/azat)).
* SQL 窗口函数传统上采用下划线命名，而 ClickHouse 使用 `camelCase`，因此新增 `denseRank()` 和 `percentRank()` 别名，调用方式与原来的 `dense_rank()` 和 `percent_rank()` 完全相同。两种命名语法都可继续使用，并为每个函数新增测试。关闭 [#67042](https://github.com/ClickHouse/ClickHouse/issues/67042)。 [#67334](https://github.com/ClickHouse/ClickHouse/pull/67334) ([Peter Nguyen](https://github.com/petern48)).
* 配置文件扩展名不是 `.xml`、`.yml` 或 `.yaml` 时自动检测格式：若以 \< 开头，可能是 XML，否则可能是 YAML。通过管道提供配置文件时很有用：`clickhouse-server --config-file <(echo "hello: world")`。 [#67391](https://github.com/ClickHouse/ClickHouse/pull/67391) ([sakulali](https://github.com/sakulali)).
* 函数 `formatDateTime` 和 `formatDateTimeInJodaSyntax` 的格式参数现在可省略；未指定时分别采用 `%Y-%m-%d %H:%i:%s` 和 `yyyy-MM-dd HH:mm:ss`。例如，`SELECT parseDateTime('2021-01-04 23:12:34')` 现在返回 DateTime 值 `2021-01-04 23:12:34`（此前抛出异常）。 [#67399](https://github.com/ClickHouse/ClickHouse/pull/67399) ([Robert Schulze](https://github.com/rschu1ze)).
* KeeperMap 中的 Keeper 请求因超时或连接丢失而失败时，自动重试。 [#67448](https://github.com/ClickHouse/ClickHouse/pull/67448) ([Antonio Andelic](https://github.com/antonio2368)).
* 为 Aarch64 Linux 构建添加 `-no-pie`，使 ClickHouse 重启后能够正确内省和解析堆栈符号。 [#67916](https://github.com/ClickHouse/ClickHouse/pull/67916) ([filimonov](https://github.com/filimonov)).
* 为合并与变更操作添加 Profile Event，改善内省。 [#68015](https://github.com/ClickHouse/ClickHouse/pull/68015) ([Anton Popov](https://github.com/CurtizJ)).
* 移除非复制 `MergeTree` 不必要的日志。 [#68238](https://github.com/ClickHouse/ClickHouse/pull/68238) ([Daniil Ivanik](https://github.com/divanik)).

<h4 id="buildtestingpackaging-improvement-1">
  构建/测试/打包改进
</h4>

* 集成测试的不稳定性检查不会通过多次运行每个测试用例来发现更多问题并提高可靠性。它使用 `pytest-repeat` 库在同一环境中多次运行测试用例。为了通过测试，务必在每个用例结束时清理表及其他实体。重复运行比多次启动 pytest 更快，因为只需启动一次必要容器。 [#66986](https://github.com/ClickHouse/ClickHouse/pull/66986) ([Ilya Yatsishin](https://github.com/qoega)).
* 解除 CLion 与 ClickHouse 配合使用的阻碍。此前每次按键都会让 CLion 冻结约一分钟。关闭 [#66994](https://github.com/ClickHouse/ClickHouse/issues/66994)。 [#66995](https://github.com/ClickHouse/ClickHouse/pull/66995) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* getauxval：避免较新 Linux 内核较高 ASLR 熵导致 sanitizer 重新执行时崩溃。 [#67081](https://github.com/ClickHouse/ClickHouse/pull/67081) ([Raúl Marín](https://github.com/Algunenano)).
* 将部分客户端代码提取到独立文件，即使调试构建也应用最高可用优化级别。关闭：[#65745](https://github.com/ClickHouse/ClickHouse/issues/65745)。 [#67215](https://github.com/ClickHouse/ClickHouse/pull/67215) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).

<h4 id="bug-fix">
  缺陷修复
</h4>

* 仅涉及实验性 Variant 类型：修复 Variant 与 AggregateFunction 类型组合时的崩溃。 [#67122](https://github.com/ClickHouse/ClickHouse/pull/67122) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复连接为空时 DistributedAsyncInsert 崩溃。 [#67219](https://github.com/ClickHouse/ClickHouse/pull/67219) ([Pablo Marcos](https://github.com/pamarcos)).
* 修复 `uniq` 和 `uniqTheta ` 使用 `tuple()` 参数时的崩溃。关闭 [#67303](https://github.com/ClickHouse/ClickHouse/issues/67303)。 [#67306](https://github.com/ClickHouse/ClickHouse/pull/67306) ([flynn](https://github.com/ucasfl)).
* 修复 [#66026](https://github.com/ClickHouse/ClickHouse/issues/66026)。避免在 `ReplaceTableNodeToDummyVisitor` 中遍历尚未解析的表函数参数。 [#67522](https://github.com/ClickHouse/ClickHouse/pull/67522) ([Dmitry Novik](https://github.com/novikd)).
* 修复 `JSONMergePatch` 潜在栈溢出。将函数从 `jsonMergePatch` 重命名为 `JSONMergePatch`，因为此前名称不正确；旧名仍为兼容而保留。改进函数错误诊断。关闭 [#67304](https://github.com/ClickHouse/ClickHouse/issues/67304)。 [#67756](https://github.com/ClickHouse/ClickHouse/pull/67756) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复特制查询通过 hopEnd、hopStart、tumbleEnd 和 tumbleStart 触发 NULL 指针解引用、导致服务器崩溃的问题。 [#68098](https://github.com/ClickHouse/ClickHouse/pull/68098) ([Salvatore Mesoraca](https://github.com/aiven-sal)).
* 修复部分系统表使用子查询过滤时的 `Not-ready Set`。 [#66018](https://github.com/ClickHouse/ClickHouse/pull/66018) ([Michael Kolupaev](https://github.com/al13n321)).
* 修复 `ALTER ADD COLUMN` 之后读取子列的问题。 [#66243](https://github.com/ClickHouse/ClickHouse/pull/66243) ([Anton Popov](https://github.com/CurtizJ)).
* 修复发送给外部数据库（如 `PostgreSQL` 引擎）的查询中的布尔字面量。 [#66282](https://github.com/ClickHouse/ClickHouse/pull/66282) ([vdimir](https://github.com/vdimir)).
* 修复 JOIN ON 表达式带别名的查询格式化，例如 `... JOIN t2 ON (x = y) AS e ORDER BY x` 应格式化为 `... JOIN t2 ON ((x = y) AS e) ORDER BY x`。 [#66312](https://github.com/ClickHouse/ClickHouse/pull/66312) ([vdimir](https://github.com/vdimir)).
* 修复 cluster() 的服务器间共享密钥处理（如之前一样保留初始用户）。 [#66364](https://github.com/ClickHouse/ClickHouse/pull/66364) ([Azat Khuzhin](https://github.com/azat)).
* 修复将含 null 的 Array 字段转换为 Array(Variant) 时可能发生的运行时错误。 [#66727](https://github.com/ClickHouse/ClickHouse/pull/66727) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复 Context::getDDLWorker 偶发死锁。 [#66843](https://github.com/ClickHouse/ClickHouse/pull/66843) ([Alexander Gololobov](https://github.com/davenger)).
* 修复不完整删除后创建 KeeperMap 表的问题。 [#66865](https://github.com/ClickHouse/ClickHouse/pull/66865) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复恢复到 `s3_plain_rewritable` 磁盘时的数据片段损坏错误。 [#66881](https://github.com/ClickHouse/ClickHouse/pull/66881) ([Vitaly Baranov](https://github.com/vitlibar)).
* 极少数情况下，磁盘上的意外投影会让 ClickHouse 认为数据片段损坏，现已修复。 [#66898](https://github.com/ClickHouse/ClickHouse/pull/66898) ([alesapin](https://github.com/alesapin)).
* 修复结构推断中无效格式检测可能导致“Format {} doesn't support schema inference”逻辑错误的问题。 [#66899](https://github.com/ClickHouse/ClickHouse/pull/66899) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复取消并行副本查询时可能发生的死锁。 [#66905](https://github.com/ClickHouse/ClickHouse/pull/66905) ([Nikita Taranov](https://github.com/nickitat)).
* 即使设置 database\_replicated\_allow\_heavy\_create，也禁止 CREATE AS SELECT。23.12 中已无条件禁止，但在尚未发布的 24.7 中意外允许通过该设置启用。 [#66980](https://github.com/ClickHouse/ClickHouse/pull/66980) ([vdimir](https://github.com/vdimir)).
* 设置 `max_rows_to_read` 后，从 `numbers` 读取可能错误抛出异常。关闭 [#66992](https://github.com/ClickHouse/ClickHouse/issues/66992)。 [#66996](https://github.com/ClickHouse/ClickHouse/pull/66996) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 为 lagInFrame 和 leadInFrame 窗口函数添加正确的类型转换，修复 MSan 测试。 [#67091](https://github.com/ClickHouse/ClickHouse/pull/67091) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* 修复 TRUNCATE DATABASE 像 DROP DATABASE 一样停止复制的问题。 [#67129](https://github.com/ClickHouse/ClickHouse/pull/67129) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 在 `clickhouse-local` 中使用独立的客户端上下文。 [#67133](https://github.com/ClickHouse/ClickHouse/pull/67133) ([Vitaly Baranov](https://github.com/vitlibar)).
* 修复读取基于单分片 `Distriburted` 表的 `Merge` 表时出现 `Cannot convert column because it is non constant in source stream but must be constant in result.` 错误。 [#67146](https://github.com/ClickHouse/ClickHouse/pull/67146) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修正禁用 `enable_order_by_all` 且启用并行副本（或分布式查询）时 `ORDER BY all` 的行为。 [#67153](https://github.com/ClickHouse/ClickHouse/pull/67153) ([Igor Nikonov](https://github.com/devcrafter)).
* 修复结构缓存中 input\_format\_max\_bytes\_to\_read\_for\_schema\_inference 的错误使用。 [#67157](https://github.com/ClickHouse/ClickHouse/pull/67157) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复按单个可空键 GROUP BY 期间抛出异常时，count distinct 的内存泄漏。 [#67171](https://github.com/ClickHouse/ClickHouse/pull/67171) ([Jet He](https://github.com/compasses)).
* 修复 OUTER JOIN 转 INNER JOIN 优化中的错误。关闭 [#67156](https://github.com/ClickHouse/ClickHouse/issues/67156)。关闭 [#66447](https://github.com/ClickHouse/ClickHouse/issues/66447)。由 [https://github.com/ClickHouse/ClickHouse/pull/62907](https://github.com/ClickHouse/ClickHouse/pull/62907) 引入。 [#67178](https://github.com/ClickHouse/ClickHouse/pull/67178) ([Maksim Kita](https://github.com/kitaisreal)).
* 修复 `Conversion from AggregateFunction(name, Type) to AggregateFunction(name, Nullable(Type)) is not supported` 错误，由 `optimize_rewrite_aggregate_function_with_if` 优化引起。修复 [#67112](https://github.com/ClickHouse/ClickHouse/issues/67112)。 [#67229](https://github.com/ClickHouse/ClickHouse/pull/67229) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复空元组作为 IN 左侧参数时查询挂起的问题。 [#67295](https://github.com/ClickHouse/ClickHouse/pull/67295) ([Duc Canh Le](https://github.com/canhld94)).
* 此前可构造极深嵌套的 JSON，在跳过未知字段时触发栈溢出。关闭 [#67292](https://github.com/ClickHouse/ClickHouse/issues/67292)。 [#67324](https://github.com/ClickHouse/ClickHouse/pull/67324) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复启动期间异常后附加 ReplicatedMergeTree 表的问题。 [#67360](https://github.com/ClickHouse/ClickHouse/pull/67360) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复 `Aggregator` 错误地从线程组分离而导致的段错误。 [#67385](https://github.com/ClickHouse/ClickHouse/pull/67385) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复主键中指定非确定性函数的另一种情况。 [#67395](https://github.com/ClickHouse/ClickHouse/pull/67395) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复 `bloom_filter` 索引破坏带 `(k=2)=(k=2)` 或 `has([1,2,3], k)` 等略显特殊条件的查询。 [#67423](https://github.com/ClickHouse/ClickHouse/pull/67423) ([Michael Kolupaev](https://github.com/al13n321)).
* 如果不是归档，正确解析含 `::` 的文件名/URI。 [#67433](https://github.com/ClickHouse/ClickHouse/pull/67433) ([Antonio Andelic](https://github.com/antonio2368)).
* WriteBuffer 被取消时，修复 \~WriteBufferFromS3 等待任务的处理。 [#67459](https://github.com/ClickHouse/ClickHouse/pull/67459) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 保护临时数据片段目录，避免其在 RESTORE 期间被删除。 [#67491](https://github.com/ClickHouse/ClickHouse/pull/67491) ([Vitaly Baranov](https://github.com/vitlibar)).
* 修复嵌套短路函数的执行。 [#67520](https://github.com/ClickHouse/ClickHouse/pull/67520) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复 `Logical error: Expected the argument №N of type T to have X rows, but it has 0` 错误，可能出现在 `GROUP BY` 包含常量表达式的远程查询中（新分析器）。 [#67536](https://github.com/ClickHouse/ClickHouse/pull/67536) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复带 NULL 元组的连接：使用新分析器且 `JOIN ON` 中元组含 `NULL` 的部分查询返回错误结果。 [#67538](https://github.com/ClickHouse/ClickHouse/pull/67538) ([vdimir](https://github.com/vdimir)).
* 缓存已满且无法驱逐时，避免冗余重调度 FileCache::freeSpaceRatioKeepingThreadFunc()。 [#67540](https://github.com/ClickHouse/ClickHouse/pull/67540) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复通过 HTTP 接口向 Kafka、RabbitMQ、NATS 等流式引擎插入。 [#67554](https://github.com/ClickHouse/ClickHouse/pull/67554) ([János Benjamin Antal](https://github.com/antaljanosbenjamin)).
* 修复函数 `toStartOfWeek` 对较小 `DateTime64` 值返回错误结果。 [#67558](https://github.com/ClickHouse/ClickHouse/pull/67558) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 修复创建含递归 CTE 的视图。 [#67587](https://github.com/ClickHouse/ClickHouse/pull/67587) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* 修复文件系统缓存的 `Logical error: 'file_offset_of_buffer_end <= read_until_position'`。关闭 [#57508](https://github.com/ClickHouse/ClickHouse/issues/57508)。 [#67623](https://github.com/ClickHouse/ClickHouse/pull/67623) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复 [#62282](https://github.com/ClickHouse/ClickHouse/issues/62282)。移除 `convertFieldToString()` 调用，添加类型专用序列化代码。参数值为返回类型实例的函数或表达式时，多种类型的参数化视图替换曾被破坏。 [#67654](https://github.com/ClickHouse/ClickHouse/pull/67654) ([Shankar](https://github.com/shiyer7474)).
* 修复 `percent_rank` 崩溃。将 `percent_rank` 默认窗口框架类型改为 `range unbounded preceding and unbounded following`。考虑 `IWindowFunction` 默认窗口框架，使 SQL 中未定义窗口框架的窗口函数能够正确放入不同 `WindowTransfomer`。 [#67661](https://github.com/ClickHouse/ClickHouse/pull/67661) ([lgbo](https://github.com/lgbo-ustc)).
* 修复重新加载含 UNION 的 SQL UDF；此前服务器重启可能使 UDF 无效。 [#67665](https://github.com/ClickHouse/ClickHouse/pull/67665) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复实验性 Variant、启用 `use_variant_as_common_type `，且 if 使用 Tuple 和 Map 时可能出现“Unexpected return type from if”逻辑错误。 [#67687](https://github.com/ClickHouse/ClickHouse/pull/67687) ([Kruglov Pavel](https://github.com/Avogar)).
* 由于 Linux 内核缺陷，查询可能挂在 `TimerDescriptor::drain`。关闭 [#37686](https://github.com/ClickHouse/ClickHouse/issues/37686)。 [#67702](https://github.com/ClickHouse/ClickHouse/pull/67702) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复 `RESTORE ON CLUSTER` 命令的完成处理。 [#67720](https://github.com/ClickHouse/ClickHouse/pull/67720) ([Vitaly Baranov](https://github.com/vitlibar)).
* 修复字典加载期间发生 CANNOT\_SCHEDULE\_TASK 时挂起的问题。 [#67751](https://github.com/ClickHouse/ClickHouse/pull/67751) ([Azat Khuzhin](https://github.com/azat)).
* 列 `c` 上具有布隆过滤器索引时，`SELECT count() FROM t WHERE cast(c = 1 or c = 9999 AS Bool) SETTINGS use_skip_indexes=1` 等查询现在正确工作。 [#67781](https://github.com/ClickHouse/ClickHouse/pull/67781) ([jsc0218](https://github.com/jsc0218)).
* 修复部分无键聚合且带过滤条件的查询返回错误聚合结果。关闭 [#67419](https://github.com/ClickHouse/ClickHouse/issues/67419)。 [#67804](https://github.com/ClickHouse/ClickHouse/pull/67804) ([vdimir](https://github.com/vdimir)).
* 在 ALTER ADD/MODIFY COLUMN 中校验实验性和可疑数据类型。 [#67911](https://github.com/ClickHouse/ClickHouse/pull/67911) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复分布式查询常量折叠后的 DateTime64 解析。关闭 [#66773](https://github.com/ClickHouse/ClickHouse/issues/66773)。 [#67920](https://github.com/ClickHouse/ClickHouse/pull/67920) ([vdimir](https://github.com/vdimir)).
* 修复谓词含非确定性函数时 `count()` 结果错误。 [#67922](https://github.com/ClickHouse/ClickHouse/pull/67922) ([János Benjamin Antal](https://github.com/antaljanosbenjamin)).
* 修复可用 CPU 数受限的容器环境中最大线程软限制的计算。 [#67963](https://github.com/ClickHouse/ClickHouse/pull/67963) ([Robert Schulze](https://github.com/rschu1ze)).
* 投影在磁盘上不存在但列于 `checksums.txt` 时，ClickHouse 不再认为数据片段损坏。 [#68003](https://github.com/ClickHouse/ClickHouse/pull/68003) ([alesapin](https://github.com/alesapin)).
* 修复新分析器在变更操作中跳过未受影响数据片段的行为。此前即使谓词表明变更不影响某数据片段，启用分析器时仍可能重写它。 [#68052](https://github.com/ClickHouse/ClickHouse/pull/68052) ([Anton Popov](https://github.com/CurtizJ)).
* 移除错误地取消带 `OFFSET` 子查询中排序的优化。修复 [#67906](https://github.com/ClickHouse/ClickHouse/issues/67906)。 [#68099](https://github.com/ClickHouse/ClickHouse/pull/68099) ([Graham Campbell](https://github.com/GrahamCampbell)).
* 尝试修复聚合投影优化中的 `Block structure mismatch in AggregatingStep stream: different types`。 [#68107](https://github.com/ClickHouse/ClickHouse/pull/68107) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 尝试修复取消查询时 PostgreSQL 崩溃。 [#68288](https://github.com/ClickHouse/ClickHouse/pull/68288) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复查询 `SYSTEM SYNC REPLICA` 缺少同步副本模式的问题。 [#68326](https://github.com/ClickHouse/ClickHouse/pull/68326) ([Duc Canh Le](https://github.com/canhld94)).
