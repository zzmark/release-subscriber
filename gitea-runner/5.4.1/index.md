---
title: Gitea Runner 5.4.1 更新总结
description: Gitea Runner 5.4.1 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Gitea Runner"
  version="5.4.1"
  date="2026-11-05"
  repository-url="https://gitea.com/gitea/runner"
  docs-url="https://docs.gitea.com/runner/"
  release-url="https://gitea.com/gitea/runner/releases/tag/v5.4.1"
/>

## 概览

Gitea Runner 5.4.1 将 `container.sweep` 改为默认关闭，避免作业通过 Docker 代理部署到 Runner 所在主机的服务容器被清理。同时修复工作流命令日志的敏感信息遮蔽遗漏，并更新 Runner 镜像中的 Alpine 软件包和 Docker-in-Docker 基础镜像。

仅用于 CI、希望继续清理作业所启动容器的 Runner，需要显式设置 `container.sweep: true`。本版还包含测试执行提速和 Windows 路径测试修正。

## Breaking Change

- **容器清理改为主动启用**：`container.sweep` 默认值改为 `false`。此前清理机制会移除作业通过 Docker 代理启动的所有容器，导致部署到 Runner 自身 Docker 守护进程的服务被意外停止；仅用于 CI 的 Runner 如需保留原清理行为，应设置 `container.sweep: true`。参见[官方 PR #1389](https://gitea.com/gitea/runner/pulls/1389)。

## Bugfix / Security

- **工作流日志遮蔽**：修复部分转义的工作流命令输出和完整的单字符值未被遮蔽的问题，同时保留字面输出和流的行结束符。参见[官方 PR #1384](https://gitea.com/gitea/runner/pulls/1384)。
- **镜像软件包安全更新**：所有镜像在安装软件包前执行 `apk upgrade`，获取基础镜像尚未包含的 Alpine 修复。Docker-in-Docker 基础镜像升至 `docker:29.9.3`；官方本地构建验证 `libexpat` 从 `2.9.0-r0` 升至 `2.10.0-r0`，`apk-tools` 从 `3.0.8-r0` 升至 `3.0.9-r0`，并报告 Trivy 未再发现这些 dind 镜像的 Alpine 软件包问题。这是上游对该次构建的验证结果。参见[官方 PR #1388](https://gitea.com/gitea/runner/pulls/1388)。
- **测试维护**：加快测试执行，并修正 Windows 路径测试。
