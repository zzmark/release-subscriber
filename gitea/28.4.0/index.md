---
title: Gitea 28.4.0 更新总结
description: Gitea 28.4.0 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Gitea"
  version="28.4.0"
  date="2026-11-15"
  repository-url="https://github.com/go-gitea/gitea"
  docs-url="https://docs.gitea.com/"
  release-url="https://github.com/go-gitea/gitea/releases/tag/v28.4.0"
/>

## 概览

Gitea 28.4.0 改进了 WebSocket 客户端的同步，并修复了 Actions 条件判断、并发死锁和权限检查问题。此次更新按账户限制 TOTP 验证失败次数，防止拉取镜像向新主机复用旧凭据，并更新了受安全问题影响的 Brotli 依赖。

## Performance

- 修复下拉菜单 ARIA 补丁的内存泄漏，并减少仓库搜索响应中的提交状态字段。

## Bugfix / Security

- Actions API 支持仓库管理员权限。作业的 `if:` 条件判断会纳入同一轮处理内已完成的依赖作业。
- 并发更新语言统计或创建工单通知时避免死锁。推送钩子乱序执行时避免分支回退，并在 `git push` 返回前标记仓库为非空。
- 工单锁定和解锁按当前登录用户身份执行。API 对非组织成员隐藏组织角色，并禁止重命名 Owners 团队。搜索和里程碑视图会隐藏用户无权读取的工单类型。
- 按账户限制 TOTP 验证失败次数。拉取镜像切换到新主机时停止复用旧凭据。审计日志补记缺失的仓库和内容事件。
- 将 `github.com/andybalholm/brotli` 更新至 v1.2.7 以纳入安全修复，并升级 Docker 镜像中的 Alpine 基础软件包。
