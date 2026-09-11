---
title: ClickHouse 23.7 更新总结
description: ClickHouse 23.7 的中文更新总结、原始 Changelog、简体中文翻译与 Release 演示。
---

<ReleaseCard
  software="ClickHouse"
  version="23.7"
  date="2023-07-27"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2023#237"
  accent="#168AAD"
  presentation-url="https://presentations.clickhouse.com/2023-release-23.7/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 23.7 新增 Overlay、Filesystem、S3 和 HDFS 数据库引擎，扩展 Keeper 存储与重配置、数据格式和字符串函数能力，并引入实验性 PRQL 查询语言。稀疏序列化与多阶段 PREWHERE 默认启用，Parquet 写入新增可选的并行编码器。升级前应核查命名集合授权、投影元数据、分布式 DDL 降级兼容性及稀疏格式支持。

## Breaking Change

- 使用命名集合需要新增的 `NAMED COLLECTION` 权限；授予权限还需配置 `named_collection_admin`，旧配置名称保留为别名。
- 分布式 DDL 条目默认格式升至 5，降级后无法处理尚未完成的新格式条目。
- 启动时严格校验投影元数据，包含无效投影的表可能阻止服务器启动，应在升级前移除。
- 修正 `system.parts.last_removal_attempt_time` 列名；移除实验性 `hashid`。

## New Feature

- 新增文件系统和对象存储数据库引擎，以及将多个数据库组合起来的 Overlay 引擎；实验性支持 PRQL。
- Keeper 支持外部磁盘保存日志和快照，并可通过实验性 `reconfig` 功能动态配置集群。
- 新增 `SYSTEM STOP LISTEN`、异步插入队列主动刷新与关闭时刷新、配置文件加密元素。
- 新增 `initcap`、`hasSubsequence`、`firstLine`、`arrayJaccardIndex`，CSV 支持可变列数，RowBinaryWithDefaults 可表示值缺失。

## Performance

- 默认启用稀疏序列化和多阶段 PREWHERE，并调整条件顺序；降级到 22.1 之前需特别核查稀疏格式兼容性。
- 默认启用 Compact 到 Wide 的纵向合并以节省内存，改善分配器、连接下推、字符串 DISTINCT 和文件缓存锁竞争。
- 可选的自定义 Parquet 编码器支持多线程写入；官方演示展示了约 6 倍提速的示例，该设置仍默认关闭。
- 使用 S3 连接池、减少文件缓存元数据系统调用并支持后台补齐缓存段。

## Bugfix / Security

- 修复 hasToken 无限循环、Aggregator 重复释放、EmbeddedRocksDB 创建段错误、DatabaseCatalog 关闭死锁及多处竞态条件。
- 修复投影、PREWHERE、JOIN、窗口函数、参数化视图、异步插入去重和 Buffer 插入的正确性问题。
- 支持过滤 URL/S3 请求头、自动更新变更证书，并改进多 IP 端点连接和意外崩溃日志刷新。
