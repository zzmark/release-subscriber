---
title: Gitea Runner 5.1.0 更新总结
description: Gitea Runner 5.1.0 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Gitea Runner"
  version="5.1.0"
  date="2026-10-14"
  repository-url="https://gitea.com/gitea/runner"
  docs-url="https://docs.gitea.com/runner/"
  release-url="https://gitea.com/gitea/runner/releases/tag/v5.1.0"
/>

## 概览

Gitea Runner 5.1.0 改进 Action 前置和后置步骤的展示，在 Gitea 无法访问时重试启动，并让本地执行遵循 Git 自身的忽略规则。本版还修复超时与取消后的后置步骤环境、跨架构容器、无 root 权限的 Podman、共享 Action 缓存及嵌套 Docker 代理清理问题，并更新依赖以修复安全问题。

## New Feature

- 在支持此功能的 Gitea 版本上，将 Action 的 `pre` 和 `post` 步骤分别显示为独立步骤。
- Gitea 无法访问时重试启动，不再直接退出。
- `exec --use-gitignore` 遵循 Git 自身的忽略规则。

## Performance

- 对 `linux/arm/v7` 等平台变体复用本地镜像，避免再次拉取。

## Bugfix / Security

- 超时或取消后，为后置步骤保留 `GITHUB_ENV`、`GITHUB_OUTPUT`、`GITHUB_STATE` 和 `GITHUB_PATH`。
- 忽略作业容器 `options` 中的 `--entrypoint` 并发出警告，避免容器无法正常工作；跨架构作业使用作业容器自身的 `PATH`。
- 修复无 root 权限的 Podman 使用将 `/var/run` 设为符号链接的镜像时，Action 复制失败的问题。
- 为共享缓存目录的多个 Runner 对 Action 缓存加锁；修复 Runner 嵌套在另一个 Runner 的 Docker 代理后方时的作业清理问题。
- 将 Go 更新至 1.27.2，将 `golang.org/x/net` 更新至 v0.60.0，以修复安全问题。
