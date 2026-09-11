---
title: ClickHouse 23.3 更新总结
description: ClickHouse 23.3 LTS 的中文更新总结、原始 Changelog、简体中文翻译与 Release 演示。
---

<ReleaseCard
  software="ClickHouse"
  version="23.3"
  date="2023-03-30"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2023#233"
  accent="#5B8C3A"
  release-label="LTS"
  presentation-url="https://presentations.clickhouse.com/2023-release-23.3/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 23.3 是长期支持版本。轻量级 DELETE 正式达到生产可用状态并默认启用，新增 UNDROP TABLE、服务器设置查询、嵌套动态磁盘，以及取消查询时返回部分结果的能力。内存标记压缩、大规模备份优化和并行副本扩展是本次性能改进的重点。升级需检查 Kafka 表列定义、备份线程配置、索引确定性，以及 Decimal 聚合结果的变化。

## Breaking Change

- 禁止创建列定义包含 DEFAULT、EPHEMERAL、ALIAS 或 MATERIALIZED 的 KafkaEngine 表，禁止常量及非确定性二级索引。
- `backup_threads`、`restore_threads` 从用户设置改为服务器设置；移除内部异步连接排空功能及其设置、指标。
- Decimal256 支持扩展到更多函数和接口，部分此前错误返回 Decimal128 的函数改为正确类型；统计矩聚合改用 Float64，方差无穷大时可能返回 NaN 而非 Inf。
- 命名集合新增独立授权与 `NAMED_COLLECTION_CONTROL` 权限，需据此检查 `default` 用户及 `GRANT ALL` 的配置。

## New Feature

- 轻量级 DELETE 默认启用；新增 `UNDROP TABLE` 和 `system.dropped_tables`，支持恢复尚未被物理移除的表。
- 新增 `system.server_settings`、嵌套动态磁盘、Keeper 集中存储的 SQL 用户自定义函数复制，以及更多临时表引擎支持。
- 并行副本支持通过自定义键动态分片；查询取消时可选择返回已处理数据的部分结果。
- 新增 `parseDateTime` 系列、`widthBucket`、`toDecimalString`、`mapFromArrays`，扩展 MySQL 兼容语法，并支持原生协议 SSL 用户证书认证。

## Performance

- 压缩内存中的标记，内存占用降至原来的约 1/3–1/6。
- 大规模备份使用独立 IO 线程池、批量元数据读取及重试，S3 备份和恢复可使用服务端复制；演示展示了一小时完成 100 TB、100 万文件完整备份的案例。
- 减少 FINAL 过量读取，按核心数设置默认 FINAL 线程数，并改进并行副本的本地副本利用率。
- 优化 Keeper 批处理、ASOF JOIN、可空键聚合、字符串搜索及系统表读取，降低零复制机制对 Keeper 的负载。

## Bugfix / Security

- 重新实现服务器间模式以防止重放攻击，并兼容旧服务器；改进 S3 临时凭据过期处理。
- 修复 ReplicatedMergeTree 删除重试、零复制磁盘选择和锁等待、数据库恢复及带投影表的列删除。
- 修复 PREWHERE、参数化视图、分区聚合、Decimal/DateTime 单调性、BSON/Avro/Parquet 等场景中的错误结果、解析异常和崩溃。
- 修复 MySQL 集成内存泄漏、Query Status 死锁、同表 Join 引擎 INSERT SELECT 死锁，以及 Keeper 套接字超时。
