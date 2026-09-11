---
title: ClickHouse 25.3 更新总结
description: ClickHouse 25.3 LTS 的中文更新总结、原始 Changelog、简体中文翻译与 Release 演示。
---

<ReleaseCard
  software="ClickHouse"
  version="25.3"
  date="2025-03-20"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2025#253"
  accent="#5B8C3A"
  release-label="LTS"
  presentation-url="https://presentations.clickhouse.com/2025-release-25.3/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 25.3 是长期支持版本，JSON、Dynamic 和 Variant 数据类型达到生产可用状态。版本引入 SSH 接口、重新实现的用户态页缓存，以及可复用筛选结果的查询条件缓存；外部文件查询可自动使用集群表函数，并新增实验性 AWS Glue 与 Unity Catalog 集成。升级时应注意复制数据库清空限制和数据跳过索引缓存回退。

## Breaking Change

- 禁止清空复制数据库。
- 回退数据跳过索引缓存。

## New Feature

- JSON、Dynamic 和 Variant 数据类型可用于生产环境；JSON 按路径和类型存储子列，支持高效查询半结构化数据。
- clickhouse-server 支持 SSH 协议，任意 SSH 客户端均可连接；启用并行副本时可自动将表函数替换为对应的 Cluster 版本。
- 用户态页缓存将远程文件系统数据保存在进程内存中，可服务于无本地磁盘缓存的服务器；并发线程调度新增公平轮转策略。
- 新增 `estimateCompressionRatio`、`arraySymmetricDifference`、`keccak256`、Iceberg 分区变换函数及直方图指标，并支持 `LowCardinality(Decimal)`。
- 实验性 AWS Glue 目录支持 Iceberg，Unity Catalog 支持 S3 和本地文件系统上的 DeltaLake；动态自动发现扩展至整个集群。

## Performance

- 查询条件缓存将不满足重复筛选条件的数据范围记录为临时内存索引，后续查询可复用。
- 移除数据片段时主动淘汰相关缓存，减少无效标记缓存积累；减少远程读取缓冲区的过量分配和 Wide 数据片段中 JSON 列预取的内存用量。
- 查询编译考虑机器类型，优化 256 位整数运算、Decimal/DateTime64 的 min/max 以及 `arraySort`。
- 对象存储跳过写入空对象，zstd 升级至 1.5.7，并消除服务器关闭时的 2.5 秒延迟。

## Bugfix / Security

- 修复 Replicated 数据库可能将查询凭据写入日志的问题；配置加密扩展至 users.xml 和嵌套配置文件。
- 修复异步文件插入在数据块大小跨越阈值时丢失数据，以及 JSON 列回滚、并行哈希、Kafka 表创建中的崩溃。
- 修复表重命名与副本重启的竞态、日期时间转换、可空键序列化、BFloat16 排序和分布式谓词下推问题。
- 查询缓存将 UDF 视为非确定性函数，避免错误缓存其结果；修复 MongoDB UUID/OID 映射、JSON 子列读取和数据湖元数据文件选择。
