---
title: ClickHouse 24.4 更新总结
description: ClickHouse 24.4 的中文更新总结、原始 Changelog、简体中文翻译与 Release 演示。
---

<ReleaseCard
  software="ClickHouse"
  version="24.4"
  date="2024-04-30"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2024"
  accent="#5B8C3A"
  presentation-url="https://presentations.clickhouse.com/2024-release-24.4/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 24.4 新增递归 CTE 和 QUALIFY 子句，扩展树/图遍历与窗口函数过滤能力。版本改进 JOIN 条件下推、JSON 读取及 S3 连接复用，并新增无本地元数据的可重写 S3 磁盘。Replicated 数据库进入 Beta 阶段。升级时注意 bridge 工具拆包、旧查询和设置移除，以及 TLS 库改用 OpenSSL 3.2。

## Breaking Change

- `clickhouse-odbc-bridge` 与 `clickhouse-library-bridge` 改为独立软件包。
- 实验性并行副本的 `max_parallel_replicas` 不再允许设为 0。
- 移除已废弃 LIVE VIEW 功能中的 `INSERT WATCH` 查询及 `optimize_monotonous_functions_in_order_by` 设置。

## New Feature

- 支持标准 SQL 递归 CTE，可用于树和图遍历；新增 QUALIFY 子句，直接根据窗口函数结果过滤。
- 可为表引擎细分授权，HTTP 接口可通过 `role` 参数在执行查询前设置一个或多个角色。
- 新增 `s3_plain_rewritable` 磁盘，无需本地元数据，适合存放系统表等特定场景；Replicated 数据库由实验性提升为 Beta。
- 支持同时 DROP 多张表、修改 Memory 表保留设置、卸载主键内存，以及新的持久化和版本虚拟列。
- 客户端改进语法高亮，系统日志新增结构化消息参数，时间截断支持亚秒单位。

## Performance

- 通过等价集合跨表下推 JOIN 条件，并在过滤条件允许时将 OUTER JOIN 改写为 INNER JOIN。
- JSON 读取完所需列后可跳过对象剩余部分；改进文件表函数的 INSERT SELECT 和并行解析。
- 改善 S3 keep-alive、连接池及端点负载分配，减少文件系统缓存竞争并加速动态调整。
- 加速时间转换、不可解析日期值处理、查询缓存读取，并减少变更操作对 SELECT 的开销。

## Bugfix / Security

- 修复大量分析器相关的名称解析、CTE、参数化视图、分布式查询和过滤条件下推问题。
- 修复聚合函数、FINAL、递归 Protobuf、缓存临时数据及 Azure 写入中的崩溃、内存泄漏和未处理异常。
- 修复复制抓取、备份恢复、MongoDB TLS 握手和协议检查；证书重新加载时同步重新加载证书链。
- ClickHouse 改用 OpenSSL 3.2，并改进 HTTP 角色选择及表引擎访问控制能力。
