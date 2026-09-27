---
title: Gitea Runner 3.3.2 更新总结
description: Gitea Runner 3.3.2 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Gitea Runner"
  version="3.3.2"
  date="2026-08-31"
  repository-url="https://gitea.com/gitea/runner"
  docs-url="https://docs.gitea.com/runner/"
  release-url="https://gitea.com/gitea/runner/releases/tag/v3.3.2"
/>

## 概览

本版加强工作流环境变量与密钥处理，并修复作业状态、复合 Action 和 Node Action 的行为。

## Breaking Change

- 工作流不能再通过 `$GITHUB_ENV` 或 `::set-env::` 设置 `NODE_OPTIONS`。

## New Feature

- `exec` 可使用 `--input` 和 `--input-file` 传递工作流声明的输入。

## Bugfix / Security

- 遮盖密钥的编码形式，避免其以明文出现在日志中。
- 修正作业状态报告、复合 Action 表达式与输入隔离，以及容器环境变量优先级。
