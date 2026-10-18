---
title: Gitea 28.2.0 官方发布博客（中文）
description: Gitea 28.2.0 正式发布博客的完整简体中文翻译。
---

# Gitea 28.2.0 正式发布

作者：bircni · 博客发布日期（UTC）：2026-10-18

> 本文为 [Gitea 官方发布博客](https://blog.gitea.com/release-of-28.2.0/) 的非官方简体中文翻译，由 ChatGPT 翻译，保留原文结构、代码与链接。原文及源代码来自 [Gitea Blog](https://gitea.com/gitea/blog/src/branch/main/content/post/gitea/release-of-28.2.0.md)，按 [Apache-2.0](../../licenses/gitea-blog-apache-2.0.md) 许可使用。本译文的修改为中文翻译；原作者署名如上。文中的历史版本更新日志属于博客原文，博客日期与 GitHub Release 日期分别保留。

我们很高兴宣布发布 **Gitea 28.2.0**，这是 28 系列的第二个维护版本。它包含安全修复，以及 Actions、拉取请求、认证和软件包方面的多项问题修复。强烈建议所有用户尽快升级。

<!--more-->

## 安全

此版本修复以下安全漏洞，请尽快升级。

- [CVE-2026-109553](https://github.com/go-gitea/gitea/security/advisories/GHSA-vcp6-2qc6-gvq3)：SSH 证书的主体名称（principal）在所有已存储的公钥中查找，而非仅在主体名称密钥中查找。因此，当受信任的用户 CA 接受任意主体名称时，将其他用户的公钥列为主体名称的证书就能以该用户身份通过认证。由 [#39839](https://github.com/go-gitea/gitea/pull/39839) / [#39847](https://github.com/go-gitea/gitea/pull/39847) 修复。感谢 [@DshtAnger](https://github.com/DshtAnger) 报告问题，感谢 [@silverwind](https://github.com/silverwind), [@wxiaoguang](https://github.com/wxiaoguang) 和 [@bircni](https://github.com/bircni) 提供补丁。
- [CVE-2026-104627](https://github.com/go-gitea/gitea/security/advisories/GHSA-mf69-7pqq-86vx)：安全设置中的 OpenID 关联回调未检查关联操作是否由当前登录用户发起。因此，攻击者控制的 OpenID 提供方主动发送的身份断言，可能将攻击者的身份关联到受害者账户，随后用于以受害者身份登录。回调现在要求提供与用户绑定且有效期较短的 `state` 值。由 [#39642](https://github.com/go-gitea/gitea/pull/39642) / [#39744](https://github.com/go-gitea/gitea/pull/39744) 修复。感谢 [@cyberlanc3r](https://github.com/cyberlanc3r) 和 [@u2usvc](https://github.com/u2usvc) 报告问题，感谢 [@SHIVANSHGARG07](https://github.com/SHIVANSHGARG07) 和 [@wxiaoguang](https://github.com/wxiaoguang) 提供补丁。
- [CVE-2026-107686](https://github.com/go-gitea/gitea/security/advisories/GHSA-wx44-9m3m-rjqx)：网页界面允许无写入权限的用户对已锁定工单及其评论添加表情回应，而 API 会拒绝这些操作。现在，网页界面与 API 对工单内容和评论附件的编辑、删除及表情回应操作使用同一套权限检查。由 [#39839](https://github.com/go-gitea/gitea/pull/39839) / [#39847](https://github.com/go-gitea/gitea/pull/39847) 修复。感谢 [@hariprasanth9317-tech](https://github.com/hariprasanth9317-tech) 报告问题，感谢 [@silverwind](https://github.com/silverwind), [@wxiaoguang](https://github.com/wxiaoguang) 和 [@bircni](https://github.com/bircni) 提供补丁。
- [CVE-2026-110494](https://github.com/go-gitea/gitea/security/advisories/GHSA-cwq7-782w-pxcc)：为 Release 添加附件时，未拒绝已关联到工单或评论的附件。因此，具有 Release 写入权限的用户能够通过 Release 暴露工单附件的元数据，随后重命名或删除该附件。由 [#39839](https://github.com/go-gitea/gitea/pull/39839) / [#39847](https://github.com/go-gitea/gitea/pull/39847) 修复。感谢 [@manus-pi](https://github.com/manus-pi) 报告问题，感谢 [@silverwind](https://github.com/silverwind), [@wxiaoguang](https://github.com/wxiaoguang) 和 [@bircni](https://github.com/bircni) 提供补丁。
- [CVE-2026-105661](https://github.com/go-gitea/gitea/security/advisories/GHSA-c3cr-qq9g-666c)：针对个人用户而非组织请求 `/{username}/-/repositories` 时，会触发空指针 panic，匿名访客因而能在每次请求时触发错误。现在，该路由对个人用户返回 404。由 [#39839](https://github.com/go-gitea/gitea/pull/39839) / [#39847](https://github.com/go-gitea/gitea/pull/39847) 修复。感谢 [@kewmine](https://github.com/kewmine), [@tienpa99](https://github.com/tienpa99) 和 [@gemstone-source](https://github.com/gemstone-source) 报告问题，感谢 [@silverwind](https://github.com/silverwind), [@wxiaoguang](https://github.com/wxiaoguang) 和 [@bircni](https://github.com/bircni) 提供补丁。
- [CVE-2026-110311](https://github.com/go-gitea/gitea/security/advisories/GHSA-8j56-f865-gqq2)：创建草稿 Release 时会返回整个实例的附件，包括调用者无权读取的仓库中的工单和评论附件。由 [#39743](https://github.com/go-gitea/gitea/pull/39743) / [#39752](https://github.com/go-gitea/gitea/pull/39752) 修复。感谢 [@danielroe](https://github.com/danielroe) 报告问题，感谢 [@wxiaoguang](https://github.com/wxiaoguang) 提供补丁。
- [CVE-2026-105964](https://github.com/go-gitea/gitea/security/advisories/GHSA-6f9g-7jgm-m5ph)：Actions artifact v4 API 读取请求体时未限制大小，持有 runner 令牌的用户因而能够耗尽服务器内存。现在，请求体大小限制为 1 MiB。由 [#39818](https://github.com/go-gitea/gitea/pull/39818) / [#39822](https://github.com/go-gitea/gitea/pull/39822) 修复。感谢 [@manus-pi](https://github.com/manus-pi) 和 [@N0K0](https://github.com/N0K0) 报告问题，感谢 [@SHIVANSHGARG07](https://github.com/SHIVANSHGARG07) 提供补丁。
- [CVE-2026-110324](https://github.com/go-gitea/gitea/security/advisories/GHSA-xmfc-hqq8-33wh)：向私有或有限可见性用户的个人资料页发送 `POST` 请求时，会向无权查看该资料的用户返回个人资料信息。该问题已在 28.1.0 中修复，并随本次发布披露。由 [#39501](https://github.com/go-gitea/gitea/pull/39501) / [#39507](https://github.com/go-gitea/gitea/pull/39507) 修复。感谢 [@Yanni8](https://github.com/Yanni8) 提供分析，感谢 [@silverwind](https://github.com/silverwind) 和 [@bircni](https://github.com/bircni) 提供补丁。
- [CVE-2026-109844](https://github.com/go-gitea/gitea/security/advisories/GHSA-96gv-2xc4-4hxj)：用户失去对私有仓库的访问权限后，`GET /api/v1/user/subscriptions` 仍会返回其订阅的这些仓库的元数据。该问题已在 28.0.0 和 1.27.0 中修复，并随本次发布披露。由 [#38321](https://github.com/go-gitea/gitea/pull/38321) / [#38390](https://github.com/go-gitea/gitea/pull/38390) 修复。感谢 [@manus-pi](https://github.com/manus-pi) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- [CVE-2026-107618](https://github.com/go-gitea/gitea/security/advisories/GHSA-4jmf-h2cm-hg7w)：仓库主题端点未受跨源保护覆盖，因此第三方站点能够代表仓库管理员更改仓库主题（CSRF）。由 [#39839](https://github.com/go-gitea/gitea/pull/39839) / [#39847](https://github.com/go-gitea/gitea/pull/39847) 修复。感谢 [@bruhdev1290](https://github.com/bruhdev1290) 报告问题，感谢 [@silverwind](https://github.com/silverwind), [@wxiaoguang](https://github.com/wxiaoguang) 和 [@bircni](https://github.com/bircni) 提供补丁。
- [CVE-2026-97859](https://github.com/go-gitea/gitea/security/advisories/GHSA-xvfh-qwmh-f92w)：`/api/v1/users/{username}` 下的七条 API 路由（关注者、关注对象、加星标和订阅的仓库、SSH 和 GPG 密钥）缺少可见性检查，已认证用户因而能够读取有限可见性或私有用户的这些信息。该问题已在 28.0.0 和 1.27.3 中修复，并随本次发布披露。由 [#39004](https://github.com/go-gitea/gitea/pull/39004) / [#39039](https://github.com/go-gitea/gitea/pull/39039) 修复。感谢 [@lukegranto23](https://github.com/lukegranto23), [@KadirArslan](https://github.com/KadirArslan), [@DshtAnger](https://github.com/DshtAnger), [@DevNoScope](https://github.com/DevNoScope), [@gigioneggiando](https://github.com/gigioneggiando) 和 [@manus-pi](https://github.com/manus-pi) 报告问题，感谢 [@bircni](https://github.com/bircni) 提供补丁。
- [CVE-2026-97204](https://github.com/go-gitea/gitea/security/advisories/GHSA-fxq4-gr55-7x5g)：删除标签时，将仓库 ID 与组织标签所属的组织 ID 进行比较，具有仓库写入权限的用户因而能够删除数值 ID 相同的组织的标签。现在，标签只能在其所属的仓库或组织内删除。由 [#39743](https://github.com/go-gitea/gitea/pull/39743) / [#39752](https://github.com/go-gitea/gitea/pull/39752) 修复。感谢 [@N0K0](https://github.com/N0K0) 报告问题，感谢 [@wxiaoguang](https://github.com/wxiaoguang) 提供补丁。

感谢负责任披露这些问题的所有安全研究人员。

## 重要修复

### 账户与认证

- 拒绝无法登录的用户（未激活、被禁止登录或组织账户）的入站邮件令牌（[#39833](https://github.com/go-gitea/gitea/pull/39833)）；“记住我”令牌轮换的并发竞争不再导致用户退出登录（[#39686](https://github.com/go-gitea/gitea/pull/39686)）；WebAuthn 接受 WebKit 客户端返回的、未请求的客户端扩展输出（[#39792](https://github.com/go-gitea/gitea/pull/39792)）。
- 不再将作者邮箱为空的提交匹配到用户（[#39777](https://github.com/go-gitea/gitea/pull/39777)）；邮箱地址校验放宽至 Go 的 `mail.ParseAddress` 所接受的范围（[#39661](https://github.com/go-gitea/gitea/pull/39661)）；OIDC 发现文档不再声明支持实际不支持的 `id_token` 响应类型（[#39498](https://github.com/go-gitea/gitea/pull/39498)）。
- 预注册 `gitea-vscode` OAuth2 应用（[#39785](https://github.com/go-gitea/gitea/pull/39785)）；启用“仅在被提及时发送邮件”的用户仍会收到自定义仓库订阅所选事件的邮件（[#39652](https://github.com/go-gitea/gitea/pull/39652)）。

### Actions

- 完整保留工作流文件中的折叠块标量（[#39787](https://github.com/go-gitea/gitea/pull/39787)）；无效的活动类型模式不再导致事件检测发生 panic（[#39721](https://github.com/go-gitea/gitea/pull/39721)）；越界日志游标和未知的 `actor` 筛选条件返回相应错误，而非 500（[#39721](https://github.com/go-gitea/gitea/pull/39721)）。
- 正确清理定时任务，并使其随默认分支切换而调整（[#39740](https://github.com/go-gitea/gitea/pull/39740)）；已取消的可复用工作流运行不再停留在“取消中”状态（[#39706](https://github.com/go-gitea/gitea/pull/39706)）。

### 拉取请求与 Git

- 恢复所记录的合并提交从未进入目标仓库的拉取请求（[#39831](https://github.com/go-gitea/gitea/pull/39831)）；不将空拉取请求判定为已手动合并（[#39807](https://github.com/go-gitea/gitea/pull/39807)）。
- 未修改行上的评审评论显示正确的代码上下文（[#39799](https://github.com/go-gitea/gitea/pull/39799)）；差异文件树正确显示含非 ASCII 字符的文件名（[#39781](https://github.com/go-gitea/gitea/pull/39781)）。
- 获取远程提交时跳过提交图写入（[#39798](https://github.com/go-gitea/gitea/pull/39798)）；使用 Git 默认的 reflog 过期策略（[#39703](https://github.com/go-gitea/gitea/pull/39703)）；同步时精确匹配 Git 配置值（[#39728](https://github.com/go-gitea/gitea/pull/39728)）；将 LFS 对象 ID 转换为文件系统路径前进行校验（[#39762](https://github.com/go-gitea/gitea/pull/39762)）。
- `go get` URL 使用正确的 SSH 协议方案（[#39674](https://github.com/go-gitea/gitea/pull/39674)）；工单的分支／标签下拉菜单恢复标签选择功能（[#39747](https://github.com/go-gitea/gitea/pull/39747)）。

### 软件包、标记渲染与界面

- 原有的 npm tarball URL 恢复正常（[#39681](https://github.com/go-gitea/gitea/pull/39681)）；可以复制 Debian 安装参数值（[#39718](https://github.com/go-gitea/gitea/pull/39718)）。
- 解析并代理 `<source>` 元素的 `srcset` 链接（[#39708](https://github.com/go-gitea/gitea/pull/39708)）；恢复从已渲染代码块中复制代码的功能（[#39755](https://github.com/go-gitea/gitea/pull/39755)）；块级 MathML 使用正确的间距（[#39663](https://github.com/go-gitea/gitea/pull/39663)）。
- Telegram webhook 消息保留换行（[#39650](https://github.com/go-gitea/gitea/pull/39650)）；里程碑页面使用正确的模板变量（[#39834](https://github.com/go-gitea/gitea/pull/39834)）；修改密码页面能够收到 WebSocket 通知（[#39671](https://github.com/go-gitea/gitea/pull/39671)）；通知服务中的 panic 不再导致 Gitea 崩溃（[#39835](https://github.com/go-gitea/gitea/pull/39835)）。

### 依赖项

- 将 `golang.org/x/net` 更新至 v0.60.0，以修复 CVE-2026-78659：HTTP/2 服务器因尾部标头而发生的内存耗尽问题（[#39695](https://github.com/go-gitea/gitea/pull/39695)）。

本次发布包含 [39 个已合并的拉取请求](https://github.com/go-gitea/gitea/pulls?q=is%3Apr+milestone%3A28.2.0+is%3Amerged)，感谢社区的出色贡献。

## 如何安装或更新

从 [Gitea 下载页面](https://dl.gitea.com/gitea/28.2.0/)下载我们预先构建的二进制文件，请务必选择与您的平台兼容的版本。有关安装或升级的逐步指南，请参阅我们的[安装文档](https://docs.gitea.com/category/installation)。

## 特别感谢

我们还要感谢所有在 [Open Collective](https://opencollective.com/gitea) 上提供支持的赞助者，他们的资助帮助项目持续发展。

---

正在寻找顺畅、省心的 Git 仓库管理方案？
了解 [Gitea Cloud](https://cloud.gitea.com)：一个全托管、可扩展的平台，旨在简化您的开发工作流。

## 更新日志

## [28.2.0](https://github.com/go-gitea/gitea/releases/tag/v28.2.0) - 2026-10-18

### 改进

- *(oauth)* 为 gitea-vscode 预注册内置 OAuth2 应用 ([#39785](https://github.com/go-gitea/gitea/pull/39785)) ([#39801](https://github.com/go-gitea/gitea/pull/39801))
- 允许自定义订阅绕过仅在被提及时发送邮件的限制 ([#39652](https://github.com/go-gitea/gitea/pull/39652)) ([#39837](https://github.com/go-gitea/gitea/pull/39837))

### 问题修复

- 修复多项问题 ([#39661](https://github.com/go-gitea/gitea/pull/39661)) ([#39667](https://github.com/go-gitea/gitea/pull/39667))
- *(markup)* 修复块级 MathML 下方没有间距的问题 ([#39663](https://github.com/go-gitea/gitea/pull/39663)) ([#39668](https://github.com/go-gitea/gitea/pull/39668))
- 修正修改密码页面的 WebSocket 通知 ([#39671](https://github.com/go-gitea/gitea/pull/39671)) ([#39670](https://github.com/go-gitea/gitea/pull/39670))
- *(webhook)* 保留 Telegram 富文本消息中的换行 ([#39650](https://github.com/go-gitea/gitea/pull/39650)) ([#39677](https://github.com/go-gitea/gitea/pull/39677))
- 修正 "go get" URL 的 SSH 协议方案，修复表单绑定 ([#39674](https://github.com/go-gitea/gitea/pull/39674), [#39528](https://github.com/go-gitea/gitea/pull/39528)) ([#39676](https://github.com/go-gitea/gitea/pull/39676))
- 修复 OIDC 发现文档声明支持实际不支持的 id_token response_type 的问题 ([#39498](https://github.com/go-gitea/gitea/pull/39498)) ([#39689](https://github.com/go-gitea/gitea/pull/39689))
- *(deps)* 将 golang.org/x/net 模块更新至 v0.60.0 [安全修复] ([#39695](https://github.com/go-gitea/gitea/pull/39695)) ([#39701](https://github.com/go-gitea/gitea/pull/39701))
- *(git)* 使用 Git 默认的 reflog 过期策略 ([#39703](https://github.com/go-gitea/gitea/pull/39703)) ([#39711](https://github.com/go-gitea/gitea/pull/39711))
- *(actions)* 修复已取消的可复用工作流运行停留在取消中状态的问题 ([#39706](https://github.com/go-gitea/gitea/pull/39706)) ([#39717](https://github.com/go-gitea/gitea/pull/39717))
- *(git)* 同步时精确匹配 Git 配置值 ([#39728](https://github.com/go-gitea/gitea/pull/39728)) ([#39729](https://github.com/go-gitea/gitea/pull/39729))
- *(actions)* 加强日志游标、活动类型和执行者筛选条件的处理 ([#39721](https://github.com/go-gitea/gitea/pull/39721)) ([#39731](https://github.com/go-gitea/gitea/pull/39731))
- *(packages)* 复制选中的 Debian 安装参数值 ([#39718](https://github.com/go-gitea/gitea/pull/39718)) ([#39734](https://github.com/go-gitea/gitea/pull/39734))
- *(auth)* 防止“记住我”令牌轮换发生并发竞争 ([#39686](https://github.com/go-gitea/gitea/pull/39686)) ([#39688](https://github.com/go-gitea/gitea/pull/39688))
- *(packages/npm)* 恢复原有的 tarball URL ([#39681](https://github.com/go-gitea/gitea/pull/39681)) ([#39749](https://github.com/go-gitea/gitea/pull/39749))
- *(issues)* 允许在工单的“分支／标签”下拉菜单中选择标签 ([#39747](https://github.com/go-gitea/gitea/pull/39747)) ([#39753](https://github.com/go-gitea/gitea/pull/39753))
- 校验 OpenID 的 "state" ([#39642](https://github.com/go-gitea/gitea/pull/39642)) ([#39744](https://github.com/go-gitea/gitea/pull/39744))
- 修正标签删除和 Release 附件加载 ([#39743](https://github.com/go-gitea/gitea/pull/39743)) ([#39752](https://github.com/go-gitea/gitea/pull/39752))
- *(markup)* 解析并代理 `<source>` 元素的 srcset 链接 ([#39708](https://github.com/go-gitea/gitea/pull/39708)) ([#39756](https://github.com/go-gitea/gitea/pull/39756))
- *(lfs)* 构建文件系统对象路径前校验 OID ([#39762](https://github.com/go-gitea/gitea/pull/39762)) ([#39766](https://github.com/go-gitea/gitea/pull/39766))
- *(markup)* 恢复复制代码时移除换行的处理，并修复已渲染代码块的复制 ([#39755](https://github.com/go-gitea/gitea/pull/39755)) ([#39765](https://github.com/go-gitea/gitea/pull/39765))
- *(user)* 不将作者邮箱为空的提交匹配到用户 ([#39777](https://github.com/go-gitea/gitea/pull/39777)) ([#39780](https://github.com/go-gitea/gitea/pull/39780))
- *(gitdiff)* 对 `git diff-tree --raw` 输出中采用 C 风格引号转义的路径进行反转义 ([#39781](https://github.com/go-gitea/gitea/pull/39781)) ([#39783](https://github.com/go-gitea/gitea/pull/39783))
- *(actions)* 修复定时任务清理和默认分支切换 ([#39740](https://github.com/go-gitea/gitea/pull/39740)) ([#39786](https://github.com/go-gitea/gitea/pull/39786))
- 获取远程提交时跳过 commit-graph 写入 ([#39798](https://github.com/go-gitea/gitea/pull/39798))
- *(webauthn)* 接受 WebKit 客户端返回的、未请求的客户端扩展输出 ([#39792](https://github.com/go-gitea/gitea/pull/39792)) ([#39806](https://github.com/go-gitea/gitea/pull/39806))
- *(pull)* 修复未修改行上的评审评论所显示的代码上下文 ([#39799](https://github.com/go-gitea/gitea/pull/39799)) ([#39805](https://github.com/go-gitea/gitea/pull/39805))
- *(pull)* 不将空拉取请求自动判定为已手动合并 ([#39807](https://github.com/go-gitea/gitea/pull/39807)) ([#39812](https://github.com/go-gitea/gitea/pull/39812))
- *(actions)* 在序列化往返过程中完整保留折叠块标量 ([#39787](https://github.com/go-gitea/gitea/pull/39787)) ([#39817](https://github.com/go-gitea/gitea/pull/39817))
- *(actions)* 限制 artifacts v4 twirp 处理器的请求体大小 ([#39818](https://github.com/go-gitea/gitea/pull/39818)) ([#39822](https://github.com/go-gitea/gitea/pull/39822))
- 防止通知处理中的 panic 导致 Gitea 崩溃 ([#39835](https://github.com/go-gitea/gitea/pull/39835))
- *(pull)* 恢复所记录的合并提交从未进入目标仓库的 PR ([#39831](https://github.com/go-gitea/gitea/pull/39831)) ([#39840](https://github.com/go-gitea/gitea/pull/39840))
- 在里程碑页面使用正确的模板变量 ([#39834](https://github.com/go-gitea/gitea/pull/39834)) ([#39843](https://github.com/go-gitea/gitea/pull/39843))
- *(mailer)* 拒绝无法登录的用户的入站邮件令牌 ([#39833](https://github.com/go-gitea/gitea/pull/39833)) ([#39841](https://github.com/go-gitea/gitea/pull/39841))
- 为多个处理器和模型补充缺失的检查 ([#39839](https://github.com/go-gitea/gitea/pull/39839)) ([#39847](https://github.com/go-gitea/gitea/pull/39847))

## 贡献者


* [@AliceLafox](https://github.com/AliceLafox)
* [@basavaraj-sm05](https://github.com/basavaraj-sm05)
* [@benv666](https://github.com/benv666)
* [@bircni](https://github.com/bircni)
* [@choksi2212](https://github.com/choksi2212)
* [@Ehsan-hash](https://github.com/Ehsan-hash)
* [@fixfon](https://github.com/fixfon)
* [@gomitrah](https://github.com/gomitrah)
* [@Kshot3000](https://github.com/Kshot3000)
* [@lunny](https://github.com/lunny)
* [@nschloe](https://github.com/nschloe)
* [@ozenyunus35](https://github.com/ozenyunus35)
* [@silverwind](https://github.com/silverwind)
* [@SHIVANSHGARG07](https://github.com/SHIVANSHGARG07)
* [@SudhanshuMatrix](https://github.com/SudhanshuMatrix)
* [@Ubayed-Bin-Sufian](https://github.com/Ubayed-Bin-Sufian)
* [@wxiaoguang](https://github.com/wxiaoguang)
* [@Zettat123](https://github.com/Zettat123)