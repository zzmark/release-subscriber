---
title: Gitea 1.26.1 更新总结
description: Gitea 1.26.1 的中文更新总结、原始 Changelog、简体中文翻译与官方发布博客译文。
---

<ReleaseCard
  software="Gitea"
  version="1.26.1"
  date="2026-04-24"
  repository-url="https://github.com/go-gitea/gitea"
  docs-url="https://docs.gitea.com/"
  release-url="https://github.com/go-gitea/gitea/releases/tag/v1.26.1"
  release-blog-url="https://blog.gitea.com/release-of-1.26.1/"
  release-blog-zh-url="./blog.zh"
/>

## 概览

Gitea 1.26.1 修复 Actions、仓库权限、软件包注册表和界面问题，并改善文件名与发布归档的兼容性。

## Bugfix / Security

- 定时 Actions 任务增加 `event.schedule` 上下文，修复并发组跨分支泄漏，并改进工作流回退引用。
- 修复派生组织仓库后更改组织可见性引发的问题，以及团队受理人、评审者查询中的成员权限检查。
- 修复 OAuth2 URL 转义、公开实例容器认证和 RPM 架构回退。
- 修复 README 行尾、默认 ZIP 导出未压缩、Mermaid 换行标签及编辑器布局问题。
