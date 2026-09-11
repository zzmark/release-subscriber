<h3 id="2512">
  ClickHouse 25.12 版本, 2025-12-18
</h3>

#### 向后不兼容变更

* ALTER MODIFY COLUMN 将可空列转换为非可空类型时，现在要求显式指定 DEFAULT。此前此类 ALTER 可能因无法将 null 转换为非空值而卡住；现在以列的默认表达式替换 NULL。解决 [#5985](https://github.com/ClickHouse/ClickHouse/issues/5985)。[#84770](https://github.com/ClickHouse/ClickHouse/pull/84770)（[Vladimir Cherkasov](https://github.com/vdimir)）。
* Ngram 分词器不再返回长度小于所配置 N 的 n-gram。搜索词元为空时，文本搜索不返回任何行。[#89757](https://github.com/ClickHouse/ClickHouse/pull/89757)（[George Larionov](https://github.com/george-larionov)）。
* 将列从 `String` 改为 `Nullable(String)` 时，不会对数据执行变更操作。但 `uniq` 聚合函数使用不同的数据结构：可空列会使用包含嵌套 uniq 聚合器的 `AggregateFunctionNull`，而 `AggregateFunctionNull` 会额外序列化一个布尔标志，导致统计信息文件不兼容。修复方法是在序列化时增加标志，记录该列是否可空。统计格式已更改，存在旧格式统计信息时服务器可能失败。PR [#90904](https://github.com/ClickHouse/ClickHouse/pull/90904) 修复崩溃，并在现有统计信息采用旧格式时抛出异常。为避免异常，应执行 `ALTER TABLE table MATERIALIZE STATISTICS ALL` 重新生成统计信息。[#90311](https://github.com/ClickHouse/ClickHouse/pull/90311)（[Han Fei](https://github.com/hanfei1991)）。
* 移除设置 `allow_not_comparable_types_in_order_by`/`allow_not_comparable_types_in_comparison_functions`。允许在排序或比较函数中使用不可比较类型可能导致逻辑错误和非预期结果。解决 [#90028](https://github.com/ClickHouse/ClickHouse/issues/90028)。[#90527](https://github.com/ClickHouse/ClickHouse/pull/90527)（[Pavel Kruglov](https://github.com/Avogar)）。
* 将 `check_query_single_value_result` 的默认值从 `true` 改为 `false`，使 `CHECK TABLE` 返回逐数据片段的详细结果，而非聚合结果（1 表示正常，0 表示发现错误）。相比旧行为，这可能更符合用户需求。[#91009](https://github.com/ClickHouse/ClickHouse/pull/91009)（[Robert Schulze](https://github.com/rschu1ze)）。
* 修复多项隐式索引问题。显示或存储在 Keeper 元数据中的结构不再包含隐式索引，例如由 `add_minmax_index_for_numeric_columns` 或 `add_minmax_index_for_string_columns` 创建的索引。如果在新版本中创建或更新 ReplicatedMergeTree 表，而仍有副本运行旧版本，可能出现元数据错误。此时应向旧版副本发送 DDL，直到整个集群升级完成。[#91429](https://github.com/ClickHouse/ClickHouse/pull/91429)（[Raúl Marín](https://github.com/Algunenano)）。
* 更新 clickhouse-client：查询因 `receive_timeout` 超时时返回非零退出码 159（TIMEOUT\_EXCEEDED）。此前超时返回退出码 0，表示成功，使脚本和自动化难以检测超时失败。[#91432](https://github.com/ClickHouse/ClickHouse/pull/91432)（[Sav](https://github.com/sberss)）。
* 禁止使用空 `ORDER BY` 键创建 `ReplacingMergeTree`、`CollapsingMergeTree` 等特殊 `MergeTree` 表，因为其合并行为未定义。如仍需创建，请启用 `allow_suspicious_primary_key`。[#91569](https://github.com/ClickHouse/ClickHouse/pull/91569)（[Anton Popov](https://github.com/CurtizJ)）。
* 修复 `bitShiftLeft` 和 `bitShiftRight`：移位量恰好等于类型位宽时，返回 0 或空值。[#91943](https://github.com/ClickHouse/ClickHouse/pull/91943)（[Pablo Marcos](https://github.com/pamarcos)）。
* 延续 [#88380](https://github.com/ClickHouse/ClickHouse/pull/88380)。将禁用投影中的位置参数标记为向后不兼容变更，并新增 `enable_positional_arguments_for_projections` 设置，支持含位置参数投影的 ClickHouse 集群安全升级。[#92007](https://github.com/ClickHouse/ClickHouse/pull/92007)（[Dmitry Novik](https://github.com/novikd)）。
* 默认启用 JSON 高级共享数据。此后无法降级至 25.8 之前的版本，因为这些版本无法读取带 JSON 列的新数据片段。为安全升级，建议将 `compatibility` 设为先前版本，或配置 MergeTree 设置 `dynamic_serialization_version='v2', object_serialization_version='v2'`。[#92511](https://github.com/ClickHouse/ClickHouse/pull/92511)（[Pavel Kruglov](https://github.com/Avogar)）。

#### 新功能

* S3/Azure Queue 表除保留或删除文件外，现在还可配置为移动已处理文件或为其添加标签。解决 [#72944](https://github.com/ClickHouse/ClickHouse/issues/72944)。[#86907](https://github.com/ClickHouse/ClickHouse/pull/86907)（[Murat Khairulin](https://github.com/mxwell)）。
* 为 S3/Azure Queue 存储新增 `commit_on_select`，定义是否提交已处理数据，以及是否执行 `after_processing` 动作。默认值为 `false`，并修复 SELECT 时对已挂载物化视图的检查。[#91450](https://github.com/ClickHouse/ClickHouse/pull/91450)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 使用 XRay 进行运行时插桩，以调试生产环境问题并开展确定性性能分析。解决 [#74249](https://github.com/ClickHouse/ClickHouse/issues/74249)。[#89173](https://github.com/ClickHouse/ClickHouse/pull/89173)（[Pablo Marcos](https://github.com/pamarcos)）。
* 允许 `IN` 使用非常量第二参数，也支持以元组作为第二参数。[#77906](https://github.com/ClickHouse/ClickHouse/pull/77906)（[Yarik Briukhovetskyi](https://github.com/yariks5s)）。
* 新增计算几何类型面积和周长的函数。[#89047](https://github.com/ClickHouse/ClickHouse/pull/89047)（[Konstantin Vedernikov](https://github.com/scanhex12)）。
* 实现 `dictGetKeys`，返回属性等于指定值的字典键。使用查询级反向查找缓存加快重复查找，缓存由 `max_reverse_dictionary_lookup_cache_size_bytes` 调整。[#89197](https://github.com/ClickHouse/ClickHouse/pull/89197)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 新增 `type_json_skip_invalid_typed_paths`：插入或转换为 JSON 类型时，如果输入 JSON 无法转换为显式声明类型的路径，可禁用异常并回退为该路径类型的 null 或零值。[#89886](https://github.com/ClickHouse/ClickHouse/pull/89886)（[Max Justus Spransy](https://github.com/maxjustus)）。
* MergeTree 表支持 `direct`（嵌套循环）连接。要使用，必须将其设为唯一选项：`join_algorithm = 'direct'`。[#89920](https://github.com/ClickHouse/ClickHouse/pull/89920)（[Vladimir Cherkasov](https://github.com/vdimir)）。
* Iceberg 支持在 `CREATE` 操作中指定 `ORDER BY`，并在 `INSERT` 中排序。解决 [#89916](https://github.com/ClickHouse/ClickHouse/issues/89916)。[#90141](https://github.com/ClickHouse/ClickHouse/pull/90141)（[Konstantin Vedernikov](https://github.com/scanhex12)）。
* 引入投影级设置，通过 `ALTER TABLE ... ADD PROJECTION` 中新增的 `WITH SETTINGS` 子句指定，允许逐投影覆盖 `index_granularity`、`index_granularity_bytes` 等 MergeTree 存储参数。[#90158](https://github.com/ClickHouse/ClickHouse/pull/90158)（[Amos Bird](https://github.com/amosbird)）。
* 新增 SQL 函数 `HMAC(algorithm, message, key)`，属于 [#73900](https://github.com/ClickHouse/ClickHouse/issues/73900) 和 [#38775](https://github.com/ClickHouse/ClickHouse/issues/38775) 的一部分。[#90837](https://github.com/ClickHouse/ClickHouse/pull/90837)（[Mikhail f. Shiryaev](https://github.com/Felixoid)）。
* `has` 函数第一参数为常量数组时，支持使用主键和数据跳过索引。解决 [#90980](https://github.com/ClickHouse/ClickHouse/issues/90980)。[#91023](https://github.com/ClickHouse/ClickHouse/pull/91023)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 实现新的输入输出格式 `Buffers`，类似 `Native`，但与 `Native` 不同，不存储列名、列类型或任何额外元数据。解决 [#84017](https://github.com/ClickHouse/ClickHouse/issues/84017)。[#91156](https://github.com/ClickHouse/ClickHouse/pull/91156)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 新增 `max_streams_for_files_processing_in_cluster_functions` 设置，控制 Cluster 表函数并行读取文件的流数量。解决 [#90223](https://github.com/ClickHouse/ClickHouse/issues/90223)。[#91323](https://github.com/ClickHouse/ClickHouse/pull/91323)（[Pavel Kruglov](https://github.com/Avogar)）。
* 为行级安全增加数据脱敏，仅在 ClickHouse Cloud 提供。新增数据脱敏策略解析器，使 clickhouse-client 支持该功能。[#90552](https://github.com/ClickHouse/ClickHouse/pull/90552)（[pufit](https://github.com/pufit)）。
* 为 `windowFunnel` 聚合函数新增 `allow_reentry` 选项。与 strict\_order 一起启用时，忽略违反顺序的事件，而非终止漏斗分析。这样可处理刷新（A->A->B）或返回上一步（A->B->A->C）的用户路径，避免低估转化率。[#86916](https://github.com/ClickHouse/ClickHouse/pull/86916)（[Lee ChaeRok](https://github.com/LeeChaeRok)）。
* 改进 Keeper 与 ZooKeeper 的兼容性：支持创建时返回统计信息。[#88797](https://github.com/ClickHouse/ClickHouse/pull/88797)（[Konstantin Vedernikov](https://github.com/scanhex12)）。
* ClickHouse Keeper 支持 ZooKeeper 持久监听。延续工作的第二部分：[https://github.com/ClickHouse/ClickHouse/pull/78207](https://github.com/ClickHouse/ClickHouse/pull/78207)。[#88813](https://github.com/ClickHouse/ClickHouse/pull/88813)（[Konstantin Vedernikov](https://github.com/scanhex12)）。
* 新增 MergeTree 设置 `alter_column_secondary_index_mode`，控制变更操作期间如何处理索引，可选值为 throw、drop、rebuild 和 compatibility。解决 [#77797](https://github.com/ClickHouse/ClickHouse/issues/77797)。[#89335](https://github.com/ClickHouse/ClickHouse/pull/89335)（[Raúl Marín](https://github.com/Algunenano)）。
* `Time` 和 `Time64` 已可用于生产环境，因此默认启用 `enable_time_time64_type`。[#89345](https://github.com/ClickHouse/ClickHouse/pull/89345)（[Yarik Briukhovetskyi](https://github.com/yariks5s)）。
* 支持通过 `deltaLake` 表函数及 `delta_lake_snapshot_start_version`、`delta_lake_snapshot_end_version` 设置读取 DeltaLake CDF。CDF（变更数据馈送）可自动捕获并查询 Delta 表不同版本间插入、更新、删除等行级数据变化，通过 `delta.enableChangeDataFeed` 在 DeltaLake 中启用。随数据提供的列为 `_change_type`、`_commit_version`、`_commit_timestamp`。[#90431](https://github.com/ClickHouse/ClickHouse/pull/90431)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 元组元素访问支持负索引，例如 `tuple.-1`。[#91665](https://github.com/ClickHouse/ClickHouse/pull/91665)（[Amos Bird](https://github.com/amosbird)）。

#### 实验性功能

* 引入文本索引格式 v3，并将其提升至 Beta 状态。
* 新增自动使用并行副本执行查询的逻辑，由 `automatic_parallel_replicas_mode` 控制。正常单节点执行期间，ClickHouse 收集统计信息，供后续计划阶段参考；如果统计信息表明并行副本可能带来收益，就自动采用并行副本执行该查询。目前支持的查询范围仍相当有限。[#87541](https://github.com/ClickHouse/ClickHouse/pull/87541)（[Nikita Taranov](https://github.com/nickitat)）。
* 通过 --login 使用 Cloud 凭据访问 ClickHouse Cloud 实例。[#89261](https://github.com/ClickHouse/ClickHouse/pull/89261)（[Krishna Mannem](https://github.com/kcmannem)）。
* 新增会话级设置 `aggregate_function_input_format`，改进向包含 `AggregateFunction` 列的表执行 `INSERT`，允许以序列化状态、原始值或数组形式插入数据。[#88088](https://github.com/ClickHouse/ClickHouse/pull/88088)（[Punith Nandyappa Subashchandra](https://github.com/punithns97)）。

#### 性能改进

* 利用数据跳过索引和动态阈值过滤器优化 `ORDER BY...LIMIT N`，显著减少处理行数。[#89835](https://github.com/ClickHouse/ClickHouse/pull/89835)（[Shankar Iyer](https://github.com/shankar-iyer)）。
* ClickHouse 现在可使用数据跳过索引，分析混合 `AND` 和 `OR` 过滤条件的 WHERE 子句。此前 WHERE 必须是条件的合取（AND）才能利用数据跳过索引。新设置 `use_skip_indexes_for_disjunctions` 控制该功能，默认开启（问题 [#75228](https://github.com/ClickHouse/ClickHouse/issues/75228)）。[#87781](https://github.com/ClickHouse/ClickHouse/pull/87781)（[Shankar Iyer](https://github.com/shankar-iyer)）。
* LEFT/INNER JOIN 支持保持左表的有序读取，供后续步骤利用；可通过 `query_plan_read_in_order_through_join` 禁用。LEFT/INNER JOIN 还支持读取时的虚拟行优化，见 `read_in_order_use_virtual_row`。[#89815](https://github.com/ClickHouse/ClickHouse/pull/89815)（[Vladimir Cherkasov](https://github.com/vdimir)）。
* 改进较大 LIMIT 下延迟物化列的性能。[#90309](https://github.com/ClickHouse/ClickHouse/pull/90309)（[Nikolai Kochetov](https://github.com/KochetovNicolai)）。
* 存在包含数百万粒度的大型 `minmax` 索引时，降低索引分析延迟。[#90428](https://github.com/ClickHouse/ClickHouse/pull/90428)（[Shankar Iyer](https://github.com/shankar-iyer)）。
* 为 INNER JOIN 实现简单的 DPsize 连接重排算法。新实验性设置控制使用哪些算法及其顺序，例如 `query_plan_optimize_join_order_algorithm='dpsize,greedy'` 表示先尝试 DPsize，再回退到贪心算法。[#91002](https://github.com/ClickHouse/ClickHouse/pull/91002)（[Alexander Gololobov](https://github.com/davenger)）。
* 查询达到行数上限时快速失败。解决 [#61872](https://github.com/ClickHouse/ClickHouse/issues/61872)。[#62804](https://github.com/ClickHouse/ClickHouse/pull/62804)（[Sean Haynes](https://github.com/seandhaynes)）。
* [#84477](https://github.com/clickhouse/clickhouse/pull/84477) 对 `insert select from s3Cluster(...)` 并行分布式执行可使用的 SELECT 查询增加了限制。此变更重新允许使用此前支持的 WHERE。[#84611](https://github.com/ClickHouse/ClickHouse/pull/84611)（[Igor Nikonov](https://github.com/devcrafter)）。
* 遍历哈希表时预取键，减少缓存未命中。[#84708](https://github.com/ClickHouse/ClickHouse/pull/84708)（[lgbo](https://github.com/lgbo-ustc)）。
* 优化 `histogram` 聚合函数：只对点数组尾部排序，并跳过单调输入的排序，实现约 10% 的提速。[#85760](https://github.com/ClickHouse/ClickHouse/pull/85760)（[MakarDev](https://github.com/MakarDev)）。
* 利用文本索引构建额外的预过滤器，提升包含 `like`、`equals`、`has` 等函数的谓词过滤性能。通过 `query_plan_text_index_add_hint` 启用此优化；同时改进 `Map` 数据类型列的文本索引使用。[#88550](https://github.com/ClickHouse/ClickHouse/pull/88550)（[Anton Popov](https://github.com/CurtizJ)）。
* 通过在预计算的可能键值集合中快速查找，优化重复的字典反向查找。解决 [#7968](https://github.com/ClickHouse/ClickHouse/issues/7968)。[#88971](https://github.com/ClickHouse/ClickHouse/pull/88971)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 改进 `topK` 聚合函数的性能和行为。[#90091](https://github.com/ClickHouse/ClickHouse/pull/90091)（[Raúl Marín](https://github.com/Algunenano)）。
* 提升 `Decimal` 比较操作的性能。解决 [#28192](https://github.com/ClickHouse/ClickHouse/issues/28192)。[#90153](https://github.com/ClickHouse/ClickHouse/pull/90153)（[Konstantin Bogdanov](https://github.com/thevar1able)）。
* Apache Paimon 函数支持分区裁剪，延续 [https://github.com/ClickHouse/ClickHouse/pull/84423](https://github.com/ClickHouse/ClickHouse/pull/84423)。[#90253](https://github.com/ClickHouse/ClickHouse/pull/90253)（[JIaQi](https://github.com/JiaQiTang98)）。
* 通过动态分派，为逻辑函数使用高级 SIMD 操作。[#90432](https://github.com/ClickHouse/ClickHouse/pull/90432)（[Raúl Marín](https://github.com/Algunenano)）。
* 避免不必要地将结果列初始化为零，提高 JIT 函数性能。[#90449](https://github.com/ClickHouse/ClickHouse/pull/90449)（[Raúl Marín](https://github.com/Algunenano)）。
* 通过动态分派加快 `T64` 解压缩。[#90610](https://github.com/ClickHouse/ClickHouse/pull/90610)（[Raúl Marín](https://github.com/Algunenano)）。
* 优化 MergeTree 读取器的原地过滤。解决 [#87119](https://github.com/ClickHouse/ClickHouse/issues/87119)。[#90630](https://github.com/ClickHouse/ClickHouse/pull/90630)（[Xiaozhe Yu](https://github.com/wudidapaopao)）。
* 新增启发式策略，减少选定合并的宽度。更窄的合并会增加写放大，但有助于避免 `TOO_MANY_PARTS` 错误。[#91163](https://github.com/ClickHouse/ClickHouse/pull/91163)（[Mikhail Artemenko](https://github.com/Michicosun)）。
* 通过下推 `_path` 过滤值，提高以通配模式创建的 S3 表查询性能，避免 S3 列举操作。由 `s3_path_filter_limit` 控制。[#91165](https://github.com/ClickHouse/ClickHouse/pull/91165)（[Eduard Karacharov](https://github.com/korowa)）。
* 通过动态分派加快 WHERE 子句中列到布尔值的转换。[#91203](https://github.com/ClickHouse/ClickHouse/pull/91203)（[Raúl Marín](https://github.com/Algunenano)）。
* 通过动态分派加快单个数值数据块的排序。[#91213](https://github.com/ClickHouse/ClickHouse/pull/91213)（[Raúl Marín](https://github.com/Algunenano)）。
* 新增优化，移除查询计划中未使用的列。解决 [#75152](https://github.com/ClickHouse/ClickHouse/issues/75152)。[#76487](https://github.com/ClickHouse/ClickHouse/pull/76487)（[János Benjamin Antal](https://github.com/antaljanosbenjamin)）。
* 将 `query_plan_optimize_join_order_limit` 默认值改为 `10`。[#89312](https://github.com/ClickHouse/ClickHouse/pull/89312)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 默认启用 `allow_statistics_optimize`，使 JOIN 优化器使用列统计信息。[#89332](https://github.com/ClickHouse/ClickHouse/pull/89332)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* `ANTI` JOIN 支持运行时过滤器，并重构过滤器实现以减少锁竞争。[#89710](https://github.com/ClickHouse/ClickHouse/pull/89710)（[Dmitry Novik](https://github.com/novikd)）。
* 将 `min_bytes_for_wide_part` 和 `vertical_merge_algorithm_min_bytes_to_activate` 设为 128 MB，降低默认启用的 `system.metric_log` 表合并期间的内存占用。[#89811](https://github.com/ClickHouse/ClickHouse/pull/89811)（[filimonov](https://github.com/filimonov)）。
* 启用 PREWHERE 中的倒排索引。解决 [#89975](https://github.com/ClickHouse/ClickHouse/issues/89975)。[#89977](https://github.com/ClickHouse/ClickHouse/pull/89977)（[Peng Jian](https://github.com/fastio)）。
* 使用 GCP OAuth 时不添加 S3 提供程序，提高 GCS 性能。[#91706](https://github.com/ClickHouse/ClickHouse/pull/91706)（[Antonio Andelic](https://github.com/antonio2368)）。

#### 改进

* 新增 `apply_row_policy_after_final`，允许查询仅在 FINAL 之后应用行策略，使带行策略的 ReplacingMergeTree 行为更正确。修复 [#90986](https://github.com/ClickHouse/ClickHouse/issues/90986)。[#91065](https://github.com/ClickHouse/ClickHouse/pull/91065)（[Yarik Briukhovetskyi](https://github.com/yariks5s)）。
* `Pretty` 格式现在将具名元组显示为美化后的 JSON。解决 [#65022](https://github.com/ClickHouse/ClickHouse/issues/65022)。[#91779](https://github.com/ClickHouse/ClickHouse/pull/91779)（[Mostafa Mohamed Salah](https://github.com/Sasao4o)）。
* 为 `system.error_log` 新增 `last_error_time`、`last_error_message`、`last_error_query_id` 和 `last_error_trace`。[#89879](https://github.com/ClickHouse/ClickHouse/pull/89879)（[Narasimha Pakeer](https://github.com/npakeer)）。
* CLI 客户端现在可通过 `--no-server-client-version-message` 或 `false`，隐藏“ClickHouse 服务器版本早于客户端，这可能表示服务器已过时、可以升级”的消息。[#87784](https://github.com/ClickHouse/ClickHouse/pull/87784)（[Larry Snizek](https://github.com/larry-cdn77)）。
* 新增表示数据片段已被去重的错误消息。[#80264](https://github.com/ClickHouse/ClickHouse/pull/80264)（[Aleksandr Musorin](https://github.com/AVMusorin)）。
* 为 `system.kafka_consumers` 新增 `dependencies` 和 `missing_dependencies`，报告 Kafka 表的物化视图目标表；新增 `KafkaMVNotReady` 计数器。[#85346](https://github.com/ClickHouse/ClickHouse/pull/85346)（[Ilya Golshtein](https://github.com/ilejn)）。
* 通过 remote 和原生协议插入时，表的默认表达式现在正确生效。解决 [#87972](https://github.com/ClickHouse/ClickHouse/issues/87972)。[#88540](https://github.com/ClickHouse/ClickHouse/pull/88540)（[Pervakov Grigorii](https://github.com/GrigoryPervakov)）。
* 允许禁用 `PSI_*_*` 异步指标收集。[#88557](https://github.com/ClickHouse/ClickHouse/pull/88557)（[MikhailBurdukov](https://github.com/MikhailBurdukov)）。
* `Nullable` 类型列支持稀疏序列化，延续 [#44539](https://github.com/ClickHouse/ClickHouse/issues/44539)。[#88999](https://github.com/ClickHouse/ClickHouse/pull/88999)（[Amos Bird](https://github.com/amosbird)）。
* `plain-rewritable` 磁盘有独立实现和布局，不再基于常规 `plain` 磁盘构建。[#89807](https://github.com/ClickHouse/ClickHouse/pull/89807)（[Mikhail Artemenko](https://github.com/Michicosun)）。
* HTTP 中出现任何异常时，都不应包含最终的零长度分块。[#89998](https://github.com/ClickHouse/ClickHouse/pull/89998)（[Kaviraj Kanagaraj](https://github.com/kavirajk)）。
* 在 Keeper 服务端握手期间增加检查：`last_zxid_seen (provided by the client) > last_processed_zxid` 时拒绝客户端，防止客户端重连到落后副本时读到过时数据。[#90016](https://github.com/ClickHouse/ClickHouse/pull/90016)（[Miсhael Stetsyuk](https://github.com/mstetsyuk)）。
* 为 `Kafka` 表引擎新增可调设置 `kafka_consumer_reschedule_ms`，调整消费者等待新数据时的休眠时间。解决 [#89204](https://github.com/ClickHouse/ClickHouse/issues/89204)。[#90112](https://github.com/ClickHouse/ClickHouse/pull/90112)（[Jeremy Aguilon](https://github.com/JerAguilon)）。
* 为 `system.mutations` 新增 `parts_in_progress_names` 列，改进诊断。[#90155](https://github.com/ClickHouse/ClickHouse/pull/90155)（[Shaohua Wang](https://github.com/tiandiwonder)）。
* S3 库解析 XML 响应时遇到网络错误会重试。[#90216](https://github.com/ClickHouse/ClickHouse/pull/90216)（[Sema Checherinda](https://github.com/CheSema)）。
* 希望在独立服务器进程中运行 Keeper；为避免在大型区域中给 Prometheus 带来过多负载，应继续仅暴露 Keeper 相关指标。[#90244](https://github.com/ClickHouse/ClickHouse/pull/90244)（[Miсhael Stetsyuk](https://github.com/mstetsyuk)）。
* 除旧位置 `~/.clickhouse-client/` 外，支持从 XDG Base Directory 路径加载 ClickHouse Client 配置，例如 `~/.config/clickhouse/config.xml`。解决 [#89882](https://github.com/ClickHouse/ClickHouse/issues/89882)。[#90306](https://github.com/ClickHouse/ClickHouse/pull/90306)（[Wujun Jiang](https://github.com/rainac1)）。
* 为 Keeper 追加请求批次增加字节大小上限，由 `keeper_server.coordination_settings.max_requests_append_bytes_size` 控制。[#90342](https://github.com/ClickHouse/ClickHouse/pull/90342)（[Antonio Andelic](https://github.com/antonio2368)）。
* 为 Iceberg 新增设置，防止分区数量过多。[#90365](https://github.com/ClickHouse/ClickHouse/pull/90365)（[Konstantin Vedernikov](https://github.com/scanhex12)）。
* 更新接近保护阈值时的警告消息，显示当前值和抛出异常的阈值。[#90438](https://github.com/ClickHouse/ClickHouse/pull/90438)（[Nikita Fomichev](https://github.com/fm4v)）。
* `system.filesystem_cache` 表改为流式输出数据块，而非用一个数据块包含全部缓存状态。大型缓存的状态读取耗时且占用大量内存，因此流式处理对大规模部署不可或缺。[#90508](https://github.com/ClickHouse/ClickHouse/pull/90508)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复 Hive 分区异常消息缺少空格的问题。[#90685](https://github.com/ClickHouse/ClickHouse/pull/90685)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 表数据片段删除或被新数据片段替换时，现在会移除对应的向量相似度索引缓存项；此前仅依赖缓存淘汰延迟清除。[#90750](https://github.com/ClickHouse/ClickHouse/pull/90750)（[Shankar Iyer](https://github.com/shankar-iyer)）。
* 将命令行 ClickHouse 诊断工具 chdig 升级至 [v25.12.1](https://github.com/azat/chdig/releases/tag/v25.12.1)。[#91394](https://github.com/ClickHouse/ClickHouse/pull/91394)（[Azat Khuzhin](https://github.com/azat)）。
* S3 现在支持预签名 URL。解决 [#65032](https://github.com/ClickHouse/ClickHouse/issues/65032)。[#90827](https://github.com/ClickHouse/ClickHouse/pull/90827)（[Yarik Briukhovetskyi](https://github.com/yariks5s)）。
* 文本索引现在支持 `ReplacingMergeTree` 表。[#90908](https://github.com/ClickHouse/ClickHouse/pull/90908)（[Elmi Ahmadov](https://github.com/ahmadov)）。
* 避免在身份验证前返回的 HTTP 错误响应中暴露 ClickHouse 服务器版本。[#91003](https://github.com/ClickHouse/ClickHouse/pull/91003)（[filimonov](https://github.com/filimonov)）。
* HTTP 客户端连接达到 `hard_limit` 时，抛出 `HTTP_CONNECTION_LIMIT_REACHED`；磁盘连接的该上限设为 `20000`。[#91016](https://github.com/ClickHouse/ClickHouse/pull/91016)（[Sema Checherinda](https://github.com/CheSema)）。
* 新增 `system.background_schedule_pool{,_log}`，改进后台任务内省。[#91157](https://github.com/ClickHouse/ClickHouse/pull/91157)（[Azat Khuzhin](https://github.com/azat)）。
* Web UI 查询编辑器现在可通过 `Ctrl+/`，或 Mac 上的 `Cmd+/`，快速注释或取消注释选中行，便于测试时暂时禁用部分查询。[#91160](https://github.com/ClickHouse/ClickHouse/pull/91160)（[Samuel K.](https://github.com/OpenGLShaders)）。
* 将 `system.completions` 加入始终可访问的表列表。[#91166](https://github.com/ClickHouse/ClickHouse/pull/91166)（[Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)）。
* 新增性能分析事件 `FailedInitialQuery` 和 `FailedInitialSelectQuery`。[#91172](https://github.com/ClickHouse/ClickHouse/pull/91172)（[RinChanNOW](https://github.com/RinChanNOWWW)）。
* 读取具有大量子列的 JSON 列样本时，遵循 `merge_tree_use_prefixes_deserialization_thread_pool` 设置，而非无条件使用线程池，修复潜在的线程池饥饿。[#91208](https://github.com/ClickHouse/ClickHouse/pull/91208)（[Raufs Dunamalijevs](https://github.com/rienath)）。
* `tupleElement` 支持 `JSON` 类型。解决 [#81630](https://github.com/ClickHouse/ClickHouse/issues/81630)。[#91327](https://github.com/ClickHouse/ClickHouse/pull/91327)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复启用用户态页缓存时误报内存超限的问题。[#91361](https://github.com/ClickHouse/ClickHouse/pull/91361)（[Michael Kolupaev](https://github.com/al13n321)）。
* 现在可以使用 ngram\_length = 1 构建 Ngrams 分词器。[#91529](https://github.com/ClickHouse/ClickHouse/pull/91529)（[George Larionov](https://github.com/george-larionov)）。
* `INSERT INTO FUNCTION` 内部函数支持存储设置，与现有 `SELECT` 支持一致。解决 [#89386](https://github.com/ClickHouse/ClickHouse/issues/89386)。[#91707](https://github.com/ClickHouse/ClickHouse/pull/91707)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 对数据湖执行 TRUNCATE 时抛出“not implemented”，而非静默不执行任何操作。解决 [#86604](https://github.com/ClickHouse/ClickHouse/issues/86604)。[#91713](https://github.com/ClickHouse/ClickHouse/pull/91713)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 为 Parquet v3 读取器设置最大消息大小，避免 `DB::Exception: apache::thrift::transport::TTransportException: MaxMessageSize reached`。[#91737](https://github.com/ClickHouse/ClickHouse/pull/91737)（[Arthur Passos](https://github.com/arthurpassos)）。
* 新增 `insert_select_deduplicate`，更明确地控制 INSERT SELECT 的插入去重。通常无法对此类查询去重，但如果源表不变且结果有序，则可在重试时去重。无法跟踪源数据是否保持一致，但可以检查 SELECT 结果是否有序；实际上一般情况下也很难检查，而带 `ORDER BY ALL` 的简单情况容易处理。当前这里的逻辑实际上存在问题：虽然尝试去重，但多数情况下 SELECT 返回不同数据，因而无法在数据块间发现重复。[#91830](https://github.com/ClickHouse/ClickHouse/pull/91830)（[Sema Checherinda](https://github.com/CheSema)）。
* `Array` 转换为 `QBit` 时允许隐式类型转换，整数和浮点数组现在可直接插入 `QBit` 列，无需显式转换。[#91846](https://github.com/ClickHouse/ClickHouse/pull/91846)（[Raufs Dunamalijevs](https://github.com/rienath)）。
* 新增 `CapnProto` 消息大小上限，可通过 `format_capn_proto_max_message_size` 更改。[#91888](https://github.com/ClickHouse/ClickHouse/pull/91888)（[Antonio Andelic](https://github.com/antonio2368)）。
* 调整标记缓存指标，使其仅跟踪查询；[#83415](https://github.com/ClickHouse/ClickHouse/issues/83415) 之后合并也会更新 `MarkCacheHits`/`MarkCacheMisses`，此 PR 恢复此前行为。[#91910](https://github.com/ClickHouse/ClickHouse/pull/91910)（[Azat Khuzhin](https://github.com/azat)）。
* 修复本地连接的 `client_info.interface` 被设为 `TCP` 的问题。[#91933](https://github.com/ClickHouse/ClickHouse/pull/91933)（[Konstantin Bogdanov](https://github.com/thevar1able)）。
* ACME 客户端配置参数 `refresh_certificates_task_interval` 现在以秒为单位。[#92211](https://github.com/ClickHouse/ClickHouse/pull/92211)（[Konstantin Bogdanov](https://github.com/thevar1able)）。
* 在 `system.part_log` 中记录 `system.*_log` 的数据片段事件。[#92217](https://github.com/ClickHouse/ClickHouse/pull/92217)（[Azat Khuzhin](https://github.com/azat)）。

#### 错误修复（正式稳定版本中用户可见的异常行为）

* 修复 PREWHERE 涉及 `Time` 和 `Time64` 超类型的部分错误。解决 [#84544](https://github.com/ClickHouse/ClickHouse/issues/84544)。[#84715](https://github.com/ClickHouse/ClickHouse/pull/84715)（[Yarik Briukhovetskyi](https://github.com/yariks5s)）。
* 使用前初始化 `DNSResolver`，以遵循自定义设置。修复 [#76296](https://github.com/ClickHouse/ClickHouse/issues/76296)。[#81302](https://github.com/ClickHouse/ClickHouse/pull/81302)（[Zhigao Hong](https://github.com/zghong)）。
* 修复部分情况下从名称含点的列中读取子列的问题。解决 [#81261](https://github.com/ClickHouse/ClickHouse/issues/81261)、[#82058](https://github.com/ClickHouse/ClickHouse/issues/82058)、[#88169](https://github.com/ClickHouse/ClickHouse/issues/88169)。[#87205](https://github.com/ClickHouse/ClickHouse/pull/87205)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复 GenerateRandom 引擎使用非字面量参数时崩溃的问题，改为返回带清晰消息的 BAD\_ARGUMENTS，而非 LOGICAL\_ERROR。[#88157](https://github.com/ClickHouse/ClickHouse/pull/88157)（[Shafi Ahmed](https://github.com/ita004)）。
* 修复存在 `UNION` 时移除未使用投影列的问题。修复 [#88180](https://github.com/ClickHouse/ClickHouse/issues/88180)。[#88350](https://github.com/ClickHouse/ClickHouse/pull/88350)（[Sema Checherinda](https://github.com/CheSema)）。
* 修复主键降序时 `JOIN` 优化中的错误分片。解决 [#88512](https://github.com/ClickHouse/ClickHouse/issues/88512)。[#88794](https://github.com/ClickHouse/ClickHouse/pull/88794)（[Amos Bird](https://github.com/amosbird)）。
* 重新启用 s3queue\_keeper\_fault\_injection\_probablility，并修复问题。[#88800](https://github.com/ClickHouse/ClickHouse/pull/88800)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复 TTL 过早移除列导致的多个问题。解决 [#88002](https://github.com/ClickHouse/ClickHouse/issues/88002)。[#88860](https://github.com/ClickHouse/ClickHouse/pull/88860)（[Amos Bird](https://github.com/amosbird)）。
* temporary\_files\_buffer\_size 设为 0 时抛出异常。解决 [#88900](https://github.com/ClickHouse/ClickHouse/issues/88900)。[#88917](https://github.com/ClickHouse/ClickHouse/pull/88917)（[Vladimir Cherkasov](https://github.com/vdimir)）。
* 修复谓词包含 `NULL` 常量时，`Set` 索引分析期间出现的 `Bad get` 错误。修复 [#84856](https://github.com/ClickHouse/ClickHouse/issues/84856) 和 [#82974](https://github.com/ClickHouse/ClickHouse/issues/82974)。[#89429](https://github.com/ClickHouse/ClickHouse/pull/89429)（[Nikolai Kochetov](https://github.com/KochetovNicolai)）。
* 修复 `Cannot add subcolumn X.Y: column with this name already exists`。解决 [#89599](https://github.com/ClickHouse/ClickHouse/issues/89599)。[#89602](https://github.com/ClickHouse/ClickHouse/pull/89602)（[Azat Khuzhin](https://github.com/azat)）。
* 修复 `theilsU` 和 `contingency` 函数中导致错误结果的问题。[#89760](https://github.com/ClickHouse/ClickHouse/pull/89760)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 修复 Alias 稳定性问题：修正 SharedDatabaseCatalog 的 StrictnessLevel，禁止目标本身也是别名，并实现额外接口 getSerializationHints、supportsReplication、getStoragePolicy、totalBytesUncompressed、lifetimeRows、lifetimeBytes、storesDataOnDisk、tryLockForShare、lockForShare。解决 [#89106](https://github.com/ClickHouse/ClickHouse/issues/89106)。[#89812](https://github.com/ClickHouse/ClickHouse/pull/89812)（[Kai Zhu](https://github.com/nauu)）。
* 修复远程查询在 `IN` 内使用 `ARRAY JOIN`，且启用 `enable_lazy_columns_replication` 时可能发生的崩溃。解决 [#90361](https://github.com/ClickHouse/ClickHouse/issues/90361)。[#89997](https://github.com/ClickHouse/ClickHouse/pull/89997)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复多个连接使用 `analyzer_compatibility_join_using_top_level_identifier` 时可能出现的逻辑错误。[#90010](https://github.com/ClickHouse/ClickHouse/pull/90010)（[Vladimir Cherkasov](https://github.com/vdimir)）。
* 修复部分情况下从文本格式的 String 推断出无效 DateTime64 值的问题。解决 [#89368](https://github.com/ClickHouse/ClickHouse/issues/89368)。[#90013](https://github.com/ClickHouse/ClickHouse/pull/90013)（[Pavel Kruglov](https://github.com/Avogar)）。
* 从聚合状态及其他来源反序列化数据时检查大小。[#90031](https://github.com/ClickHouse/ClickHouse/pull/90031)（[Raúl Marín](https://github.com/Algunenano)）。
* 根据卷特征拆分数据片段范围，使冷卷能够执行 TTL 删除合并。此补丁后，最大 TTL \< 当前时间的数据片段将从冷存储移除。算法仅调度**单个数据片段删除**。[#90059](https://github.com/ClickHouse/ClickHouse/pull/90059)（[Mikhail Artemenko](https://github.com/Michicosun)）。
* 修复使用 `kafka_handle_error_mode = 'dead_letter_queue'` 创建 Kafka 表，但未配置 `system.dead_letter_queue` 时可能导致的服务器崩溃。解决 [#87573](https://github.com/ClickHouse/ClickHouse/issues/87573)。[#90064](https://github.com/ClickHouse/ClickHouse/pull/90064)（[Nikita Mikhaylov](https://github.com/nikitamikhaylov)）。
* 修复插入时使用 `ARRAY JOIN` 且启用 `enable_lazy_columns_replication` 可能出现的 `Column with Array type is not represented by ColumnArray column: Replicated` 错误。[#90066](https://github.com/ClickHouse/ClickHouse/pull/90066)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复服务器正常关闭时因销毁顺序错误导致的崩溃。解决 [#82420](https://github.com/ClickHouse/ClickHouse/issues/82420)。[#90076](https://github.com/ClickHouse/ClickHouse/pull/90076)（[Nikita Mikhaylov](https://github.com/nikitamikhaylov)）。
* 修复 `numbers` 系统表使用大步长时的逻辑错误和取模错误。解决 [#83398](https://github.com/ClickHouse/ClickHouse/issues/83398)。[#90123](https://github.com/ClickHouse/ClickHouse/pull/90123)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 修复原生 Parquet 写入器单线程写入时未保留原始顺序的问题，部分回退 [https://github.com/ClickHouse/ClickHouse/pull/64424/files](https://github.com/ClickHouse/ClickHouse/pull/64424/files)。[#90126](https://github.com/ClickHouse/ClickHouse/pull/90126)（[Arthur Passos](https://github.com/arthurpassos)）。
* 不对 LIMIT/OFFSET 表达式应用常量节点优化。修复 [#89607](https://github.com/ClickHouse/ClickHouse/issues/89607)。[#90156](https://github.com/ClickHouse/ClickHouse/pull/90156)（[Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)）。
* 修复 Hive 分区不兼容导致无法平滑升级到 25.8 的问题，解决升级时的 `All hive partitioning columns must be present in the schema` 错误。[#90202](https://github.com/ClickHouse/ClickHouse/pull/90202)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复使用 Glue 目录服务时，带时间戳列的 Iceberg 表出现 JSON 异常的问题。解决 [#90210](https://github.com/ClickHouse/ClickHouse/issues/90210)。[#90209](https://github.com/ClickHouse/ClickHouse/pull/90209)（[Alsu Giliazova](https://github.com/alsugiliazova)）。
* 修复数据片段行数少于 index\_granularity 时 MergeTreeReaderIndex 的行数不匹配。解决 [#89691](https://github.com/ClickHouse/ClickHouse/issues/89691)。[#90254](https://github.com/ClickHouse/ClickHouse/pull/90254)（[Peng Jian](https://github.com/fastio)）。
* 修复包含 `nan`/`inf` 的 `WITH FILL` 查询无限运行的问题。解决 [#69261](https://github.com/ClickHouse/ClickHouse/issues/69261)。[#90255](https://github.com/ClickHouse/ClickHouse/pull/90255)（[Konstantin Bogdanov](https://github.com/thevar1able)）。
* 修复 query\_plan\_use\_logical\_join\_step=0 且 JOIN ON 含剩余条件时的“column not found”错误。解决 [#88635](https://github.com/ClickHouse/ClickHouse/issues/88635)。[#90279](https://github.com/ClickHouse/ClickHouse/pull/90279)（[Vladimir Cherkasov](https://github.com/vdimir)）。
* 修复使用聚合投影优化的部分查询。[#90288](https://github.com/ClickHouse/ClickHouse/pull/90288)（[János Benjamin Antal](https://github.com/antaljanosbenjamin)）。
* 修复从 Compact 数据片段读取 JSON 子列时可能出现的 `CANNOT_READ_ALL_DATA` 错误。解决 [#90264](https://github.com/ClickHouse/ClickHouse/issues/90264)。[#90302](https://github.com/ClickHouse/ClickHouse/pull/90302)（[Pavel Kruglov](https://github.com/Avogar)）。
* 如果清单文件未指定排序顺序，或与表的 default\_sort\_order 不同，ClickHouse 不再对 Iceberg 使用有序读取优化。修复 [#89178](https://github.com/ClickHouse/ClickHouse/issues/89178)。[#90304](https://github.com/ClickHouse/ClickHouse/pull/90304)（[alesapin](https://github.com/alesapin)）。
* Time 和 Time64 从 DateTime、DateTime64 转换时，现在正确遵循时区，应显示与用户看到的 DateTime\[64] 相同时区的时间。解决 [#89896](https://github.com/ClickHouse/ClickHouse/issues/89896)。[#90310](https://github.com/ClickHouse/ClickHouse/pull/90310)（[Yarik Briukhovetskyi](https://github.com/yariks5s)）。
* 修复 `SELECT CAST(CAST(now(), 'Time'), 'Time64')` 返回错误结果的问题。解决 [#88349](https://github.com/ClickHouse/ClickHouse/issues/88349)。[#90324](https://github.com/ClickHouse/ClickHouse/pull/90324)（[Yarik Briukhovetskyi](https://github.com/yariks5s)）。
* 修复 randomStringUTF8 整数溢出导致的崩溃。[#90326](https://github.com/ClickHouse/ClickHouse/pull/90326)（[Michael Kolupaev](https://github.com/al13n321)）。
* 修复使用 `multicluster_root_path` 的多集群部署中的集群发现更新，避免延迟和遗漏 ZooKeeper 更新。[#90341](https://github.com/ClickHouse/ClickHouse/pull/90341)（[RinChanNOW](https://github.com/RinChanNOWWW)）。
* 修复 index\_granularity\_bytes=0 时，对不存在的 JSON 路径执行 PREWHERE 可能出现的逻辑错误。解决 [#86924](https://github.com/ClickHouse/ClickHouse/issues/86924)。[#90375](https://github.com/ClickHouse/ClickHouse/pull/90375)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复 `L2DistanceTransposed` 精度参数超出有效范围时的崩溃。解决 [#90401](https://github.com/ClickHouse/ClickHouse/issues/90401)。[#90405](https://github.com/ClickHouse/ClickHouse/pull/90405)（[Raufs Dunamalijevs](https://github.com/rienath)）。
* 修复 `arrayUnion` 使用 `Array(Dynamic)` 参数时可能出现的逻辑错误。解决 [#90270](https://github.com/ClickHouse/ClickHouse/issues/90270)。[#90409](https://github.com/ClickHouse/ClickHouse/pull/90409)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复在同一 ALTER 中重命名并修改同一 Nested 列时可能出现的逻辑错误。解决 [#90406](https://github.com/ClickHouse/ClickHouse/issues/90406)。[#90412](https://github.com/ClickHouse/ClickHouse/pull/90412)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复从 HTTP 参数解析 JSON/Dynamic/Variant 值的问题。解决 [#88925](https://github.com/ClickHouse/ClickHouse/issues/88925)。[#90430](https://github.com/ClickHouse/ClickHouse/pull/90430)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复 Hive 分区中的竞争条件：静态 `KeyValuePairExtractor` 会在并发读取文件时导致数据损坏或崩溃。[#90474](https://github.com/ClickHouse/ClickHouse/pull/90474)（[Paresh Joshi](https://github.com/pareshjoshij)）。
* 修复 `L2DistanceTransposed` 使用数组参考向量，默认类型为 `Array(Float64))`，与元素类型并非 `Float64` 的 `QBit` 列（`Float32`、`BFloat16`）计算距离不正确的问题。函数现在自动将参考向量转换为匹配 `QBit` 元素类型的类型。解决 [#89976](https://github.com/ClickHouse/ClickHouse/issues/89976)。[#90485](https://github.com/ClickHouse/ClickHouse/pull/90485)（[Raufs Dunamalijevs](https://github.com/rienath)）。
* 修复 `toDateTimeOrNull` 对负数参数返回 NULL 的错误。[#90490](https://github.com/ClickHouse/ClickHouse/pull/90490)（[Yarik Briukhovetskyi](https://github.com/yariks5s)）。
* 修复以 `Arrow` 格式输出 `LowCardinality(Bool/Date32)` 时可能发生的逻辑错误。解决 [#83883](https://github.com/ClickHouse/ClickHouse/issues/83883)。[#90505](https://github.com/ClickHouse/ClickHouse/pull/90505)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复 IPv4 解析函数，例如 `IPv4StringToNumOrDefault`，对部分无效输入返回无意义数据的问题。解决 [#90544](https://github.com/ClickHouse/ClickHouse/issues/90544) 和 [#87583](https://github.com/ClickHouse/ClickHouse/issues/87583)。[#90545](https://github.com/ClickHouse/ClickHouse/pull/90545)（[Michael Kolupaev](https://github.com/al13n321)）。
* 本地主机检查期间地址解析失败时重试 markReplicasActive：DDLTask 检查自身主机时出现异常则输出警告；DDLWorker::markReplicasActive 中，如果未找到本地主机但集群内存在主机 ID，则抛出异常以触发重试。[#90556](https://github.com/ClickHouse/ClickHouse/pull/90556)（[Tuan Pham Anh](https://github.com/tuanpach)）。
* 修复 `equals` 函数罕见情况下导致的逻辑错误。解决 [#88142](https://github.com/ClickHouse/ClickHouse/issues/88142)。[#90557](https://github.com/ClickHouse/ClickHouse/pull/90557)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 此变更有望修复 `test_ssh/test.py::test_paramiko_password` 的线程检测器崩溃。[#90612](https://github.com/ClickHouse/ClickHouse/pull/90612)（[Govind R Nair](https://github.com/Revertionist)）。
* 修复 `concatWithSeparator` 使用非字符串常量列时的逻辑错误。解决 [#90596](https://github.com/ClickHouse/ClickHouse/issues/90596)。[#90655](https://github.com/ClickHouse/ClickHouse/pull/90655)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 修复 `INTO OUTFILE` 的格式化。解决 [#90207](https://github.com/ClickHouse/ClickHouse/issues/90207)。[#90656](https://github.com/ClickHouse/ClickHouse/pull/90656)（[Azat Khuzhin](https://github.com/azat)）。
* 修复执行带子查询的变更操作且 `allow_statistics_optimize=1` 时可能出现的崩溃。解决 [#90626](https://github.com/ClickHouse/ClickHouse/issues/90626)。[#90664](https://github.com/ClickHouse/ClickHouse/pull/90664)（[Azat Khuzhin](https://github.com/azat)）。
* 修复分析器对 `LIMIT BY` 与 `GROUP BY` 的校验：`LIMIT BY` 使用未包含在 `GROUP BY` 中的列时，返回正确的 `NOT_AN_AGGREGATE`，而非 `NOT_FOUND_COLUMN_IN_BLOCK`。解决 [#89713](https://github.com/ClickHouse/ClickHouse/issues/89713)。[#90665](https://github.com/ClickHouse/ClickHouse/pull/90665)（[xiaohuanlin](https://github.com/xiaohuanlin)）。
* 修复在分区键中使用 `LowCardinality` 列时的类型转换错误。解决 [#89412](https://github.com/ClickHouse/ClickHouse/issues/89412)。[#90666](https://github.com/ClickHouse/ClickHouse/pull/90666)（[xiaohuanlin](https://github.com/xiaohuanlin)）。
* 修复过滤谓词包含由非确定性函数，例如 `shardNum()`，折叠而来的常量时，查询可能错误使用查询条件缓存的问题。[#90692](https://github.com/ClickHouse/ClickHouse/pull/90692)（[Eduard Karacharov](https://github.com/korowa)）。
* 修复 JOIN ON 部分含 EXISTS 函数的查询导致段错误的问题；现在直接返回 `INVALID_JOIN_ON_EXPRESSION`。解决 [#90698](https://github.com/ClickHouse/ClickHouse/issues/90698)。[#90719](https://github.com/ClickHouse/ClickHouse/pull/90719)（[Vladimir Cherkasov](https://github.com/vdimir)）。
* 修复使用默认数据库但未指定任何表时，AccessRightsElement 的“Inconsistent AST formatting”逻辑错误。[#90742](https://github.com/ClickHouse/ClickHouse/pull/90742)（[Pablo Marcos](https://github.com/pamarcos)）。
* 修复 `ALTER UPDATE` 使用以 `localhost` 为目标主机的 `remote` 表函数时的访问校验。[#90761](https://github.com/ClickHouse/ClickHouse/pull/90761)（[pufit](https://github.com/pufit)）。
* 命名集合的秘密信息隐藏现在遵循 `display_secrets_in_show_and_select` 和 `format_display_secrets_in_show_and_select`。[#90765](https://github.com/ClickHouse/ClickHouse/pull/90765)（[Pablo Marcos](https://github.com/pamarcos)）。
* 禁用会导致内存泄漏的 `enable_shared_storage_snapshot_in_query`。[#90770](https://github.com/ClickHouse/ClickHouse/pull/90770)（[Azat Khuzhin](https://github.com/azat)）。
* 修复启用并行副本时，对分布式表执行 RIGHT JOIN 出现重复数据的问题。[#90806](https://github.com/ClickHouse/ClickHouse/pull/90806)（[zoomxi](https://github.com/zoomxi)）。
* 修复 JSON 共享数据与动态路径状态可能不一致，导致逻辑错误和非预期结果的问题。[#90816](https://github.com/ClickHouse/ClickHouse/pull/90816)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复 SharedCatalog 中 ALTER MODIFY QUERY 与 dictGet() 及 CSE 中字典名的组合，仅涉及云端功能。[#90860](https://github.com/ClickHouse/ClickHouse/pull/90860)（[Azat Khuzhin](https://github.com/azat)）。
* 修复 String 聚合状态的内存序列化兼容性。在不同版本实例上执行聚合查询时，不同序列化方式可能导致重复结果。可通过 `serialize_string_in_memory_with_zero_byte` 启用新序列化。[#90880](https://github.com/ClickHouse/ClickHouse/pull/90880)（[Antonio Andelic](https://github.com/antonio2368)）。
* 修复频繁 INSERT 时 Buffer 的后台刷新。[#90892](https://github.com/ClickHouse/ClickHouse/pull/90892)（[Azat Khuzhin](https://github.com/azat)）。
* system.licenses 不再列出 contrib/ 父目录。[#90901](https://github.com/ClickHouse/ClickHouse/pull/90901)（[Raúl Marín](https://github.com/Algunenano)）。
* 修复读取 JSON/Dynamic/Variant 列时内存占用过高的问题。[#90907](https://github.com/ClickHouse/ClickHouse/pull/90907)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复 base58Decode 的缓冲区分配。[#90909](https://github.com/ClickHouse/ClickHouse/pull/90909)（[Antonio Andelic](https://github.com/antonio2368)）。
* 修复发送带 `finish=true` 标志的响应后，又收到副本读取请求时可能出现的逻辑错误。这源于 `MergeTreeReadPoolParallelReplicas` 中极少发生的逻辑竞争条件。[#90921](https://github.com/ClickHouse/ClickHouse/pull/90921)（[Nikita Taranov](https://github.com/nickitat)）。
* 修复部分撤销时对通配符授权的检查，并增加测试。[#90922](https://github.com/ClickHouse/ClickHouse/pull/90922)（[pufit](https://github.com/pufit)）。
* 修复 `SummingMergeTree` 对 `Nested` `LowCardinality` 列的聚合。[#90927](https://github.com/ClickHouse/ClickHouse/pull/90927)（[Ivan Babrou](https://github.com/bobrik)）。
* 修复带通配符撤销时对全局授权的处理，避免撤销通配符授权时意外撤销 `CREATE USER` 等全局权限。[#90928](https://github.com/ClickHouse/ClickHouse/pull/90928)（[pufit](https://github.com/pufit)）。
* 修复 Azure 列举 blob 时可能发生的无限循环。[#90947](https://github.com/ClickHouse/ClickHouse/pull/90947)（[Julia Kartseva](https://github.com/jkartseva)）。
* 修复 Buffer 过度刷新导致 CPU 消耗过高和大量日志的问题。[#91000](https://github.com/ClickHouse/ClickHouse/pull/91000)（[Azat Khuzhin](https://github.com/azat)）。
* ……禁止将 adaptive\_write\_buffer\_initial\_size 设为 0。[#91001](https://github.com/ClickHouse/ClickHouse/pull/91001)（[Pedro Ferreira](https://github.com/PedroTadim)）。
* 修复禁用 `write_marks_for_substreams_in_compact_parts` 时，在 Compact 数据片段中读取 JSON 子对象可能使同一路径同时存在于共享数据和动态路径中的错误。[#91014](https://github.com/ClickHouse/ClickHouse/pull/91014)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复 CTE 中 dictGet 无参数时的 std::out\_of\_range。解决 [#91027](https://github.com/ClickHouse/ClickHouse/issues/91027)。[#91022](https://github.com/ClickHouse/ClickHouse/pull/91022)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复变更操作从物化列中读取动态子列的问题。解决 [#90653](https://github.com/ClickHouse/ClickHouse/issues/90653)。[#91040](https://github.com/ClickHouse/ClickHouse/pull/91040)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复 `arrayFilter` 使用空数组和 `isNull` 时不工作的问题。解决 [#73849](https://github.com/ClickHouse/ClickHouse/issues/73849)。[#91105](https://github.com/ClickHouse/ClickHouse/pull/91105)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 修复表中一列为空元组列时，`ARRAY JOIN` 出现的逻辑错误。解决 [#90801](https://github.com/ClickHouse/ClickHouse/issues/90801)。[#91123](https://github.com/ClickHouse/ClickHouse/pull/91123)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 修复旧数据片段中通过 ALTER ADD COLUMN 添加的列的延迟物化。[#91142](https://github.com/ClickHouse/ClickHouse/pull/91142)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复 Summing/Aggregating/Coalescing MergeTree 中 JSON 列的合并。此前写入数据片段时可能产生非预期动态路径。[#91151](https://github.com/ClickHouse/ClickHouse/pull/91151)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复写入 Compact 数据片段时动态结构可能不一致、导致段错误的问题。[#91152](https://github.com/ClickHouse/ClickHouse/pull/91152)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复科学计数法中非规格化浮点数的解析。解决 [#78903](https://github.com/ClickHouse/ClickHouse/issues/78903)。[#91162](https://github.com/ClickHouse/ClickHouse/pull/91162)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 修复 INSERT SELECT 从使用隐式结构数据源的子查询中进行错误结构推断的问题。[#91204](https://github.com/ClickHouse/ClickHouse/pull/91204)（[Pervakov Grigorii](https://github.com/GrigoryPervakov)）。
* 修复 [https://github.com/clickhouse/clickhouse/issues/91206](https://github.com/clickhouse/clickhouse/issues/91206)：创建带统计信息的表、写入数据并删除其中一种统计信息后，再次读取会崩溃，因为此前假定序列化和反序列化时统计信息类型相同。此修复检查当前元数据是否包含已序列化的统计信息；若不包含，则创建模拟统计信息，仅用于反序列化并跳过相应数据。[#91227](https://github.com/ClickHouse/ClickHouse/pull/91227)（[Han Fei](https://github.com/hanfei1991)）。
* 修复向 CoalescingMergeTree 中包含 JSON/Dynamic 和 LowCardinality 的 Tuple 列插入数据的问题。解决 [#91215](https://github.com/ClickHouse/ClickHouse/issues/91215)。[#91270](https://github.com/ClickHouse/ClickHouse/pull/91270)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复 SYSTEM DROP FILESYSTEM CACHE ON CLUSTER。[#91304](https://github.com/ClickHouse/ClickHouse/pull/91304)（[Anton Ivashkin](https://github.com/ianton-ru)）。
* 修复可能出现的逻辑错误“Bad cast from type DB::ColumnSparse to DB::ColumnNullable”。解决 [#91284](https://github.com/ClickHouse/ClickHouse/issues/91284)。[#91309](https://github.com/ClickHouse/ClickHouse/pull/91309)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复恶意构造的字节流反序列化为嵌套 QBit 类型时的崩溃；这种类型原本不应出现，但可被利用使服务器崩溃。[#91313](https://github.com/ClickHouse/ClickHouse/pull/91313)（[Raufs Dunamalijevs](https://github.com/rienath)）。
* 修复 Replicated 数据库中参数为空的 Alias 表。解决 [#91378](https://github.com/ClickHouse/ClickHouse/issues/91378)。[#91382](https://github.com/ClickHouse/ClickHouse/pull/91382)（[Kai Zhu](https://github.com/nauu)）。
* 当前该设置为 false，因此异步插入队列刷新到远程服务器时，插入始终同步执行，即使用户将该设置设为 True 也一样。[#91386](https://github.com/ClickHouse/ClickHouse/pull/91386)（[Mikhail f. Shiryaev](https://github.com/Felixoid)）。
* 从合并算法的头信息中移除 Sparse 列。解决 [#91377](https://github.com/ClickHouse/ClickHouse/issues/91377)。[#91396](https://github.com/ClickHouse/ClickHouse/pull/91396)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复 25.8 中 Hive 分区可能错误抛出 `A hive partitioned file can't contain only partition columns` 的问题。[#91403](https://github.com/ClickHouse/ClickHouse/pull/91403)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复字典类型支持层次结构、但没有任何列为 `HIERARCHICAL` 时，`NULL` 导致 `dictGetDescendants` 崩溃的问题。解决 [#92026](https://github.com/ClickHouse/ClickHouse/issues/92026) 和 [#92121](https://github.com/ClickHouse/ClickHouse/issues/92121)。[#91420](https://github.com/ClickHouse/ClickHouse/pull/91420)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 修复 `IN` 函数使用 lambda 和非常量元组参数时的崩溃。解决 [#91379](https://github.com/ClickHouse/ClickHouse/issues/91379)。[#91446](https://github.com/ClickHouse/ClickHouse/pull/91446)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 修复物化视图插入对不支持并行写入的存储触发并行写入的问题。[#91449](https://github.com/ClickHouse/ClickHouse/pull/91449)（[Pervakov Grigorii](https://github.com/GrigoryPervakov)）。
* 处理 Ytsaurus XML 字典中的 null 值。[#91465](https://github.com/ClickHouse/ClickHouse/pull/91465)（[MikhailBurdukov](https://github.com/MikhailBurdukov)）。
* 修复 `QBit` 类型在 `SET param_q=[1,2,3,4]; SELECT {q:QBit(Float32,4)}` 等查询参数场景中失败的问题。[#91488](https://github.com/ClickHouse/ClickHouse/pull/91488)（[Raufs Dunamalijevs](https://github.com/rienath)）。
* 修复常量表达式中使用 untuple 时的 LOGICAL\_ERROR。[#91507](https://github.com/ClickHouse/ClickHouse/pull/91507)（[Pervakov Grigorii](https://github.com/GrigoryPervakov)）。
* 修复 `librdkafka` 中可能发生的数据竞争。[#91521](https://github.com/ClickHouse/ClickHouse/pull/91521)（[János Benjamin Antal](https://github.com/antaljanosbenjamin)）。
* 修复 `remote` 函数使用星号参数导致的逻辑错误。解决 [#90568](https://github.com/ClickHouse/ClickHouse/issues/90568)。[#91524](https://github.com/ClickHouse/ClickHouse/pull/91524)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 修复从 ORC 格式读取 Date 和 DateTime64 类型时的溢出。解决 [#70976](https://github.com/ClickHouse/ClickHouse/issues/70976)。[#91572](https://github.com/ClickHouse/ClickHouse/pull/91572)（[Yarik Briukhovetskyi](https://github.com/yariks5s)）。
* 禁止对对象存储表引擎执行 ALTER。例如，由于对象存储引擎不支持投影，ALTER ADD PROJECTION 可能导致服务器无法重启。[#91573](https://github.com/ClickHouse/ClickHouse/pull/91573)（[Nikolay Degterinsky](https://github.com/evillique)）。
* 修复 [`L2DistanceTransposed`](/docs/reference/functions/regular-functions/distance-functions#L2DistanceTransposed) 使用非常量参考向量，例如来自表的向量，时返回错误结果的问题。[#91517](https://github.com/ClickHouse/ClickHouse/issues/91517)。[#91593](https://github.com/ClickHouse/ClickHouse/pull/91593)（[Raufs Dunamalijevs](https://github.com/rienath)）。
* 修复 JOIN 条件为 FALSE 时在分派阶段返回 `LOGICAL_ERROR` 的问题。解决 [#91173](https://github.com/ClickHouse/ClickHouse/issues/91173)。[#91598](https://github.com/ClickHouse/ClickHouse/pull/91598)（[Yarik Briukhovetskyi](https://github.com/yariks5s)）。
* 修复带“额外过滤器”的连接内存占用增大的问题。解决 [#91011](https://github.com/ClickHouse/ClickHouse/issues/91011)。[#91664](https://github.com/ClickHouse/ClickHouse/pull/91664)（[Vladimir Cherkasov](https://github.com/vdimir)）。
* 修复使用视图并启用并行副本的 JOIN 查询。[#91813](https://github.com/ClickHouse/ClickHouse/pull/91813)（[Igor Nikonov](https://github.com/devcrafter)）。
* 修复 Delta Lake 设置 `delta_lake_snapshot_version`：使用表引擎而非表函数，且此前指定过快照版本后再设为 -1（禁用），可能返回错误结果。解决 [#87676](https://github.com/ClickHouse/ClickHouse/issues/87676)。[#91818](https://github.com/ClickHouse/ClickHouse/pull/91818)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复 RecursiveCTEChunkGenerator 中的 LOGICAL\_ERROR。[#91827](https://github.com/ClickHouse/ClickHouse/pull/91827)（[Pablo Marcos](https://github.com/pamarcos)）。
* 修复同时使用 FINAL 和 PREWHERE 的查询中数据块结构不匹配的问题。[#91847](https://github.com/ClickHouse/ClickHouse/pull/91847)（[Antonio Andelic](https://github.com/antonio2368)）。
* 修复 `join_use_nulls` 与多个连接及交叉连接结合使用时的逻辑错误。[#91853](https://github.com/ClickHouse/ClickHouse/pull/91853)（[Vladimir Cherkasov](https://github.com/vdimir)）。
* 为 JSON 新增修复机制，处理共享数据与动态路径中路径重复的问题；这可能由 [https://github.com/ClickHouse/ClickHouse/pull/90816](https://github.com/ClickHouse/ClickHouse/pull/90816) 已修复的错误引起。[#91886](https://github.com/ClickHouse/ClickHouse/pull/91886)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复 ORC 读取器读取采用 DICTIONARY\_V2 编码、且仅包含 NULL 的字符串列时的错误。[#91889](https://github.com/ClickHouse/ClickHouse/pull/91889)（[Peng Jian](https://github.com/fastio)）。
* 修复 Tuple 列中稀疏与可空子流的序列化不一致，避免数据片段损坏或读取崩溃。解决 [https://github.com/ClickHouse/ClickHouse/pull/91851](https://github.com/ClickHouse/ClickHouse/pull/91851)。@Algunenano，能否帮忙检查这是否修复了私有仓库中的压力测试？@CurtizJ，也请帮忙看一下，谢谢！[#91932](https://github.com/ClickHouse/ClickHouse/pull/91932)（[Amos Bird](https://github.com/amosbird)）。
* 修复在 plain-rewritable 磁盘上创建备份时的 `Directory '{}' does not exist (LOGICAL_ERROR)`。[#91935](https://github.com/ClickHouse/ClickHouse/pull/91935)（[Julia Kartseva](https://github.com/jkartseva)）。
* 避免使用命名集合连接 MongoDB 时崩溃。[#91959](https://github.com/ClickHouse/ClickHouse/pull/91959)（[Antonio Andelic](https://github.com/antonio2368)）。
* 修复对 Compact 数据片段执行部分 `ALTER` 查询后可能出现的“TOO\_MANY\_MARKS”错误。[#91980](https://github.com/ClickHouse/ClickHouse/pull/91980)（[alesapin](https://github.com/alesapin)）。
* 解决 [https://github.com/clickhouse/clickhouse/issues/87417](https://github.com/clickhouse/clickhouse/issues/87417)：v1 格式的写入结构有误，added\_snapshot\_id 为必需字段，因此其类型应为 long，而非 null, long。此前与 Spark 等其他系统不兼容，混合使用这些系统的清单文件时会触发错误。[#92078](https://github.com/ClickHouse/ClickHouse/pull/92078)（[Han Fei](https://github.com/hanfei1991)）。
* 修复 `readWKT`、`readWKB` 的错误名称，此前版本的命名风格不正确。[#92094](https://github.com/ClickHouse/ClickHouse/pull/92094)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 `midpoint` 中大量逻辑错误、溢出和功能错误。解决 [#91816](https://github.com/ClickHouse/ClickHouse/issues/91816)。[#92102](https://github.com/ClickHouse/ClickHouse/pull/92102)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 修复读取采用稀疏编码的部分子列，例如字符串大小，可能返回错误结果的问题。[#92156](https://github.com/ClickHouse/ClickHouse/pull/92156)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复 `system.view_refreshes` 因 `No macro 'replica' in config` 而失败的问题。[#92203](https://github.com/ClickHouse/ClickHouse/pull/92203)（[Michael Kolupaev](https://github.com/al13n321)）。
* 修复格式化中的 UDF 替换。[#92210](https://github.com/ClickHouse/ClickHouse/pull/92210)（[Raúl Marín](https://github.com/Algunenano)）。
* 在 `ddlworker::markreplicasactive` 中，如果未找到活动主机，但 `remote_servers` 包含一些 host\_ids，则输出警告日志而非抛出异常。[#92223](https://github.com/ClickHouse/ClickHouse/pull/92223)（[Tuan Pham Anh](https://github.com/tuanpach)）。
* 为 `IN`、`NOT IN` 运算符加上括号。修复 [#85075](https://github.com/ClickHouse/ClickHouse/issues/85075)。[#92225](https://github.com/ClickHouse/ClickHouse/pull/92225)（[Mikhail f. Shiryaev](https://github.com/Felixoid)）。
* 修复 KeeperMap 和 Memory 表的备份：`max_compress_block_size` 为 `0` 时备份这两种引擎之一的表，可能导致崩溃。[#92237](https://github.com/ClickHouse/ClickHouse/pull/92237)（[Antonio Andelic](https://github.com/antonio2368)）。
* 修复从 Log 引擎同时读取 String 数据和 .size 子列时的崩溃。修复 [#89909](https://github.com/ClickHouse/ClickHouse/issues/89909)，包含 [#92290](https://github.com/ClickHouse/ClickHouse/issues/92290) 的部分提交。[#92341](https://github.com/ClickHouse/ClickHouse/pull/92341)（[Amos Bird](https://github.com/amosbird)）。
* 修复 `caseWithExpression` 参数使用 `Nothing` 类型时的逻辑错误。解决 [#85354](https://github.com/ClickHouse/ClickHouse/issues/85354)。[#92351](https://github.com/ClickHouse/ClickHouse/pull/92351)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 修复 MEMORY\_LIMIT\_EXCEEDED 之后聚合函数可能发生的崩溃。[#92390](https://github.com/ClickHouse/ClickHouse/pull/92390)（[Azat Khuzhin](https://github.com/azat)）。

#### 构建/测试/打包改进

* 在 CI 中使用 `clang-21`。[#87074](https://github.com/ClickHouse/ClickHouse/pull/87074)（[Konstantin Bogdanov](https://github.com/thevar1able)）。
* 交叉编译时避免通过 CMake 下载内容。[#90506](https://github.com/ClickHouse/ClickHouse/pull/90506)（[Raúl Marín](https://github.com/Algunenano)）。
