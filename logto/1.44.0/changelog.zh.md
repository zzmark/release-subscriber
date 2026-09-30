<img width="1060" height="596" alt="logto-changelog-2026-09" src="https://github.com/user-attachments/assets/16b11f26-0c2a-4601-8562-174e5015519b" />

## 更新亮点

- **MFA 受信任设备**：完成 MFA 后，用户可以信任当前浏览器，免去在该浏览器上反复进行 MFA 验证。管理员可以为整个租户设置策略，按组织收紧限制，并通过控制台、账户中心和 API 管理设备。
- **迁移时保留用户 ID**：用户 ID 现在最多可包含 128 个字符；自托管 Logto 支持在创建用户时指定自定义 `id`，因此迁移时可以保留 `auth0|abc123` 这样的 ID。管理 API 还可以根据用户的外部身份查找用户。
- **自托管 CAPTCHA：Cap**：在无法访问 Cloudflare Turnstile 和 Google reCAPTCHA 或其服务不可靠的环境中，可使用 [Cap](https://capjs.js.org) 提供机器人防护。reCAPTCHA Enterprise 还新增了可配置的评分阈值。
- **SAML 应用的身份验证策略**：允许 SAML 应用复用现有 Logto 会话、要求身份验证请求带有签名，并在断言中获得实际身份验证时间。
- **`theme` 身份验证参数**：传入 `theme=light` 或 `theme=dark`，使登录体验与应用自身的主题切换保持同步。
- **动态应用客户端的刷新令牌**：动态应用（CIMD）新增客户端兼容性设置，使 ChatGPT 和 Codex 等 MCP 客户端能够获取刷新令牌，用户无需在访问令牌每次过期时重新登录。在 Logto 中注册的应用不受影响。

## 新功能与增强

### MFA 受信任设备

完成 MFA 的用户现在可以选择信任当前浏览器，免去在该浏览器上反复进行 MFA 验证。

- **租户策略**：在**控制台 > 多重身份验证**中启用受信任设备，并将信任时长设为 1 至 365 天（默认 30 天）。该策略默认关闭。
- **组织限制**：组织可以禁止其成员使用受信任设备。这只能收紧租户策略。
- **信任此设备页面**：完成符合条件的 MFA 验证或设置后，用户会在登录或注册流程末尾看到专门的页面，可以选择按配置的时长信任当前浏览器，也可以跳过。
- **设备管理**：管理员可以在**控制台 > 用户管理**中查看和移除用户的受信任设备，也可以调用 `GET /api/users/{userId}/trusted-devices` 和 `DELETE /api/users/{userId}/trusted-devices/{trustedDeviceId}`。用户可以在账户中心管理自己的设备（字段控制选项为关闭、只读或编辑），也可以通过账户 API 的 `/api/my-account/trusted-devices` 路径管理，需具有 `urn:logto:scope:trusted_devices` 作用域。
- **Webhook 和审计日志**：可以订阅 `TrustedDevice.Created` 和 `TrustedDevice.Deleted` Webhook。审计日志会记录 `TrustedDevice.Created` 和 `TrustedDevice.Used`。

受信任设备只能满足登录流程中的 MFA 步骤，不能替代身份核验、账户恢复或其他敏感账户操作所需的验证。参见 [MFA 受信任设备](https://docs.logto.io/end-user-flows/mfa/trusted-devices)。

### 迁移时保留现有用户 ID

- **更长的用户 ID**：`users.id` 及引用它的所有列原先限制为 12 或 21 个字符，现在最多可包含 128 个字符。
- **创建用户时指定自定义用户 ID**（仅限 Logto OSS）：`POST /api/users` 接受可选的 `id`，最多 128 个字符，可使用字母、数字以及 `_ - . @ : + = |`。从其他身份提供方迁移时，可用它保留 `auth0|abc123` 或 UUID 等 ID。如果 ID 已被占用，请求会失败并返回 `user.id_already_in_use`。Logto Cloud 不支持此功能。参见[保留现有用户 ID](https://docs.logto.io/user-management/user-migration#keep-existing-user-ids)。
- **根据外部身份查找用户**：`GET /api/users` 接受 `identityType`、`identityProvider` 和 `identityId`，用于精确查找。使用 `identityType=social` 时，指定连接器目标（例如 `dingtalk`）；使用 `identityType=sso` 时，指定企业 SSO 的签发方，并提供该身份提供方签发的用户标识符。身份筛选条件与其他搜索筛选条件通过 AND 逻辑组合。参见[根据外部身份查找](https://docs.logto.io/user-management/advanced-user-search#look-up-by-external-identity)。感谢 [@JunWang666](https://github.com/JunWang666)（[#9572](https://github.com/logto-io/logto/pull/9572)）。

### 机器人防护

#### 将 Cap 用作自托管 CAPTCHA 提供方

[Cap](https://capjs.js.org) 是开源、自托管的工作量证明 CAPTCHA，无需第三方服务，因此在无法访问 Cloudflare Turnstile 和 Google reCAPTCHA 或其服务不可靠的地区，机器人防护仍可正常工作。

1. 部署可公开访问的 [Cap Standalone](https://capjs.js.org/guide/standalone/) 实例，并创建站点密钥。
2. 前往**控制台 > 安全 > CAPTCHA**，使用实例端点、站点密钥和私密密钥添加 Cap。也可以通过 `PUT /api/captcha-provider` 配置，使用 `type: "Cap"`。

将 Cap 用作 CAPTCHA 提供方时，登录页面的内容安全策略会允许访问 Cap 实例，并允许动态执行 JavaScript；后者是 Cap 的插桩验证挑战所必需的。感谢 [@imJack6](https://github.com/imJack6) 提出此需求（[#9404](https://github.com/logto-io/logto/issues/9404)）。

#### reCAPTCHA Enterprise 评分阈值

在**控制台 > 安全 > CAPTCHA** 中设置 reCAPTCHA Enterprise 可接受的最低评分（0.0 至 1.0），以控制验证的严格程度。此前阈值固定为 0.5。该设置适用于不可见模式，复选框模式不受影响。

### SAML 应用的身份验证策略

- **会话复用**：SAML 应用默认仍强制重新验证身份。要允许应用复用现有 Logto 会话，请在应用设置中关闭**始终强制身份验证**，或通过 SAML 应用管理 API 将 `authnRequestConfig.forceAuthn` 设为 `false`。服务提供方仍可通过 `ForceAuthn="true"` 要求某次登录重新验证身份。
- **实际身份验证时间**：SAML 断言现在会报告用户实际完成身份验证的时间。
- **签名身份验证请求**：将 `authnRequestConfig.requireSignedAuthnRequests` 设为 `true`，并在 `authnRequestConfig.signingCertificate` 中提供服务提供方采用 PEM 编码的 RSA X.509 证书。HTTP-POST 和 HTTP-Redirect 签名都会接受验证，IdP 元数据也会声明此要求。默认仍接受未签名请求。

### `theme` 身份验证参数

将 `theme=light` 或 `theme=dark` 作为额外身份验证参数传入，即可按指定主题呈现登录体验，而不再跟随最终用户的操作系统设置。具有独立明暗主题切换的应用现在可以让 Logto 与其保持同步。

该覆盖设置在整个身份验证流程中持续生效，包括页面重新加载、社交登录和 SSO 回调以及授权同意页面。如果登录体验设置中禁用了深色模式，则会忽略该参数；不支持的参数值也会被忽略。

### 动态应用客户端的刷新令牌

此设置仅适用于动态应用，即将 OAuth Client ID Metadata Document（CIMD）URL 用作 `client_id` 的客户端。在 Logto 中注册的应用不受影响。

ChatGPT 和 Codex 等 MCP 客户端遵循 MCP 授权规范，该规范只要求客户端请求 `offline_access` 作用域。这些客户端不会发送 `prompt=consent`；缺少该参数时，Logto 会按 OpenID Connect Core 的要求移除 `offline_access`。因此客户端无法获取刷新令牌，用户必须在访问令牌每次过期时重新登录。

在动态应用设置的**客户端兼容性**中开启**为离线访问添加授权同意提示**。对于请求了 `offline_access` 却缺少授权同意提示的动态应用授权请求，Logto 会在其 `prompt` 中添加 `consent`。带有 `prompt=none` 的请求保持不变。该设置处于实验阶段且默认关闭，审计日志会显示添加到 `prompt` 中的 `consent`。

### 管理 API SDK（`@logto/api`）

- **分页迭代器**：`paginate()` 根据管理 API 的分页响应头，为分页 `GET` 端点返回带类型的异步迭代器。

  ```ts

  for await (const user of apiClient.paginate('/api/users')) {

    console.log(user);

  }

  ```

- **可靠性**：
  - 令牌请求拒绝重定向，支持自定义中止信号和可配置的 10 秒超时；并发请求会共享一次令牌获取过程。
  - 被拒绝的缓存令牌只会被失效处理一次，不会因持续返回 `401` 而反复获取令牌。
  - 管理 API 的网络请求具有可配置的 10 秒超时，同时保留逐请求取消能力。
  - 每个不同的作用域只发出一次作用域不匹配警告，令牌请求失败时会保留其原因。
- **易用性**：
  - 管理 API 客户端支持对象形式的配置，可指定租户 ID，或显式指定基础 URL 和 API 标识符。
  - 支持 `.get()`、`.post()` 等小写客户端方法，同时保留大写方法。
  - 自定义基础 URL 的末尾斜杠会被规范化。

## 错误修复与稳定性

### 登录体验

- **浏览器自动翻译不再导致空白页面**：浏览器自动翻译登录页面时，React 的 DOM 更新可能失败，导致用户在登录途中看到空白页面。登录体验本已按租户进行本地化，因此页面现在通过 `translate="no"` 和 `<meta name="google" content="notranslate">` 禁用浏览器自动翻译。
- **社交账户关联**：社交注册过程中，如果必需的次要标识符（例如电话号码）已被另一个账户使用，只有该标识符可通过验证码登录时，才会显示“关联并继续”选项。此前关联会以 `user.sign_in_method_not_enabled` 失败，使用户无法继续。

### 企业 SSO 和 OIDC

- **OIDC SSO 签发方地址的末尾斜杠**：`https://idp.example.com/` 和 `https://idp.example.com` 现在会解析为同一个发现 URL。存储的签发方地址仍严格保留配置值，因此现有 SSO 身份仍可正常解析。OIDC SSO 连接器的出站请求失败时，现在会报告简明的原因。
- **`none` 提示参数验证**：OIDC 配置不再允许将 `none` 提示参数与其他提示参数值组合使用。
- **API 错误消息语言**：请求的地区语言不可用时，API 错误消息会回退到基础语言。

### 控制台

- **Webhook 测试结果**：测试结果现在按 Webhook 分别存储，因此一个 Webhook 的结果不会再出现在另一个 Webhook 的详情页上。

## 连接器

- **Apple**：标识符字段现在标为 **Services ID**，并说明使用 App ID（bundle ID）会被 Apple 拒绝并返回 `invalid_client`。设置说明涵盖 Apple Developer 门户，因此“通过 Apple 登录”不再给人必须使用 Xcode 的印象。故障排查说明涵盖 `invalid_client` 和 `invalid_request`，包括 Apple 的标识符配置缓存可能需要最多 24 小时才会刷新的情况。
- **钉钉（网页）**：钉钉令牌响应中的 `corpId` 现在会保留在社交用户信息的 `rawData` 中。
- **Twilio SMS**：新增可选的 API 主机配置，例如可以通过默认 `api.twilio.com` 以外的 Twilio 区域发送短信。

## 自托管与 OSS 说明

- **需要数据库迁移**：此版本包含两项数据库结构变更：一项为 SAML 应用配置添加身份验证请求配置列，另一项将 `users.id` 及引用它的所有列扩展为 `varchar(128)`。升级后，在启动新版本之前，请运行数据库变更命令（在 `@logto/cli`/core 镜像中执行 `npm run alteration deploy`，或执行 `logto db alteration deploy`）。参见[升级指南](https://docs.logto.io/logto-oss/upgrading-oss-version)。
- **回滚用户 ID 变更**：如果任何已存储的用户 ID 超过此前的 12 或 21 个字符限制，回滚用户 ID 变更会失败。
- **自定义用户 ID 仅限 OSS**：向 `POST /api/users` 传入 `id` 仅在自托管 Logto 中有效。
- **Cap 需要自建实例**：Cap 需要可公开访问的 Cap Standalone 实例。只有将 Cap 设为当前 CAPTCHA 提供方时，才会放宽内容安全策略。
- **数据库初始化检查遗留角色**：`logto db seed` 现在会在创建表之前检查所需的 PostgreSQL 角色。如果集群中仍保留此前 Logto 数据库的角色，该命令会报告冲突，并解释为什么删除数据库并未移除这些角色，以便在重试之前安全清理它们。

## 贡献者

衷心感谢以下社区成员，他们的工作已随本版本发布：

- [@JunWang666](https://github.com/JunWang666) - 根据外部身份查找用户（[#9572](https://github.com/logto-io/logto/pull/9572)）（首次贡献）
- [@Igor-Techsee](https://github.com/Igor-Techsee) - SAML 应用的身份验证策略（[#9563](https://github.com/logto-io/logto/pull/9563)）（首次贡献）
- [@konlanx](https://github.com/konlanx) - `theme` 身份验证参数（[#9645](https://github.com/logto-io/logto/pull/9645)）
- [@Kathircpe](https://github.com/Kathircpe) - reCAPTCHA Enterprise 评分阈值（[#9323](https://github.com/logto-io/logto/pull/9323)）
- [@nicolaj0](https://github.com/nicolaj0) - 禁用浏览器自动翻译（[#9591](https://github.com/logto-io/logto/pull/9591)）（首次贡献）
- [@Tyagiquamar](https://github.com/Tyagiquamar) - OIDC `none` 提示参数验证（[#9596](https://github.com/logto-io/logto/pull/9596)）以及钉钉 `rawData` 中的 `corpId`（[#9622](https://github.com/logto-io/logto/pull/9622)）（首次贡献）
- [@ryanchou1994](https://github.com/ryanchou1994) - 数据库初始化前检查遗留的 PostgreSQL 角色（[#9573](https://github.com/logto-io/logto/pull/9573)）（首次贡献）
- [@toyeshhm](https://github.com/toyeshhm) - 修复 Kakao 和 Naver 连接器的 README（[#9666](https://github.com/logto-io/logto/pull/9666)）（首次贡献）
- [@darcyYe](https://github.com/darcyYe) - 按 Webhook 分别存储测试结果（[#9664](https://github.com/logto-io/logto/pull/9664)）

**完整变更记录**：https://github.com/logto-io/logto/compare/v1.43.0...v1.44.0
