---
title: ClickHouse 25.6 更新总结
description: ClickHouse 25.6 的中文更新总结、原始 Changelog、简体中文翻译与 Release 演示。
---

<ReleaseCard
  software="ClickHouse"
  version="25.6"
  date="2025-06-26"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2025#256"
  accent="#168AAD"
  presentation-url="https://presentations.clickhouse.com/2025-release-25.6/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 25.6 带来 Time/Time64、CoalescingMergeTree、lag/lead 窗口函数和内置终端诊断工具 chdig，扩展时间数据处理与 SQL 兼容性。共享查询快照、自定义数据库磁盘和直接读写 Parquet JSON 增强了数据处理能力；查询槽位调度、多投影筛选及并行网络数据块处理改善了高并发和分布式分析。本版同时修复大量查询正确性、存储和内存问题，并更新多个含安全修复的依赖。

## Breaking Change

- `countMatches` 遇到空匹配后会继续向前扫描；需要旧行为时可启用 `count_matches_stop_at_empty_match`。
- `backup_threads` 和 `restore_threads` 必须为非零值。
- 修正 String 类型 `bitNot` 结果的内部零字节终止表示，官方说明不应影响用户可见行为。

## New Feature

- 新增 Time/Time64 及转换函数，保留 `use_legacy_to_time` 兼容设置；支持 lag/lead、时间序列网格计算、WKB、Bech32 和 Map 值筛选函数。
- 新增 CoalescingMergeTree、内置 chdig 终端工具、`system.codecs` 及内嵌 Web 工具入口。
- 支持让同一查询中的表引用共享存储快照，并将 Atomic/Ordinary 数据库元数据存储到自定义磁盘；这些数据库不能在多台服务器间共享。
- 支持直接在 Parquet 中读写 JSON、查询本地 Delta 表，并增强 Iceberg 快照历史查看。
- 实验性文本索引支持显式分词器参数，索引类型由 `gin` 更名为 `text`；Kafka2 新增基于 Keeper 的分区再平衡逻辑。

## Performance

- 支持按并发查询数量调度工作负载，并将分布式数据块序列化、反序列化和压缩工作并行处理。
- 启用多投影数据片段筛选，改进布隆过滤器与主键范围搜索；FINAL 默认以精确模式使用跳过索引。
- 文件系统缓存默认使用 SLRU，减少查询条件缓存和流水线中的锁竞争。
- 优化异步插入、两级哈希表复用、`uniqExact` 合并和极短查询；并行副本避免等待无用的慢副本，并使用独立连接超时。

## Bugfix / Security

- 更新 curl 修复 CVE-2025-5025、CVE-2025-4947，更新 libarchive 修复多项安全漏洞，并升级 OpenSSL、Kerberos 等依赖。
- 修复 Npy 越界读取、网络数组偏移校验、聚合器崩溃、字典悬空指针及多处内存耗尽和数据竞争。
- 修复相关子查询、JOIN、分组集、投影、延迟物化、可空键排序和分布式查询中的错误结果。
- 修复 Kafka 关闭、Keeper 日志提交、复制表恢复、HTTP 连接处理，以及 Iceberg、DeltaLake、MongoDB 和 PostgreSQL 集成问题。
