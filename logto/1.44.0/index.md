---
title: Logto 1.44.0 更新总结
description: Logto 1.44.0 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Logto"
  version="1.44.0"
  date="2026-09-30"
  repository-url="https://github.com/logto-io/logto"
  docs-url="https://docs.logto.io/"
  release-url="https://github.com/logto-io/logto/releases/tag/v1.44.0"
/>

## 概览

Logto 1.44.0 扩展 MFA、用户迁移、机器人防护和 SAML 身份验证策略，并为动态应用提供获取刷新令牌的兼容性选项。自托管部署需要在启动新版本之前执行数据库结构变更；MFA 受信任设备和动态应用的授权同意兼容性设置均默认关闭。

## Breaking Change

- 自托管升级包含两项数据库结构变更：SAML 应用配置新增身份验证请求配置列，用户 ID 及其引用列扩展为 `varchar(128)`。启动新版本前需执行 `npm run alteration deploy` 或 `logto db alteration deploy`。
- 如果已存储的用户 ID 超过此前的 12 或 21 个字符限制，用户 ID 的数据库结构变更将无法回滚。

## New Feature

- MFA 支持受信任设备，租户可设置 1 至 365 天的信任时长，组织可收紧策略；管理员和用户可以通过控制台、账户中心或 API 管理设备。
- 用户 ID 最长扩展到 128 个字符，自托管 Logto 可在创建用户时保留外部系统 ID；管理 API 支持按外部身份精确查找用户。
- 新增自托管 Cap CAPTCHA 提供方，reCAPTCHA Enterprise 支持配置评分阈值；SAML 应用可配置会话复用及签名请求校验。
- `theme` 参数可使整个登录流程跟随应用主题；动态应用可启用实验性授权同意兼容设置，让 ChatGPT、Codex 等 MCP 客户端获取刷新令牌。
- 管理 API SDK 新增带类型的分页异步迭代器、对象形式配置和小写客户端方法。

## Bugfix / Security

- 修复浏览器自动翻译导致登录页面空白，以及社交注册过程中无法完成账户关联的问题。
- 改进 OIDC SSO 签发方地址的末尾斜杠处理，禁止将 `none` 与其他提示参数组合，并修复 API 错误语言回退和 Webhook 测试结果串用。
- 管理 API SDK 强化令牌请求重定向、超时、取消和缓存失效处理；数据库初始化会检查遗留 PostgreSQL 角色。
- 改进 Apple、钉钉和 Twilio SMS 连接器的配置与信息处理。
