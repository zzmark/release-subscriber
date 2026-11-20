---
title: Gitea Runner 6.0.1 更新总结
description: Gitea Runner 6.0.1 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Gitea Runner"
  version="6.0.1"
  date="2026-11-20"
  repository-url="https://gitea.com/gitea/runner"
  docs-url="https://docs.gitea.com/runner/"
  release-url="https://gitea.com/gitea/runner/releases/tag/v6.0.1"
/>

## 概览

Gitea Runner 6.0.1 修复主机模式误删目录、作业超时后未执行清理步骤等问题。工作流和作业可配置缓存模式，使用该功能需要 Gitea 29.0.0 或更高版本。

## New Feature

- 工作流和作业支持 `cache-mode`，需要 Gitea 29.0.0 或更高版本。
- 可将 `ACTIONS_STEP_DEBUG` 设为仓库变量，启用步骤调试日志。

## Bugfix / Security

- 只有 `push`、`schedule` 和 `workflow_dispatch` 触发的运行可以在默认分支上保存缓存。
- 修复主机模式下作业会删除 `container.workdir_parent` 下无关目录的问题。取消主机模式步骤时先发送 SIGINT，使 `trap` 处理程序得以执行。
- 作业超时后仍执行 `always()` 和 `cancelled()` 步骤。修复环境和路径上下文为空、远程复合 Action 读取输入失败、容器端口未发布等问题。
- 修复轮询退避无法禁用及 FreeBSD 磁盘空间误判。
