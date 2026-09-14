---
title: Vaultwarden 1.37.3 更新总结
description: Vaultwarden 1.37.3 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Vaultwarden"
  version="1.37.3"
  date="2026-09-13"
  repository-url="https://github.com/dani-garcia/vaultwarden"
  docs-url="https://github.com/dani-garcia/vaultwarden/wiki"
  release-url="https://github.com/dani-garcia/vaultwarden/releases/tag/1.37.3"
/>

## 概览

Vaultwarden 1.37.3 是一次围绕身份验证安全、客户端兼容性和数据库迁移可靠性的维护版本。它修复了新版 web-vault 的密码修改、iOS 注册令牌响应、组织导入及 MariaDB 12.2.2 迁移问题，并增强双重验证令牌失效和登录端点限流机制。

本版本还新增 SSO 注册控制与管理员重置双重验证能力，补充多客户端密码管理功能标志，同时统一服务客户端的 HTTP 配置并更新 Rust 构建环境。

## New Feature

- 新增 `SSO_SIGNUPS_ALLOWED` 配置项，用于控制是否允许通过 SSO 注册。
- 支持管理员重置用户的双重验证设置。
- 新增 `pm-32413-multi-client-password-management` 功能标志。

## Performance

- 在适用路径中改用 `insert_into`，优化数据库写入实现。

## Bugfix / Security

- 凭据或双重验证设置发生变化时撤销已有的双重验证记忆令牌。
- 对预登录和身份验证请求端点实施速率限制，并在双重验证邮件登录失败时记录 IP 地址和用户名。
- 修复新版 web-vault 的密码修改、iOS 注册令牌响应以及 `archiveDate` 更新问题。
- 修复 MariaDB 12.2.2 数据库迁移和缺少 `groups` 字段时的组织导入失败。
- 邮件功能关闭时，不再执行密码重置流程中的自动注册。
