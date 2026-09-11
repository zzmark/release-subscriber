---
title: ClickHouse 22.7 更新总结
description: ClickHouse 22.7 的中文更新总结、原始 Changelog、简体中文翻译与 Release 演示。
---

<ReleaseCard
  software="ClickHouse"
  version="22.7"
  date="2022-07-21"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2022"
  accent="#168AAD"
  presentation-url="https://presentations.clickhouse.com/2022-release-22.7/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 22.7 扩展窗口函数表达式、连接算法和数据集成，新增 NATS 表引擎、MongoDB 表函数与写入支持，以及 `SQLInsert` 输出格式。此版本优化排序、MergeTree 插入和合并、`FINAL` 查询、DISTINCT 与字符串匹配，并新增版本兼容性设置。升级时应关注 Ordinary 数据库弃用、位置参数及逗号连接重写的默认行为变化。

## Breaking Change

- 默认启用 `enable_positional_arguments`，`ORDER BY 1, 2` 中的数字表示 SELECT 列位置；需要旧行为时可禁用。
- 默认禁用 CSV 单引号支持设置 `format_csv_allow_single_quotes`。
- 弃用 `Ordinary` 数据库引擎和 MergeTree 旧存储定义语法；默认不能新建 Ordinary 数据库，Ordinary 类型的 `system` 数据库会在启动时自动转换为 Atomic。
- 默认强制将逗号连接重写为内连接，即 `cross_to_inner_join_rewrite = 2`；如遇兼容性问题可恢复为 1。

## New Feature

- 支持窗口函数参与表达式；新增 EmbeddedRocksDB 的 `direct` 连接算法及全排序合并连接算法。
- 新增 NATS 发布/订阅表引擎、MongoDB 表函数和写入支持，以及 `SQLInsert` 输出格式。
- 新增 `additional_table_filters`、`additional_result_filter`，分别在读取表后和查询结果上附加筛选条件。
- 新增 `compatibility` 和 `system.settings_changes`，帮助检查跨版本默认设置变化；新增 `group_by_use_nulls`、字符转换、时间间隔解析、base58 和 L2 平方距离函数。
- 新增空表结构推导、远程 I/O 带宽限制、导出压缩级别设置与 Play UI 图表；实验性 `implicit_transaction` 可自动管理独立查询的事务。
- 演示介绍 Go 驱动的 HTTP 和 ch-go 实现、Grafana JSON 类型支持、Superset 官方支持及 MeiliSearch 集成。

## Performance

- 使用批量 BinaryHeap 优化 ORDER BY、MergeTree 合并和窗口函数，扩大聚合之后的并行执行。
- 提升 `FINAL` 查询并行度，演示说明最高可达 4 倍提升；优化已排序列 DISTINCT、数字列连接与 JSON 插入。
- 修复严重的连接性能退化；迁移至 vectorscan，加快非 x86 平台的字符串匹配。
- 数组范数和距离函数速度达到原来的 1.2–2 倍；优化 LZ4 解压、哈希表、窗口排序及异步指标日志空间占用。

## Bugfix / Security

- 更新 simdjson，修复支持 AVX-512 VBMI 的 Intel CPU 上的缓冲区溢出；修复 Hive 数据竞争、OvercommitTracker 死锁及 Map 聚合组合器的释放后使用。
- 修复可空分区键裁剪、窗口表达式、投影、UNION 列顺序、分布式 DISTINCT/LIMIT 和短路求值中的错误结果。
- 修复 S3 并行读写与缓存边界问题，改进 GCS 删除 API 兼容和 Hadoop 安全 RPC 传输。
- 修复 PostgreSQL、MaterializedPostgreSQL、RabbitMQ 及 Distributed 插入中的崩溃、挂起和元数据问题，并为清理文件系统缓存添加权限检查。
