---
title: Gitea Runner 6.0.0 更新总结
description: Gitea Runner 6.0.0 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Gitea Runner"
  version="6.0.0"
  date="2026-11-11"
  repository-url="https://gitea.com/gitea/runner"
  docs-url="https://docs.gitea.com/runner/"
  release-url="https://gitea.com/gitea/runner/releases/tag/v6.0.0"
  release-blog-url="https://blog.gitea.com/release-of-runner-6.0.0/"
  release-blog-zh-url="./blog.zh"
/>

## 概览

Gitea Runner 6.0.0 要求 Gitea 1.26.2 或更高版本，并移除了 `builtin:checkout`。升级前请检查服务端版本和工作流中的检出步骤。本版还隔离了并发作业的工具缓存，修复了 IPv6、工作目录清理和作业取消问题。

## Breaking Change

- 将工作流中的 `builtin:checkout` 改为 `actions/checkout`。需要在无 Node 环境中运行时，可使用 [`taiki-e/checkout-action`](https://github.com/taiki-e/checkout-action)。[`builtin:checkout` 移除说明](https://gitea.com/gitea/runner/pulls/1407)
- 将 Gitea 服务端升级到 1.26.2 或更高版本。使用更早版本时，大多数作业日志会留在数据库的 `dbfs_data` 表中，未被归档。[最低版本要求](https://gitea.com/gitea/runner/pulls/1395)

## New Feature

- 启用 `runner.tool_cache_mode: shared` 时，每个并发作业使用独立的工具缓存，支持任意 `runner.capacity`。[工具缓存改进](https://gitea.com/gitea/runner/pulls/1401)
- 新注册的 Runner 默认带有 `ubuntu-26.04` 标签。macOS 用户可参考新增的 [launchd 示例](https://gitea.com/gitea/runner/src/branch/main/examples/launchd) 启动 Runner。

## Bugfix / Security

- 修复 Runner 启动时选用 IPv6 地址导致缓存和制品步骤失败的问题。
- 修复非 root Runner 无法清理含有归 root 所有的文件的 `container.bind_workdir` 工作目录的问题。
- 修复 `hashFiles()` 对数字、布尔值和 null 参数的处理，以及混合大小写或带缩进的 `::group::` 命令的处理。
- 修复 Docker 守护进程停止响应时作业取消后仍挂起的问题。
