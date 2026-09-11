---
title: ClickHouse 25.10 更新总结
description: ClickHouse 25.10 的中文更新总结、原始 Changelog、简体中文翻译与 Release 演示。
---

<ReleaseCard
  software="ClickHouse"
  version="25.10"
  date="2025-10-31"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2025"
  accent="#C96A24"
  presentation-url="https://presentations.clickhouse.com/2025-release-25.10/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 25.10 引入表别名、负数 LIMIT/OFFSET、自动列统计信息，以及可在查询时调整向量搜索精度的实验性 QBit 类型。JOIN 新增运行时布隆过滤与复杂条件下推，String 新物理布局和延迟列复制减少内存开销。升级需检查 Dynamic 连接键、结构推断默认可空性和 Keeper 异步复制的兼容要求。

## Breaking Change

- Parquet、ORC、Arrow 的结构推断默认遵循元数据中的可空性，文本格式不变。查询结果缓存忽略 `log_comment`，需要隔离缓存时改用 `query_cache_tag`。
- 禁止 Dynamic 类型作为 JOIN 键，应先转换为所需类型；`query_plan_use_new_logical_join_step` 更名为 `query_plan_use_logical_join_step`。
- `storage_metadata_write_full_object_key` 默认开启且不可关闭；需要回退时，仅兼容 25.x 版本。复制去重时间窗口由一周缩短为一小时。
- Keeper 默认启用内部异步复制。从早于 23.9 的版本升级时，需先升级至 23.9 或更新版本，或在升级前关闭异步复制、完成后再启用。
- 文本索引分词器采用新语法，`searchAny`/`searchAll` 更名为 `hasAnyTokens`/`hasAllTokens`；移除文件系统缓存的 `cache_hits_threshold`。

## New Feature

- 新增 Alias 表引擎、负数 LIMIT/OFFSET、LIMIT BY ALL，以及完整的 `IS NOT DISTINCT FROM` 运算符支持。
- MergeTree 可自动为合适的列创建统计信息；`ALTER TABLE REWRITE PARTS` 应用新的物理存储设置，`SYSTEM RECONNECT ZOOKEEPER` 重建 Keeper 会话。
- 实验性 QBit 按位切片存储向量，配合 `L2DistanceTransposed` 在运行时调整搜索精度；新增 sparse_gram 文本布隆过滤器索引。
- 支持查询 Apache Paimon，新增 DeltaLake 元数据日志；新增进制转换、单样本 t 检验、Prometheus 直方图分位数及大小写不敏感的前后缀函数。
- 可将部分数据跳过索引的物化从插入推迟至合并，也可指定在插入或合并期间跳过哪些索引。

## Performance

- JOIN 使用运行时布隆过滤器缩小扫描范围，并从复杂析取条件推导各表过滤条件；延迟列复制减少 JOIN 和 ARRAY JOIN 的内存复制。
- String 可采用独立大小子流，改善压缩与子列读取；StringZilla 利用 SIMD 加快字符串搜索，优化文本索引构建和直接读取。
- 查询条件缓存提前过滤，减少主键和数据跳过索引分析；优化 ReplacingMergeTree FINAL、大量小查询、原生协议日志压缩和客户端补全。
- Iceberg 支持按表顺序读取，数据湖目录查询使用并行副本；物化视图插入前跨线程合并数据，减少生成的数据片段。

## Bugfix / Security

- 修复列 TTL 可能导致的数据损坏、轻量更新补丁应用、JSON/日期时间转换及 LowCardinality 分组结果错误。
- 完善 Buffer、loop、S3 URL 授权检查和凭据遮蔽；拒绝禁止使用的请求头，支持删除 Keeper 节点时检查节点自身 ACL。
- 修复复制数据库恢复、KeeperMap 元数据传播、对象存储目录回滚、ArrowStream/HTTP 异常崩溃及多处内存泄漏。
- 修复复杂 JOIN、PREWHERE、文本索引与查询条件缓存组合，以及 QBit 可空参数处理；异步日志失败时捕获异常以避免进程中止。
