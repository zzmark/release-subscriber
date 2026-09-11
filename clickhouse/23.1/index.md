---
title: ClickHouse 23.1 更新总结
description: ClickHouse 23.1 的中文更新总结、原始 Changelog、简体中文翻译与 Release 演示。
---

<ReleaseCard
  software="ClickHouse"
  version="23.1"
  date="2023-01-26"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2023#231"
  accent="#5865A8"
  presentation-url="https://presentations.clickhouse.com/2023-release-23.1/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 23.1 为实时分析扩展了参数化视图、正则表达式树字典和数据格式能力，并引入实验性查询结果缓存与全文倒排索引。性能优化覆盖 S3 小文件读取、数据片段加载、字典并行加载及 HTTP 查询聚合。升级前需核查旧语法表的仲裁插入、S3 权限、时区名称和 Gorilla 编解码器使用方式。

## Breaking Change

- 禁止在非 Float32/Float64 列上使用 `Gorilla` 编解码器，并禁止时区名称包含文件路径。
- 采用已弃用语法创建的 `*MergeTree` 表不再支持并行仲裁插入；等值连接与常量条件组合的部分查询因结果错误而被禁止。
- 获取 S3 对象大小改用 `GetObjectAttributes`，可能需要调整 ACL，并核查 S3 兼容服务的支持情况。
- `SYSTEM RESTART DISK` 和哈希字典的 `PREALLOCATE` 选项改为空操作。

## New Feature

- 支持参数化视图、用于 User-Agent 等解析任务的正则表达式树字典，以及 Map 的数组连接。
- 新增实验性查询结果缓存和倒排二级索引；缓存支持按查询控制运行次数、耗时、结果大小和陈旧时间等条件。
- Kafka、RabbitMQ 和 NATS 扩展为支持所有数据格式，允许控制行式消息的行数；CSV/TSV/CustomSeparated 支持自动识别表头。
- 新增 `age`、加权插值分位数函数、SQL 标准二进制与十六进制字面量，以及更多日期时间格式化能力。

## Performance

- 不再在 MergeTree 启动时加载非活跃数据片段；优化 S3 大量小文件读取、Parquet/ORC 结构体字段裁剪和 File 引擎 mmap 读取。
- 恢复 HTTP 查询的两级聚合算法，哈希字典支持分片并行加载，并优化查询解析、三值逻辑向量化和线程池锁竞争。
- 降低 S3 备份内存占用，通过异步数据块 ID 缓存减少 Keeper 请求，支持并行获取副本状态。

## Bugfix / Security

- 修复解析器缓冲区溢出、S3 读取中的堆内存释放后使用，以及多种查询、关闭和并行解析场景中的崩溃或死锁。
- 修复投影、LowCardinality、JOIN、UNION、分组集和附加表过滤器相关的错误结果或异常。
- 修复异步插入去重、Distributed 表创建与插入竞态、数据片段清理、缓存写入和多种输入格式解析问题。
