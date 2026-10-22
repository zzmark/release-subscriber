---
title: Gitea Runner 5.2.1 更新总结
description: Gitea Runner 5.2.1 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Gitea Runner"
  version="5.2.1"
  date="2026-10-22"
  repository-url="https://gitea.com/gitea/runner"
  docs-url="https://docs.gitea.com/runner/"
  release-url="https://gitea.com/gitea/runner/releases/tag/v5.2.1"
/>

## 概览

Gitea Runner 5.2.1 改进工作流命令日志与敏感值遮蔽，修复部分采用代码分割的 Action 对 v2 缓存 API 的访问，并加快作业初始化、Action 准备和缓存处理。RPC 迁移兼容 connect v1、v2 的 Gitea 服务器，存储改为直接访问 bbolt，现有缓存仍可使用。

## Performance

- 优化作业初始化、Action 准备和缓存服务器；仅含一个步骤的 `exec` 耗时从 1.70 秒降至 0.87 秒。
- 缓存查询和清扫不再解码整个存储；用直接访问 bbolt 替代 bolthold，保留现有缓存兼容性。

## Bugfix / Security

- 隐藏 Runner 自行处理的工作流命令日志，例如 `::set-output::`，并避免对后置步骤命令重复记录日志。
- 即使其他步骤遗留的 `::stop-commands::` 仍生效，也在每一步注册 `::add-mask::` 的值。
- 修补 `rust-cache` v2.9.2、`setup-java` v6 和 `setup-deno` v2 等 Action 包，使其能够访问 v2 缓存 API。
- 迁移至 `connectrpc.com/connect/v2`，兼容 connect v1 和 v2 的 Gitea 服务器；移除无效代码并整合测试。
