---
title: ClickHouse 24.12 更新总结
description: ClickHouse 24.12 的中文更新总结、原始 Changelog、简体中文翻译与 Release 演示。
---

<ReleaseCard
  software="ClickHouse"
  version="24.12"
  date="2024-12-19"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2024"
  accent="#5865A8"
  presentation-url="https://presentations.clickhouse.com/2024-release-24.12/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

来源校正：官方年度 Changelog 中 `MergeTreeIndexGranularityInternalArraysTotalSize` 的说明在句中截断。本页原文与译文已依据 [ClickHouse 官方 PR #72490](https://github.com/ClickHouse/ClickHouse/pull/72490) 补齐“高内存用量问题”的完整含义。

ClickHouse 24.12 默认采用并行哈希连接并自动选择连接构建侧，进一步降低分析查询的连接开销。主索引支持按需缓存和预热，聚合与排序可根据内存用量自动溢写到磁盘。Iceberg 增加 REST Catalog 接入和结构演进，JSON、Dynamic、Variant 进入 Beta 阶段，并支持从旧 Object 类型迁移。

## Breaking Change

- `greatest`、`least` 现在忽略 NULL 参数，与 PostgreSQL 行为一致；需要保留原有 NULL 传播行为时，将 `least_greatest_legacy_null_behavior` 设为 `true`。
- 新 MongoDB 集成成为默认实现。需要继续使用基于 Poco 的旧驱动时，启用 `use_legacy_mongodb_integration`。

## New Feature

- Iceberg 数据库引擎可接入整个 REST Catalog，兼容 Unity、Polaris；Iceberg 表函数支持列增删、重命名和基础类型变更。
- 新增主索引缓存、预热与 `SYSTEM LOAD PRIMARY KEY`；支持通过 `ATTACH TABLE ... AS REPLICATED` 或 `AS NOT REPLICATED` 在 MergeTree 与 ReplicatedMergeTree 之间转换。
- 新增 `http_response_headers`、`arrayPRAUC`、`indexOfAssumeSorted`、`toUnixTimestamp64Second`，并扩展用户、角色及配置文件的局部设置修改语法。
- JSON、Dynamic、Variant 提升至 Beta，支持将 Object ALTER 为 JSON，排序键和数据跳过索引可使用子列。实验性反向排序键支持按时间降序存储，适合 TopN 时间序列查询。
- 默认支持非等值 JOIN；客户端接收服务器端格式设置，Enum 支持 LIKE 和未知值比较，物化视图查询可使用 UNION。

## Performance

- 默认优先使用并行哈希连接，自动选择行数较少的表作为构建侧；可提取连接条件的公共表达式，减少哈希表数量并改善条件下推。
- 并行副本由协调节点完成索引分析，减少短查询延迟；按键顺序读取时拆分范围，降低内存占用。
- 主索引按需缓存有助于降低共享存储超大表的内存占用；聚合和排序可依据服务器或用户内存用量自动溢写到磁盘。
- 优化 LowCardinality 排序、argMin/argMax、聚合状态反序列化和单分区批次插入；备份恢复可并行建表，物化视图支持异步执行。

## Bugfix / Security

- 修复 GraceHashJoin 数据竞态导致漏行、并行哈希连接复杂不等式条件处理，以及 ARRAY JOIN 分布式查询生成问题。
- 修复 Dynamic 序列化、稀疏列解析、重复 JSON 键和带物化 `_block_number` 列的删除与变更操作。
- 修复对象存储目录事务回滚、空文件备份恢复、S3Queue 无序模式、Keeper 内部 SSL 配置及多个潜在崩溃。
- 修复内存跟踪用量持续高估、服务器重启时重新推断已删除文件的格式导致启动失败，以及复制数据库添加副本时元数据不一致。
