---
title: ClickHouse 26.3 更新总结
description: ClickHouse 26.3 LTS 的中文更新总结、原始 Changelog、简体中文翻译与 Release 演示。
---

<ReleaseCard
  software="ClickHouse"
  version="26.3"
  date="2026-03-26"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2026"
  accent="#5B8C3A"
  release-label="LTS"
  presentation-url="https://presentations.clickhouse.com/2026-release-26.3/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 26.3 是春季长期支持版本，重点增强 Map、JSON、全文索引、查询优化与数据湖能力：Map 列新增分桶序列化，支持物化 CTE、WebAssembly UDF 与多方言 SQL，数据湖读取在多核环境下获得数量级提升，并完善 Parquet 元数据缓存和 Iceberg 元数据预取。升级前必须评估嵌套类型序列化格式带来的降级风险，同时复核默认启用异步插入、SQL `NOT` 优先级、MySQL 类型映射以及已移除功能对现有工作负载的影响。

## Breaking Change

- 嵌套类型现在会继承内部数据类型的序列化版本；26.3 写入的相关新数据分区片段可由新版本读取，但旧版本无法读取。升级本身安全，升级后降级可能导致嵌套类型列中的新数据不可读，必须预先制定回滚方案。
- 移除实验性的 `hypothesis` 跳过索引类型和 `detectProgrammingLanguage` 函数；依赖它们的建表语句或查询需要先行调整。
- `NOT` 运算符优先级改为符合 SQL 标准，现在低于 `IS NULL`、`BETWEEN`、`LIKE` 和算术运算符；依赖旧解析方式的查询结果可能改变。
- 默认启用异步插入，小型写入会自动批处理；可通过兼容性版本或用户配置、会话、查询、MergeTree 表级设置恢复旧行为。
- `mysql_datatypes_support_level` 默认启用 `decimal,datetime64,date2Date32`，MySQL `DATE`、`DECIMAL`/`NUMERIC` 以及带精度的 `DATETIME`/`TIMESTAMP` 映射随之变化。
- 跳过索引的长文件名现在会按设置进行哈希；新服务器兼容旧数据分区片段，但旧服务器在滚动降级期间可能忽略使用新命名方式的长名称索引。

## New Feature

- MergeTree 的 Map 列新增分桶序列化，按键哈希分桶后，单键读取无需扫描整列；官方数据表明，不同 Map 大小下单键查询可提升约 2–49 倍。
- 支持物化 CTE，可在一次查询执行中只计算一次 CTE，并把结果保存在临时表中复用。
- 新增 `naturalSortKey`、JSON 类型的 `has`、文本索引读取函数 `mergeTreeTextIndex`、只读表设置 `table_readonly`，并增强 `EXPLAIN`、Unicode 处理与 SQL 标准兼容性。
- 新增实验性的 WebAssembly UDF、基于 `polyglot` 的外部 SQL 方言支持、`ALP` 浮点压缩编解码器，以及 JSON 列的延迟类型提示。
- Iceberg 支持执行 `expire_snapshots`，并新增辅助 ZooKeeper、按端口配置 HTTP 路由、受当前授权约束的访问实体恢复等能力。

## Performance

- 修复对象存储读取管道未按处理线程扩展的问题，数据湖读取在多核机器上可获得数量级提升，官方示例约为 40 倍。
- 新增 Parquet 元数据 SLRU 缓存与 Iceberg 元数据异步预取，减少重复下载和查询路径中的目录调用。
- 扩展分区裁剪、主键裁剪与过滤器下推场景，并支持依据优化器统计信息交换 ANTI、SEMI、FULL JOIN 的两侧。
- S3Queue 有序模式利用 ListObjectsV2 `StartAfter` 避免反复列出完整历史前缀；TTL DELETE 可使用纵向合并，子列读取也减少了内存占用。
- 优化文本索引、ARM 上的 LZ4 解压缩、Decimal 批量转换、并行窗口函数、Keeper 内存占用及多项聚合与连接热点路径。

## Bugfix / Security

- 修复 `loop(table)` 绕过解释器层、进而绕过行策略和列级授权读取数据的安全问题，并堵住通过本机 `remote()`、`cluster()` 等函数在缺少 `SHOW_COLUMNS` 权限时执行 `DESCRIBE` 的 RBAC 绕过。
- 强制标量 `file()` 与 `DESCRIBE TABLE file()` 执行 `READ ON FILE` 权限检查，并禁止从本地文件读取 Google 凭据。
- 修复 Keeper 安全 Raft 端口未采用配置的 OpenSSL 密码套件和 DH 参数、TOTP 认证配置校验，以及 HTTP Basic Auth 无填充 Base64 凭据兼容性问题。
- 修复 JOIN、并行副本、投影、JSON/Dynamic/Variant、异步插入、复制与合并、备份恢复等路径中可能导致错误结果、崩溃、死锁或数据损坏的大量问题。
- 修复 Iceberg、Delta Lake、S3、Azure、GCS、PostgreSQL、MySQL、MongoDB、Kafka 等外部存储和数据源的兼容性、认证与稳定性问题。
