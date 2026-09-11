---
title: ClickHouse 22.9 更新总结
description: ClickHouse 22.9 的中文更新总结、原始 Changelog、简体中文翻译与 Release 演示。
---

<ReleaseCard
  software="ClickHouse"
  version="22.9"
  date="2022-09-22"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2022"
  accent="#C96A24"
  presentation-url="https://presentations.clickhouse.com/2022-release-22.9/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 22.9 新增内嵌仪表板、只读用户可修改的设置约束、更多 JSON 导入控制，以及实验性的 Annoy 近似最近邻索引和 KeeperMap 元数据存储。性能改进集中于压缩及异步加载标记、聚合软件预取、连接、备份和正则表达式。此版本同时修复多项内存安全、权限和潜在数据丢失问题；升级旧集群及迁移 CatBoost 调用时需提前检查兼容性。

## Breaking Change

- 存在 ReplicatedMergeTree 表时，从 20.3 或更早版本升级到 22.9 或更新版本，必须经过中间版本，否则新服务器无法启动。
- 移除未记录的 `accurate_Cast`、`accurate_CastOrNull`；`accurateCast`、`accurateCastOrNull` 不受此移除影响。
- 表函数 `MeiliSearch` 改名为 `meilisearch`；`lemmatize`、`synonyms`、`stem` 改为区分大小写。
- CatBoost 推理移至独立的 clickhouse-library-bridge 进程，通过 HTTP 与服务器通信；`modelEvaluate()` 替换为 `catboostEvaluate()`。
- YAML 配置解释方式调整为更常规的行为。

## New Feature

- 新增内嵌仪表板、`insert_quorum = 'auto'` 多数副本写入确认和 `changeable_in_readonly` 设置约束。
- 支持 `INTERSECT DISTINCT`、`EXCEPT DISTINCT`、`JSONObjectEachRow`，以及从 JSON/JSONCompact/JSONColumnsWithMetadata 导入。
- 新增 JSON 类型元数据校验、UTF-8 校验、数字字符串读取和带引号十进制数输出控制；CSV/TSV 解析错误可保存到文件供后续分析。
- 实验性 Annoy 索引支持近似最近邻搜索；KeeperMap 将 Keeper/ZooKeeper 用作少量元数据的键值存储。
- 复制表在 Keeper/ZooKeeper 暂不可用时以只读模式启动，并在连接建立后异步完成初始化；EmbeddedRocksDB 扩展 TTL、只读及 DELETE/UPDATE 支持。
- 演示介绍官方 Node.JS 驱动和 Grafana 插件 2.0 的 HTTP、半结构化数据及原生筛选支持。

## Performance

- 压缩标记和主键，支持通过线程池异步预加载标记，减少虚拟文件系统查询启动开销。
- 聚合默认使用软件预取，并按 `max_block_size` 生成结果，使后续步骤使用更多线程；优化多可空参数聚合及 `uniqState` 读取。
- 全排序连接在排序前相互筛选输入，优化 Float 并行哈希连接、LZ4 解压和 ARM vectorscan 正则表达式处理。
- 备份尽可能使用原生复制，S3 对象分散到多个随机路径前缀，并修复高并发缓存回退及宽表变更内存使用问题。

## Bugfix / Security

- 修复 AWS SDK 引发的 S3 潜在数据丢失，以及零拷贝复制中的罕见数据丢失问题。
- 修复 Native 恶意数据崩溃、ORC 缓冲区越界、加密及聚合函数内存安全问题、多个死锁和释放后使用。
- 修复已撤销删除数据库权限的用户仍可删除数据库，以及 DESCRIBE 表函数权限检查问题；主二进制文件禁止使用 `dlopen`。
- 修复窗口查询、GROUPING、投影、IN 精度损失、ORDER BY/LIMIT、OFFSET 外层筛选及分布式 DDL 的错误结果或异常。
- 修复轻量删除行的垂直合并、增量备份、文件系统缓存竞争、Keeper 关闭和异步 Object 插入等稳定性问题。
