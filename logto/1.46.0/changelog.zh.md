<img width="4240" height="2384" alt="logto-changelog-2026" src="https://github.com/user-attachments/assets/6b152931-6e86-4413-a061-f24929f9f110" />
<!--
与以往版本一样，在此放置横幅图片。横幅文字：
- OIDC 进阶身份验证
- 使用 Ethereum 钱包登录
- 保留 iOS“存储密码”提示
- 自助管理个人访问令牌
-->

## 更新亮点

- **OIDC 进阶身份验证**：应用可请求 `acr_values` 和 `max_age`，并从令牌读取 `acr`、`amr` 和 `auth_time`。账户中心使用此能力，在执行敏感变更前要求用户最近完成过登录。
- **使用 Ethereum 登录**：新增 Ethereum Wallet 社交连接器，让用户使用 EVM 钱包登录。
- **保留 iOS“存储密码”提示**：用户输入密码后，`confirm_redirect_policy` 登录参数会在返回应用前显示“继续”页面。
- **账户中心的个人访问令牌**：用户可创建、重命名和撤销自己的个人访问令牌。
- **极验验证码**：使用 GeeTest CAPTCHA v4 防范机器人，适合面向中国大陆用户的登录体验。
- **SAML 应用静态属性**：在每条 SAML 断言中发送固定的属性值。
- **安全修复，其中一项需要管理员操作**：本版包含 MFA、社交登录、企业登录、账户 API 和 Logto Tunnel 的安全修复。升级后，标准 OAuth 2.0 和 Microsoft Azure AD 社交连接器需要检查设置。参见下文的**安全加固**。

## 新功能与增强

### OIDC 进阶身份验证

OIDC 客户端现在可以要求用户最近完成过登录，或使用更强的登录验证方式：

- **请求**：在授权请求中传入 `acr_values` 和 `max_age`。Logto 会在发现文档中声明支持的 ACR 值。
- **结果**：ID 令牌、访问令牌和令牌内省响应中会返回 `acr`、`amr` 和 `auth_time`。
- **账户中心**：内置账户中心现在使用新近签发的第一方 `urn:logto:acr:1fa` 访问令牌授权敏感的账户 API 操作，不再使用单独的验证记录。如果距上次登录的时间过长，账户 API 会返回 RFC 9470 进阶身份验证质询。
- **近期身份验证时间窗口**：在**控制台 > 登录体验 > 账户中心 > 近期身份验证**中设置允许距上次登录多长时间（默认 10 分钟）。客户端仍可通过 `max_age` 请求更短的时间窗口。
- **兼容性**：直接调用账户 API 的应用仍可使用验证记录 ID 执行敏感操作。

