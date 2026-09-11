---
title: ClickHouse 25.9 更新总结
description: ClickHouse 25.9 的中文更新总结、原始 Changelog、简体中文翻译与 Release 演示。
---

<ReleaseCard
  software="ClickHouse"
  version="25.9"
  date="2025-09-25"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2025"
  accent="#C96A24"
  presentation-url="https://presentations.clickhouse.com/2025-release-25.9/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 25.9 加强 JOIN 重排和二级索引的流式处理，并引入基于 jemalloc 的全局及按查询内存分析。Iceberg 新增 ALTER UPDATE、多格式写入和元数据日志，NATS 支持 JetStream，Arrow Flight 增加 TLS 与认证。升级需留意 OUTER JOIN USING 合并列解析、复制去重窗口和 Iceberg 结构刷新行为的变化。

## Breaking Change

- 禁止 IPv4/IPv6 与非整数类型进行加减运算，避免此前允许的无意义运算和逻辑错误。
- 弃用 `allow_dynamic_metadata_for_data_lakes`，Iceberg 表现在每次查询前获取最新结构。
- `OUTER JOIN ... USING` 中未限定的 USING 列始终解析为合并列，限定列仍指向各表原列，修复右侧无匹配行时结果错误。
- 复制去重窗口增至 10000；变化完全兼容，但表数量很多时可能增加资源消耗。

## New Feature

- NATS 引擎可订阅 JetStream，Arrow Flight 表函数支持认证和 SSL；新增临时视图、`arrayExcept`、`isValidASCII` 及 TimeSeries 变化/重置计数聚合。
- 新增基于 jemalloc 的全局和按查询内存分析，分配与释放样本可存入 `system.trace_log`。
- Iceberg 支持 ALTER UPDATE、ORC/Avro 写入和删除表时清理数据；数据湖支持自定义磁盘与 Azure，新增 Iceberg 元数据日志、数据库副本信息和聚合 ZooKeeper 操作日志。
- 实验性倒排文本索引重新实现，以支持无法放入内存的数据集；JOIN 重排可利用列统计信息，并支持物化全部统计信息。

## Performance

- JOIN 顺序可根据数据量和统计信息优化，并支持将适用的 ANY JOIN 转为 SEMI/ANTI JOIN、FULL JOIN 转为单侧外连接。
- 可在读取数据时应用数据跳过索引，减少查询启动延迟与多余索引读取；优化 PREWHERE、基数排序、大量数据片段的短查询和轻量删除后的纵向合并。
- 数据湖支持分布式 INSERT SELECT，Iceberg 单次插入可写多个文件，并为 Iceberg/DeltaLake 文件设置行数和字节数上限。
- 查询条件缓存可跳过低选择性谓词，后台调度池可限制单类任务占比，S3 重试与限速策略进一步完善。

## Bugfix / Security

- 修复非相关 EXISTS、uniqExact 配合 ROLLUP/CUBE、子列更新、JSON/Nullable 转换和并行查询中的结果错误或崩溃。
- 修复 Parquet 读取器 v3 死锁、内存跟踪泄漏、Keeper 在禁用 IPv6 环境中的启动，以及复制数据库恢复和物化视图重建问题。
- 修复数据湖结构映射、DeltaLake 子列读取、S3Queue 会话过期和备份空文件处理；EmbeddedRocksDB 路径限定在 user_files 内。
- 完善数据库名纠错提示的权限检查、HTTP UDF 块头、Arrow Flight 关闭及日志刷写的异常处理。
