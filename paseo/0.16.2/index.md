---
title: Paseo 0.16.2 更新总结
description: Paseo 0.16.2 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Paseo"
  version="0.16.2"
  date="2026-11-18"
  repository-url="https://github.com/getpaseo/paseo"
  docs-url="https://paseo.sh/"
  release-url="https://github.com/getpaseo/paseo/releases/tag/v0.16.2"
/>

## 概览

Paseo 0.16.2 修复归档工作区时丢失提交、桌面端更新后旧守护进程继续运行，以及变更执行权限后 Hub 断开连接的问题。

## Performance

- Git 文件监视器超时后停止反复扫描大型仓库。创建工作树时避免扫描未在 `.worktreeinclude` 中列出的大型忽略目录。

## Bugfix / Security

- 归档工作区时保留分离 HEAD 状态下的工作树提交。`paseo workspace create --path .` 按调用者的当前目录解析路径。
- 桌面端更新会处理旧会话启动的旧守护进程，渲染进程意外退出后不会一直显示空白窗口。单条主机记录读取失败也不会导致已保存的主机消失。
- 修复 Claude 后台任务通知触发的回复折叠问题，以及 Steer 中断上下文压缩的问题。MCP 现在会返回空闲智能体的后台任务信息。
- 修复 AFS 等文件系统拒绝创建 Unix 套接字时无法打开终端的问题，并修复文件下载失败和导入会话时的界面问题。
