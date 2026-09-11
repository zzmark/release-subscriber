<h3 id="a-id244a-clickhouse-release-244-2024-04-30">
  <a id="244" /> ClickHouse 24.4 版本, 2024-04-30. [演示文稿](https://presentations.clickhouse.com/2024-release-24.4/), [视频](https://www.youtube.com/watch?v=dtUqgcfOGmE)
</h3>

<Frame>
  <iframe src="https://www.youtube.com/embed/dtUqgcfOGmE" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
</Frame>

<h4 id="upgrade-notes">
  升级说明
</h4>

* `clickhouse-odbc-bridge` 和 `clickhouse-library-bridge` 现在是独立软件包。关闭 [#61677](https://github.com/ClickHouse/ClickHouse/issues/61677)。 [#62114](https://github.com/ClickHouse/ClickHouse/pull/62114) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 不允许将 max\_parallel\_replicas（用于实验性的副本并行读取）设为 `0`，因为没有意义。关闭 [#60140](https://github.com/ClickHouse/ClickHouse/issues/60140)。 [#61201](https://github.com/ClickHouse/ClickHouse/pull/61201) ([Kruglov Pavel](https://github.com/Avogar)).
* 移除 `INSERT WATCH` 查询的支持（属于已废弃的 `LIVE VIEW` 功能）。 [#62382](https://github.com/ClickHouse/ClickHouse/pull/62382) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 移除设置 `optimize_monotonous_functions_in_order_by`。 [#63004](https://github.com/ClickHouse/ClickHouse/pull/63004) ([Raúl Marín](https://github.com/Algunenano)).
* 移除 `Replicated` 数据库引擎的实验性标记，现在进入 Beta 阶段。 [#62937](https://github.com/ClickHouse/ClickHouse/pull/62937) ([Justin de Guzman](https://github.com/justindeguzman)).

<h4 id="new-feature-8">
  新功能
</h4>

* 支持递归 CTE。 [#62074](https://github.com/ClickHouse/ClickHouse/pull/62074) ([Maksim Kita](https://github.com/kitaisreal)).
* 支持 `QUALIFY` 子句。关闭 [#47819](https://github.com/ClickHouse/ClickHouse/issues/47819)。 [#62619](https://github.com/ClickHouse/ClickHouse/pull/62619) ([Maksim Kita](https://github.com/kitaisreal)).
* 现在可为表引擎授予权限，不影响现有用户行为。 [#60117](https://github.com/ClickHouse/ClickHouse/pull/60117) ([jsc0218](https://github.com/jsc0218)).
* 新增可重写的 S3 磁盘，支持 INSERT 操作且不需要在本地存储元数据。 [#61116](https://github.com/ClickHouse/ClickHouse/pull/61116) ([Julia Kartseva](https://github.com/jkartseva)). 主要使用场景是系统表。
* 在客户端输入时，语法高亮将在语法层级工作（此前基于词法层级）。 [#62123](https://github.com/ClickHouse/ClickHouse/pull/62123) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 支持同时删除多张表，例如 `DROP TABLE a, b, c`；。 [#58705](https://github.com/ClickHouse/ClickHouse/pull/58705) ([zhongyuankai](https://github.com/zhongyuankai)).
* 支持通过 `ALTER MODIFY SETTING` 修改内存表设置。例如：`ALTER TABLE memory MODIFY SETTING min_rows_to_keep = 100, max_rows_to_keep = 1000;`。 [#62039](https://github.com/ClickHouse/ClickHouse/pull/62039) ([zhongyuankai](https://github.com/zhongyuankai)).
* 为 HTTP 接口新增 `role` 查询参数，类似 `SET ROLE x`，在执行语句前应用角色。这绕过了 HTTP 接口的限制：由于不允许多条语句，无法同时发送 `SET ROLE x` 和实际语句。还可通过此方式设置多个角色，例如 `?role=x&role=y` 等同于 `SET ROLE x, y`。 [#62669](https://github.com/ClickHouse/ClickHouse/pull/62669) ([Serge Klochkov](https://github.com/slvrtrn)).
* 新增 `SYSTEM UNLOAD PRIMARY KEY`，释放表主键占用的内存。 [#62738](https://github.com/ClickHouse/ClickHouse/pull/62738) ([Pablo Marcos](https://github.com/pamarcos)).
* 为 `system.text_log` 新增 `value1`、`value2`、……、`value10` 列，包含用于格式化消息的值。 [#59619](https://github.com/ClickHouse/ClickHouse/pull/59619) ([Alexey Katsman](https://github.com/alexkats)).
* 新增持久化虚拟列 `_block_offset`，存储插入时分配的数据块内原始行号。可通过 MergeTree 设置 `enable_block_offset_column` 启用 `_block_offset` 的持久化。新增虚拟列 `_part_data_version`，包含数据片段的最小数据块编号或变更版本。持久化虚拟列 `_block_number` 不再视为实验性功能。 [#60676](https://github.com/ClickHouse/ClickHouse/pull/60676) ([Anton Popov](https://github.com/CurtizJ)).
* 新增设置 `input_format_json_throw_on_bad_escape_sequence`，禁用后允许保留 JSON 输入格式中的错误转义序列。 [#61889](https://github.com/ClickHouse/ClickHouse/pull/61889) ([Kruglov Pavel](https://github.com/Avogar)).

<h4 id="performance-improvement-8">
  性能改进
</h4>

* 使用等价集合改进 JOIN 过滤条件下推。 [#61216](https://github.com/ClickHouse/ClickHouse/pull/61216) ([Maksim Kita](https://github.com/kitaisreal)).
* 如果 JOIN 后的过滤器始终过滤掉默认值，则将 OUTER JOIN 优化为 INNER JOIN。通过默认启用的设置 `query_plan_convert_outer_join_to_inner_join` 控制。 [#62907](https://github.com/ClickHouse/ClickHouse/pull/62907) ([Maksim Kita](https://github.com/kitaisreal)).
* 改进 AWS S3。客户端须向服务器发送请求头 'Keep-Alive: timeout=X'。若客户端收到包含该响应头的服务器响应，则须采用服务器给出的值。此外，客户端应避免使用即将过期的连接，以免发生连接关闭竞态。 [#62249](https://github.com/ClickHouse/ClickHouse/pull/62249) ([Sema Checherinda](https://github.com/CheSema)).
* 降低变更操作对 SELECT 的开销（第 2 版）。 [#60856](https://github.com/ClickHouse/ClickHouse/pull/60856) ([Azat Khuzhin](https://github.com/azat)).
* 强制内联 PODArray 中更多高频调用函数。 [#61144](https://github.com/ClickHouse/ClickHouse/pull/61144) ([李扬](https://github.com/taiyang-li)).
* 读取完所有必需列后跳过对象剩余部分，以加速 JSON 解析。 [#62210](https://github.com/ClickHouse/ClickHouse/pull/62210) ([lgbo](https://github.com/lgbo-ustc)).
* 改进从 file/s3/hdfs/url/... 表函数中的文件执行简单 insert select 的性能。新增独立设置 max\_parsing\_threads，控制并行解析的线程数。 [#62404](https://github.com/ClickHouse/ClickHouse/pull/62404) ([Kruglov Pavel](https://github.com/Avogar)).
* 函数 `to_utc_timestamp` 和 `from_utc_timestamp` 现在快约 2 倍。 [#62583](https://github.com/ClickHouse/ClickHouse/pull/62583) ([KevinyhZou](https://github.com/KevinyhZou)).
* 当输入主要为无法解析的值时，函数 `parseDateTimeOrNull`、`parseDateTimeOrZero`、`parseDateTimeInJodaSyntaxOrNull` 和 `parseDateTimeInJodaSyntaxOrZero` 现在显著加快（10 至 1000 倍）。 [#62634](https://github.com/ClickHouse/ClickHouse/pull/62634) ([LiuNeng](https://github.com/liuneng1994)).
* 当查询缓存包含大量条目（例如超过 100,000 条）时，对 `system.query_cache` 的 SELECT 现在明显更快。 [#62671](https://github.com/ClickHouse/ClickHouse/pull/62671) ([Robert Schulze](https://github.com/rschu1ze)).
* 减少文件系统缓存竞争（第 3 部分）：尝试预留空间时，在不持锁的情况下执行文件系统删除。 [#61163](https://github.com/ClickHouse/ClickHouse/pull/61163) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 加速文件系统缓存的动态大小调整。 [#61723](https://github.com/ClickHouse/ClickHouse/pull/61723) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 包含 `INVALIDATE_QUERY` 的字典源不再在启动时重新加载两次。 [#62050](https://github.com/ClickHouse/ClickHouse/pull/62050) ([vdimir](https://github.com/vdimir)).
* 修复在涉及主键的布尔表达式后添加冗余 `= 1` 或 `= 0` 导致不使用主索引的问题。例如，`SELECT * FROM <table> WHERE <primary-key> IN (<value>) = 1` 和 `SELECT * FROM <table> WHERE <primary-key> NOT IN (<value>) = 0` 此前都会执行全表扫描，而本可使用主索引。 [#62142](https://github.com/ClickHouse/ClickHouse/pull/62142) ([josh-hildred](https://github.com/josh-hildred)).
* 从 `system.remote_data_paths` 返回数据块流，而非将全部结果累积成一个大数据块，以减少内存消耗、显示中间进度并允许取消查询。 [#62613](https://github.com/ClickHouse/ClickHouse/pull/62613) ([Alexander Gololobov](https://github.com/davenger)).

<h4 id="experimental-feature-6">
  实验性功能
</h4>

* 支持 Azure Blob Storage 的并行写入缓冲区，由设置 `azure_allow_parallel_part_upload` 管理。 [#62534](https://github.com/ClickHouse/ClickHouse/pull/62534) ([SmitaRKulkarni](https://github.com/SmitaRKulkarni)).
* 用户态页面缓存现在支持静态 Web 存储（`disk(type = web)`）。使用客户端设置 `use_page_cache_for_disks_without_file_cache=1` 启用。 [#61911](https://github.com/ClickHouse/ClickHouse/pull/61911) ([Michael Kolupaev](https://github.com/al13n321)).
* 不再将 `Variant` 类型中的 Bool 与数值变体视为可疑组合。 [#61999](https://github.com/ClickHouse/ClickHouse/pull/61999) ([Kruglov Pavel](https://github.com/Avogar)).
* 通过解析改进从 String 到 `Variant` 的转换。 [#62005](https://github.com/ClickHouse/ClickHouse/pull/62005) ([Kruglov Pavel](https://github.com/Avogar)).
* JSONExtract 函数支持 `Variant`。 [#62014](https://github.com/ClickHouse/ClickHouse/pull/62014) ([Kruglov Pavel](https://github.com/Avogar)).
* 将类型 `Variant` 标记为可比较，使其可用于主键。 [#62693](https://github.com/ClickHouse/ClickHouse/pull/62693) ([Kruglov Pavel](https://github.com/Avogar)).

<h4 id="improvement-8">
  改进
</h4>

* 为方便使用，`SELECT * FROM numbers() `将与 `SELECT * FROM system.numbers` 一样不限制数量。 [#61969](https://github.com/ClickHouse/ClickHouse/pull/61969) ([YenchangChan](https://github.com/YenchangChan)).
* 为 Kafka 配置引入独立的 consumer/producer 标签，避免 librdkafka（一个缺陷很多、质量糟糕的 C 库）警告为生产者实例指定了消费者属性或反之（例如 `Configuration property session.timeout.ms is a consumer property and will be ignored by this producer instance`）。关闭：[#58983](https://github.com/ClickHouse/ClickHouse/issues/58983)。 [#58956](https://github.com/ClickHouse/ClickHouse/pull/58956) ([Aleksandr Musorin](https://github.com/AVMusorin)).
* 函数 `date_diff` 和 `age` 现在以纳秒而非微秒精度计算结果，并为参数 `unit` 新增 `nanosecond`（或 `nanoseconds`、`ns`）可选值。 [#61409](https://github.com/ClickHouse/ClickHouse/pull/61409) ([Austin Kothig](https://github.com/kothiga)).
* 为 `date_trunc` 新增纳秒、微秒和毫秒单位。 [#62335](https://github.com/ClickHouse/ClickHouse/pull/62335) ([Misz606](https://github.com/Misz606)).
* 重新加载证书时，同时重新加载证书链。 [#61671](https://github.com/ClickHouse/ClickHouse/pull/61671) ([Pervakov Grigorii](https://github.com/GrigoryPervakov)).
* 若相应副本路径已存在活跃副本，则不允许附加表，以尝试避免错误 [#60432](https://github.com/ClickHouse/ClickHouse/issues/60432)。 [#61876](https://github.com/ClickHouse/ClickHouse/pull/61876) ([Arthur Passos](https://github.com/arthurpassos)).
* 为 `clickhouse-local` 实现 `input` 支持。 [#61923](https://github.com/ClickHouse/ClickHouse/pull/61923) ([Azat Khuzhin](https://github.com/azat)).
* 严格性为 `ANY` 的 `Join` 表引擎在重新加载后保持一致。插入具有相同键的多行时，第一行优先（此前在加载表时随机选择）。关闭 [#51027](https://github.com/ClickHouse/ClickHouse/issues/51027)。 [#61972](https://github.com/ClickHouse/ClickHouse/pull/61972) ([vdimir](https://github.com/vdimir)).
* 从 Apache Arrow 模式自动推断 Nullable 列类型。 [#61984](https://github.com/ClickHouse/ClickHouse/pull/61984) ([Maksim Kita](https://github.com/kitaisreal)).
* 允许在聚合期间取消聚合状态的并行合并，例如 `uniqExact`。 [#61992](https://github.com/ClickHouse/ClickHouse/pull/61992) ([Maksim Kita](https://github.com/kitaisreal)).
* 使用 `system.keywords` 填充补全建议，并在内部所有位置使用这些关键字。 [#62000](https://github.com/ClickHouse/ClickHouse/pull/62000) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* `ReplicatedMergeTree` 的 `OPTIMIZE FINAL` 现在等待当前活跃合并完成，再次尝试调度最终合并，使其行为更接近普通 `MergeTree`。 [#62067](https://github.com/ClickHouse/ClickHouse/pull/62067) ([Nikita Taranov](https://github.com/nickitat)).
* 从 Hive 文本文件读取数据时，此前会用首行调整输入字段数量，但首行字段数可能与 Hive 表定义不一致。例如，表定义为 3 列 `test_tbl(a Int32, b Int32, c Int32)`，首行却只有 2 个字段，此时输入字段数会调整为 2。如果下一行有 3 个字段，第三个字段将无法读取，只能设为默认值 0，这是错误行为。 [#62086](https://github.com/ClickHouse/ClickHouse/pull/62086) ([KevinyhZou](https://github.com/KevinyhZou)).
* `CREATE AS` 复制表注释。 [#62117](https://github.com/ClickHouse/ClickHouse/pull/62117) ([Pablo Marcos](https://github.com/pamarcos)).
* 为 zookeeper 表添加查询进度。 [#62152](https://github.com/ClickHouse/ClickHouse/pull/62152) ([JackyWoo](https://github.com/JackyWoo)).
* 支持在服务器范围内开启跟踪收集器（Real 和 CPU）。 [#62189](https://github.com/ClickHouse/ClickHouse/pull/62189) ([alesapin](https://github.com/alesapin)).
* 新增设置 `lightweight_deletes_sync`（默认值：2，同步等待所有副本）。类似 `mutations_sync`，但仅影响轻量删除的行为。 [#62195](https://github.com/ClickHouse/ClickHouse/pull/62195) ([Anton Popov](https://github.com/CurtizJ)).
* 解析自定义设置值时区分布尔值和整数：`SET custom_a = true; SET custom_b = 1;`。 [#62206](https://github.com/ClickHouse/ClickHouse/pull/62206) ([Vitaly Baranov](https://github.com/vitlibar)).
* 支持通过 AWS Private Link Interface 端点访问 S3。关闭 [#60021](https://github.com/ClickHouse/ClickHouse/issues/60021)、[#31074](https://github.com/ClickHouse/ClickHouse/issues/31074) 和 [#53761](https://github.com/ClickHouse/ClickHouse/issues/53761)。 [#62208](https://github.com/ClickHouse/ClickHouse/pull/62208) ([Arthur Passos](https://github.com/arthurpassos)).
* 若 UDF 目录不存在，clickhouse-client 不再创建它。关闭 [#59597](https://github.com/ClickHouse/ClickHouse/issues/59597)。 [#62366](https://github.com/ClickHouse/ClickHouse/pull/62366) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 查询缓存不再缓存针对系统表（`system.*`、`information_schema.*`、`INFORMATION_SCHEMA.*`）的查询结果。 [#62376](https://github.com/ClickHouse/ClickHouse/pull/62376) ([Robert Schulze](https://github.com/rschu1ze)).
* `MOVE PARTITION TO TABLE` 查询可被延迟，或抛出 `TOO_MANY_PARTS` 异常，以免超过数据片段数量限制。采用与 `INSERT` 查询相同的设置和限制（参见 `max_parts_in_total`、`parts_to_delay_insert`、`parts_to_throw_insert`、`inactive_parts_to_throw_insert`、`inactive_parts_to_delay_insert`、`max_avg_part_size_for_too_many_parts`、`min_delay_to_insert_ms` 和 `max_delay_to_insert`）。 [#62420](https://github.com/ClickHouse/ClickHouse/pull/62420) ([Sergei Trifonov](https://github.com/serxa)).
* 将 macOS 默认安装目录从 `/usr/bin` 改为 `/usr/local/bin`。这是因为 Apple 在 macOS El Capitan（2015）引入的系统完整性保护，即使使用 `sudo` 也会阻止写入 `/usr/bin`。 [#62489](https://github.com/ClickHouse/ClickHouse/pull/62489) ([haohang](https://github.com/yokofly)).
* 使 transform 始终返回第一个匹配项。 [#62518](https://github.com/ClickHouse/ClickHouse/pull/62518) ([Raúl Marín](https://github.com/Algunenano)).
* 为系统表 `blob_storage_log` 补上缺失的 `hostname` 列。 [#62456](https://github.com/ClickHouse/ClickHouse/pull/62456) ([Jayme Bird](https://github.com/jaymebrd)).
* 为与其他系统表保持一致，`system.backup_log` 新增 `event_time` 列。 [#62541](https://github.com/ClickHouse/ClickHouse/pull/62541) ([Jayme Bird](https://github.com/jaymebrd)).
* 表 `system.backup_log` 现在使用“默认”排序键 `event_date, event_time`，与其他 `_log` 表引擎一致。 [#62667](https://github.com/ClickHouse/ClickHouse/pull/62667) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* 执行 `RESTORE` 时避免计算表的 DEFAULT 表达式。 [#62601](https://github.com/ClickHouse/ClickHouse/pull/62601) ([Vitaly Baranov](https://github.com/vitlibar)).
* S3 存储和备份也需要与 s3 磁盘相同的默认 keep-alive 设置。 [#62648](https://github.com/ClickHouse/ClickHouse/pull/62648) ([Sema Checherinda](https://github.com/CheSema)).
* 在日志消息中添加 librdkafka（那个臭名昭著、缺陷很多的 C 库）的客户端标识符，以区分同一张表不同消费者的日志消息。 [#62813](https://github.com/ClickHouse/ClickHouse/pull/62813) ([János Benjamin Antal](https://github.com/antaljanosbenjamin)).
* 允许在 Replicated 数据库的 ZooKeeper 路径中使用特殊宏 `{uuid}` 和 `{database}`。 [#62818](https://github.com/ClickHouse/ClickHouse/pull/62818) ([Vitaly Baranov](https://github.com/vitlibar)).
* 允许 HTTP 请求在不同身份验证方案下使用配额键。 [#62842](https://github.com/ClickHouse/ClickHouse/pull/62842) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 精简 `clickhouse client` 和 `clickhouse local` 的命令行参数 `--help` 输出。原来的详细输出改由 `--help --verbose` 生成。 [#62973](https://github.com/ClickHouse/ClickHouse/pull/62973) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* MySQL 8.3 移除了 `log_bin_use_v1_row_events`，我们相应调整实验性 `MaterializedMySQL` 引擎 [#60479](https://github.com/ClickHouse/ClickHouse/issues/60479)。 [#63101](https://github.com/ClickHouse/ClickHouse/pull/63101) ([Eugene Klimov](https://github.com/Slach)). 作者：Nikolay Yankin。

<h4 id="buildtestingpackaging-improvement-4">
  构建/测试/打包改进
</h4>

* 将 Rust 依赖纳入源码，以便像 C++ 一样合理地构建 Rust 代码（我们出于追赶潮流和图个乐子的目的，用它实现了一些小功能）。 [#62297](https://github.com/ClickHouse/ClickHouse/pull/62297) ([Raúl Marín](https://github.com/Algunenano)).
* ClickHouse 现在使用 OpenSSL 3.2，而非 BoringSSL。 [#59870](https://github.com/ClickHouse/ClickHouse/pull/59870) ([Robert Schulze](https://github.com/rschu1ze)). 注意，OpenSSL 的工程文化通常更差（例如存在需要我们修补的 sanitizer 报告、含生成文件的复杂构建系统等），但兼容性更好。
* 在压力测试中以 1/2 的概率忽略 DROP 查询；在 Memory/JOIN 表的升级检查中，使用 TRUNCATE 代替忽略 DROP。 [#61476](https://github.com/ClickHouse/ClickHouse/pull/61476) ([Kruglov Pavel](https://github.com/Avogar)).
* 从 Keeper Docker 镜像移除 /etc/clickhouse-keeper 和 /var/log/clickhouse-keeper 的卷。 [#61683](https://github.com/ClickHouse/ClickHouse/pull/61683) ([Tristan](https://github.com/Tristan971)).
* 为所有因默认启用 Analyzer 而不再存在的问题添加测试。 关闭： [#55794](https://github.com/ClickHouse/ClickHouse/issues/55794) 关闭： [#49472](https://github.com/ClickHouse/ClickHouse/issues/49472) 关闭： [#44414](https://github.com/ClickHouse/ClickHouse/issues/44414) 关闭： [#13843](https://github.com/ClickHouse/ClickHouse/issues/13843) 关闭： [#55803](https://github.com/ClickHouse/ClickHouse/issues/55803) 关闭： [#48308](https://github.com/ClickHouse/ClickHouse/issues/48308) 关闭： [#45535](https://github.com/ClickHouse/ClickHouse/issues/45535) 关闭： [#44365](https://github.com/ClickHouse/ClickHouse/issues/44365) 关闭： [#44153](https://github.com/ClickHouse/ClickHouse/issues/44153) 关闭： [#42399](https://github.com/ClickHouse/ClickHouse/issues/42399) 关闭： [#27115](https://github.com/ClickHouse/ClickHouse/issues/27115) 关闭： [#23162](https://github.com/ClickHouse/ClickHouse/issues/23162) 关闭： [#15395](https://github.com/ClickHouse/ClickHouse/issues/15395) 关闭： [#15411](https://github.com/ClickHouse/ClickHouse/issues/15411) 关闭： [#14978](https://github.com/ClickHouse/ClickHouse/issues/14978) 关闭： [#17319](https://github.com/ClickHouse/ClickHouse/issues/17319) 关闭： [#11813](https://github.com/ClickHouse/ClickHouse/issues/11813) 关闭： [#13210](https://github.com/ClickHouse/ClickHouse/issues/13210) 关闭： [#23053](https://github.com/ClickHouse/ClickHouse/issues/23053) 关闭： [#37729](https://github.com/ClickHouse/ClickHouse/issues/37729) 关闭： [#32639](https://github.com/ClickHouse/ClickHouse/issues/32639) 关闭： [#9954](https://github.com/ClickHouse/ClickHouse/issues/9954) 关闭： [#41964](https://github.com/ClickHouse/ClickHouse/issues/41964) 关闭： [#54317](https://github.com/ClickHouse/ClickHouse/issues/54317) 关闭： [#7520](https://github.com/ClickHouse/ClickHouse/issues/7520) 关闭： [#36973](https://github.com/ClickHouse/ClickHouse/issues/36973) 关闭： [#40955](https://github.com/ClickHouse/ClickHouse/issues/40955) 关闭： [#19687](https://github.com/ClickHouse/ClickHouse/issues/19687) 关闭： [#23104](https://github.com/ClickHouse/ClickHouse/issues/23104) 关闭： [#21584](https://github.com/ClickHouse/ClickHouse/issues/21584) 关闭： [#23344](https://github.com/ClickHouse/ClickHouse/issues/23344) 关闭： [#22627](https://github.com/ClickHouse/ClickHouse/issues/22627) 关闭： [#10276](https://github.com/ClickHouse/ClickHouse/issues/10276) 关闭： [#19687](https://github.com/ClickHouse/ClickHouse/issues/19687) 关闭： [#4567](https://github.com/ClickHouse/ClickHouse/issues/4567) 关闭： [#17710](https://github.com/ClickHouse/ClickHouse/issues/17710) 关闭： [#11068](https://github.com/ClickHouse/ClickHouse/issues/11068) 关闭： [#24395](https://github.com/ClickHouse/ClickHouse/issues/24395) 关闭： [#23416](https://github.com/ClickHouse/ClickHouse/issues/23416) 关闭： [#23162](https://github.com/ClickHouse/ClickHouse/issues/23162) 关闭： [#25655](https://github.com/ClickHouse/ClickHouse/issues/25655) 关闭： [#11757](https://github.com/ClickHouse/ClickHouse/issues/11757) 关闭： [#6571](https://github.com/ClickHouse/ClickHouse/issues/6571) 关闭： [#4432](https://github.com/ClickHouse/ClickHouse/issues/4432) 关闭： [#8259](https://github.com/ClickHouse/ClickHouse/issues/8259) 关闭： [#9233](https://github.com/ClickHouse/ClickHouse/issues/9233) 关闭： [#14699](https://github.com/ClickHouse/ClickHouse/issues/14699) 关闭： [#27068](https://github.com/ClickHouse/ClickHouse/issues/27068) 关闭： [#28687](https://github.com/ClickHouse/ClickHouse/issues/28687) 关闭： [#28777](https://github.com/ClickHouse/ClickHouse/issues/28777) 关闭： [#29734](https://github.com/ClickHouse/ClickHouse/issues/29734) 关闭： [#61238](https://github.com/ClickHouse/ClickHouse/issues/61238) 关闭： [#33825](https://github.com/ClickHouse/ClickHouse/issues/33825) 关闭： [#35608](https://github.com/ClickHouse/ClickHouse/issues/35608) 关闭： [#29838](https://github.com/ClickHouse/ClickHouse/issues/29838) 关闭： [#35652](https://github.com/ClickHouse/ClickHouse/issues/35652) 关闭： [#36189](https://github.com/ClickHouse/ClickHouse/issues/36189) 关闭： [#39634](https://github.com/ClickHouse/ClickHouse/issues/39634) 关闭： [#47432](https://github.com/ClickHouse/ClickHouse/issues/47432) 关闭： [#54910](https://github.com/ClickHouse/ClickHouse/issues/54910) 关闭： [#57321](https://github.com/ClickHouse/ClickHouse/issues/57321) 关闭： [#59154](https://github.com/ClickHouse/ClickHouse/issues/59154) 关闭： [#61014](https://github.com/ClickHouse/ClickHouse/issues/61014) 关闭： [#61950](https://github.com/ClickHouse/ClickHouse/issues/61950) 关闭： [#55647](https://github.com/ClickHouse/ClickHouse/issues/55647) 关闭： [#61947](https://github.com/ClickHouse/ClickHouse/issues/61947). [#62185](https://github.com/ClickHouse/ClickHouse/pull/62185) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* 为不再存在或已被分析器修复的问题添加更多测试。 关闭： [#58985](https://github.com/ClickHouse/ClickHouse/issues/58985) 关闭： [#59549](https://github.com/ClickHouse/ClickHouse/issues/59549) 关闭： [#36963](https://github.com/ClickHouse/ClickHouse/issues/36963) 关闭： [#39453](https://github.com/ClickHouse/ClickHouse/issues/39453) 关闭： [#56521](https://github.com/ClickHouse/ClickHouse/issues/56521) 关闭： [#47552](https://github.com/ClickHouse/ClickHouse/issues/47552) 关闭： [#56503](https://github.com/ClickHouse/ClickHouse/issues/56503) 关闭： [#59101](https://github.com/ClickHouse/ClickHouse/issues/59101) 关闭： [#50271](https://github.com/ClickHouse/ClickHouse/issues/50271) 关闭： [#54954](https://github.com/ClickHouse/ClickHouse/issues/54954) 关闭： [#56466](https://github.com/ClickHouse/ClickHouse/issues/56466) 关闭： [#11000](https://github.com/ClickHouse/ClickHouse/issues/11000) 关闭： [#10894](https://github.com/ClickHouse/ClickHouse/issues/10894) 关闭： [https://github.com/ClickHouse/ClickHouse/issues/448](https://github.com/ClickHouse/ClickHouse/issues/448) 关闭： [#8030](https://github.com/ClickHouse/ClickHouse/issues/8030) 关闭： [#32139](https://github.com/ClickHouse/ClickHouse/issues/32139) 关闭： [#47288](https://github.com/ClickHouse/ClickHouse/issues/47288) 关闭： [#50705](https://github.com/ClickHouse/ClickHouse/issues/50705) 关闭： [#54511](https://github.com/ClickHouse/ClickHouse/issues/54511) 关闭： [#55466](https://github.com/ClickHouse/ClickHouse/issues/55466) 关闭： [#58500](https://github.com/ClickHouse/ClickHouse/issues/58500) 关闭： [#39923](https://github.com/ClickHouse/ClickHouse/issues/39923) 关闭： [#39855](https://github.com/ClickHouse/ClickHouse/issues/39855) 关闭： [#4596](https://github.com/ClickHouse/ClickHouse/issues/4596) 关闭： [#47422](https://github.com/ClickHouse/ClickHouse/issues/47422) 关闭： [#33000](https://github.com/ClickHouse/ClickHouse/issues/33000) 关闭： [#14739](https://github.com/ClickHouse/ClickHouse/issues/14739) 关闭： [#44039](https://github.com/ClickHouse/ClickHouse/issues/44039) 关闭： [#8547](https://github.com/ClickHouse/ClickHouse/issues/8547) 关闭： [#22923](https://github.com/ClickHouse/ClickHouse/issues/22923) 关闭： [#23865](https://github.com/ClickHouse/ClickHouse/issues/23865) 关闭： [#29748](https://github.com/ClickHouse/ClickHouse/issues/29748) 关闭： [#4222](https://github.com/ClickHouse/ClickHouse/issues/4222). [#62457](https://github.com/ClickHouse/ClickHouse/pull/62457) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* 修复动态链接 OpenSSL 时的构建错误（注意：这种方式通常不受支持，仅 IBM s390x 平台需要）。 [#62888](https://github.com/ClickHouse/ClickHouse/pull/62888) ([Harry Lee](https://github.com/HarryLeeIBM)).

<h4 id="bug-fix-user-visible-misbehavior-in-an-official-stable-release-6">
  缺陷修复（正式稳定版本中用户可见的异常行为）
</h4>

* 修复撤销 quorum 插入事务时的逻辑错误。 [#61953](https://github.com/ClickHouse/ClickHouse/pull/61953) ([Han Fei](https://github.com/hanfei1991)).
* 修复 COUNT(\*) 与 FILTER 子句一起使用时的解析错误。 [#61357](https://github.com/ClickHouse/ClickHouse/pull/61357) ([Duc Canh Le](https://github.com/canhld94)).
* 修复 `group_by_use_nulls`、grouping sets、分析器和 materialize/constant 组合时的逻辑错误。 [#61567](https://github.com/ClickHouse/ClickHouse/pull/61567) ([Kruglov Pavel](https://github.com/Avogar)).
* 移除已移动的数据片段前取消合并。 [#61610](https://github.com/ClickHouse/ClickHouse/pull/61610) ([János Benjamin Antal](https://github.com/antaljanosbenjamin)).
* 修复 Apache Arrow 中的中止。 [#61720](https://github.com/ClickHouse/ClickHouse/pull/61720) ([Kruglov Pavel](https://github.com/Avogar)).
* 在与特定磁盘对应的正确路径中查找 `convert_to_replicated` 标志。 [#61769](https://github.com/ClickHouse/ClickHouse/pull/61769) ([Kirill](https://github.com/kirillgarbar)).
* 修复 distributed\_foreground\_insert/distributed\_background\_insert\_batch 可能发生的连接数据竞态。 [#61867](https://github.com/ClickHouse/ClickHouse/pull/61867) ([Azat Khuzhin](https://github.com/azat)).
* 将 CANNOT\_PARSE\_ESCAPE\_SEQUENCE 标记为解析错误，以便行式输入格式跳过该错误。 [#61883](https://github.com/ClickHouse/ClickHouse/pull/61883) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复使用 http\_wait\_end\_of\_query 时，通过 HTTP 在输出格式中写入异常消息的问题。 [#61951](https://github.com/ClickHouse/ClickHouse/pull/61951) ([Kruglov Pavel](https://github.com/Avogar)).
* 正确修复 LowCardinality 与 JSONExtact 函数的组合使用。 [#61957](https://github.com/ClickHouse/ClickHouse/pull/61957) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* 修复 Merge 引擎在行策略没有表达式时的崩溃。 [#61971](https://github.com/ClickHouse/ClickHouse/pull/61971) ([Ilya Golshtein](https://github.com/ilejn)).
* 修复 WriteBufferAzureBlobStorage 析构函数中的未捕获异常。 [#61988](https://github.com/ClickHouse/ClickHouse/pull/61988) ([SmitaRKulkarni](https://github.com/SmitaRKulkarni)).
* 修复 ReplicatedMergeTree 不带列定义的 CREATE TABLE。 [#62040](https://github.com/ClickHouse/ClickHouse/pull/62040) ([Azat Khuzhin](https://github.com/azat)).
* 修复复合分片键的 optimize\_skip\_unused\_shards\_rewrite\_in。 [#62047](https://github.com/ClickHouse/ClickHouse/pull/62047) ([Azat Khuzhin](https://github.com/azat)).
* ReadWriteBufferFromHTTP 在重定向时设置正确的 Host 请求头。 [#62068](https://github.com/ClickHouse/ClickHouse/pull/62068) ([Sema Checherinda](https://github.com/CheSema)).
* 修复外部表无法解析 Bool 数据类型的问题。 [#62115](https://github.com/ClickHouse/ClickHouse/pull/62115) ([Duc Canh Le](https://github.com/canhld94)).
* Analyzer：修复查询参数解析。 [#62186](https://github.com/ClickHouse/ClickHouse/pull/62186) ([Dmitry Novik](https://github.com/novikd)).
* 修复只读状态下恢复数据片段的问题。 [#62207](https://github.com/ClickHouse/ClickHouse/pull/62207) ([Vitaly Baranov](https://github.com/vitlibar)).
* 修复索引定义包含 SQL UDF 时的崩溃。 [#62225](https://github.com/ClickHouse/ClickHouse/pull/62225) ([vdimir](https://github.com/vdimir)).
* 修复使用分析器时 generateRandom 的 NULL 随机种子处理。 [#62248](https://github.com/ClickHouse/ClickHouse/pull/62248) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 在 Distinct Transform 中正确处理常量列。 [#62250](https://github.com/ClickHouse/ClickHouse/pull/62250) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复带 FINAL 修饰符查询的数据片段拆分器。 [#62268](https://github.com/ClickHouse/ClickHouse/pull/62268) ([Nikita Taranov](https://github.com/nickitat)).
* Analyzer：修复参数化视图别名的解析。 [#62274](https://github.com/ClickHouse/ClickHouse/pull/62274) ([Dmitry Novik](https://github.com/novikd)).
* Analyzer：修复来自父作用域的名称解析。 [#62281](https://github.com/ClickHouse/ClickHouse/pull/62281) ([Dmitry Novik](https://github.com/novikd)).
* 修复 argMax 对可空非原生数值列的处理。 [#62285](https://github.com/ClickHouse/ClickHouse/pull/62285) ([Raúl Marín](https://github.com/Algunenano)).
* 修复 Ordinary 数据库中物化视图的 BACKUP 和 RESTORE。 [#62295](https://github.com/ClickHouse/ClickHouse/pull/62295) ([Vitaly Baranov](https://github.com/vitlibar)).
* 修复 Context 中标量上的数据竞态。 [#62305](https://github.com/ClickHouse/ClickHouse/pull/62305) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复物化视图中的主键。 [#62319](https://github.com/ClickHouse/ClickHouse/pull/62319) ([Murat Khairulin](https://github.com/mxwell)).
* 不为不支持多线程插入的表构建多线程插入流水线。 [#62333](https://github.com/ClickHouse/ClickHouse/pull/62333) ([vdimir](https://github.com/vdimir)).
* 修复分布式查询中分析器对位置参数的处理。 [#62362](https://github.com/ClickHouse/ClickHouse/pull/62362) ([flynn](https://github.com/ucasfl)).
* 修复分析器中 Merge 引擎的 additional\_table\_filters 过滤条件下推。 [#62398](https://github.com/ClickHouse/ClickHouse/pull/62398) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复分析器中的 GLOBAL IN 表查询。 [#62409](https://github.com/ClickHouse/ClickHouse/pull/62409) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 在 s3/hdfs/azure 引擎的分区写入期间遵守 truncate\_on\_insert/create\_new\_file\_on\_insert 设置。 [#62425](https://github.com/ClickHouse/ClickHouse/pull/62425) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复 AzureBlobStorage 的备份恢复路径。 [#62447](https://github.com/ClickHouse/ClickHouse/pull/62447) ([SmitaRKulkarni](https://github.com/SmitaRKulkarni)).
* 修复 SimpleSquashingChunksTransform。 [#62451](https://github.com/ClickHouse/ClickHouse/pull/62451) ([Nikita Taranov](https://github.com/nickitat)).
* 修复嵌套 lambda 的捕获。 [#62462](https://github.com/ClickHouse/ClickHouse/pull/62462) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 避免读取递归类型的 protobuf 时发生崩溃。 [#62506](https://github.com/ClickHouse/ClickHouse/pull/62506) ([Raúl Marín](https://github.com/Algunenano)).
* 修复将一个分区移动到自身的缺陷。 [#62524](https://github.com/ClickHouse/ClickHouse/pull/62524) ([helifu](https://github.com/helifu)).
* 修复 LIMIT 中的标量子查询。 [#62567](https://github.com/ClickHouse/ClickHouse/pull/62567) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复实验性且不受支持的 Hive 引擎中的段错误；反正我们也不喜欢它。 [#62578](https://github.com/ClickHouse/ClickHouse/pull/62578) ([Nikolay Degterinsky](https://github.com/evillique)).
* 修复 groupArraySorted 的内存泄漏。 [#62597](https://github.com/ClickHouse/ClickHouse/pull/62597) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复 largestTriangleThreeBuckets 崩溃。 [#62646](https://github.com/ClickHouse/ClickHouse/pull/62646) ([Raúl Marín](https://github.com/Algunenano)).
* 修复 tumble\[Start,End] 和 hop\[Start,End] 对更大分辨率的处理。 [#62705](https://github.com/ClickHouse/ClickHouse/pull/62705) ([Jordi Villar](https://github.com/jrdi)).
* 修复 argMin/argMax 组合器状态。 [#62708](https://github.com/ClickHouse/ClickHouse/pull/62708) ([Raúl Marín](https://github.com/Algunenano)).
* 修复缓存锁竞争优化导致缓存中的临时数据失败的问题。 [#62715](https://github.com/ClickHouse/ClickHouse/pull/62715) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复函数 `mergeTreeIndex` 崩溃。 [#62762](https://github.com/ClickHouse/ClickHouse/pull/62762) ([Anton Popov](https://github.com/CurtizJ)).
* 修复更新嵌套物化列时的大小检查。 [#62773](https://github.com/ClickHouse/ClickHouse/pull/62773) ([Eliot Hautefeuille](https://github.com/hileef)).
* 修复使用分析器时 CTE 中的 FINAL 修饰符未生效的问题。 [#62811](https://github.com/ClickHouse/ClickHouse/pull/62811) ([Duc Canh Le](https://github.com/canhld94)).
* 修复函数 `formatRow` 使用 `JSON` 格式及 HTTP 接口时的崩溃。 [#62840](https://github.com/ClickHouse/ClickHouse/pull/62840) ([Anton Popov](https://github.com/CurtizJ)).
* Azure：修复从端点对象构建最终 URL 的问题。 [#62850](https://github.com/ClickHouse/ClickHouse/pull/62850) ([Daniel Pozo Escalona](https://github.com/danipozo)).
* 修复 GCD 编解码器。 [#62853](https://github.com/ClickHouse/ClickHouse/pull/62853) ([Nikita Taranov](https://github.com/nickitat)).
* 修复超矩形中的 LowCardinality(Nullable) 键。 [#62866](https://github.com/ClickHouse/ClickHouse/pull/62866) ([Amos Bird](https://github.com/amosbird)).
* 修复输入值超出 UInt32 范围时，Joda 语法中的 fromUnixtimestamp。 [#62901](https://github.com/ClickHouse/ClickHouse/pull/62901) ([KevinyhZou](https://github.com/KevinyhZou)).
* 对 sum(nullable) 禁用 optimize\_rewrite\_aggregate\_function\_with\_if。 [#62912](https://github.com/ClickHouse/ClickHouse/pull/62912) ([Raúl Marín](https://github.com/Algunenano)).
* 修复 StorageBuffer 源表列类型不同时的 PREWHERE。 [#62916](https://github.com/ClickHouse/ClickHouse/pull/62916) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复缓存中的临时数据错误处理缓存键目录创建失败的问题。 [#62925](https://github.com/ClickHouse/ClickHouse/pull/62925) ([Kseniia Sumarokova](https://github.com/kssenii)).
* gRPC：修复 IPv6 对端连接时的崩溃。 [#62978](https://github.com/ClickHouse/ClickHouse/pull/62978) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 修复复制抓取期间可能出现的 CHECKSUM\_DOESNT\_MATCH 等错误。 [#62987](https://github.com/ClickHouse/ClickHouse/pull/62987) ([Azat Khuzhin](https://github.com/azat)).
* 修复缓存中的临时数据因未捕获异常而终止的问题。 [#62998](https://github.com/ClickHouse/ClickHouse/pull/62998) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复 optimize\_rewrite\_aggregate\_function\_with\_if 的隐式类型转换。 [#62999](https://github.com/ClickHouse/ClickHouse/pull/62999) ([Raúl Marín](https://github.com/Algunenano)).
* 修复 \~RestorerFromBackup 中的未处理异常。 [#63040](https://github.com/ClickHouse/ClickHouse/pull/63040) ([Vitaly Baranov](https://github.com/vitlibar)).
* 对于次级查询，不从 GROUP BY 键中移除服务器常量。 [#63047](https://github.com/ClickHouse/ClickHouse/pull/63047) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复对 abs 函数单调性的错误判断。 [#63097](https://github.com/ClickHouse/ClickHouse/pull/63097) ([Duc Canh Le](https://github.com/canhld94)).
* 为 MongoDB 引擎的 SSL 握手设置服务器名称。 [#63122](https://github.com/ClickHouse/ClickHouse/pull/63122) ([Alexander Gololobov](https://github.com/davenger)).
* 检查 MongoDB 线协议版本时，使用用户指定的数据库，而非“config”。 [#63126](https://github.com/ClickHouse/ClickHouse/pull/63126) ([Alexander Gololobov](https://github.com/davenger)).
