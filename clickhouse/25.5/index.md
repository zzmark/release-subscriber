---
title: ClickHouse 25.5 更新总结
description: ClickHouse 25.5 的中文更新总结、原始 Changelog、简体中文翻译与 Release 演示。
---

<ReleaseCard
  software="ClickHouse"
  version="25.5"
  date="2025-05-22"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2025#255"
  accent="#5B8C3A"
  presentation-url="https://presentations.clickhouse.com/2025-release-25.5/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 25.5 扩展相关子查询支持，使 TPC-H 测试套件无需改写查询即可完整执行；向量相似度索引搜索进入 Beta 阶段，并支持预筛选与后筛选。数据湖方面新增 Hive Metastore 目录、Iceberg 分桶裁剪和 Parquet 地理类型，性能改进覆盖 FINAL 二级索引、并行队列插入、JIT 编译及延迟物化。本版也引入字符串熵、稀疏 n-gram 和 Base32 函数，方便文本检索和数据检查。

## Breaking Change

- `geoToH3` 参数顺序改为 `(lat, lon, res)`；可通过 `geotoh3_argument_order = 'lon_lat'` 保留旧顺序。
- 文件系统缓存动态调整大小默认禁用，需显式启用 `allow_dynamic_cache_resize`；移除旧索引类型 `annoy` 和 `usearch` 的支持。
- 移除 `format_alter_commands_with_parentheses` 设置，默认启用 DeltaLake 的 `delta-kernel-rs` 实现，并调整 URL 编码与多次重定向处理。

## New Feature

- 支持 WHERE 中的标量相关子查询，以及简单情况下 SELECT 输出列表中的相关子查询。
- 向量搜索进入 Beta 阶段，支持预筛选、后筛选与 BFloat16 向量；新增字符串熵、稀疏 n-gram、Base32 和除零返回 NULL 的函数。
- 新增 Hive Metastore 目录、Iceberg 分桶转换函数和版本提示支持，Parquet 可识别 WKB 几何数据。
- clickhouse-local 支持隐式输入表；新增按 LIKE 筛选清空表、`_part_starting_offset` 虚拟列和更多系统表诊断字段。
- 实验性功能新增 Time/Time64 类型及相关转换；全文索引类型由 `full_text` 更名为 `gin`。

## Performance

- 默认启用表达式 JIT；二级索引可批量处理多个数据粒度，FINAL 可在精确模式下利用跳过索引并兼顾较新的更新。
- S3Queue/AzureQueue 支持并行插入；对象存储集群表函数使用一致性哈希分配文件，提高缓存局部性。
- 改进 `uniqExact` 状态合并、并行哈希连接的小表回退，以及并行副本任务分配和延迟物化。
- 优化 Compact 数据片段写入、整片段删除、简单计数和 Parquet 布隆过滤器下推，减少导入内存和 Azure API 调用。

## Bugfix / Security

- 隐藏 DataLakeCatalog 创建查询中的密码，修复 OpenSSL 初始化段错误、函数比较栈溢出及多处并发竞争。
- 修复 JSON、Dynamic、Variant 和稀疏列的转换与解析；禁止当前实现可能产生错误结果的 Dynamic/JSON 类型 IN 操作。
- 修复可刷新物化视图在新副本上的运行及备份问题，以及 Analyzer、JOIN、分布式查询和延迟物化中的错误结果或逻辑错误。
- 修复 DeltaLake、Iceberg 集群计数、MongoDB 查询、S3/Azure 列举和 plain_rewritable 磁盘加载问题。
