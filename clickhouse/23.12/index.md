---
title: ClickHouse 23.12 更新总结
description: ClickHouse 23.12 的中文更新总结、原始 Changelog、简体中文翻译与 Release 演示。
---

<ReleaseCard
  software="ClickHouse"
  version="23.12"
  date="2023-12-28"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2023#2312"
  accent="#5865A8"
  presentation-url="https://presentations.clickhouse.com/2023-release-23.12/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 23.12 引入可刷新物化视图、按行号拼接结果的 `PASTE JOIN` 和 `ORDER BY ALL`，并增强轻量级删除、文件结构推断与索引能力。性能方面重点优化 FINAL 查询、Hash JOIN 内存、聚合及 MIN/MAX，同时改善 S3 复制和文件系统缓存。升级时需要关注 TTL 表达式的新限制，以及 ReplacingMergeTree 清理功能的调整。

## Breaking Change

- 修复 TTL 表达式中非确定性函数的检查，默认禁止不依赖表中任何列的 TTL 表达式；可通过 `allow_suspicious_ttl_expressions` 或兼容性设置恢复后一项行为。
- `clean_deleted_rows` 已弃用且不再生效。`OPTIMIZE CLEANUP` 默认禁用，需通过 `allow_experimental_replacing_merge_with_cleanup` 显式启用。

## New Feature

- 新增可刷新物化视图，可在后台按计划执行查询并原子替换结果，支持多个物化视图之间的依赖关系。
- 新增 `PASTE JOIN`、`ORDER BY ALL`、Sqids 生成、FFT 周期检测和 `SHA512_256` 函数。
- 新增 `ALTER TABLE ... APPLY DELETED MASK`，可将轻量级删除掩码应用到磁盘数据；支持 ALIAS 列上的非主键索引及 `_part_offset` 谓词的主键分析。
- 结构推断支持合并多个文件结构的 `union` 模式；Keeper 增加就绪检查端点、软内存限制和只读连接支持。
- 新增 `/binary` 可视化查看器，并增强备份、系统日志、S3 只读磁盘与查询参数支持。

## Performance

- FINAL 处理跳过主键范围互不相交的数据片段；当分区键仅由主键列组成时，可避免跨分区合并。
- Hash JOIN 控制输出数据块大小以降低内存压力；聚合更早释放内存，并优化相同键、字符串及原生类型 MIN/MAX 处理。
- S3 磁盘之间使用服务器端复制，加快备份恢复和磁盘复制；文件系统缓存新增 SLRU 策略并降低读取与状态查询开销。
- `Merge` 表支持简单计数优化，`hasAny` 可利用全文跳过索引，条件函数采用无分支计算。

## Bugfix / Security

- 防止通过 `dictionary` 表函数绕过字典访问控制，修复 BLAKE3 无效内存访问和 Poco UTF32Encoding 整数溢出。
- 修复 TTL GROUP BY 排序、LTTB 分桶、JOIN 类型处理、稀疏列聚合以及投影仅部分物化时的外部聚合结果。
- 修复 Keeper 预处理、分布式发送、集群备份恢复重试和 PostgreSQL 数据源问题。
- 修复格式解析、读写锁超时状态、堆栈跟踪挂起及超出范围的 DateTime 转换；因存在缺陷而禁用 `system.kafka_consumers`。
