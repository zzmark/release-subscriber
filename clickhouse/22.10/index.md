---
title: ClickHouse 22.10 更新总结
description: ClickHouse 22.10 的中文更新总结、原始 Changelog、简体中文翻译与 Release 演示。
---

<ReleaseCard
  software="ClickHouse"
  version="22.10"
  date="2022-10-25"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2022"
  accent="#C96A24"
  presentation-url="https://presentations.clickhouse.com/2022-release-22.10/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 22.10 引入可组合协议配置、S3 备份及 Keeper 快照上传、异步插入日志和多种统计分布随机数函数。此版本改善合并控制、Keeper 重连、锁竞争和远程存储性能，并引入实验性查询分析器。升级时需检查重命名的缓存命令、已移除的 LIVE VIEW 超时语法，以及 AArch64 二进制文件的新指令集要求。

## Breaking Change

- `show caches`、`describe cache` 分别改名为 `show filesystem caches`、`describe filesystem cache`。
- 移除 LIVE VIEW 的 `WITH TIMEOUT` 支持，以及客户端提示符中的 `{database}` 宏。
- AArch64 预构建二进制文件至少要求 ARMv8.2；旧 ARMv8.0 硬件可通过 `NO_ARMV81_OR_HIGHER` 构建选项自行编译。

## New Feature

- 可为不同协议设置独立监听主机，并将 PROXYv1 等包装层组合到 TCP、TLS、MySQL、Postgres 等协议上。
- 支持备份到 S3；表已位于 S3 时可使用服务器端复制。Keeper 可将压缩快照上传到 S3，供下载恢复。
- 新增多种分布的随机数生成函数、方差分析聚合 `anova`、BLAKE3、Morton 编码及 `tryDecrypt`。
- 新增 `asynchronous_insert_log`、用户/查询级磁盘临时数据限制、`SET ... = DEFAULT` 和交互式模糊历史搜索。
- 实验性查询分析与规划基础设施由 `allow_experimental_analyzer` 控制；Kusto Query Language 尚为初始实现。
- 演示介绍处于 Alpha 阶段的 Kafka Connect Sink，以及 ClickHouse Cloud Beta。

## Performance

- 当平均数据片段至少为 10 GiB 时放宽片段数量阈值；`min_age_to_force_merge_seconds` 可推动旧片段合并。
- 优化线程组互斥锁竞争，官方 SSB 实验中各子测试 QPS 几何平均值提升至 2.95 倍。
- 有序 DISTINCT 更充分利用输入排序属性；优化 UInt8 索引、空字符串比较和聚合状态共享。
- 加快 Azure Blob 写入，允许大范围读取绕过本地缓存，并提高 Keeper 连接恢复速度。

## Bugfix / Security

- 修复 Decimal 缓冲区溢出、日期与大整数运算引用未初始化内存，以及查询完成/取消时的数据竞争。
- 无密码用户可要求显式声明；连接无效证书的安全服务器时需显式接受证书。
- 修复旧版创建的 ReplicatedMergeTree 表在 22.9 启动失败、损坏数据片段分离阻止复制、紧凑片段压缩标记及备份大文件复用问题。
- 修复日期时间边界、投影、UInt128 分位数、排序与聚合优化中的错误结果，以及 Distributed 附加筛选条件未生效的问题。
