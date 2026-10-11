---
title: Gitea 1.26.1 官方发布博客（中文）
description: Gitea 1.26.1 正式发布博客的完整简体中文翻译。
---

# Gitea 1.26.1 正式发布

作者：bircni · 博客发布日期（UTC）：2026-04-21

> 本文为 [Gitea 官方发布博客](https://blog.gitea.com/release-of-1.26.1/) 的非官方简体中文翻译，由 ChatGPT 翻译，保留原文结构、代码与链接。原文及源代码来自 [Gitea Blog](https://gitea.com/gitea/blog/src/branch/main/content/post/gitea/release-of-1.26.1.md)，按 [Apache-2.0](../../licenses/gitea-blog-apache-2.0.md) 许可使用。本译文的修改为中文翻译；原作者署名如上。文中的历史版本更新日志属于博客原文，博客日期与 GitHub Release 日期分别保留。

我们很高兴地宣布 **Gitea 1.26.1** 正式发布！此版本修复了 1.26.0 以来的多个重要问题，提升整体稳定性，强烈建议所有用户升级。

此版本包含 [22 个已合并 PR](https://github.com/go-gitea/gitea/pulls?q=is%3Apr+milestone%3A1.26.1+is%3Amerged)，感谢社区作出的贡献。

## 如何安装或更新

从 [Gitea 下载页面](https://dl.gitea.com/gitea/1.26.1/) 获取预编译二进制文件，请选择兼容当前平台的版本。安装或升级的逐步指南见[安装文档](https://docs.gitea.com/category/installation)。

## 特别致谢

也感谢 [Open Collective](https://opencollective.com/gitea) 上持续提供资金支持的所有支持者。

---

正在寻找简单顺畅的 Git 仓库管理方案？
欢迎了解 [Gitea Cloud](https://cloud.gitea.com)，这个全托管、可扩展的平台可以简化开发工作流。

<!--more-->

## 更新日志 {#changelog}

## [1.26.1](https://github.com/go-gitea/gitea/releases/tag/v1.26.1) - 2026-04-21

* 问题修复
  * 增强 GetActionWorkflow，支持回退引用 ([#37283](https://github.com/go-gitea/gitea/pull/37283))
  * 修复公开实例的容器认证 ([#37294](https://github.com/go-gitea/gitea/pull/37294))
  * 修复节点标签含换行时 Mermaid 图表失败的问题 ([#37299](https://github.com/go-gitea/gitea/pull/37299))
  * 修复 Vite 清单更新掩盖构建错误的问题 ([#37310](https://github.com/go-gitea/gitea/pull/37310))
  * 修复编辑器中折叠文件树时按钮布局跳动 ([#37375](https://github.com/go-gitea/gitea/pull/37375))
  * 修复提交状态报告 ([#37386](https://github.com/go-gitea/gitea/pull/37386))
  * 修复组织团队受理人/评审者查询中的团队成员权限 ([#37391](https://github.com/go-gitea/gitea/pull/37391))
  * 修复仓库初始化 README 的行尾 ([#37399](https://github.com/go-gitea/gitea/pull/37399))
  * 修复默认 ZIP 类型导出生成未压缩 ZIP 的问题 ([#37402](https://github.com/go-gitea/gitea/pull/37402))
  * 修复 AppFullLink ([#37328](https://github.com/go-gitea/gitea/pull/37328))
  * 修复访问用户徽章时的问题 ([#37329](https://github.com/go-gitea/gitea/pull/37329))
  * 修复 Actions 并发组跨分支泄漏 ([#37331](https://github.com/go-gitea/gitea/pull/37331))
  * 修复用户派生组织仓库后，更改组织可见性引发的问题。 ([#37344](https://github.com/go-gitea/gitea/pull/37344))
  * 修复认证源包含空格时报错 ([#37332](https://github.com/go-gitea/gitea/pull/37332))
  * 缺少所请求架构的 RPM 时回退到 noarch ([#37339](https://github.com/go-gitea/gitea/pull/37339))
  * 修复 OAuth2 的 URL 转义 ([#37340](https://github.com/go-gitea/gitea/pull/37340))
  * 使用新版 `git update-index --cacheinfo` 语法，支持更多文件名 ([#37343](https://github.com/go-gitea/gitea/pull/37343))
  * 定时运行的工作流运行 API 响应使用 TriggerEvent 而非 Event ([#37360](https://github.com/go-gitea/gitea/pull/37360))

* 改进
  * 为定时 Actions 任务增加 event.schedule 上下文 ([#37348](https://github.com/go-gitea/gitea/pull/37348))

* 文档
  * 为 `Learn more about blocking a user.` 增加 URL ([#37367](https://github.com/go-gitea/gitea/pull/37367))

## 贡献者

* [@bircni](https://github.com/bircni)
* [@bytedream](https://github.com/bytedream)
* [@chethenry](https://github.com/chethenry)
* [@lunny](https://github.com/lunny)
* [@prettysunflower](https://github.com/prettysunflower)
* [@KalashThakare](https://github.com/KalashThakare)
* [@pisarz77](https://github.com/pisarz77)
* [@silverwind](https://github.com/silverwind)
* [@wxiaoguang](https://github.com/wxiaoguang)
