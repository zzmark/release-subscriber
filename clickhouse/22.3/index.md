---
title: ClickHouse 22.3 更新总结
description: ClickHouse 22.3 LTS 的中文更新总结、原始 Changelog、简体中文翻译与 Release 演示。
---

<ReleaseCard
  software="ClickHouse"
  version="22.3"
  date="2022-03-17"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2022"
  accent="#5B8C3A"
  release-label="LTS"
  presentation-url="https://presentations.clickhouse.com/2022-release-22.3/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 22.3 是长期支持版本，重点扩展了远程文件系统、Hive 与半结构化数据能力：S3 磁盘可启用本地数据缓存，新增 `hive` 表函数与 `Object(<schema_format>)` 实验性类型，并支持通过 X.509 证书认证。升级时需重点检查 `arrayCompact`、`toDatetime` 以及 IPv4/IPv6 转换函数的兼容性变化。

## Breaking Change

- `arrayCompact` 改为压缩原始数组，而不再压缩 lambda 结果；需要旧行为时可先使用 `arrayMap`。
- `toDatetime` 溢出时改为饱和到支持范围的最小或最大时间点，不再回绕。
- `toIPv4`、`toIPv6` 及相应 `cast` 对无效地址默认抛出异常；依赖旧行为的应用需改用 `OrDefault`/`OrNull` 变体，或启用兼容设置。

## New Feature

- S3 磁盘支持远程文件系统数据的本地缓存，并经过更完整的 S3 测试验证。
- 新增 `hive` 表函数、插入 File/HDFS/S3/URL 表函数时的结构推断，以及数组版 `startsWith`、`endsWith`。
- 支持以 X.509 证书认证 SSL 用户，并让 clickhouse-client 从环境变量读取默认凭据。
- Map 类型新增 `mapReplace`、`mapFilter` 和 `mapMap`；实验性 `Object` 类型可按路径存储和查询 JSON 半结构化数据。

## Performance

- 优化 `MergeTree` 插入排序，实际基准中最高可达到约 2 倍提升。
- 从 URL、S3 与 Hive 读取 Parquet、ORC、Arrow 时支持列裁剪。
- 提升大规模 `IN`、`direct` 字典、字符集与语言检测、`any` 聚合函数的性能。
- ClickHouse Keeper 减少锁竞争和内存占用，并优化 RAFT 日志存储压缩。

## Bugfix / Security

- 修复 HDFS Snappy 解码、部分合并连接重复行、多种压缩格式小缓冲区读取、JSONEachRow 结构推断等问题。
- 修复 MaterializedPostgreSQL、Hive、PostgreSQL、S3 远程 VFS、WindowView、S2/H3 与分布式子查询中的多项异常和错误结果。
- 加强远程 URL 主机限制、Keeper 配置校验及潜在不安全认证方式的服务端控制。
- 修复服务器关闭死锁、FileLog 段错误、稀疏列 `CHECK TABLE`、分区裁剪和投影优化等稳定性问题。
