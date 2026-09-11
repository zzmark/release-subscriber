---
title: ClickHouse 22.11 更新总结
description: ClickHouse 22.11 的中文更新总结、原始 Changelog、简体中文翻译与 Release 演示。
---

<ReleaseCard
  software="ClickHouse"
  version="22.11"
  date="2022-11-17"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2022"
  accent="#C96A24"
  presentation-url="https://presentations.clickhouse.com/2022-release-22.11/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 22.11 扩展数据湖访问，新增 S3 上 Hudi 和 Delta Lake 的只读表引擎与表函数，以及可直接附加远程表的 `s3_plain` 磁盘。此版本还支持复合时间间隔、递归通配符和 Keeper 会话丢失后的 INSERT 重试。性能与稳定性改进涵盖前缀索引分析、有序读取、Keeper 提交及敏感信息遮蔽。

## Breaking Change

- `JSONExtract` 函数家族现在会尝试将值转换为请求的类型；依赖此前严格类型匹配行为的查询需要检查结果。

## New Feature

- 新增 `Hudi`、`DeltaLake` 表引擎，以及 `hudi`、`deltaLake` 表函数，仅支持读取 S3 数据。
- 新增 `s3_plain` 磁盘，支持一次写入、多次读取，并可直接附加 MergeTree 表。
- 支持时间间隔加减、取负及混合单位语法；`**` 支持递归遍历文件系统与 S3。
- Keeper 会话丢失时可重试向 ReplicatedMergeTree 的 INSERT，减少 Keeper 重启造成的插入错误。
- 新增 Spark 兼容函数、`formatReadableDecimalSize`、`displayName`、Keeper 快照/Raft 信息命令，以及命名集合通用实现。
- 表函数可按自身权限支持只读模式；INSERT VALUES 支持交互式查询参数，查询日志记录实际应用的行级策略。

## Performance

- 字符串前缀 `match` 和 `NOT LIKE 'prefix%'` 可使用索引；加快连续 AND/OR 运算，并为 LineAsString 提供并行解析。
- 改善 Keeper 在大量未提交状态下的提交性能，帮助跟随节点加快同步。
- 默认基于查询计划执行有序读取优化，可通过 `query_plan_read_in_order = 0` 恢复旧实现。
- S3 备份按指数增大上传分段，避免 10000 段限制；限流算法改为令牌桶。

## Bugfix / Security

- 在查询日志、服务器日志和错误消息中遮蔽密码与密钥。
- 修复聚合状态反序列化中的多处缓冲区越界读取、LZ4 畸形输入边界检查、DNS/c-ares 段错误和解析器栈内存返回后使用。
- 修复主键与可空键分析、哈希连接多析取条件、投影缺失、UTF-8 跨边界处理及 DateTime 解析溢出。
- 修复 Lazy 数据库备份竞争、s3Cluster 结构推断与跳过不可用分片、URL 重试、PostgreSQL 附加表及 RPM 用户配置保护。
