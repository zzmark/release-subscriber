---
title: Gitea Runner 3.4.1 更新总结
description: Gitea Runner 3.4.1 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Gitea Runner"
  version="3.4.1"
  date="2026-09-08"
  repository-url="https://gitea.com/gitea/runner"
  docs-url="https://docs.gitea.com/runner/"
  release-url="https://gitea.com/gitea/runner/releases/tag/v3.4.1"
/>

## 概览

这是针对 Docker 套接字问题的维护版本，同时更新依赖和构建检查。

## Bugfix / Security

- 修复作业的 Docker 套接字意外变成目录的问题。
