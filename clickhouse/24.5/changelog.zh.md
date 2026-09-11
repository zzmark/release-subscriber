<h3 id="a-id245a-clickhouse-release-245-2024-05-30">
  <a id="245" /> ClickHouse 24.5 版本, 2024-05-30. [演示文稿](https://presentations.clickhouse.com/2024-release-24.5/), [视频](https://www.youtube.com/watch?v=dURnKjLuZLg)
</h3>

<Frame>
  <iframe src="https://www.youtube.com/embed/dURnKjLuZLg" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
</Frame>

<h4 id="backward-incompatible-change-7">
  向后不兼容变更
</h4>

* 将“倒排索引”重命名为“全文索引”，以采用技术色彩更少、更易于用户理解的名称。这也会更改内部表元数据，使已有实验性倒排索引的表无法正常使用。升级前请务必删除此类索引，升级后重新创建。 [#62884](https://github.com/ClickHouse/ClickHouse/pull/62884) ([Robert Schulze](https://github.com/rschu1ze)).
* 废弃函数 `neighbor`、`runningAccumulate`、`runningDifferenceStartingWithFirstValue`、`runningDifference`（因为容易出错），应改用正规的窗口函数。若要重新启用，请设置 `allow_deprecated_error_prone_window_functions = 1`，或将 `compatibility = '24.4'` 设为 24.4 或更早版本。 [#63132](https://github.com/ClickHouse/ClickHouse/pull/63132) ([Nikita Taranov](https://github.com/nickitat)).
* 如果列数很多，但许多数据库或表未获授 `SHOW TABLES`，查询 `system.columns` 将更快。注意：此前若仅为单个列授予 `SHOW COLUMNS`，而未为对应表授予 `SHOW TABLES`，`system.columns` 仍会显示这些列；新版会完全跳过该表。移除拖慢查询的“Access granted”和“Access denied”跟踪日志消息。 [#63439](https://github.com/ClickHouse/ClickHouse/pull/63439) ([Alexey Milovidov](https://github.com/alexey-milovidov)).

<h4 id="new-feature-7">
  新功能
</h4>

* 新增 `Form` 格式，以 `application/x-www-form-urlencoded` 格式读写单条记录。 [#60199](https://github.com/ClickHouse/ClickHouse/pull/60199) ([Shaun Struwig](https://github.com/Blargian)).
* 支持在 CROSS JOIN 中压缩数据。 [#60459](https://github.com/ClickHouse/ClickHouse/pull/60459) ([p1rattttt](https://github.com/p1rattttt)).
* 支持在数据大小超过限制时使用临时文件执行 `CROSS JOIN`。 [#63432](https://github.com/ClickHouse/ClickHouse/pull/63432) ([p1rattttt](https://github.com/p1rattttt)).
* 支持涉及左右两表列的不等式连接条件，例如 `t1.y < t2.y`。通过 `SET allow_experimental_join_condition = 1` 启用。 [#60920](https://github.com/ClickHouse/ClickHouse/pull/60920) ([lgbo](https://github.com/lgbo-ustc)).
* Map 现在可使用 `Float32`、`Float64`、`Array(T)`、`Map(K, V)` 和 `Tuple(T1, T2, ...)` 作为键。关闭 [#54537](https://github.com/ClickHouse/ClickHouse/issues/54537)。 [#59318](https://github.com/ClickHouse/ClickHouse/pull/59318) ([李扬](https://github.com/taiyang-li)).
* 为 `EmbeddedRocksDB` 引入批量加载：创建并导入 SST 文件，而非依赖 rocksdb 内置 memtable，以提高导入速度，尤其适合向 StorageEmbeddedRocksDB 表执行长时间运行的插入查询。同时引入 `EmbeddedRocksDB` 表设置。 [#59163](https://github.com/ClickHouse/ClickHouse/pull/59163) [#63324](https://github.com/ClickHouse/ClickHouse/pull/63324) ([Duc Canh Le](https://github.com/canhld94)).
* 用户现在可通过设置 `input_format_tsv_crlf_end_of_line` 在 TSV 格式中解析 CRLF。关闭 [#56257](https://github.com/ClickHouse/ClickHouse/issues/56257)。 [#59747](https://github.com/ClickHouse/ClickHouse/pull/59747) ([Shaun Struwig](https://github.com/Blargian)).
* 新增设置 `input_format_force_null_for_omitted_fields`，强制将省略的字段设为 NULL。 [#60887](https://github.com/ClickHouse/ClickHouse/pull/60887) ([Constantine Peresypkin](https://github.com/pkit)).
* 此前 S3 存储与 s3 表函数不支持从 tar 包、zip、7z 等归档容器文件中查询。现在允许遍历 S3 归档中的文件。 [#62259](https://github.com/ClickHouse/ClickHouse/pull/62259) ([Daniil Ivanik](https://github.com/divanik)).
* 支持条件函数 `clamp`。 [#62377](https://github.com/ClickHouse/ClickHouse/pull/62377) ([skyoct](https://github.com/skyoct)).
* 新增 `NPy` 输出格式。 [#62430](https://github.com/ClickHouse/ClickHouse/pull/62430) ([豪肥肥](https://github.com/HowePa)).
* 将 `Raw` 格式作为 `TSVRaw` 的同义名称。 [#63394](https://github.com/ClickHouse/ClickHouse/pull/63394) ([Unalian](https://github.com/Unalian)).
* 新增 SQL 函数 `generateUUIDv7`，生成版本 7 UUID，即含随机分量的基于时间戳的 UUID。另新增函数 `UUIDToNum`，从 UUID 提取字节，以及 `UUIDv7ToDateTime`，从版本 7 UUID 提取时间戳分量。 [#62852](https://github.com/ClickHouse/ClickHouse/pull/62852) ([Alexey Petrunyaka](https://github.com/pet74alex)).
* 在 Linux 和 macOS 上，若程序 stdout 重定向到具有压缩扩展名的文件，则使用相应压缩方法，而非不压缩（使行为类似 `INTO OUTFILE`）。 [#63662](https://github.com/ClickHouse/ClickHouse/pull/63662) ([v01dXYZ](https://github.com/v01dXYZ)).
* 调整附加表数量过多的警告，区分表、视图与字典。 [#64180](https://github.com/ClickHouse/ClickHouse/pull/64180) ([Francisco J. Jurado Moreno](https://github.com/Beetelbrox)).
* ClickHouse 服务器中的 `azureBlobStorage` 函数支持使用 Azure Workload Identity 向 Azure Blob Storage 进行身份验证。若配置中设置 `use_workload_identity` 参数，则使用[工作负载标识](https://github.com/Azure/azure-sdk-for-cpp/tree/main/sdk/identity/azure-identity#authenticate-azure-hosted-applications)认证。 [#57881](https://github.com/ClickHouse/ClickHouse/pull/57881) ([Vinay Suryadevara](https://github.com/vinay92-ch)).
* 在 `system.parts_columns` 表中添加 TTL 信息。 [#63200](https://github.com/ClickHouse/ClickHouse/pull/63200) ([litlig](https://github.com/litlig)).

<h4 id="experimental-features-1">
  实验性功能s
</h4>

* 实现 `Dynamic` 数据类型，允许存储任意类型的值，而无需预先知道所有类型。通过设置 `allow_experimental_dynamic_type` 启用 `Dynamic` 类型。参考：[#54864](https://github.com/ClickHouse/ClickHouse/issues/54864)。 [#63058](https://github.com/ClickHouse/ClickHouse/pull/63058) ([Kruglov Pavel](https://github.com/Avogar)).
* 允许在未连接 MySQL 的情况下创建 `MaterializedMySQL` 数据库。 [#63397](https://github.com/ClickHouse/ClickHouse/pull/63397) ([Kirill](https://github.com/kirillgarbar)).
* 当某个 DDL 任务以同一错误连续失败超过 `max_retries_before_automatic_recovery` 次（默认 100 次）时，自动将 Replicated 数据库副本标记为丢失并启动恢复。同时修复在执行条目早期抛出异常时可能跳过 DDL 条目的缺陷。 [#63549](https://github.com/ClickHouse/ClickHouse/pull/63549) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 在 `StorageS3Queue` 的 `s3queue_tracked_file_ttl_sec` 和 `s3queue_traked_files_limit` 中计入失败文件。 [#63638](https://github.com/ClickHouse/ClickHouse/pull/63638) ([Kseniia Sumarokova](https://github.com/kssenii)).

<h4 id="performance-improvement-7">
  性能改进
</h4>

* 减少文件系统缓存竞争（第 4 部分）。通过后台额外驱逐使缓存保持在上限以下（由 `keep_free_space_size(elements)_ratio` 控制），以减轻查询预留空间的压力（`tryReserve` 方法）。同时尽可能采用无锁方式，以免阻塞正常缓存使用。 [#61250](https://github.com/ClickHouse/ClickHouse/pull/61250) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 在 `INSERT` 期间跳过合并新创建的投影数据块。 [#59405](https://github.com/ClickHouse/ClickHouse/pull/59405) ([Nikita Taranov](https://github.com/nickitat)).
* 若输入字符串全部为 ASCII 字符，则按 ASCII 方式处理字符串函数 `...UTF8`。灵感来自 [https://github.com/apache/doris/pull/29799](https://github.com/apache/doris/pull/29799)。整体提速 1.07x\~1.62x，部分情况下峰值内存也有所降低。 [#61632](https://github.com/ClickHouse/ClickHouse/pull/61632) ([李扬](https://github.com/taiyang-li)).
* 提升 StorageS3 中选择式 glob（`{}`）的性能。 [#62120](https://github.com/ClickHouse/ClickHouse/pull/62120) ([Andrey Zvonov](https://github.com/zvonand)).
* HostResolver 中每个 IP 地址会出现多次。如果远程主机具有多个 IP，且因某些原因（例如防火墙规则）只允许访问部分 IP，则被禁止 IP 只有第一条记录会标记为失败，每次尝试仍可能选中这些 IP 并再次失败。即使修复这一点，DNS 缓存每 120 秒会被丢弃，这些 IP 又可能被选中。 [#62652](https://github.com/ClickHouse/ClickHouse/pull/62652) ([Anton Ivashkin](https://github.com/ianton-ru)).
* 新增配置 `prefer_merge_sort_block_bytes`，用于控制内存占用，并在列数较多的合并中使排序提速 2 倍。 [#62904](https://github.com/ClickHouse/ClickHouse/pull/62904) ([LiuNeng](https://github.com/liuneng1994)).
* `clickhouse-local` 启动更快。此前因错误未删除临时目录，现在会正确删除。关闭 [#62941](https://github.com/ClickHouse/ClickHouse/issues/62941)。 [#63074](https://github.com/ClickHouse/ClickHouse/pull/63074) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 对新分析器进行微优化。 [#63429](https://github.com/ClickHouse/ClickHouse/pull/63429) ([Raúl Marín](https://github.com/Algunenano)).
* 比较 `DateTime` 和 `DateTime64` 时索引分析可正常工作。关闭 [#63441](https://github.com/ClickHouse/ClickHouse/issues/63441)。 [#63443](https://github.com/ClickHouse/ClickHouse/pull/63443) [#63532](https://github.com/ClickHouse/ClickHouse/pull/63532) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 通过移除无用内容略微加速 `set` 类型索引（约 1.5 倍）。 [#64098](https://github.com/ClickHouse/ClickHouse/pull/64098) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 写入文件系统缓存时移除数据复制。 [#63401](https://github.com/ClickHouse/ClickHouse/pull/63401) ([Kseniia Sumarokova](https://github.com/kssenii)).
* Azure Blob Storage 备份现在使用 multicopy。 [#64116](https://github.com/ClickHouse/ClickHouse/pull/64116) ([alesapin](https://github.com/alesapin)).
* 即使容器不同，也允许 Azure 使用原生复制。 [#64154](https://github.com/ClickHouse/ClickHouse/pull/64154) ([alesapin](https://github.com/alesapin)).
* 最终启用 Azure 原生复制。 [#64182](https://github.com/ClickHouse/ClickHouse/pull/64182) ([alesapin](https://github.com/alesapin)).

<h4 id="improvement-7">
  改进
</h4>

* 允许 `clickhouse-local` 及其快捷命令 `clickhouse`、`ch` 将查询或查询文件作为位置参数。示例：`ch "SELECT 1"`、`ch --param_test Hello "SELECT {test:String}"`、`ch query.sql`。关闭 [#62361](https://github.com/ClickHouse/ClickHouse/issues/62361)。 [#63081](https://github.com/ClickHouse/ClickHouse/pull/63081) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 为本地和 Azure（azure\_blob\_storage）对象存储启用 plain\_rewritable 元数据。 [#63365](https://github.com/ClickHouse/ClickHouse/pull/63365) ([Julia Kartseva](https://github.com/jkartseva)).
* 支持英文样式的 Unicode 引号，例如 “Hello”、'world'。总体而言这有待商榷，但在 Google Docs 等文字处理工具中输入查询时很有用。关闭 [#58634](https://github.com/ClickHouse/ClickHouse/issues/58634)。 [#63381](https://github.com/ClickHouse/ClickHouse/pull/63381) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 允许 INSERT 查询的列列表使用末尾逗号。例如：`INSERT INTO test (a, b, c, ) VALUES ...`。 [#63803](https://github.com/ClickHouse/ClickHouse/pull/63803) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 改进 `Regexp` 格式的异常消息。 [#63804](https://github.com/ClickHouse/ClickHouse/pull/63804) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 允许 `Values` 格式使用末尾逗号。例如允许：`INSERT INTO test (a, b, c) VALUES (4, 5, 6,);`。 [#63810](https://github.com/ClickHouse/ClickHouse/pull/63810) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 让 rabbitmq 对损坏消息发送 nack。关闭 [#45350](https://github.com/ClickHouse/ClickHouse/issues/45350)。 [#60312](https://github.com/ClickHouse/ClickHouse/pull/60312) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复异步栈展开（例如使用采样查询性能分析器）解释调试信息时的崩溃。关闭 [#60460](https://github.com/ClickHouse/ClickHouse/issues/60460)。 [#60468](https://github.com/ClickHouse/ClickHouse/pull/60468) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 针对磁盘和存储两种情况，为 S3 的“no key”错误提供不同消息。 [#61108](https://github.com/ClickHouse/ClickHouse/pull/61108) ([Sema Checherinda](https://github.com/CheSema)).
* 从 `system.zeros`、`system.zeros_mt`（此前已支持 `system.numbers` 和 `system.numbers_mt`）及 `generateRandom` 表函数执行带 LIMIT 的简单查询时，进度条现在可正常显示。另一个好处是，若记录总数超过 `max_rows_to_read` 限制，将更早抛出异常。关闭 [#58183](https://github.com/ClickHouse/ClickHouse/issues/58183)。 [#61823](https://github.com/ClickHouse/ClickHouse/pull/61823) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 支持 YAML 配置中的“合并键”（这是 YAML 一个奇怪的功能，不必在意）。 [#62685](https://github.com/ClickHouse/ClickHouse/pull/62685) ([Azat Khuzhin](https://github.com/azat)).
* 使用 Replicated 源时，若使用非确定性函数，提供更好的错误消息。 [#62896](https://github.com/ClickHouse/ClickHouse/pull/62896) ([Grégoire Pineau](https://github.com/lyrixx)).
* 修复通过 `remote` 访问多层 Distributed 表时的服务器间共享密钥。 [#63013](https://github.com/ClickHouse/ClickHouse/pull/63013) ([Azat Khuzhin](https://github.com/azat)).
* 为 YAML 文件支持 `include_from`。不过更建议使用 `config.d`。 [#63106](https://github.com/ClickHouse/ClickHouse/pull/63106) ([Eduard Karacharov](https://github.com/korowa)).
* 从 skim 建议中选择后，保留终端此前的内容。 [#63261](https://github.com/ClickHouse/ClickHouse/pull/63261) ([FlameFactory](https://github.com/FlameFactory)).
* 字段宽度（Pretty 格式或 `visibleWidth` 函数）现在正确忽略 ANSI 转义序列。 [#63270](https://github.com/ClickHouse/ClickHouse/pull/63270) ([Shaun Struwig](https://github.com/Blargian)).
* 在适当场合用更准确的错误码替代 `NUMBER_OF_ARGUMENTS_DOESNT_MATCH`。 [#63406](https://github.com/ClickHouse/ClickHouse/pull/63406) ([Yohann Jardin](https://github.com/yohannj)).
* clickhouse-client 用于命令行补全建议的查询现在正确设置 `os_user` 和 `client_hostname`。关闭 [#63430](https://github.com/ClickHouse/ClickHouse/issues/63430)。 [#63433](https://github.com/ClickHouse/ClickHouse/pull/63433) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 若 `max_block_size` 为零，自动修正为默认值。 [#63587](https://github.com/ClickHouse/ClickHouse/pull/63587) ([Antonio Andelic](https://github.com/antonio2368)).
* 为 trace\_log 新增 build\_id ALIAS 列，以便检测到二进制文件变化时自动重命名，用于解决 [#52086](https://github.com/ClickHouse/ClickHouse/issues/52086)。 [#63656](https://github.com/ClickHouse/ClickHouse/pull/63656) ([Zimu Li](https://github.com/woodlzm)).
* 为对象存储磁盘启用 truncate 操作。 [#63693](https://github.com/ClickHouse/ClickHouse/pull/63693) ([MikhailBurdukov](https://github.com/MikhailBurdukov)).
* 关键字列表的加载现在依赖服务器修订版本，对旧 ClickHouse 服务器禁用。抄送 @azat。 [#63786](https://github.com/ClickHouse/ClickHouse/pull/63786) ([Nikita Mikhaylov](https://github.com/nikitamikhaylov)).
* ClickHouse 磁盘必须读取服务器设置，获取实际元数据格式版本。 [#63831](https://github.com/ClickHouse/ClickHouse/pull/63831) ([Sema Checherinda](https://github.com/CheSema)).
* stdout 不是 TTY 时，禁用 Pretty 格式限制（`output_format_pretty_max_rows`/`output_format_pretty_max_value_width`）。 [#63942](https://github.com/ClickHouse/ClickHouse/pull/63942) ([Azat Khuzhin](https://github.com/azat)).
* 在 AWS Lambda 中使用 ClickHouse 时，异常处理现在可以正常工作。作者：[Alexey Coolnev](https://github.com/acoolnev)。 [#64014](https://github.com/ClickHouse/ClickHouse/pull/64014) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 通过 HTTP 传入无效压缩数据时，抛出 `CANNOT_DECOMPRESS`，而非 `CORRUPTED_DATA`。 [#64036](https://github.com/ClickHouse/ClickHouse/pull/64036) ([vdimir](https://github.com/vdimir)).
* Pretty 格式中针对单个大数值的提示现在支持 Nullable 和 LowCardinality。关闭 [#61993](https://github.com/ClickHouse/ClickHouse/issues/61993)。 [#64084](https://github.com/ClickHouse/ClickHouse/pull/64084) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 为使用索引过滤数据片段的过程添加指标、日志和线程名称。 [#64130](https://github.com/ClickHouse/ClickHouse/pull/64130) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 在 `ATTACH` 时忽略 `allow_suspicious_primary_key`，在 `ALTER` 时进行校验。 [#64202](https://github.com/ClickHouse/ClickHouse/pull/64202) ([Azat Khuzhin](https://github.com/azat)).

<h4 id="buildtestingpackaging-improvement-3">
  构建/测试/打包改进
</h4>

* ClickHouse 使用 clang-18 构建，并启用大量 clang-tidy-18 新检查。 [#60469](https://github.com/ClickHouse/ClickHouse/pull/60469) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 实验性支持 loongarch64 作为 ClickHouse 的新平台。 [#63733](https://github.com/ClickHouse/ClickHouse/pull/63733) ([qiangxuhui](https://github.com/qiangxuhui)).
* Dockerfile 已在 [https://github.com/docker-library/official-images/pull/15846](https://github.com/docker-library/official-images/pull/15846) 中由 Docker 官方库审查。 [#63400](https://github.com/ClickHouse/ClickHouse/pull/63400) ([Mikhail f. Shiryaev](https://github.com/Felixoid)).
* 对于每次 CI 构建，将每个翻译单元中每个符号的信息收集到 CI 数据库。关闭 [#63494](https://github.com/ClickHouse/ClickHouse/issues/63494)。 [#63495](https://github.com/ClickHouse/ClickHouse/pull/63495) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 更新 Apache Datasketches 库，解决 [#63858](https://github.com/ClickHouse/ClickHouse/issues/63858)。 [#63923](https://github.com/ClickHouse/ClickHouse/pull/63923) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 交叉编译二进制文件时，为 aarch64 Linux 启用 gRPC 支持。 [#64072](https://github.com/ClickHouse/ClickHouse/pull/64072) ([alesapin](https://github.com/alesapin)).
* 修复 aarch64 上 SIGSEGV 时的栈展开（由于信号栈过小）。 [#64058](https://github.com/ClickHouse/ClickHouse/pull/64058) ([Azat Khuzhin](https://github.com/azat)).

<h4 id="bug-fix-1">
  Bug Fix
</h4>

* 默认禁用设置 `enable_vertical_final`。不应使用此功能，因为存在缺陷：[#64543](https://github.com/ClickHouse/ClickHouse/issues/64543)。 [#64544](https://github.com/ClickHouse/ClickHouse/pull/64544) ([Alexander Tokmakov](https://github.com/tavplubix)).
* 修复使用多个分片时的备份创建。 [#57684](https://github.com/ClickHouse/ClickHouse/pull/57684) ([Vitaly Baranov](https://github.com/vitlibar)).
* 修复将 CREATE 查询列列表中的投影、索引和主键传递到物化视图内部表的问题。 [#59183](https://github.com/ClickHouse/ClickHouse/pull/59183) ([Azat Khuzhin](https://github.com/azat)).
* 修复 boundRatio 的错误合并。 [#60532](https://github.com/ClickHouse/ClickHouse/pull/60532) ([Tao Wang](https://github.com/wangtZJU)).
* 修复在常量 LowCardinality 列上调用部分函数时的崩溃。 [#61966](https://github.com/ClickHouse/ClickHouse/pull/61966) ([Michael Kolupaev](https://github.com/al13n321)).
* 修复表不使用自适应粒度时，带 FINAL 的查询返回错误结果的问题。 [#62432](https://github.com/ClickHouse/ClickHouse/pull/62432) ([Duc Canh Le](https://github.com/canhld94)).
* 改进对内存控制器 cgroups v2 支持的检测。 [#62903](https://github.com/ClickHouse/ClickHouse/pull/62903) ([Robert Schulze](https://github.com/rschu1ze)).
* 修复客户端后续使用外部表的问题。 [#62964](https://github.com/ClickHouse/ClickHouse/pull/62964) ([Azat Khuzhin](https://github.com/azat)).
* 修复 untuple 与未解析 lambda 组合时的崩溃。 [#63131](https://github.com/ClickHouse/ClickHouse/pull/63131) ([Raúl Marín](https://github.com/Algunenano)).
* 修复服务器过早监听连接的问题。 [#63181](https://github.com/ClickHouse/ClickHouse/pull/63181) ([alesapin](https://github.com/alesapin)).
* 修复 DROP PART 命令后重启时出现相交数据片段的问题。 [#63202](https://github.com/ClickHouse/ClickHouse/pull/63202) ([Han Fei](https://github.com/hanfei1991)).
* 启动期间正确加载 SQL 安全默认值。 [#63209](https://github.com/ClickHouse/ClickHouse/pull/63209) ([pufit](https://github.com/pufit)).
* 修复 JOIN 过滤条件下推中的过滤连接问题。 [#63234](https://github.com/ClickHouse/ClickHouse/pull/63234) ([Maksim Kita](https://github.com/kitaisreal)).
* 修复 AzureObjectStorage::listObjects 无限循环。 [#63257](https://github.com/ClickHouse/ClickHouse/pull/63257) ([Julia Kartseva](https://github.com/jkartseva)).
* CROSS JOIN 忽略 join\_algorithm 设置。 [#63273](https://github.com/ClickHouse/ClickHouse/pull/63273) ([vdimir](https://github.com/vdimir)).
* 修复 WriteBufferToFileSegment 和 StatusFile 的结束处理。 [#63346](https://github.com/ClickHouse/ClickHouse/pull/63346) ([vdimir](https://github.com/vdimir)).
* 修复极少数情况下 ALTER 后执行 SELECT 查询出现的逻辑错误。 [#63353](https://github.com/ClickHouse/ClickHouse/pull/63353) ([alesapin](https://github.com/alesapin)).
* 修复 `X-ClickHouse-Timezone` 请求头与 `session_timezone` 的配合使用。 [#63377](https://github.com/ClickHouse/ClickHouse/pull/63377) ([Andrey Zvonov](https://github.com/zvonand)).
* 修复使用 grouping WITH ROLLUP 和 LowCardinality 类型时的调试断言。 [#63398](https://github.com/ClickHouse/ClickHouse/pull/63398) ([Raúl Marín](https://github.com/Algunenano)).
* 对 group\_by\_use\_nulls 进行小修复。 [#63405](https://github.com/ClickHouse/ClickHouse/pull/63405) ([vdimir](https://github.com/vdimir)).
* 修复投影已从表元数据移除但数据片段仍含投影时，该投影数据片段的备份/恢复。 [#63426](https://github.com/ClickHouse/ClickHouse/pull/63426) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 修复 MySQL 字典源。 [#63481](https://github.com/ClickHouse/ClickHouse/pull/63481) ([vdimir](https://github.com/vdimir)).
* AsyncInsertFlush 无数据时插入 QueryFinish。 [#63483](https://github.com/ClickHouse/ClickHouse/pull/63483) ([Raúl Marín](https://github.com/Algunenano)).
* 修复 system.query\_log 中 used\_dictionaries 为空的问题。 [#63487](https://github.com/ClickHouse/ClickHouse/pull/63487) ([Eduard Karacharov](https://github.com/korowa)).
* 让 `MergeTreePrefetchedReadPool` 更安全。 [#63513](https://github.com/ClickHouse/ClickHouse/pull/63513) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复启用 sentry 时退出崩溃的问题（因为 OpenSSL 先于 sentry 销毁）。 [#63548](https://github.com/ClickHouse/ClickHouse/pull/63548) ([Azat Khuzhin](https://github.com/azat)).
* 修复带密钥哈希对 Array 和 Map 的支持。 [#63628](https://github.com/ClickHouse/ClickHouse/pull/63628) ([Salvatore Mesoraca](https://github.com/aiven-sal)).
* 修复 Parquet 及可能的 StorageMerge 的过滤条件下推。 [#63642](https://github.com/ClickHouse/ClickHouse/pull/63642) ([Michael Kolupaev](https://github.com/al13n321)).
* ZooKeeper 路径已存在时阻止转换为 Replicated。 [#63670](https://github.com/ClickHouse/ClickHouse/pull/63670) ([Kirill](https://github.com/kirillgarbar)).
* Analyzer：视图仅读取必需列。 [#63688](https://github.com/ClickHouse/ClickHouse/pull/63688) ([Maksim Kita](https://github.com/kitaisreal)).
* Analyzer：禁止重新定义 WINDOW。 [#63694](https://github.com/ClickHouse/ClickHouse/pull/63694) ([Dmitry Novik](https://github.com/novikd)).
* 修复实验性 Replicated 数据库中的 flatten\_nested。 [#63695](https://github.com/ClickHouse/ClickHouse/pull/63695) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复 [#63653](https://github.com/ClickHouse/ClickHouse/issues/63653)。 [#63722](https://github.com/ClickHouse/ClickHouse/pull/63722) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 允许从 Array(Nothing) 转换为 Map(Nothing, Nothing)。 [#63753](https://github.com/ClickHouse/ClickHouse/pull/63753) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复 partial\_merge 连接中的 ILLEGAL\_COLUMN。 [#63755](https://github.com/ClickHouse/ClickHouse/pull/63755) ([vdimir](https://github.com/vdimir)).
* 修复包含窗口函数时移除冗余 distinct 的问题。 [#63776](https://github.com/ClickHouse/ClickHouse/pull/63776) ([Igor Nikonov](https://github.com/devcrafter)).
* 修复 SYSTEM UNLOAD PRIMARY KEY 可能发生的崩溃。 [#63778](https://github.com/ClickHouse/ClickHouse/pull/63778) ([Raúl Marín](https://github.com/Algunenano)).
* 修复包含重复循环别名的查询。 [#63791](https://github.com/ClickHouse/ClickHouse/pull/63791) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 让 `TokenIterator` 按预期采用惰性处理。 [#63801](https://github.com/ClickHouse/ClickHouse/pull/63801) ([Alexey Milovidov](https://github.com/alexey-milovidov)).
* 新增 S3 URI 设置 `endpoint_subpath`。 [#63806](https://github.com/ClickHouse/ClickHouse/pull/63806) ([Julia Kartseva](https://github.com/jkartseva)).
* 修复 `ParallelReadBuffer` 死锁。 [#63814](https://github.com/ClickHouse/ClickHouse/pull/63814) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复 JOIN 过滤条件下推中的等价列问题。 [#63819](https://github.com/ClickHouse/ClickHouse/pull/63819) ([Maksim Kita](https://github.com/kitaisreal)).
* 在 Lazy 数据库中 DROP 后从所有磁盘移除数据。 [#63848](https://github.com/ClickHouse/ClickHouse/pull/63848) ([MikhailBurdukov](https://github.com/MikhailBurdukov)).
* 修复使用并行副本和新分析器读取物化视图时可能返回错误结果的问题。 [#63861](https://github.com/ClickHouse/ClickHouse/pull/63861) ([Nikita Taranov](https://github.com/nickitat)).
* 修复 keeper-client 的 `find_super_nodes` 和 `find_big_family` 命令。 [#63862](https://github.com/ClickHouse/ClickHouse/pull/63862) ([Alexander Gololobov](https://github.com/davenger)).
* 更新 lambda 执行名称。 [#63864](https://github.com/ClickHouse/ClickHouse/pull/63864) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复 CPU/Real 性能分析器导致的 SIGSEGV。 [#63865](https://github.com/ClickHouse/ClickHouse/pull/63865) ([Azat Khuzhin](https://github.com/azat)).
* 修复 `EXPLAIN CURRENT TRANSACTION` 查询。 [#63926](https://github.com/ClickHouse/ClickHouse/pull/63926) ([Anton Popov](https://github.com/CurtizJ)).
* 修复分析器：层层嵌套，无穷无尽…… [#63930](https://github.com/ClickHouse/ClickHouse/pull/63930) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* 允许对 `plain_rewritable` 磁盘执行部分 ALTER TABLE 命令。 [#63933](https://github.com/ClickHouse/ClickHouse/pull/63933) ([Julia Kartseva](https://github.com/jkartseva)).
* 修复分布式递归 CTE。 [#63939](https://github.com/ClickHouse/ClickHouse/pull/63939) ([Maksim Kita](https://github.com/kitaisreal)).
* Analyzer：修复 COLUMNS 解析。 [#63962](https://github.com/ClickHouse/ClickHouse/pull/63962) ([Dmitry Novik](https://github.com/novikd)).
* 修复使用分析器时 LIMIT BY 与 skip\_unused\_shards 的配合。 [#63983](https://github.com/ClickHouse/ClickHouse/pull/63983) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 修复某些糟糕的内容（实验性 Kusto）。 [#63992](https://github.com/ClickHouse/ClickHouse/pull/63992) ([Yong Wang](https://github.com/kashwy)).
* 以更安全的方式反序列化不可信二进制输入。 [#64024](https://github.com/ClickHouse/ClickHouse/pull/64024) ([Robert Schulze](https://github.com/rschu1ze)).
* 修复对基于非 MergeTree 家族表的 Distributed 表执行带设置 `final` = 1 的查询时的查询分析。 [#64037](https://github.com/ClickHouse/ClickHouse/pull/64037) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
* 为 recoverLostReplica 补充缺失设置。 [#64040](https://github.com/ClickHouse/ClickHouse/pull/64040) ([Raúl Marín](https://github.com/Algunenano)).
* 修复使用分析器时的 SQL 安全访问检查。 [#64079](https://github.com/ClickHouse/ClickHouse/pull/64079) ([pufit](https://github.com/pufit)).
* 修复分析器：DAG 应只使用插值表达式。 [#64096](https://github.com/ClickHouse/ClickHouse/pull/64096) ([Yakov Olkhovskiy](https://github.com/yakov-olkhovskiy)).
* 修复 Azure 备份在非原生复制场景下，以 1 MiB（读取缓冲区大小）而非 `max_upload_part_size` 写入分段数据块的问题。 [#64117](https://github.com/ClickHouse/ClickHouse/pull/64117) ([Kseniia Sumarokova](https://github.com/kssenii)).
* 在备份复制期间正确回退。 [#64153](https://github.com/ClickHouse/ClickHouse/pull/64153) ([Antonio Andelic](https://github.com/antonio2368)).
* 避免 CREATE TABLE AS 物化视图时出现 LOGICAL\_ERROR。 [#64174](https://github.com/ClickHouse/ClickHouse/pull/64174) ([Raúl Marín](https://github.com/Algunenano)).
* 查询缓存：将针对不同数据库的相同查询视为不同查询。 [#64199](https://github.com/ClickHouse/ClickHouse/pull/64199) ([Robert Schulze](https://github.com/rschu1ze)).
* Keeper 忽略 `text_log`。 [#64218](https://github.com/ClickHouse/ClickHouse/pull/64218) ([Antonio Andelic](https://github.com/antonio2368)).
* 修复 Buffer 表使用 PREWHERE 时的 Bad cast 逻辑错误。 [#64388](https://github.com/ClickHouse/ClickHouse/pull/64388) ([Nikolai Kochetov](https://github.com/KochetovNicolai)).
