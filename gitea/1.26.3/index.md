---
title: Gitea 1.26.3 更新总结
description: Gitea 1.26.3 的中文更新总结、原始 Changelog、简体中文翻译与官方发布博客译文。
---

<ReleaseCard
  software="Gitea"
  version="1.26.3"
  date="2026-06-20"
  repository-url="https://github.com/go-gitea/gitea"
  docs-url="https://docs.gitea.com/"
  release-url="https://github.com/go-gitea/gitea/releases/tag/v1.26.3"
  release-blog-url="https://blog.gitea.com/release-of-1.26.3-and-1.26.4/"
  release-blog-zh-url="./blog.zh"
/>

## 概览

Gitea 1.26.3 包含大量安全修复和派生仓库工作流审批变更。**官方要求直接升级到 1.26.4**：本版存在回归，打开仓库代码页面时可能出现 `context deadline exceeded` 错误，见 [#38177](https://github.com/go-gitea/gitea/issues/38177)。

## Breaking Change

- 派生仓库的拉取请求必须已合并，才能绕过工作流审批门禁；升级时检查依赖旧行为的审批配置。

## New Feature

- `ListForks` API 增加 `Link` 响应头。

## Bugfix / Security

- 修复私有仓库克隆、SSH LFS 认证绕过、跨仓库 LFS 对象复用及失效 OIDC 关联问题。
- 加强私有与保留地址筛选、CODEOWNERS 匹配时间限制和 Debian 控制文件解析，并更新 `golang.org/x/net`。
- 修复工作流触发检测、日志缺失处理、PR 评审及 Git 引用解析等问题。
