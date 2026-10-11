---
title: Gitea 28.1.0 官方发布博客（中文）
description: Gitea 28.1.0 正式发布博客的完整简体中文翻译。
---

# Gitea 28.1.0 正式发布

作者：bircni · 博客发布日期（UTC）：2026-10-06

> 本文为 [Gitea 官方发布博客](https://blog.gitea.com/release-of-28.1.0/) 的非官方简体中文翻译，由 ChatGPT 翻译，保留原文结构、代码与链接。原文及源代码来自 [Gitea Blog](https://gitea.com/gitea/blog/src/branch/main/content/post/gitea/release-of-28.1.0.md)，按 [Apache-2.0](../../licenses/gitea-blog-apache-2.0.md) 许可使用。本译文的修改为中文翻译；原作者署名如上。文中的历史版本更新日志属于博客原文，博客日期与 GitHub Release 日期分别保留。

我们很高兴宣布发布 **Gitea 28.1.0**，这是 28 系列的首个维护版本。本版包含安全修复，以及 28.0.0 发布后报告的回归问题修复，涉及 Actions 向受保护分支推送、npm 注册表，以及 MySQL、MariaDB 和 MSSQL 事务。强烈建议所有用户尽快升级。

<!--more-->

## 安全 {#security}

此版本修复以下安全漏洞，请尽快升级。

- [CVE-2026-97208](https://github.com/go-gitea/gitea/security/advisories/GHSA-8hhh-mqpg-jpxc)：推送镜像 API 未检查 `[mirror] DISABLE_NEW_PUSH`，仓库管理员可在站点管理员禁用后继续创建推送镜像。由 [#39501](https://github.com/go-gitea/gitea/pull/39501) / [#39507](https://github.com/go-gitea/gitea/pull/39507) 修复。感谢 [@tao0845](https://github.com/tao0845) 报告问题，感谢 [@silverwind](https://github.com/silverwind) 和 [@bircni](https://github.com/bircni) 提供补丁。
- [CVE-2026-86684](https://github.com/go-gitea/gitea/security/advisories/GHSA-7v5j-mph8-9w6g)：推送镜像 API 检查的是仓库所有者而非调用者使用本地路径的权限；启用 `IMPORT_LOCAL_PATHS` 且所有者可导入本地路径时，仓库管理员可向服务端本地 Git 仓库推送。由 [#39501](https://github.com/go-gitea/gitea/pull/39501) / [#39507](https://github.com/go-gitea/gitea/pull/39507) 修复。感谢 [@mayank-jangid-moon](https://github.com/mayank-jangid-moon), [@Kushalkhemka](https://github.com/Kushalkhemka) 和 [@skigeek16](https://github.com/skigeek16) 与 [@opensec-intelligence](https://github.com/opensec-intelligence) 共同报告问题，感谢 [@silverwind](https://github.com/silverwind) 和 [@bircni](https://github.com/bircni) 提供补丁。
- [CVE-2026-96594](https://github.com/go-gitea/gitea/security/advisories/GHSA-94rx-fqm6-q23v)：仓库媒体 API 提供小型非 LFS 文件时未设置通常的用户内容响应头，导致仓库 HTML 文件在 Gitea 源站渲染，形成存储型 XSS。由 [#39501](https://github.com/go-gitea/gitea/pull/39501) / [#39507](https://github.com/go-gitea/gitea/pull/39507) 修复。感谢 [@KadirArslan](https://github.com/KadirArslan) 和 [@cruzzer](https://github.com/cruzzer) 报告问题，感谢 [@silverwind](https://github.com/silverwind) 和 [@bircni](https://github.com/bircni) 提供补丁。
- [CVE-2026-101023](https://github.com/go-gitea/gitea/security/advisories/GHSA-469m-x4mw-38r3)：OAuth2 刷新令牌授权未检查令牌类型，未过期的访问令牌可以交换为新的访问和刷新令牌，延长访问至原生命周期之外。由 [#39501](https://github.com/go-gitea/gitea/pull/39501) / [#39507](https://github.com/go-gitea/gitea/pull/39507) 修复。感谢 [@rezmoss](https://github.com/rezmoss), [@manus-use](https://github.com/manus-use), [@danieltk76](https://github.com/danieltk76), [@gigioneggiando](https://github.com/gigioneggiando), [@DshtAnger](https://github.com/DshtAnger) 和 [@manus-pi](https://github.com/manus-pi) 报告问题，感谢 [@silverwind](https://github.com/silverwind) 和 [@bircni](https://github.com/bircni) 提供补丁。
- [CVE-2026-105268](https://github.com/go-gitea/gitea/security/advisories/GHSA-96qg-qxxj-r8xq)：Issue 附件 API 接受属于 Issue 评论的附件，导致 Issue 作者可以重命名或删除其他用户在评论中上传的附件。由 [#39501](https://github.com/go-gitea/gitea/pull/39501) / [#39507](https://github.com/go-gitea/gitea/pull/39507) 修复。感谢 [@N0K0](https://github.com/N0K0) 报告问题，感谢 [@silverwind](https://github.com/silverwind) 和 [@bircni](https://github.com/bircni) 提供补丁。
- [CVE-2026-89182](https://github.com/go-gitea/gitea/security/advisories/GHSA-fx95-gwfc-grgc)：使用 `-o repo.private=false` 推送创建仓库时忽略 `[repository] FORCE_PRIVATE`，允许非管理员创建公开仓库。由 [#39501](https://github.com/go-gitea/gitea/pull/39501) / [#39507](https://github.com/go-gitea/gitea/pull/39507) 修复。感谢 [@manus-pi](https://github.com/manus-pi) 报告问题，感谢 [@silverwind](https://github.com/silverwind) 和 [@bircni](https://github.com/bircni) 提供补丁。
- [CVE-2026-97626](https://github.com/go-gitea/gitea/security/advisories/GHSA-hf55-9cwq-2x64)：以 RSS 或 Atom `Accept` 请求头访问个人资料页时，未检查可见性即返回私有和有限可见性用户及组织的活动动态，即使已禁用 `ENABLE_FEED`。由 [#39501](https://github.com/go-gitea/gitea/pull/39501) / [#39507](https://github.com/go-gitea/gitea/pull/39507) 修复。感谢 [@tienpa99](https://github.com/tienpa99) 报告问题，[@Black1hp](https://github.com/Black1hp) 和 [@Mon3mRT](https://github.com/Mon3mRT) 发现问题，感谢 [@silverwind](https://github.com/silverwind) 和 [@bircni](https://github.com/bircni) 提供补丁。
- [CVE-2026-105267](https://github.com/go-gitea/gitea/security/advisories/GHSA-vvqw-mjq8-x248)：仅要求代码写权限的标签删除路由还会删除发布及附件。现在不能通过该路由删除关联发布的标签。由 [#39501](https://github.com/go-gitea/gitea/pull/39501) / [#39507](https://github.com/go-gitea/gitea/pull/39507) 修复。感谢 [@N0K0](https://github.com/N0K0) 报告问题，感谢 [@silverwind](https://github.com/silverwind) 和 [@bircni](https://github.com/bircni) 提供补丁。
- [CVE-2026-104633](https://github.com/go-gitea/gitea/security/advisories/GHSA-jj5r-9rpc-8h6h)：从其他 Gitea 实例迁移时，来源报告页面大小 `0` 会使下载器无限循环并耗尽服务端内存；现在限制页面大小。由 [#39501](https://github.com/go-gitea/gitea/pull/39501) / [#39507](https://github.com/go-gitea/gitea/pull/39507) 修复。感谢 [@kewmine](https://github.com/kewmine) 报告问题，感谢 [@silverwind](https://github.com/silverwind) 和 [@bircni](https://github.com/bircni) 提供补丁。

感谢负责任披露这些问题的所有安全研究人员。

## 重要修复

### 账户

- 需要更改密码的机器人账户再次可以使用 API [#39551](https://github.com/go-gitea/gitea/pull/39551)；用户可批准现有授权的 OAuth2 作用域变更，不再收到错误 [#38942](https://github.com/go-gitea/gitea/pull/38942)。

### Actions

- 工作流再次可以向受保护分支推送 ([#39564](https://github.com/go-gitea/gitea/pull/39564)).
- 可复用工作流的子作业被跳过时刷新调用者的状态 [#39589](https://github.com/go-gitea/gitea/pull/39589)；自动刷新后运行列表保留排序 [#39479](https://github.com/go-gitea/gitea/pull/39479)。

### 数据库和 Git

- MySQL 和 MariaDB 使用 `READ COMMITTED` 事务 [#39506](https://github.com/go-gitea/gitea/pull/39506)，MSSQL 使用 `READ_COMMITTED_SNAPSHOT` [#39512](https://github.com/go-gitea/gitea/pull/39512)；提交状态查询分块执行，避免超过 SQLite 表达式深度限制 [#39611](https://github.com/go-gitea/gitea/pull/39611)。
- go-git 存储支持并发重新打包 [#39510](https://github.com/go-gitea/gitea/pull/39510)、[#39536](https://github.com/go-gitea/gitea/pull/39536)；正确处理含特殊字符的分支名称 [#39483](https://github.com/go-gitea/gitea/pull/39483)。
- 拉取请求头引用改为获取而非推送 [#39603](https://github.com/go-gitea/gitea/pull/39603)；AGit 拉取请求更新时刷新“落后提交数” [#39613](https://github.com/go-gitea/gitea/pull/39613)。

### 出站访问

- 私有、链路本地、CGNAT 和文档地址范围现在归类为受限而非保留地址，因此在 `lax` 模式下显式允许时可以连接 ([#39560](https://github.com/go-gitea/gitea/pull/39560)).

### 软件包和界面

- npm 注册表路由再次可用，并改进 npm 客户端兼容性 ([#39488](https://github.com/go-gitea/gitea/pull/39488), [#39434](https://github.com/go-gitea/gitea/pull/39434)).
- 图片验证码兼容内容安全策略 [#39555](https://github.com/go-gitea/gitea/pull/39555)；用户资料页恢复组织标签页 [#39577](https://github.com/go-gitea/gitea/pull/39577)；修复 MathML 渲染 [#39491](https://github.com/go-gitea/gitea/pull/39491)、[#39493](https://github.com/go-gitea/gitea/pull/39493)、[#39497](https://github.com/go-gitea/gitea/pull/39497)。

本版包含 [38 个已合并 PR](https://github.com/go-gitea/gitea/pulls?q=is%3Apr+milestone%3A28.1.0+is%3Amerged)，感谢社区作出的贡献。

## 如何安装或更新

从 [Gitea 下载页面](https://dl.gitea.com/gitea/28.1.0/) 获取预编译二进制文件，请选择兼容当前平台的版本。安装或升级的逐步指南见[安装文档](https://docs.gitea.com/category/installation)。

## 特别致谢

也感谢 [Open Collective](https://opencollective.com/gitea) 上持续提供资金支持的所有支持者。

---

正在寻找简单顺畅的 Git 仓库管理方案？
欢迎了解 [Gitea Cloud](https://cloud.gitea.com)，这个全托管、可扩展的平台可以简化开发工作流。

## 更新日志 {#changelog}

## [28.1.0](https://github.com/go-gitea/gitea/releases/tag/v28.1.0) - 2026-10-06

### 改进

- *(packages/npm)* 改进 npm 客户端兼容性 ([#39434](https://github.com/go-gitea/gitea/pull/39434)) ([#39522](https://github.com/go-gitea/gitea/pull/39522))

### 问题修复

- *(actions)* 自动刷新后保持运行顺序 ([#39479](https://github.com/go-gitea/gitea/pull/39479)) ([#39481](https://github.com/go-gitea/gitea/pull/39481))
- 修复 npm 路由 ([#39488](https://github.com/go-gitea/gitea/pull/39488)) ([#39490](https://github.com/go-gitea/gitea/pull/39490))
- 将新访问令牌复制到剪贴板 ([#39496](https://github.com/go-gitea/gitea/pull/39496)) ([#39499](https://github.com/go-gitea/gitea/pull/39499))
- *(markup)* 跳过 MathML 内部后处理 ([#39497](https://github.com/go-gitea/gitea/pull/39497)) ([#39502](https://github.com/go-gitea/gitea/pull/39502))
- *(markup)* 不转义 MathML 中的歧义字符 ([#39493](https://github.com/go-gitea/gitea/pull/39493)) ([#39505](https://github.com/go-gitea/gitea/pull/39505))
- 为多个 API 和网页处理器补充缺失检查 ([#39501](https://github.com/go-gitea/gitea/pull/39501)) ([#39507](https://github.com/go-gitea/gitea/pull/39507))
- 正确处理包含特殊字符的 Git 分支名 ([#39483](https://github.com/go-gitea/gitea/pull/39483)) ([#39515](https://github.com/go-gitea/gitea/pull/39515))
- 正确跟踪 Git 命令 ([#39520](https://github.com/go-gitea/gitea/pull/39520)) ([#39524](https://github.com/go-gitea/gitea/pull/39524))
- *(git)* 并发 repack 移除包文件时重新索引 go-git 存储 ([#39510](https://github.com/go-gitea/gitea/pull/39510)) ([#39534](https://github.com/go-gitea/gitea/pull/39534))
- *(oauth2)* 允许用户批准权限范围变化 ([#38942](https://github.com/go-gitea/gitea/pull/38942)) ([#39521](https://github.com/go-gitea/gitea/pull/39521))
- *(api)* 为提交状态排序增加索引次级排序键 ([#39508](https://github.com/go-gitea/gitea/pull/39508)) ([#39525](https://github.com/go-gitea/gitea/pull/39525))
- *(git)* 语言统计期间避免不必要的计时器 ([#39531](https://github.com/go-gitea/gitea/pull/39531)) ([#39535](https://github.com/go-gitea/gitea/pull/39535))
- 在 MySQL 和 MariaDB 上使用 READ COMMITTED 事务 ([#39506](https://github.com/go-gitea/gitea/pull/39506)) ([#39537](https://github.com/go-gitea/gitea/pull/39537))
- *(markup)* 在 Chromium 中为 MathML 使用已安装的数学字体 ([#39491](https://github.com/go-gitea/gitea/pull/39491)) ([#39547](https://github.com/go-gitea/gitea/pull/39547))
- *(git)* go-git 存储容忍并发 repack ([#39536](https://github.com/go-gitea/gitea/pull/39536)) ([#39556](https://github.com/go-gitea/gitea/pull/39556))
- 使图片验证码兼容 CSP ([#39555](https://github.com/go-gitea/gitea/pull/39555))
- 在 MSSQL 上使用 READ_COMMITTED_SNAPSHOT ([#39512](https://github.com/go-gitea/gitea/pull/39512)) ([#39558](https://github.com/go-gitea/gitea/pull/39558))
- 使导航栏秒表按钮能够显示弹窗 ([#39562](https://github.com/go-gitea/gitea/pull/39562))
- *(actions)* 恢复向受保护分支推送 ([#39564](https://github.com/go-gitea/gitea/pull/39564)) ([#39567](https://github.com/go-gitea/gitea/pull/39567))
- *(api)* 允许密码更改待定的机器人账户 ([#39551](https://github.com/go-gitea/gitea/pull/39551)) ([#39566](https://github.com/go-gitea/gitea/pull/39566))
- *(user)* 恢复用户资料页的组织标签页 ([#39577](https://github.com/go-gitea/gitea/pull/39577)) ([#39581](https://github.com/go-gitea/gitea/pull/39581))
- *（Actions）* 对未注册的 Runner 返回 401 ([#39578](https://github.com/go-gitea/gitea/pull/39578)) ([#39585](https://github.com/go-gitea/gitea/pull/39585))
- *(markup)* 组织名大小写不同时仍为团队提及生成链接 ([#39436](https://github.com/go-gitea/gitea/pull/39436)) ([#39588](https://github.com/go-gitea/gitea/pull/39588))
- *(httpcache)* 新提交时间更早时修复原始文件更改后返回 304 的问题 ([#39435](https://github.com/go-gitea/gitea/pull/39435)) ([#39591](https://github.com/go-gitea/gitea/pull/39591))
- *(git)* 无法解析 URL 时不返回子模块网页链接 ([#39274](https://github.com/go-gitea/gitea/pull/39274)) ([#39592](https://github.com/go-gitea/gitea/pull/39592))
- *(pull)* 获取 PR 头引用，而非推送引用 ([#39603](https://github.com/go-gitea/gitea/pull/39603)) ([#39607](https://github.com/go-gitea/gitea/pull/39607))
- 迁移损坏的团队授权访问模式 ([#39579](https://github.com/go-gitea/gitea/pull/39579)) ([#39580](https://github.com/go-gitea/gitea/pull/39580))
- *(actions)* 子作业被跳过时刷新可复用工作流调用方状态 ([#39589](https://github.com/go-gitea/gitea/pull/39589)) ([#39609](https://github.com/go-gitea/gitea/pull/39609))
- “编辑 PR 标题与目标分支”使用正确分支 ([#39612](https://github.com/go-gitea/gitea/pull/39612)) ([#39621](https://github.com/go-gitea/gitea/pull/39621))
- *(egress)* 将更多地址范围标为受限而非保留 ([#39560](https://github.com/go-gitea/gitea/pull/39560)) ([#39624](https://github.com/go-gitea/gitea/pull/39624))
- *(web)* 为编辑历史差异规范化内容，修复评论历史下拉菜单 ([#39616](https://github.com/go-gitea/gitea/pull/39616)) ([#39627](https://github.com/go-gitea/gitea/pull/39627))
- 修正 RemoveWithRetry 错误处理 ([#39619](https://github.com/go-gitea/gitea/pull/39619)) ([#39626](https://github.com/go-gitea/gitea/pull/39626))
- *(pull)* 更新 AGit PR 时刷新落后提交数 ([#39613](https://github.com/go-gitea/gitea/pull/39613)) ([#39625](https://github.com/go-gitea/gitea/pull/39625))
- *(models)* 分块查询提交状态，避免 SQLite 表达式深度上限 ([#39611](https://github.com/go-gitea/gitea/pull/39611)) ([#39638](https://github.com/go-gitea/gitea/pull/39638))
- 为空 PR 显示“合并”表单 ([#39640](https://github.com/go-gitea/gitea/pull/39640)) ([#39645](https://github.com/go-gitea/gitea/pull/39645))

### 其他变更

- 对未注册的 Runner 返回 401 ([#39599](https://github.com/go-gitea/gitea/pull/39599))

## 贡献者

* [@bircni](https://github.com/bircni)
* [@breken-ai](https://github.com/breken-ai)
* [@CalvinTjoaquinn](https://github.com/CalvinTjoaquinn)
* [@dziulatex](https://github.com/dziulatex)
* [@Harsh-128](https://github.com/Harsh-128)
* [@JerryLien](https://github.com/JerryLien)
* [@Kshot3000](https://github.com/Kshot3000)
* [@nschloe](https://github.com/nschloe)
* [@perfectra1n](https://github.com/perfectra1n)
* [@SergioBenitez](https://github.com/SergioBenitez)
* [@silverwind](https://github.com/silverwind)
* [@TheFox0x7](https://github.com/TheFox0x7)
* [@wxiaoguang](https://github.com/wxiaoguang)
* [@youdie006](https://github.com/youdie006)
* [@Zettat123](https://github.com/Zettat123)
