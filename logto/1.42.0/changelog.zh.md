


<img width="4240" height="2384" alt="logto-changelog-2026" src="https://github.com/user-attachments/assets/d1886510-f18d-4144-b3a2-6852eb88d84c" />

## 亮点

- **自定义域验证文件**：从活动自定义域提供小文本或 JSON 验证文件，因此按文件验证域所有权的第三方服务不再需要单独的主机。
- **电子邮件访问规则**：新的电子邮件允许列表加上通配符地址和域模式使租户可以精确控制可以注册或链接的电子邮件。
- **重置密码魔术链接**：重置密码登陆页面现在可以验证一次性令牌魔术链接。
- **OIDC 提供程序升级到 node-oidc-provider v9**：撤销不透明访问令牌现在会撤销整个授权，并且 RFC 8414 授权服务器元数据端点可用。
- **强化的出站请求**：OIDC 提供商 SSRF 保护现在默认启用 - 到达专用网络依赖方的自托管部署必须明确选择退出。

## 新功能和增强功能

### 自定义域验证文件

管理员现在可以从控制台 -> 租户设置 -> 域将小型验证文件附加到活动的自定义域，而 Logto 无需对任何特定于提供商的行为进行建模。

每个文件有：

- 路径可以是带有扩展名的根级文件名（例如“/verify.txt”），也可以是“/.well-known/”下的路径。
- `text/plain` 或 `application/json` 的内容类型。 JSON 内容在保存时进行验证。
- 内容最多 16 KB。

每个域最多可以配置 10 个文件，并且路径必须是唯一的。 Logto 提供与配置的内容类型和响应强化精确匹配的“GET”和“HEAD”；现有 Logto 路由始终优先于同一路径中的验证文件。控制台体验已针对所有支持的语言进行了本地化。

### 电子邮件访问规则：白名单和通配符模式

电子邮件阻止列表策略已扩展为更完整的电子邮件访问规则集。

- **自定义电子邮件白名单**：配置电子邮件地址、域或通配符模式的白名单。设置后，在电子邮件注册和帐户电子邮件更新中，新注册和新链接的电子邮件仅接受匹配的电子邮件。
- **通配符模式**：允许列表和阻止列表都接受通配符电子邮件地址和域模式，例如“foo*@example.com”、“*@example.com”和“@*.example.com”，以及确切的地址（“bar@example.com”）和域（“@example.com”）。
- **冲突警告**：当允许列表条目也与阻止规则匹配、当允许列表条目在电子邮件子寻址被阻止时使用加号以及当组合规则根本不允许任何新电子邮件通过时，控制台会发出警告。

这两个功能均在控制台 -> 安全 -> 电子邮件阻止列表中配置。匹配和验证逻辑现在通过“@logto/core-kit”中的可重用帮助程序共享。

### 重置密码魔法链接

体验应用程序现在支持密码重置流程，除了验证码之外，还可以直接从重置密码登录页面验证一次性令牌魔术链接。

### `Grant.LimitExceeded` webhook 事件

当 OIDC 授权因应用程序超出其允许的最大授权限制而被逐出时，Logto 现在会触发“Grant.LimitExceeded” Webhook 事件，该事件可以像任何其他事件一样在控制台 Webhook 设置中进行选择。

有效负载报告“userId”、“applicationId”、“revokedGrantIds”、“maxAllowedGrants”和“preRecationActiveGrantCount”。调度是即发即忘的：失败将记录为“TriggerHook.Grant.LimitExceeded”审核日志条目，并且永远不会阻止身份验证响应。

### OIDC 提供商升级到 node-oidc-provider v9

**安全**

- 撤销不透明访问令牌现在也会撤销同一授权下的每个令牌，包括刷新令牌。在 v8 中，刷新令牌在撤销后仍然可用，并且可以继续请求新的访问令牌。

**更新**

- 撤销端点现在拒绝带有“unsupported_token_type”的 JWT 访问令牌，而不是像 v8 那样返回成功响应而不实际撤销任何内容。
- 添加了 RFC 8414 授权服务器元数据端点 (`/oidc/.well-known/oauth-authorization-server`)。
- 从令牌端点颁发的 ID 令牌中删除了冗余的“at_hash”声明。
- ID 令牌不再包含可选的“typ:“JWT””标头。 OpenID Connect 将 ID 令牌定义为 JWT，并且不需要客户端验证此标头。

