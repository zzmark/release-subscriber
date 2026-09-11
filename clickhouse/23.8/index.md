---
title: ClickHouse 23.8 更新总结
description: ClickHouse 23.8 LTS 的中文更新总结、原始 Changelog、简体中文翻译与 Release 演示。
---

<ReleaseCard
  software="ClickHouse"
  version="23.8"
  date="2023-08-31"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2023#238"
  accent="#168AAD"
  release-label="LTS"
  presentation-url="https://presentations.clickhouse.com/2023-release-23.8/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 23.8 是长期支持版本，重点改进文件查询：支持直接读取归档、Parquet 过滤器下推、元数据计数及文件级过滤。版本还扩展 Azure 集群读取、数组与元组函数、内存诊断和仪表盘，并引入尚不适合实际使用的 S3Queue 与 HNSW 实验性能力。升级时需检查动态磁盘命名语法、系统日志列和弃用的元数据缓存。

## Breaking Change

- 动态磁盘名称改为在 `disk(...)` 参数中指定，不再支持 `disk_<name>(...)` 写法。
- clickhouse-benchmark 移除 JSON 输出选项，可改从 system.query_log 提取 JSON 数据。
- 删除 system.text_log 的 microseconds 和 system.metric_log 的 milliseconds 冗余列。
- 弃用实验性元数据缓存并删除对应系统表；TLS 连接不再支持 3DES。

## New Feature

- 支持直接从 zip、7z 和 tar 归档读取文件；新增 One 输入格式用于仅列举文件而不读取内容。
- 新增 azureBlobStorageCluster、TRUNCATE DATABASE、tupleConcat、数组加减与旋转/平移函数。
- Protobuf/CapnProto 可从表结构自动生成结构定义；新增 Kafka 消费者监控、查询缓存使用记录和未释放内存火焰图能力。
- 引入 S3Queue 流式导入与 HNSW 近似近邻搜索的实验性实现；原始说明明确要求暂勿使用。

## Performance

- Parquet 根据 WHERE 条件和列最小/最大值跳过行组，批量读取小行组；文件查询支持元数据计数、行数缓存及读取前的文件/路径过滤。
- 为 ARM 等更多架构启用 JIT，优化 uniq/uniqExact 状态合并、可空字符串聚合及原生 ORC 读取。
- 改善大量文件的 S3 线程管理、备份恢复线程池利用率、Keeper 监听去重及文件系统缓存元数据并行加载。
- 仪表盘请求压缩数据，并支持批量编辑、图表最大化与移动。

## Bugfix / Security

- 修复 SHOW CREATE MySQL 表泄露密码，并支持约束动态磁盘缓存路径和校验 TCP 查询包客户端信息。
- 修复稀疏列、投影、FINAL、UPDATE/DELETE JSON 子列、查询缓存和集合索引的正确性问题。
- 修复 Keeper 重配置竞态、Zstd 输出截断、PostgreSQL 段错误和多处解析崩溃；禁用尚有问题的新 Parquet 编码器。
