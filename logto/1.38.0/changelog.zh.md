

<img width="4240" height="2384" alt="logto-changelog-202603" src="https://github.com/user-attachments/assets/48042885-4747-4412-8dbe-ef23761fb1ab" />

## 亮点

- **设备流支持**：Logto 现在支持智能电视、CLI 工具、物联网设备和其他输入限制应用程序的 OAuth 2.0 设备授权。
- **密钥登录**：现已提供完整的密钥优先身份验证体验，包括基于按钮、标识符优先和自动填充辅助的流程。
- **自适应 MFA 和可选的 MFA 加入**：现在可以根据登录上下文触发 MFA，并且可以在登录后提示用户启用 MFA。
- **会话和授权管理**：此版本添加了用户会话管理、授权应用程序管理以及跨 API 和控制台的应用程序级并发授权限制。
- **更多 OSS 操作员控制**：OIDC 会话 TTL 现在可配置，并且租户级 OIDC 设置现在在控制台中公开。

## 新功能和增强功能

### OAuth 2.0 设备授权授予

Logto 现在支持 OAuth 2.0 设备授权，允许用户通过在另一台设备上完成身份验证来登录输入受限的设备，例如智能电视、CLI 工具、物联网小工具和游戏控制台。

此版本中包含：

- 核心和模式中的完整协议支持。
- 登录体验中的设备流支持。
- 控制台中的设备流支持。
- 设备流特定短语和内置演示支持。
- 应用程序设置页面中的设备流程特定指南。

控制台现在支持通过以下方式创建设备流应用程序：

- 在本机框架列表下选择**输入受限应用程序/CLI**。
- 创建一个没有框架的应用程序并选择**设备流程**作为授权流程。
- 创建第三方本机应用程序并选择**设备流程**作为授权流程。

### 密钥登录

此版本引入了密钥登录作为一流的身份验证方法。

包含的功能：

- 使用 Face ID、Touch ID 和 Windows Hello 等平台身份验证器的无密码登录体验。
- 提示新用户注册时绑定密码。
- 指导现有用户在以后的登录流程中绑定密钥。
- 重复使用现有的 WebAuthn MFA 凭据进行密钥登录，无需额外的注册步骤。

支持的用户旅程：

1. **密钥登录按钮**：用户可以单击**继续使用密钥**以立即触发浏览器密钥选择器。
2. **标识符优先流程**：用户首先输入标识符，然后提示**通过密钥进行验证**，然后再返回密码或验证码。
3. **允许自动填充**：支持的浏览器可以直接从标识符输入中建议保存的密钥。

文档：<https://docs.logto.io/end-user-flows/sign-up-and-sign-in/passkey-sign-in>

### 自适应 MFA

Logto 现在支持自适应 MFA。

包含的更改：

- 控制台始终在 MFA 设置页面上公开自适应 MFA 选项。
- `adaptiveMfa` 存储在登录体验负载中。
- 登录流程根据当前登录上下文评估自适应 MFA 规则。
- 触发自适应规则时需要进行MFA验证。
- 登录上下文始终保留在交互数据中，因此自定义声明脚本可以从“context.interaction.signInContext”中读取它。
- 当自适应 MFA 在登录期间强制进行 MFA 时，会发出新的“PostSignInAdaptiveMfaTriggered” webhook 事件。

### 可选的 MFA 入门

为不需要设置 MFA 的用户添加了新的 MFA 入门页面。

- 凭据验证后，可以明确询问用户是否要启用可选的 MFA 以提高帐户安全性。
- 当启用密钥登录时，这尤其有用，因为密钥可用于登录和 MFA 验证，并且某些用户可能不希望同时将其启用为 MFA 因素。

### 用户会话管理

此版本添加了跨 API 和控制台的用户会话管理。

账户API：

- `获取/我的帐户/会话`
-`删除/我的帐户/会话/：sessionId`

管理API：

- `GET /users/:userId/sessions`
- `GET /users/:userId/sessions/:sessionId`
- `删除 /users/:userId/sessions/:sessionId`

