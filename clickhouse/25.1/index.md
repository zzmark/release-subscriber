---
title: ClickHouse 25.1 更新总结
description: 即时应用变更操作、Merge 表结构统一、自增计数器、数据跳过索引缓存与终端及 Web 查询体验改进。
---

<ReleaseCard
  software="ClickHouse"
  version="25.1"
  date="2025-01-28"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2025"
  accent="#5865A8"
  presentation-url="https://presentations.clickhouse.com/2025-release-25.1/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 25.1 为常规 MergeTree 和 ReplicatedMergeTree 带来查询时即时应用变更操作的能力，并加入分布式自增计数器、并行 DDL 和子列索引支持。数据跳过索引缓存、并行哈希连接和并行副本继续提速；命令行输出与内置 Web UI 也有大量易用性改进。升级时应重点核查 Merge 表的结构推断、Parquet 日期时间输出、地理坐标返回顺序及权限变化。

## Breaking Change

- `Merge` 表改为合并底层表的列并推导公共类型；部分可转换到首表类型、却不存在公共类型的组合可能不再兼容。可将 `merge_table_max_tables_to_look_for_schema_inference` 设为 `1`，或将 `compatibility` 设为 `24.12` 或更早版本，恢复旧行为。
- Parquet 输出将 `DateTime` 写为 `DateTime64(3)`，将 `Date` 写为 `Date32`，不再直接输出为无符号整数；`output_format_parquet_datetime_as_uint32` 可恢复原有 DateTime 行为。
- 默认禁止在 `ORDER BY` 和比较函数中使用 JSON、Object、AggregateFunction 等不可比较类型；移除已过时的 `MaterializedMySQL` 数据库引擎。
- `CHECK TABLE` 需要独立的 `CHECK` 授权。`h3ToGeo()` 改为返回 `(lat, lon)`，可通过 `h3togeo_lon_lat_result_order = true` 恢复旧顺序。
- 新 MongoDB 驱动成为默认实现；如需继续使用旧驱动，可启用服务器设置 `use_legacy_mongodb_integration`。`JSONEachRowWithProgress` 改为进度产生时立即发送，且不再显示值为零的进度字段。

## New Feature

- 启用 `apply_mutations_on_fly` 后，SELECT 可以即时应用已提交、尚未由后台物化的更新和删除操作。
- 新增 `generateSerialID`，以 Keeper 中的命名分布式计数器生成自增值；DDL 可通过 `PARALLEL WITH` 并行执行，帮助加快复杂数据库结构的创建和恢复。
- MergeTree 排序键和数据跳过索引支持子列；可按表为数值列和字符串列自动创建 MinMax 索引，相应设置默认关闭。
- 新增 Iceberg 时间变换分区裁剪、`sequenceMatchEvents`、`arrayNormalizedGini` 和 DateTime64 相减支持。Arrow、Parquet、ORC 的 `HALF_FLOAT` 可读取为 Float32；其 IEEE-754 半精度语义不同于 BFloat16。BFloat16 数据类型已可用于生产环境。
- `system.trace_log` 默认记录符号化调用栈，支持跨构建分析；查询日志增加脚本查询编号和起始行号。
- 内置 Web UI 新增进度条、取消查询、增量显示、键盘单元格导航和更丰富的服务器信息。终端改进多行值、行尾空格、长列名、二进制输出确认及 Pretty 格式输出块合并。

## Performance

- 新增反序列化数据跳过索引粒度的内存缓存，由 `skipping_index_cache_size` 和 `skipping_index_cache_max_entries` 控制，显著降低重复向量索引查询开销。
- 优化并行哈希连接探测阶段及 Grace Hash Join 的数据重排，继续提升并行副本效率；官方演示报告 ClickBench 上的并行副本性能提升约 40%。
- `indexHint` 中仅作为提示参数使用的列不再从表中读取；改进 RowBinary 解析、FINAL、聚合、正则匹配与部分排序路径的性能。

## Bugfix / Security

- 修复 PostgreSQL、SQLite 表函数中的 SQL 注入问题，并通过独立的 CHECK 授权收紧可能引发拒绝服务的重型检查查询权限。
- 修复访问授权及部分撤销处理、异常二进制输入大小、JSON/Dynamic 数据处理和部分 FINAL 查询的正确性问题。
- 修复 S3Queue、AzureQueue、备份恢复、复制及分布式查询的多项异常，提升队列消费、对象存储和集群操作的可靠性。
