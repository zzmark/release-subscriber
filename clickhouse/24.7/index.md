---
title: ClickHouse 24.7 更新总结
description: ClickHouse 24.7 的中文更新总结、原始 Changelog、简体中文翻译与 Release 演示。
---

<ReleaseCard
  software="ClickHouse"
  version="24.7"
  date="2024-07-30"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2024"
  accent="#168AAD"
  presentation-url="https://presentations.clickhouse.com/2024-release-24.7/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 24.7 改进物化视图链路去重，扩展 ASOF JOIN 算法，并新增 AzureQueue、启动脚本与 Keeper 磁盘存储。并行哈希连接、按顺序读取和整数转字符串得到加速。升级时应检查元组自动命名、物化视图去重和轻量删除投影行为，以及 Keeper 客户端路径语法变化。

## Breaking Change

- Replicated 数据库禁止创建同时使用 Replicated*MergeTree 引擎和 POPULATE 的物化视图。
- Keeper 客户端路径必须使用字符串字面量；修正 KeeperOutstandingRequests 指标拼写，移除 system.functions 的 is_deterministic 字段。
- tuple 默认尝试构造命名元组，可通过 `enable_named_columns_in_function_tuple` 控制。
- 调整物化视图去重逻辑，修复并行块、不同输入产生相同聚合结果及不同视图来源的数据被误去重的情况。
- 位移函数对越界位置返回错误。

## New Feature

- ASOF JOIN 支持完全排序合并连接算法；AzureQueue 支持持续消费 Azure 文件，DeltaLake 支持读取分区表。
- 启动脚本可在服务器接受连接前执行 SQL；Keeper 新增实验性磁盘存储后端，以性能代价换取更低内存需求。
- 新增日期时间分量修改函数、groupConcat、错误历史日志和已分离表系统表。
- 轻量删除包含投影的表时，可选择拒绝操作或删除投影；客户端扩展 JWT（仅 ClickHouse Cloud）、X.509 身份识别和非交互内存统计能力。
- 实验性 Variant/Dynamic 扩展序列化、JSON 提取和子列支持。

## Performance

- parallel_hash JOIN 缓存哈希表大小以提前分配，减少重复查询的扩容开销；ASOF 合并连接减少内存使用。
- 高选择性过滤下按主键顺序读取可通过缓冲加速，整数转字符串快约 10–20%。
- 简单正则替换、只读表附加、元数据加载和主索引内存管理得到优化。
- PostgreSQL 支持 LIMIT 下推和取消查询，ZooKeeper/Keeper 改进可用区感知负载均衡。

## Bugfix / Security

- 修复字典访问权限校验、用户有效期重置、Azure 日志密钥遮蔽及用户专属 S3 增量备份认证。
- 修复 FINAL 与按序读取组合的错误结果、窗口函数稀疏列处理、物化视图及多种分析器问题。
- 修复 unbin/unhex 缓冲区溢出、EmbeddedRocksDB TTL 损坏 SST、ZooKeeper 会话卡住和 S3Queue 内存增长。
- 修复 MySQL TLS 连接、gRPC 关闭、cgroup CPU 检测、内存跟踪及非确定性谓词计数问题。
