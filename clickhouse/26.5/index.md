---
title: ClickHouse 26.5 更新总结
description: ClickHouse 26.5 的中文更新总结、原始 Changelog、简体中文翻译与 Release 演示。
---

<ReleaseCard
  software="ClickHouse"
  version="26.5"
  date="2026-05-21"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2026"
  accent="#5B8C3A"
  presentation-url="https://presentations.clickhouse.com/2026-release-26.5/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 26.5 是春季常规版本，包含 38 项新功能、51 项性能优化和 224 项缺陷修复。重点更新包括 `filesystem` 表函数、多路径 SQL/JSON、查询缓存下推至子查询、浏览器 Web Terminal、Kafka 直接查询、Iceberg 地理类型与查询条件缓存，以及 Paimon 增量读取。性能方面重点降低大型 `UNION ALL` 和高并发查询的内存压力，并优化 Merge 表计划、JOIN Top-K 下推、哈希表预取和 MD5 计算。

## Breaking Change

- 允许未限定数据库名的物化视图引用按物化视图所属数据库解析；依赖旧执行上下文的定义需要复核。
- 多项类型转换、`FINAL`、复制与对象存储行为进一步收紧错误处理，升级前应结合现有查询与表结构验证兼容性。

## New Feature

- 新增 `filesystem` 表函数，可将目录与文件内容作为表查询；新增 `tokenizeQuery`、`highlightQuery`、`regexpPosition` 和 `prettyPrintJSON` 等函数。
- `JSON_VALUE`、`JSON_EXISTS`、`JSON_QUERY` 支持一次传入多条路径；新增 `system.zookeeper_watches` 以检查活跃 watch。
- 支持 `CREATE OR REPLACE MATERIALIZED VIEW`、`SYSTEM PAUSE VIEW`，Kafka 写入时可将特殊列映射为消息元数据。
- 查询缓存可按子查询启用或传播；新增实验性 Web Terminal，Keeper 支持的 Kafka 引擎可直接执行 `SELECT`。
- Iceberg v3 的 `geometry`、`geography` 类型可映射为 ClickHouse `Geometry`；Iceberg 支持查询条件缓存，Paimon 支持增量读取。

## Performance

- 当排序键仅引用 JOIN 保留侧时，可将 `ORDER BY ... LIMIT` 下推到 JOIN 之前，减少参与连接的数据量。
- 结构相同的大量底层表不再重复分析，显著降低大型 Merge 表查询的计划开销。
- 新设置限制 `UNION ALL` 同时运行的分支数量，并根据可用内存自动调整查询和插入线程数。
- GROUP BY 查询达到 `LIMIT + OFFSET` 个不同键后可提前停止；哈希表探测新增哈希预计算和软件预取。
- 新增数据并行 MD5 实现，并在 macOS 上启用 LLVM JIT 编译。

## Bugfix / Security

- 修复 JOIN、复制、Keeper、物化视图、对象存储、备份恢复及多种数据格式中的错误结果、崩溃、竞态和内存问题。
- 加强畸形输入处理、访问控制与配置加载的边界检查，并修复多项可能导致静默数据丢失或资源泄漏的问题。
