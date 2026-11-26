---
title: Paseo 0.17.5 更新总结
description: Paseo 0.17.5 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Paseo"
  version="0.17.5"
  date="2026-11-26"
  repository-url="https://github.com/getpaseo/paseo"
  docs-url="https://paseo.sh/"
  release-url="https://github.com/getpaseo/paseo/releases/tag/v0.17.5"
/>

## 概览

Paseo 0.17.5 支持批量归档工作区，并允许从设置直接为主机启用 Tailscale。桌面端可选择更新方式。使用独立 MCP 服务器的 OpenCode 2 智能体若要在共享 OpenCode 服务器运行时使用本次修复，需要 OpenCode 2.0.29 或更高版本。

## New Feature

- 在侧栏按住 Cmd 或 Ctrl 多选工作区，再一次归档。计划任务的 CLI 和 MCP 工具也支持「完成后归档」。
- 智能体配置有独立的设置页，并可在模型选择器和命令中心查找。添加项目时默认打开文件夹搜索，可切换到克隆或新建文件夹。
- 主机选择器显示连接类型和延迟。桌面端可设置自动下载更新、仅通知或从不检查。插件可在沙箱内运行智能体、终端和工作树命令。

## Performance

- 修复长时间运行时浮层响应变慢、打开包含大量工具调用的聊天时桌面端卡死，以及大型 Git 工作区扫描阻塞守护进程的问题。
- 修复单个 Git 仓库改动触发所有检出目录重新扫描，以及空闲插件会话每隔 10 秒唤醒守护进程的问题。

## Bugfix / Security

- 修复 Claude 子智能体等待后台任务时父智能体收到中间回复、监视拉取请求的智能体在轮次结束后仍显示运行中，以及插件重载后智能体工具失效的问题。
- 修复慢速网络加载大型时间线时直连中断，以及 iOS 聊天空白、Android 文本选择放大镜滞留和移动端弹层底部被系统栏遮挡的问题。
- Claude Code 2.1.326 或更高版本改用标准输入接收 MCP 服务器令牌。归档拉取请求工作树时，Paseo 修复了未批准初始化操作却执行仓库清理命令的问题。
