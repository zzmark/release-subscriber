---
title: ClickHouse 26.10 更新总结
description: ClickHouse 26.10 的中文更新总结、原始 Changelog、简体中文翻译与 Release 演示。
---

<ReleaseCard
  software="ClickHouse"
  version="26.10"
  date="2026-10-22"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2026"
  accent="#C96A24"
  presentation-url="https://presentations.clickhouse.com/2026-release-26.10/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 26.10 是秋季 OSS 月度常规版本。重点包括更省内存的哈希表、扫描阶段字符串筛选、Top-K 动态筛选、磁盘查询缓存、Cluster／Overlay 数据库引擎，以及按查询调度工作负载。轻量级更新与 `IN` 集合溢写已正式可用；列缓存、LATERAL JOIN、LogsQL 等功能仍带实验性限制。升级前应重点检查混合版本集群的查询分析器、seccomp、命名集合权限、JOIN 内存阈值和旧表元数据。

本页收录官方月度 Changelog 的全部 1,300 条记录及 66 页演示，讲者备注同样保留并翻译。两份官方资料对部分行为表述不一致：演示称 `IN` 溢写默认关闭，而 Changelog 明确比例阈值 `max_bytes_ratio_before_external_set = 0.5` 默认生效；演示备注也指出无序查询哈希条目的解析方式及 `OrNull` 变体描述与其核对的实现不符。原文与译文分别保留这些表述，使用相关功能前应核对具体构建与设置。

## Breaking Change

- 完全移除旧查询分析路径；混合版本集群应在升级任何服务器前，对所有服务器设置 `enable_analyzer = 1`，否则旧发起节点可能因结果列命名差异报 `NOT_FOUND_COLUMN_IN_BLOCK`。移除 `use_analyzer_for_mutations`，旧 AST 谓词下推设置 `enable_optimize_predicate_expression` 不再生效。
- 官方软件包及 Docker 镜像的 `seccomp` 默认设为 `trap`。禁止 `seccomp` 系统调用的沙箱须在升级前改为 `log` 或 `disabled`；使用可执行 UDF 时也可能需要禁用。磁盘配置中未知或未使用的元素现在会被拒绝，应清理无效配置，或明确设置 `<skip_check_for_incorrect_settings>1</skip_check_for_incorrect_settings>`。
- SQL 定义的用户、角色及设置配置文件现在严格执行设置约束与 `allow_feature_tier`；存储设置、角色或所分配设置配置文件违反约束或 `allow_feature_tier` 的 SQL 用户将无法登录。覆盖命名集合中已有键需要该集合上的 `SHOW NAMED COLLECTIONS SECRETS` 权限，`NOT OVERRIDABLE` 键仍不可覆盖；已有表若覆盖这类键，升级后无法加载且服务器不能启动，须提前重建表并移除覆盖，或将该键改为可覆盖。
- 所有哈希 JOIN 算法统一使用 `max_bytes_before_external_join`／`max_bytes_ratio_before_external_join` 作为溢写阈值，`max_rows_in_join`／`max_bytes_in_join` 恢复为硬上限。`grace_hash` 需要非零溢写阈值；可用 `legacy_join_size_limits_trigger_spilling = 1` 或 26.8 及更早的 `compatibility` 恢复旧行为。
- `arrayCount` 返回类型改为 `UInt64`；滚动升级时，应针对分片侧查询使用的用户，在已升级服务器上启用 `array_count_legacy_uint32_result`，全部升级后移除。从文本到 `Nullable` 的 `accurateCast` 对不可表示的值改为抛错，需要旧行为时使用 `accurateCastOrNull`。`arrayJoin` 旁的非确定性函数改为按输出行求值；`arrayjoin_nondeterministic_functions_before_expansion = 1` 可保留按源行求值。依赖数据块／行序的函数现在看到展开后的数据块，`legacy_array_join_function_nondeterministic_evaluation = 1` 可恢复旧行为。
- `SummingMergeTree` 的 `SELECT ... FINAL` 不再删除求和列全部为零的行；后台合并仍会删除。`skip_unavailable_shards = 1` 下，若返回任何数据前所有分片均被跳过，现在会使整个查询报错，而非返回空结果；没有设置可恢复旧空结果行为。列 TTL 重置源列时会重新计算依赖的 `MATERIALIZED` 列，表达式必须能处理源列默认值。
- `system.metric_log` 默认改用 128 桶的 Map 模式；指标仍有同名 `ALIAS` 列，旧表重命名为 `metric_log_0`。需要旧宽表模式时配置 `<schema_type>wide</schema_type>`。部分系统日志未显式设置 TTL 时会采用默认 TTL，应核对留存需求；`system.codecs.is_experimental` 改用 `tier = 'Experimental'`。
- 升级前将 `use_compact_format_in_distributed_parts_names` 设为 `1`，并等待 Distributed 异步插入队列排空。实验性 ZXC 编解码器块格式已改变，新版本无法读取旧 `CODEC(ZXC)` 数据，会报 `CANNOT_DECOMPRESS`；须在升级前改用其他编解码器重编码，或升级后重新插入数据。
- 空范围 `-Resample` 和无参数的 `covarSampMatrix`、`covarPopMatrix`、`corrMatrix` 所产生的零字节状态现在被拒绝，包含这类列的旧表不再加载。升级前，对支持 `DROP COLUMN` 的引擎删除该列；对不支持的 `Log`、`TinyLog`、`StripeLog`、`Set`、`Join`、`File` 引擎，须删除整个表。仅能作为窗口函数的函数，其聚合状态类型也被拒绝；升级前应删除或重写此类列，表引擎表达式中也不能构建此类状态。
- 远端数据库名称为空的 `Remote`／`RemoteSecure`／`Cluster` 数据库会使升级后的服务器无法启动，须在升级前删除这些数据库。
- MySQL 连接配置 `ssl_ca` 或 `ssl_ca_pem` 后，会严格校验证书链和主机名，须确认所配置 CA 签发了服务器证书，且证书列出连接使用的主机名／IP。`ATTACH TABLE ... FROM` 还要求源目录上的 `READ ON FILE` 与 `WRITE ON FILE`。依赖 `clickhouse-client --ignore-error` 退出码判错的脚本，应移除该选项或检查 `stderr` 中的错误。

