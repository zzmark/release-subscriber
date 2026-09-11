---
title: ClickHouse 23.4 更新总结
description: ClickHouse 23.4 的中文更新总结、原始 Changelog、简体中文翻译与 Release 演示。
---

<ReleaseCard
  software="ClickHouse"
  version="23.4"
  date="2023-04-26"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2023#234"
  accent="#5B8C3A"
  presentation-url="https://presentations.clickhouse.com/2023-release-23.4/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 23.4 重点提升 Parquet 读取和副本连接性能，扩展 Iceberg、Hudi、DeltaLake 数据湖支持，并新增日志键值提取、统计检验和兼容性函数。查询缓存支持压缩及按用户配额，备份和 IO 可按查询或服务器限速。升级时需检查日期格式符、重复索引表达式和虚拟文件系统缓存路径。

## Breaking Change

- `formatDateTime` 的 `%M` 改为输出月份名称而非分钟，以兼容 MySQL；可通过兼容设置恢复旧行为。
- 虚拟文件系统缓存中的非空相对路径改为解析至服务器数据目录的 `caches` 子目录。
- 默认拒绝主索引、二级索引及排序键中的重复表达式，可通过 `allow_suspicious_indices` 调整。

## New Feature

- 新增 `quantileGK`、`kolmogorovSmirnovTest`、`soundex`、`kafkaMurmurHash`、`extractKeyValuePairs` 和更多 Map 函数。
- 新增 `SHOW COLUMNS`、`GRANT CURRENT GRANTS`、`BACKUP ALL`、`PrettyJSONEachRow` 和 `ParquetMetadata`；支持 SELECT 列表尾随逗号及命令行设置名中的连字符。
- `SYSTEM SYNC REPLICA` 新增 LIGHTWEIGHT 与 PULL 模式，`system.replicas` 支持持久化的数据片段丢失计数。
- 扩展 Iceberg v2、数据湖分区读取和变更跟踪，新增 KeeperMap 严格模式及服务器 UUID 宏。

## Performance

- Parquet 读取并行执行 IO 与解码，仅读取所需范围；官方演示展示了特定场景中达到原来 100 倍的读取速度。
- 副本连接及跨分片发送改为异步处理，结合对冲连接提高故障切换与跨区域连接的适应性。
- 缓存变更操作中重复的 IN 子查询集合，减少内存与 CPU 消耗；降低线程池竞争并改善多项并行副本行为。
- 查询缓存条目合并并压缩，支持按用户配额；可选地在文件等数据源读取后立即并行处理查询。

## Bugfix / Security

- 修复 RabbitMQ CPU 使用和数据竞争、S3 大文件上传崩溃、VFS 缓存段错误以及多种并行加载问题。
- 修复 RENAME COLUMN、表依赖关系、LowCardinality、Map、Protobuf、Parquet/Arrow 和聚合空结果的正确性问题。
- 修复零复制机制下的数据片段操作、SYSTEM SYNC REPLICA 等待和 Keeper ACL 行为，并改进证书认证失败后的密码回退。
