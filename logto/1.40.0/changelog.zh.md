

<img width="2120" height="1192" alt="logto-changelog-2026-05" src="https://github.com/user-attachments/assets/417b6b55-1ddf-455d-a800-d6a1a4fe0489" />

## 亮点

- **审核日志时间范围选择器**：将审核日志范围限定在有界时间窗口（预设窗口加自定义范围），并由服务器端计数上限支持，以保持大容量租户的响应。
- **组织成员资格 Webhook 增量**：“Organization.Membership.Updated”现在准确报告添加或删除了哪些用户和应用程序。
- **大规模更快的组织**：新的二级索引和查询重写加快了大型租户的成员资格列表和每用户角色查找速度。
- **气隙和自托管友好性**：新的“--dapc”安装/种子标志和 DB-direct 管理员签名密钥消除了 OSS 部署的出站网络和 DNS 摩擦。
- **新连接器**：MailJunky电子邮件、短信宝短信和阿里云短信验证服务连接器，以及阿里云直邮区域和更丰富的WeCom配置文件。

## 新功能和增强功能

### 审计日志时间范围选择器

- 控制台审核日志页面现在附带一个时间范围选择器，默认窗口为过去 7 天。预设涵盖“过去 1 小时”/“过去 24 小时”/“过去 7 天”/“过去 30 天”，以及自定义日期范围。
- API 在“GET /api/logs”和“GET /api/hooks/{id}/recent-logs”上获取“start_time”和“end_time”查询参数（独占边界，unix 毫秒）。在 `GET /api/hooks/{id}/recent-logs` 上，提供任一边界将替换默认的 24 小时下限。
- `GET /api/logs` 和 `GET /api/hooks/{id}/recent-logs` 上的新 `enableCap=true` 查询参数可缩短约 10,000 行的计数查询，以降低超大日志量的 `statement_timeout` 风险。上限响应返回“Total-Number-Is-Capped: true”标头，在这种情况下，控制台会呈现上一个/下一个布局。默认行为（没有参数）保持不变。

### 组织成员资格 webhook 增量

