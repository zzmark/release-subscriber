<h3 id="a-id242a-clickhouse-release-242-2024-02-29">
  <a id="242" /> ClickHouse 24.2 版本, 2024-02-29. [演示文稿](https://presentations.clickhouse.com/2024-release-24.2/), [视频](https://www.youtube.com/watch?v=iN2y-TK8f3A)
</h3>

<Frame>
  <iframe src="https://www.youtube.com/embed/iN2y-TK8f3A" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
</Frame>

<h4 id="backward-incompatible-change-8">
  向后不兼容变更
</h4>

* 校验嵌套类型中的可疑类型和实验性类型。此前未校验 Array/Tuple/Map 等嵌套类型中的此类类型（JSON 除外）。 [#59385](https://github.com/ClickHouse/ClickHouse/pull/59385) ([Kruglov Pavel](https://github.com/Avogar)).
* 增加线程数和数据块大小的合理性检查。 [#60138](https://github.com/ClickHouse/ClickHouse/pull/60138) ([Raúl Marín](https://github.com/Algunenano)).
* 默认不再将指数表示法推断为浮点数。新增设置 `input_format_try_infer_exponent_floats`，可恢复此前行为（默认禁用）。关闭 [#59476](https://github.com/ClickHouse/ClickHouse/issues/59476)。 [#59500](https://github.com/ClickHouse/ClickHouse/pull/59500) ([Kruglov Pavel](https://github.com/Avogar)).
* 允许用括号包围 alter 操作。是否输出括号由配置 `format_alter_operations_with_parentheses` 控制。默认在格式化查询中输出括号，因为有些地方会将格式化后的 alter 操作存为元数据（例如变更操作）。新语法消除了某些以列表结尾的 alter 操作查询的歧义。例如，旧语法无法正确解析 `ALTER TABLE x MODIFY TTL date GROUP BY a, b, DROP COLUMN c`。新语法 `ALTER TABLE x (MODIFY TTL date GROUP BY a, b), (DROP COLUMN c)` 则含义明确。旧版本无法读取新语法，因此在同一集群混用新旧 ClickHouse 版本时，使用新语法可能引发问题。 [#59532](https://github.com/ClickHouse/ClickHouse/pull/59532) ([János Benjamin Antal](https://github.com/antaljanosbenjamin)).
* 修复物化视图安全问题：此前用户无需必要授权即可向表插入数据。修复后，会校验用户不仅有权向物化视图插入，而且有权向所有底层表插入。这意味着某些此前可执行的查询现在可能报 `Not enough privileges`。为解决此问题，本版本引入视图的 SQL 安全特性 [https://clickhouse.com/docs/sql-reference/statements/create/view#sql\_security](https://clickhouse.com/docs/sql-reference/statements/create/view#sql_security)。 [#54901](https://github.com/ClickHouse/ClickHouse/pull/54901) [#60439](https://github.com/ClickHouse/ClickHouse/pull/60439) ([pufit](https://github.com/pufit)).

<h4 id="new-feature-10">
  新功能
</h4>

* 新增在视图/物化视图中指定定义者用户的语法，允许通过视图执行查询/插入而无需显式授予底层表权限。这样，视图即可封装这些授权。 [#54901](https://github.com/ClickHouse/ClickHouse/pull/54901) [#60439](https://github.com/ClickHouse/ClickHouse/pull/60439) ([pufit](https://github.com/pufit)).
* 在 `file/s3/hdfs/url/azureBlobStorage` 引擎进行结构推断时，若文件格式未知，尝试自动检测。关闭 [#50576](https://github.com/ClickHouse/ClickHouse/issues/50576)。 [#59092](https://github.com/ClickHouse/ClickHouse/pull/59092) ([Kruglov Pavel](https://github.com/Avogar)).
* 实现异步插入超时的自动调整。引入以下设置：async\_insert\_poll\_timeout\_ms、async\_insert\_use\_adaptive\_busy\_timeout、async\_insert\_busy\_timeout\_min\_ms、async\_insert\_busy\_timeout\_max\_ms、async\_insert\_busy\_timeout\_increase\_rate、async\_insert\_busy\_timeout\_decrease\_rate。 [#58486](https://github.com/ClickHouse/ClickHouse/pull/58486) ([Julia Kartseva](https://github.com/jkartseva)).
* 允许配置最大连续登录失败次数的配额。 [#54737](https://github.com/ClickHouse/ClickHouse/pull/54737) ([Alexey Gerasimchuck](https://github.com/Demilivor)).
* 新增聚合函数 `groupArrayIntersect`。后续工作：[#49862](https://github.com/ClickHouse/ClickHouse/issues/49862)。 [#59598](https://github.com/ClickHouse/ClickHouse/pull/59598) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 备份与恢复支持 `AzureBlobStorage`。解决 [#50747](https://github.com/ClickHouse/ClickHouse/issues/50747)。 [#56988](https://github.com/ClickHouse/ClickHouse/pull/56988) ([SmitaRKulkarni](https://github.com/SmitaRKulkarni)).
* 用户现在可使用 `format_schema_rows_template` 在查询中直接指定模板字符串，作为 `format_template_row` 的替代。关闭 [#31363](https://github.com/ClickHouse/ClickHouse/issues/31363)。 [#59088](https://github.com/ClickHouse/ClickHouse/pull/59088) ([Shaun Struwig](https://github.com/Blargian)).
* 实现将不同类型的 MergeTree 表自动转换为对应复制引擎。在表数据目录（`/clickhouse/store/xxx/xxxyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy/`）中创建空文件 `convert_to_replicated`，即可在下次服务器启动时自动转换该表。 [#57798](https://github.com/ClickHouse/ClickHouse/pull/57798) ([Kirill](https://github.com/kirillgarbar)).
* 新增查询 `ALTER TABLE table FORGET PARTITION partition`，删除与空分区相关的 ZooKeeper 节点。 [#59507](https://github.com/ClickHouse/ClickHouse/pull/59507) ([Sergei Trifonov](https://github.com/serxa)). 这是一项面向专家的功能。
* NATS 表引擎支持 JWT 凭据文件。 [#59543](https://github.com/ClickHouse/ClickHouse/pull/59543) ([Nickolaj Jepsen](https://github.com/nickolaj-jepsen)).
* 实现 `system.dns_cache` 表，可用于排查 DNS 问题。 [#59856](https://github.com/ClickHouse/ClickHouse/pull/59856) ([Kirill Nikiforov](https://github.com/allmazz)).
* 编解码器 `LZ4HC` 接受新的级别 2；相较此前最低级别 3，速度更快，但压缩率更低。在此前版本中，`LZ4HC(2)` 及更低级别等同于 `LZ4HC(3)`。作者：[Cyan4973](https://github.com/Cyan4973)。 [#60090](https://github.com/ClickHouse/ClickHouse/pull/60090) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 实现 `system.dns_cache` 表，可用于排查 DNS 问题。新增服务器设置 dns\_cache\_max\_size。 [#60257](https://github.com/ClickHouse/ClickHouse/pull/60257) ([Kirill Nikiforov](https://github.com/allmazz)).
* 支持 `merge` 表函数的单参数形式，即 `merge(['db_name', ] 'tables_regexp')`。 [#60372](https://github.com/ClickHouse/ClickHouse/pull/60372) ([豪肥肥](https://github.com/HowePa)).
* 支持负数位置参数。关闭 [#57736](https://github.com/ClickHouse/ClickHouse/issues/57736)。 [#58292](https://github.com/ClickHouse/ClickHouse/pull/58292) ([flynn](https://github.com/ucasfl)).
* 支持在配置中通过 `user` 键为特定 S3 设置指定一组获准用户。 [#60144](https://github.com/ClickHouse/ClickHouse/pull/60144) ([Antonio Andelic](https://github.com/antonio2368)).
* 新增表函数 `mergeTreeIndex`，展示 `MergeTree` 表的索引文件和标记文件的内容，可用于内省。语法：`mergeTreeIndex(database, table, [with_marks = true])`，其中 `database.table` 是已存在的 `MergeTree` 引擎表。 [#58140](https://github.com/ClickHouse/ClickHouse/pull/58140) ([Anton Popov](https://github.com/CurtizJ)).

<h4 id="experimental-feature-8">
  实验性功能
</h4>

* 新增函数 `seriesOutliersDetectTukey`，使用 Tukey 围栏法检测序列数据中的异常值。 [#58632](https://github.com/ClickHouse/ClickHouse/pull/58632) ([Bhavna Jindal](https://github.com/bhavnajindal)). 请注意，下一补丁版本将更改此行为。
* 新增函数 `variantType`，返回包含每行具体变体类型名称的 Enum。 [#59398](https://github.com/ClickHouse/ClickHouse/pull/59398) ([Kruglov Pavel](https://github.com/Avogar)).
* 并行副本支持 `LEFT JOIN`、`ALL INNER JOIN` 和简单子查询（仅在使用分析器时）。新增设置 `parallel_replicas_prefer_local_join`，用于选择本地执行 `JOIN`（默认）或 `GLOBAL JOIN`。所有表都应存在于 `cluster_for_parallel_replicas` 的每个副本上。新增设置 `min_external_table_block_size_rows` 和 `min_external_table_block_size_bytes`，用于合并发送给临时表的小数据块（仅在使用分析器时）。 [#58916](https://github.com/ClickHouse/ClickHouse/pull/58916) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 允许在添加或恢复新副本期间，在 `Replicated` 数据库中并发创建表。 [#59277](https://github.com/ClickHouse/ClickHouse/pull/59277) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 实现 `Variant` 值的比较运算符，并正确地将 Field 插入 `Variant` 列。默认不允许创建包含相似变体类型的 `Variant` 类型（可通过设置 `allow_suspicious_variant_types` 允许）。关闭 [#59996](https://github.com/ClickHouse/ClickHouse/issues/59996)。关闭 [#59850](https://github.com/ClickHouse/ClickHouse/issues/59850)。 [#60198](https://github.com/ClickHouse/ClickHouse/pull/60198) ([Kruglov Pavel](https://github.com/Avogar)).
* 在不使用分析器时，禁用包含 CTE 的并行副本 JOIN。 [#59239](https://github.com/ClickHouse/ClickHouse/pull/59239) ([Raúl Marín](https://github.com/Algunenano)).

<h4 id="performance-improvement-10">
  性能改进
</h4>

* 主键将使用更少内存。 [#60049](https://github.com/ClickHouse/ClickHouse/pull/60049) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 改进主键和部分其他操作的内存使用。 [#60050](https://github.com/ClickHouse/ClickHouse/pull/60050) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 表的主键将在首次访问时延迟加载到内存。由默认启用的新 MergeTree 设置 `primary_key_lazy_load` 控制。优点：- 不会为未使用的表加载主键；- 内存不足时，在首次使用时抛出异常，而非服务器启动时。缺点：- 主键加载的延迟由首次查询承担，而非在接受连接前承担；理论上可能引发惊群问题。关闭 [#11188](https://github.com/ClickHouse/ClickHouse/issues/11188)。 [#60093](https://github.com/ClickHouse/ClickHouse/pull/60093) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 对向量搜索使用的距离函数进行向量化。 [#58866](https://github.com/ClickHouse/ClickHouse/pull/58866) ([Robert Schulze](https://github.com/rschu1ze)).
* 对向量搜索中有用的 `dotProduct` 函数进行向量化。 [#60202](https://github.com/ClickHouse/ClickHouse/pull/60202) ([Robert Schulze](https://github.com/rschu1ze)).
* 为函数 `dictGetOrDefault` 增加短路求值能力。关闭 [#52098](https://github.com/ClickHouse/ClickHouse/issues/52098)。 [#57767](https://github.com/ClickHouse/ClickHouse/pull/57767) ([jsc0218](https://github.com/jsc0218)).
* Keeper 改进：仅在内存中缓存一定数量的日志，由 `latest_logs_cache_size_threshold` 和 `commit_logs_cache_size_threshold` 控制。 [#59460](https://github.com/ClickHouse/ClickHouse/pull/59460) ([Antonio Andelic](https://github.com/antonio2368)).
* Keeper 改进：进一步缩小数据节点的大小。 [#59592](https://github.com/ClickHouse/ClickHouse/pull/59592) ([Antonio Andelic](https://github.com/antonio2368)).
* 继续优化结果类型为 `Float*/Decimal*/*Int*` 时 `if` 函数的分支预测失误，作为 [https://github.com/ClickHouse/ClickHouse/pull/57885](https://github.com/ClickHouse/ClickHouse/pull/57885) 的后续工作。 [#59148](https://github.com/ClickHouse/ClickHouse/pull/59148) ([李扬](https://github.com/taiyang-li)).
* 优化输入类型为 `Map` 时的 `if` 函数，最高可提速约 \~10 倍。 [#59413](https://github.com/ClickHouse/ClickHouse/pull/59413) ([李扬](https://github.com/taiyang-li)).
* 通过实现严格别名规则提升 `Int8` 类型的性能（`UInt8` 及所有其他整数类型已支持）。 [#59485](https://github.com/ClickHouse/ClickHouse/pull/59485) ([Raúl Marín](https://github.com/Algunenano)).
* 通过减少分支预测失误，提升 bigint 和大 decimal 类型的条件 sum/avg 性能。 [#59504](https://github.com/ClickHouse/ClickHouse/pull/59504) ([李扬](https://github.com/taiyang-li)).
* 提升存在正在执行的变更操作时 SELECT 的性能。 [#59531](https://github.com/ClickHouse/ClickHouse/pull/59531) ([Azat Khuzhin](https://github.com/azat)).
* 使用 AVX2 优化函数 `isNotNull`。 [#59621](https://github.com/ClickHouse/ClickHouse/pull/59621) ([李扬](https://github.com/taiyang-li)).
* 提升有序或近乎有序数据的 ASOF JOIN 性能。 [#59731](https://github.com/ClickHouse/ClickHouse/pull/59731) ([Maksim Kita](https://github.com/kitaisreal)).
* `async_insert_max_data_size` 此前默认值 1 MB 过小，新默认值为 10 MiB。 [#59536](https://github.com/ClickHouse/ClickHouse/pull/59536) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* 执行 RESTORE 命令时，使用多线程从备份读取表元数据。 [#60040](https://github.com/ClickHouse/ClickHouse/pull/60040) ([Vitaly Baranov](https://github.com/vitlibar)).
* 现在，当 `StorageBuffer` 包含多个分片（`num_layers` > 1）时，所有分片将以多线程同时进行后台刷新。 [#60111](https://github.com/ClickHouse/ClickHouse/pull/60111) ([alesapin](https://github.com/alesapin)).

<h4 id="improvement-10">
  改进
</h4>

* 当输出为 `Pretty` 格式，且数据块只包含一个超过一百万的数值时，在表格右侧打印易读的数字表示。 [#60379](https://github.com/ClickHouse/ClickHouse/pull/60379) ([rogeryk](https://github.com/rogeryk)).
* 新增设置 `split_parts_ranges_into_intersecting_and_non_intersecting_final` 和 `split_intersecting_parts_ranges_into_layers_final`，用于禁用带 `FINAL` 查询的优化，仅供调试使用。 [#59705](https://github.com/ClickHouse/ClickHouse/pull/59705) ([Maksim Kita](https://github.com/kitaisreal)). 实际上它们不仅用于此目的，也可牺牲性能来降低内存占用。
* 将设置 `extract_kvp_max_pairs_per_row` 重命名为 `extract_key_value_pairs_max_pairs_per_row`。该问题（设置名称中不必要的缩写）由 [https://github.com/ClickHouse/ClickHouse/pull/43606](https://github.com/ClickHouse/ClickHouse/pull/43606) 引入。修复此设置的文档。 [#59683](https://github.com/ClickHouse/ClickHouse/pull/59683) ([Alexey Milovidov](https://github.com/alexey-milovidov)). [#59960](https://github.com/ClickHouse/ClickHouse/pull/59960) ([jsc0218](https://github.com/jsc0218)).
* 对带 `DEFAULT` 或 `MATERIALIZED` 表达式的列执行 `ALTER COLUMN MATERIALIZE`，现在严格遵循其语义。 [#58023](https://github.com/ClickHouse/ClickHouse/pull/58023) ([Duc Canh Le](https://github.com/canhld94)).
* 针对变更操作期间的错误启用指数退避逻辑，以降低 CPU 使用率、内存占用和日志文件大小。 [#58036](https://github.com/ClickHouse/ClickHouse/pull/58036) ([MikhailBurdukov](https://github.com/MikhailBurdukov)).
* 改进 `InitialQuery` Profile Event 的计数。 [#58195](https://github.com/ClickHouse/ClickHouse/pull/58195) ([Unalian](https://github.com/Unalian)).
* 允许在 `storage_configuration` 中定义 `volume_priority`。 [#58533](https://github.com/ClickHouse/ClickHouse/pull/58533) ([Andrey Zvonov](https://github.com/zvonand)).
* 为 `T64` 编解码器添加 `Date32` 类型支持。 [#58738](https://github.com/ClickHouse/ClickHouse/pull/58738) ([Hongbin Ma](https://github.com/binmahone)).
* 允许含多个条目的类型使用末尾逗号。 [#59119](https://github.com/ClickHouse/ClickHouse/pull/59119) ([Aleksandr Musorin](https://github.com/AVMusorin)).
* 现在可在服务器配置文件中指定 Distributed 表引擎设置（类似 MergeTree 设置），例如 `<distributed> <flush_on_detach>false</flush_on_detach> </distributed>`。 [#59291](https://github.com/ClickHouse/ClickHouse/pull/59291) ([Azat Khuzhin](https://github.com/azat)).
* 读取 `system.zookeeper` 时，对连接断开和会话过期进行重试。从 `system.zookeeper` 表读取大量行时，尤其存在故障注入导致的断连时，这一点很有用。 [#59388](https://github.com/ClickHouse/ClickHouse/pull/59388) ([Alexander Gololobov](https://github.com/davenger)).
* 当 `input_format_values_interpret_expressions=0` 时，不将带前导零的数字解释为八进制。 [#59403](https://github.com/ClickHouse/ClickHouse/pull/59403) ([Joanna Hulboj](https://github.com/jh0x)).
* ClickHouse 在启动和配置文件变更时，更新总内存跟踪器的硬限制。这些限制根据多个服务器设置及 cgroup 限制（Linux 上）计算。此前硬编码使用 `/sys/fs/cgroup/memory.max`（cgroups v2），导致为嵌套组（层级）配置的 cgroup v2 内存限制被忽略，例如 `/sys/fs/cgroup/my/nested/group/memory.max`。现已修复。v1 内存限制的行为保持不变。 [#59435](https://github.com/ClickHouse/ClickHouse/pull/59435) ([Robert Schulze](https://github.com/rschu1ze)).
* 新增 Profile Event，用于观察 `INSERT` 期间计算主键、投影和二级索引所耗费的时间。 [#59436](https://github.com/ClickHouse/ClickHouse/pull/59436) ([Nikita Taranov](https://github.com/nickitat)).
* 允许创建 Ordered 模式的 S3Queue 时，通过设置 `s3queue_last_processed_path` 定义起点。 [#59446](https://github.com/ClickHouse/ClickHouse/pull/59446) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 在 `clickhouse-local` 中，也可通过 `system.tables` 获取系统表的注释。 [#59493](https://github.com/ClickHouse/ClickHouse/pull/59493) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* `system.zookeeper` 表：此前会将整个结果累积在内存中，再作为一个大数据块返回。本次变更有助于降低从 `system.zookeeper` 读取大量行时的内存消耗，显示中间进度（已读取的行数），并避免结果集较大时发生连接超时。 [#59545](https://github.com/ClickHouse/ClickHouse/pull/59545) ([Alexander Gololobov](https://github.com/davenger)).
* 仪表盘现在同时识别 URL #hash 的压缩与未压缩状态（向后兼容）。延续 [#59124](https://github.com/ClickHouse/ClickHouse/issues/59124)。 [#59548](https://github.com/ClickHouse/ClickHouse/pull/59548) ([Amos Bird](https://github.com/amosbird)).
* 将 Intel QPL（供编解码器 `DEFLATE_QPL` 使用）从 v1.3.1 升至 v1.4.0。同时修复轮询超时机制的缺陷：我们发现某些情况下超时机制无法正常工作，发生超时时 IAA 与 CPU 可能同时处理缓冲区。目前应确保 IAA 编解码器状态不是 QPL\_STS\_BEING\_PROCESSED，再回退到软件编解码器。 [#59551](https://github.com/ClickHouse/ClickHouse/pull/59551) ([jasperzhu](https://github.com/jinjunzh)).
* 在 ClickHouse Cloud 中不再显示服务器版本警告，因为 ClickHouse Cloud 会自动处理无缝升级。 [#59657](https://github.com/ClickHouse/ClickHouse/pull/59657) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 自解压后移动临时二进制文件，而非复制。 [#59661](https://github.com/ClickHouse/ClickHouse/pull/59661) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* 修复 Apple macOS 上的栈展开。关闭 [#53653](https://github.com/ClickHouse/ClickHouse/issues/53653)。 [#59690](https://github.com/ClickHouse/ClickHouse/pull/59690) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* 即使用户误将 `max_parser_depth` 设置为极大值，也在解析器中检查栈溢出。关闭 [#59622](https://github.com/ClickHouse/ClickHouse/issues/59622)。 [#59697](https://github.com/ClickHouse/ClickHouse/pull/59697) ([Alexey Milovidov](https://github.com/alexey-milovidov)). [#60434](https://github.com/ClickHouse/ClickHouse/pull/60434)
* 统一 Kafka 存储中通过 XML 和 SQL 创建的命名集合的行为。 [#59710](https://github.com/ClickHouse/ClickHouse/pull/59710) ([Pervakov Grigorii](https://github.com/GrigoryPervakov)).
* 当 `merge_max_block_size_bytes` 足够小，且表中包含宽行（字符串或元组）时，后台合并可能陷入无限循环。现已修复，作为 [https://github.com/ClickHouse/ClickHouse/pull/59340](https://github.com/ClickHouse/ClickHouse/pull/59340) 的后续工作。 [#59812](https://github.com/ClickHouse/ClickHouse/pull/59812) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* 若 CREATE TABLE 显式指定 uuid，则允许在 replica\_path 中使用。 [#59908](https://github.com/ClickHouse/ClickHouse/pull/59908) ([Azat Khuzhin](https://github.com/azat)).
* 在系统表 `system.tables` 中添加 ReplicatedMergeTree 表的 `metadata_version` 列。 [#59942](https://github.com/ClickHouse/ClickHouse/pull/59942) ([Maksim Kita](https://github.com/kitaisreal)).
* Keeper 改进：仅向 Prometheus 发送与 Keeper 相关的指标/事件。 [#59945](https://github.com/ClickHouse/ClickHouse/pull/59945) ([Antonio Andelic](https://github.com/antonio2368)).
* 即使升级后系统表结构发生变化，仪表盘也能跨 ClickHouse 版本显示指标。 [#59967](https://github.com/ClickHouse/ClickHouse/pull/59967) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 允许从文件加载可用区信息。 [#59976](https://github.com/ClickHouse/ClickHouse/pull/59976) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* Keeper 改进：为磁盘相关操作增加失败重试。 [#59980](https://github.com/ClickHouse/ClickHouse/pull/59980) ([Antonio Andelic](https://github.com/antonio2368)).
* 新增配置设置 `backups.remove_backup_files_after_failure`：`<clickhouse> <backups> <remove_backup_files_after_failure>true</remove_backup_files_after_failure> </backups> </clickhouse>`。 [#60002](https://github.com/ClickHouse/ClickHouse/pull/60002) ([Vitaly Baranov](https://github.com/vitlibar)).
* 复制 S3 文件时，若 GCP 返回 HTTP 错误码为 `GATEWAY_TIMEOUT` 的 `Internal Error`，则回退到通过缓冲区复制。 [#60164](https://github.com/ClickHouse/ClickHouse/pull/60164) ([Maksim Kita](https://github.com/kitaisreal)).
* 为 `ULIDStringToDateTime` 提供短路执行。 [#60211](https://github.com/ClickHouse/ClickHouse/pull/60211) ([Juan Madurga](https://github.com/jlmadurga)).
* 为表 `system.backups` 和 `system.backup_log` 新增 `query_id` 列。向 `error` 列添加错误堆栈跟踪。 [#60220](https://github.com/ClickHouse/ClickHouse/pull/60220) ([Maksim Kita](https://github.com/kitaisreal)).
* 通过 MySQL 端口建立的连接现在自动使用设置 `prefer_column_name_to_alias = 1`，以便开箱即用地支持 QuickSight。此外，默认启用 `mysql_map_string_to_text_in_show_columns` 和 `mysql_map_fixed_string_to_text_in_show_columns`，同样仅影响 MySQL 连接。这提升了对更多 BI 工具的兼容性。 [#60365](https://github.com/ClickHouse/ClickHouse/pull/60365) ([Robert Schulze](https://github.com/rschu1ze)).
* 修复 JavaScript 代码中的竞态条件，避免重复图表相互叠加。 [#60392](https://github.com/ClickHouse/ClickHouse/pull/60392) ([Alexey Milovidov](https://github.com/alexey-milovidov)).

<h4 id="buildtestingpackaging-improvement-6">
  构建/测试/打包改进
</h4>

* 增加通过内省收集覆盖率的构建与测试。延续 [#56102](https://github.com/ClickHouse/ClickHouse/issues/56102)。 [#58792](https://github.com/ClickHouse/ClickHouse/pull/58792) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 设置 CMake 交叉编译工具链变量时，更新 `corrosion-cmake` 中的 Rust 工具链。 [#59309](https://github.com/ClickHouse/ClickHouse/pull/59309) ([Aris Tritas](https://github.com/aris-aiven)).
* 为 ASTLiterals 增加一些模糊测试。 [#59383](https://github.com/ClickHouse/ClickHouse/pull/59383) ([Raúl Marín](https://github.com/Algunenano)).
* 若要在每次 ClickHouse 容器启动时运行 initdb 脚本，应初始化环境变量 CLICKHOUSE\_ALWAYS\_RUN\_INITDB\_SCRIPTS。 [#59808](https://github.com/ClickHouse/ClickHouse/pull/59808) ([Alexander Nikolaev](https://github.com/AlexNik)).
* 移除禁用通用 clickhouse 组件（如 server/client/...）的能力，但保留对需要额外库的组件（如 ODBC 或 keeper）的禁用能力。 [#59857](https://github.com/ClickHouse/ClickHouse/pull/59857) ([Azat Khuzhin](https://github.com/azat)).
* 查询模糊测试器将对查询中的 SETTINGS 进行模糊测试。 [#60087](https://github.com/ClickHouse/ClickHouse/pull/60087) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 支持使用 clang-19（master）构建 ClickHouse。 [#60448](https://github.com/ClickHouse/ClickHouse/pull/60448) ([Alexey Milovidov](https://github.com/alexey-milovidov)).

<h4 id="bug-fix-user-visible-misbehavior-in-an-official-stable-release-8">
  缺陷修复（正式稳定版本中用户可见的异常行为）
</h4>

* 修复 TTL WHERE 中的“集合未就绪”错误。 [#57430](https://github.com/ClickHouse/ClickHouse/pull/57430) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复 `quantilesGK` 函数的缺陷。 [#58216](https://github.com/ClickHouse/ClickHouse/pull/58216) ([李扬](https://github.com/taiyang-li)).
* 修复 `intDiv` 对 Decimal 参数的错误行为。 [#59243](https://github.com/ClickHouse/ClickHouse/pull/59243) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 修复 `translate` 对 FixedString 输入的处理。 [#59356](https://github.com/ClickHouse/ClickHouse/pull/59356) ([Raúl Marín](https://github.com/Algunenano)).
* 修复 Keeper 中的摘要计算。 [#59439](https://github.com/ClickHouse/ClickHouse/pull/59439) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复不含调试符号的二进制文件的堆栈跟踪。 [#59444](https://github.com/ClickHouse/ClickHouse/pull/59444) ([Azat Khuzhin](https://github.com/azat)).
* 修复 `ASTAlterCommand::formatImpl` 在包含列级设置等情况下的问题。 [#59445](https://github.com/ClickHouse/ClickHouse/pull/59445) ([János Benjamin Antal](https://github.com/antaljanosbenjamin)).
* 修复 Analyzer 中的 `SELECT * FROM [...] ORDER BY ALL`。 [#59462](https://github.com/ClickHouse/ClickHouse/pull/59462) ([zhongyuankai](https://github.com/zhongyuankai)).
* 修复取消分布式查询时可能发生的未捕获异常。 [#59487](https://github.com/ClickHouse/ClickHouse/pull/59487) ([Azat Khuzhin](https://github.com/azat)).
* 让 MAX 对复杂类型使用与置换相同的规则。 [#59498](https://github.com/ClickHouse/ClickHouse/pull/59498) ([Raúl Marín](https://github.com/Algunenano)).
* 修复传递 `update_insert_deduplication_token_in_dependent_materialized_views` 时的边界情况。 [#59544](https://github.com/ClickHouse/ClickHouse/pull/59544) ([Jordi Villar](https://github.com/jrdi)).
* 修复 arrayElement / map 对空值返回错误结果的问题。 [#59594](https://github.com/ClickHouse/ClickHouse/pull/59594) ([Raúl Marín](https://github.com/Algunenano)).
* 修复 topK 合并空状态时的崩溃。 [#59603](https://github.com/ClickHouse/ClickHouse/pull/59603) ([Raúl Marín](https://github.com/Algunenano)).
* 修复使用常量分片键的分布式表。 [#59606](https://github.com/ClickHouse/ClickHouse/pull/59606) ([Vitaly Baranov](https://github.com/vitlibar)).
* 修复 WingFuzz 发现的 KQL 问题。 [#59626](https://github.com/ClickHouse/ClickHouse/pull/59626) ([Yong Wang](https://github.com/kashwy)).
* 修复 AsynchronousBoundedReadBuffer 的“Read beyond last offset”错误。 [#59630](https://github.com/ClickHouse/ClickHouse/pull/59630) ([Vitaly Baranov](https://github.com/vitlibar)).
* 在 RewriteSumFunctionWithSumAndCountVisitor 中保留函数别名。 [#59658](https://github.com/ClickHouse/ClickHouse/pull/59658) ([Raúl Marín](https://github.com/Algunenano)).
* 修复非初始查询的查询开始时间。 [#59662](https://github.com/ClickHouse/ClickHouse/pull/59662) ([Raúl Marín](https://github.com/Algunenano)).
* 校验 `minmax` 数据跳过索引的参数类型。 [#59733](https://github.com/ClickHouse/ClickHouse/pull/59733) ([Anton Popov](https://github.com/CurtizJ)).
* 修复 leftPad / rightPad 函数对 FixedString 输入的处理。 [#59739](https://github.com/ClickHouse/ClickHouse/pull/59739) ([Raúl Marín](https://github.com/Algunenano)).
* 修复 AST 模糊测试器在函数 `countMatches` 中发现的问题。 [#59752](https://github.com/ClickHouse/ClickHouse/pull/59752) ([Robert Schulze](https://github.com/rschu1ze)).
* RabbitMQ：修复消息既未 ack 也未 nack 的问题。 [#59775](https://github.com/ClickHouse/ClickHouse/pull/59775) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复 StorageURL 将部分查询执行置于单线程的问题。 [#59833](https://github.com/ClickHouse/ClickHouse/pull/59833) ([Michael Kolupaev](https://github.com/al13n321)).
* S3Queue：修复未初始化的值。 [#59897](https://github.com/ClickHouse/ClickHouse/pull/59897) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复被括号包围的分区表达式的解析。 [#59901](https://github.com/ClickHouse/ClickHouse/pull/59901) ([János Benjamin Antal](https://github.com/antaljanosbenjamin)).
* 修复通过 HTTP 使用 JSONColumnsWithMetadata 格式时的崩溃。 [#59925](https://github.com/ClickHouse/ClickHouse/pull/59925) ([Kruglov Pavel](https://github.com/Avogar)).
* 在 Analyzer 中，若返回值不同，则不将 sum 重写为 count。 [#59926](https://github.com/ClickHouse/ClickHouse/pull/59926) ([Azat Khuzhin](https://github.com/azat)).
* 修复 UniqExactSet 读取崩溃。 [#59928](https://github.com/ClickHouse/ClickHouse/pull/59928) ([Maksim Kita](https://github.com/kitaisreal)).
* 修复 ReplicatedMergeTree 的无效 metadata\_version。 [#59946](https://github.com/ClickHouse/ClickHouse/pull/59946) ([Maksim Kita](https://github.com/kitaisreal)).
* 修复 `StorageDistributed` 中的数据竞态。 [#59987](https://github.com/ClickHouse/ClickHouse/pull/59987) ([Nikita Taranov](https://github.com/nickitat)).
* Docker：在选项启用而非禁用时运行初始化脚本。 [#59991](https://github.com/ClickHouse/ClickHouse/pull/59991) ([jktng](https://github.com/jktng)).
* 修复向 `SQLite` 插入含单引号数据的 INSERT（用单引号而非反斜杠转义单引号）。 [#60015](https://github.com/ClickHouse/ClickHouse/pull/60015) ([Azat Khuzhin](https://github.com/azat)).
* 修复 `arrayFold` 中的多个逻辑错误。 [#60022](https://github.com/ClickHouse/ClickHouse/pull/60022) ([Raúl Marín](https://github.com/Algunenano)).
* 修复 optimize\_uniq\_to\_count 移除列别名的问题。 [#60026](https://github.com/ClickHouse/ClickHouse/pull/60026) ([Raúl Marín](https://github.com/Algunenano)).
* 修复删除 S3Queue 表时可能发生的异常。 [#60036](https://github.com/ClickHouse/ClickHouse/pull/60036) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复 NOT 与单个字面量组合时的格式化。 [#60042](https://github.com/ClickHouse/ClickHouse/pull/60042) ([Raúl Marín](https://github.com/Algunenano)).
* 在 DDLLogEntry 中使用上下文中的 max\_query\_size，而非硬编码的 4096。 [#60083](https://github.com/ClickHouse/ClickHouse/pull/60083) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复含名为 `table` 的表的查询格式化不一致的问题。修复含 `UNION ALL`、`INTERSECT` 和 `EXCEPT` 的查询在结构非线性时格式化错误的问题。关闭 #52349。修复 `SYSTEM` 查询的格式化，包括 `SYSTEM ... DROP FILESYSTEM CACHE`、`SYSTEM ... REFRESH/START/STOP/CANCEL/TEST VIEW`、`SYSTEM ENABLE/DISABLE FAILPOINT`。修复参数化 DDL 查询的格式化。修复 `DESCRIBE FILESYSTEM CACHE` 查询的格式化。修复 `SET param_...`（设置参数的查询）的格式化错误。修复 `CREATE INDEX` 查询的格式化错误。修复 `CREATE USER` 及类似查询的格式化不一致问题。修复 `CREATE SETTINGS PROFILE` 的格式化不一致问题。修复 `ALTER ... MODIFY REFRESH` 的格式化错误。修复窗口函数在窗口框架偏移量为表达式时的格式化不一致问题。修复 `RESPECT NULLS` 和 `IGNORE NULLS` 用在实现运算符的函数（如 `plus`）之后时的格式化不一致问题。修复 `SYSTEM SYNC REPLICA ... LIGHTWEIGHT FROM ...` 的荒谬格式化。修复包含 `GROUP BY GROUPING SETS ... WITH ROLLUP/CUBE/TOTALS` 的无效查询的格式化不一致问题。修复 `GRANT CURRENT GRANTS` 的格式化不一致问题。修复 `CREATE TABLE (... COLLATE)` 的格式化不一致问题。此外，我修复了子查询中 `EXPLAIN` 的格式化错误（#60102）。修复 lambda 函数的格式化错误（#60012）。新增检查，确保今后不会再漏掉这些糟糕的问题。 [#60095](https://github.com/ClickHouse/ClickHouse/pull/60095) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复子查询中 explain 的格式化不一致问题。 [#60102](https://github.com/ClickHouse/ClickHouse/pull/60102) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复 cosineDistance 使用 Nullable 时的崩溃。 [#60150](https://github.com/ClickHouse/ClickHouse/pull/60150) ([Raúl Marín](https://github.com/Algunenano)).
* 允许将以字符串表示的布尔值转换为真正的布尔值。 [#60160](https://github.com/ClickHouse/ClickHouse/pull/60160) ([Robert Schulze](https://github.com/rschu1ze)).
* 修复 `system.s3queue_log`。 [#60166](https://github.com/ClickHouse/ClickHouse/pull/60166) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复 arrayReduce 使用可空聚合函数名称时的问题。 [#60188](https://github.com/ClickHouse/ClickHouse/pull/60188) ([Raúl Marín](https://github.com/Algunenano)).
* 隐藏 `S3Queue` 的敏感信息。 [#60233](https://github.com/ClickHouse/ClickHouse/pull/60233) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复 HTTP 异常码。 [#60252](https://github.com/ClickHouse/ClickHouse/pull/60252) ([Austin Kothig](https://github.com/kothiga)).
* S3Queue：修复一个缺陷（同时修复不稳定测试 test\_storage\_s3\_queue/test.py::test\_shards\_distributed）。 [#60282](https://github.com/ClickHouse/ClickHouse/pull/60282) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复哈希函数处理 IPv6 时使用未初始化值及结果无效的问题。 [#60359](https://github.com/ClickHouse/ClickHouse/pull/60359) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复 OptimizeDateOrDateTimeConverterWithPreimageVisitor 对 null 参数的处理。 [#60453](https://github.com/ClickHouse/ClickHouse/pull/60453) ([Raúl Marín](https://github.com/Algunenano)).
* 修复一个小缺陷：从 KQL 或 PRQL 方言客户端发送的分布式表查询无法在副本上执行。[#59674](https://github.com/ClickHouse/ClickHouse/issues/59674)。 [#60470](https://github.com/ClickHouse/ClickHouse/pull/60470) ([Alexey Milovidov](https://github.com/alexey-milovidov)) [#59674](https://github.com/ClickHouse/ClickHouse/pull/59674) ([Austin Kothig](https://github.com/kothiga)).
