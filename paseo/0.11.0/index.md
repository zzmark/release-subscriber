---
title: Paseo 0.11.0 更新总结
description: Paseo 0.11.0 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Paseo"
  version="0.11.0"
  date="2026-10-07"
  repository-url="https://github.com/getpaseo/paseo"
  docs-url="https://paseo.sh/"
  release-url="https://github.com/getpaseo/paseo/releases/tag/v0.11.0"
/>

## 概览

Paseo 0.11.0 引入插件注册表，扩展 Muse Code、Antigravity 和 OMP 支持，新增订阅用量页面与侧栏摘要，并补充插件 SDK 能力。本版本同时集中修复 Claude、Codex、ACP、OMP、Pi、OpenCode 集成，以及聊天、终端、工作区、远程连接和平板交互问题。

## Breaking Change

- `paseo plugin add owner/repo` 现在从插件注册表安装。直接从 GitHub 安装须使用 `github:owner/repo`，本地目录须使用 `./path` 等明确路径。
- OMP 审批模式的更改在下次空闲重启时生效，回合进行期间会被拒绝。

## New Feature

- 新增 Muse Code 提供商，支持模型、审批模式和推理强度控制；新增 Antigravity 提供商，通过 `agy` CLI 运行，始终使用完全访问权限。
- 新增订阅用量页面、可选侧栏摘要、账户登录凭据发现和不可用原因诊断，并支持 OpenCode Go 用量。
- OMP 支持回合进行期间引导、快速模式、自动思考级别，以及定时任务和 Hub 运行中的 MCP 服务器。
- 插件 SDK 新增页面和侧栏条目、用量数据源、进程管理、音频播放及 `agent.closed` 生命周期事件；插件清单支持展示名称、图标、截图和视频。
- 新增提供商默认选项配置、宽屏内容宽度设置、Vue 语法高亮，以及 iPad/Android 平板终端按键栏和粘贴操作。
- 改善上下文用量、模型速度菜单、资源管理器标签页、相对时间戳和侧栏显示；从远程分支创建工作区前先获取该分支。

## Bugfix / Security

- 修复 Claude 思考行、自动模式、后台辅助任务与子智能体卡片问题，以及模式恢复和用量重试时机。
- 修复 ACP 的 Windows CLI 启动、模型选择、归档关闭、权限请求及上下文用量显示问题。
- 修复 OMP 进程崩溃、模型回退、多选问题、上下文压缩、会话导入、工具结果、归档和错误状态；改善 Pi 会话、MCP 与子智能体完成状态。
- 修复 OpenCode 工具询问规则、启动和权限拒绝状态，修复 Codex Skill 重复、图像生成失败显示、命令审批、聊天回退、结构化输出和推理选项问题。
- 修复聊天滚动跳动、图片布局和复制、文件行链接、浏览器工具输入、非 ASCII 文件下载及多语言界面显示。
- 修复守护进程卡住、自更新、输出关闭导致的错误、工作区归档和脚本状态、远程 SSH 密码连接、中继重连及文件上传问题。
- 修复桌面和原生平板的窗口拖动、键盘、侧栏和上下文用量环交互，并修复插件安装、客户端包导入和 SDK 类型问题。
