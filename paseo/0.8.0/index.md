---
title: Paseo 0.8.0 更新总结
description: Paseo 0.8.0 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Paseo"
  version="0.8.0"
  date="2026-09-10"
  repository-url="https://github.com/getpaseo/paseo"
  docs-url="https://paseo.sh/"
  release-url="https://github.com/getpaseo/paseo/releases/tag/v0.8.0"
/>

## 概览

Paseo 0.8 集中扩展插件平台和多代理工作流：插件可提供自定义提供商、时间线组件、页眉按钮、编辑器胶囊按钮、模态框及终端能力；产品侧新增会话导入、侧栏定制、全屏 Mermaid 查看器和 Hub 后续任务。升级前需要注意，桌面应用最低系统版本提高到 macOS 13，面向 0.7 的插件须按迁移指南拆分客户端与服务端入口，并调整编辑器胶囊按钮 API。

## Breaking Change

- 桌面应用的最低系统要求提高到 macOS 13；macOS 12 不再接收桌面更新。
- 0.7 插件必须迁移为独立的客户端/服务端入口，并使用运行时对应的 SDK 导入路径。
- 编辑器胶囊按钮注册 API 改为 `button`、`registration.update()` 和 `registration.remove()`。
- `--host` 变为全局 CLI 选项；Hub 的组织级触发器迁移到 `.paseo/triggers/`。

## New Feature

- 插件现可定义自有提供商、设置、权限与时间线渲染，并提供生命周期钩子和新代理配置转换。
- 插件 SDK 新增自定义时间线组件、页眉按钮、编辑器胶囊按钮、模态框、终端管理、项目实时订阅、权限响应和用量查询。
- 新增会话导入及其搜索、分页和工作区筛选，并支持侧栏项目重排与显隐控制。
- 新增 Codex 问题回答表单、Hub 后续任务、提供商通知、全屏 Mermaid 查看器和 Web diff 上下文菜单。

## Performance

- 减少大型 diff 打开时的卡顿，并让移动端键盘切换更加平滑。
- 仅重新加载配置发生变化的提供商，同时移除空闲 SDK 连接中的非请求流量。
- 返回应用时立即重新连接全部主机，改善恢复使用时的连接体验。

## Bugfix / Security

- 修复 macOS 更新未安装、更新状态误报、Dock 图标尺寸及移动端终端键盘反复开合等客户端问题。
- 修复缓存列表、队列消息、Codex 归档后续任务、Pi 回合、模型选择与嵌套子代理关系等代理工作流问题。
- 修复会话导入、diff 滚动、Mermaid 渲染、Windows 文件监视器和 OpenCode 2 终端活动等问题。
- 限制守护进程 Git 命令使用仓库自定义 `core.fsmonitor`，避免执行仓库提供的外部命令。
