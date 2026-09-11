---
title: ClickHouse 25.11 更新总结
description: 投影二级索引、全文搜索 Beta、Geometry 类型、用户身份代执行，以及 Parquet 和查询并行性能提升。
---

<ReleaseCard
  software="ClickHouse"
  version="25.11"
  date="2025-11-27"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2025"
  accent="#C96A24"
  presentation-url="https://presentations.clickhouse.com/2025-release-25.11/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 25.11 将全文搜索推进到 Beta，支持以仅存储行偏移的投影构建二级索引，并加入完整 Geometry 类型、以其他用户身份执行查询及按比例选取结果的能力。Parquet 读取器 v3 默认启用，分布式任务可按单个文件内的行组分配。升级前必须处理已移除的 LIVE VIEW 和 Object，并评估 Variant 子列文件名与 String 新序列化格式带来的兼容性和降级限制。

## Breaking Change

- 移除 Object 类型和 LIVE VIEW；仍在使用 LIVE VIEW 时，无法升级到此版本。Geometry 不再是 String 别名，而成为独立的完整类型。
- Wide 数据片段中的 Variant 子列文件名默认转义，会破坏与包含 Variant/Dynamic/JSON 的旧表的兼容性。为保持兼容，需在升级前关闭 MergeTree 的 `escape_variant_subcolumn_filenames`，或将 `compatibility` 设为先前版本。
- String 默认使用 `with_size_stream`，其读取支持始于 25.10。若需保留降级到 25.9 及更早版本的能力，须在服务器 `merge_tree` 配置中将 `serialization_info_version` 设为 `basic`、`string_serialization_version` 设为 `single_stream`。
- HTTP 响应新增异常标记，`http_write_exception_in_output_format` 默认关闭；依赖异常文本的客户端需核查解析逻辑。Kafka 表级 SASL 设置现在正确覆盖配置文件中的消费者/生产者设置。
- Parquet 无时区时间戳改为读取成带 UTC 时区的 DateTime64，可用 `input_format_parquet_local_time_as_utc = 0` 恢复旧行为。禁止多个 plain-rewritable 磁盘共享同一对象存储路径。

## New Feature

- 全文搜索进入 Beta，文本索引支持通过 `preprocessor` 在分词前转换文档；Alias 表引擎转为实验性功能。
- `EXECUTE AS` 支持在授权范围内以其他用户身份查询，应用其访问控制、配额、限制和审计规则。小数形式 LIMIT/OFFSET 可选取结果集的一定比例。
- Geometry 可统一承载不同几何对象并读取 WKB/WKT，另有 `flipCoordinates`、`h3PolygonToCells` 和 `system.unicode`。
- 新增 `cume_dist`、`midpoint`、`argAndMin`、`argAndMax`、`arrayRemove`，以及文本朴素贝叶斯分类器。官方演示将分类器及 ACME 自动证书集成标记为实验性；ACME 支持 HTTP-01，借助 Keeper 在集群共享证书。
- 集成 Microsoft Fabric OneLake 目录服务，增加 S3 `_tags` 虚拟列、Parquet 校验和设置，以及部分 Prometheus HTTP Query API。Web UI 支持下载完整结果，查询响应头可实时报告内存占用。

## Performance

- 仅选择 `_part_offset` 并采用不同排序键的投影可用作二级索引，减少额外存储并在 PREWHERE 阶段按位图过滤行；代价是读取局部性下降，适合点查询。聚合投影也可用于 DISTINCT 查询。
- 默认启用 Parquet 读取器 v3；分布式读取按行组而非整文件分配工作，让多个节点共同处理单个大型文件。
- RIGHT/FULL JOIN 采用 ConcurrentHashJoin，部分场景最高提速至 2 倍；大量数据片段上的重度分区裁剪查询最高提速至 8 倍。小整数 GROUP BY 的聚合状态支持并行合并。
- 文本索引缓存词典块、倒排列表和反序列化头，并改进词元查找。延迟物化行数上限提高到 100，可与有序读取共同生效。
- 共享数据片段列描述以降低表元数据内存占用；默认启用连接中的列延迟复制，并优化 LZ4 解压、日志、bcrypt 验证缓存和备份对象键分布。

## Bugfix / Security

- DDL ON CLUSTER 使用原始用户上下文进行访问校验，修复查询脱敏错误应用、分布式关闭竞争中的释放后使用，以及二进制反序列化大小检查和栈溢出问题。
- 修复轻量级更新配合查询条件缓存后可能返回错误结果、投影索引读取竞争、JOIN 运行时过滤器和列延迟复制的多项正确性与崩溃问题。
- 修复 QBit 距离计算精度和类型处理、反转四字节 UTF-8 码点、Compact JSON 子列读取、Parquet 解析以及反向主键极值查询等问题。
- 修复复制数据库恢复卡住、新副本创建、Keeper 日志轮转、GCS 原生备份复制及异步日志和缓存指标等可靠性问题。
