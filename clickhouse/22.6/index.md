---
title: ClickHouse 22.6 更新总结
description: ClickHouse 22.6 的中文更新总结、原始 Changelog、简体中文翻译与 Release 演示。
---

<ReleaseCard
  software="ClickHouse"
  version="22.6"
  date="2022-06-16"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2022"
  accent="#168AAD"
  presentation-url="https://presentations.clickhouse.com/2022-release-22.6/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 22.6 的夏季版本新增 `GROUPING` 函数、列式 JSON 格式、FPC 浮点压缩和 OpenTelemetry 跟踪可视化工具，并扩展可执行 UDF、虚拟文件系统与 H3 能力。大量优化覆盖 ARM NEON、排序、聚合、数组与地理函数、远程读取及缓存。AArch64 或混合架构集群需要特别检查分布式聚合的升级限制，符合受影响条件时应安排停机升级。

## Breaking Change

- 移除 SQL 八进制数字字面量支持；秒数类型设置支持浮点值，但拒绝 Infinity 和 NaN。
- 实验性 `Object` 类型的列二进制序列化格式发生变化；`output_format_json_named_tuples_as_objects` 默认启用，具名元组在 JSON 中按对象输出。
- LIKE 模式不再允许以转义字符结尾。
- 在不同 ClickHouse 版本共存的 AArch64 集群或 AArch64/amd64 混合集群中，若分布式 GROUP BY 的多个固定长度键合计超过 64 位且不超过 256 位、结果规模很大，升级期间可能无法完全聚合。应停机升级，避免滚动升级。

## New Feature

- 新增 `GROUPING` 函数，区分 `ROLLUP`、`CUBE`、`GROUPING SETS` 的不同分组集。
- 新增 `JSONColumns`、`JSONCompactColumns`、`JSONColumnsWithMetadata` 列式格式，以及 FPC 浮点压缩编解码器。
- 新增基于 d3js 的 OpenTelemetry 跟踪可视化工具，并提供更详细的查询插桩。
- `LIKE`、`ILIKE`、`match` 支持非常量模式；可执行 UDF 支持参数化配置；新增 `clickhouse-disks`、`showCertificate` 与 `nonNegativeDerivative`。
- 支持向 `system.zookeeper` 插入节点、Avro Map/Record、H3 单向边、CSV/TSV 跳过开头行，以及 `SYSTEM UNFREEZE`。
- WindowView 扩展 `POPULATE`、修改查询和 ENGINE 语法；官方演示还介绍 Go 驱动、dbt、Airbyte 集成进展。

## Performance

- ARM NEON 优化覆盖底层向量指令、压缩、UTF-8、字符串和排序，并改善 AArch64 堆栈跟踪。
- 优化单列排序、带 LIMIT 的 ORDER BY、复合排序键 MergeTree 插入和大型聚合状态清理；数组距离与范数函数速度达到原来的 2–4 倍。
- 多种格式仅读取查询需要的列，降低解析与内存开销；优化稀疏列聚合、层级字典索引、数值比较和地理函数。
- 优化 Hive 线程池读取与多磁盘缓存，通过 `_file`、`_path` 裁剪远程文件列表，限制单次查询缓存使用并减少压缩时复制。

## Bugfix / Security

- 修复读取投影系统表时可能发生的堆内存释放后使用、结构推断段错误及零拷贝复制中的罕见死锁。
- 修复 `WITH FILL`、GROUPING SETS、投影、UNION、字典连接、具名元组和 `DateTime64` 等场景的错误结果或异常。
- 修复 Keeper 单节点强制恢复、失效会话清理延迟及 Docker 目录所有权；只读模式下禁止创建或删除 SQL UDF。
- 修复 WindowView 依赖、内部目标表与默认列处理，改善 HTTP 错误状态与统计标头，并清理损坏或移动失败的数据片段。
