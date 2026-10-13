## 更新亮点

- **自托管许可证权益（Self-Hosted Pro）**：通过许可证密钥为自托管 Logto 部署解锁高级功能，包括通过控制台成员和邮件邀请开展团队协作、移除 Logto 品牌标识、自定义登录界面（使用你自己的 UI）和 CSP、更高的 SAML 应用数量上限，以及在整个租户中强制要求控制台 MFA。
- **资源与作用域查询优化**：`GET /api/resources?includeScopes=true` 现在以线性时间匹配作用域，修复了资源数量较多的租户遇到的速度下降和数据库参数数量超限错误。管理 API 还支持 `excludeManagementApis=true`，防止控制台权限选择器超时。

## 新功能与增强

### 自托管许可证权益（Self-Hosted Pro）

自托管 Logto 部署现在可以安装并激活订阅许可证（例如 Self-Hosted Pro），在完全运行于自有基础设施的同时解锁高级能力。

- **安装和管理许可证**：直接在控制台的**租户设置 > 许可证**中安装或替换许可证，也可以通过管理 API（`PUT /api/systems/license` 和 `GET /api/systems/license`）自动完成。已安装的密钥通过 ES256 签名和 Logto 内置公钥进行离线验证。
- **许可证状态与宽限期**：查看当前套餐、环境（生产或非生产）、到期日期和每周自动刷新状态。如果许可证过期或无法刷新，30 天的宽限期会让功能继续运行，同时通过控制台中的全局警告提醒管理员；宽限期结束后，功能会回退到 OSS 默认配置。
- **从 Cloud 控制台获取密钥**：拥有有效自托管订阅的用户可以直接在 Logto Cloud 控制台的账户菜单中查看许可证，并复制生产和非生产环境密钥，无需创建 Cloud 租户。
- **解锁的权益**：
  - **控制台成员与邀请**：邀请其他管理员管理自托管部署。邀请邮件通过默认租户的邮件连接器发送，并附有安全的一次性账户设置链接。
  - **移除 Logto 品牌标识**：在登录体验中隐藏“Powered by Logto”。
  - **自定义登录界面和 CSP**：使用自己的存储上传自定义登录界面包，并自定义内容安全策略响应头。
  - **扩展 SAML 应用数量**：将 SAML 应用数量上限提高到超过开源默认值。
  - **强制控制台 MFA**：要求所有访问控制台的管理员使用多重身份验证。

设置步骤和详细信息参见[自托管许可证](https://docs.logto.io/logto-oss/self-hosted-license)。

### API 资源查询优化

- **线性时间的作用域匹配**：在 `GET /api/resources?includeScopes=true` 中，使用 `Map.groupBy` 和 PostgreSQL 数组绑定（`= ANY(...)`）将作用域匹配到 API 资源，现在以线性时间完成。这消除了二次时间复杂度导致的速度下降，并解决了资源超过 65,535 个的租户遇到的失败问题（[#9715](https://github.com/logto-io/logto/pull/9715)）。
- **排除管理 API 资源**：`GET /api/resources` 现在接受 `excludeManagementApis` 查询参数，在数据库层面筛除内部 Logto 管理 API 资源。第三方应用、动态应用、组织角色和用户角色的控制台权限选择器现在使用这一筛选条件，不再将所有资源加载到浏览器中，从而避免资源较多的租户遇到界面超时（[#9716](https://github.com/logto-io/logto/pull/9716)）。

## 错误修复与稳定性

### 文档

- **Next.js App Router 指南**：更新 Next.js App Router 快速入门中的 `app/page.tsx` 示例，将 `Home` 声明为 `async` 组件，修复 TypeScript 错误 `TS1308`（[#9692](https://github.com/logto-io/logto/pull/9692)）。感谢 [@timokoethe](https://github.com/timokoethe)。

## 贡献者

衷心感谢在本次发布中贡献代码的社区成员：

- [@timokoethe](https://github.com/timokoethe) - 修正 Next.js App Router 指南中的异步首页组件（[#9692](https://github.com/logto-io/logto/pull/9692)）（首次贡献）

**完整 Changelog**：https://github.com/logto-io/logto/compare/v1.44.0...v1.45.0
