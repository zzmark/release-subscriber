---
title: ClickHouse 26.8 LTS 更新总结
description: ClickHouse 26.8 LTS 的中文更新总结、原始 Changelog、简体中文翻译与 Release 演示。
---

<ReleaseCard
  software="ClickHouse"
  version="26.8"
  date="2026-08-27"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2026"
  accent="#168AAD"
  presentation-url="https://presentations.clickhouse.com/2026-release-26.8/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 26.8 是夏季长期支持版本，包含 49 项新功能、48 项实验性功能、127 项性能优化、138 项改进和 556 项缺陷修复。重点更新包括可编程 HTTP 处理器、面向表的 URL 接口、JSON 查询 AST、后台查询、默认会话用户、管道式 SQL、原子化 `POPULATE`、Keeper 磁盘存储、S3 Tables 与 Snowflake Horizon，以及新的文本分词器和 AI 函数。性能方面重点优化聚合合并、JOIN、Parquet 读取、列统计、`DISTINCT`/窗口函数、编解码器和文本索引。

## Breaking Change

- `X-ClickHouse-Format` 请求头现在明确覆盖查询中的 `FORMAT` 子句和路径扩展名；`INSERT` 请求体仍应使用 `input_format` 或 `format` 指定解析方式。
- `max_insert_threads` 默认值改为 `auto`，并行插入可能改变生成的 part 数量和插入行顺序；需要旧行为时请设为 `1` 或使用旧版本兼容模式。
- `DateTime`/`DateTime64` 在 `JSONEachRow` 等格式中的未加引号数字现在按 Unix 时间戳解析；同时收紧了 PostgreSQL、MySQL、NATS 等外部连接的凭据与远程地址配置边界。
- 移除了 `library` 字典源和 Apache Arrow 的旧库实现；`Date32` 支持范围扩展到 `0000-01-01` 至 `9999-12-31`，相关转换结果需重新评估。

## New Feature

- 新增 `CREATE HANDLER`/`ALTER HANDLER`/`DROP HANDLER`，可从 SQL 定义持久化的 HTTP 处理器；HTTP 接口支持按 URL 路径访问数据库和表，并提供结果筛选、排序、分页及响应分帧格式。
- 新增 `default_session_user`、管道式 SQL、`parseQueryToJSON`/`formatQueryFromJSON`、`run_query_in_background` 和原子化 `CREATE MATERIALIZED VIEW ... POPULATE`。
- 数据湖能力扩展到 S3 Tables、Snowflake Horizon、Puffin、BigQuery、Keeper 磁盘存储和 Iceberg 写入；窗口函数新增 SQL:2011 `GROUPS` 帧。
- 文本索引新增日文、中文、ICU 与正则分词器；同时加入 `aiSimilarity`、`aiRedact`、`aiFilter`、动画 PNG 输出、Web SQL UI 结果整形和 ClickBench Playground。

## Performance

- 并行聚合支持单层状态合并和更快的状态转换；`uniq`、字符串键聚合、`IEJoin`、`parallel_full_sorting_merge` 和 Cascades 优化器得到增强。
- Parquet 支持惰性读取与字典过滤，合并时可按块选择自适应 codec；大量小 part、`DISTINCT`/窗口函数和文本索引的内存与执行效率得到改善。
- 默认列统计信息、GeoParquet 空间剪枝以及 Iceberg manifest 预取减少了扫描和规划开销。

## Bugfix / Security

- 修复 MergeTree、复制、插入、更新 patch part、聚合、JOIN、窗口函数、数据类型转换和查询分析器中的错误结果、竞态与崩溃问题。
- 修复 S3、Iceberg、BigQuery、Kafka、NATS、PostgreSQL、HDFS、ORC 和 Azure/Fabric 集成中的兼容性与资源管理问题。
- 收紧服务器凭据、TLS 文件路径、远程 URL 和权限检查边界，并补充 Keeper、Prometheus、监控指标及 Web UI 的稳定性修复。
