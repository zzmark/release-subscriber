---
title: Gitea Runner 5.1.1 更新总结
description: Gitea Runner 5.1.1 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Gitea Runner"
  version="5.1.1"
  date="2026-10-16"
  repository-url="https://gitea.com/gitea/runner"
  docs-url="https://docs.gitea.com/runner/"
  release-url="https://gitea.com/gitea/runner/releases/tag/v5.1.1"
/>

## 概览

Gitea Runner 5.1.1 新增作业日志中 Runner 消息的独立级别设置，改为在每个作业中对每个 Action 仅下载一次归档，并支持重试和回退到 git。本版还修复 Action 分支或标签移动后的引用锁定与旧提交问题，以及容器移除缓慢时的网络清理问题；孤立的作业网络和卷改为在 10 分钟后回收。

## New Feature

- 新增 `runner.log_report_level`，独立于 `log.level` 设置作业日志中 Runner 消息的级别。

## Performance

- 每个作业中的每个 Action 仅以归档形式下载一次，支持下载重试，并可回退到 git。

## Bugfix / Security

- 修复 Action 分支或标签移动后出现 `cannot lock ref` 失败，以及仍使用旧提交的问题。
- 即使容器移除缓慢，也会移除作业网络。
- 孤立的作业网络和卷在 10 分钟后回收，不再采用 `workdir_cleanup_age`。
