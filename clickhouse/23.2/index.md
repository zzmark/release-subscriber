---
title: ClickHouse 23.2 更新总结
description: ClickHouse 23.2 的中文更新总结、原始 Changelog、简体中文翻译与 Release 演示。
---

<ReleaseCard
  software="ClickHouse"
  version="23.2"
  date="2023-02-23"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2023#232"
  accent="#5865A8"
  presentation-url="https://presentations.clickhouse.com/2023-release-23.2/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 23.2 扩展了数据湖、动态磁盘和分析函数支持，加入 Iceberg 访问、全局 FINAL 设置、NTILE 窗口函数及相关系数矩阵计算。多阶段 PREWHERE、独立分区聚合、io_uring 和 Compact 数据片段纵向合并为性能优化提供更多选择。升级时需检查日期函数参数、命名集合权限、重命名设置和压缩编解码器组合。

## Breaking Change

- `toDayOfWeek(time, time_zone)` 的双参数用法需改为 `toDayOfWeek(time, 0, time_zone)`，以适配新增 mode 参数。
- `max_query_cache_size` 重命名为 `filesystem_cache_max_download_size`，移除 `materialized_postgresql_allow_automatic_update`；`default` 用户默认不再拥有 `SHOW NAMED COLLECTION` 权限。
- FORMAT 之前的 SETTINGS 也会作用于格式化；`countDigits(0)` 改为返回 `1`。
- 禁止为新列使用 Delta/DoubleDelta 后接 Gorilla/FPC 的可疑编解码器组合，可通过兼容设置绕过。

## New Feature

- 新增 Iceberg 表引擎及表函数，支持查询 S3 上的数据湖表；允许通过查询设置动态定义磁盘。
- ReplacingMergeTree 扩展删除标记相关能力，新增 `final` 设置以隐式为查询中的表应用 FINAL。
- 新增 `ntile`、`corrMatrix`、协方差矩阵、`generateULID`、数组随机排列及部分排序等分析函数。
- `system.part_log` 支持 ProfileEvents；KeeperMap 表支持 DELETE 和 UPDATE，客户端支持按连接名称管理配置。

## Performance

- 新增默认关闭的多阶段 PREWHERE 与独立分区聚合；支持 io_uring 本地读取，并优化 Parquet 批量读取和预取。
- Compact 数据片段可采用纵向合并以降低内存使用；优化 multiIf、字符串大小写转换、过滤、Decimal 转换及 AVX-512 执行路径。
- 默认移除查询计划中的冗余排序；使用轮转调度后台合并，避免大型合并长期得不到执行。

## Bugfix / Security

- 修复 Delta/DoubleDelta 与 Gorilla 组合导致的数据损坏，以及 N-gram 索引读取、Arrow 越界和多个函数崩溃。
- 修复实验性分析器 LIMIT/OFFSET、分组集谓词下推、FINAL 逆序读取和嵌套列更新等正确性问题。
- 命名集合用于表函数参数时隐藏日志中的密码；修复 systemd 启动超时反复重启、异步插入内存统计误报和配置环境变量替换。