## New Feature

- `IN` 子查询／表集合支持磁盘溢写并正式可用：默认比例阈值为适用服务器或用户可用内存的一半；比例计算不包含 `max_memory_usage`，可用绝对阈值提前溢写。两个阈值均为 `0` 才全部保留在内存。轻量级 `UPDATE` 与补丁数据分片也已正式可用。
- 查询缓存可存入文件系统缓存，在重启后保留；ClickHouse Cloud 的分布式缓存还可在副本间共享。新增 Cluster 与 Overlay 数据库引擎，支持按集群名称访问远端数据库，或按源顺序组合多个数据库的表。
- 支持任意 `ON` 条件的分块嵌套循环 JOIN，并支持溢写；其代价可接近交叉连接，是规划器的兜底方式。工作负载可使用 `fifo`、`fair`、`las`、`priority` 调度，并在内存压力下触发溢写。
- 新增函数组合运算符、插入行数配额、位打包及数组／Map 函数，支持将 SQLite 数据库文件作为导入导出格式。Web 界面加入笔记本单元格、Markdown、保存／加载标签页及查询格式化功能。
- 实验性能力包括 LATERAL JOIN、列缓存、XGBoost 字典、LogsQL 和 IPCrypt；演示还将 Freeform 格式列为实验性，并介绍实验性的 Elasticsearch 表引擎。PCO 编解码器在 Changelog 中明确标为 Beta，Trino 与 Kusto 方言也进入 Beta，不能视作全部功能已正式稳定。
- 数据湖增加 `plain_rewritable` 硬链接、Parquet／Iceberg VARIANT 支持，并改进 Unity Catalog 与 Iceberg v3 删除向量。硬链接默认关闭，启用后旧版服务器无法读取该磁盘；实验性集成应按各自限制评估。

## Performance

- 大型哈希表切换到 Robin Hood 哈希，提高装载因子，降低 `GROUP BY`、`uniqExact` 和 JOIN 的内存占用；演示中的收益依赖基数、线程数及工作负载，不能直接套用到所有查询。
- 查询条件缓存支持含当前时间的条件，将边界映射到时间网格；扫描时应用字符串筛选，避免复制不匹配的值。Top-K 边界可下推至表扫描与 Parquet 读取器，配合主键、minmax 和行组统计信息减少读取。
- 默认启用按主键范围分片的归并 JOIN；高负载时收窄查询流水线，减少部分聚合状态和内存。优化 LowCardinality／字符串聚合、递归查询中的物化辅助 CTE，以及 Parquet 布隆过滤器和延迟列读取。
- `plain_rewritable` 磁盘并行列举元数据、使用按路径的锁，并通过批量删除移除数据分片，减少对象复制和全盘元数据锁竞争。

## Bugfix / Security

- 更新 MongoDB 驱动，修复连接监控重连中的越界写入 CVE-2026-96746；更新 `expat` 至 2.9.0，修复恶意备份清单在 `RESTORE` 期间触发的拒绝服务 CVE-2026-66046 及其他安全问题。
- 修复多种行策略、命名集合及文件权限检查问题，防止隐藏行值、受限 HTTP 头或凭据通过错误路径暴露；加强 SQL 可访问 HTTP 客户端的头名称验证。
- 修复查询分析器、JOIN、数组、聚合、窗口函数、数据类型转换及查询优化中的错误结果、崩溃和异常；修复复制、备份恢复、对象存储、轻量级更新及数据湖集成的数据一致性和稳定性问题。
- 改进 PostgreSQL 协议兼容性、FileLog 通配路径和重置读取功能、PromQL 兼容性与 chdig 集群／Keeper 浏览。各项示例和实验性限制详见完整 Changelog 与演示备注。
