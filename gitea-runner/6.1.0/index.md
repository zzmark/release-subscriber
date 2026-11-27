---
title: Gitea Runner 6.1.0 更新总结
description: Gitea Runner 6.1.0 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Gitea Runner"
  version="6.1.0"
  date="2026-11-27"
  repository-url="https://gitea.com/gitea/runner"
  docs-url="https://docs.gitea.com/runner/"
  release-url="https://gitea.com/gitea/runner/releases/tag/v6.1.0"
/>

## 概览

Gitea Runner 6.1.0 默认使用固定版本的 Node.js 24 执行 JavaScript Action 和 `hashFiles()`。本版增加 Action 引用重写和 Linux 主机作业固定路径配置，并修复复合 Action 中已遮蔽的值可能重新显示的问题。

## New Feature

- 可用 `runner.node_version` 选择 Node.js 版本，也可通过 `runner.node_download: false` 使用 `PATH` 中已有的 `node`。
- `runner.action_replacements` 可重写步骤的 `uses` 引用。Linux 主机作业可用 `host.stable_workdir` 为每个仓库设置固定工作路径。
- Docker Action 可加入作业网络来访问作业服务，步骤摘要会在每个步骤结束时上传。

## Bugfix / Security

- 验证固定的 Action 提交 SHA，并修复复合 Action 意外显示此前已遮蔽的值的问题。
- 修复 Docker Swarm 上传构建产物超时、可复用工作流相对路径无效、Git 进程中断后缓存被锁，以及错误复用其他平台的缓存镜像等问题。
