---
title: ClickHouse 25.7 更新总结
description: ClickHouse 25.7 的中文更新总结、原始 Changelog、简体中文翻译与 Release 演示。
---

<ReleaseCard
  software="ClickHouse"
  version="25.7"
  date="2025-07-24"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2025#257"
  accent="#168AAD"
  presentation-url="https://presentations.clickhouse.com/2025-release-25.7/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 25.7 引入 MergeTree 轻量级 UPDATE，通过补丁数据片段在读取和后台合并时应用更新；Iceberg 新增向已有表插入数据、复杂类型结构演进及按字段 ID 读取等能力。本版还加入客户端 AI SQL 生成、压缩稀疏数值向量、金融与地理函数，以及更细粒度的数据源读写授权。异步日志、默认并行分布式 INSERT SELECT 和 JOIN 优化进一步改善分析性能。

## Breaking Change

- `extractKeyValuePairs` 新增意外引号处理策略，并收紧带引号值之后的键值对分隔符解析；`countMatches` 支持零字节匹配，可通过设置保留旧行为。
- 备份生成同时遵循服务器级本地与远程限速；禁止创建没有可插入列的表。
- 集群函数默认按归档内文件跨节点并行。旧版本已使用归档处理时，升级阶段应将 `cluster_function_process_archive_on_multiple_nodes` 设为 false，以避免兼容性错误。
- `SYSTEM RESTART REPLICAS` 仅重启用户具有 SHOW TABLES 权限的数据库中的副本。

## New Feature

- 新增 `UPDATE ... SET ... WHERE` 轻量级更新，以及通过轻量级更新实现轻量级删除的可选模式。
- 支持向已有 Iceberg 表插入数据、复杂类型结构演进、压缩元数据和按字段 ID 读取，并增强 Glue 与 Databricks 管理表的兼容性。
- ClickHouse 客户端支持以 `??` 发起自然语言 SQL 生成，可连接 OpenAI 或 Anthropic，并自动发现表结构。
- 新增 NumericIndexedVector 压缩数值向量、IRR/NPV 系列金融函数、WKB 输出、多边形相交检查和色彩空间转换。
- 提供默认禁用的外部数据源 READ/WRITE 授权模式、参数化 CREATE USER、Keeper 数据分析工具和多维系统指标；实验性文本索引新增搜索函数与 split 分词器支持。

## Performance

- 引入有界队列的异步日志，避免慢速日志设备阻塞查询；默认并行执行同一集群内的分布式 INSERT SELECT。
- 优化仅含 count 的聚合、Hash JOIN、OR 条件 JOIN 与结果内存分配，并改善 TOTALS 后的多线程执行。
- 优化相关子查询计划、必需列读取、查询树比较和流水线构建，降低短查询开销。
- 减少向量搜索的读取与 CPU 使用，通过异步请求加快数据目录表列举，并改善 Keeper 启动及日志跨磁盘移动。

## Bugfix / Security

- 修复命名集合值的日志遮蔽、S3 权限撤销范围、物化视图定义者权限检查和 SCRAM 认证盐值处理。
- 修复 FINAL 精确跳过索引范围、TTL/min-max 索引、相关子查询、JOIN、物化视图依赖和日期时间转换中的正确性问题。
- 修复 Iceberg 数据竞争、数值向量溢出、聚合状态反序列化、客户端崩溃以及远程查询和关闭过程中的死锁。
- 修复缓存初始化与统计、Keeper 监听器计数、Azure 原生复制回退及 S3 请求签名控制。
