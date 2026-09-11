---
title: ClickHouse 25.12 更新总结
description: 文本索引 v3、排序数据跳过、自动并行副本、投影级设置，以及 Iceberg 排序和 Delta Lake 变更数据读取。
---

<ReleaseCard
  software="ClickHouse"
  version="25.12"
  date="2025-12-18"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2025"
  accent="#5865A8"
  presentation-url="https://presentations.clickhouse.com/2025-release-25.12/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 25.12 推出针对对象存储优化的文本索引 v3，并以动态阈值数据跳过、更广的索引条件支持和 JOIN 优化减少查询工作量。投影级设置、字典反向查找、S3/Azure Queue 文件移动与标签操作拓展了数据处理能力，Iceberg 排序和 Delta Lake CDF 进一步完善数据湖功能。升级时重点检查旧统计信息、复制元数据、可空列转换和 JSON 新序列化格式的降级边界。

## Breaking Change

- 将可空列 ALTER 为非可空类型时，必须显式提供 DEFAULT，用其替换 NULL。CHECK TABLE 默认返回逐数据片段详细结果；客户端因 `receive_timeout` 超时时返回非零退出码 159。
- 统计信息序列化格式变化可能使旧统计信息无法读取；上游要求运行 `ALTER TABLE table MATERIALIZE STATISTICS ALL` 重新生成，以避免异常。
- 显示和存储的结构不再包含隐式索引。混合版本的 ReplicatedMergeTree 集群可能出现元数据错误，在全量升级完成前应将 DDL 发往旧版副本。
- JSON 默认启用高级共享数据，新数据片段无法由 25.8 之前版本读取。为安全升级，可将 `compatibility` 设为先前版本，或配置 `dynamic_serialization_version='v2', object_serialization_version='v2'`。
- 禁止以空 ORDER BY 创建 ReplacingMergeTree、CollapsingMergeTree 等特殊引擎表，除非启用 `allow_suspicious_primary_key`。投影位置参数默认禁用，可通过 `enable_positional_arguments_for_projections` 协助集群升级。
- 移除允许不可比较类型参与排序或比较的设置；Ngram 分词不再返回短于 N 的片段，空搜索词元不匹配任何行；位移量恰等于类型位宽时返回零或空值。

## New Feature

- 文本索引 v3 进入 Beta，采用面向对象存储优化的格式。官方演示承诺该格式向后兼容，并介绍后续正式可用计划。
- 投影可通过 WITH SETTINGS 单独覆盖索引粒度等存储参数；`alter_column_secondary_index_mode` 控制修改索引列时抛错、删除或重建索引的行为。
- 新增 `dictGetKeys` 字典反向查找及查询级缓存、HMAC、Geometry 面积和周长函数；IN 支持非常量第二参数，元组可使用负索引。
- S3/Azure Queue 可移动或标记已处理文件；`commit_on_select` 默认关闭，用于控制 SELECT 是否提交进度及执行处理后动作。Buffers 格式提供不含列名、类型和额外元数据的输入输出。
- Iceberg 支持建表 ORDER BY 和插入排序；Delta Lake 可通过版本范围读取 CDF，并返回变化类型、提交版本及时间戳。Time/Time64 已可用于生产环境并默认启用。
- 新增基于 XRay 的生产构建运行时插桩、跟踪和确定性性能分析。行级安全的数据脱敏仅在 ClickHouse Cloud 提供。

## Performance

- ORDER BY/LIMIT 使用动态阈值和数据跳过索引减少读取行数，较大 LIMIT 也可受益于延迟物化；所有数据跳过索引支持混合 AND/OR 条件，大型 MinMax 索引分析延迟降低。
- 自动并行副本根据单节点执行统计判断是否值得分布式运行，由 `automatic_parallel_replicas_mode` 控制；此功能仍属实验性，当前支持的查询范围有限。
- 新增实验性 DPsize JOIN 重排算法，默认 JOIN 重排上限提高至 10，并启用列统计信息优化。ANTI JOIN 支持运行时过滤器，LEFT/INNER JOIN 可保留左表读取顺序。
- 文本索引可在 PREWHERE 中使用，并为 LIKE、equals、has 等条件提供预过滤；改进原地过滤、哈希表预取、SIMD 逻辑运算、T64 解压和数值排序。
- S3 `_path` 过滤下推可避免对象列举；Apache Paimon 支持分区裁剪。更窄的合并有助于避免 TOO_MANY_PARTS，但会增加写放大。

## Bugfix / Security

- 修复恶意构造嵌套 QBit 字节流导致服务器崩溃的问题，并加强聚合状态反序列化大小检查；身份验证前的 HTTP 错误不再暴露服务器版本。
- 修复 localhost remote 表函数的 ALTER UPDATE 访问检查、命名集合秘密显示、通配符授权撤销及全局权限交互。Keeper 拒绝重连到落后状态的客户端，避免过时读取。
- 修复 JSON 共享数据与动态路径重复、Compact 子列读取、Tuple 稀疏/可空子流序列化以及 Hive 并发读取等可能造成错误结果、数据损坏或崩溃的问题，并提供 JSON 重复路径修复机制。
- 修复并行副本 RIGHT JOIN 重复数据、QBit 距离计算、查询条件缓存错误使用、Time/Time64 时区转换和多项 JOIN/投影问题。因内存泄漏而禁用 `enable_shared_storage_snapshot_in_query`。
- 修复 Kafka 死信队列未配置时的崩溃、Buffer 过度刷新、备份、对象存储、服务器关闭和复制发现等可靠性问题。
