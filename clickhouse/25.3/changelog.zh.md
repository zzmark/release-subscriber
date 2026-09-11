<h3 id="253">
  ClickHouse 25.3 LTS 版本，2025-03-20
</h3>

#### 向后不兼容变更

* 禁止清空复制数据库。 [#76651](https://github.com/ClickHouse/ClickHouse/pull/76651) ([Bharat Nallan](https://github.com/bharatnc)).
* 回退数据跳过索引缓存。 [#77447](https://github.com/ClickHouse/ClickHouse/pull/77447) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).

#### 新功能

* `JSON` 数据类型已可用于生产环境。参见 [https://jsonbench.com/](https://jsonbench.com/)。`Dynamic` 和 `Variant` 数据类型也已可用于生产环境。 [#77785](https://github.com/ClickHouse/ClickHouse/pull/77785) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 为 clickhouse-server 引入 SSH 协议。现在可以使用任意 SSH 客户端连接 ClickHouse。解决 [#74340](https://github.com/ClickHouse/ClickHouse/issues/74340)。 [#74989](https://github.com/ClickHouse/ClickHouse/pull/74989) ([George Gamezardashvili](https://github.com/Infjoker)).
* 启用并行副本时，将表函数替换为相应的 -Cluster 版本。修复 [#65024](https://github.com/ClickHouse/ClickHouse/issues/65024)。 [#70659](https://github.com/ClickHouse/ClickHouse/pull/70659) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 重新实现用户态页缓存，允许将数据缓存在进程内存中，而不依赖操作系统页缓存。当数据存储于远程虚拟文件系统、且没有本地文件系统缓存作为后端时，这一功能尤其有用。 [#70509](https://github.com/ClickHouse/ClickHouse/pull/70509) ([Michael Kolupaev](https://github.com/al13n321)).
* 新增服务器设置 `concurrent_threads_scheduler`，控制并发查询之间的 CPU 槽位分配。可设为 `round_robin`（此前的行为）或 `fair_round_robin`，后者用于解决 INSERT 与 SELECT 之间 CPU 分配不公平的问题。 [#75949](https://github.com/ClickHouse/ClickHouse/pull/75949) ([Sergei Trifonov](https://github.com/serxa)).
* 新增聚合函数 `estimateCompressionRatio`，对应 [#70801](https://github.com/ClickHouse/ClickHouse/issues/70801)。 [#76661](https://github.com/ClickHouse/ClickHouse/pull/76661) ([Tariq Almawash](https://github.com/talmawash)).
* 新增函数 `arraySymmetricDifference`，返回多个数组参数中未在所有参数里都出现的元素。例如：`SELECT arraySymmetricDifference([1, 2], [2, 3])` 返回 `[1, 3]`。（问题 [#61673](https://github.com/ClickHouse/ClickHouse/issues/61673)）。 [#76231](https://github.com/ClickHouse/ClickHouse/pull/76231) ([Filipp Abapolov](https://github.com/pheepa)).
* 允许通过存储引擎/表函数设置 `iceberg_metadata_file_path ` 显式指定 Iceberg 要读取的元数据文件。修复 [#47412](https://github.com/ClickHouse/ClickHouse/issues/47412)。 [#77318](https://github.com/ClickHouse/ClickHouse/pull/77318) ([alesapin](https://github.com/alesapin)).
* 新增 `keccak256` 哈希函数，常用于区块链实现，尤其是基于 EVM 的系统。 [#76669](https://github.com/ClickHouse/ClickHouse/pull/76669) ([Arnaud Briche](https://github.com/arnaudbriche)).
* 新增三个函数：按规范实现的 `icebergTruncate`（[https://iceberg.apache.org/spec/#truncate-transform-details](https://iceberg.apache.org/spec/#truncate-transform-details)），以及 `toYearNumSinceEpoch` 和 `toMonthNumSinceEpoch`。`Iceberg` 引擎的分区裁剪支持 `truncate` 变换。 [#77403](https://github.com/ClickHouse/ClickHouse/pull/77403) ([alesapin](https://github.com/alesapin)).
* 支持 `LowCardinality(Decimal)` 数据类型，见 [#72256](https://github.com/ClickHouse/ClickHouse/issues/72256)。 [#72833](https://github.com/ClickHouse/ClickHouse/pull/72833) ([zhanglistar](https://github.com/zhanglistar)).
* 性能事件 `FilterTransformPassedRows` 和 `FilterTransformPassedBytes` 将显示查询执行期间经过过滤的行数和字节数。 [#76662](https://github.com/ClickHouse/ClickHouse/pull/76662) ([Onkar Deshpande](https://github.com/onkar)).
* 支持直方图指标类型。其接口与 Prometheus 客户端基本一致，只需调用 `observe(value)`，即可递增该值所在桶的计数器。直方图指标通过 `system.histogram_metrics` 提供。 [#75736](https://github.com/ClickHouse/ClickHouse/pull/75736) ([Miсhael Stetsyuk](https://github.com/mstetsyuk)).
* 按显式值进行分支匹配的 CASE 支持非常量值。 [#77399](https://github.com/ClickHouse/ClickHouse/pull/77399) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).

#### 实验性功能

* 对位于 AWS S3 和本地文件系统上的 DeltaLake 表，新增[对 Unity Catalog 的支持](https://www.databricks.com/product/unity-catalog)。 [#76988](https://github.com/ClickHouse/ClickHouse/pull/76988) ([alesapin](https://github.com/alesapin)).
* 为 Iceberg 表引入与 AWS Glue 服务目录的实验性集成。 [#77257](https://github.com/ClickHouse/ClickHouse/pull/77257) ([alesapin](https://github.com/alesapin)).
* 新增动态集群自动发现支持，扩展现有的*节点*自动发现功能。ClickHouse 现在可通过 `<multicluster_root_path>` 自动检测并注册同一 ZooKeeper 路径下的新*集群*。 [#76001](https://github.com/ClickHouse/ClickHouse/pull/76001) ([Anton Ivashkin](https://github.com/ianton-ru)).
* 新增设置 `enable_replacing_merge_with_cleanup_for_min_age_to_force_merge`，允许在可配置的超时时间后，对整个分区自动执行带清理的合并。 [#76440](https://github.com/ClickHouse/ClickHouse/pull/76440) ([Christoph Wurm](https://github.com/cwurm)).

#### 性能改进

* 实现查询条件缓存，提高使用重复条件的查询性能。系统将不满足条件的数据范围记录为内存中的临时索引，后续查询会使用该索引。解决 [#67768](https://github.com/ClickHouse/ClickHouse/issues/67768)。 [#69236](https://github.com/ClickHouse/ClickHouse/pull/69236) ([zhongyuankai](https://github.com/zhongyuankai)).
* 移除数据片段时主动从缓存中淘汰相应数据。当数据量较小时，不再让缓存增长到最大容量。 [#76641](https://github.com/ClickHouse/ClickHouse/pull/76641) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 算术计算中的 Int256 和 UInt256 改用 clang 内置的 i256，从而提升性能，见 [#70502](https://github.com/ClickHouse/ClickHouse/issues/70502)。 [#73658](https://github.com/ClickHouse/ClickHouse/pull/73658) ([李扬](https://github.com/taiyang-li)).
* 某些情况下（例如数组列为空），数据片段中可能包含空文件。当表位于元数据与对象存储分离的磁盘上时，可以跳过向 ObjectStorage 写入空对象，仅保存这些文件的元数据。 [#75860](https://github.com/ClickHouse/ClickHouse/pull/75860) ([Alexander Gololobov](https://github.com/davenger)).
* 提高 Decimal32/Decimal64/DateTime64 的 min/max 性能。 [#76570](https://github.com/ClickHouse/ClickHouse/pull/76570) ([李扬](https://github.com/taiyang-li)).
* 查询编译（设置 `compile_expressions`）现在会考虑机器类型，显著加速此类查询。 [#76753](https://github.com/ClickHouse/ClickHouse/pull/76753) ([ZhangLiStar](https://github.com/zhanglistar)).
* 优化 `arraySort`。 [#76850](https://github.com/ClickHouse/ClickHouse/pull/76850) ([李扬](https://github.com/taiyang-li)).
* 当缓存以被动模式使用时（例如合并期间），禁用 `filesystem_cache_prefer_bigger_buffer_size`。 [#77898](https://github.com/ClickHouse/ClickHouse/pull/77898) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 在部分代码位置应用 `preserve_most` 属性，略微改善生成代码的质量。 [#67778](https://github.com/ClickHouse/ClickHouse/pull/67778) ([Nikita Taranov](https://github.com/nickitat)).
* 加快 ClickHouse 服务器关闭速度，消除 2.5 秒延迟。 [#76550](https://github.com/ClickHouse/ClickHouse/pull/76550) ([Azat Khuzhin](https://github.com/azat)).
* 避免 ReadBufferFromS3 及其他远程读取缓冲区的过量分配，将其内存用量减半。 [#76692](https://github.com/ClickHouse/ClickHouse/pull/76692) ([Sema Checherinda](https://github.com/CheSema)).
* 将 zstd 从 1.5.5 升级至 1.5.7，可能带来一些[性能提升](https://github.com/facebook/zstd/releases/tag/v1.5.7)。 [#77137](https://github.com/ClickHouse/ClickHouse/pull/77137) ([Pradeep Chhetri](https://github.com/chhetripradeep)).
* 减少预取 Wide 数据片段中 JSON 列时的内存用量。这适用于 ClickHouse 运行于共享存储之上的场景，例如 ClickHouse Cloud。 [#77640](https://github.com/ClickHouse/ClickHouse/pull/77640) ([Pavel Kruglov](https://github.com/Avogar)).

#### 改进

* `INTO OUTFILE` 配合 `TRUNCATE` 使用时支持原子重命名。解决 [#70323](https://github.com/ClickHouse/ClickHouse/issues/70323)。 [#77181](https://github.com/ClickHouse/ClickHouse/pull/77181) ([Onkar Deshpande](https://github.com/onkar)).
* 浮点数设置不再接受 `NaN` 或 `inf`。此前这样设置也没有任何意义。 [#77546](https://github.com/ClickHouse/ClickHouse/pull/77546) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 禁用分析器时，默认禁用并行副本，不受 `compatibility` 设置影响。仍可通过显式将 `parallel_replicas_only_with_analyzer` 设为 `false` 改变此行为。 [#77115](https://github.com/ClickHouse/ClickHouse/pull/77115) ([Igor Nikonov](https://github.com/devcrafter)).
* 支持定义请求头列表，将客户端请求中的指定请求头转发给外部 HTTP 身份验证服务。 [#77054](https://github.com/ClickHouse/ClickHouse/pull/77054) ([inv2004](https://github.com/inv2004)).
* 元组列中的字段遵循不区分大小写的列名匹配规则。解决 [https://github.com/apache/incubator-gluten/issues/8324](https://github.com/apache/incubator-gluten/issues/8324)。 [#73780](https://github.com/ClickHouse/ClickHouse/pull/73780) ([李扬](https://github.com/taiyang-li)).
* Gorilla 编解码器的参数现在始终保存到 .sql 文件中的表元数据内。解决 [#70072](https://github.com/ClickHouse/ClickHouse/issues/70072)。 [#74814](https://github.com/ClickHouse/ClickHouse/pull/74814) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* 增强部分数据湖的解析能力：新增清单文件中序列标识符的解析支持；重新设计 Avro 元数据解析器，使其便于后续扩展。 [#75010](https://github.com/ClickHouse/ClickHouse/pull/75010) ([Daniil Ivanik](https://github.com/divanik)).
* 从 `system.opentelemetry_span_log` 的默认 ORDER BY 中移除 trace\_id。 [#75907](https://github.com/ClickHouse/ClickHouse/pull/75907) ([Azat Khuzhin](https://github.com/azat)).
* 加密（`encrypted_by` 属性）现在可应用于任何配置文件，包括 config.xml、users.xml 和嵌套配置文件。此前仅对顶层 config.xml 文件生效。 [#75911](https://github.com/ClickHouse/ClickHouse/pull/75911) ([Mikhail Gorshkov](https://github.com/mgorshkov)).
* 改进 `system.warnings` 表，新增可添加、更新或移除的动态警告消息。 [#76029](https://github.com/ClickHouse/ClickHouse/pull/76029) ([Bharat Nallan](https://github.com/bharatnc)).
* 本 PR 禁止执行 `ALTER USER user1 ADD PROFILES a, DROP ALL PROFILES` 查询，因为所有 `DROP` 操作都必须排在前面。 [#76242](https://github.com/ClickHouse/ClickHouse/pull/76242) ([pufit](https://github.com/pufit)).
* 对 SYNC REPLICA 作多项增强，包括更清晰的错误消息、更完善的测试以及合理性检查。 [#76307](https://github.com/ClickHouse/ClickHouse/pull/76307) ([Azat Khuzhin](https://github.com/azat)).
* 备份过程中向 S3 执行分段复制因 Access Denied 失败时，采用正确的回退方式。在凭据不同的存储桶之间备份时，分段复制可能产生 Access Denied 错误。 [#76515](https://github.com/ClickHouse/ClickHouse/pull/76515) ([Antonio Andelic](https://github.com/antonio2368)).
* 将 librdkafka（一堆垃圾）升级至 2.8.0（这堆垃圾并没有变好），并改进 Kafka 表的关闭顺序，减少删表和服务器重启时的延迟。删除表时，`engine=Kafka` 不再显式退出消费者组。消费者会继续留在组内，直到不活跃时间达到 `session_timeout_ms`（默认 45 秒）后被自动移除。 [#76621](https://github.com/ClickHouse/ClickHouse/pull/76621) ([filimonov](https://github.com/filimonov)).
* 修复 S3 请求设置的校验。 [#76658](https://github.com/ClickHouse/ClickHouse/pull/76658) ([Vitaly Baranov](https://github.com/vitlibar)).
* `server_settings`、`settings` 等系统表包含方便使用的 `default` 值列。为 `merge_tree_settings` 和 `replicated_merge_tree_settings` 也添加此列。 [#76942](https://github.com/ClickHouse/ClickHouse/pull/76942) ([Diego Nieto](https://github.com/lesandie)).
* 新增 `ProfileEvents::QueryPreempted`，其逻辑与 `CurrentMetrics::QueryPreempted` 类似。 [#77015](https://github.com/ClickHouse/ClickHouse/pull/77015) ([VicoWu](https://github.com/VicoWu)).
* 此前 Replicated 数据库可能将查询中指定的凭据写入日志，现已修复。解决 [#77123](https://github.com/ClickHouse/ClickHouse/issues/77123)。 [#77133](https://github.com/ClickHouse/ClickHouse/pull/77133) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* 允许对 `plain_rewritable disk` 执行 ALTER TABLE DROP PARTITION。 [#77138](https://github.com/ClickHouse/ClickHouse/pull/77138) ([Julia Kartseva](https://github.com/jkartseva)).
* 备份/恢复设置 `allow_s3_native_copy` 现在支持三种值：- `False`：不使用 S3 原生复制；- `True`（旧默认值）：ClickHouse 先尝试 S3 原生复制，失败后回退到读取再写入的方式；- `'auto'`（新默认值）：ClickHouse 先比较源端与目标端的凭据。若相同，则尝试 S3 原生复制，随后可能回退到读取再写入；若不同，则直接采用读取再写入的方式。 [#77401](https://github.com/ClickHouse/ClickHouse/pull/77401) ([Vitaly Baranov](https://github.com/vitlibar)).
* DeltaLake 表引擎的 delta kernel 支持使用 AWS 会话令牌和环境凭据。 [#77661](https://github.com/ClickHouse/ClickHouse/pull/77661) ([Kseniia Sumarokova](https://github.com/kssenii)).

#### 缺陷修复（正式稳定版本中用户可感知的异常行为）

* 修复异步分布式 INSERT 在处理待发送批次时卡住的问题，例如因 `No such file or directory` 而卡住。 [#72939](https://github.com/ClickHouse/ClickHouse/pull/72939) ([Azat Khuzhin](https://github.com/azat)).
* 改进索引分析期间的日期时间转换，强制隐式 Date 到 DateTime 转换采用饱和行为，解决日期时间取值范围限制导致的潜在索引分析不准确问题。修复 [#73307](https://github.com/ClickHouse/ClickHouse/issues/73307)。同时修复 `date_time_overflow_behavior = 'ignore'`（默认值）时的显式 `toDateTime` 转换。 [#73326](https://github.com/ClickHouse/ClickHouse/pull/73326) ([Amos Bird](https://github.com/amosbird)).
* 修复 UUID 与表名之间竞态引发的各类问题。例如修复 `RENAME` 与 `RESTART REPLICA` 的竞态：并发执行 `RENAME` 和 `SYSTEM RESTART REPLICA` 时，可能重启错误的副本，或者使某张表停留在 `Table X is being restarted` 状态，也可能同时出现两种情况。 [#76308](https://github.com/ClickHouse/ClickHouse/pull/76308) ([Azat Khuzhin](https://github.com/azat)).
* 修复启用异步插入并通过 insert into ... from file ... 插入不同大小的数据块时的数据丢失问题：若第一个块大小 \< async\_max\_size、第二个块 > async\_max\_size，第二个块不会被插入，其数据会滞留在 `squashing` 中。 [#76343](https://github.com/ClickHouse/ClickHouse/pull/76343) ([Han Fei](https://github.com/hanfei1991)).
* 将 `system.data_skipping_indices` 中的字段 'marks' 重命名为 'marks\_bytes'。 [#76374](https://github.com/ClickHouse/ClickHouse/pull/76374) ([Robert Schulze](https://github.com/rschu1ze)).
* 修复文件系统缓存动态调整大小时，对淘汰过程中意外错误的处理。 [#76466](https://github.com/ClickHouse/ClickHouse/pull/76466) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复并行哈希中的 `used_flag` 初始化问题，该问题可能导致服务器崩溃。 [#76580](https://github.com/ClickHouse/ClickHouse/pull/76580) ([Nikita Taranov](https://github.com/nickitat)).
* 修复在投影内调用 `defaultProfiles` 函数时的逻辑错误。 [#76627](https://github.com/ClickHouse/ClickHouse/pull/76627) ([pufit](https://github.com/pufit)).
* Web UI 不再在浏览器中触发交互式 HTTP Basic 身份验证提示。解决 [#76319](https://github.com/ClickHouse/ClickHouse/issues/76319)。 [#76637](https://github.com/ClickHouse/ClickHouse/pull/76637) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复从分布式表选择布尔字面量时出现的 THERE\_IS\_NO\_COLUMN 异常。 [#76656](https://github.com/ClickHouse/ClickHouse/pull/76656) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* 以更周全的方式选择表目录内的子路径。 [#76681](https://github.com/ClickHouse/ClickHouse/pull/76681) ([Daniil Ivanik](https://github.com/divanik)).
* 修复修改主键包含子列的表后出现的 `Not found column in block` 错误。此项跟进 [https://github.com/ClickHouse/ClickHouse/pull/72644](https://github.com/ClickHouse/ClickHouse/pull/72644)，依赖 [https://github.com/ClickHouse/ClickHouse/pull/74403](https://github.com/ClickHouse/ClickHouse/pull/74403)。 [#76686](https://github.com/ClickHouse/ClickHouse/pull/76686) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 为 NULL 短路求值添加性能测试并修复相关问题。 [#76708](https://github.com/ClickHouse/ClickHouse/pull/76708) ([李扬](https://github.com/taiyang-li)).
* 在完成输出写缓冲区之前先将其刷新。修复某些输出格式（例如 `JSONEachRowWithProgressRowOutputFormat`）在完成阶段产生的 `LOGICAL_ERROR`。 [#76726](https://github.com/ClickHouse/ClickHouse/pull/76726) ([Antonio Andelic](https://github.com/antonio2368)).
* 新增对 MongoDB 二进制 UUID 的支持（[#74452](https://github.com/ClickHouse/ClickHouse/issues/74452)）- 修复使用表函数时向 MongoDB 下推 WHERE 的问题（[#72210](https://github.com/ClickHouse/ClickHouse/issues/72210)）- 调整 MongoDB 与 ClickHouse 的类型映射，使 MongoDB 二进制 UUID 只能解析为 ClickHouse UUID，以避免今后的歧义和意外行为。- 修复 OID 映射并保持向后兼容。 [#76762](https://github.com/ClickHouse/ClickHouse/pull/76762) ([Kirill Nikiforov](https://github.com/allmazz)).
* 修复 JSON 子列并行反序列化前缀时的异常处理。 [#76809](https://github.com/ClickHouse/ClickHouse/pull/76809) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复 lgamma 函数对负整数的行为。 [#76840](https://github.com/ClickHouse/ClickHouse/pull/76840) ([Ilya Kataev](https://github.com/IlyaKataev)).
* 修复对显式定义的主键进行反向键分析的问题。类似于 [#76654](https://github.com/ClickHouse/ClickHouse/issues/76654)。 [#76846](https://github.com/ClickHouse/ClickHouse/pull/76846) ([Amos Bird](https://github.com/amosbird)).
* 修复 JSON 格式中 Bool 值的美化输出。 [#76905](https://github.com/ClickHouse/ClickHouse/pull/76905) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复异步插入出错时，JSON 列回滚不正确可能导致的崩溃。 [#76908](https://github.com/ClickHouse/ClickHouse/pull/76908) ([Pavel Kruglov](https://github.com/Avogar)).
* 此前 `multiIf` 在查询规划和正式执行期间可能返回不同类型的列，从 C++ 的角度看，这会导致代码产生未定义行为。 [#76914](https://github.com/ClickHouse/ClickHouse/pull/76914) ([Nikita Taranov](https://github.com/nickitat)).
* 修复 MergeTree 中常量可空键的序列化错误。修复 [#76939](https://github.com/ClickHouse/ClickHouse/issues/76939)。 [#76985](https://github.com/ClickHouse/ClickHouse/pull/76985) ([Amos Bird](https://github.com/amosbird)).
* 修复 `BFloat16` 值的排序。解决 [#75487](https://github.com/ClickHouse/ClickHouse/issues/75487)。解决 [#75669](https://github.com/ClickHouse/ClickHouse/issues/75669)。 [#77000](https://github.com/ClickHouse/ClickHouse/pull/77000) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 在数据片段一致性检查中增加跳过临时子列的判断，修复带 Variant 子列的 JSON 问题。见 [#72187](https://github.com/ClickHouse/ClickHouse/issues/72187)。 [#77034](https://github.com/ClickHouse/ClickHouse/pull/77034) ([Smita Kulkarni](https://github.com/SmitaRKulkarni)).
* 修复类型不匹配时 Values 格式模板解析中的崩溃。 [#77071](https://github.com/ClickHouse/ClickHouse/pull/77071) ([Pavel Kruglov](https://github.com/Avogar)).
* 禁止创建主键中包含子列的 EmbeddedRocksDB 表。此前此类表可以创建，但 SELECT 查询会失败。 [#77074](https://github.com/ClickHouse/ClickHouse/pull/77074) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复分布式查询中的非法比较，其原因是向远端下推谓词时未遵循字面量类型。 [#77093](https://github.com/ClickHouse/ClickHouse/pull/77093) ([Duc Canh Le](https://github.com/canhld94)).
* 修复创建 Kafka 表出现异常时的崩溃。 [#77121](https://github.com/ClickHouse/ClickHouse/pull/77121) ([Pavel Kruglov](https://github.com/Avogar)).
* Kafka 和 RabbitMQ 引擎支持 JSON 和子列。 [#77122](https://github.com/ClickHouse/ClickHouse/pull/77122) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复 MacOS 上的异常栈展开。 [#77126](https://github.com/ClickHouse/ClickHouse/pull/77126) ([Eduard Karacharov](https://github.com/korowa)).
* 修复 getSubcolumn 函数读取 'null' 子列的问题。 [#77163](https://github.com/ClickHouse/ClickHouse/pull/77163) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复布隆过滤器索引与 Array 及不支持的函数一起使用时的问题。 [#77271](https://github.com/ClickHouse/ClickHouse/pull/77271) ([Pavel Kruglov](https://github.com/Avogar)).
* 仅在最初的 CREATE 查询期间检查表数量限制。 [#77274](https://github.com/ClickHouse/ClickHouse/pull/77274) ([Nikolay Degterinsky](https://github.com/evillique)).
* 这不是缺陷：`SELECT toBFloat16(-0.0) == toBFloat16(0.0)` 现在正确返回 `true`（此前为 `false`），使其行为与 `Float32` 和 `Float64` 一致。 [#77290](https://github.com/ClickHouse/ClickHouse/pull/77290) ([Shankar Iyer](https://github.com/shankar-iyer)).
* 修复可能错误引用未初始化的 key\_index 变量的问题，该问题可能导致调试构建崩溃（在发布构建中，后续代码很可能会抛出错误，因此这种未初始化引用不会造成问题）。### 面向用户的变更文档条目。 [#77305](https://github.com/ClickHouse/ClickHouse/pull/77305) ([wxybear](https://github.com/wxybear)).
* 修复包含 Bool 值的分区名称，此问题由 [https://github.com/ClickHouse/ClickHouse/pull/74533](https://github.com/ClickHouse/ClickHouse/pull/74533) 引入。 [#77319](https://github.com/ClickHouse/ClickHouse/pull/77319) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复含可空元素的元组与字符串之间的比较。例如，此前比较元组 `(1, null)` 与字符串 `'(1,null)'` 会报错；另一个例子是比较元组 `(1, a)`（其中 `a` 为 Nullable 列）与字符串 `'(1, 2)'`。此变更解决了这些问题。 [#77323](https://github.com/ClickHouse/ClickHouse/pull/77323) ([Alexey Katsman](https://github.com/alexkats)).
* 修复 ObjectStorageQueueSource 中的崩溃，该问题由 [https://github.com/ClickHouse/ClickHouse/pull/76358](https://github.com/ClickHouse/ClickHouse/pull/76358) 引入。 [#77325](https://github.com/ClickHouse/ClickHouse/pull/77325) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复 `async_insert` 与 `input` 一起使用时的问题。 [#77340](https://github.com/ClickHouse/ClickHouse/pull/77340) ([Azat Khuzhin](https://github.com/azat)).
* 修复规划器移除排序列时，`WITH FILL` 可能因 NOT\_FOUND\_COLUMN\_IN\_BLOCK 而失败的问题。为 INTERPOLATE 表达式计算的 DAG 不一致也会引发类似问题。 [#77343](https://github.com/ClickHouse/ClickHouse/pull/77343) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* 修复为无效 AST 节点设置别名时的若干 LOGICAL\_ERROR。 [#77445](https://github.com/ClickHouse/ClickHouse/pull/77445) ([Raúl Marín](https://github.com/Algunenano)).
* 修复文件系统缓存实现中，写入文件段期间的错误处理。 [#77471](https://github.com/ClickHouse/ClickHouse/pull/77471) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 使 DatabaseIceberg 使用目录提供的正确元数据文件。解决 [#75187](https://github.com/ClickHouse/ClickHouse/issues/75187)。 [#77486](https://github.com/ClickHouse/ClickHouse/pull/77486) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 查询缓存现在将 UDF 视为非确定性函数，因此不再缓存包含 UDF 的查询结果。此前用户定义的非确定性 UDF 结果可能被错误缓存（问题 [#77553](https://github.com/ClickHouse/ClickHouse/issues/77553)）。 [#77633](https://github.com/ClickHouse/ClickHouse/pull/77633) ([Jimmy Aguilar Mena](https://github.com/Ergus)).
* 修复 system.filesystem\_cache\_log 仅在设置 `enable_filesystem_cache_log` 下工作的问题。 [#77650](https://github.com/ClickHouse/ClickHouse/pull/77650) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复在投影内调用 `defaultRoles` 函数时的逻辑错误，跟进 [#76627](https://github.com/ClickHouse/ClickHouse/issues/76627)。 [#77667](https://github.com/ClickHouse/ClickHouse/pull/77667) ([pufit](https://github.com/pufit)).
* 函数 `arrayResize` 不再允许第二个参数为 `Nullable` 类型。此前第二个参数为 `Nullable` 时，可能出现报错或错误结果等各种问题。（问题 [#48398](https://github.com/ClickHouse/ClickHouse/issues/48398)）。 [#77724](https://github.com/ClickHouse/ClickHouse/pull/77724) ([Manish Gill](https://github.com/mgill25)).
* 即使操作未产生任何待写入的数据块，也定期检查合并和变更操作是否已取消。 [#77766](https://github.com/ClickHouse/ClickHouse/pull/77766) ([János Benjamin Antal](https://github.com/antaljanosbenjamin)).

#### 构建/测试/打包改进

* 将 `clickhouse-odbc-bridge` 和 `clickhouse-library-bridge` 移至独立仓库 [https://github.com/ClickHouse/odbc-bridge/](https://github.com/ClickHouse/odbc-bridge/)。 [#76225](https://github.com/ClickHouse/ClickHouse/pull/76225) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复 Rust 交叉编译，并允许完全禁用 Rust。 [#76921](https://github.com/ClickHouse/ClickHouse/pull/76921) ([Raúl Marín](https://github.com/Algunenano)).
