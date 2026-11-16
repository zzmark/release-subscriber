---
title: Gitea 28.4.0 官方发布博客（中文）
description: Gitea 28.4.0 正式发布博客的完整简体中文翻译。
---

# Gitea 28.4.0 正式发布

作者：[bircni](https://github.com/bircni) · 技术监督委员会 · 博客发布日期（UTC）为 2026-11-15。

> 本文由 ChatGPT 根据 [Gitea 官方发布博客](https://blog.gitea.com/release-of-28.4.0/) 的公开页面译为简体中文。原文按 [Apache-2.0](../../licenses/gitea-blog-apache-2.0.md) 许可使用。本译文为非官方译文，保留原作者署名。

我们很高兴宣布发布 **Gitea 28.4.0**，这是 28 系列的第四个维护版本。本版包含多项安全修复，包括防止通过自动初始化仓库执行命令，以及防止仓库搜索泄露密码哈希。本版还修复了 Actions、工单、拉取请求、仓库和软件包方面的问题。我们强烈建议所有用户尽快升级。

## 安全

本版修复了以下安全漏洞。请尽快升级。

- [CVE-2026-97054](https://go.dev/issue/82563)：发布二进制文件现使用 Go 1.27.4 构建。该版本修复了请求超过 `MaxBytesReader` 限制时 `net/http` 的 HTTP/1 服务器崩溃的问题，也修复了 `go` 命令、编译器和链接器中的多个问题。后面这些问题仅在构建不受信任的代码时有影响。由 [#40315](https://github.com/go-gitea/gitea/pull/40315) / [#40318](https://github.com/go-gitea/gitea/pull/40318) 更新。
- [CVE-2026-125423](https://github.com/go-gitea/gitea/security/advisories/GHSA-6m4f-m9vc-7946)：使用自动初始化功能创建仓库时，仓库在初始化完成前就接受推送，并以当时已有的仓库内容为基础创建初始提交。拥有创建仓库权限的用户可在此期间推送特制的文件树，使写入 README 时沿符号链接覆盖服务器上的 Git 钩子，并以 Gitea 系统用户的身份执行命令。现在初始提交在全新目录中构建，新仓库在完全初始化后才接受推送。由 [#40376](https://github.com/go-gitea/gitea/pull/40376) / [#40383](https://github.com/go-gitea/gitea/pull/40383) 修复。感谢 [@grigorovichvlad](https://github.com/grigorovichvlad) 报告问题，感谢 [@bircni](https://github.com/bircni) 和 [@lunny](https://github.com/lunny) 提供补丁。
- [CVE-2026-123006](https://github.com/go-gitea/gitea/security/advisories/GHSA-frjx-8pcw-8c9q)：仪表板使用的仓库搜索接口（`GET /repo/search`）会返回各仓库内部的提交状态对象。自 28.0.0 起，该对象包含仓库所有者的完整用户记录。任何已登录用户都能读取其可见且具有提交状态的仓库所有者的密码哈希、盐和电子邮件地址。现在响应只包含提交状态的状态值和目标 URL。由 [#40377](https://github.com/go-gitea/gitea/pull/40377) / [#40384](https://github.com/go-gitea/gitea/pull/40384) 修复。感谢 [@lichoin](https://github.com/lichoin) 和 [@Tfo0](https://github.com/Tfo0) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- [CVE-2026-123065](https://github.com/go-gitea/gitea/security/advisories/GHSA-4p89-xcq8-xfhm)：编辑 Release 时，系统根据表单提交的标识符删除被移除附件的文件，未核验附件是否属于该 Release。只要对任意仓库的 Release 有写权限（包括自己的仓库），用户就能删除实例上任何已知 UUID 的附件文件。由 [#40120](https://github.com/go-gitea/gitea/pull/40120) / [#40268](https://github.com/go-gitea/gitea/pull/40268) 修复。感谢 [@HexDump0](https://github.com/HexDump0) 和 [@ivantsepp](https://github.com/ivantsepp) 报告问题，感谢 [@silverwind](https://github.com/silverwind) 提供补丁。
- [CVE-2026-123638](https://github.com/go-gitea/gitea/security/advisories/GHSA-w87g-xmrp-86v2)：分支保护规则中的“受保护文件模式”使用 Git 打印的文件名进行匹配。Git 会给包含双引号、反斜杠或控制字符的名称加引号，导致这些名称始终无法匹配文件模式。拥有写权限的用户可通过推送或合并拉取请求，添加或修改受保护模式覆盖的文件。例如，当模式保护工作流目录时，用户仍可改动目录中的工作流文件。由 [#40362](https://github.com/go-gitea/gitea/pull/40362) 修复。感谢 [@Bryan-Project](https://github.com/Bryan-Project) 和 [@yagcioglutoprak](https://github.com/yagcioglutoprak) 报告问题，感谢 [@lunny](https://github.com/lunny) 提供补丁。
- [CVE-2026-126338](https://github.com/go-gitea/gitea/security/advisories/GHSA-wgx7-537g-xfrg)：回复代码评审评论时，接口接受来自其他拉取请求的评审 ID。已登录用户可以提交其无权读取的仓库中的评审 ID，系统会把原评论所指行的差异上下文复制到该用户自己的评论中。由 [#40131](https://github.com/go-gitea/gitea/pull/40131) / [#40281](https://github.com/go-gitea/gitea/pull/40281) 修复。感谢 Anthropic 报告问题，感谢 [@silverwind](https://github.com/silverwind) 提供补丁。
- [CVE-2026-120729](https://github.com/go-gitea/gitea/security/advisories/GHSA-wmr3-xg9x-vc55)：鼠标悬停在工单引用上时，弹窗会从所悬停链接的路径加载数据，并将部分响应作为 HTML 插入页面。用户可以发布一个看起来像普通工单引用、实际指向自己仓库中文件的链接。任何人将鼠标悬停在该链接上，文件中的脚本都会在对方的会话中运行。由 [#40207](https://github.com/go-gitea/gitea/pull/40207) / [#40225](https://github.com/go-gitea/gitea/pull/40225) 修复。感谢 Anthropic 报告问题，感谢 [@silverwind](https://github.com/silverwind) 提供补丁。
- [CVE-2026-118535](https://github.com/go-gitea/gitea/security/advisories/GHSA-q3q9-39vr-q35j)：仓库注册为所有者级别的限定作用域工作流来源后，转移仓库不会清除这项注册。新所有者可以修改其中的工作流，这些工作流仍会在原所有者的仓库中运行并使用其 Actions 密钥和令牌。现在转移仓库时会移除这项注册。由 [#40131](https://github.com/go-gitea/gitea/pull/40131) / [#40281](https://github.com/go-gitea/gitea/pull/40281) 修复。感谢 [@danieltk76](https://github.com/danieltk76)、[@lmonstergg](https://github.com/lmonstergg) 和 [@BOTecko](https://github.com/BOTecko) 报告问题，感谢 [@silverwind](https://github.com/silverwind) 提供补丁。
- [CVE-2026-123002](https://github.com/go-gitea/gitea/security/advisories/GHSA-5mx6-8rwm-52wf)：登录、重置密码及使用 `X-Gitea-OTP` 标头的 Basic 身份验证流程都允许无限次提交错误的 TOTP 验证码。已知账户密码的人可以尝试猜测六位验证码。现在验证码验证失败五次后，该账户后续的验证尝试将在 15 分钟内被拒绝。由 [#39993](https://github.com/go-gitea/gitea/pull/39993) / [#40374](https://github.com/go-gitea/gitea/pull/40374) 修复。感谢 [@SakusenSec](https://github.com/SakusenSec)、[@Pedromdsn](https://github.com/Pedromdsn)、[@sandiyochristan](https://github.com/sandiyochristan) 和 [@glenaster](https://github.com/glenaster) 报告问题，感谢 [@sandiyochristan](https://github.com/sandiyochristan) 提供补丁。
- [CVE-2026-123009](https://github.com/go-gitea/gitea/security/advisories/GHSA-9vh6-6hgj-j5m5)：网页编辑器可在编辑文件前把分支从原仓库复制到派生仓库，原先未检查用户是否仍能读取原仓库。已派生仓库但后来失去原仓库访问权限的用户，仍可读取原仓库的最新代码。由 [#40131](https://github.com/go-gitea/gitea/pull/40131) / [#40281](https://github.com/go-gitea/gitea/pull/40281) 修复。感谢 [@adamyordan](https://github.com/adamyordan) 报告问题，感谢 [@silverwind](https://github.com/silverwind) 提供补丁。
- [CVE-2026-118389](https://github.com/go-gitea/gitea/security/advisories/GHSA-49c9-hm8q-6rvq)：RubyGems 注册表接受平台或依赖字段含有换行符的 gem。由于紧凑索引按行解析，有权向注册表发布 gem 的用户可伪造索引条目。例如，用户可为已有 gem 添加包含自选依赖的新版本，使用该注册表解析依赖的客户端随后会安装这些依赖。该问题已在 28.3.0 修复，随本次发布披露。由 [#39782](https://github.com/go-gitea/gitea/pull/39782) / [#39900](https://github.com/go-gitea/gitea/pull/39900) 修复。感谢 [@nithissh7](https://github.com/nithissh7) 和 [@hariprasanth9317-tech](https://github.com/hariprasanth9317-tech) 报告问题，感谢 [@basavaraj-sm05](https://github.com/basavaraj-sm05) 提供补丁。
- [CVE-2026-129525](https://github.com/go-gitea/gitea/security/advisories/GHSA-qrrc-h266-v49p)：若干同时服务于工单和拉取请求的端点未检查条目类型。仅能读取某仓库工单的用户可能读到拉取请求数据，反过来也一样。API 中的工单子资源（时间线、附件、标签、订阅、工时记录及表情回应）已在 28.2.0 和 28.3.0 修复。本版修复了仓库工单搜索和里程碑页面。由 [#39839](https://github.com/go-gitea/gitea/pull/39839) / [#39847](https://github.com/go-gitea/gitea/pull/39847)、[#39885](https://github.com/go-gitea/gitea/pull/39885) / [#39938](https://github.com/go-gitea/gitea/pull/39938) 和 [#40192](https://github.com/go-gitea/gitea/pull/40192) / [#40375](https://github.com/go-gitea/gitea/pull/40375) 修复。感谢 [@hexcraft-labs](https://github.com/hexcraft-labs)、[@d3do-23](https://github.com/d3do-23)、[@takumi142857-git](https://github.com/takumi142857-git)、[@N0K0](https://github.com/N0K0)、[@zzy13051013697](https://github.com/zzy13051013697)、[@HexDump0](https://github.com/HexDump0) 和 [@123abab123789](https://github.com/123abab123789) 报告问题，感谢 [@basavaraj-sm05](https://github.com/basavaraj-sm05) 和 [@silverwind](https://github.com/silverwind) 提供补丁。
- [CVE-2026-128365](https://github.com/go-gitea/gitea/security/advisories/GHSA-74jf-6hjp-549c)：移除团队的评审请求时，系统以团队 ID 的负值查找评审，并将查到的评审标记为正式评审。对 ID 为 2 的团队，该负值对应内置 Actions 用户。拥有该团队的组织中，能够更改评审请求的用户可让 Actions 用户的批准计入所需的批准次数。由 [#40120](https://github.com/go-gitea/gitea/pull/40120) / [#40268](https://github.com/go-gitea/gitea/pull/40268) 修复。感谢 Anthropic 报告问题，感谢 [@silverwind](https://github.com/silverwind) 提供补丁。
- [CVE-2026-129337](https://github.com/go-gitea/gitea/security/advisories/GHSA-8cjj-9p56-j54f)：Git 通过 HTTP 提供服务时，由仓库服务器端钩子强制执行写权限检查。在迁移、派生或根据模板生成仓库期间，尚未建好的仓库还没有钩子，因此只有读取权限的用户也能在此期间向仓库推送。由 [#40120](https://github.com/go-gitea/gitea/pull/40120) / [#40268](https://github.com/go-gitea/gitea/pull/40268) 修复。感谢 Anthropic 报告问题，感谢 [@silverwind](https://github.com/silverwind) 提供补丁。
- [CVE-2026-129341](https://github.com/go-gitea/gitea/security/advisories/GHSA-jr33-w6w7-86vj)：删除附件的网页端点会跳过对上传者的权限检查，只要求其拥有工单或拉取请求的读取权限。上传 Release 资产的用户在失去写权限后仍能删除该资产。由 [#40120](https://github.com/go-gitea/gitea/pull/40120) / [#40268](https://github.com/go-gitea/gitea/pull/40268) 修复。感谢 Anthropic 报告问题，感谢 [@silverwind](https://github.com/silverwind) 提供补丁。
- [CVE-2026-120991](https://github.com/go-gitea/gitea/security/advisories/GHSA-q8pg-ggp9-rm9m)：容器 blob 上传被拒绝时（例如超出软件包大小配额），清理过程会从存储中移除该 blob，即使其他软件包已使用相同内容。在限制软件包配额的实例上，如果用户持有其他所有者的软件包文件或镜像层的完整相同内容，就可以使其无法下载。由 [#40120](https://github.com/go-gitea/gitea/pull/40120) / [#40268](https://github.com/go-gitea/gitea/pull/40268) 修复。感谢 Anthropic 报告问题，感谢 [@silverwind](https://github.com/silverwind) 提供补丁。
- [CVE-2026-123642](https://github.com/go-gitea/gitea/security/advisories/GHSA-9827-6wh6-634q)：AGit 流程（推送到 `refs/for/...`）创建拉取请求时未检查推送者的拉取请求权限。仅具有代码读权限或 Wiki 写权限的用户或部署密钥，可以在没有拉取请求访问权限的仓库中发起拉取请求。由 [#40131](https://github.com/go-gitea/gitea/pull/40131) / [#40281](https://github.com/go-gitea/gitea/pull/40281) 修复。感谢 Anthropic 报告问题，感谢 [@silverwind](https://github.com/silverwind) 提供补丁。
- [CVE-2026-125617](https://github.com/go-gitea/gitea/security/advisories/GHSA-7mr2-v9gc-4467)：`GET /api/v1/users/{username}/orgs/{org}/permissions` 会向任意已登录用户返回某用户在公开或受限组织中的角色，泄露原本隐藏的成员关系和权限级别。现在只有被查询的用户本人、组织成员及站点管理员可以获知这些角色。由 [#40042](https://github.com/go-gitea/gitea/pull/40042) / [#40365](https://github.com/go-gitea/gitea/pull/40365) 修复。感谢 [@Alien0ne](https://github.com/Alien0ne) 报告问题，感谢 [@basavaraj-sm05](https://github.com/basavaraj-sm05) 提供补丁。
- [CVE-2026-128359](https://github.com/go-gitea/gitea/security/advisories/GHSA-jrjr-q3rq-f899)：Gitea 作为 OAuth2 或 OpenID Connect 提供方时，令牌端点未检查用户状态。管理员停用账户或禁止其登录后，该账户持有的刷新令牌及未使用的授权码仍能换取新令牌，因此通过 Gitea 登录的应用仍会保留其登录状态。由 [#40131](https://github.com/go-gitea/gitea/pull/40131) / [#40281](https://github.com/go-gitea/gitea/pull/40281) 修复。感谢 [@yagcioglutoprak](https://github.com/yagcioglutoprak) 报告问题，感谢 [@silverwind](https://github.com/silverwind) 提供补丁。
- [CVE-2026-120725](https://github.com/go-gitea/gitea/security/advisories/GHSA-8pmc-9g44-v9gw)：设置 `REQUIRE_SIGNIN_VIEW = true` 时，未认证客户端只要知道仓库路径和对象的 SHA-256，Git LFS 端点仍会向其提供非私有仓库中的对象。由 [#40131](https://github.com/go-gitea/gitea/pull/40131) / [#40281](https://github.com/go-gitea/gitea/pull/40281) 修复。感谢 Anthropic 报告问题，感谢 [@silverwind](https://github.com/silverwind) 提供补丁。
- [CVE-2026-127958](https://github.com/go-gitea/gitea/security/advisories/GHSA-859w-9wv7-c5x9)：通过 API 创建草稿拉取请求评审时（`event` 设为 `PENDING` 或留空），系统会像处理已提交的评审一样，将草稿加入时间线、通知和活动订阅源。评审者提交评审前，任何能读取该拉取请求的人都能看到评审正文和行内评论。由 [#40260](https://github.com/go-gitea/gitea/pull/40260) / [#40272](https://github.com/go-gitea/gitea/pull/40272) 修复。感谢 Anthropic 报告问题，感谢 [@lazerg](https://github.com/lazerg) 提供补丁。

感谢所有以负责任的方式披露这些问题的安全研究人员。

## 重点修复

### Actions

- 计算作业的 `if:` 条件时会纳入同一轮处理内已完成的依赖作业（[#40126](https://github.com/go-gitea/gitea/pull/40126)）。具有仓库管理员权限的用户现在可以使用 Actions API（[#40174](https://github.com/go-gitea/gitea/pull/40174)）。

### 工单和拉取请求

- 并发创建工单通知时不会发生死锁（[#40166](https://github.com/go-gitea/gitea/pull/40166)）。里程碑截止日期为 `null` 时，API 不会触发 panic（[#40171](https://github.com/go-gitea/gitea/pull/40171)）。
- API 使用当前登录用户的身份锁定和解锁工单（[#40291](https://github.com/go-gitea/gitea/pull/40291)）。任务列表可识别用大写 `X` 标记为已完成的条目（[#40334](https://github.com/go-gitea/gitea/pull/40334)）。
- 复制的代码以文本形式粘贴，避免转成 Markdown 表格（[#40053](https://github.com/go-gitea/gitea/pull/40053)）。标签之间的间距保持一致（[#40261](https://github.com/go-gitea/gitea/pull/40261)）。标记渲染器在读取缓冲区的边界处正确转义字符（[#40209](https://github.com/go-gitea/gitea/pull/40209)）。

### 仓库、Git 和组织

- `post-receive` 钩子乱序到达时不会回退分支（[#40110](https://github.com/go-gitea/gitea/pull/40110)）。仓库在 `git push` 返回前标记为非空（[#40102](https://github.com/go-gitea/gitea/pull/40102)）。并发更新语言统计时不会发生死锁（[#40167](https://github.com/go-gitea/gitea/pull/40167)）。
- 从 Wiki 仓库读取 Wiki blob 的内容摘录（[#40165](https://github.com/go-gitea/gitea/pull/40165)）。API 返回已加星标和已关注仓库的编程语言（[#40127](https://github.com/go-gitea/gitea/pull/40127)）。
- 团队管理员权限会正确应用于团队成员（[#40353](https://github.com/go-gitea/gitea/pull/40353)）。API 禁止重命名组织的 Owners 团队（[#40381](https://github.com/go-gitea/gitea/pull/40381)）。
- 更改拉取镜像地址时，不会对新主机复用已保存的凭据（[#39991](https://github.com/go-gitea/gitea/pull/39991)）。

### 账户、软件包和审计

- 可以在个人资料设置中清空全名（[#40186](https://github.com/go-gitea/gitea/pull/40186)）。
- 接受 OCI 1.1 允许的容器镜像名称（[#40363](https://github.com/go-gitea/gitea/pull/40363)）。Chef 注册表在无依赖时返回空集合，替代 `null`（[#40237](https://github.com/go-gitea/gitea/pull/40237)）。
- 补记缺失的仓库及内容审计事件，例如通过 API 更改 webhook、分支保护、部署密钥和推送镜像的事件（[#40322](https://github.com/go-gitea/gitea/pull/40322)）。
- WebSocket 客户端同步更可靠（[#38847](https://github.com/go-gitea/gitea/pull/38847)），并修复了下拉菜单无障碍补丁中的内存泄漏（[#40349](https://github.com/go-gitea/gitea/pull/40349)）。

### 依赖项

- 升级 Docker 镜像中的 Alpine 基础软件包（[#40252](https://github.com/go-gitea/gitea/pull/40252)）。
- 将 `github.com/andybalholm/brotli` 更新至 v1.2.7（[#40246](https://github.com/go-gitea/gitea/pull/40246)）、`levelqueue` 更新至 v0.5.1（[#40219](https://github.com/go-gitea/gitea/pull/40219)），并将 `clippie` 更新至 4.3.1（[#40293](https://github.com/go-gitea/gitea/pull/40293)）。

本版包含 [41 个已合并的拉取请求](https://github.com/go-gitea/gitea/compare/v28.3.0...v28.4.0)，感谢社区的贡献。

## 安装或更新

请从 [Gitea 下载页面](https://dl.gitea.com/gitea/28.4.0/)获取预构建的二进制文件，并选择与平台兼容的版本。安装或升级步骤见[安装文档](https://docs.gitea.com/category/installation)。

## 特别致谢

感谢在 [Open Collective](https://opencollective.com/gitea) 上为我们提供资金支持的所有赞助者。

## 更新日志

## [28.4.0](https://github.com/go-gitea/gitea/releases/tag/v28.4.0) - 2026-11-15

### 改进

- *(websocket)* 改进客户端同步 ([#38847](https://github.com/go-gitea/gitea/pull/38847)) ([#40340](https://github.com/go-gitea/gitea/pull/40340))

### 缺陷修复

- *(api)* 返回已加星标和已关注仓库的编程语言 ([#40127](https://github.com/go-gitea/gitea/pull/40127)) ([#40157](https://github.com/go-gitea/gitea/pull/40157))
- *(web)* 从 Wiki 仓库读取 Wiki blob 的内容摘录 ([#40165](https://github.com/go-gitea/gitea/pull/40165)) ([#40178](https://github.com/go-gitea/gitea/pull/40178))
- *(actions)* 允许具有仓库管理员权限的用户使用 Actions API ([#40174](https://github.com/go-gitea/gitea/pull/40174)) ([#40180](https://github.com/go-gitea/gitea/pull/40180))
- *(repo)* 避免并发更新语言统计时发生死锁 ([#40167](https://github.com/go-gitea/gitea/pull/40167)) ([#40202](https://github.com/go-gitea/gitea/pull/40202))
- *(notifications)* 避免并发创建工单通知时发生死锁 ([#40166](https://github.com/go-gitea/gitea/pull/40166)) ([#40203](https://github.com/go-gitea/gitea/pull/40203))
- *(api)* 里程碑的 due_on 为 null 时避免触发 panic ([#40171](https://github.com/go-gitea/gitea/pull/40171))
- *(actions)* 计算作业的 `if:` 条件时纳入同一轮处理内已完成的依赖作业 ([#40126](https://github.com/go-gitea/gitea/pull/40126)) ([#40221](https://github.com/go-gitea/gitea/pull/40221))
- *(web)* 根据解析后的链接构造工单弹窗请求 ([#40207](https://github.com/go-gitea/gitea/pull/40207)) ([#40225](https://github.com/go-gitea/gitea/pull/40225))
- 允许在个人资料设置中清空全名 ([#40186](https://github.com/go-gitea/gitea/pull/40186)) ([#40191](https://github.com/go-gitea/gitea/pull/40191))
- *(packages)* Chef 软件包无依赖时返回空集合，替代 null ([#40237](https://github.com/go-gitea/gitea/pull/40237)) ([#40242](https://github.com/go-gitea/gitea/pull/40242))
- *(deps)* 将模块 github.com/andybalholm/brotli 更新至 v1.2.7 [安全] ([#40246](https://github.com/go-gitea/gitea/pull/40246)) ([#40249](https://github.com/go-gitea/gitea/pull/40249))
- 升级 Docker 镜像中的 Alpine 基础软件包 ([#40252](https://github.com/go-gitea/gitea/pull/40252)) ([#40253](https://github.com/go-gitea/gitea/pull/40253))
- 当 post-receive 钩子乱序执行时，避免分支回退 ([#40110](https://github.com/go-gitea/gitea/pull/40110)) ([#40255](https://github.com/go-gitea/gitea/pull/40255))
- *(repo)* 在 git push 返回前将仓库标记为非空 ([#40102](https://github.com/go-gitea/gitea/pull/40102)) ([#40266](https://github.com/go-gitea/gitea/pull/40266))
- 为多个处理程序和服务补上缺失的检查 ([#40120](https://github.com/go-gitea/gitea/pull/40120)) ([#40268](https://github.com/go-gitea/gitea/pull/40268))
- *(pull)* 通过 API 提交的评审处于待处理状态时，省略对应的时间线条目 ([#40260](https://github.com/go-gitea/gitea/pull/40260)) ([#40272](https://github.com/go-gitea/gitea/pull/40272))
- 将复制的代码以纯文本形式粘贴，避免转成 Markdown 表格 ([#40053](https://github.com/go-gitea/gitea/pull/40053)) ([#40280](https://github.com/go-gitea/gitea/pull/40280))
- *(deps)* 将 clippie 更新至 4.3.1 ([#40293](https://github.com/go-gitea/gitea/pull/40293))
- 加载工单弹窗时避免在控制台记录网络错误 ([#40288](https://github.com/go-gitea/gitea/pull/40288)) ([#40294](https://github.com/go-gitea/gitea/pull/40294))
- *(markup)* 修正读取缓冲区边界处的字符转义 ([#40209](https://github.com/go-gitea/gitea/pull/40209))
- *(api)* 使用当前登录用户的身份锁定和解锁工单，替代仓库所有者身份 ([#40291](https://github.com/go-gitea/gitea/pull/40291)) ([#40298](https://github.com/go-gitea/gitea/pull/40298))
- *(ui)* 统一标签之间的间距 ([#40261](https://github.com/go-gitea/gitea/pull/40261)) ([#40330](https://github.com/go-gitea/gitea/pull/40330))
- 为更多处理程序和服务补上缺失的检查 ([#40131](https://github.com/go-gitea/gitea/pull/40131)) ([#40281](https://github.com/go-gitea/gitea/pull/40281))
- 识别用大写 X 标记为已完成的任务列表项 ([#40334](https://github.com/go-gitea/gitea/pull/40334)) ([#40339](https://github.com/go-gitea/gitea/pull/40339))
- *(queue)* 将 levelqueue 升级至 v0.5.1，并移除临时解决方法 ([#40219](https://github.com/go-gitea/gitea/pull/40219)) ([#40350](https://github.com/go-gitea/gitea/pull/40350))
- *(web)* 修复下拉菜单 ARIA 补丁中的内存泄漏 ([#40349](https://github.com/go-gitea/gitea/pull/40349)) ([#40364](https://github.com/go-gitea/gitea/pull/40364))
- 按实际操作者的身份正确应用团队管理员权限 ([#40353](https://github.com/go-gitea/gitea/pull/40353)) ([#40356](https://github.com/go-gitea/gitea/pull/40356))
- *(packages)* 接受符合 OCI 1.1 的容器镜像名称 ([#40363](https://github.com/go-gitea/gitea/pull/40363)) ([#40369](https://github.com/go-gitea/gitea/pull/40369))
- *(api)* 对非组织成员隐藏组织角色 ([#40042](https://github.com/go-gitea/gitea/pull/40042)) ([#40365](https://github.com/go-gitea/gitea/pull/40365))
- *(git)* 使用 NUL 分隔受影响文件的列表，避免给特殊文件名加引号 ([#40362](https://github.com/go-gitea/gitea/pull/40362))
- *(repo)* 为新主机配置拉取镜像时避免复用原主机的凭据 ([#39991](https://github.com/go-gitea/gitea/pull/39991)) ([#40373](https://github.com/go-gitea/gitea/pull/40373))
- *(issues)* 在搜索和里程碑视图中隐藏当前用户无权读取的工单类型 ([#40192](https://github.com/go-gitea/gitea/pull/40192)) ([#40375](https://github.com/go-gitea/gitea/pull/40375))
- *(api)* 禁止重命名 Owners 团队 ([#40381](https://github.com/go-gitea/gitea/pull/40381)) ([#40387](https://github.com/go-gitea/gitea/pull/40387))
- *(repo)* 限制仓库搜索返回的提交状态字段 ([#40377](https://github.com/go-gitea/gitea/pull/40377)) ([#40384](https://github.com/go-gitea/gitea/pull/40384))
- *(audit)* 补记缺失的仓库和内容事件 ([#40322](https://github.com/go-gitea/gitea/pull/40322)) ([#40390](https://github.com/go-gitea/gitea/pull/40390))
- *(auth)* 按账户限制 TOTP 验证失败次数 ([#39993](https://github.com/go-gitea/gitea/pull/39993)) ([#40374](https://github.com/go-gitea/gitea/pull/40374))
- *(repo)* 自动初始化时跳过检出仓库中的现有内容 ([#40376](https://github.com/go-gitea/gitea/pull/40376)) ([#40383](https://github.com/go-gitea/gitea/pull/40383))

## 贡献者

- [@basavaraj-sm05](https://github.com/basavaraj-sm05)
- [@bircni](https://github.com/bircni)
- [@chesterXalan](https://github.com/chesterXalan)
- [@hktitof](https://github.com/hktitof)
- [@KENNYSOFT](https://github.com/KENNYSOFT)
- [@lazerg](https://github.com/lazerg)
- [@lunny](https://github.com/lunny)
- [@perfectra1n](https://github.com/perfectra1n)
- [@sandiyochristan](https://github.com/sandiyochristan)
- [@Shadow0Bit](https://github.com/Shadow0Bit)
- [@silverwind](https://github.com/silverwind)
- [@SudhanshuMatrix](https://github.com/SudhanshuMatrix)
- [@williamdes](https://github.com/williamdes)
- [@wxiaoguang](https://github.com/wxiaoguang)
- [@Zettat123](https://github.com/Zettat123)
