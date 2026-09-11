<h3 id="258">
  ClickHouse 25.8 版本 LTS, 2025-08-28
</h3>

#### 向后不兼容变更

* 对于 JSON 中包含不同类型值的数组，推断为 `Array(Dynamic)` 而非未命名 `Tuple`。要使用原有行为，请禁用设置 `input_format_json_infer_array_of_dynamic_from_array_of_different_types`。 [#80859](https://github.com/ClickHouse/ClickHouse/pull/80859) ([Pavel Kruglov](https://github.com/Avogar)).
* 将 S3 延迟指标迁移为直方图，以保持一致并简化实现。 [#82305](https://github.com/ClickHouse/ClickHouse/pull/82305) ([Miсhael Stetsyuk](https://github.com/mstetsyuk)).
* 默认表达式中含点号的标识符必须用反引号括起，避免被解析为复合标识符。 [#83162](https://github.com/ClickHouse/ClickHouse/pull/83162) ([Pervakov Grigorii](https://github.com/GrigoryPervakov)).
* 仅在启用分析器（默认启用）时启用延迟物化，避免维护不使用分析器的实现；根据我们的经验，后者存在一些问题（例如条件中使用 `indexHint()` 时）。 [#83791](https://github.com/ClickHouse/ClickHouse/pull/83791) ([Igor Nikonov](https://github.com/devcrafter)).
* Parquet 输出格式默认将 `Enum` 值写为带 `ENUM` 逻辑类型的 `BYTE_ARRAY`。 [#84169](https://github.com/ClickHouse/ClickHouse/pull/84169) ([Pavel Kruglov](https://github.com/Avogar)).
* 默认启用 MergeTree 设置 `write_marks_for_substreams_in_compact_parts`，显著改善从新建紧凑数据片段读取子列的性能。版本低于 25.5 的服务器将无法读取新的紧凑数据片段。 [#84171](https://github.com/ClickHouse/ClickHouse/pull/84171) ([Pavel Kruglov](https://github.com/Avogar)).
* `concurrent_threads_scheduler` 原来的默认值为 `round_robin`，在大量单线程查询（如 INSERT）存在时被证明不公平。本次改为默认使用更稳妥的 `fair_round_robin` 调度器。 [#84747](https://github.com/ClickHouse/ClickHouse/pull/84747) ([Sergei Trifonov](https://github.com/serxa)).
* ClickHouse 支持 PostgreSQL 风格的 heredoc 语法：`$tag$ string contents... $tag$`，也称美元引号字符串字面量。此前版本对标签的限制较少，可包含标点、空白等任意字符。这与同样可以美元符号开头的标识符之间产生解析歧义。而 PostgreSQL 仅允许标签包含单词字符。为解决此问题，现在将 heredoc 标签限制为仅包含单词字符。关闭 [#84731](https://github.com/ClickHouse/ClickHouse/issues/84731)。 [#84846](https://github.com/ClickHouse/ClickHouse/pull/84846) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 更新 `azureBlobStorage`、`deltaLakeAzure` 和 `icebergAzure` 函数，正确验证 `AZURE` 权限。所有集群变体（`-Cluster` 函数）现在按照对应的非集群函数验证权限。此外，`icebergLocal` 和 `deltaLakeLocal` 现在强制检查 `FILE` 权限。 [#84938](https://github.com/ClickHouse/ClickHouse/pull/84938) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* 默认启用 `allow_dynamic_metadata_for_data_lakes` 设置（表引擎级设置）。 [#85044](https://github.com/ClickHouse/ClickHouse/pull/85044) ([Daniil Ivanik](https://github.com/divanik)).
* JSON 格式默认不再用引号包裹 64 位整数。 [#74079](https://github.com/ClickHouse/ClickHouse/pull/74079) ([Pavel Kruglov](https://github.com/Avogar))

#### 新功能

* 新增对 PromQL 方言的基础支持。在 clickhouse-client 中设置 `dialect='promql'`，通过 `promql_table_name='X'` 指向 TimeSeries 表，然后执行 `rate(ClickHouseProfileEvents_ReadCompressedBytes[1m])[5m:1m]` 等查询。还可用 SQL 包装 PromQL 查询：`SELECT * FROM prometheusQuery('up', ...);`。目前仅支持函数 `rate`、`delta` 和 `increase`，不支持一元/二元运算符，也没有 HTTP API。 [#75036](https://github.com/ClickHouse/ClickHouse/pull/75036) ([Vitaly Baranov](https://github.com/vitlibar)).
* AI 驱动的 SQL 生成现在可从环境变量 ANTHROPIC\_API\_KEY 和 OPENAI\_API\_KEY 中自动获取可用配置，使此功能可以零配置使用。 [#83787](https://github.com/ClickHouse/ClickHouse/pull/83787) ([Kaushik Iska](https://github.com/iskakaushik)).
* 通过新增表函数 `arrowflight`，实现对 [ArrowFlight RPC](https://arrow.apache.org/docs/format/Flight.html) 协议的支持。 [#74184](https://github.com/ClickHouse/ClickHouse/pull/74184) ([zakr600](https://github.com/zakr600)).
* 现在所有表都支持 `_table` 虚拟列（不再仅限 `Merge` 引擎表），对 UNION ALL 查询尤其有用。 [#63665](https://github.com/ClickHouse/ClickHouse/pull/63665) ([Xiaozhe Yu](https://github.com/wudidapaopao)).
* 允许外部聚合/排序使用任意存储策略（包括 S3 等对象存储）。 [#84734](https://github.com/ClickHouse/ClickHouse/pull/84734) ([Azat Khuzhin](https://github.com/azat)).
* 实现通过显式提供 IAM 角色进行 AWS S3 认证，以及 GCS OAuth。这些功能不久前还仅在 ClickHouse Cloud 中提供，现在已开源。同步对象存储连接参数序列化等部分接口。 [#84011](https://github.com/ClickHouse/ClickHouse/pull/84011) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Iceberg 表引擎支持按位置删除。 [#83094](https://github.com/ClickHouse/ClickHouse/pull/83094) ([Daniil Ivanik](https://github.com/divanik)).
* 支持 Iceberg 等值删除。 [#85843](https://github.com/ClickHouse/ClickHouse/pull/85843) ([Han Fei](https://github.com/hanfei1991)).
* 支持创建时写入 Iceberg。关闭 [#83927](https://github.com/ClickHouse/ClickHouse/issues/83927)。 [#83983](https://github.com/ClickHouse/ClickHouse/pull/83983) ([Konstantin Vedernikov](https://github.com/scanhex12)).
* 支持通过 Glue 目录写入。 [#84136](https://github.com/ClickHouse/ClickHouse/pull/84136) ([Konstantin Vedernikov](https://github.com/scanhex12)).
* 支持通过 Iceberg REST 目录写入。 [#84684](https://github.com/ClickHouse/ClickHouse/pull/84684) ([Konstantin Vedernikov](https://github.com/scanhex12)).
* 将所有 Iceberg 位置删除文件合并至数据文件，减少 Iceberg 存储中 Parquet 文件的数量和大小。语法：`OPTIMIZE TABLE table_name`。 [#85250](https://github.com/ClickHouse/ClickHouse/pull/85250) ([Konstantin Vedernikov](https://github.com/scanhex12)).
* Iceberg 支持 `drop table`（从 REST/Glue 目录移除，并删除表的元数据）。 [#85395](https://github.com/ClickHouse/ClickHouse/pull/85395) ([Konstantin Vedernikov](https://github.com/scanhex12)).
* Iceberg 支持以读时合并格式执行 ALTER DELETE 变更操作。 [#85549](https://github.com/ClickHouse/ClickHouse/pull/85549) ([Konstantin Vedernikov](https://github.com/scanhex12)).
* 支持写入 DeltaLake。关闭 [#79603](https://github.com/ClickHouse/ClickHouse/issues/79603)。 [#85564](https://github.com/ClickHouse/ClickHouse/pull/85564) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 新增设置 `delta_lake_snapshot_version`，允许 `DeltaLake` 表引擎读取指定快照版本。 [#85295](https://github.com/ClickHouse/ClickHouse/pull/85295) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 在元数据（清单条目）中写入更多 Iceberg 统计信息（列大小、上下界），用于 min-max 裁剪。 [#85746](https://github.com/ClickHouse/ClickHouse/pull/85746) ([Konstantin Vedernikov](https://github.com/scanhex12)).
* 支持在 Iceberg 中添加、删除和修改简单类型的列。 [#85769](https://github.com/ClickHouse/ClickHouse/pull/85769) ([Konstantin Vedernikov](https://github.com/scanhex12)).
* Iceberg：支持写入 version-hint 文件。关闭 [#85097](https://github.com/ClickHouse/ClickHouse/issues/85097)。 [#85130](https://github.com/ClickHouse/ClickHouse/pull/85130) ([Konstantin Vedernikov](https://github.com/scanhex12)).
* 临时用户创建的视图现在保存实际用户的一份副本，不再因临时用户被删除而失效。 [#84763](https://github.com/ClickHouse/ClickHouse/pull/84763) ([pufit](https://github.com/pufit)).
* 向量相似度索引现在支持二值量化。二值量化显著降低内存占用，并通过更快的距离计算加速向量索引构建。现有设置 `vector_search_postfilter_multiplier `也已废弃，由更通用的 `vector_search_index_fetch_multiplier` 替代。 [#85024](https://github.com/ClickHouse/ClickHouse/pull/85024) ([Shankar Iyer](https://github.com/shankar-iyer)).
* 允许 `s3` 或 `s3Cluster` 表引擎/表函数使用键值参数，例如 `s3('url', CSV, structure = 'a Int32', compression_method = 'gzip')`。 [#85134](https://github.com/ClickHouse/ClickHouse/pull/85134) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 新增系统表，保存 Kafka 等引擎收到的错误消息（“死信队列”）。 [#68873](https://github.com/ClickHouse/ClickHouse/pull/68873) ([Ilya Golshtein](https://github.com/ilejn)).
* 为 Replicated 数据库新增 SYSTEM RESTORE DATABASE REPLICA，类似 ReplicatedMergeTree 已有的恢复功能。 [#73100](https://github.com/ClickHouse/ClickHouse/pull/73100) ([Konstantin Morozov](https://github.com/k-morozov)).
* PostgreSQL 协议现在支持 `COPY` 命令。 [#74344](https://github.com/ClickHouse/ClickHouse/pull/74344) ([Konstantin Vedernikov](https://github.com/scanhex12)).
* MySQL 协议支持 C# 客户端。关闭 [#83992](https://github.com/ClickHouse/ClickHouse/issues/83992)。 [#84397](https://github.com/ClickHouse/ClickHouse/pull/84397) ([Konstantin Vedernikov](https://github.com/scanhex12)).
* 支持 Hive 分区风格的读写。 [#76802](https://github.com/ClickHouse/ClickHouse/pull/76802) ([Arthur Passos](https://github.com/arthurpassos)).
* 新增 `zookeeper_connection_log` 系统表，保存 ZooKeeper 连接的历史信息。 [#79494](https://github.com/ClickHouse/ClickHouse/pull/79494) ([János Benjamin Antal](https://github.com/antaljanosbenjamin)).
* 服务器设置 `cpu_slot_preemption` 为工作负载启用抢占式 CPU 调度，确保按最大最小公平原则在工作负载之间分配 CPU 时间。新增 CPU 限流的工作负载设置：`max_cpus`、`max_cpu_share` 和 `max_burst_cpu_seconds`。详见：[https://clickhouse.com/docs/operations/workload-scheduling#cpu\_scheduling](https://clickhouse.com/docs/operations/workload-scheduling#cpu_scheduling)。 [#80879](https://github.com/ClickHouse/ClickHouse/pull/80879) ([Sergei Trifonov](https://github.com/serxa)).
* 达到配置的查询次数或时间阈值后断开 TCP 连接，有助于在负载均衡器后方的集群节点间更均匀地分配连接。解决 [#68000](https://github.com/ClickHouse/ClickHouse/issues/68000)。 [#81472](https://github.com/ClickHouse/ClickHouse/pull/81472) ([Kenny Sun](https://github.com/hwabis)).
* 并行副本现在支持查询使用投影。[#82659](https://github.com/ClickHouse/ClickHouse/issues/82659)。 [#82807](https://github.com/ClickHouse/ClickHouse/pull/82807) ([zoomxi](https://github.com/zoomxi)).
* 除 DESCRIBE (SELECT ...) 外，还支持 DESCRIBE SELECT。 [#82947](https://github.com/ClickHouse/ClickHouse/pull/82947) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 为 mysql\_port 和 postgresql\_port 强制使用安全连接。 [#82962](https://github.com/ClickHouse/ClickHouse/pull/82962) ([tiandiwonder](https://github.com/tiandiwonder)).
* 现在可使用 `JSONExtractCaseInsensitive`（以及 `JSONExtract` 的其他变体）进行不区分大小写的 JSON 键查找。 [#83770](https://github.com/ClickHouse/ClickHouse/pull/83770) ([Alistair Evans](https://github.com/alistairjevans)).
* 新增 `system.completions` 表。关闭 [#81889](https://github.com/ClickHouse/ClickHouse/issues/81889)。 [#83833](https://github.com/ClickHouse/ClickHouse/pull/83833) ([|2ustam](https://github.com/RuS2m)).
* 新增函数 `nowInBlock64`。示例：`SELECT nowInBlock64(6)` 返回 `2025-07-29 17:09:37.775725`。 [#84178](https://github.com/ClickHouse/ClickHouse/pull/84178) ([Halersson Paris](https://github.com/halersson)).
* 为 AzureBlobStorage 添加 extra\_credentials，以通过 client\_id 和 tenant\_id 认证。 [#84235](https://github.com/ClickHouse/ClickHouse/pull/84235) ([Pablo Marcos](https://github.com/pamarcos)).
* 新增函数 `dateTimeToUUIDv7`，将 DateTime 值转换为 UUIDv7。示例：`SELECT dateTimeToUUIDv7(toDateTime('2025-08-15 18:57:56'))` 返回 `0198af18-8320-7a7d-abd3-358db23b9d5c`。 [#84319](https://github.com/ClickHouse/ClickHouse/pull/84319) ([samradovich](https://github.com/samradovich)).
* 新增聚合函数 `timeSeriesDerivToGrid` 和 `timeSeriesPredictLinearToGrid`，按指定起始时间戳、结束时间戳及步长定义的时间网格重采样数据，分别计算类似 PromQL 的 `deriv` 和 `predict_linear`。 [#84328](https://github.com/ClickHouse/ClickHouse/pull/84328) ([Stephen Chi](https://github.com/stephchi0)).
* 新增两个 TimeSeries 函数：`timeSeriesRange(start_timestamp, end_timestamp, step)` 和 `timeSeriesFromGrid(start_timestamp, end_timestamp, step, values)`。 [#85435](https://github.com/ClickHouse/ClickHouse/pull/85435) ([Vitaly Baranov](https://github.com/vitlibar)).
* 新增语法 `GRANT READ ON S3('s3://foo/.*') TO user`。 [#84503](https://github.com/ClickHouse/ClickHouse/pull/84503) ([pufit](https://github.com/pufit)).
* 新增输出格式 `Hash`，为结果的全部列和行计算单个哈希值，可用于计算结果“指纹”，例如数据传输成为瓶颈的场景。示例：`SELECT arrayJoin(['abc', 'def']), 42 FORMAT Hash` 返回 `e5f9e676db098fdb9530d2059d8c23ef`。 [#84607](https://github.com/ClickHouse/ClickHouse/pull/84607) ([Robert Schulze](https://github.com/rschu1ze)).
* 允许在 Keeper Multi 查询中设置任意监听。 [#84964](https://github.com/ClickHouse/ClickHouse/pull/84964) ([Mikhail Artemenko](https://github.com/Michicosun)).
* 为 `clickhouse-benchmark` 工具新增 `--max-concurrency` 选项，启用逐步增加并行查询数量的模式。 [#85623](https://github.com/ClickHouse/ClickHouse/pull/85623) ([Sergei Trifonov](https://github.com/serxa)).
* 支持部分聚合的指标。 [#85328](https://github.com/ClickHouse/ClickHouse/pull/85328) ([Mikhail Artemenko](https://github.com/Michicosun)).

#### 实验性功能

* 默认启用相关子查询支持，该功能不再处于实验阶段。 [#85107](https://github.com/ClickHouse/ClickHouse/pull/85107) ([Dmitry Novik](https://github.com/novikd)).
* Unity、Glue、REST 和 Hive Metastore 数据湖目录从实验性功能提升至 Beta。 [#85848](https://github.com/ClickHouse/ClickHouse/pull/85848) ([Melvyn Peignon](https://github.com/melvynator)).
* 轻量更新和删除从实验性功能提升至 Beta。
* 基于向量相似度索引的近似向量搜索现已正式可用。 [#85888](https://github.com/ClickHouse/ClickHouse/pull/85888) ([Robert Schulze](https://github.com/rschu1ze)).
* 新增 Ytsaurus 表引擎和表函数。 [#77606](https://github.com/ClickHouse/ClickHouse/pull/77606) ([MikhailBurdukov](https://github.com/MikhailBurdukov)).
* 此前文本索引数据会分成多个段（每段默认 256 MiB），这可能降低构建文本索引时的内存占用，但会增加磁盘空间需求和查询响应时间。 [#84590](https://github.com/ClickHouse/ClickHouse/pull/84590) ([Elmi Ahmadov](https://github.com/ahmadov)).

#### 性能改进

* 新增 Parquet 读取器实现，总体速度更快，支持页级过滤下推和 PREWHERE。目前处于实验阶段，使用设置 `input_format_parquet_use_native_reader_v3` 启用。 [#82789](https://github.com/ClickHouse/ClickHouse/pull/82789) ([Michael Kolupaev](https://github.com/al13n321)).
* 将 Azure 库中的官方 HTTP 传输替换为我们自行实现的 Azure Blob Storage HTTP 客户端。为此客户端引入多个与 S3 对应的设置，为 Azure 和 S3 引入更积极的连接超时策略，并改进 Azure 性能分析事件和指标的可观测性。新客户端默认启用，显著降低 Azure Blob Storage 冷查询的延迟。可设置 `azure_sdk_use_native_client=false` 恢复旧 `Curl` 客户端。 [#83294](https://github.com/ClickHouse/ClickHouse/pull/83294) ([alesapin](https://github.com/alesapin)). 此前 Azure 客户端的官方实现存在从五秒到数分钟的严重延迟尖峰，不适合生产环境。我们已弃用这个糟糕的实现，并为此非常自豪。
* 按文件大小递增顺序处理索引。最终顺序优先处理 minmax 和向量索引（分别因其简单和选择性高），随后处理小索引。在 minmax/向量索引内部，同样优先处理更小的索引。 [#84094](https://github.com/ClickHouse/ClickHouse/pull/84094) ([Maruth Goyal](https://github.com/maruthgoyal)).
* 默认启用 MergeTree 设置 `write_marks_for_substreams_in_compact_parts`，显著改善从新建紧凑数据片段读取子列的性能。版本低于 25.5 的服务器将无法读取新的紧凑数据片段。 [#84171](https://github.com/ClickHouse/ClickHouse/pull/84171) ([Pavel Kruglov](https://github.com/Avogar)).
* `azureBlobStorage` 表引擎：尽可能缓存和复用托管身份认证令牌，避免触发限流。 [#79860](https://github.com/ClickHouse/ClickHouse/pull/79860) ([Nick Blakely](https://github.com/niblak)).
* 当右侧由连接键列函数决定（所有行的连接键值唯一）时，`ALL` `LEFT/INNER` JOIN 会自动转换为 `RightAny`。 [#84010](https://github.com/ClickHouse/ClickHouse/pull/84010) ([Nikita Taranov](https://github.com/nickitat)).
* 除 `max_joined_block_size_rows` 外，新增 `max_joined_block_size_bytes`，限制含大列的 JOIN 的内存使用。 [#83869](https://github.com/ClickHouse/ClickHouse/pull/83869) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 新增逻辑（由默认启用的 `enable_producing_buckets_out_of_order_in_aggregation` 控制），允许在节省内存的聚合期间乱序发送部分桶。当部分聚合桶的合并耗时明显较长时，发起端可同时合并桶 ID 更大的桶，从而提高性能。代价是内存占用可能增加，但增幅应不大。 [#80179](https://github.com/ClickHouse/ClickHouse/pull/80179) ([Nikita Taranov](https://github.com/nickitat)).
* 新增设置 `optimize_rewrite_regexp_functions`（默认启用），检测到特定正则表达式模式时，优化器可将某些 `replaceRegexpAll`、`replaceRegexpOne` 和 `extract` 调用重写为更简单高效的形式。（问题 [#81981](https://github.com/ClickHouse/ClickHouse/issues/81981)）。 [#81992](https://github.com/ClickHouse/ClickHouse/pull/81992) ([Amos Bird](https://github.com/amosbird)).
* 在哈希 JOIN 主循环之外处理 `max_joined_block_rows`，略微提高 ALL JOIN 性能。 [#83216](https://github.com/ClickHouse/ClickHouse/pull/83216) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 优先处理粒度更大的 min-max 索引。关闭 [#75381](https://github.com/ClickHouse/ClickHouse/issues/75381)。 [#83798](https://github.com/ClickHouse/ClickHouse/pull/83798) ([Maruth Goyal](https://github.com/maruthgoyal)).
* 使 `DISTINCT` 窗口聚合在线性时间内运行，并修复 `sumDistinct` 的缺陷。关闭 [#79792](https://github.com/ClickHouse/ClickHouse/issues/79792)。关闭 [#52253](https://github.com/ClickHouse/ClickHouse/issues/52253)。 [#79859](https://github.com/ClickHouse/ClickHouse/pull/79859) ([Nihal Z. Miaji](https://github.com/nihalzp)).
* 减少存储读取和 CPU 使用，降低使用向量相似度索引的向量搜索查询延迟。 [#83803](https://github.com/ClickHouse/ClickHouse/pull/83803) ([Shankar Iyer](https://github.com/shankar-iyer)).
* 使用 Rendezvous 哈希改善并行副本间工作负载分配的缓存局部性。 [#82511](https://github.com/ClickHouse/ClickHouse/pull/82511) ([Anton Ivashkin](https://github.com/ianton-ru)).
* 为 If 组合器实现 addManyDefaults，加快带 If 组合器的聚合函数。 [#83870](https://github.com/ClickHouse/ClickHouse/pull/83870) ([Raúl Marín](https://github.com/Algunenano)).
* 按多个字符串或数值列分组时，按列计算序列化键。 [#83884](https://github.com/ClickHouse/ClickHouse/pull/83884) ([李扬](https://github.com/taiyang-li)).
* 并行副本读取的索引分析结果为空范围时，不再全表扫描。 [#84971](https://github.com/ClickHouse/ClickHouse/pull/84971) ([Eduard Karacharov](https://github.com/korowa)).
* 尝试使用 -falign-functions=64，提高性能测试的稳定性。 [#83920](https://github.com/ClickHouse/ClickHouse/pull/83920) ([Azat Khuzhin](https://github.com/azat)).
* 布隆过滤器索引现在可用于 `has([c1, c2, ...], column)` 等条件，其中 `column` 不是 `Array` 类型。这能提升此类查询性能，使其与 `IN` 运算符一样高效。 [#83945](https://github.com/ClickHouse/ClickHouse/pull/83945) ([Doron David](https://github.com/dorki)).
* 减少 CompressedReadBufferBase::readCompressedData 中不必要的 memcpy 调用。 [#83986](https://github.com/ClickHouse/ClickHouse/pull/83986) ([Raúl Marín](https://github.com/Algunenano)).
* 通过移除临时数据优化 `largestTriangleThreeBuckets`。 [#84479](https://github.com/ClickHouse/ClickHouse/pull/84479) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 通过简化代码优化字符串反序列化。关闭 [#38564](https://github.com/ClickHouse/ClickHouse/issues/38564)。 [#84561](https://github.com/ClickHouse/ClickHouse/pull/84561) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复并行副本最小任务大小的计算。 [#84752](https://github.com/ClickHouse/ClickHouse/pull/84752) ([Nikita Taranov](https://github.com/nickitat)).
* 改善在 `Join` 模式下应用补丁数据片段的性能。 [#85040](https://github.com/ClickHouse/ClickHouse/pull/85040) ([Anton Popov](https://github.com/CurtizJ)).
* 移除零字节。关闭 [#85062](https://github.com/ClickHouse/ClickHouse/issues/85062)。修复了若干小缺陷：函数 `structureToProtobufSchema`、`structureToCapnProtoSchema` 未正确放置终止零字节，而是使用换行符，导致输出缺少换行，并可能在其他依赖零字节的函数（如 `logTrace`、`demangle`、`extractURLParameter`、`toStringCutToZero` 和 `encrypt`/`decrypt`）中造成缓冲区溢出。`regexp_tree` 字典布局不支持处理含零字节的字符串。`formatRowNoNewline` 函数在使用 `Values` 或其他行尾不带换行的格式时，会错误地截掉输出的最后一个字符。函数 `stem` 存在异常安全错误，在极罕见情况下可能导致内存泄漏。`initcap` 对 `FixedString` 参数的处理不正确：如果数据块中前一个字符串以单词字符结尾，就无法识别当前字符串开头的单词起点。修复 Apache `ORC` 格式的安全漏洞，该漏洞可能暴露未初始化内存。更改 `replaceRegexpAll` 及其别名 `REGEXP_REPLACE` 的行为：即使前一次匹配处理了整个字符串，现在也可在字符串末尾进行空匹配，例如 `^a*|a*$` 或 `^|.*`；这与 JavaScript、Perl、Python、PHP、Ruby 的语义一致，但与 PostgreSQL 不同。简化并优化了许多函数的实现。修复了若干函数文档中的错误。请注意，String 列及由 String 列构成的复杂类型的 `byteSize` 输出已变化（空字符串从每个 9 字节变为 8 字节），这是正常现象。 [#85063](https://github.com/ClickHouse/ClickHouse/pull/85063) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 当常量物化仅用于返回单行时，优化该物化过程。 [#85071](https://github.com/ClickHouse/ClickHouse/pull/85071) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 改善 delta-kernel-rs 后端的并行文件处理。 [#85642](https://github.com/ClickHouse/ClickHouse/pull/85642) ([Azat Khuzhin](https://github.com/azat)).
* 新增设置 enable\_add\_distinct\_to\_in\_subqueries。启用后，ClickHouse 会自动为分布式查询中 IN 子句的子查询添加 DISTINCT，可显著缩小分片间传输的临时表，提高网络效率。注意，这是一种权衡：减少网络传输的同时，每个节点需要额外执行合并（去重）。当网络传输是瓶颈且合并成本可以接受时启用此设置。 [#81908](https://github.com/ClickHouse/ClickHouse/pull/81908) ([fhw12345](https://github.com/fhw12345)).
* 减少可执行用户自定义函数的查询内存跟踪开销。 [#83929](https://github.com/ClickHouse/ClickHouse/pull/83929) ([Eduard Karacharov](https://github.com/korowa)).
* 在 `DeltaLake` 存储中实现 `delta-kernel-rs` 内部过滤（统计信息和分区裁剪）。 [#84006](https://github.com/ClickHouse/ClickHouse/pull/84006) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 更细粒度地禁用依赖即时更新或补丁数据片段所更新列的数据跳过索引。现在仅对受即时变更操作或补丁数据片段影响的数据片段禁用索引，此前会对全部数据片段禁用。 [#84241](https://github.com/ClickHouse/ClickHouse/pull/84241) ([Anton Popov](https://github.com/CurtizJ)).
* 为加密命名集合的 encrypted\_buffer 分配最少所需内存。 [#84432](https://github.com/ClickHouse/ClickHouse/pull/84432) ([Pablo Marcos](https://github.com/pamarcos)).
* 改进布隆过滤器索引（普通、ngram 和 token）的支持：第一个参数为常量数组（集合）、第二个参数为索引列（子集）时也可利用索引，提高查询效率。 [#84700](https://github.com/ClickHouse/ClickHouse/pull/84700) ([Doron David](https://github.com/dorki)).
* 减少 Keeper 存储锁的争用。 [#84732](https://github.com/ClickHouse/ClickHouse/pull/84732) ([Antonio Andelic](https://github.com/antonio2368)).
* 补充 `WHERE` 对 `read_in_order_use_virtual_row` 的支持，使过滤条件未完全下推至 `PREWHERE` 的查询也能跳过更多数据片段的读取。 [#84835](https://github.com/ClickHouse/ClickHouse/pull/84835) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 允许异步遍历 Iceberg 表的对象，无需显式存储每个数据文件的对象。 [#85369](https://github.com/ClickHouse/ClickHouse/pull/85369) ([Daniil Ivanik](https://github.com/divanik)).
* 将非相关 `EXISTS` 作为标量子查询执行，以便使用标量子查询缓存并对结果进行常量折叠，从而有利于索引。为兼容性新增设置 `execute_exists_as_scalar_subquery=1`。 [#85481](https://github.com/ClickHouse/ClickHouse/pull/85481) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).

#### 改进

* 新增 `database_replicated` 设置，定义 DatabaseReplicatedSettings 的默认值。如果 Replicated 数据库创建查询未提供某设置，则使用这里的值。 [#85127](https://github.com/ClickHouse/ClickHouse/pull/85127) ([Tuan Pham Anh](https://github.com/tuanpach)).
* Web UI（play）中的表格列现在可以调整宽度。 [#84012](https://github.com/ClickHouse/ClickHouse/pull/84012) ([Doron David](https://github.com/dorki)).
* 通过 `iceberg_metadata_compression_method` 设置支持压缩的 `.metadata.json` 文件，支持 ClickHouse 的全部压缩方法。关闭 [#84895](https://github.com/ClickHouse/ClickHouse/issues/84895)。 [#85196](https://github.com/ClickHouse/ClickHouse/pull/85196) ([Konstantin Vedernikov](https://github.com/scanhex12)).
* 在 `EXPLAIN indexes = 1` 输出中显示待读取的范围数量。 [#79938](https://github.com/ClickHouse/ClickHouse/pull/79938) ([Christoph Wurm](https://github.com/cwurm)).
* 引入设置以配置 ORC 压缩块大小，并将默认值从 64KB 改为 256KB，与 Spark 或 Hive 保持一致。 [#80602](https://github.com/ClickHouse/ClickHouse/pull/80602) ([李扬](https://github.com/taiyang-li)).
* 为宽数据片段添加 `columns_substreams.txt` 文件，记录其中存储的全部子流。这有助于跟踪 JSON 和 Dynamic 类型的动态流，避免为获取动态流列表而读取这些列的样本（例如计算列大小时）。现在所有动态流也会反映在 `system.parts_columns` 中。 [#81091](https://github.com/ClickHouse/ClickHouse/pull/81091) ([Pavel Kruglov](https://github.com/Avogar)).
* 为 clickhouse format 新增命令行标志 --show\_secrets，默认隐藏敏感数据。 [#81524](https://github.com/ClickHouse/ClickHouse/pull/81524) ([Nikolai Ryzhov](https://github.com/Dolaxom)).
* 在 HTTP 套接字层面对 S3 读写请求限流（而非对整个 S3 请求限流），避免 `max_remote_read_network_bandwidth_for_server` 和 `max_remote_write_network_bandwidth_for_server` 限流出现问题。 [#81837](https://github.com/ClickHouse/ClickHouse/pull/81837) ([Sergei Trifonov](https://github.com/serxa)).
* 允许在不同窗口中为同一列混用不同排序规则（用于窗口函数）。 [#82877](https://github.com/ClickHouse/ClickHouse/pull/82877) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* 新增模拟、可视化和比较合并选择器的工具。 [#71496](https://github.com/ClickHouse/ClickHouse/pull/71496) ([Sergei Trifonov](https://github.com/serxa)).
* 如果 `address_expression` 参数提供了集群，支持 `remote*` 表函数使用并行副本。同时修复 [#73295](https://github.com/ClickHouse/ClickHouse/issues/73295)。 [#82904](https://github.com/ClickHouse/ClickHouse/pull/82904) ([Igor Nikonov](https://github.com/devcrafter)).
* 将写入备份文件的所有日志消息级别设为 TRACE。 [#82907](https://github.com/ClickHouse/ClickHouse/pull/82907) ([Hans Krutzer](https://github.com/hkrutzer)).
* SQL 格式化器可能对名称特殊的用户自定义函数和编解码器产生不一致的格式。关闭 [#83092](https://github.com/ClickHouse/ClickHouse/issues/83092)。 [#83644](https://github.com/ClickHouse/ClickHouse/pull/83644) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 现在可在 JSON 类型中使用 Time 和 Time64 类型。 [#83784](https://github.com/ClickHouse/ClickHouse/pull/83784) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 使用并行副本的连接现在采用连接逻辑步骤。如果并行副本连接查询出现问题，请尝试 `SET query_plan_use_new_logical_join_step=0` 并报告问题。 [#83801](https://github.com/ClickHouse/ClickHouse/pull/83801) ([Vladimir Cherkasov](https://github.com/vdimir)).
* 修复 cluster\_function\_process\_archive\_on\_multiple\_nodes 的兼容性。 [#83968](https://github.com/ClickHouse/ClickHouse/pull/83968) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 支持在 `S3Queue` 表级别更改物化视图插入设置。新增 `S3Queue` 级设置 `min_insert_block_size_rows_for_materialized_views` 和 `min_insert_block_size_bytes_for_materialized_views`。默认使用配置文件级设置，`S3Queue` 级设置会覆盖它们。 [#83971](https://github.com/ClickHouse/ClickHouse/pull/83971) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 新增性能分析事件 `MutationAffectedRowsUpperBound`，显示一次变更操作影响的行数（例如满足 `ALTER UPDATE` 或 `ALTER DELETE` 查询条件的总行数）。 [#83978](https://github.com/ClickHouse/ClickHouse/pull/83978) ([Anton Popov](https://github.com/CurtizJ)).
* 适用时（即 `memory_worker_use_cgroup` 与 cgroup 可用）利用 cgroup 信息校正内存跟踪器（`memory_worker_correct_memory_tracker`）。 [#83981](https://github.com/ClickHouse/ClickHouse/pull/83981) ([Azat Khuzhin](https://github.com/azat)).
* MongoDB：隐式将字符串解析为数值类型。此前，如果从 MongoDB 数据源收到的值为字符串，而 ClickHouse 表中对应列为数值类型，就会抛出异常。现在引擎尝试自动从字符串解析数值。关闭 [#81167](https://github.com/ClickHouse/ClickHouse/issues/81167)。 [#84069](https://github.com/ClickHouse/ClickHouse/pull/84069) ([Kirill Nikiforov](https://github.com/allmazz)).
* 在 `Pretty` 格式中为 `Nullable` 数值突出显示数字分组。 [#84070](https://github.com/ClickHouse/ClickHouse/pull/84070) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 仪表盘：提示框不会从容器顶部溢出。 [#84072](https://github.com/ClickHouse/ClickHouse/pull/84072) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 略微改善仪表盘上圆点的外观。 [#84074](https://github.com/ClickHouse/ClickHouse/pull/84074) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 仪表盘现在拥有稍好看的站点图标。 [#84076](https://github.com/ClickHouse/ClickHouse/pull/84076) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Web UI：让浏览器有机会保存密码，同时记住 URL 值。 [#84087](https://github.com/ClickHouse/ClickHouse/pull/84087) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 支持使用 `apply_to_children` 配置在特定 Keeper 节点上应用额外 ACL。 [#84137](https://github.com/ClickHouse/ClickHouse/pull/84137) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复 MergeTree 中“紧凑”Variant 类型判别值序列化的使用。此前某些可用场景未使用它。 [#84141](https://github.com/ClickHouse/ClickHouse/pull/84141) ([Pavel Kruglov](https://github.com/Avogar)).
* 为复制数据库设置新增服务器设置 `logs_to_keep`，允许更改复制数据库的默认 `logs_to_keep` 参数。较小的值可减少 ZNode 数量（尤其是数据库很多时），较大的值则允许离线更久的副本追赶进度。 [#84183](https://github.com/ClickHouse/ClickHouse/pull/84183) ([Alexey Khatskevich](https://github.com/Khatskevich)).
* 新增设置 `json_type_escape_dots_in_keys`，在 JSON 类型解析期间转义 JSON 键中的点号。默认禁用。 [#84207](https://github.com/ClickHouse/ClickHouse/pull/84207) ([Pavel Kruglov](https://github.com/Avogar)).
* 检查 EOF 前先检查连接是否已取消，防止读取已关闭的连接。修复 [#83893](https://github.com/ClickHouse/ClickHouse/issues/83893)。 [#84227](https://github.com/ClickHouse/ClickHouse/pull/84227) ([Raufs Dunamalijevs](https://github.com/rienath)).
* 略微改善 Web UI 中文本选中的颜色。差异仅在深色模式下选中的表格单元格中较明显；此前文本与选中背景的对比度不足。 [#84258](https://github.com/ClickHouse/ClickHouse/pull/84258) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 简化内部检查，改进服务器关闭时对客户端连接的处理。 [#84312](https://github.com/ClickHouse/ClickHouse/pull/84312) ([Raufs Dunamalijevs](https://github.com/rienath)).
* 新增设置 `delta_lake_enable_expression_visitor_logging`，用于关闭表达式访问器日志，因为调试时即使在测试日志级别，这些日志也可能过于冗长。 [#84315](https://github.com/ClickHouse/ClickHouse/pull/84315) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 现在同时报告 cgroup 级和系统级指标。cgroup 级指标名为 `CGroup<Metric>`，操作系统级指标（从 procfs 采集）名为 `OS<Metric>`。 [#84317](https://github.com/ClickHouse/ClickHouse/pull/84317) ([Nikita Taranov](https://github.com/nickitat)).
* 略微改善 Web UI 图表，提升不大，但确有改善。 [#84326](https://github.com/ClickHouse/ClickHouse/pull/84326) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 将 Replicated 数据库设置 `max_retries_before_automatic_recovery` 的默认值改为 10，使其在某些情况下更快恢复。 [#84369](https://github.com/ClickHouse/ClickHouse/pull/84369) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 修复含查询参数的 CREATE USER 的格式化（如 `CREATE USER {username:Identifier} IDENTIFIED WITH no_password`）。 [#84376](https://github.com/ClickHouse/ClickHouse/pull/84376) ([Azat Khuzhin](https://github.com/azat)).
* 新增 `backup_restore_s3_retry_initial_backoff_ms`、`backup_restore_s3_retry_max_backoff_ms`、`backup_restore_s3_retry_jitter_factor`，配置备份恢复期间的 S3 重试退避策略。 [#84421](https://github.com/ClickHouse/ClickHouse/pull/84421) ([Julia Kartseva](https://github.com/jkartseva)).
* 修复 S3Queue 有序模式：调用关闭后更早退出。 [#84463](https://github.com/ClickHouse/ClickHouse/pull/84463) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 支持写入可供 PyIceberg 读取的 Iceberg 数据。 [#84466](https://github.com/ClickHouse/ClickHouse/pull/84466) ([Konstantin Vedernikov](https://github.com/scanhex12)).
* 针对 KeyValue 存储主键（如 EmbeddedRocksDB、KeeperMap）下推 `IN` / `GLOBAL IN` 过滤时，允许对集合值进行类型转换。 [#84515](https://github.com/ClickHouse/ClickHouse/pull/84515) ([Eduard Karacharov](https://github.com/korowa)).
* 将 chdig 升级至 [25.7.1](https://github.com/azat/chdig/releases/tag/v25.7.1)。 [#84521](https://github.com/ClickHouse/ClickHouse/pull/84521) ([Azat Khuzhin](https://github.com/azat)).
* UDF 执行期间的底层错误现在以错误码 `UDF_EXECUTION_FAILED` 失败，此前可能返回不同错误码。 [#84547](https://github.com/ClickHouse/ClickHouse/pull/84547) ([Xu Jia](https://github.com/XuJia0210)).
* 为 KeeperClient 添加 `get_acl` 命令。 [#84641](https://github.com/ClickHouse/ClickHouse/pull/84641) ([Antonio Andelic](https://github.com/antonio2368)).
* 为数据湖表引擎添加快照版本。 [#84659](https://github.com/ClickHouse/ClickHouse/pull/84659) ([Pete Hampton](https://github.com/pjhampton)).
* 为 `ConcurrentBoundedQueue` 大小添加多维指标，标签包括队列类型（即队列用途）和队列 ID（当前队列实例随机生成的 ID）。 [#84675](https://github.com/ClickHouse/ClickHouse/pull/84675) ([Miсhael Stetsyuk](https://github.com/mstetsyuk)).
* `system.columns` 表现在提供 `column` 作为现有 `name` 列的别名。 [#84695](https://github.com/ClickHouse/ClickHouse/pull/84695) ([Yunchi Pang](https://github.com/yunchipang)).
* 新增 MergeTree 设置 `search_orphaned_parts_drives`，限制搜索数据片段的范围，例如仅搜索具有本地元数据的磁盘。 [#84710](https://github.com/ClickHouse/ClickHouse/pull/84710) ([Ilya Golshtein](https://github.com/ilejn)).
* 为 Keeper 新增四字命令 `lgrq`，切换收到请求的请求日志记录。 [#84719](https://github.com/ClickHouse/ClickHouse/pull/84719) ([Antonio Andelic](https://github.com/antonio2368)).
* 以不区分大小写的方式匹配外部认证 forward\_headers。 [#84737](https://github.com/ClickHouse/ClickHouse/pull/84737) ([ingodwerust](https://github.com/ingodwerust)).
* `encrypt_decrypt` 工具现在支持加密的 ZooKeeper 连接。 [#84764](https://github.com/ClickHouse/ClickHouse/pull/84764) ([Roman Vasin](https://github.com/rvasin)).
* 为 `system.errors` 添加格式字符串列，以便告警规则按相同错误类型分组。 [#84776](https://github.com/ClickHouse/ClickHouse/pull/84776) ([Miсhael Stetsyuk](https://github.com/mstetsyuk)).
* 更新 `clickhouse-format`，接受 `--highlight` 作为 `--hilite` 的别名；更新 `clickhouse-client`，接受 `--hilite` 作为 `--highlight` 的别名；同步更新 `clickhouse-format` 文档。 [#84806](https://github.com/ClickHouse/ClickHouse/pull/84806) ([Rishabh Bhardwaj](https://github.com/rishabh1815769)).
* 修复 Iceberg 按字段 ID 读取复杂类型。 [#84821](https://github.com/ClickHouse/ClickHouse/pull/84821) ([Konstantin Vedernikov](https://github.com/scanhex12)).
* 新增设置 `backup_slow_all_threads_after_retryable_s3_error`，观察到一次可重试错误后即降低所有线程的速度，从而减轻 `SlowDown` 等错误引发重试风暴时对 S3 的压力。 [#84854](https://github.com/ClickHouse/ClickHouse/pull/84854) ([Julia Kartseva](https://github.com/jkartseva)).
* 对于 Replicated 数据库中非追加模式可刷新物化视图的 DDL，跳过创建和重命名旧临时表。 [#84858](https://github.com/ClickHouse/ClickHouse/pull/84858) ([Tuan Pham Anh](https://github.com/tuanpach)).
* 使用 `keeper_server.coordination_settings.latest_logs_cache_entry_count_threshold` 和 `keeper_server.coordination_settings.commit_logs_cache_entry_count_threshold`，按条目数量限制 Keeper 日志条目缓存大小。 [#84877](https://github.com/ClickHouse/ClickHouse/pull/84877) ([Antonio Andelic](https://github.com/antonio2368)).
* 允许在不受支持的架构上使用 `simdjson`（此前会导致 `CANNOT_ALLOCATE_MEMORY` 错误）。 [#84966](https://github.com/ClickHouse/ClickHouse/pull/84966) ([Azat Khuzhin](https://github.com/azat)).
* 异步日志：支持调整限制，并增加可观测信息。 [#85105](https://github.com/ClickHouse/ClickHouse/pull/85105) ([Raúl Marín](https://github.com/Algunenano)).
* 汇总所有待删除对象，执行一次对象存储删除操作。 [#85316](https://github.com/ClickHouse/ClickHouse/pull/85316) ([Mikhail Artemenko](https://github.com/Michicosun)).
* Iceberg 当前的位置删除文件实现将全部数据保存在内存中。位置删除文件通常很大，因此代价可能很高。我的实现仅将 Parquet 删除文件的最后一个行组保留在内存中，成本显著降低。 [#85329](https://github.com/ClickHouse/ClickHouse/pull/85329) ([Konstantin Vedernikov](https://github.com/scanhex12)).
* chdig：修复屏幕残留、在编辑器中编辑查询后的崩溃，在 `path` 中搜索 `editor`，并升级至 [25.8.1](https://github.com/azat/chdig/releases/tag/v25.8.1)。 [#85341](https://github.com/ClickHouse/ClickHouse/pull/85341) ([Azat Khuzhin](https://github.com/azat)).
* 为 Azure 配置补充缺失的 `partition_columns_in_data_file`。 [#85373](https://github.com/ClickHouse/ClickHouse/pull/85373) ([Arthur Passos](https://github.com/arthurpassos)).
* 允许函数 `timeSeries*ToGrid` 的步长为零。这是以下变更的一部分： [#75036](https://github.com/ClickHouse/ClickHouse/pull/75036). [#85390](https://github.com/ClickHouse/ClickHouse/pull/85390) ([Vitaly Baranov](https://github.com/vitlibar)).
* 新增 show\_data\_lake\_catalogs\_in\_system\_tables 标志，控制是否将数据湖表加入 system.tables。解决 [#85384](https://github.com/ClickHouse/ClickHouse/issues/85384)。 [#85411](https://github.com/ClickHouse/ClickHouse/pull/85411) ([Smita Kulkarni](https://github.com/SmitaRKulkarni)).
* 为 `remote_fs_zero_copy_zookeeper_path` 添加宏展开支持。 [#85437](https://github.com/ClickHouse/ClickHouse/pull/85437) ([Mikhail Koviazin](https://github.com/mkmkme)).
* clickhouse-client 中的 AI 界面会稍好看一些。 [#85447](https://github.com/ClickHouse/ClickHouse/pull/85447) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 对旧部署默认启用 trace\_log.symbolize。 [#85456](https://github.com/ClickHouse/ClickHouse/pull/85456) ([Azat Khuzhin](https://github.com/azat)).
* 支持解析更多复合标识符场景，尤其改善 `ARRAY JOIN` 与旧分析器的兼容性。新增设置 `analyzer_compatibility_allow_compound_identifiers_in_unflatten_nested` 以保留原有行为。 [#85492](https://github.com/ClickHouse/ClickHouse/pull/85492) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 为 system.columns 获取表列大小时忽略 UNKNOWN\_DATABASE。 [#85632](https://github.com/ClickHouse/ClickHouse/pull/85632) ([Azat Khuzhin](https://github.com/azat)).
* 新增补丁数据片段未压缩总字节数限制（表设置 `max_uncompressed_bytes_in_patches`），防止轻量更新后 SELECT 查询明显变慢，并防止可能的轻量更新滥用。 [#85641](https://github.com/ClickHouse/ClickHouse/pull/85641) ([Anton Popov](https://github.com/CurtizJ)).
* 为 `system.grants` 添加 `parameter` 列，确定 `GRANT READ/WRITE` 的数据源类型以及 `GRANT TABLE ENGINE` 的表引擎。 [#85643](https://github.com/ClickHouse/ClickHouse/pull/85643) ([MikhailBurdukov](https://github.com/MikhailBurdukov)).
* 修复 CREATE DICTIONARY 查询中，含参数的列（如 Decimal(8)）之后尾随逗号的解析。关闭 [#85586](https://github.com/ClickHouse/ClickHouse/issues/85586)。 [#85653](https://github.com/ClickHouse/ClickHouse/pull/85653) ([Nikolay Degterinsky](https://github.com/evillique)).
* 函数 `nested` 支持内部数组。 [#85719](https://github.com/ClickHouse/ClickHouse/pull/85719) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 外部库的全部内存分配现在对 ClickHouse 内存跟踪器可见，并被正确计入。这可能导致某些查询报告的内存用量“增加”，或因 `MEMORY_LIMIT_EXCEEDED` 失败。 [#84082](https://github.com/ClickHouse/ClickHouse/pull/84082) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).

#### 缺陷修复（正式稳定版本中用户可见的异常行为）

* 此 PR 修复通过 REST 目录查询 Iceberg 表时的元数据解析。…… [#80562](https://github.com/ClickHouse/ClickHouse/pull/80562) ([Saurabh Kumar Ojha](https://github.com/saurabhojha)).
* 修复 DDLWorker 和 DatabaseReplicatedDDLWorker 中的 markReplicasActive。 [#81395](https://github.com/ClickHouse/ClickHouse/pull/81395) ([Tuan Pham Anh](https://github.com/tuanpach)).
* 修复解析失败时 Dynamic 列的回滚。 [#82169](https://github.com/ClickHouse/ClickHouse/pull/82169) ([Pavel Kruglov](https://github.com/Avogar)).
* 函数 `trim` 在输入全部为常量时，现在生成常量输出字符串。（缺陷 [#78796](https://github.com/ClickHouse/ClickHouse/issues/78796)）。 [#82900](https://github.com/ClickHouse/ClickHouse/pull/82900) ([Robert Schulze](https://github.com/rschu1ze)).
* 修复启用 `optimize_syntax_fuse_functions` 时重复子查询引发的逻辑错误，关闭 [#75511](https://github.com/ClickHouse/ClickHouse/issues/75511)。 [#83300](https://github.com/ClickHouse/ClickHouse/pull/83300) ([Vladimir Cherkasov](https://github.com/vdimir)).
* 修复包含 `WHERE ... IN (<subquery>)` 子句且启用查询条件缓存（设置 `use_query_condition_cache`）时的查询结果错误。 [#83445](https://github.com/ClickHouse/ClickHouse/pull/83445) ([LB7666](https://github.com/acking-you)).
* 过去使用 `gcs` 函数无需任何访问权限，现在会检查 `GRANT READ ON S3` 权限。关闭 [#70567](https://github.com/ClickHouse/ClickHouse/issues/70567)。 [#83503](https://github.com/ClickHouse/ClickHouse/pull/83503) ([pufit](https://github.com/pufit)).
* 从 s3Cluster() 执行 INSERT SELECT 写入复制 MergeTree 时跳过不可用节点。 [#83676](https://github.com/ClickHouse/ClickHouse/pull/83676) ([Igor Nikonov](https://github.com/devcrafter)).
* 修复使用 `plain_rewritable`/`plain` 元数据类型时的追加写入（MergeTree 用于实验性事务），此前此类写入会被直接忽略。 [#83695](https://github.com/ClickHouse/ClickHouse/pull/83695) ([Tuan Pham Anh](https://github.com/tuanpach)).
* 遮蔽 Avro schema registry 的认证信息，避免用户或日志看到它们。 [#83713](https://github.com/ClickHouse/ClickHouse/pull/83713) ([János Benjamin Antal](https://github.com/antaljanosbenjamin)).
* 修复以下问题：使用 `add_minmax_index_for_numeric_columns=1` 或 `add_minmax_index_for_string_columns=1` 创建 MergeTree 表后，索引在之后的 ALTER 操作中被物化，从而阻止 Replicated 数据库在新副本上正确初始化。 [#83751](https://github.com/ClickHouse/ClickHouse/pull/83751) ([Nikolay Degterinsky](https://github.com/evillique)).
* 修复 Parquet 写入器为 Decimal 类型输出错误的统计信息（min/max）。 [#83754](https://github.com/ClickHouse/ClickHouse/pull/83754) ([Michael Kolupaev](https://github.com/al13n321)).
* 修复 `LowCardinality(Float32|Float64|BFloat16)` 类型的 NaN 值排序。 [#83786](https://github.com/ClickHouse/ClickHouse/pull/83786) ([Pervakov Grigorii](https://github.com/GrigoryPervakov)).
* 从备份恢复时，定义者用户可能未被备份，导致整个备份无法恢复。为解决此问题，将恢复期间创建目标表时的权限检查推迟到运行时。 [#83818](https://github.com/ClickHouse/ClickHouse/pull/83818) ([pufit](https://github.com/pufit)).
* 修复无效 INSERT 后连接处于断开状态导致的客户端崩溃。 [#83842](https://github.com/ClickHouse/ClickHouse/pull/83842) ([Azat Khuzhin](https://github.com/azat)).
* 启用分析器时，允许 `remote` 表函数的 `view(...)` 参数引用任意表。修复 [#78717](https://github.com/ClickHouse/ClickHouse/issues/78717)。修复 [#79377](https://github.com/ClickHouse/ClickHouse/issues/79377)。 [#83844](https://github.com/ClickHouse/ClickHouse/pull/83844) ([Dmitry Novik](https://github.com/novikd)).
* 使 jsoneachrowwithprogress 中的 Onprogress 调用与最终处理同步。 [#83879](https://github.com/ClickHouse/ClickHouse/pull/83879) ([Sema Checherinda](https://github.com/CheSema)).
* 关闭 [#81303](https://github.com/ClickHouse/ClickHouse/issues/81303)。 [#83892](https://github.com/ClickHouse/ClickHouse/pull/83892) ([Konstantin Vedernikov](https://github.com/scanhex12)).
* 修复 colorSRGBToOKLCH/colorOKLCHToSRGB 混用常量和非常量参数的情况。 [#83906](https://github.com/ClickHouse/ClickHouse/pull/83906) ([Azat Khuzhin](https://github.com/azat)).
* 修复以 RowBinary 格式写入值为 NULL 的 JSON 路径。 [#83923](https://github.com/ClickHouse/ClickHouse/pull/83923) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复 Date 转换为 DateTime64 时较大值（>2106-02-07）溢出。 [#83982](https://github.com/ClickHouse/ClickHouse/pull/83982) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 始终应用 `filesystem_prefetches_limit`（不再仅限 `MergeTreePrefetchedReadPool`）。 [#83999](https://github.com/ClickHouse/ClickHouse/pull/83999) ([Azat Khuzhin](https://github.com/azat)).
* 修复 `MATERIALIZE COLUMN` 查询可能使 `checksums.txt` 出现意外文件、最终导致数据片段被分离的罕见缺陷。 [#84007](https://github.com/ClickHouse/ClickHouse/pull/84007) ([alesapin](https://github.com/alesapin)).
* 修复以不等式条件执行 JOIN 时，一列为 `LowCardinality`、另一列为常量所引发的逻辑错误 `Expected single dictionary argument for function`。关闭 [#81779](https://github.com/ClickHouse/ClickHouse/issues/81779)。 [#84019](https://github.com/ClickHouse/ClickHouse/pull/84019) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复 clickhouse-client 在交互模式下启用语法高亮时的崩溃。 [#84025](https://github.com/ClickHouse/ClickHouse/pull/84025) ([Bharat Nallan](https://github.com/bharatnc)).
* 修复查询条件缓存与递归 CTE 配合使用时的结果错误（问题 [#81506](https://github.com/ClickHouse/ClickHouse/issues/81506)）。 [#84026](https://github.com/ClickHouse/ClickHouse/pull/84026) ([zhongyuankai](https://github.com/zhongyuankai)).
* 正确处理定期刷新数据片段时的异常。 [#84083](https://github.com/ClickHouse/ClickHouse/pull/84083) ([Azat Khuzhin](https://github.com/azat)).
* 修复将过滤条件合并至 JOIN 条件时，等式操作数类型不同或引用常量的情况。修复 [#83432](https://github.com/ClickHouse/ClickHouse/issues/83432)。 [#84145](https://github.com/ClickHouse/ClickHouse/pull/84145) ([Dmitry Novik](https://github.com/novikd)).
* 修复罕见的 ClickHouse 崩溃：表包含投影、`lightweight_mutation_projection_mode = 'rebuild'`，且用户执行的轻量删除移除了表中任意数据块的全部行。 [#84158](https://github.com/ClickHouse/ClickHouse/pull/84158) ([alesapin](https://github.com/alesapin)).
* 修复后台取消检查线程导致的死锁。 [#84203](https://github.com/ClickHouse/ClickHouse/pull/84203) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复对无效 `WINDOW` 定义进行无限递归分析。修复 [#83131](https://github.com/ClickHouse/ClickHouse/issues/83131)。 [#84242](https://github.com/ClickHouse/ClickHouse/pull/84242) ([Dmitry Novik](https://github.com/novikd)).
* 修复导致 Bech32 编解码错误的缺陷。此前用于测试的在线算法实现也存在同样问题，因此未发现此缺陷。 [#84257](https://github.com/ClickHouse/ClickHouse/pull/84257) ([George Larionov](https://github.com/george-larionov)).
* 修复 `array()` 函数错误构造空元组的问题。修复 [#84202](https://github.com/ClickHouse/ClickHouse/issues/84202)。 [#84297](https://github.com/ClickHouse/ClickHouse/pull/84297) ([Amos Bird](https://github.com/amosbird)).
* 修复使用并行副本、多个 INNER JOIN 后接 RIGHT JOIN 的查询出现 `LOGICAL_ERROR`；对此类查询不使用并行副本。 [#84299](https://github.com/ClickHouse/ClickHouse/pull/84299) ([Vladimir Cherkasov](https://github.com/vdimir)).
* 此前 `set` 索引检查数据粒度是否通过过滤时未考虑 `Nullable` 列（问题 [#75485](https://github.com/ClickHouse/ClickHouse/issues/75485)）。 [#84305](https://github.com/ClickHouse/ClickHouse/pull/84305) ([Elmi Ahmadov](https://github.com/ahmadov)).
* ClickHouse 现在可以读取 Glue Catalog 中表类型以小写指定的表。 [#84316](https://github.com/ClickHouse/ClickHouse/pull/84316) ([alesapin](https://github.com/alesapin)).
* 存在 JOIN 或子查询时，不尝试将表函数替换为其集群版本。 [#84335](https://github.com/ClickHouse/ClickHouse/pull/84335) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 修复 `IAccessStorage` 中日志记录器的使用。 [#84365](https://github.com/ClickHouse/ClickHouse/pull/84365) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 修复轻量更新修改表中全部列时的逻辑错误。 [#84380](https://github.com/ClickHouse/ClickHouse/pull/84380) ([Anton Popov](https://github.com/CurtizJ)).
* `DoubleDelta` 编解码器现在只能用于数值类型列。特别是，`FixedString` 列不能再使用 `DoubleDelta` 压缩。（修复 [#80220](https://github.com/ClickHouse/ClickHouse/issues/80220)）。 [#84383](https://github.com/ClickHouse/ClickHouse/pull/84383) ([Jimmy Aguilar Mena](https://github.com/Ergus)).
* 修复 `MinMax` 索引求值期间与 NaN 值比较未使用正确范围的问题。 [#84386](https://github.com/ClickHouse/ClickHouse/pull/84386) ([Elmi Ahmadov](https://github.com/ahmadov)).
* 修复使用延迟物化读取 Variant 列。 [#84400](https://github.com/ClickHouse/ClickHouse/pull/84400) ([Pavel Kruglov](https://github.com/Avogar)).
* 将 `zoutofmemory` 归类为硬件错误，否则会抛出逻辑错误。参见 [https://github.com/clickhouse/clickhouse-core-incidents/issues/877](https://github.com/clickhouse/clickhouse-core-incidents/issues/877)。 [#84420](https://github.com/ClickHouse/ClickHouse/pull/84420) ([Han Fei](https://github.com/hanfei1991)).
* 修复以 `no_password` 创建的用户在服务器设置 `allow_no_password` 改为 0 后尝试登录导致的服务器崩溃。 [#84426](https://github.com/ClickHouse/ClickHouse/pull/84426) ([Shankar Iyer](https://github.com/shankar-iyer)).
* 修复对 Keeper changelog 的乱序写入。此前日志写入尚在进行时，回滚可能并发更改目标文件，导致日志不一致并可能丢失数据。 [#84434](https://github.com/ClickHouse/ClickHouse/pull/84434) ([Antonio Andelic](https://github.com/antonio2368)).
* 现在从表中移除全部 TTL 后，MergeTree 不再执行任何 TTL 相关操作。 [#84441](https://github.com/ClickHouse/ClickHouse/pull/84441) ([alesapin](https://github.com/alesapin)).
* 此前允许带 LIMIT 的并行分布式 INSERT SELECT，这是错误的，会导致目标表数据重复。 [#84477](https://github.com/ClickHouse/ClickHouse/pull/84477) ([Igor Nikonov](https://github.com/devcrafter)).
* 修复数据湖中按虚拟列裁剪文件。 [#84520](https://github.com/ClickHouse/ClickHouse/pull/84520) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复 Keeper 使用 RocksDB 存储时的泄漏（迭代器未被销毁）。 [#84523](https://github.com/ClickHouse/ClickHouse/pull/84523) ([Azat Khuzhin](https://github.com/azat)).
* 修复 ALTER MODIFY ORDER BY 未验证排序键中的 TTL 列。ALTER 操作的 ORDER BY 子句现在正确拒绝 TTL 列，防止潜在表损坏。 [#84536](https://github.com/ClickHouse/ClickHouse/pull/84536) ([xiaohuanlin](https://github.com/xiaohuanlin)).
* 为兼容性，将 25.5 之前的 `allow_experimental_delta_kernel_rs` 值改为 `false`。 [#84587](https://github.com/ClickHouse/ClickHouse/pull/84587) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 不再从清单文件获取结构，而是为每个快照独立存储相关结构，并根据数据文件所属快照推断相关结构。此前行为违反了 Iceberg 规范对状态为 existing 的清单文件条目的要求。 [#84588](https://github.com/ClickHouse/ClickHouse/pull/84588) ([Daniil Ivanik](https://github.com/divanik)).
* 修复 Keeper 设置 `rotate_log_storage_interval = 0` 导致 ClickHouse 崩溃的问题。（问题 [#83975](https://github.com/ClickHouse/ClickHouse/issues/83975)）。 [#84637](https://github.com/ClickHouse/ClickHouse/pull/84637) ([George Larionov](https://github.com/george-larionov)).
* 修复 S3Queue 的“Table is already registered”逻辑错误。关闭 [#84433](https://github.com/ClickHouse/ClickHouse/issues/84433)。该问题由 [https://github.com/ClickHouse/ClickHouse/pull/83530](https://github.com/ClickHouse/ClickHouse/pull/83530) 引入。 [#84677](https://github.com/ClickHouse/ClickHouse/pull/84677) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 在 RefreshTask 中从 'view' 获取 ZooKeeper 时锁定 'mutex'。 [#84699](https://github.com/ClickHouse/ClickHouse/pull/84699) ([Tuan Pham Anh](https://github.com/tuanpach)).
* 修复延迟列与外部排序一起使用时的 `CORRUPTED_DATA` 错误。 [#84738](https://github.com/ClickHouse/ClickHouse/pull/84738) ([János Benjamin Antal](https://github.com/antaljanosbenjamin)).
* 修复 `DeltaLake` 存储中使用 delta-kernel 时的列裁剪。关闭 [#84543](https://github.com/ClickHouse/ClickHouse/issues/84543)。 [#84745](https://github.com/ClickHouse/ClickHouse/pull/84745) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 在 DeltaLake 存储的 delta-kernel 中刷新凭据。 [#84751](https://github.com/ClickHouse/ClickHouse/pull/84751) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复连接问题后启动多余内部备份。 [#84755](https://github.com/ClickHouse/ClickHouse/pull/84755) ([Vitaly Baranov](https://github.com/vitlibar)).
* 修复查询延迟远程数据源可能导致的向量越界。 [#84820](https://github.com/ClickHouse/ClickHouse/pull/84820) ([George Larionov](https://github.com/george-larionov)).
* `ngram` 和 `no_op` 分词器不再因空输入 token 导致实验性文本索引崩溃。 [#84849](https://github.com/ClickHouse/ClickHouse/pull/84849) ([Robert Schulze](https://github.com/rschu1ze)).
* 修复 `ReplacingMergeTree` 和 `CollapsingMergeTree` 引擎表的轻量更新。 [#84851](https://github.com/ClickHouse/ClickHouse/pull/84851) ([Anton Popov](https://github.com/CurtizJ)).
* 正确在使用对象队列引擎的表元数据中保存全部设置。 [#84860](https://github.com/ClickHouse/ClickHouse/pull/84860) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复 Keeper 返回的监听总数。 [#84890](https://github.com/ClickHouse/ClickHouse/pull/84890) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复版本低于 25.7 的服务器上创建的 `ReplicatedMergeTree` 引擎表的轻量更新。 [#84933](https://github.com/ClickHouse/ClickHouse/pull/84933) ([Anton Popov](https://github.com/CurtizJ)).
* 修复非复制 `MergeTree` 引擎表执行 `ALTER TABLE ... REPLACE PARTITION` 查询后的轻量更新。 [#84941](https://github.com/ClickHouse/ClickHouse/pull/84941) ([Anton Popov](https://github.com/CurtizJ)).
* 修复布尔字面量列名生成，使用“true”/“false”而非“1”/“0”，防止查询中布尔和整数字面量之间的列名冲突。 [#84945](https://github.com/ClickHouse/ClickHouse/pull/84945) ([xiaohuanlin](https://github.com/xiaohuanlin)).
* 修复后台调度池和执行器引起的内存跟踪偏差。 [#84946](https://github.com/ClickHouse/ClickHouse/pull/84946) ([Azat Khuzhin](https://github.com/azat)).
* 修复 Merge 表引擎潜在的排序不准确问题。 [#85025](https://github.com/ClickHouse/ClickHouse/pull/85025) ([Xiaozhe Yu](https://github.com/wudidapaopao)).
* 为 DiskEncrypted 实现缺失的 API。 [#85028](https://github.com/ClickHouse/ClickHouse/pull/85028) ([Azat Khuzhin](https://github.com/azat)).
* 检查相关子查询是否用于分布式上下文，以避免崩溃。修复 [#82205](https://github.com/ClickHouse/ClickHouse/issues/82205)。 [#85030](https://github.com/ClickHouse/ClickHouse/pull/85030) ([Dmitry Novik](https://github.com/novikd)).
* Iceberg 现在不再尝试在 SELECT 查询之间缓存相关快照版本，而是始终实际解析快照。此前尝试缓存 Iceberg 快照会在使用 Iceberg 表的时间旅行功能时引发问题。 [#85038](https://github.com/ClickHouse/ClickHouse/pull/85038) ([Daniil Ivanik](https://github.com/divanik)).
* 修复 `AzureIteratorAsync` 中的重复释放。 [#85064](https://github.com/ClickHouse/ClickHouse/pull/85064) ([Nikita Taranov](https://github.com/nickitat)).
* 改进尝试创建以 JWT 认证的用户时的错误消息。 [#85072](https://github.com/ClickHouse/ClickHouse/pull/85072) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 修复 `ReplicatedMergeTree` 中补丁数据片段的清理。此前在从另一副本下载已物化补丁数据片段的合并或变更结果数据片段之前，轻量更新的结果可能暂时在当前副本上不可见。 [#85121](https://github.com/ClickHouse/ClickHouse/pull/85121) ([Anton Popov](https://github.com/CurtizJ)).
* 修复物化视图中类型不同时的 illegal\_type\_of\_argument。 [#85135](https://github.com/ClickHouse/ClickHouse/pull/85135) ([Sema Checherinda](https://github.com/CheSema)).
* 修复 delta-kernel 实现中的段错误。 [#85160](https://github.com/ClickHouse/ClickHouse/pull/85160) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复移动元数据文件耗时较长时的复制数据库恢复。 [#85177](https://github.com/ClickHouse/ClickHouse/pull/85177) ([Tuan Pham Anh](https://github.com/tuanpach)).
* 修复 `additional_table_filters expression` 设置中 `IN (subquery)` 的 `Not-ready Set`。 [#85210](https://github.com/ClickHouse/ClickHouse/pull/85210) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 移除 SYSTEM DROP REPLICA 查询期间不必要的 `getStatus()` 调用，修复后台删除表时抛出 `Shutdown for storage is called` 异常的情况。 [#85220](https://github.com/ClickHouse/ClickHouse/pull/85220) ([Nikolay Degterinsky](https://github.com/evillique)).
* 修复 `DeltaLake` 引擎 delta-kernel 实现中的竞态。 [#85221](https://github.com/ClickHouse/ClickHouse/pull/85221) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复 `DeltaLake` 引擎禁用 delta-kernel 时读取分区数据的问题。该问题在 25.7 中引入（[https://github.com/ClickHouse/ClickHouse/pull/81136](https://github.com/ClickHouse/ClickHouse/pull/81136)）。 [#85223](https://github.com/ClickHouse/ClickHouse/pull/85223) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 为 CREATE OR REPLACE 和 RENAME 查询补充缺失的表名长度检查。 [#85326](https://github.com/ClickHouse/ClickHouse/pull/85326) ([Michael Kolupaev](https://github.com/al13n321)).
* 修复 DEFINER 被删除时，在 Replicated 数据库的新副本上创建可刷新物化视图。 [#85327](https://github.com/ClickHouse/ClickHouse/pull/85327) ([Nikolay Degterinsky](https://github.com/evillique)).
* 修复 Iceberg 写入复杂类型。 [#85330](https://github.com/ClickHouse/ClickHouse/pull/85330) ([Konstantin Vedernikov](https://github.com/scanhex12)).
* 复杂类型不支持写入上下界。 [#85332](https://github.com/ClickHouse/ClickHouse/pull/85332) ([Konstantin Vedernikov](https://github.com/scanhex12)).
* 修复通过 Distributed 表或 remote 表函数读取对象存储函数时的逻辑错误。修复：[#84658](https://github.com/ClickHouse/ClickHouse/issues/84658)，修复 [#85173](https://github.com/ClickHouse/ClickHouse/issues/85173)，修复 [#52022](https://github.com/ClickHouse/ClickHouse/issues/52022)。 [#85359](https://github.com/ClickHouse/ClickHouse/pull/85359) ([alesapin](https://github.com/alesapin)).
* 修复包含损坏投影的数据片段的备份。 [#85362](https://github.com/ClickHouse/ClickHouse/pull/85362) ([Antonio Andelic](https://github.com/antonio2368)).
* 在稳定之前，禁止在发布版本中将 `_part_offset` 列用于投影。 [#85372](https://github.com/ClickHouse/ClickHouse/pull/85372) ([Sema Checherinda](https://github.com/CheSema)).
* 修复对 JSON 执行 ALTER UPDATE 时的崩溃和数据损坏。 [#85383](https://github.com/ClickHouse/ClickHouse/pull/85383) ([Pavel Kruglov](https://github.com/Avogar)).
* 使用反向按序读取优化的并行副本查询可能产生错误结果。 [#85406](https://github.com/ClickHouse/ClickHouse/pull/85406) ([Igor Nikonov](https://github.com/devcrafter)).
* 修复字符串反序列化期间发生 MEMORY\_LIMIT\_EXCEEDED 时可能出现的未定义行为（崩溃）。 [#85440](https://github.com/ClickHouse/ClickHouse/pull/85440) ([Azat Khuzhin](https://github.com/azat)).
* 修复不正确的 KafkaAssignedPartitions 和 KafkaConsumersWithAssignment 指标。 [#85494](https://github.com/ClickHouse/ClickHouse/pull/85494) ([Ilya Golshtein](https://github.com/ilejn)).
* 修复使用 PREWHERE（显式或自动）时处理字节数统计被低估。 [#85495](https://github.com/ClickHouse/ClickHouse/pull/85495) ([Michael Kolupaev](https://github.com/al13n321)).
* 修复 S3 请求降速的提前返回条件：可重试错误导致全部线程暂停时，只需 s3\_slow\_all\_threads\_after\_network\_error 或 backup\_slow\_all\_threads\_after\_retryable\_s3\_error 之一为 true 即启用降速行为，而非要求两者同时为 true。 [#85505](https://github.com/ClickHouse/ClickHouse/pull/85505) ([Julia Kartseva](https://github.com/jkartseva)).
* 此 PR 修复通过 REST 目录查询 Iceberg 表时的元数据解析。…… [#85531](https://github.com/ClickHouse/ClickHouse/pull/85531) ([Saurabh Kumar Ojha](https://github.com/saurabhojha)).
* 修复更改设置 `log_comment` 或 `insert_deduplication_token` 的异步插入中罕见的崩溃。 [#85540](https://github.com/ClickHouse/ClickHouse/pull/85540) ([Anton Popov](https://github.com/CurtizJ)).
* 修复通过 HTTP 使用 multipart/form-data 时，date\_time\_input\_format 等参数被忽略。 [#85570](https://github.com/ClickHouse/ClickHouse/pull/85570) ([Sema Checherinda](https://github.com/CheSema)).
* 修复 icebergS3Cluster 和 icebergAzureCluster 表函数中的敏感信息遮蔽。 [#85658](https://github.com/ClickHouse/ClickHouse/pull/85658) ([MikhailBurdukov](https://github.com/MikhailBurdukov)).
* 修复 `JSONExtract` 将 JSON 数字转换为 Decimal 类型时的精度丢失。数值型 JSON 值现在保留精确的十进制表示，避免浮点舍入误差。 [#85665](https://github.com/ClickHouse/ClickHouse/pull/85665) ([ssive7b](https://github.com/ssive7b)).
* 修复同一 `ALTER` 语句中在 `DROP COLUMN` 之后使用 `COMMENT COLUMN IF EXISTS` 引发的 `LOGICAL_ERROR`。列已在同一语句中被删除时，`IF EXISTS` 子句现在正确跳过注释操作。 [#85688](https://github.com/ClickHouse/ClickHouse/pull/85688) ([xiaohuanlin](https://github.com/xiaohuanlin)).
* 修复从缓存读取 DeltaLake 的计数。 [#85704](https://github.com/ClickHouse/ClickHouse/pull/85704) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复 CoalescingMergeTree 处理大字符串时的段错误。关闭 [#84582](https://github.com/ClickHouse/ClickHouse/issues/84582)。 [#85709](https://github.com/ClickHouse/ClickHouse/pull/85709) ([Konstantin Vedernikov](https://github.com/scanhex12)).
* 在 Iceberg 写入时更新元数据时间戳。 [#85711](https://github.com/ClickHouse/ClickHouse/pull/85711) ([Konstantin Vedernikov](https://github.com/scanhex12)).
* 使用 `distributed_depth` 作为 \*Cluster 函数的标志是不正确的，可能导致数据重复；改用 `client_info.collaborate_with_initiator`。 [#85734](https://github.com/ClickHouse/ClickHouse/pull/85734) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 修复 Spark 无法读取位置删除文件的问题。 [#85762](https://github.com/ClickHouse/ClickHouse/pull/85762) ([Konstantin Vedernikov](https://github.com/scanhex12)).
* 修复 send\_logs\_source\_regexp（在 [#85105](https://github.com/ClickHouse/ClickHouse/issues/85105) 的异步日志重构后）。 [#85797](https://github.com/ClickHouse/ClickHouse/pull/85797) ([Azat Khuzhin](https://github.com/azat)).
* 修复带 update\_field 的字典在 MEMORY\_LIMIT\_EXCEEDED 错误时可能出现的不一致。 [#85807](https://github.com/ClickHouse/ClickHouse/pull/85807) ([Azat Khuzhin](https://github.com/azat)).
* 目标表为 `Distributed` 的并行分布式 `INSERT SELECT` 支持来自 `WITH` 语句的全局常量。此前查询可能抛出 `Unknown expression identifier` 错误。 [#85811](https://github.com/ClickHouse/ClickHouse/pull/85811) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 遮蔽 `deltaLakeAzure`、`deltaLakeCluster`、`icebergS3Cluster` 和 `icebergAzureCluster` 的凭据。 [#85889](https://github.com/ClickHouse/ClickHouse/pull/85889) ([Julian Maicher](https://github.com/jmaicher)).
* 修复在 `DatabaseReplicated` 中尝试 `CREATE ... AS (SELECT * FROM s3Cluster(...))` 时的逻辑错误。 [#85904](https://github.com/ClickHouse/ClickHouse/pull/85904) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 修复 `url()` 表函数发出的 HTTP 请求，使访问非标准端口时在 Host 请求头中正确包含端口号。这解决了访问在自定义端口运行的 MinIO 等 S3 兼容服务时，预签名 URL 的认证失败问题，这种配置在开发环境中很常见。（修复 [#85898](https://github.com/ClickHouse/ClickHouse/issues/85898)）。 [#85921](https://github.com/ClickHouse/ClickHouse/pull/85921) ([Tom Quist](https://github.com/tomquist)).
* 对于非 Delta 表，Unity Catalog 现在忽略含异常数据类型的结构。修复 [#85699](https://github.com/ClickHouse/ClickHouse/issues/85699)。 [#85950](https://github.com/ClickHouse/ClickHouse/pull/85950) ([alesapin](https://github.com/alesapin)).
* 修复 Iceberg 字段的可空性。 [#85977](https://github.com/ClickHouse/ClickHouse/pull/85977) ([Konstantin Vedernikov](https://github.com/scanhex12)).
* 修复 `Replicated` 数据库恢复的缺陷：表名包含 `%` 时，恢复期间可能以不同名称重建表。 [#85987](https://github.com/ClickHouse/ClickHouse/pull/85987) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 修复恢复空 `Memory` 表时因 `BACKUP_ENTRY_NOT_FOUND` 而导致备份恢复失败。 [#86012](https://github.com/ClickHouse/ClickHouse/pull/86012) ([Julia Kartseva](https://github.com/jkartseva)).
* 为 Distributed 表的 ALTER 添加 sharding\_key 检查。此前错误的 ALTER 会破坏表定义并导致服务器重启失败。 [#86015](https://github.com/ClickHouse/ClickHouse/pull/86015) ([Nikolay Degterinsky](https://github.com/evillique)).
* 不创建空的 Iceberg 删除文件。 [#86061](https://github.com/ClickHouse/ClickHouse/pull/86061) ([Konstantin Vedernikov](https://github.com/scanhex12)).
* 修复较大的设置值破坏 S3Queue 表和副本重启的问题。 [#86074](https://github.com/ClickHouse/ClickHouse/pull/86074) ([Nikolay Degterinsky](https://github.com/evillique)).

#### 构建/测试/打包改进

* S3 测试默认使用加密磁盘。 [#59898](https://github.com/ClickHouse/ClickHouse/pull/59898) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* 集成测试使用 `clickhouse` 二进制文件，以获取未剥离的调试符号。 [#83779](https://github.com/ClickHouse/ClickHouse/pull/83779) ([Mikhail f. Shiryaev](https://github.com/Felixoid)).
* 将内置 libxml2 从 2.14.4 升级至 2.14.5。 [#84230](https://github.com/ClickHouse/ClickHouse/pull/84230) ([Robert Schulze](https://github.com/rschu1ze)).
* 将内置 curl 从 8.14.0 升级至 8.15.0。 [#84231](https://github.com/ClickHouse/ClickHouse/pull/84231) ([Robert Schulze](https://github.com/rschu1ze)).
* 现在 CI 中缓存使用的内存更少，并改进了缓存淘汰测试。 [#84676](https://github.com/ClickHouse/ClickHouse/pull/84676) ([alesapin](https://github.com/alesapin)).
