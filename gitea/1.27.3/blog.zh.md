---
title: Gitea 1.27.3 官方发布博客（中文）
description: Gitea 1.27.3 正式发布博客的完整简体中文翻译。
---

# Gitea 1.27.3 正式发布

作者：bircni · 博客发布日期（UTC）：2026-08-29

> 本文为 [Gitea 官方发布博客](https://blog.gitea.com/release-of-1.27.3/) 的非官方简体中文翻译，由 ChatGPT 翻译，保留原文结构、代码与链接。原文及源代码来自 [Gitea Blog](https://gitea.com/gitea/blog/src/branch/main/content/post/gitea/release-of-1.27.3.md)，按 [Apache-2.0](../../licenses/gitea-blog-apache-2.0.md) 许可使用。本译文的修改为中文翻译；原作者署名如上。文中的历史版本更新日志属于博客原文，博客日期与 GitHub Release 日期分别保留。

我们很高兴宣布发布 **Gitea 1.27.3**，这是 1.27 系列的第三个补丁版本。本版包含覆盖 Gitea Actions、API、软件包注册表和仓库迁移的大量安全修复，以及 Actions、软件包和界面的错误修复。强烈建议所有用户尽快升级。

## 安全 {#security}

此版本修复以下安全漏洞，请尽快升级。

- CVE-2026-66877：“批准首次派生仓库贡献者的工作流运行”门禁仅将作业插入为阻塞状态，作业发射器不再检查 `run.NeedApproval`。共享作业级 `concurrency` 组的无关运行可迫使发射器解除阻塞，将待批准派生仓库 PR 作业未经审批分配给 Runner，使任何能发起 PR 的用户在自托管 Runner 上执行代码。由 [#39005](https://github.com/go-gitea/gitea/pull/39005) / [#39018](https://github.com/go-gitea/gitea/pull/39018) 修复。感谢 [@klydz](https://github.com/klydz) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-71184：派生仓库 PR 工作流的维护者审批门禁被 `pull_request_review_comment` 事件及评审批准/拒绝事件跳过，因为通知器未调用 `.WithPullRequest(pr)`，且 nil PR 不被视为派生仓库 PR。派生仓库头部的工作流 YAML 因此未经批准在基础仓库上运行。由 [#39005](https://github.com/go-gitea/gitea/pull/39005) / [#39018](https://github.com/go-gitea/gitea/pull/39018) 修复。感谢 [@echoesofwhoami](https://github.com/echoesofwhoami) 报告问题，[@iabdullah215](https://github.com/iabdullah215) 提供分析，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-68957：Issue 搜索 API 和网页路由允许标为 `is_restricted` 的账户搜索并读取有限可见性用户的 Issue，暴露完整标题、正文以及通过标题、正文或评论匹配的内容；匿名 Issue 搜索则正确返回空结果。由 [#39004](https://github.com/go-gitea/gitea/pull/39004) / [#39039](https://github.com/go-gitea/gitea/pull/39039) 修复。感谢 [@Mon3mRT](https://github.com/Mon3mRT) 和 [@Black1hp](https://github.com/Black1hp) 报告问题，感谢 [@bircni](https://github.com/bircni) 和 [@silverwind](https://github.com/silverwind) 提供补丁。
- CVE-2026-60010：`PUT /api/v1/repos/{owner}/{repo}/teams/{team}` 允许非所有者的仓库管理员向私有仓库关联任意组织团队，即使组织设置 `RepoAdminChangeTeamAccess=false` 禁止此操作。此前团队端已有修复，但对应仓库端点遗漏。由 [#39046](https://github.com/go-gitea/gitea/pull/39046) / [#39058](https://github.com/go-gitea/gitea/pull/39058) 修复。感谢 [@akoul](https://github.com/akoul) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-70406：`CompareDiff` 和 `CreatePullRequest` 共用的 `parseCompareInfo` 缺少此前为 `UpdatePullRequest` 增加的 `TokenCanAccessRepo(headRepo)` 检查，导致 `public-only, read:repository` 令牌通过公开基础仓库比较端点读取私有头仓库的提交历史和差异。由 [#39006](https://github.com/go-gitea/gitea/pull/39006) / [#39013](https://github.com/go-gitea/gitea/pull/39013) 修复。感谢 [@qw3rtyou](https://github.com/qw3rtyou) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-63792：`CanReadWorkflowCrossRepo` 通过“协作所有者”信任关系授予可复用工作流跨仓库读取权限，却未检查是否为派生仓库 PR，泄露其他私有仓库工作流文件。此前只修复了 `GetActionsUserRepoPermission`，遗漏此对应路径。由 [#39005](https://github.com/go-gitea/gitea/pull/39005) / [#39018](https://github.com/go-gitea/gitea/pull/39018) 修复。感谢 [@krishna-loginsoft](https://github.com/krishna-loginsoft) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-66874：对于 `pull_request` 事件，Gitea 从派生仓库控制的 PR 头部读取工作流定义，为被自身 `branches:` / `paths:` 筛选排除的工作流生成 `skipped` 提交状态。派生仓库作者可将工作流名称设为必需检查上下文，并配置永不匹配的筛选，使必需检查在未运行任何工作流时被视为满足。由 [#39005](https://github.com/go-gitea/gitea/pull/39005) / [#39018](https://github.com/go-gitea/gitea/pull/39018) 修复。感谢 [@iabdullah215](https://github.com/iabdullah215) 和 [@effabinteashfaq](https://github.com/effabinteashfaq) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-68964：API 向受限调用者返回有限可见性用户的 SSH 和 GPG 密钥，包括标题、公钥材料、指纹和 GPG 密钥内嵌邮箱；对应网页路由则正确返回 `404`。由 [#39004](https://github.com/go-gitea/gitea/pull/39004) / [#39039](https://github.com/go-gitea/gitea/pull/39039) 修复。感谢 [@Mon3mRT](https://github.com/Mon3mRT) 和 [@Black1hp](https://github.com/Black1hp) 报告问题，感谢 [@bircni](https://github.com/bircni) 和 [@silverwind](https://github.com/silverwind) 提供补丁。
- CVE-2026-67577：活动动态和贡献热力图 API 向受限调用者返回有限可见性用户活动，而个人资料和 RSS 路由返回 `404`。由 [#39004](https://github.com/go-gitea/gitea/pull/39004) / [#39039](https://github.com/go-gitea/gitea/pull/39039) 修复。感谢 [@Mon3mRT](https://github.com/Mon3mRT) 和 [@Black1hp](https://github.com/Black1hp) 报告问题，感谢 [@bircni](https://github.com/bircni) 和 [@silverwind](https://github.com/silverwind) 提供补丁。
- CVE-2026-66849：`determineAccessMode` 为所有已登录且非幽灵的用户授予有限可见性用户软件包的读取权限，却未排除受限账户，使受限用户能枚举和下载另一用户的整个软件包注册表。由 [#39043](https://github.com/go-gitea/gitea/pull/39043) / [#39058](https://github.com/go-gitea/gitea/pull/39058) 修复。感谢 [@Black1hp](https://github.com/Black1hp) 和 [@Mon3mRT](https://github.com/Mon3mRT) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-73135：多个应执行相同仓库可见性策略的 SQL 条件中，有一个对隐身用户行为不同，导致部分已认证仓库搜索端点以及匿名派生/关注仓库列表暴露隐身用户拥有的仓库。由 [#39009](https://github.com/go-gitea/gitea/pull/39009) / [#39012](https://github.com/go-gitea/gitea/pull/39012) 修复。感谢 [@LongNguyen1708](https://github.com/LongNguyen1708) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-78433：2026 年 1 月 16 日遗留截止日期之前创建的附件完全跳过跨仓库检查，因为保护条件只检查时间戳，未同时检查 `RepoID == 0`。权限随后根据 URL 中指定的仓库而非附件所属仓库计算，使私有仓库附件可通过任意公开仓库附件路径获取。由 [#39048](https://github.com/go-gitea/gitea/pull/39048) / [#39077](https://github.com/go-gitea/gitea/pull/39077) 修复。感谢 [@iabdullah215](https://github.com/iabdullah215) 报告问题，感谢 [@bircni](https://github.com/bircni) 和 [@silverwind](https://github.com/silverwind) 提供补丁。
- CVE-2026-70407：`GET /api/v1/orgs` 未执行 `read:organization` 令牌权限范围检查，仅有 `read:misc` 的令牌也可列出组织元数据；令牌属于站点管理员时甚至包含 `limited` 和 `private` 组织。由 [#39041](https://github.com/go-gitea/gitea/pull/39041) / [#39058](https://github.com/go-gitea/gitea/pull/39058) 修复。感谢 [@gxy1113](https://github.com/gxy1113), [@iabdullah215](https://github.com/iabdullah215) 和 [@rajivraj](https://github.com/rajivraj) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-73126：Actions 工作流徽章端点未执行个人访问令牌权限范围检查，仅有 `read:user` 或 `read:repository,public-only` 的令牌可获取令牌所有者有权访问的私有仓库最新工作流状态。由 [#39044](https://github.com/go-gitea/gitea/pull/39044) / [#39058](https://github.com/go-gitea/gitea/pull/39058) 修复。感谢 [@0xDBJ](https://github.com/0xDBJ) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-70400：`POST /api/v1/repos/migrate` 接受仅公开仓库令牌，并在请求体设置 `private: true` 时创建私有仓库，而普通私有仓库创建路由会拒绝同一令牌。由 [#39007](https://github.com/go-gitea/gitea/pull/39007) / [#39014](https://github.com/go-gitea/gitea/pull/39014) 修复。感谢 [@rexpository](https://github.com/rexpository) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-70396：`POST /api/v1/orgs/{org}/repos` 允许仅有 `write:organization` 权限范围的令牌在组织内创建仓库，绕过其他仓库创建路由要求的仓库权限范围。由 [#39007](https://github.com/go-gitea/gitea/pull/39007) / [#39014](https://github.com/go-gitea/gitea/pull/39014) 修复。感谢 [@rexpository](https://github.com/rexpository) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-63021：Swift 软件包上传在配额或持久化检查前，将所有浅层 `Package.swift` / `Package@swift-N.swift` 解析进内存，只拒绝大于 128 KiB 的单文件，没有条目数或总大小上限。包含大量高压缩率清单的几 MB 归档可放大为几十到几百 MB 常驻内存。由 [#39025](https://github.com/go-gitea/gitea/pull/39025) / [#39032](https://github.com/go-gitea/gitea/pull/39032) 修复。感谢 [@DshtAnger](https://github.com/DshtAnger) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-62925：Alpine 上传处理器在配额检查前解析 `.apk`，未用限流读取器包装 gzip/tar 流，无条件将 `.PKGINFO` 的每个 `provides=` / `depend=` 值追加到切片，使几百 KB 的 `.apk` 放大为进程内存消耗。由 [#39026](https://github.com/go-gitea/gitea/pull/39026) / [#39029](https://github.com/go-gitea/gitea/pull/39029) 修复。感谢 [@DshtAnger](https://github.com/DshtAnger) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-73273：上传扩展名为 `.md5`、`.sha1`、`.sha256`、`.sha512` 的 Maven 校验和时，Gitea 将整个请求体缓存在内存，并在运行 `CheckSizeQuotaExceeded` 前返回；有效校验和至多几十字节，但此路径既无配额也无读取上限。由 [#39028](https://github.com/go-gitea/gitea/pull/39028) / [#39031](https://github.com/go-gitea/gitea/pull/39031) 修复。感谢 [@rajivraj](https://github.com/rajivraj) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-60021：GitLab 迁移探测远程 `/api/v4/version` 时未传递迁移上下文，并使用无超时 HTTP 客户端，恶意兼容服务可无限保持响应，任务停止后仍占用迁移工作线程。由 [#39023](https://github.com/go-gitea/gitea/pull/39023) / [#39035](https://github.com/go-gitea/gitea/pull/39035) 修复。感谢 [@PhucQuan](https://github.com/PhucQuan) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-60018：OneDev 迁移在验证版本字符串前通过 `io.ReadAll` 读取整个 `/~api/version/server` 响应，恶意服务可返回巨大或无限响应，占用迁移线程和内存直到超时。由 [#39024](https://github.com/go-gitea/gitea/pull/39024) / [#39033](https://github.com/go-gitea/gitea/pull/39033) 修复。感谢 [@PhucQuan](https://github.com/PhucQuan) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-73130：创建仓库的 `gitignores` 字段在网页表单和 API 选项结构中都没有大小限制，超大值导致创建时模板读取线性放大。由 [#39027](https://github.com/go-gitea/gitea/pull/39027) / [#39040](https://github.com/go-gitea/gitea/pull/39040) 修复。感谢 [@arpitjain099](https://github.com/arpitjain099) 报告问题，感谢 [@bircni](https://github.com/bircni) 和 [@wxiaoguang](https://github.com/wxiaoguang) 提供补丁。
- CVE-2026-70402：服务端 Git 钩子目录和脚本先以 `0777` 创建，再应用进程 umask。宽松 umask（`0000` / `0002`）使文件可被组或所有人写入，本地用户可修改并作为 Gitea 服务账户执行代码。由 [#39008](https://github.com/go-gitea/gitea/pull/39008) / [#39016](https://github.com/go-gitea/gitea/pull/39016) 修复。感谢 [@What-canIsay](https://github.com/What-canIsay) 报告问题，感谢 [@bircni](https://github.com/bircni) 和 [@silverwind](https://github.com/silverwind) 提供补丁。
- CVE-2026-66853：`DoerViewOtherVisibility` 未检查 `IsRestricted`，对所有已登录、非管理员且非自身查看者返回 `VisibleTypeLimited`，导致 `GET /users/{username}/orgs` 允许受限用户枚举有限可见性组织及其名称、描述和头像。由 [#39047](https://github.com/go-gitea/gitea/pull/39047) / [#39058](https://github.com/go-gitea/gitea/pull/39058) 修复。感谢 [@Black1hp](https://github.com/Black1hp) 和 [@Mon3mRT](https://github.com/Mon3mRT) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-71301：私有仓库中仅有 Wiki 权限的成员可以使用 `POST /{owner}/{repo}/markup` 解析同仓库 PR 引用并读取标题，即使没有 Issue 或 PR 权限。由 [#39045](https://github.com/go-gitea/gitea/pull/39045) / [#39054](https://github.com/go-gitea/gitea/pull/39054) 修复。感谢 [@hexcraft-labs](https://github.com/hexcraft-labs) 报告问题，感谢 [@bircni](https://github.com/bircni), [@silverwind](https://github.com/silverwind) 和 [@wxiaoguang](https://github.com/wxiaoguang) 提供补丁。
- CVE-2026-73504：原始 Actions 产物下载端点在验证签名 URL 前查询产物；提供的全局产物 ID 存在时，未认证请求返回 `401`，否则返回不同响应，构成产物到仓库的存在性探测。由 [#39049](https://github.com/go-gitea/gitea/pull/39049) / [#39053](https://github.com/go-gitea/gitea/pull/39053) 修复。感谢 [@hexcraft-labs](https://github.com/hexcraft-labs) 报告问题，感谢 [@bircni](https://github.com/bircni) 和 [@silverwind](https://github.com/silverwind) 提供补丁。

本版还强化了工单搜索，未筛选的查询不再将所有公开仓库枚举至索引器筛选条件 [#39000](https://github.com/go-gitea/gitea/pull/39000)（由 [@lunny](https://github.com/lunny) 贡献）；移除内部私有端点中的不安全代码 [#38965](https://github.com/go-gitea/gitea/pull/38965)（由 [@wxiaoguang](https://github.com/wxiaoguang) 贡献）。

## 重要修复

### Actions

- 步骤级 `continue-on-error` 再次接受表达式，不再因值不是普通布尔值而拒绝整个工作流文件 ([#39148](https://github.com/go-gitea/gitea/pull/39148)).
- 使用 YAML 锚点和别名的工作流在按作业拆分前统一解析一次，避免跨作业的别名失效 ([#38996](https://github.com/go-gitea/gitea/pull/38996)).
- 工作流图按实际作业标识对矩阵分支分组，不再解析显示名称，修复缺失或错误的矩阵面板 ([#38998](https://github.com/go-gitea/gitea/pull/38998)).
- 最后一步被跳过时显示“Complete job”（完成作业）日志组 [#39003](https://github.com/go-gitea/gitea/pull/39003)；拒绝非映射类型的矩阵 `include` / `exclude` 条目 [#38933](https://github.com/go-gitea/gitea/pull/38933)。

### 软件包

- Swift 注册表保留 SemVer 预发布标识，不再丢弃 ([#39158](https://github.com/go-gitea/gitea/pull/39158)).

### 仓库和界面

- 当 `SIGNING_FORMAT = ssh` 时，不再使用实例的 SSH 密钥尝试 OpenPGP 签名验证；此前每个已签名提交都会记录导出错误 ([#39086](https://github.com/go-gitea/gitea/pull/39086)).
- 保持拉取请求的已合并状态与 Git 同步 [#39118](https://github.com/go-gitea/gitea/pull/39118)；默认比较链接包含头部仓库名称 [#39079](https://github.com/go-gitea/gitea/pull/39079)；解析不符合 RFC 5322 地址格式的共同作者尾注 [#39081](https://github.com/go-gitea/gitea/pull/39081)。
- 仓库仍在迁移时不触发 `MarkAsBrokenEmpty` ([#39092](https://github.com/go-gitea/gitea/pull/39092)).
- Runner 列表页保留查询参数 [#39163](https://github.com/go-gitea/gitea/pull/39163)；仪表盘动态遵循 `FEED_PAGING_NUM` [#38936](https://github.com/go-gitea/gitea/pull/38936)；下拉菜单中的作用域标签按排他顺序排序 [#38954](https://github.com/go-gitea/gitea/pull/38954)；设置 `REQUIRE_SIGNIN_VIEW` 时支持匿名切换主题 [#38961](https://github.com/go-gitea/gitea/pull/38961)。
- 有限可见性组织向已认证的非成员授予与公开组织相同的单元读取权限（代码、软件包和项目） ([#38963](https://github.com/go-gitea/gitea/pull/38963)).
- 通过 API 编辑用户时，`login_name` 字段再次成为可选项 [#38945](https://github.com/go-gitea/gitea/pull/38945)；修正 bleve 索引器的令牌过滤器 [#38951](https://github.com/go-gitea/gitea/pull/38951)；安装时遵循环境变量 [#38976](https://github.com/go-gitea/gitea/pull/38976)。

本版包含 [41 个已合并 PR](https://github.com/go-gitea/gitea/pulls?q=is%3Apr+milestone%3A1.27.3+is%3Amerged)，感谢社区作出的贡献。

## 如何安装或更新

从 [Gitea 下载页面](https://dl.gitea.com/gitea/1.27.3/) 获取预编译二进制文件，请选择兼容当前平台的版本。安装或升级的逐步指南见[安装文档](https://docs.gitea.com/category/installation)。

## 特别致谢

也感谢 [Open Collective](https://opencollective.com/gitea) 上持续提供资金支持的所有支持者。

---

正在寻找简单顺畅的 Git 仓库管理方案？
欢迎了解 [Gitea Cloud](https://cloud.gitea.com)，这个全托管、可扩展的平台可以简化开发工作流。

<!--more-->

## 更新日志 {#changelog}

## [1.27.3](https://github.com/go-gitea/gitea/releases/tag/v1.27.3) - 2026-08-29

- 安全
  - 修复（软件包）：限制访问、有限可见性和令牌作用域访问 ([#39041](https://github.com/go-gitea/gitea/pull/39041), [#39043](https://github.com/go-gitea/gitea/pull/39043), [#39044](https://github.com/go-gitea/gitea/pull/39044), [#39047](https://github.com/go-gitea/gitea/pull/39047), [#39046](https://github.com/go-gitea/gitea/pull/39046)) ([#39058](https://github.com/go-gitea/gitea/pull/39058))
  - 强制检查附件所属仓库路径 ([#39048](https://github.com/go-gitea/gitea/pull/39048)) ([#39077](https://github.com/go-gitea/gitea/pull/39077))
  - 强制检查同仓库 Issue 访问权限 ([#39045](https://github.com/go-gitea/gitea/pull/39045)) ([#39054](https://github.com/go-gitea/gitea/pull/39054))
  - 优先验证原始产物签名 ([#39049](https://github.com/go-gitea/gitea/pull/39049)) ([#39053](https://github.com/go-gitea/gitea/pull/39053))
  - 对受限查看者隐藏有限用户 ([#39004](https://github.com/go-gitea/gitea/pull/39004)) ([#39039](https://github.com/go-gitea/gitea/pull/39039))
  - 限制 gitignore 模板选择数量 ([#39027](https://github.com/go-gitea/gitea/pull/39027)) ([#39040](https://github.com/go-gitea/gitea/pull/39040))
  - 取消 GitLab 版本探测 ([#39023](https://github.com/go-gitea/gitea/pull/39023)) ([#39035](https://github.com/go-gitea/gitea/pull/39035))
  - 限制 Swift 软件包清单 ([#39025](https://github.com/go-gitea/gitea/pull/39025)) ([#39032](https://github.com/go-gitea/gitea/pull/39032))
  - 限制 OneDev 版本响应大小 ([#39024](https://github.com/go-gitea/gitea/pull/39024)) ([#39033](https://github.com/go-gitea/gitea/pull/39033))
  - 限制 Maven 校验和上传 ([#39028](https://github.com/go-gitea/gitea/pull/39028)) ([#39031](https://github.com/go-gitea/gitea/pull/39031))
  - 限制 Alpine 元数据条目 ([#39026](https://github.com/go-gitea/gitea/pull/39026)) ([#39029](https://github.com/go-gitea/gitea/pull/39029))
  - 强制执行派生仓库 PR 信任边界 ([#39005](https://github.com/go-gitea/gitea/pull/39005)) ([#39018](https://github.com/go-gitea/gitea/pull/39018))
  - 限制 Git 钩子权限 ([#39008](https://github.com/go-gitea/gitea/pull/39008)) ([#39016](https://github.com/go-gitea/gitea/pull/39016))
  - 强制检查仓库创建令牌授权 ([#39007](https://github.com/go-gitea/gitea/pull/39007)) ([#39014](https://github.com/go-gitea/gitea/pull/39014))
  - 对比较头引用强制检查仅公开权限范围 ([#39006](https://github.com/go-gitea/gitea/pull/39006)) ([#39013](https://github.com/go-gitea/gitea/pull/39013))
  - 隐藏隐身所有者的仓库 ([#39009](https://github.com/go-gitea/gitea/pull/39009)) ([#39012](https://github.com/go-gitea/gitea/pull/39012))
  - 避免 Issue 搜索枚举每个公开仓库 ([#38992](https://github.com/go-gitea/gitea/pull/38992)) ([#39000](https://github.com/go-gitea/gitea/pull/39000))
  - 重构私有端点 ([#38964](https://github.com/go-gitea/gitea/pull/38964)) ([#38965](https://github.com/go-gitea/gitea/pull/38965))
- 改进
  - 为 PR 评审增加永久链接 ([#38849](https://github.com/go-gitea/gitea/pull/38849)) ([#39036](https://github.com/go-gitea/gitea/pull/39036))
- 问题修复
  - 为 Runner 列表页补充缺失查询参数 ([#39163](https://github.com/go-gitea/gitea/pull/39163))
  - 保持步骤级 continue-on-error 表达式未求值 ([#39141](https://github.com/go-gitea/gitea/pull/39141)) ([#39148](https://github.com/go-gitea/gitea/pull/39148))
  - 在 Swift 注册表中保留 SemVer 预发布标识符 ([#39156](https://github.com/go-gitea/gitea/pull/39156)) ([#39158](https://github.com/go-gitea/gitea/pull/39158))
  - 迁移仓库期间防止 MarkAsBrokenEmpty ([#39091](https://github.com/go-gitea/gitea/pull/39091)) ([#39092](https://github.com/go-gitea/gitea/pull/39092))
  - 不使用 SSH 实例密钥验证 OpenPGP 签名 ([#39073](https://github.com/go-gitea/gitea/pull/39073)) ([#39086](https://github.com/go-gitea/gitea/pull/39086))
  - 保持已合并状态与 Git 一致 ([#39062](https://github.com/go-gitea/gitea/pull/39062)) ([#39118](https://github.com/go-gitea/gitea/pull/39118))
  - 在默认比较链接中标明头仓库 ([#39075](https://github.com/go-gitea/gitea/pull/39075)) ([#39079](https://github.com/go-gitea/gitea/pull/39079))
  - 解析不符合 RFC 5322 地址格式的共同作者尾注 ([#39076](https://github.com/go-gitea/gitea/pull/39076)) ([#39081](https://github.com/go-gitea/gitea/pull/39081))
  - 最后一步被跳过时显示 "Complete job" 日志 ([#38939](https://github.com/go-gitea/gitea/pull/38939)) ([#39003](https://github.com/go-gitea/gitea/pull/39003))
  - 修复矩阵作业分组 ([#38980](https://github.com/go-gitea/gitea/pull/38980)) ([#38998](https://github.com/go-gitea/gitea/pull/38998))
  - 解析 Actions 工作流中的 YAML 锚点和别名 ([#38984](https://github.com/go-gitea/gitea/pull/38984)) ([#38996](https://github.com/go-gitea/gitea/pull/38996))
  - 安装期间遵循环境变量 ([#38974](https://github.com/go-gitea/gitea/pull/38974)) ([#38976](https://github.com/go-gitea/gitea/pull/38976))
  - 为已认证的非成员授予有限组织单元读取权限 ([#38871](https://github.com/go-gitea/gitea/pull/38871)) ([#38963](https://github.com/go-gitea/gitea/pull/38963))
  - 设置 REQUIRE_SIGNIN_VIEW 时允许匿名切换主题 ([#38956](https://github.com/go-gitea/gitea/pull/38956)) ([#38961](https://github.com/go-gitea/gitea/pull/38961))
  - 移除 Action 状态图标外层 span ([#38957](https://github.com/go-gitea/gitea/pull/38957)) ([#38959](https://github.com/go-gitea/gitea/pull/38959))
  - 下拉菜单按互斥顺序排序带作用域标签 ([#38893](https://github.com/go-gitea/gitea/pull/38893)) ([#38954](https://github.com/go-gitea/gitea/pull/38954))
  - 修正 Bleve 索引器令牌筛选器 ([#38853](https://github.com/go-gitea/gitea/pull/38853)) ([#38951](https://github.com/go-gitea/gitea/pull/38951))
  - API 编辑用户时使 "login_name" 字段可选 ([#38917](https://github.com/go-gitea/gitea/pull/38917)) ([#38945](https://github.com/go-gitea/gitea/pull/38945))
  - 拒绝非映射形式的矩阵 include/exclude ([#38933](https://github.com/go-gitea/gitea/pull/38933))
  - 仪表盘动态遵循 FEED_PAGING_NUM ([#38935](https://github.com/go-gitea/gitea/pull/38935)) ([#38936](https://github.com/go-gitea/gitea/pull/38936))
- 其他
  - 调整仓库比较链接 ([#39088](https://github.com/go-gitea/gitea/pull/39088)) ([#39119](https://github.com/go-gitea/gitea/pull/39119))
  - 从发布工作流移除 AWS S3 上传 ([#38928](https://github.com/go-gitea/gitea/pull/38928)) ([#38929](https://github.com/go-gitea/gitea/pull/38929))
  - 为官方 Gitea 移动应用预注册内置 OAuth2 应用 ([#38880](https://github.com/go-gitea/gitea/pull/38880)) ([#38922](https://github.com/go-gitea/gitea/pull/38922))

## 贡献者

* [@4RH1T3CT0R7](https://github.com/4RH1T3CT0R7)
* [@bircni](https://github.com/bircni)
* [@bn-zr](https://github.com/bn-zr)
* [@gomitrah](https://github.com/gomitrah)
* [@HsukqiLee](https://github.com/HsukqiLee)
* [@jsk1004ha](https://github.com/jsk1004ha)
* [@lunny](https://github.com/lunny)
* [@silverwind](https://github.com/silverwind)
* [@terriblegoodday](https://github.com/terriblegoodday)
* [@waterWang](https://github.com/waterWang)
* [@wxiaoguang](https://github.com/wxiaoguang)
* [@yousimu](https://github.com/yousimu)
