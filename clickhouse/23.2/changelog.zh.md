<h3 id="232">
  <a id="232" /> ClickHouse 23.2 版本, 2023-02-23. [演示文稿](https://presentations.clickhouse.com/2023-release-23.2/), [视频](https://www.youtube.com/watch?v=2o0vRMMIrkY)
</h3>

<Frame>
  <iframe src="https://www.youtube.com/embed/2o0vRMMIrkY" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
</Frame>

<h4 id="backward-incompatible-change-8">
  向后不兼容变更
</h4>

* 扩展 “toDayOfWeek()” 函数（别名 “DAYOFWEEK”），新增 mode 参数，用于指定一周从周一还是周日开始，以及从 0 还是 1 开始计数。为与其他日期时间函数保持一致，mode 参数放在时间和时区参数之间。此变更破坏了此前未记录在文档中的双参数语法 “toDayOfWeek(time, time\_zone)” 的现有用法，可将其改写为 “toDayOfWeek(time, 0, time\_zone)” 来修复。 [#45233](https://github.com/ClickHouse/ClickHouse/pull/45233) ([Robert Schulze](https://github.com/rschu1ze)).
* 将 `max_query_cache_size` 设置重命名为 `filesystem_cache_max_download_size`。 [#45614](https://github.com/ClickHouse/ClickHouse/pull/45614) ([Kseniia Sumarokova](https://github.com/kssenii)).
* `default` 用户默认不再拥有 `SHOW NAMED COLLECTION` 访问类型的权限（例如，`default` 用户将无法像以前那样向其他用户授予 ALL 权限，因此该 PR 是向后不兼容的）。 [#46010](https://github.com/ClickHouse/ClickHouse/pull/46010) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 如果 SETTINGS 子句位于 FORMAT 子句之前，设置也会应用于格式化。 [#46003](https://github.com/ClickHouse/ClickHouse/pull/46003) ([Azat Khuzhin](https://github.com/azat)).
* 移除对 `materialized_postgresql_allow_automatic_update` 设置的支持（该设置此前默认关闭）。 [#46106](https://github.com/ClickHouse/ClickHouse/pull/46106) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 小幅提升 `countDigits` 在实际数据集上的性能。关闭 [#44518](https://github.com/ClickHouse/ClickHouse/issues/44518)。此前版本中 `countDigits(0)` 返回 `0`，现在返回 `1`，更加正确，也符合现有文档。 [#46187](https://github.com/ClickHouse/ClickHouse/pull/46187) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 禁止创建采用 “Delta” 或 “DoubleDelta” 后接 “Gorilla” 或 “FPC” 编解码器组合压缩的新列。可使用 “allow\_suspicious\_codecs = true” 设置绕过此限制。 [#45652](https://github.com/ClickHouse/ClickHouse/pull/45652) ([Robert Schulze](https://github.com/rschu1ze)).

<h4 id="new-feature-10">
  新功能
</h4>

* 新增 `StorageIceberg` 和 `iceberg` 表函数，用于访问存储在 S3 上的 Iceberg 表。 [#45384](https://github.com/ClickHouse/ClickHouse/pull/45384) ([flynn](https://github.com/ucasfl)).
* 允许通过 `SETTINGS disk = '<disk_name>'` 配置存储（代替 `storage_policy`），并可使用 `SETTINGS disk = disk(type=s3, ...)` 显式创建磁盘。 [#41976](https://github.com/ClickHouse/ClickHouse/pull/41976) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 在 `system.part_log` 中提供 `ProfileEvents` 计数器。 [#38614](https://github.com/ClickHouse/ClickHouse/pull/38614) ([Bharat Nallan](https://github.com/bharatnc)).
* 扩展现有 `ReplacingMergeTree` 引擎以允许重复插入，在一个 MergeTree 引擎中结合 `ReplacingMergeTree` 和 `CollapsingMergeTree` 的能力。查询不会返回已删除的数据，但这些数据也不会从磁盘移除。 [#41005](https://github.com/ClickHouse/ClickHouse/pull/41005) ([youennL-cs](https://github.com/youennL-cs)).
* 新增 `generateULID` 函数。关闭 [#36536](https://github.com/ClickHouse/ClickHouse/issues/36536)。 [#44662](https://github.com/ClickHouse/ClickHouse/pull/44662) ([Nikolay Degterinsky](https://github.com/evillique)).
* 新增 `corrMatrix` 聚合函数，对每两列进行计算。此外，由于聚合函数 `covarSamp` 和 `covarPop` 与 `corr` 类似，也一并新增 `covarSampMatrix`、`covarPopMatrix`。@alexey-milovidov 关闭 [#44587](https://github.com/ClickHouse/ClickHouse/issues/44587)。 [#44680](https://github.com/ClickHouse/ClickHouse/pull/44680) ([FFFFFFFHHHHHHH](https://github.com/FFFFFFFHHHHHHH)).
* 引入 arrayShuffle 函数，用于随机排列数组。 [#45271](https://github.com/ClickHouse/ClickHouse/pull/45271) ([Joanna Hulboj](https://github.com/jh0x)).
* 支持 Arrow 中的 `FIXED_SIZE_BINARY` 类型和 `Parquet` 中的 `FIXED_LENGTH_BYTE_ARRAY`，并将其映射为 `FixedString`。新增 `output_format_parquet_fixed_string_as_fixed_byte_array/output_format_arrow_fixed_string_as_fixed_byte_array` 设置，控制 FixedString 的默认输出类型。关闭 [#45326](https://github.com/ClickHouse/ClickHouse/issues/45326)。 [#45340](https://github.com/ClickHouse/ClickHouse/pull/45340) ([Kruglov Pavel](https://github.com/Avogar)).
* 为 system.replication\_queue 新增 `last_exception_time` 列。 [#45457](https://github.com/ClickHouse/ClickHouse/pull/45457) ([Frank Chen](https://github.com/FrankChen021)).
* 新增两个函数，允许为 SipHash{64,128} 指定用户自定义的键/种子。 [#45513](https://github.com/ClickHouse/ClickHouse/pull/45513) ([Salvatore Mesoraca](https://github.com/aiven-sal)).
* 允许使用三参数版本的 `format` 表函数。关闭 [#45808](https://github.com/ClickHouse/ClickHouse/issues/45808)。 [#45873](https://github.com/ClickHouse/ClickHouse/pull/45873) ([FFFFFFFHHHHHHH](https://github.com/FFFFFFFHHHHHHH)).
* 为 `JodaTime` 格式新增 'x'、'w'、'S' 支持。参见 [https://joda-time.sourceforge.net/apidocs/org/joda/time/format/DateTimeFormat.html](https://joda-time.sourceforge.net/apidocs/org/joda/time/format/DateTimeFormat.html)。 [#46073](https://github.com/ClickHouse/ClickHouse/pull/46073) ([zk\_kiger](https://github.com/zk-kiger)).
* 支持窗口函数 `ntile`。([lgbo](https://github.com/lgbo-ustc))。
* 新增 `final` 设置，隐式对每张表应用 `FINAL` 修饰符。 [#40945](https://github.com/ClickHouse/ClickHouse/pull/40945) ([Arthur Passos](https://github.com/arthurpassos)).
* 新增 `arrayPartialSort` 和 `arrayPartialReverseSort` 函数。 [#46296](https://github.com/ClickHouse/ClickHouse/pull/46296) ([Joanna Hulboj](https://github.com/jh0x)).
* 新增 HTTP 参数 `client_protocol_version`，允许为采用 Native 格式的 HTTP 响应设置客户端协议版本。[#40397](https://github.com/ClickHouse/ClickHouse/issues/40397)。 [#46360](https://github.com/ClickHouse/ClickHouse/pull/46360) ([Geoff Genz](https://github.com/genzgd)).
* 新增 `regexpExtract` 函数，类似于 Spark 的 `REGEXP_EXTRACT` 函数，以提供兼容性；它与现有的 `extract` 函数类似。 [#46469](https://github.com/ClickHouse/ClickHouse/pull/46469) ([李扬](https://github.com/taiyang-li)).
* 新增 `JSONArrayLength` 函数，返回最外层 JSON 数组的元素数量。如果输入 JSON 字符串无效，则返回 NULL。 [#46631](https://github.com/ClickHouse/ClickHouse/pull/46631) ([李扬](https://github.com/taiyang-li)).

<h4 id="performance-improvement-10">
  性能改进
</h4>

* 当 PREWHERE 条件由多个条件合取而成（cond1 AND cond2 AND ...）时，新增逻辑会将需要读取相同列的条件分组为多个步骤。每一步都会计算完整条件中的相应部分，并可能据此过滤结果行，使后续步骤读取更少的行，从而节省 IO 带宽并减少计算。目前此逻辑默认禁用，确认不会导致回归后，将在后续某个版本中默认启用，因此非常鼓励用户参与测试。可通过两个设置控制：“enable\_multiple\_prewhere\_read\_steps” 和 “move\_all\_conditions\_to\_prewhere”。 [#46140](https://github.com/ClickHouse/ClickHouse/pull/46140) ([Alexander Gololobov](https://github.com/davenger)).
* 新增选项，在表分区键与分组键兼容时独立聚合各分区。由 `allow_aggregate_partitions_independently` 设置控制。由于适用范围有限，默认禁用（请参阅文档）。 [#45364](https://github.com/ClickHouse/ClickHouse/pull/45364) ([Nikita Taranov](https://github.com/nickitat)).
* 允许对 Compact 格式的数据片段使用纵向合并算法，从而大幅降低 ClickHouse 服务器后台操作的内存占用。关闭 [#46084](https://github.com/ClickHouse/ClickHouse/issues/46084)。[#45681](https://github.com/ClickHouse/ClickHouse/pull/45681) [#46282](https://github.com/ClickHouse/ClickHouse/pull/46282) ([Anton Popov](https://github.com/CurtizJ)).
* 通过使用批量读取器优化 `Parquet` 读取器。 [#45878](https://github.com/ClickHouse/ClickHouse/pull/45878) ([LiuNeng](https://github.com/liuneng1994)).
* 新增基于 Linux 异步 [io\_uring](https://kernel.dk/io_uring.pdf) 子系统的 `local_filesystem_read_method` 读取方式 `io_uring`，与默认 `pread` 方式相比，几乎在所有场景下都能提高读取性能。 [#38456](https://github.com/ClickHouse/ClickHouse/pull/38456) ([Saulius Valatka](https://github.com/sauliusvl)).
* 在逻辑等价时，重写以 `if` 表达式为参数的聚合函数。例如，`avg(if(cond, col, null))` 可改写为 avgIf(cond, col)，有助于提升性能。 [#44730](https://github.com/ClickHouse/ClickHouse/pull/44730) ([李扬](https://github.com/taiyang-li)).
* 使用 avx512 指令提升 lower/upper 函数的性能。 [#37894](https://github.com/ClickHouse/ClickHouse/pull/37894) ([yaqi-zhao](https://github.com/yaqi-zhao)).
* 移除在核心数 >=32 且禁用 SMT 的系统上 ClickHouse 仅使用一半核心的限制（即在 BIOS 中禁用超线程的情况）。 [#44973](https://github.com/ClickHouse/ClickHouse/pull/44973) ([Robert Schulze](https://github.com/rschu1ze)).
* 通过按列执行提升 `multiIf` 函数性能，速度提高至 2.3 倍。 [#45296](https://github.com/ClickHouse/ClickHouse/pull/45296) ([李扬](https://github.com/taiyang-li)).
* 为 `position` 函数在待查找字符串为空时新增快速路径。 [#45382](https://github.com/ClickHouse/ClickHouse/pull/45382) ([李扬](https://github.com/taiyang-li)).
* 默认启用 `query_plan_remove_redundant_sorting` 优化，该优化在 [#45420](https://github.com/ClickHouse/ClickHouse/issues/45420) 中实现。 [#45567](https://github.com/ClickHouse/ClickHouse/pull/45567) ([Igor Nikonov](https://github.com/devcrafter)).
* 增大 HTTP Transfer Encoding 的分块大小，以提高通过 HTTP 接口执行大型查询的性能。 [#45593](https://github.com/ClickHouse/ClickHouse/pull/45593) ([Geoff Genz](https://github.com/genzgd)).
* 修复从包含大量 `Array`/`Map`/`Nested` 列的表读取数据时，短 `SELECT` 查询的性能问题。 [#45630](https://github.com/ClickHouse/ClickHouse/pull/45630) ([Anton Popov](https://github.com/CurtizJ)).
* 提升大整数和定点数类型的过滤性能。 [#45949](https://github.com/ClickHouse/ClickHouse/pull/45949) ([李扬](https://github.com/taiyang-li)).
* 此项变更可有效降低从 ColumnNullable(UInt8) 获取过滤器的开销，并提升整体查询性能。为评估其影响，我们使用 TPC-H 基准测试，将列类型由不可空改为可空，并以查询 QPS 作为性能指标。 [#45962](https://github.com/ClickHouse/ClickHouse/pull/45962) ([Zhiguo Zhou](https://github.com/ZhiguoZh)).
* 将虚拟列 `_part` 和 `_partition_id` 改为 `LowCardinality(String)` 类型。关闭 [#45964](https://github.com/ClickHouse/ClickHouse/issues/45964)。 [#45975](https://github.com/ClickHouse/ClickHouse/pull/45975) ([flynn](https://github.com/ucasfl)).
* 提升小数位数不变时 Decimal 转换的性能。 [#46095](https://github.com/ClickHouse/ClickHouse/pull/46095) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 允许增加读取数据时的预取量。 [#46168](https://github.com/ClickHouse/ClickHouse/pull/46168) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 将 `arrayExists(x -> x = 1, arr)` 重写为 `has(arr, 1)`，性能提高至 1.34 倍。 [#46188](https://github.com/ClickHouse/ClickHouse/pull/46188) ([李扬](https://github.com/taiyang-li)).
* 修复非远程磁盘上纵向合并内存占用过大的问题；在远程磁盘上遵循 `max_insert_delayed_streams_for_parallel_write` 设置。 [#46275](https://github.com/ClickHouse/ClickHouse/pull/46275) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 将 zstd 更新到 v1.5.4，性能和压缩率均有小幅改进。如果副本运行不同版本的 ClickHouse，可能会看到附带解释的合理错误消息 `Data after merge/mutation is not byte-identical to data on another replicas.`。这些消息是正常的，无需担心。 [#46280](https://github.com/ClickHouse/ClickHouse/pull/46280) ([Raúl Marín](https://github.com/Algunenano)).
* 修复 [#39737](https://github.com/ClickHouse/ClickHouse/issues/39737) 导致的性能下降。 [#46309](https://github.com/ClickHouse/ClickHouse/pull/46309) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 即使复制队列很大，`replicas_status` 处理入口也能快速响应。 [#46310](https://github.com/ClickHouse/ClickHouse/pull/46310) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 为聚合函数 `sum`、一元算术函数和比较函数新增 avx512 支持。 [#37870](https://github.com/ClickHouse/ClickHouse/pull/37870) ([zhao zhou](https://github.com/zzachimed)).
* 重写标记分发及读取总体协调相关的代码，以实现最大性能提升。关闭 [#34527](https://github.com/ClickHouse/ClickHouse/issues/34527)。 [#43772](https://github.com/ClickHouse/ClickHouse/pull/43772) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* 移除查询（子查询）中的冗余 DISTINCT 子句。此优化基于查询计划实现，对 DISTINCT 子句的作用类似于 `optimize_duplicate_order_by_and_distinct`。可通过 `query_plan_remove_redundant_distinct` 设置启用。与 [#42648](https://github.com/ClickHouse/ClickHouse/issues/42648) 相关。 [#44176](https://github.com/ClickHouse/ClickHouse/pull/44176) ([Igor Nikonov](https://github.com/devcrafter)).
* 新增几项查询重写优化：`sumIf(123, cond) -> 123 * countIf(1, cond)`、`sum(if(cond, 123, 0)) -> 123 * countIf(cond)`、`sum(if(cond, 0, 123)) -> 123 * countIf(not(cond))`。 [#44728](https://github.com/ClickHouse/ClickHouse/pull/44728) ([李扬](https://github.com/taiyang-li)).
* 改进顶层查询计划中受内存约束的合并与有序聚合之间的协作。此前某些情况下，即使实际没有必要，也会为有序聚合（AIO）退回到显式排序。 [#45892](https://github.com/ClickHouse/ClickHouse/pull/45892) ([Nikita Taranov](https://github.com/nickitat)).
* 默认使用轮转方式调度并发合并，确保操作公平且不会饥饿。此前，负载极高的分片采用严格优先级调度时，大型合并可能因小型合并而无法获得执行机会。新增服务器配置选项 `background_merges_mutations_scheduling_policy`，用于选择调度算法（`round_robin` 或 `shortest_task_first`）。 [#46247](https://github.com/ClickHouse/ClickHouse/pull/46247) ([Sergei Trifonov](https://github.com/serxa)).

<h4 id="improvement-10">
  改进
</h4>

* 默认启用 ZooKeeper 会话丢失时的 INSERT 重试。我们已在生产环境中使用此功能。 [#46308](https://github.com/ClickHouse/ClickHouse/pull/46308) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 新增忽略命名元组对应 JSON 对象中未知键的能力（`input_format_json_ignore_unknown_keys_in_named_tuple`）。 [#45678](https://github.com/ClickHouse/ClickHouse/pull/45678) ([Azat Khuzhin](https://github.com/azat)).
* 对于带 `final` 的查询，支持将 `where` 子句中的排序键表达式移到 `prewhere` 进行优化。[#38893](https://github.com/ClickHouse/ClickHouse/issues/38893)。 [#38950](https://github.com/ClickHouse/ClickHouse/pull/38950) ([hexiaoting](https://github.com/hexiaoting)).
* 新增备份指标 num\_processed\_files 和 processed\_files\_size，用于描述实际已处理的文件数量及大小。 [#42244](https://github.com/ClickHouse/ClickHouse/pull/42244) ([Aleksandr](https://github.com/AVMusorin)).
* 新增服务器间 DNS 错误重试。 [#43179](https://github.com/ClickHouse/ClickHouse/pull/43179) ([Anton Kozlov](https://github.com/tonickkozlov)).
* Keeper 改进：尝试预分配磁盘空间，避免磁盘空间不足导致的未定义问题。引入 `max_log_file_size` 设置，限制 Keeper 的 Raft 日志文件最大大小。 [#44370](https://github.com/ClickHouse/ClickHouse/pull/44370) ([Antonio Andelic](https://github.com/antonio2368)).
* 优化副本只读时副本延迟 API 的逻辑行为。 [#45148](https://github.com/ClickHouse/ClickHouse/pull/45148) ([mateng915](https://github.com/mateng0915)).
* 当空密码不正确时，clickhouse-client 交互式提示输入密码。关闭 [#46702](https://github.com/ClickHouse/ClickHouse/issues/46702)。 [#46730](https://github.com/ClickHouse/ClickHouse/pull/46730) ([Nikolay Degterinsky](https://github.com/evillique)).
* 将在非 Float\* 类型列上使用 `Gorilla` 压缩标记为可疑。 [#45376](https://github.com/ClickHouse/ClickHouse/pull/45376) ([Robert Schulze](https://github.com/rschu1ze)).
* 在 `postpone_reason` 列中显示正在执行合并的副本名称。 [#45458](https://github.com/ClickHouse/ClickHouse/pull/45458) ([Frank Chen](https://github.com/FrankChen021)).
* 在 part\_log 中保存异常堆栈跟踪。 [#45459](https://github.com/ClickHouse/ClickHouse/pull/45459) ([Frank Chen](https://github.com/FrankChen021)).
* 完善 `regexp_tree` 字典，使其兼容 [https://github.com/ua-parser/uap-core](https://github.com/ua-parser/uap-core)。 [#45631](https://github.com/ClickHouse/ClickHouse/pull/45631) ([Han Fei](https://github.com/hanfei1991)).
* 更新 `SYSTEM SYNC REPLICA` 的检查，解决 [#45508](https://github.com/ClickHouse/ClickHouse/issues/45508)。 [#45648](https://github.com/ClickHouse/ClickHouse/pull/45648) ([SmitaRKulkarni](https://github.com/SmitaRKulkarni)).
* 将 `replication_alter_partitions_sync` 设置重命名为 `alter_sync`。 [#45659](https://github.com/ClickHouse/ClickHouse/pull/45659) ([Antonio Andelic](https://github.com/antonio2368)).
* `generateRandom` 表函数和引擎现在支持 `LowCardinality` 数据类型，适用于测试。例如，可以编写 `INSERT INTO table SELECT * FROM generateRandom() LIMIT 1000`。这也是调试 [#45590](https://github.com/ClickHouse/ClickHouse/issues/45590) 所需的功能。 [#45661](https://github.com/ClickHouse/ClickHouse/pull/45661) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 实验性查询结果缓存现在提供更加模块化的配置设置。 [#45679](https://github.com/ClickHouse/ClickHouse/pull/45679) ([Robert Schulze](https://github.com/rschu1ze)).
* 将“查询结果缓存”重命名为“查询缓存”。 [#45682](https://github.com/ClickHouse/ClickHouse/pull/45682) ([Robert Schulze](https://github.com/rschu1ze)).
* 新增 `SYSTEM SYNC FILE CACHE` 命令，用于执行 `sync` 系统调用。[#8921](https://github.com/ClickHouse/ClickHouse/issues/8921)。 [#45685](https://github.com/ClickHouse/ClickHouse/pull/45685) ([DR](https://github.com/freedomDR)).
* 新增 S3 设置 `allow_head_object_request`。此 PR 将 [https://github.com/ClickHouse/ClickHouse/pull/45288](https://github.com/ClickHouse/ClickHouse/pull/45288) 引入的以 `GetObjectAttributes` 请求替代 `HeadObject` 的行为改为可选，且默认禁用。 [#45701](https://github.com/ClickHouse/ClickHouse/pull/45701) ([Vitaly Baranov](https://github.com/vitlibar)).
* 支持根据连接名称覆盖连接设置（现在无需为每个连接分别保存密码，只需将所有配置放入 `~/.clickhouse-client/config.xml`，还可为不同连接使用不同的历史记录文件，这也很实用）。 [#45715](https://github.com/ClickHouse/ClickHouse/pull/45715) ([Azat Khuzhin](https://github.com/azat)).
* Arrow 格式支持 duration 类型。关闭 [#45669](https://github.com/ClickHouse/ClickHouse/issues/45669)。 [#45750](https://github.com/ClickHouse/ClickHouse/pull/45750) ([flynn](https://github.com/ucasfl)).
* 扩展查询缓存日志，便于调查缓存行为。 [#45751](https://github.com/ClickHouse/ClickHouse/pull/45751) ([Robert Schulze](https://github.com/rschu1ze)).
* 查询缓存的服务器级设置现在可在运行时重新配置。 [#45758](https://github.com/ClickHouse/ClickHouse/pull/45758) ([Robert Schulze](https://github.com/rschu1ze)).
* 通过命名集合指定表函数参数时，在日志中隐藏密码。 [#45774](https://github.com/ClickHouse/ClickHouse/pull/45774) ([Vitaly Baranov](https://github.com/vitlibar)).
* 改进内部 S3 客户端，使其正确推断不同类型 URL 的区域和重定向。 [#45783](https://github.com/ClickHouse/ClickHouse/pull/45783) ([Antonio Andelic](https://github.com/antonio2368)).
* 为 generateRandom 新增 Map、IPv4 和 IPv6 类型支持，主要用于测试。 [#45785](https://github.com/ClickHouse/ClickHouse/pull/45785) ([Raúl Marín](https://github.com/Algunenano)).
* 为 IP 类型支持 empty/notEmpty。 [#45799](https://github.com/ClickHouse/ClickHouse/pull/45799) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* 将 `num_processed_files` 列拆分为 `num_files`（用于 BACKUP）和 `files_read`（用于 RESTORE）；将 `processed_files_size` 列拆分为 `total_size`（用于 BACKUP）和 `bytes_read`（用于 RESTORE）。 [#45800](https://github.com/ClickHouse/ClickHouse/pull/45800) ([Vitaly Baranov](https://github.com/vitlibar)).
* 支持 `SHOW ENGINES` 查询，以兼容 MySQL。 [#45859](https://github.com/ClickHouse/ClickHouse/pull/45859) ([Filatenkov Artur](https://github.com/FArthur-cmd)).
* 改进混淆器对查询的处理方式。 [#45867](https://github.com/ClickHouse/ClickHouse/pull/45867) ([Raúl Marín](https://github.com/Algunenano)).
* 改进转换为 Date 时对边界值 65535（2149-06-06）的处理。[#46042](https://github.com/ClickHouse/ClickHouse/pull/46042) [#45914](https://github.com/ClickHouse/ClickHouse/pull/45914) ([Joanna Hulboj](https://github.com/jh0x)).
* 新增 `check_referential_table_dependencies` 设置，在 `DROP TABLE` 时检查引用依赖关系。此 PR 解决 [#38326](https://github.com/ClickHouse/ClickHouse/issues/38326)。 [#45936](https://github.com/ClickHouse/ClickHouse/pull/45936) ([Vitaly Baranov](https://github.com/vitlibar)).
* 修复 `tupleElement`，使其在参数为 `Null` 时返回 `Null`。关闭 [#45894](https://github.com/ClickHouse/ClickHouse/issues/45894)。 [#45952](https://github.com/ClickHouse/ClickHouse/pull/45952) ([flynn](https://github.com/ucasfl)).
* 没有文件匹配 S3 通配符时抛出错误。关闭 [#45587](https://github.com/ClickHouse/ClickHouse/issues/45587)。 [#45957](https://github.com/ClickHouse/ClickHouse/pull/45957) ([chen](https://github.com/xiedeyantu)).
* 使用集群状态数据检查并发备份/恢复。 [#45982](https://github.com/ClickHouse/ClickHouse/pull/45982) ([SmitaRKulkarni](https://github.com/SmitaRKulkarni)).
* ClickHouse Client：模糊搜索使用 “exact” 匹配模式，该模式能正确忽略大小写，匹配 SQL 查询的算法也更合适。 [#46000](https://github.com/ClickHouse/ClickHouse/pull/46000) ([Azat Khuzhin](https://github.com/azat)).
* 禁止错误的视图创建语法 `CREATE View X TO Y AS SELECT`。关闭 [#4331](https://github.com/ClickHouse/ClickHouse/issues/4331)。 [#46043](https://github.com/ClickHouse/ClickHouse/pull/46043) ([flynn](https://github.com/ucasfl)).
* `Log` 系列存储引擎支持设置 `storage_policy`。关闭 [#43421](https://github.com/ClickHouse/ClickHouse/issues/43421)。 [#46044](https://github.com/ClickHouse/ClickHouse/pull/46044) ([flynn](https://github.com/ucasfl)).
* 改进结果为空时的 `JSONColumns` 格式。关闭 [#46024](https://github.com/ClickHouse/ClickHouse/issues/46024)。 [#46053](https://github.com/ClickHouse/ClickHouse/pull/46053) ([flynn](https://github.com/ucasfl)).
* 新增 SipHash128 的参考实现。 [#46065](https://github.com/ClickHouse/ClickHouse/pull/46065) ([Salvatore Mesoraca](https://github.com/aiven-sal)).
* 新增指标，记录使用 mmap 分配的次数和字节数。 [#46068](https://github.com/ClickHouse/ClickHouse/pull/46068) ([李扬](https://github.com/taiyang-li)).
* 目前 `leftPad`、`rightPad`、`leftPadUTF8`、`rightPadUTF8` 等函数的第二个参数 `length` 必须为 UInt8|16|32|64|128|256。这一要求对 ClickHouse 用户过于严格，也与 `arrayResize`、`substring` 等类似函数不一致。 [#46103](https://github.com/ClickHouse/ClickHouse/pull/46103) ([李扬](https://github.com/taiyang-li)).
* 修复调试构建中 `welchTTest` 函数在统计结果为 NaN 时触发的断言，使其行为与其他类似函数一致。将 `studentTTest` 改为返回 NaN 而非抛出异常，因为此前的行为不便使用。关闭 [#41176](https://github.com/ClickHouse/ClickHouse/issues/41176)，关闭 [#42162](https://github.com/ClickHouse/ClickHouse/issues/42162)。 [#46141](https://github.com/ClickHouse/ClickHouse/pull/46141) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 让大整数与 ORDER BY WITH FILL 的使用更方便：按大整数（128 位和 256 位）排序时，允许在 WITH FILL 中使用普通整数作为起止点。修复起止点为负数时大整数结果错误的问题。关闭 [#16733](https://github.com/ClickHouse/ClickHouse/issues/16733)。 [#46152](https://github.com/ClickHouse/ClickHouse/pull/46152) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 针对该[问题](https://github.com/ClickHouse/ClickHouse/issues/44336)，向 `system.tables` 新增 `parts`、`active_parts` 和 `total_marks` 列。 [#46161](https://github.com/ClickHouse/ClickHouse/pull/46161) ([attack204](https://github.com/attack204)).
* 函数 “multi\[Fuzzy]Match(Any|AnyIndex|AllIndices}” 现在会拒绝可能在 vectorscan 中执行极慢的正则表达式。 [#46167](https://github.com/ClickHouse/ClickHouse/pull/46167) ([Robert Schulze](https://github.com/rschu1ze)).
* 启用 `insert_null_as_default` 且列未定义默认值时，使用列类型的默认值。此 PR 还修复了 LowCardinality 列在值为 null 时使用默认值的问题。 [#46171](https://github.com/ClickHouse/ClickHouse/pull/46171) ([Kruglov Pavel](https://github.com/Avogar)).
* S3 客户端优先使用显式指定的访问密钥。即使 `use_environment_credentials` 为 `true`，如果用户通过查询或配置提供了访问密钥，也将使用这些密钥，而不是环境变量中的密钥。 [#46191](https://github.com/ClickHouse/ClickHouse/pull/46191) ([Antonio Andelic](https://github.com/antonio2368)).
* 为 “formatDateTime()” 函数新增别名 “DATE\_FORMAT()”，以改善对 MySQL SQL 方言的兼容性；为 `formatDateTime` 新增替换符 “a”、“b”、“c”、“h”、“i”、“k”、“l”、“r”、“s”、“W”。### 面向用户变更的文档条目 用户可读的简要说明：`DATE_FORMAT` 是 `formatDateTime` 的别名，根据给定格式字符串格式化时间。格式是常量表达式，因此同一个结果列不能使用多种格式。（提供 [formatDateTime](/docs/reference/functions/regular-functions/date-time-functions#formatDateTime) 链接）。 [#46302](https://github.com/ClickHouse/ClickHouse/pull/46302) ([Jake Bamrah](https://github.com/JakeBamrah)).
* 新增并行副本（`s3Cluster` 和 `MergeTree` 表）回调任务相关的 `ProfileEvents` 和 `CurrentMetrics`。 [#46313](https://github.com/ClickHouse/ClickHouse/pull/46313) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 为采用 `KeeperMap` 存储引擎的表新增 `DELETE` 和 `UPDATE` 支持。 [#46330](https://github.com/ClickHouse/ClickHouse/pull/46330) ([Antonio Andelic](https://github.com/antonio2368)).
* 允许在 RENAME 查询中使用查询参数。解决 [#45778](https://github.com/ClickHouse/ClickHouse/issues/45778)。 [#46407](https://github.com/ClickHouse/ClickHouse/pull/46407) ([Nikolay Degterinsky](https://github.com/evillique)).
* 修复带 REPLACE 转换器的参数化 SELECT 查询。解决 [#33002](https://github.com/ClickHouse/ClickHouse/issues/33002)。 [#46420](https://github.com/ClickHouse/ClickHouse/pull/46420) ([Nikolay Degterinsky](https://github.com/evillique)).
* 计算异步指标 “NumberOfDatabases” 时，排除用于临时表/外部表的内部数据库，使其行为与系统表 “system.databases” 一致。 [#46435](https://github.com/ClickHouse/ClickHouse/pull/46435) ([Robert Schulze](https://github.com/rschu1ze)).
* 为 distribution\_queue 表新增 `last_exception_time` 列。 [#46564](https://github.com/ClickHouse/ClickHouse/pull/46564) ([Aleksandr](https://github.com/AVMusorin)).
* 支持在参数化视图的 IN 子句中使用参数。 [#46583](https://github.com/ClickHouse/ClickHouse/pull/46583) ([SmitaRKulkarni](https://github.com/SmitaRKulkarni)).
* 服务器启动时不加载命名集合，改为首次访问时加载。 [#46607](https://github.com/ClickHouse/ClickHouse/pull/46607) ([Kseniia Sumarokova](https://github.com/kssenii)).

<h4 id="buildtestingpackaging-improvement-10">
  构建、测试与打包改进
</h4>

* 引入 LLVM 运行时实现的 GWP-ASan。关闭 [#27039](https://github.com/ClickHouse/ClickHouse/issues/27039)。 [#45226](https://github.com/ClickHouse/ClickHouse/pull/45226) ([Han Fei](https://github.com/hanfei1991)).
* 我们希望测试更不稳定、更容易偶发失败：在测试中为 MergeTree 设置加入随机化。 [#38983](https://github.com/ClickHouse/ClickHouse/pull/38983) ([Anton Popov](https://github.com/CurtizJ)).
* 在 PowerPC 上启用 HDFS 支持，有助于修复以下功能测试：02113\_hdfs\_assert.sh、02244\_hdfs\_cluster.sql 和 02368\_cancel\_write\_into\_hdfs.sh。 [#44949](https://github.com/ClickHouse/ClickHouse/pull/44949) ([MeenaRenganathan22](https://github.com/MeenaRenganathan22)).
* 为 clickhouse-keeper 添加 systemd.service 文件。修复 [#44293](https://github.com/ClickHouse/ClickHouse/issues/44293)。 [#45568](https://github.com/ClickHouse/ClickHouse/pull/45568) ([Mikhail f. Shiryaev](https://github.com/Felixoid)).
* 将 ClickHouse 的 poco 分支从 “contrib/” 移至 “base/poco/”。 [#46075](https://github.com/ClickHouse/ClickHouse/pull/46075) ([Robert Schulze](https://github.com/rschu1ze)).
* 为 `clickhouse-watchdog` 添加重启子进程的选项。此功能用处不大。 [#46312](https://github.com/ClickHouse/ClickHouse/pull/46312) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 如果将环境变量 `CLICKHOUSE_DOCKER_RESTART_ON_EXIT` 设为 1，Docker 容器将把 `clickhouse-server` 作为子进程而非首进程运行，并在其退出时重启。 [#46391](https://github.com/ClickHouse/ClickHouse/pull/46391) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复 Systemd 服务文件。 [#46461](https://github.com/ClickHouse/ClickHouse/pull/46461) ([SuperDJY](https://github.com/cmsxbc)).
* 将构建 ClickHouse 所需的最低 Clang 版本从 12 提高到 15。 [#46710](https://github.com/ClickHouse/ClickHouse/pull/46710) ([Robert Schulze](https://github.com/rschu1ze)).
* 将 Intel QPL 从 v0.3.0 升级到 v1.0.0。2. 构建 libaccel-config，并将其静态链接到 QPL 库，代替动态链接。 [#45809](https://github.com/ClickHouse/ClickHouse/pull/45809) ([jasperzhu](https://github.com/jinjunzh)).

<h4 id="bug-fix-user-visible-misbehavior-in-official-stable-release">
  缺陷修复（正式稳定版本中用户可见的异常行为）
</h4>

* 在 `StorageRabbitMQ` 中严格按照 `rabbitmq_flush_interval_ms` 或 `rabbitmq_max_block_size` 刷新数据。关闭 [#42389](https://github.com/ClickHouse/ClickHouse/issues/42389)，关闭 [#45160](https://github.com/ClickHouse/ClickHouse/issues/45160)。 [#44404](https://github.com/ClickHouse/ClickHouse/pull/44404) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 在 sparkBar 函数中使用 PODArray 渲染，以便控制内存使用。关闭 [#44467](https://github.com/ClickHouse/ClickHouse/issues/44467)。 [#44489](https://github.com/ClickHouse/ClickHouse/pull/44489) ([Duc Canh Le](https://github.com/canhld94)).
* 修复函数 quantilesExactExclusive、quantilesExactInclusive 返回未排序数组元素的问题。 [#45379](https://github.com/ClickHouse/ClickHouse/pull/45379) ([wujunfu](https://github.com/wujunfu)).
* 修复启用 OpenTelemetry 时 HTTPHandler 中未捕获的异常。 [#45456](https://github.com/ClickHouse/ClickHouse/pull/45456) ([Frank Chen](https://github.com/FrankChen021)).
* 不再从 8 位数字推断日期，否则可能读取错误数据。 [#45581](https://github.com/ClickHouse/ClickHouse/pull/45581) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复 `odbc_bridge_use_connection_pooling` 设置的使用，使其正确生效。 [#45591](https://github.com/ClickHouse/ClickHouse/pull/45591) ([Bharat Nallan](https://github.com/bharatnc)).
* 调用缓存中的回调时，缓存可能已被销毁。为保证安全，改为按值捕获成员。这对任务调度也是安全的，因为存储对象销毁前会停用任务。解决 [#45548](https://github.com/ClickHouse/ClickHouse/issues/45548)。 [#45601](https://github.com/ClickHouse/ClickHouse/pull/45601) ([Han Fei](https://github.com/hanfei1991)).
* 修复 Delta 或 DoubleDelta 与 Gorilla 编解码器组合使用时的数据损坏问题。 [#45615](https://github.com/ClickHouse/ClickHouse/pull/45615) ([Robert Schulze](https://github.com/rschu1ze)).
* 使用 N-gram 布隆过滤器索引时正确检查类型，以避免无效读取。 [#45617](https://github.com/ClickHouse/ClickHouse/pull/45617) ([Antonio Andelic](https://github.com/antonio2368)).
* 收到若干 `c-ares` 相关段错误报告，这些问题由我此前的 PR 引入。我已在 Alexander Tokmakov 的帮助下修复。 [#45629](https://github.com/ClickHouse/ClickHouse/pull/45629) ([Arthur Passos](https://github.com/arthurpassos)).
* 修复遇到重复主键时的键描述问题，此情况可能发生于投影中。详见 [#45590](https://github.com/ClickHouse/ClickHouse/issues/45590)。 [#45686](https://github.com/ClickHouse/ClickHouse/pull/45686) ([Amos Bird](https://github.com/amosbird)).
* 为备份设置压缩方法和级别。关闭 [#45690](https://github.com/ClickHouse/ClickHouse/issues/45690)。 [#45737](https://github.com/ClickHouse/ClickHouse/pull/45737) ([Pradeep Chhetri](https://github.com/chhetripradeep)).
* 应使用 `select_query_typed.limitByOffset` 而非 `select_query_typed.limitOffset`。 [#45817](https://github.com/ClickHouse/ClickHouse/pull/45817) ([刘陶峰](https://github.com/taofengliu)).
* 使用实验性分析器时，`SELECT number FROM numbers(100) LIMIT 10 OFFSET 10;` 这样的查询会得到错误结果（此 SQL 返回空结果），原因是规划器添加了不必要的偏移步骤。 [#45822](https://github.com/ClickHouse/ClickHouse/pull/45822) ([刘陶峰](https://github.com/taofengliu)).
* 向后兼容：允许 UInt64 到 IPv4 的隐式窄化转换，这是 “INSERT ... VALUES ...” 表达式所需的行为。 [#45865](https://github.com/ClickHouse/ClickHouse/pull/45865) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* 修复 IPv6 解析器处理缺少首个八位组的混合 IPv4 地址（如 `::.1.2.3`）时的问题。 [#45871](https://github.com/ClickHouse/ClickHouse/pull/45871) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* 为 `system.processes` 表和 `SHOW PROCESSLIST` 查询新增 `query_kind` 列，并移除重复代码。修复包含 `INTERSECT` 或 `EXCEPT` 链的查询不遵循全局配置参数 `max_concurrent_select_queries` 的问题。 [#45872](https://github.com/ClickHouse/ClickHouse/pull/45872) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复 `stochasticLinearRegression` 函数中的崩溃，由 WingFuzz 发现。 [#45985](https://github.com/ClickHouse/ClickHouse/pull/45985) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复带 `INTERSECT` 和 `EXCEPT` 修饰符的 `SELECT` 查询从启用稀疏列的表读取数据时发生的崩溃（由 `ratio_of_defaults_for_sparse_serialization` 设置控制）。 [#45987](https://github.com/ClickHouse/ClickHouse/pull/45987) ([Anton Popov](https://github.com/CurtizJ)).
* 修复 DESC 排序与 FINAL 一起使用时的顺序读取优化，关闭 [#45815](https://github.com/ClickHouse/ClickHouse/issues/45815)。 [#46009](https://github.com/ClickHouse/ClickHouse/pull/46009) ([Vladimir C](https://github.com/vdimir)).
* 修复从 Compact 数据片段读取不存在的多层嵌套列时的问题。 [#46045](https://github.com/ClickHouse/ClickHouse/pull/46045) ([Azat Khuzhin](https://github.com/azat)).
* 修复 system.processes 中的 elapsed 列（存在 10 倍误差）。 [#46047](https://github.com/ClickHouse/ClickHouse/pull/46047) ([Azat Khuzhin](https://github.com/azat)).
* 针对将域类型 IP（IPv4、IPv6）替换为原生类型 [https://github.com/ClickHouse/ClickHouse/pull/43221](https://github.com/ClickHouse/ClickHouse/pull/43221) 的后续修复。 [#46087](https://github.com/ClickHouse/ClickHouse/pull/46087) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* 修复参数已有值时配置中的环境变量替换。关闭 [#46131](https://github.com/ClickHouse/ClickHouse/issues/46131)，关闭 [#9547](https://github.com/ClickHouse/ClickHouse/issues/9547)。 [#46144](https://github.com/ClickHouse/ClickHouse/pull/46144) ([pufit](https://github.com/pufit)).
* 修复分组集中的错误谓词下推。关闭 [#45947](https://github.com/ClickHouse/ClickHouse/issues/45947)。 [#46151](https://github.com/ClickHouse/ClickHouse/pull/46151) ([flynn](https://github.com/ucasfl)).
* 修复 `fulls_sorting_join` 使用常量键时流水线可能卡住的问题。 [#46175](https://github.com/ClickHouse/ClickHouse/pull/46175) ([Vladimir C](https://github.com/vdimir)).
* 格式化期间绝不将 tuple 函数重写为字面量，以避免错误结果。 [#46232](https://github.com/ClickHouse/ClickHouse/pull/46232) ([Salvatore Mesoraca](https://github.com/aiven-sal)).
* 修复以 Arrow 格式读取 LowCardinality(Nullable) 时可能发生的越界错误。 [#46270](https://github.com/ClickHouse/ClickHouse/pull/46270) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复 `SYSTEM UNFREEZE` 查询因 `CANNOT_PARSE_INPUT_ASSERTION_FAILED` 异常而失败的问题。 [#46325](https://github.com/ClickHouse/ClickHouse/pull/46325) ([Aleksei Filatov](https://github.com/aalexfvk)).
* 修复反序列化保存 HashTable 的函数的聚合状态时，整数溢出可能导致的崩溃。 [#46349](https://github.com/ClickHouse/ClickHouse/pull/46349) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复异步插入以 `VALUES` 格式发送无效数据时可能出现的 `LOGICAL_ERROR`。 [#46350](https://github.com/ClickHouse/ClickHouse/pull/46350) ([Anton Popov](https://github.com/CurtizJ)).
* 修复尝试执行 `ALTER ... MOVE PART ... TO TABLE` 时出现的 LOGICAL\_ERROR；实际上从未支持过这类查询。 [#46359](https://github.com/ClickHouse/ClickHouse/pull/46359) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 修复启用 `parallel_distributed_insert_select` 时，并行分布式插入选择中的 s3Cluster 结构推断。 [#46381](https://github.com/ClickHouse/ClickHouse/pull/46381) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复 `ALTER TABLE ... UPDATE nested.arr1 = nested.arr2 ...` 这样的查询，其中 `arr1` 和 `arr2` 是同一 `Nested` 列中的字段。 [#46387](https://github.com/ClickHouse/ClickHouse/pull/46387) ([Anton Popov](https://github.com/CurtizJ)).
* 调度器可能无法调度任务。如果发生这种情况，应中止整个 MulityPartUpload，且 `UploadHelper` 必须等待已调度的任务。 [#46451](https://github.com/ClickHouse/ClickHouse/pull/46451) ([Dmitry Novik](https://github.com/novikd)).
* 修复 Merge 中默认类型不同情况下的 PREWHERE（修复列默认类型不同时出现的部分 `NOT_FOUND_COLUMN_IN_BLOCK` 错误；当各表中列类型相同时也允许 `PREWHERE`，仅在类型不同时禁止）。 [#46454](https://github.com/ClickHouse/ClickHouse/pull/46454) ([Azat Khuzhin](https://github.com/azat)).
* 修复在 `ORDER BY` 中使用常量值时可能发生的崩溃。修复 [#46466](https://github.com/ClickHouse/ClickHouse/issues/46466)。 [#46493](https://github.com/ClickHouse/ClickHouse/pull/46493) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 如果查询级指定了 `disk` 设置，而配置的 MergeTree 设置节中指定了 `storage_policy`，不再抛出异常；`disk` 将覆盖配置中的设置。 [#46533](https://github.com/ClickHouse/ClickHouse/pull/46533) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复 `arrayMap` 函数对常量 `LowCardinality` 参数的错误处理。此问题可能导致发行构建发生段错误，调试构建出现逻辑错误 `Bad cast`。 [#46569](https://github.com/ClickHouse/ClickHouse/pull/46569) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复 [#46557](https://github.com/ClickHouse/ClickHouse/issues/46557)。 [#46611](https://github.com/ClickHouse/ClickHouse/pull/46611) ([Alexander Gololobov](https://github.com/davenger)).
* 修复服务器无法在 1 分 30 秒内启动时 clickhouse-server systemd 单元不断重启的问题（禁用从 systemd 服务启动 clickhouse-server 时的超时逻辑）。 [#46613](https://github.com/ClickHouse/ClickHouse/pull/46613) ([Azat Khuzhin](https://github.com/azat)).
* 异步插入时分配的内存缓冲区在全局上下文中释放，未正确更新相应用户和查询的 MemoryTracker 计数器，导致误报 OOM 异常。 [#46622](https://github.com/ClickHouse/ClickHouse/pull/46622) ([Dmitry Novik](https://github.com/novikd)).
* 不再清除 table\_join 中的 on\_expression，因为后续分析过程还会使用它。解决 [#45185](https://github.com/ClickHouse/ClickHouse/issues/45185)。 [#46487](https://github.com/ClickHouse/ClickHouse/pull/46487) ([SmitaRKulkarni](https://github.com/SmitaRKulkarni)).
