---
title: ClickHouse 26.6 更新总结
description: ClickHouse 26.6 的中文更新总结、原始 Changelog、简体中文翻译与 Release 演示。
---

<ReleaseCard
  software="ClickHouse"
  version="26.6"
  date="2026-06-25"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2026"
  accent="#168AAD"
  presentation-url="https://presentations.clickhouse.com/2026-release-26.6/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 26.6 是十周年版本，集中加入持续查询、假设性跳数索引与 `EXPLAIN WHATIF`、多阶段分布式查询执行、内存预留机制、原生 GeoJSON 与 Mapbox Vector Tiles、SQL 内嵌模型推理等能力，并显著扩展系统表自描述、SQL 兼容性和命令行易用性。升级前必须确认服务器 CPU 支持 AVX2，并检查插入去重、`SYSTEM INSTRUMENT`、空源分区替换及已移除实验性功能带来的兼容性影响。

## Breaking Change

- 默认 x86 构建目标由 x86-64-v2（SSE4.2）提高到 x86-64-v3（AVX2）；老旧 CPU 需要改用 `amd64compat` 构建。
- 插入去重默认切换为按整个插入块计算的 `new_unified_hash`，与旧版按 part/partition 去重的行为不同。
- `SYSTEM INSTRUMENT` 将 `parameters` 更名为 `arguments`，旧列名和语法不再受支持。
- `ALTER TABLE ... REPLACE PARTITION ... FROM ...` 在源分区为空时默认报错，不再静默清空目标分区。
- 移除长期未受支持的实验性查询去重设置，以及 KQL 的 `array_sort_asc`、`array_sort_desc` 系列函数。

## New Feature

- `MergeTree` 支持基于连续快照读取的持续查询，为通用流式查询能力奠定基础。
- 新增会话级假设性跳数索引与 `EXPLAIN WHATIF`，无需物化索引即可估算跳过比例和成本。
- 新增 `/schema` 依赖关系可视化页面、PNG 输出格式、CLI 交互式 `help` 与统一的 `system.documentation` 文档表。
- 新增 GeoJSON 输入、Mapbox Vector Tiles 编码、Azure Data Lake Storage Gen2 写入，以及多项 Iceberg、S3 与消息队列能力。
- 扩展 PostgreSQL 风格 SQL 兼容性，包括 `LOCALTIME`、`LOCALTIMESTAMP`、`date_part`、`EXTRACT`、`SOME`/`ALL`、`* LIKE`/`* ILIKE` 等。
- 新增 SQL 内嵌模型推理函数、向量量化函数、分片聚合、多阶段分布式查询执行和内存预留。

## Performance

- Keeper 通过新的磁盘原生存储和日志/快照路径优化，吞吐能力显著提升。
- 优化简单查询、主键分析、`LIMIT BY`、JOIN、聚合、JSON/Parquet/Iceberg 读取及多类字符串和数组函数。
- 新增 `ipnsort`、`driftsort` 排序算法，并在多种数据分布下自动选择更合适的排序策略。
- 多阶段分布式执行、分片聚合和更细粒度的内存预留改善了大型分布式查询的扩展性与稳定性。

## Bugfix / Security

- 修复 MergeTree、ReplicatedMergeTree、投影、轻量删除、分区操作及后台合并中的大量正确性和稳定性问题。
- 修复 Iceberg、Delta Lake、S3、Azure、HDFS、Kafka、PostgreSQL 与 MySQL 集成中的读取错误、崩溃和资源泄漏。
- 修复查询分析器、JOIN、窗口函数、聚合、JSON、日期时间及多种数据类型转换中的错误结果和异常。
- 加固客户端对服务器返回展示字符串的处理，防止恶意控制字节注入和无界内存分配。
