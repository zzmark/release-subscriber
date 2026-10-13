---
title: Logto 1.45.0 更新总结
description: Logto 1.45.0 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Logto"
  version="1.45.0"
  date="2026-10-13"
  repository-url="https://github.com/logto-io/logto"
  docs-url="https://docs.logto.io/"
  release-url="https://github.com/logto-io/logto/releases/tag/v1.45.0"
/>

## 概览

Logto 1.45.0 为自托管部署加入订阅许可证权益（Self-Hosted Pro），解锁控制台团队协作、品牌定制、自定义登录界面和更高的 SAML 应用数量上限。同时优化资源与作用域查询，解决大量 API 资源导致的数据库参数超限和控制台权限选择器超时，并修正文档中的 Next.js 异步组件示例。

## New Feature

- 可在控制台“租户设置 > 许可证”或通过 `PUT /api/systems/license`、`GET /api/systems/license` 安装和管理许可证；密钥通过 ES256 签名和内置公钥离线验证。拥有有效自托管订阅的用户可在 Logto Cloud 控制台账户菜单获取生产和非生产密钥，无需创建 Cloud 租户。
- 许可证提供套餐、环境、到期日期和每周自动刷新状态。许可证过期或无法刷新时，功能在 30 天宽限期内继续运行，控制台显示全局警告；宽限期结束后回退到 OSS 默认配置。
- Self-Hosted Pro 权益包括控制台成员和邮件邀请、移除 Logto 品牌标识、自定义登录界面及 CSP、更高的 SAML 应用数量上限，以及在整个租户中强制要求管理员使用控制台 MFA。邀请通过默认租户的邮件连接器发送安全的一次性账户设置链接。
- `GET /api/resources` 新增 `excludeManagementApis` 查询参数，在数据库层面排除内部管理 API 资源；第三方应用、动态应用、组织角色和用户角色的控制台权限选择器已采用此筛选条件。

## Performance

- `GET /api/resources?includeScopes=true` 使用 `Map.groupBy` 和 PostgreSQL 数组绑定（`= ANY(...)`），使作用域匹配从二次时间复杂度降为线性时间，并解决资源超过 65,535 个时的失败问题。
- 权限选择器不再将所有资源加载到浏览器中，避免资源较多的租户遇到界面超时。

## Bugfix / Security

- Next.js App Router 快速入门的 `app/page.tsx` 示例将 `Home` 声明为 `async` 组件，修复 TypeScript 错误 `TS1308`。
