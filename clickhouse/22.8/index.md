---
title: ClickHouse 22.8 更新总结
description: ClickHouse 22.8 LTS 的中文更新总结、原始 Changelog、简体中文翻译与 Release 演示。
---

<ReleaseCard
  software="ClickHouse"
  version="22.8"
  date="2022-08-18"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2022"
  accent="#168AAD"
  release-label="LTS"
  presentation-url="https://presentations.clickhouse.com/2022-release-22.8/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 22.8 是长期支持版本，新增 MergeTree 轻量删除、交互模式查询参数、JSON 服务器日志及更灵活的结构推断控制。此版本扩大日期范围、提供自解压二进制文件，并优化有序 DISTINCT、并发线程控制和缓存策略。升级前应核查 x86 CPU 的 AVX 支持、远程文件系统缓存配置以及日期边界行为。

## Breaking Change

- `Date32` 和 `DateTime64` 的支持范围扩大为 1900–2299 年；越界截断行为及部分 `toStartOfInterval` 季度取整结果随之变化。
- 预构建 x86 二进制文件要求 AVX，CPU 需为 Intel Sandy Bridge / AMD Bulldozer 或更新型号。
- 远程文件系统缓存改为可组合结构，需更新配置才能继续启用；旧缓存数据仍可使用，旧配置不会阻止服务器启动。
- ClickHouse、MongoDB、MySQL、PostgreSQL 等通过 DDL 配置的字典数据源开始遵循 `remote_url_allow_hosts`。

## New Feature

- MergeTree 家族新增标准 `DELETE FROM` 语法和轻量删除实现。
- 交互模式支持 `SET param_abc = 'def'`，查询参数与配额键可通过 Native 协议传递。
- 新增 LIMIT 前精确行数统计、s3Cluster 并行分布式插入、文本格式日期/整数推断控制及 JSON 日志输出。
- 新增 `nowInBlock`、`SELECT ... INTO OUTFILE ... AND STDOUT`、多个 Pretty 格式，以及 Ordinary 到 Atomic 的自动迁移机制。
- 二进制文件改为自解压形式；演示显示包大小从 2.1 GB 降至 446 MB，首次运行约需 5 秒解压，并介绍可读写测试旧版本的 ClickFiddle。

## Performance

- 有序 DISTINCT 避免重复排序，修复哈希集合未及时清理的问题，显著降低内存使用。
- 新增并发线程总数软限制，改善高 QPS 场景；未压缩缓存与标记缓存支持 SLRU。
- 新增利用 Intel IAA 的 DeflateQpl 压缩编解码器，可在硬件不可用时回退到软件实现。
- 优化数值列筛选、索引分析、复杂查询、Base58 和聚合结果合并；兼容的 AggregateFunction 状态可在物化视图中互换使用。

## Bugfix / Security

- 修复 CapnProto 段错误、Avro 数据竞争及堆缓冲区溢出、加密函数参数检查不足和 S3 写入潜在死锁。
- 修复投影排序、元组 IN 索引分析、ASOF JOIN、指数衰减窗口函数、Decimal 除法及分布式数据库解析等错误结果。
- 修复长时间 INSERT/合并造成临时数据片段目录丢失，以及失败获取后复制队列卡住的问题。
- 修复加密磁盘定位、直接 I/O 异步读取、NFS root-squash 目录创建和 Linux 5.9/5.10 读取异常，并增加 NATS TLS 支持与凭据转义修复。
