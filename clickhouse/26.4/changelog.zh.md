<h3 id="264">
  ClickHouse 26.4 版本，2026-04-30。[演示文稿](https://presentations.clickhouse.com/2026-release-26.4/)，[视频](https://www.youtube.com/watch?v=9lSVy7k2EoI)
</h3>

<h4 id="264-backward-incompatible-change">
  向后不兼容变更
</h4>

* `IN` 运算符现在对 `Bool` 类型采用精确值语义：集合中只有 `0` 和 `1` 能与 `Bool` 值匹配。此前，将集合中大于 `255` 的数值与 `Bool` 比较时，会错误地将其钳制为 true，因此 `SELECT CAST(1, 'Bool') IN (256)` 会返回 1；现在会正确返回 `0`。关闭 [#92980](https://github.com/ClickHouse/ClickHouse/issues/92980)。[#93115](https://github.com/ClickHouse/ClickHouse/pull/93115)（[Ashrith Bandla](https://github.com/ashrithb)）。
* H3 库已升级到 v4，提升了长度、面积及其他指标计算的精度。由于新结果与此前不同，此项变更向后不兼容。[#100348](https://github.com/ClickHouse/ClickHouse/pull/100348)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 禁止在 `WITH` 表达式列表的元素中将 `SELECT` 用作无引号标识符。[#101059](https://github.com/ClickHouse/ClickHouse/pull/101059)（[Aruj Bansal](https://github.com/arujbansal)）。
* 此补丁更改了 Merge 表处理虚拟列的方式。如果底层表包含 `_table` 或 `_database`，将从存储中读取这些列；否则，会在读取步骤完成后通过表达式步骤填充这些列。[#101742](https://github.com/ClickHouse/ClickHouse/pull/101742)（[Mikhail Artemenko](https://github.com/Michicosun)）。
* `IN` 运算符现在也会拒绝复合类型（`Tuple`、`Array`、`Map`）内部有损精度的 `Decimal` 转换，使其行为与顶层标量比较保持一致。此前仅对顶层标量值执行精度检查：例如，`CAST('33.3', 'Decimal64(1)') IN (33.33)` 会正确返回 `0`，但 `CAST(['33.3'], 'Array(Decimal64(1))') IN ([33.33])` 会错误返回 `1`，因为有损转换发生在 `Array` 内部。现在两种情况都会正确返回 `0`。[#101812](https://github.com/ClickHouse/ClickHouse/pull/101812)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 将 `http_max_fields` 的默认值从 1,000,000 降至 1,000，并将 `http_max_field_name_size` 从 128 KB 降至 4 KB，以限制 HTTP 连接在认证前的内存用量。新增 `http_max_request_header_size` 和 `http_headers_read_timeout` 设置。依赖此前较高限制的用户可通过设置恢复旧值。[#103285](https://github.com/ClickHouse/ClickHouse/pull/103285)（[Sema Checherinda](https://github.com/CheSema)）。

<h4 id="264-new-feature">
  新功能
</h4>

* 为 Hash Join 和 Parallel Hash Join 增加自动溢写能力：达到内存限制时将其转换为 Grace Hash Join。此行为由 `max_bytes_before_external_join` 控制。[#97813](https://github.com/ClickHouse/ClickHouse/pull/97813)（[János Benjamin Antal](https://github.com/antaljanosbenjamin)）。
* 新增 Arrow Flight SQL 支持。[#91170](https://github.com/ClickHouse/ClickHouse/pull/91170)（[Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)）。
* 为 `Paimon` 表引擎增加增量读取支持，通过 Keeper 持久化的快照进度跟踪状态，并可使用 `paimon_target_snapshot_id` 定向读取快照增量；同时扩展类型映射、分区裁剪和增量读取场景的测试覆盖。[#93655](https://github.com/ClickHouse/ClickHouse/pull/93655)（[XiaoBinMu](https://github.com/Binnn-MX)）。
* `stem` 函数现已脱离实验性阶段（此前必须启用 `allow_experimental_nlp_functions` 设置）。[#102399](https://github.com/ClickHouse/ClickHouse/pull/102399)（[Jimmy Aguilar Mena](https://github.com/Ergus)）。现在可以使用 `stem` 函数方便地提取 `String`、`FixedString`、`Array([Fixed]String)`、`Nullable`、`LowCardinality` 和 `Const` 列中所有单词/词元的词干。[#99137](https://github.com/ClickHouse/ClickHouse/pull/99137)（[Jimmy Aguilar Mena](https://github.com/Ergus)）。
* 在兼容性设置 `use_strict_insert_block_limits` 下，为块合并实现 `max_insert_block_size_rows`、`max_insert_block_size_bytes`、`min_insert_block_size_rows`、`min_insert_block_size_bytes` 的新行为。[#94207](https://github.com/ClickHouse/ClickHouse/pull/94207)（[Kirill Kopnev](https://github.com/Fgrtue)）。
* 新增函数 `arrayAutocorrelation(arr [, max_lag])`，计算数值数组在每个滞后量下的归一化自相关。支持整数、浮点数和 Decimal 数组类型。[#94776](https://github.com/ClickHouse/ClickHouse/pull/94776)（[Wenyu Chen](https://github.com/wenyuchen96)）。
* 新增 SQL 函数 `obfuscateQuery`。关闭 [#98010](https://github.com/ClickHouse/ClickHouse/issues/98010)。[#98305](https://github.com/ClickHouse/ClickHouse/pull/98305)（[Xuewei Wang](https://github.com/Sallery-X)）。
* 支持将 Map 和 JSON/Object 类型用作字典属性。现在，FLAT 和 HASHED 布局的字典均可存储和检索复杂类型，包括 Map(String, String)、Map(String, Array(String))、JSON 和 Nullable(JSON)。[#98627](https://github.com/ClickHouse/ClickHouse/pull/98627)（[yanglongwei](https://github.com/ylw510)）。
* 新增两个 MergeTree 设置：`replicated_fetches_min_part_level` 和 `replicated_fetches_min_part_level_timeout_seconds`。副本可借此跳过从对等副本拉取刚插入且尚未合并的数据部件，从而降低大规模摄取期间的复制开销。[#98625](https://github.com/ClickHouse/ClickHouse/pull/98625)（[tanner-bruce](https://github.com/tanner-bruce)）。
* MergeTree 跳数索引现在支持使用 JSONAllPaths 为 JSON 列建立 bloom\_filter、tokenbf\_v1、ngrambf\_v1 和 text（倒排）类型索引，从而依据各数据粒度中存在的 JSON 路径集合跳过粒度。[#98886](https://github.com/ClickHouse/ClickHouse/pull/98886)（[Pavel Kruglov](https://github.com/Avogar)）。
* `printf` 函数现在支持非常量格式字符串，可根据列值为每一行采用不同的格式模式。[#98991](https://github.com/ClickHouse/ClickHouse/pull/98991)（[Yash ](https://github.com/Onyx2406)）。
* 新增投影索引 `commit_order`，按插入顺序重新组织数据。[#99004](https://github.com/ClickHouse/ClickHouse/pull/99004)（[Mikhail Artemenko](https://github.com/Michicosun)）。
* 新增 `highlight` 函数，使用 HTML 标签（默认为 `<em>`/`</em>`）包裹文本字符串中出现的搜索词。支持 ASCII 不区分大小写匹配、自动合并重叠匹配项以及自定义开始/结束标签。[#99131](https://github.com/ClickHouse/ClickHouse/pull/99131)（[Peng](https://github.com/fastio)）。
* 实现按规范化查询哈希实施配额，以保护公共 ClickHouse 服务免遭滥用。1. 支持将 `NORMALIZED_QUERY_HASH` 用作配额键类型：每种独特的规范化查询使用独立配额桶，因此 `CREATE QUOTA q KEYED BY normalized_query_hash` 会分别跟踪每条不同查询。2. 支持将 `QUERIES_PER_NORMALIZED_HASH` 用作配额资源类型：限制时间区间内任一规范化查询的最大执行次数，例如 `MAX queries_per_normalized_hash = 100` 可防止任一查询模式执行超过 100 次。[#99586](https://github.com/ClickHouse/ClickHouse/pull/99586)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 用户现在可以使用 `NATURAL JOIN` 语法编写连接查询；该语法会自动按所有同名列进行匹配，并在结果中对这些列去重。[#99840](https://github.com/ClickHouse/ClickHouse/pull/99840)（[Peter Nguyen](https://github.com/petern48)）。
* 支持将 `SET TIME ZONE 'tz'` 用作 `SET session_timezone` 的别名。[#99883](https://github.com/ClickHouse/ClickHouse/pull/99883)（[phulv94](https://github.com/phulv94)）。
* Web UI（`play.html`）支持参数化查询：检测 `{name:Type}` 等查询参数，并显示用于填写参数值的输入框。[#100041](https://github.com/ClickHouse/ClickHouse/pull/100041)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 支持在 `FROM` 中将 SQL 标准 `VALUES` 子句用作表表达式，例如 `SELECT * FROM (VALUES (1, 'a'), (2, 'b')) AS t(id, val)`。[#100143](https://github.com/ClickHouse/ClickHouse/pull/100143)（[Desel72](https://github.com/Desel72)）。
* 为 `EXTRACT` 运算符增加 PostgreSQL 兼容的单位：`EPOCH`、`DOW`、`DOY`、`ISODOW`、`ISOYEAR`、`WEEK`、`CENTURY`、`DECADE`、`MILLENNIUM`。同时修复此前 `EXTRACT(WEEK FROM date)` 抛出错误的问题。[#100274](https://github.com/ClickHouse/ClickHouse/pull/100274)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 支持带 `TO` 范围限定符的 SQL 标准复合时间间隔字面量，例如 `INTERVAL '1:30' HOUR TO MINUTE`。其内部会拆解为多个时间间隔之和。[#100453](https://github.com/ClickHouse/ClickHouse/pull/100453)（[Desel72](https://github.com/Desel72)）。
* 为 HTTP 连接池套接字的内核 TCP 接收、发送缓冲区内存（`sk_rmem_alloc`、`sk_wmem_alloc`）增加异步指标，按连接组报告 p50/p75/p90/p95 百分位数及总计值。[#100575](https://github.com/ClickHouse/ClickHouse/pull/100575)（[Sema Checherinda](https://github.com/CheSema)）。
* 为 ClickHouse Keeper 增加 jemalloc 分析 Web UI，可通过 HTTP 控制端口上的 `/jemalloc` 访问。[#100606](https://github.com/ClickHouse/ClickHouse/pull/100606)（[murphy-4o](https://github.com/murphy-4o)）。
* 为有序和无序模式实现命令 `SYSTEM FLUSH OBJECT STORAGE QUEUE db.table PATH 'x'`。[#100709](https://github.com/ClickHouse/ClickHouse/pull/100709)（[Bharat Nallan](https://github.com/bharatnc)）。
* 新增函数 `JSONAllValues`，以 `Array(String)` 形式返回 `JSON` 列中的所有值；值会序列化为文本表示，并按路径名称排序。支持为 `JSON` 列上的 `JSONAllValues` 表达式建立文本索引。为 `JSONAllValues(json_column)` 创建文本索引后，过滤 `JSON` 子列的查询（例如 `json_column.key1 = 'value'`）会自动使用该索引。[#100730](https://github.com/ClickHouse/ClickHouse/pull/100730)（[Anton Popov](https://github.com/CurtizJ)）。
* 新增设置 `input_format_column_name_matching_mode`，允许为输入格式选择不同的大小写敏感模式。[#99346](https://github.com/ClickHouse/ClickHouse/pull/99346)（[manerone](https://github.com/Manerone)）。
* 为 `clickhouse-keeper-client` 新增 `watch` 命令，并在 `get`、`exists` 和 `ls` 命令中支持 watch。[#100834](https://github.com/ClickHouse/ClickHouse/pull/100834)（[Den Kalantaevskii](https://github.com/Diskein)）。
* 为 ClickHouse Keeper 新增 `getChildrenRecursive`（ListRecursive）请求，并为 `clickhouse-keeper-client` 新增 `lsr` 命令。关闭 [#99916](https://github.com/ClickHouse/ClickHouse/issues/99916)。[#100998](https://github.com/ClickHouse/ClickHouse/pull/100998)（[Konstantin Vedernikov](https://github.com/scanhex12)）。
* 新增函数 `arrayTranspose`，用于转置二维数组（矩阵）：`SELECT arrayTranspose([[1, 2, 3], [4, 5, 6]])`。[#101214](https://github.com/ClickHouse/ClickHouse/pull/101214)（[Vitaly Baranov](https://github.com/vitlibar)）。
* `auto_statistics_types mergetree` 设置的默认值改为 `'minmax, uniq'`，会为新表中所有适用的列自动创建 minmax 和 uniq 统计信息；`materialize_statistics_on_insert` 默认改为 false，统计信息现在于合并期间而非插入时构建，以降低插入开销。可使用 `SET materialize_statistics_on_insert = 1` 恢复旧行为。[#101275](https://github.com/ClickHouse/ClickHouse/pull/101275)（[Han Fei](https://github.com/hanfei1991)）。
* 为物化视图依赖链新增刷新设置 `prefer_dependency_replica`，减少跨副本复制延迟导致的数据缺失。[#101591](https://github.com/ClickHouse/ClickHouse/pull/101591)（[Seva Potapov](https://github.com/seva-potapov)）。
* 新增用于短语搜索（连续词元序列）的 `hasPhrase` 函数（别名 `matchPhrase`）。搜索采用暴力匹配，暂不受文本索引支持。[#101997](https://github.com/ClickHouse/ClickHouse/pull/101997)（[Elmi Ahmadov](https://github.com/ahmadov)）。
* 新增 `s3_read_request_duration_microseconds` 和 `s3_read_request_bytes` 直方图指标，用于观测 S3 GET 请求的连接生存期和消耗字节数；可在 `system.histogram_metrics` 和 Prometheus 端点中查看。[#102058](https://github.com/ClickHouse/ClickHouse/pull/102058)（[Sema Checherinda](https://github.com/CheSema)）。
* 现在可使用 `+` 运算符将 `Date` 和 `Date32` 值与 `Time` 和 `Time64` 值相加，得到 `DateTime` 或 `DateTime64` 结果。例如，`SELECT toDate('2024-01-15') + toTime('14:30:25')` 返回 `2024-01-15 14:30:25`。结果按会话时区计算，超出范围的结果根据 `date_time_overflow_behavior` 设置处理。关闭 [#95914](https://github.com/ClickHouse/ClickHouse/issues/95914)。[#102421](https://github.com/ClickHouse/ClickHouse/pull/102421)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 文本索引现已正式可用（GA），并且无论 `compatibility` 如何设置都会保持启用，避免在还原备份或兼容模式下运行时意外禁用。[#101518](https://github.com/ClickHouse/ClickHouse/pull/101518)（[Nikita Fomichev](https://github.com/fm4v)）。

<h4 id="264-experimental-feature">
  实验性功能
</h4>

* 为 Iceberg 表新增 `ALTER TABLE ... EXECUTE remove_orphan_files`，用于识别并删除对象存储中未被引用的文件。[#99127](https://github.com/ClickHouse/ClickHouse/pull/99127)（[murphy-4o](https://github.com/murphy-4o)）。
* 新增 `query_plan_optimize_join_order_randomize` 设置，使连接重排序所用的统计信息随机化，便于测试。[#100643](https://github.com/ClickHouse/ClickHouse/pull/100643)（[Vladimir Cherkasov](https://github.com/vdimir)）。
* ClickHouse 新增 AI 函数支持，用户可通过 SQL 调用 OpenAI 和 Anthropic 端点；首个函数为 `aiGenerate`。[#100831](https://github.com/ClickHouse/ClickHouse/pull/100831)（[George Larionov](https://github.com/george-larionov)）。
* 新增 AI 函数 `aiClassify`、`aiExtract` 和 `aiTranslate`，用于在 ClickHouse 中调用 LLM API。[#100832](https://github.com/ClickHouse/ClickHouse/pull/100832)（[George Larionov](https://github.com/george-larionov)）。
* 新增系统表 `system.histogram_metric_log`，定期生成所有直方图指标的快照（例如 S3/Azure 延迟、Keeper 请求各处理阶段的耗时）。此外，`system.histogram_metrics` 的 `value` 列改为 `Float64`，以获得更高灵活性并兼容 Prometheus 数据模型。[#103046](https://github.com/ClickHouse/ClickHouse/pull/103046)（[Miсhael Stetsyuk](https://github.com/mstetsyuk)）。该表结构在后续版本中可能发生变化。

<h4 id="264-performance-improvement">
  性能改进
</h4>

* ClickHouse 现在可在 SELECT 查询中依据 min/max 统计信息裁剪整个数据部件。[#94140](https://github.com/ClickHouse/ClickHouse/pull/94140)（[zoomxi](https://github.com/zoomxi)）。
* 减少 ReplicatedMergeTree 表在已完成变更操作上的只读操作锁竞争。[#95771](https://github.com/ClickHouse/ClickHouse/pull/95771)（[Eduard Karacharov](https://github.com/korowa)）。
* 读取投影时遵循 `optimize_read_in_order`。关闭 [#89453](https://github.com/ClickHouse/ClickHouse/issues/89453)。[#95885](https://github.com/ClickHouse/ClickHouse/pull/95885)（[Andrey Zvonov](https://github.com/zvonand)）。
* 对 Hash Join 和 Concurrent Hash Join 进行一组小幅改进。[#96663](https://github.com/ClickHouse/ClickHouse/pull/96663)（[Yarik Briukhovetskyi](https://github.com/yariks5s)）。
* 输入数据几乎全不相同时，禁用 `LowCardinality` 列优化，以优化 `DISTINCT` 转换。[#97113](https://github.com/ClickHouse/ClickHouse/pull/97113)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 优化 [#97723](https://github.com/ClickHouse/ClickHouse/issues/97723) 中 `LIKE` 查询的性能；这些查询现在可以使用文本索引。[#98149](https://github.com/ClickHouse/ClickHouse/pull/98149)（[Elmi Ahmadov](https://github.com/ahmadov)）。
* 向量化数学函数（`exp`、`log`、`sigmoid`、`tanh`）现在可在 AArch64（使用 NEON/SVE）以及 FreeBSD/Darwin 上加速；此前这些平台会回退到较慢的标量实现。[#98230](https://github.com/ClickHouse/ClickHouse/pull/98230)（[Raúl Marín](https://github.com/Algunenano)）。
* 当正则表达式的字面字符串分支具有共同前缀时，过滤 `MergeTree` 主键列的查询（例如 `^(abc-1|abc-2)`）现在可以使用主键裁剪。[#98988](https://github.com/ClickHouse/ClickHouse/pull/98988)（[Yash ](https://github.com/Onyx2406)）。
* 扩展 `ORDER BY ... LIMIT` 的 Top-K 动态过滤，使其支持 `Nullable`、`String` 和 `COLLATE` 类型。[#99033](https://github.com/ClickHouse/ClickHouse/pull/99033)（[murphy-4o](https://github.com/murphy-4o)）。
* 对范围较小的 `Int32` 和 `Int64` 键使用直接索引哈希表，以加速哈希连接。[#99275](https://github.com/ClickHouse/ClickHouse/pull/99275)（[Hechem Selmi](https://github.com/m-selmi)）。
* 加速仅含单一字典的 `LowCardinality` 列上的非连续查询。[#99285](https://github.com/ClickHouse/ClickHouse/pull/99285)（[Ivan Babrou](https://github.com/bobrik)）。
* 通过消除内层循环的虚调用，加速 `Float64` 列上的 `var*Stable` 和 `stddev*Stable` 函数。注意：这会启用编译器优化（FMA/寄存器），可能在 ULP 级别改变浮点结果。[#99460](https://github.com/ClickHouse/ClickHouse/pull/99460)（[Riyane El Qoqui](https://github.com/riyaneel)）。
* 对 32/64 字节输入使用优化后的 Firedancer base58 编码（`base58Encode` 自动采用）；若解码结果为 32/64 字节，也允许使用优化后的 base58 解码（需通过 `base58Decode('...', 32)` 等形式显式指定）。[#99461](https://github.com/ClickHouse/ClickHouse/pull/99461)（[Joanna Hulboj](https://github.com/jh0x)）。
* 启用基于链接器节的优化（`-ffunction-sections`、`-fdata-sections`、`--icf=all`），以减小二进制体积并提高指令缓存利用率。[#99474](https://github.com/ClickHouse/ClickHouse/pull/99474)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复多核机器上带聚合的短查询出现负向扩展的问题。查询只读取少量 mark 时，流水线不再于聚合后扩展至 `max_threads`，从而避免大部分数据流为空产生的开销。[#99493](https://github.com/ClickHouse/ClickHouse/pull/99493)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 通过正确选择读取任务大小，提升使用并行副本的查询性能。[#99801](https://github.com/ClickHouse/ClickHouse/pull/99801)（[Nikita Taranov](https://github.com/nickitat)）。
* 允许通过用户态页缓存读取远程文件时进行预取。[#99919](https://github.com/ClickHouse/ClickHouse/pull/99919)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 枚举子列时避免不必要地计算 String 的 `.size` 子列。[#99941](https://github.com/ClickHouse/ClickHouse/pull/99941)（[Pavel Kruglov](https://github.com/Avogar)）。
* 使用包含大量副本的集群时，降低 clickhouse-client 进度条的抖动。[#100145](https://github.com/ClickHouse/ClickHouse/pull/100145)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 启用页缓存时在 `clickhouse-local` 中启动 `MemoryWorker`，从而真正使用用户态页缓存。[#100306](https://github.com/ClickHouse/ClickHouse/pull/100306)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 将 `LIMIT` 子句下推到 `UNION ALL` 中以优化查询。[#100364](https://github.com/ClickHouse/ClickHouse/pull/100364)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 为 `ORDER BY` 中 `String` 和 `FixedString` 列的比较增加 JIT 编译支持，使字符串型排序键的合并阶段排序性能提高 6–17%。与 @lgbo-ustc 共同完成。[#100577](https://github.com/ClickHouse/ClickHouse/pull/100577)（[Raúl Marín](https://github.com/Algunenano)）。
* 同时启用 `read_in_order_use_virtual_row` 和新设置 `read_in_order_use_virtual_row_per_block` 时，每次从 `MergeTree` 读取一个块后都会发出虚拟行边界信息。对于数据被 `WHERE`/`PREWHERE`/`JOIN` 完全过滤的数据部件，合并过程可据此在数据流处理中途调整数据源优先级。关闭 [#99945](https://github.com/ClickHouse/ClickHouse/issues/99945)。[#100603](https://github.com/ClickHouse/ClickHouse/pull/100603)（[Vladimir Cherkasov](https://github.com/vdimir)）。
* 扩展 `itoa` 快速路径并采用与 dragonbox 兼容的舍入方式，加速较大整数值的 Float 到 String 转换。[#100649](https://github.com/ClickHouse/ClickHouse/pull/100649)（[Raúl Marín](https://github.com/Algunenano)）。
* 以 `zmij` 取代 `dragonbox`，使 Float 到 String 转换提速 1.5–3 倍。[#100650](https://github.com/ClickHouse/ClickHouse/pull/100650)（[Raúl Marín](https://github.com/Algunenano)）。
* 以 Barrett 约减取代软件除法并展开转换循环，加速 `Int128`/`UInt128` 到字符串的转换。[#100671](https://github.com/ClickHouse/ClickHouse/pull/100671)（[Raúl Marín](https://github.com/Algunenano)）。
* 避免在 `uniqExact` 并行合并中创建多余线程。[#100686](https://github.com/ClickHouse/ClickHouse/pull/100686)（[Jiebin Sun](https://github.com/jiebinn)）。
* 为 `uniqExact` 增加批量并行合并。[#100687](https://github.com/ClickHouse/ClickHouse/pull/100687)（[Jiebin Sun](https://github.com/jiebinn)）。
* 改善使用并行副本执行、底层为 `MergeTree` 表的简单视图查询的并行度。[#100815](https://github.com/ClickHouse/ClickHouse/pull/100815)（[Igor Nikonov](https://github.com/devcrafter)）。
* 当 `parallel_replicas_allow_view_over_mergetree=1` 时，支持通过并行副本查询简单视图，包括底层为 `MergeTree` 表且符合条件的 `UNION ALL` 视图。这样可以并行执行视图外层查询而不是内层查询，增强查询在节点间的并行度。[#100958](https://github.com/ClickHouse/ClickHouse/pull/100958)（[Igor Nikonov](https://github.com/devcrafter)）。
* 查询计划中存在 `IN` 过滤条件时，优化 `full_sorting_merge` 按主键顺序读取数据的过程。[#101261](https://github.com/ClickHouse/ClickHouse/pull/101261)（[Nikita Taranov](https://github.com/nickitat)）。
* 缓存采样设置，避免遍历整个内存跟踪器层级，从而优化内存分配与释放。[#101267](https://github.com/ClickHouse/ClickHouse/pull/101267)（[Azat Khuzhin](https://github.com/azat)）。
* 修复 `deduplicate_insert = 'enable'`（自 26.2 起默认启用）时严重的 INSERT 性能回退：将数据哈希计算从块合并阶段推迟到 sink，并通过 `updateHashWithValueRange` 批量计算列哈希。对于 22 列的 500 万行数据，开销从约 2.5 秒降至约 0.5 秒。[#101494](https://github.com/ClickHouse/ClickHouse/pull/101494)（[Sema Checherinda](https://github.com/CheSema)）。
* 使用 `try_lock` 避免对无竞争的加锁操作计时，并移除持锁时间测量，以降低锁分析开销。[#101502](https://github.com/ClickHouse/ClickHouse/pull/101502)（[Antonio Andelic](https://github.com/antonio2368)）。
* 将 `arrayDotProduct` 中手写的 AVX-512 intrinsic 替换为与平台无关、可自动向量化的循环，并增加 AVX2 和 ARM NEON 支持。[#101571](https://github.com/ClickHouse/ClickHouse/pull/101571)（[Peng](https://github.com/fastio)）。
* 当 `Map`、`Array` 和 `Tuple` 列的值以转义字符串（例如 `'{\'key\':1}'`）传入时，提高 `INSERT VALUES` 的性能，避免不必要地回退到 SQL 表达式解析器。[#102119](https://github.com/ClickHouse/ClickHouse/pull/102119)（[Joanna Hulboj](https://github.com/jh0x)）。
* 修复 `RabbitMQ` 表引擎 CPU 占用过高的问题。[#102711](https://github.com/ClickHouse/ClickHouse/pull/102711)（[Jaap Elst](https://github.com/jaapieaapie1)）。
* JOIN 顺序优化器现在会根据现有连接条件推断传递性等值连接谓词。例如，给定 `A.x = B.x AND B.x = C.x` 时会识别出等价关系 `A.x = C.x`，使优化器能够考虑传递连接表之间的直接连接。这可改善星型和雪花型 Schema 的计划质量，因为维度表通常通过共享事实表连接。此功能由新设置 `enable_join_transitive_predicates` 控制，默认关闭。[#98479](https://github.com/ClickHouse/ClickHouse/pull/98479)（[Alexander Gololobov](https://github.com/davenger)）。
* 预先并行取消合并，以优化 `TRUNCATE DATABASE TABLES LIKE`。[#98597](https://github.com/ClickHouse/ClickHouse/pull/98597)（[Shaohua Wang](https://github.com/tiandiwonder)）。
* 为乘法增加单调性支持，使 `key * constant` 表达式能够使用主键裁剪。[#98983](https://github.com/ClickHouse/ClickHouse/pull/98983)（[Amos Bird](https://github.com/amosbird)）。
* 缓存字典在 `hasKeys` 中不再获取排他锁；缓存读取改用共享锁，以减少锁竞争。[#100796](https://github.com/ClickHouse/ClickHouse/pull/100796)（[liuguangliang](https://github.com/sourcelliu)）。
* 在查询树中内联 VIEW 子查询，使更多优化能够应用于 VIEW。[#100830](https://github.com/ClickHouse/ClickHouse/pull/100830)（[Dmitry Novik](https://github.com/novikd)）。
* 优化服务器启动时的缓存加载。[#101500](https://github.com/ClickHouse/ClickHouse/pull/101500)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 对带 FINAL 的 ReplacingMergeTree，在谓词选择性足够高时实现列的延迟物化。[#101647](https://github.com/ClickHouse/ClickHouse/pull/101647)（[Nikolai Kochetov](https://github.com/KochetovNicolai)）。
* 重新启用 `optimize_rewrite_array_exists_to_has` 优化（自 23.10 起默认关闭）。该优化将 `arrayExists(x -> x = elem, arr)` 改写为快得多的 `has(arr, elem)`；现在，当数组元素类型与 `elem` 不兼容于 `has`（例如 `Date` 与 `String`）时会正确跳过改写，因此此前会被破坏的查询仍能工作。关闭 [#71431](https://github.com/ClickHouse/ClickHouse/issues/71431)。[#100944](https://github.com/ClickHouse/ClickHouse/pull/100944)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。

<h4 id="264-improvement">
  改进
</h4>

* 改进 `EXPLAIN PLAN pretty=1` 的输出：打印顶层查询输出列；用关系标签/符号展示连接，并标注估算结果行数和执行位置；同时显示连接/数据源步骤各自的输出列。这些变更涵盖 [#98117](https://github.com/ClickHouse/ClickHouse/issues/98117) 中的 Information Deficit 部分。[#99462](https://github.com/ClickHouse/ClickHouse/pull/99462)（[Kirill Kopnev](https://github.com/Fgrtue)）。
* 新增 MergeTree 表设置 `share_nested_offsets`（默认值为 `true`）。设为 `false` 时，名称中带点的 Array 列（例如 `n.a`、`n.b`）会被视为相互独立的列，不再按照旧式 `Nested` 语义共享 offset 文件并校验数组长度相等。[#98416](https://github.com/ClickHouse/ClickHouse/pull/98416)（[Amos Bird](https://github.com/amosbird)）。
* 用户现在可以在 users.xml/yaml 配置中指定多种认证方式（SQL 中一直支持）。[#91998](https://github.com/ClickHouse/ClickHouse/pull/91998)（[Flip-Liquid](https://github.com/Flip-Liquid)）。
* 自动重新加载使用 TLS 的 Raft 节点间连接。[#93455](https://github.com/ClickHouse/ClickHouse/pull/93455)（[Evgeny](https://github.com/evkuzin)）。
* 扩展 `cast_keep_nullable`，使其支持 Dynamic/JSON 类型。启用后，从可为 Nullable 的类型转换 NULL 会返回 NULL；否则会抛出 `CANNOT_INSERT_NULL_IN_ORDINARY_COLUMN` 错误。[#96504](https://github.com/ClickHouse/ClickHouse/pull/96504)（[Seva Potapov](https://github.com/seva-potapov)）。
* 引入对象池，降低内部数据结构（`ISerialization` 对象）的内存占用。[#96563](https://github.com/ClickHouse/ClickHouse/pull/96563)（[Nikita Mikhaylov](https://github.com/nikitamikhaylov)）。
* keeper-client XML 配置支持 `password` 和 `identity` 字段。[#96800](https://github.com/ClickHouse/ClickHouse/pull/96800)（[Grigorii Sokolik](https://github.com/GSokol)）。
* 改进通过 Unity Catalog 写入 `Iceberg` 的能力。[#98162](https://github.com/ClickHouse/ClickHouse/pull/98162)（[Konstantin Vedernikov](https://github.com/scanhex12)）。
* 新增设置 `finalize_projection_parts_synchronously`，允许在 INSERT 期间同步完成投影数据部件的最终处理，以降低包含大量投影的表的峰值内存用量；默认仍保留现有异步行为。[#98228](https://github.com/ClickHouse/ClickHouse/pull/98228)（[Amos Bird](https://github.com/amosbird)）。
* 为 `system.part_log` 新增 `projections_duration_ms` 列，以毫秒为单位记录各投影的合并/重建耗时。[#98292](https://github.com/ClickHouse/ClickHouse/pull/98292)（[Amos Bird](https://github.com/amosbird)）。
* 改进通过 clickhouse-client 中的 `KILL QUERY` 和取消查询（Ctrl+C）来取消使用 ExpressionTransform 和 NumbersRangedSource 的查询。[#98908](https://github.com/ClickHouse/ClickHouse/pull/98908)（[Roman Vasin](https://github.com/rvasin)）。
* 将硬编码的 `source_table_engines` 列表替换为通过 `StorageFactory::getAllStorages()` 进行的运行时查找。这为一些此前遗漏的表引擎增加了访问检查，并关闭 [#71544](https://github.com/ClickHouse/ClickHouse/issues/71544)。[#98984](https://github.com/ClickHouse/ClickHouse/pull/98984)（[pufit](https://github.com/pufit)）。
* 新增设置，用于控制 Variant 和 Dynamic 类型不匹配时的行为（抛出异常或返回 null）。[#99085](https://github.com/ClickHouse/ClickHouse/pull/99085)（[Bharat Nallan](https://github.com/bharatnc)）。
* 改进 `Iceberg` 与 Spark 的兼容性：修复混用存储路径和元数据路径造成的不一致路径处理；强制 `Iceberg` 表写入的表位置必须是 URL 或绝对路径；由于部分 ClickHouse 读取器遍历后不支持字节计数，为 `Azure` 增加文件大小计数的回退方案；以兼容 Spark 的方式处理 `version-hint.txt`；引入类型级抽象，降低今后混淆路径类型的风险；增加 `Azure` 和 `Local` 测试，验证无需中间上传/下载的跨引擎互操作性；修复位置删除的使用方式，此前在不适合的场景依赖路径推断启发式规则。[#99163](https://github.com/ClickHouse/ClickHouse/pull/99163)（[Daniil Ivanik](https://github.com/divanik)）。[#100420](https://github.com/ClickHouse/ClickHouse/pull/100420)（[Daniil Ivanik](https://github.com/divanik)）。
* 修复 [https://github.com/ClickHouse/ClickHouse/pull/92844](https://github.com/ClickHouse/ClickHouse/pull/92844) 引入的 `IPartitionStrategy::cached_result` 潜在竞态条件。[#99400](https://github.com/ClickHouse/ClickHouse/pull/99400)（[Arthur Passos](https://github.com/arthurpassos)）。
* 用户现在可以在 Arrow 格式中写入 ClickHouse Interval 数据类型。[#99519](https://github.com/ClickHouse/ClickHouse/pull/99519)（[Peter Nguyen](https://github.com/petern48)）。
* 原生支持在 `Arrow` 和 `Parquet` 格式中导入、导出 `UUID` 数据类型。用户现在可以直接在 ClickHouse 与其他数据工具之间查询和传输 UUID 数据，无需手动转换为字符串或使用变通方案。支持自动推断顶层 UUID 的逻辑类型，并可通过显式 Schema 提示支持嵌套 UUID。[#99521](https://github.com/ClickHouse/ClickHouse/pull/99521)（[Ivan](https://github.com/ivanmantova)）。
* 对象存储支持 `7z` 压缩包。关闭 [#70968](https://github.com/ClickHouse/ClickHouse/issues/70968)。[#99600](https://github.com/ClickHouse/ClickHouse/pull/99600)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 新增 `ObjectStorageListedObjects`、`ObjectStorageGlobFilteredObjects`、`ObjectStoragePredicateFilteredObjects` 和 `ObjectStorageReadObjects` ProfileEvents，用于观测对象存储（`S3`、`Azure` 等）的文件列举与读取流水线。[#99778](https://github.com/ClickHouse/ClickHouse/pull/99778)（[Sema Checherinda](https://github.com/CheSema)）。
* 修复查询并非存在于所有底层分布式/远程表中的列时，`merge` 表函数因 `UNKNOWN_IDENTIFIER` 错误而失败的问题。[#99833](https://github.com/ClickHouse/ClickHouse/pull/99833)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* ReplicatedMergeTree 的变更操作总执行时间指标现在包含提交耗时；该部分在 [#96376](https://github.com/ClickHouse/ClickHouse/issues/96376) 后丢失。[#99936](https://github.com/ClickHouse/ClickHouse/pull/99936)（[alesapin](https://github.com/alesapin)）。
* 为 `MetadataStorageFromDisk` 中等待删除的 Blob 对象增加预写日志，在删除对象时提升元数据与远程对象存储之间的持久性和一致性。[#100019](https://github.com/ClickHouse/ClickHouse/pull/100019)（[Maksim Kita](https://github.com/kitaisreal)）。
* 在嵌入式客户端（SSH 和 WebSocket 协议）中禁用 AI SQL 生成（`??` 命令），防止访问服务器环境变量。[#100290](https://github.com/ClickHouse/ClickHouse/pull/100290)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 更改通过 Catalog 向 Iceberg 插入数据的接口。弃用 `storage_catalog_type`、`storage_aws_access_key_id` 等设置。[#100334](https://github.com/ClickHouse/ClickHouse/pull/100334)（[Konstantin Vedernikov](https://github.com/scanhex12)）。
* 粘贴到 clickhouse-client 时，将制表符渲染为 4 个空格。关闭 [#100405](https://github.com/ClickHouse/ClickHouse/issues/100405)。[#100416](https://github.com/ClickHouse/ClickHouse/pull/100416)（[Raúl Marín](https://github.com/Algunenano)）。
* 当 `show_data_lake_catalogs_in_system_tables` 被禁用时，避免为了生成“Maybe you meant …”表名提示而扫描整个远程数据湖 Catalog。[#100452](https://github.com/ClickHouse/ClickHouse/pull/100452)（[Alsu Giliazova](https://github.com/alsugiliazova)）。
* 在分区裁剪之后应用 `distributed_index_analysis_min_indexes_bytes_to_activate`。[#100477](https://github.com/ClickHouse/ClickHouse/pull/100477)（[Azat Khuzhin](https://github.com/azat)）。
* 修复使用空的 IN/NOT IN 子句时，Parquet Bloom Filter 下推发生断言失败的问题。[#100543](https://github.com/ClickHouse/ClickHouse/pull/100543)（[zoomxi](https://github.com/zoomxi)）。
* MinMax 列统计信息现在以 Field（带类型）而非 Float64 存储最小值和最大值。序列化格式会同时记录列类型名称。统计文件版本提升至 V2；旧版本写入的文件需要重新物化（`ALTER TABLE … MATERIALIZE STATISTICS ALL`）。修复 [#53140](https://github.com/ClickHouse/clickhouse-private/issues/53140)。[#100605](https://github.com/ClickHouse/ClickHouse/pull/100605)（[Han Fei](https://github.com/hanfei1991)）。
* 更新 `cppkafka`，纳入 Consumer 关闭时死锁问题的修复。[#100612](https://github.com/ClickHouse/ClickHouse/pull/100612)（[Azat Khuzhin](https://github.com/azat)）。
* 用于解析 Iceberg 数据文件的对象信息现在包含从 Manifest 文件解析得到的文件行数和字节大小。[#100645](https://github.com/ClickHouse/ClickHouse/pull/100645)（[Daniil Ivanik](https://github.com/divanik)）。
* 新增 `use_separate_cache_arena` 配置参数，用于控制是否分离缓存内存 Arena。[#100664](https://github.com/ClickHouse/ClickHouse/pull/100664)（[Seva Potapov](https://github.com/seva-potapov)）。
* 原生支持将 Apache Arrow 的 `StringView` 和 `BinaryView` 数据类型导入 ClickHouse `String` 列，改善基于 Arrow 的数据摄取兼容性。[#100762](https://github.com/ClickHouse/ClickHouse/pull/100762)（[Ivan](https://github.com/ivanmantova)）。
* 运行时配置文件发生变化时，以下 Keeper 服务器设置现在支持热重载：max\_requests\_batch\_size、max\_requests\_batch\_bytes\_size、max\_request\_size、quorum\_reads。[#100773](https://github.com/ClickHouse/ClickHouse/pull/100773)（[Michael Kolupaev](https://github.com/al13n321)）。
* 在 Release 构建中递增性能分析事件 `MemoryAllocatedWithoutCheck/MemoryAllocatedWithoutCheckBytes`。[#100899](https://github.com/ClickHouse/ClickHouse/pull/100899)（[Pavel Kruglov](https://github.com/Avogar)）。
* Cgroupv2 内存跟踪现在会从内核内存中排除 `slab_reclaimable`，从而更准确地衡量不可回收内存用量。[#100901](https://github.com/ClickHouse/ClickHouse/pull/100901)（[Antonio Andelic](https://github.com/antonio2368)）。
* 除禁用基于分区键的裁剪外，`use_partition_pruning = 0` 现在也会禁用 `MinMax` 索引裁剪以及分区键列上的计数优化。[#100904](https://github.com/ClickHouse/ClickHouse/pull/100904)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* `EXPLAIN [PLAN]` 中的 `pretty=1` 现在会以便于阅读的格式打印表达式。[#100927](https://github.com/ClickHouse/ClickHouse/pull/100927)（[Kirill Kopnev](https://github.com/Fgrtue)）。
* `accurateCastOrNull` 和 `accurateCastOrDefault` 现在支持 `Tuple` 目标类型，包括元素为 `Nullable` 的嵌套 `Tuple`。此前这些函数会拒绝 `Tuple` 目标，因为 `Tuple` 不能位于 `Nullable` 内。关闭 [#100820](https://github.com/ClickHouse/ClickHouse/issues/100820)。[#100942](https://github.com/ClickHouse/ClickHouse/pull/100942)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 修复 Play UI 在浅色与深色主题间切换时图表重复的问题。[#101058](https://github.com/ClickHouse/ClickHouse/pull/101058)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 将 chdig 更新至 [v26.3.1](https://github.com/azat/chdig/releases/tag/v26.3.1)（Perfetto UI；为 CPU/内存/合并/查询摘要增加迷你趋势图；支持 system.warnings；支持在日志中进行正则搜索）。[#101092](https://github.com/ClickHouse/ClickHouse/pull/101092)（[Azat Khuzhin](https://github.com/azat)）。将 chdig 更新至 [v26.4.3](https://github.com/azat/chdig/releases/tag/v26.4.3)（改进 Perfetto；修复通过 pastila.nl 分享的问题；支持火焰图差异对比；支持实时更改设置）。[#103145](https://github.com/ClickHouse/ClickHouse/pull/103145)（[Azat Khuzhin](https://github.com/azat)）。
* `WITH` 子句末尾、`SELECT` 查询之前现在可以带有尾随逗号。[#101093](https://github.com/ClickHouse/ClickHouse/pull/101093)（[Aruj Bansal](https://github.com/arujbansal)）。
* 新增 MergeTree 设置 `compress_per_column_in_compact_parts`，控制 Compact 数据部件中压缩块的组织方式。设为 `true` 时（默认值，保持当前行为），每列从新的压缩块开始，可选择性解压；设为 `false` 时，一个 Granule 内的所有列会打包进同一压缩块，对总是读取所有列的工作负载可提升压缩率和读取性能。[#101114](https://github.com/ClickHouse/ClickHouse/pull/101114)（[Amos Bird](https://github.com/amosbird)）。
* Play UI 现在仅在鼠标悬停于表名时显示表信息浮窗，而非悬停整行时显示。[#101118](https://github.com/ClickHouse/ClickHouse/pull/101118)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 在 Play UI 侧边栏中增加引擎专属图标，并改进表列表的用户体验。[#101134](https://github.com/ClickHouse/ClickHouse/pull/101134)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* `Arrow`、`ArrowStream`、`ORC` 和旧版 `Parquet` 格式支持 `Nullable(Tuple)`。[#101272](https://github.com/ClickHouse/ClickHouse/pull/101272)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 在 Web UI（play.html）中将 TOTALS 行显示为表格页脚。[#101286](https://github.com/ClickHouse/ClickHouse/pull/101286)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* Web UI（`play.html`）支持多查询模式：可一次运行多条查询，其中类 `SELECT` 查询并行执行，并分别显示每条查询的结果。[#101290](https://github.com/ClickHouse/ClickHouse/pull/101290)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 play.html Web UI 将结果表重构为 Web Component 后无法调整列宽的问题。[#101295](https://github.com/ClickHouse/ClickHouse/pull/101295)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 新增能力，可限制每个时间区间内因 MEMORY\_LIMIT\_EXCEEDED 触发的 jemalloc Profile 刷新次数。[#101396](https://github.com/ClickHouse/ClickHouse/pull/101396)（[Azat Khuzhin](https://github.com/azat)）。
* 新增 Keeper 设置 `nuraft_streaming_mode`（默认为 `false`）、`nuraft_max_log_gap_in_stream` 和 `nuraft_max_bytes_in_flight_in_stream`。关闭 [#90743](https://github.com/ClickHouse/ClickHouse/issues/90743)。[#101427](https://github.com/ClickHouse/ClickHouse/pull/101427)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 新增异步指标 `CGroupMemoryUsedWithoutPageCache`，报告同时排除内核 OS 页缓存和 ClickHouse 用户态页缓存后的 cgroup 内存用量，与 `MemoryResidentWithoutPageCache` 对应；同时明确了 `CGroupMemoryUsed` 指标的说明。[#101513](https://github.com/ClickHouse/ClickHouse/pull/101513)（[Francesco Ciocchetti](https://github.com/primeroz)）。
* 为 SQL 标准的 `OVERLAY` 函数语法增加解析器级语法糖。`overlay` 函数此前已经存在；本次增加以 `PLACING`、`FROM` 和 `FOR` 作为分隔关键字的写法。[#101681](https://github.com/ClickHouse/ClickHouse/pull/101681)（[Desel72](https://github.com/Desel72)）。
* 为系统表 `information_schema.tables` 新增列别名 `INDEX_LENGTH`，与该表已有的大写别名保持一致。[#101705](https://github.com/ClickHouse/ClickHouse/pull/101705)（[Robert Schulze](https://github.com/rschu1ze)）。
* 系统表 `information_schema.tables` 现在会忽略非活动数据部件，使显示的表大小数值更符合实际。[#101706](https://github.com/ClickHouse/ClickHouse/pull/101706)（[Robert Schulze](https://github.com/rschu1ze)）。
* `ngrams` 函数现在会拒绝无效的 ngram 长度。例如，`SELECT ngrams('abc', 0)` 现在会返回错误。[#101922](https://github.com/ClickHouse/ClickHouse/pull/101922)（[Robert Schulze](https://github.com/rschu1ze)）。
* 作为 [#91820](https://github.com/ClickHouse/ClickHouse/issues/91820) 和 [#90837](https://github.com/ClickHouse/ClickHouse/issues/90837) 的后续工作：从错误消息中过滤不支持的算法；在 FIPS 构建中运行 FIPS 专项测试。[#102067](https://github.com/ClickHouse/ClickHouse/pull/102067)（[Mikhail f. Shiryaev](https://github.com/Felixoid)）。
* 将 Web UI（`play.html`）单元格高度限制为三行，点击后可展开。[#102154](https://github.com/ClickHouse/ClickHouse/pull/102154)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 新增选项，可强制 S3 端点使用虚拟主机式或路径式寻址。解决 [#82019](https://github.com/ClickHouse/ClickHouse/issues/82019) 和 [#76007](https://github.com/ClickHouse/ClickHouse/issues/76007)，是 [https://github.com/ClickHouse/ClickHouse/pull/83168](https://github.com/ClickHouse/ClickHouse/pull/83168) 的后续工作。[#102378](https://github.com/ClickHouse/ClickHouse/pull/102378)（[Konstantin Vedernikov](https://github.com/scanhex12)）。
* `restore_replace_external_engines_to_null` 设置现在也会跳过恢复使用外部引擎的数据库（例如 `DataLakeCatalog`、`MySQL`、`PostgreSQL`、`S3`），而不是恢复失败或发起外部连接。[#102400](https://github.com/ClickHouse/ClickHouse/pull/102400)（[Nikita Fomichev](https://github.com/fm4v)）。
* 通过 `HINT` 模式为 `hasPhrase` 函数增加文本索引分析支持。[#102438](https://github.com/ClickHouse/ClickHouse/pull/102438)（[Elmi Ahmadov](https://github.com/ahmadov)）。
* 在 ColumnDependency 中将 STATISTICS 视为只读，以修复执行 MATERIALIZE STATISTICS ALL 时的 LOGICAL\_ERROR。[#102627](https://github.com/ClickHouse/ClickHouse/pull/102627)（[Konstantin Bogdanov](https://github.com/thevar1able)）。
* 在 Keeper-as-server 模式下创建并填充 `system.asynchronous_metric_log`。[#102664](https://github.com/ClickHouse/ClickHouse/pull/102664)（[Miсhael Stetsyuk](https://github.com/mstetsyuk)）。
* 新增配置选项 `default_system_log_flush_policy.skip_alias_columns`，允许系统日志表省略 ALIAS 列，从而修复由 S3 承载且不接受 ALIAS 列的系统日志。[#102669](https://github.com/ClickHouse/ClickHouse/pull/102669)（[Miсhael Stetsyuk](https://github.com/mstetsyuk)）。
* 不再为系统表启用自动统计信息，因为它们极少有机会使用这些信息。[#102862](https://github.com/ClickHouse/ClickHouse/pull/102862)（[Han Fei](https://github.com/hanfei1991)）。
* LIKE 优化支持 `array` 分词器。[#102880](https://github.com/ClickHouse/ClickHouse/pull/102880)（[Elmi Ahmadov](https://github.com/ahmadov)）。
* 即使在 Release 构建中也发送 MemoryAllocatedWithoutCheck。[#103064](https://github.com/ClickHouse/ClickHouse/pull/103064)（[Azat Khuzhin](https://github.com/azat)）。
* 在 system.stack\_trace 中公开每个线程的 untracked\_memory。[#103065](https://github.com/ClickHouse/ClickHouse/pull/103065)（[Azat Khuzhin](https://github.com/azat)）。

<h4 id="264-bug-fix-user-visible-misbehavior-in-an-official-stable-release">
  Bug 修复（正式稳定版本中用户可见的异常行为）
</h4>

* 修复延迟物化返回不必要列而引发 `Block structure mismatch in stream` 错误的问题。修复 [#95191](https://github.com/ClickHouse/ClickHouse/issues/95191)。[#96682](https://github.com/ClickHouse/ClickHouse/pull/96682)（[Nikolai Kochetov](https://github.com/KochetovNicolai)）。
* 修复带有 `ON CLUSTER` 的数据脱敏策略查询发生逻辑错误的问题。[#97594](https://github.com/ClickHouse/ClickHouse/pull/97594)（[Bharat Nallan](https://github.com/bharatnc)）。
* 修复在 GCS 之上使用 Unity Catalog 时的错误。[#98456](https://github.com/ClickHouse/ClickHouse/pull/98456)（[Melvyn Peignon](https://github.com/melvynator)）。
* `DataLakeCatalog` 在验证 `auth_header` 设置时，现在会遵循服务器的 `http_forbid_headers` 配置。[#98827](https://github.com/ClickHouse/ClickHouse/pull/98827)（[Michael Anastasakis](https://github.com/michael-anastasakis)）。
* 修复 S3 大括号展开 Glob 产生 N+1 次 `HeadObject` 调用的问题。[#99219](https://github.com/ClickHouse/ClickHouse/pull/99219)（[Konstantin Bogdanov](https://github.com/thevar1able)）。
* 当引擎本身也支持设置时，在创建查询中验证设置变更。[#99279](https://github.com/ClickHouse/ClickHouse/pull/99279)（[János Benjamin Antal](https://github.com/antaljanosbenjamin)）。
* 修复表中存在表达式依赖 EPHEMERAL 列的 MATERIALIZED 列时，`ALTER TABLE UPDATE/DELETE` 因 `Missing columns` 错误而失败的问题。[#99281](https://github.com/ClickHouse/ClickHouse/pull/99281)（[Yash ](https://github.com/Onyx2406)）。
* JDBC、ODBC 和 NATS 连接字符串中的凭证现在会在查询日志和 `SHOW CREATE` 输出中脱敏，防止敏感信息意外泄露。对于 URI 风格的连接字符串（例如 `{scheme}://{user}:{password}@{host}`），仅密码部分会被遮盖，其余内容保持可见以便调试。`nats_token` 设置现在也会被脱敏。[#99344](https://github.com/ClickHouse/ClickHouse/pull/99344)（[János Benjamin Antal](https://github.com/antaljanosbenjamin)）。
* 修复 parseDateTimeBestEffort 错误解析 DD-month-YYYY 格式中以月份前缀开头的单词。关闭 [#99345](https://github.com/ClickHouse/ClickHouse/issues/99345#event-23517658314)。[#99350](https://github.com/ClickHouse/ClickHouse/pull/99350)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复在未使用 Analyzer 时忽略 TABLE\_UUID\_MISMATCH 的问题。[#99380](https://github.com/ClickHouse/ClickHouse/pull/99380)（[Azat Khuzhin](https://github.com/azat)）。
* 修复同一请求中将显式设置与 `compatibility` 一并发送时，若显式值恰好等于服务器默认值便可能被静默忽略的问题。[#99402](https://github.com/ClickHouse/ClickHouse/pull/99402)（[Raufs Dunamalijevs](https://github.com/rienath)）。
* 修复 Hive 分区路径中的数字带前导零时引发错误的问题。修复 [#98801](https://github.com/ClickHouse/ClickHouse/issues/98801)。[#99458](https://github.com/ClickHouse/ClickHouse/pull/99458)（[Yarik Briukhovetskyi](https://github.com/yariks5s)）。
* 修复删除表与正在运行的读取查询并发发生时的堆释放后使用问题（过去 90 天内在 CI 中出现 19 次）。[#99483](https://github.com/ClickHouse/ClickHouse/pull/99483)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 Keeper 中的一个问题：若同一服务器上另一个无关会话恰好在特定时刻关闭，读取请求可能卡住并导致会话超时。[#99484](https://github.com/ClickHouse/ClickHouse/pull/99484)（[Michael Kolupaev](https://github.com/al13n321)）。
* 应用 Patch 之前先验证列结构。[#99531](https://github.com/ClickHouse/ClickHouse/pull/99531)（[Seva Potapov](https://github.com/seva-potapov)）。
* 修复合并包含 `Dynamic` 列的表时快速切换 `SYSTEM STOP/START MERGES` 导致垂直合并 `rows_sources` 断言失败的问题。[#99532](https://github.com/ClickHouse/ClickHouse/pull/99532)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 `toWeek()` 分区裁剪错误：在按 `toYYYYMM(date)` 分区的表上，带 `WHERE toWeek(date, mode) = N` 的查询会在第 49–52 周返回空结果。[#99542](https://github.com/ClickHouse/ClickHouse/pull/99542)（[Takumi Hara](https://github.com/takumihara)）。
* 修复对 JOIN 产生、包含未引用行的 ColumnReplicated 执行函数时发生异常的问题。[#99564](https://github.com/ClickHouse/ClickHouse/pull/99564)（[Hechem Selmi](https://github.com/m-selmi)）。
* 修复 `CLEAR COLUMN` 不重建投影、也不重新计算依赖被清除列的物化列的问题；该问题可能导致后续合并发生异常或数据损坏。[#99565](https://github.com/ClickHouse/ClickHouse/pull/99565)（[Desel72](https://github.com/Desel72)）。
* 修复 `ConditionSelectivityEstimator` 中的异常（`Bad get: has Tuple, actual type String`）：当查询在启用了列统计信息和 `use_statistics` 的表上，以单个标量查询参数使用 IN（例如 `WHERE col IN ({p:String})`）时会触发此问题。[#99614](https://github.com/ClickHouse/ClickHouse/pull/99614)（[Ilya Yatsishin](https://github.com/qoega)）。
* 不应将包含未知投影的数据部件永久标记为丢失。[#99623](https://github.com/ClickHouse/ClickHouse/pull/99623)（[Sema Checherinda](https://github.com/CheSema)）。
* 修复并发执行 `SYSTEM STOP MERGES` 与 `SYSTEM START MERGES` 时，垂直合并过程中偶发的逻辑错误异常。[#99628](https://github.com/ClickHouse/ClickHouse/pull/99628)（[Desel72](https://github.com/Desel72)）。
* 修复 injectRequiredColumns 中的悬空引用导致合并期间崩溃的问题。[#99679](https://github.com/ClickHouse/ClickHouse/pull/99679)（[Tuan Pham Anh](https://github.com/tuanpach)）。
* 修复 Avro 格式读取器读取超出目标列类型范围的数值时存在的未定义行为。现在查询会在溢出时失败，而不再静默产生错误值。[#99697](https://github.com/ClickHouse/ClickHouse/pull/99697)（[asyablue22](https://github.com/asyablue22)）。
* 修复 `executable` 表函数参数中 Shell 风格引号的解析。[#99794](https://github.com/ClickHouse/ClickHouse/pull/99794)（[Nikita Semenov](https://github.com/leftmain)）。
* 修复 `NativeReader` 反序列化行数不匹配的 Native 格式流时产生的误判中止：将错误从 `LOGICAL_ERROR` 改为 `INCORRECT_DATA`，使其作为数据错误处理，而不会在 Sanitizer/Debug 构建中触发 `abort()`。[#99822](https://github.com/ClickHouse/ClickHouse/pull/99822)（[Rahul Nair](https://github.com/motsc)）。
* 修复二进制流中的序列化类型为 `DETACHED` 时，反序列化 `Tuple` 列导致进程中止的问题。[#99823](https://github.com/ClickHouse/ClickHouse/pull/99823)（[Rahul Nair](https://github.com/motsc)）。
* 修复因 SLRU 子队列提升过程中的竞态条件，在动态调整文件系统缓存大小时误抛 `LOGICAL_ERROR` 的问题。[#99850](https://github.com/ClickHouse/ClickHouse/pull/99850)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复异步插入查询在 `query_log` 和客户端输出中将 `written_rows`、`read_rows` 与 `result_rows` 报告为零的问题。[#99879](https://github.com/ClickHouse/ClickHouse/pull/99879)（[Sema Checherinda](https://github.com/CheSema)）。
* 修复 `KILL QUERY` 内部针对系统表的查询返回由 `ColumnConst` 包装的列时产生“Bad cast from type X to Y”异常的问题。[#99881](https://github.com/ClickHouse/ClickHouse/pull/99881)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 untuple 参数内相关子查询的逻辑错误。[#99917](https://github.com/ClickHouse/ClickHouse/pull/99917)（[Vladimir Cherkasov](https://github.com/vdimir)）。
* 修复以 INT64\_MIN（-9223372036854775808）作为长度参数调用 `right`、`rightUTF8` 或其他子串函数时发生异常的问题。此前整数溢出会导致未定义行为；现在函数会正确报告 ARGUMENT\_OUT\_OF\_BOUND 错误。[#99934](https://github.com/ClickHouse/ClickHouse/pull/99934)（[Jimmy Aguilar Mena](https://github.com/Ergus)）。
* ClickHouse 现在能够正确处理 Spark 风格的表，即每个文件采用完整绝对路径或相对于公共表路径的相对路径。修复 [#92348](https://github.com/ClickHouse/ClickHouse/issues/92348)。[#99935](https://github.com/ClickHouse/ClickHouse/pull/99935)（[alesapin](https://github.com/alesapin)）。
* 修复 `ALTER TABLE ... MODIFY QUERY` 的“Inconsistent AST formatting”异常：当嵌套子查询带有 `SETTINGS`，且 `ALTER` 本身也带有 `SETTINGS` 时会触发该问题。[#99938](https://github.com/ClickHouse/ClickHouse/pull/99938)（[Nikita Mikhaylov](https://github.com/nikitamikhaylov)）。
* 因疑似存在性能回退，撤销 [#97114](https://github.com/ClickHouse/ClickHouse/issues/97114)“在检查只有一个子节点之前执行 Join 步骤行数估算”。[#99957](https://github.com/ClickHouse/ClickHouse/pull/99957)（[Alexander Gololobov](https://github.com/davenger)）。
* 修复 HEAD 请求响应缺少 `Content-Length` 标头时 ClickHouse 可能跳过文件的问题（例如 GCS 执行解压转码时）。[#99971](https://github.com/ClickHouse/ClickHouse/pull/99971)（[Yarik Briukhovetskyi](https://github.com/yariks5s)）。
* 修复 `NumericIndexedVector` 聚合状态乘以偶数常量时的断言失败（Debug 构建抛出异常，Release 构建产生错误结果）；原因是 `pointwiseAddInplace` 中对别名 Roaring Bitmap 进行了自身异或。[#99976](https://github.com/ClickHouse/ClickHouse/pull/99976)（[Desel72](https://github.com/Desel72)）。
* 防止旧版过滤条件下推穿过连续的 `JOIN USING` 时，连接转换后键类型发生变化而抛出 `Unexpected return type` 异常。[#99999](https://github.com/ClickHouse/ClickHouse/pull/99999)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复在尚未解析的表函数参数中使用标量子查询时出现 `LOGICAL_ERROR` 异常“Unexpected node type for table expression ... Actual IDENTIFIER”，例如 `SELECT * FROM remote('localhost', view(SELECT 2 AS x), concat(x, (SELECT 1)))`。[#100014](https://github.com/ClickHouse/ClickHouse/pull/100014)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 `INSERT ... VALUES` 数据下一行带有尾随 SQL 注释（`--` 或 `/* */`）时失败的问题。现在会跳过注释，而不会将其解析为另一行数据。[#100016](https://github.com/ClickHouse/ClickHouse/pull/100016)（[Pratima Patel](https://github.com/pratimapatel2008)）。
* 修复 `arrayRemove` 比较含 NULL 元素的 Tuple 时发生异常的问题。[#100017](https://github.com/ClickHouse/ClickHouse/pull/100017)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 `system.asynchronous_inserts` 的跨用户数据泄露：任何拥有该表 `SELECT` 权限的用户都能看到其他用户待处理的异步插入。现在除非用户拥有 `SHOW_USERS` 权限，否则会按当前用户过滤记录。[#100024](https://github.com/ClickHouse/ClickHouse/pull/100024)（[Shaohua Wang](https://github.com/tiandiwonder)）。
* 修复将 Time64 转换为 UInt64 时，值可能被钳制为 24 小时的问题。[#100025](https://github.com/ClickHouse/ClickHouse/pull/100025)（[Yarik Briukhovetskyi](https://github.com/yariks5s)）。
* 修复 CREATE DICTIONARY 定义中的列表值包含不存在的函数时，本地服务器崩溃的问题。[#100036](https://github.com/ClickHouse/ClickHouse/pull/100036)（[Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)）。
* 修复 `CSV`、`MsgPack` 格式无法正确解析 `Nullable(Tuple)` 的问题。关闭 [#99753](https://github.com/ClickHouse/ClickHouse/issues/99753)。[#100038](https://github.com/ClickHouse/ClickHouse/pull/100038)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 修复将 WITH 函数表达式别名（例如 `tuple(...)`）用作 `IN` 右侧时，`CREATE VIEW` 因 `UNKNOWN_IDENTIFIER` 而失败的问题。[#100042](https://github.com/ClickHouse/ClickHouse/pull/100042)（[Peng](https://github.com/fastio)）。
* 修复在并行副本下配合 `initializeAggregation` 或 `AggregatingMergeTree` 使用时间序列聚合函数（例如 `timeSeriesResampleToGridWithStaleness`）时因 `ILLEGAL_TYPE_OF_ARGUMENT` 而失败的问题。[#100053](https://github.com/ClickHouse/ClickHouse/pull/100053)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 使 NumericIndexedVectorDataBSI 能正确处理负值。[#100086](https://github.com/ClickHouse/ClickHouse/pull/100086)（[Daniil Ivanik](https://github.com/divanik)）。
* 修复 `accurateCastOrDefault` 和 `to*OrDefault` 对常量输入未保留 Const 列类型的问题。[#100132](https://github.com/ClickHouse/ClickHouse/pull/100132)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 省略的 `LowCardinality(Nullable(T))` 类型查询参数现在会像 `Nullable(T)` 一样正确地默认为 NULL。[#100144](https://github.com/ClickHouse/ClickHouse/pull/100144)（[Denys Melnyk](https://github.com/germiBest)）。
* 修复 StringSearcher.h 中使用未初始化值的问题。[#100225](https://github.com/ClickHouse/ClickHouse/pull/100225)（[Konstantin Bogdanov](https://github.com/thevar1able)）。
* 允许通过 Ctrl+C 取消标量子查询和其他分析阶段流水线。此前，长时间运行的标量子查询完成前 Ctrl+C 不会生效。同时修复进度条和 JSON 统计，使 `clickhouse-client` 与 `clickhouse-local` 都能正确报告标量子查询执行期间读取的行数。与 @YjyJeff 共同完成。[#100230](https://github.com/ClickHouse/ClickHouse/pull/100230)（[Raúl Marín](https://github.com/Algunenano)）。
* 修复涉及 `Dynamic` 列、Cross Join 和运行时过滤器的查询发生 `LOGICAL_ERROR` 异常的问题；原因是 `ColumnVariant::filter` 在 `hasOnlyNulls` 优化路径中共享 Variant 列指针而非克隆。关闭 [https://github.com/ClickHouse/ClickHouse/pull/100147](https://github.com/ClickHouse/ClickHouse/pull/100147)。[#100234](https://github.com/ClickHouse/ClickHouse/pull/100234)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复 Variant 数组调用 `arrayFirst`/`arrayLast` 时可能重新解释数据类型的问题。例如底层实际 Variant 类型为 `Date` 时，`Array(Variant(Date, Bool))` 此前会被转换为 `Bool`。[#100255](https://github.com/ClickHouse/ClickHouse/pull/100255)（[timothygk](https://github.com/timothygk)）。
* 对函数进行若干小幅调整：H3 函数改进边界验证；readWKB 检查大小限制（新增设置 `max_wkb_geometry_elements`）；随机数生成函数限制计算的最大迭代次数。这是 [#93543](https://github.com/ClickHouse/ClickHouse/issues/93543) 的后续工作。[#100270](https://github.com/ClickHouse/ClickHouse/pull/100270)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 cutURLParameter 在目标参数作为其他参数的子串出现时可能错误跳过该参数的问题。[#100280](https://github.com/ClickHouse/ClickHouse/pull/100280)（[Nikita Semenov](https://github.com/leftmain)）。
* 修复 Iceberg 元数据文件路径设置包含空字节时发生异常的问题。[#100283](https://github.com/ClickHouse/ClickHouse/pull/100283)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复对包含 `IN` 子查询的谓词使用 `distributed_index_analysis` 时，所运行查询数量呈平方级增长的问题。[#100287](https://github.com/ClickHouse/ClickHouse/pull/100287)（[Anton Popov](https://github.com/CurtizJ)）。
* 修复将 `GROUP BY ... WITH TOTALS HAVING` 与 `UNION DISTINCT`、Nullable 表达式组合使用时的“Block structure mismatch”异常。[#100293](https://github.com/ClickHouse/ClickHouse/pull/100293)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 `block_size_bytes` 参数极大时 `estimateCompressionRatio` 抛出 LOGICAL\_ERROR 的问题。[#100298](https://github.com/ClickHouse/ClickHouse/pull/100298)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 Debug 构建中使用 `GROUP BY CUBE(...) WITH ROLLUP` 或类似组合时的“Inconsistent AST formatting”异常。[#100376](https://github.com/ClickHouse/ClickHouse/pull/100376)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复以列别名及 `SELECT *` 或 `EXCEPT`/`INTERSECT` 查询创建视图时发生异常的问题。[#100386](https://github.com/ClickHouse/ClickHouse/pull/100386)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 Kafka 引擎消费者在心跳错误后卡在重新平衡状态时，`DROP TABLE` 无限期挂起的问题。[#100388](https://github.com/ClickHouse/ClickHouse/pull/100388)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复使用 ZIP 压缩包执行备份/恢复操作时的 `ReadBuffer is canceled. Can't read from it.` 异常。[#100400](https://github.com/ClickHouse/ClickHouse/pull/100400)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复数据分散在多个 Granule 边界未对齐的数据部件中时，带 `max_rows_to_read` / `force_primary_key` 的 `SELECT count()` 查询抛出 `TOO_MANY_ROWS` 异常的问题。[#100408](https://github.com/ClickHouse/ClickHouse/pull/100408)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 `system.completions`，使其在按表、按数据库授权及按列撤销等所有授权组合下都能依照访问权限正确过滤数据库、表和列。[#100432](https://github.com/ClickHouse/ClickHouse/pull/100432)（[Shaohua Wang](https://github.com/tiandiwonder)）。
* 修复竞态条件导致 NuRaft 段错误的问题。[#100444](https://github.com/ClickHouse/ClickHouse/pull/100444)（[Pablo Marcos](https://github.com/pamarcos)）。
* `min`/`max`/`argMin`/`argMax` 现在对 NaN 的处理与 `ORDER BY` 一致：始终跳过 NaN（仅当全部值均为 NaN 时才返回 NaN）。此前由于 IEEE 754 无序比较语义，结果会取决于 NaN 在数据中的位置。[#100448](https://github.com/ClickHouse/ClickHouse/pull/100448)（[Raúl Marín](https://github.com/Algunenano)）。
* 修复复制粘贴错误：单独设置 `delta_lake_snapshot_end_version` 而未设置 `delta_lake_snapshot_start_version` 时，此前会被静默忽略，而非产生 `BAD_ARGUMENTS` 错误。[#100454](https://github.com/ClickHouse/ClickHouse/pull/100454)（[Mohammad Lareb Zafar](https://github.com/zlareb1)）。
* `StorageRabbitMQ::shutdown` 并非幂等（它无条件访问弱指针，随后销毁相应共享指针），但现在会被调用两次：先在 `StreamingStorageRegistry`，再在 `DatabaseCatalog`。本修复使该方法幂等，并增加防御性空值检查。[#100455](https://github.com/ClickHouse/ClickHouse/pull/100455)（[Miсhael Stetsyuk](https://github.com/mstetsyuk)）。
* 修复以 `QBit` 为目标类型使用 `accurateCastOrNull` 时的 `LOGICAL_ERROR` 异常。[#100470](https://github.com/ClickHouse/ClickHouse/pull/100470)（[Raufs Dunamalijevs](https://github.com/rienath)）。
* 修复在 `optimize_on_insert=0` 时向 Wide 数据部件中含嵌套 `Array(JSON)` 列的表插入数据时出现 LOGICAL\_ERROR“Stream ... not found”的问题。[#100475](https://github.com/ClickHouse/ClickHouse/pull/100475)（[Pavel Kruglov](https://github.com/Avogar)）。
* 在 `RESTORE` 期间验证备份元数据中的文件条目路径，拒绝路径遍历、绝对路径和空名称。[#100483](https://github.com/ClickHouse/ClickHouse/pull/100483)（[Pablo Marcos](https://github.com/pamarcos)）。
* 修复 `LIMIT m OFFSET n WITH TIES` 语法失效的问题。该语法等价于此前已可用的 `LIMIT n, m WITH TIES`。[#100491](https://github.com/ClickHouse/ClickHouse/pull/100491)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 修复对含命名字段和 `LowCardinality` 元素的 `Nullable(Tuple)` 列使用 `IN` 时出现“No set is registered for key”异常的问题。[#100523](https://github.com/ClickHouse/ClickHouse/pull/100523)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 usearch `sorted_buffer_gt::insert()` 中的堆缓冲区溢出，该问题可能在向量相似度搜索期间导致崩溃或静默破坏内存。[#100537](https://github.com/ClickHouse/ClickHouse/pull/100537)（[Dustin Healy](https://github.com/dustinhealy)）。
* 修复 `EXECUTE AS` 忽略查询中指定的 `FORMAT` 和 `INTO OUTFILE` 子句的问题。[#100538](https://github.com/ClickHouse/ClickHouse/pull/100538)（[pufit](https://github.com/pufit)）。
* 修复带查询级 OFFSET 的 SAMPLE 的 AST 格式不一致问题。关闭 [#100576](https://github.com/ClickHouse/ClickHouse/issues/100576)。[#100579](https://github.com/ClickHouse/ClickHouse/pull/100579)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复 Azure 上的 Polaris Catalog。自 25.12 起，该组合会在路径开头增加 Bucket，例如生成 `abfss://polaris-polaris@<some_url>.windows.net/polaris-polaris/<other-path>`，而不是 `abfss://polaris-polaris@<some_url>.windows.net/<other-path>`。本次修复会从路径中移除 Bucket。[#100583](https://github.com/ClickHouse/ClickHouse/pull/100583)（[Konstantin Vedernikov](https://github.com/scanhex12)）。
* 修复某些数据块中的默认列为 Const 时，Transform 发生类型不匹配异常的问题。关闭 [#100574](https://github.com/ClickHouse/ClickHouse/issues/100574)。[#100616](https://github.com/ClickHouse/ClickHouse/pull/100616)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复投影 SELECT 部分包含原查询 SELECT 部分不存在的列时出现 NOT\_FOUND\_COLUMN\_IN\_BLOCK 的问题。关闭 [#100194](https://github.com/ClickHouse/ClickHouse/issues/100194)。[#100623](https://github.com/ClickHouse/ClickHouse/pull/100623)（[Yarik Briukhovetskyi](https://github.com/yariks5s)）。
* 根据文件大小和溢出限制验证 Npy 格式的 Shape 维度，防止构造具有异常大维度的 `.npy` 文件造成拒绝服务；同时拒绝空 Shape，并将每行内存限制为 2 GiB。[#100625](https://github.com/ClickHouse/ClickHouse/pull/100625)（[Raúl Marín](https://github.com/Algunenano)）。
* 修复异步插入（TCP）以及所有 HTTP 插入在解析 `DateTime` 值时忽略 `session_timezone` 的问题。[#100647](https://github.com/ClickHouse/ClickHouse/pull/100647)（[Sema Checherinda](https://github.com/CheSema)）。
* 使用表函数作为数据源时，允许向 `cluster()` 和 `clusterAllReplicas()` 表函数传入分片键（例如 `cluster('name', view(...), sharding_key)`）。[#100665](https://github.com/ClickHouse/ClickHouse/pull/100665)（[Sergey Veletskiy](https://github.com/velom)）。
* 修复将参数化聚合函数与 Array 组合器及 NULL 参数一起使用时服务器崩溃（断言失败）的问题，例如 `quantileIfArrayArray(0.5)([[NULL]], [[1]])`。[#100679](https://github.com/ClickHouse/ClickHouse/pull/100679)（[nerve-bot](https://github.com/nerve-bot)）。
* 修复启用 `use_variant_as_common_type` 时，计算空 Tuple 与非空 Tuple 的公共父类型发生异常的问题。[#100699](https://github.com/ClickHouse/ClickHouse/pull/100699)（[Antonio Andelic](https://github.com/antonio2368)）。
* 配置 Azure Blob Storage 磁盘但端点暂时不可达（例如 DNS 故障）时，服务器不再启动失败。[#100701](https://github.com/ClickHouse/ClickHouse/pull/100701)（[Raúl Marín](https://github.com/Algunenano)）。
* 修复无符号除数无法容纳于有符号结果类型时，`positiveModulo` 中的未定义行为。[#100705](https://github.com/ClickHouse/ClickHouse/pull/100705)（[Raúl Marín](https://github.com/Algunenano)）。
* 修复启用 `use_top_k_dynamic_filtering` 且 `ORDER BY` 列为 `Dynamic` 或 `Variant` 类型时服务器崩溃（逻辑错误“Unexpected return type from \_\_topKFilter”）的问题。[#100742](https://github.com/ClickHouse/ClickHouse/pull/100742)（[Groene AI](https://github.com/groeneai)）。
* 修复对包含 LowCardinality 元素的 Tuple 键在 PREWHERE/WHERE 中使用 `has()` 函数时服务器崩溃的问题。[#100760](https://github.com/ClickHouse/ClickHouse/pull/100760)（[Groene AI](https://github.com/groeneai)）。
* 修复并发写入期间读取 S3 对象存储上的 `Log` 或 `StripeLog` 表时发生 `file_offset_of_buffer_end <= getFileSize()` 断言失败（Debug 构建抛出异常）的问题。[#100763](https://github.com/ClickHouse/ClickHouse/pull/100763)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复启用统计信息的表上，WHERE 子句包含函数表达式（例如 `toDecimal64(col, 3)`）时统计选择性估算器发生异常的问题。估算器现在会跳过此类谓词，而不再尝试无效类型转换。[#100764](https://github.com/ClickHouse/ClickHouse/pull/100764)（[Han Fei](https://github.com/hanfei1991)）。
* 修复重排 Join 时极少数情况下可能产生错误结果的问题。[#100790](https://github.com/ClickHouse/ClickHouse/pull/100790)（[Yarik Briukhovetskyi](https://github.com/yariks5s)）。
* 修复优化后的简单计数中 `AggregateFunction` 参数类型错误，导致查询分布式表上的 `count(v0 + v1)` 等表达式时出现 `NUMBER_OF_ARGUMENTS_DOESNT_MATCH` 异常的问题。[#100794](https://github.com/ClickHouse/ClickHouse/pull/100794)（[YjyJeff](https://github.com/YjyJeff)）。
* 防止某些 Catalog 在 `select * from system.databases` 查询结果的 `SETTINGS` 部分暴露机密信息。[#100800](https://github.com/ClickHouse/ClickHouse/pull/100800)（[Konstantin Vedernikov](https://github.com/scanhex12)）。
* 修复 `toStartOfInterval` 使用 Week、Quarter 或 Year 间隔并带有 Origin 参数及极端间隔值时的未定义行为（有符号整数溢出）。[#100817](https://github.com/ClickHouse/ClickHouse/pull/100817)（[Raúl Marín](https://github.com/Algunenano)）。
* 修复引入 `Nullable(Tuple)` 后，返回类型为 `Tuple` 且包含一个或多个 `Nullable` 参数的 `If`、`Distinct`、`DistinctIf`、`IfState ` 聚合函数组合器无法读取旧版序列化状态的问题。关闭 [#98917](https://github.com/ClickHouse/ClickHouse/issues/98917)。[#100826](https://github.com/ClickHouse/ClickHouse/pull/100826)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 修复连接池释放后使用导致 s3Cluster 和分布式查询发生段错误的问题。[#100837](https://github.com/ClickHouse/ClickHouse/pull/100837)（[Konstantin Bogdanov](https://github.com/thevar1able)）。
* 修复服务器关闭期间加载字典时因解引用空指针而发生段错误的问题。字典线程会调用 `Context::getUserDefinedSQLObjectsStorage`（解引用 `user_defined_sql_objects_storage`），同时主线程调用 `Context::shutdown`（将其设为 null）。现在会先禁止字典加载器后续更新、终止正在运行的字典查询并等待字典加载线程结束，然后才运行 `Context::shutdown`，与普通查询的处理方式一致。[#100839](https://github.com/ClickHouse/ClickHouse/pull/100839)（[Miсhael Stetsyuk](https://github.com/mstetsyuk)）。
* 修复 `ULIDStringToDateTime` 输入包含非 ASCII 字节时的缓冲区溢出。[#100843](https://github.com/ClickHouse/ClickHouse/pull/100843)（[Konstantin Bogdanov](https://github.com/thevar1able)）。
* 修复启用 `distributed_group_by_no_merge=1` 时，查询封装多个表（其中含 `Distributed` 表）的 `Merge` 表或 `merge()` 表函数发生崩溃（`LOGICAL_ERROR`）的问题。[#100859](https://github.com/ClickHouse/ClickHouse/pull/100859)（[Groene AI](https://github.com/groeneai)）。
* 启用 cast\_keep\_nullable 后，将 Dynamic null 转换为 Variant 不再抛出异常。[#100864](https://github.com/ClickHouse/ClickHouse/pull/100864)（[Seva Potapov](https://github.com/seva-potapov)）。
* 修复 `clickhouse-keeper-client` 的 `get`、`exists` 和 `ls` 命令将重复的 `watch_id` 错误消息输出至 stdout 而非 stderr 的问题。[#100893](https://github.com/ClickHouse/ClickHouse/pull/100893)（[Mohammad Lareb Zafar](https://github.com/zlareb1)）。
* 修复对 Nullable Tuple 数组执行 `intDiv`/`intDivOrZero` 时发生异常的问题，例如 `SELECT intDiv([divide((1, 2), ... AND NULL)], 2)`。[#100895](https://github.com/ClickHouse/ClickHouse/pull/100895)（[Raúl Marín](https://github.com/Algunenano)）。
* 在保存 `StorageAlias` 定义之前求值引擎参数，使 `currentDatabase()` 等表达式在保存到数据库之前解析为字面量。[#100902](https://github.com/ClickHouse/ClickHouse/pull/100902)（[Nikolay Degterinsky](https://github.com/evillique)）。
* 修复 `query_plan_merge_expressions = 0` 且 `ExpressionStep` 直接位于 `ReadFromMergeTree` 上方时的 `processAndOptimizeTextIndexFunctions`。修复 [#100879](https://github.com/ClickHouse/ClickHouse/issues/100879)。[#100909](https://github.com/ClickHouse/ClickHouse/pull/100909)（[Jimmy Aguilar Mena](https://github.com/Ergus)）。
* 更新 replxx，纳入 do\_complete\_line 越界访问问题的修复。[#100925](https://github.com/ClickHouse/ClickHouse/pull/100925)（[Azat Khuzhin](https://github.com/azat)）。
* 修复使用按主键分片优化的 JOIN 在启用查询条件缓存，且部分数据部件被缓存条件过滤时产生错误结果的问题。[#100926](https://github.com/ClickHouse/ClickHouse/pull/100926)（[Groene AI](https://github.com/groeneai)）。
* 修复在某些情况下对索引分析期间的过滤表达式使用 `divide` 和 `intDiv` 会返回 `ILLEGAL_DIVISION` 的问题。[#100928](https://github.com/ClickHouse/ClickHouse/pull/100928)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 修复异步启动期间带内部表的物化视图出现“Target table doesn't exist”错误的问题；其原因是错误的启动依赖顺序。[#100946](https://github.com/ClickHouse/ClickHouse/pull/100946)（[Nikolay Degterinsky](https://github.com/evillique)）。
* 修复 parseDateTimeBestEffort 解析含 18 位以上小数秒的日期时间字符串时的未定义行为（有符号整数溢出）。[#100948](https://github.com/ClickHouse/ClickHouse/pull/100948)（[Vasily Chekalkin](https://github.com/bacek)）。
* 修复将文本搜索索引用于含 Tuple 子查询的 `IN` 子句时发生崩溃的问题，例如 `WHERE (id, str) IN (SELECT (id, str) FROM ...)`；子查询列数与 `IN` 左侧 Tuple 不匹配时也会触发该问题。[#100959](https://github.com/ClickHouse/ClickHouse/pull/100959)（[Anton Popov](https://github.com/CurtizJ)）。
* 修复从采用稀疏列序列化的 `MergeTree` 表构建多边形字典时发生崩溃的问题。[#100964](https://github.com/ClickHouse/ClickHouse/pull/100964)（[Anton Popov](https://github.com/CurtizJ)）。
* 修复对常量折叠表达式使用 `INTERSECT ALL` / `UNION ALL` 时的逻辑错误“Invalid action query tree node”。[#100977](https://github.com/ClickHouse/ClickHouse/pull/100977)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复引入 `Nullable(Tuple)` 后，带一个或多个 `Nullable` 参数的 `sumCountOrDefault` 聚合函数无法读取旧版序列化状态的问题。关闭 [#100882](https://github.com/ClickHouse/ClickHouse/issues/100882)。[#101021](https://github.com/ClickHouse/ClickHouse/pull/101021)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 修复合并算法中的崩溃（`Logical error: isConst/isSparse/isReplicated assertTypeEquality`）：启用延迟列复制（`enable_lazy_columns_replication`）后产生的 `ColumnReplicated` 列流入输入延迟到达的归并排序流水线时会触发该问题。[#101036](https://github.com/ClickHouse/ClickHouse/pull/101036)（[Groene AI](https://github.com/groeneai)）。
* 修复 `SELECT` 中多个表达式使用同一别名时错误地报告 `UNKNOWN_IDENTIFIER` 的问题；现在会正确报告 `MULTIPLE_EXPRESSIONS_FOR_ALIAS`。[#101040](https://github.com/ClickHouse/ClickHouse/pull/101040)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复声明的时区与表达式时区不同时，`DateTime`/`DateTime64` 类型的 ALIAS 列未应用时区转换的问题。[#101043](https://github.com/ClickHouse/ClickHouse/pull/101043)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复视图、子查询和 `INSERT ... SELECT` 的行策略未记录到 `query_log` 的问题。尽管查询规划时已经应用行策略，但子规划器未将其传递给父规划器以供日志记录。现在仅用于日志记录的行策略会保存在 `QueryAccessInfo` 中，使规划器和子规划器都能填充这些信息。[#101044](https://github.com/ClickHouse/ClickHouse/pull/101044)（[Narasimha Pakeer](https://github.com/npakeer)）。
* 修复流水线数据块中的 `ColumnConst` 列与普通列合并时，`DirectJoinMergeTreeEntity` 发生异常的问题。[#101046](https://github.com/ClickHouse/ClickHouse/pull/101046)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 CTE 列别名格式中的多余空格（`WITH t (a, b)` → `WITH t(a, b)`）。[#101049](https://github.com/ClickHouse/ClickHouse/pull/101049)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复启用 Analyzer 时，`remote`/`cluster` 表函数配合 `merge` 等嵌套表函数使用会失败的问题。[#101055](https://github.com/ClickHouse/ClickHouse/pull/101055)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 `prefer_localhost_replica=1` 时分布式查询重复应用 `OFFSET`，导致返回行数少于预期的问题。[#101071](https://github.com/ClickHouse/ClickHouse/pull/101071)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 修复 `format_regexp` 设置包含无效正则表达式时使用 `Regexp` 格式会崩溃的问题。[#101074](https://github.com/ClickHouse/ClickHouse/pull/101074)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 修复并行副本下启用 `serialize_query_plan=1` 时，时间序列聚合函数出现“Illegal type Decimal64 of start parameter”错误的问题。[#101083](https://github.com/ClickHouse/ClickHouse/pull/101083)（[Groene AI](https://github.com/groeneai)）。
* 修复将带 PREWHERE 的投影与 `ORDER BY ... LIMIT` 一起使用时，`optimizeLazyMaterialization` 发生异常的问题。[#101115](https://github.com/ClickHouse/ClickHouse/pull/101115)（[Anton Popov](https://github.com/CurtizJ)）。
* 修复启用 `aggregate_functions_null_for_empty = 1` 时，使用带内部专用 `Null` 组合器的聚合函数（例如 `sumNull`、`avgNull`）导致服务器崩溃（SIGABRT）的问题。[#101147](https://github.com/ClickHouse/ClickHouse/pull/101147)（[Groene AI](https://github.com/groeneai)）。
* 修复文件系统缓存写入路径中的释放后使用问题；记录已完成的文件段时可能读取已释放的内存（由 BuzzHouse 中的 MemorySanitizer 检出）。[#101161](https://github.com/ClickHouse/ClickHouse/pull/101161)（[Groene AI](https://github.com/groeneai)）。
* 修复分布式索引分析遇到 GLOBAL IN 谓词，且其集合构建时没有显式元素时，服务器因“Trying to attach external table to a ready set without explicit elements”而崩溃的问题。[#101178](https://github.com/ClickHouse/ClickHouse/pull/101178)（[Groene AI](https://github.com/groeneai)）。
* 修复启用 JIT 编译后（达到编译阈值时），对 `Decimal` 列使用 `MAX`/`MIN` 聚合函数会返回错误结果的问题。[#101203](https://github.com/ClickHouse/ClickHouse/pull/101203)（[Raúl Marín](https://github.com/Algunenano)）。
* 修复轻量级删除后，即使所有带轻量级删除 Mask 的数据部件都已合并，`minmax_count_projection` 和简单 `COUNT(*)` 优化仍被永久禁用的问题。[#101212](https://github.com/ClickHouse/ClickHouse/pull/101212)（[Anton Popov](https://github.com/CurtizJ)）。
* 修复远程对象在 `list` 与 `read` 之间被覆盖，产生过期对象元数据后，缓存可能抛出 `Having zero bytes, ...` 逻辑错误的问题。[#101219](https://github.com/ClickHouse/ClickHouse/pull/101219)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复查询带有 `ORDER BY CAST(lc_column, 'Type')` 的 MergeTree 表，且 `lc_column` 为 LowCardinality 类型时，服务器崩溃（LOGICAL\_ERROR：Bad cast from ColumnVector to ColumnLowCardinality）的问题。[#101220](https://github.com/ClickHouse/ClickHouse/pull/101220)（[Groene AI](https://github.com/groeneai)）。
* 修复 `S3Queue` 中过期处理节点的清理。[#101230](https://github.com/ClickHouse/ClickHouse/pull/101230)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复优化参数无效时 mergeTreeAnalyzeIndexes() 中的未定义行为。[#101253](https://github.com/ClickHouse/ClickHouse/pull/101253)（[Azat Khuzhin](https://github.com/azat)）。
* 修复在已分区的 Iceberg 表上连续执行 `ALTER TABLE UPDATE` 时发生 `Logical error: 'partitions_count > 0'` 异常的问题。[#101278](https://github.com/ClickHouse/ClickHouse/pull/101278)（[Desel72](https://github.com/Desel72)）。
* 修复 MergeTree 表的 WHERE 子句中，将大整数常量（例如 256、2147483648）作为布尔谓词并与 AND 组合时返回错误查询结果的问题。例如 `SELECT count() FROM t WHERE (2147483648 > b) AND 2147483648` 此前会错误返回 0，而非匹配全部行。[#101287](https://github.com/ClickHouse/ClickHouse/pull/101287)（[Groene AI](https://github.com/groeneai)）。
* 修复从 Delta Lake 集群向 ReplicatedMergeTree 执行 INSERT SELECT 的问题。[#101299](https://github.com/ClickHouse/ClickHouse/pull/101299)（[Konstantin Vedernikov](https://github.com/scanhex12)）。
* 修复标量子查询引用相互依赖的物化 CTE 链时因“Logical error: Reading from materialized CTE before materialization”而崩溃的问题。[#101305](https://github.com/ClickHouse/ClickHouse/pull/101305)（[Groene AI](https://github.com/groeneai)）。
* 修复 `IStorage::getDependentViewsByColumn` 中 `storage_id` 的数据竞争。[#101385](https://github.com/ClickHouse/ClickHouse/pull/101385)（[Nikolay Degterinsky](https://github.com/evillique)）。
* 修复 BACKUP FROM SNAPSHOT 的 AST 格式化和克隆。[#101405](https://github.com/ClickHouse/ClickHouse/pull/101405)（[Pablo Marcos](https://github.com/pamarcos)）。
* 修复启用 `enforce_keeper_component_tracking` 时查询 `system.part_moves_between_shards` 会因 LOGICAL\_ERROR“Current component is empty”而崩溃的问题。[#101462](https://github.com/ClickHouse/ClickHouse/pull/101462)（[Groene AI](https://github.com/groeneai)）。
* 修复 Fuzzer 生成格式错误的 Dynamic 类型 AST 时，DataTypeDynamic::create() 发生段错误的问题。[#101464](https://github.com/ClickHouse/ClickHouse/pull/101464)（[Groene AI](https://github.com/groeneai)）。
* 未启用 DeltaKernel 却使用 `delta_lake_snapshot_version` 或 CDF 版本设置时，现在会抛出错误，而不再静默返回错误数据。[#101489](https://github.com/ClickHouse/ClickHouse/pull/101489)（[Desel72](https://github.com/Desel72)）。
* 修复启用 `analyzer_compatibility_join_using_top_level_identifier` 时，将 ARRAY JOIN 与 JOIN USING 结合使用会发生 `NOT_FOUND_COLUMN_IN_BLOCK` 异常的问题。关闭 [#101240](https://github.com/ClickHouse/ClickHouse/issues/101240)。[#101507](https://github.com/ClickHouse/ClickHouse/pull/101507)（[Vladimir Cherkasov](https://github.com/vdimir)）。
* 修复使用 `iceberg_metadata_file_path` 创建 Iceberg 表且目标元数据版本已存在时，INSERT 重试循环失败的问题。[#101548](https://github.com/ClickHouse/ClickHouse/pull/101548)（[Groene AI](https://github.com/groeneai)）。
* 从 arrayIntersect 及相关函数的结果列中移除 Nullable，以避免序列化/反序列化不匹配。[#101569](https://github.com/ClickHouse/ClickHouse/pull/101569)（[George Larionov](https://github.com/george-larionov)）。
* 修复从以 IcebergLocal 表引擎为底层的物化视图执行 SELECT 时，服务器崩溃（LOGICAL\_ERROR）的问题。[#101577](https://github.com/ClickHouse/ClickHouse/pull/101577)（[Groene AI](https://github.com/groeneai)）。
* 修复以 NaN 参数调用 `intExp10` 时错误消息不正确的问题：此前错误地显示为 `intExp2`，而非 `intExp10`。[#101582](https://github.com/ClickHouse/ClickHouse/pull/101582)（[Krishna Chaitanya](https://github.com/Krishnachaitanyakc)）。
* 修复 [#100288](https://github.com/ClickHouse/ClickHouse/issues/100288) 重构后，`allow_statistics=0` 无法阻止 `ALTER TABLE ADD STATISTICS` 和 `ALTER TABLE DROP STATISTICS` 的问题。[#101585](https://github.com/ClickHouse/ClickHouse/pull/101585)（[Krishna Chaitanya](https://github.com/Krishnachaitanyakc)）。
* 修复 25.1 之前部分删除遗留的 ZooKeeper 节点缺少 `drop_lock_version` 节点时，`KeeperMap` 执行 `CREATE TABLE` 因“Cannot create metadata for table”而失败的问题。[#101623](https://github.com/ClickHouse/ClickHouse/pull/101623)（[Antonio Andelic](https://github.com/antonio2368)）。
* 修复读取 Map 子列时可能发生的逻辑错误。关闭 [#100769](https://github.com/ClickHouse/ClickHouse/issues/100769) 和 [#101336](https://github.com/ClickHouse/ClickHouse/issues/101336)。[#101641](https://github.com/ClickHouse/ClickHouse/pull/101641)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复 `getSubcolumnData` 中精确子列匹配优先级低于前缀匹配而可能导致崩溃的问题。关闭 [#101271](https://github.com/ClickHouse/ClickHouse/issues/101271)。[#101645](https://github.com/ClickHouse/ClickHouse/pull/101645)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复禁用 `use_variant_default_implementation_for_comparisons` 时，将 `LowCardinality` 列与 `Variant` NULL 常量比较会导致崩溃（LOGICAL\_ERROR：“ColumnUnique can't contain null values”）的问题。[#101690](https://github.com/ClickHouse/ClickHouse/pull/101690)（[Groene AI](https://github.com/groeneai)）。
* 为 Bzip2ReadBuffer 增加空流保护：底层流为空时返回 EOF，而非抛出 UNEXPECTED\_END\_OF\_FILE。[#101691](https://github.com/ClickHouse/ClickHouse/pull/101691)（[ClickGap AI Bot](https://github.com/clickgapai)）。
* 修复 `system.s3_queue_settings` 和 `system.azure_queue_settings` 中 `alterable` 列说明文字含义颠倒的问题；交换 `0` 与 `1` 的含义，使其符合实际代码行为。[#101703](https://github.com/ClickHouse/ClickHouse/pull/101703)（[ClickGap AI Bot](https://github.com/clickgapai)）。
* 修复 positiveModulo(tuple, number) 错误分派到除法而非取模的问题。[#101709](https://github.com/ClickHouse/ClickHouse/pull/101709)（[ClickGap AI Bot](https://github.com/clickgapai)）。
* 修复在缓存封装的磁盘上配置 `thread_pool_size` 时发生崩溃的问题。此前 `FileCacheSettings::loadFromConfig()` 会将其作为未知设置拒绝，导致服务器无法启动；该设置实际是有效的 `IDisk` 参数，用于控制后台数据部件移动时磁盘间复制操作的线程数。[#101712](https://github.com/ClickHouse/ClickHouse/pull/101712)（[Francisco](https://github.com/Milias)）。
* 修复创建 `RANGE_HASHED` 字典时静默接受不存在的 `MAX` 范围属性，以及最小、最大范围属性类型不同时使用错误类型配置的问题。原因是 `buildRangeConfiguration` 中的复制粘贴错误：查找最大属性时使用了 `min_attr_name` 而非 `max_attr_name`。[#101732](https://github.com/ClickHouse/ClickHouse/pull/101732)（[Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)）。
* 修复 CPU 租约调度器中的释放后使用崩溃：等待计时器的生存期可能超过其引用 `ProfileEvents::Counters` 所属的工作线程。[#101761](https://github.com/ClickHouse/ClickHouse/pull/101761)（[Antonio Andelic](https://github.com/antonio2368)）。
* 修复 arrayLevenshteinDistanceWeighted 和 arraySimilarity 函数中的错误。关闭 [#101725](https://github.com/ClickHouse/ClickHouse/issues/101725)。[#101767](https://github.com/ClickHouse/ClickHouse/pull/101767)（[Mikhail f. Shiryaev](https://github.com/Felixoid)）。
* 修复 Prometheus Query API 忽略 POST 表单正文的问题。[#101794](https://github.com/ClickHouse/ClickHouse/pull/101794)（[James Cunningham](https://github.com/JTCunning)）。
* 修复 S3 `Client::~Client` 析构函数中逸出的异常导致服务器终止的问题。[#101798](https://github.com/ClickHouse/ClickHouse/pull/101798)（[Gagan Dhakrey](https://github.com/gagandhakrey)）。
* 修复并行反序列化 `Object` 类型动态路径时的作用域结束后使用问题，该问题可能导致读取具有大量动态路径的表时崩溃。[#101823](https://github.com/ClickHouse/ClickHouse/pull/101823)（[Antonio Andelic](https://github.com/antonio2368)）。
* 修复使用某些非默认格式设置时，`formatDateTime` 函数的 `%W` 格式符输出错误的问题。[#101847](https://github.com/ClickHouse/ClickHouse/pull/101847)（[Robert Schulze](https://github.com/rschu1ze)）。
* 修复 `SYSTEM INSTRUMENT ADD` 中 `shouldPatchFunction` 的假阴性：当搜索字符串首次出现在反修饰符号名称的模板参数中时会触发此问题。[#101885](https://github.com/ClickHouse/ClickHouse/pull/101885)（[Pablo Marcos](https://github.com/pamarcos)）。
* 修复定期刷新期间 ZooKeeper 会话过期导致 UDF 注册表丢失的问题；此前所有用户自定义函数都可能不可用，直至完整刷新成功。[#101891](https://github.com/ClickHouse/ClickHouse/pull/101891)（[Nikita Fomichev](https://github.com/fm4v)）。
* 修复 `system.codecs` 中 `AES_256_GCM_SIV` 的说明，将错误的 `AES-128` 改为 `AES-256`。[#101917](https://github.com/ClickHouse/ClickHouse/pull/101917)（[Jimmy Aguilar Mena](https://github.com/Ergus)）。
* 修复 JSON 列上创建的 MinMax 索引使用错误极值而导致查询结果错误的问题。关闭 [#101700](https://github.com/ClickHouse/ClickHouse/issues/101700)。[#101918](https://github.com/ClickHouse/ClickHouse/pull/101918)（[Pavel Kruglov](https://github.com/Avogar)）。
* `splitByString` 分词器现在会拒绝空分隔字符串。[#101928](https://github.com/ClickHouse/ClickHouse/pull/101928)（[Robert Schulze](https://github.com/rschu1ze)）。
* 修复 `materialize_skip_indexes_on_merge=false` 未能阻止合并期间构建文本（全文）索引的问题。此前仅抑制非文本跳数索引（minmax、set、bloom\_filter），文本索引仍会继续构建，浪费 CPU 和 I/O。[#101932](https://github.com/ClickHouse/ClickHouse/pull/101932)（[Groene AI](https://github.com/groeneai)）。
* 修复 `sparseGrams` 分词器生成的 Token 长于指定最大长度的问题（原因是实现中硬编码了 `+2`）。[#101934](https://github.com/ClickHouse/ClickHouse/pull/101934)（[Elmi Ahmadov](https://github.com/ahmadov)）。
* 修复 `addStreams` 期间流构造函数抛出异常，在 `column_streams` 中留下空条目后，`MergeTreeDataPartWriterWide::cancel` 发生 SIGSEGV 的问题。[#101936](https://github.com/ClickHouse/ClickHouse/pull/101936)（[Antonio Andelic](https://github.com/antonio2368)）。
* 修复启用 `query_plan_direct_read_from_text_index` 时，查询带全文索引的 Merge 或 Distributed 表并混合使用 `has*Tokens` 与 LIKE 过滤条件会发生异常的问题。[#101939](https://github.com/ClickHouse/ClickHouse/pull/101939)（[Jimmy Aguilar Mena](https://github.com/Ergus)）。
* 修复解析包含无效 `QueryProcessingStage` 值的原生协议查询数据包时的未定义行为。[#101972](https://github.com/ClickHouse/ClickHouse/pull/101972)（[Raúl Marín](https://github.com/Algunenano)）。
* 初始查询解析期间发生异常时关闭 TCP 连接，防止从已失去同步的数据流中读取无效数据。[#101989](https://github.com/ClickHouse/ClickHouse/pull/101989)（[Raúl Marín](https://github.com/Algunenano)）。
* 修复 26.1 及更高版本文件系统缓存中的 SLRU 竞态问题，该问题可能导致空间预留逻辑错误；在 Debug 构建中还可能触发断言：`'Previous state is Evicting, but expected state to be Active while setting Evicting flag for 2c1e3484ecdc6b78a8978fa5b17c5097:0:339 (state: Evicting)'.`。[#101991](https://github.com/ClickHouse/ClickHouse/pull/101991)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复将带有尾随数据的字符串转换为空 `Tuple()` 类型时发生异常的问题。[#102011](https://github.com/ClickHouse/ClickHouse/pull/102011)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复采用 grace\_hash Join 算法且使用 ORDER BY 的查询行序错误；受影响查询可能以错误顺序返回结果，静默产生错误输出。[#102036](https://github.com/ClickHouse/ClickHouse/pull/102036)（[János Benjamin Antal](https://github.com/antaljanosbenjamin)）。
* 修复配置 `max_bytes_in_join` 时 RIGHT JOIN 和 FULL JOIN 查询可能出现的 LOGICAL ERROR（Unexpected size of index type）。[#102042](https://github.com/ClickHouse/ClickHouse/pull/102042)（[Jimmy Aguilar Mena](https://github.com/Ergus)）。
* 修复负值 Time 与 DateTime 比较时返回错误结果的问题。关闭 [#101670](https://github.com/ClickHouse/ClickHouse/issues/101670)。[#102056](https://github.com/ClickHouse/ClickHouse/pull/102056)（[Yarik Briukhovetskyi](https://github.com/yariks5s)）。
* 修复 `ZooKeeperRetriesControl` 在已过期的 ZooKeeper 会话上重试却不更新会话，导致 UDF 刷新崩溃的问题。[#102059](https://github.com/ClickHouse/ClickHouse/pull/102059)（[Nikita Fomichev](https://github.com/fm4v)）。
* 修复格式化 unlock snapshot 时缺少空格的问题。关闭 [https://github.com/clickhouse/clickhouse/issues/101723](https://github.com/clickhouse/clickhouse/issues/101723)。[#102063](https://github.com/ClickHouse/ClickHouse/pull/102063)（[Han Fei](https://github.com/hanfei1991)）。
* 修复查询带 WHERE 子句的视图，且内部查询产生的列类型与视图元数据不同（例如 LEFT JOIN 配合 `join_use_nulls` 产生 Nullable）时发生崩溃（SIGSEGV）的问题。[#102085](https://github.com/ClickHouse/ClickHouse/pull/102085)（[Miсhael Stetsyuk](https://github.com/mstetsyuk)）。
* 修复数据部件移除后，由于缓存键不匹配而永不淘汰 `VectorSimilarityIndexCache` 条目的问题。[#102152](https://github.com/ClickHouse/ClickHouse/pull/102152)（[Seva Potapov](https://github.com/seva-potapov)）。
* 使用 RabbitMQ 存储时，对损坏的消息发送 NACK。[#102157](https://github.com/ClickHouse/ClickHouse/pull/102157)（[Seva Potapov](https://github.com/seva-potapov)）。
* 修复解析错误的空 Tuple 字符串时发生逻辑错误的问题。[#102289](https://github.com/ClickHouse/ClickHouse/pull/102289)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 修复启用 `optimize_aggregation_in_order=1`，且 GROUP BY 列顺序不同于表排序键时产生错误聚合结果（重复行）的问题。[#102299](https://github.com/ClickHouse/ClickHouse/pull/102299)（[Groene AI](https://github.com/groeneai)）。
* 修复以 Avro 格式执行 `IcebergLocal` 的 `ALTER TABLE ... UPDATE` 时发生崩溃的问题；原因是序列化之前没有解包 `LowCardinality`/`Nullable` 包装类型。[#102337](https://github.com/ClickHouse/ClickHouse/pull/102337)（[Desel72](https://github.com/Desel72)）。
* 修复对没有表达式的物化列执行变更操作时发生段错误的问题。关闭 [#102185](https://github.com/ClickHouse/ClickHouse/issues/102185)。[#102342](https://github.com/ClickHouse/ClickHouse/pull/102342)（[zoomxi](https://github.com/zoomxi)）。
* 修复 CoalescingMergeTree 对 Array 类型的处理。关闭 [#89509](https://github.com/ClickHouse/ClickHouse/issues/89509)。[#102384](https://github.com/ClickHouse/ClickHouse/pull/102384)（[Konstantin Vedernikov](https://github.com/scanhex12)）。
* 修复启用 Bloom Filter 下推并以 WHERE 等于/不等于条件读取 Parquet 文件时发生段错误（Debug 构建中为 LOGICAL\_ERROR）的问题。原因是 Parquet 预取器获取 Bloom Filter 数据时越界访问内存，也可能造成不确定的错误查询结果。[#102385](https://github.com/ClickHouse/ClickHouse/pull/102385)（[Groene AI](https://github.com/groeneai)）。
* 修复 SLRU 文件系统缓存动态调整大小时，由于各子队列共享淘汰统计信息且失败候选项的恢复路径错误而触发 `LOGICAL_ERROR` 中止的问题。[#102396](https://github.com/ClickHouse/ClickHouse/pull/102396)（[Antonio Andelic](https://github.com/antonio2368)）。
* 修复 Replicated 数据库中的 Alias 表没有目标表时，无法在全新副本上初始化的问题。关闭 [#101320](https://github.com/ClickHouse/ClickHouse/issues/101320)。[#102397](https://github.com/ClickHouse/ClickHouse/pull/102397)（[Nikolay Degterinsky](https://github.com/evillique)）。
* 修复搜索完全由空字节组成的 Needle 时，字符串搜索函数（`countSubstrings`、`position` 等）越界读取的问题。[#102401](https://github.com/ClickHouse/ClickHouse/pull/102401)（[Raúl Marín](https://github.com/Algunenano)）。
* 当 `compatibility` 指向早于 26.1 的版本时，不再禁用全文索引设置（`enable_full_text_index`、`allow_experimental_full_text_index`、`use_skip_indexes_on_data_read`）。此前这可能阻止 `SharedDatabaseCatalog` 创建带文本索引的表。[#102422](https://github.com/ClickHouse/ClickHouse/pull/102422)（[Nikita Fomichev](https://github.com/fm4v)）。
* 修复 `printf` 的格式字符串以 `%` 结尾时越界读取的问题。[#102472](https://github.com/ClickHouse/ClickHouse/pull/102472)（[Raúl Marín](https://github.com/Algunenano)）。
* 修复 AsynchronousMetrics 在 Debug 构建中的 chassert 异常 `ReadBuffer is canceled`；原因是 Rewind 未重置缓冲区取消标志。[#102524](https://github.com/ClickHouse/ClickHouse/pull/102524)（[Yuri Fedoseev](https://github.com/yurifedoseev)）。
* 修复对带文本索引的列使用 `hasToken` / `hasTokenOrNull`，且 Needle 仅含分隔符（例如 `'()'`、`'!!!'`）时的问题：此前索引会静默跳过所有 Granule，而非对 `hasToken` 抛出 `BAD_ARGUMENTS`，或对 `hasTokenOrNull` 返回 `NULL`。[#102544](https://github.com/ClickHouse/ClickHouse/pull/102544)（[Jimmy Aguilar Mena](https://github.com/Ergus)）。
* 修复 Keeper 处理超大型 Multi 请求时的 OOM。OpenTelemetry 跟踪此前会无条件为 `ZooKeeperRequest` 对象中的 Span 分配超过 1 KiB，超大型 Multi 请求可能额外分配超过 10 GiB 内存。现在共享数据保存在静态内存中，且 `ZooKeeperOpentelemetrySpans` 使用 `std::unique_ptr` 取代 `std::optional`。[#102586](https://github.com/ClickHouse/ClickHouse/pull/102586)（[Miсhael Stetsyuk](https://github.com/mstetsyuk)）。
* 修复对已存在集合执行 `CREATE NAMED COLLECTION IF NOT EXISTS` 导致 `NamedCollection` CurrentMetric 虚高，以及启动时从配置或 SQL 存储加载的集合未初始化该指标的问题。关闭 [#102507](https://github.com/ClickHouse/ClickHouse/issues/102507)。[#102598](https://github.com/ClickHouse/ClickHouse/pull/102598)（[Pablo Marcos](https://github.com/pamarcos)）。
* 修复并发 DDL 导致本地分片返回空列时，`getStructureOfRemoteTable` 发生异常的问题。[#102604](https://github.com/ClickHouse/ClickHouse/pull/102604)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复多个并发 `CREATE TABLE IF NOT EXISTS` 查询在 Shared 数据库中以同一 `S3Queue` 表为目标时发生 `LOGICAL_ERROR` 异常的问题。[#102610](https://github.com/ClickHouse/ClickHouse/pull/102610)（[Nikita Taranov](https://github.com/nickitat)）。
* 修复原生 Parquet V3 读取器在带 WHERE 过滤条件读取 Nullable 列时，因 LOGICAL\_ERROR“Unexpected number of rows in column subchunk”而崩溃的问题。[#102628](https://github.com/ClickHouse/ClickHouse/pull/102628)（[Groene AI](https://github.com/groeneai)）。
* 修复 `AzureWriteMicroseconds` ProfileEvent 的说明错误地写成“read”而非“write”。[#102639](https://github.com/ClickHouse/ClickHouse/pull/102639)（[Miсhael Stetsyuk](https://github.com/mstetsyuk)）。
* 修复行策略在某些特殊情况下引发“Not found column in block”异常的问题。[#102648](https://github.com/ClickHouse/ClickHouse/pull/102648)（[Yarik Briukhovetskyi](https://github.com/yariks5s)）。
* 修复静态集群（在配置中定义）暂时没有活动节点时，ClusterDiscovery 发生服务器异常的问题。[#102661](https://github.com/ClickHouse/ClickHouse/pull/102661)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复时区调整后发生溢出时，错误推断日期数据类型的问题。关闭 [#102601](https://github.com/ClickHouse/ClickHouse/issues/102601)。[#102674](https://github.com/ClickHouse/ClickHouse/pull/102674)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复等待过程中删除可刷新物化视图时，`SYSTEM WAIT VIEW` 永久挂起的问题。[#102681](https://github.com/ClickHouse/ClickHouse/pull/102681)（[Nikolay Degterinsky](https://github.com/evillique)）。
* 修复使用 Dynamic 表达式的 CASE 对所有行都返回 ELSE 的问题。关闭 [#102511](https://github.com/ClickHouse/ClickHouse/issues/102511)。[#102684](https://github.com/ClickHouse/ClickHouse/pull/102684)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复采用二进制编码数据类型时，扁平化 Dynamic 类型的序列化。关闭 [#101911](https://github.com/ClickHouse/ClickHouse/issues/101911)。[#102692](https://github.com/ClickHouse/ClickHouse/pull/102692)（[Pavel Kruglov](https://github.com/Avogar)）。
* 修复 format\_schema\_source='query' 静默忽略多行结果的问题。关闭 [#101905](https://github.com/ClickHouse/ClickHouse/issues/101905)。[#102698](https://github.com/ClickHouse/ClickHouse/pull/102698)（[Pavel Kruglov](https://github.com/Avogar)）。
* 通过 SSH 客户端报告实际退出码，而不是将所有错误都映射为 `1`。关闭 [#101741](https://github.com/ClickHouse/ClickHouse/issues/101741)。[#102700](https://github.com/ClickHouse/ClickHouse/pull/102700)（[Konstantin Bogdanov](https://github.com/thevar1able)）。
* 修复动态/预定义查询处理器丢失 HTTP 标头的问题。关闭 [#101846](https://github.com/ClickHouse/ClickHouse/issues/101846)。[#102706](https://github.com/ClickHouse/ClickHouse/pull/102706)（[Konstantin Bogdanov](https://github.com/thevar1able)）。
* 对折叠后的 jemalloc 堆 Profile 应用泊松采样校正，使其与 jeprof 输出一致。此前折叠格式未计入采样概率，低估了实际分配大小。[#102759](https://github.com/ClickHouse/ClickHouse/pull/102759)（[Antonio Andelic](https://github.com/antonio2368)）。
* 修复以 `NULL` 参数调用 `hasPhrase` 函数时发生崩溃的问题。[#102802](https://github.com/ClickHouse/ClickHouse/pull/102802)（[Nikita Taranov](https://github.com/nickitat)）。
* 修复读取 Schema 中包含循环符号类型引用的 Avro 文件时服务器崩溃（SIGSEGV）的问题。现在会检测此类 Schema 并给出明确错误消息，而非崩溃。[#102853](https://github.com/ClickHouse/ClickHouse/pull/102853)（[Groene AI](https://github.com/groeneai)）。
* 修复 `Variant` 列上的函数在 `FunctionVariantAdaptor` 转换结果期间达到内存限制或发生其他非类型转换异常时，服务器因 LOGICAL\_ERROR 断言而崩溃的问题。现在会正确传播异常，而不再误判为内部错误。[#102855](https://github.com/ClickHouse/ClickHouse/pull/102855)（[Groene AI](https://github.com/groeneai)）。
* 修复 Schema 推断期间抛出 `std::length_error` 时 Debug/Sanitizer 构建中的服务器崩溃，例如 `input_format_msgpack_number_of_columns` 值极大或输入数据格式错误时。[#102859](https://github.com/ClickHouse/ClickHouse/pull/102859)（[Groene AI](https://github.com/groeneai)）。
* 复制列和稀疏列序列化时的 null 表示现在会遵循设置（例如 format\_tsv\_null\_representation）。[#102888](https://github.com/ClickHouse/ClickHouse/pull/102888)（[Hechem Selmi](https://github.com/m-selmi)）。
* 已在 [#103499](https://github.com/ClickHouse/ClickHouse/issues/103499) 中反向移植：修复 S3 请求因 `ios_base::clear: unspecified iostream_category error` 而失败且不重试的问题，原因是 Poco `BufferedStreamBuf::flushBuffer` 未处理 Socket 层的短写。[#102894](https://github.com/ClickHouse/ClickHouse/pull/102894)（[Sema Checherinda](https://github.com/CheSema)）。
* 修复轻量级删除后，即使所有带轻量级删除 Mask 的数据部件都已合并，`minmax_count_projection` 和简单 `COUNT(*)` 优化仍被永久禁用的问题。[#102900](https://github.com/ClickHouse/ClickHouse/pull/102900)（[Anton Popov](https://github.com/CurtizJ)）。
* 修复 LTO 导致 jemalloc 随机崩溃的问题。[#102913](https://github.com/ClickHouse/ClickHouse/pull/102913)（[Azat Khuzhin](https://github.com/azat)）。
* 在新 Analyzer 中将行策略的 OR 条件链优化为 IN。[#102915](https://github.com/ClickHouse/ClickHouse/pull/102915)（[Azat Khuzhin](https://github.com/azat)）。
* 修复页缓存释放时使用错误对齐方式，导致 jemalloc 元数据损坏并可能引发崩溃的问题。[#102918](https://github.com/ClickHouse/ClickHouse/pull/102918)（[Azat Khuzhin](https://github.com/azat)）。
* 没有物化视图的普通 INSERT 不再请求过量的 ConcurrencyControl 槽位和线程（此前使用 `max_threads`，现在使用 `max_insert_threads`），避免高 INSERT 吞吐集群中的 CC 槽位耗尽和线程数激增。[#102961](https://github.com/ClickHouse/ClickHouse/pull/102961)（[Sema Checherinda](https://github.com/CheSema)）。
* 重新引入 ArrowMemoryPool，使其可以抛出 MEMORY\_LIMIT\_EXCEEDED，从而避免内核 OOM。[#102999](https://github.com/ClickHouse/ClickHouse/pull/102999)（[Azat Khuzhin](https://github.com/azat)）。
* 修复 `CAST` 到 `Nullable(DateTime)` 时忽略 `cast_string_to_date_time_mode` 的问题。关闭 [#101840](https://github.com/ClickHouse/ClickHouse/issues/101840)。[#103035](https://github.com/ClickHouse/ClickHouse/pull/103035)（[Pavel Kruglov](https://github.com/Avogar)）。
* 文本索引直接读取优化新增对 `ALIAS` 列的支持。[#103037](https://github.com/ClickHouse/ClickHouse/pull/103037)（[Anton Popov](https://github.com/CurtizJ)）。
* 已在 [#103454](https://github.com/ClickHouse/ClickHouse/issues/103454) 中反向移植：修复聚合投影匹配查询，但表中部分数据部件没有投影数据时（例如在已有数据的表上新增投影且未运行 `MATERIALIZE PROJECTION`），`SELECT DISTINCT` 静默返回不完整结果的问题。关闭 [#102951](https://github.com/ClickHouse/ClickHouse/issues/102951)。[#103052](https://github.com/ClickHouse/ClickHouse/pull/103052)（[Nihal Z. Miaji](https://github.com/nihalzp)）。
* 修复 MergeTree 表上的 `WHERE x AND toNullable(N)` 在 `N` 为宽于 `UInt8` 的整数（例如 `256`、`65535`、`2147483648` 或任意负整数）时返回错误结果的问题。过滤器此前会错误丢弃所有行，因为 `splitFilterNodeForAllowedInputs` 将约简后 `AND` 的 Nullable 余项转换为布尔值时使用了 `NULL` 零值，使比较在三值逻辑下变为 `NULL`。[#103077](https://github.com/ClickHouse/ClickHouse/pull/103077)（[Groene AI](https://github.com/groeneai)）。
* 修复以相反参数顺序传递字符串搜索函数（例如 `locate`、`position`）时，错误消息报告了错误参数类型的问题（`function_locate_has_mysql_compatible_argument_order = 1` 时使用 `locate(needle, haystack)`）。[#103102](https://github.com/ClickHouse/ClickHouse/pull/103102)（[Alex Kuleshov](https://github.com/0xAX)）。
* 修复没有线程暂停在 Failpoint 上时调用 disableFailPoint，导致 waitForPause 永久挂起的问题。[#103119](https://github.com/ClickHouse/ClickHouse/pull/103119)（[Shaohua Wang](https://github.com/tiandiwonder)）。
* 将认证前 TCP Hello 数据包字符串限制为 64 KB，并新增服务器设置 `handshake_timeout_milliseconds` 以限制握手总时长，防止未认证客户端占用过量内存或无限期占用线程。[#103284](https://github.com/ClickHouse/ClickHouse/pull/103284)（[Sema Checherinda](https://github.com/CheSema)）。
* 修复 Parquet ColumnIndex 中 String 列统计信息出现 min\_value > max\_value 的问题。[#103334](https://github.com/ClickHouse/ClickHouse/pull/103334)（[Saurabh Kumar Ojha](https://github.com/saurabhojha)）。
* 检查 Native 格式中格式错误的扁平化 Dynamic 数据。[#103392](https://github.com/ClickHouse/ClickHouse/pull/103392)（[Pavel Kruglov](https://github.com/Avogar)）。
* 从 `url` 表函数填充 `_time` 列。[#103437](https://github.com/ClickHouse/ClickHouse/pull/103437)（[Nikita Taranov](https://github.com/nickitat)）。
* 修复 SVE 检测在 SVE 不可用时仍使用 SVE 指令的问题。[#103568](https://github.com/ClickHouse/ClickHouse/pull/103568)（[Raúl Marín](https://github.com/Algunenano)）。

<h4 id="264-build-testing-packaging-improvement">
  构建/测试/打包改进
</h4>

* Libstemmer（Snowball）依赖更新至 v3.0.1。[#99256](https://github.com/ClickHouse/ClickHouse/pull/99256)（[Jimmy Aguilar Mena](https://github.com/Ergus)）。
* 在 clickhouse-test 中随机化以下设置：`use_skip_indexes_for_top_k`、`use_top_k_dynamic_filtering`、`query_plan_max_limit_for_top_k_optimization`。[#91782](https://github.com/ClickHouse/ClickHouse/pull/91782)（[Nikita Fomichev](https://github.com/fm4v)）。
* 为函数实现压力测试，检查其各种属性的健全性。[#93543](https://github.com/ClickHouse/ClickHouse/pull/93543)（[Michael Kolupaev](https://github.com/al13n321)）。
* 为 `llvm-project` 提供自有 CMake 配置，不再导入上游配置。[#97453](https://github.com/ClickHouse/ClickHouse/pull/97453)（[Konstantin Bogdanov](https://github.com/thevar1able)）。
* 在测试基础设施中随机化更多 `optimize_*` 设置，提高查询优化 Pass 的覆盖率。[#97547](https://github.com/ClickHouse/ClickHouse/pull/97547)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 使用 Rust 工具链 nightly-2026-03-22。[#98602](https://github.com/ClickHouse/ClickHouse/pull/98602)（[Konstantin Bogdanov](https://github.com/thevar1able)）。
* 使用 `wasmtime` v42.0.1。[#98603](https://github.com/ClickHouse/ClickHouse/pull/98603)（[Konstantin Bogdanov](https://github.com/thevar1able)）。
* 使用 `llvm-project` 22.1.1。[#98882](https://github.com/ClickHouse/ClickHouse/pull/98882)（[Konstantin Bogdanov](https://github.com/thevar1able)）。
* 在夜间逐测试覆盖率流水线中，以 LLVM 源码覆盖率（`WITH_COVERAGE`、`-fprofile-instr-generate -fcoverage-mapping`）取代 `SANITIZE_COVERAGE`（自定义 Sanitizer 回调、符号级粒度）。服务器现在启动时从 ELF Section 读取自身覆盖率映射，并通过新的 `SYSTEM SET COVERAGE TEST 'name'` 命令按测试收集 `(file, line_start, line_end)` 元组。定向 CI 检查的测试选择会查询新的 `checks_coverage_lines` CIDB 表中的行范围，并按候选测试覆盖的变更 Diff 行数排序。[#99513](https://github.com/ClickHouse/ClickHouse/pull/99513)（[Nikita Fomichev](https://github.com/fm4v)）。
* 修复以 `-O0` 构建时的 llvm-libc 链接错误。[#100023](https://github.com/ClickHouse/ClickHouse/pull/100023)（[Zheguang Zhao](https://github.com/zheguang)）。
* 修复配置不包含 `logger.log` 和 `logger.errorlog` 设置时（例如所有日志均输出到 STDOUT/STDERR），容器启动时出现的两条错误消息。[#100239](https://github.com/ClickHouse/ClickHouse/pull/100239)（[Simon](https://github.com/simonhammes)）。
* macOS 构建优先使用 `ld64.lld`，而非 Apple 的 `ld`（cctools-port ld64）。由于 cctools-port 的 ld64 配合 `-ffunction-sections` 和 `-dead_strip` 时非常慢，这会显著缩短 Darwin 链接时间；若 `ld64.lld` 不可用则回退至 `ld`。[#100275](https://github.com/ClickHouse/ClickHouse/pull/100275)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 增加测试，确保目录不会记录任何机密信息（REST + Glue）。[#100307](https://github.com/ClickHouse/ClickHouse/pull/100307)（[Konstantin Vedernikov](https://github.com/scanhex12)）。
* 使用不同的随机化设置重复运行最近修改的测试。[#100385](https://github.com/ClickHouse/ClickHouse/pull/100385)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 在 CMake 中跟踪 `#embed` 文件依赖，并启用 ccache Depend 模式以确保正确重新构建。[#100411](https://github.com/ClickHouse/ClickHouse/pull/100411)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 为 TPC-H 查询增加正确性测试。[#100580](https://github.com/ClickHouse/ClickHouse/pull/100580)（[Raufs Dunamalijevs](https://github.com/rienath)）。
* 使用 `aws-sdk-cpp` 1.11.771。[#100582](https://github.com/ClickHouse/ClickHouse/pull/100582)（[Konstantin Bogdanov](https://github.com/thevar1able)）。
* 允许性能测试 XML 通过 file 属性引用外部 SQL 查询文件和设置。[#100747](https://github.com/ClickHouse/ClickHouse/pull/100747)（[Raufs Dunamalijevs](https://github.com/rienath)）。
* 在 `LowerUpperImpl.h` 中补充缺失的 `TargetSpecific.h` Include，修复使用 `-march=x86-64-v4` 时的编译问题。[#100932](https://github.com/ClickHouse/ClickHouse/pull/100932)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 在 cxxflags 中增加 --no-default-config，修复 Gentoo 上的构建问题。[#100973](https://github.com/ClickHouse/ClickHouse/pull/100973)（[Isak Ellmer](https://github.com/spinojara)）。
* 新增 `utils/auto-bisect/`：基于 Shell 的二分定位框架，可下载预构建 CI 二进制文件并运行用户提供的测试脚本，无需本地构建即可找出首个引入回退的提交。[#100989](https://github.com/ClickHouse/ClickHouse/pull/100989)（[Nikita Fomichev](https://github.com/fm4v)）。
* 在 CMake 中默认禁用 ThinLTO，使本地开发构建不再隐式启用；CI Release 构建显式传入 `-DENABLE_THINLTO=1`，不受影响。[#101041](https://github.com/ClickHouse/ClickHouse/pull/101041)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 将 TPC-DS SF1 基准加入性能测试。[#101209](https://github.com/ClickHouse/ClickHouse/pull/101209)（[Raufs Dunamalijevs](https://github.com/rienath)）。
* 增加 MergeTree 轻量级删除的无状态测试，覆盖：`has_lightweight_delete` 标志生命周期、启用 `optimize_trivial_count_query` 时 `COUNT(*)` 的正确性、`MATERIALIZED`/`DEFAULT` 列完整性、`ReplicatedMergeTree` 标志恢复、含已删除行的 `read_in_order`、多轮删除/合并、隐藏 `_row_exists` 列、不同谓词，以及 `ALTER DELETE` RBAC 强制执行。[#101792](https://github.com/ClickHouse/ClickHouse/pull/101792)（[Nikita Fomichev](https://github.com/fm4v)）。
* 带标签 Release 的 Distroless Docker 镜像现在会发布 Ubuntu 和 Alpine 两种变体。[#101941](https://github.com/ClickHouse/ClickHouse/pull/101941)（[Rahul Nair](https://github.com/motsc)）。
* 堆栈跟踪现在显示简洁的相对路径（例如 `src/Common/Exception.cpp`），而非混有构建目录的路径（例如 `./ci/tmp/fast_build/./src/Common/Exception.cpp`）。[#102000](https://github.com/ClickHouse/ClickHouse/pull/102000)（[Raúl Marín](https://github.com/Algunenano)）。
* 增加 CI 风格检查，拒绝向仓库提交大于 5 MB 的文件，并为已有的合法测试数据设置白名单；同时移除未使用的 14 MB `zookeeper_log.parquet`。[#102080](https://github.com/ClickHouse/ClickHouse/pull/102080)（[Raúl Marín](https://github.com/Algunenano)）。
* 从头文件中移除约 400 条未使用的 `#include` 指令，以缩短编译时间。[#102585](https://github.com/ClickHouse/ClickHouse/pull/102585)（[Raúl Marín](https://github.com/Algunenano)）。
* 使用 `wasmtime` v43.0.1。[#102603](https://github.com/ClickHouse/ClickHouse/pull/102603)（[Konstantin Bogdanov](https://github.com/thevar1able)）。
* 使用 `openssl` 3.5.6。[#102606](https://github.com/ClickHouse/ClickHouse/pull/102606)（[Konstantin Bogdanov](https://github.com/thevar1able)）。
* 使用 `xz` 5.8.3。[#102607](https://github.com/ClickHouse/ClickHouse/pull/102607)（[Konstantin Bogdanov](https://github.com/thevar1able)）。
* 将 Distroless Docker 镜像基础从 Debian 12（glibc 2.36、OpenSSL 3.0）升级至 Debian 13（glibc 2.41、OpenSSL 3.5），将 CVE 攻击面降至零个可触达漏洞。[#101678](https://github.com/ClickHouse/ClickHouse/pull/101678)（[Rahul Nair](https://github.com/motsc)）。
