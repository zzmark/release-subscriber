---
title: ClickHouse 24.9 更新总结
description: ClickHouse 24.9 的中文更新总结、原始 Changelog、简体中文翻译与 Release 演示。
---

<ReleaseCard
  software="ClickHouse"
  version="24.9"
  date="2024-09-26"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2024"
  accent="#C96A24"
  presentation-url="https://presentations.clickhouse.com/2024-release-24.9/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 24.9 支持单用户多种身份验证方法、Azure 与本地 Iceberg、分区内轻量删除，以及可刷新物化视图的 APPEND 模式。Hive 风格分区可自动裁剪文件，JOIN 与数组/Map 构造继续提速。升级时应检查 Replicated 数据库显式标识参数限制、命名元组下标解析，以及混合版本部署中的用户认证兼容性。

## Breaking Change

- 命名元组下标按元素名称解析，支持 `a[b].c` 与任意表达式的 `.name`；极少数依赖列或别名间接指定元素名称的查询可能改变行为。
- `print_pretty_type_names` 的美化输出扩展到 Tuple、SHOW CREATE TABLE、formatQuery 和客户端交互模式。
- Replicated 数据库禁止显式指定表 UUID，以及复制表的 Keeper 路径和副本名；相关允许设置也有调整。

## New Feature

- 单用户可配置多种认证方法，便于凭据切换；与 24.8 混用期间建议限制每用户只有一种方法。命名集合支持加密存储。
- Iceberg 支持 Azure Blob Storage 和本地文件系统；轻量 DELETE 可限定分区，支持从其他表附加所有分区。
- 可刷新物化视图新增 APPEND、重试和 SYSTEM WAIT VIEW，允许按计划累积查询结果。
- 新增 overlay/overlayUTF8、arrayZipUnaligned、响应头虚拟列、投影系统表，以及按标签清理查询缓存。
- 文本结构推断可选择 Variant；新增内省 Dynamic 类型和 JSON 路径/类型的聚合函数。

## Performance

- Hive 风格分区仅读取必要文件，右表键密集时优化哈希 JOIN，ALL JOIN 延迟追加行列表。
- 优化 array/map 构造、ORC 字符串与字典编码、分组 uniq 并行合并，以及向量索引并行插入。
- 异步加载文件系统缓存元数据以加快重启，降低合并调度与 JSON 写入缓冲区的内存开销。
- 改善并行副本标记分配，将数据片段去重复杂度由平方级降至 O(n log n)。

## Bugfix / Security

- 改善 X.509 身份识别、Keeper 内部 SSL、GCS 敏感信息遮蔽和容器密码 XML 转义。
- 禁止可能产生截断结果的溢出模式使用查询缓存，并修复 JSON/Dynamic 聚合、窗口函数、JOIN 和分区索引错误结果。
- 修复异步插入元数据变化、备份恢复、复制数据库与角色缓存问题，以及多种并发竞态和内存异常。
- 修复 Parquet 类型不匹配崩溃、LDAP 角色操作崩溃、向量索引余弦距离未生效与旧数据片段读取回归。