会话撤销详细信息：

- `revokeGrantsTarget=all` 撤销所有应用程序的授权。
- `revokeGrantsTarget=firstParty` 仅撤销第一方应用程序授权。
- 当撤销授权时，之前为这些授权颁发的不透明访问令牌和刷新令牌将失效。

权限和范围更新：



- 新增账户中心权限设置“session”，新增“off”、“readOnly”、“edit”。
- 引入了新的用户范围“urn:logto:scope:sessions”来控制与会话相关的帐户 API 访问。

会话上下文：

- 用户 IP、用户代理和 GEO 位置现在可以记录在交互提交数据中，并在“session.lastSubmission”中返回。

控制台支持：

- 在用户详细信息页面上添加了新的 **活动会话** 部分。
- 用户可以导航到专用的会话详细信息页面。
- 可以从会话详细信息页面撤销会话。
- 撤销会话会删除登录会话并撤销关联的第一方应用程序授权，从而强制对未来的请求进行重新身份验证。

### 用户申请授权管理

此版本引入了帐户和管理 API 的应用程序授权管理端点。

账户接口：

- `GET /my-account/grants` 列出当前用户的活动申请授权。
- `DELETE /my-account/grants/:grantId` 撤销当前用户的特定授权。

管理API：

- `GET /users/:userId/grants` 列出给定用户的活动应用程序授权。
- `DELETE /users/:userId/grants/:grantId` 撤销给定用户的特定授权。

授权列表支持可选的“appType”查询参数：

- `appType=firstParty`
- `appType=thirdParty`
- 省略“appType”以返回所有活动补助金

### 控制台中授权的第三方应用程序

控制台现在在用户详细信息页面上包含**授权的第三方应用程序**部分。

- 它列出用户的活动第三方应用程序授权。
- 显示应用程序名称、应用程序 ID 和访问创建时间。
- 它包括带有确认模式的撤销操作。
- 撤销应用程序会删除用户与该应用程序关联的所有活动第三方授权。

### 应用程序级并发授予限制

此版本添加了应用程序级并发授予限制。

核心和架构：

- 应用程序“customClientMetadata”现在支持可选的“maxAllowedGrants”字段。
- 新的 OIDC `authorization.success` 事件监听器验证当前授权客户端和用户的并发授权。
- 当活动授权计数超过配置的限制时，最旧的授权将自动撤销。

控制台：

- 应用程序详细信息页面添加了新的**并发设备限制**部分。
- 开发人员可以为当前应用程序配置每个用户并发活动授权的最大数量。

### 可配置的 OIDC 会话 TTL

此版本添加了可配置的 OIDC 会话 TTL 支持。

核心：

- OIDC 提供程序初始化现在遵循“logto-config”中的“oidc.session.ttl”。
- 当提供“oidc.session.ttl”时，它会覆盖默认会话 TTL。
- 添加了新的管理 API：
 - `GET /api/configs/oidc/session`
 - `PATCH /api/configs/oidc/session`

架构：

- 在“logto-config”中添加了新的可选“oidc.session.ttl”字段。
- 该值以秒为单位配置。
- 如果未提供，默认值仍为“14 天”。

对于OSS部署：

- 配置更改后重新启动服务实例，以便服务器可以获取更新的 OIDC 配置。
- 要自动应用 OIDC 配置更新而不重新启动，请启用中央 Redis 缓存。

### 控制台中的租户设置页面和 OIDC 设置

控制台现在公开 OSS 中的租户级 OIDC 设置。

- 添加了新的 **租户 -> 设置** 页面。
- 原始的**签名密钥**页面已弃用并删除。
- **租户 -> 设置**下添加了新的 **OIDC 设置**选项卡。
- 签名密钥配置迁移至 **设置 -> OIDC 设置**。
- 添加了新的 **会话最大生存时间** 字段，以配置租户级会话 TTL（以天为单位）。
- 控制台字段使用天数进行输入和显示，而底层 OIDC 会话 TTL 配置和 API 使用秒数。

### 帐户中心改进

此版本包括对开箱即用的帐户中心的多项改进。

