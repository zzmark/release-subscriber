<h3 id="a-id2410a-clickhouse-release-2410-2024-10-31">
  <a id="2410" /> ClickHouse 24.10 版本, 2024-10-31. [演示文稿](https://presentations.clickhouse.com/2024-release-24.10/), [视频](https://www.youtube.com/watch?v=AamIAjURp4U)
</h3>

<Frame>
  <iframe src="https://www.youtube.com/embed/AamIAjURp4U" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
</Frame>

<h4 id="backward-incompatible-change-2">
  向后不兼容变更
</h4>

* 当子查询放在括号中时，允许在含 `UNION` 的查询链中将 `SETTINGS` 写在 `FORMAT` 前。关闭 [#39712](https://github.com/ClickHouse/ClickHouse/issues/39712)。改变连续指定两次 SETTINGS 时的行为：距离相应子查询最近的 SETTINGS 优先。此前外层 SETTINGS 可能覆盖内层设置。 [#68614](https://github.com/ClickHouse/ClickHouse/pull/68614) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 默认允许重排 `[PRE]WHERE` 过滤条件。可将 `allow_reorder_prewhere_conditions` 设为 `false` 禁用。 [#70657](https://github.com/ClickHouse/ClickHouse/pull/70657) ([Nikita Taranov](https://github.com/nickitat)).
* 移除许可证不兼容的 `idxd-config` 库，同时移除实验性 Intel DeflateQPL 编解码器。 [#70987](https://github.com/ClickHouse/ClickHouse/pull/70987) ([Alexey Milovidov](https://github.com/alexey-milovidov)).

<h4 id="new-feature-2">
  新功能
</h4>

* 允许按通配符前缀授予访问权限：`GRANT SELECT ON db.table_pefix_* TO user`。 [#65311](https://github.com/ClickHouse/ClickHouse/pull/65311) ([pufit](https://github.com/pufit)).
* 查询运行期间按空格键，客户端会显示含详细指标的实时表格。可通过 clickhouse-client 的新选项 `--progress-table` 全局启用；与 `--progress-table` 配套的 `--enable-progress-table-toggle` 控制是否通过控制键（空格）切换进度表显示。 [#63689](https://github.com/ClickHouse/ClickHouse/pull/63689) ([Maria Khristenko](https://github.com/mariaKhr)), [#70423](https://github.com/ClickHouse/ClickHouse/pull/70423) ([Julia Kartseva](https://github.com/jkartseva)).
* 允许缓存对象存储表引擎和数据湖读取的文件，使用 ETag 与文件路径的组合哈希作为缓存键。 [#70135](https://github.com/ClickHouse/ClickHouse/pull/70135) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 支持 `CREATE TABLE ... CLONE AS ...` 建表：克隆源表结构，再将全部分区附加到新表。仅支持 `MergeTree` 家族表。关闭 [#65015](https://github.com/ClickHouse/ClickHouse/issues/65015)。 [#69091](https://github.com/ClickHouse/ClickHouse/pull/69091) ([tuanpach](https://github.com/tuanpach)).
* 新增系统表 `system.query_metric_log`，记录单个查询的内存和 system.events 指标值历史，定期刷新到磁盘。 [#66532](https://github.com/ClickHouse/ClickHouse/pull/66532) ([Pablo Marcos](https://github.com/pamarcos)).
* 简单 SELECT 查询可省略 SELECT，像计算器一样编写表达式，例如 `ch "1 + 2"`。由新设置 `implicit_select` 控制。 [#68502](https://github.com/ClickHouse/ClickHouse/pull/68502) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* clickhouse-local 支持 `--copy` 模式，作为格式转换的快捷方式 [#68503](https://github.com/ClickHouse/ClickHouse/issues/68503)。 [#68583](https://github.com/ClickHouse/ClickHouse/pull/68583) ([Denis Hananein](https://github.com/denis-hananein)).
* 新增可视化合并的内置 HTML 页面，位于 `/merges`。 [#70821](https://github.com/ClickHouse/ClickHouse/pull/70821) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 支持 `arrayUnion` 函数。 [#68989](https://github.com/ClickHouse/ClickHouse/pull/68989) ([Peter Nguyen](https://github.com/petern48)).
* 允许参数化 SQL 别名。 [#50665](https://github.com/ClickHouse/ClickHouse/pull/50665) ([Anton Kozlov](https://github.com/tonickkozlov)).
* 新增聚合函数 `quantileExactWeightedInterpolated`，是基于 quantileExactWeighted 的插值版本。虽然已有 `quantileExactInterpolatedWeighted`，但仍需要新的 `quantileExactWeightedInterpolated`，因为它比旧函数更准确。用于 Spark 兼容。 [#69619](https://github.com/ClickHouse/ClickHouse/pull/69619) ([李扬](https://github.com/taiyang-li)).
* 新增函数 `arrayElementOrNull`，数组索引越界或 Map 键不存在时返回 `NULL`。 [#69646](https://github.com/ClickHouse/ClickHouse/pull/69646) ([李扬](https://github.com/taiyang-li)).
* 允许在 `config.xml` 中通过新字段 `message_regexp` 和 `message_regexp_negative` 指定正则表达式，过滤日志。匹配针对已格式化但未着色的文本，以提供直观的开发体验。 [#69657](https://github.com/ClickHouse/ClickHouse/pull/69657) ([Peter Nguyen](https://github.com/petern48)).
* 新增 `RIPEMD160`，计算字符串的 RIPEMD-160 密码学哈希。例如，`SELECT HEX(RIPEMD160('The quick brown fox jumps over the lazy dog'))` 返回 `37F332F68DB77BD9D7EDD4969571AD671CF9DD3B`。 [#70087](https://github.com/ClickHouse/ClickHouse/pull/70087) ([Dergousov Maxim](https://github.com/m7kss1)).
* 支持读取 `HDFS` 上的 `Iceberg` 表。 [#70268](https://github.com/ClickHouse/ClickHouse/pull/70268) ([flynn](https://github.com/ucasfl)).
* 支持 `WITH ... INSERT` 形式的 CTE，此前仅支持 `INSERT ... WITH ...`。 [#70593](https://github.com/ClickHouse/ClickHouse/pull/70593) ([Shichao Jin](https://github.com/jsc0218)).
* MongoDB 集成：支持全部 MongoDB 类型，支持在 MongoDB 端执行 WHERE 和 ORDER BY，并限制不受 MongoDB 支持的表达式。新集成默认禁用，使用前请在服务器配置中将 `<use_legacy_mongodb_integration>` 设为 `false`。 [#63279](https://github.com/ClickHouse/ClickHouse/pull/63279) ([Kirill Nikiforov](https://github.com/allmazz)).
* 新增 `getSettingOrDefault`，当前配置档案中找不到自定义设置时返回默认值，避免异常。 [#69917](https://github.com/ClickHouse/ClickHouse/pull/69917) ([Shankar](https://github.com/shiyer7474)).

<h4 id="experimental-feature-1">
  Experimental feature
</h4>

* 可刷新物化视图已可用于生产。 [#70550](https://github.com/ClickHouse/ClickHouse/pull/70550) ([Michael Kolupaev](https://github.com/al13n321)). Replicated 数据库现在支持可刷新物化视图。 [#60669](https://github.com/ClickHouse/ClickHouse/pull/60669) ([Michael Kolupaev](https://github.com/al13n321)).
* 并行副本从实验性提升为 beta。重构控制并行副本算法行为的设置。简要说明：ClickHouse 有四种涉及多副本的并行读取算法，由 `parallel_replicas_mode` 表示，默认值为 `read_tasks`。另新增开关设置 `enable_parallel_replicas`。 [#63151](https://github.com/ClickHouse/ClickHouse/pull/63151) ([Alexey Milovidov](https://github.com/alexey-milovidov)), ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* 多数函数支持 `Dynamic`，通过在 `Dynamic` 内部类型上执行函数实现。 [#69691](https://github.com/ClickHouse/ClickHouse/pull/69691) ([Pavel Kruglov](https://github.com/Avogar)).
* 通过 `input_format_binary_read_json_as_string/output_format_binary_write_json_as_string`，允许在 `RowBinary` 中将 `JSON` 作为二进制字符串读写。 [#70288](https://github.com/ClickHouse/ClickHouse/pull/70288) ([Pavel Kruglov](https://github.com/Avogar)).
* 允许 Native 格式将 `JSON` 列作为单个 String 列序列化/反序列化。输出使用 `output_format_native_write_json_as_string`；输入在列数据前指定序列化版本 `1`。 [#70312](https://github.com/ClickHouse/ClickHouse/pull/70312) ([Pavel Kruglov](https://github.com/Avogar)).
* 为 MergeTree 合并选择器引入特殊实验性模式，对数据片段数量接近上限的分区采取更积极的合并。由 MergeTree 设置 `merge_selector_use_blurry_base` 控制。 [#70645](https://github.com/ClickHouse/ClickHouse/pull/70645) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* 实现 Avro `Union` 与 ClickHouse `Variant` 之间的通用序列化/反序列化。解决 [#69713](https://github.com/ClickHouse/ClickHouse/issues/69713)。 [#69712](https://github.com/ClickHouse/ClickHouse/pull/69712) ([Jiří Kozlovský](https://github.com/jirislav)).

<h4 id="performance-improvement-2">
  性能改进
</h4>

* 重构 `IDisk` 和 `IObjectStorage` 提升性能，`plain` 和 `plain_rewritable` 对象存储中的表初始化更快。 [#68146](https://github.com/ClickHouse/ClickHouse/pull/68146) ([Alexey Milovidov](https://github.com/alexey-milovidov), [Julia Kartseva](https://github.com/jkartseva)). 判断 plain rewritable 磁盘上文件或目录是否存在时，不调用对象存储 LIST API，因为其成本效率可能很低。 [#70852](https://github.com/ClickHouse/ClickHouse/pull/70852) ([Julia Kartseva](https://github.com/jkartseva)). 减少 plain\_rewritable 磁盘的对象存储 HEAD API 请求数量。 [#70915](https://github.com/ClickHouse/ClickHouse/pull/70915) ([Julia Kartseva](https://github.com/jkartseva)).
* 允许将数据直接解析到稀疏列。 [#69828](https://github.com/ClickHouse/ClickHouse/pull/69828) ([Anton Popov](https://github.com/CurtizJ)).
* 改善大量值缺失时的格式解析性能，例如 `JSONEachRow`。 [#69875](https://github.com/ClickHouse/ClickHouse/pull/69875) ([Anton Popov](https://github.com/CurtizJ)).
* 支持并行读取 Parquet 行组，并在单线程模式中预取行组。 [#69862](https://github.com/ClickHouse/ClickHouse/pull/69862) ([LiuNeng](https://github.com/liuneng1994)).
* 为 `pointInPolygon` 支持 minmax 索引。 [#62085](https://github.com/ClickHouse/ClickHouse/pull/62085) ([JackyWoo](https://github.com/JackyWoo)).
* 读取 Parquet 文件时使用布隆过滤器。 [#62966](https://github.com/ClickHouse/ClickHouse/pull/62966) ([Arthur Passos](https://github.com/arthurpassos)).
* 无锁重命名数据片段，避免 INSERT 因数据片段锁影响 SELECT。在启用 `fsync_part_directory` 的通常情况下，INSERT 并发执行时 SELECT QPS 提升 2 倍，高负载下效果更大。目前仅包含 `ReplicatedMergeTree`。 [#64955](https://github.com/ClickHouse/ClickHouse/pull/64955) ([Azat Khuzhin](https://github.com/azat)).
* `materialize ttl` 遵守 `ttl_only_drop_parts`；重新计算 TTL 时仅读取必要列，并以空数据片段替换原片段实现删除。 [#65488](https://github.com/ClickHouse/ClickHouse/pull/65488) ([Andrey Zvonov](https://github.com/zvonand)).
* 优化 ThreadPool 线程创建以减少锁竞争。在线程临界区外创建线程，避免高负载时任务调度和线程管理延迟，使 ClickHouse 在高并发下响应更快。 [#68694](https://github.com/ClickHouse/ClickHouse/pull/68694) ([filimonov](https://github.com/filimonov)).
* 支持从 `ORC` 读取 `LowCardinality` 字符串列。 [#69481](https://github.com/ClickHouse/ClickHouse/pull/69481) ([李扬](https://github.com/taiyang-li)).
* 在 `part_log`、`query_views_log`、`filesystem_cache_log` 等系统日志中，为 `ProfileEvents` 使用 `LowCardinality`。 [#70152](https://github.com/ClickHouse/ClickHouse/pull/70152) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 提升 `fromUnixTimestamp`/`toUnixTimestamp` 性能。 [#71042](https://github.com/ClickHouse/ClickHouse/pull/71042) ([kevinyhzou](https://github.com/KevinyhZou)).
* 从阻塞 I/O 读取时，不再为整个服务器禁用页面缓存的非阻塞读取。此前某个文件系统（如 tmpfs）不支持 `preadv2`、其他文件系统支持时，会导致性能下降。 [#70299](https://github.com/ClickHouse/ClickHouse/pull/70299) ([Antonio Andelic](https://github.com/antonio2368)).
* `ALTER TABLE .. REPLACE PARTITION` 不再等待其他分区中的变更或合并。 [#59138](https://github.com/ClickHouse/ClickHouse/pull/59138) ([Vasily Nemkov](https://github.com/Enmk)).
* 从 Keeper 同步 ACL 时不再校验，因为创建时已校验。通常影响不大，但某些部署创建了数万甚至更多用户，服务器启动时从 Keeper 同步全部信息，不必要的哈希校验可能耗时很长。 [#70644](https://github.com/ClickHouse/ClickHouse/pull/70644) ([Raúl Marín](https://github.com/Algunenano)).

<h4 id="improvement-2">
  改进
</h4>

* `CREATE TABLE AS` 复制 `PRIMARY KEY`、`ORDER BY` 等子句（`MergeTree` 表）。 [#69739](https://github.com/ClickHouse/ClickHouse/pull/69739) ([sakulali](https://github.com/sakulali)).
* Keeper 支持 64 位 XID，通过配置 `use_xid_64` 启用。 [#69908](https://github.com/ClickHouse/ClickHouse/pull/69908) ([Antonio Andelic](https://github.com/antonio2368)).
* Bool 设置的命令行参数未给出值时设为 true，例如 `clickhouse-client --optimize_aggregation_in_order --query "SELECT 1"`。 [#70459](https://github.com/ClickHouse/ClickHouse/pull/70459) ([davidtsuk](https://github.com/davidtsuk)).
* 新增用户级设置 `min_free_disk_bytes_to_perform_insert` 和 `min_free_disk_perform_to_throw_insert`，防止向近乎满的磁盘插入。 [#69755](https://github.com/ClickHouse/ClickHouse/pull/69755) ([Marco Vilas Boas](https://github.com/marco-vb)).
* 设置的内嵌文档将比网站文档更详细、更完整。这是让网站文档始终从源码自动生成的第一步，具有长期意义：- 保证涵盖每个设置；- 默认值不会过时；- 可为每个 ClickHouse 版本生成文档；- 即使没有互联网，服务器自身也能显示文档。从源码生成网站文档。 [#70289](https://github.com/ClickHouse/ClickHouse/pull/70289) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 允许 `replace` 的查找字符串为空，与 PostgreSQL 行为相同。 [#69918](https://github.com/ClickHouse/ClickHouse/pull/69918) ([zhanglistar](https://github.com/zhanglistar)).
* 允许 `replaceRegexp*` 的查找字符串为空。 [#70053](https://github.com/ClickHouse/ClickHouse/pull/70053) ([zhanglistar](https://github.com/zhanglistar)).
* `data/database_name/` 中表的符号链接根据存储策略指向表数据的实际路径，而非默认磁盘的 `store/...` 目录。 [#61777](https://github.com/ClickHouse/ClickHouse/pull/61777) ([Kirill](https://github.com/kirillgarbar)).
* 从 `JSON` 解析 `Enum` 时，包含整数的字符串解释为相应 `Enum` 元素。关闭 [#65119](https://github.com/ClickHouse/ClickHouse/issues/65119)。 [#66801](https://github.com/ClickHouse/ClickHouse/pull/66801) ([scanhex12](https://github.com/scanhex12)).
* 允许对空字符串执行 `TRIM` 的 `LEADING` 或 `TRAILING`，作为无操作。关闭 [#67792](https://github.com/ClickHouse/ClickHouse/issues/67792)。 [#68455](https://github.com/ClickHouse/ClickHouse/pull/68455) ([Peter Nguyen](https://github.com/petern48)).
* 改进 `cast(timestamp as String)` 与 Spark 的兼容性。 [#69179](https://github.com/ClickHouse/ClickHouse/pull/69179) ([Wenzheng Liu](https://github.com/lwz9103)).
* `enable_analyzer` 为 `true` 时，始终使用新分析器计算常量表达式。支持在不执行 `SELECT` 的情况下计算 `executable` 表函数的常量表达式参数。 [#69292](https://github.com/ClickHouse/ClickHouse/pull/69292) ([Dmitry Novik](https://github.com/novikd)).
* 新增 `enable_secure_identifiers`，禁止含特殊字符的标识符。 [#69411](https://github.com/ClickHouse/ClickHouse/pull/69411) ([tuanpach](https://github.com/tuanpach)).
* 新增 `show_create_query_identifier_quoting_rule`，定义 `SHOW CREATE TABLE` 结果中的标识符引用方式。可选值：- `user_display`：标识符是关键字时引用；- `when_necessary`：标识符属于 `{"distinct", "all", "table"}`，且用于列名或字典属性名等会导致歧义的场景时引用；- `always`：始终引用。 [#69448](https://github.com/ClickHouse/ClickHouse/pull/69448) ([tuanpach](https://github.com/tuanpach)).
* 改进访问控制实体依赖的恢复。 [#69563](https://github.com/ClickHouse/ClickHouse/pull/69563) ([Vitaly Baranov](https://github.com/vitlibar)).
* 运行 `clickhouse-client` 等 CLI 应用时，如果服务器过载导致启动缓慢，而用户开始输入如 `SELECT` 的查询，此前会在欢迎消息前显示残留终端回显，例如 `SELECTClickHouse local version 24.10.1.1.`，而非 `ClickHouse local version 24.10.1.1.`。现已修复。关闭 [#31696](https://github.com/ClickHouse/ClickHouse/issues/31696)。 [#69856](https://github.com/ClickHouse/ClickHouse/pull/69856) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 为 `system.replicas` 新增 `readonly_duration`，便于告警区分真正只读的副本与哨兵副本。 [#69871](https://github.com/ClickHouse/ClickHouse/pull/69871) ([Miсhael Stetsyuk](https://github.com/mstetsyuk)).
* 将 `join_output_by_rowlist_perkey_rows_threshold` 类型改为无符号整数。 [#69886](https://github.com/ClickHouse/ClickHouse/pull/69886) ([kevinyhzou](https://github.com/KevinyhZou)).
* 增强 OpenTelemetry span 日志，包含查询设置。 [#70011](https://github.com/ClickHouse/ClickHouse/pull/70011) ([sharathks118](https://github.com/sharathks118)).
* lambda 结果类型不符合预期时，添加高阶数组函数诊断信息。 [#70093](https://github.com/ClickHouse/ClickHouse/pull/70093) ([ttanay](https://github.com/ttanay)).
* Keeper 改进：减少集群变更期间的锁使用。 [#70275](https://github.com/ClickHouse/ClickHouse/pull/70275) ([Antonio Andelic](https://github.com/antonio2368)).
* 为 `SHOW GRANTS` 新增 `WITH IMPLICIT` 和 `FINAL`，并修复隐式授权的小缺陷 [#70094](https://github.com/ClickHouse/ClickHouse/issues/70094)。 [#70293](https://github.com/ClickHouse/ClickHouse/pull/70293) ([pufit](https://github.com/pufit)).
* MergeTree 设置遵守 `compatibility`。服务器启动时从 `default` 配置档案读取 `compatibility`，相应修改默认 MergeTree 设置；之后更改 `compatibility` 不影响 MergeTree 设置。 [#70322](https://github.com/ClickHouse/ClickHouse/pull/70322) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 服务器间通信出错时，避免大量 HTTP 响应体刷屏日志。 [#70487](https://github.com/ClickHouse/ClickHouse/pull/70487) ([Vladimir Cherkasov](https://github.com/vdimir)).
* 新增 `max_parts_to_move`，控制一次可移动的最大数据片段数量。 [#70520](https://github.com/ClickHouse/ClickHouse/pull/70520) ([Vladimir Cherkasov](https://github.com/vdimir)).
* 限制部分日志消息的输出频率。 [#70601](https://github.com/ClickHouse/ClickHouse/pull/70601) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复带 `PART` 限定的 `CHECK TABLE` 在客户端格式化错误。 [#70660](https://github.com/ClickHouse/ClickHouse/pull/70660) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 原生 Parquet 写入器支持写入列索引与偏移索引。 [#70669](https://github.com/ClickHouse/ClickHouse/pull/70669) ([LiuNeng](https://github.com/liuneng1994)).
* 支持用 Joda 语法解析含微秒和时区的 `DateTime64`（Joda 是流行的 Java 日期时间库，“Joda 语法”指其格式风格）。 [#70737](https://github.com/ClickHouse/ClickHouse/pull/70737) ([kevinyhzou](https://github.com/KevinyhZou)).
* 更改检测云存储是否支持[批量删除](https://docs.aws.amazon.com/AmazonS3/latest/API/API_DeleteObjects.html)的方法。 [#70786](https://github.com/ClickHouse/ClickHouse/pull/70786) ([Vitaly Baranov](https://github.com/vitlibar)).
* 原生读取器支持 Parquet page v2。 [#70807](https://github.com/ClickHouse/ClickHouse/pull/70807) ([Arthur Passos](https://github.com/arthurpassos)).
* 检查表是否同时设置 `storage_policy` 和 `disk`；新增检查，使用 `disk` 设置时新旧存储策略是否兼容。 [#70839](https://github.com/ClickHouse/ClickHouse/pull/70839) ([Kirill](https://github.com/kirillgarbar)).
* 新增 `system.s3_queue_settings` 和 `system.azure_queue_settings`。 [#70841](https://github.com/ClickHouse/ClickHouse/pull/70841) ([Kseniia Sumarokova](https://github.com/kssenii)).
* `base58Encode` 和 `base58Decode` 现在接受 `FixedString`。例如：`SELECT base58Encode(toFixedString('plaintext', 9));`。 [#70846](https://github.com/ClickHouse/ClickHouse/pull/70846) ([Faizan Patel](https://github.com/faizan2786)).
* 为数据片段日志的每种条目类型添加 `partition` 列，此前仅部分条目设置它。关闭 [#70819](https://github.com/ClickHouse/ClickHouse/issues/70819)。 [#70848](https://github.com/ClickHouse/ClickHouse/pull/70848) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 为 `system.part_log` 新增 `MergeStart` 和 `MutateStart`，便于分析和可视化合并。 [#70850](https://github.com/ClickHouse/ClickHouse/pull/70850) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 新增已合并源数据片段数量的 Profile Event，便于在生产环境监控合并树的扇入情况。 [#70908](https://github.com/ClickHouse/ClickHouse/pull/70908) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 重新启用文件系统缓存后台下载。 [#70929](https://github.com/ClickHouse/ClickHouse/pull/70929) ([Nikita Taranov](https://github.com/nickitat)).
* 新增名为 `Trivial` 的合并选择器算法，仅供专业用途；其表现比 `Simple` 更差。 [#70969](https://github.com/ClickHouse/ClickHouse/pull/70969) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 支持原子的 `CREATE OR REPLACE VIEW`。 [#70536](https://github.com/ClickHouse/ClickHouse/pull/70536) ([tuanpach](https://github.com/tuanpach))
* 为 `windowFunnel` 新增 `strict_once` 模式，避免同一事件匹配多个条件时被重复计数。关闭 [#21835](https://github.com/ClickHouse/ClickHouse/issues/21835)。 [#69738](https://github.com/ClickHouse/ClickHouse/pull/69738) ([Vladimir Cherkasov](https://github.com/vdimir)).

<h4 id="bug-fix-user-visible-misbehavior-in-an-official-stable-release-2">
  缺陷修复（正式稳定版本中用户可见的异常行为）
</h4>

* 在全局上下文对象中应用配置更新，修复 [#62308](https://github.com/ClickHouse/ClickHouse/issues/62308) 等问题。 [#62944](https://github.com/ClickHouse/ClickHouse/pull/62944) ([Amos Bird](https://github.com/amosbird)).
* 修复 `ReadSettings` 仅使用默认值、不采用用户设置值的问题。 [#65625](https://github.com/ClickHouse/ClickHouse/pull/65625) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复 `sumMapFiltered` 使用有符号参数时的类型不匹配。 [#58408](https://github.com/ClickHouse/ClickHouse/pull/58408) ([Chen768959](https://github.com/Chen768959)).
* 修复 toHour 等转换函数传入可选时区参数时的单调性。 [#60264](https://github.com/ClickHouse/ClickHouse/pull/60264) ([Amos Bird](https://github.com/amosbird)).
* 放宽 `Merge` 表的 `supportsPrewhere` 检查，修复 [#61064](https://github.com/ClickHouse/ClickHouse/issues/61064)。此前在 [#60082](https://github.com/ClickHouse/ClickHouse/issues/60082) 中不必要地收紧。 [#61091](https://github.com/ClickHouse/ClickHouse/pull/61091) ([Amos Bird](https://github.com/amosbird)).
* 修复 `use_concurrency_control` 处理，正确执行 `concurrent_threads_soft_limit_num` 限制；因为此前功能损坏，这也使并发控制实际默认启用。 [#61473](https://github.com/ClickHouse/ClickHouse/pull/61473) ([Sergei Trifonov](https://github.com/serxa)).
* 修复 `IS NULL` 检查位于 `NOT` 等其他函数之下时，`JOIN ON` 的错误优化可能返回错误结果。关闭 [#67915](https://github.com/ClickHouse/ClickHouse/issues/67915)。 [#68049](https://github.com/ClickHouse/ClickHouse/pull/68049) ([Vladimir Cherkasov](https://github.com/vdimir)).
* 阻止会使表 `CREATE` 查询失效的 `ALTER`。 [#68574](https://github.com/ClickHouse/ClickHouse/pull/68574) ([János Benjamin Antal](https://github.com/antaljanosbenjamin)).
* 修复 `negate`（`-`）和 `NOT` 对元组与数组的 AST 格式化不一致。 [#68600](https://github.com/ClickHouse/ClickHouse/pull/68600) ([Vladimir Cherkasov](https://github.com/vdimir)).
* 修复反序列化期间向 `Dynamic` 插入不完整类型的问题，可能引发 `Parameter out of bound`。 [#69291](https://github.com/ClickHouse/ClickHouse/pull/69291) ([Pavel Kruglov](https://github.com/Avogar)).
* 零拷贝复制属于实验性功能，不应在生产使用：修复零拷贝复制 MergeTree 执行 `restore replica` 后的无限循环。[#69293](https://github.com/CljmnickHouse/ClickHouse/pull/69293)（[MikhailBurdukov](https://github.com/MikhailBurdukov)）。
* 恢复 `S3Queue` 的 `processing_threads_num` 默认值为 CPU 核心数。 [#69384](https://github.com/ClickHouse/ClickHouse/pull/69384) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 将嵌套 repeated Protobuf 序列化/反序列化到嵌套列时，绕过 try/catch 流程（修复 [#41971](https://github.com/ClickHouse/ClickHouse/issues/41971)）。 [#69556](https://github.com/ClickHouse/ClickHouse/pull/69556) ([Eliot Hautefeuille](https://github.com/hileef)).
* 修复向 PostgreSQL 引擎 FixedString 列插入时的崩溃。 [#69584](https://github.com/ClickHouse/ClickHouse/pull/69584) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复执行 `create view t as (with recursive 42 as ttt select ttt);` 时的崩溃。 [#69676](https://github.com/ClickHouse/ClickHouse/pull/69676) ([Han Fei](https://github.com/hanfei1991)).
* 修复值类型为 DateTime64 时 `maxMapState` 抛出 'Bad get'。 [#69787](https://github.com/ClickHouse/ClickHouse/pull/69787) ([Michael Kolupaev](https://github.com/al13n321)).
* 通过覆盖 `useDefaultImplementationForLowCardinalityColumns` 返回 `true`，修复 `getSubcolumn` 对 `LowCardinality` 列的处理。 [#69831](https://github.com/ClickHouse/ClickHouse/pull/69831) ([Miсhael Stetsyuk](https://github.com/mstetsyuk)).
* 修复 Distributed 表 DROP 失败后分布式发送永久阻塞。 [#69843](https://github.com/ClickHouse/ClickHouse/pull/69843) ([Azat Khuzhin](https://github.com/azat)).
* 修复含 NaN 键 WITH FILL 的查询无法取消。关闭 [#69261](https://github.com/ClickHouse/ClickHouse/issues/69261)。 [#69845](https://github.com/ClickHouse/ClickHouse/pull/69845) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复旧兼容值下分析器的默认行为。 [#69895](https://github.com/ClickHouse/ClickHouse/pull/69895) ([Raúl Marín](https://github.com/Algunenano)).
* CREATE OR REPLACE VIEW 删除旧表时，不检查依赖关系。此前重建视图存在依赖表时查询会失败。 [#69907](https://github.com/ClickHouse/ClickHouse/pull/69907) ([Pavel Kruglov](https://github.com/Avogar)).
* 与 Decimal 相关的修复，修复 [#69730](https://github.com/ClickHouse/ClickHouse/issues/69730)。 [#69978](https://github.com/ClickHouse/ClickHouse/pull/69978) ([Arthur Passos](https://github.com/arthurpassos)).
* DEFINER/INVOKER 现在适用于参数化视图。 [#69984](https://github.com/ClickHouse/ClickHouse/pull/69984) ([pufit](https://github.com/pufit)).
* 修复视图定义者的解析。 [#69985](https://github.com/ClickHouse/ClickHouse/pull/69985) ([pufit](https://github.com/pufit)).
* 修复时区可能改变含 `Date` 或 `Date32` 参数查询结果的缺陷。 [#70036](https://github.com/ClickHouse/ClickHouse/pull/70036) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 修复嵌套视图与 `WHERE` 条件查询中的 `Block structure mismatch`。修复 [#66209](https://github.com/ClickHouse/ClickHouse/issues/66209)。 [#70054](https://github.com/ClickHouse/ClickHouse/pull/70054) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 计算 `tuple` 时，避免在不同命名元组间复用列。修复 [#70022](https://github.com/ClickHouse/ClickHouse/issues/70022)。 [#70103](https://github.com/ClickHouse/ClickHouse/pull/70103) ([Amos Bird](https://github.com/amosbird)).
* 修复替换范围内字面量时的错误 LOGICAL\_ERROR。 [#70122](https://github.com/ClickHouse/ClickHouse/pull/70122) ([Pablo Marcos](https://github.com/pamarcos)).
* ALTER TABLE MODIFY COLUMN/QUERY 时检查 Nullable(Nothing)，避免创建含该类型的表。 [#70123](https://github.com/ClickHouse/ClickHouse/pull/70123) ([Pavel Kruglov](https://github.com/Avogar)).
* 为非法查询 `JOIN ... ON *` 提供正确错误消息。关闭 [#68650](https://github.com/ClickHouse/ClickHouse/issues/68650)。 [#70124](https://github.com/ClickHouse/ClickHouse/pull/70124) ([Vladimir Cherkasov](https://github.com/vdimir)).
* 修复跳过索引导致的错误结果。 [#70127](https://github.com/ClickHouse/ClickHouse/pull/70127) ([Raúl Marín](https://github.com/Algunenano)).
* 修复 ColumnObject/ColumnTuple 解压方法的数据竞态，可能导致堆内存释放后使用。 [#70137](https://github.com/ClickHouse/ClickHouse/pull/70137) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复 Dynamic 类型 ALTER COLUMN 可能挂起。 [#70144](https://github.com/ClickHouse/ClickHouse/pull/70144) ([Pavel Kruglov](https://github.com/Avogar)).
* 将更多错误视为可重试，不再因此将数据片段标记为损坏。 [#70145](https://github.com/ClickHouse/ClickHouse/pull/70145) ([alesapin](https://github.com/alesapin)).
* 为 JSON 子列创建 Dynamic 类型时使用正确的 `max_types`。 [#70147](https://github.com/ClickHouse/ClickHouse/pull/70147) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复 bcrypt 密码认证用户的密码出现在 `system.query_log` 的问题。 [#70148](https://github.com/ClickHouse/ClickHouse/pull/70148) ([Nikolay Degterinsky](https://github.com/evillique)).
* 修复原生接口事件计数器 InterfaceNativeSendBytes。 [#70153](https://github.com/ClickHouse/ClickHouse/pull/70153) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* 修复 JSON 列相关的潜在崩溃。 [#70172](https://github.com/ClickHouse/ClickHouse/pull/70172) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复 arrayMin 和 arrayMax 的多项问题。 [#70207](https://github.com/ClickHouse/ClickHouse/pull/70207) ([Raúl Marín](https://github.com/Algunenano)).
* JSON 类型解析器遵守 allow\_simdjson。 [#70218](https://github.com/ClickHouse/ClickHouse/pull/70218) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复创建含两个 SELECT 和 `INTERSECT` 的物化视图时的空指针解引用，例如 `CREATE MATERIALIZED VIEW v0 AS (SELECT 1) INTERSECT (SELECT 1);`。 [#70264](https://github.com/ClickHouse/ClickHouse/pull/70264) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 启动脚本不再修改全局设置。此前在启动脚本中改变设置会影响全局。 [#70310](https://github.com/ClickHouse/ClickHouse/pull/70310) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复通过 ALTER 降低 `Dynamic` 的 max\_types 参数可能导致服务器崩溃。 [#70328](https://github.com/ClickHouse/ClickHouse/pull/70328) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复错误使用 WITH FILL 时的崩溃。 [#70338](https://github.com/ClickHouse/ClickHouse/pull/70338) ([Raúl Marín](https://github.com/Algunenano)).
* 修复 `SYSTEM DROP FORMAT SCHEMA CACHE FOR Protobuf` 可能发生的释放后使用。 [#70358](https://github.com/ClickHouse/ClickHouse/pull/70358) ([Azat Khuzhin](https://github.com/azat)).
* 修复按 JSON 子对象子列 GROUP BY 时崩溃。 [#70374](https://github.com/ClickHouse/ClickHouse/pull/70374) ([Pavel Kruglov](https://github.com/Avogar)).
* 数据片段无行时，不为纵向合并预取该片段。 [#70452](https://github.com/ClickHouse/ClickHouse/pull/70452) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复 WHERE 中 lambda 函数导致的崩溃。 [#70464](https://github.com/ClickHouse/ClickHouse/pull/70464) ([Raúl Marín](https://github.com/Algunenano)).
* 修复 `Replicated` 数据库通过 `CREATE ... AS table_function(...)` 建表，且次级副本上表函数源不可用时的问题。 [#70511](https://github.com/ClickHouse/ClickHouse/pull/70511) ([Kseniia Sumarokova](https://github.com/kssenii)).
* `wait_for_async_insert=1` 的异步插入忽略全部输出。关闭 [#62644](https://github.com/ClickHouse/ClickHouse/issues/62644)。 [#70530](https://github.com/ClickHouse/ClickHouse/pull/70530) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 从 system.remote\_data\_paths 遍历 shadow 目录时忽略 frozen\_metadata.txt。 [#70590](https://github.com/ClickHouse/ClickHouse/pull/70590) ([Aleksei Filatov](https://github.com/aalexfvk)).
* 修复在未对齐内存上创建有状态窗口函数。 [#70631](https://github.com/ClickHouse/ClickHouse/pull/70631) ([Raúl Marín](https://github.com/Algunenano)).
* 修复新增带非空默认表达式的 `Array` 列后，`SELECT` 与合并罕见崩溃。 [#70695](https://github.com/ClickHouse/ClickHouse/pull/70695) ([Anton Popov](https://github.com/CurtizJ)).
* 向 s3 表函数插入时遵守查询设置。 [#70696](https://github.com/ClickHouse/ClickHouse/pull/70696) ([Vladimir Cherkasov](https://github.com/vdimir)).
* 启用跳过不支持字段时，修复 Protobuf 结构推断的无限递归。 [#70697](https://github.com/ClickHouse/ClickHouse/pull/70697) ([Raúl Marín](https://github.com/Algunenano)).
* 默认禁用 enable\_named\_columns\_in\_function\_tuple。 [#70833](https://github.com/ClickHouse/ClickHouse/pull/70833) ([Raúl Marín](https://github.com/Algunenano)).
* 修复 S3Queue 的 processing\_threads\_num 从服务器 CPU 核心数推导时未生效。 [#70837](https://github.com/ClickHouse/ClickHouse/pull/70837) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 规范化聚合状态中的命名元组参数。修复 [#69732](https://github.com/ClickHouse/ClickHouse/issues/69732)。 [#70853](https://github.com/ClickHouse/ClickHouse/pull/70853) ([Amos Bird](https://github.com/amosbird)).
* 修复两级哈希表中负零引发的逻辑错误。关闭 [#70973](https://github.com/ClickHouse/ClickHouse/issues/70973)。 [#70979](https://github.com/ClickHouse/ClickHouse/pull/70979) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复分布式查询和并行副本中的 `limit by`、`limit with ties`。 [#70880](https://github.com/ClickHouse/ClickHouse/pull/70880) ([Nikita Taranov](https://github.com/nickitat)).
