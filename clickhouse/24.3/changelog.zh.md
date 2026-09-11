<h3 id="a-id243a-clickhouse-release-243-lts-2024-03-27">
  <a id="243" /> ClickHouse 24.3 版本 LTS, 2024-03-27. [演示文稿](https://presentations.clickhouse.com/2024-release-24.3/), [视频](https://www.youtube.com/watch?v=FGhdXXXTuTg)
</h3>

<Frame>
  <iframe src="https://www.youtube.com/embed/FGhdXXXTuTg" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
</Frame>

<h4 id="upgrade-notes-1">
  Upgrade Notes
</h4>

* 默认启用设置 `allow_experimental_analyzer`，将查询分析切换到兼容性更好、功能更完整的新实现。“analyzer”功能由实验性提升为 beta。可将 `compatibility` 设为 `24.2`，或禁用 `allow_experimental_analyzer`，以恢复旧行为。观看 [YouTube 视频](https://www.youtube.com/watch?v=zhrOYQpgvkk)。
* ClickHouse 允许 String 数据类型包含任意二进制数据，通常是 UTF-8。Parquet/ORC/Arrow 的 String 仅支持 UTF-8。因此，可以选择将 ClickHouse String 映射为 Arrow 的 String 或 Binary 数据类型，由 `output_format_parquet_string_as_string`、`output_format_orc_string_as_string`、`output_format_arrow_string_as_string` 控制。尽管 Binary 更正确、兼容性更好，但在大多数情况下，默认使用 String 更符合用户预期。Parquet/ORC/Arrow 支持多种压缩方法，包括 lz4 和 zstd，ClickHouse 全部支持。部分能力较弱的工具不支持更快的 `lz4`，因此我们将默认值设为 `zstd`。这由 `output_format_parquet_compression_method`、`output_format_orc_compression_method` 和 `output_format_arrow_compression_method` 控制。我们将 Parquet 和 ORC 的默认值改为 `zstd`，但未更改 Arrow（其侧重底层用途）。 [#61817](https://github.com/ClickHouse/ClickHouse/pull/61817) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 在新版 ClickHouse 中，如果所有参数均为 Float64，函数 `geoDistance`、`greatCircleDistance` 和 `greatCircleAngle` 将使用 64 位双精度浮点数进行内部计算，并以该类型返回。关闭 [#58476](https://github.com/ClickHouse/ClickHouse/issues/58476)。此前这些函数始终使用 Float32。可将 `geo_distance_returns_float64_on_float64_arguments` 设为 `false`，或将 `compatibility` 设为 `24.2` 或更早版本，以切换回旧行为。 [#61848](https://github.com/ClickHouse/ClickHouse/pull/61848) ([Alexey Milovidov](https://github.com/alexey-milovidov)). 与 [Geet Patel](https://github.com/geetptl) 共同开发。
* 过时的内存数据片段自 23.5 起被废弃，自 23.10 起不再受支持。现在移除剩余代码。延续 [#55186](https://github.com/ClickHouse/ClickHouse/issues/55186) 和 [#45409](https://github.com/ClickHouse/ClickHouse/issues/45409)。你很可能未使用内存数据片段，因为它们仅在 23.5 之前可用，且只有为 MergeTree 表手动指定相应 SETTINGS 才会启用。若要检查是否存在内存数据片段，请运行：`SELECT part_type, count() FROM system.parts GROUP BY part_type ORDER BY part_type`。若要禁用内存数据片段，请执行 `ALTER TABLE ... MODIFY SETTING min_bytes_for_compact_part = DEFAULT, min_rows_for_compact_part = DEFAULT`。从旧 ClickHouse 版本升级前，先确认没有内存数据片段；若存在，先禁用，等待其全部消失，再继续升级。 [#61127](https://github.com/ClickHouse/ClickHouse/pull/61127) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 将 `system.zookeeper` 表的列名从 `duration_ms` 改为 `duration_microseconds`，以反映时长实际具有微秒分辨率。 [#60774](https://github.com/ClickHouse/ClickHouse/pull/60774) ([Duc Canh Le](https://github.com/canhld94)).
* 当查询级设置 `async_insert` 和 `deduplicate_blocks_in_dependent_materialized_views` 同时启用时，拒绝传入的 INSERT 查询。由默认启用的设置 `throw_if_deduplication_in_dependent_materialized_views_enabled_with_async_insert` 控制。这是 [https://github.com/ClickHouse/ClickHouse/pull/59699](https://github.com/ClickHouse/ClickHouse/pull/59699) 的后续工作，用于解除 [https://github.com/ClickHouse/ClickHouse/pull/59915](https://github.com/ClickHouse/ClickHouse/pull/59915) 的阻碍。 [#60888](https://github.com/ClickHouse/ClickHouse/pull/60888) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* 工具 `clickhouse-copier` 已移至独立 GitHub 仓库：[https://github.com/ClickHouse/copier](https://github.com/ClickHouse/copier)。它不再包含在整合包中，但仍可单独下载。关闭：[#60734](https://github.com/ClickHouse/ClickHouse/issues/60734)。关闭：[#60540](https://github.com/ClickHouse/ClickHouse/issues/60540)。关闭：[#60250](https://github.com/ClickHouse/ClickHouse/issues/60250)。关闭：[#52917](https://github.com/ClickHouse/ClickHouse/issues/52917)。关闭：[#51140](https://github.com/ClickHouse/ClickHouse/issues/51140)。关闭：[#47517](https://github.com/ClickHouse/ClickHouse/issues/47517)。关闭：[#47189](https://github.com/ClickHouse/ClickHouse/issues/47189)。关闭：[#46598](https://github.com/ClickHouse/ClickHouse/issues/46598)。关闭：[#40257](https://github.com/ClickHouse/ClickHouse/issues/40257)。关闭：[#36504](https://github.com/ClickHouse/ClickHouse/issues/36504)。关闭：[#35485](https://github.com/ClickHouse/ClickHouse/issues/35485)。关闭：[#33702](https://github.com/ClickHouse/ClickHouse/issues/33702)。关闭：[#26702](https://github.com/ClickHouse/ClickHouse/issues/26702)。
* 为提升 MySQL 兼容性，兼容别名 `locate` 现在默认接受参数 `(needle, haystack[, start_pos])`。可通过 `function_locate_has_mysql_compatible_argument_order = 0` 恢复此前的 `(haystack, needle, [, start_pos])` 行为。 [#61092](https://github.com/ClickHouse/ClickHouse/pull/61092) ([Robert Schulze](https://github.com/rschu1ze)).
* 默认禁止在 `MergeTree` 表的 `ORDER BY` 中使用 `SimpleAggregateFunction`（类似于禁止 `AggregateFunction`，不过后者被禁止是因为不可比较）。可使用 `allow_suspicious_primary_key` 允许它们。 [#61399](https://github.com/ClickHouse/ClickHouse/pull/61399) ([Azat Khuzhin](https://github.com/azat)).
* 废弃 `Ordinary` 数据库引擎。若服务器仍在使用，clickhouse-client 将发出警告。关闭 [#52229](https://github.com/ClickHouse/ClickHouse/issues/52229)。 [#56942](https://github.com/ClickHouse/ClickHouse/pull/56942) ([shabroo](https://github.com/shabroo)).

<h4 id="new-feature-9">
  新功能
</h4>

* 除 `zip` 外，支持以 `tar` 格式读写备份。 [#59535](https://github.com/ClickHouse/ClickHouse/pull/59535) ([josh-hildred](https://github.com/josh-hildred)).
* 支持 S3 Express 存储桶。 [#59965](https://github.com/ClickHouse/ClickHouse/pull/59965) ([Nikita Taranov](https://github.com/nickitat)).
* 允许从其他磁盘附加数据片段（使用复制而非硬链接）。 [#60112](https://github.com/ClickHouse/ClickHouse/pull/60112) ([Unalian](https://github.com/Unalian)).
* 支持容量受限的 `Memory` 表，由表设置 `min_bytes_to_keep, max_bytes_to_keep, min_rows_to_keep` 和 `max_rows_to_keep` 控制。 [#60612](https://github.com/ClickHouse/ClickHouse/pull/60612) ([Jake Bamrah](https://github.com/JakeBamrah)).
* 分别限制等待中和执行中的查询数量。新增服务器设置 `max_waiting_queries`，限制因 `async_load_databases` 而等待的查询数量。现有执行中查询数量限制不再统计等待中的查询。 [#61053](https://github.com/ClickHouse/ClickHouse/pull/61053) ([Sergei Trifonov](https://github.com/serxa)).
* 新增表 `system.keywords`，包含解析器中的所有关键字，主要用于改进模糊测试和语法高亮。 [#51808](https://github.com/ClickHouse/ClickHouse/pull/51808) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* 支持 `ATTACH PARTITION ALL`。 [#61107](https://github.com/ClickHouse/ClickHouse/pull/61107) ([Kirill Nikiforov](https://github.com/allmazz)).
* 新增函数 `getClientHTTPHeader`。关闭 [#54665](https://github.com/ClickHouse/ClickHouse/issues/54665)。与 @lingtaolf 共同开发。 [#61820](https://github.com/ClickHouse/ClickHouse/pull/61820) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 新增表函数 `generate_series`（现有 `numbers` 函数用于 PostgreSQL 兼容的别名），生成包含自然数等差数列的表。 [#59390](https://github.com/ClickHouse/ClickHouse/pull/59390) ([divanik](https://github.com/divanik)).
* 为 `topK`/`topkWeighed` 增加返回值计数及其误差的模式。 [#54508](https://github.com/ClickHouse/ClickHouse/pull/54508) ([UnamedRus](https://github.com/UnamedRus)).
* 新增函数 `toMillisecond`，返回 `DateTime` 或 `DateTime64` 类型值的毫秒分量。 [#60281](https://github.com/ClickHouse/ClickHouse/pull/60281) ([Shaun Struwig](https://github.com/Blargian)).
* 允许为 clickhouse-server 配置 HTTP 重定向处理程序。例如，可以将 `/` 重定向到 Play UI。 [#60390](https://github.com/ClickHouse/ClickHouse/pull/60390) ([Alexey Milovidov](https://github.com/alexey-milovidov)).

<h4 id="performance-improvement-9">
  性能改进
</h4>

* 优化函数 `dotProduct`，省去不必要且代价高昂的内存复制。 [#60928](https://github.com/ClickHouse/ClickHouse/pull/60928) ([Robert Schulze](https://github.com/rschu1ze)).
* 256 位整数的打印速度提高 30 倍。 [#61100](https://github.com/ClickHouse/ClickHouse/pull/61100) ([Raúl Marín](https://github.com/Algunenano)).
* 若表主键中包含大多无用的列，则不将这些列保留在内存中。由新设置 `primary_key_ratio_of_unique_prefix_values_to_skip_suffix_columns` 控制，默认值为 `0.9`，含义是：对于复合主键，若某列的值至少在全部位置的 0.9 比例上发生变化，则不加载其后的列。 [#60255](https://github.com/ClickHouse/ClickHouse/pull/60255) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 提升涉及多个 `Nullable` 列时序列化聚合方法的性能。 [#55809](https://github.com/ClickHouse/ClickHouse/pull/55809) ([Amos Bird](https://github.com/amosbird)).
* 延迟构建 JSON 输出，以提升 ALL JOIN 性能。 [#58278](https://github.com/ClickHouse/ClickHouse/pull/58278) ([LiuNeng](https://github.com/liuneng1994)).
* 在所有用例中复用与 AWS S3 等外部服务之间的 HTTP/HTTPS 连接，即使响应是 3xx 或 4xx。 [#58845](https://github.com/ClickHouse/ClickHouse/pull/58845) ([Sema Checherinda](https://github.com/CheSema)).
* 改进聚合函数 `argMin` / `argMax` / `any` / `anyLast` / `anyHeavy`，以及 `ORDER BY {u8/u16/u32/u64/i8/i16/u32/i64) LIMIT 1` 查询。 [#58640](https://github.com/ClickHouse/ClickHouse/pull/58640) ([Raúl Marín](https://github.com/Algunenano)).
* 对列过滤进行简单优化。在某些情况下，峰值内存可降至原来的 44%。 [#59698](https://github.com/ClickHouse/ClickHouse/pull/59698) ([李扬](https://github.com/taiyang-li)).
* 当结果类型的底层类型为数值时，以按列方式执行 `multiIf` 函数。 [#60384](https://github.com/ClickHouse/ClickHouse/pull/60384) ([李扬](https://github.com/taiyang-li)).
* 更快的互斥锁（接近 2 倍）。 [#60823](https://github.com/ClickHouse/ClickHouse/pull/60823) ([Azat Khuzhin](https://github.com/azat)).
* 分布式查询结束时，并行排空多个连接。 [#60845](https://github.com/ClickHouse/ClickHouse/pull/60845) ([lizhuoyu5](https://github.com/lzydmxy)).
* 优化可空数值列或可空字符串列之间的数据移动，改善部分微基准测试表现。 [#60846](https://github.com/ClickHouse/ClickHouse/pull/60846) ([李扬](https://github.com/taiyang-li)).
* 减少文件系统缓存操作受到的锁竞争影响。 [#61066](https://github.com/ClickHouse/ClickHouse/pull/61066) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 通过避免编译器的错误优化来优化 array join 及其他 JOIN。关闭 [#61074](https://github.com/ClickHouse/ClickHouse/issues/61074)。 [#61075](https://github.com/ClickHouse/ClickHouse/pull/61075) ([李扬](https://github.com/taiyang-li)).
* 若语法错误的查询包含使用正则表达式的 `COLUMNS` 匹配器，解析器每次回溯都会编译该正则表达式，而非只编译一次。这是一个根本性错误：已编译正则表达式被放入 AST，但 AST 中的 A 意为“抽象”，意味着其中不应包含重量级对象。解析期间可能创建并丢弃 AST 的部分内容，包括大量回溯。这导致解析缓慢，从而允许只读用户发起 DoS。不过主要问题是它阻碍了模糊测试器取得进展。 [#61543](https://github.com/ClickHouse/ClickHouse/pull/61543) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 新增分析器优化步骤，优化只包含单个值的 IN 运算符。 [#61564](https://github.com/ClickHouse/ClickHouse/pull/61564) ([LiuNeng](https://github.com/liuneng1994)).
* DNSResolver 打乱已解析 IP 的顺序，以便均匀利用 AWS S3 的多个端点。 [#60965](https://github.com/ClickHouse/ClickHouse/pull/60965) ([Sema Checherinda](https://github.com/CheSema)).

<h4 id="experimental-feature-7">
  实验性功能
</h4>

* 支持并行读取 Azure Blob Storage，提升实验性 Azure 对象存储的性能。 [#61503](https://github.com/ClickHouse/ClickHouse/pull/61503) ([SmitaRKulkarni](https://github.com/SmitaRKulkarni)).
* 为 Azure Blob Storage 新增类似 S3 的异步 WriteBuffer，提升实验性 Azure 对象存储的性能。 [#59929](https://github.com/ClickHouse/ClickHouse/pull/59929) ([SmitaRKulkarni](https://github.com/SmitaRKulkarni)).
* 使用 Azure Blob Storage 时，备份 I/O 使用托管标识。新增设置，阻止 ClickHouse 尝试创建不存在的容器，因为创建需要存储账户级别的权限。 [#61785](https://github.com/ClickHouse/ClickHouse/pull/61785) ([Daniel Pozo Escalona](https://github.com/danipozo)).
* 新增设置 `parallel_replicas_allow_in_with_subquery = 1`，允许 IN 子查询与并行副本配合使用。 [#60950](https://github.com/ClickHouse/ClickHouse/pull/60950) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* “零拷贝”复制变更：删除表时，必须删除所有与该表相关的零拷贝锁，以及包含这些锁的目录。 [#57575](https://github.com/ClickHouse/ClickHouse/pull/57575) ([Sema Checherinda](https://github.com/CheSema)).

<h4 id="improvement-9">
  改进
</h4>

* 将 `MergeTree` 作为默认表引擎。 [#60524](https://github.com/ClickHouse/ClickHouse/pull/60524) ([Alexey Milovidov](https://github.com/alexey-milovidov))
* 默认启用 `output_format_pretty_row_numbers`，提升易用性。 [#61791](https://github.com/ClickHouse/ClickHouse/pull/61791) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 上一版本中，Pretty 格式的部分数字还不够美观。 [#61794](https://github.com/ClickHouse/ClickHouse/pull/61794) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 当长值是结果集中的唯一值时，Pretty 格式不再将其截断，例如 `SHOW CREATE TABLE` 查询的结果。 [#61795](https://github.com/ClickHouse/ClickHouse/pull/61795) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 与 `clickhouse-local` 类似，`clickhouse-client` 接受 `--output-format` 作为 `--format` 的同义选项。关闭 [#59848](https://github.com/ClickHouse/ClickHouse/issues/59848)。 [#61797](https://github.com/ClickHouse/ClickHouse/pull/61797) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 如果 stdout 是终端且未指定输出格式，`clickhouse-client` 等工具将像交互模式一样默认使用 `PrettyCompact`。`clickhouse-client` 与 `clickhouse-local` 统一处理输入和输出格式的命令行参数。关闭 [#61272](https://github.com/ClickHouse/ClickHouse/issues/61272)。 [#61800](https://github.com/ClickHouse/ClickHouse/pull/61800) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 在 Pretty 格式中为数字分组添加下划线，以提高可读性。由新设置 `output_format_pretty_highlight_digit_groups` 控制。 [#61802](https://github.com/ClickHouse/ClickHouse/pull/61802) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 支持通过 `SYSTEM FLUSH DISTRIBUTED` 覆盖初始 INSERT 设置。 [#61832](https://github.com/ClickHouse/ClickHouse/pull/61832) ([Azat Khuzhin](https://github.com/azat)).
* 默认启用处理器性能分析（排序、聚合等的耗时和输入输出字节数）。 [#61096](https://github.com/ClickHouse/ClickHouse/pull/61096) ([Azat Khuzhin](https://github.com/azat)).
* Filesystem 数据库支持没有格式扩展名的文件。 [#60795](https://github.com/ClickHouse/ClickHouse/pull/60795) ([Kruglov Pavel](https://github.com/Avogar)).
* 使所有格式名称均不区分大小写，例如 Tsv、TSV、tsv，甚至 rowbinary。 [#60420](https://github.com/ClickHouse/ClickHouse/pull/60420) ([豪肥肥](https://github.com/HowePa)). 如果继续使用正确拼写，例如 `JSON` 😇 而非 `Json` 🤮，我会很欣赏；不过也不介意你按个人喜好拼写。
* 为设置 `distributed_ddl_output_mode` 新增 `none_only_active` 模式。 [#60340](https://github.com/ClickHouse/ClickHouse/pull/60340) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 高级仪表盘的多折线图配色略有改善。 [#60391](https://github.com/ClickHouse/ClickHouse/pull/60391) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 高级仪表盘滚动时始终显示控件，无需滚回顶部即可添加新图表。 [#60692](https://github.com/ClickHouse/ClickHouse/pull/60692) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 对物化视图执行 `MODIFY COLUMN` 查询时，检查内部表结构，确保每个列均存在。 [#47427](https://github.com/ClickHouse/ClickHouse/pull/47427) ([sunny](https://github.com/sunny19930321)).
* 字符串类型与 Enum 可用于相同上下文，例如数组、UNION 查询和条件表达式。关闭 [#60726](https://github.com/ClickHouse/ClickHouse/issues/60726)。 [#60727](https://github.com/ClickHouse/ClickHouse/pull/60727) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 允许在供查询处理使用的外部数据结构中声明 Enum（即可以随查询提供的即时临时表）。 [#57857](https://github.com/ClickHouse/ClickHouse/pull/57857) ([Duc Canh Le](https://github.com/canhld94)).
* 选择待合并数据片段时考虑轻量删除的行，以更准确地估计结果数据片段的磁盘大小。 [#58223](https://github.com/ClickHouse/ClickHouse/pull/58223) ([Zhuo Qiu](https://github.com/jewelzqiu)).
* 为更多系统表的列添加注释。延续 [https://github.com/ClickHouse/ClickHouse/pull/58356](https://github.com/ClickHouse/ClickHouse/pull/58356)。 [#59016](https://github.com/ClickHouse/ClickHouse/pull/59016) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* 现在可在 PREWHERE 中使用虚拟列，对于 `_part_offset` 等非常量虚拟列尤其有用。 [#59033](https://github.com/ClickHouse/ClickHouse/pull/59033) ([Amos Bird](https://github.com/amosbird)). 改进虚拟列的整体易用性。现在允许在 `PREWHERE` 中使用虚拟列（对于 `_part_offset` 等非常量虚拟列很有用）。启用设置 `describe_include_virtual_columns` 后，可在 `DESCRIBE` 查询的列注释中查看虚拟列的内置文档。 [#60205](https://github.com/ClickHouse/ClickHouse/pull/60205) ([Anton Popov](https://github.com/CurtizJ)).
* 对象存储现在生成键来判断是否具有删除对象的能力，而非使用常量键。 [#59495](https://github.com/ClickHouse/ClickHouse/pull/59495) ([Sema Checherinda](https://github.com/CheSema)).
* 允许用“local”代替“local\_blob\_storage”作为对象存储类型。 [#60165](https://github.com/ClickHouse/ClickHouse/pull/60165) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 在 `DETACH`/服务器关闭及 `SYSTEM FLUSH DISTRIBUTED` 时，并行刷新 Distributed 引擎待处理的 INSERT 数据块（仅当表具有多磁盘策略时才支持并行，与当前 Distributed 引擎中的其他操作一样）。 [#60225](https://github.com/ClickHouse/ClickHouse/pull/60225) ([Azat Khuzhin](https://github.com/azat)).
* 新增设置，强制合并操作使用透读缓存。 [#60308](https://github.com/ClickHouse/ClickHouse/pull/60308) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 改进 MySQL 兼容协议。问题 [#57598](https://github.com/ClickHouse/ClickHouse/issues/57598) 提到了事务处理行为差异：没有活跃事务时执行 COMMIT/ROLLBACK 会报错，这与 MySQL 的行为不同。 [#60338](https://github.com/ClickHouse/ClickHouse/pull/60338) ([PapaToemmsn](https://github.com/PapaToemmsn)).
* 函数 `substring` 新增别名 `byteSlice`。 [#60494](https://github.com/ClickHouse/ClickHouse/pull/60494) ([Robert Schulze](https://github.com/rschu1ze)).
* 将服务器设置 `dns_cache_max_size` 重命名为 `dns_cache_max_entries`，以减少歧义。 [#60500](https://github.com/ClickHouse/ClickHouse/pull/60500) ([Kirill Nikiforov](https://github.com/allmazz)).
* `SHOW INDEX | INDEXES | INDICES | KEYS` 不再按主键列排序（此前的行为不直观）。 [#60514](https://github.com/ClickHouse/ClickHouse/pull/60514) ([Robert Schulze](https://github.com/rschu1ze)).
* Keeper 改进：启动期间检测到无效快照时中止，以免丢失数据。 [#60537](https://github.com/ClickHouse/ClickHouse/pull/60537) ([Antonio Andelic](https://github.com/antonio2368)).
* 将 tzdata 更新到 2024a。 [#60768](https://github.com/ClickHouse/ClickHouse/pull/60768) ([Raúl Marín](https://github.com/Algunenano)).
* Keeper 改进：在 Keeper 设置中支持 `leadership_expiry_ms`。 [#60806](https://github.com/ClickHouse/ClickHouse/pull/60806) ([Brokenice0415](https://github.com/Brokenice0415)).
* 无论 `input_format_try_infer_exponent_floats` 如何设置，始终推断 JSON 格式中的指数表示法数字。新增设置 `input_format_json_use_string_type_for_ambiguous_paths_in_named_tuples_inference_from_objects`，允许从 JSON 对象推断命名 Tuple 时，对有歧义的路径使用 String 类型，而非抛出异常。 [#60808](https://github.com/ClickHouse/ClickHouse/pull/60808) ([Kruglov Pavel](https://github.com/Avogar)).
* 支持 MySQL 中常用的 `START TRANSACTION` 语法，解决 [https://github.com/ClickHouse/ClickHouse/discussions/60865](https://github.com/ClickHouse/ClickHouse/discussions/60865)。 [#60886](https://github.com/ClickHouse/ClickHouse/pull/60886) ([Zach Naimon](https://github.com/ArctypeZach)).
* 为完全排序合并连接算法增加标志，以将 null 视为最大值或最小值，使行为兼容 Apache Spark 等其他 SQL 系统。 [#60896](https://github.com/ClickHouse/ClickHouse/pull/60896) ([loudongfeng](https://github.com/loudongfeng)).
* `clickhouse-client` 和 `clickhouse-local` 支持根据文件扩展名检测输出格式。 [#61036](https://github.com/ClickHouse/ClickHouse/pull/61036) ([豪肥肥](https://github.com/HowePa)).
* Linux 的 cgroup 值变化时，在运行期间更新内存限制。 [#61049](https://github.com/ClickHouse/ClickHouse/pull/61049) ([Han Fei](https://github.com/hanfei1991)).
* 新增误遗漏的函数 `toUInt128OrZero`（该失误与 [https://github.com/ClickHouse/ClickHouse/pull/945](https://github.com/ClickHouse/ClickHouse/pull/945) 有关）。兼容别名 `FROM_UNIXTIME` 和 `DATE_FORMAT`（并非 ClickHouse 原生函数，仅用于 MySQL 兼容）现在不区分大小写，符合 SQL 兼容别名的预期。 [#61114](https://github.com/ClickHouse/ClickHouse/pull/61114) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 改进访问权限检查：当目标用户也不具备待撤销权限时，允许撤销操作者自身未持有的权限。例如：`GRANT SELECT ON *.* TO user1; REVOKE SELECT ON system.* FROM user1;`。 [#61115](https://github.com/ClickHouse/ClickHouse/pull/61115) ([pufit](https://github.com/pufit)).
* 修复 `has()` 函数对 `Nullable` 列的处理（修复 [#60214](https://github.com/ClickHouse/ClickHouse/issues/60214)）。 [#61249](https://github.com/ClickHouse/ClickHouse/pull/61249) ([Mikhail Koviazin](https://github.com/mkmkme)).
* 现在可以在子树配置替换中指定属性 `merge="true"`，例如 `<include from_zk="/path" merge="true">`。指定该属性时，clickhouse 将子树与现有配置合并；否则默认将新内容追加到配置。 [#61299](https://github.com/ClickHouse/ClickHouse/pull/61299) ([alesapin](https://github.com/alesapin)).
* 新增虚拟内存映射的异步指标：`VMMaxMapCount` 与 `VMNumMaps`。关闭 [#60662](https://github.com/ClickHouse/ClickHouse/issues/60662)。 [#61354](https://github.com/ClickHouse/ClickHouse/pull/61354) ([Tuan Pham Anh](https://github.com/tuanpavn)).
* 在所有创建临时数据的地方使用 `temporary_files_codec` 设置，例如外部排序和外部 GROUP BY。此前只在 `partial_merge` JOIN 算法中生效。 [#61456](https://github.com/ClickHouse/ClickHouse/pull/61456) ([Maksim Kita](https://github.com/kitaisreal)).
* 新增设置 `max_parser_backtracks`，可限制查询解析的复杂度。 [#61502](https://github.com/ClickHouse/ClickHouse/pull/61502) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 减少动态调整文件系统缓存大小期间的竞争。 [#61524](https://github.com/ClickHouse/ClickHouse/pull/61524) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 禁止 StorageS3 队列的分片模式，因为该模式将被重写。 [#61537](https://github.com/ClickHouse/ClickHouse/pull/61537) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复拼写错误：将 `use_leagcy_max_level` 改为 `use_legacy_max_level`。 [#61545](https://github.com/ClickHouse/ClickHouse/pull/61545) ([William Schoeffel](https://github.com/wiledusc)).
* 移除 `system.blob_storage_log` 中的部分重复条目。 [#61622](https://github.com/ClickHouse/ClickHouse/pull/61622) ([YenchangChan](https://github.com/YenchangChan)).
* 新增 `current_user` 函数作为 MySQL 兼容别名。 [#61770](https://github.com/ClickHouse/ClickHouse/pull/61770) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 修复 x86-64 / ARM 混合集群中浮点聚合函数状态不一致的问题。 [#60610](https://github.com/ClickHouse/ClickHouse/pull/60610) ([Harry Lee](https://github.com/HarryLeeIBM)).

<h4 id="buildtestingpackaging-improvement-5">
  构建/测试/打包改进
</h4>

* 实时查询性能分析器现在可在 AArch64 上运行。此前仅在程序未花时间执行系统调用时才有效。 [#60807](https://github.com/ClickHouse/ClickHouse/pull/60807) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 将 ClickHouse 版本添加到 docker 标签。关闭 [#54224](https://github.com/ClickHouse/ClickHouse/issues/54224)。 [#60949](https://github.com/ClickHouse/ClickHouse/pull/60949) ([Nikolay Monkov](https://github.com/nikmonkov)).
* 将 `prqlc` 升级到 0.11.3。 [#60616](https://github.com/ClickHouse/ClickHouse/pull/60616) ([Maximilian Roos](https://github.com/max-sixty)).
* 在 `clickhouse-local` 中新增通用查询文本模糊测试器。 [#61508](https://github.com/ClickHouse/ClickHouse/pull/61508) ([Alexey Milovidov](https://github.com/alexey-milovidov)).

<h4 id="bug-fix-user-visible-misbehavior-in-an-official-stable-release-7">
  缺陷修复（正式稳定版本中用户可见的异常行为）
</h4>

* 修复 MergeTree 的 finished\_mutations\_to\_keep=0 行为（文档规定 0 表示保留全部）。 [#60031](https://github.com/ClickHouse/ClickHouse/pull/60031) ([Azat Khuzhin](https://github.com/azat)).
* FINAL 优化存在问题，作者的描述是：“PartsSplitter 为同一数据片段生成了无效范围”。 [#60041](https://github.com/ClickHouse/ClickHouse/pull/60041) ([Maksim Kita](https://github.com/kitaisreal)).
* 实验性且不受支持的 Apache Hive 存在问题。 [#60262](https://github.com/ClickHouse/ClickHouse/pull/60262) ([shanfengp](https://github.com/Aed-p)).
* 改进实验性并行副本：并行副本发生变化时，强制重新分析。 [#60362](https://github.com/ClickHouse/ClickHouse/pull/60362) ([Raúl Marín](https://github.com/Algunenano)).
* 修复 plain 元数据类型与新磁盘配置选项的配合使用。 [#60396](https://github.com/ClickHouse/ClickHouse/pull/60396) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 尝试修复 mapContainsKeyLike 中“无法捕获列，因为其类型不兼容”的逻辑错误。 [#60451](https://github.com/ClickHouse/ClickHouse/pull/60451) ([Kruglov Pavel](https://github.com/Avogar)).
* 避免为 CREATE TABLE 计算标量子查询。 [#60464](https://github.com/ClickHouse/ClickHouse/pull/60464) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复因错误跳过大量行时并行解析发生的死锁。 [#60516](https://github.com/ClickHouse/ClickHouse/pull/60516) ([Kruglov Pavel](https://github.com/Avogar)).
* 实验性 KQL（Kusto）支持存在问题：修复 `max_query_size_for_kql_compound_operator`： [#60534](https://github.com/ClickHouse/ClickHouse/pull/60534) ([Yong Wang](https://github.com/kashwy)).
* Keeper 修复：等待提交日志时增加超时。 [#60544](https://github.com/ClickHouse/ClickHouse/pull/60544) ([Antonio Andelic](https://github.com/antonio2368)).
* 不为日期类型输出数字提示。 [#60577](https://github.com/ClickHouse/ClickHouse/pull/60577) ([Raúl Marín](https://github.com/Algunenano)).
* 修复过滤器包含非确定性函数时的 MergeTree 读取。 [#60586](https://github.com/ClickHouse/ClickHouse/pull/60586) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复 compatibility 设置值类型错误时的逻辑错误。 [#60596](https://github.com/ClickHouse/ClickHouse/pull/60596) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复 PRQL：提供健壮的 panic 处理程序。 [#60615](https://github.com/ClickHouse/ClickHouse/pull/60615) ([Maximilian Roos](https://github.com/max-sixty)).
* 修复 `intDiv` 对 decimal 和日期参数的处理。 [#60672](https://github.com/ClickHouse/ClickHouse/pull/60672) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 修复：在 alter modify 查询中展开 CTE。 [#60682](https://github.com/ClickHouse/ClickHouse/pull/60682) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* 修复非 Atomic/Ordinary 数据库引擎（如 Memory）的 system.parts。 [#60689](https://github.com/ClickHouse/ClickHouse/pull/60689) ([Azat Khuzhin](https://github.com/azat)).
* 修复参数化视图的“Invalid storage definition in metadata file”错误。 [#60708](https://github.com/ClickHouse/ClickHouse/pull/60708) ([Azat Khuzhin](https://github.com/azat)).
* 修复 CompressionCodecMultiple 中的缓冲区溢出。 [#60731](https://github.com/ClickHouse/ClickHouse/pull/60731) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 移除 SQL/JSON 中不合理的内容。 [#60738](https://github.com/ClickHouse/ClickHouse/pull/60738) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 移除聚合函数 quantileGK 中的错误断言。 [#60740](https://github.com/ClickHouse/ClickHouse/pull/60740) ([李扬](https://github.com/taiyang-li)).
* 通过将流数量设为 1，修复 insert-select 与 insert\_deduplication\_token 组合的缺陷。 [#60745](https://github.com/ClickHouse/ClickHouse/pull/60745) ([Jordi Villar](https://github.com/jrdi)).
* 防止在不支持的分段上传操作中设置自定义元数据请求头。 [#60748](https://github.com/ClickHouse/ClickHouse/pull/60748) ([Francisco J. Jurado Moreno](https://github.com/Beetelbrox)).
* 修复 toStartOfInterval。 [#60763](https://github.com/ClickHouse/ClickHouse/pull/60763) ([Andrey Zvonov](https://github.com/zvonand)).
* 修复 arrayEnumerateRanked 崩溃。 [#60764](https://github.com/ClickHouse/ClickHouse/pull/60764) ([Raúl Marín](https://github.com/Algunenano)).
* 修复在 INSERT SELECT JOIN 中使用 input() 时的崩溃。 [#60765](https://github.com/ClickHouse/ClickHouse/pull/60765) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复子查询中 allow\_experimental\_analyzer 值不同时的崩溃。 [#60770](https://github.com/ClickHouse/ClickHouse/pull/60770) ([Dmitry Novik](https://github.com/novikd)).
* 移除从 S3 读取时的递归。 [#60849](https://github.com/ClickHouse/ClickHouse/pull/60849) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复 HashedDictionaryParallelLoader 出错时可能卡住的问题。 [#60926](https://github.com/ClickHouse/ClickHouse/pull/60926) ([vdimir](https://github.com/vdimir)).
* 修复 Replicated 数据库的异步 RESTORE（实验性功能）。 [#60934](https://github.com/ClickHouse/ClickHouse/pull/60934) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复通过原生协议向 `Log` 表异步插入时的死锁。 [#61055](https://github.com/ClickHouse/ClickHouse/pull/61055) ([Anton Popov](https://github.com/CurtizJ)).
* 修复 RangeHashedDictionary 的 dictGetOrDefault 默认参数的延迟执行。 [#61196](https://github.com/ClickHouse/ClickHouse/pull/61196) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复 groupArraySorted 中的多个缺陷。 [#61203](https://github.com/ClickHouse/ClickHouse/pull/61203) ([Raúl Marín](https://github.com/Algunenano)).
* 修复独立二进制文件中 Keeper 的重新配置。 [#61233](https://github.com/ClickHouse/ClickHouse/pull/61233) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复 S3 引擎中 session\_token 的使用。 [#61234](https://github.com/ClickHouse/ClickHouse/pull/61234) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复聚合函数 `uniqExact` 可能返回错误结果的问题。 [#61257](https://github.com/ClickHouse/ClickHouse/pull/61257) ([Anton Popov](https://github.com/CurtizJ)).
* 修复 show database 中的缺陷。 [#61269](https://github.com/ClickHouse/ClickHouse/pull/61269) ([Raúl Marín](https://github.com/Algunenano)).
* 修复含 MATERIALIZED 列的 RabbitMQ 存储中的逻辑错误。 [#61320](https://github.com/ClickHouse/ClickHouse/pull/61320) ([vdimir](https://github.com/vdimir)).
* 修复 CREATE OR REPLACE DICTIONARY。 [#61356](https://github.com/ClickHouse/ClickHouse/pull/61356) ([Vitaly Baranov](https://github.com/vitlibar)).
* 修复带外部 ON CLUSTER 的 ATTACH 查询。 [#61365](https://github.com/ClickHouse/ClickHouse/pull/61365) ([Nikolay Degterinsky](https://github.com/evillique)).
* 修复可空键的连续键优化。 [#61393](https://github.com/ClickHouse/ClickHouse/pull/61393) ([Anton Popov](https://github.com/CurtizJ)).
* 修复 actions DAG 拆分问题。 [#61458](https://github.com/ClickHouse/ClickHouse/pull/61458) ([Raúl Marín](https://github.com/Algunenano)).
* 修复失败 RESTORE 的结束处理。 [#61466](https://github.com/ClickHouse/ClickHouse/pull/61466) ([Vitaly Baranov](https://github.com/vitlibar)).
* 通过兼容性设置正确禁用 async\_insert\_use\_adaptive\_busy\_timeout。 [#61468](https://github.com/ClickHouse/ClickHouse/pull/61468) ([Raúl Marín](https://github.com/Algunenano)).
* 允许在恢复池中排队。 [#61475](https://github.com/ClickHouse/ClickHouse/pull/61475) ([Nikita Taranov](https://github.com/nickitat)).
* 修复使用 UUID 读取 system.parts 时的不一致问题。 [#61479](https://github.com/ClickHouse/ClickHouse/pull/61479) ([Dan Wu](https://github.com/wudanzy)).
* 修复 ALTER QUERY MODIFY SQL SECURITY。 [#61480](https://github.com/ClickHouse/ClickHouse/pull/61480) ([pufit](https://github.com/pufit)).
* 修复窗口视图中的崩溃（实验性功能）。 [#61526](https://github.com/ClickHouse/ClickHouse/pull/61526) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复 `repeat` 对非原生整数类型的处理。 [#61527](https://github.com/ClickHouse/ClickHouse/pull/61527) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复客户端的 `-s` 参数。 [#61530](https://github.com/ClickHouse/ClickHouse/pull/61530) ([Mikhail f. Shiryaev](https://github.com/Felixoid)).
* 修复 arrayPartialReverseSort 崩溃。 [#61539](https://github.com/ClickHouse/ClickHouse/pull/61539) ([Raúl Marín](https://github.com/Algunenano)).
* 修复使用常量位置的字符串搜索。 [#61547](https://github.com/ClickHouse/ClickHouse/pull/61547) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复 addDays 使用 DateTime64 时引发错误的问题。 [#61561](https://github.com/ClickHouse/ClickHouse/pull/61561) ([Shuai li](https://github.com/loneylee)).
* 不允许 JSONExtract 的输入类型为 LowCardinality。 [#61617](https://github.com/ClickHouse/ClickHouse/pull/61617) ([Julia Kartseva](https://github.com/jkartseva)).
* 修复带去重的异步插入的 `system.part_log`。 [#61620](https://github.com/ClickHouse/ClickHouse/pull/61620) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复 system.parts 的 `Non-ready set` 异常。 [#61666](https://github.com/ClickHouse/ClickHouse/pull/61666) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复 REPLACE\_RANGE 的 actual\_part\_name（`Entry actual part isn't empty yet`）。 [#61675](https://github.com/ClickHouse/ClickHouse/pull/61675) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 修复 `multiSearchAllPositionsCaseInsensitiveUTF8` 处理无效 UTF-8 时触发的 sanitizer 报告。 [#61749](https://github.com/ClickHouse/ClickHouse/pull/61749) ([pufit](https://github.com/pufit)).
* 修复发现的 RANGE 窗口框架不支持 Nullable 列的问题。 [#61766](https://github.com/ClickHouse/ClickHouse/pull/61766) ([YuanLiu](https://github.com/ditgittube)).
