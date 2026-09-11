---
title: ClickHouse 22.12 更新总结
description: ClickHouse 22.12 的中文更新总结、原始 Changelog、简体中文翻译与 Release 演示。
---

<ReleaseCard
  software="ClickHouse"
  version="22.12"
  date="2022-12-15"
  repository-url="https://github.com/ClickHouse/ClickHouse"
  docs-url="https://clickhouse.com/docs/"
  release-url="https://clickhouse.com/docs/resources/changelogs/oss/2022"
  accent="#5865A8"
  presentation-url="https://presentations.clickhouse.com/2022-release-22.12/"
  presentation-zh-url="./presentation.zh/"
/>

## 概览

ClickHouse 22.12 新增 Grace Hash JOIN、BSON 导入导出、`GROUP BY ALL` 与更多 SQL 便利语法，并加强密码复杂度和凭据脱敏。远程存储查询可通过后台 I/O 池和读取流控制提高并行度，Keeper 新增 Prometheus 端点。升级时需重点关注部分旧版本字符串聚合状态的兼容性修复，以及数据片段删除和恢复行为的改进。

## Breaking Change

- 修复 `min`、`max`、`any*`、`argMin`、`argMax` 的字符串状态序列化兼容性问题。22.9、22.10、22.11 分别自 22.9.6、22.10.4、22.11.2 修复；部分 22.3、22.7、22.8 小版本也受影响，完整范围见 Changelog。
- 新版本能读取受影响版本的数据，但若受影响版本保存的字符串本来以空字符结尾，新版本会去掉尾随空字符。混合版本分布式查询也需检查此问题。
- `filesystemFree` 改名为 `filesystemUnreserved`，文件系统容量函数支持可选磁盘名称参数。

## New Feature

- 新增 `grace_hash` 连接算法，可通过 `join_algorithm = 'grace_hash'` 启用；新增 `BSONEachRow` 输入/输出格式。
- 新增 `GROUP BY ALL`、`FROM table SELECT column` 和带下划线的数字字面量，简化查询书写。
- 新增带分隔符字符串连接、指定精度十进制乘除和哈希函数；SQL UDF 可用作列默认表达式。
- 支持密码复杂度规则、MergeTree 设置约束、`system.moves` 和 Keeper 内嵌 Prometheus 端点。
- 支持异步插入去重、Annoy 余弦距离、JSON 对象解析为字符串，以及更多进度和堆栈性能事件记录。
- 命名集合 DDL 仍在开发，22.12 中尚不生效；查看命名集合受用户和 `show_named_collections` 控制。

## Performance

- 新增 MergeTree 读取流上限和后台 I/O 池；在高延迟存储、少量 CPU、大量数据片段的场景，官方说明最高可达 100 倍提升。
- 远程文件系统读取正确遵循自适应粒度，减少宽行场景的内存使用。
- 降低合并选片时 Keeper/ZooKeeper 列表请求数量；Keeper 支持更积极的批处理和日志同步与复制并行。
- 加快服务器关闭，优化有序聚合计划、ARM xxHash 性能及 DeflateQpl 编解码器。

## Bugfix / Security

- 在日志、异常、SHOW CREATE TABLE 和系统表输出中遮蔽密码与敏感信息。
- 修复异步插入死锁、物化视图删除与插入竞争、分位数未定义行为、压缩边界检查及 S3 分段上传竞争。
- 改进 TRUNCATE/DROP PART/DROP PARTITION 的删除持久性，成功后不会重新出现已删除片段；TRUNCATE 不再阻塞并发读取，原子性仍限于事务范围。
- 修复副本校验和不一致导致变更停滞、复制数据库恢复交换表名、零拷贝投影损坏和集群设置重置只作用于单副本的问题。
- 修复 DISTINCT/LIMIT、Join 键顺序、嵌套 JSON、Decimal、日期时间和子查询 HAVING 等错误结果或异常。
