---
title: Gitea 1.26.3 官方发布博客（中文）
description: Gitea 1.26.3 和 1.26.4 正式发布博客的完整简体中文翻译。
---

# Gitea 1.26.3 和 1.26.4 正式发布

作者：bircni · 博客发布日期（UTC）：2026-06-21

> 本文为 [Gitea 官方发布博客](https://blog.gitea.com/release-of-1.26.3-and-1.26.4/) 的非官方简体中文翻译，由 ChatGPT 翻译，保留原文结构、代码与链接。原文及源代码来自 [Gitea Blog](https://gitea.com/gitea/blog/src/branch/main/content/post/gitea/release-of-1.26.3-and-1.26.4.md)，按 [Apache-2.0](../../licenses/gitea-blog-apache-2.0.md) 许可使用。本译文的修改为中文翻译；原作者署名如上。文中的历史版本更新日志属于博客原文，博客日期与 GitHub Release 日期分别保留。

我们很高兴地宣布 **Gitea 1.26.3** 和 **Gitea 1.26.4** 发布。1.26.3 带来大量安全修复、重要问题修复及稳定性改进。随后发布的 1.26.4 修复了 1.26.3 引入的仓库代码页面回归问题，并增加了一项安全修复。

**强烈建议直接升级到 1.26.4。** 已使用 1.26.3 的用户请尽快升级到 1.26.4。

## 1.26.4

此版本修复了 1.26.3 的 **"context deadline exceeded"** 回归问题，该问题会导致仓库代码页面无法加载（[#38177](https://github.com/go-gitea/gitea/issues/38177)）。`WalkGitLog` 现在正确处理 EOF 和上下文错误 ([#38185](https://github.com/go-gitea/gitea/pull/38185)). 感谢 @wxiaoguang 提供修复。

此版本还修复了以下安全公告中的问题：

  * OAuth2 登录回调不再自动重新激活已禁用用户 ([#38183](https://github.com/go-gitea/gitea/pull/38183)). 感谢 @chndlrx 报告问题，感谢 @bircni 提供修复。

此版本里程碑包含 [2 个已合并 PR](https://github.com/go-gitea/gitea/pulls?q=is%3Apr+milestone%3A1.26.4+is%3Amerged)。

特别感谢 @wxiaoguang 快速提供热修复。

## 1.26.3

此版本修复了多个安全公告中的问题，其中一些通过合并 PR 一并包含多项修复 ([#38151](https://github.com/go-gitea/gitea/pull/38151) 和 [#38147](https://github.com/go-gitea/gitea/pull/38147)).

  * CVE-2026-20896：Docker 镜像默认设置 `REVERSE_PROXY_TRUSTED_PROXIES = *`，任意来源 IP 均可通过 `X-WEBAUTH-USER` 请求头模拟任意用户。反向代理认证现在需要管理员显式启用和配置 ([#38151](https://github.com/go-gitea/gitea/pull/38151)). 感谢 Tenable 的 Joshua Martinelle / bughunters@tenable 和 @rz1027 报告问题，感谢 @bircni 提供修复。
  * CVE-2026-22874：收紧 Webhook 和迁移使用的默认允许名单筛选器，修复不完整的 SSRF 保护仍可访问内部地址的问题 ([#38173](https://github.com/go-gitea/gitea/pull/38173), [#38059](https://github.com/go-gitea/gitea/pull/38059)). 感谢 @JLLeitschuh 报告问题，感谢 @TheFox0x7 和 @bircni 提供修复。
  * CVE-2026-27775：对推送中的每个引用重新检查分支写权限；pre-receive 钩子曾缓存首个引用的结果，使分支级维护者编辑授权升级为整个仓库写权限 ([#38151](https://github.com/go-gitea/gitea/pull/38151)). 感谢 @adrian-doyensec 报告问题，感谢 @bircni 提供修复。
  * CVE-2026-24451：基础仓库不再可读时阻止派生仓库同步（`merge-upstream`），避免父仓库从公开改为私有后派生仓库继续拉取新提交 ([#38151](https://github.com/go-gitea/gitea/pull/38151)). 感谢 @ybsun0215 报告问题，感谢 @bircni 提供修复。
  * CVE-2026-20779：在网页登录、密码重置和基本认证 `X-Gitea-OTP` 接口强制执行 TOTP 口令单次使用，关闭 TOCTOU 竞态和无状态重放窗口 ([#38151](https://github.com/go-gitea/gitea/pull/38151)). 感谢 @Kript0r3x 报告问题，感谢 @bircni 提供修复。
  * CVE-2026-28740：跨仓库复用 LFS 对象要求代码单元访问权限，避免非代码授权访问私有源对象 ([#38050](https://github.com/go-gitea/gitea/pull/38050)). 感谢 @m2hcz 报告问题，感谢 @bircni 提供修复。
  * 拒绝未知 SSH LFS 子命令，修复可未授权读取私有仓库的认证绕过 ([#38015](https://github.com/go-gitea/gitea/pull/38015)). 感谢 @Tomer-PL 报告问题，感谢 @bircni 提供修复。
  * 要求派生仓库 PR 已合并才能绕过工作流审批门禁，修复永久绕过审批门禁的问题 ([#38041](https://github.com/go-gitea/gitea/pull/38041)). 感谢 @prakhar0x01 报告问题，感谢 @bircni 提供修复。 参见下方破坏性变更说明。
  * CVE-2026-27761：RSS/Atom 动态端点强制检查仓库令牌权限范围，避免没有仓库权限范围的个人访问令牌读取私有仓库提交数据 ([#38147](https://github.com/go-gitea/gitea/pull/38147)). 感谢 @babakizo420 报告问题，感谢 @bircni 提供修复。
  * CVE-2026-25038：组织标签读取端点强制检查组织可见性，避免私有组织标签泄露给非成员 ([#38151](https://github.com/go-gitea/gitea/pull/38151)). 感谢 @ybsun0215 报告问题，感谢 @bircni 提供修复。
  * 仓库迁移克隆期间阻止 HTTP 重定向，防止通过攻击者控制的重定向实施 SSRF 访问内部地址 ([#38147](https://github.com/go-gitea/gitea/pull/38147)). 感谢 @moltenbit 报告问题，感谢 @bircni 提供修复。
  * 限制 CODEOWNERS 模式匹配时间，防止未认证的 ReDoS 拒绝服务 ([#38025](https://github.com/go-gitea/gitea/pull/38025)). 感谢 @AdamKorcz 报告问题，感谢 @bircni 提供修复。
  * 撤销仓库访问权限后隐藏通知主题，避免通过通知 API 泄露私有 Issue 和 PR 元数据 ([#38147](https://github.com/go-gitea/gitea/pull/38147)). 感谢 @ybsun0215 报告问题，感谢 @bircni 提供修复。

此版本还增加安全加固，将 Debian control 文件解析限制为单个段落 [#38055](https://github.com/go-gitea/gitea/pull/38055)，并将 `golang.org/x/net` 更新至 v0.55.0 [#37829](https://github.com/go-gitea/gitea/pull/37829)。

此版本包含 [31 个已合并 PR](https://github.com/go-gitea/gitea/pulls?q=is%3Apr+milestone%3A1.26.3+is%3Amerged)，感谢社区作出的贡献。

## 破坏性变更

此版本收紧派生仓库 PR 审批门禁：来自派生仓库的 PR 现在必须已合并才能绕过门禁 [#38041](https://github.com/go-gitea/gitea/pull/38041)。如果依赖此前行为，请检查工作流审批设置。

## 如何安装或更新

从 [Gitea 下载页面](https://dl.gitea.com/gitea/1.26.4/) 获取预编译二进制文件，请选择兼容当前平台的版本。安装或升级的逐步指南见[安装文档](https://docs.gitea.com/category/installation)。

## 特别致谢

也感谢 [Open Collective](https://opencollective.com/gitea) 上持续提供资金支持的所有支持者。

---

正在寻找简单顺畅的 Git 仓库管理方案？
欢迎了解 [Gitea Cloud](https://cloud.gitea.com)，这个全托管、可扩展的平台可以简化开发工作流。

<!--more-->

## 更新日志 {#changelog}

## [1.26.4](https://github.com/go-gitea/gitea/releases/tag/v1.26.4) - 2026-06-21

* 安全
  * OAuth2 回调不再自动重新激活已禁用用户 ([#38183](https://github.com/go-gitea/gitea/pull/38183))

* 问题修复
  * 修复 `WalkGitLog` 上下文错误处理，使仓库代码页面正确加载 ([#38185](https://github.com/go-gitea/gitea/pull/38185))

## [1.26.3](https://github.com/go-gitea/gitea/releases/tag/v1.26.3) - 2026-06-20

* 破坏性变更
  * 要求已合并 PR 才能绕过派生仓库 PR 审批门禁 ([#38041](https://github.com/go-gitea/gitea/pull/38041))

* 安全
  * 修补错误的主机匹配器私有地址列表 ([#38173](https://github.com/go-gitea/gitea/pull/38173))
  * 多项安全修复 ([#38151](https://github.com/go-gitea/gitea/pull/38151))
  * 多项安全修复 ([#38147](https://github.com/go-gitea/gitea/pull/38147))
  * 允许匿名代码访问时可克隆私有仓库 ([#38146](https://github.com/go-gitea/gitea/pull/38146))
  * 忽略指向组织的过期 OIDC 外部登录关联 ([#38141](https://github.com/go-gitea/gitea/pull/38141))
  * 在外部/私有主机匹配器筛选中阻止保留 IP 地址范围 ([#38059](https://github.com/go-gitea/gitea/pull/38059))
  * 跨仓库复用 LFS 对象时要求代码单元访问权限 ([#38050](https://github.com/go-gitea/gitea/pull/38050))
  * 拒绝未知 SSH LFS 子命令，防止认证绕过 ([#38015](https://github.com/go-gitea/gitea/pull/38015))
  * 限制 CODEOWNERS 正则表达式匹配时间 ([#38025](https://github.com/go-gitea/gitea/pull/38025))
  * 将 Debian `ParseControlFile` 限制为单个 control 段 ([#38055](https://github.com/go-gitea/gitea/pull/38055))
  * 将 golang.org/x/net 更新到 v0.55.0 [security] ([#37829](https://github.com/go-gitea/gitea/pull/37829))

* API
  * 为 `ListForks` 增加 Link 响应头 ([#38063](https://github.com/go-gitea/gitea/pull/38063))

* 问题修复
  * 修复解析 SSH 远程 LFS 端点失败时的 panic ([#38158](https://github.com/go-gitea/gitea/pull/38158))
  * 修复按不存在用户筛选跟踪时间时的空指针 panic ([#38115](https://github.com/go-gitea/gitea/pull/38115))
  * 在 `workflow_dispatch` 选择下拉菜单中保留字面量 "false" ([#38096](https://github.com/go-gitea/gitea/pull/38096))
  * 解析 HEAD 引用 ([#38119](https://github.com/go-gitea/gitea/pull/38119))
  * 修复 Git 命令 ([#38087](https://github.com/go-gitea/gitea/pull/38087))
  * 为初始标签生成发布说明 ([#37986](https://github.com/go-gitea/gitea/pull/37986))
  * 作业日志 blob 缺失时返回 404 ([#38004](https://github.com/go-gitea/gitea/pull/38004))
  * 从工作流触发器检测中排除 `workflow_call` ([#37899](https://github.com/go-gitea/gitea/pull/37899))
  * 提交主题为 URL 时保持 Action 运行标题可点击 ([#37898](https://github.com/go-gitea/gitea/pull/37898))
  * 拒绝对没有对应触发器的工作流执行 `workflow_dispatch` ([#37895](https://github.com/go-gitea/gitea/pull/37895))
  * 幂等确认重发的 `UpdateLog` 结束请求 ([#37892](https://github.com/go-gitea/gitea/pull/37892))
  * 修复 HTTP 内容文件渲染 ([#37856](https://github.com/go-gitea/gitea/pull/37856))
  * 提交待定评审时清理过期 `ReviewTypeRequest` ([#37815](https://github.com/go-gitea/gitea/pull/37815))
  * 修复非协作者的 Issue 目标分支选择 ([#38164](https://github.com/go-gitea/gitea/pull/38164))

* 构建
  * 将 `@playwright/test` 更新到 1.60.0 ([#38144](https://github.com/go-gitea/gitea/pull/38144))
  * 为 PR 标签工作流增加 `tools/ci-tools.ts` ([#37831](https://github.com/go-gitea/gitea/pull/37831))
  * 修复 Swagger CSS 导入 ([#37803](https://github.com/go-gitea/gitea/pull/37803))
