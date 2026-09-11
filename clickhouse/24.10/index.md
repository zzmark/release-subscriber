---
title: ClickHouse 24.10 更新总结
description: ClickHouse 24.10 的中文更新总结、原始 Changelog、简体中文翻译与 Release 演示。
---

<ReleaseCard
  software="ClickHouse"
  version="24.10"
  date="2024-10-31"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2024"
  accent="#C96A24"
  presentation-url="https://presentations.clickhouse.com/2024-release-24.10/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 24.10 将可刷新物化视图提升为生产可用，并行副本进入 beta。版本新增表克隆、通配符前缀授权、客户端实时指标、远程文件缓存和合并可视化页面。MongoDB、Parquet 与 Dynamic/JSON 支持继续扩展。升级时注意 SETTINGS 优先级、默认过滤条件重排，以及实验性 DeflateQPL 编解码器移除。

## Breaking Change

- UNION 查询中允许 SETTINGS 位于 FORMAT 之前；多层 SETTINGS 按距离子查询最近的子句优先，可能改变此前外层覆盖内层的行为。
- 默认允许重排 PREWHERE/WHERE 条件，可通过 `allow_reorder_prewhere_conditions=false` 禁用。
- 移除许可证不兼容的 idxd-config 库及实验性 Intel DeflateQPL 编解码器。

## New Feature

- 可刷新物化视图生产可用，并支持 Replicated 数据库；并行副本进入 beta，新增 enable_parallel_replicas 开关及统一算法设置。
- CREATE TABLE CLONE AS 可快速克隆 MergeTree 表结构并附加所有分区；授权支持数据库与表名通配符前缀。
- 新增客户端实时进度指标表、query_metric_log 和 /merges 可视化，便于观察查询与合并。
- 对象存储直接文件和数据湖支持基于路径与 ETag 的缓存；MongoDB 新集成扩展类型和过滤/排序下推，Iceberg 支持 HDFS。
- 新增参数化别名、隐式 SELECT、格式转换 --copy、arrayUnion、arrayElementOrNull 和 RIPEMD160。
- Dynamic 可应用更多函数，JSON 扩展二进制与 Native 格式序列化，Avro Union 可与 Variant 互转。

## Performance

- 复制表数据片段无锁重命名，减少并发 INSERT 对 SELECT 的影响；优化线程创建和后台合并调度。
- Parquet 利用布隆过滤器、并行行组读取和预取；pointInPolygon 可使用 minmax 索引。
- 可直接解析到稀疏列，改善缺失值较多的输入；加快对象存储初始化和 Unix 时间转换。
- REPLACE PARTITION 不再等待其他分区的合并或变更，Keeper ACL 同步避免重复校验。

## Bugfix / Security

- 修复 bcrypt 认证用户的密码泄露到 query_log，以及解压和 Protobuf 缓存中的释放后使用风险。
- 修复 JOIN 条件优化、跳过索引、元组共享、Dynamic/JSON 及窗口函数的错误结果和崩溃。
- 修复启动脚本意外改变全局设置、并发控制限制未生效、分布式发送阻塞和无法取消的 WITH FILL 查询。
- 修复 S3Queue 并行设置、复制恢复、物化视图创建和存储策略校验问题。
