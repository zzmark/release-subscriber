<h3 id="a-id226a-clickhouse-release-226-2022-06-16">
  <a id="226" /> ClickHouse 22.6 版本, 2022-06-16. [演示文稿](https://presentations.clickhouse.com/2022-release-22.6/), [视频](https://www.youtube.com/watch?v=0fSp9SF8N8A)
</h3>

<Frame>
  <iframe src="https://www.youtube.com/embed/0fSp9SF8N8A" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
</Frame>

<h4 id="backward-incompatible-change-4">
  向后不兼容变更
</h4>

* 移除 SQL 中对八进制数字字面量的支持。此前版本会将它们解析为 Float64。[#37765](https://github.com/ClickHouse/ClickHouse/pull/37765)（[Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)）。
* 更改以 `seconds` 为类型的设置的解析方式，以支持浮点数值（例如：`max_execution_time=0.5`）。Infinity 或 NaN 值会抛出异常。[#37187](https://github.com/ClickHouse/ClickHouse/pull/37187)（[Raúl Marín](https://github.com/Algunenano)）。
* 更改实验性 `Object` 类型列的二进制序列化格式。新格式更便于第三方客户端实现。[#37482](https://github.com/ClickHouse/ClickHouse/pull/37482)（[Anton Popov](https://github.com/CurtizJ)）。
* 默认启用 `output_format_json_named_tuples_as_objects` 设置，允许在 JSON 格式中将具名元组序列化为 JSON 对象。[#37756](https://github.com/ClickHouse/ClickHouse/pull/37756)（[Anton Popov](https://github.com/CurtizJ)）。
* 现在禁止使用以转义字符（'\\'）结尾的 LIKE 模式（这是 SQL 标准的要求）。[#37764](https://github.com/ClickHouse/ClickHouse/pull/37764)（[Robert Schulze](https://github.com/rschu1ze)）。
* 如果在 AArch64 CPU 集群中运行不同版本的 ClickHouse，或在同一集群混用 AArch64 与 amd64，并执行按多个固定长度类型键分组的分布式 GROUP BY 查询，且这些键合计可容纳在 256 位内但无法容纳在 64 位内，同时结果规模很大，那么升级期间这些查询的结果将无法完全聚合。应对方法：停机升级，避免滚动升级。

<h4 id="new-feature-6">
  新功能
</h4>

* 新增 `GROUPING` 函数，允许区分使用 `ROLLUP`、`CUBE` 或 `GROUPING SETS` 的查询中的记录。关闭 [#19426](https://github.com/ClickHouse/ClickHouse/issues/19426)。[#37163](https://github.com/ClickHouse/ClickHouse/pull/37163)（[Dmitry Novik](https://github.com/novikd)）。
* 新增采用 [FPC](https://userweb.cs.txstate.edu/~burtscher/papers/dcc07a.pdf) 算法的浮点数据压缩编解码器。[#37553](https://github.com/ClickHouse/ClickHouse/pull/37553)（[Mikhail Guzov](https://github.com/koloshmet)）。
* 新增列式 JSON 格式：`JSONColumns`、`JSONCompactColumns`、`JSONColumnsWithMetadata`。关闭 [#36338](https://github.com/ClickHouse/ClickHouse/issues/36338)。关闭 [#34509](https://github.com/ClickHouse/ClickHouse/issues/34509)。[#36975](https://github.com/ClickHouse/ClickHouse/pull/36975)（[Kruglov Pavel](https://github.com/Avogar)）。
* 新增基于 d3js 的 OpenTelemetry 跟踪可视化工具。[#37810](https://github.com/ClickHouse/ClickHouse/pull/37810)（[Sergei Trifonov](https://github.com/serxa)）。
* 支持向 `system.zookeeper` 表执行 INSERT。关闭 [#22130](https://github.com/ClickHouse/ClickHouse/issues/22130)。[#37596](https://github.com/ClickHouse/ClickHouse/pull/37596)（[Han Fei](https://github.com/hanfei1991)）。
* `LIKE`、`ILIKE` 和 `match` 函数支持非常量的模式参数。[#37251](https://github.com/ClickHouse/ClickHouse/pull/37251)（[Robert Schulze](https://github.com/rschu1ze)）。
* 可执行用户定义函数现在支持参数化配置。例如：`SELECT test_function(parameters)(arguments)`。关闭 [#37578](https://github.com/ClickHouse/ClickHouse/issues/37578)。[#37720](https://github.com/ClickHouse/ClickHouse/pull/37720)（[Maksim Kita](https://github.com/kitaisreal)）。
* 为 system.part\_log 表新增 `merge_reason` 列。[#36912](https://github.com/ClickHouse/ClickHouse/pull/36912)（[Sema Checherinda](https://github.com/CheSema)）。
* 在 Avro 格式中支持 Map 和 Record。新增 `input_format_avro_null_as_default ` 设置，允许在 Avro 格式中将 null 作为默认值插入。关闭 [#18925](https://github.com/ClickHouse/ClickHouse/issues/18925)。关闭 [#37378](https://github.com/ClickHouse/ClickHouse/issues/37378)。关闭 [#32899](https://github.com/ClickHouse/ClickHouse/issues/32899)。[#37525](https://github.com/ClickHouse/ClickHouse/pull/37525)（[Kruglov Pavel](https://github.com/Avogar)）。
* 新增 `clickhouse-disks` 工具，用于检查和操作 ClickHouse 配置的虚拟文件系统。[#36060](https://github.com/ClickHouse/ClickHouse/pull/36060)（[Artyom Yurkov](https://github.com/Varinara)）。
* 新增 H3 单向边函数。[#36843](https://github.com/ClickHouse/ClickHouse/pull/36843)（[Bharat Nallan](https://github.com/bharatnc)）。
* 支持从无符号整数计算 [hashids](https://hashids.org/)。[#37013](https://github.com/ClickHouse/ClickHouse/pull/37013)（[Michael Nutt](https://github.com/mnutt)）。
* 允许在 `CREATE USER <user> IDENTIFIED WITH sha256_hash` 中显式指定 `SALT`。[#37377](https://github.com/ClickHouse/ClickHouse/pull/37377)（[Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)）。
* 新增 `input_format_csv_skip_first_lines/input_format_tsv_skip_first_lines` 两项设置，允许跳过 CSV/TSV 文件开头指定数量的行。[#37537](https://github.com/ClickHouse/ClickHouse/pull/37537)（[Kruglov Pavel](https://github.com/Avogar)）。
* `showCertificate` 函数显示当前服务器的 SSL 证书。[#37540](https://github.com/ClickHouse/ClickHouse/pull/37540)（[Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)）。
* 支持在具名集合中配置数据字典的 HTTP 数据源。[#37581](https://github.com/ClickHouse/ClickHouse/pull/37581)（[Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)）。
* 新增窗口函数 `nonNegativeDerivative(metric_column, timestamp_column[, INTERVAL x SECOND])`。[#37628](https://github.com/ClickHouse/ClickHouse/pull/37628)（[Andrey Zvonov](https://github.com/zvonand)）。
* 实现修改 `ReplicatedMergeTree` 表的注释。[#37416](https://github.com/ClickHouse/ClickHouse/pull/37416)（[Vasily Nemkov](https://github.com/Enmk)）。
* 新增 `SYSTEM UNFREEZE` 查询，无论对应表是否已删除，都能删除整个备份。[#36424](https://github.com/ClickHouse/ClickHouse/pull/36424)（[Vadim Volodin](https://github.com/PolyProgrammist)）。

<h4 id="experimental-feature-5">
  实验性功能
</h4>

* 为 `WINDOW VIEW` 启用 `POPULATE`。[#36945](https://github.com/ClickHouse/ClickHouse/pull/36945)（[vxider](https://github.com/Vxider)）。
* 为 `WINDOW VIEW` 支持 `ALTER TABLE ... MODIFY QUERY`。[#37188](https://github.com/ClickHouse/ClickHouse/pull/37188)（[vxider](https://github.com/Vxider)）。
* 此 PR 更改 `WINDOW VIEW` 中 `ENGINE` 语法的行为，使其与 `MATERIALIZED VIEW` 一致。[#37214](https://github.com/ClickHouse/ClickHouse/pull/37214)（[vxider](https://github.com/Vxider)）。

<h4 id="performance-improvement-6">
  性能改进
</h4>

* 新增大量 ARM NEON 优化 [#38093](https://github.com/ClickHouse/ClickHouse/pull/38093)（[Daniel Kutenin](https://github.com/danlark1)）、（[Alexandra Pilipyuk](https://github.com/chalice19)）。注意：如果在 ARM CPU 集群中运行不同版本的 ClickHouse，并执行按多个固定长度类型键分组的分布式 GROUP BY 查询，且这些键合计可容纳在 256 位内但无法容纳在 64 位内，那么升级期间聚合查询的结果会不正确。应对方法：停机升级，避免滚动升级。
* 对于 Native、Protobuf、CapnProto、JSONEachRow、TSKV 及所有后缀为 WithNames/WithNamesAndTypes 的格式，提升仅选取部分列时的性能并降低内存使用。此前，从这些格式的文件中选取部分列时，会读取所有列并存入内存。现在仅读取所需列。此 PR 默认启用 `input_format_skip_unknown_fields` 设置，否则在选取部分列时会抛出异常。[#37192](https://github.com/ClickHouse/ClickHouse/pull/37192)（[Kruglov Pavel](https://github.com/Avogar)）。
* 现在可以为连接下推更多筛选条件。[#37472](https://github.com/ClickHouse/ClickHouse/pull/37472)（[Amos Bird](https://github.com/amosbird)）。
* 读取宽数据片段时，仅加载必要列的标记。[#36879](https://github.com/ClickHouse/ClickHouse/pull/36879)（[Anton Kozlov](https://github.com/tonickkozlov)）。
* 将稀疏列作为聚合函数参数时，提升聚合性能（可通过 `MergeTree` 表的实验性设置 `ratio_of_defaults_for_sparse_serialization` 启用稀疏列）。[#37617](https://github.com/ClickHouse/ClickHouse/pull/37617)（[Anton Popov](https://github.com/CurtizJ)）。
* 优化只有两个参数的 `COALESCE` 函数。[#37666](https://github.com/ClickHouse/ClickHouse/pull/37666)（[Anton Popov](https://github.com/CurtizJ)）。
* 当 `multiIf` 只有一个条件时，将 `multiIf` 替换为 `if`，因为 `if` 函数性能更好。[#37695](https://github.com/ClickHouse/ClickHouse/pull/37695)（[Anton Popov](https://github.com/CurtizJ)）。
* 提升 `dictGetDescendants`、`dictGetChildren` 函数性能：按查询创建临时的父节点到子节点层级索引，而不是在查询中每次函数调用时创建。允许为 `HIERARHICAL` 属性指定 `BIDIRECTIONAL`，让字典在内存中维护父节点到子节点的索引，这样 `dictGetDescendants`、`dictGetChildren` 就无需为每个查询创建临时索引。关闭 [#32481](https://github.com/ClickHouse/ClickHouse/issues/32481)。[#37148](https://github.com/ClickHouse/ClickHouse/pull/37148)（[Maksim Kita](https://github.com/kitaisreal)）。
* 现在可以将聚合状态的销毁任务提交给线程池。对于带 LIMIT 且状态较大的查询，这能显著提速，例如 `select uniq(number) from numbers_mt(1e7) group by number limit 100` 的速度提高至约 2.5 倍。[#37855](https://github.com/ClickHouse/ClickHouse/pull/37855)（[Nikita Taranov](https://github.com/nickitat)）。
* 提升单列排序性能。[#37195](https://github.com/ClickHouse/ClickHouse/pull/37195)（[Maksim Kita](https://github.com/kitaisreal)）。
* 使用排序队列特化提升单列排序性能。[#37990](https://github.com/ClickHouse/ClickHouse/pull/37990)（[Maksim Kita](https://github.com/kitaisreal)）。
* 数组范数和距离函数的性能提升至原来的 2–4 倍。[#37394](https://github.com/ClickHouse/ClickHouse/pull/37394)（[Alexander Gololobov](https://github.com/davenger)）。
* 通过动态分派提升数字比较函数的性能。[#37399](https://github.com/ClickHouse/ClickHouse/pull/37399)（[Maksim Kita](https://github.com/kitaisreal)）。
* 提升带 LIMIT 的 ORDER BY 性能。[#37481](https://github.com/ClickHouse/ClickHouse/pull/37481)（[Maksim Kita](https://github.com/kitaisreal)）。
* 使用动态分派基础设施提升 `hasAll` 函数性能。[#37484](https://github.com/ClickHouse/ClickHouse/pull/37484)（[Maksim Kita](https://github.com/kitaisreal)）。
* 提升 `greatCircleAngle`、`greatCircleDistance`、`geoDistance` 函数性能。[#37524](https://github.com/ClickHouse/ClickHouse/pull/37524)（[Maksim Kita](https://github.com/kitaisreal)）。
* 当 ORDER BY 包含多列时，提升向 MergeTree 插入数据的性能。[#35762](https://github.com/ClickHouse/ClickHouse/pull/35762)（[Maksim Kita](https://github.com/kitaisreal)）。
* 修复表数量较多时后台 CPU 使用率过高的问题。[#38028](https://github.com/ClickHouse/ClickHouse/pull/38028)（[Maksim Kita](https://github.com/kitaisreal)）。
* 通过动态分派提升 `not` 函数性能。[#38058](https://github.com/ClickHouse/ClickHouse/pull/38058)（[Maksim Kita](https://github.com/kitaisreal)）。
* 优化 re2 模式的内部缓存，这些模式会用于 LIKE 和 MATCH 等函数。[#37544](https://github.com/ClickHouse/ClickHouse/pull/37544)（[Robert Schulze](https://github.com/rschu1ze)）。
* 使用 AVX-512 指令整体优化筛选位掩码生成函数。[#37588](https://github.com/ClickHouse/ClickHouse/pull/37588)（[yaqi-zhao](https://github.com/yaqi-zhao)）。
* 为 Hive 集成引擎使用 `threadpool` 读取方法，可显著加快读取。[#36328](https://github.com/ClickHouse/ClickHouse/pull/36328)（[李扬](https://github.com/taiyang-li)）。
* 当待读取的所有列都是分区键时，按文件行数构造列，无需实际读取 Hive 文件。[#37103](https://github.com/ClickHouse/ClickHouse/pull/37103)（[lgbo](https://github.com/lgbo-ustc)）。
* 支持使用多个磁盘缓存 Hive 文件。[#37279](https://github.com/ClickHouse/ClickHouse/pull/37279)（[lgbo](https://github.com/lgbo-ustc)）。
* 限制每个查询的最大缓存使用量，可以有效防止缓存池污染。[相关问题](https://github.com/ClickHouse/ClickHouse/issues/28961)。[#37859](https://github.com/ClickHouse/ClickHouse/pull/37859)（[Han Shukai](https://github.com/KinderRiven)）。
* 目前 ClickHouse 会直接将所有远程文件下载到本地缓存（即使只读取一次），这会频繁触发本地硬盘 I/O。在某些场景中，这些 I/O 并非必要，还容易导致优化适得其反。如下图所示，运行 SSB Q1–Q4 时，缓存反而造成性能下降。[#37516](https://github.com/ClickHouse/ClickHouse/pull/37516)（[Han Shukai](https://github.com/KinderRiven)）。
* 从 S3 读取时，允许通过 `_file`、`_path` 等虚拟列裁剪文件列表。对应 [#37174](https://github.com/ClickHouse/ClickHouse/issues/37174)、[#23494](https://github.com/ClickHouse/ClickHouse/issues/23494)。[#37356](https://github.com/ClickHouse/ClickHouse/pull/37356)（[Amos Bird](https://github.com/amosbird)）。
* 函数 CompressedWriteBuffer::nextImpl() 中存在一个不必要的写入复制步骤，在插入数据时会频繁发生。此补丁前后的区别如下：- 此前：1. 将 “working\_buffer” 压缩到 “compressed\_buffer”；2. 写入复制到 “out”。- 此后：直接将 “working\_buffer” 压缩到 “out”。[#37242](https://github.com/ClickHouse/ClickHouse/pull/37242)（[jasperzhu](https://github.com/jinjunzh)）。

<h4 id="improvement-6">
  改进
</h4>

* ROLLUP、CUBE、GROUPING SETS 支持具有非标准默认值的类型。关闭 [#37360](https://github.com/ClickHouse/ClickHouse/issues/37360)。[#37667](https://github.com/ClickHouse/ClickHouse/pull/37667)（[Dmitry Novik](https://github.com/novikd)）。
* 修复 ARM 上的堆栈跟踪收集。关闭 [#37044](https://github.com/ClickHouse/ClickHouse/issues/37044)。关闭 [#15638](https://github.com/ClickHouse/ClickHouse/issues/15638)。[#37797](https://github.com/ClickHouse/ClickHouse/pull/37797)（[Maksim Kita](https://github.com/kitaisreal)）。
* 客户端将逐一尝试 DNS 解析返回的所有 IP 地址，直到成功连接。[#37273](https://github.com/ClickHouse/ClickHouse/pull/37273)（[Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)）。
* 允许在 Arrow/Parquet/ORC 格式中使用 String 类型替代 Binary。此 PR 为此引入 3 项新设置：`output_format_arrow_string_as_string`、`output_format_parquet_string_as_string`、`output_format_orc_string_as_string`。所有设置的默认值均为 `false`。[#37327](https://github.com/ClickHouse/ClickHouse/pull/37327)（[Kruglov Pavel](https://github.com/Avogar)）。
* 将 `input_format_max_rows_to_read_for_schema_inference` 设置应用于通配符匹配的所有文件读取的总行数。此前，`input_format_max_rows_to_read_for_schema_inference` 分别应用于每个文件；当 null 值很多时，可能读取每个文件的前 `input_format_max_rows_to_read_for_schema_inference` 行，却得不到结果。同时将此设置的默认值提高至 25000。[#37332](https://github.com/ClickHouse/ClickHouse/pull/37332)（[Kruglov Pavel](https://github.com/Avogar)）。
* 新增独立的 `CLUSTER` 授权（以及 `access_control_improvements.on_cluster_queries_require_cluster_grant` 配置指令；为保持向后兼容，默认设为 `false`）。[#35767](https://github.com/ClickHouse/ClickHouse/pull/35767)（[Azat Khuzhin](https://github.com/azat)）。
* 为 `hdfsCluster` 新增结构推断支持。[#35812](https://github.com/ClickHouse/ClickHouse/pull/35812)（[Nikita Mikhaylov](https://github.com/nikitamikhaylov)）。
* 为存储卷内的磁盘（多磁盘配置）实现 `least_used` 负载均衡算法。[#36686](https://github.com/ClickHouse/ClickHouse/pull/36686)（[Azat Khuzhin](https://github.com/azat)）。
* 修改 HTTP 端点，使其在 `send_progress_in_http_headers=0` 时通过 `X-ClickHouse-Summary` 标头返回完整统计信息（此前全部为零）。- 修改 HTTP 端点，使其在已发送进度（`send_progress_in_http_headers=1`）后返回 `X-ClickHouse-Exception-Code` 标头。- 修改 HTTP 端点，使其在发生 `TIMEOUT_EXCEEDED` 错误时返回 `HTTP_REQUEST_TIMEOUT`（408），而不是 `HTTP_INTERNAL_SERVER_ERROR`（500）。[#36884](https://github.com/ClickHouse/ClickHouse/pull/36884)（[Raúl Marín](https://github.com/Algunenano)）。
* 允许用户查看已授予角色中的授权。[#36941](https://github.com/ClickHouse/ClickHouse/pull/36941)（[nvartolomei](https://github.com/nvartolomei)）。
* 不再通过数值方法计算积分，改用 CDF 函数，以加快执行并提高精度。修复 [#36714](https://github.com/ClickHouse/ClickHouse/issues/36714)。[#36953](https://github.com/ClickHouse/ClickHouse/pull/36953)（[Nikita Mikhaylov](https://github.com/nikitamikhaylov)）。
* 为函数添加 Nothing 的默认实现。现在，大多数函数在某个参数为 Nothing 时会返回 Nothing 类型列。这也解决了 arrayMap/arrayFilter 等函数以空数组作为参数的问题。此前，`select arrayMap(x -> 2 * x, []);` 这类查询会失败，因为 lambda 中的函数无法处理 `Nothing` 类型；现在会返回 `Array(Nothing)` 类型的空数组。此外，为 arrayFilter/arrayFill 等函数添加可空类型数组支持。此前，`select arrayFilter(x -> x % 2, [1, NULL])` 这类查询会失败，现在可以正常执行（如果 lambda 结果为 NULL，则该值不会包含在结果中）。关闭 [#37000](https://github.com/ClickHouse/ClickHouse/issues/37000)。[#37048](https://github.com/ClickHouse/ClickHouse/pull/37048)（[Kruglov Pavel](https://github.com/Avogar)）。
* 现在，如果分片包含本地副本，会创建一个本地计划以及一个从所有远程副本读取的计划。它们共享同一个发起端来协调读取。[#37204](https://github.com/ClickHouse/ClickHouse/pull/37204)（[Nikita Mikhaylov](https://github.com/nikitamikhaylov)）。
* 未显式设置 “mark\_cache\_size” 配置选项时，不再中止服务器启动。[#37326](https://github.com/ClickHouse/ClickHouse/pull/37326)（[Robert Schulze](https://github.com/rschu1ze)）。
* 允许在列声明中紧接类型指定 `NULL`/`NOT NULL`。[#37337](https://github.com/ClickHouse/ClickHouse/pull/37337)（[Igor Nikonov](https://github.com/devcrafter)）。
* 优化获取 PARTIALLY\_DOWNLOADED 文件段读取缓冲区的过程。[#37338](https://github.com/ClickHouse/ClickHouse/pull/37338)（[xiedeyantu](https://github.com/xiedeyantu)）。
* 尝试改进短路函数处理，以修复压力测试中的问题。[#37384](https://github.com/ClickHouse/ClickHouse/pull/37384)（[Kruglov Pavel](https://github.com/Avogar)）。
* 关闭 [#37395](https://github.com/ClickHouse/ClickHouse/issues/37395)。[#37415](https://github.com/ClickHouse/ClickHouse/pull/37415)（[Memo](https://github.com/Joeywzr)）。
* 修复零拷贝复制中获取数据片段时极少发生的死锁。修复 [#37423](https://github.com/ClickHouse/ClickHouse/issues/37423)。[#37424](https://github.com/ClickHouse/ClickHouse/pull/37424)（[metahys](https://github.com/metahys)）。
* 禁止创建使用未知数据格式的存储。[#37450](https://github.com/ClickHouse/ClickHouse/pull/37450)（[Kruglov Pavel](https://github.com/Avogar)）。
* 将 `global_memory_usage_overcommit_max_wait_microseconds` 的默认值设为 5 秒。在 OOM 异常消息中增加 `OvercommitTracker` 信息。新增 `MemoryOvercommitWaitTimeMicroseconds` 性能事件。[#37460](https://github.com/ClickHouse/ClickHouse/pull/37460)（[Dmitry Novik](https://github.com/novikd)）。
* clickhouse-client 不再显示 `-0.0` CPU 时间，此值可能因舍入误差出现。关闭 [#38003](https://github.com/ClickHouse/ClickHouse/issues/38003)。关闭 [#38038](https://github.com/ClickHouse/ClickHouse/issues/38038)。[#38064](https://github.com/ClickHouse/ClickHouse/pull/38064)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* Play UI：页面水平滚动时保持控件位置不变。这样，即使表很宽且已向右滚动很远，仍可方便地编辑。此功能由 CaspianDB 的 Maksym Tereshchenko 提议。[#37470](https://github.com/ClickHouse/ClickHouse/pull/37470)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修改 play.html 中的查询 div，使其高度可扩展到 20% 以上。对于很长的查询，扩大 textarea 元素很有帮助；但目前 div 高度固定，扩大后的 textarea 会遮住下方的数据 div。此修复使扩大或缩小 textarea 时会向下或向上推动数据 div，避免遮挡。同时，即使用户调整查询 textarea 的大小，也保持查询框宽度为 100%。[#37488](https://github.com/ClickHouse/ClickHouse/pull/37488)（[guyco87](https://github.com/guyco87)）。
* 新增 `ProfileEvents`，用于检查写入（插入或合并）的数据片段类型（`Inserted{Wide/Compact/InMemory}Parts`、`MergedInto{Wide/Compact/InMemory}Parts`）。为 `system.part_log` 新增 `part_type` 列。解决 [#37495](https://github.com/ClickHouse/ClickHouse/issues/37495)。[#37536](https://github.com/ClickHouse/ClickHouse/pull/37536)（[Anton Popov](https://github.com/CurtizJ)）。
* clickhouse-keeper 改进：将损坏的日志移入带时间戳的文件夹。[#37565](https://github.com/ClickHouse/ClickHouse/pull/37565)（[Antonio Andelic](https://github.com/antonio2368)）。
* 后续合并时不再写入因 TTL 过期的列（此前只有数据片段第一次合并或 optimize 时不写入这些列，后续操作仍会写入）。[#37570](https://github.com/ClickHouse/ClickHouse/pull/37570)（[Azat Khuzhin](https://github.com/azat)）。
* 存在 LowCardinality 或稀疏列时，`dumpColumnStructure` 辅助函数返回更准确的结果。此前版本会先将参数转换为完整列再返回结果。此改进用于回答 [#6935](https://github.com/ClickHouse/ClickHouse/issues/6935)。[#37633](https://github.com/ClickHouse/ClickHouse/pull/37633)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* clickhouse-keeper：仅为监听保存唯一的会话 ID。[#37641](https://github.com/ClickHouse/ClickHouse/pull/37641)（[Azat Khuzhin](https://github.com/azat)）。
* 修复可能出现的 “Cannot write to finalized buffer” 错误。[#37645](https://github.com/ClickHouse/ClickHouse/pull/37645)（[Azat Khuzhin](https://github.com/azat)）。
* 为 `DiskS3` 新增 `support_batch_delete` 设置，以禁用 Google Cloud Storage 不支持的多对象删除调用。[#37659](https://github.com/ClickHouse/ClickHouse/pull/37659)（[Fred Wulff](https://github.com/frew)）。
* 新增在 ODBC 桥接服务中禁用连接池的选项。[#37705](https://github.com/ClickHouse/ClickHouse/pull/37705)（[Anton Kozlov](https://github.com/tonickkozlov)）。
* 函数 `dictGetHierarchy`、`dictIsIn`、`dictGetChildren`、`dictGetDescendants` 新增对字典中可空 `HIERARCHICAL` 属性的支持。关闭 [#35521](https://github.com/ClickHouse/ClickHouse/issues/35521)。[#37805](https://github.com/ClickHouse/ClickHouse/pull/37805)（[Maksim Kita](https://github.com/kitaisreal)）。
* 在 `system.build_options` 表中公开 BoringSSL 版本相关信息。[#37850](https://github.com/ClickHouse/ClickHouse/pull/37850)（[Bharat Nallan](https://github.com/bharatnc)）。
* clickhouse-server 现在会在启动时删除 `delete_tmp` 目录。修复 [#26503](https://github.com/ClickHouse/ClickHouse/issues/26503)。[#37906](https://github.com/ClickHouse/ClickHouse/pull/37906)（[alesapin](https://github.com/alesapin)）。
* 超时后清理损坏且已分离的数据片段。关闭 [#25195](https://github.com/ClickHouse/ClickHouse/issues/25195)。[#37975](https://github.com/ClickHouse/ClickHouse/pull/37975)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* MergeTree 表引擎家族现在会立即删除移动失败的数据片段。[#37994](https://github.com/ClickHouse/ClickHouse/pull/37994)（[alesapin](https://github.com/alesapin)）。
* 为 ReplicatedMergeTree 启用 `always_fetch_merged_part` 设置后，合并会降低在其他副本上查找数据片段的频率，从而减轻 \[Zoo]Keeper 负载。[#37995](https://github.com/ClickHouse/ClickHouse/pull/37995)（[alesapin](https://github.com/alesapin)）。
* 隐式授权也附带转授权选项。例如，`GRANT CREATE TABLE ON test.* TO A WITH GRANT OPTION` 现在允许 `A` 执行 `GRANT CREATE VIEW ON test.* TO B`。[#38017](https://github.com/ClickHouse/ClickHouse/pull/38017)（[Vitaly Baranov](https://github.com/vitlibar)）。

<h4 id="buildtestingpackaging-improvement-6">
  构建/测试/打包改进
</h4>

* 使用 `clang-14` 和 LLVM 14 基础设施进行构建。关闭 [#34681](https://github.com/ClickHouse/ClickHouse/issues/34681)。[#34754](https://github.com/ClickHouse/ClickHouse/pull/34754)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。注意：`clang-14` 的 ThreadSanitizer 存在 [一个错误](https://github.com/google/sanitizers/issues/1540)，使我们的 CI 运行情况变差。
* 允许在启动时降低权限，从而简化 Docker 镜像。关闭 [#36293](https://github.com/ClickHouse/ClickHouse/issues/36293)。[#36341](https://github.com/ClickHouse/ClickHouse/pull/36341)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 为 CI 添加文档拼写检查。[#37790](https://github.com/ClickHouse/ClickHouse/pull/37790)（[Vladimir C](https://github.com/vdimir)）。
* 修复过度剥离符号导致用于校验可执行文件一致性的内嵌哈希被移除的问题。[#37993](https://github.com/ClickHouse/ClickHouse/pull/37993)（[Robert Schulze](https://github.com/rschu1ze)）。

<h4 id="bug-fix-2">
  错误修复
</h4>

* 修复使用常量字符串类型时的 `SELECT ... INTERSECT` 和 `EXCEPT SELECT` 语句。[#37738](https://github.com/ClickHouse/ClickHouse/pull/37738)（[Antonio Andelic](https://github.com/antonio2368)）。
* 修复对 `AggregateFunction` 执行 `GROUP BY`（即对 `AggregateFunction` 类型的列执行 `GROUP BY`）的问题。[#37093](https://github.com/ClickHouse/ClickHouse/pull/37093)（[Azat Khuzhin](https://github.com/azat)）。
* （实验性 WINDOW VIEW）修复 WindowView 中的 `addDependency`。可按 [#37237](https://github.com/ClickHouse/ClickHouse/issues/37237) 的方式复现此问题。[#37224](https://github.com/ClickHouse/ClickHouse/pull/37224)（[vxider](https://github.com/Vxider)）。
* 修复 ORDER BY ... WITH FILL 功能的不一致性。存在多个 WITH FILL 列时，包含 ORDER BY ... WITH FILL 的查询可能生成额外行。[#38074](https://github.com/ClickHouse/ClickHouse/pull/38074)（[Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)）。
* 此 PR 将 `addDependency` 从构造函数移至 `startup()`，避免向*已删除*的表添加依赖，修复 [#37237](https://github.com/ClickHouse/ClickHouse/issues/37237)。[#37243](https://github.com/ClickHouse/ClickHouse/pull/37243)（[vxider](https://github.com/Vxider)）。
* 修复列式格式对缺失值插入默认值的问题。此前，缺失列会用类型默认值填充，而不是列的默认值。[#37253](https://github.com/ClickHouse/ClickHouse/pull/37253)（[Kruglov Pavel](https://github.com/Avogar)）。
* （实验性 Object 类型）修复向 `Object` 类型列插入嵌套数组的部分场景。[#37305](https://github.com/ClickHouse/ClickHouse/pull/37305)（[Anton Popov](https://github.com/CurtizJ)）。
* 修复聚合函数、prewhere 和 join 中常量字符串冲突导致的意外错误。关闭 [#36891](https://github.com/ClickHouse/ClickHouse/issues/36891)。[#37336](https://github.com/ClickHouse/ClickHouse/pull/37336)（[Vladimir C](https://github.com/vdimir)）。
* 修复查询包含 GROUP/ORDER BY 且启用 optimize\_aggregation\_in\_order 时的投影问题（此前仅执行最终排序，导致结果错误）。[#37342](https://github.com/ClickHouse/ClickHouse/pull/37342)（[Azat Khuzhin](https://github.com/azat)）。
* 修复 S3 中键名包含特殊字符时的错误。修复 [#33009](https://github.com/ClickHouse/ClickHouse/issues/33009)。[#37344](https://github.com/ClickHouse/ClickHouse/pull/37344)（[Vladimir Chebotarev](https://github.com/excitoon)）。
* 将 GROUPING SETS 与 ROLLUP 或 CUBE 一起使用时抛出异常。[#37367](https://github.com/ClickHouse/ClickHouse/pull/37367)（[Dmitry Novik](https://github.com/novikd)）。
* 修复合并过程中 getMaxSourcePartsSizeForMerge 的 LOGICAL\_ERROR（当 `background_pool_size`/`background_merges_mutations_concurrency_ratio` 在 `config.xml` 中以新方式配置了较大的非标准值，而不是通过已弃用的 `users.xml` 方式配置时）。[#37413](https://github.com/ClickHouse/ClickHouse/pull/37413)（[Azat Khuzhin](https://github.com/azat)）。
* 停止移除 RowBinary 格式中的 UTF-8 BOM。[#37428](https://github.com/ClickHouse/ClickHouse/pull/37428)（[Paul Loyd](https://github.com/loyd)）。[#37428](https://github.com/ClickHouse/ClickHouse/pull/37428)（[Paul Loyd](https://github.com/loyd)）。
* clickhouse-keeper 错误修复：修复单节点集群的强制恢复。[#37440](https://github.com/ClickHouse/ClickHouse/pull/37440)（[Antonio Andelic](https://github.com/antonio2368)）。
* 修复 normalizeUTF8 函数中的逻辑错误。关闭 [#37298](https://github.com/ClickHouse/ClickHouse/issues/37298)。[#37443](https://github.com/ClickHouse/ClickHouse/pull/37443)（[Maksim Kita](https://github.com/kitaisreal)）。
* 修复 JoinSwitcher 中可空 LowCardinality 类型的转换，关闭 [#37385](https://github.com/ClickHouse/ClickHouse/issues/37385)。[#37453](https://github.com/ClickHouse/ClickHouse/pull/37453)（[Vladimir C](https://github.com/vdimir)）。
* 修复 ORC/Arrow/Parquet 格式中的具名元组输出。[#37458](https://github.com/ClickHouse/ClickHouse/pull/37458)（[Kruglov Pavel](https://github.com/Avogar)）。
* 修复存在 GROUPING SETS 时，ORDER BY 子句中单调函数的优化。修复 [#37401](https://github.com/ClickHouse/ClickHouse/issues/37401)。[#37493](https://github.com/ClickHouse/ClickHouse/pull/37493)（[Dmitry Novik](https://github.com/novikd)）。
* 修复某些条件下与字典连接时的错误。关闭 [#37386](https://github.com/ClickHouse/ClickHouse/issues/37386)。[#37530](https://github.com/ClickHouse/ClickHouse/pull/37530)（[Vladimir C](https://github.com/vdimir)）。
* 禁止将 `optimize_aggregation_in_order` 与 `GROUPING SETS` 一起使用（修复 `LOGICAL_ERROR`）。[#37542](https://github.com/ClickHouse/ClickHouse/pull/37542)（[Azat Khuzhin](https://github.com/azat)）。
* 修复 ActionsDAG 转储信息错误。[#37587](https://github.com/ClickHouse/ClickHouse/pull/37587)（[zhanglistar](https://github.com/zhanglistar)）。
* 修复 UNION 查询的类型转换（可能产生 LOGICAL\_ERROR）。[#37593](https://github.com/ClickHouse/ClickHouse/pull/37593)（[Azat Khuzhin](https://github.com/azat)）。
* 修复 `STEP` 子句包含负间隔时的 `WITH FILL` 修饰符。修复 [#37514](https://github.com/ClickHouse/ClickHouse/issues/37514)。[#37600](https://github.com/ClickHouse/ClickHouse/pull/37600)（[Anton Popov](https://github.com/CurtizJ)）。
* 修复 ` join_use_nulls = 1` 时非法的 joinGet 数组用法。修复 [#37562](https://github.com/ClickHouse/ClickHouse/issues/37562)。[#37650](https://github.com/ClickHouse/ClickHouse/pull/37650)（[Amos Bird](https://github.com/amosbird)）。
* 修复交叉连接中列数不匹配的问题，关闭 [#37561](https://github.com/ClickHouse/ClickHouse/issues/37561)。[#37653](https://github.com/ClickHouse/ClickHouse/pull/37653)（[Vladimir C](https://github.com/vdimir)）。
* 修复通过具名集合配置 mysql 数据库时，对其中的表执行 `show create table` 导致的段错误。关闭 [#37683](https://github.com/ClickHouse/ClickHouse/issues/37683)。[#37690](https://github.com/ClickHouse/ClickHouse/pull/37690)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复 RabbitMQ 存储创建时未使用 SETTINGS 子句，导致服务器重启后无法启动该存储的问题。关闭 [#37463](https://github.com/ClickHouse/ClickHouse/issues/37463)。[#37691](https://github.com/ClickHouse/ClickHouse/pull/37691)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 在只读模式下禁止对 SQL 用户定义函数执行 CREATE/DROP。关闭 [#37280](https://github.com/ClickHouse/ClickHouse/issues/37280)。[#37699](https://github.com/ClickHouse/ClickHouse/pull/37699)（[Maksim Kita](https://github.com/kitaisreal)）。
* 修复可执行用户定义函数的 Nullable 参数格式化。关闭 [#35897](https://github.com/ClickHouse/ClickHouse/issues/35897)。[#37711](https://github.com/ClickHouse/ClickHouse/pull/37711)（[Maksim Kita](https://github.com/kitaisreal)）。
* 修复分布式查询中由 `optimize_monotonous_functions_in_order_by` 设置启用的优化。修复 [#36037](https://github.com/ClickHouse/ClickHouse/issues/36037)。[#37724](https://github.com/ClickHouse/ClickHouse/pull/37724)（[Anton Popov](https://github.com/CurtizJ)）。
* 修复 `values` 表函数中可能出现的逻辑错误：`Invalid Field get from type UInt64 to type Float64`。关闭 [#37602](https://github.com/ClickHouse/ClickHouse/issues/37602)。[#37754](https://github.com/ClickHouse/ClickHouse/pull/37754)（[Kruglov Pavel](https://github.com/Avogar)）。
* 修复 SchemaReader 构造函数抛出异常时，结构推断可能发生的段错误。关闭 [#37680](https://github.com/ClickHouse/ClickHouse/issues/37680)。[#37760](https://github.com/ClickHouse/ClickHouse/pull/37760)（[Kruglov Pavel](https://github.com/Avogar)）。
* 修复内部 cast 函数的 cast\_ipv4\_ipv6\_default\_on\_conversion\_error 设置。关闭 [#35156](https://github.com/ClickHouse/ClickHouse/issues/35156)。[#37761](https://github.com/ClickHouse/ClickHouse/pull/37761)（[Maksim Kita](https://github.com/kitaisreal)）。
* 修复 DatatypeDate32 上的 toString 错误。[#37775](https://github.com/ClickHouse/ClickHouse/pull/37775)（[LiuNeng](https://github.com/liuneng1994)）。
* clickhouse-keeper 的 `dead_session_check_period_ms` 设置被转换为微秒（乘以 1000），导致失效会话要等几分钟才清理，而不是 500 毫秒。[#37824](https://github.com/ClickHouse/ClickHouse/pull/37824)（[Michael Lex](https://github.com/mlex)）。
* 修复分布式查询中可能出现的 “No more packets are available” 错误（在禁用 `async_socket_for_remote`/`use_hedged_requests` 时）。[#37826](https://github.com/ClickHouse/ClickHouse/pull/37826)（[Azat Khuzhin](https://github.com/azat)）。
* （实验性 WINDOW VIEW）在 WindowView 中执行 `ALTER TABLE ... MODIFY QUERY` 时，不再删除内部目标表。[#37879](https://github.com/ClickHouse/ClickHouse/pull/37879)（[vxider](https://github.com/Vxider)）。
* 修复 clickhouse-keeper Docker 镜像中 coordination 目录的所有权。修复 [#37914](https://github.com/ClickHouse/ClickHouse/issues/37914)。[#37915](https://github.com/ClickHouse/ClickHouse/pull/37915)（[James Maidment](https://github.com/jamesmaidment)）。
* 修复字典中包含更新字段和 `{condition}` 的自定义查询。关闭 [#33746](https://github.com/ClickHouse/ClickHouse/issues/33746)。[#37947](https://github.com/ClickHouse/ClickHouse/pull/37947)（[Maksim Kita](https://github.com/kitaisreal)）。
* 修复应在 `WITH FILL` 结果之后应用 `ORDER BY` 时（例如外层查询）`SELECT ... WITH FILL` 可能返回错误结果的问题。错误结果由 `ORDER BY` 表达式优化（[#35623](https://github.com/ClickHouse/ClickHouse/issues/35623)）引起。关闭 [#37904](https://github.com/ClickHouse/ClickHouse/issues/37904)。[#37959](https://github.com/ClickHouse/ClickHouse/pull/37959)（[Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)）。
* （实验性 WINDOW VIEW）向 WindowView 的目标表推送数据时添加缺失的默认列，修复 [#37815](https://github.com/ClickHouse/ClickHouse/issues/37815)。[#37965](https://github.com/ClickHouse/ClickHouse/pull/37965)（[vxider](https://github.com/Vxider)）。
* 修复过大的栈帧导致编译失败的问题。[#37996](https://github.com/ClickHouse/ClickHouse/pull/37996)（[Han Shukai](https://github.com/KinderRiven)）。
* 修复开启 enable\_filesystem\_query\_cache\_limit 时抛出 “Reserved cache size exceeds the remaining cache size” 错误的问题。[#38004](https://github.com/ClickHouse/ClickHouse/pull/38004)（[xiedeyantu](https://github.com/xiedeyantu)）。
* 修复 UNION 查询的类型转换（可能产生 LOGICAL\_ERROR）。[#34775](https://github.com/ClickHouse/ClickHouse/pull/34775)（[Azat Khuzhin](https://github.com/azat)）。
* 如果 BackgroundExecutor 繁忙，TTL 合并可能无法再次调度。-- 在 selectPartsToMerge() 中增加 merges\_with\_ttl\_counter；-- 如果 BackgroundExecutor 繁忙，则忽略合并任务；-- merges\_with\_ttl\_counter 不会减少。[#36387](https://github.com/ClickHouse/ClickHouse/pull/36387)（[lthaooo](https://github.com/lthaooo)）。
* 修复 `normalize_function_names` 设置值被覆盖的问题。[#36937](https://github.com/ClickHouse/ClickHouse/pull/36937)（[李扬](https://github.com/taiyang-li)）。
* 修复指数时间衰减窗口函数，现在会遵循窗口边界。[#36944](https://github.com/ClickHouse/ClickHouse/pull/36944)（[Vladimir Chebotarev](https://github.com/excitoon)）。
* 修复读取 system.projection\_parts 和 system.projection\_parts\_columns 时可能发生的堆内存释放后使用错误。修复 [#37184](https://github.com/ClickHouse/ClickHouse/issues/37184)。[#37185](https://github.com/ClickHouse/ClickHouse/pull/37185)（[Amos Bird](https://github.com/amosbird)）。
* 修复 `DateTime64` 在 Unix 纪元之前的小数秒行为。[#37697](https://github.com/ClickHouse/ClickHouse/pull/37697)（[Andrey Zvonov](https://github.com/zvonand)）。[#37039](https://github.com/ClickHouse/ClickHouse/pull/37039)（[李扬](https://github.com/taiyang-li)）。
