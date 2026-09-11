---
title: ClickHouse 23.6 更新总结
description: ClickHouse 23.6 的中文更新总结、原始 Changelog、简体中文翻译与 Release 演示。
---

<ReleaseCard
  software="ClickHouse"
  version="23.6"
  date="2023-06-29"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2023#236"
  accent="#168AAD"
  presentation-url="https://presentations.clickhouse.com/2023-release-23.6/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 23.6 新增 Redis 集成、会话时区、客户端连接字符串和文件处理选项，transform 与按值匹配的 CASE 扩展到所有数据类型。版本重点优化 ReplicatedMergeTree 后台调度、数据湖读取与排序，并调整数据片段和变更操作积压时的保护机制。升级时需检查移除的实验性功能、HTTP 头大小限制及 CPU 指标口径。

## Breaking Change

- 移除文件系统缓存的 `do_not_evict_index_and_mark_files` 功能，以及实验性 LIVE VIEW 的 ALTER 支持。
- HTTP 字段名称和值的默认最大大小降低至 128 KiB。
- CPU 相关 CGroups 指标改为 `CGroupMaxCPU`，归一化 CPU 使用率在配置限制时按 CGroups 限制计算。

## New Feature

- 新增 Redis 表引擎和表函数，支持查询外部 Redis；MongoDB 集成更新协议以支持 5.1 及更新版本。
- `transform` 和按值匹配的 CASE 支持所有数据类型；新增 `session_timezone`，客户端支持连接字符串。
- 文件处理支持处理后按模式重命名、跳过空文件和 OUTFILE TRUNCATE；结构推断可限制读取字节数。
- DEFLATE_QPL 脱离实验性状态，改由专用服务器设置控制；独立 Keeper 二进制文件内置 keeper-client。

## Performance

- ReplicatedMergeTree 对无须合并或清理的表采用更温和的后台调度；官方演示中的大量表场景降低了 CPU 使用，Keeper 请求与网络流量约降至原来的 1/3。
- 放宽数据片段数量阈值，并恢复长时间插入过程中的背压；默认在积压 500 个变更操作时延迟新变更，在 1000 个时拒绝。
- 优化接近有序数据的排序、CapnProto 读写、Parquet 并行写入、ZooKeeper 并行读取，以及数据湖同步 HEAD 请求瓶颈。
- 支持过滤器穿过 CROSS JOIN 下推，减少 GLOBAL JOIN 右表列读取，并让分析器支持并行副本。

## Bugfix / Security

- 修复 LDAP 参数缓存哈希，生成安全的初始化向量，并修复 StorageURL 切换 URL 时的释放后使用问题。
- 修复 uniqExact 并行合并、IP 类型哈希兼容性、投影顺序读取和含子查询的查询缓存。
- 修复 Azure Blob Storage 迭代器竞态、Iceberg 元数据解析、备份锁及重复写入，以及 S3、编译表达式和备份协调中的崩溃。
