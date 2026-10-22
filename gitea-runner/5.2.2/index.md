---
title: Gitea Runner 5.2.2 更新总结
description: Gitea Runner 5.2.2 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Gitea Runner"
  version="5.2.2"
  date="2026-10-22"
  repository-url="https://gitea.com/gitea/runner"
  docs-url="https://docs.gitea.com/runner/"
  release-url="https://gitea.com/gitea/runner/releases/tag/v5.2.2"
/>

## 概览

Gitea Runner 5.2.2 修复 Kubernetes 执行环境的启动问题：启动时的 exec 操作会重试，直到 kubelet 接受该操作。

## Bugfix / Security

- 重试 Kubernetes 启动时的 exec，直到 kubelet 接受，修复启动阶段的问题（#1337）。
