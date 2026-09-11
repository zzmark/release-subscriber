<h3 id="a-id229a-clickhouse-release-229-2022-09-22">
  <a id="229" /> ClickHouse 22.9 版本, 2022-09-22. [演示文稿](https://presentations.clickhouse.com/2022-release-22.9/), [视频](https://www.youtube.com/watch?v=rK2BsaaaOCA)
</h3>

<Frame>
  <iframe src="https://www.youtube.com/embed/rK2BsaaaOCA" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
</Frame>

<h4 id="backward-incompatible-change-2">
  向后不兼容变更
</h4>

* 如果存在 `ReplicatedMergeTree` 表，从 20.3 或更早版本升级至 22.9 或更新版本时，应先升级至一个中间版本，否则新版本服务器无法启动。[#40641](https://github.com/ClickHouse/ClickHouse/pull/40641)（[Alexander Tokmakov](https://github.com/tavplubix)）。
* 移除函数 `accurate_Cast` 和 `accurate_CastOrNull`（它们与 `accurateCast`、`accurateCastOrNull` 的区别是名称中带下划线，且不受 `cast_keep_nullable` 设置值影响）。这些函数没有文档、没有测试、无人使用，也没有必要存在，只因代码泛化而意外保留下来。[#40682](https://github.com/ClickHouse/ClickHouse/pull/40682)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 添加测试，确保每个新表函数都有文档。参见 [#40649](https://github.com/ClickHouse/ClickHouse/issues/40649)。将表函数 `MeiliSearch` 重命名为 `meilisearch`。[#40709](https://github.com/ClickHouse/ClickHouse/pull/40709)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 添加测试，确保每个新函数都有文档。参见 [#40649](https://github.com/ClickHouse/ClickHouse/pull/40649)。函数 `lemmatize`、`synonyms`、`stem` 此前错误地不区分大小写，现在改为区分大小写。[#40711](https://github.com/ClickHouse/ClickHouse/pull/40711)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 出于安全性和稳定性考虑，不再在 ClickHouse 服务器内部执行 CatBoost 模型推理，而是改由
  clickhouse-library-bridge 执行；这是一个独立进程，加载 CatBoost 库，并通过
  HTTP 与服务器进程通信。[#40897](https://github.com/ClickHouse/ClickHouse/pull/40897) ([Robert Schulze](https://github.com/rschu1ze)).
* 使 YAML 配置的解释方式更符合常规。[#41044](https://github.com/ClickHouse/ClickHouse/pull/41044)（[Vitaly Baranov](https://github.com/vitlibar)）。

<h4 id="new-feature-3">
  新功能
</h4>

* 支持通过 `insert_quorum = 'auto'` 使用多数副本数。[#39970](https://github.com/ClickHouse/ClickHouse/pull/39970)（[Sachin](https://github.com/SachinSetiya)）。
* 为 ClickHouse 服务器新增内嵌仪表板。这是一个演示项目，展示如何利用 ClickHouse 功能，以 1% 的工作量获得 90% 的成果。[#40461](https://github.com/ClickHouse/ClickHouse/pull/40461)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 新增设置约束可写性类型 `changeable_in_readonly`。[#40631](https://github.com/ClickHouse/ClickHouse/pull/40631)（[Sergei Trifonov](https://github.com/serxa)）。
* 新增 `INTERSECT DISTINCT` 和 `EXCEPT DISTINCT` 支持。[#40792](https://github.com/ClickHouse/ClickHouse/pull/40792)（[Duc Canh Le](https://github.com/canhld94)）。
* 新增输入/输出格式 `JSONObjectEachRow`。- 支持导入 `JSON/JSONCompact/JSONColumnsWithMetadata` 格式。新增 `input_format_json_validate_types_from_metadata` 设置，控制是否检查元数据中的数据类型与表头数据类型匹配。- 新增 `input_format_json_validate_utf8` 设置，启用后所有 `JSON` 格式都将校验 UTF-8 序列，默认禁用。注意，它不影响 `JSON/JSONCompact/JSONColumnsWithMetadata` 输出格式，这些格式始终校验 UTF-8 序列（出于兼容性考虑保留此例外）。- 新增 `input_format_json_read_numbers_as_strings ` 设置，允许将数字解析到 String 列中，默认禁用。- 新增 `output_format_json_quote_decimals` 设置，允许输出带双引号的十进制数，默认禁用。- 允许在导入数据时解析带双引号的十进制数。[#40910](https://github.com/ClickHouse/ClickHouse/pull/40910)（[Kruglov Pavel](https://github.com/Avogar)）。
* DESCRIBE TABLE 查询支持查询参数。[#40952](https://github.com/ClickHouse/ClickHouse/pull/40952)（[Nikita Taranov](https://github.com/nickitat)）。
* 通过转换为 DateTime64，新增 Parquet Time32/64 支持。Parquet time32/64 表示自午夜起经过的时间，而 DateTime32/64 表示实际 Unix 时间戳。转换只是以 `0` 为基准计算偏移。[#41333](https://github.com/ClickHouse/ClickHouse/pull/41333)（[Arthur Passos](https://github.com/arthurpassos)）。
* 实现 Apache Datasketches 的集合操作。[#39919](https://github.com/ClickHouse/ClickHouse/pull/39919)（[Fangyuan Deng](https://github.com/pzhdfy)）。注意：没有必要使用 Apache Datasketches，其能力逊于 ClickHouse，仅在与其他系统集成时才有意义。
* 读取文本格式（`CSV`、`TSV`）时，允许将错误记录到指定文件。[#40516](https://github.com/ClickHouse/ClickHouse/pull/40516)（[zjial](https://github.com/zjial)）。

<h4 id="experimental-feature-3">
  实验性功能
</h4>

* 新增基于 `Annoy` 的 ANN（近似最近邻）索引。[#40818](https://github.com/ClickHouse/ClickHouse/pull/40818)（[Filatenkov Artur](https://github.com/FArthur-cmd)）。[#37215](https://github.com/ClickHouse/ClickHouse/pull/37215)（[VVMak](https://github.com/VVMak)）。
* 新增存储引擎 `KeeperMap`，将 ClickHouse Keeper 或 ZooKeeper 用作键值存储。[#39976](https://github.com/ClickHouse/ClickHouse/pull/39976)（[Antonio Andelic](https://github.com/antonio2368)）。该引擎用于存储少量元数据。
* 内存数据片段改进：删除已完全处理的 WAL 文件。[#40592](https://github.com/ClickHouse/ClickHouse/pull/40592)（[Azat Khuzhin](https://github.com/azat)）。

<h4 id="performance-improvement-3">
  性能改进
</h4>

* 实现标记和主键的压缩。关闭 [#34437](https://github.com/ClickHouse/ClickHouse/issues/34437)。[#37693](https://github.com/ClickHouse/ClickHouse/pull/37693)（[zhongyuankai](https://github.com/zhongyuankai)）。
* 允许在线程池中预先加载标记，由 `load_marks_asynchronously` 设置控制（默认：0）。[#40821](https://github.com/ClickHouse/ClickHouse/pull/40821)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* S3 之上的虚拟文件系统将使用分布在多个路径前缀下的随机对象名称，以提升 AWS 上的性能。[#40968](https://github.com/ClickHouse/ClickHouse/pull/40968)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 生成单层聚合结果时考虑 `max_block_size` 的值，允许后续查询计划步骤使用更多线程。[#39138](https://github.com/ClickHouse/ClickHouse/pull/39138)（[Nikita Taranov](https://github.com/nickitat)）。
* 在聚合中使用软件预取，加快哈希表操作。由 `enable_software_prefetch_in_aggregation` 设置控制，默认启用。[#39304](https://github.com/ClickHouse/ClickHouse/pull/39304)（[Nikita Taranov](https://github.com/nickitat)）。
* 当应用 `WHERE` 后某些排序键列始终为常量时，更好地支持 `optimize_read_in_order`。例如，`table` 的存储定义为 `MergeTree ORDER BY (a, b)` 时，查询 `SELECT ... FROM table WHERE a = 'x' ORDER BY a, b`。[#38715](https://github.com/ClickHouse/ClickHouse/pull/38715)（[Anton Popov](https://github.com/CurtizJ)）。
* 在排序之前，用 `full_sorting_join` 两侧连接流相互筛选。[#39418](https://github.com/ClickHouse/ClickHouse/pull/39418)（[Vladimir C](https://github.com/vdimir)）。
* 跳过空字面量的处理，优化 LZ4 解压。[#40142](https://github.com/ClickHouse/ClickHouse/pull/40142)（[Nikita Taranov](https://github.com/nickitat)）。
* 尽可能使用原生 `copy` 加快备份，而不是经过 `clickhouse-server` 内存复制。[#40395](https://github.com/ClickHouse/ClickHouse/pull/40395)（[alesapin](https://github.com/alesapin)）。
* 不再为每个 INSERT 数据块获取存储快照，略微提升性能。[#40638](https://github.com/ClickHouse/ClickHouse/pull/40638)（[Azat Khuzhin](https://github.com/azat)）。
* 为具有多个可空参数的聚合函数实现批处理。[#41058](https://github.com/ClickHouse/ClickHouse/pull/41058)（[Raúl Marín](https://github.com/Algunenano)）。
* 加快 UniquesHashSet 读取（例如从磁盘读取 `uniqState`）。[#41089](https://github.com/ClickHouse/ClickHouse/pull/41089)（[Raúl Marín](https://github.com/Algunenano)）。
* 修复列数很多的表对紧凑数据片段执行变更操作时，内存使用过高的问题。[#41122](https://github.com/ClickHouse/ClickHouse/pull/41122)（[lthaooo](https://github.com/lthaooo)）。
* 在 ARM 上启用 vectorscan 库，加快正则表达式求值。[#41033](https://github.com/ClickHouse/ClickHouse/pull/41033)（[Robert Schulze](https://github.com/rschu1ze)）。
* 将 vectorscan 升级至 5.4.8，该版本包含多项正则表达式求值性能优化。[#41270](https://github.com/ClickHouse/ClickHouse/pull/41270)（[Robert Schulze](https://github.com/rschu1ze)）。
* 修复并发程度极高时，VFS（如 S3）错误回退为绕过本地文件系统缓存的问题。[#40420](https://github.com/ClickHouse/ClickHouse/pull/40420)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 如果行策略筛选条件始终为 false，立即返回空结果，不读取任何数据。关闭 [#24012](https://github.com/ClickHouse/ClickHouse/issues/24012)。[#40740](https://github.com/ClickHouse/ClickHouse/pull/40740)（[Amos Bird](https://github.com/amosbird)）。
* 改进 Float 数据类型的并行哈希 JOIN，避免性能欠佳。[#41183](https://github.com/ClickHouse/ClickHouse/pull/41183)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。

<h4 id="improvement-3">
  改进
</h4>

* 在启动和 ATTACH 过程中，`ReplicatedMergeTree` 表将保持只读，直到建立 ZooKeeper 连接并完成初始化。[#40148](https://github.com/ClickHouse/ClickHouse/pull/40148)（[Antonio Andelic](https://github.com/antonio2368)）。
* 新增 `enable_extended_results_for_datetime_functions` 选项：当参数为 Date32 或 DateTime64 时，使 toStartOfYear、toStartOfISOYear、toStartOfQuarter、toStartOfMonth、toStartOfWeek、toMonday 和 toLastDayOfMonth 返回 Date32 类型结果，否则返回 Date 类型结果。为兼容旧行为，默认值为 '0'。[#41214](https://github.com/ClickHouse/ClickHouse/pull/41214)（[Roman Vasin](https://github.com/rvasin)）。
* 出于安全性和稳定性考虑，不再在 ClickHouse 服务器内部执行 CatBoost 模型推理，而改在 clickhouse-library-bridge 中执行。它是一个独立进程，加载 CatBoost 库，并通过 HTTP 与服务器进程通信。函数 `modelEvaluate()` 由 `catboostEvaluate()` 替代。[#40897](https://github.com/ClickHouse/ClickHouse/pull/40897)（[Robert Schulze](https://github.com/rschu1ze)）。[#39629](https://github.com/ClickHouse/ClickHouse/pull/39629)（[Robert Schulze](https://github.com/rschu1ze)）。
* 为磁盘上的临时数据添加更多指标，关闭 [#40206](https://github.com/ClickHouse/ClickHouse/issues/40206)。[#40239](https://github.com/ClickHouse/ClickHouse/pull/40239)（[Vladimir C](https://github.com/vdimir)）。
* 新增 `warning_supress_regexp` 配置选项，关闭 [#40330](https://github.com/ClickHouse/ClickHouse/issues/40330)。[#40548](https://github.com/ClickHouse/ClickHouse/pull/40548)（[Vladimir C](https://github.com/vdimir)）。
* 新增用于禁用 kafka\_num\_consumers 限制的设置。关闭 [#40331](https://github.com/ClickHouse/ClickHouse/issues/40331)。[#40670](https://github.com/ClickHouse/ClickHouse/pull/40670)（[Kruglov Pavel](https://github.com/Avogar)）。
* 在 `DELETE ...` 查询中支持 `SETTINGS`。[#41533](https://github.com/ClickHouse/ClickHouse/pull/41533)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 为 S3 对象存储按每次 S3 API 调用细分 `DiskS3*` 性能事件。[#41532](https://github.com/ClickHouse/ClickHouse/pull/41532)（[Sergei Trifonov](https://github.com/serxa)）。
* 在 `system.asynchronous_metrics` 中新增两项指标：`NumberOfDetachedParts` 和 `NumberOfDetachedByUserParts`。[#40779](https://github.com/ClickHouse/ClickHouse/pull/40779)（[Sema Checherinda](https://github.com/CheSema)）。
* 允许为 ODBC 和 JDBC 表使用 CONSTRAINT。[#34551](https://github.com/ClickHouse/ClickHouse/pull/34551)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 如果原始查询中的 `SETTINGS` 未出现多次，格式化查询时也不重复输出。[#38900](https://github.com/ClickHouse/ClickHouse/pull/38900)（[Raúl Marín](https://github.com/Algunenano)）。
* 改进跟踪（OpenTelemetry）上下文在线程之间的传播。[#39010](https://github.com/ClickHouse/ClickHouse/pull/39010)（[Frank Chen](https://github.com/FrankChen021)）。
* ClickHouse Keeper：如果指定了 `interserver_listen_host`，则仅在 Keeper 中为其添加监听器。[#39973](https://github.com/ClickHouse/ClickHouse/pull/39973)（[Antonio Andelic](https://github.com/antonio2368)）。
* 改进复制式用户访问存储在发生错误后的恢复。[#39977](https://github.com/ClickHouse/ClickHouse/pull/39977)（[Vitaly Baranov](https://github.com/vitlibar)）。
* 为 `EmbeddedRocksDB` 新增 TTL 支持。[#39986](https://github.com/ClickHouse/ClickHouse/pull/39986)（[Lloyd-Pottiger](https://github.com/Lloyd-Pottiger)）。
* 为 `clickhouse-obfuscator` 新增结构推断，不再要求提供 `--structure` 参数。[#40120](https://github.com/ClickHouse/ClickHouse/pull/40120)（[Nikolay Degterinsky](https://github.com/evillique)）。
* 改进并修复 `Arrow` 格式中的字典。[#40173](https://github.com/ClickHouse/ClickHouse/pull/40173)（[Kruglov Pavel](https://github.com/Avogar)）。
* 使 `Date32`、`DateTime64`、`Date` 转换为更窄类型时更自然：超出正常范围时，取正常范围的上界或下界。[#40217](https://github.com/ClickHouse/ClickHouse/pull/40217)（[Andrey Zvonov](https://github.com/zvonand)）。
* 修复建立在 `View` 之上的 `Merge` 表无法使用索引的情况。[#40233](https://github.com/ClickHouse/ClickHouse/pull/40233)（[Duc Canh Le](https://github.com/canhld94)）。
* 支持为 JSON 服务器日志自定义键名。[#40251](https://github.com/ClickHouse/ClickHouse/pull/40251)（[Mallik Hassan](https://github.com/SadiHassan)）。
* 现在可以为 `throwIf` 函数抛出的异常设置自定义错误码。[#40319](https://github.com/ClickHouse/ClickHouse/pull/40319)（[Robert Schulze](https://github.com/rschu1ze)）。
* 改进结构推断缓存，考虑可能改变结构的格式设置。[#40414](https://github.com/ClickHouse/ClickHouse/pull/40414)（[Kruglov Pavel](https://github.com/Avogar)）。
* 允许将 `Date` 解析为 `DateTime` 和 `DateTime64`。实现 [#36949](https://github.com/ClickHouse/ClickHouse/issues/36949) 提出的增强。[#40474](https://github.com/ClickHouse/ClickHouse/pull/40474)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 允许将包含 `2022-08-22 01:02:03.456` 这类 `DateTime64` 的 `String` 转换为 `Date` 和 `Date32`。允许将包含 `2022-08-22 01:02:03` 这类 DateTime 的 String 转换为 `Date32`。关闭 [#39598](https://github.com/ClickHouse/ClickHouse/issues/39598)。[#40475](https://github.com/ClickHouse/ClickHouse/pull/40475)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 更好地支持 Parquet 格式中的嵌套数据结构。[#40485](https://github.com/ClickHouse/ClickHouse/pull/40485)（[Arthur Passos](https://github.com/arthurpassos)）。
* 支持从 Avro 将 Array(Record) 读取到展平的嵌套表中。[#40534](https://github.com/ClickHouse/ClickHouse/pull/40534)（[Kruglov Pavel](https://github.com/Avogar)）。
* 为 `EmbeddedRocksDB` 新增只读支持。[#40543](https://github.com/ClickHouse/ClickHouse/pull/40543)（[Lloyd-Pottiger](https://github.com/Lloyd-Pottiger)）。
* 校验 URL 表引擎的压缩方法参数。[#40600](https://github.com/ClickHouse/ClickHouse/pull/40600)（[Frank Chen](https://github.com/FrankChen021)）。
* 文件名后存在查询字符串时，改进 url 表函数/引擎的格式检测。关闭 [#40315](https://github.com/ClickHouse/ClickHouse/issues/40315)。[#40636](https://github.com/ClickHouse/ClickHouse/pull/40636)（[Kruglov Pavel](https://github.com/Avogar)）。
* 使用分组集时禁用投影，因为它会生成错误结果。修复 [#40635](https://github.com/ClickHouse/ClickHouse/issues/40635)。[#40726](https://github.com/ClickHouse/ClickHouse/pull/40726)（[Amos Bird](https://github.com/amosbird)）。
* 修复 `APPLY` 列转换器的格式错误：在表定义中使用时可能损坏元数据。修复 [#37590](https://github.com/ClickHouse/ClickHouse/issues/37590)。[#40727](https://github.com/ClickHouse/ClickHouse/pull/40727)（[Amos Bird](https://github.com/amosbird)）。
* 在 `formatDateTime` 中支持 `%z` 格式描述符，用于格式化时区偏移。[#40736](https://github.com/ClickHouse/ClickHouse/pull/40736)（[Cory Levy](https://github.com/LevyCory)）。
* `clickhouse-client` 交互模式现在将 `.` 和 `/` 解释为“运行上一条命令”。[#40750](https://github.com/ClickHouse/ClickHouse/pull/40750)（[Robert Schulze](https://github.com/rschu1ze)）。
* 修复向 MySQL 数据库引擎和 MySQL 表函数传递 MySQL 超时设置的问题。关闭 [#34168](https://github.com/ClickHouse/ClickHouse/issues/34168)。[#40751](https://github.com/ClickHouse/ClickHouse/pull/40751)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 为文件系统缓存目录创建状态文件，确保不同服务器或缓存不共用缓存目录。[#40820](https://github.com/ClickHouse/ClickHouse/pull/40820)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 为 `EmbeddedRocksDB` 存储新增 `DELETE` 和 `UPDATE` 支持。[#40853](https://github.com/ClickHouse/ClickHouse/pull/40853)（[Antonio Andelic](https://github.com/antonio2368)）。
* ClickHouse Keeper：修复长时间提交期间的关闭行为，并提高允许的请求大小。[#40941](https://github.com/ClickHouse/ClickHouse/pull/40941)（[Antonio Andelic](https://github.com/antonio2368)）。
* 修复 WriteBufferFromS3 中的竞争，添加 TSA 注解。[#40950](https://github.com/ClickHouse/ClickHouse/pull/40950)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 使用 group\_by\_use\_nulls 的分组集应仅将键列转换为可空列。[#40997](https://github.com/ClickHouse/ClickHouse/pull/40997)（[Duc Canh Le](https://github.com/canhld94)）。
* 改善分布式表 INSERT 的可观测性。[#41034](https://github.com/ClickHouse/ClickHouse/pull/41034)（[Frank Chen](https://github.com/FrankChen021)）。
* 为 S3 交互提供更多底层指标。[#41039](https://github.com/ClickHouse/ClickHouse/pull/41039)（[mateng915](https://github.com/mateng0915)）。
* 支持 HTTP 重定向后 Location 标头中的相对路径。关闭 [#40985](https://github.com/ClickHouse/ClickHouse/issues/40985)。[#41162](https://github.com/ClickHouse/ClickHouse/pull/41162)（[Kruglov Pavel](https://github.com/Avogar)）。
* 动态应用 HTTP 处理器变更，无需重启服务器。[#41177](https://github.com/ClickHouse/ClickHouse/pull/41177)（[Azat Khuzhin](https://github.com/azat)）。
* ClickHouse Keeper：关闭时正确关闭活动会话。[#41215](https://github.com/ClickHouse/ClickHouse/pull/41215)（[Antonio Andelic](https://github.com/antonio2368)）。这会缩短出现 “table is read-only” 错误的时间。
* 支持在 clickhouse-client/local 中自动注释 SQL 查询（使用 `Alt-#`，类似 readline）。[#41224](https://github.com/ClickHouse/ClickHouse/pull/41224)（[Azat Khuzhin](https://github.com/azat)）。
* 修复将 `do_no_evict_index_and_mark_files` 从 1 切换到 0 或从 0 切换到 1 后，缓存不兼容的问题。[#41330](https://github.com/ClickHouse/ClickHouse/pull/41330)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 新增 `allow_suspicious_fixed_string_types` 设置，防止用户创建大小超过 256 的 FixedString 类型列。[#41495](https://github.com/ClickHouse/ClickHouse/pull/41495)（[Duc Canh Le](https://github.com/canhld94)）。
* 为 system.parts 添加 `has_lightweight_delete`。[#41564](https://github.com/ClickHouse/ClickHouse/pull/41564)（[Kseniia Sumarokova](https://github.com/kssenii)）。

<h4 id="buildtestingpackaging-improvement-3">
  构建/测试/打包改进
</h4>

* 强制要求每项设置都有文档。[#40644](https://github.com/ClickHouse/ClickHouse/pull/40644)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 强制要求每项当前指标都有文档。[#40645](https://github.com/ClickHouse/ClickHouse/pull/40645)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 强制要求每个性能事件计数器都有文档，并补写缺失文档。[#40646](https://github.com/ClickHouse/ClickHouse/pull/40646)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 通过修正部分依赖，支持最小化 `clickhouse-local` 构建。[#40460](https://github.com/ClickHouse/ClickHouse/pull/40460)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。其大小不足 50 MiB。
* 计算并报告测试中的 SQL 函数覆盖率。[#40593](https://github.com/ClickHouse/ClickHouse/issues/40593)。[#40647](https://github.com/ClickHouse/ClickHouse/pull/40647)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 强制要求每项 MergeTree 设置都有文档。[#40648](https://github.com/ClickHouse/ClickHouse/pull/40648)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 为高层统一服务器组件提供内嵌参考文档的原型。[#40649](https://github.com/ClickHouse/ClickHouse/pull/40649)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 检查修改过的性能测试中的所有查询，确保所有变更查询均经过测试。[#40322](https://github.com/ClickHouse/ClickHouse/pull/40322)（[Nikita Taranov](https://github.com/nickitat)）。
* 修复 TGZ 软件包。[#40681](https://github.com/ClickHouse/ClickHouse/pull/40681)（[Mikhail f. Shiryaev](https://github.com/Felixoid)）。
* 修复调试符号。[#40873](https://github.com/ClickHouse/ClickHouse/pull/40873)（[Azat Khuzhin](https://github.com/azat)）。
* 扩展 CI 配置，创建仅要求 SSE2 的 x86 构建，适用于旧硬件或嵌入式硬件。[#40999](https://github.com/ClickHouse/ClickHouse/pull/40999)（[Robert Schulze](https://github.com/rschu1ze)）。
* 切换至 llvm/clang 15。[#41046](https://github.com/ClickHouse/ClickHouse/pull/41046)（[Azat Khuzhin](https://github.com/azat)）。
* 延续 [#40938](https://github.com/ClickHouse/ClickHouse/issues/40938)。修复 `Loggers` 类违反单一定义规则（ODR）的问题。修复 [#40398](https://github.com/ClickHouse/ClickHouse/issues/40398)、[#40937](https://github.com/ClickHouse/ClickHouse/issues/40937)。[#41060](https://github.com/ClickHouse/ClickHouse/pull/41060)（[Dmitry Novik](https://github.com/novikd)）。
* 将 macOS 二进制文件添加到 GitHub Release 资源，修复 [#37718](https://github.com/ClickHouse/ClickHouse/issues/37718)。[#41088](https://github.com/ClickHouse/ClickHouse/pull/41088)（[Mikhail f. Shiryaev](https://github.com/Felixoid)）。
* c-ares 库现在随 ClickHouse 构建系统一起提供。[#41239](https://github.com/ClickHouse/ClickHouse/pull/41239)（[Robert Schulze](https://github.com/rschu1ze)）。
* 从 ClickHouse 主代码中移除 `dlopen`，在 library-bridge 和 odbc-bridge 中保留。[#41428](https://github.com/ClickHouse/ClickHouse/pull/41428)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 禁止在 ClickHouse 主二进制文件中使用 `dlopen`，因为它有害且不安全。我们不使用它，但某些库可能用它实现“插件”。我们强烈反对将不受控制、危险的第三方库加载到进程地址空间这种过时的技术，因为这种做法极不合理。[#41429](https://github.com/ClickHouse/ClickHouse/pull/41429)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 为 deb 软件包添加 `source` 字段，并更新 `nfpm`。[#41531](https://github.com/ClickHouse/ClickHouse/pull/41531)（[Mikhail f. Shiryaev](https://github.com/Felixoid)）。
* 内部 DWARF 解析器支持 DWARF-5。[#40710](https://github.com/ClickHouse/ClickHouse/pull/40710)（[Azat Khuzhin](https://github.com/azat)）。
* 为 ZooKeeper 客户端添加用于测试的故障注入。[#30498](https://github.com/ClickHouse/ClickHouse/pull/30498)（[Alexander Tokmakov](https://github.com/tavplubix)）。
* 新增针对 S3 存储的 debug 和 tsan 无状态测试。[#35262](https://github.com/ClickHouse/ClickHouse/pull/35262)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 尝试在 S3 之上运行压力测试。[#36837](https://github.com/ClickHouse/ClickHouse/pull/36837)（[alesapin](https://github.com/alesapin)）。
* 在 `clang-tidy` 中启用 `concurrency-mt-unsafe`。[#40224](https://github.com/ClickHouse/ClickHouse/pull/40224)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。

<h4 id="bug-fix">
  错误修复
</h4>

* 修复 [a bug in AWS SDK](https://github.com/aws/aws-sdk-cpp/issues/658) 导致的潜在数据丢失，仅在 ClickHouse 使用 S3 时可能触发。[#40506](https://github.com/ClickHouse/ClickHouse/pull/40506)（[alesapin](https://github.com/alesapin)）。此错误在 AWS SDK 中存在了 5 年，在我们报告后得到修复。
* Native 格式中的恶意数据可能导致崩溃。[#41441](https://github.com/ClickHouse/ClickHouse/pull/41441)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 聚合函数 `categorialInformationValue` 的属性定义不正确，可能在运行时导致空指针解引用。关闭 [#41443](https://github.com/ClickHouse/ClickHouse/issues/41443)。[#41449](https://github.com/ClickHouse/ClickHouse/pull/41449)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 写入 Apache `ORC` 格式数据时，可能发生缓冲区越界。[#41458](https://github.com/ClickHouse/ClickHouse/pull/41458)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 `encrypt` 和 `contingency` 函数以可空元素数组为参数时的内存安全问题。修复 [#41004](https://github.com/ClickHouse/ClickHouse/issues/41004)。[#40195](https://github.com/ClickHouse/ClickHouse/pull/40195)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 'not\_processed' 非空时 MergeJoin 中的错误。[#40335](https://github.com/ClickHouse/ClickHouse/pull/40335)（[liql2007](https://github.com/liql2007)）。
* 修复 IN 运算符发生十进制精度损失时结果不正确的问题，参见 [#41125](https://github.com/ClickHouse/ClickHouse/issues/41125)。[#41130](https://github.com/ClickHouse/ClickHouse/pull/41130)（[Vladimir C](https://github.com/vdimir)）。
* 修复缺失的多层 `Nested` 列的填充。[#37152](https://github.com/ClickHouse/ClickHouse/pull/37152)（[Anton Popov](https://github.com/CurtizJ)）。
* 修复 Ordinary（已弃用）数据库的 SYSTEM UNFREEZE 查询。修复 [https://github.com/ClickHouse/ClickHouse/pull/36424](https://github.com/ClickHouse/ClickHouse/pull/36424)。[#38262](https://github.com/ClickHouse/ClickHouse/pull/38262)（[Vadim Volodin](https://github.com/PolyProgrammist)）。
* 修复 WITH 语句引入的未使用未知列。修复 [#37812](https://github.com/ClickHouse/ClickHouse/issues/37812)。[#39131](https://github.com/ClickHouse/ClickHouse/pull/39131)（[Amos Bird](https://github.com/amosbird)）。
* 修复存在窗口函数时 ORDER BY 的查询分析。修复 [#38741](https://github.com/ClickHouse/ClickHouse/issues/38741)。修复 [#24892](https://github.com/ClickHouse/ClickHouse/issues/24892)。[#39354](https://github.com/ClickHouse/ClickHouse/pull/39354)（[Dmitry Novik](https://github.com/novikd)）。
* 修复用户尝试基于聚合函数计算窗口 ORDER BY/PARTITION BY 表达式时出现的 `Unknown identifier (aggregate-function)` 异常。[#39762](https://github.com/ClickHouse/ClickHouse/pull/39762)（[Vladimir Chebotaryov](https://github.com/quickhouse)）。
* 使用 `max_analyze_depth` 设置限制单个查询的分析次数，防止子查询数量极多的查询出现分析时间指数膨胀。[#40334](https://github.com/ClickHouse/ClickHouse/pull/40334)（[Vladimir C](https://github.com/vdimir)）。
* 修复 MergeTree 引擎家族列 TTL 的罕见错误：重复垂直合并时，可能出现 `Cannot unlink file ColumnName.bin ... No such file or directory.` 错误。[#40346](https://github.com/ClickHouse/ClickHouse/pull/40346)（[alesapin](https://github.com/alesapin)）。
* 如果存在，同时使用 IPv4 和 IPv6 的 DNS 条目。[#40353](https://github.com/ClickHouse/ClickHouse/pull/40353)（[Maksim Kita](https://github.com/kitaisreal)）。
* 允许从 Hadoop 读取 Snappy 压缩文件。[#40482](https://github.com/ClickHouse/ClickHouse/pull/40482)（[Kruglov Pavel](https://github.com/Avogar)）。
* 修复解析包含不同维度数组的 `Object` 类型值（实验性功能）时的崩溃。[#40483](https://github.com/ClickHouse/ClickHouse/pull/40483)（[Duc Canh Le](https://github.com/canhld94)）。
* 修复 `input_format_tsv_skip_first_lines` 设置。[#40491](https://github.com/ClickHouse/ClickHouse/pull/40491)（[mini4](https://github.com/mini4)）。
* 修复启动 MaterializedPostgreSQL 数据库/表引擎时的竞争条件。[#40262](https://github.com/ClickHouse/ClickHouse/issues/40262)。修复达到 relcache\_callback\_list 槽位上限时的错误。[#40511](https://github.com/ClickHouse/ClickHouse/pull/40511)（[Maksim Buren](https://github.com/maks-buren630501)）。
* 修复解析 DateTime64 时可能出现的 'Decimal math overflow' 错误。[#40546](https://github.com/ClickHouse/ClickHouse/pull/40546)（[Kruglov Pavel](https://github.com/Avogar)）。
* 修复包含轻量删除行的数据片段的垂直合并。[#40559](https://github.com/ClickHouse/ClickHouse/pull/40559)（[Alexander Gololobov](https://github.com/davenger)）。
* 修复 URL 表引擎启用压缩时写入数据发生的段错误。[#40565](https://github.com/ClickHouse/ClickHouse/pull/40565)（[Frank Chen](https://github.com/FrankChen021)）。
* 修复 arrayElement 函数处理 Map 时可能出现的逻辑错误 `'Invalid Field get from type UInt64 to type String'`。[#40572](https://github.com/ClickHouse/ClickHouse/pull/40572)（[Kruglov Pavel](https://github.com/Avogar)）。
* 修复文件系统缓存中可能发生的竞争。[#40586](https://github.com/ClickHouse/ClickHouse/pull/40586)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 移除跳过 `MergeTree` 表中未受影响分区的变更操作这一功能，因为它从未正确工作，还可能使已完成的变更操作重新出现。[#40589](https://github.com/ClickHouse/ClickHouse/pull/40589)（[Alexander Tokmakov](https://github.com/tavplubix)）。
* 运行时在配置中添加已被占用的 gRPC 端口，会导致 ClickHouse 服务器崩溃。[#40597](https://github.com/ClickHouse/ClickHouse/pull/40597)（[何李夫](https://github.com/helifu)）。
* 修复 `base58Encode / base58Decode` 对前导 0 / '1' 的处理。[#40620](https://github.com/ClickHouse/ClickHouse/pull/40620)（[Andrey Zvonov](https://github.com/zvonand)）。
* Keeper 修复：修复安装快照时访问日志的竞争。[#40627](https://github.com/ClickHouse/ClickHouse/pull/40627)（[Antonio Andelic](https://github.com/antonio2368)）。
* 修复 toFixedString 函数的短路执行。部分解决 [#40622](https://github.com/ClickHouse/ClickHouse/issues/40622)。[#40628](https://github.com/ClickHouse/ClickHouse/pull/40628)（[Kruglov Pavel](https://github.com/Avogar)）。
* 修复 SQLite int8 列转换为 ClickHouse int64 列的问题。修复 [#40639](https://github.com/ClickHouse/ClickHouse/issues/40639)。[#40642](https://github.com/ClickHouse/ClickHouse/pull/40642)（[Barum Rho](https://github.com/barumrho)）。
* 修复递归 `Buffer` 表中的栈溢出。关闭 [#40637](https://github.com/ClickHouse/ClickHouse/issues/40637)。[#40643](https://github.com/ClickHouse/ClickHouse/pull/40643)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 将新查询插入 `ProcessList` 时会发生内存分配。如果这些分配触及内存上限，不能使用 `OvercommitTracker`，因为已持有 `ProcessList::mutex`。修复 [#40611](https://github.com/ClickHouse/ClickHouse/issues/40611)。[#40677](https://github.com/ClickHouse/ClickHouse/pull/40677)（[Dmitry Novik](https://github.com/novikd)）。
* 修复 max\_read\_buffer\_size=0 时读取标记发生的 LOGICAL\_ERROR。[#40705](https://github.com/ClickHouse/ClickHouse/pull/40705)（[Azat Khuzhin](https://github.com/azat)）。
* 修复没有查询上下文时向物化视图推送数据（来自 Kafka 等）发生的内存泄漏。[#40732](https://github.com/ClickHouse/ClickHouse/pull/40732)（[Azat Khuzhin](https://github.com/azat)）。
* 修复 CSV 结构推断中可能出现的 Attempt to read after eof 错误。[#40746](https://github.com/ClickHouse/ClickHouse/pull/40746)（[Kruglov Pavel](https://github.com/Avogar)）。
* 修复直写缓存中的逻辑错误 “File segment completion can be done only by downloader”。关闭 [#40748](https://github.com/ClickHouse/ClickHouse/issues/40748)。[#40759](https://github.com/ClickHouse/ClickHouse/pull/40759)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 使 GROUPING 函数的结果与 SQL 标准和其他数据库管理系统一致。[#40762](https://github.com/ClickHouse/ClickHouse/pull/40762)（[Dmitry Novik](https://github.com/novikd)）。
* [#40595](https://github.com/ClickHouse/ClickHouse/issues/40595) 报告 `host_regexp` 功能无法正确配合 `/etc/hosts` 中的名称到地址解析。现已修复。[#40769](https://github.com/ClickHouse/ClickHouse/pull/40769)（[Arthur Passos](https://github.com/arthurpassos)）。
* 修复 Log 家族的增量备份。[#40827](https://github.com/ClickHouse/ClickHouse/pull/40827)（[Vitaly Baranov](https://github.com/vitlibar)）。
* 修复零拷贝复制中极少发生、可能导致潜在数据丢失的错误。[#40844](https://github.com/ClickHouse/ClickHouse/pull/40844)（[alesapin](https://github.com/alesapin)）。
* 修复同一个集合表达式由不同列构建时，键条件分析发生的崩溃。[#40850](https://github.com/ClickHouse/ClickHouse/pull/40850)（[Duc Canh Le](https://github.com/canhld94)）。
* 修复嵌套 JSON 对象的结构推断。[#40851](https://github.com/ClickHouse/ClickHouse/pull/40851)（[Kruglov Pavel](https://github.com/Avogar)）。
* 修复文件系统缓存文件的三位字符前缀目录为空时未被删除的问题。关闭 [#40797](https://github.com/ClickHouse/ClickHouse/issues/40797)。[#40867](https://github.com/ClickHouse/ClickHouse/pull/40867)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复连接副本失败时未捕获的 DNS\_ERROR。[#40881](https://github.com/ClickHouse/ClickHouse/pull/40881)（[Robert Coelho](https://github.com/coelho)）。
* 修复移除子查询中不需要的列时的错误。[#40884](https://github.com/ClickHouse/ClickHouse/pull/40884)（[luocongkai](https://github.com/TKaxe)）。
* 修复远程读取缓冲区的额外内存分配。[#40896](https://github.com/ClickHouse/ClickHouse/pull/40896)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复用户的删除数据库授权已被显式撤销，却仍能删除数据库的行为。[#40906](https://github.com/ClickHouse/ClickHouse/pull/40906)（[Nikita Mikhaylov](https://github.com/nikitamikhaylov)）。
* ClickHouse Keeper 修复：将写请求路径与 Keeper 内部系统节点路径正确比较。[#40918](https://github.com/ClickHouse/ClickHouse/pull/40918)（[Antonio Andelic](https://github.com/antonio2368)）。
* 修复 WriteBufferFromS3 中的死锁。[#40943](https://github.com/ClickHouse/ClickHouse/pull/40943)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复 `DESCRIBE TABLE url()` 和部分其他 `DESCRIBE TABLE <table_function>()` 的访问权限。[#40975](https://github.com/ClickHouse/ClickHouse/pull/40975)（[Vitaly Baranov](https://github.com/vitlibar)）。
* 移除 `WITH GROUPING SETS` 的错误解析逻辑，该逻辑可能导致空指针解引用。[#41049](https://github.com/ClickHouse/ClickHouse/pull/41049)（[Duc Canh Le](https://github.com/canhld94)）。
* ClickHouse Keeper 修复：修复 Keeper 关闭期间可能发生的段错误。[#41075](https://github.com/ClickHouse/ClickHouse/pull/41075)（[Antonio Andelic](https://github.com/antonio2368)）。
* 修复聚合函数组合器中可能发生的段错误、堆内存释放后使用和内存泄漏。关闭 [#40848](https://github.com/ClickHouse/ClickHouse/issues/40848)。[#41083](https://github.com/ClickHouse/ClickHouse/pull/41083)（[Kruglov Pavel](https://github.com/Avogar)）。
* 修复窗口视图的 query\_views\_log。[#41132](https://github.com/ClickHouse/ClickHouse/pull/41132)（[Raúl Marín](https://github.com/Algunenano)）。
* 默认禁用 optimize\_monotonous\_functions\_in\_order\_by，缓解 [#40094](https://github.com/ClickHouse/ClickHouse/issues/40094)。[#41136](https://github.com/ClickHouse/ClickHouse/pull/41136)（[Denny Crane](https://github.com/den-crane)）。
* 修复数据库引擎从 Ordinary 自动转换为 Atomic 时的 “possible deadlock avoided” 错误。[#41146](https://github.com/ClickHouse/ClickHouse/pull/41146)（[Alexander Tokmakov](https://github.com/tavplubix)）。
* 修复 SortedBlocksWriter 处理空数据块时的 SIGSEGV（使用 `optimize_aggregation_in_order` 和 `join_algorithm=auto` 时可能出现）。[#41154](https://github.com/ClickHouse/ClickHouse/pull/41154)（[Azat Khuzhin](https://github.com/azat)）。
* 修复 ARRAY JOIN 生效时使用简单计数优化导致的查询结果不正确。修复 [#39431](https://github.com/ClickHouse/ClickHouse/issues/39431)。[#41158](https://github.com/ClickHouse/ClickHouse/pull/41158)（[Denny Crane](https://github.com/den-crane)）。
* 修复 GetPriorityForLoadBalancing::getPriorityFunc() 中的栈内存返回后使用。[#41159](https://github.com/ClickHouse/ClickHouse/pull/41159)（[Azat Khuzhin](https://github.com/azat)）。
* 修复位置参数的 Positional argument out of bounds 异常。关闭 [#40634](https://github.com/ClickHouse/ClickHouse/issues/40634)。[#41189](https://github.com/ClickHouse/ClickHouse/pull/41189)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复损坏且已分离数据片段的后台清理。[#41190](https://github.com/ClickHouse/ClickHouse/pull/41190)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复大量带 WHERE 的交叉连接导致查询重写指数膨胀的问题，关闭 [#21557](https://github.com/ClickHouse/ClickHouse/issues/21557)。[#41223](https://github.com/ClickHouse/ClickHouse/pull/41223)（[Vladimir C](https://github.com/vdimir)）。
* 修复直写缓存中可能发生的逻辑错误，原因是并非所有异常类型都得到所需处理。关闭 [#41208](https://github.com/ClickHouse/ClickHouse/issues/41208)。[#41232](https://github.com/ClickHouse/ClickHouse/pull/41232)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复 system.filesystem\_cache\_log 中的 String 日志条目。[#41233](https://github.com/ClickHouse/ClickHouse/pull/41233)（[jmimbrero](https://github.com/josemimbrero-tinybird)）。
* 修复子查询带 `OFFSET`、外层查询带 `WHERE` 时可能返回错误结果的问题。修复 [#40416](https://github.com/ClickHouse/ClickHouse/issues/40416)。[#41280](https://github.com/ClickHouse/ClickHouse/pull/41280)（[Alexander Tokmakov](https://github.com/tavplubix)）。
* 修复启用 `query_plan_optimize_primary_key` 时可能出现的错误查询结果。修复 [#40599](https://github.com/ClickHouse/ClickHouse/issues/40599)。[#41281](https://github.com/ClickHouse/ClickHouse/pull/41281)（[Nikolai Kochetov](https://github.com/KochetovNicolai)）。
* 禁止 lowerUTF8/upperUTF8 中的无效序列影响其他行。[#41286](https://github.com/ClickHouse/ClickHouse/pull/41286)（[Azat Khuzhin](https://github.com/azat)）。
* 修复包含 `Object` 类型列的 `ALTER <table> ADD COLUMN` 查询。[#41290](https://github.com/ClickHouse/ClickHouse/pull/41290)（[Anton Popov](https://github.com/CurtizJ)）。
* 修复配置中没有 `distributed_ddl.path` 时，查询 `system.distributed_ddl_queue` 出现 “No node” 错误的问题。修复 [#41096](https://github.com/ClickHouse/ClickHouse/issues/41096)。[#41296](https://github.com/ClickHouse/ClickHouse/pull/41296)（[young scott](https://github.com/young-scott)）。
* 修复磁盘对象存储中不正确的逻辑错误 `Expected relative path`。与 [#41246](https://github.com/ClickHouse/ClickHouse/issues/41246) 相关。[#41297](https://github.com/ClickHouse/ClickHouse/pull/41297)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 通过 MsgPack 格式插入 UUID 前，添加列类型检查。[#41309](https://github.com/ClickHouse/ClickHouse/pull/41309)（[Kruglov Pavel](https://github.com/Avogar)）。
* 修复异步向 `Object` 类型列插入格式错误的数据（启用 `async_insert`）后可能发生的崩溃。当所有异步插入批次中的 JSON 都无效、无法解析时可能发生。[#41336](https://github.com/ClickHouse/ClickHouse/pull/41336)（[Anton Popov](https://github.com/CurtizJ)）。
* 修复 async\_socket\_for\_remote/use\_hedged\_requests 与并行 KILL 配合使用时可能发生的死锁。[#41343](https://github.com/ClickHouse/ClickHouse/pull/41343)（[Azat Khuzhin](https://github.com/azat)）。
* 默认禁用 optimize\_rewrite\_sum\_if\_to\_count\_if，缓解 [#38605](https://github.com/ClickHouse/ClickHouse/issues/38605)、[#38683](https://github.com/ClickHouse/ClickHouse/issues/38683)。[#41388](https://github.com/ClickHouse/ClickHouse/pull/41388)（[Denny Crane](https://github.com/den-crane)）。
* 从 22.8 起，如果数据库是 `Replicated` 且集群名与数据库名相同，则忽略 `ON CLUSTER` 子句。这导致 `DROP PARTITION ON CLUSTER` 在 `Replicated` 中行为不符合预期。现已修复：只对在数据库级复制的查询忽略 `ON CLUSTER`。修复 [#41299](https://github.com/ClickHouse/ClickHouse/issues/41299)。[#41390](https://github.com/ClickHouse/ClickHouse/pull/41390)（[Alexander Tokmakov](https://github.com/tavplubix)）。
* 修复取消查询（`KILL QUERY` 或服务器关闭）时可能发生的挂起/死锁。[#41467](https://github.com/ClickHouse/ClickHouse/pull/41467)（[Azat Khuzhin](https://github.com/azat)）。
* 修复使用 JBOD 功能时服务器可能发生的崩溃。修复 [#41365](https://github.com/ClickHouse/ClickHouse/issues/41365)。[#41483](https://github.com/ClickHouse/ClickHouse/pull/41483)（[Amos Bird](https://github.com/amosbird)）。
* 修复从可空固定长度字符串到字符串的转换。[#41541](https://github.com/ClickHouse/ClickHouse/pull/41541)（[Duc Canh Le](https://github.com/canhld94)）。
* 防止向 groupBitmap\* 传递错误的聚合状态时发生崩溃。[#41563](https://github.com/ClickHouse/ClickHouse/pull/41563)（[Raúl Marín](https://github.com/Algunenano)）。
* 带 `ORDER BY` 且 `1500 <= LIMIT <= max_block_size` 的查询可能返回不正确结果，缺少排序结果顶部的一些行。修复 [#41182](https://github.com/ClickHouse/ClickHouse/issues/41182)。[#41576](https://github.com/ClickHouse/ClickHouse/pull/41576)（[Nikolai Kochetov](https://github.com/KochetovNicolai)）。
* 修复物化视图场景下 X-ClickHouse-Summary 中读取的字节数/行数。[#41586](https://github.com/ClickHouse/ClickHouse/pull/41586)（[Raúl Marín](https://github.com/Algunenano)）。
* 修复带 `OFFSET` 的查询可能出现的 `pipeline stuck` 异常。该错误在 `enable_optimize_predicate_expression = 0` 且 `WHERE` 条件始终为 false 时被发现。修复 [#41383](https://github.com/ClickHouse/ClickHouse/issues/41383)。[#41588](https://github.com/ClickHouse/ClickHouse/pull/41588)（[Nikolai Kochetov](https://github.com/KochetovNicolai)）。
