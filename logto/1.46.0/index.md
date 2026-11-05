---
title: Logto 1.46.0 更新总结
description: Logto 1.46.0 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Logto"
  version="1.46.0"
  date="2026-11-05"
  repository-url="https://github.com/logto-io/logto"
  docs-url="https://docs.logto.io/"
  release-url="https://github.com/logto-io/logto/releases/tag/v1.46.0"
/>

## 概览

Logto 1.46.0 为身份与访问管理新增 OIDC 进阶身份验证、Ethereum 钱包登录、账户中心个人访问令牌、极验验证码及 SAML 静态属性。它同时加固 MFA、社交登录、企业 SSO、账户 API 和 Logto Tunnel，并修复旧版 Safari 空白登录页、带空格作用域的令牌刷新及社交连接器兼容性问题。

**升级需要操作**：启动新版前必须执行数据库迁移；检查标准 OAuth 2.0 和 Microsoft Azure AD 社交连接器的邮箱同步设置。SAML 断言受众精确匹配及第三方账户 API 限制可能影响现有集成，应按下列要求核对。

## Breaking Change

- **数据库与 Node.js**：升级后、启动新版前，在 `@logto/cli`／core 镜像中执行 `npm run alteration deploy`，或执行 `logto db alteration deploy`。官方 Docker 镜像改用 Node.js 26；支持 Node.js 22、24、26，最低版本分别为 **22.23.4、24.22.1、26.12.1**，包含 2026 年 10 月安全修复。参见[升级指南](https://docs.logto.io/logto-oss/upgrading-oss-version)。
- **邮箱同步需管理员检查**：标准 OAuth 2.0 连接器新增 `disableEmailSync`，与 Azure AD 已有开关一致。升级不会改变现有行为，开关默认关闭；若服务提供商不验证用户对返回邮箱的所有权，应开启“禁用邮箱同步”。邮箱仍保留在 `rawData`，不能仅靠升级认为风险已消除。
- **SAML 受众**：断言中的某个 `Audience` 必须与连接器在接收响应的域名或租户默认域名上的 **Audience URI（SP Entity ID）**完全匹配。升级后若报受众不匹配，应在身份提供商侧修正配置。
- **账户 API 仅限第一方**：获取或刷新已存储的社交／企业 SSO 服务提供商令牌，以及读取备用码、会话、授权记录和可信设备，现在要求第一方应用。第三方应用收到 `403 auth.third_party_application_forbidden`；现有取令牌集成需改用第一方应用获取访问令牌。账户中心、控制台等第一方应用不受影响。
- **请求校验与错误响应**：`customClientMetadata` 未知键现在返回 `400 guard.invalid_input`，不再静默接受；社交服务提供商传输失败返回 `502 connector.social_provider_unreachable`，拒绝授权返回 `401 connector.authorization_failed`。直接登录失败及取消内置授权同意页以 `access_denied` 返回客户端，保留 `state`、`iss`，集成应核对错误处理。

## New Feature

- **OIDC 进阶身份验证**：授权请求支持 `acr_values`、`max_age`，发现文档声明 ACR，ID／访问令牌和内省响应返回 `acr`、`amr`、`auth_time`。账户中心使用新近签发的第一方 `urn:logto:acr:1fa` 令牌执行敏感操作；验证不够近期时返回 RFC 9470 质询。近期验证窗口默认 10 分钟，可配置，客户端可用 `max_age` 缩短；直接调用账户 API 仍可用验证记录 ID。
- **钱包与验证码**：新增 `@logto/connector-siwe`，注入式 EIP-1193 钱包可签署一次性 SIWE（EIP-4361）消息登录；同一地址用于受支持的 EVM 链，允许限制链 ID。新增 GeeTest CAPTCHA v4，登录页 CSP 随配置放行其 SDK、API 和静态资源主机。
- **iOS 密码保存**：第一方应用可传入 `confirm_redirect_policy=password`，在密码登录、注册、设置密码或进阶密码验证后显示“继续”页，避免 `ASWebAuthenticationSession` 立即关闭而带走“存储密码”提示。第三方应用忽略此参数；未传入时仍立即重定向。
- **账户中心与用户管理**：启用个人访问令牌字段后，用户可创建、重命名和撤销令牌；仅创建时显示一次，有效期不超过 365 天。账户 API 新增对应路径和 `urn:logto:scope:personal_access_tokens` 作用域。支持通过 `mfa.required` 强制用户下次登录设置 MFA，并统一按用户 ID、主邮箱、主手机号和用户名解锁；可导入 SHA-crypt `$5$`／`$6$` 密码哈希。
- **SAML、登录界面与管理 API**：SAML 应用支持 `staticAttributes`，属性名不得与其他属性冲突，大小写或分隔符差异也计入冲突。Bring your UI 可配置 COOP，默认 `unsafe-none` 不发送响应头；账户中心支持 `login_hint` 预填且允许用户换标识。管理 API 新增 `customData` 用户筛选、`jitEmailDomain` 组织筛选和组织成员 `hasPassword`。Webhook `deliveryId` 在同一投递重试时保持不变，并关联审计日志，便于接收方去重。

## Performance

- Connector Kit 的 `jsonGuard` 和 `jsonObjectGuard` 只构建一次递归 JSON Schema，避免每个嵌套值重复构建，减少大型 JSON 载荷验证时间，验证结果不变。

## Bugfix / Security

- **MFA 与账户绑定**：用户级、组织级要求优先于账户关闭或跳过 MFA 的设置，自适应 MFA 仍按风险决定。跳过 MFA 的登录不能再注册新因素，也不显示额外 MFA／通行密钥／备用码提示；注册、单纯进阶验证及原文列出的无可用因素账户保持原行为。各类验证绑定所识别或创建时对应的用户，登录／注册切换清除用户、暂存因素及可信设备选择。
- **社交与企业登录安全**：Apple 邮箱仅取自 ID 令牌，接受布尔或字符串形式的 `email_verified`，未验证邮箱不返回。企业 SSO 登录错误不再暴露连接器配置；可关闭邮箱匹配前公开连接器名称和徽标的设置。连接器请求错误只记录名称、代码、消息及方法和 URL 源／路径，不再包含请求体、请求头和查询字符串。
- **一次性凭证与输入验证**：授权码、设备码、推送授权请求和一次性令牌最多由一个请求使用，刷新令牌重用窗口不变。无效 SAML XML 返回 400 并记录格式错误；验证错误最多列出 100 项，两个社交回调端点在 100 个无效字段后停止验证。
- **Logto Tunnel**：0.3.12 在提供文件前解析符号链接，真实位置超出 `--experience-path` 返回 404；目录内链接及本身为链接的体验目录仍可用。超出文件末尾的 `Range` 截至文件大小，无法满足的范围返回 416。
- **登录兼容性**：修复早于 iOS／Safari 16.4 的空白登录页，编译目标为 15 及以上；刷新令牌忽略 `scope` 前后或重复空格产生的空值，仅空格视为未提供，保留原作用域。标准 OAuth 2.0／OIDC 接受字符串 `expires_in` 和数组 `scope`；Patreon 改用 API v2 身份端点。
- **管理与稳定性**：修复分页链接丢失重复查询参数、筛选后一次性令牌计数、手动解锁遗漏超过 60 分钟的安全验证锁定、SAML 含数字属性名的占位符、组织搜索、角色权限显示及隐藏品牌时的加载标识。数据库与 CLI 对临时连接错误重试，包含 DNS 失败；管理端点不匹配时记录一次警告，提示检查控制台 URL 与 `ADMIN_ENDPOINT`。Swift 指南统一客户端名称，修复复制示例后的编译错误。
