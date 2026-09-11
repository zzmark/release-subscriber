---
title: ClickHouse 22.4 更新总结
description: ClickHouse 22.4 的中文更新总结、原始 Changelog、简体中文翻译与 Release 演示。
---

<ReleaseCard
  software="ClickHouse"
  version="22.4"
  date="2022-04-19"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2022"
  accent="#5B8C3A"
  presentation-url="https://presentations.clickhouse.com/2022-release-22.4/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 22.4 扩展时间序列查询能力，支持在 `ORDER BY ... WITH FILL` 中通过 `INTERPOLATE` 填补空缺，并新增日期时间构造、亚秒级时间间隔和多项 H3 函数。性能改进涵盖延后函数计算、聚合哈希表容量预测、ASOF JOIN，以及 URL/S3 并行传输。非复制 MergeTree 事务与 RocksDB 数据片段元数据存储仍属于实验性功能，升级时应检查 INSERT 语法以及新建用户的降级兼容性。

## Breaking Change

- INSERT 查询默认不再允许将 SETTINGS 放在 FORMAT 后；需要兼容旧查询时可开启 `allow_settings_after_format_in_insert`。
- `yandexConsistentHash` 重命名为 `kostikConsistentHash`；旧名暂保留为兼容别名，但后续版本可能移除，建议更新调用。
- 演示说明：22.4 起创建采用 SHA256 密码的用户时会加入随机盐；如果已在 22.4 或更新版本创建用户，则不能降级至 22.3。

## New Feature

- `ORDER BY ... WITH FILL` 新增 `INTERPOLATE`，支持使用前一个值和表达式填补空缺，可同时处理多列。
- 新增日期时间构造函数、`toLastDayOfMonth`、毫秒/微秒/纳秒时间间隔及运算函数，并扩展 H3 支持。
- 新增处理器级性能分析、`WRITTEN BYTES` 配额、`simple` 行策略及服务器启动检查。
- 扩展结构推断：覆盖 `s3Cluster`、`hdfsCluster`、`JSONAsObject` 等场景，并改进可空类型及列名匹配。
- 实验性事务为非复制 MergeTree 表提供 ACID、MVCC 和快照隔离；远程文件系统缓存新增写入、检查和清理能力。

## Performance

- 尽可能在 `ORDER BY` 和 `LIMIT` 后计算函数，原始 Changelog 示例约有 20 倍加速；收集聚合哈希表大小，供后续查询预分配容量。
- 优化 ASOF JOIN 与 `hasAll`，后者使用 SSE 和 AVX2 SIMD 指令。
- URL/S3 支持并行下载，S3 支持并行分段上传；缩小 HDFS 互斥锁范围。
- 实验性 RocksDB 元数据存储在 70 万个数据片段的案例中，将服务器启动时间从 75 分钟缩短至 20 秒。

## Bugfix / Security

- 因模糊测试发现内存安全问题而禁用 `session_log`；为新建用户的 SHA256 密码加入随机盐，降低密码存储泄露后的攻击风险。
- 修复物化视图重启后不更新、`Object` 子列丢失、多分区插入、投影检查和稀疏列变更操作等问题。
- 修复 IPv4/IPv6 转换、短路求值、`throwIf`、`HashJoin`、分区裁剪及 Keeper 连接稳定性问题。
- 修复远程文件系统缓存并发和死锁问题，并在 URL 结构推断前及 Hive 访问时遵循主机白名单。
