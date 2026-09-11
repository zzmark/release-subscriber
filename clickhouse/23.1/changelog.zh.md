<h3 id="231">
  <a id="231" /> ClickHouse 23.1 版本, 2023-01-26. [演示文稿](https://presentations.clickhouse.com/2023-release-23.1/), [视频](https://www.youtube.com/watch?v=zYSZXBnTMSE)
</h3>

<Frame>
  <iframe src="https://www.youtube.com/embed/zYSZXBnTMSE" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
</Frame>

<h3 id="clickhouse-release-231">
  ClickHouse 23.1 版本
</h3>

<h4 id="upgrade-notes-2">
  升级说明
</h4>

* `SYSTEM RESTART DISK` 查询改为空操作。 [#44647](https://github.com/ClickHouse/ClickHouse/pull/44647) ([alesapin](https://github.com/alesapin)).
* `HASHED`/`SPARSE_HASHED` 字典的 `PREALLOCATE` 选项改为空操作。它已无法带来显著收益。 [#45388](https://github.com/ClickHouse/ClickHouse/pull/45388) ([Azat Khuzhin](https://github.com/azat)).
* 禁止对非 Float32 或 Float64 类型的列使用 `Gorilla` 编解码器。此前这样做没有意义，还会导致不一致。 [#45252](https://github.com/ClickHouse/ClickHouse/pull/45252) ([Robert Schulze](https://github.com/rschu1ze)).
* 使用已弃用语法创建的 `*MergeTree` 表在执行并行仲裁插入时可能出错，因此已完全禁用此类表的并行仲裁插入支持。使用新语法创建的表不受影响。 [#45430](https://github.com/ClickHouse/ClickHouse/pull/45430) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 使用 `GetObjectAttributes` 请求代替 `HeadObject` 请求获取 AWS S3 对象大小。这项变更例如可以修复 AWS SDK 更新后对未明确指定区域的端点的处理。已测试 AWS S3 和 Minio，但各种 S3 兼容服务（GCS、R2、B2）可能存在细微的不兼容之处。此项变更也可能要求调整 ACL，以允许 `GetObjectAttributes` 请求。 [#45288](https://github.com/ClickHouse/ClickHouse/pull/45288) ([Vitaly Baranov](https://github.com/vitlibar)).
* 禁止在时区名称中使用路径。例如，不再允许 `/usr/share/zoneinfo/Asia/Aden` 这样的时区名称，应使用 `Asia/Aden` 这样的 IANA 时区数据库名称。 [#44225](https://github.com/ClickHouse/ClickHouse/pull/44225) ([Kruglov Pavel](https://github.com/Avogar)).
* 禁止同时包含等值连接和常量表达式的查询（例如 `JOIN ON t1.x = t2.x AND 1 = 1`），因为此类查询会产生错误结果。 [#44016](https://github.com/ClickHouse/ClickHouse/pull/44016) ([Vladimir C](https://github.com/vdimir)).

<h4 id="new-feature-11">
  新功能
</h4>

* 新增通过遍历正则表达式树提取键的字典数据源，可用于解析 User-Agent。 [#40878](https://github.com/ClickHouse/ClickHouse/pull/40878) ([Vage Ogannisian](https://github.com/nooblose)). [#43858](https://github.com/ClickHouse/ClickHouse/pull/43858) ([Han Fei](https://github.com/hanfei1991))。
* 新增参数化视图功能，现在可以为 View 表引擎指定查询参数。解决 [#40907](https://github.com/ClickHouse/ClickHouse/issues/40907)。 [#41687](https://github.com/ClickHouse/ClickHouse/pull/41687) ([SmitaRKulkarni](https://github.com/SmitaRKulkarni)).
* 新增 `quantileInterpolatedWeighted`/`quantilesInterpolatedWeighted` 函数。 [#38252](https://github.com/ClickHouse/ClickHouse/pull/38252) ([Bharat Nallan](https://github.com/bharatnc)).
* 为 `Map` 类型支持数组连接，类似于 Spark 中的 “explode” 函数。 [#43239](https://github.com/ClickHouse/ClickHouse/pull/43239) ([李扬](https://github.com/taiyang-li)).
* 支持 SQL 标准中的二进制和十六进制字符串字面量。 [#43785](https://github.com/ClickHouse/ClickHouse/pull/43785) ([Mo Xuan](https://github.com/mo-avatar)).
* 支持采用 Joda-Time 风格格式化 `DateTime`。请参阅 [Joda-Time 文档](https://joda-time.sourceforge.net/apidocs/org/joda/time/format/DateTimeFormat.html)。 [#43818](https://github.com/ClickHouse/ClickHouse/pull/43818) ([李扬](https://github.com/taiyang-li)).
* 为 `formatDateTime` 实现小数秒格式化符（`%f`）。 [#44060](https://github.com/ClickHouse/ClickHouse/pull/44060) ([ltrk2](https://github.com/ltrk2)). [#44497](https://github.com/ClickHouse/ClickHouse/pull/44497) ([Alexander Gololobov](https://github.com/davenger))。
* 新增 `age` 函数，用完整单位数表示两个日期或日期时间值之间的差。关闭 [#41115](https://github.com/ClickHouse/ClickHouse/issues/41115)。 [#44421](https://github.com/ClickHouse/ClickHouse/pull/44421) ([Robert Schulze](https://github.com/rschu1ze)).
* 为字典新增 `Null` 数据源。关闭 [#44240](https://github.com/ClickHouse/ClickHouse/issues/44240)。 [#44502](https://github.com/ClickHouse/ClickHouse/pull/44502) ([mayamika](https://github.com/mayamika)).
* 允许通过 `s3_storage_class` 配置选项设置 S3 存储类别，例如 `<s3_storage_class>STANDARD/INTELLIGENT_TIERING</s3_storage_class>`。关闭 [#44443](https://github.com/ClickHouse/ClickHouse/issues/44443)。 [#44707](https://github.com/ClickHouse/ClickHouse/pull/44707) ([chen](https://github.com/xiedeyantu)).
* 解析命名元组时，如果 JSON 对象缺少元素，则插入默认值。新增设置 `input_format_json_defaults_for_missing_elements_in_named_tuple` 来控制此行为。关闭 [#45142](https://github.com/ClickHouse/ClickHouse/issues/45142)#issuecomment-1380153217。 [#45231](https://github.com/ClickHouse/ClickHouse/pull/45231) ([Kruglov Pavel](https://github.com/Avogar)).
* 在 ProfileEvents 中记录服务器启动时间（`ServerStartupMilliseconds`）。解决 [#43188](https://github.com/ClickHouse/ClickHouse/issues/43188)。 [#45250](https://github.com/ClickHouse/ClickHouse/pull/45250) ([SmitaRKulkarni](https://github.com/SmitaRKulkarni)).
* 重构并改进 Kafka/RabbitMQ/NATS 流式引擎，支持所有格式，同时对格式实现作少量重构：- 修复使用带前缀/后缀的行式格式生成消息的问题。现在每条消息都包含所有分隔符，格式完整，可以使用相应输入格式重新解析。- 支持 Native、Parquet、ORC 等块式格式。每个块格式化为一条独立消息，消息行数取决于块大小，可通过 `max_block_size` 设置控制。- 新增引擎设置 `kafka_max_rows_per_message/rabbitmq_max_rows_per_message/nats_max_rows_per_message`，控制行式格式中每条消息格式化的行数，默认值为 1。- 修复 NATS 表引擎内存消耗过高的问题。- NATS 生产者支持任意二进制数据（此前仅支持末尾包含 \0 的字符串）。- 在文档中补充缺失的 Kafka/RabbitMQ/NATS 引擎设置。- 重构 Kafka/RabbitMQ/NATS 中的生产和消费逻辑，使其与 WriteBuffers/ReadBuffers 语义分离。- 重构输出格式：移除 Kafka/RabbitMQ/NATS 使用的逐行回调（现在这些引擎不再使用回调），允许直接使用 IRowOutputFormat，明确行结束和行间分隔符，并支持重置输出格式以重新开始格式化。- 为 formatRow 函数添加正确实现（格式重构带来的额外收益）。 [#42777](https://github.com/ClickHouse/ClickHouse/pull/42777) ([Kruglov Pavel](https://github.com/Avogar)).
* 支持在 `CapnProto` 格式中将 `Nested` 表作为 `Struct` 的 `List` 进行读写；将 `Decimal32/64` 作为 `Int32/64` 读写。关闭 [#43319](https://github.com/ClickHouse/ClickHouse/issues/43319)。 [#43379](https://github.com/ClickHouse/ClickHouse/pull/43379) ([Kruglov Pavel](https://github.com/Avogar)).
* 为 `system.text_log` 新增 `message_format_string` 列，保存用于格式化消息的模式，以便对 ClickHouse 日志进行各种分析。 [#44543](https://github.com/ClickHouse/ClickHouse/pull/44543) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 尝试自动检测 CSV/TSV/CustomSeparated 输入格式中包含列名（也可能包含类型）的表头。
  新增 input\_format\_tsv/csv/custom\_detect\_header 设置以启用此行为（默认启用）。关闭 [#44640](https://github.com/ClickHouse/ClickHouse/issues/44640)。 [#44953](https://github.com/ClickHouse/ClickHouse/pull/44953) ([Kruglov Pavel](https://github.com/Avogar)).

<h4 id="experimental-feature-7">
  实验性功能
</h4>

* 新增实验性倒排索引，作为一种新的二级索引类型，用于高效文本搜索。 [#38667](https://github.com/ClickHouse/ClickHouse/pull/38667) ([larryluogit](https://github.com/larryluogit)).
* 新增实验性查询结果缓存。 [#43797](https://github.com/ClickHouse/ClickHouse/pull/43797) ([Robert Schulze](https://github.com/rschu1ze)).
* 新增可扩展、可配置的 IO 请求调度子系统（尚未与 IO 代码本身集成）。这项功能目前什么也不做，敬请享用。 [#41840](https://github.com/ClickHouse/ClickHouse/pull/41840) ([Sergei Trifonov](https://github.com/serxa)).
* 新增 `SYSTEM DROP DATABASE REPLICA`，用于删除 `Replicated` 数据库中失效副本的元数据。解决 [#41794](https://github.com/ClickHouse/ClickHouse/issues/41794)。 [#42807](https://github.com/ClickHouse/ClickHouse/pull/42807) ([Alexander Tokmakov](https://github.com/tavplubix)).

<h4 id="performance-improvement-11">
  性能改进
</h4>

* 启动 `MergeTree` 表时不加载非活跃数据片段。 [#42181](https://github.com/ClickHouse/ClickHouse/pull/42181) ([Anton Popov](https://github.com/CurtizJ)).
* 降低通过 `S3` 存储引擎和 `s3` 表函数读取大量小文件时的延迟。现在从 `S3` 存储引擎读取时，`remote_filesystem_read_method` 和 `remote_filesystem_read_prefetch` 设置会生效。 [#43726](https://github.com/ClickHouse/ClickHouse/pull/43726) ([Anton Popov](https://github.com/CurtizJ)).
* 优化 Parquet/ORC 文件中结构体字段的读取，仅加载所需字段。 [#44484](https://github.com/ClickHouse/ClickHouse/pull/44484) ([lgbo](https://github.com/lgbo-ustc)).
* 此前错误地为通过 HTTP 接口执行的查询禁用了两级聚合算法；现已重新启用，带来显著性能提升。 [#45450](https://github.com/ClickHouse/ClickHouse/pull/45450) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 为 StorageFile 新增 mmap 支持，有望提升 clickhouse-local 的性能。 [#43927](https://github.com/ClickHouse/ClickHouse/pull/43927) ([pufit](https://github.com/pufit)).
* 为 HashedDictionary 新增分片支持以实现并行加载（扩展能力随分片数近似线性增长）。 [#40003](https://github.com/ClickHouse/ClickHouse/pull/40003) ([Azat Khuzhin](https://github.com/azat)).
* 加快查询解析速度。 [#42284](https://github.com/ClickHouse/ClickHouse/pull/42284) ([Raúl Marín](https://github.com/Algunenano)).
* 当 `expr` 为 `LowCardinality` 列时，始终将 OR 链 `expr = x1 OR ... OR expr = xN` 替换为 `expr IN (x1, ..., xN)`，此时忽略 `optimize_min_equality_disjunction_chain_length` 设置。 [#42889](https://github.com/ClickHouse/ClickHouse/pull/42889) ([Guo Wangyang](https://github.com/guowangy)).
* 通过优化 ThreadStatus 相关代码小幅提升性能。 [#43586](https://github.com/ClickHouse/ClickHouse/pull/43586) ([Zhiguo Zhou](https://github.com/ZhiguoZh)).
* 通过自动向量化优化按列求值的三值逻辑。在此[微基准测试](https://github.com/ZhiguoZh/ClickHouse/blob/20221123-ternary-logic-opt-example/src/Functions/examples/associative_applier_perf.cpp)中，在 ICX 设备（Intel Xeon Platinum 8380 CPU）上观察到最高 **21 倍**的**性能提升**。 [#43669](https://github.com/ClickHouse/ClickHouse/pull/43669) ([Zhiguo Zhou](https://github.com/ZhiguoZh)).
* 在可能的情况下，避免在 `system.tables` 表中获取读锁。 [#43840](https://github.com/ClickHouse/ClickHouse/pull/43840) ([Raúl Marín](https://github.com/Algunenano)).
* 优化 ThreadPool。在 ICX 设备（Intel Xeon Platinum 8380 CPU，80 核、160 线程）上进行的 SSB（星型模式基准测试）性能实验表明，此项变更可使 ThreadPoolImpl::mutex 的锁竞争有效减少 **75%**，提高 CPU 利用率，并使整体性能提升 **2.4%**。 [#44308](https://github.com/ClickHouse/ClickHouse/pull/44308) ([Zhiguo Zhou](https://github.com/ZhiguoZh)).
* 现在仅当缓存的哈希表大小足够大时，才应用哈希表大小预测优化（阈值由实验确定并硬编码）。 [#44455](https://github.com/ClickHouse/ClickHouse/pull/44455) ([Nikita Taranov](https://github.com/nickitat)).
* 小幅提升远程文件系统异步读取性能。 [#44868](https://github.com/ClickHouse/ClickHouse/pull/44868) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 为以下表达式新增快速路径：- `col like '%%'`；- `col like '%'`；- `col not like '%'`；- `col not like '%'`；- `match(col, '.*')`。 [#45244](https://github.com/ClickHouse/ClickHouse/pull/45244) ([李扬](https://github.com/taiyang-li)).
* 小幅改进过滤（WHERE 子句）中的常见正常执行路径优化。 [#45289](https://github.com/ClickHouse/ClickHouse/pull/45289) ([Nikita Taranov](https://github.com/nickitat)).
* 为 `toUnixTimestamp64*` 提供单调性信息，以便在索引分析中进行更多代数优化。 [#44116](https://github.com/ClickHouse/ClickHouse/pull/44116) ([Nikita Taranov](https://github.com/nickitat)).
* 允许将查询处理中临时数据（溢写到磁盘）的配置与文件系统缓存配合使用（占用缓存磁盘的空间）。这主要改善  [#43972](https://github.com/ClickHouse/ClickHouse/pull/43972) ([Vladimir C](https://github.com/vdimir)). [ClickHouse Cloud](https://console.clickhouse.cloud/)，但了解具体用法的用户也可以在自托管部署中使用。
* 使 `system.replicas` 表并行获取副本状态。关闭 [#43918](https://github.com/ClickHouse/ClickHouse/issues/43918)。 [#43998](https://github.com/ClickHouse/ClickHouse/pull/43998) ([Nikolay Degterinsky](https://github.com/evillique)).
* 优化备份到 S3 时的内存消耗：现在直接将文件复制到 S3，不再使用可能占用大量内存的 `WriteBufferFromS3`。 [#45188](https://github.com/ClickHouse/ClickHouse/pull/45188) ([Vitaly Baranov](https://github.com/vitlibar)).
* 为异步数据块 ID 新增缓存，可在启用异步插入去重时减少对 ZooKeeper 的请求数。 [#45106](https://github.com/ClickHouse/ClickHouse/pull/45106) ([Han Fei](https://github.com/hanfei1991)).

<h4 id="improvement-11">
  改进
</h4>

* 无参数调用 generateRandom 时，使用目标插入表的结构。 [#45239](https://github.com/ClickHouse/ClickHouse/pull/45239) ([Kruglov Pavel](https://github.com/Avogar)).
* 允许 `JSONExtract` 函数将 JSON 字符串字段中存储的浮点数隐式转换为整数。例如，`JSONExtract('{"a": "1000.111"}', 'a', 'UInt64')` -> `1000`，此前返回 0。 [#45432](https://github.com/ClickHouse/ClickHouse/pull/45432) ([Anton Popov](https://github.com/CurtizJ)).
* 为 `system.formats` 表新增 `supports_parallel_parsing` 和 `supports_parallel_formatting` 字段，提供更完善的内部状态查询能力。 [#45499](https://github.com/ClickHouse/ClickHouse/pull/45499) ([Anton Popov](https://github.com/CurtizJ)).
* 改进 CustomSeparated/Template 格式中 CSV 字段的读取。关闭 [#42352](https://github.com/ClickHouse/ClickHouse/issues/42352)，关闭 [#39620](https://github.com/ClickHouse/ClickHouse/issues/39620)。 [#43332](https://github.com/ClickHouse/ClickHouse/pull/43332) ([Kruglov Pavel](https://github.com/Avogar)).
* 统一查询耗时的测量方式。 [#43455](https://github.com/ClickHouse/ClickHouse/pull/43455) ([Raúl Marín](https://github.com/Algunenano)).
* 改进 file/hdfs/s3 表函数在 SELECT 查询包含虚拟列时自动使用目标插入表结构的行为，修复可能出现的 `Block structure mismatch` 或 `number of columns mismatch` 错误。 [#43695](https://github.com/ClickHouse/ClickHouse/pull/43695) ([Kruglov Pavel](https://github.com/Avogar)).
* 为 `range` 函数新增有符号参数支持。修复 [#43333](https://github.com/ClickHouse/ClickHouse/issues/43333)。 [#43733](https://github.com/ClickHouse/ClickHouse/pull/43733) ([sanyu](https://github.com/wineternity)).
* 移除冗余排序，例如子查询中与 ORDER BY 子句相关的排序。此优化基于查询计划实现，对 `ORDER BY` 子句的作用类似于 `optimize_duplicate_order_by_and_distinct`，但更通用，可用于任意冗余排序步骤（不只针对 ORDER BY 子句引起的排序），也适用于任意嵌套深度的子查询。与 [#42648](https://github.com/ClickHouse/ClickHouse/issues/42648) 相关。 [#43905](https://github.com/ClickHouse/ClickHouse/pull/43905) ([Igor Nikonov](https://github.com/devcrafter)).
* 新增禁用 BACKUP 文件去重的能力（对于未去重的备份，可以使用 ATTACH 代替完整 RESTORE）。例如 `BACKUP foo TO S3(...) SETTINGS deduplicate_files=0`（默认 `deduplicate_files=1`）。 [#43947](https://github.com/ClickHouse/ClickHouse/pull/43947) ([Azat Khuzhin](https://github.com/azat)).
* 重构并改进文本格式的结构推断。新增 `schema_inference_make_columns_nullable` 设置，控制是否将结果类型设为 `Nullable`（默认启用）。 [#44019](https://github.com/ClickHouse/ClickHouse/pull/44019) ([Kruglov Pavel](https://github.com/Avogar)).
* 改进对 `PROXYv1` 协议的支持。 [#44135](https://github.com/ClickHouse/ClickHouse/pull/44135) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* 向 `system.parts` 表添加清理线程最近一次检查数据片段的信息。 [#44244](https://github.com/ClickHouse/ClickHouse/pull/44244) ([Dmitry Novik](https://github.com/novikd)).
* 在只读模式下禁用通过表函数进行插入。 [#44290](https://github.com/ClickHouse/ClickHouse/pull/44290) ([SmitaRKulkarni](https://github.com/SmitaRKulkarni)).
* 新增 `simultaneous_parts_removal_limit` 设置，允许限制 CleanupThread 单次迭代处理的数据片段数。 [#44461](https://github.com/ClickHouse/ClickHouse/pull/44461) ([Dmitry Novik](https://github.com/novikd)).
* 查询仅需要虚拟列时，不初始化 ReadBufferFromS3。这可能有助于解决 [#44246](https://github.com/ClickHouse/ClickHouse/issues/44246)。 [#44493](https://github.com/ClickHouse/ClickHouse/pull/44493) ([chen](https://github.com/xiedeyantu)).
* 避免提供重复的列名提示。关闭 [#44130](https://github.com/ClickHouse/ClickHouse/issues/44130)。 [#44519](https://github.com/ClickHouse/ClickHouse/pull/44519) ([Joanna Hulboj](https://github.com/jh0x)).
* 允许在磁盘端点中使用宏替换。解决 [#40951](https://github.com/ClickHouse/ClickHouse/issues/40951)。 [#44533](https://github.com/ClickHouse/ClickHouse/pull/44533) ([SmitaRKulkarni](https://github.com/SmitaRKulkarni)).
* 改进启用 `input_format_json_read_object_as_string` 时的结构推断。 [#44546](https://github.com/ClickHouse/ClickHouse/pull/44546) ([Kruglov Pavel](https://github.com/Avogar)).
* 新增用户级设置 `database_replicated_allow_replicated_engine_arguments`，可禁止在 `DatabaseReplicated` 中创建带参数的 `ReplicatedMergeTree` 表。 [#44566](https://github.com/ClickHouse/ClickHouse/pull/44566) ([alesapin](https://github.com/alesapin)).
* 防止用户误将 `index_granularity` 设为无效的零值。关闭 [#44536](https://github.com/ClickHouse/ClickHouse/issues/44536)。 [#44578](https://github.com/ClickHouse/ClickHouse/pull/44578) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 支持在 config.xml 的 `kerberos` 节中通过 `keytab` 参数设置服务 keytab 文件的路径。 [#44594](https://github.com/ClickHouse/ClickHouse/pull/44594) ([Roman Vasin](https://github.com/rvasin)).
* 使用已输入的查询内容进行模糊搜索（传入用 Rust 编写并静态链接到 ClickHouse 的 `skim` 库）。 [#44600](https://github.com/ClickHouse/ClickHouse/pull/44600) ([Azat Khuzhin](https://github.com/azat)).
* 默认启用 `input_format_json_read_objects_as_strings`，以便在 JSON Object 类型仍处于实验阶段时读取嵌套 JSON 对象。 [#44657](https://github.com/ClickHouse/ClickHouse/pull/44657) ([Kruglov Pavel](https://github.com/Avogar)).
* 改进异步插入去重：用户进行重复的异步插入时，应先在内存中去重，再查询 Keeper。 [#44682](https://github.com/ClickHouse/ClickHouse/pull/44682) ([Han Fei](https://github.com/hanfei1991)).
* `Avro` 输入/输出格式将 bool 类型解析为 ClickHouse 的 bool 类型。 [#44684](https://github.com/ClickHouse/ClickHouse/pull/44684) ([Kruglov Pavel](https://github.com/Avogar)).
* 在 Arrow/Parquet/ORC 中支持 Bool 类型。关闭 [#43970](https://github.com/ClickHouse/ClickHouse/issues/43970)。 [#44698](https://github.com/ClickHouse/ClickHouse/pull/44698) ([Kruglov Pavel](https://github.com/Avogar)).
* 读取 UUID 时，不再越过引号进行贪婪解析，否则可能把错误数据误判为解析成功。 [#44686](https://github.com/ClickHouse/ClickHouse/pull/44686) ([Raúl Marín](https://github.com/Algunenano)).
* Int64 溢出时推断为 UInt64，并修复结构推断中的部分转换。 [#44696](https://github.com/ClickHouse/ClickHouse/pull/44696) ([Kruglov Pavel](https://github.com/Avogar)).
* 此前 `Replicated` 数据库内部采用临时拼凑的方式解析依赖关系，现在改用显式依赖图正确处理。 [#44697](https://github.com/ClickHouse/ClickHouse/pull/44697) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* 修复 `output_format_pretty_row_numbers` 无法跨数据块保留计数器的问题。关闭 [#44815](https://github.com/ClickHouse/ClickHouse/issues/44815)。 [#44832](https://github.com/ClickHouse/ClickHouse/pull/44832) ([flynn](https://github.com/ucasfl)).
* 不再因数据片段合并与后台清理过程并发执行而在 `system.errors` 中报告错误。 [#44874](https://github.com/ClickHouse/ClickHouse/pull/44874) ([Raúl Marín](https://github.com/Algunenano)).
* 优化并修复 Distributed 异步 INSERT 的指标。 [#44922](https://github.com/ClickHouse/ClickHouse/pull/44922) ([Azat Khuzhin](https://github.com/azat)).
* 新增禁止并发备份和恢复的设置，解决 [#43891](https://github.com/ClickHouse/ClickHouse/issues/43891)。实现：\* 新增用于禁止并发备份和恢复的服务器级设置，在 Context 中创建 BackupWorker 时读取并设置。\* 设置默认值为 true。\* 启动备份或恢复前，检查是否已有其他备份/恢复任务运行。对于内部请求，通过 backup\_uuid 检查请求是否来自本节点。 [#45072](https://github.com/ClickHouse/ClickHouse/pull/45072) ([SmitaRKulkarni](https://github.com/SmitaRKulkarni)).
* 为系统日志新增 `<storage_policy>` 配置参数。 [#45320](https://github.com/ClickHouse/ClickHouse/pull/45320) ([Stig Bakken](https://github.com/stigsb)).

<h4 id="buildtestingpackaging-improvement-11">
  构建、测试与打包改进
</h4>

* 静态链接用 Rust 编写的 `skim` 库，用于 clickhouse client/local 历史记录的模糊搜索。 [#44239](https://github.com/ClickHouse/ClickHouse/pull/44239) ([Azat Khuzhin](https://github.com/azat)).
* 由于引入 Rust，移除了共享链接支持。实际上，Rust 只是移除它的借口，我们本来就想移除这项支持。 [#44828](https://github.com/ClickHouse/ClickHouse/pull/44828) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 从安装包中移除对 `adduser` 工具的依赖，因为我们没有使用它。修复 [#44934](https://github.com/ClickHouse/ClickHouse/issues/44934)。 [#45011](https://github.com/ClickHouse/ClickHouse/pull/45011) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 将 `SQLite` 库更新到最新版本。该库用于 SQLite 数据库和表集成引擎。同时修复一项 TSan 误报。关闭 [#45027](https://github.com/ClickHouse/ClickHouse/issues/45027)。 [#45031](https://github.com/ClickHouse/ClickHouse/pull/45031) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 调整 CRC-32，以解决 PowerPC 上的 WeakHash 冲突问题。 [#45144](https://github.com/ClickHouse/ClickHouse/pull/45144) ([MeenaRenganathan22](https://github.com/MeenaRenganathan22)).
* 更新 aws-c\* 子模块。 [#43020](https://github.com/ClickHouse/ClickHouse/pull/43020) ([Vitaly Baranov](https://github.com/vitlibar)).
* 自动合并检查通过的回移 PR，以及检查通过且已获批准的 PR。 [#41110](https://github.com/ClickHouse/ClickHouse/pull/41110) ([Mikhail f. Shiryaev](https://github.com/Felixoid)).
* 推出一个展示 ClickHouse CI 状态的[网站](https://aretestsgreenyet.com/)。[源码](https://github.com/ClickHouse/aretestsgreenyet)。

<h4 id="bug-fix">
  缺陷修复
</h4>

* 将域类型 IP（IPv4、IPv6）替换为原生类型，顺带修复代码中部分缺失的实现。 [#43221](https://github.com/ClickHouse/ClickHouse/pull/43221) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* 修复备份过程中变更操作被终止时的备份行为。 [#45351](https://github.com/ClickHouse/ClickHouse/pull/45351) ([Vitaly Baranov](https://github.com/vitlibar)).
* 修复 `Invalid number of rows in Chunk` 异常消息。[#41404](https://github.com/ClickHouse/ClickHouse/issues/41404)。 [#42126](https://github.com/ClickHouse/ClickHouse/pull/42126) ([Alexander Gololobov](https://github.com/davenger)).
* 修复排序后执行表达式时可能使用未初始化值的问题。关闭 [#43386](https://github.com/ClickHouse/ClickHouse/issues/43386)。 [#43635](https://github.com/ClickHouse/ClickHouse/pull/43635) ([Kruglov Pavel](https://github.com/Avogar)).
* 改进聚合组合器对 NULL 的处理，修复使用较少见的优化 `optimize_rewrite_sum_if_to_count_if` 时可能发生的段错误或逻辑错误。关闭 [#43758](https://github.com/ClickHouse/ClickHouse/issues/43758)。 [#43813](https://github.com/ClickHouse/ClickHouse/pull/43813) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复 CREATE USER/ROLE 查询中的设置约束。 [#43993](https://github.com/ClickHouse/ClickHouse/pull/43993) ([Nikolay Degterinsky](https://github.com/evillique)).
* 修复表元数据中 `EPHEMERAL` 列的默认值无法解析的问题。 [#44026](https://github.com/ClickHouse/ClickHouse/pull/44026) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* 修复 compatibility 设置中无效版本号的解析。 [#44224](https://github.com/ClickHouse/ClickHouse/pull/44224) ([Kruglov Pavel](https://github.com/Avogar)).
* 使从日期时间减去时间间隔的行为与加法一致。 [#44241](https://github.com/ClickHouse/ClickHouse/pull/44241) ([ltrk2](https://github.com/ltrk2)).
* 移除视图结果最大大小的限制。 [#44261](https://github.com/ClickHouse/ClickHouse/pull/44261) ([lizhuoyu5](https://github.com/lzydmxy)).
* 修复 `do_not_evict_index_and_mrk_files=1` 时缓存中可能出现的逻辑错误。关闭 [#42142](https://github.com/ClickHouse/ClickHouse/issues/42142)。 [#44268](https://github.com/ClickHouse/ClickHouse/pull/44268) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复直写缓存中的缓存写入可能过早中断的问题（错误假设可能导致缓存写入在不应停止时停止）。 [#44289](https://github.com/ClickHouse/ClickHouse/pull/44289) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复带常量参数的 `IN` 函数与 `LowCardinality` 一起用作常量参数时可能发生的崩溃。修复 [#44221](https://github.com/ClickHouse/ClickHouse/issues/44221)。 [#44346](https://github.com/ClickHouse/ClickHouse/pull/44346) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复参数化聚合函数对复杂参数（如数组）的支持。关闭 [#30975](https://github.com/ClickHouse/ClickHouse/issues/30975)。在此变更之前，聚合函数 `sumMapFiltered` 无法用于分布式查询。 [#44358](https://github.com/ClickHouse/ClickHouse/pull/44358) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复 BSON 结构推断中 ObjectId 的读取。 [#44382](https://github.com/ClickHouse/ClickHouse/pull/44382) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复 ReplicatedMergeTree 中可能在合并结束前过早移除临时数据片段的竞态条件。此问题可能导致 `No such file or directory: xxx` 一类错误。修复 [#43983](https://github.com/ClickHouse/ClickHouse/issues/43983)。 [#44383](https://github.com/ClickHouse/ClickHouse/pull/44383) ([alesapin](https://github.com/alesapin)).
* 一些无效的 `SYSTEM ... ON CLUSTER` 查询在未指定集群名称时会以意外方式执行。现已修复，无效查询会按预期抛出 `SYNTAX_ERROR`。修复 [#44264](https://github.com/ClickHouse/ClickHouse/issues/44264)。 [#44387](https://github.com/ClickHouse/ClickHouse/pull/44387) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 修复 ORC 格式中 Map 类型的读取。 [#44400](https://github.com/ClickHouse/ClickHouse/pull/44400) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复读取 Parquet/ORC 格式输入数据中不存在的列时的问题。此前可能导致 `INCORRECT_NUMBER_OF_COLUMNS` 错误。关闭 [#44333](https://github.com/ClickHouse/ClickHouse/issues/44333)。 [#44405](https://github.com/ClickHouse/ClickHouse/pull/44405) ([Kruglov Pavel](https://github.com/Avogar)).
* 此前 `bar` 函数使用同一个 '▋'（U+258B，“左侧八分之五方块”）字符显示 5/8 和 6/8 长度的条形。此项变更改为使用 '▊'（U+258A，“左侧四分之三方块”）显示 6/8 条形，纠正这一行为。 [#44410](https://github.com/ClickHouse/ClickHouse/pull/44410) ([Alexander Gololobov](https://github.com/davenger)).
* 修复在配置文件中将配置档设置放在配置档设置约束之后时，约束失效的问题。 [#44411](https://github.com/ClickHouse/ClickHouse/pull/44411) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 修复执行包含数据的 `EXPLAIN AST INSERT` 查询时出现的 `SYNTAX_ERROR`。关闭 [#44207](https://github.com/ClickHouse/ClickHouse/issues/44207)。 [#44413](https://github.com/ClickHouse/ClickHouse/pull/44413) ([save-my-heart](https://github.com/save-my-heart)).
* 修复 CSV 格式中带 CRLF 的布尔值读取。关闭 [#44401](https://github.com/ClickHouse/ClickHouse/issues/44401)。 [#44442](https://github.com/ClickHouse/ClickHouse/pull/44442) ([Kruglov Pavel](https://github.com/Avogar)).
* 不在 LowCardinality 字典上执行 and/or/if/multiIf，因此结果类型不能是 LowCardinality。此前在某些情况下可能导致 `Illegal column ColumnLowCardinality` 错误。修复 [#43603](https://github.com/ClickHouse/ClickHouse/issues/43603)。 [#44469](https://github.com/ClickHouse/ClickHouse/pull/44469) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复使用 `max_streams_for_merge_tree_reading` 设置时的变更操作。 [#44472](https://github.com/ClickHouse/ClickHouse/pull/44472) ([Anton Popov](https://github.com/CurtizJ)).
* 修复 GROUPING SETS 在 ASTSelectQuery::formatImpl 中可能发生的空指针解引用（[#43049](https://github.com/ClickHouse/ClickHouse/issues/43049)）。 [#44479](https://github.com/ClickHouse/ClickHouse/pull/44479) ([Robert Schulze](https://github.com/rschu1ze)).
* 根据设置校验表函数参数、CAST 函数参数及 JSONAsObject 结构推断中的类型。 [#44501](https://github.com/ClickHouse/ClickHouse/pull/44501) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复 IN 函数处理 LowCardinality 和常量列的问题，关闭 [#44503](https://github.com/ClickHouse/ClickHouse/issues/44503)。 [#44506](https://github.com/ClickHouse/ClickHouse/pull/44506) ([Duc Canh Le](https://github.com/canhld94)).
* 修复 `CREATE TABLE` 语句中 `DEFAULT` 表达式规范化的问题。执行 CREATE 查询期间，`in` 函数的第二个参数（或 `IN` 运算符的右操作数）可能被替换为其求值结果。修复 [#44496](https://github.com/ClickHouse/ClickHouse/issues/44496)。 [#44547](https://github.com/ClickHouse/ClickHouse/pull/44547) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 存在 WITH ROLLUP、WITH CUBE 和 WITH TOTALS 时，投影无法使用。在此前版本中，查询会抛出异常，而不是跳过投影。关闭 [#44614](https://github.com/ClickHouse/ClickHouse/issues/44614)，关闭 [#42772](https://github.com/ClickHouse/ClickHouse/issues/42772)。 [#44615](https://github.com/ClickHouse/ClickHouse/pull/44615) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复异步数据块未被清理的问题，原因是 `get all blocks sorted by time` 函数未获取异步数据块。 [#44651](https://github.com/ClickHouse/ClickHouse/pull/44651) ([Han Fei](https://github.com/hanfei1991)).
* 修复 JOIN 与子查询、UNION 和 TOTALS 一起使用时的 `LOGICAL_ERROR`：`The top step of the right pipeline should be ExpressionStep`。修复 [#43687](https://github.com/ClickHouse/ClickHouse/issues/43687)。 [#44673](https://github.com/ClickHouse/ClickHouse/pull/44673) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 避免 Executable 表引擎中的 `std::out_of_range` 异常。 [#44681](https://github.com/ClickHouse/ClickHouse/pull/44681) ([Kruglov Pavel](https://github.com/Avogar)).
* 不在 AST 上对 quantiles 应用 `optimize_syntax_fuse_functions`，关闭 [#44712](https://github.com/ClickHouse/ClickHouse/issues/44712)。 [#44713](https://github.com/ClickHouse/ClickHouse/pull/44713) ([Vladimir C](https://github.com/vdimir)).
* 修复 Merge 表与 PREWHERE 中的类型错误，关闭 [#43324](https://github.com/ClickHouse/ClickHouse/issues/43324)。 [#44716](https://github.com/ClickHouse/ClickHouse/pull/44716) ([Vladimir C](https://github.com/vdimir)).
* 修复关闭过程中（销毁 TraceCollector 时）可能发生的崩溃。修复 [#44757](https://github.com/ClickHouse/ClickHouse/issues/44757)。 [#44758](https://github.com/ClickHouse/ClickHouse/pull/44758) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复分布式查询处理时可能发生的崩溃：当包含汇总或极值的查询返回空结果，且 Distributed 表与本地表类型不匹配时，可能触发此问题。修复 [#44738](https://github.com/ClickHouse/ClickHouse/issues/44738)。 [#44760](https://github.com/ClickHouse/ClickHouse/pull/44760) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复拉取操作（`min_compressed_bytes_to_fsync_after_fetch`）以及变更操作中小文件（ttl.txt、columns.txt）的 fsync 行为（`min_rows_to_fsync_after_merge`/`min_compressed_bytes_to_fsync_after_merge`）。 [#44781](https://github.com/ClickHouse/ClickHouse/pull/44781) ([Azat Khuzhin](https://github.com/azat)).
* 修复数据片段在磁盘之间移动时，查询 `system.parts` 或 `system.parts_columns` 表可能出现的罕见竞态条件。此问题由 [#41145](https://github.com/ClickHouse/ClickHouse/issues/41145) 引入。 [#44809](https://github.com/ClickHouse/ClickHouse/pull/44809) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复启用投影优化时可能出现的 `Context has expired` 错误。包含 `dictHas/dictGet` 等在运行时使用上下文的特定函数的查询可复现该问题。修复 [#44844](https://github.com/ClickHouse/ClickHouse/issues/44844)。 [#44850](https://github.com/ClickHouse/ClickHouse/pull/44850) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复从远程文件系统读取 `LowCardinality` 字典时可能出现的 `Cannot read all data` 错误。修复 [#44709](https://github.com/ClickHouse/ClickHouse/issues/44709)。 [#44875](https://github.com/ClickHouse/ClickHouse/pull/44875) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 忽略无法读取硬件监控传感器的情况，不再在日志中显示完整异常消息。 [#44895](https://github.com/ClickHouse/ClickHouse/pull/44895) ([Raúl Marín](https://github.com/Algunenano)).
* 计算出的 INSERT 延迟时间超过设置值时，使用 `max_delay_to_insert` 的值。与 [#44902](https://github.com/ClickHouse/ClickHouse/issues/44902) 相关。 [#44916](https://github.com/ClickHouse/ClickHouse/pull/44916) ([Igor Nikonov](https://github.com/devcrafter)).
* 修复包含 `UNION` 的查询出现 `Different order of columns in UNION subquery` 错误的问题。修复 [#44866](https://github.com/ClickHouse/ClickHouse/issues/44866)。 [#44920](https://github.com/ClickHouse/ClickHouse/pull/44920) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* INSERT 延迟的计算可能有误，导致始终使用 `max_delay_to_insert` 设置值作为延迟，而非正确值。现使用简单公式 `max_delay_to_insert * (parts_over_threshold/max_allowed_parts_over_threshold)`，即延迟随超出阈值的数据片段数成比例增长。关闭 [#44902](https://github.com/ClickHouse/ClickHouse/issues/44902)。 [#44954](https://github.com/ClickHouse/ClickHouse/pull/44954) ([Igor Nikonov](https://github.com/devcrafter)).
* 修复宽数据片段包含轻量级删除掩码时修改表 TTL 的错误。 [#44959](https://github.com/ClickHouse/ClickHouse/pull/44959) ([Mingliang Pan](https://github.com/liangliangpan)).
* 针对将域类型 IP（IPv4、IPv6）替换为原生类型 [#43221](https://github.com/ClickHouse/ClickHouse/issues/43221) 的后续修复。 [#45024](https://github.com/ClickHouse/ClickHouse/pull/45024) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* 针对将域类型 IP（IPv4、IPv6）替换为原生类型 [https://github.com/ClickHouse/ClickHouse/pull/43221](https://github.com/ClickHouse/ClickHouse/pull/43221) 的后续修复。 [#45043](https://github.com/ClickHouse/ClickHouse/pull/45043) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* 修复解析器中可能发生的缓冲区溢出，由模糊测试发现。 [#45047](https://github.com/ClickHouse/ClickHouse/pull/45047) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复 FileLog 存储引擎中可能出现的无法读取全部数据错误。关闭 [#45051](https://github.com/ClickHouse/ClickHouse/issues/45051)、[#38257](https://github.com/ClickHouse/ClickHouse/issues/38257)。 [#45057](https://github.com/ClickHouse/ClickHouse/pull/45057) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 查询包含分组集时，禁用节省内存的聚合（`distributed_aggregation_memory_efficient` 设置）。 [#45058](https://github.com/ClickHouse/ClickHouse/pull/45058) ([Nikita Taranov](https://github.com/nickitat)).
* 修复指定 `update_field` 时 `RANGE_HASHED` 字典的更新行为，将范围列计为主键的一部分。关闭 [#44588](https://github.com/ClickHouse/ClickHouse/issues/44588)。 [#45061](https://github.com/ClickHouse/ClickHouse/pull/45061) ([Maksim Kita](https://github.com/kitaisreal)).
* 修复嵌套 lambda 捕获 `LowCardinality` 参数时的 `Cannot capture column` 错误。修复 [#45028](https://github.com/ClickHouse/ClickHouse/issues/45028)。 [#45065](https://github.com/ClickHouse/ClickHouse/pull/45065) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复使用 minmax/count 投影时 `additional_table_filters` 导致查询结果错误的问题（附加过滤器未被应用）。 [#45133](https://github.com/ClickHouse/ClickHouse/pull/45133) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复 `histogram` 函数接受负值时的问题。 [#45147](https://github.com/ClickHouse/ClickHouse/pull/45147) ([simpleton](https://github.com/rgzntrade)).
* 修复 StoreageJoin 中列的可空性错误，关闭 [#44940](https://github.com/ClickHouse/ClickHouse/issues/44940)。 [#45184](https://github.com/ClickHouse/ClickHouse/pull/45184) ([Vladimir C](https://github.com/vdimir)).
* 修复 `background_fetches_pool_size` 设置的重新加载（运行时增大）。 [#45189](https://github.com/ClickHouse/ClickHouse/pull/45189) ([Raúl Marín](https://github.com/Algunenano)).
* 正确处理 KV 引擎（如 KeeperMap、EmbeddedRocksDB）上的 `SELECT` 查询：对键使用 `IN`，且子查询产生不同类型的情况。 [#45215](https://github.com/ClickHouse/ClickHouse/pull/45215) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复某些情况下 SEMI JOIN 与 join\_use\_nulls 一起使用时的逻辑错误，关闭 [#45163](https://github.com/ClickHouse/ClickHouse/issues/45163)，关闭 [#45209](https://github.com/ClickHouse/ClickHouse/issues/45209)。 [#45230](https://github.com/ClickHouse/ClickHouse/pull/45230) ([Vladimir C](https://github.com/vdimir)).
* 修复从 s3 读取时的堆内存释放后使用问题。 [#45253](https://github.com/ClickHouse/ClickHouse/pull/45253) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复 Avro Union 类型为 \['null', 嵌套类型] 时的问题，关闭 [#45275](https://github.com/ClickHouse/ClickHouse/issues/45275)。修复将 `bytes` 类型错误推断为 `Float` 的问题。 [#45276](https://github.com/ClickHouse/ClickHouse/pull/45276) ([flynn](https://github.com/ucasfl)).
* 当显式 PREWHERE 无法用于采用 `Merge` 存储引擎的表时，抛出正确异常。 [#45319](https://github.com/ClickHouse/ClickHouse/pull/45319) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复 WSL1 Ubuntu 下 ClickHouse 自解压程序因信息不一致而无法解压的问题：/proc/self/maps 报告文件 inode 为 32 位，而 stat 报告为 64 位。 [#45339](https://github.com/ClickHouse/ClickHouse/pull/45339) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* 修复 Distributed 表启动中的竞态条件，该问题可能导致异步 INSERT 文件被多次处理。 [#45360](https://github.com/ClickHouse/ClickHouse/pull/45360) ([Azat Khuzhin](https://github.com/azat)).
* 修复 `ListObject` 请求失败时，通过 `S3` 存储引擎和 `s3` 表函数读取可能发生的崩溃。 [#45371](https://github.com/ClickHouse/ClickHouse/pull/45371) ([Anton Popov](https://github.com/CurtizJ)).
* 修复存在结构错误的字典（例如 XML 配置中的类型错误）时，`SELECT ... FROM system.dictionaries` 产生异常的问题。 [#45399](https://github.com/ClickHouse/ClickHouse/pull/45399) ([Aleksei Filatov](https://github.com/aalexfvk)).
* 修复 `INSERT INTO ... SELECT * FROM s3Cluster` 查询使用目标插入表结构时的 s3Cluster 结构推断。 [#45422](https://github.com/ClickHouse/ClickHouse/pull/45422) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复通过 HTTP 解析 JSON/BSONEachRow 时，部分列可能使用默认值而非数据中实际值的问题。 [#45424](https://github.com/ClickHouse/ClickHouse/pull/45424) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复从文本源按指定 IP 类型解析时出现的问题（Code: 632. DB::Exception: Unexpected data ... after parsed IPv6 value ...）。 [#45425](https://github.com/ClickHouse/ClickHouse/pull/45425) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* 关闭 [#45297](https://github.com/ClickHouse/ClickHouse/issues/45297)，新增空正则表达式检查。 [#45428](https://github.com/ClickHouse/ClickHouse/pull/45428) ([Han Fei](https://github.com/hanfei1991)).
* 修复查询可能挂起的问题（很可能发生于分布式查询）。 [#45448](https://github.com/ClickHouse/ClickHouse/pull/45448) ([Azat Khuzhin](https://github.com/azat)).
* 修复启用 `allow_asynchronous_read_from_io_pool_for_merge_tree` 时，`ThreadPool::schedule` 抛出异常可能导致的死锁。 [#45481](https://github.com/ClickHouse/ClickHouse/pull/45481) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复 DETACH 后表可能仍在使用中的问题。 [#45493](https://github.com/ClickHouse/ClickHouse/pull/45493) ([Azat Khuzhin](https://github.com/azat)).
* 修复查询执行时采用并行解析、随后查询被取消时可能出现的罕见异常终止。 [#45498](https://github.com/ClickHouse/ClickHouse/pull/45498) ([Anton Popov](https://github.com/CurtizJ)).
* 修复创建 Distributed 表与向其 INSERT 之间的竞态条件，该问题可能导致向表插入时出现 CANNOT\_LINK。 [#45502](https://github.com/ClickHouse/ClickHouse/pull/45502) ([Azat Khuzhin](https://github.com/azat)).
* 为缓存策略获取方法添加正确的默认值（SLRU）。关闭 [#45514](https://github.com/ClickHouse/ClickHouse/issues/45514)。 [#45524](https://github.com/ClickHouse/ClickHouse/pull/45524) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 禁止在变更操作中使用数组连接，关闭 [#42637](https://github.com/ClickHouse/ClickHouse/issues/42637)。 [#44447](https://github.com/ClickHouse/ClickHouse/pull/44447) ([SmitaRKulkarni](https://github.com/SmitaRKulkarni)).
* 修复限定星号与表别名及列转换器一起使用时的问题。解决 [#44736](https://github.com/ClickHouse/ClickHouse/issues/44736)。 [#44755](https://github.com/ClickHouse/ClickHouse/pull/44755) ([SmitaRKulkarni](https://github.com/SmitaRKulkarni)).