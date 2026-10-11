---
title: Gitea 1.26.4 更新总结
description: Gitea 1.26.4 的中文更新总结、原始 Changelog、简体中文翻译与官方发布博客译文。
---

<ReleaseCard
  software="Gitea"
  version="1.26.4"
  date="2026-06-21"
  repository-url="https://github.com/go-gitea/gitea"
  docs-url="https://docs.gitea.com/"
  release-url="https://github.com/go-gitea/gitea/releases/tag/v1.26.4"
  release-blog-url="https://blog.gitea.com/release-of-1.26.3-and-1.26.4/"
  release-blog-zh-url="./blog.zh"
/>

## 概览

Gitea 1.26.4 修复 1.26.3 的仓库页面回归，并封堵 OAuth2 回调重新激活已禁用账户的问题。1.26.3 的官方 Release 明确建议直接升级到本版；两个版本共用一篇官方发布博客。

## Bugfix / Security

- 修复遍历 Git 日志时的上下文错误处理，解决 1.26.3 仓库代码页面可能出现的 `context deadline exceeded` 错误。
- OAuth2 回调不再自动重新激活已禁用用户。
