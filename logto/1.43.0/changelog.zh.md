

<img width="2120" height="1192" alt="logto-changelog-2026" src="https://github.com/user-attachments/assets/8c173344-814c-4220-99ce-250e6b537db6" />

登录体验现在支持“es-MX”（西班牙语、墨西哥）。

对于语言为西班牙语（墨西哥）的用户，电话输入默认为墨西哥国家/地区代码（“+52”）。此版本还修复了列表格式化程序占位符和西班牙语语言环境中剩余的未翻译的 MFA 消息。

## 安全加固

### 针对 webhooks 和企业 SSO 的 SSRF 保护

现在，通过管理 API 配置的出站请求在解析为环回、私有、链接本地、云元数据或其他特殊用途地址时会被阻止。

现在的保护范围包括：

- Webhook 传递，包括`POST /api/hooks/:id/test`。
- OIDC 企业 SSO 发现、令牌和用户信息请求。
- SAML 身份提供商元数据获取。
- 这些请求进行的每个重定向跃点。

建立连接时会检查 DNS 名称，因此解析为受保护地址的主机名会像文字 IP 地址一样被拒绝。

### 令牌交换验证

除了需要第一方主题令牌之外，Logto 现在还验证作为“access_token”主题呈现的 JWT 实际上是访问令牌。

JWT 必须包含：

- RFC 9068 `at+jwt` 类型标头。
- “client_id”声明。

OIDC ID 令牌和租户签名的其他 JWT 不能再替代访问令牌。无效的主题令牌会被“invalid_grant”拒绝。

### 第三方账户API限制

第三方应用程序无法再通过帐户 API 或验证 API 更改帐户数据。此类请求现在返回：

````text
403 auth.third_party_application_forbidden
````

第一方应用程序（包括帐户中心和控制台）不受影响。

对于未解析的客户端标识符，检查失败。这包括访问令牌仍处于活动状态的已删除应用程序以及标识符为元数据 URL 的 CIMD 客户端。

没有读取路线收到新的直接保护。但是，以下读取需要通过受保护的路由创建的验证记录，因此第三方应用程序无法再访问：

- `GET /api/我的帐户/补助金`
- `GET /api/我的帐户/会话`
- `GET /api/我的帐户/mfa-verifications/备份代码`

### 被暂停的用户无法接收新的代币

令牌颁发和用户信息现在拒绝使用“invalid_grant”暂停的用户，这与已删除用户的现有行为相匹配。

这适用于刷新令牌、授权代码、设备代码和令牌交换流，即使较早的令牌或会话撤销未成功完成也是如此。

### 第三方应用范围重新验证

从第三方应用程序的同意配置中删除用户范围现在会影响现有授权以及新的授权请求。

- 刷新令牌交换删除不再配置的范围。
- 在适当的情况下，恢复现有授权的授权请求会失败并显示“invalid_scope”。
- 删除组织范围后，组织令牌请求失败并显示“insufficient_scope”。
- 同意提交不再授予在同意屏幕打开时删除的范围。

### 标识符锁定使用标准化标识符

Sentinel 锁定计数器现在使用与帐户查找相同的标准化标识符形式：

- 电子邮件地址采用小写形式。
- 电话号码已标准化。
- 仅当租户的用户名策略不区分大小写时，用户名才会区分大小写。

这可以防止同一标识符的替代拼写创建单独的尝试存储桶并削弱“maxAttempts”。

手动解锁还会清除标识相同帐户的等效拼写。升级后，以非规范拼写记录的现有锁定可能会提前结束，但用户不会比以前更受锁定。

### 重定向验证

- 社交登陆页面“redirect_to”值必须使用“http”或“https”。
- 本机回调链接必须使用自定义应用程序方案。
- 在浏览器将控制权返回到本机应用程序之前，会再次检查存储的回调链接。
- 未使用的体验跳板路线已被删除，以消除不受信任的重定向表面。

## 错误修复和稳定性

### 身份验证和授权



- 撤销用户的第三方应用程序授权现在只会使该应用程序的令牌失效。用户的浏览器 SSO 会话保持活动状态。
- 椭圆曲线签名密钥现在公布与其曲线匹配的算法：P-256 使用“ES256”，P-384 使用“ES384”，P-521 使用“ES512”。
- 从密钥登录切换到验证码登录不再阻止用户完成验证码。
- OIDC `invalid_scope` 和 `insufficient_scope` 消息现在显示被拒绝的范围，而不是原始的 `{{error_description}}` 或 `{{scope}}` 占位符。

