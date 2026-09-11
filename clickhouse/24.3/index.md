---
title: ClickHouse 24.3 更新总结
description: ClickHouse 24.3 LTS 的中文更新总结、原始 Changelog、简体中文翻译与 Release 演示。
---

<ReleaseCard
  software="ClickHouse"
  version="24.3"
  date="2024-03-27"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2024"
  accent="#5B8C3A"
  release-label="LTS"
  presentation-url="https://presentations.clickhouse.com/2024-release-24.3/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 24.3 是长期支持版本，默认启用进入 beta 阶段的新查询分析器，提升复杂 SQL 的一致性、功能完整性及优化能力。版本还支持 S3 Express、容量受限的 Memory 表、跨磁盘附加数据片段和 tar 备份。升级前应检查分析器兼容性、旧内存数据片段、异步插入与物化视图去重配置，以及数据导出格式默认值变化。

## Breaking Change

- 默认启用 `allow_experimental_analyzer`；可通过兼容设置或关闭该选项恢复旧分析器。24.3 的新分析器仍不支持窗口视图、annoy/usearch 索引和假设约束等实验性功能。
- 调整 Parquet/ORC/Arrow 的字符串类型默认映射，并将 Parquet 和 ORC 的默认压缩改为 zstd；地理距离函数在全部参数为 Float64 时改用双精度计算和返回类型。
- 移除旧内存数据片段的剩余支持代码；从旧版本升级前必须检查并清除这类数据片段。废弃 Ordinary 数据库引擎。
- 默认拒绝同时启用异步插入和依赖物化视图去重的 INSERT；`locate` 默认采用 MySQL 参数顺序。
- `system.zookeeper` 的 `duration_ms` 更名为 `duration_microseconds`，`clickhouse-copier` 移至独立仓库，默认禁止将 SimpleAggregateFunction 用于 MergeTree 排序键。

## New Feature

- 新分析器统一处理别名、复杂类型、多个 ARRAY JOIN、lambda 别名以及 JOIN 中的 SAMPLE/FINAL 等组合。
- 支持 S3 Express One Zone、跨磁盘附加或移动分区、`ATTACH PARTITION ALL`、tar 备份和容量受限的 Memory 表。
- 新增 `system.keywords`、`getClientHTTPHeader`、`generate_series`、`toMillisecond`，以及返回计数和误差的 topK 模式。
- MergeTree 成为默认表引擎；客户端改进输出格式自动选择，Pretty 格式默认显示行号并突出数字分组。

## Performance

- 主键可跳过加载无助于索引的后缀列，进一步降低内存占用；256 位整数的打印速度提高 30 倍。
- 优化 dotProduct、可空列聚合、multiIf、argMin/argMax 等聚合函数、列过滤和列间数据移动。
- 减少互斥锁和文件系统缓存竞争，并在分布式查询结束时并行清理连接。
- 改善 HTTP 连接复用和 S3 端点分配，支持 Azure Blob Storage 并行读取与异步写入。

## Bugfix / Security

- 修复带 COLUMNS 正则表达式的语法错误查询反复编译正则的问题，降低只读用户造成拒绝服务的风险；新增解析回溯次数限制。
- 修复 CompressionCodecMultiple 缓冲区溢出、并行解析和异步插入死锁，以及多种数组、字典和聚合函数崩溃或错误结果。
- 修复 Keeper、RabbitMQ、S3 凭据、备份恢复及复制数据库的问题；Keeper 检测到无效快照时中止启动，避免数据丢失。
- 修复混合 x86-64/ARM 集群的浮点聚合状态不一致，以及分析器、CTE、SQL SECURITY 和系统表相关缺陷。
