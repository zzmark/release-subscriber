<h3 id="263">
  ClickHouse 26.3 LTS 版本发布，2026-03-26。[演示文稿](https://presentations.clickhouse.com/2026-release-26.3/)，[视频](https://www.youtube.com/watch?v=_bY0ucNB1lQ)
</h3>


<h4 id="263-backward-incompatible-change">
  向后不兼容变更
</h4>

* 升级后再降级可能会导致数据丢失。数据类型的序列化版本现在会传播到嵌套数据类型中。例如，String 序列化版本 `with_size_stream` 以前仅应用于顶层 String 列和 Tuple 元素；现在它会应用于任意嵌套类型中的任何 String 类型，例如 `Array`/`Map`/`Variant`/`JSON`/等。此行为由 MergeTree setting `propagate_types_serialization_versions_to_nested_types` 控制，该设置现已默认启用。此变更后，新创建的数据分区片段将无法被旧版本读取，但旧的数据分区片段可以在新版本中正常读取。**升级是安全的，但降级不是——如果你在升级到 26.3 后需要回滚，26.3 在包含嵌套类型的列中写入的数据将无法读取！** 详情参见 [#101429](https://github.com/ClickHouse/ClickHouse/issues/101429)。[#94859](https://github.com/ClickHouse/ClickHouse/pull/94859) ([Pavel Kruglov](https://github.com/Avogar)) 。
* 移除 `hypothesis` 跳过索引类型。它是一个较为冷门的 Experimental 功能，实际用途有限。现在，使用 `INDEX ... TYPE hypothesis` 创建表会报错。[#96874](https://github.com/ClickHouse/ClickHouse/pull/96874) ([Alexey Milovidov](https://github.com/alexey-milovidov)) 。
* 移除实验性的 `detectProgrammingLanguage` 函数。[#99567](https://github.com/ClickHouse/ClickHouse/pull/99567) ([Alexey Milovidov](https://github.com/alexey-milovidov)) 。
* 修复 `NOT` 运算符的优先级，使其符合 SQL 标准：`NOT` 现在的结合优先级低于 `IS NULL`、`BETWEEN`、`LIKE` 和算术运算符。例如，`NOT (x) IS NULL` 现在会被解析为 `NOT (x IS NULL)`，而不是 `(NOT x) IS NULL`。这可能会改变依赖此前 (非标准) 行为的查询结果。[#97680](https://github.com/ClickHouse/ClickHouse/pull/97680) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复了普通投影的元数据，以便正确识别具有多列排序键的投影。基于 [#90429](https://github.com/ClickHouse/ClickHouse/issues/90429)。[#91352](https://github.com/ClickHouse/ClickHouse/pull/91352) ([Amos Bird](https://github.com/amosbird)) 。
* 修复了跳过索引文件未遵循 replace&#95;long&#95;file&#95;name&#95;to&#95;hash 设置的问题；该问题会导致出现“File name too long”错误，并使长名称索引无法正常读取。现在，当跳过索引文件名超过 max&#95;file&#95;name&#95;length 时，会像列文件一样对文件名进行哈希处理。此更改向后兼容 (新服务器可以读取旧 parts) ，但降级 (或在滚动升级期间使用旧服务器) 时，长名称索引可能会被忽略。[#97128](https://github.com/ClickHouse/ClickHouse/pull/97128) ([Raúl Marín](https://github.com/Algunenano)).
* 默认启用异步插入。ClickHouse 现在默认会将所有小型插入按批次处理。此设置在 compatibility 中配置。如果你设置 `compatibility=<version less than 26.2>`，则默认值会恢复为之前的 `false`。你可以在多个级别关闭/开启异步插入：在 users profiles 的 config 中、在 session 级别、在查询级别，或在 MergeTree 表级别。[#97590](https://github.com/ClickHouse/ClickHouse/pull/97590) ([Sema Checherinda](https://github.com/CheSema)).
* 将 `mysql_datatypes_support_level` 的默认值从空改为 `decimal,datetime64,date2Date32`，默认启用将 MySQL `DATE` 正确映射为 `Date32`、将 `DECIMAL`/`NUMERIC` 映射为 `Decimal`，以及将带精度的 `DATETIME`/`TIMESTAMP` 映射为 `DateTime64`。此前，MySQL `DATE` 列会映射为 `Date`，而 `Date` 无法表示 1970-01-01 之前的日期，从而导致数据损坏。[#97716](https://github.com/ClickHouse/ClickHouse/pull/97716) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* `mergeTreeAnalyzeIndexes{,UUID}` 现已接受分片名称数组而非 regexp，因为 regexp 较慢 (*Experimental 功能*) 。[#98474](https://github.com/ClickHouse/ClickHouse/pull/98474) ([Azat Khuzhin](https://github.com/azat)) 。
* 将可执行 UDF 的默认 `stderr_reaction` 从 `throw` 调整为 `log_last`。对于向 stderr 写入警告的 UDF，只要退出码为 0，就不再报错。现在，退出码异常中会包含 stderr 的内容。[#99232](https://github.com/ClickHouse/ClickHouse/pull/99232) ([Xu Jia](https://github.com/XuJia0210)) 。


<h4 id="263-new-feature">
  新功能
</h4>

* 为 MergeTree 中的 Map 列新增了分桶序列化 (`map_serialization_version = 'with_buckets'`) 。键会按基于哈希的桶拆分，因此读取单个键 (`m['key']`) 时只需读取一个桶，而不必读取整个列；根据 Map 的大小不同，单键查找可获得 2-49 倍的加速。桶的数量以及分桶策略可通过新的 MergeTree 设置进行控制：`map_serialization_version`、`max_buckets_in_map`、`map_buckets_strategy`、`map_buckets_coefficient` 和 `map_buckets_min_avg_size`。[#99200](https://github.com/ClickHouse/ClickHouse/pull/99200) ([Pavel Kruglov](https://github.com/Avogar)) 。
* 支持 materialized CTE。允许在查询执行期间仅计算一次 CTE，并将结果存储在临时表中。关闭了 [#53449](https://github.com/ClickHouse/ClickHouse/issues/53449)。[#94849](https://github.com/ClickHouse/ClickHouse/pull/94849) ([Dmitry Novik](https://github.com/novikd)) 。
* 出于兼容性考虑，允许某些符合 SQL 标准的函数省略括号使用，例如 `NOW`。关闭 [#52102](https://github.com/ClickHouse/ClickHouse/issues/52102)。[#95949](https://github.com/ClickHouse/ClickHouse/pull/95949) ([Aly Kafoury](https://github.com/AlyHKafoury)) 。
* 现在可以将自然排序键函数用作 `naturalSortKey(s)`。[#90322](https://github.com/ClickHouse/ClickHouse/pull/90322) ([Nazarii Piontko](https://github.com/nazarii-piontko)) 。
* 现在，JSONExtract 函数已支持使用原生 JSON/Object 作为输入。修复了 [#88370](https://github.com/ClickHouse/ClickHouse/issues/88370)。[#96711](https://github.com/ClickHouse/ClickHouse/pull/96711) ([Fisnik Kastrati](https://github.com/fkastrati)) 。
* 如果某个查询参数的类型为 `Nullable`，且未指定该参数，我们将假定其值为 `NULL`。[#93869](https://github.com/ClickHouse/ClickHouse/pull/93869) ([Vikash Kumar](https://github.com/vikashkumar2020)) 。
* 支持 `Replicated` database 使用辅助 ZooKeeper。 [#95590](https://github.com/ClickHouse/ClickHouse/pull/95590) ([RinChanNOW](https://github.com/RinChanNOWWW)).
* 支持对 JSON 类型使用 `has` 函数来检查路径是否存在，类似于 Map。[#96927](https://github.com/ClickHouse/ClickHouse/pull/96927) ([DQ](https://github.com/il9ue)).
* 新增了 `mergeTreeTextIndex(database, table, index)` 表函数，支持直接从文本索引中读取数据。该函数可用于查看内部信息，或基于文本索引数据执行聚合。[#97003](https://github.com/ClickHouse/ClickHouse/pull/97003) ([Anton Popov](https://github.com/CurtizJ)).
* 新增 `table_readonly` MergeTree setting，用于将表标记为只读，防止插入和修改。[#97652](https://github.com/ClickHouse/ClickHouse/pull/97652) ([Alexey Milovidov](https://github.com/alexey-milovidov)) 。
* 新增设置 `use_partition_pruning` 及其别名 `use_partition_key`。将其设为 `false` 可禁用基于分区键的分区裁剪。[#97888](https://github.com/ClickHouse/ClickHouse/pull/97888) ([Nihal Z. Miaji](https://github.com/nihalzp)) 。
* 支持对 Iceberg 表执行 `ALTER TABLE ... EXECUTE expire_snapshots('<timestamp>')`。 [#97904](https://github.com/ClickHouse/ClickHouse/pull/97904) ([murphy-4o](https://github.com/murphy-4o))。 [#99130](https://github.com/ClickHouse/ClickHouse/pull/99130)
* 允许 `<protocols>` 中的每个 `type=http` 条目指定一个自定义 `<handlers>` 键，使其指向单独的 `<http_handlers_*>` config 部分，从而可为每个端口启用不同的 HTTP 路由规则。[#98414](https://github.com/ClickHouse/ClickHouse/pull/98414) ([Amos Bird](https://github.com/amosbird)) 。
* 为 `EXPLAIN` 新增 `pretty=1` 选项，以生成树状缩进输出；并新增 `compact=1`，用于折叠 `Expression` 步骤，使查询计划更易读。[#98500](https://github.com/ClickHouse/ClickHouse/pull/98500) ([Kirill Kopnev](https://github.com/Fgrtue)) 。
* 新增 `restore_access_entities_with_current_grants` 服务器设置。启用后，从 backups 中恢复的用户/roles，其授权将限制在执行 restoring 的用户有权授予的范围内 (与 `GRANT CURRENT GRANTS` 的语义相同) ，而不会因 `ACCESS_DENIED` 失败。[#98795](https://github.com/ClickHouse/ClickHouse/pull/98795) ([pufit](https://github.com/pufit)).
* 新增 `caseFoldUTF8` 和 `removeDiacriticsUTF8` 函数，用于 Unicode 大小写折叠和去除变音符号。[#98973](https://github.com/ClickHouse/ClickHouse/pull/98973) ([George Larionov](https://github.com/george-larionov)).
* 新增 `normalizeUTF8NFKCCasefold` 字符串函数，用于执行 NFKC&#95;Casefold Unicode 规范化，即将 NFKC 规范化与大小写折叠结合起来。[#99276](https://github.com/ClickHouse/ClickHouse/pull/99276) ([George Larionov](https://github.com/george-larionov)) 。
* 为全文索引和 `tokens` 函数新增 `unicode_word` 分词器。它依据 Unicode 单词边界规则拆分文本：ASCII 单词可包含连接符字符 (下划线、冒号、点、单引号) ，而非 ASCII 的 Unicode 字符则会被拆分为单字符标记。注意：26.3 仅接受名为 `unicode_word` 的此分词器；在 26.4 中它被重命名为 `asciiCJK`。[#99357](https://github.com/ClickHouse/ClickHouse/pull/99357) ([Amos Bird](https://github.com/amosbird)) 。
* 新增了 `max_skip_unavailable_shards_num` 和 `max_skip_unavailable_shards_ratio` 设置，用于限制在启用 `skip_unavailable_shards` 时可静默跳过的分片数。如果不可用分片的数量或占比超过配置的阈值，则会抛出异常，而不是静默返回不完整的结果。[#99369](https://github.com/ClickHouse/ClickHouse/pull/99369) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 用户现在可以在子查询表达式中使用 `SOME` 关键字，其行为与 `ANY` 完全一致。[#99842](https://github.com/ClickHouse/ClickHouse/pull/99842) ([Artem Kytkin](https://github.com/Vinceent)).
* 新增 `output_format_trim_fixed_string` 设置，用于在文本输出格式中去除 `FixedString` 值末尾的 null 字节。[#97558](https://github.com/ClickHouse/ClickHouse/pull/97558) ([NeedmeFordev](https://github.com/spider-yamet)).
* 支持在 FROM 子句中使用带括号的表 JOIN 表达式，例如 `SELECT * FROM (t1 CROSS JOIN t2)`。[#97650](https://github.com/ClickHouse/ClickHouse/pull/97650) ([Alexey Milovidov](https://github.com/alexey-milovidov)) 。
* 实现函数 `toDaysInMonth`：返回指定日期所在月份的天数。[#99227](https://github.com/ClickHouse/ClickHouse/pull/99227) ([Vitaly Baranov](https://github.com/vitlibar)) 。


<h4 id="263-experimental-feature">
  实验性功能
</h4>

* 新增对基于 WebAssembly 的用户自定义函数 (UDF) 的实验性支持，允许使用 WebAssembly 实现自定义函数逻辑，并在 ClickHouse 内执行。特别感谢 [Alexey Smirnov](https://github.com/lioshik) 贡献了 Wasmtime 后端支持。[#88747](https://github.com/ClickHouse/ClickHouse/pull/88747) ([Vladimir Cherkasov](https://github.com/vdimir)) 。另外，WASM UDF 支持也得到了持续改进。[#99373](https://github.com/ClickHouse/ClickHouse/pull/99373) ([Vasily Chekalkin](https://github.com/bacek)) 。
* 新增通过 `polyglot` 库支持外部 SQL 方言的功能。[#99496](https://github.com/ClickHouse/ClickHouse/pull/99496) ([Alexey Milovidov](https://github.com/alexey-milovidov)) 。
* 新增 `ALP` 浮点压缩编解码器 (对于不可压缩的 double，不带 ALP&#95;rd 回退机制) 。[#91362](https://github.com/ClickHouse/ClickHouse/pull/91362) ([Nazarii Piontko](https://github.com/nazarii-piontko)) 。
* 为 `JSON` 列新增实验性的惰性类型提示。通过 `allow_experimental_json_lazy_type_hints` 启用后，`ALTER TABLE ... MODIFY COLUMN json JSON(path TypeName)` 这类仅添加或修改类型提示的操作会立即完成，作为仅元数据操作执行，无需重写历史数据。对于旧 parts，类型提示会在查询时应用；在 INSERT 和后台 merges 期间则会被 materialized。[#97412](https://github.com/ClickHouse/ClickHouse/pull/97412) ([tanner-bruce](https://github.com/tanner-bruce)) 。
* 启用从 YTsaurus table engine 进行并行读取。[#97343](https://github.com/ClickHouse/ClickHouse/pull/97343) ([MikhailBurdukov](https://github.com/MikhailBurdukov)) 。


<h4 id="263-performance-improvement">
  性能改进
</h4>

* 提升数据湖性能。在早期版本中，从对象存储读取数据时，管道不会按处理线程数进行扩缩。这在多核机器上带来了数量级的性能提升 (约 40 倍) 。[#99548](https://github.com/ClickHouse/ClickHouse/pull/99548) ([Alexey Milovidov](https://github.com/alexey-milovidov)) 。
* 现在，`enable_parallel_replicas` 与 `automatic_parallel_replicas_mode` 之间的关系如下：只有当 `enable_parallel_replicas > 0` 时，查询才能使用并行副本。此外，如果 `automatic_parallel_replicas_mode=1`，则是否使用并行副本会在规划阶段根据之前收集的统计信息来决定。如果 `automatic_parallel_replicas_mode=0`，则所有受支持的查询都会使用并行副本，而不受任何统计信息影响。一个值得注意的例外是使用并行副本的 distributed insert-select：在这种情况下，查询始终会按 `automatic_parallel_replicas_mode=0` 的方式执行。[#97517](https://github.com/ClickHouse/ClickHouse/pull/97517) ([Nikita Taranov](https://github.com/nickitat)).
* 当谓词中包含任意比较运算符 (`=`, `<`, `>`, `!=`) ，且分区键外层套有确定性函数链时，可进行分区剪枝 (例如，`PARTITION BY x`，以及 `cityHash64(x) % 5 > 2`、`toYYYYMM(x) < 2026`、`toYYYYMM(x) = 2026` 或 `toYYYYMM(x) != 2026` 这样的谓词，都会利用分区键进行剪枝) 。关闭 [#28800](https://github.com/ClickHouse/ClickHouse/issues/28800)。[#98432](https://github.com/ClickHouse/ClickHouse/pull/98432) ([Nihal Z. Miaji](https://github.com/nihalzp)) 。
* 当 `CAST` 的目标类型为 `Nullable` 且转换具有单调性时，可启用按序读取优化和主键剪枝；例如，在 `PRIMARY KEY x` 的情况下，ClickHouse 可对 `ORDER BY x::Nullable(UInt64)` 使用按序读取优化，并对 `WHERE x::Nullable(UInt64) > 500000` 这类谓词应用主键剪枝。[#98482](https://github.com/ClickHouse/ClickHouse/pull/98482) ([Nihal Z. Miaji](https://github.com/nihalzp)).
* 当整型列与浮点数字面量比较时，现在支持索引裁剪和过滤器下推；例如，`WHERE x < 10.5` 这类谓词现在可以利用主键进行裁剪，而 `prime < 1e9` 或 `number < 1e5` 这类过滤器现在也可下推到 `primes()` 和 `numbers()` 表函数，而不再导致无界执行。关闭 [#85167](https://github.com/ClickHouse/ClickHouse/issues/85167)。[#98516](https://github.com/ClickHouse/ClickHouse/pull/98516) ([Nihal Z. Miaji](https://github.com/nihalzp)) 。
* 新增了一个用于 Parquet 元数据的 SLRU 缓存，无需仅为读取元数据而重新下载文件，从而提升了读取性能。[#98140](https://github.com/ClickHouse/ClickHouse/pull/98140) ([Grant Holly](https://github.com/grantholly-clickhouse)).
* 支持根据优化器统计信息交换 ANTI、SEMI 和 FULL join 的左右两侧。[#97498](https://github.com/ClickHouse/ClickHouse/pull/97498) ([Hechem Selmi](https://github.com/m-selmi)) 。
* 优化大型多边形场景下 `pointInPolygon` 的粒度跳过，并修复 `pointInPolygon` 索引分析在主键剪枝期间抛出异常的问题。[#91633](https://github.com/ClickHouse/ClickHouse/pull/91633) ([Nihal Z. Miaji](https://github.com/nihalzp)) 。
* 优化 `levenshteinDistance` 函数的性能。[#94543](https://github.com/ClickHouse/ClickHouse/pull/94543) ([Joanna Hulboj](https://github.com/jh0x)) 。
* 通过避免对每个元素单独调用函数，优化批次 Decimal 类型转换。 [#95923](https://github.com/ClickHouse/ClickHouse/pull/95923) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* Iceberg 表现已支持通过 `iceberg_metadata_async_prefetch_period_ms` 表设置异步预取元数据，该设置会定期预填充元数据缓存。此外，`iceberg_metadata_staleness_ms` 查询设置允许 SELECT 查询在缓存元数据的新鲜度高于指定 staleness 时直接使用缓存，从而避免在请求处理期间调用 Iceberg catalog。[#96191](https://github.com/ClickHouse/ClickHouse/pull/96191) ([Arsen Muk](https://github.com/arsenmuk)).
* `S3Queue` ordered 模式使用 S3 ListObjectsV2 StartAfter，以避免重新列出此前前缀下的全部历史对象，从而减少 ListObjects 调用。[#96370](https://github.com/ClickHouse/ClickHouse/pull/96370) ([Venkata  Vineel ](https://github.com/vyalamar)).
* 降低插入去重的内存占用。通常，去重需要保留原始块，但对于同步插入，可以省略它，从而真正节省内存。[#96661](https://github.com/ClickHouse/ClickHouse/pull/96661) ([Sema Checherinda](https://github.com/CheSema)) 。
* 缓存行大小改为使用与架构相关的值，而不是硬编码为 64。[#97357](https://github.com/ClickHouse/ClickHouse/pull/97357) ([Nikita Taranov](https://github.com/nickitat)) 。
* 对文本索引字典的读取进行了小幅优化，提升了文本索引分析的整体性能。[#97519](https://github.com/ClickHouse/ClickHouse/pull/97519) ([Anton Popov](https://github.com/CurtizJ)).
* 提升 ARM 上 16 字节块的 `LZ4` 解压缩速度。[#97774](https://github.com/ClickHouse/ClickHouse/pull/97774) ([Raúl Marín](https://github.com/Algunenano)) 。
* 将分词重构为新的高性能接口，以替换旧的迭代器风格 API，从而支持 SIMD 和有状态分词器。属于 [#90268](https://github.com/ClickHouse/ClickHouse/issues/90268) 的一部分。[#97871](https://github.com/ClickHouse/ClickHouse/pull/97871) ([Amos Bird](https://github.com/amosbird)) 。
* 改进了对同时包含已建立文本索引列和未建立索引列的组合条件查询进行文本索引分析时的性能。此前，在这种情况下，索引分析过程中的提前退出优化会被错误地禁用。[#98096](https://github.com/ClickHouse/ClickHouse/pull/98096) ([Anton Popov](https://github.com/CurtizJ)).
* 提升包含会生成超长数组或 Map 的常量表达式的查询性能。[#98287](https://github.com/ClickHouse/ClickHouse/pull/98287) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复了 `DateTime64` 主键与整数常量比较时的键条件分析问题；此前会导致无法进行粒度剪枝。[#98410](https://github.com/ClickHouse/ClickHouse/pull/98410) ([Amos Bird](https://github.com/amosbird)).
* 设置 `optimize_syntax_fuse_functions` 默认处于启用状态。[#98424](https://github.com/ClickHouse/ClickHouse/pull/98424) ([Alexey Milovidov](https://github.com/alexey-milovidov)) 。
* 通过使用本地累加器，而不是按行经由聚合状态进行存储转发，优化了 `avgWeighted` 聚合函数，对 Nullable 输入的性能最高可提升 27%。[#98793](https://github.com/ClickHouse/ClickHouse/pull/98793) ([Antonio Andelic](https://github.com/antonio2368)) 。
* 在某些场景下，可提升并行窗口函数的性能并降低内存占用；对于含大型数组的 `arrayFold` 工作负载也是如此。这还可以减轻缺页压力，并在内存限制较严时提高受影响查询的稳定性。[#98892](https://github.com/ClickHouse/ClickHouse/pull/98892) ([filimonov](https://github.com/filimonov)).
* 优化有序合并性能。[#99013](https://github.com/ClickHouse/ClickHouse/pull/99013) ([Artem Zuikov](https://github.com/4ertus2)) 。
* 优化了 `INTERSECT ALL` 和 `EXCEPT ALL`。[#99097](https://github.com/ClickHouse/ClickHouse/pull/99097) ([Raufs Dunamalijevs](https://github.com/rienath)) 。
* 支持在逆序读取时使用 `read_in_order_use_virtual_row` 优化。[#99198](https://github.com/ClickHouse/ClickHouse/pull/99198) ([Vladimir Cherkasov](https://github.com/vdimir)) 。
* 通过在写入前检查 JoinUsedFlags 是否已设置，减少 `RIGHT` 和 `FULL` JOIN 中的缓存争用。[#99274](https://github.com/ClickHouse/ClickHouse/pull/99274) ([Hechem Selmi](https://github.com/m-selmi)).
* 通过将浮点运算替换为纯整数运算，优化 `PrefetchingHelper::calcPrefetchLookAhead`，从而优化指令缓存布局，并减少聚合循环中的 CPU 周期开销。[#99327](https://github.com/ClickHouse/ClickHouse/pull/99327) ([Riyane El Qoqui](https://github.com/riyaneel)) 。
* 通过将用于存储节点子节点的 `absl::flat_hash_set` 替换为 `CompactChildrenSet`，降低了 Keeper 的内存占用。新容器可将 0–1 个子节点以内联方式存储，无需堆分配，这覆盖了绝大多数 Keeper 节点。这样可将 `KeeperMemNode` 的大小从 144 字节缩减到 128 字节。[#99860](https://github.com/ClickHouse/ClickHouse/pull/99860) ([Antonio Andelic](https://github.com/antonio2368)) 。
* 现已在视图中正确支持聚合投影。修复了 [#32753](https://github.com/ClickHouse/ClickHouse/issues/32753)。[#88798](https://github.com/ClickHouse/ClickHouse/pull/88798) ([Amos Bird](https://github.com/amosbird)) 。
* 支持在使用 `join_use_nulls` 时将 OUTER JOIN 转换为 INNER JOIN 的优化。关闭 [#90978](https://github.com/ClickHouse/ClickHouse/issues/90978)。[#95968](https://github.com/ClickHouse/ClickHouse/pull/95968) ([Vladimir Cherkasov](https://github.com/vdimir)) 。
* 通过在读取前正确计算大小，优化了子列读取。这减少了内存占用，并加快了子列读取速度。[#96251](https://github.com/ClickHouse/ClickHouse/pull/96251) ([Pavel Kruglov](https://github.com/Avogar)).
* 让标记缓存、未压缩缓存和页缓存使用各自独立的 jemalloc arena，以避免将短生命周期的内存分配 (即查询和请求的内存分配) 与缓存的长生命周期内存分配混用时产生内存碎片。 [#96812](https://github.com/ClickHouse/ClickHouse/pull/96812) ([Seva Potapov](https://github.com/seva-potapov)). [#98812](https://github.com/ClickHouse/ClickHouse/pull/98812). [#99021](https://github.com/ClickHouse/ClickHouse/pull/99021)
* 带有 `DELETE TTL` 规则的表现在也可以使用纵向合并算法。[#97332](https://github.com/ClickHouse/ClickHouse/pull/97332) ([murphy-4o](https://github.com/murphy-4o)).
* 在分布式索引分析中应用数据跳过索引。[#97767](https://github.com/ClickHouse/ClickHouse/pull/97767) ([Azat Khuzhin](https://github.com/azat)) 。
* 启用 `prewarm_mark_cache` 设置后，次级索引的标记现会被预热 (即在拉取数据分区片段期间以及表启动时加载到索引标记缓存中) 。[#97772](https://github.com/ClickHouse/ClickHouse/pull/97772) ([Anton Popov](https://github.com/CurtizJ)).
* 降低了访问控制期间的锁争用。[#97894](https://github.com/ClickHouse/ClickHouse/pull/97894) ([Nikita Taranov](https://github.com/nickitat)) 。
* 当 apply&#95;row&#95;policy&#95;after&#95;final 或 apply&#95;prewhere&#95;after&#95;final 处于启用状态时，行策略和 PREWHERE 中的复合 AND 条件现在会被拆解，以提取其中的排序键原子条件，用于主键索引分析。此前，如果延后应用的过滤条件同时包含排序键谓词和非排序键谓词 (例如 x &gt; 1 AND y != &#39;foo&#39;) ，整个表达式都会被排除在索引分析之外。现在，即使在嵌套的 AND 表达式中，也可以提取排序键原子条件 (如 x &gt; 1) 并将其用于粒度剪枝。[#98513](https://github.com/ClickHouse/ClickHouse/pull/98513) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 通过让任务资源在无需获取锁的情况下释放，减少 MergeTreeBackgroundExecutor 中的锁竞争。关闭 [#93620](https://github.com/ClickHouse/ClickHouse/issues/93620)。[#98604](https://github.com/ClickHouse/ClickHouse/pull/98604) ([Dmitry Novik](https://github.com/novikd)) 。
* 修复了在读取非 Arrow 数据时进行 format 自动检测期间内存占用过高 (约 514 MiB) 的问题 (例如来自 `url` 或 `file` 且未显式指定 format 的 JSON) ；原因是 ArrowStream 读取器将起始字节误识别为一个巨大的 metadata 长度。[#98893](https://github.com/ClickHouse/ClickHouse/pull/98893) ([Konstantin Bogdanov](https://github.com/thevar1able)).


<h4 id="263-improvement">
  改进
</h4>

* 支持解析在同一列中包含不同 Geo 类型的 GeoParquet 文件。[#97851](https://github.com/ClickHouse/ClickHouse/pull/97851) ([Mark Needham](https://github.com/mneedham)).
* 引入 `tokensForLikePattern` SQL 函数，用于对 LIKE 模式进行标记拆分，同时遵循通配符语义：`%` 和 `_` 视为通配符，转义后的通配符 (`\%`、`\_`) 视为字面量，与未转义通配符相邻的标记会被丢弃。[#97872](https://github.com/ClickHouse/ClickHouse/pull/97872) ([Amos Bird](https://github.com/amosbird)) 。
* 为 S3 表引擎新增 `{_schema_hash}` 占位符，用于将表列定义的哈希值插入到 S3 路径中。[#98265](https://github.com/ClickHouse/ClickHouse/pull/98265) ([Miсhael Stetsyuk](https://github.com/mstetsyuk)) 。
* `SymbolIndex`、`addressToSymbol`、`system.symbols` 和 `buildId` 现已可在 macOS 上通过解析 Mach-O 符号表使用。[#99014](https://github.com/ClickHouse/ClickHouse/pull/99014) ([Alexey Milovidov](https://github.com/alexey-milovidov)) 。
* 现在，`system.stack_trace` 表已支持 macOS，可用于查看所有 server 线程的堆栈跟踪内部信息。[#98982](https://github.com/ClickHouse/ClickHouse/pull/98982) ([Alexey Milovidov](https://github.com/alexey-milovidov)) 。
* 新增每服务器级别的 LDAP 配置选项 `<follow_referrals>` (默认值为 `false`) ，用于控制 LDAP 客户端是否跟随转介。禁用转介跟随可避免从 Active Directory 域根 base DN 开始搜索时出现超时和挂起。与转介相关的日志消息已从 `warn` 调整为 `trace`。[#96765](https://github.com/ClickHouse/ClickHouse/pull/96765) ([paf91](https://github.com/paf91)) 。
* 我们现在会在 query&#95;log 表新增的 `skip_indices` 列中，记录查询执行期间使用的所有数据跳过索引。修复了 [#78676](https://github.com/ClickHouse/ClickHouse/issues/78676)。原始作者为 @pheepa。[#87862](https://github.com/ClickHouse/ClickHouse/pull/87862) ([Grant Holly](https://github.com/grantholly-clickhouse))。
* 除非用户有权查看所有必需的列，否则 `ACCESS&#95;DENIED` 提示将不再暴露列名；数据库/表名在提示中仍然可见。[#91067](https://github.com/ClickHouse/ClickHouse/pull/91067) ([filimonov](https://github.com/filimonov)).
* 为 MergeTree 增加一个专用清理线程，避免在高 merge 负载下出现清理延迟。此更改修复了 [#86181](https://github.com/ClickHouse/ClickHouse/issues/86181)。[#91574](https://github.com/ClickHouse/ClickHouse/pull/91574) ([Amos Bird](https://github.com/amosbird)) 。
* 仅当本地服务器主机名对应的 IP 发生变化时，才重新加载集群配置，而不是在任意主机的 IP 发生变化时都重新加载。修复了 [#81215](https://github.com/ClickHouse/ClickHouse/issues/81215)、[#70156](https://github.com/ClickHouse/ClickHouse/issues/70156) 和 [#65268](https://github.com/ClickHouse/ClickHouse/issues/65268)。[#93726](https://github.com/ClickHouse/ClickHouse/pull/93726) ([Zhigao Hong](https://github.com/zghong)) 。
* 允许 optimize&#95;aggregators&#95;of&#95;group&#95;by&#95;keys 在 GROUPING SETS 查询中正确地优化聚合函数。[#93935](https://github.com/ClickHouse/ClickHouse/pull/93935) ([Xiaozhe Yu](https://github.com/wudidapaopao)).
* Keeper-bench：在指标中报告错误，并为 --input-request-log 模式生成 JSON 指标文件。[#95748](https://github.com/ClickHouse/ClickHouse/pull/95748) ([Mohammad Lareb Zafar](https://github.com/zlareb1)).
* 为 CREATE USER 新增 ROLE 子句。[#97074](https://github.com/ClickHouse/ClickHouse/pull/97074) ([Vitaly Baranov](https://github.com/vitlibar)) 。
* 现在，您可以为由 Replicated database 创建的集群设置 internal&#95;replication 参数。[#97228](https://github.com/ClickHouse/ClickHouse/pull/97228) ([Pervakov Grigorii](https://github.com/GrigoryPervakov)) 。
* 新设置 `allow_nullable_tuple_in_extracted_subcolumns` 用于控制从 `Tuple`、`Variant`、`Dynamic` 和 `JSON` 中提取的 `Tuple(...)` 子列返回为 `Nullable(Tuple(...))` (缺失行返回 `NULL`) ，还是返回为 `Tuple(...)` (缺失行返回默认的 Tuple 值) 。该设置默认禁用，并且只能通过重启服务器进行更改。[#97299](https://github.com/ClickHouse/ClickHouse/pull/97299) ([Nihal Z. Miaji](https://github.com/nihalzp)) 。
* 在 EXPLAIN 查询输出中，将延迟过滤器的信息单独列出 (在配合行策略/PREWHERE 使用 FINAL 时) 。相关内容：[#91065](https://github.com/ClickHouse/ClickHouse/pull/91065)。[#97374](https://github.com/ClickHouse/ClickHouse/pull/97374) ([Yarik Briukhovetskyi](https://github.com/yariks5s))。
* 默认启用 `type_json_allow_duplicated_key_with_literal_and_nested_object`。这样可以避免在解析诸如 `{"a" : 42, "a" : {"b" : 42}}` 这类 JSON 时因重复键而报错；这类 JSON 可由 ClickHouse 根据原始 JSON 数据 `{"a" : 42, "a.b" : 42}` 格式化生成。[#97423](https://github.com/ClickHouse/ClickHouse/pull/97423) ([Pavel Kruglov](https://github.com/Avogar)) 。
* Keeper 改进：`find_super_nodes` 是一个非常有用的命令，可用于调试 Keeper 中节点数量异常增长的问题。遗憾的是，如果存在多个超级节点，几乎不可能找出一个以上，因为该命令在遍历遇到的第一个超级节点的子节点时会一直卡住。此 PR 禁止遍历超级节点的子节点。[#97819](https://github.com/ClickHouse/ClickHouse/pull/97819) ([pufit](https://github.com/pufit)).
* 为 `clickhouse-keeper-client` 提供初始补全支持。[#97828](https://github.com/ClickHouse/ClickHouse/pull/97828) ([Konstantin Bogdanov](https://github.com/thevar1able)) 。
* 在发生崩溃时，刷新异步日志缓冲区。 [#97836](https://github.com/ClickHouse/ClickHouse/pull/97836) ([Azat Khuzhin](https://github.com/azat)).
* 默认启用 impersonate 特性 (参见 [EXECUTE AS target&#95;user](https://clickhouse.com/docs/sql-reference/statements/execute_as)) 。[#97870](https://github.com/ClickHouse/ClickHouse/pull/97870) ([Vitaly Baranov](https://github.com/vitlibar)) 。
* 改进了在 clickhouse-client 中使用 KILL QUERY 和取消查询 (Ctrl+C) 来取消 SQLite 表引擎查询的功能。[#97944](https://github.com/ClickHouse/ClickHouse/pull/97944) ([Roman Vasin](https://github.com/rvasin)) 。
* 新增服务器级设置 `jemalloc_profiler_sampling_rate`，用于控制 jemalloc 的 `lg_prof_sample`，并将其作为异步指标 `jemalloc.prof.lg_sample` 对外暴露。[#97945](https://github.com/ClickHouse/ClickHouse/pull/97945) ([Antonio Andelic](https://github.com/antonio2368)) 。
* 为并发有界队列实现增加权重支持。[#97962](https://github.com/ClickHouse/ClickHouse/pull/97962) ([Daniil Ivanik](https://github.com/divanik)) 。
* 将 sslmode 添加到 PostgreSQL 字典源的允许键中。此前，sslmode 不在 PostgreSQLDictionarySource.cpp 的 dictionary&#95;allowed&#95;keys 允许列表内，因此无法为 PostgreSQL 字典连接配置 SSL 模式。这导致字典无法连接到要求使用 SSL 的 PostgreSQL 服务器 (例如默认强制启用 SSL 的 AWS RDS) ，因为连接会在 TLS 协商阶段失败，而服务器会拒绝未加密的回退连接。[#98014](https://github.com/ClickHouse/ClickHouse/pull/98014) ([mcalfin](https://github.com/mcalfin)).
* 向 `clickhouse` 或 `clickhouse-local` 传入不存在的文件路径时，显示清晰的 &quot;no such file&quot; 错误，而不是令人困惑的通用消息。[#98048](https://github.com/ClickHouse/ClickHouse/pull/98048) ([Raúl Marín](https://github.com/Algunenano)).
* 现在可在 `Nullable([Fixed]String)` 和 `Array(Nullable([Fixed]String))` 列上构建文本索引。[#98118](https://github.com/ClickHouse/ClickHouse/pull/98118) ([Jimmy Aguilar Mena](https://github.com/Ergus)).
* 避免删除被字典源依赖的命名集合。[#98127](https://github.com/ClickHouse/ClickHouse/pull/98127) ([Pablo Marcos](https://github.com/pamarcos)).
* 针对带有 `totals` 的查询，启用 `grace_hash` JOIN 算法。[#98144](https://github.com/ClickHouse/ClickHouse/pull/98144) ([János Benjamin Antal](https://github.com/antaljanosbenjamin)) 。
* 在 ordinary shared merge tree 的 DROP DATABASE 操作中提前取消后台合并。[#98161](https://github.com/ClickHouse/ClickHouse/pull/98161) ([Shaohua Wang](https://github.com/tiandiwonder)) 。
* 改进了在 clickhouse-client 中使用 KILL QUERY 和取消查询 (Ctrl+C) 来取消 MongoDB 和 MySQL 查询的能力。[#98187](https://github.com/ClickHouse/ClickHouse/pull/98187) ([Roman Vasin](https://github.com/rvasin)).
* 移除 NetlinkMetricsProvider，改为仅使用 procfs 收集每线程的 taskstats 指标。基于 Netlink 的收集方式在容器化环境中存在问题，而且在发生争用时，尾延迟表现更差。[#98229](https://github.com/ClickHouse/ClickHouse/pull/98229) ([Amos Bird](https://github.com/amosbird)) 。
* 重构了 Iceberg manifest 文件处理逻辑，修复了 manifest 文件缓存相关问题。[#98231](https://github.com/ClickHouse/ClickHouse/pull/98231) ([Daniil Ivanik](https://github.com/divanik)).
* 现在我们也会考虑这样一种情况：表的排序键可以是像 `toDate(time)` 这样的 expression；如果这类 expression 属于过滤器的一部分，我们就可以决定不延迟对它们的处理。[#98237](https://github.com/ClickHouse/ClickHouse/pull/98237) ([Yarik Briukhovetskyi](https://github.com/yariks5s)) 。
* 新增 `MaxAllocatedEphemeralLockSequentialNumber` 指标，用于表示 ZooKeeper 中为临时锁 znode 分配的最大顺序编号。[#98243](https://github.com/ClickHouse/ClickHouse/pull/98243) ([Miсhael Stetsyuk](https://github.com/mstetsyuk)).
* 将 ClickStack 更新至 2.20.0 版本。[#98252](https://github.com/ClickHouse/ClickHouse/pull/98252) ([Aaron Knudtson](https://github.com/knudtty)) 。
* 新增了一个新的 profile 事件 `KeeperRequestTotalWithSubrequests`，会将多请求中的每个子请求分别计数，从而更清楚地反映实际的 Keeper workload。现有的 `KeeperRequestTotal` 事件则仍然将每个多请求计为一次请求。[#98348](https://github.com/ClickHouse/ClickHouse/pull/98348) ([Antonio Andelic](https://github.com/antonio2368)) 。
* `SYSTEM RELOAD DICTIONARIES` 现在会按拓扑顺序重新加载字典，因此将其他字典作为数据源的字典在重新加载后也能读取到最新数据。[#98356](https://github.com/ClickHouse/ClickHouse/pull/98356) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 更改 MergeTree 设置后，重启统计缓存。[#98520](https://github.com/ClickHouse/ClickHouse/pull/98520) ([Han Fei](https://github.com/hanfei1991)) 。
* 只有“存活”的 (即能够连接的) 副本会参与分布式索引分析。[#98521](https://github.com/ClickHouse/ClickHouse/pull/98521) ([Azat Khuzhin](https://github.com/azat)) 。
* 新增设置 `access_control_improvements.disallow_config_defined_profiles_for_sql_defined_users` (默认值为 disabled/allowed) ，禁止为通过 SQL 定义的用户使用在 config 中定义的 profile (`default` profile 除外) 。[#98662](https://github.com/ClickHouse/ClickHouse/pull/98662) ([Alexander Tokmakov](https://github.com/tavplubix)) 。
* 将自动并行副本启发式所使用的节点数上限设为集群中的实际节点数 (而不再仅由 `max_parallel_replicas` 设置决定) 。[#98668](https://github.com/ClickHouse/ClickHouse/pull/98668) ([Nikita Taranov](https://github.com/nickitat)).
* 为分布式索引分析引入对冲请求和异步读取。[#98724](https://github.com/ClickHouse/ClickHouse/pull/98724) ([Azat Khuzhin](https://github.com/azat)) 。
* 现在，二进制 `AggregateFunction` 状态的反序列化要求必须完整读取全部输入。如果存在多余的尾随冗余字节，ClickHouse 将抛出异常，而不再接受格式不正确的状态数据。[#98786](https://github.com/ClickHouse/ClickHouse/pull/98786) ([Nihal Z. Miaji](https://github.com/nihalzp)) 。
* 让 TRUNCATE DATABASE 能响应查询取消。[#98828](https://github.com/ClickHouse/ClickHouse/pull/98828) ([Shaohua Wang](https://github.com/tiandiwonder)).
* 为 `keeper-bench` 增加请求流水线、预热阶段、按操作划分的统计信息、可复现的种子以及更完善的错误处理。[#98906](https://github.com/ClickHouse/ClickHouse/pull/98906) ([Antonio Andelic](https://github.com/antonio2368)) 。
* 分布式索引分析现已支持 SAMPLE 子句。 [#98931](https://github.com/ClickHouse/ClickHouse/pull/98931) ([Azat Khuzhin](https://github.com/azat)).
* 即使查询返回空结果或发生错误，也会在仪表板中显示图表标题。[#98975](https://github.com/ClickHouse/ClickHouse/pull/98975) ([Yash ](https://github.com/Onyx2406)).
* analyzer 错误消息不再输出表中的所有列 (这可能会导致产生 150KB+ 的异常信息) 。列列表现在最多只显示 10 项。[#99002](https://github.com/ClickHouse/ClickHouse/pull/99002) ([Yash ](https://github.com/Onyx2406)).
* 正确返回包含 joins 的子查询中的列统计信息，以便父查询可利用这些信息对 join 顺序进行重排。[#99096](https://github.com/ClickHouse/ClickHouse/pull/99096) ([Alexander Gololobov](https://github.com/davenger)).
* 在终结过程开始时，立即将 ZooKeeper session 标记为已过期，而不是等待发送线程退出。这样一来，其他线程就能立即建立新的 session，而无需等待。[#99102](https://github.com/ClickHouse/ClickHouse/pull/99102) ([Raúl Marín](https://github.com/Algunenano)).
* 开始使用 LLVM-libc 中更多数学函数：`exp`、`exp2`、`expm1`、`fabs`、`fabsl`、`floor`、`fmodl`、`log`、`log2`、`logf`、`pow`、`scalbn`、`scalbnl`、`copysignl`、`nan`、`nanf`、`nanl`，以及 `explogxf` 共享常量。[#99118](https://github.com/ClickHouse/ClickHouse/pull/99118) ([Konstantin Bogdanov](https://github.com/thevar1able)) 。
* 降低 `system.jemalloc_profile_text` 折叠格式下的内存占用，并修复潜在的重复输出问题。[#99121](https://github.com/ClickHouse/ClickHouse/pull/99121) ([Antonio Andelic](https://github.com/antonio2368)) 。
* 向 `system.aggregated_zookeeper_log` 添加 `is_subrequest` 列，用于区分独立请求与 Multi/MultiRead 请求中的子请求。此前，子请求会与独立请求聚合到同一个桶中，而由于每个子操作记录的都是整个多请求的总耗时，因此平均延迟具有误导性。现在，子请求的延迟为零。[#99169](https://github.com/ClickHouse/ClickHouse/pull/99169) ([Miсhael Stetsyuk](https://github.com/mstetsyuk)) 。
* 允许在不指定列类型的情况下执行 `ALTER TABLE MODIFY COLUMN x TTL ...` 命令。[#99208](https://github.com/ClickHouse/ClickHouse/pull/99208) ([Nikolay Degterinsky](https://github.com/evillique)).
* 跳过已断开连接的会话对应的过时 Keeper 请求，避免不必要的 Raft 往返。已跟踪的已结束会话数量上限由协调设置 `max_finished_sessions_cache_size` 控制。[#99246](https://github.com/ClickHouse/ClickHouse/pull/99246) ([Antonio Andelic](https://github.com/antonio2368)) 。
* 支持对基于 `mapValues(map)` 构建的文本索引使用 `IN` 运算符。[#99286](https://github.com/ClickHouse/ClickHouse/pull/99286) ([Anton Popov](https://github.com/CurtizJ)) 。
* 在 clickhouse keeper-client 中支持类似 Shell 的自动补全 (支持补全引号中的参数，即 `'foo ba'`；支持转义参数，即 `foo\ ba`；如果节点名中包含空白字符，则让 `ls` 输出带引号的节点名) 。[#99312](https://github.com/ClickHouse/ClickHouse/pull/99312) ([Azat Khuzhin](https://github.com/azat)).
* 防止 Keeper `mntr` 命令因锁竞争而发生卡顿。[#99472](https://github.com/ClickHouse/ClickHouse/pull/99472) ([Antonio Andelic](https://github.com/antonio2368)).
* 通过在 mutex 作用域之外调用回调函数并分发读取请求，减少 Keeper 分发器中的锁竞争，并添加带 profile 的锁保护机制以增强可观测性。[#99751](https://github.com/ClickHouse/ClickHouse/pull/99751) ([Antonio Andelic](https://github.com/antonio2368)).
* 允许 Parquet 文件最后一个块末尾缺少填充。 [#99857](https://github.com/ClickHouse/ClickHouse/pull/99857) ([Seva Potapov](https://github.com/seva-potapov)).


<h4 id="263-bug-fix-user-visible-misbehavior-in-an-official-stable-release">
  错误修复（官方稳定版中的用户可见问题）
</h4>

* 修复了当别名表目标未使用完全限定名称时，将其保存为 DDL 依赖的方式：现在会保存为别名表所在的数据库，而不是会话数据库。 [#95175](https://github.com/ClickHouse/ClickHouse/pull/95175) ([Enric Calabuig](https://github.com/eclbg)).
* 修复读取 ALIAS 列的子列时返回错误结果或抛出异常的问题。[#95408](https://github.com/ClickHouse/ClickHouse/pull/95408) ([Pavel Kruglov](https://github.com/Avogar)) 。
* 修复了在使用旧 analyzer 时，JOIN 中使用非标准标识符别名导致列缺失的问题。修复了 [#25594](https://github.com/ClickHouse/ClickHouse/issues/25594)、[#47288](https://github.com/ClickHouse/ClickHouse/issues/47288) 和 [#53263](https://github.com/ClickHouse/ClickHouse/issues/53263)。[#95679](https://github.com/ClickHouse/ClickHouse/pull/95679) ([Zhigao Hong](https://github.com/zghong)).
* 修复了 Kusto 方言函数 `bin()`、`bin_at()`、`extract()` 和 `indexof()` 在传入空参数时发生崩溃的问题。[#95736](https://github.com/ClickHouse/ClickHouse/pull/95736) ([NeedmeFordev](https://github.com/spider-yamet)) 。
* 禁止在 clickhouse-client 中将 local&#95;object&#95;storage (用于基于本地文件系统的数据湖，也可能被 LocalDisk 使用) 挂载到 user&#95;files&#95;path 以外的任何位置。 [#96201](https://github.com/ClickHouse/ClickHouse/pull/96201) ([Daniil Ivanik](https://github.com/divanik)).
* 修复 `DeltaLake` 表引擎中快照版本变更时的逻辑竞态问题，并去除冗余且高开销的快照重新加载。[#96226](https://github.com/ClickHouse/ClickHouse/pull/96226) ([Kseniia Sumarokova](https://github.com/kssenii)) 。
* 修复了 MergeTree 中附加分片时的一个逻辑错误：如果在 detach 和 attach 之间经历了多次连续重命名，就会触发该问题。[#96351](https://github.com/ClickHouse/ClickHouse/pull/96351) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复了一个问题：在同一请求中与 `compatibility` 一并发送显式设置时，如果其值恰好与服务器默认值相同，这些设置可能会被悄然忽略。[#97078](https://github.com/ClickHouse/ClickHouse/pull/97078) ([Raufs Dunamalijevs](https://github.com/rienath)).
* 修复了以下问题：当启用并行解析的 INSERT 遇到无效数据时，客户端会报告 `NETWORK_ERROR`，而不是实际的解析错误 (并带有正确的行号) 。[#97339](https://github.com/ClickHouse/ClickHouse/pull/97339) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复了在引入 `Nullable(Tuple)` 后，`sumCount` 聚合函数无法读取旧版已序列化状态的问题。关闭 [#97370](https://github.com/ClickHouse/ClickHouse/issues/97370)。[#97502](https://github.com/ClickHouse/ClickHouse/pull/97502) ([Nihal Z. Miaji](https://github.com/nihalzp)) 。
* 修复在配合 `GROUPING SETS` 和 `ORDER BY` 使用时，包含 `Nothing` 类型元素的元组比较中出现的异常 (例如与 `NULL` 元组元素比较时) 。[#97509](https://github.com/ClickHouse/ClickHouse/pull/97509) ([Alexey Milovidov](https://github.com/alexey-milovidov)) 。
* 修复了在使用多个压缩编解码器时，Compact MergeTree parts 的 `uncompressed_hash` 计算非确定性问题，该问题可能导致去重行为不正确。[#97522](https://github.com/ClickHouse/ClickHouse/pull/97522) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复了在共享数据中使用 JSON 和桶执行 INSERT SELECT 时，stream 缺失导致的逻辑错误。关闭 [#97331](https://github.com/ClickHouse/ClickHouse/issues/97331)。[#97523](https://github.com/ClickHouse/ClickHouse/pull/97523) ([Pavel Kruglov](https://github.com/Avogar)) 。
* 修复了在 SummingMergeTree 和 CoalescingMergeTree 合并过程中，将 `MEMORY_LIMIT_EXCEEDED` 异常误报为 `CORRUPTED_DATA` 的问题。[#97537](https://github.com/ClickHouse/ClickHouse/pull/97537) ([János Benjamin Antal](https://github.com/antaljanosbenjamin)) 。
* 修复了包含 `url()` 等表函数的关联子查询中出现的 &quot;Context has expired&quot; 异常。[#97544](https://github.com/ClickHouse/ClickHouse/pull/97544) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复了 `optimize_syntax_fuse_functions` 在聚合投影、Date 类型以及列名保留方面的异常和错误行为。[#97545](https://github.com/ClickHouse/ClickHouse/pull/97545) ([Alexey Milovidov](https://github.com/alexey-milovidov)) 。
* 移除了将 `replaceRegexpOne` 查询重写为 `extract` 的错误优化，该重写在正则表达式不匹配时会产生错误结果；同时修复了在 `replaceRegexpOne` 与 `GROUP BY ... WITH CUBE` 及 `group_by_use_nulls=1` 一起使用时出现的异常。[#97546](https://github.com/ClickHouse/ClickHouse/pull/97546) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复了在查询被终止时，启用 `database_atomic_wait_for_drop_and_detach_synchronously` 的 `DROP DATABASE` 可能会无限期挂起的问题。[#97586](https://github.com/ClickHouse/ClickHouse/pull/97586) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复了 `KILL QUERY` 无法终止卡在 `WITH FILL` 生成、通过 `dictGet` 加载字典，或在 `ReplicatedMergeTree` 上执行带有 `mutations_sync=1` 的 `ALTER DELETE` 时卡住的查询的问题。[#97589](https://github.com/ClickHouse/ClickHouse/pull/97589) ([Alexey Milovidov](https://github.com/alexey-milovidov)) 。
* `loop` 表函数此前直接调用 `inner_storage->read()`，绕过了解释器层；而行策略、列级授权及其他安全检查正是在这一层执行的。因此，即使直接执行 SELECT 返回零行，受行策略限制的用户仍可通过 `loop(table)` 读取所有行。[#97682](https://github.com/ClickHouse/ClickHouse/pull/97682) ([pufit](https://github.com/pufit)) 。
* 修复了在对纪元前的 DateTime64 使用 `toDate()` 函数时，分区裁剪不正确的问题。 [#97746](https://github.com/ClickHouse/ClickHouse/pull/97746) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 应用此补丁后，如果数据分区片段集合中存在另一个分区 ID 更高的分区，`hasPartitionId` 将返回 false。[#97748](https://github.com/ClickHouse/ClickHouse/pull/97748) ([Mikhail Artemenko](https://github.com/Michicosun)) 。
* 修复读取 JSON 中高级共享数据的空粒度时可能发生的崩溃。关闭 [#97563](https://github.com/ClickHouse/ClickHouse/issues/97563)。[#97778](https://github.com/ClickHouse/ClickHouse/pull/97778) ([Pavel Kruglov](https://github.com/Avogar)) 。
* 修复因 `DROP` 与 `INSERT` 之间的竞争条件，导致向 `Distributed` 执行 `INSERT` 时出现 `Cannot schedule a file` `LOGICAL_ERROR` 错误的问题。[#97822](https://github.com/ClickHouse/ClickHouse/pull/97822) ([Azat Khuzhin](https://github.com/azat)) 。
* 修复了在调用 `mapContainsKey/mapContainsKeyLike` 且使用 `tokenbf_v1` 跳过索引时，ClickHouse 服务器崩溃/断言的问题。[#97826](https://github.com/ClickHouse/ClickHouse/pull/97826) ([Shankar Iyer](https://github.com/shankar-iyer)) 。
* 修复了在 `concatWithSeparator`、`format`、`IN` 子查询、`GLOBAL IN` 以及带运行时过滤器的连接操作中，由复合类型 (`Variant`、`Dynamic`、`Tuple`) 内的 `LowCardinality` 引发的 LOGICAL&#95;ERROR 异常。[#97831](https://github.com/ClickHouse/ClickHouse/pull/97831) ([Raúl Marín](https://github.com/Algunenano)).
* 修复了在多个分布式表上使用 `ARRAY JOIN`、`merge()` 表函数并结合 `GROUP BY` 时出现的 `LOGICAL_ERROR` 异常：`Chunk info was not set for chunk in MergingAggregatedTransform`。[#97838](https://github.com/ClickHouse/ClickHouse/pull/97838) ([Raúl Marín](https://github.com/Algunenano)) 。
* 修复了在高并发情况下，连接组达到硬性上限时，HTTP 连接池析构函数中的未捕获异常导致的服务端崩溃 (`std::terminate`) 问题。在将连接回收到连接池时，异常 `HTTP_CONNECTION_LIMIT_REACHED` 可能会从 `~PooledConnection` 中泄出，进而导致 `SIGABRT`。[#97850](https://github.com/ClickHouse/ClickHouse/pull/97850) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复了在使用 `grace_hash` 算法进行非等值连接时，若由于连接结果的大小约束导致左侧块无法被完全处理而产生错误结果的问题。[#97866](https://github.com/ClickHouse/ClickHouse/pull/97866) ([János Benjamin Antal](https://github.com/antaljanosbenjamin)).
* 修复了在 [#96686](https://github.com/ClickHouse/ClickHouse/pull/96686) 中引入的 DeltaLake 元数据扫描性能问题。[#97880](https://github.com/ClickHouse/ClickHouse/pull/97880) ([Kseniia Sumarokova](https://github.com/kssenii)) 。
* 修复了 ZooKeeper 客户端中 sendThread 与 receiveThread 之间的数据竞争问题。[#97887](https://github.com/ClickHouse/ClickHouse/pull/97887) ([Pablo Marcos](https://github.com/pamarcos)) 。
* 修复了一个 bug：此前无法在 distributed insert select 中使用 CTE。延续 [https://github.com/ClickHouse/ClickHouse/pull/87789](https://github.com/ClickHouse/ClickHouse/pull/87789) 中的修复。关闭了 [#95837](https://github.com/ClickHouse/ClickHouse/issues/95837)。[#97889](https://github.com/ClickHouse/ClickHouse/pull/97889) ([Yarik Briukhovetskyi](https://github.com/yariks5s)) 。
* 修复 `CachedOnDiskReadBufferFromFile::readBigAt` 中的异常。关闭 [#97325](https://github.com/ClickHouse/ClickHouse/issues/97325)。[#97890](https://github.com/ClickHouse/ClickHouse/pull/97890) ([Kseniia Sumarokova](https://github.com/kssenii)) 。
* 修复了 `Alias` 引擎中因列不匹配导致的带有物化列的 `LOGICAL_ERROR` 异常。关闭了 [#97907](https://github.com/ClickHouse/ClickHouse/issues/97907)。[#97921](https://github.com/ClickHouse/ClickHouse/pull/97921) ([Kai Zhu](https://github.com/nauu)) 。
* 修复了在使用 Azure Blob 存储并将 `s3_plain` metadata 用于日志存储时，Keeper 重启后出现的数据丢失问题。[#97987](https://github.com/ClickHouse/ClickHouse/pull/97987) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复了 `sign` 函数在比 `Int8` 更宽的整数类型上的 JIT 误编译问题——超出 -128..127 范围的值可能会得到错误的符号。[#98012](https://github.com/ClickHouse/ClickHouse/pull/98012) ([Alexey Milovidov](https://github.com/alexey-milovidov)) 。
* 修复了读取使用列映射 &quot;name&quot; 模式的 Delta Lake 表时出现的 `DUPLICATE_COLUMN` 异常，以及对名称中包含点号的 struct 字段无提示地返回 NULL 的问题 (例如 ``STRUCT<`a.foo`: STRING, `b.foo`: STRING>``) 。[#98013](https://github.com/ClickHouse/ClickHouse/pull/98013) ([Caio Ishizaka Costa](https://github.com/ch-caioishizaka)) 。
* 修复轻量级更新和次级索引后的变更问题。[#98044](https://github.com/ClickHouse/ClickHouse/pull/98044) ([Raúl Marín](https://github.com/Algunenano)) 。
* 修复混用主键和非主键跳过索引时 FINAL 查询结果错误的问题。[#98097](https://github.com/ClickHouse/ClickHouse/pull/98097) ([Raúl Marín](https://github.com/Algunenano)) 。
* 对标量 file() 和 DESCRIBE TABLE file() 强制进行 READ ON FILE 权限检查。[#98115](https://github.com/ClickHouse/ClickHouse/pull/98115) ([Nikolay Degterinsky](https://github.com/evillique)) 。
* 修复了一个崩溃问题：使用 glob 模式查询文件 (例如 `file('dir/**', 'LineAsString')`) 时，如果目录中包含悬空符号链接，会抛出未处理的文件系统异常 (`STD_EXCEPTION`) 。现在会静默跳过悬空符号链接，查询将返回所有有效文件的结果。[#98143](https://github.com/ClickHouse/ClickHouse/pull/98143) ([Mark Andreev](https://github.com/mrk-andreev)).
* 修复了在过滤表达式中使用 `arrayJoin` 将外连接转换为内连接时，查询计划优化中发生的 segfault。[#98147](https://github.com/ClickHouse/ClickHouse/pull/98147) ([Alexey Milovidov](https://github.com/alexey-milovidov)) 。
* 修复了 `ProtobufList` 格式因消息间读取状态未重置而无法与 Kafka 引擎正常配合的问题。[#98151](https://github.com/ClickHouse/ClickHouse/pull/98151) ([Alexey Milovidov](https://github.com/alexey-milovidov)) 。
* 修复了 analyzer&#95;compatibility&#95;join&#95;using&#95;top&#95;level&#95;identifier 与 ARRAY JOIN 相关的逻辑错误，关闭 [#98164](https://github.com/ClickHouse/ClickHouse/issues/98164)。[#98179](https://github.com/ClickHouse/ClickHouse/pull/98179) ([Vladimir Cherkasov](https://github.com/vdimir)) 。
* 将 `aggregated_zookeeper_log` 中 `watch` 响应的组件字段设为 `Watch`，而不是留空。[#98202](https://github.com/ClickHouse/ClickHouse/pull/98202) ([Antonio Andelic](https://github.com/antonio2368)) 。
* 如果分区键列未包含在排序键中，那么分区裁剪可能会错误地跳过那些包含在 FINAL 去重过程中本应被保留的行的分区。 [#98242](https://github.com/ClickHouse/ClickHouse/pull/98242) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 修复了在以常量数组参数调用 `kql_array_sort_asc`/`kql_array_sort_desc` 时出现的逻辑错误 &quot;Bad cast from type DB::ColumnConst to DB::ColumnArray&quot;。[#98251](https://github.com/ClickHouse/ClickHouse/pull/98251) ([Alexey Milovidov](https://github.com/alexey-milovidov)) 。
* 修复了 `ColumnConst::getExtremes` 中的越界访问问题；在启用 `extremes = 1` 时，该问题可能导致崩溃。[#98263](https://github.com/ClickHouse/ClickHouse/pull/98263) ([Alexey Milovidov](https://github.com/alexey-milovidov)) 。
* 修复了一种潜在死锁问题：当两个并发的 `MOVE PARTITION` 操作在同一对表之间沿相反方向执行时，可能会发生死锁。[#98264](https://github.com/ClickHouse/ClickHouse/pull/98264) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* HTTP 服务器现在会在因请求头格式错误而导致的 400 Bad Request 响应体中返回错误消息，而不再返回空响应体。[#98268](https://github.com/ClickHouse/ClickHouse/pull/98268) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复了分布式索引分析 (Experimental 功能) 和查询条件缓存中的错误结果问题。[#98269](https://github.com/ClickHouse/ClickHouse/pull/98269) ([Azat Khuzhin](https://github.com/azat)) 。
* 修复了 LOGICAL&#95;ERROR 异常 &quot;`MergeTreeSetIndex` 中的二分查找结果无效&quot;：当对数据跨越 65535 边界的键列执行 `toDate` 转换时会触发该异常。[#98276](https://github.com/ClickHouse/ClickHouse/pull/98276) ([Alexey Milovidov](https://github.com/alexey-milovidov)) 。
* 修复了在旧版 join 步骤代码路径中，被包裹在 CROSS JOIN 中的 RIGHT JOIN 被 `query_plan_join_swap_table` 优化交换时触发的 `LOGICAL_ERROR` 异常。[#98279](https://github.com/ClickHouse/ClickHouse/pull/98279) ([Alexey Milovidov](https://github.com/alexey-milovidov)) 。
* 在 `DDSketch` 反序列化期间对损坏数据进行校验，以防在读取已损坏的 `quantilesDD` 聚合函数状态时出现段错误、异常、无限循环和 OOM。 [#98284](https://github.com/ClickHouse/ClickHouse/pull/98284) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复了在 `arrayMap` 等 lambda 函数中引用外层查询中的关联列时出现的 LOGICAL&#95;ERROR &quot;Trying to execute PLACEHOLDER action&quot;。 [#98285](https://github.com/ClickHouse/ClickHouse/pull/98285) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复了 `caseWithExpression` 中的逻辑错误异常：当 `CASE` 表达式涉及 `materialize(NULL)` 或其他 `Nullable(Nothing)` 参数时会触发该异常。[#98290](https://github.com/ClickHouse/ClickHouse/pull/98290) ([Alexey Milovidov](https://github.com/alexey-milovidov)) 。
* 修复在 `merge` 表函数中过滤 `_table` 虚拟列时出现的错误类型转换异常。[#98291](https://github.com/ClickHouse/ClickHouse/pull/98291) ([Alexey Milovidov](https://github.com/alexey-milovidov)) 。
* 修复了一个偶发的去重故障：由于 `blocks/` 与 `deduplication_hashes/` 这两个 ZooKeeper 目录的清理顺序不一致，重新插入的数据会被错误地去重。[#98293](https://github.com/ClickHouse/ClickHouse/pull/98293) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复了 `ORDER BY ... WITH FILL` 与 `LIMIT BY` 一起使用时触发的异常。[#98361](https://github.com/ClickHouse/ClickHouse/pull/98361) ([Alexey Milovidov](https://github.com/alexey-milovidov)) 。
* 修复将 Parquet/Arrow `Date` 列插入 `Enum` 列时的静默数据损坏问题——现在会正确拒绝不兼容的类型转换，而不会存储无效的枚举值。[#98364](https://github.com/ClickHouse/ClickHouse/pull/98364) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复了将带有 `Array` 列的 Arrow 文件读入带有 `Nested` 列的表时出现的异常。[#98365](https://github.com/ClickHouse/ClickHouse/pull/98365) ([Alexey Milovidov](https://github.com/alexey-milovidov)) 。
* 修复了以下问题：如果在索引或投影对应的变更完成前将其删除，`MATERIALIZE INDEX` 和 `MATERIALIZE PROJECTION` 变更会卡住。[#98369](https://github.com/ClickHouse/ClickHouse/pull/98369) ([Alexey Milovidov](https://github.com/alexey-milovidov)) 。
* 修复了读取 `Nullable(Tuple(...))` 时出现的异常：Tuple 元素名称与 Nullable 的 `null` 子列发生冲突。[#98372](https://github.com/ClickHouse/ClickHouse/pull/98372) ([Alexey Milovidov](https://github.com/alexey-milovidov)) 。
* 修复将 `Merge` 表 (底层为 `Distributed` 表) 与另一张表连接时出现的异常 &quot;Column ... query tree node does not have valid source node&quot;。[#98376](https://github.com/ClickHouse/ClickHouse/pull/98376) ([Alexey Milovidov](https://github.com/alexey-milovidov)) 。
* 修复 native V3 读取器中将 Parquet `Bool` 错误转换为 `FixedString` 的问题，此问题会产生 raw bytes，而不是字符串表示形式。[#98378](https://github.com/ClickHouse/ClickHouse/pull/98378) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复 `tryGetColumnDescription`：按父列类型筛选子列，使其与其他列查找方法保持一致。[#98391](https://github.com/ClickHouse/ClickHouse/pull/98391) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 支持在 HTTP Basic Auth 中接受不带填充的 base64 凭据。某些 HTTP 客户端会省略 `Authorization: Basic` 请求头末尾用于填充的 `=`，此前这会导致身份验证失败。[#98392](https://github.com/ClickHouse/ClickHouse/pull/98392) ([Amos Bird](https://github.com/amosbird)).
* 修复了合并带有 `Nullable` 分区键列的 parts 后，因 min-max 索引边界错误导致的分区裁剪结果不正确问题。[#98405](https://github.com/ClickHouse/ClickHouse/pull/98405) ([Amos Bird](https://github.com/amosbird)).
* 修复了管道执行器中的一个罕见异常：当管道扩展与查询取消发生竞态时，可能会表现为 `Received signal 6` (仅在调试构建中出现) 。[#98428](https://github.com/ClickHouse/ClickHouse/pull/98428) ([Alexey Milovidov](https://github.com/alexey-milovidov)) 。
* 修复在 `count_distinct_optimization` 与 `QUALIFY` 子句一起使用时出现的 &quot;Column identifier is already registered&quot; 异常。[#98433](https://github.com/ClickHouse/ClickHouse/pull/98433) ([Alexey Milovidov](https://github.com/alexey-milovidov)) 。
* 修复了将 `IN`/`NOT IN` 与 `LowCardinality` 列参数一起使用时出现的异常“cannot be inside Nullable type” (例如 `a NOT IN (b)`，其中 `a` 的类型为 `LowCardinality(String)`) 。 [#98443](https://github.com/ClickHouse/ClickHouse/pull/98443) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复了 `full_sorting_merge` join 中的 &quot;Pipeline stuck&quot; 异常：当 `FilterBySetOnTheFly` 优化与 `MergeJoinTransform` 形成循环依赖时，`PingPongProcessor` 中的死锁会触发该异常。[#98454](https://github.com/ClickHouse/ClickHouse/pull/98454) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复在合并带有会删除所有行的生存时间 (TTL) 且具有常量 `GROUP BY` 键的聚合投影的 parts 时出现的 `LOGICAL_ERROR` 异常 &quot;Projection cannot increase the number of rows in a block&quot;。[#98458](https://github.com/ClickHouse/ClickHouse/pull/98458) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复了同时使用 `CROSS JOIN` 和 `INNER JOIN USING` 时出现的逻辑错误异常。[#98459](https://github.com/ClickHouse/ClickHouse/pull/98459) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复了 `dictGetOrDefault` 在键参数为 `Nullable` 时的空指针解引用问题。[#98460](https://github.com/ClickHouse/ClickHouse/pull/98460) ([Alexey Milovidov](https://github.com/alexey-milovidov)) 。
* 修复了这样一种情况下 `DISTINCT` 查询中的异常：使用聚合投影时，`materialize` 会导致查询与投影之间的 `LowCardinality` 类型不一致。[#98462](https://github.com/ClickHouse/ClickHouse/pull/98462) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复了这样一个问题：启用 `join_use_nulls` 时，在 OUTER JOIN 的过滤表达式中使用 `arrayJoin` 会触发 LOGICAL&#95;ERROR 异常。[#98464](https://github.com/ClickHouse/ClickHouse/pull/98464) ([Alexey Milovidov](https://github.com/alexey-milovidov)) 。
* 修复在并行副本配合 `optimize_aggregation_in_order` 使用时出现的逻辑错误异常 &quot;副本决定以 WithOrder 模式读取，而不是 ReverseOrder&quot;。[#98467](https://github.com/ClickHouse/ClickHouse/pull/98467) ([Alexey Milovidov](https://github.com/alexey-milovidov)) 。
* 修复了 ClickHouse Keeper 在处理 `addWatch` 请求后断开 Java ZooKeeper 客户端连接的问题。Java 客户端期望在 `addWatch` 响应中收到一个 4 字节的 `ErrorResponse` 响应体，但 Keeper 发送的却是空响应体，从而导致 `EOFException` 并使会话断开。这会导致 Apache Curator 的 `CuratorCache` 以及任何使用持久 watch 的 Java 应用程序无法正常工作。修复 [#98079](https://github.com/ClickHouse/ClickHouse/issues/98079)。[#98499](https://github.com/ClickHouse/ClickHouse/pull/98499) ([Antonio Andelic](https://github.com/antonio2368)) 。
* 修复了当跟随者宕机时，`zk_followers` 和 `zk_synced_followers` 这两个 Keeper 指标不会随之减少的问题。在 `mntr` 四字母命令中新增了 `zk_learners` 和 `zk_synced_non_voting_followers` 指标。修复 [#54173](https://github.com/ClickHouse/ClickHouse/issues/54173)。[#98504](https://github.com/ClickHouse/ClickHouse/pull/98504) ([Antonio Andelic](https://github.com/antonio2368)) 。
* 修复了 `renameAndCommitEmptyParts` 中的 LOGICAL&#95;ERROR 异常：在使用 MergeTree 事务时，若 `TRUNCATE TABLE` 与 `OPTIMIZE TABLE` 并发执行，可能会触发该异常。[#98508](https://github.com/ClickHouse/ClickHouse/pull/98508) ([Alexey Milovidov](https://github.com/alexey-milovidov)) 。
* 修复了 Keeper 的安全 Raft 端口忽略 `openSSL` 配置中的 `cipherList` 和 `dhParamsFile`、一律使用默认值而非用户指定值的问题。关闭 [#51188](https://github.com/ClickHouse/ClickHouse/issues/51188)。[#98509](https://github.com/ClickHouse/ClickHouse/pull/98509) ([Antonio Andelic](https://github.com/antonio2368)) 。
* 修复了具有误导性的 Keeper 日志消息，例如 &quot;Receiving request for session X took 9963 ms&quot;：其中显示的时间实际上是两次心跳之间在 `poll()` 中空闲等待的耗时，而非操作本身的执行时间。修复了 [#79026](https://github.com/ClickHouse/ClickHouse/issues/79026)。[#98510](https://github.com/ClickHouse/ClickHouse/pull/98510) ([Antonio Andelic](https://github.com/antonio2368)) 。
* 修复 read&#95;in&#95;order&#95;use&#95;virtual&#95;row 与单调函数配合使用时出现的意外结果，关闭 [#97837](https://github.com/ClickHouse/ClickHouse/issues/97837)。[#98514](https://github.com/ClickHouse/ClickHouse/pull/98514) ([Vladimir Cherkasov](https://github.com/vdimir)) 。
* 修复了在 MergeTree 表上配合 `IN` 子查询使用 `PREWHERE` 时出现的 `LOGICAL_ERROR: Not-ready Set is passed as the second argument for function 'in'` 问题。[#98522](https://github.com/ClickHouse/ClickHouse/pull/98522) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复了 Keeper TCP 连接未响应关闭信号，导致服务器无法优雅关闭的问题。 [#98525](https://github.com/ClickHouse/ClickHouse/pull/98525) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复了在启用 `query_plan_convert_join_to_in` 且 `query_plan_merge_expressions = 0` 时出现的异常：&quot;在 ActionsDAG 的输出中未找到排序列&quot;。 [#98526](https://github.com/ClickHouse/ClickHouse/pull/98526) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复了使用命名集合时 MongoDB 字典源失效的问题。关闭 [#97840](https://github.com/ClickHouse/ClickHouse/issues/97840)。[#98528](https://github.com/ClickHouse/ClickHouse/pull/98528) ([Pablo Marcos](https://github.com/pamarcos)) 。
* 修复了参数替换后 Identifier 为空时触发的 LOGICAL&#95;ERROR。 [#98530](https://github.com/ClickHouse/ClickHouse/pull/98530) ([Pervakov Grigorii](https://github.com/GrigoryPervakov)).
* 修复同时使用 `sort_overflow_mode = 'break'` 和窗口函数时出现的管道死锁问题。[#98543](https://github.com/ClickHouse/ClickHouse/pull/98543) ([Alexey Milovidov](https://github.com/alexey-milovidov)) 。
* 修复了 Buffer 引擎在追加新块时处理异常过程中的列回滚问题。旧逻辑可能导致列的内存状态损坏。[#98551](https://github.com/ClickHouse/ClickHouse/pull/98551) ([Pavel Kruglov](https://github.com/Avogar)) 。
* 修复了在常量 `Dynamic` 或 `Variant` 列与 `NULL` 进行 NULL 安全比较 (`<=>` / `IS NOT DISTINCT FROM`) 时出现的异常 `Bad cast from type ColumnConst to ColumnDynamic`。同时还修复了 `Dynamic`/`Variant` 与 `NULL` 进行 `IS DISTINCT FROM` 比较时始终错误返回 0 的问题。[#98553](https://github.com/ClickHouse/ClickHouse/pull/98553) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复了文本索引与其他跳过索引一起使用时的问题。此前，当查询过滤器同时使用文本索引和其他常规跳过索引时，可能会抛出诸如 &quot;Trying to get non-existing mark&quot; 之类的逻辑错误。[#98555](https://github.com/ClickHouse/ClickHouse/pull/98555) ([Anton Popov](https://github.com/CurtizJ)) 。
* 修复了逻辑错误 &quot;在表达式上下文中不允许使用 TABLE&#95;FUNCTION&quot;：当带有别名的表函数在同一查询作用域中出现多次时 (例如同时出现在 `PREWHERE` 和 `QUALIFY` 子句中) 。 [#98557](https://github.com/ClickHouse/ClickHouse/pull/98557) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复了 PK 中针对表达式 (而不只是列) 进行分布式索引分析的问题 (否则会导致远程副本上的冗余粒度完全无法被过滤) 。[#98561](https://github.com/ClickHouse/ClickHouse/pull/98561) ([Azat Khuzhin](https://github.com/azat)).
* 当某列的子列被用于其他列的默认值/别名表达式时，禁止删除该列，并在 alter drop column 操作中对默认表达式使用 analyzer。[#98569](https://github.com/ClickHouse/ClickHouse/pull/98569) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)) 。
* 修复了 HTTP 客户端在遇到不可重试错误 (包括 `HTTP_CONNECTION_LIMIT_REACHED`) 时，仍错误重试 S3 请求的问题。[#98598](https://github.com/ClickHouse/ClickHouse/pull/98598) ([Sema Checherinda](https://github.com/CheSema)) 。
* 修复了使用 DateTime64 进行分区裁剪时出现的十进制溢出问题。 [#98628](https://github.com/ClickHouse/ClickHouse/pull/98628) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 修复 JIT 表达式编译中的两个 bug：`nativeCast` 类型检查里的一处复制粘贴错误，导致整数到整数和 Float 到 Float 的 cast 分支不可达；以及向 LLVM `PassBuilder` 传入了错误的 `nullptr` TargetMachine，致使无法注册特定目标的优化 pass。[#98660](https://github.com/ClickHouse/ClickHouse/pull/98660) ([Alexey Milovidov](https://github.com/alexey-milovidov)) 。
* 修复了一个 RBAC 绕过漏洞：用户此前可通过指向 localhost 的 `remote()`、`remoteSecure()`、`cluster()` 或 `clusterAllReplicas()` 对任意表执行 `DESCRIBE`，且无需 `SHOW_COLUMNS` 权限。[#98669](https://github.com/ClickHouse/ClickHouse/pull/98669) ([pufit](https://github.com/pufit)).
* 修复了以下问题：当非布尔表达式 (例如 `sin(col)`) 在包含 JOIN 的 WHERE 和 SELECT 中同时使用时，过滤器下推优化会破坏共享 DAG 节点，从而导致 `BAD_GET` 异常和错误的查询结果。[#98681](https://github.com/ClickHouse/ClickHouse/pull/98681) ([Alexey Milovidov](https://github.com/alexey-milovidov)) 。
* 修复在使用 `read_in_order_through_join` 和并行副本时出现的 LOGICAL&#95;ERROR：&quot;副本决定以 Default 模式读取，而不是 WithOrder&quot;。 [#98685](https://github.com/ClickHouse/ClickHouse/pull/98685) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复将 `input` 表函数用作 `remote` 参数时出现的异常 &quot;Bad cast from type `DB::TableFunctionNode` to `DB::QueryNode`&quot;。[#98694](https://github.com/ClickHouse/ClickHouse/pull/98694) ([Alexey Milovidov](https://github.com/alexey-milovidov)) 。
* 修复了因错误清理空的覆盖数据分区片段而导致过期数据分区片段“复活”的问题。 [#98698](https://github.com/ClickHouse/ClickHouse/pull/98698) ([Shaohua Wang](https://github.com/tiandiwonder)).
* 修复了 `LogicalExpressionOptimizerPass` 中的一个异常：在 `equals` 比较中，如果布尔函数返回 `Variant` 类型，就会报异常。[#98712](https://github.com/ClickHouse/ClickHouse/pull/98712) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复 `parseDateTimeBestEffort` 错误地解析以月份/星期前缀开头的单词的问题。关闭 [#97965](https://github.com/ClickHouse/ClickHouse/issues/97965)。[#98742](https://github.com/ClickHouse/ClickHouse/pull/98742) ([Pavel Kruglov](https://github.com/Avogar)) 。
* 修复在启用新 analyzer 时，对具有不同参数 (例如不同 `SKIP` 字段) 且包含引用 JSON 子路径的 ALIAS 列的 JSON 列使用 `merge()` 表函数或 `Merge` 引擎进行查询时出现的 `UNKNOWN_IDENTIFIER` 异常。关闭了 [#97812](https://github.com/ClickHouse/ClickHouse/issues/97812)。[#98753](https://github.com/ClickHouse/ClickHouse/pull/98753) ([Pavel Kruglov](https://github.com/Avogar)) 。
* 修复了在 `View` 中使用 `Distributed` 存储时，analyzer 对 `optimize_skip_unused_shards` 优化处理不正确的问题。[#98754](https://github.com/ClickHouse/ClickHouse/pull/98754) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复了在 `clickhouse-client` 中，通过 `--external` 传入的外部表无法按名称访问 Tuple 子列的问题 (例如，对 `Tuple(a UUID, b Int32)` 使用 `SELECT x.a`) 。关闭 [#96925](https://github.com/ClickHouse/ClickHouse/issues/96925)。[#98755](https://github.com/ClickHouse/ClickHouse/pull/98755) ([Pavel Kruglov](https://github.com/Avogar)) 。
* 修复 `reverseUTF8` 在无效 (截断的) UTF-8 输入上抛出异常的问题。[#98770](https://github.com/ClickHouse/ClickHouse/pull/98770) ([Alexey Milovidov](https://github.com/alexey-milovidov)) 。
* 修复在带有 false (即 or(x, 0)) 的或谓词中检测 Set 跳过索引有效性的问题。[#98776](https://github.com/ClickHouse/ClickHouse/pull/98776) ([Azat Khuzhin](https://github.com/azat)) 。
* 修复一个 `LOGICAL_ERROR` 异常 (`removeUnusedColumns` 中出现块结构不匹配) ，该异常可能会在 `FINAL` + `PREWHERE` + 常量 `WHERE` 表达式 + 与列无关的聚合 (如 `count()`) 的情况下发生。[#98778](https://github.com/ClickHouse/ClickHouse/pull/98778) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 为 ClickHouse 字典自动重新加载生成的 `system.trace_log` 条目添加非空查询 ID。[#98784](https://github.com/ClickHouse/ClickHouse/pull/98784) ([Miсhael Stetsyuk](https://github.com/mstetsyuk)) 。
* 修复了一个崩溃问题：对于在 `IDatabaseTablesIterator::table()` 调用中对表进行快照之后、并在后续迭代期间被另一线程更改的那些表之间这段时间里创建的系统表，我们可能会解引用空指针。 [#98792](https://github.com/ClickHouse/ClickHouse/pull/98792) ([Grant Holly](https://github.com/grantholly-clickhouse)).
* 修复 `SYSTEM START REPLICATED VIEW` 无法唤醒刷新任务的问题。[#98797](https://github.com/ClickHouse/ClickHouse/pull/98797) ([Pablo Marcos](https://github.com/pamarcos)) 。
* 修复了在另一个 JOIN 内使用包含 JOIN 的 `view()` 表函数时出现的异常 &quot;表名不一致&quot; (仅在旧 analyzer 下) 。[#98809](https://github.com/ClickHouse/ClickHouse/pull/98809) ([Alexey Milovidov](https://github.com/alexey-milovidov)) 。
* 修复了通过 pending&#95;signals 调整 RLIMIT&#95;SIGPENDING 时的问题。[#98829](https://github.com/ClickHouse/ClickHouse/pull/98829) ([Azat Khuzhin](https://github.com/azat)) 。
* 修复 `loop` 与 cluster 表函数组合使用时触发的异常。[#98860](https://github.com/ClickHouse/ClickHouse/pull/98860) ([Konstantin Bogdanov](https://github.com/thevar1able)) 。
* 使用多个连接键列的 LEFT ANTI JOIN 在 `enable_join_runtime_filters=1` (默认开启) 时会返回错误结果。[#98871](https://github.com/ClickHouse/ClickHouse/pull/98871) ([Alexander Gololobov](https://github.com/davenger)) 。
* 修复 `WITH FILL STALENESS` 在分多个数据块读取数据时 (例如，`index_granularity` 较小时) 产生额外填充行的问题。[#98895](https://github.com/ClickHouse/ClickHouse/pull/98895) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复了 “RPNBuilderFunctionTreeNode has A arguments, attempted to get argument at index B” LOGICAL&#95;ERROR。[#98900](https://github.com/ClickHouse/ClickHouse/pull/98900) ([Azat Khuzhin](https://github.com/azat)) 。
* 修复了由失败的内存分配未回滚、`nallocx(0)` 的未定义行为以及全局峰值跟踪中的差一错误导致的内存跟踪偏差。并将跟踪范围扩展到 `io_uring` 的 Ring buffer。[#98915](https://github.com/ClickHouse/ClickHouse/pull/98915) ([Antonio Andelic](https://github.com/antonio2368)).
* 禁止附加用户路径之外的本地数据湖表，而不只是禁止创建这些表。[#98936](https://github.com/ClickHouse/ClickHouse/pull/98936) ([Daniil Ivanik](https://github.com/divanik)) 。
* 修复了一个竞态条件：在使用 `urlCluster` 或类似 cluster 表函数的查询中，它可能导致出现 &quot;ReadBuffer is canceled&quot; 异常。[#98955](https://github.com/ClickHouse/ClickHouse/pull/98955) ([Alexey Milovidov](https://github.com/alexey-milovidov)) 。
* 修复了在传入 `BFloat16` 类型参数时，财务函数 (`financialNetPresentValue`、`financialInternalRateOfReturn` 等) 中出现的 `LOGICAL_ERROR` 异常。[#98958](https://github.com/ClickHouse/ClickHouse/pull/98958) ([Alexey Milovidov](https://github.com/alexey-milovidov)) 。
* 修复在禁用查询计划表达式合并时 (`query_plan_merge_expressions = 0` 或 `query_plan_enable_optimizations = 0`) ，跳过索引 (以及主键条件) 无法应用于 ALIAS 列的问题。[#98960](https://github.com/ClickHouse/ClickHouse/pull/98960) ([Peng](https://github.com/fastio)).
* 异步插入现在也会增加 `InsertQuery` ProfileEvent 计数。关闭 [#98626](https://github.com/ClickHouse/ClickHouse/issues/98626)。[#98962](https://github.com/ClickHouse/ClickHouse/pull/98962) ([Narasimha Pakeer](https://github.com/npakeer)) 。
* 修复了在调试构建中，当主键包含 NaN 浮点数值时出现的异常 &quot;Inconsistent KeyCondition behavior&quot;：通过让 `accurateLess` 和 `accurateEquals` 按照与 ClickHouse 排序顺序一致的方式处理 NaN。关闭 [#98075](https://github.com/ClickHouse/ClickHouse/issues/98075)。[#98964](https://github.com/ClickHouse/ClickHouse/pull/98964) ([Alexey Milovidov](https://github.com/alexey-milovidov)) 。
* SummingMergeTree 不再对 Bool (以及其他 domain 类型) 的列进行求和。Bool 值会保持原样，不再进行算术求和。[#98976](https://github.com/ClickHouse/ClickHouse/pull/98976) ([Yash ](https://github.com/Onyx2406)).
* 修复了在设置 `optimize_const_name_size` 且 `enable_scalar_subquery_optimization` = 0 时，查询远程分片会出现 `Scalar doesn&#39;t exist` 异常的问题。远程查询中被替换为 `__getScalar` 引用的大型常量未发送到分片，导致查询失败。[#98979](https://github.com/ClickHouse/ClickHouse/pull/98979) ([andriibeee](https://github.com/andriibeee)) 。
* 修复了某些查询中的 `NOT_FOUND_COLUMN_IN_BLOCK` 问题；这些查询带有 `GROUP BY`，且表达式中包含反向字典查找、`Date/DateTime` 转换比较以及元组比较。关闭 [#98888](https://github.com/ClickHouse/ClickHouse/issues/98888)。[#98980](https://github.com/ClickHouse/ClickHouse/pull/98980) ([Nihal Z. Miaji](https://github.com/nihalzp)) 。
* 修复了在 MergeTree 引擎中将 version/sign/is&#95;deleted 列修改为 `EPHEMERAL` 或 `ALIAS` 时出现的未定义行为 (空指针解引用) 问题。现在此类修改会被正确拒绝。[#98985](https://github.com/ClickHouse/ClickHouse/pull/98985) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复了一个问题：`system.grants` 在 `access_object` 列中遗漏了 `URL` 和 `S3` 授权对应的正则表达式参数。[#98987](https://github.com/ClickHouse/ClickHouse/pull/98987) ([DQ](https://github.com/il9ue)).
* 已修复 Iceberg BigLake 读取问题：ADC 凭据现会传递给 GCS S3 客户端 (修复了 403 错误) ；OAuth2 凭据会在发送前进行 URL 编码 (修复了包含特殊字符的令牌导致的身份验证失败) ；命名空间遍历在遇到 BigLake HTTP 400 响应时也不再中止。[#98998](https://github.com/ClickHouse/ClickHouse/pull/98998) ([Nikita Fomichev](https://github.com/fm4v)) 。
* 修复了 `clickhouse-client` 在 `TZ` 环境变量使用 POSIX 文件路径语法时 (例如 `TZ=:/etc/localtime`) 无法切换时区的问题。[#99000](https://github.com/ClickHouse/ClickHouse/pull/99000) ([Yash ](https://github.com/Onyx2406)).
* 修复了将 `startsWith`、`LIKE`、`NOT LIKE` 用于 `FixedString` 列时出现的剪枝不正确或剪枝不足问题。此外，包裹键列的 `FixedString` 到 `String` 类型转换函数现在也可以进行粒度剪枝。关闭 [#98940](https://github.com/ClickHouse/ClickHouse/issues/98940)。[#99001](https://github.com/ClickHouse/ClickHouse/pull/99001) ([Nihal Z. Miaji](https://github.com/nihalzp)) 。
* 修复了 `windowFunnel` 在遇到重复事件时，启用 `strict_deduplication` 会返回错误级别的问题。[#99003](https://github.com/ClickHouse/ClickHouse/pull/99003) ([Yash ](https://github.com/Onyx2406)).
* 修复了一个问题：EXISTS 会忽略子查询中的 LIMIT 和 OFFSET 子句，导致当子查询因 OFFSET 或 LIMIT 为 0 而未返回任何行时，结果不正确。关闭 [#88722](https://github.com/ClickHouse/ClickHouse/issues/88722)。[#99005](https://github.com/ClickHouse/ClickHouse/pull/99005) ([andriibeee](https://github.com/andriibeee)) 。
* 修复在使用 `GROUPING SETS` 时，过滤器下推优化遇到可短路为常量的 AND 表达式时触发的 &quot;Block structure mismatch&quot; 异常。 [#99010](https://github.com/ClickHouse/ClickHouse/pull/99010) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复了在查询计划中未包含 `_part_offset` 列时，读取补丁分区片段 (轻量级更新) 会触发异常的问题。 [#99023](https://github.com/ClickHouse/ClickHouse/pull/99023) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 对于类似 `SELECT * FROM table WHERE pk_id = ''` 这样的查询，如果 `pk_id` 是主键且类型为 `String`，现在会正确使用主键索引来过滤粒度。 [#99027](https://github.com/ClickHouse/ClickHouse/pull/99027) ([Shankar Iyer](https://github.com/shankar-iyer)).
* 修复了一个问题：当 materialized view 在后台线程流式传输数据时被 detach，Kafka 引擎会抛出 `DEPENDENCIES_NOT_FOUND` 异常。[#99028](https://github.com/ClickHouse/ClickHouse/pull/99028) ([Alexey Milovidov](https://github.com/alexey-milovidov)) 。
* 修复了在创建包含与虚拟列 (如 `_part_offset`) 同名的 `EPHEMERAL` 列的表时触发的异常。[#99031](https://github.com/ClickHouse/ClickHouse/pull/99031) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复了通过带有通配符模式的 `url()` 表函数读取不存在的压缩文件时，误导性的 &quot;inflate failed: buffer error&quot; 报错。现在，当启用 `http_skip_not_found_url_for_globs` 时，会按预期返回空结果。[#99034](https://github.com/ClickHouse/ClickHouse/pull/99034) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复了在 schema 变更 (例如 ADD COLUMN) 后，对 patch part 执行 `ALTER TABLE ... DROP PART` 时发生的 server 崩溃 (`std::terminate`) 问题。该崩溃是由于空 coverage part 的 metadata 中缺少系统列 (`_part`) ，从而导致在 `NOEXCEPT_SCOPE` 内部抛出未被捕获的异常。[#99036](https://github.com/ClickHouse/ClickHouse/pull/99036) ([Peng](https://github.com/fastio)) 。
* 如果在 *缓存磁盘读取* 期间因超出内存限制而抛出异常，ClickHouse 服务器进程可能会崩溃。该问题现已修复。[#99042](https://github.com/ClickHouse/ClickHouse/pull/99042) ([Shankar Iyer](https://github.com/shankar-iyer)) 。
* 修复了在使用 `dictGet` 查询同时具有 ROW POLICY 和 ALIAS 列的表时出现的 `LOGICAL_ERROR`。该问题是由于在新的 analyzer 中解析 ALIAS 列期间过早访问表表达式所致。[#99065](https://github.com/ClickHouse/ClickHouse/pull/99065) ([Peng](https://github.com/fastio)).
* 修复了用户在仅查询使用 Avro 格式存储数据的 Iceberg 表虚拟列时出现的越界错误。这种情况极其罕见，因此未将其标记为严重问题。修复 [#88238](https://github.com/ClickHouse/ClickHouse/issues/88238)。[#99080](https://github.com/ClickHouse/ClickHouse/pull/99080) ([alesapin](https://github.com/alesapin)).
* 修复了递归 CTE 中使用 `remote()` + `view()` 时出现的段错误。 [#99081](https://github.com/ClickHouse/ClickHouse/pull/99081) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 应用按序读取优化时，跳过不必要的额外索引分析。[#99084](https://github.com/ClickHouse/ClickHouse/pull/99084) ([Vladimir Cherkasov](https://github.com/vdimir)) 。
* 修复了在应用 patch part 期间因抛出内存限制异常而导致的崩溃。[#99086](https://github.com/ClickHouse/ClickHouse/pull/99086) ([Anton Popov](https://github.com/CurtizJ)).
* 修复了 `DDLWorker` 中的调试断言问题：在重新初始化恢复期间，ZooKeeper 条目被删除后，`first_failed_task_name` 变为过期状态，从而触发该问题。[#99099](https://github.com/ClickHouse/ClickHouse/pull/99099) ([Antonio Andelic](https://github.com/antonio2368)) 。
* 修复了带有生存时间 (TTL) 的合并过程中重建文本索引的问题。[#99107](https://github.com/ClickHouse/ClickHouse/pull/99107) ([Anton Popov](https://github.com/CurtizJ)).
* 修复 Iceberg 表引擎中 `ALTER TABLE ... REMOVE SETTINGS` 查询导致的崩溃问题。修复了 [#86330](https://github.com/ClickHouse/ClickHouse/issues/86330)。[#99108](https://github.com/ClickHouse/ClickHouse/pull/99108) ([alesapin](https://github.com/alesapin)) 。
* 修复了 `query_plan_convert_any_join_to_semi_or_anti_join` 优化中的一个 bug，该 bug 会导致不匹配的行返回错误结果。相关链接：[https://github.com/ClickHouse/ClickHouse/pull/95995](https://github.com/ClickHouse/ClickHouse/pull/95995)。[#99112](https://github.com/ClickHouse/ClickHouse/pull/99112) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 修复 `ASTColumnsExceptTransformer::transform` 中的 LOGICAL&#95;ERROR 异常。[#99119](https://github.com/ClickHouse/ClickHouse/pull/99119) ([Pablo Marcos](https://github.com/pamarcos)) 。
* 修复了一个 RBAC 绕过漏洞：该漏洞允许用户在未具备所需 source 访问特权的情况下，通过对表函数 (`mysql()`、`postgresql()`、`sqlite()`、`arrowFlight()`、`jdbc()`、`odbc()` 等) 执行 `DESCRIBE TABLE` 或 `CREATE TABLE AS` 来获取表结构。对于那些从远程服务器推断 schema 的函数，这还会导致用户在未经授权的情况下触发出站连接 (SSRF) 。[#99122](https://github.com/ClickHouse/ClickHouse/pull/99122) ([pufit](https://github.com/pufit)).
* 修复 Keeper 在动态重新配置和 leader 切换期间发生的崩溃问题 (NuRaft 中的 segfault) 。[#99133](https://github.com/ClickHouse/ClickHouse/pull/99133) ([JIaQi Tang](https://github.com/JiaQiTang98)) 。
* 修复了在目标端不支持 SAMPLE 时使用 Buffer 表导致崩溃的问题。[#99141](https://github.com/ClickHouse/ClickHouse/pull/99141) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复因补丁分区片段列顺序不一致导致的 LOGICAL&#95;ERROR。[#99164](https://github.com/ClickHouse/ClickHouse/pull/99164) ([Pablo Marcos](https://github.com/pamarcos)) 。
* 修复了一个极少见的崩溃问题：当 Iceberg 表包含混合格式 (ORC 和 Parquet) 的文件时可能会发生。修复了 [#88126](https://github.com/ClickHouse/ClickHouse/issues/88126)。[#99168](https://github.com/ClickHouse/ClickHouse/pull/99168) ([alesapin](https://github.com/alesapin)).
* 修复了备份/恢复时未应用 max&#95;execution&#95;time 的问题。 [#99205](https://github.com/ClickHouse/ClickHouse/pull/99205) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复了在未使用 `ORDER BY ALL` 的 `INSERT SELECT` 查询中，`insert_deduplication_token` 会被悄然忽略的问题。此前，对于未排序的 `INSERT SELECT`，即使提供了显式的用户标记，也会完全禁用去重。现在，只要提供 `insert_deduplication_token`，无论是否使用 `ORDER BY ALL`，都足以启用去重。 [#99206](https://github.com/ClickHouse/ClickHouse/pull/99206) ([Desel72](https://github.com/Desel72)).
* 修复 `InverseDictionaryLookupPass` 优化过程中权限检查过多的问题：不再对遍历到的每个节点都检查一次 `CREATE_TEMPORARY_TABLE` 权限，而是在该 pass 开始前只检查一次。[#99210](https://github.com/ClickHouse/ClickHouse/pull/99210) ([Mikhail Artemenko](https://github.com/Michicosun))。
* 修复了 `clickhouse format --obfuscate` 因混淆跳过索引类型、压缩编解码器名称、数据库引擎名称以及字典布局和数据源定义而生成无效 SQL 的问题。[#99260](https://github.com/ClickHouse/ClickHouse/pull/99260) ([Raúl Marín](https://github.com/Algunenano)) 。
* 修复了一个 bug：在某些情况下，`Time[64]` 与 `DateTime[64]` 类型之间的比较结果容易引起混淆；现在，遇到这类情况时，会通过添加日期部分 `1970-01-01`，将 `Time[64]` 值提升为 `DateTime[64]`。[#99267](https://github.com/ClickHouse/ClickHouse/pull/99267) ([Yarik Briukhovetskyi](https://github.com/yariks5s)) 。
* 在 DDL 工作线程中收紧分布式 DDL 查询的设置约束。[#99317](https://github.com/ClickHouse/ClickHouse/pull/99317) ([Pablo Marcos](https://github.com/pamarcos)).
* 修复 TOTP 身份验证中的一些小问题：`--one-time-password` CLI 选项在密码为空时的问题，以及对 `<digits>` 和 `<period>` 配置值的校验。[#99322](https://github.com/ClickHouse/ClickHouse/pull/99322) ([Vladimir Cherkasov](https://github.com/vdimir)) 。
* 修复了 Avro 输出格式中的逻辑错误 `unordered_map::at: key not found`：序列化值不在枚举定义内的 `Enum8`/`Enum16` 列时会报错。[#99332](https://github.com/ClickHouse/ClickHouse/pull/99332) ([Desel72](https://github.com/Desel72)).
* 修复了在包含 Dynamic 的 Tuple 中使用稀疏序列化时 CHECK TABLE 的问题。关闭 [#96588](https://github.com/ClickHouse/ClickHouse/issues/96588)。[#99351](https://github.com/ClickHouse/ClickHouse/pull/99351) ([Pavel Kruglov](https://github.com/Avogar)).
* 修复了文本索引预处理器验证过于严格的问题。[#99359](https://github.com/ClickHouse/ClickHouse/pull/99359) ([Anton Popov](https://github.com/CurtizJ)) 。
* 修复带有隐式 minmax 索引的复制表从 25.10 升级到更高版本时的兼容性问题。 [#99392](https://github.com/ClickHouse/ClickHouse/pull/99392) ([Raúl Marín](https://github.com/Algunenano)).
* 移除了文本索引分析对否定函数 (`notEquals`、`notLike`、`notIn`) 的支持。这些函数本来就无法跳过任何粒度，因此为它们进行索引分析只会徒增开销，毫无收益。[#99393](https://github.com/ClickHouse/ClickHouse/pull/99393) ([Anton Popov](https://github.com/CurtizJ)) 。
* 修复了在 IN 子查询中使用 `Distributed` 表时，新 analyzer 下 `optimize_skip_unused_shards` 的问题。[#99436](https://github.com/ClickHouse/ClickHouse/pull/99436) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复当查询产生重复列名时，`INTERSECT`/`EXCEPT` 中的 heap-use-after-free 问题。[#99471](https://github.com/ClickHouse/ClickHouse/pull/99471) ([Alexey Milovidov](https://github.com/alexey-milovidov)) 。
* 修复了 `ALTER TABLE ... DROP PART` 在使用带类型的查询参数作为分片名称时的逻辑错误。[#99489](https://github.com/ClickHouse/ClickHouse/pull/99489) ([Alexey Milovidov](https://github.com/alexey-milovidov)) 。
* 修复了 `NOT_FOUND_COLUMN_IN_BLOCK` 异常：当通过别名在 `SELECT` 和 `WHERE` 子句中同时引用文本索引谓词 (如 `hasAllTokens`) 时，会触发该异常。[#99504](https://github.com/ClickHouse/ClickHouse/pull/99504) ([Anton Popov](https://github.com/CurtizJ)).
* 修复了在对具有各自独立文本索引的列执行 OR 操作时使用 `hasAllTokens` 会导致结果不正确的问题。[#99505](https://github.com/ClickHouse/ClickHouse/pull/99505) ([Anton Popov](https://github.com/CurtizJ)).
* 在 `clickhouse-local` 中初始化页缓存，使 `page_cache_max_size` 设置生效。[#99510](https://github.com/ClickHouse/ClickHouse/pull/99510) ([Alexey Milovidov](https://github.com/alexey-milovidov)) 。
* 修复了一个罕见问题：在执行 `DETACH/ATTACH TABLE` 查询后，可能会错误地将数据分区片段标记为损坏并将其分离。[#99529](https://github.com/ClickHouse/ClickHouse/pull/99529) ([Anton Popov](https://github.com/CurtizJ)).
* 修复了通过 HTTP 接口使用 Pretty 格式查询空系统表时触发的 `std::length_error` 异常。[#99541](https://github.com/ClickHouse/ClickHouse/pull/99541) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复了使用 `ALTER TABLE ADD COLUMN` 创建与虚拟列 (如 `_part_offset`) 同名的 `EPHEMERAL` 列时触发的 `LOGICAL_ERROR`。[#99549](https://github.com/ClickHouse/ClickHouse/pull/99549) ([Alexey Milovidov](https://github.com/alexey-milovidov)) 。
* 修复了因缓存键不匹配导致在移除分片后 `VectorSimilarityIndexCache` 条目始终无法被淘汰的问题。[#99575](https://github.com/ClickHouse/ClickHouse/pull/99575) ([Seva Potapov](https://github.com/seva-potapov)).
* 禁止从本地文件读取 Google 凭据。此设置存在安全隐患，因为一旦知道文件路径，就可能读取其他凭据。[#99584](https://github.com/ClickHouse/ClickHouse/pull/99584) ([Konstantin Vedernikov](https://github.com/scanhex12)).
* 修复 analyzer 中的性能劣化问题。移除 ARRAY JOIN 中未使用的列。[#99587](https://github.com/ClickHouse/ClickHouse/pull/99587) ([Dmitry Novik](https://github.com/novikd)) 。
* 修复了在已启用轻量级删除和行策略的表中读取文本索引时的问题。[#99661](https://github.com/ClickHouse/ClickHouse/pull/99661) ([Anton Popov](https://github.com/CurtizJ)) 。
* 修复 Parquet 读取器在 filter-in-decoder path 遇到已过滤页面时的 nullptr 解引用问题。关闭了 [#99676](https://github.com/ClickHouse/ClickHouse/issues/99676)。[#99677](https://github.com/ClickHouse/ClickHouse/pull/99677) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复了 AsynchronousReadBufferFromFileDescriptor 在使用 O&#95;DIRECT 时错误的寻道操作。关闭了 [#99358](https://github.com/ClickHouse/ClickHouse/issues/99358)。[#99678](https://github.com/ClickHouse/ClickHouse/pull/99678) ([Pavel Kruglov](https://github.com/Avogar))。
* 修复了解压格式错误的压缩数据时，`CompressionCodecT64` 中的堆缓冲区溢出，以及 `CompressionCodecMultiple` 中的进程中止问题。这两个问题均由新的 libFuzzer 目标发现。现在这些编解码器会抛出异常，而不是发生崩溃。[#99680](https://github.com/ClickHouse/ClickHouse/pull/99680) ([Rahul](https://github.com/motsc)).
* 将处理推迟到服务器完成所有表的加载之后。[#99700](https://github.com/ClickHouse/ClickHouse/pull/99700) ([Seva Potapov](https://github.com/seva-potapov)) 。
* 修复 MySQL 字典源在内联 DDL 参数场景下绕过 `RemoteHostFilter` 的问题。[#99720](https://github.com/ClickHouse/ClickHouse/pull/99720) ([Shaohua Wang](https://github.com/tiandiwonder)) 。
* 修复遍历 `system.tables` 中的数据湖表时出现的逻辑错误。[#99739](https://github.com/ClickHouse/ClickHouse/pull/99739) ([Konstantin Vedernikov](https://github.com/scanhex12)) 。
* 修复了带有预处理器的文本索引在分析使用 `IN` 函数的谓词时的问题。修复了文本索引中搜索标记发生冲突的问题，这可能导致结果不正确。[#99755](https://github.com/ClickHouse/ClickHouse/pull/99755) ([Anton Popov](https://github.com/CurtizJ)) 。
* 修复读取形状维度为负数的 `Npy` 格式文件时出现的无限循环问题。[#99812](https://github.com/ClickHouse/ClickHouse/pull/99812) ([Desel72](https://github.com/Desel72)) 。
* 修复了在查询计划头部计算过程中、按零行进行求值时，`CRC32` 函数处理 `FixedString` 参数会触发的 global-buffer-overflow 问题。 [#99835](https://github.com/ClickHouse/ClickHouse/pull/99835) ([Alexey Milovidov](https://github.com/alexey-milovidov)) 。
* 修复在 Iceberg 表上执行 `ALTER TABLE ... MODIFY COLUMN ... COMMENT` 时因空指针解引用导致的崩溃。[#99838](https://github.com/ClickHouse/ClickHouse/pull/99838) ([Desel72](https://github.com/Desel72)).
* 修复了 `aggregate_functions_null_for_empty` 设置，使其可与返回非 `Nullable` 类型 (如 `Array` 或 `Map`) 的聚合函数配合使用 (例如 `groupArray`、`sumMap`) 。[#99839](https://github.com/ClickHouse/ClickHouse/pull/99839) ([Alexey Milovidov](https://github.com/alexey-milovidov)) 。
* 修复了在 `midpoint` 函数使用有符号/无符号混合整数类型调用时触发的 LOGICAL&#95;ERROR 异常。[#99867](https://github.com/ClickHouse/ClickHouse/pull/99867) ([Alexey Milovidov](https://github.com/alexey-milovidov)) 。
* 修复带有 HAVING 子句的查询中出现的 &quot;块结构不匹配&quot; 异常：当过滤表达式同时包含由会生成 NULL 的函数包装的聚合，以及 `materialize(0)` 时，会触发该问题。[#99915](https://github.com/ClickHouse/ClickHouse/pull/99915) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复了当 `data` 参数为键类型为 Array 的 Map 或其他嵌套 Array 类型时，`sipHash128Keyed` (以及类似的带密钥哈希函数) 中的断言失败问题。[#99921](https://github.com/ClickHouse/ClickHouse/pull/99921) ([Alexey Milovidov](https://github.com/alexey-milovidov)) 。
* 修复在使用 `convertAnyJoinToSemiOrAntiJoin` 优化查询计划期间，`IN` 函数中出现的 `LOGICAL_ERROR` 异常 &quot;Set 未就绪&quot;。[#99939](https://github.com/ClickHouse/ClickHouse/pull/99939) ([Alexey Milovidov](https://github.com/alexey-milovidov)) 。


<h4 id="263-build-testing-packaging-improvement">
  构建、测试与打包改进
</h4>

* 通过移除重量级头文件包含，并将高开销的模板实例化移出头文件，缩短编译时间。[#97893](https://github.com/ClickHouse/ClickHouse/pull/97893) ([Raúl Marín](https://github.com/Algunenano)).
* 通过缩减模板分发矩阵并移除重量级包含，缩短算术函数及相关头文件的编译时间。[#98204](https://github.com/ClickHouse/ClickHouse/pull/98204) ([Raúl Marín](https://github.com/Algunenano)).
* 使用 `mongo-c-driver` 2.2.2。[#98304](https://github.com/ClickHouse/ClickHouse/pull/98304) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 使用 `postgres` REL&#95;18&#95;3。[#98306](https://github.com/ClickHouse/ClickHouse/pull/98306) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 为 UBSan 构建启用 jemalloc 分配器，以避免因 glibc malloc 内存回收能力较差而导致 RSS 累积。[#98444](https://github.com/ClickHouse/ClickHouse/pull/98444) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 使用 Rust v0 符号修饰，并从 PRQL 库中剥离内部符号，以减少解析器组合器库带来的符号名膨胀。[#98446](https://github.com/ClickHouse/ClickHouse/pull/98446) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 向 `tests/benchmarks` 添加 TPC-H 基准测试套件和 TPC-DS README。[#98495](https://github.com/ClickHouse/ClickHouse/pull/98495) ([Raufs Dunamalijevs](https://github.com/rienath)).
* 为全部 99 个 TPC-DS 查询添加正确性测试。[#99204](https://github.com/ClickHouse/ClickHouse/pull/99204) ([Raufs Dunamalijevs](https://github.com/rienath)).
* 添加一个集成测试，用于复现离线副本场景下 DDL CREATE TABLE + ALTER 的 bug ([#44070](https://github.com/ClickHouse/ClickHouse/issues/44070)) ，并将其标记为预期失败。[#99259](https://github.com/ClickHouse/ClickHouse/pull/99259) ([Raufs Dunamalijevs](https://github.com/rienath)).
* 以 `je_` 前缀集成 jemalloc，并移除对链接器 `--wrap` 的使用。[#99342](https://github.com/ClickHouse/ClickHouse/pull/99342) ([Azat Khuzhin](https://github.com/azat)).
