---
title: Gitea Runner 4.1.0 更新总结
description: Gitea Runner 4.1.0 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Gitea Runner"
  version="4.1.0"
  date="2026-10-01"
  repository-url="https://gitea.com/gitea/runner"
  docs-url="https://docs.gitea.com/runner/"
  release-url="https://gitea.com/gitea/runner/releases/tag/v4.1.0"
/>

## 概览

Gitea Runner 4.1.0 新增 Kubernetes 作业后端，扩展指标导出和日志信息，并修复 Action 克隆、注册及 Docker-in-Docker 作业执行的问题。

## New Feature

- 新增 Kubernetes 后端，用于运行 Gitea Actions 作业。
- Prometheus 指标支持通过 OpenTelemetry 导出；任务启动日志包含任务、作业和运行标识符。
- 文档推荐容器作业使用 Docker-in-Docker。

## Bugfix / Security

- 调整 Docker Action、作业环境处理和宿主机模式的行为，使其更贴近 GitHub Actions。
- 防止 HTTP/2 连接停滞导致 Action 克隆挂起；注册尝试更快失败，并遵循 `GITEA_MAX_REG_ATTEMPTS`。
- 修复 Docker-in-Docker 镜像就绪检查、退出码传递及关闭顺序，清除已使用的一次性注册状态以防重复使用。
