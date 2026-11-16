---
title: Paseo 0.16.0 更新总结
description: Paseo 0.16.0 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Paseo"
  version="0.16.0"
  date="2026-11-16"
  repository-url="https://github.com/getpaseo/paseo"
  docs-url="https://paseo.sh/"
  release-url="https://github.com/getpaseo/paseo/releases/tag/v0.16.0"
/>

## 概览

Paseo 0.16.0 新增内置插件库和后台任务管理，改进移动端对话、命令中心及大型差异加载。使用插件库、后台任务、更改基准、撤销归档、后台智能体、插件订阅或 fx 时，需要同时更新主机和应用。

## Breaking Change

- 插件 SDK 移除了已弃用的 `agent.turn.after.timeline` 字段。依赖该字段的插件应调用 `timeline.refetch({ direction: "tail", limit: 1, wholeTurns: true })`，再按 `event.turnId` 筛选条目。
- 计划任务拒绝 `0/15 * * * *` 这类在单个数字后指定步长的表达式。cron 表达式同时指定月内日期和星期几时，任一字段匹配即可触发，已有计划应检查触发范围。

## New Feature

- 可在消息编辑区上方查看并停止 Claude Code、Codex 和 OpenCode v2 的后台任务。命令中心按工作区、文件和操作分标签页，搜索覆盖已归档工作区。
- 内置插件库支持直接安装和管理插件。插件可提供侧栏布局、消息编辑控件和实时事件订阅。
- 移动端接入实体键盘后支持桌面快捷键及自定义绑定。工作区归档后可在六秒内撤销。撤销只恢复工作区，移除工作树时删除的未提交文件无法恢复。

## Performance

- “变更”视图先显示文件树，分批加载大型差异，并优先于后台工作树扫描。命令和文件建议在大型列表中打开更快。
- 守护进程并发启动已配置的插件，并避免在每次工作区更新时重读所有已归档的历史记录。

## Bugfix / Security

- 修复移动端展开轮次摘要、待办卡片和工具组时的滚动定位问题，并修复多种对话恢复和历史加载故障。
- 停止或中断 Codex 轮次会停止该轮次启动的 shell 命令。Claude 轮次遇到 API 错误时正确标记失败，OpenCode 修复了守护进程重启后的重连问题。
- 修复连接恢复、远程终端输入、插件 RPC 和浏览器工具的问题，包括 `browser_fill` 未能更新 React 控件却报告成功的情况。
