---
title: ClickHouse 26.4 更新总结
description: ClickHouse 26.4 的中文更新总结、原始 Changelog、简体中文翻译与 Release 演示。
---

<ReleaseCard
  software="ClickHouse"
  version="26.4"
  date="2026-04-30"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2026"
  accent="#5B8C3A"
  presentation-url="https://presentations.clickhouse.com/2026-release-26.4/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 26.4 是春季月度版本，带来 39 项新功能、45 项性能优化和 238 项缺陷修复。重点包括 JOIN 达到内存阈值后自动切换为 grace hash join 并溢写到磁盘、Arrow Flight SQL、JSON 列跳数索引与 `JSONAllValues`、默认列统计信息、文本索引正式可用，以及一组实验性 AI 函数。升级前应重点检查 `Bool` 的 `IN` 精确匹配、H3 v4 计算结果、复合类型中的 Decimal 转换、Merge 表虚拟列行为，以及收紧后的 HTTP 请求头默认限制。

## Breaking Change

- `Bool` 类型的 `IN` 运算改为精确值语义，集合中只有 `0` 和 `1` 能匹配布尔值；此前会被错误钳制为 true 的大整数不再匹配。
- H3 库升级到 v4，长度、面积等指标计算精度提高，但结果会与旧版本不同。
- `WITH` 表达式列表不再允许将 `SELECT` 作为无引号标识符。
- Merge 表读取 `_table`、`_database` 虚拟列的方式发生变化：底层表存在同名列时直接从存储读取，否则在读取后补充。
- `IN` 对 `Tuple`、`Array`、`Map` 等复合类型内部的 Decimal 转换同样拒绝有损精度转换，与顶层标量比较保持一致。
- HTTP 连接的默认 `http_max_fields` 从 1,000,000 降至 1,000，`http_max_field_name_size` 从 128 KB 降至 4 KB，并新增请求头总大小与读取超时设置；依赖旧上限的部署需要显式恢复配置。

## New Feature

- Hash Join 与 Parallel Hash Join 达到 `max_bytes_before_external_join` 阈值后，可自动转换为 grace hash join 并将数据溢写到磁盘。
- 新增 Arrow Flight SQL 支持，通过 Apache Arrow 的列式 gRPC 协议提供高吞吐查询接口。
- Paimon 表引擎支持增量读取，以 Keeper 跟踪快照进度，并可通过 `paimon_target_snapshot_id` 定向读取快照增量。
- 新增 `arrayAutocorrelation`、`arrayTranspose`、`obfuscateQuery`、`highlight`、`JSONAllValues` 等函数；`stem` 函数脱离实验性阶段。
- 字典属性支持 Map 与 JSON/Object 等复杂类型；JSON 列可基于 `JSONAllPaths` 使用 Bloom Filter、token、ngram 和文本跳数索引。
- 新增按规范化查询哈希实施配额、`NATURAL JOIN`、标准 `VALUES` 表表达式、复合 `INTERVAL` 字面量，以及多项 PostgreSQL 兼容语法。
- 实验性新增 `aiGenerate`、`aiClassify`、`aiExtract`、`aiTranslate`，可在 SQL 中调用 OpenAI 或 Anthropic 端点。
- Iceberg 支持 `ALTER TABLE ... EXECUTE remove_orphan_files`，可识别并删除对象存储中未被快照引用的文件。

## Performance

- SELECT 可依据 min/max 统计信息直接裁剪整个数据部件；新表默认自动创建 `minmax`、`uniq` 统计信息，并在后台合并时物化以降低插入开销。
- LIKE 查询和短语搜索可利用文本索引；文本索引现已正式可用，不再受兼容性设置意外关闭。
- 优化 Hash Join、Concurrent Hash Join、低基数整数键连接、Top-K 动态过滤、分布式索引分析以及正则表达式公共前缀的主键裁剪。
- AArch64 上的向量化数学函数获得 NEON/SVE 加速，Float 与 String 转换热点路径提速约 1.5–3 倍。
- `uniqExact` 改用批量并行合并，显著改善多核机器上的高基数 `COUNT(DISTINCT)`。

## Bugfix / Security

- 收紧 HTTP 请求头字段数、字段名大小和读取超时默认值，以限制认证前 HTTP 连接的内存消耗。
- JDBC、ODBC、NATS 连接字符串中的凭据现在会在查询日志和 `SHOW CREATE` 输出中脱敏。
- 修复 `system.asynchronous_inserts` 可能向有表查询权限的其他用户泄露待处理异步插入信息的问题。
- 修复并发删表读取时的堆释放后使用、Keeper 请求卡死、NuRaft 竞态段错误、文件系统缓存动态调整竞态，以及多项可能导致崩溃或错误结果的问题。
- 修复 Iceberg、Delta Lake、Unity Catalog、GCS 与 S3 集成中的路径、裁剪、认证头和对象请求问题。
- 修复 JOIN、投影、Dynamic/Variant 列、异步插入、分区裁剪、备份恢复和多种输入格式中的异常、数据损坏风险与错误结果。
