<h3 id="a-id224a-clickhouse-release-224-2022-04-19">
  <a id="224" /> ClickHouse 22.4 版本, 2022-04-19. [演示文稿](https://presentations.clickhouse.com/2022-release-22.4/), [视频](https://www.youtube.com/watch?v=aFQs_zoYoXY)
</h3>

<Frame>
  <iframe src="https://www.youtube.com/embed/aFQs_zoYoXY" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
</Frame>

<h4 id="backward-incompatible-change-5">
  向后不兼容变更
</h4>

* INSERT 查询不再允许在 FORMAT 后指定 SETTINGS（兼容性设置 `allow_settings_after_format_in_insert` 可允许这类查询，但默认关闭）。[#35883](https://github.com/ClickHouse/ClickHouse/pull/35883)（[Azat Khuzhin](https://github.com/azat)）。
* 函数 `yandexConsistentHash`（由 Konstantin “kostik” Oblakov 编写的一致性哈希算法）重命名为 `kostikConsistentHash`。旧名称保留为别名以兼容现有用法。虽然此次变更向后兼容，但后续版本可能移除该别名，因此建议更新应用中对该函数的调用。[#35553](https://github.com/ClickHouse/ClickHouse/pull/35553)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。

<h4 id="new-feature-8">
  新功能
</h4>

* 为 ORDER BY ... WITH FILL 新增 INTERPOLATE 扩展。关闭 [#34903](https://github.com/ClickHouse/ClickHouse/issues/34903)。[#35349](https://github.com/ClickHouse/ClickHouse/pull/35349)（[Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)）。
* 支持处理器级别的性能分析（启用 `log_processors_profiles` 设置后，ClickHouse 会将处理器执行及等待数据所用的时间写入 `system.processors_profile_log` 表）。[#34355](https://github.com/ClickHouse/ClickHouse/pull/34355)（[Azat Khuzhin](https://github.com/azat)）。
* 新增函数 makeDate(year, month, day)、makeDate32(year, month, day)。[#35628](https://github.com/ClickHouse/ClickHouse/pull/35628)（[Alexander Gololobov](https://github.com/davenger)）。实现 makeDateTime() 和 makeDateTIme64()。[#35934](https://github.com/ClickHouse/ClickHouse/pull/35934)（[Alexander Gololobov](https://github.com/davenger)）。
* 支持新配额类型 `WRITTEN BYTES`，用于限制插入查询写入的字节数。[#35736](https://github.com/ClickHouse/ClickHouse/pull/35736)（[Anton Popov](https://github.com/CurtizJ)）。
* 新增函数 `flattenTuple`。它接收嵌套的具名 `Tuple`，返回展平后的 `Tuple`，其元素对应原始 `Tuple` 中的路径。例如：`Tuple(a Int, Tuple(b Int, c Int)) -> Tuple(a Int, b Int, c Int)`。可使用 `flattenTuple` 将 `Object` 类型中的所有路径选取为独立列。[#35690](https://github.com/ClickHouse/ClickHouse/pull/35690)（[Anton Popov](https://github.com/CurtizJ)）。
* 新增函数 `arrayFirstOrNull`、`arrayLastOrNull`。关闭 [#35238](https://github.com/ClickHouse/ClickHouse/issues/35238)。[#35414](https://github.com/ClickHouse/ClickHouse/pull/35414)（[Maksim Kita](https://github.com/kitaisreal)）。
* 新增函数 `minSampleSizeContinous` 和 `minSampleSizeConversion`。作者为 [achimbab](https://github.com/achimbab)。[#35360](https://github.com/ClickHouse/ClickHouse/pull/35360)（[Maksim Kita](https://github.com/kitaisreal)）。
* 新增函数 minSampleSizeContinous 和 minSampleSizeConversion。[#34354](https://github.com/ClickHouse/ClickHouse/pull/34354)（[achimbab](https://github.com/achimbab)）。
* 引入 `ProtobufList` 格式（在输出的 Protobuf 中将所有记录表示为重复消息）。关闭 [#16436](https://github.com/ClickHouse/ClickHouse/issues/16436)。[#35152](https://github.com/ClickHouse/ClickHouse/pull/35152)（[Nikolai Kochetov](https://github.com/KochetovNicolai)）。
* 新增函数 `h3PointDistM`、`h3PointDistKm`、`h3PointDistRads`、`h3GetRes0Indexes`、`h3GetPentagonIndexes`。[#34568](https://github.com/ClickHouse/ClickHouse/pull/34568)（[Bharat Nallan](https://github.com/bharatnc)）。
* 新增 `toLastDayOfMonth` 函数，将日期或日期时间向上取整到当月最后一天。[#33501](https://github.com/ClickHouse/ClickHouse/issues/33501)。[#34394](https://github.com/ClickHouse/ClickHouse/pull/34394)（[Habibullah Oladepo](https://github.com/holadepo)）。
* 为 \[Zoo]Keeper 客户端新增负载均衡设置。关闭 [#29617](https://github.com/ClickHouse/ClickHouse/issues/29617)。[#30325](https://github.com/ClickHouse/ClickHouse/pull/30325)（[小路](https://github.com/nicelulu)）。
* 新增名为 `simple` 的行策略类型。此 PR 之前有两种行策略：`permissive` 和 `restrictive`。`simple` 行策略会为表添加一个新筛选条件，且没有 permissive 和 restrictive 策略的那些副作用。[#35345](https://github.com/ClickHouse/ClickHouse/pull/35345)（[Vitaly Baranov](https://github.com/vitlibar)）。
* 支持在复制数据库中指定集群密钥。[#35333](https://github.com/ClickHouse/ClickHouse/pull/35333)（[Nikita Mikhaylov](https://github.com/nikitamikhaylov)）。
* 新增服务器启动时的基本合理性检查（可用内存与磁盘空间、最大线程数等）。[#34566](https://github.com/ClickHouse/ClickHouse/pull/34566)（[Sergei Trifonov](https://github.com/serxa)）。
* 改进 INTERVAL：可以与 `[MILLI|MICRO|NANO]SECOND` 一起使用。新增 `toStartOf[Milli|Micro|Nano]second()` 函数。新增 `[add|subtract][Milli|Micro|Nano]seconds()`。[#34353](https://github.com/ClickHouse/ClickHouse/pull/34353)（[Andrey Zvonov](https://github.com/zvonand)）。

<h4 id="experimental-feature-7">
  实验性功能
</h4>

* 为简单的 `MergeTree` 表新增事务支持。此功能仍处于高度实验阶段，不建议用于生产环境。属于 [#22086](https://github.com/ClickHouse/ClickHouse/issues/22086) 的一部分。[#24258](https://github.com/ClickHouse/ClickHouse/pull/24258)（[tavplubix](https://github.com/tavplubix)）。
* 在 `JSONEachRow` 格式中支持 `Object` 类型的结构推断。允许将 `Map` 类型列转换为 `Object` 类型列。[#35629](https://github.com/ClickHouse/ClickHouse/pull/35629)（[Anton Popov](https://github.com/CurtizJ)）。
* 允许所有写操作写入远程文件系统缓存。新增 `system.remote_filesystem_cache` 表。新增 `drop remote filesystem cache` 查询。通过 `system.remote_data_paths` 表提供 s3 元数据自省能力。关闭 [#34021](https://github.com/ClickHouse/ClickHouse/issues/34021)。新增 `read_from_filesystem_cache_if_exists_otherwise_bypass_cache` 模式，为合并提供缓存选项（对合并默认启用，也可通过同名查询设置启用）。重命名缓存相关设置（`remote_fs_enable_cache -> enable_filesystem_cache` 等）。[#35475](https://github.com/ClickHouse/ClickHouse/pull/35475)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 新增将数据片段元数据存储在 RocksDB 中的选项。加快 MergeTree 数据片段加载过程，从而缩短 clickhouse-server 启动时间。此次改进使拥有 70 万个 MergeTree 数据片段的 clickhouse-server 启动时间从 75 分钟缩短至 20 秒。[#32928](https://github.com/ClickHouse/ClickHouse/pull/32928)（[李扬](https://github.com/taiyang-li)）。

<h4 id="performance-improvement-8">
  性能改进
</h4>

* 新增查询计划优化：尽可能在 `ORDER BY` 后计算函数。例如，对于查询 `SELECT sipHash64(number) FROM numbers(1e8) ORDER BY number LIMIT 5`，函数 `sipHash64` 会在 `ORDER BY` 和 `LIMIT` 后计算，速度约提升至 20 倍。[#35623](https://github.com/ClickHouse/ClickHouse/pull/35623)（[Nikita Taranov](https://github.com/nickitat)）。
* 现在会收集聚合所用哈希表的大小，并将其用于后续查询，以避免哈希表扩容。[#33439](https://github.com/ClickHouse/ClickHouse/pull/33439)（[Nikita Taranov](https://github.com/nickitat)）。
* 使用 SIMD 指令（SSE 和 AVX2）优化 hasAll 函数。[#27653](https://github.com/ClickHouse/ClickHouse/pull/27653)（[youennL-cs](https://github.com/youennL-cs)）。[#35723](https://github.com/ClickHouse/ClickHouse/pull/35723)（[Maksim Kita](https://github.com/kitaisreal)）。
* 通过多项变更提升 ASOF JOIN 性能（速度达到原来的 1.2–1.6 倍），同时增加大整数支持。[#34733](https://github.com/ClickHouse/ClickHouse/pull/34733)（[Raúl Marín](https://github.com/Algunenano)）。
* 当键为原生整数时，提升 ASOF JOIN 性能。[#35525](https://github.com/ClickHouse/ClickHouse/pull/35525)（[Maksim Kita](https://github.com/kitaisreal)）。
* 并行执行向 S3 存储的分段上传。[#35343](https://github.com/ClickHouse/ClickHouse/pull/35343)（[Sergei Trifonov](https://github.com/serxa)）。
* 如果端点支持 HTTP Range，URL 存储引擎现在会并行下载多个数据块。新增 `max_download_threads` 和 `max_download_buffer_size` 两项设置，分别控制单个查询下载文件可使用的最大线程数以及每个线程可处理的最大字节数。[#35150](https://github.com/ClickHouse/ClickHouse/pull/35150)（[Antonio Andelic](https://github.com/antonio2368)）。
* 使用多个线程从 S3 下载对象。可通过 `max_download_threads` 和 `max_download_buffer_size` 设置控制下载行为。[#35571](https://github.com/ClickHouse/ClickHouse/pull/35571)（[Antonio Andelic](https://github.com/antonio2368)）。
* 缩小与 HDFS 交互时互斥锁的作用范围。与 [#35292](https://github.com/ClickHouse/ClickHouse/issues/35292) 相关。[#35646](https://github.com/ClickHouse/ClickHouse/pull/35646)（[shuchaome](https://github.com/shuchaome)）。
* 仅在表级 TTL 发生变化时才要求执行变更操作。[#35953](https://github.com/ClickHouse/ClickHouse/pull/35953)（[Azat Khuzhin](https://github.com/azat)）。

<h4 id="improvement-8">
  改进
</h4>

* 结构推断的多项改进。通过一些调整与启发式方法，识别 CSV、TSV 和 TSVRaw 数据格式中的数字、字符串、数组、元组和映射。为 CSV 格式新增 `input_format_csv_use_best_effort_in_schema_inference` 设置，用于启用或禁用这些启发式方法；禁用时将所有内容视为字符串。为 TSV/TSVRaw 格式新增类似设置 `input_format_tsv_use_best_effort_in_schema_inference`。这些设置默认启用。- 在 Values 格式的结构推断中支持 Map。- 修复 Values 格式结构推断时可能发生的段错误。- 允许跳过 Arrow/ORC/Parquet 格式中不受支持类型的列，新增对应设置 `input_format_{parquet|orc|arrow}_skip_columns_with_unsupported_types_in_schema_inference`，这些设置默认禁用。- 允许将 Arrow/Parquet 格式中的 Null 类型列转换为值全部为 NULL 的 Nullable 列。- 对于不包含列名的格式（如 CSV、TSV、JSONCompactEachRow 等），允许通过 `column_names_for_schema_inference` 设置在结构推断时指定列名。- 修复 ORC/Arrow/Parquet 格式中 Nullable 列的结构推断：此前推断出的类型均非 Nullable，导致无法读取数据中的 Nullable 列；现已修复，推断类型始终为 Nullable（因为无法仅通过读取结构判断列是否可为空）。- 修复采用 CSV 转义规则的 Template 格式的结构推断。[#35582](https://github.com/ClickHouse/ClickHouse/pull/35582)（[Kruglov Pavel](https://github.com/Avogar)）。
* 为 `JSONAsObject` 格式新增并行解析和结构推断。[#35592](https://github.com/ClickHouse/ClickHouse/pull/35592)（[Anton Popov](https://github.com/CurtizJ)）。
* 为 `s3Cluster` 表函数新增自动结构推断支持。统一 `s3 ` 与 `s3Cluster` 的函数签名。[#35544](https://github.com/ClickHouse/ClickHouse/pull/35544)（[Nikita Mikhaylov](https://github.com/nikitamikhaylov)）。
* 为 `hdfsCluster` 新增结构推断支持。[#35602](https://github.com/ClickHouse/ClickHouse/pull/35602)（[Nikita Mikhaylov](https://github.com/nikitamikhaylov)）。
* 新增 `input_format_json_read_bools_as_numbers` 设置，允许在 JSON 输入格式中将布尔值推断并解析为数字。默认启用。此建议来自 @alexey-milovidov。[#35735](https://github.com/ClickHouse/ClickHouse/pull/35735)（[Kruglov Pavel](https://github.com/Avogar)）。
* 改进 TSKV 和 JSONEachRow 格式结构推断时的列顺序，关闭 [#35640](https://github.com/ClickHouse/ClickHouse/issues/35640)。在这些格式的结构推断过程中，读取空行时不再停止推断。[#35724](https://github.com/ClickHouse/ClickHouse/pull/35724)（[Kruglov Pavel](https://github.com/Avogar)）。
* 新增设置 `input_format_orc_case_insensitive_column_matching`、`input_format_arrow_case_insensitive_column_matching` 和 `input_format_parquet_case_insensitive_column_matching`，允许 ClickHouse 在读取 ORC、Arrow 或 Parquet 文件时，以不区分大小写的方式匹配列。[#35459](https://github.com/ClickHouse/ClickHouse/pull/35459)（[Antonio Andelic](https://github.com/antonio2368)）。
* 为 `system.query_log` 新增 `is_secure` 列，表示客户端是否通过 TCP 或 HTTP 使用安全连接。[#35705](https://github.com/ClickHouse/ClickHouse/pull/35705)（[Antonio Andelic](https://github.com/antonio2368)）。
* 在资源较少的机器上（少于 16 核），`kafka_num_consumers` 现在可以大于物理核心数。[#35926](https://github.com/ClickHouse/ClickHouse/pull/35926)（[alesapin](https://github.com/alesapin)）。
* 新增一些用于监控 engine=Kafka 表的基本指标。[#35916](https://github.com/ClickHouse/ClickHouse/pull/35916)（[filimonov](https://github.com/filimonov)）。
* 对于 MergeTree 引擎家族，现在不允许对不存在的设置执行 `ALTER TABLE ... RESET SETTING`。修复 [#35816](https://github.com/ClickHouse/ClickHouse/issues/35816)。[#35884](https://github.com/ClickHouse/ClickHouse/pull/35884)（[alesapin](https://github.com/alesapin)）。
* 现在，对 `Arrays` 和 `Nullable` 类型的某些 `ALTER MODIFY COLUMN` 查询可以仅修改元数据，无需执行数据变更。例如，从 `Array(Enum8('Option1'=1))` 修改为 `Array(Enum8('Option1'=1, 'Option2'=2))`。[#35882](https://github.com/ClickHouse/ClickHouse/pull/35882)（[alesapin](https://github.com/alesapin)）。
* 为沙漏图标添加动画，向用户表明查询正在运行。[#35860](https://github.com/ClickHouse/ClickHouse/pull/35860)（[peledni](https://github.com/peledni)）。
* 支持 ALTER TABLE t DETACH PARTITION (ALL)。[#35794](https://github.com/ClickHouse/ClickHouse/pull/35794)（[awakeljw](https://github.com/awakeljw)）。
* 改进投影分析，以优化 `count()` 等简单查询。[#35788](https://github.com/ClickHouse/ClickHouse/pull/35788)（[Amos Bird](https://github.com/amosbird)）。
* 支持使用 `input` 表函数的 insert select 查询进行结构推断。对于从支持结构推断的表函数执行的 insert select，从目标插入表获取结构，而不是从数据中推断。关闭 [#35639](https://github.com/ClickHouse/ClickHouse/issues/35639)。[#35760](https://github.com/ClickHouse/ClickHouse/pull/35760)（[Kruglov Pavel](https://github.com/Avogar)）。
* Hive 表现在遵循 `remote_url_allow_hosts` 设置。[#35743](https://github.com/ClickHouse/ClickHouse/pull/35743)（[李扬](https://github.com/taiyang-li)）。
* 为 clickhouse-local 实现 `send_logs_level`。关闭 [#35653](https://github.com/ClickHouse/ClickHouse/issues/35653)。[#35716](https://github.com/ClickHouse/ClickHouse/pull/35716)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 关闭 [#35641](https://github.com/ClickHouse/ClickHouse/issues/35641)。允许 `EPHEMERAL` 列不显式指定默认表达式。[#35706](https://github.com/ClickHouse/ClickHouse/pull/35706)（[Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)）。
* 新增性能事件计数器 `AsyncInsertBytes`，记录异步 INSERT 的大小。[#35644](https://github.com/ClickHouse/ClickHouse/pull/35644)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 改进 JOIN 的执行流水线描述。[#35612](https://github.com/ClickHouse/ClickHouse/pull/35612)（[何李夫](https://github.com/helifu)）。
* 推导 hdfs 配置的绝对路径。[#35572](https://github.com/ClickHouse/ClickHouse/pull/35572)（[李扬](https://github.com/taiyang-li)）。
* 改进 clickhouse-client 的粘贴性能与兼容性。有助于解决 [#35501](https://github.com/ClickHouse/ClickHouse/issues/35501)。[#35541](https://github.com/ClickHouse/ClickHouse/pull/35541)（[Amos Bird](https://github.com/amosbird)）。
* 如果启用了 `async_socket_for_remote` 或 `use_hedged_requests` 设置，在分布式查询中解析嵌套很深的数据类型时，可能发生栈溢出（至少在调试构建中如此）。关闭 [#35509](https://github.com/ClickHouse/ClickHouse/issues/35509)。[#35524](https://github.com/ClickHouse/ClickHouse/pull/35524)（[Kruglov Pavel](https://github.com/Avogar)）。
* 为 `system.parts_columns` 表添加子列大小。[#35488](https://github.com/ClickHouse/ClickHouse/pull/35488)（[Anton Popov](https://github.com/CurtizJ)）。
* 为查询计划和执行流水线的扫描节点添加明确的表信息。[#35460](https://github.com/ClickHouse/ClickHouse/pull/35460)（[何李夫](https://github.com/helifu)）。
* 允许服务器绑定低编号端口（如 443）。ClickHouse 安装脚本会为二进制文件设置 `cap_net_bind_service`。[#35451](https://github.com/ClickHouse/ClickHouse/pull/35451)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 INSERT INTO table FROM INFILE 不显示进度条的问题。[#35429](https://github.com/ClickHouse/ClickHouse/pull/35429)（[xiedeyantu](https://github.com/xiedeyantu)）。
* 为 `clickhouse-diagnostics` 工具新增参数 `--user`、`--password`、`--host`、`--port`。[#35422](https://github.com/ClickHouse/ClickHouse/pull/35422)（[李扬](https://github.com/taiyang-li)）。
* 为 Postgres 引擎支持 uuid。关闭 [#35384](https://github.com/ClickHouse/ClickHouse/issues/35384)。[#35403](https://github.com/ClickHouse/ClickHouse/pull/35403)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 对于表函数 `s3cluster`、`HDFSCluster` 或 `hive`，无法通过 `StorageFactory::instance().getSourceAccessType(getStorageTypeName())` 获取正确的 `AccessType`。此 PR 修复了该问题。[#35365](https://github.com/ClickHouse/ClickHouse/pull/35365)（[李扬](https://github.com/taiyang-li)）。
* 移除 clickhouse-client 的 `--testmode` 选项，并无条件启用该模式。[#35354](https://github.com/ClickHouse/ClickHouse/pull/35354)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 禁止对 clickhouse-keeper 执行 `wchc` 操作（四字母命令）。[#35320](https://github.com/ClickHouse/ClickHouse/pull/35320)（[zhangyuli1](https://github.com/zhangyuli1)）。
* 新增函数 `getTypeSerializationStreams`。对于指定类型（从列中检测），返回包含所有序列化子流路径的数组。此函数主要供开发者使用。[#35290](https://github.com/ClickHouse/ClickHouse/pull/35290)（[李扬](https://github.com/taiyang-li)）。
* 如果集群配置未指定 `port`，则使用默认服务器端口。关闭 [#34769](https://github.com/ClickHouse/ClickHouse/issues/34769)。[#34772](https://github.com/ClickHouse/ClickHouse/pull/34772)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 在 Hive 引擎中为 orc/parquet 文件使用 `minmax` 索引。相关 PR：[https://github.com/ClickHouse/arrow/pull/10](https://github.com/ClickHouse/arrow/pull/10)。[#34631](https://github.com/ClickHouse/ClickHouse/pull/34631)（[李扬](https://github.com/taiyang-li)）。
* 系统日志表现在允许在 ENGINE 声明中指定 COMMENT。关闭 [#33768](https://github.com/ClickHouse/ClickHouse/issues/33768)。[#34536](https://github.com/ClickHouse/ClickHouse/pull/34536)（[Maksim Kita](https://github.com/kitaisreal)）。
* 在按排序键顺序读取且指定了限制时，正确支持 `max_rows_to_read` 设置。此前，即使查询实际需要读取的行数较少，也可能抛出 `Limit for rows or bytes to read exceeded` 异常。[#33230](https://github.com/ClickHouse/ClickHouse/pull/33230)（[Anton Popov](https://github.com/CurtizJ)）。
* 仅遵循 cgroups 的 quota 和 period，忽略 shares（它实际上不会限制可使用的核心数量）。[#35815](https://github.com/ClickHouse/ClickHouse/pull/35815)（[filimonov](https://github.com/filimonov)）。

<h4 id="buildtestingpackaging-improvement-8">
  构建/测试/打包改进
</h4>

* 在功能测试中新增一批随机化设置。[#35047](https://github.com/ClickHouse/ClickHouse/pull/35047)（[Kruglov Pavel](https://github.com/Avogar)）。
* 在压力测试中新增向后兼容性检查。关闭 [#25088](https://github.com/ClickHouse/ClickHouse/issues/25088)。[#27928](https://github.com/ClickHouse/ClickHouse/pull/27928)（[Kruglov Pavel](https://github.com/Avogar)）。
* 将软件包构建迁移至 `nfpm`：弃用 `release` 脚本，改用 `packages/build`；在 clickhouse/binary-builder 镜像中构建所有内容（清理 clickhouse/deb-builder）；为 cmake 增加符号剥离（待办：使用 $prefix/lib/$bin\_dir/clickhouse/\$binary.debug）；修复 DWARF 符号问题；新增 Alpine APK 软件包；将 `alien` 重命名为 `additional_pkgs`。[#33664](https://github.com/ClickHouse/ClickHouse/pull/33664)（[Mikhail f. Shiryaev](https://github.com/Felixoid)）。
* 新增 Coverity 夜间扫描与上传。[#34895](https://github.com/ClickHouse/ClickHouse/pull/34895)（[Boris Kuschel](https://github.com/bkuschel)）。
* 为 `clickhouse-keeper` 提供专用的小型软件包。[#35308](https://github.com/ClickHouse/ClickHouse/pull/35308)（[Mikhail f. Shiryaev](https://github.com/Felixoid)）。
* 修复使用 podman 运行失败的问题：它会报告同一卷被指定了两次。[#35978](https://github.com/ClickHouse/ClickHouse/pull/35978)（[Roman Nikonov](https://github.com/nic11)）。
* 小幅改进 contrib/krb5 构建配置。[#35832](https://github.com/ClickHouse/ClickHouse/pull/35832)（[Anton Kozlov](https://github.com/tonickkozlov)）。
* 为每个镜像增加用于识别构建任务的标签。[#35583](https://github.com/ClickHouse/ClickHouse/pull/35583)（[Mikhail f. Shiryaev](https://github.com/Felixoid)）。
* 对 Python 代码应用 `black` 格式化工具，并添加每次提交时的检查。[#35466](https://github.com/ClickHouse/ClickHouse/pull/35466)（[Mikhail f. Shiryaev](https://github.com/Felixoid)）。
* 重做 alpine 镜像，使用简洁的 Dockerfile。在 tests/ci 中创建用于构建 ubuntu 和 alpine 镜像的脚本。新增 clickhouse-keeper 镜像（抄送 @nikitamikhaylov）。为 PullRequestCI 添加构建检查。为 ReleaseCI 添加一个任务。为 MasterCI 添加任务，在每个 PR 合并后构建并推送 `clickhouse/clickhouse-server:head` 和 `clickhouse/clickhouse-keeper:head` 镜像。[#35211](https://github.com/ClickHouse/ClickHouse/pull/35211)（[Mikhail f. Shiryaev](https://github.com/Felixoid)）。
* 修复 CI 中的压力测试报告：现在仅上传一次包含已启动压力测试信息的运行日志。[#35093](https://github.com/ClickHouse/ClickHouse/pull/35093)（[Mikhail f. Shiryaev](https://github.com/Felixoid)）。
* 切换至 LLVM 14 提供的 libcxx / libcxxabi。[#34906](https://github.com/ClickHouse/ClickHouse/pull/34906)（[Raúl Marín](https://github.com/Algunenano)）。
* 更新 unixodbc 以缓解 CVE-2018-7485。注意：此 CVE 不影响 ClickHouse，因为 ClickHouse 为 ODBC 实现了自身的隔离层。[#35943](https://github.com/ClickHouse/ClickHouse/pull/35943)（[Mikhail f. Shiryaev](https://github.com/Felixoid)）。

<h4 id="bug-fix-4">
  错误修复
</h4>

* 新增设置 `input_format_ipv4_default_on_conversion_error`、`input_format_ipv6_default_on_conversion_error`，允许将无效 IP 地址作为默认值插入表中。关闭 [#35726](https://github.com/ClickHouse/ClickHouse/issues/35726)。[#35733](https://github.com/ClickHouse/ClickHouse/pull/35733)（[Maksim Kita](https://github.com/kitaisreal)）。
* 从 Hive 读取数据时，避免从数据块中删除不存在的列。[#35393](https://github.com/ClickHouse/ClickHouse/pull/35393)（[lgbo](https://github.com/lgbo-ustc)）。
* 在创建物化视图时增加类型检查。关闭 [#23684](https://github.com/ClickHouse/ClickHouse/issues/23684)。[#24896](https://github.com/ClickHouse/ClickHouse/pull/24896)（[hexiaoting](https://github.com/hexiaoting)）。
* 修复 INSERT INFILE 查询格式化时缺少引号的问题。[#35886](https://github.com/ClickHouse/ClickHouse/pull/35886)（[Azat Khuzhin](https://github.com/azat)）。
* 禁用 `session_log`，因为模糊测试发现了内存安全问题。参见 [#35714](https://github.com/ClickHouse/ClickHouse/issues/35714)。[#35873](https://github.com/ClickHouse/ClickHouse/pull/35873)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 避免重复处理列级 TTL。[#35820](https://github.com/ClickHouse/ClickHouse/pull/35820)（[Azat Khuzhin](https://github.com/azat)）。
* 修复插入查询包含多个分区的数据时，向 `Object` 类型列插入数据的问题。[#35806](https://github.com/ClickHouse/ClickHouse/pull/35806)（[Anton Popov](https://github.com/CurtizJ)）。
* 修复 -WithNames 格式中缺失列的索引错误，该问题会在列数超过 256 时导致 `INCORRECT_NUMBER_OF_COLUMNS ` 错误。关闭 [#35793](https://github.com/ClickHouse/ClickHouse/issues/35793)。[#35803](https://github.com/ClickHouse/ClickHouse/pull/35803)（[Kruglov Pavel](https://github.com/Avogar)）。
* 修复 [#35751](https://github.com/ClickHouse/ClickHouse/issues/35751)。[#35799](https://github.com/ClickHouse/ClickHouse/pull/35799)（[Nikolay Degterinsky](https://github.com/evillique)）。
* 修复从 HDFS 读取 Snappy 格式数据的问题。[#35771](https://github.com/ClickHouse/ClickHouse/pull/35771)（[shuchaome](https://github.com/shuchaome)）。
* 修复将自定义类型转换为字符串时可能发生段错误或出现意外错误消息的问题。关闭 [#35752](https://github.com/ClickHouse/ClickHouse/issues/35752)。[#35755](https://github.com/ClickHouse/ClickHouse/pull/35755)（[Kruglov Pavel](https://github.com/Avogar)）。
* 修复 any/all (subquery) 的实现。关闭 [#35489](https://github.com/ClickHouse/ClickHouse/issues/35489)。[#35727](https://github.com/ClickHouse/ClickHouse/pull/35727)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复 clickhouse-local 删除非空数据库的问题。关闭 [#35692](https://github.com/ClickHouse/ClickHouse/issues/35692)。[#35711](https://github.com/ClickHouse/ClickHouse/pull/35711)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复服务器重启后创建带子查询的物化视图的问题：服务器重启后向底层表插入数据时，物化视图不会更新。关闭 [#35511](https://github.com/ClickHouse/ClickHouse/issues/35511)。[#35691](https://github.com/ClickHouse/ClickHouse/pull/35691)（[Kruglov Pavel](https://github.com/Avogar)）。
* 修复读取实验性 `Object` 类型的子列时可能出现的 `Can't adjust last granule` 异常。[#35687](https://github.com/ClickHouse/ClickHouse/pull/35687)（[Anton Popov](https://github.com/CurtizJ)）。
* 默认启用包含 JIT 编译功能的构建。[#35683](https://github.com/ClickHouse/ClickHouse/pull/35683)（[Maksim Kita](https://github.com/kitaisreal)）。
* 修复实验性 `Object` 类型可能丢失子列的问题。[#35682](https://github.com/ClickHouse/ClickHouse/pull/35682)（[Anton Popov](https://github.com/CurtizJ)）。
* 修复 ASOF JOIN 键的可空性检查，关闭 [#35565](https://github.com/ClickHouse/ClickHouse/issues/35565)。[#35674](https://github.com/ClickHouse/ClickHouse/pull/35674)（[Vladimir C](https://github.com/vdimir)）。
* 修复带投影的数据片段的检查逻辑。当投影与主数据片段类型不同时会发生错误。此问题与 [https://github.com/ClickHouse/ClickHouse/pull/33774](https://github.com/ClickHouse/ClickHouse/pull/33774) 类似，由 @caoyang10 处理。[#35667](https://github.com/ClickHouse/ClickHouse/pull/35667)（[Amos Bird](https://github.com/amosbird)）。
* 修复向 `format` 函数传入大量参数时服务器崩溃的问题。请参考测试文件了解崩溃的复现方法。[#35651](https://github.com/ClickHouse/ClickHouse/pull/35651)（[Amos Bird](https://github.com/amosbird)）。
* 修复异步插入时的配额使用。[#35645](https://github.com/ClickHouse/ClickHouse/pull/35645)（[Anton Popov](https://github.com/CurtizJ)）。
* 修复带别名的位置参数。关闭 [#35600](https://github.com/ClickHouse/ClickHouse/issues/35600)。[#35620](https://github.com/ClickHouse/ClickHouse/pull/35620)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 在 URL 引擎执行结构推断之前检查 `remote_url_allow_hosts`。关闭 [#35064](https://github.com/ClickHouse/ClickHouse/issues/35064)。[#35619](https://github.com/ClickHouse/ClickHouse/pull/35619)（[Kruglov Pavel](https://github.com/Avogar)）。
* 修复使用 `LowCardinality` 类型列时的 `HashJoin` 问题。关闭 [#35548](https://github.com/ClickHouse/ClickHouse/issues/35548)。[#35616](https://github.com/ClickHouse/ClickHouse/pull/35616)（[Antonio Andelic](https://github.com/antonio2368)）。
* 修复 MaterializedPostgreSQL 中可能发生的段错误：将内存中收集的数据同步到底层表时发生异常会触发该问题。关闭 [#35611](https://github.com/ClickHouse/ClickHouse/issues/35611)。[#35614](https://github.com/ClickHouse/ClickHouse/pull/35614)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复 `database_atomic_wait_for_drop_and_detach_synchronously` 设置在此前分离的表仍被使用时，对 `ATTACH TABLE` 查询不起正确作用的问题。[#35594](https://github.com/ClickHouse/ClickHouse/pull/35594)（[tavplubix](https://github.com/tavplubix)）。
* 修复命名集合中的 HTTP 标头，新增 compression\_method。关闭 [#35273](https://github.com/ClickHouse/ClickHouse/issues/35273)。关闭 [#35269](https://github.com/ClickHouse/ClickHouse/issues/35269)。[#35593](https://github.com/ClickHouse/ClickHouse/pull/35593)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复 s3 引擎获取虚拟列的问题。关闭 [#35411](https://github.com/ClickHouse/ClickHouse/issues/35411)。[#35586](https://github.com/ClickHouse/ClickHouse/pull/35586)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复 `caseWithExpression` 的返回类型推导。现在会正确考虑 ELSE 分支的类型。[#35576](https://github.com/ClickHouse/ClickHouse/pull/35576)（[Antonio Andelic](https://github.com/antonio2368)）。
* 修复解析长度超过 39 个字符的 IPv6 地址的问题。关闭 [#34022](https://github.com/ClickHouse/ClickHouse/issues/34022)。[#35539](https://github.com/ClickHouse/ClickHouse/pull/35539)（[Maksim Kita](https://github.com/kitaisreal)）。
* 修复 IN 子句中转换为 IPv4、IPv6 地址的问题。修复 [#35528](https://github.com/ClickHouse/ClickHouse/issues/35528)。[#35534](https://github.com/ClickHouse/ClickHouse/pull/35534)（[Maksim Kita](https://github.com/kitaisreal)）。
* 修复函数短路求值时某个参数为可空常量所导致的崩溃。关闭 [#35497](https://github.com/ClickHouse/ClickHouse/issues/35497)。关闭 [#35496](https://github.com/ClickHouse/ClickHouse/issues/35496)。[#35502](https://github.com/ClickHouse/ClickHouse/pull/35502)（[Maksim Kita](https://github.com/kitaisreal)）。
* 修复 `throwIf` 函数参数为常量时发生的崩溃。[#35500](https://github.com/ClickHouse/ClickHouse/pull/35500)（[Maksim Kita](https://github.com/kitaisreal)）。
* 修复 Keeper 中可能导致客户端连接不稳定的问题，该问题由 [#35031](https://github.com/ClickHouse/ClickHouse/issues/35031) 引入。[#35498](https://github.com/ClickHouse/ClickHouse/pull/35498)（[alesapin](https://github.com/alesapin)）。
* 修复 `if` 函数的结果列类型与结果数据类型不一致时，导致 `Logical error: 'Bad cast from type DB::ColumnVector<int> to DB::ColumnVector<long>'.` 等逻辑错误的问题。关闭 [#35367](https://github.com/ClickHouse/ClickHouse/issues/35367)。[#35476](https://github.com/ClickHouse/ClickHouse/pull/35476)（[Kruglov Pavel](https://github.com/Avogar)）。
* 修复将 S3 用作 MergeTree 后端或独立表引擎/表函数时日志过多的问题。修复 [#30559](https://github.com/ClickHouse/ClickHouse/issues/30559)。[#35434](https://github.com/ClickHouse/ClickHouse/pull/35434)（[alesapin](https://github.com/alesapin)）。
* 现在，采用零拷贝复制（实验性功能）执行的合并不会再反复输出日志消息 `Found parts with the same min block and with the same max block as the missing part _ on replica _. Hoping that it will eventually appear as a result of a merge.`。[#35430](https://github.com/ClickHouse/ClickHouse/pull/35430)（[alesapin](https://github.com/alesapin)）。
* 避免 GroupingAggregatedTransform 中出现空数据块时可能触发的异常。[#35417](https://github.com/ClickHouse/ClickHouse/pull/35417)（[Nikita Taranov](https://github.com/nickitat)）。
* 修复 Arrow/Parquet/ORC 格式对查询不需要的列的处理，避免文件包含不受支持类型的列且查询未使用该列时，可能出现的 `Unsupported <format> type <type> of an input column <column_name>` 等错误。[#35406](https://github.com/ClickHouse/ClickHouse/pull/35406)（[Kruglov Pavel](https://github.com/Avogar)）。
* 修复远程文件系统本地缓存（实验性功能）在高并发边界情况下的问题。[#35381](https://github.com/ClickHouse/ClickHouse/pull/35381)（[Kseniia Sumarokova](https://github.com/kssenii)）。修复缓存中可能发生的死锁。[#35378](https://github.com/ClickHouse/ClickHouse/pull/35378)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复 `WHERE` 中与常量比较时的分区裁剪。如果列与常量类型不同，可能发生溢出，导致查询错误地返回空结果。修复 [#35304](https://github.com/ClickHouse/ClickHouse/issues/35304)。[#35334](https://github.com/ClickHouse/ClickHouse/pull/35334)（[Amos Bird](https://github.com/amosbird)）。
* 修复 max\_read\_buffer\_size 较小时 TSKV 格式的结构推断。[#35332](https://github.com/ClickHouse/ClickHouse/pull/35332)（[Kruglov Pavel](https://github.com/Avogar)）。
* 修复启用稀疏列的表中的数据变更操作。[#35284](https://github.com/ClickHouse/ClickHouse/pull/35284)（[Anton Popov](https://github.com/CurtizJ)）。
* 默认不延迟最终数据片段的写入（新增 `max_insert_delayed_streams_for_parallel_write`，对 s3 写入默认设为 1000，其他情况保持禁用，以修复 `INSERT` 时可能出现的 `Memory limit exceeded` 错误）。[#34780](https://github.com/ClickHouse/ClickHouse/pull/34780)（[Azat Khuzhin](https://github.com/azat)）。