### 经验和本地化

- Safari 和其他密码管理器现在可以使用正确的帐户标识符在设置密码和重置密码屏幕上建议并保存强密码。
- 带空格的“Accept-Language”质量值，例如“en”； q=0.7`，现在可以正确解析。无效的质量值会安全地回退，而不是产生“NaN”。
- Gmail 自定义允许列表和阻止列表匹配现在将“gmail.com”和“googlemail.com”视为等效，并忽略本地部分中的点。
- 控制台现在为自定义电子邮件规则提供更清晰的示例、描述和更短的占位符。

### 账户中心和管理API

- 保存帐户中心或注册设置现在会删除对已删除的自定义配置文件字段的引用，而不是返回“custom_profile_fields.entity_not_exists_with_names”。
- 删除的字段仍然可以从控制台中删除，即使其权限控制处于关闭状态。
- 管理 API 关系端点现在接受空范围或角色数组作为无操作，而不是返回 500 错误。这包括以下端点：
 - `POST /applications/:applicationId/用户同意范围`
 - `POST /organizations/:id/users/:userId/roles`
- 日期验证现在匹配完整的输入，并拒绝有效日期之后的尾随字符。

### Webhook 传递

现在，当端点返回 HTTP 5xx 响应（与记录的交付合同匹配）时，Webhook POST 请求最多重试 3 次。

由于重试的事件可能会多次传递，因此 Webhook 接收器应该幂等地处理事件。

## 连接器

### 微软 Azure AD

Microsoft Azure AD 连接器现在支持“disableEmailSync”选项。

默认情况下，连接器继续将 Microsoft Graph“邮件”属性复制到 Logto 用户配置文件中。当连接器应在不同步该地址的情况下对用户进行身份验证时，启用此选项，以匹配可用于 Azure OIDC 企业 SSO 的现有控制。

## 自托管和 OSS 注释

- **需要采取行动 - 出站请求保护**：如果 Webhook 或企业 SSO 连接器有意访问专用网络上的服务，请在升级之前将所需的 IP 地址或 CIDR 范围添加到“SSRF_ALLOWED_ADDRESSES”：

 ````text
 SSRF_ALLOWED_ADDRESSES=10.0.0.0/8,127.0.0.1
 ````

 仅将所需的目的地列入白名单比全局禁用保护更安全。

- **动态应用程序兼容性**：配置“SSRF_ALLOWED_ADDRESSES”会禁用 CIMD，因此未经身份验证的动态客户端无法使用白名单来访问私有服务。设置 SSRF_PROTECTION_DISABLED=true 也会禁用 CIMD。

- **配置兼容性**：“OIDC_PROVIDER_SSRF_PROTECTION_DISABLED”仍然支持作为“SSRF_PROTECTION_DISABLED”的别名。这些变量仅适用于自托管部署。

- **脚本运行时限制**：自定义 JWT 和 Actions 脚本必须在 5 秒内完成，保持在 128 MB 工作内存预算范围内，并返回 JSON 可序列化值。

- **需要数据库迁移**：此版本提供了新的架构更改和索引。升级后，在启动新版本之前运行数据库变更命令（“@logto/cli”/core 映像中的“npm run alterdeploy”，或“logto db alterdeploy”）。请参阅[升级指南](https://docs.logto.io/logto-oss/upgrading-oss-version)。

## 贡献者

非常感谢在此版本中提供工作的社区成员：

- [@arpitjain099](https://github.com/arpitjain099) - 完整字符串日期验证 ([#9266](https://github.com/logto-io/logto/pull/9266))
- [@shuvamk](https://github.com/shuvamk) - 符合 RFC 的 `Accept-Language` 质量解析 ([#9338](https://github.com/logto-io/logto/pull/9338))
- [@darcyYe](https://github.com/darcyYe) - Webhook 重试 HTTP 5xx 响应 ([#9410](https://github.com/logto-io/logto/pull/9410))

有关更改的完整列表，请参阅[完整更改日志](https://github.com/logto-io/logto/blob/master/packages/core/CHANGELOG.md)。

