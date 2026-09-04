![logto-changelog-2025-01](https://github.com/user-attachments/assets/97d81f2e-6369-40e8-9a3d-ea4cf5a9cb84)

## 亮点

- **通配符重定向 URI**：在预览部署等动态环境的重定向 URI 中支持通配符模式 (`*`)，使开发工作流程更加轻松。 （感谢 [@Arochka](https://github.com/Arochka)！）
- **令牌交换应用程序级控制**：对每个应用程序的令牌交换授予类型进行细粒度控制，M2M 应用程序现在支持此功能。
- **信任未经验证的电子邮件进行 SSO**：OIDC 社交连接器和企业 SSO 连接器现在可以同步电子邮件，即使“email_verified”丢失或错误也是如此。

## 新功能和增强功能

### 重定向 URI 中的通配符模式

在重定向 URI 中添加了对通配符模式 (`*`) 的支持，以更好地支持预览部署等动态环境。 （由 [@Arochka](https://github.com/Arochka) 在 [#8094](https://github.com/logto-io/logto/pull/8094) 中贡献）

规则（仅限网络）：
- 主机名和/或路径名中的 http/https 重定向 URI 允许使用通配符
- 方案、端口、查询和哈希中拒绝通配符
- 主机名通配符模式必须至少包含一个点，以避免模式过于宽泛

### 具有应用程序级控制的令牌交换授予类型

- 在“customClientMetadata”中添加“allowTokenExchange”字段来控制应用程序是否可以发起令牌交换请求
- 机器对机器应用程序现在支持令牌交换
- 所有新应用程序将默认禁用代币交换；在应用程序设置中启用它
- 为了向后兼容，现有的第一方传统、本机和 SPA 应用程序将启用此功能
- 第三方应用程序不允许使用代币兑换
- 在控制台中添加了 UI 切换，并为公共客户端（SPA/本机应用程序）提供风险警告

### 信任 OIDC 连接器的未经验证的电子邮件

- 将“trustUnverifiedEmail”添加到 OIDC 社交连接器配置（默认“false”），以允许在“email_verified”丢失或为 false 时同步电子邮件
- 应用核心 OIDC/Azure OIDC SSO 连接器中的设置并将其公开在管理控制台中

### 跳过社交登录所需的标识符

新选项“skipRequiredIdentifiers”可用于社交登录和注册流程。启用后，用户可以在社交登录和注册期间绕过强制标识符收集步骤。

这对于 iOS 应用程序特别有用，因为 Apple App Store 指南要求社交登录选项（例如“使用 Apple 登录”）不应要求收集除社交 IdP 提供的信息之外的其他信息。

在 Logto 控制台中，此选项表示为“社交登录”部分下标记为“要求用户提供缺少的注册标识符”的复选框。

### 用户角色 API 改进

- POST `/users/:userId/roles` 现在返回 `{ roleIds: string[]; addRoleIds: string[] }` 其中 `roleIds` 回显请求的 ID，而 `addedRoleIds` 仅包含新创建的 ID
- PUT `/users/:userId/roles` 现在返回 `{ roleIds: string[] }` 以确认最终分配的角色

### @logto/api SDK 增强

添加了用于自定义令牌身份验证的 createApiClient 函数。这个新功能允许您使用自己的令牌检索逻辑创建类型安全的 API 客户端，这对于自定义身份验证流程等场景非常有用。

## 错误修复和稳定性

### Postgres语句超时配置

允许禁用 Postgres `statement_timeout` 以实现 PgBouncer/RDS 代理兼容性：
- 设置`DATABASE_STATEMENT_TIMEOUT=DISABLE_TIMEOUT`以省略启动参数

### 企业 SSO 错误代码修复

修复了企业 SSO 帐户不存在错误代码以使用特定帐户而不是通用社交帐户错误。

### JIT 电子邮件域分页修复

从“GET /organizations/:id/jit/email-domains”中删除了默认分页，以确保在控制台的组织详细信息页面中返回所有 JIT 电子邮件域。

### 直接登录稳定性

防止直接登录页面上重复的自动登录请求，这可能会在某些情况下导致意外行为。

### 控制台审核日志修复

- 从控制台审核日志过滤器菜单中删除了已弃用的交互日志事件
- 修复了导致多个事件的筛选结果为空的下拉事件键拼写错误

