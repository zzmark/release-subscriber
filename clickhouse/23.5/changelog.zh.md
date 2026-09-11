<h3 id="235">
  <a id="235" /> ClickHouse 23.5 版本, 2023-06-08. [演示文稿](https://presentations.clickhouse.com/2023-release-23.5/), [视频](https://www.youtube.com/watch?v=o8Gj1ClU71M)
</h3>

<Frame>
  <iframe src="https://www.youtube.com/embed/o8Gj1ClU71M" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
</Frame>

<h4 id="upgrade-notes">
  升级说明
</h4>

* 默认压缩标记和主键，显著缩短冷查询时间。升级说明：压缩标记和主键的支持在 22.9 中加入。如果启用了标记或主键压缩，或者安装了默认启用这些功能的 23.5 及更新版本，就无法降级到 22.8 或更早版本。也可以在服务器配置文件的 `<merge_tree>` 节中指定 `compress_marks` 和 `compress_primary_key` 设置，显式禁用标记或主键压缩。**升级说明：**从 22.9 之前的版本升级时，应一次升级所有副本，或在升级前禁用压缩，或先升级到支持压缩标记但默认未启用的中间版本，例如 23.3。 [#42587](https://github.com/ClickHouse/ClickHouse/pull/42587) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 使本地对象存储与 S3 对象存储行为一致，修复追加问题（关闭 [#48465](https://github.com/ClickHouse/ClickHouse/issues/48465)），并使其可配置为独立存储。此变更向后不兼容，因为本地对象存储之上的缓存与此前版本不兼容。 [#48791](https://github.com/ClickHouse/ClickHouse/pull/48791) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 移除“内存数据片段”实验性功能。仍支持该数据格式，但相关设置变为空操作，改用 Compact 或 Wide 数据片段。关闭 [#45409](https://github.com/ClickHouse/ClickHouse/issues/45409)。 [#49429](https://github.com/ClickHouse/ClickHouse/pull/49429) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修改 `parallelize_output_from_storages` 和 `input_format_parquet_preserve_order` 的默认值，允许 ClickHouse 从文件（例如 CSV 或 Parquet）读取时重新排列行，在许多场景中显著提升性能。若要恢复保留行序的旧行为，请使用 `parallelize_output_from_storages = 0`、`input_format_parquet_preserve_order = 1`。 [#49479](https://github.com/ClickHouse/ClickHouse/pull/49479) ([Michael Kolupaev](https://github.com/al13n321)).
* 使投影达到生产可用状态。新增 `optimize_use_projections` 设置，控制 SELECT 查询是否选择使用投影。`allow_experimental_projection_optimization` 设置已废弃且不再生效。 [#49719](https://github.com/ClickHouse/ClickHouse/pull/49719) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 将 `joinGet` 标记为非确定性函数（与 `dictGet` 一样），允许在变更操作中使用它们而无需额外设置。 [#49843](https://github.com/ClickHouse/ClickHouse/pull/49843) ([Azat Khuzhin](https://github.com/azat)).
* 回退“`groupArray` 返回值不能可空”的变更，因为它破坏了 `Nullable` 类型上 `groupArray`/`groupArrayLast`/`groupArraySample` 的二进制兼容性，很可能导致 `TOO_LARGE_ARRAY_SIZE` 或 `CANNOT_READ_ALL_DATA`。 [#49971](https://github.com/ClickHouse/ClickHouse/pull/49971) ([Azat Khuzhin](https://github.com/azat)).
* 默认启用 `enable_memory_bound_merging_of_aggregation_results` 设置。如果从 22.12 之前的版本升级，建议在升级完成前将其设为 `false`。 [#50319](https://github.com/ClickHouse/ClickHouse/pull/50319) ([Nikita Taranov](https://github.com/nickitat)).

<h4 id="new-feature-7">
  新功能
</h4>

* 新增 AzureBlobStorage 存储引擎和 azureBlobStorage 表函数，支持的功能集与 S3 存储引擎/表函数十分相似。\[#50604] ([https://github.com/ClickHouse/ClickHouse/pull/50604](https://github.com/ClickHouse/ClickHouse/pull/50604)) ([alesapin](https://github.com/alesapin)) ([SmitaRKulkarni](https://github.com/SmitaRKulkarni)。
* 新增原生 ClickHouse Keeper 命令行客户端，可通过 `clickhouse keeper-client` 使用。 [#47414](https://github.com/ClickHouse/ClickHouse/pull/47414) ([pufit](https://github.com/pufit)).
* 新增 `urlCluster` 表函数。重构所有 \*Cluster 表函数以减少重复代码。使结构推断适用于所有可能的 \*Cluster 函数签名和命名集合。关闭 [#38499](https://github.com/ClickHouse/ClickHouse/issues/38499)。[#45427](https://github.com/ClickHouse/ClickHouse/pull/45427) ([attack204](https://github.com/attack204))，Pavel Kruglov。
* 查询缓存现在可用于生产工作负载，也支持包含 totals 和 extremes 修饰符的查询。 [#47977](https://github.com/ClickHouse/ClickHouse/pull/47977) ([Robert Schulze](https://github.com/rschu1ze)). [#48853](https://github.com/ClickHouse/ClickHouse/pull/48853) ([Robert Schulze](https://github.com/rschu1ze))。为保持向后兼容，将 `allow_experimental_query_cache` 设置标为废弃；该设置此前已在 [https://github.com/ClickHouse/ClickHouse/pull/47977](https://github.com/ClickHouse/ClickHouse/pull/47977) 中移除。[#49934](https://github.com/ClickHouse/ClickHouse/pull/49934) ([Timur Solodovnikov](https://github.com/tsolodov))。
* 地理数据类型（`Point`、`Ring`、`Polygon` 和 `MultiPolygon`）已达到生产可用状态。 [#50022](https://github.com/ClickHouse/ClickHouse/pull/50022) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 为 PostgreSQL、MySQL、MeiliSearch 和 SQLite 表引擎新增结构推断。关闭 [#49972](https://github.com/ClickHouse/ClickHouse/issues/49972)。 [#50000](https://github.com/ClickHouse/ClickHouse/pull/50000) ([Nikolay Degterinsky](https://github.com/evillique)).
* `CREATE USER u IDENTIFIED BY 'p'` 这样的查询将根据服务器 `config.xml` 中的 `default_password_type` 设置自动确定密码类型。关闭 [#42915](https://github.com/ClickHouse/ClickHouse/issues/42915)。 [#44674](https://github.com/ClickHouse/ClickHouse/pull/44674) ([Nikolay Degterinsky](https://github.com/evillique)).
* 新增 bcrypt 密码认证类型。关闭 [#34599](https://github.com/ClickHouse/ClickHouse/issues/34599)。 [#44905](https://github.com/ClickHouse/ClickHouse/pull/44905) ([Nikolay Degterinsky](https://github.com/evillique)).
* 引入新语法 `INTO OUTFILE 'file.txt' APPEND`。 [#48880](https://github.com/ClickHouse/ClickHouse/pull/48880) ([alekar](https://github.com/alekar)).
* 新增 `system.zookeeper_connection` 表，展示 Keeper 连接信息。 [#45245](https://github.com/ClickHouse/ClickHouse/pull/45245) ([mateng915](https://github.com/mateng0915)).
* 新增 `generateRandomStructure` 函数，用于生成随机表结构，可与 `generateRandom` 表函数配合使用。 [#47409](https://github.com/ClickHouse/ClickHouse/pull/47409) ([Kruglov Pavel](https://github.com/Avogar)).
* 允许 `CASE` 不包含 `ELSE` 分支，并扩展 `transform` 以处理更多类型。同时修复 Decimal 与其他数值类型混用时 transform() 返回错误结果的问题。关闭 #2655，关闭 #9596，关闭 #38666。 [#48300](https://github.com/ClickHouse/ClickHouse/pull/48300) ([Salvatore Mesoraca](https://github.com/aiven-sal)).
* S3 表新增[使用 KMS 密钥的服务端加密](https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingKMSEncryption.html)，S3 磁盘新增 `header` 设置。关闭 [#48723](https://github.com/ClickHouse/ClickHouse/issues/48723)。 [#48724](https://github.com/ClickHouse/ClickHouse/pull/48724) ([Johann Gan](https://github.com/johanngan)).
* 为后台任务（合并和变更操作）添加 MemoryTracker。引入 `merges_mutations_memory_usage_soft_limit` 和 `merges_mutations_memory_usage_to_ram_ratio` 设置，表示合并和变更操作的软内存限制。达到限制时，ClickHouse 不再调度新的合并或变更任务。另引入 `MergesMutationsMemoryTracking` 指标，用于观察后台任务当前的内存使用。重新提交 [#46089](https://github.com/ClickHouse/ClickHouse/issues/46089)。关闭 [#48774](https://github.com/ClickHouse/ClickHouse/issues/48774)。 [#48787](https://github.com/ClickHouse/ClickHouse/pull/48787) ([Dmitry Novik](https://github.com/novikd)).
* `dotProduct` 函数支持数组。 [#49050](https://github.com/ClickHouse/ClickHouse/pull/49050) ([FFFFFFFHHHHHHH](https://github.com/FFFFFFFHHHHHHH)).
* 支持 `SHOW INDEX` 语句，以改善 MySQL 兼容性。 [#49158](https://github.com/ClickHouse/ClickHouse/pull/49158) ([Robert Schulze](https://github.com/rschu1ze)).
* 为 `url` 表函数新增虚拟列 `_file` 和 `_path` 支持。- 改进 `url` 表函数的错误消息。- 解决 [#49231](https://github.com/ClickHouse/ClickHouse/issues/49231)。- 解决 [#49232](https://github.com/ClickHouse/ClickHouse/issues/49232)。 [#49356](https://github.com/ClickHouse/ClickHouse/pull/49356) ([Ziyi Tan](https://github.com/Ziy1-Tan)).
* 在 users.xml 文件中新增 `grants` 字段，允许指定用户授权。 [#49381](https://github.com/ClickHouse/ClickHouse/pull/49381) ([pufit](https://github.com/pufit)).
* 使用 grace hash join 算法支持 FULL/RIGHT JOIN。 [#49483](https://github.com/ClickHouse/ClickHouse/pull/49483) ([lgbo](https://github.com/lgbo-ustc)).
* `WITH FILL` 修饰符按排序前缀对填充进行分组，由默认启用的 `use_with_fill_by_sorting_prefix` 设置控制。与 [#33203](https://github.com/ClickHouse/ClickHouse/issues/33203)#issuecomment-1418736794 相关。 [#49503](https://github.com/ClickHouse/ClickHouse/pull/49503) ([Igor Nikonov](https://github.com/devcrafter)).
* 未指定 “--query”（或 “-q”）时，clickhouse-client 现在接受紧随 “--multiquery” 的查询。例如：clickhouse-client --multiquery "select 1; select 2;"。 [#49870](https://github.com/ClickHouse/ClickHouse/pull/49870) ([Alexey Gerasimchuk](https://github.com/Demilivor)).
* 为接收副本 Hello 数据包新增独立的 `handshake_timeout`。关闭 [#48854](https://github.com/ClickHouse/ClickHouse/issues/48854)。 [#49948](https://github.com/ClickHouse/ClickHouse/pull/49948) ([Kruglov Pavel](https://github.com/Avogar)).
* 新增 “space” 函数，将空格重复指定次数。 [#50103](https://github.com/ClickHouse/ClickHouse/pull/50103) ([Robert Schulze](https://github.com/rschu1ze)).
* 新增 --input\_format\_csv\_trim\_whitespaces 选项。 [#50215](https://github.com/ClickHouse/ClickHouse/pull/50215) ([Alexey Gerasimchuk](https://github.com/Demilivor)).
* 允许正则表达式树字典的 `dictGetAll` 函数以数组形式返回多个匹配项的值。关闭 [#50254](https://github.com/ClickHouse/ClickHouse/issues/50254)。 [#50255](https://github.com/ClickHouse/ClickHouse/pull/50255) ([Johann Gan](https://github.com/johanngan)).
* 新增 `toLastDayOfWeek` 函数，将日期或日期时间向上取整到最近的周六或周日。 [#50315](https://github.com/ClickHouse/ClickHouse/pull/50315) ([Victor Krasnov](https://github.com/sirvickr)).
* 支持通过指定 `ignore_data_skipping_indices` 忽略某个数据跳过索引。 [#50329](https://github.com/ClickHouse/ClickHouse/pull/50329) ([Boris Kuschel](https://github.com/bkuschel)).
* 新增 `system.user_processes` 表和 `SHOW USER PROCESSES` 查询，展示用户级内存信息和 ProfileEvents。 [#50492](https://github.com/ClickHouse/ClickHouse/pull/50492) ([János Benjamin Antal](https://github.com/antaljanosbenjamin)).
* 新增服务器及格式设置 `display_secrets_in_show_and_select`，用于显示表、数据库、表函数和字典的机密信息。新增 `displaySecretsInShowAndSelect` 权限，控制哪些用户可以查看这些信息。 [#46528](https://github.com/ClickHouse/ClickHouse/pull/46528) ([Mike Kot](https://github.com/myrrc)).
* 允许为属于同一 DATABASE 的所有表设置 ROW POLICY。 [#47640](https://github.com/ClickHouse/ClickHouse/pull/47640) ([Ilya Golshtein](https://github.com/ilejn)).

<h4 id="performance-improvement-7">
  性能改进
</h4>

* 默认压缩标记和主键，显著缩短冷查询时间。升级说明：压缩标记和主键的支持在 22.9 中加入。如果启用了标记或主键压缩，或者安装了默认启用这些功能的 23.5 及更新版本，就无法降级到 22.8 或更早版本。也可以在服务器配置文件的 `<merge_tree>` 节中指定 `compress_marks` 和 `compress_primary_key` 设置，显式禁用标记或主键压缩。 [#42587](https://github.com/ClickHouse/ClickHouse/pull/42587) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 新增 s3\_max\_inflight\_parts\_for\_one\_file 设置，限制单个文件在分段上传请求中并发上传的分段数量。 [#49961](https://github.com/ClickHouse/ClickHouse/pull/49961) ([Sema Checherinda](https://github.com/CheSema)).
* 读取多个文件时，减少每个文件使用的并行解析线程。解决 [#42192](https://github.com/ClickHouse/ClickHouse/issues/42192)。 [#46661](https://github.com/ClickHouse/ClickHouse/pull/46661) ([SmitaRKulkarni](https://github.com/SmitaRKulkarni)).
* 仅当聚合投影读取的粒度单元少于普通读取时才使用它，有助于改善查询命中表主键却未命中投影主键的情况。修复 [#49150](https://github.com/ClickHouse/ClickHouse/issues/49150)。 [#49417](https://github.com/ClickHouse/ClickHouse/pull/49417) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* `ANY` 哈希连接未插入任何内容时，不存储数据块。 [#48633](https://github.com/ClickHouse/ClickHouse/pull/48633) ([vdimir](https://github.com/vdimir)).
* 修复 JIT 编译时的聚合组合器 `-If`，并为聚合函数启用 JIT 编译。关闭 [#48120](https://github.com/ClickHouse/ClickHouse/issues/48120)。 [#49083](https://github.com/ClickHouse/ClickHouse/pull/49083) ([Igor Nikonov](https://github.com/devcrafter)).
* 从远程表读取时使用更小的任务（不再读取整个数据片段），使任务窃取能够发挥作用。\* 根据待读取列的大小确定任务大小。\* 从 S3 读取始终使用 1 MB 缓冲区。\* 缓存段边界按 1 MB 对齐，使小任务也能具有合适的段大小，并有助于避免碎片化。 [#49287](https://github.com/ClickHouse/ClickHouse/pull/49287) ([Nikita Taranov](https://github.com/nickitat)).
* 引入设置：- `merge_max_block_size_bytes`，限制后台操作使用的内存量。- `vertical_merge_algorithm_min_bytes_to_activate`，为激活纵向合并增加一个条件。 [#49313](https://github.com/ClickHouse/ClickHouse/pull/49313) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* 将本地文件系统读取缓冲区的默认大小调整为稍优的值，并引入两个新设置：`max_read_buffer_size_local_fs` 和 `max_read_buffer_size_remote_fs`。 [#49321](https://github.com/ClickHouse/ClickHouse/pull/49321) ([Nikita Taranov](https://github.com/nickitat)).
* 改善 `SPARSE_HASHED`/`HASHED` 字典的内存使用和速度（例如，`SPARSE_HASHED` 的内存占用降至原来的约 1/2.6，速度约为原来的 \~2 倍）。 [#49380](https://github.com/ClickHouse/ClickHouse/pull/49380) ([Azat Khuzhin](https://github.com/azat)).
* 在合适的位置使用 `LowCardinality`，优化 `system.query_log` 和 `system.query_thread_log` 表，使查询这些表更快。 [#49530](https://github.com/ClickHouse/ClickHouse/pull/49530) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 通过并行读取提升本地 `Parquet` 文件读取性能。 [#49539](https://github.com/ClickHouse/ClickHouse/pull/49539) ([Michael Kolupaev](https://github.com/al13n321)).
* 在特定场景中将 `RIGHT/FULL JOIN` 的性能最多提升至原来的 2 倍，尤其是小左表与大右表连接时。 [#49585](https://github.com/ClickHouse/ClickHouse/pull/49585) ([lgbo](https://github.com/lgbo-ustc)).
* 通过为 Rust 启用 LTO，将 BLAKE3 性能提升 11%，现在与 C++ 相当。 [#49600](https://github.com/ClickHouse/ClickHouse/pull/49600) ([Azat Khuzhin](https://github.com/azat)).
* 优化 `system.opentelemetry_span_log` 的结构，在合适的位置使用 `LowCardinality`。尽管这张表的设计总体不太合理（连常见属性都使用 Map 类型），现在也稍有改善。 [#49647](https://github.com/ClickHouse/ClickHouse/pull/49647) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 尝试为 `grace_hash` 连接预留哈希表大小。 [#49816](https://github.com/ClickHouse/ClickHouse/pull/49816) ([lgbo](https://github.com/lgbo-ustc)).
* 并行合并 `uniqExactIf` 状态。关闭 [#49885](https://github.com/ClickHouse/ClickHouse/issues/49885)。 [#50285](https://github.com/ClickHouse/ClickHouse/pull/50285) ([flynn](https://github.com/ucasfl)).
* Keeper 改进：新增 `CheckNotExists` 请求，以提升复制表性能。 [#48897](https://github.com/ClickHouse/ClickHouse/pull/48897) ([Antonio Andelic](https://github.com/antonio2368)).
* Keeper 性能改进：避免在处理时将同一请求序列化两次；缓存大型请求的反序列化结果，由新增协调设置 `min_request_size_for_cache` 控制。 [#49004](https://github.com/ClickHouse/ClickHouse/pull/49004) ([Antonio Andelic](https://github.com/antonio2368)).
* 选择待合并数据片段时，如果大量分区无内容可合并，则减少 `List` ZooKeeper 请求数。 [#49637](https://github.com/ClickHouse/ClickHouse/pull/49637) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 重构文件系统缓存的锁机制。 [#44985](https://github.com/ClickHouse/ClickHouse/pull/44985) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 可以进行简单计数优化时，禁用纯并行副本模式。 [#50594](https://github.com/ClickHouse/ClickHouse/pull/50594) ([Raúl Marín](https://github.com/Algunenano)).
* Iceberg 结构推断不再为所有键发送 HEAD 请求，仅针对用于读取数据的键发送。 [#50203](https://github.com/ClickHouse/ClickHouse/pull/50203) ([Kruglov Pavel](https://github.com/Avogar)).
* 默认启用 `enable_memory_bound_merging_of_aggregation_results` 设置。 [#50319](https://github.com/ClickHouse/ClickHouse/pull/50319) ([Nikita Taranov](https://github.com/nickitat)).

<h4 id="experimental-feature-4">
  实验性功能
</h4>

* `DEFLATE_QPL` 编解码器将最低 SIMD 版本降至 SSE 4.2。[QPL 文档变更](https://github.com/intel/qpl/commit/3f8f5cea27739f5261e8fd577dc233ffe88bf679)。- Intel® QPL 依靠运行时内核分派器和 cpuid 检查选择最佳可用实现（sse/avx2/avx512）。- 重构 ClickHouse 构建 QPL 的 CMake 文件，使其与最新上游 QPL 一致。 [#49811](https://github.com/ClickHouse/ClickHouse/pull/49811) ([jasperzhu](https://github.com/jinjunzh)).
* 初步支持使用纯并行副本执行 JOIN。 [#49544](https://github.com/ClickHouse/ClickHouse/pull/49544) ([Raúl Marín](https://github.com/Algunenano)).
* 使用零复制机制时，提高 `Outdated` 数据片段移除的并行度。 [#49630](https://github.com/ClickHouse/ClickHouse/pull/49630) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 并行副本：1）修复对非复制存储使用并行副本且禁用 `parallel_replicas_for_non_replicated_merge_tree` 时出现的 `NOT_FOUND_COLUMN_IN_BLOCK` 错误。2）`allow_experimental_parallel_reading_from_replicas` 现在有 0、1、2 三种取值：0 表示禁用；1 表示启用，失败时静默禁用（例如 FINAL 或 JOIN 场景）；2 表示启用，失败时抛出异常。3）SELECT 查询使用 FINAL 且启用并行副本时，如果 `allow_experimental_parallel_reading_from_replicas` 为 1，ClickHouse 会尝试禁用并行副本，否则抛出异常。 [#50195](https://github.com/ClickHouse/ClickHouse/pull/50195) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* 启用并行副本时，始终跳过不可用服务器（由 `skip_unavailable_shards` 设置控制，默认启用，只能显式禁用）。关闭 [#48565](https://github.com/ClickHouse/ClickHouse/issues/48565)。 [#50293](https://github.com/ClickHouse/ClickHouse/pull/50293) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).

<h4 id="improvement-7">
  改进
</h4>

* `BACKUP` 命令备份加密磁盘时不再解密数据，而是以加密形式存入备份。此类备份只能恢复到使用相同或更完整加密密钥列表的加密磁盘。 [#48896](https://github.com/ClickHouse/ClickHouse/pull/48896) ([Vitaly Baranov](https://github.com/vitlibar)).
* 支持在 ATTACH PARTITION FROM 和 REPLACE PARTITION FROM 的 FROM 部分使用临时表。 [#49436](https://github.com/ClickHouse/ClickHouse/pull/49436) ([Roman Vasin](https://github.com/rvasin)).
* 为 `MergeTree` 表新增 `async_insert` 设置，含义与查询级 `async_insert` 相同，用于为特定表启用异步插入。注意：它对来自 `clickhouse-client` 的插入查询不生效，此时应使用查询级设置。 [#49122](https://github.com/ClickHouse/ClickHouse/pull/49122) ([Anton Popov](https://github.com/CurtizJ)).
* 配额创建语句参数支持大小后缀。 [#49087](https://github.com/ClickHouse/ClickHouse/pull/49087) ([Eridanus](https://github.com/Eridanus117)).
* 扩展 `first_value` 和 `last_value`，使其接受 NULL。 [#46467](https://github.com/ClickHouse/ClickHouse/pull/46467) ([lgbo](https://github.com/lgbo-ustc)).
* 为 `extractKeyValuePairs` 新增别名 `str_to_map` 和 `mapFromString`。关闭 [https://github.com/clickhouse/clickhouse/issues/47185](https://github.com/clickhouse/clickhouse/issues/47185)。 [#49466](https://github.com/ClickHouse/ClickHouse/pull/49466) ([flynn](https://github.com/ucasfl)).
* 为内存使用和可用量相关的异步指标新增 CGroup v2 支持。关闭 [#37983](https://github.com/ClickHouse/ClickHouse/issues/37983)。 [#45999](https://github.com/ClickHouse/ClickHouse/pull/45999) ([sichenzhao](https://github.com/sichenzhao)).
* Cluster 表函数应始终跳过不可用分片。关闭 [#46314](https://github.com/ClickHouse/ClickHouse/issues/46314)。 [#46765](https://github.com/ClickHouse/ClickHouse/pull/46765) ([zk\_kiger](https://github.com/zk-kiger)).
* 允许 CSV 文件表头包含空列。 [#47496](https://github.com/ClickHouse/ClickHouse/pull/47496) ([你不要过来啊](https://github.com/iiiuwioajdks)).
* 新增兼容 Google Cloud Storage S3 接口的 `gcs` 表函数。与 `oss` 和 `cosn` 一样，它只是 `s3` 表函数的别名，不引入新功能。 [#47815](https://github.com/ClickHouse/ClickHouse/pull/47815) ([Kuba Kaflik](https://github.com/jkaflik)).
* 新增为 S3 使用严格分段大小的能力，以兼容 CloudFlare R2 S3 存储。 [#48492](https://github.com/ClickHouse/ClickHouse/pull/48492) ([Azat Khuzhin](https://github.com/azat)).
* 为 `system.clusters` 新增 `Replicated` 数据库副本信息列：`database_shard_name`、`database_replica_name`、`is_active`。为 `SYSTEM DROP DATABASE REPLICA` 查询新增可选的 `FROM SHARD` 子句。 [#48548](https://github.com/ClickHouse/ClickHouse/pull/48548) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 为 system.replicas 新增 `zookeeper_name` 列，指明复制表的元数据存储在哪个（辅助）ZooKeeper 集群。 [#48549](https://github.com/ClickHouse/ClickHouse/pull/48549) ([cangyin](https://github.com/cangyin)).
* `IN` 运算符支持比较 `Date` 与 `Date32`。关闭 [#48736](https://github.com/ClickHouse/ClickHouse/issues/48736)。 [#48806](https://github.com/ClickHouse/ClickHouse/pull/48806) ([flynn](https://github.com/ucasfl)).
* 支持 `HDFS` 中的纠删码，作者：@M1eyu2018、@tomscut。 [#48833](https://github.com/ClickHouse/ClickHouse/pull/48833) ([M1eyu](https://github.com/M1eyu2018)).
* 实现从辅助 ZooKeeper 集群执行 SYSTEM DROP REPLICA，可能关闭 [#48931](https://github.com/ClickHouse/ClickHouse/issues/48931)。 [#48932](https://github.com/ClickHouse/ClickHouse/pull/48932) ([wangxiaobo](https://github.com/wzb5212)).
* 为 MongoDB 新增 Array 数据类型。关闭 [#48598](https://github.com/ClickHouse/ClickHouse/issues/48598)。 [#48983](https://github.com/ClickHouse/ClickHouse/pull/48983) ([Nikolay Degterinsky](https://github.com/evillique)).
* 支持在表中存储 `Interval` 数据类型。 [#49085](https://github.com/ClickHouse/ClickHouse/pull/49085) ([larryluogit](https://github.com/larryluogit)).
* 允许使用 `ntile` 窗口函数而无需显式定义窗口框架，例如 `ntile(3) OVER (ORDER BY a)`。关闭 [#46763](https://github.com/ClickHouse/ClickHouse/issues/46763)。 [#49093](https://github.com/ClickHouse/ClickHouse/pull/49093) ([vdimir](https://github.com/vdimir)).
* 新增设置 `number_of_mutations_to_delay`、`number_of_mutations_to_throw`：当表中已有大量未完成变更操作时，延迟执行或拒绝会创建变更操作的 `ALTER` 查询（`ALTER UPDATE`、`ALTER DELETE`、`ALTER MODIFY COLUMN` 等）。 [#49117](https://github.com/ClickHouse/ClickHouse/pull/49117) ([Anton Popov](https://github.com/CurtizJ)).
* 捕获文件系统缓存中 `create_directories` 抛出的异常。 [#49203](https://github.com/ClickHouse/ClickHouse/pull/49203) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 将内嵌示例复制到 `system.functions` 的新字段 `example`，补充 `description` 字段。 [#49222](https://github.com/ClickHouse/ClickHouse/pull/49222) ([Dan Roscigno](https://github.com/DanRoscigno)).
* 为 MongoDB 字典启用连接选项。示例：`xml <source> <mongodb> <host>localhost</host> <port>27017</port> <user></user> <password></password> <db>test</db> <collection>dictionary_source</collection> <options>ssl=true</options> </mongodb> </source>` ### 面向用户变更的文档条目。 [#49225](https://github.com/ClickHouse/ClickHouse/pull/49225) ([MikhailBurdukov](https://github.com/MikhailBurdukov)).
* 为 `kolmogorovSmirnovTest` 的 `asymp` 计算方法新增别名 `asymptotic`，并改进文档。 [#49286](https://github.com/ClickHouse/ClickHouse/pull/49286) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* 聚合函数 groupBitAnd/Or/Xor 现在支持有符号整数数据，使其与标量函数 bitAnd/Or/Xor 的行为一致。 [#49292](https://github.com/ClickHouse/ClickHouse/pull/49292) ([exmy](https://github.com/exmy)).
* 将函数文档拆分为粒度更细的字段。 [#49300](https://github.com/ClickHouse/ClickHouse/pull/49300) ([Robert Schulze](https://github.com/rschu1ze)).
* 使用服务器中所有表共享的多线程加载过期数据片段。线程池大小和队列长度由 `max_outdated_parts_loading_thread_pool_size`、`outdated_part_loading_thread_pool_queue_size` 设置控制。 [#49317](https://github.com/ClickHouse/ClickHouse/pull/49317) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* `LowCardinality` 列在数据块之间共享字典时，不再高估已处理数据大小。关闭 [#49322](https://github.com/ClickHouse/ClickHouse/issues/49322)。另见 [#48745](https://github.com/ClickHouse/ClickHouse/issues/48745)。 [#49323](https://github.com/ClickHouse/ClickHouse/pull/49323) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 通过 `OUTFILE` 调用 Parquet 写入器时，现在使用合理的行组大小。 [#49325](https://github.com/ClickHouse/ClickHouse/pull/49325) ([Michael Kolupaev](https://github.com/al13n321)).
* 如果别名带引号，则允许使用 `ARRAY` 这样的受限关键字作为别名。关闭 [#49324](https://github.com/ClickHouse/ClickHouse/issues/49324)。 [#49360](https://github.com/ClickHouse/ClickHouse/pull/49360) ([Nikolay Degterinsky](https://github.com/evillique)).
* 将数据片段加载和删除任务从每表线程池移到服务器全局共享线程池。线程池大小由顶层配置中的 `max_active_parts_loading_thread_pool_size`、`max_outdated_parts_loading_thread_pool_size` 和 `max_parts_cleaning_thread_pool_size` 控制。表级设置 `max_part_loading_threads` 和 `max_part_removal_threads` 已废弃。 [#49474](https://github.com/ClickHouse/ClickHouse/pull/49474) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* 允许在 Play UI 的 URL 中使用 `?password=pass`；浏览器历史记录中的密码会被替换。 [#49505](https://github.com/ClickHouse/ClickHouse/pull/49505) ([Mike Kot](https://github.com/myrrc)).
* 允许从远程文件系统读取大小为零的对象，因为空文件不会备份，元数据文件中可能最终不包含任何数据块。关闭 [#49480](https://github.com/ClickHouse/ClickHouse/issues/49480)。 [#49519](https://github.com/ClickHouse/ClickHouse/pull/49519) ([Kseniia Sumarokova](https://github.com/kssenii)).
* `ThreadGroup` 分离后，将线程 MemoryTracker 挂接到 `total_memory_tracker`。 [#49527](https://github.com/ClickHouse/ClickHouse/pull/49527) ([Dmitry Novik](https://github.com/novikd)).
* 修复查询参数在查询中多次使用时的参数化视图。 [#49556](https://github.com/ClickHouse/ClickHouse/pull/49556) ([Azat Khuzhin](https://github.com/azat)).
* 在查询上下文中释放为最后一次发送的 ProfileEvents 快照分配的内存。后续修复 [#47564](https://github.com/ClickHouse/ClickHouse/issues/47564)。 [#49561](https://github.com/ClickHouse/ClickHouse/pull/49561) ([Dmitry Novik](https://github.com/novikd)).
* “makeDate” 函数现在提供兼容 MySQL 的重载，参数为年份和年内日序号。 [#49603](https://github.com/ClickHouse/ClickHouse/pull/49603) ([Robert Schulze](https://github.com/rschu1ze)).
* `RegExpTreeDictionary` 支持 `dictionary` 表函数。 [#49666](https://github.com/ClickHouse/ClickHouse/pull/49666) ([Han Fei](https://github.com/hanfei1991)).
* 新增加权公平 IO 调度策略；新增动态资源管理器，允许在运行时更新 IO 调度层级，无需重启服务器。 [#49671](https://github.com/ClickHouse/ClickHouse/pull/49671) ([Sergei Trifonov](https://github.com/serxa)).
* 向 GCS 分段上传后添加 compose 请求，以便对分段上传的对象使用复制操作。建议将 `s3_strict_upload_part_size` 设为某个值，因为不同大小分段创建的对象可能导致 compose 请求失败。 [#49693](https://github.com/ClickHouse/ClickHouse/pull/49693) ([Antonio Andelic](https://github.com/antonio2368)).
* 对于 `extractKeyValuePairs` 函数，改进尽力解析逻辑，允许 `key_value_delimiter` 成为值中的合法内容。这也简化了分支逻辑，可能略微提升速度。 [#49760](https://github.com/ClickHouse/ClickHouse/pull/49760) ([Arthur Passos](https://github.com/arthurpassos)).
* 为 system.processors\_profile\_log 新增 `initial_query_id` 字段。 [#49777](https://github.com/ClickHouse/ClickHouse/pull/49777) ([helifu](https://github.com/helifu)).
* 系统日志表现在可以使用自定义排序键。 [#49778](https://github.com/ClickHouse/ClickHouse/pull/49778) ([helifu](https://github.com/helifu)).
* 为 `system.query_log` 新增 `partitions` 字段，指明哪些分区参与了计算。 [#49779](https://github.com/ClickHouse/ClickHouse/pull/49779) ([helifu](https://github.com/helifu)).
* 为 `ReplicatedMergeTree` 新增 `enable_the_endpoint_id_with_zookeeper_name_prefix` 设置（默认禁用）。启用后，将 ZooKeeper 集群名称加入表的服务器间通信端点，避免具有相同路径但使用不同辅助 ZooKeeper 的复制表出现 `Duplicate interserver IO endpoint` 错误。 [#49780](https://github.com/ClickHouse/ClickHouse/pull/49780) ([helifu](https://github.com/helifu)).
* 为 `clickhouse-local` 新增查询参数支持。关闭 [#46561](https://github.com/ClickHouse/ClickHouse/issues/46561)。 [#49785](https://github.com/ClickHouse/ClickHouse/pull/49785) ([Nikolay Degterinsky](https://github.com/evillique)).
* 默认允许从 YAML 加载字典和函数。此前需要修改配置文件中的 `dictionaries_config` 或 `user_defined_executable_functions_config`，因为这些设置默认匹配 `*.xml` 文件。 [#49812](https://github.com/ClickHouse/ClickHouse/pull/49812) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* Kafka 表引擎现在允许使用别名列。 [#49824](https://github.com/ClickHouse/ClickHouse/pull/49824) ([Aleksandr Musorin](https://github.com/AVMusorin)).
* 新增设置，限制 `extractKeyValuePairs` 生成的键值对最大数量，防止内存使用过量。 [#49836](https://github.com/ClickHouse/ClickHouse/pull/49836) ([Arthur Passos](https://github.com/arthurpassos)).
* 支持 `IN` 运算符的参数为单元素元组这一不常见的情况。 [#49844](https://github.com/ClickHouse/ClickHouse/pull/49844) ([MikhailBurdukov](https://github.com/MikhailBurdukov)).
* `bitHammingDistance` 函数支持 `String` 和 `FixedString` 数据类型。关闭 [#48827](https://github.com/ClickHouse/ClickHouse/issues/48827)。 [#49858](https://github.com/ClickHouse/ClickHouse/pull/49858) ([flynn](https://github.com/ucasfl)).
* 修复 OS X 客户端中的超时重置错误。 [#49863](https://github.com/ClickHouse/ClickHouse/pull/49863) ([alekar](https://github.com/alekar)).
* `bitCount` 函数支持 UInt128、Int128、UInt256 和 Int256 等大整数，从而可为 AI 应用计算大型位掩码之间的汉明距离。 [#49867](https://github.com/ClickHouse/ClickHouse/pull/49867) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 加密磁盘改用指纹代替密钥 ID，简化加密磁盘配置。 [#49882](https://github.com/ClickHouse/ClickHouse/pull/49882) ([Vitaly Baranov](https://github.com/vitlibar)).
* 为 PostgreSQL 新增 UUID 数据类型。关闭 [#49739](https://github.com/ClickHouse/ClickHouse/issues/49739)。 [#49894](https://github.com/ClickHouse/ClickHouse/pull/49894) ([Nikolay Degterinsky](https://github.com/evillique)).
* `toUnixTimestamp` 函数现在接受 `Date` 和 `Date32` 参数。 [#49989](https://github.com/ClickHouse/ClickHouse/pull/49989) ([Victor Krasnov](https://github.com/sirvickr)).
* 字典的内存消耗仅计入服务器级内存。 [#49995](https://github.com/ClickHouse/ClickHouse/pull/49995) ([Azat Khuzhin](https://github.com/azat)).
* 为兼容 MySQL，服务器允许使用 `SQL_AUTO_IS_NULL` 等 `SQL_*` 设置，并将其视为空操作。关闭 [#49927](https://github.com/ClickHouse/ClickHouse/issues/49927)。 [#50013](https://github.com/ClickHouse/ClickHouse/pull/50013) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 为 ON CLUSTER 查询保留 initial\_query\_id，便于内部状态分析（在 `distributed_ddl_entry_format_version=5` 下）。 [#50015](https://github.com/ClickHouse/ClickHouse/pull/50015) ([Azat Khuzhin](https://github.com/azat)).
* 通过别名处理设置重命名带来的向后不兼容问题（`allow_experimental_projection_optimization` 对应 `optimize_use_projections`，`allow_experimental_lightweight_delete` 对应 `enable_lightweight_delete`）。 [#50044](https://github.com/ClickHouse/ClickHouse/pull/50044) ([Azat Khuzhin](https://github.com/azat)).
* 支持通过 my\_hostname 设置传入 FQDN，以在 Keeper 中注册集群节点。新增不可见设置以支持多个计算组：每个计算组作为一个集群，对其他计算组不可见。 [#50186](https://github.com/ClickHouse/ClickHouse/pull/50186) ([Yangkuan Liu](https://github.com/LiuYangkuan)).
* 修复 PostgreSQL 即使可指定 `LIMIT n` 仍读取所有数据的问题。 [#50187](https://github.com/ClickHouse/ClickHouse/pull/50187) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 为带子查询的查询新增性能事件：`QueriesWithSubqueries`/`SelectQueriesWithSubqueries`/`InsertQueriesWithSubqueries`。 [#50204](https://github.com/ClickHouse/ClickHouse/pull/50204) ([Azat Khuzhin](https://github.com/azat)).
* 在 users.xml 中新增 roles 字段，允许通过配置文件指定角色及其授权。 [#50278](https://github.com/ClickHouse/ClickHouse/pull/50278) ([pufit](https://github.com/pufit)).
* 在 AsynchronousMetrics 中报告 `CGroupCpuCfsPeriod` 和 `CGroupCpuCfsQuota`。- 服务器启动时遵循 cgroup v2 的内存限制。 [#50379](https://github.com/ClickHouse/ClickHouse/pull/50379) ([alekar](https://github.com/alekar)).
* 新增 SIGQUIT 信号处理器，使其行为与 SIGINT 相同。关闭 [#50298](https://github.com/ClickHouse/ClickHouse/issues/50298)。 [#50435](https://github.com/ClickHouse/ClickHouse/pull/50435) ([Nikolay Degterinsky](https://github.com/evillique)).
* JSON 因对象过大而解析失败时，输出最后位置以便调试。 [#50474](https://github.com/ClickHouse/ClickHouse/pull/50474) ([Valentin Alexeev](https://github.com/valentinalexeev)).
* 支持非固定大小的 Decimal。关闭 [#49130](https://github.com/ClickHouse/ClickHouse/issues/49130)。 [#50586](https://github.com/ClickHouse/ClickHouse/pull/50586) ([Kruglov Pavel](https://github.com/Avogar)).

<h4 id="buildtestingpackaging-improvement-7">
  构建、测试与打包改进
</h4>

* 改进 `keeper-bench`，所有内容均可通过 YAML/XML 文件自定义：- 请求生成器。- 每种请求生成器可拥有特定字段集。- 在 `multi` 键下进行相同配置即可生成多重请求。- 可为每个请求或多重请求中的子请求定义 `weight` 字段以控制分布。- 定义测试运行前需要建立的树。- 可定义主机并自定义所有超时，还能控制为每个主机生成的会话数。- 通过 `min_value` 和 `max_value` 字段定义的整数表示随机数生成器。 [#48547](https://github.com/ClickHouse/ClickHouse/pull/48547) ([Antonio Andelic](https://github.com/antonio2368)).
* macOS 不支持 io\_uring，因此本地运行测试时不选择它，以避免偶发失败。 [#49250](https://github.com/ClickHouse/ClickHouse/pull/49250) ([Frank Chen](https://github.com/FrankChen021)).
* 支持用于测试的命名故障注入。 [#49361](https://github.com/ClickHouse/ClickHouse/pull/49361) ([Han Fei](https://github.com/hanfei1991)).
* 允许在不提供 `prctl`（进程控制）系统调用的操作系统环境中运行 ClickHouse，例如 AWS Lambda。 [#49538](https://github.com/ClickHouse/ClickHouse/pull/49538) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复 contrib/isa-l 与 QPL 中 isa-l 的构建冲突 [49296](https://github.com/ClickHouse/ClickHouse/issues/49296)。 [#49584](https://github.com/ClickHouse/ClickHouse/pull/49584) ([jasperzhu](https://github.com/jinjunzh)).
* 实用工具现在仅在显式请求（“-DENABLE\_UTILS=1”）时构建，不再默认构建，从而减少典型开发构建的链接时间。 [#49620](https://github.com/ClickHouse/ClickHouse/pull/49620) ([Robert Schulze](https://github.com/rschu1ze)).
* 将 idxd-config 的构建描述提取到独立 CMake 文件，避免未来被意外移除。 [#49651](https://github.com/ClickHouse/ClickHouse/pull/49651) ([jasperzhu](https://github.com/jinjunzh)).
* 在 master 中新增启用分析器的 CI 检查。后续工作 [#49562](https://github.com/ClickHouse/ClickHouse/issues/49562)。 [#49668](https://github.com/ClickHouse/ClickHouse/pull/49668) ([Dmitry Novik](https://github.com/novikd)).
* 切换到 LLVM/clang 16。 [#49678](https://github.com/ClickHouse/ClickHouse/pull/49678) ([Azat Khuzhin](https://github.com/azat)).
* 允许使用 clang-17 构建 ClickHouse。 [#49851](https://github.com/ClickHouse/ClickHouse/pull/49851) ([Alexey Milovidov](https://github.com/alexey-milovidov)). [#50410](https://github.com/ClickHouse/ClickHouse/pull/50410) ([Alexey Milovidov](https://github.com/alexey-milovidov))。
* ClickHouse 现在更容易集成到其他 CMake 项目中。（强烈不建议这样做——Alexey Milovidov。） [#49991](https://github.com/ClickHouse/ClickHouse/pull/49991) ([Amos Bird](https://github.com/amosbird)).
* 修复 [#47151](https://github.com/ClickHouse/ClickHouse/issues/47151) 之后 QEMU 输出奇怪额外日志的问题。 [#50442](https://github.com/ClickHouse/ClickHouse/pull/50442) ([Mikhail f. Shiryaev](https://github.com/Felixoid)).
* ClickHouse 可在 Linux RISC-V 6.1.22 上运行。关闭 [#50456](https://github.com/ClickHouse/ClickHouse/issues/50456)。 [#50457](https://github.com/ClickHouse/ClickHouse/pull/50457) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 将内部 protobuf 升级到 v3.18，消除 CVE-2022-1941 误报。 [#50400](https://github.com/ClickHouse/ClickHouse/pull/50400) ([Robert Schulze](https://github.com/rschu1ze)).
* 将内部 libxml2 升级到 v2.10.4，消除 CVE-2023-28484 和 CVE-2023-29469 误报。 [#50402](https://github.com/ClickHouse/ClickHouse/pull/50402) ([Robert Schulze](https://github.com/rschu1ze)).
* 将 c-ares 升级到 v1.19.1，消除 CVE-2023-32067、CVE-2023-31130、CVE-2023-31147 误报。 [#50403](https://github.com/ClickHouse/ClickHouse/pull/50403) ([Robert Schulze](https://github.com/rschu1ze)).
* 消除 libgsasl 中的 CVE-2022-2469 误报。 [#50404](https://github.com/ClickHouse/ClickHouse/pull/50404) ([Robert Schulze](https://github.com/rschu1ze)).

<h4 id="bug-fix-user-visible-misbehavior-in-an-official-stable-release-7">
  缺陷修复（正式稳定版本中用户可见的异常行为）
</h4>

* ActionsDAG：修复错误优化。 [#47584](https://github.com/ClickHouse/ClickHouse/pull/47584) ([Salvatore Mesoraca](https://github.com/aiven-sal)).
* 正确处理 Keeper 中的并发快照。 [#48466](https://github.com/ClickHouse/ClickHouse/pull/48466) ([Antonio Andelic](https://github.com/antonio2368)).
* MergeTreeMarksLoader 持有 DataPart 而非 DataPartStorage。 [#48515](https://github.com/ClickHouse/ClickHouse/pull/48515) ([SmitaRKulkarni](https://github.com/SmitaRKulkarni)).
* 修复序列状态。 [#48603](https://github.com/ClickHouse/ClickHouse/pull/48603) ([Ilya Golshtein](https://github.com/ilejn)).
* 修复此前失败情况下的备份/恢复并发检查。 [#48726](https://github.com/ClickHouse/ClickHouse/pull/48726) ([SmitaRKulkarni](https://github.com/SmitaRKulkarni)).
* 修复挂载 ZooKeeper 路径不存在的表时未增加 ReadonlyReplica 指标的问题。 [#48954](https://github.com/ClickHouse/ClickHouse/pull/48954) ([wangxiaobo](https://github.com/wzb5212)).
* 修复某些位置因未捕获异常而可能调用 terminate 的问题。 [#49112](https://github.com/ClickHouse/ClickHouse/pull/49112) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复使用多个 StorageJoin 的查询出现键不存在错误的问题。 [#49137](https://github.com/ClickHouse/ClickHouse/pull/49137) ([vdimir](https://github.com/vdimir)).
* 修复使用可空主键时查询结果错误的问题。 [#49172](https://github.com/ClickHouse/ClickHouse/pull/49172) ([Duc Canh Le](https://github.com/canhld94)).
* 修复大端序机器上的 reinterpretAs\*()。 [#49198](https://github.com/ClickHouse/ClickHouse/pull/49198) ([Suzy Wang](https://github.com/SuzyWangIBMer)).
* （实验性零复制机制）以更具原子性的方式锁定零复制数据片段。 [#49211](https://github.com/ClickHouse/ClickHouse/pull/49211) ([alesapin](https://github.com/alesapin)).
* 修复 Outdated 数据片段加载中的竞态条件。 [#49223](https://github.com/ClickHouse/ClickHouse/pull/49223) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 修复所有键值均为 null 且分组使用 ROLLUP 时返回错误结果的问题。 [#49282](https://github.com/ClickHouse/ClickHouse/pull/49282) ([Shuai li](https://github.com/loneylee)).
* 修复带 SHARDS 的 HASHED 字典的 load\_factor 计算。 [#49319](https://github.com/ClickHouse/ClickHouse/pull/49319) ([Azat Khuzhin](https://github.com/azat)).
* 禁止为别名列配置压缩 CODEC。 [#49363](https://github.com/ClickHouse/ClickHouse/pull/49363) ([Timur Solodovnikov](https://github.com/tsolodov)).
* 修复移除已存在数据片段目录时的问题。 [#49365](https://github.com/ClickHouse/ClickHouse/pull/49365) ([alesapin](https://github.com/alesapin)).
* 正确修复使用 HMAC 时的 GCS 行为。 [#49390](https://github.com/ClickHouse/ClickHouse/pull/49390) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复从 remote() 读取时未构建子查询集合的模糊测试问题。 [#49425](https://github.com/ClickHouse/ClickHouse/pull/49425) ([Alexander Gololobov](https://github.com/davenger)).
* 反转 `shutdown_wait_unfinished_queries` 的逻辑。 [#49427](https://github.com/ClickHouse/ClickHouse/pull/49427) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* （实验性零复制机制）修复另一项零复制问题。 [#49473](https://github.com/ClickHouse/ClickHouse/pull/49473) ([alesapin](https://github.com/alesapin)).
* 修复 PostgreSQL 数据库设置。 [#49481](https://github.com/ClickHouse/ClickHouse/pull/49481) ([Mal Curtis](https://github.com/snikch)).
* 正确处理 `s3Cluster` 参数。 [#49490](https://github.com/ClickHouse/ClickHouse/pull/49490) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复 TraceCollector 析构函数中的缺陷。 [#49508](https://github.com/ClickHouse/ClickHouse/pull/49508) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* 修复 AsynchronousReadIndirectBufferFromRemoteFS 在短距离跳转时失效的问题。 [#49525](https://github.com/ClickHouse/ClickHouse/pull/49525) ([Michael Kolupaev](https://github.com/al13n321)).
* 修复字典加载顺序。 [#49560](https://github.com/ClickHouse/ClickHouse/pull/49560) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 禁止更改 Object('json') 列的数据类型。 [#49563](https://github.com/ClickHouse/ClickHouse/pull/49563) ([Nikolay Degterinsky](https://github.com/evillique)).
* 修复压力测试问题（Logical error: Expected 7134 >= 11030）。 [#49623](https://github.com/ClickHouse/ClickHouse/pull/49623) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复 DISTINCT 中的缺陷。 [#49628](https://github.com/ClickHouse/ClickHouse/pull/49628) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复非排序列包含零值时的有序 DISTINCT。 [#49636](https://github.com/ClickHouse/ClickHouse/pull/49636) ([Igor Nikonov](https://github.com/devcrafter)).
* 修复模糊测试中 UBSan 发现的大整数差一错误。 [#49645](https://github.com/ClickHouse/ClickHouse/pull/49645) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复重启后读取稀疏列的问题。 [#49660](https://github.com/ClickHouse/ClickHouse/pull/49660) ([Anton Popov](https://github.com/CurtizJ)).
* 修复使用纤程时 SpanHolder::finish() 中的断言。 [#49673](https://github.com/ClickHouse/ClickHouse/pull/49673) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复带稀疏参数的短路函数和变更操作。 [#49716](https://github.com/ClickHouse/ClickHouse/pull/49716) ([Anton Popov](https://github.com/CurtizJ)).
* 修复向增量备份写入追加文件的问题。 [#49725](https://github.com/ClickHouse/ClickHouse/pull/49725) ([Vitaly Baranov](https://github.com/vitlibar)).
* 修复对包含 Object 列的表执行轻量级删除变更操作时出现的 “There is no physical column \_row\_exists in table” 错误。 [#49737](https://github.com/ClickHouse/ClickHouse/pull/49737) ([Alexander Gololobov](https://github.com/davenger)).
* 修复 randomStringUTF8(uneven number) 中的 MSan 问题。 [#49750](https://github.com/ClickHouse/ClickHouse/pull/49750) ([Robert Schulze](https://github.com/rschu1ze)).
* 修复聚合函数 kolmogorovSmirnovTest。 [#49768](https://github.com/ClickHouse/ClickHouse/pull/49768) ([FFFFFFFHHHHHHH](https://github.com/FFFFFFFHHHHHHH)).
* 修复原生协议中的设置别名。 [#49776](https://github.com/ClickHouse/ClickHouse/pull/49776) ([Azat Khuzhin](https://github.com/azat)).
* 修复 `arrayMap` 处理单参数元组数组的问题。 [#49789](https://github.com/ClickHouse/ClickHouse/pull/49789) ([Anton Popov](https://github.com/CurtizJ)).
* 修复按查询的 IO/备份限速设置。 [#49797](https://github.com/ClickHouse/ClickHouse/pull/49797) ([Azat Khuzhin](https://github.com/azat)).
* 修复在配置档定义中设置 NULL 的问题。 [#49831](https://github.com/ClickHouse/ClickHouse/pull/49831) ([Vitaly Baranov](https://github.com/vitlibar)).
* 修复投影与 aggregate\_functions\_null\_for\_empty 设置组合使用时的问题（针对 query\_plan\_optimize\_projection）。 [#49873](https://github.com/ClickHouse/ClickHouse/pull/49873) ([Amos Bird](https://github.com/amosbird)).
* 修复重启后处理 Distributed 异步 INSERT 待处理批次的问题。 [#49884](https://github.com/ClickHouse/ClickHouse/pull/49884) ([Azat Khuzhin](https://github.com/azat)).
* 修复 CacheMetadata::doCleanup 中的断言。 [#49914](https://github.com/ClickHouse/ClickHouse/pull/49914) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复 OptimizeRegularExpression 中的 `is_prefix`。 [#49919](https://github.com/ClickHouse/ClickHouse/pull/49919) ([Han Fei](https://github.com/hanfei1991)).
* 修复 `WriteBufferFromS3Bytes`、`WriteBufferFromS3Microseconds` 和 `WriteBufferFromS3RequestsErrors` 指标。 [#49930](https://github.com/ClickHouse/ClickHouse/pull/49930) ([Aleksandr Musorin](https://github.com/AVMusorin)).
* 修复 Protobuf 中的 IPv6 编码。 [#49933](https://github.com/ClickHouse/ClickHouse/pull/49933) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* 修复文本格式错误解析 Nullable 时可能出现的逻辑错误。 [#49960](https://github.com/ClickHouse/ClickHouse/pull/49960) ([Kruglov Pavel](https://github.com/Avogar)).
* 新增 output\_format\_parquet\_compliant\_nested\_types 设置，以生成兼容性更好的 Parquet 文件。 [#50001](https://github.com/ClickHouse/ClickHouse/pull/50001) ([Michael Kolupaev](https://github.com/al13n321)).
* 修复压力测试中的逻辑错误 “Not enough space to add ...”。 [#50021](https://github.com/ClickHouse/ClickHouse/pull/50021) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 避免在 `ReplicatedMergeTree` 挂载线程中启动表时发生死锁。 [#50026](https://github.com/ClickHouse/ClickHouse/pull/50026) ([Antonio Andelic](https://github.com/antonio2368)).
* 再次尝试修复使用纤程时 SpanHolder::finish() 中的断言。 [#50034](https://github.com/ClickHouse/ClickHouse/pull/50034) ([Kruglov Pavel](https://github.com/Avogar)).
* 为 DDL OpenTelemetry 上下文序列化添加正确转义。 [#50045](https://github.com/ClickHouse/ClickHouse/pull/50045) ([Azat Khuzhin](https://github.com/azat)).
* 修复损坏投影数据片段的报告。 [#50052](https://github.com/ClickHouse/ClickHouse/pull/50052) ([Amos Bird](https://github.com/amosbird)).
* 修复 JIT 编译中 NaN 的不等比较。 [#50056](https://github.com/ClickHouse/ClickHouse/pull/50056) ([Maksim Kita](https://github.com/kitaisreal)).
* 修复 Replicated 数据库不带参数时的崩溃。 [#50058](https://github.com/ClickHouse/ClickHouse/pull/50058) ([Azat Khuzhin](https://github.com/azat)).
* 修复 `multiIf` 使用常量条件和可空参数时的崩溃。 [#50123](https://github.com/ClickHouse/ClickHouse/pull/50123) ([Anton Popov](https://github.com/CurtizJ)).
* 修复日期相关键的无效索引分析。 [#50153](https://github.com/ClickHouse/ClickHouse/pull/50153) ([Amos Bird](https://github.com/amosbird)).
* 没有 ORDER BY 列时，不允许修改 ORDER BY。 [#50154](https://github.com/ClickHouse/ClickHouse/pull/50154) ([Han Fei](https://github.com/hanfei1991)).
* 修复二元运算符包含 null 常量参数时的索引分析。 [#50177](https://github.com/ClickHouse/ClickHouse/pull/50177) ([Amos Bird](https://github.com/amosbird)).
* clickhouse-client：禁止同时使用 `--query` 和 `--queries-file`。 [#50210](https://github.com/ClickHouse/ClickHouse/pull/50210) ([Alexey Gerasimchuk](https://github.com/Demilivor)).
* 修复 INTO OUTFILE 扩展（APPEND / AND STDOUT）和 WATCH EVENTS 的未定义行为。 [#50216](https://github.com/ClickHouse/ClickHouse/pull/50216) ([Azat Khuzhin](https://github.com/azat)).
* 修复 CustomSeparatedIgnoreSpaces 格式跳过行尾空格的问题。 [#50224](https://github.com/ClickHouse/ClickHouse/pull/50224) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复 Iceberg 元数据解析。 [#50232](https://github.com/ClickHouse/ClickHouse/pull/50232) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复 WITH 子句中嵌套的分布式 SELECT。 [#50234](https://github.com/ClickHouse/ClickHouse/pull/50234) ([Azat Khuzhin](https://github.com/azat)).
* 修复带密钥 SipHash 中的 MSan 问题。 [#50245](https://github.com/ClickHouse/ClickHouse/pull/50245) ([Robert Schulze](https://github.com/rschu1ze)).
* 修复 Poco 套接字非阻塞模式中的缺陷，使用真正的非阻塞套接字。 [#50252](https://github.com/ClickHouse/ClickHouse/pull/50252) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复备份条目的校验和计算。 [#50264](https://github.com/ClickHouse/ClickHouse/pull/50264) ([Vitaly Baranov](https://github.com/vitlibar)).
* 修复比较函数中的 NaN 处理。 [#50287](https://github.com/ClickHouse/ClickHouse/pull/50287) ([Maksim Kita](https://github.com/kitaisreal)).
* 修复 JIT 聚合中的可空键。 [#50291](https://github.com/ClickHouse/ClickHouse/pull/50291) ([Maksim Kita](https://github.com/kitaisreal)).
* 修复 clickhouse-local 写入空 Arrow 或 Parquet 输出时的崩溃。 [#50328](https://github.com/ClickHouse/ClickHouse/pull/50328) ([Michael Kolupaev](https://github.com/al13n321)).
* 修复调用 Pool::Entry::disconnect() 时的崩溃。 [#50334](https://github.com/ClickHouse/ClickHouse/pull/50334) ([Val Doroshchuk](https://github.com/valbok)).
* 通过延长持有目录锁的时间改善数据片段拉取。 [#50339](https://github.com/ClickHouse/ClickHouse/pull/50339) ([SmitaRKulkarni](https://github.com/SmitaRKulkarni)).
* 修复两个参数均为常量时的 bitShift\* 函数。 [#50343](https://github.com/ClickHouse/ClickHouse/pull/50343) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复 Keeper 预处理请求时出现异常导致的死锁。 [#50387](https://github.com/ClickHouse/ClickHouse/pull/50387) ([frinkr](https://github.com/frinkr)).
* 修复常量整数值的哈希计算。 [#50421](https://github.com/ClickHouse/ClickHouse/pull/50421) ([Robert Schulze](https://github.com/rschu1ze)).
* 修复数据跳过索引的 merge\_tree\_min\_rows\_for\_seek/merge\_tree\_min\_bytes\_for\_seek 设置。 [#50432](https://github.com/ClickHouse/ClickHouse/pull/50432) ([Azat Khuzhin](https://github.com/azat)).
* 限制加载过期数据片段时正在执行的任务数量。 [#50450](https://github.com/ClickHouse/ClickHouse/pull/50450) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* Keeper 修复：安装快照后应用未提交状态。 [#50483](https://github.com/ClickHouse/ClickHouse/pull/50483) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复错误的常量折叠。 [#50536](https://github.com/ClickHouse/ClickHouse/pull/50536) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复压力测试中的逻辑错误（Not enough space to add ...）。 [#50583](https://github.com/ClickHouse/ClickHouse/pull/50583) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复 values 表函数中从 Null 转换为 LowCardinality(Nullable) 的问题。 [#50637](https://github.com/ClickHouse/ClickHouse/pull/50637) ([Kruglov Pavel](https://github.com/Avogar)).
* 回退无效的 RegExpTreeDictionary 优化。 [#50642](https://github.com/ClickHouse/ClickHouse/pull/50642) ([Johann Gan](https://github.com/johanngan)).
