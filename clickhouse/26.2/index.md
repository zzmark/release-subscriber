---
title: ClickHouse 26.2 更新总结
description: ClickHouse 26.2 的中文更新总结、原始 Changelog、简体中文翻译与 Release 演示。
---

<ReleaseCard
  software="ClickHouse"
  version="26.2"
  date="2026-02-26"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2026"
  accent="#5865A8"
  presentation-url="https://presentations.clickhouse.com/2026-release-26.2/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 26.2 是冬季常规版本，重点推进全文与向量搜索、可观测性、认证和数据湖能力：文本索引与 `QBit` 正式达到生产就绪，ClickStack 可直接嵌入 ClickHouse，新增 TOTP 认证、Google BigLake 目录集成、按数据库延迟加载表，以及多项 Iceberg 改进。升级前应重点检查插入去重默认值、统计信息存储格式、Queue 系统表命名、`Variant` 函数错误处理、PostgreSQL `DATE` 映射和 `FINAL`/行策略相关语义变化。

## Breaking Change

- 所有 INSERT 默认启用去重；异步插入与物化视图若需保留旧行为，应显式设置 `deduplicate_insert='backward_compatible_choice'`，并相应处理 `deduplicate_blocks_in_dependent_materialized_views`。
- 统计信息改为统一存储在单个文件中；S3Queue/AzureQueue 的内存元数据受到限制，相关系统表改名为 `azure_queue_metadata_cache` 和 `s3queue_metadata_cache`。
- 对 `Variant` 子类型应用不兼容函数时改为抛出异常，不再静默返回 NULL；PostgreSQL `DATE` 现在推断为 `Date32`。
- 明确调整 `do_not_merge_across_partitions_select_final` 的自动决策规则，并默认启用 `apply_row_policy_after_final`；依赖旧版 `FINAL` 与 ROW POLICY/PREWHERE 行为的查询需要复核。
- 显式定义列的 S3 表会校验远端文件 Schema；表键表达式不再允许子查询；Arrow/ArrowStream 中 `Date` 改用原生 `date32` 序列化。

## New Feature

- 文本索引和用于量化位压缩向量的 `QBit` 类型达到生产就绪；向量搜索可利用集群副本分摊向量索引分片的搜索负载。
- ClickStack 可直接从 ClickHouse 使用，并新增 `system.jemalloc_stats`、`system.jemalloc_profile_text`、`system.tokenizers`、`system.user_defined_functions`、`system.fail_points` 等诊断系统表。
- 新增 TOTP 认证、`lazy_load_tables` 延迟加载、按时间刷新持续输入块、Google BigLake 目录集成，以及 Glue 目录基于角色的访问。
- 新增 `primes` 表函数与 `system.primes`、`xxh3_128` 哈希函数、OKLAB/sRGB 色彩转换函数和 `OPTIMIZE ... DRY RUN PARTS` 合并模拟。
- Iceberg 表支持 `ALTER TABLE RENAME COLUMN`，并继续增强读写能力；异步插入支持并行 quorum。

## Performance

- 主键中的确定性表达式可用于数据跳过，`assumeNotNull`、`coalesce`、`ifNull` 等表达式也能更充分利用主键与跳数索引。
- JOIN 运行时过滤默认启用，RIGHT/FULL JOIN 的未匹配行可并行处理；复杂谓词下的并行 Hash Join 与多 JOIN 等价集合优化进一步提速。
- 改进 JSON 解析、数值类型 `uniq`、`T64` 编解码、minmax 索引构建、统计信息缓存和用户态页缓存，减少复制与内存占用。
- 优化大量数据片段下的 ReplicatedMergeTree 副本克隆、Keeper 热点路径、FINAL 查询、UNION ALL 各分支的延迟物化，以及远程表函数的并行读取。

## Bugfix / Security

- 修复多项可能导致错误结果、崩溃、死锁或数据损坏的问题，覆盖 JOIN 重排、分区裁剪、查询条件缓存、异步插入、字典递归依赖、向量相似度索引和对象存储表变更等路径。
- 修复 Iceberg、Delta Lake、S3/Azure、PostgreSQL、SQLite、MySQL、Kafka、MongoDB 等外部系统或格式的兼容性与边界问题。
- 修复复制、备份恢复、TTL、投影、物化视图、轻量级删除、窗口函数、Parquet/Arrow/JSON/CSV 解析及分布式查询中的大量稳定性问题。
- 加强认证、访问控制、行策略、命名集合依赖与 failpoint 可观测性，并修复部分撤销权限等安全相关异常。
