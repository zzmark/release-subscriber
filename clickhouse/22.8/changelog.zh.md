<h3 id="a-id228a-clickhouse-release-228-2022-08-18">
  <a id="228" /> ClickHouse 22.8 版本, 2022-08-18. [演示文稿](https://presentations.clickhouse.com/2022-release-22.8/), [视频](https://www.youtube.com/watch?v=yob7AnaBJz0)
</h3>

<Frame>
  <iframe src="https://www.youtube.com/embed/yob7AnaBJz0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
</Frame>

<h4 id="backward-incompatible-change-3">
  向后不兼容变更
</h4>

* 将 `Date32` 和 `DateTime64` 的范围扩展为支持 1900 至 2299 年的日期。此前仅支持 1925 至 2283 年。实现采用前推格里高利历（符合 [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601):2004 第 3.2.1 条“格里高利历”），而不考虑历史上从儒略历到格里高利历的转换。此变更影响超出范围参数的实现特定行为。例如，此前 `1899-01-01` 会被截到 `1925-01-01`，新版本会截到 `1900-01-01`。传入 `INTERVAL 3 QUARTER` 时，`toStartOfInterval` 的取整行为可能变化最多一个季度，因为间隔从实现特定的时间点开始计算。关闭 [#28216](https://github.com/ClickHouse/ClickHouse/issues/28216)，改进 [#38393](https://github.com/ClickHouse/ClickHouse/issues/38393)。[#39425](https://github.com/ClickHouse/ClickHouse/pull/39425)（[Roman Vasin](https://github.com/rvasin)）。
* 现在，所有相关字典数据源均遵循 `remote_url_allow_hosts` 设置。此前已覆盖 HTTP、Cassandra、Redis，现在新增 ClickHouse、MongoDB、MySQL、PostgreSQL。仅检查通过 DDL 创建的字典的主机。[#39184](https://github.com/ClickHouse/ClickHouse/pull/39184)（[Nikolai Kochetov](https://github.com/KochetovNicolai)）。
* 预构建的 ClickHouse x86 二进制文件现在要求支持 AVX 指令，即 CPU 不能早于 Intel Sandy Bridge / AMD Bulldozer，两者均于 2011 年发布。[#39000](https://github.com/ClickHouse/ClickHouse/pull/39000)（[Robert Schulze](https://github.com/rschu1ze)）。
* 使远程文件系统缓存可组合，允许某些文件（如 idx、mrk 等）不被淘汰，并删除旧版缓存实现。现在可以在 Azure Blob Storage 磁盘、本地磁盘、StaticWeb 磁盘等之上配置缓存。此 PR 标为向后不兼容，因为缓存配置发生变化，必须更新配置文件才能使缓存生效。新配置仍会使用已有缓存。服务器使用旧缓存配置也能正常启动。关闭 [https://github.com/ClickHouse/ClickHouse/issues/36140](https://github.com/ClickHouse/ClickHouse/issues/36140)。关闭 [https://github.com/ClickHouse/ClickHouse/issues/37889](https://github.com/ClickHouse/ClickHouse/issues/37889)。（[Kseniia Sumarokova](https://github.com/kssenii)）。[#36171](https://github.com/ClickHouse/ClickHouse/pull/36171)）

<h4 id="new-feature-4">
  新功能
</h4>

* 为 MergeTree 表支持 SQL 标准的 DELETE FROM 语法，并为 MergeTree 家族实现轻量删除。[#37893](https://github.com/ClickHouse/ClickHouse/pull/37893)（[Jianmei Zhang](https://github.com/zhangjmruc)）（[Alexander Gololobov](https://github.com/davenger)）。注意：这项新功能并不使 ClickHouse 成为 HTAP 数据库管理系统。
* 查询参数可以在交互模式下通过 `SET param_abc = 'def'` 设置，并作为设置项经 Native 协议传输。[#39906](https://github.com/ClickHouse/ClickHouse/pull/39906)（[Nikita Taranov](https://github.com/nickitat)）。
* 可以在 Native 协议中设置配额键（[Yakov Olkhovsky](https://github.com/ClickHouse/ClickHouse/pull/39874)）。
* 新增 `exact_rows_before_limit`（0/1）设置。启用后，ClickHouse 将提供精确的 `rows_before_limit_at_least` 统计值，但代价是必须完整读取 LIMIT 之前的数据。关闭 [#6613](https://github.com/ClickHouse/ClickHouse/issues/6613)。[#25333](https://github.com/ClickHouse/ClickHouse/pull/25333)（[kevin wan](https://github.com/MaxWk)）。
* 支持使用 `s3Cluster` 表函数向 `Distributed` 和 `Replicated` 引擎表执行并行分布式 insert select [#34670](https://github.com/ClickHouse/ClickHouse/issues/34670)。[#39107](https://github.com/ClickHouse/ClickHouse/pull/39107)（[Nikita Mikhaylov](https://github.com/nikitamikhaylov)）。
* 新增控制文本格式结构推断的设置：- `input_format_try_infer_dates`：尝试从字符串推断日期。- `input_format_try_infer_datetimes`：尝试从字符串推断日期时间。- `input_format_try_infer_integers`：尝试推断为 `Int64` 而不是 `Float64`。- `input_format_json_try_infer_numbers_from_strings`：尝试从 JSON 格式中的 JSON 字符串推断数字。[#39186](https://github.com/ClickHouse/ClickHouse/pull/39186)（[Kruglov Pavel](https://github.com/Avogar)）。
* 新增 JSON 格式日志输出选项，便于日志分析工具摄取和查询。[#39277](https://github.com/ClickHouse/ClickHouse/pull/39277)（[Mallik Hassan](https://github.com/SadiHassan)）。
* 新增 `nowInBlock` 函数，允许在长时间运行和持续执行的查询中获取当前时间。关闭 [#39522](https://github.com/ClickHouse/ClickHouse/issues/39522)。注意：不存在 `now64InBlock` 或 `todayInBlock` 函数。[#39533](https://github.com/ClickHouse/ClickHouse/pull/39533)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 支持为 `executable()` 表函数指定设置。[#39681](https://github.com/ClickHouse/ClickHouse/pull/39681)（[Constantine Peresypkin](https://github.com/pkit)）。
* 实现将数据库引擎从 `Ordinary` 自动转换为 `Atomic`。在 `flags` 目录创建空的 `convert_ordinary_to_atomic` 文件后，所有 `Ordinary` 数据库将在服务器下次启动时自动转换。解决 [#39546](https://github.com/ClickHouse/ClickHouse/issues/39546)。[#39933](https://github.com/ClickHouse/ClickHouse/pull/39933)（[Alexander Tokmakov](https://github.com/tavplubix)）。
* 支持 `SELECT ... INTO OUTFILE '...' AND STDOUT`。[#37490](https://github.com/ClickHouse/ClickHouse/issues/37490)。[#39054](https://github.com/ClickHouse/ClickHouse/pull/39054)（[SmitaRKulkarni](https://github.com/SmitaRKulkarni)）。
* 新增格式 `PrettyMonoBlock`、`PrettyNoEscapesMonoBlock`、`PrettyCompactNoEscapes`、`PrettyCompactNoEscapesMonoBlock`、`PrettySpaceNoEscapes`、`PrettySpaceMonoBlock`、`PrettySpaceNoEscapesMonoBlock`。[#39646](https://github.com/ClickHouse/ClickHouse/pull/39646)（[Kruglov Pavel](https://github.com/Avogar)）。

<h4 id="performance-improvement-4">
  性能改进
</h4>

* 改善以内存高效方式合并聚合结果时的内存使用。[#39429](https://github.com/ClickHouse/ClickHouse/pull/39429)（[Nikita Taranov](https://github.com/nickitat)）。
* 新增并发控制逻辑，限制查询创建的并发线程总数。[#37558](https://github.com/ClickHouse/ClickHouse/pull/37558)（[Sergei Trifonov](https://github.com/serxa)）。新增 `concurrent_threads_soft_limit parameter`，通过限制所有查询的线程总数提升高 QPS 场景的性能。[#37285](https://github.com/ClickHouse/ClickHouse/pull/37285)（[Roman Vasin](https://github.com/rvasin)）。
* 为未压缩缓存和标记缓存新增 `SLRU` 缓存策略。（[Kseniia Sumarokova](https://github.com/kssenii)）。[#34651](https://github.com/ClickHouse/ClickHouse/pull/34651)（[alexX512](https://github.com/alexX512)）。将本地缓存功能与缓存算法解耦。[#38048](https://github.com/ClickHouse/ClickHouse/pull/38048)（[Han Shukai](https://github.com/KinderRiven)）。
* Intel® In-Memory Analytics Accelerator（Intel® IAA）是即将推出的 Intel® Xeon® Scalable 处理器（“Sapphire Rapids”）提供的硬件加速器，旨在加快数据压缩/解压和筛选等常见分析操作。ClickHouse 新增 “DeflateQpl” 压缩编解码器，利用 Intel® IAA 卸载技术提供高性能 DEFLATE 实现。该编解码器使用 [Intel® Query Processing Library (QPL)](https://github.com/intel/qpl)，由其抽象对硬件加速器的访问，并在硬件不可用时回退到软件实现。DEFLATE 通常比 ClickHouse 默认的 LZ4 编解码器具有更高压缩率，因此可减少磁盘 I/O 并降低主内存消耗。[#36654](https://github.com/ClickHouse/ClickHouse/pull/36654)（[jasperzhu](https://github.com/jinjunzh)）。[#39494](https://github.com/ClickHouse/ClickHouse/pull/39494)（[Robert Schulze](https://github.com/rschu1ze)）。
* 配合 `ORDER BY` 的有序 `DISTINCT`：根据输入流排序描述推导排序方式；若输入流已排序，则跳过排序。[#38719](https://github.com/ClickHouse/ClickHouse/pull/38719)（[Igor Nikonov](https://github.com/devcrafter)）。显著改善内存使用并缩短查询时间；当 `DISTINCT` 列与 `ORDER BY` 列匹配时，对最终去重使用 `DistinctSortedChunkTransform`，但在 `EXPLAIN PIPELINE` 中将其命名为 `DistinctSortedStreamTransform`，显著降低内存使用；移除 `DistinctSortedChunkTransform` 热循环中不必要的内存分配。[#39432](https://github.com/ClickHouse/ClickHouse/pull/39432)（[Igor Nikonov](https://github.com/devcrafter)）。仅在排序描述适用于 DISTINCT 列时使用 `DistinctSortedTransform`，否则回退到普通 DISTINCT 实现，同时减少 `DistinctSortedTransform` 执行期间的检查。[#39528](https://github.com/ClickHouse/ClickHouse/pull/39528)（[Igor Nikonov](https://github.com/devcrafter)）。修复 `DistinctSortedTransform` 未利用排序的问题：由于 clearing\_columns 检测不正确（始终为空），它从不清空 HashSet，实际上与普通 `DISTINCT`（`DistinctTransform`）一样工作。此修复显著降低内存使用。[#39538](https://github.com/ClickHouse/ClickHouse/pull/39538)（[Igor Nikonov](https://github.com/devcrafter)）。
* 执行 `cluster` 等表函数时，优先使用本地节点获取远程表结构。[#39440](https://github.com/ClickHouse/ClickHouse/pull/39440)（[Mingliang Pan](https://github.com/liangliangpan)）。
* 使用 AVX512VBMI2 压缩存储指令优化按数字列筛选。[#39633](https://github.com/ClickHouse/ClickHouse/pull/39633)（[Guo Wangyang](https://github.com/guowangy)）。在支持 AVX512 VBMI2 的系统上，此 PR 使 SSB 基准测试查询 3.1、3.2、3.3（SF=100）的性能提升约 6%。测试平台为双路 Intel Icelake Xeon 8380。[#40033](https://github.com/ClickHouse/ClickHouse/pull/40033)（[Robert Schulze](https://github.com/rschu1ze)）。
* 优化多线程场景下包含函数表达式的索引分析。[#39812](https://github.com/ClickHouse/ClickHouse/pull/39812)（[Guo Wangyang](https://github.com/guowangy)）。
* 复杂查询优化：未注册任何 UDF 时，不再遍历 AST 查找 UDF。[#40069](https://github.com/ClickHouse/ClickHouse/pull/40069)（[Raúl Marín](https://github.com/Algunenano)）。优化 CurrentMemoryTracker 的分配与释放。[#40078](https://github.com/ClickHouse/ClickHouse/pull/40078)（[Raúl Marín](https://github.com/Algunenano)）。
* 改进 Base58 编码/解码。[#39292](https://github.com/ClickHouse/ClickHouse/pull/39292)（[Andrey Zvonov](https://github.com/zvonand)）。
* 改进 SSE/AVX/AVX512 的字节到位掩码转换。[#39586](https://github.com/ClickHouse/ClickHouse/pull/39586)（[Guo Wangyang](https://github.com/guowangy)）。

<h4 id="improvement-4">
  改进
</h4>

* 规范化 `AggregateFunction` 类型和状态表示，因为 [#35788](https://github.com/ClickHouse/ClickHouse/pull/35788) 等优化会将 `count(not null columns)` 视为 `count()`，可能使分布式解释器产生错误：`Conversion from AggregateFunction(count) to AggregateFunction(count, Int64) is not supported`。[#39420](https://github.com/ClickHouse/ClickHouse/pull/39420)（[Amos Bird](https://github.com/amosbird)）。状态相同的函数可以在物化视图中互换使用。
* 重做并简化 `system.backups` 表，移除 `internal` 列，允许用户设置操作 ID，新增 `num_files`、`uncompressed_size`、`compressed_size`、`start_time`、`end_time` 列。[#39503](https://github.com/ClickHouse/ClickHouse/pull/39503)（[Vitaly Baranov](https://github.com/vitlibar)）。
* 改进 `Replicated` 数据库的 DDL 查询结果表结构（分片名和副本名单独成列，状态更清晰）。- 当 `distributed_ddl_entry_format_version` 设为 3（默认值）时，`CREATE TABLE ... ON CLUSTER` 查询可先在发起端规范化。这意味着，如果发起端不属于查询指定的集群，`ON CLUSTER` 查询可能无法工作。修复 [#37318](https://github.com/ClickHouse/ClickHouse/issues/37318)、[#39500](https://github.com/ClickHouse/ClickHouse/issues/39500)。- 如果数据库为 `Replicated` 且集群名与数据库名相同，则忽略 `ON CLUSTER` 子句。与 [#35570](https://github.com/ClickHouse/ClickHouse/issues/35570) 相关。- `Replicated` 数据库引擎的其他小修复。- 启动 `Replicated` 数据库时检查元数据一致性，如果本地元数据与 Keeper 元数据不匹配，则启动副本恢复。解决 [#24880](https://github.com/ClickHouse/ClickHouse/issues/24880)。[#37198](https://github.com/ClickHouse/ClickHouse/pull/37198)（[Alexander Tokmakov](https://github.com/tavplubix)）。
* 在进度报告（`X-ClickHouse-Summary`）中添加 result\_rows 和 result\_bytes。[#39567](https://github.com/ClickHouse/ClickHouse/pull/39567)（[Raúl Marín](https://github.com/Algunenano)）。
* 改进 MergeTree 的主键分析。[#25563](https://github.com/ClickHouse/ClickHouse/pull/25563)（[Nikolai Kochetov](https://github.com/KochetovNicolai)）。
* `timeSlots` 现在支持 DateTime64；使用 DateTime64 时支持亚秒级持续时间和时间段大小。[#37951](https://github.com/ClickHouse/ClickHouse/pull/37951)（[Andrey Zvonov](https://github.com/zvonand)）。
* 新增与 `EmbeddedRocksDB` 表进行 `LEFT SEMI` 和 `LEFT ANTI` 直接连接的支持。[#38956](https://github.com/ClickHouse/ClickHouse/pull/38956)（[Vladimir C](https://github.com/vdimir)）。
* 为 fsync 操作添加性能事件。[#39179](https://github.com/ClickHouse/ClickHouse/pull/39179)（[Azat Khuzhin](https://github.com/azat)）。
* 为普通函数 `file(path[, default])` 添加第二个参数，在文件不存在时返回该值。[#39218](https://github.com/ClickHouse/ClickHouse/pull/39218)（[Nikolay Degterinsky](https://github.com/evillique)）。
* HTTP 读取的一些小修复，允许响应为 200 OK 时重试部分内容。[#39244](https://github.com/ClickHouse/ClickHouse/pull/39244)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 支持 `CREATE TEMPORARY TABLE ... (<list of columns>) AS ...` 查询。[#39462](https://github.com/ClickHouse/ClickHouse/pull/39462)（[Kruglov Pavel](https://github.com/Avogar)）。
* 在自定义顶级域中支持 `!`/`*`（感叹号/星号），适用于 `cutToFirstSignificantSubdomainCustom()`/`cutToFirstSignificantSubdomainCustomWithWWW()`/`firstSignificantSubdomainCustom()`。[#39496](https://github.com/ClickHouse/ClickHouse/pull/39496)（[Azat Khuzhin](https://github.com/azat)）。
* 新增 NATS TLS 连接支持。实现 [#39525](https://github.com/ClickHouse/ClickHouse/issues/39525)。[#39527](https://github.com/ClickHouse/ClickHouse/pull/39527)（[Constantine Peresypkin](https://github.com/pkit)）。
* `clickhouse-obfuscator`（用于测试和负载生成的数据库混淆工具）新增 `--save` 和 `--load` 参数，以使用预训练模型。关闭 [#39534](https://github.com/ClickHouse/ClickHouse/issues/39534)。[#39541](https://github.com/ClickHouse/ClickHouse/pull/39541)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复重启期间日志轮转行为不正确的问题。[#39558](https://github.com/ClickHouse/ClickHouse/pull/39558)（[Nikolay Degterinsky](https://github.com/evillique)）。
* 修复启用外部聚合时构建聚合投影的问题。因为此情况很少见，且可轻松通过修改设置绕过，因此标记为改进。修复 [#39667](https://github.com/ClickHouse/ClickHouse/issues/39667)。[#39671](https://github.com/ClickHouse/ClickHouse/pull/39671)（[Amos Bird](https://github.com/amosbird)）。
* 允许使用 `Map` 类型参数执行哈希函数。[#39685](https://github.com/ClickHouse/ClickHouse/pull/39685)（[Anton Popov](https://github.com/CurtizJ)）。
* 新增隐藏堆栈跟踪中地址的配置参数。它可能略微改善安全性，但总体上有害，不应使用。[#39690](https://github.com/ClickHouse/ClickHouse/pull/39690)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 更改 AggregateFunctionDistinct 的前缀大小，确保嵌套函数数据的内存区域对齐。[#39696](https://github.com/ClickHouse/ClickHouse/pull/39696)（[Pxl](https://github.com/BiteTheDDDDt)）。
* 正确转义传递给 `clickhouse-diagnostic` 工具的凭据。[#39707](https://github.com/ClickHouse/ClickHouse/pull/39707)（[Dale McDiarmid](https://github.com/gingerwizard)）。
* ClickHouse Keeper 改进：退出时创建快照。可通过 `keeper_server.create_snapshot_on_exit` 配置控制，默认值为 `true`。[#39755](https://github.com/ClickHouse/ClickHouse/pull/39755)（[Antonio Andelic](https://github.com/antonio2368)）。
* 支持对 `row_policy_filter` 和 `additional_filter` 进行主键分析，也有助于修复 [#37454](https://github.com/ClickHouse/ClickHouse/issues/37454) 等问题。[#39826](https://github.com/ClickHouse/ClickHouse/pull/39826)（[Amos Bird](https://github.com/amosbird)）。
* 修复 Play UI 的两个易用性问题：- 由于多余的圆角和边距，在 iPad 上无法像素级准确显示；- 首次查询后不再显示进度。关闭 [#39957](https://github.com/ClickHouse/ClickHouse/issues/39957)。关闭 [#39960](https://github.com/ClickHouse/ClickHouse/issues/39960)。[#39961](https://github.com/ClickHouse/ClickHouse/pull/39961)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* Play UI：添加行号；支持点击选择单元格；为单元格添加滞回处理。[#39962](https://github.com/ClickHouse/ClickHouse/pull/39962)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* Play UI：在 textarea 中识别 Tab 键，同时不破坏 Tab 导航。[#40053](https://github.com/ClickHouse/ClickHouse/pull/40053)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 客户端将显示服务器端耗时，这对比较远程数据中心中 ClickHouse 服务的性能很重要。关闭 [#38070](https://github.com/ClickHouse/ClickHouse/issues/38070)。动机另见 [this](https://github.com/ClickHouse/ClickBench/blob/main/hardware/benchmark-cloud.sh#L37)。[#39968](https://github.com/ClickHouse/ClickHouse/pull/39968)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 新增 `parseDateTime64BestEffortUS`、`parseDateTime64BestEffortUSOrNull`、`parseDateTime64BestEffortUSOrZero` 函数，关闭 [#37492](https://github.com/ClickHouse/ClickHouse/issues/37492)。[#40015](https://github.com/ClickHouse/ClickHouse/pull/40015)（[Tanya Bragin](https://github.com/tbragin)）。
* 扩展 `system.processors_profile_log`，增加输入行数等信息。[#40121](https://github.com/ClickHouse/ClickHouse/pull/40121)（[Amos Bird](https://github.com/amosbird)）。
* 如果可用（自 ClickHouse 22.8 起），`clickhouse-benchmark` 默认显示服务器端时间，以便正确比较云服务性能。可通过新增命令行选项 `--client-side-time` 改变此行为。将 `--randomize` 命令行选项从 `--randomize 1` 改为不带参数的形式。[#40193](https://github.com/ClickHouse/ClickHouse/pull/40193)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 为已设置且达到查询复杂度限制的情况添加计数器（ProfileEvents），分别统计 `overflow_mode` 为 `break` 和 `throw` 的情况。例如，设置 `max_rows_to_read` 和 `read_overflow_mode = 'break'` 后，可以通过 `OverflowBreak` 计数器的值识别不完整结果。[#40205](https://github.com/ClickHouse/ClickHouse/pull/40205)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复发生 “Memory limit exceeded” 错误时的内存统计（此前会将失败的分配也计入内存使用量及峰值）。[#40249](https://github.com/ClickHouse/ClickHouse/pull/40249)（[Azat Khuzhin](https://github.com/azat)）。
* 为文件系统缓存新增指标 `FilesystemCacheSize` 和 `FilesystemCacheElements`。[#40260](https://github.com/ClickHouse/ClickHouse/pull/40260)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 支持 Hadoop 安全 RPC 传输（hadoop.rpc.protection=privacy 和 hadoop.rpc.protection=integrity）。[#39411](https://github.com/ClickHouse/ClickHouse/pull/39411)（[michael1589](https://github.com/michael1589)）。
* 避免使用 multi(Fuzzy)Match(Any|AllIndices|AnyIndex)() 函数时，模式缓存内存消耗持续增长。[#40264](https://github.com/ClickHouse/ClickHouse/pull/40264)（[Robert Schulze](https://github.com/rschu1ze)）。

<h4 id="buildtestingpackaging-improvement-4">
  构建/测试/打包改进
</h4>

* [ClickFiddle](https://fiddle.clickhouse.com/)：一种用于以读写模式测试 ClickHouse 版本的新工具（**Igor Baliuk**）。
* ClickHouse 二进制文件改为自解压形式。[#35775](https://github.com/ClickHouse/ClickHouse/pull/35775)（[Yakov Olkhovskiy, Arthur Filatenkov](https://github.com/yakov-olkhovskiy)）。
* 将 tzdata 更新至 2022b，以支持新的时区变化。参见 [https://github.com/google/cctz/pull/226](https://github.com/google/cctz/pull/226)。智利 2022 年夏令时开始时间从 9 月 4 日推迟至 9 月 11 日。伊朗计划在 2022-09-21 回拨后永久停止使用夏令时。修正 Asia/Tehran 在 1977 年的历史时区信息：伊朗于 1935 年而不是 1946 年采用标准时间；1977 年夏令时从 03-21 23:00 持续至 10-20 24:00；1978 年的转换日期为 03-24 和 08-05，而不是 03-20 和 10-20；1979 年春季转换发生在 05-27，而不是 03-21（[https://data.iana.org/time-zones/tzdb/NEWS](https://data.iana.org/time-zones/tzdb/NEWS)）。（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 此前的软件包将 systemd.service 文件安装到 `/etc`。该目录中的文件被标为 `conf`，不会自动清理或更新。此 PR 清理这些文件。[#39323](https://github.com/ClickHouse/ClickHouse/pull/39323)（[Mikhail f. Shiryaev](https://github.com/Felixoid)）。
* 确保 LSan 有效工作。[#39430](https://github.com/ClickHouse/ClickHouse/pull/39430)（[Azat Khuzhin](https://github.com/azat)）。
* TSAN 在 clang-14 下存在问题（[https://github.com/google/sanitizers/issues/1552](https://github.com/google/sanitizers/issues/1552)、[https://github.com/google/sanitizers/issues/1540](https://github.com/google/sanitizers/issues/1540)），因此这里使用 clang-15 构建 TSAN 二进制文件。[#39450](https://github.com/ClickHouse/ClickHouse/pull/39450)（[Mikhail f. Shiryaev](https://github.com/Felixoid)）。
* 移除将 ClickHouse 工具构建为独立可执行程序的选项。修复 [#37847](https://github.com/ClickHouse/ClickHouse/issues/37847)。[#39520](https://github.com/ClickHouse/ClickHouse/pull/39520)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 为在 s390x（大端架构）上构建做一些准备。[#39627](https://github.com/ClickHouse/ClickHouse/pull/39627)（[Harry Lee](https://github.com/HarryLeeIBM)）。[#39656](https://github.com/ClickHouse/ClickHouse/pull/39656)（[Harry Lee](https://github.com/HarryLeeIBM)）。修复 s390x 的 BitHelpers 字节序问题。[#39656](https://github.com/ClickHouse/ClickHouse/pull/39656)（[Harry Lee](https://github.com/HarryLeeIBM)）。为 s390x 架构（ClickHouse 尚不支持）实现一段 SipHash 相关代码。[#39732](https://github.com/ClickHouse/ClickHouse/pull/39732)（[Harry Lee](https://github.com/HarryLeeIBM)）。修复 s390x 架构（ClickHouse 尚不支持）协调快照代码中的字节序问题。[#39931](https://github.com/ClickHouse/ClickHouse/pull/39931)（[Harry Lee](https://github.com/HarryLeeIBM)）。修复 s390x 架构（ClickHouse 尚不支持）编解码器代码中的字节序问题。[#40008](https://github.com/ClickHouse/ClickHouse/pull/40008)（[Harry Lee](https://github.com/HarryLeeIBM)）。修复 s390x 架构（ClickHouse 尚不支持）ReadHelpers 和 WriteHelpers 读写大端二进制数据的字节序问题。[#40179](https://github.com/ClickHouse/ClickHouse/pull/40179)（[Harry Lee](https://github.com/HarryLeeIBM)）。
* 支持使用 `clang-16`（主干版本）构建。关闭 [#39949](https://github.com/ClickHouse/ClickHouse/issues/39949)。[#40181](https://github.com/ClickHouse/ClickHouse/pull/40181)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 准备在 CI 中运行 RISC-V 64 构建。对应 [#40141](https://github.com/ClickHouse/ClickHouse/issues/40141)。[#40197](https://github.com/ClickHouse/ClickHouse/pull/40197)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 简化函数注册宏接口（`FUNCTION_REGISTER*`），免去在 registerFunctions.cpp 中添加并调用 extern 函数的步骤，也使新函数的增量构建更快。[#38615](https://github.com/ClickHouse/ClickHouse/pull/38615)（[Li Yin](https://github.com/liyinsg)）。
* Docker：镜像中的 entrypoint.sh 现在会为多磁盘配置中发现的所有文件夹创建目录并执行 chown [#17717](https://github.com/ClickHouse/ClickHouse/issues/17717)。[#39121](https://github.com/ClickHouse/ClickHouse/pull/39121)（[Nikita Mikhaylov](https://github.com/nikitamikhaylov)）。

<h4 id="bug-fix-1">
  错误修复
</h4>

* 修复 `CapnProto` 输入格式中可能发生的段错误。此问题由 *kiojj* 通过 ClickHouse 漏洞赏金项目 [program](https://github.com/ClickHouse/ClickHouse/issues/38986) 发现并报告。[#40241](https://github.com/ClickHouse/ClickHouse/pull/40241)（[Kruglov Pavel](https://github.com/Avogar)）。
* 修复数组下标运算符在极罕见情况下行为不正确的问题。关闭 [#28720](https://github.com/ClickHouse/ClickHouse/issues/28720)。[#40185](https://github.com/ClickHouse/ClickHouse/pull/40185)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复加密函数参数检查不足的问题（由查询模糊测试发现）。关闭 [#39987](https://github.com/ClickHouse/ClickHouse/issues/39987)。[#40194](https://github.com/ClickHouse/ClickHouse/pull/40194)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 `IN` 运算符与包含多列的 `ENGINE = Set` 表一起使用时，列顺序可能不正确的问题。修复 [#13014](https://github.com/ClickHouse/ClickHouse/issues/13014)。[#40225](https://github.com/ClickHouse/ClickHouse/pull/40225)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复从加密磁盘读取时的定位。此 PR 修复 [#38381](https://github.com/ClickHouse/ClickHouse/issues/38381)。[#39687](https://github.com/ClickHouse/ClickHouse/pull/39687)（[Vitaly Baranov](https://github.com/vitlibar)）。
* 修复连接计划中的重复列，最终解决 [#26809](https://github.com/ClickHouse/ClickHouse/issues/26809)。[#40009](https://github.com/ClickHouse/ClickHouse/pull/40009)（[Vladimir C](https://github.com/vdimir)）。
* 修复 SELECT 的 ORDER BY WITH FILL 使用不同日期/时间类型时查询挂起的问题。[#37849](https://github.com/ClickHouse/ClickHouse/pull/37849)（[Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)）。
* 修复与投影 ORDER BY 匹配的 ORDER BY（此前会直接返回未排序结果）。[#38725](https://github.com/ClickHouse/ClickHouse/pull/38725)（[Azat Khuzhin](https://github.com/azat)）。
* 如果 GROUP BY 语句中的函数遮蔽了表中的某列或表达式，则不优化这些函数。修复 [#37032](https://github.com/ClickHouse/ClickHouse/issues/37032)。[#39103](https://github.com/ClickHouse/ClickHouse/pull/39103)（[Anton Kozlov](https://github.com/tonickkozlov)）。
* 修复 RENAME TABLE 后日志中的表名错误。修复 [#38018](https://github.com/ClickHouse/ClickHouse/issues/38018)。[#39227](https://github.com/ClickHouse/ClickHouse/pull/39227)（[Amos Bird](https://github.com/amosbird)）。
* 修复优化查询时进行列裁剪情况下的位置参数。关闭 [#38433](https://github.com/ClickHouse/ClickHouse/issues/38433)。[#39293](https://github.com/ClickHouse/ClickHouse/pull/39293)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复 Protobuf/CapnProto 格式包含空消息时，结构推断允许创建空 `Tuple` 类型列的问题。关闭 [#39051](https://github.com/ClickHouse/ClickHouse/issues/39051)。新增两项设置 `input_format_{protobuf/capnproto}_skip_fields_with_unsupported_types_in_schema_inference`，允许在 Protobuf 和 CapnProto 结构推断时跳过不受支持类型的字段。[#39357](https://github.com/ClickHouse/ClickHouse/pull/39357)（[Kruglov Pavel](https://github.com/Avogar)）。
* （Window View 是实验性功能。）修复 `CREATE WINDOW VIEW .. ON CLUSTER ... INNER` 的段错误。关闭 [#39363](https://github.com/ClickHouse/ClickHouse/issues/39363)。[#39384](https://github.com/ClickHouse/ClickHouse/pull/39384)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复取消向函数插入时 WriteBuffer 的收尾操作（此前版本可能导致 std::terminate）。[#39458](https://github.com/ClickHouse/ClickHouse/pull/39458)（[Kruglov Pavel](https://github.com/Avogar)）。
* 修复稀疏序列化中 `Object` 类型列的存储。[#39464](https://github.com/ClickHouse/ClickHouse/pull/39464)（[Anton Popov](https://github.com/CurtizJ)）。
* 修复使用投影时可能出现的 “Not found column in block” 异常。关闭 [#39469](https://github.com/ClickHouse/ClickHouse/issues/39469)。[#39470](https://github.com/ClickHouse/ClickHouse/pull/39470)（[小路](https://github.com/nicelulu)）。
* 修复物化视图 DROP 与 INSERT 竞争时的异常。[#39477](https://github.com/ClickHouse/ClickHouse/pull/39477)（[Azat Khuzhin](https://github.com/azat)）。
* Apache Avro 库错误：修复 Avro 格式的数据竞争及可能的堆缓冲区溢出。关闭 [#39094](https://github.com/ClickHouse/ClickHouse/issues/39094)。关闭 [#33652](https://github.com/ClickHouse/ClickHouse/issues/33652)。[#39498](https://github.com/ClickHouse/ClickHouse/pull/39498)（[Kruglov Pavel](https://github.com/Avogar)）。
* 修复启用 `O_DIRECT`（由 `min_bytes_to_use_direct_io` 设置启用）时，异步读取（`local_filesystem_read_method='pread_threadpool'`）中的罕见错误。[#39506](https://github.com/ClickHouse/ClickHouse/pull/39506)（[Anton Popov](https://github.com/CurtizJ)）。
* （仅限 FreeBSD。）修复在 FreeBSD 启动 ClickHouse 时出现的 “Code: 49. DB::Exception: FunctionFactory: the function name '' is not unique. (LOGICAL\_ERROR)” 错误。[#39551](https://github.com/ClickHouse/ClickHouse/pull/39551)（[Alexander Gololobov](https://github.com/davenger)）。
* 修复最近为 `splitByChar` 引入的 “maxsplit” 参数工作不正确的问题。[#39552](https://github.com/ClickHouse/ClickHouse/pull/39552)（[filimonov](https://github.com/filimonov)）。
* 修复启用 `enable_optimize_predicate_expression` 时 ASOF JOIN 的错误，关闭 [#37813](https://github.com/ClickHouse/ClickHouse/issues/37813)。[#39556](https://github.com/ClickHouse/ClickHouse/pull/39556)（[Vladimir C](https://github.com/vdimir)）。
* 修复使用 `ON CLUSTER` 或 `Replicated` 数据库及 `ReplicatedMergeTree` 时的 `CREATE/DROP INDEX` 查询。此前会在所有副本上执行，导致错误或 DDL 队列卡住。修复 [#39511](https://github.com/ClickHouse/ClickHouse/issues/39511)。[#39565](https://github.com/ClickHouse/ClickHouse/pull/39565)（[Alexander Tokmakov](https://github.com/tavplubix)）。
* 修复连接下推时的 “column not found” 错误，关闭 [#39505](https://github.com/ClickHouse/ClickHouse/issues/39505)。[#39575](https://github.com/ClickHouse/ClickHouse/pull/39575)（[Vladimir C](https://github.com/vdimir)）。
* 修复错误的 `REGEXP_REPLACE` 别名。修复 [https://github.com/ClickHouse/ClickBench/issues/9](https://github.com/ClickHouse/ClickBench/issues/9)。[#39592](https://github.com/ClickHouse/ClickHouse/pull/39592)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 将指数衰减窗口函数的参考起点修正为窗口中的最后一个值。此前按 `exp((t - curr_row_t) / decay_length)` 计算衰减，当窗口右边界不是 `CURRENT ROW` 时不正确；现改为 `exp((t - last_row_t) / decay_length)`。对于 `ROWS BETWEEN (smth) AND CURRENT ROW` 窗口，结果不变。[#39593](https://github.com/ClickHouse/ClickHouse/pull/39593)（[Vladimir Chebotaryov](https://github.com/quickhouse)）。
* 修复 Decimal 除法溢出，可根据操作数的小数位数检测此问题。[#39600](https://github.com/ClickHouse/ClickHouse/pull/39600)（[Andrey Zvonov](https://github.com/zvonand)）。
* 修复 `output_format_arrow_string_as_string` 与 `output_format_arrow_low_cardinality_as_dictionary` 设置组合使用时的问题。关闭 [#39624](https://github.com/ClickHouse/ClickHouse/issues/39624)。[#39647](https://github.com/ClickHouse/ClickHouse/pull/39647)（[Kruglov Pavel](https://github.com/Avogar)）。
* 修复分布式表读取时默认数据库解析中的错误。[#39674](https://github.com/ClickHouse/ClickHouse/pull/39674)（[Anton Kozlov](https://github.com/tonickkozlov)）。
* （仅限已过时的 Ordinary 数据库。）如果使用 mmap I/O 缓存、数据库引擎为 Ordinary，且新建表与已删除表同名，SELECT 可能读取已删除表的数据。现已修复。[#39708](https://github.com/ClickHouse/ClickHouse/pull/39708)（[Alexander Tokmakov](https://github.com/tavplubix)）。
* 修复可能出现的错误 `Invalid column type for ColumnUnique::insertRangeFrom. Expected String, got ColumnLowCardinality`。修复 [#38460](https://github.com/ClickHouse/ClickHouse/issues/38460)。[#39716](https://github.com/ClickHouse/ClickHouse/pull/39716)（[Arthur Passos](https://github.com/arthurpassos)）。
* JSON 格式 `meta` 部分的字段名被错误地转义了两次。关闭 [#39693](https://github.com/ClickHouse/ClickHouse/issues/39693)。[#39747](https://github.com/ClickHouse/ClickHouse/pull/39747)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复使用元组和 `IN` 运算符时的索引分析错误，该错误可能导致查询结果不正确。[#39752](https://github.com/ClickHouse/ClickHouse/pull/39752)（[Anton Popov](https://github.com/CurtizJ)）。
* 修复 `EmbeddedRocksDB` 表使用参数按键筛选的问题。[#39757](https://github.com/ClickHouse/ClickHouse/pull/39757)（[Antonio Andelic](https://github.com/antonio2368)）。
* 修复 ARRAY JOIN 优化导致的 `Invalid number of columns in chunk pushed to OutputPort` 错误。修复 [#39164](https://github.com/ClickHouse/ClickHouse/issues/39164)。[#39799](https://github.com/ClickHouse/ClickHouse/pull/39799)（[Nikolai Kochetov](https://github.com/KochetovNicolai)）。
* 针对 Linux 内核错误的规避措施：修复 `local_filesystem_read_method=pread_threadpool` 下的 `CANNOT_READ_ALL_DATA` 异常。根据 [man](https://manpages.debian.org/testing/manpages-dev/preadv2.2.en.html#BUGS)，该错误仅影响 Linux 内核 5.9 和 5.10。[#39800](https://github.com/ClickHouse/ClickHouse/pull/39800)（[Anton Popov](https://github.com/CurtizJ)）。
* （仅限 NFS。）修复启用 root-squash 的卷上 NFS mkdir 失效的问题。[#39898](https://github.com/ClickHouse/ClickHouse/pull/39898)（[Constantine Peresypkin](https://github.com/pkit)）。
* 在 DETACH/DROP 时从 Prometheus 指标中移除字典。[#39926](https://github.com/ClickHouse/ClickHouse/pull/39926)（[Azat Khuzhin](https://github.com/azat)）。
* 修复带虚拟列的 StorageFile 读取。关闭 [#39907](https://github.com/ClickHouse/ClickHouse/issues/39907)。[#39943](https://github.com/ClickHouse/ClickHouse/pull/39943)（[flynn](https://github.com/ucasfl)）。
* 修复获取数据片段时内存使用过大的问题。修复 [#39915](https://github.com/ClickHouse/ClickHouse/issues/39915)。[#39990](https://github.com/ClickHouse/ClickHouse/pull/39990)（[Nikolai Kochetov](https://github.com/KochetovNicolai)）。
* （实验性功能。）修复 `hashId` 崩溃以及未使用盐参数的问题。[#40002](https://github.com/ClickHouse/ClickHouse/pull/40002)（[Raúl Marín](https://github.com/Algunenano)）。
* 使用特定组合的常量与非常量列时，`EXCEPT` 和 `INTERSECT` 运算符可能导致崩溃。[#40020](https://github.com/ClickHouse/ClickHouse/pull/40020)（[Duc Canh Le](https://github.com/canhld94)）。
* 修复 INSERT 过慢或合并/变更操作耗时过长时出现的 “Part directory doesn't exist” 和 “`tmp_<part_name>` ... No such file or directory” 错误。同时修复此前获取数据片段失败但 `tmp-fetch_<part_name>` 目录未清理时，部分复制队列条目可能卡住且日志没有任何错误或警告的问题。[#40031](https://github.com/ClickHouse/ClickHouse/pull/40031)（[Alexander Tokmakov](https://github.com/tavplubix)）。
* 修复 `Values` 格式解析元组数组的罕见情况。[#40034](https://github.com/ClickHouse/ClickHouse/pull/40034)（[Anton Popov](https://github.com/CurtizJ)）。
* 修复 ArrowColumn 格式的 Dictionary(X) 和 Dictionary(Nullable(X)) 分别转换为 ClickHouse LowCardinality(X) 和 LowCardinality(Nullable(X)) 的问题。[#40037](https://github.com/ClickHouse/ClickHouse/pull/40037)（[Arthur Passos](https://github.com/arthurpassos)）。
* 修复任务调度失败时写入 S3 可能发生的死锁。[#40070](https://github.com/ClickHouse/ClickHouse/pull/40070)（[Maksim Kita](https://github.com/kitaisreal)）。
* 修复 collectFilesToSkip() 中的错误，为需要重新计算的索引添加正确文件扩展名（.idx 或 idx2），避免创建错误的硬链接。修复 [#39896](https://github.com/ClickHouse/ClickHouse/issues/39896)。[#40095](https://github.com/ClickHouse/ClickHouse/pull/40095)（[Jianmei Zhang](https://github.com/zhangjmruc)）。
* 修复反向 DNS 解析。[#40134](https://github.com/ClickHouse/ClickHouse/pull/40134)（[Arthur Passos](https://github.com/arthurpassos)）。
* 修复 `arrayDifference` 对 \`Array(UInt32) 返回非预期结果的问题。[#40211](https://github.com/ClickHouse/ClickHouse/pull/40211)（[Duc Canh Le](https://github.com/canhld94)）。
