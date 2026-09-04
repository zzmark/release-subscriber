---
title: Logto 1.40.0 更新总结
description: Logto 1.40.0 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Logto"
  version="1.40.0"
  date="2026-05-29"
  repository-url="https://github.com/logto-io/logto"
  docs-url="https://docs.logto.io/"
  release-url="https://github.com/logto-io/logto/releases/tag/v1.40.0"
/>

## 概览

本版本增强审计、组织管理和大规模租户性能，同时改善隔离网络与自托管部署体验，并加入多款消息连接器。升级需要执行数据库迁移。

## New Feature

- 审计日志支持预设和自定义时间范围。
- 组织成员变更 Webhook 提供增删明细。
- Account API 会话返回 `isCurrent`。
- 新增 MailJunky、SMSBao 与阿里云短信认证连接器。

## Performance

- 新增索引并重写查询，加速大型组织的成员列表与用户角色查询。
- 服务端计数上限避免高容量审计日志拖慢租户。

## Bugfix / Security

- 修复注册条款、Account Center 会话与社交绑定、国际化等问题。
- 自托管环境可禁用泄露密码检查，并从数据库读取管理租户签名密钥。
