---
title: ClickHouse 26.1 更新总结
description: ClickHouse 26.1 的中文更新总结、原始 Changelog、简体中文翻译与 Release 演示。
---

<ReleaseCard
  software="ClickHouse"
  version="26.1"
  date="2026-01-29"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2026"
  accent="#5865A8"
  presentation-url="https://presentations.clickhouse.com/2026-release-26.1/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 26.1 是新年常规版本，重点扩展 Keeper、Variant、文本索引、投影索引和数据湖能力，并集中优化 JOIN、并行副本、全文检索、宽表写入与内存管理。升级前应重点检查已移除的编解码器和 `Lazy` 数据库引擎、`joinGet` 权限收紧、索引文件名转义、CPU 抢占式调度默认值，以及 `Hash` 输出变化对现有系统的影响。

## Breaking Change

- 移除 `DEFLATE_QPL` 与 `ZSTD_QAT` 编解码器；升级前必须把已有数据转换为其他编解码器。
- 移除 `Lazy` 数据库引擎和 `metric_log` 的 `transposed_with_wide_view` 模式，并撤销对简单 `ALIAS` 列执行 `INSERT` 的支持。
- `joinGet` 与 `joinGetOrNull` 开始强制检查底层 Join 表的 `SELECT` 权限；原先未显式授权的用户和应用可能收到 `ACCESS_DENIED`。
- 默认启用工作负载 CPU 抢占式调度；索引文件名开始转义，旧版本创建的非 ASCII 名称索引需要结合 `escape_index_filenames` 处理。
- `Hash` 输出格式不再受块大小影响，因此同一数据相较旧版本可能产生不同的哈希值。

## New Feature

- ClickHouse Keeper 新增 HTTP API 与内嵌 Web UI，并增加 `zookeeper_info` 系统表和可动态调整集群配置的 `rcfg` 命令。
- 异步插入去重扩展到依赖物化视图，支持在同一写入链路中维持幂等性与 exactly-once 语义。
- 投影索引采用新的语法与框架；文本索引支持 `Array(String)` 和 `Array(FixedString)` 列，并新增 `sparseGrams` tokenizer。
- `Variant` 可用于所有函数，`use_variant_as_common_type` 默认启用；实验性支持 `Nullable(Tuple)`，QBit 从实验阶段晋升为 Beta。
- 新增 `reverseBySeparator`、`mergeTreeAnalyzeIndexes`、`cosineDistanceTransposed`、`icebergLocalCluster` 等函数或表函数，并为 `system.parts` 增加 `files` 列。
- 数据湖新增 Paimon REST catalog、Delta Lake deletion vector 和 Google Cloud Storage 支持；ClickHouse 客户端可覆盖 TLS SNI。

## Performance

- 跳过索引流式读取默认启用，并增强 JOIN 过滤器下推、空右表短路、窗口函数、相关子查询与并行副本读取。
- 扩展 JIT 编译覆盖范围，优化 `LowCardinality` 上的 `DISTINCT`、JSON 路径聚合、文本索引与 `sparseGrams` 全文检索。
- 宽表写入采用自适应缓冲区，可显著降低 INSERT 与合并内存；同时改进 AST、jemalloc 脏页回收和查询内存限制执行。
- 新增 max-min fair 并发调度器，提升高超卖场景的公平性，避免短查询被长期运行查询挤占。
- 优化 Parquet Reader V3、Iceberg、S3Queue 有序模式、倒序读取、posting list 压缩以及外部聚合、排序和 JOIN 的落盘行为。

## Bugfix / Security

- 新增 `input_format_binary_max_type_complexity`，限制二进制格式可解码的类型节点总数，以降低恶意载荷风险。
- 修复 MergeTree、ReplicatedMergeTree、Keeper、并行副本、投影、JOIN、JSON/Variant、异步插入和备份恢复等路径中可能导致错误结果、崩溃、死锁或数据损坏的问题。
- 修复 Iceberg、Delta Lake、S3、Azure、GCS、Parquet、Kafka、PostgreSQL、MySQL 与 MongoDB 等外部存储和数据源的兼容性及稳定性问题。
- 修复访问控制、角色授权、行策略、字典加载与资源清理等边界场景，降低权限判断错误和异常状态残留风险。
