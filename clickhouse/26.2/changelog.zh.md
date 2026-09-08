<h3 id="262">
  ClickHouse 26.2 版本，2026-02-26。[演示文稿](https://presentations.clickhouse.com/2026-release-26.2/)，[视频](https://www.youtube.com/watch?v=7qHba08vNfo)
</h3>

<h4 id="262-backward-incompatible-change">
  向后不兼容变更
</h4>

* 现在默认对所有插入启用去重。此前异步插入和物化视图（MV）默认关闭去重，而同步插入默认开启；本次变更旨在统一两种插入方式的默认值。如果集群显式禁用了去重，需要显式设置 `deduplicate_insert='backward_compatible_choice'` 才能保留旧行为，`deduplicate_blocks_in_dependent_materialized_views` 同理。[#95970](https://github.com/ClickHouse/ClickHouse/pull/95970)（[Sema Checherinda](https://github.com/CheSema)）。
* 改进统计信息的存储格式。现在所有统计信息都存储在单个文件中。[#93414](https://github.com/ClickHouse/ClickHouse/pull/93414)（[Anton Popov](https://github.com/CurtizJ)）。如果没有显式启用表统计信息，可以忽略此项。
* 限制 S3(Azure)Queue 的内存元数据。系统表 `azure_queue` 重命名为 `azure_queue_metadata_cache`，`system.s3queue` 重命名为 `s3queue_metadata_cache`。[#95809](https://github.com/ClickHouse/ClickHouse/pull/95809)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 此前，对 `Variant` 列应用函数时，如果某个变体子类型与函数不兼容，会静默返回 NULL；现在会抛出异常。这可能会破坏依赖静默返回 NULL 行为的查询。[#95811](https://github.com/ClickHouse/ClickHouse/pull/95811)（[Bharat Nallan](https://github.com/bharatnc)）。
* PostgreSQL 的 `DATE` 列现在会在 ClickHouse 中推断为 `Date32`（旧版本推断为 `Date`，狭窄范围之外的值会溢出）。同时允许将 `Date32` 值写回 PostgreSQL。关闭 [#73084](https://github.com/ClickHouse/ClickHouse/issues/73084)。[#95999](https://github.com/ClickHouse/ClickHouse/pull/95999)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 明确了 `do_not_merge_across_partitions_select_final` 设置的语义。此前未在配置中显式设置时，该功能可能自动启用，反复造成困惑，并在生产环境引发问题。现在规则更简单：`do_not_merge_across_partitions_select_final=1` 无条件启用该功能；若为 `0`，仅当新设置 `enable_automatic_decision_for_merging_across_partitions_for_final=1` 时才自动决策，否则不使用。为尽量保留旧行为，默认值分别设为 `0` 和 `1`。[#96110](https://github.com/ClickHouse/ClickHouse/pull/96110)（[Nikita Taranov](https://github.com/nickitat)）。
* 创建显式指定列的 S3 表时，ClickHouse 现在会验证这些列名是否确实存在于远端文件的 Schema 中。此前列名不匹配仍可工作的查询，现在会在建表时失败。关闭 [#96089](https://github.com/ClickHouse/ClickHouse/issues/96089)。[#96194](https://github.com/ClickHouse/ClickHouse/pull/96194)（[Konstantin Vedernikov](https://github.com/scanhex12)）。
* 禁止在 ORDER BY 和其他表键表达式中使用子查询。[#96847](https://github.com/ClickHouse/ClickHouse/pull/96847)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 默认启用 `apply_row_policy_after_final`。最初在 `optimize_move_to_prewhere_if_final=0` 时，ROW POLICY 与 PREWHERE 都遵循 FINAL，并在 FINAL 之后应用。[#87303](https://github.com/ClickHouse/ClickHouse/issues/87303) 破坏了这一行为，使 ROW POLICY 过滤器忽略 `optimize_move_to_prewhere_if_final`。为修复此问题，本 PR 启用 [#91065](https://github.com/ClickHouse/ClickHouse/issues/91065) 引入的 `apply_row_policy_after_final`。启用后，ROW POLICY 默认会像以前一样继续遵循 FINAL。此变更会改变 `optimize_move_to_prewhere_if_final=1` 时的行为，因此不向后兼容。现在若要在 FINAL 前应用 ROW POLICY，应使用 `apply_row_policy_after_final`，而不是 `optimize_move_to_prewhere_if_final`。[#97279](https://github.com/ClickHouse/ClickHouse/pull/97279)（[Nikolai Kochetov](https://github.com/KochetovNicolai)）。
* 在 Arrow/ArrowStream 格式中，`Date` 类型现在序列化为 Arrow 原生 `date32`，而非 `uint16`。PyArrow 等工具现在能正确识别日期列。可通过 `output_format_arrow_date_as_uint16` 恢复旧行为；仍支持读取以 `uint16` 存储 `Date` 列的旧 Arrow 文件。[#96860](https://github.com/ClickHouse/ClickHouse/pull/96860)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。

<h4 id="262-new-feature">
  新功能
</h4>

* 用户现在可以直接从 ClickHouse 使用 ClickStack（可观测性 UI），便于调试和本地开发。[#96597](https://github.com/ClickHouse/ClickHouse/pull/96597)（[Aaron Knudtson](https://github.com/knudtty)）。
* 支持以基于时间的一次性密码（TOTP）作为认证方式。[#71273](https://github.com/ClickHouse/ClickHouse/pull/71273)（[Vladimir Cherkasov](https://github.com/vdimir)）。
* 新增数据库设置 `lazy_load_tables`。启用后，数据库启动时不会加载表，而是创建轻量级 `StorageTableProxy`，在首次访问时才实例化真正的表引擎。[#96283](https://github.com/ClickHouse/ClickHouse/pull/96283)（[xiaohuanlin](https://github.com/xiaohuanlin)）。
* 新增 `input_format_max_block_wait_ms` 设置，可在超时后输出数据块，并允许在 HTTP 连接意外关闭时处理剩余数据。[#94509](https://github.com/ClickHouse/ClickHouse/pull/94509)（[Mostafa Mohamed Salah](https://github.com/Sasao4o)）。
* 集成 Google BigLake Catalog。关闭 [#95339](https://github.com/ClickHouse/ClickHouse/issues/95339)。[#97104](https://github.com/ClickHouse/ClickHouse/pull/97104)（[Konstantin Vedernikov](https://github.com/scanhex12)）。
* 新增系统表 `system.tokenizers`，显示所有可用的分词器。[#96753](https://github.com/ClickHouse/ClickHouse/pull/96753)（[Robert Schulze](https://github.com/rschu1ze)）。
* 新增系统表 `system.user_defined_functions`，用于监控 UDF 的加载状态与配置。[#90340](https://github.com/ClickHouse/ClickHouse/pull/90340)（[Xu Jia](https://github.com/XuJia0210)）。
* 新增 `system.jemalloc_stats` 表，通过 `malloc_stats_print` 暴露 jemalloc 内存分配器统计信息，用于诊断采用 jemalloc 构建的服务器的内存使用情况。同时在 ClickHouse HTTP 接口新增 `/jemalloc.html` 端点，以交互方式可视化这些统计信息。[#97077](https://github.com/ClickHouse/ClickHouse/pull/97077)（[Antonio Andelic](https://github.com/antonio2368)）。
* 新增 `system.jemalloc_profile_text` 表，用于读取和分析 jemalloc 堆分析数据。输出格式由 `jemalloc_profile_text_output_format` 控制（raw、symbolized 或 collapsed，默认为 collapsed）。内联帧解析由 `jemalloc_profile_text_symbolize_with_inline` 控制：启用时会包含内联帧，但符号化速度较慢；禁用时跳过内联帧以加快输出。对 collapsed 格式，`jemalloc_profile_text_collapsed_use_count` 控制堆栈按活动分配次数（true）还是活动字节数（false，默认）加权。这使 jemalloc 堆的内存分析与火焰图可视化更加便捷。修复 [#93248](https://github.com/ClickHouse/ClickHouse/issues/93248)。[#97218](https://github.com/ClickHouse/ClickHouse/pull/97218)（[Antonio Andelic](https://github.com/antonio2368)）。
* 新增 `default_dictionary_database` 设置，使 ClickHouse 可以在指定的默认数据库中解析未带数据库限定符的外部字典引用。这简化了从 XML 定义的全局字典迁移到 SQL 定义的按数据库字典的过程，现有字典查询（如 `dictGet('name', …)`）无需修改即可继续工作。[#91412](https://github.com/ClickHouse/ClickHouse/pull/91412)（[Dmitrii Plotnikov](https://github.com/dimbo4ka)）。
* `DatabaseReplicated` 支持辅助 ZooKeeper。[#91683](https://github.com/ClickHouse/ClickHouse/pull/91683)（[RinChanNOW](https://github.com/RinChanNOWWW)）。
* 实现新的 `primes` 表函数和按升序包含质数的 `system.primes` 系统表。关闭 [#90839](https://github.com/ClickHouse/ClickHouse/issues/90839)。[#92776](https://github.com/ClickHouse/ClickHouse/pull/92776)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 异步插入支持并行 quorum。插入的数据会复制到满足 quorum 的副本数；如果发现重复项，查询会等待此前插入的数据也完成复制。[#93356](https://github.com/ClickHouse/ClickHouse/pull/93356)（[Sema Checherinda](https://github.com/CheSema)）。
* 新增 `colorOKLABToSRGB`、`colorSRGBToOKLAB` 函数，在 sRGB 与 OKLAB 之间双向转换数值。[#93361](https://github.com/ClickHouse/ClickHouse/pull/93361)（[Pranav Tiwari](https://github.com/pranavt84)）。
* 新增 `deduplicate_insert` 设置，覆盖 `insert_deduplicate` 和 `async_insert_deduplicate`。[#94413](https://github.com/ClickHouse/ClickHouse/pull/94413)（[Sema Checherinda](https://github.com/CheSema)）。
* 服务器设置 `insert_deduplication_version` 支持迁移到统一的去重哈希。[#95409](https://github.com/ClickHouse/ClickHouse/pull/95409)（[Sema Checherinda](https://github.com/CheSema)）。
* 新增 `xxh3_128` 哈希函数。[#96055](https://github.com/ClickHouse/ClickHouse/pull/96055)（[Raúl Marín](https://github.com/Algunenano)）。
* 新增 `OPTIMIZE <table> DRY RUN PARTS <part names>` 查询，可模拟合并但不提交结果数据片段。它适合用于测试：验证新版本的合并正确性、确定性复现合并相关缺陷，以及可靠地对合并性能进行基准测试。[#96122](https://github.com/ClickHouse/ClickHouse/pull/96122)（[Anton Popov](https://github.com/CurtizJ)）。
* 新增由 `check_named_collection_dependencies` 设置控制且默认启用的检查，避免删除被表使用的命名集合。[#96181](https://github.com/ClickHouse/ClickHouse/pull/96181)（[Pablo Marcos](https://github.com/pamarcos)）。
* 新增 `system.fail_points`，用于检查服务器中现有的 failpoint 及其启用状态，有助于自动化测试。[#96762](https://github.com/ClickHouse/ClickHouse/pull/96762)（[Pedro Ferreira](https://github.com/PedroTadim)）。
* Glue Catalog 新增基于角色的访问。使用 `aws_role_arn` 设置，并可选配置 `aws_role_session_name`。[#90825](https://github.com/ClickHouse/ClickHouse/pull/90825)（[Antonio Andelic](https://github.com/antonio2368)）。
* 新增 `add_minmax_index_for_temporal_columns` 设置；启用后，会为所有 `Date`、`Date32`、`Time`、`Time64`、`DateTime` 和 `DateTime64` 列自动创建 minmax 索引。[#93355](https://github.com/ClickHouse/ClickHouse/pull/93355)（[Michael Jarrett](https://github.com/EmeraldShift)）。
* JOIN 支持扩展表别名（例如 `SELECT * FROM (SELECT 1) AS t(a) JOIN (SELECT 1) AS u(b) ON a = b`）。关闭 [#95131](https://github.com/ClickHouse/ClickHouse/issues/95131)。[#95331](https://github.com/ClickHouse/ClickHouse/pull/95331)（[Yarik Briukhovetskyi](https://github.com/yariks5s)）。
* Iceberg 表新增对 `ALTER TABLE RENAME COLUMN` 的支持；此前仅支持 `ADD COLUMN`、`DROP COLUMN` 和 `MODIFY COLUMN`。[#97455](https://github.com/ClickHouse/ClickHouse/pull/97455)（[murphy-4o](https://github.com/murphy-4o)）。

<h4 id="262-experimental-feature">
  实验性功能
</h4>

* 文本索引现已正式可用（GA）。[#96794](https://github.com/ClickHouse/ClickHouse/pull/96794)（[Robert Schulze](https://github.com/rschu1ze)）。
* 用于量化位压缩向量存储（近似最近邻搜索）的 `QBit` 数据类型现已正式可用，不再需要启用实验性设置。[#95358](https://github.com/ClickHouse/ClickHouse/pull/95358)（[Raufs Dunamalijevs](https://github.com/rienath)）。
* ClickHouse 向量搜索现在可以利用集群副本来*分摊*负载并搜索向量索引数据片段，从而支持超出单台虚拟机内存容量的大型向量索引。[#95876](https://github.com/ClickHouse/ClickHouse/pull/95876)（[Shankar Iyer](https://github.com/shankar-iyer)）。
* 新增由 `ast_fuzzer_runs` 和 `ast_fuzzer_any_query` 设置控制的服务端 AST 模糊测试器。启用后，服务器会在查询正常执行完毕后对其运行随机变异，并丢弃结果。[#97568](https://github.com/ClickHouse/ClickHouse/pull/97568)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 实验性 KQL 方言新增 `iif` 函数。[#94790](https://github.com/ClickHouse/ClickHouse/pull/94790)（[happyso](https://github.com/sunyeongchoi)）。
* Schema 推断现在遵循 `allow_experimental_nullable_tuple_type`。启用后，推断出的元组类型可以是 `Nullable(Tuple(...))`，因此缺失的嵌套对象可变为 `NULL`，而不是由多个 `NULL` 元素组成的元组。[#95525](https://github.com/ClickHouse/ClickHouse/pull/95525)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* `use_statistics_cache` 设置现在默认启用，列统计信息会缓存在内存中，以加快查询优化，无需从每个数据片段重新加载。[#95950](https://github.com/ClickHouse/ClickHouse/pull/95950)（[Han Fei](https://github.com/hanfei1991)）。

<h4 id="262-performance-improvement">
  性能改进
</h4>

* 允许使用主键中的任意确定性表达式进行数据跳过（如 `ORDER BY cityHash64(user_id)`、`ORDER BY length(user_id)`）。ClickHouse 可将确定性表达式应用于查询常量，并在 `=`、`IN`、`has` 等谓词中使用其结果查找主键索引。如果表达式还具有单射性（如 `ORDER BY hex(p)` 或 `ORDER BY reverse(tuple(reverse(p), hex(p)))`），则也能有效利用索引处理 `!=`、`NOT IN`、`NOT has` 等否定形式。关闭 [#10685](https://github.com/ClickHouse/ClickHouse/issues/10685)、[#82161](https://github.com/ClickHouse/ClickHouse/issues/82161)。[#92952](https://github.com/ClickHouse/ClickHouse/pull/92952)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 改进统计信息存储格式；现在所有统计信息都存储在单个文件中。[#93414](https://github.com/ClickHouse/ClickHouse/pull/93414)（[Anton Popov](https://github.com/CurtizJ)）。
* 文件系统缓存允许对远程表引擎/表函数执行并行读取。[#71781](https://github.com/ClickHouse/ClickHouse/pull/71781)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 本地文件和对象存储表函数允许使用用户态页缓存。[#77874](https://github.com/ClickHouse/ClickHouse/pull/77874)（[Michael Kolupaev](https://github.com/al13n321)）。
* 避免用户态页缓存中不必要的 `memcpy`。[#77884](https://github.com/ClickHouse/ClickHouse/pull/77884)（[Michael Kolupaev](https://github.com/al13n321)）。
* `concurrent_threads_scheduler` 默认值由 `fair_round_robin` 改为 `max_min_fair`。高负载下会优先调度已分配槽位较少的查询，从而提高公平性，避免短查询被长查询拖慢。[#95300](https://github.com/ClickHouse/ClickHouse/pull/95300)（[Sergei Trifonov](https://github.com/serxa)）。
* 当 `FINAL` 查询先使用主键条件过滤、再对其他条件使用跳数索引时，`PrimaryKeyExpand` 处理步骤现在仅检查初步筛选出的主键范围是否相交。[#94903](https://github.com/ClickHouse/ClickHouse/pull/94903)（[Shankar Iyer](https://github.com/shankar-iyer)）。
* 对 `s3(...)` 等表函数使用并行副本时，仅用一个子查询包装表函数的查询现在也会自动跨副本并行执行；此前仅直接引用表函数时才会并行。关闭 [#92264](https://github.com/ClickHouse/ClickHouse/issues/92264)。[#96332](https://github.com/ClickHouse/ClickHouse/pull/96332)（[phulv94](https://github.com/phulv94)）。
* 支持将缓存中的数据文件与系统文件拆分到不同分段。[#87834](https://github.com/ClickHouse/ClickHouse/pull/87834)（[MikhailBurdukov](https://github.com/MikhailBurdukov)）。
* 为 `ColumnVector::replicate` 实现动态分派，加速部分 Hash Join 操作。[#79573](https://github.com/ClickHouse/ClickHouse/pull/79573)（[Raúl Marín](https://github.com/Algunenano)）。
* 提升复杂谓词场景下并行 Hash Join 的性能。此前未匹配行仅由单线程处理；现在会跨多个线程并行处理。可通过 `parallel_non_joined_rows_processing` 控制，默认启用。[#92068](https://github.com/ClickHouse/ClickHouse/pull/92068)（[Yarik Briukhovetskyi](https://github.com/yariks5s)）。
* 小幅优化 JSON 类型的解析。[#93614](https://github.com/ClickHouse/ClickHouse/pull/93614)（[Pavel Kruglov](https://github.com/Avogar)）。
* 减少 AST 的内存占用；在不使用语法高亮且无需解析 VALUES 时，不再保留未使用字段。[#93974](https://github.com/ClickHouse/ClickHouse/pull/93974)（[Ilya Yatsishin](https://github.com/qoega)）。
* 优化具名 Tuple AST 对象的内存占用：将列名作为字符串直接存放在元组对象中，而非通用 AST 字面量节点。[#94704](https://github.com/ClickHouse/ClickHouse/pull/94704)（[Ilya Yatsishin](https://github.com/qoega)）。
* 通过额外的链接器选项改进去虚拟化。[#94737](https://github.com/ClickHouse/ClickHouse/pull/94737)（[Nikita Taranov](https://github.com/nickitat)）。
* 通过批处理 ZooKeeper 请求，提高包含大量数据片段的 ReplicatedMergeTree 表克隆副本的性能。[#94847](https://github.com/ClickHouse/ClickHouse/pull/94847)（[c-end](https://github.com/c-end)）。
* 读取步骤已有 PREWHERE 过滤器时，过去无法再添加新过滤器。本次变更将 PREWHERE 优化推迟到 JOIN 运行时过滤器优化之后，使运行时过滤器也能下推到 PREWHERE。[#95838](https://github.com/ClickHouse/ClickHouse/pull/95838)（[Alexander Gololobov](https://github.com/davenger)）。
* 在 x86 上使用动态分派，加速 `T64` 编解码器压缩。[#95881](https://github.com/ClickHouse/ClickHouse/pull/95881)（[Raúl Marín](https://github.com/Algunenano)）。
* 在条件允许时批量插入（非 NULL、非 -If、不含 GROUP BY、类型非 IPv6 或 String），加速数值类型上的 `uniq`。[#95904](https://github.com/ClickHouse/ClickHouse/pull/95904)（[Raúl Marín](https://github.com/Algunenano)）。
* Keeper 底层优化：发现 `ZooKeeper::observeOperations` 占 ZooKeeper 接收线程 CPU 消耗的 20% 以上。本次变更为 `AggregatedZooKeeperLog::stats` 使用速度高 10 倍以上的 `CityHash64` 替代 `SipHash`；并在 `Coordination::ErrorCounter` 中以 `std::array<std::atomic<UInt32>, N>` 替代 `std::unordered_map` 与 `std::mutex`。[#95962](https://github.com/ClickHouse/ClickHouse/pull/95962)（[Miсhael Stetsyuk](https://github.com/mstetsyuk)）。
* 移除 ProfileEvents::Counter 的 64 字节对齐以节省内存。[#96097](https://github.com/ClickHouse/ClickHouse/pull/96097)（[Azat Khuzhin](https://github.com/azat)）。
* 内存优化：将 `CachedOnDiskReadBufferFromFile` 结构体体积缩小 50 倍。[#96098](https://github.com/ClickHouse/ClickHouse/pull/96098)（[Azat Khuzhin](https://github.com/azat)）。
* 哈希表为空时，调整大小不再复制旧数据。[#96180](https://github.com/ClickHouse/ClickHouse/pull/96180)（[Raúl Marín](https://github.com/Algunenano)）。
* `RIGHT OUTER` JOIN 支持 JOIN 运行时过滤器。[#96183](https://github.com/ClickHouse/ClickHouse/pull/96183)（[Hechem Selmi](https://github.com/m-selmi)）。
* 现在默认启用 `enable_join_runtime_filters` 优化。[#89314](https://github.com/ClickHouse/ClickHouse/pull/89314)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 此前仅当所有数据片段都具有物化文本索引时，才会应用文本索引直接读取优化。本 PR 增加部分支持：有物化文本索引的数据片段会使用该索引，没有的则回退执行原始过滤表达式。[#96411](https://github.com/ClickHouse/ClickHouse/pull/96411)（[Anton Popov](https://github.com/CurtizJ)）。
* 为系统日志表的时间列新增 `minmax` 二级索引，并为 `query_id`/`initial_query_id` 列新增 `bloom_filter` 索引，以加快过滤。[#96712](https://github.com/ClickHouse/ClickHouse/pull/96712)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 延迟物化优化现在会应用于 `UNION ALL` 查询的所有分支，而不只是第一个分支。通过 `UNION ALL` 组合多个不同 `MergeTree` 表的排序限量读取时，每个分支都能延迟读取列，从而减少 I/O。[#96832](https://github.com/ClickHouse/ClickHouse/pull/96832)（[Federico Ginosa](https://github.com/menxit)）。
* 移除不必要的数据复制，并为数值列启用向量化 min/max 计算，优化 INSERT 时的 minmax 跳数索引计算。[#97392](https://github.com/ClickHouse/ClickHouse/pull/97392)（[Raúl Marín](https://github.com/Algunenano)）。
* `DeltaLake` 存储现在从 Delta Lake 元数据获取 `count()` 结果，并在 system.tables 中显示正确的表统计信息（总字节数/行数）。[#96190](https://github.com/ClickHouse/ClickHouse/pull/96190)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 从 MergeTree 读取时，也会从读取步骤中移除未使用的列；在过滤器下推到 `PREWHERE` 时尤其有用。[#89982](https://github.com/ClickHouse/ClickHouse/pull/89982)（[János Benjamin Antal](https://github.com/antaljanosbenjamin)）。
* 改进 `SHOW TABLES` 查询，只获取表名；同时改进 getLightweightTablesIterator，使其返回仅含表名的结构。解决 [#93835](https://github.com/ClickHouse/ClickHouse/issues/93835)。[#94467](https://github.com/ClickHouse/ClickHouse/pull/94467)（[Smita Kulkarni](https://github.com/SmitaRKulkarni)）。
* 改进 `assumeNotNull`、`coalesce`、`ifNull`：当键列被这些函数包装时，范围谓词也能利用主键和跳数索引进行裁剪。关闭 [#94689](https://github.com/ClickHouse/ClickHouse/issues/94689)。[#94754](https://github.com/ClickHouse/ClickHouse/pull/94754)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 为 Keeper 的 getChildren 请求新增 with\_data 与 with\_stat 扩展，可在一次操作中同时获取子节点列表及其 `stat` 和/或 `data`。[#94826](https://github.com/ClickHouse/ClickHouse/pull/94826)（[Nikolay Degterinsky](https://github.com/evillique)）。
* 无论最终执行本地计划还是并行副本计划，多数情况下索引分析只执行一次。[#94854](https://github.com/ClickHouse/ClickHouse/pull/94854)（[Nikita Taranov](https://github.com/nickitat)）。
* 允许根据数据片段数量（`distributed_index_analysis_min_parts_to_activate`）和索引大小（`distributed_index_analysis_min_indexes_size_to_activate`）启用分布式索引分析。[#95216](https://github.com/ClickHouse/ClickHouse/pull/95216)（[Azat Khuzhin](https://github.com/azat)）。
* 为 Iceberg 表启用 PREWHERE 优化。[#95476](https://github.com/ClickHouse/ClickHouse/pull/95476)（[Konstantin Vedernikov](https://github.com/scanhex12)）。
* 减少部分 AST 类的内存占用。[#95514](https://github.com/ClickHouse/ClickHouse/pull/95514)（[Raúl Marín](https://github.com/Algunenano)）。
* 限制启用 `split_intersecting_parts_ranges_into_layers` 时生成的流水线流数量，避免内存消耗过高。[#96478](https://github.com/ClickHouse/ClickHouse/pull/96478)（[Nikita Taranov](https://github.com/nickitat)）。
* 为多 JOIN 实现等价集合优化。连续执行多个 `INNER JOIN` 时可获得更好的过滤器下推。当表通过等价列连接（如 `t1 JOIN t2 ON t1.id = t2.id JOIN t3 ON t2.id = t3.id WHERE t1.id > 10`）时，对链中任意表应用的过滤器都会自动下推到所有表。关闭 [#96550](https://github.com/ClickHouse/ClickHouse/issues/96550)。[#96596](https://github.com/ClickHouse/ClickHouse/pull/96596)（[Vladimir Cherkasov](https://github.com/vdimir)）。
* 优化 Delta Lake 元数据扫描，采用 delta-kernel PR [https://github.com/delta-io/delta-kernel-rs/pull/1827](https://github.com/delta-io/delta-kernel-rs/pull/1827) 中的变更。[#96686](https://github.com/ClickHouse/ClickHouse/pull/96686)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 在 Replicated 数据库中，不再为每个空操作查询更新缓存的集群信息。[#96897](https://github.com/ClickHouse/ClickHouse/pull/96897)（[Tuan Pham Anh](https://github.com/tuanpach)）。
* 使用 `startsWithUTF8` 过滤且前缀仅含 ASCII 字符时，使用主键索引。[#97055](https://github.com/ClickHouse/ClickHouse/pull/97055)（[vkcku](https://github.com/vkcku)）。

<h4 id="262-improvement">
  改进
</h4>

* 为 Keeper 请求添加 OpenTelemetry 链路追踪。[#91332](https://github.com/ClickHouse/ClickHouse/pull/91332)（[Miсhael Stetsyuk](https://github.com/mstetsyuk)）。
* 新增配置项 `logger.startup_console_level` 与 `logger.shutdown_console_level`，可分别覆盖 ClickHouse 启动和关闭期间的控制台日志级别。[#95919](https://github.com/ClickHouse/ClickHouse/pull/95919)（[Garrett Thomas](https://github.com/garrettthomaskth)）。
* 重新加载配置时遵循命令行覆盖项。关闭 [#80294](https://github.com/ClickHouse/ClickHouse/issues/80294)。[#80295](https://github.com/ClickHouse/ClickHouse/pull/80295)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* `mongodb` 表函数允许以键值对覆盖命名集合参数。[#89616](https://github.com/ClickHouse/ClickHouse/pull/89616)（[vanchaklar](https://github.com/vanchaklar)）。
* Iceberg 表的顺序读取优化现在支持 `icebergBucket`、`icebergTruncate` 等复杂排序函数，不再局限于简单列引用。[#90256](https://github.com/ClickHouse/ClickHouse/pull/90256)（[Konstantin Vedernikov](https://github.com/scanhex12)）。
* 在 system.mutations 中新增 parts\_postpone\_reasons 列，显示数据片段被延迟处理的原因，改进诊断能力。[#92206](https://github.com/ClickHouse/ClickHouse/pull/92206)（[Shaohua Wang](https://github.com/tiandiwonder)）。
* 在 `DataflowStatisticsCache` 中跟踪由插入、删除或查询条件缓存使用造成的待读行数变化。[#93636](https://github.com/ClickHouse/ClickHouse/pull/93636)（[Nikita Taranov](https://github.com/nickitat)）。
* 支持 `SYSTEM RESET DDL WORKER [ON CLUSTER]` 查询，请求在 DDLWorker 主线程中重置其状态；更新主机 ID 后可用于刷新副本活动状态。[#93780](https://github.com/ClickHouse/ClickHouse/pull/93780)（[Tuan Pham Anh](https://github.com/tuanpach)）。
* `system.part_log` 的 `MUTATE_PART` 和 `MUTATE_PART_START` 事件类型支持 `mutation_ids`。[#93811](https://github.com/ClickHouse/ClickHouse/pull/93811)（[Shaohua Wang](https://github.com/tiandiwonder)）。
* 后台操作（变更、合并）现在可通过 `background` 配置档案独立配置；此前它们通过 `default` 档案与常规查询共享设置。[#93905](https://github.com/ClickHouse/ClickHouse/pull/93905)（[Arsen Muk](https://github.com/arsenmuk)）。
* 为 `system.crash_log` 添加更多信息。[#94112](https://github.com/ClickHouse/ClickHouse/pull/94112) [#95857](https://github.com/ClickHouse/ClickHouse/pull/95857)（[Miсhael Stetsyuk](https://github.com/mstetsyuk)）。
* 新增 `QueryNonInternal` 指标，跟踪正在执行的非内部查询数量。该指标以 `ClickHouseMetrics_QueryNonInternal` 暴露，便于运维人员对照仅适用于非内部查询的 `max_concurrent_queries` 限制监控查询并发度。[#94284](https://github.com/ClickHouse/ClickHouse/pull/94284)（[Ashwath Singh](https://github.com/ashwath)）。
* `RuntimeDataflowStatisticsCacheUpdater` 支持收集紧凑型数据片段中各列的输入字节统计。[#94626](https://github.com/ClickHouse/ClickHouse/pull/94626)（[Nikita Taranov](https://github.com/nickitat)）。
* 新增检查，用于发现会导致集群组装失败的 Keeper 配置错误。关闭 [#60932](https://github.com/ClickHouse/ClickHouse/issues/60932)。[#94682](https://github.com/ClickHouse/ClickHouse/pull/94682)（[Konstantin Bogdanov](https://github.com/thevar1able)）。
* 改进加载数据片段时 JSON 前缀的反序列化。[#94848](https://github.com/ClickHouse/ClickHouse/pull/94848)（[Pavel Kruglov](https://github.com/Avogar)）。
* 使用完整 INSERT 流水线重构写入，使其能够触发目标表上的物化视图。[#94890](https://github.com/ClickHouse/ClickHouse/pull/94890)（[Kai Zhu](https://github.com/nauu)）。
* 仅当搜索列存在索引时，才使用向量相似度搜索计划优化。[#94998](https://github.com/ClickHouse/ClickHouse/pull/94998)（[Eduard Karacharov](https://github.com/korowa)）。
* 在用户认证前检查总内存限制；总量超过允许值时抛出 `(total) memory limit exceeded`。[#95003](https://github.com/ClickHouse/ClickHouse/pull/95003)（[Nikolai Kochetov](https://github.com/KochetovNicolai)）。
* 新增 `throw_on_unmatched_row_policies` 配置项。启用后，如果用户查询的表定义了行策略，但没有任何策略适用于该用户，则抛出异常，避免因访问控制配置错误而返回全部行的歧义行为。[#95014](https://github.com/ClickHouse/ClickHouse/pull/95014)（[Vitaly Baranov](https://github.com/vitlibar)）。
* 在使用 Unity Catalog 的长时间查询中动态更新 S3 访问令牌。关闭 [#93981](https://github.com/ClickHouse/ClickHouse/issues/93981)。[#95069](https://github.com/ClickHouse/ClickHouse/pull/95069)（[Konstantin Vedernikov](https://github.com/scanhex12)）。
* 如果 ClickHouse 持续承受内存压力达到 `memory_worker_decay_adjustment_period_ms` 毫秒，则禁用 jemalloc 脏页衰减；若恢复正常并持续相同时间，则重新启用。[#95145](https://github.com/ClickHouse/ClickHouse/pull/95145)（[Antonio Andelic](https://github.com/antonio2368)）。
* S3Queue 支持辅助 ZooKeeper，使用 s3Queue 的 `keeper_path` 设置。[#95203](https://github.com/ClickHouse/ClickHouse/pull/95203)（[Diego Nieto](https://github.com/lesandie)）。
* TTL 删除数据片段的合并会遵循 `max_parts_to_merge_at_once`。[#95315](https://github.com/ClickHouse/ClickHouse/pull/95315)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 在 query\_log 中新增 `connection_address` 和 `connection_port` 以反映物理连接；通过代理连接且 auth\_use\_forwarded\_address=1 时，原有 `address` 和 `port` 会被替换。[#95471](https://github.com/ClickHouse/ClickHouse/pull/95471)（[Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)）。
* 修复查询条件缓存的内存计量错误。此前未计入由多个字符串（如 part\_name、表 ID 和完整 SQL 条件）组成的缓存键。[#95478](https://github.com/ClickHouse/ClickHouse/pull/95478)（[Nikita Mikhaylov](https://github.com/nikitamikhaylov)）。
* 使用内嵌配置启动的服务器现在与常规配置一样，允许管理用户与授权并将其保存到 `access` 目录，便于测试。同时在内嵌配置和 clickhouse-local 中启用所有 access\_control\_improvements。[#95481](https://github.com/ClickHouse/ClickHouse/pull/95481)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 改进 S3 认证错误消息：访问被拒绝时提示检查凭据。[#95648](https://github.com/ClickHouse/ClickHouse/pull/95648)（[Gerald Latkovic](https://github.com/batkovic75)）。
* 启用统计信息缓存，并将缓存更新周期设置为 300 秒。[#95841](https://github.com/ClickHouse/ClickHouse/pull/95841)（[Han Fei](https://github.com/hanfei1991)）。
* 在 `system.aggregated_zookeeper_log` 中添加组件名称。[#95882](https://github.com/ClickHouse/ClickHouse/pull/95882)（[Antonio Andelic](https://github.com/antonio2368)）。
* 从 `system.tables` 查询 `DeltaLake` 表时跳过对象存储读取。[#95899](https://github.com/ClickHouse/ClickHouse/pull/95899)（[Antonio Andelic](https://github.com/antonio2368)）。
* 当 `compatibility` 设置为 `26.2` 或更高版本时，默认启用 `enable_max_bytes_limit_for_min_age_to_force_merge`。[#95917](https://github.com/ClickHouse/ClickHouse/pull/95917)（[Christoph Wurm](https://github.com/cwurm)）。
* Delta Lake 现在可在 macOS 上使用。关闭 #95979。[#95985](https://github.com/ClickHouse/ClickHouse/pull/95985)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 旧版本将相互冲突的 ALTER 表达式与 UPDATE、RENAME COLUMN 组合时，会抛出逻辑错误而非正确异常。关闭 [#70678](https://github.com/ClickHouse/ClickHouse/issues/70678)。[#96022](https://github.com/ClickHouse/ClickHouse/pull/96022)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 改进所有 ClickHouse 应用程序的帮助输出，新增 `--no-sudo` 选项并包含若干修复。这是 [Ilya Yatsishin](https://github.com/qoega) 所做 [#58244](https://github.com/ClickHouse/ClickHouse/issues/58244) 的延续。[#96025](https://github.com/ClickHouse/ClickHouse/pull/96025)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 为 `cosineDistance` 新增别名 `distanceCosine`，使其与其他距离函数的别名形式一致。[#96065](https://github.com/ClickHouse/ClickHouse/pull/96065)（[Raufs Dunamalijevs](https://github.com/rienath)）。
* 支持 Keeper 的 `with_data` 扩展，改进 Database Replicated 中的表获取。[#96090](https://github.com/ClickHouse/ClickHouse/pull/96090)（[Nikolay Degterinsky](https://github.com/evillique)）。
* 将 chdig 更新至 [v26.2.1](https://github.com/azat/chdig/releases/tag/v26.2.1)（新增功能并支持 macOS）。[#96113](https://github.com/ClickHouse/ClickHouse/pull/96113)（[Azat Khuzhin](https://github.com/azat)）。
* 改进 `numbers` 和 `primes` 的过滤器下推。当无法推导精确边界时，ClickHouse 可从 `WHERE` 条件推导保守的值边界，并据此限制序列生成。例如对 `WHERE number % 5 < 2 AND number > 100 AND number < 300`，只生成 100 到 300 之间的数，再应用谓词，从而避免无界扫描。关闭 [#84853](https://github.com/ClickHouse/ClickHouse/issues/84853)、[#93913](https://github.com/ClickHouse/ClickHouse/issues/93913)。[#96115](https://github.com/ClickHouse/ClickHouse/pull/96115)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 此前存在 `COMMENT` 子句时，格式化程序会给 SELECT 加括号以消除解析歧义。现在改为在 `AS SELECT` 前输出 `COMMENT`，无需括号即可消除歧义。[#96293](https://github.com/ClickHouse/ClickHouse/pull/96293)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* `allow_impersonate_user` 配置项现在位于 `access_control_improvements` 节中，不再是独立的服务器设置。[#96451](https://github.com/ClickHouse/ClickHouse/pull/96451)（[Vitaly Baranov](https://github.com/vitlibar)）。
* 使 `core_dump.size_limit` 配置支持热重载，修改配置后无需重启服务器即可生效。[#96524](https://github.com/ClickHouse/ClickHouse/pull/96524)（[Miсhael Stetsyuk](https://github.com/mstetsyuk)）。
* 改进 CPU/实时分析器与套接字超时的协同工作。[#96601](https://github.com/ClickHouse/ClickHouse/pull/96601)（[Sergei Trifonov](https://github.com/serxa)）。
* 防止在 DROP COLUMN 变更后很快执行 ADD COLUMN 时，被删除的数据重新出现。[#96713](https://github.com/ClickHouse/ClickHouse/pull/96713)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 将 `system.instrumentation` 中 `function_id` 的类型由 LowCardinality(Int32) 改为 Int32。[#96726](https://github.com/ClickHouse/ClickHouse/pull/96726)（Copilot）。
* 同步等待变更时会遵循查询取消和时间限制。[#96756](https://github.com/ClickHouse/ClickHouse/pull/96756)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 新增系统命令 `SYSTEM RELOAD DELTA KERNEL TRACING <level>`，可更改 delta-kernel 日志级别，便于调试。[#96763](https://github.com/ClickHouse/ClickHouse/pull/96763)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 即使禁用 DNS 缓存，也会应用按 IP 地址族过滤的 `dns_allow_resolve_names_to_ipv4/ipv6` 设置。[#96810](https://github.com/ClickHouse/ClickHouse/pull/96810)（[c-end](https://github.com/c-end)）。
* 改进 jemalloc 内省能力。[#96840](https://github.com/ClickHouse/ClickHouse/pull/96840)（[Azat Khuzhin](https://github.com/azat)）。
* 修复 `/play` Web UI 查询系统表时抛出 `QUERY_CACHE_USED_WITH_SYSTEM_TABLE` 的问题。[#96869](https://github.com/ClickHouse/ClickHouse/pull/96869)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 改进 Web UI：通过 favicon 指示查询运行状态；显示加载数据库与表等辅助查询的错误，不再静默忽略。关闭 [#85055](https://github.com/ClickHouse/ClickHouse/issues/85055)。[#96883](https://github.com/ClickHouse/ClickHouse/pull/96883)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* `/play` UI 左侧面板现在可点击切换数据库列表。[#96884](https://github.com/ClickHouse/ClickHouse/pull/96884)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* `DROP DATABASE` 现在按依赖关系逆序删除表；当数据库包含加载依赖的表（如使用 `joinGet` 的 `Distributed` 表）时，可提高崩溃安全性。[#97057](https://github.com/ClickHouse/ClickHouse/pull/97057)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 升级 yaml-cpp，防止跳过无效 YAML。[#97333](https://github.com/ClickHouse/ClickHouse/pull/97333)（[Azat Khuzhin](https://github.com/azat)）。
* 获取表时，在 `play.html` 侧边栏显示加载指示器。[#97531](https://github.com/ClickHouse/ClickHouse/pull/97531)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 在内置 Web UI（play.html）中为原始查询结果新增复制到剪贴板按钮。[#97532](https://github.com/ClickHouse/ClickHouse/pull/97532)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复查询混淆器（`clickhouse-format --obfuscate`），使其在更多场景生成可解析的 SQL。[#97584](https://github.com/ClickHouse/ClickHouse/pull/97584)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。

<h4 id="262-bug-fix-user-visible-misbehavior-in-an-official-stable-release">
  Bug 修复（正式稳定版本中用户可见的异常行为）
</h4>

* 执行仅修改元数据的 ALTER（例如扩展 Enum 元素）后，使用投影进行聚合优化可能会产生异常。[#84143](https://github.com/ClickHouse/ClickHouse/pull/84143)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 物化视图现在使用其创建所在的数据库作为执行上下文。这意味着：视图 SELECT 查询中引用的名称可以省略显式数据库限定；未显式限定数据库时，将假定为物化视图创建所在的数据库。[#88193](https://github.com/ClickHouse/ClickHouse/pull/88193)（[Dmitry Kovalev](https://github.com/dk-github)）。
* 修复使用 ON CLUSTER 时 CREATE USER 认证方法中的查询参数替换。此前认证方法中的查询参数（如密码）不会被替换，导致远程节点报 UNKNOWN\_QUERY\_PARAMETER 错误。[#92777](https://github.com/ClickHouse/ClickHouse/pull/92777)（[xiaohuanlin](https://github.com/xiaohuanlin)）。
* 修复 `has`、`mapContainsKey` 和 `mapContainsValue` 函数在文本索引分析中的不一致。此前，使用这些函数的查询会因表达式是否通过文本索引求值而返回不同结果。[#93578](https://github.com/ClickHouse/ClickHouse/pull/93578)（[Anton Popov](https://github.com/CurtizJ)）。
* 修复将表附加到 `MaterializedPostgreSQL` 数据库时，若 `dropReplicationSlot` 在栈展开过程中抛出异常会导致崩溃的问题。[#96871](https://github.com/ClickHouse/ClickHouse/pull/96871)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复大量并发备份争用相同文件时可能导致服务器崩溃的问题。[#93659](https://github.com/ClickHouse/ClickHouse/pull/93659)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复并行副本查询与非 MergeTree 表 JOIN 时的问题。关闭 [#92056](https://github.com/ClickHouse/ClickHouse/issues/92056)。[#93902](https://github.com/ClickHouse/ClickHouse/pull/93902)（[Igor Nikonov](https://github.com/devcrafter)）。
* 修复名称中包含点号的 Iceberg 列返回 NULL 值的问题。[#94335](https://github.com/ClickHouse/ClickHouse/pull/94335)（[Mikhail Koviazin](https://github.com/mkmkme)）。
* 修复 `stringJaccardIndexUTF8` 对 UTF-8 字符串的处理，并提升性能。[#94613](https://github.com/ClickHouse/ClickHouse/pull/94613)（[Joanna Hulboj](https://github.com/jh0x)）。
* 修复 `WITH FILL STALENESS` 中可能导致未定义行为和/或无限循环的溢出，以及大跨度跳跃可能引发的无限循环；并增加旧分析器支持（主要用于压力测试）。[#94663](https://github.com/ClickHouse/ClickHouse/pull/94663)（[Azat Khuzhin](https://github.com/azat)）。
* 修复主机名解析到多个地址且远程副本卡死时，分布式查询可能挂起的问题。[#94726](https://github.com/ClickHouse/ClickHouse/pull/94726)（[c-end](https://github.com/c-end)）。
* 修复连接多个表表达式且最左侧表表达式为 `-Cluster` 表函数时结果不正确的问题。解决 [#89996](https://github.com/ClickHouse/ClickHouse/issues/89996)。[#94748](https://github.com/ClickHouse/ClickHouse/pull/94748)（[Konstantin Bogdanov](https://github.com/thevar1able)）。
* 修复涉及 `toWeek`、`toYearWeek`、`toStartOfWeek`、`toLastDayOfWeek` 和 `toDayOfWeek` 谓词的主键与跳数索引裁剪错误，并修复其中部分函数处理合法 `LowCardinality(String)` 查询时的异常。[#94816](https://github.com/ClickHouse/ClickHouse/pull/94816)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 移除对带 SQL Security 视图执行 `ATTACH` 查询时不必要的跳过权限检查。现在用户附加带定义者的视图时会验证所需访问权限，防止潜在的权限提升。[#94865](https://github.com/ClickHouse/ClickHouse/pull/94865)（[pufit](https://github.com/pufit)）。
* 修复并发删除 `delete_tmp_*` 目录导致 `ReplicatedMergeTree` 启动时崩溃的问题。[#94892](https://github.com/ClickHouse/ClickHouse/pull/94892)（[myeongjun](https://github.com/myeongjjun)）。
* 修复向带物化视图的 Iceberg 表执行 `INSERT` 时丢失去重信息并引发异常的问题。[#94938](https://github.com/ClickHouse/ClickHouse/pull/94938)（[Daniil Ivanik](https://github.com/divanik)）。
* 修复 `SYSTEM DROP QUERY CACHE TAG 'TAGNAME' ON CLUSTER <CLUSTERNAME>` 会删除集群上全部缓存的问题。[#94978](https://github.com/ClickHouse/ClickHouse/pull/94978)（[Rory Crispin](https://github.com/RoryCrispin)）。
* 在垂直合并后保留固定索引粒度（use\_const\_adaptive\_granularity；v2 同时修复 Nested 及通用场景）。[#95013](https://github.com/ClickHouse/ClickHouse/pull/95013)（[Azat Khuzhin](https://github.com/azat)）。
* 修复 26.1 版本在 \[ClickHouse/ClickHouse[#82764](https://github.com/ClickHouse/ClickHouse/issues/82764)]\([https://github.com/ClickHouse/ClickHouse/pull/82764](https://github.com/ClickHouse/ClickHouse/pull/82764)) 之后出现的文件系统缓存竞争。[#95042](https://github.com/ClickHouse/ClickHouse/pull/95042)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复通过 KILL QUERY 以及在 clickhouse-client 中按 Ctrl+C 无法取消 postgresql() 表函数的问题。[#95136](https://github.com/ClickHouse/ClickHouse/pull/95136)（[Roman Vasin](https://github.com/rvasin)）。
* 修复多个 JOIN 使用 `USING` 子句时源表限定列的类型推断。此前，即使列未参与后续 JOIN，其底层源列类型也会被错误更新为公共超类型（例如 `SELECT t2.a FROM t1 LEFT JOIN t2 USING (a) LEFT JOIN t3 USING (a)` 中，`t2.a` 只参与第一个 JOIN，因此其类型应仅为 `t1.a` 与 `t2.a` 的公共超类型，不应包含 `t3.a`）。当函数预期的列类型与执行计划中实际类型不同时，这可能导致逻辑错误或崩溃。[#95157](https://github.com/ClickHouse/ClickHouse/pull/95157)（[Vladimir Cherkasov](https://github.com/vdimir)）。
* 获取 manifest .avro 列表及文件内容时只执行一次列转换。[#95164](https://github.com/ClickHouse/ClickHouse/pull/95164)（[Daniil Ivanik](https://github.com/divanik)）。
* 修复 JSON 列大小计算错误，避免内存使用过高或列统计信息不正确。[#95207](https://github.com/ClickHouse/ClickHouse/pull/95207)（[Azat Khuzhin](https://github.com/azat)）。
* 修复轻量级更新后应用大型补丁数据片段时内存核算不准确的问题。此前应用大型补丁可能占用过多内存，导致服务器进程被 OOM Killer 终止。[#95231](https://github.com/ClickHouse/ClickHouse/pull/95231)（[Anton Popov](https://github.com/CurtizJ)）。
* 修复启用 `max_parallel_replicas` 的分布式查询在索引分析期间回退到本地副本时可能导致错误结果或异常的未定义行为。[#95263](https://github.com/ClickHouse/ClickHouse/pull/95263)（[Azat Khuzhin](https://github.com/azat)）。
* 修复 `group_by_overflow_mode` 设为 `any` 时，`sum` 和时间序列对稀疏列的聚合问题。[#95301](https://github.com/ClickHouse/ClickHouse/pull/95301)（[Mikhail Koviazin](https://github.com/mkmkme)）。
* 修复 `plain_rewritable` 磁盘策略的可靠性问题：解除元数据文件链接的途中若发生网络错误，可能使存储处于不一致状态。[#95302](https://github.com/ClickHouse/ClickHouse/pull/95302)（[Mikhail Artemenko](https://github.com/Michicosun)）。
* Iceberg 使用 Date32 替代 Date。[#95322](https://github.com/ClickHouse/ClickHouse/pull/95322)（[Konstantin Vedernikov](https://github.com/scanhex12)）。
* `redis` 表函数的密码参数现在会在日志和系统表（如 `query_log`）中脱敏。[#95325](https://github.com/ClickHouse/ClickHouse/pull/95325)（[János Benjamin Antal](https://github.com/antaljanosbenjamin)）。
* 修复分布式查询仍在访问表时该表可能被删除或修改、进而导致异常或错误结果的问题。[#95356](https://github.com/ClickHouse/ClickHouse/pull/95356)（[Azat Khuzhin](https://github.com/azat)）。
* 修复分布式查询在某些情况下使用负数 `LIMIT/OFFSET` 时的逻辑错误。[#95357](https://github.com/ClickHouse/ClickHouse/pull/95357)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 修复 clickhouse-client 通过 SSH 连接时会要求输入两次密码的问题。[#95372](https://github.com/ClickHouse/ClickHouse/pull/95372)（[Isak Ellmer](https://github.com/spinojara)）。
* 修复 S3(Azure)Queue 存储中的数据竞争。[#95385](https://github.com/ClickHouse/ClickHouse/pull/95385)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复 PREWHERE 中的 lambda 表达式导致 PREWHERE 过滤器出错的问题。[#95395](https://github.com/ClickHouse/ClickHouse/pull/95395)（[Xiaozhe Yu](https://github.com/wudidapaopao)）。
* 修复 `optimize_syntax_fuse_functions`：当聚合参数为 `Nullable` 时，不再将 `sum/count/avg` 重写为 `sumCount()`。关闭 [#95390](https://github.com/ClickHouse/ClickHouse/issues/95390)。[#95441](https://github.com/ClickHouse/ClickHouse/pull/95441)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 避免取消分布式查询时可能发生的崩溃。[#95466](https://github.com/ClickHouse/ClickHouse/pull/95466)（[Aleksandr Musorin](https://github.com/AVMusorin)）。
* 修复从 S3(Azure)Queue 引擎流式读取时的去重。[#95467](https://github.com/ClickHouse/ClickHouse/pull/95467)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复分布式查询中更新分配给初始用户的行策略时的问题。[#95469](https://github.com/ClickHouse/ClickHouse/pull/95469)（[Vitaly Baranov](https://github.com/vitlibar)）。
* 修复 plain\_rewritable 之上加密磁盘的检查（解决可能出现的 `It is not possible to register multiple plain-rewritable disks with the same object storage prefix` 错误）。[#95470](https://github.com/ClickHouse/ClickHouse/pull/95470)（[Azat Khuzhin](https://github.com/azat)）。
* `mergeTreeProjection` 表函数此前缺少访问检查，使没有表 SELECT 权限但拥有表函数权限的用户可以读取其投影数据。现在增加与 `mergeTreeIndex` 和 `mergeTreeAnalyzeIndexes` 相同的访问检查。[#95480](https://github.com/ClickHouse/ClickHouse/pull/95480)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复从 Dynamic/JSON 类型的动态子列读取 size 子列时可能出现的逻辑错误。[#95573](https://github.com/ClickHouse/ClickHouse/pull/95573)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复 [#94262](https://github.com/ClickHouse/ClickHouse/issues/94262) 在（实验性）零拷贝复制中引入的回归：共享数据片段可能在其他副本完成获取前被删除。[#95597](https://github.com/ClickHouse/ClickHouse/pull/95597)（[filimonov](https://github.com/filimonov)）。
* 修复对 JSON 数组应用 `tupleElement` 时的崩溃。关闭 [#95581](https://github.com/ClickHouse/ClickHouse/issues/95581)。[#95647](https://github.com/ClickHouse/ClickHouse/pull/95647)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复在使用 USING 的 JOIN 中，VALUES 子句的 lambda 函数内使用匹配器（`*`）时出现的逻辑错误异常。关闭 [#93675](https://github.com/ClickHouse/ClickHouse/issues/93675)。[#95661](https://github.com/ClickHouse/ClickHouse/pull/95661)（[Vladimir Cherkasov](https://github.com/vdimir)）。
* 修复等待分布式 DDL 的同时删除 Replicated 数据库时出现的 `There was an error: Cannot obtain error message` 逻辑错误。修复 [#95539](https://github.com/ClickHouse/ClickHouse/issues/95539)。[#95664](https://github.com/ClickHouse/ClickHouse/pull/95664)（[Alexander Tokmakov](https://github.com/tavplubix)）。
* 修复启用 `transform_null_in` 时 `IN` 函数处理 `NULL` 值会返回错误结果的问题。关闭 [#65776](https://github.com/ClickHouse/ClickHouse/issues/65776)。[#95674](https://github.com/ClickHouse/ClickHouse/pull/95674)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 启用 `cast_keep_nullable` 设置时，在 `CAST` 中正确处理 LowCardinality Nullable 类型。关闭 [#95670](https://github.com/ClickHouse/ClickHouse/issues/95670)。[#95747](https://github.com/ClickHouse/ClickHouse/pull/95747)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复分区 Delta Lake 数据的合并压缩。[#95773](https://github.com/ClickHouse/ClickHouse/pull/95773)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复运行时过滤器中 Nullable JOIN 列的竞争条件。[#95775](https://github.com/ClickHouse/ClickHouse/pull/95775)（[Hechem Selmi](https://github.com/m-selmi)）。
* 修复启用 `analyzer_compatibility_join_using_top_level_identifier` 且 `USING` 列在各表及选择列表中类型不同时，含匹配器（`*`、`table.*`）的查询可能出现逻辑错误的问题。关闭 [#90477](https://github.com/ClickHouse/ClickHouse/issues/90477)。[#95808](https://github.com/ClickHouse/ClickHouse/pull/95808)（[Vladimir Cherkasov](https://github.com/vdimir)）。
* 修复并行线程池操作（备份、聚合、分布式查询）中的内存安全问题；任务调度期间发生错误时，这些问题可能引发异常。[#95818](https://github.com/ClickHouse/ClickHouse/pull/95818)（[Raúl Marín](https://github.com/Algunenano)）。
* 修复 DROP WORKLOAD 与使用被删除工作负载的查询并发运行时发生的崩溃。[#95856](https://github.com/ClickHouse/ClickHouse/pull/95856)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复用户在许多数据库上仅拥有有限授权时查询系统表性能缓慢的问题。关闭 [#89371](https://github.com/ClickHouse/ClickHouse/issues/89371)。[#95874](https://github.com/ClickHouse/ClickHouse/pull/95874)（[pufit](https://github.com/pufit)）。
* 修复对含嵌套路径的 JSON 执行 tupleElement 可能返回错误查询结果的问题。[#95907](https://github.com/ClickHouse/ClickHouse/pull/95907)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复对空 MergeTree 表使用 `direct` JOIN 算法时可能出现的 `NOT_SUPPORTED` 错误。[#95935](https://github.com/ClickHouse/ClickHouse/pull/95935)（[Vladimir Cherkasov](https://github.com/vdimir)）。
* 修复客户端不提示和自动补全设置别名的问题。关闭 [#92190](https://github.com/ClickHouse/ClickHouse/issues/92190)。[#95945](https://github.com/ClickHouse/ClickHouse/pull/95945)（[phulv94](https://github.com/phulv94)）。
* 修复 system.asynchronous\_metric\_log 中的 event\_date。[#95947](https://github.com/ClickHouse/ClickHouse/pull/95947)（[Raúl Marín](https://github.com/Algunenano)）。
* 修复 JSON 数据类型的路径跳过逻辑。此前使用 `JSON(SKIP path)` 会跳过所有以 `path` 为前缀的 JSON 键，包括 `"pathpath"`，插入时可能造成这些路径的数据丢失；现在只跳过键 `"path"`。[#95948](https://github.com/ClickHouse/ClickHouse/pull/95948)（[Pavel Kruglov](https://github.com/Avogar)）。
* 含未知投影的数据片段不应被永久标记为丢失。[#95952](https://github.com/ClickHouse/ClickHouse/pull/95952)（[Mikhail Artemenko](https://github.com/Michicosun)）。
* 修复键为 `Nullable(String)` 的 `Join` 表中空字符串会变成 `NULL` 的问题。关闭 [#71414](https://github.com/ClickHouse/ClickHouse/issues/71414)。[#96002](https://github.com/ClickHouse/ClickHouse/pull/96002)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* PostgreSQL 引擎现在可正确读取 `BOOLEAN[]`。关闭 [#72754](https://github.com/ClickHouse/ClickHouse/issues/72754)。[#96006](https://github.com/ClickHouse/ClickHouse/pull/96006)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 `ProtobufList` 格式读取空文件时的问题。关闭 [#70059](https://github.com/ClickHouse/ClickHouse/issues/70059)。[#96007](https://github.com/ClickHouse/ClickHouse/pull/96007)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 `ProtobufList` 格式为空表生成幽灵记录的问题。关闭 [#72596](https://github.com/ClickHouse/ClickHouse/issues/72596)。[#96010](https://github.com/ClickHouse/ClickHouse/pull/96010)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复分布式查询与 PREWHERE 的一种特殊类型推断场景中，`if` 函数在 `UInt64` 与 `Int32` 之间类型不匹配的问题。关闭 [#70017](https://github.com/ClickHouse/ClickHouse/issues/70017)。[#96012](https://github.com/ClickHouse/ClickHouse/pull/96012)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复涉及 `Bool` 类型的 `JIT` 编译查询。[#96013](https://github.com/ClickHouse/ClickHouse/pull/96013)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复从 SQLite TEXT 列读取 UUID 列时的逻辑错误。关闭 [#71263](https://github.com/ClickHouse/ClickHouse/issues/71263)。[#96016](https://github.com/ClickHouse/ClickHouse/pull/96016)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 SQLite 引擎对 `DateTime`、`Date`、`UUID` 等类型的转换。关闭 [#73481](https://github.com/ClickHouse/ClickHouse/issues/73481)。[#96017](https://github.com/ClickHouse/ClickHouse/pull/96017)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复查询外部数据库 SQLite 和 PostgreSQL 时 `FixedString` 值转义错误的问题。关闭 [#73519](https://github.com/ClickHouse/ClickHouse/issues/73519)。与 @jh0x 共同完成。[#96019](https://github.com/ClickHouse/ClickHouse/pull/96019)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 WindowTransform 使用较大 PRECEDING 偏移量时的断言失败。关闭 [#75852](https://github.com/ClickHouse/ClickHouse/issues/75852)。[#96026](https://github.com/ClickHouse/ClickHouse/pull/96026)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复并发异步插入使用相同参数名但参数值不同时可能导致数据损坏的问题。[#96035](https://github.com/ClickHouse/ClickHouse/pull/96035)（[Seva Potapov](https://github.com/seva-potapov)）。
* 修复全局分析器的周期（由 `global_profiler_real_time_period_ns` 和 `global_profiler_cpu_time_period_ns` 控制）。此前使用的是被截断的值而非设置值，导致分析器唤醒次数超出预期。[#96048](https://github.com/ClickHouse/ClickHouse/pull/96048)（[Antonio Andelic](https://github.com/antonio2368)）。
* 修复 Iceberg 清单文件中用于位置删除的引用数据文件字段存在但为 null 时，无法为相应数据文件获取正确边界的问题。[#96061](https://github.com/ClickHouse/ClickHouse/pull/96061)（[Daniil Ivanik](https://github.com/divanik)）。
* 修复撤销默认角色的问题。[#96103](https://github.com/ClickHouse/ClickHouse/pull/96103)（[Vitaly Baranov](https://github.com/vitlibar)）。
* 修复禁用 `use_primary_key` 且使用索引的条件析取项数量极大这一罕见组合下，索引分析中的释放后使用问题。[#96112](https://github.com/ClickHouse/ClickHouse/pull/96112)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 `Gorilla` 编解码器的回归：显式指定的大小与数据类型大小不一致且缓冲区过小时，旧版本会在解压时抛出异常。关闭 [#78253](https://github.com/ClickHouse/ClickHouse/issues/78253)。[#96118](https://github.com/ClickHouse/ClickHouse/pull/96118)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 避免加载字典时发生死锁：一个字典引用了递归反向引用它的 Merge 表。关闭 [#78360](https://github.com/ClickHouse/ClickHouse/issues/78360)。[#96120](https://github.com/ClickHouse/ClickHouse/pull/96120)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 `formatDateTime` 使用 MySQL、JODA 风格等非固定宽度格式化器时读取未初始化值的问题。[#96133](https://github.com/ClickHouse/ClickHouse/pull/96133)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 设置 `use_const_adaptive_granularity` 与 `index_granularity_bytes`（表示“非自适应粒度”）组合使用时，会错误计算待读取行数并引发异常；现已修复。[#96143](https://github.com/ClickHouse/ClickHouse/pull/96143)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 在 S3、Azure 等对象存储类文件表上运行无效的 ALTER UPDATE 变更可能导致空指针解引用；现已修复。关闭 [#92994](https://github.com/ClickHouse/ClickHouse/issues/92994)。[#96162](https://github.com/ClickHouse/ClickHouse/pull/96162)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复存在部分权限撤销时 `AccessRights::contains` 返回错误结果的问题。[#96170](https://github.com/ClickHouse/ClickHouse/pull/96170)（[pufit](https://github.com/pufit)）。
* 修复 CTE 折叠常量在查询条件缓存中的哈希冲突，该问题可能导致错误的查询结果。关闭 [#96060](https://github.com/ClickHouse/ClickHouse/issues/96060)。[#96172](https://github.com/ClickHouse/ClickHouse/pull/96172)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 ProcessList 中可能出现的死锁：向取消检查器添加任务时若触发内存超额使用跟踪器，可能发生锁顺序反转。[#96182](https://github.com/ClickHouse/ClickHouse/pull/96182)（[Antonio Andelic](https://github.com/antonio2368)）。
* 修复外连接（LEFT、RIGHT 或 FULL）与多个 INNER JOIN 组合时因非法 JOIN 重排而返回错误结果的问题。外连接的 ON 条件引用多个此前已连接表的列时，优化器未计入全部表依赖，可能错误重排 JOIN 并造成结果缺行。关闭 [#95972](https://github.com/ClickHouse/ClickHouse/issues/95972)。[#96193](https://github.com/ClickHouse/ClickHouse/pull/96193)（[Vladimir Cherkasov](https://github.com/vdimir)）。
* 表未定义统计信息时，ClickHouse 不再尝试加载统计信息，从而避免检查统计文件是否存在所产生的 100 毫秒以上开销（问题 [#96068](https://github.com/ClickHouse/ClickHouse/issues/96068)）。[#96233](https://github.com/ClickHouse/ClickHouse/pull/96233)（[Han Fei](https://github.com/hanfei1991)）。
* 修复 `optimize_syntax_fuse_functions`：当聚合参数为 `LowCardinality(Nullable)` 时，不再将 `sum/count/avg` 重写为 `sumCount()`。关闭 [#95390](https://github.com/ClickHouse/ClickHouse/issues/95390)。[#96239](https://github.com/ClickHouse/ClickHouse/pull/96239)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 修复某些情况下 `not IN` 和 `not has` 函数的分区裁剪错误。[#96241](https://github.com/ClickHouse/ClickHouse/pull/96241)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 修复向量相似度索引中的 `stack-use-after-scope`。[#96259](https://github.com/ClickHouse/ClickHouse/pull/96259)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复查询前带有 SQL 注释时，测试运行器无法识别错误提示注释的问题。[#96336](https://github.com/ClickHouse/ClickHouse/pull/96336)（[Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)）。
* 修复表具有可空主键，且查询使用首个参数为常量的 `coalesce` 函数时 KeyCondition 中的逻辑错误。[#96340](https://github.com/ClickHouse/ClickHouse/pull/96340)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* `GROUPING SETS`、`group_by_use_nulls` 与内部含 `LowCardinality` 的 `Tuple` 数据类型相互作用时，可能在查询流水线中生成意外的数据块结构并导致逻辑错误。该问题出现在引入 `Nullable` `Tuple` 之后。[#96358](https://github.com/ClickHouse/ClickHouse/pull/96358)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 此前可使用空表达式 `()` 作为索引创建表，从而导致无效内存访问；现已修复。[#96363](https://github.com/ClickHouse/ClickHouse/pull/96363)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复旧分析器处理 JOIN 和重复别名时的崩溃。[#96405](https://github.com/ClickHouse/ClickHouse/pull/96405)（[Ilya Golshtein](https://github.com/ilejn)）。
* 修复 Variant 列错误的原地过滤优化所导致的 `Nested columns sizes are inconsistent with local_discriminators` 错误。[#96410](https://github.com/ClickHouse/ClickHouse/pull/96410)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 `CREATE TABLE ... CLONE AS ...` 忽略源表完整限定名的问题。[#96415](https://github.com/ClickHouse/ClickHouse/pull/96415)（[Hasyimi Bahrudin](https://github.com/hasyimibhar)）。
* 修复通过 KILL QUERY 以及在 clickhouse-client 中按 Ctrl+C 无法取消 `mysql` 表函数的问题。[#96437](https://github.com/ClickHouse/ClickHouse/pull/96437)（[Roman Vasin](https://github.com/rvasin)）。
* 修复 `max_execution_time` 值较高的查询在取消检查器线程中的活锁。[#96450](https://github.com/ClickHouse/ClickHouse/pull/96450)（[Sergei Trifonov](https://github.com/serxa)）。
* 修复分布式查询在某些情况下使用小数 `LIMIT/OFFSET` 时的逻辑错误。[#96475](https://github.com/ClickHouse/ClickHouse/pull/96475)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 修复某些含 lambda 函数的表达式中的空指针解引用。[#96479](https://github.com/ClickHouse/ClickHouse/pull/96479)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复将 `LowCardinality` 列转换为 `Nullable` 时结果不正确的问题。[#96483](https://github.com/ClickHouse/ClickHouse/pull/96483)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 修复创建 Iceberg 表时，`ORDER BY` 子句引用不存在的列或使用位置参数所导致的崩溃。关闭 [#93280](https://github.com/ClickHouse/ClickHouse/issues/93280)。[#96484](https://github.com/ClickHouse/ClickHouse/pull/96484)（[Konstantin Vedernikov](https://github.com/scanhex12)）。
* 修复带 Nullable 子字段的 Tuple 列在运行时过滤器中的异常。[#96509](https://github.com/ClickHouse/ClickHouse/pull/96509)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 Parquet V3 原生读取器在 `PREWHERE` 过滤列含非布尔 UInt8 值时的 `LOGICAL_ERROR` 异常。[#96594](https://github.com/ClickHouse/ClickHouse/pull/96594)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复副本表发生元数据变更时隐式索引的重新生成。[#96600](https://github.com/ClickHouse/ClickHouse/pull/96600)（[Raúl Marín](https://github.com/Algunenano)）。
* 修复 DROP WORKLOAD 中的数据竞争。[#96614](https://github.com/ClickHouse/ClickHouse/pull/96614)（[Sergei Trifonov](https://github.com/serxa)）。
* 修复写入 Iceberg 表时，分区插入可能导致数据在各分区文件中分布错误的问题。[#96620](https://github.com/ClickHouse/ClickHouse/pull/96620)（[Konstantin Vedernikov](https://github.com/scanhex12)）。
* 修复带约束的 `CREATE TABLE` 中的 `heap-use-after-free`。[#96669](https://github.com/ClickHouse/ClickHouse/pull/96669)（[Nikita Taranov](https://github.com/nickitat)）。
* 验证 bech32 中的见证版本，避免缓冲区溢出。[#96671](https://github.com/ClickHouse/ClickHouse/pull/96671)（[Raúl Marín](https://github.com/Algunenano)）。
* 修复使用无效 `auth_header` 设置创建数据湖 REST catalog 后，`system.tables` 返回错误的问题。[#96680](https://github.com/ClickHouse/ClickHouse/pull/96680)（[Han Fei](https://github.com/hanfei1991)）。
* 修复 TTL 合并后数据块中的所有行均被过滤时，`min(timestamp)` 通过 `_minmax_count_projection` 返回纪元时间（`1970-01-01`）的问题。[#96703](https://github.com/ClickHouse/ClickHouse/pull/96703)（[Raquel Barbadillo](https://github.com/rbarbadillo)）。
* 改进 `iceberg_metadata_file_path` 设置的验证，防止路径遍历，并确保指定的元数据文件位于表目录内。[#96754](https://github.com/ClickHouse/ClickHouse/pull/96754)（[Daniil Ivanik](https://github.com/divanik)）。
* 修复 `GROUP BY` 中使用带 `Variant` 参数的 `ifNull` 时发生的崩溃。[#96790](https://github.com/ClickHouse/ClickHouse/pull/96790)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复设置 `table_disk=1` 的表之间发生缓存键冲突的问题。[#96818](https://github.com/ClickHouse/ClickHouse/pull/96818)（[Raufs Dunamalijevs](https://github.com/rienath)）。
* 修复竞争条件导致 MemoryWorker 清理线程卡住的问题。[#96819](https://github.com/ClickHouse/ClickHouse/pull/96819)（[Antonio Andelic](https://github.com/antonio2368)）。
* 不再记录 Iceberg catalog 中包含凭据的数据。[#96831](https://github.com/ClickHouse/ClickHouse/pull/96831)（[Konstantin Vedernikov](https://github.com/scanhex12)）。
* 修复服务器出错后 clickhouse-client 的退出状态。[#96841](https://github.com/ClickHouse/ClickHouse/pull/96841)（[Vitaly Baranov](https://github.com/vitlibar)）。
* 含 CROSS JOIN 且启用并行副本的查询可能返回错误结果；现已修复。修复 [#74337](https://github.com/ClickHouse/ClickHouse/issues/74337)。[#96848](https://github.com/ClickHouse/ClickHouse/pull/96848)（[Igor Nikonov](https://github.com/devcrafter)）。
* 修复同一列此前执行过轻量级更新后，`ALTER TABLE DROP COLUMN` 查询失败的问题。[#96861](https://github.com/ClickHouse/ClickHouse/pull/96861)（[Anton Popov](https://github.com/CurtizJ)）。
* 修复在 `plain_rewritable` 对象存储磁盘上创建归档备份（`.zip`、`.tzst`）时的栈溢出（崩溃）。[#96872](https://github.com/ClickHouse/ClickHouse/pull/96872)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复目标文件系统磁盘已满或发生其他 I/O 错误导致备份失败时服务器崩溃的问题。[#96873](https://github.com/ClickHouse/ClickHouse/pull/96873)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 `EXCEPT ALL` 和 `INTERSECT ALL` 忽略行重数、表现得与对应 `DISTINCT` 操作相同的问题。[#96876](https://github.com/ClickHouse/ClickHouse/pull/96876)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复以不兼容类型调用 `indexOfAssumeSorted`（如 `IPv4` 数组与整数搜索值）时的 `std::terminate` 异常。[#96877](https://github.com/ClickHouse/ClickHouse/pull/96877)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复在 `group_by_use_nulls = 1` 及 CUBE/ROLLUP/GROUPING SETS 下使用窗口函数时的 `Bad cast from type DB::ColumnNullable to DB::ColumnString` 异常。[#96878](https://github.com/ClickHouse/ClickHouse/pull/96878)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 JIT 编译表达式将 `DateTime` 转换为 `DateTime64` 时（如混用 DateTime 类型的 `CASE`/`if`/`multiIf`）结果不正确的问题。此前值被重新解释而未正确缩放，表达式开始编译后会生成错误时间戳。[#96879](https://github.com/ClickHouse/ClickHouse/pull/96879)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复跳数索引表达式生成常量列时 `CoalescingMergeTree` 中的逻辑错误异常（例如对整数列的 `ifNotFinite(1, c0)` 使用 `bloom_filter`）。[#96880](https://github.com/ClickHouse/ClickHouse/pull/96880)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复误用 HTTP 连接启用 TLS 的原生协议端口时，错误消息中的端口号不正确的问题。[#96881](https://github.com/ClickHouse/ClickHouse/pull/96881)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复每个子查询的 `SETTINGS` 未应用到 CTE 和子查询中的 `file` 等表函数的问题。[#96882](https://github.com/ClickHouse/ClickHouse/pull/96882)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复读取 X509 证书时 BIO 对象的内存泄漏。[#96885](https://github.com/ClickHouse/ClickHouse/pull/96885)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复在需要具体值的位置传入 lambda 表达式时（如作为 `arrayFold` 的累加器参数），查询分析器抛出 `LOGICAL_ERROR` 的问题。[#96892](https://github.com/ClickHouse/ClickHouse/pull/96892)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复转换复杂嵌套类型（由含 Nullable Enum 值 Map 的 Nullable Tuple 所组成的 Array）时出现的 `ColumnNullable is not compatible with original` 异常。[#96924](https://github.com/ClickHouse/ClickHouse/pull/96924)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复分片 `HASHED` 字典并行加载中的竞争条件，该问题偶尔会导致部分行未被加载。[#96953](https://github.com/ClickHouse/ClickHouse/pull/96953)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 `REPLACE PARTITION` 与后台变更之间的竞争条件，该问题可能导致替换后新旧数据同时可见。[#96955](https://github.com/ClickHouse/ClickHouse/pull/96955)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 `arrayJoin` 与 INNER JOIN、WHERE 子句组合使用时产生重复行的问题；原因是部分谓词下推优化错误地将含 `arrayJoin` 的过滤器下推到 JOIN 之下。[#96989](https://github.com/ClickHouse/ClickHouse/pull/96989)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 `clearCaches` 中的崩溃（SEGFAULT）：`BlockIO::operator=` 未移动 `query_metadata_cache`，导致缓存的存储快照被过早销毁，并对 `MergeTreeData` 存储发生释放后使用。[#96995](https://github.com/ClickHouse/ClickHouse/pull/96995)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 `if` 或 `transform` 函数返回 `Nullable(String)` 时 `IfTransformStringsToEnumPass` 中的断言失败（例如使用 `GROUP BY ... WITH CUBE` 且 `group_by_use_nulls = true`）。[#97002](https://github.com/ClickHouse/ClickHouse/pull/97002)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 `INSERT ... SELECT` 与 `UNION ALL`、`JOIN` 组合时写入错误数据的问题：数据块合并后，常量字符串列可能收到错误值。[#97019](https://github.com/ClickHouse/ClickHouse/pull/97019)（[Hasyimi Bahrudin](https://github.com/hasyimibhar)）。
* 修复 `ALTER TABLE MODIFY COLUMN` 更改列类型后构建列统计信息时的 `assert_cast` 异常（或 Release 构建中的静默数据损坏）。[#97027](https://github.com/ClickHouse/ClickHouse/pull/97027)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 Azure Blob Storage、SSH 协议和 Arrow Flight 接口读取未初始化内存的问题。[#97053](https://github.com/ClickHouse/ClickHouse/pull/97053)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复索引影响带行策略/PREWHERE 和 FINAL 查询结果的问题。[#97076](https://github.com/ClickHouse/ClickHouse/pull/97076)（[Yarik Briukhovetskyi](https://github.com/yariks5s)）。
* 修复 `MergeTree` 表中 `REPLACE PARTITION` 与后台变更之间残留的竞争条件，该问题可能导致旧数据重新出现。[#97105](https://github.com/ClickHouse/ClickHouse/pull/97105)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复别名列的隐式索引，并在创建前执行完整验证。[#97115](https://github.com/ClickHouse/ClickHouse/pull/97115)（[Raúl Marín](https://github.com/Algunenano)）。
* 修复 `FunctionVariantAdaptor` 处理 `arrayROCAUC` 等要求常量参数的函数时的逻辑错误。[#97116](https://github.com/ClickHouse/ClickHouse/pull/97116)（[Bharat Nallan](https://github.com/bharatnc)）。
* 修复 `PartCheckThread` 为已经变更的数据片段重新将 `GET_PART` 入队，并在 `parts_to_do` 中留下幽灵条目而导致变更卡住的问题。[#97162](https://github.com/ClickHouse/ClickHouse/pull/97162)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复对含 `ORDER BY ... LIMIT` 子查询的查询计划行数估算，该问题可能使优化器选择次优 JOIN 顺序。[#97193](https://github.com/ClickHouse/ClickHouse/pull/97193)（[Alexander Gololobov](https://github.com/davenger)）。
* 修复操作 Variant 列的函数返回 `Nothing` 类型时 `FunctionVariantAdaptor` 中的 `LOGICAL_ERROR` 异常；该情况可能出现在 `UNION ALL` 查询的空数组中。[#97213](https://github.com/ClickHouse/ClickHouse/pull/97213)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 S3 多段复制操作（如向 S3 执行 `BACKUP`/`RESTORE`）期间的数据竞争，该问题可能在并发访问时引发异常。[#97227](https://github.com/ClickHouse/ClickHouse/pull/97227)（[Azat Khuzhin](https://github.com/azat)）。
* 修复 `WHERE` 子句中的 `arrayJoin` 引用 `JOIN` 两侧列时出现的 `LOGICAL_ERROR` 异常。[#97239](https://github.com/ClickHouse/ClickHouse/pull/97239)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复使用 PREWHERE 读取 Tuple 中稀疏 `Nullable(String)` 的 `.size` 子列时出现的 `LOGICAL_ERROR` 异常。[#97264](https://github.com/ClickHouse/ClickHouse/pull/97264)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复使用 `ORDER BY ... LIMIT` 从非自适应索引粒度（`index_granularity_bytes = 0`）的表读取时，`LazyMaterializingTransform` 出现“Number of rows in lazy chunk does not match number of offsets”异常的问题。[#97270](https://github.com/ClickHouse/ClickHouse/pull/97270)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 `SYSTEM RESTART REPLICA` 在表重建因非 ZooKeeper 异常（如内存限制）失败时会从数据库中丢失该表，并导致 `DatabaseReplicated` 元数据摘要不匹配的问题。[#97276](https://github.com/ClickHouse/ClickHouse/pull/97276)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* `system.merge_tree_settings` 中的 `readonly` 字段现在会正确反映某些 MergeTree 设置（如 `index_granularity`）无条件只读。[#97277](https://github.com/ClickHouse/ClickHouse/pull/97277)（[Robert Schulze](https://github.com/rschu1ze)）。
* 修复在无数据情况下创建存储快照后，`MergeTree` 表执行 `count()` 优化时发生的崩溃。[#97281](https://github.com/ClickHouse/ClickHouse/pull/97281)（[Pablo Marcos](https://github.com/pamarcos)）。
* 修复从堆栈跟踪的调试信息解析函数名时可能发生的崩溃。[#97294](https://github.com/ClickHouse/ClickHouse/pull/97294)（[Azat Khuzhin](https://github.com/azat)）。
* 修复 analyzer\_compatibility\_join\_using\_top\_level\_identifier 与 ALIAS 列组合时的逻辑错误。关闭 [#96228](https://github.com/ClickHouse/ClickHouse/issues/96228)。[#97297](https://github.com/ClickHouse/ClickHouse/pull/97297)（[Vladimir Cherkasov](https://github.com/vdimir)）。
* 修复对文本索引列使用 `QUALIFY` 子句时 `applyOrder` 中的 `LOGICAL_ERROR` 异常。[#97313](https://github.com/ClickHouse/ClickHouse/pull/97313)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 系统表 `system.functions` 现在为内部函数显示 `categories = 'Internal'`，而不再是 `categories = ''`。[#97315](https://github.com/ClickHouse/ClickHouse/pull/97315)（[Robert Schulze](https://github.com/rschu1ze)）。
* 修复包含 RIGHT JOIN 链且启用并行副本的查询可能返回错误结果的问题。修复 [#74341](https://github.com/ClickHouse/ClickHouse/issues/74341)。[#97316](https://github.com/ClickHouse/ClickHouse/pull/97316)（[Igor Nikonov](https://github.com/devcrafter)）。
* 修复可刷新物化视图以及其他表重命名场景中可能出现的虚假 `TABLE_UUID_MISMATCH` 错误。[#97323](https://github.com/ClickHouse/ClickHouse/pull/97323)（[Azat Khuzhin](https://github.com/azat)）。
* 修复 `StorageKeeperMap` 备份中的段错误：延迟备份批次内悬空的存储指针发生释放后使用。[#97336](https://github.com/ClickHouse/ClickHouse/pull/97336)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复启用 `mutations_execute_subqueries_on_initiator` 时，`ALTER UPDATE/DELETE` 内含标量子查询的 `exists` 函数。此前标量子查询会被错误求值，可能导致错误或生成损坏的变更命令，使表在服务器下次重启时无法加载。[#97347](https://github.com/ClickHouse/ClickHouse/pull/97347)（[Kirill Kopnev](https://github.com/Fgrtue)）。
* 修复 NULL 与包含 LowCardinality 类型的 Variant 列比较时出现的 `Unexpected return type from equals. Expected Nullable(UInt8). Got Const(LowCardinality(Nullable(UInt8)))` 逻辑异常。[#97379](https://github.com/ClickHouse/ClickHouse/pull/97379)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复启用分片查询缓存时并行执行 `EXCHANGE TABLES` 可能出现的竞争条件。[#97411](https://github.com/ClickHouse/ClickHouse/pull/97411)（[Konstantin Vedernikov](https://github.com/scanhex12)）。
* 修复 Array 转 `QBit` 时的 `LOGICAL_ERROR` 异常：外层 `Tuple` 包装器的 `nullable_source` 用不匹配的列类型替换了转换后的数组列。关闭 [#97389](https://github.com/ClickHouse/ClickHouse/issues/97389)。[#97413](https://github.com/ClickHouse/ClickHouse/pull/97413)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复括号内带别名元组字面量的 AST 格式化往返不一致，例如 `(('a', 'b') AS x)` 曾被错误重排为 `tuple(('a', 'b') AS x)`。[#97418](https://github.com/ClickHouse/ClickHouse/pull/97418)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复启用去重的异步插入中，解析失败产生零行空数据块时出现的异常。[#97460](https://github.com/ClickHouse/ClickHouse/pull/97460)（[Sema Checherinda](https://github.com/CheSema)）。
* 修复使用 `ORDER BY ... LIMIT` 从非自适应索引粒度（`index_granularity_bytes = 0`）的表读取时，`LazyMaterializingTransform` 出现“Number of rows in lazy chunk does not match number of offsets”异常的问题。[#97482](https://github.com/ClickHouse/ClickHouse/pull/97482)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 Iceberg 插入设置，并为 `allow_experimental_insert_into_iceberg` 设置增加别名。[#97483](https://github.com/ClickHouse/ClickHouse/pull/97483)（[Konstantin Vedernikov](https://github.com/scanhex12)）。
* 修复 `optimize_inverse_dictionary_lookup` 优化重写 `dictGet(...)` 谓词时，没有 `CREATE TEMPORARY TABLE` 权限的用户遇到 `ACCESS_DENIED` 的问题。ClickHouse 现在会跳过重写并执行原始表达式。关闭 [#97269](https://github.com/ClickHouse/ClickHouse/issues/97269)。[#97484](https://github.com/ClickHouse/ClickHouse/pull/97484)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 修复 `Set` 和 `MergeTreeIndexSet` 处理含内部稀疏子列的列（如来自采用不同稀疏序列化配置的 MergeTree 数据片段的 `Tuple` 列）时的断言失败（调试/消毒器构建中表现为异常）。[#97493](https://github.com/ClickHouse/ClickHouse/pull/97493)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 StorageKafka2 中可能发生的释放后使用。[#97520](https://github.com/ClickHouse/ClickHouse/pull/97520)（[Bharat Nallan](https://github.com/bharatnc)）。
* 修复输出路径包含目录时，`INTO OUTFILE` 与 `TRUNCATE`、`into_outfile_create_parent_directories` 设置组合使用的问题。[#97549](https://github.com/ClickHouse/ClickHouse/pull/97549)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复启用分析器后，通过 `merge()` 表函数查询 ALIAS 列内含 lambda 表达式的表时出现的 `BAD_ARGUMENTS` 错误。[#97551](https://github.com/ClickHouse/ClickHouse/pull/97551)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 Keeper zxid 为 0 时 `system.zookeeper_info` 出现的异常。[#97553](https://github.com/ClickHouse/ClickHouse/pull/97553)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 `ip_trie` 字典键类型不是 String 时可能出现的逻辑错误。[#97555](https://github.com/ClickHouse/ClickHouse/pull/97555)（[Bharat Nallan](https://github.com/bharatnc)）。
* 修复 REST catalog OAuth 认证不适用于基础 `RestCatalog`（此前仅适用于 `OneLakeCatalog` 等派生 catalog）的问题。引入 BigLake catalog 后，该问题破坏了默认 REST catalog。[#97561](https://github.com/ClickHouse/ClickHouse/pull/97561)（[Konstantin Vedernikov](https://github.com/scanhex12)）。
* 几何函数（`perimeterSpherical`、`areaSpherical` 等）除 `Geometry` 变体类型外，现在还接受单独的几何子类型（`Polygon`、`Ring`、`Point` 等）。[#97571](https://github.com/ClickHouse/ClickHouse/pull/97571)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复对 `Nullable(Tuple(... Nullable(T) ...))` 类型的子列使用 `isNull`/`isNotNull` 时出现的 `LOGICAL_ERROR` 异常。关闭 [#97224](https://github.com/ClickHouse/ClickHouse/issues/97224)。[#97582](https://github.com/ClickHouse/ClickHouse/pull/97582)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复轻量级更新期间应用补丁数据片段时的空指针解引用。[#97583](https://github.com/ClickHouse/ClickHouse/pull/97583)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* `BaseSettings::readBinary` 将 `accessor.find` 返回的索引传给 `field_infos[]` 时，未检查“未找到”哨兵值（即 `-1`），可能导致 `std::vector` 越界访问。libcxx 强化机制捕获了该问题。它可能发生在查询计划反序列化期间：较新服务器向较旧服务器发送后者未知的设置。基于字符串的读取方法已正确处理这种情况，`readBinary` 此前缺少相同检查。[#97585](https://github.com/ClickHouse/ClickHouse/pull/97585)（[Miсhael Stetsyuk](https://github.com/mstetsyuk)）。
* 修复 `UNION ALL` 查询中某个分支具有恒假谓词时结果不正确的问题——该分支此前会错误读取数据，而不是不返回任何内容。[#97620](https://github.com/ClickHouse/ClickHouse/pull/97620)（[Bharat Nallan](https://github.com/bharatnc)）。
* 修复包含单列引用的 `IN (col)` 以 `UNSUPPORTED_METHOD` 错误失败的问题。[#97646](https://github.com/ClickHouse/ClickHouse/pull/97646)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 `GROUP BY ... WITH ROLLUP/CUBE` 的键在 `Nullable(Tuple(...))` 内包含 `LowCardinality(Nullable(...))` 时出现的逻辑错误异常。[#97647](https://github.com/ClickHouse/ClickHouse/pull/97647)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 `NOT (1, 1, 1)` 的 AST 格式化不一致，该问题可能在调试构建中导致 `LOGICAL_ERROR`。[#97653](https://github.com/ClickHouse/ClickHouse/pull/97653)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 `keeper-converter` 遇到空 ZooKeeper 事务日志文件时出现的异常。[#97673](https://github.com/ClickHouse/ClickHouse/pull/97673)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。

<h4 id="262-build-testing-packaging-improvement">
  构建、测试与打包改进
</h4>

* ClickHouse 现在可以使用 clang-23（master）构建。[#95578](https://github.com/ClickHouse/ClickHouse/pull/95578)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复配置 `bind_host` 时强制将 `is_local` 设为 false 的问题，并以集成测试替代。此为 [#74741](https://github.com/ClickHouse/ClickHouse/pull/74741) 的后续改进。[#93109](https://github.com/ClickHouse/ClickHouse/pull/93109) [#96018](https://github.com/ClickHouse/ClickHouse/pull/96018)（[Zhigao Hong](https://github.com/zghong)）。
* 压力测试：修复 CI 中的压力与升级测试；忽略 `no-{build}` 标签；增加兼容性随机化。[#94693](https://github.com/ClickHouse/ClickHouse/pull/94693)（[Nikita Fomichev](https://github.com/fm4v)）。
* 从构建中发布 parser\_memory\_profiler 二进制文件，该工具可用于分析 AST 内存消耗。[#95826](https://github.com/ClickHouse/ClickHouse/pull/95826)（[Ilya Yatsishin](https://github.com/qoega)）。
* 为 `parser_memory_profiler` 工具新增 `--symbolize` 标志，可生成结果中符号已解析的 `.heap.sym` 文件。[#96477](https://github.com/ClickHouse/ClickHouse/pull/96477)（[Ilya Yatsishin](https://github.com/qoega)）。
* 将集成测试中的第三方 Docker 镜像固定到具体版本。[#96500](https://github.com/ClickHouse/ClickHouse/pull/96500)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 恢复动态链接 `OpenSSL` 的能力。该方式不受推荐，也未用于任何生产构建，但仍为有需要的用户保留这一选项。[#96506](https://github.com/ClickHouse/ClickHouse/pull/96506)（[Govind R Nair](https://github.com/Revertionist)）。
* 通过为 `Coordination::OpNum` 使用类型专用特化，将 `magic_enum` 范围从 \[-100, 1000] 缩减为默认的 \[-128, 127]，从而缩短构建时间。[#96632](https://github.com/ClickHouse/ClickHouse/pull/96632)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 从 Function 类中移除不必要的 C++ 模板，以缩短构建时间。[#96646](https://github.com/ClickHouse/ClickHouse/pull/96646)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 将 `StorageSystemLicenses` 生成移至配置阶段，以提高构建并行度。[#96697](https://github.com/ClickHouse/ClickHouse/pull/96697)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 并行执行许可证扫描。[#96727](https://github.com/ClickHouse/ClickHouse/pull/96727)（[Raúl Marín](https://github.com/Algunenano)）。
* 为 SSH 协议支持新增无状态功能测试。[#96996](https://github.com/ClickHouse/ClickHouse/pull/96996)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 将 Kafka 3.9.0 加入无状态功能测试基础设施，可直接测试以 ClickHouse Keeper 充当 ZooKeeper 的 Kafka 和 Kafka2 表引擎。六项新增无状态测试覆盖基本生产/消费、虚拟列、INSERT、多种格式、损坏消息处理及基于 Keeper 的偏移量存储。[#96997](https://github.com/ClickHouse/ClickHouse/pull/96997)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 新增 CI 工作流，用于构建经 PGO+BOLT 优化的 clang 工具链。[#96991](https://github.com/ClickHouse/ClickHouse/pull/96991)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* CI 改用经 PGO 优化的 LLVM/Clang 构建，预计可将构建速度提高 20%～30%。[#97031](https://github.com/ClickHouse/ClickHouse/pull/97031)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 使用 llvm-libc 实现替换 glibc 的数学函数。[#90151](https://github.com/ClickHouse/ClickHouse/pull/90151)（[Konstantin Bogdanov](https://github.com/thevar1able)）。
* 将 Boost 从 1.83 升级至 1.90，修复调试构建中的 `devector` 断言失败。[#97037](https://github.com/ClickHouse/ClickHouse/pull/97037)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 将 `postgres` 更新至 REL\_18\_1。[#95189](https://github.com/ClickHouse/ClickHouse/pull/95189)（[Konstantin Bogdanov](https://github.com/thevar1able)）。
* 使用 `libexpat` 2.7.3。[#95218](https://github.com/ClickHouse/ClickHouse/pull/95218)（[Konstantin Bogdanov](https://github.com/thevar1able)）。
* 使用 `OpenSSL` 3.5.5。[#95345](https://github.com/ClickHouse/ClickHouse/pull/95345)（[Konstantin Bogdanov](https://github.com/thevar1able)）。
* 使用 `simdjson` v4.2.4。[#97129](https://github.com/ClickHouse/ClickHouse/pull/97129)（[Konstantin Bogdanov](https://github.com/thevar1able)）。
* 使用 `libarchive` 3.8.5。[#97131](https://github.com/ClickHouse/ClickHouse/pull/97131)（[Konstantin Bogdanov](https://github.com/thevar1able)）。
* 使用 `fast_float` v8.2.3。[#97133](https://github.com/ClickHouse/ClickHouse/pull/97133)（[Konstantin Bogdanov](https://github.com/thevar1able)）。
* 使用 `abseil-cpp` 20260107.1，并将 `s2geometry` 更新至 v0.13.1。[#97134](https://github.com/ClickHouse/ClickHouse/pull/97134)（[Konstantin Bogdanov](https://github.com/thevar1able)）。
* 将 `libxml2` 升级至 2.15.1。[#95574](https://github.com/ClickHouse/ClickHouse/pull/95574)（[Robert Schulze](https://github.com/rschu1ze)）。
* 将 7 个 Tier-3 集成测试 Docker 镜像从已 EOL 或已移除的基础镜像升级到当前受支持版本。[#97314](https://github.com/ClickHouse/ClickHouse/pull/97314)（[Rahul](https://github.com/motsc)）。
* 新增 TPC-DS 基准查询。[#97349](https://github.com/ClickHouse/ClickHouse/pull/97349)（[Raufs Dunamalijevs](https://github.com/rienath)）。
* 使用单一数值型 `X86_ARCH_LEVEL` 选项（`1`/`2`/`3`/`4`）替代各个 x86 指令集 CMake 选项（`ENABLE_SSSE3`、`ENABLE_AVX2`、`NO_SSE3_OR_HIGHER`、`ARCH_NATIVE` 等），与运行时分派系统已采用的标准 x86-64 微架构级别保持一致。[#97354](https://github.com/ClickHouse/ClickHouse/pull/97354)（[Raúl Marín](https://github.com/Algunenano)）。
* 避免为 `FunctionBinaryArithmetic` 中的非除法操作实例化 `division_by_nullable=true` 模板变体，从而缩短编译时间并减小二进制体积。[#97496](https://github.com/ClickHouse/ClickHouse/pull/97496)（[Raúl Marín](https://github.com/Algunenano)）。
* 从 `typeid_cast.h`、`assert_cast.h`、`Context_fwd.h`、`IDataType.h` 以及多个 Column 头文件等高扇出头文件中移除 `Exception.h`，以减少其包含影响范围。[#97497](https://github.com/ClickHouse/ClickHouse/pull/97497)（[Raúl Marín](https://github.com/Algunenano)）。
* 始终使用随附的 `compiler-rt` 头文件（sanitizer 与 XRay 接口）而非宿主编译器头文件，并默认从源码构建 `compiler-rt` 库。[#97499](https://github.com/ClickHouse/ClickHouse/pull/97499)（[Raúl Marín](https://github.com/Algunenano)）。
* 在 `long double` 能力足够的平台上，避免在 `wide_integer_impl.h` 中包含 boost/multiprecision 头文件，从而缩短构建时间。[#96633](https://github.com/ClickHouse/ClickHouse/pull/96633)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 实现 LLVM 代码覆盖率任务，并首先为 master 分支启用。[#90952](https://github.com/ClickHouse/ClickHouse/pull/90952)（[Alexey Bakharew](https://github.com/alexbakharew)）。
* 为 Release 构建启用快速 libcxx 强化，主要用于越界检查。根据性能测试结果，预计不会带来可感知的性能影响。[#94757](https://github.com/ClickHouse/ClickHouse/pull/94757)（[Miсhael Stetsyuk](https://github.com/mstetsyuk)）。
