---
title: Gitea Runner 3.3.1 更新总结
description: Gitea Runner 3.3.1 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Gitea Runner"
  version="3.3.1"
  date="2026-08-26"
  repository-url="https://gitea.com/gitea/runner"
  docs-url="https://docs.gitea.com/runner/"
  release-url="https://gitea.com/gitea/runner/releases/tag/v3.3.1"
/>

## 概览

本版重点限制工作流容器选项的主机访问能力，并扩大密钥遮盖范围。升级前应检查工作流是否使用受限的容器参数，以及是否依赖从 Runner 环境读取变量或传递包含密钥的作业输出。

## Breaking Change

- 工作流不能再通过 `container.options` 设置 `--env-file`、`--label-file` 或卷驱动选项；单独使用 `--env NAME` 也不再读取 Runner 环境变量。
- 包含密钥的作业输出会被跳过，下游读取该输出将得到空值。
- 从源码构建 Runner 现在需要 Go 1.27。

## Bugfix / Security

- 在日志、调试输出、作业总结、输出及容器名称等路径遮盖密钥，同时保留管理员设置的容器选项。
- 修复步骤输入混淆、服务容器卷被忽略、日志归属不准确，以及矩阵展开失败却报告成功的问题。
