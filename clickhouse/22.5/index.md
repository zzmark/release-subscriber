---
title: ClickHouse 22.5 更新总结
description: ClickHouse 22.5 的中文更新总结、原始 Changelog、简体中文翻译与 Release 演示。
---

<ReleaseCard
  software="ClickHouse"
  version="22.5"
  date="2022-05-19"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2022"
  accent="#5B8C3A"
  presentation-url="https://presentations.clickhouse.com/2022-release-22.5/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 22.5 新增支持并行执行的 `GROUPING SETS`、`MySQLDump` 输入和 `Prometheus` 输出格式，并默认启用灵活的内存过量分配机制。此版本优化聚合、排序比较器 JIT 编译及一元算术函数，并扩展证书检查和诊断工具。升级时应注意默认内存与线程日志策略、移除的函数和密码算法，以及系统指标统计口径变化。

## Breaking Change

- 默认用户配置不再设置固定的 10 GB `max_memory_usage`，并默认启用内存过量分配；内存不足时会按超额使用情况选择查询终止，其他查询可等待内存释放。原有内存设置仍可用作硬性限制。
- BoringSSL 切换至官方符合 FIPS 要求的版本，移除该版本不包含的 `aes-192-cfb128` 和 `aes-256-cfb128` 算法。
- 默认禁用 `log_query_threads`，避免异步读取带来的大量线程日志开销；移除存在错误的 `groupArraySorted` 函数。
- 后台合并、变更操作和 `OPTIMIZE` 不再增加 `SelectedRows`、`SelectedBytes`，仍增加合并专用指标；监控应注意统计口径变化。

## New Feature

- `GROUP BY` 支持并行处理的 `GROUPING SETS`，可按任意键集合聚合。
- 新增 `MySQLDump` 输入格式及结构推断，便于导入 MySQL 表转储；新增 `Prometheus` 输出格式，可用于自定义指标 HTTP 端点。
- 新增 `system.certificates`、单一二进制诊断工具、H3 函数、数组距离与范数函数，以及 `wyHash64`。
- 复制数据库新增 `SYSTEM SYNC DATABASE REPLICA`；Keeper 支持无需法定多数的强制恢复。
- 扩展 Protobuf 包装类型的可空值处理、远程文件系统缓存检查、具名配置和集群授权控制。

## Performance

- 提升不带 GROUP BY 的 `avg`、`sum` 性能，演示给出的最高加速为 1.5 倍；一元算术函数通过动态分派最高达到原来的 7 倍。
- 对排序列比较器进行 JIT 编译，优化 ORDER BY、MergeJoin 和 MergeTree 插入；演示案例显示约 30% 提升。
- `system.asynchronous_metric_log` 空间占用降至约十分之一，并移除无用的 `event_time_microseconds` 字段。
- 宽数据片段仅加载必要列的标记，优化文件描述符缓存、大目录通配符读取和 HiveText 并行解析。

## Bugfix / Security

- 修复结构推断中可能发生的堆内存释放后使用，以及 JOIN/COLUMNS 空指针解引用、对冲请求无限等待和 Keeper 压缩日志损坏。
- 修复分组聚合、IPv4/IPv6 转换、`quantileTDigest`、`INTERPOLATE`、嵌套列和远程文件系统读取中的错误结果或异常。
- 修复 `Object` 多文件插入与合并、WindowView 触发及删除源表卡住、缓存初始化与配置变更等实验性功能问题。
- 修复 s3Cluster 结构推断导致读取不全的问题，并修正端口变更重新加载、外部字典解析和客户端取消查询等行为。
