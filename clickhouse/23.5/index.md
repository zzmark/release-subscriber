---
title: ClickHouse 23.5 更新总结
description: ClickHouse 23.5 的中文更新总结、原始 Changelog、简体中文翻译与 Release 演示。
---

<ReleaseCard
  software="ClickHouse"
  version="23.5"
  date="2023-06-08"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2023#235"
  accent="#5B8C3A"
  presentation-url="https://presentations.clickhouse.com/2023-release-23.5/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 23.5 将查询缓存、投影及地理数据类型推进到生产可用阶段，新增 Azure Blob Storage 集成、Keeper 命令行客户端和 urlCluster 表函数。版本虽然在 6 月 8 日发布，仍属于五月版本。默认压缩磁盘标记和主键、文件读取并行化以及后台内存控制是本次升级重点；跨旧版本升级时，应特别核查压缩格式兼容性和内存聚合设置。

## Breaking Change

- 默认压缩标记与主键；启用后无法降级到 22.8 或更早版本。从 22.9 之前升级时，应同步升级全部副本、提前禁用压缩，或经由 23.3 等中间版本升级。
- 默认允许文件读取重排行序以提高并行性能，需要原有顺序时设置 `parallelize_output_from_storages = 0`、`input_format_parquet_preserve_order = 1`。
- 默认启用 `enable_memory_bound_merging_of_aggregation_results`；从 22.12 之前升级时，建议升级完成前暂设为 `false`。
- 本地对象存储缓存与旧版本不兼容；移除内存数据片段实验性功能，相关设置不再生效；投影优化改用新的正式设置。

## New Feature

- AzureBlobStorage 表引擎和表函数、`urlCluster`、`clickhouse keeper-client` 正式加入；更多外部表引擎支持结构推断。
- 查询缓存、投影和地理数据类型达到生产可用状态；查询缓存支持 totals 与 extremes。
- 新增 bcrypt 认证、默认密码类型配置、用户与 Keeper 连接系统表，以及配置文件中的用户授权和角色定义。
- 支持不带 ELSE 的 CASE、OUTFILE APPEND、从临时表挂载分区、数组点积，以及按排序前缀执行 WITH FILL。

## Performance

- 默认压缩磁盘标记与主键以缩短冷查询时间；改善本地 Parquet 并行读取、文件并行处理和远程读取任务窃取。
- 优化哈希字典、RIGHT/FULL JOIN、聚合 JIT 和 Keeper 请求；SPARSE_HASHED 在所述场景中内存占用降至原来的约 1/2.6，速度约为原来的 2 倍。
- 新增后台合并与变更操作的软内存限制、内存跟踪指标及更细的纵向合并条件，数据片段加载和清理改用服务器共享线程池。
- 改善并行副本 JOIN 支持、故障回退和不可用节点处理，并限制 S3 单文件并发上传分段。

## Bugfix / Security

- 加密磁盘备份直接保留密文，恢复时要求兼容的加密密钥；支持 S3 KMS 服务端加密，并控制 SHOW/SELECT 中机密信息的可见权限。
- 修复可空主键、DISTINCT、投影、NaN 比较、JIT 聚合、参数化视图和多种格式解析的正确性问题。
- 修复 Keeper 并发快照与死锁、零复制锁、Distributed 异步插入恢复、备份校验和和多处崩溃。
