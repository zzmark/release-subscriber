---
title: ClickHouse 24.11 更新总结
description: ClickHouse 24.11 的中文更新总结、原始 Changelog、简体中文翻译与 Release 演示。
---

<ReleaseCard
  software="ClickHouse"
  version="24.11"
  date="2024-11-26"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2024"
  accent="#C96A24"
  presentation-url="https://presentations.clickhouse.com/2024-release-24.11/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 24.11 引入通过 SQL 动态管理工作负载、BFloat16 低精度浮点数，以及在集群上查询数据湖的表函数。并行副本减少重复查询分析，标记缓存支持预热，大规模 MergeTree 表的索引粒度元数据内存占用进一步降低。升级时应检查消息队列表引擎的独立授权，并留意实验性 JSON、Dynamic 与 Variant 的序列化和使用限制。

## Breaking Change

- Kafka、NATS、RabbitMQ 表引擎新增各自的 `SOURCES` 权限，需要为创建相关表的非默认用户补充授权。移除误添加的 `generate_series`、`generateSeries` 系统表及 `StorageExternalDistributed`。
- 变更操作执行前验证完整查询和子查询；`deltaSumTimestamp` 收紧参数类型支持，文件系统缓存的单查询下载限制设置更名。
- JSON 与 Dynamic 序列化升级到 V2，可用 `merge_tree_use_v1_object_and_dynamic_serialization` 保持 V1，以便升级期间回退。默认禁止 Variant/Dynamic 用于排序键、分组键、分区键和主键，也禁止用于 min/max。

## New Feature

- 新增工作负载与资源管理 SQL 语法，可动态配置资源限额、公平调度与工作负载层级。
- 新增 `BFloat16` 数据类型，适合低精度计算和向量距离搜索；新增 `CHECK GRANT`、`parseDateTime64` 系列函数及数据湖集群表函数。
- `ORDER BY ... WITH FILL` 支持 `STALENESS`，为时间序列缺口填充设置陈旧度范围；认证方法可分别设置到期时间。
- HTTP 处理器支持封装用户与密码，HTTP 流式响应可可靠报告异常；Vertical 输出增加数字分组和易读提示，`clickhouse-local` 默认使用 Atomic 数据库并支持隐式 SELECT。

## Performance

- 并行哈希连接减少列复制，Replacing 合并针对不相交范围优化；并行副本在发起端生成完整计划，减少其他副本的查询分析开销。
- 优化索引粒度元数据与内存数组占用，新增标记缓存预热，并通过虚拟行减少按序读取需要处理的数据。
- `plain_rewritable` 在内存中缓存文件名列表，减少对象存储 API 调用；系统数据库可异步加载，压缩工具支持多线程，查询指标采集缩短临界区。

## Bugfix / Security

- 修复投影轻量删除遗漏 `_row_exists`、Dynamic/JSON/Nullable 组合处理、异步 Native 插入和多分区写入的内存问题。
- 修复带 `WITH TIES` 查询返回行数不足、并行副本的 RIGHT/FULL JOIN 处理，以及 S3 通配路径包含空对象时的漏行或异常；S3 默认跳过空文件。
- 改进集群备份恢复的失败传播、取消和 ZooKeeper 断连处理，修复客户端退出码、证书重载及多处查询崩溃。
