---
title: ClickHouse 24.1 更新总结
description: ClickHouse 24.1 的中文更新总结、原始 Changelog、简体中文翻译与 Release 演示。
---

<ReleaseCard
  software="ClickHouse"
  version="24.1"
  date="2024-01-30"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2024"
  accent="#5865A8"
  presentation-url="https://presentations.clickhouse.com/2024-release-24.1/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 24.1 引入实验性 Variant 联合类型，扩展字符串相似度、时间序列分解与对象存储配置能力。并行副本、HTTP 输出、分布式精确去重和 FINAL 得到加速，合并与 Keeper 的内存占用进一步降低。升级时需检查 FINAL 保序假设、访问控制配置、已废弃设置及 Kusto 方言的停用影响。

## Breaking Change

- 默认启用 `print_pretty_type_names`；废弃不再生效的 `clean_deleted_rows`，默认禁止 `OPTIMIZE CLEANUP`。
- 移除 `reverseDNSQuery`，暂时禁用存在已知缺陷的 Kusto 方言。
- 调整 `sumMapFiltered` 对 NaN 与负零的处理，修正 `visibleWidth` 对字符显示宽度的计算。
- 默认启用访问控制改进；新的纵向 FINAL 即使单线程也不保证输出顺序，依赖排序的查询应显式使用 `ORDER BY`，或按原始说明设置兼容选项。

## New Feature

- 新增实验性 `Variant(T1, T2, ..., TN)`，可在一列中存储不同类型，并通过子列或显式转换读取。
- 新增 DDSketch 分位数、Punycode/IDNA、字符串相似度、数组滑动片段、Sqids 解码及 STL 时间序列分解函数。
- 支持列级压缩块设置、导出压缩级别控制，以及基于 Intel QAT 的 `ZSTD_QAT` 硬件压缩。
- 对象存储与元数据存储可组合配置；分布式 DDL 可跳过非活跃副本，备份与恢复支持取消和 FORMAT 子句。

## Performance

- 重写并行副本协调机制，改进缓存局部性和任务分配；分布式查询中的大型 `uniqExact` 状态可并行合并。
- 使用原生缓冲区加速 HTTP 输出，优化纵向 FINAL、数组元素读取、非数值 MIN/MAX 和可空类型的 `multiIf`。
- 降低 MergeTree 读取、横向及纵向合并、Keeper 和 S3 备份的内存消耗；新增 jemalloc 内存清理与性能分析控制命令。
- `match` 可使用数据跳过索引和实验性倒排索引。

## Bugfix / Security

- 隐藏备份日志中的凭据，改进查询缓存对用户重建和角色切换的隔离，并修复按用户配额。
- 修复连接、投影、窗口函数、分布式 LIMIT、Nullable 与 LowCardinality 相关的错误结果及异常。
- 修复 Kafka 物化视图多次读取、S3/URL/压缩归档读取，以及 Keeper 关闭、数据库关闭死锁和多种崩溃问题。
