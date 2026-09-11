---
title: ClickHouse 25.2 更新总结
description: 从备份即时挂载数据库、写时复制存储策略、Parquet 布隆过滤器及 JSON 与连接性能改进。
---

<ReleaseCard
  software="ClickHouse"
  version="25.2"
  date="2025-02-27"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2025"
  accent="#5865A8"
  presentation-url="https://presentations.clickhouse.com/2025-release-25.2/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 25.2 扩展了外部数据的使用方式：Backup 数据库引擎可直接访问备份，写时复制策略可在外部只读数据之上进行本地修改。版本还支持可空 JSON、DEFAULT/MATERIALIZED 表达式中的子列，以及 PostgreSQL 协议预处理语句。Parquet 布隆过滤器、JSON 读取和 JOIN 持续优化。跨老版本集群升级时，需要特别注意 ALTER 命令格式与复制的兼容性。

## Breaking Change

- `format_alter_operations_with_parentheses` 默认开启，无法与 24.3 之前的集群保持复制兼容。升级此类集群时，应在服务器配置中关闭该设置，或先升级至 24.3。
- `async_load_databases` 完全默认启用，包括没有更新 `config.xml` 的安装环境。
- `JSONCompactWithNames` 和 `JSONCompactWithNamesAndTypes` 不再输出此前误实现的 totals；移除存在数据竞争的正则表达式日志过滤功能。
- `min_chunk_bytes_for_parallel_parsing` 不再接受零；缓存配置中的未知设置不再被忽略，而会报错。

## New Feature

- Backup 数据库引擎支持即时挂载备份，无需复制数据；可只读访问本地或外部存储中的完整备份及增量备份。
- 存储策略可组合只读与可写磁盘，实现写时复制；外部 MergeTree 表也可直接指向数据目录挂载，无需数据库目录层。
- 支持 `Nullable(JSON)`，以及 DEFAULT、MATERIALIZED 表达式中的子列；新增 PostgreSQL 协议预处理语句和 Web UI 交互式数据库导航。
- 新增 `JSONCompactEachRowWithProgress`、`JSONCompactStringsEachRowWithProgress`，流式发送进度、数据及异常事件；新增 `compareSubstrings` 和跨分片一致的 `initialQueryStartTime`。
- MySQL 命名集合支持 SSL 身份验证。演示还介绍了 Delta Rust Kernel 的早期集成，用于扩展 Delta Lake 结构演进和删除支持；此实现仍处早期阶段。

## Performance

- 默认写入 Parquet 布隆过滤器，并将其与最小值/最大值索引联合评估，提升复杂过滤条件下的数据跳过能力。
- 优化从 S3 上的 Wide 数据片段读取完整 JSON 列，通过子列前缀预取、缓存和并行反序列化，将官方列举的完整读取查询提速至 4 倍，带 `LIMIT 10` 的查询约提速至 10 倍。
- 减少并行哈希连接的竞争与重复预分配，支持从比较关系推导额外过滤条件，并进一步下推 JOIN ON 过滤条件。
- 新增自适应内存溢写调度设置，可让同一查询中的多个 Grace JOIN 协调内存使用，降低内存超限风险；另有窗口函数内存、并行分区拉取和 Keeper 提交路径优化。

## Bugfix / Security

- 限制 `clickhouse-library-bridge` 可加载库的路径，缓解它与服务器相邻部署时加载任意库的风险；隐藏 AzureBlobStorage、Iceberg 的敏感凭据，修正 ALTER RENAME 权限检查。Docker 镜像禁用 default 用户的网络访问。
- 修复 `CODEC(ZSTD, DoubleDelta)` 数据损坏，以及修改投影主键后读取失败的问题；改进包含二进制数据的元数据序列化，保证无损往返转换。
- 修复空值安全 JOIN、索引使用、子列读取、标量子查询 ARRAY JOIN 与 UNION ALL 等查询正确性问题。
- 修复插入异常后的连接状态、Azure 表启动、HTTP 响应头丢失及 S3Queue 重试与提交限制问题，并修复多项崩溃和数据竞争。
