<h3 id="a-id2211a-clickhouse-release-2211-2022-11-17">
  <a id="2211" /> ClickHouse 22.11 版本, 2022-11-17. [演示文稿](https://presentations.clickhouse.com/2022-release-22.11/), [视频](https://www.youtube.com/watch?v=LR-fckOOaFo)
</h3>

<Frame>
  <iframe src="https://www.youtube.com/embed/LR-fckOOaFo" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
</Frame>

<h4 id="backward-incompatible-change">
  向后不兼容变更
</h4>

* `JSONExtract` 函数家族现在会尝试转换为请求的类型。[#41502](https://github.com/ClickHouse/ClickHouse/pull/41502)（[Márcio Martins](https://github.com/marcioapm)）。

<h4 id="new-feature-1">
  新功能
</h4>

* 支持向 ReplicatedMergeTree 执行 INSERT 时，在与 ClickHouse Keeper 的会话丢失后重试。除了提高容错能力，也旨在改善用户体验，避免 Keeper 重启（例如升级）时向插入用户返回错误。[#42607](https://github.com/ClickHouse/ClickHouse/pull/42607)（[Igor Nikonov](https://github.com/devcrafter)）。
* 新增 `Hudi` 和 `DeltaLake` 表引擎，仅支持读取 S3 上的表。[#41054](https://github.com/ClickHouse/ClickHouse/pull/41054)（[Daniil Rubin](https://github.com/rubin-do)、[Kseniia Sumarokova](https://github.com/kssenii)）。
* 新增 `hudi` 和 `deltaLake` 表函数。[#43080](https://github.com/ClickHouse/ClickHouse/pull/43080)（[flynn](https://github.com/ucasfl)）。
* 支持复合时间间隔。1. Interval 现在支持加法、减法和取负；如果 Interval 类型不同，将转换为包含这些类型的 Tuple。2. 可以对 Date/DateTime 字段加上或减去时间间隔元组。3. 支持解析混合类型的 Interval，例如：`INTERVAL '1 HOUR 1 MINUTE 1 SECOND'`。[#42195](https://github.com/ClickHouse/ClickHouse/pull/42195)（[Nikolay Degterinsky](https://github.com/evillique)）。
* 新增 `**` 通配符支持，用于递归遍历文件系统和 S3 目录。解决 [#36316](https://github.com/ClickHouse/ClickHouse/issues/36316)。[#42376](https://github.com/ClickHouse/ClickHouse/pull/42376)（[SmitaRKulkarni](https://github.com/SmitaRKulkarni)）。
* 引入 `s3_plain` 磁盘类型，用于一次写入、多次读取操作。实现对 `s3_plain` 磁盘的 `MergeTree` 表执行 `ATTACH`。[#42628](https://github.com/ClickHouse/ClickHouse/pull/42628)（[Azat Khuzhin](https://github.com/azat)）。
* 在 `system.query_log` 中记录已应用的行级策略。[#39819](https://github.com/ClickHouse/ClickHouse/pull/39819)（[Vladimir Chebotaryov](https://github.com/quickhouse)）。
* 新增四字母命令 `csnp`，用于手动创建 ClickHouse Keeper 快照。另新增 `lgif`，获取特定节点的 Raft 信息，例如最新快照索引、最新已提交日志索引。[#41766](https://github.com/ClickHouse/ClickHouse/pull/41766)（[JackyWoo](https://github.com/JackyWoo)）。
* 新增与 Apache Spark 类似的 `ascii` 函数：[https://spark.apache.org/docs/latest/api/sql/#ascii](https://spark.apache.org/docs/latest/api/sql/#ascii)。[#42670](https://github.com/ClickHouse/ClickHouse/pull/42670)（[李扬](https://github.com/taiyang-li)）。
* 新增 `pmod` 函数，返回非负的模运算结果。[#42755](https://github.com/ClickHouse/ClickHouse/pull/42755)（[李扬](https://github.com/taiyang-li)）。
* 新增 `formatReadableDecimalSize` 函数。[#42774](https://github.com/ClickHouse/ClickHouse/pull/42774)（[Alejandro](https://github.com/alexon1234)）。
* 新增 `randCanonical` 函数，类似于 Apache Spark 或 Impala 中的 `rand`。该函数生成独立同分布的均匀伪随机值，取值范围为 \[0, 1). [#43124](https://github.com/ClickHouse/ClickHouse/pull/43124)（[李扬](https://github.com/taiyang-li)）。
* 新增 `displayName` 函数，关闭 [#36770](https://github.com/ClickHouse/ClickHouse/issues/36770)。[#37681](https://github.com/ClickHouse/ClickHouse/pull/37681)（[hongbin](https://github.com/xlwh)）。
* 新增 `min_age_to_force_merge_on_partition_only` 设置，仅针对整个分区优化旧数据片段。[#42659](https://github.com/ClickHouse/ClickHouse/pull/42659)（[Antonio Andelic](https://github.com/antonio2368)）。
* 为任意结构的命名集合、访问类型和 `system.named_collections` 添加通用实现。[#43147](https://github.com/ClickHouse/ClickHouse/pull/43147)（[Kseniia Sumarokova](https://github.com/kssenii)）。

<h4 id="performance-improvement-1">
  性能改进
</h4>

* 如果条件约束字符串前缀，`match` 函数可以使用索引。关闭 [#37333](https://github.com/ClickHouse/ClickHouse/issues/37333)。[#42458](https://github.com/ClickHouse/ClickHouse/pull/42458)（[clarkcaoliu](https://github.com/Clark0)）。
* 加快连续使用的 AND 和 OR 运算符。[#42214](https://github.com/ClickHouse/ClickHouse/pull/42214)（[Zhiguo Zhou](https://github.com/ZhiguoZh)）。
* `LineAsString` 输入格式支持并行解析，带来小幅性能提升。关闭 [#42502](https://github.com/ClickHouse/ClickHouse/issues/42502)。[#42780](https://github.com/ClickHouse/ClickHouse/pull/42780)（[Kruglov Pavel](https://github.com/Avogar)）。
* ClickHouse Keeper 性能改进：当许多不同节点具有未提交状态时，改善提交性能，有助于解决跟随节点同步不够快的情况。[#42926](https://github.com/ClickHouse/ClickHouse/pull/42926)（[Antonio Andelic](https://github.com/antonio2368)）。
* `NOT LIKE 'prefix%'` 这类条件可以使用主索引。[#42209](https://github.com/ClickHouse/ClickHouse/pull/42209)（[Duc Canh Le](https://github.com/canhld94)）。

<h4 id="experimental-feature-1">
  实验性功能
</h4>

* 支持将 `Object` 类型嵌套在其他类型中，例如 `Array(JSON)`。[#36969](https://github.com/ClickHouse/ClickHouse/pull/36969)（[Anton Popov](https://github.com/CurtizJ)）。
* MaterializedMySQL 忽略 MySQL binlog SAVEPOINT 事件。[#42931](https://github.com/ClickHouse/ClickHouse/pull/42931)（[zzsmdfj](https://github.com/zzsmdfj)）。处理（忽略）MaterializedMySQL 中的 SAVEPOINT 查询。[#43086](https://github.com/ClickHouse/ClickHouse/pull/43086)（[Stig Bakken](https://github.com/stigsb)）。

<h4 id="improvement-1">
  改进
</h4>

* 带较小 LIMIT 的简单查询将正确估计待读取行数，使阈值检查正确执行。关闭 [#7071](https://github.com/ClickHouse/ClickHouse/issues/7071)。[#42580](https://github.com/ClickHouse/ClickHouse/pull/42580)（[Han Fei](https://github.com/hanfei1991)）。
* 为 INSERT VALUES 查询添加交互式参数支持。[#43077](https://github.com/ClickHouse/ClickHouse/pull/43077)（[Nikolay Degterinsky](https://github.com/evillique)）。
* 为 `system.table_functions` 新增 `allow_readonly` 字段，允许在只读模式下使用表函数。解决 [#42414](https://github.com/ClickHouse/ClickHouse/issues/42414)。实现：\* 为 system.table\_functions 表添加 allow\_readonly 字段。\* 更新逻辑，使用 allow\_readonly 字段允许只读模式的表函数。测试：\* 添加文件系统测试 tests/queries/0\_stateless/02473\_functions\_in\_readonly\_mode.sh。文档：\* 更新表函数英文文档。[#42708](https://github.com/ClickHouse/ClickHouse/pull/42708)（[SmitaRKulkarni](https://github.com/SmitaRKulkarni)）。
* 为 `system.asynchronous_metrics` 添加内嵌文档，也会导出至 Prometheus。修复 `cache` 磁盘指标错误：此前仅计算任意一个缓存磁盘，而不是所有磁盘。关闭 [#7644](https://github.com/ClickHouse/ClickHouse/issues/7644)。[#43194](https://github.com/ClickHouse/ClickHouse/pull/43194)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 限流算法改为令牌桶。[#42665](https://github.com/ClickHouse/ClickHouse/pull/42665)（[Sergei Trifonov](https://github.com/serxa)）。
* 在 `system.query_log`、`/var/log/clickhouse-server/*.log` 以及错误消息中遮蔽密码和密钥。[#42484](https://github.com/ClickHouse/ClickHouse/pull/42484)（[Vitaly Baranov](https://github.com/vitlibar)）。
* 为获取的数据片段移除被其覆盖的片段，避免复制延迟可能增长。[#39737](https://github.com/ClickHouse/ClickHouse/pull/39737)（[Azat Khuzhin](https://github.com/azat)）。
* 如果 `/dev/tty` 可用，clickhouse-client 和 clickhouse-local 的进度会直接渲染到终端，而不写入 STDERR。因此即使 STDERR 重定向到文件，仍能看到进度，文件也不会混入终端转义序列。可用 `--progress false` 禁用进度。关闭 [#32238](https://github.com/ClickHouse/ClickHouse/issues/32238)。[#42003](https://github.com/ClickHouse/ClickHouse/pull/42003)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 为 base64 编码函数支持 `FixedString` 输入。[#42285](https://github.com/ClickHouse/ClickHouse/pull/42285)（[ltrk2](https://github.com/ltrk2)）。
* 为 `system.detached_parts` 新增 `bytes_on_disk` 和 `path` 列。关闭 [#42264](https://github.com/ClickHouse/ClickHouse/issues/42264)。[#42303](https://github.com/ClickHouse/ClickHouse/pull/42303)（[chen](https://github.com/xiedeyantu)）。
* 改进表函数使用目标插入表结构的行为：`use_structure_from_insertion_table_in_table_functions` 新增取值 `2`，表示 ClickHouse 将自动判断是否可以使用目标插入表的结构。关闭 [#40028](https://github.com/ClickHouse/ClickHouse/issues/40028)。[#42320](https://github.com/ClickHouse/ClickHouse/pull/42320)（[Kruglov Pavel](https://github.com/Avogar)）。
* 修复 INSERT FROM INFILE 没有进度显示的问题。关闭 [#42548](https://github.com/ClickHouse/ClickHouse/issues/42548)。[#42634](https://github.com/ClickHouse/ClickHouse/pull/42634)（[chen](https://github.com/xiedeyantu)）。
* 重构 `tokens` 函数，使相关函数支持限制最大返回词元数（默认禁用）。[#42673](https://github.com/ClickHouse/ClickHouse/pull/42673)（[李扬](https://github.com/taiyang-li)）。
* 允许 `formatDateTime` 和 `FROM_UNIXTIME` 使用 `Date32` 参数。[#42737](https://github.com/ClickHouse/ClickHouse/pull/42737)（[Roman Vasin](https://github.com/rvasin)）。
* 将 tzdata 更新至 2022f。墨西哥除美国边境附近外不再使用夏令时：[https://www.timeanddate.com/news/time/mexico-abolishes-dst-2022.html](https://www.timeanddate.com/news/time/mexico-abolishes-dst-2022.html)。Chihuahua 于 2022-10-30 改为全年 UTC-6；斐济不再使用夏令时。参见 [https://github.com/google/cctz/pull/235](https://github.com/google/cctz/pull/235) 和 [https://bugs.launchpad.net/ubuntu/+source/tzdata/+bug/1995209](https://bugs.launchpad.net/ubuntu/+source/tzdata/+bug/1995209)。[#42796](https://github.com/ClickHouse/ClickHouse/pull/42796)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 为异步插入新增 `FailedAsyncInsertQuery` 事件指标。[#42814](https://github.com/ClickHouse/ClickHouse/pull/42814)（[Krzysztof Góralski](https://github.com/kgoralski)）。
* 基于查询计划实现 `read-in-order` 优化，默认启用。设置 `query_plan_read_in_order = 0` 可使用此前基于 AST 的版本。[#42829](https://github.com/ClickHouse/ClickHouse/pull/42829)（[Nikolai Kochetov](https://github.com/KochetovNicolai)）。
* 备份到 S3 时按指数增长上传分段大小，避免触及 S3 分段上传最多 10000 段的限制。[#42833](https://github.com/ClickHouse/ClickHouse/pull/42833)（[Vitaly Baranov](https://github.com/vitlibar)）。
* 合并任务持续繁忙且磁盘空间不足时，无法选取和删除完全过期的数据片段，导致磁盘空间持续不足。我的思路是：整个数据片段过期时，不需要额外磁盘空间保障，从而确保 TTL 正常执行。[#42869](https://github.com/ClickHouse/ClickHouse/pull/42869)（[zhongyuankai](https://github.com/zhongyuankai)）。
* 新增 `oss` 函数和 `OSS` 表引擎，方便用户使用。oss 与 s3 完全兼容。[#43155](https://github.com/ClickHouse/ClickHouse/pull/43155)（[zzsmdfj](https://github.com/zzsmdfj)）。
* 改进为 `system.asynchronous_metrics` 收集操作系统信息时的错误报告。[#43192](https://github.com/ClickHouse/ClickHouse/pull/43192)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修改 `INFORMATION_SCHEMA` 表，使 ClickHouse 能通过 MySQL 兼容协议连接自身。添加实际列而非别名（与 [#9769](https://github.com/ClickHouse/ClickHouse/issues/9769) 相关），改善与各种 MySQL 客户端的兼容性。[#43198](https://github.com/ClickHouse/ClickHouse/pull/43198)（[Filatenkov Artur](https://github.com/FArthur-cmd)）。
* 添加一些函数，以兼容通过 MySQL 协议连接的 PowerBI。[#42612](https://github.com/ClickHouse/ClickHouse/pull/42612)（[Filatenkov Artur](https://github.com/FArthur-cmd)）。
* 改善 Dashboard 发生变化时的易用性。[#42872](https://github.com/ClickHouse/ClickHouse/pull/42872)（[Vladimir C](https://github.com/vdimir)）。

<h4 id="buildtestingpackaging-improvement-1">
  构建/测试/打包改进
</h4>

* 为每个拉取请求及每次提交到 master 运行 SQLancer。[SQLancer](https://github.com/sqlancer/sqlancer) 是专注于自动检测逻辑错误的开源模糊测试器。[#42397](https://github.com/ClickHouse/ClickHouse/pull/42397)（[Ilya Yatsishin](https://github.com/qoega)）。
* 更新至最新版 zlib-ng。[#42463](https://github.com/ClickHouse/ClickHouse/pull/42463)（[Boris Kuschel](https://github.com/bkuschel)）。
* 新增使用 Jepsen 测试 ClickHouse 服务器的支持。我们此前已支持用 Jepsen 测试 ClickHouse Keeper，此 PR 将其扩展到复制表。[#42619](https://github.com/ClickHouse/ClickHouse/pull/42619)（[Antonio Andelic](https://github.com/antonio2368)）。
* 使用 [https://github.com/matus-chochlik/ctcache](https://github.com/matus-chochlik/ctcache) 缓存 clang-tidy 结果。[#42913](https://github.com/ClickHouse/ClickHouse/pull/42913)（[Mikhail f. Shiryaev](https://github.com/Felixoid)）。
* 修复前，RPM 将用户自定义配置保存到 `$file.rpmsave`。此 PR 修复该行为，不再用软件包中的文件替换用户文件。[#42936](https://github.com/ClickHouse/ClickHouse/pull/42936)（[Mikhail f. Shiryaev](https://github.com/Felixoid)）。
* 从 Ubuntu Docker 镜像中移除部分库。[#42622](https://github.com/ClickHouse/ClickHouse/pull/42622)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。

<h4 id="bug-fix-user-visible-misbehavior-in-official-stable-or-prestable-release-1">
  错误修复 (user-visible misbehavior in official stable or prestable release)
</h4>

* 更新规范化器以克隆别名 AST。解决 [#42452](https://github.com/ClickHouse/ClickHouse/issues/42452)。实现：\* 更新 QueryNormalizer，在替换别名时克隆 AST；此前直接赋用同一对象，会因再次插入相同父节点而在 LogicalExpressinsOptimizer 中抛出异常。\* 新分析器（allow\_experimental\_analyzer）没有此问题，因此不作修改。我为此添加了测试。[#42827](https://github.com/ClickHouse/ClickHouse/pull/42827)（[SmitaRKulkarni](https://github.com/SmitaRKulkarni)）。
* 修复备份 `Lazy` 数据库中的表时发生的竞争。[#43104](https://github.com/ClickHouse/ClickHouse/pull/43104)（[Vitaly Baranov](https://github.com/vitlibar)）。
* 修复 `skip_unavailable_shards` 无法用于 `s3Cluster` 表函数的问题。[#43131](https://github.com/ClickHouse/ClickHouse/pull/43131)（[chen](https://github.com/xiedeyantu)）。
* 修复 `s3Cluster` 的结构推断，并改进 `hdfsCluster`。[#41979](https://github.com/ClickHouse/ClickHouse/pull/41979)（[Kruglov Pavel](https://github.com/Avogar)）。
* 修复从 URL 表引擎/表函数读取时的重试：可重试错误可能重试过多次，不可重试错误则会触发代码断言失败。[#42224](https://github.com/ClickHouse/ClickHouse/pull/42224)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复已报告的 DNS 与 c-ares 相关段错误。[#42234](https://github.com/ClickHouse/ClickHouse/pull/42234)（[Arthur Passos](https://github.com/arthurpassos)）。
* 修复主键分析（单调性检查）中可能出现的 `LOGICAL_ERROR`：`Arguments of 'plus' have incorrect data types`。修复第一个参数为常量的单调二元函数的主键分析错误。[#42410](https://github.com/ClickHouse/ClickHouse/pull/42410)（[Nikolai Kochetov](https://github.com/KochetovNicolai)）。
* 修复键类型不能放入 Nullable 时的键分析错误。修复 [#42456](https://github.com/ClickHouse/ClickHouse/issues/42456)。[#42469](https://github.com/ClickHouse/ClickHouse/pull/42469)（[Amos Bird](https://github.com/amosbird)）。
* 修复设置名称拼写错误，避免使用 `input_format_csv_use_best_effort_in_schema_inference` 时错误使用结构推断缓存。关闭 [#41735](https://github.com/ClickHouse/ClickHouse/issues/41735)。[#42536](https://github.com/ClickHouse/ClickHouse/pull/42536)（[Kruglov Pavel](https://github.com/Avogar)）。
* 修复数据类型为 LowCardinality 时创建 Set 的表头错误。关闭 [#42460](https://github.com/ClickHouse/ClickHouse/issues/42460)。[#42579](https://github.com/ClickHouse/ClickHouse/pull/42579)（[flynn](https://github.com/ucasfl)）。
* 现在会在 `PREWHERE` 中正确检查 `(U)Int128` 和 `(U)Int256` 值。[#42605](https://github.com/ClickHouse/ClickHouse/pull/42605)（[Antonio Andelic](https://github.com/antonio2368)）。
* 修复函数解析器中可能导致段错误的问题。[#42724](https://github.com/ClickHouse/ClickHouse/pull/42724)（[Nikolay Degterinsky](https://github.com/evillique)）。
* 修复 `truncate table` 中的加锁。[#42728](https://github.com/ClickHouse/ClickHouse/pull/42728)（[flynn](https://github.com/ucasfl)）。
* 修复 `web` 磁盘中文件不存在时可能发生的崩溃（`OPTIMIZE TABLE FINAL` 最终也可能出现相同错误）。[#42767](https://github.com/ClickHouse/ClickHouse/pull/42767)（[Azat Khuzhin](https://github.com/azat)）。
* 为枚举值添加 `SSL_CERTIFICATE`，修复 `system.session_log` 中的 `auth_type` 映射。[#42782](https://github.com/ClickHouse/ClickHouse/pull/42782)（[Miel Donkers](https://github.com/mdonkers)）。
* 修复 ASAN 构建下 Create User 查询解析器中的栈内存返回后使用。[#42804](https://github.com/ClickHouse/ClickHouse/pull/42804)（[Nikolay Degterinsky](https://github.com/evillique)）。
* 修复字符跨越 16 字节边界时 `lowerUTF8`/`upperUTF8` 的问题（字符串超过 16 字节时很常见）。[#42812](https://github.com/ClickHouse/ClickHouse/pull/42812)（[Azat Khuzhin](https://github.com/azat)）。
* 为 LZ4 解压例程添加额外边界检查，修复格式错误输入下的不正确行为。[#42868](https://github.com/ClickHouse/ClickHouse/pull/42868)（[Nikita Taranov](https://github.com/nickitat)）。
* 修复取消查询时罕见的挂起。[#42874](https://github.com/ClickHouse/ClickHouse/pull/42874)（[Azat Khuzhin](https://github.com/azat)）。
* 修复哈希连接包含多个析取条件时的不正确行为，关闭 [#42832](https://github.com/ClickHouse/ClickHouse/issues/42832)。[#42876](https://github.com/ClickHouse/ClickHouse/pull/42876)（[Vladimir C](https://github.com/vdimir)）。
* 从“三表连接”执行 select if as 时会产生空指针，例如此 SQL 查询：[#42883](https://github.com/ClickHouse/ClickHouse/pull/42883)（[zzsmdfj](https://github.com/zzsmdfj)）。
* 修复 Cluster Discovery 中内存检查器报告的问题，关闭 [#42763](https://github.com/ClickHouse/ClickHouse/issues/42763)。[#42905](https://github.com/ClickHouse/ClickHouse/pull/42905)（[Vladimir C](https://github.com/vdimir)）。
* 改进空字符串情况下的 DateTime 结构推断。[#42911](https://github.com/ClickHouse/ClickHouse/pull/42911)（[Kruglov Pavel](https://github.com/Avogar)）。
* 修复可以使用投影但实际没有可用投影时，罕见的 NOT\_FOUND\_COLUMN\_IN\_BLOCK 错误。修复 [#42771](https://github.com/ClickHouse/ClickHouse/issues/42771)。此问题由 [https://github.com/ClickHouse/ClickHouse/pull/25563](https://github.com/ClickHouse/ClickHouse/pull/25563) 引入。[#42938](https://github.com/ClickHouse/ClickHouse/pull/42938)（[Amos Bird](https://github.com/amosbird)）。
* 修复 `PostgreSQL` 数据库引擎中表含 DATETIME 类型时的 ATTACH TABLE。关闭 [#42817](https://github.com/ClickHouse/ClickHouse/issues/42817)。[#42960](https://github.com/ClickHouse/ClickHouse/pull/42960)（[Kseniia Sumarokova](https://github.com/kssenii)）。
* 修复 lambda 解析。关闭 [#41848](https://github.com/ClickHouse/ClickHouse/issues/41848)。[#42979](https://github.com/ClickHouse/ClickHouse/pull/42979)（[Nikolay Degterinsky](https://github.com/evillique)）。
* 修复可空键出现在超矩形中间时的键分析错误。修复 [#43111](https://github.com/ClickHouse/ClickHouse/issues/43111)。[#43133](https://github.com/ClickHouse/ClickHouse/pull/43133)（[Amos Bird](https://github.com/amosbird)）。
* 修复反序列化精心构造的聚合函数状态时发生的多处缓冲区越界读取。[#43159](https://github.com/ClickHouse/ClickHouse/pull/43159)（[Raúl Marín](https://github.com/Algunenano)）。
* 修复 `if` 函数处理 NULL 和常量 Nullable 参数的情况。关闭 [#43069](https://github.com/ClickHouse/ClickHouse/issues/43069)。[#43178](https://github.com/ClickHouse/ClickHouse/pull/43178)（[Kruglov Pavel](https://github.com/Avogar)）。
* 修复使用 best effort 算法解析 DateTime 时的十进制运算溢出。关闭 [#43061](https://github.com/ClickHouse/ClickHouse/issues/43061)。[#43180](https://github.com/ClickHouse/ClickHouse/pull/43180)（[Kruglov Pavel](https://github.com/Avogar)）。
* 修复 `git-import` 工具生成的 `indent` 字段计算错误。参见 [https://clickhouse.com/docs/getting-started/example-datasets/github/](https://clickhouse.com/docs/getting-started/example-datasets/github/)。[#43191](https://github.com/ClickHouse/ClickHouse/pull/43191)（[Alexey Milovidov](https://github.com/alexey-milovidov)）。
* 修复 `Interval` 类型配合子查询和类型转换时的意外行为。[#43193](https://github.com/ClickHouse/ClickHouse/pull/43193)（[jh0x](https://github.com/jh0x)）。
