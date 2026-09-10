---
title: ClickHouse 26.7 更新总结
description: ClickHouse 26.7 的中文更新总结、原始 Changelog、简体中文翻译与 Release 演示。
---

<ReleaseCard
  software="ClickHouse"
  version="26.7"
  date="2026-07-22"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2026"
  accent="#168AAD"
  presentation-url="https://presentations.clickhouse.com/2026-release-26.7/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 26.7 是夏季常规版本，包含 64 项新功能、117 项性能优化和 349 项缺陷修复。重点更新包括 `EXPLAIN ANALYZE`、带 `WHERE` 的投影、`Remote`/`RemoteSecure` 表引擎、外部数据库查询转发、QBit 量化与分组步幅存储、文本索引短语搜索、GeoJSON 输出、Iceberg 清单压缩，以及内置 Web UI 和服务器文档页面的增强。性能方面重点优化 JOIN、按序聚合、查询条件缓存、压缩格式、窗口函数和 macOS 执行效率。

## Breaking Change

- 用户 SQL 发起的 S3 访问默认不再解析服务器环境、实例配置文件或元数据服务中的云端凭据；需要显式提供凭据或同时启用相关服务器设置。
- 对象存储上的备份不再支持 `zip`/`zipx`，应改用 `tar.gz` 等基于 tar 的格式。
- `AggregatingMergeTree` 默认拒绝既不属于排序键、也不是聚合状态的普通维度列；确需旧行为时可启用 `allow_dimensions_outside_sorting_key`。
- 移除基于配置文件的工作负载调度、旧版 Snowflake 转换函数和 `hasColumnInTable` 的远程访问参数。
- 插入去重统一使用新哈希；曾配置旧模式的集群必须先经过兼容模式完成迁移。

## New Feature

- 新增 `EXPLAIN ANALYZE`，执行查询并在查询计划中展示真实耗时、行数、字节数和并行度。
- 投影支持 `WHERE` 子句；优化器可在查询谓词蕴含投影谓词时按成本选择更小的数据子集。
- 新增 `Remote`、`RemoteSecure` 与 `QueryRunner` 表引擎，并允许 `mysql`、`postgresql`、`sqlite` 直接接收只读查询。
- QBit 支持 Int8 量化、分组步幅存储和量化距离函数；新增随机 Hadamard 变换与实验性量化编解码器。
- 文本索引支持记录词元位置并直接完成短语匹配；新增 UTM/MGRS 转换、GeoJSON 输出和通用几何相交函数。
- Iceberg 支持清单压缩，Delta Lake 写入进入 Beta；Web UI 新增多标签页、列配色、固定列、自动补全和数据库面板增强。

## Performance

- JOIN 可利用右表值通过左表主键或跳数索引裁剪数据粒度；哈希连接使用紧凑的 8 字节行引用，并新增 DPsub 连接顺序算法。
- 简单正则表达式可通过 LLVM JIT 编译；符合排序条件的 `GROUP BY ... ORDER BY ... LIMIT` 可提前结束读取。
- 查询条件缓存扩展到 Top-K 与本地 Parquet；Arrow、ZSTD、GZip、LZ4 和 Delta 编解码路径得到优化。
- 改进窗口函数、浮点解析、`uniqCombined`、逻辑表达式简化和集合运算，并提升 macOS 上的内存分配与分布式读取性能。

## Bugfix / Security

- 修复 MergeTree、复制、投影、异步插入、去重、分区操作和后台合并中的大量错误结果、竞态与崩溃问题。
- 修复 Iceberg、Delta Lake、对象存储、HDFS、Kafka、PostgreSQL 和 Azure/Fabric 集成中的兼容性、资源泄漏与数据正确性问题。
- 修复 JOIN、查询分析器、窗口函数、聚合、向量搜索、文本索引、日期时间及多种数据类型转换中的异常和错误结果。
- 收紧远程列探测与服务器凭据使用边界，并修复 FIPS 构建中 Ed25519 密钥处理等安全相关问题。
