<h3 id="255">
  ClickHouse 25.5 版本, 2025-05-22
</h3>

#### 向后不兼容变更

* 函数 `geoToH3` 现在按 (lat, lon, res) 顺序接受输入（与其他几何函数的常见约定一致）。希望保留原先 (lon, lat, res) 顺序的用户，可设置 `geotoh3_argument_order = 'lon_lat'`。 [#78852](https://github.com/ClickHouse/ClickHouse/pull/78852) ([Pratima Patel](https://github.com/pratimapatel2008)).
* 新增文件系统缓存设置 `allow_dynamic_cache_resize`，默认值为 `false`，用于允许动态调整文件系统缓存大小。原因是：在某些环境（ClickHouse Cloud）中，所有扩缩容都通过重启进程完成；我们希望明确禁用此功能，以更好地控制行为，同时作为安全措施。此 PR 标记为向后不兼容，因为旧版本无需特殊设置便默认支持动态调整缓存大小。 [#79148](https://github.com/ClickHouse/ClickHouse/pull/79148) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 移除对旧索引类型 `annoy` 和 `usearch` 的支持。它们长期以来都只是占位实现，任何使用这些旧索引的尝试本来就会报错。如果仍有 `annoy` 和 `usearch` 索引，请删除它们。 [#79802](https://github.com/ClickHouse/ClickHouse/pull/79802) ([Robert Schulze](https://github.com/rschu1ze)).
* 移除服务器设置 `format_alter_commands_with_parentheses`。该设置在 24.2 中引入并默认禁用，在 25.2 中改为默认启用。由于已不存在不支持新格式的 LTS 版本，可以移除该设置。 [#79970](https://github.com/ClickHouse/ClickHouse/pull/79970) ([János Benjamin Antal](https://github.com/antaljanosbenjamin)).
* 默认启用 `DeltaLake` 存储的 `delta-kernel-rs` 实现。 [#79541](https://github.com/ClickHouse/ClickHouse/pull/79541) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 如果从 `URL` 读取数据涉及多次重定向，设置 `enable_url_encoding` 现在会正确应用于整条重定向链。设置 `enble_url_encoding` 的默认值现在为 `false`。  [#79563](https://github.com/ClickHouse/ClickHouse/pull/79563) ([Shankar Iyer](https://github.com/shankar-iyer)). [#80088](https://github.com/ClickHouse/ClickHouse/pull/80088) ([Shankar Iyer](https://github.com/shankar-iyer))。

#### 新功能

* 支持 WHERE 子句中的标量相关子查询。解决了 [#6697](https://github.com/ClickHouse/ClickHouse/issues/6697)。支持简单情况下 SELECT 输出列表中的相关子查询。  [#79600](https://github.com/ClickHouse/ClickHouse/pull/79600) ([Dmitry Novik](https://github.com/novikd)). [#79925](https://github.com/ClickHouse/ClickHouse/pull/79925) ([Dmitry Novik](https://github.com/novikd))。 [#76078](https://github.com/ClickHouse/ClickHouse/pull/76078) ([Dmitry Novik](https://github.com/novikd))。现在覆盖了 TPC-H 测试套件的 100%。
* 使用向量相似度索引的向量搜索从实验性阶段进入 Beta 阶段。 [#80164](https://github.com/ClickHouse/ClickHouse/pull/80164) ([Robert Schulze](https://github.com/rschu1ze)).
* `Parquet` 格式支持地理类型。解决了 [#75317](https://github.com/ClickHouse/ClickHouse/issues/75317)。 [#79777](https://github.com/ClickHouse/ClickHouse/pull/79777) ([scanhex12](https://github.com/scanhex12)).
* 新增函数 `sparseGrams`、`sparseGramsHashes`、`sparseGramsHashesUTF8` 和 `sparseGramsUTF8`，用于计算“稀疏 n-gram”；这是一种为索引和搜索提取子串的稳健算法。 [#79517](https://github.com/ClickHouse/ClickHouse/pull/79517) ([scanhex12](https://github.com/scanhex12)).
* `clickhouse-local`（及其简写别名 `ch`）现在在有输入数据需要处理时，隐式使用 `FROM table`。解决了 [#65023](https://github.com/ClickHouse/ClickHouse/issues/65023)。此外，当未指定 `--input-format` 且处理普通文件时，clickhouse-local 会启用格式推断。 [#79085](https://github.com/ClickHouse/ClickHouse/pull/79085) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 新增 `stringBytesUniq` 和 `stringBytesEntropy` 函数，用于查找可能是随机或加密的数据。 [#79350](https://github.com/ClickHouse/ClickHouse/pull/79350) ([Sachin Kumar Singh](https://github.com/sachinkumarsingh092)).
* 新增 Base32 编码和解码函数。 [#79809](https://github.com/ClickHouse/ClickHouse/pull/79809) ([Joanna Hulboj](https://github.com/jh0x)).
* 新增 `getServerSetting` 和 `getMergeTreeSetting` 函数。解决了 #78318。 [#78439](https://github.com/ClickHouse/ClickHouse/pull/78439) ([NamNguyenHoai](https://github.com/NamHoaiNguyen)).
* 新增 `iceberg_enable_version_hint` 设置，以利用 `version-hint.text` 文件。 [#78594](https://github.com/ClickHouse/ClickHouse/pull/78594) ([Arnaud Briche](https://github.com/arnaudbriche)).
* 允许使用 `LIKE` 关键字筛选数据库中的指定表并清空。 [#78597](https://github.com/ClickHouse/ClickHouse/pull/78597) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* `MergeTree` 系列表支持 `_part_starting_offset` 虚拟列。该列表示所有此前数据片段的累计行数，在查询时根据当前数据片段列表计算。累计值在整个查询执行期间保留，即使经过数据片段裁剪后也仍然有效。相关内部逻辑已重构，以支持此行为。 [#79417](https://github.com/ClickHouse/ClickHouse/pull/79417) ([Amos Bird](https://github.com/amosbird)).
* 新增函数 `divideOrNull`、`moduloOrNull`、`intDivOrNull` 和 `positiveModuloOrNull`，当右侧参数为零时返回 NULL。 [#78276](https://github.com/ClickHouse/ClickHouse/pull/78276) ([kevinyhzou](https://github.com/KevinyhZou)).
* ClickHouse 向量搜索现在同时支持预筛选和后筛选，并提供相关设置以进行更精细的控制。（问题 [#78161](https://github.com/ClickHouse/ClickHouse/issues/78161)）。 [#79854](https://github.com/ClickHouse/ClickHouse/pull/79854) ([Shankar Iyer](https://github.com/shankar-iyer)).
* 新增 [`icebergHash`](https://iceberg.apache.org/spec/#appendix-b-32-bit-hash-requirements) 和 [`icebergBucket`](https://iceberg.apache.org/spec/#bucket-transform-details) 函数。支持对使用[`bucket transfom`](https://iceberg.apache.org/spec/#partitioning)（分桶转换）进行分区的 `Iceberg` 表裁剪数据文件。 [#79262](https://github.com/ClickHouse/ClickHouse/pull/79262) ([Daniil Ivanik](https://github.com/divanik)).

#### 实验性功能

* 新增 `Time`/`Time64` 数据类型：`Time`（HHH:MM:SS）和 `Time64`（HHH:MM:SS.`<fractional>`），以及一些基本的类型转换函数和与其他数据类型交互的函数。同时，将现有函数 toTime 重命名为 toTimeWithFixedDate，因为类型转换函数需要使用 toTime 名称。
  72459\)。 [#75735](https://github.com/ClickHouse/ClickHouse/pull/75735) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 为 Iceberg 数据湖提供 Hive Metastore 目录。 [#77677](https://github.com/ClickHouse/ClickHouse/pull/77677) ([scanhex12](https://github.com/scanhex12)).
* 将 `full_text` 类型索引重命名为 `gin`，遵循 PostgreSQL 和其他数据库中更为熟悉的术语。已有 `full_text` 类型索引仍可加载，但尝试将其用于搜索时会抛出异常，并建议改用 `gin` 索引。 [#79024](https://github.com/ClickHouse/ClickHouse/pull/79024) ([Robert Schulze](https://github.com/rschu1ze)).

#### 性能改进

* 修改 Compact 数据片段格式，为每个子流保存标记，以支持读取单个子列。仍支持读取旧 Compact 格式，并可通过 MergeTree 设置 `write_marks_for_substreams_in_compact_parts` 控制写入格式。由于会改变 Compact 数据片段的存储方式，为确保升级更安全，该设置默认禁用；将在后续某个版本中默认启用。 [#77940](https://github.com/ClickHouse/ClickHouse/pull/77940) ([Pavel Kruglov](https://github.com/Avogar)).
* 允许将包含子列的条件移至 PREWHERE。 [#79489](https://github.com/ClickHouse/ClickHouse/pull/79489) ([Pavel Kruglov](https://github.com/Avogar)).
* 一次对多个数据粒度计算二级索引表达式，以加快二级索引处理。 [#64109](https://github.com/ClickHouse/ClickHouse/pull/64109) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 默认启用 `compile_expressions`（为普通表达式片段提供 JIT 编译）。解决了 [#51264](https://github.com/ClickHouse/ClickHouse/issues/51264)、[#56386](https://github.com/ClickHouse/ClickHouse/issues/56386) 和 [#66486](https://github.com/ClickHouse/ClickHouse/issues/66486)。 [#79907](https://github.com/ClickHouse/ClickHouse/pull/79907) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 新增设置 `use_skip_indexes_in_final_exact_mode`。如果对 `ReplacingMergeTree` 表的查询包含 FINAL 子句，仅根据跳过索引读取表范围可能产生错误结果。该设置通过扫描与跳过索引返回的主键范围重叠的较新数据片段，确保返回正确结果。设为 0 禁用，设为 1 启用。 [#78350](https://github.com/ClickHouse/ClickHouse/pull/78350) ([Shankar Iyer](https://github.com/shankar-iyer)).
* 对象存储集群表函数（如 `s3Cluster`）现在根据一致性哈希将文件分配给副本读取，以提高缓存局部性。 [#77326](https://github.com/ClickHouse/ClickHouse/pull/77326) ([Andrej Hoos](https://github.com/adikus)).
* 允许并行 INSERT 数据，提升 `S3Queue`/`AzureQueue` 的性能（可通过队列设置 `parallel_inserts=true` 启用）。此前 S3Queue/AzureQueue 仅能并行执行流水线的前半部分（下载、解析），INSERT 为单线程，而 `INSERT` 几乎总是瓶颈。现在性能几乎可随 `processing_threads_num` 线性扩展。使 S3Queue/AzureQueue 中的 max\_processed\_files\_before\_commit 更公平。  [#77671](https://github.com/ClickHouse/ClickHouse/pull/77671) ([Azat Khuzhin](https://github.com/azat)). [#79363](https://github.com/ClickHouse/ClickHouse/pull/79363) ([Azat Khuzhin](https://github.com/azat))。
* 引入阈值（由设置 `parallel_hash_join_threshold` 控制），当右表大小低于该阈值时，回退到 `hash` 算法。 [#76185](https://github.com/ClickHouse/ClickHouse/pull/76185) ([Nikita Taranov](https://github.com/nickitat)).
* 现在启用并行副本读取时，会根据副本数确定任务大小。当待读取数据量不大时，这能更好地在副本间分配工作。 [#78695](https://github.com/ClickHouse/ClickHouse/pull/78695) ([Nikita Taranov](https://github.com/nickitat)).
* 允许在分布式聚合的最终阶段并行合并 `uniqExact` 状态。 [#78703](https://github.com/ClickHouse/ClickHouse/pull/78703) ([Nikita Taranov](https://github.com/nickitat)).
* 修复带键聚合中并行合并 `uniqExact` 状态可能出现的性能退化。 [#78724](https://github.com/ClickHouse/ClickHouse/pull/78724) ([Nikita Taranov](https://github.com/nickitat)).
* 减少向 Azure 存储调用 List Blobs API 的次数。 [#78860](https://github.com/ClickHouse/ClickHouse/pull/78860) ([Julia Kartseva](https://github.com/jkartseva)).
* 修复启用并行副本时分布式 INSERT SELECT 的性能。 [#79441](https://github.com/ClickHouse/ClickHouse/pull/79441) ([Azat Khuzhin](https://github.com/azat)).
* 避免 `LogSeriesLimiter` 每次构造时都执行清理，以防止高并发场景中的锁竞争和性能退化。 [#79864](https://github.com/ClickHouse/ClickHouse/pull/79864) ([filimonov](https://github.com/filimonov)).
* 加快采用简单计数优化的查询。 [#79945](https://github.com/ClickHouse/ClickHouse/pull/79945) ([Raúl Marín](https://github.com/Algunenano)).
* 改进部分 `Decimal` 运算的内联。 [#79999](https://github.com/ClickHouse/ClickHouse/pull/79999) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 将 `input_format_parquet_bloom_filter_push_down` 默认设为 true，同时修复设置变更历史中的错误。 [#80058](https://github.com/ClickHouse/ClickHouse/pull/80058) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 优化 `ALTER ... DELETE` 变更操作中需要删除全部行的数据片段。现在会直接创建空数据片段替代原片段，而不执行变更操作。 [#79307](https://github.com/ClickHouse/ClickHouse/pull/79307) ([Anton Popov](https://github.com/CurtizJ)).
* 尽可能避免向 Compact 数据片段插入时对数据块进行额外复制。 [#79536](https://github.com/ClickHouse/ClickHouse/pull/79536) ([Pavel Kruglov](https://github.com/Avogar)).
* 新增设置 `input_format_max_block_size_bytes`，以字节为单位限制输入格式创建的数据块大小。当行包含较大值时，有助于避免数据导入期间内存使用过高。 [#79495](https://github.com/ClickHouse/ClickHouse/pull/79495) ([Pavel Kruglov](https://github.com/Avogar)).
* 移除线程以及 async\_socket\_for\_remote/use\_hedge\_requests 的保护页。将 `FiberStack` 的分配方法从 `mmap` 改为 `aligned_alloc`，因为前者会拆分虚拟内存区域，在高负载下可能达到 vm.max\_map\_count 上限。 [#79147](https://github.com/ClickHouse/ClickHouse/pull/79147) ([Sema Checherinda](https://github.com/CheSema)).
* 并行副本支持延迟物化。 [#79401](https://github.com/ClickHouse/ClickHouse/pull/79401) ([Igor Nikonov](https://github.com/devcrafter)).

#### 改进

* 新增即时应用轻量级删除的能力（通过设置 `lightweight_deletes_sync = 0`、`apply_mutations_on_fly = 1`。 [#79281](https://github.com/ClickHouse/ClickHouse/pull/79281) ([Anton Popov](https://github.com/CurtizJ)).
* 在终端中显示 Pretty 格式数据时，如果后续数据块的列宽与前一数据块相同，可以通过向上移动光标，将其接续并拼合到前一个数据块。解决了 [#79333](https://github.com/ClickHouse/ClickHouse/issues/79333)。此功能由新设置 `output_format_pretty_glue_chunks` 控制。 [#79339](https://github.com/ClickHouse/ClickHouse/pull/79339) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 将 `isIPAddressInRange` 函数扩展到 `String`、`IPv4`、`IPv6`、`Nullable(String)`、`Nullable(IPv4)` 和 `Nullable(IPv6)` 数据类型。 [#78364](https://github.com/ClickHouse/ClickHouse/pull/78364) ([YjyJeff](https://github.com/YjyJeff)).
* 允许动态修改 `PostgreSQL` 引擎的连接池设置。 [#78414](https://github.com/ClickHouse/ClickHouse/pull/78414) ([Samay Sharma](https://github.com/samay-sharma)).
* 允许在普通投影中指定 `_part_offset`。这是构建投影索引的第一步，可以与 [#58224](https://github.com/ClickHouse/ClickHouse/issues/58224) 配合使用，并有助于改进 #63207。 [#78429](https://github.com/ClickHouse/ClickHouse/pull/78429) ([Amos Bird](https://github.com/amosbird)).
* 为 `system.named_collections` 添加新列 `create_query` 和 `source`。解决了 [#78179](https://github.com/ClickHouse/ClickHouse/issues/78179)。 [#78582](https://github.com/ClickHouse/ClickHouse/pull/78582) ([MikhailBurdukov](https://github.com/MikhailBurdukov)).
* 为系统表 `system.query_condition_cache` 添加新字段 `condition`，存储其哈希被用作查询条件缓存键的明文条件。 [#78671](https://github.com/ClickHouse/ClickHouse/pull/78671) ([Robert Schulze](https://github.com/rschu1ze)).
* 现在可以在 `BFloat16` 列上创建向量相似度索引。 [#78850](https://github.com/ClickHouse/ClickHouse/pull/78850) ([Robert Schulze](https://github.com/rschu1ze)).
* 尽力解析 `DateTime64` 时支持带小数部分的 Unix 时间戳。 [#78908](https://github.com/ClickHouse/ClickHouse/pull/78908) ([Pavel Kruglov](https://github.com/Avogar)).
* 在 `DeltaLake` 存储的 delta-kernel 实现中，修复列映射模式并添加结构演进测试。 [#78921](https://github.com/ClickHouse/ClickHouse/pull/78921) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 通过改进值转换，改善以 Values 格式向 `Variant` 列插入数据的行为。 [#78923](https://github.com/ClickHouse/ClickHouse/pull/78923) ([Pavel Kruglov](https://github.com/Avogar)).
* 扩展 `tokens` 函数，允许额外接受“tokenizer”参数及更多分词器专用参数。 [#79001](https://github.com/ClickHouse/ClickHouse/pull/79001) ([Elmi Ahmadov](https://github.com/ahmadov)).
* `SHOW CLUSTER` 语句现在会展开参数中的宏（如果存在）。 [#79006](https://github.com/ClickHouse/ClickHouse/pull/79006) ([arf42](https://github.com/arf42)).
* 哈希函数现在支持数组、元组和 Map 内的 `NULL`。（问题 [#48365](https://github.com/ClickHouse/ClickHouse/issues/48365) 和 [#48623](https://github.com/ClickHouse/ClickHouse/issues/48623)）。 [#79008](https://github.com/ClickHouse/ClickHouse/pull/79008) ([Michael Kolupaev](https://github.com/al13n321)).
* 将 cctz 更新至 2025a。 [#79043](https://github.com/ClickHouse/ClickHouse/pull/79043) ([Raúl Marín](https://github.com/Algunenano)).
* 将 UDF 的默认标准错误处理方式改为“log\_last”，改善易用性。 [#79066](https://github.com/ClickHouse/ClickHouse/pull/79066) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Web UI 中关闭的标签页可以撤销恢复。解决了 [#71284](https://github.com/ClickHouse/ClickHouse/issues/71284)。 [#79084](https://github.com/ClickHouse/ClickHouse/pull/79084) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 在 `recoverLostReplica` 期间移除设置，与 [https://github.com/ClickHouse/ClickHouse/pull/78637](https://github.com/ClickHouse/ClickHouse/pull/78637) 中的处理相同。 [#79113](https://github.com/ClickHouse/ClickHouse/pull/79113) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* 新增性能分析事件 `ParquetReadRowGroups` 和 `ParquetPrunedRowGroups`，用于分析 Parquet 索引裁剪。 [#79180](https://github.com/ClickHouse/ClickHouse/pull/79180) ([flynn](https://github.com/ucasfl)).
* 支持在集群上对数据库执行 `ALTER`。 [#79242](https://github.com/ClickHouse/ClickHouse/pull/79242) ([Tuan Pham Anh](https://github.com/tuanpach)).
* 明确跳过 QueryMetricLog 错过的统计收集周期，否则日志需要很长时间才能追赶到当前时间。 [#79257](https://github.com/ClickHouse/ClickHouse/pull/79257) ([Mikhail Artemenko](https://github.com/Michicosun)).
* 对基于 `Arrow` 的格式读取进行一些小幅优化。 [#79308](https://github.com/ClickHouse/ClickHouse/pull/79308) ([Bharat Nallan](https://github.com/bharatnc)).
* 设置 `allow_archive_path_syntax` 曾被错误地标记为实验性。添加测试，防止默认启用实验性设置。 [#79320](https://github.com/ClickHouse/ClickHouse/pull/79320) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 允许在每个查询级别调整页缓存设置，以便更快地试验，并为高吞吐量和低延迟查询进行微调。 [#79337](https://github.com/ClickHouse/ClickHouse/pull/79337) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Pretty 格式不再为看起来像大多数 64 位哈希值的数字打印数值提示。解决了 [#79334](https://github.com/ClickHouse/ClickHouse/issues/79334)。 [#79338](https://github.com/ClickHouse/ClickHouse/pull/79338) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 高级仪表板中的图表颜色将根据对应查询的哈希计算，便于滚动仪表板时记住并定位图表。 [#79341](https://github.com/ClickHouse/ClickHouse/pull/79341) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 新增异步指标 `FilesystemCacheCapacity`，表示 `cache` 虚拟文件系统的总容量，有助于全局基础设施监控。 [#79348](https://github.com/ClickHouse/ClickHouse/pull/79348) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 优化对 system.parts 的访问（仅在需要时读取列和索引大小）。 [#79352](https://github.com/ClickHouse/ClickHouse/pull/79352) ([Azat Khuzhin](https://github.com/azat)).
* 为查询 `'SHOW CLUSTER <name>'` 仅计算相关字段，而不是所有字段。 [#79368](https://github.com/ClickHouse/ClickHouse/pull/79368) ([Tuan Pham Anh](https://github.com/tuanpach)).
* 允许为 `DatabaseCatalog` 指定存储设置。 [#79407](https://github.com/ClickHouse/ClickHouse/pull/79407) ([Kseniia Sumarokova](https://github.com/kssenii)).
* `DeltaLake` 支持本地存储。 [#79416](https://github.com/ClickHouse/ClickHouse/pull/79416) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 新增查询级设置 `allow_experimental_delta_kernel_rs`，用于启用 delta-kernel-rs。 [#79418](https://github.com/ClickHouse/ClickHouse/pull/79418) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复列举 Azure/S3 Blob 存储对象时可能出现的无限循环。 [#79425](https://github.com/ClickHouse/ClickHouse/pull/79425) ([Alexander Gololobov](https://github.com/davenger)).
* 新增文件系统缓存设置 `max_size_ratio_to_total_space`。 [#79460](https://github.com/ClickHouse/ClickHouse/pull/79460) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 调整 `clickhouse-benchmark` 的 `reconnect` 选项，使其接受 0、1 或 N，并据此控制重新连接。 [#79465](https://github.com/ClickHouse/ClickHouse/pull/79465) ([Sachin Kumar Singh](https://github.com/sachinkumarsingh092)).
* 允许对位于不同 `plain_rewritable` 磁盘上的表执行 `ALTER TABLE ... MOVE|REPLACE PARTITION`。 [#79566](https://github.com/ClickHouse/ClickHouse/pull/79566) ([Julia Kartseva](https://github.com/jkartseva)).
* 当参考向量类型为 `Array(BFloat16)` 时，现在也会使用向量相似度索引。 [#79745](https://github.com/ClickHouse/ClickHouse/pull/79745) ([Shankar Iyer](https://github.com/shankar-iyer)).
* 为 system.error\_log 表添加 last\_error\_message、last\_error\_trace 和 query\_id。相关问题 [#75816](https://github.com/ClickHouse/ClickHouse/issues/75816)。 [#79836](https://github.com/ClickHouse/ClickHouse/pull/79836) ([Andrei Tinikov](https://github.com/Dolso)).
* 默认启用崩溃报告发送，可在服务器配置文件中关闭。 [#79838](https://github.com/ClickHouse/ClickHouse/pull/79838) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 系统表 `system.functions` 现在显示函数首次引入时的 ClickHouse 版本。 [#79839](https://github.com/ClickHouse/ClickHouse/pull/79839) ([Robert Schulze](https://github.com/rschu1ze)).
* 新增 `access_control_improvements.enable_user_name_access_type` 设置，允许启用或禁用 [https://github.com/ClickHouse/ClickHouse/pull/72246](https://github.com/ClickHouse/ClickHouse/pull/72246) 中引入的用户与角色精细授权。如果集群中存在早于 25.1 的副本，可能需要关闭该设置。 [#79842](https://github.com/ClickHouse/ClickHouse/pull/79842) ([pufit](https://github.com/pufit)).
* 正确实现 `ASTSelectWithUnionQuery::clone()` 方法，现在也会考虑 `is_normalized` 字段。这可能有助于解决 [#77569](https://github.com/ClickHouse/ClickHouse/issues/77569)。 [#79909](https://github.com/ClickHouse/ClickHouse/pull/79909) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* 修复某些带 EXCEPT 运算符的查询格式化不一致的问题。如果 EXCEPT 左侧以 `*` 结尾，格式化后的查询会丢失括号，随后被解析为带 `EXCEPT` 修饰符的 `*`。这些查询由模糊测试器发现，实际使用中不太可能遇到。解决了 [#79950](https://github.com/ClickHouse/ClickHouse/issues/79950)。 [#79952](https://github.com/ClickHouse/ClickHouse/pull/79952) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 通过缓存各变体的反序列化顺序，小幅改进 `JSON` 类型解析。 [#79984](https://github.com/ClickHouse/ClickHouse/pull/79984) ([Pavel Kruglov](https://github.com/Avogar)).
* 新增设置 `s3_slow_all_threads_after_network_error`。 [#80035](https://github.com/ClickHouse/ClickHouse/pull/80035) ([Vitaly Baranov](https://github.com/vitlibar)).
* 修正被选中用于合并的数据片段的日志级别；此前错误地使用 Information。解决了 [#80061](https://github.com/ClickHouse/ClickHouse/issues/80061)。 [#80062](https://github.com/ClickHouse/ClickHouse/pull/80062) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* trace-visualizer：在工具提示和状态消息中添加运行时间及占比。 [#79040](https://github.com/ClickHouse/ClickHouse/pull/79040) ([Sergei Trifonov](https://github.com/serxa)).
* trace-visualizer：从 ClickHouse 服务器加载数据。 [#79042](https://github.com/ClickHouse/ClickHouse/pull/79042) ([Sergei Trifonov](https://github.com/serxa)).
* 添加合并失败的指标。 [#79228](https://github.com/ClickHouse/ClickHouse/pull/79228) ([Miсhael Stetsyuk](https://github.com/mstetsyuk)).
* `clickhouse-benchmark` 在指定最大迭代次数时，会据此显示进度百分比。 [#79346](https://github.com/ClickHouse/ClickHouse/pull/79346) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 添加 system.parts 表的可视化工具。 [#79437](https://github.com/ClickHouse/ClickHouse/pull/79437) ([Sergei Trifonov](https://github.com/serxa)).
* 添加查询延迟分析工具。 [#79978](https://github.com/ClickHouse/ClickHouse/pull/79978) ([Sergei Trifonov](https://github.com/serxa)).

#### 缺陷修复（正式稳定版本中用户可见的异常行为）

* 修复重命名数据片段中不存在的列的问题。 [#76346](https://github.com/ClickHouse/ClickHouse/pull/76346) ([Anton Popov](https://github.com/CurtizJ)).
* 修复物化视图可能启动过晚的问题，例如晚于向其持续写入数据的 Kafka 表。 [#72123](https://github.com/ClickHouse/ClickHouse/pull/72123) ([Ilya Golshtein](https://github.com/ilejn)).
* 修复启用 Analyzer 时创建 `VIEW` 过程中对 `SELECT` 查询的改写。解决了 [#75956](https://github.com/ClickHouse/ClickHouse/issues/75956)。 [#76356](https://github.com/ClickHouse/ClickHouse/pull/76356) ([Dmitry Novik](https://github.com/novikd)).
* 修复通过 `apply_settings_from_server` 从服务器应用 `async_insert` 的行为（此前会导致客户端出现 `Unknown packet 11 from server` 错误）。 [#77578](https://github.com/ClickHouse/ClickHouse/pull/77578) ([Azat Khuzhin](https://github.com/azat)).
* 修复 Replicated 数据库中的可刷新物化视图无法在新加入副本上工作的问题。 [#77774](https://github.com/ClickHouse/ClickHouse/pull/77774) ([Michael Kolupaev](https://github.com/al13n321)).
* 修复可刷新物化视图破坏备份的问题。 [#77893](https://github.com/ClickHouse/ClickHouse/pull/77893) ([Michael Kolupaev](https://github.com/al13n321)).
* 修复 `transform` 中长期存在的逻辑错误。 [#78247](https://github.com/ClickHouse/ClickHouse/pull/78247) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 修复启用 Analyzer 时某些情况下未应用二级索引的问题。修复了 [#65607](https://github.com/ClickHouse/ClickHouse/issues/65607) 和 [#69373](https://github.com/ClickHouse/ClickHouse/issues/69373)。 [#78485](https://github.com/ClickHouse/ClickHouse/pull/78485) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复启用压缩时 HTTP 协议性能分析事件 `NetworkSendElapsedMicroseconds`/`NetworkSendBytes` 的记录（此前误差应不超过缓冲区大小，通常约为 1MiB）。 [#78516](https://github.com/ClickHouse/ClickHouse/pull/78516) ([Azat Khuzhin](https://github.com/azat)).
* 修复 Analyzer 在 JOIN ... USING 涉及 ALIAS 列时产生 LOGICAL\_ERROR 的问题，应报告恰当的错误。 [#78618](https://github.com/ClickHouse/ClickHouse/pull/78618) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* 修复 Analyzer：当 SELECT 包含位置参数时，CREATE VIEW ... ON CLUSTER 会失败。 [#78663](https://github.com/ClickHouse/ClickHouse/pull/78663) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* 修复通过 `INSERT SELECT` 向启用结构推断的表函数插入时，如果 `SELECT` 包含标量子查询，会出现 `Block structure mismatch` 错误的问题。 [#78677](https://github.com/ClickHouse/ClickHouse/pull/78677) ([Pervakov Grigorii](https://github.com/GrigoryPervakov)).
* 修复 Analyzer：当 prefer\_global\_in\_and\_join=1 且 SELECT 查询读取 Distributed 表时，应将 `in` 函数替换为 `globalIn`。 [#78749](https://github.com/ClickHouse/ClickHouse/pull/78749) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* 修复从 `MongoDB` 引擎表或 `mongodb` 表函数读取的几类 `SELECT` 查询：在 `WHERE` 子句中隐式转换常量值的查询（例如 `WHERE datetime = '2025-03-10 00:00:00'`），以及包含 `LIMIT` 和 `GROUP BY` 的查询。此前可能返回错误结果。 [#78777](https://github.com/ClickHouse/ClickHouse/pull/78777) ([Anton Popov](https://github.com/CurtizJ)).
* 修复不同 JSON 类型之间的转换。现在通过转换为 String 再转换回目标类型的简单类型转换实现；效率较低，但能保证完全准确。 [#78807](https://github.com/ClickHouse/ClickHouse/pull/78807) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复将 Dynamic 类型转换为 Interval 时的逻辑错误。 [#78813](https://github.com/ClickHouse/ClickHouse/pull/78813) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复 JSON 解析出错时列的回滚。 [#78836](https://github.com/ClickHouse/ClickHouse/pull/78836) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复使用常量别名列进行 JOIN 时的“bad cast”（无效类型转换）错误。 [#78848](https://github.com/ClickHouse/ClickHouse/pull/78848) ([Vladimir Cherkasov](https://github.com/vdimir)).
* 当物化视图中的列与目标表对应列的类型不同，不允许对这些列使用 PREWHERE。 [#78889](https://github.com/ClickHouse/ClickHouse/pull/78889) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复解析 Variant 列中的无效二进制数据时的逻辑错误。 [#78982](https://github.com/ClickHouse/ClickHouse/pull/78982) ([Pavel Kruglov](https://github.com/Avogar)).
* 当 Parquet 批次大小设为 0 时抛出异常。此前 output\_format\_parquet\_batch\_size = 0 会使 ClickHouse 挂起，现在已修复。 [#78991](https://github.com/ClickHouse/ClickHouse/pull/78991) ([daryawessely](https://github.com/daryawessely)).
* 修复 Compact 数据片段中基本格式的 Variant 判别值反序列化。该问题由 [https://github.com/ClickHouse/ClickHouse/pull/55518](https://github.com/ClickHouse/ClickHouse/pull/55518) 引入。 [#79000](https://github.com/ClickHouse/ClickHouse/pull/79000) ([Pavel Kruglov](https://github.com/Avogar)).
* `complex_key_ssd_cache` 类型字典现在拒绝值为零或负数的 `block_size` 和 `write_buffer_size` 参数（问题 [#78314](https://github.com/ClickHouse/ClickHouse/issues/78314)）。 [#79028](https://github.com/ClickHouse/ClickHouse/pull/79028) ([Elmi Ahmadov](https://github.com/ahmadov)).
* 避免为 SummingMergeTree 中的非聚合列使用 Field；在 SummingMergeTree 中使用 Dynamic/Variant 类型时，这可能导致意外错误。 [#79051](https://github.com/ClickHouse/ClickHouse/pull/79051) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复 Analyzer 从目标表为 Distributed 且数据块头不同的物化视图读取的问题。 [#79059](https://github.com/ClickHouse/ClickHouse/pull/79059) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复 `arrayUnion()` 在执行过批量插入的表上返回额外错误值的缺陷。修复了 [#75057](https://github.com/ClickHouse/ClickHouse/issues/75057)。 [#79079](https://github.com/ClickHouse/ClickHouse/pull/79079) ([Peter Nguyen](https://github.com/petern48)).
* 修复 `OpenSSLInitializer` 中的段错误。解决了 [#79092](https://github.com/ClickHouse/ClickHouse/issues/79092)。 [#79097](https://github.com/ClickHouse/ClickHouse/pull/79097) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 始终为 S3 ListObject 设置前缀。 [#79114](https://github.com/ClickHouse/ClickHouse/pull/79114) ([Azat Khuzhin](https://github.com/azat)).
* 修复 arrayUnion() 在执行过批量插入的表上返回额外错误值的缺陷。修复了 [#79157](https://github.com/ClickHouse/ClickHouse/issues/79157)。 [#79158](https://github.com/ClickHouse/ClickHouse/pull/79158) ([Peter Nguyen](https://github.com/petern48)).
* 修复筛选条件下推后的逻辑错误。 [#79164](https://github.com/ClickHouse/ClickHouse/pull/79164) ([Pervakov Grigorii](https://github.com/GrigoryPervakov)).
* 修复采用 delta-kernel 实现的 DeltaLake 表引擎使用基于 HTTP 的端点时的问题，并修复 NOSIGN。解决了 [#78124](https://github.com/ClickHouse/ClickHouse/issues/78124)。 [#79203](https://github.com/ClickHouse/ClickHouse/pull/79203) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Keeper 修复：避免在失败的 multi 请求上触发监听器。 [#79247](https://github.com/ClickHouse/ClickHouse/pull/79247) ([Antonio Andelic](https://github.com/antonio2368)).
* 禁止在 IN 中使用 Dynamic 和 JSON 类型。当前的 `IN` 实现可能因此返回错误结果。正确支持这些类型的 `IN` 较为复杂，可在未来实现。 [#79282](https://github.com/ClickHouse/ClickHouse/pull/79282) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复 JSON 类型解析对重复路径的检查。 [#79317](https://github.com/ClickHouse/ClickHouse/pull/79317) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复 SecureStreamSocket 连接问题。 [#79383](https://github.com/ClickHouse/ClickHouse/pull/79383) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 修复加载含有数据的 plain\_rewritable 磁盘的问题。 [#79439](https://github.com/ClickHouse/ClickHouse/pull/79439) ([Julia Kartseva](https://github.com/jkartseva)).
* 修复 MergeTree 宽数据片段中发现动态子列时的崩溃。 [#79466](https://github.com/ClickHouse/ClickHouse/pull/79466) ([Pavel Kruglov](https://github.com/Avogar)).
* 仅在初始创建查询中校验表名长度，不对后续创建查询进行该校验，以避免向后兼容问题。 [#79488](https://github.com/ClickHouse/ClickHouse/pull/79488) ([Miсhael Stetsyuk](https://github.com/mstetsyuk)).
* 修复稀疏列表在若干情况下出现的 `Block structure mismatch` 错误。 [#79491](https://github.com/ClickHouse/ClickHouse/pull/79491) ([Anton Popov](https://github.com/CurtizJ)).
* 修复两种“Logical Error: Can't set alias of \* of Asterisk on alias”（逻辑错误：无法为星号 * 设置别名）的情况。 [#79505](https://github.com/ClickHouse/ClickHouse/pull/79505) ([Raúl Marín](https://github.com/Algunenano)).
* 修复重命名 Atomic 数据库时使用错误路径的问题。 [#79569](https://github.com/ClickHouse/ClickHouse/pull/79569) ([Tuan Pham Anh](https://github.com/tuanpach)).
* 修复按 JSON 列与其他列共同排序的问题。 [#79591](https://github.com/ClickHouse/ClickHouse/pull/79591) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复同时禁用 `use_hedged_requests` 和 `allow_experimental_parallel_reading_from_replicas` 时，从远程读取产生重复结果的问题。 [#79599](https://github.com/ClickHouse/ClickHouse/pull/79599) ([Eduard Karacharov](https://github.com/korowa)).
* 修复 delta-kernel 实现在使用 Unity Catalog 时的崩溃。 [#79677](https://github.com/ClickHouse/ClickHouse/pull/79677) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 为自动发现集群解析宏。 [#79696](https://github.com/ClickHouse/ClickHouse/pull/79696) ([Anton Ivashkin](https://github.com/ianton-ru)).
* 妥善处理错误配置的 page\_cache\_limits。 [#79805](https://github.com/ClickHouse/ClickHouse/pull/79805) ([Bharat Nallan](https://github.com/bharatnc)).
* 修复 SQL 函数 `formatDateTime` 在变长格式符（例如 `%W`，即星期名称 `Monday`、`Tuesday` 等）后跟复合格式符（一次输出多个组成部分的格式符，例如 `%D`，即美式日期 `05/04/25`）时的结果。 [#79835](https://github.com/ClickHouse/ClickHouse/pull/79835) ([Robert Schulze](https://github.com/rschu1ze)).
* IcebergS3 支持计数优化，但 IcebergS3Cluster 不支持。因此，集群模式返回的 count() 结果可能被放大为副本数的倍数。 [#79844](https://github.com/ClickHouse/ClickHouse/pull/79844) ([wxybear](https://github.com/wxybear)).
* 修复延迟物化中，在投影输出阶段之前不使用任何列执行查询时出现的 AMBIGUOUS\_COLUMN\_NAME 错误。例如 SELECT \* FROM t ORDER BY rand() LIMIT 5。 [#79926](https://github.com/ClickHouse/ClickHouse/pull/79926) ([Igor Nikonov](https://github.com/devcrafter)).
* 隐藏查询 `CREATE DATABASE datalake ENGINE = DataLakeCatalog(\'http://catalog:8181\', \'admin\', \'password\')` 中的密码。 [#79941](https://github.com/ClickHouse/ClickHouse/pull/79941) ([Han Fei](https://github.com/hanfei1991)).
* 允许在 JOIN USING 中指定别名。如果列已重命名（例如因 ARRAY JOIN），则指定该别名。修复了 [#73707](https://github.com/ClickHouse/ClickHouse/issues/73707)。 [#79942](https://github.com/ClickHouse/ClickHouse/pull/79942) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 使包含 UNION 的物化视图能在新副本上正确工作。 [#80037](https://github.com/ClickHouse/ClickHouse/pull/80037) ([Samay Sharma](https://github.com/samay-sharma)).
* SQL 函数 `parseDateTime` 中的格式符 `%e` 现在识别一位数字的日期（例如 `3`），此前要求用空格补齐（例如 ` 3`）。这使其行为与 MySQL 兼容。若要保留原先行为，请设置 `parsedatetime_e_requires_space_padding = 1`。（问题 [#78243](https://github.com/ClickHouse/ClickHouse/issues/78243)）。 [#80057](https://github.com/ClickHouse/ClickHouse/pull/80057) ([Robert Schulze](https://github.com/rschu1ze)).
* 修复 ClickHouse 日志中的 `Cannot find 'kernel' in '[...]/memory.stat'` 警告（问题 [#77410](https://github.com/ClickHouse/ClickHouse/issues/77410)）。 [#80129](https://github.com/ClickHouse/ClickHouse/pull/80129) ([Robert Schulze](https://github.com/rschu1ze)).
* 在 FunctionComparison 中检查堆栈大小，避免栈溢出崩溃。 [#78208](https://github.com/ClickHouse/ClickHouse/pull/78208) ([Julia Kartseva](https://github.com/jkartseva)).
* 修复从 `system.workloads` 执行 SELECT 时的竞争条件。 [#78743](https://github.com/ClickHouse/ClickHouse/pull/78743) ([Sergei Trifonov](https://github.com/serxa)).
* 修复分布式查询中的延迟物化。 [#78815](https://github.com/ClickHouse/ClickHouse/pull/78815) ([Igor Nikonov](https://github.com/devcrafter)).
* 修复从 `Array(Bool)` 到 `Array(FixedString)` 的转换。 [#78863](https://github.com/ClickHouse/ClickHouse/pull/78863) ([Nikita Taranov](https://github.com/nickitat)).
* 使 Parquet 版本选择更清晰。 [#78818](https://github.com/ClickHouse/ClickHouse/pull/78818) ([Michael Kolupaev](https://github.com/al13n321)).
* 修复 `ReservoirSampler` 的自合并。 [#79031](https://github.com/ClickHouse/ClickHouse/pull/79031) ([Nikita Taranov](https://github.com/nickitat)).
* 修复客户端上下文中插入目标表的保存。 [#79046](https://github.com/ClickHouse/ClickHouse/pull/79046) ([Pervakov Grigorii](https://github.com/GrigoryPervakov)).
* 修复 `AggregatingSortedAlgorithm` 和 `SummingSortedAlgorithm` 数据成员的析构顺序。 [#79056](https://github.com/ClickHouse/ClickHouse/pull/79056) ([Nikita Taranov](https://github.com/nickitat)).
* `enable_user_name_access_type` 不得影响 `DEFINER` 访问类型。 [#80026](https://github.com/ClickHouse/ClickHouse/pull/80026) ([pufit](https://github.com/pufit)).
* 修复 system 数据库元数据位于 Keeper 时，对 system 数据库的查询可能挂起的问题。 [#79304](https://github.com/ClickHouse/ClickHouse/pull/79304) ([Mikhail Artemenko](https://github.com/Michicosun)).

#### 构建、测试与打包改进

* 允许复用已构建的 `chcache` 二进制文件，而非每次重新构建。 [#78851](https://github.com/ClickHouse/ClickHouse/pull/78851) ([János Benjamin Antal](https://github.com/antaljanosbenjamin)).
* 添加 NATS 暂停等待。 [#78987](https://github.com/ClickHouse/ClickHouse/pull/78987) ([Dmitry Novikov](https://github.com/dmitry-sles-novikov)).
* 修复将 ARM 构建错误地发布为 amd64compat 的问题。 [#79122](https://github.com/ClickHouse/ClickHouse/pull/79122) ([Alexander Gololobov](https://github.com/davenger)).
* 为 OpenSSL 使用预先生成的汇编代码。 [#79386](https://github.com/ClickHouse/ClickHouse/pull/79386) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 修复构建问题，以支持 `clang20`。 [#79588](https://github.com/ClickHouse/ClickHouse/pull/79588) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* `chcache`：支持 Rust 缓存。 [#78691](https://github.com/ClickHouse/ClickHouse/pull/78691) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 为 `zstd` 汇编文件添加堆栈展开信息。 [#79288](https://github.com/ClickHouse/ClickHouse/pull/79288) ([Michael Kolupaev](https://github.com/al13n321)).
