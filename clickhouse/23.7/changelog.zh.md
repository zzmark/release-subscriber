<h3 id="237">
  <a id="237" /> ClickHouse 23.7 版本, 2023-07-27. [演示文稿](https://presentations.clickhouse.com/2023-release-23.7/), [视频](https://www.youtube.com/watch?v=TI1kONfON18)
</h3>

<Frame>
  <iframe src="https://www.youtube.com/embed/TI1kONfON18" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
</Frame>

<h4 id="backward-incompatible-change-5">
  向后不兼容变更
</h4>

* 新增 `NAMED COLLECTION` 访问类型（别名为 `USE NAMED COLLECTION`、`NAMED COLLECTION USAGE`）。此 PR 向后不兼容，因为该访问类型默认禁用（其父访问类型 `NAMED COLLECTION ADMIN` 也默认禁用）。提议见 [#50277](https://github.com/ClickHouse/ClickHouse/issues/50277)。使用 `GRANT NAMED COLLECTION ON collection_name TO user` 或 `GRANT NAMED COLLECTION ON * TO user` 授权；要授予这些权限，需要在配置中启用 `named_collection_admin`（此前名为 `named_collection_control`，旧名称保留为别名）。 [#50625](https://github.com/ClickHouse/ClickHouse/pull/50625) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复 `system.parts` 列名 `last_removal_attemp_time` 的拼写错误，现改为 `last_removal_attempt_time`。 [#52104](https://github.com/ClickHouse/ClickHouse/pull/52104) ([filimonov](https://github.com/filimonov)).
* 将 distributed\_ddl\_entry\_format\_version 的默认版本提高至 5，启用 OpenTelemetry 和 initial\_query\_idd 传递。*降级*后将无法处理已有分布式 DDL 条目，不过通常不应存在此类未处理条目。 [#52128](https://github.com/ClickHouse/ClickHouse/pull/52128) ([Azat Khuzhin](https://github.com/azat)).
* 像检查普通元数据一样检查投影元数据。如果存在包含无效投影的表，此变更可能阻止服务器启动。例如，投影在主键中使用位置列（如 `projection p (select * order by 1, 4)`），这在表主键中不被允许，且可能导致插入/合并崩溃。升级前请删除此类投影。修复 [#52353](https://github.com/ClickHouse/ClickHouse/issues/52353)。 [#52361](https://github.com/ClickHouse/ClickHouse/pull/52361) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 因存在缺陷，移除实验性 `hashid` 功能。其实现质量从一开始就存疑，最终未能走出实验阶段。关闭 [#52406](https://github.com/ClickHouse/ClickHouse/issues/52406)。 [#52449](https://github.com/ClickHouse/ClickHouse/pull/52449) ([Alexey Milovidov](https://github.com/alexey-milovidov)).

<h4 id="new-feature-5">
  新功能
</h4>

* 新增 `Overlay` 数据库引擎，将多个数据库组合为一个。新增 `Filesystem` 数据库引擎，将文件系统目录表示为一组自动可用的表，并自动检测格式和结构。新增 `S3` 数据库引擎，将某个前缀下的 S3 存储表示为一组表，提供只读访问。新增 `HDFS` 数据库引擎，以同样方式访问 HDFS 存储。 [#48821](https://github.com/ClickHouse/ClickHouse/pull/48821) ([alekseygolub](https://github.com/alekseygolub)).
* Keeper 支持使用外部磁盘存储快照和日志。 [#50098](https://github.com/ClickHouse/ClickHouse/pull/50098) ([Antonio Andelic](https://github.com/antonio2368)).
* 支持多目录选择（`{}`）的 glob 模式。 [#50559](https://github.com/ClickHouse/ClickHouse/pull/50559) ([Andrey Zvonov](https://github.com/zvonand)).
* Kafka 连接器可使用 URL 编码凭据进行基本认证，从 Schema Registry 获取 Avro 结构定义。 [#49664](https://github.com/ClickHouse/ClickHouse/pull/49664) ([Ilya Golshtein](https://github.com/ilejn)).
* 新增 `arrayJaccardIndex` 函数，计算两个数组的 Jaccard 相似度。 [#50076](https://github.com/ClickHouse/ClickHouse/pull/50076) ([FFFFFFFHHHHHHH](https://github.com/FFFFFFFHHHHHHH)).
* 为 `system.settings` 等表新增 `is_obsolete` 列。关闭 [#50819](https://github.com/ClickHouse/ClickHouse/issues/50819)。 [#50826](https://github.com/ClickHouse/ClickHouse/pull/50826) ([flynn](https://github.com/ucasfl)).
* 支持配置文件中的加密元素，允许在叶子元素中使用加密文本。文本使用 `<encryption_codecs>` 节中的加密编解码器加密。 [#50986](https://github.com/ClickHouse/ClickHouse/pull/50986) ([Roman Vasin](https://github.com/rvasin)).
* Grace Hash Join 算法现在适用于 FULL 和 RIGHT JOIN。[#49483](https://github.com/ClickHouse/ClickHouse/issues/49483)。 [#51013](https://github.com/ClickHouse/ClickHouse/pull/51013) ([lgbo](https://github.com/lgbo-ustc)).
* 新增 `SYSTEM STOP LISTEN` 查询，以便更平稳地终止服务。关闭 [#47972](https://github.com/ClickHouse/ClickHouse/issues/47972)。 [#51016](https://github.com/ClickHouse/ClickHouse/pull/51016) ([Nikolay Degterinsky](https://github.com/evillique)).
* 新增 `input_format_csv_allow_variable_number_of_columns` 选项。 [#51273](https://github.com/ClickHouse/ClickHouse/pull/51273) ([Dmitry Kardymon](https://github.com/kardymonds)).
* 又一项平淡的功能：新增与 Spark 或 MySQL 相同的 `substring_index` 函数。 [#51472](https://github.com/ClickHouse/ClickHouse/pull/51472) ([李扬](https://github.com/taiyang-li)).
* 新增系统表 `jemalloc_bins`，展示 jemalloc 分配桶的统计信息。例如 `SELECT *, size * (nmalloc - ndalloc) AS allocated_bytes FROM system.jemalloc_bins WHERE allocated_bytes > 0 ORDER BY allocated_bytes DESC LIMIT 10`。敬请使用。 [#51674](https://github.com/ClickHouse/ClickHouse/pull/51674) ([Alexander Gololobov](https://github.com/davenger)).
* 新增 `RowBinaryWithDefaults` 格式，在每列前添加一个字节，标记是否使用列默认值。关闭 [#50854](https://github.com/ClickHouse/ClickHouse/issues/50854)。 [#51695](https://github.com/ClickHouse/ClickHouse/pull/51695) ([Kruglov Pavel](https://github.com/Avogar)).
* 新增 `default_temporary_table_engine` 设置，与 `default_table_engine` 类似，但用于临时表。[#51292](https://github.com/ClickHouse/ClickHouse/issues/51292)。 [#51708](https://github.com/ClickHouse/ClickHouse/pull/51708) ([velavokr](https://github.com/velavokr)).
* 新增 `initcap` / `initcapUTF8` 函数，将每个单词的首字母转换为大写，其余字母转换为小写。 [#51735](https://github.com/ClickHouse/ClickHouse/pull/51735) ([Dmitry Kardymon](https://github.com/kardymonds)).
* CREATE TABLE 现在支持在列定义中使用 `PRIMARY KEY` 语法，列按定义顺序加入主索引。 [#51881](https://github.com/ClickHouse/ClickHouse/pull/51881) ([Ilya Yatsishin](https://github.com/qoega)).
* 支持在日志及错误日志文件名中使用日期时间格式符，可通过配置文件（`log`、`errorlog` 标签）或命令行参数（`--log-file`、`--errorlog-file`）指定。 [#51945](https://github.com/ClickHouse/ClickHouse/pull/51945) ([Victor Krasnov](https://github.com/sirvickr)).
* 在 HTTP 响应头中新增峰值内存使用统计。 [#51946](https://github.com/ClickHouse/ClickHouse/pull/51946) ([Dmitry Kardymon](https://github.com/kardymonds)).
* 新增 `hasSubsequence` 函数及 `CaseInsensitive`、`UTF8` 版本，用于匹配字符串中的子序列。 [#52050](https://github.com/ClickHouse/ClickHouse/pull/52050) ([Dmitry Kardymon](https://github.com/kardymonds)).
* 新增 `array_agg` 作为 `groupArray` 的别名，以兼容 PostgreSQL。关闭 [#52100](https://github.com/ClickHouse/ClickHouse/issues/52100)。### 面向用户变更的文档条目。 [#52135](https://github.com/ClickHouse/ClickHouse/pull/52135) ([flynn](https://github.com/ucasfl)).
* 新增 `any_value` 作为 `any` 聚合函数的兼容别名。关闭 [#52140](https://github.com/ClickHouse/ClickHouse/issues/52140)。 [#52147](https://github.com/ClickHouse/ClickHouse/pull/52147) ([flynn](https://github.com/ucasfl)).
* 新增聚合函数 `array_concat_agg` 以兼容 BigQuery，它是 `groupArrayArray` 的别名。关闭 [#52139](https://github.com/ClickHouse/ClickHouse/issues/52139)。 [#52149](https://github.com/ClickHouse/ClickHouse/pull/52149) ([flynn](https://github.com/ucasfl)).
* 新增 `OCTET_LENGTH` 作为 `length` 的别名。关闭 [#52153](https://github.com/ClickHouse/ClickHouse/issues/52153)。 [#52176](https://github.com/ClickHouse/ClickHouse/pull/52176) ([FFFFFFFHHHHHHH](https://github.com/FFFFFFFHHHHHHH)).
* 新增 `firstLine` 函数，提取多行字符串的第一行。关闭 [#51172](https://github.com/ClickHouse/ClickHouse/issues/51172)。 [#52209](https://github.com/ClickHouse/ClickHouse/pull/52209) ([Mikhail Koviazin](https://github.com/mkmkme)).
* 为 `Interval` 数据类型实现 KQL 风格格式化，仅用于兼容 `Kusto` 查询语言。 [#45671](https://github.com/ClickHouse/ClickHouse/pull/45671) ([ltrk2](https://github.com/ltrk2)).
* 新增 `SYSTEM FLUSH ASYNC INSERT QUEUE` 查询，将所有待处理异步插入刷新到目标表。新增服务器设置 `async_insert_queue_flush_on_shutdown`（默认 `true`），决定优雅关闭时是否刷新异步插入队列。`async_insert_threads` 现改为服务器设置。 [#49160](https://github.com/ClickHouse/ClickHouse/pull/49160) ([Anton Popov](https://github.com/CurtizJ)).
* 新增 `current_database` 别名及 `current_schemas` 函数，以兼容 PostgreSQL。 [#51076](https://github.com/ClickHouse/ClickHouse/pull/51076) ([Pedro Riera](https://github.com/priera)).
* 为 `today` 新增别名 `curdate`/`current_date`，为 `now` 新增别名 `current_timestamp`。 [#52106](https://github.com/ClickHouse/ClickHouse/pull/52106) ([Lloyd-Pottiger](https://github.com/Lloyd-Pottiger)).
* 异步插入支持 `async_deduplication_token`。 [#52136](https://github.com/ClickHouse/ClickHouse/pull/52136) ([Han Fei](https://github.com/hanfei1991)).
* 新增 `disable_url_encoding` 设置，允许禁用 URL 引擎对 URI 路径的解码/编码。 [#52337](https://github.com/ClickHouse/ClickHouse/pull/52337) ([Kruglov Pavel](https://github.com/Avogar)).

<h4 id="performance-improvement-5">
  性能改进
</h4>

* 默认启用稀疏序列化格式的自动选择，以提升性能。此格式自 22.1 起受支持，因此此次变更后可能无法降级到 22.1 之前的版本。降级可能需要设置 `ratio_of_defaults_for_sparse_serialization=0.9375`，参见 [55153](https://github.com/ClickHouse/ClickHouse/issues/55153)。可以为 MergeTree 表设置 `ratio_of_defaults_for_sparse_serialization = 1`，禁用稀疏序列化格式。 [#49631](https://github.com/ClickHouse/ClickHouse/pull/49631) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 默认启用 `move_all_conditions_to_prewhere` 和 `enable_multiple_prewhere_read_steps` 设置。 [#46365](https://github.com/ClickHouse/ClickHouse/pull/46365) ([Alexander Gololobov](https://github.com/davenger)).
* 通过调整分配器提升部分查询性能。 [#46416](https://github.com/ClickHouse/ClickHouse/pull/46416) ([Azat Khuzhin](https://github.com/azat)).
* `MergeTreePrefetchedReadPool` 现在与 `MergeTreeReadPool` 一样使用固定大小的任务，并开始为 S3 请求使用连接池。 [#49732](https://github.com/ClickHouse/ClickHouse/pull/49732) ([Nikita Taranov](https://github.com/nickitat)).
* 将更多操作下推到连接右侧。 [#50532](https://github.com/ClickHouse/ClickHouse/pull/50532) ([Nikita Taranov](https://github.com/nickitat)).
* 通过预留哈希表大小优化 grace\_hash 连接（重新提交）。 [#50875](https://github.com/ClickHouse/ClickHouse/pull/50875) ([lgbo](https://github.com/lgbo-ustc)).
* `OpenedFileCache` 中等待锁有时会造成明显开销。将其分片为多个子映射，每个具有独立锁，以避免竞争。 [#51341](https://github.com/ClickHouse/ClickHouse/pull/51341) ([Nikita Taranov](https://github.com/nickitat)).
* 将涉及主键列的条件移到 PREWHERE 链末尾，因为这些条件很可能已用于主键分析，对 PREWHERE 过滤不会再贡献太多。 [#51958](https://github.com/ClickHouse/ClickHouse/pull/51958) ([Alexander Gololobov](https://github.com/davenger)).
* 通过内联 SipHash 加快 String 类型的 `COUNT(DISTINCT)`。在 ICX 设备（Intel Xeon Platinum 8380 CPU，80 核、160 线程）上的 *OnTime* 性能实验表明，此变更可使 *Q8* 查询的 QPS 提升 *11.6%*，同时不影响其他查询。 [#52036](https://github.com/ClickHouse/ClickHouse/pull/52036) ([Zhiguo Zhou](https://github.com/ZhiguoZh)).
* 默认启用 `allow_vertical_merges_from_compact_to_wide_parts`，以节省合并时的内存。 [#52295](https://github.com/ClickHouse/ClickHouse/pull/52295) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复导致主键失效的错误投影分析。此问题仅在 `query_plan_optimize_primary_key = 1, query_plan_optimize_projection = 1` 时存在。修复 [#48823](https://github.com/ClickHouse/ClickHouse/issues/48823)、[#51173](https://github.com/ClickHouse/ClickHouse/issues/51173)。 [#52308](https://github.com/ClickHouse/ClickHouse/pull/52308) ([Amos Bird](https://github.com/amosbird)).
* 减少 `FileCache::loadMetadata` 中的系统调用，配置了文件系统缓存时可加快服务器启动。 [#52435](https://github.com/ClickHouse/ClickHouse/pull/52435) ([Raúl Marín](https://github.com/Algunenano)).
* 通过后台下载剩余数据，允许为文件段大小设置严格下限。文件段最小大小（实际文件更大时）由缓存设置 `boundary_alignment` 控制，默认为 `4Mi`。后台线程数由缓存设置 `background_download_threads` 控制，默认为 `2`。此 PR 还将 `max_file_segment_size` 从 `8Mi` 提高到 `32Mi`。 [#51000](https://github.com/ClickHouse/ClickHouse/pull/51000) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 将 S3 默认超时从 30 秒降至 3 秒，其他 HTTP 默认超时从 180 秒降至 30 秒。 [#51171](https://github.com/ClickHouse/ClickHouse/pull/51171) ([Michael Kolupaev](https://github.com/al13n321)).
* 新增 `merge_tree_determine_task_size_by_prewhere_columns` 设置。设为 `true` 时，仅根据 `PREWHERE` 部分列的大小确定读取任务大小；否则考虑查询中的所有列。 [#52606](https://github.com/ClickHouse/ClickHouse/pull/52606) ([Nikita Taranov](https://github.com/nickitat)).

<h4 id="improvement-5">
  改进
</h4>

* 在 s3/file/url 等表函数中使用 read\_bytes/total\_bytes\_to\_read 显示进度条，提供更准确的进度指示。 [#51286](https://github.com/ClickHouse/ClickHouse/pull/51286) ([Kruglov Pavel](https://github.com/Avogar)).
* 新增表设置 `wait_for_unique_parts_send_before_shutdown_ms`，指定副本关闭负责复制发送的服务器间处理器前等待的时间。同时修复表与服务器间处理器关闭顺序不一致的问题：现在先关闭表，再关闭服务器间处理器。 [#51851](https://github.com/ClickHouse/ClickHouse/pull/51851) ([alesapin](https://github.com/alesapin)).
* 允许不带 `OFFSET` 的 SQL 标准 `FETCH`。参见 [https://antonz.org/sql-fetch/](https://antonz.org/sql-fetch/)。 [#51293](https://github.com/ClickHouse/ClickHouse/pull/51293) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 允许通过配置中的新节 `http_forbid_headers` 过滤 URL/S3 表函数的 HTTP 头，同时支持精确匹配和正则表达式过滤。 [#51038](https://github.com/ClickHouse/ClickHouse/pull/51038) ([Nikolay Degterinsky](https://github.com/evillique)).
* 日志中不再显示 `16 EiB` 可用空间的无意义消息。关闭 [#49320](https://github.com/ClickHouse/ClickHouse/issues/49320)。 [#49342](https://github.com/ClickHouse/ClickHouse/pull/49342) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 正确检查 `sleepEachRow` 函数的限制。新增 `function_sleep_max_microseconds_per_block` 设置，这是通用查询模糊测试器所需的能力。 [#49343](https://github.com/ClickHouse/ClickHouse/pull/49343) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复 `geoHash` 函数中的两个问题。 [#50066](https://github.com/ClickHouse/ClickHouse/pull/50066) ([李扬](https://github.com/taiyang-li)).
* 将异步插入刷新查询记录到 `system.query_log`。 [#51160](https://github.com/ClickHouse/ClickHouse/pull/51160) ([Raúl Marín](https://github.com/Algunenano)).
* `date_diff` 和 `age` 函数现在支持毫秒/微秒单位，并以微秒精度工作。 [#51291](https://github.com/ClickHouse/ClickHouse/pull/51291) ([Dmitry Kardymon](https://github.com/kardymonds)).
* 改进 clickhouse-keeper-client 中的路径解析。 [#51359](https://github.com/ClickHouse/ClickHouse/pull/51359) ([Azat Khuzhin](https://github.com/azat)).
* 依赖 ClickHouse 的第三方产品 Gluten（可将 Spark SQL 性能提高一倍的插件）存在一个缺陷。此修复避免该第三方产品从 HDFS 读取时发生堆溢出。 [#51386](https://github.com/ClickHouse/ClickHouse/pull/51386) ([李扬](https://github.com/taiyang-li)).
* 新增禁用 S3 原生复制的能力：BACKUP/RESTORE 使用 `allow_s3_native_copy` 设置，`s3`/`s3_plain` 磁盘使用 `s3_allow_native_copy`。 [#51448](https://github.com/ClickHouse/ClickHouse/pull/51448) ([Azat Khuzhin](https://github.com/azat)).
* 为 `system.parts` 表新增 `primary_key_size` 列，展示磁盘上压缩主键的大小。关闭 [#51400](https://github.com/ClickHouse/ClickHouse/issues/51400)。 [#51496](https://github.com/ClickHouse/ClickHouse/pull/51496) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 允许在没有 procfs、主目录不存在且没有 glibc 名称解析插件的环境中运行 `clickhouse-local`。 [#51518](https://github.com/ClickHouse/ClickHouse/pull/51518) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 为 rename\_files\_after\_processing 设置新增 `%a` 占位符，表示完整文件名。 [#51603](https://github.com/ClickHouse/ClickHouse/pull/51603) ([Kruglov Pavel](https://github.com/Avogar)).
* 为 `system.parts_columns` 新增 `modification_time` 列。 [#51685](https://github.com/ClickHouse/ClickHouse/pull/51685) ([Azat Khuzhin](https://github.com/azat)).
* 为 CSV 格式新增 `input_format_csv_use_default_on_bad_values` 设置，允许在单个字段解析失败时插入默认值。 [#51716](https://github.com/ClickHouse/ClickHouse/pull/51716) ([KevinyhZou](https://github.com/KevinyhZou)).
* 意外崩溃后将崩溃日志刷新到磁盘。 [#51720](https://github.com/ClickHouse/ClickHouse/pull/51720) ([Alexey Gerasimchuck](https://github.com/Demilivor)).
* 修复仪表盘页面未显示与认证无关错误的问题，并修复图表重叠行为。 [#51744](https://github.com/ClickHouse/ClickHouse/pull/51744) ([Zach Naimon](https://github.com/ArctypeZach)).
* 允许将 UUID 转换为 UInt128。 [#51765](https://github.com/ClickHouse/ClickHouse/pull/51765) ([Dmitry Kardymon](https://github.com/kardymonds)).
* `range` 函数支持 Nullable 参数。 [#51767](https://github.com/ClickHouse/ClickHouse/pull/51767) ([Dmitry Kardymon](https://github.com/kardymonds)).
* 将 `toyear(x) = c` 这样的条件转换为 `c1 <= x < c2`。 [#51795](https://github.com/ClickHouse/ClickHouse/pull/51795) ([Han Fei](https://github.com/hanfei1991)).
* 改进 `SHOW INDEX` 语句的 MySQL 兼容性。 [#51796](https://github.com/ClickHouse/ClickHouse/pull/51796) ([Robert Schulze](https://github.com/rschu1ze)).
* 修复 `use_structure_from_insertion_table_in_table_functions` 不适用于 `MATERIALIZED` 和 `ALIAS` 列的问题。关闭 [#51817](https://github.com/ClickHouse/ClickHouse/issues/51817)、[#51019](https://github.com/ClickHouse/ClickHouse/issues/51019)。 [#51825](https://github.com/ClickHouse/ClickHouse/pull/51825) ([flynn](https://github.com/ucasfl)).
* 缓存字典现在仅向数据源请求去重后的键。关闭 [#51762](https://github.com/ClickHouse/ClickHouse/issues/51762)。 [#51853](https://github.com/ClickHouse/ClickHouse/pull/51853) ([Maksim Kita](https://github.com/kitaisreal)).
* 修复指定 FORMAT 时，设置未应用于 EXPLAIN 查询的问题。 [#51859](https://github.com/ClickHouse/ClickHouse/pull/51859) ([Nikita Taranov](https://github.com/nickitat)).
* 允许在 DESCRIBE TABLE 查询中将 SETTINGS 放在 FORMAT 之前，以与 SELECT 查询兼容。关闭 [#51544](https://github.com/ClickHouse/ClickHouse/issues/51544)。 [#51899](https://github.com/ClickHouse/ClickHouse/pull/51899) ([Nikolay Degterinsky](https://github.com/evillique)).
* Var-Int 编码整数（例如原生协议使用的编码）现在可以使用完整的 64 位范围。建议第三方客户端相应更新其 var-int 代码。 [#51905](https://github.com/ClickHouse/ClickHouse/pull/51905) ([Robert Schulze](https://github.com/rschu1ze)).
* 证书发生变化时自动更新，无需手动执行 SYSTEM RELOAD CONFIG。 [#52030](https://github.com/ClickHouse/ClickHouse/pull/52030) ([Mike Kot](https://github.com/myrrc)).
* 新增 `allow_create_index_without_type` 设置，允许忽略未指定 `TYPE` 的 `ADD INDEX` 查询。标准 SQL 查询将直接成功，而不更改表结构。 [#52056](https://github.com/ClickHouse/ClickHouse/pull/52056) ([Ilya Yatsishin](https://github.com/qoega)).
* 从服务器启动时起，就将日志消息写入 `system.text_log`。 [#52113](https://github.com/ClickHouse/ClickHouse/pull/52113) ([Dmitry Kardymon](https://github.com/kardymonds)).
* HTTP 端点解析到多个 IP 地址且首个不可达时，此前会抛出超时异常。现在创建会话时会处理所有解析得到的端点。 [#52116](https://github.com/ClickHouse/ClickHouse/pull/52116) ([Aleksei Filatov](https://github.com/aalexfvk)).
* Avro 输入格式现在支持仅包含单一类型的 Union。关闭 [#52131](https://github.com/ClickHouse/ClickHouse/issues/52131)。 [#52137](https://github.com/ClickHouse/ClickHouse/pull/52137) ([flynn](https://github.com/ucasfl)).
* 新增 `optimize_use_implicit_projections` 设置，用于禁用隐式投影（目前仅有 `min_max_count` 投影）。 [#52152](https://github.com/ClickHouse/ClickHouse/pull/52152) ([Amos Bird](https://github.com/amosbird)).
* 此前可以利用 `hasToken` 函数触发无限循环，现在已消除此问题。关闭 [#52156](https://github.com/ClickHouse/ClickHouse/issues/52156)。 [#52160](https://github.com/ClickHouse/ClickHouse/pull/52160) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 采用乐观方式创建 ZooKeeper 祖先节点。 [#52195](https://github.com/ClickHouse/ClickHouse/pull/52195) ([Raúl Marín](https://github.com/Algunenano)).
* 修复 [#50582](https://github.com/ClickHouse/ClickHouse/issues/50582)，避免某些有序读取与常量组合场景中的 `Not found column ... in block` 错误。 [#52259](https://github.com/ClickHouse/ClickHouse/pull/52259) ([Chen768959](https://github.com/Chen768959)).
* 在 ClickHouse 端尽早检查 S2 地理图元是否无效。关闭 [#27090](https://github.com/ClickHouse/ClickHouse/issues/27090)。 [#52260](https://github.com/ClickHouse/ClickHouse/pull/52260) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* 补回 `query_plan_optimize_projection = 1` 时缺失的投影 QueryAccessInfo。修复 [#50183](https://github.com/ClickHouse/ClickHouse/issues/50183)、[#50093](https://github.com/ClickHouse/ClickHouse/issues/50093)。 [#52327](https://github.com/ClickHouse/ClickHouse/pull/52327) ([Amos Bird](https://github.com/amosbird)).
* `ZooKeeperRetriesControl` 重新抛出错误时，显示原始堆栈跟踪比显示 `ZooKeeperRetriesControl` 自身的堆栈更有用。 [#52347](https://github.com/ClickHouse/ClickHouse/pull/52347) ([Vitaly Baranov](https://github.com/vitlibar)).
* 即使部分磁盘不支持零复制机制，也等待零复制锁。 [#52376](https://github.com/ClickHouse/ClickHouse/pull/52376) ([Raúl Marín](https://github.com/Algunenano)).
* 现在仅在表关闭后才关闭服务器间端口。 [#52498](https://github.com/ClickHouse/ClickHouse/pull/52498) ([alesapin](https://github.com/alesapin)).

<h4 id="experimental-feature-2">
  实验性功能
</h4>

* Parquet 文件写入现在支持多线程，速度提高至原来的 10 倍，几乎与读取相同。由 `output_format_parquet_use_custom_encoder` 设置控制；由于实现尚不完善，默认禁用。 [#49367](https://github.com/ClickHouse/ClickHouse/pull/49367) ([Michael Kolupaev](https://github.com/al13n321)).
* 新增 [PRQL](https://prql-lang.org/) 查询语言支持。 [#50686](https://github.com/ClickHouse/ClickHouse/pull/50686) ([János Benjamin Antal](https://github.com/antaljanosbenjamin)).
* 允许为自定义磁盘指定名称。此前自定义磁盘使用内部生成的名称，现在可使用 `disk = disk_<name>(...)`（例如磁盘名称为 `name`）。该语法可能在本版本中变化。 [#51552](https://github.com/ClickHouse/ClickHouse/pull/51552) ([Kseniia Sumarokova](https://github.com/kssenii)).
* （实验性 MaterializedMySQL）修复 `mysqlxx::Pool::Entry` 断开连接后仍被使用时的崩溃。 [#52063](https://github.com/ClickHouse/ClickHouse/pull/52063) ([Val Doroshchuk](https://github.com/valbok)).
* （实验性 MaterializedMySQL）支持 `CREATE TABLE ... AS SELECT`。 [#52067](https://github.com/ClickHouse/ClickHouse/pull/52067) ([Val Doroshchuk](https://github.com/valbok)).
* （实验性 MaterializedMySQL）引入文本类型自动转换为 UTF-8 的能力。 [#52084](https://github.com/ClickHouse/ClickHouse/pull/52084) ([Val Doroshchuk](https://github.com/valbok)).
* （实验性 MaterializedMySQL）DDL 现在支持不带引号的 UTF-8 字符串。 [#52318](https://github.com/ClickHouse/ClickHouse/pull/52318) ([Val Doroshchuk](https://github.com/valbok)).
* （实验性 MaterializedMySQL）支持双引号注释。 [#52355](https://github.com/ClickHouse/ClickHouse/pull/52355) ([Val Doroshchuk](https://github.com/valbok)).
* 将 Intel QPL 从 v1.1.0 升级到 v1.2.0。2. 将 Intel accel-config 从 v3.5 升级到 v4.0。3. 修复设备 IOTLB 未命中对 IAA 加速器性能影响很大的问题。 [#52180](https://github.com/ClickHouse/ClickHouse/pull/52180) ([jasperzhu](https://github.com/jinjunzh)).
* 将 23.6 新增的 `session_timezone` 设置降为实验性功能。 [#52445](https://github.com/ClickHouse/ClickHouse/pull/52445) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* ClickHouse Keeper 支持 ZooKeeper `reconfig` 命令，通过 `keeper_server.enable_reconfiguration` 设置启用增量重配置。支持添加服务器、移除服务器和修改服务器优先级。此功能可能尚不完整。 [#49450](https://github.com/ClickHouse/ClickHouse/pull/49450) ([Mike Kot](https://github.com/myrrc)).

<h4 id="buildtestingpackaging-improvement-5">
  构建、测试与打包改进
</h4>

* 在 CI 中新增面向 Linux RISC-V 64 的实验性 ClickHouse 构建。 [#31398](https://github.com/ClickHouse/ClickHouse/pull/31398) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 新增启用分析器的集成测试检查。[#50926](https://github.com/ClickHouse/ClickHouse/pull/50926) [#52210](https://github.com/ClickHouse/ClickHouse/pull/52210) ([Dmitry Novik](https://github.com/novikd)).
* 为 Rust 提供可复现构建。 [#52395](https://github.com/ClickHouse/ClickHouse/pull/52395) ([Azat Khuzhin](https://github.com/azat)).
* 更新 Cargo 依赖。 [#51721](https://github.com/ClickHouse/ClickHouse/pull/51721) ([Raúl Marín](https://github.com/Algunenano)).
* 使 `CHColumnToArrowColumn::fillArrowArrayWithArrayColumnData` 函数支持可空数组；ClickHouse 中不存在此类数组，但 Gluten 需要它们。 [#52112](https://github.com/ClickHouse/ClickHouse/pull/52112) ([李扬](https://github.com/taiyang-li)).
* 将 CCTZ 库更新到 master，没有用户可见的变化。 [#52124](https://github.com/ClickHouse/ClickHouse/pull/52124) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* `system.licenses` 表现在包含独立维护分支的 Poco 库。关闭 [#52066](https://github.com/ClickHouse/ClickHouse/issues/52066)。 [#52127](https://github.com/ClickHouse/ClickHouse/pull/52127) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 检查不正确的标点格式，例如逗号前有空格的 `Hello ,world`，正确形式应为 `Hello, world`。 [#52549](https://github.com/ClickHouse/ClickHouse/pull/52549) ([Alexey Milovidov](https://github.com/alexey-milovidov)).

<h4 id="bug-fix-user-visible-misbehavior-in-an-official-stable-release-5">
  缺陷修复（正式稳定版本中用户可见的异常行为）
</h4>

* 修复 MaterializedPostgreSQL 的 syncTables。 [#49698](https://github.com/ClickHouse/ClickHouse/pull/49698) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复投影与 optimize\_aggregators\_of\_group\_by\_keys 的组合使用。 [#49709](https://github.com/ClickHouse/ClickHouse/pull/49709) ([Amos Bird](https://github.com/amosbird)).
* 修复 JOIN 中的 optimize\_skip\_unused\_shards。 [#51037](https://github.com/ClickHouse/ClickHouse/pull/51037) ([Azat Khuzhin](https://github.com/azat)).
* 修复 formatDateTime() 处理带小数部分的负 DateTime64 值的问题。 [#51290](https://github.com/ClickHouse/ClickHouse/pull/51290) ([Dmitry Kardymon](https://github.com/kardymonds)).
* `hasToken*` 函数此前完全错误。为 [#43358](https://github.com/ClickHouse/ClickHouse/issues/43358) 添加测试。 [#51378](https://github.com/ClickHouse/ClickHouse/pull/51378) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复将函数移到排序之前的优化。 [#51481](https://github.com/ClickHouse/ClickHouse/pull/51481) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复 FINAL 在 Pipe::unitePipes 中的 Block structure mismatch。 [#51492](https://github.com/ClickHouse/ClickHouse/pull/51492) ([Nikita Taranov](https://github.com/nickitat)).
* 修复所有分片权重均为零的集群中的 SIGSEGV，也修复 INSERT INTO FUNCTION clusterAllReplicas()。 [#51545](https://github.com/ClickHouse/ClickHouse/pull/51545) ([Azat Khuzhin](https://github.com/azat)).
* 修复对冲请求的超时。 [#51582](https://github.com/ClickHouse/ClickHouse/pull/51582) ([Azat Khuzhin](https://github.com/azat)).
* 修复 ANTI JOIN 与 NULL 组合时的逻辑错误。 [#51601](https://github.com/ClickHouse/ClickHouse/pull/51601) ([vdimir](https://github.com/vdimir)).
* 修复将 IN 条件移到 PREWHERE 的行为。 [#51610](https://github.com/ClickHouse/ClickHouse/pull/51610) ([Alexander Gololobov](https://github.com/davenger)).
* 不对 ASOF/ANTI JOIN 应用 PredicateExpressionsOptimizer。 [#51633](https://github.com/ClickHouse/ClickHouse/pull/51633) ([vdimir](https://github.com/vdimir)).
* 修复使用合并算法的 ReplicatedMergeTree 中启用去重的异步插入。 [#51676](https://github.com/ClickHouse/ClickHouse/pull/51676) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复 `parseSipHashKey` 读取空列的问题。 [#51804](https://github.com/ClickHouse/ClickHouse/pull/51804) ([Nikita Taranov](https://github.com/nickitat)).
* 修复创建无效 EmbeddedRocksdb 表时的段错误。 [#51847](https://github.com/ClickHouse/ClickHouse/pull/51847) ([Duc Canh Le](https://github.com/canhld94)).
* 修复向 MongoDB 表插入数据。 [#51876](https://github.com/ClickHouse/ClickHouse/pull/51876) ([Nikolay Degterinsky](https://github.com/evillique)).
* 修复 DatabaseCatalog 关闭时的死锁。 [#51908](https://github.com/ClickHouse/ClickHouse/pull/51908) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 修复子查询运算符中的错误。 [#51922](https://github.com/ClickHouse/ClickHouse/pull/51922) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复异步连接具有多个 IP 的主机。 [#51934](https://github.com/ClickHouse/ClickHouse/pull/51934) ([Kruglov Pavel](https://github.com/Avogar)).
* ActionsDAG::merge 后不移除输入。 [#51947](https://github.com/ClickHouse/ClickHouse/pull/51947) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 在 `RemoveManyObjectStorageOperation::finalize` 中而非 `execute` 中检查引用计数。 [#51954](https://github.com/ClickHouse/ClickHouse/pull/51954) ([vdimir](https://github.com/vdimir)).
* 允许参数化 UDF。 [#51964](https://github.com/ClickHouse/ClickHouse/pull/51964) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 小幅修复 toDateTime64() 对 2283-12-31 之后日期的处理。 [#52130](https://github.com/ClickHouse/ClickHouse/pull/52130) ([Andrey Zvonov](https://github.com/zvonand)).
* 修复按窗口函数元组执行 ORDER BY。 [#52145](https://github.com/ClickHouse/ClickHouse/pull/52145) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复聚合表达式包含单调函数时的错误投影分析。 [#52151](https://github.com/ClickHouse/ClickHouse/pull/52151) ([Amos Bird](https://github.com/amosbird)).
* 修复 `groupArrayMoving` 函数中的错误。 [#52161](https://github.com/ClickHouse/ClickHouse/pull/52161) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 对范围字典禁用直接连接。 [#52187](https://github.com/ClickHouse/ClickHouse/pull/52187) ([Duc Canh Le](https://github.com/canhld94)).
* 修复变更操作卡住的测试及一个极罕见的竞态条件。 [#52197](https://github.com/ClickHouse/ClickHouse/pull/52197) ([alesapin](https://github.com/alesapin)).
* 修复 Web 磁盘中的竞态条件。 [#52211](https://github.com/ClickHouse/ClickHouse/pull/52211) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复收到服务器未知数据包时 Connection::setAsyncCallback 中的数据竞争。 [#52219](https://github.com/ClickHouse/ClickHouse/pull/52219) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复启动时临时数据的删除，并添加测试。 [#52275](https://github.com/ClickHouse/ClickHouse/pull/52275) ([vdimir](https://github.com/vdimir)).
* 统计可空列时不使用 minmax\_count 投影。 [#52297](https://github.com/ClickHouse/ClickHouse/pull/52297) ([Amos Bird](https://github.com/amosbird)).
* MergeTree/ReplicatedMergeTree 应为日志条目使用服务器时区。 [#52325](https://github.com/ClickHouse/ClickHouse/pull/52325) ([Azat Khuzhin](https://github.com/azat)).
* 修复包含 CTE 且被多次使用的参数化视图。 [#52328](https://github.com/ClickHouse/ClickHouse/pull/52328) ([SmitaRKulkarni](https://github.com/SmitaRKulkarni)).
* 对时间间隔禁用表达式模板。 [#52335](https://github.com/ClickHouse/ClickHouse/pull/52335) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 修复 Keeper 中的 `apply_snapshot`。 [#52358](https://github.com/ClickHouse/ClickHouse/pull/52358) ([Antonio Andelic](https://github.com/antonio2368)).
* 更新 build-osx.md。 [#52377](https://github.com/ClickHouse/ClickHouse/pull/52377) ([AlexBykovski](https://github.com/AlexBykovski)).
* 修复 `countSubstrings` 在待查找字符串为空且被搜索字符串为列时挂起的问题。 [#52409](https://github.com/ClickHouse/ClickHouse/pull/52409) ([Sergei Trifonov](https://github.com/serxa)).
* 修复普通投影与 Merge 表的组合使用。 [#52432](https://github.com/ClickHouse/ClickHouse/pull/52432) ([Amos Bird](https://github.com/amosbird)).
* 修复 Aggregator 中可能出现的重复释放。 [#52439](https://github.com/ClickHouse/ClickHouse/pull/52439) ([Nikita Taranov](https://github.com/nickitat)).
* 修复向 Buffer 引擎插入数据。 [#52440](https://github.com/ClickHouse/ClickHouse/pull/52440) ([Vasily Nemkov](https://github.com/Enmk)).
* 修复 AnyHash 实现不符合规范的问题。 [#52448](https://github.com/ClickHouse/ClickHouse/pull/52448) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 在 OptimizedRegularExpression 中检查递归深度。 [#52451](https://github.com/ClickHouse/ClickHouse/pull/52451) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复 DatabaseReplicated::startupTables()/canExecuteReplicatedMetadataAlter() 中的数据竞争。 [#52490](https://github.com/ClickHouse/ClickHouse/pull/52490) ([Azat Khuzhin](https://github.com/azat)).
* 修复 `transform` 函数中的异常终止。 [#52513](https://github.com/ClickHouse/ClickHouse/pull/52513) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复删除投影后的轻量级删除。 [#52517](https://github.com/ClickHouse/ClickHouse/pull/52517) ([Anton Popov](https://github.com/CurtizJ)).
* 修复可能出现的错误 “Cannot drain connections: cancel first”。 [#52585](https://github.com/ClickHouse/ClickHouse/pull/52585) ([Kruglov Pavel](https://github.com/Avogar)).
