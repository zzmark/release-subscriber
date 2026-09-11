<h3 id="234">
  <a id="234" /> ClickHouse 23.4 版本, 2023-04-26. [演示文稿](https://presentations.clickhouse.com/2023-release-23.4/), [视频](https://www.youtube.com/watch?v=4rrf6bk_mOg)
</h3>

<Frame>
  <iframe src="https://www.youtube.com/embed/4rrf6bk_mOg" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
</Frame>

<h4 id="backward-incompatible-change-7">
  向后不兼容变更
</h4>

* formatDateTime() 函数中的格式符 '%M' 现在输出月份名称而非分钟，使其行为与 MySQL 一致。可通过设置 “formatdatetime\_parsedatetime\_m\_is\_month\_name = 0” 恢复此前行为。 [#47246](https://github.com/ClickHouse/ClickHouse/pull/47246) ([Robert Schulze](https://github.com/rschu1ze)).
* 此变更仅影响虚拟文件系统缓存：如果其配置中的 `path` 非空且不是绝对路径，则将其放在 `<clickhouse server data directory>/caches/<path_from_cache_config>` 下。 [#48784](https://github.com/ClickHouse/ClickHouse/pull/48784) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 现在会拒绝主索引、二级索引及排序键中的重复表达式。可使用 `allow_suspicious_indices` 设置禁用此行为。 [#48536](https://github.com/ClickHouse/ClickHouse/pull/48536) ([凌涛](https://github.com/lingtaolf)).

<h4 id="new-feature-8">
  新功能
</h4>

* 支持新的聚合函数 `quantileGK`/`quantilesGK`，类似于 Spark 中的 [approx\_percentile](https://spark.apache.org/docs/latest/api/sql/index.html#approx_percentile)。Greenwald-Khanna 算法参见 [http://infolab.stanford.edu/\~datar/courses/cs361a/papers/quantiles.pdf](http://infolab.stanford.edu/~datar/courses/cs361a/papers/quantiles.pdf)。 [#46428](https://github.com/ClickHouse/ClickHouse/pull/46428) ([李扬](https://github.com/taiyang-li)).
* 新增 `SHOW COLUMNS` 语句，展示从 system.columns 提取的精简信息。 [#48017](https://github.com/ClickHouse/ClickHouse/pull/48017) ([Robert Schulze](https://github.com/rschu1ze)).
* 为 `SYSTEM SYNC REPLICA` 查询新增 `LIGHTWEIGHT` 和 `PULL` 修饰符。`LIGHTWEIGHT` 版本仅等待拉取和删除范围操作（忽略合并与变更操作）；`PULL` 版本从 ZooKeeper 拉取新条目，但不等待执行完成。修复 [#47794](https://github.com/ClickHouse/ClickHouse/issues/47794)。 [#48085](https://github.com/ClickHouse/ClickHouse/pull/48085) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 新增 `kafkaMurmurHash` 函数，以兼容 Kafka DefaultPartitioner。关闭 [#47834](https://github.com/ClickHouse/ClickHouse/issues/47834)。 [#48185](https://github.com/ClickHouse/ClickHouse/pull/48185) ([Nikolay Degterinsky](https://github.com/evillique)).
* 允许使用 `GRANT CURRENT GRANTS`，方便地创建与当前用户具有相同授权的用户。 [#48262](https://github.com/ClickHouse/ClickHouse/pull/48262) ([pufit](https://github.com/pufit)).
* 新增统计聚合函数 `kolmogorovSmirnovTest`。关闭 [#48228](https://github.com/ClickHouse/ClickHouse/issues/48228)。 [#48325](https://github.com/ClickHouse/ClickHouse/pull/48325) ([FFFFFFFHHHHHHH](https://github.com/FFFFFFFHHHHHHH)).
* 为 `system.replicas` 表新增 `lost_part_count` 列，显示对应表丢失的数据片段总数。该值存储在 ZooKeeper 中，可代替不持久保存的 `ReplicatedDataLoss` 性能事件用于监控。 [#48526](https://github.com/ClickHouse/ClickHouse/pull/48526) ([Sergei Trifonov](https://github.com/serxa)).
* 新增 `soundex` 函数以提供兼容性。关闭 [#39880](https://github.com/ClickHouse/ClickHouse/issues/39880)。 [#48567](https://github.com/ClickHouse/ClickHouse/pull/48567) ([FriendLey](https://github.com/FriendLey)).
* JSONExtract 支持 `Map` 类型。 [#48629](https://github.com/ClickHouse/ClickHouse/pull/48629) ([李扬](https://github.com/taiyang-li)).
* 新增 `PrettyJSONEachRow` 格式，输出使用换行分隔、4 个空格缩进的美化 JSON。 [#48898](https://github.com/ClickHouse/ClickHouse/pull/48898) ([Kruglov Pavel](https://github.com/Avogar)).
* 新增 `ParquetMetadata` 输入格式，用于读取 Parquet 文件元数据。 [#48911](https://github.com/ClickHouse/ClickHouse/pull/48911) ([Kruglov Pavel](https://github.com/Avogar)).
* 新增 `extractKeyValuePairs` 函数，从字符串中提取键值对。输入字符串可能包含杂项内容（例如日志文件，无需完全符合键值对格式），算法会查找与函数参数匹配的键值对。目前函数接受以下参数：`data_column`（必填）、`key_value_pair_delimiter`（默认为 `:`）、`pair_delimiters`（默认为 `\space \, \;`）和 `quoting_character`（默认为双引号）。 [#43606](https://github.com/ClickHouse/ClickHouse/pull/43606) ([Arthur Passos](https://github.com/arthurpassos)).
* replaceOne()、replaceAll()、replaceRegexpOne() 和 replaceRegexpAll() 函数现在允许使用非常量的匹配模式与替换参数。 [#46589](https://github.com/ClickHouse/ClickHouse/pull/46589) ([Robert Schulze](https://github.com/rschu1ze)).
* 新增处理 `Map` 类型列的函数：`mapConcat`、`mapSort`、`mapExists`。 [#48071](https://github.com/ClickHouse/ClickHouse/pull/48071) ([Anton Popov](https://github.com/CurtizJ)).

<h4 id="performance-improvement-8">
  性能改进
</h4>

* 现在读取 `Parquet` 格式文件的速度显著提升。IO 和解码并行执行（由 `max_threads` 设置控制），且仅读取所需的数据范围。 [#47964](https://github.com/ClickHouse/ClickHouse/pull/47964) ([Michael Kolupaev](https://github.com/al13n321)).
* 如果执行包含 IN 子查询的变更操作，例如 `ALTER TABLE t UPDATE col='new value' WHERE id IN (SELECT id FROM huge_table)`，且表 `t` 包含多个数据片段，就会针对每个数据片段在内存中构建子查询 `SELECT id FROM huge_table` 的集合。数据片段很多时，这可能消耗大量内存（甚至导致 OOM）和 CPU。解决办法是引入一个短期缓存，保存变更任务正在构建的集合。同一变更操作的其他任务并发执行时，可以在缓存中查找该集合，等待构建完成后复用。 [#46835](https://github.com/ClickHouse/ClickHouse/pull/46835) ([Alexander Gololobov](https://github.com/davenger)).
* 应用 `ALTER TABLE` 查询时，仅在必要时检查依赖关系。 [#48062](https://github.com/ClickHouse/ClickHouse/pull/48062) ([Raúl Marín](https://github.com/Algunenano)).
* 优化 `mapUpdate` 函数。 [#48118](https://github.com/ClickHouse/ClickHouse/pull/48118) ([Anton Popov](https://github.com/CurtizJ)).
* 现在显式向本地副本发送内部查询，并通过回环接口接收数据。并行副本不遵循 `prefer_localhost_replica` 设置。这既有利于调度，也使代码更清晰：发起节点仅负责协调读取过程和合并结果，在所有次级查询读取数据时持续响应请求。注意：使用回环接口的性能并不算好，但不这样做可能使部分副本长期拿不到任务，导致查询更慢，也无法利用全部可用资源。协调器的初始化现在进一步延迟：所有传入请求都包含读取算法信息，首个请求到达时便用它初始化协调器。如果某个副本决定采用不同算法读取，就会抛出异常并中止查询。 [#48246](https://github.com/ClickHouse/ClickHouse/pull/48246) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* 当带子查询的 `IN` 子句右侧集合仅用于分析数据跳过索引，而这些索引已由设置禁用（`use_skip_indexes=0`）时，不构建该集合。此前这可能影响查询性能。 [#48299](https://github.com/ClickHouse/ClickHouse/pull/48299) ([Anton Popov](https://github.com/CurtizJ)).
* 从 `FROM file(...)` 读取后立即并行处理查询。与 [#38755](https://github.com/ClickHouse/ClickHouse/issues/38755) 相关。从任意数据源读取后都立即并行处理查询，主要影响简单或外部存储，例如 `url`、`file` 表函数。 [#48525](https://github.com/ClickHouse/ClickHouse/pull/48525) ([Igor Nikonov](https://github.com/devcrafter)). [#48727](https://github.com/ClickHouse/ClickHouse/pull/48727) ([Igor Nikonov](https://github.com/devcrafter))。此行为由默认未启用的 `parallelize_output_from_storages` 设置控制。
* 降低 ThreadPool 互斥锁竞争，可能提升大量小任务的处理性能。 [#48750](https://github.com/ClickHouse/ClickHouse/pull/48750) ([Sergei Trifonov](https://github.com/serxa)).
* 减少多个 `ALTER DELETE` 变更操作的内存使用。 [#48522](https://github.com/ClickHouse/ClickHouse/pull/48522) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 启用 `skip_unavailable_shards` 设置时，移除多余的连接尝试。 [#48771](https://github.com/ClickHouse/ClickHouse/pull/48771) ([Azat Khuzhin](https://github.com/azat)).

<h4 id="experimental-feature-5">
  实验性功能
</h4>

* 查询缓存中的条目现在会合并至 max\_block\_size 并压缩。 [#45912](https://github.com/ClickHouse/ClickHouse/pull/45912) ([Robert Schulze](https://github.com/rschu1ze)).
* 现在可以为查询缓存定义按用户划分的配额。 [#48284](https://github.com/ClickHouse/ClickHouse/pull/48284) ([Robert Schulze](https://github.com/rschu1ze)).
* 针对并行副本的若干修复。 [#48433](https://github.com/ClickHouse/ClickHouse/pull/48433) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* 在加密磁盘上实现零复制机制（实验性功能）。 [#48741](https://github.com/ClickHouse/ClickHouse/pull/48741) ([Vitaly Baranov](https://github.com/vitlibar)).

<h4 id="improvement-8">
  改进
</h4>

* 将 `connect_timeout_with_failover_ms` 默认值提高到 1000 毫秒（因为 [https://github.com/ClickHouse/ClickHouse/pull/47229](https://github.com/ClickHouse/ClickHouse/pull/47229) 新增了异步连接）。关闭 [#5188](https://github.com/ClickHouse/ClickHouse/issues/5188)。 [#49009](https://github.com/ClickHouse/ClickHouse/pull/49009) ([Kruglov Pavel](https://github.com/Avogar)).
* 多项数据湖改进：- 使 `Iceberg` 能处理未分区数据。- 支持 `Iceberg` 格式 v2（此前仅支持 v1）。- 支持读取 `DeltaLake`/`Hudi` 的分区数据。- 利用 Delta 检查点文件加快 `DeltaLake` 元数据读取。- 修复 `Hudi` 的错误读取：此前会错误选择要读取的数据，因此只能正确读取小表。- 使这些引擎能够获取数据更新（此前状态在创建表时便已固定）。- 使用 Spark 为 `Iceberg`/`DeltaLake`/`Hudi` 建立完善测试。 [#47307](https://github.com/ClickHouse/ClickHouse/pull/47307) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 新增异步套接字连接与写入，使跨分片的连接创建以及查询/外部表发送异步执行。使用纤程重构代码。关闭 [#46931](https://github.com/ClickHouse/ClickHouse/issues/46931)。此 PR 之后可以提高 `connect_timeout_with_failover_ms` 的默认值（[https://github.com/ClickHouse/ClickHouse/issues/5188](https://github.com/ClickHouse/ClickHouse/issues/5188)）。 [#47229](https://github.com/ClickHouse/ClickHouse/pull/47229) ([Kruglov Pavel](https://github.com/Avogar)).
* 支持使用 `keeper`/`keeper_server` 配置节代替 `zookeeper`。关闭 [#34766](https://github.com/ClickHouse/ClickHouse/issues/34766)、[#34767](https://github.com/ClickHouse/ClickHouse/issues/34767)。 [#35113](https://github.com/ClickHouse/ClickHouse/pull/35113) ([李扬](https://github.com/taiyang-li)).
* 可以在 named\_collections 中为使用 ClickHouse 表数据源的字典设置 *secure* 标志。解决 [#38450](https://github.com/ClickHouse/ClickHouse/issues/38450)。 [#46323](https://github.com/ClickHouse/ClickHouse/pull/46323) ([Ilya Golshtein](https://github.com/ilejn)).
* `bitCount` 函数支持 `FixedString` 和 `String` 数据类型。 [#49044](https://github.com/ClickHouse/ClickHouse/pull/49044) ([flynn](https://github.com/ucasfl)).
* 为 Backup 查询的所有 \[Zoo]Keeper 操作新增可配置重试。 [#47224](https://github.com/ClickHouse/ClickHouse/pull/47224) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* S3 默认启用 `use_environment_credentials`，从而默认构建完整的凭据提供程序链。 [#47397](https://github.com/ClickHouse/ClickHouse/pull/47397) ([Antonio Andelic](https://github.com/antonio2368)).
* 目前 JSON\_VALUE 函数类似于 Spark 的 get\_json\_object 函数，支持通过 '\$.key' 这样的路径获取 JSON 字符串中的值，但仍存在差异：1. 路径不存在时，Spark 的 get\_json\_object 返回 null，而 JSON\_VALUE 返回空字符串；2. Spark 的 get\_json\_object 能返回 JSON 对象/数组等复杂类型值，而 JSON\_VALUE 返回空字符串。 [#47494](https://github.com/ClickHouse/ClickHouse/pull/47494) ([KevinyhZou](https://github.com/KevinyhZou)).
* 对于 `use_structure_from_insertion_table_in_table_functions`，更灵活地将目标插入表结构传递给表函数。修复名称映射和虚拟列使用中的问题，不再需要 'auto' 设置。 [#47962](https://github.com/ClickHouse/ClickHouse/pull/47962) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* 查询已被终止或超出限制时，不再继续重试连接 Keeper。 [#47985](https://github.com/ClickHouse/ClickHouse/pull/47985) ([Raúl Marín](https://github.com/Algunenano)).
* 支持 `BSONEachRow` 的 Enum 输入/输出，允许所有 Map 键类型，并避免输出时的额外计算。 [#48122](https://github.com/ClickHouse/ClickHouse/pull/48122) ([Kruglov Pavel](https://github.com/Avogar)).
* 在 `ORC`/`Arrow`/`Parquet` 格式中支持更多 ClickHouse 类型：Enum(8|16)、(U)Int(128|256)、Decimal256（用于 ORC）；允许从 Int32 值读取 IPv4（ORC 将 IPv4 输出为 Int32，而此前无法将其读回）；修复 `ORC` 从二进制数据读取 Nullable(IPv6) 的问题。 [#48126](https://github.com/ClickHouse/ClickHouse/pull/48126) ([Kruglov Pavel](https://github.com/Avogar)).
* 为 `system.storage_policies` 表新增 `perform_ttl_move_on_insert`、`load_balancing` 列，并将 `volume_type` 列类型改为 `Enum8`。 [#48167](https://github.com/ClickHouse/ClickHouse/pull/48167) ([lizhuoyu5](https://github.com/lzydmxy)).
* 新增 `BACKUP ALL` 命令，备份所有表和数据库，包括临时表和系统表。 [#48189](https://github.com/ClickHouse/ClickHouse/pull/48189) ([Vitaly Baranov](https://github.com/vitlibar)).
* mapFromArrays 函数支持 `Map` 类型输入。 [#48207](https://github.com/ClickHouse/ClickHouse/pull/48207) ([李扬](https://github.com/taiyang-li)).
* 部分 SHOW PROCESSLIST 的输出现在会排序。 [#48241](https://github.com/ClickHouse/ClickHouse/pull/48241) ([Robert Schulze](https://github.com/rschu1ze)).
* 支持按查询/服务器对远程 IO、本地 IO 和备份限速（服务器设置：`max_remote_read_network_bandwidth_for_server`、`max_remote_write_network_bandwidth_for_server`、`max_local_read_bandwidth_for_server`、`max_local_write_bandwidth_for_server`、`max_backup_bandwidth_for_server`；查询设置：`max_remote_read_network_bandwidth`、`max_remote_write_network_bandwidth`、`max_local_read_bandwidth`、`max_local_write_bandwidth`、`max_backup_bandwidth`）。 [#48242](https://github.com/ClickHouse/ClickHouse/pull/48242) ([Azat Khuzhin](https://github.com/azat)).
* 在 `CapnProto` 格式中支持更多类型：Map、(U)Int(128|256)、Decimal(128|256)。允许在输入/输出期间进行整数转换。 [#48257](https://github.com/ClickHouse/ClickHouse/pull/48257) ([Kruglov Pavel](https://github.com/Avogar)).
* 正常行为不再抛出 CURRENT\_WRITE\_BUFFER\_IS\_EXHAUSTED。 [#48288](https://github.com/ClickHouse/ClickHouse/pull/48288) ([Raúl Marín](https://github.com/Algunenano)).
* 新增 `keeper_map_strict_mode` 设置，为 `KeeperMap` 表上的操作提供额外保证。 [#48293](https://github.com/ClickHouse/ClickHouse/pull/48293) ([Antonio Andelic](https://github.com/antonio2368)).
* 检查简单字典的主键类型是否为原生无符号整数类型。新增 `check_dictionary_primary_key ` 设置以提供兼容性（设置 `check_dictionary_primary_key =false` 可禁用检查）。 [#48335](https://github.com/ClickHouse/ClickHouse/pull/48335) ([lizhuoyu5](https://github.com/lzydmxy)).
* 不复制 `KeeperMap` 的变更操作，因为没有必要。 [#48354](https://github.com/ClickHouse/ClickHouse/pull/48354) ([Antonio Andelic](https://github.com/antonio2368)).
* 允许在 Protobuf 格式中将未命名元组作为嵌套 Message 读写。元组元素与 Message 字段按位置匹配。 [#48390](https://github.com/ClickHouse/ClickHouse/pull/48390) ([Kruglov Pavel](https://github.com/Avogar)).
* 在新规划器中支持 `additional_table_filters` 和 `additional_result_filter` 设置，并为 `additional_result_filter` 添加文档条目。 [#48405](https://github.com/ClickHouse/ClickHouse/pull/48405) ([Dmitry Novik](https://github.com/novikd)).
* `parseDateTime` 现在能识别格式字符串 '%f'（小数秒）。 [#48420](https://github.com/ClickHouse/ClickHouse/pull/48420) ([Robert Schulze](https://github.com/rschu1ze)).
* formatDateTime() 中的格式字符串 "%f" 现在在格式化值不含小数秒时输出 "000000"；可通过设置 “formatdatetime\_f\_prints\_single\_zero = 1” 恢复此前输出单个零的行为。 [#48422](https://github.com/ClickHouse/ClickHouse/pull/48422) ([Robert Schulze](https://github.com/rschu1ze)).
* 不复制 KeeperMap 的 DELETE 和 TRUNCATE。 [#48434](https://github.com/ClickHouse/ClickHouse/pull/48434) ([Antonio Andelic](https://github.com/antonio2368)).
* generateRandom 函数生成有效的 Decimal 和 Bool 值。 [#48436](https://github.com/ClickHouse/ClickHouse/pull/48436) ([Kruglov Pavel](https://github.com/Avogar)).
* 允许 SELECT 查询表达式列表末尾带逗号，例如 `SELECT a, b, c, FROM table`。关闭 [#37802](https://github.com/ClickHouse/ClickHouse/issues/37802)。 [#48438](https://github.com/ClickHouse/ClickHouse/pull/48438) ([Nikolay Degterinsky](https://github.com/evillique)).
* 使用客户端参数 `--user` 和 `--password` 覆盖环境变量 `CLICKHOUSE_USER` 和 `CLICKHOUSE_PASSWORD`。关闭 [#38909](https://github.com/ClickHouse/ClickHouse/issues/38909)。 [#48440](https://github.com/ClickHouse/ClickHouse/pull/48440) ([Nikolay Degterinsky](https://github.com/evillique)).
* 加载 `MergeTree` 表数据片段时，遇到可重试错误便进行重试。 [#48442](https://github.com/ClickHouse/ClickHouse/pull/48442) ([Anton Popov](https://github.com/CurtizJ)).
* 为 `arrayMin`、`arrayMax`、`arrayDifference` 函数新增 `Date`、`Date32`、`DateTime`、`DateTime64` 数据类型支持。关闭 [#21645](https://github.com/ClickHouse/ClickHouse/issues/21645)。 [#48445](https://github.com/ClickHouse/ClickHouse/pull/48445) ([Nikolay Degterinsky](https://github.com/evillique)).
* 新增 `{server_uuid}` 宏支持，便于在运行时不断添加和移除副本的自动扩缩容集群中识别副本。关闭 [#48554](https://github.com/ClickHouse/ClickHouse/issues/48554)。 [#48563](https://github.com/ClickHouse/ClickHouse/pull/48563) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 安装脚本在可能的情况下创建硬链接而非复制文件。 [#48578](https://github.com/ClickHouse/ClickHouse/pull/48578) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 支持 `SHOW TABLE` 语法，其含义与 `SHOW CREATE TABLE` 相同。关闭 [#48580](https://github.com/ClickHouse/ClickHouse/issues/48580)。 [#48591](https://github.com/ClickHouse/ClickHouse/pull/48591) ([flynn](https://github.com/ucasfl)).
* HTTP 临时缓冲区现在支持通过驱逐虚拟文件系统缓存中的数据来获取工作空间。 [#48664](https://github.com/ClickHouse/ClickHouse/pull/48664) ([Vladimir C](https://github.com/vdimir)).
* 使结构推断适用于 `CREATE AS SELECT`。关闭 [#47599](https://github.com/ClickHouse/ClickHouse/issues/47599)。 [#48679](https://github.com/ClickHouse/ClickHouse/pull/48679) ([flynn](https://github.com/ucasfl)).
* 为 `ReplicatedMergeTree` 新增 `replicated_max_mutations_in_one_entry` 设置，允许限制单个 `MUTATE_PART` 条目中的变更命令数量（默认 10000）。 [#48731](https://github.com/ClickHouse/ClickHouse/pull/48731) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 对于 AggregateFunction 类型，不将未使用的内存池字节计入 `read_bytes`。 [#48745](https://github.com/ClickHouse/ClickHouse/pull/48745) ([Raúl Marín](https://github.com/Algunenano)).
* 修复 MySQL 字典数据源与命名集合一起使用时，部分 MySQL 相关设置未被处理的问题。关闭 [#48402](https://github.com/ClickHouse/ClickHouse/issues/48402)。 [#48759](https://github.com/ClickHouse/ClickHouse/pull/48759) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 如果用户将 `max_single_part_upload_size` 设置得非常大，AWS S3 SDK 的缺陷可能导致崩溃。修复 [#47679](https://github.com/ClickHouse/ClickHouse/issues/47679)。 [#48816](https://github.com/ClickHouse/ClickHouse/pull/48816) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复 `RabbitMQ` 中的数据竞争（[报告](https://pastila.nl/?004f7100/de1505289ab5bb355e67ebe6c7cc8707)），并重构代码。 [#48845](https://github.com/ClickHouse/ClickHouse/pull/48845) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 为 `system.parts` 和 `system.part_log` 添加 `name` 与 `part_name` 别名。关闭 [#48718](https://github.com/ClickHouse/ClickHouse/issues/48718)。 [#48850](https://github.com/ClickHouse/ClickHouse/pull/48850) ([sichenzhao](https://github.com/sichenzhao)).
* “arrayDifferenceSupport()”、“arrayCumSum()” 和 “arrayCumSumNonNegative()” 函数现在支持宽整数类型 (U)Int128/256 的输入数组。 [#48866](https://github.com/ClickHouse/ClickHouse/pull/48866) ([cluster](https://github.com/infdahai)).
* clickhouse-client 的多行历史记录不再填充空白，使粘贴更自然。 [#48870](https://github.com/ClickHouse/ClickHouse/pull/48870) ([Joanna Hulboj](https://github.com/jh0x)).
* 改进 ClickHouse 在 LXC 内运行且使用 LXCFS 的罕见场景。LXCFS 存在一个问题：读取 `/proc` 内的文件时，有时会返回 “Transport endpoint is not connected” 错误。该错误此前已正确记录到 ClickHouse 服务器日志中；现在通过重新打开文件进一步绕过此问题。这是一项非常小的改动。 [#48922](https://github.com/ClickHouse/ClickHouse/pull/48922) ([Real](https://github.com/RunningXie)).
* 改进预取的内存统计，并在 CI 中随机化预取设置。 [#48973](https://github.com/ClickHouse/ClickHouse/pull/48973) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 为 GCS 原生复制操作正确设置请求头。 [#48981](https://github.com/ClickHouse/ClickHouse/pull/48981) ([Antonio Andelic](https://github.com/antonio2368)).
* 支持在命令行设置名称中使用连字符代替下划线，例如用 `--max-threads` 代替 `--max_threads`。此外，支持使用 `—` 等 Unicode 破折号代替 `--`，这在与其他公司团队沟通、对方经理从 MS Word 复制代码时很有用。 [#48985](https://github.com/ClickHouse/ClickHouse/pull/48985) ([alekseygolub](https://github.com/alekseygolub)).
* SSL 用户证书认证失败时，允许退回到密码认证。关闭 [#48974](https://github.com/ClickHouse/ClickHouse/issues/48974)。 [#48989](https://github.com/ClickHouse/ClickHouse/pull/48989) ([Nikolay Degterinsky](https://github.com/evillique)).
* 改进内置仪表盘。关闭 [#46671](https://github.com/ClickHouse/ClickHouse/issues/46671)。 [#49036](https://github.com/ClickHouse/ClickHouse/pull/49036) ([Kevin Zhang](https://github.com/Kinzeng)).
* 为日志消息新增性能事件，以便按严重程度方便地查看日志消息数量。 [#49042](https://github.com/ClickHouse/ClickHouse/pull/49042) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 此前版本中，存在 DOS 或经典 macOS 换行符时，`LineAsString` 格式在启用和禁用并行解析时行为不一致。关闭 [#49039](https://github.com/ClickHouse/ClickHouse/issues/49039)。 [#49052](https://github.com/ClickHouse/ClickHouse/pull/49052) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 关于未解析查询参数的异常消息现在也会说明参数名称。重新实现 [#48878](https://github.com/ClickHouse/ClickHouse/issues/48878)。关闭 [#48772](https://github.com/ClickHouse/ClickHouse/issues/48772)。 [#49061](https://github.com/ClickHouse/ClickHouse/pull/49061) ([Alexey Milovidov](https://github.com/alexey-milovidov)).

<h4 id="buildtestingpackaging-improvement-8">
  构建、测试与打包改进
</h4>

* 更新时区。更新的时区如下：Africa/Cairo、Africa/Casablanca、Africa/El\_Aaiun、America/Bogota、America/Cambridge\_Bay、America/Ciudad\_Juarez、America/Godthab、America/Inuvik、America/Iqaluit、America/Nuuk、America/Ojinaga、America/Pangnirtung、America/Rankin\_Inlet、America/Resolute、America/Whitehorse、America/Yellowknife、Asia/Gaza、Asia/Hebron、Asia/Kuala\_Lumpur、Asia/Singapore、Canada/Yukon、Egypt、Europe/Kirov、Europe/Volgograd、Singapore。 [#48572](https://github.com/ClickHouse/ClickHouse/pull/48572) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 减少头文件中的依赖数量，加快构建。 [#47984](https://github.com/ClickHouse/ClickHouse/pull/47984) ([Dmitry Novik](https://github.com/novikd)).
* 在测试中随机化标记和索引的压缩。 [#48286](https://github.com/ClickHouse/ClickHouse/pull/48286) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 将内部 ZSTD 从 1.5.4 升级到 1.5.5。 [#46797](https://github.com/ClickHouse/ClickHouse/pull/46797) ([Robert Schulze](https://github.com/rschu1ze)).
* 在测试中随机化从 Compact 到 Wide 数据片段的纵向合并。 [#48287](https://github.com/ClickHouse/ClickHouse/pull/48287) ([Raúl Marín](https://github.com/Algunenano)).
* 支持 HDFS 中的 CRC32 校验和，并修复性能问题。 [#48614](https://github.com/ClickHouse/ClickHouse/pull/48614) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 移除 GCC 支持的残留代码。 [#48671](https://github.com/ClickHouse/ClickHouse/pull/48671) ([Robert Schulze](https://github.com/rschu1ze)).
* 新增启用新分析器基础架构的 CI 运行。 [#48719](https://github.com/ClickHouse/ClickHouse/pull/48719) ([Dmitry Novik](https://github.com/novikd)).

<h4 id="bug-fix-user-visible-misbehavior-in-an-official-stable-release-8">
  缺陷修复（正式稳定版本中用户可见的异常行为）
</h4>

* 修复由后台线程推送数据的物化视图在 system.query\_views\_log 中的记录。 [#46668](https://github.com/ClickHouse/ClickHouse/pull/46668) ([Azat Khuzhin](https://github.com/azat)).
* 修复若干 `RENAME COLUMN` 问题。 [#46946](https://github.com/ClickHouse/ClickHouse/pull/46946) ([alesapin](https://github.com/alesapin)).
* 修复 clickhouse-format 中的小型语法高亮问题。 [#47610](https://github.com/ClickHouse/ClickHouse/pull/47610) ([Natasha Murashkina](https://github.com/murfel)).
* 修复 LLVM libc++ 中的缺陷，该缺陷会使上传大于 INT\_MAX 的数据片段到 S3 时发生崩溃。 [#47693](https://github.com/ClickHouse/ClickHouse/pull/47693) ([Azat Khuzhin](https://github.com/azat)).
* 修复 `sparkbar` 函数中的溢出。 [#48121](https://github.com/ClickHouse/ClickHouse/pull/48121) ([Vladimir C](https://github.com/vdimir)).
* 修复 S3 中的竞态条件。 [#48190](https://github.com/ClickHouse/ClickHouse/pull/48190) ([Anton Popov](https://github.com/CurtizJ)).
* 由于行为不一致，禁用聚合函数的 JIT。 [#48195](https://github.com/ClickHouse/ClickHouse/pull/48195) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 修复 ALTER 格式化的小问题。 [#48289](https://github.com/ClickHouse/ClickHouse/pull/48289) ([Natasha Murashkina](https://github.com/murfel)).
* 修复 RabbitMQ 的 CPU 使用问题（23.2 中的 [#44404](https://github.com/ClickHouse/ClickHouse/issues/44404) 使其恶化）。 [#48311](https://github.com/ClickHouse/ClickHouse/pull/48311) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复针对 Distributed 表之上的 Merge 执行 EXPLAIN PIPELINE 时的崩溃。 [#48320](https://github.com/ClickHouse/ClickHouse/pull/48320) ([Azat Khuzhin](https://github.com/azat)).
* 修复将 LowCardinality 序列化为 Arrow 字典的问题。 [#48361](https://github.com/ClickHouse/ClickHouse/pull/48361) ([Kruglov Pavel](https://github.com/Avogar)).
* 在 TemporaryFileStream 中重置缓存文件段的下载器。 [#48386](https://github.com/ClickHouse/ClickHouse/pull/48386) ([Vladimir C](https://github.com/vdimir)).
* 修复 DROP/REPLACE PARTITION 时 SYSTEM SYNC REPLICA 可能卡住的问题。 [#48391](https://github.com/ClickHouse/ClickHouse/pull/48391) ([Azat Khuzhin](https://github.com/azat)).
* 修复加载依赖字典的 Distributed 表时出现的启动错误。 [#48419](https://github.com/ClickHouse/ClickHouse/pull/48419) ([MikhailBurdukov](https://github.com/MikhailBurdukov)).
* 自动重命名系统表时不检查依赖关系。 [#48431](https://github.com/ClickHouse/ClickHouse/pull/48431) ([Raúl Marín](https://github.com/Algunenano)).
* 在 KeeperMap 存储引擎中仅更新受影响的行。 [#48435](https://github.com/ClickHouse/ClickHouse/pull/48435) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复 VFS 缓存中可能发生的段错误。 [#48469](https://github.com/ClickHouse/ClickHouse/pull/48469) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 未提供常量字符串时，`toTimeZone` 函数抛出错误。 [#48471](https://github.com/ClickHouse/ClickHouse/pull/48471) ([Jordi Villar](https://github.com/jrdi)).
* 修复 Protobuf 中 IPv4 的逻辑错误，并新增 Date32 支持。 [#48486](https://github.com/ClickHouse/ClickHouse/pull/48486) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复 system.settings 中多值设置的 “changed” 标志计算错误。 [#48516](https://github.com/ClickHouse/ClickHouse/pull/48516) ([MikhailBurdukov](https://github.com/MikhailBurdukov)).
* 修复启用压缩的 `Memory` 存储引擎。 [#48517](https://github.com/ClickHouse/ClickHouse/pull/48517) ([Anton Popov](https://github.com/CurtizJ)).
* 修复客户端重新连接时，括号粘贴模式干扰密码输入的问题。 [#48528](https://github.com/ClickHouse/ClickHouse/pull/48528) ([Michael Kolupaev](https://github.com/al13n321)).
* 修复使用 IP 和 UUID 类型键的嵌套 Map。 [#48556](https://github.com/ClickHouse/ClickHouse/pull/48556) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* 修复哈希字典并行加载器中未捕获的异常。 [#48571](https://github.com/ClickHouse/ClickHouse/pull/48571) ([Azat Khuzhin](https://github.com/azat)).
* 使 `groupArray` 聚合函数在可空类型上产生空结果时正确工作。 [#48593](https://github.com/ClickHouse/ClickHouse/pull/48593) ([lgbo](https://github.com/lgbo-ustc)).
* 修复 Keeper 中某些情况下创建节点时未采用 ACL 中的 `auth` 方案的问题。 [#48595](https://github.com/ClickHouse/ClickHouse/pull/48595) ([Aleksei Filatov](https://github.com/aalexfvk)).
* 允许 IPv4 与 UInt 使用比较运算符。 [#48611](https://github.com/ClickHouse/ClickHouse/pull/48611) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* 修复缓存中可能出现的错误。 [#48636](https://github.com/ClickHouse/ClickHouse/pull/48636) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 数据为空的异步插入不再抛出异常。 [#48663](https://github.com/ClickHouse/ClickHouse/pull/48663) ([Anton Popov](https://github.com/CurtizJ)).
* 修复 RENAME TABLE 失败时的表依赖关系。 [#48683](https://github.com/ClickHouse/ClickHouse/pull/48683) ([Azat Khuzhin](https://github.com/azat)).
* 修复主键包含重复列时可能出现的问题，此情况仅可能发生于投影中。 [#48838](https://github.com/ClickHouse/ClickHouse/pull/48838) ([Amos Bird](https://github.com/amosbird)).
* 修复 ZooKeeper 在等待 send\_thread/receive\_thread 结束时的竞态条件。 [#48849](https://github.com/ClickHouse/ClickHouse/pull/48849) ([Alexander Gololobov](https://github.com/davenger)).
* 修复启用零复制机制时，尝试删除被忽略的已分离数据片段出现非预期数据片段名称错误的问题。 [#48862](https://github.com/ClickHouse/ClickHouse/pull/48862) ([Michael Lex](https://github.com/mlex)).
* 修复将 Parquet/Arrow 中的 `Date32` 列读取到非 `Date32` 列的问题。 [#48864](https://github.com/ClickHouse/ClickHouse/pull/48864) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复从具有行策略且列名包含句点的表查询时出现的 `UNKNOWN_IDENTIFIER` 错误。 [#48976](https://github.com/ClickHouse/ClickHouse/pull/48976) ([Kruglov Pavel](https://github.com/Avogar)).
* 修复按空的可空字符串聚合的问题。 [#48999](https://github.com/ClickHouse/ClickHouse/pull/48999) ([LiuNeng](https://github.com/liuneng1994)).
