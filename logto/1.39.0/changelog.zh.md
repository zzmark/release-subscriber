

<img width="4240" height="2384" alt="logto-changelog-2026-04" src="https://github.com/user-attachments/assets/0df96833-fdf4-4644-9931-11a5db796d06" />

## 亮点
- **私有签名密钥轮换宽限期**：Logto 现在支持轮换私有签名密钥时的宽限期，帮助客户端刷新缓存的 JWKS，而无需停机。
- **自定义 JWT 脚本错误处理**：访问令牌和客户端凭据 JWT 自定义现在可以在脚本失败时阻止令牌颁发。
- **帐户中心安全页面**：最终用户现在可以从帐户中心管理社交帐户链接、MFA 和帐户删除。
- **WhatsApp 连接器**：可通过 Meta Cloud API 使用新的 WhatsApp SMS 连接器。
- **安全和兼容性修复**：忘记密码验证响应现在已统一，以降低帐户枚举风险，并且应用程序内浏览器社交/SSO 重定向更具弹性。

## 新功能和增强功能

### 私人签名密钥轮换宽限期

Logto 现在支持私人签名密钥轮换期间的宽限期。

这可以通过以下方式配置：

- `PRIVATE_KEY_ROTATION_GRACE_PERIOD` 环境变量。
- `--gracePeriod` CLI 选项。

宽限期内：

- 新生成的签名密钥标记为**下一步**。
- 现有签名密钥仍保持活动状态**当前**。
- 在新密钥生效之前，客户端有时间刷新缓存的 JWKS。

宽限期结束后：

- 新的私人签名密钥转换为**当前**。
- 旧签名密钥标记为 **Previous**。

这提供了更平滑的密钥轮换过程，并有助于避免因陈旧的 JWKS 缓存而导致的身份验证失败。

文档：<https://docs.logto.io/logto-oss/using-cli/rotate-signing-keys>

### 自定义 JWT 脚本错误处理

Logto 现在支持访问令牌和客户端凭据流中使用的自定义 JWT 脚本的可配置错误处理。

包含的更改：

- 自定义 JWT 脚本现在可以在执行失败时阻止令牌发行。
- `api.denyAccess()` 被保留为 `access_denied` 响应。
- 其他阻塞模式脚本失败作为本地化的“invalid_request”响应返回。
- 控制台添加了专用的**错误处理**选项卡来配置行为。
- 新创建的脚本默认启用“blockIssuanceOnError”。
- 没有保存值的现有脚本保留旧的禁用行为。
- 更新了相关控制台指南、短语、架构和集成覆盖范围。

这有助于开发人员根据其安全要求选择令牌自定义失败是否应失败打开或失败关闭。

### 账户中心安全页面

此版本向开箱即用的帐户中心添加了新的安全页面。

最终用户现在可以从“/account/security”管理帐户安全，包括：

- 社交帐户链接和取消链接。
- MFA 两步验证。
- 帐户删除。

控制台支持：

- 登录体验帐户中心设置现在公开删除帐户 URL 字段。
- 控制台显示帐户中心和社交预建 UI 条目。

### 通过 Meta Cloud API 的 WhatsApp 连接器

添加了新的 WhatsApp 连接器，用于通过 Meta Cloud API 发送消息。

这使得使用官方 Meta Cloud API 集成能够实现基于 WhatsApp 的短信/验证码传送方案。

### 组织分配 API 响应机构

组织用户和角色分配 API 现在返回响应正文。

更新的端点：

- `POST /organizations/:id/users` 现在返回 `{ userIds: string[] }`，回显请求中发送的用户 ID。
- `POST /organizations/:id/users/:userId/roles` 现在返回 `{ OrganizationRoleIds: string[] }`，包含分配给用户的最终去重角色 ID，包括从提供的角色名称解析的 ID。

### 控制台主题令牌更新

控制台主题现在包括浅色和深色模式缺少的“--color-overlay-primary-subtle”标记。

## 错误修复和稳定性

### 忘记密码验证枚举保护

忘记密码验证现在返回统一的“verification_code.code_mismatch”错误。

这可以防止流程通过不同的错误响应暴露电子邮件或电话号码是否存在。

### 应用内浏览器中的社交和 SSO 重定向

提高了 Instagram、Facebook 和 LINE 等应用内浏览器中社交和 SSO 重定向的可靠性。

某些应用内浏览器在新的 WebView 中打开 OAuth 身份提供商页面，这可能会导致“sessionStorage”在重定向回来后丢失。

此版本添加了“localStorage”后备：



- 重定向状态仍然存储在“sessionStorage”中。
- 后备重定向上下文包也存储在“localStorage”中。
- 在回调时，如果“sessionStorage”丢失，Logto 会从“localStorage”恢复状态。
- 后备条目在读取时消耗并在 10 分钟后自动清除。
- 如果两个存储位置都是空的，用户会看到错误消息。

### 验证码连接器请求IP

修复发送验证码时请求 IP 未传递至连接器的问题。

这允许连接器接收正确的请求上下文以进行验证码传递。

## 贡献者
感谢所有为此版本做出贡献的人：

- @konlanx #8626
- @makisekuris 在 #8616
- @MrMardel 在 #8458

