---
title: ClickHouse 26.9 更新总结
description: ClickHouse 26.9 的中文更新总结、原始 Changelog、简体中文翻译与 Release 演示。
---

<ReleaseCard
  software="ClickHouse"
  version="26.9"
  date="2026-09-21"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2026"
  accent="#C96A24"
  presentation-url="https://presentations.clickhouse.com/2026-release-26.9/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 26.9 是秋季 OSS 月度版本。新增带边界条件的 `LIMIT`、可溢写到磁盘的 `DISTINCT`、增量刷新物化视图、按身份验证方式限定授权范围的令牌，以及线性回归聚合函数。演示稿还重点介绍了文本索引、并行副本、对象存储读取和 ARM 平台上的性能改进。升级前应重点检查分析器设置、默认压缩方式，以及已移除功能在权限和表元数据中的引用。

## Breaking Change

- 旧查询分析器已移除；`enable_analyzer = 0` 不再可用，`compatibility` 也不能恢复旧行为。
- 默认压缩方法由 `LZ4` 改为 `ZSTD(3)`，影响网络通信及部分存储流；MergeTree 列数据会按数据分片大小在 `LZ4` 与 `ZSTD(3)` 间选择。需要旧压缩方式的部署应按用途显式配置。
- 移除 CatBoost 集成、`WasmEdge` 引擎、实验性 `WINDOW VIEW` 与旧的资源调度磁盘选项。升级前须清理相关授权、DDL 队列条目和表定义，否则可能出现配置解析或表加载失败。
- `Nullable(Tuple(...))` 默认启用，提取缺失的元组子列时会返回 `NULL`；依赖旧类型或默认值行为的分区键、排序键、TTL 和跳数索引应在升级前检查。

## New Feature

- `LIMIT ... AFTER`、`LIMIT ... UNTIL` 可按数据流中的条件边界取行；`DISTINCT` 可在达到内存阈值后将中间结果溢写到磁盘。
- 刷新型物化视图支持 `REFRESH ... APPEND INCREMENTAL`；针对 Iceberg 目标，刷新游标与快照摘要可原子提交。
- 新增 `CREATE TOKEN`，身份验证方式可通过 `GRANTS (...)` 限定会话权限；同时提供九个符合 SQL 标准的 `regr_*` 线性回归聚合函数。
- Merge 表可配合基于计划的并行副本读取；新增表大小和数量限制、JSON 子列方括号访问方式，以及无需 Keeper 逐文件协调的 S3Queue `exclusive` 模式。

## Performance

- 文本索引支持更多 `LIKE`/`ILIKE` 模式，并改进倒排列表、短语搜索和索引合并；`ARRAY JOIN` 的筛选可以提前应用于数组元素。
- 列统计信息可直接回答部分 `min`、`max` 和 `count` 聚合；对象存储中的子列标记可并行加载，连接复用减少了额外连接与 TLS 握手。
- 优化 AArch64 上的小块复制、NEON 过滤和编解码路径；同时改进 k 路归并、哈希连接、递归 CTE 及 `uniq` 系列聚合。

## Bugfix / Security

- 修复查询分析器、JOIN、`ARRAY JOIN`、聚合、窗口函数和约束优化中可能导致错误结果或异常的问题。
- 修复 MergeTree 数据分片、复制、轻量级更新、对象存储及数据湖集成中的稳定性和资源管理问题。
- 收紧备份磁盘和文件重命名操作的权限检查，并修复日志、身份验证和其他服务器组件中的缺陷。
