---
title: Gitea Runner 3.5.0 更新总结
description: Gitea Runner 3.5.0 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Gitea Runner"
  version="3.5.0"
  date="2026-09-14"
  repository-url="https://gitea.com/gitea/runner"
  docs-url="https://docs.gitea.com/runner/"
  release-url="https://gitea.com/gitea/runner/releases/tag/v3.5.0"
/>

## 概览

本版改善 Docker 路径挂载和表达式计算，并加快作业准备、缓存请求和大工作区作业的收尾。

## New Feature

- 经作业 Docker 套接字启动的容器可直接绑定挂载 `$PWD` 等作业路径，无需 `bind_workdir`。
- `exec` 的 `strategy`、`env`、`with`、`services` 和 `outputs` 字段支持整个值为 `${{ }}` 表达式。

## Performance

- 服务与作业容器并行启动，镜像只拉取一次；加快缓存请求及大工作区卷的作业完成速度。

## Bugfix / Security

- 修复 pnpm 的 `EXDEV` 和 `EBUSY` 错误，并在作业无法访问缓存服务器时直接向 Gitea 上传构件。