参见[进阶身份验证](https://docs.logto.io/end-user-flows/step-up-authentication)。

### 使用 Ethereum 登录

管理员可启用新增的 Ethereum Wallet 社交连接器（`@logto/connector-siwe`）。使用注入式 EIP-1193 钱包的用户，无需离开登录页面即可签署一次性 SIWE（EIP-4361）消息。同一个地址可用于受支持的各条 EVM 链，管理员也可限制允许的链 ID。

### 保留 iOS“存储密码”提示

在 iOS 上，`ASWebAuthenticationSession` 一旦检测到应用的回调 URL 就会关闭，导致用户通过密码登录后，系统“存储密码”提示立即消失。

在授权请求中传入 `confirm_redirect_policy=password`，即可显示一个仅在用户选择“继续”后才返回应用的页面。此页面会在用户于登录体验中输入密码后出现，包括密码登录、密码注册、设置密码或进阶密码验证。

不传入此参数时，Logto 会立即重定向回应用。第三方应用会忽略此参数。控制台中的 Swift 集成指南介绍了使用方式。参见[保留 iOS“存储密码”提示](https://docs.logto.io/end-user-flows/authentication-parameters#keep-the-ios-save-password-prompt)。

### 账户中心的个人访问令牌

租户在账户中心启用个人访问令牌字段后，用户可在账户中心的**安全**页面创建、重命名和撤销个人访问令牌。每个令牌仅在创建时显示一次，有效期不超过 365 天。

也可通过账户 API 的 `/api/my-account/personal-access-tokens` 执行相同操作，使用新增的 `urn:logto:scope:personal_access_tokens` 作用域（`@logto/core-kit` 中的 `UserScope.PersonalAccessTokens`）。

### 极验验证码

[GeeTest](https://www.geetest.com) CAPTCHA v4 现已可用作验证码服务提供商。它提供本地化的自适应验证挑战，适合面向中国大陆用户的登录体验，因为 Google reCAPTCHA 在中国大陆经常无法访问。

1. 在极验管理后台创建 CAPTCHA v4 验证事件。
2. 前往**控制台 > 安全 > 验证码**，使用 CAPTCHA ID 和 CAPTCHA 密钥添加极验。也可通过 `PUT /api/captcha-provider` 使用 `type: "Geetest"` 进行相同配置。

使用极验作为验证码服务提供商时，登录页面的内容安全策略会允许极验的 SDK、API 和静态资源主机。

### 取消登录时返回 `access_denied`

- **授权同意页面**：取消内置授权同意页面现在会以 `access_denied` 结束交互，并携带原始 `state` 和 `iss` 将用户返回客户端应用。
- **直接登录**：直接登录失败时也以相同方式返回客户端，不再回退到托管登录页面。
- **自定义登录体验**：通过 `POST /api/experience/abort` 可以同一错误结束当前交互；可选的 `reason` 会成为 `error_description`。`GET /api/experience/interaction/direct-sign-in` 返回当前授权请求的 `direct_sign_in` 值，使自定义体验能够在交互初始化前区分直接登录与托管登录。

### 用户管理

- **要求用户设置 MFA**：在控制台的用户详情页启用**要求设置 MFA**，或通过管理 API 将 `mfa.required` 设为 `true`。无论组织级 MFA 策略如何，用户下次登录时都必须设置 MFA，且不能跳过。
- **解锁用户**：用户详情页新增解锁操作，可清除以用户 ID、主邮箱、主手机号和用户名为标识的登录锁定及安全验证锁定，管理员无需知道究竟是哪个标识触发了锁定。
- **SHA-crypt 旧版密码哈希**：导入使用 SHA-crypt 哈希（`$5$` 和 `$6$`，Linux、passlib、PHP 等均会使用）的用户时，将密码算法设为 `Legacy`，并将完整存储的 crypt 字符串作为密码摘要传入。

### SAML 应用静态属性

SAML 应用可定义固定的属性名称和值，与映射的用户属性一起在每条断言中发送，以满足服务提供商对账户 ID、站点 ID 等常量值的要求。

- **控制台**：使用 SAML 应用属性映射选项卡中的**静态属性**部分。
- **管理 API**：通过 `POST /api/saml-applications` 或 `PATCH /api/saml-applications/{id}` 设置 `staticAttributes`。

属性名称可包含字母、数字和 `_.:/#@-`。各名称之间以及与断言中的用户属性名称之间均不得冲突；仅大小写或分隔符不同的名称也视为冲突，例如 `site_id` 和 `siteId`。

### Bring your UI 的 Cross-Origin-Opener-Policy

使用 Bring your UI 的租户可在**控制台 > 登录体验 > 品牌 > Bring your UI** 中选择 `same-origin-allow-popups` 或 `same-origin`，也可通过登录体验管理 API 设置 `crossOriginOpenerPolicy`。提供自定义 UI 资源时，托管登录页面会发送此响应头。默认值 `unsafe-none` 不发送响应头，因此通过弹出窗口打开登录页面的应用仍可正常工作。

### 账户中心的 `login_hint`

在任何账户中心 URL 中添加 `login_hint`（例如 `https://auth.foo.com/account/security?login_hint=foo@example.com`），即可在用户需要登录时预填登录页面的标识字段。此提示仅用于预填字段，用户仍可使用其他标识登录。

### 管理 API 与 webhook

- **按自定义数据搜索用户**：`GET /api/users` 接受可重复的 `customData` 查询参数，匹配自定义数据包含给定 JSON 对象的用户，例如 `customData={"customId":114514}`。重复值之间按 OR 组合，该条件与其他用户筛选条件按 AND 组合。
- **按即时预配域名查找组织**：`GET /api/organizations` 接受 `jitEmailDomain` 查询参数，分页返回拥有此邮箱域名的用户将被预配到的组织。与其他筛选条件一样，它可与 `q` 及分页参数组合使用。
- **组织成员的 `hasPassword`**：`GET /api/organizations/:id/users` 现在会包含每名成员是否设置了密码，与用户列表和用户详情的响应保持一致。
- **Webhook `deliveryId`**：每个 webhook 载荷现在都包含 `deliveryId`。它在每个 webhook 与事件的组合内唯一，同一请求重试时保持不变，接收方因此可对每次投递只处理一次。它也是记录此次投递的审计日志条目 ID：可从控制台中 webhook 的最近请求打开，或通过 `GET /api/logs/:id` 获取。“测试 webhook”的载荷也包含此字段。

## 安全加固

### 需要操作：OAuth 2.0 和 Microsoft Azure AD 连接器的邮箱同步

标准 OAuth 2.0 社交连接器（`@logto/connector-oauth` 1.8.0）新增**禁用邮箱同步**开关（`disableEmailSync`），与 Microsoft Azure AD 连接器自 Logto 1.43.0 起提供的开关一致。

仅升级不会改变现有连接器的行为。此开关默认关闭，因此这些连接器仍会将服务提供商返回的邮箱地址同步到用户资料。标准 OAuth 2.0 协议不携带邮箱地址的验证状态，所以映射的 `email` 值会被直接采信。

升级后，请检查每个标准 OAuth 2.0 和 Microsoft Azure AD 社交连接器。如果服务提供商不验证用户是否拥有其返回的邮箱地址，请开启**禁用邮箱同步**。该地址仍保留在 `rawData` 中。

### 使用 Apple 登录

Apple 连接器（`@logto/connector-apple` 1.6.11）现在仅从 Apple ID 令牌获取用户邮箱；无论 Apple 将 `email_verified` 发送为 `true` 还是 `"true"`，均可识别。如果 Apple 将邮箱标记为未验证，则不返回邮箱。用户姓名仍取自 Apple 在首次授权时发送的详情。

### 多重身份验证

- **用户与组织要求**：当租户级 MFA 为可选时，用户级和组织级 MFA 要求现在优先于关闭 MFA 或在登录时跳过 MFA 的账户设置。自适应 MFA 仍根据风险作出决定。
- **跳过 MFA 的登录**：跳过 MFA 验证的登录（例如自适应 MFA 未触发，或可信设备满足了策略）不再显示额外的 MFA、通行密钥或备用码提示，也不能再注册新的验证因素。注册、单纯的进阶身份验证，以及既没有已存储验证因素、也没有可供所配置邮箱或手机 MFA 使用的主邮箱或主手机号的账户，均保持原有行为。
- **验证绑定到账户**：通行密钥、社交登录或企业 SSO 验证只对其识别出的账户有效。邮箱或手机 MFA 验证现在绑定到创建该验证时对应的用户，已完成的验证也只对该用户有效。
- **在登录与注册之间切换**：在登录与注册之间切换交互时，现在还会丢弃已识别的用户、为该用户暂存的 MFA 验证因素，以及该用户选择信任设备的设置。

### 企业 SSO

- **SAML 断言受众**：只有当 SAML 断言中的某个 `Audience` 值与连接器在接收响应的域名或租户默认域名上的**受众 URI（SP Entity ID）**完全匹配时，SAML 企业 SSO 连接器才会接受该断言。如果升级后 SAML 登录失败并提示“SAML 断言受众与 SP 实体 ID 不匹配”，请在身份提供商中将受众设为连接器设置中显示的受众 URI（SP Entity ID）。
- **错误中的连接器配置**：登录错误响应不再包含企业 SSO 连接器配置。
- **邮箱匹配前的连接器品牌信息**：**控制台 > 登录体验 > 注册与登录 > 高级选项**下新增**在邮箱匹配前显示 SSO 连接器名称和徽标**设置，控制在邮箱域名匹配前，是否在公开登录配置中包含企业 SSO 连接器的名称和徽标。此设置默认开启，保持当前行为。关闭后，仅在匹配成功后显示这些信息。

### 账户 API 与第三方应用

以下账户 API 操作现在要求使用第一方应用，与账户修改操作已有的仅限第一方策略一致：

- 获取或刷新已存储的社交登录或企业 SSO 服务提供商令牌：
  - `GET /api/my-account/identities/:target/access-token`
  - `GET /api/my-account/sso-identities/:connectorId/access-token`
  - `PUT /api/my-account/identities/:target/access-token`
- 读取备用码、会话、授权记录和可信设备。

第三方应用现在会收到：

```text
403 auth.third_party_application_forbidden
```

第一方应用（包括账户中心和控制台）不受影响。如果现有集成会获取已存储的服务提供商令牌，请使用第一方应用获取访问令牌。

### 连接器请求错误

连接器发出的请求失败时（例如网络超时），在写入日志、导出到遥测、记录到审计日志或通过错误响应返回前，错误现在会被精简为名称、代码和消息。服务器日志还会保留请求方法，以及 URL 的源和路径名。不再包含请求体、请求头或查询字符串。

### 一次性代码与令牌

授权码、设备码、推送授权请求或一次性令牌现在最多只被一个请求接受。其余提交相同内容的请求会收到重复使用时的错误：授权码或设备码返回 `invalid_grant`，推送授权请求返回 `invalid_request_uri`，一次性令牌返回 `one_time_token.token_consumed`。刷新令牌保持原有的重用时间窗口。

### SAML 应用

`GET` 和 `POST /api/saml/:id/authn` 现在会以 `400 application.saml.invalid_saml_request` 拒绝 XML 格式不正确的 SAML 请求，例如包含未转义 `&` 或结束标记不匹配的请求。此类请求的审计日志条目会在 `samlRequestError` 下记录格式错误。当应用不要求对身份验证请求签名时，无法解码或解析的请求也会返回此 400 错误，不再返回 500。

### Logto Tunnel

`@logto/tunnel` 0.3.12 加固了从 `--experience-path` 提供静态文件的处理：

- 提供文件前会解析符号链接。文件的真实位置在体验目录之外时返回 404。指向目录内部文件的符号链接，以及本身就是符号链接的体验目录，仍可正常使用。
- `Range` 的结束位置超出文件末尾时，会被限制为文件大小。无法满足的 `Range` 返回 416。

### 请求验证

- `guard.invalid_input` 错误响应现在只列出前 100 个验证问题。
- `POST /callback/:connectorId` 和 `POST /account/callback/social/:connectorId` 现在会在发现 100 个无效字段后停止验证无效请求体。错误响应保持不变。

## 错误修复与稳定性

### 登录体验

- **旧版 Safari 与 iOS**：在低于 16.4 的 iOS 和 Safari 版本上，登录页面不再显示为空白。登录体验现在以 iOS 15、Safari 15 及更高版本为编译目标。

### 社交登录

- **服务提供商无法访问**：向社交登录服务提供商交换令牌或请求用户信息时，如果发生传输层故障（超时、连接重置、DNS 失败），Logto 现在返回 `502 connector.social_provider_unreachable`，不再返回通用的 500。响应包含网络错误码和连接器 ID，最终用户会看到翻译后的消息。请求方法和 URL 会写入服务器日志。
- **拒绝授权**：用户在社交登录服务提供商处拒绝授权同意页面或取消操作时，所有社交登录、验证和账户关联流程现在均返回 `401 connector.authorization_failed`，并携带服务提供商的 `error` 和 `error_description`。这覆盖 `error=access_denied`（OAuth 2.0 / OpenID Connect）、`user_cancelled_authorize`（使用 Apple 登录、LinkedIn）和 `user_cancelled_login`（LinkedIn）。大多数社交连接器此前会返回通用的 `connector.general` 错误。
- **服务提供商错误消息**：社交连接器请求失败时，错误现在会显示服务提供商的实际消息，不再显示 `{}`。

### OAuth 与 OIDC

- **带多余空格的 `scope` 值**：某些客户端（例如 OpenAI Codex）在刷新令牌时，传入的 `scope` 带有前导空格（例如 `" offline_access"`）。Logto 此前会以 `invalid_scope` 拒绝这些请求，导致用户每次访问令牌过期后都必须重新登录。Logto 现在会忽略前导、尾随或重复空格产生的空作用域值。仅包含空格的 `scope` 视为未提供，因此刷新令牌请求会保留刷新令牌原有的作用域。

### 管理 API

- **未知的 `customClientMetadata` 键**：`POST /api/applications` 和 `PATCH /api/applications/:id` 现在会以 `400 guard.invalid_input` 拒绝 `customClientMetadata` 下的未知键，并在 `data` 中列出该键。此前，`refreshTokenTtlInDay` 等拼写错误会被接受，但设置从未生效。现有应用不受影响。
- **分页链接**：`GET /api/applications?types=SPA&types=Traditional&page=1` 等列表端点的 `first`、`prev`、`next` 和 `last` 链接，现在会保留重复查询参数的每个值，不再将它们合并为单个逗号分隔的值。
- **一次性令牌计数**：`GET /api/one-time-tokens` 按 `email` 或 `status` 筛选时，`Total-Number` 响应头现在只统计匹配的令牌。
- **手动解锁**：手动解锁用户现在还会清除仍然有效、时长超过 60 分钟的安全验证锁定。手动解锁对话框和 API 文档现在也会说明用户 ID 和安全验证锁定。

### SAML 应用

- **属性占位符**：名称为 `o365role` 或 `tenant1id` 等的映射属性，此前会以字面量 `{attr…}` 占位符发送，而不是发送用户的值。现在会携带映射后的值。

### 控制台与账户中心

- **应用访问控制**：应用访问控制规则中的组织选择器，现在会在搜索组织时筛选结果。
- **角色权限**：分配角色权限时，API 资源名称会完整显示，被截断的权限名称和资源名称会提供工具提示。
- **账户中心品牌标识**：隐藏 Logto 品牌标识时，账户中心加载期间不再显示“Powered by Logto”标识。

### 文档

- **Swift 集成指南**：代码示例现在始终使用同一个客户端名称，修复了将示例复制到 Xcode 项目后出现的 `Cannot find 'client' in scope` 错误（[#9788](https://github.com/logto-io/logto/pull/9788)）。感谢 [@timokoethe](https://github.com/timokoethe)。

## 连接器

- **标准 OAuth 2.0 与 OIDC**：
  - 令牌响应将 `expires_in` 返回为字符串时（例如 Criipto 等服务提供商），不再因响应无效而失败。
  - 令牌响应将 `scope` 返回为 JSON 数组时（例如 Twitch 等服务提供商），不再因响应无效而失败。作用域会规范化为空格分隔的字符串。
- **Patreon**：Patreon 移除了 v1 公共 API，导致连接器返回 `410 Gone`。连接器现在从 Patreon API v2 身份端点请求用户资料字段，因此 Patreon 登录恢复正常。
- **Connector Kit**：`jsonGuard` 和 `jsonObjectGuard` 现在仅构建一次递归 JSON Schema，不再为每个嵌套值重新构建，减少了验证大型 JSON 载荷所需的时间。验证结果保持不变。

## 自托管与 OSS 说明

- **升级前检查**：检查**安全加固**中的 OAuth 2.0 和 Azure AD 邮箱同步、SAML 断言受众，以及第三方账户 API 变更。
- **Node.js 26**：官方 Docker 镜像现在运行于 Node.js 26。Logto 及发布的软件包支持 Node.js 22、24 和 26，最低版本分别为 22.23.4、24.22.1 和 26.12.1；这些版本包含 2026 年 10 月的 Node.js 安全修复。
- **需要数据库迁移**：本版包含数据库结构变更，包括用于 SAML 应用静态属性、新登录体验及账户中心设置的新列。升级后，必须在启动新版前运行数据库变更命令（在 `@logto/cli`／core 镜像中执行 `npm run alteration deploy`，或执行 `logto db alteration deploy`）。参见[升级指南](https://docs.logto.io/logto-oss/upgrading-oss-version)。
- **数据库连接重试**：启动时无法解析主机名（`ENOTFOUND`、`EAI_AGAIN`）时，core 现在会重试数据库连接，不再立即退出。`db seed` 和 `db alteration deploy` 等 CLI 数据库命令现在也以相同方式重试临时连接错误，包括 DNS 失败。
- **管理端点警告**：当 `/console` 请求因请求源与任何已配置的管理端点均不匹配而到达默认租户时，Logto 现在会记录一次警告。如果看到此警告，请检查控制台 URL 和 `ADMIN_ENDPOINT`。

## 贡献者

衷心感谢在本次发布中贡献代码的社区成员：

- [@nicolaj0](https://github.com/nicolaj0) - webhook `deliveryId`（[#9882](https://github.com/logto-io/logto/pull/9882)）、组织成员的 `hasPassword`（[#9883](https://github.com/logto-io/logto/pull/9883)）、按即时预配域名筛选组织（[#9912](https://github.com/logto-io/logto/pull/9912)）、`customClientMetadata` 键验证（[#9931](https://github.com/logto-io/logto/pull/9931)）、社交登录服务提供商无法访问时的错误（[#9879](https://github.com/logto-io/logto/pull/9879)）、社交授权被拒绝时的错误（[#9880](https://github.com/logto-io/logto/pull/9880)）、DNS 失败时的数据库连接重试（[#9881](https://github.com/logto-io/logto/pull/9881)、[#9928](https://github.com/logto-io/logto/pull/9928)），以及日志和响应中的连接器请求错误（[#9849](https://github.com/logto-io/logto/pull/9849)）
- [@RaphaelFakhri](https://github.com/RaphaelFakhri) - 分页链接中的重复查询参数（[#9811](https://github.com/logto-io/logto/pull/9811)）（首次贡献）
- [@mvanhorn](https://github.com/mvanhorn) - `ADMIN_ENDPOINT` 不匹配警告（[#9408](https://github.com/logto-io/logto/pull/9408)）
- [@timokoethe](https://github.com/timokoethe) - Swift 集成指南中统一的客户端名称（[#9788](https://github.com/logto-io/logto/pull/9788)）

**完整 Changelog**：https://github.com/logto-io/logto/compare/v1.45.0...v1.46.0
