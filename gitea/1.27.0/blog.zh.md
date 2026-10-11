---
title: Gitea 1.27.0 官方发布博客（中文）
description: Gitea 1.27.0 正式发布博客的完整简体中文翻译。
---

# Gitea 1.27.0 正式发布

作者：bircni · 博客发布日期（UTC）：2026-07-12

> 本文为 [Gitea 官方发布博客](https://blog.gitea.com/release-of-1.27.0/) 的非官方简体中文翻译，由 ChatGPT 翻译，保留原文结构、代码与链接。原文及源代码来自 [Gitea Blog](https://gitea.com/gitea/blog/src/branch/main/content/post/gitea/release-of-1.27.0.md)，按 [Apache-2.0](../../licenses/gitea-blog-apache-2.0.md) 许可使用。本译文的修改为中文翻译；原作者署名如上。文中的历史版本更新日志属于博客原文，博客日期与 GitHub Release 日期分别保留。

我们很高兴地宣布 Gitea **v1.27.0** 正式发布。

Gitea 1.27.0 带来了新功能、性能优化和易用性改进。此版本还包含大量安全修复，强烈建议尽快升级，详情见[安全](#security)章节。以下介绍 Gitea 1.27 的部分重要变化和功能；完整列表请参阅[完整发布说明](#changelog)。

衷心感谢通过提交代码补丁、报告问题、翻译以及其他方式支持项目的所有参与者。

<!--more-->

:::info 将 Gitea 1.27 与 Gitea Runner 2.0.0 搭配使用
此版本的部分 Actions 功能会与 Runner 协商能力。要使用**作业总结**、过渡性的 **Cancelling** 作业状态以及正确的 **`continue-on-error`** 聚合，请将 Runner 升级到 **[Gitea Runner 2.0.0](https://blog.gitea.com/release-of-runner-2.0.0/)**。Gitea 在通信协议层面仍兼容旧版 Runner；当 Runner 未声明支持时，对应功能会被跳过。下方需要新版 Runner 的亮点均标有 **🔧 需要 Gitea Runner 2.0.0**。
:::

## 安全 {#security}

此版本修复以下安全漏洞，请尽快升级。

- CVE-2026-58443：仅公开仓库令牌可能更新私有 PR 的头分支。由 [#38406](https://github.com/go-gitea/gitea/pull/38406) 修复。感谢 [@ohxorud-dev](https://github.com/ohxorud-dev) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-58433：团队与仓库关联端点绕过组织的 `RepoAdminChangeTeamAccess` 设置。由 [#38324](https://github.com/go-gitea/gitea/pull/38324) 修复。感谢 [@de3erve](https://github.com/de3erve) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-58435：通过 LFS 部署密钥提升权限。由 [#38322](https://github.com/go-gitea/gitea/pull/38322) 修复。感谢 [@adrian-doyensec](https://github.com/adrian-doyensec) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-58436：以平方时间解析 `Accept-Language` 请求头，可导致未认证拒绝服务。由 [#38323](https://github.com/go-gitea/gitea/pull/38323) 修复。感谢 [@tonghuaroot](https://github.com/tonghuaroot) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-58437：可能通过 Git 推送选项修改仓库可见性。由 [#38323](https://github.com/go-gitea/gitea/pull/38323) 修复。感谢 [@prakhar0x01](https://github.com/prakhar0x01) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-58439：分支保护绕过：更改 PR 目标后保留过期的 `official` 批准标志。由 [#38319](https://github.com/go-gitea/gitea/pull/38319) 修复。感谢 [@yonatan-pl](https://github.com/yonatan-pl) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-54481：内部 API HTTP 客户端不再跳过 TLS 证书验证。由 [#38406](https://github.com/go-gitea/gitea/pull/38406) 修复。感谢 [@sanil18](https://github.com/sanil18) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-55987：对于不签发刷新令牌的认证源，OAuth2 登录可能重新激活被管理员停用的账户。由 [#38406](https://github.com/go-gitea/gitea/pull/38406) 修复。感谢 [@khoadb175](https://github.com/khoadb175) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-57894：仓库迁移在 URL 允许/阻止验证后跟随 Git HTTP 重定向，可导致内部仓库数据外泄。由 [#38320](https://github.com/go-gitea/gitea/pull/38320) 修复。感谢 [@cyberlanc3r](https://github.com/cyberlanc3r) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-58314：仓库迁移中的两项 SSRF 问题。由 [#38406](https://github.com/go-gitea/gitea/pull/38406) 修复。感谢 [@xclow3n](https://github.com/xclow3n) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-59765：迁移资源下载绕过主机匹配器产生 SSRF，可读取内部文件和云元数据。由 [#38406](https://github.com/go-gitea/gitea/pull/38406) 修复。感谢 [@tikket1](https://github.com/tikket1), [@theluckystrike](https://github.com/theluckystrike), [@Letian-aarch64](https://github.com/Letian-aarch64), [@JebeenLee](https://github.com/JebeenLee), [@JLLeitschuh](https://github.com/JLLeitschuh), [@pick](https://github.com/pick) 和 [@noobx123](https://github.com/noobx123) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-58416：派生仓库 PR 的 Actions 任务可能通过协作所有者分支读取第三个私有仓库。由 [#38214](https://github.com/go-gitea/gitea/pull/38214) 修复。感谢 [@CassianStarck](https://github.com/CassianStarck) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-58420：迁移恢复中的 `file://` URI 可导致本地文件包含。由 [#38215](https://github.com/go-gitea/gitea/pull/38215) 修复。感谢 [@isa0-gh](https://github.com/isa0-gh) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-58425：OAuth 令牌自省返回了签发给其他客户端的令牌元数据。由 [#38042](https://github.com/go-gitea/gitea/pull/38042) 修复。感谢 [@bl4cksku11](https://github.com/bl4cksku11) 报告问题，感谢 [@lunny](https://github.com/lunny) 提供补丁。
- CVE-2026-58427：私有组织成员列表可能通过 `/members` API 端点泄露。由 [#38213](https://github.com/go-gitea/gitea/pull/38213) 修复。感谢 [@Razzlemouse](https://github.com/Razzlemouse) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-58428：网页发布编辑表单可绕过发布附件扩展名允许名单。由 [#38314](https://github.com/go-gitea/gitea/pull/38314) 修复。感谢 [@bl4cksku11](https://github.com/bl4cksku11) 报告问题，感谢 [@lunny](https://github.com/lunny) 提供补丁。
- CVE-2026-58429：仅公开个人访问令牌可绕过组织和权限端点上的权限范围限制。由 [#38323](https://github.com/go-gitea/gitea/pull/38323) 修复。感谢 [@Pcat2003](https://github.com/Pcat2003) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-58431：团队 API 路由未执行仅公开 API 令牌限制。由 [#38323](https://github.com/go-gitea/gitea/pull/38323) 修复。感谢 [@rmb122](https://github.com/rmb122) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-58432：缺少授权检查，可通过用户控制的键访问敏感资源。由 [#38318](https://github.com/go-gitea/gitea/pull/38318) 修复。感谢 [@z3r0s6](https://github.com/z3r0s6) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-58438：移除 Issue 依赖时的跨仓库 IDOR，可使攻击者篡改并评论其无权访问的私有仓库。由 [#38324](https://github.com/go-gitea/gitea/pull/38324) 修复。感谢 [@de3erve](https://github.com/de3erve) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-58440：协作者创建的 Webhook 在其仓库访问权限撤销后仍继续触发。由 [#38324](https://github.com/go-gitea/gitea/pull/38324) 修复。感谢 [@sec-reex](https://github.com/sec-reex) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-58441：`restore-repo` 中未经清理的克隆 URL 导致 SSRF。由 [#38324](https://github.com/go-gitea/gitea/pull/38324) 修复。感谢 [@yoojoon2](https://github.com/yoojoon2) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-58442：通过多答案 DNS 绕过允许名单，在仓库迁移中实施 SSRF。由 [#38324](https://github.com/go-gitea/gitea/pull/38324) 修复。感谢 [@Tomer-PL](https://github.com/Tomer-PL) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-58444：仓库首页的个人访问令牌权限范围执行绕过，可泄露私有仓库内容。由 [#38406](https://github.com/go-gitea/gitea/pull/38406) 修复。感谢 [@StarPlatinu](https://github.com/StarPlatinu) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-42931：npm 软件包标签端点无限制读取请求体，可导致拒绝服务。由 [#38406](https://github.com/go-gitea/gitea/pull/38406) 修复。感谢 [@Tricta](https://github.com/Tricta) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-50105：RSS/Atom 动态处理器绕过 API 令牌权限范围和仅公开限制。由 [#38406](https://github.com/go-gitea/gitea/pull/38406) 修复。感谢 [@CassianStarck](https://github.com/CassianStarck) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-55982：OIDC userinfo 端点未强制检查 API 令牌权限范围即返回身份声明。由 [#38406](https://github.com/go-gitea/gitea/pull/38406) 修复。感谢 [@ybsun0215](https://github.com/ybsun0215) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-55986：邮箱管理 API 绕过管理凭据功能限制。由 [#38406](https://github.com/go-gitea/gitea/pull/38406) 修复。感谢 [@martijnperdaan52](https://github.com/martijnperdaan52) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-56443：对有限可见性所有者仍存在仅公开令牌权限范围绕过。由 [#38323](https://github.com/go-gitea/gitea/pull/38323) 修复。感谢 [@JebeenLee](https://github.com/JebeenLee) 和 [@alecclyde](https://github.com/alecclyde) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-56654：通过 API 中访问令牌权限范围升级提升权限。由 [#38406](https://github.com/go-gitea/gitea/pull/38406) 修复。感谢 [@AdamKorcz](https://github.com/AdamKorcz) 和 [@ohxorud-dev](https://github.com/ohxorud-dev) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-56657：SSH 密钥解析器中的拒绝服务。由 [#38406](https://github.com/go-gitea/gitea/pull/38406) 修复。感谢 [@AdamKorcz](https://github.com/AdamKorcz) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-56755：Debian 软件包上传中平方级字符串拼接引发拒绝服务。由 [#38406](https://github.com/go-gitea/gitea/pull/38406) 修复。感谢 [@AdamKorcz](https://github.com/AdamKorcz) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-57886：跨仓库重新关联 Issue 和评论附件可能暴露私有附件内容。由 [#38406](https://github.com/go-gitea/gitea/pull/38406) 修复。感谢 [@zulloper](https://github.com/zulloper) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-57897：组织级 Actions 运行/作业 API 存在跨仓库信息泄露。由 [#38406](https://github.com/go-gitea/gitea/pull/38406) 修复。感谢 [@prakhar0x01](https://github.com/prakhar0x01) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-58507：go-get 元数据端点泄露私有仓库是否存在。由 [#38406](https://github.com/go-gitea/gitea/pull/38406) 修复。感谢 [@prakhar0x01](https://github.com/prakhar0x01) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-58508：迁移/镜像中的两项 SSRF 问题，涉及 DNS 重绑定和缺少重新验证。由 [#38406](https://github.com/go-gitea/gitea/pull/38406) 修复。感谢 [@AmerMrkaljevic](https://github.com/AmerMrkaljevic) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-58510：仓库关注清理修复未应用于 API `EditRepo` 路径，仓库变为私有后留下过期关注关系。由 [#38406](https://github.com/go-gitea/gitea/pull/38406) 修复。感谢 [@eddieran](https://github.com/eddieran) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-59763：未限制的 Arch 软件包文件元数据可在上传时放大资源消耗。由 [#38406](https://github.com/go-gitea/gitea/pull/38406) 修复。感谢 [@kkkh1](https://github.com/kkkh1) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-23603：OAuth2 头像同步未验证 OIDC `picture` 声明，可导致盲 SSRF。由 [#38406](https://github.com/go-gitea/gitea/pull/38406) 修复。感谢 [@alimezar](https://github.com/alimezar) 报告问题，另收到以下人员的报告：[@cwanglab](https://github.com/cwanglab), [@Vext-Labs](https://github.com/Vext-Labs), [@Medoedus](https://github.com/Medoedus), [@ffulbtech](https://github.com/ffulbtech), [@theluckystrike](https://github.com/theluckystrike), [@prakhar0x01](https://github.com/prakhar0x01), [@AnuragBathani](https://github.com/AnuragBathani) 和 [@khoadb175](https://github.com/khoadb175),，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-58417：REST API 暴露私有组织成员关系。由 [#38145](https://github.com/go-gitea/gitea/pull/38145) 修复。感谢 [@maluff](https://github.com/maluff), [@Sai2r](https://github.com/Sai2r) 和 [@mgelde](https://github.com/mgelde) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-58434：撤销访问权限后仍能访问私有仓库元数据。由 [#38321](https://github.com/go-gitea/gitea/pull/38321) 修复。感谢 [@ybsun0215](https://github.com/ybsun0215) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-58445：删除 Issue 标签 API 存在跨仓库标签 ID 枚举探测。由 [#38406](https://github.com/go-gitea/gitea/pull/38406) 修复。感谢 [@CassianStarck](https://github.com/CassianStarck) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-55984：AddTime API 中的空指针解引用可导致已认证拒绝服务。由 [#38406](https://github.com/go-gitea/gitea/pull/38406) 修复。感谢 [@martijnperdaan52](https://github.com/martijnperdaan52) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-56750：“记住我”令牌未正确失效，可复用会话。由 [#38406](https://github.com/go-gitea/gitea/pull/38406) 修复。感谢 [@AdamKorcz](https://github.com/AdamKorcz) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- CVE-2026-58511：Webhook 授权请求头通过 API 以明文返回。由 [#38406](https://github.com/go-gitea/gitea/pull/38406) 修复。感谢 [@theluckystrike](https://github.com/theluckystrike) 和 [@APhuongKMA](https://github.com/APhuongKMA) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。

此版本还包含以下额外安全加固修复：

- 已撤销权限的用户不再能通过用户 `starred`/`times` API 端点读取私有仓库对象或 Issue 标题。由 [#38324](https://github.com/go-gitea/gitea/pull/38324) 修复。感谢 [@sec-reex](https://github.com/sec-reex) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- 为软件包增加私有/内部标记，并修复 Composer 软件包源权限检查。由 [#37610](https://github.com/go-gitea/gitea/pull/37610) 修复。感谢 [@JoshBolding](https://github.com/JoshBolding) 和 [@sec-reex](https://github.com/sec-reex) 报告问题，感谢 [@lunny](https://github.com/lunny) 提供补丁。
- 通过 API 保存的 AWS 凭据现在经过加密。由 [#37679](https://github.com/go-gitea/gitea/pull/37679) 修复。感谢 [@Exgene](https://github.com/Exgene) 提供补丁。
- 将 `github.com/go-git/go-git/v5` 更新到 v5.19.1，以纳入上游安全修复 ([#37786](https://github.com/go-gitea/gitea/pull/37786)).

感谢负责任披露这些问题的所有安全研究人员。

## 如何更新

例如，可以从[下载页面](https://dl.gitea.com/gitea/1.27.0/)获取此版本。安装详情请阅读[安装指南](https://docs.gitea.com/1.27/category/installation)。升级时，请像往常一样先备份数据，然后替换二进制文件或 Docker 容器并重新启动。

## 特别致谢

感谢 [Open Collective](https://opencollective.com/gitea) 上为项目持续提供资金支持的所有支持者。

与往常一样，我们按对用户和管理员的重要性降序排列更改，将最重要的更改放在最前面。

> **正在寻找简单顺畅的 Git 仓库管理方案？欢迎了解 [Gitea Cloud](https://cloud.gitea.com)，改善你的开发体验。**

## 主要破坏性变更 {#major-breaking-changes}

### :warning: 将发布产物签名迁移到 Sigstore ([#38250](https://github.com/go-gitea/gitea/pull/38250))

Gitea 发布产物现在使用 Sigstore 签名，替代之前的 GPG 流程。如果部署流水线会验证下载的二进制文件或 Docker 镜像，请将验证步骤更新为基于 Sigstore 的流程。

感谢 **[@TheFox0x7](https://github.com/TheFox0x7)** 贡献此更改。

### :warning: 改进可复用工作流支持 ([#37478](https://github.com/go-gitea/gitea/pull/37478))

通过 `uses:` 引用的可复用工作流现在由 Gitea 端解析，而非 Runner。每个被调用的子作业都作为独立 `ActionRunJob` 插入，并作为独立任务调度，因此被调用方日志显示为单独作业条目，不再内联到调用方的 "Set up job" 步骤。升级后请检查依赖可复用工作流行为的工作流。

不再支持**外部可复用工作流**（`uses: https://other-gitea-instance/OWNER/REPO/.gitea/workflows/test.yaml@REF`）。如需继续使用，请将仓库克隆到本地实例并引用本地仓库。

感谢 **[@Zettat123](https://github.com/Zettat123)** 贡献此更改。

### :warning: 使用 Content-Security-Policy 脚本 nonce ([#37232](https://github.com/go-gitea/gitea/pull/37232))

行内脚本现在通过每次请求的 CSP nonce 获准执行，而非更宽泛的策略。注入行内 `<script>` 标签的自定义模板、主题或嵌入内容可能停止执行，需要更新为携带 nonce。升级后请检查前端自定义内容。

感谢 **[@wxiaoguang](https://github.com/wxiaoguang)** 贡献此更改。

### :warning: 默认发送 `X-Content-Type-Options: nosniff` ([#37354](https://github.com/go-gitea/gitea/pull/37354))

所有响应现在包含 `X-Content-Type-Options: nosniff` 请求头，防止浏览器通过 MIME 嗅探偏离声明的 `Content-Type`。如果反向代理、嵌入或自定义资源依赖内容嗅探，可以在 `[security]` 下设置 `X_CONTENT_TYPE_OPTIONS = unset` 移除该响应头，或按需覆盖其值。

感谢 **[@SAY-5](https://github.com/SAY-5)** 贡献此更改。

## 主要亮点（Actions）

### :rocket: 可复用工作流成为一等作业 ([#37478](https://github.com/go-gitea/gitea/pull/37478))

通过 `uses:` 调用的工作流现在由 Gitea 自身解析，而非 Runner。每个被调用工作流都展开为自己的作业，并作为独立任务调度：在运行侧边栏中有独立条目、独立日志，并在依赖图中成为调用方作业下的独立节点。被调用方输出不再内联到调用方 "Set up job" 步骤，因此可复用工作流内部失败时可以直接定位到失败作业。嵌套调用也采用相同方式，输出、输入和矩阵作业可跨调用边界传播。

![运行侧边栏和依赖图中分别列出的可复用工作流作业](https://blog.gitea.com/demos/37478/1.png)
![展开的嵌套可复用工作流，各有独立作业和日志](https://blog.gitea.com/demos/37478/2.png)

:::info
这改变了现有行为，详见“主要破坏性变更”中的“改进可复用工作流支持”。不再支持通过 URL 引用的外部可复用工作流（`uses: https://other-instance/OWNER/REPO/...`）。
:::

感谢 **[@Zettat123](https://github.com/Zettat123)** 贡献此功能。

### :rocket: 🔧 作业总结 —— `GITHUB_STEP_SUMMARY` ([#37500](https://github.com/go-gitea/gitea/pull/37500))

工作流步骤可以向 `GITHUB_STEP_SUMMARY` 写入 Markdown，Gitea 会在运行的 **Summary** 视图中渲染。总结存储于数据库，而非可下载产物；后续完善也使总结界面更丰富 ([#37824](https://github.com/go-gitea/gitea/pull/37824)).

:::info
上传总结**🔧 需要 Gitea Runner 2.0.0**。Gitea 声明 `job-summary` 能力；使用旧 Runner 时不会上传任何内容，Summary 视图保持为空。
:::

![Actions 运行 Summary 视图中的 Markdown 作业总结](https://blog.gitea.com/demos/37500/1.png)

感谢 **[@bircni](https://github.com/bircni)** 贡献此功能。

### :rocket: 🔧 实现 `jobs.<job_id>.continue-on-error` ([#38100](https://github.com/go-gitea/gitea/pull/38100))

之前会从 YAML 解析 `continue-on-error`，但计算运行整体状态时忽略该值，因此允许失败的作业仍可能导致整个运行失败。Gitea 现在按作业保存此值，聚合工作流运行时将允许的失败视为成功，与 GitHub Actions 一致。

:::info
允许作业失败**🔧 需要 Gitea Runner 2.0.0**；运行状态聚合由 Gitea 1.27 提供。
:::

感谢 **[@bircni](https://github.com/bircni)** 贡献此功能。

### :rocket: 🔧 工作流取消时运行 post/cleanup 步骤 ([#37275](https://github.com/go-gitea/gitea/pull/37275))

取消运行现在会执行运行后清理以及 `always()` / `cancelled()` 步骤，在最终将作业标记为已取消前，先进入过渡性的 **Cancelling** 作业状态。

:::info
过渡性的 **Cancelling** 状态和能力协商**🔧 需要 Gitea Runner 2.0.0**。旧 Runner 仍可取消作业，但不具备完整服务端语义。
:::

感谢 **[@KalashThakare](https://github.com/KalashThakare)**、**[@bircni](https://github.com/bircni)** 和 **[@Zettat123](https://github.com/Zettat123)** 贡献此功能。

### :rocket: 所有者级和全局范围工作流 ([#38154](https://github.com/go-gitea/gitea/pull/38154))

可以在所有者（组织/用户）级和整个实例定义工作流，共享自动化不再需要复制到每个仓库。

![组织设置中的范围工作流来源配置](https://blog.gitea.com/demos/38154/1.png)
![Actions 列表中的所有者级和全局工作流](https://blog.gitea.com/demos/38154/2.png)

感谢 **[@Zettat123](https://github.com/Zettat123)** 贡献此功能。

### :rocket: 在管理界面批量删除、禁用和启用 Runner ([#37869](https://github.com/go-gitea/gitea/pull/37869))

通过管理员 Runner 列表同时管理多个 Runner，无需逐个操作。

![管理员 Runner 列表中的批量禁用、启用和删除操作](https://blog.gitea.com/demos/37869/1.png)

感谢 **[@bircni](https://github.com/bircni)** 贡献此功能。

### :rocket: 工作流状态徽章弹窗 ([#38196](https://github.com/go-gitea/gitea/pull/38196))

可以从 Actions 界面的弹窗中获取工作流状态徽章的 Markdown/HTML 片段。

![提供 Markdown 和 HTML 片段的工作流状态徽章弹窗](https://blog.gitea.com/demos/38196/1.png)

感谢 **[@guanzi008](https://github.com/guanzi008)** 贡献此功能。

### :rocket: 在浏览器标签页图标显示运行状态 ([#38071](https://github.com/go-gitea/gitea/pull/38071))

运行视图会在浏览器标签页图标反映当前作业状态，并设置描述性标签标题（[#37870](https://github.com/go-gitea/gitea/pull/37870)），方便从其他标签页观察运行。

![浏览器标签页图标反映运行状态](https://blog.gitea.com/demos/38071/1.png)

感谢 **[@bircni](https://github.com/bircni)** 贡献此功能。

### :rocket: 列出曾运行但已从默认分支移除的工作流 ([#37835](https://github.com/go-gitea/gitea/pull/37835))

默认分支中已不存在的历史工作流仍会列出，便于找到过去的运行。

![从默认分支移除的工作流在 Actions 侧边栏归入“其他工作流”](https://blog.gitea.com/demos/37835/1.png)

感谢 **[@bircni](https://github.com/bircni)** 贡献此功能。

## 主要亮点（代码和仓库）

### :rocket: Jupyter Notebook（`.ipynb`）渲染 ([#37433](https://github.com/go-gitea/gitea/pull/37433))

Notebook 文件在文件视图中显示格式化输出，而非原始 JSON。

![仓库文件视图中渲染的 Jupyter Notebook 与 Matplotlib 输出](https://blog.gitea.com/demos/37433/1.png)

感谢 **[@karthikbhandary2](https://github.com/karthikbhandary2)** 贡献此功能。

### :rocket: 允许 Issue 和 PR 归属多个项目 ([#36784](https://github.com/go-gitea/gitea/pull/36784))

Issue 和 PR 现在可以属于多个项目，新的列选择器允许直接从侧边栏选择归属列 ([#37037](https://github.com/go-gitea/gitea/pull/37037)).

![Issue 侧边栏显示其归属多个项目](https://blog.gitea.com/demos/36784/1.png)
![Issue 侧边栏的项目列选择器](https://blog.gitea.com/demos/37037/1.png)

感谢 **[@icyavocado](https://github.com/icyavocado)** 和 **[@myers](https://github.com/myers)** 贡献这些功能。

### :rocket: 堆叠头像 ([#37594](https://github.com/go-gitea/gitea/pull/37594))

重叠堆叠的头像可以紧凑展示相关人员，例如受理人、参与者及类似列表。

![不同人数下的重叠头像堆叠](https://blog.gitea.com/demos/37594/1.png)

感谢 **[@bircni](https://github.com/bircni)** 贡献此功能。

### :rocket: 文件提交历史中的“跟随重命名” ([#34994](https://github.com/go-gitea/gitea/pull/34994))

文件提交历史列表可以跨重命名跟踪文件，历史不再止于重命名处。

![文件提交历史启用和禁用“包含重命名”的对比](https://blog.gitea.com/demos/34994/1.png)

感谢 **[@Chi-Iroh](https://github.com/Chi-Iroh)** 贡献此功能。

### :rocket: Markdown 围栏代码块支持更多语法 ([#37154](https://github.com/go-gitea/gitea/pull/37154))

识别更多围栏代码块语言及信息字符串，用于语法高亮。

感谢 **[@wxiaoguang](https://github.com/wxiaoguang)** 贡献此改进。

## 主要亮点（组织和团队）

### :rocket: 团队可见性，方便组织成员发现团队 ([#37680](https://github.com/go-gitea/gitea/pull/37680))

可以让组织成员发现团队，更容易找到合适团队并申请加入。

![普通成员看到的组织团队列表](https://blog.gitea.com/demos/37680/1.png)

感谢 **[@bircni](https://github.com/bircni)** 贡献此功能。

### :rocket: 组织成员标签页搜索框 ([#37347](https://github.com/go-gitea/gitea/pull/37347))

直接在组织成员页筛选大型成员列表。

![组织成员标签页搜索框](https://blog.gitea.com/demos/37347/1.png)

感谢 **[@lunny](https://github.com/lunny)** 贡献此功能。

### :rocket: 将仓库创建数量限制拆分为用户和组织范围 ([#37872](https://github.com/go-gitea/gitea/pull/37872))

可以分别设置个人账户和组织的仓库创建数量限制。

感谢 **[@Zettat123](https://github.com/Zettat123)** 贡献此功能。

## 主要亮点（API）

### :rocket: 在 `/openapi.v1.json` 提供 OpenAPI 3.0 规范 ([#37038](https://github.com/go-gitea/gitea/pull/37038))

Gitea 发布 API 的 OpenAPI 3.0 描述，供工具和客户端生成使用。

感谢 **[@myers](https://github.com/myers)** 贡献此功能。

### :rocket: 令牌自省和自删除端点 ([#37995](https://github.com/go-gitea/gitea/pull/37995))

新 API 端点可以自省当前令牌，并允许令牌删除自身。

感谢 **[@TheFox0x7](https://github.com/TheFox0x7)** 贡献此功能。

### :rocket: 受理人 API ([#37330](https://github.com/go-gitea/gitea/pull/37330))

通过 API 管理 Issue 和 PR 受理人。

感谢 **[@lunny](https://github.com/lunny)** 贡献此功能。

### :rocket: 列出指定工作流的运行 ([#37196](https://github.com/go-gitea/gitea/pull/37196))

`GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs` 列出指定工作流的运行。

感谢 **[@bn-zr](https://github.com/bn-zr)** 贡献此功能。

### :rocket: 服务端分支筛选及比较的原始 diff/patch ([#37982](https://github.com/go-gitea/gitea/pull/37982)) ([#37632](https://github.com/go-gitea/gitea/pull/37632)) ([#38148](https://github.com/go-gitea/gitea/pull/38148))

列出分支的 API 新增 `q` 筛选，比较增加原始 diff/patch 端点，并接受引用后缀。

感谢 **[@HarshMN2345](https://github.com/HarshMN2345)**、**[@grafail](https://github.com/grafail)** 和 **[@eyupcanakman](https://github.com/eyupcanakman)** 贡献这些功能。

## 主要亮点（其他）

### :rocket: OAuth2 重定向 URI 支持自定义 URI 方案 ([#37356](https://github.com/go-gitea/gitea/pull/37356))

OAuth2 应用可以注册使用自定义 URI 方案的重定向 URI，适合原生和桌面应用的常见需求。

感谢 **[@wxiaoguang](https://github.com/wxiaoguang)** 贡献此功能。

### :rocket: 自动生成额外 SSH 主机密钥 ([#33974](https://github.com/go-gitea/gitea/pull/33974))

Gitea 可以自动为内置 SSH 服务器生成额外主机密钥。

感谢 **[@TheFox0x7](https://github.com/TheFox0x7)** 贡献此功能。

### :rocket: OpenSearch 支持和基于 REST 的搜索客户端 ([#37411](https://github.com/go-gitea/gitea/pull/37411))

用 REST API 客户端替代 `olivere/elastic` 依赖，在 Elasticsearch 之外增加 OpenSearch 支持。

感谢 **[@silverwind](https://github.com/silverwind)** 贡献此改进。

### :rocket: Telegram Bot API 10.1 富消息 Webhook ([#38298](https://github.com/go-gitea/gitea/pull/38298))

Telegram Webhook 使用更新的 Bot API 富消息格式。

感谢 **[@SudhanshuMatrix](https://github.com/SudhanshuMatrix)** 贡献此功能。

## 更新日志 {#changelog}

- 破坏性变更
  - 改进可复用工作流支持 ([#37478](https://github.com/go-gitea/gitea/pull/37478))
  - 在 Content-Security-Policy 中使用脚本 nonce ([#37232](https://github.com/go-gitea/gitea/pull/37232))

- 安全
  - 多项安全修复 ([#38406](https://github.com/go-gitea/gitea/pull/38406)) ([#38426](https://github.com/go-gitea/gitea/pull/38426))
  - 加强访问检查和迁移验证 ([#38324](https://github.com/go-gitea/gitea/pull/38324)) ([#38400](https://github.com/go-gitea/gitea/pull/38400))
  - 强制检查仅公开令牌权限范围，加强推送选项和语言解析 ([#38323](https://github.com/go-gitea/gitea/pull/38323)) ([#38399](https://github.com/go-gitea/gitea/pull/38399))
  - 目标分支改变时重新评估评审的正式标志 ([#38319](https://github.com/go-gitea/gitea/pull/38319)) ([#38402](https://github.com/go-gitea/gitea/pull/38402))
  - 防止撤销访问权限后继续泄露私有仓库元数据 ([#38321](https://github.com/go-gitea/gitea/pull/38321)) ([#38390](https://github.com/go-gitea/gitea/pull/38390))
  - 跨仓库 LFS 对象要求持有证明 ([#38322](https://github.com/go-gitea/gitea/pull/38322)) ([#38389](https://github.com/go-gitea/gitea/pull/38389))
  - 拉取镜像同步时禁用 HTTP 重定向 ([#38320](https://github.com/go-gitea/gitea/pull/38320)) ([#38367](https://github.com/go-gitea/gitea/pull/38367))
  - 修复 Go HTML 模板 URL 转义 ([#38363](https://github.com/go-gitea/gitea/pull/38363)) ([#38369](https://github.com/go-gitea/gitea/pull/38369))
  - 网页附件重命名时验证允许的类型 ([#38314](https://github.com/go-gitea/gitea/pull/38314)) ([#38328](https://github.com/go-gitea/gitea/pull/38328))
  - 网页下载端点限制草稿发布附件的访问 ([#38318](https://github.com/go-gitea/gitea/pull/38318)) ([#38325](https://github.com/go-gitea/gitea/pull/38325))
  - 将 github.com/go-git/go-git/v5 更新到 v5.19.1 [security] ([#37786](https://github.com/go-gitea/gitea/pull/37786))
  - 将令牌自省限制在令牌所属客户端 ([#38042](https://github.com/go-gitea/gitea/pull/38042))
  - 不通过 public_members 暴露私有组织成员关系 ([#38145](https://github.com/go-gitea/gitea/pull/38145))
  - 拒绝派生仓库 PR 通过协作所有者跨仓库访问 ([#38214](https://github.com/go-gitea/gitea/pull/38214))
  - 防止恢复仓库时的路径遍历 ([#38215](https://github.com/go-gitea/gitea/pull/38215))

- 新功能
  - 增加工作流状态徽章弹窗 ([#38196](https://github.com/go-gitea/gitea/pull/38196))
  - 支持所有者级和全局范围的工作流 ([#38154](https://github.com/go-gitea/gitea/pull/38154))
  - 比较 API 支持引用后缀 ([#38148](https://github.com/go-gitea/gitea/pull/38148))
  - 实现 `jobs.<job_id>.continue-on-error` ([#38100](https://github.com/go-gitea/gitea/pull/38100))
  - 在浏览器标签页图标中显示运行状态 ([#38071](https://github.com/go-gitea/gitea/pull/38071))
  - 增加令牌自省及自删除端点 ([#37995](https://github.com/go-gitea/gitea/pull/37995))
  - 为列出分支的 API 增加 q 参数，支持服务端筛选 ([#37982](https://github.com/go-gitea/gitea/pull/37982))
  - 将仓库创建数量限制拆分为用户和组织范围 ([#37872](https://github.com/go-gitea/gitea/pull/37872))
  - 在管理界面批量删除、禁用和启用 Runner ([#37869](https://github.com/go-gitea/gitea/pull/37869))
  - 列出曾执行过但已从默认分支移除的工作流 ([#37835](https://github.com/go-gitea/gitea/pull/37835))
  - 增加团队可见性，允许组织成员发现团队 ([#37680](https://github.com/go-gitea/gitea/pull/37680))
  - 为仓库比较增加原始 diff/patch 端点 ([#37632](https://github.com/go-gitea/gitea/pull/37632))
  - 增加堆叠头像 ([#37594](https://github.com/go-gitea/gitea/pull/37594))
  - 增加作业总结（GITHUB_STEP_SUMMARY） ([#37500](https://github.com/go-gitea/gitea/pull/37500))
  - 增加 Jupyter Notebook（.ipynb）渲染支持 ([#37433](https://github.com/go-gitea/gitea/pull/37433))
  - 支持 OAuth2 重定向 URI 中的自定义 URI 方案 ([#37356](https://github.com/go-gitea/gitea/pull/37356))
  - 为组织成员标签页增加搜索框 ([#37347](https://github.com/go-gitea/gitea/pull/37347))
  - 增加受理人 API ([#37330](https://github.com/go-gitea/gitea/pull/37330))
  - 增加 `GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs` ([#37196](https://github.com/go-gitea/gitea/pull/37196))
  - 在 /openapi.v1.json 提供 OpenAPI 3.0 规范 ([#37038](https://github.com/go-gitea/gitea/pull/37038))
  - 在 Issue 和 PR 侧边栏增加项目列选择器 ([#37037](https://github.com/go-gitea/gitea/pull/37037))
  - 允许 Issue 和 PR 归属多个项目 ([#36784](https://github.com/go-gitea/gitea/pull/36784))
  - 文件提交历史列表支持“跟随重命名” ([#34994](https://github.com/go-gitea/gitea/pull/34994))
  - 自动生成额外 SSH 密钥 ([#33974](https://github.com/go-gitea/gitea/pull/33974))

- 改进
  - 仅为必需的状态上下文创建“工作流被筛掉”的提交状态 ([#38371](https://github.com/go-gitea/gitea/pull/38371)) ([#38385](https://github.com/go-gitea/gitea/pull/38385))
  - 允许覆盖内置默认 Git 配置选项 ([#38172](https://github.com/go-gitea/gitea/pull/38172))
  - 允许 MathML 核心元素 ([#38034](https://github.com/go-gitea/gitea/pull/38034))
  - 改进 Issue 标题渲染 ([#37908](https://github.com/go-gitea/gitea/pull/37908))
  - 在运行视图设置描述性浏览器标签标题 ([#37870](https://github.com/go-gitea/gitea/pull/37870))
  - 将剩余 gopkg.in/yaml.v3 用法迁移至 go.yaml.in/yaml/v4 ([#37866](https://github.com/go-gitea/gitea/pull/37866))
  - 显示 YAML 中的工作流名称而非文件名 ([#37833](https://github.com/go-gitea/gitea/pull/37833))
  - 在 PR synchronize 事件载荷中增加 before/after ([#37827](https://github.com/go-gitea/gitea/pull/37827))
  - 为运行列表增加分支筛选 ([#37826](https://github.com/go-gitea/gitea/pull/37826))
  - 改进总结界面样式，显示更多信息 ([#37824](https://github.com/go-gitea/gitea/pull/37824))
  - 为 Action 步骤标题增加复制按钮，改进其他复制按钮 ([#37744](https://github.com/go-gitea/gitea/pull/37744))
  - 使用 repo-forked 图标显示派生仓库数量 ([#37731](https://github.com/go-gitea/gitea/pull/37731))
  - 为作业列表端点增加 sort 和 order 查询参数 ([#37672](https://github.com/go-gitea/gitea/pull/37672))
  - 为仓库 API 增加 last_sync ([#37566](https://github.com/go-gitea/gitea/pull/37566))
  - 调整工作流图样式 ([#37497](https://github.com/go-gitea/gitea/pull/37497))
  - 改进代码编辑器文本选择，清理 lint 启用逻辑 ([#37474](https://github.com/go-gitea/gitea/pull/37474))
  - 为仓库编辑 API 和设置增加镜像认证更新 ([#37468](https://github.com/go-gitea/gitea/pull/37468))
  - 用 REST API 客户端替代 `olivere/elastic`，增加 OpenSearch 支持 ([#37411](https://github.com/go-gitea/gitea/pull/37411))
  - 增加默认 PR 分支更新方式设置 ([#37410](https://github.com/go-gitea/gitea/pull/37410))
  - 修复未登录状态下仓库标题按钮禁用样式不一致 ([#37406](https://github.com/go-gitea/gitea/pull/37406))
  - 要求签名提交时允许仅快进合并 ([#37335](https://github.com/go-gitea/gitea/pull/37335))
  - 改进 Actions 页面样式 ([#37323](https://github.com/go-gitea/gitea/pull/37323))
  - 改进 Actions 状态图标和文字 ([#37206](https://github.com/go-gitea/gitea/pull/37206))
  - Markdown 围栏代码块支持更多语法 ([#37154](https://github.com/go-gitea/gitea/pull/37154))
  - 按 JobID 和 Name 排序 Action 运行作业，并提供矩阵示例 ([#37046](https://github.com/go-gitea/gitea/pull/37046))
  - 增加回复 PR 评审评论的 API 端点 ([#36683](https://github.com/go-gitea/gitea/pull/36683))

- 性能
  - 对 Runner 心跳写入去抖，限制任务领取频率 ([#38281](https://github.com/go-gitea/gitea/pull/38281)) ([#38368](https://github.com/go-gitea/gitea/pull/38368))
  - 尽可能按仓库范围索引排序 action_run 查询 ([#38155](https://github.com/go-gitea/gitea/pull/38155))
  - 修复多项性能回归 ([#38078](https://github.com/go-gitea/gitea/pull/38078))
  - 为 Action 的 `c_u` 索引增加 `created_unix`，加快仪表盘动态 ([#38076](https://github.com/go-gitea/gitea/pull/38076))
  - 在 Actions 运行、作业和任务 API 端点批量加载关联数据 ([#37032](https://github.com/go-gitea/gitea/pull/37032))

- 问题修复
  - 拒绝时间估算单位之间的无效字符 ([#38416](https://github.com/go-gitea/gitea/pull/38416)) ([#38423](https://github.com/go-gitea/gitea/pull/38423))
  - 将已删除的受理团队表示为幽灵团队 ([#38413](https://github.com/go-gitea/gitea/pull/38413)) ([#38419](https://github.com/go-gitea/gitea/pull/38419))
  - 通过已配置代理验证 Turnstile 验证码 ([#38412](https://github.com/go-gitea/gitea/pull/38412)) ([#38420](https://github.com/go-gitea/gitea/pull/38420))
  - 提交状态待定时刷新 PR 合并框 ([#38410](https://github.com/go-gitea/gitea/pull/38410)) ([#38411](https://github.com/go-gitea/gitea/pull/38411))
  - 修复 Actions 任务状态并发更新 ([#38405](https://github.com/go-gitea/gitea/pull/38405)) ([#38409](https://github.com/go-gitea/gitea/pull/38409))
  - 分支名过长时保持工作流运行末尾内容位于同一行 ([#38382](https://github.com/go-gitea/gitea/pull/38382)) ([#38403](https://github.com/go-gitea/gitea/pull/38403))
  - 贡献日历提示使用符合区域设置的日期格式 ([#38398](https://github.com/go-gitea/gitea/pull/38398)) ([#38401](https://github.com/go-gitea/gitea/pull/38401))
  - 修复共同作者检测 ([#38392](https://github.com/go-gitea/gitea/pull/38392)) ([#38397](https://github.com/go-gitea/gitea/pull/38397))
  - 修复提交页错误的共同作者检测 ([#38386](https://github.com/go-gitea/gitea/pull/38386)) ([#38387](https://github.com/go-gitea/gitea/pull/38387))
  - 恢复提交表格列宽 ([#38379](https://github.com/go-gitea/gitea/pull/38379)) ([#38383](https://github.com/go-gitea/gitea/pull/38383))
  - 修复 MinIO 初始化检查 ([#38355](https://github.com/go-gitea/gitea/pull/38355)) ([#38361](https://github.com/go-gitea/gitea/pull/38361))
  - 修复组织项目视图受理人列表 ([#38357](https://github.com/go-gitea/gitea/pull/38357)) ([#38360](https://github.com/go-gitea/gitea/pull/38360))
  - `FetchTask` 期间上下文取消时释放已领取任务 ([#38343](https://github.com/go-gitea/gitea/pull/38343)) ([#38347](https://github.com/go-gitea/gitea/pull/38347))
  - 使 Runner 列表分页顺序确定 ([#38313](https://github.com/go-gitea/gitea/pull/38313)) ([#38327](https://github.com/go-gitea/gitea/pull/38327))
  - 改进为 X-Total-Count 统计提交时的 since/until 处理 ([#38243](https://github.com/go-gitea/gitea/pull/38243)) ([#38304](https://github.com/go-gitea/gitea/pull/38304))
  - 启用时间戳时避免折叠箭头与日志文本重叠 ([#38227](https://github.com/go-gitea/gitea/pull/38227)) ([#38307](https://github.com/go-gitea/gitea/pull/38307))
  - 修复工作流使用 on: paths 筛选时分支保护状态检查失败的问题 ([#38237](https://github.com/go-gitea/gitea/pull/38237)) ([#38302](https://github.com/go-gitea/gitea/pull/38302))
  - 在自动关联账户的 2FA 流程中保存 linkAccountData ([#38274](https://github.com/go-gitea/gitea/pull/38274)) ([#38295](https://github.com/go-gitea/gitea/pull/38295))
  - 允许 Actions 机器人推送到受保护分支 ([#38284](https://github.com/go-gitea/gitea/pull/38284)) ([#38293](https://github.com/go-gitea/gitea/pull/38293))
  - 状态筛选包含所有可聚合的运行状态 ([#38280](https://github.com/go-gitea/gitea/pull/38280)) ([#38287](https://github.com/go-gitea/gitea/pull/38287))
  - 使用可序列化的仓库归档队列载荷 ([#38273](https://github.com/go-gitea/gitea/pull/38273)) ([#38283](https://github.com/go-gitea/gitea/pull/38283))
  - 更新 npm 依赖，修复细节问题 ([#38257](https://github.com/go-gitea/gitea/pull/38257))
  - 为 X-Total-Count 统计提交时遵循 since/until ([#38204](https://github.com/go-gitea/gitea/pull/38204))
  - 修复 CodeMirror 回归问题 ([#38248](https://github.com/go-gitea/gitea/pull/38248))
  - 所有 API GET 端点支持 HEAD 请求 ([#38245](https://github.com/go-gitea/gitea/pull/38245))
  - 清理工作流状态徽章代码 ([#38241](https://github.com/go-gitea/gitea/pull/38241))
  - 工作流名称较长时正确对齐“已禁用”标签 ([#38240](https://github.com/go-gitea/gitea/pull/38240))
  - 防止链接化 URL 时吞入 HTML 实体 ([#38239](https://github.com/go-gitea/gitea/pull/38239))
  - 接受字符串形式的 npm "repository" 和 "bin" ([#38236](https://github.com/go-gitea/gitea/pull/38236))
  - 修复取消正在取消的任务时的 500 错误 ([#38223](https://github.com/go-gitea/gitea/pull/38223))
  - 将 golang.org/x/image 更新到 v0.43.0 [security] ([#38219](https://github.com/go-gitea/gitea/pull/38219))
  - 将 MSSQL 旧的 DATETIME 列转换为 DATETIME2 ([#38216](https://github.com/go-gitea/gitea/pull/38216))
  - 禁止通过 /members 枚举私有组织成员 ([#38213](https://github.com/go-gitea/gitea/pull/38213))
  - 确保大型工作流中所有等待作业都能获得 Runner ([#38200](https://github.com/go-gitea/gitea/pull/38200))
  - 更新 Go 依赖 ([#38194](https://github.com/go-gitea/gitea/pull/38194))
  - 更新 npm 依赖 ([#38193](https://github.com/go-gitea/gitea/pull/38193))
  - 机器人用户的 must-change-password 默认设为 false ([#38175](https://github.com/go-gitea/gitea/pull/38175))
  - 在运行视图显示运行索引，修复总结图高度 ([#38165](https://github.com/go-gitea/gitea/pull/38165))
  - 修复 CSP ([#38162](https://github.com/go-gitea/gitea/pull/38162))
  - 更新 npm 依赖 ([#38123](https://github.com/go-gitea/gitea/pull/38123))
  - 扩展 MSSQL 旧的 Issue 和评论长文本列 ([#38120](https://github.com/go-gitea/gitea/pull/38120))
  - 验证 Debian distribution 和 component 名称 ([#38116](https://github.com/go-gitea/gitea/pull/38116))
  - 在 goproxy ParsePackage 中验证模块版本 ([#38104](https://github.com/go-gitea/gitea/pull/38104))
  - 将 esbuild 依赖更新到 v0.28.1 [security] ([#38097](https://github.com/go-gitea/gitea/pull/38097))
  - 修复 Git 推送 post-receive 钩子 ([#38089](https://github.com/go-gitea/gitea/pull/38089))
  - 防止提交状态弹窗溢出所在行 ([#38081](https://github.com/go-gitea/gitea/pull/38081))
  - 在 RubyGems parseMetadataFile 中验证 gem 名称 ([#38061](https://github.com/go-gitea/gitea/pull/38061))
  - 修复提交显示名称 ([#38057](https://github.com/go-gitea/gitea/pull/38057))
  - 修复 CSP 回归问题 ([#38047](https://github.com/go-gitea/gitea/pull/38047))
  - 修复 API 错误消息 ([#38031](https://github.com/go-gitea/gitea/pull/38031))
  - 更新 npm 依赖 ([#38029](https://github.com/go-gitea/gitea/pull/38029))
  - 修复 PostgreSQL lint ([#38022](https://github.com/go-gitea/gitea/pull/38022))
  - 修复 Issue 搜索中的受理人筛选 ([#38021](https://github.com/go-gitea/gitea/pull/38021))
  - 修复多种下拉菜单问题 ([#38020](https://github.com/go-gitea/gitea/pull/38020))
  - 重构 Git 错误处理，归档流处理支持不存在的提交 ID ([#38007](https://github.com/go-gitea/gitea/pull/38007))
  - 将 Git 最低要求提高到 2.13 ([#37996](https://github.com/go-gitea/gitea/pull/37996))
  - 移除 Cache-Control 响应头中的 "no-transfrom" ([#37985](https://github.com/go-gitea/gitea/pull/37985))
  - 将 github.com/google/go-github/v87 更新到 v88 ([#37971](https://github.com/go-gitea/gitea/pull/37971))
  - 尽可能默认使用提交者时间 ([#37969](https://github.com/go-gitea/gitea/pull/37969))
  - 更新 npm 依赖，移除 nolyfill ([#37968](https://github.com/go-gitea/gitea/pull/37968))
  - 更新 Go 依赖 ([#37967](https://github.com/go-gitea/gitea/pull/37967))
  - 保留压缩合并消息的尾注和额外提交消息 ([#37954](https://github.com/go-gitea/gitea/pull/37954))
  - 将 golang.org/x/image 更新到 v0.41.0 [security] ([#37904](https://github.com/go-gitea/gitea/pull/37904))
  - 在 Action 运行界面支持 ##[command] 日志前缀 ([#37882](https://github.com/go-gitea/gitea/pull/37882))
  - 将 github.com/google/go-github/v86 更新到 v87 ([#37845](https://github.com/go-gitea/gitea/pull/37845))
  - 更新 npm 依赖 ([#37844](https://github.com/go-gitea/gitea/pull/37844))
  - 更新 Go 依赖 ([#37841](https://github.com/go-gitea/gitea/pull/37841))
  - 按清单源路径解析 Vite 资源 ([#37836](https://github.com/go-gitea/gitea/pull/37836))
  - 替换硬编码文本 ([#37788](https://github.com/go-gitea/gitea/pull/37788))
  - 按关联仓库解析软件包 Markdown 相对链接 ([#37676](https://github.com/go-gitea/gitea/pull/37676))
  - 持久保存镜像仓库元数据 ([#37519](https://github.com/go-gitea/gitea/pull/37519))
  - 通过模拟内置路径修复命令测试 ([#37369](https://github.com/go-gitea/gitea/pull/37369))
  - 为部分表单增加 `form-fetch-action`，修复“fetch action”响应问题 ([#37305](https://github.com/go-gitea/gitea/pull/37305))
  - 工作流取消时执行运行后清理 ([#37275](https://github.com/go-gitea/gitea/pull/37275))
  - 修复 `relative-time` 错误，改进全局错误处理器 ([#37241](https://github.com/go-gitea/gitea/pull/37241))
  - 重构闪现消息，移除 SanitizeHTML 模板函数 ([#37179](https://github.com/go-gitea/gitea/pull/37179))

- 测试
  - 修复 PDF 文件渲染端到端测试中的竞态 ([#38380](https://github.com/go-gitea/gitea/pull/38380)) ([#38381](https://github.com/go-gitea/gitea/pull/38381))
  - 在 `TestInitKeys` 中比较密钥文件内容，而非 `FileInfo` ([#38330](https://github.com/go-gitea/gitea/pull/38330)) ([#38331](https://github.com/go-gitea/gitea/pull/38331))
  - 加快两个测试 ([#37905](https://github.com/go-gitea/gitea/pull/37905))
  - 修复随机失败的测试 ([#37887](https://github.com/go-gitea/gitea/pull/37887))
  - 修复不稳定的 `issue-comment` 关闭测试 ([#37880](https://github.com/go-gitea/gitea/pull/37880))
  - 为 SQLite 集成测试启用 WAL ([#37861](https://github.com/go-gitea/gitea/pull/37861))
  - 修复不稳定的 `TestResourceIndex` 并缩短运行时间 ([#37847](https://github.com/go-gitea/gitea/pull/37847))
  - 通过本地克隆源离线运行 `TestAPIRepoMigrate` ([#37817](https://github.com/go-gitea/gitea/pull/37817))
  - 对测试分片，减少冗余工作 ([#37618](https://github.com/go-gitea/gitea/pull/37618))
  - 通过容器运行 Playwright 端到端测试 ([#37300](https://github.com/go-gitea/gitea/pull/37300))
  - 移除迁移测试中的外部服务依赖 ([#36866](https://github.com/go-gitea/gitea/pull/36866))

- 构建
  - 夜间远程构建前认证 Snapcraft ([#38252](https://github.com/go-gitea/gitea/pull/38252))
  - 限制 db-tests 中的 Elasticsearch 堆大小 ([#37816](https://github.com/go-gitea/gitea/pull/37816))
  - 通过 Actions 向 Snapcraft 发布夜间版本 ([#37814](https://github.com/go-gitea/gitea/pull/37814))
  - 将 PostgreSQL 分片拆分为普通作业，去重设置 Action ([#37802](https://github.com/go-gitea/gitea/pull/37802))
  - 缩小 files-changed 前端筛选范围 ([#37749](https://github.com/go-gitea/gitea/pull/37749))
  - 为 `lint-actions` 增加 `zizmor` ([#37720](https://github.com/go-gitea/gitea/pull/37720))
  - 清理 "contrib" 目录 ([#37690](https://github.com/go-gitea/gitea/pull/37690))
  - 修复 Snap 构建（main 分支） ([#37685](https://github.com/go-gitea/gitea/pull/37685))
  - 同时检查 JSON5 文件 ([#37659](https://github.com/go-gitea/gitea/pull/37659))
  - 扩展网页代码编辑器中的语言检测 ([#37619](https://github.com/go-gitea/gitea/pull/37619))
  - 将 pnpm 更新到 v11 ([#37591](https://github.com/go-gitea/gitea/pull/37591))
  - 从 `nektos/act` 派生仓库迁移到 `gitea/runner` ([#37557](https://github.com/go-gitea/gitea/pull/37557))
  - 检查直接使用的 `fill`/`stroke` 颜色，为 Git 图颜色序列增加变量 ([#37543](https://github.com/go-gitea/gitea/pull/37543))
  - 更新 Go、JavaScript 和 Python 依赖 ([#37525](https://github.com/go-gitea/gitea/pull/37525))
  - 使用 commitlint 检查 PR 标题 ([#37498](https://github.com/go-gitea/gitea/pull/37498))
  - 将开发容器镜像中的 Go 版本升级到 1.26 ([#37374](https://github.com/go-gitea/gitea/pull/37374))
  - 将 GitHub Actions 更新到最新主版本 ([#37313](https://github.com/go-gitea/gitea/pull/37313))
  - 更新 Go 和 JavaScript 依赖 ([#37312](https://github.com/go-gitea/gitea/pull/37312))
  - 通过 NODE_ENV=test 使 Vite 在遇到 Rolldown 警告时构建失败 ([#37270](https://github.com/go-gitea/gitea/pull/37270))
  - 移除 htmx ([#37224](https://github.com/go-gitea/gitea/pull/37224))
  - 用 `golangci-lint fmt` 替代自定义 Go 格式化器 ([#37194](https://github.com/go-gitea/gitea/pull/37194))
  - 重构 htmx 和 fetch-action 相关代码 ([#37186](https://github.com/go-gitea/gitea/pull/37186))
  - 集成 Renovate 机器人，管理所有依赖更新 ([#37050](https://github.com/go-gitea/gitea/pull/37050))
  - 签名迁移到 Sigstore ([#38250](https://github.com/go-gitea/gitea/pull/38250))

- 文档
  - 更新 1.26.3 和 1.26.4 的更新日志文档 ([#38178](https://github.com/go-gitea/gitea/pull/38178))
  - 修复 foreachref 文档注释中的重复词 ([#38161](https://github.com/go-gitea/gitea/pull/38161))
  - 澄清成为合并者的条件 ([#38113](https://github.com/go-gitea/gitea/pull/38113))
  - 发布 2026 年 TOC 选举结果 ([#38111](https://github.com/go-gitea/gitea/pull/38111))
  - 在 attributes 中将 openapi3 标记为自动生成 ([#37963](https://github.com/go-gitea/gitea/pull/37963))
  - 增加开发环境设置指南 ([#37960](https://github.com/go-gitea/gitea/pull/37960))

- 其他
  - 还原签名变更，恢复 GPG ([#38251](https://github.com/go-gitea/gitea/pull/38251))
  - 用 `link-action` 替代旧的 `delete-button` ([#38143](https://github.com/go-gitea/gitea/pull/38143))
  - 从 proto 字段读取 Runner 能力 ([#38068](https://github.com/go-gitea/gitea/pull/38068))
  - 澄清 APIError 消息用法，修复旧的 lint 错误 ([#38012](https://github.com/go-gitea/gitea/pull/38012))
  - 用 db.Get[] 替代 db.GetEngine(ctx).Get(bean)，防止零值读取错误数据库记录 ([#37977](https://github.com/go-gitea/gitea/pull/37977))
  - 更新 Go 依赖 ([#37851](https://github.com/go-gitea/gitea/pull/37851))
  - 修复从 Conventional Commit 标题同步 PR 标签 ([#37784](https://github.com/go-gitea/gitea/pull/37784)) ([#37825](https://github.com/go-gitea/gitea/pull/37825))
  - 调整 `files-changed`，增加 `free-disk-space` ([#37819](https://github.com/go-gitea/gitea/pull/37819))
  - 将 golang.org/x/crypto 更新到 v0.52.0 [security] ([#37806](https://github.com/go-gitea/gitea/pull/37806))
  - 增加评论、发布、标星、PR 和派生的端到端测试 ([#37800](https://github.com/go-gitea/gitea/pull/37800))
  - 简化 Issue 和 PR 模板 ([#37799](https://github.com/go-gitea/gitea/pull/37799))
  - 更新 giteabot，修复回移失败 ([#37789](https://github.com/go-gitea/gitea/pull/37789))
  - 妥善处理推送镜像同步中的部分失败 ([#37782](https://github.com/go-gitea/gitea/pull/37782))
  - 将 gitlab.com/gitlab-org/api/client-go/v2 更新到 v2.26.0 ([#37771](https://github.com/go-gitea/gitea/pull/37771))
  - 拆分 giteabot 工作流 ([#37770](https://github.com/go-gitea/gitea/pull/37770))
  - 更新 npm 依赖 ([#37768](https://github.com/go-gitea/gitea/pull/37768))
  - 用 WaitGroup.Go 替代 Add/Done goroutine ([#37764](https://github.com/go-gitea/gitea/pull/37764))
  - 将 google.golang.org/grpc 更新到 v1.81.1 ([#37762](https://github.com/go-gitea/gitea/pull/37762))
  - 修复缓存相关问题 ([#37761](https://github.com/go-gitea/gitea/pull/37761))
  - 修复测试 ([#37760](https://github.com/go-gitea/gitea/pull/37760))
  - 将 github.com/google/go-github/v85 更新到 v86 ([#37754](https://github.com/go-gitea/gitea/pull/37754))
  - 更新 npm 依赖 ([#37753](https://github.com/go-gitea/gitea/pull/37753))
  - 更新 Go 依赖 ([#37752](https://github.com/go-gitea/gitea/pull/37752))
  - 更新 Action 依赖 ([#37751](https://github.com/go-gitea/gitea/pull/37751))
  - 为缩进代码块增加包装，支持代码复制按钮 ([#37748](https://github.com/go-gitea/gitea/pull/37748))
  - 引入 db.Session 和 db.EngineMigration 接口 ([#37746](https://github.com/go-gitea/gitea/pull/37746))
  - 在仓库列表中同时显示 PR 数量 ([#37739](https://github.com/go-gitea/gitea/pull/37739))
  - 正则编译使用 strings.Builder ([#37730](https://github.com/go-gitea/gitea/pull/37730))
  - 移除四个过时的 doctor 检查实现 ([#37728](https://github.com/go-gitea/gitea/pull/37728))
  - 简化所有者团队组织仓库创建逻辑 ([#37727](https://github.com/go-gitea/gitea/pull/37727))
  - 将 `workflowpattern` 移至 `modules/actions` ([#37717](https://github.com/go-gitea/gitea/pull/37717))
  - 清理测试 ([#37715](https://github.com/go-gitea/gitea/pull/37715))
  - 修复界面细节 ([#37691](https://github.com/go-gitea/gitea/pull/37691))
  - 增加 ShellCheck linter ([#37682](https://github.com/go-gitea/gitea/pull/37682))
  - 发现并修复更多 lint 问题 ([#37674](https://github.com/go-gitea/gitea/pull/37674))
  - 将 Mermaid 依赖更新到 v11.15.0 [security]，增加端到端测试 ([#37662](https://github.com/go-gitea/gitea/pull/37662))
  - 更新 npm 依赖 ([#37647](https://github.com/go-gitea/gitea/pull/37647))
  - Go 主版本升级时更新导入路径 ([#37641](https://github.com/go-gitea/gitea/pull/37641))
  - 更新 Go 依赖主版本 ([#37639](https://github.com/go-gitea/gitea/pull/37639))
  - 更新 Action 依赖主版本 ([#37638](https://github.com/go-gitea/gitea/pull/37638))
  - 将 code.gitea.io/sdk/gitea 更新到 v0.25.0 ([#37637](https://github.com/go-gitea/gitea/pull/37637))
  - 更新 npm 依赖 ([#37636](https://github.com/go-gitea/gitea/pull/37636))
  - 用 log.Error 替代 log.Critical ([#37624](https://github.com/go-gitea/gitea/pull/37624))
  - 将 fast-uri 从 3.1.0 升级到 3.1.2 ([#37616](https://github.com/go-gitea/gitea/pull/37616))
  - 支持 AWS Cognito OAuth2 提供程序 ([#37607](https://github.com/go-gitea/gitea/pull/37607))
  - 更新 Action 依赖 ([#37603](https://github.com/go-gitea/gitea/pull/37603))
  - PR 标题检查允许 `chore` 类型 ([#37575](https://github.com/go-gitea/gitea/pull/37575))
  - 仅当数据库表数据发生变化时重置表 ([#37573](https://github.com/go-gitea/gitea/pull/37573))
  - 提高 Renovate 运行频率，修复 RENOVATE_ALLOWED_POST_UPGRADE_COMMANDS ([#37565](https://github.com/go-gitea/gitea/pull/37565))
  - 默认使用 modernc SQLite 驱动 ([#37562](https://github.com/go-gitea/gitea/pull/37562))
  - 修复 CHANGELOG.md 的四处拼写错误 ([#37549](https://github.com/go-gitea/gitea/pull/37549))
  - 更新 Go 依赖 ([#37541](https://github.com/go-gitea/gitea/pull/37541))
  - 更新 Action 依赖 ([#37540](https://github.com/go-gitea/gitea/pull/37540))
  - 重构 PR 视图（6） ([#37522](https://github.com/go-gitea/gitea/pull/37522))
  - 将早期 CLI 控制台日志重定向到标准错误 ([#37507](https://github.com/go-gitea/gitea/pull/37507))
  - 将 "flex-list" 重构为 "flex-divided-list" ([#37505](https://github.com/go-gitea/gitea/pull/37505))
  - 重构比较差异/PR 页面（1） ([#37481](https://github.com/go-gitea/gitea/pull/37481))
  - 重构 PR 视图（4） ([#37451](https://github.com/go-gitea/gitea/pull/37451))
  - 在 main 中更新 1.26.1 更新日志 ([#37442](https://github.com/go-gitea/gitea/pull/37442))
  - 在 `Repository` 结构中使用具名 `Permission` 字段，替代匿名嵌入 ([#37441](https://github.com/go-gitea/gitea/pull/37441))
  - 通过 `/assets/site-manifest.json` 端点提供站点清单 ([#37405](https://github.com/go-gitea/gitea/pull/37405))
  - 移除 IsValidExternalURL/IsAPIURL，在调用处使用 IsValidURL ([#37364](https://github.com/go-gitea/gitea/pull/37364))
  - 更新 `Block a user` 表单 ([#37359](https://github.com/go-gitea/gitea/pull/37359))
  - 将评审请求函数移至独立文件 ([#37358](https://github.com/go-gitea/gitea/pull/37358))
  - 默认设置 X-Content-Type-Options: nosniff ([#37354](https://github.com/go-gitea/gitea/pull/37354))
  - 启用严格 TypeScript，增加 `errorMessage` 辅助函数 ([#37292](https://github.com/go-gitea/gitea/pull/37292))
  - 将前端 `tw-justify-between` 布局重构为 `flex-left-right` ([#37291](https://github.com/go-gitea/gitea/pull/37291))
  - 更新 Nix flake ([#37284](https://github.com/go-gitea/gitea/pull/37284))
  - 修复仓库转移页面 ([#37277](https://github.com/go-gitea/gitea/pull/37277))
  - 移除 `SubmitEvent` polyfill ([#37276](https://github.com/go-gitea/gitea/pull/37276))
  - 移除 `deadcode` 工具发现的无效代码 ([#37271](https://github.com/go-gitea/gitea/pull/37271))
  - 将 go-git 升级到 v5.18.0 ([#37268](https://github.com/go-gitea/gitea/pull/37268))
  - 不添加影响更新日志生成的无用标签 ([#37267](https://github.com/go-gitea/gitea/pull/37267))
  - 将热力图改为自有代码 ([#37262](https://github.com/go-gitea/gitea/pull/37262))
  - 简化集成测试代码 ([#37249](https://github.com/go-gitea/gitea/pull/37249))
  - 为组织团队列表增加分页和搜索框 ([#37245](https://github.com/go-gitea/gitea/pull/37245))
  - 移除加密随机数辅助函数及调用处的错误返回值 ([#37240](https://github.com/go-gitea/gitea/pull/37240))
  - 为 OAuth2 OIDC 认证源增加 `ExternalIDClaim` 选项 ([#37229](https://github.com/go-gitea/gitea/pull/37229))
  - 简化 ParseCatFileTreeLine 和 catBatchParseTreeEntries ([#37210](https://github.com/go-gitea/gitea/pull/37210))
  - 将 "htmx" 重构为 "fetch action" ([#37208](https://github.com/go-gitea/gitea/pull/37208))
  - 更新 Go、JavaScript 和 Python 依赖 ([#37204](https://github.com/go-gitea/gitea/pull/37204))
  - 补充“用户活动时间”设计说明 ([#37195](https://github.com/go-gitea/gitea/pull/37195))
  - 移除过时的 RunUser 逻辑 ([#37180](https://github.com/go-gitea/gitea/pull/37180))
  - 为所有 YAML 测试数据文件增加“请勿添加更多测试数据”注释 ([#37150](https://github.com/go-gitea/gitea/pull/37150))
  - 更新 JavaScript 依赖 ([#37142](https://github.com/go-gitea/gitea/pull/37142))
  - 更新 Go 依赖 ([#37141](https://github.com/go-gitea/gitea/pull/37141))
  - 前移合并 v1.26.0-rc0 更新日志 ([#37138](https://github.com/go-gitea/gitea/pull/37138))
  - 引入 `ActionRunAttempt` 表示一次运行的每次执行 ([#37119](https://github.com/go-gitea/gitea/pull/37119))
  - 悬停显示工作流产物信息 ([#37100](https://github.com/go-gitea/gitea/pull/37100))
  - 将 Issue 上下文弹窗扩展到 Markdown 内容之外 ([#36908](https://github.com/go-gitea/gitea/pull/36908))
  - 为组织增加批量删除仓库功能 ([#36763](https://github.com/go-gitea/gitea/pull/36763))
  - 为分支保护增加绕过允许名单 ([#36514](https://github.com/go-gitea/gitea/pull/36514))


## 此版本的贡献者

感谢帮助此版本顺利发布的所有贡献者！

* [@0xGREG](https://github.com/0xGREG)
* [@6543](https://github.com/6543)
* [@afahey03](https://github.com/afahey03)
* [@agyss](https://github.com/agyss)
* [@antialias](https://github.com/antialias)
* [@augustocbx](https://github.com/augustocbx)
* [@bircni](https://github.com/bircni)
* [@BLumia](https://github.com/BLumia)
* [@bn-zr](https://github.com/bn-zr)
* [@bytedream](https://github.com/bytedream)
* [@chethenry](https://github.com/chethenry)
* [@Chi-Iroh](https://github.com/Chi-Iroh)
* [@cyphercodes](https://github.com/cyphercodes)
* [@dawidgora](https://github.com/dawidgora)
* [@delvh](https://github.com/delvh)
* [@eliroca](https://github.com/eliroca)
* [@Exgene](https://github.com/Exgene)
* [@eyupcanakman](https://github.com/eyupcanakman)
* [@fwag](https://github.com/fwag)
* [@g7](https://github.com/g7)
* [@grafail](https://github.com/grafail)
* [@guanzi008](https://github.com/guanzi008)
* [@harryzcy](https://github.com/harryzcy)
* [@HarshMN2345](https://github.com/HarshMN2345)
* [@icyavocado](https://github.com/icyavocado)
* [@jasonlearst](https://github.com/jasonlearst)
* [@JoeGruffins](https://github.com/JoeGruffins)
* [@jorgeortiz85](https://github.com/jorgeortiz85)
* [@KalashThakare](https://github.com/KalashThakare)
* [@karthikbhandary2](https://github.com/karthikbhandary2)
* [@keshane](https://github.com/keshane)
* [@krjakbrjak](https://github.com/krjakbrjak)
* [@lavamini](https://github.com/lavamini)
* [@lunny](https://github.com/lunny)
* [@maximilize](https://github.com/maximilize)
* [@metiftikci](https://github.com/metiftikci)
* [@metsw24-max](https://github.com/metsw24-max)
* [@Mohit25022005](https://github.com/Mohit25022005)
* [@mohsek](https://github.com/mohsek)
* [@mtschoen](https://github.com/mtschoen)
* [@myers](https://github.com/myers)
* [@nschloe](https://github.com/nschloe)
* [@pandareen](https://github.com/pandareen)
* [@peyremorgan](https://github.com/peyremorgan)
* [@PineBale](https://github.com/PineBale)
* [@pisarz77](https://github.com/pisarz77)
* [@Pomidorry](https://github.com/Pomidorry)
* [@Powerscore](https://github.com/Powerscore)
* [@premsreelathasugeendran](https://github.com/premsreelathasugeendran)
* [@prettysunflower](https://github.com/prettysunflower)
* [@puni9869](https://github.com/puni9869)
* [@pycub](https://github.com/pycub)
* [@rootful](https://github.com/rootful)
* [@rremer](https://github.com/rremer)
* [@s3onghyun](https://github.com/s3onghyun)
* [@SaveTheRbtz](https://github.com/SaveTheRbtz)
* [@SAY-5](https://github.com/SAY-5)
* [@sebastianertz](https://github.com/sebastianertz)
* [@silverwind](https://github.com/silverwind)
* [@Sumit189](https://github.com/Sumit189)
* [@SuperSandro2000](https://github.com/SuperSandro2000)
* [@techknowlogick](https://github.com/techknowlogick)
* [@thatguyfig](https://github.com/thatguyfig)
* [@TheFox0x7](https://github.com/TheFox0x7)
* [@tht](https://github.com/tht)
* [@wxiaoguang](https://github.com/wxiaoguang)
* [@xingxing21](https://github.com/xingxing21)
* [@Zettat123](https://github.com/Zettat123)
* [@ZPascal](https://github.com/ZPascal)
