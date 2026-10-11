---
title: Gitea 1.27.1 官方发布博客（中文）
description: Gitea 1.27.1 正式发布博客的完整简体中文翻译。
---

# Gitea 1.27.1 正式发布

作者：bircni、TheFox0x7 · 博客发布日期（UTC）：2026-07-27

> 本文为 [Gitea 官方发布博客](https://blog.gitea.com/release-of-1.27.1/) 的非官方简体中文翻译，由 ChatGPT 翻译，保留原文结构、代码与链接。原文及源代码来自 [Gitea Blog](https://gitea.com/gitea/blog/src/branch/main/content/post/gitea/release-of-1.27.1.md)，按 [Apache-2.0](../../licenses/gitea-blog-apache-2.0.md) 许可使用。本译文的修改为中文翻译；原作者署名如上。文中的历史版本更新日志属于博客原文，博客日期与 GitHub Release 日期分别保留。

我们很高兴地宣布 **Gitea 1.27.1**，这是 1.27 系列首个补丁版本。它包含安全修复和大量问题修复，其中许多与 Gitea Actions 有关。强烈建议所有用户尽快升级。

## 安全 {#security}

此版本修复以下安全漏洞，请尽快升级。

- CVE-2026-59774：通过 Org-mode 的 `#+INCLUDE` 指令可未认证读取任意文件。由 [#38642](https://github.com/go-gitea/gitea/pull/38642) / [#38645](https://github.com/go-gitea/gitea/pull/38645) 修复。感谢 [@xbow-security](https://github.com/xbow-security) 以及独立报告问题的 [@NightRang3r](https://github.com/NightRang3r) 报告问题，感谢 [@wxiaoguang](https://github.com/wxiaoguang) 和 [@TheFox0x7](https://github.com/TheFox0x7) 提供补丁。
- CVE-2026-60004：通过 `diffpatch` API 安装 Git 钩子可导致远程代码执行。由 [#38637](https://github.com/go-gitea/gitea/pull/38637) / [#38638](https://github.com/go-gitea/gitea/pull/38638) 修复。感谢 [@NightRang3r](https://github.com/NightRang3r) 报告问题，感谢 [@wxiaoguang](https://github.com/wxiaoguang) 提供补丁。

## 重要修复

### Actions

- `pull_request_target` 运行现在使用基础分支引用构建上下文，而非派生仓库头引用 ([#38657](https://github.com/go-gitea/gitea/pull/38657)).
- Gitea 重启后作业不再卡在 `cancelling` 状态；Runner 停止报告后会立即取消任务 ([#38644](https://github.com/go-gitea/gitea/pull/38644)).
- 多行 `run:` 块现在可以正确往返序列化，之前可能导致作业搁置且没有可见错误 ([#38599](https://github.com/go-gitea/gitea/pull/38599)).
- 一组正确性和加固修复 [#38631](https://github.com/go-gitea/gitea/pull/38631)：可复用工作流展开现在遵守每次运行的作业数量限制；`rerun-failed` 不再对已全部成功的运行重新执行所有作业；外部提交状态不再纳入旧版状态哈希。
- 表达式修复：工作流级 `if` 求值时可以使用 `matrix` [#38557](https://github.com/go-gitea/gitea/pull/38557)；`cancelled()` 可用于作业 `if` [#38497](https://github.com/go-gitea/gitea/pull/38497)；`workflow_dispatch` 布尔输入转换为原生类型 [#38521](https://github.com/go-gitea/gitea/pull/38521)。
- 定时运行现在填充 `github.event` [#38452](https://github.com/go-gitea/gitea/pull/38452)；被阻止或等待的作业解释尚未启动的原因 [#38498](https://github.com/go-gitea/gitea/pull/38498)；Runner 列表改进状态排序、标签和任务作业链接 [#38633](https://github.com/go-gitea/gitea/pull/38633)。
- 日志解析器再次支持多行消息，在运行视图中正确渲染，不再折叠 ([#38664](https://github.com/go-gitea/gitea/pull/38664)).

### 仓库、PR 和认证

- 重新支持 HTTP 重定向克隆，将 1.27.0 的限制还原为 1.26 行为 ([#38545](https://github.com/go-gitea/gitea/pull/38545)).
- OAuth2 authorize 和 grant 端点现在强制执行双因素认证策略 ([#38606](https://github.com/go-gitea/gitea/pull/38606)).
- 通过密码表单登录的 OAuth2 关联账户退出时，不再重定向到提供程序 end-session 端点；RP 发起的 OIDC 退出现在依据会话登录方式决定 ([#38666](https://github.com/go-gitea/gitea/pull/38666)).
- 删除仓库或用户时，清理之前在多张表中留下的孤立数据 ([#38618](https://github.com/go-gitea/gitea/pull/38618), [#38514](https://github.com/go-gitea/gitea/pull/38514)).
- 启动时 ACME 证书续期失败，Gitea 会继续提供有效证书而非启动失败 ([#38583](https://github.com/go-gitea/gitea/pull/38583)).
- 通过合并更新分支时，会对生成的提交签名 [#38499](https://github.com/go-gitea/gitea/pull/38499)；正确合并提交信息 [#38502](https://github.com/go-gitea/gitea/pull/38502)；检查失败时合并框按钮变红 [#38516](https://github.com/go-gitea/gitea/pull/38516)；差异文件树遵循 `diff.orderFile` [#38578](https://github.com/go-gitea/gitea/pull/38578)。
- 提高浅色和深色主题的差异对比度 ([#38574](https://github.com/go-gitea/gitea/pull/38574)).

此版本包含 [48 个已合并 PR](https://github.com/go-gitea/gitea/pulls?q=is%3Apr+milestone%3A1.27.1+is%3Amerged)，感谢社区作出的贡献。

## 如何安装或更新

从 [Gitea 下载页面](https://dl.gitea.com/gitea/1.27.1/) 获取预编译二进制文件，请选择兼容当前平台的版本。安装或升级的逐步指南见[安装文档](https://docs.gitea.com/category/installation)。

## 特别致谢

也感谢 [Open Collective](https://opencollective.com/gitea) 上持续提供资金支持的所有支持者。

---

正在寻找简单顺畅的 Git 仓库管理方案？
欢迎了解 [Gitea Cloud](https://cloud.gitea.com)，这个全托管、可扩展的平台可以简化开发工作流。

<!--more-->

## 更新日志 {#changelog}

## [1.27.1](https://github.com/go-gitea/gitea/releases/tag/v1.27.1) - 2026-07-27

- 安全
  - 修复 Org-mode 渲染 include 路径 ([#38642](https://github.com/go-gitea/gitea/pull/38642)) ([#38645](https://github.com/go-gitea/gitea/pull/38645))
  - 修复 Git 补丁应用 ([#38637](https://github.com/go-gitea/gitea/pull/38637)) ([#38638](https://github.com/go-gitea/gitea/pull/38638))

- 问题修复
  - OAuth2 用户使用密码登录后跳过 OIDC end-session ([#38439](https://github.com/go-gitea/gitea/pull/38439)) ([#38666](https://github.com/go-gitea/gitea/pull/38666))
  - 使 Actions 日志解析器支持多行消息编码 ([#38659](https://github.com/go-gitea/gitea/pull/38659)) ([#38664](https://github.com/go-gitea/gitea/pull/38664))
  - pull_request_target 上下文使用基础分支引用 ([#38636](https://github.com/go-gitea/gitea/pull/38636)) ([#38657](https://github.com/go-gitea/gitea/pull/38657))
  - 在 `ApproveRuns` 中跳过已批准运行 ([#38653](https://github.com/go-gitea/gitea/pull/38653)) ([#38654](https://github.com/go-gitea/gitea/pull/38654))
  - Runner 停止报告时立即取消任务 ([#38616](https://github.com/go-gitea/gitea/pull/38616)) ([#38644](https://github.com/go-gitea/gitea/pull/38644))
  - 修复标签批量加载键，减少 LoadLabel 日志噪声 ([#38632](https://github.com/go-gitea/gitea/pull/38632)) ([#38643](https://github.com/go-gitea/gitea/pull/38643))
  - 改进 Runner 列表状态排序、标签和任务作业链接 ([#38586](https://github.com/go-gitea/gitea/pull/38586)) ([#38633](https://github.com/go-gitea/gitea/pull/38633))
  - 修复 Actions 正确性和加固问题 ([#38518](https://github.com/go-gitea/gitea/pull/38518)) ([#38631](https://github.com/go-gitea/gitea/pull/38631))
  - 依赖错误时防止重定向重复写入冲突，并修复界面 ([#38627](https://github.com/go-gitea/gitea/pull/38627)) ([#38628](https://github.com/go-gitea/gitea/pull/38628))
  - 删除仓库时清理另外七张表中的仓库范围数据 ([#38534](https://github.com/go-gitea/gitea/pull/38534)) ([#38618](https://github.com/go-gitea/gitea/pull/38618))
  - 移除 Slack 频道名称检查 ([#38608](https://github.com/go-gitea/gitea/pull/38608)) ([#38612](https://github.com/go-gitea/gitea/pull/38612))
  - 修复分支页下载下拉菜单被裁剪 ([#38604](https://github.com/go-gitea/gitea/pull/38604)) ([#38609](https://github.com/go-gitea/gitea/pull/38609))
  - 在 OAuth2 authorize/grant 端点强制执行双因素认证策略 ([#38591](https://github.com/go-gitea/gitea/pull/38591)) ([#38606](https://github.com/go-gitea/gitea/pull/38606))
  - MoveIssues 载荷无效时防止修改数据库 ([#38600](https://github.com/go-gitea/gitea/pull/38600)) ([#38602](https://github.com/go-gitea/gitea/pull/38602))
  - SingleWorkflow.Marshal 往返转换保留多行 run 块，防止作业静默搁置 ([#38520](https://github.com/go-gitea/gitea/pull/38520)) ([#38599](https://github.com/go-gitea/gitea/pull/38599))
  - 对齐 UserSettings 和 TopicListResponse 的 Swagger 模式 ([#38590](https://github.com/go-gitea/gitea/pull/38590)) ([#38592](https://github.com/go-gitea/gitea/pull/38592))
  - 处理文件树中的子模块链接和缺失视图容器 ([#38033](https://github.com/go-gitea/gitea/pull/38033)) ([#38589](https://github.com/go-gitea/gitea/pull/38589))
  - 使无法展开的可复用工作流调用作业失败，解耦作业发射器的跨运行处理 ([#38565](https://github.com/go-gitea/gitea/pull/38565)) ([#38587](https://github.com/go-gitea/gitea/pull/38587))
  - 修复分支保护用户列表 ([#38570](https://github.com/go-gitea/gitea/pull/38570)) ([#38584](https://github.com/go-gitea/gitea/pull/38584))
  - 启动时证书续期失败仍继续使用有效 ACME 证书 ([#38554](https://github.com/go-gitea/gitea/pull/38554)) ([#38583](https://github.com/go-gitea/gitea/pull/38583))
  - 为 Issue 列表批量操作元素设置正确属性 ([#38575](https://github.com/go-gitea/gitea/pull/38575)) ([#38580](https://github.com/go-gitea/gitea/pull/38580))
  - 差异文件树遵循 diff.orderFile ([#38566](https://github.com/go-gitea/gitea/pull/38566)) ([#38578](https://github.com/go-gitea/gitea/pull/38578))
  - 对齐 Action 状态图标 span，修复 Safari 渲染 ([#38558](https://github.com/go-gitea/gitea/pull/38558)) ([#38562](https://github.com/go-gitea/gitea/pull/38562))
  - 计算工作流 `if` 表达式时支持 `matrix` ([#38474](https://github.com/go-gitea/gitea/pull/38474)) ([#38557](https://github.com/go-gitea/gitea/pull/38557))
  - 还原禁止 Git 克隆 HTTP 重定向的更改 ([#38530](https://github.com/go-gitea/gitea/pull/38530)) ([#38545](https://github.com/go-gitea/gitea/pull/38545))
  - 将 workflow_dispatch 布尔输入转换为原生类型 ([#38472](https://github.com/go-gitea/gitea/pull/38472)) ([#38521](https://github.com/go-gitea/gitea/pull/38521))
  - 部分检查失败时将合并框按钮显示为红色 ([#38508](https://github.com/go-gitea/gitea/pull/38508)) ([#38516](https://github.com/go-gitea/gitea/pull/38516))
  - 在 deleteUser 中清理孤立的用户键控表 ([#38511](https://github.com/go-gitea/gitea/pull/38511)) ([#38514](https://github.com/go-gitea/gitea/pull/38514))
  - 正确合并提交消息 ([#38490](https://github.com/go-gitea/gitea/pull/38490)) ([#38502](https://github.com/go-gitea/gitea/pull/38502))
  - 通过合并更新分支时签名提交 ([#38441](https://github.com/go-gitea/gitea/pull/38441)) ([#38499](https://github.com/go-gitea/gitea/pull/38499))
  - 解释被阻塞或等待的作业尚未开始的原因 ([#38476](https://github.com/go-gitea/gitea/pull/38476)) ([#38498](https://github.com/go-gitea/gitea/pull/38498))
  - 使 `cancelled()` 可用于作业 `if` 求值 ([#38495](https://github.com/go-gitea/gitea/pull/38495)) ([#38497](https://github.com/go-gitea/gitea/pull/38497))
  - 悬停过期产物时显示保留信息 ([#38477](https://github.com/go-gitea/gitea/pull/38477)) ([#38493](https://github.com/go-gitea/gitea/pull/38493))
  - 在工作流图中分组可复用工作流矩阵分支 ([#38475](https://github.com/go-gitea/gitea/pull/38475)) ([#38492](https://github.com/go-gitea/gitea/pull/38492))
  - 为包含回车字符的 Git 差异提供完整文件高亮 ([#38484](https://github.com/go-gitea/gitea/pull/38484)) ([#38491](https://github.com/go-gitea/gitea/pull/38491))
  - 为任意请求架构提供 noarch Alpine 索引 ([#38479](https://github.com/go-gitea/gitea/pull/38479)) ([#38486](https://github.com/go-gitea/gitea/pull/38486))
  - 修复更新用户可见性时的 500 错误 ([#38480](https://github.com/go-gitea/gitea/pull/38480)) ([#38483](https://github.com/go-gitea/gitea/pull/38483))
  - 使作业列表条目整体可点击 ([#38462](https://github.com/go-gitea/gitea/pull/38462)) ([#38471](https://github.com/go-gitea/gitea/pull/38471))
  - 修复推送事件邮件模板 ([#38467](https://github.com/go-gitea/gitea/pull/38467)) ([#38468](https://github.com/go-gitea/gitea/pull/38468))
  - 防止批量操作影响所有 Runner ([#38453](https://github.com/go-gitea/gitea/pull/38453)) ([#38457](https://github.com/go-gitea/gitea/pull/38457))
  - 确保“测试推送 Webhook”始终可用 ([#38425](https://github.com/go-gitea/gitea/pull/38425)) ([#38455](https://github.com/go-gitea/gitea/pull/38455))
  - 对齐组织关注按钮，允许描述换行 ([#38448](https://github.com/go-gitea/gitea/pull/38448)) ([#38454](https://github.com/go-gitea/gitea/pull/38454))
  - 为定时运行填充 `github.event` ([#38446](https://github.com/go-gitea/gitea/pull/38446)) ([#38452](https://github.com/go-gitea/gitea/pull/38452))
- 改进
  - 改进浅色和深色主题的差异对比度 ([#37477](https://github.com/go-gitea/gitea/pull/37477)) ([#38574](https://github.com/go-gitea/gitea/pull/38574))

## 贡献者

* [@bircni](https://github.com/bircni)
* [@chlee1001](https://github.com/chlee1001)
* [@cyphercodes](https://github.com/cyphercodes)
* [@darklight147](https://github.com/darklight147)
* [@dreamstarsky](https://github.com/dreamstarsky)
* [@eliroca](https://github.com/eliroca)
* [@eyupcanakman](https://github.com/eyupcanakman)
* [@gaurav0107](https://github.com/gaurav0107)
* [@gomitrah](https://github.com/gomitrah)
* [@lunny](https://github.com/lunny)
* [@luuuc](https://github.com/luuuc)
* [@massimiliano-dalcero](https://github.com/massimiliano-dalcero)
* [@netjianl](https://github.com/netjianl)
* [@okwasniewski](https://github.com/okwasniewski)
* [@okxint](https://github.com/okxint)
* [@Otto-Deviant1904](https://github.com/Otto-Deviant1904)
* [@pranav718](https://github.com/pranav718)
* [@richmahn](https://github.com/richmahn)
* [@rva-kvanheck](https://github.com/rva-kvanheck)
* [@silverwind](https://github.com/silverwind)
* [@SudhanshuMatrix](https://github.com/SudhanshuMatrix)
* [@TheFox0x7](https://github.com/TheFox0x7)
* [@wxiaoguang](https://github.com/wxiaoguang)
* [@yszl666](https://github.com/yszl666)
* [@Zettat123](https://github.com/Zettat123)
