---
title: Gitea Runner 5.2.3 更新总结
description: Gitea Runner 5.2.3 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Gitea Runner"
  version="5.2.3"
  date="2026-10-26"
  repository-url="https://gitea.com/gitea/runner"
  docs-url="https://docs.gitea.com/runner/"
  release-url="https://gitea.com/gitea/runner/releases/tag/v5.2.3"
/>

## 概览

Gitea Runner 5.2.3 修复 Action 日志分组、共享缓存损坏和试运行访问 Docker 守护进程的问题，并对齐多项工作流执行行为。该版本还更新依赖并改进测试与 CI 缓存。

## Performance

- 加快测试与 CI 设置过程：上游记录的 CI 测试中，`act/runner` 从 77 秒缩短至 55 秒，`test-dind` 从 108 秒缩短至 55 秒；本地不使用 Docker 的 `act/runner` 测试从 53 秒缩短至 7 秒（[#1349](https://gitea.com/gitea/runner/pulls/1349)）。这些数据针对测试执行。

## Bugfix / Security

- Action 运行前关闭标题日志分组，避免 Action 自身的日志分组使前面的输出一直隐藏；标题信息、输入默认值以及 pre/post 阶段的日志展示也与 actions/runner 对齐（[#1345](https://gitea.com/gitea/runner/pulls/1345)）。
- 试运行不再访问 Docker 守护进程，修复创建／移除作业网络、清理时丢失试运行上下文，以及容器模拟获取架构时访问 Docker 的问题（[#1349](https://gitea.com/gitea/runner/pulls/1349)）。
- 工具包补丁仅修改作业容器内的副本，保持共享 Action 缓存的解压目录不变；记录文件大小并在发现目录树损坏时重新获取，离线模式也会重新获取已确认损坏的目录。旧 Runner 留下的无记录目录会重新下载一次，离线模式则继续使用（[#1352](https://gitea.com/gitea/runner/pulls/1352)）。
- 对齐环境文件、输入参数、pre/post 步骤、环境变量和超时处理；修复 Docker 错误被吞掉、取消时进程树未终止、缓存和产物处理、Windows 主机及 CLI 问题，并加强代理密码和密钥的日志掩码（[#1338](https://gitea.com/gitea/runner/pulls/1338)）。
- 更新依赖，并在 CI 中接入 Gitea 的 cache-seeder（[#1351](https://gitea.com/gitea/runner/pulls/1351)、[#1350](https://gitea.com/gitea/runner/pulls/1350)）。
