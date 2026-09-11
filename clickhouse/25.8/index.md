---
title: ClickHouse 25.8 LTS 更新总结
description: ClickHouse 25.8 LTS 的中文更新总结、原始 Changelog、简体中文翻译与 Release 演示。
---

<ReleaseCard
  software="ClickHouse"
  version="25.8"
  date="2025-08-28"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2025"
  accent="#168AAD"
  release-label="LTS"
  presentation-url="https://presentations.clickhouse.com/2025-release-25.8/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 25.8 是长期支持版本。向量相似度索引正式可用，轻量更新和数据湖目录进入 Beta，Iceberg 与 DeltaLake 的写入和删除能力进一步完善。新增 Arrow Flight 集成、PromQL 基础支持和抢占式 CPU 调度，并大幅扩展对象存储与并行副本的性能优化。升级应重点核对紧凑数据片段的版本兼容性、JSON 输出与结构推断默认值，以及新增的对象存储权限检查。

## Breaking Change

- JSON 中混合类型数组默认推断为 `Array(Dynamic)`，不再推断为未命名 Tuple；JSON 输出默认不再为 64 位整数加引号。Parquet 默认将 Enum 写为带 ENUM 逻辑类型的 BYTE_ARRAY。
- 默认启用紧凑数据片段子流标记，新生成的紧凑数据片段无法由低于 25.5 的服务器读取。延迟物化仅在启用分析器时可用。
- 默认表达式中含点号的标识符必须加反引号，heredoc 标签仅允许单词字符；默认并发线程调度器改为 `fair_round_robin`。
- Azure、数据湖本地函数和集群变体增加或修正权限检查；GCS 函数要求 S3 READ 授权。外部库分配的内存现在被完整计入，部分查询可能更早触发内存限制。

## New Feature

- 支持 Arrow Flight 表函数和服务器能力，新增 PromQL 基础方言、TimeSeries 函数、大小写不敏感的 JSON 键提取，以及用于结果指纹的 Hash 输出格式。
- 向量相似度索引正式可用并支持二值量化；相关子查询默认启用，轻量更新与删除、Unity/REST/Glue/Hive Metastore 目录进入 Beta。
- Iceberg 支持位置与等值删除、REST/Glue 目录写入、建表删表、简单列变更和删除文件合并；DeltaLake 支持写入与指定快照读取，新增 Hive 风格分区读写。
- 外部聚合和排序可使用对象存储等任意存储策略。新增抢占式 CPU 调度、按 URL 限制 S3 授权，以及自定义 IAM 角色和 GCS OAuth 认证。
- 所有表支持 `_table` 虚拟列，新增死信队列系统表和 ZooKeeper 连接日志；Replicated 数据库可通过 `SYSTEM RESTORE DATABASE REPLICA` 重建 Keeper 元数据。

## Performance

- 实验性 Parquet 读取器 v3 支持页级过滤下推和 PREWHERE；Azure Blob Storage 改用原生 HTTP 客户端与积极重试，降低冷查询延迟和长尾尖峰。
- 按索引大小安排二级索引过滤，优化子列读取、向量搜索、窗口 DISTINCT 聚合及连接内存限制。
- 并行副本支持投影、Rendezvous 哈希分配和更精确的读取范围，减少全表扫描并改善缓存局部性。
- 优化 JSON/Dynamic 子流跟踪、Iceberg 删除文件内存占用、DeltaLake 过滤和并行处理，以及补丁数据片段的应用效率。

## Bugfix / Security

- 修复 Apache ORC 暴露未初始化内存的安全漏洞、多处字符串终止处理与缓冲区越界隐患，并完善 Avro、Iceberg、DeltaLake 凭据遮蔽。
- 修复 Keeper changelog 乱序写入可能导致的不一致和数据丢失，以及复制数据库恢复、S3Queue 重启和备份恢复问题。
- 修复轻量更新与 JSON ALTER UPDATE 的崩溃或数据损坏、查询条件缓存与递归 CTE 的结果错误，以及并行副本和分布式 INSERT SELECT 的错误结果或数据重复。
- 修复 JSON 转 Decimal 的精度丢失、Iceberg 快照与结构解析、DeltaLake 分区读取、内存跟踪偏差及多处客户端和服务器崩溃。
