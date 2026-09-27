---
title: Gitea Runner 4.0.0 更新总结
description: Gitea Runner 4.0.0 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Gitea Runner"
  version="4.0.0"
  date="2026-09-24"
  repository-url="https://gitea.com/gitea/runner"
  docs-url="https://docs.gitea.com/runner/"
  release-url="https://gitea.com/gitea/runner/releases/tag/v4.0.0"
/>

## 概览

此主要版本调整缓存网络路径和 `valid_volumes` 匹配规则，同时加入内置 Action、共享 S3 缓存及 OpenTelemetry 追踪。升级前应检查作业能否访问 Runner，以及卷路径模式是否依赖 `*` 跨目录匹配。

## Breaking Change

- 配置外部缓存时，作业改为通过 Runner 转发请求。远程 Docker 守护进程或 `container.network: bridge` 可能需要调整网络和 `cache.host`、`cache.port`。
- `valid_volumes` 中的 `*` 不再跨路径分隔符匹配；多级路径应改用 `**`。

## New Feature

- 新增无需 Node 或下载的 `builtin:checkout` Action、解析当前 Gitea 实例的 `self:` 引用、S3 兼容共享缓存和 OpenTelemetry 追踪。

## Performance

- 加快容器内 Runner 的作业启动速度。

## Bugfix / Security

- 修复 `if:` 求值失败、失败作业缓存保存、Podman Docker 套接字，以及 Windows 卷路径模式等问题。
