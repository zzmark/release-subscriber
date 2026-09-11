---
title: ClickHouse 24.8 更新总结
description: ClickHouse 24.8 LTS 的中文更新总结、原始 Changelog、简体中文翻译与 Release 演示。
---

<ReleaseCard
  software="ClickHouse"
  version="24.8"
  date="2024-08-20"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2024"
  accent="#168AAD"
  release-label="LTS"
  presentation-url="https://presentations.clickhouse.com/2024-release-24.8/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 24.8 是长期支持版本，Analyzer 全面进入生产可用阶段，并引入新的实验性 JSON 类型、TimeSeries 引擎和将偏移量存入 Keeper 的 Kafka 消费模式。版本加强投影合并控制、查询缓存隔离和 Hive 风格分区读取。升级时需检查客户端默认多查询模式、旧 LowCardinality 替代语法以及 Buffer 表的分布式目标限制。

## Breaking Change

- clickhouse-client 和 clickhouse-local 默认使用多查询模式；VALUES INSERT 以分号结束，其他格式以两个换行结束，旧 multiquery 开关不再必要。
- 废弃未公开的 WithDictionary 类型后缀，使用者需 ALTER 为 LowCardinality。
- Buffer 以分布式表为目标时，查询多次引用同一表可能不再支持。
- 基于 Gamma 的随机分布函数拒绝零或负参数，arrayWithConstant 将每个数组限制为 1 GB，REPLACE 修饰符不再允许省略括号。
- 默认启用 text_log；本地日志磁盘占用可能略有增加。

## New Feature

- 新 JSON 类型按路径与类型保存子列；Dynamic 回移改进保留超过类型上限后的原始类型信息，避免强制转为 String。
- 新实验性 TimeSeries 引擎支持 Prometheus 远程读写；Kafka 可将偏移量存入 Keeper，为重试去重与恰好一次消费提供基础。
- 新增投影合并模式 throw/drop/rebuild、查询缓存标签、Hive 风格分区虚拟列，以及更多非等值 JOIN 严格性。
- 支持 S3 ETag、fuzzQuery、删除所有已分离分区、Join 表 OPTIMIZE、受密码保护的增量归档备份。
- Analyzer 从 beta 提升为生产可用，设置更名为 enable_analyzer，保留旧名兼容。

## Performance

- 默认启用函数到子列的优化，只读取复杂类型中必需的数据流。
- 通过批处理小工作单元降低合并调度开销，显著加速非复制表变更，并优化多列 INSERT 内存预分配。
- 加速 DROP DATABASE、系统日志刷新和 ORC 数组写入；plain_rewritable 采用更适合对象存储的扁平元数据布局。
- Join 表可通过 OPTIMIZE 紧凑存放哈希表，降低内存占用。

## Bugfix / Security

- 修复 JSONMergePatch 与深度嵌套 JSON 的栈溢出，以及特制窗口视图函数查询引发的空指针崩溃。
- 修复 OUTER JOIN 转 INNER JOIN、布隆索引、非确定性谓词计数、窗口函数与投影优化中的错误结果。
- 修复 KeeperMap、备份恢复、SQL UDF 重载、参数化视图及并行副本取消死锁。
- 改进容器 CPU/线程限制、内存泄漏及结构推断缓存处理，避免部分日志与连接行为异常。