- “Organization.Membership.Updated” Webhook 负载通过显式增量字段进行了丰富：跨用户和应用程序成员身份端点的“addedUserIds”/“removedUserIds”和“addedApplicationIds”/“removedApplicationIds”，以及邀请接受和即时配置（电子邮件域 JIT 和企业 SSO JIT）上的“addedUserIds”。
- 省略空的增量；每个增量数组的上限为 5000 个条目（通过“GET /organizations/:id/users”或“.../applications”协调批量更改）。这是一个附加的、非破坏性的更改 - 请参阅 [webhook 参考](https://docs.logto.io/developers/webhooks/webhooks-request#organizationmembershipupdated-payload)。

### 帐户 API：会话 `isCurrent`

- `GET /api/my-account/sessions` 现在在每个条目上返回 `isCurrent: boolean`，因此会话管理 UI 可以标记“此设备”条目并避免撤销调用者自己的会话。管理用户会话端点未更改。

### 大型组织的性能

- `GET /organizations/:id/users` 被重写为通过 `LATERAL` 子查询聚合角色，因此 `LIMIT` 在角色查找之前修剪用户集，而不是在每个页面上具体化完整的 `members × Roles` 连接。
- 新的二级索引加速反向查找：“organization_user_relations (tenant_id, user_id)”（在每次登录和会员中间件上命中）和“organization_role_user_relations (tenant_id,organization_id, user_id)”（通过“getUserScopes”和每用户角色联接命中）。
- `PUT /organizations/:id/users` 现在使用新的基于增量的 `replaceWithDelta()` 查询，该查询仅写入实际更改的行，保留其成员资格在更新后仍然存在的成员的角色分配。

### OpenAPI：准确的任意对象类型

- 任意 JSON 对象模式现在在 OpenAPI 文档中声明“additionalProperties: true”，因此生成的 TypeScript 客户端（例如“@logto/api”）将“customData”等字段类型设置为“{ [key: string]:unknown }”，而不是“Record<string, never>”。

## 错误修复和稳定性

### 经验

- **登录注册条款协议**：当协议政策为“仅手动注册”时，使用未注册的电子邮件或电话登录然后确认“创建新帐户”现在会在创建帐户之前提示条款协议，与专用注册和社交/SSO 流程相匹配。

### 账户中心



- **初始密码设置**：没有密码、没有主要电子邮件地址和主要电话号码的用户现在可以通过帐户 API 设置初始密码，无需验证记录。
- **静默重新身份验证**：出现用户信息错误（例如，在同一浏览器中切换用户后出现过时的访问令牌）时，帐户中心会使用“prompt=none”重新进行身份验证，而不是强制显示登录屏幕，仅当不存在有效会话时才回退到“prompt=login”。
- **过期会话**：过期的帐户中心会话现在可以干净地重定向，而不会出现手动登录错误。
- **社交链接回调**：社交链接回调通过 React Router 呈现，因此正确读取 `connectorId`，修复了虚假的“社交登录方法未启用”错误。
- **两步验证标签**：澄清了帐户中心两步验证切换标签。

### 国际化

- 修正了MFA经验短语中“Passkey”的中文翻译。

## 自托管和 OSS 注释

- **气隙管理设置 (`--dapc`)**：`install` 和 `db Seed` 命令接受新的 `--dapc` 标志（别名 `--disable-admin-pwned-password-check`）。它在禁用“我是否被入侵”违规检查的情况下为管理员密码策略播种，因此当“api.pwnedpasswords.com”无法访问时，第一个管理员注册不再挂起。
- **从数据库读取管理员签名密钥**：OSS 部署现在直接从数据库读取管理员租户签名密钥，删除了之前让容器通过外部端点获取其自己的管理员租户 OIDC 配置的额外主机/DNS 映射。
- **需要数据库迁移**：此版本附带架构更改（新的组织关系索引和其他内部列）。升级后，在启动新版本之前运行数据库变更命令（“@logto/cli”/core 映像中的“npm run alterdeploy”，或“logto db alterdeploy”）。请参阅[升级指南](https://docs.logto.io/logto-oss/upgrading-oss-version)。

## 连接器

- **新增 — MailJunky 电子邮件连接器**：通过 MailJunky 发送 API 发送事务验证电子邮件。
- **新增 — SMSBao 短信连接器**：通过 SMSBao 的国内短信验证流程。
- **新增-阿里云短信认证服务连接器**：添加阿里云短信认证（MAS）服务。
- **阿里云直邮区域**：阿里云DM连接器现在支持配置直邮区域。
- **WeCom**：通过额外的 API 调用获取更丰富的用户个人资料详细信息。
- **SMTP**：“auth”配置现在可以省略“user”和“pass”，因此可以配置按源（例如 IP/VLAN）授权的中继，而无需伪造凭据。
- **连接器套件**：加强电子邮件品牌 URL 检测，以避免点式缩写出现误报。

## 贡献者

非常感谢在此版本中提供工作的社区成员：

- [@devadarshh](https://github.com/devadarshh) — MailJunky 电子邮件连接器 ([#8638](https://github.com/logto-io/logto/pull/8638))
- [@wintbiit](https://github.com/wintbiit) — SMSBao 短信连接器 ([#8871](https://github.com/logto-io/logto/pull/8871))
- [@CertStone](https://github.com/CertStone) — 阿里云短信验证服务连接器 ([#8385](https://github.com/logto-io/logto/pull/8385))
- [@liyujun-dev](https://github.com/liyujun-dev) — WeCom 个人资料丰富 ([#8191](https://github.com/logto-io/logto/pull/8191))
- [@aayushbaluni](https://github.com/aayushbaluni) — 电子邮件 URL 检测修复 ([#8747](https://github.com/logto-io/logto/pull/8747))
- [@rotempasharel1](https://github.com/rotempasharel1) — 中文密钥翻译修复 ([#8870](https://github.com/logto-io/logto/pull/8870))
- [@taka-guevara](https://github.com/taka-guevara) — 帐户中心静默重新身份验证 ([#8785](https://github.com/logto-io/logto/pull/8785))
- [@darcyYe](https://github.com/darcyYe) — `--dapc` 气隙管理种子标志 ([#8859](https://github.com/logto-io/logto/pull/8859))
- [@chiche84](https://github.com/chiche84) — 原始组织成员资格 webhook 增量提案 ([#8752](https://github.com/logto-io/logto/pull/8752))

有关更改的完整列表，请参阅[完整更改日志](https://github.com/logto-io/logto/blob/master/packages/core/CHANGELOG.md)。