**自定义 ID 令牌验证所需的操作**



使用官方 Logto SDK 时无需执行任何操作。如果您的集成执行自定义 ID 令牌验证：

- 如果它需要对令牌端点返回的 ID 令牌进行“at_hash”声明，请更新它以允许声明不存在。
- 如果需要 `typ: "JWT"` 标头，请更新它以允许标头不存在。

### HTTP框架升级至Koa 3

Logto 现在运行在 Koa 3 上，这是一个积极维护的版本系列，首先接收 Koa 的安全修复程序。预计行为不会发生变化：所有端点、OIDC 流和 API 响应的行为与以前完全相同。

## 错误修复和稳定性

### 安全性和 API 强化

- 内部应用程序机密不再通过管理 API 公开。
- 公共登录体验响应中不再返回电子邮件阻止列表策略。
- 现在，通过帐户 API 检索存储的第三方提供商访问令牌需要“身份”用户范围，以匹配其他社交和企业 SSO 身份端点。
- 帐户 API 验证码不再发送到被阻止的电子邮件地址。
- 电子邮件和电子邮件域验证现在匹配完整的值并强制执行更严格的域标签。

### 体验与账户中心

- 当社交或 SSO 注册流程被电子邮件访问规则拒绝时，确认错误现在会将用户返回到 Logto 登录页面，而不是导航回外部身份提供商。
- 用户通过帐户 API 绑定因素后，现在会自动启用 MFA。

### 数据完整性和存储

- 创建新的电子邮件或短信连接器现在可以在单个数据库事务中运行旧连接器的插入和清理。以前，两个语句之间的崩溃可能会留下重复的连接器。
- Redis 集群凭据现在采用百分比解码，因此当用户名或密码包含 URL 保留字符时连接会成功。
- 现在可以为使用“rediss”协议的 Redis 集群连接正确启用 TLS。

## 连接器

- **jose v6**：Apple、Google、OAuth 和 OIDC 连接器现在使用 jose 6，它在 Web Crypto API 而不是 Node 的加密模块上运行。令牌签名和 ID 令牌验证的行为与以前完全相同。
- **GitLab**：删除了未使用的“jose”依赖项，因此安装连接器不再拉入从未导入的包。
- **阿里云短信**：香港电话号码现在被视为海外号码。
- **阿里云短信验证服务（MAS）**：签名现在以自由文本形式输入，而不是下拉列表，因此如果阿里云再次轮换签名，签名仍然有效。

## 自托管和 OSS 注释

- **需要采取行动 - OIDC 提供商 SSRF 保护**：出站请求安全性得到加强，并且现在默认启用 SSRF 保护。需要到达专用网络上受信任的依赖方端点的自托管部署必须在启动 Logto 之前设置“OIDC_PROVIDER_SSRF_PROTECTION_DISABLED=true”；否则保持变量未设置。
- **需要数据库迁移**：此版本附带架构变更（自定义域验证文件，以及内部索引和表）。升级后，在启动新版本之前运行数据库变更命令（“@logto/cli”/core 映像中的“npm run alterdeploy”，或“logto db alterdeploy”）。请参阅[升级指南](https://docs.logto.io/logto-oss/upgrading-oss-version)。
- **自定义 ID 令牌验证**：请参阅上面的 node-oidc-provider v9 部分，了解“at_hash”和“typ”标头更改。

## 贡献者

非常感谢在此版本中提供工作的社区成员：

- [@Kathircpe](https://github.com/Kathircpe) - `Grant.LimitExceeded` webhook 事件 ([#9230](https://github.com/logto-io/logto/pull/9230)) 和交易无密码连接器替换 ([#9277](https://github.com/logto-io/logto/pull/9277))
- [@d4nyll](https://github.com/d4nyll) - Redis 集群凭证解码 ([#9145](https://github.com/logto-io/logto/pull/9145)) 和 `rediss` TLS 修复 ([#9144](https://github.com/logto-io/logto/pull/9144))
- [@sjh9714](https://github.com/sjh9714) - 阿里云短信香港号码处理 ([#9111](https://github.com/logto-io/logto/pull/9111))
- [@CertStone](https://github.com/CertStone) - 自由文本阿里云 SMS MAS 签名 ([#9228](https://github.com/logto-io/logto/pull/9228))

有关更改的完整列表，请参阅[完整更改日志](https://github.com/logto-io/logto/blob/master/packages/core/CHANGELOG.md)。

