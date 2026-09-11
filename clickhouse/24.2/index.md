---
title: ClickHouse 24.2 更新总结
description: ClickHouse 24.2 的中文更新总结、原始 Changelog、简体中文翻译与 Release 演示。
---

<ReleaseCard
  software="ClickHouse"
  version="24.2"
  date="2024-02-29"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2024"
  accent="#5865A8"
  presentation-url="https://presentations.clickhouse.com/2024-release-24.2/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 24.2 新增视图的 SQL SECURITY 与 DEFINER 控制、文件格式自动检测、自适应异步插入及 Azure Blob Storage 备份恢复。主键和 Keeper 内存占用、向量距离计算、Buffer 表并行刷新得到优化。升级时重点检查物化视图的底层表写入权限，以及混合版本集群对 ALTER 新括号语法的兼容性。

## Breaking Change

- 物化视图插入现在检查所有底层表权限；原先依赖权限校验缺口的查询可能报 `Not enough privileges`，可根据需求使用新的 SQL SECURITY 功能封装授权。
- 校验嵌套类型中的可疑或实验性类型，以及线程数和数据块大小的合理性。
- 默认不再将指数表示法推断为浮点数，可通过 `input_format_try_infer_exponent_floats` 恢复此前行为。
- ALTER 操作默认在格式化时加括号；旧版本不能读取新语法，混合版本集群需特别注意。

## New Feature

- 视图与物化视图可指定定义者及 SQL 安全上下文，控制查询使用调用者还是定义者的权限。
- 文件与对象存储引擎可自动检测文件格式，异步插入可按负载自动调整等待时间。
- 支持备份到 Azure Blob Storage、将 MergeTree 表自动转换为复制引擎，以及通过 `mergeTreeIndex` 检查索引和标记文件。
- 新增 `groupArrayIntersect`、Tukey 异常值检测、`variantType`、DNS 缓存系统表和最大连续登录失败次数配额。
- 实验性并行副本扩展 JOIN 和简单子查询支持。

## Performance

- 降低主键内存占用，并默认在首次使用时延迟加载主键；继续压缩 Keeper 数据节点并限制内存日志缓存。
- 向量化距离与点积函数，优化 Map 输入的 `if`、Int8、可空检查及有序数据的 ASOF JOIN。
- Buffer 表各分片可并行后台刷新；恢复时并行读取表元数据，存在变更操作时的 SELECT 性能得到提升。

## Bugfix / Security

- 修复物化视图权限校验问题，隐藏 S3Queue 敏感信息，并在解析器配置过大时继续防范栈溢出。
- 修复聚合、Decimal、FixedString、Variant、分布式表和分析器中的错误结果、崩溃与格式化问题。
- 修复 Keeper 摘要、RabbitMQ 消息确认、S3Queue、HTTP 读取、备份及数据竞态问题；正确识别嵌套 cgroup v2 的内存限制。
