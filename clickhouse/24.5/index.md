---
title: ClickHouse 24.5 更新总结
description: ClickHouse 24.5 的中文更新总结、原始 Changelog、简体中文翻译与 Release 演示。
---

<ReleaseCard
  software="ClickHouse"
  version="24.5"
  date="2024-05-30"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2024"
  accent="#5B8C3A"
  presentation-url="https://presentations.clickhouse.com/2024-release-24.5/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 24.5 引入实验性 Dynamic 类型，扩展非等值 JOIN、CROSS JOIN 压缩与落盘处理，并支持直接读取 S3 归档及生成 UUIDv7。Azure 对象存储与备份能力进一步完善。升级前需删除实验性倒排索引并在升级后以全文索引重建，同时替换已废弃、易出错的旧窗口相关函数；本版还默认关闭存在已知缺陷的纵向 FINAL。

## Breaking Change

- 实验性“倒排索引”更名为“全文索引”，内部元数据不兼容；升级前删除旧索引，升级后重建。
- 废弃 `neighbor`、`runningAccumulate`、`runningDifferenceStartingWithFirstValue`、`runningDifference`，应改用窗口函数；可通过兼容设置暂时恢复。
- `system.columns` 不再展示未获授对应表 SHOW TABLES 权限的列，即使单独拥有 SHOW COLUMNS 权限。

## New Feature

- 新增实验性 Dynamic 类型，可存储事先无法枚举类型的值，并支持子列读取与格式推断。
- CROSS JOIN 支持内存压缩和临时文件处理；实验性 JOIN 条件可使用涉及两侧表列的不等式。
- Map 键支持浮点数、数组、Map 和 Tuple；新增 clamp、NPy 输出、Form 表单格式及 UUIDv7 生成和转换函数。
- 可直接读取 S3 上 tar、zip、7z 等归档中的文件；Azure 支持工作负载标识及 plain_rewritable 元数据。
- EmbeddedRocksDB 支持 SST 批量导入；命令行可直接接受查询位置参数，并根据 stdout 文件扩展名自动压缩。

## Performance

- ASCII 输入的 UTF8 字符串函数采用快捷路径，优化 set 索引分析、S3 glob 匹配及 DateTime/DateTime64 比较的索引使用。
- 减少文件系统缓存竞争和写入复制，改进多列合并排序与 S3 地址选择。
- Azure 备份支持服务端原生复制与跨容器复制；减少投影插入合并开销，优化分析器与 clickhouse-local 启动。

## Bugfix / Security

- 默认关闭有已知缺陷的 `enable_vertical_final`，修复非自适应粒度表 FINAL 错误结果与数据片段相交问题。
- 修复 SQL 安全检查、查询缓存跨数据库隔离、二进制输入反序列化和 AWS Lambda 异常处理。
- 修复分析器、递归 CTE、JOIN 条件下推、窗口函数及物化视图相关错误与崩溃。
- 修复 Azure 列表循环、备份恢复、并行读取死锁、性能分析器信号处理和 OpenSSL/Sentry 退出顺序问题。
