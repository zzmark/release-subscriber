---
title: ClickHouse 23.9 更新总结
description: ClickHouse 23.9 的中文更新总结、原始 Changelog、简体中文翻译与 Release 演示。
---

<ReleaseCard
  software="ClickHouse"
  version="23.9"
  date="2023-09-28"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2023#239"
  accent="#C96A24"
  presentation-url="https://presentations.clickhouse.com/2023-release-23.9/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 23.9 改进嵌套 JSON 的结构推断，新增远程磁盘 IO 调度、SSH 密钥认证、临时用户凭据和 GCD 压缩编解码器。S3 预取、INFILE 并行读取、FINAL 及排序优化提升分析性能；MySQL 协议和 information_schema 扩展改善 Tableau Online、QuickSight 等工具的连接体验。升级时应检查移除的元数据缓存、JSON 数字推断及 base64 解码差异。

## Breaking Change

- 移除实验性数据片段元数据缓存，以及默认 Prometheus 处理器中的字典状态和 status_info 配置。
- 默认不再从 JSON 字符串推断数字，避免将看似数值的字符串误判。
- base64 编解码库替换为 aklomp-base64，未填充的 base64 值可能不再被接受。

## New Feature

- JSON 对象可默认推断为命名元组，数组及未知类型可按设置读为 String，更稳妥地处理嵌套数据。
- 远程磁盘支持按工作负载配置 IO 资源调度与带宽限制；新增 backup_log 跟踪备份恢复全过程。
- 支持原生 TCP 的 SSH 密钥认证、用户凭据到期时间，以及通过 AWS_PROFILE 使用 SSO 临时 S3 凭据。
- 新增 GCD 编解码器、DROP TABLE IF EMPTY、表注释修改、非常量时区、数值日期转换和字符串距离函数。
- HTTP 查询异常仍可输出有效 JSON/XML，JSON 与 JSONEachRow 自动识别更完善。

## Performance

- 默认启用 S3 预取并复用 HTTP 连接，客户端对 INFILE 通配符匹配的文件并行处理。
- FINAL 在不必要时跳过孤立数据片段的主键和版本列；优化常量分组、Decimal 与接近有序数据排序，以及大型查询分析。
- 降低哈希 JOIN 内部缓冲区占用，数组连接遵循 max_block_size，并改进 Keeper 请求批量刷新。
- 支持并行构建 Annoy 索引，JSON 函数复用解析组件并减少序列化开销。

## Bugfix / Security

- 禁止 systemd 强制终止服务器，避免 Buffer 表潜在数据丢失；改进备份 UUID 一致性、损坏片段处理和 S3 重试。
- 修复投影、可空主键、FINAL、JOIN、indexHint、IPv4/IPv6 和 Decimal 序列化等正确性问题。
- 修复 Keeper 关闭段错误、ColumnUnique 竞态、MaterializedPostgreSQL 行数异常及零复制分区操作。
- 查询缓存遇到非确定性函数时明确报错，替代静默不缓存的行为。
