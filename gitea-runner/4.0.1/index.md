---
title: Gitea Runner 4.0.1 更新总结
description: Gitea Runner 4.0.1 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Gitea Runner"
  version="4.0.1"
  date="2026-09-30"
  repository-url="https://gitea.com/gitea/runner"
  docs-url="https://docs.gitea.com/runner/"
  release-url="https://gitea.com/gitea/runner/releases/tag/v4.0.1"
/>

## 概览

Gitea Runner 4.0.1 修复容器命令查找、Docker 注册文件配置、作业镜像选择以及可复用工作流中的上下文恢复，并更新依赖。

## Bugfix / Security

- 通过 PATH 查找容器内的 sleep 命令，并遵循已配置的 Docker 注册文件。
- 未指定 `image` 的作业容器使用 runs-on 对应的镜像。
- 在可复用工作流作业中恢复调用方的事件和输入参数，同时包含其他错误修复、改进及依赖更新。
