<h3 id="a-id249a-clickhouse-release-249-2024-09-26">
  <a id="249" /> ClickHouse 24.9 版本, 2024-09-26. [演示文稿](https://presentations.clickhouse.com/2024-release-24.9/), [视频](https://www.youtube.com/watch?v=ray6wJGCHbs)
</h3>

<Frame>
  <iframe src="https://www.youtube.com/embed/ray6wJGCHbs" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
</Frame>

<h4 id="backward-incompatible-change-3">
  向后不兼容变更
</h4>

* 命名元组支持 `a[b].c` 形式的表达式，也支持从任意表达式按名称取元素，例如 `expr().name`，便于处理 JSON。关闭 [#54965](https://github.com/ClickHouse/ClickHouse/issues/54965)。此前 `expr().name` 被解析为 `tupleElement(expr(), name)`，分析器会查找列 `name`，而非相应元组元素；新版改为 `tupleElement(expr(), 'name')`。旧行为在大多数情况下无法工作，但存在极不常见的不兼容场景：将元组元素名称保存在与元素名称不同的列或别名中，例如 `SELECT 'b' AS a, CAST([tuple(123)] AS 'Array(Tuple(b UInt8))') AS t, t[1].a`。你极可能未使用此类查询，但仍须将本变更标记为潜在不向后兼容。 [#68435](https://github.com/ClickHouse/ClickHouse/pull/68435) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 启用 `print_pretty_type_names` 时，将在 `SHOW CREATE TABLE`、`formatQuery` 及 `clickhouse-client` 和 `clickhouse-local` 交互模式中美化打印 `Tuple` 类型。此前此设置仅用于 `DESCRIBE` 和 `toTypeName`。关闭 [#65753](https://github.com/ClickHouse/ClickHouse/issues/65753)。 [#68492](https://github.com/ClickHouse/ClickHouse/pull/68492) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 禁止在 `Replicated` 数据库建表时显式指定 UUID；同时禁止为其中的 \*MergeTree 表显式指定 Keeper 路径和副本名称。新增 `database_replicated_allow_explicit_uuid`，并将 `database_replicated_allow_replicated_engine_arguments` 从 Bool 改为 UInt64。 [#66104](https://github.com/ClickHouse/ClickHouse/pull/66104) ([Alexander Tokmakov](https://github.com/tavplubix)).

<h4 id="new-feature-3">
  新功能
</h4>

* 允许用户拥有多种身份验证方法，而非仅一种；可将方法重置为最近添加的一种。如果计划一段时间同时运行 24.8 和 24.9 实例，建议期间设置 `max_authentication_methods_per_user` = 1，以免潜在不兼容。 [#65277](https://github.com/ClickHouse/ClickHouse/pull/65277) ([Arthur Passos](https://github.com/arthurpassos)).
* 支持 `ATTACH PARTITION ALL FROM`。 [#61987](https://github.com/ClickHouse/ClickHouse/pull/61987) ([Kirill Nikiforov](https://github.com/allmazz)).
* 新增 `input_format_json_empty_as_default`，启用后将 JSON 输入中的空字段视为默认值。关闭 [#59339](https://github.com/ClickHouse/ClickHouse/issues/59339)。 [#66782](https://github.com/ClickHouse/ClickHouse/pull/66782) ([Alexis Arnaud](https://github.com/a-a-f)).
* 新增 `overlay` 和 `overlayUTF8`，以另一字符串替换字符串的一部分。例如，`SELECT overlay('Hello New York', 'Jersey', 11)` 返回 `Hello New Jersey`。 [#66933](https://github.com/ClickHouse/ClickHouse/pull/66933) ([李扬](https://github.com/taiyang-li)).
* 支持分区内轻量删除：`DELETE FROM [db.]table [ON CLUSTER cluster] [IN PARTITION partition_expr] WHERE expr; `。 [#67805](https://github.com/ClickHouse/ClickHouse/pull/67805) ([sunny](https://github.com/sunny19930321)).
* 实现不同单位（如秒与分钟）的 `Interval` 值比较，现在会转换为最小公共超类型。 [#68057](https://github.com/ClickHouse/ClickHouse/pull/68057) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 新增 `create_if_not_exists`，使 CREATE 语句默认采用 `IF NOT EXISTS` 行为。 [#68164](https://github.com/ClickHouse/ClickHouse/pull/68164) ([Peter Nguyen](https://github.com/petern48)).
* 允许读取 Azure 和本地的 `Iceberg` 表。 [#68210](https://github.com/ClickHouse/ClickHouse/pull/68210) ([Daniil Ivanik](https://github.com/divanik)).
* 可按标签删除查询缓存条目。例如，`SELECT 1 SETTINGS use_query_cache = true, query_cache_tag = 'abc'` 创建的条目可通过 `SYSTEM DROP QUERY CACHE TAG 'abc'` 删除。 [#68477](https://github.com/ClickHouse/ClickHouse/pull/68477) ([Michał Tabaszewski](https://github.com/pinsvin00)).
* 为命名集合添加存储加密。 [#68615](https://github.com/ClickHouse/ClickHouse/pull/68615) ([Pablo Marcos](https://github.com/pamarcos)).
* 为 `URL` 表引擎新增虚拟列 `_headers`。关闭 [#65026](https://github.com/ClickHouse/ClickHouse/issues/65026)。 [#68867](https://github.com/ClickHouse/ClickHouse/pull/68867) ([flynn](https://github.com/ucasfl)).
* 新增 `system.projections` 表，跟踪可用投影。 [#68901](https://github.com/ClickHouse/ClickHouse/pull/68901) ([Jordi Villar](https://github.com/jrdi)).
* 新增函数 `arrayZipUnaligned` 以兼容 Spark（其中名为 `arrays_zip`），在原有 `arrayZip` 基础上允许长度不一致的数组。 [#69030](https://github.com/ClickHouse/ClickHouse/pull/69030) ([李扬](https://github.com/taiyang-li)).
* 为 Keeper 命令行客户端新增 `cp`/`mv`，原子复制或移动节点。 [#69034](https://github.com/ClickHouse/ClickHouse/pull/69034) ([Mikhail Artemenko](https://github.com/Michicosun)).
* 为 `arrayAUC` 新增参数 `scale`（默认 `true`），允许跳过归一化步骤（问题 [#69609](https://github.com/ClickHouse/ClickHouse/issues/69609)）。 [#69717](https://github.com/ClickHouse/ClickHouse/pull/69717) ([gabrielmcg44](https://github.com/gabrielmcg44)).

<h4 id="experimental-feature-2">
  实验性功能
</h4>

* 新增 `input_format_try_infer_variants`：文本格式结构推断中，若列或数组元素有多个可能类型，允许推断为 `Variant`。 [#63798](https://github.com/ClickHouse/ClickHouse/pull/63798) ([Shaun Struwig](https://github.com/Blargian)).
* 新增聚合函数 `distinctDynamicTypes`/`distinctJSONPaths`/`distinctJSONPathsAndTypes`，便于内省 JSON 列类型的内容。 [#68463](https://github.com/ClickHouse/ClickHouse/pull/68463) ([Kruglov Pavel](https://github.com/Avogar)).
* 新增算法，通过一致性哈希确定并行副本之间分配标记的单位。为不同读取模式选择不同标记数量以提升性能。 [#68424](https://github.com/ClickHouse/ClickHouse/pull/68424) ([Nikita Taranov](https://github.com/nickitat)).
* 此前，并行副本通告处理中的数据片段去重复杂度为 O(n^2)，对于数据片段或分区很多的表耗时明显。现在改为 O(n\*log(n))。 [#69596](https://github.com/ClickHouse/ClickHouse/pull/69596) ([Alexander Gololobov](https://github.com/davenger)).
* 可刷新物化视图改进：新增追加模式（`... REFRESH EVERY 1 MINUTE APPEND ...`），向现有表添加行，而非覆盖整张表；支持重试（默认禁用，在查询 SETTINGS 中配置）；新增 `SYSTEM WAIT VIEW <name>`，等待当前刷新；以及部分修复。 [#58934](https://github.com/ClickHouse/ClickHouse/pull/58934) ([Michael Kolupaev](https://github.com/al13n321)).
* 新增实验性统计类型 `min_max`，支持估计数值列上的范围谓词，例如 `x < 100`。 [#67013](https://github.com/ClickHouse/ClickHouse/pull/67013) ([JackyWoo](https://github.com/JackyWoo)).
* 改进从 Variant/Dynamic 列进行 castOrDefault，即使内部类型完全无法转换也可工作。 [#67150](https://github.com/ClickHouse/ClickHouse/pull/67150) ([Kruglov Pavel](https://github.com/Avogar)).
* MaterializedPostgreSQL 支持仅复制部分列。关闭 [#33748](https://github.com/ClickHouse/ClickHouse/issues/33748)。 [#69092](https://github.com/ClickHouse/ClickHouse/pull/69092) ([Kruglov Kirill](https://github.com/1on)).

<h4 id="performance-improvement-3">
  性能改进
</h4>

* Hive 分区仅读取所需文件。 [#68963](https://github.com/ClickHouse/ClickHouse/pull/68963) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 在 LEFT 或 INNER 哈希连接中，若右表键较密集，则按键重新排列右表以提升 JOIN 性能。 [#60341](https://github.com/ClickHouse/ClickHouse/pull/60341) ([kevinyhzou](https://github.com/KevinyhZou)).
* 通过惰性追加行列表提升 ALL JOIN 性能。 [#63677](https://github.com/ClickHouse/ClickHouse/pull/63677) ([kevinyhzou](https://github.com/KevinyhZou)).
* 启动期间异步加载文件系统缓存元数据，加快重启（由 `load_metadata_asynchronously` 控制）。 [#65736](https://github.com/ClickHouse/ClickHouse/pull/65736) ([Daniel Pozo Escalona](https://github.com/danipozo)).
* 优化 `array` 和 `map` 函数，使部分常见场景处理更快。 [#67707](https://github.com/ClickHouse/ClickHouse/pull/67707) ([李扬](https://github.com/taiyang-li)).
* 对 ORC 字符串读取进行简单优化，尤其是在列无 NULL 时。 [#67794](https://github.com/ClickHouse/ClickHouse/pull/67794) ([李扬](https://github.com/taiyang-li)).
* 减少合并调度步骤开销，提升整体合并性能。 [#68016](https://github.com/ClickHouse/ClickHouse/pull/68016) ([Anton Popov](https://github.com/CurtizJ)).
* 未设置配置档案或凭据且 IMDS 不可用时（例如在云外机器查询公共存储桶），加速 S3 请求。关闭 [#52771](https://github.com/ClickHouse/ClickHouse/issues/52771)。 [#68082](https://github.com/ClickHouse/ClickHouse/pull/68082) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 消除 `RowInputFormatWithNamesAndTypes` 中格式读取器的虚调用，以提升性能。 [#68437](https://github.com/ClickHouse/ClickHouse/pull/68437) ([李扬](https://github.com/taiyang-li)).
* 按键 GROUP BY 聚合时，为 `uniq` 增加并行合并，最大化 CPU 利用率。 [#68441](https://github.com/ClickHouse/ClickHouse/pull/68441) ([Jiebin Sun](https://github.com/jiebinn)).
* 新增 `output_format_orc_dictionary_key_size_threshold`，允许在 `ORC` 输出中为字符串列启用字典编码，减少 `ORC` 文件大小并显著改善读取性能。 [#68591](https://github.com/ClickHouse/ClickHouse/pull/68591) ([李扬](https://github.com/taiyang-li)).
* 新增 Keeper 请求 RemoveRecursive，删除节点及其整个子树。 [#69332](https://github.com/ClickHouse/ClickHouse/pull/69332) ([Mikhail Artemenko](https://github.com/Michicosun)).
* 通过并行向向量索引添加数据，加快插入含向量相似度索引的表。 [#69493](https://github.com/ClickHouse/ClickHouse/pull/69493) ([flynn](https://github.com/ucasfl)).
* 使用自适应写入缓冲区大小，降低 JSON 插入内存占用。宽数据片段中 JSON 列创建的许多文件数据量很小，没有必要为每个文件分配 1 MB 缓冲区。 [#69272](https://github.com/ClickHouse/ClickHouse/pull/69272) ([Kruglov Pavel](https://github.com/Avogar)).
* 避免将线程归还并发哈希连接线程池，以免查询过度创建线程。 [#69406](https://github.com/ClickHouse/ClickHouse/pull/69406) ([Duc Canh Le](https://github.com/canhld94)).

<h4 id="improvement-3">
  改进
</h4>

* CREATE TABLE AS 现在复制 PRIMARY KEY、ORDER BY 等子句，目前仅支持 MergeTree 家族表引擎。 [#69076](https://github.com/ClickHouse/ClickHouse/pull/69076) ([sakulali](https://github.com/sakulali)).
* 加固小型实体解析相关代码，发现并修复以下小问题：- `DeltaLake` 表以 Bool 分区时，分区值始终被解释为 false；- `ExternalDistributed` 表只使用所给地址中的单个分片；`max_threads` 等设置值被打印为 `'auto(N)'`，而非 `auto(N)`。 [#52503](https://github.com/ClickHouse/ClickHouse/pull/52503) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 使用 cgroup 专属指标而非系统全局指标计量 CPU 使用。 [#62003](https://github.com/ClickHouse/ClickHouse/pull/62003) ([Nikita Taranov](https://github.com/nickitat)).
* 远程 S3 磁盘的 I/O 调度改在 HTTP 套接字流级别进行，而非整个 S3 请求级别，以解决 `bandwidth_limit` 限流问题。 [#65182](https://github.com/ClickHouse/ClickHouse/pull/65182) ([Sergei Trifonov](https://github.com/serxa)).
* 此前 `upperUTF8` 和 `lowerUTF8` 只能转换西里尔字符的大小写，现已移除此限制，支持任意语言字符。例如，`SELECT upperUTF8('Süden')` 现在返回 `SÜDEN`。 [#65761](https://github.com/ClickHouse/ClickHouse/pull/65761) ([李扬](https://github.com/taiyang-li)).
* 对含投影的表执行轻量删除时，除抛出异常（默认）或删除投影外，新增第三种选择：继续轻量删除，之后重建投影。 [#66169](https://github.com/ClickHouse/ClickHouse/pull/66169) ([jsc0218](https://github.com/jsc0218)).
* 新增 `dns_allow_resolve_names_to_ipv4` 和 `dns_allow_resolve_names_to_ipv6`，允许阻止特定 IP 地址族的连接。 [#66895](https://github.com/ClickHouse/ClickHouse/pull/66895) ([MikhailBurdukov](https://github.com/MikhailBurdukov)).
* clickhouse-client 可通过 ignore\_shell\_suspend 配置是否忽略 Ctrl+Z。 [#67134](https://github.com/ClickHouse/ClickHouse/pull/67134) ([Azat Khuzhin](https://github.com/azat)).
* 改进 JSON 输出的 UTF-8 校验，确保结果数据含某些字节序列时仍生成有效 JSON。 [#67938](https://github.com/ClickHouse/ClickHouse/pull/67938) ([mwoenker](https://github.com/mwoenker)).
* 为合并与变更操作添加 Profile Event，改善内省。 [#68015](https://github.com/ClickHouse/ClickHouse/pull/68015) ([Anton Popov](https://github.com/CurtizJ)).
* ODBC：从服务器配置读取 http\_max\_tries。 [#68128](https://github.com/ClickHouse/ClickHouse/pull/68128) ([Rodolphe Dugé de Bernonville](https://github.com/RodolpheDuge)).
* 基于 X.509 SubjectAltName 扩展识别用户时支持通配符。 [#68236](https://github.com/ClickHouse/ClickHouse/pull/68236) ([Marco Vilas Boas](https://github.com/marco-vb)).
* 改进日期时间结构推断。仅含小数部分时使用 `DateTime64`，否则使用普通 DateTime。Date/DateTime 推断更严格，尤其在 `date_time_input_format='best_effort'` 时，避免边界情况下从字符串错误推断日期时间。 [#68382](https://github.com/ClickHouse/ClickHouse/pull/68382) ([Kruglov Pavel](https://github.com/Avogar)).
* 移除字典中旧的命名集合代码，替换为新实现，允许字典使用通过 DDL 创建的命名集合。关闭 [#60936](https://github.com/ClickHouse/ClickHouse/issues/60936)，关闭 [#36890](https://github.com/ClickHouse/ClickHouse/issues/36890)。 [#68412](https://github.com/ClickHouse/ClickHouse/pull/68412) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 外部 HTTP 身份验证器使用 HTTP/1.1，而非默认的 HTTP/1.0。 [#68456](https://github.com/ClickHouse/ClickHouse/pull/68456) ([Aleksei Filatov](https://github.com/aalexfvk)).
* 新增一组线程池内省指标，深入观察线程池性能与行为。 [#68674](https://github.com/ClickHouse/ClickHouse/pull/68674) ([filimonov](https://github.com/filimonov)).
* `Values` 格式的异步插入支持查询参数。 [#68741](https://github.com/ClickHouse/ClickHouse/pull/68741) ([Anton Popov](https://github.com/CurtizJ)).
* `dateTrunc` 和 `toStartOfInterval` 支持 `Date32`。 [#68874](https://github.com/ClickHouse/ClickHouse/pull/68874) ([LiuNeng](https://github.com/liuneng1994)).
* 为 `system.processors_profile_log` 新增 `plan_step_name` 和 `plan_step_description` 列。 [#68954](https://github.com/ClickHouse/ClickHouse/pull/68954) ([Alexander Gololobov](https://github.com/davenger)).
* 嵌入式字典支持西班牙语。 [#69035](https://github.com/ClickHouse/ClickHouse/pull/69035) ([Vasily Okunev](https://github.com/VOkunev)).
* 在简短故障信息中添加 CPU 架构。 [#69037](https://github.com/ClickHouse/ClickHouse/pull/69037) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 重试期间无法建立新的 Keeper 连接时，查询会更快失败。 [#69148](https://github.com/ClickHouse/ClickHouse/pull/69148) ([Raúl Marín](https://github.com/Algunenano)).
* 更新数据库工厂，使用户自定义数据库引擎可接收参数、设置和表覆盖，类似 StorageFactory。 [#69201](https://github.com/ClickHouse/ClickHouse/pull/69201) ([NikBarykin](https://github.com/NikBarykin)).
* 将所有外部表引擎和函数替换为 `Null` 的恢复模式（`restore_replace_external_engines_to_null`、`restore_replace_external_table_functions_to_null`）此前在表含 SETTINGS 时失败。现在此时会从表定义移除设置，允许恢复此类表。 [#69253](https://github.com/ClickHouse/ClickHouse/pull/69253) ([Ilya Yatsishin](https://github.com/qoega)).
* 在 ClickHouse 镜像入口脚本中，为 XML 正确转义 CLICKHOUSE\_PASSWORD。 [#69301](https://github.com/ClickHouse/ClickHouse/pull/69301) ([aohoyd](https://github.com/aohoyd)).
* 允许 `arrayZip`/`arrayZipUnaligned` 接收空参数，类似 [https://github.com/ClickHouse/ClickHouse/pull/65887](https://github.com/ClickHouse/ClickHouse/pull/65887) 中的 concat，用于 Gluten CH 后端的 Spark 兼容。 [#69576](https://github.com/ClickHouse/ClickHouse/pull/69576) ([李扬](https://github.com/taiyang-li)).
* Keeper 内部通信支持更高级的 SSL 选项，例如受口令保护的私钥。 [#69582](https://github.com/ClickHouse/ClickHouse/pull/69582) ([Antonio Andelic](https://github.com/antonio2368)).
* 数据片段或分区很多的大表，索引分析可能耗时明显。本变更允许在此阶段终止高负载查询。 [#69606](https://github.com/ClickHouse/ClickHouse/pull/69606) ([Alexander Gololobov](https://github.com/davenger)).
* 遮蔽 `gcs` 表函数中的敏感信息。 [#69611](https://github.com/ClickHouse/ClickHouse/pull/69611) ([Vitaly Baranov](https://github.com/vitlibar)).
* 对会减少行数的合并重建投影。 [#62364](https://github.com/ClickHouse/ClickHouse/pull/62364) ([cangyin](https://github.com/cangyin)).

<h4 id="bug-fix-user-visible-misbehavior-in-an-official-stable-release-3">
  缺陷修复（正式稳定版本中用户可见的异常行为）
</h4>

* 修复不受支持的实验性 MaterializedPostgreSQL 引擎在 PostgreSQL 数据库名含“-”时附加表的问题。 [#62730](https://github.com/ClickHouse/ClickHouse/pull/62730) ([takakawa](https://github.com/takakawa)).
* 修复实验性且完全不受支持的 MaterializedPostgreSQL 在 adnum 顺序损坏时生成列报错的问题 [#63161](https://github.com/ClickHouse/ClickHouse/issues/63161)。修复该引擎在表含生成列时，ID 列以 nextval 表达式为默认值产生的错误。修复删除名称含 \[a-z1-9-] 之外字符的 publication 时的错误。 [#67664](https://github.com/ClickHouse/ClickHouse/pull/67664) ([Kruglov Kirill](https://github.com/1on)).
* Join 存储支持左表中的 Nullable 列。关闭 [#61247](https://github.com/ClickHouse/ClickHouse/issues/61247)。 [#66926](https://github.com/ClickHouse/ClickHouse/pull/66926) ([vdimir](https://github.com/vdimir)).
* 修复并行副本（及分布式查询）在 `IN` 运算符包含到 Decimal() 转换时返回错误结果的问题，由新分析器引入。 [#67234](https://github.com/ClickHouse/ClickHouse/pull/67234) ([Igor Nikonov](https://github.com/devcrafter)).
* 修复 ALTER MODIFY ORDER BY 导致元数据不一致。 [#67436](https://github.com/ClickHouse/ClickHouse/pull/67436) ([iceFireser](https://github.com/iceFireser)).
* 修复 `fromModifiedJulianDay` 上界，本应为 `9999-12-31`，却误设为 `9999-01-01`。 [#67583](https://github.com/ClickHouse/ClickHouse/pull/67583) ([PHO](https://github.com/depressed-pho)).
* 修复 `IN` 查询中索引不位于元组开头的情况。 [#67626](https://github.com/ClickHouse/ClickHouse/pull/67626) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 修复 `RoleCache` 的过期处理。 [#67748](https://github.com/ClickHouse/ClickHouse/pull/67748) ([Vitaly Baranov](https://github.com/vitlibar)).
* 修复向视图刷新缓慢导致窗口视图丢失数据块的问题。 [#67983](https://github.com/ClickHouse/ClickHouse/pull/67983) ([Raúl Marín](https://github.com/Algunenano)).
* 修复错误日期格式引发的 MSan 问题。 [#68105](https://github.com/ClickHouse/ClickHouse/pull/68105) ([JackyWoo](https://github.com/JackyWoo)).
* 修复 Parquet 文件中类型与请求类型差异很大时过滤崩溃，例如 `... FROM file('a.parquet', Parquet, 'x String')`，但文件中为 `x Int64`。没有此修复时，可用 `input_format_parquet_filter_push_down = 0` 变通。 [#68131](https://github.com/ClickHouse/ClickHouse/pull/68131) ([Michael Kolupaev](https://github.com/al13n321)).
* 修复 [#67091](https://github.com/ClickHouse/ClickHouse/issues/67091) 引入的 `lag`/`lead` 崩溃。 [#68262](https://github.com/ClickHouse/ClickHouse/pull/68262) ([lgbo](https://github.com/lgbo-ustc)).
* 尝试修复取消查询时 PostgreSQL 崩溃。 [#68288](https://github.com/ClickHouse/ClickHouse/pull/68288) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 在 [https://github.com/ClickHouse/ClickHouse/pull/61984](https://github.com/ClickHouse/ClickHouse/pull/61984) 之后，`schema_inference_make_columns_nullable=0` 仍可能使 Parquet/Arrow 列成为 `Nullable`，这是不向后兼容的行为变化。现在恢复 `schema_inference_make_columns_nullable=0` 的旧行为，不推断 Nullable 列；同时新增值 `auto`，仅当数据包含可空性信息时才将列设为 `Nullable`。 [#68298](https://github.com/ClickHouse/ClickHouse/pull/68298) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复 [#50868](https://github.com/ClickHouse/ClickHouse/issues/50868)。分布式查询内嵌套子查询返回的较小 DateTime64 常量值被错误转换为 Null，导致错误及潜在错误结果。 [#68323](https://github.com/ClickHouse/ClickHouse/pull/68323) ([Shankar](https://github.com/shiyer7474)).
* 修复 `SYSTEM SYNC REPLICA` 查询缺少同步副本模式。 [#68326](https://github.com/ClickHouse/ClickHouse/pull/68326) ([Duc Canh Le](https://github.com/canhld94)).
* 修复键条件的缺陷。 [#68354](https://github.com/ClickHouse/ClickHouse/pull/68354) ([Han Fei](https://github.com/hanfei1991)).
* 修复删除或重命名 LDAP 外部用户目录所用角色时的崩溃。 [#68355](https://github.com/ClickHouse/ClickHouse/pull/68355) ([Andrey Zvonov](https://github.com/zvonand)).
* 修复 system.view\_refreshes 的 Progress 列大于 1 [#68377](https://github.com/ClickHouse/ClickHouse/issues/68377)。 [#68378](https://github.com/ClickHouse/ClickHouse/pull/68378) ([megao](https://github.com/jetgm)).
* 正确处理正则表达式标志。 [#68389](https://github.com/ClickHouse/ClickHouse/pull/68389) ([Han Fei](https://github.com/hanfei1991)).
* PostgreSQL 风格转换运算符 `::` 现在也正确适用于 SQL 风格十六进制和二进制字符串字面量，例如 `SELECT x'414243'::String`。关闭 [#68324](https://github.com/ClickHouse/ClickHouse/issues/68324)。 [#68482](https://github.com/ClickHouse/ClickHouse/pull/68482) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 针对 [https://github.com/ClickHouse/ClickHouse/pull/68131](https://github.com/ClickHouse/ClickHouse/pull/68131) 的小补丁。 [#68494](https://github.com/ClickHouse/ClickHouse/pull/68494) ([Chang chen](https://github.com/baibaichen)).
* 修复 [#68239](https://github.com/ClickHouse/ClickHouse/issues/68239)：SAMPLE n 中 n 为整数的情况。 [#68499](https://github.com/ClickHouse/ClickHouse/pull/68499) ([Denis Hananein](https://github.com/denis-hananein)).
* 修复两个分布大小不同时 mann-whitney-utest 的缺陷。 [#68556](https://github.com/ClickHouse/ClickHouse/pull/68556) ([Han Fei](https://github.com/hanfei1991)).
* 修复意外重启后，错误处理被损坏数据片段覆盖的片段导致 ReplicatedMergeTree 无法启动复制的问题。 [#68584](https://github.com/ClickHouse/ClickHouse/pull/68584) ([baolin](https://github.com/baolinhuang)).
* 修复 `sipHash64Keyed`、`sipHash128Keyed` 或 `sipHash128ReferenceKeyed` 处理空数组或元组时的 `LOGICAL_ERROR`。 [#68630](https://github.com/ClickHouse/ClickHouse/pull/68630) ([Robert Schulze](https://github.com/rschu1ze)).
* 全文索引同时索引多列时可能错误过滤列，因为不同列之间未重置 row\_id。复现过程见 tests/queries/0\_stateless/03228\_full\_text\_with\_multi\_col.sql。若无此处理。 [#68644](https://github.com/ClickHouse/ClickHouse/pull/68644) ([siyuan](https://github.com/linkwk7)).
* 修复创建 Replicated 表时 replica\_name 含非法字符 '\t' 和 '\n'，导致 LogEntry 中 'source replica' 解析错误的问题。见 [#68640](https://github.com/ClickHouse/ClickHouse/issues/68640)。 [#68645](https://github.com/ClickHouse/ClickHouse/pull/68645) ([Zhigao Hong](https://github.com/zghong)).
* 为分布式表恢复虚拟列 ` _table` 和 `_database`，它们在 24.3 之前曾可用。 [#68672](https://github.com/ClickHouse/ClickHouse/pull/68672) ([Anton Popov](https://github.com/CurtizJ)).
* 修复 Variant 列置换时可能出现 `Size of permutation (0) is less than required (...)` 错误。 [#68681](https://github.com/ClickHouse/ClickHouse/pull/68681) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复新 JSON 列可能出现 `DB::Exception: Block structure mismatch in joined block stream: different columns:` 错误。 [#68686](https://github.com/ClickHouse/ClickHouse/pull/68686) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复 `sipHash(64/128)Keyed` 对数组键 Map 进行哈希时物化常量键的问题。 [#68731](https://github.com/ClickHouse/ClickHouse/pull/68731) ([Salvatore Mesoraca](https://github.com/aiven-sal)).
* 让 `ColumnsDescription::toString` 使用同一个 `IAST::FormatState object` 格式化每列，使写入磁盘和 ZooKeeper 的列元数据一致。 [#68733](https://github.com/ClickHouse/ClickHouse/pull/68733) ([Miсhael Stetsyuk](https://github.com/mstetsyuk)).
* 修复 grouping sets 聚合数据的合并。 [#68744](https://github.com/ClickHouse/ClickHouse/pull/68744) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复创建复制 MergeTree、修改列后再执行 MODIFY STATISTICS 时的逻辑错误。 [#68820](https://github.com/ClickHouse/ClickHouse/pull/68820) ([Han Fei](https://github.com/hanfei1991)).
* 修复分析器从子查询解析动态子列。 [#68824](https://github.com/ClickHouse/ClickHouse/pull/68824) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复 DeltaLake 复杂类型元数据解析。关闭 [#68739](https://github.com/ClickHouse/ClickHouse/issues/68739)。 [#68836](https://github.com/ClickHouse/ClickHouse/pull/68836) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复异步插入后、刷新入表前，表元数据被 `ALTER ADD/MODIFY COLUMN` 更改的情况。 [#68837](https://github.com/ClickHouse/ClickHouse/pull/68837) ([Anton Popov](https://github.com/CurtizJ)).
* 修复在数组中传入空元组时的意外异常。修复 [#68618](https://github.com/ClickHouse/ClickHouse/issues/68618)。 [#68848](https://github.com/ClickHouse/ClickHouse/pull/68848) ([Amos Bird](https://github.com/amosbird)).
* 修复纯元数据变更命令的解析。 [#68935](https://github.com/ClickHouse/ClickHouse/pull/68935) ([János Benjamin Antal](https://github.com/antaljanosbenjamin)).
* 修复 anyHeavy 状态合并时可能产生的错误结果。 [#68950](https://github.com/ClickHouse/ClickHouse/pull/68950) ([Raúl Marín](https://github.com/Algunenano)).
* 修复启用 `optimize_functions_to_subcolumns` 时写入物化视图。 [#68951](https://github.com/ClickHouse/ClickHouse/pull/68951) ([Anton Popov](https://github.com/CurtizJ)).
* 常量 Dynamic 列方法不使用序列化缓存，避免聚合期间使用未初始化值，甚至产生竞态条件。 [#68953](https://github.com/ClickHouse/ClickHouse/pull/68953) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复 JSON 类型解析期间某些情况下应将 null 插入为默认值时的解析错误。 [#68955](https://github.com/ClickHouse/ClickHouse/pull/68955) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复部分压缩响应未发送 `Content-Encoding`。[#64802](https://github.com/ClickHouse/ClickHouse/issues/64802)。 [#68975](https://github.com/ClickHouse/ClickHouse/pull/68975) ([Konstantin Bogdanov](https://github.com/thevar1able)).
* 通过路径规范化解决路径错误拼接而包含 `//` 的情况。 [#69066](https://github.com/ClickHouse/ClickHouse/pull/69066) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 修复空异步插入时的逻辑错误。 [#69080](https://github.com/ClickHouse/ClickHouse/pull/69080) ([Han Fei](https://github.com/hanfei1991)).
* 修复 clickhouse-client 取消查询期间进度显示的数据竞态。 [#69081](https://github.com/ClickHouse/ClickHouse/pull/69081) ([Sergei Trifonov](https://github.com/serxa)).
* 修复实验性向量相似度索引使用余弦距离时未被利用的缺陷。 [#69090](https://github.com/ClickHouse/ClickHouse/pull/69090) ([flynn](https://github.com/ucasfl)).
* 修复初次创建 Replicated 数据库过程中服务器失败，再次尝试创建时可能报错的问题。 [#69102](https://github.com/ClickHouse/ClickHouse/pull/69102) ([Miсhael Stetsyuk](https://github.com/mstetsyuk)).
* 当 `input_format_csv_try_infer_numbers_from_strings = 1` 时，不从 CSV 字符串推断 Bool，因为不允许从字符串读取布尔值。 [#69109](https://github.com/ClickHouse/ClickHouse/pull/69109) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复启用 `--multiquery` 时，客户端解析 EXPLAIN AST INSERT 查询的错误。 [#69123](https://github.com/ClickHouse/ClickHouse/pull/69123) ([wxybear](https://github.com/wxybear)).
* 修复并行副本查询未正确处理子查询中的 `UNION`，导致 LOGICAL\_ERROR `Duplicate announcement received for replica`。 [#69146](https://github.com/ClickHouse/ClickHouse/pull/69146) ([Igor Nikonov](https://github.com/devcrafter)).
* 修复 s3Cluster 传播结构参数的问题。此前向副本发送查询时可能丢失列的 `DEFAULT` 表达式。 [#69147](https://github.com/ClickHouse/ClickHouse/pull/69147) ([Kruglov Pavel](https://github.com/Avogar)).
* Values 格式将表达式转换为目标类型时遵守格式设置。 [#69149](https://github.com/ClickHouse/ClickHouse/pull/69149) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复只读用户使用 `clickhouse-client --queries-file`，此前会报 `Cannot modify 'log_comment' setting in readonly mode`。 [#69175](https://github.com/ClickHouse/ClickHouse/pull/69175) ([Azat Khuzhin](https://github.com/azat)).
* 修复 clickhouse-client 通过管道连接提前终止的进程时的数据竞态。 [#69186](https://github.com/ClickHouse/ClickHouse/pull/69186) ([vdimir](https://github.com/vdimir)).
* 修复 JSON/Dynamic 类型的 uniq 和 GROUP BY 错误结果。 [#69203](https://github.com/ClickHouse/ClickHouse/pull/69203) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复异步插入的 INFILE 格式检测。若 FORMAT 子句未显式指定格式，可从 INFILE 文件扩展名推断。 [#69237](https://github.com/ClickHouse/ClickHouse/pull/69237) ([Julia Kartseva](https://github.com/jkartseva)).
* 在[此问题](https://github.com/ClickHouse/ClickHouse/pull/59946#issuecomment-1943653197)之后，生产环境中不少表副本的 `metadata_version` 节点值为 `0`，又不同于相应表 `metadata` 节点的版本，导致这些副本的 `alter` 查询失败。 [#69274](https://github.com/ClickHouse/ClickHouse/pull/69274) ([Miсhael Stetsyuk](https://github.com/mstetsyuk)).
* 将 Dynamic 标记为不安全的主键类型，避免 Field 相关问题。 [#69311](https://github.com/ClickHouse/ClickHouse/pull/69311) ([Kruglov Pavel](https://github.com/Avogar)).
* 改进访问控制实体依赖的恢复。 [#69346](https://github.com/ClickHouse/ClickHouse/pull/69346) ([Vitaly Baranov](https://github.com/vitlibar)).
* 修复为插入获取连接时，所有连接尝试均失败所导致的未定义行为。 [#69390](https://github.com/ClickHouse/ClickHouse/pull/69390) ([Pablo Marcos](https://github.com/pamarcos)).
* 关闭 [#69135](https://github.com/ClickHouse/ClickHouse/issues/69135)。如果尝试为 `cross` JOIN 复用已连接数据——尽管当前 ClickHouse 中不会发生——仍最好在 `reuseJoinedData` 中保留 `have_compressed`。 [#69404](https://github.com/ClickHouse/ClickHouse/pull/69404) ([lgbo](https://github.com/lgbo-ustc)).
* `materialize()` 的参数为稀疏列时，返回完整列。 [#69429](https://github.com/ClickHouse/ClickHouse/pull/69429) ([Alexander Gololobov](https://github.com/davenger)).
* 修复函数 `sqidDecode` 的 `LOGICAL_ERROR`（[#69450](https://github.com/ClickHouse/ClickHouse/issues/69450)）。 [#69451](https://github.com/ClickHouse/ClickHouse/pull/69451) ([Robert Schulze](https://github.com/rschu1ze)).
* 快速修复 24.6 的 S3Queue 问题，或 Replicated 数据库中的 CREATE 查询问题。 [#69454](https://github.com/ClickHouse/ClickHouse/pull/69454) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复 `INSERT INTO ... SELECT` 或 `CREATE TABLE AS SELECT` 中数据块合并导致内存占用过高的情况。 [#69469](https://github.com/ClickHouse/ClickHouse/pull/69469) ([Yarik Briukhovetskyi](https://github.com/yariks5s)).
* 表名含点号时，`SHOW COLUMNS` 和 `SHOW INDEX` 现在正确工作。 [#69514](https://github.com/ClickHouse/ClickHouse/pull/69514) ([Salvatore Mesoraca](https://github.com/aiven-sal)).
* 不再允许溢出模式不等于 'throw' 的查询使用查询缓存，避免潜在被截断且不正确的结果存入缓存（问题 [#67476](https://github.com/ClickHouse/ClickHouse/issues/67476)）。 [#69549](https://github.com/ClickHouse/ClickHouse/pull/69549) ([Robert Schulze](https://github.com/rschu1ze)).
* 移动到 PREWHERE 时保留条件原顺序。此前顺序可能变化，在执行顺序重要时导致查询失败。 [#69560](https://github.com/ClickHouse/ClickHouse/pull/69560) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复 ZNOAUTH 错误后 Keeper 多请求的预处理。 [#69627](https://github.com/ClickHouse/ClickHouse/pull/69627) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复 DatabaseReplicated 创建新副本时，带 WHERE 子句的 TTL 可能触发 METADATA\_MISMATCH。 [#69736](https://github.com/ClickHouse/ClickHouse/pull/69736) ([Nikolay Degterinsky](https://github.com/evillique)).
* 修复 `StorageS3(Azure)Queue` 的 `tracked_file_ttl_sec`：写入 Keeper 时使用 `tracked_file_ttl_sec`，读取时却误写为 `tracked_files_ttl_sec`。 [#69742](https://github.com/ClickHouse/ClickHouse/pull/69742) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 在 gethyperrectangleforrowgroup 中使用 tryconvertfieldtotype。 [#69745](https://github.com/ClickHouse/ClickHouse/pull/69745) ([Miсhael Stetsyuk](https://github.com/mstetsyuk)).
* 回退“修复既不含列又无自适应索引粒度的 PREWHERE（几乎什么都没有）”。被回退的变更可能导致读取旧 ClickHouse 版本（推测为 2021 年或更早）生成的数据片段时发生错误。 [#68897](https://github.com/ClickHouse/ClickHouse/pull/68897) ([Alexander Gololobov](https://github.com/davenger)).
