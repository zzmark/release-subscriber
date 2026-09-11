<h3 id="239">
  <a id="239" /> ClickHouse 23.9 版本, 2023-09-28. [演示文稿](https://presentations.clickhouse.com/2023-release-23.9/), [视频](https://www.youtube.com/watch?v=yS8YU-rBpMM)
</h3>

<Frame>
  <iframe src="https://www.youtube.com/embed/yS8YU-rBpMM" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
</Frame>

<h4 id="backward-incompatible-change-3">
  向后不兼容变更
</h4>

* 从默认 Prometheus 处理器中移除 `status_info` 配置选项和字典状态信息。 [#54090](https://github.com/ClickHouse/ClickHouse/pull/54090) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 从代码库中移除实验性数据片段元数据缓存。 [#54215](https://github.com/ClickHouse/ClickHouse/pull/54215) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 默认禁用 `input_format_json_try_infer_numbers_from_strings`，即默认不尝试从 JSON 字符串推断数值，避免样本数据包含看似数字的字符串时产生解析错误。 [#55099](https://github.com/ClickHouse/ClickHouse/pull/55099) ([Kruglov Pavel](https://github.com/Avogar)).

<h4 id="new-feature-3">
  新功能
</h4>

* 改进 JSON 格式的结构推断：1）通过 `input_format_json_try_infer_named_tuples_from_objects` 设置，无需实验性 JSON 类型即可从 JSON 对象推断命名元组。此前不用实验性 JSON 类型时，只能将对象推断为 String 或 Map；现在可推断为命名 Tuple，其类型包含结构推断样本中读到的所有对象键，适用于没有稀疏对象的结构化 JSON 数据。该设置默认启用。2）通过 `input_format_json_read_arrays_as_strings`，允许将 JSON 数组解析到 String 列，有助于读取包含不同类型值的数组。3）通过 `input_format_json_infer_incomplete_types_as_strings`，允许对样本中类型未知的 JSON 键（`null`/`[]`/`{}`）使用 String 类型。JSON 格式现在可将任意值读入 String 列；对未知类型使用 String，可避免结构推断时报错 `Cannot determine type for column 'column_name' by first 25000 rows of data, most likely this column contains only Nulls or empty Arrays/Maps`，从而成功读取数据。 [#54427](https://github.com/ClickHouse/ClickHouse/pull/54427) ([Kruglov Pavel](https://github.com/Avogar)).
* 为远程磁盘新增 IO 调度支持。`s3`、`s3_plain`、`hdfs` 和 `azure_blob_storage` 磁盘配置可包含 `read_resource`、`write_resource` 元素，保存资源名称。可在独立服务器配置节 `resources` 中配置资源调度策略。使用 `workload` 设置标记查询，并通过 `workload_classifiers` 配置节分类，实现不同资源调度目标。详见[文档](/docs/concepts/features/configuration/server-config/workload-scheduling)。新增 “bandwidth\_limit” IO 调度节点类型，可对经过节点的流量设置 `max_speed` 和 `max_burst` 限制。 [#47009](https://github.com/ClickHouse/ClickHouse/pull/47009) ([Sergei Trifonov](https://github.com/serxa)). [#54618](https://github.com/ClickHouse/ClickHouse/pull/54618) ([Sergei Trifonov](https://github.com/serxa))。
* 新增基于 SSH 密钥的认证类型，仅适用于原生 TCP 协议。 [#41109](https://github.com/ClickHouse/ClickHouse/pull/41109) ([George Gamezardashvili](https://github.com/InfJoker)).
* 为 MergeTree 表新增 `_block_number` 列。[#44532](https://github.com/ClickHouse/ClickHouse/issues/44532)。 [#47532](https://github.com/ClickHouse/ClickHouse/pull/47532) ([SmitaRKulkarni](https://github.com/SmitaRKulkarni)).
* 为 `DROP TABLE` 查询新增 `IF EMPTY` 子句。 [#48915](https://github.com/ClickHouse/ClickHouse/pull/48915) ([Pavel Novitskiy](https://github.com/pnovitskiy)).
* SQL 函数 `toString(datetime, timezone)` 和 `formatDateTime(datetime, format, timezone)` 现在支持非常量时区参数。 [#53680](https://github.com/ClickHouse/ClickHouse/pull/53680) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 支持 `ALTER TABLE MODIFY COMMENT`。注意：很久以前外部贡献者添加过类似能力，但完全无法工作，只会让用户困惑。关闭 [#36377](https://github.com/ClickHouse/ClickHouse/issues/36377)。此命令不会在副本间传播，因此同一表的副本可以具有不同注释。 [#51304](https://github.com/ClickHouse/ClickHouse/pull/51304) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 新增数据压缩编解码器 `GCD`，即最大公约数。它计算所有列值的最大公约数，再将每个值除以该数。GCD 与 Delta、DoubleDelta 类似，属于数据预处理编解码器，不能单独使用；适用于整数、定点数和日期时间类型。典型场景是列值以最大公约数的倍数增减，例如 24 - 28 - 16 - 24 - 8 - 24（GCD 为 4）。 [#53149](https://github.com/ClickHouse/ClickHouse/pull/53149) ([Alexander Nam](https://github.com/seshWCS)).
* 新增两个类型别名：`DECIMAL(P)` 是 `DECIMAL(P, 0)` 的简写，`DECIMAL` 是 `DECIMAL(10, 0)` 的简写，以改善与 MySQL SQL 方言的兼容性。 [#53328](https://github.com/ClickHouse/ClickHouse/pull/53328) ([Val Doroshchuk](https://github.com/valbok)).
* 新增系统日志表 `backup_log`，跟踪所有 `BACKUP` 和 `RESTORE` 操作。 [#53638](https://github.com/ClickHouse/ClickHouse/pull/53638) ([Victor Krasnov](https://github.com/sirvickr)).
* 新增格式设置 `output_format_markdown_escape_special_characters`（默认 false），控制 `Markdown` 输出格式是否转义 `!`、`#`、`$` 等特殊字符，即在前面添加反斜杠。 [#53860](https://github.com/ClickHouse/ClickHouse/pull/53860) ([irenjj](https://github.com/irenjj)).
* 新增 `decodeHTMLComponent` 函数。 [#54097](https://github.com/ClickHouse/ClickHouse/pull/54097) ([Bharat Nallan](https://github.com/bharatnc)).
* 为 query\_log 表新增 `peak_threads_usage`。 [#54335](https://github.com/ClickHouse/ClickHouse/pull/54335) ([Alexey Gerasimchuck](https://github.com/Demilivor)).
* clickhouse-client 新增 `SHOW FUNCTIONS` 支持。 [#54337](https://github.com/ClickHouse/ClickHouse/pull/54337) ([Julia Kartseva](https://github.com/wat-ze-hex)).
* 新增 `toDaysSinceYearZero` 函数及 MySQL 兼容别名 `TO_DAYS`，返回自 `0001-01-01` 起经过的天数（采用前推格里高利历）。`toDaysSinceYearZero` 现在也支持 `DateTime` 和 `DateTime64` 参数。 [#54479](https://github.com/ClickHouse/ClickHouse/pull/54479) ([Robert Schulze](https://github.com/rschu1ze)). [#54856](https://github.com/ClickHouse/ClickHouse/pull/54856) ([Serge Klochkov](https://github.com/slvrtrn))。
* 新增 `YYYYMMDDtoDate`、`YYYYMMDDtoDate32`、`YYYYMMDDhhmmssToDateTime` 和 `YYYYMMDDhhmmssToDateTime64`，将整数编码的日期或日期时间（例如 20230911）转换为原生日期/日期时间类型。因此，它们提供与现有 `YYYYMMDDToDate`、`YYYYMMDDToDateTime`、`YYYYMMDDhhmmddToDateTime`、`YYYYMMDDhhmmddToDateTime64` 相反的功能。 [#54509](https://github.com/ClickHouse/ClickHouse/pull/54509) ([Quanfa Fu](https://github.com/dentiscalprum)) ([Robert Schulze](https://github.com/rschu1ze)).
* 新增若干字符串距离函数，包括 `byteHammingDistance`、`editDistance`。 [#54935](https://github.com/ClickHouse/ClickHouse/pull/54935) ([flynn](https://github.com/ucasfl)).
* 允许通过 `VALID UNTIL datetime` 子句指定用户凭据的到期日期，并可选指定时间。 [#51261](https://github.com/ClickHouse/ClickHouse/pull/51261) ([Nikolay Degterinsky](https://github.com/evillique)).
* `s3`、`gcs`、`oss` 表函数支持 S3 风格 URL，并自动转换为 HTTP。例如 `'s3://clickhouse-public-datasets/hits.csv'` 转换为 `'https://clickhouse-public-datasets.s3.amazonaws.com/hits.csv'`。 [#54931](https://github.com/ClickHouse/ClickHouse/pull/54931) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 新增 `print_pretty_type_names` 设置，美化输出深层嵌套的 Tuple/Map/Array 等类型。 [#55095](https://github.com/ClickHouse/ClickHouse/pull/55095) ([Kruglov Pavel](https://github.com/Avogar)).

<h4 id="performance-improvement-3">
  性能改进
</h4>

* 默认启用预取，加快 S3 读取。 [#53709](https://github.com/ClickHouse/ClickHouse/pull/53709) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 对于带 FINAL 的查询，如无必要，不再隐式读取孤立数据片段中的主键和版本列。 [#53919](https://github.com/ClickHouse/ClickHouse/pull/53919) ([Duc Canh Le](https://github.com/canhld94)).
* 优化按常量键分组。在 [https://github.com/ClickHouse/ClickHouse/pull/53529](https://github.com/ClickHouse/ClickHouse/pull/53529) 之后，可优化按 `_file/_path` 分组的查询。 [#53549](https://github.com/ClickHouse/ClickHouse/pull/53549) ([Kruglov Pavel](https://github.com/Avogar)).
* 提升 `Decimal` 列排序性能，以及 ORDER BY 包含 `Decimal` 列时向 `MergeTree` 插入的性能；改善数据已排序或接近有序时的排序性能。 [#35961](https://github.com/ClickHouse/ClickHouse/pull/35961) ([Maksim Kita](https://github.com/kitaisreal)).
* 提升大型查询分析性能。修复 [#51224](https://github.com/ClickHouse/ClickHouse/issues/51224)。 [#51469](https://github.com/ClickHouse/ClickHouse/pull/51469) ([frinkr](https://github.com/frinkr)).
* 当从带 GROUP BY 的子查询选择数据时，将 `COUNT(DISTINCT ...)` 和各种 `uniq` 变体重写为 `count`。[#52082](https://github.com/ClickHouse/ClickHouse/pull/52082) [#52645](https://github.com/ClickHouse/ClickHouse/pull/52645) ([JackyWoo](https://github.com/JackyWoo)).
* 移除手动调用 `mmap/mremap/munmap`，将这些工作交给 `jemalloc`，略微提升性能。 [#52792](https://github.com/ClickHouse/ClickHouse/pull/52792) ([Nikita Taranov](https://github.com/nickitat)).
* 修复使用 NATS 时 CPU 消耗过高的问题。 [#54399](https://github.com/ClickHouse/ClickHouse/pull/54399) ([Vasilev Pyotr](https://github.com/vahpetr)).
* 由于现在针对日期时间参数使用独立指令执行 `toString`，可稍微提升非日期时间参数的性能，并简化部分代码。延续 [#53680](https://github.com/ClickHouse/ClickHouse/issues/53680)。 [#54443](https://github.com/ClickHouse/ClickHouse/pull/54443) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 不再将 JSON 元素序列化到 `std::stringstream`，此 PR 尝试将序列化结果直接写入 `ColumnString`。 [#54613](https://github.com/ClickHouse/ClickHouse/pull/54613) ([lgbo](https://github.com/lgbo-ustc)).
* MergeTree 表位于视图之后时，也启用 ORDER BY 优化，以对应顺序读取数据。 [#54628](https://github.com/ClickHouse/ClickHouse/pull/54628) ([Vitaly Baranov](https://github.com/vitlibar)).
* 复用 `GeneratorJSONPath` 并移除若干共享指针，改进 JSON SQL 函数。 [#54735](https://github.com/ClickHouse/ClickHouse/pull/54735) ([lgbo](https://github.com/lgbo-ustc)).
* Keeper 尝试批量刷新请求，以提高性能。 [#53049](https://github.com/ClickHouse/ClickHouse/pull/53049) ([Antonio Andelic](https://github.com/antonio2368)).
* `clickhouse-client` 现在对 `INFILE 'glob_expression'` 并行处理文件。关闭 [#54218](https://github.com/ClickHouse/ClickHouse/issues/54218)。 [#54533](https://github.com/ClickHouse/ClickHouse/pull/54533) ([Max K.](https://github.com/mkaynov)).
* 主键列类型与 `IN` 右侧列类型不同时，允许 IN 函数使用主键。例如 `SELECT id FROM test_table WHERE id IN (SELECT '5')`。关闭 [#48936](https://github.com/ClickHouse/ClickHouse/issues/48936)。 [#54544](https://github.com/ClickHouse/ClickHouse/pull/54544) ([Maksim Kita](https://github.com/kitaisreal)).
* 哈希 JOIN 尝试收缩已占用最大可用内存一半的内部缓冲区，最大内存由 `max_bytes_in_join` 设置。 [#54584](https://github.com/ClickHouse/ClickHouse/pull/54584) ([vdimir](https://github.com/vdimir)).
* 数组连接遵循 `max_block_size`，避免可能的 OOM。关闭 [#54290](https://github.com/ClickHouse/ClickHouse/issues/54290)。 [#54664](https://github.com/ClickHouse/ClickHouse/pull/54664) ([李扬](https://github.com/taiyang-li)).
* 在 `s3` 表函数中复用 HTTP 连接。 [#54812](https://github.com/ClickHouse/ClickHouse/pull/54812) ([Michael Kolupaev](https://github.com/al13n321)).
* 将 `MergeTreeRangeReader::Stream::ceilRowsToCompleteGranules` 中的线性搜索替换为二分搜索。 [#54869](https://github.com/ClickHouse/ClickHouse/pull/54869) ([usurai](https://github.com/usurai)).

<h4 id="experimental-feature">
  实验性功能
</h4>

* 现在可通过 `max_threads_for_annoy_index_creation` 设置并行创建 `Annoy` 索引。 [#54047](https://github.com/ClickHouse/ClickHouse/pull/54047) ([Robert Schulze](https://github.com/rschu1ze)).
* 通过 Distributed 表使用并行副本时，不再从所有副本读取。 [#54199](https://github.com/ClickHouse/ClickHouse/pull/54199) ([Igor Nikonov](https://github.com/devcrafter)).

<h4 id="improvement-3">
  改进
</h4>

* 允许将 `MergeTree` 数据片段中较长的列文件名替换为名称哈希，在某些情况下避免 `File name too long` 错误。 [#50612](https://github.com/ClickHouse/ClickHouse/pull/50612) ([Anton Popov](https://github.com/CurtizJ)).
* `JSON` 格式元数据解析失败时，改按 `JSONEachRow` 解析，使实际格式为 JSONEachRow 的 `.json` 文件也可读取。关闭 [#45740](https://github.com/ClickHouse/ClickHouse/issues/45740)。 [#54405](https://github.com/ClickHouse/ClickHouse/pull/54405) ([Kruglov Pavel](https://github.com/Avogar)).
* HTTP 查询执行期间发生异常时输出有效 JSON/XML。新增 `http_write_exception_in_output_format` 设置控制此行为，默认启用。 [#52853](https://github.com/ClickHouse/ClickHouse/pull/52853) ([Kruglov Pavel](https://github.com/Avogar)).
* `information_schema.tables` 视图新增 `data_length` 字段，显示数据在磁盘上的近似大小，用于运行 Amazon QuickSight 生成的查询。 [#55037](https://github.com/ClickHouse/ClickHouse/pull/55037) ([Robert Schulze](https://github.com/rschu1ze)).
* MySQL 接口新增最低限度的预处理语句实现，足以让 Tableau Online 通过 MySQL 连接器连接 ClickHouse。注意：实现非常精简，尚不支持参数绑定，因为该 Tableau Online 用例不需要。若充分测试后发现问题并有必要，将在后续实现。 [#54115](https://github.com/ClickHouse/ClickHouse/pull/54115) ([Serge Klochkov](https://github.com/slvrtrn)).
* `regexp_tree` 字典支持不区分大小写及 dot-all 匹配模式。 [#50906](https://github.com/ClickHouse/ClickHouse/pull/50906) ([Johann Gan](https://github.com/johanngan)).
* Keeper 改进：新增 `createIfNotExists` 命令。 [#48855](https://github.com/ClickHouse/ClickHouse/pull/48855) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 更精确地推断整数类型，修复 [#51236](https://github.com/ClickHouse/ClickHouse/issues/51236)。 [#53003](https://github.com/ClickHouse/ClickHouse/pull/53003) ([Chen768959](https://github.com/Chen768959)).
* 为 MaterializedMySQL 引入字符串字面量字符集解析。 [#53220](https://github.com/ClickHouse/ClickHouse/pull/53220) ([Val Doroshchuk](https://github.com/valbok)).
* 修复较少使用的 `EmbeddedRocksDB` 表引擎在极罕见场景中的隐蔽问题：执行 `DROP TABLE` 后，`EmbeddedRocksDB` 表引擎有时未正确关闭 NFS 上的文件。 [#53502](https://github.com/ClickHouse/ClickHouse/pull/53502) ([Mingliang Pan](https://github.com/liangliangpan)).
* `RESTORE TABLE ON CLUSTER` 必须在各主机上创建 UUID 匹配的复制表，否则恢复后 ZooKeeper 路径中的 `{uuid}` 宏无法正确工作。此 PR 实现该要求。 [#53765](https://github.com/ClickHouse/ClickHouse/pull/53765) ([Vitaly Baranov](https://github.com/vitlibar)).
* 新增恢复设置 `restore_broken_parts_as_detached`。为 true 时，RESTORE 遇到损坏数据片段不会停止，而是将所有损坏片段复制到 `detached` 目录，并添加 \`broken-from-backup' 前缀；为 false 时，遇到首个损坏片段即停止。默认 false。 [#53877](https://github.com/ClickHouse/ClickHouse/pull/53877) ([Vitaly Baranov](https://github.com/vitlibar)).
* 为 HTTP 响应头 X-ClickHouse-Progress 和 X-ClickHouse-Summary 新增 `elapsed_ns` 字段。 [#54179](https://github.com/ClickHouse/ClickHouse/pull/54179) ([joelynch](https://github.com/joelynch)).
* 为 keeper-client 实现 `reconfig`（[https://github.com/ClickHouse/ClickHouse/pull/49450](https://github.com/ClickHouse/ClickHouse/pull/49450)）、`sync` 和 `exists` 命令。 [#54201](https://github.com/ClickHouse/ClickHouse/pull/54201) ([pufit](https://github.com/pufit)).
* `clickhouse-local` 和 `clickhouse-client` 现在允许多次指定 `--query`，例如 `./clickhouse-client --query "SELECT 1" --query "SELECT 2"`。这比 `./clickhouse-client --multiquery "SELECT  1;S ELECT 2"` 稍直观，更便于脚本生成（例如 `queries.push_back('--query "$q"')`），也更符合已有 `--queries-file` 参数的行为，例如 `./clickhouse client --queries-file queries1.sql --queries-file queries2.sql`。 [#54249](https://github.com/ClickHouse/ClickHouse/pull/54249) ([Robert Schulze](https://github.com/rschu1ze)).
* 为 `formatReadableTimeDelta` 新增亚秒级精度。 [#54250](https://github.com/ClickHouse/ClickHouse/pull/54250) ([Andrey Zvonov](https://github.com/zvonand)).
* 默认启用 `allow_remove_stale_moving_parts`。 [#54260](https://github.com/ClickHouse/ClickHouse/pull/54260) ([vdimir](https://github.com/vdimir)).
* 修复使用缓存计数的行为，并改进从归档读取时的进度条。 [#54271](https://github.com/ClickHouse/ClickHouse/pull/54271) ([Kruglov Pavel](https://github.com/Avogar)).
* 支持使用 SSO 的 S3 凭据。通过 `AWS_PROFILE` 环境变量指定要用于 SSO 的配置档。 [#54347](https://github.com/ClickHouse/ClickHouse/pull/54347) ([Antonio Andelic](https://github.com/antonio2368)).
* 输入格式支持将 NULL 作为 Array/Tuple/Map 嵌套类型的默认值。关闭 [#51100](https://github.com/ClickHouse/ClickHouse/issues/51100)。 [#54351](https://github.com/ClickHouse/ClickHouse/pull/54351) ([Kruglov Pavel](https://github.com/Avogar)).
* 允许读取 Arrow/Parquet 格式中一些不常见的数据块配置。 [#54370](https://github.com/ClickHouse/ClickHouse/pull/54370) ([Arthur Passos](https://github.com/arthurpassos)).
* 为 `stddevPop` 新增 `STD` 别名，以兼容 MySQL。关闭 [#54274](https://github.com/ClickHouse/ClickHouse/issues/54274)。 [#54382](https://github.com/ClickHouse/ClickHouse/pull/54382) ([Nikolay Degterinsky](https://github.com/evillique)).
* 新增兼容 MySQL 的 `addDate` 函数，并为一致性新增 `subDate`。参见 [#54275](https://github.com/ClickHouse/ClickHouse/issues/54275)。 [#54400](https://github.com/ClickHouse/ClickHouse/pull/54400) ([Nikolay Degterinsky](https://github.com/evillique)).
* 为 `system.detached_parts` 新增 `modification_time`。 [#54506](https://github.com/ClickHouse/ClickHouse/pull/54506) ([Azat Khuzhin](https://github.com/azat)).
* 新增 `splitby_max_substrings_includes_remaining_string` 设置，控制 “splitBy\*()” 函数在 “max\_substring” > 0 时，是否将剩余字符串（若存在）放入结果数组，即 Python/Spark 语义。默认行为不变。 [#54518](https://github.com/ClickHouse/ClickHouse/pull/54518) ([Robert Schulze](https://github.com/rschu1ze)).
* 改进 `Int64`/`UInt64` 字段的整数类型推断，延续 [#53003](https://github.com/ClickHouse/ClickHouse/pull/53003)。现在也适用于数组的数组等嵌套类型，以及 `map/tuple` 等函数。问题：[#51236](https://github.com/ClickHouse/ClickHouse/issues/51236)。 [#54553](https://github.com/ClickHouse/ClickHouse/pull/54553) ([Kruglov Pavel](https://github.com/Avogar)).
* 新增数组与标量的乘法、除法和取模运算，支持两种操作数顺序，例如 `5 * [5, 5]` 和 `[5, 5] * 5` 都可以。 [#54608](https://github.com/ClickHouse/ClickHouse/pull/54608) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 为 `keeper-client` 的 `rm` 命令新增可选 `version` 参数，以支持更安全的删除。 [#54708](https://github.com/ClickHouse/ClickHouse/pull/54708) ([János Benjamin Antal](https://github.com/antaljanosbenjamin)).
* 禁止 systemd 强制终止服务器，因为使用 Buffer 表时这可能导致数据丢失。 [#54744](https://github.com/ClickHouse/ClickHouse/pull/54744) ([Azat Khuzhin](https://github.com/azat)).
* 为系统表 `system.functions` 新增 `is_deterministic` 字段，表示在输入完全相同时，函数两次调用的结果是否稳定。[#54766](https://github.com/ClickHouse/ClickHouse/pull/54766) [#55035](https://github.com/ClickHouse/ClickHouse/pull/55035) ([Robert Schulze](https://github.com/rschu1ze)).
* 修改并扩展 `information_schema` 中的视图，提高与 MySQL 对应视图的兼容性，使 Tableau Online 能连接 ClickHouse。具体包括：1. 将 `information_schema.tables.table_type` 的类型从 Enum8 改为 String。2. 为 `information_schema.table` 新增 `table_comment` 和 `table_collation` 字段。3. 新增 `information_schema.key_column_usage` 和 `referential_constraints` 视图。4. 将 `information_schema` 视图中的大写别名替换为实际大写列。 [#54773](https://github.com/ClickHouse/ClickHouse/pull/54773) ([Serge Klochkov](https://github.com/slvrtrn)).
* 尝试缓存包含 `now`、`randomString`、`dictGet` 等非确定性函数的查询结果时，查询缓存现在返回错误。相比此前静默不缓存结果的行为，这可减少困惑和意外。 [#54801](https://github.com/ClickHouse/ClickHouse/pull/54801) ([Robert Schulze](https://github.com/rschu1ze)).
* 禁止 `file`/`s3`/`url` 等存储使用 materialized/ephemeral/alias 特殊列，并修复从文件向 ephemeral 列插入的问题。关闭 [#53477](https://github.com/ClickHouse/ClickHouse/issues/53477)。 [#54803](https://github.com/ClickHouse/ClickHouse/pull/54803) ([Kruglov Pavel](https://github.com/Avogar)).
* 使备份元数据收集更可配置。 [#54804](https://github.com/ClickHouse/ClickHouse/pull/54804) ([Vitaly Baranov](https://github.com/vitlibar)).
* `clickhouse-local` 的日志文件（通过 --server\_logs\_file 启用）现在像 `clickhouse-server` 一样，为每行添加时间戳、线程 ID 等前缀。 [#54807](https://github.com/ClickHouse/ClickHouse/pull/54807) ([Michael Kolupaev](https://github.com/al13n321)).
* 对于已废弃的 MergeTree 设置，`system.merge_tree_settings` 中的 `is_obsolete` 字段现在为 1；此前仅在描述中说明废弃状态。 [#54837](https://github.com/ClickHouse/ClickHouse/pull/54837) ([Robert Schulze](https://github.com/rschu1ze)).
* 允许时间间隔字面量使用复数形式，`INTERVAL 2 HOURS` 等价于 `INTERVAL 2 HOUR`。 [#54860](https://github.com/ClickHouse/ClickHouse/pull/54860) ([Jordi Villar](https://github.com/jrdi)).
* 始终允许创建具有 `Nullable` 主键的投影。修复 [#54814](https://github.com/ClickHouse/ClickHouse/issues/54814)。 [#54895](https://github.com/ClickHouse/ClickHouse/pull/54895) ([Amos Bird](https://github.com/amosbird)).
* 连接被重置后重试备份的 S3 操作。 [#54900](https://github.com/ClickHouse/ClickHouse/pull/54900) ([Vitaly Baranov](https://github.com/vitlibar)).
* 设置最大值小于最小值时，提供准确的异常消息。 [#54925](https://github.com/ClickHouse/ClickHouse/pull/54925) ([János Benjamin Antal](https://github.com/antaljanosbenjamin)).
* `LIKE`、`match` 等正则表达式匹配函数现在通过退回二进制匹配，支持包含非 UTF-8 子串的模式。例如可使用 `string LIKE '\xFE\xFF%'` 检测 BOM。关闭 [#54486](https://github.com/ClickHouse/ClickHouse/issues/54486)。 [#54942](https://github.com/ClickHouse/ClickHouse/pull/54942) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 新增 `ContextLockWaitMicroseconds` 性能事件。 [#55029](https://github.com/ClickHouse/ClickHouse/pull/55029) ([Maksim Kita](https://github.com/kitaisreal)).
* Keeper 动态调整日志级别。 [#50372](https://github.com/ClickHouse/ClickHouse/pull/50372) ([helifu](https://github.com/helifu)).
* 新增 `timestamp` 函数，以兼容 MySQL。关闭 [#54275](https://github.com/ClickHouse/ClickHouse/issues/54275)。 [#54639](https://github.com/ClickHouse/ClickHouse/pull/54639) ([Nikolay Degterinsky](https://github.com/evillique)).

<h4 id="buildtestingpackaging-improvement-3">
  构建、测试与打包改进
</h4>

* 将 ClickHouse 官方及 CI 构建的编译器从 Clang 16 升级到 17。 [#53831](https://github.com/ClickHouse/ClickHouse/pull/53831) ([Robert Schulze](https://github.com/rschu1ze)).
* 重新生成用于查找的顶级域名数据 `tldLookup.generated.cpp`。 [#54269](https://github.com/ClickHouse/ClickHouse/pull/54269) ([Bharat Nallan](https://github.com/bharatnc)).
* 移除冗余的 `clickhouse-keeper-client` 符号链接。 [#54587](https://github.com/ClickHouse/ClickHouse/pull/54587) ([Tomas Barton](https://github.com/deric)).
* 使用 `/usr/bin/env` 解析 bash，现支持 Nix OS。 [#54603](https://github.com/ClickHouse/ClickHouse/pull/54603) ([Fionera](https://github.com/fionera)).
* CMake 新增 `PROFILE_CPU` 选项，用于在不采用 DWARF 调用图的情况下执行 `perf record`。 [#54917](https://github.com/ClickHouse/ClickHouse/pull/54917) ([Maksim Kita](https://github.com/kitaisreal)).
* 链接器不是 LLD 时，以致命错误停止。 [#55036](https://github.com/ClickHouse/ClickHouse/pull/55036) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 将 base64 编解码库从 Turbo-Base64 替换为 aklomp-base64。二者在 x86 和 ARM 上均使用 SIMD 加速，但：1. 后者的 BSD-2 许可证更适合 ClickHouse，而 Turbo64 已转为 GPL-3；2. aklomp-base64 的 GitHub 星标更多，看起来更有持续发展前景；3. 其 API 稍好用，尽管这一点较主观；4. 无需为非线程安全初始化等缺陷编写绕行代码。注意：aklomp-base64 拒绝无填充的 base64 值，而 Turbo-Base64 尽力解码。RFC-4648 未规定填充是否必须，但在某些场景下，这可能是需要注意的行为变更。 [#54119](https://github.com/ClickHouse/ClickHouse/pull/54119) ([Mikhail Koviazin](https://github.com/mkmkme)).

<h4 id="bug-fix-user-visible-misbehavior-in-an-official-stable-release-3">
  缺陷修复（正式稳定版本中用户可见的异常行为）
</h4>

* 修复零复制机制下的 REPLACE/MOVE PARTITION。注意，零复制机制为实验性功能。 [#54193](https://github.com/ClickHouse/ClickHouse/pull/54193) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 修复硬链接下的零复制锁。注意，零复制机制为实验性功能。 [#54859](https://github.com/ClickHouse/ClickHouse/pull/54859) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 修复零复制机制中的垃圾数据。注意，零复制机制为实验性功能。 [#54550](https://github.com/ClickHouse/ClickHouse/pull/54550) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 将 HTTP 重试超时按毫秒传递，此前单位不正确。 [#54438](https://github.com/ClickHouse/ClickHouse/pull/54438) ([Duc Canh Le](https://github.com/canhld94)).
* 修复 OUTFILE 使用 `CapnProto`/`Protobuf` 时具有误导性的错误消息。 [#52870](https://github.com/ClickHouse/ClickHouse/pull/52870) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复并行副本与 LIMIT 组合使用时的汇总报告。 [#53050](https://github.com/ClickHouse/ClickHouse/pull/53050) ([Raúl Marín](https://github.com/Algunenano)).
* 修复从/向 S3 备份时未采用原生复制的限速，以及其他一些位置的限速。 [#53336](https://github.com/ClickHouse/ClickHouse/pull/53336) ([Azat Khuzhin](https://github.com/azat)).
* 修复复制整个目录时的 IO 限速。 [#53338](https://github.com/ClickHouse/ClickHouse/pull/53338) ([Azat Khuzhin](https://github.com/azat)).
* 修复移到 PREWHERE 的条件操作可能丢失列的问题。 [#53492](https://github.com/ClickHouse/ClickHouse/pull/53492) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* 修复用字节完全相同的数据片段进行替换时的内部错误。 [#53735](https://github.com/ClickHouse/ClickHouse/pull/53735) ([Pedro Riera](https://github.com/priera)).
* 修复对参与插值表达式的列的需求声明。 [#53754](https://github.com/ClickHouse/ClickHouse/pull/53754) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* 修复集群发现初始化，以及在配置中设置故障注入点。 [#54113](https://github.com/ClickHouse/ClickHouse/pull/54113) ([vdimir](https://github.com/vdimir)).
* 修复 `accurateCastOrNull` 中的问题。 [#54136](https://github.com/ClickHouse/ClickHouse/pull/54136) ([Salvatore Mesoraca](https://github.com/aiven-sal)).
* 修复可空主键与 FINAL 修饰符的组合使用。 [#54164](https://github.com/ClickHouse/ClickHouse/pull/54164) ([Amos Bird](https://github.com/amosbird)).
* 修复存在重复数据时，向复制物化视图插入新数据被阻止的错误。 [#54184](https://github.com/ClickHouse/ClickHouse/pull/54184) ([Pedro Riera](https://github.com/priera)).
* 允许布隆过滤器使用 `IPv6`。 [#54200](https://github.com/ClickHouse/ClickHouse/pull/54200) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* 修复 `IPv4` 可能出现的类型不匹配。 [#54212](https://github.com/ClickHouse/ClickHouse/pull/54212) ([Bharat Nallan](https://github.com/bharatnc)).
* 修复重新创建索引后的 `system.data_skipping_indices`。 [#54225](https://github.com/ClickHouse/ClickHouse/pull/54225) ([Artur Malchanau](https://github.com/Hexta)).
* 修复多连接重写器 v2 的名称冲突。 [#54240](https://github.com/ClickHouse/ClickHouse/pull/54240) ([Tao Wang](https://github.com/wangtZJU)).
* 修复连接后 `system.errors` 中的非预期错误。 [#54306](https://github.com/ClickHouse/ClickHouse/pull/54306) ([vdimir](https://github.com/vdimir)).
* 修复 `isZeroOrNull(NULL)`。 [#54316](https://github.com/ClickHouse/ClickHouse/pull/54316) ([flynn](https://github.com/ucasfl)).
* 修复 `prefer_localhost_replica` = 1 时通过 Distributed 表使用并行副本。 [#54334](https://github.com/ClickHouse/ClickHouse/pull/54334) ([Igor Nikonov](https://github.com/devcrafter)).
* 修复纵向合并、ReplacingMergeTree 与 OPTIMIZE CLEANUP 组合使用时的逻辑错误。 [#54368](https://github.com/ClickHouse/ClickHouse/pull/54368) ([alesapin](https://github.com/alesapin)).
* 修复 `s3` 表函数中可能出现的 `URI contains invalid characters` 错误。 [#54373](https://github.com/ClickHouse/ClickHouse/pull/54373) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复 `arrayExists` 函数 AST 优化中的段错误。 [#54379](https://github.com/ClickHouse/ClickHouse/pull/54379) ([Nikolay Degterinsky](https://github.com/evillique)).
* 在 `analysisOfVariance` 函数执行加法前检查溢出。 [#54385](https://github.com/ClickHouse/ClickHouse/pull/54385) ([Antonio Andelic](https://github.com/antonio2368)).
* 复现并修复 removeSharedRecursive 中的缺陷。 [#54430](https://github.com/ClickHouse/ClickHouse/pull/54430) ([Sema Checherinda](https://github.com/CheSema)).
* 修复 SimpleAggregateFunction 在 PREWHERE 和 FINAL 中可能产生错误结果的问题。 [#54436](https://github.com/ClickHouse/ClickHouse/pull/54436) ([Azat Khuzhin](https://github.com/azat)).
* 修复未使用分析器时通过 indexHint 过滤数据片段。 [#54449](https://github.com/ClickHouse/ClickHouse/pull/54449) ([Azat Khuzhin](https://github.com/azat)).
* 修复具有规范化状态的聚合投影。 [#54480](https://github.com/ClickHouse/ClickHouse/pull/54480) ([Amos Bird](https://github.com/amosbird)).
* `clickhouse-local`：对 multiquery 参数进行改进。 [#54498](https://github.com/ClickHouse/ClickHouse/pull/54498) ([CuiShuoGuo](https://github.com/bakam412)).
* `clickhouse-local` 支持 `--database` 命令行参数。 [#54503](https://github.com/ClickHouse/ClickHouse/pull/54503) ([vdimir](https://github.com/vdimir)).
* 修复禁用 `input_format_with_names_use_header` 时，`-WithNames` 格式可能出现的解析错误。 [#54513](https://github.com/ClickHouse/ClickHouse/pull/54513) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复罕见的 CHECKSUM\_DOESNT\_MATCH 错误。 [#54549](https://github.com/ClickHouse/ClickHouse/pull/54549) ([alesapin](https://github.com/alesapin)).
* 修复对已排序结果执行 UNION ALL 后的排序。 [#54564](https://github.com/ClickHouse/ClickHouse/pull/54564) ([Vitaly Baranov](https://github.com/vitlibar)).
* 修复 Keeper 快照安装。 [#54572](https://github.com/ClickHouse/ClickHouse/pull/54572) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复 `ColumnUnique` 中的竞态条件。 [#54575](https://github.com/ClickHouse/ClickHouse/pull/54575) ([Nikita Taranov](https://github.com/nickitat)).
* Annoy/Usearch 索引：修复使用默认值构建时的 LOGICAL\_ERROR。 [#54600](https://github.com/ClickHouse/ClickHouse/pull/54600) ([Robert Schulze](https://github.com/rschu1ze)).
* 修复 `ColumnDecimal` 的序列化。 [#54601](https://github.com/ClickHouse/ClickHouse/pull/54601) ([Nikita Taranov](https://github.com/nickitat)).
* 修复 \*Cluster 函数对包含空格列名的结构推断。 [#54635](https://github.com/ClickHouse/ClickHouse/pull/54635) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复存在默认值及显式插入列时，使用目标插入表结构的问题。 [#54655](https://github.com/ClickHouse/ClickHouse/pull/54655) ([Kruglov Pavel](https://github.com/Avogar)).
* 避免将可能包含交替分支的正则表达式匹配用作键条件。 [#54696](https://github.com/ClickHouse/ClickHouse/pull/54696) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* 修复 ReplacingMergeTree 的纵向合并与清理。 [#54706](https://github.com/ClickHouse/ClickHouse/pull/54706) ([SmitaRKulkarni](https://github.com/SmitaRKulkarni)).
* 修复 ORDER BY 后虚拟列值不正确的问题。 [#54811](https://github.com/ClickHouse/ClickHouse/pull/54811) ([Michael Kolupaev](https://github.com/al13n321)).
* 修复未使用分析器时通过 indexHint 过滤数据片段。[#54825](https://github.com/ClickHouse/ClickHouse/pull/54825) [#54449](https://github.com/ClickHouse/ClickHouse/pull/54449) ([Azat Khuzhin](https://github.com/azat)).
* 修复 Keeper 关闭时的段错误。 [#54841](https://github.com/ClickHouse/ClickHouse/pull/54841) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复 MaterializedPostgreSQL 中的 `Invalid number of rows in Chunk`。 [#54844](https://github.com/ClickHouse/ClickHouse/pull/54844) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 将已废弃格式设置移到独立章节。 [#54855](https://github.com/ClickHouse/ClickHouse/pull/54855) ([Kruglov Pavel](https://github.com/Avogar)).
* 分区键修改时重建 `minmax_count_projection`。 [#54943](https://github.com/ClickHouse/ClickHouse/pull/54943) ([Amos Bird](https://github.com/amosbird)).
* 修复 `if` 函数中错误转换为 `ColumnVector<Int128>` 的问题。 [#55019](https://github.com/ClickHouse/ClickHouse/pull/55019) ([Kruglov Pavel](https://github.com/Avogar)).
* 禁止从投影或索引不同的表挂载数据片段。 [#55062](https://github.com/ClickHouse/ClickHouse/pull/55062) ([János Benjamin Antal](https://github.com/antaljanosbenjamin)).
* 子查询结果为空时，在标量结果映射中存储 NULL。 [#52240](https://github.com/ClickHouse/ClickHouse/pull/52240) ([vdimir](https://github.com/vdimir)).
* 修复 `FINAL` 在罕见情况下生成无效读取范围的问题。 [#54934](https://github.com/ClickHouse/ClickHouse/pull/54934) ([Nikita Taranov](https://github.com/nickitat)).
* 修复没有 Keeper 重试时的插入仲裁。 [#55026](https://github.com/ClickHouse/ClickHouse/pull/55026) ([Igor Nikonov](https://github.com/devcrafter)).
* 修复可空类型的简单聚合状态。 [#55030](https://github.com/ClickHouse/ClickHouse/pull/55030) ([Pedro Riera](https://github.com/priera)).
