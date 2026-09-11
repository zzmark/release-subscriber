<h3 id="a-id241a-clickhouse-release-241-2024-01-30">
  <a id="241" /> ClickHouse 24.1 版本, 2024-01-30. [演示文稿](https://presentations.clickhouse.com/2024-release-24.1/), [视频](https://www.youtube.com/watch?v=pBF9g0wGAGs)
</h3>

<Frame>
  <iframe src="https://www.youtube.com/embed/pBF9g0wGAGs" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
</Frame>

<h4 id="backward-incompatible-change-9">
  向后不兼容变更
</h4>

* 默认启用设置 `print_pretty_type_names`。可将其关闭以保留旧行为，或执行 `SET compatibility = '23.12'`。 [#57726](https://github.com/ClickHouse/ClickHouse/pull/57726) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 废弃 MergeTree 设置 `clean_deleted_rows`，该设置不再生效。默认不允许在 `OPTIMIZE` 中使用 `CLEANUP` 关键字（除非启用 `allow_experimental_replacing_merge_with_cleanup`）。 [#58316](https://github.com/ClickHouse/ClickHouse/pull/58316) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 不再提供函数 `reverseDNSQuery`。关闭 [#58368](https://github.com/ClickHouse/ClickHouse/issues/58368)。 [#58369](https://github.com/ClickHouse/ClickHouse/pull/58369) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 启用配置文件中用于改进访问控制的多项变更。这些变更会影响行为，请检查 `config.xml` 中的 `access_control_improvements` 节。如果不确定，请将配置文件中的值保持为上一版本的值。 [#58584](https://github.com/ClickHouse/ClickHouse/pull/58584) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 改进 `sumMapFiltered` 对 NaN 值的处理。NaN 值现在放在末尾（而非随机位置），并视为与任何值均不相同。`-0` 现在也视为等于 `0`；由于会丢弃 0 值，因此也会丢弃 `-0` 值。 [#58959](https://github.com/ClickHouse/ClickHouse/pull/58959) ([Raúl Marín](https://github.com/Algunenano)).
* 函数 `visibleWidth` 的行为将与文档一致。此前它像 `lengthUTF8` 一样，只统计字符串序列化后的码点数，没有考虑零宽字符、组合字符、全角字符、制表符和删除字符。现在已相应更改行为。若要保留旧行为，请将 `function_visible_width_behavior` 设为 `0`，或将 `compatibility` 设为 `23.12` 或更早版本。 [#59022](https://github.com/ClickHouse/ClickHouse/pull/59022) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 暂时禁用 `Kusto` 方言，直到修复这两个缺陷：[#59037](https://github.com/ClickHouse/ClickHouse/issues/59037) 和 [#59036](https://github.com/ClickHouse/ClickHouse/issues/59036)。 [#59305](https://github.com/ClickHouse/ClickHouse/pull/59305) ([Alexey Milovidov](https://github.com/alexey-milovidov)). 任何使用 `Kusto` 的尝试都会引发异常。
* `FINAL` 修饰符采用了更高效的实现，即使 `max_threads = 1` 也不再保证保序。若依赖此前行为，请将 `enable_vertical_final` 设为 0，或将 `compatibility` 设为 `23.12`。

<h4 id="new-feature-11">
  新功能
</h4>

* 实现表示其他数据类型联合的 Variant 数据类型。`Variant(T1, T2, ..., TN)` 表示该类型每行的值可以属于 `T1`、`T2`、……、`TN` 中的一种，也可以不属于其中任何类型（即 `NULL` 值）。通过设置 `allow_experimental_variant_type` 可启用 Variant 类型。参考：[#54864](https://github.com/ClickHouse/ClickHouse/issues/54864)。 [#58047](https://github.com/ClickHouse/ClickHouse/pull/58047) ([Kruglov Pavel](https://github.com/Avogar)).
* 现在可在列级别指定部分设置（目前为 `min_compress_block_size` 和 `max_compress_block_size`），其优先级高于相应表级设置。例如：`CREATE TABLE tab (col String SETTINGS (min_compress_block_size = 81920, max_compress_block_size = 163840)) ENGINE = MergeTree ORDER BY tuple();`。 [#55201](https://github.com/ClickHouse/ClickHouse/pull/55201) ([Duc Canh Le](https://github.com/canhld94)).
* 新增聚合函数 `quantileDD` 及相应的 `quantilesDD` 和 `medianDD`，基于 DDSketch [https://www.vldb.org/pvldb/vol12/p2195-masson.pdf](https://www.vldb.org/pvldb/vol12/p2195-masson.pdf)。### 面向用户变更的文档条目。 [#56342](https://github.com/ClickHouse/ClickHouse/pull/56342) ([Srikanth Chekuri](https://github.com/srikanthccv)).
* 允许为任意类型的对象存储配置任意类型的元数据。 [#58357](https://github.com/ClickHouse/ClickHouse/pull/58357) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 为 `distributed_ddl_output_mode` 新增 `null_status_on_timeout_only_active` 和 `throw_only_active` 模式，以免等待非活跃副本。 [#58350](https://github.com/ClickHouse/ClickHouse/pull/58350) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 新增计算子数组的函数 `arrayShingles`，例如 `arrayShingles([1, 2, 3, 4, 5], 3)` 返回 `[[1,2,3],[2,3,4],[3,4,5]]`。 [#58396](https://github.com/ClickHouse/ClickHouse/pull/58396) ([Zheng Miao](https://github.com/zenmiao7)).
* 新增函数 `punycodeEncode`、`punycodeDecode`、`idnaEncode` 和 `idnaDecode`，用于按照 IDNA 标准将国际化域名转换为 ASCII 表示形式。 [#58454](https://github.com/ClickHouse/ClickHouse/pull/58454) ([Robert Schulze](https://github.com/rschu1ze)).
* 新增字符串相似度函数 `dramerauLevenshteinDistance`、`jaroSimilarity` 和 `jaroWinklerSimilarity`。 [#58531](https://github.com/ClickHouse/ClickHouse/pull/58531) ([Robert Schulze](https://github.com/rschu1ze)).
* 新增两项设置：`output_format_compression_level` 用于更改输出压缩级别；当输出压缩方法为 `zstd` 时，`output_format_compression_zstd_window_log` 用于显式设置压缩窗口大小并启用 zstd 远距离匹配模式。适用于 `INTO OUTFILE`，以及写入 `file`、`url`、`hdfs`、`s3` 和 `azureBlobStorage` 表函数。 [#58539](https://github.com/ClickHouse/ClickHouse/pull/58539) ([Duc Canh Le](https://github.com/canhld94)).
* 当输出目标不是终端时，自动禁用 Pretty 格式中的 ANSI 转义序列。为设置 `output_format_pretty_color` 新增 `auto` 模式。 [#58614](https://github.com/ClickHouse/ClickHouse/pull/58614) ([Shaun Struwig](https://github.com/Blargian)).
* 新增用于解码 [Sqids](https://sqids.org/) 的函数 `sqidDecode`。 [#58544](https://github.com/ClickHouse/ClickHouse/pull/58544) ([Robert Schulze](https://github.com/rschu1ze)).
* 允许 JSON 输入格式将 Bool 值读入 String。通过默认启用的设置 `input_format_json_read_bools_as_strings` 控制。 [#58561](https://github.com/ClickHouse/ClickHouse/pull/58561) ([Kruglov Pavel](https://github.com/Avogar)).
* 新增函数 `seriesDecomposeSTL`，将时间序列分解为季节分量、趋势分量和残差分量。 [#57078](https://github.com/ClickHouse/ClickHouse/pull/57078) ([Bhavna Jindal](https://github.com/bhavnajindal)).
* 为 MaterializedMySQL 引入 MySQL Binlog Client：多个数据库共用一个 binlog 连接。 [#57323](https://github.com/ClickHouse/ClickHouse/pull/57323) ([Val Doroshchuk](https://github.com/valbok)).
* Intel QuickAssist Technology（QAT）提供硬件加速的压缩与密码运算能力。ClickHouse 新增压缩编解码器 `ZSTD_QAT`，使用 QAT 进行 zstd 压缩。该编解码器使用 [Intel 的 QATlib](https://github.com/intel/qatlib) 和 [Intel 的 QAT ZSTD 插件](https://github.com/intel/QAT-ZSTD-Plugin)。目前仅压缩支持硬件加速（若 QAT 无法初始化，则回退到软件实现），解压缩始终由软件执行。 [#57509](https://github.com/ClickHouse/ClickHouse/pull/57509) ([jasperzhu](https://github.com/jinjunzh)).
* 实现为 s3 磁盘生成对象存储键的新方式。现在可通过磁盘描述中的 `key_template` 选项，以 `re2` 正则表达式语法定义格式。 [#57663](https://github.com/ClickHouse/ClickHouse/pull/57663) ([Sema Checherinda](https://github.com/CheSema)).
* 表 system.dropped\_tables\_parts 包含 system.dropped\_tables 中各表的数据片段（已删除但尚未从存储中清除的表）。 [#58038](https://github.com/ClickHouse/ClickHouse/pull/58038) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* 新增设置 `max_materialized_views_size_for_table`，限制附加到一张表的物化视图数量。 [#58068](https://github.com/ClickHouse/ClickHouse/pull/58068) ([zhongyuankai](https://github.com/zhongyuankai)).
* `clickhouse-format` 改进：支持带 `VALUES` 的 INSERT 查询；支持注释（使用 `--comments` 输出）；支持 `--max_line_length` 选项，仅将较长查询格式化为多行。 [#58246](https://github.com/ClickHouse/ClickHouse/pull/58246) ([vdimir](https://github.com/vdimir)).
* 在 `clickhouse-local` 中附加所有系统表，包括 `system.parts`。关闭 [#58312](https://github.com/ClickHouse/ClickHouse/issues/58312)。 [#58359](https://github.com/ClickHouse/ClickHouse/pull/58359) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 函数 `transform` 支持 `Enum` 数据类型。关闭 [#58241](https://github.com/ClickHouse/ClickHouse/issues/58241)。 [#58360](https://github.com/ClickHouse/ClickHouse/pull/58360) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 新增表 `system.database_engines`。 [#58390](https://github.com/ClickHouse/ClickHouse/pull/58390) ([Bharat Nallan](https://github.com/bharatnc)). 允许在代码库中独立注册数据库引擎。 [#58365](https://github.com/ClickHouse/ClickHouse/pull/58365) ([Bharat Nallan](https://github.com/bharatnc)). 允许独立注册解释器。 [#58443](https://github.com/ClickHouse/ClickHouse/pull/58443) ([Bharat Nallan](https://github.com/bharatnc)).
* 为 `SYSTEM SYNC REPLICA LIGHTWEIGHT` 查询新增 `FROM <Replicas>` 修饰符。使用 `FROM` 后，只等待指定源副本，以及不在 zookeeper 中或 source\_replica 为空的副本的抓取与范围删除操作。 [#58393](https://github.com/ClickHouse/ClickHouse/pull/58393) ([Jayme Bird](https://github.com/jaymebrd)).
* 新增设置 `update_insert_deduplication_token_in_dependent_materialized_views`，允许在向依赖的物化视图插入数据时，使用表标识符更新插入去重令牌。关闭 [#59165](https://github.com/ClickHouse/ClickHouse/issues/59165)。 [#59238](https://github.com/ClickHouse/ClickHouse/pull/59238) ([Maksim Kita](https://github.com/kitaisreal)).
* 新增更新异步指标的语句 `SYSTEM RELOAD ASYNCHRONOUS METRICS`，主要用于测试和开发。 [#53710](https://github.com/ClickHouse/ClickHouse/pull/53710) ([Robert Schulze](https://github.com/rschu1ze)).

<h4 id="performance-improvement-11">
  性能改进
</h4>

* 重写并行副本的协调机制，以提升并行度和缓存局部性。已验证在数百个副本上具有线性扩展能力，同时支持按顺序读取。 [#57968](https://github.com/ClickHouse/ClickHouse/pull/57968) ([Nikita Taranov](https://github.com/nickitat)).
* 将 HTTP 出站缓冲机制替换为 ClickHouse 原生缓冲区。为接口新增字节计数指标。 [#56064](https://github.com/ClickHouse/ClickHouse/pull/56064) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* 在分布式查询中并行合并 `uniqExact` 的大型聚合状态。 [#59009](https://github.com/ClickHouse/ClickHouse/pull/59009) ([Nikita Taranov](https://github.com/nickitat)).
* 降低从 `MergeTree` 表读取后的内存占用。 [#59290](https://github.com/ClickHouse/ClickHouse/pull/59290) ([Anton Popov](https://github.com/CurtizJ)).
* 降低纵向合并的内存占用。 [#59340](https://github.com/ClickHouse/ClickHouse/pull/59340) ([Anton Popov](https://github.com/CurtizJ)).
* 在更多场景下避免 Keeper 启动时消耗大量内存。 [#58455](https://github.com/ClickHouse/ClickHouse/pull/58455) ([Antonio Andelic](https://github.com/antonio2368)).
* Keeper 改进：降低存储节点的内存占用。 [#59002](https://github.com/ClickHouse/ClickHouse/pull/59002) ([Antonio Andelic](https://github.com/antonio2368)).
* 采用对缓存更友好的 final 实现。行为变更注意事项：此前，以单个流读取的带 `FINAL` 修饰符查询（例如 `max_threads = 1`）即使未显式提供 `ORDER BY` 子句，也会输出已排序结果。当 `enable_vertical_final = true` 时（默认即如此），不再保证这一点。 [#54366](https://github.com/ClickHouse/ClickHouse/pull/54366) ([Duc Canh Le](https://github.com/canhld94)).
* 避免 `ReadBufferFromIStream` 中的额外复制；该类用于从 S3 等来源读取数据。 [#56961](https://github.com/ClickHouse/ClickHouse/pull/56961) ([Nikita Taranov](https://github.com/nickitat)).
* 优化输入为 Array(Map)/Array(Array(Num)/Array(Array(String))/Array(BigInt)/Array(Decimal) 时的数组元素函数。此前实现进行了不必要的分配。本次优化最高可提速约 \~6 倍，尤其是在输入类型为 Array(Map) 时。 [#56403](https://github.com/ClickHouse/ClickHouse/pull/56403) ([李扬](https://github.com/taiyang-li)).
* 从 compact 数据片段中读取同一列的多个子列时，仅读取该列一次。 [#57631](https://github.com/ClickHouse/ClickHouse/pull/57631) ([Kruglov Pavel](https://github.com/Avogar)).
* 重写 `sum(column + constant)` 函数的 AST。这作为 Analyzer 的一项优化处理提供。 [#57853](https://github.com/ClickHouse/ClickHouse/pull/57853) ([Jiebin Sun](https://github.com/jiebinn)).
* 函数 `match` 的求值现在可利用跳数索引 `ngrambf_v1` 和 `tokenbf_v1`。 [#57882](https://github.com/ClickHouse/ClickHouse/pull/57882) ([凌涛](https://github.com/lingtaolf)).
* 函数 `match` 的求值现在可利用倒排索引。 [#58284](https://github.com/ClickHouse/ClickHouse/pull/58284) ([凌涛](https://github.com/lingtaolf)).
* MergeTree `FINAL` 不再比较同一非 L0 数据片段中的行。 [#58142](https://github.com/ClickHouse/ClickHouse/pull/58142) ([Duc Canh Le](https://github.com/canhld94)).
* 加速 iota 调用（用连续数字填充数组）。 [#58271](https://github.com/ClickHouse/ClickHouse/pull/58271) ([Raúl Marín](https://github.com/Algunenano)).
* 加速非数值类型的 MIN/MAX。 [#58334](https://github.com/ClickHouse/ClickHouse/pull/58334) ([Raúl Marín](https://github.com/Algunenano)).
* 使用 BMI2/SSE 内建函数优化过滤器组合（例如多阶段 PREWHERE 中的组合）。 [#58800](https://github.com/ClickHouse/ClickHouse/pull/58800) ([Zhiguo Zhou](https://github.com/ZhiguoZh)).
* `clickhouse-local` 少使用一个线程。 [#58968](https://github.com/ClickHouse/ClickHouse/pull/58968) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 提升类型为 Nullable 时 `multiIf` 函数的性能。 [#57745](https://github.com/ClickHouse/ClickHouse/pull/57745) ([KevinyhZou](https://github.com/KevinyhZou)).
* 新增 `SYSTEM JEMALLOC PURGE`，用于清理未使用的 jemalloc 页面；新增 `SYSTEM JEMALLOC [ ENABLE | DISABLE | FLUSH ] PROFILE`，用于在性能分析器已启用时控制 jemalloc 性能分析。为 Keeper 新增与 jemalloc 相关的 4LW 命令：`jmst` 用于转储 jemalloc 统计信息；`jmfp`、`jmep`、`jmdp` 用于在性能分析器已启用时控制 jemalloc 性能分析。 [#58665](https://github.com/ClickHouse/ClickHouse/pull/58665) ([Antonio Andelic](https://github.com/antonio2368)).
* 降低备份到 S3 时的内存消耗。 [#58962](https://github.com/ClickHouse/ClickHouse/pull/58962) ([Vitaly Baranov](https://github.com/vitlibar)).

<h4 id="improvement-11">
  改进
</h4>

* 为系统表的所有列添加注释（简要说明）。原因如下：- 系统表使用频繁，开发者有时很难理解某列的用途和含义。- 系统表变更频繁（新增或修改现有列），相关文档总是滞后。例如 [`system.parts`](/docs/reference/system-tables/parts) 的文档页面就缺少许多列。- 我们希望最终能够直接从 ClickHouse 生成文档。 [#58356](https://github.com/ClickHouse/ClickHouse/pull/58356) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* 允许 `PASTE JOIN` 查询中的子查询不带别名。 [#58654](https://github.com/ClickHouse/ClickHouse/pull/58654) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 在 macOS 上启用 `MySQL`/`MariaDB` 集成。关闭 [#21191](https://github.com/ClickHouse/ClickHouse/issues/21191)。 [#46316](https://github.com/ClickHouse/ClickHouse/pull/46316) ([Alexey Milovidov](https://github.com/alexey-milovidov)) ([Robert Schulze](https://github.com/rschu1ze)).
* 默认禁用 `max_rows_in_set_to_optimize_join`。 [#56396](https://github.com/ClickHouse/ClickHouse/pull/56396) ([vdimir](https://github.com/vdimir)).
* 新增 `<host_name>` 配置参数，使 ON CLUSTER DDL 查询和 Replicated 数据库引擎可以避免解析主机名，从而降低集群定义变化时队列卡住的可能性。关闭 [#57573](https://github.com/ClickHouse/ClickHouse/issues/57573)。 [#57603](https://github.com/ClickHouse/ClickHouse/pull/57603) ([Nikolay Degterinsky](https://github.com/evillique)).
* 将文件系统缓存的 `load_metadata_threads` 增至 16，以加快服务器启动。 [#57732](https://github.com/ClickHouse/ClickHouse/pull/57732) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 支持限制合并与变更操作的带宽（`max_mutations_bandwidth_for_server`/`max_merges_bandwidth_for_server`）。 [#57877](https://github.com/ClickHouse/ClickHouse/pull/57877) ([Azat Khuzhin](https://github.com/azat)).
* 将系统表 `system.server_settings` 中未在文档说明的布尔列 `is_hot_reloadable` 替换为 Enum8 列 `changeable_without_restart`，其可选值为 `No`、`Yes`、`IncreaseOnly` 和 `DecreaseOnly`。同时补充该列文档。 [#58029](https://github.com/ClickHouse/ClickHouse/pull/58029) ([skyoct](https://github.com/skyoct)).
* 集群发现支持设置用户名和密码，关闭 [#58063](https://github.com/ClickHouse/ClickHouse/issues/58063)。 [#58123](https://github.com/ClickHouse/ClickHouse/pull/58123) ([vdimir](https://github.com/vdimir)).
* 在 `ALTER TABLE ... PART` 中支持查询参数。 [#58297](https://github.com/ClickHouse/ClickHouse/pull/58297) ([Azat Khuzhin](https://github.com/azat)).
* 按需为 Kafka 表创建消费者（但从最后一次使用起保留一段时间，由 `kafka_consumers_pool_ttl_ms` 控制）。这应能修复 `system.kafka_consumers` 的统计信息问题：无人读取 Kafka 表时，统计信息未被消费，导致运行期间内存泄漏及表分离缓慢。本 PR 还重新默认启用 `system.kafka_consumers` 的统计信息。 [#58310](https://github.com/ClickHouse/ClickHouse/pull/58310) ([Azat Khuzhin](https://github.com/azat)).
* 将 `sparkBar` 作为 `sparkbar` 的别名。 [#58335](https://github.com/ClickHouse/ClickHouse/pull/58335) ([凌涛](https://github.com/lingtaolf)).
* 上传到 `GCS` 后避免发送 `ComposeObject` 请求。 [#58343](https://github.com/ClickHouse/ClickHouse/pull/58343) ([Azat Khuzhin](https://github.com/azat)).
* 正确处理 XML 配置中名称含点号的键。 [#58354](https://github.com/ClickHouse/ClickHouse/pull/58354) ([Azat Khuzhin](https://github.com/azat)).
* 函数 `format` 在参数为常量时返回常量。关闭 [#58355](https://github.com/ClickHouse/ClickHouse/issues/58355)。 [#58358](https://github.com/ClickHouse/ClickHouse/pull/58358) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 新增设置 `max_estimated_execution_time`，将 `max_execution_time` 和 `max_estimated_execution_time` 分离。 [#58402](https://github.com/ClickHouse/ClickHouse/pull/58402) ([Zhang Yifan](https://github.com/zhangyifan27)).
* 使用无效的数据库引擎名称时给出提示。 [#58444](https://github.com/ClickHouse/ClickHouse/pull/58444) ([Bharat Nallan](https://github.com/bharatnc)).
* 新增设置，以便更好地控制 Arrow 字典的索引类型。按照 Arrow 的建议，默认使用有符号整数作为索引类型。关闭 [#57401](https://github.com/ClickHouse/ClickHouse/issues/57401)。 [#58519](https://github.com/ClickHouse/ClickHouse/pull/58519) ([Kruglov Pavel](https://github.com/Avogar)).
* 实现 [#58575](https://github.com/ClickHouse/ClickHouse/issues/58575)：运行 docker 镜像时支持 `CLICKHOUSE_PASSWORD_FILE ` 环境变量。 [#58583](https://github.com/ClickHouse/ClickHouse/pull/58583) ([Eyal Halpern Shalev](https://github.com/Eyal-Shalev)).
* 执行某些需要大量流读取数据的查询时，此前会抛出 `"Paste JOIN requires sorted tables only"` 错误。现在会在这种情况下将流的数量调整为 1。 [#58608](https://github.com/ClickHouse/ClickHouse/pull/58608) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 改进 INVALID\_IDENTIFIER 错误消息。 [#58703](https://github.com/ClickHouse/ClickHouse/pull/58703) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* 改进 normalizeQuery 对有符号数值字面量的处理。 [#58710](https://github.com/ClickHouse/ClickHouse/pull/58710) ([Salvatore Mesoraca](https://github.com/aiven-sal)).
* 为 MySQL 支持 Point 数据类型。 [#58721](https://github.com/ClickHouse/ClickHouse/pull/58721) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 比较 Float32 列与常量字符串时，将字符串读取为 Float32（而非 Float64）。 [#58724](https://github.com/ClickHouse/ClickHouse/pull/58724) ([Raúl Marín](https://github.com/Algunenano)).
* 改进 S3 兼容性，新增 ECloud EOS 存储支持。 [#58786](https://github.com/ClickHouse/ClickHouse/pull/58786) ([xleoken](https://github.com/xleoken)).
* 允许使用 `KILL QUERY` 取消备份/恢复。本 PR 还让正在执行的备份和恢复显示在 `system.processes` 中。此外，服务器配置新增设置 `shutdown_wait_backups_and_restores`（默认值为 true），决定关闭服务器时等待所有正在执行的备份和恢复完成，还是直接取消它们。 [#58804](https://github.com/ClickHouse/ClickHouse/pull/58804) ([Vitaly Baranov](https://github.com/vitlibar)).
* Avro 格式支持 ZSTD 编解码器。关闭 [#58735](https://github.com/ClickHouse/ClickHouse/issues/58735)。 [#58805](https://github.com/ClickHouse/ClickHouse/pull/58805) ([flynn](https://github.com/ucasfl)).
* MySQL 接口支持 `net_write_timeout` 和 `net_read_timeout` 设置。`net_write_timeout` 映射为 ClickHouse 原生设置 `send_timeout`；类似地，`net_read_timeout` 映射为 `receive_timeout`。修复此前只有整条语句全为大写才能设置 MySQL `sql_select_limit` 的问题。 [#58835](https://github.com/ClickHouse/ClickHouse/pull/58835) ([Serge Klochkov](https://github.com/slvrtrn)).
* 改进创建同名字典与表发生冲突时的异常消息。 [#58841](https://github.com/ClickHouse/ClickHouse/pull/58841) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 对于自定义磁盘（通过 SQL 创建），确保服务器配置指定了 `filesystem_caches_path`（所有文件系统缓存的公共目录前缀）或 `custom_cached_disks_base_directory`（仅自定义磁盘所建文件系统缓存的公共目录前缀）。对于自定义磁盘，`custom_cached_disks_base_directory` 优先于 `filesystem_caches_path`，前者不存在时才使用后者。文件系统缓存设置 `path` 必须位于该目录下，否则抛出异常并阻止创建磁盘。这不会影响在旧版本创建后升级服务器的磁盘：此时不抛出异常，以便服务器成功启动。默认服务器配置新增 `custom_cached_disks_base_directory`，值为 `/var/lib/clickhouse/caches/`。关闭 [#57825](https://github.com/ClickHouse/ClickHouse/issues/57825)。 [#58869](https://github.com/ClickHouse/ClickHouse/pull/58869) ([Kseniia Sumarokova](https://github.com/kssenii)).
* MySQL 接口兼容 `SHOW WARNINGS`/`SHOW COUNT(*) WARNINGS` 查询，但返回结果始终为空集。 [#58929](https://github.com/ClickHouse/ClickHouse/pull/58929) ([Serge Klochkov](https://github.com/slvrtrn)).
* 执行并行分布式 `INSERT SELECT` 时跳过不可用副本。 [#58931](https://github.com/ClickHouse/ClickHouse/pull/58931) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 启用 JSON 结构化日志格式时，以描述性单词显示日志级别。 [#58936](https://github.com/ClickHouse/ClickHouse/pull/58936) ([Tim Liou](https://github.com/wheatdog)).
* MySQL 接口通过数据类型别名支持 `CAST(x AS SIGNED)` 和 `CAST(x AS UNSIGNED)` 语句：`SIGNED` 对应 Int64，`UNSIGNED` 对应 UInt64。这改进了与 Looker Studio 等 BI 工具的兼容性。 [#58954](https://github.com/ClickHouse/ClickHouse/pull/58954) ([Serge Klochkov](https://github.com/slvrtrn)).
* 将 docker 容器中的工作目录改为数据路径。 [#58975](https://github.com/ClickHouse/ClickHouse/pull/58975) ([cangyin](https://github.com/cangyin)).
* 为 Azure Blob Storage 新增设置 `azure_max_unexpected_write_error_retries`，也可在配置的 azure 节中设置。 [#59001](https://github.com/ClickHouse/ClickHouse/pull/59001) ([SmitaRKulkarni](https://github.com/SmitaRKulkarni)).
* 允许服务器在数据湖表损坏时启动。关闭 [#58625](https://github.com/ClickHouse/ClickHouse/issues/58625)。 [#59080](https://github.com/ClickHouse/ClickHouse/pull/59080) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 允许 `Iceberg` 表引擎忽略模式演进，并使用创建表时用户指定的模式，或创建表时从元数据解析出的最新模式，读取全部数据。通过默认禁用的设置 `iceberg_engine_ignore_schema_evolution` 控制。注意，启用此设置可能导致结果错误，因为模式发生演进时，仍会使用同一模式读取所有数据文件。 [#59133](https://github.com/ClickHouse/ClickHouse/pull/59133) ([Kruglov Pavel](https://github.com/Avogar)).
* 禁止对只读/只能写入一次的存储执行可变操作（`INSERT`/`ALTER`/`OPTIMIZE`/...），并返回恰当的 `TABLE_IS_READ_ONLY` 错误（避免遗留文件）。避免 `CREATE`/`ATTACH` 在只能写入一次的磁盘上留下文件（`format_version.txt`）。对 `ReplicatedMergeTree` 忽略 `DROP`（与 `MergeTree` 一样）。修复对 `s3_plain` 的遍历（`MetadataStorageFromPlainObjectStorage::iterateDirectory`）。注意，只读存储为 `web` 磁盘，只能写入一次的存储为 `s3_plain`。 [#59170](https://github.com/ClickHouse/ClickHouse/pull/59170) ([Azat Khuzhin](https://github.com/azat)).
* 修复实验性 `_block_number` 列在复杂组合的 `ALTER` 和 `merge` 操作期间可能引发逻辑错误的缺陷。修复 [#56202](https://github.com/ClickHouse/ClickHouse/issues/56202)。替代 [#58601](https://github.com/ClickHouse/ClickHouse/issues/58601)。 [#59295](https://github.com/ClickHouse/ClickHouse/pull/59295) ([alesapin](https://github.com/alesapin)).
* Play UI 能够识别 JSON 中返回的异常。针对 [#52853](https://github.com/ClickHouse/ClickHouse/issues/52853) 的调整。 [#59303](https://github.com/ClickHouse/ClickHouse/pull/59303) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* `/binary` HTTP 处理程序允许在查询字符串中指定用户、主机及可选密码。 [#59311](https://github.com/ClickHouse/ClickHouse/pull/59311) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 支持备份压缩的内存表。关闭 [#57893](https://github.com/ClickHouse/ClickHouse/issues/57893)。 [#59315](https://github.com/ClickHouse/ClickHouse/pull/59315) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 在 `BACKUP` 和 `RESTORE` 查询中支持 `FORMAT` 子句。 [#59338](https://github.com/ClickHouse/ClickHouse/pull/59338) ([Vitaly Baranov](https://github.com/vitlibar)).
* 函数 `concatWithSeparator` 现在支持任意参数类型（此前仅支持 `String` 和 `FixedString` 参数）。例如，`SELECT concatWithSeparator('.', 'number', 1)` 现在返回 `number.1`。 [#59341](https://github.com/ClickHouse/ClickHouse/pull/59341) ([Robert Schulze](https://github.com/rschu1ze)).

<h4 id="buildtestingpackaging-improvement-7">
  构建/测试/打包改进
</h4>

* 改进 clickhouse 二进制文件的别名（现在 `ch`/`clickhouse` 根据参数选择 `clickhouse-local` 或 `clickhouse`），并为新别名添加 bash 补全。 [#58344](https://github.com/ClickHouse/ClickHouse/pull/58344) ([Azat Khuzhin](https://github.com/azat)).
* 在 CI 中新增设置变更检查，确认所有设置变更均已记录到设置变更历史中。 [#58555](https://github.com/ClickHouse/ClickHouse/pull/58555) ([Kruglov Pavel](https://github.com/Avogar)).
* 在有状态测试中使用直接从 S3 附加的表。 [#58791](https://github.com/ClickHouse/ClickHouse/pull/58791) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 将完整 `fuzzer.log` 保存为归档，而非仅保存最后 10 万行。`tail -n 100000` 往往会移除包含表定义的行。示例：。 [#58821](https://github.com/ClickHouse/ClickHouse/pull/58821) ([Dmitry Novik](https://github.com/novikd)).
* 在 Aarch64 macOS 上启用 Rust（这将为客户端增加基于 skim 的模糊搜索及 PRQL 语言支持；不过我认为没人会在 darwin 上托管 ClickHouse，因此主要作用还是客户端模糊搜索）。 [#59272](https://github.com/ClickHouse/ClickHouse/pull/59272) ([Azat Khuzhin](https://github.com/azat)).
* 修复 x86\_64 与 ARM 混合集群中的聚合问题。 [#59132](https://github.com/ClickHouse/ClickHouse/pull/59132) ([Harry Lee](https://github.com/HarryLeeIBM)).

<h4 id="bug-fix-user-visible-misbehavior-in-an-official-stable-release-9">
  缺陷修复（正式稳定版本中用户可见的异常行为）
</h4>

* 为嵌套的 LowCardinality 添加连接键转换。 [#51550](https://github.com/ClickHouse/ClickHouse/pull/51550) ([vdimir](https://github.com/vdimir)).
* 当 flatten\_nested=1 时，仅展开真正的 Nested 类型，而非所有 Array(Tuple)。 [#56132](https://github.com/ClickHouse/ClickHouse/pull/56132) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复插入期间投影与 `aggregate_functions_null_for_empty` 设置相关的缺陷。 [#56944](https://github.com/ClickHouse/ClickHouse/pull/56944) ([Amos Bird](https://github.com/amosbird)).
* 修复过期的配置档案 UUID 可能导致的异常。 [#57263](https://github.com/ClickHouse/ClickHouse/pull/57263) ([Vasily Nemkov](https://github.com/Enmk)).
* 修复 StreamingFormatExecutor 中读取缓冲区的使用。 [#57438](https://github.com/ClickHouse/ClickHouse/pull/57438) ([Kruglov Pavel](https://github.com/Avogar)).
* 向视图推送数据时忽略目标表已删除的物化视图。 [#57520](https://github.com/ClickHouse/ClickHouse/pull/57520) ([Kruglov Pavel](https://github.com/Avogar)).
* 消除 ALTER\_METADATA 与 MERGE\_PARTS 之间可能发生的竞态。 [#57755](https://github.com/ClickHouse/ClickHouse/pull/57755) ([Azat Khuzhin](https://github.com/azat)).
* 修复带 rollup 的 group by 中表达式顺序错误。 [#57786](https://github.com/ClickHouse/ClickHouse/pull/57786) ([Chen768959](https://github.com/Chen768959)).
* 修复已过时的“零拷贝”复制功能：删除含损坏的已分离数据片段的副本后，不再丢失 blob。 [#58333](https://github.com/ClickHouse/ClickHouse/pull/58333) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 允许用户在 user\_files\_path 中使用符号链接。 [#58447](https://github.com/ClickHouse/ClickHouse/pull/58447) ([Duc Canh Le](https://github.com/canhld94)).
* 修复 graphite 表没有聚合函数时的崩溃。 [#58453](https://github.com/ClickHouse/ClickHouse/pull/58453) ([Duc Canh Le](https://github.com/canhld94)).
* 延迟从 StorageKafka 读取，以允许物化视图多次读取。 [#58477](https://github.com/ClickHouse/ClickHouse/pull/58477) ([János Benjamin Antal](https://github.com/antaljanosbenjamin)).
* 修复一种本不应发生的数据片段相交情形。 [#58482](https://github.com/ClickHouse/ClickHouse/pull/58482) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 对仅带 LIMIT 的查询禁用 MergeTreePrefetchedReadPool。 [#58505](https://github.com/ClickHouse/ClickHouse/pull/58505) ([Maksim Kita](https://github.com/kitaisreal)).
* 在恢复时启用 ordinary 数据库。 [#58520](https://github.com/ClickHouse/ClickHouse/pull/58520) ([Jihyuk Bok](https://github.com/tomahawk28)).
* 修复 Apache Hive 对 ORC/Parquet/... 的线程池读取。 [#58537](https://github.com/ClickHouse/ClickHouse/pull/58537) ([sunny](https://github.com/sunny19930321)).
* 隐藏 `system.backup_log` 的 `base_backup_name` 列中的凭据。 [#58550](https://github.com/ClickHouse/ClickHouse/pull/58550) ([Daniel Pozo Escalona](https://github.com/danipozo)).
* 修复 `toStartOfInterval` 对毫秒、微秒值的取整。 [#58557](https://github.com/ClickHouse/ClickHouse/pull/58557) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 在 ConcurrentHashJoin 中禁用 `max_joined_block_rows`。 [#58595](https://github.com/ClickHouse/ClickHouse/pull/58595) ([vdimir](https://github.com/vdimir)).
* 修复旧分析器中使用 nullable 的连接。 [#58596](https://github.com/ClickHouse/ClickHouse/pull/58596) ([vdimir](https://github.com/vdimir)).
* `makeDateTime64`：允许 fraction 参数为非常量。 [#58597](https://github.com/ClickHouse/ClickHouse/pull/58597) ([Robert Schulze](https://github.com/rschu1ze)).
* 修复内联栈帧符号解析期间可能发生的 NULL 解引用。 [#58607](https://github.com/ClickHouse/ClickHouse/pull/58607) ([Azat Khuzhin](https://github.com/azat)).
* 改进重新创建用户或切换角色时查询缓存条目的隔离。 [#58611](https://github.com/ClickHouse/ClickHouse/pull/58611) ([Robert Schulze](https://github.com/rschu1ze)).
* 修复投影优化时损坏的分区键分析。 [#58638](https://github.com/ClickHouse/ClickHouse/pull/58638) ([Amos Bird](https://github.com/amosbird)).
* 查询缓存：修复按用户配额。 [#58731](https://github.com/ClickHouse/ClickHouse/pull/58731) ([Robert Schulze](https://github.com/rschu1ze)).
* 修复并行窗口函数中的流分区。 [#58739](https://github.com/ClickHouse/ClickHouse/pull/58739) ([Dmitry Novik](https://github.com/novikd)).
* 修复 addBatchLookupTable8 抛出异常时调用两次销毁的问题。 [#58745](https://github.com/ClickHouse/ClickHouse/pull/58745) ([Raúl Marín](https://github.com/Algunenano)).
* Keeper 关闭期间不再处理请求。 [#58765](https://github.com/ClickHouse/ClickHouse/pull/58765) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复 `SlabsPolygonIndex::find` 中的空指针解引用。 [#58771](https://github.com/ClickHouse/ClickHouse/pull/58771) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 修复 JSONExtract 函数对 LowCardinality(Nullable) 列的处理。 [#58808](https://github.com/ClickHouse/ClickHouse/pull/58808) ([vdimir](https://github.com/vdimir)).
* 修复通过 CREATE 和 DROP 创建大量表时内存占用意外累积的问题。 [#58831](https://github.com/ClickHouse/ClickHouse/pull/58831) ([Maksim Kita](https://github.com/kitaisreal)).
* 支持在物化视图中多次读取文件日志存储。 [#58877](https://github.com/ClickHouse/ClickHouse/pull/58877) ([János Benjamin Antal](https://github.com/antaljanosbenjamin)).
* 为 s3 的访问密钥 ID 添加限制。 [#58900](https://github.com/ClickHouse/ClickHouse/pull/58900) ([MikhailBurdukov](https://github.com/MikhailBurdukov)).
* 修复 clickhouse-local 加载补全建议时可能发生的崩溃。 [#58907](https://github.com/ClickHouse/ClickHouse/pull/58907) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复使用 `indexHint` 时的崩溃。 [#58911](https://github.com/ClickHouse/ClickHouse/pull/58911) ([Dmitry Novik](https://github.com/novikd)).
* 修复 StorageURL 在服务器重启后丢失请求头的问题。 [#58933](https://github.com/ClickHouse/ClickHouse/pull/58933) ([Michael Kolupaev](https://github.com/al13n321)).
* Analyzer：修复使用插入数据块替换存储的问题。 [#58958](https://github.com/ClickHouse/ClickHouse/pull/58958) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* 修复 ReadBufferFromZipArchive 中的定位。 [#58966](https://github.com/ClickHouse/ClickHouse/pull/58966) ([Michael Kolupaev](https://github.com/al13n321)).
* 修复实验性倒排索引（请勿用于生产）：对倒排索引执行 `DROP INDEX` 现在会从持久存储中移除所有相关文件。 [#59040](https://github.com/ClickHouse/ClickHouse/pull/59040) ([mochi](https://github.com/MochiXu)).
* 修复 query\_factories\_info 上的数据竞态。 [#59049](https://github.com/ClickHouse/ClickHouse/pull/59049) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 对“Too many redirects”错误禁用重试。 [#59099](https://github.com/ClickHouse/ClickHouse/pull/59099) ([skyoct](https://github.com/skyoct)).
* 修复未启动数据库在关闭时发生的死锁。 [#59137](https://github.com/ClickHouse/ClickHouse/pull/59137) ([Sergei Trifonov](https://github.com/serxa)).
* 修复分布式查询中的 LIMIT BY 和 LIMIT。 [#59153](https://github.com/ClickHouse/ClickHouse/pull/59153) ([Igor Nikonov](https://github.com/devcrafter)).
* 修复 `toString` 使用可空时区时的崩溃。 [#59190](https://github.com/ClickHouse/ClickHouse/pull/59190) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 修复 iceberg 元数据因错误文件路径而中止的问题。 [#59275](https://github.com/ClickHouse/ClickHouse/pull/59275) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复选择 Rust 目标时的架构名称。 [#59307](https://github.com/ClickHouse/ClickHouse/pull/59307) ([p1rattttt](https://github.com/p1rattttt)).
* 修复查询 `system.tables` 且 IN 子句包含子查询时关于“集合未就绪”的逻辑错误。 [#59351](https://github.com/ClickHouse/ClickHouse/pull/59351) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
