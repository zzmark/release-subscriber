---
title: ClickHouse 25.4 更新总结
description: 延迟物化、默认查询条件缓存、CPU 工作负载调度、相关子查询，以及 Iceberg 和 Delta Lake 数据湖能力扩展。
---

<ReleaseCard
  software="ClickHouse"
  version="25.4"
  date="2025-04-22"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2025"
  accent="#5B8C3A"
  presentation-url="https://presentations.clickhouse.com/2025-release-25.4/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 25.4 通过延迟物化和默认开启的查询条件缓存减少无效读取，并继续改进 JOIN、向量搜索及对象存储上的合并效率。CPU 工作负载调度和过载拒绝机制增强资源管理；Iceberg 时间旅行、元数据缓存、Delta Lake 分区裁剪和可刷新的只读 MergeTree 表进一步扩展数据湖能力。相关子查询现已支持 WHERE 中的 EXISTS 场景，升级时还需留意旧 MongoDB 集成的移除。

## Breaking Change

- 移除旧版 MongoDB 集成，`use_legacy_mongodb_integration` 设置不再生效。
- `allow_materialized_view_with_bad_select` 为 `false` 时，检查物化视图所有列是否与目标表匹配。
- 修复 `dateTrunc` 对负数 Date/DateTime 参数的处理；SummingMergeTree 校验会避免聚合分区键和排序键所用的列。

## New Feature

- 新增 CPU 槽位工作负载调度。可根据 CPU 等待与忙碌时间之比，在配置阈值间按概率拒绝查询，通过渐进式降级缓解过载。
- WHERE 子句的 EXISTS 表达式支持相关子查询；此版本的支持范围应以这一场景为准。
- Iceberg 支持按历史时间戳查询，并缓存元数据和清单文件；DeltaLake 支持 Azure Blob Storage 及分区裁剪，官方演示通过切换至新实现启用裁剪。
- 只读磁盘上的 MergeTree 表支持后台刷新、发现新数据片段，可供数量不受限的分布式读取端访问持续更新的数据集。数据库元数据可存储在自定义磁盘上，目前仅支持服务器全局配置。
- `clickhouse-local --path` 支持重启后保留数据库；Kafka 可在建表设置中直接配置 SASL 凭据；集群配置支持 `bind_host`，PostgreSQL 协议支持 SCRAM-SHA-256，SSH 支持密码身份验证。
- 新增数组编辑距离与相似度函数、`toInterval` 及默认列压缩编解码器设置。`sparseGrams`、`sparseGramsHashes` 虽已加入，但上游明确要求暂勿使用，后续版本会更改实现。

## Performance

- 延迟读取非必要列，在 ORDER BY、LIMIT 等处理后才物化需要的数据；查询条件缓存默认开启，并减少写入缓存时的锁开销。
- 合并过滤等值条件以构建更有效的 JOIN 哈希键；动态分片可按两侧主键前缀分配 JOIN 工作，该优化由 `query_plan_join_shard_by_pk_ranges` 控制且默认关闭。
- 新增专用向量相似度索引缓存，取代早期数据跳过索引缓存，并减少索引过量内存分配，提高重复 ANN 查询效率。
- Iceberg 支持列上下界数据裁剪和无过滤 COUNT 优化；ORC 新增异步 I/O 预取。可配置合并并行刷写列数，上游预计可将面向 S3 的垂直合并内存占用降低至约原来的 1/25。
- 改进并行副本任务分配、Keeper 批量读取、异步插入内存预分配、排序与 Native 格式内存占用。

## Bugfix / Security

- 隐藏 RabbitMQ、Nats、Redis、AzureQueue 凭据和 Azure 访问签名；Merge 引擎新增底层表访问权限校验。
- 修复存在其他向量索引列时，未建索引列的向量搜索返回错误结果的问题，以及 Distributed 查询忽略 FINAL、MongoDB 过滤/分组查询、聚合投影和 Map/Nullable 处理等正确性问题。
- 修复 ALTER 后立即 RENAME 可能覆盖复制数据库元数据的问题，改善可刷新物化视图在新增副本、异常关闭及禁止插入场景下的行为。
- 修复 S3/AzureQueue 并发初始化与上下文失效崩溃、物化视图推送错误无限重试、命名会话关闭时序及 Iceberg/Delta Lake 元数据读取异常。
