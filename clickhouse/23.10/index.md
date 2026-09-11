---
title: ClickHouse 23.10 更新总结
description: ClickHouse 23.10 的中文更新总结、原始 Changelog、简体中文翻译与 Release 演示。
---

<ReleaseCard
  software="ClickHouse"
  version="23.10"
  date="2023-11-02"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2023#2310"
  accent="#C96A24"
  presentation-url="https://presentations.clickhouse.com/2023-release-23.10/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 23.10 增强了数组分析、时间序列降采样、数据格式与 SQL 诊断能力，并优化高并发查询、外部聚合、合并以及窗口函数。新增的 `arrayFold` 支持以 lambda 函数累计处理数组，`largestTriangleThreeBuckets` 保留降采样曲线的形状，NumPy 输入格式进一步打通科学计算数据。升级前需检查内存数据片段、Meilisearch 集成以及 HTTP 请求路径等兼容性变化。

## Breaking Change

- 不再自动删除损坏的数据片段；内存数据片段的 WAL 已不受支持，升级前应处理相关数据片段。
- 移除与新版 Meilisearch 不兼容的旧集成，并调整后台插入相关设置的命名。
- 修正客户端发送和接收超时的语义；对不同单位的 Interval 值执行不受支持的操作会抛出异常。
- 实验性 S3Queue 实现重写；HTTP 接口不再接受任意请求路径。

## New Feature

- 新增 `arrayFold`、`arrayRandomSample`、`jsonMergePatch`、`byteSwap` 和 `largestTriangleThreeBuckets`，扩充数组、JSON、二进制与时间序列处理能力。
- 支持 NumPy 与 DWARF 输入格式，增强空间填充曲线相关分析能力，并提供 ArgMin、ArgMax 聚合函数组合器。
- 新增 `SHOW MERGES`、`SHOW SETTING`、查询格式化函数及更多 `DESCRIBE` 输出选项。
- 支持分区操作中的查询参数，增强投影选择控制、原生协议异步插入和 MySQL 客户端兼容性。

## Performance

- 减少 Context 锁竞争，改善大量并发查询的吞吐量，并调整短查询的执行流数量。
- 优化外部聚合的临时文件处理与内存使用，以及大量数据片段合并时的开销。
- ORC 支持条件下推与数据跳过；Map 元素访问可利用相邻 Map 结构相似性。
- 优化窗口函数的执行流保留，并通过复用索引数据结构加速跳过索引。

## Bugfix / Security

- 修复 LDAP 角色更新和备份死锁、执行流水线中的数据竞争，以及 HDFS 和压缩器的内存泄漏。
- 修复 Iceberg、S3、MongoDB、ODBC 与 MySQL 集成中的读取、连接和类型表示问题。
- 修复稀疏列上的函数与窗口计算、Nested 数据合并、虚拟列筛选、Decimal 排序以及类型解析问题。
- 修复 Buffer 表并发 ALTER 与 INSERT、Arrow 字典列读写、AvroConfluent 结构获取和 JSON 格式回退缓存。