- 添加了对通过专用的“/authenticator-app/replace”路径替换身份验证器应用程序的支持。
- 在帐户 API 中添加了新的 PUT 端点，用于幂等 TOTP 替换。
- 添加了对“identifier”URL 参数的支持，以预填充标识符输入字段。
- 添加了对使用“ui_locales” URL 参数覆盖开箱即用的帐户中心语言的支持。

### 服务到服务委托的访问令牌交换

Logto 现在支持服务到服务委托的访问令牌交换。



- 标准 `subject_token_type` 值 `urn:ietf:params:oauth:token-type:access_token` 现在支持访问令牌交换。
- Logto 发行的不透明访问令牌和 JWT 访问令牌都可以与不同受众交换新的访问令牌。
- 这支持服务到服务的委派方案。

令牌验证顺序：

1. 如果令牌以“sub_”开头，则将其视为旧版模拟令牌。
2. 尝试通过“oidc-provider”将其作为不透明访问令牌查找。
3. 使用发行者的 JWK 集回退到 JWT 验证。

附加细节：

- 访问令牌不进行消费跟踪，因此同一个令牌可以多次交换。
- 添加了新的“urn:logto:token-type:impersonation_token”类型以进行显式模拟令牌处理。

### 用于迁移的密码哈希导出

以下端点现在支持“includePasswordHash”查询参数：

- `获取/用户`
- `GET /users/:userId`

当设置为“true”时，响应包括：

- `密码摘要`
- `密码算法`

这适用于需要原始密码哈希的迁移场景。

### 本地化

- 登录体验中添加了捷克语支持。 （图片来源@ppotaczek @leoshusar）

## 错误修复和稳定性

### MFA验证哨兵保护

TOTP、WebAuthn 和备份代码 MFA 验证现在向 Sentinel 报告活动。

- 在 MFA 期间可以更一致地检测和阻止重复的 MFA 故障。
- MFA 特定的 Sentinel 操作使 MFA 尝试与共享主登录池隔离。
- 这可以避免在不相关的验证阶段或因素中泄漏锁定。

### OIDC 适配器查询优化

改进了 OIDC 适配器“findByUid”和“findByUserCode”查询。

- 现在使用文字 JSONB 键，因此可以在准备好的通用计划下使用表达式索引。

### Postgres 启动弹性

提高了 Postgres 部署的启动稳定性。

- Logto 现在会在出现暂时性连接错误时重试 Postgres 池初始化。

### 旧密码导入兼容性

改进了旧用户导入的兼容性。

- 旧密码验证现在支持以“hex:”为前缀的 PBKDF2 盐值。

### 代币兑换表现

改进了代币交换性能。

- 最小 OIDC 资源查找现在缓存在查询层。
- 授予 ID 在令牌发行期间预先生成，以避免仅为创建授予而进行额外写入。

### 帐户中心密码自动填充

改进了帐户中心密码表单，以提供更好的浏览器自动填充和密码管理器支持。

### Twilio 短信格式修复

通过规范化非 E.164 号码以包含前导“+”，修复了 Twilio SMS“To”格式。

## 重大变更

### 连接器套件清理

- 从“@logto/connector-kit”中删除了长期弃用的“mockSmsVerificationCodeFileName”导出。

### 模拟连接器文件路径更新

更新了模拟连接器用于存储已发送消息的文件路径。

- `/tmp/logto_mock_email_record.txt` -> `/tmp/logto/mock_email_record.txt`
- `/tmp/logto_mock_sms_record.txt` -> `/tmp/logto/mock_sms_record.txt`

这为模拟连接器文件创建了更加一致和有组织的结构，并使它们更易于在 Docker 环境中管理和安装。

## 新贡献者

- @taka-guevara 在 #8555 中做出了第一个贡献
- @synchrone 在 #8504 中做出了第一个贡献
- @ppotaczek 和 @leoshusar 在 #8526 中做出了第一个贡献

**完整变更日志**：https://github.com/logto-io/logto/compare/v1.37.0...v1.38.0

