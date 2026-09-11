---
title: ClickHouse 23.11 更新总结
description: ClickHouse 23.11 的中文更新总结、原始 Changelog、简体中文翻译与 Release 演示。
---

<ReleaseCard
  software="ClickHouse"
  version="23.11"
  date="2023-12-06"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2023#2311"
  accent="#C96A24"
  presentation-url="https://presentations.clickhouse.com/2023-release-23.11/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 23.11 引入异步加载数据库和表、并行窗口函数以及基于列统计信息的 PREWHERE 条件排序，并默认启用并发控制，以改善大量表、高并发和分析型查询的体验。S3Queue 已可用于生产环境，新的对象存储日志帮助审计数据写入，Keeper 则增加协议压缩、可用区信息与主动让出领导权的能力。本版还修复了认证失败后的连接处理漏洞，并缩小单二进制文件发行包。

## Breaking Change

- 默认服务器配置为 `default` 用户启用 SQL 用户管理和命名集合管理能力；升级时应核对实际使用的访问控制配置。
- 窗口函数 `RESPECT NULLS`/`IGNORE NULLS` 改进可能导致带这些修饰符的已存储聚合状态不兼容；移除 `optimize_move_functions_out_of_any` 优化。
- `parseDateTime` 的部分格式符默认允许不带前导零的小时和月份，可通过设置恢复原行为。
- `avgWeighted` 不再接受 `Decimal` 参数，可转换为 `Float64`；此前在物化视图或投影中使用 Decimal 参数的用户应联系官方支持。

## New Feature

- 新增 `async_load_databases` 与 `system.asynchronous_loader`，支持服务器启动后异步加载表，并优先初始化查询需要的表。
- 增加 `fileCluster`、外部表 `_size` 虚拟列、`system.blob_storage_log`、`CHECK ALL TABLES`、`system.symbols` 和可配置仪表板。
- S3Queue 支持持续消费 S3 文件；命名集合可保护指定字段不被覆盖，Keeper 新增压缩、可用区报告和让出领导权命令。
- 支持在同一条 ALTER 查询中创建并物化索引，物化视图修改查询不再是实验性功能；增强 Protobuf、NumPy、Arrow 和 MySQL 兼容性。

## Performance

- 默认启用并发控制，将最大并发查询默认值提高至 1000，并改进多用户高并发场景中的 ProcessList 访问。
- 并行执行窗口函数；利用列统计信息优化 PREWHERE 条件顺序，并让 `system.numbers` 按条件生成所需数据。
- 优化 S3 请求重试和本地缓存同步读取，减少外部读取、Map 元素访问和多阶段筛选的开销。
- 并行收集备份条目，改善 Keeper 启动内存，压缩实验性全文索引倒排列表，并减小二进制文件体积。

## Bugfix / Security

- 修复服务器间密钥认证失败后连接未立即关闭的潜在漏洞，避免未经认证的数据包继续被解析。
- 修复 T64、Gorilla 编解码器的缓冲区溢出，以及 GCD、FPC、Keeper 信号处理和 Kerberos 初始化中的崩溃。
- 修复备份恢复、复制表元数据、投影分析、JOIN 优化、查询缓存别名和可空类型转换问题。
- 修复 SQLite 与 DatabaseFileSystem 路径校验、RabbitMQ 动态加载、MySQL 可空列报告及 S3Queue 元数据处理。
