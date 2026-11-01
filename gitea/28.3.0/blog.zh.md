---
title: Gitea 28.3.0 官方发布博客（中文）
description: Gitea 28.3.0 正式发布博客的完整简体中文翻译。
---

# Gitea 28.3.0 正式发布

作者：bircni、silverwind · 博客发布日期（UTC）：2026-11-01

> 本文为 [Gitea 官方发布博客](https://blog.gitea.com/release-of-28.3.0/) 的非官方简体中文翻译，由 ChatGPT 翻译，保留原文结构、代码与链接。原文及源代码来自 [Gitea Blog](https://gitea.com/gitea/blog/src/branch/main/content/post/gitea/release-of-28.3.0.md)，按 [Apache-2.0](../../licenses/gitea-blog-apache-2.0.md) 许可使用。本译文的修改为中文翻译；原作者署名如上。文中的历史版本更新日志属于博客原文，博客日期与 GitHub Release 日期分别保留。

我们很高兴宣布发布 **Gitea 28.3.0**，这是 28 系列的第三个维护版本。它包含大量主要涉及令牌作用域的安全修复，以及针对 Actions、工单、拉取请求和软件包的问题修复与性能改进。强烈建议所有用户尽快升级。

<!--more-->

## 安全

此版本修复以下安全漏洞，请尽快升级。

- [CVE-2026-111943](https://go.dev/issue/82345)：发布的二进制文件现使用 Go 1.27.3 构建。由于签发证书的证书颁发机构存在安全隐患，该版本不再信任一组中间证书。这会影响 Gitea 对外连接的证书检查，例如连接 OAuth2 提供方、webhook、镜像和迁移来源时的证书检查。 由 [#39881](https://github.com/go-gitea/gitea/pull/39881) / [#39896](https://github.com/go-gitea/gitea/pull/39896) 更新。
- [CVE-2026-120263](https://github.com/go-gitea/gitea/security/advisories/GHSA-8p3x-w464-4g6v)：在设置 `ACCOUNT_LINKING = auto` 且开放注册时，关联账户的注册表单允许已通过 OAuth2 提供方登录的用户输入现有账户的用户名或电子邮件地址，随后将该账户与外部身份关联，并在无需密码的情况下登录。Gitea 现在仅自动关联外部身份的电子邮件地址或用户名所指向的账户。 由 [#40121](https://github.com/go-gitea/gitea/pull/40121) / [#40137](https://github.com/go-gitea/gitea/pull/40137) 修复。 感谢 [@adrian-doyensec](https://github.com/adrian-doyensec)，[@AdamKorcz](https://github.com/AdamKorcz)，[@DshtAnger](https://github.com/DshtAnger) 和 [@ivantsepp](https://github.com/ivantsepp) 报告问题，并感谢 [@bircni](https://github.com/bircni) 提供补丁。
- [CVE-2026-118386](https://github.com/go-gitea/gitea/security/advisories/GHSA-32h8-5xqg-h466)：对于 head 分支位于同一仓库中的拉取请求，具有读取权限的用户可以提交一份评审，将其中的 `commit_id` 指向自己的提交。随后，系统会从该提交中读取 `pull_request_review` 工作流，并在未经批准的情况下，使用仓库密钥和具有仓库写入权限的令牌运行。评审触发的工作流现在在拉取请求的 head 提交上运行。 由 [#40099](https://github.com/go-gitea/gitea/pull/40099) / [#40117](https://github.com/go-gitea/gitea/pull/40117) 修复。 感谢 Anthropic 报告问题，并感谢 [@silverwind](https://github.com/silverwind) 提供补丁。
- [CVE-2026-117635](https://github.com/go-gitea/gitea/security/advisories/GHSA-37xv-m4w7-j2fh)：管理员 API 未应用 `public-only` 令牌限制，因此站点管理员的 public-only 令牌可以列出所有用户的电子邮件地址、创建私有组织和 Runner 注册令牌，以及创建新的管理员。 由 [#39690](https://github.com/go-gitea/gitea/pull/39690) / [#39853](https://github.com/go-gitea/gitea/pull/39853) 修复。 感谢 [@assakafpix](https://github.com/assakafpix) 和 [@torjan0](https://github.com/torjan0) 报告问题，并感谢 [@silverwind](https://github.com/silverwind) 提供补丁。
- [CVE-2026-119441](https://github.com/go-gitea/gitea/security/advisories/GHSA-jh8p-x4ch-389q)：`DELETE /api/v1/orgs/{org}/repos` 未拒绝 public-only 令牌，因此组织所有者的此类令牌能够删除该组织的全部仓库，包括私有仓库。 由 [#39690](https://github.com/go-gitea/gitea/pull/39690) / [#39853](https://github.com/go-gitea/gitea/pull/39853) 修复。 感谢 [@K3y5tr0ke](https://github.com/K3y5tr0ke) 报告问题，并感谢 [@silverwind](https://github.com/silverwind) 提供补丁。
- [CVE-2026-116296](https://github.com/go-gitea/gitea/security/advisories/GHSA-6h2f-c8jm-84hc)：Release、里程碑和标签 API 路由未拒绝对已归档仓库的更改，因此具有写入权限的用户能够替换 Release 附件、删除 Release，以及更改已归档仓库的里程碑和标签。API 现在拒绝对已归档仓库中的工单、评论、标签、里程碑和 Release 进行更改。 由 [#39942](https://github.com/go-gitea/gitea/pull/39942) / [#40085](https://github.com/go-gitea/gitea/pull/40085) 修复。 感谢 [@Yusufbek10](https://github.com/Yusufbek10) 和 [@thalewalan](https://github.com/thalewalan) 报告问题，并感谢 [@bircni](https://github.com/bircni) 提供补丁。
- [CVE-2026-117685](https://github.com/go-gitea/gitea/security/advisories/GHSA-8g99-g36h-5p2w)：OCI 跨仓库 blob 挂载使用用户的完整权限，而非令牌权限检查对源 blob 的访问，因此 public-only 软件包令牌能够将私有 blob 挂载到公共软件包中并读取它。 由 [#39690](https://github.com/go-gitea/gitea/pull/39690) / [#39853](https://github.com/go-gitea/gitea/pull/39853) 修复。 感谢 [@ohxorud-dev](https://github.com/ohxorud-dev) 报告问题，并感谢 [@silverwind](https://github.com/silverwind) 提供补丁。
- [CVE-2026-113429](https://github.com/go-gitea/gitea/security/advisories/GHSA-9v6p-xpcp-7488)：旧版 Actions 产物上传未检查便存储 `Content-Encoding` 请求头，并在下载时将其作为 `Content-Type` 返回。因此，工作流可以上传一个产物，在受害者打开下载链接时，该产物会在 Gitea 的源站下被渲染为 HTML，形成存储型 XSS。现在不再存储该请求头。 由 [#39855](https://github.com/go-gitea/gitea/pull/39855) / [#39996](https://github.com/go-gitea/gitea/pull/39996) 修复。 感谢 [@yagcioglutoprak](https://github.com/yagcioglutoprak) 报告问题，并感谢 [@basavaraj-sm05](https://github.com/basavaraj-sm05) 提供补丁。
- [CVE-2026-118394](https://github.com/go-gitea/gitea/security/advisories/GHSA-q9gm-9c7q-c5hq)：OIDC userinfo 端点仅从 `Authorization` 请求头读取令牌作用域，因此通过查询参数发送的 public-only 令牌会在 `groups` 声明中收到用户的私有组织和团队信息。 由 [#39690](https://github.com/go-gitea/gitea/pull/39690) / [#39853](https://github.com/go-gitea/gitea/pull/39853) 修复。 感谢 [@N0K0](https://github.com/N0K0) 报告问题，[@lunny](https://github.com/lunny) 进行分析，并感谢 [@silverwind](https://github.com/silverwind) 提供补丁。
- [CVE-2026-119625](https://github.com/go-gitea/gitea/security/advisories/GHSA-3fv3-hhmm-4x2q)：`/{username}` 接受通过 HTTP Basic 发送的令牌，却未检查其作用域。因此，具有无关作用域的令牌能够通过用户订阅源（`.rss` / `.atom`）读取所有者的私有活动，而 public-only 令牌能够在个人资料页上看到私有仓库和组织。个人资料页现在将令牌请求视为匿名请求，用户和组织订阅源则要求 `read:user` 或 `read:organization`。 由 [#39945](https://github.com/go-gitea/gitea/pull/39945) / [#40115](https://github.com/go-gitea/gitea/pull/40115) 修复。 感谢 [@carfeii](https://github.com/carfeii)，[@DshtAnger](https://github.com/DshtAnger)，[@manus-pi](https://github.com/manus-pi) 和 [@cruzzer](https://github.com/cruzzer) 报告问题，[@lunny](https://github.com/lunny) 进行分析，并感谢 [@bircni](https://github.com/bircni) 提供补丁。
- [CVE-2026-119627](https://github.com/go-gitea/gitea/security/advisories/GHSA-5j4v-rwqr-vpq7)：具有有限可见性的用户和组织，其网页资料页及 RSS/Atom 订阅源会向 public-only 令牌展示。 由 [#39690](https://github.com/go-gitea/gitea/pull/39690) / [#39853](https://github.com/go-gitea/gitea/pull/39853) 和 [#39945](https://github.com/go-gitea/gitea/pull/39945) / [#40115](https://github.com/go-gitea/gitea/pull/40115) 修复。 感谢 [@manus-pi](https://github.com/manus-pi) 报告问题，并感谢 [@silverwind](https://github.com/silverwind) 和 [@bircni](https://github.com/bircni) 提供补丁。
- [CVE-2026-112887](https://github.com/go-gitea/gitea/security/advisories/GHSA-8r36-6j2c-3gmv)：Actions 任务令牌不携带令牌作用域，而仓库筛选将 Actions 系统用户的负数 ID 视为“不按所有者筛选”，因此作业的 `GITEA_TOKEN` 可以通过 `GET /api/v1/user/repos` 列出实例中的全部私有仓库。系统用户现在不拥有任何资源，且 `/api/v1/user` 路由仅接受个人账户和机器人账户。 由 [#39945](https://github.com/go-gitea/gitea/pull/39945) / [#40115](https://github.com/go-gitea/gitea/pull/40115) 修复。 感谢 [@csidhant](https://github.com/csidhant) 报告问题，并感谢 [@bircni](https://github.com/bircni) 提供补丁。
- [CVE-2026-116474](https://github.com/go-gitea/gitea/security/advisories/GHSA-mf6p-vqpw-3r7x)：作业的 `GITEA_TOKEN` 能够向 `gitea-actions` 系统用户添加电子邮件地址和 GPG 密钥，从而使使用该密钥签名的提交显示为由实例签名。影响仅限于显示的签名状态。 由 [#39945](https://github.com/go-gitea/gitea/pull/39945) / [#40115](https://github.com/go-gitea/gitea/pull/40115) 修复。 感谢 Anthropic 报告问题，并感谢 [@bircni](https://github.com/bircni) 提供补丁。
- [CVE-2026-116289](https://github.com/go-gitea/gitea/security/advisories/GHSA-qcgm-ggp8-22qc)：组织所有者具有 `write:organization` 的 public-only 令牌能够创建组织 Runner 注册令牌。使用该令牌注册的 Runner 随后能够接收组织私有仓库的作业，包括其中的密钥。 由 [#39690](https://github.com/go-gitea/gitea/pull/39690) / [#39853](https://github.com/go-gitea/gitea/pull/39853) 修复。 感谢 [@kimc0gi](https://github.com/kimc0gi) 报告问题，并感谢 [@silverwind](https://github.com/silverwind) 提供补丁。
- [CVE-2026-117646](https://github.com/go-gitea/gitea/security/advisories/GHSA-wxcq-p34j-7cjj)：用户资料页中的仓库、星标和关注标签页，以及组织首页，会向 public-only 令牌显示私有仓库。 由 [#39690](https://github.com/go-gitea/gitea/pull/39690) / [#39853](https://github.com/go-gitea/gitea/pull/39853) 修复。 感谢 [@nicetrykiddo](https://github.com/nicetrykiddo) 和 [@d3do-23](https://github.com/d3do-23) 报告问题，并感谢 [@silverwind](https://github.com/silverwind) 提供补丁。
- [CVE-2026-118395](https://github.com/go-gitea/gitea/security/advisories/GHSA-x5v4-836g-f95x)：已弃用的 `POST /api/v1/org/{org}/repos` 路由未拒绝 public-only 令牌，因此此类令牌能够在组织中创建私有仓库。 由 [#39690](https://github.com/go-gitea/gitea/pull/39690) / [#39853](https://github.com/go-gitea/gitea/pull/39853) 修复。 感谢 [@DshtAnger](https://github.com/DshtAnger)，[@tao0845](https://github.com/tao0845)，[@d3do-23](https://github.com/d3do-23)，[@venkatchalla06](https://github.com/venkatchalla06) 和 [@shmulc8](https://github.com/shmulc8) 报告问题，并感谢 [@silverwind](https://github.com/silverwind) 提供补丁。
- [CVE-2026-114199](https://github.com/go-gitea/gitea/security/advisories/GHSA-jr76-w9m3-3p68)：`GET /api/v1/users/{username}/heatmap` 会为 public-only 令牌统计对私有仓库的贡献。 由 [#39690](https://github.com/go-gitea/gitea/pull/39690) / [#39853](https://github.com/go-gitea/gitea/pull/39853) 修复。 感谢 [@d3do-23](https://github.com/d3do-23) 报告问题，并感谢 [@silverwind](https://github.com/silverwind) 提供补丁。
- [CVE-2026-117649](https://github.com/go-gitea/gitea/security/advisories/GHSA-p86q-78gw-8f3f)：工单时间线会向无读取权限的用户展示作为依赖项关联的私有工单：网页显示其标题，API 则返回包括正文在内的完整工单。 由 [#39942](https://github.com/go-gitea/gitea/pull/39942) / [#40085](https://github.com/go-gitea/gitea/pull/40085) 修复。 感谢 [@d3do-23](https://github.com/d3do-23)，[@kaveeshanirmal141](https://github.com/kaveeshanirmal141)，[@manus-pi](https://github.com/manus-pi)，[@baek9](https://github.com/baek9)，[@bruhdev1290](https://github.com/bruhdev1290) 和 [@yagcioglutoprak](https://github.com/yagcioglutoprak) 报告问题，[@lunny](https://github.com/lunny) 进行分析，并感谢 [@bircni](https://github.com/bircni) 提供补丁。
- [CVE-2026-119533](https://github.com/go-gitea/gitea/security/advisories/GHSA-c45m-jm46-mwxg)：项目看板会向无读取权限的访客显示引用了看板内工单的私有拉取请求的标题、编号、状态及所属仓库。 由 [#40016](https://github.com/go-gitea/gitea/pull/40016) / [#40134](https://github.com/go-gitea/gitea/pull/40134) 修复。 感谢 [@GrimTheRipper-SOSECURE](https://github.com/GrimTheRipper-SOSECURE)，[@bruhdev1290](https://github.com/bruhdev1290) 和 [@yagcioglutoprak](https://github.com/yagcioglutoprak) 报告问题，[@lunny](https://github.com/lunny) 进行分析，并感谢 [@basavaraj-sm05](https://github.com/basavaraj-sm05) 提供补丁。
- [CVE-2026-118504](https://github.com/go-gitea/gitea/security/advisories/GHSA-vmrc-8q2x-573x)：若干工单 API 路由未拒绝对已归档仓库的更改，因此具有写入权限的用户仍能更改已归档仓库中的截止时间、已记录工时、计时器、表情回应、固定状态和阻塞工单。28.2.0 已阻止编辑、删除和重新标记工单，本版本覆盖所有剩余的工单路由。 由 [#39942](https://github.com/go-gitea/gitea/pull/39942) / [#40085](https://github.com/go-gitea/gitea/pull/40085) 修复。 感谢 [@DevNoScope](https://github.com/DevNoScope) 和 [@nithissh7](https://github.com/nithissh7) 报告问题，并感谢 [@bircni](https://github.com/bircni) 提供补丁。
- [CVE-2026-117677](https://github.com/go-gitea/gitea/security/advisories/GHSA-r6mh-qg79-rqj2)：Helm chart 上传在检查软件包大小配额前便解压整个归档，且没有大小限制。因此，具有软件包写入权限的用户可以通过体积很小但高度压缩的上传内容耗尽服务器资源。现在已限制解压后的数据量。 由 [#39942](https://github.com/go-gitea/gitea/pull/39942) / [#40085](https://github.com/go-gitea/gitea/pull/40085) 修复。 感谢 [@skeletonsec](https://github.com/skeletonsec)，[@jisung-02](https://github.com/jisung-02) 和 [@kewmine](https://github.com/kewmine) 报告问题，并感谢 [@bircni](https://github.com/bircni) 提供补丁。

感谢所有以负责任的方式披露这些问题的安全研究人员。

## 重要修复

### Actions

- 已禁用 Actions 的仓库作业不再由 Runner 领取（[#40106](https://github.com/go-gitea/gitea/pull/40106)），请求的产物保留期限受到限制（[#39894](https://github.com/go-gitea/gitea/pull/39894)），成功的 Runner 令牌验证结果会被缓存（[#39934](https://github.com/go-gitea/gitea/pull/39934)）。
- 移除一个不需要的索引，使 SQLite 在管理员作业队列等页面上不再读取几乎所有作业行（[#40055](https://github.com/go-gitea/gitea/pull/40055)）。

### 工单与拉取请求

- 工单与拉取请求仪表盘及仓库列表速度提升，相关表索引得到修复（[#40001](https://github.com/go-gitea/gitea/pull/40001)、[#40114](https://github.com/go-gitea/gitea/pull/40114)）；加载提交状态时只加载一次仓库（[#39930](https://github.com/go-gitea/gitea/pull/39930)）。
- 拒绝对已锁定的拉取请求添加评审评论（[#39960](https://github.com/go-gitea/gitea/pull/39960)）；编辑评审评论时同步更新评审正文（[#40058](https://github.com/go-gitea/gitea/pull/40058)）；默认合并消息遵循最大审批者数量限制（[#40118](https://github.com/go-gitea/gitea/pull/40118)）；使用不存在的提交提交评审时，不再破坏其拉取请求中的行内评论（[#39849](https://github.com/go-gitea/gitea/pull/39849)）。
- 时间线等工单 API 端点不再向仅有工单读取权限的用户展示拉取请求，反之亦然（[#39885](https://github.com/go-gitea/gitea/pull/39885)）；按名称添加标签时不再同时附加仓库标签和组织标签（[#39873](https://github.com/go-gitea/gitea/pull/39873)）；编辑时省略里程碑截止日期会保留原日期（[#39869](https://github.com/go-gitea/gitea/pull/39869)）。
- 启用内置工单跟踪器时，工单不再重定向至外部跟踪器（[#39997](https://github.com/go-gitea/gitea/pull/39997)）；按互斥标签顺序排序时，每个工单仅保留一行（[#39364](https://github.com/go-gitea/gitea/pull/39364)）；项目看板的里程碑筛选器仅列出在该项目中有工单的里程碑（[#39958](https://github.com/go-gitea/gitea/pull/39958)）。

### 仓库、Git 与订阅源

- 贡献者统计不再卡住（[#40125](https://github.com/go-gitea/gitea/pull/40125)）；Git 维护默认使用 `gc` 策略（[#40022](https://github.com/go-gitea/gitea/pull/40022)）；重命名文件的差异会加载两个 blob（[#39969](https://github.com/go-gitea/gitea/pull/39969)）。
- 没有 Release 访问权限时，标签订阅源会隐藏发布说明（[#39944](https://github.com/go-gitea/gitea/pull/39944)）；仓库首页分支订阅源要求代码读取权限（[#39964](https://github.com/go-gitea/gitea/pull/39964)）。
- 对组织遵循 `ALLOW_FORK_INTO_SAME_OWNER` 设置（[#40025](https://github.com/go-gitea/gitea/pull/40025)）；文件视图、blame 和编辑器使用当前所查看 ref 的 `.editorconfig`（[#39973](https://github.com/go-gitea/gitea/pull/39973)）；仓库文件已存在于磁盘时，API 返回 409（[#40095](https://github.com/go-gitea/gitea/pull/40095)）。

### 账户、软件包与迁移

- 解码通过 HTTP Basic 认证发送的表单编码 OAuth2 客户端凭据（[#39926](https://github.com/go-gitea/gitea/pull/39926)）；在 `gitea admin user list` 和管理员用户 API 中列出机器人用户（[#40060](https://github.com/go-gitea/gitea/pull/40060)）；系统用户不再能够关注仓库（[#39886](https://github.com/go-gitea/gitea/pull/39886)）。
- 拒绝包含换行符的 RubyGems 依赖元数据（[#39782](https://github.com/go-gitea/gitea/pull/39782)）。
- GitHub 工单迁移使用游标分页（[#39888](https://github.com/go-gitea/gitea/pull/39888)），并恢复对 OneDev 16.8 及更新版本的迁移支持（[#40017](https://github.com/go-gitea/gitea/pull/40017)）。

### 依赖

- `golang.org/x/net` 更新至 v0.62.0（[#40050](https://github.com/go-gitea/gitea/pull/40050)）。

本版本包含 [60 个已合并的拉取请求](https://github.com/go-gitea/gitea/pulls?q=is%3Apr+milestone%3A28.3.0+is%3Amerged)，感谢社区的出色贡献。

## 如何安装或更新

请从 [Gitea 下载页面](https://dl.gitea.com/gitea/28.3.0/) 下载预构建的二进制文件，并确保选择与您的平台兼容的版本。如需安装或升级的分步指南，请参阅[安装文档](https://docs.gitea.com/category/installation)。

## 特别感谢

我们也感谢所有在 [Open Collective](https://opencollective.com/gitea) 上为我们提供资金支持的支持者。

## 更新日志

## [28.3.0](https://github.com/go-gitea/gitea/releases/tag/v28.3.0) - 2026-11-01

### 增强

- 改进彩色按钮组的悬停边框 ([#39861](https://github.com/go-gitea/gitea/pull/39861)) ([#39899](https://github.com/go-gitea/gitea/pull/39899))
- *(webhook)* 在通知中包含 Release 附件信息 ([#39631](https://github.com/go-gitea/gitea/pull/39631)) ([#39912](https://github.com/go-gitea/gitea/pull/39912))
- *(project)* 按关联工单筛选项目里程碑 ([#39958](https://github.com/go-gitea/gitea/pull/39958)) ([#39984](https://github.com/go-gitea/gitea/pull/39984))

### 性能

- *(actions)* 缓存成功的 Runner 令牌验证结果 ([#39934](https://github.com/go-gitea/gitea/pull/39934)) ([#39959](https://github.com/go-gitea/gitea/pull/39959))
- *(actions)* Is_reusable_caller 索引导致 SQLite 读取几乎所有作业行 ([#40055](https://github.com/go-gitea/gitea/pull/40055)) ([#40064](https://github.com/go-gitea/gitea/pull/40064))
- 加快工单与拉取请求仪表盘，并修复表索引 ([#40001](https://github.com/go-gitea/gitea/pull/40001)) ([#40096](https://github.com/go-gitea/gitea/pull/40096))
- 加快仓库工单和拉取请求列表 ([#40114](https://github.com/go-gitea/gitea/pull/40114)) ([#40132](https://github.com/go-gitea/gitea/pull/40132))
- *(pull)* 为所有提交状态仅加载一次仓库 ([#39930](https://github.com/go-gitea/gitea/pull/39930)) ([#40135](https://github.com/go-gitea/gitea/pull/40135))

### 问题修复

- *(pulls)* 容忍已存储评审中无效的 commit_id ([#39849](https://github.com/go-gitea/gitea/pull/39849)) ([#39857](https://github.com/go-gitea/gitea/pull/39857))
- *(api)* 未提供标签筛选条件时，ListIssues 跳过标签查找 ([#39890](https://github.com/go-gitea/gitea/pull/39890)) ([#39893](https://github.com/go-gitea/gitea/pull/39893))
- 禁止系统用户关注仓库 ([#39886](https://github.com/go-gitea/gitea/pull/39886)) ([#39895](https://github.com/go-gitea/gitea/pull/39895))
- 修复代码评论补丁中偏差一位的错误 ([#39887](https://github.com/go-gitea/gitea/pull/39887)) ([#39904](https://github.com/go-gitea/gitea/pull/39904))
- 解析 Git 版本失败时使用明确的错误消息 ([#39898](https://github.com/go-gitea/gitea/pull/39898)) ([#39903](https://github.com/go-gitea/gitea/pull/39903))
- *(packages)* 拒绝包含换行符的 RubyGems 依赖元数据 ([#39782](https://github.com/go-gitea/gitea/pull/39782)) ([#39900](https://github.com/go-gitea/gitea/pull/39900))
- 在更多路由上强制执行 public-only 令牌作用域限制 ([#39690](https://github.com/go-gitea/gitea/pull/39690)) ([#39853](https://github.com/go-gitea/gitea/pull/39853))
- *(api)* fork 仓库名无效时返回 4xx ([#39909](https://github.com/go-gitea/gitea/pull/39909)) ([#39919](https://github.com/go-gitea/gitea/pull/39919))
- *(lfs)* 在批量下载请求中将默认分支作为 ref 发送 ([#39891](https://github.com/go-gitea/gitea/pull/39891)) ([#39920](https://github.com/go-gitea/gitea/pull/39920))
- *(api)* 编辑请求未指定里程碑截止日期时保留原日期 ([#39869](https://github.com/go-gitea/gitea/pull/39869)) ([#39921](https://github.com/go-gitea/gitea/pull/39921))
- *(oauth2)* 解码 HTTP Basic 认证中经过表单编码的客户端凭据 ([#39926](https://github.com/go-gitea/gitea/pull/39926)) ([#39931](https://github.com/go-gitea/gitea/pull/39931))
- *(issues)* 按互斥标签顺序排序时，每个工单只保留一行 ([#39364](https://github.com/go-gitea/gitea/pull/39364)) ([#39928](https://github.com/go-gitea/gitea/pull/39928))
- *(api)* 在工单子资源端点检查单元读取权限 ([#39885](https://github.com/go-gitea/gitea/pull/39885)) ([#39938](https://github.com/go-gitea/gitea/pull/39938))
- *(migrations)* GitHub 工单迁移也使用游标分页 ([#39888](https://github.com/go-gitea/gitea/pull/39888)) ([#39941](https://github.com/go-gitea/gitea/pull/39941))
- *(feed)* 没有 Release 访问权限时，在标签订阅源中隐藏发布说明 ([#39944](https://github.com/go-gitea/gitea/pull/39944)) ([#39949](https://github.com/go-gitea/gitea/pull/39949))
- *(api)* 修复按名称添加工单标签时同时附加仓库标签和组织标签的问题 ([#39873](https://github.com/go-gitea/gitea/pull/39873)) ([#39951](https://github.com/go-gitea/gitea/pull/39951))
- *(actions)* 限制请求的产物保留期限 ([#39894](https://github.com/go-gitea/gitea/pull/39894)) ([#39946](https://github.com/go-gitea/gitea/pull/39946))
- *(actions)* 丢弃 v1 产物上传中不受信任的 Content-Encoding ([#39855](https://github.com/go-gitea/gitea/pull/39855)) ([#39996](https://github.com/go-gitea/gitea/pull/39996))
- 确保 diff_hunk 和 Composer readme 使用有效的 UTF-8 ([#39932](https://github.com/go-gitea/gitea/pull/39932)) ([#40000](https://github.com/go-gitea/gitea/pull/40000))
- *(diff)* 加载重命名文件的两个 blob 以渲染差异 ([#39969](https://github.com/go-gitea/gitea/pull/39969)) ([#39992](https://github.com/go-gitea/gitea/pull/39992))
- *(migrations)* 更新 Gitea SDK，修复空指针 panic ([#39999](https://github.com/go-gitea/gitea/pull/39999))
- 修复从 OneDev 16.8 及更新版本迁移的问题 ([#40017](https://github.com/go-gitea/gitea/pull/40017)) ([#40026](https://github.com/go-gitea/gitea/pull/40026))
- *(git)* 默认使用 gc 维护策略 ([#40022](https://github.com/go-gitea/gitea/pull/40022)) ([#40029](https://github.com/go-gitea/gitea/pull/40029))
- 将工单／评论内容中的空字符替换为空格 ([#40014](https://github.com/go-gitea/gitea/pull/40014)) ([#40034](https://github.com/go-gitea/gitea/pull/40034))
- *(issue)* 启用内置工单跟踪器时，禁止重定向到外部跟踪器 ([#39997](https://github.com/go-gitea/gitea/pull/39997)) ([#40031](https://github.com/go-gitea/gitea/pull/40031))
- *(markup)* 将提交标题中的表情符号保留在链接内 ([#39986](https://github.com/go-gitea/gitea/pull/39986)) ([#40032](https://github.com/go-gitea/gitea/pull/40032))
- *(repo)* 文件视图、blame 和编辑器使用当前所查看 ref 的 editorconfig ([#39973](https://github.com/go-gitea/gitea/pull/39973)) ([#40019](https://github.com/go-gitea/gitea/pull/40019))
- *(deps)* 将 golang.org/x/net 模块更新至 v0.62.0 [安全] ([#40050](https://github.com/go-gitea/gitea/pull/40050)) ([#40051](https://github.com/go-gitea/gitea/pull/40051))
- 按图表的宽高比设置 Mermaid iframe 的尺寸 ([#40046](https://github.com/go-gitea/gitea/pull/40046)) ([#40052](https://github.com/go-gitea/gitea/pull/40052))
- *(feed)* 仓库首页分支订阅源要求代码读取权限 ([#39964](https://github.com/go-gitea/gitea/pull/39964)) ([#40067](https://github.com/go-gitea/gitea/pull/40067))
- 补充缺失的访问检查和大小限制 ([#39942](https://github.com/go-gitea/gitea/pull/39942)) ([#40085](https://github.com/go-gitea/gitea/pull/40085))
- *(user)* 使用个人资料卡响应对机器人用户的关注 ([#39980](https://github.com/go-gitea/gitea/pull/39980)) ([#40086](https://github.com/go-gitea/gitea/pull/40086))
- *(repo)* 对组织遵循 ALLOW_FORK_INTO_SAME_OWNER 设置 ([#40025](https://github.com/go-gitea/gitea/pull/40025)) ([#40094](https://github.com/go-gitea/gitea/pull/40094))
- *(ui)* 忽略小于 1 的代码行锚点，在 Vite 开发模式下显示 JS 错误 ([#39432](https://github.com/go-gitea/gitea/pull/39432)) ([#40087](https://github.com/go-gitea/gitea/pull/40087))
- *(pull)* 拒绝对已锁定的拉取请求添加评审评论 ([#39960](https://github.com/go-gitea/gitea/pull/39960)) ([#40084](https://github.com/go-gitea/gitea/pull/40084))
- *(api)* 仓库文件已存在于磁盘时返回 409 ([#40095](https://github.com/go-gitea/gitea/pull/40095)) ([#40098](https://github.com/go-gitea/gitea/pull/40098))
- *(mail)* 保留通知邮件外侧的间距 ([#40104](https://github.com/go-gitea/gitea/pull/40104)) ([#40111](https://github.com/go-gitea/gitea/pull/40111))
- *(actions)* 在拉取请求的 head 提交上运行评审触发的工作流 ([#40099](https://github.com/go-gitea/gitea/pull/40099)) ([#40117](https://github.com/go-gitea/gitea/pull/40117))
- *(pull)* 默认合并消息遵循最大审批者数量限制 ([#40118](https://github.com/go-gitea/gitea/pull/40118)) ([#40119](https://github.com/go-gitea/gitea/pull/40119))
- *(actions)* 不再领取已禁用 Actions 的仓库的作业 ([#40106](https://github.com/go-gitea/gitea/pull/40106)) ([#40122](https://github.com/go-gitea/gitea/pull/40122))
- 加强上下文用户的访问作用域限制 ([#39945](https://github.com/go-gitea/gitea/pull/39945)) ([#40115](https://github.com/go-gitea/gitea/pull/40115))
- *(projects)* 隐藏查看者无权读取的关联拉取请求 ([#40016](https://github.com/go-gitea/gitea/pull/40016)) ([#40134](https://github.com/go-gitea/gitea/pull/40134))
- *(pull)* 评审评论被编辑时，同步更新评审正文 ([#40058](https://github.com/go-gitea/gitea/pull/40058)) ([#40133](https://github.com/go-gitea/gitea/pull/40133))
- *(auth)* 仅自动关联外部身份所指向的账户 ([#40121](https://github.com/go-gitea/gitea/pull/40121)) ([#40137](https://github.com/go-gitea/gitea/pull/40137))
- 在 `gitea admin user list` 和管理员用户 API 中列出机器人用户 ([#40060](https://github.com/go-gitea/gitea/pull/40060)) ([#40147](https://github.com/go-gitea/gitea/pull/40147))
- *(repo)* 避免生成贡献者统计时卡住 ([#40125](https://github.com/go-gitea/gitea/pull/40125)) ([#40156](https://github.com/go-gitea/gitea/pull/40156))

### 文档

- 明确团队的软件包权限覆盖组织的所有软件包 ([#39953](https://github.com/go-gitea/gitea/pull/39953)) ([#39956](https://github.com/go-gitea/gitea/pull/39956))

### 其他

- *(e2e)* 在 Firefox 中启用异步剪贴板测试偏好设置 ([#39838](https://github.com/go-gitea/gitea/pull/39838)) ([#39927](https://github.com/go-gitea/gitea/pull/39927))


## 贡献者

* [@0xJacky](https://github.com/0xJacky)
* [@basavaraj-sm05](https://github.com/basavaraj-sm05)
* [@bircni](https://github.com/bircni)
* [@civilwarinfrance](https://github.com/civilwarinfrance)
* [@Ferdinand-MZ](https://github.com/Ferdinand-MZ)
* [@fixfon](https://github.com/fixfon)
* [@hktitof](https://github.com/hktitof)
* [@lazerg](https://github.com/lazerg)
* [@lunny](https://github.com/lunny)
* [@myers](https://github.com/myers)
* [@nazem-droubi](https://github.com/nazem-droubi)
* [@petervavrinecz](https://github.com/petervavrinecz)
* [@schop-rob](https://github.com/schop-rob)
* [@SHIVANSHGARG07](https://github.com/SHIVANSHGARG07)
* [@shoemoney](https://github.com/shoemoney)
* [@silverwind](https://github.com/silverwind)
* [@somaz94](https://github.com/somaz94)
* [@soujasK](https://github.com/soujasK)
* [@stackedbyaradhya](https://github.com/stackedbyaradhya)
* [@SudhanshuMatrix](https://github.com/SudhanshuMatrix)
* [@wxiaoguang](https://github.com/wxiaoguang)
* [@yuhongwei380](https://github.com/yuhongwei380)
