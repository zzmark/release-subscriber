---
title: Gitea Runner 3.4.2 更新总结
description: Gitea Runner 3.4.2 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Gitea Runner"
  version="3.4.2"
  date="2026-09-09"
  repository-url="https://gitea.com/gitea/runner"
  docs-url="https://docs.gitea.com/runner/"
  release-url="https://gitea.com/gitea/runner/releases/tag/v3.4.2"
/>

## 概览

本版修复缓存服务、任务接收和构件上传中的可靠性问题。

## Bugfix / Security

- 修复 IPv6 URL、缓存服务器收到 SIGTERM 时的处理，以及任务接收的原子性。
- 构件上传不再依赖缓存服务器能够访问 Gitea。
