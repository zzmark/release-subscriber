---
title: Gitea Runner 3.4.0 更新总结
description: Gitea Runner 3.4.0 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Gitea Runner"
  version="3.4.0"
  date="2026-09-07"
  repository-url="https://gitea.com/gitea/runner"
  docs-url="https://docs.gitea.com/runner/"
  release-url="https://gitea.com/gitea/runner/releases/tag/v3.4.0"
/>

## 概览

本版改善 Docker 工作区挂载、Action 下载速度和作业资源清理，并更新含安全修复的依赖。

## New Feature

- 新增 `GITEA_DOCKER_WORKSPACE`，方便在 Compose 绑定挂载中引用 Docker 守护进程所见的工作区路径。

## Performance

- 首次下载 Action 快 5 至 20 倍；缓存命中时不再访问网络。

## Bugfix / Security

- 作业结束后清理其创建的容器、网络和卷；表达式插值失败时正确标记失败。
- 将 `golang.org/x/crypto` 更新到 v0.56.0，修复 CVE-2026-78662 和 CVE-2026-56855。
