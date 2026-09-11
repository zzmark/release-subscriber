---
title: ClickHouse 24.6 更新总结
description: ClickHouse 24.6 的中文更新总结、原始 Changelog、简体中文翻译与 Release 演示。
---

<ReleaseCard
  software="ClickHouse"
  version="24.6"
  date="2024-07-01"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2024"
  accent="#168AAD"
  presentation-url="https://presentations.clickhouse.com/2024-release-24.6/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 24.6 增加 Snowflake ID、Hilbert 曲线、Keeper 命名集合及查询权限日志，并通过行重排和延迟物化二级索引改善压缩率及插入性能。纵向 FINAL 在移除错误优化后重新默认启用。数据库和表默认异步加载，高负载分布式部署应评估启动期间查询等待与惊群风险。

## Breaking Change

- 默认异步加载数据库和表，服务器可在表加载完成前接受连接；访问未加载表的查询会等待。可关闭 `async_load_databases` 恢复先加载再接受连接的行为。
- 默认启用 MergeTree 长文件名哈希替换。升级本身无需额外操作，但启用后不能降级至 23.8 或更早版本。
- 重构 S3Queue Ordered 模式并行处理，移除 `s3queue_total_shards_num` 并新增 `s3queue_buckets`；使用旧并行或分片设置的部署需检查兼容性。
- 废弃旧 Snowflake 转换函数，改用与 `generateSnowflakeID` 兼容、默认采用 UNIX 纪元的新版函数；KQL 表函数不再接受未包装成字符串的内联表达式。

## New Feature

- 新增 Snowflake ID 生成和时间转换、Hilbert 曲线编码/解码及索引分析、URL 安全 Base64、UTF8 编辑距离和可读大小解析函数。
- 命名集合可存储在 Keeper 中供集群共享；查询日志记录已使用和缺失的权限，创建数据库和表可设置数量上限。
- 新增空元组、类文件存储的 `_time` 虚拟列、无限循环结果表函数，以及合并与变更工作负载资源控制。
- 实验性统计信息扩展不同值数量与 ReplicatedMergeTree 支持；Pretty 长表格可在末尾重复显示列名。

## Performance

- 可在不违反主键顺序的前提下重排插入行，提高压缩率；可推迟二级索引和统计信息的计算，以加快 INSERT。
- 新增实验性原生 Parquet 读取器，优化 Parquet 写入和多线程插入内存占用，并减少 Azure 缓冲区分配。
- 优化稀疏列纵向合并、远程数据预取、8/16 位键聚合、LowCardinality 的 IN，以及 ConcurrentHashJoin 初始化与销毁。
- 移除错误优化后重新默认启用纵向 FINAL，并改善过滤条件下推和 OpenSSL 会话复用。

## Bugfix / Security

- 修复默认数据库权限提升漏洞，以及查询缓存未区分数据库或设置可能导致的错误复用和权限绕过。
- 修复 Replicated 数据库启用安全连接参数后仍创建不安全连接的问题，并正确应用各视图定义者的安全上下文。
- 旧分析器禁止此前被静默忽略的 QUALIFY，避免变更操作意外删除数据；增强 bcrypt 哈希校验。
- 修复 Keeper 摘要、备份恢复、文本索引过度过滤、内存跟踪与缓存泄漏，以及多种分析器、窗口函数和并行读取崩溃。
